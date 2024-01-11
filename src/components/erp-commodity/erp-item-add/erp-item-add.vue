<template>
  <section class="app-container">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="产品基本信息" name="1">
        <el-card>
          <el-form ref="baseInfo" label-width="120px">
            <el-form-item label="所属分类" :rules="[
              { required: true, message: '请选择所属分类', trigger: 'blur' }]">
              <el-cascader size='mini' v-model="addItemForm.catePubId" :options="cateList" style="width: 500px;"
                @change="changeCategoryAttributes"></el-cascader>
            </el-form-item>

            <el-form-item label="产品标题" :rules="titleRules">
              <el-autocomplete class="inline-input" size='mini' v-model="addItemForm.itemBase.itemName"
                :fetch-suggestions="querySearchTitle" @select="handleSelectTitle" @blur="checkTitle" placeholder="请输入产品标题"
                style="width:100%" :clearable='true'></el-autocomplete>
            </el-form-item>
            <el-form-item label="产品关键词">
              <el-col :span="7" style="margin-right:5px">
                <el-autocomplete size='mini' class="inline-input" v-model="addItemForm.itemBase.keyWord1"
                  :fetch-suggestions="querySearchKeyword" @select="handleSelectKw1" style="width:100%" :clearable='true'></el-autocomplete>
              </el-col>
              <el-col :span="7" style="margin-right:5px">
                <el-autocomplete size='mini' class="inline-input" v-model="addItemForm.itemBase.keyWord2"
                  :fetch-suggestions="querySearchKeyword" @select="handleSelectKw2" style="width:100%" :clearable='true'></el-autocomplete>
              </el-col>
              <el-col :span="7">
                <el-autocomplete size='mini' class="inline-input" v-model="addItemForm.itemBase.keyWord3"
                  :fetch-suggestions="querySearchKeyword" @select="handleSelectKw3" style="width:100%" :clearable='true'></el-autocomplete>
              </el-col>
            </el-form-item>
            <el-form-item label="产品基本属性" :rules="[
              { required: true, message: '请选择产品基本属性', trigger: 'blur' }
            ]">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px" v-for="(categoryPubAttr,index) in categoryPubAttrOptions"
                  :key="index">
                  <erp-item-attr :categoryPubAttr="categoryPubAttr" :itemAttrList="initItemAttrList(categoryPubAttr.line_attr_name)"
                    v-if="categoryPubAttr.buy_attr == 0" @value="onAttrChange"></erp-item-attr>
                </el-form>

                <!-- 添加自定义属性 start-->
                <el-form-item v-for="(item, index) in this.addItemForm.itemAttrList" :key='index' label="自定义属性" v-if="item.lineAttrNameCn != null && item.lineAttrNameCn === '自定义属性'">
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
                    <erp-item-attr :categoryPubAttr="categoryPubAttr" :itemAttrList="initItemAttrList(categoryPubAttr.line_attr_name)"
                      v-if="categoryPubAttr.buy_attr == 1" @value="onAttrChange" :commodityInfo="commodityInfo"></erp-item-attr>
                  </div>
                </el-form>
              </el-card>
            </el-form-item>
            <el-form-item label="自定义规格" style="margin-top:10px" class="mini-table">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px">
                  <el-table :data="addItemForm.itemSpecSelfDefList" border style="width: 100%" size="mini">
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
                        <erp-item-photo-one v-model="scope.row.picUrl" :uploadUrl="upload_url" :commodityInfo="commodityInfo"
                          :imgType="'item_images'"></erp-item-photo-one>
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
              <el-select size='mini' v-model="addItemForm.itemPackage.measureId" placeholder="请选择">
                <el-option v-for="measuresOption in measuresOptions" :key="measuresOption.measureid" :label="measuresOption.cname"
                  :value="measuresOption.measureid">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="销售方式">
              <el-radio-group size='mini' v-model="addItemForm.itemPackage.packingType" @change="changePackingType"
                style="margin-top: 10px;">
                <el-radio value="1" label="1">按件卖（单位：英寸）</el-radio><br />
                <el-radio value="2" label="2" style="margin-top:10px">按包卖<span v-if="addItemForm.itemPackage.packingType === '2'">（每包产品的数量：<el-input
                      size="mini" v-model="addItemForm.itemPackage.packingQuantity" style="width:150px"></el-input> 英寸）</span></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备货状态" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-radio-group style="margin-top: 10px;" size='mini' v-model="addItemForm.itemInventory.inventoryStatus"
                @change="changeItemInventoryType">
                <el-radio value="1" label="1">
                  有备货，备货所在地（有现货，可立即发货，备货期不大于四个工作日，如遇节假日顺延）<br />
                  <el-row v-if="addItemForm.itemInventory.inventoryStatus === '1'">
                    <el-button v-if="addItemForm.itemInventory.invenLocationList.length < 7" size="mini" style="margin-top:10px"
                      @click="addItemInventory">+ 添加备货地</el-button>

                    <div v-for="(value,index) in addItemForm.itemInventory.invenLocationList" :key="index">
                      <el-select size="mini" v-model="value.inventoryLocation">
                        <el-option v-for="item in countryList" :key="item.countryid" :label="item.description" :value="item.countryid">
                        </el-option>
                      </el-select>
                      <el-button type='text' @click="delItemInventory(index)">删除</el-button>
                    </div>
                  </el-row>
                </el-radio><br />
                <el-radio value="0" label="0" style="margin-top:10px">
                  待备货，客户一次最大购买数量为 <el-input size="mini" v-model="addItemForm.itemSaleSetting.maxSaleQty" max="10000"
                    min="1" style="width:150px"></el-input> 包（暂无现货需采购）
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备货期" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' },
              { type: 'number', message: '必须为数字值'}
            ]">
              <span>
                <el-input size='mini' v-model="addItemForm.itemSaleSetting.leadingTime" @blur="checkLeadingTime(addItemForm.itemSaleSetting.leadingTime)"
                  style="width:150px"></el-input> 天
              </span><br />
              <span v-if="this.addItemForm.itemInventory.inventoryStatus === '1'">（有备货的产品备货期小于等于4天）</span>
              <span v-else>（无备货的产品需在1-60个工作日内发货）</span>
            </el-form-item>
            <el-form-item v-if="this.addItemForm.itemInventory.inventoryStatus === '1'" label="备货总量">
              <span> {{ addItemForm.itemInventory.inventoryQty }} {{ getCurMeasure() }}（产品备货数量的总和）</span>
            </el-form-item>
            <el-form-item label="产品价格区间" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <!-- sku 列表 -->
              <el-row>
                <erp-item-sku ref='erpItemSku' v-model="addItemForm.itemSkuList" :addItemForm='addItemForm'
                  :countryList='countryList' :categoryPubAttrOptions='categoryPubAttrOptions' :measuresOptions='measuresOptions'
                  :percentList='percentList' :commodityInfo="commodityInfo"></erp-item-sku>
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

                <erp-item-photo v-model="itemImgList" :uploadUrl="upload_url" :commodityInfo="commodityInfo" :imgType="'image'"></erp-item-photo>
              </el-card>
            </el-form-item>

            <el-form-item label="站内外推广图片" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-card class="box-card itemImgAd">
                <p style="line-height: 24px;margin: 0px;">请上传一张高质量图片用于站内外推广(如Googleshopping)，图片要求无人为修改，无促销、名称、属性等文字信息，符合站内外推广产品政策。</p>
                <erp-item-photo-one v-model="itemImgAd" :uploadUrl="upload_url" :commodityInfo="commodityInfo" :imgType="'image'"></erp-item-photo-one>
              </el-card>
            </el-form-item>
            <el-form-item label="商品分级管理" style="margin-top:10px">
              <el-radio-group v-model="addItemForm.issample">
                <el-radio border label='3'>非成人属性</el-radio>
                <el-radio border label='2'>成人属性</el-radio>
              </el-radio-group>
              <p style="line-height: 24px;margin: 0px;">为了更好的将商品进行站外推广，需要您对自己的商品进行标识，是否有成人性质。</p>
              <p style="line-height: 24px;margin: 0px;">注：如成人类性质商品打标错误，将会受到封店7天惩罚，请严格遵循。</p>
            </el-form-item>
            <el-form-item label="产品简短描述" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-input v-model="addItemForm.itemBase.shortDesc" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="产品详细描述" style="margin-top:10px" :rules="[
              { required: true, message: '不能为空', trigger: 'blur' }
            ]">
              <el-card class="box-card htmlContent">
                <quill-editor ref="myTextEditor" v-model="addItemForm.itemBase.htmlContent">
                  <div id="toolbar" slot="toolbar">
                    <erp-item-photo v-model="htmlContentImgTmp" :uploadUrl="upload_url" :commodityInfo="commodityInfo"
                      :imgType="'detail_images'" @change="htmlContentImgTmpUpload">
                    </erp-item-photo>
                  </div>
                </quill-editor>
              </el-card>
            </el-form-item>
            <el-form-item label="产品视频链接" style="margin-top:10px">
              <el-input size='mini' v-model="addItemForm.itemBase.videoUrl"></el-input>
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
                <el-input size='mini' v-model="addItemForm.itemPackage.grossWeight"></el-input>
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
                <el-input size='mini' v-model="addItemForm.itemPackage.length"></el-input>
              </el-col>
              <el-col :span="1">
                <span style="display: block;text-align:center">*</span>
              </el-col>
              <el-col :span="3">
                <el-input size='mini' v-model="addItemForm.itemPackage.width"></el-input>
              </el-col>
              <el-col :span="1">
                <span style="display: block;text-align:center">*</span>
              </el-col>
              <el-col :span="3">
                <el-input size='mini' v-model="addItemForm.itemPackage.height"></el-input>
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
              <el-select size='mini' v-model="addItemForm.vaildDay" placeholder="请选择选择产品有效期">
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
  import erpItemAlbum from '@/components/erp-commodity/erp-item-add/erp-item-album'
  import erpItemPhoto from '@/components/erp-commodity/erp-item-add/erp-item-photo'
  import erpItemAttr from '@/components/erp-commodity/erp-item-add/erp-item-attr'
  import erpItemSku from '@/components/erp-commodity/erp-item-add/erp-item-sku'
  import erpItemPhotoOne from '@/components/erp-commodity/erp-item-add/erp-item-photo-one'

  import {
    storeTpl,
    getAttrByCatePubId
  } from '@/api/template'
  import {
    getGoodsMeasures
  } from '@/api/commodity'
  import linsd_arr from 'linsd_arr'
  import {
    validateDhTitle
  } from '@/utils/validate'

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
      const validateTitle = (rule, value, callback) => {
        console.info(validateTitle(value))
        if (!validateDhTitle(value).result) {
          callback(new Error(validateDhTitle(value).msg))
        } else {
          callback()
        }
      }
      return {
        activeNames: ['1', '2', '3', '4', '6'],
        dialogCategoryListVisible: false,
        dialogDhImgListVisible: false,

        upload_url: process.env.BASE_API + '/lv/commodity/template/upload',

        processImg: '',
        isAdd: false,

        shippingTemplateOptions: [],
        aftersaleOptions: [],
        categoryPubAttrOptions: [],
        measuresOptions: [],

        itemImgList: [],
        itemImgAd: '', // 推广图
        addItemForm: {},

        htmlContentImgTmp: [],
        htmlContentImgTmpExist: [],

        percentList: [],
        catePubListList: [],
        titleList: [],
        keywordList: [],
        countryList: [],

        titleRules: [{
          required: true,
          message: '请输入产品标题',
          trigger: 'blur',
          validator: validateTitle
        }]
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
      commodityInfo: {
        default: [],
        required: false
      }
    },

    methods: {
      checkTitle() {
        var res = validateDhTitle(this.addItemForm.itemBase.itemName)
        if (!res.result) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return res.result
      },
      htmlContentImgTmpUpload() {
        if (this.addItemForm.itemBase.htmlContent === null) {
          this.addItemForm.itemBase.htmlContent = ''
        }

        for (var i = 0; i < this.htmlContentImgTmp.length; i++) {
          var result = this.htmlContentImgTmpExist.filter(item => {
            return item === this.htmlContentImgTmp[i].url
          })
          if (result.length > 0) {
            continue
          }

          this.addItemForm.itemBase.htmlContent += '<img src="' + this.htmlContentImgTmp[i].url + '" />'
          this.htmlContentImgTmpExist.push(this.htmlContentImgTmp[i].url)
        }
      },
      // 当前选中单位
      getCurMeasure() {
        var result = this.measuresOptions.filter(item => {
          return item.measureid === this.addItemForm.itemPackage.measureId
        })

        if (result.length > 0) {
          return result[0].cname
        }
      },
      checkLeadingTime(time) {
        if (this.addItemForm.itemInventory.inventoryStatus === '1' && (time > 4 || time < 1)) {
          this.$message({
            message: '有备货的备货期不得超过4天',
            type: 'error'
          })
          this.addItemForm.itemSaleSetting.leadingTime = ''
        } else if (this.addItemForm.itemInventory.inventoryStatus !== '1' && (time > 60 || time < 1)) {
          this.$message({
            message: '无备货的产品需在1-60个工作日内发货',
            type: 'error'
          })
          this.addItemForm.itemSaleSetting.leadingTime = ''
        }
      },
      delItemInventory(index) {
        this.addItemForm.itemInventory.invenLocationList.splice(index, 1)
        this.$refs.erpItemSku.delInvenList(index)
      },
      addItemInventory() {
        var curIndex = this.addItemForm.itemInventory.invenLocationList.length
        var addInventory = {
          leadingTime: 4,
          inventoryLocation: this.countryList[curIndex].countryid,
          sortVal: curIndex
        }
        this.addItemForm.itemInventory.invenLocationList.push(addInventory)
        this.$refs.erpItemSku.initInvenList()
      },
      changeItemInventoryType() {
        if (this.addItemForm.itemInventory.inventoryStatus !== '1') {
          this.addItemForm.itemInventory.invenLocationList = []
        } else {
          var iniCn = {
            leadingTime: 4,
            inventoryLocation: 'CN',
            sortVal: 0
          }
          this.addItemForm.itemInventory.invenLocationList.push(iniCn)
          this.$refs.erpItemSku.initInvenList()
        }
      },
      changePackingType() {
        this.addItemForm.itemPackage.packingQuantity = '1'
      },
      delItemAttrList(index) {
        var attrindex = linsd_arr.getIndex(this.addItemForm.itemAttrList, 'lineAttrName', '自定义属性')
        this.addItemForm.itemAttrList[attrindex].itemAttrValList.splice(index, 1)
      },
      addItemAttrList() {
        var index = linsd_arr.getIndex(this.addItemForm.itemAttrList, 'lineAttrName', '自定义属性')

        if (index === undefined) {
          this.addItemForm.itemAttrList.push({
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
          if (this.addItemForm.itemAttrList[index].itemAttrValList.length >= 10) {
            this.$message({
              message: '最多只能添加10个自定义属性',
              type: 'error'
            })
            return false
          }

          this.addItemForm.itemAttrList[index].itemAttrValList.push({
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
        var result = this.addItemForm.itemSpecSelfDefList.filter(item => {
          return item.attrValName === attrValName
        })

        if (result[0].attrValId !== attrValId) {
          var index = linsd_arr.getIndex(this.addItemForm.itemSpecSelfDefList, 'attrValId', attrValId)
          this.addItemForm.itemSpecSelfDefList[index].attrValName = ''

          this.$message({
            message: '自定义规格名称不允许重复',
            type: 'error'
          })
        }

        this.refreashItemSpecSelfDefList()
      },
      delItemSpecSelfDefList(attrValId) {
        var index = linsd_arr.getIndex(this.addItemForm.itemSpecSelfDefList, 'attrValId', attrValId)
        this.addItemForm.itemSpecSelfDefList.splice(index, 1)
        for (var i = 0; i < this.addItemForm.itemSpecSelfDefList.length; i++) {
          this.addItemForm.itemSpecSelfDefList[i].attrValId = attrValId
          attrValId = attrValId + 1
        }

        this.refreashItemSpecSelfDefList()
      },
      addItemSpecSelfDefList() {
        if (this.addItemForm.itemSpecSelfDefList.length >= 20) {
          this.$message({
            message: '最多只能添加20个自定义规格',
            type: 'error'
          })
          return false
        }

        var attrValId = 1000
        if (this.addItemForm.itemSpecSelfDefList === undefined) {
          this.addItemForm.itemSpecSelfDefList = []
          this.addItemForm.itemSpecSelfDefList.push({
            attrValName: '',
            picUrl: '',
            attrValId: attrValId
          })
          return true
        } else {
          for (var i = 0; i < this.addItemForm.itemSpecSelfDefList.length; i++) {
            this.addItemForm.itemSpecSelfDefList[i].attrValId = attrValId
            attrValId = attrValId + 1
          }

          this.addItemForm.itemSpecSelfDefList.push({
            attrValName: '',
            picUrl: '',
            attrValId: attrValId
          })
        }
      },
      initItemAttrList(lineAttrName) {
        var result = this.addItemForm.itemAttrList.filter(item => {
          if (item.lineAttrName === undefined) {
            item.lineAttrName = ''
          }
          return item.lineAttrName.trim() === lineAttrName.trim()
        })

        if (result !== []) {
          return result[0]
        } else {
          return {}
        }
      },
      initItemImgList() {
        for (var i = 0; i < this.addItemForm.itemImgList.length; i++) {
          if (this.addItemForm.itemImgList[i].type === 3) {
            this.itemImgAd = this.addItemForm.itemImgList[i].imgUrl
          } else {
            this.itemImgList[i] = {}
            this.itemImgList[i].url = this.addItemForm.itemImgList[i].imgUrl
          }
        }
      },
      handleSelectTitle(item) {
        this.addItemForm.itemBase.itemName = item.label
      },
      querySearchTitle(queryString, cb) {
        var titleList = this.titleList
        var results = queryString ? titleList.filter(this.createFilterTitle(queryString)) : titleList
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      createFilterTitle(queryString) {
        return (titleList) => {
          return (titleList.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },

      handleSelectKw1(item) {
        this.addItemForm.itemBase.keyWord1 = item.label
      },
      handleSelectKw2(item) {
        this.addItemForm.itemBase.keyWord2 = item.label
      },
      handleSelectKw3(item) {
        this.addItemForm.itemBase.keyWord3 = item.label
      },
      querySearchKeyword(queryString, cb) {
        var keywordList = this.keywordList
        var results = queryString ? keywordList.filter(this.createFilterTitle(queryString)) : keywordList
        // 调用 callback 返回建议列表的数据
        cb(results)
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

        this.addItemForm.itemImgList = this.itemImgList
        if (this.itemImgAd !== '') {
          this.addItemForm.itemImgList.push({
            url: this.itemImgAd,
            type: 3
          })
        }
        if (Number(this.addItemForm.itemSaleSetting.priceConfigType) === 1) {
          for (const itemSku of this.addItemForm.itemSkuList) {
            if (itemSku.retailPrice === '') {
              this.$message({
                message: 'SKU价格不能为空',
                type: 'error'
              })
              return
            }
          }
        }
        // console.info('saveData',this.addItemForm)
        storeTpl(this.addItemForm).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })

            this.$emit('click', 'success')
          } else if (res.code === 30001) {
            this.$confirm(res.message + ', 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.addItemForm.force = 1
              this.saveData()
            }).catch(() => {})
          }
        })
      },

      changeCategoryAttributes() {
        this.categoryAttributes()
        this.addItemForm.itemAttrList = []
        this.addItemForm.itemSkuList = []
      },
      categoryAttributes() {
        if (this.addItemForm.catePubId) {
          getAttrByCatePubId({
            cate_pub_id: this.addItemForm.catePubId
          }).then(res => {
            if (res.code === 0) {
              this.categoryPubAttrOptions = res.list
              // console.info('this.categoryPubAttrOptions',this.categoryPubAttrOptions)
              this.percentList = res.percentList // 佣金比例
            }
          })
        }
      },
      getMeasures() {
        getGoodsMeasures().then(res => {
          this.measuresOptions = res.list
          this.countryList = res.countryList
        })
      },
      /** ***************************************************** end */
      refreashItemSpecSelfDefList() {
        this.$refs.erpItemSku.refreashItemSpecSelfDefList(this.addItemForm.itemSpecSelfDefList)
      },
      onAttrChange(categoryPubAttr) {
        var index = this.addItemForm.itemAttrList.findIndex(item => {
          return String(item.attrId) === String(categoryPubAttr.attrId)
        })
        if (index > -1) {
          this.addItemForm.itemAttrList[index] = categoryPubAttr
        } else {
          this.addItemForm.itemAttrList.push(categoryPubAttr)
        }
        this.$refs.erpItemSku.refreashItemAttr(categoryPubAttr)
      },
      init() {
        this.addItemForm = this.itemDetail
        this.addItemForm.itemSaleSetting.priceConfigType = String(this.addItemForm.itemSaleSetting.priceConfigType)
        this.addItemForm.itemInventory.inventoryStatus = String(this.addItemForm.itemInventory.inventoryStatus)

        this.titleList = this.commodityInfo.titleList
        this.keywordList = this.commodityInfo.keywordList

        // console.info("this.addItemForm",this.addItemForm)

        this.initItemImgList()
        this.getMeasures()
      }
    },
    computed: {},
    watch: {},
    created() {
      // this.getShopList()
      // console.log('created');

      this.init()
      this.categoryAttributes()
    },
    mounted() {}
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
