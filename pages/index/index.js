// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    projectList: [],
    alarmColor: [
      '#ffffff',
      '#ff0000',
      '#ffad00',
      '#fff700'
    ]
  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this
    this.getTabBar().init();

    app.request({
      method: 'get',
      url: app.config.projectDataListUrl
    }).then(res => {
      that.setData({
        projectList: res.data
      })
    })
  },
  goProjectData: function (e) {
    wx.navigateTo({
      url: '/pages/project_data/project_data?projectId=' + e.currentTarget.dataset.id +
        '&structureCount=' + e.currentTarget.dataset.structurecount +
        '&pointCount=' + e.currentTarget.dataset.pointcount +
        '&dtoCount=' + e.currentTarget.dataset.dtocount +
        '&alarmCount=' + e.currentTarget.dataset.alarmcount,
    })
  },

})
