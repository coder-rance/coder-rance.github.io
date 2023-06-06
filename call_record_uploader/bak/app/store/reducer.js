const deafultsate = {
  /** 登录相关 */
  serverURL: '', // 服务器地址
  serverSec:'',//录音校验时间
  userInfo: {}, // 用户登录信息
  bindInfo: {}, // 车辆绑定信息
  loginInfo: {}, //记录登录账号,密码 便于下次自动登录
  IMEI: '', // 手机IMEI
  /** 其他配置 */
  recordPath: '', //手机通话录音路径
  /** 任务相关 */
  naviInfo: {}, // 当前导航信息  
  newTaskInfo: {}, //新任务信息
  curTaskInfo: {}, //当前任务信息
  /** 全局组件显示隐藏 */
  exitAppVisible: false, // 是否显示退出App
  loadingVisible: false, // 是否显示loading
  naviVisible: false, // 是否显示地图导航
  callPhoneVisible: false, //是否显示拨打电话
  curTaskInfoVisible: false, // 当前任务信息
  newTaskTipsVisible: false, // 新任务提示
  newTaskInfoVisible: false, // 新任务信息
  bindingTipsVisible: false, //绑定车辆
  uploadRecordVisible: false, //上传录音
  flag:false,//自动登录标记标记
}

export default (state = deafultsate, action) => {
  switch (action.type) {
    /** 登录相关 */
    case 'setServerURL':
      return {
        ...state,
        serverURL: action.data
      }; 
    case 'setServerSec':
      return {
        ...state,
        serverSec: action.data
      };
    case 'setUserInfo':
      return {
        ...state,
        userInfo: action.data
      };
    case 'setBindInfo':
      return {
        ...state,
        bindInfo: action.data
      };
    case 'setLoginInfo':
      return {
        ...state,
        loginInfo: action.data
      };
    case 'setIMEI':
      return {
        ...state,
        IMEI: action.data
      };
    /** 其他配置 */
    case 'setRecordPath':
      return {
        ...state,
        recordPath: action.data
      };
    /** 任务相关 */
    case 'setNaviInfo':
      return {
        ...state,
        naviInfo: action.data
      };
    case 'setNewTaskInfo':
      return {
        ...state,
        newTaskInfo: action.data
      };
    case 'setCurTaskInfo':
      return {
        ...state,
        curTaskInfo: action.data
      };
  
    /** 全局组件显示隐藏 */
    case 'setExitAppVisible':
      return {
        ...state,
        exitAppVisible: action.data
      };
    case 'setLoadingVisible':
      return {
        ...state,
        loadingVisible: action.data
      };
    case 'setNaviVisible':
      return {
        ...state,
        naviVisible: action.data
      };
    case 'setCallPhoneVisible':
      return {
        ...state,
        callPhoneVisible: action.data
      };
    case 'setCurTaskInfoVisible':
      return {
        ...state,
        curTaskInfoVisible: action.data
      };
    case 'setNewTaskTipsVisible':
      return {
        ...state,
        newTaskTipsVisible: action.data
      };
    case 'setNewTaskInfoVisible':
      return {
        ...state,
        newTaskInfoVisible: action.data
      };
    case 'setBindingTipsVisible':
      return {
        ...state,
        bindingTipsVisible: action.data
      };
    case 'setUploadRecordVisible':
      return {
        ...state,
        uploadRecordVisible: action.data
      };
    case 'setFlag':
      return {
        ...state,
        flag: action.data
      };
    default:
      return state;
  }
}