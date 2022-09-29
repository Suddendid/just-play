export const K_REFRESH_ROUTE_PARAMS = "$_K_REFRESH_ROUTE_PARAMS";
export default {
  data() {
    return {};
  },
  mounted() {
    // 监听组件事件
  },
  methods: {
    // 主动触发事件
    $emitDelegateParams(params = {}) {
      sessionStorage.setItem(K_REFRESH_ROUTE_PARAMS, JSON.stringify(params));
    },
    // 接收事件回调 处理
    $delegateEventAction(params) {},
  },
  destroyed() {},
  // 进入路由时,恢复列表状态
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const routeParamString = sessionStorage.getItem(K_REFRESH_ROUTE_PARAMS);
      if (routeParamString && routeParamString.length > 0) {
        const routeParam = JSON.parse(routeParamString);
        if (!vm.$delegateEventAction(routeParam)) {
          sessionStorage.removeItem(K_REFRESH_ROUTE_PARAMS);
        }
      }
    });
  },
};
