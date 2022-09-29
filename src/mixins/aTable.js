export default {
  data: function() {
    return {
      lastIndex: -1,
      spinning: false,
      selectedRowKeys: [],
      rowClick: (record, index) => ({
        // 事件
        on: {
          click: () => {
            this.rowClickAction(record, index);
          }
        }
      }),
      scrollOffset: { antTable: { x: 1000, y: 0 } }
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  created() {},
  mounted() {
    // 计算Table滚动高度
    setTimeout(() => {
      this.resizeTableHandler();
      window.addEventListener("resize", this.resizeTableHandler);
    }, 250);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeTableHandler);
  },
  methods: {
    resizeTableHandler() {
      this.$nextTick(() => {
        this.resizeTable();
      });
    },
    /**
     * 设置Table滚动高度
     */
    resizeTable: function() {
      this.scrollOffset = this.resizeTableByRefs(this.$refs.antTable);
    },
    resizeTableByRefs: function(refs) {
      if (refs && refs.$el) {
        const antTableEl = refs.$el;
        const offsetHeight = antTableEl.offsetHeight;
        const tableHeadEl = antTableEl.querySelector(".ant-table-thead");
        let headHeight = 0;
        if (tableHeadEl) {
          headHeight = tableHeadEl.offsetHeight;
        }
        // x - 53 win上面会有一点点滚动修改
        return {
          y: offsetHeight - headHeight,
          x: antTableEl.offsetWidth - 56
        };
      } else {
        return {
          x: 1000,
          y: 0
        };
      }
    },
    /**
     * 请求接口数据
     */
    requestDataAction: function() {},
    /**
     * 点击行
     * @param {*} record
     * @param {*} index
     */
    rowClickAction: function(record, index) {},
    /**
     * 选中
     * @param {*} selectedRowKeys
     * @param {*} row
     */
    onSelectChange(selectedRowKeys, row) {
      this.row = row;
      this.selectedRowKeys = selectedRowKeys;
    }
  }
};
