<template>
  <div class="video-js">
    <Select v-show="!homeset" v-model="formSend.floorName" @on-change="getfloorName" style="width:auto;float:left;color:currentColor;position:absolute;left:0;z-index:9999">
      <Option :value="item.floorName" v-for="item in deviceList" v-bind:key="item.floorName">{{item.floorName}}</Option>
    </Select> 
  </div>
</template>
<script>
import { requestDoorAuthorizeType } from '~/api/api'
import axios from '~/plugins/axios'
export default {
  data() {
    return {
      formSend: {
        floorName: '11栋',
      },
      deviceList: [
        {
          floorName: '1栋',
        },
        {
          floorName: '2栋',
        },
        {
          floorName: '3栋',
        },
        {
          floorName: '4栋',
        },
        {
          floorName: '5栋',
        },
        {
          floorName: '6栋',
        },
        {
          floorName: '7栋',
        },
        {
          floorName: '9栋',
        },
        {
          floorName: '10栋',
        },
        {
          floorName: '11栋',
        },
        {
          floorName: '12栋',
        },
        {
          floorName: '13栋',
        },
        {
          floorName: '14栋',
        },
        {
          floorName: '22栋',
        },
        {
          floorName: '23栋',
        },
        {
          floorName: '24栋',
        },
        {
          floorName: '25栋',
        },
        {
          floorName: '26栋',
        },
        {
          floorName: '27栋',
        },
      ],
    }
  },
  computed: {
    homeset(){
      let o = this.$route.query
      return o.hasOwnProperty("allowEdit") == false && o.hasOwnProperty("homeset") == false
    }
  },
  methods: {
    getItemName() {
      console.log(this.formSend.floorName)
    //   this.deviceId = this.formSend.deviceId
    }
  }
}
</script>
<style lang="scss">
input{
  color:#214C74;
}
.ivu-select-single .ivu-select-selection {
  height: 30px;
}
.ivu-select-selection {
  background-color: transparent;
  .ivu-select-single .ivu-select-selection {
    border: 0;
  }
}
.ivu-select-dropdown {
  background-color: transparent;
  margin: 0;
  .ivu-select-item {
    color: currentColor;
    padding: 3px 6px;
    text-align: left;
  }
  .ivu-select-item-focus {
    background-color: transparent;
  }
  .ivu-select-item:hover {
    background-color: transparent;
    color: #00e7f2;
  }
}
</style>
