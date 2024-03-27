// pages/test/test.js
import instance from '../../utils/http'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '../../assets/images/avatar.png'
  },
  async handle() {
    const res = await instance.get('/index/findBanner', null, {
      isLoading: false
    })
    console.log(res);
  },

  async chooseavatar(event) {
    //目前获取头像是临时路径
    //临时路径是有失效时间，在实际开发中，要将临时路径上传到公司服务器
    const {
      avatarUrl
    } = event.detail
    const res=  await instance.upload("/fileUpload",avatarUrl,"file")
    // console.log(res);
    const {data:avatar}=res
    this.setData({
      avatarUrl:avatar
    })
    // wx.uploadFile({
    //   filePath: avatarUrl, // 必填项，要上传文件资源的路径 (本地路径)
    //   name: 'file', //必填项，文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
    //   url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload', // 必填项，开发者服务器地址
    //   success: (res) => {
    //     //返回的json字符串
    //     res.data= JSON.parse(res.data)
    //     this.setData({
    //       avatarUrl:res.data.data
    //     })
    //     // console.log(res);
    //   }
    // })
    // this.setData({
    //   avatarUrl
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})