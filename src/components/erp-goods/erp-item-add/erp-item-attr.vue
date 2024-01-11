<template>
  <el-form-item :label="categoryPubAttr.line_attr_name_cn" :rules="rules" class="mini-table">

    <el-row v-if="categoryPubAttr.type == 4">
      <el-col :span="11" style="margin-right:10px">
        <el-input size='mini' v-model="inputZH" @change="onInputChange" placeholder="请输入中文"></el-input>
      </el-col>
      <el-col :span="11">
        <el-input size='mini' v-model="inputEN" @input="onInputChange" placeholder="请输入英文"></el-input>
      </el-col>
    </el-row>

    <el-select size='mini' v-if="categoryPubAttr.type == 2" placeholder="请选择" v-model="itemBaseAttrSelect" @change="onSelectChange"
      filterable>
      <el-option v-for="categoryPubAttrVal in categoryPubAttr.category_pub_attr_val_list" :key="categoryPubAttrVal.lineAttrvalNameCn"
        :label="categoryPubAttrVal.lineAttrvalNameCn" :value="categoryPubAttrVal.lineAttrvalNameCn">
        <span style="float: left">{{ categoryPubAttrVal.lineAttrvalNameCn }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ categoryPubAttrVal.lineAttrvalName }}</span>
      </el-option>
    </el-select>

    <el-row v-if="returnValue.lineAttrNameCn === '尺码'">
      供货中尺码：
      <el-tag v-for="(item,index) in supplySizes" :key="index">{{ item.name }}</el-tag>
    </el-row>
    <el-row v-if="returnValue.lineAttrNameCn === '颜色'">
      供货中颜色：
      <el-tag v-for="(item,index) in colors" :key="index">{{ item.name }}</el-tag>
    </el-row>

    <el-checkbox v-if="categoryPubAttr.type ==1" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <el-checkbox-group v-if="categoryPubAttr.type ==1" v-model="itemBaseAttrCheckboxGroupList" class="mini-checkbox">
      <el-checkbox v-for="categoryPubAttrVal in categoryPubAttr.category_pub_attr_val_list" :label="categoryPubAttrVal.lineAttrvalNameCn"
        :key="categoryPubAttrVal.attrValId" @change="val=>{onCheckboxGroupChange(val,categoryPubAttrVal.lineAttrvalNameCn)}">{{categoryPubAttrVal.lineAttrvalNameCn}}</el-checkbox>
    </el-checkbox-group>

    <el-table v-if="categoryPubAttr.buy_attr == 1 && returnValue.lineAttrNameCn !== undefined && returnValue.lineAttrNameCn === '尺码'"
      :data="returnValue.itemAttrValList" border style="width: 100%" size="mini">
      <el-table-column :label="returnValue.lineAttrNameCn" prop="lineAttrvalNameCn">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">{{ scope.row.lineAttrvalNameCn }}</el-col>
            <el-col :span="12">
              <el-input size="mini" v-model="scope.row.lineAttrvalName"></el-input>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>

    <el-table v-if="categoryPubAttr.buy_attr == 1 && returnValue.lineAttrNameCn !== undefined && returnValue.lineAttrNameCn === '颜色'"
      :data="returnValue.itemAttrValList" border style="width: 100%" size="mini">
      <el-table-column :label="returnValue.lineAttrNameCn" prop="lineAttrvalNameCn">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">{{ scope.row.lineAttrvalNameCn }}</el-col>
            <el-col :span="12">
              <el-input size="mini" v-model="scope.row.lineAttrvalName"></el-input>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="'自定义' + returnValue.lineAttrNameCn + '图片（JPG格式，≤200K，可不添加）'" prop="line_attr_name">
        <template slot-scope="scope">
          <erp-item-photo-attr v-model="scope.row.picUrl" :uploadUrl="upload_url" :imgType="'albu'"></erp-item-photo-attr>
        </template>
      </el-table-column>
    </el-table>

  </el-form-item>
</template>

<script>
  import erpItemPhotoAttr from '@/components/erp-goods/erp-item-add/erp-item-photo-attr'
  import linsd_arr from 'linsd_arr'

  export default {
    name: 'erpItemAttr',
    components: {
      erpItemPhotoAttr
    },
    data() {
      return {
        upload_url: process.env.BASE_API + '/lv/goods/upload?shopId=' + this.shopId,

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
      // commodityInfo: {
      //   default: () => [],
      //   required: false
      // },
      categoryPubAttr: {
        type: Object,
        default: {},
        require: true
      },
      itemAttrList: {
        type: Object,
        default: () => {},
        require: true
      },
      shopId: {
        default: '',
        required: true
      }
    },
    methods: {
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
        this.emitValue()
        // console.info('onSelectChange', changeValue, returnValue)
      },
      onCheckboxGroupChange(checked, changeValue) {
        const returnValue = this.getReturnAttrBase()
        if (this.returnValue.lineAttrNameCn === undefined) {
          this.returnValue = returnValue
        }

        for (const cpav of this.categoryPubAttr.category_pub_attr_val_list) {
          const has = this.itemBaseAttrCheckboxGroupList.some(chaboxVal => {
            return cpav.lineAttrvalNameCn === chaboxVal
          })
          if (has) {
            var isExist = this.returnValue.itemAttrValList.filter(item => {
              return item.lineAttrvalNameCn === cpav.lineAttrvalNameCn
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
          var index = linsd_arr.getIndex(this.returnValue.itemAttrValList, 'lineAttrvalNameCn', changeValue)
          this.returnValue.itemAttrValList.splice(index, 1)
        }
        this.emitValue()
      },
      initCheckboxGroupChange(defaultValue) {
        // console.info('onCheckboxGroupChange', checked, changeValue)
        const returnValue = this.getReturnAttrBase()
        returnValue.itemAttrValList = defaultValue.itemAttrValList
        this.returnValue = returnValue

        if (this.returnValue.lineAttrNameCn === '颜色') {
          this.categoryPubAttr.category_pub_attr_val_list.push({
            'lineAttrvalName': 'Customize',
            'lineAttrvalNameCn': '自定义',
            'attrName': 'Color',
            'attrId': '',
            'picUrl': null,
            'brandId': null,
            'attrValId': ''
          })
        }
        this.emitValue()
      },
      handleCheckAllChange(val) {
        this.itemBaseAttrCheckboxGroupList = val ? this.allCheckGroup : []
        const returnValue = this.getReturnAttrBase()
        for (const cpav of this.categoryPubAttr.category_pub_attr_val_list) {
          const has = this.itemBaseAttrCheckboxGroupList.some(chaboxVal => {
            return cpav.lineAttrvalNameCn === chaboxVal
          })
          if (has) {
            returnValue.itemAttrValList.push(cpav)
          }
        }
        this.returnValue = returnValue
        this.isIndeterminate = false
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
                this.itemBaseAttrCheckboxGroupList.push(itemAttrVal.lineAttrvalNameCn)
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
    },
    mounted() {
      // console.info('created erp-item-attr', this.itemAttrList)
    }
  }
</script>

<style scoped>
  .mini-checkbox {
    line-height: 20px;
  }
</style>
