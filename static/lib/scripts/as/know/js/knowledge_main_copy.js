;
(function () {
	layui.use(['tree', 'form', 'layer', 'laypage'], function() {
		var form = layui.form,
			layer = layui.layer,
			tree = layui.tree,
			laypage = layui.laypage;;

		var main = function() {
			Module().GetKonwTree();
			Module().GetPagetotal();
		}

		$(".open_adds").click(function() {
			layer.open({
				title: '新增数据',
				maxmin: true,
				type: 2,
				content: 'page_data.html',
				area: ['90%', '98%'],
				success: function(layero, index) {
					//rowdata
				}
			});
		})

		var Module = function() {
			//初始化树形
			var GetKonwTree = function() {
				var pageJson = {
					"organizationid": "1"
				};
				$.ajax({
					type: "post",
					url: page_global_url + '/ebizstar/Knowledgelibrary/queryItemName',
					contentType: "application/json",
					data: JSON.stringify(pageJson),
					success: function(data) {
						tree({
							elem: '#demo',
							skin: 'blue',
							nodes: data.content,
							click: function(node) {
								console.log(node) //node即为当前点击的节点数据
								var post_data;
								/*if(node.parentId ==0){
									post_data = {
										"ParentId":
									}
									GetTreePageList(id,'/ebizstar/Knowledgelibrary/queryParentId')
								}else{
									GetTreePageList('/ebizstar/Knowledgelibrary/queryknow')
									
								}*/
								GetTreePageList(node.id)
							}
						});
					},
					error: function(data) {
						console.log(data);
						layer.msg("网络错误,请稍后再试!", {
							icon: 2
						});
					}
				});
			}

			//获取页数给分页
			var GetPagetotal = function() {
				var pageJson = {
					"media_type": "文章类",
					"startIndex": "1",
					"organizationid": "1",
					"pageSize": "5"
				};
				$.ajax({
					url: page_global_url + '/ebizstar/Knowledgefileuploaded/queryfenye',
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify(pageJson),
					success: function(data) {
						var post_data = {
							"media_type": "文章类",
							"organizationid": "1",
							"pageSize": "5"
						}
						pageInit(data.ret, 0,post_data,'/ebizstar/Knowledgefileuploaded/queryfenye')
					},
					error: function(data) {
						console.log(data)
						if(layer) {
							layer.msg("网络错误,无法加载数据!", {
								icon: 2
							});
						} else {
							alert("网络错误,无法加载数据!");
						}
					}
				})
			}

			//点击树形菜单查询
			var GetTreePageList = function(id) {
				var post_data = {
					"Item_class_Id": id,
					"startIndex":"1",
					"organizationid": "1",
					"pageSize":"5"
				}
				$.ajax({
					url: page_global_url + '/ebizstar/Knowledgefileuploaded/queryItemId',
					type: "POST",
					contentType: "application/json",
					data: JSON.stringify(post_data),
					success: function(data) {
						console.log(data)
						$('#page_list').html(analyData(data.content))
						var post_data = {
							"Item_class_Id":id,
							"pageSize": "5"
						}
						pageInit(data.ret,1,post_data,'/ebizstar/Knowledgefileuploaded/queryItemId')
					},
					error: function(data) {
						console.log(data)
						if(layer) {
							layer.msg("网络错误,无法加载数据!", {
								icon: 2
							});
						} else {
							alert("网络错误,无法加载数据!");
						}
					}
				})
			}

			//初始分页 初始列表
			var pageInit = function(totalPage, firstIndex,post_data, in_url) {
				laypage.render({
					elem: 'page-button',
					count: totalPage,
					theme: '#3c8dbc',
					jump: function(obj, first) {
						//obj包含了当前分页的所有参数，比如：
						//console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
						//console.log(obj.limit); //得到每页显示的条数
//						var pageJson = {
//							"media_type": "文章类",
//							"startIndex": obj.curr,
//							"pageSize": "5"
//						};
						post_data["startIndex"] = obj.curr
						console.log(post_data)
						$.ajax({
							type: "post",
							url: page_global_url + in_url,
							contentType: "application/json",
							data: JSON.stringify(post_data),
							success: function(data) {
								console.log(data);
								if(data.content.length != 0) {
									$("#page_list").html("");
									$('#page_list').append(analyData(data.content))
									//$("#page_list").html("");
									//$('#page_list').append(analyData(data.content))
								} else {
									layer.msg("网络错误,请稍后再试!", {
										icon: 2
									});
								}
							},
							error: function(data) {
								console.log(data);
								layer.msg("网络错误,请稍后再试!", {
									icon: 2
								});
							}
						});
					}
				});
			}

			//解析列表数据
			var analyData = function(data) {
				console.log(data)
				var pages = '';
				$.each(data, function(i, n) {
					var aw_knowledge_ItemDetailId = (n.aw_knowledge_ItemDetailId) || ""
					pages += '<div class="active tab-pane" >' +
						'<div class="post">' +
						'<div class="user-block">' +
						'<img class="img-circle img-bordered-sm" src="" alt="" style="">' +
						'<span class="username" style="">' +
						'<a href="/AfterSaleManage/aw_knowledge_view/Form?dataid=' + aw_knowledge_ItemDetailId + '">' + n.title + '</a>' +
						'</span>' +
						'<ul class="list-inline">' +
						'<li>' +
						'<span>创建人:</span>' +
						'</li><li>' +
						'<span>' + n.createUserName + '</span>' +
						'</li></ul>' +
						'<p class="description">' + ((n.description) || "无描述") + '</p>' +
						'<ul class="list-inline" style="text-align: right;">' +
						'<li>' +
						'<span style="margin-right: 10px;">所属分类:' + n.media_type + '</span>' +
						'</li><li>' +
						'<a href="#" class="link-black text-sm"><i class="fa fa-clock-o margin-r-5"></i>上传时间</a>' +
						'<span style="margin-right: 10px;">' + n.createDate + '</span>' +
						'</li></ul>' +
						'</div></div></div>';
				});
				return pages;
			}
			return {
				GetKonwTree: GetKonwTree,
				GetPagetotal: GetPagetotal,
				pageInit: pageInit
			}
		}
		main()
	})

})()

//子页面提示框
function tip(text, number) {
	layer.msg(text, {
		icon: number,
		time: 600
	}, function() {
		location.reload();
	});
}