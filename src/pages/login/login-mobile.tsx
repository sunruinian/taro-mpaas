import Taro, {Component} from '@tarojs/taro'
import {Button, Image, Input, Picker, View} from '@tarojs/components'
import LoginService from '../../common/service/LoginService'
import {getUserAvatar, saveUserInfo} from "../../common/Utils"
import './login-mobile.styl'

var interval;
export default class Index extends Component {
  constructor(props){
    super(props);
    this.state = {
      mobile: '',
      code: '',
      sending: 0,
      areaCode: [
        { 'num': '+86', 'name': '+86 中国', 'value': '0086' },
        { 'num': '+1', 'name': '+1 美国', 'value': '001' },
        { 'num': '+1', 'name': '+1 加拿大', 'value': '001' },
        { 'num': '+852', 'name': '+852 中国香港', 'value': '00852' },
        { 'num': '+886', 'name': '+886 中国台湾', 'value': '00886' },
        { 'num': '+81', 'name': '+81 日本', 'value': '0081' },
        { 'num': '+65', 'name': '+65 新加坡', 'value': '0065' }
      ],
      areaCodeSelected: '+86',
      areaCodeSelectedValue: '0086',
      isfocus: [
        false,
        false
      ],
      isErrorMessage: false,
      errorMessage: '',
      disabled: false,
      turnRed : false,
      currentTime:60
    }
  }
  componentWillMount(){}

  componentDidMount(){
  }

  componentWillUnmount() {
    this.setState({
      sending: 0,
      disabled: false
    })
  }

  componentDidHide() {
    this.setState({
      sending: 0,
      disabled: false
    })
    // interval &&clearInterval(interval)
  }

  showTipText = () => {
    if(interval) {
      clearInterval(interval)
    }
  };
  clearValue = (stateName) => {
    this.setState({
      [stateName]: ''
    })
  };
  handleInput = (stateName, index, e) => {
    const value = e.target.value;
    let { isfocus } = this.state;
    isfocus[index] = true;
    this.setState({
      [stateName]: value,
      isErrorMessage: false,
      isfocus: isfocus
    });
    if ( (e.detail.value.length == 6 && stateName == "code") && this.state.mobile.length ){
      this.setState({ turnRed : true})
    }else{
      this.setState({ turnRed: false })
    }
  };
  sendSms = () => {
    //发送验证码请求
    if(!this.state.sending){
      if (this.checkMessageError()) {
        const { mobile, areaCodeSelectedValue } = this.state;
        //判断登录还是绑定手机号，this.props.username存在为绑定手机号
        console.log(mobile);
        let type = this.props.username ? '1' : '0';
        let userIdentification = this.props.username ? this.props.username : mobile;
        LoginService.sendVerifyCode(areaCodeSelectedValue, mobile, type, userIdentification, '', '').then(() => {
          this.state.sending = 1;
          this.showTipText()
        }).catch((error) => {
          this.setState(() => ({
            isErrorMessage: true,
            errorMessage: error.message,
            disabled: false
          }))
        })
      }
    }

  };
  handleLogin = () => {
    const { mobile, code, areaCodeSelectedValue } = this.state;
    if (!mobile && !code) return;
    if (!this.props.username) {
      //todo 更正为国际区号x

      //埋点：登录操作
      if (process.env.TARO_ENV === 'swan') {
      }
      LoginService.loginRegisterByMobile(areaCodeSelectedValue, mobile, code, this.state.swanid_signature).then((userName) => {
        let userInfo = {
          userName: userName,
          avater: getUserAvatar(userName)
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
          Taro.switchTab({ url: '/pages/my/index' })
        }

      }).catch((error) => {
        console.log("loginComponent:error", error);
        this.setState({
          isErrorMessage: true,
          errorMessage: error.message
        });
      })
    } else {
      LoginService.bindMobile(areaCodeSelectedValue, mobile, code, this.props.username, this.props.password).then((userName) => {
        let userInfo = {
          userName: userName,
          avater: getUserAvatar(userName)
        };
        saveUserInfo(userInfo);
        //TODO 跳转规则：1.from页面 2.referrer页  3.默认页
        if (this.props.from && this.props.from.length > 0) {
          if (this.props.fromswitchtab) {
            Taro.reLaunch({ url: this.props.from })
          } else {
            Taro.redirectTo({ url: this.props.from })
          }
          return
        }
        if (Taro.getCurrentPages() && Taro.getCurrentPages().length > 1) {
          //有上一页，则回退至上一页
          Taro.navigateBack({
            delta: 1
          })
        } else {
          Taro.redirectTo({ url: '/pages/my/index' })
        }

      }).catch((error) => {
        if (error.code === '1046') {
          this.onErrorClick('', 3)
        } else {
          this.setState({
            isErrorMessage: true,
            errorMessage: error.message
          })
        }
      })
    }
  };
  checkMessageError = () => {
    const { mobile } = this.state;

      this.setState({ isErrorMessage: false });
      return true

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
  changeAreaCode = e => {
    const { areaCode } = this.state;
    this.setState({
      areaCodeSelected: areaCode[e.detail.value].num,
      areaCodeSelectedValue: areaCode[e.detail.value].value
    })
  };
  onErrorClick = (name, type) => {
    this.props.onErrorClick(name, type)
  };

  render () {
    let { mobile, code, areaCode, areaCodeSelected, isErrorMessage, isfocus, errorMessage, turnRed,sending } = this.state;
    return (
      <View className='newLogin-mobile'>
        <View className='newLogin-mobile_phone'>
          <Picker className='newLogin-choose' mode='selector' range={areaCode} rangeKey='name' onChange={this.changeAreaCode} disabled={sending? true : false}>
            <View style='font-size : 16px;color:#CCCCCC;text-align:left;' className='pick_item'>{areaCodeSelected}</View>
          </Picker>
          <Input className='newLogin-mobile_phoneNum' type='number' maxLength='11' placeholder='输入手机号' placeholderStyle='color:#CCCCCC;'
            value={mobile} onBlur={this.onBlur} onFocus={this.onFocus.bind(this, 0)} onInput={this.handleInput.bind(this, 'mobile', 0)}
          ></Input>
          <View className='newLogin-mobile_clearBtn' onClick={this.clearValue.bind(this, 'mobile')} >
            <Image className={(isfocus[0] && mobile) ? 'icon-close' : 'icon-close hide'} src={'https://csdnimg.cn/weapp/seed_taroapp/' + 'icon-remove.png'} />
          </View>
        </View>
        <View className = 'newLogin-mobile_underLine'></View>
        <View className = 'newLogin-mobile_passNum'>
          <Input className = 'newLogin-mobile_inpass' type = 'number' maxLength = '6' placeholder ={!this.state.code.length ? '6位数字验证码' : ''}  placeholderStyle = 'color:#CCCCCC;'
            onFocus = {this.onFocus.bind(this, 1)} onBlur = {this.onBlur} onInput = {this.handleInput.bind(this, 'code', 1)}
          ></Input>
          <View className='newLogin-mobile_send' onClick={this.sendSms.bind(this)} style={this.state.sending?'color:#E0E0E0':''}>{this.state.sending}</View>
        </View>
        <View className='newLogin-mobile_underLine'></View>
        {isErrorMessage && <View className='newLogin-mobile_error'>{errorMessage}</View>}
        <Button className='newLogin-sendMessage' onClick={this.handleLogin} style={turnRed ? 'background:#CA0C16;border:none !important;outline : none !important;': ''}>登录</Button>
      </View>
    )
  }
}
