<template>
    <section class="app-container">
        <el-dialog 
        title="选择属性" 
        :visible.sync="dialogVisible" 
        show-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="800px">
            <el-row>
              <el-col :span="6">
                <img v-if="cur_row.item_image !== undefined" :src="cur_row.item_image[0]" height="100">
              </el-col>
              <el-col :span="18">
                <p>{{ cur_row.item_name }}</p>
                <p>{{ cur_row.init_item_attr }}</p>
              </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-tag
                    v-for="tag in list.color"
                    :key="tag"
                    @click="checkAttr1(tag)">
                    {{tag}}
                    </el-tag>
                </el-col>
                <el-col :span="12">
                    <el-tag
                    v-for="tag in list.size"
                    :key="tag"
                    @click="checkAttr2(tag)">
                    {{tag}}
                    </el-tag>
                </el-col>
            </el-row>
            <!-- <el-row>
              <hr />
                <el-col :span="12">
                  <div>通用颜色</div>
                  <el-tag
                  v-for="tag in commonList.color"
                  :key="tag.value"
                  @click="checkAttr1(tag.label)">
                  {{tag.label}}
                  </el-tag>
                </el-col>
                <el-col :span="12">
                  <div>通用尺码</div>
                  <el-tag
                  v-for="tag in commonList.size"
                  :key="tag.valu"
                  @click="checkAttr2(tag.label)">
                  {{tag.label}}
                  </el-tag>
                </el-col>
            </el-row> -->

            <el-row>
                <el-col :span="12">
                    <el-button @click="handleRowDblclick">确认</el-button>
                </el-col>
                <el-col :span="12">
                    <p>颜色：{{color}}</p>
                    <p>尺码：{{size}}</p>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
import { isPermissions } from '@/utils/auth'
import { fun_getRoleKey } from '@/utils/common'
import { getAttr, getShortcutLabel } from '@/api/commodity'

export default {
  data() {
    return {
      roleKey: '',
      dialogVisible: false,

      /** 上传 */
      cur_row: {},
      clearable: true,
      loading: false,
      list: [],
      commonList: {},

      color: '',
      size: ''
    }
  },
  methods: {
    isPermissions(permissionPath) {
      return isPermissions(permissionPath)
    },
    checkAttr1(tag1) {
      this.color = tag1
    },
    checkAttr2(tag2) {
      this.size = tag2
    },
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      if (!this.color && !this.size) {
        this.$message({
          message: '请选择属性后点击确认',
          type: 'error'
        })
        return false
      }
      var attrStr = this.color + ', ' + this.size + this.initAttrLabel
      this.$emit('db-click', attrStr)
      this.dialogVisible = false
    },
    // 接受父事件
    handleCommodityAttr(row) {
      this.cur_row = row
      console.log(this.cur_row)
      var id = row.commodity_id
      this.initAttrLabel = '' // 初始化赋空，防止保存上次标签信息
      this.color = '' // 初始化赋空，防止保存上次属性
      this.size = '' // 初始化赋空，防止保存上次属性
      if (row.mine_item_attr) {
        var htmlLabels = row.mine_item_attr.match(/<span.*?>.*<\/span>/i)
        if (htmlLabels !== null && htmlLabels !== undefined) {
          this.initAttrLabel = ' ' + htmlLabels[0]
        }
      }
      this.dialogVisible = true
      this.roleKey = fun_getRoleKey()
      this.getList(id)
    },
    getList(id) {
      this.loading = true
      var params = {}
      params.commodity_id = id
      getAttr(params).then(res => {
        this.list = res.list
        this.loading = false
      })
      getShortcutLabel(params).then(res => {
        // console.log(res)
        this.$set(this.commonList, 'color', [])
        this.$set(this.commonList, 'size', [])
        for (var i in res.list.shortcutLabel) {
          if (Number(res.list.shortcutLabel[i].common_attr) === 1 && res.list.shortcutLabel[i].label === '颜色') {
            this.commonList.color = res.list.shortcutLabel[i].value
          }
          if (Number(res.list.shortcutLabel[i].common_attr) === 1 && res.list.shortcutLabel[i].label === '尺码') {
            this.commonList.size = res.list.shortcutLabel[i].value
          }
        }
        // this.commonList = res.list
        this.loading = false
      })
    }
  }
}
</script>

<style>
.el-image {
    margin: 5px;
    border-radius: 5px;
    cursor: pointer;
}
.demo-image__lazy {
    height: 600px;
    overflow-y: scroll;
}
.el-tag {
    margin: 5px;
    cursor: pointer;
}
</style>