<template>
  <div class="cont-box">
    <div class="drag-sidebar">
      <h5>拖拽元素</h5>
      <ul v-for="item in tagTableLeft" :key="item.id" >
        <li draggable="true" @dragstart="drag(item.id)">{{item.name}}</li>
      </ul>
    </div>
    <div  class="drag-content"  >
      <sceneone :data="activeid"  v-if="id == '1'" />
      <scenetwo  v-if="id == '2'" />
      <custom row="10" col="10" wid="1100" high="500" v-if="id=='3'"/>
    </div>
  </div>
</template>
<script>
 import sceneone from '~/components/scene/sceneone.vue'
 import scenetwo from '~/components/scene/scenetwo.vue'
 import custom from '~/components/scene/custom.vue'
export default {
  props: ['id'],
  data(){
    return{
      activeid:'',
      tagTableLeft:[
        {id:'001',name:'柱状图'},
        {id:'002',name:'饼图'},
        {id:'003',name:'折线图'},
        {id:'004',name:'分部图'},
      ]
    }
  },
    components: {
    sceneone,
    scenetwo,
    custom
  },
  methods:{
    drag(id){
     // ev.dataTransfer.setData("Text",ev.target.id);
      console.log(id);
      this.activeid = id;
    }

  }
}
</script>
<style lang="scss">
.cont-box {
  display: flex;
  .drag-sidebar {
    width: 13%;
    border: 1px solid #00bef7;
    h5{
      background:#0096E0;
      color:#fff;
      line-height: 40px;
      font-weight: 100;
      font-size: 14px;
    }
    li {
      height: 36px;
      line-height: 36px;
      border: 1px solid #00bef7;
      margin: 20px 20px;
    }
  }
  .drag-content {
    width: 85%;
    margin-left: 10px;
    border: 1px solid #00bef7;
    padding: 10px;
  }
}
</style>