var viewModel = function() {
	var self = this;
	//人员列表 session存储
	this.tranferSetSession = function(key, val) {
		var tranfer_key = "tranfer_key";

		var total_list = JSON.parse(sessionStorage.getItem(tranfer_key))
		if(total_list) {
			var item_list =total_list[key]
			if(item_list){
				$.extend(item_list,val)
				total_list[key] = item_list
			}else{
				total_list[key] = val
			}
			
			sessionStorage.setItem(tranfer_key, JSON.stringify(total_list))
		} else {
			var s_json = {};
			s_json[key] = val;
			sessionStorage.setItem(tranfer_key, JSON.stringify(s_json))
		}
	};

	this.tranferGetSession = function(key) {
		var tranfer_key = "tranfer_key";
		var total_list = JSON.parse(sessionStorage.getItem(tranfer_key))
		if(total_list && total_list[key]) {
			return total_list[key]
		} else {
			return []
		}

	}
};

var tranfer = new viewModel();