// 返回唯一标识UID
let uidIndex = 0;
export const getUID = () => {
  return `${new Date().getTime()}-${++uidIndex}`;
};

class HYForm {
  /**
   *
   * @param {String} title 标题
   * @param {String} type 类型
   * @param {String} key key
   * @param {String} defaultValue 默认值
   * @param {Array} options 选项
   * @param {String} placeholder
   * @param {any} initValue 重置值
   * @param {Function} getParams 自定义拼接参数
   * @param {Object} style
   */
  constructor(form = { placeholder: "" }) {
    Object.keys(form).forEach((key) => {
      this[key] = form[key];
    });
    this.id = getUID();
    this.disabled = this.disabled || false;
    this.value = form.defaultValue;
    this.style = form.style || {};
    if (form.initValue != undefined) {
      this.initValue = HYForm.deepCopy(form.initValue);
    } else if (form.defaultValue != undefined) {
      this.initValue = HYForm.deepCopy(form.defaultValue);
    }

    // const that = this;
    // this.endDisabledDate = function (current) {
    //   if (that.value && that.value.length > 1 && that.value[0]) {
    //     return current && current < moment(that.value[0]);
    //   }
    //   return false;
    // };
  }

  static initInputForm(form = { title: "", key: "" }) {
    return new HYForm({
      ...form,
      type: "input",
      placeholder: form.placeholder || `请输入${form.title}`,
    });
  }

  /**
   * 多行输入
   */
  static initTextareaFrom(form = { title: "", key: "" }) {
    return new HYForm({
      ...form,
      type: "textarea",
      placeholder: form.placeholder || `请输入${form.title}`,
    });
  }

  /**
   *
   * @param {String} accept 接收上传的文件类型
   * @param {String} listType 显示文件的样式 参考ant-design-vue a-upload listType
   * @returns
   */
  static initFileForm(form = { title: "" }) {
    return new HYForm({
      ...form,
      type: "file",
      maxSize: form.maxSize || 9,
      defaultValue: form.value || [],
      placeholder: form.placeholder,
      beforeUpload: form.beforeUpload,
    });
  }
  /**
   * 插槽- 用于需要自定义的时候
   * @returns
   */
  static initSlotForm(form = { title: "" }) {
    return new HYForm({
      ...form,
      type: "slot",
      placeholder: form.placeholder,
    });
  }

  // 选择类型
  static initSelectForm(form = { title: "", key: "", options: [] }) {
    return new HYForm({
      ...form,
      type: "select",
      placeholder: form.placeholder || `请选择${form.title}`,
      onChange: form.onChange || (() => true),
    });
  }
  // 级联选择类型
  static initCascaderForm(
    form = { title: "", key: "", options: [], aliasValue: "" }
  ) {
    return new HYForm({
      ...form,
      type: "cascader",
      aliasValue: form.aliasValue || "",
      placeholder: form.placeholder || `请选择${form.title}`,
      defaultValue: form.defaultValue || form.value || [],
      onChange: form.onChange || (() => true),
    });
  }
  // 树形
  static initTreeForm(form = { title: "", key: "", options: [] }) {
    return new HYForm({
      ...form,
      type: "tree",
      placeholder: form.placeholder || `请选择${form.title}`,
      onChange: form.onChange || (() => true),
    });
  }
  // 时间类型 key
  static initTimeForm(form = { title: "", key: [], value: [] }) {
    return new HYForm({
      ...form,
      type: "time",
      onChange: form.onChange || (() => true),
    });
  }
  // range时间类型 key
  static initRangeTimeForm(form = { title: "", key: [], value: [] }) {
    return new HYForm({
      ...form,
      type: "rangeTime",
      defaultValue: form.value || [undefined, undefined],
      onChange: form.onChange || (() => true),
    });
  }

  //
  static initRadioForm(form = { title: "", key: "" }) {
    return new HYForm({
      ...form,
      type: "radio",
      placeholder: form.placeholder || `请选择${form.title}`,
      defaultValue: form.value || undefined,
      onChange: form.onChange || (() => true),
    });
  }

  static initSwitchForm(form = { title: "", key: "" }) {
    return new HYForm({
      ...form,
      type: "switch",
      onChange: form.onChange || (() => true),
    });
  }

  // 深拷贝
  static deepCopy(target) {
    if (!target || typeof target != "object") {
      return target;
    }
    return JSON.parse(JSON.stringify(target));
  }

  // 重置
  flybackInitValue() {
    this.value = HYForm.deepCopy(this.initValue);
  }

  // 返回参数拼接
  get getFormParams() {
    if (this.getParams) {
      return this.getParams(this);
    }
    switch (this.type) {
      case "rangeTime":
      case "time":
        {
          let param = {};
          if (!this.key || !this.value) {
            return;
          }
          if (Array.isArray(this.key)) {
            this.key.forEach((key, index) => {
              if (this.value[index]) {
                param[key] = this.value[index];
              }
            });
            return param;
          }
          if (typeof this.key == "string") {
            if (this.value && this.value.length > 0 && this.value[0]) {
              param[this.key] = this.value;
            }
          }
          return param;
        }
        break;
      case "cascader":
        {
          let param = {};
          // 联动选择
          if (this.value && this.value.length > 0) {
            param[this.key] = this.value[this.value.length - 1];
          }
          return param;
        }
        break;
      case "file":
        {
          let param = {};
          if (this.value && this.value.length > 0) {
            param[this.key] = this.value.map((file) => file.url).split(",");
          }
          return param;
        }
        break;
      default:
        {
          // 普通输入 选择类型
          let param = {};
          if (typeof this.value == "string") {
            if (this.value && this.value.length > 0) {
              param[this.key] = this.value;
            }
          } else if (typeof this.value == "number") {
            param[this.key] = this.value;
          }
          return param;
        }
        break;
    }
  }
}

export default HYForm;
