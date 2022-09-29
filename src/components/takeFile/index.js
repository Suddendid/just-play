import TakeFile from "./Index.vue";

let takeFileInstance = null;
export default {
  install: function(Vue, option) {
    const TakeFileConstructor = Vue.extend(TakeFile);
    const getInstance = () => {
      if (takeFileInstance) {
        return takeFileInstance;
      }
      return new TakeFileConstructor({
        el: document.createElement("div")
      });
    };
    const intance = getInstance();
    document.body.appendChild(intance.$el); // 将元素append到页面上

    Vue.prototype.$takeFile = intance
  }
};
