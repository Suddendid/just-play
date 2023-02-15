<!--底部身份卡片-->
<template>
  <div class="home">
  </div>
</template>

<script>

export default {
  name: 'BottomCard',
  components: {},
  data() {
    return {
      cardList: [
        {name: '', direction: ''},
        {name: '', direction: ''},
        {name: '', direction: ''},
        {name: '', direction: ''},
        {name: '', direction: ''},
      ]
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  width: 100%;
  background-color: #23523a;
}
</style>
