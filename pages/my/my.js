// pages/my/my.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    userData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: wx.getStorageSync('user')
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
    this.getTabBar().init();
    var that = this


    app.request({
      method: 'get',
      url: app.config.userDataUrl
    }).then(res => {
      console.log(res.data)
      that.setData({
        data: res.data
      })
    })
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

  },
  goPage: function (e) {
    console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  // 注销
  doLogout() {
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
})