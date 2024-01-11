<template>
    <el-row class="mini-photo-one">
        <el-button size="mini" @click="dialogImgVisible = true" type='primary' class='upload-one'>替换图片</el-button>
        <div v-if="returnFile !== undefined && returnFile !== null && returnFile !== ''" class="demo-image__lazy upload-one-show">
          <el-image
            style="width: 150px; height: 150px"
            :src="returnFile"
            :preview-src-list="[returnFile]">
          </el-image>
        </div>

        <!--选择商品图-->
        <el-dialog
        title="商品库图片"
        :visible.sync="dialogImgVisible"
        show-close
        :modal="false"
        :fullscreen="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        width="800px;">
          <el-row>
            <el-col style="width: 100px;" v-if="recommendList.ad !== undefined">
              <el-button @click="changePlay('ad')">推广图</el-button>
            </el-col>
            <el-col style="width: 100px;">
              <el-button @click="changePlay('repair')">修图</el-button>
            </el-col>
            <el-col style="width: 100px;">
              <el-button @click="changePlay('org')">原图</el-button>
            </el-col>
            <el-col style="width: 100px;">
              <el-upload
                  class="avatar-uploader"
                  :action="uploadUrl"
                  :headers="myHeaders"
                  accept=".jpg, .png"
                  multiple
                  :show-file-list="false"
                  :on-success="uploadSuccess">
                  <el-button type="primary">上传图片</el-button>
              </el-upload>
            </el-col>
          </el-row>
            <div class="demo-image__lazy">
              <div v-model="activeNames" v-for="(value,index) in listData" :key="index"
               @click="selectImg(value)" class="el-image" style="width: 128px; height: 128px; margin: 0px 10px 10px 0px;border-radius: 5px;">
                  <img :src="value" class="el-image__inner">
                  <label
                  v-if="isSelect(value)"
                  class="el-upload-list__item-status-label">
                      <i class="el-icon-upload-success el-icon-check"></i>
                  </label>
              </div>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
  import {
    getToken
  } from '@/utils/auth'

  // import { getImages } from '@/api/commodity'

  export default {
    name: 'erpItemPhotoOne',
    created() {
    },
    data() {
      return {
        loading: true,
        myHeaders: {
          'X-Token': getToken(),
          'erp-d': window.localStorage.getItem('erp-d'),
          'org-param': this.returnFile
        },
        fileList: [],

        dialogImgVisible: false,
        dialogImageUrl: '',
        dialogVisible: false,

        activeNames: '',
        listData: []
      }
    },
    computed: {
    },
    watch: {
      'recommendList'(newVal, oldVal) {
        if (newVal.ad !== undefined) {
          this.listData = newVal.ad
        } else {
          this.listData = newVal.repair
        }
      }
    },
    mounted() {
      this.fileList[0] = this.returnFile
      if (this.recommendList.ad !== undefined) {
        this.listData = this.recommendList.ad
      } else {
        this.listData = this.recommendList.repair
      }
      // console.log(this.listData)
      // console.log(this.listData, this.recommendList)
    },
    props: {
      returnFile: {
        default: () => '',
        required: true
      },
      uploadUrl: {
        default: () => [],
        required: true
      },
      recommendList: {
        default: () => [],
        required: false
      },
      imgType: {
        default: () => '',
        required: true
      }
    },
    model: {
      prop: 'returnFile',
      event: 'change'
    },
    // watch: {},
    methods: {
      changePlay(type) {
        if (type === 'repair') {
          this.listData = this.recommendList.repair
        } else if (type === 'org') {
          this.listData = this.recommendList.org
        } else if (type === 'ad') {
          this.listData = this.recommendList.ad
        }
      },
      isSelect(item) {
        return this.returnFile === item
      },
      selectImg(selectUrl) {
        if (this.returnFile === selectUrl) {
          this.$emit('change', '')
        } else {
          this.$emit('change', selectUrl)
        }

        this.dialogImgVisible = false
      },
      rmImg() {
        this.$emit('change', '')
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          var imgUrl = res.file

          this.$emit('change', imgUrl)
          this.dialogImgVisible = false
        } else {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        }
      },
      getList() {
        // console.log(this.commodityInfo.id)
        // this.loading = true
        // var params = {}
        // params.commodity_id = this.commodityInfo.id
        // params.imgType = this.imgType
        // getImages(params).then(res => {
        //   this.recommendList = res.list
        //   this.loading = false
        // })
      }
    }
  }
</script>

<style scoped>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    /* max-height: 150px; */
    /* display: block; */
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

  /* .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  } */
</style>

<style>
  .upload-one {
    float:left
  }

  .upload-one-show{
    margin-left:10px;float:left
  }

  .mini-photo-one .el-upload-list--picture-card .upload-one-w{
    margin:0px;
  }
</style>
