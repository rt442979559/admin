import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)


//设置拦截器
axios.interceptors.request.use(config => {
  // console.log(config);
  //挂载Authorization 请求头
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.filter('dataFormat',function(originVal){
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate() + '').padStart(2,'0')

  const hh = (dt.getHours() + '').padStart(2,'0')
  const mm = (dt.getMinutes() + '').padStart(2,'0')
  const ss = (dt.getSeconds() + '').padStart(2,'0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
