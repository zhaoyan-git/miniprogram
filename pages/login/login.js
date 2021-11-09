// pages/login/login.js
// import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  doLogin: function () {
    var that = this

    // 判断账号密码是否为空
    if ('' == this.data.username || '' == this.data.password) {
      Dialog.alert({
        message: '账号及密码不能为空！',
      }).then(() => { });

      return;
    }

    app.login(this.data.username, this.data.password).then(res => {
      if (200 == res.code) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      } else {
        Dialog.alert({
          message: res.msg,
        }).then(() => { });
      }
    })

  },
  onChangeUsername: function (e) {
    this.setData({
      username: e.detail
    })
  },
  onChangePassword: function (e) {
    this.setData({
      password: e.detail
    })
  },
})