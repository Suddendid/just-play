/**
 *
 * @authors yangze (im.yangze@gmail.com)
 * @date    2021/10/15 上午10:43
 */

import store from "@/store";
import Vue from "vue";
import router from "@/router";
import { envFn } from "@/utils/conf";

/**
 * 大屏服务地址
 */
export const baseURL = envFn({
  development: "http://your.server.dev.com",
  testing: "http://your.server.testing.com",
  production: "http://your.server.com",
});

/**
 * 接口通用请求头
 */
export const baseHeaders = {
  "Content-Type": "application/json",
};

/**
 * 接口超时时间
 */
export const timeOut = 50000;

/**
 * 接口请求拦截
 * @param {*} config 请求配置
 * @returns
 */
export const requestIntercept = (config) => {
  if (config.login) {
    config.headers["userToken"] = "token";
  }
  return config;
};

/**
 * 接口失败拦截
 */
export const responseFailIntercept = ({ msg, status }) => {
  Vue.prototype.$message.error(msg);
};

/**
 * 登录过期处理
 * @param {*} data 返回数据
 */
export const loginExpiryIntercept = (data) => {
  Vue.prototype.$message.error("登录过期， 请重新登录");
  router.replace({ name: "Login" });
};

/**
 * 针对如果出现不同的平台提供的服务 设置ruleKey标记 用于校验接口返参
 */
export const verifyRuleKeys = {
  Geo: "Geo",
};

/**
 * 通过ruleKey 校验不同的返回拦截判断
 * 如果添加了verifyRuleKeys 需要在这边设置对应的校验规则
 * @param {*} key
 * @returns {
 *  success: {Function} // 是否成功
 *  successInfo： {Function} // 返回成功的数据
 *  loginExpiry: {Function} // 是否登录过期
 *  failureInfo: {Function} // 返回失败信息
 * }
 */
export const verifyRule = (key = "") => {
  switch (key) {
    case verifyRuleKeys.Geo:
      // 吉奥接口返回校验
      return geoRule();
      break;
  }
  // 默认接口返回校验
  return defaultRule();
};

/**
 * 默认校验规则
 * @returns
 */
export const defaultRule = () => {
  return {
    success: (data) => {
      return data.code == 200 || data.code == 0;
    },
    successInfo: (data) => {
      return data.result || data.data;
    },
    loginExpiry: (data) => {
      return data.code == 11002;
    },
    failureInfo: (data) => {
      return data;
    },
  };
};

/**
 * 吉奥规则
 */
/**
 * 默认校验规则
 * @returns
 */
export const geoRule = () => {
  return {
    success: (data) => {
      return true;
    },
    successInfo: (data) => {
      return data;
    },
    loginExpiry: (data) => {
      return false;
    },
    failureInfo: (data) => {
      return data;
    },
  };
};
