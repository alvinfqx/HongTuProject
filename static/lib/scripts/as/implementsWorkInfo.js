$(function () {
    //dropzoneServiceConclusion
    var myDropzone = new Dropzone("#dropzoneServiceConclusion", {
        // url: "/admin/upload",//文件提交地址
        url: cm.domain + "/AfterSaleManage/aw_workinfo/BatchUpload?keyValue=111&tbname=aw_implementAttachment&token=" + cm.token,//文件提交地址
        method: "post",  //也可用put
        paramName: "file", //默认为file
        maxFiles: 10,//一次性上传的文件数量上限
        // maxFilesize: 2, //文件大小，单位：MB
        //   acceptedFiles: ".jpg,.gif,.png,.jpeg", //上传的类型
        addRemoveLinks: true,
        parallelUploads: 1,//一次上传的文件数量
        //previewsContainer:"#preview",//上传图片的预览窗口
        dictDefaultMessage: '拖动文件至此或者点击上传',
        dictMaxFilesExceeded: "您最多只能上传10个文件！",
        dictResponseError: '文件上传失败!',
        dictInvalidFileType: "文件类型只能是*.jpg,*.gif,*.png,*.jpeg。",
        dictFallbackMessage: "浏览器不受支持",
        dictFileTooBig: "文件过大上传文件最大支持.",
        dictRemoveLinks: "删除",
        dictCancelUpload: "取消",
        init: function () {
            this.on("addedfile", function (file) {
                //上传文件时触发的事件
                document.querySelector('div .dz-default').style.display = 'none';
            });
            this.on("success", function (file, data) {
                //上传成功触发的事件
                console.log('ok');
                // angular.element(appElement).scope().file_id = data.data.id;
            });
            this.on("error", function (file, data) {
                //上传失败触发的事件
                console.log('fail');
                var message = '';
                //lavarel框架有一个表单验证，
                //对于ajax请求，JSON 响应会发送一个 422 HTTP 状态码，
                //对应file.accepted的值是false，在这里捕捉表单验证的错误提示
                if (file.accepted) {
                    $.each(data, function (key, val) {
                        message = message + val[0] + ';';
                    })
                    //控制器层面的错误提示，file.accepted = true的时候；
                    alert(message);
                }
            });
            this.on("removedfile", function (file) {
                console.log('removedfile');
                console.log("File " + file.name + "removed");
                //删除文件时触发的方法
                //  var file_id = angular.element(appElement).scope().file_id;
                var file_id = "11";
                alert(file_id);
                if (file_id) {
                    $.post('/AfterSaleManage/aw_workinfo/BatchDelete?keyValue=' + file.name, { 'tbname': 'aw_implementAttachment' }, function (data) {
                        console.log('删除结果:' + data.message);
                    })
                }
                //   angular.element(appElement).scope().file_id = 0;
                document.querySelector('div .dz-default').style.display = 'block';
            });
        }
    });

}
);