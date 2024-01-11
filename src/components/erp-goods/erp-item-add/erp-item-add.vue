<template>
  <section class="app-container">
    <el-collapse>
      <el-collapse-item title="产品基本信息" name="1">
        <el-card>
          <el-form ref="baseInfo" label-width="120px">
            <!-- <el-form-item label="所属分类" :rules="[
              { required: true, message: '请选择所属分类', trigger: 'blur' }]">
              <el-cascader size='mini' v-model="updateItemForm.catePubId" :options="cateList" style="width: 500px;"
                @change="changeCategoryAttributes"></el-cascader>
            </el-form-item> -->

            <el-form-item label="产品标题" :rules="[
              { required: true, message: '请输入产品标题', trigger: 'blur' },
              { min: 1, max: 140, message: '长度在 1 到 140 个字符', trigger: 'blur' }
            ]">
              <el-input class="inline-input" size='mini' v-model="updateItemForm.itemBase.itemName" @blur="checkTitle"
                placeholder="请输入产品标题" style="width:100%" :clearable='true'></el-input>
            </el-form-item>
            <el-form-item label="产品关键词">
              <el-col :span="7" style="margin-right:5px">
                <el-input size='mini' class="inline-input" v-model="updateItemForm.itemBase.keyWord1" style="width:100%"
                  :clearable='true'></el-input>
              </el-col>
              <el-col :span="7" style="margin-right:5px">
                <el-input size='mini' class="inline-input" v-model="updateItemForm.itemBase.keyWord2" style="width:100%"
                  :clearable='true'></el-input>
              </el-col>
              <el-col :span="7">
                <el-input size='mini' class="inline-input" v-model="updateItemForm.itemBase.keyWord3" style="width:100%"
                  :clearable='true'></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="产品基本属性" :rules="[
              { required: true, message: '请选择产品基本属性', trigger: 'blur' }
            ]">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px" v-for="(categoryPubAttr,index) in categoryPubAttrOptions"
                  :key="index">
                  <erp-item-attr :categoryPubAttr="categoryPubAttr" :itemAttrList="initItemAttrList(categoryPubAttr.attr_id)"
                    :shopId="shopId" v-if="categoryPubAttr.buy_attr == 0" @value="onAttrChange"></erp-item-attr>
                </el-form>

                <!-- 添加自定义属性 start-->
                <el-form-item v-for="(item, index) in this.updateItemForm.itemAttrList" :key='index' label="自定义属性" v-if="item.lineAttrNameCn != null && item.lineAttrNameCn === '自定义属性'">
                  <el-row v-for="(value, i) in item.itemAttrValList" :key="i" style="margin-bottom:10px">
                    <el-col :span="6" style="margin-right:10px">
                      <el-input v-model="value.attrName"></el-input>
                    </el-col>
                    <el-col :span="6">
                      <el-input v-model="value.lineAttrvalName"></el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-button size="mini" type="danger" @click="delItemAttrList(i)" style="margin-left:10px">删除</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-button size="mini" type="primary" @click="addItemAttrList" style="margin-left:120px">+ 添加自定义属性</el-button>
                <!-- 添加自定义属性 end-->
              </el-card>
            </el-form-item>
            <el-form-item label="产品规格" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px">
                  <div v-for="(categoryPubAttr,index) in categoryPubAttrOptions" :key="index">
                    <erp-item-attr :categoryPubAttr="categoryPubAttr" :itemAttrList="initItemAttrList(categoryPubAttr.attr_id)"
                      :shopId="shopId" v-if="categoryPubAttr.buy_attr == 1" @value="onAttrChange"></erp-item-attr>
                  </div>
                </el-form>
              </el-card>
            </el-form-item>
            <el-form-item label="自定义规格" style="margin-top:10px" class="mini-table">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px">
                  <el-table :data="updateItemForm.itemSpecSelfDefList" border style="width: 100%" size="mini">
                    <el-table-column label="自定义规格名称" prop="attrValName">
                      <template slot-scope="scope">
                        <el-row>
                          <el-col :span="12">
                            <el-input size="mini" v-model="scope.row.attrValName" @blur="checkItemSpecSelfDefList(scope.row.attrValName, scope.row.attrValId)"></el-input>
                          </el-col>
                        </el-row>
                      </template>
                    </el-table-column>
                    <el-table-column label="自定义图片（JPG格式，≤200K，可不添加）" prop="picUrl">
                      <template slot-scope="scope">
                        <erp-item-photo-one v-model="scope.row.picUrl" :uploadUrl="upload_url" :imgType="'albu'"></erp-item-photo-one>
                      </template>
                    </el-table-column>
                    <el-table-column>
                      <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="delItemSpecSelfDefList(scope.row.attrValId)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button size="mini" type="primary" @click="addItemSpecSelfDefList" style="margin-top: 10px">+
                    增加自定义规格</el-button>
                </el-form>
              </el-card>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="产品销售信息" name="2">
        <el-card>
          <el-form ref="form" label-width="120px">
            <el-form-item label="销售计量单位" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-select size='mini' v-model="updateItemForm.itemPackage.measureId" placeholder="请选择">
                <el-option v-for="measuresOption in measuresOptions" :key="measuresOption.measureid" :label="measuresOption.cname"
                  :value="measuresOption.measureid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="销售方式">
              <el-radio-group size='mini' v-model="updateItemForm.itemPackage.packingType" @change="changePackingType"
                style="margin-top: 10px;">
                <el-radio value="1" label="1">按件卖（单位：英寸）</el-radio><br />
                <el-radio value="2" label="2" style="margin-top:10px">按包卖<span v-if="updateItemForm.itemPackage.packingType === '2'">（每包产品的数量：<el-input
                      size="mini" v-model="updateItemForm.itemPackage.packingQuantity" style="width:150px"></el-input>
                    英寸）</span></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备货状态" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-radio-group style="margin-top: 10px;" size='mini' v-model="updateItemForm.itemInventory.inventoryStatus"
                @change="changeItemInventoryType">
                <el-radio value="1" label="1">
                  有备货，备货所在地（有现货，可立即发货，备货期不大于四个工作日，如遇节假日顺延）<br />
                  <el-row v-if="updateItemForm.itemInventory.inventoryStatus === '1'">
                    <el-button v-if="updateItemForm.itemInventory.inventoryLocationList.length < 7" size="mini" style="margin-top:10px"
                      @click="addItemInventory">+ 添加备货地</el-button>

                    <div v-for="(value,index) in updateItemForm.itemInventory.invenLocationList" :key="index">
                      <el-select size="mini" v-model="value.inventoryLocation">
                        <el-option v-for="item in countryList" :key="item.countryid" :label="item.description" :value="item.countryid">
                        </el-option>
                      </el-select>
                      <el-button type='text' @click="delItemInventory(index)">删除</el-button>
                    </div>
                  </el-row>
                </el-radio><br />
                <el-radio value="0" label="0" style="margin-top:10px">
                  待备货，客户一次最大购买数量为 <el-input size="mini" v-model="updateItemForm.itemSaleSetting.maxSaleQty" max="10000"
                    min="1" style="width:150px"></el-input> 包（暂无现货需采购）
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备货期" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]">
              <span>
                <el-input size='mini' v-model="updateItemForm.itemSaleSetting.leadingTime" @blur="checkLeadingTime(updateItemForm.itemSaleSetting.leadingTime)"
                  style="width:150px"></el-input> 天
              </span><br />
              <span v-if="this.updateItemForm.itemInventory.inventoryStatus === '1'">（有备货的产品备货期小于等于4天）</span>
              <span v-else>（无备货的产品需在1-60个工作日内发货）</span>
            </el-form-item>
            <el-form-item v-if="this.updateItemForm.itemInventory.inventoryStatus === '1'" label="备货总量">
              <span> {{ updateItemForm.itemInventory.inventoryQty }} {{ getCurMeasure() }}（产品备货数量的总和）</span>
            </el-form-item>
            <el-form-item label="产品价格区间" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <!-- sku 列表 -->
              <el-row>
                <erp-item-sku ref='erpItemSku' v-model="updateItemForm.itemSkuList" :updateItemForm='updateItemForm'
                  :countryList='countryList' :categoryPubAttrOptions='categoryPubAttrOptions' :measuresOptions='measuresOptions'
                  :percentList='percentList'></erp-item-sku>
              </el-row>

            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="产品内容描述" name="3">
        <el-card>
          <el-form ref="form" label-width="120px">
            <el-form-item label="产品图片" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-card class="box-card">
                <p style="line-height: 24px;margin: 0px;">* 图片像素不低于600*600（建议800*800以上），且大小不超过5M，图片格式JPEG，建议正方形图片；</p>
                <p style="line-height: 24px;margin: 0px;">* 建议图片背景底色为白色或者纯色，图片主体占比70%~80%，至少上传3张；</p>
                <p style="line-height: 24px;margin: 0px;">* 首图产品主体展示完整，建议不要使用产品局部图;</p>

                <erp-item-photo v-model="itemImgList" :uploadUrl="upload_url" :imgType="'albu'"></erp-item-photo>
              </el-card>
            </el-form-item>

            <el-form-item label="站内外推广图片" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-card class="box-card itemImgAd">
                <p style="line-height: 24px;margin: 0px;">请上传一张高质量图片用于站内外推广(如Googleshopping)，图片要求无人为修改，无促销、名称、属性等文字信息，符合站内外推广产品政策。</p>
                <erp-item-photo-one v-model="itemImgAd" :uploadUrl="upload_url" :imgType="'albu'"></erp-item-photo-one>
              </el-card>
            </el-form-item>
            <el-form-item label="商品分级管理" style="margin-top:10px">
              <el-radio-group v-model="updateItemForm.issample">
                <el-radio border label='3'>非成人属性</el-radio>
                <el-radio border label='2'>成人属性</el-radio>
              </el-radio-group>
              <p style="line-height: 24px;margin: 0px;">为了更好的将商品进行站外推广，需要您对自己的商品进行标识，是否有成人性质。</p>
              <p style="line-height: 24px;margin: 0px;">注：如成人类性质商品打标错误，将会受到封店7天惩罚，请严格遵循。</p>
            </el-form-item>
            <el-form-item label="产品简短描述" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-input v-model="updateItemForm.itemBase.shortDesc" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="产品详细描述" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-card class="box-card htmlContent">
                <quill-editor ref="myTextEditor" v-model="updateItemForm.itemBase.htmlContent">
                  <div id="toolbar" slot="toolbar">
                    <erp-item-photo v-model="htmlContentImgTmp" :uploadUrl="upload_url" :imgType="'albu'" @change="htmlContentImgTmpUpload">
                    </erp-item-photo>
                  </div>
                </quill-editor>
              </el-card>
            </el-form-item>
            <el-form-item label="产品视频链接" style="margin-top:10px">
              <el-input size='mini' v-model="updateItemForm.itemBase.videoUrl"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="产品包装信息" name="4">
        <el-card>
          <el-form ref="form" label-width="120px">
            <el-form-item label="包装后重量" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]">
              <el-col :span="3">
                <el-input size='mini' v-model="updateItemForm.itemPackage.grossWeight"></el-input>
              </el-col>
              <el-col :span="3">
                <span> 公斤（KG）/件</span>
              </el-col>
            </el-form-item>
            <el-form-item label="包装后尺寸" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]">
              <el-col :span="3">
                <el-input size='mini' v-model="updateItemForm.itemPackage.length"></el-input>
              </el-col>
              <el-col :span="1">
                <span style="display: block;text-align:center">*</span>
              </el-col>
              <el-col :span="3">
                <el-input size='mini' v-model="updateItemForm.itemPackage.width"></el-input>
              </el-col>
              <el-col :span="1">
                <span style="display: block;text-align:center">*</span>
              </el-col>
              <el-col :span="3">
                <el-input size='mini' v-model="updateItemForm.itemPackage.height"></el-input>
              </el-col>
              <el-col :span="3">
                <span> 单位均为：厘米 </span>
              </el-col>

            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="其他信息" name="6">
        <el-card>
          <el-form label-width="120px">
            <el-form-item label="产品有效期">
              <el-select size='mini' v-model="updateItemForm.vaildDay" placeholder="请选择选择产品有效期">
                <el-option label="90天" value="90"></el-option>
                <el-option label="30天" value="30"></el-option>
                <el-option label="14天" value="14"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
    </el-collapse>

    <el-button size='mini' type="primary" @click="saveData" style="margin-top:10px">保存</el-button>
  </section>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import {
    quillEditor
  } from 'vue-quill-editor'
  import dhAlbum from '@/components/dh-album'
  import erpItemAlbum from '@/components/erp-goods/erp-item-add/erp-item-album'
  import erpItemPhoto from '@/components/erp-goods/erp-item-add/erp-item-photo'
  import erpItemAttr from '@/components/erp-goods/erp-item-add/erp-item-attr'
  import erpItemSku from '@/components/erp-goods/erp-item-add/erp-item-sku'
  import erpItemPhotoOne from '@/components/erp-goods/erp-item-add/erp-item-photo-one'

  import {
    updateItem
  } from '@/api/item'
  import {
    getGoodsMeasures
  } from '@/api/commodity'
  import {
    getAttrByCatePubId
  } from '@/api/template'
  import {
    validateDhTitle
  } from '@/utils/validate'
  import linsd_arr from 'linsd_arr'

  export default {
    name: 'ero-item-add',
    components: {
      erpItemAlbum,
      erpItemAttr,
      erpItemSku,
      dhAlbum,
      erpItemPhoto,
      erpItemPhotoOne,
      quillEditor
    },
    data() {
      return {
        dialogCategoryListVisible: false,
        dialogDhImgListVisible: false,

        upload_url: process.env.BASE_API + '/lv/goods/upload?shopId=' + this.shopId,

        processImg: '',
        isAdd: false,

        shippingTemplateOptions: [],
        aftersaleOptions: [],
        categoryPubAttrOptions: [],
        measuresOptions: [],

        itemImgList: [],
        itemImgAd: {
          imgUrl: '',
          imgMd5: '',
          type: ''
        }, // 推广图
        updateItemForm: {},

        htmlContentImgTmp: [],
        htmlContentImgTmpExist: [],

        percentList: [],
        catePubListList: [],
        titleList: [],
        keywordList: [],
        countryList: []
      }
    },
    props: {
      itemDetail: {
        default: {},
        required: false
      },
      cateList: {
        default: [],
        required: false
      },
      itemCode: {
        default: '',
        required: true
      },
      shopId: {
        default: '',
        required: true
      }
    },

    methods: {
      checkTitle() {
        var res = validateDhTitle(this.updateItemForm.itemBase.itemName)
        if (!res.result) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        res.result
      },
      htmlContentImgTmpUpload() {
        if (this.updateItemForm.itemBase.htmlContent === null) {
          this.updateItemForm.itemBase.htmlContent = ''
        }

        for (var i = 0; i < this.htmlContentImgTmp.length; i++) {
          var result = this.htmlContentImgTmpExist.filter(item => {
            return item === this.htmlContentImgTmp[i].url
          })
          if (result.length > 0) {
            continue
          }

          this.updateItemForm.itemBase.htmlContent += '<img src="' + this.htmlContentImgTmp[i].url + '" />'
          this.htmlContentImgTmpExist.push(this.htmlContentImgTmp[i].url)
        }
      },
      // 当前选中单位
      getCurMeasure() {
        var result = this.measuresOptions.filter(item => {
          return item.measureid === this.updateItemForm.itemPackage.measureId
        })

        if (result.length > 0) {
          return result[0].cname
        }
      },
      checkLeadingTime(time) {
        if (this.updateItemForm.itemInventory.inventoryStatus === '1' && (time > 4 || time < 1)) {
          this.$message({
            message: '有备货的备货期不得超过4天',
            type: 'error'
          })
          this.updateItemForm.itemSaleSetting.leadingTime = ''
        } else if (this.updateItemForm.itemInventory.inventoryStatus !== '1' && (time > 60 || time < 1)) {
          this.$message({
            message: '无备货的产品需在1-60个工作日内发货',
            type: 'error'
          })
          this.updateItemForm.itemSaleSetting.leadingTime = ''
        }
      },
      delItemInventory(index) {
        this.updateItemForm.itemInventory.invenLocationList.splice(index, 1)
        this.$refs.erpItemSku.delInvenList(index)
      },
      addItemInventory() {
        var curIndex = this.updateItemForm.itemInventory.invenLocationList.length
        var addInventory = {
          leadingTime: 4,
          inventoryLocation: this.countryList[curIndex].countryid,
          sortVal: curIndex
        }
        this.updateItemForm.itemInventory.invenLocationList.push(addInventory)
        this.$refs.erpItemSku.initInvenList()
      },
      changeItemInventoryType() {
        if (this.updateItemForm.itemInventory.inventoryStatus === '2') {
          this.updateItemForm.itemInventory.invenLocationList = []
        } else {
          var iniCn = {
            leadingTime: 4,
            inventoryLocation: 'CN',
            sortVal: 0
          }
          this.updateItemForm.itemInventory.invenLocationList.push(iniCn)
          this.$refs.erpItemSku.initInvenList()
        }
      },
      changePackingType() {
        this.updateItemForm.itemPackage.packingQuantity = '1'
      },
      delItemAttrList(index) {
        var attrindex = linsd_arr.getIndex(this.updateItemForm.itemAttrList, 'lineAttrName', '自定义属性')
        this.updateItemForm.itemAttrList[attrindex].itemAttrValList.splice(index, 1)
      },
      addItemAttrList() {
        var index = linsd_arr.getIndex(this.updateItemForm.itemAttrList, 'lineAttrName', '自定义属性')

        if (index === undefined) {
          this.updateItemForm.itemAttrList.push({
            isbrand: 0,
            lineAttrName: '自定义属性',
            lineAttrNameCn: '自定义属性',
            itemAttrValList: [{
              lineAttrvalName: '',
              lineAttrvalNameCn: '',
              attrName: '',
              brandId: '',
              attrId: '',
              attrValId: '',
              picUrl: ''
            }]
          })
        } else {
          if (this.updateItemForm.itemAttrList[index].itemAttrValList.length >= 10) {
            this.$message({
              message: '最多只能添加10个自定义属性',
              type: 'error'
            })
            return false
          }

          this.updateItemForm.itemAttrList[index].itemAttrValList.push({
            lineAttrvalName: '',
            lineAttrvalNameCn: '',
            attrName: '',
            brandId: '',
            attrId: '',
            attrValId: '',
            picUrl: ''
          })
        }
      },
      checkItemSpecSelfDefList(attrValName, attrValId) {
        var result = this.updateItemForm.itemSpecSelfDefList.filter(item => {
          return item.attrValName === attrValName
        })

        if (result[0].attrValId !== attrValId) {
          var index = linsd_arr.getIndex(this.updateItemForm.itemSpecSelfDefList, 'attrValId', attrValId)
          this.updateItemForm.itemSpecSelfDefList[index].attrValName = ''

          this.$message({
            message: '自定义规格名称不允许重复',
            type: 'error'
          })
        }

        this.refreashItemSpecSelfDefList()
      },
      delItemSpecSelfDefList(attrValId) {
        var index = linsd_arr.getIndex(this.updateItemForm.itemSpecSelfDefList, 'attrValId', attrValId)
        this.updateItemForm.itemSpecSelfDefList.splice(index, 1)
        for (var i = 0; i < this.updateItemForm.itemSpecSelfDefList.length; i++) {
          this.updateItemForm.itemSpecSelfDefList[i].attrValId = attrValId
          attrValId = attrValId + 1
        }

        this.refreashItemSpecSelfDefList()
      },
      addItemSpecSelfDefList() {
        if (this.updateItemForm.itemSpecSelfDefList.length >= 20) {
          this.$message({
            message: '最多只能添加20个自定义规格',
            type: 'error'
          })
          return false
        }

        var attrValId = 1000
        if (this.updateItemForm.itemSpecSelfDefList === undefined) {
          this.updateItemForm.itemSpecSelfDefList = []
          this.updateItemForm.itemSpecSelfDefList.push({
            attrValName: '',
            picUrl: '',
            attrValId: attrValId
          })
          return true
        } else {
          for (var i = 0; i < this.updateItemForm.itemSpecSelfDefList.length; i++) {
            this.updateItemForm.itemSpecSelfDefList[i].attrValId = attrValId
            attrValId = attrValId + 1
          }

          this.updateItemForm.itemSpecSelfDefList.push({
            attrValName: '',
            picUrl: '',
            attrValId: attrValId
          })
        }
      },
      initItemAttrList(attr_id) {
        var result = this.updateItemForm.itemAttrList.filter(itemAttr => {
          return itemAttr.attrId === Number(attr_id)
        })
        if (result !== []) {
          return result[0]
        } else {
          return {}
        }
      },
      initItemImgList() {
        for (var i = 0; i < this.updateItemForm.itemImgList.length; i++) {
          if (this.updateItemForm.itemImgList[i].type === 3) {
            this.itemImgAd = {
              imgUrl: '',
              imgMd5: '',
              type: ''
            }
            this.itemImgAd = this.updateItemForm.itemImgList[i]
          } else {
            this.itemImgList[i] = {}
            this.itemImgList[i] = this.updateItemForm.itemImgList[i]
            this.itemImgList[i].type = 1
          }
        }
      },
      createFilterTitle(queryString) {
        return (titleList) => {
          return (titleList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      createFilterKeyword(queryString) {
        return (keywordList) => {
          return (keywordList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      saveData() {
        if (this.checkTitle() === false) {
          return false
        }

        this.updateItemForm.itemImgList = this.itemImgList
        if (this.itemImgAd.imgUrl !== '') {
          this.updateItemForm.itemImgList.push(this.itemImgAd)
        }
        var params = this.updateItemForm
        params.shopId = this.shopId
        updateItem(this.updateItemForm).then(res => {
          if (res.code === 0) {
            if (res.result.status.code === '00000000') {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('click', 'success')
            } else {
              var errorMsg = ''
              res.result.status.subErrors.forEach(error => {
                errorMsg = errorMsg + error.message
              })
              this.$message({
                message: errorMsg,
                type: 'error'
              })
            }
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
          console.info('updateItem', res)
        })
      },
      getMeasures() {
        getGoodsMeasures().then(res => {
          this.measuresOptions = res.list
          this.countryList = res.countryList
        })
      },
      /** ***************************************************** end */
      refreashItemSpecSelfDefList() {
        this.$refs.erpItemSku.refreashItemSpecSelfDefList(this.updateItemForm.itemSpecSelfDefList)
      },
      onAttrChange(categoryPubAttr) {
        var index = this.updateItemForm.itemAttrList.findIndex(item => {
          return String(item.attrId) === String(categoryPubAttr.attrId)
        })

        if (index > -1) {
          this.updateItemForm.itemAttrList[index] = categoryPubAttr
        } else {
          this.updateItemForm.itemAttrList.push(categoryPubAttr)
        }

        this.$refs.erpItemSku.refreashItemAttr(categoryPubAttr)
      },
      categoryAttributes() {
        if (this.updateItemForm.catePubId) {
          getAttrByCatePubId({
            cate_pub_id: this.updateItemForm.catePubId
          }).then(res => {
            if (res.code === 0) {
              this.categoryPubAttrOptions = res.list
              this.percentList = res.percentList // 佣金比例
            }
          })
        }
      },
      init() {
        this.updateItemForm = this.itemDetail
        this.updateItemForm.itemSaleSetting.priceConfigType = String(this.updateItemForm.itemSaleSetting.priceConfigType)
        this.updateItemForm.itemInventory.inventoryStatus = String(this.updateItemForm.itemInventory.inventoryStatus)

        this.initItemImgList()
        this.getMeasures()
        this.categoryAttributes()
      }
    },
    computed: {},
    watch: {},
    created() {
      this.init()
    },
    mounted() {
      console.info(this.updateItemForm)
    }
  }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 0px;
  }
</style>

<style>
  .itemImgAd .upload-one {
    float: none
  }

  .itemImgAd .upload-one-show {
    float: none;
    margin-left: 0px;
  }

  .itemImgAd .mini-photo-one .el-upload-list--picture-card .upload-one-w {
    width: 146px;
    height: 146px;
  }

  .htmlContent .upload-photo {
    display: none;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
