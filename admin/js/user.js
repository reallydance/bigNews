$(function () {
    // 发送ajax请求
    $.ajax({
        type: 'get',
        url: bigNew.user_detail,
        success: function (res) {
            // 渲染数据
            if (res.code == 200) {
                console.log(res);
                for (var key in res.data) {
                    $(`#form .${key}`).val(res.data[key])
                }
                $('#form .user_pic').attr('src', res.data.userPic)
            }
        }
    })
    //上传图片前预览
    $('#exampleInputFile').on('change', function () {
        //获取选中的图片
        var file = this.files[0];
        //使用URL对象的createObjectURL方法生成图片链接
        $('#form .user_pic').attr('src', URL.createObjectURL(file));
    });
    //更新个人中心的数据，给修改按钮注册事件
    $('#form .btn-edit').on('click', function (e) {
        //阻止默认行为
        e.preventDefault();
        //准备formData数据
        var data = new FormData($('#form')[0]);
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: bigNew.user_edit,
            data: data,
            contentType: false, //不添加请求头，因为用二进制发送数据
            processData: false, //不需要转换成字符串
            success: function (res) {
                if (res.code == 200) {
                    $.ajax({
                        type: 'get',
                        url: bigNew.user_info,
                        success: function (res) {
                            if (res.code == 200) {
                                //更新index.html中的用户名和头像
                                parent.$('.user_info span').html(`欢迎&nbsp;&nbsp;${res.data.nickname}`);
                                parent.$('.user_info img').attr('src', res.data.userPic);
                                parent.$('.header_bar img').attr('src', res.data.userPic);
                            }
                        }
                    })

                }
            }
        })
    })
})