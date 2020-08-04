<!-- 折线图 -->

<template>
  <div style="height:100%">
    <!-- <select/> -->
    <!-- <Select
      v-show="!homeset"
      v-model="formSend.label"
      @on-change="getstartime"
      style="width:auto;float:left;color:currentColor;position:absolute;left:0;z-index:9"
    >
      <Option
        :value="item.label"
        v-for="item in timeList"
        v-bind:key="item.label"
        >{{ item.label }}</Option
      >
    </Select>-->
    <div class="plug-lineEchart echarts" ref="pubu" :id="getElementById" style="width:100%;height:100%"></div>
  </div>
</template>
<script>
// import select from '@/components/plugSortable/select.vue'
import { requestDoorAuthorizeType } from '~/api/api'
// import axios from '~/plugins/axios'
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
  mounted() {
    // this.stamp = this.$attrs.stamp
    // this.interval = Number(this.getLayData[this.stamp].refresh == null ? 5 : this.getLayData[this.stamp].refresh) * 60 *1000
    // //初始化时间
    // this.endtime =new Date().getFullYear() +"-" +(new Date().getMonth() + 1) +"-" +new Date().getDate()
    // // this.startime =(new Date().getFullYear()-1) +"-" +(new Date().getMonth() + 1) +"-" +new Date().getDate()
    // // console.log(this.endtime)
    // //初始化调用
    // this.formSend.label = this.getLayData[this.stamp].during == null ? "最近一年" : this.getLayData[this.stamp].during
    // this.getstartime()
    // this.loadData(this.startime)
    // //间歇调用
    // this.time = setInterval(() => {
    //   this.loadData(this.startime)
    // }, this.interval)
    this.$nextTick(function() {
      this.loadData()
    })
  },

  methods: {
    // getstartime(){
    //   console.log(this.formSend.label)
    //   if(this.formSend.label=="最近一天"){
    //     this.startime = this.endtime
    //     // console.log(this.startime)
    //   }else if(this.formSend.label=="最近一月"){
    //     this.startime = new Date().getFullYear() +"-" +new Date().getMonth() +"-" +new Date().getDate()
    //     // console.log(this.startime)
    //   }else if(this.formSend.label=="最近一年"){
    //      this.startime = (new Date().getFullYear()-1) +"-" + (new Date().getMonth()+1 ) +"-" +new Date().getDate()
    //     //  console.log(this.startime)
    //   }
    // },
    loadData() {
      var option = {
        title: {
          text: '阶梯瀑布图',
          subtext: 'From ExcelHome',
          sublink: 'http://e.weibo.com/1341556070/Aj1J2x5a5'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            var tar
            if (params[1].value !== '-') {
              tar = params[1]
            } else {
              tar = params[0]
            }
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value
          }
        },
        legend: {
          data: ['支出', '收入']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: { show: false },
          data: (function() {
            var list = []
            for (var i = 1; i <= 11; i++) {
              list.push('11月' + i + '日')
            }
            return list
          })()
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '辅助',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              itemStyle: {
                barBorderColor: 'rgba(0,0,0,0)',
                color: 'rgba(0,0,0,0)'
              }
            },
            data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292]
          },
          {
            name: '收入',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'top'
            },
            data: [900, 345, 393, '-', '-', 135, 178, 286, '-', '-', '-']
          },
          {
            name: '支出',
            type: 'bar',
            stack: '总量',
            label: {
              show: true,
              position: 'bottom'
            },
            data: ['-', '-', '-', 108, 154, '-', '-', '-', 119, 361, 203]
          }
        ]
      }
      let myChart = this.$echarts.init(this.$refs.pubu)

      myChart.setOption(option)
    }
    // loadData(pstarTime) {
    //   var self = this
    //   var xdata, ydata
    //   // requestDoorAuthorizeType().then(res=>{
    //   //   console.log(res)
    //   // })
    //   axios
    //     .get('/Elevator/Module/DoorOpenRecord', {
    //       params: {
    //         startTime: pstarTime,
    //         endTime: this.endtime
    //       }
    //     })
    //     .then(res => {
    //       // console.log(res.data)
    //       var data = res.data.data
    //       console.log('data==>',data)
    //       // return

    //       xdata = new Array([data.length])
    //       ydata = new Array([data.length])
    //       for (var i = 0; i < data.length; i++) {
    //         xdata[i] = data[i]['hour']
    //         ydata[i] = data[i]['num']
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
    //         color: ['#10c66e', '#00EBF5'],
    //         grid: {
    //           top: '30%',
    //           bottom: '20%',
    //           left: '18%',
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
