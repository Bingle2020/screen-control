<!-- 折线图 -->

<template>
  <div
    class="plug-lineEchart echarts"
    :id="getElementById"
    style="width:100%;height:100%"
  ></div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
export default {
  props: ['getElementById'],
  data() {
    return {
      // option: {
      //   title: {
      //     text: '这是标题',
      //     textStyle: {
      //       color: '#00BBF6'
      //     },
      //     left: 'center'
      //   },
      //   color: ['#94bdf1', '#2db4e2', '#fba555', '#e84252', '#c83743'],
      //   tooltip: {
      //     trigger: 'axis'
      //   },
      //   grid: {
      //     top: '15%',
      //     bottom: '10%',
      //     left: '10%',
      //     right: 0
      //   },
      //   textStyle: {
      //     color: '#00BBF6'
      //   },
      //   legend: {
      //     data: ['全部', '正面', '中性', '负面', '负面占比'],
      //     top: 10
      //   },
      //   calculable: true,
      //   xAxis: [
      //     {
      //       type: 'category',
      //       boundaryGap: false,
      //       data: [
      //         '2019-05-01',
      //         '2019-05-08',
      //         '2019-05-15',
      //         '2019-05-22',
      //         '2019-05-29'
      //       ],
      //       axisLine: {
      //         lineStyle: {
      //           color: '#00BBF6'
      //         }
      //       }
      //     }
      //   ],
      //   yAxis: [
      //     {
      //       type: 'value',
      //       splitLine: {
      //         show: false
      //       },
      //       axisLine: {
      //         lineStyle: {
      //           color: '#00BBF6'
      //         }
      //       }
      //     }
      //   ],
      //   series: [
      //     {
      //       name: '全部',
      //       type: 'line',
      //       smooth: true,
      //       data: [11, 11, 15, 13, 12, 13, 10]
      //     },
      //     {
      //       name: '正面',
      //       type: 'line',
      //       smooth: true,
      //       data: [71, 50, 32, 45, 32, 25, 90]
      //     },
      //     {
      //       name: '中性',
      //       type: 'line',
      //       smooth: true,
      //       data: [81, 20, 62, 45, 43, 22, 50]
      //     },
      //     {
      //       name: '负面',
      //       type: 'line',
      //       smooth: true,
      //       data: [23, 53, 12, 65, 53, 28, 50]
      //     },
      //     {
      //       name: '负面占比',
      //       type: 'line',
      //       smooth: true,
      //       data: [13, 60, 26, 53, 37, 22, 102]
      //     }
      //   ]
      // }
    }
  },
  mounted() {
    this.loadData()

    // 基于准备好的dom，初始化echarts实例
    //console.log(this.getElementById)

    //console.log(document.getElementById(this.getElementById))
    //  let myChart = this.$echarts.init(document.getElementById(this.getElementById))
    // 绘制图表
    // myChart.setOption(this.option);
  },
  methods: {
    loadData() {
      console.log('请求调用')
      var xdata, ydata
      // requestDoorAuthorizeType().then(res=>{
      //   console.log(res)
      // })
      axios
        .get('/Elevator/Module/DoorAuthorizeType')
        .then(res => {
          console.log(res.data)
          var data = res.data.data
          console.log(data)
          xdata = new Array([data.length])
          ydata = new Array([data.length])
          for (var i = 0; i < data.length; i++) {
            console.log(11122223344)
            xdata[i] = data[i]['type']
            ydata[i] = data[i]['count']
          }
          console.log(xdata)
          console.log(ydata)
          var options = {
            title: {
              text: '这是标题',
              textStyle: {
                color: '#00BBF6'
              },
              left: 'center'
            },
            grid: {
              top: '30%',
              bottom: '20%',
              left: '12%',
              right: 0
            },
            legend: {
              data: xdata
            },
            xAxis: {
              data: xdata,
              axisLine: {
                lineStyle: {
                  color: '#00BBF6'
                }
              }
            },
            yAxis: {
              splitLine: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: '#00BBF6'
                }
              }
            },
            series: [
              {
                name: '次数',
                type: 'bar',
                data: ydata
              }
            ]
          }
          let myChart = this.$echarts.init(
            document.getElementById(this.getElementById)
          )

          myChart.setOption(options)
        })
        .catch(e => {
          console.log(e)
        })

      // requestDoorAuthorizeType().then((res)=>{
      //   console.log(res)
      //
      // })
    }
  }
}
</script>
