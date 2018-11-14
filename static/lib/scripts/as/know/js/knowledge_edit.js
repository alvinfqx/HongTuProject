;



(function () {
    layui.use(['tree', 'form', 'layer', 'laypage'], function () {
        var form = layui.form,
			layer = layui.layer,
			tree = layui.tree,
			laypage = layui.laypage;;

        var main = function () {
            Module().GetKonwTree();
            Module().GetPagetotal();
        }

        //编辑
        $("#page_list").on("click", ".tab-pane", function () {
            // console.log($(this).find(".page-title").data("pageid"))
            ///AfterSaleManage/aw_knowledge_view/Form?dataid=' + aw_knowledge_ItemDetailId + '
          /*  dialogOpenContent({
                id: 'Form',
                url: '/AfterSaleManage/aw_knowledge_edit/Form?keyValue=' + $(this).find(".page-title").data("pageid"),
                width: '90%',
                height: '98%',
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                   // Module().GetKonwTree();
                   // Module().GetPagetotal();
                }
            });*/


            dialogOpenATECustomer({
                id: 'Form',
                title: '编辑知识库条目',
                url: '/AfterSaleManage/aw_knowledge_edit/Form?keyValue=' + $(this).find(".page-title").data("pageid"),
                width: '90%',
                height: '98%',
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                },
                callBack2: function (iframeId) {
                    // alert('callBack2');
                    top.frames[iframeId].delClick();
                }
            })


        })

        $(".open_adds").click(function () {
          /*  dialogOpenContent({
                id: 'Form',
                url: '/AfterSaleManage/aw_knowledge_edit/Form?keyValue=' + $(this).find(".page-title").data("pageid"),
                width: '90%',
                height: '98%',
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();

                }
            });*/

            dialogOpenAddCustomer({
                id: 'Form',
                title: '新增知识库条目',
                url: '/AfterSaleManage/aw_knowledge_edit/Form?keyValue=' + $(this).find(".page-title").data("pageid"),
                width: '90%',
                height: '98%',
                callBack: function (iframeId) {
                    top.frames[iframeId].AcceptClick();
                }
            })

        })

        //edit
        dialogOpenATECustomer = function (options) {
            Loading(true);
            var defaults = {
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                url: '',
                shade: 0.3,
                btn: ['提交', '关闭', '删除'],
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
                content: top.contentPath + _url,
                btn: options.btn,
                yes: function () {
                    //alert("yes");
                    options.callBack(options.id)
                },
                cancel: function () {
                    if (options.cancel != undefined) {
                        options.cancel();
                    }
                    return true;

                }, btn3: function () {
                    //alert("312223333");
                    options.callBack2(options.id)
                    //  dialogClose();
                },
                end: function () {
                    // $('#gridTable').trigger('reloadGrid');
                   // Module().GetKonwTree();
                    Module().GetPagetotal();
                }
            });
        }


        //add
        dialogOpenAddCustomer = function (options) {
            Loading(true);
            var defaults = {
                id: null,
                title: '系统窗口',
                width: "100px",
                height: "100px",
                url: '',
                shade: 0.3,
                btn: ['提交', '关闭'],
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
                content: top.contentPath + _url,
                btn: options.btn,
                yes: function () {
                    //alert("yes");
                    options.callBack(options.id)
                },
                cancel: function () {
                    if (options.cancel != undefined) {
                        options.cancel();
                    }
                    return true;

                },
                end: function () {
                    // $('#gridTable').trigger('reloadGrid');
                   // Module().GetKonwTree();
                    Module().GetPagetotal();
                }
            });
        }

        var Module = function () {
            //初始化树形
            var GetKonwTree = function () {
                var pageJson = {
                    "organizationid": "1"
                };
                $.ajax({
                    type: "post",
                    //url: page_global_url + '/ebizstar/Knowledgelibrary/queryItemName',
                    url: "../../AfterSaleManage/aw_knowledge_dataitem/GetTreeJson4LayUI",
                    contentType: "application/json",
                    //data: JSON.stringify(pageJson),
                    success: function (data) {
                        tree({
                            elem: '#demo',
                            skin: 'blue',
                            nodes: JSON.parse(data),
                            click: function (node) {
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
                    error: function (data) {
                        console.log(data);
                        layer.msg("网络错误,请稍后再试!", {
                            icon: 2
                        });
                    }
                });
            }

            //获取页数给分页
            var GetPagetotal = function () {
                var pageJson = {
                    "condition": "",
                    "keyword": "",
                    "page": "1",
                    "rows": "5"
                };
                $.ajax({
                    //   url: page_global_url + '/ebizstar/Knowledgefileuploaded/queryfenye',
                    url: "../../AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(pageJson),
                    success: function (data) {

                        var post_data = {
                            "condition": "",
                            "keyword": "",
                            "page": "1",
                            "rows": "5"
                        }
                        var data = JSON.parse(data);
                        pageInit(data.records, 0, post_data, '../../AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost')
                    },
                    error: function (data) {
                        console.log(data)
                        if (layer) {
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
            var GetTreePageList = function (id) {
                var post_data = {
                    "condition": "itemClassId",
                    "keyword": id,
                    "page": "1",
                    "rows": "5"
                }
                $.ajax({
                    url: "../../AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost",
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(post_data),
                    success: function (data) {
                        console.log(data)
                        var data = JSON.parse(data);
                        //$('#page_list').html(analyData(data.rows))
                        var post_data = {
                            "condition": "itemClassId",
                            "keyword": id,
                            "rows": "5"
                        }
                        pageInit(data.records, 0, post_data, '../../AfterSaleManage/aw_knowledge_dataitemdetail/GetPageListJsonWithPost')
                    },
                    error: function (data) {
                        console.log(data)
                        if (layer) {
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
            var pageInit = function (totalPage, firstIndex, post_data, in_url) {
                laypage.render({
                    elem: 'page-button',
                    count: totalPage,
                    theme: '#3c8dbc',
                    jump: function (obj, first) {
                        //obj包含了当前分页的所有参数，比如：
                        //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                        //console.log(obj.limit); //得到每页显示的条数
                        //						var pageJson = {
                        //							"media_type": "文章类",
                        //							"startIndex": obj.curr,
                        //							"pageSize": "5"
                        //						};
                        post_data["page"] = obj.curr
                        console.log(post_data)
                        $.ajax({
                            type: "post",
                            url: in_url,
                            contentType: "application/json",
                            data: JSON.stringify(post_data),
                            success: function (data) {
                                console.log(JSON.parse(data));
                                var data = JSON.parse(data);
                                if (data.rows.length != 0) {
                                    $("#page_list").html("");
                                    $('#page_list').append(analyData(data.rows))
                                    //$("#page_list").html("");
                                    //$('#page_list').append(analyData(data.content))
                                } else {
                                    $("#page_list").html("");
                                    layer.msg("暂无数据！", {
                                        icon: 2
                                    });
                                }
                            },
                            error: function (data) {
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
            var analyData = function (data) {
                var pages = '';
                $.each(data, function (i, n) {
                    var aw_knowledge_ItemDetailId = (n.aw_knowledge_ItemDetailId) || ""
                    pages += '<div class="active tab-pane" >' +
						'<div class="post">' +
						'<div class="user-block">' +
						'<img class="img-circle img-bordered-sm" src="' + n.thumbnailPath + '" alt="" style="">' +
					    '<span class="username" style="">' +
						'<a href="#" class="page-title" data-pageid=' + aw_knowledge_ItemDetailId + '>' + n.title + '</a>' +
						'</span>' +
						'<ul class="list-inline">' +
						'<li>' +
						'<span>创建人:</span>' +
						'</li><li>' +
						'<span>' + n.CreateUserName + '</span>' +
						'</li></ul>' +
						'<p class="description">' + ((n.basicInfo) || "无描述") + '</p>' +
						'<ul class="list-inline" style="text-align: right;">' +
						'<li>' +
						'<span style="margin-right: 10px;">所属分类:' + n.media_type + '</span>' +
						'</li><li>' +
						'<a href="#" class="link-black text-sm"><i class="fa fa-clock-o margin-r-5"></i>上传时间：</a>' +
						'<span style="margin-right: 10px;">' + n.CreateDate + '</span>' +
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
    }, function () {
        location.reload();
    });
}