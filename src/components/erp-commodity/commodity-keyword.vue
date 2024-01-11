<template>
  <section class="app-container">
    <el-dialog title="关键字、标题修改" :visible.sync="dialogVisible" show-close :close-on-click-modal="false"
      :close-on-press-escape="false" width="800px">
      <el-row>
        <h3>关键字</h3>
      </el-row>
      <el-table v-loading="loading" :data="this.cur_row.keyword" border :show-header="false">
        <el-table-column prop="type" width="150">
          <template slot-scope="scope">
            <span :class="classList[scope.row.type]">{{ typeList[scope.row.type] }}</span>
            <el-button round size="mini" @click="createTitle(scope.row,scope.row.type)">生成</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="label">
          <template slot-scope="scope">
            <el-row>
              <el-tag :key='key' v-for="(label,key) in scope.row.label" closable :class="classList[scope.row.type]"
                @close="delKW(scope.row.label, label)" @click="editKw(scope.$index, key, label)">{{ label }}</el-tag>
              <el-input v-model="keyword[scope.row.type]" size="small" style="width:120px" @blur="setKw(scope.row.label, scope.row.type)"></el-input>
            </el-row>
            <el-row>
              <span :id="'copy_'+scope.row.type">{{tempTitle[scope.row.type]}}</span>
            </el-row>
          </template>
        </el-table-column>
      </el-table>

      <el-row>
        <h3>标题</h3>
      </el-row>
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="country.lang" :name="country.id" v-for="country in countryOptions" :key="country.id">
          <el-row :gutter="20" v-if="titles[country.id]">
            <el-col :span="4"><span :style="titleClassList(0)">{{ titleTypeList(0) }}</span></el-col>
            <el-col :span="20">
              <el-tag :key='"title_0_"+idx' v-for="(title,idx) in titles[country.id].title_0" closable :style="titleClassList(0)"
                @close="delTitle(titles[country.id].title_0, idx)" @click="editTitle(country.id, 0, title, idx)">{{ title }}</el-tag>
              <el-button round size="mini" icon="el-icon-plus" @click="editTitle(country.id,0,'')" circle></el-button>
            </el-col>
            <el-col :span="4"><span :style="titleClassList(1)">{{ titleTypeList(1) }}</span></el-col>
            <el-col :span="20">
              <el-tag :key='"title_1_"+idx' v-for="(title,idx) in titles[country.id].title_1" closable :style="titleClassList(1)"
                @close="delTitle(titles[country.id].title_1, idx)" @click="editTitle(country.id, 1, title, idx)">{{ title }}</el-tag>
              <el-button round size="mini" icon="el-icon-plus" @click="editTitle(country.id,1,'')" circle></el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>

    <el-dialog title="修改" :visible.sync="dialogVisibleEdit" show-close :close-on-click-modal="false"
      :close-on-press-escape="false" width="800px">
      <el-input type='textarea' v-model="editRow.label" maxlength="134" @blur="checkTitle(editRow.label)"></el-input>
      <el-button type='primary' style="margin-top:10px;" @click="editSave">确定</el-button>
    </el-dialog>

    <el-dialog title="标题" :visible.sync="dialogVisibleTitle" show-close :close-on-click-modal="false"
      :close-on-press-escape="false" width="800px">
      <el-input type='textarea' v-model="eTitle.title" maxlength="134" @blur="checkTitle(eTitle.title)"></el-input>
      <el-button type='primary' style="margin-top:10px;" @click="titleSave">确定</el-button>
    </el-dialog>
  </section>
</template>

<script>
  import clipboard from 'clipboard-polyfill'
  import {
    isPermissions
  } from '@/utils/auth'
  import {
    fun_getRoleKey
  } from '@/utils/common'
  import {
    getTitles,
    editTitle
  } from '@/api/commodity'

  import {
    validateDhTitle
  } from '@/utils/validate'

  export default {
    data() {
      return {
        dialogVisible: false,
        dialogVisibleEdit: false,
        dialogVisibleTitle: false,

        /** 上传 */
        classList: ['brands_0', 'brands_1', 'brands_2', 'brands_3'],
        typeList: ['正规', '危险', '高危', '一般'],
        cur_row: {},
        clearable: true,
        loading: true,
        titles: [],
        eTitle: {
          countryId: '',
          titleQualityStatusId: '',
          title: ''
        },

        activeNames: [0],

        tempTitle: [
          '', '', '', ''
        ],

        editRow: {},

        keyword: [],
        country: []
      }
    },
    props: {
      countryOptions: {
        default: [],
        required: true
      },
      titleQualityStatus: {
        default: [],
        required: true
      }
    },
    methods: {
      editSave() {
        if (this.editRow.type === 'kw') {
          this.$set(this.cur_row.keyword[this.editRow.index].label, this.editRow.labelIndex, this.editRow.label)
        }
        this.handlePostMessage()
        this.dialogVisibleEdit = false
      },
      titleSave() {
        if (!this.checkTitle(this.eTitle.title)) {
          return false
        }
        var t = 'title_' + this.eTitle.titleQualityStatusId
        if (this.eTitle.titleIdx !== undefined) {
          this.$set(this.titles[this.eTitle.countryId][t], this.eTitle.titleIdx, this.eTitle.title)
        } else {
          this.titles[this.eTitle.countryId][t].push(this.eTitle.title)
        }
        this.dialogVisibleTitle = false
        this.saveTitles()
      },
      editKw(index, labelIndex, label) {
        this.dialogVisibleEdit = true

        this.editRow = {
          type: 'kw',
          index: index,
          labelIndex: labelIndex,
          label: label
        }
      },
      titleClassList(id) {
        var status = this.titleQualityStatus.find(status => {
          return Number(status.value) === Number(id)
        })
        return 'color: ' + status.color + ';border-color: ' + status.color +
          ';background-color: white;white-space: pre-line;margin: 0 5px 5px 0;height: 100%;'
      },
      titleTypeList(id) {
        var status = this.titleQualityStatus.find(status => {
          return Number(status.value) === Number(id)
        })
        return status.label
      },
      checkTitle(label) {
        var hasTitle = this.titles.some(title => {
          return (title.title_0.some(t0 => {
            return t0 === label
          }) || title.title_1.some(t1 => {
              return t1 === label
            }))
        })
        if (hasTitle) {
          this.$message({
            message: '关键词已存在',
            type: 'error'
          })
          return false
        }

        var res = validateDhTitle(label)
        if (!res.result) {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        return res.result
      },

      editTitle(countryId, titleQualityStatusId, title, titleIdx) {
        this.eTitle.countryId = countryId
        this.eTitle.titleQualityStatusId = titleQualityStatusId
        this.eTitle.title = title
        this.eTitle.titleIdx = titleIdx
        this.dialogVisibleTitle = true
      },
      isPermissions(permissionPath) {
        return isPermissions(permissionPath)
      },
      delTitle(row, idx) {
        row.splice(row.indexOf(idx), 1)
        this.saveTitles()
      },
      createTitle(row, idx) {
        var title = []
        var arrs = row.label.join(' ').split(' ')
        for (var i = 0; i < arrs.length; i++) {
          if (title.indexOf(arrs[i]) === -1) {
            title.push(arrs[i])
          }
        }
        title = title.join(' ')
        this.$set(this.tempTitle, idx, title)

        clipboard.writeText(title)
        this.$message({
          message: `${title} 复制到剪贴板`,
          type: 'success'
        })
      },
      initTitle() {
        var params = {
          id: this.cur_row.id
        }
        getTitles(params).then(res => {
          this.titles = res.titles
          for (var country of this.countryOptions) {
            if (!this.titles[country.id]) {
              this.titles[country.id] = {
                title_0: [],
                title_1: [],
                commodity_id: this.cur_row.id,
                country_id: country.id
              }
            }
          }
          this.$forceUpdate()
        })
        this.titles = []
        for (const country of this.countryOptions) {
          this.titles[country.id] = []
        }
      },
      delKW(row, label) {
        row.splice(row.indexOf(label), 1)
        this.handlePostMessage()
      },
      setKw(row, index) {
        if (this.keyword[index] === '' || this.keyword[index] === undefined) {
          return false
        }

        for (var i = 0; i < this.cur_row.keyword.length; i++) {
          var labels = this.cur_row.keyword[i].label
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
        this.handlePostMessage()
      },
      changeCountry(cList) {
        var countryList = []
        for (const c of cList) {
          var countryOption = this.countryOptions.find(co => {
            return c === co['lang']
          })
          if (countryOption) {
            countryList.push(countryOption)
          }
        }
        this.cur_row.country = countryList
        this.handlePostMessage()
      },
      // 行双击时给父组件广播事件
      saveTitles() {
        var params = {
          titles: this.titles
        }
        editTitle(params).then(res => {
          if (res.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
          this.initTitle()
        })
      },
      handlePostMessage(row, event, column) {
        this.$emit('click', this.cur_row)
      },
      // 接受父事件
      handleParent(row) {
        this.cur_row = row
        if (this.cur_row.keyword === '' || this.cur_row.keyword.length <= 0) {
          this.cur_row.keyword = [{
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
        }
        this.initTitle()
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
