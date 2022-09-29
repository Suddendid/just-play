class HYFormModel {
  /**
   *
   * @param {Arrpy<HYForm>} forms 表单数据
   */
  constructor({ forms, disabled }) {
    this.forms = forms;
    this.setDisabled(disabled);
  }

  /**
   * 获取提交参数
   */
  get getParam() {
    return this.forms.reduce((pre, cur) => {
      return {
        ...pre,
        ...cur.children.reduce((sPre, sCur) => {
          return { ...sPre, ...sCur.getFormParams };
        }, {}),
      };
    }, {});
  }

  setDisabled(flag) {
    this.forms.forEach((el) => {
      el.children.forEach((e) => {
        e.disabled = flag;
      });
    });
  }

  /**
   * 通过key获取对应的form
   * @param {String} key
   * @returns
   */
  getFormByKey(key) {
    if (!this.forms || this.forms.length == 0) {
      return null;
    }
    let option = null;
    for (let index = 0; index < this.forms.length; index++) {
      const element = this.forms[index];
      for (let j = 0; j < element.children.length; j++) {
        const form = element.children[j];
        if (form.key == key) {
          option = form;
          break;
        }
      }
    }
    return option;
  }

  setFormValue(key, value) {
    let form = this.getFormByKey(key);
    if (form) {
      form.value = value;
    }
  }

  reset() {
    this.forms.forEach((element) => {
      element.children.forEach((form) => {
        form.flybackInitValue();
      });
    });
  }
}

export default HYFormModel;
