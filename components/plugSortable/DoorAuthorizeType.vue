<!-- 折线图 -->

<template>
  <div
    class="plug-lineEchart echarts"
    ref="ExcelHome"
    :id="getElementById"
    style="width:100%;height:100%"
  ></div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  props: ['getElementById'],
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
    // this.interval =
    //   Number(
    //     this.getLayData[this.stamp].refresh == null
    //       ? 5
    //       : this.getLayData[this.stamp].refresh
    //   ) *
    //   60 *
    //   1000
    // this.loadData()
    // this.time = setInterval(() => {
    //   this.loadData()
    // }, this.interval)
    this.$nextTick(function() {
      this.loadData()
    })
    // 基于准备好的dom，初始化echarts实例
    //console.log(this.getElementById)

    //console.log(document.getElementById(this.getElementById))
    //  let myChart = this.$echarts.init(document.getElementById(this.getElementById))
    // 绘制图表
    // myChart.setOption(this.option);
  },
  beforeDestroy() {},
  methods: {
    loadData() {
      var labelRight = {
        position: 'right'
      }
      var option = {
        title: {
          text: '交错正负轴标签',
          subtext: 'From ExcelHome',
          sublink: 'http://e.weibo.com/1341556070/AjwF2AgQm'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 80,
          bottom: 30
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
          data: [
            'ten',
            'nine',
            'eight',
            'seven',
            'six',
            'five',
            'four',
            'three',
            'two',
            'one'
          ]
        },
        series: [
          {
            name: '生活费',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              formatter: '{b}'
            },
            data: [
              { value: -0.07, label: labelRight },
              { value: -0.09, label: labelRight },
              0.2,
              0.44,
              { value: -0.23, label: labelRight },
              0.08,
              { value: -0.17, label: labelRight },
              0.47,
              { value: -0.36, label: labelRight },
              0.18
            ]
          }
        ]
      }

      let myChart = this.$echarts.init(this.$refs.ExcelHome)

      myChart.setOption(option)
    }
    // loadData() {
    //   var self = this
    //   var xdata, ydata
    //   axios
    //     .get('/Elevator/Module/DoorAuthorizeType')
    //     .then(res => {
    //       // console.log(res.data)
    //       var data = res.data.data
    //       xdata = new Array([data.length])
    //       ydata = new Array([data.length])
    //       for (var i = 0; i < data.length; i++) {
    //         xdata[i] = data[i]['type']
    //         ydata[i] = data[i]['count']
    //       }
    //       var options = {
    //         title: {
    //           text: self.getLayData[self.getStamp]['title'] == null ? '' : self.getLayData[self.getStamp]['title'],
    //           textStyle: {
    //             color: '#00BBF6'
    //           },
    //           left: 'center'
    //         },
    //         tooltip: {
    //           show:true,
    //         },
    //         grid: {
    //           top: '18%',
    //           bottom: '15%',
    //           left: '12%',
    //           right:'3%'
    //         },
    //         color:["#1DFB04","#00EBF5"],
    //         legend: {
    //           data: xdata
    //         },
    //         xAxis: {
    //           data: xdata,
    //           axisLine: {
    //             lineStyle: {
    //               color: '#00BBF6'
    //             }
    //           }
    //         },
    //         yAxis: {
    //           splitLine: {
    //             show: false
    //           },
    //           axisLine: {
    //             lineStyle: {
    //               color: '#00BBF6'
    //             }
    //           }
    //         },
    //         series: [
    //           {
    //             name: '次数',
    //             type: 'bar',
    //             data: ydata,
    //             barWidth:"30%",
    //           }
    //         ]
    //       }
    //       let myChart = this.$echarts.init(
    //         document.getElementById(this.getElementById)
    //       )

    //       myChart.setOption(options)
    //     })
    //     .catch(e => {
    //       console.log(e)
    //     })

    //   // requestDoorAuthorizeType().then((res)=>{
    //   //   console.log(res)
    //   //
    //   // })
    // }
  }
}
</script>
