import { debounce } from "./util";
// 设计稿宽度值
export const viewDesignWidth =  1920;


// rem基准值
/**
 * 100vw = 1920px
 * 1px = 100 / 1920 vw
 * 100px = 100 / 1920 * 100 vw
 * 设定100 便于使用计算rem值 设计稿px / 100 = rem
 */
export const remRootValue = 100;

// 计算获取rem值
export const getRemUnit = () => {
  const clientWidth = document.documentElement.clientWidth;
  const scale = clientWidth / viewDesignWidth;
  return Math.max(scale, 0.25) * remRootValue;
};

// 通过rem计算实际fontSize
export const fontSize = (size) => {
  return (size / remRootValue) * getRemUnit();
};

// 设置root fonts-size
export const setRootFontSize = () => {
  const clientWidth = document.documentElement.clientWidth;
  document.documentElement.style.fontSize = `${getRemUnit()}px`;
  // document.body.style.fontSize = '16px'
  window.addEventListener("resize", () => {
    debounce(() => {
      document.documentElement.style.fontSize = `${getRemUnit()}px`;
    }, 100)
  });
};

setRootFontSize();
