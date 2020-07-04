$(function () {
    //跳转到页面立即发送请求
    //获取用户信息渲染到页面

    //发送ajax请求
    $.ajax({
        type: 'get',
        url: bigNew.user_info,
        success: function (res) {
            if (res.code == 200) {
                $('user_info span').html(`欢迎&nbsp;&nbsp;${res.data.nickname}`);
                $('.user_info img').attr('src', res.data.userPic)
                $('.header_bar img').attr('src', res.data.userPic)
            }
        }
    });
    //退出操作
    //单击按钮退出后台页面，并且删除本地储存的token值，再次进入页面需要先登录
    $('.header_bar .logout').on('click', function () {
        //删除本地token
        window.localStorage.removeItem('token');
        //跳转到登录页面
        window.location.href = './login.html';
    })
    //给左边被点击的标签添加类
    $('.menu .level01').on('click', function () {
        $(this).addClass('active').siblings('div').removeClass('active');
        //单击文章管理标签时，展开或关闭ul
        if ($(this).index() == 1) {
            //展开关闭切换
            $('.menu .level02').slideToggle();
            //旋转右侧箭头
            $(this).find('b').toggleClass('rotate0');
        }
    });
    //二级菜单添加点击高亮
    $('.menu .level02 li').on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    })
})