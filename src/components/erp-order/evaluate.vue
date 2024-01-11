<template>
  <section class="app-container">
    <!-- 评价展示    -->
    <el-dialog title="订单评论列表" :visible.sync="dialogTableVisibleEvaluate" width="40%">
      <el-table :data="orderEvaluateData">
        <el-table-column property="score" label="评价等级" width="150"></el-table-column>
        <el-table-column property="content" label="评价内容" ></el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: 'erpCommonDelivery',
  created() {
  },
  data() {
    return {
      dialogTableVisibleEvaluate: false
    }
  },
  computed: {
  },
  mounted() {
  },
  props: ['orderEvaluateData'],
  methods: {
    handleEvaluateRef() {
      this.dialogTableVisibleEvaluate = true
      console.log(this.orderEvaluateData)
    }
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
