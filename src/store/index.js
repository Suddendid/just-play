import Vue from "vue";
import Vuex from "vuex";
// 解决刷新后数据清空问题
import createPersistedState from "vuex-persistedstate";

//挂载Vuex
Vue.use(Vuex);

//创建VueX对象
const store = new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: sessionStorage,
    }),
  ],
  state: {
    userInfo: null, // 登录信息
  },
  getters: {
    /**
     * 是否登录
     */
    isLogin(state) {
      return (
        state.userInfo &&
        state.userInfo.token &&
        state.userInfo.token.length > 0
      );
    },
    /**
     * 登录token
     */
    loginToken(state, getters) {
      return getters.isLogin ? state.userInfo.token : "";
    },
  },
  mutations: {
    /**
     * 设置用户信息
     */
    setUserInfo(state, val) {
      state.userInfo = val;
    },
    /**
     * 更新用户信息字段
     * @param {*} state
     * @param {*} n {key:value}
     */
    updateUserInfo(state, n) {
      let userInfo = state.userInfo;
      Object.keys(n).forEach((key) => {
        userInfo[key] = n[key];
      });
      state.userInfo = userInfo;
    },
    /**
     * 注销
     * @param {*} state
     * @param {*} n
     */
    loginOut(state, n) {
      state.userInfo = null;
    },
  },
});

export default store;
