<template>
  <div class="plug-pieEchart echarts" ref="water" :id="id" style="width:100%;height:100%"></div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
// import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  props: ['layout', 'id'],
  data() {
    return {
      time: null,
      stamp: null,
      interval: null
    }
  },
  computed: {
    ...mapGetters(['getLayData']),
    getStamp() {
      return this.stamp
    }
  },
  mounted() {
    // this.stamp = this.$attrs.stamp
    // this.interval = Number(this.getLayData[this.stamp].refresh == null ? 5 : this.getLayData[this.stamp].refresh) * 60 *1000
    //   this.loaddata()
    //   this.time = setInterval(() => {
    //   this.loaddata()
    // }, this.interval)
    this.$nextTick(function() {
      this.loaddata()
    })
  },

  methods: {
    loaddata() {
      var option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'line',
            symbol: 'triangle',
            symbolSize: 20,
            lineStyle: {
              color: 'green',
              width: 4,
              type: 'dashed'
            },
            itemStyle: {
              borderWidth: 3,
              borderColor: 'yellow',
              color: 'blue'
            }
          }
        ]
      }

      let myChart = this.$echarts.init(this.$refs.water)
      // 绘制图表
      myChart.setOption(option)
    }
    // loaddata(){
    //   var self = this
    //   axios.get('/Elevator/Module/EleDeviceState').then(res => {
    //     // console.log(res.data.data)
    //     var data = res.data.data
    //     var online , total
    //     online = data[0].count
    //     total = data[1].count
    //     var option = {
    //       tooltip: {
    //         trigger: 'item',
    //         formatter: '{a} <br/>{b} : {c} ({d}%)'
    //       },
    //       title: {
    //           text: self.getLayData[self.getStamp]['title'] == null ? '' : self.getLayData[self.getStamp]['title'],
    //           textStyle: {
    //             color: '#00BBF6'
    //           },
    //           left: 'center'
    //         },
    //       color:["#00EBF5","#0063CD"],
    //       series: [
    //         {
    //           type: 'pie',
    //           radius: '55%',
    //           center: ['50%', '55%'],
    //           data: [
    //             { value: online, name: '在线' },
    //             { value: total, name: '离线' }
    //           ],
    //           itemStyle: {
    //             emphasis: {
    //               shadowBlur: 10,
    //               shadowOffsetX: 0,
    //               shadowColor: 'rgba(0, 0, 0, 0.5)'
    //             }
    //           }
    //         }
    //       ]
    //     }
    //     console.log('加载函数')
    //     // 基于准备好的dom，初始化echarts实例
    //     let myChart = this.$echarts.init(document.getElementById(this.id))
    //     // 绘制图表
    //     myChart.setOption(option)
    //   })
    //   .catch(e => {
    //       console.log(e)
    //     })
    // }
  }
}
</script>
