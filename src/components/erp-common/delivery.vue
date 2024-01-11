<template>
  <section class="app-container">
   <el-dialog
      title="物流查询"
      :visible.sync="dialogVisible"
      width="800"
      v-loading="fullscreenLoading">
      <span class="title">订单号: {{ value.order_no }}&nbsp;&nbsp;&nbsp;运单号: {{ value.delivery_no }}</span>

      <div style="height: 500px;overflow-y: scroll;">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in origin"
            :key="index"
            :color="activity.color">
            {{activity.checkpoint_date}}  {{activity.tracking_detail}}
          </el-timeline-item>
        </el-timeline>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import { deliveryTracking } from '@/api/warehouse.js'
  export default {
    name: 'erpCommonDelivery',
    created() {
    },
    data() {
      return {
        destination: [],
        origin: [],

        dialogVisible: false,
        fullscreenLoading: false
      }
    },
    computed: {
    },
    watch: {
      value: function() {
        this.origin = []
        if (this.value.delivery_no !== '' && this.value.delivery_no !== undefined) {
          this.dialogVisible = true
          this.fullscreenLoading = true
          deliveryTracking({ delivery_no: this.value.delivery_no, shop_id: this.value.shop_id }).then(res => {
            this.origin = res.list.data[0].origin_info.trackinfo

            this.origin[0].color = '#0bbd87'
            this.fullscreenLoading = false
          }).catch(e => {
            this.dialogVisible = false
            this.fullscreenLoading = false
          })
        }
      }
    },
    mounted() {
    },
    props: {
      value: {
      }
    },
    methods: {
    }
  }
</script>

<style scoped="scoped">
  .title {
    margin-left: 58px;
    font-weight: bold;
    padding-bottom: 10px;
    display: block;
  }
  .el-timeline-item{
    padding-bottom: 10px;
  }
</style>
