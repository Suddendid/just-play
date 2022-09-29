/**
 *
 * @authors yangze (im.yangze@gmail.com)
 * @date    2021/10/15 上午10:43
 */

import Qs from "qs";
import axios from "axios";
import * as baseParam from "./baseParam";

axios.defaults.baseURL = baseParam.baseURL || undefined;

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response) {
    const { status, statusText, config, data } = response;
    if ((status >= 200 && status < 300) || status === 304) {
      const verifyRule = baseParam.verifyRule(config.verifyRuleKey);
      if (verifyRule.success(data)) {
        return Promise.resolve(verifyRule.successInfo(data));
      } else if (verifyRule.loginExpiry(data)) {
        baseParam.loginExpiryIntercept && baseParam.loginExpiryIntercept(data);
        return Promise.reject(data);
      } else {
        baseParam.responseFailIntercept &&
          baseParam.responseFailIntercept(verifyRule.failureInfo(data));
        return Promise.reject(verifyRule.failureInfo(data));
      }
    }
    baseParam.responseFailIntercept &&
      baseParam.responseFailIntercept({
        status,
        msg: codeMessage[status] || statusText,
      });
    return Promise.reject({
      status,
      msg: codeMessage[status] || statusText,
    });
  }
  baseParam.responseFailIntercept &&
    baseParam.responseFailIntercept({
      status: -404,
      msg: "网络异常",
    });
  // 异常状态下，把错误信息返回去
  return Promise.reject({
    status: -404,
    msg: "网络异常",
  });
}

/**
 * 全局请求扩展配置
 * 添加一个请求拦截器 （于transformRequest之前处理）
 */
const axiosRequest = {
  success: (config) => {
    return baseParam.requestIntercept
      ? baseParam.requestIntercept(config)
      : config;
  },
  error: (error) => Promise.reject(error),
};

/**
 * 全局请求响应处理
 * 添加一个返回拦截器 （于transformResponse之后处理）
 * 返回的数据类型默认是json，若是其他类型（text）就会出现问题，因此用try,catch捕获异常
 */
const axiosResponse = {
  success: (response) => {
    return checkStatus(response);
  },
  error: (error) => {
    const { response, code } = error;
    // 接口请求异常统一处理
    if (code === "ECONNABORTED") {
      // Timeout error
      console.log("Timeout error", code);
    }
    if (response) {
      // 请求已发出，但是不在2xx的范围
      // 对返回的错误进行一些处理
      return Promise.reject(checkStatus(response));
    } else {
      // 处理断网的情况
      return Promise.reject({
        status: -404,
        msg: "网络异常",
      });
    }
  },
};

axios.interceptors.request.use(axiosRequest.success, axiosRequest.error);
axios.interceptors.response.use(axiosResponse.success, axiosResponse.error);

/**
 * POST请求
 * @param {*} baseURL 服务地址
 * @param {*} url 请求地址
 * @param {*} data 请求参数 PS:content-type == application/json\multipart 时传参
 * @param {*} params 请求参数 PS:content-type == application/x-www-form-urlencoded 时传参
 * @param {*} headers 请求头
 * @param {*} verifyRuleKey 校验规则 baseParam中配置
 * @param {*} login 是否需要登录token
 *
 * @returns
 */
export const post = ({
  url = "",
  baseURL = undefined,
  data = null,
  params = null,
  headers = {},
  verifyRuleKey = "",
  login = true,
}) => {
  const config = {
    method: "post",
    url,
    baseURL,
    data: data,
    params: params,
    headers: {
      ...baseParam.baseHeaders,
      ...headers,
    },
    login: login,
    verifyRuleKey: verifyRuleKey,
    transformRequest: [
      function (data, headers) {
        // 对 data 进行任意转换处理
        const contentType = headers["Content-Type"];
        if (typeof contentType !== "undefined") {
          if (contentType.indexOf("multipart") !== -1) {
            return data;
          } else if (contentType.indexOf("json") !== -1) {
            return JSON.stringify(data);
          } else {
            return Qs.stringify(data);
          }
        }
        return data;
      },
    ],
    transformResponse: [
      function (data) {
        try {
          return JSON.parse(data);
        } catch (error) {
          return data;
        }
      },
    ],
  };
  return axios(config);
};

/**
 * GET请求
 * @param {*} baseURL 服务地址
 * @param {*} url 请求地址
 * @param {*} params 请求参数
 * @param {*} headers 请求头
 * @param {*} verifyRuleKey 校验规则 baseParam中配置
 * @param {*} login 是否需要登录token
 *
 * @returns
 */
export const get = ({
  url = "",
  baseURL = undefined,
  params = {},
  headers = {},
  verifyRuleKey = "",
  login = true,
}) => {
  return axios({
    method: "get",
    url,
    baseURL,
    params: params,
    login: login,
    headers: {
      ...baseParam.baseHeaders,
      ...headers,
    },
    verifyRuleKey: verifyRuleKey,
    transformResponse: [
      function (data) {
        try {
          return JSON.parse(data);
        } catch (error) {
          return data;
        }
      },
    ],
  });
};
