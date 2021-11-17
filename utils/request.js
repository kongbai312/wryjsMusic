//引入服务器的基本信息
import config from './config'

// 封装请求函数
export default (url,data,method = 'GET') =>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url:config.host + url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').toString():''
      },
      success:(res)=>{
        // 判断如果是否是登录请求
        if(url==='login/cellphone'){//如果是登录请求
          //将cookie存入本地
          // console.log(res)
          //提取cookie中需要的部分
          wx.setStorageSync('cookies', res.cookies.find(item => {
            return item.indexOf('MUSIC_U') !== -1
          }) )
        }
        resolve(res.data);
      },
      fail:(err)=>{
        console.log('请求失败',err)
        reject()
      }
    })
  })
}
