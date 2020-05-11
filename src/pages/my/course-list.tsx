import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, View, Image, ScrollView } from '@tarojs/components'
import { AtList, AtListItem, AtTimeline } from 'taro-ui'
// import { AppNavigatorToCourseDetail } from '../../common/Utils'
import './course-list.styl'
import CourseService from '../../common/service/CourseService'
import noCoursePng from '../../static/noCourse.png'



export default class courseList extends Component {
    config = {
      navigationStyle: 'custom'
    };
    constructor(props) {
      super(props);
      this.state = {
        curNavtab: 0,
        redeemCoursePage: 1,
        redeemCourseList: [],
        boughtCoursePage: 1,
        boughtCourseList: [],
        recentCoursesList: [],
        freeClassList : [],
        loading: true,
        blank: false,
        isIOS: false
      }
    }
    componentWillMount() { }
    componentDidMount() {
      Taro.getSystemInfo({
        success: (res) => {
          console.log('res=======systerm====', res)
          if (res.system && res.system === 'iOS') {
            this.setState({
              isIOS: true
            })
            // this.loadRedeemCourses()
            this.loadRecentCourses()
            // this.loadBoughtCourses()
          } else {
            // this.loadRedeemCourses()
            this.loadRecentCourses()
            // this.loadBoughtCourses()
          }
        },
        fail: (err) => {
          // reject(err)
        }
      })
    //   this.loadFreeClass()
    }
    componentDidShow() { }
    // loadRedeemCourses() {
    //   CourseService.getRedeemCourse(this.state.redeemCoursePage, 30).then((data) => {
    //     if (data.list != undefined) {
    //       this.setState({
    //         redeemCourseList: this.state.redeemCourseList.concat(data.list),
    //         redeemCoursePage: this.state.redeemCoursePage + 1
    //       })
    //     }
    //   })
    // }
    // loadBoughtCourses() {
    //   if (this.state.blank)
    //     return
    //   CourseService.getBoughtCourse(this.state.boughtCoursePage, 30).then((data) => {
    //     if (!data.list.length) {
    //       this.setState({
    //         blank: true
    //       })
    //     }
    //     if (data.list != undefined) {
    //       this.setState({
    //         boughtCourseList: this.state.boughtCourseList.concat(data.list),
    //         boughtCoursePage: this.state.boughtCoursePage + 1
    //       })
    //     }
    //   })
    // }
    loadRecentCourses() {
      CourseService.getRecentCourse({}).then((data) => {
          console.log(data,'1234567')
        if (data != undefined) {
          this.setState({
            recentCoursesList: data,
            loading: false
          })
        }
      })
    }
    // loadFreeClass() {
    //   CourseService.getFreeClass().then((data)=>{
    //     if(data.length){
    //       this.setState({"freeClassList" : data})
    //     }
    //   })
    // }
    toCourseDetail(course_id) {
      AppNavigatorToCourseDetail(course_id)
    }
    switchTab(index) {
      this.setState({
        curNavtab: index
      });
    }
    swiperChange(index, e) {
      this.setState({
        curNavtab: e.detail.current
      });
    }
    render() {
      const { curNavtab, recentCoursesList, redeemCourseList, boughtCourseList, loading, isIOS, freeClassList } = this.state
      let dynamicHeight = 0;
      Taro.getSystemInfo({
        success: res => dynamicHeight = res.windowHeight - 49
      })
      let navTabsList = [
        { index: 0, title: "最近学习" },
        { index: 1, title: "已兑换" },
        { index: 2, title: "限时学" },
        { index: 3, title: "已购买" }
      ]
      return (
        <View className='container'>
          <View>
            <View className='nav-tabs'>
              {navTabsList.map(cat => {
                return <View className={curNavtab === cat.index ? 'tab-item active' : 'tab-item'} onClick={this.switchTab.bind(this, cat.index)}>
                  {cat.title}
                  <View className={curNavtab === cat.index ? 'underline' : ''}></View>
                </View>
              })}
            </View>
          </View>
          <Swiper
            style={{ height: dynamicHeight }}
            current={curNavtab}
            onChange={this.swiperChange.bind(this, curNavtab)}
            skipHiddenItemLayout
          >
            <SwiperItem>
              <ScrollView scrollY scrollX={false} style={{ height: dynamicHeight }} >
                {!loading && recentCoursesList && recentCoursesList.length === 0 ?
                  <View className='empty-list' style={{ height: dynamicHeight }}>
                    <Image className='empty-img' src={noCoursePng}></Image>
                    <View className='empty-text'>暂无课程</View>
                  </View> :
                  <AtTimeline
                    pending
                    items={
                      recentCoursesList.map((item) => {
                      console.log(item);
                        return {
                          title: item[0],
                        //   content: [
                        //     <AtList hasBorder={false}>
                        //       {item[1].map(listItem => {
                        //         return (
                        //           <AtListItem
                        //             className='list-item'
                        //             title={listItem.course_name}
                        //             note={`已学过 ${listItem.rate}`}
                        //             arrow='right'
                        //             thumb={listItem.course_logo}
                        //             hasBorder={false}
                        //             onClick={this.toCourseDetail.bind(this, listItem.course_id)}
                        //           />)
                        //       })}
                        //     </AtList>
                        //   ]
                        }
                      })
                    }
                  >
                  </AtTimeline>
                }
              </ScrollView>
            </SwiperItem>
            <SwiperItem>
              {/* <ScrollView scrollY scrollX={false} style={{ height: dynamicHeight }} onScrollToLower={this.loadRedeemCourses.bind(this)}>
                {!loading && redeemCourseList && redeemCourseList.length === 0 ?
                  <View className='empty-list' style={{ height: dynamicHeight }}>
                    <Image className='empty-img' src={noCoursePng}></Image>
                    <View className='empty-text'>暂无课程</View>
                  </View> :
                  <AtList className='class-list' hasBorder={false}>
                    {redeemCourseList.map(item => {
                      return <AtListItem
                        className='list-item'
                        title={item.course_name}
                        extraText={item.status_text}
                        note={`有效期 ${item.course_expire_time}`}
                        thumb={item.course_logo}
                        hasBorder={false}
                        onClick={this.toCourseDetail.bind(this, item.course_id)}
                      />
                    })}
                  </AtList>
                }
              </ScrollView> */}
            </SwiperItem>
            <SwiperItem>
              {/* <ScrollView scrollY scrollX={false} style={{ height: dynamicHeight }}>
                {!loading && freeClassList && freeClassList.length === 0 ?
                  <View className='empty-list' style={{ height: dynamicHeight }}>
                    <Image className='empty-img' src={noCoursePng}></Image>
                    <View className='empty-text'>暂无课程</View>
                  </View> :
                  <AtList className='class-list' hasBorder={false}>
                    {freeClassList.map(item => {
                      return <AtListItem
                        className='list-item'
                        title={item.course_name}
                        note={`课程原价:￥${item.course_final_price} 课时:${item.lessons}`}
                        thumb={item.course_logo}
                        hasBorder={false}
                        onClick={this.toCourseDetail.bind(this, item.course_id)}
                      />
                    })}
                  </AtList>
                }
              </ScrollView> */}
            </SwiperItem>
  
          <SwiperItem>
              {/* <ScrollView scrollY scrollX={false} style={{ height: dynamicHeight }} onScrollToLower={this.loadBoughtCourses.bind(this)}>
                {!loading && boughtCourseList && boughtCourseList.length === 0 ?
                  <View className='empty-list' style={{ height: dynamicHeight }}>
                    <Image className='empty-img' src={noCoursePng}></Image>
                    <View className='empty-text'>暂无课程</View>
                  </View> :
                  <AtList className='class-list' hasBorder={false}>
                    {boughtCourseList.map(item => {
                      return <AtListItem
                        className='list-item'
                        title={item.course_name}
                        note={`购买日期 ${item.create_time}`}
                        extraText={`订单号：${item.order_id}`}
                        thumb={item.course_logo}
                        hasBorder={false}
                        onClick={this.toCourseDetail.bind(this, item.course_id)}
                      />
                    })}
                  </AtList>
                }
              </ScrollView> */}
            </SwiperItem>
          </Swiper>
  
        </View>
      )
    }
  }