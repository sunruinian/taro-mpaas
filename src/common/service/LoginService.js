import {Base64} from 'js-base64'
import Http from '../HttpInteceptor'
import CFG from '../Config'
import {setApiAccessToken,setApiAccessUserToken,initAPIAccessHeaderstoCookies} from "../Utils"
import Cookies from 'js-cookie'
const LoginService = {
  /**
   * 账号密码登录
   * @param userName
   * @param userPwd
   */
  loginByUserName(userName, userPwd) {
    return this.login({
      'userIdentification': userName,
      'pwdOrVerifyCode': userPwd,
      'loginType': '1'
    })
  },
  /**
   * 根据小程序码登录
   * @param code
   * @returns {*|PromiseLike<T|never>|Promise<T|never>}
   */
  loginByCode(code){
    return this.login({
      'openId':code,
      'openSite':'weixin',
      'loginType': '2'
    })
  },
  /**
   * 根据code获取授权信息
   * @param code
   * @param appId
   * @returns {Promise<any>}
   * http://confluence.csdn.net/pages/viewpage.action?pageId=21080686
   */
  getOpenId(code,appId){
    let data={code,appId};
    return new Promise((resolve, reject)=>{
      Http.post(`${CFG.API_PASSPORT_URL}v1/api/app/authorization`, data).then((response)=>{
        resolve(response)
      }).catch((error)=>{
        reject(error)
      })
    });
  },
  loginRegisterByMobile(code, mobile, verifyCode,deviceSignature) {
      //调用登录接口，异常
    const resultPromise = new Promise((resolve, reject)=>{
      this.loginByMobile(code, mobile, verifyCode).then((result)=>{
        console.log('登录成功: userName:',result);
         resolve(result)
      },(loginError)=>{
        console.log('登录失败: 开始执行失败流程',loginError);
        //手机号未绑定CSDN账号： 注册新用户或进入账号绑定流程
        let notRegister = loginError.code === '1017' ? true : false;
        if(notRegister){
          //新用户，未注册：执行注册流程
          this.registerByMobile(code, mobile, verifyCode,deviceSignature).then((result) => {
            console.log('登录失败，注册成功-->登录', result);
            resolve(result)
          }, (registerError) => {
            console.log('注册失败', registerError);
            reject(registerError)
          });
        }else{
          //老用户，登录失败
          console.log('登录失败',loginError);
          reject(loginError)
        }
      })
    });
    return resultPromise
  },
  loginByMobile(code, mobile, verifyCode) {
    return this.login({
      'code': code,
      'userIdentification': mobile,
      'pwdOrVerifyCode': verifyCode,
      'loginType': '0'
    })
  },
  /**
   * 手机号注册
   * @param code
   * @param mobile
   * @param verifyCode
   * @returns {Promise<any>}
   */
  registerByMobile(code, mobile, verifyCode,deviceSignature) {
    let data = {code, mobile, verifyCode};
    return new Promise((resolve,reject)=>{
      Http.post(`${CFG.API_PASSPORT_URL}v1/api/app/register/mobileRegister`, data,{'X-Device-Signature':deviceSignature}).then((response)=>{
        this.handleLoginSuccess(response,resolve,reject)
      }).catch((error)=>{
        reject(error)
      })
    })
  },
  /**
   * 登录API
   * 参考：http://confluence.csdn.net/pages/viewpage.action?pageId=20389179
   * @param data
   * @returns {PromiseLike<T | never> | Promise<T | never>}
   */
  login(data) {
    return new Promise((resolve,reject)=>{
      Http.post(`${CFG.API_PASSPORT_URL}v1/api/app/login/doLogin`, data).then((response)=>{
        this.handleLoginSuccess(response,resolve,reject)
      }).catch((error)=>{
        reject(error)
      })
    })
  },
  /**
   * 绑定手机号
   * http://confluence.csdn.net/pages/viewpage.action?pageId=20389179
   * @param data
   * @returns {Promise<any>}
   */
  bindMobile(code, mobile, verifyCode, username, password){
    return new Promise((resolve,reject)=>{
      Http.post(`${CFG.API_PASSPORT_URL}v1/api/app/login/bindMobile`,
      {
        'code': code,
        'mobile': mobile,
        'verifyCode': verifyCode,
        'bindType': '0',
        'username': username,
        'password': password
      }).then((response)=>{
        this.handleLoginSuccess(response,resolve,reject)
      }).catch((error)=>{
        reject(error)
      })
    })
  },
  handleLoginSuccess(response,resolve,reject){
    if (!response.status) {
      reject(response)
    }
    let token = response.data.token;
    console.log("save token:", token);
    setApiAccessToken(token);
    let userToken = response.data.userToken;
    setApiAccessUserToken(userToken)
    let result = JSON.parse(Base64.decode(response.data.token.split('.')[1]));
    Cookies.set('UserName', result.sub, { path: '/',domain: 'csdn.net' });
    Cookies.set('UserToken', userToken, { path: '/',domain: 'csdn.net' });
    initAPIAccessHeaderstoCookies()
    Cookies.set('JWT-TOKEN', token, { path: '/',domain: 'csdn.net' });
    resolve(result.sub)
  },
  /**
   * 发送验证码
   * @param code
   * @param mobile
   * @param type
   * @param userIdentification
   * @param openId
   * @param openSite
   * @returns {PromiseLike<T | never> | Promise<T | never>}
   */
  sendVerifyCode(code, mobile, type, userIdentification, openId, openSite) {
    let data = {code, mobile, type, userIdentification, openId, openSite};
    return new Promise((resolve,reject)=>{
      Http.post(`${CFG.API_PASSPORT_URL}v1/api/app/sendAppVerifyCode`, data).then((response)=>{
        if (!response.status) {
          reject(response)
        }
        resolve(response)
      },(error)=>{
        reject(error)
      })
    })
  },
  /**  
   * 滑块验证
   *  
   */
  getCheckSVC(sig,token,scene,sessionId){
    let data = {sig, token, scene, sessionId};
    return new Promise((resolve,reject)=>{
      Http.post(`${CFG.API_PASSPORT_URL}v1/api/riskControl/checkSVC`, data).then((response)=>{
        console.log(data)
        resolve(response)
      },(error)=>{
        reject(error)
      })
    })
  }
};
export default LoginService
