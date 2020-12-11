import axios from 'axios'

//设置默认请求延时
axios.defaults.timeout = 20000


//(柱状图)
export const requestDoorTotalOpenRecord = params => {
    return axios.get(`${base}/Elevator/Module/DoorTotalOpenRecord`, { params: params }).then(res => res.data);
}

//(折线图)
export const requestDoorOpenRecord = params => {
        return axios.get(`${base}/Elevator/Module/DoorOpenRecord`, { params: params }).then(res => res.data);
    }
    //(饼图)
export const requestDoorDeviceState = params => {
    return axios.get(`${base}/Elevator/Module/DoorDeviceState`, { params: params }).then(res => res.data);
}

//(柱状图)
export const requestDoorAuthorizeType = params => {
    return axios.get(`${base}/Elevator/Module/DoorAuthorizeType`, { params: params }).then(res => res.data);
}

//(饼图)
export const requestEleDeviceState = params => {
    return axios.get(`${base}/Elevator/Module/EleDeviceState`, { params: params }).then(res => res.data);
}