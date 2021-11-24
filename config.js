// const host = 'http://localhost:8080'
const host = 'http://192.168.1.58:8080'

const config = {
  loginUrl: host + "/api/miniprogram/login",
  getInfoUrl: host + "/getInfo",
  projectDataListUrl: host + "/api/miniprogram/projectDataList",
  projectStructureListUrl: host + "/api/miniprogram/projectStructureList",
  deviceListUrl: host + "/api/miniprogram/deviceList",
  projectPointListUrl: host + "/api/miniprogram/projectPointList",
  userDataUrl: host + "/api/miniprogram/userData",
  updatePwdUrl: host + "/system/user/profile/updatePwd",
  listProjectDeivceSensorData: host + "/iot/projectDeivceSensorData/list",
  listStructurePointData: host + "/iot/structurePointData/list"
}

module.exports = config
