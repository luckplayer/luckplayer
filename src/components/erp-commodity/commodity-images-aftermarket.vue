<template>
    <section class="app-container">
        <el-dialog
        title=""
        :visible.sync="dialogVisible"
        show-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :fullscreen="true">
          <div v-for="(value,index) in recommendList" :key="index" style="float: left;width: 250px;height: 250px;margin: 5px;">
            <div v-if="isSelect(value)" style="border: 1px solid #409EFF;">
              <img :src="value" @click="selectImg(value, index)" class="el-image__inner">
            </div>
            <div v-else>
              <img :src="value" @click="selectImg(value, index)" class="el-image__inner">
            </div>
          
          </div>
          <div style="clear: both;"></div>
          <el-button @click = "dialogVisible = false" style="height: 69px;border-radius: 76px;position: fixed; right: 100px; bottom: 400px;">关闭</el-button>
          <el-button type="primary" @click = "saveImages" style="height: 69px;border-radius: 76px;position: fixed; right: 100px; bottom: 200px;">确定</el-button>
        </el-dialog>
    </section>
</template>

<script>
import { isPermissions, getToken } from '@/utils/auth'
import { fun_getRoleKey } from '@/utils/common'
import { getImages } from '@/api/commodity'
import { editProduct } from '@/api/aftermarket'

export default {
  data() {
    return {
      roleKey: '',
      dialogVisible: false,
      disableClick: false,

      /** 上传 */
      upload_url: process.env.BASE_API + '/lv/aftermarket/editProduct',
      myHeaders: {
        'X-Token': getToken(),
        'erp-d': window.localStorage.getItem('erp-d')
      },
      item_product: {},
      clearable: true,
      loading: false,
      list: [],
      checkAll: [],
      returnFile: [],
      selectedImg: '',

      recommendList: [],
      activeNames: '',
      activeName: 'second',
      itemcode_list: []
    }
  },
  methods: {
    isPermissions(permissionPath) {
      return isPermissions(permissionPath)
    },
    isSelect(item) {
      return this.returnFile.indexOf(item) > -1
    },
    selectImg(selectUrl, index) {
      var imgIndex = this.returnFile.indexOf(selectUrl)
      if (imgIndex > -1) {
        this.returnFile.splice(imgIndex, 1)
        this.checkAll[index] = false
      } else {
        this.returnFile.push(selectUrl)
        this.checkAll[index] = true
      }
    },
    selectImg2(selectUrl) {
      var imgIndex = this.returnFile.indexOf(selectUrl)
      if (imgIndex > -1) {
        this.returnFile.splice(imgIndex, 1)
      } else {
        this.returnFile.push(selectUrl)
      }
    },
    uploadData() {
      var params = JSON.parse(JSON.stringify(this.item_product))
      return params
    },
    uploadSuccess(res, file) {
      if (res.code === 0) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        this.returnFile.push(res.file)
        this.handleRowDblclick(this.returnFile)
        // this.handleRowDblclick(res.file)
      } else {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
      }
    },
    // 行双击时给父组件广播事件
    handleRowDblclick(row, event, column) {
      this.$emit('db-click', row)
      this.dialogVisible = false
    },
    saveImages() {
      if (this.returnFile.length < 1) {
        this.$message({
          message: '最少上传1张',
          type: 'error'
        })
        return
      } else if (this.returnFile.length > 4) {
        this.$message({
          message: '最多上传4张',
          type: 'error'
        })
        return
      }
      var params = JSON.parse(JSON.stringify(this.item_product))
      params.item_image = this.returnFile
      params.mine_item_image = this.returnFile.join(',')
      editProduct(params).then(res => {
        if (res.code === 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.handleRowDblclick(this.returnFile)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    // 接受父事件
    handleCommodityImages(row, index) {
      this.item_product = JSON.parse(JSON.stringify(row))
      this.item_product.mine_item_image = JSON.parse(JSON.stringify(row.item_image))
      const returnFileLength = this.returnFile.length
      for (var i = 0; i < returnFileLength; i++) {
        this.returnFile.pop()
      }
      this.item_product.mine_item_image.forEach(image => {
        this.returnFile.push(image)
      })
      this.selectedImg = row.item_image[index]
      var id = row.commodity_id
      var detail_id = row.commodity_detail_id
      this.dialogVisible = true
      this.roleKey = fun_getRoleKey()
      this.getList(id, detail_id)
    },
    getList(id, detail_id) {
      this.loading = true
      var params = {}
      params.commodity_id = id
      params.itemcode = this.item_product.itemcode
      params.detail_id = detail_id
      getImages(params).then(res => {
        this.recommendList = res.list
        this.activeNames = this.recommendList.length > 0 ? this.recommendList[0].name : ''
        this.itemcode_list = res.list2
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
.el-upload-list__item-status-label {
    display: block;
    position: absolute;
    right: -17px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    transform: rotate(45deg);
    box-shadow: 0 1px 1px #ccc;
  }
  .el-upload-list__item-status-label i {
    color: #fff;
    font-size: 12px;
    margin-top: 12px;
    transform: rotate(-45deg);
 }
</style>
