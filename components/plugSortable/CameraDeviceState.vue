<template>
  <div class="plug-pieEchart echarts" ref="wujitu" :id="id" style="width:100%;height:100%"></div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  props: ['layout', 'id'],
  data() {
    return {
      time: null,
      stamp: null,
      intervl: null
    }
  },
  computed: {
    ...mapGetters(['getLayData']),
    getStamp() {
      return this.stamp
    }
  },
  beforeDestroy() {
    // clearInterval(this.time)
    // this.time = null
  },
  mounted() {
    // this.stamp = this.$attrs.stamp
    // this.intervl =
    //   Number(
    //     this.getLayData[this.stamp].refresh == null
    //       ? 5
    //       : this.getLayData[this.stamp].refresh
    //   ) *
    //   60 *
    //   1000
    // this.loaddata()
    this.$nextTick(function(){
      this.loaddata()
    })
    // this.time = setInterval(() => {
    //   this.loaddata()
    // }, this.intervl)
  },
  methods: {
    loaddata() {
      var data = []

      for (var i = 0; i <= 360; i++) {
        var t = (i / 180) * Math.PI
        var r = Math.sin(2 * t) * Math.cos(2 * t)
        data.push([r, i])
      }

      var option = {
        title: {
          text: '极坐标双数值轴'
        },
        legend: {
          data: ['line']
        },
        polar: {
          center: ['50%', '54%']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        angleAxis: {
          type: 'value',
          startAngle: 0
        },
        radiusAxis: {
          min: 0
        },
        series: [
          {
            coordinateSystem: 'polar',
            name: 'line',
            type: 'line',
            radius: '55%',
            center: ['50%', '60%'],
            showSymbol: false,
            data: data
          }
        ],
        animationDuration: 2000
      }

      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.wujitu)
      // 绘制图表
      myChart.setOption(option)
    }
    // loaddata() {
    //   var self = this
    //   axios
    //     .get('/Elevator/Module/CameraDeviceState')
    //     .then(res => {
    //       // console.log(res.data.data)
    //       var data = res.data.data
    //       var online, total
    //       online = data[1].count
    //       total = data[0].count
    //       // console.log(total)

    //       var option = {
    //         tooltip: {
    //           trigger: 'item',
    //           formatter: '{a} <br/>{b} : {c} ({d}%)'
    //         },
    //         title: {
    //           text:
    //             self.getLayData[self.getStamp]['title'] == null
    //               ? ''
    //               : self.getLayData[self.getStamp]['title'],
    //           textStyle: {
    //             color: '#00BBF6'
    //           },
    //           left: 'center'
    //         },
    //         color: ['#00EBF5', '#0063CD'],
    //         series: [
    //           {
    //             name: '',
    //             type: 'pie',
    //             radius: '55%',
    //             center: ['50%', '60%'],
    //             data: [
    //               { value: online, name: '在线' },
    //               { value: total, name: '离线' }
    //             ],
    //             itemStyle: {
    //               emphasis: {
    //                 shadowBlur: 10,
    //                 shadowOffsetX: 0,
    //                 shadowColor: 'rgba(0, 0, 0, 0.5)'
    //               }
    //             }
    //           }
    //         ]
    //       }
    //       console.log('加载函数')
    //       // 基于准备好的dom，初始化echarts实例
    //       let myChart = this.$echarts.init(document.getElementById(this.id))
    //       // 绘制图表
    //       myChart.setOption(option)
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })
    // }
  }
}
</script>