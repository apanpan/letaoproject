$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false //是否显示滚动条
    });
    getProductData(CT.getParamsByUrl().productId,function (data) {
        //清除加载状态
        $('.loading').remove();
        //渲染商品详情页
        $('.mui-scroll').html(template('detail',data));
        mui('.mui-slider').slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
        });
    })
})
var getProductData = function (productId,callback) {
    $.ajax({
        url:'/product/queryProductDetail',
        type:'get',
        data:{
            id: productId
        },
        dataType:'json',
        success:function (data) {
            setTimeout(function () {
                callback && callback(data);
            },1000);
        }
        })
}