$(function () {

    //1.一级分类默认渲染 第一个一级分类对应的二级分类
    getFirstCategoryData(function (data) {
        // 一级分类默认渲染
        //模板的使用顺序：json数据，定义模板，调用模板，返回html
        $('.cate_left ul').html(template('firstTemplate',data));
        render($('.cate_left ul li:first-child').find('a').attr('data-id'));
        getSecondCategoryData({
                id:$('.cate_left ul li:first-child').find('a').attr('data-id')
            },function (data) {
            // console.log(data);
            $('.cate_right ul').html(template('secondTemplate',data));
        });
        $('.cate_left').on('tap','a',function(e){
            if ($(this).parent().hasClass('now')) return false;
            $('.cate_left li').removeClass('now');
            $(this).parent().addClass('now');
            render($(this).attr('data-id'));
        });
    });

});
//一级分类请求方法
var getFirstCategoryData = function (callback) {
    $.ajax({
        url:'/category/queryTopCategory',
        type:'get',
        data:'',
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
};
//二级分类请求方法
var getSecondCategoryData = function (params,callback) {
    $.ajax({
        url:'/category/querySecondCategory',
        type:'get',
        data:params,
        dataType:'json',
        success:function (data) {
            console.log(data);
            callback && callback(data);
        }
    });
};
//二级分类解决冗余代码方法
var render = function (categoryId) {
    getSecondCategoryData({
        id:categoryId
    },function (data) {
        $('.cate_right ul').html(template('secondTemplate',data));
    })
}