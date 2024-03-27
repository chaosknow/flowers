import {
  userBehavior
} from './behavior'
import {
  getStorage,setStorage
} from '../../../../utils/storage'
import {
  reqUploadFile,reqUpdateUserInfo
} from '../../../../api/user'
import { toast } from '../../../../utils/extendApi'
Page({
  //注册behavior
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },
  //修改头像
  async chooseAvatar(event) {
    //临时路径具有失效时间，需要上传到公司的服务器，获取永久路径
    //使用永久路径，需要使用永久路径更新headimgurl
    //用户点击保存，才算真正更新了头像和昵称
    const {
      avatarUrl
    } = event.detail
    //通过wxwx.uploadFile上传到服务器
    // wx.uploadFile({
    //   filePath: avatarUrl,
    //   name: 'file',
    //   url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
    //   header: {
    //     token: getStorage("token")
    //   },
    //   success: (res) => {
    //     // console.log(res);
    //     const uploadRes = JSON.parse(res.data)
    //     this.setData({
    //       "userInfo.headimgurl": uploadRes.data
    //     })
    //   }
    // })
    const res = await reqUploadFile(avatarUrl, "file")
    //  console.log(res);
    this.setData({
      "userInfo.headimgurl": res.data
    })
  },
  //保存更新用户信息
  async updateUserInfo(){
    const res= await reqUpdateUserInfo(this.data.userInfo)
    // console.log(res);
    if(res.code===200){
      //将本地用户信息更新
      setStorage("userInfo",this.data.userInfo)
      //将服务器用户信息更新
      this.setUserInfo(this.data.userInfo)
      //给用户反馈
      toast({title:"保存成功"})
      //返回上一级页面
      // wx.navigateBack()
    }
  },
  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true
    })
  },
  //获取用户昵称
  getNickname(event){
    const {nickname} =event.detail.value
    this.setData({
      "userInfo.nickname":nickname,
      isShowPopup:false
    })

  },
  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false,
      "userInfo.nickname":this.data.userInfo.nickname
    })
  }
})