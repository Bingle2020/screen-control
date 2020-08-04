<template>
  <div class="wrap">
    <!-- 文本模块 -->
    <!-- <textModule v-if="initID == 1" /> -->
    <!-- 简报概述 -->
    <!-- <briefingModule v-if="initID == 2" /> -->
    <!-- 监测概述 -->
    <!-- <monitorModule v-if="initID == 3" /> -->
    <!-- 事件走势图 -->
    <!-- <eventTrendModule v-if="initID == 4" /> -->
    <!-- 网站统计 -->
    <!-- <websiteModule v-if="initID == 5" /> -->
    <!-- 来源类型分析 -->
    <!-- <sourceTypeModule v-if="initID == 6" /> -->
    <!-- 媒体活跃度 -->
    <!-- <activeMediaModule v-if="initID == 7" /> -->
    <!-- 情感分析 -->
    <!-- <emotionMdoule v-if="initID == 8" /> -->
    <!-- 地域分布图 -->
    <!-- <regionModule v-if="initID == 9" /> -->
        <DoorTotalOpenRecord v-if="initID == 1" />
        <!-- 门禁设备状态 -->
        <DoorDeviceState v-if="initID == 2" />
        <!-- 视频监控状态统计 -->
        <CameraDeviceState v-if="initID == 3" />
        <!-- 授权卡类型统计 -->
        <DoorAuthorizeType v-if="initID == 4" />
        <!-- 梯控设备状态 -->
        <EleDeviceState v-if="initID == 5" />
        <!-- 门禁设备状态 -->
        <EleDevice v-if="initID == 6" />
        <!-- 刷卡开门统计 -->
        <DoorOpenRecord v-if="initID == 7" />
        <!-- 视频监控 -->
        <vdeo v-if="initID == 8" />
  </div>
</template>

<script>
// import activeMediaModule from './activeMediaModule.vue'
// import briefingModule from './briefingModule.vue'
// import emotionMdoule from './emotionMdoule.vue'
// import eventTrendModule from './eventTrendModule.vue'
// import monitorModule from './monitorModule.vue'
// import regionModule from './regionModule.vue'
// import sourceTypeModule from './sourceTypeModule.vue'
// import textModule from './textModule.vue'
// import websiteModule from './websiteModule.vue'
import DoorOpenRecord from './DoorOpenRecord.vue'
import DoorDeviceState from './DoorDeviceState.vue'
import DoorAuthorizeType from './DoorAuthorizeType.vue'
import CameraDeviceState from './CameraDeviceState.vue'
import EleDevice from './EleDevice.vue'
import vdeo from './vdeo.vue'
import DoorTotalOpenRecord from './DoorTotalOpenRecord.vue'
import EleDeviceState from './EleDeviceState.vue'

export default {
  data(){
    return {
      initID: null
    }
  },
  props: ['id','grid','last'],
  mounted(){
    //如果有保存记录则使用保存的模块记录
    if(this.last){
        this.initID = this.last
    }
    //如果该组件未被打开过模块,则打开新的模块
    else if(this.id){
      if(this.initID == null){
        this.initID = this.id
        this.$emit("saveModule",{n: this.grid,m: this.initID})
      }
    }
  },
  components: {
    // activeMediaModule,
    // briefingModule,
    // emotionMdoule,
    // eventTrendModule,
    // monitorModule,
    // regionModule,
    // sourceTypeModule,
    // textModule,
    // websiteModule
    DoorOpenRecord,
    DoorDeviceState,
    CameraDeviceState,
    DoorAuthorizeType,
    vdeo,
    EleDevice,
    // sourceTypeModule,
    DoorTotalOpenRecord,
    EleDeviceState
  }
}
</script>

<style lang="scss" scoped>
.eventTrend-module{
height: 100%;
}
.wrap{
  width: 100%;
  height: 100%;
}
li {
  list-style: none;
}
.module-title {
  overflow: hidden;
  border-bottom: 1px solid #c8c8c8;
  padding-bottom: 14px;
  margin-bottom: 14px;

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
