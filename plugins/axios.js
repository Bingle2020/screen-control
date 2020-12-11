import axios from 'axios'
import Vue from 'vue';

// let options = {}
// if (process.server) {
//   options.baseURL = ''
// }
//
// let http = axios.create(options)
//
// export default http
// 设置baseURL
axios.defaults.baseURL = 'http://127.0.0.1:8080'
    // 创建axios对象，暴露
export default axios.create()