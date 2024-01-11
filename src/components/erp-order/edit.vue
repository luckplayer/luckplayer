<template>
  <section class="app-container">
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改订单基本信息"
      width= "600px"
      :before-close="handleClose">
      <el-form :model="value" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="平台" prop="platform">
          <el-select v-model="value.platform" placeholder="请选择平台" style="width: 300px" disabled>
            <el-option v-for="item in orderPlatform" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单号" prop="order_no">
          <el-input v-model="value.order_no" style="width: 300px" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="店铺" prop="shop_name">
          <el-input v-model="value.shop_name" style="width: 300px" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="买家昵称" prop="buyer_nick_name">
          <el-input v-model="value.buyer_nick_name" style="width: 300px" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="联系方式" prop="telephone">
          <el-input v-model="value.telephone" style="width: 300px"></el-input> (非收货人联系电话)
        </el-form-item>

        <el-form-item label="运费" prop="shipping_cost">
          <el-input v-model="value.shipping_cost" style="width: 300px"></el-input> 美元
        </el-form-item>

        <el-form-item label="订单总金额" prop="order_total_price">
          <el-input v-model="value.order_total_price" style="width: 300px"></el-input> 美元
        </el-form-item>

        <el-form-item label="实收金额" prop="actual_price">
          <el-input v-model="value.actual_price" style="width: 300px"></el-input> 美元
        </el-form-item>

        <el-form-item label="付款方式" prop="pay_method">
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
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editErpOrder()">保存</el-button>
        <el-button @click="cancel()">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
  import {
    allShopList
  } from '@/api/shop'
  import {
    addPayMethods,
    getPayMethods,
    editOrder
  } from '@/api/order'
  import {
    editOrder as aftermarketEditOrder
  } from '@/api/aftermarket'
  import {
    editOrder as operateEditOrder
  } from '@/api/operate'
  import {
    editOrder as warehouseEditOrder
  } from '@/api/warehouse'
  export default {
    name: 'erpOrderEdit',
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

        shops: [],
        orderPlatform: [],

        rules: {
          telephone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
          shipping_cost: [{ required: true, message: '请输入运费', trigger: 'blur' }],
          order_total_price: [{ required: true, message: '请输入订单金额', trigger: 'blur' }],
          actual_price: [{ required: true, message: '请输入实收金额', trigger: 'blur' }],
          pay_method: [{ required: true, message: '选择付款方式', trigger: 'change' }],
          delivery_deadline: [{ required: true, message: '选择截止发货日期', trigger: 'blur' }]
        },

        newPayMethod: '',
        payMethods: []
      }
    },
    watch: {
      value: function() {
        if (this.value.type === 'edit') {
          this.dialogVisible = true
        } else {
          this.dialogVisible = false
        }
      }
    },
    methods: {
      // 给父组件广播事件
      handleRowDblclick() {
        this.$emit('click', 1)
      },
      editErpOrder() {
        if (this.from_name === 'order') {
          editOrder(this.value).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleRowDblclick()
            this.handleClose()
          })
        } else if (this.from_name === 'aftermarket') {
          aftermarketEditOrder(this.value).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleRowDblclick()
            this.handleClose()
          })
        } else if (this.from_name === 'operate') {
          operateEditOrder(this.value).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleRowDblclick()
            this.handleClose()
          })
        } else if (this.from_name === 'warehouse') {
          warehouseEditOrder(this.value).then(res => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.handleRowDblclick()
            this.handleClose()
          })
        }
      },
      cancel() {
        this.handleClose()
      },
      handleClose() {
        this.dialogVisible = false
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
      payMethodList() {
        getPayMethods().then(res => {
          this.payMethods = res.list
        })
      }
    },
    mounted() {
      this.payMethodList()

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

<style>
</style>
