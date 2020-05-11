const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
// console.log('环境变量: process.env=', process.env)

const CFG = {
    prod: {
        PROJECT_NAME: 'SEED_TAROAPP',
        NODE_ENV: process.env.NODE_ENV,
        ENV: env,
        API_URL: 'https://statistic.csdn.net/',
        API_PASSPORT_URL: 'https://passport.csdn.net/',
        API_SO_URL: 'https://so.csdn.net',
        API_TEST: 'https://statistic.csdn.net/',
        API_GATEWAY_URL: 'https://gw.csdn.net/mini-app/',
        // API_GATEWAY_URL: 'https://gw.csdn.net/mini-app/',
        API_BLOG_URL: 'https://blog.csdn.net/',
        // API_MALL_URL:'https://mall.csdn.net/api/app/v1',
        // API_ORDER_URL:'https://order.csdn.net/api/app/v1',
        // API_COURSE_URL:'https://edu.csdn.net/api/app/v1',
        API_MALL_URL: 'https://mall.csdn.net/api/app/v' + 1 + '/',
        API_ORDER_URL:
            'https://order.csdn.net/api/app/v' + 1 + '/',
        API_COURSE_URL: 'https://edu.csdn.net/api/h5/v' + 1 + '/'
    },
    dev: {
        PROJECT_NAME: 'SEED_TAROAPP',
        NODE_ENV: process.env.NODE_ENV,
        ENV: env,
        API_URL: 'https://statistic.csdn.net/',
        API_PASSPORT_URL: 'https://passport.csdn.net/',
        // API_PASSPORT_URL: 'https://passport.csdn.net/',
        API_SO_URL: 'https://so.csdn.net/',
        API_TEST: 'https://statistic.csdn.net/',
        API_GATEWAY_URL: 'https://gw.csdn.net/mini-app/',
        API_BLOG_URL: 'https://blog.csdn.net/',
        API_GATEWAY_MOCKURL:
            'https://easy-mock.com/mock/5ca5c50bf1c0fd3711352d27/',
        API_MALL_URL: 'https://mall.csdn.net/api/app/v' + 1 + '/',
        API_ORDER_URL:
            'https://order.csdn.net/api/app/v' + 1 + '/',
        API_COURSE_URL: 'https://edu.csdn.net/api/h5/v' + 1 + '/'
    }
}

export default CFG[env]
