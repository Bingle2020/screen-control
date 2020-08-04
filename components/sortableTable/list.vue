<template>
  <div class="notice">
    <h5>{{gettitle}}</h5>
    <div>
      <ul>
        <li>1 XXXX设备发生告警事件</li>
        <li>2 XXXX设备发生告警事件</li>
        <li>3 XXXX设备发生告警事件</li>
        <li>4 XXXX设备发生告警事件</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      title: null,
      stamp: null
    }
  },
  computed: {
    ...mapGetters(['getLayData']),
    getStamp() {
      return this.stamp
    },
    gettitle(){
        return this.title
    }
  },
  mounted() {
    this.stamp = this.$attrs.stamp
    this.title = this.getLayData[this.getStamp].title
  }
}
</script>
<style lang="scss" scoped>
.notice {
  height: 100%;
  padding: 0px 15px;
  h5 {
    text-align: center;
    font-size: 18px;
    color: #00b7ed;
    font-weight: 700;
  }
  ul {
    max-height: 140px;
    overflow: auto;
    li {
      text-align: left;
      line-height: 26px;
      color: inherit;
    }
  }
}
</style>