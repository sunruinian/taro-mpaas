import Taro from '@tarojs/taro'
import { getApiAccessHeaders, getApiAccessToken, getApiAccessUserToken, getCurrentUser,getJWTToken,getAPIAccessHeadersFromCookies } from './Utils'
import Cookies from 'js-cookie'
const HttpInteceptor = {

  request(params, method = 'GET', httpHeaders) {
    let { url, data } = params;
    // let token = getApp().globalData.token
    // if (!token) login()
    console.log('params', arguments);
    if(!data.noloading){
      Taro.getSystemInfo({
        success: (res) => {
          if (res.system && res.system === 'iOS') {

          } else {
            Taro.showLoading({
              title: '加载中'
            })
          }
        },
        fail: (err) => {
          // reject(err)
        }
      })
    }
    //统一设置默认编码格式
    let defaultHeader = {
      'content-type': 'application/json'
    };

    //统一设置默认TOKEN
    if (getAPIAccessHeadersFromCookies()&&url.indexOf('passport.csdn.net') > -1) {
      defaultHeader=Object.assign(defaultHeader,getAPIAccessHeadersFromCookies())
    }


    let jwtToken=getJWTToken();
    console.log(getAPIAccessHeadersFromCookies(), '打印方法');
    if (jwtToken&&url.indexOf('gw.csdn.net') > -1) {
        defaultHeader['JWT-TOKEN']=getJWTToken()
        defaultHeader = Object.assign(defaultHeader, getAPIAccessHeadersFromCookies())
    }
    console.log('defaultHeader:',defaultHeader)
    let newHeaders = Object.assign({}, defaultHeader, httpHeaders);
    console.log('httpInteceptor:newHeaders', newHeaders);
    const option = {
      isShowLoading: false,
      loadingText: '正在加载',
      url: url + '?projectVersion=' + '1.0.0', //eslint-disable-line
      data: data,
      method: method,
      header: newHeaders,
      credentials: 'include',
      mode: 'cors',
      success(res) {
        // console.log('success:',res)
        // console.log('HttpInteceptor:sucess',res);
        /*if (res.statusCode === HTTP_STATUS.NOT_FOUND) {
          return logError('api', '请求资源不存在')
        } else if (res.statusCode === HTTP_STATUS.BAD_GATEWAY) {
          return logError('api', '服务端出现了问题')
        } else if (res.statusCode === HTTP_STATUS.FORBIDDEN) {
          return logError('api', '没有权限访问')
        } else if (res.statusCode === HTTP_STATUS.SUCCESS) {
          return res.data
        }*/
        /*        console.log("success:",res.statusCode)
                // TODO : 待完善
                if(res.statusCode === 200){
                  return res.data
                }else if(res.statusCode === 401){
                  Taro.navigateTo({ url: `/pages/login/login`});
                  return {
                    'statusCode': res.statusCode,
                    'data': '没有权限访问!'
                  }
                }else if(res.statusCode === 418){
                  return {
                    'statusCode': res.statusCode,
                    'data': '网络繁忙，请稍后!'
                  }
                }else{
                  return {
                    'statusCode': res.statusCode,
                    'data': '系统异常，请稍后重试!'
                  }
                }*/
        Taro.hideLoading()
      },
      error(e) {
        Taro.hideLoading()
        console.error('api', '请求接口出现问题', e)
      }
    };

    return new Promise((resolve, reject) => {
      Taro.request(option).then(res => {
        Taro.hideLoading()
        // console.log('HttpResponseInteceptor:success', option, res);
        console.log('res.statusCode=======', res.statusCode)
        if (process.env.TARO_ENV === 'swan' && res.statusCode != 200) {
          if (res.statusCode != 200) {
            // Taro.reportAnalytics('service_error', {
            //   code: res.statusCode + ''
            // });
          }
        }
        if (res.statusCode === 200) {
          // console.log('res========',res)
          resolve(res.data && typeof res.data === 'object' ? res.data : JSON.parse(res.data))
        } else if (res.statusCode === 401) {
          if(window.navigator.userAgent.indexOf('CSDN')>-1){
            window.location.href='https://passport.csdn.net/account/login'
          }else{
            Taro.navigateTo({ url: `/pages/login/login` });
          }
          reject({
            'statusCode': res.statusCode,
            'data': '没有权限访问!'
          })
        } else if (res.statusCode === 418) {
          reject({
            'statusCode': res.statusCode,
            'data': '网络繁忙，请稍后!'
          })
        } else {
          // 500报错进入 404进入 安卓手机状态码404走这里
          reject({
            'statusCode': res.statusCode,
            'data': '系统异常，请稍后重试!'
          })
        }

      }, error => {
        Taro.hideLoading()
        console.log('HttpInteceptor:Error', JSON.stringify(error));
        if (error.errMsg && error.errMsg.indexOf('401') > -1) {
          if (process.env.TARO_ENV === 'swan') {
            // Taro.reportAnalytics('service_error', {
            //   code: '401'
            // });
          }
          if(window.navigator.userAgent.indexOf('CSDN')>-1){
            window.location.href='https://passport.csdn.net/account/login'
          }else{
            Taro.navigateTo({ url: `/pages/login/login` });
          }
          reject({
            'statusCode': 401,
            'data': '没有权限访问!'
          })
        } else if (error.response) {
          reject(error.response.data)
        } else {
          // error ios 状态码走这里
          if (error.errMsg && error.errMsg.indexOf('404') > -1) {
            reject({
              'statusCode': 404,
              'data': '404页面'
            })
          } else {
            reject(error)
          }
        }
      })
    })
  },
  get(url, data = {}, httpHeaders) {
    let option = { url, data };
    return this.request(option, 'GET', httpHeaders)
  },
  post: function (url, data, httpHeaders) {
    let params = { url, data };
    return this.request(params, 'POST', httpHeaders)
  }
};

export default HttpInteceptor
