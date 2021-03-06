﻿var keyValue = request('keyValue');
var mul_select;
var slseq = request('slSeq');

$(function() {
	Gettotaldata()
	GetUserAvatar()
	//GetProgress()
	/* GetImplementProgress()*/

	var $li = $('#tab>li');
	var $div = $('#main_body>section');

	$li.click(function() {
		var $this = $(this);
		var $i = $this.index();
		$li.removeClass();
		$this.addClass('current');
		$div.css('display', 'none');
		$div.eq($i).css('display', 'block');
	});

	//add--zhu
	$('body').on('click', function(e) {
		//获得哪个标签被点击
		var which_item = $(e.target)
		//弹出放大显示图片
		var img = which_item.attr('src')
		if(img != null) {
			popimg(img)
		}
	})

	var appElement = document.querySelector('div .inmodal');

	initControl();
});

//add----zhu
function popimg(img) {
	$('.popwindow').addClass('popwindow-show');
	$(".popwindow").find("img").attr("src", img);
	$(".popwindow").find("img").css("visibility", "inherit");
}

function exit_img() {
	$('.popwindow').removeClass('popwindow-show');
}

//初始化控件
function initControl() {
	//产品型号
	$("#productType").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "product_type_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});
	//工单状态
	$("#workStatus").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "workstaus_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});
	//信息分类
	$("#infoType").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "info_type_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//信息来源
	$("#infoSource").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "info_resource_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务性质
	$("#serviceNature").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "sevice_nature_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务类型
	$("#serviceType").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "service_type_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务方式
	$("#serviceMode").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "service_mode_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务级别
	$("#serviceClass").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "servie_class_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//是否索赔
	$("#isNeededClaim").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "yes_or_no_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//是否出差
	$("#isNeededTrip").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "yes_or_no_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//过程状态
	$("#serviceStatus").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "norm_or_abnorm_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//结果确认
	$("#resultConfirm").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "done_or_working"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务及时性
	$("#serviceInTime").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "satisfy_degree_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务规范性
	$("#serviceNormal").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "satisfy_degree_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	//服务有效性
	$("#serviceEffective").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "satisfy_degree_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	$("#assistantDept").ComboBox({
		url: " /SystemManage/DataItemDetail/GetDataItemListJson",
		param: {
			EnCode: "rec_dept_as"
			//  EnCode: "rec_dept_as"
		},
		id: "ItemValue",
		text: "ItemName",
		description: "==请选择==",
		height: "200px"
	});

	$("#assistant").ComboBoxTree({
		url: " /BaseManage/User/GetTreeJson",
		param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
		description: "==请选择==",
		height: "200px",
		allowSearch: true
	});

	//接单人
	$("#acceptor").ComboBoxTree({
		url: " /BaseManage/User/GetTreeJson",
		param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
		description: "==请选择==",
		height: "200px",
		allowSearch: true
	});

	//信息受理人
	$("#receiver").ComboBoxTree({
		url: " /BaseManage/User/GetTreeJson",
		param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
		description: "==请选择==",
		height: "200px",
		allowSearch: true
	});

	//派工人员
	/*  $("#dispatchingPerson").ComboBoxTree({
          url: " /BaseManage/User/GetTreeJson",
          description: "==请选择==",
          height: "200px",
          allowSearch: true
      });
  
     
  
      //服务人员
      $("#serviceStaff").ComboBoxTree({
          url: " /BaseManage/User/GetTreeJson",
          description: "==请选择==",
          height: "200px",
          allowSearch: true
      });*/

	//回访人员
	$("#returnVisitStaff").ComboBoxTree({
		url: " /BaseManage/User/GetTreeJson",
		param: {
			OrganizeId:sessionStorage.getItem("companyId")		
      },
		description: "==请选择==",
		height: "200px",
		allowSearch: true
	});

	//获取表单
	/* if (!!keyValue) {
	     $.SetForm({
	         url: " /AfterSaleManage/aw_workinfo/GetFormJson",
	         param: {
	             keyValue: keyValue
	         },
	         success: function (data) {
	             $("#form1").SetWebControls(data);
	         }
	     })
	 }*/
}

//实施人员进度
function GetImplementProgress() {

	/*  cm.ajax({
	      url: " /AfterSaleManage/aw_workinfo/GetImplementWithAtttachementList",
	      type: "POST",
	      dataType: "json",
	      data: {
	          "keyValue": keyValue
	      },
	      success: function (data) {
	          console.log("GetImplementProgress")
	      },
	      error: function (data) {
	          console.log(data)
	      }
	  });*/

	cm.ajax({
		url: " /AfterSaleManage/aw_workinfo/GetAwWorkInfoTreeJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {
			console.log(data)
			var time_html = " ";
			$.each(data, function(i, n) {
				var finis_d = n.FinishedDate || "暂无时间"
				time_html += '<li>'
				time_html += '<i class="fa fa-envelope bg-blue"></i>'
				time_html += '<div class="timeline-item">'
				time_html += '<span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间:&nbsp;' + finis_d + '</span>'
				time_html += '<h3 class="timeline-header">工作状态:&nbsp;' + n.StateID + '</h3>'
				time_html += '<div class="timeline-body">'
				//time_html+='<h6>工作任务名: test</h6>'
				time_html += '<p>接收人名字:&nbsp;' + n.Recipients + '</p>'
				time_html += '<p>填写内容:&nbsp;' + n.EntryContent + '</p>'

				time_html += '<img src=" /AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg&token="' + cm.token;
				time_html += '" alt="..." class="margin" style="width: 150px;height: 100px;">';
				time_html += '</div>'
				time_html += '</div>'
				time_html += '</li>'
			});
			$(".timeline_Implements").append(time_html);
		},
		error: function(data) {
			console.log(data)
		}

	});

}

function Gettotaldata() {
	cm.ajax({
		url: " /AfterSaleManage/aw_workinfo/GetFormJsonWithEntity",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": keyValue
		},
		success: function(data) {
			console.log(keyValue);
			console.log(data);

			cm.ajax({
				url: " /AfterSaleManage/aw_workinfo/GetImplementUsers",
				type: "POST",
				dataType: "json",
				data: {
					"keyValue": keyValue
				},
				success: function(data2) {
					var html = ''
					$.each(data2, function(i, n) {
						html += '<option value="' + n.id + '">' + n.name + '</option>'
					})

					$('#dispatchingPerson').append(html)
					$('#serviceStaff').append(html)
					$('#assistant').append(html)
					$('#acceptor').append(html)

					var initvalue = data.baseEntity.dispatchingPerson;
					//  initvalue = initvalue + ",System,ccccccc," + data.baseEntity.serviceStaff + ",";
					console.log("*******mulChoise");
					console.log(initvalue);
					if(initvalue != null)
						$("#dispatchingPerson").select2().select2("val", initvalue.split(';'));
					else
						$("#dispatchingPerson").select2();

					var initvalue = data.baseEntity.serviceStaff;
					//  initvalue = initvalue + ",System,ccccccc," + data.baseEntity.serviceStaff + ",";
					console.log("*******mulChoise");
					console.log(initvalue);
					if(initvalue != null)
						$("#serviceStaff").select2().select2("val", initvalue.split(';'));
					else
						$("#serviceStaff").select2();

					var initvalue = data.baseEntity.assistant;
					//  initvalue = initvalue + ",System,ccccccc," + data.baseEntity.serviceStaff + ",";
					console.log("*******mulChoise2");
					console.log(initvalue);
					if(initvalue != null)
						$("#assistant").select2().select2("val", initvalue.split(';'));
					else
						$("#assistant").select2();

					var initvalue = data.baseEntity.acceptor;
					//  initvalue = initvalue + ",System,ccccccc," + data.baseEntity.serviceStaff + ",";
					console.log("*******acceptorMulChoise");
					console.log(initvalue);
					if(initvalue != null)
						$("#acceptor").select2().select2("val", initvalue.split(';'));
					else
						$("#acceptor").select2();

				},
				error: function(data2) {
					console.log(data2)
				}
			});

			//
			$("#form").SetWebControls(data.baseEntity);
			var slseq_html = '<h1>工单号:&nbsp;' + data.baseEntity.slSeq + '&nbsp;[' + data.baseEntity.workStatus + ']</h1>';
			$("#slSeqStr").append(slseq_html);

			var aw_rqlist_data = data.aw_requirementEntityList
			var aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.aw_requirement_attachmentList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.requirementInfo + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});
			console.log(aw_rqlist_html)
			$("#aw_requirementEntityList").append(aw_rqlist_html);

			//service Desc
			console.log("service Desc");
			aw_rqlist_data = data.aw_servicedescEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.attachementList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.serviceDesc + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			$("#aw_servicedescEntityList").append(aw_rqlist_html)

			//aw_selfSoluctionEntityList
			aw_rqlist_data = data.aw_selfhelp_solutionEntityList
			aw_rqlist_html = '';
			if(aw_rqlist_data == null || aw_rqlist_data.length == 0) {
				visi_data_html = '<h5>无</h5>'
			} else {
				$.each(aw_rqlist_data, function(i, n) {
					var aw_rqlist_img = '';
					var aw_relist_imgdata = n.attachmentList
					$.each(aw_relist_imgdata, function(i, n) {
						aw_rqlist_img += '<li>'
						if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
							aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
						} else {
							aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

						}
						aw_rqlist_img += '<div class="mailbox-attachment-info">'
						aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
						aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
						aw_rqlist_img += '</div>'
						aw_rqlist_img += '</li>'
					})
					aw_rqlist_html += '<div class="file-item">'
					aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
					aw_rqlist_html += '					<div class="file-element-data ">'
					aw_rqlist_html += '						<p>' + n.selfHelpSoluction + '</p>'
					aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
					aw_rqlist_html += aw_rqlist_img
					aw_rqlist_html += '				</ul>'
					aw_rqlist_html += '				</div>'
					aw_rqlist_html += '				</div>'
				});
			}

			$("#aw_selfhelp_solutionEntityList").append(aw_rqlist_html)

			//aw_causeconclusionEntityList
			aw_rqlist_data = data.aw_causeconclusionEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.aw_cause_attachementList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.causeConclusion + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			$("#aw_causeconclusionEntityList").append(aw_rqlist_html)

			//aw_implementoperationhistoryEntityList
			aw_rqlist_data = data.aw_implementoperationhistoryEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.attachmentList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.content + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			$("#aw_implementsEntityList").append(aw_rqlist_html)

			//aw_solutionEntityList
			aw_rqlist_data = data.aw_solutionEntityList
			aw_rqlist_html = '';

			$.each(aw_rqlist_data, function(i, n) {
				var aw_rqlist_img = '';
				var aw_relist_imgdata = n.aw_solution_attachmentEntityList
				$.each(aw_relist_imgdata, function(i, n) {
					aw_rqlist_img += '<li>'
					if((/\.{0,1}(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(n.attacheType.toLowerCase()))) {
						aw_rqlist_img += '<img src="' + cm.domain + n.fileStorePath + '&token=' + cm.token + '" alt="' + n.attacheName + '" >'
					} else {
						aw_rqlist_img += '<span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>'

					}
					aw_rqlist_img += '<div class="mailbox-attachment-info">'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="mailbox-attachment-name" download="' + n.attacheName + '"><i class="fa fa-paperclip"></i>' + n.attacheName + '</a>'
					aw_rqlist_img += '<a href="' + n.fileStorePath +'&filename=' + n.attacheName + '&needDownload=true&token='+ cm.token + '" class="btn btn-default btn-xs pull-right" download="' + n.attacheName + '"><i class="fa fa-cloud-download"></i></a>'
					aw_rqlist_img += '</div>'
					aw_rqlist_img += '</li>'
				})
				aw_rqlist_html += '<div class="file-item">'
				aw_rqlist_html += '					<div class="file-item_time">' + n.CreateDate + '</div>'
				aw_rqlist_html += '					<div class="file-element-data ">'
				aw_rqlist_html += '						<p>' + n.solution + '</p>'
				aw_rqlist_html += '						<ul class="mailbox-attachments clearfix">'
				aw_rqlist_html += aw_rqlist_img
				aw_rqlist_html += '				</ul>'
				aw_rqlist_html += '				</div>'
				aw_rqlist_html += '				</div>'
			});

			/*
			<ul class="mailbox-attachments clearfix">
			                                                    <li>

			                                                        <img src="img/user2-160x160.jpg" />
			                                                        <div class="mailbox-attachment-info">
			                                                            <a href="#" class="mailbox-attachment-name"><i class="fa fa-paperclip"></i> Sep2014fdafafdafaf-report.pdf</a>
			                                                            <a href="#" class="btn btn-default btn-xs pull-right"><i class="fa fa-cloud-download"></i></a>
			                                                        </div>
			                                                    </li>
			                                                    <li>
			                                                        <!--<span class="mailbox-attachment-icon"><i class="fa fa-file-pdf-o"></i></span>-->
			                                                        <span class="mailbox-attachment-icon"><i class="fa fa-file-word-o"></i></span>
			                                                        <div class="mailbox-attachment-info">
			                                                            <a href="#" class="mailbox-attachment-name"><i class="fa fa-paperclip"></i> Sep2014-report.pdf</a>
			                                                            <a href="#" class="btn btn-default btn-xs pull-right"><i class="fa fa-cloud-download"></i></a>
			                                                        </div>
			                                                    </li>
			                                                </ul>

			*/

			$("#aw_solutionEntityList").append(aw_rqlist_html)

			var visitentity_data = data.aw_return_visitEntityList

			var visi_head_html = '',
				visi_body_html = '',
				visi_data_html = ''

			if(visitentity_data != null) {

				if(visitentity_data.length == 0) {
					visi_data_html = '<h5>暂无回访记录</h5>'
				} else {
					$.each(visitentity_data, function(i, n) {
						visi_head_html += '<li class="' + (i == 0 ? "active" : "") + '">'
						visi_head_html += '<a href="#' + i + '" data-toggle="tab">第' + (i + 1) + '次</a>'
						visi_head_html += '</li>'

						visi_body_html += '<div class="tab-pane ' + (i == 0 ? "active" : "") + ' " id="' + i + '">'
						visi_body_html += '<div class="form-group">'

						visi_body_html += '<label class="col-sm-2 ">回访人员</label>'
						visi_body_html += '<div class="col-sm-2">'

						visi_body_html += '<div>' + n.CreateUserName + '</div>'
						visi_body_html += '</div>'

						visi_body_html += '<label class="col-sm-2 ">回访时间</label>'
						visi_body_html += '<div class="col-sm-2">'
						visi_body_html += '<div>' + n.returnVisitTime + '</div>'
						visi_body_html += '</div>'
						visi_body_html += '</div>'
						visi_body_html += '<div class="form-group">'
						visi_body_html += '<label class="col-sm-2 ">服务及时性</label>'
						visi_body_html += '<div class="col-sm-2">'
						visi_body_html += '<div>' + n.serviceInTime + '</div>'
						visi_body_html += '</div>'
						visi_body_html += '<label class="col-sm-2">服务规范性</label>'
						visi_body_html += '<div class="col-sm-2">'
						visi_body_html += '<span>' + n.serviceNormal + '</span>'
						visi_body_html += '</div>'

						visi_body_html += '<label class="col-sm-2">服务有效性</label>'
						visi_body_html += '<div class="col-sm-2">'
						visi_body_html += '<div>' + n.serviceEffective + '</div>'
						visi_body_html += '</div>'

						visi_body_html += '</div>'

						visi_body_html += '<div class="form-group">'

						visi_body_html += '<label class="col-sm-1">客户意见</label>'
						visi_body_html += '<div class="col-sm-10">'
						visi_body_html += '<div>' + (n.clientComments || "无") + '</div>'
						visi_body_html += '</div>'
						visi_body_html += '</div>'

						visi_body_html += '</div>'
					});
					visi_data_html += '<ul class="nav nav-tabs">'
					visi_data_html += visi_head_html
					visi_data_html += '</ul>'
					visi_data_html += '<div class="tab-content">'
					visi_data_html += visi_body_html
					visi_data_html += '</div>'
				}

			} else {
				visi_data_html = '<h5>暂无回访记录</h5>'

			}

			$("#visitentity").append(visi_data_html)

			//派工人员

		},
		error: function(data) {
			console.log(data);

		}
	})
}

//成员列表
function GetUserAvatar() {
	cm.ajax({
		url: " /AfterSaleManage/aw_workinfo/GetAwWrokUserJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {
			console.log("getUserAvatar")
			console.log(data)
			var avatar_html = " ";
			$.each(data, function(i, n) {
				/*avatar_html += '<div class="avatar_item ">';
				avatar_html += '<h6 style="display: none; ">' + n.userid + '</h6>';
				avatar_html += '<h6 style="display: none; ">' + n.Roleid + '</h6>';
				avatar_html += '<div class="avatar_item_ld ">';
				avatar_html += '<h3>' + n.fullname + '</h3>';
				avatar_html += '<p>' + n.description + '</p>';
				avatar_html += '</div>';
				avatar_html += '</div>';*/

				avatar_html += '<li>'
				avatar_html += '<img src=" /AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg&token="' + cm.token;
//				avatar_html += cm.token;
				avatar_html += '<a class="users-list-name" href="#">' + n.realname + '</a>'
				avatar_html += '<span class="users-list-date">' + n.fullname + '</span>'
				avatar_html += '</li>'
			});
			$(".users-list").append(avatar_html);
		},
		error: function(data) {
			console.log(data)
		}
	});
}

function GetProgress() {
	// alert(slseq);
	cm.ajax({
		url: " /AfterSaleManage/aw_workinfo/GetAwWorkInfoTreeJson",
		type: "POST",
		dataType: "json",
		data: {
			"keyValue": slseq
		},
		success: function(data) {
			console.log(data)
			var time_html = " ";
			$.each(data, function(i, n) {
				var finis_d = n.FinishedDate || "暂无时间"
				time_html += '<li>'
				time_html += '<i class="fa fa-envelope bg-blue"></i>'
				time_html += '<div class="timeline-item">'
				time_html += '<span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间:&nbsp;' + finis_d + '</span>'
				time_html += '<h3 class="timeline-header">工作状态:&nbsp;' + n.StateID + '</h3>'
				time_html += '<div class="timeline-body">'
				//time_html+='<h6>工作任务名: test</h6>'
				time_html += '<p>接收人名字:&nbsp;' + n.Recipients + '</p>'
				time_html += '<p>填写内容:&nbsp;' + n.EntryContent + '</p>'
				var aw_relist_imgdata = n.attachmentList
				for(var j = 0; j < aw_relist_imgdata.length; j++) {
					time_html += '<img src="' + cm.domain + aw_relist_imgdata[j].fileStorePath + '&token=' + cm.token + '"alt="..." class="margin" style="width: 150px;height: 100px;">'
				}
				//  time_html += '<img src=" /AfterSaleManage/aw_workinfo/getMyPhoto?strPathIsExist=e://MES_CAT//TankPic//SL20170921084025//SL20170921084025_20170921084032636.jpg" alt="..." class="margin" style="width: 150px;height: 100px;">'
				time_html += '</div>'
				time_html += '</div>'
				time_html += '</li>'
			});
			$("#progess").append(time_html);
		},
		error: function(data) {
			console.log(data)
		}

	});
}
/*
 <li>
                        <i class="fa fa-envelope bg-blue"></i>
                        <div class="timeline-item">
                            <span class="time"><i class="fa fa-clock-o"></i>&nbsp;完成时间: 2017-8-16 17:11:14</span>
                            <h3 class="timeline-header">工作任务ID: w002333</h3>
                            <div class="timeline-body">
                                <h6>工作任务名: test</h6>
                                <p>填写内容: test</p>
                                <p>接收人名字: 1</p>
                                <img src="http://placehold.it/150x100" alt="..." class="margin">
                                <img src="http://placehold.it/150x100" alt="..." class="margin">
                                <img src="http://placehold.it/150x100" alt="..." class="margin">
                                <img src="http://placehold.it/150x100" alt="..." class="margin">
                            </div>
                        </div>
                    </li>
 * */

function show_msage(target) {

	var $up_data = $(target).parent().parent().parent().find(".up-data")
	var $dropzone = $up_data.find(".dropzone")
	var $up_data_msg = $up_data.find(".up-data-msg")
	if($up_data.css("display") == "none") {
		//$up_data.show();
		$up_data.css("display", "block");
		$up_data_msg.css('display', 'block');
		$dropzone.css('display', 'block');
	} else {
		//$up_data.hide();
		$up_data.css("display", "none");
		$up_data_msg.css('display', 'none');
		$dropzone.css('display', 'none');
	}
}

function up_form_data() {

	//    dialogClose();
	/*if(!$('#form').Validform()) {
	    return false;
	}*/
	alert("commit up_form_data");
	var postData = $("#form").GetWebControls();
	console.log(postData)

	cm.ajax({
		//受理客户需求
		url: " /AfterSaleManage/aw_CustomerAddNewRequire/SaveFormData?keyValue=" + keyValue, //回访
		//填写最终实施结果
		//  url: "http://localhost:4066/AfterSaleManage/aw_ServiceManageAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

		//  url: "http://localhost:4066/AfterSaleManage/aw_AftersalesAssignedToNeed/SaveFormData?keyValue=SL_20170908001", //提出解决方案
		// url: "http://localhost:4066/AfterSaleManage/aw_CustomerAssignedToNeed/SaveFormData?keyValue=" + keyValue,   //回访

		type: "POST",
		dataType: "json",
		data: postData,
		success: function(data) {
			console.log(data);
		},
		error: function(data) {
			console.log(data);
		}
	})
}