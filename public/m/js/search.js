$(function () {
    $('.ct_search a').on('tap',function () {
        //获取清除空格后input的值
        var key = $.trim($('input').val());
        //判断有没有关键字
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        //如果合法---跳转
        location.href = 'searchList.html?key='+key;
    })
})