$(function () {
    //给form表单按钮注册submit事件
    $('.login_form').on('submit', function (e) {
        //阻止默认事件
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: bigNew.user_login,
            //发送前判断内容是否为空
            beforeSend: function () {
                //console.log($('.login_form').serialize());
                var flag = false;
                $('.login_form input[name]').each(function (index, ele) {
                    if ($(ele).val().trim() == '') {
                        flag = true;
                    }
                })
                if (flag) {
                    $('.modal').modal('show');
                    var timeId = setInterval(function () {
                        $('.modal').modal('hide');
                        clearInterval(timeId);
                    }, 2000)
                    $('.modal-body p').text('输入内容不能为空');
                    return false;
                }
            },
            data: $(this).serialize(),
            success: function (res) {
                $('.modal').modal('show');
                $('.modal-body p').text(res.msg);
                if (res.code == 200) {
                    //将token字符串保存到本地储存中
                    localStorage.setItem('token', res.token);
                    //跳转至主页面
                    $('.modal').on('hidden.bs.modal', function () {
                        window.location.href = './index.html';
                    })
                }
            }
        })
    })
})