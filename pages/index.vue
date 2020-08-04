<template>
  <div
    class="container"
    v-bind:style="{
      backgroundColor: bgCol,
      backgroundImage: 'url(' + bgimgUrl + ')',
      color: fontCol
    }"
  >
    <cvs v-if="iscvs" />
    <div class="header note">
      <h5 @click.prevent="
          show = false
          scene = false
        ">{{ newname }}</h5>
      <Modal v-model="modal0" title="修改标题" @on-ok="ok" @on-cancel="cancel">
        输入新的标题:
        <input type="text" v-model="newname" />
      </Modal>
      <div class="sceneSelect btn" :class="{ render: display }">
        <button
          class="sceneSel"
          style="position: absolute;top: -1px;right: 15px;z-index: 100;outline: none"
          @click="
            scene = !scene
            show = false
          "
          v-show="homeset"
        >场景选择</button>
      </div>
      <div class="scene-modal" v-if="scene">
        <ul>
          <li
            v-for="item in getscenelis"
            :key="item.id"
            :id="item.id"
            @click="switchscene(item.id,item.NO)"
          >{{ item.name }}</li>
        </ul>
        <ul>
          <!-- 额外场景列表 -->
          <li
            v-for="item in extraScene"
            :key="item.NO"
            @click="clickExtraScene(item.id, item.NO)"
          >{{ item.name }}</li>
        </ul>
      </div>
      <!-- 轮播开关 -->
      <div
        style="position: relative;width: 30px;float: right;top: -52px;right:140px"
        v-show="homeset"
      >
        <Switchs
          size="small"
          @on-change="toCarousel"
          v-model="carousel"
          false-color="red"
          :disabled="isDisabled"
        />
      </div>
      <!-- 轮播时间 -->
      <div
        style="position: relative;width: 70px;float: right;top: -51px;right:140px"
        v-show="homeset"
      >
        <Dropdown @on-click="intervalTime" trigger="click" placement="bottom-start">
          <a href="javascript:void(0)">
            轮播时间
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="3">3秒</DropdownItem>
            <DropdownItem name="5">5秒</DropdownItem>
            <DropdownItem name="10">10秒</DropdownItem>
            <DropdownItem name="30">30秒</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="btn" v-if="showbar">
        <button
          style="position: absolute;top: -1px;right: 90px;z-index: 100;outline: none"
          @click="
            show = !show
            scene = false
          "
          v-show="homeset"
        >换肤</button>
        <div class="skin-modal" v-if="show">
          <ul>
            <li>
              <span>字体颜色</span>
              <colorPicker v-model="fontCol" v-on:change="headleChangeColor1"></colorPicker>
            </li>
            <li>
              <span>边框颜色</span>
              <colorPicker v-model="borderCol" v-on:change="headleChangeColor2"></colorPicker>
            </li>
            <li>
              <span>背景颜色</span>
              <colorPicker v-model="bgCol" v-on:change="headleChangeColor"></colorPicker>
            </li>
            <li>
              <button style="outline: 0;cursor: pointer" @click="switchbg">默认背景</button>
            </li>
            <li>
              <button style="outline: 0;cursor: pointer" @click="modal1 = !modal1">背景素材</button>
            </li>
            <li>
              <button style="outline: 0;cursor: pointer" @click="modal0 = true">更换标题</button>
            </li>
          </ul>
        </div>
      </div>
      <!-- 背景选择、设置 弹出框 -->
      <Modal
        v-model="modal1"
        class="upImg"
        title="背景素材"
        :draggable="drag"
        @on-ok="sureUp"
        @on-cancel="cancelUp"
        width="820"
        cancel-text="取消"
        ok-text="使用选中图片"
      >
        <Tabs v-model="selSceneNo" @on-click="toggleScene">
          <TabPane label="首页" name="1591942094236"></TabPane>
          <TabPane label="自定义" name="1591929346347"></TabPane>
          <TabPane
            v-for="(item,i) of extraScene"
            :label="item.name"
            :name="String(item.NO)"
            :key="item.NO + i"
          ></TabPane>
        </Tabs>
        <!-- 固定图片列表 -->
        <div class="bgImgList">
          <ul>
            <li @click="selectImg(item.id)" v-for="item of getimgs" :key="item.id">
              <img @click.shift.exact="rmImg(item.id)" :src="item.src" :class="{dashbder: item.seltd}" alt="加载失败" />
              <p>
                {{item.title}}
                <span :class="{selbg: item.seltd}"></span>
              </p>
            </li>
          </ul>
        </div>
        <hr />
        <!-- 上传自定义图片 -->
        <div class="bgImgList" style="max-height: 245px;overflow: auto">
          <ul>
            <li v-for="item of getEimg" :key="item.id">
              <img
                @click="selectExtraImg(item.id)"
                :src="item.src"
                :class="{dashbder: item.seltd}"
                alt="加载失败"
              />
              <p @click="selectExtraImg(item.id)">
                {{item.title}}
                <span :class="{selbg: item.seltd}"></span>
              </p>
              <Icon type="ios-trash" @click="rmImg(item.id)" class="trash" />
            </li>
            <!-- 预加载图片动画 -->
            <li v-if="imgLoading" style="position: relative;">
              <Imgload></Imgload>
            </li>
            <!-- 上传操作 -->
            <li>
              <Upload
                class="uploadImg"
                :show-upload-list="uploadlist"
                :multiple="multimore"
                :format="['jpg','jpeg','png','webp']"
                :on-format-error="handleFormatError"
                :max-size="2048"
                :on-exceeded-size="handleMaxSize"
                type="drag"
                :before-upload="handleBeforeUpload"
                :on-success="handleSuccess"
                action="http://192.168.40.12:8089/Elevator/Module/UploadImg"
              >
                <div style="width: 100%;height: 80px;padding: 10px 0;box-sizing: border-box">
                  <Icon type="ios-cloud-upload" size="32" style="color: #3399ff"></Icon>
                  <p>点击上传图片</p>
                </div>
              </Upload>
            </li>
          </ul>
        </div>
        <!-- <upload></upload> -->
      </Modal>
      <!-- -------分隔符-------- -->
    </div>
    <div class="cont">
      <sortable
        @click.native="
          show = false
          scene = false
        "
        @loadS3="renderS3"
        :show="showbar"
        :turn="turn"
        :isturn="getTurn"
        :id="activeid"
      />
    </div>
  </div>
</template>

<script>
import axios from '~/plugins/axios'
import sortable from '~/components/sortable.vue'
import cvs from '~/components/background/canvas.vue'
import customsortable from '~/components/customsortable.vue'
import Imgload from '~/components/animation/upload'
import dragbar from '~/components/drag/dragbar.vue'
import { mapGetters, mapMutations } from 'vuex'
import {
  Button,
  Modal,
  Upload,
  Switch,
  Dropdown,
  Icon,
  DropdownMenu,
  DropdownItem,
  Tabs,
  TabPane
} from 'view-design'
export default {
  data() {
    return {
      //设置背景的场景
      selSceneNo: '1591929346347',
      //图片上传动画
      multimore: false,
      imgLoading: false,
      uploadlist: false,
      files: [],
      file: null,
      loadingStatus: false,
      drag: true,
      //标题
      newname: '会议室大屏',
      modal0: false,
      modal1: false,
      turn: false,
      formSend: {
        value: '0',
        label: '编辑'
      },
      childrendata: [
        { id: 1, NO: 1591929292602, name: '场景一' },
        { id: 2, NO: 1591929314639, name: '场景二' },
        { id: 3, NO: 1591929329563, name: '场景三' },
        { id: 4, NO: 1591929346347, name: '自定义' }
      ],
      show: false,
      scene: false,
      bgCol: '#00173D',
      bgimgUrl: '',
      fontCol: '#006BD0',
      borderCol: '#00BEF7',
      modalCol: '#031629',
      iscvs: true,
      activeid: 1,
      showbar: true,
      allowEdit: '',
      //背景图片列表
      backgroudImgList: [],
      //轮播
      carousel: false,
      carouselTime: null,
      carouselInterval: null,
      sn: 0
    }
  },
  computed: {
    ...mapGetters({
      extraScene: 'getSdScene',
      getimgs: 'getImgs',
      getEimg: 'getExtraImg',
      getComb: 'getCombine'
    }),
    getTurn() {
      return this.carousel
    },
    isDisabled() {
      return (
        this.carouselInterval == null ||
        !(Number(this.activeid) == 5 && this.extraScene.length > 1)
      )
    },
    getscenelis() {
      return this.childrendata
    },
    homeset() {
      let o = this.$route.query
      return (
        o.hasOwnProperty('allowEdit') == true &&
        o.hasOwnProperty('homeset') != true
      )
    },
    display() {
      let o = this.$route.query
      let allowedit = o.hasOwnProperty('allowEdit')
      let homeset = o.hasOwnProperty('homeset')
      if (allowedit == true && homeset == false) return false
      if (allowedit == true && homeset == true) return false
      if (allowedit == false && homeset == false) return true
    }
  },
  watch: {
    sn(newval) {
      if (newval && newval == this.extraScene.length) {
        this.sn = 0
      }
    }
  },
  mounted() {
    if (this.$route.query.homeset == 'true') {
      this.activeid = 0
      this.setSceneNo(1591942094236)
    }
    // this.getUrlParam('allowEdit')
    //this.showbar=this.getUrlParam('allowEdit')
    // this.showbar = this.isBoolean(this.getUrlParam('allowEdit'))
    this.showbar = this.$route.query.allowEdit == 'true' ? true : (this.$route.query.allowEdit == 'false' ? false : null)

    this.$store.commit('changeBar', this.showbar)
    // console.log(typeof this.getUrlParam('allowEdit'))
    // this.cvs()
    // this.getExtraLis()
    //加载云模块信息
    // this.getLayD()
    //加载云图片
    // this.loadImgs()
    //加载背景-场景
    // this.getSceneBg()
  },
  methods: {
    //切换背景场景
    toggleScene() {
      console.log('场景==>', this.selSceneNo)
    },
    //删除云图片
    rmImg(id) {
      const self = this
      axios.get(`/Elevator/Module/DeleteImage?fileName=${id}`).then(res => {
        if (res.statusText == 'OK') {
          self.loadImgs()
        }
      })
    },
    //从服务器加载图片信息
    loadImgs() {
      axios.get('/Elevator/Module/GetImages').then(res => {
        // console.log(res)
        // console.log(res.data.data)
        let data = res.data.data
        this.$store.commit('loadUserImgs', data)
      })
    },
    //图片上传之前函数
    handleBeforeUpload() {
      //打开加载动画
      this.imgLoading = true
    },
    //图片上传成功时返回函数
    handleSuccess(res, file) {
      console.log('res==>', res)
      const self = this
      var t
      return new Promise(resolve => {
        if (file.status == 'finished') {
          //关闭加载动画
          self.imgLoading = false
          resolve(true)
        }
      }).then(result => {
        if (result) {
          self.loadImgs()
        }
      })
    },
    //确定上传选中图片时
    sureUp() {
      var links = null
      for (let i = 0, len = this.getimgs.length; i < len; i++) {
        if (this.getimgs[i].seltd) {
          links = this.getimgs[i].src
          break
        }
      }
      if (links == null) {
        for (let j = 0, le = this.getEimg.length; j < le; j++) {
          if (this.getEimg[j].seltd) {
            links = this.getEimg[j].src
            break
          }
        }
      }
      if (links) {
        //保存到store
        this.$store.commit('modifyComb', { id: this.selSceneNo, src: links })
        console.log("数据==>",this.selSceneNo,links)
        //保存到服务器
        this.saveSceneBg(this.selSceneNo,links)
        //store恢复数据状态
        this.recoverImg()

        const msg = this.$Message.loading({
          content: '正在生效...',
          duration: 0
        })
        //可设置为获取到数据并生效了以后才关闭提示框！
        setTimeout(msg, 3000)
      } else {
        this.$Message.info('请选择图片！')
      }
    },
    //保存背景-场景
    saveSceneBg(num, link) {
      axios
        .get('/Elevator/Module/SaveModuleBackgroud', {
          params: {
            sceneNum: num,
            bgUrl: link
          }
        })
        .then(res => {
          console.log(res.data)
        })
    },
    //下载背景-场景
    getSceneBg() {
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
    },
    //取消按钮
    cancelUp() {
      this.recoverImg()
      this.selSceneNo = '1591929346347'
      //关闭加载动画
      this.imgLoading = false
      this.$Message.info('取消')
    },
    //上传图片格式错误提示
    handleFormatError() {
      this.$Notice.warning({
        title: '上传图片格式错误！',
        desc: '请重新选择jpg,jpeg,webp或png格式图片上传！'
      })
      this.imgLoading = false
    },
    //上传图片大小超出范围
    handleMaxSize() {
      this.$Notice.warning({
        title: '图片大小错误！',
        desc: '请重新选择0~2048kb范围的图片上传！'
      })
      this.imgLoading = false
    },
    //下拉选择轮播时间
    intervalTime(a) {
      //如果已经在轮播了
      if (this.carousel) {
        var self = this
        //清除定时器
        clearInterval(this.carouselTime)
        //重新按照新时间轮播
        this.carouselInterval = Number(a) * 1000
        this.carouselTime = setInterval(() => {
          self.setSceneNo(self.extraScene[self.sn++].NO)
        }, this.carouselInterval)
      }
      //如果还没开始轮播
      else {
        this.carouselInterval = Number(a) * 1000
      }
    },
    //开始轮播
    toCarousel() {
      var self = this
      if (this.carousel) {
        this.carouselTime = setInterval(() => {
          //开启轮播后，在额外场景中轮流切换过渡
          self.setSceneNo(self.extraScene[self.sn++].NO)
        }, this.carouselInterval)
      } else {
        clearInterval(this.carouselTime)
        this.carouselTime = null
        //关闭轮播后返回额外场景第一个
        this.sn = 0
        this.setSceneNo(this.extraScene[0].NO)
      }
    },
    //标题
    ok() {
      this.$Message.info('修改成功！')
    },
    cancel() {
      this.$Message.info('取消修改')
    },
    ...mapMutations({
      setSceneNo: 'alterMySceneNO',
      selectImg: 'modifyImgs',
      selectExtraImg: 'modifyExtraImgs',
      recoverImg: 'recoverImgs'
    }),
    renderS3() {
      this.activeid = 3
    },
    clickExtraScene(id, num) {
      //停止轮播
      this.carousel = false
      this.sn = 0
      if (this.carouselTime != null) {
        clearInterval(this.carouselTime)
        this.carouselTime = null
      }

      this.activeid = id
      this.setSceneNo(num)
    },
    getExtraLis() {
      axios.get('/Elevator/Module/LoadModulePage?sceneNum=06').then(res => {
        let datas = res.data.data[0]
        // console.log('获取的数据1=>', datas)
        if (datas == undefined) {
          return
        }
        this.$store.commit('setScene', JSON.parse(datas.moduleContent))
      })
    },
    getLayD() {
      axios.get('/Elevator/Module/LoadModulePage?sceneNum=09').then(res => {
        let datas = res.data.data[0]
        // console.log('下载的数据2==>', datas)
        if (datas == undefined) {
          return
        }
        this.$store.commit('setLayD', JSON.parse(datas.moduleContent))
      })
    },
    functurn(turn) {
      if (turn == true) {
        console.log('轮播了' + turn)
        return true
      } else {
        console.log('不轮播了' + turn)
        return false
      }
    },
    //切换场景
    switchscene: function(id, NO) {
      //停止轮播
      this.carousel = false
      this.sn = 0
      if (this.carouselTime != null) {
        clearInterval(this.carouselTime)
        this.carouselTime = null
      }

      this.activeid = id
      //保存当前场景id
      this.$store.commit('transId', id)
      if(id == 4){
        this.setSceneNo(NO)
      }else{
        this.setSceneNo(null)
      }
    },
    headleChangeColor: function() {
      //改变背景颜色
      console.log(this.bgCol)
      this.iscvs = false
      this.bgimgUrl = ''
    },
    headleChangeColor1: function() {
      //改变字体颜色
      console.log(this.fontCol)
    },
    headleChangeColor2: function() {
      //改变边框颜色
      console.log(this.borderCol)
      this.$store.commit('changeBorderColor', this.borderCol)
      // var ele=document.getElementsByClassName('BorderControl')
      // console.log(ele.length)
      // for(var i=0;i<ele.length;i++){
      //    ele[i].style.borderColor =this.borderCol
      // }
    },
    headleChangeColor3: function() {
      //改变边框颜色
      console.log(this.modalCol)
      this.$store.commit('changeModalBackground', this.modalCol)
    },
    switchbg() {
      this.iscvs = true
    },
    switchbgimg() {
      this.bgimgUrl = '/bgimg/bg2.jpg'
      this.iscvs = false
    },
    getUrlParam(name) {
      // console.log(name + '返回参数')
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)') //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg) //匹配目标参数
      if (r != null) return unescape(r[2])
      return null //返回参数值
    },
    isBoolean(a) {
      if (a == 'true') {
        return true
      } else if (a == 'false') {
        return false
      } else {
        return null
      }
    },
    cvs() {
      'use strict'
      var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        w = (canvas.width = window.innerWidth),
        h = (canvas.height = window.innerHeight),
        hue = 217,
        stars = [],
        count = 0,
        maxStars = 1600 //星星数量

      var canvas2 = document.createElement('canvas'),
        ctx2 = canvas2.getContext('2d')
      canvas2.width = 100
      canvas2.height = 100
      var half = canvas2.width / 2,
        gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
      gradient2.addColorStop(0.025, '#CCC')
      gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
      gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
      gradient2.addColorStop(1, 'transparent')

      ctx2.fillStyle = gradient2
      ctx2.beginPath()
      ctx2.arc(half, half, half, 0, Math.PI * 2)
      ctx2.fill()

      // End cache

      function random(min, max) {
        if (arguments.length < 2) {
          max = min
          min = 0
        }

        if (min > max) {
          var hold = max
          max = min
          min = hold
        }

        return Math.floor(Math.random() * (max - min + 1)) + min
      }

      function maxOrbit(x, y) {
        var max = Math.max(x, y),
          diameter = Math.round(Math.sqrt(max * max + max * max))
        return diameter / 2
        //星星移动范围，值越大范围越小，
      }

      var Star = function() {
        this.orbitRadius = random(maxOrbit(w, h))
        this.radius = random(60, this.orbitRadius) / 8
        //星星大小
        this.orbitX = w / 2
        this.orbitY = h / 2
        this.timePassed = random(0, maxStars)
        this.speed = random(this.orbitRadius) / 5000000
        //星星移动速度
        this.alpha = random(2, 10) / 10

        count++
        stars[count] = this
      }

      Star.prototype.draw = function() {
        var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
          y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
          twinkle = random(10)

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05
        }

        ctx.globalAlpha = this.alpha
        ctx.drawImage(
          canvas2,
          x - this.radius / 2,
          y - this.radius / 2,
          this.radius,
          this.radius
        )
        this.timePassed += this.speed
      }

      for (var i = 0; i < maxStars; i++) {
        new Star()
      }

      function animation() {
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 0.5 //尾巴
        ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)'
        ctx.fillRect(0, 0, w, h)

        ctx.globalCompositeOperation = 'lighter'
        for (var i = 1, l = stars.length; i < l; i++) {
          stars[i].draw()
        }

        window.requestAnimationFrame(animation)
      }

      animation()
    }
  },
  components: {
    Button,
    Modal,
    Switchs: Switch,
    Upload,
    sortable,
    dragbar,
    customsortable,
    cvs,
    Dropdown,
    Icon,
    DropdownMenu,
    DropdownItem,
    Imgload
  }
}
</script>

<style lang="scss">
.m-colorPicker .colorBtn[data-v-11842410] {
  width: 13px;
  height: 10px;
}
.li_style {
  list-style-type: none;
}
.ivu-modal-body {
  font-size: 15px;
}
.sInput {
  margin-left: 10px;
  padding: 0 10px;
  border-radius: 5px;
  border: 0;
  outline: 0;
  width: 370px;
  height: 40px;
}
.container {
  margin: 0 auto;
  min-height: 100vh;
  background: #021d3d;
  display: flex;
  text-align: center;
  .m-colorPicker {
    border: 1px solid #fff;
  }
  .m-colorPicker .box {
    width: 215px;
    left: -196px;
    margin-top: 5px;
    z-index: 99999;
  }
  .cont {
    // margin-top: 80px;
    width: 100%;
  }
  .header {
    background: url('/bgimg/hearder.png') center no-repeat;
    background-size: auto 40%;
    //background-image: url("/hearder.png");
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 999;
    h5 {
      line-height: 50px;
      font-size: 18px;
      color: #fff;
    }
    .ivu-select {
      width: auto;
    }
    .btn {
      float: right;
      padding-right: 15px;
      margin-top: -50px;
      button {
        background-color: transparent;
        color: inherit;
        border: none;
        margin-right: 10px;
      }
      .saveLD {
        cursor: pointer;
      }
      .saveLD:hover {
        color: #fff;
      }
      .skin-modal {
        position: absolute;
        top: 23px;
        right: 83px;
        border: 1px solid #006bd0;
        width: 96px;
        text-align: left;
        padding: 5px 10px;
        margin-left: 25px;
        background-color: rgba(0, 0, 0, 0.5);
        li {
          line-height: 20px;
          cursor: pointer;
        }
      }
    }
    .sceneSelect {
      width: 60px;
      height: 16px;
      padding: 0;
      margin-right: 18px;
    }
    .scene-modal {
      position: absolute;
      top: 23px;
      right: 12px;
      border: 1px solid #006bd0;
      width: 70px;
      padding: 10px;
      margin-left: 20px;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
.render {
  button {
    display: none;
  }
  &:hover .sceneSel {
    display: block !important;
    cursor: pointer;
  }
}
.upImg {
  .ivu-upload {
    display: flex;
    justify-content: center;

    .ivu-upload-select {
      width: 100px;
      height: 32px;
    }
  }
}
//背景图片素材列表样式
.bgImgList {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 18%;
      margin: 10px 7px;
      position: relative;
      p {
        text-align: center;
        span {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 1px solid #ccc;
          vertical-align: text-top;
          margin-left: 10px;
          &.selbg {
            background: #39fde2;
          }
        }
      }
      img {
        display: block;
        width: 100%;
        height: 80px;
        box-sizing: border-box;
        &.dashbder {
          border: 2px dashed red;
        }
      }
      .trash {
        position: absolute;
        bottom: 0;
        right: 0;
        color: red;
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  .uploadImg {
    display: block;
    .ivu-upload {
      width: 100%;
      height: 80px;
    }
    ul {
      display: block;
      width: 100%;
      height: 20px;
      margin: 0;
    }
    .ivu-upload-list-file {
      display: '';
    }
  }
}
</style>
