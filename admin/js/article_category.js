$(function () {
    //跳转到页面发送ajax请求，将数据渲染到页面
    function render() {
        $.ajax({
            type: 'get',
            url: bigNew.category_list,
            success: function (res) {
                //调用template方法，进行数据绑定
                var htmlStr = template('categoryList', res);
                $('tbody').html(htmlStr);
            }
        });
    }
    render();
    //单击按钮弹出模态框,修改标题
    // $('#myModal').on('shown.bs.modal', function () {
    //     $('#myModal h4').text('新增分类')
    // });
    //点击确定按钮时发送ajax请求，添加分类
    $('.btn-sure').on('click', function () {
        $.ajax({
            type: 'post',
            url: bigNew.category_add,
            data: $('#myForm').serialize(),
            success: function (res) {
                $('#myForm')[0].reset();
                if (res.code == 201) {
                    //隐藏模态框并刷新页面
                    $('#myModal').modal('hide');
                    render();
                }
            }
        })
    });
    //删除功能
    //弹出删除模态框时，获取对应id，还要通过e.relatedTarget获取事件源头，即哪个标签被点击才弹出来的模态框
    $('#delModal').on('show.bs.modal', function (e) {
        window.categoryId = $(e.relatedTarget).data('id');
    });
    //给模态框中的确定按钮注册事件，发送ajax请求
    $('.btn-sure-del').on('click', function () {
        $.ajax({
            type: 'post',
            url: bigNew.category_delete,
            data: {
                id: window.categoryId
            },
            success: function (res) {
                if (res.code == 204) {
                    $('#delModal').modal('hide');
                    render();
                }
            }
        })
    });
    //编辑分类
    //数据回显,通过事件对象中的relatedTarget来确定是添加分类还是编辑
    //单击按钮时先弹出模态框并修改标题
    $('#myModal').on('show.bs.modal', function (e) {
        if ($(e.relatedTarget).attr('id') == 'xinzengfenlei') {
            $('#myModal .modal-title').text('新增分类');
            $('#myForm input[name=id]').val('');
        } else {
            $('#myModal .modal-title').text('编辑文章分类');
        }
        //发送ajax请求，将数据显示到模态框
        $.ajax({
            type: 'get',
            url: bigNew.category_search,
            data: {
                id: $(e.relatedTarget).data('id')
            },
            success: function (res) {
                $('#myForm input[name=id]').val(res.data[0].id);
                $('#myForm input[name=name]').val(res.data[0].name);
                $('#myForm input[name=slug]').val(res.data[0].slug);
            }
        })
    });
    //给确定按钮添加事件，发送请求数据
    //首先要判断是添加还是更新操作，根据隐藏域中有无值判断
    $('.btn-sure').on('click', function () {
        var id = $('#myForm input[name=id]').val();
        $.ajax({
            type: 'post',
            url: id ? bigNew.category_edit : bigNew.category_add,
            data: $('#myForm').serialize(),
            success: function (res) {
                if (res.code == 201 || res.code == 200) {
                    //隐藏模态框并刷新页面
                    $('#myModal').modal('hide');
                    render();
                }
            }
        })
    })
})