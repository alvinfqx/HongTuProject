var viewModel = function() {
	var self = this;
	var procode = parent.window.model.procode;
	var class_status = ['', 'drag_div_green', 'drag_div_red'];

	$(function() {
		self.Init();
		self.initWebSocket();
	});
	//获取背景图设置高
	this.Init = function() {
		$('#img').css("background-image", "url(../../../static/img/monitor_5-7.bmp)");
		$('#img').css("height", document.documentElement.clientHeight);
	}

	//连接websocket
	this.initWebSocket = function() {
		var ws;
		function connectSocketServer() {
			var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
			if(support == null) {
				return;
			}
			// create a new websocket and connect
			ws = new window[support]('ws://10.33.140.95:2012/');
			// when data is comming from the server, this metod is called
			ws.onmessage = function(evt) {
				if(evt.data) {
					var new_data = JSON.parse(evt.data);
					if(websocket_index == 0) {
 						self.inintData(new_data);
					}
				}
				websocket_index++;
				console.log('Connection Data');
			};
			// when the connection is established, this method is called
			ws.onopen = function() {
				console.log('Connection Success');
				sendData();
			};
			// when the connection is closed, this method is called
			ws.onclose = function() {
				console.log('Connection Closed');
			}
		}
		//send data
		function sendData() {
			if(ws) {
				//设备工艺图
				ws.send('InQuire NodeAlarmMonitor {\"keyValue\":\"' + procode + '\"}');
				websocket_index = 0;
			} else {
				console.log('Send Data Fail!');
			}
		}

		window.onload = function() {
			connectSocketServer();
		}
		setInterval(function() {
			sendData();
		}, 5000);
	};

	//初始化
	this.inintData = function(arr) {
		$(".text_class tr").html("");
		if(arr && arr.length > 0) {
			for(var i = 0; i < arr.length; i++) {
				var html = '';
				html += '<td>';
				html += '<div id="draggable_' + i + '"  class="drag_div ' + class_status[Number(arr[i].State)] + '" style="left:' + arr[i].Position_left + '; top:' + arr[i].Position_top + ';">';
				html += arr[i].COLL_VAL;
				html += '</div>';
				html += '</td>';
				$(".text_class tr").append(html);
			}
		}
		else{
			console.log('无数据');
		}
	};

	this.reload = function() {
		location.reload();
	};

};

var model = new viewModel();