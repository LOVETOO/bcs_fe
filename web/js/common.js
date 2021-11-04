/**
 * Common
 *
 */
define(['jquery', 'angular', 'app', 'requestApi'], function ($, angular, app, requestApi) {
//========================================补丁-开始========================================
    (function () {

        /**
         * 不支持时才覆盖
         * @param {Function} fun 函数
         * @param {Object} patch 补丁
         */
        function patchTo(fun, patch) {
            for (var key in patch) {
                if (!fun.prototype[key]) {
					Object.defineProperty(fun.prototype, key, {
						value: patch[key]
					});
				}
            }
        }

        /**
         * 强制覆盖
         * @param {Function} fun 函数
         * @param {Object} patch 补丁
         */
        function forcePatchTo(fun, patch) {
            for (var key in patch) {
				Object.defineProperty(fun.prototype, key, {
					value: patch[key]
				});
            }
        }

        /**
         * 判断是否是字符串
         * @param value
         * @return {boolean}
         */
        function isStr(value) {
            return typeof value === 'string';
        }

        /**
         * 判断是否是对象
         * @param value
         * @return {boolean}
         */
        function isObj(value) {
            return value !== null && typeof value === 'object';
        }

        /**
         * 判断是否是函数
         * @param value
         * @return {boolean}
         */
        function isFun(value) {
            return typeof value === 'function';
        }

        /**
         * 判断是否是对象或函数
         * @param value
         * @return {boolean}
         */
        function isObjOrFun(value) {
            return isObj(value) || isFun(value);
        }

//----------------------------------------兼容性补丁-开始----------------------------------------

        /**
         * 字符串
         */
        patchTo(String, {

            /**
             * includes() 方法用于判断一个字符串是否包含在另一个字符串中，根据情况返回true或false。
             * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/includes
             * @param {string} searchString 要在此字符串中搜索的字符串。
             * @param {number} [position] 可选。从当前字符串的哪个索引位置开始搜寻子字符串；默认值为0。
             * @return {boolean} 如果当前字符串包含被搜寻的字符串，就返回true；否则，返回false。
             */
            includes: function (searchString, position) {
                return this.indexOf(searchString, position) >= 0;
            },

            /**
             * startsWith() 方法用来判断当前字符串是否是以另外一个给定的子字符串“开头”的，根据判断结果返回 true 或 false。
             * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
             * @param {string} searchString 要在此字符串中搜索的字符串。
             * @param {number} [position] 可选。在 str 中搜索 searchString 的开始位置，默认值为 0，也就是真正的字符串开头处。
             * @return {boolean}
             */
            startsWith: function (searchString, position) {
                return this.indexOf(searchString, position) === 0;
            },

            /**
             * endsWith() 方法用来判断当前字符串是否是以另外一个给定的子字符串“结尾”的，根据判断结果返回 true 或 false。
             * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
             * @param {string} searchString 要在此字符串中搜索的字符串。
             * @param {number} [position] 可选。在 str 中搜索 searchString 的结束位置，默认值为 str.length，也就是真正的字符串结尾处。
             * @return {boolean}
             */
            endsWith: function (searchString, position) {
                if (!isStr(searchString) && !(searchString instanceof String))
                    searchString = searchString.toString();
                return this.lastIndexOf(searchString, position) + searchString.length === (position === undefined ? this.length : position);
            }

        });

        /**
         * 数组
         */
        patchTo(Array, {

			/**
             * includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。
             * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
             * @param {string} valueToFind 需要查找的元素值。
             * @param {number} [position] 可选。从fromIndex 索引处开始查找 valueToFind。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜 （即使从末尾开始往前跳 fromIndex 的绝对值个索引，然后往后搜寻）。默认为 0。
             * @return {boolean} 返回一个布尔值 Boolean ，如果在数组中找到了（如果传入了 fromIndex ，表示在 fromIndex 指定的索引范围中找到了）则返回 true。
             */
			includes: function (valueToFind, fromIndex) {
				return this.indexOf(valueToFind, fromIndex) >= 0;
			},

            /**
             * find() 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。
             * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/find
             * @param {(element: T, index: number, array: T[]) => T} test 测试函数
             * @param context 上下文
             * @return {T} 满足提供的测试函数的第一个元素的值
             */
            find: function (test, context) {
                if (isObjOrFun(context))
                    test = test.bind(context);

                for (var i = 0, len = this.length; i < len; i++) {
                    var element = this[i];
                    if (test(element, i, this) === true)
                        return element;
                }
            },

            /**
             * findIndex() 方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回 -1。
             * @link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
             * @param {(element: T, index: number, array: T[]) => T} test 测试函数
             * @param context 上下文
             * @return {number} 满足提供的测试函数的第一个元素的的索引
             */
            findIndex: function (test, context) {
                if (isObjOrFun(context))
                    test = test.bind(context);

                for (var i = 0, len = this.length; i < len; i++) {
                    var element = this[i];
                    if (test(element, i, this) === true)
                        return i;
                }
                return -1;
            }

        });

//----------------------------------------兼容性补丁-结束----------------------------------------

//----------------------------------------扩展性补丁-开始----------------------------------------

        /**
         * 数字
         */
        patchTo(Number, {

            /**
             * 返回金额格式化的字符串
             * @return {string}
             */
            toMoney: function () {
                return HczyCommon.formatMoney(this);
            }

        });

        /**
         * 数组
         */
        patchTo(Array, {

            /**
             * 返回数组首个元素
             * @return {T}
             */
            first: function () {
                return this[0];
            },

            /**
             * 返回数组最后一个元素
             * @return {T}
             */
            last: function () {
                return this[this.length - 1];
            }

        });

//----------------------------------------扩展性补丁-结束----------------------------------------

    })();
//========================================补丁-结束========================================

//Extend js Object
    String.prototype.trim = function () {
        //用正则表达式将前后空格用空字符串替代。
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
    Number.prototype.toDecimal = function (num) {
        var f = parseFloat(this);
        if (isNaN(f)) {
            return 0;
        }
        var s_num = 0;
        if (num != undefined) {
            s_num = num;
        }
        var s_total = Math.pow(10, s_num);

        var f = Math.ceil(this * s_total) / s_total;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + num) {
            s += '0';
        }
        return s;
    }
    /**
     * 数组排序
     */
    Array.prototype.SortBy = function (type) {
        var flag = type || 1;
        switch (flag) {
            case 1:
                this.sort(function (a, b) {
                    return a - b;
                });
                break;//从小到大
            default:
                this.sort();
        }
    }
    /**
     * 数组生成ID/自定义field
     * @param field
     */
    Array.prototype.genID = function (field) {
        var fieldname = field || "id";
        for (var i = 0; i < this.length; i++) {
            this[i][fieldname] = (i + 1);
        }
    }

    /**
     *  删除数组元素:Array.removeArr(index)
     */
    Array.prototype.removeItem = function (index) {
        if (isNaN(index) || index >= this.length) {
            return false;
        }
        this.splice(index, 1);
    }
    /**
     *  删除数组元素:Array.removeItem(arr) arr 是Array的下标数组 -- 注意-有序从小到大数组
     */
    Array.prototype.removeItems = function (arr) {
        if (!arr && typeof arr != "object") {
            return false;
        }
        var tempArr = [].concat(arr);
        if (tempArr.length) {
            var l = tempArr.length;
            this.removeItem(tempArr[l - 1]);
            tempArr.removeItem((l - 1));
            this.removeItems(tempArr);
        }
    }

    Number.prototype.toPercent = function () {
        return (Math.round(this * 10000) / 100).toFixed(2) + '%';
    }
    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

//End Extend js Object


    /* var  */
    HczyCommon = {};

    /**
     * extend(childrenCtrl,parentCtrl);
     *  childrenCtrl.__super__.constructor.apply(this, arguments);
     */
//extend function generated by CoffeeScript
    var hasProp = {}.hasOwnProperty;
    HczyCommon.extend = function (child, parent) {
        for (var key in parent) {
            if (hasProp.call(parent, key))
                child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

//字符串转为json格式
//默认的 JSON.stringify()与 JSON.parse(); 在swfupload不起作用 。函数外是可以以用
    function strToJson(str) {
        var json = (new Function("return " + str))();
        return json;
    }

    HczyCommon.concat_sqlwhere = function (sqlwhere, addsql) {
        sqlwhere = (sqlwhere || "").trim();
        addsql = (addsql || "").trim();
        if (sqlwhere.length > 0 && addsql.length > 0) {
            if (sqlwhere.indexOf(addsql) == -1 && addsql.indexOf(sqlwhere) == -1) {
                return "(" + sqlwhere + ") and (" + addsql + ")"
            } else if (sqlwhere.indexOf(addsql) > -1) {
                return sqlwhere
            } else if (addsql.indexOf(sqlwhere) > -1) {
                return addsql
            }
        }
        else if (sqlwhere == "" && addsql.length > 0) {
            return addsql
        }
        else if (sqlwhere.length > 0 && addsql.length == 0) {
            return sqlwhere
        }
        else if (sqlwhere.length == 0 && addsql.length == 0) {
            return ""
        }
    }
    HczyCommon.whatAttachIcon = function (filename) {
        var attachType = "";
        var strExtName = filename ? (filename.split(".").length > 1 ? filename.split(".")[1].toLowerCase() : "") : "";//获取文件扩展名
        var filetypes = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt"];//文件类型
        var mediatypes = ["wav", "mp3"];
        var imagetypes = ["jpg", "png", "gif", "bmp", "jpeg"];//图片类型
        var drawtypes = ["prt", "drw", "asm", "sldprt", "slddrw", "sldasm"];//图纸类型
        var exetypes = ["exe"];
        var pdftypes = ["pdf"];
        //如果是文档类型
        if ($.inArray(strExtName, filetypes) >= 0) {
            if (strExtName == "doc" || strExtName == "docx") {
                attachType = "doc";
            } else if (strExtName == "ppt" || strExtName == "pptx") {
                attachType = "ppt";
            } else if (strExtName == "xls" || strExtName == "xlsx") {
                attachType = "xls";
            } else {
                attachType = strExtName;
            }
        }
        //如果是图片类型  nxm 2014-10-23
        else if ($.inArray(strExtName, imagetypes) >= 0) {
            attachType = "img";
        }
        else if ($.inArray(strExtName, mediatypes) >= 0) {
            attachType = "img";
        }
        else if ($.inArray(strExtName, drawtypes) >= 0) {
            attachType = "img";
        }
        else if ($.inArray(strExtName, exetypes) >= 0) {
            attachType = "img";
        }
        else if ($.inArray(strExtName, pdftypes) >= 0) {
            attachType = "pdf";
        }
        //如果解析到文件类型 nxm 2014-10-23
        if (attachType) {
            return attachType + ".png";
        } else {
            return "unknowfile.png";
        }
    }

    /**
     * 判断文件类型获取icon
     * @param filename
     * @returns {*}
     */
    HczyCommon.getAttachIcon = function (filename) {
        var attachType = "";
        var strExtName = filename ? (filename.split(".").length > 1 ? filename.split(".")[1].toLowerCase() : "") : "";//获取文件扩展名
        var filetypes = ["doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt"];//文件类型
        var mediatypes = ["wav", "mp3"];
        var imagetypes = ["jpg", "png", "gif", "bmp", "jpeg"];//图片类型
        var drawtypes = ["prt", "drw", "asm", "sldprt", "slddrw", "sldasm"];//图纸类型
        var exetypes = ["exe"];
        var pdftypes = ["pdf"];
        //如果是文档类型
        if ($.inArray(strExtName, filetypes) >= 0) {
            if (strExtName == "doc" || strExtName == "docx") {
                return "fa-file-word-o";
            } else if (strExtName == "ppt" || strExtName == "pptx") {
                return "fa-file-powerpoint-o";
            } else if (strExtName == "xls" || strExtName == "xlsx") {
                return "fa-file-excel-o";
            } else {
                return "fa-file-text-o";
            }
        }
        //如果是图片类型  nxm 2014-10-23
        else if ($.inArray(strExtName, imagetypes) >= 0) {
            return "fa-file-image-o";
        }
        else if ($.inArray(strExtName, mediatypes) >= 0) {
            return "fa-file-image-o";
        }
        else if ($.inArray(strExtName, drawtypes) >= 0) {
            return "fa-file-image-o";
        }
        else if ($.inArray(strExtName, exetypes) >= 0) {
            return "fa-file-image-o";
        }
        else if ($.inArray(strExtName, pdftypes) >= 0) {
            return "fa-file-pdf-o";
        } else {

            return "fa-file-text-o";
        }
    }
    HczyCommon.arrSortId = function (elements, k) {
        var key = k || 'id';
        for (var i = 0; i < elements.length - 1; i++) {
            for (var j = 0; j < elements.length - i - 1; j++) {
                if (elements[j][key] > elements[j + 1][key]) {
                    var swap = elements[j];
                    elements[j] = elements[j + 1];
                    elements[j + 1] = swap;
                }
            }
        }
    }
    HczyCommon.getNewDay = function (dateTemp, days) {
        var dateTemp = dateTemp.split("-");
        var nDate = new Date(dateTemp[1] + '-' + dateTemp[2] + '-' + dateTemp[0]); //转换为MM-DD-YYYY格式
        var millSeconds = Math.abs(nDate) + (days * 24 * 60 * 60 * 1000);
        var rDate = new Date(millSeconds);
        var year = rDate.getFullYear();
        var month = rDate.getMonth() + 1;
        if (month < 10) month = "0" + month;
        var date = rDate.getDate();
        if (date < 10) date = "0" + date;
        return (year + "-" + month + "-" + date);
    }
    HczyCommon.arrSortByProp = function (arr, prop, desc) {
        var props = [],
            ret = [],
            i = 0,
            len = arr.length;
        if (typeof prop == 'string') {
            for (; i < len; i++) {
                var oI = arr[i];
                (props[i] = new String(oI && oI[prop] || ''))._obj = oI;
            }
        }
        else if (typeof prop == 'function') {
            for (; i < len; i++) {
                var oI = arr[i];
                (props[i] = new String(oI && prop(oI) || ''))._obj = oI;
            }
        }
        else {
            throw '参数类型错误';
        }
        props.sort();
        for (i = 0; i < len; i++) {
            ret[i] = props[i]._obj;
        }
        if (desc) ret.reverse();
        return ret;
    };

    HczyCommon.stringPropToNum = function (arr) {
        var isArray = function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        if (isArray(arr)) {//数组
            for (var i = 0; i < arr.length; i++) {
                HczyCommon.stringPropToNum(arr[i]);
            }
        } else {//对象
            for (x in arr) {
                if (isArray(arr[x])) {
                    HczyCommon.stringPropToNum(arr[x]);
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
    HczyCommon.numPropToString = function (obj) {
        if (typeof obj == "array" || (obj instanceof Array)) {
            for (var i = 0; i < obj.length; i++) {
                obj[i] = HczyCommon.numPropToString(obj[i])
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

    HczyCommon.toDecimal2 = function (x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }


    /**
     * 复制一个对象的数据给另一个对象
     */

    HczyCommon.copyobj1 = function (r, s, is_overwrite) { //TODO:
        if (!s || !r) return r;
        for (var p in s) {
            if (is_overwrite != false || !(p in r)) {
                r[p] = s[p];
            }
        }
        return r;
    }
    HczyCommon.copyobj = function (sourceobj, targetobj) {
        var isArray = function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        if (isArray(sourceobj)) {//数组
            for (var i = 0; i < sourceobj.length; i++) {
                targetobj[i] = {};
                HczyCommon.copyobj(sourceobj[i], targetobj[i]);
            }
        } else {//对象
            for (var name in sourceobj) {
                if (isArray(sourceobj[name])) {
                    targetobj[name] = [];
                    HczyCommon.copyobj(sourceobj[name], targetobj[name]);
                    continue;
                }
                targetobj[name] = sourceobj[name];
            }
        }
        return targetobj;
    }

    /**
     * 复制一个对象的数据给另一个对象
     */
    HczyCommon.copyScope = function (sourceobj, targetobj) {
        for (var name in sourceobj) {
            if (name.indexOf("$") > -1) continue;
            targetobj[name] = sourceobj[name];
        }
    };
    /**
     * 对象字段排序
     */
    HczyCommon.compare = function (propertyName) {
        return function (object1, object2) {
            var value1 = parseInt(object1[propertyName]);
            var value2 = parseInt(object2[propertyName]);
            if (value2 < value1) {
                return -1;
            } else if (value2 > value1) {
                return 1;
            }
            else {
                return 0;
            }
        }
    }

    HczyCommon.dateFormatCheck = function (date) {
        if (typeof (date) == "undefined" || isNaN(date) || date == null || date == "") {
            return false
        } else {
            return true
        }
    }
    /**
     *
     * @param data
     * @param id_field
     * @param parent_field
     * @param lev_field
     * @returns
     */
    HczyCommon.toTreeDataSort = function (data, id_field, parent_field, lev_field) {
        var tree = [];
//    var lev_field = "areatype";
        var lev_list = [];
        var items_list = [];

        for (var i = 0; i < data.length; i++) {
            var is_new_lev = true;
            for (var j = 0; j < lev_list.length; j++) {
                if (lev_list[j] == data[i][lev_field]) {
                    is_new_lev = false;
                    break;
                }
            }
            if (is_new_lev) {//新的一层
                lev_list.push(data[i][lev_field]);
                var new_lev_obj = {
                    lev: data[i][lev_field],//该层的层次
                    container: []//该层的元素
                };
                new_lev_obj.container.push(data[i]);
                items_list.push(new_lev_obj);
            } else {//已经有该层次
                for (var m = 0; m < items_list.length; m++) {
                    if (items_list[m].lev == data[i][lev_field]) {
                        items_list[m].container.push(data[i]);
                    }
                }
            }

        }

        /**
         * 排序
         */
        function compare(propertyName) {
            return function (object1, object2) {
                var value1 = parseInt(object1[propertyName]);
                var value2 = parseInt(object2[propertyName]);
                if (value1 < value2) {
                    return -1;
                } else if (value1 > value2) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }

        if (items_list.length) items_list.sort(compare("lev"));
        if (items_list.length == 1) {
            return {
                tree: items_list[0].container,
                levobj: []
            };
        }

        var first_group = items_list[0].container;
        for (var i = 0; i < first_group.length; i++) {
            var first = first_group[i];
            var list = [];
            for (var j = 0; j < items_list.length; j++) {
                if (parseInt(first[lev_field]) + 1 == parseInt(items_list[j].lev)) {
                    list = items_list[j].container;
                    break;
                }
            }
            tree.push(first);
            tree = tree.concat(getChildrenList(first, list));
        }

        function getChildrenList(parent, list) {
            var _list = [];
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                item._collapsed = true;
                if (parent[id_field] == item[parent_field]) {
                    _list.push(item);
                    var childrentemp = [];//当前层是否还有下一层次
                    for (var j = 0; j < items_list.length; j++) {
                        if (parseInt(item[lev_field]) + 1 == parseInt(items_list[j].lev)) {
                            childrentemp = items_list[j].container;
                            break;
                        }
                    }
                    if (childrentemp.length) {
                        var temp = getChildrenList(item, childrentemp);
                        _list = [].concat(_list.concat([].concat(temp)));
                    }

                }
            }
            return _list;
        }

        return {
            tree: tree,
            levobj: items_list
        };
    }

    /**
     * 刷新传入的网格
     */
    HczyCommon.refreshGrid = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof(arguments[i]) != 'undefined') {
                arguments[i].resizeCanvas();
            }
        }
    }
    /**
     * commitgrid
     */
    HczyCommon.commitGrid = function () {
        for (var i = 0; i < arguments.length; i++) {
            if (typeof(arguments[i]) != 'undefined') {
                if (arguments[i].getCellEditor() != undefined) {
                    arguments[i].getCellEditor().commitChanges();
                }
            }
        }
    }

    HczyCommon.GridRowHighlight = function (row) {
        if (this[row].is_close == '2') {
            return {
                cssClasses: 'not-null'
            };
        }
        if (this[row].slickgrid_sum) {
            return {
                "columns": {
                    "duration": {
                        "colspan": Object.getOwnPropertyNames(this[row]).length - 1
                    }
                }
            };
        }
        return null;

    }

    /**
     * 检验号码
     */
    HczyCommon.checkTel = function (value) {
        if (!value) return false;
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isMob = /^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
        if (isMob.test(value) || isPhone.test(value)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 拼接逗号
     */
    HczyCommon.appendComma = function () {
        var return_str = "";
        if (arguments.length === 0) {
            return return_str;
        }
        else if (arguments.length === 1) {
            if (typeof arguments[0] == "object" && !arguments[0].length) {
                return return_str;
            }
            for (var i = 0; i < arguments[0].length; i++) {
                return_str += arguments[0][i] + ",";
            }
            return_str = return_str.substring(0, return_str.length - 1);
            return return_str;
        }
        else if (arguments.length >= 2) {
            if (typeof arguments[0] != "object" || !arguments[0].length || typeof arguments[0][0] != "object") {
                return return_str;
            }
            var stat = false;
            var param_list = new Array();//
            for (var i = 1, l = arguments.length; i < l; i++) {
                if (typeof arguments[i] != "string") {
                    stat = true;
                }
                param_list.push(arguments[i]);
            }
            if (stat) {
                console.log("arguments prop contains object");
                return return_str;
            }
            var back_list = new Array(param_list.length);
            for (var j = 0, l = arguments[0].length; j < l; j++) {
                for (var m = 0, n = param_list.length; m < n; m++) {

                    if (arguments[0][j][param_list[m]] == undefined) continue;
                    if (j == 0) {
                        back_list[m] = arguments[0][j][param_list[m]];
                        continue;
                    }
                    back_list[m] += "," + arguments[0][j][param_list[m]];
                }

            }
            if (back_list.length == 1) return_str = back_list[0];
            else return_str = back_list;
        }
        return return_str;
    }
    /*
     datas 数据集 类型：数值
     object   需要判断的对象 类型：对象
     datasColumns 唯一表示的列(数组的列)类型：数值
     objColumns,obj相应唯一校验的列 类型：数值
     */
    HczyCommon.toThousands = function (num) {
        return (num.toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    };
    HczyCommon.toThousands2 = function (num) {
        return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    };
    HczyCommon.isExist = function (datas, object, datasColumns, objColumns) {
        if (datas.length == 0) {
            return {
                exist: false,
            }
        }
        if (objColumns == undefined) {
            objColumns = datasColumns;
        }
        var i;
        for (i = 0; i < datas.length; i++) {
            var count = 0;
            for (var j = 0; j < datasColumns.length; j++) {
                if (datas[i][datasColumns[j]] == object[objColumns[j]]) {
                    count++;
                }
            }
            if (count == (datasColumns.length)) {
                break;
            }
        }
        if (count == (datasColumns.length)) {
            return {
                index: i,
                exist: true,
            }
        } else {
            return {
                exist: false,
            }
        }
    };


    /*
     grid 数据放入的网格
     inputDatas   放入的数组
     uniqueColumns 唯一表示
     */
    HczyCommon.pushUniqueRow = function (datas, inputDatas, uniqueColumns) {
        var length = datas.length;
        var m = 1;

        var isNotEqual = function (container, object) {
            if (container.length == 0) {
                return true;
            }
            for (var i = 0; i < length; i++) {
                var count = 0;
                for (var j = 0; j < uniqueColumns.length; j++) {
                    if (container[i][uniqueColumns[j]] == object[uniqueColumns[j]]) {
                        count++;
                    }
                }
                if (count == (uniqueColumns.length)) {
                    break;
                }
            }
            if (count == (uniqueColumns.length)) {
                return false
            } else {
                return true;
            }
        }
        for (var i = 0; i < inputDatas.length; i++) {
            if (isNotEqual(datas, inputDatas[i])) {
                inputDatas[i].seq = length + m;
                m++;
                datas.push(inputDatas[i]);
            }
        }
    };

    HczyCommon.getCurrentMonthLast = function () {
        var date = new Date();
        var currentMonth = date.getMonth();
        var nextMonth = ++currentMonth;
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
        var oneDay = 1000 * 60 * 60 * 24;
        return new Date(nextMonthFirstDay - oneDay);
    }
    /* StrArray传入需要搜索菜单数组,比较的str
     返回str在StrArray的序号
     如果不在StrArray中，返回false
     * */
    HczyCommon.getStrIndex = function (StrArray, str) {
        for (var i = 0; i < StrArray.length; i++) {
            if (StrArray[i] == str) {
                return i;
            }
        }
        return false;
    }
    /* StrArray传入需要搜索菜单数组,比较的str
     返回str在StrArray的序号
     如果不在StrArray中，返回false
     * */
    HczyCommon.wm_concat = function (datas, colname, spacestr) {
        var returnStr = "";
        for (var i = 0; i < datas.length; i++) {
            if (datas[i][colname] == undefined || datas[i][colname] == "") {
                return;
            }
            datas[i][colname] = "'" + datas[i][colname] + "'";
            if (i == datas.length - 1) {
                returnStr += datas[i][colname]
            } else {
                returnStr += datas[i][colname] + spacestr;
            }
        }
        return returnStr;
    }
    /**
     * 金额千分位精度显示
     */
    HczyCommon.formatMoney = function (mVal, iAccuracy) {
        if (mVal === undefined) return '';

        var fTmp = 0.00;//临时变量
        var iFra = 0;//小数部分
        var iInt = 0;//整数部分
        var aBuf = new Array(); //输出缓存
        var bPositive = true; //保存正负值标记(true:正数)
        /**
         * 输出定长字符串，不够补0
         * <li>闭包函数</li>
         * @param int iVal 值
         * @param int iLen 输出的长度
         */
        function funZero(iVal, iLen) {
            var sTmp = iVal.toString();
            var sBuf = new Array();
            for (var i = 0, iLoop = iLen - sTmp.length; i < iLoop; i++)
                sBuf.push('0');
            sBuf.push(sTmp);
            return sBuf.join('');
        };

        if (typeof(iAccuracy) === 'undefined')
            iAccuracy = 2;
        bPositive = (mVal >= 0);//取出正负号
        fTmp = (isNaN(fTmp = parseFloat(mVal))) ? 0 : Math.abs(fTmp);//强制转换为绝对值数浮点
        //所有内容用正数规则处理
        iInt = parseInt(fTmp); //分离整数部分
        iFra = parseInt((fTmp - iInt) * Math.pow(10, iAccuracy) + 0.5); //分离小数部分(四舍五入)

        do {
            aBuf.unshift(funZero(iInt % 1000, 3));
        } while ((iInt = parseInt(iInt / 1000)));
        aBuf[0] = parseInt(aBuf[0]).toString();//最高段区去掉前导0
        return ((bPositive) ? '' : '-') + aBuf.join(',') + '.' + ((0 === iFra) ? '00' : funZero(iFra, iAccuracy));
    }


    /**
     * 金额去掉千分号
     */
    HczyCommon.Reverse = function (num) {
        if (typeof(i) == "undefined") {
            i = 0;
        }
        if (typeof(i) == "string") {
            i = i.replace(/\,/ig, '');
            return parseFloat(i);
        } else {
            i = i.toString().replace(/\,/ig, '');
            return parseFloat(i);
        }
        /*if (typeof(num) != "number") {
            var regexStr = /(\d{1,3})(?=(\d{3})+(?:$|\.))/g;
            var resultStr = num.replace(re, "$1,")
            num = parseFloat(num);
        }
        return num;*/

    }

    /**
     * angular视图安全更新
     * @param $scope
     */
    HczyCommon.safeApply = function ($scope, fn) {
        fn = fn ? fn : {};
        ($scope.$$phase || $scope.$root.$$phase) ? fn() : $scope.$apply(fn);
    };

    HczyCommon.isNotNull = function (obj) {
        if (obj === "" || typeof (obj) == "undefined" || obj == null) {
            return false;
        } else return true;
    }

    HczyCommon.isNull = function (obj) {
        return !HczyCommon.isNotNull(obj);
    };


    var aggridFormatter = {}

    aggridFormatter.dateFormat = function (params) {
        var newValue = new Date(params.value).format("yyyy-MM-dd")
        return newValue;
    }


    var common_sql = {};
    /**
     *  =1 包括值
     */
    common_sql.getSqlInField = function (filedname, values, data_type) {
        var sql1 = "";
        for (var j = 0, size1 = values.length; j < size1; j++) {
            var groupvalue = values[j].split('#');
            var pos = values[j].indexOf("#");
            var s_value = groupvalue[0];
            var e_value = groupvalue[1];

            if (data_type == "string") {
                s_value = "lower('" + s_value + "')";
                e_value = "lower('" + e_value + "')";
            }
            else if (data_type == "date") {
                s_value = " to_date('" + s_value + "','yyyy-mm-dd') ";
                e_value = " to_date('" + e_value + "','yyyy-mm-dd') ";
            }
            // 条件组合
            if (j == 0) {
                sql1 = "(lower(" + filedname + ")>=" + s_value + " and lower(" + filedname + ")<=" + e_value + ")";
            } else {
                sql1 = sql1 + " or (lower(" + filedname + ")>=" + s_value + " and lower(" + filedname + ")<=" + e_value + ")";
            }
        }
        return sql1;
    };
    /**
     * 不包含值
     */
    common_sql.getSqlNotInField = function (filedname, values, data_type) {
        var sql1 = "";
        for (var j = 0, size1 = values.length; j < size1; j++) {
            var groupvalue = values[j].split('#');
            var pos = values[j].indexOf("#");
            var s_value = groupvalue[0];
            var e_value = groupvalue[1];
            if (data_type == "string") {
                s_value = "lower('" + s_value + "')";
                e_value = "lower('" + e_value + "')";
            }
            else if (data_type == "date") {
                s_value = " to_date('" + s_value + "','yyyy-mm-dd') ";
                e_value = " to_date('" + e_value + "','yyyy-mm-dd') ";

            }
            // 条件组合
            if (j == 0) {
                sql1 = "(lower(" + filedname + ")>=" + s_value + " and lower(" + filedname + ")<=" + e_value + ")";
            } else {
                sql1 = sql1 + " and (lower(" + filedname + ")>=" + s_value + " and lower(" + filedname + ")<=" + e_value + ")";
            }
        }
        sql1 = " not (" + sql1 + ")";
        return sql1;

    };
//=3  包括值范围  ;
    common_sql.getSqlInGroup = function (filedname, values, data_type) {
        var sql = "";
        if (data_type == "number") {
            // 0 值时表示所有，排除这个字段
            if (values.indexOf("0") == -1) {
                sql = filedname + "  in (" + values + ") ";
            }
        }
        else {
            for (var j = 0, size1 = values.length; j < size1; j++) {
                var value = values[j];
                var filedsql = "";
                if (data_type == "string") {
                    // value="'"+value+"'";
                    filedsql = "lower(" + filedname + ") like lower('%" + value + "%')";
                }
                else if (data_type == "date") {
                    // value=" to_date('"+value+"','yyyy-mm-dd') ";
                    // filedsql = filedname + "=to_date('" + value + "','yyyy-mm-dd') ";
                    filedsql = " to_char(" + filedname + ",'yyyy-mm-dd') like '" + value + "%' ";
                }

                // 条件组合
                if (j == 0) {
                    sql = filedsql;
                } else {
                    sql = sql + " or  " + filedsql;
                }
            }
        }
        return sql;
    }

//=4  包括值范围  ;
    common_sql.getSqlNotInGroup = function (filedname, values, data_type) {

        var sql = "";
        if (data_type == "number") {
            sql = filedname + "  in (" + values + ") ";
        }
        else {
            for (var j = 0, size1 = values.length; j < size1; j++) {
                var value = values[j];
                var filedsql = "";
                if (data_type == "string") {
                    filedsql = "lower(" + filedname + ") like lower('" + value + "')";
                }
                else if (data_type == "date") {
                    filedsql = " to_char(" + filedname + ",'yyyy-mm-dd') like '" + value + "%' ";
                }

                // 条件组合
                if (j == 0) {
                    sql = filedsql;
                } else {
                    sql = sql + " or  " + filedsql;
                }
            }
        }
        sql = " not (" + sql + ")"
        return sql;
    }

//数值、字符、日期
    common_sql.createConditionNumber = function (obj) {

        var dateInputFromat = '<input bs-datepacker="" class="form-control input-sm ng-valid ng-dirty ng-valid-parse ng-touched s_value" value="" type="text">';

        var numberInputFromat = '<input type="number"  class="input-sm form-control s_value " value=""  >';

        var strInputFromat = '<input type="text"  class="input-sm form-control s_value " value=""  >';

        var s_DataInputFromat = strInputFromat;
        //if  (obj.type=='date')  s_DataInputFromat=dateInputFromat;
        if (obj.type == 'number') s_DataInputFromat = numberInputFromat;
        var s = obj.as ? obj.as : obj.code;
        var html = '<div  add-condtab class="tab-pane" id="' + obj.code + '"   > '
            + ' <ul id="myTab_' + obj.code + '" class="btn-group" style="margin-bottom:0px;padding-left:0;"> '
            + '	<button type="button" class="btn btn-xs btn-white active" data-target="#condtion1_' + obj.code + '" data-toggle="tab">包含值</button> '
            + '	<button type="button" class="btn btn-xs btn-white" data-target="#condtion2_' + obj.code + '" data-toggle="tab">不包含值</button> '
            + '	<button type="button" class="btn btn-xs btn-white" data-target="#condtion3_' + obj.code + '" data-toggle="tab">包含值范围</button> '
            + '	<button type="button" class="btn btn-xs btn-white" data-target="#condtion4_' + obj.code + '"data-toggle="tab">不包含值范围</button> '
            + ' </ul> '
            + ' <div id="myTabContent_' + obj.code + '" class="itab-content myTabContent" > '
            // 包括值
            + '    <div class="tab-pane fade in active" id="condtion1_' + obj.code + '"'
            + s
            + ' 	         option_name="' + obj.name + '-包括值" option_filed="' + s + '"  option_flag="3" '
            + ' 	   data_type="' + obj.type + '"   '
            + '      > '
            + '             <table class="gridtable" > '
            + ' 				<thead> '
            + ' 					<tr > '
            + ' 					    <th class="seq">关系</th> '
            + ' 						<th>数值</th> '
            + ' 						<th style="width:160px">操作</th> '
            + ' 					</tr> '
            + ' 				</thead> '
            + ' 				<tbody > '
            + ' 					<tr class="qty">	 '
            + ' 					    <td  class="seq"></td> '
            + ' 					    <td> ' + s_DataInputFromat + '</td> '
            + ' 						<td class="text-center"><a  class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>     '
            //	+' 					  	     <a   class="add"   style="mrgin-left:15px;cursor:pointer">添加条件</a> '
            + ' 					    </td> '
            + ' 					</tr> '
            + '  '
            + ' 				</tbody> '
            + ' 			</table> '
            + ' 	       <div class="filter-result m-t-xs"><a><span class="j_add_line"><i class="fa fa-plus"></i>增加一行</span></a> '
            + '         <a   class="add"   style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a></div> '
            + '    </div>	  '
            // 不包括值
            + '    <div class="tab-pane fade " id="condtion2_' + obj.code + '"'
            + ' 	         option_name="' + obj.name + '-不包括值"  '
            + ' 			 option_filed="' + s + '"   '
            + ' 			 option_flag="4" '
            + ' 	   data_type="' + obj.type + '"   '
            + '             '
            + '      > '
            + '             <table class="gridtable" > '
            + ' 				<thead> '
            + ' 					<tr > '
            + ' 					    <th class="seq">关系</th> '
            + ' 						<th>数值</th> '
            + ' 						<th style="width:160px">操作</th> '
            + ' 					</tr> '
            + ' 				</thead> '
            + ' 				<tbody > '
            + ' 					<tr class="qty">	 '
            + ' 					    <td  class="seq"></td> '
            + ' 					    <td> ' + s_DataInputFromat + '</td> '
            + ' 						<td class="text-center"><a  class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>     '
            //	+' 					  	     <a   class="add"   style="mrgin-left:15px;cursor:pointer">添加条件</a> '
            + ' 					    </td> '
            + ' 					</tr> '
            + '  '
            + ' 				</tbody> '
            + ' 			</table> '
            + ' 	       <div class="filter-result m-t-xs"><a><span class="j_add_line"><i class="fa fa-plus"></i>增加一行</span></a> '
            + '         <a   class="add"   style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a></div> '
            + '    </div>	  '
            // 包括范围
            + '    <div class="tab-pane fade"  '
            + ' 	   id="condtion3_' + obj.code + '"'
            + ' 	   option_name="' + obj.name + '-包含范围"   '
            + ' 	   option_filed="' + s + '"    '
            + ' 	   option_flag="1"   '
            + ' 	   data_type="' + obj.type + '"   '
            + '    > '
            + '             <table class="gridtable" > '
            + ' 				<thead> '
            + ' 					<tr > '
            + ' 					    <th class="seq">关系</th> '
            + ' 						<th>开始值</th> '
            + ' 						<th>结束值</th> '
            + ' 						<th style="width:160px">操作</th> '
            + ' 					</tr> '
            + ' 				</thead> '
            + ' 				<tbody > '
            + ' 					<tr >	 '
            + ' 					    <td  class="seq"></td> '
            + ' 					    <td> <input type="text"  class="input-sm form-control s_value " value=""  ></td> '
            + ' 					    <td> <input type="text"  class="input-sm form-control e_value"  value=""  ></td>	 '
            + ' 						<td class="text-center"><a  class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>   '
            //	+' 						     <a  class="add"   style="margin-left:15px;cursor:pointer">添加条件</a> '
            + ' 					    </td> '
            + ' 					</tr> '
            + ' 				</tbody> '
            + ' 			</table> '
            + ' 	       <div class="filter-result m-t-xs"><a><span class="j_add_line"><i class="fa fa-plus"></i>增加一行</span></a> '
            + '	       <a  class="add"   style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a></div> '
            + '   </div> '
            // 不包括范围
            + '     <div class="tab-pane fade " id="condtion4_' + obj.code + '"'
            + ' 	         option_name="' + obj.name + '-不包括范围" option_filed="' + s + '"   option_flag="2" '
            + ' 	   data_type="' + obj.type + '"   '
            + '  '
            + '      > '
            + '             <table class="gridtable" > '
            + ' 				<thead> '
            + ' 					<tr > '
            + ' 					    <th class="seq">关系</th> '
            + ' 						<th>开始值</th> '
            + ' 						<th>结束值</th> '
            + ' 						<th style="width:160px">操作</th> '
            + ' 					</tr> '
            + ' 				</thead> '
            + ' 				<tbody > '
            + ' 					<tr  >	 '
            + ' 					    <td  class="seq"></td> '
            + ' 					    <td> <input type="text"  class="input-sm form-control s_value " value=""  ></td> '
            + ' 					    <td> <input type="text"  class="input-sm form-control e_value"  value=""  ></td>	'
            + ' 						<td class="text-center"><a   class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>   '
            //	+' 						     <a   class="add"   style="margin-left:15px;cursor:pointer">添加条件</a> '
            + ' 					    </td> '
            + ' 					</tr> '
            + ' 				</tbody> '
            + ' 			</table> '
            + ' 	       <div class="filter-result m-t-xs"><a><span class="j_add_line"><i class="fa fa-plus"></i>增加一行</span></a> '
            + ' 		   <a class="add" style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a> </div>'
            + '    </div>'

            + ' </div> '
            + ' </div> ';

        return html;
    }


//二选一型，采用checkbox 不允许多选
    common_sql.createConditionBoolean = function (obj, isMore) {
        var s = obj.as ? obj.as : obj.code;
        var html = '<div  class="tab-pane" id="' + obj.code + '"     > '
            + ' <ul id="myTab_' + obj.code + '" class="btn-group" style="margin-bottom:0px;padding-left:0;"> '
            + '    <button type="button" class="btn btn-xs btn-white active" href="#condtion1_' + obj.code + '" data-toggle="tab">单选项</button> '
            + '    <li class="myfilter" style="display:none" ><a href="#condtion2_' + obj.code + '" data-toggle="tab">不包括范围</a></li> '
            + '    <li class="myfilter" style="display:none"><a href="#condtion3_' + obj.code + '" data-toggle="tab">包括值范围</a></li> '
            + '    <li class="myfilter" style="display:none"><a href="#condtion4_' + obj.code + '"data-toggle="tab">不包括值范围</a></li> '
            + ' </ul> '
            + ' <div id="myTabContent_' + obj.code + '" class="itab-content myTabContent" > '
            // 包括范围
            + '    <div class="tab-pane fade in active"  '
            + ' 	   id="condtion1_' + obj.code + '"'
            + ' 	   option_name="' + obj.name + '-包括范围"   '
            + ' 	   option_filed="' + s + '"    '
            + ' 	   option_flag="3"   '
            + ' 	   data_type="number"   '
            + '    > '

            + ' <table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#FF7171"> '
            + '  <thead> '
            + '	  <tr >  '
            + '    <th><span   class="j_checkbox_val">数值</span></th> '
            + '	</tr> '
            + ' </thead> '
            + '    <tbody> '
            + '    <tr> '
            + ' 		<td  > '
            + '		<input   type="checkbox"  value="0"  class="j_checkbox_one"   /><span>不限</span></td> ' // 特定条件
            + '	  </tr> ';

        // 动态值
        for (var i = 0; i < obj.dicts.length; i++) {
            html = html + '<tr> '
                + ' 		<td  > '
                + ' 		<input   type="checkbox"    value="' + obj.dicts[i].id + '"  class="j_checkbox_one" /><span>' + obj.dicts[i].name + '</span></td> '
                + ' 	  </tr> '

        }
        html += '	  </tbody> '
            + '  </table> '
            + '   </div> '
            // 不包括范围
            // 包括值范围
            // 不包括值范围
            + ' </div> '
            + ' </div> ';
        return html;
    }

//多值选择，汇值列表,采用checkbox 允许多选
    common_sql.createConditionList = function (obj) {
        var s = obj.as ? obj.as : obj.code;
        var html = '<div  class="tab-pane" id="' + obj.code + '"  > '
            + ' <ul id="myTab_' + obj.code + '" class="btn-group" style="margin-bottom:0px;padding-left:0;"> '
            + ' <button type="button" class="btn btn-xs btn-white active" href="#condtion1_' + obj.code + '" data-toggle="tab">多选项</button>'
            + '    <li class="myfilter" style="display:none" ><a href="#condtion2_' + obj.code + '" data-toggle="tab">不包括范围</a></li> '
            + '    <li class="myfilter" style="display:none"><a href="#condtion3_' + obj.code + '" data-toggle="tab">包括值范围</a></li> '
            + '    <li class="myfilter" style="display:none" ><a href="#condtion4_' + obj.code + '"data-toggle="tab">不包括值范围</a></li> '
            + ' </ul> '
            + ' <div id="myTabContent_' + obj.code + '" class="itab-content myTabContent" style="margin-left: 0px;height: 100%;"> '
            // 包括范围
            + '    <div class="tab-pane fade in active"  '
            + ' 	   id="condtion1_' + obj.code + '"'
            + ' 	   option_name="' + obj.name + '-包括范围"   '
            + ' 	   option_filed="' + s + '"    '
            + ' 	   option_flag="3"   '
            + ' 	   data_type="number"   '
            + '    > '

            + ' <table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#FF7171"> '
            + '  <thead> '
            + '	  <tr >  '
            + '    <th><span   class="j_checkbox_val">数值</span></th> '
            + '	</tr> '
            + ' </thead> '
            + '    <tbody> '
            + '    <tr> '
            + ' 		<td  > '
            + '		<input   type="checkbox"  value="0"  class="j_checkbox_more"   /><span>不限</span></td> ' // 特定条件
            + '	  </tr> ';

        // 动态值
        for (var i = 0; i < obj.dicts.length; i++) {
            html = html + '<tr> '
                + ' 		<td  > '
                + ' 		<input   type="checkbox"    value="' + obj.dicts[i].id + '"  class="j_checkbox_more" /><span>' + obj.dicts[i].name + '</span></td> '
                + ' 	  </tr> '

        }
        html += '	  </tbody> '
            + '  </table> '
            + '   </div> '
            // 不包括范围
            // 包括值范围
            // 不包括值范围
            + ' </div> '
            + ' </div> ';

        return html;

    };

    /*遮罩*/
    (function () {
        var InProgressRequests = 0,     //请求数量
            showShelterId = 0,          //显示任务ID
            hideShelterId = 0,          //隐藏任务ID
            showDelay = 1000,           //显示延迟
            minInterval = 500,          //最小显隐间隔
            requestStartTime = 0;       //上次显示时间

        function log() {
            // return console.log.apply(console, arguments);
        }

        function show() {
            showShelterId = 0;

            if (hideShelterId) {
                clearTimeout(hideShelterId);
                hideShelterId = 0;
            }

            $(".desabled-window").css("display", "flex");
            $(".shelter").css("display", "block");

            log('已显示加载动画');
        }

        function hide() {
            hideShelterId = 0;

            if (showShelterId) {
                clearTimeout(showShelterId);
                showShelterId = 0;
            }

            $(".desabled-window").css("display", "none");
            $(".shelter").css("display", "none");

            log('已隐藏加载动画');
        }

        window.IncRequestCount = (window !== top) ? top.IncRequestCount : function (str) {
            if (InProgressRequests === 0) {
                requestStartTime = new Date();

                if (hideShelterId) {
                    clearTimeout(hideShelterId);
                    hideShelterId = 0;
                }

                if (!showShelterId) {
                    log('请求开始时间', requestStartTime);
                    showShelterId = setTimeout(show, showDelay);
                }
            }

            InProgressRequests++;
        };

        window.DecRequestCount = (window !== top) ? top.DecRequestCount : function () {
            if (InProgressRequests === 1) {
                var requestEndTime = new Date();
                log('请求结束时间', requestEndTime);
                var requestInterval = requestEndTime - requestStartTime;
                log('请求时长', requestInterval);

                if (requestInterval >= minInterval) {
                    log('即时隐藏加载动画');
                    hide();
                }
                else {
                    if (showShelterId) {
                        log('取消显示加载动画');
                        clearTimeout(showShelterId);
                        showShelterId = 0;
                        hide();
                    }
                    else {
                        log('延迟隐藏加载动画');
                        hideShelterId = setTimeout(hide, minInterval - requestInterval + showDelay);
                    }
                }
            }

            if (InProgressRequests > 0)
                InProgressRequests--;
        };
    })();

	if (window === top) {
        var $scope = app.$rootScope;

        $scope.userbean = window.userbean = requestApi.syncPost({
            classId: 'base_search',
            action: 'loginuserinfo'
        });
 
        userbean.userauth = {};
        userbean.roleIdMap = {};
        if (userbean.loginuserifnos && userbean.loginuserifnos.length > 0) {
            var stringlist = userbean.loginuserifnos[0].stringofrole.split(",");
            for (var i = 0; i < stringlist.length; i++) {
                userbean.userauth[stringlist[i]] = true;
                userbean.roleIdMap[stringlist[i].toLowerCase()] = true;
            }
        }

        /**
         * 当前用户拥有指定角色吗？
         * @param {string} roleId 角色ID
         * @param {string} returnYesWhenHasAdmins 开关：当有管理员角色时返回True
         * @return {boolean}
         */
        userbean.hasRole = function (roleId, returnTrueWhenHasAdmins) {
            roleId = roleId.toLowerCase();

            if (angular.isUndefined(returnTrueWhenHasAdmins))
                returnTrueWhenHasAdmins = true;

            var result = userbean.roleIdMap[roleId];

            result = result || (returnTrueWhenHasAdmins && userbean.isAdmins);
            
            return result;
        };

        /**
         * 当前用户是admin吗？
         */
        userbean.isAdmin = userbean.userid === 'admin';

        /**
         * 当前用户拥有管理员角色吗？
         */
        userbean.isAdmins = userbean.isAdmin || userbean.hasRole('admins', false);

        userbean.entMap = {};

        (userbean.allents || []).forEach(function (ent) {
            userbean.entMap[ent.entid] = ent;
        });

        userbean.loginEnt = userbean.entMap[userbean.entid];
        window.ent = userbean.loginEnt;

        

        $scope.entConfig = window.entConfig = requestApi.syncPost({
            classId: 'scp_ent_config',
            action: 'select',
            data: {
                entid: userbean.entid
            },
            noShowWaiting: true
        });

        $scope.user = window.user = requestApi.syncPost({
            classId: 'scpuser',
            action: 'select',
            data: {
                userid: userbean.userid
            },
            noShowWaiting: true
        })
        
        Object.defineProperty(user, 'isCustomer', {
            value: user.usertype == 3 || !!+user.customer_id
        });

        if (user.isCustomer) {
            requestApi
                .post({
                    classId: 'customer',
                    action: 'search',
                    data: {
                        flag: -1,
                        customer_id: user.customer_id
                    },
                    noShowWaiting: true
                })
                .then(function (response) {
                    $scope.customer = window.customer = response.customers[0];
                });
        }
        else {
            $scope.customer = window.customer = null;
        }
	}
	else {
		window.userbean = top.userbean;
		window.ent = top.ent;

		require(['app'], function (app) {
			var $scope = app.$rootScope;

			['entConfig', 'user', 'customer'].forEach(function (key) {
				$scope[key] = window[key] = top[key];
			});
		});
	}

    /**
     * 往网格中放置数据，需要传入$scope
     */
    HczyCommon.pushGrid = function ($scope) {
        $("#saveform").find("div[sg-options]").each(function () { //对html中sg-options才做处理
            var op = "$scope." + this.attributes['sg-options'].value;// 获取sg-options值
            op = eval(op);//将值转换成js
            var str = "";
            if (this.attributes['sg-data'] != undefined) {               //将sg-data，sg-model(ng-model)的值赋值给属性
                str = "$scope." + this.attributes['sg-data'].value;
            }
            var datas = eval(str);
            if (datas instanceof Array) {  //当op的类型为SlickGrid，data为数组时执行赋值
                var api = op.api;
                api.setRowData(datas);
            }
        });
    };

    /* *传入日期字符人串
     * *如2016-08-03 10:34:41 +40天变成 2016-09-12 10:34:41
     * */
    HczyCommon.dateAdd = function (str, adddays) {
        adddays = Number(adddays);
        var date = new Date(str);
        adddays += date.getDate();
        var newDate = new Date(date.setDate(adddays));
        return newDate.Format('yyyy-MM-dd hh:mm:ss');
    }
//通用汇总  compare_cols:根据那些字段汇总 datas：汇总的网格 sum_cols：网格汇总的字段,没有网格直接传入数组
    HczyCommon.Summary = function (compare_cols, sum_cols, sources) {
        var datas = [];
        $.extend(true, datas, sources);
        var sums = [];
        //判断汇总容器中是否有要装进的object的字段，如果有的话得到false，没有就话返回true
        var compare_to_sum = function (sums, object) {
            var returnobj = {
                not_compare: true,
                index: undefined
            };
            if (sums.length == 0) {
                returnobj.not_compare = true;
                return returnobj;
            }
            var count = 0;
            for (var i = 0; i < sums.length; i++) {
                count = 0; //计算匹配上的列数
                for (var j = 0; j < compare_cols.length; j++) {
                    if (sums[i][compare_cols[j]] != object[compare_cols[j]]) {
                        break;
                    }
                    ;
                    count++;
                }
                ;
                if (count == (compare_cols.length)) {
                    returnobj.index = i;
                    returnobj.not_compare = false;
                    break;
                }
                ;
            }
            ;
            return returnobj;
        };
        for (var i = 0; i < datas.length; i++) {
            var compare_result = compare_to_sum(sums, datas[i]);
            if (compare_result.not_compare) {
                sums.push(datas[i]);
                continue;
            }
            var index = compare_result.index;
            for (var j = 0; j < sum_cols.length; j++) {
                datas[i][sum_cols[j]] = Number(datas[i][sum_cols[j]]) || 0;
                if (isNaN(datas[i][sum_cols[j]])) {
                    window.alert("第" + i + "行" + sum_cols[j] + "列值是" + datas[i][sum_cols[j]] + "为非数值!");
                    return;
                }
                sums[index][sum_cols[j]] = Number(sums[index][sum_cols[j]] || 0) + Number(datas[i][sum_cols[j]] || 0);
            }
        }
        return sums;
    };

    HczyCommon.isArray = function isArray(args) {
        return Object.prototype.toString.call(args) === '[object Array]';
    }

    /**
     * 主模块
     * @since 2018-05-21
     */
    HczyCommon.mainModule = function () {
        return angular.module('inspinia');
    };

    /**
     * 基础模块
     * @since 2018-05-21
     */
    HczyCommon.baseModule = function () {
        //暂时和主模块一致
        return HczyCommon.mainModule();
    };

    /**
     * 获取链接参数
     * @since 2021-11-04
     */
     HczyCommon.getQueryObject = function (url) {
        url = url || window.location.href;
        var search = url.substring(url.lastIndexOf("?") + 1);
        var obj = {};
        var reg = /([^?&=]+)=([^?&=]*)/g;
        search.replace(reg, (rs, $1, $2) => {
            var name = decodeURIComponent($1);
            var val = decodeURIComponent($2);
            val = String(val);
            obj[name] = val;
            return rs;
        });
        return obj;
    };

    window.curr_Url = window.location.pathname;//打开页面用的url
    if (window.location.origin) {
        window.curr_Url = window.location.origin + window.location.pathname;//打开页面用的url
    }

    window.REQUESTPOST_TIMES = 0;
    if (!window.userbean && window.parent.userbean) {
        window.userbean = window.parent.userbean;
    }
    /**记录每个页面的刷新页面的方法**/
// if (!window.parent.SCOPE_INIT) {
//     window.parent.SCOPE_INIT = {};
// } else {
//     window.SCOPE_INIT = window.parent.SCOPE_INIT;
// }
    /**记录每个页面的跳转参数**/
    if (!window.parent.CURR_LOCATION) {
        window.parent.CURR_LOCATION = {};
    } else {
        window.CURR_LOCATION = window.parent.CURR_LOCATION;
    }

    /**记录所有系统词汇**/
    if (!window.parent.DICTS) {
        window.parent.DICTS = {};
    } else {
        window.DICTS = window.parent.DICTS;
    }
    /**记录每个页面的跳转参数**/
    if (!window.parent.CURR_STATE_C) {
        window.parent.CURR_STATE_C = {};
    } else {
        window.CURR_STATE_C = window.parent.CURR_STATE_C;
    }
    /**记录所有菜单对应的menuid**/
    if (!window.parent.user_menus) {
        window.parent.user_menus = {};
    } else {
        window.user_menus = window.parent.user_menus;
    }
});