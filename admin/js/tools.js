//工具函数
$(function (w) {
    var utils = {
        convertToObj: function (str) {
            var arr = str.split('&');
            var obj = {}
            for (let i = 0; i < arr.length; i++) {
                var temp = arr[i].split('=');
                obj[temp[0]] = temp[1];
            }
            return obj;
        }
    }
    w.utils = utils;
}(window))