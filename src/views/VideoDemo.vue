<!-- -->
<template>
  <div class="VideoDemo">
    <commonTitle @hook:mounted="showLog"></commonTitle>
  </div>
</template>

<script>
import commonTitle from "@/views/components/commonTitle";

export default {
  name: 'VideoDemo',
  components: {commonTitle},
  mounted() {
  },
  methods: {
    showLog() {
      console.log('mounted')
    }
  }
}
</script>
<style>

</style>
