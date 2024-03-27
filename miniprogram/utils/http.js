import WXRequest from 'mina-request'
import {env} from './env'
import {
	getStorage,
	clearStorage
} from '../utils/storage'
import {
	toast,
	modal
} from './extendApi'
const instance = new WXRequest({
	baseURL: env.baseUrl, // 请求基准地址
	timeout: 15000 // 微信小程序 timeout 默认值为 60000
	// isLoading:false
})

//配置请求拦截器
instance.interceptors.request = (config) => {
	//请求之前判断是否存在token
	const token = getStorage("token")
	//如果有token在请求头添加token字段
	if (token) {
		config.header["token"] = token
	}
	return config
}
//配置响应拦截器
instance.interceptors.response = async(response) => {
	const {
		data,
		isSuccess
	} = response
	//false走的fail回调函数
	if (!isSuccess) {
		wx.showToast({
			title: '网络异常请重试',
			icon: "error"
		})

		return response
	}
//判断状态码
	switch (data.code) {
		//200说明请求成功响应数据
		case 200:
			//响应之后做点什么
			return data
			//208说明token过期或者token失效
		case 208:
			const res=await modal({
				content: "鉴权失败，请重新登录",
				showCancel: false //不显示取消按钮
			})
			if(res){
				//清空失效的token，同时清空所有缓存数据
				clearStorage()
				wx.navigateTo({
					url: '/pages/login/login',
				})
			}
			return Promise.reject(response)
		default:
			toast({
				title:"程序出现异常，请稍后重试"
			})
			return Promise.reject(response)
	}

}
export default instance