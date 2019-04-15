$(function () {
    mui('.mui-scroll-wrapper').scroll({
        indicators: false //是否显示滚动条
    });
    //1.页面初始化的时候，关键字在输入框内显示
    //获取关键字
    var urlParams = CT.getParamsByUrl();
    var $input = $('input').val(urlParams.key || '');
    // console.log($input);
    //2.页面初始化的时候，根据关键字查询第一页数据
    getSearchData({
        proName:urlParams.key,
        page:1,
        pageSize:4
    },function (data) {
        $('.ct_product').html(template('list',data));
    })
    //3.用户点击搜索的时候,根据新的关键字搜索商品，重置排序功能
    $('.ct_search a').on('tap',function () {
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        getSearchData({
            proName:key,
            page:1,
            pageSize:4
        },function (data) {
            $('.ct_product').html(template('list',data));
        })
    })
    //4.用户点击排序的时候，根据排序的选项去进行排序（默认的时候是 降序 再次点击时是升序）
    $('.ct_order a').on('tap', function () {
        //当前点击的A
        var $this = $(this);
        if (!$this.hasClass('now')) {
            //选中，其他的就不选中，箭头默认朝下
            $this.addClass('now').siblings().removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        }
        //有now的时候
        else {
            //改当前箭头方向
            if ($this.find('span').hasClass('fa-angle-down')) {
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }
        //获取当前点击的功能参数 price 1 2 num 1 2
        var order = $this.attr('data-order');
        var orderVal = $this.find('span').hasClass('fa-angle-up') ? 1 : 2;
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        //获取数据
        var params = {
            proName:key,
            page:1,
            pageSize:4
        }
        params[order] = orderVal;
        getSearchData(params, function (data) {
            $('.ct_product').html(template('list',data));
        })
    })
    //5.用户下拉的时候，根据当前条件刷新 上拉加载重置
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                //style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                //color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                //height:'50px',//可选,默认50px.下拉刷新控件的高度,
                //range:'100px', //可选 默认100px,控件可下拉拖拽的范围
                //offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
                auto: true,//可选,默认false.首次加载自动上拉刷新一次
                callback :function () {
                        var key = $.trim($input.val());
                        if (!key) {
                            mui.toast('请输入关键字');
                            return false;
                        }
                        //排序重置
                        $('.ct_order a').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
                        getSearchData({
                            proName:key,
                            page:1,
                            pageSize:4
                        },function (data) {
                            setTimeout(function () {
                                $('.ct_product').html(template('list',data));
                                mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                            },1000)
                        })
                }
            },
            up : {
                //auto:true,//可选,默认false.自动上拉加载一次
                callback :function () {
                    window.page++;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    var order = $('.ct_order a.now').attr('data-order');
                    var orderVal = $('.ct_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
                    var params = {
                        proName:key,
                        page:window.page,
                        pageSize:4
                    }
                    params[order] = orderVal;
                    getSearchData(params,function (data) {
                        setTimeout(function () {
                            $('.ct_product').append(template('list',data));
                            if (data.data.length) {
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            }else{
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            }
                            // mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                        },1000);
                    })
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });
    //6.用户上拉的时候，加载下一页数据（没有数据就不去加载）
});
var getSearchData = function (params,callback) {
    $.ajax({
        url:'/product/queryProduct',
        type:'get',
        data:params,
        dataType:'json',
        success:function (data) {
            //存页码
            window.page = data.page;
            callback && callback(data);
            // console.log(data);
        }
    })
};