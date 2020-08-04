<template>
  <div class="flex-box">
    <!-- 保存按钮 -->
    <button disabled class="savebtn" style="color: gray" v-if="turnof">保存</button>
    <Button type="primary" :class="{homeset: homeset}" @click="ok" v-else>保存</Button>
    
    <!-- 加载动画 -->
    <loading v-if="loading"></loading>
    <div v-else class="flex-column" v-for="(arr,index) of getData" :key="index">
      <div
        class="flex-column-row"
        v-for="(item,i) of arr"
        :key="i"
        :style="{borderColor:getBorderColor}"
        @dragover.prevent
        @drop="item.child.render = true"
      >
        <i class="iconfont icon-guanbi" v-if="getBar == null ? false : item.child.render" @click="rmModule(item.id)"></i>
        <sortableTable
          v-if="item.child.render == true"
          :last="item.child.module" 
          :grid="item.id"
          :id="getID"
          @saveModule="saveinfo"
        />
      </div>
    </div>
  </div>
</template>
<script>
import axios from '~/plugins/axios'
import { Button } from 'view-design'
import {mapGetters } from 'vuex'
export default {
  data() {
    return {
      data: null,
      loading: true,
      // modal1: false,
      // sceneName: ''
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
    //确定保存按钮
    ok() {
      //保存到数据库
      let param = {
        SceneNum: '08',
        Items: [{
          ModuleType: 'home',
          ModuleContent: JSON.stringify(this.data),
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
    //取消保存按钮
    cancel() {
      this.$Message.info('取消保存')
    },
    //保存布局和模块
    saveinfo(obj) {
      let n = Number(obj.n)
      let m = Number(obj.m)
      for (let i = 0; i < this.data.length; i++)
        for (let j = 0; j < this.data[i].length; j++) {
          if (this.data[i][j].id == n) {
            this.$set(this.data[i], j, {
              id: n,
              child: {
                render: true,
                module: m
              }
            })
            // this.$store.commit("transData",this.data)
            // console.log(this.$store.state.AScene)
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
              module: null
            }
          },
          {
            id: 1,
            child: {
              render: false,
              module: null
            }
          },
          {
            id: 2,
            child: {
              render: false,
              module: null
            }
          }
        ],
        [
          {
            id: 3,
            child: {
              render: false,
              module: null
            }
          },
          {
            id: 4,
            child: {
              render: false,
              module: null
            }
          }
        ],
        [
          {
            id: 5,
            child: {
              render: false,
              module: null
            }
          },
          {
            id: 6,
            child: {
              render: false,
              module: null
            }
          },
          {
            id: 7,
            child: {
              render: false,
              module: null
            }
          }
        ]
      ]
    },
    //进入页面初始化数据
    initDatas() {
      var grids
      axios.get('/Elevator/Module/LoadModulePage?sceneNum=08').then(res => {
        // console.log('当无数据库数据时，显示=>',res.data)
        if(res.data.data.length < 1){
          this.initGrids()
        }
        else{
          let result = JSON.parse(res.data.data[0].moduleContent)
          this.data = [...result]
        }
      })
    },
    //离开场景1后保存布局和数据
    saveData() {
      let param = {
        SceneNum: '04',
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
            this.$set(this.data[i], j, {
              id: id,
              child: {
                render: false,
                module: null
              }
            })
          }
        }
      //删除模块同时上传保存数据
      // this.saveData()
      // console.log('删除成功!')
    }
  },
  mounted() {
    console.log('首页进来了=>',this.$route.path)
    // this.initGrids()
    this.initDatas();
  },
  computed: {
    ...mapGetters(['getBorderColor','getBar']),
    getData() {
      return this.data
    },
    getID() {
      return this.actId
    },
    homeset(){
      return this.$route.query.homeset == 'true'
    }
  },
  components: {
    Button,
    sortableTable: () => import('@/components/sortableTable/index.vue'),
    loading: () => import('@/components/animation/loading.vue')
  }
}
</script>
<style lang="scss" >
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
    right: 165px;
    z-index: 1000;
    background-color: transparent;
    color: #006bd0;
    border: none;
    padding: 3px 6px;
    &.homeset{
      right: 0;
    }
  }
  
  .flex-column {
    flex: 1;
    display: flex;
    flex-direction: column;

    .flex-column-row {
      position: relative;
      border:0;
      border-radius: 10px;
      box-shadow: -1px 1px 5px(#121416);
      flex: 1;
      background-image: linear-gradient(30deg, #202328, #16171B);
      margin: 5px;
      overflow: hidden;
    }
    .flex-column-row >div{
      height: 100%;
    }
  }
}
</style>
