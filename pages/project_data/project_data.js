// pages/project_data/project_data.js
import * as echarts from '../../ec-canvas/echarts';
import { parseTime } from '../../utils/util'
// 获取应用实例
const app = getApp()

// let chart = null;

function initChart(canvas, width, height, dpr, uData) {
  var chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  console.log(uData)

  chart.setOption({
    title: {
      text: uData.titleText
    },
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
      name: uData.yAxisName,
      type: 'value'
    },
    series: uData.series
  });


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
    activeId: [],
    pointData: [],
    chartShowStatus: true,
    chartOption: [],
    conditionDate: '',
    beginReleaseTime: '',
    endReleaseTime: '',
    conditionShow: false,
    conditionDateMinDate: new Date(2020, 10, 1).getTime(),
    alarmColor: [
      '#ffffff',
      '#ff0000',
      '#ffad00',
      '#fff700'
    ],
    gatherTypeOptions: [
      { text: '实时数据', value: 1 },
      { text: '聚集数据', value: 2 }
    ],
    gatherType: 1,
    chartList: [],
    dataLoading: false
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

    let start = new Date(new Date().getTime() - 1000 * 60 * 60 * 24)
    let end = new Date()

    this.setData({
      conditionDate: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      beginReleaseTime: `${this.formatDateParams(start)}`,
      endReleaseTime: `${this.formatDateParams(end)}`
    });
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
      itemTitle2: event.currentTarget.dataset.name,
      selectedDevice: event.currentTarget.dataset,
      activeId: []
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
    const { activeId } = this.data;

    const index = activeId.indexOf(detail.id);
    if (index > -1) {
      activeId.splice(index, 1);
    } else {
      activeId.push(detail.id);
    }

    this.setData({ activeId });

    this.setData({
      itemTitle2: '请选择测点/设备',
      selectedDevice: {
        id: '',
        name: ''
      }
    });

    // this.setData({ itemTitle2: detail.text })

    // const activeId = this.data.activeId === detail.id ? null : detail.id;
    // this.setData({ activeId: activeId });

    // this.getPointData()
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

    // this.setData({
    //   chartShowStatus: true
    // })

    this.getData()

    setTimeout(function () {
      that.setChartOption()
      that.setData({
        chartShowStatus: true
      });
    }, 100)
  },
  onDisplay() {
    var that = this
    setTimeout(function () {
      that.setData({
        chartShowStatus: false,
        conditionShow: true
      })
    }, 100)
  },
  onClose() {
    var that = this
    this.setData({
      conditionShow: false
    });
    setTimeout(function () {
      that.setChartOption()
      that.setData({
        chartShowStatus: true
      });
    }, 100)
  },
  setChartOption() {
    this.setData({
      chartList: this.data.chartOption
    })
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
    var that = this
    const [start, end] = event.detail;
    this.setData({
      conditionShow: false,
      conditionDate: `${this.formatDate(start)} - ${this.formatDate(end)}`,
      beginReleaseTime: `${parseTime(start, '{y}-{m}-{d} {h}:{i}')}`,
      endReleaseTime: `${parseTime(end, '{y}-{m}-{d} {h}:{i}')}`
    });

    this.getData()

    setTimeout(function () {
      that.setChartOption()
      that.setData({
        chartShowStatus: true
      });
    }, 100)
  },
  // 获取数据
  getData() {
    if (null != this.data.activeId && '' != this.data.activeId) {
      console.log(1)
      this.getPointData()
    } else if (null != this.data.selectedDevice.id && '' != this.data.selectedDevice.id) {
      this.getDeviceData()
    }
  },
  // 获取测点数据
  getPointData() {
    var that = this
    if (null != that.data.activeId && 0 < that.data.activeId.length) {
      that.setData({
        dataLoading: true
      });

      // 累计沉降数据
      var data = {
        titleText: '累计沉降值',
        yAxisName: '单位：mm',
        series: []
      };
      // 与上次数据差值
      var data2 = {
        titleText: '与上次数据差值',
        yAxisName: '单位：mm',
        series: []
      };

      this.setData({
        chartOption: []
      })

      this.data.chartOption.push(data)
      this.data.chartOption.push(data2)

      for (var x = 0; x < that.data.activeId.length; x++) {
        let pointId = that.data.activeId[x]
        // 获取测点数据
        app.request({
          method: 'post',
          url: app.config.listStructurePointData,
          data: {
            structureId: that.data.selectedStructure.id,
            pointId: that.data.activeId[x],
            gatherType: that.data.gatherType,
            params: {
              beginReleaseTime: that.data.beginReleaseTime,
              endReleaseTime: that.data.endReleaseTime,
            }
          },
          contentType: "application/json;charset=UTF-8"
        }).then(res => {
          var dataItem = []
          var data2Item = []

          for (var i = 0; i < res.data.length; i++) {
            // 累计沉降数据
            var item = res.data[i]
            dataItem.push([
              parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}'),
              item.data
            ])

            // 与上次数据差值
            if (i != 0) {
              data2Item.push([
                parseTime(item.createTime, '{y}-{m}-{d} {h}:{i}:{s}'),
                (item.data - res.data[i - 1].data).toFixed(2)
              ])
            }
          }


          // if (0 != dataItem.length) {
          this.data.chartOption[0].series.push({
            name: pointId + '1',
            data: dataItem,
            type:
              'line',
            smooth:
              true
          })
          // }

          // if (0 != data2Item.length) {
          this.data.chartOption[1].series.push({
            name: pointId + '2',
            data: data2Item,
            type:
              'line',
            smooth:
              true
          })
          // }
          // this.selectComponent('#dataCondition').toggle(false)

          // 数据加载完毕
          if (that.data.activeId.length == this.data.chartOption[0].series.length) {
            let dataFlag = true
            let data2Flag = true

            for (var z = 0; z < that.data.activeId.length; z++) {
              if (0 < this.data.chartOption[0].series[z].data.length) {
                dataFlag = false
              }
              if (0 < this.data.chartOption[1].series[z].data.length) {
                data2Flag = false
              }
            }

            if (data2Flag) {
              // 无数据
              this.data.chartOption.splice(1)
            }
            if (dataFlag) {
              // 无数据
              this.data.chartOption.splice(0)
            }

            setTimeout(function () {
              that.setChartOption()
              that.setData({
                dataLoading: false
              });
            }, 100)
          }

        })

      }

    } else {
      this.setData({
        chartOption: []
      })
    }
  },
  // 获取设备数据
  getDeviceData() {
    var that = this
    that.setData({
      dataLoading: true
    });

    // 获取设备数据
    app.request({
      method: 'post',
      url: app.config.listProjectDeivceSensorData,
      data: {
        deviceId: this.data.selectedDevice.id,
        params: {
          beginTime: that.data.beginReleaseTime,
          endTime: that.data.endReleaseTime,
        }
      },
      contentType: "application/json;charset=UTF-8"
    }).then(res => {
      // 生成图表数据
      var data = [];

      this.setData({
        chartOption: []
      })

      for (var i = 0; i < res.data.length; i++) {
        var item = res.data[i]
        var itemData = []
        console.log(item)

        for (var j = 0; j < item.dataList.length; j++) {
          itemData.push([
            parseTime(item.dataList[j].createTime, '{y}-{m}-{d} {h}:{i}:{s}'),
            item.dataList[j].data
          ])
        }

        this.data.chartOption.push({
          titleText: item.name,
          yAxisName: '单位：' + item.unit,
          series: [{
            data: itemData,
            type:
              'line',
            smooth:
              true
          }]
        })
      }

      setTimeout(function () {
        that.setChartOption()
        that.setData({
          dataLoading: false
        });
      }, 100)
    })
    this.selectComponent('#dataCondition').toggle(false)

  },
  gatherTypeDropdown(e) {
    this.setData({
      gatherType: e.detail
    })
    this.getData()
  }
})