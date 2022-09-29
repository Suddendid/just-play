export default {
  data() {
    return {
      timeInterval: null,
      hasPoll: false
    };
  },
  mounted() {},
  methods: {
    startInterval(time, fn) {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
      this.hasPoll = true;
      this.timeInterval = setInterval(() => {
        if (this.hasPoll) {
          fn();
        }
      }, time);
    },
    stopInterval() {
      this.hasPoll = false;
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
    }
  },
  destroyed() {
    this.stopInterval();
  }
};
