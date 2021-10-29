/**
 * INSPINIA - Responsive Admin Service
 * Copyright 2015 Hczy
 *
 * Main service.js file
 * Define services with data used in Inspinia Service
 *
 *
 * Services
 *  - BaseService //基础service
 *  尽量不要在子类实现请求与其他服务
 */
//全局服务变量
var service = {
    pagelist: []
};

function BaseService($http, $q, $modal, notify, $location, $timeout) {
    this.controller = null;
    this.FrmInfo;
    var _this = this;

    this.wfInfo = null;

    //请求路径（子类可覆盖）
    this.requestUrl = "/jsp/req.jsp";

    this.editObj = {key: "", value: "", obj: null};
    this.setEditObj = function (obj) {
        this.editObj = obj;
        //this._saveStorage("currEditObj", JSON.stringify(obj));
    };
    this.getEditObj = function () {
        if (this._loadStorage("currEditObj")) {
            return this._loadStorageObj("currEditObj");
        }
        else
            return this.editObj;
    };
    //记录页面
    this.pages = [];
    this.getPages = function () {
        return this.pages;
    }
    this.pushPage = function (page) {
        this.pages.push(page);
    }
    this.removePage = function (page) {

    }
    //初始化页数信息
    this.pageInit = function ($scope) {
        $scope.oldPage = 1;
        $scope.currentPage = 1;
        $scope.pageSize = "50";
        $scope.totalCount = 1;
        $scope.pages = 1;

        $scope.search = function () {
            var postdata = {pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"};
            $scope._pageLoad(postdata)
        }

        //跳转页Enter
        $scope.keyup = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                if ($scope.oldPage != $scope.currentPage && $scope.currentPage > 0 && $scope.currentPage <= $scope.pages) {
                    var postdata = {pagination: "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"};
                    $scope._pageLoad(postdata);
                }
            }
        }
        //首页
        $scope.firstpage = function () {
            if ($scope.currentPage <= 1) {
                return;
            }
            var postdata = {pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"};
            $scope._pageLoad(postdata);
        }
        //上一页
        $scope.prevpage = function () {
            if ($scope.currentPage == 1)return;
            var num = Number($scope.currentPage) - 1;
            var postdata = {pagination: "pn=" + num + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"};
            $scope._pageLoad(postdata);
        }
        //下一页
        $scope.nextpage = function () {
            if ($scope.currentPage >= $scope.pages)return;
            var num = Number($scope.currentPage) + 1;
            var postdata = {pagination: "pn=" + num + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"};
            $scope._pageLoad(postdata);
        }
        //末页
        $scope.lastpage = function () {
            if ($scope.currentPage >= $scope.pages) {
                return;
            }
            var postdata = {pagination: "pn=" + $scope.pages + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"};
            $scope._pageLoad(postdata);
        }
        //页数大小改变
        $scope.pschange = function (ps) {
            var postdata = {pagination: "pn=1,ps=" + ps + ",pc=0,cn=0,ci=0"};
            $scope._pageLoad(postdata);
        }

    }
    this._pschange = function ($scope, ps) {//Footable分页-改变页数大小
        var pc = Math.ceil($scope.totalCount / ps);
        var pageInfoStr = "pn=1,ps=" + ps + ",pc=" + pc + ",cn=" + $scope.totalCount + ",ci=0";
        this.pageInfoOp($scope, pageInfoStr);
    }

    /** Post请求方法
     * @param classid 类名  （拼接get参数）
     * @param action 发方法名 -- （拼接get参数）
     * @param data data:{flag:1},（拼接post参数）
     *  ---- 主要参数必填
     * @param url
     * @param format
     * @returns Promise
     */
    this.RequestPost = function (classid, action, data, url) {
        if (classid == undefined || action == undefined) {
            console.error("请求类或方法未定义");
            return;
        }
        /**
         * 清除dada里面的不合法数据
         * undefined - 发送是不会将数据传过去
         */

        for (x in data) {
            if (data[x] == null) {
                data[x] = undefined;
                console.warn(x + " is null");
            }
            if (data[x] == "undefined") {
                data[x] = undefined;
                console.warn(x + " is undefined String");
            }
        }

        if (url != undefined) this.requestUrl = url;
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: this.requestUrl,
            data: data,
            params: {
                classid: classid,
                action: action,
                format: 'mjson',
                id: Math.random(),
                loginguid: window.strLoginGuid
            }
        })
            .success(function (data, status, headers, config) {
                deferred.resolve(data);
            })
            .error(function (data, status, headers, config) {//出错提醒已经处理
                notify.closeAll();
                if (config.params)
                    console.info("errorcode:" + status + ",requestMethod:" + config.params.classid + "." + config.params.action);

                if (data && data != null && data != undefined) {
                    if (!data.message || data.message == "") data.message = "未知异常！";
                    notify({message: data.message, classes: "alert-danger", templateUrl: 'views/common/notify.html'});
                    deferred.reject(data);
                }
                else {
                    notify({message: "网络异常！", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
                    console.log("网络异常！");
                    deferred.reject({message: '网络异常！-' + status});
                }
            });
        return deferred.promise;
    }

    this.RequestPostAjax = function (classid, action, data, url) {
        if (classid == undefined) {
            notify({message: "类名必须赋值", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
            return;
        }
        if (action == undefined) {
            notify({message: "操作必须赋值", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
            return;
        }
        var requestUrl = this.requestUrl;
        requestUrl = url || requestUrl;
        requestUrl = requestUrl + "?loginguid="
            + window.strLoginGuid + "&format=mjson&classid="
            + classid + "&id=" + Math.random() + "&action=" + action;
        var deferred = $q.defer();

        $.ajax({
            type: "POST",
            url: requestUrl,
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            data: JSON.stringify(data),
            async: false,
            success: function (data, textStatus) {
                deferred.resolve(data);
            },
            error: function (XMLHttpRequest, status, errorThrown) {
                notify.closeAll();
                if (errorThrown) {
                    console.info("errorcode:" + status + ",requestMethod:" + this.classid + "." + this.action);
                }
                if (errorThrown && errorThrown != null && errorThrown != undefined) {
                    if (!errorThrown || errorThrown == "") data.message = "未知异常！";
                    notify({message: errorThrown, classes: "alert-danger", templateUrl: 'views/common/notify.html'});
                    deferred.reject(data);
                }
                else {
                    notify({message: "网络异常！", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
                    console.log("网络异常！");
                    deferred.reject({message: '网络异常！-' + status});
                }
            }
        });
        return deferred.promise;
    }

    this.RequestPostNoWait = function (classid, action, data, url) {
        var obj = {}
        if (classid == undefined) {
            notify({message: "类名必须赋值", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
            return;
        }
        if (action == undefined) {
            notify({message: "操作必须赋值", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
            return;
        }
        var requestUrl = this.requestUrl;
        requestUrl = url || requestUrl;
        requestUrl = requestUrl + "?loginguid="
            + window.strLoginGuid + "&format=mjson&classid="
            + classid + "&id=" + Math.random() + "&action=" + action;
        $.ajax({
            type: "POST",
            url: requestUrl,
            dataType: 'json',
            processData: false,
            contentType: "application/json",
            data: JSON.stringify(data),
            async: false,
            success: function (data, textStatus) {
                obj = {data: data, pass: true}
            },
            error: function (XMLHttpRequest, status, errorThrown) {
                var error = JSON.parse(XMLHttpRequest.responseText)
                obj = {pass: false, msg: error.message}
                if (errorThrown && errorThrown != null && errorThrown != undefined) {
                    if (!errorThrown || errorThrown == "") data.message = "未知异常！";
                    notify({message: error.message, classes: "alert-danger", templateUrl: 'views/common/notify.html'});
                }
                else {
                    notify({message: "网络异常！", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
                    console.log("网络异常！");
                }
            }
        });
        return obj;
    };

    /**
     * 用于返回查询界面中的查询条件
     * 用ID=sqlWhereBlock 标识区域
     *
     */
    this.getSqlWhereBlock = function getSqlWhereBlock(SqlWhere, sqlWhereBlockID) {
        if (!(SqlWhere == undefined || SqlWhere == "")) {
            var SqlWhere = SqlWhere + " ";
        } else {
            var SqlWhere = "1=1 ";
        }
        if (!(sqlWhereBlockID == undefined || sqlWhereBlockID == "")) {
            var sqlWhereBlock = sqlWhereBlockID;
        } else {
            var sqlWhereBlock = "#sqlWhereBlock";
        }
        $(sqlWhereBlock).find("input[name='like']").each(function () {
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var sql = "and lower(" + id + ") " + this.name + " lower('%" + this.value + "%') ";
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='=']").each(function () {
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var sql = "and lower(" + id + ") " + this.name + " lower('" + this.value + "') ";
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='in']").each(function () {//in需要的只能是ID
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var sql = "and lower(" + id + ") " + this.name + " (" + this.value + ") ";
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='<']").each(function () {
            if (this.value.length > 0) {
                var id = this.id.substr(0, this.id.indexOf(this.name));
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                if (this.id.indexOf("date") > 0) {
                    var sql = "and " + id + this.name + " to_date('" + this.value + "','yyyy-mm-dd') ";
                } else {
                    var sql = "and " + id + this.name + "'" + this.value + "' ";
                }
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='>']").each(function () {
            if (this.value.length > 0) {
                var id = this.id.substr(0, this.id.indexOf(this.name));
                if (id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                if (this.id.indexOf("date") > 0) {
                    var sql = "and " + id + this.name + " to_date('" + this.value + "','yyyy-mm-dd') ";
                } else {
                    var sql = "and " + id + this.name + "'" + this.value + "' ";
                }
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("select[name='=']").each(function () {
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var value = this.value.substr(this.value.indexOf(":") + 1, this.value.length);
                var sql = "and lower(" + this.id + ") " + this.name + " lower('" + value + "') ";
                SqlWhere = SqlWhere + sql;
            }
        });
        return SqlWhere;
    }

    /**
     * 获取sqlwhere语句
     */
    this.getSqlWhere = function (arr, searchText, l_r) {
        var sqlWhere = "";
        var len = arr.length;
        var op = l_r || "center";
        if (searchText == "" || searchText == undefined)return sqlWhere;
        searchText = String(searchText).toLowerCase();
        if (op == "center") {
            for (var i = 0; i < len; i++) {
                sqlWhere += i == len - 1 ? " lower(" + arr[i] + ") like '%" + searchText + "%'" : " lower(" + arr[i] + ") like '%" + searchText + "%' or ";
            }
        } else if (op == "left") {
            for (var i = 0; i < len; i++) {
                sqlWhere += i == len - 1 ? " lower(" + arr[i] + ") like '" + searchText + "%'" : " lower(" + arr[i] + ") like '" + searchText + "%' or ";
            }
        } else if (op == "right") {
            for (var i = 0; i < len; i++) {
                sqlWhere += i == len - 1 ? " lower(" + arr[i] + ") like '%" + searchText + "'" : " lower(" + arr[i] + ") like '%" + searchText + "' or ";
            }
        }
        return sqlWhere;
    }

    this.pageInfoOp = function ($scope, pagination) {
        var pageinfo = pagination.split(",");
        //当前页
        $scope.currentPage = parseInt(pageinfo[0].split("=")[1]);
        $scope.oldPage = $scope.currentPage;
        $scope.pageSize = String(pageinfo[1].split("=")[1]);
        $scope.pages = parseInt(pageinfo[2].split("=")[1]);
        $scope.totalCount = parseInt(pageinfo[3].split("=")[1]);
        this.reloadFootable($scope.pageSize);
    }
    //初始化列表
    this.reloadFootable = function (pagesize) {
        if (pagesize) {
            $('.footable').data('page-size', pagesize);
        }
        $timeout(function () {
            $('table.footable').data('limit-navigation', 0);
            //$('table.footable').data('data-sort-initial', true);

            $('table.footable').trigger('footable_redraw');
            $('table.footable').trigger('footable_initialized');
        });

    }
    /*
     * html5获取本地存储
     * PaymentTypeService._setCookie("name",JSON.stringify({name:"我们的名字"}));
     * JSON.parse(PaymentTypeService._getCookie("name")).name;
     */
    this._loadStorage = function (key) {
        var str = localStorage.getItem(key);
        return str;
    }
    this._loadStorageObj = function (key) {
        var backObj = null;
        try {
            backObj = JSON.parse(this._loadStorage(key));
        } catch (e) {
            console.info(e);
        }
        return backObj;
    }
    /*
     * HTML5本地存储
     */
    this._saveStorage = function (key, value) {
        localStorage.setItem(key, value);
    }
    //清空所有HTMl5本地存储
    this._clearStorage = function () {
        localStorage.clear();
    }
    /*
     * getCookie
     */
    this._getCookie = function (key) {
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i += 1) {
            var prefix = arr[i].split('=');
            if (prefix[0] == key) {
                return prefix[1];
            }
        }
        return null;
    }
    /*
     * _setCookie
     */
    this._setCookie = function (key, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        } else {
            var expires = "";
        }
        document.cookie = key + "=" + value + expires + "; path=/";
    }
    /*
     * removeCookie
     */
    this._removeCookie = function (key) {
        //调用_setCookie()函数,设置为1天过期,计算机自动删除过期cookie
        this._setCookie(key, 1, 1);
    }
    /**
     * 历史纪录项 List
     * @param scope 当前域
     * @param savedata 需要保存的
     */
    this.pageHistory = function (scope, savedata) {
        scope.$on("page_stat", function (event, data) {
            //需要保存的数据
            var saveobj = {
                name: data.fromState.name,//用于跳转
                title: data.fromState.data.pageTitle,//页面信息
                data: savedata()
            };
            var list = window.service.pagelist;
            if (list == undefined || list.length == 0) {
                list = [];
                list.push(saveobj);
            } else {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].name == saveobj.name) {
                        list.splice(i, 1);
                        break;
                    }
                }
                list.unshift(saveobj);
            }
            window.service.pagelist = list;
        });
    }
    /**
     * Notify
     * @param+ notyfyFn 注入的notify函数
     * @param+ msg 提醒内容
     * @param+ classes class类定义提醒的类别alert-info alert-danger
     * @param- timeout 提示时间
     * @param- templateUrl 可以自定义提醒模板
     *
     */
    this.notify = function (notifyFn, msg, classes, timeout, templateUrl) {
        notifyFn.closeAll();
        var inspiniaTemplate = 'views/common/notify.html';
        if (templateUrl) {
            inspiniaTemplate = templateUrl;
        }
        notifyFn({message: msg, classes: classes, templateUrl: inspiniaTemplate});
        if (timeout) {
            $timeout(function () {
                notifyFn.closeAll()
            }, timeout);
        }
    }
    /**
     * classes : alert-info,alert-warning,alert-danger
     */
    this.notice = function (msg, classes, templateUrl, timeout) {
        var template = templateUrl || "views/common/notify.html";
        notify.closeAll();
        var isArray = function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        if (isArray(msg)) {
            template = "views/common/notify-validate.html"
        }
        notify({message: msg, classes: classes, templateUrl: template});

		var t = (classes =="alert-info"?600:3000);
        var time = timeout || t;
        if (time) {
            $timeout(function () {
                notify.closeAll()
            }, time);
        }
    }
    /**
     * 普通弹窗
     * @param templateURL 模板路径
     * @param controller 控制器
     * @param $scope 当前域
     * @param
     *
     */
    this.openFrm = function (templateUrl, controller, $scope, windowClass, size) {
        var bgclass = "";
        var sizeStr = "";
        if (windowClass) {
            bgclass = windowClass;
        }
        if (size) {
            sizeStr = size;
        }
        return $modal.open({
            templateUrl: templateUrl,
            controller: controller,
            scope: $scope,
            size: sizeStr,
            windowClass: bgclass
        });
    }
    /**
     * 高级统一弹窗
     * @param Controller 必填 第一个参数
     * @param $scope 必填 第二个参数
     * @param templateUrl 模板路径
     * @param size 可选  窗体大小
     * @param bgclass 可选 增加弹窗的class
     */
    this.open = function (controller, $scope, templateUrl, size, bgclass) {
        /**if ($scope != undefined && $scope.data != undefined && $scope.data.currItem.stat == 5) {//已审核不能打开弹出框
            return;
        }**/
        var url = templateUrl || "views/common/Pop_Common.html";
        var bg_class = bgclass || " ";
        var sizeStr = size || " ";
        if (arguments.length < 2) {
            _this.notice("Error Frm Setting's", "alert-warning");
            return;
        }

        var key = $scope.FrmInfo.classid != "base_search" ? $scope.FrmInfo.classid : $scope.FrmInfo.classid + $scope.FrmInfo.action
        var FrmInfotemp = datamap.get(key);//取缓存窗体信息
        if (FrmInfotemp && $scope.FrmInfo.is_high !== false) {
            if (!$scope.FrmInfo.is_custom_search)
                $scope.FrmInfo = HczyCommon.copyobj1($scope.FrmInfo, FrmInfotemp);
        }

        if ($scope.FrmInfo.type == "checkbox") {
            url = "views/common/Pop_CheckCommon.html";
            sizeStr = "lg";
        }

        // 高级查询组合
        if ($scope.FrmInfo.is_high) {
            url = "views/common/Pop_Common_High.html";
            sizeStr = "lg";
        }

        return this.openFrm(url, controller, $scope, bg_class, sizeStr);
    }
    /**
     * 打开公共弹窗
     * @param controller 控制器 -- 指定控制器
     * @param $scope 当前域 -- 用于传递数据：本身传递
     * @param FrmInfo 当前弹窗信息：格式如下（必要内容）-- 自定义内容
     * title(String) -- 弹窗标题 thead(Arr) -- 列表名称/显示代码  bgclass -- 弹窗样式
     * @param templateURL 模板路径 自己重写模板内容 -- 需要处理表格显示
     *
     */
    this.openCommonFrm = function (controller, $scope, FrmInfo, templateUrl, size) {
        var url = "";
        var sizeStr = size || " ";
        if (!templateUrl) {
            url = "views/common/Pop_Common.html";
        } else {
            url = templateUrl;
        }

        if (FrmInfo != null && FrmInfo) {
            this.FrmInfo = FrmInfo;
        } else
            this.FrmInfo = {title: '查询标题', thead: [{name: '编码', code: 'code'}, {name: '名称', code: 'code'}]};
        var bgclass = "";
        if (FrmInfo.bgclass) {
            bgclass = FrmInfo.bgclass;
        }
        return this.openFrm(url, controller, $scope, bgclass, sizeStr)

    }

    /**
     * 打开公共弹窗-高级查询
     * @param controller 控制器 -- 指定控制器
     * @param $scope 当前域 -- 用于传递数据：本身传递
     * @param FrmInfo 当前弹窗信息：格式如下（必要内容）-- 自定义内容
     * title(String) -- 弹窗标题 thead(Arr) -- 列表名称/显示代码  bgclass -- 弹窗样式
     * @param templateURL 模板路径 自己重写模板内容 -- 需要处理表格显示
     *
     */
    this.openCommonHighFrm = function (controller, $scope, FrmInfo, templateUrl, size) {
        var url = "";
        var sizeStr = size || " ";
        if (!templateUrl) {
            url = "views/common/Pop_Common_High.html";
        } else {
            url = templateUrl;
        }

        if (FrmInfo != null && FrmInfo) {
            this.FrmInfo = FrmInfo;
        } else
            this.FrmInfo = {title: '查询标题', thead: [{name: '编码', code: 'code'}, {name: '名称', code: 'code'}]};
        var bgclass = "";
        if (FrmInfo.bgclass) {
            bgclass = FrmInfo.bgclass;
        }

        alert('openCommonHighFrm');

        return this.openFrm(url, controller, $scope, bgclass, sizeStr)

    }


    this.saveToHistoryList = function (saveobj) {
        if (sessionStorage) {
            var historylist = sessionStorage.getItem("historylist");
            if (historylist && historylist.length) {
                historylist = JSON.parse(historylist);
                //var stat = true;
                for (var i = 0; i < historylist.length; i++) {
                    if (historylist[i].name == saveobj.name) {
                        //stat = false;
                        historylist.splice(i, 1);
                        break;
                    }
                }
                historylist.unshift(saveobj);
            } else {
                historylist = [saveobj];
            }
            sessionStorage.setItem("historylist", JSON.stringify(historylist));

        } else {
            notify({message: "浏览器不支持SessionStorage", classes: "alert-danger", templateUrl: 'views/common/notify.html'});
        }
    }

    this.getHistoryList = function (name) {
        if (sessionStorage) {
            var historylist = sessionStorage.getItem("historylist");
            if (!historylist) {
                return null;
            }
            var list = JSON.parse(historylist);
            var temp;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name == name) {
                    temp = list[i];
                    break;
                }
            }
            if (temp) {
                return temp.data;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    this.initGridOptions = function (scope, arr) {
        for (var i = 0; i < arr.length; i++) {
            var options = arr[i] + "Options";
            scope[options] = {editable: true};
        }
    }

}
/**
 * 继承BaseService
 * @param _BaseService -- 这里为描述字符串
 *
 */
function ProItemHeaderService(_BaseService) {
    angular.extend(this, _BaseService);
    //TODO 这里可以重写与拓展baseservice内容
    this.getProItemBoxLine = function () {
        var classid = "pro_item_header";
        var action = "search";
        var data = {flag: 1};
        return this.RequestPost(classid, action, data);
    }
    this.query = function (data) {
        var dataObj = {sqlwhere: "", pagination: "pn=1,ps=5,pc=0,cn=0,ci=0"};
        if (data != undefined)
            dataObj = data;
        return this.RequestPost("pro_item_header", "search", dataObj);
    }
}

/**
 * 基础数据
 */
function BasemanService(_BaseService) {
    angular.extend(this, _BaseService);
    /**
     * 获取基础参数值
     * @param scope ： 当前作用域
     */
    this.getParameters = function (scope, param) {
        if (!param)return;
        var isArray = function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }
        var temp_list = [];
        if (typeof param == "string") {//一个
            temp_list.push(param);
        } else if (isArray(param)) {//多个
            temp_list = param;
        } else {
            return;
        }
        for (var i = 0; i < temp_list.length; i++) {
            this.RequestPost("drp_parameter", "search", {
                    importdataflag: i,
                    sqlwhere: "other2='" + temp_list[i] + "' and usable=2"
                })
                .then(function (data) {
                    for (var j = 0; j < data.drp_parameters.length; j++) {
                        data.drp_parameters[j].id = parseInt(data.drp_parameters[j].other1);
                        data.drp_parameters[j].name = data.drp_parameters[j].other3;
                    }
                    //根据ID排序
                    HczyCommon.arrSortId(data.drp_parameters);
                    scope[temp_list[data.importdataflag] + "s"] = data.drp_parameters;
                });
        }

    }

    /**
     * 用于返回查询界面中的查询条件
     *
     *
     */

    this.getSqlWhereBlock = function getSqlWhereBlock(SqlWhere, sqlWhereBlockID) {
        if (!(SqlWhere == undefined || SqlWhere == "")) {
            var SqlWhere = SqlWhere + " ";
        } else {
            var SqlWhere = "1=1 ";
        }
        if (!(sqlWhereBlockID == undefined || sqlWhereBlockID == "")) {
            var sqlWhereBlock = sqlWhereBlockID;
        } else {
            var sqlWhereBlock = "#sqlWhereBlock";
        }
        $(sqlWhereBlock).find("input[name='like']").each(function () {
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var sql = "and lower(" + id + ") " + this.name + " lower('%" + this.value + "%') ";
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='=']").each(function () {
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var sql = "and lower(" + id + ") " + this.name + " lower('" + this.value + "') ";
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='in']").each(function () {//in需要的只能是ID
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var sql = "and lower(" + id + ") " + this.name + " (" + this.value + ") ";
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='<']").each(function () {
            if (this.value.length > 0) {
                var id = this.id.substr(0, this.id.indexOf(this.name));
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                if (this.id.indexOf("date") > 0) {
                    var sql = "and " + id + this.name + " to_date('" + this.value + "','yyyy-mm-dd') ";
                } else {
                    var sql = "and " + id + this.name + "'" + this.value + "' ";
                }
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("input[name='>']").each(function () {
            if (this.value.length > 0) {
                var id = this.id.substr(0, this.id.indexOf(this.name));
                if (id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                if (this.id.indexOf("date") > 0) {
                    var sql = "and " + id + this.name + " to_date('" + this.value + "','yyyy-mm-dd') ";
                } else {
                    var sql = "and " + id + this.name + "'" + this.value + "' ";
                }
                SqlWhere = SqlWhere + sql;
            }
        });
        $(sqlWhereBlock).find("select[name='=']").each(function () {
            if (this.value.length > 0) {
                var id = this.id;
                if (this.id.indexOf("OMS") > 0) {
                    id = this.id.substr(0, this.id.indexOf("OMS"))
                }
                this.value = this.value.replace(/(^\s*)|(\s*$)/g, "");
                var value = this.value.substr(this.value.indexOf(":") + 1, this.value.length);
                var sql = "and lower(" + this.id + ") " + this.name + " lower('" + value + "') ";
                SqlWhere = SqlWhere + sql;
            }
        });
        return SqlWhere;
    }
    //币种
//	this.base_currencys = [];
    //区域
//	init(this);
//	
//	function init(_this){
//		var promise = _this.RequestPost("base_search","search",{flag:1});
//		promise.then(function(data){
//			_this.base_currencys = data.base_currencys;
//		});
//	}

}
// 表单有效性验证服务 add by yxg 2015-09-16
function FormValidatorService(notify, $timeout) {
    this.validatorFrom = function ($scope, form) {
        var is_pass = true;
        var msg = [];
        var evalValue = this.evalValue;//在外面赋值调用下面的evalValue

        $("#page-wrapper").find("input").each(function () {
            if (this.attributes['data-rule-required'] != undefined && this.attributes['data-rule-required'].value) {
                var str = this.attributes['data-rule-required'].value;
                if (this.attributes['data-msg-required'] != undefined && (this.value.length == 0 || this.value == "0") && evalValue(str, $scope)) {
                    var str = this.attributes['data-msg-required'].value;
                    msg.push(str);
                }
            }
            if (this.attributes['data-rule-number'] != undefined && this.attributes['data-rule-number'].value) {
                var str = this.attributes['data-rule-number'].value;
                if (this.attributes['data-msg-number'] != undefined && isNaN(this.value) && evalValue(str, $scope)) {
                    var str = this.attributes['data-msg-number'].value;
                    msg.push(str);
                }
            }
        });
        $("#page-wrapper").find("select[data-rule-required]").each(function () {
            var str = this.attributes['data-rule-required'].value;
            if (this.attributes['data-msg-required'] != undefined && this.value.length == 0 && evalValue(str, $scope)) {
                var str = this.attributes['data-msg-required'].value;
                msg.push(str);
            }
        });
        $("#page-wrapper").find("textarea[data-rule-required]").each(function () {
            var str = this.attributes['data-rule-required'].value;
            if (this.attributes['data-msg-required'] != undefined && this.value.length == 0 && evalValue(str, $scope)) {
                var str = this.attributes['data-msg-required'].value;
                msg.push(str);
            }
        });
        if (msg.length != 0) {
            is_pass = false;
        }
        if (!is_pass) {
            notify.closeAll();
            notify({message: msg, classes: "alert-danger", templateUrl: 'views/common/notify-validate.html'});
            setTimeout(function () {
                notify.closeAll()
            }, 5000);
        }
        if (is_pass) {
            this.setNullToSting($scope.data.currItem);
        }
        return is_pass;
    }
    this.setNullToSting = function (arr) {
        if (arr instanceof Array) {
            for (var i = 0; i < arr.length; i++) {
                this.setNullToSting(arr[i]);
            }
        } else {
            for (var x in arr) {
                if (arr[x] instanceof Array) {
                    this.setNullToSting(arr[x])
                } else if (arr[x] == null) {
                    arr[x] = "";
                }
            }
        }
    }
    //处理数值的
    this.evalValue = function (str, $scope) {
        var isRequired = false;
        if (str == "true" || str == "false") {
            isRequired = eval(str)
        } else {
            str = str.replace(/data./g, "$scope.data.");
            isRequired = eval(str);
        }
        return isRequired;
    }
}


/* 表单有效性验证服务 add by dhw 2015-09-16
 function FormValidatorService(notify, $timeout) {
 var is_pass = false;
 this.validatorFrom = function (form) {

 var container = $("<div class='container'><h4>温馨提示：以下数据不符合要求，请修正再保存</h4><ol></ol></div>");
 var validator = $("#saveform").validate({
 debug: true, // 不需要提交模式
 errorContainer: container,
 errorLabelContainer: container.find("ol"),
 wrapper: 'li',
 submitHandler: function () {
 is_pass = true;
 }
 }
 );
 $("#saveform").submit();
 if (!is_pass) {
 //					var containerhtml = $(validator.containers).html();
 //					alert(containerhtml);

 var msg = [];
 if (validator.errorList.length) {
 for (var i = 0; i < validator.errorList.length; i++) {
 msg.push(validator.errorList[i].message);
 }
 }
 notify.closeAll();
 notify({message: msg, classes: "alert-danger", templateUrl: 'views/common/notify-validate.html'});
 setTimeout(function () {
 notify.closeAll()
 }, 5000);
 }
 return is_pass;
 }
 }
 */

// 路由权限控制 add by dhw 2015-09-18
// 路由权限控制
function AuthorizationService($q, $timeout, $rootScope, $location, $http) {
    // 	alert('AuthorizationService');
    return {
        // 将权限缓存到 Session，以避免后续请求不停的访问服务器
        permissionModel: {permission: {}, isPermissionLoaded: false},

        permissionCheck: function (nextRoteUrl) {

            //alert('permissionCheck');
            // 返回一个承诺(promise).
            var deferred = $q.defer();

            // 这里只是在承诺的作用域中保存一个指向上层作用域的指针。
            var parentPointer = this;

            // 检查是否已从服务获取到权限对象(已登录用户的角色列表)
            if (this.permissionModel.isPermissionLoaded) {

                // 检查当前用户是否有权限访问当前路由
                this.getPermission(this.permissionModel, nextRoteUrl, deferred);

            } else {
                // 如果还没权限对象，我们会去服务端获取。
                // 'api/permissionService' 是本例子中的 web 服务地址。 

                /*
                 $http.post('/AngularJS/views/data/useraccessmenu.json').then(function (response) {
                 // console.log('response:'+response);
                 console.log('response:'+JSON.stringify(response.data));

                 // 当服务器返回之后，我们开始填充权限对象
                 parentPointer.permissionModel.permission = response.data;

                 // 将权限对象处理完成的标记设为 true 并保存在 Session，
                 // Session 中的用户，在后续的路由请求中可以重用该权限对象
                 parentPointer.permissionModel.isPermissionLoaded = true;

                 // 检查当前用户是否有必须角色访问该路由
                 parentPointer.getPermission(parentPointer.permissionModel, nextRoteUrl, deferred);
                 });
                 */

                $http({
                    method: 'POST',
                    url: '/jsp/useraccessmenu.jsp',
                    data: {flag: 0},
                    params: {
                        classid: 'base_modmenu',
                        action: 'useraccessrute',
                        format: 'mjson',
                        id: Math.random(),
                        loginguid: window.strLoginGuid
                    }
                }).success(function (response) {

                    console.log('response:' + JSON.stringify(response.base_modmenus));

                    // 当服务器返回之后，我们开始填充权限对象
                    parentPointer.permissionModel.permission = response.base_modmenus;

                    // 将权限对象处理完成的标记设为 true 并保存在 Session，
                    // Session 中的用户，在后续的路由请求中可以重用该权限对象
                    parentPointer.permissionModel.isPermissionLoaded = true;

                    // 检查当前用户是否有必须角色访问该路由
                    parentPointer.getPermission(parentPointer.permissionModel, nextRoteUrl, deferred);


                }).error(function (response) {
                    //处理错误
                    console.log('读取用户菜单出错了:' + response);
                })
            } //end else 
            return deferred.promise;
        },

        //方法:检查当前用户是否有必须角色访问该路由
        //'permissionModel' 保存了从服务端返回的当前用户的角色信息
        //'nextRoteUrl' 是即将要访问的地址
        //'deferred' 是用来处理承诺的对象
        getPermission: function (permissionModel, nextRoteUrl, deferred) {

            var ifPermissionPassed = false;

            // 检查有没有权限
            var userAccessRouteMap = permissionModel.permission;

            // console.log('userAccessRouteMap:'+userAccessRouteMap);

            for (var i = 0, len = userAccessRouteMap.length; i < len; i++) {
                var AccessRoute = userAccessRouteMap[i];
                var uisref = "/" + AccessRoute.webrefaddr;

                console.log('webrefaddr:' + uisref + "  :" + nextRoteUrl);

                if (uisref === nextRoteUrl) {
                    ifPermissionPassed = true;
                    break;
                }
            }

            // 返回对象
            deferred.resolve(ifPermissionPassed);
        }
    };
}

function localeStorageServiceHelper($rootScope) {
    console.log("initialization locate storage service!");

    this.showtab = new Array();
    this.hidetab = new Array();

    if (window.userbean.userauth.default_desktop) {
        this.showtab.push({name: "首页", state: "crmman.home", uri: "#/crmman/home", current: false});
    }
    this.showtab.push({name: "工作台", state: "crmman.work", uri: "#/crmman/work", current: true});
    // this.showtab.push({name: "服务提醒", state: "crmman.callnotify", uri: "#/crmman/callnotify", current: true});
    //this.showtab.push({ name: "销售订单", state: "index.crmso", uri: "#/index/crmso", current: false });

    this.appendtab = function (t) {

        //只保留5个
        if (this.showtab.length >= 5) {
            this.hidetab.push(t);
        } else {
            this.showtab.push(t);
        }
        //onsole.log($("#top-nav-opened-fmtab").offsetWidth);
    };

    this.removetab = function (state_name) {
        for (var i = this.showtab.length - 1; i >= 0; i--) {
            if (this.showtab[i].state == state_name) {
                //this.showtab[i].current = true;
                this.showtab.splice(i, 1);
            }
            ;
        }

        for (var i = this.hidetab.length - 1; i >= 0; i--) {
            if (this.hidetab[i].state == state_name) {
                //this.hidetab[i].current = true;
                this.hidetab.splice(i, 1);
            }
            ;
        }

        while (this.showtab.length < 2 && this.hidetab.length > 0) {
            var item = this.hidetab[0];
            this.showtab.push(item);
            this.hidetab.splice(0, 1);

        }

        //set current
        //showtab[0].current = true;
    };

    this.setcurrent = function (state) {
        var isnew = true;
        for (var i = 0; i < this.showtab.length; i++) {
            if (this.showtab[i].state == state.name) {
                this.showtab[i].current = true;
                isnew = false;
            } else {
                this.showtab[i].current = false;
            }
            ;

        }

        for (var i = 0; i < this.hidetab.length; i++) {
            if (this.hidetab[i].state == state.name) {
                this.hidetab[i].current = true;
                isnew = false;
            } else {
                this.hidetab[i].current = false;
            }
            ;

        }

        if (isnew) {
            var tmp = {name: state.data.pageTitle, state: state.name, uri: "", current: true};
            tmp.uri = "#/" + tmp.state;
            tmp.uri = tmp.uri.replace(".", "/");
            this.appendtab(tmp);
        }
    }


    this.length = 0;
    this.items = new Array();
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof(arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }

    this.remove = function (in_key) {
        var tmp_value;
        if (typeof(this.items[in_key]) != 'undefined') {
            this.length--;
            var tmp_value = this.items[in_key];
            delete this.items[in_key];
        }
        return tmp_value;
    }

    this.get = function (in_key) {
        return this.items[in_key];
    }

    this.set = function (in_key, in_value) {
        if (typeof(in_value) != 'undefined') {
            if (typeof(this.items[in_key]) == 'undefined') {
                this.length++;
            }

            this.items[in_key] = in_value;
        }
        return in_value;
    }

    this.hasItem = function (in_key) {
        return typeof(this.items[in_key]) != 'undefined';
    }
}

// 获取转跳前的数据及当前数据
// 转跳后执行
function HistoryDataService($timeout, $rootScope, $q) {

    //alert('HistoryDataService');
    // sessionStorage.setItem('gallery.demo', null);
    //sessionStorage.setItem('gallery.demo2', null);

    var historylist = [];
    var index = 0;

    // 保留现场数据
    this.saveSessionData = function ($scope) {
        //var _stateName = $rootScope.$state.$current.name;
        //var _data = JSON.stringify($scope.data)
        //console.log("_stateName:"+_stateName);
        //console.log("_data:"+_data);
        //console.log("_$scope:"+ JSON.parse(_data));

        var listener = function (event, toState, toParams, fromState, fromParams) {

            var _stateName = $rootScope.$state.$current.name;
            var _data = JSON.stringify($scope.data);

            console.log("_stateName:" + _stateName);
            console.log("_data:" + _data);

            console.log("_$scope:" + JSON.parse(_data));
            console.log("$scope.data-object:" + $scope.data);
            console.log("saveSessionData:" + fromState.name);

            sessionStorage.setItem(fromState.name, $scope.data);
        };
        $rootScope.$on('$stateChangeStart', listener);
    }
    // 获到现场数据
    this.getSessionData = function () {
        var _stateName = $rootScope.$state.$current.name;
        var _data = sessionStorage.getItem(_stateName);

        console.log("getSessionData_stateName:" + _stateName);
        console.log("getSessionData:" + _data);
        // console.log("stringify:"+ JSON.stringify(_data));
        return _data;
    }

    // 存放到历史记录表中
    this.saveToHistoryList = function () {

        var c_url = '#' + $rootScope.$state.$current.url;
        var c_name = $rootScope.$state.$current.name;
        var c_data = $rootScope.$state.$current.data;  // 首页这个定义这个对象， undefined


        // 检查是否存在，不存在则新增,存在不处理
        var is_found = false;
        //console.log("historylist-size:"+historylist.length);
        if (historylist != null && historylist.length > 0) {
            for (var i = 0; i < historylist.length; i++) {
                //console.log("比较:"+ historylist[i].name+':'+c_name);
                if (historylist[i].name == c_name) {
                    is_found = true;
                    // console.log("发现目标:"+c_name);
                }
            }
        }


        if (!is_found) {
            var _pageTitle = "";
            if (c_data != null && c_data != 'undefined') {
                _pageTitle = c_data.pageTitle;
            } else {
                _pageTitle = "dashboard_1";
                c_url = "#/dashboards/dashboard_1"
            }
            console.log("pageTitle:" + _pageTitle);
            var trHtml = '<li ui-sref-active="active"><a  ui-sref="' + c_name + '" href="' + c_url + '"  id="' + c_name + '">' + _pageTitle + '</a></li>';


            // 添加到历史记录表中,已存在时不新增
            var $history = $("#history");
            var html = $history.html();
            $history.append(trHtml);

            // console.log("trHtml:"+trHtml);

            //console.log("序号:"+ index);
            historylist[index] = {'name': c_name};
            //console.log("historylist-name:"+ historylist[index].name);
            index++;

        }

    }
}

// 路由权限控制 add by dhw 2015-09-18
// 路由权限控制
function LoginUserService($q, $timeout, $rootScope, $location, $http) {
    //alert('LoginUserService');

    console.log('LoginUserService');
    var index = 0;
    return {
        // 将权限缓存到 Session，以避免后续请求不停的访问服务器
        permissionModel: {permission: {}, isPermissionLoaded: false},

        permissionCheck: function () {

            //alert('permissionCheck');
            // 返回一个承诺(promise).
            var deferred = $q.defer();

            // 这里只是在承诺的作用域中保存一个指向上层作用域的指针。
            var parentPointer = this;

            // 检查是否已从服务获取到权限对象(已登录用户的角色列表)
            if (this.permissionModel.isPermissionLoaded) {

                // 检查当前用户是否有权限访问当前路由
                //this.getPermission(this.permissionModel, nextRoteUrl, deferred);
                index = index + 1
                console.log('has search:' + index);

                console.log('parentPointer:' + JSON.stringify(parentPointer));
                deferred.resolve(parentPointer);

            } else {
                // 如果还没权限对象，我们会去服务端获取。
                console.log('new search:' + index);

                $http({
                    method: 'POST',
                    url: '/jsp/base_search.jsp',
                    data: {flag: 0},
                    params: {
                        classid: 'base_search',
                        action: 'loginuserinfo',
                        format: 'mjson',
                        id: Math.random(),
                        userid: strUserId
                        //loginguid: window.strLoginGuid
                    }
                }).success(function (response) {
                    console.log('loginuserifnos:' + JSON.stringify(response.loginuserifnos));

                    var orgdata = response.loginuserifnos.orgdata[0]
                    console.log('=====orgdata=======:' + JSON.stringify(orgdata));

                    // 当服务器返回之后，我们开始填充权限对象
                    parentPointer.permissionModel.permission = response.loginuserifnos;

                    // 将权限对象处理完成的标记设为 true 并保存在 Session，
                    // Session 中的用户，在后续的路由请求中可以重用该权限对象
                    parentPointer.permissionModel.isPermissionLoaded = true;


                    deferred.resolve(parentPointer);

                    // 检查当前用户是否有必须角色访问该路由
                    //parentPointer.getPermission(parentPointer.permissionModel, nextRoteUrl, deferred);


                }).error(function (response) {
                    //处理错误
                    console.log('读取用户菜单出错了:' + response);
                })
            } //end else 
            return deferred.promise;
        },

        //方法:检查当前用户是否有必须角色访问该路由
        //'permissionModel' 保存了从服务端返回的当前用户的角色信息
        //'nextRoteUrl' 是即将要访问的地址
        //'deferred' 是用来处理承诺的对象
        getPermission: function (permissionModel, nextRoteUrl, deferred) {


            var ifPermissionPassed = false;

            /*
             // 检查有没有权限
             var userAccessRouteMap=permissionModel.permission ;

             // console.log('userAccessRouteMap:'+userAccessRouteMap);

             for (var i = 0, len = userAccessRouteMap.length; i < len; i++) {
             var AccessRoute=userAccessRouteMap[i];
             var uisref="/"+AccessRoute.webrefaddr;

             console.log('webrefaddr:'+uisref+"  :"+nextRoteUrl );

             if (uisref === nextRoteUrl) {
             ifPermissionPassed = true;
             break;
             }
             }
             */

            // 返回对象
            deferred.resolve();
        }
    };
}

function localeStorageService($rootScope, localeStorageServiceHelper) {
    //console.log("initialization locate storage service!");

    this.showtab = localeStorageServiceHelper.showtab;
    this.hidetab = localeStorageServiceHelper.hidetab;

    this.appendtab = function (t) {
        localeStorageServiceHelper.appendtab(t);
    };

    this.setcurrent = function (state) {
        localeStorageServiceHelper.setcurrent(state);

    }

    this.removetab = function (state_name) {
        localeStorageServiceHelper.removetab(state_name);
    }

    var _this = this;
    this.length = 0;
    this.items = new Array();
    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof(arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }

    this.remove = function (in_key) {
        var tmp_value;
        if (typeof(this.items[in_key]) != 'undefined') {
            this.length--;
            var tmp_value = this.items[in_key];
            delete this.items[in_key];
        }
        var list = window.service.pagelist;
//        var list = _this.get("page_historylist");
        if (list && list.length) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].name == in_key) {
                    list.splice(i, 1);
                    break;
                }
            }
        }

        return tmp_value;
    }

    this.get = function (in_key) {
        return this.items[in_key];
    }

    this.set = function (in_key, in_value) {
        if (typeof(in_value) != 'undefined') {
            if (typeof(this.items[in_key]) == 'undefined') {
                this.length++;
            }

            this.items[in_key] = in_value;
        }
        return in_value;
    }

    this.hasItem = function (in_key) {
        return typeof(this.items[in_key]) != 'undefined';
    }

    /**
     * 历史纪录项 List
     * @param scope 当前域
     * @param savedata 需要保存的
     */
    this.pageHistory = function (scope, savedata) {
        scope.$on("page_stat", function (event, data) {

//			console.log("page_stat@service--------------------");
//			console.log(data);
//			console.log("page_stat@service--------------------");
            //需要保存的数据
            var saveobj = {
                name: data.fromState.name,//用于跳转
                title: data.fromState.data.pageTitle,//页面信息
                data: savedata()
            };

//			var list = _this.get("page_historylist");
            var list = window.service.pagelist;
            if (list == undefined || list.length == 0) {
                list = [];
                list.push(saveobj);
            } else {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].name == saveobj.name) {
                        list.splice(i, 1);
                        break;
                    }
                }
                list.unshift(saveobj);
            }
            window.service.pagelist = list;
//			_this.set("page_historylist",list);
        });
    }
    this.getHistoryItem = function (_name) {
        var list = window.service.pagelist;
//    	var list = _this.get("page_historylist");
        var temp = null;
        if (list == undefined || list.length == 0) {
            return temp;
        }
        for (var i = 0; i < list.length; i++) {
            if (list[i].name == _name) {
                temp = list[i];
                break;
            }
        }
        if (temp) {
            return temp.data;
        } else {
            return temp;
        }
    }
    this.clearHistoryList = function () {
        window.service.pagelist = [];
//    	_this.set("page_historylist",[]);
    }


    var listener = function (event, toState, toParams, fromState, fromParams) {
        localeStorageServiceHelper.setcurrent(toState);

    };

//    $rootScope.$on('$stateChangeStart', listener);
}


/**
 *
 * Pass all Services into module
 */
angular
    .module('inspinia')
    .service('BaseService', BaseService)
    .service('ProItemHeaderService', ['BaseService', ProItemHeaderService])
    .service('BasemanService', ['BaseService', BasemanService])
    .service('FormValidatorService', ['notify', '$timeout', FormValidatorService])
    .service('AuthorizationService', AuthorizationService)
    .service('HistoryDataService', HistoryDataService)
    .service('LoginUserService', LoginUserService)
    .service('localeStorageService', localeStorageService)
    .service('localeStorageServiceHelper', localeStorageServiceHelper)

	