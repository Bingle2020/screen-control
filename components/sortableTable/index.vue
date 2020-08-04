<template>
  <div style="width: 100%;height: 100%">
    <!-- 楼栋出入统计 -->
    <DoorTotalOpenRecord v-show="initID == 1" v-bind="$attrs" />
    <!-- 门禁设备状态 -->
    <DoorDeviceState v-show="initID == 2" v-bind="$attrs" />
    <!-- 视频监控状态统计 -->
    <CameraDeviceState v-show="initID == 3" v-bind="$attrs" />
    <!-- 授权卡类型统计 -->
    <DoorAuthorizeType v-show="initID == 4" v-bind="$attrs" />
    <!-- 梯控设备状态 -->
    <EleDeviceState v-show="initID == 5" v-bind="$attrs" />
    <!-- 电梯外招统计 -->
    <EleDevice v-show="initID == 6" v-bind="$attrs" />
    <!-- 刷卡开门统计 -->
    <DoorOpenRecord v-show="initID == 7" v-bind="$attrs" />
    <!-- 视频监控 -->
    <!-- <vdeo v-show="initID == 8" v-bind="$attrs" /> -->
    <!-- 公告 -->
    <!-- <notice v-show="initID == 9" v-bind="$attrs" /> -->
  </div>
</template>

<script>
import DoorOpenRecord from './DoorOpenRecord.vue'
import DoorDeviceState from './DoorDeviceState.vue'
import DoorAuthorizeType from './DoorAuthorizeType.vue'
import CameraDeviceState from './CameraDeviceState.vue'
import EleDevice from './EleDevice.vue'
// import vdeo from '~/components/plugSortable/vdeo.vue'
import DoorTotalOpenRecord from './DoorTotalOpenRecord.vue'
import EleDeviceState from './EleDeviceState.vue'
// import notice from './list.vue'
export default {
  data() {
    return {
      initID: null
    }
  },
  props: ['id', 'grid', 'last'],
  components: {
    DoorOpenRecord,
    DoorDeviceState,
    CameraDeviceState,
    DoorAuthorizeType,
    // vdeo,
    EleDevice,
    // sourceTypeModule,
    DoorTotalOpenRecord,
    EleDeviceState,
    // notice
  },
  mounted() {
    //如果有保存记录则使用保存的模块记录
    if (this.last) {
      this.initID = this.last
    }
    //如果该组件未被打开过模块,则打开新的模块
    else if (this.id) {
      if (this.initID == null) {
        this.initID = this.id
        this.$emit('saveModule', { n: this.grid, m: this.initID })
      }
    }
  },
  methods: {
    removeAt(index) {
      this.$emit('removeCallback', index)
    }
  }
}
</script>

<style lang="scss" scoped>
li {
  list-style: none;
  position: relative;
}
.module-title {
  overflow: hidden;
  position: absolute;
  right: 0;
  span {
    color: #f40;
    float: right;
    padding: 0 10px;
    cursor: pointer;

    &:hover {
      background-color: #e8e8e8;
    }
  }
}
</style>
