<template>
  <div id="app">
    <!--登入动画-->
    <router-view  class="app-router-view"></router-view>
  </div>
</template>

<script>
import 'vue-transition.css'
import { fun_init } from '@/utils/electron'
export default {
  name: 'App',
  mounted() {
    fun_init()
  }
}

</script>
<style>
  .app .app-router-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;
    backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    transform-style: preserve-3d;
    visibility: visible;
  }
  .el-button--primary {
    color: #fff;
    background-color: #21BAA9;
    border-color: #21BAA9;
  }
  .el-button--primary:focus, .el-button--primary:hover {
    background: rgb(77, 200, 186);
    border-color: rgb(77, 200, 186);
    color: #fff;
  }
</style>
