import * as baseParam from "@/utils/request/baseParam";
import { post } from "@/utils/request/axiosRequest";
import { dataURLtoFile } from "@/utils/util";

/**
 * 文件上传接口
 * @param {*} files 上传文件
 * @param {*} params 上传文件参数
 * @returns
 */
export const uploadFiles = (files, params = {}) => {
  if (!(files instanceof Array)) {
    files = [files];
  }
  if (!files || files.length == 0) {
    return Promise.resolve([]);
  }
  let formData = new FormData();
  for (let index = 0; index < files.length; index++) {
    const element = files[index];
    if (element.file && element.file instanceof File) {
      formData.append("file", element.file);
    } else {
      formData.append("file", dataURLtoFile(element.url));
    }
  }
  Object.keys(params).forEach((key) => {
    formData.append(key, params[key]);
  });
  // let url = "/upload/upload";
  let url = "/upload/uploadFile";
  return post({
    url,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * 将相对路径图片地址转为绝对路径
 * @param {*} relativeUrl 相对路径图片地址
 * @param {*} option {
 *                isBase64: 是否是base64 当图片地址没有标记前缀是设置
 *                host: 图片服务地址
 *            }
 * @returns
 */
export const toAbsoluteUrl = (relativeUrl, option = {}) => {
  if (!relativeUrl || relativeUrl.length == 0) {
    return "";
  }
  if (
    relativeUrl.startsWith("data:image/png;base64") ||
    relativeUrl.startsWith("data:image/jpg;base64")
  ) {
    return relativeUrl;
  }

  if (option.isBase64) {
    return `data:image/png;base64${relativeUrl}`;
  }

  if (relativeUrl.startsWith("http") || relativeUrl.startsWith("https")) {
    return relativeUrl;
  }

  return (option.host || baseParam.baseFileURL) + relativeUrl;
};
