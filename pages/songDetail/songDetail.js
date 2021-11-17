// pages/songDetail/songDetail.js
//引入pubsub 消息订阅
import moment from 'moment'
import PubSub from 'pubsub-js'

//引入封装好的请求函数
import request from '../../utils/request'

//获取app.js全局对象
let appGobal = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,                       //是否在播放音乐
    musicInfo:{},                       //存储歌曲详情信息
    musicId:'',                         //音乐的id
    musicSrc:'',                        //存储当前播放的src
    currentTime:'00:00',                //实时播放时长
    durationTime:'00:00',               //总时长
    currentWidth:'0',                 //实时进度条长度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId);
    //读取全局音乐状态，判断音乐是否正在播放
    if(appGobal.gobalData.isMusicPlay&&appGobal.gobalData.musicId===musicId){
      this.setData({
        isPlay:true
      })
    }
    //监听音乐播放  修改音乐状态
    //获取全局唯一的背景音频管理器
    this.musicManager = wx.getBackgroundAudioManager()
    //监听音乐的播放   当音乐播放时，将页面以及全局状态修改为播放
    this.musicManager.onPlay(()=>{
      //调用封装好的修改状态的功能函数
      this.changeIsPlayState(true)
      // 存储ID
      appGobal.gobalData.musicId = musicId
    })
    //监听音乐的暂停  当音乐暂停时，将页面以及全局状态修改为暂停
    this.musicManager.onStop(()=>{
      //调用封装好的修改状态的功能函数
      this.changeIsPlayState(false)
    })
    //监听音乐的停止  当音乐停止时，将页面以及全局状态修改为停止
    this.musicManager.onPause(()=>{
      //调用封装好的修改状态的功能函数
      this.changeIsPlayState(false)
    })
    //监听音乐的自然播放完成
    this.musicManager.onEnded(()=>{
      //自动切换下一首歌曲
      PubSub.publish('switchType','next')
      //还原状态
      this.setData({
        currentTime:'00:00',                //实时播放时长
        durationTime:'00:00',               //总时长
        currentWidth:'0',                   //实时进度条长度
      })
    })

    //监听音乐的时长
    this.musicManager.onTimeUpdate(()=>{
      //currentTime实时播放时长，duration总时长
      // console.log(this.musicManager.currentTime,this.musicManager.duration)
      //
      let currentTime = moment(this.musicManager.currentTime*1000).format('mm:ss')
      let currentWidth = this.musicManager.currentTime/this.musicManager.duration*450
      this.setData({
        currentTime,
        currentWidth
      })
    })

    //消息订阅，接收recommendMusic的musicId
    PubSub.subscribe('musicId',(msg,musicId)=>{
      //获取新的歌曲详情
      this.getMusicInfo(musicId)
      //自动播放歌曲
      this.musicControl(true,musicId)
    })
  },

  //发送请求获取歌曲详情
  async getMusicInfo(musicId){
    let result = await request('song/detail',{ids:musicId})
    let durationTime = moment(result.songs[0].dt).format('mm:ss')
    this.setData({
      musicInfo:result.songs[0],
      durationTime
    })
    //动态设置导航标题
    wx.setNavigationBarTitle({
      title:this.data.musicInfo.name
    })
  },

  //点击播放/暂停的回调
  handleMusicPlay(){
    //将isPlay取出并进行取反保存
    let isPlay = !this.data.isPlay
    //有了监听就不需要这个
    // this.setData({
    //   isPlay
    // })
    let {musicId,musicSrc} = this.data
    //调用控制音乐播放的功能函数
    this.musicControl(isPlay,musicId,musicSrc)
  },

  //控制音乐播放的功能函数
  async musicControl(isPlay,musicId,musicSrc){
    if(isPlay){
      if(!musicSrc){
        //发送请求获取音乐的src
        let result = await request('song/url',{id:musicId})
        //获取音乐的src
        musicSrc = result.data[0].url
        //存储入data
        this.setData({
          musicSrc
        })
      }
      
      //设置src
      this.musicManager.src = musicSrc
      this.musicManager.title = this.data.musicInfo.name
      //将音乐状态存储入全局数据  
      //有了监听，监听里面会修改
      // appGobal.gobalData.isMusicPlay = true
      // appGobal.gobalData.musicId = musicId
    }
    else{
      //暂停音乐
      this.musicManager.pause()
      //将音乐状态存储入全局数据
      //有了监听，监听里面会修改
      // appGobal.gobalData.isMusicPlay = false
    }
  },
  
  //封装修改状态的功能函数
  changeIsPlayState(isPlay){
    //修改data
    this.setData({
      isPlay
    })
    //修改全局状态
    appGobal.gobalData.isMusicPlay = isPlay
  },

  //点击切换歌曲的回调
  handleSwitch(event){
    let type = event.target.id
    //当前歌曲暂停
    this.musicManager.stop()
    //pubsub消息发布
    PubSub.publish('switchType',type)
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