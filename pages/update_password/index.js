// pages/update_password/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
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
  onClickLeft() {
    wx.navigateBack();
  },
  onInputOldPwd(e) {
    this.setData({
      oldPassword: e.detail
    })
  },
  onInputNewPwd(e) {
    this.setData({
      newPassword: e.detail
    })
  },
  onInputConfirmPwd(e) {
    this.setData({
      confirmPassword: e.detail
    })
  },
  doUpdatePwd() {
    // 判断输入是否正确
    if (null == this.data.oldPassword || '' == this.data.oldPassword) {
      Toast.fail('请输入旧密码');
    } else if (null == this.data.newPassword || '' == this.data.newPassword) {
      Toast.fail('请输入新密码');
    } else if (null == this.data.confirmPassword || '' == this.data.confirmPassword) {
      Toast.fail('请确认密码');
    } else if (this.data.newPassword != this.data.confirmPassword) {
      Toast.fail('两次输入的密码不一致');
    } else {
      app.request({
        method: 'put',
        url: app.config.updatePwdUrl,
        data: {
          oldPassword: this.data.oldPassword,
          newPassword: this.data.newPassword
        }
      }).then(res => {
        if (200 == res.data.code) {
          Toast.success('修改成功');
          setTimeout(function () {
            wx.navigateBack({
              delta: 0,
            })
          }, 1000)
        } else {
          Toast.fail(res.data.msg);
        }
      })
    }
  }
})