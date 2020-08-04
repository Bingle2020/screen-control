export const state = () => ({
  setting: false,
  row: 10,
  col: 20,
  showBar: null,
  borderColor: {
    borderColor: '#00BBF6'
  },
  modalBackground: {
    backgroundColor: '#041325'
  },
  sort: {
    left: 0,
    top: 0,
    padding: 0
  },
  //激活场景信息
  AScene: {
    id: 1,
    save: false,
    data: null
  },
  //打开的我的场景编号
  mySceneNO: null,
  //保存的场景
  savedScene: [
  // {
  //     id: 5,
  //     NO: 1588845120604,
  //     name: '会议',
  //     original: {
  //         W: ,
  //         H: ,
  //     }
  //     data: {
  //         grids: [],
  //         revert: []
  //     }
  // }
  ],
  layerData: {
  // '123123213': {
  //     title: '非诚勿扰',
  //     shape: 'pie',
  //     during: 30,
  //     refresh: 5,
  //     source: 'www.baidu.com',
  //     remarks: '注意，这不是演习!'
  // }
  },
  //固定图片
  imgs: [
    // {
    //   id: 1591752256952,
    //   title: '中国红',
    //   src: require('~/assets/bgImg/中国红.jpg'),
    //   seltd: false
    // },
    // {
    //   id: 1591752275658,
    //   title: '奇幻之夜',
    //   src: require('~/assets/bgImg/奇幻之夜.jpg'),
    //   seltd: false
    // },
    // {
    //   id: 1591752286255,
    //   title: '神秘塔罗',
    //   src: require('~/assets/bgImg/神秘塔罗.jpg'),
    //   seltd: false
    // },
    // {
    //   id: 1591752296555,
    //   title: '磅礴峰峦',
    //   src: require('~/assets/bgImg/磅礴峰峦.jpg'),
    //   seltd: false
    // },
    // {
    //   id: 1591752306547,
    //   title: '酷炫奥迪',
    //   src: require('~/assets/bgImg/酷炫奥迪.jpg'),
    //   seltd: false
    // }
  ],
  //用户自定义图片
  extraImg: [
    // {
    //   id: '20200610154310339_p7.jpg',
    //   title: 'p7',
    //   src: 'http://192.168.40.12:8089/Elevator/UploadFiles/20200610154310339_p7.jpg',
    //   seltd: false
    // }
  ],
  //场景背景匹配
  combine: {
    // '1591942094236': "http://192.168.40.12:8089/Elevator/UploadFiles/20200615103722647_p3.jpg",
    // '1591929292602': "http://192.168.40.12:8089/Elevator/UploadFiles/20200612093641072_p8.jpg",
    // '1591929314639': "http://192.168.40.12:8089/Elevator/UploadFiles/20200612093641477_p7.jpg",
    // '1591929329563': "http://192.168.40.12:8089/Elevator/UploadFiles/20200612102124349_p11.webp",
    // '1591929346347': "http://192.168.40.12:8089/Elevator/UploadFiles/20200615103722647_p3.jpg"
  }
})

export const mutations = {
  //初始化场景-背景
  initSceneBg(state,o){
    state.combine = {...o}
  },
  //删除场景-背景
  rmComb(state,id){
    delete state.combine[id]
  },
  //修改场景-背景
  modifyComb(state,o){
    state.combine[o.id] = o.src
    state.combine = {...state.combine}
  },
  //加载云图片保存到extraImg
  loadUserImgs(state,arr){
    var iArr = []
    var eArr = []
    for(let i = 0,len = arr.length;i < len;i++){
      let str = arr[i].split('/')
      let fileName = str[str.length - 1]
      //获取是否有GD字符
      let GD = fileName.match(/[GD]{2}(\S*).(png|jpg|jpeg|webp)$/)
      let o = {}
      o.id = fileName
      o.src = arr[i]
      o.seltd = false
      if(GD != null){
        //有GD代表是固定图片
        o.title = GD[1]
        iArr.push(o)
      }
      else{
        //额外上传的图片
        o.title = fileName.match(/_(\S*).(png|jpg|jpeg|webp)$/)[1]
        eArr.push(o)
      }
    }
    state.imgs = [...iArr]
    state.extraImg = [...eArr]
  },
  //恢复imgs,extraImgs的原始状态
  recoverImgs(state) {
    state.imgs = state.imgs.map(item => {
      if (item.seltd == true) {
        item.seltd = false
      }
      return item
    })
    state.extraImg = state.extraImg.map(item => {
      if (item.seltd == true) {
        item.seltd = false
      }
      return item
    })
  },
  //修改imgs选择的状态
  modifyImgs(state, id) {
    var status = false
    state.imgs = state.imgs.map(item => {
      if (item.id == id) {
        item.seltd = !item.seltd
        status = true
      } else {
        item.seltd = false
      }
      return item
    })
    if (status) {
      state.extraImg = state.extraImg.map(item => {
        if (item.seltd == true) {
          item.seltd = false
        }
        return item
      })
    }
  },
  //修改extraimgs选择状态
  modifyExtraImgs(state, id) {
    var status = false
    state.extraImg = state.extraImg.map(item => {
      if (item.id == id) {
        item.seltd = !item.seltd
        status = true
      } else {
        item.seltd = false
      }
      return item
    })
    if (status) {
      state.imgs = state.imgs.map(item => {
        if (item.seltd == true) {
          item.seltd = false
        }
        return item
      })
    }
  },
  //初始化配置信息
  setLayD(state, o) {
    if (JSON.stringify(o) === '{}') {
      return
    } else {
      state.layerData = {
        ...o
      }
    }
  },
  //添加配置信息
  addLayD(state, o) {
    state.layerData[o.id] = {
      ...o.data
    }
  },
  //修改配置信息
  modifyLayD(state, id, newInfo) {
    state.layerData[id] = {
      ...state.layerData[id],
      ...newInfo
    }
  },
  //删除某配置信息
  rmLayD(state, id) {
    delete state.layerData[id]
  },
  alterSetting(state, val) {
    state.setting = val
  },
  changeExtraScene(state, val) {
    state.savedScene = state.savedScene.map(item => {
      if (item.NO == state.mySceneNO) {
        item.original.W = val.W
        item.original.H = val.H
        item.data.grids = [...val.grids]
        item.data.revert = [...val.revert]
      }
      return item
    })
  },
  changeBar(state, val) {
    state.showBar = val
  },
  changeBorderColor(state, val) {
    state.borderColor = val
    console.log(val)
  },
  changeModalBackground(state, val) {
    state.modalBackground = val
  },
  rmExtraScene(state, n) {
    for (let i = 0, len = state.savedScene.length; i < len; i++) {
      if (state.savedScene[i].NO == n) {
        state.savedScene.splice(i, 1);
        console.log("删除成功!")
        break
        return
      }
    }
  },
  alterMySceneNO(state, val) {
    state.mySceneNO = val
  },
  addScene(state, val) {
    state.savedScene.push(val)
  },
  setScene(state, val) {
    state.savedScene = val
  },
  clearData(state) {
    state.AScene.data = null
  },
  transId(state, val) {
    state.AScene.id = val
  },
  transData(state, val) {
    state.AScene.data = val
  },
  alterLeft(state, val) {
    state.sort.left = val
  },
  alterTop(state, val) {
    state.sort.top = val
  },
  alterPad(state, val) {
    state.sort.padding = val
  }
}

export const getters = {
  getCombine(state){
    return state.combine
  },
  getExtraImg(state) {
    return state.extraImg
  },
  getImgs(state) {
    return state.imgs
  },
  getLayData(state) {
    return state.layerData
  },
  getSet(state) {
    return state.setting
  },
  getRow(state) {
    return state.row
  },
  getCol(state) {
    return state.col
  },
  getBar(state) {
    return state.showBar
  },
  getModalBackground(state) {
    return state.modalBackground
  },
  getBorderColor(state) {
    return state.borderColor
  },
  getMySceneNo(state) {
    return state.mySceneNO
  },
  getSdScene(state) {
    return state.savedScene
  },
  getScene(state) {
    return state.AScene
  },
  getSort(state) {
    return state.sort
  }
}
