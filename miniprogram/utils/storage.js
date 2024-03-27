/**
 * @description 数据存储
 * @param {*} key 本地存储中指定的key
 * @param {*} data 需要存储的数据
 */
const setStorage = (key, data) => {
	try {
		wx.setStorageSync(key, data)
	} catch (error) {
		console.log(`存储${key}数据发生异常`, error);
	}
}
/**
 * @description 从本地读取指定key的数据
 * @param {*} key 
 */
const getStorage = (key) => {
	try {
		const value = wx.getStorageSync(key)
		if (value) {
			return value
		}
	} catch (error) {
		console.log(`读取${key}数据发生异常`, error);
	}
}
/**
 * @description 移除指定key的数据
 * @param {*} key 
 */
const removeStorage = (key) => {
	try {
		wx.removeStorageSync(key)
	} catch (error) {
		console.log(`移除${key}数据发生异常`, error);
	}
}
/**
 * @description 清空缓存数据
 */
const clearStorage = () => {
	try {
		wx.clearStorageSync()
	} catch (error) {
		console.log(`清空数据发生异常`, error);
	}
}

/**
 * @description 异步将数据存储到本地
 * @param {*} key 本地缓存指定的key
 * @param {*} data 需要缓存的数据
 */
const asyncSetStorage = (key, data) => {
	return new Promise((resolve) => {
		wx.setStorage({
			key,
			data,
			complete(res) {
				resolve(res)
			}
		})
	})
}
/**
 * @description 异步获取指定key的数据
 * @param {*} key 
 */
const asyncGetStorage = (key) => {
	return new Promise((resolve) => {
		wx.getStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}
/**
 * @description 异步移除指定key的数据
 * @param {*} key 
 */
const asyncRemoveStorage = (key) => {
	return new Promise((resolve) => {
		wx.removeStorage({
			key,
			complete(res) {
				resolve(res)
			}
		})
	})
}

/**
 * @description 异步清空所有的数据
 */
const asyncClearStorage = () => {
	return new Promise((resolve) => {
		wx.clearStorage({
			complete(res) {
				resolve(res)
			}
		})
	})
}
export {
	getStorage,
	setStorage,
	removeStorage,
	clearStorage,
	asyncSetStorage,
	asyncGetStorage,
	asyncRemoveStorage,
	asyncClearStorage
}