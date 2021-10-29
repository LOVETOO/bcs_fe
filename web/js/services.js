define(['app', 'swalApi'], function (app, swalApi) {
    /**
     * Copyright 2015 Hczy
     *in
     * Main service.js file
     * Define services with data used in Inspinia Service
     *
     *
     * Services
     *  - BaseService //基础service
     *  尽量不要在子类实现请求与其他服务
     */

    service = {
        pagelist: [],
        openCommonModal: function (o) {
            console.log('openCommonModal: ' + o);

            if (angular.element("#commonModal").next().attr("id") != "commonModal1") {
                var $div = angular.element("#commonModal").after(angular.element("#commonModal").clone(true).attr({
                    "display": "none",
                    "id": "commonModal1"
                }));
                service.divresize($div);
            } else {
                angular.element("#commonModal").remove();
                var $div = angular.element("#commonModal1").clone(true).attr({"display": "block", "id": "commonModal"});
                angular.element("#commonModal1").before($div);
                service.divresize($div);
            }

            $("#commonModalFrame").attr("src", o.url);
            if (o.title) {
                $("#commonModalTitle").html(o.title);
            }
            //关闭页面的回调方法
            if (o.ondestroy) {
                this.onDestroy = o.ondestroy;
            }

            $("#commonModal").modal({backdrop: 'static', keyboard: false});
            //$("#commonModal>div.modal-dialog").attr("style", "");
            //$("#commonModal>div.modal-dialog div.modal-body").attr("style", "");

            $("#commonModal").modal({backdrop: 'static', keyboard: false});

            if (o.style) {
                $("#commonModal").children(":first").css(o.style);
            }

            //窗口最大化
            if (o.windowMax === true) {
                $("#commonModal .modmax").click();
            }
            //页面加载完毕调用setData()
            var iframe = document.getElementById("commonModalFrame");

            if (iframe.attachEvent) {
                iframe.attachEvent("onload", function () {
                    //iframe加载完成后你需要进行的操作
                    if (iframe.contentWindow.setData) {
                        iframe.contentWindow.setData(o);
                    }
                });
            } else {
                iframe.onload = function () {
                    //iframe加载完成后你需要进行的操作
                    if (iframe.contentWindow.setData) {
                        iframe.contentWindow.setData(o);
                    }
                };
            }
        },
        //窗口销毁时调用方法
        onDestroy: null,
        closeCommonModal: function () {
            $("#commonModal").modal("hide");
            //方法回调
            if (this.onDestroy) {
                this.onDestroy();
            }
        },
        //当前流程实例控制器
        currWfCtrl: null,

        currModalH: null,

        //通用框缩放
        divresize: function (div) {
            div.find(".ui-widget-content").resizable({
                distance: 0,
                minHeight: 440
            });
            div.find(".ui-widget-content").resize(function () {
                var mH = $(this).height();
                var mhH = $(this).children().children(".modal-header").outerHeight(true);
                $(this).children().children(".modal-body").css("height", mH - mhH);
                div.find("body").css("overflow", "auto");
            });
            //删除事件点击兼容拖拽，点击后再加载
            div.find(".ui-resizable-se,.ui-resizable-s,.ui-resizable-e").mousedown(function () {
                div.find(".ui-resizable").addClass("resizing");
                div.find(".ui-resizable-se").closest("body").on('mouseup', mouseup1);
                console.log('resize-mousedown');
            });

            function mouseup1() {
                div.find(".ui-resizable").removeClass("resizing");
                div.find(".ui-resizable-se").closest("body").off('mouseup', mouseup1);
                console.log('resize-mouseup');
            }
        }
    }
    ;

    /**
     * 关闭父窗口
     * @constructor
     */
    window.CloseOwnerWindow = function () {

    };

    function BaseService($http, $q, $modal, notify, $location, $timeout) {
        this.controller = null;
        this.FrmInfo;
        var _this = this;
        var self = this;

        this.wfInfo = null;

        //请求路径（子类可覆盖）
        this.requestUrl = "/jsp/req.jsp";

        this.editObj = {
            key: "",
            value: "",
            obj: null
        };
        this.setEditObj = function (obj) {
            this.editObj = obj;
            //this._saveStorage("currEditObj", JSON.stringify(obj));
        };
        this.getEditObj = function () {
            if (this._loadStorage("currEditObj")) {
                return this._loadStorageObj("currEditObj");
            } else
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
        //初始化通用查询页数信息
        this.pageInit = function ($scope) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            $scope.pageSize = "10";
            $scope.totalCount = 1;
            $scope.pages = 1;

            $scope.search = function (params) {
                var postdata = {
                    pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                if (params) {
                    postdata.params = params;
                }
                $scope._pageLoad(postdata)
            }

            //跳转页Enter
            $scope.keyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    if ($scope.oldPage != $scope.currentPage && $scope.currentPage > 0 && $scope.currentPage <= $scope.pages) {
                        var postdata = {
                            pagination: "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                        };
                        $scope._pageLoad(postdata);
                    }
                }
            }
            //首页
            $scope.firstpage = function () {
                if ($scope.currentPage <= 1) {
                    return;
                }
                var postdata = {
                    pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope._pageLoad(postdata);
            }
            //上一页
            $scope.prevpage = function () {
                if ($scope.currentPage == 1) return;
                var num = Number($scope.currentPage) - 1;
                var postdata = {
                    pagination: "pn=" + num + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope._pageLoad(postdata);
            }
            //下一页
            $scope.nextpage = function () {
                if ($scope.currentPage >= $scope.pages) return;
                var num = Number($scope.currentPage) + 1;
                var postdata = {
                    pagination: "pn=" + num + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope._pageLoad(postdata);
            }
            //末页
            $scope.lastpage = function () {
                if ($scope.currentPage >= $scope.pages) {
                    return;
                }
                var postdata = {
                    pagination: "pn=" + $scope.pages + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope._pageLoad(postdata);
            }
            //页数大小改变
            $scope.pschange = function (ps) {
                var postdata = {
                    pagination: "pn=1,ps=" + ps + ",pc=0,cn=0,ci=0"
                };
                $scope._pageLoad(postdata);
            }

        }
        //初始化网格页数
        this.pageGridInit = function ($scope, params) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;

            var postdata = {
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            };
            if (params) {
                postdata.params = params;
            }
            $scope.searchData(postdata)

            //跳转页Enter
            $scope.keyup = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (keycode == 13) {
                    if ($scope.oldPage != $scope.currentPage && $scope.currentPage > 0 && $scope.currentPage <= $scope.pages) {
                        var postdata = {
                            pagination: "pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                        };
                        $scope.searchData(postdata);
                    }
                }
            }
            //首页
            $scope.firstpage = function () {
                if ($scope.currentPage <= 1) {
                    return;
                }
                var postdata = {
                    pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope.searchData(postdata);
            }
            //上一页
            $scope.prevpage = function () {
                if ($scope.currentPage == 1) return;
                var num = Number($scope.currentPage) - 1;
                var postdata = {
                    pagination: "pn=" + num + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope.searchData(postdata);
            }
            //下一页
            $scope.nextpage = function () {
                if ($scope.currentPage >= $scope.pages) return;
                var num = Number($scope.currentPage) + 1;
                var postdata = {
                    pagination: "pn=" + num + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope.searchData(postdata);
            }
            //末页
            $scope.lastpage = function () {
                if ($scope.currentPage >= $scope.pages) {
                    return;
                }
                var postdata = {
                    pagination: "pn=" + $scope.pages + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
                };
                $scope.searchData(postdata);
            }
            //页数大小改变
            $scope.pschange = function (ps) {
                var postdata = {
                    pagination: "pn=1,ps=" + ps + ",pc=0,cn=0,ci=0"
                };
                $scope.searchData(postdata);
            }

        }
        this._pschange = function ($scope, ps) { //Footable分页-改变页数大小
            var pc = Math.ceil($scope.totalCount / ps);
            var pageInfoStr = "pn=1,ps=" + ps + ",pc=" + pc + ",cn=" + $scope.totalCount + ",ci=0";
            this.pageInfoOp($scope, pageInfoStr);
        }


        this.RequestPostSync = function (classid, action, data, url) {
            if (classid == undefined) {
                notify({
                    message: "类名必须赋值",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });
                return;
            }
            if (action == undefined) {
                notify({
                    message: "操作必须赋值",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });
                return;
            }
            var requestUrl = this.requestUrl;
            requestUrl = url || requestUrl;
            requestUrl = requestUrl + "?format=mjson&classid=" + classid + "&id=" + Math.random() + "&action=" + action;

            IncRequestCount("post");
            r = $.ajax({
                type: "POST",
                url: requestUrl,
                dataType: 'json',
                processData: false,
                contentType: "application/json",
                data: JSON.stringify(data),
                async: false,
                headers: {"ajax": "true"}
            });

            DecRequestCount();

            if (r.status != 200) {
                error = r.responseJSON;
                if (error == "" || error == undefined) {
                    notify({
                        message: "未知异常",
                        classes: "alert-danger",
                        templateUrl: 'views/common/notify.html'
                    });
                    return {};
                } else {
                    notify({
                        message: error.message,
                        classes: "alert-danger",
                        templateUrl: 'views/common/notify.html'
                    });
                    return {};
                }
            } else {
                return r.responseJSON;
            }
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
        this.RequestPost = function (classid, action, data, show_mb, url) {
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
            if (show_mb) {
            } else {
                IncRequestCount("post");
            }

            $http({
                method: 'POST',
                url: this.requestUrl,
                data: data,
                params: {
                    classid: classid,
                    action: action,
                    format: 'mjson',
                    id: Math.random()
                },
                headers: {"ajax": "true"}
            })
                .success(function (data, status, headers, config) {
                    if (show_mb) {
                    } else {
                        DecRequestCount();
                    }
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) { //出错提醒已经处理
                    if (show_mb) {
                    } else {
                        DecRequestCount();
                    }
                    notify.closeAll();
                    if (config.params)
                        console.info("errorcode:" + status + ",requestMethod:" + config.params.classid + "." + config.params.action);

                    if (data && data != null && data != undefined) {
                        if (!data.message || data.message == "") data.message = "未知异常！";
                        if (!show_mb)
                            notify({
                                message: data.message,
                                classes: "alert-danger",
                                templateUrl: 'views/common/notify.html'
                            });
                        deferred.reject(data);
                    } else {
                        notify({
                            message: "网络异常！",
                            classes: "alert-danger",
                            templateUrl: 'views/common/notify.html'
                        });
                        console.log("网络异常！");
                        deferred.reject({
                            message: '网络异常！-' + status
                        });
                    }
                });
            return deferred.promise;
        }

        this.RequestPostSync = function (classid, action, data, url) {
            if (classid == undefined) {
                notify({
                    message: "类名必须赋值",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });
                return;
            }
            if (action == undefined) {
                notify({
                    message: "操作必须赋值",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });
                return;
            }
            var requestUrl = this.requestUrl;
            requestUrl = url || requestUrl;
            requestUrl = requestUrl + "?format=mjson&classid=" + classid + "&id=" + Math.random() + "&action=" + action;

            IncRequestCount("post");

            r = $.ajax({
                type: "POST",
                url: requestUrl,
                dataType: 'json',
                processData: false,
                contentType: "application/json",
                data: JSON.stringify(data),
                async: false,
                headers: {"ajax": "true"}
            });

            DecRequestCount();

            if (r.status != 200) {
                error = r.responseJSON;
                if (error == "" || error == undefined) {
                    notify({
                        message: "未知异常",
                        classes: "alert-danger",
                        templateUrl: 'views/common/notify.html'
                    });
                    return {};
                } else {
                    notify({
                        message: error.message,
                        classes: "alert-danger",
                        templateUrl: 'views/common/notify.html'
                    });
                    return {};
                }
            } else {
                return r.responseJSON;
            }
        }

        this.RequestPostAjax = function (classid, action, data, url) {
            try {
                if (window.GRID_INPUT != undefined && window.GRID_INPUT.getValue != undefined) {//保存时获取正在编辑单元格值
                    window.GRID_INPUT.getValue();
                    window.GRID_INPUT.params.stopEditing(true);
                    window.GRID_INPUT.destroy();
                    window.GRID_INPUT = undefined;
                }
            } catch (e) {

            }
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
            requestUrl = requestUrl + "?format=mjson&classid="
                + classid + "&id=" + Math.random() + "&action=" + action;
            var deferred = $q.defer();
            if (classid == "base_search" && action.indexOf("searchdict") > -1 && data.dictcode != undefined && data.dictcode.length > 0) {
                if (HczyCommon.isArray(window.DICTS[data.dictcode]) && window.DICTS[data.dictcode].length > 0) {
                    deferred.resolve({dicts: window.DICTS[data.dictcode]});
                    return deferred.promise;
                }
            }
            data = HczyCommon.stringPropToNum(data);
            $.ajax({
                type: "POST", dataType: 'json',
                processData: false,
                contentType: "application/json",
                url: requestUrl,
                headers: {"ajax": "true"},
                data: JSON.stringify(data),
                async: false,
                success: function (data, textStatus) {
                    deferred.resolve(data);
                    if (classid == "base_search" && action.indexOf("searchdict") > -1 && data.dictcode != undefined && data.dictcode.length > 0) {
                        if (HczyCommon.isArray(data.dicts) && data.dicts.length > 0) {
                            var dicts = data.dicts;
                            if (!HczyCommon.isArray(window.DICTS[data.dictcode])) {
                                window.DICTS[data.dictcode] = [];
                            }
                            for (var i = 0; i < data.dicts.length; i++) {
                                data.dicts[i].id = data.dicts[i].dictvalue;
                                data.dicts[i].name = data.dicts[i].dictname;
                                data.dicts[i].value = data.dicts[i].dictvalue;
                                data.dicts[i].desc = data.dicts[i].dictname;
                                window.DICTS[data.dictcode].push(data.dicts[i]);
                            }
                        }
                    }
                },
                error: function (XMLHttpRequest, status, errorThrown) {
                    notify.closeAll();
                    if (errorThrown) {
                        console.info("errorcode:" + status + ",requestMethod:" + this.classid + "." + this.action);
                    }
                    if (errorThrown && errorThrown != null && errorThrown != undefined) {
                        if (!errorThrown || errorThrown == "") data.message = "未知异常！";
                        notify({
                            message: errorThrown,
                            classes: "alert-danger",
                            templateUrl: 'views/common/notify.html'
                        });
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
                swalApi.info("类名必须赋值");
                /*notify({
                    message: "类名必须赋值",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });*/
                return;
            }
            if (action == undefined) {
                swalApi.info("操作必须赋值");
                /*notify({
                    message: "操作必须赋值",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });*/
                return;
            }
            var requestUrl = this.requestUrl;
            requestUrl = url || requestUrl;
            requestUrl = requestUrl + "?format=mjson&classid=" +
                classid + "&id=" + Math.random() + "&action=" + action;
            $.ajax({
                type: "POST",
                url: requestUrl,
                dataType: 'json',
                processData: false,
                contentType: "application/json",
                data: JSON.stringify(data),
                async: false,
                headers: {"ajax": "true"},
                success: function (data, textStatus) {
                    obj = {
                        data: data,
                        pass: true
                    }
                },
                error: function (XMLHttpRequest, status, errorThrown) {
                    var error = JSON.parse(XMLHttpRequest.responseText)
                    obj = {
                        pass: false,
                        msg: error.message
                    }
                    if (errorThrown) {
                        console.info("errorcode:" + status + ",requestMethod:" + this.classid + "." + this.action);
                    }
                    if (obj.msg) {
                        /*notify({
                            message: obj.msg,
                            classes: "alert-danger",
                            templateUrl: 'views/common/notify.html'
                        });*/
                        swalApi(obj.msg);
                    } else if (errorThrown && errorThrown != null && errorThrown != undefined) {
                        if (!errorThrown || errorThrown == "") data.message = "未知异常！";
                        /*notify({
                            message: errorThrown,
                            classes: "alert-danger",
                            templateUrl: 'views/common/notify.html'
                        });*/
                        swalApi(errorThrown);
                    } else {
                        /*notify({
                            message: "网络异常！",
                            classes: "alert-danger",
                            templateUrl: 'views/common/notify.html'
                        });*/
                        swalApi("网络异常");
                        console.log("网络异常！");
                    }
                }
            });
            return obj;
        };

        //设置提示窗口的默认值
        /* swal.setDefaults({
        confirmButtonColor: '#1AB394', //使用该参数来修改“确认”按钮的背景颜色（必须是十六进制值）。
        confirmButtonText: '确定', //使用该参数来修改“确认”按钮的显示文本。
        cancelButtonText: '取消', //使用该参数来修改“取消”按钮的显示文本。
        allowEscapeKey: true, //如果设置为true，用户可以通过按下Escape键关闭弹窗。
        allowOutsideClick: true //如果设置为true，用户点击弹窗外部可关闭弹窗。
    }); */

        /***
         * 通用提示框
         */
        //删除提示-有选择
        this.swalDelete = function (title, text, fun) {
            swal({
                title: title,
                text: text,
                type: "warning",
                showCancelButton: true,
                // confirmButtonColor: "#1ab394",
                // confirmButtonText: "确定",
                // cancelButtonText: "取消",
                closeOnConfirm: false,//如果希望以后点击了确认按钮后模态窗口仍然保留就设置为"false"。该参数在其他SweetAlert触发确认按钮事件时十分有用。
                allowOutsideClick: true,//	如果设置为“true”，用户可以通过点击警告框以外的区域关闭警告框。
                // timer:3000,	//警告框自动关闭的时间。单位是ms。
            }, function (bool) {
                if (!bool) {
                    if (fun) {
                        fun(bool);
                    }
                } else if (bool) {
                    swal({
                        title: "删除!",
                        text: "成功删除!",
                        type: "success",
                        closeOnConfirm: false,
                        allowOutsideClick: true,
                        timer: 3000,
                    }, function () {
                        sweetAlert.close();
                        if (fun) {
                            fun(bool);
                        }
                    })
                }
            });
        };
        //警告提示-有选择
        this.swalWarning = function (title, text, fun) {
            swal({
                title: title,
                text: text,
                type: "warning",
                showCancelButton: true,
                // confirmButtonColor: "#1ab394",
                // confirmButtonText: "确定",
                // cancelButtonText: "取消",
                closeOnConfirm: false,
                allowOutsideClick: true,
            }, function (bool) {
                sweetAlert.close();
                if (bool) {
                    if (fun) {
                        fun(bool);
                    }
                }
            });
        };
        //普通提示
        this.swal = function (title, text, fun) {
            swal({
                title: title,
                text: text,
                closeOnConfirm: false,
                allowOutsideClick: true,
                timer: 3000,
            }, function () {
                sweetAlert.close();
                if (fun) {
                    fun();
                }
            });
        };
        //成功提示
        this.swalSuccess = function (title, text, fun) {
            swal({
                title: title,
                text: text,
                type: "success",
                // confirmButtonText: "确定",
                closeOnConfirm: false,
                allowOutsideClick: true,
                timer: 3000,
            }, function () {
                sweetAlert.close();//关闭提示框
                if (fun) {
                    fun();
                }
            });
        };

        //错误提示
        this.swalError = function (title, text, fun) {
            swal({
                title: title,
                text: text,
                type: "warning",
                closeOnConfirm: false,
                allowOutsideClick: true,
                timer: 3000,
            }, function () {
                sweetAlert.close();//关闭提示框
                if (fun) {
                    fun();
                }
            });
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
            $(sqlWhereBlock).find("input[name='in']").each(function () { //in需要的只能是ID
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
            if (searchText == "" || searchText == undefined) return sqlWhere;
            searchText = String(searchText).toLowerCase();
            searchText = searchText.replace(/\*/g, '%'); //把*替换为%
            if (op == "center") {
                for (var i = 0; i < len; i++) {
                    sqlWhere += i == len - 1 ? " lower(" + arr[i] + ") like lower('%" + searchText + "%')" : " lower(" + arr[i] + ") like lower('%" + searchText + "%') or ";
                }
            } else if (op == "left") {
                for (var i = 0; i < len; i++) {
                    sqlWhere += i == len - 1 ? " lower(" + arr[i] + ") like lower('" + searchText + "%')" : " lower(" + arr[i] + ") like lower('" + searchText + "%') or ";
                }
            } else if (op == "right") {
                for (var i = 0; i < len; i++) {
                    sqlWhere += i == len - 1 ? " lower(" + arr[i] + ") like lower('%" + searchText + "')" : " lower(" + arr[i] + ") like lower('%" + searchText + "') or ";
                }
            }
            console.log('sqlWhere: ' + sqlWhere);
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
            notifyFn({
                message: msg,
                classes: classes,
                templateUrl: inspiniaTemplate
            });
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
            classes = classes || 'alert-info';
            notify({
                message: msg,
                classes: classes,
                templateUrl: template
            });
            var t = (classes == "alert-info" ? 1000 : 3000);
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
        this.openFrm = function (templateUrl, controller, $scope, windowClass, size, backdrop) {
            var bgclass = "";
            var sizeStr = "";
            var back = true;
            if (windowClass) {
                bgclass = windowClass;
            }
            if (size) {
                sizeStr = size;
            }
            if (backdrop || backdrop == false) {
                back = backdrop;
            }
            return $modal.open({
                windowTemplateUrl: '',
                templateUrl: templateUrl,
                controller: controller,
                scope: $scope,
                size: sizeStr,
                windowClass: bgclass,
                resolve: {
                    $parent: function () {//data作为modal的controller传入的参数
                        return $scope;//用于传递数据
                    }
                }
            });
        }
        /**
         * 高级统一弹窗
         * @param Controller 必填 第一个参数
         * @param $scope 必填 第二个参数
         * @param templateUrl 模板路径
         * @param size 可选  窗体大小
         * @param bgclass 可选 增加弹窗的class
         * @deprecated 已过时，请勿再使用 2019-01-11
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
            // var FrmInfotemp = datamap.get(key); //取缓存窗体信息
            // if (FrmInfotemp && $scope.FrmInfo.is_high !== false) {
            //     if (!$scope.FrmInfo.is_custom_search)
            //         $scope.FrmInfo = HczyCommon.copyobj1($scope.FrmInfo, FrmInfotemp);
            // }

            if ($scope.FrmInfo.type == "checkbox") {
                url = "views/common/Pop_Common.html";
                sizeStr = "lg";
            }

            // 高级查询组合
            if ($scope.FrmInfo.is_high) {
                url = "views/common/Pop_Common_High_New.html";
                sizeStr = "md";
            }
            //测试最新网格
            /**if($scope.FrmInfo.is_high_new){
			url = "views/common/Pop_Common_High_New.html";
            sizeStr = "lg";
        }*/
            var commonSearchSetting = {
                classId: $scope.FrmInfo.classid,
                action: $scope.FrmInfo.action,
                title: $scope.FrmInfo.title,
                checkbox: $scope.FrmInfo.type === "checkbox",
                postData: $scope.FrmInfo.postdata,
                sqlWhere: $scope.FrmInfo.sqlBlock,
                dataRelationName: $scope.FrmInfo.backdatas,
                keys: $scope.FrmInfo.searchlist,
                gridOptions: {
                    columnDefs: $scope.FrmInfo.thead.map(function (old) {
                        return {
                            field: old.code,
                            headerName: old.name
                        };
                    })
                },
                showDeprecated: true
            };

            return $modal.openCommonSearch(commonSearchSetting);
            return this.openFrm(url, controller, $scope, bg_class, sizeStr);
        }

        /**
         * 高级统一弹窗
         * @param Controller 必填 第一个参数
         * @param $scope 必填 第二个参数
         * @param templateUrl 模板路径
         * @param size 可选  窗体大小
         * @param bgclass 可选 增加弹窗的class
         */
        this.openbillwfform = function (controller, $scope, templateUrl, size, bgclass) {
            /**if ($scope != undefined && $scope.data != undefined && $scope.data.currItem.stat == 5) {//已审核不能打开弹出框
		    return;
		}**/
            var url = templateUrl || "views/common/Pop_Common.html";
            var bg_class = bgclass || " ";
            var sizeStr = size || " ";

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
                this.FrmInfo = {
                    title: '查询标题',
                    thead: [{
                        name: '编码',
                        code: 'code'
                    }, {
                        name: '名称',
                        code: 'code'
                    }]
                };
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
                this.FrmInfo = {
                    title: '查询标题',
                    thead: [{
                        name: '编码',
                        code: 'code'
                    }, {
                        name: '名称',
                        code: 'code'
                    }]
                };
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
                notify({
                    message: "浏览器不支持SessionStorage",
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify.html'
                });
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
                scope[options] = {
                    editable: true
                };
            }
        }

        /**
         * 加载词汇到表格列
         * @param args 参数 = {
     *     columns: 表格列(每个需要加载词汇的列必须设置词汇编码dictcode),
     *     ...待后续扩展
     * }
         */
        this.loadDictToColumns = function (args) {
            var promises = [];
            args.columns.forEach(function (column) {
                if (angular.isDefined(column.dictcode)) {
                    //点号代表词汇编码和字段名一致
                    if (column.dictcode === '.') column.dictcode = column.field;

                    //列类型改为下拉
                    column.options = [];
                    column.formatter = Slick.Formatters.SelectOption;

                    console.log('查询词汇开始：' + column.dictcode);

                    promises.push(_this.RequestPost("base_search", "searchdict", {dictcode: column.dictcode})
                        .then(function (data) {
                            console.log('查询词汇完成：' + column.dictcode);

                            console.log('词汇数量 = ' + data.dicts.length);

                            console.log('加载词汇开始：' + column.dictcode);

                            data.dicts.forEach(function (dict) {
                                column.options.push({
                                    value: dict.dictvalue,
                                    desc: dict.dictname
                                });
                            });

                            console.log('加载词汇完成：' + column.dictcode);
                        }));
                }
            });
            return $q.all(promises);
        };

        /**
         *
         * @param grid 网格
         * @param columns 需要隐藏的列 ["column1","column2"]
         */
        this.hiddenColumns = function (grid, columns) {
            $.each(columns, function (index, item) {
                grid.getColumns().splice(grid.getColumnIndex(item), 1);
                grid.setColumns(grid.getColumns());
            })
        }

        /**
         * 打开通用查询窗口
         * 由特定业务类查询调用
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     * }
         * @return {Promise}
         */
        function openCommonPopController(args) {
            if (args.checkBox)
                args.scope.FrmInfo.type = 'checkbox';

            if (args.sqlBlock) {
                args.scope.FrmInfo.sqlBlock = args.sqlBlock;
            }
            else if (args.sqlWhere) {
                var s = args.scope.FrmInfo.sqlBlock;
                args.scope.FrmInfo.sqlBlock = s ? s + ' and (' + args.sqlWhere + ')' : args.sqlWhere;
            }

            return _this.open(CommonPopController, args.scope).result.then(args.then);
        };

        /**
         * 选择用户
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     * }
         * @return {Promise}
         */
        this.chooseUser = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择用户',
                thead: [{
                    name: '人员编码',
                    code: 'employee_code'
                }, {
                    name: '姓名',
                    code: 'employee_name'
                }, {
                    name: '部门编码',
                    code: 'dept_code'
                }, {
                    name: '部门名称',
                    code: 'dept_name'
                }],
                realtime: args.realtime ? args.realtime : false,
                classid: 'base_view_erpemployee_org',
                ignorecase: true, //忽略大小写
                searchlist: ['employee_code', 'employee_name', 'dept_code', 'dept_name']
            };

            return openCommonPopController(args);
        };

        /**
         * 选择客户
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     * }
         * @return {Promise}
         */
        this.chooseCustomer = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择客户',
                thead: [{
                    name: '编号',
                    code: 'customer_code'
                }, {
                    name: '名称',
                    code: 'customer_name'
                }],
                classid: 'customer_org',
                sqlBlock: args.sqlBlock ? args.sqlBlock : 'co.usable = 2',
                searchlist: ['customer_code', 'customer_name'],
                realtime: args.realtime ? args.realtime : false
            };
            if (args.postdata) {
                args.scope.FrmInfo.postdata = args.postdata
            } else {
                args.scope.FrmInfo.postdata = {}
            }
            return openCommonPopController(args);
        };

        /**
         * 选择运营中心
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     * }
         * @return {Promise}
         */
        self.chooseOpCenter = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择运营中心',
                thead: [{
                    name: '名称',
                    code: 'dept_name'
                }/*, {
                name: '简称',
                code: 'short_name'
            }*/, {
                    name: '城市',
                    code: 'areaname'
                }, {
                    name: '区号',
                    code: 'telzone'
                }],
                classid: "dept",
                sqlBlock: "dept_type = 6",
                postdata: args.postdata,
                ignorecase: true, //忽略大小写
                searchlist: ['dept_name', 'dept_code', 'short_name']
            };

            return openCommonPopController(args);
        };

        /**
         * 选择机构：默认选择所有机构，根据条件可筛选
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     * }
         * @return {Promise}
         */
        self.chooseDept = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择部门',
                thead: [{
                    name: '编码',
                    code: 'dept_code'
                }, {
                    name: '名称',
                    code: 'dept_name'
                }/*, {
                name: '简称',
                code: 'short_name'
            }*/],
                classid: "dept",
                sqlBlock: "",
                postdata: args.postdata,
                sqlwhere: args.sqlwhere ? args.sqlwhere : "",
                ignorecase: true, //忽略大小写
                searchlist: ['dept_name', 'dept_code'],
                realtime: args.realtime ? args.realtime : false,
            };

            return openCommonPopController(args);
        };

        /**
         * 选择销售中心
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     * }
         * @return {Promise}
         */
        this.chooseSaleCenter = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择销售中心',
                thead: [{
                    name: '名称',
                    code: 'dept_name'
                }, {
                    name: '简称',
                    code: 'short_name'
                }],
                classid: "dept",
                sqlBlock: "dept_type = 5",
                postdata: args.postdata,
                ignorecase: true, //忽略大小写
                searchlist: ['dept_name', 'dept_code', 'short_name']
            };

            return openCommonPopController(args);
        };

        /**
         * 选择城市
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     *     superid: 省份ID
     * }
         * @return {Promise}
         */
        this.chooseCity = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择城市',
                thead: [{
                    name: '名称',
                    code: 'areaname'
                }, {
                    name: '区号',
                    code: 'telzone'
                }],
                classid: "scparea",
                sqlBlock: "areatype = 5",
                postdata: {
                    search_flag: 1,
                    superid: args.superid > 0 ? args.superid : 0
                },
                searchlist: ["areacode", "areaname", "assistcode", "telzone", "note", "areaname_full"]
            };
            return openCommonPopController(args);
        };


        /**
         * 选择地区
         * @param args = {
     *     scope: 作用域(必须)
     *     then: 回调函数(不推荐使用，为了兼容旧代码保留，推荐直接在返回的Promise后面加.then)
     *     title: 标题
     *     superid: 上级ID
     * }
         * @return {Promise}
         */
        this.chooseArea = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择地区',
                thead: [{
                    name: '名称',
                    code: 'areaname'
                }, {
                    name: '区号',
                    code: 'telzone'
                }],
                classid: "scparea",
                sqlBlock: angular.isDefined(args.areatype) ? ("areatype = " + args.areatype) : '',
                postdata: {
                    search_flag: 1,
                    superid: args.superid > 0 ? args.superid : 0
                },
                searchlist: ["areacode", "areaname", "assistcode", "telzone", "note", 'areaname_full']
            };
            return openCommonPopController(args);
        };
        /**
         * 选择项目
         * @param args = {
     *     scope: 作用域(必须)
     *     title: 标题
     * }
         * @return {Promise}
         */
        this.chooseProject = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择工程项目',
                thead: [{
                    name: '编码',
                    code: 'project_code'
                }, {
                    name: '名称',
                    code: 'project_name'
                }, {
                    name: '项目开发方',
                    code: 'dev_unit_name'
                }, {
                    name: '工程地址',
                    code: 'project_address'
                }],
                classid: 'proj',
                searchlist: ['project_code', 'project_name', 'project_address', 'dev_unit_name']
            };

            return openCommonPopController(args);
        };

        /**
         * 选择产品
         * @param args = {
     *     scope: 作用域(必须)
     *     title: 标题
     * }
         * @return {Promise}
         */
        this.chooseItem = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择产品',
                thead: [{
                    name: '编码',
                    code: 'item_code'
                }, {
                    name: '名称',
                    code: 'item_name'
                }],
                classid: 'item_org',
                searchlist: ['item_code', 'item_name'],
                sqlBlock: args.sqlBlock ? args.sqlBlock : '',
                realtime: args.realtime ? args.realtime : false,
            };
            return openCommonPopController(args);
        };

        /**
         * 选择计量单位
         * @param args = {
     *     scope: 作用域(必须)
     *     title: 标题
     * }
         * @return {Promise}
         */
        this.chooseUom = function (args) {
            args.scope.FrmInfo = {
                title: args.title ? args.title : '选择计量单位',
                thead: [{
                    name: '名称',
                    code: 'uom_name'
                }, {
                    name: '编码',
                    code: 'uom_code'
                }],
                classid: 'uom',
                searchlist: ['uom_code', 'uom_name']
            };

            return openCommonPopController(args);
        };

        /**
         * 获取当前用户
         * 该动作是异步的
         * 返回Promise
         */
        (function () {
            var d = $q.defer();

            var p = d
                .promise
                .then(function () {
                    return self.RequestPost('scpuser', 'select', {
                        userid: strUserId
                    });
                });

            self.getUserQ = function () {
                d.resolve();
                return p;
            };
        })();

    }

    /**
     * 基础数据
     */
    function BasemanService(_BaseService, scope) {
        angular.extend(this, _BaseService);

        /**
         * 高级条件查询
         * @param scope ： 当前作用域  colunm:列定义作为条件  fun：模块控制器的请求数据方法， FrmInfo:可定义的高级查询属性
         *
         */
        this.searchBySql = function (scope, column, fun, FrmInfo) {
            if (!FrmInfo) {
                //默认的属性
                scope.FrmInfo = {
                    ignorecase: 'true', //忽略大小写
                    is_high: true
                };
            } else {
                scope.FrmInfo = FrmInfo
            }
            scope.FrmInfo.thead = column
                .slice(2)
                .map(function (column) {
                    if (!column.type) {
                        if (column.options)
                            column.type = 'list';
                        else if (column.cssClass === 'amt')
                            column.type = 'number';
                        else
                            column.type = 'string';
                    }

                    return {
                        name: column.name,
                        code: column.field,
                        type: column.type,
                        dicts: column.options
                    };
                });

            sessionStorage.setItem('frmInfo', JSON.stringify(scope.FrmInfo));

            this
                .open(CommonPopController1, scope)
                .result
                .then(function (sqlwhere) {
                    scope.sqlwhere = sqlwhere;
                    fun({"sqlwhere": scope.sqlwhere})
                })
        }

        /**
         * 重新初始化分页的参数
         * @param scope ： 当前作用域
         *
         */
        this.initPagePostdata = function (scope) {
            scope.oldPage = 1;
            scope.currentPage = 1;
            if (!scope.pageSize) {
                scope.pageSize = "20";
            }
            scope.totalCount = 1;
            scope.pages = 1;
            var pagination = "pn=1,ps=20,pc=0,cn=0,ci=0"
            return pagination
        }


        this.getParameters = function (scope, param) {
            if (!param) return;
            var isArray = function isArray(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
            var temp_list = [];
            if (typeof param == "string") { //一个
                temp_list.push(param);
            } else if (isArray(param)) { //多个
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

        /*[rt89[ zsxz  gfe,km
     **gird自适应
     */
        this.initGird = function () {
            var wH = $(window).height();
            var titleH = 58;
            var searchH = $(".title-form").height();
            var page_modal = 37;
            var gridH = wH - titleH - searchH - page_modal - 35;
            var treeH = wH - titleH - searchH - 35;
            $(".wrapper .ibox .ui-widget,.wrapper .ibox .ag-blue").css("height", gridH);
            $(".TreeGridBox .ibox-title").css("height", treeH);

            //qch 双网格布局
            //左表
            $(".TreeGridBox .ibox-titleq .ui-widget,.TreeGridBox .ibox-titleq .ag-blue").css("height", treeH);
            //右表
            var leftW = $('.TreeGridBox .ibox-titleq').width();
            $(".TreeGridBox .grid_modal.dbgridR").css("width", " calc( 100% - " + leftW + "px ) ");
            $(".TreeGridBox .grid_modal.dbgridR .ui-widget").css("height", treeH);

            //模态框内网格高度
            var modal = $(".modal").has(".ui-widget,.ag-blue");
            if (!modal) {
                return;
            }
            for (var i = 0; i < modal.length; i++) {
                var x = modal[i];
                $('#' + x.id).on('shown.bs.modal', function () {
                    var mH = $(x).find(".modal-body").height() || 0;
                    var fH = $(x).find(".form-inline").height() || 0;
                    $(x).find(".ui-widget,.ag-blue").css("height", mH - fH - 30);//上下内边距之和

                    if ($(x).find(".ui-widget").parents(".tab-pane").length != 0) {
                        var fH = $(x).find(".ui-widget").parents(".tab-pane").find(".form-inline").outerHeight(true) || 0;
                        var tH = $(x).find(".nav.nav-tabs").outerHeight(true) || 0;
                        var pH = $(x).find(".ui-widget").parents(".tab-pane").find(".panel-body").outerHeight() || 0 - $(x).find(".ui-widget").parents(".tab-pane").find(".panel-body").height() || 0;
                        $(x).find(".ui-widget,.ag-blue").css("height", mH - tH - fH - pH);
                    }
                })
            }
        }

        /**
         * slickgrid可复制
         */
        this.ReadonlyGrid = function (grid) {
            var Columns = grid.getColumns();
            for (var i = 0; i < Columns.length; i++) {
                if (!Columns[i].editor) {
                    if (
                        Columns[i].formatter == Slick.Formatters.SelectOption
                        ||
                        !Columns[i].formatter
                    ) {
                        Columns[i].editor = Slick.Editors.ReadonlyText;
                    }
                }
            }
            grid.setColumns(Columns);

            var Options = grid.getOptions();
            if (Options) {
                Options.editable = true;
                Options.autoEdit = false;
            }
            grid.setOptions(Options);

            grid.render();
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
            $(sqlWhereBlock).find("input[name='in']").each(function () { //in需要的只能是ID
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

        /**
         * 打开模态窗体
         * @param o
         */
        this.openModal = function (e) {
            e.Owner = window
            var ws = [];

            function _(w) {
                try {
                    if (w['service'])
                        ws.push(w);
                    if (w.parent && w.parent != w)
                        _(w.parent)
                } catch (e) {
                    console.log('openModal error... ' + e);
                }
            }

            _(window);
            var D = ws[ws.length - 1];
            return D["service"].openCommonModal(e)
        }

        /**
         * 关闭模态窗体
         * @param o
         */
        this.closeModal = function () {
            var ws = [];

            function _(w) {
                try {
                    if (w['service'])
                        ws.push(w);
                    if (w.parent && w.parent != w)
                        _(w.parent)
                } catch (e) {
                    console.log('closeModal error... ' + e);
                }
            }

            _(window);
            var D = ws[ws.length - 1];
            return D["service"].closeCommonModal()
        }

        /**
         * 设置当前流程实例控制器对象
         * @param e
         * @returns {*|void}
         */
        this.setCurrWfCtrl = function (obj) {
            var ws = [];

            /**
             * 查找顶层父窗口
             * @param wnd
             */
            function getSuperWindow(wnd) {
                try {
                    if (wnd['service'])
                        ws.push(wnd);
                    if (wnd.parent && wnd.parent != wnd)
                        getSuperWindow(wnd.parent)
                } catch (e) {
                    console.log('openModal error... ' + e);
                }
            }

            getSuperWindow(window);
            var D = ws[ws.length - 1];
            return D["service"].currWfCtrl = obj;
        }
        this.getCurrWfCtrl = function () {
            var ws = [];

            /**
             * 查找顶层父窗口
             * @param wnd
             */
            function getSuperWindow(wnd) {
                try {
                    if (wnd['service'])
                        ws.push(wnd);
                    if (wnd.parent && wnd.parent != wnd)
                        getSuperWindow(wnd.parent)
                } catch (e) {
                    console.log('openModal error... ' + e);
                }
            }

            getSuperWindow(window);
            var D = ws[ws.length - 1];
            return D["service"].currWfCtrl;
        }

        this.addFile = function () {

        }


        this.getPrintService = function (scope) {
            scope.addFile = function addFile() {
                /**
                 * 触发上传文件
                 */
                if (document.getElementById("file1")) {
                    document.getElementById("file1").parentNode.removeChild(document.getElementById("file1"));
                }
                var inputObj = document.createElement('input');
                inputObj.setAttribute('id', 'file1');
                inputObj.setAttribute('type', 'file');
                inputObj.setAttribute('name', 'docFile0');
                inputObj.setAttribute("style", 'visibility:hidden');
                inputObj.setAttribute("nv-file-select", '');
                inputObj.setAttribute("uploader", 'uploader');
                // inputObj.setAttribute("accept", "*");
                // inputObj.setAttribute("capture", "camera");
                document.body.appendChild(inputObj);
                inputObj.onchange = scope.uploadFile;
                inputObj.click();
            };
            scope.uploadFile = function uploadFile(o) {
                if (o.target.files) {
                    try {
                        $.ajaxFileUpload({
                            url: "/web/scp/filesuploadsave2.do",
                            type: 'post',
                            secureuri: false,
                            fileElementId: 'file1',//file标签的id
                            dataType: 'text',//返回数据的类型
                            success: function (data, status) {
                                //console.log(data);
                                var userAgent = navigator.userAgent;
                                // if (userAgent.indexOf("Edge") > -1) {
                                data = JSON.parse(data)
                                // } else {
                                //     data = JSON.parse($(data)[0].innerText);
                                // }
                                if (data.data) {

                                    if (!scope.data.currItem.objattachs) {
                                        scope.data.currItem.objattachs = [];
                                    }
                                    scope.data.currItem.objattachs.push({
                                        "docid": data.data[0].docid + "",
                                        "docname": data.data[0].docname,
                                        "url": window.URL.createObjectURL(o.target.files[0])
                                    });
                                    scope.$apply();
                                }
                            },
                            error: function (data, status, e) {
                                console.log(data);
                            }
                        });
                    } finally {
                        // $showMsg.loading.close();
                    }
                }
            };
            scope.downloadAttFile = function downloadAttFile(file) {
                window.open("/downloadfile.do?docid=" + file.docid);
            };
            scope.deleteFile = function deleteFile(file) {
                if (file && file.docid > 0) {
                    for (var i = 0; i < scope.data.currItem.objattachs.length; i++) {
                        if (scope.data.currItem.objattachs[i].docid == file.docid) {
                            scope.data.currItem.objattachs.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        };
        /**
         * 上传附件
         * @param o
         */
        this.uploadFile = function (o) {
            if (o.target.files) {
                try {
                    $.ajaxFileUpload({
                        url: "/web/scp/filesuploadsave2.do",
                        type: 'post',
                        secureuri: false,
                        fileElementId: 'file1',//file标签的id
                        dataType: 'text',//返回数据的类型
                        success: function (data, status) {
                            //console.log(data);
                            var userAgent = navigator.userAgent;
                            // if (userAgent.indexOf("Edge") > -1) {
                            data = JSON.parse(data)
                            // } else {
                            //     data = JSON.parse($(data)[0].innerText);
                            // }
                            if (data.data) {

                                if (!this.data.currItem.objattachs) {
                                    $scope.data.currItem.objattachs = [];
                                }
                                $scope.data.currItem.objattachs.push({
                                    "docid": data.data[0].docid + "",
                                    "docname": data.data[0].docname,
                                    "url": window.URL.createObjectURL(o.target.files[0])
                                });
                                $scope.$apply();
                            }
                        },
                        error: function (data, status, e) {
                            console.log(data);
                        }
                    });
                } finally {
                    // $showMsg.loading.close();
                }
            }
        };

        /**
         * 下载文件
         * @param file
         */
        this.downloadAttFile = function (file) {
            window.open("/downloadfile.do?docid=" + file.docid);
        };

        /**
         * 删除文件
         * @param file
         */
        this.deleteFile = function (file, $scope) {
            if (file && file.docid > 0) {
                for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                    if ($scope.data.currItem.objattachs[i].docid == file.docid) {
                        $scope.data.currItem.objattachs.splice(i, 1);
                        break;
                    }
                }
            }
        };
        /**
         * 获取文件图标
         * @param filename
         * @returns {string}
         */
        this.getAttachIcon = function (filename) {
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
    }

// 表单有效性验证服务 add by yxg 2015-09-16
    function FormValidatorService(notify, $timeout, $q, Magic) {
        var self = this;

        /**
         * 查找label元素。
         * 根据给出的查询器，查找与之匹配的label元素。
         * 查找方式为向前查找，没有兄元素则往上一层再向前，找到label元素则停下。
         * @param selector
         * @return {jQuery}
         */
        function findLabel(selector) {
            var jqSrc = $(selector);

            if (jqSrc.is('label'))
                return jqSrc;

            if (jqSrc.is(document))
                return $();

            var jqTarget = jqSrc.prev();
            if (!jqTarget.length)
                jqTarget = jqSrc.parent();

            if (!jqTarget.length)
                return $();

            return findLabel(jqTarget);
        }

        /**
         * 空值信息
         * 返回必填且未填项对应的label元素的文本组成的数组。
         * 查询依据是元素拥有类non-empty
         * @param args = {
     *     parent: 父查询器，限定在此父元素下搜索后代元素
     * }
         * @return {Array}
         */
        self.emptyMsg = function (args) {
            var result = [];

            var $selected;

            if (args.selector)
                $selected = $(args.selector);
            else if (args.parent)
                $selected = $(args.parent).find(':text,select,textarea');
            else
                return result;

            $selected.filter('.non-empty').each(function () {
                var jqThis = $(this);
                var val = jqThis.val();
                var needPush;
                if (jqThis.is('select'))
                    needPush = !val || val === '?';
                else
                    needPush = !val;

                if (needPush)
                    result.push(findLabel(jqThis).text());
            });

            return result;
        };

        /**
         * 非空提示窗口
         * @param msg
         * @return {*}
         */
        self.noEmptyAlert = function (msg) {
            return Magic.swal({
                title: ['以下内容不能为空，请补充：'].concat(msg)
            });
        };

        /**
         * 非空校验。
         * 返回Promise，若校验不通过，会有提示框且会reject
         * @param args 参见 emptyMsg
         * @return {Promise}
         */
        self.noEmptyCheck = function (args) {
            var checkMission = $q.defer();

            $q.when(args, self.emptyMsg)
                .then(function (msg) {
                    if (msg.length) {
                        checkMission.reject(msg);

                        self.noEmptyAlert(msg);

                        //msg.unshift('以下内容不能为空，请补充：');

                        /* notify.closeAll();
                     notify({
                         title: '以下内容不能为空，请补充：',
                         message: msg.map(function (e) {
                             return '【' + e + '】不能为空';
                         }),
                         classes: "alert-danger",
                         templateUrl: 'views/common/notify-validate.html'
                     });

                     $timeout(function () {
                         notify.closeAll()
                     }, 5000);*/
                    }
                    else
                        checkMission.resolve();
                });

            return checkMission.promise;
        };

        this.validatorFrom = function ($scope, form) {
            var is_pass = true;
            var msg = [];
            var evalValue = this.evalValue; //在外面赋值调用下面的evalValue

            if (typeof (form) == "undefined" || form == null && form == "") {
                form = "#page-wrapper";
            }
            $(form).find("input").each(function () {
                if (this.attributes['data-rule-required'] != undefined && this.attributes['data-rule-required'].value) {
                    var str = this.attributes['data-rule-required'].value;
                    if (this.attributes['data-msg-required'] != undefined && this.value.length == 0 && evalValue(str, $scope)) {
                        var str = this.attributes['data-msg-required'].value;
                        msg.push(str);
                    }
                }
                if (this.attributes['data-rule-number'] != undefined && this.attributes['data-rule-number'].value) {
                    var str = this.attributes['data-rule-number'].value;
                    if (this.attributes['data-msg-number'] != undefined && this.value.length == 0 && evalValue(str, $scope)) {
                        var str = this.attributes['data-msg-number'].value;
                        msg.push(str);
                    }
                }
            });
            $(form).find("select[data-rule-required]").each(function () {
                var str = this.attributes['data-rule-required'].id;
                if (this.attributes['data-msg-required'] != undefined && this.value.length == 0 && evalValue(str, $scope)) {
                    var str = this.attributes['data-msg-required'].id;
                    msg.push(str);
                }
            });
            $(form).find("textarea[data-rule-required]").each(function () {
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
                notify({
                    message: msg,
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify-validate.html'
                });
                setTimeout(function () {
                    notify.closeAll()
                }, 5000);
                return is_pass;
            }
            if (is_pass) {
                var postdata = {
                    level: 0,
                    is_pass: is_pass
                }
                this.setNullToSting($scope.data.currItem, postdata);
                is_pass = postdata.is_pass;
            }
            if (!is_pass) {
                msg.push("数据出现递归，请找管理员");
                notify.closeAll();
                notify({
                    message: msg,
                    classes: "alert-danger",
                    templateUrl: 'views/common/notify-validate.html'
                });
                setTimeout(function () {
                    notify.closeAll()
                }, 5000);
            }
            return is_pass;

        }
        this.setNullToSting = function (arr, postdata) {
            if (arr instanceof Array) {
                for (var i = 0; i < arr.length; i++) {
                    if (postdata.level > 20) {
                        postdata.is_pass = false;
                        return;
                    }
                    this.setNullToSting(arr[i], postdata);
                }
            } else {
                postdata.level++;
                for (var x in arr) {
                    if (arr[x] instanceof Array) {
                        if (postdata.level > 20) {
                            postdata.is_pass = false;
                            postdata.name = x;
                            return;
                        }
                        this.setNullToSting(arr[x], postdata)
                    } else if (arr[x] == null) {
                        arr[x] = "";
                    }
                }
                postdata.level--;
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

// 路由权限控制 add by dhw 2015-09-18
// 路由权限控制
    function AuthorizationService($q, $timeout, $rootScope, $location, $http) {
        return {
            // 将权限缓存到 Session，以避免后续请求不停的访问服务器
            permissionModel: {
                permission: {},
                isPermissionLoaded: false
            },

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
                    $http({
                        method: 'POST',
                        url: '/jsp/useraccessmenu.jsp',
                        data: {
                            flag: 0
                        },
                        params: {
                            classid: 'base_modmenu',
                            action: 'useraccessrute',
                            format: 'mjson',
                            id: Math.random()
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

    function localeStorageServiceHelper($rootScope, $location, $state) {

        if ($location.search().showmode == '2') {
            $rootScope.showmode = 2;
        } else {
            $rootScope.showmode = 1;
            //angular.element('body').css("background-color","#2f4050");
        }

        this.showtab = window.parent.showtab = window.parent.showtab || new Array();
        this.hidetab = window.parent.hidetab = window.parent.hidetab || new Array();
        this.all_tabs = window.parent.all_tabs = window.parent.all_tabs || new Array();

        this.resizetab = function () {
            var maxchar = 60;
            var len = 0;

            var all = this.showtab.concat(this.hidetab);
            this.showtab.splice(0, this.showtab.length);
            this.hidetab.splice(0, this.hidetab.length);

            for (var i = 0; i < all.length; i++) {
                var t = all[i];
                len = len + (t.name || '').length + 1.5;
                if (len > maxchar) {
                    var _hide = all.splice(i, all.length - i);
                    for (var j = 0; j < _hide.length; j++) {
                        this.hidetab.push(_hide[j]);
                    }
                    break;
                } else {
                    this.showtab.push(t);
                }
            }
        }

        this.base_index = 0;


        this.appendtab = function (t) {
            this.base_index = this.base_index + 1;
            this.showtab.splice(this.base_index, 0, t);
            this.resizetab();
        };

        this.removetab = function (state_name) {
            for (var i = this.showtab.length - 1; i >= 0; i--) {
                if (this.showtab[i].state == state_name) {
                    //this.showtab[i].current = true;
                    this.showtab.splice(i, 1);
                }
            }

            for (var i = this.hidetab.length - 1; i >= 0; i--) {
                if (this.hidetab[i].state == state_name) {
                    //this.hidetab[i].current = true;
                    this.hidetab.splice(i, 1);
                }
            }

            for (var i = this.all_tabs.length - 1; i >= 0; i--) {
                if (this.all_tabs[i].state == state_name) {
                    this.all_tabs.splice(i, 1);
                }
            }

            this.resizetab();
            //set current
            //this.showtab[showtab.length-1].current = true;
        };

        this.setcurrent = function (params) {
            var state = params.toState;
            var toParams = params.toParams || {};
            var isnew = true;
            window.userbean.new_tab = true;
            for (var i = 0; i < this.showtab.length; i++) {
                if (this.showtab[i].state == state.name && angular.equals(this.showtab[i].params, toParams)) {
                    this.showtab[i].current = true;
                    if (location.hash !== "#/home") {
                        this.showtab[i].uri = location.hash;
                    }
                    window.userbean.new_tab = false;
                    isnew = false;
                } else {
                    this.showtab[i].current = false;
                }
            }

            for (var i = 0; i < this.hidetab.length; i++) {
                if (this.hidetab[i].state == state.name && angular.equals(this.showtab[i].params, toParams)) {
                    this.hidetab[i].current = true;
                    window.userbean.new_tab = false;
                    isnew = false;
                } else {
                    this.hidetab[i].current = false;
                }
            }

            if (window.userbean.new_tab) {
                var tmp = {state: state.name, uri: "", current: true};
                if (toParams.title)
                    tmp.name = toParams.title;
                else if (state.data)
                    tmp.name = state.data.pageTitle;
                tmp.uri = "#/" + tmp.state;
                tmp.uri = tmp.uri.replace(".", "/");
                if (location.hash !== "#/home" && location.hash !== "") {
                    tmp.uri = location.hash;
                }
                tmp.templateUrl = state.templateUrl;
                if (window.location.origin) {
                    tmp.url = window.location.origin + "/web/index.jsp?t=" + (new Date()).getTime() + tmp.uri;
                } else {
                    tmp.url = "/web/index.jsp?t=" + (new Date()).getTime() + tmp.uri;
                }
                tmp.params = toParams;
                this.appendtab(tmp);
                this.all_tabs.push(tmp);
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
            return window.parent.CURR_STATE_C[in_key];
        }

        this.set = function (in_key, in_value) {
            if (!angular.isString(in_key)) {
                return;
            }
            var str = "#/" + in_key.replace(".", "/");
            if (angular.isObject(in_value)) {
                window.parent.CURR_STATE_C[in_key] = in_value;
                window.parent.CURR_LOCATION[in_key] = "";
            }
            window.location.hash = str;
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

        }
        // 获到现场数据
        this.getSessionData = function () {
            var _stateName = $rootScope.$state.$current.name;
            var _data = sessionStorage.getItem(_stateName);


            return _data;
        }

        // 存放到历史记录表中
        this.saveToHistoryList = function () {

            var c_url = '#' + $rootScope.$state.$current.url;
            var c_name = $rootScope.$state.$current.name;
            var c_data = $rootScope.$state.$current.data; // 首页这个定义这个对象， undefined

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
                historylist[index] = {
                    'name': c_name
                };
                //console.log("historylist-name:"+ historylist[index].name);
                index++;

            }

        }
    }

// 路由权限控制 add by dhw 2015-09-18
    function LoginUserService($q, $timeout, $rootScope, $location, $http) {
        var index = 0;
        return {
            // 将权限缓存到 Session，以避免后续请求不停的访问服务器
            permissionModel: {
                permission: {},
                isPermissionLoaded: false
            },

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
                        data: {
                            flag: 0
                        },
                        params: {
                            classid: 'base_search',
                            action: 'loginuserinfo',
                            format: 'mjson',
                            id: Math.random()
                        }
                    }).success(function (response) {

                        console.log('loginuserifnos:' + JSON.stringify(response.loginuserifnos));

                        var orgdata = response.loginuserifnos.orgdata[0]

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

                // 返回对象
                deferred.resolve();
            }
        };
    }

    function localeStorageService($rootScope, localeStorageServiceHelper) {
        //console.log("initialization locate storage service!");

        this.showtab = localeStorageServiceHelper.showtab;
        this.hidetab = localeStorageServiceHelper.hidetab;

        this.all_tabs = localeStorageServiceHelper.all_tabs;

        this.appendtab = function (t) {
            localeStorageServiceHelper.appendtab(t);
        };

        this.setcurrent = localeStorageServiceHelper.setcurrent.bind(localeStorageServiceHelper);

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
            return window.parent.CURR_STATE_C[in_key];
        }

        this.set = function (in_key, in_value) {
            if (typeof(in_value) != 'undefined') {
                if (typeof(this.items[in_key]) == 'undefined') {
                    this.length++;
                }

                this.items[in_key] = in_value;
            }
            window.location.hash = str;
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
                //需要保存的数据
                var saveobj = {
                    name: data.fromState.name, //用于跳转
                    title: data.fromState.data.pageTitle, //页面信息
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
    /* angular
    .module('inspinia') */
    app
        .service('BaseService', BaseService)
        .service('BasemanService', ['BaseService', BasemanService])
        .service('FormValidatorService', FormValidatorService)
        // .service('AuthorizationService', AuthorizationService)
        .service('HistoryDataService', HistoryDataService)
        .service('LoginUserService', LoginUserService)
        .service('localeStorageService', localeStorageService)
        .service('localeStorageServiceHelper', localeStorageServiceHelper);

    (function () {
        app
            .service('Magic', Magic)
            .service('SlickGridService', SlickGridService)
            // .service('AgGridService', AgGridService)
            .service('BillService', BillService)
            .service('ProjService', ProjService);

        /**
         * 通用服务
         * @param $q
         * @param BasemanService
         * @constructor
         */
        function Magic($q, BasemanService) {
            console.log('Magic loading');

            var self = this; //固定this

            /**
             * 返回变量放入if语句时的返回值
             * @param any
             * @returns {boolean}
             */
            self.ifValue = function (any) {
                return any ? true : false;
            };

            /**
             * 今天
             */
            self.today = function () {
                return new Date().Format('yyyy-MM-dd');
            };

            /**
             * 现在
             */
            self.now = function () {
                return new Date().Format('yyyy-MM-dd hh:mm:ss');
            };

            /**
             * 今年
             */
            self.nowYear = function () {
                return new Date().Format('yyyy')
            }

            /**
             * 当前月份
             */
            self.nowMonth = function () {
                return new Date().Format('MM')
            }

            /**
             * 是非空数组吗？
             * @param any
             * @returns {boolean}
             */
            self.isNotEmptyArray = function (any) {
                return angular.isArray(any) && any.length > 0;
            };

            /**
             * 是字符串吗？
             * @param any
             * @returns {boolean}
             */
            self.isStr = angular.isString;

            /**
             * 是数字吗？
             * @param any
             * @returns {boolean}
             */
            self.isNum = function (any) {
                return angular.isNumber(any) && any === any;
            };

            /**
             * 是整数吗？
             * @param any
             * @returns {boolean}
             */
            self.isInt = function (any) {
                return self.isNum(any) && any % 1 === 0;
            };

            /**
             * 类型是字符串且内容是数字吗？
             * @param any
             * @returns {boolean}
             */
            self.isStrOfNum = function (any) {
                return self.isStr(any) && /^-?\d{1,3}(,?\d{3})*(\.\d+)?$/.test(any);
            };

            /**
             * 判断是否是类似数字的东西，包括正常的数字和内容是数字的字符串
             * @param any
             * @return {boolean}
             */
            self.likeNum = function (any) {
                return self.isNum(any) || self.isStrOfNum(any);
            };

            /**
             * 类型是字符串且内容是整数吗？
             * @param any
             * @returns {boolean}
             */
            self.isStrOfInt = function (any) {
                return self.isStr(any) && /^-?\d{1,3}(,?\d{3})*(\.0+)?$/.test(any);
            };

            /**
             * 是字符串或数字吗？
             * @param any
             * @returns {boolean}
             */
            self.isStrOrNum = function (any) {
                return self.isStr(any) || self.isNum(any);
            };

            /**
             * 是对象或函数吗？
             * @param any
             * @returns {boolean}
             */
            self.isObjOrFun = function (any) {
                return angular.isObject(any) || angular.isFunction(any);
            };

            /**
             * 此方法必定返回一个函数：
             * 若参数是函数，直接返回参数；
             * 否则返回一个新函数，该函数返回参数
             * @param funOrNot
             * @returns {Function}
             */
            self.toFun = function (funOrNot) {
                if (angular.isFunction(funOrNot))
                    return funOrNot;

                return function () {
                    return funOrNot;
                }
            };

            /**
             * 字符串转数字，转换失败返回指定值，指定值默认为0
             * @param any 待转换的字符串
             * @param failReturn 默认为0
             * @return {Number}
             */
            self.toNum = function (any, failReturn) {
                if (any instanceof Number)
                    any = any.valueOf();

                if (self.isNum(any))
                    return any;

                if (!self.isNum(failReturn))
                    failReturn = 0;

                if (self.isStrOfNum(any))
                    return Number(any.replace(/,/g, ''));

                return failReturn;
            };

            /**
             * 字符串转整数，转换失败返回指定值，指定值默认为0
             * @param any 待转换的字符串
             * @param failReturn 默认为0
             * @return {Number}
             */
            self.toInt = function (any, failReturn) {
                if (any instanceof Number)
                    any = any.valueOf();

                if (self.isInt(any))
                    return any;

                if (!self.isInt(failReturn))
                    failReturn = 0;

                if (self.isStrOfInt(any))
                    return Number(any.replace(/,/g, ''));

                return failReturn;
            };

            /**
             * 常用拆分
             * 按空白字符、中英文标点拆分字符串
             * @param {string} str
             * @return {string[]}
             */
            self.commonSplit = function (str) {
                return str.split(/[\s`·~!！@#$￥%^…&*()（）\-—+=\[\]【】{}｛｝\\|、;；:：'‘’"“”,，.。<>《》/?？]+/);
            };

            /**
             * 异步运行函数
             * @param fun
             * @return {Promise}
             */
            self.runQ = function (fun) {
                if (angular.isFunction(fun))
                    return $q.when(undefined, fun);

                return $q.reject('非函数无法异步运行');
            };

            /**
             * 遍历月份，即从1遍历到12，若需中断遍历，回调函数返回true即可
             * @param {(month: number) => boolean} callBack 回调函数
             */
            self.forMonth = function (callBack) {
                for (var month = 1; month <= 12; month++)
                    if (callBack(month)) break;
            };

            /**
             * 提示窗口相关方法
             */
            (function () {

                /**
                 * 解析参数，返回参数对象
                 * 调用提示窗口支持2种形式：
                 * 1、参数为1个对象
                 * 2、参数为3个字符串(后2个可省略)
                 * @param args
                 * @return {Object}
                 */
                function swalArg(args) {
                    if (angular.isObject(args[0]) && !angular.isArray(args[0]))
                        return args[0];

                    return {
                        title: args[0],
                        text: args[1],
                        type: args[2]
                    };
                }

                /**
                 * 统一超时消失的时间
                 * @type {number}
                 */
                var timer = 1000;

                /**
                 * 提示窗口，返回Promise
                 * @param args
                 * @return {Promise}
                 */
                self.swal = function () {
                    args = swalArg(arguments);

                    //若提示内容时数组，切换为html换行显示
                    ['title', 'text']
                        .forEach(function (key) {
                            if (self.isNotEmptyArray(args[key])) {
                                args[key] = args[key].reduce(function (result, element) {
                                    return result + '<br>' + element;
                                });

                                args.html = true;
                            }
                        });

                    var d = $q.defer();

                    swal(args, function (value) {
                        //只有closeOnConfirm设置为true(默认值)时才消失
                        if (angular.isUndefined(args.closeOnConfirm) || args.closeOnConfirm === true)
                            swal.close();

                        //若同时有【确认】和【取消】按钮
                        //根据按钮来改变Promise的状态
                        if (args.showCancelButton) {
                            if (value === true)
                                d.resolve(); //改为【成功】状态
                            else
                                d.reject(); //改为【拒绝】状态
                        }
                        else //只有【确认】按钮的话，都改为【成功】状态
                            d.resolve();
                    });

                    return d.promise;
                };

                /**
                 * 确认提示窗口，返回Promise
                 * @param args
                 * @return {Promise}
                 */
                self.swalConfirm = function () {
                    args = swalArg(arguments);

                    angular.extend(args, {
                        type: 'warning', //图标为【!】
                        showConfirmButton: true, //必须显示【确定】按钮
                        showCancelButton: true, //必须显示【取消】按钮
                        allowEscapeKey: false, //不允许Escape退出
                        allowOutsideClick: false, //不允许点击旁边退出
                        timer: null //不允许超时消失
                    });

                    return self.swal(args);
                };

                /**
                 * 消息提示窗口，返回Promise
                 * @param args
                 * @return {Promise}
                 */
                self.swalInfo = function () {
                    args = swalArg(arguments);

                    angular.extend(args, {
                        type: 'info', //图标为【i】
                        timer: null //不允许超时消失
                    });

                    return self.swal(args);
                };

                /**
                 * 成功提示窗口，返回Promise
                 * @param args
                 * @return {Promise}
                 */
                self.swalSuccess = function () {
                    args = swalArg(arguments);

                    angular.extend(args, {
                        type: 'success', //图标为【√】
                        timer: angular.isDefined(args.timer) ? args.timer : timer //超时消失
                    });

                    return self.swal(args);
                };

                /**
                 * 错误提示窗口，返回Promise
                 * @param args
                 * @return {Promise}
                 */
                self.swalError = function () {
                    args = swalArg(arguments);

                    args.type = 'error';

                    angular.extend(args, {
                        type: 'error', //图标为【×】
                        timer: null //不允许超时消失
                    });

                    return self.swal(args);
                };

                /**
                 * 确认，然后成功
                 * @param args = {
             *     okFun: 点击【确定】后要做的事(回调)，执行完成后会有成功提示
             *     okTitle: 成功提示内容
             * }
                 */
                self.swalConfirmThenSuccess = function (args) {
                    angular.extend(args, {
                        closeOnConfirm: false //点击【确定】后不消失
                    });

                    var okFun = args.okFun; //点击【确定】后要做的事(回调)，执行完成后会有成功提示
                    delete args.okFun;

                    var okTitle = args.okTitle || '成功'; //成功后的提示内容
                    delete args.okTitle;

                    var theResult; //回调的执行结果

                    return $q
                        .when(args)
                        .then(self.swalConfirm) //确认，确定后执行回调
                        .then(angular.noop) //不传值给回调
                        .then(okFun) //执行回调
                        .then(function (result) {
                            theResult = result; //缓存回调的执行结果
                            return okTitle;
                        }, function (reason) { //当回调失败时
                            swal.close(); //关闭提示窗口
                            return $q.reject(reason); //传递失败状态
                        })
                        .then(self.swalSuccess) //提示成功
                        .then(function () {
                            return theResult; //返回回调的执行结果
                        });
                };

            })();

            /**
             * 把源对象的属性赋值给目标对象的属性
             * @param {{}} srcObj 源对象
             * @param {{}} destObj 目标对象
             * @param {string[]|{}} keys 哪些属性需要赋值，若赋值的属性名相同，则用字符串数组；属性名不同，则用对象来映射属性关系
             * @return {{}} 目标对象
             */
            self.assignProperty = function (srcObj, destObj, keys) {
                //若使用数组，说明赋值的属性是同名的
                var keyIsSame = angular.isArray(keys);

                angular.forEach(keys, function (destKey, srcKey) {
                    destObj[destKey] = srcObj[keyIsSame ? destKey : srcKey];
                });

                //返回目标对象
                return destObj;
            };

            /**
             * 预定义属性
             * @param {Object} destObj 预定义的目标对象
             * @param {Object} defineObj 预定义的属性集
             * @return {*} 目标对象
             */
            self.predefineProperty = function (destObj, defineObj) {
                Object.keys(defineObj).forEach(function (key) {
                    if (!(key in destObj))
                        destObj[key] = defineObj[key];
                });

                return destObj;
            };

            /**
             * 默认的异常处理
             * @param reason
             */
            self.defaultCatch = function (reason) {
                console.error(reason);

                var msg;
                if (angular.isString(reason))
                    msg = reason;
                else if (angular.isObject(reason) && reason.id)
                    msg = reason.message;

                var promise = $q.when();

                if (msg)
                    promise = promise.then(self.swalError.bind(self, msg));

                promise = promise.then($q.reject.bind($q, reason));

                return promise;
            };

            /**
             * 返回延迟承诺，简化$q.defer()
             * @return {Promise}
             */
            self.deferPromise = function () {
                var deferred = $q.defer();
                var promise = deferred.promise;

                ['resolve', 'reject'].forEach(function (key) {
                    promise[key] = deferred[key].bind(deferred);
                });

                return promise;
            };

            /**
             * 循环，此方法相当于 for (var i = start; i < end; i++) 。
             * 但由于使用了回调，没有额外的使用变量，可避免同名变量互相污染作用域
             * @param {number} start 循环起点(包含)
             * @param {number} end 循环终点(不包含)
             * @param {(index: number) => boolean} looper 循环回调函数，该函数接受1个参数(循环索引)，返回1个布尔值(为true时中断循环)
             * @return {boolean} 循环是否有中止
             */
            self.forLoop = function (start, end, looper) {
                var isBreak = false;

                for (var i = start; i < end; i++) {
                    //若回调函数显式地返回true，则终止循环
                    if (looper(i) === true) {
                        isBreak = true;
                        break;
                    }
                }

                return isBreak;
            };

            /**
             * 选择文件
             * @param params
             * @return {Promise}
             */
            self.chooseFile = function (params) {
                var promise = self.deferPromise();

                try {
                    var id = 'file1';

                    $('#' + id).remove();

                    var fileInput = $('<input>');

                    fileInput.css('display', 'none');
                    fileInput.attr('id', id);
                    fileInput.attr('type', 'file');
                    fileInput.attr('name', 'docFile0');
                    //fileInput.attr('multiple', 'multiple');
                    fileInput.attr("uploader", 'uploader');

                    $('body').append(fileInput);

                    var promise = self.deferPromise();

                    fileInput.change(function (event) {
                        if (event.target.files) {
                            promise.resolve({
                                element: $(event.target),
                                files: event.target.files
                            });
                        }
                        else {
                            promise.reject('cancel');
                        }
                    });

                    fileInput.click();
                }
                catch (error) {
                    promise.reject(error);
                }
                finally {
                    return promise;
                }
            };

            /**
             * 上传附件
             * @param params
             * @return {Promise}
             */
            self.uploadFile = function (params) {
                return $q
                    .when(params)
                    .then(self.chooseFile)
                    .then(function (p) {
                        var promise = self.deferPromise();

                        var uploadParams = {
                            url: "/web/scp/filesuploadsave2.do",
                            type: 'post',
                            secureuri: false,
                            fileElementId: p.element.attr('id'), //file标签的id
                            dataType: 'json', //返回数据的类型
                            success: function (data, status) {
                                if (data.failure)
                                    promise.reject(data.msg);

                                promise.resolve(data);
                            },
                            error: function (data, status, e) {
                                promise.reject(data);
                            }
                        };

                        console.log('uploadParams', uploadParams);

                        $.ajaxFileUpload(uploadParams);

                        return promise;
                    });
            };

            console.log('Magic loaded');
        }

        /**
         * AgGrid表格服务
         * @since 2018-07-14
         * @constructor
         */
        function AgGridService($q, BasemanService, Magic) {
            console.log('AgGridService loading');

            var self = this;

            /**
             * 表格选项预定义
             * @param destObj
             * @param defineObj
             * @return {*}
             */
            function gridPredefine(destObj, defineObj) {
                Object.keys(defineObj).forEach(function (key) {
                    var defineValue = defineObj[key];

                    if (angular.isObject(defineValue) && !angular.isArray(defineValue)) {
                        var destValue;
                        if (key in destObj) {
                            destValue = destObj[key];
                        }
                        else {
                            destValue = {};
                            destObj[key] = destValue;
                        }

                        if (angular.isObject(destValue) && !angular.isArray(destValue)) {
                            gridPredefine(destValue, defineValue);
                        }
                    }
                    else if (!(key in destObj)) {
                        destObj[key] = defineValue;
                    }
                });

                return destObj;
            }

            /**
             * 创建AgGrid
             * 原生的属性用原名，为了防止重名，自定义的属性以【hc】开头
             * @param {string|DomElement} div 表格ID或DOM元素
             * @param {Object} gridOptions 表格选项
             * @param {boolean} [returnPromise] 返回承诺，即异步创建
             * @return {Object} gridOptions 表格选项
             */
            self.createAgGrid = function (div, gridOptions, returnPromise) {
                gridOptions.hcReady = gridOptions.hcReady || Magic.deferPromise();

                if (returnPromise === true) {
                    return $q.when().then(function () {
                        return self.createAgGrid(div, gridOptions, false);
                    });
                }

                function handleError(err) {
                    console.error(err);
                    return Magic.swalError(err).then($q.reject.bind($q, err));
                }

                //表格ID
                if (angular.isString(div) && div.charAt(0) !== '#')
                    div = '#' + div;

                //表格DOM元素
                var $grid = $(div);
                if (!$grid.length)
                    handleError('表格要依附的DOM元素' + div + '不存在');

                if (!angular.isArray(gridOptions.columnDefs))
                    handleError('options.columnDefs 未定义，请检查列定义和表格选项的顺序');

                //取出有词汇编码的列
                var dictColDefs = gridOptions.columnDefs.filter(function (colDef) {
                    return colDef.hcDictCode && angular.isString(colDef.hcDictCode);
                });

                if (dictColDefs.length) {
                    dictColDefs.forEach(function (colDef) {
                        colDef.type = '词汇';

                        if (colDef.hcDictCode === '*')
                            colDef.hcDictCode = colDef.field;
                    });

                    //查询词汇的承诺
                    var dictPromises = dictColDefs.map(function (colDef) {
                        return BasemanService
                            .RequestPost('base_search', 'searchdict', {
                                dictcode: colDef.hcDictCode
                            })
                            .then(function (response) {
                                var values = response.dicts.map(function (e) {
                                    return e.dictvalue;
                                });

                                var names = response.dicts.map(function (e) {
                                    return e.dictname;
                                });

                                colDef.cellEditorParams = {
                                    values: values,
                                    names: names,
                                    cellRenderer: function (params) {
                                        if (names.length && values.length && names.length === values.length) {
                                            var index = values.findIndex(function (value) {
                                                return value == params.value;
                                            });

                                            if (index >= 0)
                                                return names[index];
                                        }

                                        return ''/*params.value*/;
                                    }
                                };
                            });
                    });

                    //查询完成后，重设列定义
                    $q.all(dictPromises.concat(gridOptions.hcReady)).then(function () {
                        gridOptions.api.setColumnDefs(gridOptions.columnDefs);
                        gridOptions.columnApi.resetColumnState(); //重置列状态
                    });
                }

                /**
                 * 获取默认的单元格样式，该样式在defaultColDef中定义
                 * @param {Object} params
                 * @return {Object}
                 */
                function getDefaultCellStyle(params) {
                    var style = {};

                    if (gridOptions.defaultColDef) {
                        var defaultStyle = gridOptions.defaultColDef.cellStyle;
                        if (defaultStyle) {
                            if (angular.isObject(defaultStyle))
                                style = defaultStyle;
                            else if (angular.isFunction(defaultStyle))
                                style = defaultStyle(params);
                        }
                    }

                    return style;
                }

                //默认的表格选项
                var defaultGridOptions = {
                    suppressColumnVirtualisation: true, //表格不可见时，大部分效果不会渲染，必须关闭虚拟列技术，使其渲染所有列。但在数据较多时不建议这么做，会影响性能
                    enableRangeSelection: true, //允许范围选择
                    enableColResize: true, //允许调整列宽
                    hcTheme: 'ag-blue', //主题
                    suppressLoadingOverlay: true, //禁用【加载中】标识
                    suppressNoRowsOverlay: true, //禁用【空表】标识
                    //列默认属性
                    defaultColDef: {
                        headerName: '尚未定义列名',
                        width: 120, //默认列宽
                        minWidth: 60, //最小列宽
                        maxWidth: 400 //最大列宽
                    },
                    //列类型
                    columnTypes: {
                        '序号': {
                            //field: 'seq', //默认序号字段名
                            headerName: '序号',  //默认序号标题
                            pinned: 'left', //序号列左侧固定
                            suppressMovable: true, //禁止移动
                            width: 58, //默认序号列宽
                            suppressResize: true, //禁止调宽度
                            suppressSizeToFit: true, //禁止适应宽度
                            suppressAutoSize: true, //禁止自动宽度
                            edtiable: false, //不可编辑
                            valueGetter: 'Number(node.id)+1', //取值函数：行索引+1
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center', //文本居中
                                    'font-weight': 'bold' //字体加粗
                                });
                            }
                        },
                        '金额': {
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            },
                            //值格式化器
                            valueFormatter: function (params) {
                                if (Magic.isNum(params.value) || Magic.isStrOfNum(params.value))
                                    return HczyCommon.formatMoney(params.value);

                                return params.value;
                            }
                        },
                        '万元': {
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            }
                        },
                        '百分比': {
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            }
                        },
                        '数量': {
                            //单元格样式
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'right' //文本居右
                                });
                            }
                        },
                        '词汇': {
                            cellEditor: agGrid.EnterpriseBoot.RICH_SELECT, //编辑器
                            //值格式化器
                            valueFormatter: function (params) {
                                var cellEditorParams = params.column.colDef.cellEditorParams;

                                if (cellEditorParams
                                    && Magic.isNotEmptyArray(cellEditorParams.values)
                                    && Magic.isNotEmptyArray(cellEditorParams.names)
                                    && cellEditorParams.values.length === cellEditorParams.names.length) {
                                    var index = cellEditorParams.values.findIndex(function (value) {
                                        return value == params.value;
                                    });

                                    if (index >= 0)
                                        return cellEditorParams.names[index];
                                }

                                return ''/*params.value*/;
                            },
                            /*valueParser: function (params) {
                            console.log('valueParser');
                            console.log(params);
                            return params.value;
                        },*/
                            //过滤器参数
                            filterParams: {
                                //值要转为名称后过滤
                                valueGetter: function (node) {
                                    var value = node.data[this.colDef.field];

                                    //这里的  this  指向过滤器组件，过滤器组件保存了  colDef
                                    value = this.colDef.valueFormatter({
                                        value: value,
                                        column: {
                                            colDef: this.colDef
                                        }
                                    });

                                    //console.log('filterParams.valueGetter', node, value);

                                    return value;
                                }
                            }
                        },
                        '大文本': {
                            cellEditor: agGrid.CellEditorFactory.LARGE_TEXT //编辑器
                        },
                        '日期': {
                            width: 90, //列宽
                            cellEditor: DateCellEditor, //编辑器
                            //值格式化器
                            valueFormatter: function (params) {
                                if (angular.isString(params.value) && params.value.length > 10)
                                    return params.value.substr(0, 10);

                                return params.value;
                            }
                        },
                        '时间': {
                            width: 124 //列宽
                        }
                    },
                    //汉化
                    localeText: {
                        // for filter panel
                        page: 'daPage',
                        more: 'daMore',
                        to: 'daTo',
                        of: 'daOf',
                        next: '下一个',
                        last: '最后一个',
                        first: '第一个',
                        previous: '前一个',
                        loadingOoo: '加载中...',

                        // for set filter
                        selectAll: '所有',
                        searchOoo: '请输入搜索内容...',
                        blanks: '空白',

                        // for number filter and text filter
                        filterOoo: '过滤中...',
                        applyFilter: '应用过滤器...',

                        // for number filter
                        equals: '等于',
                        lessThan: '小于',
                        greaterThan: '大于',

                        // for text filter
                        contains: '包含',
                        NotEquals: '不等于',
                        startsWith: '以此开头',
                        endsWith: '以此结尾',

                        // the header of the default group column
                        group: '单列分组',

                        // tool panel
                        columns: '多列',
                        rowGroupColumns: '分组列',
                        rowGroupColumnsEmptyMessage: '拖拽分组区域',
                        valueColumns: '求值列',
                        pivotMode: '固定列模块',
                        groups: '多列分组',
                        values: '多列求值',
                        pivots: '多列固定',
                        valueColumnsEmptyMessage: '拖拽固定区域',
                        pivotColumnsEmptyMessage: '拖拽求值区域',

                        // other
                        noRowsToShow: '表格为空',

                        // enterprise menu
                        pinColumn: '固定列',
                        valueAggregation: '求平均值',
                        autosizeThiscolumn: '当前列宽度自适应',
                        autosizeAllColumns: '所有列宽度自适应',
                        groupBy: '当前列分组',
                        ungroupBy: '分组还原',
                        resetColumns: '恢复列宽',
                        expandAll: '伸展',
                        collapseAll: '收缩',
                        toolPanel: '工具版面',
                        export: '导出',
                        csvExport: 'CSV导出',
                        excelExport: 'Excel导出',

                        // enterprise menu pinning
                        pinLeft: '列左固定',
                        pinRight: '列右固定',
                        noPin: '不固定',

                        // enterprise menu aggregation and status panel
                        sum: '求和',
                        min: '最小值',
                        max: '最大值',
                        first: '第一个',
                        last: '最后一个',
                        none: '空',
                        count: '次数',
                        average: '平均',

                        // standard menu
                        copy: '复制',
                        copyWithHeaders: '复制加上列名',
                        ctrlC: 'Ctrl C',
                        paste: '粘贴',
                        ctrlV: 'Ctrl V'
                    },
                    //右键菜单
                    getContextMenuItems: function (params) {
                        var items = params.defaultItems.filter(function (item) {
                            return ['toolPanel', 'export'].indexOf(item) < 0; //右键菜单去除【工具面板】和【导出】
                        });

                        //若没有禁止Excel导出
                        if (gridOptions.suppressExcelExport !== true)
                            items.push('excelExport'); //Excel导出

                        return items;
                    },
                    //列标题菜单
                    getMainMenuItems: function (params) {
                        var items = params.defaultItems.filter(function (item) {
                            return ['toolPanel'].indexOf(item) < 0; //右键菜单去除【工具面板】
                        });

                        return items;
                    }
                };

                //预定义表格选项
                //Magic.predefineProperty(gridOptions, defaultGridOptions);
                gridPredefine(gridOptions, defaultGridOptions);

                //把默认选项也返回去
                gridOptions.hcDefaultOptions = defaultGridOptions;

                //ag-grid本该支持的列类型定义失效了，只好自己来
                //若换成了正常的ag-grid版本，可注释这段代码
                if (Magic.isNotEmptyArray(gridOptions.columnDefs)) {
                    gridOptions.columnDefs.forEach(function (colDef) {
                        if (angular.isString(colDef.type)) {
                            var colDefOfType = gridOptions.columnTypes[colDef.type];
                            if (angular.isObject(colDefOfType))
                                gridPredefine(colDef, colDefOfType);
                        }
                    });
                }

                //新版本的agGrid用的是valueFormatter，旧版本用的是cellFormatter
                //兼容旧版本的agGrid
                gridOptions.columnDefs.forEach(function (colDef) {
                    if (colDef.valueFormatter)
                        colDef.cellFormatter = colDef.valueFormatter;
                });

                /*//表格ID
            if (angular.isString(div) && div.charAt(0) !== '#')
                div = '#' + div;

            //表格DOM元素
            var $grid = $(div);
            if (!$grid.length)
                handleError('表格要依附的DOM元素' + div + '不存在');*/

                //var gridDiv = $grid.get(0);

                //主题
                $grid.addClass(gridOptions.hcTheme);

                //缓存完成事件
                var onGridReady = gridOptions.onGridReady;

                gridOptions.onGridReady = function (params) {
                    //完成承诺
                    gridOptions.hcReady.resolve(gridOptions);

                    //调用完成事件
                    if (angular.isFunction(onGridReady))
                        onGridReady(params);
                };

                //创建表格
                new agGrid.Grid($grid.get(0), gridOptions);

                //注册事件
                if (angular.isObject(gridOptions.hcEvents)) {
                    angular.forEach(gridOptions.hcEvents, function (eventHandler, eventName) {
                        gridOptions.api.addEventListener(eventName, eventHandler);
                    });
                }

                /**
                 * 自定义API
                 */
                gridOptions.hcApi = {
                    /**
                     * 获取焦点单元格所在行号
                     * @return {number} 行号
                     */
                    getFocusedRowIndex: function () {
                        var cell = gridOptions.api.getFocusedCell();

                        if (cell)
                            return cell.rowIndex;

                        return -1;
                    },

                    /**
                     * 获取焦点单元格所在的行节点
                     * @return {Node} 行节点
                     */
                    getFocusedNode: function () {
                        var rowIndex = gridOptions.hcApi.getFocusedRowIndex();

                        if (rowIndex >= 0)
                            return gridOptions.hcApi.getNodeOfRowIndex(rowIndex);

                        return null;
                    },

                    /**
                     * 获取焦点单元格所在的行数据
                     * @return {Object} 行数据
                     */
                    getFocusedData: function () {
                        var rowIndex = gridOptions.hcApi.getFocusedRowIndex();

                        if (rowIndex >= 0)
                            return gridOptions.hcApi.getDataOfRowIndex(rowIndex);

                        return null;
                    },

                    /**
                     * 根据行号获取行节点
                     * @param {number} rowIndex 行号
                     * @return {Node} 行节点
                     */
                    getNodeOfRowIndex: function (rowIndex) {
                        return gridOptions.api.getModel().getRow(rowIndex);
                    },

                    /**
                     * 根据行号获取行数据
                     * @param {number} rowIndex 行号
                     * @return {Object} 行数据
                     */
                    getDataOfRowIndex: function (rowIndex) {
                        return gridOptions.hcApi.getNodeOfRowIndex(rowIndex).data;
                    },

                    /**
                     * 设置行数据
                     * @param {Object[]} rowData
                     */
                    setRowData: function (rowData) {
                        /*var seqKey = gridOptions.columnDefs[0].field;

                    rowData.forEach(function (e, i) {
                        e[seqKey] = i + 1;
                    });*/

                        gridOptions.api.setRowData(rowData);
                        gridOptions.columnApi.autoSizeAllColumns();
                    },

                    /**
                     * 设置焦点单元格
                     * @param {number} rowIndex 行号
                     * @param {string} colKey 列键
                     */
                    setFocusedCell: function (rowIndex, colKey) {
                        //设置焦点单元格
                        gridOptions.api.setFocusedCell(rowIndex, colKey);

                        //设置选择范围为焦点单元格
                        gridOptions.api.rangeController.setRangeToCell(gridOptions.api.getFocusedCell());

                        //滚动表格使焦点单元格可见
                        gridOptions.api.ensureIndexVisible(rowIndex);
                    },

                    getDefaultCellStyle: getDefaultCellStyle
                };

                gridOptions.api.hcApi = gridOptions.hcApi;

                console.info('ag-grid' + div + ' gridOptions如下：');
                console.info(gridOptions);

                //返回表格选项
                return gridOptions;
            };

            //日期编辑器
            function DateCellEditor() {
            }

            angular.extend(DateCellEditor.prototype, {
                init: function (params) {
                    this.params = params;
                    $input = $('<INPUT type="text">'); // class="editor-text"
                    this.$input = $input;
                    $input.val(params.value);

                    $input.datetimepicker({
                        format: 'yyyy-mm-dd', //格式
                        minView: 'month', //最小视图：月
                        todayBtn: true, //【今天】按钮
                        todayHighlight: true, //高亮【今天】按钮
                        language: "zh-CN", //汉化
                        autoclose: true //选择后自动关闭
                    });
                    /*.datepicker({
                    dateFormat: 'yy-mm-dd', //日期格式
                    startView: 'day',
                    todayBtn: true,
                    forceParse: true,
                    language: "zh-CN",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true,
                    showMonthAfterYear: true, //月份显示在年份后面
                    changeMonth: true, //允许年份下拉选择
                    changeYear: true, //允许月份下拉选择
                    monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'], //月份下拉时的显示名称
                    dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'] //星期的最小显示名称
                });*/

                    $input.focus().select();
                },
                getGui: function () {
                    return this.$input[0];
                },
                afterGuiAttached: function () {
                    this.$input.focus().select();
                },
                getValue: function () {
                    return this.$input.val();
                },
                destroy: function () {
                    this.params.api.stopEditing(false);
                    $input.datetimepicker("hide");
                    $input.datetimepicker("destroy");
                    $input.remove();
                }
            });

            console.log('AgGridService loaded');
        }

        /**
         * SlickGrid表格服务
         * @since 2018-04-27
         * @param BasemanService
         * @constructor
         */
        function SlickGridService(BasemanService) {
            console.log('SlickGridService loading');

            var self = this;

            /**
             * 设置数据
             * @param args = {
         *   grid: 表格(必须)
         *   data: 数据(必须)
         *   type: 类型-默认=替换数据引用、push=追加数据到最后、unshift=插入到最前面、splice=删除并插入
         *   index: 当type是splice时生效，指定起始位置，默认为0，即在头部插入
         *   deleteCount: 当type是splice时生效，指定删除数量，默认为0，即不删除
         * }
             */
            self.setData = function (args) {
                var errTitle = '调用SlickGridService.setData失败';

                if (args == null) BasemanService.swal(errTitle, '需要指定参数');

                var grid = args.grid; //表格
                if (grid == null) BasemanService.swal(errTitle, '需要指定参数【grid-表格】');

                var data = args.data; //数据
                if (data == null) data = []; //null简单的认为是空数组即可 //BaseService.swal(errTitle, '需要指定参数【data-数据】');
                else if (!angular.isArray(data)) data = [data]; //若数据非数组，则当成1元数组

                var gridData = grid.getData(); //表格数据

                var type = args.type; //类型
                switch (type) {
                    case 'push': //追加到最后
                        Array.prototype.push.apply(gridData, data);

                        break;

                    case 'unshift': //插入到最前面
                        Array.prototype.unshift.apply(gridData, data);

                        break;

                    case 'splice': //删除并插入
                        var index = args.index > 0 ? args.index : 0;
                        var deleteCount = args.deleteCount > 0 ? args.deleteCount : 0;

                        Array.prototype.splice.apply(gridData, [index, deleteCount].concat(data));

                        break;

                    default: //替换引用
                        gridData = data;
                }

                angular.forEach(gridData, function (rowData, row) {
                    rowData.seq = row + 1; //重设序号
                });

                grid.setData(gridData);

                grid.render(); //重画表格
            };

            /**
             * 标准序号列
             * @return {{
         *     field: string
         *     name: string
         *     width: number
         *     cssClass: string
         * }}
             */
            self.columnSeq = function () {
                return {
                    field: 'seq',
                    name: '序号',
                    width: 48,
                    cssClass: 'uid'
                };
            };

            console.log('SlickGridService loaded');
        }

        /**
         * 单据服务
         * @param BasemanService
         * @param SlickGridService
         * @param Magic
         * @constructor
         */
        function BillService($q, BasemanService, SlickGridService, Magic) {
            console.log('BillService loading');

            var self = this;

            /**
             * 修饰浏览页控制器
             * @param scope 作用域
             * @param option 选项
             */
            self.decorateHead = function (scope, option) {

                /**
                 * 表格按钮
                 * @param row
                 * @param cell
                 * @param value
                 * @param column
                 * @param rowData
                 * @returns {string}
                 */
                scope.gridButton = option.gridButton || function (row, cell, value, column, rowData) {
                    var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
                    if (scope.canDelete(rowData))
                        buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
                    return buttonHtml;
                };

                option.canDelete = option.canDelete || function (rowData) {
                    return angular.isObject(rowData) && rowData.stat <= 1;
                };

                option.headerColumns.unshift(SlickGridService.columnSeq(), {
                    name: '操作',
                    width: 82,
                    formatter: scope.gridButton
                });

                option.headerOptions = option.headerOptions || {
                    enableCellNavigation: true,
                    enableColumnReorder: false,
                    editable: false,
                    enableAddRow: false,
                    asyncEditorLoading: false,
                    autoEdit: true,
                    autoHeight: false
                };

                option.searchObj = option.searchObj || function () {
                    return {};
                };

                option.action = option.action || 'search';

                angular.forEach([
                    'title', //标题
                    'classId', //业务类名
                    'idField', //ID字段名
                    'codeField', //编码字段名
                    'searchObj', //搜索时发请求的对象
                    'headerColumns',
                    'headerOptions',
                    'canDelete'
                ], function (key) {
                    scope[key] = Magic.toFun(option[key]);
                });

                /**
                 * 详情地址
                 * @param id
                 * @returns {string}
                 */
                scope.detailUrl = angular.isFunction(option.detailUrl) ? option.detailUrl : function (id) {
                    if (!Magic.isStrOrNum(id)) id = 0;

                    option.detailUrl = option.detailUrl.replace(/#/g, '?t=' + (new Date()).getTime() + '#');

                    return option.detailUrl + id;
                };

                //查找编码列
                var codeColumn;
                scope.headerColumns().some(function (column) {
                    var b = column.field === scope.codeField();
                    if (b) codeColumn = column;
                    return b;
                });

                //加载词汇
                BasemanService.loadDictToColumns({
                    columns: scope.headerColumns()
                });

                scope.headerGrid = Magic.toFun(new Slick.Grid("#headerGrid", [], scope.headerColumns(), scope.headerOptions()));

                /**
                 * 头表单击事件
                 * @param e
                 * @param args
                 */
                scope.headerGrid().onClick.subscribe(function (e, args) {
                    var jqTarget = $(e.target);

                    var stop = true;
                    //查看
                    if (jqTarget.hasClass('viewbtn')) {
                        scope.editData(args.row);
                    }
                    //删除
                    else if (jqTarget.hasClass('delbtn')) {
                        scope.delData(args.row);
                    }
                    else {
                        stop = false;
                    }

                    if (stop) e.stopImmediatePropagation();
                });

                /**
                 * 头表双击事件
                 * @param e
                 * @param args
                 */
                scope.headerGrid().onDblClick.subscribe(function (e, args) {
                    //查看
                    scope.editData(args.row);
                    e.stopImmediatePropagation();
                });

                /**
                 * 条件查询
                 */
                scope.searchBySql = function () {
                    scope.FrmInfo = {
                        //title: '',
                        //thead: [],
                        //url: "/jsp/req.jsp",
                        //direct: "left",
                        //sqlBlock: "",
                        //backdatas: "sa_out_bill_head",
                        ignorecase: 'true', //忽略大小写
                        //postdata: {},
                        is_high: true
                    };

                    scope.FrmInfo.thead = scope
                        .headerColumns()
                        .slice(2)
                        .map(function (column) {
                            if (!column.type) {
                                if (column.options)
                                    column.type = 'list';
                                else if (column.cssClass === 'amt')
                                    column.type = 'number';
                                else
                                    column.type = 'string';
                            }

                            return {
                                name: column.name,
                                code: column.field,
                                type: column.type,
                                dicts: column.options
                            };
                        });

                    sessionStorage.setItem('frmInfo', JSON.stringify(scope.FrmInfo));

                    return BasemanService
                        .open(CommonPopController1, scope)
                        .result
                        .then(function (sqlwhere) {
                            scope.sqlwhere = sqlwhere;
                        })
                        .then(scope.searchData);
                };

                /**
                 * 查询数据
                 * @param postData
                 * @returns {Promise}
                 */
                scope.searchData = function (postData) {
                    if (postData)
                        postData = angular.extend(scope.searchObj(), postData);
                    else
                        postData = scope.searchObj();

                    if (!postData.sqlwhere)
                        postData.sqlwhere = scope.sqlwhere;

                    if (!postData.pagination) {
                        scope.oldPage = 1;
                        scope.currentPage = 1;
                        if (!scope.pageSize) scope.pageSize = '20';
                        scope.totalCount = 1;
                        scope.pages = 1;
                        postData.pagination = 'pn=1,ps=' + scope.pageSize + ',pc=0,cn=0,ci=0';
                    }

                    var classId = scope.classId();
                    return BasemanService.RequestPost(classId, option.action, postData)
                        .then(function (data) {
                            SlickGridService.setData({
                                grid: scope.headerGrid(),
                                data: data[classId + 's']
                            });
                            BasemanService.pageInfoOp(scope, data.pagination);
                        });
                };

                /**
                 * 编辑数据
                 * @param row 行
                 */
                scope.editData = function (row) {
                    var id;
                    if (angular.isNumber(row) && row >= 0)
                        id = scope.headerGrid().getData()[row][scope.idField()];
                    else
                        id = 0;

                    scope.editDataById(id);

                    /*BasemanService.openModal({
                    url: scope.detailUrl(id),
                    title: scope.title(),
                    obj: scope,
                    style: option.detailStyle,
                    ondestroy: scope.searchData
                });*/
                };

                /**
                 * 编辑数据(通过ID)
                 * @param id
                 */
                scope.editDataById = function (id) {
                    BasemanService.openModal({
                        url: scope.detailUrl(id),
                        title: scope.title(),
                        obj: scope,
                        style: option.detailStyle,
                        ondestroy: scope.searchData
                    });
                };

                /**
                 * 删除数据
                 * @param row 行
                 */
                scope.delData = function (row) {
                    var rowData = scope.headerGrid().getData()[row];
                    var id = rowData[scope.idField()];
                    var code = rowData[scope.codeField()];

                    return Magic
                        .swalConfirmThenSuccess({
                            title: '确定要删除'
                            + '【' + codeColumn.name + '】为【' + code + '】'
                            + '的【' + scope.title() + '】吗？',
                            okTitle: '成功删除',
                            okFun: function () {
                                return $q
                                    .when()
                                    .then(function () {
                                        var postData = {};
                                        postData[scope.idField()] = id;
                                        //删除数据成功后再删除网格数据
                                        return BasemanService.RequestPost(scope.classId(), 'delete', postData);
                                    })
                                    .then(function () {
                                        SlickGridService.setData({
                                            grid: scope.headerGrid(),
                                            type: 'splice',
                                            index: row,
                                            deleteCount: 1
                                        });
                                    });
                            }
                        });
                };

                //网格自适应高度
                BasemanService.initGird();
                //初始化分页
                BasemanService.pageGridInit(scope);
            };

            /**
             * 关闭窗口
             */
            self.closeWindow = function () {
                if (window !== window.parent) {
                    BasemanService.closeModal();
                } else {
                    window.close();
                }
            };

            console.log('BillService loaded');
        }

        /**
         * 工程项目专用服务
         * @param BasemanService
         * @constructor
         */
        function ProjService(BasemanService) {
            console.log('ProjService loading');

            var self = this;

            /**
             * 相似性检索
             * @param params
             * @return {Promise}
             */
            self.projLikeness = function (params) {
                var $scope = params.scope;

                $scope.FrmInfo = {
                    title: '相似性检索',
                    thead: [{
                        name: '编码',
                        code: 'project_code'
                    }, {
                        name: '名称',
                        code: 'project_name'
                    }, {
                        name: '单据状态',
                        code: 'stat',
                        type: 'list',
                        dicts: [{
                            value: '1',
                            desc: '制单'
                        }, {
                            value: '3',
                            desc: '流程中'
                        }, {
                            value: '5',
                            desc: '已审核'
                        }]
                    }, {
                        name: '项目开发方',
                        code: 'dev_unit_name'
                    }, {
                        name: '工程地址',
                        code: 'project_address'
                    }],
                    classid: 'proj',
                    postdata: {
                        searchflag: 2,
                        project_id: params.project_id
                    },
                    searchlist: ['project_code', 'project_name', 'project_address', 'dev_unit_name']
                };

                return BasemanService.open(CommonPopController, $scope).result;
            };

            console.log('ProjService loaded');
        }
    })();

});
