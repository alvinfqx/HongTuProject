var viewModel = function(){
	var self = this;
	$(function () {
        self.InitialPage();
        self.GetGrid();
    });
    
    //服务类型参数
	var seviceData = cm.format.getParam('sevice_nature_as');
	var new_seviceData = cm.format.split_array(seviceData, 5);
	//工单状态参数
	var workstaus = cm.format.getParam('workstaus_as');
	var new_workstaus = cm.format.split_array(workstaus, 5);
	//服务类型参数html
	if(new_seviceData && new_seviceData.length > 0) {
		var html = '';
		for(var j = 0; j < new_seviceData.length; j++) {
			html += '<tr class="regular-radio">';
			if(j == 0) {
				html += '<td>信息服务类型:</td>';
				html += '<td><input type="radio" id="radio-1-' + new_seviceData.length + '" name="r1" checked="checked" value="全部"><label for="radio-1-' + new_seviceData.length + '">全部</label></td>';
			} else {
				html += '<td>&nbsp;</td>';
			}
			for(var i = 0; i < new_seviceData[j].length; i++) {
				html += '<td><input type="radio" id="radio-1-' + j + '-' + i + '" name="r1" value="' + new_seviceData[j][i].ItemValue + '">';
				html += '<label for="radio-1-' + j + '-' + i + '">' + new_seviceData[j][i].ItemName + '</label>';
				html += '</td>';
			}
			html += '</tr>';
		};
		$('#sevice_nature').html(html);
	};
	//工单状态参数html
	if(new_workstaus && new_workstaus.length > 0) {
		var html = '';
		for(var j = 0; j < new_workstaus.length; j++) {
			html += '<tr class="regular-radio">';
			if(j == 0) {
				html += '<td>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工单状态:</td>';
				html += '<td><input type="radio" id="radio-4-' + new_workstaus.length + '" name="r4" checked="checked" value="全部"><label for="radio-4-' + new_workstaus.length + '">全部</label></td>'
			} else {
				html += '<td>&nbsp;</td>';
			}
			for(var i = 0; i < new_workstaus[j].length; i++) {
				html += '<td><input type="radio" id="radio-4-' + j + '-' + i + '" name="r4" value="' + new_workstaus[j][i].ItemValue + '">';
				html += '<label for="radio-4-' + j + '-' + i + '">' + new_workstaus[j][i].ItemName + '</label>';
				html += '</td>';
			}
			html += '</tr>';
		};
		$('#workstaus_id').html(html);
	};
    
     this.show_hs = function() {
        if ($(".hs-block ").css('display') != "block") {
            $(".hs-block").css('display', "block");
            $(".file-block").css('display', "none");
        } else {
            $(".hs-block").css('display', "none");
            $(".file-block").css('display', "none");
        }
    }
    //初始化页面
     this.InitialPage = function() {
        //resize重设布局;
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#gridTable').setGridWidth(($('.gridPanel').width()));
                $('#gridTable').setGridHeight($(window).height() - 136.5);
            }, 200);
            e.stopPropagation();
        });
    }
    //加载表格
     this.GetGrid = function() {
        var selectedRowIndex = 0;
        var $gridTable = $('#gridTable');
        $gridTable.jqGrid({
            autowidth: true,
            height: $(window).height() - 136.5,
            url: "/AfterSaleManage/aw_ServiceManageAssignedToNeed/GetPageListJson",
            datatype: "json",
            colModel: [
                { label: '序号', name: 'workInfoId', index: 'workInfoId', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '受理流水号', name: 'slSeq', index: 'slSeq', width: 140, align: 'center', sortable: true },
                { label: '工单状态', name: 'workStatus', index: 'workStatus', width: 70, align: 'center', sortable: true },
                { label: '工作流状态', name: 'EntryState', index: 'EntryState', width: 75, align: 'center', sortable: true },
                { label: '客户单位', name: 'client', index: 'client', width: 180, align: 'center', sortable: true },
                { label: '联系人', name: 'linkman', index: 'linkman', width: 75, align: 'center', sortable: true },
                { label: '客户地址', name: 'address', index: 'address', width: 100, align: 'center', sortable: true },
                { label: '客户服务需求信息摘要', name: 'requirementShow', index: 'requirementShow', width: 200, align: 'center', sortable: true },
                { label: '产品大类', name: 'productType', index: 'productType', width: 110, align: 'center', sortable: true },
                 { label: '产品名称', name: 'productName', index: 'productName', width: 110, align: 'center', sortable: true },
                { label: '信息分类', name: 'infoType', index: 'infoType', width: 100, align: 'center', sortable: true },
                { label: '故障类型', name: 'serviceType', index: 'serviceType', width: 100, align: 'center', sortable: true },
                { label: '创建人名字', name: 'CreateUserName', index: 'CreateUserName', width: 100, align: 'center', sortable: true },
                { label: '接收人', name: 'Recipients', index: 'Recipients', width: 100, align: 'center', sortable: true },
                { label: '创建时间', name: 'CreateDate', index: 'CreateDate', width: 100, align: 'center', sortable: true },
            ],
            viewrecords: true,
            rowNum: 30,
            rowList: [30, 50, 100],
            pager: "#gridPager",
            sortname: 'createDate',
            sortorder: 'desc',
            rownumbers: true,
            shrinkToFit: false,
            gridview: true,
            onSelectRow: function () {
                selectedRowIndex = $('#' + this.id).getGridParam('selrow');
            },
            gridComplete: function () {
                $('#' + this.id).setSelection(selectedRowIndex, false);
            }
            ,
            loadComplete: function (data) {
                console.log(data);
            }
        });
        //查询条件
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
        //查询事件
        $("#btn_Search").click(function () {
            var queryJson = {
                condition: "keyword",
                keyword: $("#txt_Keyword").val()
            }
            $gridTable.jqGrid('setGridParam', {
                postData: { queryJson: JSON.stringify(queryJson) },
                page: 1
            }).trigger('reloadGrid');
        });
        //查询回车
        $('#txt_Keyword').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $('#btn_Search').trigger("click");
            }
        });
    }
    dialogOpenCommitForward = function (options) {
        Loading(true);
        var defaults = {
            id: null,
            width: "100px",
            height: "100px",
            url: '',
            shade: 0.3,
            btn: ['提交', '关闭', '转发'],
            callBack: null
        };
        var options = $.extend(defaults, options);
        var _url = options.url;
        var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
        var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
        top.layer.open({
            id: options.id,
            type: 2,
            shade: options.shade,
            title: options.title,
            fix: false,
            area: [_width, _height],
            content:top.mainPath +_url,
            btn: options.btn,
            yes: function () {
                options.callBack(options.id)
            },
            cancel: function () {
                if (options.cancel != undefined) {
                    options.cancel();
                }
                return true;

            }, btn3: function () {
                options.callBack2(options.id)
            },
            end: function () {
                $('#gridTable').trigger('reloadGrid');
            }
        });
    }

    //新增
     this.btn_add = function() {
        dialogOpenCommitForward({
            id: 'Form',
            url: '/hongtupage/view/aw_ServiceManageAssignedToNeed/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
            width: 'px',
            height: 'px',
            callBack: function (iframeId) {
                top.frames[iframeId].model.AcceptClick();
            },
            callBack2: function (iframeId) {
                top.frames[iframeId].model.workorderForward();
            }
        })
    }

    //高级查询事件
     this.submitdata = function() {
        var $gridTable = $('#gridTable');
        var queryJson = {
            condition: "topkeyword",
            "slSeq": $("#slSeq").val(),//服务单号
            "client": $("#client").val(),//客户单位
            "linkman": $("#linkman").val(),//联系人
            //            "receiverTime": $("#receiverTime").val(),//创建时间
            "CreateUserName": $("#CreateUserName").val(),//创建人
            "Recipients": $("#Recipients").val(),//接收人
            //"address": $("#address").val(),//地址
            "serviceType": $("input[name='r1']:checked").val(),//信息服务类型
            //            "sal": $("input[name='r2']:checked").val(),//SAL类型
            "workStatus": $("input[name='r4']:checked").val(),//工单
            "EntryState": $("input[name='r5']:checked").val(),//工作流状态
            "createStatus": $("input[name='r3']:checked").val(),//创建状态
            "logmin": $("#logmin").val(),
            "logmax": $("#logmax").val()
        }
        $gridTable.jqGrid('setGridParam', {
            postData: { queryJson: JSON.stringify(queryJson) },
            page: 1
        }).trigger('reloadGrid');
    };

    dialogOpenCommitForward = function (options) {
        Loading(true);
        var defaults = {
            id: null,
            width: "100px",
            height: "100px",
            url: '',
            shade: 0.3,
            btn: ['提交', '关闭', '转发'],
            callBack: null
        };
        var options = $.extend(defaults, options);
        var _url = options.url;
        var _width = top.$.windowWidth() > parseInt(options.width.replace('px', '')) ? options.width : top.$.windowWidth() + 'px';
        var _height = top.$.windowHeight() > parseInt(options.height.replace('px', '')) ? options.height : top.$.windowHeight() + 'px';
        top.layer.open({
            id: options.id,
            type: 2,
            shade: options.shade,
            title: options.title,
            fix: false,
            area: [_width, _height],
            content: top.mainPath +_url,
            btn: options.btn,
            yes: function () {
                options.callBack(options.id)
            },
            cancel: function () {
                if (options.cancel != undefined) {
                    options.cancel();
                }
                return true;

            }, btn3: function () {
                options.callBack2(options.id)
            },
            end: function () {
                $('#gridTable').trigger('reloadGrid');
            }
        });
    }

    //编辑
     this.btn_edit = function() {
        var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
        var workstatus = $('#gridTable').jqGridRowValue('workStatus');
        var slSeq = $('#gridTable').jqGridRowValue('slSeq');
        if (checkedRow(keyValue)) {

            if (workstatus == "现场实施") {

                dialogOpenCommitForward({
                    id: 'Form',
                    url: '/hongtupage/view/aw_ServiceManageAssignedToNeed/Form.html?keyValue=' + keyValue + '&slSeq=' + slSeq,
                    width: 'px',
                    height: 'px',
                    cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
                    callBack: function (iframeId) {
                        top.frames[iframeId].model.AcceptClick();
                    },
                    callBack2: function (iframeId) {
                        top.frames[iframeId].model.workorderForward();
                    }
                })
            }
            else
            {
                dialogOpenContent({
                    id: 'Form',
                    url: '/hongtupage/view/customerWorkinfo/Form.html?keyValue=' + keyValue,
                    width: 'px',
                    height: 'px',
                    cancel: function() {
						//删除穿梭框session
						sessionStorage.removeItem("tranfer_key")
					},
                    callBack: function (iframeId) {
                        top.frames[iframeId].model.AcceptClick();
                    }
                })

            }
          
        }
    }
    //删除
     this.btn_delete = function() {
        var keyValue = $('#gridTable').jqGridRowValue('workInfoId');
        if (keyValue) {
            $.RemoveForm({
                url: '/AfterSaleManage/aw_ServiceManageAssignedToNeed/RemoveForm',
                param: { keyValue: keyValue },
                success: function (data) {
                    $('#gridTable').trigger('reloadGrid');
                }
            })
        } else {
            dialogMsg('请选择需要删除的工作任务表！', 0);
        }
    }
};

var model = new viewModel();