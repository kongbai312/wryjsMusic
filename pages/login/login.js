// pages/login/login.js
//引入封装好的请求函数
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',             //用来存储登录的手机号
    password:'',          //用来存储密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //用来实现存储phone,password
  handleInput(event){
    //存储表示为phone,password字段的标识符,data-phone
    let type = event.target.dataset.type
    //存储相应字段的值
    let value = event.detail.value
    this.setData({
      [type]:value
    })
    
  },

  //登录
  async login(){
    //获取data中的数据
    let {phone,password} = this.data
    //如果phone为空
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon:'error'
      })
      return;
    }

    //手机号的正则表达式验证
    let phoneReg = /^1[3|4|5|7|8]\d{9}$/ 
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon:'error'
      })
      return;
    }

    //如果密码为空
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return;
    }

    //正式登录
    let result = await request('login/cellphone',{phone,password})
    //根据返回的状态码判断是否登录成功
    if(result.code === 200){
      wx.showToast({
        title: '登录成功',
        icon:'success'
      })
      //存储用户信息至本地
      wx.setStorageSync('userInfo', result.profile)
      //跳转至用户中心界面
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }
    else if(result.code === 400){
      wx.showToast({
        title: '用户名有误',
        icon:'error'
      })
    }
    else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon:'error'
      })
    }
    else{
      wx.showToast({
        title: '登录失败，请重新登录',
        icon:'error'
      })
    }

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