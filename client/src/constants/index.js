const Cookies = require("js-cookie")

export const getCookie = key =>{
  return Cookies.get(key);
}