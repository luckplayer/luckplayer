<template>
  <el-row>
    <el-upload size="mini" type='primary' style="margin-bottom:10px" class="avatar-uploader" :action="uploadUrl"
      :headers="myHeaders" accept=".jpg, .png" multiple :show-file-list="false" :on-success="uploadSuccess">
      <el-button type="primary">上传图片</el-button>
    </el-upload>
    <div class="demo-image__lazy upload-photo">
      <draggable class="list" v-model="returnFile" tag="ul" @start="drag = true" @end="drag = false" :options="{
              animation: 200,
              group: 'description',
              disabled: false,
              ghostClass: 'ghost'
            }">
        <transition-group type="transition" :name="!drag ? 'flip-list' : null" class="el-upload-list el-upload-list--picture-card">
          <li tabindex="0" class="el-upload-list__item is-ready" v-for="(item,index) in returnFile" :key="index">
            <el-tooltip placement="top">
              <div slot="content">
                <img :src="'http://image.dhgate.com/'+item.imgUrl" alt="" class="el-upload-list__item-thumbnail" style="max-width:400px;">
              </div>
              <div>
                <img :src="'http://image.dhgate.com/'+item.imgUrl" alt="" class="el-upload-list__item-thumbnail" style="width:150px;height:150px;">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete"><i class="el-icon-delete" @click="rmImg(item.imgUrl)"></i></span>
                </span>
              </div>
            </el-tooltip>
          </li>
        </transition-group>
      </draggable>
    </div>
  </el-row>
</template>

<script>
  import {
    getToken
  } from '@/utils/auth'

  import draggable from 'vuedraggable'

  export default {
    components: {
      draggable
    },
    name: 'erpItemPhoto',
    created() {},
    data() {
      return {
        drag: false,

        isIndeterminate: [],
        checkAll: [],

        loading: true,
        myHeaders: {
          'X-Token': getToken(),
          'erp-d': window.localStorage.getItem('erp-d')
        }
      }
    },
    computed: {},
    watch: {},
    mounted() {
    },
    props: {
      returnFile: {
        default: () => [],
        required: true
      },
      uploadUrl: {
        default: '',
        required: true
      },
      imgType: {
        default: '',
        required: true
      }
    },
    model: {
      prop: 'returnFile',
      event: 'change'
    },
    // watch: {},
    methods: {
      rmImg(delUrl) {
        var imgIndex = this.returnFile.findIndex(item => {
          return delUrl === item.imgUrl
        })
        if (imgIndex > -1) {
          this.returnFile.splice(imgIndex, 1)
        }

        this.$emit('change', this.returnFile)
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          var img = res.data
          var result = this.returnFile.filter(item => {
            return item.imgUrl === img.imgUrl
          })
          if (result.length === 0) {
            this.returnFile.push(img)
          }

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
