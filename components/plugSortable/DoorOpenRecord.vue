<!-- 折线图 -->

<template>
  <div style="height:100%">
    <!-- <select/> -->
    <!-- <Select
      v-show="!homeset"
      v-model="formSend.floorName"
      @on-change="getfloorName"
      style="width:auto;float:left;color:currentColor;position:absolute;left:0;z-index:9999"
    >
      <Option
        :value="item.floorName"
        v-for="item in deviceList"
        v-bind:key="item.floorName"
      >{{ item.floorName }}</Option>
    </Select>-->
    <div
      class="plug-lineEchart echarts"
      ref="leidas"
      :id="getElementById"
      style="width:100%;height:100%"
    ></div>
  </div>
</template>
<script>
// import selectss from '@/components/plugSortable/select.vue'
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  props: ['getElementById'],
  data() {
    return {
      t1: null,
      time: 30000,
      formSend: {
        floorName: '9栋'
      },
      deviceList: [
        {
          floorName: '1栋'
        },
        {
          floorName: '2栋'
        },
        {
          floorName: '3栋'
        },
        {
          floorName: '4栋'
        },
        {
          floorName: '5栋'
        },
        {
          floorName: '6栋'
        },
        {
          floorName: '7栋'
        },
        {
          floorName: '9栋'
        },
        {
          floorName: '10栋'
        },
        {
          floorName: '11栋'
        },
        {
          floorName: '12栋'
        },
        {
          floorName: '13栋'
        },
        {
          floorName: '14栋'
        },
        {
          floorName: '22栋'
        },
        {
          floorName: '23栋'
        },
        {
          floorName: '24栋'
        },
        {
          floorName: '25栋'
        },
        {
          floorName: '26栋'
        },
        {
          floorName: '27栋'
        }
      ],
      stamp: null,
      interval: null
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
    // this.loadData('9栋')
    // this.t1 = setInterval(() => {
    //   this.loadData(this.formSend.floorName)
    // }, this.interval)
    this.$nextTick(function() {
      this.loadData()
    })
  },
  computed: {
    ...mapGetters(['getLayData']),
    getStamp() {
      return this.stamp
    },
    homeset() {
      let o = this.$route.query
      return (
        o.hasOwnProperty('allowEdit') == false &&
        o.hasOwnProperty('homeset') == false
      )
    }
  },

  components: {
    // selectss
  },
  methods: {
    // getfloorName() {
    //   this.loadData(this.formSend.floorName)
    // },
    loadData() {
      var option = {
        tooltip: {
          formatter: '{a} <br/>{c} {b}'
        },
        toolbox: {
          show: true,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '速度',
            type: 'gauge',
            z: 3,
            min: 0,
            max: 220,
            splitNumber: 11,
            radius: '50%',
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 10
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            axisLabel: {
              backgroundColor: 'auto',
              borderRadius: 2,
              color: '#eee',
              padding: 3,
              textShadowBlur: 2,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              textShadowColor: '#222'
            },
            title: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder',
              fontSize: 20,
              fontStyle: 'italic'
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              formatter: function(value) {
                value = (value + '').split('.')
                value.length < 2 && value.push('00')
                return (
                  ('00' + value[0]).slice(-2) +
                  '.' +
                  (value[1] + '00').slice(0, 2)
                )
              },
              fontWeight: 'bolder',
              borderRadius: 3,
              backgroundColor: '#444',
              borderColor: '#aaa',
              shadowBlur: 5,
              shadowColor: '#333',
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              borderWidth: 2,
              textBorderColor: '#000',
              textBorderWidth: 2,
              textShadowBlur: 2,
              textShadowColor: '#fff',
              textShadowOffsetX: 0,
              textShadowOffsetY: 0,
              fontFamily: 'Arial',
              width: 100,
              color: '#eee',
              rich: {}
            },
            data: [{ value: 40, name: 'km/h' }]
          },
          {
            name: '转速',
            type: 'gauge',
            center: ['20%', '55%'], // 默认全局居中
            radius: '35%',
            min: 0,
            max: 7,
            endAngle: 45,
            splitNumber: 7,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 8
              }
            },
            axisTick: {
              // 坐标轴小标记
              length: 12, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              width: 5
            },
            title: {
              offsetCenter: [0, '-30%'] // x, y，单位px
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: 'bolder'
            },
            data: [{ value: 1.5, name: 'x1000 r/min' }]
          },
          {
            name: '油表',
            type: 'gauge',
            center: ['77%', '50%'], // 默认全局居中
            radius: '25%',
            min: 0,
            max: 2,
            startAngle: 135,
            endAngle: 45,
            splitNumber: 2,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 8
              }
            },
            axisTick: {
              // 坐标轴小标记
              splitNumber: 5,
              length: 10, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: 'auto'
              }
            },
            axisLabel: {
              formatter: function(v) {
                switch (v + '') {
                  case '0':
                    return 'E'
                  case '1':
                    return 'Gas'
                  case '2':
                    return 'F'
                }
              }
            },
            splitLine: {
              // 分隔线
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              width: 2
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [{ value: 0.5, name: 'gas' }]
          },
          {
            name: '水表',
            type: 'gauge',
            center: ['77%', '50%'], // 默认全局居中
            radius: '25%',
            min: 0,
            max: 2,
            startAngle: 315,
            endAngle: 225,
            splitNumber: 2,
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 8
              }
            },
            axisTick: {
              // 坐标轴小标记
              show: false
            },
            axisLabel: {
              formatter: function(v) {
                switch (v + '') {
                  case '0':
                    return 'H'
                  case '1':
                    return 'Water'
                  case '2':
                    return 'C'
                }
              }
            },
            splitLine: {
              // 分隔线
              length: 15, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: 'auto'
              }
            },
            pointer: {
              width: 2
            },
            title: {
              show: false
            },
            detail: {
              show: false
            },
            data: [{ value: 0.5, name: 'gas' }]
          }
        ]
      }

      setInterval(function() {
        option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0
        option.series[1].data[0].value = (Math.random() * 7).toFixed(2) - 0
        option.series[2].data[0].value = (Math.random() * 2).toFixed(2) - 0
        option.series[3].data[0].value = (Math.random() * 2).toFixed(2) - 0
        myChart.setOption(option, true)
      }, 2000)

      let myChart = this.$echarts.init(this.$refs.leidas)

      myChart.setOption(option)
    }
    // loadData(pfloorName) {
    //   var self = this
    //   var xdata, ydata
    //   axios
    //     .get('/Elevator/Module/DoorOpenRecord', {
    //       params: {
    //         floorName: pfloorName
    //       }
    //     })
    //     .then(res => {
    //       var data = res.data.data
    //       // console.log(data)
    //       xdata = new Array([data.length])
    //       ydata = new Array([data.length])
    //       for (var i = 0; i < data.length; i++) {
    //         xdata[i] = data[i]['hour']
    //         ydata[i] = data[i]['num']
    //       }
    //       var options = {
    //         title: {
    //           text: self.getLayData[self.getStamp].title == null ? '' : self.getLayData[self.getStamp].title,
    //           textStyle: {
    //             color: '#00BBF6'
    //           },
    //           left: 'center'
    //         },
    //         tooltip: {
    //           show: true
    //         },
    //         color: ['rgba(31, 203, 201,1)', '#00EBF5'],
    //         grid: {
    //           top: '30%',
    //           bottom: '20%',
    //           left: '12%',
    //           right: '8%'
    //         },
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
    //             data: ydata,
    //             type: 'line',
    //             smooth: true,
    //             areaStyle: {
    //               color: {
    //                 type: 'linear',
    //                 x: 0,
    //                 y: 0,
    //                 x2: 0,
    //                 y2: 1,
    //                 colorStops: [
    //                   {
    //                     offset: 0,
    //                     color: 'rgba(31, 203, 201,1)' // 0% 处的颜色
    //                   },
    //                   {
    //                     offset: 1,
    //                     color: 'rgba(31, 203, 201,0)' // 100% 处的颜色
    //                   }
    //                 ],
    //                 global: false
    //               }
    //             }
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
    // }
  }
}
</script>

<style>
.ivu-select-dropdown-list {
  max-height: 100px;
}
</style>
