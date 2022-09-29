export default {
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
        onShowSizeChange: (current, pageSize) => {
          this.current = 1;
          this.pageSize = pageSize;
          this.requestDataAction();
        },
        onChange: (page) => {
          this.current = page;
          this.requestDataAction();
        },
      },
    };
  },
  mounted() {
    this.requestDataAction();
  },
  methods: {
    requestDataAction() {},
  },
  destroyed() {},
};
