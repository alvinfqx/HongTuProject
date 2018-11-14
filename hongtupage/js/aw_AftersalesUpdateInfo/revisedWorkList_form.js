var viewModel = function(){
	var self = this;
	
	var text_value = newrequest("text_value"),
	index_id = request("index_id");
	$("#remark1").val(text_value);

	
	this.AcceptClick = function(callback){
		var edit_value = $("#remark1").val();
		var json_data = {
			value: edit_value,
			id: index_id
		}
	
		callback(json_data);
		dialogClose();
			
	}
	
	
};


var model = new viewModel();