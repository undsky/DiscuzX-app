import store from '../index.js';

export default {
	state: {
		heart: null
	},
	getters: {

	},
	mutations: {
		setHeart(state, heart) {
			state.heart = heart.body
			const {
				replyInfo,
				atMeInfo,
				friendInfo,
				systemInfo
			} = heart.body
			store.commit('setMessageCount', replyInfo.count + atMeInfo.count + friendInfo.count + systemInfo.count)
		},
		clearHeart(state) {
			state.heart = null
			store.commit('setMessageCount', 0)
		}
	},
	actions: {

	}
}
