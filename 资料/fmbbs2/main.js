import Vue from 'vue'
import App from './App'

import api from './services/api.js'
import config from './services/config.js'
import tool from './services/tool.js'

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$config = config
Vue.prototype.$tool = tool

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
