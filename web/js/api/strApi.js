/**
 * 字符串Api
 * @since 2019-01-02
 */
(function (defineFn) {
    define(['exports'], defineFn);
})(function (api) {

    var commonSplitRegex = /[\s`·~!！@#$￥%^…&*()（）\-—+=\[\]【】{}｛｝\\|、;；:：'‘’"“”,，.。<>《》/?？]+/;

    /**
     * 通用拆分
     * 按空白字符、中英文标点拆分字符串
     * 同时去除空串
     * @param {string} str
     * @return {string[]}
     */
    api.commonSplit = function commonSplit(s) {
        if (typeof s === 'number')
            s += '';
        else if (typeof s !== 'string' || !s)
            return [];

        return s
            .split(commonSplitRegex)
            .filter(function (x) {
                return !!x;
            });
    };


    api.isNotNull = function (obj) {
        if (obj === "" || typeof (obj) == "undefined" || obj == null) {
            return false;
        } else return true;
    }

    api.isNull = function (obj) {
        return !api.isNotNull(obj);
    };


    /**
     * 字符串转数字
     * @param arr
     * @returns {*}
     */
    api.stringPropToNum = function (arr) {
        var isArray = function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        if (isArray(arr)) {//数组
            for (var i = 0; i < arr.length; i++) {
                api.stringPropToNum(arr[i]);
            }
        } else {//对象
            for (x in arr) {
                if (isArray(arr[x])) {
                    api.stringPropToNum(arr[x]);
                    continue;
                }
                if (arr[x] == "" || isNaN(Number(arr[x]))) {
                    continue;
                }
                if (String(arr[x]).length != String(Number(arr[x])).length) {
                    continue;
                }
                if (parseFloat(arr[x]) > 999999999999999) {   //超出精度 不转换
                    continue
                }
                arr[x] = Number(arr[x]);
            }
        }

        return arr;
    }

    /**
     * 数字转字符串
     * @param obj
     * @returns {*}
     */
    api.numPropToString = function (obj) {
        if (typeof obj == "array" || (obj instanceof Array)) {
            for (var i = 0; i < obj.length; i++) {
                obj[i] = api.numPropToString(obj[i])
            }
        } else {
            for (x in obj) {
                if (typeof obj[x] === 'number') {
                    obj[x] = String(obj[x]);
                }
            }
        }
        return obj;
    }

});