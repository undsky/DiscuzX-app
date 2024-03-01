import store from '../index.js';

export default {
    state: {
        heart: null
    },
    getters: {},
    mutations: {
        setHeart(state, heart) {
            state.heart = heart.body;
            const { replyInfo, atMeInfo, friendInfo, systemInfo } = heart.body;
            store.commit(
                'setMessageCount',
                (replyInfo ? replyInfo.count : 0) + (atMeInfo ? atMeInfo.count : 0) + (friendInfo ? friendInfo.count : 0) + (systemInfo ? systemInfo.count : 0)
            );
        },
        clearHeart(state) {
            state.heart = null;
            store.commit('setMessageCount', 0);
        }
    },
    actions: {}
};
