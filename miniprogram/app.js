import {
	asyncSetStorage,
	asyncGetStorage,
	asyncRemoveStorage,
	asyncClearStorage
} from './utils/storage'
import './utils/extendApi'
App({

	// 定义全局共享的数据
	globalData: {
		//点击收获地址时 需要将点击的收获地址赋值给address
		//在订单结算页面判断address是否存在数据
		//存在就展示全局共享的address数据
		address: {}
	},
	onShow() {
		// const accountInfo = wx.getAccountInfoSync()
		// console.log(accountInfo.miniProgram.envVersion);
	}
})