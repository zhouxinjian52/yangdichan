//merger.js
//获取应用实例
var app = getApp()
wx.showNavigationBarLoading()
const formListMessage = [{
	label: "土地亩数",
	type: "landAcres",
	typeId: 1, // 输入框类
	isrequest: true,
	hasState: "",
	placeHolder: "填写亩数",
	unit: "亩"
}, {
	label: "容积率",
	type: "plotRatio",
	typeId: 2, // 下拉框类
	array: [],
	isrequest: true,
	hasState: "",
	placeHolder: "填写",
	unit: ""
}, {
	label: "成交价",
	type: "landAcresPrice",
	typeId: 1,
	isrequest: true,
	hasState: "",
	placeHolder: "填写价格",
	unit: "万元/亩"
}, {
	label: "目标利润率",
	type: "profitMargin",
	typeId: 3,
	isrequest: false,
	hasState: "",
	placeHolder: "",
	unit: ""
}];
const moreListMessage = [{
	label: "高层",
	type: "highPrice",
	typeArea: "highAcreage",
	isrequest: true,
	hasState: "",
	data: null,
	typeId: 1
}, {
	label: "洋房",
	type: "foreignStyleHousePrice",
	typeArea: "foreignStyleHouseAcreage",
	hasState: "",
	data: null,
	typeId: 1
}, {
	label: "别墅",
	type: "villaPrice",
	typeArea: "villaAcreage",
	hasState: "",
	data: null,
	typeId: 1
}, {
	label: "类住宅",
	type: "residencePrice",
	typeArea: "residenceAcreage",
	hasState: "",
	data: null,
	typeId: 1
}, {
	label: "商铺",
	type: "shopsPrice",
	typeArea: "shopsAcreage",
	hasState: "",
	data: null,
	typeId: 1
}, {
	label: "车位",
	type: "parkingPrice",
	typeArea: "parkingAcreage",
	hasState: "",
	data: null,
	typeId: 1
}, {
	label: "高层精装标准",
	typeArea: "highHardcover",
	hasState: "",
	data: null,
	typeId: 2
}, {
	label: "洋房精装标准",
	typeArea: "foreignStyleHouseHardcover",
	hasState: "",
	data: null,
	typeId: 2
}, {
	label: "别墅精装标准",
	typeArea: "villaHardcover",
	hasState: "",
	data: null,
	typeId: 2
}, {
	label: "类住宅精装标准",
	typeArea: "residenceHardcover",
	hasState: "",
	data: null,
	typeId: 2
}];

Page({
	data: {
		formListMessage: formListMessage,
		selectIndex: 0,
		planName: [],
		moreListMessage: moreListMessage,
		moreTitle: "面积/售价",
		isLookMoreState: true,
		selectDisable: true,
		selectInputDisable: true, // 输入框默认灰质
		num: 6, // input默认是6
		minusStatus: 'normal' // 使用data数据对象设置样式名 
	},
	onLoad: function (options) {
		console.log(options);
		// 设置请求接口参数
		this.setCompareData = {
			isSave: null, // 是否保存(默认不保存)
			plan: 1, // 方案1-5 默认1
			landAcres: null, // 土地亩数
			plotRatio: null, // 容积率
			landAcresPrice: null, //成交价
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
	},
	onReady: function () {
		wx.hideNavigationBarLoading()
	},
	/* 点击减号 */
	bindMinus: function () {
		var num = this.data.num;
		const min = -50;
		if (num > min) {
			num--;
		} else {
			return;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态  
		var minusStatus = num <= min ? 'disabled' : 'normal';
		// 将数值与状态写回
		this.setCompareData["profitMargin"] = num;
		this.setData({
			num: num,
			minusStatus: minusStatus
		});
	},
	/* 点击加号 */
	bindPlus: function () {
		var num = this.data.num;
		const max = 50;
		if (num < max) {
			num++;
		} else {
			return;
		}
		// 只有大于一件的时候，才能normal状态，否则disable状态  
		var minusStatus = num >= max ? 'disabled' : 'normal';
		// 将数值与状态写回
		this.setCompareData["profitMargin"] = num;
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
		this.setCompareData["plan"] = Number(e.detail.value) + 1
		this.setData({
			selectIndex: e.detail.value
		})
		this.getMsgDataList()
	},
	changeMoreState: function (e) {
		this.setData({
			isLookMoreState: !this.data.isLookMoreState
		})
	},
	bindGetInputValue(e) {
		const { dataset } = e.currentTarget;
		const { type } = dataset;
		const { value } = e.detail;
		const _this = this;
		try {
			if (type === "plotRatio") {
				if (value) {
					wx.request({
						url: app.globalData.requestUrl + "land/getSelectPlan",
						data: { plot: value },
						success: function (res) {
							switch (res.data.code) {
								case 0:
									_this.setData({
										'formListMessage[1].array': res.data.datas,
										selectIndex: 0,
										planName: res.data.datas,
										selectDisable: false
									})
									_this.getMsgDataList()
									break;
								default:
									wx.showModal({
										title: "请求方案失败",
										showCancel: false,
										success(d) {
											// console.log(d)
										}
									});
									break;
							}
						}
					})
				} else {
					this.setData({
						selectDisable: true
					})
				}
				this.setCompareData[type] = value;
			} else if (type === "landAcres") {
				if (value) {
					_this.setData({
						selectInputDisable: false
					})
				}
				this.setCompareData[type] = value;
			} else {
				this.setCompareData[type] = value;
			}
		} catch (error) {
			throw error;
		}
	},
	getMsgDataList() {
		const _this = this;
		wx.request({
			url: app.globalData.requestUrl + "land/getSelectPlanValue",
			data: { plot: this.setCompareData.plotRatio, landAcres: this.setCompareData.landAcres, planName: this.data.planName[this.data.selectIndex] },
			success: function (res) {
				switch (res.data.code) {
					case 0:
						const objectData = res.data.data;
						_this.data.moreListMessage.map((d, k) => {
							const temp = `moreListMessage[${k}].data`;
							_this.setData({
								[temp]: null
							})
							_this.setCompareData[d.typeArea] = null;
						})
						for (const key in objectData) {
							if (objectData.hasOwnProperty(key)) {
								const value = objectData[key];
								_this.data.moreListMessage.map((d, k) => {
									const temp = `moreListMessage[${k}].data`;
									if (d.typeArea === key) {
										_this.setData({
											[temp]: value
										})
										_this.setCompareData[d.typeArea] = value;
									}
								})
							}
						}
						break;
					default:
						break;
				}
			}
		})
	},
	validataAjaxSetSave() {
		this.setCompareData["isSave"] = true;
		this.validataAjaxSet();
	},
	validataAjaxSet() {
		// wx.navigateTo({
		// 	url: '../swiperPage1/index?data=' + JSON.stringify({})
		// });
		// return false;
		const _this = this;
		const newRequestObject = {};
		for (const key in this.setCompareData) {
			if (this.setCompareData[key] === null || this.setCompareData[key] === "") {
				switch (key) {
					case "landAcres":
						wx.showModal({
							// title: "内容填写不完整",
							content: "土地亩数不能为空",
							showCancel: false,
							success(d) {
								_this.setData({
									'formListMessage[0].hasState': "merger-error"
								})
							}
						});
						return;
					case "plotRatio":
						wx.showModal({
							content: "容积率不能为空",
							showCancel: false,
							success(d) {
								_this.setData({
									'formListMessage[1].hasState': "merger-error"
								})
							}
						});
						return;
						case "landAcresPrice":
						wx.showModal({
							// title: "内容填写不完整",
							content: "成交价不能为空",
							showCancel: false,
							success(d) {
								_this.setData({
									'formListMessage[2].hasState': "merger-error"
								})
							}
						});
						return;
					case "highPrice":
						wx.showModal({
							content: "高层售价不能为空",
							showCancel: false,
							success(d) {
								_this.setData({
									'moreListMessage[0].hasState': "merger-error"
								})
							}
						});
						return;
					default:
						// console.log(key);
						break;
				}
			} else {
				newRequestObject[key] = this.setCompareData[key];
			}
		}
		wx.showLoading({
			title: '计算中，请稍等！！'
		})
		wx.request({
			url: app.globalData.requestUrl + app.globalData.landSubmit,
			data: { ...newRequestObject },
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: function (res) {
				switch (res.data.code) {
					case 0:
						wx.hideLoading();
						wx.navigateTo({
							url: '../swiperPage1/index?data=' + JSON.stringify(res.data.data)
						});
						break;
					default:
						wx.showModal({
							title: "计算失败",
							content: `原因：${res.data.desc || "服务器开小差了,请稍后再试！！"}`,
							showCancel: false,
							success(d) {
								// console.log(d)
							}
						});
						break;
				}
			}
		})
	},
	setFocusState: function (e) {
		const { dataset } = e.currentTarget;
		const { index } = dataset;
		const temp = `formListMessage[${index}].hasState`;
		this.setData({
			[temp]: "merger-focus"
		})
	},
	setBlurState: function (e) {
		const { dataset } = e.currentTarget;
		const { index } = dataset;
		const temp = `formListMessage[${index}].hasState`;
		this.setData({
			[temp]: ""
		})
	},
	setFocusState2: function (e) {
		const { dataset } = e.currentTarget;
		const { index } = dataset;
		const temp = `moreListMessage[${index}].hasState`;
		this.setData({
			[temp]: "merger-focus"
		})
	},
	setBlurState2: function (e) {
		const { dataset } = e.currentTarget;
		const { index } = dataset;
		const temp = `moreListMessage[${index}].hasState`;
		this.setData({
			[temp]: ""
		})
	},
	onShareAppMessage: function () {
		return {
			title: '花测' + '——' + app.globalData.shareProfile,
			path: '/pages/merger/index',
			success: function (res) {
				// 转发成功
			},
			fail: function (res) {
				// 转发失败
			}
		}
	},
})

