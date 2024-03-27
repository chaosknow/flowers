// pages/goods/detail/index.js
import {
  reqGoodsInfo
} from '../../../api/goods'
import {
  userBehavior
} from '../../../behaviors/userBehavior'
import {
  reqAddCart,reqCartList
} from '@/api/car'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0 ,//点击加入购物车等于0，点击立即购买等于1
    allCount:'' //购物车总数
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({
      show: false
    })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    // console.log(event.detail)
    this.setData({
      count: Number(event.detail)
    })
  },
  //获取详情信息数据
  async getGoodsInfo() {
    const {
      data
    } = await reqGoodsInfo(this.goodsId)
    //  console.log(res);
    this.setData({
      goodsInfo: {
        ...data
      }
    })
  },
  //全屏预览图片功能
  previewImage() {
    wx.previewImage({
      urls: [...this.data.goodsInfo.detailList],
    })
  },
  //弹窗的确认按钮触发的事件处理函数
  async handlerSubmit() {
    const {
      token,
      count,
      blessing,
      buyNow
    } = this.data
    const goodsId = this.goodsId
    //判断用户是否登录
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    //判断时buyNow是加入购物车（0）还是立即购买（1）
    if (buyNow === 0) {
      const res = await reqAddCart({
        goodsId,
        count,
        blessing
      })
      if (res.code === 200) {
        wx.toast({
          title: "加入购物车成功"
        })
        this.getCartCount()
        this.setData({
          show: false
        })
      }
      // console.log(res);
    } else {
      wx.navigateTo({
        url: `/modules/orderPayModule/pages/order/detail/detail?goodsId=${goodsId}&blessing=${blessing}`,
      })
    }
  },
  //计算购物车商品数量
  async getCartCount(){
    //判断用户是否登录
    if(!this.data.token) return
    //请求商品数量接口
    const res = await reqCartList()
    // console.log(res);
    if(res.data.length !==0){
      let allCount =0
      res.data.forEach((item) => {
        allCount+=item.count
      });
      this.setData({
        //要求的属性值是字符串类型，购买数量大于99显示99+
        allCount:(allCount>99?'99+':allCount)+''
      })
    }
  },
  onLoad(options) {
    // console.log(options);
    //把goodsId挂载到this身上方便使用
    this.goodsId = options.goodsId
    //调用getGoodsInfo获取商品详情数据
    this.getGoodsInfo()
    this.getCartCount()
  },
  	// 转发功能
  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index',
      imageUrl: '../../../../../assets/images/love.jpg'
    }
  },
  
  // 转发到朋友圈功能
  onShareTimeline() {}
})