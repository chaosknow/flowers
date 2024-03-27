//通过类的方式封装，让代码更加具有复用性
//也方便添加新的属性和方法
class WXRequest {
	// 默认参数对象
	defaults = {
		baseURL: '', // 请求基准地址
		url: '', // 开发者服务器接口地址
		data: null, // 请求参数
		method: 'GET', // 默认请求方法
		// 请求头
		header: {
			'Content-type': 'application/json' // 设置数据的交互格式
		},
		timeout: 60000, // 小程序默认超时时间是 60000，一分钟
		isLoading: true //是否使用默认的loading
		// 其他参数...
	}

	//定义拦截器对象
	//需要包含请求拦截器以及响应拦截器，方便在请求之前以及响应之后做逻辑处理
	interceptors = {
		//请求拦截器
		//在发送之前对请求参数进行新增或修改
		request: (config) => config,
		//响应拦截器
		//在服务器响应数据之后，对服务器的数据进行逻辑处理
		response: (response) => response
	}

	constructor(params = {}) {
		// 使用 Object.assign 合并默认参数以及传递的请求参数
		this.defaults = Object.assign({}, this.defaults, params)
	}
	//定义数组队列
	//初始值是一个空数组，用来存储请求队列、存储请求标识
	queue = []

	//request实例接收一个对象类型的参数
	//属性值和wx.request的属性值保持一致
	request(options) {
		this.timerId && clearTimeout(this.timerId)
		// 拼接完整的请求地址
		options.url = this.defaults.baseURL + options.url
		// 合并请求参数
		options = {
			...this.defaults,
			...options
		}
		if (options.isLoading && options.method !== 'UPLOAD') {
			console.log(options.isLoading);
			//判断queue是否为空，如果是空就显示loading
			this.queue.length === 0 && wx.showLoading({
				title: '数据加载中...',
			})
			//然后立即向queue添加请求标识,每个标识代表一个请求
			this.queue.push("request")
		}
		//请求发送之前，调用请求拦截器，新增或修改参数
		options = this.interceptors.request(options)
		//需要promise封装wx.request，处理异步请求
		return new Promise((resolve, reject) => {
			if (options.method === 'UPLOAD') {
				wx.uploadFile({
					...options,
					success: (res) => {
						//将服务器返回的json字符串转成对象
						res.data = JSON.parse(res.data)
						//合并参数
						const mergeRes = Object.assign({}, res, {
							config: options,
							isSuccess: true
						})
						resolve(this.interceptors.response(mergeRes))
					},
					fail: (err) => {
						//合并参数
						const mergeErr = Object.assign({}, err, {
							config: options,
							isSuccess: true
						})
						reject(this.interceptors.response(mergeErr))
					}
				})
			} else {
				wx.request({
					...options,
					//接口调用成功时触发succes函数
					success: (res) => {
						//不管成功还是失败都要调用响应拦截器
						//响应拦截器接受服务器响应的数据，对数据进行逻辑处理，处理后返回
						//再通过resolve将返回的数据抛出去
						//再给响应器传递参数时，需要将请求参数一起传递
						//方便进行代码调式或其他逻辑处理，需要先合并参数
						//合并参数时追加一个isSuccess,值true说明执行success回调函数，false执行fail回调函数
						const mergeRes = Object.assign({}, res, {
							config: options,
							isSuccess: true
						})
						resolve(this.interceptors.response(mergeRes))
					},
					//接口调用失败时触发fail函数
					fail: (err) => {
						const mergeErr = Object.assign({}, err, {
							config: options,
							isSuccess: false
						})
						reject(this.interceptors.response(mergeErr))
					},
					complete: () => {
						if (options.isLoading) {
							//每次都会走complete，就pop出一个请求标识
							this.queue.pop()
							//判断queue是否为空，为空就隐藏loading
							this.queue.length === 0 && this.queue.push("request")
							this.timerId = setTimeout(() => {
								this.queue.pop()
								this.queue.length === 0 && wx.hideLoading()
								clearTimeout(this.timerId)
							}, 1)
						}
					}
				})
			}
		})
	}

	//封装GET实例方法
	get(url, data = {}, config = {}) {
		//需要调用request请求方法发送请求，只需要组织好参数，传递给request请求方法即可
		//把request方法的返回值return出去
		return this.request(Object.assign({
				url,
				data,
				method: "GET"
			},
			config
		))
	}
	//封装POST实例方法
	post(url, data = {}, config = {}) {
		//需要调用request请求方法发送请求，只需要组织好参数，传递给request请求方法即可
		return this.request(Object.assign({
				url,
				data,
				method: "POST"
			},
			config
		))
	}
	//封装DELETE实例方法
	delete(url, data = {}, config = {}) {
		//需要调用request请求方法发送请求，只需要组织好参数，传递给request请求方法即可
		return this.request(Object.assign({
				url,
				data,
				method: "DELETE"
			},
			config
		))
	}
	//封装PUT实例方法
	put(url, data = {}, config = {}) {
		//需要调用request请求方法发送请求，只需要组织好参数，传递给request请求方法即可
		return this.request(Object.assign({
				url,
				data,
				method: "PUT"
			},
			config
		))
	}

	//用来处理并发请求
	all(...promise) {
		//通过展开运算符接收传递的参数
		//展开运算符会将传入的参数转成数组
		return Promise.all(promise)
	}
/**
 * @description upload实例方法，用来对wx.uploadFile 进行封装
 * @param {*} url 文件上传的地址、接口路径
 * @param {*} filePath 要上传文件的资源路径
 * @param {*} name 文件对应的key
 * @param {*} config 其他配置
 */
	upload(url, filePath, name = 'file', config = {}) {
		return this.request(Object.assign({
			url,
			filePath,
			name,
			method: 'UPLOAD'
		}, config))
	}
}
export default WXRequest