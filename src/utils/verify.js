// 校验是否为手机号(1+10位数字)
export const checkMobilePhone = (str) => {
    var reg = /^(1\d{10})$/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效身份证(15位或18位带X)
export const checkIDCardNo = (str) => {
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
export const checkEmail = (str) => {
    var reg = /[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效密码(26个字母大小写+数字+下划线)
export const checkValidPassword = (str) => {
    var reg = /^[A-Za-z0-9_]+$/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否为有效营业执照号(社会信用统一代码)
export const checkusinessLicense = (str) => {
    var reg1 = /(^(?:(?![IOZSV])[\dA-Z]){2}\d{6}(?:(?![IOZSV])[\dA-Z]){10}$)|(^\d{15}$)/;
    var reg2 = /^\d{13}$/
    if (reg1.test(str) || reg2.test(str)) {
      return true;
    }
    return false;
  }

  // 校验是否全部为数字s
export const checkAllNumber = (str) => {
    var reg = /^\d+$/;
    if (reg.test(str)) {
      return true;
    }
    return false;
  }
