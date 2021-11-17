// pages/recommendMusic/recommendMusic.js
//引入pubsub 消息订阅
import PubSub from 'pubsub-js'

//引入封装好的请求函数
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    month:'',                                 //月份
    day:'',                                   //日期
    recommendList:[],                         //存储每日推荐歌曲
    index:0,                                  //记录播放的音乐是第几首         
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //动态获取当前日期
    this.setData({
      month:new Date().getMonth() + 1,          //月份
      day:new Date().getDate(),   
    })
    //获取每日推荐歌曲的数据
    this.getRecommendList()

    //消息订阅songDetail 获取上一首还是下一首状态
    PubSub.subscribe('switchType',(msg,switchType)=>{
      let {index,recommendList} = this.data
      if(switchType==='pre'){//如果是上一首
        //设置边界值
        (index === 0)&&(index = recommendList.length)
        index --
      }
      else{//如果是下一首
        //设置边界值
        (index === recommendList.length-1)&&(index = -1)
        index ++
      }
      //更新index
      this.setData({
        index
      })
      //获取上下一首的歌曲id
      let musicId = recommendList[index].id
      //消息发布,将musicId传入songDetail
      PubSub.publish('musicId',musicId)
    })
  },

  //获取每日推荐歌曲请求
  async getRecommendList(){
    //发送请求
    let result =  await request('recommend/songs')
    //将数据存入data
    this.setData({
      recommendList:result.recommend
    })
  },

  //跳转至歌曲详情页面
  toSongDetail(event){
    let musicId = event.currentTarget.dataset.id
    let index = event.currentTarget.dataset.index
    //携带歌曲id
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+musicId,
    })
    //保存当前的音乐index
    this.setData({
      index
    })
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