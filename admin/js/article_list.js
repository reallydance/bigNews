$(function () {
    //封装分页功能
    function pagination(res, visiblePages) {
        //调用方法实现分页
        $('#pagination-demo').twbsPagination({
            totalPages: res.data.totalPage, // 总页数
            visiblePages: visiblePages || 7, // 可见最大上限页码值
            first: '首页',
            last: '最后一页',
            next: '下一页',
            prev: '上一页',
            initiateStartPageClick: false, // 不要默认点击 
            onPageClick: function (event, page) {
                // page是当前页码
                $.ajax({
                    type: 'get',
                    url: bigNew.article_query,
                    data: {
                        key: $('#key').val(),
                        type: $('#selCategory').val(),
                        state: $('#selStatus').val(),
                        page: page,
                        perpage: 6
                    },
                    success: function (res) {
                        if (res.code == 200) {
                            var htmlStr = template('articleTmp', res.data);
                            $('tbody').html(htmlStr);
                        }
                    }
                })
            }
        })
    }
    //发送ajax请求获取默认第一页列表
    $.ajax({
        type: 'get',
        url: bigNew.article_query,
        success: function (res) {
            if (res.code == 200) {
                //将返回数据与模板绑定
                var htmlStr = template('articleTmp', res.data);
                $('tbody').html(htmlStr);
                //调用分页函数
                pagination(res);
            }
        }
    });
    //发送ajax请求，获取文章所有分类
    $.ajax({
        type: 'get',
        url: bigNew.category_list,
        success: function (res) {
            var htmlStr = template('articleList', res);
            $('#selCategory').html(htmlStr);
        }
    })
    //筛选功能
    //给筛选按钮注册事件
    $('#btnSearch').on('click', function (e) {
        console.log($('#key').val());
        //阻止默认行为
        e.preventDefault();
        //发送ajax请求
        $.ajax({
            type: 'get',
            url: bigNew.article_query,
            data: {
                key: $('#key').val(),
                type: $('#selCategory').val(),
                state: $('#selStatus').val(),
                page: 1,
                perpage: 6
            },
            success(res) {
                var htmlStr = template('articleTmp', res.data);
                $('tbody').html(htmlStr);
                // 改变页码显示
                // 第1个参数是当总页码改变的时候
                // 第2个参数是现在的总页码值
                // 第3个参数是默认显示的页码值
                if (res.data.totalCount == 0) {
                    $('#pagination-demo').hide().siblings('#pagination').show();
                } else {
                    $('#pagination-demo').show().siblings('#pagination').hide();
                    $('#pagination-demo').twbsPagination('changeTotalPages', res.data.totalPage, 1);
                }
            }
        })
    })
    //删除文章
})