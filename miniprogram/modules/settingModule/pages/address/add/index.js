//引入QQMapWX核心类
import QQMapWX from '../../../libs/qqmap-wx-jssdk.min'
//用于校验输入是否合法
import Schema from 'async-validator';
import {
  reqAddAddress,
  reqAddresInfo,
  reqUpdateAddress
} from '../../../api/address'
Page({
  // 页面的初始数据
  data: {
    //需要将请求参数放在data对象下，方便在模板中绑定数据
    "name": "", //收货人
    "phone": "", //手机号码
    "provinceName": "", //省
    "provinceCode": "", //省编码
    "cityName": "", //市
    "cityCode": "", //市编码
    "districtName": "", //区
    "districtCode": "", //区编码
    "address": "", //详细地址
    "fullAddress": "", //完整地址
    "isDefault": false //是否设置为默认地址 0表示不设置 1设置
  },

  // 保存收货地址
  async saveAddrssForm() {
    //整合参数
    const {
      provinceName,
      cityName,
      districtName,
      address,
      isDefault
    } = this.data
    const params = {
      ...this.data,
      fullAddress: provinceName + cityName + districtName + address,
      isDefault: isDefault ? 1 : 0
    }
    //对组织后的参数进行验证，验证通过后调用新增接口实现新增收获地址功能
    const {
      valid
    } = await this.validatorAddress(params);
    //如果验证不成功，不做操作
    if (!valid) return
    //验证成功，调用新增接口实现新增收获地址功能
    console.log(params);
    //判断有没有传id，有id用更新地址接口，没有id用添加地址接口
    const res = this.addressId ? await reqUpdateAddress(params) : await reqAddAddress(params)
    if (res.code === 200) {
      wx.navigateBack({
        success:()=>{
          wx.toast({
            title: this.addressId?'修改地址成功！':'新增地址成功！'
          })
        }
      })

    }
  },

  //验证新增地址信息
  validatorAddress(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'
    // 验证手机号，是否符合中国大陆手机号码的格式
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    //校验规则
    const rules = {
      name: [{
          required: true,
          message: "请输入收货人姓名"
        },
        {
          pattern: nameRegExp,
          message: "收货人姓名不合法"
        }
      ],
      phone: [{
          required: true,
          message: "请输入收货人手机号"
        },
        {
          pattern: phoneReg,
          message: "收货人手机号不合法"
        }
      ],
      provinceName: [{
        required: true,
        message: "请选择收货人所在地区"
      }, ],
      address: [{
        required: true,
        message: "请选择收货人详细地址"
      }, ]
    }
    const validator = new Schema(rules)
    //调用实例方法对请求参数进行验证
    //注意：我们希望返回一个Promise的形式给函数调用者
    return new Promise((resolve) => {
      validator.validate(params, (error) => {
        if (error) {
          //验证失败给用户提示
          wx.toast({
            title: error[0].message
          })
          //false验证失败
          resolve({
            valid: false
          })
        } else {
          //true验证成功
          resolve({
            valid: true
          })
        }
      })
    })
  },

  // 省市区选择
  onAddressChange(event) {
    // console.log(event);
    const [provinceName,
      cityName,
      districtName
    ] = event.detail.value
    const [provinceCode,
      cityCode,
      districtCode
    ] = event.detail.code
    this.setData({
      provinceName,
      cityName,
      districtName,
      provinceCode,
      cityCode,
      districtCode
    })
  },
  //获取用户地理位置信息
  async onLocation() {
    //获取当前地理位置（longitude经度，latitude纬度,name搜索的地点）
    const {
      latitude,
      longitude,
      name
    } = await wx.chooseLocation()
    //reverseGeocoder逆地址解析
    this.qqmapwx.reverseGeocoder({
      location: {
        longitude,
        latitude
      },
      success: (res) => {
        // console.log(res);
        //获取省市区，省市区编码
        const {
          adcode,
          province,
          city,
          district,
        } = res.result.ad_info
        //获取街道、门牌 （街道、门牌可能为空）
        const {
          street,
          street_number
        } = res.result.address_component
        //获取标准地址
        const {
          standard_address
        } = res.result.formatted_addresses
        this.setData({
          provinceName: province,
          //如果是省 前两位有值 后四位是0
          provinceCode: adcode.replace(adcode.substring(2, 6), "0000"),
          //如果是省 前4位有值 后2位是0
          cityName: city,
          cityCode: adcode.replace(adcode.substring(4, 6), "00"),
          //区，东莞市，中山市，嘉峪关市 其下无县级
          districtName: district,
          districtCode: district && adcode,
          //组织详细地址
          address: street + street_number + name,
          //组织完整地址
          fullAddress: standard_address + name
        })
      }
    })
  },

  //用来处理更新相关逻辑
  async showAddressInfo(id) {
    if (!id) return
    //挂载到页面的实例this上，方便多个方法使用id
    this.addressId = id
    //修改导航栏标题
    wx.setNavigationBarTitle({
      title: '更新收货地址',
    })
    //获取详情信息
    const {
      data
    } = await reqAddresInfo(id)
    this.setData(data)
  },
  onLoad(options) {
    // 实例化API核心类
    this.qqmapwx = new QQMapWX({
      key: 'MJTBZ-Q3ZW7-EUIXG-HHNE3-BCAJH-NXBOM'
    });
    //调用方法实现更新的业务逻辑
    this.showAddressInfo(options.id)
  }
})