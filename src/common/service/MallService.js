import Http from '../HttpInteceptor'
import CFG from '../Config'
import { timestampToTime, getSessionId } from '../Utils'
import CONST from '../Constants'
import { initFromStorage } from '../AppContext'
import Taro, { Component } from '@tarojs/taro'
import Cookies from 'js-cookie'
const MallService = {
  // 获取商品信息列表
  getMemberGoods() {
    console.log("CFG.API_MALL_URL===", CFG.API_MALL_URL)
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_MALL_URL}getMemberGoods`).then((response) => {
        console.log(response.data)

        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 获取ios商品列表
  getIOSMemberGoods() {
    console.log("CFG.API_MALL_URL===", CFG.API_MALL_URL)
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_MALL_URL}getIOSMemberGoods`).then((response) => {
        console.log(response.data)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 获取会员会员权益与服务说明
  getMemberExplain() {
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_MALL_URL}getMemberExplain`).then((response) => {
        console.log(response.data)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 获取身份折扣价格
  getDiscountPrice(product_id, goods_id, flag, noloading) {
    const data = {
      product_id,
      goods_id,
      flag,
      noloading

    }
    return new Promise((resolve, reject) => {
      Http.post(`${CFG.API_MALL_URL}getDiscountPrice`, data).then((response) => {
        console.log(response.data)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 立即购买
  orderGoods(product_id, goods_id, flag,referer_url='',device_type) {
    console.log( 'utm_source_ext' ,{"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid,"utm_source" : utm_source,"utm_medium" : utm_medium,"utm_campaign" : utm_campaign,"utm_term" : utm_term, "utm_content" : utm_content})
    var first_ref = Cookies.get('c_first_ref_app') || 'novalue'
    var first_page = Cookies.get('c_first_page_app') || 'novalue'
    var dc_sid = Cookies.get('dc_sid_app') || 'novalue'
    var utm_source = Cookies.get('utm_source_app') || ''
    var utm_medium = Cookies.get('utm_medium_app') || ''
    var utm_campaign = Cookies.get('utm_campaign_app') || ''
    var utm_term = Cookies.get('utm_term_app') || ''
    var utm_content = Cookies.get('utm_content_app') || ''
    console.log('abc-断点测试')
    if(window.webkit && window.webkit.messageHandlers.csdnapptrack){
      window.webkit.messageHandlers.csdnapptrack.postMessage(['n_check_web_cookie',JSON.stringify({"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid})]) 
    }
    if(window.jsCallBackListener && window.jsCallBackListener.csdnapptrack){
      window.jsCallBackListener.csdnapptrack('n_check_web_cookie',JSON.stringify({"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid}))
    } 
    const data = {
      product_id,
      goods_id,
      flag,
      "referer_url":flag==3?'/app/course_detail':referer_url,
      "request_url":flag==6?`https://webapp.csdn.net/#/pages/mall/order-checkout?product_id=${product_id}&&goods_id=${goods_id}&&flag=${flag}`:`https://webapp.csdn.net/#/pages/mall/course-order-checkout?product_id=${product_id}&&goods_id=${goods_id}&&flag=${flag}`,
      device_id : Cookies.get('X-Device-ID'),
      device_type : device_type,
      utm_source_ext: JSON.stringify({"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid,"utm_source" : utm_source,"utm_medium" : utm_medium,"utm_campaign" : utm_campaign,"utm_term" : utm_term, "utm_content" : utm_content})
    }
    console.log('即将发送的data====', data)
    return new Promise((resolve, reject) => {
      Http.post(`${CFG.API_ORDER_URL}buyNow`, data).then((response) => {
        console.log(response.data)
        if(response.data&&response.data[0]&&response.data[0].coupon_list){
          if(response.data[0].coupon_list.use&&response.data[0].coupon_list.use.length){

            response.data[0].coupon_list.use = response.data[0].coupon_list.use.map((item,index)=>{
              if(item.plat){
                if(item.plat === 1){
                  item.ext = '学院'
                } else if(item.plat === 5){
                  item.ext = 'vip'
                }else if(item.plat === 7){
                  item.ext = 'gitchat'
                } else {
                  item.ext = ''
                }
              }
              if(item.type===1) {
                item.title = '现金抵扣券'
                item.color = 'pink'
              }else if (item.type===2) {
                item.title = '满减券'
                item.color = 'gold'
              }else {
                item.title = ''
                item.color = 'grey'
              }
              if(item.startDate&&item.endDate){
                item.expireTime = item.startDate + '-' + item.endDate
              }
              return item
            })
          }
          if(response.data[0].coupon_list.notuse&&response.data[0].coupon_list.notuse.length){

            response.data[0].coupon_list.notuse= response.data[0].coupon_list.notuse.map((item,index)=>{
              if(item.plat){
                if(item.plat === 1){
                  item.ext = '学院'
                } else if(item.plat === 5){
                  item.ext = 'vip'
                }else if(item.plat === 7){
                  item.ext = 'gitchat'
                } else {
                  item.ext = ''
                }
              }
              if(item.type===1) {
                item.title = '现金抵扣券'
              }else if (item.type===2) {
                item.title = '满减券'
              }else {
                item.title = ''
              }
              if(item.startDate&&item.endDate){
                item.expireTime = item.startDate + '-' + item.endDate
              }
              item.color='grey'

              return item
            })
          }
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 提交订单接口
  submitOrder(cart_id,coupon_key) {
    console.log( 'utm_source_ext' ,{"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid,"utm_source" : utm_source,"utm_medium" : utm_medium,"utm_campaign" : utm_campaign,"utm_term" : utm_term, "utm_content" : utm_content})
    var first_ref = Cookies.get('c_first_ref_app') || 'novalue'
    var first_page = Cookies.get('c_first_page_app') || 'novalue'
    var dc_sid = Cookies.get('dc_sid_app') || 'novalue'
    var utm_source = Cookies.get('utm_source_app') || ''
    var utm_medium = Cookies.get('utm_medium_app') || ''
    var utm_campaign = Cookies.get('utm_campaign_app') || ''
    var utm_term = Cookies.get('utm_term_app') || ''
    var utm_content = Cookies.get('utm_content_app') || ''

    if(window.webkit && window.webkit.messageHandlers.csdnapptrack){
      window.webkit.messageHandlers.csdnapptrack.postMessage(['n_check_web_cookie',JSON.stringify({"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid})]) 
    }
    if(window.jsCallBackListener && window.jsCallBackListener.csdnapptrack){
      window.jsCallBackListener.csdnapptrack('n_check_web_cookie',JSON.stringify({"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid}))
    } 
    console.log('abc-断点测试')
    const data = {
      cart_id,
      coupon_key,
      'session_id': getSessionId() || '',
      utm_source_ext: JSON.stringify({"c_first_ref":first_ref,"c_first_page":first_page,"dc_sid":dc_sid,"utm_source" : utm_source,"utm_medium" : utm_medium,"utm_campaign" : utm_campaign,"utm_term" : utm_term, "utm_content" : utm_content})
    }
    console.log('即将发送的data====', data)
    return new Promise((resolve, reject) => {
      Http.post(`${CFG.API_ORDER_URL}submitOrder`, data).then((response) => {
        console.log(response.data)
        if (response.data && response.data.create_time) {
          response.data.create_time = timestampToTime(response.data.create_time)
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 请求支付结果
  getPayResult(order_number,platform_type) {
    const data = {
      order_number,
      platform_type,
      "platform_source":'WEB_APP'
    }
    console.log('即将发送的data====', data)
    return new Promise((resolve, reject) => {
      Http.post(`${CFG.API_ORDER_URL}getPayStatus`, data).then((response) => {
        console.log(response.data)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  // 获得易观统计需要的课程详细信息
  getAnalysysData(course_id) {
    const data = {
      course_id
    }
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_COURSE_URL}getAnalysysData`, data).then((response) => {
        resolve(response.data.course_info)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // 取消订单的接口
  // 请求支付结果
  cancelOrder(order_id) {
    const data = {
      order_id
    }
    console.log('即将发送的data====', data)
    return new Promise((resolve, reject) => {
      Http.post(`${CFG.API_ORDER_URL}cancelOrder`, data).then((response) => {
        console.log(response.data)
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  //获取我的优惠券
  getMyCouponList(){
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_ORDER_URL}getUserCoupon`).then((response) => {
        if(response.data&&response.data.length){

          response.data = response.data.map((item,index)=>{
            if(item.plat){
              if(item.plat === 1){
                item.ext = '学院'
              } else if(item.plat === 5){
                item.ext = 'vip'
              }else if(item.plat === 7){
                item.ext = 'gitchat'
              }else if(item.plat === 8){
                item.ext = '电子书'
              } else {
                item.ext = ''
              }
            }
            if(item.status===0){
              // 未使用
              if(item.type===1) {
                item.title = '现金抵扣券'
                item.color = 'pink'
              }else if (item.type===2) {
                item.title = '满减券'
                item.color = 'gold'
              }else {
                item.title = ''
                item.color = 'grey'
              }
            }else {
              if(item.type===1) {
                item.title = '现金抵扣券'
              }else if (item.type===2) {
                item.title = '满减券'
              }else {
                item.title = ''
              }
              item.color = 'grey'
            }

            if(item.startDate&&item.endDate){
              item.expireTime = item.startDate + '-' + item.endDate
            }
            return item
          })
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
};
export default MallService
