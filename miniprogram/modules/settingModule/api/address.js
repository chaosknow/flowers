import http from '@/utils/http'
/**
 * @description 新增收获地址
 * @param {*} data 
 * @returns Promise
 */
export const reqAddAddress=(data)=>{
	return http.post(`/userAddress/save`,data)
}
/**
 * @description 获取收获地址列表
 */
export const reqAddressList=()=>{
	return http.get(`/userAddress/findUserAddress`)
}
/**
 * @description 获取地址详情信息
 * @param {*} id 
 */
export const reqAddresInfo=(id)=>{
	return http.get(`/userAddress/${id}`)
}
/**
 * @description 更新收获地址
 * @param {*} data 
 */
export const reqUpdateAddress=(data)=>{
	return http.post(`/userAddress/update`,data)
}
/**
 * @description 删除收获地址
 * @param {*} id 
 */
export const reqDelAddress=(id)=>{
	return http.get(`/userAddress/delete/${id}`)
	}