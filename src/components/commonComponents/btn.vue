<!-- -->
<template>
  <div class="home">
    <div style="height: 600px;width: 800px">
      <common-table></common-table>
    </div>
    <div class="box" ref="box" @mouseenter="onmouseenterAction" @mouseleave="mouseleaveAction">
      <div class="x" ref="x">
        <a-icon type="close"/>
      </div>
      <div id="hexagon" ref="hexagon">
        <div class='one' ref="one"></div>
        <div class='two' ref="two"></div>
        <div class='three' ref="three"></div>
      </div>
      <div class="circle" ref="circle">
        <div class="smallcircle" ref="smallcircle1">
          <a-icon type="wechat"/>
        </div>
        <div class="smallcircle" ref="smallcircle2">
          <a-icon type="qq"/>
        </div>
        <div class="smallcircle" ref="smallcircle3">
          <a-icon type="weibo"/>
        </div>
        <div class="water"></div>
      </div>


    </div>
  </div>
</template>

<script>
import CommonTable from "./CommonTable"

export default {
  name: 'home',
  components: {CommonTable},
  data() {
    return {
      interval: {}
    }
  },
  methods: {
    /* @mouseenter="hoverAction" @mouseleave="leaveAction"*/
    hoverAction() {
      let one = this.$refs.one
      let two = this.$refs.two
      let three = this.$refs.three
      let n = 0
      this.interval = setInterval(e => {
        n++
        one.style.transform = `rotate(${10 * n}deg)`
        two.style.transform = `rotate(${60 + 10 * n}deg)`
        three.style.transform = `rotate(${300 + 10 * n}deg)`
      }, 100)
    },
    leaveAction() {
      clearInterval(this.interval)
    },
    onmouseenterAction() {
      this.$refs.hexagon.classList.add('showXuanzhuan')
      this.$refs.x.classList.add('showXuanzhuanX')
      this.$refs.circle.classList.add('showCircle')
      this.$refs.smallcircle1.style.display = 'flex'
      this.$refs.smallcircle2.style.display = 'flex'
      this.$refs.smallcircle3.style.display = 'flex'
      this.$refs.smallcircle1.classList.add('showsmallcircle')
      this.$refs.smallcircle2.classList.add('showsmallcircle2')
      this.$refs.smallcircle3.classList.add('showsmallcircle3')
    },
    mouseleaveAction() {
      this.$refs.hexagon.classList.remove('showXuanzhuan')
      this.$refs.x.classList.remove('showXuanzhuanX')
      this.$refs.circle.classList.remove('showCircle')
      this.$refs.smallcircle1.style.display = 'none'
      this.$refs.smallcircle2.style.display = 'none'
      this.$refs.smallcircle3.style.display = 'none'
      this.$refs.smallcircle1.classList.remove('showsmallcircle')
      this.$refs.smallcircle2.classList.remove('showsmallcircle2')
      this.$refs.smallcircle3.classList.remove('showsmallcircle3')
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;

  #hexagon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    width: 100px;

  }

  .showXuanzhuan {
    animation: xuanzhuan 1s ease;
  }

  .showXuanzhuanX {
    animation: xuanzhuanx 1s ease;
  }

  .one {
    position: absolute;
    width: 50px;
    height: 86.6px;
    margin: 0 auto;
    border-radius: 5%;
    border-top: 1px solid #00a6ff;
    border-bottom: 1px solid #00a6ff;
    background-color: #00a6ff;
  }

  .two {
    border-radius: 5%;
    position: absolute;
    width: 50px;
    height: 86.6px;
    transform: rotate(60deg);
    border-top: 1px solid #00a6ff;
    border-bottom: 1px solid #00a6ff;
    background-color: #00a6ff;
  }

  .three {
    border-radius: 5%;
    position: absolute;
    width: 50px;
    height: 86.6px;
    transform: rotate(300deg);
    border-top: 1px solid #00a6ff;
    border-bottom: 1px solid #00a6ff;
    background-color: #00a6ff;
  }

  .x {
    position: absolute;
    color: #fff;
    z-index: 99;
    font-size: 40px;
  }
}

.box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  top: 50%;
  height: 100px;
  width: 100px;
}

.circle {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.water {
  height: 100%;
  width: 100%;
  position: absolute;
  background-color: rgba(128, 198, 255, 1);
  -webkit-text-stroke: 1px rgb(128, 198, 255);
  animation: uiverse723 3s ease-in-out infinite;
}

.smallcircle {
  position: absolute;
  display: none;
  align-items: center;
  justify-content: center;
}

.showCircle {
  z-index: 999;
  background-color: #0a6ebd;
  position: absolute;
  left: 50%;
  bottom: 80px;
  transform: translate(-50%, -50%);
  height: 50px;
  width: 300px;
  border-radius: 20px 20px 0 0;
  animation: showPop 2s linear;
}

.showsmallcircle {
  z-index: 9999;
  background-color: #fff;
  height: 40px;
  width: 40px;
  border-radius: 50%;
  animation: showPopsmall 3s linear;
}

.showsmallcircle2 {
  z-index: 9999;
  background-color: #68bebe;
  height: 40px;
  width: 40px;
  border-radius: 50% 60% 100% 40%;
  animation: showPopsmall2 3s linear;
  left: 50px;

}

.showsmallcircle3 {
  z-index: 9999;
  background-color: #f19a9a;
  height: 40px;
  width: 40px;
  border-radius: 100% 60% 50% 40%;
  animation: showPopsmall3 3s linear;
  right: 50px;
}

@keyframes xuanzhuan {
  100% {
    transform: rotate(720deg);
  }
}

@keyframes xuanzhuanx {
  100% {
    transform: rotate(-720deg);
  }
}

@keyframes showPop {
  0% {
    opacity: 0;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    bottom: 0px;
  }
  80% {
    bottom: 100px;
    opacity: 0.5;
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
  100% {
    height: 50px;
    width: 300px;
    opacity: 1;
  }
}

@keyframes showPopsmall {
  0% {
    opacity: 0;
    width: 10px;
  }
  80% {
    opacity: 0.1;
    width: 40px;
    border-radius: 50% 100% 50% 60%;
  }
  90% {
    width: 60px;
    border-radius: 50% 100% 50% 60%;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 0);
  }
  100% {
    opacity: 1;
    border-radius: 50%;
  }
}

@keyframes showPopsmall2 {
  0% {
    height: 10px;
    width: 10px;
    opacity: 0;
    border-radius: 20% 0% 40% 60%;
    background-color: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0);
  }
  10% {
    height: 10px;
    width: 10px;
    border-radius: 0% 0% 0% 0%;
    background-color: rgba(255, 255, 255, 1);
  }
  50% {
    border-radius: 0% 100% 100% 100%;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 0);
  }
  90% {
    opacity: 0.5;
    width: 60px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 0);
  }
  100% {
    opacity: 1;
    border-radius: 50% 60% 100% 40%;
    left: 50px;
  }
}

@keyframes showPopsmall3 {
  0% {
    height: 10px;
    width: 10px;
    background-color: rgba(255, 255, 255, 0);
    color: rgba(255, 255, 255, 0);
    opacity: 0;
    border-radius: 50% 100% 100% 60%;
  }
  10% {
    height: 10px;
    width: 10px;
    border-radius: 0% 0% 0% 0%;
    background-color: rgba(255, 255, 255, 1);
  }
  50% {
    border-radius: 100% 0% 100% 100%;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 0);
  }
  90% {
    opacity: 0.5;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(255, 255, 255, 0);
    width: 60px;
  }
  100% {
    opacity: 1;
    border-radius: 100% 60% 50% 40%;
    right: 50px;
  }
}

@keyframes uiverse723 {
  0% {
    clip-path: polygon(0% 45%, 15% 44%, 32% 50%,
    54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
  }

  50% {
    clip-path: polygon(0% 60%, 16% 65%, 34% 66%,
    51% 62%, 67% 50%, 84% 45%, 100% 46%, 100% 100%, 0% 100%);
  }
  100% {
    clip-path: polygon(0% 45%, 15% 44%, 32% 50%,
    54% 60%, 70% 61%, 84% 59%, 100% 52%, 100% 100%, 0% 100%);
  }
}
</style>
