<template>
    <el-row>
      <el-upload
          :action="uploadUrl"
          :headers="myHeaders"
          list-type="picture-card"
          :file-list="fileList"
          accept=".jpg, .png"
          :on-success="uploadSuccess"
          :on-remove="handleRemove"
          multiple>
          <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img height="800px" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-row>
</template>

<script>
  import {
    getToken
  } from '@/utils/auth'

  import linsd_arr from 'linsd_arr'

  export default {
    name: 'erpPhoto',
    created() {
    },
    data() {
      return {
        myHeaders: {
          'X-Token': getToken(),
          'erp-d': window.localStorage.getItem('erp-d')
        },
        fileList: [],

        dialogImageUrl: '',
        dialogVisible: false,

        returnFile: []
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {
      this.fileList = this.imgList
      this.returnFile = [...this.imgList]
    },
    props: {
      imgList: {
        default: [],
        required: true
      },
      uploadUrl: {
        default: [],
        required: true
      }
    },
    // watch: {},
    methods: {
      handleRemove(file, fileList) {
        var delUrl = file.response !== undefined ? file.response.file : file.url

        var imgIndex = linsd_arr.getIndex(this.returnFile, 'url', delUrl)
        if (imgIndex > -1) {
          this.returnFile.splice(imgIndex, 1)
        }

        this.$emit('change', this.returnFile)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          var imgUrl = res.file
          var result = this.returnFile.filter(item => {
            return item.url === imgUrl
          })
          if (result.length === 0) {
            this.returnFile.push({ url: imgUrl })
          }

          console.log(this.returnFile)
          this.$emit('change', this.returnFile)
        } else {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        }
      }
    }
  }
</script>

<style>
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

  /* .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  } */
</style>
