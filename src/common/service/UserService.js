import Http from '../HttpInteceptor'
import CFG from '../Config'
import { getCurrentUser, formatTime, fomatNum, changeDay,timestampToTime} from '../Utils'
const UserService = {
  findUserInfo(userName) {
    let loginUser = getCurrentUser();
    let data = {
      'username':userName || '',
      'loginUserName':loginUser?loginUser.userName:'',
      'filter':'statistic,fans,level'
    };
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_GATEWAY_URL}v1/getPersonalInfo`, data).then((response) => {
        if(response.data){
          let myCount = response.data.myCount ? response.data.myCount : {};
          const downloadInfor = response.data.download && response.data.download.userInfo ? response.data.download.userInfo : {};
          let blogInfor = response.data.blog && response.data.blog[userName].statistic ? response.data.blog[userName].statistic : {};
          blogInfor = fomatNum(blogInfor)
          myCount = fomatNum(myCount)
          const newObj =   Object.assign(response.data.user.user_info,myCount,downloadInfor,blogInfor);
         resolve(newObj)
        } else {
          resolve({})
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }
};
export default UserService
