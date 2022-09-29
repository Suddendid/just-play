<template>
  <div class="iframe-content">
    <iframe ref="iframe" allow="microphone;camera;midi;encrypted-media;" :src="url"
      width="100%" height="100%"></iframe>
  </div>
</template>

<script>
export default {
  name: "CommonIframe",
  props: {
    url: {
      type: String,
      default: ''
    },
    receive: {
      type: Boolean,
      default: false,
      require: false
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    if (this.receive) {
      window.addEventListener("message", this.postMessageHandler.bind(this), false);
    }
  },
  computed: {
    iframeUrl() {
      return this.url
    }
  },
  methods: {
    postMessageHandler(msgEvent) {
      try {
        this.$emit('postMessage', msgEvent.data)
      } catch (error) {
        // console.log(error);
      }
    },
    reload() {
      this.$emit('update:url', this.url + ' ')
    }
  },
  destroyed() {
    if (this.receive) {
      window.removeEventListener("message", this.postMessageHandler.bind(this))
    }
  },
}
</script>

<style scoped>
.iframe-content {
  width: 100%;
  height: 100%;
}
</style>
