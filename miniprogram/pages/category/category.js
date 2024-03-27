import {
	reqCategoryData
} from '../../api/category'
Page({
	data: {
		categoryList: [], //商品分类列表
		activeIndex:0 //侧边栏被激活的样式，默认为0
	},
	//获取商品分类列表数据
	async getCategoryData() {
		const res = await reqCategoryData()
		if (res.code === 200) {
			this.setData({
				categoryList: res.data
			})
		}
	},
	//点击侧边栏修改样式
	updateActive(event){
		const {index} =event.currentTarget.dataset
		this.setData({
			activeIndex:index
		})
	},
	onLoad() {
		this.getCategoryData()
	}
})