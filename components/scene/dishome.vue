<template>
  <div class="box" @contextmenu.prevent="banmenu" ref="box">
    <div class="grids" ref="grids">
      <!-- 加载动画 -->
      <loading v-if="loading"></loading>
      <div v-else class="grid" v-for="item of getGrids" :style="style(item)" :key="item.id">
        <sortableTable
          v-if="item.child.render == true"
          :last="item.child.module"
          @saveModule="saveinfo"
          :grid="item.id"
          :id="getID"
          :stamp="item.child.timeStamp"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      //动画
      loading: false,
      et: 0,
      el: 0,
      revert: [],
      activeGrid: null,
      //格子信息
      grids: [],
      original: {}
    }
  },
  mounted() {
    this.getExtra()
  },
  watch: {
    hig(newval){
      if(newval){
        this.loading = true
        this.initDatas()
      }
    }
  },
  computed: {
    ...mapGetters({
      sort: 'getSort',
      extraScene: 'getSdScene',
      NOs: 'getMySceneNo',
      getBars: 'getBar',
      getLayData: 'getLayData'
    }),
    //获取激活的id
    getID() {
      return this.actId
    },
    //筛选渲染的格子
    getGrids() {
      return this.grids.filter(item => {
        return item.render
      })
    },
    getLT() {
      return true
    },
    getCurrentWidth() {
      let wid = this.$refs.grids.offsetWidth
      return wid
      // return wid != undefined ? wid : null
    },
    getCurrentHeight() {
      let hih = this.$refs.grids.offsetHeight
      return hih
      // return hih != undefined ? hih : null
    }
  },
  methods: {
    //数据是否百分化?
    isDataPercentage(val1, val2) {
      if (val1) {
        let W = val2.W
        let H = val2.H

        this.grids = this.grids.map(item => {
          item.width = parseFloat((item.width / W) * this.getCurrentWidth)
          item.height = parseFloat((item.height / H) * this.getCurrentHeight)
          item.top = parseFloat((item.top / H) * this.getCurrentHeight)
          item.left = parseFloat((item.left / W) * this.getCurrentWidth)
          return item
        })
        this.revert = this.revert.map(item => {
          item.width = parseFloat((item.width / W) * this.getCurrentWidth)
          item.height = parseFloat((item.height / H) * this.getCurrentHeight)
          item.top = parseFloat((item.top / H) * this.getCurrentHeight)
          item.left = parseFloat((item.left / W) * this.getCurrentWidth)
          return item
        })
      }
    },
    //初始化获取额外需减边距并设置
    getExtra() {
      this.et = Number(this.tp) + Number(this.pd)
      this.el = Number(this.lt) + Number(this.pd)
    },
    //初始化网格所有数据
    initDatas() {
      var grids, revert, original
      axios
        .get('/Elevator/Module/LoadModulePage?sceneNum=08')
        .then(res => {
          // console.log(res.data)
          var data = res.data.data
          if (data[0] == undefined) {
            return
          }
          for (var i = 0; i < data.length; i++) {
            // console.log(data[i].moduleType)
            if (data[i].moduleType == 'grids') {
              // this.grids.push(JSON.parse(data[i].moduleContent)[0])
              grids = JSON.parse(data[i].moduleContent)
              // console.log('grids=>', grids)
              //如果前一次有保存数据则直接加载数据
              if (grids.length > 0) {
                this.grids = [...grids]
              }
            }
            if (data[i].moduleType == 'revert') {
              // this.revert.push(JSON.parse(data[i].moduleContent)[0])
              revert = JSON.parse(data[i].moduleContent)
              // console.log('revert=>', revert)
              //如果前一次有保存数据则直接加载数据
              if (revert.length > 0) {
                this.revert = [...revert]
                // console.log('加载数据revert', this.revert)
              }
            }
            if (data[i].moduleType == 'original') {
              original = JSON.parse(data[i].moduleContent)
              if (JSON.stringify(original) != '{}') {
                this.original = { ...original }
              }
            }
          }
        })
        .then(() => {
          //转化尺寸
          this.isDataPercentage(true, this.original)
          this.loading = false
        })
    },
    saveinfo() {
      return
    },
    //设置格子属性
    style(item) {
      return {
        width: item.width + 'px',
        height: item.height + 'px',
        left: item.left + 'px',
        top: item.top + 'px'
      }
    },
    //阻止冒泡、浏览器默认事件
    clearEventBubble(e) {
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
      if (e.preventDefault) e.preventDefault()
      else e.returnValue = false
    },
    //禁止右键菜单
    banmenu() {
      //放开选择框
      this.selectDiv = false
      //标记选择状态
      this.isSelect = false
      //删除选择框信息
      this.startX = 0
      this.startY = 0
      this.selDiv = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
      //重置离开过记录
      this.isleave = false

      return false
    }
  },
  props: ['row', 'col', 'actId', 'lt', 'tp', 'pd', 'hig'],
  components: {
    loading: () => import('@/components/animation/loading.vue'),
    sortableTable: () => import('@/components/sortableTable/index.vue')
  }
}
</script>

<style lang="scss" scoped>
$selbr: 2px dashed white;
$ckbr: 2px dashed red;
.box {
  width: 100%;
  height: 100%;
  background-color: transparent;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .ivu-btn-default {
    position: absolute;
    top: -70px;
    z-index: 1000;
    background-color: transparent;
    border: none;
    padding: 3px 6px;
  }
  .ivu-btn-default:nth-child(2) {
    right: 268px;
    color: red;
  }
  .ivu-btn-default:nth-child(1) {
    right: 233px;
    color: #006bd0;
  }
  .grids {
    width: 100%;
    height: 100%;
    background-color: transparent;
    position: relative;
  }
  #selectDiv {
    position: absolute;
    border: 1px dashed #fff;
    background-color: #c3d5ed;
    z-index: 1000;
    opacity: 0.6;
  }
  .setbox {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 400px;
    height: 500px;
    background-color: rgb(134, 137, 138);

    .rm {
      position: absolute;
      top: 0;
      left: 50%;
      width: 30px;
      height: 20px;
      transform: translateX(-15px);
      color: red;
      cursor: pointer;
    }
  }
  .deal {
    position: absolute;
    background-color: #ffffff;
    color: #000000;
    font-family: cursive;
    width: 50px;
    border-radius: 3px;
    overflow: hidden;

    span {
      float: left;
      width: 100%;
      height: 18px;
      line-height: 18px;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: rgb(12, 210, 245);
        color: white;
      }
    }
  }
}
.grid {
  position: absolute;
  border: 1px solid #00bbf6;
  overflow: hidden;
  box-sizing: content-box;
  &.seled {
    border: $selbr;
    box-sizing: border-box;
  }
  &.ckSeled {
    border: $ckbr;
    box-sizing: border-box;
  }
}
</style>