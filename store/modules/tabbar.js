export default {
	state: {
		tabbar: [{
			iconPath: "home",
			selectedIconPath: "home-fill",
			text: '首页',
			pagePath: "/pages/index/index"
		}, {
			iconPath: "grid",
			selectedIconPath: "grid-fill",
			text: '社区',
			pagePath: "/pages/board/board"
		}, {
			iconPath: "plus-circle-fill",
			selectedIconPath: "plus-circle-fill",
			text: '发帖',
			midButton: true
		}, {
			iconPath: "chat",
			selectedIconPath: "chat-fill",
			text: '消息',
			pagePath: "/pages/message/message"
		}, {
			iconPath: "account",
			selectedIconPath: "account-fill",
			text: '我的',
			pagePath: "/pages/user/user"
		}]
	},
	getters: {

	},
	mutations: {
		setMessageCount(state, count) {
			const _tabbar = JSON.parse(JSON.stringify(state.tabbar))
			_tabbar[3].count = count
			state.tabbar = _tabbar
		}
	},
	actions: {

	}
}
