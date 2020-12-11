<template>
  <div class="video-js">
    <!-- 第1个下拉框 -->
    <Select
      class="sels"
      v-show="!homeset"
      v-model="formSend.deviceId"
      :label-in-value="true"
      placeholder="茶水间"
      :disabled="canSelect"
      @on-change="getItemName"
      style="width:auto;color:currentColor;z-index:9999;"
    >
      <Option
        v-for="item in deviceList"
        :value="item.deviceId"
        :key="item.deviceId"
      >
      {{ item.channelName }}
      </Option>
    </Select>
    <!-- 第2,3个下拉框 -->
    <!-- v-model="item.deviceId" -->
    <Select
      v-show="!homeset"
      v-model="deviceIds[i + 1]"
      class="sels"
      :class="'sel-' + (i + 1)"
      v-for="(item,i) in getList"
      :key="i"
      :label-in-value="true"
      :disabled="canSelect"
      style="width:auto;color:currentColor;z-index:9999;"
    >
      <Option
        v-for="item in deviceList"
        :value="item.deviceId"
        :key="item.deviceId"
        placeholder="茶水间"
      >{{ item.channelName }}</Option>
    </Select>
    <!-- 轮播，添加场所模块选择 -->
    <div style="position: absolute;right: 20px;top: 0;width: 100px;height: 32px;z-index:999">
      <button
        v-show="!homeset"
        @click="addDevice"
        style="outline:0;float:right; background:transparent;color:#fff;border:1px solid #00BEF7;padding:0 8px;border-radius:20px;font-size:18px"
      >+</button>
      <Select
        v-show="!homeset"
        v-model="time"
        :label-in-value="true"
        placeholder="10S"
        @on-change="turn(time)"
        style="float:right; background:transparent;color:#fff;border:1px solid #fff;width:70px;border:none"
      >
        <Option v-for="item in turnTimeList" :value="item" :key="item">
          {{
          item
          }}
        </Option>
      </Select>
    </div>
    <div style="position: relative;height: 100%">
      <div class="h5videodiv" ref="boxSize" autoplay="autoplay" style="float:left;margin-top: 30px;width:100%;height:calc(100% - 30px);">
        <iframe :src="url + getId" style="width: 100%;height: 98%" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: 0,
      deviceIds: [],
      canSel: false,
      formSend: {
        channelName: '茶水间',
        deviceId: '',
        label: '茶水间'
      },
      time: 0,
      timer: null,
      turnTimeList: [10, 5, 3, 0],
      deviceList: [],
      url: 'http://xxx.xxx.xxx.xxx:8080/MobileVideo.html?id=',
      deviceId: '4f957f15-63e4-4119-9332-83c8b7701fb7',
      stamp: null,
      interval: null
    }
  },
  computed: {
    ...mapGetters(['getLayData']),
    homeset(){
      let o = this.$route.query
      return o.hasOwnProperty("allowEdit") == false && o.hasOwnProperty("homeset") == false
    },
    getList(){
      return this.list
    },
    getId(){
      return this.deviceId
    },
    canSelect(){
      return this.canSel
    }
  },
  mounted() {
    this.stamp = this.$attrs.stamp
    this.interval = Number(this.getLayData[this.stamp].refresh)
    this.loadData()
    this.deviceIds[0] = this.deviceId
  },
  methods: {
    loadData() {
      axios.get('/Elevator/Module/GetCameraDeviceList').then(res => {
        var data = res.data.data
        for (var i = 0; i < data.length; i++) {
          this.deviceList.push(data[i])
        }
      })
    },
    getItemName() {
      this.deviceId = this.formSend.deviceId
      this.deviceIds[0] = this.formSend.deviceId
    },
    addDevice() {
      if(this.list == 2){
        alert("超出范围!")
        return
      }
      this.list++
      this.deviceIds[this.list] = '4f957f15-63e4-4119-9332-83c8b7701fb7'
    },
    turn(time) {
      if (time !== 0) {
        this.canSel = true
        time = time * 1000
        var num = 0
        var self = this
        clearInterval(this.timer)
        this.timer = setInterval(function() {
          if(num == self.list + 1){
            num = 0
          }
          self.deviceId = self.deviceIds[num]
          num++
        }, time)
      } else {
        clearInterval(this.timer)
        this.timer = null
        this.deviceId = this.deviceIds[0]
        this.canSel = false
      }
    }
  }
}
</script>
<style lang="scss" scope>
.video-js {
  position: relative;
  height: 100%;
  width: 100%;
  input {
    width: 40px;
    background: transparent;
    color: inherit;
    padding: 0 10px;
  }
  ul {
    li {
      width: 50px;
    }
  }
  /deep/ .sels{
    position: absolute;
    top: 0;
    float: none;
    left: 0;
  }
  /deep/ .sel-1{
    left: 80px;
  }
  /deep/ .sel-2{
    left: 160px;
  }
}

.ivu-select-single .ivu-select-selection {
  height: 30px;
}
.ivu-select-selection {
  background-color: transparent;
  .ivu-select-single .ivu-select-selection {
    border: 0;
  }
}
.ivu-select-single .ivu-select-selection .ivu-select-placeholder {
  color: inherit;
}
.ivu-select-dropdown {
  background-color: transparent;
  margin: 0;
  .ivu-select-item {
    color: #fff;
    padding: 3px 6px;
    text-align: left;
  }
  .ivu-select-item-focus {
    background-color: transparent;
  }
  .ivu-select-item:hover {
    background-color: transparent;
    color: #00e7f2;
  }
}
.ivu-select-disabled .ivu-select-selection{
  background-color: #060e1a;
  color: #e61414;
}
</style>
