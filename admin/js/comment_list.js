$(function () {
    //跳转到页面获取数据

    $.ajax({
        type: 'get',
        url: bigNew.comment_list,
        success: function (res) {
            if (res.code == 200) {
                //使用模板渲染数据
                var htmlStr = template('contentList', res.data);
                $('tbody').html(htmlStr);
                pagination(res);
                if (res.data.totalCount == 0) {
                    $('#pagination-demo').hide().siblings('#pagination').show();
                } else {
                    $('#pagination-demo').show().siblings('#pagination').hide();
                }
            }
        }
    })

    //启用分页插件
    var currentPage = 1

    function pagination(res, visiblePages) {
        $('#pagination-demo').twbsPagination({
            totalPages: res.data.totalPage, // 总页数
            visiblePages: visiblePages || 7, // 可见最大上限页码值
            first: '首页',
            last: '最后一页',
            next: '下一页',
            prev: '上一页',
            initiateStartPageClick: false, // 不要默认点击 
            onPageClick: function (event, page) {
                currentPage = page; //将当前页码储存到一个变量中
                // page是当前页码
                $.ajax({
                    type: 'get',
                    data: {
                        page: page,
                        perpage: 6
                    },
                    url: bigNew.comment_list,
                    success: function (res) {
                        if (res.code == 200) {
                            //使用模板渲染数据
                            var htmlStr = template('contentList', res.data);
                            $('tbody').html(htmlStr);
                        }
                    }
                })
            }
        })
    }
    //给通过按钮注册事件
    $('tbody').on('click', '.btn-pass', function () {
        var that = this;
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: bigNew.comment_pass,
            data: {
                id: $(this).data('id')
            },
            success: function (res) {
                if (res.code == 200) {
                    $(that).parent().prev().text(res.msg);
                }
            }
        })
    })
    //给拒绝按钮注册事件
    $('tbody').on('click', '.btn-reject', function () {
        var that = this;
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: bigNew.comment_reject,
            data: {
                id: $(this).data('id')
            },
            success: function (res) {
                if (res.code == 200) {
                    $(that).parent().prev().text(res.msg);
                }
            }
        })
    })
    //给删除按钮注册事件
    $('tbody').on('click', '.btn-del', function () {
        $.ajax({
            type: 'post',
            url: bigNew.comment_delete,
            data: {
                id: $(this).data('id')
            },
            success: function (res) {
                if (res.code == 200) {
                    //重新发送请求，获取页面数据
                    $.ajax({
                        type: 'get',
                        url: bigNew.comment_list,
                        data: {
                            page: currentPage
                        },
                        success: function (res) {
                            if (res.code == 200) {
                                //使用模板渲染数据
                                var htmlStr = template('contentList', res.data);
                                $('tbody').html(htmlStr);
                                if (res.data.totalCount == 0) {
                                    // 此时没有数据，则不需要显示分页插件
                                    $('#pagination-demo').hide().next().show()
                                } else {
                                    $('#pagination-demo').show().next().hide()
                                    // 判断最后一页的情况
                                    if (res.data.data.length == 0) {
                                        // res.data.data这个数组中的数据是根据当前页面来查询的数据
                                        currentPage -= 1
                                    }
                                    // 改变页码显示
                                    // 第1个参数是当总页码改变的时候
                                    // 第2个参数是现在的总页码值
                                    // 第3个参数是默认显示的页码值
                                    $('#pagination-demo').twbsPagination('changeTotalPages', res.data.totalPage, currentPage)
                                }
                            }
                        }
                    })
                }
            }
        })
    })
})