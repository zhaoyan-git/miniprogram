// pages/alarm/alarm.js
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    projectList: [],
    optionProject: [],
    conditionProjectId: -1,
    loadingFlag: false,
    optionReadFlag: [
      { text: '全部', value: '-1' },
      { text: '未读', value: '0' },
      { text: '已读', value: '1' },
    ],
    conditionReadFlag: null
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
    var that = this
    this.getTabBar().init();

    this.loadData()

    app.request({
      method: 'get',
      url: app.config.projectDataListUrl
    }).then(res => {
      var tempOptionProject = [{
        text: '选择项目',
        value: -1
      }]

      if (null != res.data) {
        for (var i = 0; i < res.data.length; i++) {
          tempOptionProject.push({
            text: res.data[i].name,
            value: res.data[i].id
          })
        }
      }

      that.setData({
        projectList: res.data,
        optionProject: tempOptionProject
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
  goDetail: function (data) {
    wx.navigateTo({
      url: '/pages/alarm_detail/alarm_detail?title=' + this.data.list[data.currentTarget.dataset.index].title
       + '&content=' + this.data.list[data.currentTarget.dataset.index].content
       + '&id=' + this.data.list[data.currentTarget.dataset.index].id,
    })
  },
  conditionProjectChange: function (e) {
    this.setData({
      conditionProjectId: e.detail
    })

    this.loadData()
  },
  conditionReadFlagChange: function (e) {
    this.setData({
      conditionReadFlag: e.detail
    })

    this.loadData()
  },
  loadData() {
    console.log(1)
    var that = this

    this.setData({
      loadingFlag: true
    })

    var paraData = {}

    if (null != this.data.conditionProjectId && -1 != this.data.conditionProjectId) {
      // paraData.push({
      //   projectId: this.data.conditionProjectId
      // })
      paraData.projectId = this.data.conditionProjectId
    }
    
    if (null != this.data.conditionReadFlag && -1 != this.data.conditionReadFlag) {
      // paraData.push({
      //   readFlag: this.data.conditionReadFlag
      // })
      paraData.readFlag = this.data.conditionReadFlag
    }

    app.request({
      method: 'get',
      url: app.config.projectAlarmRecordListByUser,
      data: paraData
    }).then(res => {
      that.setData({
        list: res.data.rows,
        loadingFlag: false
      })
    })
  }
})