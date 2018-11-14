var viewModel = function(){
	var self = this;
	$(function () {
        self.initialPage();
        self.GetGrid();
    });
    //重设(表格)宽高
     this.initialPage = function() {
        //resize重设(表格、树形)宽高
        $(window).resize(function (e) {
            window.setTimeout(function () {
                $('#gridTable').setGridWidth(($('.gridPanel').width()));
                $("#gridTable").setGridHeight($(window).height() - 108.5);
            }, 200);
            e.stopPropagation();
        });
    }
    //加载表格
     this.GetGrid = function() {
        var selectedRowIndex = 0;
        var $gridTable = $('#gridTable');
        $gridTable.jqGrid({
            url: "/AfterSaleManage/aw_knowledge_dataitem/GetPageListJson",
            datatype: "json",
            height: $(window).height() - 108.5,
            autowidth: true,
            colModel: [
                { label: '主键', name: 'Item_class_Id', index: 'Item_class_Id', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '上级分类ID', name: 'ParentId', index: 'ParentId', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '分类Code', name: 'ItemCode', index: 'ItemCode', width: 250, align: 'center', sortable: true },
                { label: '分类名', name: 'ItemName', index: 'ItemName', width: 250, align: 'center', sortable: true },
                { label: '是否用户可见', name: 'isAuthorizeToClient', index: 'isAuthorizeToClient', width: 100, align: 'center', sortable: true },
                { label: '', name: 'IsTree', index: 'IsTree', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '', name: 'IsNav', index: 'IsNav', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '', name: 'SortCode', index: 'SortCode', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '', name: 'DeleteMark', index: 'DeleteMark', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '', name: 'EnabledMark', index: 'EnabledMark', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '', name: 'Description', index: 'Description', width: 100, align: 'center', sortable: true, hidden: true },
                { label: '创建人', name: 'CreateUserName', index: 'CreateUserName', width: 100, align: 'center', sortable: true },
                 { label: '创建日期', name: 'CreateDate', index: 'CreateDate', width: 120, align: 'center', sortable: true },
              
                { label: '', name: 'organizationid', index: 'organizationid', width: 100, align: 'center', sortable: true, hidden: true },
                
            ],
            viewrecords: true,
            treeGrid: true,
            treeGridModel: "nested",
            //ExpandColumn: "EnCode",
            rowNum: "all",
            pager: "#gridPager",
            sortname: 'CreateDate',
            sortorder: 'desc',
            rownumbers: true,
            onSelectRow: function () {
                selectedRowIndex = $("#" + this.id).getGridParam('selrow');
            },
            gridComplete: function () {
                $("#" + this.id).setSelection(selectedRowIndex, false);
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
    //新增
     this.btn_add = function() {
        dialogOpen({
            id: 'Form',
            title: '添加知识库',
            url: '/hongtupage/view/aw_knowledge_dataitem/Form.html?keyValue=" "',
            width: "750px",
            height: "500px",
            callBack: function (iframeId) {
                top.frames[iframeId].model.AcceptClick();
            }
        });
    }
    //编辑
     this.btn_edit = function() {
        var keyValue = $('#gridTable').jqGridRowValue('Item_class_Id');
        if (checkedRow(keyValue)) {
            dialogOpen({
                id: 'Form',
                title: '编辑知识库',
                url: '/hongtupage/view/aw_knowledge_dataitem/Form.html?keyValue=' + keyValue,
                width: "750px",
                height: "500px",
                callBack: function (iframeId) {
                    top.frames[iframeId].model.AcceptClick();
                }
            })
        }
    }
    //删除
     this.btn_delete = function() {
        var keyValue = $('#gridTable').jqGridRowValue('Item_class_Id');
        if (keyValue) {
            $.RemoveForm({
                url: '/AfterSaleManage/aw_knowledge_dataitem/RemoveForm',
                param: { keyValue: keyValue },
                success: function (data) {
                    $('#gridTable').trigger('reloadGrid');
                }
            })
        } else {
            dialogMsg('请选择需要删除的知识库！', 0);
        }
    }
};

var model = new viewModel();