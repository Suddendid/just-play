<!-- -->
<template>
  <div class="VideoDemo">
    <!--    <button @click="showVideo">播放</button>
        <video id="HLS_Player"></video>-->
    <iframe style="height: 100%;width: 100%" src="http://192.168.1.40:8080"></iframe>
  </div>
</template>

<script>
import commonTitle from "@/views/components/commonTitle";
import Hls from "../../public/static/hls/hls.min";
import {dhVideo, dhVideoRecords, getXToken} from "@/api/modules";
import moment from "moment";

export default {
  name: 'VideoDemo',
  components: {commonTitle},
  mounted() {

  },
  data() {
    return {
      xToken: '',
      dhVideoUrl: ''
    }
  },
  methods: {
    showVideo() {
      this.$api.getXToken().then(res => {
        console.log(res)
        this.xToken = res.msg
      })
      let endTime = moment(new Date()).format('YYYY-MM-DD')
      let beginTime = moment(new Date((new Date().getTime() - 24 * 60 * 60 * 1000))).format('YYYY-MM-DD')
      let data = {
        channelCode: "32010564001310090013",
        beginTime: `${beginTime} 00:00:00`,
        endTime: `${endTime} 00:00:00`,
        location: 'device',//cloud大华平台中心录像 device设备录像
      }
      this.$api.dhVideo({channelId: '32010564001310090013'}).then(res => {
        console.log(res, '@@@')
        this.dhVideoUrl = 'http://172.30.11.199:8050/cam/realmonitor/32010564001310090003?subtype=0&streamType=0&token=1677627820_248d55962447cc4085e01b6bda8b04725b7ffaae&mediatype=HLS.m3u8'
        //this.dhVideoUrl = res.url
        let HLS_Player = document.getElementById('HLS_Player');
        if (Hls.isSupported()) {
          let HLS_Controller = new Hls();
          HLS_Controller.attachMedia(HLS_Player);

          //HLS_Controller.on(Hls.Events.MANIFEST_PARSED, function () {
          HLS_Controller.config.xhrSetup = (xhr, url) => {
            //xhr.open("GET", url, true);
            // header 添加参数
            xhr.setRequestHeader("X-Subject-Token", '4713887206211584_f97d477247b2e7400fd411ef6fc580700b931e2274ba84acde2cc92948495d168b7fd9dcb3f363d2e2c1594833aaa4cadf8ad42c91fe85a59e99c11d707acfbe');
          };
          HLS_Controller.loadSource(this.dhVideoUrl);

          HLS_Player.play();
          //});
        }
        /*else if (HLS_Player.canPlayType('application/vnd.apple.mpegurl')) {
          HLS_Player.src = 'http://ivi.bupt.edu.cn/hls/cctv1hd.m3u8';
          HLS_Player.addEventListener('loadedmetadata', function () {
            HLS_Player.play();
          });
        }*/
      })
    }
  }
}
</script>
<style>
.VideoDemo {
  height: 100%;
  width: 100%;
}
</style>
