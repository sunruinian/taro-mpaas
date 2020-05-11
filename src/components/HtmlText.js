import Taro, {Component} from '@tarojs/taro'
import {View,Text,Image,ScrollView,RichText} from '@tarojs/components'
import './HtmlText.styl'
class HtmlText extends Component {
  HTMLDecode = (text) =>{
    var temp = document.createElement("div");
    temp.innerHTML = text;    var output = temp.innerText || temp.textContent;
    temp = null;    return output;
  }
  render(){
    const {htmlContent,className }= this.props
    return (<View className = {className} dangerouslySetInnerHTML={{ __html:this.HTMLDecode(htmlContent)}}/>)
  }
}
HtmlText.defaultProps = {
  className:"",
  htmlContent:""

}
export default HtmlText
