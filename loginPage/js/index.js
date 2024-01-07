(async function () {
  const { login, sendVerificationCode } = await import("./api.js");
  const { default: FieldValidator } = await import("./validator.js");

  //doms
  let doms = {
    form: document.getElementsByTagName("form")[0],
    verificationCodeBtn: document.getElementById("verificationCodeBtn"),
  };

  //主函数
  function main() {
    eventBind();
  }
  main();

  //事件函数
  function eventBind() {
    const userIdValidator = new FieldValidator("txtUserId", async function (
      val
    ) {
      if (!val) {
        return "请填写账号";
      }
    });
    const userNameValidator = new FieldValidator("txtUserName", async function (
      val
    ) {
      if (!val) {
        return "请填写姓名";
      }
    });
    const userPhoneValidator = new FieldValidator(
      "txtUserPhone",
      async function (val) {
        if (!val) {
          return "请填写手机号";
        }
        if (!/^1[3-9]\d{9}$/.test(val)) {
          return "手机号格式不正确";
        }
      }
    );
    const verificationCodeValidator = new FieldValidator(
      "txtVerificationCode",
      async function (val) {
        if (!val) {
          return "请填写验证码";
        }
        const vCode = localStorage.getItem("vCode");
        if (!vCode) {
          return "请发送短信验证，并填写验证码";
        }
        if (vCode.trim().toLowerCase() !== val.trim().toLowerCase()) {
          return "验证码不正确";
        }
      }
    );

    doms.form.addEventListener("submit", async function (e) {
      e.preventDefault();
      const result = await FieldValidator.validate(
        userIdValidator,
        userNameValidator,
        userPhoneValidator,
        verificationCodeValidator
      );
      if (!result) {
        return;
      }
      const formData = new FormData(doms.form);
      const data = Object.fromEntries(formData.entries());
      const resp = await login(data);
      if (resp.code === 0) {
        alert(
          "成功登录，数据是：\n" +
            Object.entries(resp.data)
              .map((i) => `${i[0]}:${i[1]}`)
              .join("\n")
        );
      }
    });
    doms.verificationCodeBtn.addEventListener("click", async function (e) {
      const result = await FieldValidator.validate(userPhoneValidator);
      if (!result) {
        return;
      }
      const phone = userPhoneValidator.value;
      const resp = await sendVerificationCode(phone);
      if (resp.code === 0) {
        alert("成功发送，数据是：\n" + resp.data.code);
      }
    });
  }
})();
