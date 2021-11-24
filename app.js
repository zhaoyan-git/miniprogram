// app.js
App({
  config: require('./config'),

  onLaunch() {
  },

  globalData: {
  },
  onShow() {
    var that = this
    // 判断登录状态
    var token = wx.getStorageSync('token')
    if (null == token || '' == token) {
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login'
        })
      }, 100)
    }
  },
  // 登录方法
  login: function (username, password) {
    var that = this

    return new Promise((resolve, reject) => {
      wx.request({
        method: 'POST',
        url: that.config.loginUrl,
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json;charset=UTF-8'
        },
        success(res) {
          if (res.statusCode == 200) {
            if (200 == res.data.code) {
              // 保存用户信息
              wx.setStorageSync("token", res.data.token)
              wx.setStorageSync("loginInfo", {
                'username': username,
                'password': password
              })

              // 获取用户信息
              that.request({
                method: 'get',
                url: that.config.getInfoUrl
              }).then(res => {
                wx.setStorageSync("permissions", res.data.permissions)
                wx.setStorageSync("roles", res.data.roles)
                wx.setStorageSync("user", res.data.user)
              })
            }
          } else {
            wx.showToast({
              title: '系统异常！',
              icon: 'error',
              duration: 2000
            })
          }
          resolve(res.data)
        },
        fail() {
          wx.showToast({
            title: '网络异常！',
            icon: 'error',
            duration: 2000
          })
          reject(err)
        }
      })
    })

  },
  // 封装请求
  request: function (requestData) {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.request({
        method: requestData.method,
        url: requestData.url,
        data: requestData.data,
        header: {
          'content-type': requestData.contentType == null ? 'application/x-www-form-urlencoded' : requestData.contentType,
          'Authorization': wx.getStorageSync('token')
        },
        success(res) {
          if (res.statusCode == 401) {
            //如果是token过期
            //返回首页 重新登录
            this.doLogout()

          } else if (res.statusCode == 200) {
            if (401 == res.data.code) {
              this.doLogout()
            }

            resolve(res)
          } else {
            wx.showToast({
              title: '系统异常！',
              icon: 'error',
              duration: 2000
            })
            reject(res)
          }
        },
        fail() {
          wx.showToast({
            title: '网络异常！',
            icon: 'error',
            duration: 2000
          })
        }
      })
    })

  },
  // 注销
  doLogout() {
    // 清空登录信息
    wx.setStorageSync("loginInfo", null)
    wx.setStorageSync("permissions", null)
    wx.setStorageSync("roles", null)
    wx.setStorageSync("user", null)

    setTimeout(() => {
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }, 100)
  }
  // TODO 每次打开检查登录状态
})
