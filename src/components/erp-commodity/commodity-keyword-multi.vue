<template>
  <section class="app-container">
    <el-dialog title="关键字、标题修改" :visible.sync="dialogVisible" show-close :close-on-click-modal="false"
      :close-on-press-escape="false" width="800px">
      <el-row>
        <h3>关键字</h3>
      </el-row>
      <el-table v-loading="loading" :data="this.keywords" border :show-header="false">
        <el-table-column prop="type" width="100">
          <template slot-scope="scope">
            <span :class="classList[scope.row.type]">{{ typeList[scope.row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="label">
          <template slot-scope="scope">
            <el-tag :key='key' v-for="(label,key) in scope.row.label" closable :class="classList[scope.row.type]"
              @close="delKW(scope.row.label, label)" @click="editKw(scope.$index, key, label)">{{ label }}</el-tag>
            <el-input v-model="keyword[scope.row.type]" size="small" style="width:120px" @blur="setKw(scope.row.label, scope.row.type)"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-button type='primary' style="margin-top:10px;" @click="setKeywords">确定</el-button>
    </el-dialog>
    <el-dialog title="修改" :visible.sync="dialogVisibleEdit" show-close :close-on-click-modal="false"
      :close-on-press-escape="false" width="800px">
      <el-input type='textarea' v-model="editRow.label" maxlength="134"></el-input>
      <el-button type='primary' style="margin-top:10px;" @click="editSave">确定</el-button>
    </el-dialog>
  </section>
</template>

<script>
  import {
    isPermissions
  } from '@/utils/auth'
  import {
    fun_getRoleKey
  } from '@/utils/common'

  export default {
    data() {
      return {
        dialogVisible: false,
        dialogVisibleEdit: false,

        /** 上传 */
        classList: ['brands_0', 'brands_1', 'brands_2', 'brands_3'],
        typeList: ['正规', '危险', '高危', '一般'],
        clearable: true,
        loading: true,
        editRow: {},
        keyword: [],
        keywords: []
      }
    },
    props: {},
    methods: {
      editSave() {
        this.$set(this.keywords[this.editRow.index].label, this.editRow.labelIndex, this.editRow.label)
        this.dialogVisibleEdit = false
      },
      editKw(index, labelIndex, label) {
        this.dialogVisibleEdit = true

        this.editRow = {
          index: index,
          labelIndex: labelIndex,
          label: label
        }
      },
      isPermissions(permissionPath) {
        return isPermissions(permissionPath)
      },
      delKW(row, label) {
        row.splice(row.indexOf(label), 1)
      },
      setKw(row, index) {
        if (this.keyword[index] === '' || this.keyword[index] === undefined) {
          return false
        }

        for (var i = 0; i < this.keywords.length; i++) {
          var labels = this.keywords[i].label
          for (var j = 0; j < labels.length; j++) {
            if (this.keyword[index] === labels[j]) {
              this.$message({
                message: '关键词已存在',
                type: 'error'
              })
              return false
            }
          }
        }
        row.push(this.keyword[index].toLowerCase())
        this.keyword[index] = ''
      },
      setKeywords() {
        this.handlePostMessage()
        this.dialogVisible = false
      },
      handlePostMessage(row, event, column) {
        this.$emit('click', this.keywords)
      },
      // 接受父事件
      handleParent() {
        this.keywords = [{
          type: 0,
          label: []
        }, {
          type: 3,
          label: []
        }, {
          type: 1,
          label: []
        }, {
          type: 2,
          label: []
        }]
        this.dialogVisible = true
        this.roleKey = fun_getRoleKey()
        this.loading = false
      }
    },
    mounted() {}
  }
</script>

<style>
  .brands_0 {
    color: #67C23A;
    border-color: #67C23A;
    background-color: white;
    white-space: pre-line;
    margin: 0 5px 5px 0;
    height: 100%;
  }

  .brands_3 {
    color: #909399;
    border-color: #909399;
    background-color: white;
    white-space: pre-line;
    margin: 0 5px 5px 0;
    height: 100%;
  }

  .brands_1 {
    color: #E6A23C;
    border-color: #E6A23C;
    background-color: white;
    white-space: pre-line;
    margin: 0 5px 5px 0;
    height: 100%;
  }

  .brands_2 {
    color: #F56C6C;
    border-color: #F56C6C;
    background-color: white;
    white-space: pre-line;
    margin: 0 5px 5px 0;
    height: 100%;
  }
</style>
