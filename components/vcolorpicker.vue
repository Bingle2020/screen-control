<template>
  <colorPicker v-model="color" />
</template>
<script>
import vcolorpicker from 'vcolorpicker'
Vue.use(vcolorpicker)
  export default {
    data () {
      return {
        color: '#fff'
      }
    }
  }
</script>
