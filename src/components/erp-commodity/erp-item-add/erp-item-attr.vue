<template>
  <el-form-item :label="categoryPubAttr.line_attr_name_cn" :rules="rules" class="mini-table">

    <el-row v-if="categoryPubAttr.type == 4">
      <el-col :span="11" style="margin-right:10px"><el-input size='mini' v-model="inputZH" @change="onInputChange" placeholder="请输入中文" ></el-input></el-col>
      <el-col :span="11"><el-input size='mini' v-model="inputEN" @input="onInputChange" placeholder="请输入英文"></el-input></el-col>
    </el-row>

    <el-select size='mini' v-if="categoryPubAttr.type == 2" placeholder="请选择" v-model="itemBaseAttrSelect" @change="onSelectChange"
      filterable>
      <el-option v-for="categoryPubAttrVal in categoryPubAttr.category_pub_attr_val_list" :key="categoryPubAttrVal.lineAttrvalNameCn"
        :label="categoryPubAttrVal.lineAttrvalNameCn" :value="categoryPubAttrVal.lineAttrvalNameCn">
        <span style="float: left">{{ categoryPubAttrVal.lineAttrvalNameCn }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ categoryPubAttrVal.lineAttrvalName }}</span>
      </el-option>
    </el-select>

    <div v-if="categoryPubAttr.line_attr_name_cn === '尺码'">
      <el-checkbox v-if="categoryPubAttr.type ==1" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" disabled>全选</el-checkbox>
      <el-checkbox-group v-if="categoryPubAttr.type ==1" v-model="itemBaseAttrCheckboxGroupList" class="mini-checkbox">
        <el-checkbox v-for="categoryPubAttrVal in categoryPubAttr.category_pub_attr_val_list" :label="categoryPubAttrVal.attrValId"
          :key="categoryPubAttrVal.attrValId" @change="val=>{onCheckboxGroupChange(val,categoryPubAttrVal.attrValId)}">{{categoryPubAttrVal.lineAttrvalNameCn}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else-if="categoryPubAttr.line_attr_name_cn === '颜色'">
      <el-checkbox v-if="categoryPubAttr.type ==1" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" disabled>全选</el-checkbox>
      <el-checkbox-group v-if="categoryPubAttr.type ==1" v-model="itemBaseAttrCheckboxGroupList" class="mini-checkbox">
        <el-checkbox v-for="categoryPubAttrVal in categoryPubAttr.category_pub_attr_val_list" :label="categoryPubAttrVal.attrValId"
          :key="categoryPubAttrVal.attrValId" @change="val=>{onCheckboxGroupChange(val,categoryPubAttrVal.attrValId)}">{{categoryPubAttrVal.lineAttrvalNameCn}}</el-checkbox>
      </el-checkbox-group>
    </div>
    <div v-else>
      <el-checkbox v-if="categoryPubAttr.type ==1" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
      <el-checkbox-group v-if="categoryPubAttr.type ==1" v-model="itemBaseAttrCheckboxGroupList" class="mini-checkbox">
        <el-checkbox v-for="categoryPubAttrVal in categoryPubAttr.category_pub_attr_val_list" :label="categoryPubAttrVal.attrValId"
          :key="categoryPubAttrVal.attrValId" @change="val=>{onCheckboxGroupChange(val,categoryPubAttrVal.attrValId)}">{{categoryPubAttrVal.lineAttrvalNameCn}}</el-checkbox>
      </el-checkbox-group>
    </div>

    <el-table
      v-if="categoryPubAttr.buy_attr == 1 && returnValue.lineAttrNameCn !== undefined && (returnValue.lineAttrNameCn === '尺码' || returnValue.lineAttrNameCn === '尺寸')"
      :data="returnValue.itemAttrValList"
      border style="width: 100%" size="mini">
      <el-table-column :label="returnValue.lineAttrNameCn" prop="lineAttrvalNameCn">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">{{ scope.row.lineAttrvalNameCn }}</el-col>
            <el-col :span="8">
              <el-input size="mini" v-model="scope.row.lineAttrvalName" @blur="onChangeSize"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button v-if="scope.row.lineAttrvalNameCn === ''" @click="deleteAttr(scope.row.lineAttrvalName)" type="danger" size="mini">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      v-if="categoryPubAttr.buy_attr == 1 && returnValue.lineAttrNameCn !== undefined && (returnValue.lineAttrNameCn === '颜色' || returnValue.lineAttrNameCn === '镜框颜色')"
      :data="returnValue.itemAttrValList"
      border style="width: 100%" size="mini">
      <el-table-column :label="returnValue.lineAttrNameCn" prop="lineAttrvalNameCn">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">{{ scope.row.lineAttrvalNameCn }}</el-col>
            <el-col :span="12"><el-input size="mini" v-model="scope.row.lineAttrvalName" @blur="onChangeSize"></el-input></el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="'自定义' + returnValue.lineAttrNameCn + '图片（JPG格式，≤200K，可不添加）'" prop="line_attr_name">
        <template slot-scope="scope">
          <erp-item-photo-one v-model="scope.row.picUrl" @change="onChangePic(scope.row)" :uploadUrl="upload_url" :recommendList="recommendList" :returnFile="scope.row.picUrl" :imgType="'item_images'"></erp-item-photo-one>
        </template>
      </el-table-column>
    </el-table>

  </el-form-item>
</template>

<script>
  import erpItemPhotoOne from '@/components/erp-commodity/erp-item-add/erp-item-photo-one'
  import linsd_arr from 'linsd_arr'

  export default {
    name: 'erpItemAttr',
    components: {
      erpItemPhotoOne
    },
    data() {
      return {
        upload_url: process.env.BASE_API + '/lv/goodsCollectionList/uploadImg',

        inputEN: '',
        inputZH: '',
        itemBaseAttrSelect: '',
        itemBaseAttrCheckboxGroupList: [],
        // checkboxGroupValue: [],
        returnValue: {},

        isIndeterminate: true,
        checkAll: false,
        allCheckGroup: [],

        rules: [],

        // 供货中尺码
        supplySizes: [],
        colors: []
      }
    },
    computed: {},
    watch: {},
    props: {
      id: {
        default: () => 0,
        required: true
      },
      recommendList: {
        default: () => [],
        required: false
      },
      categoryPubAttr: {
        type: Object,
        default: {},
        require: true
      },
      itemAttrList: {
        type: Object,
        default: () => {},
        require: true
      }
    },
    methods: {
      handleItemAttrList() {
        // goodsCollectionItemAttrList({ goods_collection_id: this.id, item_attr: this.returnValue }).then(res => {
        //   if (res.code === 0) {
        //     this.$message({
        //       message: '操作成功',
        //       type: 'success'
        //     })

        //     this.emitValue()
        //   }
        // })
      },
      uploadAction() {
        return process.env.BASE_API + '/dh/upload'
      },
      onChangePic(row) {
        const reg = /(https?:\/\/)[^\/]+([[^:blank\/]]*)/g

        row.localImg = row.picUrl.replace(reg, '')
        // this.handleItemAttrList()
        this.emitValue()
      },
      onChangeSize() {
        // this.handleItemAttrList()
        this.emitValue()
      },
      onInputChange() {
        const returnValue = this.getReturnAttrBase()
        returnValue.itemAttrValList[0] = {
          lineAttrvalName: this.inputEN,
          lineAttrvalNameCn: this.inputZH,
          attrName: returnValue.lineAttrName,
          attrId: returnValue.attrId,
          picUrl: '',
          brandId: '',
          attrValId: ''
        }

        this.returnValue = returnValue
        // this.handleItemAttrList()
        this.emitValue()
      },
      onSelectChange(changeValue) {
        const categoryPubAttrVal = this.categoryPubAttr.category_pub_attr_val_list.find(cpav => {
          return cpav.lineAttrvalNameCn === changeValue
        })
        const returnValue = this.getReturnAttrBase()
        var itemAttrVal = {
          lineAttrvalName: categoryPubAttrVal.lineAttrvalName,
          lineAttrvalNameCn: categoryPubAttrVal.lineAttrvalNameCn,
          attrName: returnValue.lineAttrName,
          attrId: returnValue.attrId,
          picUrl: categoryPubAttrVal.picUrl,
          brandId: '',
          attrValId: categoryPubAttrVal.attrValId
        }

        returnValue.itemAttrValList.push(itemAttrVal)
        this.returnValue = returnValue
        // this.handleItemAttrList()
        this.emitValue()
        // console.info('onSelectChange', changeValue, returnValue)
      },
      deleteAttr(lineAttrvalName) {
        var index = linsd_arr.getIndex(this.returnValue.itemAttrValList, 'lineAttrvalName', lineAttrvalName)
        this.returnValue.itemAttrValList.splice(index, 1)

        // this.handleItemAttrList()
        this.emitValue()
      },
      onCheckboxGroupChange(checked, changeValue) {
        const returnValue = this.getReturnAttrBase()
        if (this.returnValue.lineAttrNameCn === undefined) {
          this.returnValue = returnValue
        }

        for (const cpav of this.categoryPubAttr.category_pub_attr_val_list) {
          const has = this.itemBaseAttrCheckboxGroupList.some(chaboxVal => {
            return cpav.attrValId === chaboxVal
          })
          if (has) {
            var isExist = this.returnValue.itemAttrValList.filter(item => {
              return item.attrValId === cpav.attrValId
            })
            if (isExist.length <= 0) {
              this.returnValue.itemAttrValList.push({
                lineAttrvalName: cpav.lineAttrvalName,
                lineAttrvalNameCn: cpav.lineAttrvalNameCn,
                attrName: returnValue.lineAttrName,
                attrId: returnValue.attrId,
                picUrl: cpav.picUrl,
                brandId: '',
                attrValId: cpav.attrValId
              })
            }
          }
        }

        // 取消
        if (checked === false) {
          var index = linsd_arr.getIndex(this.returnValue.itemAttrValList, 'attrValId', changeValue)
          this.returnValue.itemAttrValList.splice(index, 1)
        }

        // this.handleItemAttrList()
        this.emitValue()
      },
      initCheckboxGroupChange(defaultValue) {
        // console.info('onCheckboxGroupChange', checked, changeValue)
        const returnValue = this.getReturnAttrBase()
        returnValue.itemAttrValList = defaultValue.itemAttrValList
        this.returnValue = returnValue

        if (this.returnValue.lineAttrNameCn === '颜色' || this.returnValue.lineAttrNameCn === '镜框颜色') {
          this.categoryPubAttr.category_pub_attr_val_list.push({
            'lineAttrvalName': 'Customize',
            'lineAttrvalNameCn': '自定义',
            'attrName': 'Color',
            'attrId': this.returnValue.attrId,
            'picUrl': null,
            'brandId': null,
            'attrValId': 0
          })
        }
        this.emitValue()
      },
      handleCheckAllChange(val) {
        this.itemBaseAttrCheckboxGroupList = val ? this.allCheckGroup : []
        const returnValue = this.getReturnAttrBase()
        for (const cpav of this.categoryPubAttr.category_pub_attr_val_list) {
          const has = this.itemBaseAttrCheckboxGroupList.some(chaboxVal => {
            return cpav.attrValId === chaboxVal
          })
          if (has) {
            returnValue.itemAttrValList.push(cpav)
          }
        }
        this.returnValue = returnValue
        this.isIndeterminate = false
        // this.handleItemAttrList()
        this.emitValue()
      },
      emitValue() {
        this.$emit('value', this.returnValue)
      },
      getAllCheckGroup() {
        if (this.categoryPubAttr.type !== 1 || this.categoryPubAttr.type !== 0) {
          return
        }
        for (const cpav of this.categoryPubAttr.category_pub_attr_val_list) {
          this.allCheckGroup.push(cpav.lineAttrvalNameCn)
        }
      },
      getReturnAttrBase() {
        const categoryPubAttr = this.categoryPubAttr
        const ret = {
          isother: categoryPubAttr.isother,
          required: categoryPubAttr.required,
          catePubId: categoryPubAttr.cate_pub_id,
          type: categoryPubAttr.type,
          lineAttrNameCn: categoryPubAttr.line_attr_name_cn,
          isBrand: categoryPubAttr.is_brand,
          isbrand: categoryPubAttr.is_brand,
          saleAttr: categoryPubAttr.sale_attr,
          childAttrId: categoryPubAttr.child_attr_id,
          buyAttr: categoryPubAttr.buy_attr,
          catePubAttrId: categoryPubAttr.cate_pub_attr_id,
          style: categoryPubAttr.style,
          attrId: categoryPubAttr.attr_id,
          defined: categoryPubAttr.defined,
          located: categoryPubAttr.located,
          lineAttrName: categoryPubAttr.line_attr_name,
          itemAttrValList: []
        }
        return ret
      },
      initComp() {
        const defaultValue = this.itemAttrList
        if (this.categoryPubAttr.required === 1) {
          this.rules = [{
            required: true,
            message: '不能为空'
          }]
        }

        if (defaultValue) {
          switch (this.categoryPubAttr.type) {
            case 4:
              this.inputEN = defaultValue.itemAttrValList[0].lineAttrvalName
              this.inputZH = defaultValue.itemAttrValList[0].lineAttrvalNameCn
              break
            case 2:
              var val = defaultValue.itemAttrValList[0].lineAttrvalNameCn
              this.itemBaseAttrSelect = val
              break
            case 1 || 0:
              if (!defaultValue.itemAttrValList) {
                break
              }
              for (const itemAttrVal of defaultValue.itemAttrValList) {
                this.itemBaseAttrCheckboxGroupList.push(itemAttrVal.attrValId)
              }

              this.initCheckboxGroupChange(defaultValue)
              break
            default:
              break
          }
        }
      }
    },
    created() {
      this.getAllCheckGroup()

      this.initComp()
    }
  }
</script>

<style scoped>
  .mini-checkbox {
    line-height: 20px;
  }
</style>
