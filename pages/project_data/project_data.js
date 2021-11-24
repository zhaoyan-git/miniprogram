// pages/project_data/project_data.js
import * as echarts from '../../ec-canvas/echarts';
// 获取应用实例
const app = getApp()

let chart = null;

function initChart(canvas, width, height, dpr) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      onInit: initChart
    },
    projectId: null,
    structureCount: null,
    pointCount: null,
    dtoCount: null,
    alarmCount: null,
    itemTitle1: '',
    itemTitle2: '请选择测点/设备',
    structureList: [],
    selectedStructure: {
      id: '',
      name: ''
    },
    selectedDevice: {
      id: '',
      name: ''
    },
    value1: 0,
    collapseActiveName: '1',
    mainActiveIndex: 0,
    activeId: null,
    pointData: [],
    chartShowStatus: true,
    chartOptionSeries: [],
    conditionDate: '',
    beginReleaseTime: '',
    endReleaseTime: '',
    conditionShow: false,
    conditionDateMinDate: new Date(2020, 10, 1).getTime(),

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      projectId: options.projectId,
      structureCount: options.structureCount,
      pointCount: options.pointCount,
      dtoCount: options.dtoCount,
      alarmCount: options.alarmCount
    })

    app.request({
      method: 'get',
      url: app.config.projectStructureListUrl,
      data: {
        projectId: this.data.projectId
      }
    }).then(res => {
      that.setData({
        structureList: res.data
      })
    })

    this.getDeviceList()

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
  // 选择结构物事件
  onChangeStructure(event) {
    this.setData({
      selectedStructure: event.currentTarget.dataset,
    });
    this.getProjectPointList()
  },
  // 选择结构物事件
  onClickStructure(event) {
    this.setData({
      selectedStructure: event.currentTarget.dataset,
    });
    this.getProjectPointList()
  },
  // 根据结构物ID获取测点列表
  // 获取设备列表
  getDeviceList() {
    app.request({
      method: 'get',
      url: app.config.deviceListUrl,
      data: {
        projectId: this.data.projectId
      }
    }).then(res => {
      this.setData({
        deviceList: res.data
      })
    })
  },
  onChangeCollapseActiveName(event) {
    this.setData({
      collapseActiveName: event.detail,
    });
  },
  // 选择设备事件
  onClickDevice(event) {
    this.setData({
      selectedDevice: event.currentTarget.dataset,
    });
    this.getDeviceData()
  },
  // 根据结构物ID获取测点
  getProjectPointList() {
    app.request({
      method: 'get',
      url: app.config.projectPointListUrl,
      data: {
        projectStructureId: this.data.selectedStructure.id
      }
    }).then(res => {
      var data = res.data
      var pointData = []

      if (null != data) {
        for (var i = 0; i < data.length; i++) {
          var item = data[i]
          if (null != item.children && 0 < item.children.length) {
            var itemData = {
              text: item.name,
              children: []
            }

            for (var j = 0; j < item.children.length; j++) {
              itemData.children.push({
                text: item.children[j].name,
                id: item.children[j].id,
              })
            }
            pointData.push(itemData)
          }
        }
      }

      this.setData({
        pointData: pointData
      })
    })
  },
  onClickNav({ detail = {} }) {
    this.setData({
      mainActiveIndex: detail.index || 0,
    });
  },
  // 选择测点
  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;
    this.setData({ activeId: activeId });

    this.getPointData()
  },
  // 下拉打开
  dropdownOpen() {
    var that = this
    setTimeout(function () {
      that.setData({
        chartShowStatus: false
      })
    }, 100)
  },
  // 下拉关闭
  dropdownClosed() {
    var that = this

    this.setData({
      chartShowStatus: true
    })

    setTimeout(function () {
      that.setChartOption()
    }, 100)
  },
  setChartOption() {
    chart.setOption({
      xAxis: {
        type: 'category'
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        padding: [5, 10],
      },
      yAxis: {
        type: 'value'
      },
      series: this.data.chartOptionSeries
    });
  },
  onDisplay() {
    this.setData({ conditionShow: true });
  },
  onClose() {
    this.setData({ conditionShow: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  },
  formatDateParams(date) {
    date = new Date(date);

    var hours = ''
    if (date.getHours() < 10) {
      hours = '0' + date.getHours()
    }

    var minutes = ''
    if (date.getMinutes() < 10) {
      minutes = '0' + date.getMinutes()
    }

    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}` + hours + minutes;
  },
  onConfirm(event) {
    const [start, end] = event.detail;
    this.setData({
      conditionShow: false,
      conditionDate: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      beginReleaseTime: `${this.formatDateParams(start)}`,
      endReleaseTime: `${this.formatDateParams(end)}`
    });

    this.getData()
  },
  // 获取数据
  getData() {
    if (null != this.data.activeId && '' != this.data.activeId) {
      this.getPointData()
    } else if (null != this.data.selectedDevice.id || '' != this.data.selectedDevice.id) {
      this.getDeviceData()
    }
  },
  // 获取测点数据
  getPointData() {
    var that = this
    if (null != that.data.activeId) {
      // 获取测点数据
      app.request({
        method: 'post',
        url: app.config.listStructurePointData,
        data: {
          structureId: that.data.selectedStructure.id,
          pointId: that.data.activeId
        },
        contentType: "application/json;charset=UTF-8"
      }).then(res => {
        var data = [];

        for (var i = 0; i < res.data.length; i++) {
          var item = res.data[i]
          data.push([
            item.createTime,
            item.data
          ])
        }

        if (0 != data.length) {
          this.setData({
            chartOptionSeries: [{
              data: data,
              type:
                'line',
              smooth:
                true
            }]
          })
        } else {
          this.setData({
            chartOptionSeries: []
          })
        }

        this.selectComponent('#dataCondition').toggle(false)
      })
    } else {
      this.setData({
        chartOptionSeries: []
      })
    }
  },
  // 获取设备数据
  getDeviceData() {
    // 获取设备数据
    app.request({
      method: 'post',
      url: app.config.listProjectDeivceSensorData,
      data: {
        deviceId: this.data.selectedDevice.id
      },
      contentType: "application/json;charset=UTF-8"
    }).then(res => {
      // 生成图表数据
      var data = [];

      for (var i = 0; i < res.data.length; i++) {
        var item = res.data[i]
        var itemData = []

        for (var j = 0; j < item.length; j++) {
          itemData.push([
            item[j].createTime,
            item[j].data
          ])
        }
        data.push({
          data: itemData,
          type:
            'line',
          smooth:
            true
        })
      }

      this.setData({
        chartOptionSeries: data
      })

      this.selectComponent('#dataCondition').toggle(false)
    })
  },
  onOpened() {
    console.log(1)
  }
})