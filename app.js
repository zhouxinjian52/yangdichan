//app.js
App({
	onLaunch: function () {
		this.login();
	},
	login: function () {
		wx.login({
			success: function (res) {
				console.log(res);
			}
		})
	},
	registerUser: function () {
		var that = this;
		wx.login({
			success: function (res) {
				var code = res.code; // 微信登录接口返回的 code 参数，下面注册接口需要用到
				wx.getUserInfo({
					success: function (res) {
						console.log(res);
					}
				})
			}
		})
	},
	getUserInfo: function (cb) {
		var that = this
		if (this.globalData.userInfo) {
			typeof cb == "function" && cb(this.globalData.userInfo)
		} else {
			//调用登陆接口
			wx.login({
				success: function () {
					wx.getUserInfo({
						success: function (res) {
							that.globalData.userInfo = res.userInfo
							typeof cb == "function" && cb(that.globalData.userInfo)
						}
					})
				}
			})
		}

	},
	globalData: {
		userInfo: null,
		requestUrl: "https://hyn.qiyehoutai.com/",
		mergerSubmit: "land/measure", // 并购接口
		landSubmit: "land/measureTwo", // 土拍接口
		version: "1.0.0",
		shareProfile: '花样年地产' // 首页转发的时候话术
	}
})
