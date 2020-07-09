$(function () {
    //封装分页功能
    var currentPage;

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
                currentPage = page; //将当前页码储存到一个变量中
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
            if (res.data.totalCount == 0) {
                $('#pagination-demo').hide().siblings('#pagination').show();
            } else {
                $('#pagination-demo').show().siblings('#pagination').hide();
            }
        }
    })
    //筛选功能
    //给筛选按钮注册事件
    $('#btnSearch').on('click', function (e) {
        //console.log($('#key').val());
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
                if (res.code == 200) {
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
                        $('#pagination-demo').twbsPagination('changeTotalPages', res.data.totalPage, 1)
                    }
                }
            }
        })
    })
    //删除文章
    //给模态框注册一个显示的事件获取要删除文章的id
    $('#myModal').on('show.bs.modal', function (e) {
        window.articleId = $(e.relatedTarget).data('id');
    });
    //给模态框中的确定按钮注册事件
    $('#myModal .btn-sure').on('click', function () {
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: bigNew.article_delete,
            data: {
                id: articleId
            },
            success: function (res) {
                if (res.code == 204) {
                    //隐藏模态框
                    $('#myModal').modal('hide');
                    //重新渲染页面
                    $.ajax({
                        type: 'get',
                        url: bigNew.article_query,
                        data: {
                            key: $('#key').val(),
                            type: $('#selCategory').val(),
                            state: $('#selStatus').val(),
                            page: currentPage,
                            perpage: 6
                        },
                        success(res) {
                            var htmlStr = template('articleTmp', res.data);
                            $('tbody').html(htmlStr);
                            if (res.data.totalCount == 0) {
                                $('#pagination-demo').hide().siblings('#pagination').show();
                            } else {
                                $('#pagination-demo').show().siblings('#pagination').hide();
                                //如果当前页面响应回来的数据为0则代表当前页面中没有数据了，应该显示前一页的数据
                                if (res.data.data.length == 0) {
                                    currentPage--;
                                    $('#pagination-demo').twbsPagination('changeTotalPages', res.data.totalPage, currentPage);
                                    //第一个参数是当总页面改变的时候
                                    //第二个参数是当前总页面
                                    //第三个参数是默认显示页码值
                                }
                            }
                        }
                    })
                }
            }
        })
    })
    //给发布文章按钮注册事件，实现点击按钮左侧导航栏高亮显示
    $('#release_btn').on('click', function () {
        console.log(123);
        parent.$('.menu .level02>li:eq(1)').click();
    })
})