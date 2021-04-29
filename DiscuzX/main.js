import Vue from 'vue'
import App from './App'

// #ifdef H5
Vue.prototype.$wx = require('jweixin-module')
// #endif

import util from './common/util.js'
Vue.prototype.$util = util

import http from './common/request.js'
Vue.prototype.$http = http

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
