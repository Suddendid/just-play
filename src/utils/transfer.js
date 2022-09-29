import Vue from "vue";

/**
 * Vue组件转Dom
 * @param component vue组件
 * @param option 参数 （props）
 * @param element 需要绑定到的dom
 * @returns 
 */
export const VueComponetToElement = ({ component, option, element }) => {
  let componentConstructor = Vue.extend(component);
  let componentInstance = new componentConstructor({
    propsData: option.props
  });
  if (option.methods && Object.keys(option.methods).length > 0) {
    Object.keys(option.methods).forEach(element => {
      componentInstance[element] = option.methods[element];
    });
  }
  let el = element;
  if (!el) {
    el = document.createElement("div");
  }
  componentInstance.$mount(el);
  return el;
};
