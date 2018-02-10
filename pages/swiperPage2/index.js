//swiper-page.js
//获取应用实例
var app = getApp()
var startAngle = 0.5 * Math.PI, endAngle = 0, radius = 20;
var animation_interval = 16.7, speed = 8;
var requestAnimationFrameName1, requestAnimationFrameName2, requestAnimationFrameName3;
var ctx1 = wx.createCanvasContext('canvasArcCir1');
var ctx2 = wx.createCanvasContext('canvasArcCir2');
var ctx3 = wx.createCanvasContext('canvasArcCir3');
const viewListData = [{
	color: "#f6b365",
	title: "销售费用",
	key: "sellingExpenses",
	number: ""
}, {
	color: "#fda085",
	title: "管理费用",
	key: "managementCost",
	number: ""
}, {
	color: "#f5576c",
	title: "利润总额",
	key: "totalProfit",
	number: ""
}, {
	color: "#f093fb",
	title: "企业所得税",
	key: "corporateIncomeTax",
	number: ""
}, {
	color: "#5bdde5",
	title: "净利润",
	key: "netProfit",
	number: ""
}, {
	color: "#66a6ff",
	title: "销售净利率",
	key: "netInterestRate",
	number: ""
}];
const requestResultObject = {
	"accepHighestOffer": "0.00", //"可接受最高报价",
	"corporateIncomeTax": "0.00", //"企业所得税",
	"financialCost": "0.00", //"财务费用",
	"landValueAddedTax": "0.00", //"土地增值税",
	"managementCost": "0.00", //"管理费用",
	"netInterestRate": "0.00", //"净利率",
	"netProfit": "0.00", //"净利润",
	"salesCost": "0.00", //"销售成本",
	"salesRevenue": "0.00", //"销售收入",
	"sellingExpenses": "0.00", //"销售费用",
	"totalProfit": "0.00", //"利润总额",
	"valueAddedTax": "0.00", //"增值税附加"
};
Page({
	data: {
		canvasCircleWidth: wx.getSystemInfoSync().screenWidth - 80,
		canvasCircleHeight: wx.getSystemInfoSync().screenWidth - 120,
		resultDataObject: requestResultObject,
		numberCicle1: "",
		numberCicle2: "",
		numberCicle3: "",
		viewListData: viewListData,
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
	SetListData(applicationData) {
		const newviewListData = [];
		viewListData.map((data, k) => {
			data.number = applicationData[data.key];
			newviewListData.push(data);
		});
		return newviewListData;
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
		});
		const resultDataObject = this.SetParentData(this.callbackData);
		const viewListData = this.SetListData(resultDataObject);

		const numberCicle1 = (Number(resultDataObject.salesCost)).toFixed(2); // 销售成本
		const numberCicle2 = (Number(resultDataObject.valueAddedTax) + Number(resultDataObject.landValueAddedTax) + Number(resultDataObject.corporateIncomeTax)).toFixed(2); // 税金=增值税+土地增值税+企业所得税
		const numberCicle3 = (Number(resultDataObject.sellingExpenses) + Number(resultDataObject.managementCost) + Number(resultDataObject.financialCost)).toFixed(2); // 期间费用=销售费用+管理费用+财务费用

		this.showCanvasObject = {
			circle1: (numberCicle1 / resultDataObject.salesRevenue * 100).toFixed(2),
			circle2: (numberCicle2 / resultDataObject.salesRevenue * 100).toFixed(2),
			circle3: (numberCicle3 / resultDataObject.salesRevenue * 100).toFixed(2)
		}
		console.log(resultDataObject);
		console.log(numberCicle1,numberCicle2,numberCicle3);
		console.log(this.showCanvasObject);
		this.setData({
			resultDataObject,
			viewListData,
			numberCicle1,
			numberCicle2,
			numberCicle3
		}, () => {
			setTimeout(() => {
				this.drawCircle1(this.showCanvasObject.circle1);
				this.drawCircle2(this.showCanvasObject.circle2);
				this.drawCircle3(this.showCanvasObject.circle3);
			}, 300)
		})

	},
	navigateToNext: function () {
		wx.navigateTo({
			url: '../swiperPage1/index?data='+JSON.stringify(this.callbackData)
		})
	},
	drawCircle1: function (n) {
		clearInterval(requestAnimationFrameName1);
		const that = this;
		let step = 1;
		var animation = function () {
			if (step <= n) {
				endAngle = step * Math.PI / 180 + startAngle;
				that.drawArc(ctx1, startAngle, endAngle, radius + 27 * 2, "#feca66");
				step += speed;
			} else {
				clearInterval(requestAnimationFrameName1);
			}
		};
		requestAnimationFrameName1 = setInterval(animation, animation_interval);
	},
	drawCircle2: function (n) {
		clearInterval(requestAnimationFrameName2);
		const that = this;
		let step = 1;
		var animation = function () {
			if (step <= n) {
				endAngle = step * Math.PI / 180 + startAngle;
				that.drawArc(ctx2, startAngle, endAngle, radius + 27, "#1c76e5");
				step += speed;
			} else {
				clearInterval(requestAnimationFrameName2);
			}
		};
		requestAnimationFrameName2 = setInterval(animation, animation_interval);
	},
	drawCircle3: function (n) {
		clearInterval(requestAnimationFrameName3);
		const that = this;
		let step = 1;
		var animation = function () {
			if (step <= n) {
				endAngle = step * Math.PI / 180 + startAngle;
				that.drawArc(ctx3, startAngle, endAngle, radius, "#fc519a");
				step += speed;
			} else {
				clearInterval(requestAnimationFrameName3);
			}
		};
		requestAnimationFrameName3 = setInterval(animation, animation_interval);
	},
	drawArc(ctx, s, e, radius, color) {
		// ctx.setFillStyle('white');
		// ctx.clearRect(0, 0, 240, 240);
		// ctx.draw();
		const x = this.data.canvasCircleWidth / 2,
			y = this.data.canvasCircleHeight / 2.4;

		ctx.setLineWidth(17);
		ctx.setLineCap('round');
		ctx.beginPath();
		ctx.setStrokeStyle(color);
		ctx.arc(x, y, radius, s, e, false);
		ctx.stroke();
		ctx.draw();
	}
})
