<!-- PC版本 表单组件 -->
<template>
  <div style="width:100%;height:100%">
    <a-form-model ref="ruleForm" :rules="rules" :model="formParam">
      <a-row v-for="(items, index) in formModel.forms" :key="index">
        <a-col :span="24 / items.children.length" v-for="(form) in items.children" :key="form.id">
          <a-form-model-item :ref="form.id" :label-col="{span:items.children.length * 4}"
                             :autoLink="form.autoLink || false"
                             :wrapper-col="{span:(24 - items.children.length * 4)}"
                             :label="form.title" :prop="form.key">
            <single-form :form="form" v-if="form.type != 'slot'" @change="onChangeAction"
                         @blur="onBlurAction">
            </single-form>
            <slot v-else :name="form.key" :form="form">
            </slot>
          </a-form-model-item>
        </a-col>
      </a-row>
      <!-- 提交按钮 -->
      <slot name="action">
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">
            提交
          </a-button>
          <a-button style="margin-left: 10px;" @click="onCancel">
            取消
          </a-button>
        </a-form-model-item>
      </slot>
    </a-form-model>
  </div>
</template>
<script >
import SingleForm from "@/components/form/SingleForm.vue"
export default {
  name: 'FormModel',
  props: {
    formModel: {
      type: Object,
      require: true
    },
    rules: {
      type: Object,
      require: false
    }
  },
  data() {
    return {
    }
  },
  computed: {
    formParam() {
      let form = {};
      this.formModel.forms.forEach((element) => {
        element.children.forEach(e => {
          form[e.key] = e.value
        })
      });
      console.log(form);
      return form;
    }
  },
  components: { SingleForm },
  created() {
  },
  mounted() {
  },
  methods: {
    onChangeAction(e) {
      this.$nextTick(() => {
        let form = e.form
        this.$refs[form.id][0].onFieldChange()
      })
    },
    onBlurAction(e) {
      this.$nextTick(() => {
        let form = e.form
        this.$refs[form.id][0].onFieldBlur()
      })
    },
    onSubmit() {
      this.validate((valid, object) => {
        if (valid) {
          this.$emit("submit", this.formModel.getParam)
        } else {
          console.log('error submit!!', object);
          return false;
        }
      })
    },
    onCancel() {
      this.$emit("cancel")
    },
    validate(handler) {
      this.$refs.ruleForm.validate(handler);
    },
    resetFields() {
      this.$refs.ruleForm.resetFields();
    },
  }
};
</script>
<style lang='less'>
</style>
