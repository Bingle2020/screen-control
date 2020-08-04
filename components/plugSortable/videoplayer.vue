<template>
  <div class="video-js">
    <!-- <div v-if="videoSrc===''" class="no-video">

        暂未播放视频

    </div>-->
    <Select
      v-show="!homeset"
      ref="ct"
      v-model="formSend.label"
      :label-in-value="true"
      @on-change="getItemName"
      style="width:auto;float:left;color:currentColor"
    >
      <Option
        v-for="item in deviceList"
        :value="item.channelName"
        :key="item.channelName"
      >{{ item.label }}</Option>
    </Select>
    <div id="videos" style="width:98%;">
      <input type="hidden" id="hdSelectedCamera" />
      <input type="hidden" id="hdSelectedCameraNum" />
      <input type="hidden" id="iframeUrl" val="http://192.168.40.112:8080/ShowVideo.html" />
      <input type="hidden" id="hdSaveKeyId" />
      <iframe
        id="playVideos"
        name="playVideos"
        :src="url"
        frameborder="0"
        marginwidth="0"
        marginheight="0"
        scrolling="no"
        allowfullscreen="true"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        style="width: 100%;height:100%;"
      ></iframe>
    </div>
  </div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
export default {
  data() {
    return {
      formSend: {
        channelName: '摄像机5',
        deviceId: '摄像机5',
        label: '1f74769f-3e2f-4d7a-a181-23da30ab8d61'
      },
      deviceList: [
        {
          channelName: '摄像机5',
          label: '摄像机5',
          deviceId: '1f74769f-3e2f-4d7a-a181-23da30ab8d61'
        },
        {
          channelName: '摄像机1',
          label: '摄像机1',
          deviceId: 'c400a2eb-6e2e-4213-9cb3-98e112036f27'
        },
        {
          channelName: '摄像机8',
          label: '摄像机8',
          deviceId: 'df3b4af1-24fd-4fd7-a2e1-a3e7242ff220'
        }
      ],
      model1: '',
      url: ''
    }
  },
  mounted() {
    this.loadData()
    window.addEventListener(
      'change',
      function(MessageEvent) {
        var msg =
          'play|0|a16e4f64-f560-4c9b-8054-d0b459bd0d85|1719fe0c-ce67-4c96-8fdb-867da4c9eae1'
        this.url =
          'http://192.168.40.112:8080/ShowVideo.html?showModel=1&siteUrl=' +
          window.location.href +
          '&height=100'
        var origin = event.origin || event.originalEvent.origin
        origin.postMessage(msg, this.url)
      },
      false
    )
  },
  methods: {
    loadData() {
      axios.get('/Elevator/Module/GetCameraDeviceList').then(res => {
        console.log('shetx' + JSON.stringify(res.data))
        this.RealPlayVideos('a16e4f64-f560-4c9b-8054-d0b459bd0d85')
      })
    },
    RealPlayVideos(id) {
      var msg =
        'play|0|a16e4f64-f560-4c9b-8054-d0b459bd0d85|1719fe0c-ce67-4c96-8fdb-867da4c9eae1'
      // var ifr = document.getElementById('playVideos')
      // this.url='http://192.168.40.112:8080/ShowVideo.html?showModel=1&siteUrl=' +window.location.href +'&height=100'
      // top.postMessage(msg, this.url)
    },
    IframeInitialize() {
      $('#iframeUrl').val('http://192.168.40.112:8080/ShowVideo.html')
      var url =
        'http://192.168.40.112:8080/ShowVideo.html?showModel=1&siteUrl=' +
        window.location.href +
        '&height=' +
        $('#playVideos').height()
      document.getElementById('playVideos').attr('src', encodeURI(url))
    },
    getItemName() {
      console.log(this.formSend.deviceId)
      //  var msg = 'play|0|a16e4f64-f560-4c9b-8054-d0b459bd0d85|1719fe0c-ce67-4c96-8fdb-867da4c9eae1'
      // this.url='http://192.168.40.112:8080/ShowVideo.html?showModel=1&siteUrl=' +window.location.href +'&height=100'
      // parent.postMessage(msg, this.url)
      //   this.deviceId = this.formSend.deviceId
    }
  },
  computed: {
    homeset(){
      let o = this.$route.query
      return o.hasOwnProperty("allowEdit") == false && o.hasOwnProperty("homeset") == false
    }
  }
}
</script>
<style lang="scss">
.ivu-select-single .ivu-select-selection {
  height: 30px;
}
.ivu-select-selection {
  background-color: transparent;
  .ivu-select-single .ivu-select-selection {
    border: 0;
  }
}
.ivu-select-dropdown {
  background-color: transparent;
  margin: 0;
  .ivu-select-item {
    color: currentColor;
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
</style>
