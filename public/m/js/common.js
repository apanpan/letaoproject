window.CT = {};
CT.getParamsByUrl = function () {
    var params = {};
    var search = location.search;
    if (search) {
        search = search.replace('?','');
        var arr = search.split('&');
        arr.forEach(function (item,i){
            var itemArr = item.split('=');
            params[itemArr[0]] = itemArr[1];
            // console.log(params[itemArr[0]]);
            // console.log(itemArr[1]);
        })
    }
    // console.log(params);
    return params;
}