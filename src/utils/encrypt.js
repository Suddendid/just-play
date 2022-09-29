/**
 * AES 参数加密-解密
 */
const _aes_cryptoKey = "a708765a20d14fda";
const _aes_cryptoIv = "0123456789abcdef";
export const aesEncrypt = (value = "") => {
  const cryptoJS = require("crypto-js");
  const word = value;
  const key = CryptoJS.enc.Utf8.parse(_aes_cryptoKey);
  const iv = CryptoJS.enc.Utf8.parse(_aes_cryptoIv);
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
    mode: CryptoJS.mode.CBC,
  });
  return encrypted.toString();
};

export const aesDecrypt = (value) => {
  const CryptoJS = require("crypto-js");
  const key = CryptoJS.enc.Utf8.parse(_aes_cryptoKey);
  const iv = CryptoJS.enc.Utf8.parse(_aes_cryptoIv);
  const decrypted = CryptoJS.AES.decrypt(value, key, {
    iv: iv,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

/**
 * 3DES加密 解密
 */
const _des_cryptoKey = "267ac2ed67f292ff77c4a0b8";
const _des_cryptoIv = "00000000";
export const desEncrypt = (value = "") => {
  const CryptoJS = require("crypto-js");
  let encryptValue = value;
  if (typeof value == "string") {
    encryptValue = value;
  } else {
    encryptValue = window.JSON.stringify(value);
  }
  const keyHex = CryptoJS.enc.Utf8.parse(_des_cryptoKey);
  const cipher = CryptoJS.TripleDES.encrypt(data, keyHex, {
    iv: CryptoJS.enc.Utf8.parse(_des_cryptoIv),
    mode: CryptoJS.mode.CBC,
  });
  return cipher.toString();
};

export const desDecrypt = (value = "") => {
  const CryptoJS = require("crypto-js");
  const keyHex = CryptoJS.enc.Utf8.parse(_des_cryptoKey);
  const decrypted = CryptoJS.TripleDES.decrypt(value, keyHex, {
    iv: CryptoJS.enc.Utf8.parse(_des_cryptoIv),
    mode: CryptoJS.mode.CBC,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
