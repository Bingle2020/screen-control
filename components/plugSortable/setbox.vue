<template>
  <!-- 配置信息弹出框 -->
  <Modal v-model="getSet" title="初始化配置模块" :draggable="drag" :closable="shutbox">
    <div class="interval">
      部件标题：
      <Input v-model="setdata.title" placeholder="请输入标题..." clearable style="width: 200px" />
    </div>
    <div class="interval">
      展示时间：
      <RadioGroup v-model="setdata.during">
        <Radio label="最近一天">最近一天</Radio>
        <Radio label="最近一月">最近一月</Radio>
        <Radio label="最近一年">最近一年</Radio>
      </RadioGroup>
    </div>
    <div class="interval">
      刷新时间：
      <RadioGroup v-model="setdata.refresh">
        <Radio label="0.5">30秒</Radio>
        <Radio label="1">1分钟</Radio>
        <Radio label="3">3分钟</Radio>
        <Radio label="5">5分钟</Radio>
      </RadioGroup>
    </div>
    <div class="footer-control">
      <button type="button" @click="sureok" class="ivu-btn ivu-btn-primary">确定</button>
    </div>
  </Modal>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import { Modal, Input, RadioGroup, Radio } from 'view-design'
export default {
  data() {
    return {
      setdata: {
        title: null,
        // shape: null,
        during: null,
        refresh: null
        // source: null,
        // remarks: null
      },
      setting: true,
      drag: true,
      shutbox: false
    }
  },
  computed: {
    ...mapGetters(['getSet', 'getLayData'])
  },
  methods: {
    ...mapMutations({
      addData: 'addLayD'
    }),
    sureok() {
      //如果未选择不能关闭
      if (this.setdata.during == null || this.setdata.refresh == null) {
        this.info('error')
        return
      }
      //创建唯一标识
      let id = new Date().getTime()
      //添加到vuex
      let obj = { id: id, data: { ...this.setdata } }
      this.addData(obj)
      //触发父组件关闭窗口
      this.$emit('addlayer', id)
      //清空填写的历史信息
      for (let key in this.setdata) {
        this.setdata[key] = null
      }
    },
    //未选则提示
    info(type) {
      this.$Message[type]({
        background: true,
        content: "请选择 “展示时间” 和 “刷新时间” ^_^"
      })
    }
  },
  components: {
    Modal,
    Input,
    RadioGroup,
    Radio
  }
}
</script>

<style lang="scss" scoped>
/deep/ .ivu-btn-text {
  display: none;
}
/deep/ .ivu-modal-footer {
  display: none;
}
.footer-control {
  border-top: 1px solid #e8eaec;
  padding: 12px 18px 0 18px;
  text-align: right;
}
.interval {
  margin: 15px 10px;
}
</style>