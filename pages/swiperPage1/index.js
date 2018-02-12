//page1.js
//获取应用实例
var app = getApp()
var step = 0, startAngle = 1.5 * Math.PI, endAngle = 0;
var animation_interval = 16.7, n = 0, speed = 8;
var requestAnimationFrameName;
var ctx = wx.createCanvasContext('canvasArcCir');
const requestResultObject = {
	"accepHighestOffer": 0.00, //"可接受最高报价",
	"corporateIncomeTax": 0.00, //"企业所得税",
	"financialCost": 0.00, //"财务费用",
	"landValueAddedTax": 0.00, //"土地增值税",
	"managementCost": 0.00, //"管理费用",
	"netInterestRate": 0.06, //"净利率",
	"netProfit": 0.00, //"净利润",
	"salesCost": 0.00, //"销售成本",
	"salesRevenue": 0.00, //"销售收入",
	"sellingExpenses": 0.00, //"销售费用",
	"totalProfit": 0.00, //"利润总额",
	"valueAddedTax": 0.00, //"增值税附加"
	scoreName:""
}
Page({
	data: {
		canvasCircleWidth: wx.getSystemInfoSync().screenWidth,
		canvasCircleHeight: (wx.getSystemInfoSync().screenHeight - 50) * 2 / 3,
		resultDataObject: requestResultObject,
		indicatorDots: true // 显示面板的点点
	},
	SetParentData(applicationData) {
		const newApplicationData = {};
		for (const key in applicationData) {
			const datas = applicationData[key];
			if (key == "scoreName") {
				newApplicationData[key] = datas
			}else{
				newApplicationData[key] = key == "netInterestRate" ? (datas * 100).toFixed(2) : datas.toFixed(2);
			}
		}
		return newApplicationData;
	},
	onLoad: function (options) {
		this.callbackData = JSON.parse(options.data);
		wx.showNavigationBarLoading()
	},
	onReady: function () {
		wx.hideNavigationBarLoading()
		wx.setNavigationBarColor({
			frontColor: "#ffffff",
			backgroundColor: "#143163"
		})
		step = 0;
		const resultDataObject = this.SetParentData(Object.assign({}, this.callbackData.netInterestRate && this.callbackData || requestResultObject));
		// 16等分圆环，一等分2.5%，-10~6区间分16份
		if (resultDataObject.netInterestRate <= -10) {
			n = 22.5;
		} else if (resultDataObject.netInterestRate >= 6) {
			n = 360;
		} else {
			n = (resultDataObject.netInterestRate + 11) * 22.5;
		}
		this.setData({
			resultDataObject
		}, () => {
			setTimeout(() => {
				this.drawCircle()
			}, 300)
		})
	},
	navigateToNext: function () {
		wx.navigateTo({
			url: '../swiperPage2/index?data=' + JSON.stringify(this.callbackData)
		})
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
				radius = that.data.canvasCircleWidth / 4;

			// 绘制浅蓝环形背景
			ctx.setLineWidth(30);
			ctx.setStrokeStyle('#406daf');
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
