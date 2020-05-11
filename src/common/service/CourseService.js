import Http from '../HttpInteceptor'
import CFG from '../Config'

const CourseService = {
  /**
   * 获得最近学习的课程列表
   */
  getRecentCourse(data={}) {
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_COURSE_URL}recentStudyCourseList`,data).then((response) => {
        if (response.data) {
          if (JSON.stringify(response.data) !== '{}') {
            resolve(response.data)
          } else {
            resolve([])
          }
        } else {
          reject([])
        }
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 获得已兑换的课程列表
   * @param page
   * @param page_size
   */
  getRedeemCourse(page, page_size) {
    const data = {
      page,
      page_size
    };
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_COURSE_URL}exchangeCourseList`, data).then((response) => {
        resolve(response.data.exchange_record_list)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 获得已购买的课程列表
   * @param page
   * @param page_size
   */
  getBoughtCourse(page, page_size) {
    const data = {
      page,
      page_size
    };
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_COURSE_URL}hasBuyCourseList`, data).then((response) => {
        // console.log(response)
        resolve(response.data.course_list)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  /**
   * 获得霸王课列表
   * @param page
   * @param page_size
   */
  getFreeClass() {
    return new Promise((resolve, reject) => {
      Http.get(`${CFG.API_COURSE_URL}receiveCourseList`).then((response) => {
        // console.log(response)
        resolve(response.data.data)
      }).catch((error) => {
        reject(error)
      })
    })
  }


  
};
export default CourseService
