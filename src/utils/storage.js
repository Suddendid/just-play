import jsCookie from "js-cookie";
/**
 * 【sessionStorage】
 * @param key
 * @param data
 */
//存
export const saveDataToSession = (key, data) => {
  if (data) {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  }
};

export const getDataFromSession = (key) => {
  const str = window.sessionStorage.getItem(key);
  if (str && str.length > 0 && str != "undefined") {
    return window.JSON.parse(str);
  }
  return null;
};

export const clearSessionData = (key) => {
  window.sessionStorage.removeItem(key);
};

/**
 * 【localStorage】
 * @param key
 * @param data
 */
//存
export const saveDataToLocal = (key, data) => {
  if (data) {
    window.localStorage.setItem(key, JSON.stringify(data));
  }
};
//取
export const getDataFromLocal = (key) => {
  const str = window.localStorage.getItem(key);
  if (str && str.length > 0 && str != "undefined") {
    return window.JSON.parse(str);
  }
  return null;
};
//清除
export const clearLocalData = (key) => {
  window.localStorage.removeItem(key);
};

/**
 * Cookie
 */
export const setDataFromCookie = (key, value) => {
  jsCookie.set(key, value);
}

export const getValueFromCookie = key => {
  return jsCookie.get(key);
}
