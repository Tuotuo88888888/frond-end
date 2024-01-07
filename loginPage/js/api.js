import { delay, generateRandomCode } from "./common.js";
class Response {
  static success = (data) => ({ code: 0, data });
  static error = (data) => ({ code: 404, data });
}

//api 模拟
export async function login(userInfo) {
  await delay(1000);
  return Response.success(userInfo);
}
export async function sendVerificationCode(phone) {
  await delay(1000);
  const vCode = generateRandomCode(6);
  localStorage.setItem("vCode", vCode);
  return Response.success({ phone, code: vCode });
}
