import {
	reqIndexData
} from '../../api/index'
Page({

	data: {
		bannerList: [], //轮播图数据
		categoryList: [], //商品导航数据
		activeList: [], //活动渲染数据
		hotLisy: [], //人气推荐
		guessList: [], //猜你喜欢
		loading:true //是否显示骨架屏
	},
	//获取首页数据
	async getIndexData() {
		const res = await reqIndexData()
		// console.log(res);
		this.setData({
			bannerList: res[0].data,
			categoryList: res[1].data,
			activeList: res[2].data,
			guessList: res[3].data,
			hotLisy: res[4].data,
			loading:false
		})
	},
	//监听页面加载
	onLoad() {
		this.getIndexData()
	},
	// 转发功能
onShareAppMessage() {},

// 转发到朋友圈功能
onShareTimeline() {}
})