<template>
  <div class="swiper" :id="this.getIDName" @mouseenter="mouseenterAction"
    @mouseleave="mouseLeaveAction">
    <div class="swiper-wrapper">
      <div class="swiper-slide roll-item" v-for="(row, i) in values" :key="i" :t-rowindex="i">
        <slot name="slide" :value="row" :index="i"></slot>
      </div>
    </div>
  </div>
</template>
<script>

import "swiper/css/swiper.min.css";
import Swiper from "swiper";
import { getUID, deepMerge, getElementAttribute } from '@/utils/util.js'

export default {
  name: 'RollSwiper',
  props: {
    idName: {
      type: String,
      default: () => {
        return `swiper-${getUID()}`
      },
      require: false
    },
    option: {
      type: Object,
      default: () => {
        return {}
      },
      require: false
    },
    values: {
      type: Array,
      default: () => [],
      require: false

    }
  },
  components: {

  },
  watch: {
    values: {
      handler(newVal, oldVal) {
        if (this.swiper) {
          this.getSwiperOpt.autoplay && this.swiper.autoplay.stop()
          this.getSwiperOpt.loop && this.swiper.loopDestroy()
          this.$nextTick(() => {
            this.swiper.updateSlides(); //更新slide
            this.swiper.update()
            if (this.canLoop) {
              this.swiper.loopCreate()
              this.swiper.slideToLoop(1, 0, false)
            }
            if (this.getSwiperOpt.autoplay) {
              setTimeout(() => {
                this.swiper.autoplay.start()
              }, 1000);
            }
          })
        } else {
          this.$nextTick(() => {
            this.initSwiper()
          })
        }
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    getIDName() {
      if (this.idName && this.idName.length > 0) {
        return this.idName
      } else {
        return `swiper-${getUID()}`
      }
    },
    getSwiperOpt() {
      const defaultOpt = {
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        observeSlideChildren: true,
        autoplay: {
          disableOnInteraction: false,
        },
        direction: "vertical", // 垂直切换选项
        loop: true, // 循环模式选项
        slidesPerView: 5,
        spaceBetween: 0,
        freeMode: false,
        mousewheel: true,
        grabCursor: true,
        on: {
          click: (e) => {
            const item = getElementAttribute(e.target, (name) => {
              return name.startsWith('t-')
            })
            this.$emit("clickCol", item)
          },
        }
      }
      return deepMerge(defaultOpt, this.option)
    },
    canLoop() {
      return this.getSwiperOpt.loop && this.values.length > this.getSwiperOpt.slidesPerView
    }
  },
  data() {
    return {

    }
  },
  mounted() {
    // this.initSwiper()
  },
  methods: {
    initSwiper() {
      this.swiper = new Swiper(`#${this.getIDName}`, this.getSwiperOpt);
    },
    mouseenterAction() {
      if (this.getSwiperOpt.autoplay) {
        this.swiper && this.swiper.autoplay.stop()
      }
    },
    mouseLeaveAction() {
      if (this.getSwiperOpt.autoplay) {
        this.swiper && this.swiper.autoplay.start()
      }

    },
  },
  destroyed() {
    if (this.swiper) {
      this.swiper.destroy()
      this.swiper = null
    }
  },
}
</script>



<style lang="less" scoped>
.swiper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
