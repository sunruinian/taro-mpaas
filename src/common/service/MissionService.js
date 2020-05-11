import Http from '../HttpInteceptor'
import CFG from '../Config'
import { getCurrentUser, formatTime, fomatNum, changeDay,timestampToTime} from '../Utils'
const MissionService = {
  getMissionList (userName) {
    let data = {
      'userName' : userName
    }
    return new Promise((resolve, reject) => {
      Http.get(`https://gw.csdn.net/cms-app/v1/balance_internal/detail`,data).then((response) => {
         console.log(response.data)
         resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getScore (userName,id) {
    let data = {
      "userName" : userName,
      'taskId' : id,
    };
    return new Promise((resolve, reject) => {
      Http.post(`https://gw.csdn.net/cms-app/v1/balance_internal/add_score`, data).then((response) => {
         console.log(response)
         resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getTopicList(){
    return new Promise((resolve, reject) => {
      Http.get(`https://gw.csdn.net/cms-app/v1/group_internal//hot_topic`).then((response) => {
         console.log(response)
         resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
};
export default MissionService