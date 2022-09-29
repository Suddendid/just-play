<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
require("./assets/styles/base.css");
require("@/utils/hy-common-tool.js")

export default {
  name: 'App',
  data() {
    return {

    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: "Microsoft YaHei", "Heiti SC", tahoma, arial, "Hiragino Sans GB",
    "宋体", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
