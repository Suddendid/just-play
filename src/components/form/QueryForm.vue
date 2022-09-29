<template>
  <div class="filtrate-container">
    <div class="filterate-field">
      <div class="filterate-items" v-for="(filtrateItem,index) in formModel.forms" :key="index"
           :style="filtrateItem.style" v-if="index == 0 || show_more">
        <div class="filterate-item" v-for="form in filtrateItem.children" :key="form.id"
             :style="form.style">
          <div class="filterate-item-form" :style="form.style.itemStyle">
            <div :style="form.style.titleStyle || filtrateItem.titleStyle">{{form.title}}：</div>
            <single-form :form="form" @change="onChangeAction"></single-form>
          </div>
        </div>
      </div>
    </div>
    <div class="filterate-operation">
      <a-button type="primary" style="margin-right:10px" @click="toQueryAction">查询</a-button>
      <a-button @click="toResetAction">重置</a-button>
      <div class="filterate-operation-toggle blue-text"
           v-if="formModel.forms && formModel.forms.length > 1" @click="toggleAction">
        <template v-if="!show_more">展开&nbsp;
          <a-icon type="down" />
        </template>
        <template v-else>收起&nbsp;
          <a-icon type="up" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SingleForm from "./SingleForm.vue"
export default {
  name: 'QueryFrom',
  props: {
    formModel: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      show_more: true
    }
  },
  components: { SingleForm },
  computed: {},
  mounted() {
  },
  methods: {
    /**
     * 展开隐藏更多
     */
    toggleAction() {
      this.show_more = !this.show_more;
    },
    /**
     * 
     */
    onChangeAction: function ({ val, form }) {
      const queryEnabled = form.onChange ? form.onChange(val, form) : false
      if (queryEnabled) {
        this.toQueryAction()
      }
    },
    toQueryAction: function () {
      this.$emit('query', this.formModel.getParam)
    },
    toResetAction: function () {
      this.formModel.reset()
      this.$emit('reset')
      this.$emit('query', this.formModel.getParam)
    }
  }
}
</script>

<style scoped>
.filtrate-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filterate-field {
  flex: 1;
  margin-right: 20px;
}

.filterate-items {
  display: flex;
  align-items: center;
}

.filterate-items:nth-child(n + 2) {
  margin-top: 15px;
}

.filterate-item {
  flex: 0 0 25%;
  max-width: 25%;
}
.filterate-item-form {
  display: flex;
  white-space: nowrap;
  align-items: center;
  margin-right: 50px;
}
.filterate-item-form > div:first-child {
  flex: none;
  min-width: 70px;
  text-align: right;
}

.filterate-operation {
  flex: 0;
  display: flex;
  justify-content: flex-end;
  align-self: flex-start;
}

.filterate-operation-toggle {
  width: 60px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 12px;
}
</style>
