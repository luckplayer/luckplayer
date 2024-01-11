<template>
    <section class="app-container">
        <el-dialog
        title="默认商品标签"
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
                <el-col :span="24">
                  <p>设置后，当前商品后续出的单，订单属性会默认带有以下内容</p>
                  <el-input v-model="form.title" type="textarea"></el-input>
<!--                    <div v-for="(shortcut, indexShort) in list.shortcutLabel" :key="indexShort">
                      <div v-if="shortcut.common_attr==0">
                        <div>{{ shortcut.label }}</div>
                        <el-tag v-for="(item, index) in shortcut.value" :class="getTagClass(item.label)" :key="index" @click="checkLabel(item.label)" >{{item.label}}</el-tag>
                        <hr />
                      </div>
                    </div> -->
                  <!-- <el-checkbox-group @change="checkLabel" v-model="checkboxGroup" size="small">
                    <div v-for="(shortcut, indexShort) in list.shortcutLabel" :key="indexShort">
                      <div v-if="shortcut.common_attr==0">
                        <div>{{ shortcut.label }}</div>
                        <el-checkbox v-for="(item, index) in shortcut.value" :key="index" size="mini" :label="item.label" />
                        <hr />
                      </div>
                    </div>
                  </el-checkbox-group> -->
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-button @click="submit">确认</el-button>
                </el-col>
            </el-row>
        </el-dialog>
    </section>
</template>

<script>
import { goodsAttrLabel, setGoodsAttrLabel } from '@/api/item'

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

      form: {
        order_product_id: '',
        mine_item_attr: '',
        itemcode: '',
        title: ''
      }
    }
  },
  methods: {
    // 接受父事件
    handleShortcutLabel(row) {
      this.cur_row = row
      this.form.order_product_id = row.id

      this.form.itemcode = row.itemcode
      this.form.title = ''
      this.getList()

      this.dialogVisible = true
    },
    getList() {
      this.loading = true
      var params = { itemcode: this.form.itemcode }
      goodsAttrLabel(params).then(res => {
        this.form.title = res.data.title
      })
    },
    submit() {
      this.form.mine_item_attr = this.cur_row.mine_item_attr + ' ' + this.form.title
      setGoodsAttrLabel(this.form).then(res => {
        if (res.code === 0) {
          this.handleRowClick(this.form.mine_item_attr)
          this.$message({
            type: 'success',
            message: '操作成功'
          })
        }
      })
    },
    // 给父组件广播事件
    handleRowClick(mine_item_attr) {
      this.$emit('click', mine_item_attr)
    }
  }
}
</script>

<style>
.el-tag.SelectTag {
  color: #ffffff;
  background-color: #cccccc;
  border-color:  #cccccc;
}
.el-row {
  margin-bottom: 10px;
}
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
