<template>
  <section class="app-container">
    <el-dialog
      :visible.sync="dialogVisible"
      title="手动创建订单"
      :fullscreen="true"
      :before-close="handleClose">
      <el-row>
        <el-card>
          <el-col :span="10" style="padding: 0 20px;">
            <h3>基本信息</h3>
            <el-form :model="value" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
              <el-form-item label="平台">
                <el-select v-model="value.platform" placeholder="请选择平台" style="width: 300px" @change="changePlatform">
                  <el-option v-for="item in orderPlatform" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="订单号" prop="order_no">
                <div v-if="value.platform === 1 || value.platform === 10 || value.platform === 11">
                  <el-input v-model="value.order_no" style="width: 300px">
                    <template v-if="value.platform === 1" slot="prepend">ins</template>
                    <template v-else-if="value.platform === 10" slot="prepend">mic</template>
                     <template v-else-if="value.platform === 11" slot="prepend">dlz</template>
                  </el-input>
                  <el-button @click="generateOrderOn">自动生成</el-button>
                </div>

                <el-input v-else v-model="value.order_no" @input="refDhOrder()" style="width: 300px" placeholder="关联敦煌订单号"></el-input>
              </el-form-item>

              <el-form-item label="店铺" prop="shop_id">
                <el-select v-model="value.shop_id" filterable placeholder="请选择店铺" :clearable="true" :disabled="value.platform === 0">
                  <el-option
                    v-for="item in shops[value.platform]"
                    :key="item.id"
                    :label="item.shop"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="买家昵称" prop="buyer_id">
                <el-select
                  v-model="value.buyer_nick_name"
                  filterable
                  remote
                  reserve-keyword
                  allow-create
                  placeholder="请输入买家昵称"
                  :remote-method="remoteMethod"
                  :loading="loading"
                  @change="selectBuyer"
                  :disabled="value.platform === 0">
                  <el-option
                    v-for="item in buyerOptions"
                    :key="item.buyer_id"
                    :label="item.buyer_nick_name"
                    :value="item.buyer_id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="联系方式" prop="telephone">
                <el-input v-model="value.telephone" style="width: 300px"></el-input>
              </el-form-item>

              <el-form-item label="运费" prop="shipping_cost">
                <el-input v-model="value.shipping_cost" style="width: 300px" oninput="if(value){value=value.replace(/[^\d\.]/g,'')} if(value<0){value=''} if(value>10000){value=10000}" :disabled="value.platform === 0"></el-input> 美元
              </el-form-item>

              <el-form-item label="订单总金额" prop="order_total_price">
                <el-input v-model="value.order_total_price" style="width: 300px"  oninput="if(value){value=value.replace(/[^\d\.]/g,'')} if(value<=0){value=''} if(value>10000){value=10000}" :disabled="value.platform === 0"></el-input> 美元
              </el-form-item>

              <el-form-item label="实收金额" prop="actual_price">
                <el-input v-model="value.actual_price" style="width: 300px"  oninput="if(value){value=value.replace(/[^\d\.]/g,'')} if(value<=0){value=''} if(value>10000){value=10000}" :disabled="value.platform === 0"></el-input> 美元
              </el-form-item>

              <el-form-item v-if="value.platform !== 0" label="付款方式" prop="pay_method">
                <el-select v-model="value.pay_method" placeholder="请选择">
                  <el-option
                    v-for="item in payMethods"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>

                <el-popover
                  width="300"
                  trigger="click">
                  <el-input v-model="newPayMethod" placeholder="输入付款方式"></el-input>
                  <el-button size="mini" type="primary" @click="savePayMethod" style="margin-top: 10px;">保存</el-button>

                  <el-button slot="reference">添加方式</el-button>
                </el-popover>
              </el-form-item>

              <el-form-item label="截止发货日期" prop="delivery_deadline">
                <el-date-picker
                  v-model="value.delivery_deadline"
                  type="date"
                  placeholder="选择日期"
                  :disabled="value.platform === 0">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="14" style="padding: 0 20px;">
            <h3>收货地址&nbsp;&nbsp;<el-button v-if="value.platform !== 0" @click="handleAddAddress" type="primary" size="mini">新增地址</el-button></h3>
            <el-table
              v-if="value.platform !== 0"
              :data="addressData"
              border
              style="width: 100%;max-height: 300px;overflow-y: auto;margin-bottom: 20px;"
              >
              <el-table-column
                prop="first_name"
                label="收件人">
                <template slot-scope="scope">{{ scope.row.first_name }} {{ scope.row.last_name }}</template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="地址">
                <template slot-scope="scope">{{ scope.row.address_line1 }} {{ scope.row.address_line2 }},{{ scope.row.city }},{{ scope.row.state }},{{ scope.row.country }}</template>
              </el-table-column>
              <el-table-column
                prop="postalcode"
                label="邮编">
              </el-table-column>
              <el-table-column
                prop="telephone"
                label="联系电话">
              </el-table-column>
              <el-table-column
                label="操作">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.is_cur !== 1" @click="handleUseAddress(scope.row)" type="text">使用</el-button>
                  <el-button @click="handleEditAddress(scope.row)" type="text">修改</el-button>
                  <el-button @click="handleDelAddress(scope.row.id)" type="text">删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <span v-if="this.value.address != undefined && this.value.address.first_name !== ''">
              {{ this.value.address.first_name }} {{ this.value.address.last_name }}<br>
              {{ this.value.address.address_line1 }}, {{ this.value.address.city }}, {{ this.value.address.state }}, {{ this.value.address.country }}<br>
              {{ this.value.address.postalcode }}<br>
              {{ this.value.address.telephone }}
            </span>
          </el-col>
        </el-card>
      </el-row>

      <el-row>
        <el-card>
          <el-col style="margin-bottom: 20px;">
            <h3>产品信息&nbsp;&nbsp;<el-button type="primary" @click="handleSelectCommodity">选择产品</el-button>&nbsp;&nbsp;<router-link target="_blank" :to="{path:'/commodity/index'}"><el-button type="primary">新增产品</el-button></router-link></h3>
            <el-table
              :data="goodsData"
              border
              style="width: 100%">
              <el-table-column
                prop="item_name"
                label="商品名称">
              </el-table-column>
              <el-table-column
                prop="item_image"
                label="商品图">
                <template slot-scope="scope">
                  <img :src="scope.row.item_image[0]" width="150" height="150">
                </template>
              </el-table-column>
              <el-table-column
                prop="item_attr"
                label="商品属性">
                <template slot-scope="scope">
                  <el-input type="textarea" style="margin-bottom: 10px;width: 100%;" placeholder="请输入内容" v-model="scope.row.item_attr"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="item_price"
                label="单价">
                <template slot-scope="scope">
                  <el-input placeholder="" v-model="scope.row.item_price"/>
                </template>
              </el-table-column>
              <el-table-column
                prop="item_count"
                label="数量"
                width="150">
                <template slot-scope="scope">
                  <el-input-number size="small" v-model="scope.row.item_count" :min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                label="合计"
                width="120">
                <template slot-scope="scope">$ {{ parseFloat(scope.row.item_price) * parseFloat(scope.row.item_count) }}</template>
              </el-table-column>
              <el-table-column
                prop="mine_remark"
                label="备注">
                <template slot-scope="scope">
                  <el-input type="textarea" style="margin-bottom: 10px;width: 100%;" placeholder="请输入内容" v-model="scope.row.mine_remark"/>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button type="text" @click="delGoods(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-card>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="makeOrder()">创建订单</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </span>
    </el-dialog>

    <!--新增/编辑地址-->
    <el-dialog title="修改地址" :visible.sync="dialogAddressForm" :close-on-click-modal="false" :show-close="false" width="900px">
      <el-form :model="addressForm" label-width="180px" :rules="addressFormRules" ref="addressForm">
        <el-form-item label="收货人姓名" prop="last_name">
          <el-input v-model="addressForm.last_name" placeholder="名" style="width:250px"></el-input>
          <el-input v-model="addressForm.first_name" placeholder="姓" style="width:250px"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="addressForm.address_line1" placeholder="详细地址1" style="width:500px;margin-top:5px"></el-input>
          详细地址<br />
          <el-input v-model="addressForm.city" placeholder="市" style="width:500px;margin-top:5px"></el-input> 市<br />
          <el-input v-model="addressForm.state" placeholder="州 / 省" style="width:500px;margin-top:5px"></el-input> 州 /
          省<br />
<!--          <el-input v-model="addressForm.country" placeholder="国家" style="width:500px;margin-top:5px"></el-input> 国家<br />-->
          <el-select style="width: 500px" filterable  v-model="addressForm.country" placeholder="请选择国家">
            <el-option
              v-for="item in delivery_country"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>国家<br />
        </el-form-item>
        <el-form-item label="邮编" prop="postalcode">
          <el-input v-model="addressForm.postalcode" auto-complete="off" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input v-model="addressForm.telephone" auto-complete="off" style="width:200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="resetAddressForm()">取消</el-button>
        <el-button type="primary" @click="saveAddress()" :loading="addressing">提交</el-button>
      </div>
    </el-dialog>
    <!--选择商品库-->
    <SelectCommodity @db-click="selectCommodityRef" ref="SelectCommodity"></SelectCommodity>
  </section>
</template>

<script>
  import SelectCommodity from '@/components/erp-order/select-commodity'
  import {
    allShopList
  } from '@/api/shop'
  import {
    addPayMethods,
    getPayMethods,
    getComsumerInfo,
    getComsumerAddr,
    saveComsumerAddr,
    delComsumerAddr,
    useComsumerAddr,
    makeOrder,
    getOne,
    config
  } from '@/api/order'
  import {
    makeOrder as aftermarketMakeOrder
  } from '@/api/aftermarket'
  import {
    makeOrder as operateMakeOrder
  } from '@/api/operate'
  import {
    makeOrder as warehouseMakeOrder
  } from '@/api/warehouse'

  export default {
    components: {
      SelectCommodity
    },
    name: 'erpOrder',
    props: {
      from_name: {
        tyep: String,
        default: 'order'
      },
      value: {
      }
    },
    data() {
      return {
        dialogVisible: false,
        addressData: [],
        goodsData: [],

        orderPlatform: [],
        shops: [],
        payMethods: [],
        selectCommodityForm: {},

        rules: {
          order_no: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
          shop_id: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
          buyer_nick_name: [{ required: true, message: '请输入买家昵称', trigger: 'blur' }],
          telephone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
          shipping_cost: [{ required: true, message: '请输入运费', trigger: 'blur' }],
          order_total_price: [{ required: true, message: '请输入订单金额', trigger: 'blur' }],
          actual_price: [{ required: true, message: '请输入实收金额', trigger: 'blur' }],
          pay_method: [{ required: true, message: '选择付款方式', trigger: 'change' }],
          delivery_deadline: [{ required: true, message: '选择截止发货日期', trigger: 'blur' }]
        },

        newPayMethod: '',

        loading: false,
        buyerOptions: [],

        addressing: false,
        dialogAddressForm: false,
        addressForm: {
        },
        addressFormRules: {
          first_name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          last_name: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          address_line1: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          state: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          city: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          country: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          postalcode: [{ required: true, message: '该项不能为空', trigger: 'blur' }],
          telephone: [{ required: true, message: '该项不能为空', trigger: 'blur' }]
        },
        delivery_country: []
      }
    },
    methods: {
      changePlatform() {
        this.value.shop_id = ''
        this.value.buyer_nick_name = ''
        this.value.buyer_id = ''
        this.value.pay_method = ''
        this.value.address = {
          first_name: '',
          last_name: '',
          address_line1: '',
          address_line2: '',
          state: '',
          country: '',
          city: '',
          postalcode: '',
          telephone: ''
        }
        this.$refs['ruleForm'].resetFields()
      },
      refDhOrder() {
        if (this.value.order_no === undefined || this.value.order_no === '') {
          return
        }

        getOne({ order_no: this.value.order_no }).then(res => {
          this.value.shop_id = res.list.shop_id
          this.value.buyer_nick_name = res.list.buyer_nick_name
          this.value.buyer_id = res.list.buyer_id
          this.value.order_total_price = res.list.order_total_price
          this.value.telephone = res.list.telephone
          this.value.shipping_cost = res.list.shipping_cost
          this.value.order_total_price = res.list.order_total_price
          this.value.actual_price = res.list.actual_price
          this.value.pay_method = -1
          this.value.delivery_deadline = res.list.delivery_deadline.split(' ')[0]
          this.value.address = {
            first_name: res.list.first_name,
            last_name: res.list.last_name,
            address_line1: res.list.address_line1,
            address_line2: res.list.address_line2,
            state: res.list.state,
            country: res.list.country,
            city: res.list.city,
            postalcode: res.list.postalcode,
            telephone: res.list.telephone
          }

          console.log(this.value)
        })
      },
      resetComponent() {
        this.resetAddressForm()
        this.dialogVisible = false
        this.goodsData = []
        this.addressData = []
      },
      cancel() {
        this.resetComponent()
      },
      makeOrder() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.value.buyer_id === '' || this.value.buyer_id < 0) {
              this.$message({
                type: 'error',
                message: '买家昵称，需要选择下拉框里的值'
              })
              return
            }
            if (this.goodsData.length > 0) {
              for (var i = 0; i < this.goodsData.length; i++) {
                if (this.goodsData[i].item_attr === '') {
                  this.$message({
                    type: 'error',
                    message: '产品属性不能为空'
                  })
                  return
                }

                if (this.goodsData[i].item_price <= 0) {
                  this.$message({
                    type: 'error',
                    message: '产品单价不能小于0'
                  })
                  return
                }
              }
            }

            this.value.products = this.goodsData
            if (this.from_name === 'order') {
              makeOrder(this.value).then(res => {
                this.$message({
                  type: 'success',
                  message: '创建成功'
                })
                this.resetComponent()
              })
            } else if (this.from_name === 'aftermarket') {
              aftermarketMakeOrder(this.value).then(res => {
                this.$message({
                  type: 'success',
                  message: '创建成功'
                })
                this.resetComponent()
              })
            } else if (this.from_name === 'operate') {
              operateMakeOrder(this.value).then(res => {
                this.$message({
                  type: 'success',
                  message: '创建成功'
                })
                this.resetComponent()
              })
            } else if (this.from_name === 'warehouse') {
              warehouseMakeOrder(this.value).then(res => {
                this.$message({
                  type: 'success',
                  message: '创建成功'
                })
                this.resetComponent()
              })
            }
          }
        })
      },
      handleDelAddress(id) {
        this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delComsumerAddr({ id: id }).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.refreshComsumerAddr()
          })
        }).catch(() => {
        })
      },
      saveAddress() {
        this.addressForm.buyer_id = this.value.buyer_id
        if (this.addressForm.address_line1 === '') {
          this.$message({
            type: 'error',
            message: '详细地址不能为空'
          })
          return
        }
        if (this.addressForm.state === '') {
          this.$message({
            type: 'error',
            message: '州/省不能为空'
          })
          return
        }
        if (this.addressForm.country === '') {
          this.$message({
            type: 'error',
            message: '国家不能为空'
          })
          return
        }
        if (this.addressForm.city === '') {
          this.$message({
            type: 'error',
            message: '市不能为空'
          })
          return
        }

        this.addressing = true
        saveComsumerAddr(this.addressForm).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }

          this.refreshComsumerAddr()
          this.resetAddressForm()
          this.addressing = false
        }).catch(e => {
          this.resetAddressForm()
          this.addressing = false
        })
      },
      resetAddressForm() {
        this.addressForm = {}
        this.dialogAddressForm = false
      },
      handleAddAddress() {
        if (this.value.buyer_id === '' || this.value.buyer_id === undefined) {
          this.$message({
            message: '请先选择买家昵称',
            type: 'error'
          })
          return
        }
        this.dialogAddressForm = true
        this.addressForm = {}
      },
      handleEditAddress(row) {
        if (this.value.buyer_id === '' || this.value.buyer_id === undefined) {
          this.$message({
            message: '请先选择买家昵称',
            type: 'error'
          })
          return
        }
        this.dialogAddressForm = true
        this.addressForm = row
      },
      handleUseAddress(row) {
        useComsumerAddr({ id: row.id, buyer_id: this.value.buyer_id }).then(res => {
          this.refreshComsumerAddr()
          this.value.address = {
            first_name: row.first_name,
            last_name: row.last_name,
            address_line1: row.address_line1,
            address_line2: row.address_line2,
            state: row.state,
            country: row.country,
            city: row.city,
            postalcode: row.postalcode,
            telephone: row.telephone
          }
        })
      },
      selectBuyer(buyerId) {
        this.value.buyer_id = buyerId

        this.buyerOptions.map(item => {
          if (item.buyer_id === buyerId) {
            this.value.telephone = item.telephone
            this.value.buyer_nick_name = item.buyer_nick_name
          }
        })

        getComsumerAddr({ buyer_id: buyerId, platform: this.value.platform }).then(res => {
          this.addressData = res.list
          this.value.buyer_id = res.buyerId

          res.list.map(item => {
            if (item.is_cur === 1) {
              this.value.address = {
                first_name: item.first_name,
                last_name: item.last_name,
                address_line1: item.address_line1,
                address_line2: item.address_line2,
                state: item.state,
                country: item.country,
                city: item.city,
                postalcode: item.postalcode,
                telephone: item.telephone
              }
            }
          })
        })
      },
      refreshComsumerAddr() {
        getComsumerAddr({ buyer_id: this.value.buyer_id, platform: this.value.platform }).then(res => {
          this.addressData = res.list
          this.value.buyer_id = res.buyerId
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true
          getComsumerInfo({ buyer_nick_name: query }).then(res => {
            this.buyerOptions = res.list
            this.loading = false
          })
        } else {
          this.options = []
        }
      },
      delGoods(index) {
        this.goodsData.splice(index, 1)
      },
      selectCommodityRef(row) {
        this.goodsData.push({
          commodity_id: row.id,
          item_name: row.name,
          item_image: [row.image],
          item_attr: '',
          item_price: 0,
          item_count: 0,
          mine_remark: ''
        })
      },
      handleSelectCommodity() {
        this.$refs['SelectCommodity'].handleSelectCommodity()
      },
      savePayMethod() {
        addPayMethods({ name: this.newPayMethod }).then(res => {
          this.newPayMethod = ''
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.payMethodList()
        })
      },
      handleClose() {
        this.dialogVisible = false
      },
      generateOrderOn() {
        var timestamp = new Date().getTime()
        this.value.order_no = String(timestamp).slice(1, 10)
      },
      payMethodList() {
        getPayMethods().then(res => {
          this.payMethods = res.list
        })
      },
      orderConfig() {
        config().then(res => {
          this.delivery_country = res.countrys
        })
      }
    },
    watch: {
      value: function() {
        if (this.value.type === 'add') {
          this.dialogVisible = true
        }
      }
    },
    mounted() {
      // console.log(this.from_name)
      this.payMethodList()
      this.orderConfig()
      var params = {
        user_id: 1,
        role_key: 1,
        work_time: 1
      }
      allShopList(params).then(res => {
        this.shops = res.shops
        this.orderPlatform = res.orderPlatform
      })
    }
  }
</script>

<style scoped>
</style>
