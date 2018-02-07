//merger.js
//获取应用实例
var app = getApp()
wx.showNavigationBarLoading()
const formListMessage = [{
	label: "土地亩数",
	type: "landAcres",
	typeId: 1, // 输入框类
	isrequest: true,
	placeHolder: "填写亩数",
	unit: "亩"
}, {
	label: "容积率",
	type: "plotRatio",
	typeId: 2, // 下拉框类
	array: ["方案1", "方案2", "方案3", "方案4", "方案5"],
	isrequest: true,
	placeHolder: "填写容积率",
	unit: ""
}, {
	label: "有票地价",
	type: "landPrice",
	typeId: 1,
	isrequest: true,
	placeHolder: "填写价格",
	unit: "万元"
}, {
	label: "总收购对价",
	type: "landTotal",
	typeId: 1,
	isrequest: true,
	placeHolder: "填写价格",
	unit: "万元"
}, {
	label: "目标利润率",
	type: "profitMargin",
	typeId: 3,
	isrequest: false,
	placeHolder: "",
	unit: ""
}];
const lessListMessage = [{
	label: "高层",
	type: "highPrice",
	typeArea: "highAcreage",
	typeId: 1
}];
const moreListMessage = [{
	label: "高层",
	type: "highPrice",
	typeArea: "highAcreage",
	typeId: 1
}, {
	label: "洋房",
	type: "foreignStyleHousePrice",
	typeArea: "foreignStyleHouseAcreage",
	typeId: 1
}, {
	label: "别墅",
	type: "villaPrice",
	typeArea: "villaAcreage",
	typeId: 1
}, {
	label: "类住宅",
	type: "residencePrice",
	typeArea: "residenceAcreage",
	typeId: 1
}, {
	label: "商铺",
	type: "shopsPrice",
	typeArea: "shopsAcreage",
	typeId: 1
}, {
	label: "车位",
	type: "parkingPrice",
	typeArea: "parkingAcreage",
	typeId: 1
}, {
	label: "高层精装标准",
	type: "highHardcover",
	typeId: 2
}, {
	label: "洋房精装标准",
	type: "foreignStyleHouseHardcover",
	typeId: 2
}, {
	label: "别墅精装标准",
	type: "villaHardcover",
	typeId: 2
}, {
	label: "类住宅精装标准",
	type: "residenceHardcover",
	typeId: 2
}];

Page({
	data: {
		formListMessage: formListMessage,
		selectIndex: 0,
		errorList: [1, 5],
		moreListMessage: lessListMessage,
		moreTitle: "面积/售价",
		isLookMoreState: true,
		num: 1, // input默认是1
		minusStatus: 'disabled' // 使用data数据对象设置样式名 
	},
	/* 点击减号 */
	bindMinus: function () {
		var num = this.data.num;
		// 如果大于1时，才可以减  
		if (num > 1) {
			num--;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态  
		var minusStatus = num <= 1 ? 'disabled' : 'normal';
		// 将数值与状态写回  
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},
	/* 点击加号 */
	bindPlus: function () {
		var num = this.data.num;
		// 不作过多考虑自增1
		num++;
		// 只有大于一件的时候，才能normal状态，否则disable状态  
		var minusStatus = num < 1 ? 'disabled' : 'normal';
		// 将数值与状态写回  
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},
	/* 输入框事件 */
	bindManual: function (e) {
		var num = e.detail.value;
		// 将数值与状态写回
		this.setData({
			num: num
		});
	},
	bindPickerChange: function (e) {
		console.log('picker发送选择改变，携带值为', e.detail.value)
		this.setData({
			selectIndex: e.detail.value
		})
	},
	changeMoreState: function (e) {
		this.setData({
			moreListMessage: this.data.isLookMoreState ? moreListMessage : lessListMessage,
			isLookMoreState: !this.data.isLookMoreState
		})
	},
	bindStart: function (e) {
		console.log(e);
	},
	bindGetInputValue(e) {
		const { dataset } = e.currentTarget;
		const { type } = dataset;
		const { value } = e.detail;
		try {
			this.setCompareData[type] = value;
		} catch (error) {
			throw error;
		}
	},
	validataAjaxSet() {
		wx.navigateTo({
			url: '../swiperPage/index?id=1'
		})
		// for (const key in this.setCompareData) {
		// 	if (this.setCompareData[key] === null || this.setCompareData[key] === "" || this.setCompareData[key] === 0) {
		// 		switch (key) {
		// 			case "landAcres":
		// 				wx.showModal({
		// 					// title: "内容填写不完整",
		// 					content: "土地亩数不能为空",
		// 					showCancel: false,
		// 					success(d) {
		// 						console.log(d)
		// 					}
		// 				});
		// 				return;
		// 			case "plotRatio":
		// 				wx.showModal({
		// 					// title: "内容填写不完整",
		// 					content: "容积率不能为空",
		// 					showCancel: false,
		// 					success(d) {
		// 						console.log(d)
		// 					}
		// 				});
		// 				return;
		// 			case "landPrice":
		// 				wx.showModal({
		// 					// title: "内容填写不完整",
		// 					content: "有票地价不能为空",
		// 					showCancel: false,
		// 					success(d) {
		// 						console.log(d)
		// 					}
		// 				});
		// 				return;
		// 			case "landTotal":
		// 				wx.showModal({
		// 					// title: "内容填写不完整",
		// 					content: "总收购对价不能为空",
		// 					showCancel: false,
		// 					success(d) {
		// 						console.log(d)
		// 					}
		// 				});
		// 				return;
		// 			case "profitMargin":
		// 				wx.showModal({
		// 					// title: "内容填写不完整",
		// 					content: "目标利润率不能为0",
		// 					showCancel: false,
		// 					success(d) {
		// 						console.log(d)
		// 					}
		// 				});
		// 				return;
		// 			default:
		// 				// console.log(key);
		// 				break;
		// 		}
		// 	}
		// }
		// console.log('ok');
		// console.log(this.setCompareData);
		// wx.request({
		// 	url: 'http://139.224.55.45:8484/land/measure', //仅为示例，并非真实的接口地址
		// 	data: { ...this.setCompareData },
		// 	header: {
		// 		'content-type': 'application/json' // 默认值
		// 	},
		// 	success: function (res) {
		// 		console.log(res.data);
		// 		wx.navigateTo({
		// 			url: '../swiperPage/index?id=1'
		// 		})
		// 	}
		// })
	},
	onLoad: function (options) {
		// Do some initialize when page load.
		// wx.navigateTo({
		// 	url: '../swiperPage/index?id=1'
		// })
	},
	onReady: function () {
		// 设置请求接口参数
		this.setCompareData = {
			isSave: null, // 是否保存(默认不保存)
			landAcres: null, // 土地亩数
			plotRatio: null, // 容积率
			landPrice: null, //有票地价
			landTotal: null, //总收购对价
			profitMargin: this.data.num, //目标利润率
			highPrice: null, //高层售价
			highAcreage: null,//高层面积
			highHardcover: null,//高层精装标准
			foreignStyleHousePrice: null,//洋房售价
			foreignStyleHouseAcreage: null,//洋房面积
			foreignStyleHouseHardcover: null,//洋房精装标准
			villaPrice: null,//别墅售价
			villaAcreage: null,//别墅面积
			villaHardcover: null,//别墅精装标准
			residencePrice: null,//类住宅售价
			residenceAcreage: null,//类住宅面积
			residenceHardcover: null,//类住宅精装标准
			shopsPrice: null,//商铺售价
			shopsAcreage: null,//商铺面积
			parkingPrice: null//车位售价
		}

		wx.hideNavigationBarLoading()
	},
	onShow: function () {
		// Do something when page show.
	},
	onHide: function () {
		// Do something when page hide.
	},
	onUnload: function () {
		// Do something when page close.
	},
	onPullDownRefresh: function () {
		// Do something when pull down.
	},
	onReachBottom: function () {
		// Do something when page reach bottom.
	},
	onShareAppMessage: function () {
		// return custom share data when user share.
	},
	onPageScroll: function () {
		// Do something when page scroll
	},
	onTabItemTap(item) {
		console.log(item.index)
		console.log(item.pagePath)
		console.log(item.text)
	},
	// Event handler.
	viewTap: function () {
		this.setData({
			text: 'Set some data for updating view.'
		}, function () {
			// this is setData callback
		})
	},
	customData: {
		hi: 'MINA'
	}
})
