// pages/goods/list/index.js
import {
  reqGoodsList
} from '../../../api/goods'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    isFinish: false, // 判断数据是否加载完毕
    total: 0, //商品总数
    isLoading: false, //判断数据是否加载完毕
    requestData: {
      page: 1, //页码
      limit: 10, //每页请求条数
      category1Id: '', //一级分类 id
      category2Id: '' //二级分类 id
    }
  },
  async getGoodsList() {
    //在发送请求之前把isLoading设置为true
    this.data.isLoading = true
    const {
      data
    } = await reqGoodsList(this.data.requestData)
    //在发送请求之前把isLoading设置为false
    this.data.isLoading = false
    this.setData({
      total: data.total,
      goodsList: [...this.data.goodsList, ...data.records]
    })
  },
  //监听到页面上拉操作
  onReachBottom() {
    const {
      goodsList,
      total,
      isLoading
    } = this.data
    const {
      page
    } = this.data.requestData
    //判断请求是否发送完毕 isLoading为true就是还没发送完毕 节流作用
    if (isLoading) return
    //判断还是否继续请求获取数据
    if (goodsList.length === total) {
      this.setData({
        isFinish: true
      })
      return
    }
    //页码+1
    this.setData({
      requestData: {
        ...this.data.requestData,
        page: page + 1
      }
    })
    //重新获取数据
    this.getGoodsList()
  },
  //监听页面下拉刷新
  onPullDownRefresh() {
    //将数据进行重置
    this.setData({
      goodsList: [],
      isFinish: false,
      total: 0,
      requestData: {
        ...this.data.requestData,
        page: 1
      }
    })
    //用重置的数据发送请求数据
    this.getGoodsList()
    //关闭下拉刷新效果
    wx.stopPullDownRefresh()
  },
  onLoad(options) {
    //Object.assign用来合并对象，后面对象的属性会往前面的进行合并
    Object.assign(this.data.requestData, options)
    this.getGoodsList()
  },
  	// 转发功能
onShareAppMessage() {},

// 转发到朋友圈功能
onShareTimeline() {}

})