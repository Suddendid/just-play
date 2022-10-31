<!-- -->
<template>
  <div class="common-table">
    <div class="table-row" v-for="item in list">
      <div class="row-item" v-for="i in item.forms">
        <div class="row-name">{{ i.title }}</div>
        <div class="row-value">{{ i.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',
  components: {},
  props: {

    list: {
      type: Array,
      default: () => [
        {
          forms: [
            {title: "监管事项目录编码", value: "1", key: ""},
            {title: "监管事项检查实施清单编码", value: "2", key: ""},
          ],
        },
        {
          forms: [{title: "监管事项子项名称", value: "1", key: ""}],
        },
        {
          forms: [
            {title: "检查行为名称", value: "1", key: ""},
            {title: "检查行为编号", value: "2", key: ""},
          ],
        },
      ]
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.common-table {
  height: 100%;
  width: 100%;

  .table-row {
    border: 1px solid rgba(0, 0, 0, 0.3);
    display: flex;

    .row-item {
      display: flex;
      flex: 1;

      .row-name {
        padding: 20px;
        background-color: rgba(249, 249, 249);
        width: 200px;
        border-right: 1px solid rgba(0, 0, 0, 0.3);
        border-left: 1px solid rgba(0, 0, 0, 0.3);
      }

      .row-value {
        padding: 20px;
      }
    }

  }
}
</style>
