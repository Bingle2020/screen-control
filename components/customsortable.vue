<template>
  <div class="page-sortable">
    <div class="tag-table" v-if="show">
      <h3>拖拽元素</h3>
      <ul>
        <li v-for="item in tagTableLeft" :key="item.id" class="module-left">
          <p :id="item.id" draggable="true" @dragstart.self="activeId = item.id">{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div class="sortable">
      <div class="draggable-module">
        <hcustom
          :actId="activeId"
          row="10"
          col="10"
          wid="1100"
          high="500"
          eleft="220"
          etop="100"
        />
      </div>
    </div>
  </div>
</template>

<script>
import hcustom from '~/components/scene/hcustom.vue'
export default {
  props: ['id','show'],
  data() {
    return {
      value: '简报名称',
      activeId: null,
      tagTableLeft: [
        {
          name: '楼栋出入统计',
          id: 1
        },
        {
          name: '门禁设备状态',
          id: 2
        },
        {
          name: '视频监控设备状态统计',
          id: 3
        },
        {
          name: '授权卡类型统计',
          id: 4
        },
        {
          name: '梯控设备状态统计',
          id: 5
        },
         {
          name: '电梯外招统计',
          id: 6
        },
        {
          name: '刷卡开门统计',
          id: 7
        },
        {
          name: '视频监控',
          id: 8
        },
      ]
    }
  },
  mounted(){
    console.log(this.show)
  },
  components: {
    hcustom
  }
}
</script>

<style lang="scss">
.page-sortable {

  .tag-table {


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

  .sortable {

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
