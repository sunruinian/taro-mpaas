import Taro, { Component, Config } from '@tarojs/taro'
import Index from './pages/mall/index'
import './app.scss'
import {
  initLoginState,
  initAPIAccessHeaderstoCookies,
  initLoginStateFromCookie
} from './common/Utils'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/login/login',
      'pages/my/course-list',
      'pages/my/coupon',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#FFFFFF',
      navigationBarTitleText: 'CSDN',
      navigationBarTextStyle: 'black'
    }
  }
  componentDidMount() {
    initAPIAccessHeaderstoCookies()
        initLoginState()
    // if (window.navigator.userAgent.indexOf('CSDN') < 0 && window.navigator.userAgent.indexOf('Hybrid')<0) {
    //     //浏览器环境
    //     initAPIAccessHeaderstoCookies()
    //     initLoginState()
    // } else {
    //     // CSDNAPP Webview环境
    //     initLoginStateFromCookie()
    // }
}
  componentDidShow() {}
  componentDidCatchError(error) {}
  componentDidHide() {}
  componentDidCatchError() {}
  componentWillMount() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
