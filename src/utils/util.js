// 返回唯一标识UID
let uidIndex = 0;
export const getUID = () => {
  return `${new Date().getTime()}-${++uidIndex}`;
};

// 自定义颜色数组
export const customColors = () => {
  return [
    "#B27DFF",
    "#3F9BFF",
    "#44DBFF",
    "#50C3AD",
    "#9CFFB6",
    "#F6F837",
    "#F8BE45",
    "#FF985F",
    "#FF7373",
    "#FF9EC0",
    "#BFBFBF",
  ];
};

// 是否是对象Object
export const isObject = (value) => {
  const type = typeof value;
  return value !== null && (type === "object" || type === "function");
};

// 深拷贝对象
export const deepCopy = (target) => {
  if (!target || typeof target != "object") {
    return target;
  }
  return JSON.parse(JSON.stringify(target));
};

// 深合并数据 （Object.assign不能深合并）
export const deepMerge = (source, other) => {
  if (!isObject(source) || !isObject(other)) {
    return other === undefined ? source : other;
  }
  return Object.keys({ ...source, ...other }).reduce(
    (res, key) => {
      res[key] = deepMerge(source[key], other[key]);
      return res;
    },
    Array.isArray(source) ? [] : {}
  );
};

export const isRangeIn = (value, maxnum, minnum) => {
  const valueNum = parseFloat(value);
  if (valueNum <= maxnum && valueNum >= minnum) {
    return true;
  }
  return false;
};

// 回去Dom属性值 ruleCallback:返回Boolean值 可定制筛选规则
export const getElementAttribute = (target, ruleCallback) => {
  if (!target) {
    return;
  }
  const attributeNames = target.getAttributeNames();
  const item = attributeNames
    .filter((name) => {
      const flag = ruleCallback ? ruleCallback(name) : true;
      return flag;
    })
    .reduce((pre, name) => {
      const key = name.slice(2, name.length);
      const value = target.getAttribute(name);
      pre[key] = value;
      return pre;
    }, {});
  return item;
};

/**
 *
 * @param {Element} targets 目标元素
 * @param {Object} option 配置项
 *    targetWidth: 目标宽度；
 *    targetHeight: 目标高度；
 *    fitParent: Boolean 是否随之更新父元素尺寸；
 *    originWidth: 初始宽度
 *    originHeight: 初始高度
 *
 */
export const fitResizeElement = (targets, option) => {
  if (!targets || targets.length == 0) {
    return;
  }
  // 系统整体缩放
  const {
    targetWidth = 0,
    targetHeight = 0,
    fitParent = 0,
    originWidth = 0,
    originHeight = 0,
  } = option;

  const wScale = targetWidth / originWidth;
  const hScale = targetHeight / originHeight;
  const scale = Math.min(hScale, wScale);
  const scalePointer = Math.round(scale * 100) / 100;
  targets.forEach((target) => {
    target.style.transform = `scale(${scalePointer},${scalePointer})`;
    target.style.transformOrigin = `center center`;
    target.style.width = `${originWidth}px`;
    target.style.height = `${originHeight}px`;
    if (fitParent) {
      //获取div放大(缩小)后的宽度
      // 获取div padding
      const parentStyle = getComputedStyle(target.parentElement);
      target.parentElement.style.width = `${
        parseInt(target.getBoundingClientRect().width) +
        1 +
        parseFloat(parentStyle["paddingLeft"]) +
        parseFloat(parentStyle["borderLeft"]) +
        parseFloat(parentStyle["borderRight"]) +
        parseFloat(parentStyle["paddingRight"])
      }px`;
      target.parentElement.style.height = `${
        parseInt(target.getBoundingClientRect().height) +
        1 +
        parseFloat(parentStyle["paddingTop"]) +
        parseFloat(parentStyle["borderTop"]) +
        parseFloat(parentStyle["borderBottom"]) +
        parseFloat(parentStyle["paddingBottom"])
      }px`;
    }
  });
};

// 生成范围内随机数
export const randomNum = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// 千分位分割
export const format = (n) => {
  let num = n.toString();
  let len = num.length;
  if (len <= 3) {
    return num;
  } else {
    let temp = "";
    let remainder = len % 3;
    if (remainder > 0) {
      // 不是3的整数倍
      return `${num.slice(0, remainder)},${num
        .slice(remainder, len)
        .match(/\d{3}/g)
        .join(",")},${temp}`;
    } else {
      // 3的整数倍
      return num.slice(0, len).match(/\d{3}/g).join(",") + temp;
    }
  }
};

// 数组乱序
export const arrScrambling = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
    [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
  }
  return arr;
};

// 函数防抖
export const debounce = (fn, wait) => {
  let timer = null;

  return function () {
    let context = this,
      args = arguments;

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
};

// 函数节流
export const throttle = (fn, delay) => {
  let curTime = Date.now();

  return function () {
    let context = this,
      args = arguments,
      nowTime = Date.now();

    if (nowTime - curTime >= delay) {
      curTime = Date.now();
      return fn.apply(context, args);
    }
  };
};

// 获取URL参数
export const getUrlParam = () => {
  let urlString = window.location.search;
  if (urlString && urlString.length > 1) {
    let paramString = urlString.substring(1);
    return paramString.split("&").reduce((re, cur) => {
      let params = cur.split("=");
      re[params[0]] = params[1];
      return re;
    }, {});
  }
  return {};
};

// 获取具体URL参数
export const getValueByUrlParam = (key = "", urlStr = location.href) => {
  return getUrlParam(urlStr)[key] || "";
};

// 数据脱敏
export const valueDesensitize = (str, frontLen, endLen) => {
  var len = str.length - frontLen - endLen;
  var xing = "";
  for (var i = 0; i < len; i++) {
    xing += "*";
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
};

// 日期格式化
export const formatDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  let o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + "";
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ("00" + str).substr(str.length)
      );
    }
  }
  return fmt;
};

export const browser = {
  versions: (function () {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      trident: u.indexOf("Trident") > -1, //IE内核
      presto: u.indexOf("Presto") > -1, //opera内核
      webKit: u.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
      gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") == -1, //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或者uc浏览器
      iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf("iPad") > -1, //是否iPad
      webApp: u.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
      weixin: u.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq", //是否QQ
    };
  })(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase(),
};

/**
 * 将base64转换为文件
 * @param dataurl   base64字符串
 * @param filename  文件名
 * @returns {*}
 */
export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

/**
 * 对图片进行旋转，压缩的方法，最终返回base64  渲染给img标签的src
 * @param img
 * @param fileType
 * @param orientation
 * @returns {string}
 */
export const compressImg = (img, fileType, orientation) => {
  var degree = 0,
    drawWidth,
    drawHeight,
    width,
    height;
  drawWidth = img.width;
  drawHeight = img.height;
  //以下改变一下图片大小
  var maxSide = Math.max(drawWidth, drawHeight);
  if (maxSide > 1024) {
    var minSide = Math.min(drawWidth, drawHeight);
    minSide = (minSide / maxSide) * 1024;
    maxSide = 1024;
    if (drawWidth > drawHeight) {
      drawWidth = maxSide;
      drawHeight = minSide;
    } else {
      drawWidth = minSide;
      drawHeight = maxSide;
    }
  }
  var canvas = document.createElement("canvas");
  canvas.width = width = drawWidth;
  canvas.height = height = drawHeight;
  var context = canvas.getContext("2d");
  //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
  if (browser.versions.ios) {
    switch (orientation) {
      //iphone横屏拍摄，此时home键在左侧
      case 3:
        degree = 180;
        drawWidth = -width;
        drawHeight = -height;
        break;
      //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
      case 6:
        canvas.width = height;
        canvas.height = width;
        degree = 90;
        drawWidth = width;
        drawHeight = -height;
        break;
      //iphone竖屏拍摄，此时home键在上方
      case 8:
        canvas.width = height;
        canvas.height = width;
        degree = 270;
        drawWidth = -width;
        drawHeight = height;
        break;
    }
  }
  //使用canvas旋转校正
  context.rotate((degree * Math.PI) / 180);
  context.drawImage(img, 0, 0, drawWidth, drawHeight);
  // 压缩0.5就是压缩百分之50
  var base64data = canvas.toDataURL(fileType, 0.5);
  canvas = context = null;
  return base64data;
};
