<template>
  <div class="display" ref="layer">
    <div class="child-box" ref="childbox" :style="bgset">
      <home :lt="0" :tp="0" pd="0" :hig="getHigh" :row="getRow" :col="getCol" />
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import { mapGetters } from 'vuex'
export default {
  data(){
    return {
      high: 0
    }
  },
  mounted() {
    this.getLayD()
    this.getSceneBg()
    //300ms后获取height
    const self = this
    var times = setTimeout(()=>{
      self.high = self.$refs.childbox.offsetHeight
    },200)
  },
  methods: {
    getLayD() {
      axios.get('/Elevator/Module/LoadModulePage?sceneNum=09').then(res => {
        // console.log('下载的数据==>', JSON.parse(res.data.data[0].moduleContent))
        let datas = res.data.data[0]
        if (datas == undefined) {
          return
        }
        this.$store.commit('setLayD', JSON.parse(datas.moduleContent))
      })
    },
    getSceneBg() {
      if(JSON.stringify(this.getCombine) != '{}'){
        return
      }
      axios.get('/Elevator/Module/GetModuleBackgrouds').then(res => {
        let datas = res.data.data
        // console.log(datas)
        if (datas.length == 0) {
          return
        }
        var o = {}
        for (let i = 0, len = datas.length; i < len; i++) {
          o[datas[i].sceneNum] = datas[i].backgroudUrl
        }
        this.$store.commit('initSceneBg', o)
      })
    }
  },
  computed: {
    getHigh(){
      return this.high
    },
    ...mapGetters(['getRow', 'getCol', 'getCombine']),
    getoffsetleft() {
      let lt = this.$refs.layer.offsetLeft
      return lt ? lt : 0
    },
    getoffsettop() {
      let tp = this.$refs.layer.offsetTop
      return tp ? tp : 0
    },
    bgset() {
      return {
        // boxShadow: 'rgba(239, 241, 243, 0.52) -5px -4px 20px 6px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: `url('${this.getCombine['1591942094236']}')`
      }
    }
  },
  components: {
    home: () => import('~/components/scene/dishome.vue')
  }
}
</script>

<style lang="scss" scoped>
.display {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 1px solid black;
  box-sizing: border-box;
  background-image: url('../static/bgimg/homebg.png');
  background-size: cover;
  background-repeat: no-repeat;

  .child-box {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    // margin: 20px 50px;
    border-radius: 8px;
    overflow: hidden;
  }
}
</style>