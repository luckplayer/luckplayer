<template>
  <div>
	  <div v-print="'#barcode_'+order_no">
	    <vue-barcode :value="order_no" :id="'barcode_'+order_no" >
	      条形码生成失败
	    </vue-barcode>
	  </div>
  </div>
</template>

<script>
  import VueBarcode from 'vue-barcode'
  import print from 'vue-print-nb'
  export default {
    name: 'erpBarCode',
    created() {},
    components: {
      VueBarcode
    },
    directives: {
      print
    },
    data() {
      return {
      }
    },
    computed: {},
    watch: {},
    mounted() {
    },
    props: {
      order_no: {
        default: '',
        required: true
      }
    },
    methods: {
    }
  }
</script>

<style>
</style>
