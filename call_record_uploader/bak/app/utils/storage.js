import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 保存数据到指定storage
 * @param {string} key 键
 * @param {object} value 值
 * @returns 
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);

    return true;
  } catch (err) {
    console.log('保存到本地失败：',key,valuse,err);
    return false;
  }
};

/**
 * 获取指定storage值
 * @param {string} key 键
 * @returns 
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log('获取本地数据失败：',err);
    return null;
  }
};

/**
 * 移除某个storage
 * @param {string} key 键
 * @returns 
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (err) {
    console.log('移除本地数据失败',err);
    return false;
  }
}

/**
 * 初始化指定storage
 * @param {string} key 键
 * @returns 
 */
export const initStorageList = async (key) => {
  let value = await getData(key);
  let temp = null;

  // 如果之前没有这个值，就创建
  if (value == null) {
    await storeData(key, []);
    temp = [];
  } else {
    if (!Array.isArray(value)) {
      throw new Error('key对应的value不是数组');
    }

    temp = value;
  }

  return temp;
};

/**
 * 插入到指定storage（数组）
 * @param {string} key 
 * @param {Object} value 
 * @returns 
 */
export const insertStorageList = async (key, value) => {
  try {
    const temp = await initStorageList(key);
  
    temp.push(value);
    const isOK = await storeData(key, temp);
    return isOK;
  } catch (err) {
    console.log('插入到本地存储失败',err);
    return false;
  }
};

/**
 * 迭代指定的storage
 * @param {string} key 键
 * @param {Function} callback 要迭代的回调
 */
export const eachStorageList = async (key, callback) => {
  const temp = await initStorageList(key);

  for (let i = 0; i < temp.length; i++) {
    const item = temp[i];

    try {
      const result = await callback(item);

      if (result) {
        temp.splice(i, 1);
        i--;
        console.log(`${JSON.stringify(item)} 删除完毕`);
        await storeData(key, temp);
      }
    } catch (err) {
      console.log(err);
    }
  }
};