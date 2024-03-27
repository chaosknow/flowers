import {
  ComponentWithStore
} from 'mobx-miniprogram-bindings'
import {
  userStore
} from '@/stores/userStore'
// 从 miniprogram-licia 导入防抖函数
import {
  debounce
} from 'miniprogram-licia'
import {
  reqCartList,
  reqUpdateChecked,
  reqCheckAllStatus,
  reqAddCart,
  reqDelCart
} from '@/api/car'
// 导入让删除滑块自动弹回的 behavior
import {
  swipeCellBehavior
} from '@/behaviors/swipeCell'
const computedBehavior = require('miniprogram-computed').behavior
ComponentWithStore({

  // 注册计算属性
  behaviors: [computedBehavior, swipeCellBehavior],
  storeBindings: {
    store: userStore,
    fields: ["token"]
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  computed: {
    // 判断是否全选
    // computed 函数中不能访问 this ，只有 data 对象可供访问
    // 这个函数的返回值会被设置到 this.data.selectAllStatus 字段中
    selectAllStatus(data) {
      return (
        data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked === 1)
      )
    },
    totalPrice(data) {
      let totalPrice = 0
      data.cartList.forEach((item) => {
        // 如果商品的 isChecked 属性等于，说明该商品被选中的
        if (item.isChecked === 1) {
          totalPrice += item.count * item.price
        }
      })
      return totalPrice
    }
  },
  // 组件的方法列表
  methods: {
    // 跳转到订单结算页面
    toOrder() {
      if (this.data.totalPrice === 0) {
        wx.toast({
          title: '请选择需要购买的商品'
        })
        return
      }
      // 跳转到订单的结算页面
      wx.navigateTo({
        url: '/modules/orderPayModule/pages/order/detail/detail'
      })
    },
    // 删除购物车中的商品
    async delCartGoods(event) {
      // 获取需要删除商品的 id
      const {
        id
      } = event.currentTarget.dataset

      // 询问用户是否删除该商品
      const modalRes = await wx.modal({
        content: '您确认删除该商品吗 ?'
      })

      if (modalRes) {
        await reqDelCart(id)
        this.showTipGetList()
      }
    },
    onHide() {
      // 在页面隐藏的时候，需要让删除滑块自动弹回
      this.onSwipeCellCommonClick()
    },
    //更新购买的数量
    changeBuyNum: debounce(async function (event) {
      // 获取最新的购买数量，
      // 如果用户输入的值大于 200，购买数量需要重置为 200
      // 如果不大于 200，直接返回用户输入的值
      let buynum = event.detail > 200 ? 200 : event.detail
      // 获取商品的 ID 和 索引
      const {
        id: goodsId,
        index,
        oldbuynum
      } = event.target.dataset
      // 验证用户输入的值，是否是 1 ~ 200 直接的正整数
      const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      // 对用户输入的值进行验证
      const regRes = reg.test(buynum)

      // 如果验证没有通过，需要重置为之前的购买数量
      if (!regRes) {
        this.setData({
          [`cartList[${index}].count`]: oldbuynum
        })
        //阻止代码往下运行
        return
      }
      // 如果通过，需要计算差值，然后将差值发送给服务器，让服务器进行逻辑处理
      const disCount = buynum - oldbuynum
      // 如果购买数量没有发生改变，不发送请求
      if (disCount === 0) return
      // 发送请求：购买的数量 和 差值
      const res = await reqAddCart({
        goodsId,
        count: disCount
      })
      // 服务器更新购买数量成功以后，更新本地的数据
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: buynum,
          //如果购买数量发生了变化，需要让当前商品变成选中状态
          [`cartList[${index}].isChecked`]: 1
        })
      }
    }, 500),

    // 全选和全不选功能
    async changeAllStatus(event) {
      // 获取全选和全不选的状态
      const isChecked = event.detail ? 1 : 0
      // 调用接口，更新服务器中商品的状态
      const res = await reqCheckAllStatus(isChecked)

      // 如果更新成功，需要将本地的数据一同改变
      if (res.code === 200) {
        // 将数据进行拷贝
        const newCart = JSON.parse(JSON.stringify(this.data.cartList))
        // 将数据进行更改
        newCart.forEach((item) => (item.isChecked = isChecked))
        // 进行赋值
        this.setData({
          cartList: newCart
        })
      }
    },
    // 获取购物车列表数据 + 处理页面的展示
    async showTipGetList() {
      const {
        token
      } = this.data
      //判断是否登录
      if (!token) {
        this.setData({
          emptyDes: '您尚未登录，点击登录获取更多权益',
          cartList: []
        })
        return
      }
      //登录了就获取购物车列表的数组
      const {
        code,
        data: cartList
      } = await reqCartList()
      if (code === 200) {
        this.setData({
          cartList,
          emptyDes: cartList.length === 0 && '还没有添加商品，快去添加吧～'
        })
      }
    },

    //更新商品的购买状态
    async updateChecked(event) {
      //获取最新商品的购买状态
      const {
        detail
      } = event
      //获取传递的商品id以及索引
      const {
        id,
        index
      } = event.target.dataset
      //将最新的购买状态转成后端接口使用的0 和1 
      const isChecked = detail ? 1 : 0
      const res = await reqUpdateChecked(id, isChecked)
      if (res.code === 200) {
        // this.showTipGetList()
        this.setData({
          [`cartList[${index}].isChecked`]: isChecked
        })
      }
    },
    //如果使用componet方法构建页面
    //生命周期的钩子函数需要写道method中才行
    onShow() {
      // console.log(this.data.token);
      this.showTipGetList()
    }
  }
})