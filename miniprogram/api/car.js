import http from '@/utils/http'
/**
 * @description  [商品详情加入购物车] 以及 [购物车更新商品数量]
 * @param {Object} param {goodsId:商品 id,count:购买数量,blessing:祝福语}
 * @returns Promise
 */
export const reqAddCart=({goodsId,count,...data})=>{
	return http.get(`/cart/addToCart/${goodsId}/${count}`,data)
}
/**
 * @description 购物车列表
 * @returns Promise
 */
export const reqCartList=()=>{
	return http.get(`/cart/getCartList`)
}
/**
 * @description 更新商品状态
 * @param {*} goodsId 商品id
 * @param {*} isChecked 更新后的状态，0 不勾选，1 勾选
 * @returns Promise
 */
export const reqUpdateChecked = (goodsId, isChecked) => {
  return http.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}
/**
 * @description 全选与全不选
 * @param {*} isChecked 0 取消全选，1 全选
 */
export const reqCheckAllStatus = (isChecked) => {
  return http.get(`/cart/checkAllCart/${isChecked}`)
}

/**
 * @description 删除购物车商品
 * @param {*} goodsId 商品id
 */
export const reqDelCart = (goodsId) => {
  return http.get(`/cart/delete/${goodsId}`)
}
