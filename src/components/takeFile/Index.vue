<template>
  <div style="display: none">
    <form class="uploadForm" enctype="multipart/form-data">
      <!-- multiple="multiple" 支持多张图上传 -->
      <input ref="fileForm" :accept="accept" type="file" :multiple="multiple ? 'multiple' : ''"
             @change="btnUploadFile($event)" />
    </form>
  </div>
</template>

<script>

import { compressImg } from "@/utils/util.js"

export default {
  name: "TakeFile",
  data() {
    return {
      multiple: true,
      maxSize: 9,
      accept: "image/*",
      finish: () => { },
      vaild: () => true,
      compress: true,
    };
  },
  methods: {
    btnUploadFile: function (e) {
      const that = this;
      const files = e.target.files;
      if (files.length <= 0) {
        return;
      }
      let vaildFiles = []
      for (let index = 0; index < files.length; index++) {
        const element = files[index];
        if (this.vaild(element)) {
          vaildFiles.push(element)
        }
      }
      if (vaildFiles.length == 0) {
        this.error && this.error({ msg: "不支持的文件类型" })
        return
      }
      if (vaildFiles.length > this.maxSize) {
        vaildFiles = vaildFiles.slice(- this.maxSize)
      }
      Promise.all(vaildFiles.map(file => {
        return this.disposeSingleFile(file)
      })).then(result => {
        this.finish && this.finish(result)
        $(that.$refs.fileForm).val("");
      })
    },
    disposeSingleFile(file) {
      let that = this
      return new Promise(function (resolve, reject) {
        const fileType = file.type || file.name.substring(file.name.lastIndexOf(".") + 1)
        const reader = new FileReader();
        reader.onload = function () {
          const result = this.result;
          const isImage = /\/(?:jpeg|jpg|png|webp)/i.test(file.type)
          if (that.compress && isImage) {
            const EXIF = require("exif-js/exif.js");
            EXIF.getData(file, function () {
              let self = this
              let image = new Image();
              image.onload = function () {
                const orientation = EXIF.getTag(self, 'Orientation');
                var compressedDataUrl = compressImg(image, fileType, orientation);
                resolve({
                  url: compressedDataUrl,
                  name: file.name,
                  size: file.size,
                  type: fileType,
                })
                image = null;
              }
              image.src = result;
            })
          } else {
            let fileItem = {
              file: file,
              url: result,
              name: file.name,
              size: file.size,
              type: fileType,
            };
            resolve(fileItem)
          }
        };
        reader.readAsDataURL(file);
      })
    },
    trigger: function (option = {}) {
      this.accept = option.accept || ""
      this.maxSize = option.maxSize || 9
      this.multiple = option.multiple || ((this.maxSize == 1) ? false : true)
      this.finish = option.finish || null
      this.error = option.error || null
      this.vaild = option.vaild || this.vaild
      this.compress = option.compress
      this.$nextTick(() => {
        $(this.$refs.fileForm).trigger("click");
      })
    },
  },
};
</script>

<style scoped>
</style>
