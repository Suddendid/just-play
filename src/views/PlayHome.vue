<!--玩家首页-->
<template>
  <div class="play-home">
    <div class="top">
      百万美金
    </div>
    <!-- 提示 -->
    <div class="tips" @click="showTips">
      提示
    </div>
    <!-- 用户列表 -->
    <div class="player-list">
      <svg-icon icon-class="niu"></svg-icon>
      <div class="head" v-for="i in playerList">
        <div class="isReady" v-if="i.isReady">已准备！</div>
      </div>
    </div>

    <!-- 弹出蒙层 -->
    <div class="center-content" v-if="centerVisible.show">
      <Tips v-if="centerVisible.type==1" @close="closeAction">
      </Tips>
    </div>
    <!-- 底部卡片 -->

    <div class="bottom">
      <BottomCard>
      </BottomCard>
    </div>
  </div>
</template>

<script>
import BottomCard from "@/views/components/BottomCard";
import Content from "@/views/components/Content";
import Tips from "@/views/components/Tips";
import svgIcon from "@/components/SvgIcon";

export default {
  name: 'PlayHome',
  components: {BottomCard, Content, Tips, svgIcon},
  data() {
    return {
      playerList: [
        {isReady: true},
        {isReady: false},
        {isReady: false},
      ],
      centerVisible: {
        show: false,
        type: 1
      }
    }
  },
  methods: {
    showTips() {
      this.centerVisible = {
        show: true,
        type: 1
      }
    },
    closeAction() {
      this.centerVisible.show = false
    }
  }
}
</script>
<style lang="less" scoped>
.play-home {
  height: 100%;
  width: 100%;
  position: relative;
  background: url("../icons/svg/bg.svg") no-repeat;
  background-size: auto 100%;

  .top {
    padding-left: 20px;
    color: #f5cb36;
    font-size: 60px;
    font-weight: 800;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100px;
  }

  .tips {
    position: absolute;
    top: 120px;
    right: 20px;
    border-radius: 50%;
    background: #87a0f5;
    width: 40px;
    height: 40px;
  }

  .player-list {
    position: absolute;
    left: 0px;
    top: 160px;
    padding: 10px 10px 0px 10px;
    border-radius: 0 5px 5px 0;

    .head {
      height: 50px;
      width: 50px;
      font-weight: 800;
      border-radius: 50%;
      background: #7dc0ee;
      margin-bottom: 10px;
      position: relative;

      .isReady {
        position: absolute;
        bottom: 0;
        right: -20px;
        font-size: 12px;
        color: #795105;
      }
    }
  }

  .center-content {
    z-index: 2;
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.6);
  }

  .bottom {
    z-index: 1;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 100px;
  }

}

@media (max-width: 500px) {
  .play-home {
    background-color: #aed7f6;
  }
}
</style>
