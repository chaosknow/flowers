import {
	reqLogin,
	reqUserInfo
} from '../../api/user'
import {
	toast
} from '../../utils/extendApi'
import {
	setStorage
} from '../../utils/storage'
import {
	userStore
} from '../../stores/userStore'
import {
	ComponentWithStore
} from 'mobx-miniprogram-bindings'
//导入防抖函数
import { debounce } from 'miniprogram-licia'
ComponentWithStore({
	//让页面和store建立关联
	storeBindings: {
		store: userStore,
		fields: ['token', 'userInfo'],
		actions: ['setToken', 'setUserInfo']
	},
	methods: {
		//授权登录
		login:debounce(function() {
			//获取临时code
			wx.login({
				success: async ({
					code
				}) => {
					if (code) {
						//获取登录信息
						const res = await reqLogin(code)
						//存储本地
						setStorage('token', res.data.token)
						//存储到store里
						this.setToken(res.data.token)
						//获取用户信息
						this.getUserInfo()
						//返回上一级页面
						wx.navigateBack()
					} else {
						toast({
							title: "授权失败，请重新登录"
						})
					}
				},
			})
		},500),
		async getUserInfo() {
			//获取用户信息
			const {
				data
			} = await reqUserInfo()
			//存储到本地
			setStorage("userInfo", data)
			//存储到store里
			this.setUserInfo(data)
		}
	}

})