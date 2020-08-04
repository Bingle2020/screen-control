<template>
  <!-- 加载动画 -->
  <!-- <loading v-if="loading"></loading> -->
  <div
    class="box"
    @mousedown.self="pressdown"
    @mousemove="pressmove"
    @mouseup="mouserelease"
    @mouseleave="leaveout"
    @contextmenu.prevent="banmenu"
    ref="box"
  >
    <!-- 删除场景按钮 -->
    <Button @click="saveAgain" v-show="!display" :disabled="$attrs.turnon">保存</Button>
    <Button @click="rmScene" v-show="!display" :disabled="$attrs.turnon">删除</Button>
    <!-- 配置盒子 -->
    <modules @addlayer="addset"></modules>

    <div class="grids" ref="grids" @mousedown.self="pressdown">
      <div
        @dragover.prevent
        @drop="item.child.render ? '': openSet(item.id)"
        class="grid"
        v-for="item of getGrids"
        :class="{seled: item.seled,ckSeled: item.ckSeled}"
        :style="style(item)"
        :key="item.id"
        @mousedown.self="pressdown"
      >
        <i class="iconfont icon-guanbi" v-if="getBars == null ? false : item.child.render" @click="rmModule(item.id)"></i>
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
    <!-- 框选div -->
    <div id="selectDiv" v-if="selectDiv" :style="getDivStyle"></div>
    <div class="deal" v-if="todeal" :style="getpos">
      <span class="merge" @click="merge">合并</span>
      <span class="split" @click="split">拆分</span>
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { Button } from 'view-design'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      //打开的配置盒子
      dropId: null,
      //动画
      loading: true,
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
  mounted() {
    console.log('this.isturn==>',this.$attrs.turnon)
    this.getExtra()
    this.renderScenes()
    // this.initGrids()
    //this.initDatas()
  },
  watch: {
    grids(newval){
      if (newval != null) {
        this.loading = false
      }
    },
    NOs(val) {
      if (val) {
        this.renderScenes()
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
    display(){
      let o = this.$route.query
      return o.hasOwnProperty("allowEdit") == false && o.hasOwnProperty("homeset") == false
    },
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
        height: this.selDiv.height + 'px'
      }
    },
    getLT(){
      return true
      //  this.lt == 20
    },
    getCurrentWidth(){
      return this.$refs.grids.offsetWidth
    },
    getCurrentHeight(){
      return this.$refs.grids.offsetHeight
    },

  },
  methods: {
    //添加临时配置信息,并且关闭配置盒子
    addset(ids) {
      //将信息添加修改进数据堆里面
      let self = this
      this.grids = this.grids.map(item=>{
          if(item.id == self.dropId){
            item.child.render = true
            item.child.timeStamp = ids
          }
          return item
        })
      this.dropId = null
      //关闭配置窗口
      this.$store.commit('alterSetting', false)
    },
    openSet(id) {
      //打开配置窗口
      this.dropId = id
      this.$store.commit('alterSetting', true)
    },
    //修改后再次保存场景
    saveAgain(){
      const self = this
      this.$Modal.confirm({
        title: '是否保存当前修改?',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let obj = {}
          obj.W = self.getCurrentWidth
          obj.H = self.getCurrentHeight
          obj.grids = [...self.grids]
          obj.revert = [...self.revert]
          //保存到store
          self.$store.commit('changeExtraScene', obj)
          //保存到数据库
          self.saveLayer()
          self.saveExtraData()
          //友情提示
          this.$Message.info('修改成功')
        },
        onCancel: () => {
          this.$Message.info('取消修改')
        }
      })
    },
    //保存配置数据
    saveLayer(){
      //保存配置到数据库
      let param = {
        SceneNum: '09',
        Items: [{
          ModuleType: 'layerset',
          ModuleContent: JSON.stringify(this.getLayData),
          // ModuleContent: JSON.stringify({}),
          ModuleLocation: '01',
          OrderNo: 1
        }]
      }
      axios.post('/Elevator/Module/SaveModulePage', param).then(res => {
        console.log(res.data)
      })
    },
    //删除场景
    rmScene() {
      const self = this
      this.$Modal.confirm({
        title: '确定删除当前场景?',
        content: '',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          self.rmEachLayD()
          self.rmSceneBg(self.NOs)
          self.$store.commit('rmExtraScene', self.NOs)
          self.$store.commit('rmComb', self.NOs)
          if(self.extraScene.length >= 1){
              self.$store.commit("alterMySceneNO",self.extraScene[0].NO)
          }
          else{
              self.$emit("loadSence")
          }
          self.saveExtraData()
          this.$Message.info('删除成功')
        },
        onCancel: () => {
          this.$Message.info('取消删除')
        }
      })
    },
    //删除背景-场景
    rmSceneBg(id){
      axios.get(`/Elevator/Module/DeleteModuleBackgroud?sceneNum=${id}`).then(res=>{
        console.log(res)
      })
    },
    //删除场景内所有的唯一标记
    rmEachLayD(){
      //删除
      var self = this
      this.grids = this.grids.map(item=>{
        let stamp = item.child.timeStamp
        if(stamp != null){
          self.$store.commit("rmLayD",stamp)
        }
        return item
      })
      //保存到数据库
      this.saveLayer()
    },
    //保存额外场景到数据库
    saveExtraData(){
      let param = {
        SceneNum: '06',
        Items: [{
          ModuleType: 'extra',
          ModuleContent: JSON.stringify(this.extraScene),
          // ModuleContent: JSON.stringify([]),
          ModuleLocation: '01',
          OrderNo: 1
        }]
      }
      axios.post('/Elevator/Module/SaveModulePage', param).then(res => {
        // console.log(res.data)
      })
    },
    //根据打开的NO渲染场景
    renderScenes() {
      let extraData = JSON.parse(JSON.stringify(this.$store.state.savedScene));
      for (let i = 0, len = extraData.length; i < len; i++) {
        if (extraData[i].NO == this.NOs) {
          this.isDataPercentage(this.getLT,extraData[i])
        }
      }
    },
    //数据是否百分化?
    isDataPercentage(val1,val2){
      if(val1){
        let W = val2.original.W
        let H = val2.original.H

        this.grids = val2.data.grids.map(item => {
          item.width = parseFloat(item.width / W * this.getCurrentWidth)
          item.height = parseFloat(item.height / H * this.getCurrentHeight)
          item.top = parseFloat(item.top / H * this.getCurrentHeight)
          item.left = parseFloat(item.left / W * this.getCurrentWidth)
          return item
        })
        this.revert = val2.data.revert.map(item => {
          item.width = parseFloat(item.width / W * this.getCurrentWidth)
          item.height = parseFloat(item.height / H * this.getCurrentHeight)
          item.top = parseFloat(item.top / H * this.getCurrentHeight)
          item.left = parseFloat(item.left / W * this.getCurrentWidth)
          return item
        })
      }else{
        this.grids = [...val2.data.grids]
        this.revert = [...val2.data.revert]
      }
    },
    //初始化获取额外需减边距并设置
    getExtra() {
      this.et = this.tp + this.pd;
      this.el = this.lt + this.pd;
    },
    //点击配置
    rmModule(id) {
      var self = this
      this.grids = this.grids.map(item => {
        if (item.id == id) {
          //删除该配置信息
          self.$store.commit('rmLayD', item.child.timeStamp)
          //删除信息堆里该条唯一标记
          item.child.module = null
          item.child.render = false
          item.child.timeStamp = null
        }
        return item
      })
      //重置无配置状态
      this.todeal = false
      this.endX = 0
      this.endY = 0
      // console.log(id)
    },
    //保存布局和模块
    saveinfo(obj) {
      let n = Number(obj.n)
      let m = Number(obj.m)
      this.grids = this.grids.map(item => {
        if (item.id == n) {
          item.child.render = true
          item.child.module = m
        }
        return item
      })
    },
    //设置格子属性
    style(item) {
      return {
        width: !this.getLT ? item.width : item.width + 'px',
        height: !this.getLT ? item.height : item.height + 'px',
        left: !this.getLT ? item.left : item.left + 'px',
        top: !this.getLT ? item.top : item.top + 'px'
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
        // console.log('鼠标按下未放开就走了')
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
  },
  props: ['row', 'col', 'actId', 'turnof', 'lt', 'tp', 'pd'],
  components: {
    Button,
    sortableTable: () => import('@/components/sortableTable/index.vue'),
    modules: () => import('@/components/plugSortable/setbox.vue')
  },
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
  .ivu-btn-default {
    position: absolute;
    top: -70px;
    z-index: 1000;
    background-color: transparent;
    border: none;
    padding: 3px 6px;
  }
  .ivu-btn-default:nth-child(2){
    right: 268px;
    color: red;
  }
  .ivu-btn-default:nth-child(1){
    right: 233px;
    color: #006BD0;
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