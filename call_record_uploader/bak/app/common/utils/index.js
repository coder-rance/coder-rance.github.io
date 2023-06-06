import { getBrand, getVersion } from 'react-native-device-info';
import CallRecord from 'react-native-call-record';
import dayjs from 'dayjs';
import RNFS from 'react-native-fs';
import { saveCallRecord } from '@app/api/record';
import { writeInfoLog } from '@app/api/logger';
import { getData, storeData } from '@app/utils/storage';

/**
 * 写入日志到node日志系统中
 * @param {*} log 日志内容
 * @returns 
 */
export const writeLogger = async (log) => {
  try {
    console.log('log',log);
    const { result } = await writeInfoLog({ log });
       console.log('写入文件',result);
    if (result == 1) {
      return {
        isOK: true,
        errMsg: '日志写入成功',
      };
    } else {
      return {
        isOK: false,
        errMsg: '日志写入失败',
      }
    }
  } catch (err) {
    return {
      isOK: false,
      errMsg: '日志写入失败' + err,
    }
  }
}

/**
 * @param {*} url  serverURL + '/record/uploadRecord'
 * @param {*} path  file://storage/emulated/0/Record/Call/16621092548 2022-07-12 16-40-50.m4a
 */
const upload = async (url, path) => {
  let formData = new FormData();
  console.log('formData',formData);
  formData.append('file', {
    uri: 'file://' + path,
    name: path,
    type: "multipart/form-data",
  });
  console.log('formData',formData);
  return fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 15000 // 15s超时
  }).then(res =>res.json()).then(data => data).catch(err=>console.log('upload_err',err));
}


//删除本地录音
/**
 * 
 * @param {*} filepath 要删除的文件在手机中的路径
 */
export const deleteCallRecording = async (filepath) => {
  try {
    const res = await RNFS.unlink(filepath);

    return {
      isOK: true,
      errMsg: `删除本地录音文件成功,文件路径: ${filepath}`
    };
  } catch (err) {
    return {
      isOK: false,
      errMsg: `删除本地录音文件失败,文件路径: ${filepath} ${err}`
    };
  }
}

// 获取最新一条通话信息
export const getLatestCallInfo = async (RECALL_TIME, HANGUP_TIME) => {
  try {
    const list = await CallRecord.getAll({ limit: 1 });
    console.log('最新一条通话信息:',list);
    const { duration, phoneNumber, type} = list[0];
    const START_TIME = dayjs(HANGUP_TIME).subtract(duration, 'second').format('YYYY-MM-DD HH:mm:ss');

    return {
      isOK: true,
      errMsg: '获取最新一条通话信息成功',
      // 通话开始时间
      START_TIME,
      // 持续时长
      DURATION: duration,
      // 是否打通
      IS_ANSWERED: duration != 0 ? 1 : 0,
      //拨打类型
      type
    };
  } catch (err) {
    const START_TIME = dayjs(HANGUP_TIME).subtract(0, 'second').format('YYYY-MM-DD HH:mm:ss');
    return {
      isOK: false,
      errMsg: '获取最新一条通话信息失败' + err,
      // 通话开始时间
      START_TIME,
      // 持续时长
      DURATION: 0,
      // 是否打通
      IS_ANSWERED: 0
    };
  }
}

//查询最新一条通话录音
export const getLatestCallRecording = async (recordPath) => {
  try {
    let allFiles = await RNFS.readDir(recordPath);
      console.log('所有的录音文件allFiles',allFiles);
    allFiles.sort((a, b) => {
      const mtimeA = new Date(a.mtime);
      const mtimeB = new Date(b.mtime);
      return mtimeB - mtimeA;
    });

    const recordFile = allFiles[0];

    if (!recordFile) {
      return {
        isOK: false,
        errMsg: '未找到最新一条通话录音',
        LENGTH:allFiles.length
      };
    }

    return {
      isOK: true,
      errMsg: '找到最新一条通话录音',
      FULLNAME: recordFile.path,
      MTIME: recordFile.mtime,
      LENGTH:allFiles.length
    };
  } catch (err) {
    return {
      isOK: false,
      errMsg: '未找到最新一条通话录音:' + err,
      LENGTH:allFiles.length
    };
  }
}

// 上传通话录音
/**
 * 
 * @param {*} url 上传地址 serverURL + '/record/uploadRecord'
 * @param {*} FULLNAME  录音路径 file://storage/emulated/0/Record/Call/16621092548 2022-07-12 16-40-50.m4a
 * @returns 
 */
export const uploadCallRecording = async (url, FULLNAME) => {
  console.log('url',url,'FULLNAME',FULLNAME);
  try {
    const res = await upload(url, FULLNAME);
    const { data: { isSucceed, resultData } } = res;
    console.log('----res-----',res);
    if (isSucceed) {
      const {
        NewName: FILENAME,
        CreateDate: FILE_CREATE_TIME,
        Path: URL,
      } = resultData[0];

      return {
        isOK: true,
        errMsg: '录音文件上传成功',
        FILE_CREATE_TIME,
        FILENAME,
        URL,
      };
    } else {
      return {
        isOK: false,
        errMsg: '录音文件上传失败'
      };
    }
  } catch (err) {
    console.log('----err---',err);
    return {
      isOK: false,
      errMsg: '录音文件上传失败：' + err,
    };
  }
}

/**
 * 上传通话信息
 * 如果LSH ,CCXH, START_TIME 已经在数据库中存在，那么本次就是修改
 * 不存在，就是新增一条通话记录
 * 
 * @param {*} callInfo 
 * @returns 
 */
export const uploadCallInfo = async (callInfo) => {
  try {
    const {
      FULLNAME,
      FILENAME,
      URL,
      MEMBER_ID,
      CZDH,
      ZJHM,
      BJHM,
      XZBM,
      FILE_CREATE_TIME,
      IMEI,
      DURATION,
      LSH,
      CCXH,
      TASK_TIME,
      CALL_TIME,
      RECALL_TIME,
      START_TIME,
      HANGUP_TIME,
      IS_ANSWERED,
      REMARK,
    } = callInfo;

    const { data: { text } } = await saveCallRecord({
      FULLNAME, //app中的录音位置 (自己填写)
      FILENAME, //录音文件名称 （上传录音成功后自动生成）
      URL, //上传到的位置（上传录音成功后自动生成）
      MEMBER_ID, //用户账号
      CZDH, //车载电话
      ZJHM, //主叫电话
      BJHM,//被叫电话
      XZBM, //行政编码
      FILE_CREATE_TIME, //文件创建时间（上传录音成功后自动生成）
      IMEI, //手机IMEI
      DURATION, //通话录音时长
      LSH, //任务流水号
      CCXH, //任务出车序号
      TASK_TIME, //收到任务时间
      CALL_TIME, //拨号时间
      RECALL_TIME,//拨号时间
      START_TIME, //通话开始时间
      HANGUP_TIME, //挂机时间
      IS_ANSWERED, //是否接听 0否   1是
      REMARK, //备注
      VERSION: getVersion(), // app版本
      DATA_SOURCE: 1,  //数据来源： 1外勤通
      UPLOAD_STATE: 1, //是否上传成功  0否   1是
      LAST_MODIFY_TIME: dayjs().format('YYYY-MM-DD HH:mm:ss'), //上次修改时间
    });

    let res = JSON.parse(text);

    if (res.Success) {
      return {
        isOK: true,
        errMsg: '通话信息上传成功',
      };
    } else {
      return {
        isOK: false,
        errMsg: '通话信息上传失败',
      };
    }
  } catch (err) {
    return {
      isOK: false,
      errMsg: '通话信息上传失败:' + err,
    }
  }
}


// 添加到本地缓存数组
export const insertLocalStorage = async (key, value) => {
  let list = await getData(key);

  if (list == null) {
    let arr = [];
    arr.push(value);
    return await storeData(key, arr);
  }

  list.push(value);
  return await storeData(key, list);
};


// 处理本地缓存数组
export const resolveLocalStorage = async (key, fn) => {
  let list = await getData(key);

  if (list == null) {
    return await storeData(key, []);
  }

  for (let i = 0; i < list.length; i++) {
    const item = list[i];

    try {
      const result = await fn(item);

      if (result) {
        list.splice(i, 1);
        i--;
        console.log(`${JSON.stringify(item)} 删除完毕`);
        await storeData(key, list);
      }
    } catch (err) {
      console.log(err);
    }
  }
};