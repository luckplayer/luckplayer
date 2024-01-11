<template>
    <section class="app-container">
        <el-dialog
        title=""
        :visible.sync="dialogVisible"
        show-close
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="800px">
          <el-tabs v-model="activeName" style="height: 670px">
            <el-tab-pane label="上传历史图片" name="first">
              <div class="demo-image__lazy">
                <div v-for="(file,j) in itemcode_list" :key="j" @click="selectImg2(file.img_url)" class="el-image" style="width: 128px; height: 128px; margin: 0px 10px 10px 0px;border-radius: 5px;">
                  <el-tooltip placement="right" :enterable="false">
                    <div slot="content">
                      <img :src="file.img_url" style="max-width: 400px;"/>
                    </div>
                    <img :src="file.img_url" class="el-image__inner">
                  </el-tooltip>
                  <label
                    v-if="isSelect(file.img_url)"
                    class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="商品库图片" name="second">
              <div class="demo-image__lazy">
                <el-collapse v-model="activeNames" v-for="(value,index) in recommendList" :key="index">
                  <el-collapse-item :title="value.name" :name="value.name">
                    <div v-for="(item,i) in value.list" :key="i">
                      <p>{{ item.type }}</p>
                      <div v-for="(file,j) in item.files" :key="j"
                           @click="selectImg(file, index, i)" class="el-image" style="width: 128px; height: 128px; margin: 0px 10px 10px 0px;border-radius: 5px;">
                        <el-tooltip placement="right" :enterable="false">
                          <div slot="content">
                            <img :src="file" style="max-width: 400px;"/>
                          </div>
                          <img :src="file" class="el-image__inner">
                        </el-tooltip>
                        <label
                          v-if="isSelect(file)"
                          class="el-upload-list__item-status-label">
                          <i class="el-icon-upload-success el-icon-check"></i>
                        </label>
                      </div>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-row>
            <el-col :span="12" v-if="returnFile.length < 4">
              <el-upload
                v-if="isPermissions('@Post:lv_operate_editProduct')"
                class="avatar-uploader"
                :action="upload_url"
                :headers="myHeaders"
                :data="uploadData()"
                accept=".jpg, .png"
                :show-file-list="false"
                :on-success="uploadSuccess">
                <el-button type="primary">上传图片</el-button>
              </el-upload>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" @click = "saveImages">确定</el-button>
            </el-col>
          </el-row>
        </el-dialog>
    </section>
</template>

<script>
import { isPermissions, getToken } from '@/utils/auth'
import { fun_getRoleKey } from '@/utils/common'
import { getImages } from '@/api/commodity'
import { editProduct } from '@/api/operate'

export default {
  data() {
    return {
      roleKey: '',
      dialogVisible: false,
      disableClick: false,

      /** 上传 */
      upload_url: process.env.BASE_API + '/lv/operate/editProduct',
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
    selectImg(selectUrl, index, i) {
      var imgIndex = this.returnFile.indexOf(selectUrl)
      if (imgIndex > -1) {
        this.returnFile.splice(imgIndex, 1)
        this.checkAll[index + '_' + i] = false
      } else {
        this.returnFile.push(selectUrl)
        this.checkAll[index + '_' + i] = true
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
      this.dialogVisible = true
      this.roleKey = fun_getRoleKey()
      this.getList(id)
    },
    getList(id) {
      this.loading = true
      var params = {}
      params.commodity_id = id
      params.itemcode = this.item_product.itemcode
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
