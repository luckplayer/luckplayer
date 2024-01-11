<template>
  <el-row :gutter="1">
    <slot></slot>
  </el-row>
</template>

<script>
  export default {
    name: 'erpItemAlbum',
    created() {},
    data() {
      return {
      }
    },
    computed: {
    },
    watch: {
    },
    mounted() {

    },
    props: {
    },
    // watch: {},
    methods: {
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
