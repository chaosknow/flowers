export const swipeCellBehavior = Behavior({
	data:{
		swipeCellQueue:[] //用来存储滑块单元格实例
	},
	methods:{
		//用户打开删除滑块时触发
		swipeCellOpen(event){
			//获取单元格实例
			const instance = this.selectComponent(`#${event.target.id}`)
			//将实例追加到数组
			this.data.swipeCellQueue.push(instance)
		},
		//给页面绑定点击事件
		onSwipeCellPage(){
			this.onSwipeCellCommonClick()
		},
		//点击滑块单元格触发的事件
		onSwipeCellClick(){
			this.onSwipeCellCommonClick()
		},
	//关掉滑块统一的逻辑
		onSwipeCellCommonClick(){
			//需要对单元格进行数组遍历，每个实例调用close方法
			this.data.swipeCellQueue.forEach((instance)=>{
				instance.close()
			})
			//将滑块单元格数组赋值空
			this.data.swipeCellQueue=[]
		},
	}
})