// pages/address/list/index.js
import {
  reqAddressList,
  reqDelAddress
} from '../../../api/address'
import {
  swipeCellBehavior
} from '../../../../../behaviors/swipeCell'


//获取应用实例
const app =getApp()
Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: [],
  },
  //获取地址列表
  async getAddressList() {
    const res = await reqAddressList()
    const {
      data: addressList
    } = res
    this.setData({
      addressList
    })
  },
  //删除收货地址
  async delAddress(event) {
    const {
      id
    } = event.currentTarget.dataset
    //询问用户是否确认删除
    const modalRes = await wx.modal({
      content: "您确认要删除收获地址吗？"
    })
    if (modalRes) {
      await reqDelAddress(id)
      wx.toast({
        title: "删除成功"
      })
      this.getAddressList()
    }
  },
  onShow() {
    this.getAddressList()
  },
//更新收货地址
  changeAddress(event){
    //判断是否从结算页面进入收货地址列表页面
    //是，才获取点击的收货地址，不是，不执行切换地址的逻辑
    if(this.flag !== '1') return
    const addressId =event.currentTarget.dataset.id
    // console.log(addressId);
    //需要从收货地址列表中根据 收货地址id 查找到点击地址的详情信息
    const  selectAddress=this.data.addressList.find((item)=>item.id===addressId)
    if(selectAddress){
      //如果获取收货地址成功以后，需要赋值到全局共享的数据
      app.globalData.address =selectAddress
      wx.navigateBack()
    }
  },

  // 去编辑页面
  toEdit(event) {
    const {
      id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  onLoad(options){
    //接受传递的参数，挂载到this上，方便使用
    this.flag=options.flag
  }
})