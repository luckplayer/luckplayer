<template>
    <el-row>
        <el-button size="mini" @click="addSelect()" type='primary' style="margin-bottom:10px">添加图片</el-button>
        <div class="demo-image__lazy upload-photo">
          <draggable
            class="list"
            v-model="returnFile"
            tag="ul"
            @start="drag = true"
            @end="endHandle"
            :options="{
              animation: 200,
              group: 'description',
              disabled: false,
              ghostClass: 'ghost'
            }">
            <transition-group type="transition" :name="!drag ? 'flip-list' : null" class="el-upload-list el-upload-list--picture-card">
                <li tabindex="0" class="el-upload-list__item is-ready" v-for="(item,index) in returnFile" v-if="item.type !== 3" :key="index" style="height: 100%;">
                    <div>
                        <el-image
                          style="width: 150px; height: 150px"
                          :src="item.imgUrl"
                          :preview-src-list="[item.imgUrl]">
                        </el-image>
                        <el-button size="mini" type="text" @click="changeImg(index)">替换</el-button>
                        <el-button size="mini" type="text" @click="deleteImg(index)">删除</el-button>
                    </div>
                </li>
            </transition-group>
          </draggable>
        </div>

        <!--选择商品图-->
        <el-dialog
        title="推荐图片"
        :visible.sync="dialogImgVisible"
        show-close
        :modal="false"
        :fullscreen="true"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
            <el-row>
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

  import draggable from 'vuedraggable'
  import linsd_arr from 'linsd_arr'

  export default {
    components: {
      draggable
    },
    name: 'erpItemPhoto',
    created() {
    },
    data() {
      return {
        drag: false,

        isIndeterminate: [],
        checkAll: [],

        curIndex: 0,
        loading: true,
        myHeaders: {
          'X-Token': getToken(),
          'erp-d': window.localStorage.getItem('erp-d'),
          'org-param': ''
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
    },
    mounted() {
      this.fileList = this.returnFile
      this.listData = this.recommendList.repair
      // console.log(this.listData)
    },
    props: {
      id: {
        default: 0,
        required: true
      },
      returnFile: {
        default: () => [],
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
      addSelect() {
        this.dialogImgVisible = true
        this.curIndex = ''
      },
      changePlay(type) {
        if (type === 'repair') {
          this.listData = this.recommendList.repair
        } else if (type === 'org') {
          this.listData = this.recommendList.org
        }
      },
      deleteImg(index) {
        this.curIndex = index
        this.returnFile.splice(this.curIndex, 1)
        this.$emit('change', this.returnFile)
      },
      changeImg(index) {
        this.curIndex = index
        this.myHeaders['org-param'] = this.returnFile[this.curIndex].imgUrl
        this.dialogImgVisible = true
      },
      initImg() {
        for (var index = 0; index < this.recommendList.length; index++) {
          var imgList = this.recommendList[index].list
          for (var i = 0; i < imgList.length; i++) {
            var files = imgList[i].files
            if (files.length <= 0) {
              this.checkAll[index + '_' + i] = false
            }

            for (var j = 0; j < files.length; j++) {
              var isExist = this.returnFile.findIndex(item => {
                return item.url === files[j]
              })
              if (isExist <= -1) {
                this.checkAll[index + '_' + i] = false
              }
            }

            if (this.checkAll[index + '_' + i] !== false) {
              this.checkAll[index + '_' + i] = true
            }
          }
        }
      },
      handleCheckAllChange(index, i) {
        var cur = this.recommendList[index].list[i].files

        if (this.checkAll[index + '_' + i]) {
          for (var j = 0; j < cur.length; j++) {
            var addIndex = this.returnFile.findIndex(item => {
              return item.url === cur[j]
            })
            if (addIndex <= -1) {
              this.returnFile.push({ url: cur[j] })
            }
          }
        } else {
          for (var k = 0; k < cur.length; k++) {
            var delIndex = this.returnFile.findIndex(item => {
              return item.url === cur[k]
            })
            if (delIndex > -1) {
              this.returnFile.splice(delIndex, 1)
            }
          }
        }
      },
      isSelect(item) {
        return linsd_arr.getIndex(this.returnFile, 'imgUrl', item) > -1
      },
      selectImg(selectUrl) {
        if (this.curIndex === '') {
          this.returnFile.push({
            imgMd5: '',
            imgUrl: selectUrl,
            type: 1
          })
          console.log(this.returnFile)
        } else {
          this.returnFile[this.curIndex].imgUrl = selectUrl
        }

        this.$emit('change', this.returnFile)
        this.dialogImgVisible = false
      },
      rmImg(delUrl) {
        var imgIndex = linsd_arr.getIndex(this.returnFile, 'url', delUrl)
        if (imgIndex > -1) {
          this.returnFile.splice(imgIndex, 1)
        }

        this.$emit('change', this.returnFile)
      },
      endHandle() {
        this.$emit('change', this.returnFile)
        this.drag = false
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      uploadSuccess(res, file, fileList) {
        if (res.code === 0) {
          this.returnFile[this.curIndex].imgUrl = res.file

          this.$emit('change', this.returnFile)
          this.dialogImgVisible = false
        } else {
          this.$message({
            message: '上传失败',
            type: 'error'
          })
        }
      },
      getList(id) {
        this.loading = true
        var params = {}
        params.commodity_id = this.commodityInfo.id
        params.imgType = this.imgType
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
