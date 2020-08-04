<template>
  <div class="flex-box">
    <!-- 保存按钮 -->
    <button disabled class="savebtn" style="color: gray" v-if="turnof">保存</button>
    <Button type="primary" @click="ok" v-show="!display" v-else>保存</Button>

    <!-- 加载动画 -->
    <loading v-if="loading"></loading>
    <div
      v-else
      class="flex-column"
      v-for="(arr, index) of getData"
      :key="index"
      :style="flexcolumn(index)"
    >
      <div
        class="flex-column-row"
        v-for="(item, i) of arr"
        :key="i"
        :style="{borderColor:getBorderColor}"
        @dragover.prevent
        @drop="item.child.render ? '': openSet(item.id)"
      >
        <!-- <i class="iconfont icon-guanbi" v-if="item.child.render" @click="rmModule(item.id)"
          ></i
        > -->
        <i class="iconfont icon-guanbi" v-if="getBar == null ? false : item.child.render" @click="rmModule(item.id)"
          ></i
        >
        <sortableTable
          v-if="item.child.render == true"
          :last="item.child.module"
          :grid="item.id"
          :id="getID"
          :stamp="item.child.timeStamp"
          @saveModule="saveinfo"
        />
      </div>
    </div>
    <modules @addlayer="addset"></modules>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { Button } from 'view-design'
import {mapGetters } from 'vuex'
export default {
  data() {
    return {
      //打开的配置盒子
      dropId: null,
      //所有数据
      data: null,
      //动画
      loading: true
    }
  },
  watch: {
    data(newval) {
      if (newval != null) {
        this.loading = false
      }
    }
  },
  props: ['actId','turnof'],
  methods: {
    //添加临时配置信息,并且关闭配置盒子
    addset(ids) {
      //将信息添加修改进数据堆里面
      let self = this
      this.data = this.data.map(ITEM=>{
        ITEM = ITEM.map(item=>{
          if(item.id == self.dropId){
            item.child.render = true
            item.child.timeStamp = ids
          }
          return item
        })
        return ITEM
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
    //确定保存按钮
    ok() {
      //保存数据
      // this.saveData()
      // this.saveLayer()
      //保存成功提示
      this.$Message.info('保存成功')
    },
    //保存配置数据
    saveLayer(){
      //保存配置到数据库
      let param = {
        SceneNum: '09',
        Items: [{
          ModuleType: 'layerset',
          ModuleContent: JSON.stringify(this.getLayData),
          ModuleLocation: '01',
          OrderNo: 1
        }]
      }
      axios.post('/Elevator/Module/SaveModulePage', param).then(res => {
        console.log(res.data)
      })
    },
    //保存布局和模块
    saveinfo(obj) {
      let n = Number(obj.n)
      let m = Number(obj.m)
      this.data = this.data.map(ITEM=>{
        ITEM = ITEM.map(item=>{
          if(item.id == n){
            item.child.render = true
            item.child.module = m
          }
          return item
        })
        return ITEM
      })
    },
    flexcolumn(index) {
      // console.log(index)

      if (index == 0) {
        return {
          flex: 2
        }
      } else if (index == 1) {
        return {
          flex: 4
        }
      } else {
        return {
          flex: 2
        }
      }
    },
    //0初始化数据
    initGrids() {
      this.data = [
        [
          {
            id: 0,
            child: {
              render: false,
              module: null,
              timeStamp: null
            }
          },
          {
            id: 1,
            child: {
              render: false,
              module: null,
              timeStamp: null
            }
          }
        ],
        [
          {
            id: 2,
            child: {
              render: false,
              module: null,
              timeStamp: null
            }
          }
        ],
        // [
        //   {
        //     id: 3,
        //     child: {
        //       render: false,
        //       module: null,
        //       timeStamp: null
        //     }
        //   }
        // ]
      ]
    },
    //进入页面初始化数据
    initDatas() {
      this.initGrids()
      // var grids
      // axios.get('/Elevator/Module/LoadModulePage?sceneNum=07').then(res => {
      //   // console.log('获取的数据=>', JSON.parse(res.data.data[0].moduleContent))
      //   let datas = res.data.data[0]
      //   // let data = JSON.parse(datas.moduleContent)
      //   if (datas == undefined) {
      //     this.initGrids()
      //   } else {
      //     this.data = [...JSON.parse(datas.moduleContent)]
      //   }
      // })
    },
    //离开场景1后保存布局和数据
    saveData() {
      let param = {
        SceneNum: '07',
        Items: [
          {
            ModuleType: 'data',
            ModuleContent: JSON.stringify(this.data),
            ModuleLocation: '01',
            OrderNo: 1
          }
        ]
      }
      axios.post('/Elevator/Module/SaveModulePage', param).then(res => {
        console.log(res.data)
      })
    },
    //删除模块
    rmModule(id) {
      for (let i = 0; i < this.data.length; i++)
        for (let j = 0; j < this.data[i].length; j++) {
          if (this.data[i][j].id == id) {
            //删除该配置信息
            this.$store.commit('rmLayD', this.data[i][j].child.timeStamp)
            //删除信息堆里该条唯一标记
            this.$set(this.data[i], j, {
              id: id,
              child: {
                render: false,
                module: null,
                timeStamp: null
              }
            })
          }
        }
    }
  },
  mounted() {
    //  this.initGrids()
    this.initDatas();
  },

  computed: {
    ...mapGetters(['getBorderColor','getBar','getLayData']),
    getData() {
      return this.data
    },
    getID() {
      return this.actId
    },
    display(){
      let o = this.$route.query
      return o.hasOwnProperty("allowEdit") == false && o.hasOwnProperty("homeset") == false
    }
  },
  components: {
    Button,
    sortableTable: () => import('@/components/sortableTable/index.vue'),
    loading: () => import('@/components/animation/loading.vue'),
    modules: () => import('@/components/plugSortable/setbox.vue')
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/fonts/guanbi.scss';
.iconfont {
  position: absolute;
  top: 0;
  right: 0;
  width: 20px;
  height: 20px;
  margin: 2px;
  z-index: 10;
  line-height: 20px;
  text-align: center;
  color: #000000;
  cursor: pointer;
  &:hover {
    color: rgb(12, 210, 245);
  }
}
.flex-box {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 520px;
  width: 100%;
  .savebtn,.ivu-btn-primary{
    position: absolute;
    top: -70px;
    right: 233px;
    z-index: 1000;
    background-color: transparent;
    color: #006bd0;
    border: none;
    padding: 3px 6px;
  }
  .flex-column {
    flex: 1;
    display: flex;
    flex-direction: column;

    .flex-column-row {
      position: relative;
      border:0;
      border-radius: 0;
      box-shadow: -1px 1px 5px(#121416);
      padding:2px;
      flex: 1;
     background: rgba(0, 102, 254, 0.3) url('/bgimg/sceneborder3.png') 0 0 no-repeat;
      background-size:100% 100%;
      margin: 5px;
    }
    .flex-column-row >div{
      height:100%;
    }
  }
}
</style>
