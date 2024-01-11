<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-select v-model="albWindowId" filterable placeholder="请选择">
        <el-option v-for="album in albumOptions" :key="album.value" :label="album.label" :value="album.value">
        </el-option>
      </el-select>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totle">
      </el-pagination>
    </div>
    <el-row>
      <el-col :span="4" v-for="(img,index) in imgList" :key="index">
        <el-card :body-style="{ padding: '0px',height: '180px' }"  shadow="hover">
          <div style="height: 150px;text-align: center;">
            <img :src="'http://image.dhgate.com/'+img.imgUrl" class="image" @click="handleClickImg(img)">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>

</template>

<script>
  import {
    albumList,
    albumImgList
  } from '@/api/dhgateApi'
  export default {
    name: 'dhAlbum',
    created() {},
    data() {
      return {
        albumOptions: [],
        albWindowList: [],
        imgList: [],

        albWindowId: '',

        pageSize: 0,
        pageNum: 1,
        totle: 0
      }
    },
    computed: {},
    watch: {},
    mounted() {
      this.getAlbumList()
    },
    props: {
      shopName: {
        default: '',
        required: true
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.getImgList()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getImgList()
      },
      handleClickImg(img) {
        this.$emit('choose', img)
        this.$message({
          message: '选择成功',
          type: 'success'
        })
        // console.info(img)
      },
      getImgList() {
        const params = {
          shopName: this.shopName,
          albWindowId: this.albWindowId,
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
        albumImgList(params).then(res => {
          if (res.code === 0) {
            const data = res.data
            this.totle = data.count
            this.imgList = data.imageList
            console.info('this.imgList', this.imgList)
          } else {
            this.$message.error('获取失败')
          }
        })
      },
      getAlbumList() {
        albumList(this.shopName).then(res => {
          if (res.code === 0) {
            this.albWindowList = res.data.albWindowList
            for (const albWindow of this.albWindowList) {
              const albumOption = {
                value: albWindow.albWindowId,
                label: albWindow.albName
              }
              this.albumOptions.push(albumOption)
              if (albWindow.defAlbum === 1) {
                this.albWindowId = albWindow.albWindowId
                this.getImgList()
              }
            }
            // res.data.albWindowList
          } else {
            this.$message.error('获取失败')
          }
        })
      }
    }
  }
</script>

<style>
</style>
