$(function () {
    //页面跳转过来发送请求，获取文章分类
    $.ajax({
        type: 'get',
        url: bigNew.category_list,
        success: function (res) {
            if (res.code == 200) {
                var htmlStr = template('categoryList', res);
                $('.category').html(htmlStr);
            }
        }
    })
    //获取id数据渲染页面
    var str = location.search.slice(1);
    var id = utils.convertToObj(str).id;
    $.ajax({
        type: 'get',
        url: bigNew.article_search,
        data: {
            id: id
        },
        success: function (res) {
            if (res.code == 200) {
                $('#form input[name=id]').val(res.data.id);
                $('#form input[name=title]').val(res.data.title);
                $('#form .article_cover').attr('src', res.data.cover);
                $('#form select[name="categoryId"]').val(res.data.categoryId);
                $('#form input[name=date]').val(res.data.date);
                editor.txt.html(res.data.content);
            }
        }
    });
    //调用方法实现日期插件的显示
    jeDate("#testico", {
        format: "YYYY-MM-DD",
        isTime: false,
        isToday: true, // 是否显示本月或今天
        minDate: "2014-09-19 00:00:00"
    });
    //调用方法实现富文本编辑器
    var E = window.wangEditor
    var editor = new E('#editor');
    editor.create();

    //图片预览
    $('#inputCover').on('change', function () {
        var file = this.files[0];
        var url = URL.createObjectURL(file);
        //渲染待上传的图片
        $('#form .article_cover').attr('src', url);
    })
    //给form表单注册事件
    $('#form').on('click', '.btn', function (e) {
        e.preventDefault();
        //准备数据
        var myForm = $('#form')[0];
        var data = new FormData(myForm);

        data.append('content', editor.txt.html());
        //判断是哪个按钮进行的提交
        if ($(e.target).hasClass('.btn-edit')) {
            //修改操作
            data.append('state', '已发布')
        } else {
            data.append('state', '草稿')
        }
        //发送ajax请求
        $.ajax({
            type: 'post',
            url: bigNew.article_edit,
            data: data,
            contentType: false, //不需要额外编码，即二进制
            processData: false, //不要转换成字符串
            success: function (res) {
                if (res.code == 200) {
                    //回退到文章列表页
                    window.history.back();
                }
            }
        })
    })
})