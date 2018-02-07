//swiper-page.js
//获取应用实例
var app = getApp()
var step = 1, startAngle = 1.5 * Math.PI, endAngle = 0;
var animation_interval = 16.7, n = 270, speed = 8;
var requestAnimationFrameName;
var ctx = wx.createCanvasContext('canvasArcCir');
console.log(wx.getSystemInfoSync());
Page({
	data: {
		canvasCircleWidth: wx.getSystemInfoSync().screenWidth,
		indicatorDots: true // 显示面板的点点
	},
	onLoad: function (options) {
		console.log('------------------');
		console.log(options);
		wx.showNavigationBarLoading()
		console.log("onLoad");
	},
	onReady: function () {
		console.log("onReady");
		wx.hideNavigationBarLoading()
		wx.setNavigationBarColor({
			frontColor: "#ffffff",
			backgroundColor: "#4f74b3"
		})
		step = 1;
		setTimeout(() => {
			this.drawCircle()
		}, 400)
	},
	drawCircle: function () {
		clearInterval(requestAnimationFrameName);
		const that = this;
		function drawArc(s, e) {
			// ctx.setFillStyle('white');
			// ctx.clearRect(0, 0, 240, 240);
			// ctx.draw();
			var x = that.data.canvasCircleWidth / 2,
				y = that.data.canvasCircleWidth / 2,
				radius = that.data.canvasCircleWidth / 3.5;

			// 绘制白色背景
			ctx.setLineWidth(30);
			ctx.setStrokeStyle('#eaeaea');
			ctx.setLineCap('round');
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
			ctx.stroke();
			// ctx.draw();

			// 绘制渐变圆环
			const grd = ctx.createLinearGradient(0, 0, x, 0)
			grd.addColorStop(1, '#00e5a9')
			grd.addColorStop(0, '#00d0de')
			ctx.setStrokeStyle(grd);
			ctx.setLineCap('round');
			ctx.beginPath();
			ctx.arc(x, y, radius, s, e, false);
			ctx.stroke()
			ctx.draw()
		}
		var animation = function () {
			if (step <= n) {
				endAngle = step * Math.PI / 180 + startAngle;
				drawArc(startAngle, endAngle);
				step += speed;
			} else {
				clearInterval(requestAnimationFrameName);
			}
		};
		requestAnimationFrameName = setInterval(animation, animation_interval);
	},
})
