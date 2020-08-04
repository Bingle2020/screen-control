<template>
  <div class="page-sortable" :class="[isActive ? 'page-sortable' + id : 'page-sortable']">
    <div
      :class="[isActive ? 'tag-table' + id : 'tag-table']"
      v-if="show"
      :style="{ borderColor: getBorderColor }"
    >
      <h3>数据模型</h3>
      <Menu accordion>
        <Submenu name="1">
          <template slot="title">
            <Icon type="ios-paper" />列表一
          </template>
          <MenuItem v-for="item in DoorMenuList" :key="item.id" class="module-left" name="1-1">
            <p
              :style="{ borderColor: getBorderColor }"
              :id="item.id"
              draggable="true"
              @dragstart.self="activeId = item.id"
            >{{ item.name }}</p>
          </MenuItem>
        </Submenu>
        <Submenu name="2">
          <template slot="title">
            <Icon type="ios-people" />列表二
          </template>
          <MenuItem v-for="item in eleMenuList" :key="item.id" class="module-left" name="item.name">
            <p
              :style="{ borderColor: getBorderColor }"
              :id="item.id"
              draggable="true"
              @dragstart.self="activeId = item.id"
            >{{ item.name }}</p>
          </MenuItem>
        </Submenu>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-people" />列表三
          </template>
          <MenuItem
            v-for="item in VdeoMenuList"
            :key="item.id"
            class="module-left"
            name="item.name"
          >
            <p
              :style="{ borderColor: getBorderColor }"
              :id="item.id"
              draggable="true"
              @dragstart.self="activeId = item.id"
            >{{ item.name }}</p>
          </MenuItem>
        </Submenu>
      </Menu>
    </div>
    <div class="sortable" ref="sort" :style="[basicBg(),sceneLinkBg()]">
      <div class="draggable-module">
        <home
          :lt="getoffsetleft"
          :tp="getoffsettop"
          :pd="getpadding"
          :turnof="turn"
          :actId="activeId"
          :row="getRow"
          :col="getCol"
          v-if="(turn == true ? getNum : id) == 0"
        />
        <sceneone
          :turnof="turn"
          :actId="activeId"
          @turn="turnfunc(turn, id)"
          v-if="(turn == true ? getNum : id) == 1"
        />
        <scenetwo :turnof="turn" :actId="activeId" v-if="(turn == true ? getNum : id) == 2" />
        <scenethr :turnof="turn" :actId="activeId" v-if="(turn == true ? getNum : id) == 3" />
        <custom
          :lt="getoffsetleft"
          :tp="getoffsettop"
          :pd="getpadding"
          :turnof="turn"
          :actId="activeId"
          :row="getRow"
          :col="getCol"
          v-if="(turn == true ? getNum : id) == 4"
        />
        <!-- 保存的其他场景 -->
        <exScene
          :turnon="isturn"
          :lt="getoffsetleft"
          :tp="getoffsettop"
          :pd="getpadding"
          @loadSence="loadSence3"
          :turnof="turn"
          :actId="activeId"
          :row="getRow"
          :col="getCol"
          v-if="(turn == true ? getNum : id) == 5"
        />
      </div>
    </div>
  </div>
</template>

<script>
import home from '~/components/scene/sethome.vue'
import sceneone from '~/components/scene/sceneone.vue'
import scenetwo from '~/components/scene/scenetwo.vue'
import scenethr from '~/components/scene/scenethr.vue'
import custom from '~/components/scene/custom.vue'
import exScene from '~/components/scene/myScene.vue'
import { mapGetters } from 'vuex'
export default {
  //id:接受场景ID(num)  show：是否可编辑状态(bool)   turn：是否轮播（bool）
  props: ['id', 'show', 'turn', 'isturn'],
  data() {
    return {
      n: 1,
      // id:1,
      isActive: this.id,
      turnTime: null,
      // value: '简报名称',
      activeId: null,
      pad: 15,
      DoorMenuList: [
        {
          // name: '楼栋出入统计',
          name: '漏斗图',
          id: 1
        },
        {
          // name: '门禁设备状态',
          name: '多环直达图',
          id: 2
        },
        {
          // name: '授权卡类型统计',
          name: '交错正负轴图',
          id: 4
        },
        // {
        //   name: '刷卡开门统计',
        //   id: 7
        // }
      ],
      eleMenuList: [
        {
          // name: '梯控设备状态',
          name: '山峰插标图',
          id: 5
        },
        {
          // name: '电梯外招统计',
          name: '阶梯瀑布图',
          id: 6
        },
        {
          // name: '刷卡开门统计',
          name: '速度标盘',
          id: 7
        }
      ],
      VdeoMenuList: [
        {
          // name: '视频监控状态统计',
          name: '极坐标双数值轴',
          id: 3
        },
        // {
        //   name: '视频监控',
        //   id: 8
        // },
        // {
        //   name: '公告',
        //   id: 9
        // }
      ]
    }
  },
  computed: {
    ...mapGetters(['getBorderColor', 'getRow', 'getCol', 'getCombine', 'getMySceneNo']),
    getNum() {
      return this.n
    },
    getoffsetleft() {
      let lt = this.$refs.sort.offsetLeft
      return lt ? lt : 0
    },
    getoffsettop() {
      let tp = this.$refs.sort.offsetTop
      return tp ? tp : 0
    },
    getpadding() {
      return this.pad
    }
  },
  watch: {
    n(val) {
      if (val && val == 6) {
        this.n = 1
      }
    },
    turn(newval) {
      if (newval == true) {
        this.turnTime = setInterval(
          function() {
            this.n++
          }.bind(this),
          2000
        )
      } else {
        clearInterval(this.turnTime)
        this.turnTime = null
      }
    }
  },
  methods: {
    loadSence3() {
      this.$emit('loadS3')
    },
    turnfunc(turn, id) {
      if (turn == true) {
        this.turnTime = setInterval(function() {
          console.log(turn)
          id++
          console.log(id)
        }, 3000)
      } else {
        clearInterval(this.turnTime)
        this.turnTime = ''
        console.log(turn)
      }
    },
    //匹配场景的背景
    basicBg(){
      return {
        padding: this.pad + 'px',
        borderColor: this.getBorderColor,
        // boxShadow: 'rgba(239, 241, 243, 0.52) -5px -4px 20px 6px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover'
      }
    },
    sceneLinkBg(){
      return {
        backgroundImage: `url('${this.getCombine[this.getMySceneNo]}')`,
      }
    }
  },
  components: {
    home,
    sceneone,
    scenetwo,
    scenethr,
    custom,
    exScene
  }
}
</script>

<style lang="scss">
.ivu-menu-light {
  background-color: transparent;
}
.ivu-menu {
  color: #fff;
  //  .ivu-menu{
  //  background-color: #161617;
  //       }
}
.ivu-menu-vertical.ivu-menu-light:after {
  width: 0;
}
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  width: 0;
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background-color: transparent;
}
.page-sortable1 {
  background-color: #212429;
}
.page-sortable2 {
  background-color: #252b41;
}
.page-sortable3 {
  background-color: #080b14;
  background: url('/bgimg/scenebg3.png') 0 0 no-repeat;
  background-size: 100% 100%;
}
.page-sortable {
  width: 100%;
  padding-top: 60px;
  height: calc(100% - 0px);
  margin: 0 auto;
  position: relative;
  display: flex;
  .sortable {
    border: 0 !important;
  }

  .tag-table1 {
    flex: 1;
    height: 100%;
    min-height: 560px;
    float: left;
    background: #191d20;
    border: 0 !important;
    h3 {
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #fff;

      background-color: transparent !important;
    }
    .module-left {
      position: relative;
      .echarts-left {
        position: absolute;
        top: 40px;
        left: 0;
      }
      p {
        padding: 6px 0;
        cursor: move;
        border: 0 !important;
        border-radius: 10px;
        background-image: linear-gradient(#52575d, #121417);
        color: #fff;
        box-shadow: 2px 2px 5px (#121416);
        font-weight: 400;
      }
    }
  }
  .tag-table2 {
    flex: 1;
    height: 100%;
    min-height: 560px;
    float: left;
    background: #404966;
    border: 0 !important;
    h3 {
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #fff;

      background-color: transparent !important;
    }
    .module-left {
      position: relative;
      .echarts-left {
        position: absolute;
        top: 40px;
        left: 0;
      }
      p {
        padding: 6px 0;
        cursor: move;
        border: 0 !important;
        border-radius: 2px;
        background: #252b41;
        color: #fff;
        font-weight: 400;
      }
    }
  }
  .tag-table3 {
    flex: 1;
    height: 100%;
    min-height: 560px;
    float: left;
    background: rgba(0, 102, 254, 0.3);
    border: 0 !important;
    h3 {
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #fff;
      background-color: transparent !important;
    }
    .module-left {
      position: relative;
      padding: 0;

      .echarts-left {
        position: absolute;
        top: 40px;
        left: 0;
      }
      p {
        padding: 6px 0;
        cursor: move;
        border: 0 !important;
        border-radius: 10px;
        padding: 15px 0;
        color: #fff;
        background: url('/bgimg/sene_list_border.png') 0 0 no-repeat;
        background-size: 100% 100%;
        box-shadow: none;
        font-weight: 400;
      }
    }
  }
  .tag-table4,
  .tag-table0 {
    flex: 1;
    height: 100%;
    min-height: 560px;
    border: 1px solid #00b8f5;
    float: left;

    h3 {
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #fff;
      background-color: #1269d0;
    }

    p {
      padding: 6px 0;
      cursor: move;
      border: 1px solid #3db5f4;
      background-color: rgba(0, 0, 0, 0.2);
      &:hover {
        background-color: #3cb4f3;
        color: #fff;
      }
    }
    .module-left {
      position: relative;
      margin: 15px;
      .echarts-left {
        position: absolute;
        top: 40px;
        left: 0;
      }
    }

    div[draggable='true'] {
      // .ghost{
      .echarts {
        display: block;
      }
    }
  }
  .tag-table5 {
    flex: 1;
    height: 100%;
    min-height: 560px;
    border: 1px solid #00b8f5;
    float: left;

    h3 {
      padding: 6px 0;
      font-size: 14px;
      text-align: center;
      color: #fff;
      background-color: #1269d0;
    }

    p {
      padding: 6px 0;
      cursor: move;
      border: 1px solid #3db5f4;
      background-color: rgba(0, 0, 0, 0.2);
      &:hover {
        background-color: #3cb4f3;
        color: #fff;
      }
    }
    .module-left {
      position: relative;
      margin: 15px;
      .echarts-left {
        position: absolute;
        top: 40px;
        left: 0;
      }
    }

    div[draggable='true'] {
      // .ghost{
      .echarts {
        display: block;
      }
    }
  }

  .grid > div {
    height: 100%;
  }
  .sortable {
    flex: 7;
    min-height: 560px;
    height: 100%;
    border: 1px solid #00b8f5;
    margin-left: 20px;
    // padding: 15px;

    .headline {
      text-align: center;
      margin-top: 20px;

      .ivu-input-wrapper {
        margin: 0 auto;
        display: block;

        input {
          text-align: center;
        }
      }

      p {
        padding: 16px 0;
        font-size: 14px;
      }

      .large {
        input {
          height: 50px;
          line-height: 50px;
          color: #fc697a;
          font-size: 20px;
        }
      }

      .small {
        .ivu-input-wrapper {
          display: inline-block;
          width: 140px;
          margin-right: 10px;

          input {
            height: 30px;
            line-height: 30px;
            font-size: 14px;
          }
        }
      }
    }

    .draggable-module {
      position: relative;
      height: 100%;
    }

    .tagTableRight {
      width: 100%;
      min-height: 200px;
      margin-top: 20px;

      li {
        min-height: 200px;
        margin-bottom: 20px;
      }
    }
    // .echarts {
    //   width: 100% !important;
    //   height: 200px !important;
    //   margin-bottom: 20px;
    // }

    .placeholder {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 0;
      text-align: center;
      width: calc(100% - 40px);
      padding: 120px 0;
      border: dashed 1px #00b8f5;
      text-align: center;

      h1 {
        font-size: 20px;
      }

      p {
        padding-top: 20px;
      }
    }
  }
}
</style>
