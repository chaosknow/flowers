import http from '@/utils/http'
/**
 * @description 获取商品列表数据
 * @param {Object} param {page ,limit,category1Id,category2Id} 
 * @returns Promise
 */
export const reqGoodsList=({page,limit,...data})=>{
	return http.get(`/goods/list/${page}/${limit}`,data)
}
/**
 * @description 获取商品详情信息
 * @param {*} goodsId 商品id
 * @returns Promise
 */
export const reqGoodsInfo=(goodsId)=>{
	return http.get(`/goods/${goodsId}`)
}