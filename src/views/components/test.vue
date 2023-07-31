<template>
  <div class="home">
    <div class="box"></div>
  </div>
</template>

<script>
import {permission, waterMarker, draggable} from "@/utils/directives-test/common";

let pro = {
  getPro: function () {
    return () => {
      console.log(this);
    }
  }
}
pro.getPro()()

export default {
  data: function () {
    return {
      list: [
        {key: 'SQ'},
        {key: 2},
        {key: 3},
        {key: 2},
      ]
    }
  },
  directives: {
    permission,
    waterMarker,
    draggable
  },
  methods: {}
}
</script>
<style scoped lang="less">
.home {
  height: 100%;
  width: 100%;
  position: relative;
}

.box {
  height: 100px;
  width: 100px;
  background-color: #42b983;
  transform: scale(0.5, 0.5);
}
</style>
