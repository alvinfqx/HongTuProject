var viewModel = function(){
	var self = this;
	var keyValue = request('keyValue');
//	alert(keyValue);;
	$(function() {
		//页面加载完成之后执行
		self.Initialization();
		self.EnclosureInitialization();
	});
	//获取产品基本信息初始化页面
	this.Initialization = function() {
	var fFinishWork = document.getElementById("fFinishWork");
//	console.log(fFinishWork)
	var fWorkPlan = document.getElementById("fWorkPlan");
	var fNeedHelp = document.getElementById("fNeedHelp");
	var fRemark = document.getElementById("fRemark");
	var fPersonName = document.getElementById("fPersonName");
	
		cm.ajax({
			url: "/AfterSaleManage/oa_workweekly/GetFormJson", 
			type: "POST",
			dataType: "json",
			data: {
				keyValue: keyValue
			},
			success: function(res) {
				console.log(res)
				var fFinishWorks = res.fFinishWork;
				var fWorkPlans = res.fWorkPlan;
				var fNeedHelps = res.fNeedHelp;
				var fRemarks = res.fRemark;
				var fPersonNames = res.fPersonName;
//				alert(fFinishWorks)
				fFinishWork.innerHTML = fFinishWorks;
				fWorkPlan.innerHTML = fWorkPlans;
				fNeedHelp.innerHTML = fNeedHelps;
				fRemark.innerHTML = fRemarks;
				fPersonName.innerHTML = fPersonNames;
//				console.log(JSON.stringify(res))
			},
			error: function(data) {
				console.log(data);
			}
		})
	}
	//初始化附件
	this.EnclosureInitialization = function(){
		var enclosure = document.getElementById("enclosure");
		cm.ajax({
			url: "/AfterSaleManage/oa_workweekly_attachment/GetListJson", 
			type: "POST",
			dataType: "json",
			data: {
				workweeklyid: keyValue
			},
			success: function(data) {
			var html = "";
			for(var i in data){
			var fileAbsuluteUrls = data[i].fileAbsuluteUrl;
				html+="<img  class ='enclosure img-rounded' src="+cm.domain+"/AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist="+fileAbsuluteUrls+"&token="+cm.token+">";
			}
		
			$("#id_apen").append(html);
				console.log(JSON.stringify(data));
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

			$('body').on('click','.enclosure' ,function(){
				window.open(this.src);
//				alert(JSON.stringify(this.src));
				
				
			});
};

var model = new viewModel();