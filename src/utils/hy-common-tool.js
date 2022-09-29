/**
 * Created by licheng on 19/10/17.
 */
(function (global, factory) {
  //For CommonJS and CommonJS-like
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = global.document ?
      factory(global, true) :
      function (w) {
        if (!w.document) {
          throw new Error("previewImage requires a window with a document");
        }
        return factory(w);
      };
  } else {
    factory(global);
  }
})(typeof window !== "undefined" ? window : this, function (window) {

  /**
   * 时间格式化
   * @param fmt  例：new Date().Format('yyyy-MM-dd HH:mm:ss')
   * @returns {*}
   * @constructor
   */
  function dateFormat (date, fmt) {
    if (!date || !fmt) {
      return;
    }
    var o = {
      "M+": date.getMonth() + 1,//月份
      "d+": date.getDate(),//日
      "H+": date.getHours(),//小时
      "m+": date.getMinutes(),//分
      "s+": date.getSeconds(),//秒
      "q+": Math.floor((date.getMonth() + 3) / 3),//季度
      "S+": date.getMilliseconds()//毫毛
    };
    if (new RegExp("(y+)").test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  };


  /**
   * 获取链接参数 公用方法
   */
  (function ($) {
    $.getUrlParam = function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = decodeURI(window.location.search).substr(1).match(reg);
      if (r != null) {
        var a = r[2].replace(/<.*>/, "");
        var b = a.replace(/<|>|\'|\"/g, "");
        return unescape(b);
      } else {
        return null;
      }

    }
  })(jQuery);

  //判断设备
//判断访问终端
  var browser = {
    versions:function(){
      var u = navigator.userAgent, app = navigator.appVersion;
      return {
        trident: u.indexOf('Trident') > -1, //IE内核
        presto: u.indexOf('Presto') > -1, //opera内核
        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
        iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
        iPad: u.indexOf('iPad') > -1, //是否iPad
        webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
        weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
        qq: u.match(/\sQQ/i) == " qq" //是否QQ
      };
    }(),
    language:(navigator.browserLanguage || navigator.language).toLowerCase()
  }


  /**
   * AES 参数加密-解密
   * 使用前
   */

  //常规项目引入 <script src="js/hy-js/crypto-js/crypto-js.js"></script>
  //var CryptoJS = require("crypto-js");  //webpack项目释放这行代码
  // 参数加密
  const crypto_key = "a708765a20d14fda", crypto_iv = "0123456789abcdef";

  function hy_encrypt(params) {
    var CryptoJS = require("crypto-js");

    var word = window.JSON.stringify(params);
    var key = CryptoJS.enc.Utf8.parse(crypto_key);
    var iv = CryptoJS.enc.Utf8.parse(crypto_iv);
    var encrypted = CryptoJS.AES.encrypt(word, key, {
      iv: iv,
      padding: CryptoJS.pad.ZeroPadding,
      mode: CryptoJS.mode.CBC
    });
    return encrypted.toString();
  }

  // result数据解密
  function hy_decrypt(word) {
    var CryptoJS = require("crypto-js");

    var key = CryptoJS.enc.Utf8.parse(crypto_key);
    var iv = CryptoJS.enc.Utf8.parse(crypto_iv);
    var decrypted = CryptoJS.AES.decrypt(word, key, {iv: iv, padding: CryptoJS.pad.ZeroPadding});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  /**
   * 3DES 加密-解密
   * @param str
   * @returns {boolean}
   */
  var des_key = '267ac2ed67f292ff77c4a0b8', des_iv = '00000000';
  //3DES加密 Pkcs7填充方式
  function hy_encryptBy3DES(params){
    var CryptoJS = require("crypto-js");
    var data = window.JSON.stringify(params);
    var keyHex = CryptoJS.enc.Utf8.parse(des_key);
    var cipher = CryptoJS.TripleDES.encrypt(data, keyHex, {
      iv: CryptoJS.enc.Utf8.parse(des_iv),
      mode: CryptoJS.mode.CBC
    });
    return cipher.toString();
  }
  //3DES解密
  function hy_decryptBy3DES(data){
    var CryptoJS = require("crypto-js");
    var keyHex = CryptoJS.enc.Utf8.parse(des_key);
    // direct decrypt ciphertext
    var decrypted = CryptoJS.TripleDES.decrypt(data, keyHex, {
      iv: CryptoJS.enc.Utf8.parse(des_iv),
      mode: CryptoJS.mode.CBC
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }



  //==============================================================================================================//
  //=================================================正则表达式相关=================================================//
  //==============================================================================================================//
  // 校验是否为手机号(1+10位数字)
  function checkMobilePhone (str) {
    var reg = /^(1\d{10})$/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效身份证(15位或18位带X)
  function checkIDCardNo (str) {
    //第一代身份证15位
    var reg1 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/;
    //第一代身份证18位
    var reg2 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (reg1.test(str) || reg2.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效Email
  function checkEmail (str) {
    var reg = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效密码(26个字母大小写+数字+下划线)
  function checkValidPassword (str) {
    var reg = /^[A-Za-z0-9_]+$/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效营业执照号(社会信用统一代码)
  function checkusinessLicense (str) {
    var reg1 = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
    var reg2 = /^\d{13}$/
    if (reg1.test(str) || reg2.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否全部为数字s
  function checkAllNumber (str) {
    var reg = /^\d+$/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效url
  function checkValidURL (str) {
    if (str && str.startsWith('http')) {
      return true;
    }
    return false;
  }


  //==============================================================================================================//
  //=================================================字符串处理相关=================================================//
  //==============================================================================================================//
  //判断是否为某类型 （type值Number、String、Object、Function、Undefined、Null）
  function isType (str, type) {
    return (Object.prototype.toString.call(str)=="[object "+type+"]");
  }

  // 判断是否为有效字符串
  function isValidString (str) {
    if (!isType(str, 'String')) {
      return false;
    }

    if (str && str.length>0) {
      return true;
    }
    return false;
  }

  /**
   * 将字符串某几位脱密
   * @param str
   * @param start 开始位置
   * @param len   隐藏的长度
   * @returns {string}
   */
  function hiddenString (str,start,len) {
    var xing = '';
    for (var i=0;i<len;i++) {
      xing+='*';
    }
    return str.substring(0,start)+xing+str.substring(start+len);
  }


  //==============================================================================================================//
  //==================================================文件解析相关==================================================//
  //==============================================================================================================//

  /**
   * 解析XML字符串
   * @param xmlstr
   * @returns {object}
   */
  function parseXMLStr (xmlstr) {
    //wanning 引入jquery
    //require('./jquery.xml2json.js');

    var json_obj = $.xml2json(xmlstr);
    return json_obj;
  }


  /**
   * 解析Excel、CSV文件
   * @param file 【Blob】文件格式（远程文件先下载再解析）
   * @param callback

   //常规项目引入 <script src="xlsx/xlsx.min.js"></script>
   //var XLSX = require("xlsx");  //webpack项目释放这行代码
   */
  function parseSheetFile (file, callback) {
    //var XLSX = require('xlsx');

    var rABS = false; //是否将文件读取为二进制字符串
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      var wb;
      if(rABS) {
        wb = XLSX.read(btoa(fixdata(data)),{
          type: 'base64'
        });
      } else {
        wb = XLSX.read(data,{
          type: 'binary'
        });
      }

      var a = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      callback(a);
    };

    if(rABS) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }


  //==============================================================================================================//
  //===================================================H5定位相关==================================================//
  //==============================================================================================================//
  /**
   * 使用H5原生API进行定位（返回WGS84坐标s）
   * 1、要想iOS、Android都支持，需要页面访问带https（无https情况下，部分安卓机型可以定位）。
   * 2、在https的页面中，无法混用http的接口，所以要求接口也支持https，访问的地图等服务也要支持https。
   */
  function getGpsInfo (onLocateSuccess, onLocateError) {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(onLocateSuccess , onLocateError);
    }else{
      onLocateError({code: "EXPLOER_NONSUPPORT", EXPLOER_NONSUPPORT: "EXPLOER_NONSUPPORT"});
      //("您的浏览器不支持使用HTML 5来获取地理位置服务");
    }
  }


  //==============================================================================================================//
  //=================================================多媒体处理相关=================================================//
  //==============================================================================================================//
  /**
   * 响应图片选取
   * @param e
   * @param callback
   */
  function onFileUpload (e, callback) {
    var EXIF = require('exif-js/exif.js');
    //获取图片
    var  that = this;
    var files = e.target.files;
    if (files.length <= 0) {
      return;
    }
    var file = files[0];
    //判断拍摄方向，
    EXIF.getData(file,function(){
      that.orientation = EXIF.getTag(this,'Orientation');
    });
    // 接受 jpeg, jpg, png 类型的图片
    if (!/\/(?:jpeg|jpg|png)/i.test(file.type)){
      return;
    }
    var reader = new FileReader();
    reader.onload = function() {
      var result = this.result;
      var img =  new Image();
      //进行图片的渲染
      img.onload = function() {
        //图片旋转压缩处理后的base64
        var compressedDataUrl = compressImg(img,file.type, that.orientation);
        //渲染到img标签上
        callback({url: compressedDataUrl, name: file.name});
        img = null;
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  }


  /**
   * 对图片进行旋转，压缩的方法，最终返回base64  渲染给img标签的src
   * @param img
   * @param fileType
   * @param orientation
   * @returns {string}
   */
  function compressImg (img, fileType, orientation) {
    var degree=0,drawWidth,drawHeight,width,height;
    drawWidth=img.width;
    drawHeight=img.height;
    //以下改变一下图片大小
    var maxSide = Math.max(drawWidth, drawHeight);
    if (maxSide > 1024) {
      var minSide = Math.min(drawWidth, drawHeight);
      minSide = minSide / maxSide * 1024;
      maxSide = 1024;
      if (drawWidth > drawHeight) {
        drawWidth = maxSide;
        drawHeight = minSide;
      } else {
        drawWidth = minSide;
        drawHeight = maxSide;
      }
    }
    var canvas = document.createElement('canvas');
    canvas.width=width=drawWidth;
    canvas.height=height=drawHeight;
    var context=canvas.getContext('2d');
    //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
    if(browser.versions.ios){
      switch(orientation){
        //iphone横屏拍摄，此时home键在左侧
        case 3:
          degree=180;
          drawWidth=-width;
          drawHeight=-height;
          break;
        //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
        case 6:
          canvas.width=height;
          canvas.height=width;
          degree=90;
          drawWidth=width;
          drawHeight=-height;
          break;
        //iphone竖屏拍摄，此时home键在上方
        case 8:
          canvas.width=height;
          canvas.height=width;
          degree=270;
          drawWidth=-width;
          drawHeight=height;
          break;
      }
    }
    //使用canvas旋转校正
    context.rotate(degree*Math.PI/180);
    context.drawImage(img,0,0,drawWidth,drawHeight);
    // 压缩0.5就是压缩百分之50
    var base64data = canvas.toDataURL(fileType, 0.5);
    canvas = context = null;
    return base64data;
  }

  /**
   * 将base64转换为文件
   * @param dataurl   base64字符串
   * @param filename  文件名
   * @returns {*}
   */
  function dataURLtoFile (dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  /**
   * 将base64转换为Blob格式
   * @param dataurl
   * @returns {*}
   */
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  /**
   * 下载文件
   * @param url 文件地址【远程地址、URL】
   * @param name
   */
  function downloadFile(url,name){
    var a = document.createElement("a")
    a.setAttribute("href",url)
    a.setAttribute("download",name)
    a.setAttribute("target","_blank")
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    a.dispatchEvent(clickEvent);
  }

  /**
   * 下载文件
   * @param base64
   * @param name
   */
  function downloadFileByBase64(base64,name){
    var myBlob = dataURLtoBlob(base64)
    var myUrl = URL.createObjectURL(myBlob)
    downloadFile(myUrl,name)
  }


  /**
   * 生成浏览器唯一标识
   * 可用于访问次数统计标识
   * npm install fingerprintjs2
   * npm install md5
   */
  function generateUDID (callback) {
    //var Fingerprint2 = require('fingerprintjs2')
    //var md5 = require('md5');

    var option = {
      // 配置项（可选）
      excludeSessionStorage: true, // 排除会话存储用户的浏览器支持
      excludeOpenDatabase: true, // 排除式用户浏览器的支持
      excludeIndexedDB: true, // 排除IndexedDB用户浏览器的支持
      excludeLanguage: true, // 排除浏览器的语言
      userAgent: true, // 用户代理，包含浏览器版本号
    }

    if (window.requestIdleCallback) {
      requestIdleCallback(function () {
        new Fingerprint2.get(option,function (components) {
          //console.log(components) // an array of components: {key: ..., value: ...}
          var udid = md5(new Buffer(JSON.stringify(components).toString("base64")));
          callback(udid);
        })
      })
    } else {
      setTimeout(function () {
        new Fingerprint2.get(option, function (components) {
          //console.log(components) // an array of components: {key: ..., value: ...}
          var udid = md5(new Buffer(JSON.stringify(components).toString("base64")));
          callback(udid);
        })
      }, 500)
    }
  }

  //==============================================================================================================//
  //=================================================数据持久化相关=================================================//
  //==============================================================================================================//
  /**
   * 【sessionStorage】
   * @param key
   * @param data
   */
  //存
  function saveDataToSession (key, data) {
    if (data) {
      window.sessionStorage.setItem(key, JSON.stringify(data));
    }
  }
  //取
  function getDataFromSession (key) {
    var str = window.sessionStorage.getItem(key);
    if (str && str.length>0 && str != 'undefined') {
      return window.JSON.parse(str);
    }
    return null;
  }
  //清除
  function clearSessionData (key) {
    window.sessionStorage.removeItem(key);
  }

  /**
   * 【localStorage】
   * @param key
   * @param data
   */
  //存
  function saveDataToLocal (key, data) {
    if (data) {
      window.localStorage.setItem(key, JSON.stringify(data));
    }
  }
  //取
  function getDataFromLocal (key) {
    var str = window.localStorage.getItem(key);
    if (str && str.length>0 && str != 'undefined') {
      return window.JSON.parse(str);
    }
    return null;
  }
  //清除
  function clearLocalData (key) {
    window.localStorage.removeItem(key);
  }


  /**
   * 动态加载js文件
   * @type {{tag: Function, ce: Function, js: Function}}
   */
  var loadscript = {
    //$$:function(id){return document.getElementById(id)},
    tag:function(element){return document.getElementsByTagName(element)},
    ce:function(element){return document.createElement(element)},
    js:function(url,callback)
    {
      var s = loadscript.ce('script');
      s.type = "text/javascript";
      s.onreadystatechange = ready;
      s.onerror = s.onload = callback;
      s.src = url;
      loadscript.tag('head')[0].appendChild(s);
      function ready(){
        if (s.readyState == 'loaded' || s.readyState == 'complete') {
          callback();
        }
      };
    }
  }

  /**
   * 拨打电话
   * @param phoneNumber
   */
  function makePhoneCall(phoneNumber) {
    var call = document.createElement('a');

    var url = "tel:"+phoneNumber;
    call.setAttribute("href",url)
    call.setAttribute("target","_blank")
    var clickEvent = document.createEvent("MouseEvents");
    clickEvent.initEvent("click", true, true);
    call.dispatchEvent(clickEvent);
  }
  
  /**
   * 根据经纬度计算距离
   * @param lat1
   * @param lng1
   * @param lat2
   * @param lng2
   * @returns {number}
   * @constructor
   */
  function getDistance(lat1, lng1, lat2, lng2){
    var radLat1 = lat1*Math.PI / 180.0;
    var radLat2 = lat2*Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var  b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
      Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  }

  var common_tool = {
    browser: browser,
    dateFormat: dateFormat,
    //加解密
    hy_encrypt: hy_encrypt,
    hy_decrypt: hy_decrypt,
    hy_encryptBy3DES: hy_encryptBy3DES,
    hy_decryptBy3DES: hy_decryptBy3DES,

    //正则表达式相关
    checkMobilePhone: checkMobilePhone,
    checkIDCardNo: checkIDCardNo,
    checkEmail: checkEmail,
    checkValidURL: checkValidURL,
    checkValidPassword: checkValidPassword,
    checkusinessLicense: checkusinessLicense,
    checkAllNumber: checkAllNumber,

    //字符串处理相关
    isType: isType,
    isValidString: isValidString,
    hiddenString: hiddenString,

    //文件解析
    parseXMLStr: parseXMLStr,
    parseSheetFile: parseSheetFile,

    //定位
    getGpsInfo: getGpsInfo,

    //多媒体相关
    onFileUpload: onFileUpload,
    compressImg: compressImg,
    dataURLtoFile: dataURLtoFile,
    dataURLtoBlob: dataURLtoBlob,
    downloadFile: downloadFile,
    downloadFileByBase64: downloadFileByBase64,

    generateUDID: generateUDID,

    //数据持久化相关
    saveDataToSession: saveDataToSession,
    getDataFromSession: getDataFromSession,
    clearSessionData: clearSessionData,
    saveDataToLocal: saveDataToLocal,
    getDataFromLocal: getDataFromLocal,
    clearLocalData: clearLocalData,

    loadscript: loadscript,
    makePhoneCall: makePhoneCall,
    getDistance: getDistance
  }


  window.common_tool = common_tool;
  // AMD loader
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return common_tool;
    });
  }

  return common_tool;

})
