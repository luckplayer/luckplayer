<template>
  <section class="app-container">
    <el-collapse>
      <el-collapse-item title="产品基本信息" name="1">
        <el-card>
          <el-form ref="baseInfo" label-width="120px">
            <el-form-item label="产品标题">
              <el-input type="textarea" v-model="addItemForm.itemBase.itemName"></el-input>
            </el-form-item>
            <el-form-item label="产品关键词">
              <el-col :span="3">
                <el-input v-model="addItemForm.itemBase.keyWord1"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input v-model="addItemForm.itemBase.keyWord2"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input v-model="addItemForm.itemBase.keyWord3"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="产品基本属性">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px" v-for="(categoryPubAttr,index) in categoryPubAttrOptions"
                  :key="index">
                  <erp-item-attr :categoryPubAttr = "categoryPubAttr"  v-if="categoryPubAttr.buyAttr == 0" @value = "onAttrChange"></erp-item-attr>
                </el-form>
              </el-card>
            </el-form-item>
            <el-form-item label="产品图片">
              <el-card class="box-card">
                <!-- <div> -->
                <erp-album ref='itemImgList' v-if="hackReset" @deleteImg="deleteImg" :imgList="itemImgList" type='1'
                  typeList='' button="设为首图" :shopName="shopName" @clicked="clicked"  @replace="handleReplaceImg"></erp-album>

                <el-button size="small" type="primary" @click="dialogImgListVisible = true" v-if="isLocalLib">添加图片</el-button>
                <el-upload v-if="!isLocalLib" :action="uploadAction()" :data="{shopName:shopName}" :on-success="onUploadSuccess"
                  auto-upload>
                  <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
              </el-card>
            </el-form-item>
            <el-form-item label="图片组选择" v-if="isLocalLib">
              <el-select v-model="imgGroupType" clearable placeholder="请选择" @change="handleClickImgGroup">
                <el-option v-for="(imgList,imgTypeOption) in imgTypeOptions" :key="imgTypeOption" :label="imgTypeOption"
                  :value="imgTypeOption">
                  <span style="float: left">{{ imgTypeOption }}</span>
                  <img v-for="(img, index) in imgList" :key="index" :src="img" style="width: 25px;" />
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="产品规格">
              <el-card class="box-card" shadow="never">
                <el-form ref="itemAttr" label-width="120px">
                  <div v-for="(categoryPubAttr,index) in categoryPubAttrOptions" :key="index">
                    <erp-item-attr :categoryPubAttr = "categoryPubAttr"  v-if="categoryPubAttr.buyAttr == 1"  @value = "onAttrChange"></erp-item-attr>
                    <!-- <el-form-item :label="categoryPubAttr.lineAttrNameCn" v-if="categoryPubAttr.buyAttr == 1">
                      <el-checkbox-group v-if="categoryPubAttr.type ==1" v-model="itemSaleAttrList[categoryPubAttr.lineAttrNameCn]">
                        <el-checkbox @change="val=>{onSaleAttrChange(val,categoryPubAttrVal.lineAttrvalNameCn,index)}"
                          v-for="categoryPubAttrVal in categoryPubAttr.categoryPubAttrValList" :label="categoryPubAttrVal.lineAttrvalNameCn"
                          :key="categoryPubAttrVal.attrValId">{{categoryPubAttrVal.lineAttrvalNameCn}}</el-checkbox>
                      </el-checkbox-group>
                      <el-table :data="categoryPubAttrOptions[index].selectedValues" border style="width: 100%" size="mini">
                        <el-table-column :label="categoryPubAttr.lineAttrNameCn" v-if="categoryPubAttr.buyAttr == 1"
                          prop="lineAttrvalNameCn">
                          <template slot-scope="scope">
                            <span>{{ scope.row.lineAttrvalNameCn }}</span>
                            <img :src="scope.row.picUrl" style="width: 40px; float: right;" />
                          </template>
                        </el-table-column>
                        <el-table-column label="自定义内容" prop="lineAttrvalName">
                          <template slot-scope="scope">
                            <el-input size="mini" v-model="categoryPubAttrOptions[index].selectedValues[scope.$index].lineAttrvalName"></el-input>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作">
                          <template slot-scope="scope">
                            <el-upload action="https://jsonplaceholder.typicode.com/posts/" :on-success="(response, file, fileList)=>{uploadSuccess(response, file, fileList,optionIndex,selectedIndex)}">
                            </el-upload>
                            <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                            <el-button size="mini" type="danger">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-form-item> -->
                  </div>
                </el-form>
              </el-card>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="产品销售信息" name="2">
        <el-card>
          <el-form ref="form" label-width="120px">
            <el-form-item label="销售计量单位">
              <el-select v-model="addItemForm.measureId" placeholder="请选择销售计量单位">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="销售方式">
              <!-- <el-radio-group>
                <el-radio border value="1" label="按件卖"></el-radio>
                <el-radio border value="2" label="按包卖 "></el-radio>
              </el-radio-group> -->
            </el-form-item>
            <el-form-item label="备货状态">
              <!-- <el-radio-group>
                <el-radio border value="1" label="有备货"></el-radio>
                <el-radio border value="2" label="待备货 "></el-radio>
              </el-radio-group> -->
            </el-form-item>
            <el-form-item label="备货期">
              <el-col :span="3">
                <el-input v-model="addItemForm.itemSaleSetting.leadingTime"></el-input>
              </el-col>
              <el-col :span="1">
                <span> 天</span>
              </el-col>
            </el-form-item>
            <el-form-item label="产品价格区间">
              <el-radio-group v-model="addItemForm.itemSaleSetting.priceConfigType">
                <el-radio border value="2" label="统一设置价格 "></el-radio>
                <el-radio border value="1" label=" 分别设置价格 "></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="产品价格">
              <erp-item-sku ref = "erpItemSku"></erp-item-sku>
              <!-- <el-table :data="addItemForm.itemSkuList" border style="width: 100%" size="mini">
                <div v-for="(categoryPubAttr,index) in categoryPubAttrOptions">
                  <el-table-column :label="categoryPubAttr.lineAttrNameCn" v-if="categoryPubAttr.buyAttr == 1">
                    <template slot-scope="scope">
                      <span>{{getAttrValName(scope.row,categoryPubAttr.lineAttrNameCn)}}</span>
                    </template>
                  </el-table-column>
                </div>
                <el-table-column prop="saleStatus" label="销售状态">
                  <template slot-scope="scope">
                    <el-select v-model="addItemForm.itemSkuList[scope.$index].saleStatus" placeholder="请选择">
                      <el-option label="可销售" value="1">
                      </el-option>
                      <el-option label="不可销售" value="0">
                      </el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column prop="retailPrice" label="价格">
                  <template slot-scope="scope">
                    <el-input v-model="addItemForm.itemSkuList[scope.$index].retailPrice" placeholder="请输入价格"></el-input>
                  </template>
                </el-table-column>
              </el-table> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="产品内容描述" name="3">
        <el-card>
          <el-form ref="form" label-width="120px">
            <!-- <el-form-item label="站内外推广图片">
              <el-card class="box-card">
                <div v-for="itemImg in addItemForm.itemImgList" v-if="itemImg.type == 3">
                  <img :src="itemImg.imgUrl" />
                </div>
              </el-card>
            </el-form-item> -->
            <el-form-item label="商品分级管理">
              <el-radio-group v-model="addItemForm.issample">
                <el-radio border value="1" label="非成人属性 "></el-radio>
                <el-radio border value="2" label="成人属性 "></el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="产品组">
              <el-select placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="产品简短描述">
              <el-input v-model="addItemForm.itemBase.shortDesc" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="产品详细描述">
              <el-card class="box-card">
              </el-card>
            </el-form-item>
            <el-form-item label="产品视频链接">
              <el-input v-model="addItemForm.itemBase.videoUrl"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="产品包装信息" name="4">
        <el-card>
          <el-form ref="form" label-width="120px">
            <el-form-item label="包装后重量">
              <el-col :span="3">
                <el-input v-model="addItemForm.itemPackage.grossWeight"></el-input>
              </el-col>
              <el-col :span="3">
                <span> 公斤（KG）/件</span>
              </el-col>
            </el-form-item>
            <el-form-item label="包装后尺寸">
              <el-col :span="3">
                <el-input v-model="addItemForm.itemPackage.length"></el-input>
              </el-col>
              <el-col :span="1">
                <span> *</span>
              </el-col>
              <el-col :span="3">
                <el-input v-model="addItemForm.itemPackage.width"></el-input>
              </el-col>
              <el-col :span="1">
                <span> *</span>
              </el-col>
              <el-col :span="3">
                <el-input v-model="addItemForm.itemPackage.height"></el-input>
              </el-col>
              <el-col :span="3">
                <span> 单位均为：厘米 </span>
              </el-col>

            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="设置运费 " name="5">
        <el-card>
          <el-form label-width="120px">
            <el-form-item label="选择运费模板">
              <el-select v-model="addItemForm.shippingModelId" placeholder="请选择选择运费模板">
                <el-option v-for="shippingTemplate in shippingTemplateOptions" :key="shippingTemplate.shippingTempId"
                  :label="shippingTemplate.modelName" :value="shippingTemplate.shippingTempId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
      <el-collapse-item title="其他信息" name="6">
        <el-card>
          <el-form label-width="120px">
            <el-form-item label="产品有效期">
              <el-select v-model="addItemForm.vaildDay" placeholder="请选择选择产品有效期">
                <el-option label="90天" value="90"></el-option>
                <el-option label="30天" value="30"></el-option>
                <el-option label="14天" value="14"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="售后服务模板">
              <el-select v-model="addItemForm.afterSaleTemplateId" placeholder="请选择选择售后服务模板">
                <el-option v-for="aftersaleOption in aftersaleOptions" :key="aftersaleOption.afterSaleTemplateId"
                  :label="aftersaleOption.name" :value="aftersaleOption.afterSaleTemplateId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-collapse-item>
    </el-collapse>
    <el-button type="primary" @click="onSubmit" v-if="addButton">新增</el-button>

    <el-dialog title="相册" :visible.sync="dialogImgListVisible" :close-on-click-modal="false" width="50%" append-to-body>
      <erp-album :imgList="allImg" type='1' typeList='' button="选择" @clicked="choosed"></erp-album>
    </el-dialog>
    <el-dialog title="敦煌相册" v-if="dialogDhImgListVisible" :visible.sync="dialogDhImgListVisible" :close-on-click-modal="false" width="50%" append-to-body>
      <dh-album :shopName="shopName" @choose="handleChooseDhAlbum"></dh-album>
    </el-dialog>
  </section>
</template>

<script>
  import dhAlbum from '@/components/dh-album'
  import erpAlbum from '@/components/erp-album'
  import erpItemAttr from '@/components/erp-item-add/erp-item-attr'
  import erpItemSku from '@/components/erp-item-add/erp-item-sku'
  import {
    categoryList,
    categoryGet,
    shippingTemplates,
    itemAftersaleList
  } from '@/api/dhgateApi'
  export default {
    name: 'ero-item-add',
    components: {
      erpAlbum,
      erpItemAttr,
      erpItemSku,
      dhAlbum
    },
    data() {
      return {
        hackReset: true,
        dialogImgListVisible: false,
        dialogDhImgListVisible: false,
        processImg: '',
        imgGroupType: '',
        attrValMap: {},
        attrMap: {},
        skuTableHead: [],
        skuArr: [],
        skuList: [],
        // skuData: [],
        skuMap: [],
        skuAttrMap: [],
        categoryName: '',
        dialogCategoryListVisible: false,
        catePubListList: [],
        categoryPubAttrOptions: [],
        shippingTemplateOptions: [],
        aftersaleOptions: [],
        catePubId: '',
        itemBaseAttrList: {},
        itemSaleAttrList: {},
        itemSaleAttrCheckedList: {},
        itemImgList: [],
        addItemForm: {
          issample: '',
          itemWholesaleRangeList: [],
          itemInventory: [],
          vaildDay: '',
          shippingModelId: '',
          catePubId: this.catePubId,
          itemAttrList: [],
          itemGroupId: '',
          itemBase: {
            videoUrl: '',
            keyWord1: '',
            keyWord2: '',
            keyWord3: '',
            itemName: '',
            shortDesc: '',
            htmlContent: ''
          },
          siteId: '',
          itemPackage: {
            height: '',
            length: '',
            packingQuantity: '',
            grossWeight: '',
            measureId: '',
            measureName: '',
            width: '',
            itemWeigthRange: []
          },
          sizeTemplateId: '',
          itemImgList: [],
          itemSkuList: [],
          itemAttrGroupList: [],
          itemSaleSetting: {
            leadingTime: '',
            maxSaleQty: '',
            priceConfigType: ''
          },
          afterSaleTemplateId: '',
          itemSpecSelfDefList: []
        }
        // itemcode: this.itemcode,
        // catePubId:this.catePubId,
        // localItemInfoId:this.localItemInfoId,

      }
    },
    props: {
      itemcode: {
        default: '',
        required: true
      },
      localItemInfo: {
        default: {},
        required: false
      },
      shopName: {
        default: '',
        required: false
      },
      imgUrlList: {
        default: [],
        required: false
      },
      pimgUrlList: {
        default: [],
        required: false
      },
      addButton: {
        default: false,
        required: false
      },
      dialogAppandToBody: {
        default: true,
        required: false
      },
      itemDetail: {
        default: {},
        required: false
      },
      isLocalLib: {
        default: true,
        required: false
      }
    },

    methods: {
      // 产品图替换
      handleReplaceImg(img) {
        console.info('handleReplaceImg', img)
        this.processImg = img
        this.dialogDhImgListVisible = true
      },
      // 产品图相册选择
      handleChooseDhAlbum(img) {
        const index = this.itemImgList.findIndex(itemImg => {
          return itemImg === this.processImg
        })
        this.itemImgList[index] = 'http://image.dhgate.com/' + img.imgUrl
        const arr = JSON.parse(JSON.stringify(this.itemImgList))
        this.itemImgList = []
        this.itemImgList = arr
        this.dialogDhImgListVisible = false
        // this.hackReset = false
        // this.$forceUpdate()
        // this.hackReset = true
        this.$forceUpdate()
        console.info('handleChooseDhAlbum', img, this.itemImgList)
      },
      handleClickImgGroup() {
        // console.info('handleClickImgGroup',this.imgGroupType)
        if (this.imgGroupType) {
          const imgList = this.imgTypeOptions[this.imgGroupType]
          const index = this.categoryPubAttrOptions.findIndex(categoryPubAttrOption => {
            // console.info('categoryPubAttrOption',categoryPubAttrOption)
            if (categoryPubAttrOption.selectedValues) {
              return categoryPubAttrOption.selectedValues.some(selectedValue => {
                return (selectedValue.picUrl != null)
              })
            } else {
              return false
            }
          })

          for (var i = 0; i < imgList.length; i++) {
            if (this.categoryPubAttrOptions[index].selectedValues[i]) {
              this.categoryPubAttrOptions[index].selectedValues[i].picUrl = imgList[i]
            }
          }

          // console.info('imgList',imgList)
        }
      },
      onAttrChange(categoryPubAttr) {
        this.addItemForm.itemAttrList = this.addItemForm.itemAttrList.filter(itemAttr => {
          return itemAttr.attrId !== categoryPubAttr.attrId
        })
        this.addItemForm.itemAttrList.push(categoryPubAttr)
        if (categoryPubAttr.buyAttr === '1') {
          this.$refs.erpItemSku.setCategoryPubAttrList(this.addItemForm.itemAttrList)
        }
        // console.info('onAttrChange',this.addItemForm,categoryPubAttr,categoryPubAttr.buyAttr,categoryPubAttr.buyAttr == '1')
      },
      onBaseAttrChange_1(changeValue, lineAttrNameCn) {
        this.$forceUpdate()
        const categoryPubAttr = this.categoryPubAttrOptions.find(cpa => {
          return cpa.lineAttrNameCn === lineAttrNameCn
        })
        const categoryPubAttrVal = categoryPubAttr.categoryPubAttrValList.find(cpav => {
          return cpav.lineAttrvalNameCn === changeValue
        })

        this.addItemForm.itemAttrList = this.addItemForm.itemAttrList.filter(itemAttr => {
          return itemAttr.itemAttrValList[0].attrNameCn !== lineAttrNameCn
        })
        this.addItemForm.itemAttrList.push({
          isbrand: 0,
          itemAttrValList: [{
            lineAttrvalName: categoryPubAttrVal.lineAttrvalName,
            attrId: categoryPubAttr.attrId,
            picUrl: categoryPubAttrVal.picUrl,
            attrName: categoryPubAttr.lineAttrName,
            attrNameCn: categoryPubAttr.lineAttrNameCn,
            brandId: '',
            lineAttrvalNameCn: categoryPubAttrVal.lineAttrvalNameCn,
            attrValId: categoryPubAttrVal.attrValId
          }]
        })
        // console.info('changeValue', changeValue, lineAttrNameCn)
      },
      onBaseAttrChange_2(checked, changeValue, lineAttrNameCn) {
        this.$forceUpdate()
        const categoryPubAttr = this.categoryPubAttrOptions.find(cpa => {
          return cpa.lineAttrNameCn === lineAttrNameCn
        })
        const categoryPubAttrVal = categoryPubAttr.categoryPubAttrValList.find(cpav => {
          return cpav.lineAttrvalNameCn === changeValue
        })
        const index = this.addItemForm.itemAttrList.findIndex(itemAttr => {
          return itemAttr.itemAttrValList[0].attrNameCn === lineAttrNameCn
        })
        if (checked) {
          if (index === -1) {
            this.addItemForm.itemAttrList.push({
              isbrand: 0,
              itemAttrValList: [{
                lineAttrvalName: categoryPubAttrVal.lineAttrvalName,
                attrId: categoryPubAttr.attrId,
                picUrl: categoryPubAttrVal.picUrl,
                attrName: categoryPubAttr.lineAttrName,
                attrNameCn: categoryPubAttr.lineAttrNameCn,
                brandId: '',
                lineAttrvalNameCn: categoryPubAttrVal.lineAttrvalNameCn,
                attrValId: categoryPubAttrVal.attrValId
              }]
            })
          } else {
            this.addItemForm.itemAttrList[index].itemAttrValList.push({
              lineAttrvalName: categoryPubAttrVal.lineAttrvalName,
              attrId: categoryPubAttr.attrId,
              picUrl: categoryPubAttrVal.picUrl,
              attrName: categoryPubAttr.lineAttrName,
              attrNameCn: categoryPubAttr.lineAttrNameCn,
              brandId: '',
              lineAttrvalNameCn: categoryPubAttrVal.lineAttrvalNameCn,
              attrValId: categoryPubAttrVal.attrValId
            })
          }
        } else {
          this.addItemForm.itemAttrList[index].itemAttrValList = this.addItemForm.itemAttrList[index].itemAttrValList.filter(
            attrVal => {
              return attrVal.lineAttrvalNameCn !== changeValue
            })
          if (this.addItemForm.itemAttrList[index].itemAttrValList.length === 0) {
            this.addItemForm.itemAttrList.splice(index, 1)
          }
        }
        // console.info('changeValue', changeValue, lineAttrNameCn)
      },
      onSaleAttrChange(checked, attrValName, index) {
        this.$forceUpdate()
        // console.info("onSaleAttrChange", checked, attrValName, index)
        if (checked) {
          const attr = this.categoryPubAttrOptions[index].categoryPubAttrValList.find(attrVal => {
            return attrVal.lineAttrvalNameCn === attrValName
          })
          if (attr) {
            attr.attrId = this.categoryPubAttrOptions[index].attrId
            attr.attrName = this.categoryPubAttrOptions[index].lineAttrNameCn
            this.categoryPubAttrOptions[index].selectedValues.push(attr)
          }
        } else {
          this.categoryPubAttrOptions[index].selectedValues = this.categoryPubAttrOptions[index].selectedValues.filter(
            val => {
              return attrValName !== val.lineAttrvalNameCn
            })
        }
        this.reBuild()
        // console.info("onSaleAttrChange", this.categoryPubAttrOptions, this.categoryPubAttrOptions[index])
      },
      getAddItemForm() {
        this.addItemForm.itemImgList = this.itemImgList
        this.addItemForm.catePubId = this.catePubId
        console.info('localItemInfo', this.localItemInfo)
        // console.info('getAddItemForm',this.itemImgList)
        return this.addItemForm
      },
      onSubmit() {
        console.info('this.addItemForm', this.itemBaseAttrList, this.itemSaleAttrList)
        console.info('this.addItemForm', this.addItemForm)
      },
      uploadSuccess(response, file, fileList, optionIndex, selectedIndex) {
        console.info('uploadSuccess', response, file, fileList, optionIndex, selectedIndex)
      },
      uploadAction() {
        return process.env.BASE_API + '/dh/upload'
      },
      clicked(img) {
        // console.info('clicked',img)
        const indexof = this.itemImgList.lastIndexOf(img)
        if (indexof >= 0) {
          this.itemImgList.splice(indexof, 1)
        }
        // this.addItemForm.itemImgList.splice(this.addItemForm.itemImgList.size+3,1,img)
        this.addItemImgList(img)
      },
      addItemImgList(img) {
        // let itemImgList = []
        // this.addItemForm.itemImgList.forEach((val,index)=>{
        //   itemImgList.push(val)
        // })
        // itemImgList.push(img)
        // addItemForm.itemImgList
        this.itemImgList.push(img)
        this.$forceUpdate()
      },
      deleteImg() {
        const itemImgList = this.$refs.itemImgList.getAllImg()
        console.info('deleteImg', itemImgList)
        this.itemImgList = itemImgList
      },
      choosed(img) {
        // console.info('choosed',img)
        this.addItemImgList(img)
        // console.info('choosed',img,this.itemImgList)
        this.$forceUpdate()
        const itemImgList = this.$refs.itemImgList.getAllImg()
        console.info('choosed', itemImgList, itemImgList.length, this.itemImgList.length, itemImgList.length + 1 ===
          this.itemImgList.length)
        if (itemImgList.length + 1 === this.itemImgList.length) {
          this.$message({
            message: '该图已存在',
            type: 'success'
          })
        }
        this.itemImgList = itemImgList
      },
      getCategoryList(parentId) {
        categoryList(this.shopName, parentId).then(res => {
          if (res.code === 0) {
            const catePubList = res.data.catePubList
            if (catePubList) {
              this.catePubListList.push(catePubList)
              // console.info('this.catePubListList',this.catePubListList)
            } else {
              this.catePubId = parentId
              this.getCategoryDetail()
              this.dialogCategoryListVisible = false

              // console.info("this.catePubId",this.catePubId)
            }
          }
        })
      },
      getShippingTemplates() {
        shippingTemplates(this.shopName).then(res => {
          this.shippingTemplateOptions = res.data.shippingModelList
        })
      },
      getAftersaleOptions() {
        itemAftersaleList(this.shopName).then(res => {
          this.aftersaleOptions = res.data.afterSaleList
        })
      },
      getCategoryDetail() {
        categoryGet(this.shopName, this.catePubId).then(res => {
          if (res.code === 0) {
            this.categoryPubAttrOptions = res.data.categoryPubAttrList
            for (var i = 0; i < this.categoryPubAttrOptions.length; i++) {
              if (this.categoryPubAttrOptions[i].buyAttr === '1') {
                this.categoryPubAttrOptions[i].selectedValues = []
              }
            }
            const categoryPubAttrList = res.data.categoryPubAttrList
            for (const s of categoryPubAttrList) {
              const categoryPubAttr = JSON.parse(JSON.stringify(s))
              let attrValName = []
              categoryPubAttr.categoryPubAttrValList = []
              if (categoryPubAttr.type === 2) {
                categoryPubAttr.categoryPubAttrValList.push('')
                attrValName = ''
              }
              if (categoryPubAttr.buyAttr === 0) {
                this.itemBaseAttrList[categoryPubAttr.lineAttrNameCn] = attrValName
              } else {
                this.itemSaleAttrList[categoryPubAttr.lineAttrNameCn] = attrValName
                this.skuAttrMap[categoryPubAttr.lineAttrNameCn] = [] // 初始化sku属性列，用于sku计算使用
              }
            }
            this.initFormData()
            // console.info("this.itemBaseAttrList this.itemSaleAttrList", this.itemBaseAttrList, this.itemSaleAttrList)
            // console.info("this.categoryPubAttrOptions", this.categoryPubAttrOptions)
          }
        })
      },
      initFormData() {
        if (this.localItemInfo.itemBase) {
          const localItemInfo = JSON.parse(JSON.stringify(this.localItemInfo))
          this.addItemForm.itemBase.itemName = localItemInfo.itemDesc.productName
          this.addItemForm.itemBase.shortDesc = localItemInfo.itemDesc.shortDesc
          this.addItemForm.itemBase.htmlContent = localItemInfo.htmlContent
          this.addItemForm.itemPackage.height = localItemInfo.itemDesc.height
          this.addItemForm.itemPackage.length = localItemInfo.itemDesc.length
          this.addItemForm.itemPackage.packingQuantity = localItemInfo.itemDesc.quantity
          this.addItemForm.itemPackage.grossWeight = localItemInfo.itemDesc.weight
          this.addItemForm.itemPackage.measureName = localItemInfo.itemDesc.measureName
          // this.addItemForm.itemPackage.measureId = this.localItemInfo.itemDesc.
          this.addItemForm.itemPackage.width = localItemInfo.itemDesc.width
          this.itemImgList = []
          for (const imgUrl of localItemInfo.itemDesc.imgUrlList) {
            this.itemImgList.push(imgUrl)
          }
          // this.addItemForm.itemSkuList = this.sku
          // this.imgGroupList
        } else if (this.itemDetail.itemBase) {
          const itemDetail = JSON.parse(JSON.stringify(this.itemDetail))
          this.addItemForm = itemDetail
          this.itemImgList = []
          for (const itemImg of itemDetail.itemImgList) {
            this.itemImgList.push('http://image.dhgate.com/' + itemImg.imgUrl)
          }
          for (const index in this.categoryPubAttrOptions) {
            const defaultValue = this.itemDetail.itemAttrList.find(itemAttr => {
              return this.categoryPubAttrOptions[index].attrId === itemAttr.attrId
            })
            this.categoryPubAttrOptions[index].defaultValue = defaultValue
          }
          console.info('this.itemDetail', itemDetail, this.categoryPubAttrOptions)
        }
      },
      reBuild: function(val, oldVal) {
        var vm = this
        // var oriSkus = JSON.parse(JSON.stringify(this.addItemForm.itemSkuList))
        var vmSkus = this.addItemForm.itemSkuList = []
        var propertyChecked = []
        // var skuCount = 1
        var ori = []
        vm.categoryPubAttrOptions.forEach((val, index) => {
          if (val.buyAttr !== 1) return
          var selectValues = val.selectedValues
          if (selectValues.length > 0) {
            propertyChecked.push(index)
            // skuCount *= selectValues.length
            ori.push(selectValues)
          }
        })
        // console.info('ori', ori)
        var ret = descartes(ori)
        // console.info('ret', ret)
        for (var i = 0; i < ret.length; i++) {
          var sku = {
            skuCode: '',
            retailPrice: '',
            saleStatus: '1'
          }
          sku.itemSkuAttrvalList = []
          ret[i].forEach((r, index) => {
            sku.itemSkuAttrvalList.push({
              attrId: r.attrId,
              attrValId: r.attrValId,
              attrValName: r.lineAttrvalNameCn,
              attrName: r.attrName,
              sizeSpecType: '1'
            })
          })
          // oriSkus.
          // if (oriSkus.length >= ret.length) {
          //   sku.skuCode = oriSkus[i].skuCode;
          //   sku.retailPrice = oriSkus[i].retailPrice;
          //   sku.saleStatus = oriSkus[i].saleStatus;
          // } else {
          //   if (i < oriSkus.length) {
          //     sku.skuCode = oriSkus[i].skuCode;
          //     sku.retailPrice = oriSkus[i].retailPrice;
          //     sku.saleStatus = oriSkus[i].saleStatus;
          //   } else {
          //     sku.skuCode = "";
          //     sku.retailPrice = "";
          //     sku.saleStatus = "1";
          //   }
          // }
          vmSkus.push(sku)
        }
        // console.info("this.skuData",this.skuData)
      },
      // getValueName: function(sku, property) {
      //   var valueName = ''
      //   $.each(sku.values,
      //     function() {
      //       var _this = this
      //       if (this.propertyId === property.Id) {
      //         $.each(property.selectedValues, function() {
      //           if (_this.valueId === this.Id) {
      //             valueName = this.Name
      //             return false
      //           }
      //         })
      //       }
      //     })
      //   return valueName
      // },
      allCheckedLength: function() {
        // console.info("allCheckedLength")
        var length = 0
        this.categoryPubAttrOptions.forEach((val) => {
          length += val.length
        })
        return length
      },
      getAttrValName(row, attrName) {
        // console.info("getAttrValName",row,attrName)
        const ret = row.itemSkuAttrvalList.find(attrVal => {
          return attrVal.attrName === attrName
        })
        // console.info("getAttrValName",row,attrName,ret)
        if (ret) {
          return ret.attrValName
        }
        return ''
      },
      onUploadSuccess(response, file, fileList) {
        // let fileUrl = response.data.fileUrl
        // if (!this.imgUrlList.null) {
        //   this.imgUrlList.null = []
        // }
        // this.imgUrlList.null.push(fileUrl)
        // console.info(this.imgUrlList)
        // this.$forceUpdate()
        this.addItemImgList('http://image.dhgate.com/' + response.data.imgUrl)
        // console.info('choosed',img,this.itemImgList)
        this.$forceUpdate()

        console.info('onUploadSuccess', response, file, fileList)
      }
    },
    computed: {
      // console.info("computed",this.localItemInfo)
      imgTypeOptions: function() {
        const imgTypeOptions = {}
        // console.info(this.imgUrlList,this.pimgUrlList)
        var type = ''
        for (type in this.imgUrlList) {
          imgTypeOptions[type] = this.imgUrlList[type]
        }
        for (type in this.pimgUrlList) {
          imgTypeOptions[type] = this.pimgUrlList[type]
        }
        return imgTypeOptions
      },
      allImg: function() {
        var arr = []
        // console.info('imgUrlList',this.imgUrlList)
        var i = 0
        for (const img in this.itemImgList) {
          // console.info('allImg',img)
          arr.push(this.itemImgList[img])
        }
        for (var type in this.imgUrlList) {
          // console.info('allImg,type',type)
          for (i = 0; i < this.imgUrlList[type].length; i++) {
            arr.push(this.imgUrlList[type][i])
          }
        }
        for (type in this.pimgUrlList) {
          // console.info('allImg,type',type)
          for (i = 0; i < this.pimgUrlList[type].length; i++) {
            arr.push(this.pimgUrlList[type][i])
          }
        }

        return arr
      }
    },
    watch: {
      itemImgList(newValue, OldValue) {
        console.info('watch itemImgList', newValue, OldValue)
        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
        if (newValue.length === OldValue.length) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      },
      categoryPubAttrOptions(newValue, OldValue) {
        const localItemInfo = JSON.parse(JSON.stringify(this.localItemInfo))
        if (!localItemInfo.itemAttrList) return
        localItemInfo.itemAttrList.forEach(itemAttr => {
          const categoryPubAttrOptionsIndex = this.categoryPubAttrOptions.findIndex(cpo => {
            return (cpo.lineAttrName === itemAttr.attrName) || (cpo.attrId === itemAttr.attrId)
          })
          this.attrMap[this.categoryPubAttrOptions[categoryPubAttrOptionsIndex].lineAttrNameCn] = this.categoryPubAttrOptions[
            categoryPubAttrOptionsIndex]
          this.attrMap[this.categoryPubAttrOptions[categoryPubAttrOptionsIndex].attrId] = this.categoryPubAttrOptions[
            categoryPubAttrOptionsIndex]
          const categoryPubAttrOption = this.categoryPubAttrOptions[categoryPubAttrOptionsIndex]
          categoryPubAttrOption.categoryPubAttrValList.forEach(cpav => {
            this.attrValMap[cpav.lineAttrvalName] = cpav
            this.attrValMap[cpav.attrValId] = cpav
          })
          const itemAttrValList = []
          itemAttr.itemAttrValList.forEach(itemAttrVal => {
            // console.info('itemAttrVal',itemAttrVal)
            let ret = this.attrValMap[itemAttrVal.attrValId]
            // console.info(this.attrValMap,this.attrValMap[itemAttrVal.attrValId])
            if (!ret) {
              ret = this.attrValMap[itemAttrVal.attrValName]
            }
            if (ret) {
              ret.picUrl = itemAttrVal.picUrl
              itemAttrValList.push({
                lineAttrvalName: ret.lineAttrvalName,
                attrId: categoryPubAttrOption.attrId,
                picUrl: itemAttrVal.picUrl,
                attrName: categoryPubAttrOption.lineAttrName,
                attrNameCn: categoryPubAttrOption.lineAttrNameCn,
                brandId: '',
                lineAttrvalNameCn: ret.lineAttrvalNameCn,
                attrValId: ret.attrValId
              })
              // console.info('this.itemBaseAttrList',this.itemBaseAttrList)
              //               console.info('categoryPubAttrOption',categoryPubAttrOption,'ret',ret)
              //               console.info('categoryPubAttrOption.buyAttr',categoryPubAttrOption.buyAttr,categoryPubAttrOption.buyAttr == '0')
              if (categoryPubAttrOption.buyAttr === '0') {
                if (categoryPubAttrOption.type === '1') {
                  this.itemBaseAttrList[categoryPubAttrOption.lineAttrNameCn].push(ret.lineAttrvalNameCn)
                } else {
                  this.itemBaseAttrList[categoryPubAttrOption.lineAttrNameCn] = ret.lineAttrvalNameCn
                }
              } else {
                const attr = ret
                this.itemSaleAttrList[categoryPubAttrOption.lineAttrNameCn].push(ret.lineAttrvalNameCn)
                attr.attrId = categoryPubAttrOption.attrId
                attr.attrName = categoryPubAttrOption.lineAttrNameCn
                // console.info(index, this.categoryPubAttrOptions, categoryPubAttrOption, this.categoryPubAttrOptions[
                //   index].selectedValues)
                this.categoryPubAttrOptions[categoryPubAttrOptionsIndex].selectedValues.push(attr)
              }

              // this.reBuild()
            }
          })
          this.addItemForm.itemAttrList.push({
            isbrand: 0,
            itemAttrValList: itemAttrValList
          })
        })
        // console.info('this.localItemInfo.itemSkuList', this.localItemInfo.itemSkuList)
        this.localItemInfo.itemSkuList.forEach(itemSku => {
          var sku = {
            skuCode: itemSku.skuCode,
            retailPrice: itemSku.retailPrice,
            saleStatus: itemSku.saleStatus,
            itemSkuAttrvalList: []
          }
          // console.info('itemSku.itemSkuValList', itemSku.itemSkuValList)
          itemSku.itemSkuValList.forEach(skuVal => {
            // let attrName = this.attrMap[skuVal.attrId].lineAttrNameCn
            // if(!attrName) attrName = this.attrMap[skuVal.attrNameCn].lineAttrNameCn
            // let attrValName = this.attrValMap[skuVal.attrValId].lineAttrvalNameCn
            sku.itemSkuAttrvalList.push({
              attrId: skuVal.attrId,
              attrValId: skuVal.attrValId,
              attrValName: this.attrValMap[skuVal.attrValId].lineAttrvalNameCn,
              attrName: this.attrMap[skuVal.attrId].lineAttrNameCn,
              sizeSpecType: skuVal.sizeSpecType
            })
          })
          this.addItemForm.itemSkuList.push(sku)
        })
        // this.addItemForm.itemSkuList = this.localItemInfo.itemSkuList
      }
    },
    created() {
      this.getAftersaleOptions()
      this.getShippingTemplates()
      this.initFormData()
    },
    mounted() {}
  }

  function descartes(list) {
    // parent上一级索引;count指针计数
    var point = {}
    var result = []
    var pIndex = null
    var tempCount = 0
    var temp = []
    var index = ''
    var loopNum = 1
    // 根据参数列生成指针对象
    for (index in list) {
      if (typeof list[index] === 'object') {
        point[index] = {
          'parent': pIndex,
          'count': 0
        }
        pIndex = index
      }
    }
    // 单维度数据结构直接返回
    if (pIndex == null) {
      return list
    }
    // 动态生成笛卡尔积
    while (loopNum === 1) {
      loopNum = 1
      for (index in list) {
        tempCount = point[index]['count']
        temp.push(list[index][tempCount])
      }
      // 压入结果数组
      result.push(temp)
      temp = []
      // 检查指针最大值问题
      while (loopNum === 1) {
        loopNum = 1
        if (point[index]['count'] + 1 >= list[index].length) {
          point[index]['count'] = 0
          pIndex = point[index]['parent']
          if (pIndex == null) {
            return result
          }
          // 赋值parent进行再次检查
          index = pIndex
        } else {
          point[index]['count']++
          break
        }
      }
    }
  }
</script>

<style>
</style>
