//map.js
//获取应用实例
var app = getApp()
Page({
	data: {

	},
	onLoad: function (options) {

	},
	onReady: function () {

	},
	onShow: function () {
		wx.showModal({
			content: "尽请期待",
			showCancel: false,
			success: function () {
				wx.switchTab({
					url: '../merger/index'
				});
			}
		});
	}
})
