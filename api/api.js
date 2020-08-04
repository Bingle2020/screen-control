import axios from 'axios'

//设置默认请求延时
axios.defaults.timeout = 20000


//楼栋出入统计(柱状图)
export const requestDoorTotalOpenRecord=params=>{
  return axios.get(`${base}/Elevator/Module/DoorTotalOpenRecord`,{params:params}).then(res=>res.data);
}

//刷卡开门&电梯外招共用接口(折线图)
export const requestDoorOpenRecord=params=>{
  return axios.get(`${base}/Elevator/Module/DoorOpenRecord`,{params:params}).then(res=>res.data);
}
//门禁设备状态(饼图)
export const requestDoorDeviceState=params=>{
  return axios.get(`${base}/Elevator/Module/DoorDeviceState`,{params:params}).then(res=>res.data);
}

//授权卡类型统计(柱状图)
export const requestDoorAuthorizeType=params=>{
  return axios.get(`${base}/Elevator/Module/DoorAuthorizeType`,{params:params}).then(res=>res.data);
}

//梯控控制器设备状态(饼图)
export const requestEleDeviceState=params=>{
  return axios.get(`${base}/Elevator/Module/EleDeviceState`,{params:params}).then(res=>res.data);
}


