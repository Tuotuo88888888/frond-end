//验证
export default class FieldValidator {
  /**
   * Creates an instance of FieldValidator.
   * @param {string} txtId    文本框的id
   * @param {string} validatorFunc    验证规则函数
   * @memberof FieldValidator
   */
  constructor(txtId, validatorFunc) {
    this.input = document.querySelector("#" + txtId);
    this.p = this.input.parentElement.nextElementSibling;
    this.validatorFunc = validatorFunc;
    this.input.addEventListener("input", this.validate.bind(this));
  }
  async validate() {
    const err = await this.validatorFunc(this.input.value);
    if (err) {
      this.p.innerHTML = err;
      return false;
    } else {
      this.p.innerHTML = " ";
      return true;
    }
  }

  /**
   *
   * @param  {FieldValidator[]} validators
   */
  static async validate(...validators) {
    const proms = validators.map((i) => i.validate());
    const results = await Promise.all(proms);
    return results.every((r) => r);
  }
}
