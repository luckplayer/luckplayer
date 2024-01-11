<template>
  <el-row class="mini-photo-one">
    <el-upload size="mini" class="avatar-uploader upload-one" :action="uploadUrl" :headers="myHeaders" accept=".jpg, .png"
      multiple :show-file-list="false" :on-success="uploadSuccess">
      <el-button type="primary">添加图片</el-button>
    </el-upload>
    <div v-if="returnFile !== undefined && returnFile !== null && returnFile !== ''" class="demo-image__lazy upload-one-show">
      <ul class="el-upload-list el-upload-list--picture-card">
        <li tabindex="0" class="el-upload-list__item is-ready upload-one-w">
          <div>
            <img :src="'http://image.dhgate.com/'+returnFile" alt="" class="el-upload-list__item-thumbnail upload-one-w">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-delete"><i class="el-icon-delete" @click="rmImg()"></i></span>
            </span>
          </div>
        </li>
      </ul>
    </div>
  </el-row>
</template>

<script>
  import {
    getToken
  } from '@/utils/auth'

  export default {
    name: 'erpItemPhotoOne',
    created() {},
    data() {
      return {
        myHeaders: {
          'X-Token': getToken(),
          'erp-d': window.localStorage.getItem('erp-d')
        },

        dialogVisible: false,

        recommendList: [],
        activeNames: ''
      }
    },
    computed: {},
    watch: {},
    mounted() {},
    props: {
      returnFile: {
        default: () => '',
        required: true
      },
      uploadUrl: {
        default: () => [],
        required: true
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
      rmImg() {
        this.$emit('change', {})
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          var img = res.data

          this.$emit('change', img.imgUrl)
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
    float: left
  }

  .upload-one-show {
    margin-left: 10px;
    float: left
  }

  .mini-photo-one .el-upload-list--picture-card .upload-one-w {
    width: 30px;
    height: 30px;
    margin: 0px;
  }
</style>
