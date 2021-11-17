// pages/video/video.js
//引入封装好的请求函数
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],            //视频标签列表的数据
    navId:0,                      //切换导航的标识符
    videoList:[],                 //视频列表
    videoId:'',                   //视频唯一标识
    videoTimeUpdate:[],           //存储视频播放时间历史
    isTriggered:false,            //标志下拉刷新状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取导航列表
    this.getVideoGroupList()
  },

  //发送请求，获取导航列表
  async getVideoGroupList(){
    let result = await request('video/group/list')
    this.setData({
      videoGroupList:result.data.slice(0,14),
      navId:result.data.slice(0,14)[0].id
    })
    //获取第一个导航列表的视频数据
    this.getVideoList(this.data.navId)
  },

  //改变导航条选中状态
  changeNav(event){
    //将点击的标识存入data
    this.setData({
      navId:event.target.dataset.id,
      videoList:[]
    })
    //加载过渡
    wx.showLoading({
      title: '正在加载',
    })
    //发送请求获取视频列表数据
    this.getVideoList(this.data.navId)
  },

  //获取视频标签下对应的视频列表
  async getVideoList(navId){
    let result = await request('video/group',{id:navId})
    if(!result.datas){
      return;
    }
    //定义唯一标识符
    let index = 0
    this.setData({
      videoList:result.datas.map(item=>{
        item.id = index++
        return item
      }),
      isTriggered:false
    })
    //得到数据后，隐藏加载
    wx.hideLoading()
  },

  //点击播放/继续播放触发的事件
  handlePlay(event){
    //点击其他播放时候，之前一个播放需要暂停
    //需要知道如何暂停，以及如何确认上一个视频
    //可以通过wx.createVideoContext创建一个VideoContext实例，实例方法中可以暂停
    let vid = event.currentTarget.id
    //解决多个视频同时播放问题
    // !!this.videoContent && this.vid !== vid && this.videoContent.stop();
    // this.vid = vid
    //存储vid到data中
    this.setData({
      videoId:vid
    })
    //创建视频上下文对象
    this.videoContent = wx.createVideoContext(vid)
    //取出视频时间数据
    let {videoTimeUpdate} = this.data
    //播放视频,判断是否为图片
    if(!event.currentTarget.dataset.isimg){
      let videoItem = videoTimeUpdate.find(item=>item.currentId===vid)
      //判断当前是否播放过
      if(videoItem){
        this.videoContent.seek(videoItem.currentTime)
      }
      this.videoContent.play()
    }
  },

  //视频播放进度变化时触发
  handleTimeUpdate(event){
    //获取播放历史的时间记录
    let currentTime = event.detail.currentTime
    let currentId = event.currentTarget.id
    //创建存储播放时间的对象
    let timeUpdateObj = {
      currentId,
      currentTime
    }
    //取出存储的数组
    let {videoTimeUpdate} = this.data
    //判断当前视频是否播放过
    let videoItem = videoTimeUpdate.find(item=>item.currentId===currentId)
    if(videoItem){//如果存在，则替换currentTime
      videoItem.currentTime = currentTime
    }
    else{
      videoTimeUpdate.push(timeUpdateObj)
    }
    //更新数据到data
    this.setData({
      videoTimeUpdate
    })
  },
  
  //视频结束时触发的回调
  handleEnded(event){
    //取出videoTimeUpdate
    let {videoTimeUpdate} = this.data
    //找到需要删除的数据的位置
    let startIndex = videoTimeUpdate.findIndex(item=>item.currentId===event.currentTarget.id)
    //从数组中删除这段数据
    videoTimeUpdate.splice(startIndex,1)
    //重新更新data
    this.setData({
      videoTimeUpdate
    })
  },

  //scroll-view下拉刷新触发的回调
  handleRefresher(){
    //发送请求获取新的视频数据
    this.getVideoList(this.data.navId)
  },

  //scroll-view滚动到底部时触发
  handleTolower(){
    let {videoList} = this.data
    videoList.push(...videoList)
    this.setData({
      videoList
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
  onShareAppMessage: function ({from}) {
    if(from==='menu'){
      return {
        title:'不愧是笨笨嗷',
        page:'/pages/video/video',
        imageUrl:'/static/images/benben.jpg'
      }
    }
  }
})