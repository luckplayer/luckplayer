<template>
    <section class="app-container">
        <el-dialog 
            title="创建替换任务" 
            :visible.sync="dialogVisible" 
            show-close
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="800px">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="原采集任务">
                    <el-autocomplete
                    v-model="filters.titleOrg"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入采集任务名称"
                    @select="handleSelectOrg">
                    </el-autocomplete>&nbsp;&nbsp;选中数量：{{ num.org }}

                    <div style='box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);width:100%;height:100%; padding:5px;margin-top: 10px'>
                        <el-tag :key="index" v-for="(tag, index) in form.org" closable :disable-transitions="false" style="cursor: pointer;margin-left:5px"
                        @close="deleteOrg(index)">
                        {{tag.value}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item label="替换采集任务">
                    <el-autocomplete
                    v-model="filters.titleReplace"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入采集任务名称"
                    @select="handleSelectReplace">
                    </el-autocomplete>&nbsp;&nbsp;选中数量：{{ num.replace }}

                    <div style='box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);width:100%;height:100%; padding:5px;margin-top: 10px'>
                        <el-tag :key="index" v-for="(tag, index) in form.replace" closable :disable-transitions="false" style="cursor: pointer;margin-left:5px"
                        @close="deleteReplace(index)">
                        {{tag.value}}
                        </el-tag>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click='onSubmit' :loading='createLoading'>立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
import { listByReplace, statByReplace } from '@/api/collection'
import { autoReplace } from '@/api/item'

import { isPermissions } from '@/utils/auth'
import { fun_getRoleKey } from '@/utils/common'

export default {
  data() {
    return {
      roleKey: '',
      dialogVisible: false,

      filters: {
        titleOrg: '',
        titleReplace: ''
      },

      clearable: true,
      createLoading: false,

      form: {
        type: 1,
        org: [],
        replace: []
      },
      orgCatelist: [],

      num: {
        org: 0,
        replace: 0
      }
    }
  },
  methods: {
    isPermissions(permissionPath) {
      return isPermissions(permissionPath)
    },
    // 搜索关联名称
    querySearchAsync(queryString, cb) {
      var params = { title: queryString }
      listByReplace(params).then(res => {
        var resultList = res.list ? res.list : []
        var results = queryString ? resultList.filter(this.createStateFilter(queryString)) : resultList

        return cb(results)
      })
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelectOrg(row) {
      this.form.org.push(row)
      this.filters.titleOrg = ''

      if (this.form.org.length >= 1) {
        var taskIds = []
        for (var i = 0; i < this.form.org.length; i++) {
          taskIds.push(this.form.org[i].task_id)
        }

        statByReplace({ taskIds: taskIds }).then(res => {
          this.num.org = res.num
          this.orgCatelist = res.cateList
        })
      }
    },
    deleteOrg(index) {
      this.form.org.splice(index, 1)

      if (this.form.org.length >= 1) {
        var taskIds = []
        for (var i = 0; i < this.form.org.length; i++) {
          taskIds.push(this.form.org[i].task_id)
        }

        statByReplace({ taskIds: taskIds }).then(res => {
          this.num.org = res.num
        })
      }
    },
    handleSelectReplace(row) {
      this.form.replace.push(row)
      this.filters.titleReplace = ''

      if (this.form.replace.length >= 1) {
        var taskIds = []
        for (var i = 0; i < this.form.replace.length; i++) {
          taskIds.push(this.form.replace[i].task_id)
        }

        console.log({ taskIds: taskIds, orgCatelist: this.orgCatelist })
        statByReplace({ taskIds: taskIds, orgCatelist: this.orgCatelist }).then(res => {
          this.num.replace = res.num
        })
      }
    },
    deleteReplace(index) {
      this.form.replace.splice(index, 1)
    },
    onSubmit() {
      this.createLoading = true
      autoReplace(this.form).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '创建成功',
            type: 'success'
          })
        }

        this.dialogVisible = false
        this.createLoading = false
      })
    },
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      this.$emit('db-click', row)
      this.dialogVisible = false
    },
    // 接受父事件
    handleParent() {
      this.dialogVisible = true
      this.roleKey = fun_getRoleKey()
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