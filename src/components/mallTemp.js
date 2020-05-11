import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import './mallTemp.styl'
import MallService from '../common/service/MallService'
import HtmlText from '../components/HtmlText.js'
import Cookies from 'js-cookie'
import { getCurrentUser, log,isLoggedIn } from '../common/Utils'
import goldenstar from '../static/goldenstar.png'
import privilege from '../static/privilege.png'
import sendBook from '../static/sendBook.png'
import superviptext from '../static/newSuperBtn.png'
import headImage from '../static/headImage.png'
import vip_book_icon from '../static/vip_book_icon.png'

class MallTemp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      goodsList: [],
      equitiesList: [],
      curGoods: {
        equities: {}
      },
      explainInfo: '',
      changeDefault: 0,
      scrollLeft: '',
      autoWidth:0,
      referer:'',
      superVipGoods:{},
      scrollHeight:'',
      addFixed:false,
      dailySave: '0.8',
      isLoggedIn:true,
      showLoginBar : false,
      isStudent : false,
      youhuiList : [],
      superYearList : [],
      yearList : [],
      monthList : [],
      isAndroidNum : false,
      device_type : 1,
      iosStr : "&lt;ul class=&quot;intro_list&quot; font-size:=&quot;&quot; list-style:=&quot;&quot; microsoft=&quot;&quot; style=&quot;box-sizing: border-box; margin: 0px; padding-right: 0px; padding-left: 0px; font-family: &quot;&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;1、&lt;/span&gt;通用权益：全站免广告、学院1000+免费课、VIP身份标识、博客自定义域名及分类专栏、博客内容分析、VIP专享皮肤及发布的博客文章阅读时可免广告；&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;2、会员优惠：&lt;/span&gt;VIP会员有效期内续费8折优惠，VIP会员可享受学院购课优惠&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;；&amp;nbsp;&lt;/span&gt;&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;3、有效时间：年卡为365天、月卡为30天。会员到期后自动过期并取消会员身份。在有效期内续费，会员权益会自动叠加；&lt;/span&gt;&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;4、iOS端订单不支持开发票；&lt;/span&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;5、&lt;/span&gt;&lt;span style=&quot;color:#FF0000;&quot;&gt;&lt;strong&gt;会员暂不支持升级；开通成功后使用过相关权益或已开具过发票的套餐，不支持退款；&lt;/strong&gt;&lt;/span&gt;&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;6、&lt;font style=&quot;box-sizing: border-box; color: red; font-weight: bold;&quot;&gt;禁止用户使用任何方式利用本站资源为他人提供有偿下载服务，一经发现，本站有权查封该账号；&lt;/font&gt;&lt;/span&gt;&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;7、&lt;font style=&quot;box-sizing: border-box; color: red; font-weight: bold;&quot;&gt;任何用户每日下载上限为20个资源；&lt;/font&gt;&lt;/span&gt;&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;8、会员免费看：&lt;span  id=gotoClass title=&quot;点击查看会员免费课程&quot;&gt;查看千门免费看&lt;/a&gt;&lt;/span&gt;（更新于2019年4月）；&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;&lt;span style=&quot;box-sizing: border-box; margin: 0px; padding: 0px;&quot;&gt;9、有兑换优质课权益的会员：会员兑换权益每月仅2次机会，逾期作废，且兑换课程有效期随会员整体有效期生效；&lt;/span&gt;&lt;/li&gt;&lt;li style=&quot;box-sizing: border-box; margin: 0px; padding: 0px; list-style: none;&quot;&gt;10、&lt;span style=&quot;font-size:14px;&quot;&gt;&lt;span style=&quot;color:#FF0000;&quot;&gt;&lt;strong&gt;iOS端拥有苹果专享会员套餐，您可根据需求进行合理选择。需特别注意：iOS端退款问题，请联系苹果客服解决。&lt;/strong&gt;&lt;/span&gt;&lt;/span&gt;&lt;/li&gt;&lt;/ul&gt;"
    }
  }
  componentWillMount() {
    Taro.removeStorageSync('PAYING')
  }
  componentDidShow() {
    console.log(90090909)
    Taro.getSystemInfo({
      success: res => {
      },
      fail: err => {
          // reject(err)
      }
  })
  }
  componentDidHide() {
  }
  config = {
    navigationStyle: 'custom'  //通栏展示
  };
  componentDidMount() {
    $("#gotoClass").on("click",()=>{
      if(window.webkit){
        window.webkit.messageHandlers.csdnjumpnewpage.postMessage(JSON.stringify({"url":"https://app.csdn.net/study/course/list","refer":"","trackingCode":""})) 
      }
    })
    this.desideNumber()
    if(isLoggedIn()){
      this.getMyCouponList()
    }
    if (this.$router.params && this.$router.params.is_default) {
      this.setState({
        changeDefault: 1
      })
    }
    if (this.$router.params && this.$router.params.referer) {
      this.state.referer = this.$router.params.referer
      this.setState({
        referer: this.state.referer
      })
    }
    if(this.props&&this.props.isIOS){
      this.getIOSMemberGoods()
    } else {
      this.getMemberGoods()
    }
    this.getMemberExplain()
    let source = ''
    switch (this.$router.params.referer) {
      case "me":
        source = '我的页面入口'
        break;
      case "study":
        source = '学习页banner'
        break;
      case "free_course":
        source = '会员免费课程页'
        break;
      case "exchange_course":
        source = '会员兑换课程页'
        break;
      case "download":
        source = '下载详情页'
        break;
      case "luckydraw":
        source = '抽奖奖品历史页'
    }
    const curUser = getCurrentUser()
    curUser ? AnalysysAgent.alias(curUser.userName) : '';
    AnalysysAgent.track("purchasepage_vip", { "vippagesource": source });
    Taro.getSystemInfo({
      success: (res) => {
        console.log('res.windowHeight',res.windowHeight,res)
        if(res.system&&res.system === 'iOS') {
          console.log(2131248584)
          this.setState({
            isIOS: true,
            device_type : 2
          })        
        }
        this.setState({
          scrollHeight: res.windowHeight/3,
        })
      },
      fail: (err) => {
        console.error('res:', err)
      }
    });
    window.addEventListener('scroll', this.pageScrollFn.bind(this))
    if (this.$router.params && this.$router.params.isAudit !=='1' ) {
      if (!isLoggedIn()) {
        this.setState({
          isLoggedIn:false,
          showLoginBar:true
        })
      }
    } else {
      this.setState({
        showLoginBar:true
      })
    }
  }
  getMyCouponList() {
    // 获取会员权益接口
    MallService.getMyCouponList().then((data) => {
      if(data.length){
        data.forEach(item => {
          if(item.status == 0 ){
            if ( item.productid == 1556){
              this.state.superYearList.push(item)
              this.state.superYearList = this.priceGet(this.state.superYearList)
            }else if (item.productid == 1554) {
              this.state.yearList.push(item)
              this.state.yearList = this.priceGet(this.state.yearList)
            }else if (item.productid == 1553){
              this.state.monthList.push(item)
              this.state.monthList = this.priceGet(this.state.monthList)
            }
          }
        });
      }
      this.setState({
        couponList: data
      })

    }).catch((error) => {
      console.error("getMemberExplain:error", error)
    });
  }
  getIOSMemberGoods() {
    MallService.getIOSMemberGoods().then((data) => {
      data && data.goods_list.length && data.goods_list.map((item, index) => {
        if (item.real_price) {
          item.dotPrice = item.real_price
          item.disWords = '立即开通会员 支付 '
        }
        if (this.state.changeDefault) {
          if (index === data.goods_list.length - 1) {
            this.state.curGoods = item
            item.is_default = 1
          } else {
            item.is_default = 0
          }
        } else {
          if (item.is_default) {
            this.state.curGoods = item
          }
        }

        return item
      })
      const noDefault = data && data.goods_list.length && data.goods_list.every((value, index, array) => {
        return value.is_default == 0
      })
      if (noDefault) {
        // 返回的数据 没有一个is_default 是1的情况 前端默认给默认值1
        data.goods_list[0].is_default = 1
        this.state.curGoods = data.goods_list[0]
      }
      data.equities_list = data.equities_list && data.equities_list.filter((item) => {
        return item.alias !== 'title' && item.alias !== 'member_valid_days'
      })
      let len = 0
      if(data.goods_list&&data.goods_list.length)len = data.goods_list.length
      this.setState({
        goodsList: data.goods_list.length&&data.goods_list.reverse(),
        equitiesList: data.equities_list,
        curGoods: this.state.curGoods,
        autoWidth:4.416*len + 0.47*2+1,
        ios_goods_id:this.state.ios_goods_id,
        superVipGoods:data.goods_list[0],
      })
    }).catch((error) => {
      console.error("getIOSMemberGoods:error", error)
    });

  }
  pageScrollFn (scrollTop) {
    if (scrollTop.target.scrollingElement.scrollTop>this.state.scrollHeight) {
      this.setState({
        addFixed:true
      })
    } else if(this.state.addFixed){
      this.setState({
        addFixed:false
      })
    }
  }
  getMemberExplain() {
    // 获取会员权益接口
    MallService.getMemberExplain().then((data) => {
      console.log(data.body,"zifuchuan")
      this.setState({
        explainInfo: data.body
      })
    }).catch((error) => {
      console.error("getMemberExplain:error", error)
    });
  }
  getMemberGoods() {
    MallService.getMemberGoods().then((data) => {
      data && data.goods_list.length && data.goods_list.map((item, index) => {

        if (item.real_price) {
          item.dotPrice = item.real_price
          item.disWords = '立即开通会员 支付 '
          //  item.real_price = parseInt(item.real_price)
        }

        if (this.state.changeDefault) {
          if (index === data.goods_list.length - 1) {
            this.state.curGoods = item
            item.is_default = 1
            this.getDiscountPrice('', index, 1)
          } else {
            item.is_default = 0
          }
        } else {
          if (item.is_default) {
            this.state.curGoods = item
            this.getDiscountPrice('', index)
          }
        }
        return item
      })
      const noDefault = data && data.goods_list.length && data.goods_list.every((value, index, array) => {
        return value.is_default == 0
      })
      if (noDefault) {
        // 返回的数据 没有一个is_default 是1的情况 前端默认给默认值1
        data.goods_list[0].is_default = 1
        this.state.curGoods = data.goods_list[0]
        this.getDiscountPrice('', 0)
      }
      data.equities_list = data.equities_list && data.equities_list.filter((item) => {
        return item.alias !== 'title' && item.alias !== 'member_valid_days'
      })
      let len = 0
      if(data.goods_list&&data.goods_list.length)len = data.goods_list.length
      this.setState({
        goodsList: data.goods_list.length&&data.goods_list.reverse(),
        equitiesList: data.equities_list,
        curGoods: this.state.curGoods,
        superVipGoods:data.goods_list[0],
        autoWidth:4.416*len + 0.47*2+1
      })
    }).catch((error) => {
      console.error("getMemberGoods:error", error)
    });

  }
  getDiscountPrice(noloading, index, flag) {
    if (!this.state.isLoggedIn) {
      return
    }
    // 需要jwt
    MallService.getDiscountPrice(this.state.curGoods.product_id, this.state.curGoods.goods_id, this.state.curGoods.flag, noloading).then((data) => {
      if (data && data.discount) {
        this.state.curGoods.dotPrice = Number(this.state.curGoods.real_price * data.discount).toFixed(2)
        if(this.state.curGoods.product_id == 1556 & this.state.superYearList.length){
          this.state.curGoods.dotPrice = (Number(this.state.curGoods.dotPrice) - Number(this.state.superYearList[0].value)).toFixed(2)>0?(Number(this.state.curGoods.dotPrice) - Number(this.state.superYearList[0].value)).toFixed(2):0
        }else if (this.state.curGoods.product_id == 1554 & this.state.yearList.length){
          this.state.curGoods.dotPrice = (Number(this.state.curGoods.dotPrice) - Number(this.state.yearList[0].value)).toFixed(2)> 0?(Number(this.state.curGoods.dotPrice) - Number(this.state.yearList[0].value)).toFixed(2):0
        }else if (this.state.curGoods.product_id == 1553 & this.state.monthList.length){
          this.state.curGoods.dotPrice = (Number(this.state.curGoods.dotPrice) - Number(this.state.monthList[0].value)).toFixed(2) > 0?(Number(this.state.curGoods.dotPrice) - Number(this.state.monthList[0].value)).toFixed(2): 0
        }
        this.state.curGoods.disWords = '续费开通会员 支付 '
        if (flag) {
          this.eady(index)
        }
        this.setState({
          curGoods: this.state.curGoods,
          isStudent : true
        })
      }
    }).catch((error) => {
      console.error("getDiscountPrice:error", error)
    });
  }
  priceGet(oldarray) {
     var pricearr = [];
     var realPrice = [];
     var max = 0;
     oldarray.map((item)=> {
       if(item.value>max){
         max = item.value;
         pricearr.push(item);
       }
     })
     pricearr.map((item)=>{
        if(item.value == max){
          realPrice.push(item);
        }
      })
     return realPrice
 }
  eady(curIndex) {
    //易观统计
    switch (curIndex) {
      case 0:
        AnalysysAgent.track("selecttype_vip", { "viptype": "月卡" });
        break;
      case 1:
        AnalysysAgent.track("selecttype_vip", { "viptype": "季卡" });
        break;
      case 2:
        AnalysysAgent.track("selecttype_vip", { "viptype": "年卡" });
        break;
      case 3:
        AnalysysAgent.track("selecttype_vip", { "viptype": "超级年卡" });
        break;
    }
  } // 滑动效果
  chooseCard(item, index) {
    // 选择卡片 is_default 前端变化 curGoods.curPrice curGoods.equities变化 goodsList
    this.state.goodsList.length && this.state.goodsList.map((data) => {
      data.is_default = 0
      return data
    })
    item.is_default = 1
    this.state.curGoods = item
    this.setState({
      goodsList: this.state.goodsList,
      curGoods: this.state.curGoods,
      dailySave: item&&item.day_price&&item.day_price.substring(0,item.day_price.length-2) || ''
    })
    this.eady(index)
    // 切换时要对当前获取折扣
    this.getDiscountPrice(true)
  }
  Membership(buySuperVip) {

    if (!this.state.isLoggedIn) {
      if(window.navigator.userAgent.indexOf('CSDN') >- 1 ){
        window.location.href='https://passport.csdn.net/account/login'
      }else{
        Taro.navigateTo({ url: `/pages/login/login` });
      }
      return
    }

    if(this.props&&this.props.isIOS){
      if (buySuperVip) {
        this.chooseCard(this.state.superVipGoods,0) //第二个参数为超级vip位置
      }
      this.MemberIOSShip()
    } else {
      if (buySuperVip) {
        this.chooseCard(this.state.superVipGoods,0) //第二个参数为超级vip位置
      }
      // 下单支付 跳转到order-checkout
      // product_id,goods_id,flag,order_source
      console.log('track', window.csdn.report)
      const obj = { "mod": "popu_784", "extend1": "APP_H5" }
      window.csdn.report.reportClick(obj, $("#btn_order"))
      //易观统计
      AnalysysAgent.track("opening_vip", { "viptype": this.state.curGoods.equities.title });
      Taro.navigateTo({
        'url': `/pages/mall/order-checkout?product_id=${this.state.curGoods.product_id}&&goods_id=${this.state.curGoods.goods_id}&&flag=${this.state.curGoods.flag}&&vipType=${encodeURI(this.state.curGoods.equities.title)}&referer=${this.state.referer}`
      })
    }

  }
  jumpToAppCoursePage(){
    window.location.href = 'https://coursepage'
  }
  MemberIOSShip() {
    // 下单支付 跳转到order-checkout
    console.log('track', window.csdn.report)
    const obj = { "mod": "popu_784", "extend1": "APP_H5" }
    window.csdn.report.reportClick(obj, $("#btn_order"))
    //易观统计
    AnalysysAgent.track("opening_vip", { "viptype": this.state.curGoods.equities.title });
    // 请求buynow 和submit
    this.orderGoods()
  }

  orderGoods() {
    // 需要jwt 获取本页填充
    Taro.showLoading({
      title: '正在唤起苹果支付',
      duration:2000
    })
    MallService.orderGoods(this.state.curGoods.product_id, this.state.curGoods.goods_id, this.state.curGoods.flag,this.state.referer,this.state.device_type).then((data) => {
     console.log('data====',data)
      if(data&&data.length){
       // 请求submit
        this.submitOrder(data[0].cart_id)
      }

    }).catch((error) => {
      console.error("orderGoods:error", error)
      Taro.showToast({
        title: '系统异常',
        duration: 2000
      })
    });
  }
  submitOrder(cartId) {
    // 提交订单 需要jwt
    let key = ''
    // key为优惠券参数 ios传递空
    MallService.submitOrder(cartId, key).then((data) => {
    console.log('submit 提交成功',data)
      if(data&& data.order_id){
        this.jumpIOSPay(data.order_number)
      }
    }).catch((error) => {
      console.error("submitOrder:error", error)
      Taro.showToast({
        title: error.msg || '系统异常',
        duration: 2000
      })
    });
  }
  jumpIOSPay(orderNumber){
    // 跳转到ios去支付
    console.log('orderNumber+++',orderNumber)
    console.log('this.state.curGoods.ios_goods_id====',this.state.curGoods)
    window.location.href = `https://csdn.net/applebuy/vip?order_number=${orderNumber}&ios_goods_id=${this.state.curGoods.ios_goods_id}`
  }

  toLoginPage(){
    if(window.navigator.userAgent.indexOf('CSDN') >- 1 ){
      window.location.href='https://passport.csdn.net/account/login'
    }else{
      Taro.navigateTo({ url: `/pages/login/login` });
    }
  }

  gotoStudent(){
    window.location.href='https://student.csdn.net/m/club/student/member/apply/4/4/csdnapp'
  }

  desideNumber(){
    if(Cookies.get('version')){
      var orderNumber = Cookies.get('version').split('.'); 
      if(window.navigator.userAgent.split(';')[1].split(' ')[1] == 'Android') {
        if(Number(orderNumber[0]) > 3 ){
          this.setState({isAndroidNum : true})
        }else if (Number(orderNumber[0]) == 3 & Number(orderNumber[1]) >= 9){
          this.setState({isAndroidNum : true})
        }else {
          this.setState({isAndroidNum : false})
        }
      }
    }
    
  }

  render() {
    const courseData=[
      {
          "title":"Python从入门到实战 基础入门视频教程（讲解超细致）",
          "price":"￥154.00"
      },
      {
          "title":"决胜AI-强化学习实战系列视频课程",
          "price":"￥154.00"
      },
      {
          "title":"学习OpenCV3.2+QT5+ffmpeg实战开发视频编辑器视频教程",
          "price":"￥181.00"
      },
      {
          "title":"2019年软考系统集成项目管理工程师应用技术软考视频教程",
          "price":"￥208.00"
      },
      {
          "title":"MySQL入门到精通视频教程",
          "price":"￥117.00"
      },
      {
          "title":"Python入门视频教程",
          "price":"￥59.00"
      },
      {
          "title":"SAP Fiori开发视频教程--由浅入深学习Fiori开发",
          "price":"￥199.00"
      },
      {
          "title":"OpenCV视频分析与对象跟踪实战教程",
          "price":"￥136.00"
      },
      {
          "title":"[肖哥]网络工程师入门技术-玩转 win10版视频教程",
          "price":"￥59.00"
      },
      {
          "title":"嵌入式Linux应用程序开发视频教程",
          "price":"￥208.00"
      },
      {
          "title":"JavaScript全套课程",
          "price":"￥117.00"
      },
      {
          "title":"移动手机APP测试入门视频教程",
          "price":"￥89.00"
      },
      {
          "title":"机器学习推荐系统视频教程",
          "price":"￥89.00"
      },
      {
          "title":"HTML5 + CSS3 从 0 到 1 实战详解视频教程",
          "price":"￥69.00"
      },
      {
          "title":"软考信息系统项目管理师考试视频辅导课程",
          "price":"￥181.00"
      },
      {
          "title":"软件设计是怎样炼成的？",
          "price":"￥208.00"
      },
      {
          "title":"2017全新《计算机网络原理》新书同步终极讲解视频教程",
          "price":"￥208.00"
      }
  ]
    const { goodsList, curGoods, equitiesList, explainInfo,autoWidth,dailySave,showLoginBar,isStudent ,isAndroidNum} = this.state
    const goodsTemp = goodsList.length !== 0 && goodsList.map((item, index) => {
      return (<View className={`block1 ${index===goodsList.length-1 ?'block_last':''}`} onClick={this.chooseCard.bind(this, item, index)}>
        {item.equities.title==='超级VIP年卡'}
        {index === 0 && isAndroidNum &&<View className='superBox'>
          <Image className = 'superBox_img' src = {vip_book_icon}></Image>
        </View>}
        {
          !isAndroidNum &&<View className='iosSuper'>iOS专享
        </View>
        }
        <View className={`block1_img ${item.is_default ? 'box_active' : ''}`}>
          <View className='box1'>
            <View className='title'>{item.equities.title}</View>
            <View className='price'>￥{item.real_price}</View>
            <View className='price1'>{item.day_price}</View>
          </View>
        </View>
      </View>)
    })
    const groupIcon = equitiesList && equitiesList.map((item) => {
      return <View className='box' style={`width :${item.is_hide !== 1 && curGoods.equities[item.alias] !== 'no' ? '20%' : 0}`}>{item.is_hide !== 1 && curGoods.equities[item.alias] !== 'no' && <View className='item_block'>
        <Image className='icon' src={item.icon}></Image>
        {item.alias==='youzan_coupon_50'&& isAndroidNum &&<Image className='privilege' src={privilege}></Image>}
        {item.alias==='youzan_coupon_50'&& !isAndroidNum &&<Image className='sendBook' src={sendBook}></Image>}
        <View className='title'>{item.title}
          {curGoods.equities[item.alias] && curGoods.equities[item.alias] !== 'yes' && <Text className='ext'>{curGoods.equities[item.alias]}</Text>}
        </View>
      </View>}

      </View>
    })

    const recommendCourses = <View className='recommendCourses'>
      <View className='title'> <Image className='goldenstar' src={goldenstar} ></Image>&nbsp;&nbsp;全部课程畅想&nbsp;&nbsp;<Image className='goldenstar' src={goldenstar} ></Image></View>
      <View className='title2'>会员免费课程1000+不断更新添加中...</View>
      <View className='course_list'>
        <View className='title_bar'>
          <Text className='title_text'>课程名称</Text>
          <Text className='title_text right_text'>超级VIP</Text>
          <Text className='title_text right_text'>VIP</Text>
        </View>
        {courseData.map((item)=>{
          return <View className='list'>
                  <Text className='course_title'>{item.title}</Text>
                  <Text className='vip_free'>免费兑换</Text>
                  <Text className='course_price'>{item.price}</Text>
                </View>
        })}
      </View>
      <View className={this.state.addFixed?'btn_wrap btn_fixed':'btn_wrap'}>
        <View className='btn'>
          <View className='btn_order' id='btn_order' onClick={this.Membership.bind(this,true)}><Image className='superviptext_img' src={superviptext} ></Image></View>
        </View>
      </View>
    </View>
    const loginBar = <View style='background:#1F2124;'><View className='loginBar clearfix'>
      <Image className='avatar' src={headImage} ></Image>
      <View className='login_text'>
        <Text className='username'>游客</Text>
        <Text className='info'>登录后可同步VIP特权</Text>
      </View>
      <View className='login_btn' onClick={this.toLoginPage.bind(this)}>登录</View>
    </View></View>
    return (
      <View className='index clearfix'>
        {showLoginBar&&loginBar}
        <View className='container'>
          <View className='banner'>
            <View className='title'>将1000门课程装进口袋</View>
            <View className='title2'>成为CSDN会员，预计全年最多可省¥4800元</View>
            <ScrollView className='mid_cont' scrollLeft={this.state.scrollLeft} scrollWithAnimation='true' scrollX>
            <View className='swiper' scrollWithAnimation='true' style={{ width: autoWidth +'rem'}}>
              <View className='group'>
                {goodsTemp}
              </View>
            </View>
          </ScrollView>
          </View>
          <View className='blank'>
          <View className='pad' >
            {isAndroidNum&& <View className = {(!isStudent & isAndroidNum )? 'new_btn_order' : 'new_btn_order1 new_btn_order'} style = {(!isStudent & isAndroidNum )? 'margin-right:7px;' : ''} id='btn_order' onClick={this.Membership.bind(this,false)}>
              {isStudent && <View className = 'old_price'>原价￥{ Math.floor(curGoods.real_price)},已优惠￥{ Math.floor(Number(curGoods.real_price) - Number(curGoods.dotPrice)) }</View>}
              <View className = 'real_price' style = {isStudent ? '' : 'line-height:41px;'}>￥{curGoods.dotPrice} 立即开通</View>
            </View>}
            {!isStudent && isAndroidNum &&<View className = 'student_btn' onClick = {this.gotoStudent}>VIP学生<br/>认证七折</View>}
            {!isAndroidNum &&<View className='iOS_btn' onClick={this.Membership.bind(this,false)}>立即开通</View>}
          </View>
          {curGoods.equities.title && <View className='words'><Text className='line'></Text><Text className='text'>{curGoods.equities.title}特权</Text>
            </View>}
          <View className='group_icon'>
            {groupIcon}
          </View>
          <View className='save_text'>更多会员权益正在启动中~</View>
          </View>
         
        </View>
        <View className={showLoginBar ? 'right_info not-loggedin' : 'right_info'} style = {isAndroidNum ? showLoginBar ? 'top:273px;' : 'top:247px' : ''}>
          
          {recommendCourses}
          <View className='explain'>
            <View className='title'>会员权益与服务说明</View>
            {isAndroidNum&&<HtmlText htmlContent={explainInfo} />}
            {!isAndroidNum&&<HtmlText htmlContent={this.state.iosStr} />}
          </View>
        </View>
      </View>
    )
  }
}

export default MallTemp
