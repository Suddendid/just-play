<!--登录-->
<template>
  <div class="login" :class="isLight?'':'is-dark'">

    <!--light||dark-->
    <label class="container">
      <input type="checkbox" id="check" @click="isLight=!isLight">
      <span></span>
      <label class="shadow" for="check"></label>
    </label>

    <div class="img">
      <img class="left-img" src="@/assets/images/bg.jpg">
    </div>

    <div class="login-box card">
      <div class="login-content">
        <div><label>Email: </label><input type="text" name="text" class="input"></div>
        <div><label>Email: </label><input type="text" name="text" class="input" placeholder="Type here!"></div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {},
  data() {
    return {
      isLight: true
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.is-dark {
  background: rgba(1, 1, 1, 0.81) !important;
}

.login {
  height: 100%;
  width: 100%;
  display: flex;
  background: rgba(1, 1, 1, 0.08);

  label.container {
    position: absolute;
    top: 50px;
    right: 50px;
  }

  .img {
    width: 40%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .left-img {
      position: absolute;
      object-fit: contain;
      animation: movepoint 50s infinite;
    }


  }

  .login-box {
    flex: 1;

    .login-content {
      height: 300px;
      width: 600px;
      border-radius: 30px;
      background-image: linear-gradient(to bottom right, #c0f5ff, #48525e);
      box-shadow: 15px 15px 30px #bebebe,
        -15px -15px 30px #ffffff;
      position: absolute;
      left: 70%;
      top: 40%;
      transform: translate(-50%, -50%);
      font-size: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .input {
        margin-bottom: 30px;
        border: none;
        border-radius: 15px;
        padding: 10px 35px;
        background-color: #e8e8e8;
        box-shadow: 6px 6px 12px #ffffff,
          -6px -6px 12px #c5c5c5;
        font-size: 20px;
        font-weight: bold;

      }


    }
  }
}

@keyframes movepoint {
  0% {
    top: 0px;
  }
  50% {
    top: -200px;
  }
  100% {
    top: 0px;
  }
}

input[type = "checkbox"] {
  visibility: hidden;
  display: none;
  appearance: none;
  -webkit-appearance: none;
}

label.container {
  width: 60px;
  height: 30px;
  background: #d3d3d3;
  border-radius: 50px;
  position: relative;
  cursor: pointer;
  box-shadow: 9px 9px 29px #969696,
    -9px -9px 29px #ffffff;
}

label.shadow {
  width: 50px;
  height: 20px;
  position: absolute;
  border-radius: 50px;
  left: 5px;
  top: 5px;
  box-shadow: inset 3px 3px 10px #969696,
    inset -3px -3px 5px #ffffffbd;
  cursor: pointer;
}

.container span {
  display: inline-block;
  width: 20px;
  height: 20px;
  background-color: #ffaa00;
  margin: 5px;
  border-radius: 50px;
  font-size: 20px;
  transition: all 0.3s ease-in;
  position: relative;
  left: 0;
  z-index: 1;
}

.container span::after {
  position: absolute;
  top: 6px;
  left: 4px;
  transition-delay: 5s;
}

input[type = "checkbox"]:checked ~ span {
  left: 29px;
  transition: 0.3s ease-in;
  background: #0a100d;
  transform: rotate(220deg);
}
</style>
