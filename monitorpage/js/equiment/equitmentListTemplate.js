var viewModel = function() {
	var self = this;
	var paramStr = request('id');
	var proCode = request('code');
	var ws;
	$(function() {
		connectSocketServer();
		self.GetGrid();
		
	});

	this.reloadBtn = function() {
		location.reload();
	}

	//连接websocket
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
					self.getGridData(new_data);
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
			ws.send('InQuire SingleTypeMonitor {\"keyValue\":\"' + proCode + '\",\"Node_Type\":\"' + paramStr + '\"}');
			websocket_index = 0;
		} else {
			console.log('Send Data Fail!');
		}
	}

	setInterval(function() {
		sendData();
	}, 5000);

	//循环插入数据
	this.getGridData = function(arr) {
		if(arr && arr.length > 0) {
			$('#gridTable').jqGrid('clearGridData');			
			for(var i = 0; i <= arr.length; i++) {
				$('#gridTable').jqGrid('addRowData', i + 1, arr[i]);
			}
			$('.unwritten').css({
				'display':'none'
			});
		} else {
			$('#gridTable').jqGrid('addRowData', i , []);
			$('.unwritten').css({
				'display':'block'
			});
		}

	};

	//加载表格
	this.GetGrid = function() {
		var $gridTable = $('#gridTable');
		$gridTable.jqGrid({
			autowidth: true,
			height: $(window).height() - 50,
			datatype: "local",
			colModel: [{
					label: '节点流水号',
					name: 'NODE_ID',
					index: 'NODE_ID',
					hidden: true,
					key: true
				},
				{
					label: '设备流水号',
					name: 'EQ_ID',
					index: 'EQ_ID',
					hidden: true,
				},
				{
					label: '监控项目名称',
					name: 'NODE_NAME',
					index: 'NODE_NAME',
					width: 100,
					align: "center",
				},
				{
					label: '报警上限',
					name: 'ALARM_VAL2',
					index: 'ALARM_VAL2',
					width: 100,
					align: "center",

				},
				{
					label: '报警下限',
					name: 'ALARM_VAL1',
					index: 'ALARM_VAL1',
					width: 100,
					align: "center",

				},

				{
					label: '停机上限',
					name: 'STOP_VAL2',
					index: 'STOP_VAL2',
					width: 100,
					align: "center"
				},
				{
					label: '停机下限',
					name: 'STOP_VAL1',
					index: 'STOP_VAL1',
					width: 100,
					align: "center"
				},
				{
					label: '度量单位',
					name: 'NODE_UNIT',
					index: 'NODE_UNIT',
					width: 100,
					align: "center"
				},

				{
					label: '当前值',
					name: 'COLL_VAL',
					index: 'COLL_VAL',
					width: 100,
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return Number(cellvalue).toFixed(3);
					}
				},
				{
					label: '更新时间',
					name: 'COLL_DATE',
					index: 'COLL_DATE',
					width: 120,
					align: "center",
				},
				{
					label: '报警',
					name: 'STATE',
					index: 'STATE',
					width: 100,
					align: "center"
				},
				{
					label: '趋势图',
					name: 'NODE_TYPE',
					index: 'NODE_TYPE',
					align: "center",
					formatter: function(cellvalue, options, rowObject) {
						return '<a href="javascript:void(0)"   onclick="line_btn(this);" data-value="' + cellvalue + '"  data-id="' + options.rowId + '" style="color:#00a157;">趋势图</a>';
					}
				}

			],
			viewrecords: false,
			rowNum: 99999,
			rownumbers: true,
			shrinkToFit: false
		});

	}

};

var line_btn = function(rowsid) {
	var $rowsid = $(rowsid);
	//获取该单元格所属行的某值
	var row_data = $("#gridTable").jqGrid('getRowData', $rowsid.data('id'));
	//节点ID
	var nodeID = row_data.NODE_ID;
	//设备ID
	var eqID = row_data.EQ_ID;
	//节点名称
	var nodeName = row_data.NODE_NAME;

	if(nodeID && nodeID.length > 0) {
		dialogOpen({
			id: 'TrendGrapFormID',
			title: '趋势图',
			url: '/monitorpage/view/equiment/eqListTemTrend.html?nodeid=' + nodeID + '&eqid=' + eqID + '&nodeName=' + nodeName,
			width: '',
			height: '',
			btn: null,
		});
	} else {
		dialogMsg('流水号无效！', 0);
		return false;
	}
};

var model = new viewModel();