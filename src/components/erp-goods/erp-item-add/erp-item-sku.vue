<template>
  <el-row>
    <el-radio-group v-model="updateItemForm.itemSaleSetting.priceConfigType" @change="changePriceConfigType">
      <el-radio size="mini" value="2" label="2">统一设置价格</el-radio>
      <el-radio size="mini" value="1" label="1">分别设置价格</el-radio>
    </el-radio-group>

    <!--统一设置价格-->
    <el-row v-if="updateItemForm.itemSaleSetting.priceConfigType === '2'" style="margin-bottom:10px">
      <el-table :data="updateItemForm.itemWholesaleRangeList" :show-header='false' style="margin-top:10px;" border>
        <el-table-column prop="startQty">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.startQty" style="width:100px"></el-input> {{ getCurMeasure() }}以上
          </template>
        </el-table-column>
        <el-table-column prop="discount">
          <template slot-scope="scope">
            预计收入：US$ <el-input size="mini" v-model="scope.row.discount" style="width:100px"></el-input> /{{ getCurMeasure() }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            买家价格： US$ {{ getBuyerPrice(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column width="100px">
          <template slot-scope="scope">
            <el-button size='mini' type='danger' @click="delItemWholesaleRangeList(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="updateItemForm.itemWholesaleRangeList.length < 4" type='primary' size="mini" style="margin-top:10px"
        @click="addItemWholesaleRangeList">+ 增加区间</el-button>
    </el-row>
    <!-- 分别设置价格 -->
    <el-row v-else style="margin-bottom:10px">
      <el-table :data="updateItemForm.itemWholesaleRangeList" :show-header='false' style="margin-top:10px;" border>
        <el-table-column prop="startQty">
          <template slot-scope="scope">
            <span v-if="scope.$index === 0">
              购买 <el-input size="mini" v-model="scope.row.startQty" style="width:100px"></el-input> {{ getCurMeasure() }}及以上时，为表格中填写的预计收入。
            </span>
            <span v-else>
              购买 <el-input size="mini" v-model="scope.row.startQty" style="width:100px"></el-input> 件及以上时，预计收入降低
              <el-input size="mini" v-model="scope.row.discount" style="width:100px"></el-input> %
            </span>
          </template>
        </el-table-column>
        <el-table-column width="100px">
          <template slot-scope="scope">
            <el-button size='mini' type='danger' @click="delItemWholesaleRangeList(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button v-if="updateItemForm.itemWholesaleRangeList.length < 4" type='primary' size="mini" style="margin-top:10px"
        @click="addItemWholesaleRangeList">+ 增加区间</el-button>
    </el-row>

    <!-- 有备货 -->
    <el-row v-if="updateItemForm.itemInventory.inventoryStatus === '1'">
      <el-tabs type="border-card" @tab-click="selectTab" v-model="activeTab">
        <el-tab-pane v-for="(inventory, index) in updateItemForm.itemInventory.invenLocationList" :key='index' :name="inventory.inventoryLocation"
          :label="tabNames(inventory.inventoryLocation)">
          <el-button size="mini" @click="clearFilter('filterTable_' + index, index)">清除所有过滤条件</el-button>

          <el-table :ref="'filterTable_' + index" :data="updateItemForm.itemSkuList" style="width: 100%">
            <!--购买属性-->
            <el-table-column v-for="(attrOptions, attrIndex) in tableBuyHead" :key="attrIndex" :label="attrOptions"
              :filter-method="filterTag" :filters="filterList[attrOptions]">
              <template slot-scope="scope">
                {{ attrValLabelCn(scope.row.itemSkuAttrvalList[attrIndex]) }}
              </template>
            </el-table-column>

            <el-table-column label="销售状态" width="120px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.itemSkuInvenList[curInventoryIndex].saleStatus" size="mini">
                  <el-option v-for="item in saleStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <!--分别设置价格 start-->
            <el-table-column v-if="updateItemForm.itemSaleSetting.priceConfigType === '1'" label="预计收入">
              <template slot="header" slot-scope="scope">
                <span style="color:#F56C6C">*</span>预计收入<br />
                <el-input v-model.trim="batchRetailPrice" placeholder="批量设置" @blur="setBatchRetailPrice" size="mini"
                  style="width:80px" />
              </template>
              <template slot-scope="scope">
                US $ <el-input v-model="scope.row.retailPrice" @blur="refreshRetailPrice(scope.row)" size="mini" style="width:80px"></el-input>/
                {{ getCurMeasure() }}
              </template>
            </el-table-column>
            <el-table-column v-if="updateItemForm.itemSaleSetting.priceConfigType === '1'" label="买家价格" width="80px">
              <template slot-scope="scope">
                {{ scope.row.buyerPrice }}
              </template>
            </el-table-column>
            <!--分别设置价格 end-->

            <el-table-column label="备货数量" width="120px">
              <template slot="header" slot-scope="scope">
                <span style="color:#F56C6C">*</span>备货数量<br />
                <el-input v-model.trim="batchInventyNum" @blur="setBatchInventyNum" placeholder="批量设置" size="mini"
                  style="width:80px" />
              </template>
              <template slot-scope="scope">
                <el-input v-model="scope.row.itemSkuInvenList[curInventoryIndex].skuInventoryQty" @blur="setInventyNum"
                  size="mini" style="width:80px"></el-input> {{ getCurMeasure() }}
              </template>
            </el-table-column>
            <el-table-column label="商品编码">
              <template slot-scope="scope">
                <el-input v-model="scope.row.itemSkuInvenList[curInventoryIndex].skuCode" size="mini"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <!-- 无备货 -->
    <el-row v-else>
      <el-button size="mini" @click="clearFilter('filterTable_0')">清除所有过滤条件</el-button>
      <el-table :ref="'filterTable_0'" :data="updateItemForm.itemSkuList" style="width: 100%">
        <!--购买属性-->
        <el-table-column v-for="(attrOptions, attrIndex) in tableBuyHead" :key="attrIndex" :label="attrOptions"
          :filter-method="filterTag" :filters="filterList[attrOptions]">
          <template slot-scope="scope">
            {{ attrValLabelCn(scope.row.itemSkuAttrvalList[attrIndex]) }}
          </template>
        </el-table-column>

        <el-table-column label="销售状态" width="120px">
          <template slot-scope="scope">
            <el-select v-model="scope.row.saleStatus" size="mini">
              <el-option v-for="item in saleStatusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <!--分别设置价格 start-->
        <el-table-column v-if="updateItemForm.itemSaleSetting.priceConfigType === '1'" label="预计收入">
          <template slot="header" slot-scope="scope">
            <span style="color:#F56C6C">*</span>预计收入<br />
            <el-input v-model.trim="batchRetailPrice" placeholder="批量设置" @blur="setBatchRetailPrice" size="mini" style="width:80px" />
          </template>
          <template slot-scope="scope">
            US $ <el-input v-model="scope.row.retailPrice" @blur="refreshRetailPrice(scope.row)" size="mini" style="width:80px"></el-input>/
            {{ getCurMeasure() }}
          </template>
        </el-table-column>
        <el-table-column v-if="updateItemForm.itemSaleSetting.priceConfigType === '1'" label="买家价格" width="80px">
          <template slot-scope="scope">
            {{ scope.row.buyerPrice }}
          </template>
        </el-table-column>
        <!--分别设置价格 end-->

        <el-table-column label="商品编码">
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode" size="mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-row>
</template>

<script>
  import linsd_arr from 'linsd_arr'
  export default {
    name: 'erpItemSku',
    created() {},
    data() {
      return {
        activeTab: '',
        saleStatusOptions: [{
          value: 0,
          label: '不可销售'
        }, {
          value: 1,
          label: '可销售'
        }],
        tableBuyHead: [],
        itemSkuListDefault: [],
        itemAttrListDefault: [],
        curInventoryIndex: '',

        filterList: {},

        batchInventyNum: '',
        batchRetailPrice: ''
      }
    },
    computed: {},
    mounted() {
      this.itemSkuListDefault = JSON.parse(JSON.stringify(this.updateItemForm.itemSkuList))
      this.itemAttrListDefault = JSON.parse(JSON.stringify(this.updateItemForm.itemAttrList))

      this.initSkuList()
    },
    props: {
      updateItemForm: {
        default: () => [],
        required: true
      },
      countryList: {
        default: () => [],
        required: true
      },
      categoryPubAttrOptions: {
        default: () => [],
        required: true
      },
      measuresOptions: {
        default: () => [],
        required: true
      },
      percentList: {
        default: () => [],
        required: true
      }
    },
    model: {
      prop: 'itemSkuList',
      event: 'change'
    },
    watch: {

    },
    methods: {
      changePriceConfigType(label) {
        this.updateItemForm.itemWholesaleRangeList = [{
          startQty: 1,
          discount: ''
        }]
      },
      delItemWholesaleRangeList(index) {
        this.updateItemForm.itemWholesaleRangeList.splice(index, 1)
      },
      addItemWholesaleRangeList() {
        this.updateItemForm.itemWholesaleRangeList.push({
          startQty: '',
          discount: ''
        })
      },
      // 买家价格
      getBuyerPrice(row) {
        console.info('getBuyerPrice', row)
        var totalPrice = row.startQty * row.discount
        for (var i = 0; i < this.percentList.length; i++) {
          var leftBound = parseFloat(this.percentList[i].leftBound)
          var rightBound = parseFloat(this.percentList[i].rightBound)
          if (totalPrice >= leftBound && totalPrice < rightBound) {
            return Math.round((row.discount / (1 - this.percentList[i].commissionRate)) * 100) / 100
          }
        }
      },
      refreshRetailPrice(row) {
        // if (this.checkIncome(row.retailPrice) === false) {
        //   return false
        // }
        var retailPrice = parseFloat(row.retailPrice)

        for (var i = 0; i < this.percentList.length; i++) {
          var leftBound = parseFloat(this.percentList[i].leftBound)
          var rightBound = parseFloat(this.percentList[i].rightBound)
          if (retailPrice >= leftBound && retailPrice < rightBound) {
            row.buyerPrice = Math.round((retailPrice / (1 - this.percentList[i].commissionRate)) * 100) / 100
          }
        }
      },
      setBatchRetailPrice() {
        // if (this.checkIncome(this.batchRetailPrice) === false) {
        //   return false
        // }

        if (this.batchRetailPrice === '') {
          return false
        }
        this.updateItemForm.itemSkuList.forEach(element => {
          element.retailPrice = this.batchRetailPrice
          this.refreshRetailPrice(element)
        })

        this.batchRetailPrice = ''
      },
      setBatchInventyNum() {
        if (this.batchInventyNum === '') {
          return false
        }
        this.updateItemForm.itemSkuList.forEach(element => {
          element.itemSkuInvenList.forEach(item => {
            if (item.inventoryLocation === this.activeTab) {
              item.skuInventoryQty = this.batchInventyNum
            }
          })
        })

        this.batchInventyNum = ''
        this.setInventyNum()
      },
      setInventyNum() {
        this.updateItemForm.itemInventory.inventoryQty = 0
        this.updateItemForm.itemSkuList.forEach(element => {
          element.itemSkuInvenList.forEach(item => {
            this.updateItemForm.itemInventory.inventoryQty = parseInt(this.updateItemForm.itemInventory.inventoryQty) +
              parseInt(item.skuInventoryQty)
          })
        })
      },
      clearFilter(table, index) {
        if (index === undefined) {
          this.$refs[table].clearFilter()
        } else {
          this.$refs[table][0].clearFilter()
        }
      },
      filterInit() {
        for (var t = 0; t < this.tableBuyHead.length; t++) {
          this.filterList[this.tableBuyHead[t]] = []
          var result = []
          var itemAttrValList = []

          // 自定义规格
          if (this.tableBuyHead[t] === '自定义规格') {
            this.updateItemForm.itemSpecSelfDefList.forEach(element => {
              this.filterList[this.tableBuyHead[t]].push({
                text: element.attrValName,
                value: element.attrValId
              })
            })
          } else {
            result = this.updateItemForm.itemAttrList.filter(item => {
              return item.lineAttrNameCn === this.tableBuyHead[t]
            })

            if (result.length > 0) {
              itemAttrValList = result[0].itemAttrValList
              itemAttrValList.forEach(element => {
                this.filterList[this.tableBuyHead[t]].push({
                  text: element.lineAttrvalNameCn + '(' + element.lineAttrvalName + ')',
                  value: element.attrValId
                })
              })
            }
          }
        }
      },
      filterTag(value, row) {
        var result = row.itemSkuAttrvalList.filter(item => {
          return item.attrValId === value
        })

        return result.length > 0
      },
      // 备货地区被删除
      delInvenList(index) {
        if (this.updateItemForm.itemInventory.inventoryStatus === '1') { // 有备货
          for (var i = 0; i < this.updateItemForm.itemSkuList.length; i++) {
            this.updateItemForm.itemSkuList[i].itemSkuInvenList.splice(index, 1)
          }
        }

        this.initInvenList()
      },
      initInvenList() {
        if (this.updateItemForm.itemInventory.inventoryStatus === '1') { // 有备货
          for (var i = 0; i < this.updateItemForm.itemSkuList.length; i++) {
            for (var j = 0; j < this.updateItemForm.itemInventory.invenLocationList.length; j++) {
              var index = this.updateItemForm.itemSkuList[i].itemSkuInvenList.findIndex(item => {
                return item.inventoryLocation === this.updateItemForm.itemInventory.invenLocationList[j].inventoryLocation
              })

              if (index === -1) {
                this.updateItemForm.itemSkuList[i].itemSkuInvenList.push({
                  saleStatus: 1,
                  skuCode: '',
                  skuInventoryQty: '',
                  inventoryLocation: this.updateItemForm.itemInventory.invenLocationList[j].inventoryLocation
                })
              }
            }
          }

          this.activeTab = this.updateItemForm.itemInventory.invenLocationList[0].inventoryLocation
          this.selectTab()
        }
      },
      selectTab() {
        var i = 0
        var index = -1
        for (i = 0; i < this.updateItemForm.itemSkuList.length; i++) {
          index = this.updateItemForm.itemSkuList[i].itemSkuInvenList.findIndex(item => {
            return item.inventoryLocation === this.activeTab
          })

          this.curInventoryIndex = index
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
      initSkuList() {
        this.tableBuyHead = []
        var itemSkuList = []
        var itemSku = {}

        for (var i = 0; i < this.updateItemForm.itemAttrList.length; i++) {
          if (this.updateItemForm.itemAttrList[i].buyAttr === '1' || this.updateItemForm.itemAttrList[i].isPriceAttr ===
            1) {
            var buyAttrOptions = this.updateItemForm.itemAttrList[i]
            // console.log(i, buyAttrOptions.lineAttrNameCn)
            this.tableBuyHead.push(buyAttrOptions.lineAttrNameCn)

            if (itemSkuList.length <= 0) { // 第一个属性
              for (var j = 0; j < buyAttrOptions.itemAttrValList.length; j++) {
                itemSku = {
                  skuCode: '',
                  inventory: '',
                  retailPrice: '',
                  buyerPrice: '',
                  saleStatus: 1,
                  itemSkuAttrvalList: [{
                    attrId: buyAttrOptions.itemAttrValList[j].attrId,
                    attrValId: buyAttrOptions.itemAttrValList[j].attrValId,
                    sizeSpecType: 1
                  }],
                  itemSkuInvenList: []
                }
                itemSkuList.push(itemSku)
              }
            } else {
              var tmp = [...itemSkuList]
              itemSkuList = []

              for (var k = 0; k < buyAttrOptions.itemAttrValList.length; k++) {
                for (var l = 0; l < tmp.length; l++) {
                  var initParent = [...tmp[l].itemSkuAttrvalList]
                  initParent.push({
                    attrId: buyAttrOptions.itemAttrValList[k].attrId,
                    attrValId: buyAttrOptions.itemAttrValList[k].attrValId,
                    sizeSpecType: 1
                  })
                  itemSku = {
                    skuCode: '',
                    inventory: '',
                    retailPrice: '',
                    buyerPrice: '',
                    saleStatus: 1,
                    itemSkuAttrvalList: initParent,
                    itemSkuInvenList: []
                  }
                  itemSkuList.push(itemSku)
                }
              }
            }
          }
        }

        // 自定义规格
        if (this.updateItemForm.itemSpecSelfDefList !== undefined && this.updateItemForm.itemSpecSelfDefList !== null &&
          this.updateItemForm.itemSpecSelfDefList.length > 0) {
          tmp = [...itemSkuList]
          itemSkuList = []
          this.tableBuyHead.push('自定义规格')
          for (var s = 0; s < this.updateItemForm.itemSpecSelfDefList.length; s++) {
            if (tmp.length > 0) {
              for (var t = 0; t < tmp.length; t++) {
                initParent = [...tmp[t].itemSkuAttrvalList]
                initParent.push({
                  attrId: 9999,
                  attrValId: this.updateItemForm.itemSpecSelfDefList[s].attrValId,
                  sizeSpecType: 3
                })
                itemSku = {
                  skuCode: '',
                  inventory: '',
                  retailPrice: '',
                  buyerPrice: '',
                  saleStatus: 1,
                  itemSkuAttrvalList: initParent,
                  itemSkuInvenList: []
                }
                itemSkuList.push(itemSku)
              }
            } else {
              initParent = [{
                attrId: 9999,
                attrValId: this.updateItemForm.itemSpecSelfDefList[s].attrValId,
                sizeSpecType: 3
              }]
              itemSku = {
                skuCode: '',
                inventory: '',
                retailPrice: '',
                buyerPrice: '',
                saleStatus: 1,
                itemSkuAttrvalList: initParent,
                itemSkuInvenList: []
              }
              itemSkuList.push(itemSku)
            }
          }
        }

        this.updateItemForm.itemSkuList = itemSkuList
        for (var m = 0; m < this.itemSkuListDefault.length; m++) {
          var index = this.updateItemForm.itemSkuList.findIndex(item => {
            return this.isSkuEq(item.itemSkuAttrvalList, this.itemSkuListDefault[m].itemSkuAttrValueList)
          })
          if (index > -1) {
            this.updateItemForm.itemSkuList[index].skuCode = this.itemSkuListDefault[m].skuCode
            this.updateItemForm.itemSkuList[index].inventory = this.itemSkuListDefault[m].inventory
            this.updateItemForm.itemSkuList[index].retailPrice = this.itemSkuListDefault[m].retailPrice
            // this.updateItemForm.itemSkuList[index].buyerPrice = this.itemSkuListDefault[m].buyerPrice
            this.updateItemForm.itemSkuList[index].saleStatus = this.itemSkuListDefault[m].saleStatus
            this.updateItemForm.itemSkuList[index].itemSkuInvenList = this.itemSkuListDefault[m].itemSkuInventoryList
          }
        }

        this.initInvenList()
        this.filterInit()
      },

      refreashItemAttr(categoryPubAttr) {
        if (categoryPubAttr.buyAttr === '1') {
          var index = linsd_arr.getIndex(this.itemAttrListDefault, 'attrId', categoryPubAttr.attrId)
          if (this.isEq(categoryPubAttr, this.itemAttrListDefault[index]) === false) {
            this.initSkuList()
          }
        }
      },
      refreashItemSpecSelfDefList(itemSpecSelfDefList) {
        this.initSkuList()
      },
      attrValLabelCn(row) {
        if (row.attrId === 9999) {
          var selfResult = this.updateItemForm.itemSpecSelfDefList.filter(item => {
            return item.attrValId === row.attrValId
          })

          if (selfResult.length <= 0) {
            return '未知自定义规格'
          } else {
            return selfResult[0].attrValName
          }
        }

        var result1 = this.updateItemForm.itemAttrList.filter(item => {
          return String(item.attrId) === String(row.attrId)
        })
        if (result1.length <= 0) {
          return '未知属性'
        }

        var result2 = result1[0].itemAttrValList.filter(item => {
          return String(item.attrValId) === String(row.attrValId)
        })
        if (result2.length <= 0) {
          return '未知属性'
        }

        return result2[0].lineAttrvalNameCn + ' (' + result2[0].lineAttrvalName + ')'
      },
      tabNames(inventoryLocation) {
        var result = this.countryList.filter(item => {
          return item.countryid === inventoryLocation
        })
        if (result.length > 0) {
          return result[0].description
        } else {
          return '未知国家'
        }
      },
      // 判断是否发送变更
      isEq(firstData, secondData) {
        return JSON.stringify(firstData) === JSON.stringify(secondData)
      },
      isSkuEq(firstData, secondData) {
        var fstArr = []
        var secArr = []
        firstData.forEach(data => {
          fstArr.push(Number(data.attrValId))
        })
        fstArr.sort()
        secondData.forEach(data => {
          secArr.push(Number(data.attrValId))
        })
        secArr.sort()
        return JSON.stringify(fstArr) === JSON.stringify(secArr)
      }
    }
  }
</script>

<style>
</style>
