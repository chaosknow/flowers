import http from '../utils/http'
/**
 * @description 进行登录操作
 * @param {*} code 临时登录凭证
 * @returns Promise
 */
export const reqLogin=(code)=>{
	return http.get(`/weixin/wxLogin/${code}`)
}

export const reqUserInfo=()=>{
	return http.get(`/weixin/getuserInfo`)
}
/**
 * @description 本地上传资源
 * @param {*} filePath 
 * @param {*} name 
 * @returns Promise
 */
export const reqUploadFile=(filePath,name)=>{
	return http.upload('/fileUpload',filePath,name)
}

export const reqUpdateUserInfo=(userInfo)=>{
	return http.post(`/weixin/updateUser`,userInfo)
}