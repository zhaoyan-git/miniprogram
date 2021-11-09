// const host = 'https://shidaiheima.ltd'
const host = 'http://localhost:8080'

const config = {
  loginUrl: host + "/api/miniprogram/login",
  getInfoUrl: host + "/getInfo",
  projectDataListUrl: host + "/api/miniprogram/projectDataList",
  projectStructureListUrl: host + "/api/miniprogram/projectStructureList",
  deviceListUrl: host + "/api/miniprogram/deviceList",
  projectPointListUrl: host + "/api/miniprogram/projectPointList",
  userDataUrl: host + "/api/miniprogram/userData",
  updatePwdUrl: host + "/system/user/profile/updatePwd"
}

module.exports = config
