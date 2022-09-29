<template>
  <div class="table-container">
    <template>
      <slot name="customHeader"></slot>
    </template>

    <div class="table-container-header" ref="antFilter" v-if="$slots.contentFilter">
      <slot name="contentFilter"></slot>
    </div>
    <div v-if="gapping" class="table-container-gapping">

    </div>
    <div class="table-container-content">
      <div class="table-container-content-header">
        <slot name="tableHeader"></slot>
      </div>
      <div class="table-container-content-table">
        <slot name="contentTable"></slot>
      </div>
      <div class="table-container-pagination" v-if="pagination">
        <a-pagination :current="pagination.current" :show-size-changer="false"
                      @showSizeChange="pagination.onShowSizeChange" :total="pagination.total"
                      :pageSize.sync='pagination.pageSize' @change="pagination.onChange"
                      :show-total="pagination.showTotal" />
      </div>
    </div>
    <div class="table-container-extend">
      <slot name="extend"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableTemplate',
  props: {
    pagination: {},
    gapping: true
  },
  data() {
    return {

    }
  },
  computed: {

  },
  mounted() {
  },
  methods: {

  },
  components: {

  }
}
</script>

<style scoped>
.table-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-container-header {
  flex: none;
  padding: 25px 20px;
  background-color: white;
}
.table-container-gapping {
  height: 20px;
  background-color: #f0f2f5;
  flex: none;
}

.table-container-content {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  height: 0;
  overflow: hidden;
}

.table-container-content-header {
  flex: none;
}

.table-container-content-table {
  flex: 1 1 auto;
  overflow: hidden;
  padding: 20px;
}
.table-container-content-table > div {
  height: 100%;
}

.table-container-pagination {
  padding: 10px 20px 20px 20px;
  text-align: right;
  flex: none;
}
</style>
