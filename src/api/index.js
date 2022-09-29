const modulesFiles = require.context("./modules", true, /.js$/);
let modules = {};
modulesFiles.keys().forEach((key) => {
  modules = Object.assign({}, modules, modulesFiles(key));
});

export default {
  install: function (Vue, options) {
    const $use = (apis) => {
      if (!apis) return;
      const apiModule = Vue.prototype.$api;
      Vue.prototype.$api = { ...apiModule, ...apis };
    };
    Vue.prototype.$api = { ...modules, $use };
  },
};
