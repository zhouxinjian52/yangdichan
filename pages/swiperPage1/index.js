//page1.js
//获取应用实例
var app = getApp()
var step = 0, startAngle = 1.5 * Math.PI, endAngle = 0;
var animation_interval = 16.7, n = 0, speed = 8;
var requestAnimationFrameName;
var ctx = wx.createCanvasContext('canvasArcCir');
var gradientColor = ['#00d0de', '#00e5a9'];
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
	scoreName: "",
	scoreType: 1
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
			const datas = applicationData[key] || 0.00;
			if (key == "scoreName" || key == "scoreType") {
				newApplicationData[key] = datas
			} else {
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
		const resultDataObject = this.SetParentData(Object.assign({}, this.callbackData || requestResultObject));
		// 16等分圆环，一等分2.5%，-10~6区间分16份
		if (resultDataObject.netInterestRate <= -10) {
			n = 22.5;
		} else if (resultDataObject.netInterestRate >= 6) {
			n = 360;
		} else {
			n = (Number(resultDataObject.netInterestRate) + 10) * 22.5;
		}

		switch (resultDataObject.scoreType) {
			case 1:
				gradientColor = ['#fe998b', '#f78a9e'];
				break;
			case 2:
				gradientColor = ['#fda085', '#f6d365'];
				break;
			case 3:
				gradientColor = ['#64b3f4', '#c2e59c'];
				break;
			case 4:
				gradientColor = ['#00d0de', '#00e5a9'];
				break;
			default:
				break;
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
		var animation = function () {
			endAngle = step * Math.PI / 180 + startAngle;
			if (step <= n) {
				that.drawArc(startAngle, endAngle);
				step += speed;
			} else {
				clearInterval(requestAnimationFrameName);
				that.setResultCicleAnimateBowen(startAngle, endAngle);

			}
		};
		requestAnimationFrameName = setInterval(animation, animation_interval);
	},
	drawArc(s, e) {
		const x = this.data.canvasCircleWidth / 2,
			y = this.data.canvasCircleWidth / 2,
			radius = this.data.canvasCircleWidth / 4;

		// 绘制浅蓝环形背景
		ctx.setLineWidth(30);
		ctx.setStrokeStyle('#406daf');
		ctx.setLineCap('round');
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
		ctx.stroke();

		// 绘制渐变圆环
		const grd = ctx.createLinearGradient(0, 0, x, 0)
		grd.addColorStop(0, gradientColor[0])
		grd.addColorStop(1, gradientColor[1])
		ctx.setStrokeStyle(grd);
		ctx.setGlobalAlpha(1)
		ctx.setLineCap('round');
		ctx.beginPath();
		ctx.arc(x, y, radius, s, e, false);
		ctx.stroke()

		ctx.draw()
	},
	setResultCicleAnimateBowen(s, e) {
		ctx.clearRect(0, 0, 1000, 1000);
		ctx.draw();
		const x = this.data.canvasCircleWidth / 2, // 获取画布的中心坐标x
			y = this.data.canvasCircleWidth / 2, // 获取画布的中心坐标y
			radius = this.data.canvasCircleWidth / 4; // 圆环的最大半径

		// 绘制圆环溢出效果的坐标集
		let arraysCombineAlpha = []
		if (n >= 90 && n <= 180) {
			arraysCombineAlpha = [[0, 55, 35], [58, 95, 75]]
		} else if (n >= 180 && n <= 240) {
			arraysCombineAlpha = [[0, 55, 35], [58, 95, 75], [105, 135, 125]]
		} else if (n >= 270) {
			arraysCombineAlpha = [[0, 55, 35], [58, 95, 75], [105, 135, 125], [136, 178, 160]]
		}
		// 颜色较深的半径随机数
		const rNumber = arraysCombineAlpha.map(() => Math.random() * 40 + 40);
		// 颜色较浅的半径随机数
		const rNumber2 = arraysCombineAlpha.map(() => Math.random() * 20 + 20);
		// 圆环半径圆环效果绘制开始点
		const radiusCicle = radius + 13;
		// 绘制颜色较浅的静态效果
		arraysCombineAlpha.map((d, k) => {
			const round = d.map(n => 90 - n); // 控制点的度数，结束点的度数
			let roundCicle1, roundCicle2, roundCicle3;
			roundCicle1 = [Math.sin(round[0] * Math.PI / 180) * radiusCicle + x, Math.abs(Math.cos(round[0] * Math.PI / 180)) * radiusCicle + y];
			roundCicle2 = [Math.sin(round[1] * Math.PI / 180) * radiusCicle + x, Math.abs(Math.cos(round[1] * Math.PI / 180)) * radiusCicle + y];
			roundCicle3 = [Math.sin(round[2] * Math.PI / 180) * (radiusCicle + rNumber[k] + rNumber2[k]) + x, Math.abs(Math.cos(round[2] * Math.PI / 180)) * (radiusCicle + rNumber[k] + rNumber2[k]) + y];

			ctx.beginPath()
			ctx.moveTo(roundCicle1[0], roundCicle1[1])
			ctx.quadraticCurveTo(roundCicle3[0], roundCicle3[1], roundCicle2[0], roundCicle2[1])
			ctx.setFillStyle(gradientColor[1])
			ctx.setGlobalAlpha(0.1)
			ctx.fill()
		})
		// 绘制颜色较深的静态效果
		let arraysCombine = []
		if (n >= 90 && n <= 180) {
			arraysCombine = [[4, 53, 35], [62, 92, 75]]
		} else if (n >= 180 && n <= 240) {
			arraysCombine = [[4, 53, 35], [62, 92, 75], [115, 133, 125]]
		} else if (n >= 270) {
			arraysCombine = [[4, 53, 35], [62, 92, 75], [115, 133, 125], [139, 176, 160]]
		}
		arraysCombine.map((d, k) => {
			const round = d.map(n => 90 - n); // 控制点的度数，结束点的度数
			let roundCicle1, roundCicle2, roundCicle3;
			roundCicle1 = [Math.sin(round[0] * Math.PI / 180) * radiusCicle + x, Math.abs(Math.cos(round[0] * Math.PI / 180)) * radiusCicle + y];
			roundCicle2 = [Math.sin(round[1] * Math.PI / 180) * radiusCicle + x, Math.abs(Math.cos(round[1] * Math.PI / 180)) * radiusCicle + y];
			roundCicle3 = [Math.sin(round[2] * Math.PI / 180) * (radiusCicle + rNumber[k]) + x, Math.abs(Math.cos(round[2] * Math.PI / 180)) * (radiusCicle + rNumber[k]) + y];

			ctx.beginPath()
			ctx.moveTo(roundCicle1[0], roundCicle1[1])
			ctx.quadraticCurveTo(roundCicle3[0], roundCicle3[1], roundCicle2[0], roundCicle2[1])
			ctx.setFillStyle(gradientColor[1])
			ctx.setGlobalAlpha(0.5)
			ctx.fill()
		})

		this.drawArc(s, e); // 绘制一遍静态图
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
