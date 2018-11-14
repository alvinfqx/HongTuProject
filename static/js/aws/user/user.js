var viewModel = function(){
	var self = this;
	$(function () {
        self.InitialPage();
        self.GetGrid();
    });
    //初始化页面
    this.InitialPage = function() {
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#gridTable').setGridWidth(($('.gridPanel').width()));
                $("#gridTable").setGridHeight($(window).height() - 136.5);
            }, 200);
            e.stopPropagation();
        });
    }
    //加载表格
    this.GetGrid = function() {
        var selectedRowIndex = 0;
        var $gridTable = $('#gridTable');
        $gridTable.jqGrid({
            url: "/BaseManage/User/GetPageListOrganize",
            datatype: "json",
            postData: {isfilter:'true'},
            height: $(window).height() - 136.5,
            autowidth: true,
            colModel: [
                { label: '主键', name: 'UserId', hidden: true },
                { label: '账户', name: 'Account', index: 'Account', width: 100, align: 'left' },
                { label: '姓名', name: 'RealName', index: 'RealName', width: 100, align: 'left' },
                {
                    label: '性别', name: 'Gender', index: 'Gender', width: 45, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        return cellvalue == 1 ? "男" : "女";
                    }
                },
                { label: '手机', name: 'Mobile', index: 'Mobile', width: 100, align: 'center' },
                {
                    label: '公司', name: 'OrganizeId', index: 'OrganizeId', width: 200, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        return top.clientorganizeData[cellvalue] == null ? "" : top.clientorganizeData[cellvalue].FullName;
                    }
                },
                {
                    label: '部门', name: 'DepartmentId', index: 'DepartmentId', width: 100, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        return top.clientdepartmentData[cellvalue] == null ? "" : top.clientdepartmentData[cellvalue].FullName;
                    }
                },
                { label: '岗位', name: 'DutyName', index: 'DutyName', width: 100, align: 'left' },
                { label: '职位', name: 'PostName', index: 'PostName', width: 100, align: 'left' },
                {
                    label: '角色', name: 'RoleId', index: 'RoleId', width: 100, align: 'center',
                    formatter: function (cellvalue, options, rowObject) {
                        return top.clientroleData[cellvalue] == null ? "" : top.clientroleData[cellvalue].FullName;
                    }
                },
                { label: '主管', name: 'Manager', index: 'Manager', width: 100, align: 'left' },
                {
                    label: "状态", name: "EnabledMark", index: "EnabledMark", width: 50, align: "center",
                    formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue == 1) {
                            return '<span onclick=\"btn_disabled(\'' + rowObject.UserId + '\')\" class=\"label label-success\" style=\"cursor: pointer;\">正常</span>';
                        } else if (cellvalue == 0) {
                            return '<span onclick=\"btn_enabled(\'' + rowObject.UserId + '\')\" class=\"label label-default\" style=\"cursor: pointer;\">禁用</span>';
                        }
                    }
                },
                { label: "备注", name: "Description", index: "Description", width: 200, align: "left" }
            ],
            viewrecords: true,
            rowNum: 30,
            rowList: [30, 50, 100],
            pager: "#gridPager",
            sortname: 'OrganizeId asc,CreateDate desc',
            rownumbers: true,
            shrinkToFit: false,
            gridview: true,
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
            },
            gridComplete: function () {
                $("#" + this.id).setSelection(selectedRowIndex, false);
            }
        });
        $gridTable.authorizeColModel()
        //查询条件
        $("#queryCondition .dropdown-menu li").click(function () {
            var text = $(this).find('a').html();
            var value = $(this).find('a').attr('data-value');
            $("#queryCondition .dropdown-text").html(text).attr('data-value', value)
        });
        //查询事件
        $("#btn_Search").click(function () {
            var queryJson = {
                condition: $("#queryCondition").find('.dropdown-text').attr('data-value'),
                keyword: $("#txt_Keyword").val()
            }
            $gridTable.jqGrid('setGridParam', {
                postData: { queryJson: JSON.stringify(queryJson), isfilter: $("#cbx_filter").is(':checked') }, page: 1
            }).trigger('reloadGrid');
        });
        //查询回车
        $('#txt_Keyword').bind('keypress', function (event) {
            if (event.keyCode == "13") {
                $('#btn_Search').trigger("click");
            }
        });
    }
    //新增
    this.btn_add = function() {
        dialogOpen({
            id: "Form",
            title: '添加用户',
            url: '/webpage/system/user_flowForm.html?keyValue=' + '',
            width: "750px",
            height: "550px",
            callBack: function (iframeId) {
                top.frames[iframeId].model.AcceptClick();
            }
        });
    };
    //编辑
    this.btn_edit = function() {
        var keyValue = $("#gridTable").jqGridRowValue("UserId");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "Form",
                title: '修改用户',
                url: '/webpage/system/user_flowForm.html?keyValue=' + keyValue,
                width: "750px",
                height: "550px",
                callBack: function (iframeId) {
                    top.frames[iframeId].model.AcceptClick();
                }
            });
        }
    }
    //删除
    this.btn_delete = function() {
        var keyValue = $("#gridTable").jqGridRowValue("UserId");
        if (keyValue) {
            $.RemoveForm({
                url: "/BaseManage/User/RemoveForm",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        } else {
            dialogMsg('请选择需要删除的用户！', 0);
        }
    }
    //重置密码
    this.btn_revisepassword = function() {
        var keyValue = $("#gridTable").jqGridRowValue("UserId");
        var Account = $("#gridTable").jqGridRowValue("Account");
        var RealName = $("#gridTable").jqGridRowValue("RealName");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "RevisePassword",
                title: '重置密码',
                url: '/webpage/system/user_revisePassword.html?keyValue=' + keyValue + "&Account=" + escape(Account) + '&RealName=' + escape(RealName),
                width: "500px",
                height: "260px",
                callBack: function (iframeId) {
                    top.frames[iframeId].model.AcceptClick();
                }
            });
        }
    }
    //导出
    this.btn_export = function() {
        location.href = cm.domain + "/BaseManage/User/ExportUserList?token=" + cm.token;
    }
    //禁用
    this.btn_disabled = function(keyValue) {
        if (keyValue == undefined) {
            keyValue = $("#gridTable").jqGridRowValue("UserId");
        }
        if (checkedRow(keyValue)) {
            $.ConfirmAjax({
                msg: "注：您确定要【禁用】账户？",
                url: "/BaseManage/User/DisabledAccount",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        }
    }
    //启用
    this.btn_enabled = function(keyValue) {
        if (keyValue == undefined) {
            keyValue = $("#gridTable").jqGridRowValue("UserId");
        }
        if (checkedRow(keyValue)) {
            $.ConfirmAjax({
                msg: "注：您确定要【启用】账户？",
                url: "/BaseManage/User/EnabledAccount",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#gridTable").trigger("reloadGrid");
                }
            })
        }
    }
    //用户授权
    this.btn_authorize = function() {
        var keyValue = $("#gridTable").jqGridRowValue("UserId");
        var RealName = $("#gridTable").jqGridRowValue("RealName");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "AllotAuthorize",
                title: '用户授权 - ' + RealName,
                url: '/webpage/system/user_allotAuthorize.html?userId=' + keyValue,
                width: "700px",
                height: "690px",
                btn: null
            });
            
        }
    }
    //IP过滤
    this.btn_ipfilter = function() {
        var keyValue = $("#gridTable").jqGridRowValue("UserId");
        var FullName = $("#gridTable").jqGridRowValue("RealName");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "FilterIP",
                title: 'TCP/IP 地址访问限制 - ' + FullName,
                url: '/webpage/system/role_filterIP.html?objectId=' + keyValue + '&objectType=Uesr',
                width: "600px",
                height: "400px",
                btn: null
            });
        }
    }
    //时段过滤
    this.btn_timefilter = function() {
        var keyValue = $("#gridTable").jqGridRowValue("UserId");
        var FullName = $("#gridTable").jqGridRowValue("RealName");
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: "FilterTime",
                title: '时段访问过滤 - ' + FullName,
                url: '/webpage/system/role_filterTime.html?objectId=' + keyValue + '&objectType=Uesr',
                width: "640px",
                height: "480px",
                callBack: function (iframeId) {
                    top.frames[iframeId].model.AcceptClick();
                }
            });
        }
    }
};
$('.toolbar').authorizeButton();
var model = new viewModel();