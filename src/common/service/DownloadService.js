import Http from '../HttpInteceptor'
import CFG from '../Config'
import { timestampToTime,ordertimestamp } from '../Utils'

const DownloadService = {
  getDownload(downloadId){
    let data = {
      'downloadId': downloadId
    };
    // ${CFG.API_GATEWAY_URL}
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_GATEWAY_URL}v1/download/may_login/get_download_info`, data).then((response) => {
        console.log(response,"doanload详情")
        if(response.data&&response.data.showUpdateTime){
          response.data.showUpdateTime = timestampToTime(response.data.showUpdateTime)
        }
        const arry = ['7z','blog','doc','docx','exe','gz','pdf','ppt','pptx','rar','txt','vsd','xls','xlsx','zip']
        if(response.data&&response.data.filetype){
          const flag = arry.every((value,dex,ary)=>{
            return !value.includes(response.data.filetype)
          })
          if(flag){
            response.data.filetype = 'unkown1'
          }
        }

        if(response.data&&response.data.vip_info) {
          if(response.data.vip_info.end_time) {
            response.data.vip_info.end_time = ordertimestamp(response.data.vip_info.end_time)
          }
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getDownloadSuggest(downloadId) {
    let data = {
      'downloadId': downloadId,
      'size' : '50'
    };
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_GATEWAY_URL}v1/download/may_login/list_recommend`, data).then((response) => {
        console.log(response, "doanload推荐")
        const reg = /\[em\]/g
        const reg1 = /\[\/em\]/g
        if (response.data) {
          var newArray = response.data.length&&response.data.forEach((item) => {
            if (item.title) {
              item.title = item.title.replace(reg, `<span style='color : #CA0C16;'>`)
              item.title = item.title.replace(reg1, `</span>`)
            }

            if(item&&item.showCreateTime) {
              item.showCreateTime = timestampToTime(item.showCreateTime)
            }
          })
        }
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  //收藏和取消收藏
  addFavorite(url, title, username, id) {
    return new Promise((resolve, reject) => {
      let data = {
        "url": url,
        "title": title,
        "author": username,
        "source": "download",
        "sourceId": id,
        "folderId": ""
      };
      Http.post(`${CFG.API_GATEWAY_URL}v1/me/login/favorite`, data).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        reject(error)
      })
    })
  },
  cancelFavorite(id) {
    return new Promise((resolve, reject) => {
      let data = {
        "id": id,
        "source": "download"
      };
      Http.post(`${CFG.API_GATEWAY_URL}v1/me/login/del_favorite`, data).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getDownloadHistory(userName,page) {
    let data = {
      'userName': userName,
      'page' : page,
      'size' : '15'
    };
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_GATEWAY_URL}v1/download/may_login/my_downloads`, data).then((response) => {
        console.log(response, "下载历史")
        response.data&&response.data.length&&response.data.map((item)=>{
          if(item.showUpdateTime) {
            item.showUpdateTime = timestampToTime(item.showUpdateTime)
          }
        });
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  getLink(sourceId) {
    // 需要登录
    let data = {
      sourceId
    };
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_GATEWAY_URL}v1/download/login/get_download_url`, data).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
}

export default DownloadService
