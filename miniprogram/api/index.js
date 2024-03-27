import http from '../utils/http'

export const reqIndexData=()=>{
	//提升渲染速度，采用并发请求 promise.all
	return http.all(
		http.get('/index/findBanner'),
		http.get('/index/findCategory1'),
		http.get('/index/advertisement'),
		http.get('/index/findListGoods'),
		http.get('/index/findRecommendGoods')
	)
}