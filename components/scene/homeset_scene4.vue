<template>
  <div
    class="box"
    @mousedown.self="pressdown"
    @mousemove="pressmove"
    @mouseup="mouserelease"
    @mouseleave="leaveout"
    @contextmenu.prevent="banmenu"
    ref="box"
  >
    <!-- 保存场景按钮 -->
    <button disabled class="savebtn" style="color: gray" v-if="turnof">保存</button>
    <Button type="primary" @click="ok" v-else>保存</Button>
    
    <div class="grids" ref="grids" @mousedown.self="pressdown">
      <div
        @dragover.prevent
        @drop="item.child.render = true"
        class="grid"
        v-for="item of getGrids"
        :class="{seled: item.seled,ckSeled: item.ckSeled}"
        :style="style(item)"
        :key="item.id"
        @mousedown.self="pressdown"
      >
        <i class="iconfont icon-guanbi" v-if="item.child.render" @click="rmModule(item.id)"></i>
        <sortableTable
          v-if="item.child.render == true"
          :last="item.child.module"
          @saveModule="saveinfo"
          :grid="item.id"
          :id="getID"
        />
      </div>
    </div>
    <!-- 框选div -->
    <div id="selectDiv" v-if="selectDiv" :style="getDivStyle"></div>
    <!-- 配置div -->
    <!-- <div class="setbox" v-if="setDiv">
      <i class="iconfont icon-guanbi" @click="shutdown">X</i>
      <button class="rm">删除</button>
    </div>-->
    <div class="deal" v-if="todeal" :style="getpos">
      <span class="merge" @click="merge">合并</span>
      <span class="split" @click="split">拆分</span>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { Button, Modal } from 'view-design'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      et: 0,
      el: 0,
      //初始变量
      todeal: false,
      selectDiv: false,
      selDiv: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      selList: [],
      selected: [],
      revert: [],
      isSelect: false,
      activeGrid: null,
      isleave: false,
      // setDiv: false,
      //格子信息
      grids: []
    }
  },
  props: ['row', 'col', 'actId', 'turnof', 'lt', 'tp', 'pd'],
  components: {
    Button,
    Modal,
    sortableTable: () => import('@/components/sortableTable/index.vue')
  },
  mounted() {
    this.getExtra()
    // this.initGrids()
    // this.getSaveData()
    this.initDatas()
  },
  computed: {
    ...mapGetters({
      sort: 'getSort',
      extraScene: "getSdScene",
      border:'getBorderColor'
    }),
    //获取激活的id
    getID() {
      return this.actId
    },
    //配置信息盒子
    getpos() {
      return {
        left: this.endX + 'px',
        top: this.endY + 'px'
      }
    },
    //筛选渲染的格子
    getGrids() {
      return this.grids.filter(item => {
        return item.render
      })
    },
    //设置选择框的样式
    getDivStyle() {
      return {
        left: this.selDiv.left + 'px',
        top: this.selDiv.top + 'px',
        width: this.selDiv.width + 'px',
        height: this.selDiv.height + 'px',
        
      }
    }
  },
  methods: {
    //确定保存
    ok() {
      //保存的数据模板
      // data = {
      //     W: 21,
      //     H: 23,
      //     grids: [],
      //     revert: []
      // }

      //保存数据
      let data = {}
      data.W = this.$refs.grids.offsetWidth
      data.H = this.$refs.grids.offsetHeight
      data.grids = [...this.grids]
      data.revert = [...this.revert]
      //保存到数据库
      let param = {
        SceneNum: '08',
        Items: [{
          ModuleType: 'home',
          ModuleContent: JSON.stringify(data),
          ModuleLocation: '01',
          OrderNo: 1
        }]
      }
      axios.post('/Elevator/Module/SaveModulePage', param).then(res => {
        console.log(res.data)
      })
      //保存成功提示
      this.$Message.info('保存成功')
    },
    //初始化获取额外需减边距并设置
    getExtra() {
      this.et = this.tp + this.pd
      this.el = this.lt + this.pd
    },
    //点击配置
    rmModule(id) {
      this.grids = this.grids.map(item => {
        if (item.id == id) {
          item.child.module = null
          item.child.render = false
        }
        return item
      })
      //删除模块同时上传保存数据
      // this.saveData()
      //重置无配置状态
      this.todeal = false
      this.endX = 0
      this.endY = 0
      console.log(id)
    },
    //初始化grids
    initGrids() {
      const R = Number(this.row)
      const C = Number(this.col)
      const W = Number(this.$refs.grids.offsetWidth)
      const H = Number(this.$refs.grids.offsetHeight)
      const N = R * C
      const w = W / C
      const h = H / R
      var arr = []
      for (let i = 1; i <= N; i++) {
        var o = {}
        o.render = true
        o.merge = false
        o.child = {}
        o.child.render = false
        o.child.module = null
        o.id = i - 1
        o.seled = false
        o.ckSeled = false
        o.width = w
        o.height = h
        o.left = this.getLeft(i, C, w)
        o.top = this.getTop(i, R, h)
        arr.push(o)
      }
      // return arr;
      this.grids = [...arr]
    },
    //初始化网格所有数据
    initDatas() {
      var grids, revert
      axios.get('/Elevator/Module/LoadModulePage?sceneNum=08').then(res => {
        console.log('当无数据库数据时，显示=>',res.data)
        if(res.data.data.length < 1){
          this.initGrids()
        }
        else{
          let result = JSON.parse(res.data.data[0].moduleContent)
          this.grids = [...result.grids]
          this.revert = [...result.revert]
        }
      })
    },
    //保存布局和模块
    saveinfo(obj) {
      let n = Number(obj.n)
      let m = Number(obj.m)
      this.grids = this.grids.map(item => {
        if (item.id == n) {
          item.child.module = m
        }
        return item
      })
    },
    //计算left值
    getLeft(n, c, w) {
      if (n % c == 0) {
        return (c - 1) * w
      } else {
        return ((n % c) - 1) * w
      }
    },
    //计算top值
    getTop(n, r, h) {
      if (n % r != 0) {
        return Math.floor(n / r) * h
      } else {
        return (n / r - 1) * h
      }
    },
    //计算color值
    getColor() {
      return `rgb(${Math.round(Math.random() * 255)},${Math.round(
        Math.random() * 255
      )},${Math.round(Math.random() * 255)})`
    },
    //设置格子属性
    style(item) {
      return {
        width: item.width + 'px',
        height: item.height + 'px',
        left: item.left + 'px',
        top: item.top + 'px',
        borderColor:this.border
      }
    },
    //阻止冒泡、浏览器默认事件
    clearEventBubble(e) {
      if (e.stopPropagation) e.stopPropagation()
      else e.cancelBubble = true
      if (e.preventDefault) e.preventDefault()
      else e.returnValue = false
    },
    //鼠标按下事件
    pressdown(e) {
      //放开选择框
      this.selectDiv = true
      //标记选择状态
      this.isSelect = true
      //重置为无拆分状态
      this.activeGrid = null
      //重置无配置状态
      this.todeal = false
      this.endX = 0
      this.endY = 0
      //计算该元素的偏移量
      let lfa = this.$refs.box.offsetLeft
      let tfa = this.$refs.box.offsetTop
      //按下时的起始坐标,并赋值给框选盒子
      this.startX = (e.x || e.clientX) - lfa - this.el
      this.startY = (e.y || e.clientY) - tfa - this.et
      this.selDiv.left = this.startX
      this.selDiv.top = this.startY
      // console.log(this.startX + this.startY)
      //重置所有格子信息,包括所有格子列表、所有选择的列表、所有各自class名
      this.selList = []
      this.selected = []
      // console.log(this.selected)
      this.grids = this.grids.map(item => {
        if (item.seled || item.ckSeled) {
          item.seled = false
          item.ckSeled = false
        }
        return item
      })
      //阻止冒泡、浏览器默认事件
      this.clearEventBubble(e)
    },
    //按压移动事件
    pressmove(e) {
      //鼠标点击了才激活移动事件
      if (this.isSelect) {
        //计算box和grids的偏移量
        let lfa = this.$refs.box.offsetLeft
        let tfa = this.$refs.box.offsetTop
        let lfa1 = this.$refs.grids.offsetLeft
        let tfa1 = this.$refs.grids.offsetTop
        //判断选择框是否已经放开了(该判断是否可删?)
        if (!this.selectDiv) this.selectDiv = true
        //移动坐标
        let _x = (e.x || e.clientX) - lfa - this.el
        let _y = (e.y || e.clientY) - tfa - this.et
        //改变选框的属性值
        this.selDiv = {
          left: Math.min(_x, this.startX),
          top: Math.min(_y, this.startY),
          width: Math.abs(_x - this.startX),
          height: Math.abs(_y - this.startY)
        }
        //计算选择框的偏移量
        let _l = this.selDiv.left
        let _t = this.selDiv.top
        let _w = this.selDiv.width
        let _h = this.selDiv.height
        //筛选被框选的格子
        this.grids = this.grids.map(item => {
          let sl = item.width + item.left + lfa1
          let st = item.height + item.top + tfa1
          if (
            sl > _l &&
            st > _t &&
            item.left + lfa1 < _l + _w &&
            item.top + tfa1 < _t + _h &&
            item.render
          ) {
            item.seled = true
          } else {
            item.seled = false
          }
          return item
        })
      }
      //清除浏览器默认事件
      this.clearEventBubble(e)
    },
    //鼠标松开事件
    mouserelease(e) {
      let etop = Number(this.etop)
      let eleft = Number(this.eleft)
      //判断是否存在框选的元素,再执行配置信息
      for (let i = 0, len = this.grids.length; i < len; i++) {
        if (this.grids[i].seled && this.isSelect) {
          //计算该元素的偏移量
          let lfa = this.$refs.box.offsetLeft
          let tfa = this.$refs.box.offsetTop
          let wfa = this.$refs.box.offsetWidth
          let hfa = this.$refs.box.offsetHeight
          //鼠标松开时坐标
          let x = (e.x || e.clientX) - lfa - this.el + 10
          let y = (e.y || e.clientY) - tfa - this.et + 10
          this.endX = x > wfa - 50 ? wfa - 50 : x
          this.endY = y > hfa - 54 ? hfa - 54 : y
          //放开配置盒子
          this.todeal = true
          //打断循环遍历
          break
        }
      }
      //重置为非选择状态
      this.isSelect = false
      //关闭选择框
      this.selectDiv = false
      //删除选择框信息
      this.startX = 0
      this.startY = 0
      this.selDiv = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      }
      //删除离开过的记录
      this.isleave = false
    },
    //鼠标离开指定区域事件
    leaveout() {
      //如果选择状态下离开区域
      if (this.isSelect) {
        //重置为非选择状态
        this.isSelect = false
        //标记离开过
        this.isleave = true
        //重置为无框选状态
        this.grids = this.grids.map(item => {
          if (item.seled || item.ckSeled) {
            item.seled = false
            item.ckSeled = false
          }
          return item
        })
        //关闭选择框
        this.selectDiv = false
        //删除选择框信息
        this.startX = 0
        this.startY = 0
        this.selDiv = {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        }
        console.log('鼠标按下未放开就走了')
      }
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
    },
    //合并选中格子
    merge() {
      //筛选框选中的格子
      this.selected = this.grids.filter(item => {
        return item.seled
      })
      //框选过少退出合并
      if (this.selected.length <= 1) {
        this.todeal = false
        this.endX = 0
        this.endY = 0
        this.grids = this.grids.map(item => {
          if (item.seled) {
            item.seled = false
          }
          return item
        })
        alert('框选格子太少,无法合并!')
        return
      }
      //判断是否已经有合并过的格子在里面
      for (let k = 0, len = this.selected.length; k < len; k++) {
        if (this.selected[k].merge) {
          this.todeal = false
          this.endX = 0
          this.endY = 0
          this.grids = this.grids.map(item => {
            if (item.seled) {
              item.seled = false
            }
            return item
          })
          alert('选框中有合并过的格子,不能再合并!')
          return
        }
      }

      var min_left, max_left, min_top, max_top, wid, high, last_wid, last_high
      //遍历选中的元素获取最值
      for (let j = 0, len = this.selected.length; j < len; j++) {
        if (j == 0) {
          min_left = this.selected[j].left
          min_top = this.selected[j].top
        } else if (j == len - 1) {
          max_left = this.selected[j].left
          last_wid = this.selected[j].width
          max_top = this.selected[j].top
          last_high = this.selected[j].height
        }
      }
      //得出起始left,最大宽度wid,起始top,最大高度high
      wid = max_left - min_left + last_wid
      high = max_top - min_top + last_high
      //遍历处理数据
      //保存信息的对象,数组
      var obj = {}
      obj.arr = []
      for (let l = 0, len = this.selected.length; l < len; l++) {
        if (l == 0) {
          //保存合并前第一个元素信息
          obj.id = this.selected[l].id
          obj.left = this.selected[l].left
          obj.top = this.selected[l].top
          obj.width = this.selected[l].width
          obj.height = this.selected[l].height
          //设置合并后的盒子大小
          this.grids = this.grids.map(function(node) {
            if (node.id == this.id) {
              node.left = min_left
              node.top = min_top
              node.width = wid
              node.height = high
              node.merge = true
              node.seled = false
            }
            return node
          }, this.selected[l])
        } else {
          //保留隐藏盒子的id
          obj.arr.push(this.selected[l].id)
          //隐藏其他盒子
          this.grids = this.grids.map(function(node) {
            if (node.id == this.id) {
              node.render = false
              node.merge = true
            }
            return node
          }, this.selected[l])
        }
      }
      //记录到数组revert
      this.revert.push(obj)
      // console.log(this.revert);
      //重置无配置状态
      this.todeal = false
      this.endX = 0
      this.endY = 0
    },
    //拆分合并过的格子
    split() {
      //筛选框选的格子
      this.selected = this.grids.filter(item => {
        return item.seled
      })
      // console.log(this.revert);
      //框选中存在无拆分记录的,退出拆分程序
      for (let i = 0, len = this.selected.length; i < len; i++) {
        if (!this.selected[i].merge) {
          this.todeal = false
          this.endX = 0
          this.endY = 0
          this.grids = this.grids.map(item => {
            if (item.seled) {
              item.seled = false
            }
            return item
          })
          alert('框选区域中存在不可拆分单元!')
          return
        }
      }
      //遍历框选的可拆分的格子
      var rm = []
      for (let j = 0, len = this.selected.length; j < len; j++) {
        for (let k = 0, leng = this.revert.length; k < leng; k++) {
          if (this.selected[j].id == this.revert[k].id) {
            let id = this.revert[k].id
            rm.push(id)
            //拆分
            this.grids = this.grids.map(function(item) {
              if (item.id == id) {
                item.left = this.left
                item.top = this.top
                item.width = this.width
                item.height = this.height
                item.merge = false
                item.seled = false
                item.child.render = false
              }
              return item
            }, this.revert[k])
            //复原隐藏的
            for (let l = 0, ln = this.revert[k].arr.length; l < ln; l++) {
              let id = this.revert[k].arr[l]
              this.grids = this.grids.map(function(item) {
                if (item.id == this) {
                  item.render = true
                  item.merge = false
                }
                return item
              }, id)
            }
          }
        }
      }
      //删除保存的信息记录
      for (let n = 0, le = rm.length; n < le; n++) {
        this.revert = this.revert.filter(item => {
          return item.id != rm[n]
        })
      }
      // console.log(this.revert)
      //重置无配置状态
      this.todeal = false
      this.endX = 0
      this.endY = 0
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/fonts/guanbi.scss';
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
  .savebtn,.ivu-btn-primary{
    position: absolute;
    top: -70px;
    right: 165px;
    z-index: 1000;
    background-color: transparent;
    color: #006bd0;
    border: none;
    padding: 3px 6px;
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
  &.seled {
    border: $selbr;
    box-sizing: border-box;
  }
  &.ckSeled {
    border: $ckbr;
    box-sizing: border-box;
  }
}
.iconfont {
  position: absolute;
  top: 0;
  right: 4px;
  width: 15px;
  height: 15px;
  margin: 2px;
  z-index: 10;
  line-height: 15px;
  text-align: center;
  color: #000000;
  cursor: pointer;
  &:hover {
    color: rgb(12, 210, 245);
  }
  &.icon-guanbi {
    z-index: 20;
  }
}
</style>