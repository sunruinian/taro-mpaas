import Http from '../HttpInteceptor'
import CFG from '../Config'

const ActivityService = {
    /**
     * 签到
     * @param product 默认app
     */
    signIn() {
        let data = {  }
        return new Promise((resolve, reject) => {
            Http.post(
                `${CFG.API_GATEWAY_URL}v2/lucky_draw/login/sign_in`,
                data
            ).then(
                response => {
                    resolve(response.data)
                },
                error => {
                    reject(error)
                }
            )
        })
    },
    /**
     * 获得用户签到记录
     * @param page
     * @param page_size
     */
    getCheckinRecord() {
        const data = {
        }
        return new Promise((resolve, reject) => {
            Http.get(
                `${CFG.API_GATEWAY_URL}v2/lucky_draw/login/sign_info`,
                data
            )
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    /**
     * 获得奖品信息
     */
    getPrizeInfo() {
        return new Promise((resolve, reject) => {
            Http.get(`${CFG.API_GATEWAY_URL}v1/lucky_draw/may_login/lottery`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    /**
     * 获得抽奖历史
     */
    getHistoryInfo() {
        return new Promise((resolve, reject) => {
            Http.get(`${CFG.API_GATEWAY_URL}v1/lucky_draw/login/my_history`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    /**
     * 获得抽奖历史
     */
    getWinnerHistory() {
        return new Promise((resolve, reject) => {
            Http.get(`${CFG.API_GATEWAY_URL}v1/lucky_draw/may_login/history`)
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    },
    /**
     * 抽奖
     * @param product
     * @param id
     */
    draw(product, id) {
        const data = {
            product,
            id
        }
        return new Promise((resolve, reject) => {
            Http.post(
                `${CFG.API_GATEWAY_URL}v2/lucky_draw/login/good_luck`,
                data
            )
                .then(response => {
                    resolve(response.data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}
export default ActivityService
