import Taro, { Component } from '@tarojs/taro'
import { Button, Image, Input, View } from '@tarojs/components'
import LoginService from '../../common/service/LoginService'
import { getUserAvatar, saveUserInfo } from "../../common/Utils"
import './login-account.styl'

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
      isPassword: true,
      isfocus: [
        false,
        false
      ],
      isErrorMessage: false,
      errorMessage: '',
      turnRed: true
    }
  }
  togglePwd = () => {
    if (this.state.isPassword) {
      this.setState({
        isPassword: false
      })
    } else {
      this.setState({
        isPassword: true
      })
    }
  };
  handleLogin = () => {
    const { userName, password } = this.state;
    if (!userName && !password) return;
    //埋点：登录操作
    LoginService.loginByUserName(userName, password).then((data) => {

      this.setState({
        isErrorMessage: false,
        errorMessage: ''
      });
      let userInfo = {
        userName: data,
        avater: getUserAvatar(data)
      };
      saveUserInfo(userInfo);
      //TODO 跳转规则：1.from页面 2.referrer页  3.默认页
      if (this.props.from && this.props.from.length > 0) {
        if (this.props.fromswitchtab) {
          Taro.reLaunch({ url: this.props.from })
        } else {
          Taro.reLaunch({ url: this.props.from })
        }
        return
      }
      if (Taro.getCurrentPages() && Taro.getCurrentPages().length > 1) {
        //有上一页，则回退至上一页
        Taro.navigateBack({
          delta: 1
        })
      } else {
        Taro.redirectTo({ url: '/pages/my/course-list' })
      }

    }).catch((loginError) => {
      // TODO 未绑定手机号的用户，携带账号密码跳转至账号密码绑定页
      switch (loginError.code) {
        case '1042':
          this.props.onErrorClick(userName, 1);
          break;
        case '1044':
          this.props.onHandleBind(userName, password);
          break;
        default:
          this.setState({
            isErrorMessage: true,
            errorMessage: loginError.message
          })
      }
    })
  };
  clearValue = (stateName) => {
    this.setState({
      [stateName]: ''
    })
  };
  onFocus = (index) => {
    let { isfocus } = this.state;
    isfocus[index] = true;

    this.setState({
      isfocus: isfocus
    })
  };
  onBlur = () => {
    this.setState({
      isfocus: [
        false,
        false
      ]
    })
  };
  handleInput = (stateName, index, e) => {
    console.log('点进来了=======')
    const value = e.target.value;
    let { isfocus } = this.state;
    isfocus[index] = true;
    this.setState({
      [stateName]: value,
      isfocus: isfocus
    });
    if ((stateName == 'password' && e.detail.value.length > 0) && this.state.userName) {
      this.setState({ turnRed: true })
    }
  };
  onErrorClick = (name, type) => {
    this.props.onErrorClick(name, type)
  };
  render() {
    const { userName, password, isErrorMessage, isPassword, isfocus, errorMessage, turnRed } = this.state;
    return (
      <View className='newLogin-account'>
        <View className='newLogin-account_name'>
          <Input className='newLogin-account_inName' type='text' placeholder='手机号/邮箱/用户名' placeholderStyle='color:#E0E0E0;' value={userName} onFocus={this.onFocus.bind(this, 0)} onBlur={this.onBlur} onInput={this.handleInput.bind(this, 'userName', 0)} ></Input>
          <View className='newLogin-account_clearBtn' onClick={this.clearValue.bind(this, 'userName')}>
            <Image className={(isfocus[0] && userName) ? 'icon-close' : 'icon-close hide'} src={'https://csdnimg.cn/weapp/seed_taroapp/' + 'icon-remove.png'} />
          </View>
        </View>
        <View className='newLogin-account_underLine'></View>
        <View className='newLogin-account_password'>
          <Input className='newLogin-account_inpassword' type='text' password={isPassword} placeholder='密码' placeholderStyle='color:#E0E0E0;' value={password} onFocus={this.onFocus.bind(this, 1)} onBlur={this.onBlur} onInput={this.handleInput.bind(this, 'password', 1)}  ></Input>
          <View className='showPassword' onClick={this.togglePwd} >
            <Image className={password ? 'icon-pwd' : 'icon-pwd hide'} src={isPassword ? 'https://csdnimg.cn/weapp/seed_taroapp/' + 'icon-hide.png' : 'https://csdnimg.cn/weapp/seed_taroapp/' + 'icon-pwd.png'} />
          </View>
        </View>
        <View className='newLogin-account_underLine'></View>
        {isErrorMessage && <View className='newLogin-account_error'>{errorMessage}</View>}
        <Button className='newLogin-sendMessage' onClick={this.handleLogin} style={turnRed ? 'background:#CA0C16;' : ''}>登录</Button>
      </View>
    )
  }
}
