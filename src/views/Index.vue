<template>
  <div class="home">
    <div class="content" @mousewheel="mousewheelAction">
      <div class="top-nav">锦儿妹妹爱吃小零食</div>
      <div class="img-box">
        <div class="img-and-circle" ref="box1">
          <img class="img" src="@/assets/images/three-circle.png">
          <img class="img-circle"
               src="https://uploads-ssl.webflow.com/61f2d964890912e7c1a01c3d/620fe2771ebcd2f7133f3070_spinner-txt.svg">
        </div>
      </div>
      <div class="img-butterfly"><img src="@/assets/images/butterfly.gif"></div>
      <div class="img-hand"><img src="@/assets/images/hand-bg.png"></div>
      <div class="next-page">
        <div class="draw-box">
          <img ref="drawRef" src="@/assets/images/draw-1.png">
        </div>
        <video class="video" autoplay="autoplay" loop="loop" muted
               src="https://odins-crow.com/wp-content/uploads/2022/10/1-4_video_Small.ca9f7737d17ec6dcd90f0a2d156d846f.mp4">
        </video>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Index',
  components: {},
  data() {
    return {
      deltaY: 0
    }
  },
  methods: {
    mousewheelAction(e) {
      if (this.deltaY < 0 && e.deltaY < 0) {
        this.deltaY = 0
      } else if ((this.deltaY > window.screen.height || this.deltaY == window.screen.height) && e.deltaY > 0) {
        this.deltaY = window.screen.height
      } else {
        this.deltaY += e.deltaY
      }
      if (this.deltaY > window.screen.height / 2) {
        /*this.$refs.drawRef.style.filter = blur('5px')*/
        /*this.$refs.drawRef.style.backgroundColor = 'pink'*/
      } else {
        this.$refs.drawRef.style.backgroundColor = null
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  background-image: url("../assets/images/masaike.gif");
  position: relative;
  font-family: TaiBei;
  font-size: 60px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.80);

  .content {
    height: 100%;
    background-color: rgba(255, 182, 111, 0.8);
    position: relative;
    overflow: auto;

    &::after {
      content: '';
      height: 100%;
      width: 1px;
      position: fixed;
      background-color: #fff;
      left: 5%;
      top: 0
    }

    &::before {
      content: '';
      height: 100%;
      width: 1px;
      position: fixed;
      background-color: #fff;
      right: 5%;
      top: 0
    }

    .top-nav {
      height: 100px;
      width: 100%;
      border-bottom: 1px solid #fff;
      text-align: center;
    }

    .img-box {
      padding: 0 5%;
      height: 100%;

      .img-and-circle {
        position: absolute;
        bottom: 30px;
        left: 30px;
        height: 400px;
        width: 400px;
        animation: gsmh 2s ease;


        .img {
          object-fit: contain;
          height: 400px;
          width: 400px;
          animation: rotate 5s linear infinite;
          position: absolute;
        }

        .img-circle {
          position: absolute;
          object-fit: contain;
          height: 400px;
          width: 400px;
          animation: rotate2 15s linear infinite;
        }
      }


    }

    .img-hand {
      height: 50%;

      > img {
        object-fit: contain;
        height: 100%;
      }

      position: absolute;
      bottom: 0px;
      right: 0;
      animation: up-hand 4s;
    }

    .img-butterfly {
      height: 20%;

      > img {
        object-fit: contain;
        height: 100%;
      }

      position: absolute;
      bottom: 500px;
      right: 300px;
      animation: show-butterfly 4s linear;
    }

    .next-page {
      height: 1080px;
      padding: 0 5%;

      .draw-box {
        margin-left: 20%;
        height: 500px;
        width: 300px;
        border: 5px solid #fff;
        mix-blend-mode: multiply;

        > img {
          height: 500px;
          width: 300px;
          object-fit: contain;
        }

      }

      .video {
        position: absolute;
        right: 50px;
        mix-blend-mode: multiply;
      }
    }
  }
}


@keyframes up-hand {
  0% {
    bottom: -600px;
    right: -300px;
    opacity: 0;
  }
  100% {
    bottom: 0px
  }
}

@keyframes show-butterfly {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }

}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);

  }
  100% {

    transform: rotate(360deg);
  }
}

@keyframes rotate2 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-180deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes gsmh {
  0% {
    position: absolute;
    left: -200px;
    filter: blur(5px);
  }
  100% {
    position: absolute;
    filter: blur(0px);
  }
}
</style>
