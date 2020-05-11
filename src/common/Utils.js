import Taro from "@tarojs/taro"
import MD5 from 'md5'

import { get as getAppContext, set as setAppContext, setWithStorage, initFromStorage, removeWithStorage } from "./AppContext"
import CONST from './Constants'
import CFG from './Config'
import Cookies from 'js-cookie'
import Http from "./HttpInteceptor";

/**
 * 是否已登录
 * @returns {boolean}
 */
export function isLoggedIn() {
   // return getAppContext(CONST.USER) ? true : false
  return Cookies.get('UserToken') ? true : false
}

/**
 * 从cookie中读取jwttoken
 * @returns {*}
 */
export function getJWTToken() {
  return Cookies.get('JWT-TOKEN')
}

export function getAPIAccessHeadersFromCookies() {
  console.log(Cookies.get('X-Device-ID'), 'dayin1')
  return {
    'X-Device-ID': Cookies.get('X-Device-ID'),
    'X-OS': Cookies.get('X-OS'),
    'X-App-ID': Cookies.get('X-App-ID'),
    'X-Access-Token': Cookies.get('X-Access-Token')
  }
}

export function initAPIAccessHeaderstoCookies() {
  let httpHeaders = {
    'X-Device-ID': 'SWAN-DEVTOOLS',
    'X-OS': 'iOS',
    'X-App-ID': CFG.PROJECT_NAME,
  };
  httpHeaders["X-Access-Token"] = '49e03bafcd42b54ea921b8330f4968e1';
  console.log('initAPIAccessHeaderstoCookies:', httpHeaders);
  Taro.setStorage('X-Device-ID', httpHeaders["X-Device-ID"]);
  console.log(Taro.getStorage('X-Device-ID'), 'dayin')
  Cookies.set('X-Device-ID', httpHeaders["X-Device-ID"], { path: '/', domain: 'csdn.net' });
  console.log(Cookies.get('X-Device-ID'),'dayinzhong')
  Cookies.set('X-OS', httpHeaders["X-OS"], { path: '/', domain: 'csdn.net' });
  Cookies.set('X-App-ID', httpHeaders["X-App-ID"], { path: '/', domain: 'csdn.net' });
  Cookies.set('X-Access-Token', httpHeaders["X-Access-Token"], { path: '/', domain: 'csdn.net' });
}


/**
 * 广告展示开关
 * 暂时以是否登录用户作为控制开关
 * @returns {boolean}
 */
export function adDisplay() {
  return isLoggedIn()
}

/**
 * 登录重定向
 */
export function loginRedirect() {
  Taro.redirectTo({ url: '/pages/login/login' })
}

/**
 * 登录拦截
 */
export function loginInteceptor() {
  if (!isLoggedIn()) {
    Taro.redirectTo({ url: '/pages/login/login' })
  }
}

/**
 * 退出登录（登录信息重置）
 */
export function loginReset() {
  removeWithStorage(CONST.USER);
  removeWithStorage(CONST.API_ACCESS_TOKEN)
}

/**
 * 当前登录
 * @returns {*}
 */
export function getCurrentUser() {
  return getAppContext(CONST.USER)
}

/**
 * 设置当前用户
 * @param user
 * @returns {*}
 */
export function setCurrentUser(user) {
  setAppContext(user);
  return user
}

/**
 * 初始化登录状态
 */
export function initLoginState() {
  let userInfo = initFromStorage(CONST.USER, true);
  console.log('initLoginState:userInfo:', userInfo)
}

export function initLoginStateFromCookie() {
  let userName = Cookies.get('UserName')
  if (userName) {
    let userInfo = {
      userName: userName,
      avater: getUserAvatar(userName)
    };
    setAppContext(CONST.USER, userInfo)
    log('initLoginStateFromCookie', userInfo)
  }
}

/**
 * 保存用户信息到localStorage
 * @param userInfo
 */
export function saveUserInfo(userInfo) {
  /*
    setAppContext(CONST.USER,userInfo);
    Taro.setStorage({
      key: CONST.USER,
      data: userInfo
    })
  */
  setWithStorage(CONST.USER, userInfo)
}

/**
 * 根据用户名获取用户头像地址
 * @param userName
 * @returns {string}
 */
export function getUserAvatar(userName) {
  let au = MD5(userName.toLowerCase()).substring(0, 3).toUpperCase();
  return 'https://profile.csdnimg.cn/' + au + '/2_' + userName
}


/**
 * 初始化网关所需的header头信息
 */
export function initApiAccessHeaders() {
  let httpHeaders = initFromStorage(CONST.API_ACCESS_HEADERS, true);
  // console.info('initApiAccessHeaders:stroage:',httpHeaders);
  if (!httpHeaders) {
    setAppContext(CONST.API_ACCESS_HEADERS, { 'X-Device-ID': "SWAN-DEVTOOLS", 'X-OS': "iOS", 'X-App-ID': "SEED_TAROAPP", 'X-Access-Token': "49e03bafcd42b54ea921b8330f4968e1" });
    //获取swanid
    const swanPromise = new Promise(function (resolve, reject) {
      if (process.env.TARO_ENV === 'h5') {
        resolve('SEED_TAROAPP')
      } else if (process.env.TARO_ENV === 'weapp') {
        resolve('weapp_unionid')
      } else {
        // Taro.getSwanId({
        //   success: (res) => {
        //     resolve(res.data.swanid)
        //   },
        //   fail: (err) => {
        //     reject(err)
        //   }
        // })
      }
    });

    // 获取操作系统类型  Android/iOS

    const systemPromise = new Promise(function (resolve, reject) {
      if (process.env.TARO_ENV === 'h5') {
        resolve('h5')
      } else {
        Taro.getSystemInfo({
          success: (res) => {
            resolve(res.system ? res.system.split(" ")[0] : '')
          },
          fail: (err) => {
            reject(err)
          }
        })
      }
    });

    //保存httpHeaders到内存和storage中
    Promise.all([swanPromise, systemPromise]).then(([swanid, system]) => {
      console.log('initPlantforminfo promise.All', swanid, system, CFG.PROJECT_NAME);
      httpHeaders = {
        'X-Device-ID': swanid,
        'X-OS': system,
        'X-App-ID': CFG.PROJECT_NAME,
      };
      let authorizationStr = httpHeaders["X-Device-ID"] + httpHeaders["X-OS"] + httpHeaders["X-App-ID"] + CONST.API_SECRET_KEY;
      httpHeaders["X-Access-Token"] = MD5(authorizationStr);
      //console.log('API_ACCESS_HEADERS:',authorizationStr,'----',httpHeaders["X-Access-Token"])
      //保存到内存和磁盘中
      setWithStorage(CONST.API_ACCESS_HEADERS, httpHeaders)
    }).catch((e) => {
      console.error('initPlantforminfo promise.All:error', e)
    })
  }
  // console.log('initApiAccessHeaders:',httpHeaders);
  return httpHeaders
}


export function getApiAccessHeaders() {
  // console.log('getApiAccessHeaders:',getAppContext(CONST.API_ACCESS_HEADERS));
  return getAppContext(CONST.API_ACCESS_HEADERS)
}

export function setApiAccessToken(token) {
  setWithStorage(CONST.API_ACCESS_TOKEN, token)
}

export function getApiAccessToken() {
  return getAppContext(CONST.API_ACCESS_TOKEN)
}


export function initApiAccessToken() {
  let token = initFromStorage(CONST.API_ACCESS_TOKEN);
  initFromStorage(CONST.API_ACCESS_USER_TOKEN);
  // console.log('initApiAccessToken:token:',token);
}


export function setApiAccessUserToken(token) {
  setWithStorage(CONST.API_ACCESS_USER_TOKEN, token)
}


export function getApiAccessUserToken() {
  return getAppContext(CONST.API_ACCESS_USER_TOKEN)
}

export function initOrderInfo() {
  let orderInfo = initFromStorage(CONST.ORDER_INFO, true)
  console.log('initOrderInfo', orderInfo)
}

export function setOrderInfo(orderInfo) {
  setWithStorage(CONST.ORDER_INFO, orderInfo)
}


export function getOrderInfo() {
  return getAppContext(CONST.ORDER_INFO)
}
export function setUseList(userList) {
  
  setWithStorage(CONST.USELIST, userList)
}
export function setNoUseList(userList) {
  setWithStorage(CONST.NOUSELIST, userList)
}
export function getUseList() {
  return getAppContext(CONST.USELIST)
}
export function getNoUseList() {
  return getAppContext(CONST.NOUSELIST)
}
// export function setPaymentInfo(info) {
//   setWithStorage(CONST.PAYMENT_INFO, info)
// }

// export function getPaymentInfo() {
//   let payInfo = getAppContext(CONST.PAYMENT_INFO)
//   if (!payInfo) {
//     return initFromStorage(CONST.PAYMENT_INFO, true)
//   }
// }

export function setPaymentType(info) {
  setWithStorage(CONST.PAYMENT_TYPE, info)
}

export function getPaymentType() {
  return getAppContext(CONST.PAYMENT_TYPE)
}

export function initPaymentType() {
  let orderInfo = initFromStorage(CONST.PAYMENT_TYPE, true)
  console.log('initOrderInfo', orderInfo)
}

// export function setOrderTypeFlag(type) {
//   setWithStorage(CONST.ORDER_TYPE, type)
// }

// export function getOrderTypeFlag() {
//   let payInfo = getAppContext(CONST.ORDER_TYPE)
//   if (!payInfo) {
//     return initFromStorage(CONST.ORDER_TYPE, true)
//   }
// }


// 获取sessionID
export function getSessionId() {
  console.log('Cookies======', Cookies.get('X-OS'), Cookies.get('version'))
  // Taro.showModal({
  //   'content':(Cookies.get('platform')+ Cookies.get('version') ) || ''
  // })
  let platform = ''
  let version = ''
  if (Cookies.get('X-OS')) {
    platform = Cookies.get('X-OS').toUpperCase() || ''
  }
  if (Cookies.get('version')) {
    version = Cookies.get('version').toUpperCase() || ''
  }
  return `WEB_APP-${platform}-${version}`
}



/**
 * 设置模式
 * @param swanMode true:swan模式，false:h5模式
 */
export function setSettingSwanMode(swanMode) {
  console.log('设置全局开关：', swanMode);
  setWithStorage(CONST.SETTING_SWAN_MODE, swanMode)
}


/**
 * 返回当前设置模式
 * @returns {*|boolean}
 */
export function getSettingSwanMode() {
  let swanMode = getAppContext(CONST.SETTING_SWAN_MODE);
  if (swanMode === undefined) {
    return CONST.SETTING_SWAN_MODE_DEFAULT
  } else {
    return swanMode
  }
}

/**
 * 初始化设置模式
 */
export function initSettingSwanMode() {
  let initSwanMode = initFromStorage(CONST.SETTING_SWAN_MODE);
  console.log('initSettingSwanMode', initSwanMode)
}

//缓存重置
export function resetStorage() {

}


/**
 * 注销登录状态
 * @returns {Promise<any>}
 */
export function logout() {
  return new Promise((resolve, reject) => {
    setAppContext(CONST.USER, null);
    setAppContext(CONST.API_ACCESS_TOKEN);
    Taro.removeStorage({
      key: CONST.USER,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}
// 格式化时间的函数
function addZero(num) {
  return num < 10 ? '0' + num : num
}
export function formatTime(timestamp) {
  timestamp = Number(timestamp);
  var date = new Date(timestamp);
  var year = date.getFullYear();
  var month = addZero(date.getMonth() + 1);
  var day = addZero(date.getDate());
  var hours = addZero(date.getHours());
  var minutes = addZero(date.getMinutes());
  var seconds = addZero(date.getSeconds());
  return year + '-' + month + '-' + day
}
export function throttle(fn, wait = 1000, param = '') {
  let _lastTime = null;
  return function () {
    const _newTime = Date.now();
    if (!_lastTime || _newTime - _lastTime >= wait) {
      fn(this, param)
    }
    _lastTime = _newTime
  }
}
// 通过对象数组的catCode进行去重数组
export function unique(arr) {
  const res = new Map();
  return arr.filter((a) => !res.has(a.catCode) && res.set(a.catCode, 1))
}
export function fomatNum(obj) {
  if (obj instanceof Object) {
    //console.log(obj,"obj====")
    Object.values(obj).map((item, index) => {
      if (Object.keys(obj)[index] !== 'BlogId' && Object.keys(obj)[index] !== 'Rank' && Object.keys(obj)[index] !== 'ViewCount' && Object.keys(obj)[index] !== 'OriginalCount' && Object.keys(obj)[index] !== 'RepostCount' && Object.keys(obj)[index] !== 'TranslatedCount') {
        item = item || 0;
        item = parseInt(item);
        if (item >= 1000 && item < 10000) {
          item = parseInt(item / 1000) + 'k+'
        } else if (item >= 10000) {
          item = parseInt(item / 10000) + 'w+'
        } else {
        }
        obj[Object.keys(obj)[index]] = item;
        return item
      }
    })

  }
  return obj
}
export function changeDay(array) {
  if (array) {
    var array = JSON.parse(JSON.stringify(array));
    var newArray = array.forEach((item) => {
      if (item.create_at) {
        var dayarray = item.create_at.split(' ');
        item.create_at = dayarray[0]
      }
      if (item.UpdateTime) {
        var dayarray = item.UpdateTime.split(' ');
        item.UpdateTime = dayarray[0]
      }
      if (item.created_at) {
        var dayarray = item.created_at.split(' ');
        item.created_at = dayarray[0]
      } else if (item.postTime) {
        let dayarray = item.postTime.split(' ');
        item.postTime = dayarray[0]
      }
      if (item.last_post_created_at) {
        var dayarray = item.last_post_created_at.split(' ');
        console.log(dayarray);
        item.last_post_created_at = dayarray[0]
      }

    })
  }

  return array
}


export function addFocus(array) {
  if (array) {
    var array = JSON.parse(JSON.stringify(array));
    var newArray = array.forEach((item) => {
      item.isFocus = 0
    })
  }

  return array
}

export function RegFix() {
  const reg = /(\<em\>(\S*)\<\/em\>)/g;
  const reg1 = /^\<em\>(\s*\S*)\<\/em\>$/g;
  var str = '';
  var str1 = '';
  var patt1 = new RegExp(/(\<em\>(\S*)\<\/em\>)/g);
  if (response.data.hits) {
    var newArray = response.data.hits.forEach((item) => {
      if (item._source.title) {
        if (patt1.test(item._source.title)) {
          item._source.title.replace(reg, ($0, $1, $2) => {
            str = $0;
            str.replace(reg1, ($0, $1) => {
              str1 = `<Text style='color : #CA0C16;'>${$1}</Text>`
            });
            console.log(str1, item._source.title, item._source.title.replace(reg, str1));
            item._source.title = item._source.title.replace(reg, str1)
          });
          this.state.replace = this.state.replace + 1
        }

      }
      if (item._source.description) {

        item._source.description.replace(reg, ($0, $1, $2) => {
          str = $0;
          str.replace(reg1, ($0, $1) => {
            str1 = `<Text style='color : #CA0C16;'>${$1}</Text>`
          });
          item._source.description = item._source.description.replace(reg, str1)
        })

      }
    })
  }
}
//十位时间戳转化为日期
export function timestampToTime(timestamp) {
  var tempString = '' + timestamp;
  // console.log('timestamp========', timestamp);
  if (tempString.length === 13) {
    timestamp = timestamp / 1000
  }
  function zeroize(num) {
    return (String(num).length == 1 ? '0' : '') + num;
  }
  var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
  var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
  var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
  var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象
  var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
  var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
  if (timestampDiff < 60) { // 一分钟以内
    return "刚刚";
  } else if (timestampDiff < 3600) { // 一小时之内
    return Math.floor(timestampDiff / 60) + "分钟前";
  } else if (timestampDiff / 3600 >= 1 && timestampDiff / 3600 < 24) { // 24小时前
    return Math.floor(timestampDiff / 3600) + "小时前";
  } else {
    var newDate = new Date((curTimestamp - 86400) * 1000); // 参数中的时间戳加一天转换成的日期对象
    if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
      return '昨天' + zeroize(H) + ':' + zeroize(i);
    } else if (timestampDiff / 3600 / 24 <= 9) {
      return Math.floor(timestampDiff / 3600 / 24) + '天前'
    } else if (curDate.getFullYear() == Y) {
      return zeroize(m) + '-' + zeroize(d)
    } else {
      return Y + '-' + zeroize(m) + '-' + zeroize(d)
    }
  }
}
// 字节换算
export function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  var k = 1000, // or 1024
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}

/**
 *
 * @param webUrl
 * @returns {string}
 * 将Web地址映射为小程序地址
 * urlMapping规则：router需要与urlMapping需要保持一致，后台配置同步 https://smartprogram.baidu.com/developer/urlmapping.html?appId=14948511
 */
export function toSwanUrl(webUrl) {
  const urlMapping = new Map([
    ['https://www.csdn.net', 'pages/index/index'],
    ['https://blog.csdn.net/([^\\/\\.\\-]+)/article/details/([^\\/\\.\\-]+)', 'pages/blog/article-detail?userName=${1}&articleId=${2}'],
    ['https://blog.csdn.net/([^\\/\\.\\-]+)', 'pages/user/index?userName=${1}&type=blog'],
    ['https://blog.csdn.net/([^\\/\\.\\-]+)/article/month/([^\\/\\.\\-]+)/([^\\/\\.\\-]+)', 'pages/user/index?userName=${1}&year=${2}&month=${3}'],
    ['https://blog.csdn.net/([^\\/\\.\\-]+)/column/info/([^\\/\\.\\-]+)', 'pages/blog/column?userName=${1}&columnId=${2}'],
    ['https://download.csdn.net/download/([^\\/\\.\\-]+)/([^\\/\\.\\-]+)', 'pages/download/download-detail?userName=${1}&downloadId=${2}'],
    ['https://download.csdn.net/user/([^\\/\\.\\-]+)', 'pages/user/index?userName=${1}&type=download'],
    ['https://bbs.csdn.net/topics/([^\\/\\.\\-]+)', 'pages/bbs/topic-detail?topicId=${1}'],
    ['https://me.csdn.net/([^\\/\\.\\-]+)', 'pages/user/index?userName=${1}'],
    ['https://so.csdn.net/so/search/s\\.do\\?q=([^&]+)&t=([^&]+)', 'pages/search/index?searchWord=${1}&type=${2}']
  ]);
  let swanUrl = 'pages/index/index';
  for (let [webUrlReg, swanUrlPage] of urlMapping) {
    swanUrlPage = swanUrlPage.replace(/(\$\{)/g, '$').replace(/(\})/g, '');
    let reg = new RegExp(webUrlReg);
    if (reg.test(webUrl)) {
      swanUrl = webUrl.replace(reg, swanUrlPage);
      break;
    }
    console.log('for:', webUrlReg, swanUrlPage)
  }
  return swanUrl
}
// 数组拆分
export function split_array(arr, len) {
  var a_len = arr.length;
  var result = [];
  for (var i = 0; i < a_len; i += len) {
    result.push(arr.slice(i, i + len));
  }
  return result;
}

/**
 * 跳转到APP对应页面
 * @param url
 * @constructor
 */
export function AppNavigatorTo(url) {
  window.open(url)
}
export function AppNavigatorToLocation(url) {
  window.location.href = url
}
/**
 * 跳转到下载详情页
 * @param url
 * @constructor
 */
export function AppNavigatorToDownloadDetail(userName, downloadId) {
  AppNavigatorToLocation(`https://download.csdn.net/download/${userName}/${downloadId}`)
}
/**
 * 跳转到课程详情页
 * @param courseId
 * @constructor
 */

export function AppNavigatorToCourseDetail(courseId) {
  window.location.href = `https://edu.csdn.net/course/detail/${courseId}`
 // AppNavigatorTo(`https://edu.csdn.net/course/detail/${courseId}`)
}
// 普通时间戳转化
export function ordertimestamp(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = change(date.getDate()) + ' ';
  const h = change(date.getHours()) + ':';
  const m = change(date.getMinutes())
  return Y + M + D + h + m
}
//转盘抽奖历史时间戳转换
export function historytimestamp(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const Y = date.getFullYear() + '-';
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  const D = change(date.getDate());
  return Y + M + D
}
function change(t) {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}

export function log(path = 'info', data) {
  // Http.get(` https://statistic.csdn.net/webapp/${path}`, data)
}

