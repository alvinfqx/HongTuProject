var viewModel = function() {
	var self = this;
	var gridId = request('gridId');
	var filename = request('filename');
	$(function() {
		var columnModel = $.parentIframe().$("#" + gridId).jqGrid('getGridParam', 'colModel');
		console.log($.parentIframe().$("#" + gridId))
		$.each(columnModel, function(i) {
			var label = columnModel[i].label;
			var name = columnModel[i].name;
			var hidden = columnModel[i].hidden;
			if(!!label && hidden == false) {
				$(".sys_spec_text").append("<li data-value='" + name + "' title='" + label + "'><a>" + label + "</a><i></i></li>");
			}
		});
		$(".sys_spec_text li").addClass("active");
		$(".sys_spec_text li").click(function() {
			if(!!$(this).hasClass("active")) {
				$(this).removeClass("active");
			} else {
				$(this).addClass("active").siblings("li");
			}
		});
	});
	//确定导出
	this.AcceptClick = function() {
		var exportField = [];
		$('.sys_spec_text ').find('li.active').each(function() {
			var value = $(this).attr('data-value');
			exportField.push(value);
		});
		var columnJson = $.parentIframe().$("#" + gridId).jqGrid('getGridParam', 'colModel');
		var rowJson = $.parentIframe().$("#" + gridId).jqGrid('getRowData');
		$('#executeexcel').remove();
		var html_form = "";
		html_form += "<form id='executeexcel' method='post' action='";
		html_form += cm.domain;
		html_form += "/Utility/ExecuteExportExcel?token=" + cm.token + "' style='display:none;'>"
		var $form = $(html_form);

		var html_input = "";
		html_input += "<input type='hidden' name='columnJson' value='";
		html_input += JSON.stringify(columnJson);
		html_input += "'><input type='hidden' name='rowJson' value='";
		html_input += JSON.stringify(rowJson);
		html_input += "'><input type='hidden' name='exportField' value='";
		html_input += String(exportField);
		html_input += "'><input type='hidden' name='filename' value='";
		html_input += escape(filename);
		html_input += "'>";
		var $input = $(html_input);
		$("body").append($form);
		$form.append($input).submit();
	}
};

var model = new viewModel();