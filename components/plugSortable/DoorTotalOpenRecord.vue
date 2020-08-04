<!-- 折线图 -->

<template>
  <div style="height:100%;width:100%;position:relative">
    <!-- <DataPicker :intime='startime' @func="getstartime" />
    <DataPicker :intime='endtime' @func="getendtime" />-->
    <!-- <button
      class="search"
      @click="loadData(startime, endtime)"
      style="top:3px;right:3px;height:20px;padding:0px 6px;"
    >
      查询
    </button>-->
    <!-- <Select
      v-show="!homeset"
      v-model="formSend.label"
      @on-change="getstartime"
      style="width:auto;float:left;color:currentColor;position:absolute;left:0;z-index:9"
    >
      <Option :value="item.label" v-for="item in timeList" v-bind:key="item.label">{{item.label}}</Option>
    </Select>-->
    <div
      class="plug-lineEchart echarts"
      ref="week"
      :id="getElementById"
      style="width:100%;height:100%"
    ></div>
  </div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
// import axios from '~/plugins/axios'
// import DataPicker from '@/components/plugSortable/DataPicker.vue'
import { mapGetters } from 'vuex'
export default {
  props: ['getElementById'],
  data() {
    return {
      time: null,
      formSend: {
        label: ''
      },
      startime: '',
      endtime: '',
      // currentTime: new Date(),
      timeList: [
        { label: '最近一天' },
        { label: '最近一月' },
        { label: '最近一年' }
      ],
      stamp: null,
      interval: null
    }
  },
  computed: {
    ...mapGetters(['getLayData']),
    homeset() {
      let o = this.$route.query
      return (
        o.hasOwnProperty('allowEdit') == false &&
        o.hasOwnProperty('homeset') == false
      )
    }
  },
  mounted() {
    // var self = this
    // this.stamp = this.$attrs.stamp
    // this.interval =
    //   Number(
    //     this.getLayData[this.stamp].refresh == null
    //       ? 5
    //       : this.getLayData[this.stamp].refresh
    //   ) *
    //   60 *
    //   1000
    // //初始化时间
    // this.endtime =
    //   new Date().getFullYear() +
    //   '-' +
    //   (new Date().getMonth() + 1) +
    //   '-' +
    //   new Date().getDate()
    // // this.startime =(new Date().getFullYear()-1) +"-" +(new Date().getMonth() + 1) +"-" +new Date().getDate()
    // // console.log(this.endtime)
    // //初始化调用
    // this.formSend.label =
    //   this.getLayData[this.stamp].during == null
    //     ? '最近一年'
    //     : this.getLayData[this.stamp].during
    // this.getstartime()
    // this.loadData(this.startime)
    // //间歇调用
    // this.time = setInterval(() => {
    //   self.loadData(self.startime)
    // }, this.interval)
    this.$nextTick(function() {
      this.loadData()
    })
  },
  components: {
    // DataPicker
  },
  methods: {
    // getstartime() {
    //   console.log(this.formSend.label)
    //   if (this.formSend.label == '最近一天') {
    //     this.startime = this.endtime
    //     console.log(this.startime)
    //   } else if (this.formSend.label == '最近一月') {
    //     this.startime =
    //       new Date().getFullYear() +
    //       '-' +
    //       new Date().getMonth() +
    //       '-' +
    //       new Date().getDate()
    //     console.log(this.startime)
    //   } else if (this.formSend.label == '最近一年') {
    //     this.startime =
    //       new Date().getFullYear() -
    //       1 +
    //       '-' +
    //       (new Date().getMonth() + 1) +
    //       '-' +
    //       new Date().getDate()
    //     console.log(this.startime)
    //   }
    // },
    loadData() {
      var option = {
        title: {
          text: '漏斗图',
          subtext: '纯属虚构'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}%'
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        legend: {
          data: ['展现', '点击', '访问', '咨询', '订单']
        },
        series: [
          {
            name: '预期',
            type: 'funnel',
            left: '10%',
            width: '80%',
            label: {
              formatter: '{b}预期'
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              opacity: 0.7
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: '{b}预期: {c}%'
              }
            },
            data: [
              { value: 60, name: '访问' },
              { value: 40, name: '咨询' },
              { value: 20, name: '订单' },
              { value: 80, name: '点击' },
              { value: 100, name: '展现' }
            ]
          },
          {
            name: '实际',
            type: 'funnel',
            left: '10%',
            width: '80%',
            maxSize: '80%',
            label: {
              position: 'inside',
              formatter: '{c}%',
              color: '#fff'
            },
            itemStyle: {
              opacity: 0.5,
              borderColor: '#fff',
              borderWidth: 2
            },
            emphasis: {
              label: {
                position: 'inside',
                formatter: '{b}实际: {c}%'
              }
            },
            data: [
              { value: 30, name: '访问' },
              { value: 10, name: '咨询' },
              { value: 5, name: '订单' },
              { value: 50, name: '点击' },
              { value: 80, name: '展现' }
            ]
          }
        ]
      }

      let myChart = this.$echarts.init(this.$refs.week)
      myChart.setOption(option)
    }
    // loadData(pstarTime) {
    //   // console.log(pstarTime)
    //   const self = this
    //   var xdata, ydata
    //   axios
    //     .get('/Elevator/Module/DoorTotalOpenRecord', {
    //       params: {
    //         startTime: pstarTime,
    //         endTime: self.endtime
    //       }
    //     })
    //     .then(res => {
    //       //console.log(res.data)
    //       var data = res.data.data
    //       xdata = new Array([data.length])
    //       ydata = new Array([data.length])
    //       for (var i = 0; i < data.length; i++) {
    //         xdata[i] = data[i]['floorName']
    //         ydata[i] = data[i]['total']
    //       }

    //       // console.log('title===>',self.getLayData[self.getStamp])
    //       var options = {
    //         title: {
    //           text:
    //             self.getLayData[self.stamp].title == null
    //               ? ''
    //               : self.getLayData[self.stamp].title,
    //           textStyle: {
    //             color: '#00BBF6'
    //           },
    //           left: 'center'
    //         },
    //         tooltip: {
    //           show: true
    //         },
    //         color: ['#00E3EF'],
    //         grid: {
    //           top: '24%',
    //           bottom: '13%',
    //           left: '13%',
    //           right: '4%'
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
    //             name: '次数',
    //             type: 'bar',
    //             data: ydata,
    //             barWidth: '30%'
    //           }
    //         ]
    //       }
    //       // console.log('id==>',self.getElementById)
    //       let myChart = self.$echarts.init(
    //         document.getElementById(self.getElementById)
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
.eventTrend-module {
  height: 100%;
}
</style>
