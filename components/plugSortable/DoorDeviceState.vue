<template>
  <div class="plug-pieEchart echarts" ref="leidatu" :id="id" style="width:100%;height:100%"></div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  props: ['id'],
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
    // // console.log('data==>',this.getLayData[this.stamp])
    // this.interval =
    //   Number(
    //     this.getLayData[this.stamp].refresh == null
    //       ? 5
    //       : this.getLayData[this.stamp].refresh
    //   ) *
    //   60 *
    //   1000
    // this.loaddata()

    // var self = this
    // this.time = setInterval(() => {
    //   self.loaddata()
    // }, this.interval)
    this.$nextTick(function(){
      this.loaddata()
    })
  },

  methods: {
    loaddata() {
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: [
            '直达',
            '营销广告',
            '搜索引擎',
            '邮件营销',
            '联盟广告',
            '视频广告',
            '百度',
            '谷歌',
            '必应',
            '其他'
          ]
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],

            label: {
              position: 'inner'
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '直达', selected: true },
              { value: 679, name: '营销广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          },
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '55%'],
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            data: [
              { value: 335, name: '直达' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1048, name: '百度' },
              { value: 251, name: '谷歌' },
              { value: 147, name: '必应' },
              { value: 102, name: '其他' }
            ]
          }
        ]
      }
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(this.$refs.leidatu)
      // 绘制图表
      myChart.setOption(option)
    }
    // loaddata() {
    //   var self = this
    //   axios
    //     .get('/Elevator/Module/DoorDeviceState')
    //     .then(res => {
    //       // console.log(res.data.data)
    //       var data = res.data.data
    //       var online, total
    //       online = data[0].count
    //       total = data[1].count

    //       var option = {
    //         tooltip: {
    //           trigger: 'item',
    //           formatter: '{a} <br/>{b} : {c} ({d}%)'
    //         },
    //         title: {
    //           text: self.getLayData[self.getStamp]['title'] == null ? '' : self.getLayData[self.getStamp]['title'],
    //           textStyle: {
    //             color: '#00BBF6'
    //           },
    //           left: 'center'
    //         },
    //         color: ['#00EBF5', '#3f2ac4'],
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
    //       let myChart = self.$echarts.init(document.getElementById(self.id))
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
