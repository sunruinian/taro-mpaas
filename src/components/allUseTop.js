import Taro, {Component} from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import './allUseTop.styl'

export default class Index extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  componentDidMount(){
  }
  clickAll(flag){
    if(flag == '1'){
      const  pages = Taro.getCurrentPages()
      if (pages.length > 1) {
        Taro.navigateBack({
          delta: 1
        })
      } else {
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }
    }
    if(flag == '2'){
      Taro.switchTab({
        url: '/pages/index/index'
      })
    }
    if(flag == '3'){
      console.log(this.props.type);
      Taro.navigateTo({
        url : `/pages/search/index?type=${this.props.type}`
      })
    }
  }
  render(){
    return (
      <View className = 'allUse' style = {`padding-top:${this.props.height}` + 'px;top:0;'}>
        <View className = 'allUseBack' onClick = {this.clickAll.bind(this,1)}>
          <Image className = 'commonImg' style = 'height:19px;width:11px;' src = {STATIC_URL + 'svg/goback.svg'}></Image>
        </View>
        <View className = 'allUseHome' onClick = {this.clickAll.bind(this,2)}>
          <Image className = 'commonImg' src = {STATIC_URL + 'svg/gohome.svg'} style = 'width:17px;height:19px;'></Image>
        </View>
        <View className = 'allUseSearch' onClick = {this.clickAll.bind(this,3)}>
          <View className = 'search'>
            <Image className = 'searchimg' src = {STATIC_URL + 'svg/search.svg'}></Image>
          </View>
          <View className = 'searchText'>搜索</View>
        </View>
      </View>
    )
  }
}
