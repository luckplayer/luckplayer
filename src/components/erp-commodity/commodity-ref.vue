<template>
    <section class="app-container">
          <el-dialog
            title="关联商品库"
            :visible.sync="dialogVisible"
            show-close
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :fullscreen="true"
            width="1000px">

            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" @submit.native.prevent>
                <el-form-item>
                    <el-autocomplete
                      v-model="filters.series"
                      :fetch-suggestions="querySeriesAsync"
                      placeholder="系列名称"
                      :clearable='clearable'
                    ></el-autocomplete>
                </el-form-item>
                <el-form-item>
                    <el-autocomplete
                      v-model="filters.name"
                      :fetch-suggestions="queryNameAsync"
                      placeholder="名称"
                      :clearable='clearable'
                    ></el-autocomplete>
                </el-form-item>
                <!-- <el-form-item>
                    <el-select
                    :class="formatBrandClass(filters.brand_id)"
                    v-model="filters.brand_id"
                    filterable placeholder="品牌"
                    :clearable="clearable">
                    <el-option
                        :style="formatBrandColor(item.quality)"
                        v-for="item in allBrand"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-cascader
                        :options="customMultiList"
                        placeholder="分类"
                        v-model="filters.custom_id"
                        :show-all-levels="false"
                        :props="{ checkStrictly: true, value: 'id', label: 'name' }"
                        clearable>
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="handleClickSearch">查询</el-button>
                </el-form-item>
            </el-form>
            </el-col>

            <!--列表-->
            <el-row v-for="(item, i) in list" style="width: 262px; float: left;margin: 5px;" :key="i">
              <el-card :body-style="{ padding: '0px' }" style="height:362px;">
                <el-image
                  style="width: 250px;height: 250px;"
                  :src="item.show_images"
                  :preview-src-list="[item.show_images]"
                  fit="scale-down">
                  <div slot="error" class="image-slot" style="width: 250px;height: 250px;">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
                <div style="padding: 14px;">
                  <span>{{ item.name }}</span>
                  <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="handleRowDblclick(item)">关联</el-button>
                  </div>
                </div>
              </el-card>
            </el-row>
            <div style="clear: both;"></div>
            <!--页码-->
            <el-pagination
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="20"
            :total="total"
            style="text-align:center;margin-top:10px"
            ></el-pagination>
        </el-dialog>
    </section>
</template>

<script>
import { config } from '@/api/order'
import { searchName, searchSeries, getDetailList } from '@/api/commodity'
import { isPermissions } from '@/utils/auth'
import linsd_arr from 'linsd_arr'
import { fun_getRoleKey } from '@/utils/common'

export default {
  data() {
    return {
      roleKey: '',
      dialogVisible: false,

      /** 上传 */
      clearable: true,
      loading: false,
      filters: {
        series: '',
        name: '',
        custom_id: '',
        user_id: '',
        brand_id: ''
      },

      qualityStatus: [],
      allBrand: [],
      supplierList: [],
      commodityStatus: [],
      customerServiceList: [],
      customList: [],
      customMultiList: [],
      list: [],

      /** *分页***/
      total: 0,
      page: 1,
      /** *****/
      urlPre: ''
    }
  },
  methods: {
    isPermissions(permissionPath) {
      return isPermissions(permissionPath)
    },
    // 搜索关联名称
    querySeriesAsync(queryString, cb) {
      var params = { name: queryString }
      searchSeries(params).then(res => {
        var commodityList = res.list ? res.list : []
        var results = queryString ? commodityList.filter(this.createStateFilter(queryString)) : commodityList

        return cb(results)
      })
    },
    queryNameAsync(queryString, cb) {
      var params = { name: queryString }
      searchName(params).then(res => {
        var commodityList = res.list ? res.list : []
        var results = queryString ? commodityList.filter(this.createStateFilter(queryString)) : commodityList

        return cb(results)
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    // 行双击时给父组件广播事件
    handleRowDblclick(row) {
      this.$emit('db-click', row)
      this.dialogVisible = false
    },
    // 接受父事件
    handleCommodityRef() {
      this.dialogVisible = true
      this.roleKey = fun_getRoleKey()
      this.getConfig()
    },
    formatCustom(row) {
      if (parseInt(row.custom_id) <= 0) {
        return ''
      }
      const cur = linsd_arr.getByField(this.customList, 'id', row.custom_id)
      return cur.value
    },
    formatBrandClass(id) {
      const cur = this.allBrand.find((cur, k) => {
        return id === cur.id
      })
      if (cur === undefined) {
        return ''
      }

      return 'brands_' + cur.quality
    },
    formatBrandColor(value) {
      const quality = this.qualityStatus.find((quality, k) => {
        return value === k
      })
      return 'color: ' + quality.color
    },
    getConfig() {
      config().then(res => {
        this.supplierList = res.supplierList
        this.customerServiceList = res.customerServiceList
        this.allBrand = res.allBrand
        this.qualityStatus = res.qualityStatus
        this.customList = res.customList
        this.customMultiList = res.customMultiList
        this.getList()
      })
    },
    handleClickSearch() {
      this.page = 1
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    getList() {
      this.loading = true
      var params = this.filters
      params.page = this.page
      var detailParams = {
        brand: params.brand_id,
        series: params.series,
        page: params.page,
        name: params.name,
        category: params.custom_id
      }
      getDetailList(detailParams).then(res => {
        // console.log(res)
        console.log('----------res------------')
        this.list = res.list
        this.total = res.total
        this.urlPre = res.urlPre
        this.commodityStatus = res.commodityStatus
        this.loading = false
        // for (var i = 0; i < this.list.length; i++) {
        //   console.log(i)
        //   this.list[i].commodityStatusHtml = this.formatCommodityStatus(this.list[i])
        // }
      })
      // getList(params).then(res => {
      //   console.log(res)
      //   console.log('+++')
      //   this.list = res.list
      //   this.total = res.total
      //   this.urlPre = res.urlPre
      //   this.commodityStatus = res.commodityStatus
      //   this.loading = false

      //   for (var i = 0; i < this.list.length; i++) {
      //     this.list[i].commodityStatusHtml = this.formatCommodityStatus(this.list[i])
      //   }
      // })
    },
    formatCommodityStatus(row) {
      const cur = linsd_arr.getByField(this.commodityStatus, 'value', row.status)
      const result = '<font style="color:' + cur.color + '">' + cur.label + '</font>'
      return result
    },
    getBrandLabel(value) {
      const cur = this.allBrand.find(item => {
        return item.id === value
      })

      if (cur === undefined || cur.name === undefined) {
        return '品牌已被删除'
      } else {
        const quality = this.qualityStatus.find(item => {
          return item.value === cur.quality
        })
        if (quality !== undefined) {
          return "<p style='color: " + quality.color + "'>" + cur.name + '</p>'
        } else {
          return '<p>' + cur.name + '</p>'
        }
      }
    },
    getCustomLabel(value) {
      const cur = this.customList.find(item => {
        return item.id === value
      })

      if (cur === undefined || cur.name === undefined) {
        return '分类已被删除'
      } else {
        return cur.name
      }
    }
  }
}
</script>

<style>
  .brands_0 .el-input--medium .el-input__inner {
    color: #67C23A;
  }
  .brands_1 .el-input--medium .el-input__inner {
    color: #E6A23C;
  }
  .brands_2 .el-input--medium .el-input__inner {
    color: #F56C6C;
  }
  .brands_3 .el-input--medium .el-input__inner {
    color: #909399;
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
    width: 150px;
    display: block;
  }
</style>
