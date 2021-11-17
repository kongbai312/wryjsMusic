//引入封装好的请求函数
import request from '../../utils/request'

let startY = 0;         //鼠标开始移动时候的位置
let endY = 0;           //鼠标移动结束的位置
let moveY = 0;          //移动的距离      （结束-开始）

// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    distanceY:'',     //存储带单位的距离
    transitionY:'',   //移动的距离
    userInfo:{},      //存储用户的信息
    recentPlayList:[],//最近播放列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取本地的用户信息
    let userInfo = wx.getStorageSync('userInfo')
    //判断userInfo是否有值
    if(userInfo){//已经登录
      //将数据存入data
      this.setData({
        userInfo
      })
      //发送请求，读取用户的最近播放记录
      this.getRecentPlayData(userInfo.userId)
    }
  },

  //鼠标开始移动触发的事件
  handleTouchStart(event){
    //清空过渡属性
    this.setData({
      transitionY:''
    })
    //存储开始时候的鼠标Y
    startY = event.touches[0].clientY
  },

  //鼠标移动时，触发的事件
  handleTouchMove(event){
    //存储结束位置的鼠标Y
    endY = event.touches[0].clientY
    //存储移动的距离
    moveY = endY - startY
    //进行数据处理
    if(moveY<0){
      return;
    }
    if(moveY>80){
      moveY = 80;
    }
    //将moveY加单位存储入data中
    this.setData({
      distanceY:`${moveY}rpx`
    })
  },

  //鼠标结束移动时，触发的事件
  handleTouchEnd(){
    //将位置还原
    this.setData({
      distanceY:'',
      transitionY:'transform 1s linear;'
    })
  },

  //跳转至登录页
  toLogin(){
    //判断是否已经登录
    if(this.data.userInfo.nickname){
      return;
    }
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  //发送请求，获取最近播放记录
  async getRecentPlayData(userId){
    let result = await request('user/record',{uid:userId,type:0})
    let index = 0
    let recentPlayList = result.allData.map(item=>{
      item.id = index++
      return item
    }).slice(0,10)
    //将数据存入data
    this.setData({
      recentPlayList
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