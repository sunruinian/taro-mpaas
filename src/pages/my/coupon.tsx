import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import './coupon.styl'
// import MallService from '../../common/service/MallService'
import slice from '../../static/slice.png'
import expire from '../../static/no_use.png'
import default_icon from '../../static/default_icon.png'

class Index extends Component {

  constructor(props) {
    super(props);
    this.state = {
      couponList:[]
    }
  }
  componentWillMount() {
  }
  componentDidHide() {
  }
  config = {
    navigationStyle: 'custom'  //通栏展示
  };
  componentDidMount() {
    this.getMyCouponList()
  }
  componentDidShow() {

  }
  chooseCoupon(item) {
    if(item.status&&item.status ===1){
      Taro.showToast({
        'title':'优惠券已使用',
        'duration':2000
      })
    }else if(item.status&&item.status ===2){
      Taro.showToast({
        'title':'优惠券已过期',
        'duration':2000
      })
    } else if(item.status===0) {
      // 执行跳转的逻辑
      console.log(item.status)
      if(item.plat&&item.plat===1){
        //学院课程 进入课程页面
        return false
      }else if(item.plat&&item.plat===5){
        // VIP 购买页面 增加入口referer
        Taro.navigateTo({
          url:'/pages/mall/index?referer=my_coupon'
        })
      } else {
        return false
      }
    }
  }
  getMyCouponList() {
  // 获取会员权益接口
//   MallService.getMyCouponList().then((data) => {
//     this.setState({
//       couponList: data
//     })
//   }).catch((error) => {
//     console.error("getMemberExplain:error", error)
//   });
}
  render() {
    const {couponList} = this.state
    let temp1 = null
    temp1 = couponList&&couponList.length>0&&couponList.map((item,index)=>{
      return (<View className='coupon_list'>
        <View className='coupon_item' onClick={this.chooseCoupon.bind(this,item)}>
    <View className='block'>
        <View className={`left_con ${item.color}`}>
    <View className='price'><Text className='int'>{item.value}</Text><Text className='words'>元</Text></View>
      <View className='desc'>{item.ext}</View>
      </View>
      <Image className='slice' src={slice}></Image>
        </View>
        <View className='right_con'>
        <View className='fron'>
        <View className='title'>
        {item.title}
    </View>
      <View className='range'>{item.useDesc}</View>
      <View className='time'>期限：{item.expireTime}</View>
      </View>
      {item.color==='grey'&&<Image src={expire} className='expire'></Image>}
        </View>
        </View>
        </View>)
      })
    return (
      <View className='coupon'>
        {temp1}
        {!couponList.length&&<View className='blank'><Image className='default_img' src={default_icon}></Image>
          <View className='tip'>空空如也</View>
          </View>}
      </View>
    )
  }
}

export default Index
