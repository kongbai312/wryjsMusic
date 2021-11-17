// pages/index/index.js
//引入封装好的请求函数
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],         //用来存储banner的数据
    recommendList:[],       //用来存储推荐歌曲列表  
    topList:[],             //用来存储排行榜歌曲
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取初始化数据
    this.getInitData()
  },
  //用来发送请求获取初始化数据的函数
  async getInitData(){
    // 发送请求获取数据
    let resultBanners = await request('banner',{type:2})
    let resultRecommendList = await request('personalized')
    this.setData({
      banners:resultBanners.banners,
      recommendList:resultRecommendList.result
    })
    //获取排行榜数据
    let index = 0;
    let indexArr = []
    while(index<5){
      let result = await request('top/list',{idx:index++})
      indexArr.push({
        name:result.playlist.name,
        tracks:result.playlist.tracks.slice(0,3)
      })
      //放在循环中 优点 用户体验好，网络不好的话，仍然能展示部分数据
      //缺点 刷新次数太多 性能下降
      this.setData({
        topList:indexArr
      })
    }
    //当全部获取到后再存，
    //这样存放数据优点 1.刷新次数少  
    //缺点：如果用户网络不好，请求没发完的话，页面会造成空白，必须获取到所有数据页面才能展示
    // this.setData({
    //   topList:indexArr
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})