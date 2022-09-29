<!-- 单个表单组件 PS：配合HYForm.js使用 -->
<template>
  <!-- 输入框 -->
  <a-input v-if="form.type == 'input'" style="width:100%"
           :placeholder="form.placeholder || `请输入${form.title}`" v-model="form.value" allow-clear
           :disabled="form.disabled" @keyup.13="onChangeAction($event,form)"
           @change="onChangeAction($event,form)" @input="form.onInput ? form.onInput(form) : ''"
           @blur="onBlurAction($event,form)">
  </a-input>
  <!-- 多行输入 -->
  <a-textarea v-else-if="form.type == 'textarea'" v-model="form.value" :disabled="form.disabled"
              allow-clear style="width:100%" :auto-size="form.autoSize"
              @keyup.13="onChangeAction($event,form)" @change="onChangeAction($event,form)"
              @blur="onBlurAction($event,form)">
  </a-textarea>
  <!-- 时间组件 -->
  <a-date-picker v-else-if="form.type == 'time'"
                 :placeholder="form.placeholder || `请选择${form.title}`" style="width:100%"
                 v-model='form.value' :value-format="form.valueFormat || 'YYYY-MM-DD'"
                 :disabled="form.disabled" @change="onChangeAction($event,form)"
                 @blur="onBlurAction($event,form)" />
  <!-- 时间范围 -->
  <a-range-picker v-else-if="form.type == 'rangeTime'" :placeholder="['开始日期', '结束日期']"
                  style="width:100%" v-model='form.value'
                  :value-format="form.valueFormat || 'YYYY-MM-DD'" :disabled="form.disabled"
                  @change="onChangeAction($event,form)" :ranges="form.ranges"
                  @blur="onBlurAction($event,form)" />
  <!-- 级联选择器 -->
  <a-cascader v-else-if="form.type == 'cascader'" :change-on-select="form.changeOnSelect"
              style="width:100%" v-model="form.value" :options="form.options" allow-clear
              :placeholder="form.placeholder || `请选择${form.title}`" :fieldNames="form.fieldNames"
              @change="onChangeAction($event,form)" @blur="onBlurAction($event,form)"
              :disabled="form.disabled" :load-data="form.onLoadData" />
  <!-- 单选 -->
  <a-select v-else-if="form.type == 'select'" style="width:100%" :mode="form.mode || 'default'"
            :placeholder="form.placeholder || `请选择${form.title}`" v-model="form.value"
            :options="form.options" @change="onChangeAction($event,form)" :disabled="form.disabled"
            @blur="onBlurAction($event,form)" allow-clear>
  </a-select>
  <!-- 树 -->
  <a-tree-select v-else-if="form.type == 'tree'" style="width:100%"
                 :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="form.options"
                 v-model="form.value" @change="onChangeAction($event,form)"
                 @blur="onBlurAction($event,form)" :disabled="form.disabled"
                 :placeholder="form.placeholder || `请选择${form.title}`" allowClear>
  </a-tree-select>
  <!-- 照片 -->
  <a-upload v-else-if="form.type == 'file'" :accept="form.accept" :multiple="true"
            :listType="form.listType || 'picture-card'" :before-upload="beforeUploadFile"
            :disabled="form.disabled" :file-list="form.value" :remove="removeClick">
    <div v-if="!form.disabled && form.value.length < form.maxSize">
      <a-icon type="plus" />
      <div>
        上传文件
      </div>
    </div>
  </a-upload>
</template>
<script >
export default {
  name: 'SingleForm',
  abstract: true,
  props: {
    form: {
      type: Object,
      require: true,
    }
  },
  data() {
    return {
    }
  },
  computed: {
  },
  components: {},
  created() {
  },
  mounted() {
  },
  methods: {
    onChangeAction: function (val, form) {
      form.onChange && form.onChange(val, form)
      this.$emit("change", { val, form })
    },
    onBlurAction: function (val, form) {
      this.$emit("blur", { val, form })
    },
    /**
     * 点击删除
     */
    removeClick: function (file) {
      if (this.form.remove) {
        this.form.remove(file)
      } else {
        let fileIndex = this.form.value.findIndex(e => e.uid == file.uid)
        this.$confirm({
          title: `确定要删除${file.name}吗?`,
          onOk: () => {
            this.form.value.splice(fileIndex, 1)
          }
        })
      }
      return false
    },
    /**
     * 获取文件
     */
    beforeUploadFile: function (file) {
      if (this.form.beforeUploadFile) {
        return this.form.beforeUploadFile(file)
      }
      return false
    }
  }
};
</script>
<style lang='less' scoped>
</style>
