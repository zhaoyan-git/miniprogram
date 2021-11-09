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

  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      },
      confine: true
    },
    legend: {
      data: ['热度', '正面', '负面']
    },
    grid: {
      left: 20,
      right: 20,
      bottom: 15,
      top: 40,
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: { show: false },
        data: ['汽车之家', '今日头条', '百度贴吧', '一点资讯', '微信', '微博', '知乎'],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    series: [
      {
        name: '热度',
        type: 'bar',
        label: {
          normal: {
            show: true,
            position: 'inside'
          }
        },
        data: [300, 270, 340, 344, 300, 320, 310],
        itemStyle: {
          // emphasis: {
          //   color: '#37a2da'
          // }
        }
      },
      {
        name: '正面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true
          }
        },
        data: [120, 102, 141, 174, 190, 250, 220],
        itemStyle: {
          // emphasis: {
          //   color: '#32c5e9'
          // }
        }
      },
      {
        name: '负面',
        type: 'bar',
        stack: '总量',
        label: {
          normal: {
            show: true,
            position: 'left'
          }
        },
        data: [-20, -32, -21, -34, -90, -130, -110],
        itemStyle: {
          // emphasis: {
          //   color: '#67e0e3'
          // }
        }
      }
    ]
  };

  chart.setOption(option);
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
    chartShowStatus: true
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
  onChangeDevice(event) {
    this.setData({
      selectedDevice: event.currentTarget.dataset,
    });
  },
  // 选择设备事件
  onClickDevice(event) {
    this.setData({
      selectedDevice: event.currentTarget.dataset,
    });
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
  onClickItem({ detail = {} }) {
    const activeId = this.data.activeId === detail.id ? null : detail.id;

    this.setData({ activeId });
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
    this.setData({
      chartShowStatus: true
    })

  }

})