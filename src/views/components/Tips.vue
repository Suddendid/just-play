<!--Tips-->
<template>
  <div class="home" @click="closeAction">
    <div class="btn-close"></div>
    <div class="content">
      <div class="title">游戏介绍</div>
      <div class="content">
        {{ introduceText }}
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Tips',
  components: {},
  data() {
    return {
      introduceText: '这是一个黑帮抢银行的游戏，每一个玩家扮演的就是一个帮派，每个帮派需要派出一个小弟去参与并为他付出100万的保证金，每个帮派都有以下几种小弟，他们分别是：告密者，暴徒，恶棍，谋士以及司机。'
    }
  },
  methods: {
    closeAction() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 80%;
  width: 80%;
  background: #42b983;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .btn-close {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    position: absolute;
    right: -10px;
    top: -10px;
    background: #b4ccc3;
  }

  .content {
    .title {
      color: #fff;
      font-size: 60px;
    }
  }
}
</style>
