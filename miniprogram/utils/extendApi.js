/**
 * @description 消息提示框
 * @param {Object} options 参数和wx.showToast参数保持一致
 */
const toast = ({
	//在使用toast可以传入参数，也可以不传用默认值
	//如果要传入参数需要传入对象作为参数
	title = "数据加载中...",
	icon = "none",
	duration = 2000,
	mask = true
} = {}) => {
	wx.showToast({
		title,
		icon,
		duration,
		mask
	})
}

/**
 * @description 模态对话框
 * @param {Object} options 参数与wx.showModal的参数保持一致
 */
const modal = (options = {}) => {
	//modal可以传入参数，用对象的形式传入
	//参数的属性名要与wx.showModal的一致
	// 使用 Promise 处理 wx.showModal 的返回结果
	return new Promise((resolve) => {
		// 默认的参数
		const defaultOpt = {
			title: '提示',
			content: '您确定执行该操作吗?',
			confirmColor: '#f3514f',
		}
		// 将传入的参数和默认的参数进行合并
		const opts = Object.assign({}, defaultOpt, options)
		wx.showModal({
			...opts,
			complete({
				confirm,
				cancel
			}) {
				// 如果用户点击了确定，通过 resolve 抛出 true
				// 如果用户点击了取消，通过 resolve 抛出 false
				confirm && resolve(true)
				cancel && resolve(false)
			}
		})
	})
}

//挂载到wx全局对象身上
//需要先在app.js把当前文件导入执行一次
wx.toast = toast
wx.modal = modal
export {
	toast,
	modal
}