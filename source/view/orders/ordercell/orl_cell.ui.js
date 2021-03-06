var page = sm("do_Page");
var root = ui("$");
var $U = require("url");
var nf = sm("do_Notification");
var open = require("open");
root.setMapping({
	"buy_time.text":"shopTime",
	"buy_type.text":"stateStr",
	"busniess_name.text":"title",
	"buyprice.text":"price",
	"buyprice.fontColor":"pricecolor",
	"taiwei_renshu.text":"same",
	"do_Button_1.text":"btn1Text",
	"do_Button_1.visible":"btn1Vis",
	"do_Button_1.tag":"btn1Tag",
	"do_Button_2.text":"btn2Text",
	"do_Button_2.visible":"btn2Vis",
	"do_Button_2.tag":"btn2Tag"
});
var buttonA = mm("do_Animation", "BUTTONTOUCHDOWNS", "app");
var btn1 = ui("do_Button_1");
var btn2 = ui("do_Button_2");
btn1.on("touch",function(){
	this.animate(buttonA,function(){
		operate(this.tag);
	});
});
btn2.on("touch",function(){
	this.animate(buttonA,function(){
		operate(this.tag);
	});
});

function operate(param){
	var data = JSON.parse(param);  //type,no
	switch(data.type){
		case -1:  //退款
			open.start("source://view/orders/userdrawback.ui",data.no);
			break;
		case 0:  //删除
			nf.confirm("确认取消订单？", "取消订单", "确认", "取消", function(index, e) {
				if(index==1){
					delete_http.url = $U.token($U.url.appOrderDelete,"user")+"&orderno="+data.no; // 请求的 URL
					delete_http.request();
				}
			});
			break;
		case 1:  //付款
			open.start("source://view/reservation/reservation_sureorder.ui",data.no);
			break;
		case 9:  //评价
			open.start("source://view/orders/order_discuss.ui",data.no);
			break;
	};
}

//删除订单
var delete_http = mm("do_Http");
delete_http.method = "POST";// GET | POST
delete_http.timeout = 60000; // 超时时间 : 单位 毫秒
delete_http.contentType = "application/json"; // Content-Type
delete_http.on("success", function(databus) {
	if(databus==-1){
		nf.toast("删除订单失败");
	}else{
		page.fire("orderRefresh");
	}
});