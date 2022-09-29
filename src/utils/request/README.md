# 通用接口请求使用说明

### axiosRequest.js 使用说明 (PS:基于 axios 做的二次封装，使用时请确保安装了 axios 库)

GET 请求
```
 import { get, post } from "./axiosRequest.js";
 get(option);
```

POST 请求
```
 import { get, post } from "./axiosRequest.js";
 post(option);
```

> option 参数说明
  @param {*} baseURL 服务地址
  @param {*} url 请求地址
  @param {*} data 请求参数 PS:content-type == application/json\multipart 时传参
  @param {*} params 请求参数 PS:content-type == application/x-www-form-urlencoded 时传参
  @param {*} headers 请求头
  @param {*} verifyRuleKey 校验规则 baseParam中配置
  @param {*} login 是否需要登录

### 请求拦截 baseParam.js 使用说明

> PS:axiosRequest.js 是基于 axios 库做的二次封装，其引入项目后无特殊情况不需要对其做修改，针对请求拦截需要自行在 baseParam.js 中配置

- baseURL： { String } 默认通用接口服务地址

- baseHeaders： { Object } 通用请求头

- timeOut：{Number} 接口超时时间

- requestIntercept: { Function: () => Object } 接口请求拦截; PS：可在此对请求头，请求参数做进一步调整, 需要返回 config 对象

- responseFailIntercept： { Function } 接口请求失败再次做一下提示操作

- loginExpiryIntercept：登录过期操作处理

- verifyRuleKeys： { Object } 设置校验枚举

- verifyRule: 针对可能会出现调用不同的服务地址， 需要设置 verifyRuleKeys 使用 verifyRule 设置不同的服务地址返回值的校验规则

> 通过ruleKey 校验不同的返回拦截判断
  如果添加了verifyRuleKeys 需要在这边设置对应的校验规则
  @param {*} key
  @returns {
    success: {Function} // 是否成功
    successInfo： {Function} // 返回成功的数据
    loginExpiry: {Function} // 是否登录过期
    failureInfo: {Function} // 返回失败信息
