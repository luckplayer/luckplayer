<template>
    <section class="app-container">
          <el-dialog 
            title="库存商品" 
            :visible.sync="dialogVisible" 
            show-close
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="800px">

            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            
            </el-col>

            <!--列表-->
            <el-table
            v-loading="loading"
            :data="list"
            highlight-current-row
            @row-click="handleRowDblclick"
            style="width: 100%;">
                <el-table-column prop="amount" label="库存数量">
                </el-table-column>
                <el-table-column prop="size" label="尺码">
                  <template slot-scope="scope">
                    <span>{{getAttributeLabel(scope.row.size)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="color" label="颜色"></el-table-column>
                <el-table-column prop="file" label="图片">
                  <template slot-scope="scope">
                    <el-tooltip style="margin-top:0px" effect="dark" placement="left">
                        <div slot="content">
                          <img :src="urlPre + scope.row.file" width="256" height="256">
                        </div>
                        <el-image :src="urlPre + scope.row.file" lazy style="width:48px;height:48px;">
                          <div slot="placeholder" class="image-slot">
                            <img src="https://dh-erp.oss-cn-zhangjiakou.aliyuncs.com/loading.gif" width="48" height="48">
                          </div>
                        </el-image>
                    </el-tooltip>
                  </template>
                </el-table-column>
            </el-table>

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
import { getWarehouse } from '@/api/commodity'
import { isPermissions } from '@/utils/auth'
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
        commodity_id: 0,
        is_has_amount: 1
      },
      commodityAttribute: [],

      list: [],

      /** *分页***/
      total: 0,
      page: 1,
      /** *****/
      urlPre: '',

      parentRow: {}
    }
  },
  methods: {
    isPermissions(permissionPath) {
      return isPermissions(permissionPath)
    },
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      if (row.amount < this.parentRow.item_count) {
        this.$message({
          message: '当前选中库存商品，库存数量不足' + this.parentRow.item_count,
          type: 'error'
        })
        return false
      }

      var attrs = { color: row.color, size: this.getAttributeLabel(row.size) }
      var params = {
        commodity_id: row.id,
        warehouse_id: row.warehouse_id,
        product_id: this.parentRow.id,
        amount: this.parentRow.item_count,
        attrs: attrs
      }
      this.$emit('db-click', params)
      this.dialogVisible = false
    },
    // 接受父事件
    handleParent(row) {
      this.parentRow = row
      this.filters.commodity_id = row.commodity_id
      this.dialogVisible = true
      this.roleKey = fun_getRoleKey()
      this.getList()
    },
    getAttributeLabel(value) {
      const cur = this.commodityAttribute.find(item => {
        return item.id === value
      })

      if (cur === undefined || cur.name === undefined) {
        return '尺寸已被删除'
      } else {
        return cur.name
      }
    },
    handleClickSearch() {
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
      getWarehouse(params).then(res => {
        this.list = res.list
        this.total = res.total
        this.commodityAttribute = res.commodityAttribute
        this.urlPre = res.urlPre

        this.loading = false
      })
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