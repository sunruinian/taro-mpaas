import Taro, {Component} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import './login.styl'
import LoginAccount from './login-account'
import LoginMobile from './login-mobile'
export default class Index extends Component{
  config = {
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '登录',
    navigationBarTextStyle: 'black',
  };
  constructor(props){
    super(props);
    this.state = {
      tabLoginMobile: false,
      errorType: 0,
      errorName: '',
      accountName: '',
      from: '',
      isFromSwitchTab: false,
      accountPassword: ''
    }
  }
  componentWillMount() {
    let redirectUrl = this.$router.params.from;
    console.log(redirectUrl)
    if (this.$router.params.isFromSwitchTab == '1') {
      this.setState({
        from: redirectUrl,
        isFromSwitchTab: true
      })
    } else {
      this.setState({
        from: redirectUrl
      })
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }
  componentDidHide() {
    if (this.state.errorType > 0 || this.state.accountName) {
      this.setState({
        tabLoginMobile: true,
        errorType: 0,
        errorName: '',
        accountName: '',
        accountPassword: ''
      })
    }
  }
  loginMobile = (name) => {
    if (name === 'mobile') {
      this.setState({
        tabLoginMobile: true,
        errorType: 0,
        accountName: ''
      })
    } else {
      this.setState({
        tabLoginMobile: false,
        errorType: 0,
        accountName: ''
      })
    }
  };
  handleError = (name, type) => {
    this.setState({
      errorType: type,
      errorName: name
    })
  };
  render(){
    const { tabLoginMobile,  accountName } = this.state;
    return (
      <View style = 'height:93vh;'>
        {<View className = 'newLogin' style = 'height : 100%;'>
          <View className = 'newLogin_titleBox'>
            <View className = 'newLogin_titleBox-account' onClick = {this.loginMobile.bind(this, 'account')}>
              <View className = 'newLogin_titleBox-text' style = {!tabLoginMobile ? 'color:#CA0C16' : ''}>登录/注册</View>
              {!tabLoginMobile && <View className='newLogin_titleBox-underLine' style = {!tabLoginMobile ? 'width : 71px;' : ''}></View>}
            </View>
            <View className='newLogin_titleBox-mobile' onClick={this.loginMobile.bind(this, 'mobile')}>
              <View className='newLogin_titleBox-text' style={tabLoginMobile ? 'color:#CA0C16' : ''}>账号登录</View>
              {tabLoginMobile && <View className='newLogin_titleBox-underLine'></View>}
            </View>
          </View>
          {!tabLoginMobile ?
            <LoginMobile onErrorClick = {this.handleError.bind(this)} username = {accountName} from = {this.state.from} fromswitchtab = {this.state.isFromSwitchTab}></LoginMobile> :
            <LoginAccount onErrorClick = {this.handleError.bind(this)} from = {this.state.from} fromswitchtab = {this.state.isFromSwitchTab}></LoginAccount>}
        </View>}
      </View>
    )
  }
}
