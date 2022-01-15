import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth.js'
import heart from './modules/heart.js'
import tabbar from './modules/tabbar.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	modules: {
		auth,
		heart,
		tabbar
	}
})

export default store
