import Taro from "@tarojs/taro";

/**
 * APP应用上下文：用于保存全局变量，内存存储
 * @type {{}}
 */
const appContext = {};

/**
 * 保存变量
 * @param key
 * @param val
 */
export function set (key, val) {
  appContext[key] = val
}

/**
 * 获取变量
 * @param key
 * @returns {*}
 */
export function get (key) {
  return appContext[key]
}

/**
 * 从磁盘加载到内存(APP启动时)
 * @param key appContext中的key
 */
export function initFromStorage(key, isJsonStr = false) {
  let val = Taro.getStorageSync(key);
  if (val!=='') {
    set(key, isJsonStr?JSON.parse(val):val)
  }
  return get(key)
}

/**
 * 保存到磁盘(需要变更值时处理)
 * @param key appContext中的值
export function saveToStorage(key, isJson = false){
  let val = get(key);
  Taro.setStorage({
    key: key,
    data: isJson?JSON.stringify(val):val
  })
}*/

/**
 * 保存变量，同时做持久化(异步）
 * @param key
 * @param val
 */
export function setWithStorage(key,val){
  set(key,val);
  let serializeVal = typeof val === 'object' ? JSON.stringify(val) : val;
  console.log('setStorage',key,val,serializeVal);
  Taro.setStorage({
    key: key,
    data: serializeVal
  })
}

export function removeWithStorage(key){
  set(key,null);
  Taro.removeStorage({key:key})
}


