var viewModel = function(){
	var self = this;
	 var keyValue = request('keyValue');
    $(function () {
        self.initControl();
    });
    //初始化控件
     this.initControl = function() {
        //上级菜单
        $("#ParentId").ComboBoxTree({
            url: "/AfterSaleManage/aw_knowledge_dataitem/GetTreeJson",
            cbiconpath: "../../../static/lib/scripts/plugins/tree/images/icons/",
            description: "==请选择==",
            height: "260px",
            allowSearch: true
        });
        //获取表单
        if (!!keyValue) {
            $.SetForm({
                url: "/AfterSaleManage/aw_knowledge_dataitem/GetFormJson",
                param: { keyValue: keyValue },
                success: function (data) {
                    $("#form1").SetWebControls(data);
                }
            })
        }
    }
      this.AcceptClick = function() {
        if (!$('#form1').Validform()) {
            return false;
        }
        var postData = $("#form1").GetWebControls(keyValue);
        $.SaveForm({
            url: "/AfterSaleManage/aw_knowledge_dataitem/SaveForm?keyValue=" + keyValue,
            param: postData,
            loading: "正在保存数据...",
            success: function () {
                $.parentIframe().$("#gridTable").trigger("reloadGrid");
            }
        })
    }
};

var model = new viewModel();