import * as baseParam from "@/utils/request/baseParam";
import {get, post} from "@/utils/request/axiosRequest";
import {baseURL} from "@/utils/request/baseParam";


//大华视频
export const dhVideo = (data) => {
    data.scheme = 'HLS'
    let url = 'http://198.18.128.94:18080/dahua/videoService/realmonitor/uri'
    return get({
        url, params: data,
    });
}
//大华录像 /videoService/record/records?args
export const dhVideoRecords = (data) => {
    data.scheme = 'HLS'
    let url = 'http://198.18.128.94:18080/dahua/videoService/record/records'
    return get({url, params: data});
}

// http://198.18.129.136:9988/jyzhatuche_video/session/getToken
export const getXToken = (data) => {
    let url = 'http://198.18.129.136:9988/jyzhatuche_video/session/getToken'
    return get({url, params: data});
}
