define(['app', 'inspinia'], function (app, inspinia) {
    /**
     * INSPINIA - Responsive Admin Theme
     * Copyright 2015 Webapplayers.com
     *
     * Main directives.js file
     * Define directives for used plugin
     *
     *
     * Functions (directives)
     *  - pageTitle
     *  - sideNavigation
     *  - iboxTools
     *  - minimalizaSidebar
     *  - vectorMap
     *  - sparkline
     *  - icheck
     *  - ionRangeSlider
     *  - dropZone
     *  - responsiveVideo

     *
     */

    /**
     * pageTitle - Directive for set Page title - mata title
     */
    function pageTitle($rootScope, $timeout, $location, AuthorizationService, HistoryDataService, localeStorageService) {
        return {
            link: function (scope, element, $location) {
                var listener = function (event, toState, toParams, fromState, fromParams, scope, $location) {
                    // Default title - load on Dashboard 1
                    var title = 'EBS系统 | 首页';
                    if (toState.data && toState.data.pageTitle) title = 'EBS系统 | ' + toState.data.pageTitle;

                    $rootScope.$broadcast("page_stat", {
                        toState: toState,
                        toParams: toParams,
                        fromState: fromState,
                        fromParams: fromParams
                    });
                    if (window.parent.location.hash != "#/home" && !window.parent.userbean && !window.userbean) {
                        var userbean;
                        $.ajax({
                            type: "GET",
                            url: "/jsp/req.jsp",
                            data: {
                                classid: 'base_search',
                                action: 'loginuserinfo',
                                userid: strUserId,
                                format: 'mjson',
                                id: Math.random()
                            },
                            async: false,
                            success: function (data) {
                                var userdata = JSON.parse(data).loginuserifnos[0];
                                var userbean = userdata.orgdata[0];
                                userbean.sessionid = userdata.sessionid;
                                userbean.entid = Number(userdata.entid);//登录用户当前属于哪个组织
                                userbean.entname = userdata.entname;
                                userbean.entidall = userdata.entidall;
                                userbean.userauth = {};
                                var stringlist = userbean.stringofrole.split(",");
                                for (var i = 0; i < stringlist.length; i++) {
                                    userbean.userauth[stringlist[i]] = true;
                                }
                                window.userbean = window.parent.userbean = userbean;
                            }
                        });
                    }
                    if (window.location.hash.indexOf("?param=") > -1) {
                        window.CURR_LOCATION[toState.name] = window.location.hash.replace("#/crmman" + toState.url + "?", "");
                    }
                    if (window.location.hash != "#/home") {
                        //如果是自己的页面则打开
                        if (fromState.name == null || fromState.name == '') {
                            //if (window.parent.SCOPE_INIT[toState.name]) {
                            //    window.parent.SCOPE_INIT[toState.name]();
                            //}
                            //event.preventDefault();
                            return
                        } else {
                            //如果是从子页面打开子页面则拦截，并且用父页面打开
                            window.parent.location.hash = window.location.hash;
                            //if (window.parent.SCOPE_INIT[toState.name] && !window.userbean.new_tab) {
                            //    window.parent.SCOPE_INIT[toState.name]();
                            //}
                            event.preventDefault();
                            return
                        }
                    } else {
                        //if (toState.name.indexOf("crmman") == -1) {
                        //    return;
                        //}
                        if (fromState.name == "") {
                            localeStorageService.setcurrent(toState);
                        }
                        event.preventDefault();
                    }
                };
                $rootScope.$on('$stateChangeStart', listener);
                $rootScope.$on('$stateChangeSuccess', function (event, next, nextParams) {
                    event.preventDefault();
                    $timeout(function () {
                        var header_height = $("#MainCtrl").height();
                        $("div.wrap-height").css({"height": document.body.offsetHeight - header_height - $("div.footer").height()});
                        // fix_height();
                        $('div.wrap-height').perfectScrollbar('update');
                        $('div.wrap-height').perfectScrollbar('resize');

                        // $('div.page-heading').css({width: $("#MainCtrl").width()});
                    }, 500);
                });
            }
        }
    };

    /**
     * sideNavigation - Directive for run metsiMenu on sidebar navigation
     */
    function sideNavigation($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call the metsiMenu plugin and plug it to sidebar navigation
                $timeout(function () {
                    element.metisMenu();
                    //菜单下选中子菜单没有收回处理
                    //                $(element).find("ul.item-list").find("a").on("click",function(e){
                    //                  $(this).closest("ul.nav").siblings("a.nv").trigger("click");
                    //                });
                    $(element).find("li.ng-scope>a").click(function () {
                        $(this).parent.toggleClass("active");
                        $(this).siblings.toggleClass("on");
                    });
                    //新菜单样式
                    var $second_container = $(element).siblings("ul.nav").find("li.second_menu");
                    $(element).find("a.nv").click(function (event) {
                        var $e = event;

                        var $this = $(this);
                        if ($this.parent().hasClass("active")) {
                            var scrollTop = $(element).scrollTop();
                            var thisoffHeight = $this.parent()[0].offsetTop;

                            var $secondmenu = $this.siblings("ul.nav-second-level").clone(true);

                            //                      var k = $secondmenu.removeClass("hide").height();
                            //                      $secondmenu.addClass("hide");

                            $secondmenu.find("a").on("click", function () {
                                $secondmenu.addClass("hide");
                                $this.parent().removeClass("active").end().siblings("ul.nav").removeClass("in");
                            });

                            $secondmenu.css({
                                height: 'auto',
                                display: 'none'
                            }).removeClass("hide");
                            //
                            $second_container.html("");
                            $second_container.append($secondmenu).children().fadeIn(function () {
                                $timeout(function () {
                                    //                              var h = $secondmenu.height();
                                    //                              h = h < 100 ? 100:h;
                                    ////                                var top = thisoffHeight-130 - scrollTop;
                                    //                              var top = $e.clientY;
                                    //                              var li_header = $second_container.siblings("li.nav-header").height();
                                    //                              if((top + li_header + h) >document.body.clientHeight){
                                    ////                                    $secondmenu.css({bottom:0})
                                    //                                  top = 0;
                                    //                              }else{
                                    //                                  top = thisoffHeight - h - scrollTop - li_header;
                                    //                              }
                                    //                              $secondmenu.css({top:top})
                                });
                            });
                        } else {
                            $second_container.html("");
                        }
                    });
                    var nav_header = $(element).siblings("ul.nav").height();
                    var heigth = document.body.clientHeight - nav_header;
                    $(element).css({
                        height: heigth
                    });
                    $(element).perfectScrollbar();
                });
            }
        };
    };

    /**
     * responsibleVideo - Directive for responsive video
     */
    function responsiveVideo() {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var figure = element;
                var video = element.children();
                video
                    .attr('data-aspectRatio', video.height() / video.width())
                    .removeAttr('height')
                    .removeAttr('width')

                //We can use $watch on $window.innerWidth also.
                $(window).resize(function () {
                    var newWidth = figure.width();
                    video
                        .width(newWidth)
                        .height(newWidth * video.attr('data-aspectRatio'));
                }).resize();
            }
        }
    }

    /**
     * iboxTools - Directive for iBox tools elements in right corner of ibox
     */
    function iboxTools($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'views/common/ibox_tools.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                },
                    // Function for close ibox
                    $scope.closebox = function () {
                        window.history.go(-1);
                        //                  if(!$scope.$parent.closebox){
                        //                      var ibox = $element.closest('div.ibox');
                        //                      ibox.remove();
                        //                  }else{
                        //                      $scope.$parent.closebox();
                        //                  }
                    }
            }
        };
    };

    /**
     * minimalizaSidebar - Directive for minimalize sidebar
     */
    function minimalizaSidebar($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {

                    $("body").toggleClass("mini-navbar");
                    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        // $("body").toggleClass("mini-navbar");
                        $('#side-menu').hide();
                        // For smoothly turn on menu
                        setTimeout(
                            function () {
                                $('#side-menu').fadeIn(500);
                            }, 100);
                    } else if ($('body').hasClass('fixed-sidebar')) {
                        // alert('#side-menu2');
                        $('#side-menu').hide();
                        setTimeout(
                            function () {
                                $('#side-menu').fadeIn(500);
                            }, 300);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        //alert('#side-menu3');
                        //                    $('#side-menu').removeAttr('style');
                    }

                    // add by dhw 2016-03-17
                    if ($('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                        $("#mymenu").removeClass("mini-navbar2");
                    } else {
                        $("#mymenu").addClass("mini-navbar2");
                    }
                    setTimeout(function () {
                        var nav_header = $('#side-menu').siblings("ul.nav").height();
                        var heigth = document.body.clientHeight - nav_header;
                        $('#side-menu').css({
                            height: heigth
                        });
                        $('#side-menu').perfectScrollbar('update');
                        $('#side-menu').perfectScrollbar('resize');

                        $('div.page-heading').css({
                            width: $("#MainCtrl").width()
                        });
                    }, 500);
                }
            }
        }
    };

    function closeOffCanvas() {
        return {
            restrict: 'A',
            template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
            controller: function ($scope, $element) {
                $scope.closeOffCanvas = function () {
                    $("body").toggleClass("mini-navbar");
                }
            }
        };
    }

    /**
     * vectorMap - Directive for Vector map plugin
     */
    function vectorMap() {
        return {
            restrict: 'A',
            scope: {
                myMapData: '=',
            },
            link: function (scope, element, attrs) {
                element.vectorMap({
                    map: 'world_mill_en',
                    backgroundColor: "transparent",
                    regionStyle: {
                        initial: {
                            fill: '#e4e4e4',
                            "fill-opacity": 0.9,
                            stroke: 'none',
                            "stroke-width": 0,
                            "stroke-opacity": 0
                        }
                    },
                    series: {
                        regions: [{
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }]
                    },
                });
            }
        }
    }

    /**
     * chinaMap - Directive for China map by Rapheal
     */
    function chinaMap() {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                var R = Raphael(element[0], $(element).width(), $(element).height());
                //调用绘制地图方法
                paintMap(R);
                var textAttr = {
                    "fill": "#000",
                    "font-size": "12px",
                    "cursor": "pointer"
                };

                for (var state in china) {
                    if (china[state]['path']) {
                        china[state]['path'].color = Raphael.getColor(0.9);
                    }
                    (function (st, state) {
                        if (!china.hasOwnProperty(state)) return;
                        //获取当前图形的中心坐标
                        var xx = st.getBBox().x + (st.getBBox().width / 2);
                        var yy = st.getBBox().y + (st.getBBox().height / 2);

                        //***修改部分地图文字偏移坐标
                        switch (china[state]['name']) {
                            case "江苏":
                                xx += 5;
                                yy -= 10;
                                break;
                            case "河北":
                                xx -= 10;
                                yy += 20;
                                break;
                            case "天津":
                                xx += 10;
                                yy += 10;
                                break;
                            case "上海":
                                xx += 10;
                                break;
                            case "广东":
                                yy -= 10;
                                break;
                            case "澳门":
                                yy += 10;
                                break;
                            case "香港":
                                xx += 20;
                                yy += 5;
                                break;
                            case "甘肃":
                                xx -= 40;
                                yy -= 30;
                                break;
                            case "陕西":
                                xx += 5;
                                yy += 10;
                                break;
                            case "内蒙古":
                                xx -= 15;
                                yy += 65;
                                break;
                            default:
                        }
                        //写入文字
                        var text = china[state]['text'] = R.text(xx, yy, china[state]['name']).attr(textAttr);

                        st[0].onmouseover = function () {
                            st.animate({
                                fill: st.color,
                                stroke: "#eee"
                            }, 500);
                            china[state]['text'].toFront();
                            //                        R.safari();
                        };
                        st[0].onmouseout = function () {
                            st.animate({
                                fill: "#97d6f5",
                                stroke: "#eee"
                            }, 500);
                            china[state]['text'].toFront();
                            //                        R.safari();
                        };
                        text[0].onclick = function () {
                            if (scope.$parent.selectrg) {
                                scope.$parent.selectrg(state);
                            }
                        }
                        st[0].onclick = function () {
                            if (scope.$parent.selectrg) {
                                scope.$parent.selectrg(state);
                            }
                        }

                    })(china[state]['path'], state);

                }
            }
        }
    }

    /**
     * sparkline - Directive for Sparkline chart
     */
    function sparkline() {
        return {
            restrict: 'A',
            scope: {
                sparkData: '=',
                sparkOptions: '=',
            },
            link: function (scope, element, attrs) {
                scope.$watch(scope.sparkData, function () {
                    render();
                });
                scope.$watch(scope.sparkOptions, function () {
                    render();
                });
                var render = function () {
                    $(element).sparkline(scope.sparkData, scope.sparkOptions);
                };
            }
        }
    };

    /**
     * icheck - Directive for custom checkbox icheck
     */
    function icheck($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function (newValue) {
                        $(element).iCheck('update');
                    })

                    return $(element).iCheck({
                        checkboxClass: 'icheckbox_square-green',
                        radioClass: 'iradio_square-green'

                    }).on('ifChanged', function (event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function () {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function () {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
                });
            }
        };
    }

    /**
     * ionRangeSlider - Directive for Ion Range Slider
     */
    function ionRangeSlider() {
        return {
            restrict: 'A',
            scope: {
                rangeOptions: '='
            },
            link: function (scope, elem, attrs) {
                elem.ionRangeSlider(scope.rangeOptions);
            }
        }
    }

    /**
     * dropZone - Directive for Drag and drop zone file upload plugin
     */
    function dropZone() {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                uploadList: '=',
                importCust: '=',
                importGrid: '='
            },
            link: function (scope, element, attrs, ngModel) {
                var url_str = "/web/scp/filesuploadsave2.do";
                var filed = attrs['filed']; //文件上传的区域
                var flag = attrs['flag'] || 1; //上传类型
                var postdata = {
                    scpsession: window.strLoginGuid,
                    sessionid: window.strLoginGuid,
                };
                if (scope.importGrid) {
                    url_str = "/importexcel";
                    postdata.classname = "com.oms.baseman.Base_Excel";
                    postdata.funcname = "doImportFromExcel";
                    postdata.flag = flag;
                }
                var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
                element.dropzone({
                    url: url_str,
                    maxFilesize: 500,
                    paramName: "docFile0",
                    addRemoveLinks: true,
                    //acceptedFiles:'*.*',
                    headers: postdata,
                    previewTemplate: tpl.prop("outerHTML"),
                    // previewsContainer: filed,
                    maxThumbnailFilesize: 5,
                    init: function () {
                        //scope.files.push({file: 'added'});
                        this.on('addedfile', function (file) {
                            var _this = this;
                            postdata.cust_id = scope.importCust ? scope.importCust : "";
                            if (scope.importGrid) {
                                if ($("body").toggleLoading) {
                                    $("body").css({
                                        "overflow": "hidden"
                                    });
                                    $("body").toggleLoading({
                                        msg: "正在导入数据..."
                                    });
                                }
                                ;
                            } else if (filed) {
                                var icon = "xls.png";
                                icon = SinoccCommon.getAttachIcon(file.name);

                                var filelist = "<tr class='inline' id=" + file.id + "><div class='attach'>" +
                                    "<a class='close_delete_icon hide'></a>" +
                                    "<div  alt='pic' width='20' class='fa " + icon + "'</div>" +
                                    "<div class='progress progress-mini'>" +
                                    "<div style='width: 0%;' class='progress-bar'></div></div>" +
                                    "<div class='desc'><a title='" + file.name + "' style='word-break: break-all;' class='block text-ellipsis text-center' target='_blank'>" + file.name + "</a>" +
                                    "<span class='block text-center'>" + Math.round(file.size / 1024) + " KB</span></div></div></tr>";
                                $("#body").append(filelist);
                                $('li#' + file.id + ' .close_delete_icon').bind('click', function () {

                                });
                                $('li#' + file.id).hover(function () {
                                    //$(this).find("a.close_delete_icon").fadeToggle();
                                    $(this).find("a.close_delete_icon").toggleClass("hide");
                                });
                                $('li#' + file.id).bind("click", function () {
                                    console.log("OK");
                                });

                            } else {
                            }

                        });
                        this.on('uploadprogress', function (file, percentage) {
                            //Show Progress  // 上传进行中，显示进度

                            $(filed).find("li#" + file.id).find("div.progress-bar").css('width', percentage + '%');

                            $("#loading_text label").text(percentage + "%");
                        });
                        this.on('success', function (file, json) {
                            var obj = strToJson(json);
                            if (obj.failure) {
                                alert("上传失败!");
                                $('li#' + file.id).detach();
                                return;
                            }
                            if (obj.success && !scope.importGrid) {
                                var attach = {};
                                attach.fileurl = '/downloadfile.do?docid=' + obj.data[0].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                                attach.docid = obj.data[0].docid;
                                attach.docname = obj.data[0].docname;
                                attach.downloadcode = obj.data[0].downloadcode;
                                attach.oldsize = obj.data[0].oldsize;
                                attach.index = obj.data[0].index;
                                scope.$apply(function () {
                                    if (scope.uploadList) {
                                        scope.uploadList.push(attach);
                                    }
                                });
                                var item = $('#log li#' + file.id);
                                item.find('div.progress').css('width', '100%');
                                item.find('span.progressvalue').text('100%');
                                var fileurl = '/downloadfile.do?docid=' + obj.data[0].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                                var pathtofile = '<a href="' + fileurl + '" target="_blank" >查看 &raquo;</a>';
                                item.addClass('success').find('p.status').html('上传完成!!! | ' + pathtofile);

                                if (filed) {
                                    $('li#' + file.id + ' a.close_delete_icon').detach();
                                    $('li#' + file.id + ' .progress').hide();
                                    $('li#' + file.id + ' div.desc a').attr("href", fileurl);
                                } else {

                                }

                            } else if (scope.importGrid) {
                                var grid = scope.importGrid.grid;
                                var grid_data = grid.getData();
                                if (obj.data.base_excels) {
                                    var len = obj.data.base_excels.length;
                                    for (var j = 0; j < len; j++) {
                                        grid_data.push(obj.data.base_excels[j]);
                                    }
                                }
                                grid.setData(grid_data);
                                grid.invalidateAllRows();
                                grid.updateRowCount();
                                grid.render();
                                if ($("body").toggleLoading) {
                                    $("body").css({
                                        "overflow": "auto"
                                    });
                                    $("body").toggleLoading();
                                }
                                ;
                            }
                        });
                        this.on("error", function () {
                            console.log("File upload error");
                        });
                        this.on('drop', function (file) {
                            console.log("File Drop In");
                        });

                        function orginList() {
                            //如果本身含有附件
                            if (scope.uploadList && !scope.importGrid) {
                                $(filed).html("");
                                for (var i = 0; i < scope.uploadList.length; i++) {
                                    var icon = "xls.png";
                                    icon = SinoccCommon.getAttachIcon(scope.uploadList[i].docname);
                                    var fileurl = '/downloadfile.do?docid=' + scope.uploadList[i].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();

                                    var $filelist = $("<tr class='inline' id=" + scope.uploadList[i].docid + "><div class='attach'>" +
                                        "<a class='close_delete_icon hide'></a>" +
                                        "<div  alt='pic' width='30' class='fa " + icon + "'></div>" +
                                        "<div class='desc'><a href='" + fileurl + "' title='" + scope.uploadList[i].docname + "' style='word-break: break-all;' class='block text-ellipsis text-center' target='_blank'>" + scope.uploadList[i].docname + "</a>" +
                                        "<span class='block text-center'>" + Math.round(scope.uploadList[i].oldsize / 1024) + " KB</span></div></div></tr>");

                                    $("#body").append($filelist);
                                }
                            }

                        }

                        ngModel.$render = function () {
                            var item = scope[attrs['ngModel']];
                            orginList();
                        }
                    }
                });
            }
        }

    }

    /**
     * chatSlimScroll - Directive for slim scroll for small chat
     */
    function chatSlimScroll($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    element.slimscroll({
                        height: '234px',
                        railOpacity: 0.4
                    });

                });
            }
        };
    }

    /**
     * customValid - Directive for custom validation example
     */
    function customValid() {
        return {
            require: 'ngModel',
            link: function (scope, ele, attrs, c) {
                scope.$watch(attrs.ngModel, function () {

                    // You can call a $http method here
                    // Or create custom validation

                    var validText = "Inspinia";

                    if (scope.extras == validText) {
                        c.$setValidity('cvalid', true);
                    } else {
                        c.$setValidity('cvalid', false);
                    }

                });
            }
        }
    }

    /**
     * fullScroll - Directive for slimScroll with 100%
     */
    function fullScroll($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    element.slimscroll({
                        height: '100%',
                        railOpacity: 0.9
                    });

                });
            }
        };
    }

//弹窗 -- 动态表头
    function searchThead($timeout, $compile) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    var theadStr = "<th>序号</th>";
                    if (!$scope.FrmInfo) {
                        $scope.FrmInfo = {
                            title: 'title'
                        }
                        console.info("Model Not Set!");
                    } else if ($scope.FrmInfo.type == "checkbox") {
                        theadStr = "<th class='p-xxs'><input id='selectall' ng-click='selectall($event)' type='checkbox' name='selectall'>选择</th>";
                        for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
                            var width_str = "";
                            if ($scope.FrmInfo.thead[i].width)
                                width_str = "style='width:" + $scope.FrmInfo.thead[i].width + ";'";
                            theadStr += "<th " + width_str + ">" + $scope.FrmInfo.thead[i].name + "</th>";
                        }
                    } else {
                        for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
                            var width_str = "";
                            if ($scope.FrmInfo.thead[i].width)
                                width_str = "style='width:" + $scope.FrmInfo.thead[i].width + ";'";
                            theadStr += "<th " + width_str + ">" + $scope.FrmInfo.thead[i].name + "</th>";
                        }
                    }

                    var el = $compile(theadStr)($scope);
                    $scope.$apply(function () {
                        $(element).append(el);
                    });
                });
            }
        };
    }

//弹窗 -- 动态显示列元素
    function searchTd($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    var tbodyTdStr = "";
                    for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
                        if ($scope.iitem.hasOwnProperty($scope.FrmInfo.thead[i].code)) {
                            var code = String($scope.FrmInfo.thead[i].code).toLowerCase();
                            var value = $scope.iitem[$scope.FrmInfo.thead[i].code];
                            if (code.indexOf("date") > -1 || code.indexOf("time") > -1) {
                                value = value.substring(0, 10);
                            }
                            if ($scope.FrmInfo.thead[i].type == "list" || $scope.FrmInfo.thead[i].type == "boolean") {
                                for (var j = 0; j < $scope.FrmInfo.thead[i].dicts.length; j++) {
                                    if (value == $scope.FrmInfo.thead[i].dicts[j].id) {
                                        value = $scope.FrmInfo.thead[i].dicts[j].name;
                                        break;
                                    }
                                }
                            } else if ($scope.FrmInfo.thead[i].name.indexOf("状态") > -1) {
                                if (parseInt(value) == 1) {
                                    value = '制单';
                                } else if (parseInt(value) == 3) {
                                    value = '启动';
                                } else if (parseInt(value) == 4) {
                                    value = '驳回';
                                } else if (parseInt(value) == 5) {
                                    value = '审核';
                                } else if (parseInt(value) == 6) {
                                    value = '已分车';
                                } else if (parseInt(value) == 7) {
                                    value = '已出仓';
                                } else if (parseInt(value) == 8) {
                                    value = '已送货';
                                } else if (parseInt(value) == 9) {
                                    value = '已签收';
                                } else if (parseInt(value) == 10) {
                                    value = '已开票';
                                } else if (parseInt(value) == 99) {
                                    value = '作废';
                                }
                            }

                            if ($scope.FrmInfo.thead[i].name.indexOf("保留库存") > -1) {
                                tbodyTdStr += "<td id='fa-search' class='input-group'>" + value + "&nbsp;&nbsp;&nbsp;<a><i class='fa fa-search'></i></a></td>";

                            } else {
                                tbodyTdStr += "<td>" + value + "</td>";
                            }
                        }
                    }

                    $scope.$apply(function () {
                        if (!tbodyTdStr) {
                            $(element).html("");
                        }
                        $(element).after(tbodyTdStr);
                    });

                });
            }
        };
    }

//弹窗 -- 批量新增动态表头
    function addsearchThead($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    var theadStr = "";
                    if ($scope.FrmInfo) {
                        for (var i = 0; i < $scope.FrmInfo.thead.length; i++) {
                            var width_str = "";
                            if ($scope.FrmInfo.thead[i].width)
                                width_str = "style='width:" + $scope.FrmInfo.thead[i].width + ";'";
                            theadStr += "<th " + width_str + ">" + $scope.FrmInfo.thead[i].name + "</th>";
                        }
                    } else {
                        $scope.FrmInfo = {
                            title: '标题'
                        }
                        console.info("Model No Info!");
                    }
                    $scope.$apply(function () {
                        $(element).after(theadStr);
                    });
                });
            }
        };
    }

    /**
     * swfUpload文件上传指令
     */
    function swfUpload(BasemanService, $timeout) {
        return {
            restrict: 'A',
            require: '?ngModel',
            scope: {
                uploadList: '=',
                importGrid: '=',
                importColumns: '=',
                importCust: '=',
                uploadMethod: '&',
                importComplete: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                scope.element = element;
                var url_str = "/web/scp/filesuploadsave2.do";
                var filed = attrs['filed']; //文件上传的区域
                var filedstr = undefined;
                if (filed) {
                    var filedstr = filed.replace("#", "-");
                }
                var flag = attrs['flag'] || 1; //上传类型
                var fileid = ""; //文件ID 用于上传文件
                var postdata = {
                    scpsession: window.strLoginGuid,
                    sessionid: window.strLoginGuid,
                };
                if (scope.importGrid) {
                    url_str = "/web/scp/filesuploadexcel.do";
                    postdata.classname = "com.dmcrm.baseman.Base_Excel";
                    postdata.funcname = "doImportFromExcel";
                    postdata.flag = flag;
                }

                function random4() {
                    var charactors = "1234567890";
                    var value = "";
                    for (j = 1; j <= 4; j++) {
                        i = parseInt(10 * Math.random());
                        value = value + charactors.charAt(i);
                    }
                    return value;
                }

                var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");

                //columns
                var getcolumns = function (columns) {
                    var columnsDef = [];
                    for (var i = 0; i < columns.length; i++) {
                        if (typeof columns[i].columns == 'object') {
                            for (var j = 0; j < columns[i].columns.length; j++) {
                                columnsDef[columnsDef.length] = columns[i].columns[j];
                            }
                        } else {
                            columnsDef[columnsDef.length] = columns[i];
                        }
                    }
                    return columnsDef;
                }
                $timeout(function () {

                    element.dropzone({
                        url: url_str,
                        maxFilesize: 500,
                        paramName: "docFile0",
                        fallback: function () {
                            BasemanService.notice("浏览器版本太低,文件上传功能将不可用！", "alert-warning");
                        },
                        addRemoveLinks: true,
                        //acceptedFiles:'*.*',
                        params: postdata,
                        previewTemplate: tpl.prop("outerHTML"),
                        // previewsContainer: filed,
                        maxThumbnailFilesize: 5,
                        init: function () {
                            this.on('addedfile', function (file) {
                                //IncRequestCount();
                                scope.importCust = scope.importCust ? scope.importCust : "";
                                this.options.params.cust_id = scope.importCust;
                                var list = [];
                                if (scope.importColumns) {
                                    this.options.params.flag = 1;
                                    scope.importColumns = getcolumns(scope.importColumns);
                                    for (var i = 0; i < scope.importColumns.length; i++) {
                                        var col = scope.importColumns[i];
                                        if (col.children instanceof Array) {
                                            this.options.params.flag = 2;
                                            for (var j = 0; j < col.children.length; j++) {
                                                var colchild = col.children[j]
                                                var obj = {
                                                    field: colchild.field,
                                                    name: colchild.headerName,
                                                    pname: col.headerName,
                                                };
                                                if (colchild.cellEditorParams && colchild.cellEditorParams.values) {
                                                    obj.options = colchild.cellEditorParams.values;
                                                }
                                                if (colchild.cellEditor.name) {
                                                    if (colchild.cellEditor.name == "DateCellEditor") {
                                                        obj.type = "date";
                                                    } else if (colchild.cellEditor.name == "SelectCellEditor") {
                                                        obj.type = "number";
                                                    } else if (colchild.cellEditor.name == "NumericCellEditor" || colchild.cellEditor.name == "FloatCellEditor") {
                                                        obj.type = "number";
                                                    } else {
                                                        obj.type = "string";
                                                    }
                                                } else {
                                                    obj.type = "string";
                                                }
                                                list.push(obj);
                                            }
                                            continue;
                                        }
                                        var obj = {
                                            field: col.field,
                                            name: col.headerName,
                                        };
                                        if (col.cellEditorParams && col.cellEditorParams.values) {
                                            obj.options = col.cellEditorParams.values;
                                        }

                                        if (col.cellEditor.name) {
                                            if (col.cellEditor.name == "DateCellEditor") {
                                                obj.type = "date";
                                            } else if (col.cellEditor.name == "SelectCellEditor") {
                                                obj.type = "number";
                                            } else if (col.cellEditor.name == "NumericCellEditor" || col.cellEditor.name == "FloatCellEditor") {
                                                obj.type = "number";
                                            } else {
                                                obj.type = "string";
                                            }
                                        } else {
                                            obj.type = "string";
                                        }

                                        list.push(obj);
                                    }
                                }
                                this.options.params.columns = JSON.stringify(list);
                                if (filed) {
                                    fileid = random4();
                                    file.id = "file_" + fileid;
                                    var icon = "fa-file-word-o";
                                    if (HczyCommon.getAttachIcon(file.name)) {
                                        icon = HczyCommon.getAttachIcon(file.name);
                                    }
                                    var filelist =
                                        "<tr class='line' ng_mouseover='showActionButtons=true' ng_mouseleave='showActionButtons=false' id=" + file.id + "  row=" + i + "><td style='padding:10px' class='form-inline'>" +
                                        "<span class='block'>" +
                                        "<a class='fa " + icon + "' href='" + file.fileurl + "' title='" + file.name + "' style='font-size:14px ' target='_blank'>" + file.name + "</a>" +
                                        " </span><div class='progress progress-mini'>" +
                                        "<div style='width: 0%;' class='progress-bar'></div></div></td>" +
                                        "<td style='padding:10px' class='form-inline'>" + new Date().Format('yyyy-MM-dd hh:mm:ss') + "</td>" +
                                        "<td style='padding:10px' class='form-inline'>" + Math.round(file.size / 1024) + "KB</td>" +
                                        "<td style='padding:10px'><span ng-show='showActionButtons' class='pull-right hide'>" +
                                        "<a class='delete' title='删除' data-toggle='tooltip' data-placement='top' tooltip='' style='padding-right:6px;'><i class='fa fa-trash' style='font-size:20px'></i></a>" +
                                        "</span>" +
                                        "</td>" +

                                        "</tr>";
                                    $("#body" + filedstr).append(filelist);
                                    $('tr#' + file.id + ' .delete').bind('click', function () {
                                        var _this = this;
                                        ds.dialog.confirm("您确定删除该附件吗？", function () {
                                            var $item = $(_this).closest(".line");
                                            var index = $item.index();
                                            scope.uploadList.splice(index, 1);
                                            $item.detach();
                                        });
                                    });
                                    $('tr#' + file.id).hover(function () {
                                        $(this).find("span.pull-right").toggleClass("hide");
                                    });

                                } else {
                                }

                            })
                                .on('dragstart', function (file) {
                                    return false;
                                })
                                .on('uploadprogress', function (file, percentage) {
                                    //Show Progress  // 上传进行中，显示进度
                                    file.id = "file_" + fileid;
                                    $(filed).find("tr#" + file.id).find("div.progress-bar").css('width', percentage + '%');

                                    $("#loading_text label").text(percentage + "%");
                                })
                                .on('success', function (file, json) {
                                    try {
                                        DecRequestCount();
                                        var obj = strToJson(json);
                                        if (obj.failure) {
                                            BasemanService.notice("上传失败!", "alert-warning");
                                            //alert("上传失败!");
                                            $('tr#' + file.id).detach();
                                            return;
                                        }
                                        if (obj.success && !scope.importGrid) {
                                            file.id = "file_" + fileid;
                                            var attach = {};
                                            attach.fileurl = '/downloadfile.do?docid=' + obj.data[0].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                                            attach.docid = obj.data[0].docid;
                                            attach.docname = obj.data[0].docname;
                                            attach.createtime = new Date().Format('yyyy-MM-dd hh:mm:ss');
                                            attach.create_time = obj.data[0].create_time;
                                            attach.downloadcode = obj.data[0].downloadcode;
                                            attach.oldsize = obj.data[0].oldsize;
                                            attach.index = obj.data[0].index;
                                            scope.$apply(function () {
                                                if (scope.uploadList == undefined) {
                                                    scope.uploadList = []
                                                }
                                                if (scope.uploadList) {
                                                    scope.uploadList.push(attach);
                                                }
                                            });

                                            var fileurl = '/downloadfile.do?docid=' + obj.data[0].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                                            if (filed) {
                                                //$('li#'+file.id+' a.close_delete_icon').detach();
                                                BasemanService.notice("上传成功!", "alert-warning");
                                                $(filed).find('tr#' + file.id).attr("row", scope.uploadList.length);
                                                $(filed).find('tr#' + file.id + ' .progress').hide();
                                                $(filed).find('tr#' + file.id + ' td span a.fa').attr("href", fileurl);
                                                $(filed).find('tr#' + file.id).attr("id", obj.data[0].docid);
                                            }

                                        } else if (scope.importGrid) {

                                            var grid = scope.importGrid.api;
                                            var grid_data = [];
                                            if (obj.data.base_excels) {
                                                var len = obj.data.base_excels.length;
                                                for (var j = 0; j < len; j++) {
                                                    grid_data.push(obj.data.base_excels[j]);
                                                }
                                            }
                                            if (scope.uploadList) {
                                                scope.uploadList = obj.data.base_excels;
                                            } else {
                                                grid.setRowData(grid_data);
                                            }
                                            if (obj.data.note_msg != undefined && obj.data.note_msg.length > 0) {
                                                var arr = obj.data.note_msg.split(";")
                                                arr.splice(arr.length - 1, 1);
                                                arr.splice(0, 0, "Excel文件中存在错误");
                                                BasemanService.notice(arr);
                                            }
                                            if (scope.importComplete) {
                                                scope.importComplete(grid_data);
                                            }

                                            if (scope.importComplete) {
                                                scope.importComplete(grid_data);
                                            }
                                        }
                                    } catch (e) {
                                        BasemanService.notice("上传数据异常!", "alert-warning");
                                    } finally {
                                        /**window.REQUESTPOST_TIMES--;
                                         if (window.REQUESTPOST_TIMES < 1) {
									    $(".desabled-window").css("display", "none");
									}*/
                                    }

                                })
                                .on("error", function () {
                                    /**window.REQUESTPOST_TIMES--;
                                     if (window.REQUESTPOST_TIMES < 1) {
								    $(".desabled-window").css("display", "none");
								}
                                     console.log("File upload error");*/
                                })
                                .on('drop', function (file) {
                                    console.log("File Drop In");
                                })
                        },
                    });
                }); //end Timeout
                function orginList() {
                    //如果本身含有附件
                    if (scope.uploadList && !scope.importGrid) {
                        var filedstr = filed.replace("#", "-")
                        $(filed).html("<table class='table table-hover table-striped'><thead><tr ><th width='50%'></th><th width='20%'></th><th width='15%'></th><th width='15%'> </tr></thead><tbody id='body" + filedstr + "'></tbody></table>");
                        var html = "";
                        for (var i = 0; i < scope.uploadList.length; i++) {
                            var icon = "fa-file-word-o";
                            if (HczyCommon.getAttachIcon(scope.uploadList[i].docname)) {
                                icon = HczyCommon.getAttachIcon(scope.uploadList[i].docname);
                            }
                            var fileurl = '/downloadfile.do?docid=' + scope.uploadList[i].docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                            html = "<tr class='line' ng_mouseover='showActionButtons=true' ng_mouseleave='showActionButtons=false' id=" + scope.uploadList[i].docid + "  row=" + i + "><td style='padding:10px' class='form-inline'>" +
                                "<span class='block'>" +
                                "<a class='fa " + icon + "' href='" + fileurl + "' title='" + scope.uploadList[i].docname + "' style='font-size:14px' target='_blank' download>" + scope.uploadList[i].docname + "</a>" +
                                "</span></td>" +
                                "<td style='padding:10px' class='form-inline'>" + scope.uploadList[i].createtime + "</td>" +
                                "<td style='padding:10px' class='form-inline'>" + Math.round(scope.uploadList[i].oldsize / 1024) + "KB</td>" +
                                "<td style='padding:10px'><span ng-show='showActionButtons' class='pull-right hide'>" +
                                "<a class='delete' title='删除' data-toggle='tooltip' data-placement='top' tooltip='' style='padding-right:6px;'><i class='fa fa-trash' style='font-size:20px'></i></a>" +
                                "</span>" +
                                "</td>" +
                                "</tr>";
                            $("#body" + filedstr).append(html);
                            $('tr#' + scope.uploadList[i].docid + ' .delete').bind('click', function () {
                                var _this = this;
                                ds.dialog.confirm("您确定删除该附件吗？", function () {
                                    var $item = $(_this).closest(".line");
                                    var index = $item.index();
                                    scope.uploadList.splice(index, 1);
                                    $item.detach();
                                });
                            });
                            var str = scope.element.attr("ng-disabled");
                            if (str != undefined) {
                                str = str.replace(/data./g, "scope.$parent.data.");
                            } else {
                                str = "scope.$parent.data.currItem.stat!=1";
                            }
                            var un_editable = false;
                            try {
                                un_editable = eval(str);
                            } catch (error) {
                                un_editable = false;
                                console.log(error.message);
                            }
                            if (!un_editable) {
                                $('tr#' + scope.uploadList[i].docid).hover(function () {
                                    $(this).find("span.pull-right").toggleClass("hide");
                                });
                            }
                            $('tr#' + scope.uploadList[i].docid).bind("click", function () {
                                console.log("OK");
                            });
                        }
                    }

                }

                if (ngModel != undefined) {
                    ngModel.$render = function () {
                        var item = scope[attrs['ngModel']];
                        orginList();
                    }
                }
            }
        }
    }

    function fileSize($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    var size = 0;
                    var sizeStr = "";
                    if ($scope.attach.oldsize < 1024) {
                        sizeStr = "(" + $scope.attach.oldsize + "B)";
                    } else if ($scope.attach.oldsize < 1024 * 1024) {
                        size = Math.round($scope.attach.oldsize / 1024);
                        sizeStr = "(" + size + "KB)";
                    } else {
                        size = Math.round($scope.attach.oldsize / 1024 / 1024);
                        sizeStr = "(" + size + "MB)";
                    }

                    $scope.$apply(function () {
                        $(element).html(sizeStr);
                    });
                });
            }
        };
    }

    function fileDownloadUrl($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    var fileurl = '/downloadfile.do?docid=' + $scope.attach.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    $scope.$apply(function () {
                        $(element).attr("href", fileurl);
                    });
                });
            }
        };
    }

//Footable
    function fooTable($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    $(".footable").footable();
                    $(".footable").trigger('footable_redraw');
                });
            }
        };
    }

    function addDateevent($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    $scope.$apply(function () {
                        $(element).bind("click", function () {
                            $(element).siblings("input").focus();
                        });
                    });
                });
            }
        };
    }

    function dateFilter($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var value;
                    value = $attrs['value'];

                    $scope.$watch($attrs['ngModel'], function () {
                        if ($(element).val().length > 10) {
                            $(element).val(String($(element).val()).substring(0, 10));
                        }
                    })

                });
            }
        };
    }

    function contentEdit($timeout) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function ($scope, element, $attrs, ngModel) {
                var setView = function () {
                    ngModel.$setViewValue(element.html())
                }
                ngModel.$render = function () {
                    ngModel.html(n.$viewValue || "")
                },
                    ngModel.bind("change blur", function () {
                        $scope.$apply(setView)
                    });

            }
        };
    }

    function turnToEdit() {
        return {
            restrict: "A",
            link: function ($scope, element, $attrs) {
                $(element).bind("click", function () {

                    $(element).closest(".ibox-content").siblings(".ibox-title")
                        .find("a[ui-sref='" + $attrs['to-url'] + "']").trigger("click");
                });
            }
        };
    }

    /**
     * 文本框检验
     */
    function inputDataValidate($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, element, $attrs, ngModel) {
                return $timeout(function () {
                    var setView = function () {
                        var value = $.trim($(element).val());
                        if (value != "") { //有内容的时候
                            var type = $attrs['validate'];
                            if (type == "number") {
                                var re = /^[0-9]+.?[0-9]*$/;
                                //                          if(!re.test(value)){
                                //                              $(element).addClass("error");
                                //                          }
                                re.test(value) ? $(element).removeClass("error") : $(element).addClass("error");
                            }
                        } else {
                            $(element).removeClass("error");
                        }
                    }
                    $(element).bind("change blur", function () {
                        $scope.$apply(setView);
                    });

                });
            }
        };
    }

    function intToStr($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, element) {
                $timeout(function () {
                    $scope.$apply(function () {
                        if (String($(element).val()) != "?")
                            $(element).val(String($(element).val()));
                        else
                            $(element).val("0");
                    });
                });
            }
        };
    }

    function tableExpended() {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var text = attrs["text"] || " ";
                var a = $("<a><i class='fa fa-chevron-up'></i> " + text + "</a>");
                $(element).prepend(a);
                a.bind("click", function () {
                    $(this).children("i").toggleClass("fa-chevron-up").toggleClass("fa-chevron-down");
                    if ($(element).children("table").hasClass("hide")) {
                        $(element).children("table").removeClass("hide").fadeIn("fast");
                    } else
                        $(element).children("table").fadeToggle("fast");
                });
            }
        };
    }

    function wfYstep($timeout, BaseService, localeStorageService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                wf_stat: '=wfStat',
                wf_apply_id: '=wfApplyId',
                wf_own_method: "&wfOwnMethod"
            },
            link: function (scope, element, attrs, ngModel) {
                var color = attrs['color'] || "green";
                var size = attrs['size'] || "small";
                ngModel.$render = function () {
                    if (ngModel.$viewValue && Number(ngModel.$viewValue) > 0) {
                        var wfid = Number(ngModel.$viewValue);
                        BaseService.RequestPost("base_wf", "select", {
                            wfid: wfid
                        }).then(function (data) {
                            draw_wf(data);
                        });
                    } else {
                        clear_wf();
                    }
                };

                function clear_wf() { //清除流程图
                    $(element).html("");
                    $(element).siblings("div.wf_container").detach();
                }

                function draw_wf(data) {
                    clear_wf();
                    $(element).attr("style", "overflow-x:auto;")
                    if (scope.wf_stat != undefined) {
                        scope.wf_stat = data.stat;
                    }

                    var step = data.currprocid + 1;
                    if (data.currprocid >= 99999) {
                        step = data.wfprocs.length;
                    }
                    var wfid = data.wfid;
                    var wfname = data.wfname;
                    var wfproccondtions = data.wfproccondtions;
                    var procs = data.wfprocs;
                    var wfprocuseropinions = data.wfprocuseropinions;
                    var wfprocusers = data.wfprocusers;

                    //当前结点是否禁止驳回
                    var can_reject_stat = true;
                    if (data.currprocid < 99999 && procs.length && procs[data.currprocid].canreject && procs[data.currprocid].canreject == "1") {
                        can_reject_stat = false;
                    }
                    var submitstat = false;
                    for (var i = 0; i < procs.length; i++) {
                        if (procs[i].submitstat == "2" && procs[i].procid == data.currprocid) {
                            submitstat = true;
                            break;
                        }
                    }
                    var submitlist = [];
                    if (submitstat) { //当前结点如果是被驳回，提交时需要指定提交到原来驳回的节点
                        var p_data = {
                            wfid: wfid,
                            procid: data.currprocid,
                            stat: 4,
                            operright: 3
                        };
                        BaseService.RequestPost("scpwfproc", "getsubmitnodeinfo", p_data)
                            .then(function (data) {
                                var nodepath = String(data.wfnodepathofwfprocs[0].nodepath);
                                var str = (step - 1) + "-";
                                var a = nodepath.substr(nodepath.indexOf(str) + 2);
                                var nodepath_list = a.split("-");
                                //var submitnote = nodepath_list[1];
                                for (var i = 0; i < procs.length; i++) {
                                    for (var j = 0; j < nodepath_list.length; j++) {
                                        if (procs[i].procid == nodepath_list[j]) {
                                            submitlist.push(procs[i]);
                                        }
                                    }
                                }
                            });
                    }
                    /**
                     var data = [{
				    //步骤名称
				    title: "开始",//节点名称
				    content: "实名用户/公益组织发起项目"//节点内容
				    }];
                     */
                    $(element).loadStep({
                        //ystep的外观大小//可选值：small,large
                        size: size,
                        //ystep配色方案//可选值：green,blue
                        color: color,
                        //ystep中包含的步骤
                        steps: procs
                    });

                    var detailHtml = "";
                    //流程图下明细
                    var break_str = "";
                    if (step < procs.length) {
                        break_str = "<button class='btn btn-primary wfbreak m-r-xs btn-sm'>中断</button>";
                    }
                    var close_page = "" //<button class='btn btn-primary wfclosepage m-r-xs btn-sm'>返回上一页</button>";
                    var delete_current = "<button class='btn btn-primary wfignore m-r-xs btn-sm'>流程忽略</button>";

                    var $button_group = $("<span class='span12 text-center wf_op inline m-b-sm'>" +
                        //"<button class='btn btn-primary wfdetail m-r-xs btn-sm'>流程详情>></button>" +
                        "<button class='btn btn-primary wfrefresh m-r-xs btn-sm'>刷新当前流程</button>" +
                        "<button class='btn btn-primary wfsubmit m-r-xs btn-sm'>提交</button>" +
                        "<button class='btn btn-primary wfreject m-r-xs btn-sm'>驳回</button>" +
                        delete_current + break_str + close_page +
                        "</span>"
                    );

                    var detail_table = $("<div class='wf_detail show'>" +
                        "<table class='table table-borderer table-condensed'>" +
                        "<thead><tr><td>序号</td><td>节点名称</td>" +
                        "<td>执行人列表</td><td>状态</td><td>实际审批人</td>" +
                        "<td>审批时间</td><td>审批意见</td></tr></thead>" +
                        "<tbody></tbody></table></div>");
                    var tbody_str = "";
                    var breakpoint_list = []; //被驳回的节点
                    var can_submit = false; //当前用户是否是可以审核
                    scope.$parent.can_submit = true;
                    var wf_curr_person = 0; //当前审核节点的审核人数
                    var wf_startor = false; //当前流程启动者
                    for (var i = 0; i < wfprocuseropinions.length; i++) {
                        var wf = wfprocuseropinions[i];
                        var stat_str = "";
                        var turn_someone = "";
                        if (wf.action_stat == "0") {
                            stat_str = "<span>启动</span>";
                            if (wf.userid == window.userbean.userid) {
                                wf_startor = true;
                            }
                        } else if (wf.action_stat == "1") {
                            stat_str = "<span>未达到</span>";
                        } else if (wf.action_stat == "4") {
                            stat_str = "<span style='color:red'>待审核</span>";
                            if (wf.userid == window.userbean.userid) {
                                turn_someone = "<button style='margin:0;padding: 1px 5px;' class='btn btn-primary wftrunto m-r-xs btn-sm'>转办</button>";
                                can_submit = true;
                                scope.$parent.can_submit = false;
                            }
                            if (window.userbean.userid == "admin") {
                                turn_someone += "&nbsp;&nbsp;&nbsp;<button style='margin:0;padding: 1px 5px;' class='btn btn-primary wfchgchecker m-r-xs btn-sm'>修改审核人</button>";
                            } else {
                                if (window.userbean.stringofrole.indexOf("admins") > -1) {
                                    turn_someone += "&nbsp;&nbsp;&nbsp;<button style='margin:0;padding: 1px 5px;' class='btn btn-primary wfchgchecker m-r-xs btn-sm'>修改审核人</button>";
                                }
                            }
                            wf_curr_person++;
                        } else if (wf.action_stat == "5") {
                            breakpoint_list.push(wf);
                            stat_str = "<span>驳回</span>";
                        } else if (wf.action_stat == "7") {
                            stat_str = "<span>完成</span>";
                        } else {
                        }
                        var detail_high = "";
                        if (window.userbean.stringofrole.indexOf("admins") > -1) {
                            detail_high += "&nbsp;&nbsp;&nbsp;<button style='margin:0;padding: 1px 5px;'" + "index=" + wf.procid + " class='btn btn-primary wfdetail m-r-xs btn-sm pull-right'>详情</button>"
                        }
                        tbody_str += "<tr>" +
                            "<td>" + (i + 1) + "</td><td>" + wf.procname + "</td>" +
                            "<td>" + wf.username + "</td><td>" + stat_str +
                            "</td><td>" + wf.username + "</td>" +
                            "<td>" + (wf.signtime || '') + "</td>" +
                            "<td>" + (wf.opinion || '') + turn_someone + detail_high + "</td></tr>";
                    }
                    //附件
                    var scpwf_web_attachs = data.scpwf_web_attachs;
                    scope.$parent.data.currItem.objattachs = scpwf_web_attachs;
                    setTimeout(function () {
                        for (var i = 0; i < scope.$parent.data.currItem.objattachs.length; i++) {
                            $('tr#' + scope.$parent.data.currItem.objattachs[i].docid).unbind('mouseenter').unbind('mouseleave');
                            ;
                        }
                    }, 500)

                    //当流程审批人仅有一个人的时候不可忽略
                    if (wf_curr_person <= 1 || !can_submit) {
                        $button_group.find(".wfignore").detach();
                    }
                    //流程启动者才可以中断流程
                    if (!wf_startor && window.strUserId != 'admin') {
                        $button_group.find(".wfbreak").detach();
                    }
                    if (!can_submit) {
                        $button_group.find(".wfsubmit").detach();
                        $button_group.find(".wfreject").detach();
                    }
                    var breakpoint = -1;
                    if (breakpoint_list.length) { //被驳回的节点列表
                        var max = Number(breakpoint_list[0].procid);
                        if (breakpoint_list.length == 1) {
                            max = Number(breakpoint_list[0].procid);
                        } else {
                            for (var i = 1; i < breakpoint_list.length; i++) {
                                if (max < Number(breakpoint_list[i].procid)) {
                                    max = Number(breakpoint_list[i].procid);
                                }
                            }
                        }
                        var temp_b = -1;
                        for (var j = 0; j < procs.length; j++) {
                            if (procs[j].procid == max) {
                                temp_b = j + 1;
                            }
                        }
                        breakpoint = temp_b;
                    }

                    $(element).setStep(step, breakpoint + 1);

                    detail_table.find("tbody").html(tbody_str);

                    var $wf_container = $("<div class='wf_container' style='overflow:visible;'></div>'");
                    $wf_container.append($button_group);
                    $wf_container.append(detail_table);
                    $(element).find(".wf_container").html("");
                    $(element).after($wf_container);
                    $wf_container.find(".wf_detail").find(".wftrunto").bind("click", function () { //转办
                        //                  console.log("转发流程");
                        BaseService.openFrm("views/popview/wf_complex_option.html", PopWFTurnOptionController, scope)
                            .result.then(function (result) {
                            var postdata = {
                                wfid: wfid,
                                proc_id: data.currprocid,
                                tranuserid: result.userid,
                                tranopinion: result.opinion
                            };
                            BaseService.RequestPost("base_wf", "transferto", postdata)
                                .then(function (data) {
                                    BaseService.notice("流程已转办!", "alert-info");
                                    draw_wf(data);
                                });
                        });

                    });
                    $wf_container.find(".wf_detail").find("button.wfchgchecker").bind("click", function () { //修改审核人
                        scope.wfscpprocusers = [].concat(wfprocusers);
                        var list = [];
                        for (var i = 0; i < scope.wfscpprocusers.length; i++) {
                            if (scope.wfscpprocusers[i].procid == data.currprocid) {
                                list.push(scope.wfscpprocusers[i]);
                            }
                        }
                        scope.wfscpprocusers = list;
                        BaseService.openFrm("views/popview/wf_complex_option.html", PopWFChgCheckerController, scope)
                            .result.then(function (result) {
                            var postdata = {
                                wfid: wfid,
                                procid: data.currprocid,
                                wfscpprocusers: result.wfscpprocusers
                            };
                            BaseService.RequestPost("base_wf", "update_userid", postdata)
                                .then(function (data) {
                                    BaseService.notice("流程已更改!", "alert-info");
                                    draw_wf(data);
                                });
                        });
                    });
                    $wf_container.find(".wf_detail").find("button.wfdetail").bind("click", function () { //详情
                        scope.index = parseInt(this.attributes['index'].value);
                        BaseService.RequestPost("base_wf", "select", {
                            wfid: data.wfid
                        }).then(function (data) {
                            scope.wfprocs = [];
                            var list = [];
                            for (var i = 0; i < data.wfprocs.length; i++) {
                                if (data.wfprocs[i].procid == scope.index) {
                                    list.push(data.wfprocs[i]);
                                }
                            }
                            scope.wfprocs = list;
                            BaseService.openFrm("views/popview/wf_detail.html", PopWFdetailController, scope)
                                .result.then(function (result) {
                                var postdata = result;
                                postdata.wfid = data.wfid;
                                postdata.procid = scope.index;
                                BaseService.RequestPost("base_wf", "update_wfproc", postdata)
                                    .then(function (res) {
                                        BaseService.notice("高级功能已改!", "alert-info");
                                    });
                            });
                        });
                    });

                    $button_group.find(".wfdetail").bind("click", function () { //详情
                        detail_table.toggleClass("hide");
                    });

                    $button_group.find(".wfsubmit").bind("click", function () { //提交
                        var proc_commit = function () {
                            if (!can_submit && window.userbean.userid != "admin") {
                                BaseService.notice("当前用户不可提交", "alert-warning");
                                return;
                            }

                            localeStorageService.remove("wf_procusers");
                            localeStorageService.remove("current_proc");
                            localeStorageService.set("current_proc", data.wfprocs[data.currprocid]);
                            localeStorageService.set("wf_procusers", submitlist);
                            BaseService.openFrm("views/popview/wf_option.html", PopWFOptionController, scope, "", "md")
                                .result.then(function (result) {
                                var postdata = {};
                                //返回即提交
                                postdata.opinion = result.opinion
                                postdata.objid = scope.wf_apply_id
                                postdata.wfid = wfid
                                //postdata.bill_data ={};
                                //postdata.bill_data= scope.$parent.$parent.data.currItem;
                                if (data.wfprocs[data.currprocid].proctype == 4) {
                                    postdata.archivetoname = result.archivetoname;
                                    postdata.archivetotype = result.archivetotype;
                                    postdata.archivetoid = result.archivetoid;
                                }

                                if (data.wfprocs[data.currprocid].proctype == 5) {
                                    postdata.wfpublishofwfprocs = result.wfpublishofwfprocs;
                                }

                                if (result.procid) {
                                    postdata.rejectto = result.procid;
                                }
                                postdata.scpwf_web_attachs = scope.$parent.data.currItem.objattachs;

                                BaseService.RequestPost("base_wf", "submit", postdata)
                                    .then(function (data) {
                                        draw_wf(data);
                                        if (scope.wf_own_method) {
                                            scope.wf_own_method();
                                        }
                                        if (scope.$parent.refresh) {
                                            scope.$parent.refresh(2);
                                        }
                                        BaseService.notice("提交成功", "alert-info");

                                    })
                            });
                        }

                        var warn = scope.$parent.wfproc_warn;
                        if (warn && typeof warn == "function") { //流程提交时提示
                            var str = warn();
                            if (str != undefined && (typeof str == "string" || (str instanceof Array)) && str.length > 0) {
                                ds.dialog.confirm(str, function (e) {
                                    proc_commit();
                                }, function () {
                                    return;
                                })
                            } else if (str == false) {
                                return;
                            } else {
                                proc_commit();
                            }

                        } else {
                            proc_commit();
                        }
                    });
                    $button_group.find(".wfreject").bind("click", function () { //驳回
                        if (step == "2") {
                            BaseService.notice("当前过程为第一步，不能驳回", "alert-warning");
                            return;
                        }
                        if (!can_submit && window.userbean.userid != "admin") {
                            BaseService.notice("当前用户不可驳回！", "alert-warning");
                            return;
                        }
                        if (!can_reject_stat) {
                            BaseService.notice("当前节点禁止驳回！", "alert-warning");
                            return;
                        }
                        localeStorageService.remove("wf_procusers");
                        //当前节点 -- 前
                        var popback = [];
                        for (var i = 0; i < procs.length; i++) {
                            if (Number(procs[i].procid) < (step - 1) && Number(procs[i].procid) != 0) {
                                popback.push(procs[i]);
                            }
                        }

                        localeStorageService.set("wf_procusers", popback);
                        localeStorageService.remove("current_proc");

                        BaseService.openFrm("views/popview/wf_option.html", PopWFOptionController, scope, "", "md")
                            .result.then(function (result) {
                            var postdata = {
                                opinion: result.opinion,
                                objid: scope.wf_apply_id, //单据ID
                                wfid: wfid // 流程ID
                            };
                            if (result.procid) {
                                postdata.rejectto = result.procid;
                            }
                            BaseService.RequestPost("base_wf", "reject", postdata)
                                .then(function (data) {
                                    if ($.trim(data.note)) {
                                        BaseService.notice(data.note, "alert-info");
                                    } else {
                                        BaseService.notice("驳回成功", "alert-info");
                                    }
                                    draw_wf(data);
                                    if (scope.wf_own_method) {
                                        scope.wf_own_method();
                                    }
                                    if (scope.$parent.refresh) {
                                        scope.$parent.refresh(2);
                                    }
                                })
                        });
                    });
                    $button_group.find(".wfbreak").bind("click", function () { //中断
                        ds.dialog.confirm("确定中断当前流程？", function () {
                            var postdata = {
                                objid: scope.wf_apply_id, //单据ID
                                wfid: wfid // 流程ID
                            };
                            BaseService.RequestPost("base_wf", "break", postdata)
                                .then(function () {
                                    BaseService.notice("中断成功", "alert-info");

                                    //处理tab
                                    $($("#maintabs").children("li")).removeClass('active')
                                    $($("#maintabs").children("li").get(0)).addClass('active')
                                    $(".main-tab-pane").removeClass('active')
                                    $("#tab1").addClass('active')

                                    //                      $scope.customer_apply_header.stat=1;
                                    ngModel.$setViewValue(0);
                                    clear_wf();
                                    if (scope.wf_own_method) {
                                        scope.wf_own_method();
                                    }
                                    if (scope.wf_stat != undefined) {
                                        scope.wf_stat = data.stat;
                                    }
                                    if (scope.$parent.refresh) {
                                        scope.$parent.refresh(2);
                                    }
                                })
                        });
                    });
                    $button_group.find(".wfignore").bind("click", function () { //流程忽略
                        ds.dialog.confirm("确定忽略当前流程？", function () {

                            BaseService.RequestPost("base_wf", "deleteuser", {
                                wfid: wfid,
                                procid: (step - 1)
                            }).then(function (data) {
                                draw_wf(data);
                            });
                        });

                    });
                    $button_group.find(".wfrefresh").bind("click", function () { //刷新当前流程
                        BaseService.RequestPost("base_wf", "select", {
                            wfid: wfid
                        }).then(function (data) {
                            draw_wf(data);
                        });
                    });
                    $button_group.find(".wfclosepage").bind("click", function () { //关闭当前页
                        window.history.go(-1);
                    });

                }

            }
        };
    }

    function editText() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                var $input;
                scope.$watch(attrs['ngModel'], function () {
                    $(element).html(ngModel.$viewValue);
                });

                if ($(element).siblings('input').length > 0) {
                    $input = $element.siblings('input');
                } else {
                    $input = $("<input style='width:80px;display:none;' class='form-control input-mini' type='text'>");
                    $(element).after($input);
                }

                $(element).bind("dblclick", function () {
                    $(element).hide();
                    $input.val($(element).html()).show();
                });
                $input.bind("blur", function () {
                    if ($.trim($input.val()) == "0") {
                        ngModel.$setViewValue(0);
                        $(element).show();
                        $input.hide();
                    } else if (!$.trim($input.val()) || !/^[0-9]*[1-9][0-9]*$/.test($input.val())) {
                        $input.focus().val("").attr("placeholder", "整数！");
                    } else {
                        //                  $(element).html($input.val());
                        ngModel.$setViewValue($input.val());
                        $(element).show();
                        $input.hide();
                    }

                });
            }
        };
    }

    function chosenSelect() {
        var __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

        var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;

        NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
        CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
        snakeCase = function (input) {
            return input.replace(/[A-Z]/g, function ($1) {
                return "_" + ($1.toLowerCase());
            });
        };
        isEmpty = function (value) {
            var key;

            if (angular.isArray(value)) {
                return value.length === 0;
            } else if (angular.isObject(value)) {
                for (key in value) {
                    if (value.hasOwnProperty(key)) {
                        return false;
                    }
                }
            }
            return true;
        };
        return {
            restrict: 'A',
            require: '?ngModel',
            terminal: true,
            link: function (scope, element, attr, ngModel) {
                var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender,
                    removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch;

                element.addClass('localytics-chosen');
                options = scope.$eval(attr.chosen) || {};
                angular.forEach(attr, function (value, key) {
                    if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
                        return options[snakeCase(key)] = scope.$eval(value);
                    }
                });
                startLoading = function () {
                    return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
                };
                stopLoading = function () {
                    return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
                };
                chosen = null;
                defaultText = null;
                empty = false;
                initOrUpdate = function () {
                    if (chosen) {
                        return element.trigger('chosen:updated');
                    } else {
                        chosen = element.chosen(options).data('chosen');
                        return defaultText = chosen.default_text;
                    }
                };
                removeEmptyMessage = function () {
                    empty = false;
                    return element.attr('data-placeholder', defaultText);
                };
                disableWithMessage = function () {
                    empty = true;
                    return element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true).trigger('chosen:updated');
                };
                if (ngModel) {
                    origRender = ngModel.$render;
                    ngModel.$render = function () {
                        origRender();
                        return initOrUpdate();
                    };
                    if (attr.multiple) {
                        viewWatch = function () {
                            return ngModel.$viewValue;
                        };
                        scope.$watch(viewWatch, ngModel.$render, true);
                    }
                } else {
                    initOrUpdate();
                }
                attr.$observe('disabled', function () {
                    element[0].disabled = true;
                    return element.trigger('chosen:updated');
                });
                if (attr.ngOptions && ngModel) {
                    match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
                    valuesExpr = match[7];
                    return scope.$watchCollection(valuesExpr, function (newVal, oldVal) {
                        if (angular.isUndefined(newVal)) {
                            return startLoading();
                        } else {
                            if (empty) {
                                removeEmptyMessage();
                            }
                            stopLoading();
                            if (isEmpty(newVal)) {
                                return disableWithMessage();
                            }
                        }
                    });
                }
            }
        };
    };

    function wfView($timeout, BaseService, $http) {
        return {
            restrict: 'EA',
            require: "?ngModel",
            scope: {
                wf_stat: '=wfStat',
                wf_apply_id: '=wfApplyId',
                wf_own_method: "&wfOwnMethod"
            },
            link: function (scope, element, attrs, ngModel) {
                var color = attrs['color'] || "green";
                var size = attrs['size'] || "small";
                ngModel.$render = function () {
                    if (ngModel.$viewValue && Number(ngModel.$viewValue) > 0) {
                        var wfid = Number(ngModel.$viewValue);
                        BaseService.RequestPost("base_wf", "select", {
                            wfid: wfid
                        }).then(function (data) {
                            draw_wf(data);
                        });
                    } else {
                        //clear_wf();
                    }
                };

                function draw_wf(data) {
                    if (scope.wf_stat != undefined) {
                        scope.wf_stat = data.stat;
                    }
                    var step = data.currprocid + 1;
                    if (data.currprocid >= 99999) {
                        step = data.wfprocs.length;
                    }
                    var wfid = data.wfid;
                    var wfname = data.wfname;
                    var wfproccondtions = data.wfproccondtions;
                    var procs = data.wfprocs;
                    var wfprocuseropinions = data.wfprocuseropinions;
                    var wfprocusers = data.wfprocusers;
                    //当前结点是否禁止驳回
                    var can_reject_stat = true;
                    if (data.currprocid < 99999 && procs.length && procs[data.currprocid].canreject && procs[data.currprocid].canreject == "1") {
                        can_reject_stat = false;
                    }
                    var submitstat = false;
                    for (var i = 0; i < procs.length; i++) {
                        if (procs[i].submitstat == "2" && procs[i].procid == data.currprocid) {
                            submitstat = true;
                            break;
                        }
                    }
                    $timeout(function () {
                        var $ = go.GraphObject.make; // for conciseness in defining templates
                        myDiagram =
                            $(go.Diagram, element[0], {
                                initialContentAlignment: go.Spot.Center,
                                validCycle: go.Diagram.CycleNotDirected, // don't allow loops
                                layout: $(go.LayeredDigraphLayout, {
                                    direction: 0
                                }),
                                "undoManager.isEnabled": true
                                // For this sample, automatically show the state of the diagram's model on the page
                                /** "ModelChanged": function(e) {
                if (e.isTransactionFinished) showModel();
              },*/
                                //"undoManager.isEnabled": true
                            });

                        // This template is a Panel that is used to represent each item in a Panel.itemArray.
                        // The Panel is data bound to the item object.
                        var fieldTemplate =
                            $(go.Panel, "TableRow", // this Panel is a row in the containing Table
                                new go.Binding("portId", "name"), // this Panel is a "port"
                                {
                                    background: "transparent", // so this port's background can be picked by the mouse
                                    fromSpot: go.Spot.Right, // links only go from the right side to the left side
                                    toSpot: go.Spot.Left,
                                    // allow drawing links from or to this port:
                                    fromLinkable: false,
                                    toLinkable: false
                                },
                                $(go.Shape, {
                                        width: 10,
                                        height: 15,
                                        column: 0,
                                        strokeWidth: 2,
                                        margin: 4,
                                        // but disallow drawing links from or to this shape:
                                        fromLinkable: false,
                                        toLinkable: false
                                    },
                                    new go.Binding("figure", "figure"),
                                    new go.Binding("fill", "color")),
                                $(go.TextBlock, {
                                        height: 15,
                                        column: 1,
                                        margin: 0,
                                        font: " 8px sans-serif",
                                        alignment: go.Spot.Left,
                                        // and disallow drawing links from or to this text:
                                        fromLinkable: false,
                                        toLinkable: false
                                    },
                                    new go.Binding("text", "name")),
                                $(go.TextBlock, {
                                        column: 2,
                                        margin: 0,
                                        font: "8px sans-serif",
                                        alignment: go.Spot.Left
                                    },
                                    new go.Binding("text", "info"))
                            );

                        // This template represents a whole "record".
                        myDiagram.nodeTemplate =
                            $(go.Node, "Auto", {
                                    movable: true,
                                    copyable: false,
                                    deletable: false
                                },
                                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                                // this rectangular shape surrounds the content of the node
                                $(go.Shape, {
                                    fill: "#EEEEEE"
                                }),
                                // the content consists of a header and a list of items
                                $(go.Panel, "Vertical",
                                    // this is the header for the whole node
                                    $(go.Panel, "Auto", {
                                            stretch: go.GraphObject.Horizontal
                                        }, // as wide as the whole node
                                        $(go.Shape, {
                                            fill: "#1570A6",
                                            stroke: null
                                        }),
                                        $(go.TextBlock, {
                                                alignment: go.Spot.Center,
                                                margin: 3,
                                                stroke: "white",
                                                textAlign: "center",
                                                font: "8pt sans-serif"
                                            },
                                            new go.Binding("text", "key"))),
                                    // this Panel holds a Panel for each item object in the itemArray;
                                    // each item Panel is defined by the itemTemplate to be a TableRow in this Table
                                    $(go.Panel, "Table", {
                                            padding: 2,
                                            minSize: new go.Size(100, 80),
                                            defaultStretch: go.GraphObject.Horizontal,
                                            itemTemplate: fieldTemplate
                                        },
                                        new go.Binding("itemArray", "fields")
                                    ) // end Table Panel of items
                                ) // end Vertical Panel
                            ); // end Node

                        myDiagram.linkTemplate =
                            $(go.Link, go.Link.Orthogonal, {
                                    corner: 5,
                                    relinkableFrom: false,
                                    relinkableTo: false, // let user reconnect links
                                    toShortLength: 5,
                                    fromShortLength: 2
                                },
                                $(go.Shape, {
                                    strokeWidth: 1.5
                                }),
                                $(go.Shape, {
                                    toArrow: "Standard",
                                    stroke: null
                                })
                            );
                        var nodeDataArray = [];
                        var linkDataArray = [];
                        for (var i = 0; i < wfprocusers.length; i++) {
                            var object = new Object();
                            var object1 = new Object();
                            for (var j = 0; j < nodeDataArray.length; j++) {
                                if (nodeDataArray[j].key == wfprocusers[i].procname) {
                                    var object2 = new Object();
                                    object2.name = "名字" + nodeDataArray[j].fields.length + 1;
                                    object2.info = wfprocusers[i].userid;
                                    object2.figure = "Rectangle";
                                    nodeDataArray[j].fields.push(object2);
                                    if (wfprocusers[i].procname != wfprocusers[i + 1].procname) {
                                        object1.from = wfprocusers[i].procname;
                                        object1.fromPort = "名字";
                                        object1.to = wfprocusers[i + 1].procname;
                                        object1.toPort = "名字";
                                        linkDataArray.push(object1)
                                    }
                                    break;
                                }
                            }
                            if (j == nodeDataArray.length) {
                                object.key = wfprocusers[i].procname;
                                object.fields = [];
                                object.fields[0] = {};
                                object.fields[0].name = "名字"
                                object.fields[0].info = wfprocusers[i].userid
                                object.fields[0].color = "#F7B84B";
                                object.fields[0].figure = "Rectangle";
                                if (i < wfprocusers.length - 1) {
                                    if (wfprocusers[i].procname != wfprocusers[i + 1].procname) {
                                        object1.from = wfprocusers[i].procname;
                                        object1.fromPort = "名字";
                                        object1.to = wfprocusers[i + 1].procname;
                                        object1.toPort = "名字";
                                        linkDataArray.push(object1)
                                    }
                                }
                                nodeDataArray.push(object);
                            }
                        }
                        myDiagram.model =
                            $(go.GraphLinksModel, {
                                linkFromPortIdProperty: "fromPort",
                                linkToPortIdProperty: "toPort",
                                nodeDataArray: nodeDataArray,
                                linkDataArray: linkDataArray
                            });
                    }, 1500)
                }
            }
        }
    }

    function agGridview($timeout, BaseService, $http, $filter) {
        return {
            restrict: 'EA',
            //require: "?ngModel",
            scope: {
                sgColumns: '=',
                sgOptions: '=',
                sgData: '='
            },
            link: function (scope, element, attrs) {
                console.log('agGridview link start');

                /** 日期接口*/
                function DateCellEditor() {
                    DateCellEditor.prototype.init = function (params) {
                        this.params = params;
                        $input = $("<INPUT type='text' class='editor-text' />");

                        if (params.column.colDef.cellchange) {
                            $input.on("change", params.column.colDef.cellchange);
                        }

                        this.textarea = $input[0];
                        if (params.value) {
                            params.value = params.value.substring(0, 10);
                        }

                        this.textarea.value = params.value;
                        $input.datepicker({
                            format: "yyyy-mm-dd",
                            todayBtn: true,
                            forceParse: true,
                            language: "zh-CN",
                            multidate: false,
                            autoclose: true,
                            todayHighlight: true,
                            beforeShow: function () {
                                calendarOpen = true
                            },
                            onClose: function () {
                                calendarOpen = false
                            }
                        });
                        $input.focus().select();
                        if (params.value == undefined) {
                            $input.data("datepicker").setDate("");
                        } else {
                            $input.data("datepicker").setDate(params.value);
                        }

                    };
                    DateCellEditor.prototype.onKeyDown = function (event) {
                        var key = event.which || event.keyCode;
                        if (key == constants_1.Constants.KEY_LEFT ||
                            key == constants_1.Constants.KEY_UP ||
                            key == constants_1.Constants.KEY_RIGHT ||
                            key == constants_1.Constants.KEY_DOWN ||
                            (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
                            event.stopPropagation();
                        }
                    };
                    DateCellEditor.prototype.getGui = function () {
                        return this.textarea;
                    };
                    DateCellEditor.prototype.afterGuiAttached = function () {
                        this.textarea.focus();
                        $input.select();
                    };
                    DateCellEditor.prototype.getValue = function () {
                        if (this.textarea.value == undefined) {
                            return ""
                        } else {
                            return this.textarea.value.substring(0, 10);
                            ;
                        }

                    };
                    DateCellEditor.prototype.destroy = function () {
                        this.params.api.stopEditing(false);
                        $.datepicker.dpDiv.stop(true, true);
                        $input.datepicker("hide");
                        $input.datepicker("destroy");
                        $input.remove();
                    };
                }

                /** 日期接口 时分秒*/
                function DatetimeCellEditor() {
                    DatetimeCellEditor.prototype.init = function (params) {
                        this.params = params;
                        $input = $("<INPUT type='text' class='editor-text' />");
                        if (params.column.colDef.cellchange) {
                            $input.on("change", params.column.colDef.cellchange);
                        }
                        this.textarea = $input[0];
                        this.textarea.value = params.value;
                        $input.datetimepicker({
                            format: "yyyy-mm-dd hh:ii:ss",
                            todayBtn: true,
                            forceParse: true,
                            startView: "month",
                            language: "zh-CN",
                            multidate: false,
                            autoclose: true,
                            todayHighlight: true,
                            beforeShow: function () {
                                calendarOpen = true
                            },
                            onClose: function () {
                                calendarOpen = false
                            }
                        });

                    };

                    DatetimeCellEditor.prototype.onKeyDown = function (event) {
                        var key = event.which || event.keyCode;
                        if (key == constants_1.Constants.KEY_LEFT ||
                            key == constants_1.Constants.KEY_UP ||
                            key == constants_1.Constants.KEY_RIGHT ||
                            key == constants_1.Constants.KEY_DOWN ||
                            (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
                            event.stopPropagation();
                        }
                    };

                    DatetimeCellEditor.prototype.getGui = function () {
                        $input.datetimepicker("show");
                        return this.textarea;
                    };
                    DatetimeCellEditor.prototype.afterGuiAttached = function () {
                        this.textarea.focus();
                        $input.select();
                    };
                    DatetimeCellEditor.prototype.getValue = function () {
                        if (this.textarea.value == undefined) {
                            return ""
                        } else {
                            return this.textarea.value;
                        }

                    };
                    DatetimeCellEditor.prototype.destroy = function () {
                        this.params.api.stopEditing(false);
                        //$.datetimepicker.dpDiv.stop(true, true);
                        $input.datetimepicker("hide");
                        $input.datetimepicker("destroy");
                        $input.remove();
                    };
                }

                //年月日渲染，值保有YYYY-MM-DD
                function DateRenderer(params) {
                    if (params.value != undefined) {
                        params.value = params.value.substring(0, 10);
                    }
                    return params.value || '';
                }

                /**-----------------------*/
                /**下拉框接口*/
                function SelectCellEditor() {
                    SelectCellEditor.prototype.init = function (params) {
                        this.params = params;
                        $eSelect = $('<div class="ag-cell-edit-input"><select class="ag-cell-edit-input"/></select></div>')
                        if (params.column.colDef.cellchange) {
                            $eSelect.on("input", params.column.colDef.cellchange);
                        }
                        /**if (params.column.colDef.onclick) {
					   $eSelect.on("click", params.column.colDef.onclick);
					}*/
                        var eSelect = this.getGui().querySelector('select');
                        var option = document.createElement('option');
                        option.value = 0;
                        option.text = "";
                        eSelect.appendChild(option);
                        for (var i = 0; i < params.values.length; i++) {
                            value = params.values[i];
                            if (typeof(value) == "object") {
                                var v = value.value;
                                var t = value.desc;
                            }
                            var option = document.createElement('option');
                            if (v == undefined || v == null) {
                                option.value = "";
                            } else {
                                option.value = isNaN(v) ? v : parseInt(v);
                            }
                            if (t == null) {
                                option.text = "";
                            } else {
                                option.text = t;
                            }

                            if (((params.value) == t) || (params.value) == v) {
                                option.selected = true;
                            }
                            eSelect.appendChild(option);
                        }
                    };
                    SelectCellEditor.prototype.getGui = function () {
                        return $eSelect[0];
                    };
                    SelectCellEditor.prototype.afterGuiAttached = function () {

                        var eSelect = this.getGui().querySelector('select');
                        eSelect.focus();
                    };
                    SelectCellEditor.prototype.addDestroyableEventListener = function () {
                    };
                    SelectCellEditor.prototype.getValue = function () {
                        var eSelect = this.getGui().querySelector('select');
                        return eSelect.value;
                    };
                    SelectCellEditor.prototype.destroy = function () {
                        this.params.api.stopEditing(false);
                        $eSelect.remove();

                    };
                }

                /**下拉框渲染*/
                function selectRenderer(params) {
                    if (params.column.colDef.onclick) {
                        $(params.eGridCell).on("click", params.column.colDef.onclick);
                    }
                    if (params.colDef.cellEditorParams) {
                        for (var i = 0; i < params.colDef.cellEditorParams.values.length; i++) {
                            if (params.colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                return params.colDef.cellEditorParams.values[i].desc;
                            }
                        }
                    }
                    if (params.columnApi.getRowGroupColumns()[0]) {
                        if (params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams) {
                            for (var i = 0; i < params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams.values.length; i++) {
                                if (params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                    return params.columnApi.getRowGroupColumns()[0].colDef.cellEditorParams.values[i].desc;
                                }
                            }
                        }
                    }
                    if (params.value != undefined) {
                        if (parseInt(params.value) == 0) {
                            return "";
                        } else {
                            if (params.value == "null") {
                                params.value = "";
                            }
                            return params.value
                        }
                    } else {
                        return "";
                    }
                }

                /**多选下拉框接口*/
                function chooseSelectCellEditor() {
                    chooseSelectCellEditor.prototype.init = function (params) {
                        var top = $(document).scrollLeft();
                        this.params = params;
                        var $eSelect = $("<div class='chosen-container chosen-container-single chosen-container-multi' style='width:100%;'></div>");
                        var $select_lists = $("<ul class='chosen-choices' style='border:none;border-bottom:1px solid #ccc;padding:0;'><a style='border-bottom:none;' class='chosen-single chosen-default multi-select'><span></span><div><b></b></div></a></ul>");
                        var $select_drop = $("<div class='chosen-drop'><ul class='chosen-results' style='border-top:1px solid positon:fixed #ccc;position: fixed;background:white;width:" + (this.params.column.actualWidth) + "px'></ul></div>");
                        $eSelect.append($select_lists).append($select_drop);

                        $select_lists.on("click", function (event) {
                            var l = $(this).offset();
                            $select_drop[0].childNodes[0].style.width = (this.clientWidth) + "px";
                            $eSelect.toggleClass('chosen-with-drop');
                            if ($eSelect.attr('class').indexOf('chosen-with-drop') > -1) {
                                $($select_drop[0].childNodes[0]).offset({
                                    left: l.left
                                });
                            } else {
                                $($select_drop[0].childNodes[0]).offset({
                                    left: 1000001
                                });
                            }
                            //s.left=l.left;
                            //$select_drop[0].style.marginLeft=(l.left-s.left+1)+"px";
                            stop(event);

                        });

                        function stop(event) {
                            var e = window.event || event;
                            if (e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器
                                e.stopPropagation();
                            } else {
                                window.event.cancelBubble = true; // 兼容IE的方式来取消事件冒泡
                            }
                        }

                        var list = "";
                        for (var i = 0; i < params.values.length; i++) {
                            list += "<li class='active-result' data-id='" + params.values[i].value + "'>" +
                                "<i class='fa fa-check hide'></i>" +
                                "<span title='" + params.values[i].desc + "'>" + params.values[i].desc + "</span>" +
                                "</li>";
                            $select_drop.children().html("").append(list);
                            $select_drop.find("li").on("click", function (event) { //选中某一个
                                //                      console.log($(this).attr("data-id"));
                                all_stat = false;
                                var select_id = $(this).attr("data-id");
                                $(this).find("i").toggleClass("hide");
                                var val_list = [];
                                var desc_list = [];
                                $select_drop.find("li.active-result").each(function () {
                                    if (!$(this).find("i").hasClass("hide")) {
                                        val_list.push($(this).attr('data-id'));
                                        desc_list.push($(this).find("span").html());
                                    }
                                });
                                var _this_val = HczyCommon.appendComma(val_list);
                                //this.params.value = _this_val;
                                $eSelect[0].value = _this_val;
                                var _this_desc = HczyCommon.appendComma(desc_list);
                                $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                                stop(event);
                            });
                        }

                        function checksel(params) {
                            var a = params.value;
                            if (a != undefined) {
                                var val_list = [];
                                if ($.trim(a)) {
                                    if (String(a).indexOf(",") > -1) val_list = a.split(",");
                                    else val_list.push(a);
                                }
                                $select_drop.find("li.active-result").find("i").addClass("hide");
                                var desc_list = [];
                                $select_drop.find("li.active-result").each(function () {
                                    var id = $(this).attr("data-id");
                                    for (var i = 0; i < val_list.length; i++) {
                                        if (val_list[i] == id) {
                                            $(this).find("i").removeClass("hide");
                                        }
                                    }

                                    if (!$(this).find("i").hasClass("hide")) {
                                        desc_list.push($(this).find("span").html());
                                    }
                                });
                                var _this_desc = HczyCommon.appendComma(desc_list);
                                params.desc = _this_desc;
                                $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                            } else {
                                $select_lists.find("a").find("span").attr("title", _this_desc).html("");
                                $select_drop.find("li.active-result").find("i").addClass("hide");
                            }
                        }

                        checksel(params);
                        this.eSelect = $eSelect[0];
                        $eSelect[0].value = params.value;

                    };
                    chooseSelectCellEditor.prototype.getGui = function () {
                        return this.eSelect;
                    };
                    chooseSelectCellEditor.prototype.afterGuiAttached = function () {

                        $(this.eSelect).focus();
                    };
                    chooseSelectCellEditor.prototype.addDestroyableEventListener = function () {
                    };
                    chooseSelectCellEditor.prototype.getValue = function () {
                        return this.eSelect.value;
                    };
                    chooseSelectCellEditor.prototype.destroy = function () {
                        this.params.api.stopEditing(false);
                        $(this.eSelect).remove();
                    };
                }

                /**多选下拉框渲染*/
                function chooseSelectRenderer(params) {
                    if (params.column.colDef.onclick) {
                        $(params.eGridCell).on("click", params.column.colDef.onclick);
                    }
                    params.value += "";
                    if (params.value == "" || params.value == undefined) {
                        return "";
                    }
                    var str = "";
                    if (params.colDef.cellEditorParams) {
                        for (var i = 0; i < params.colDef.cellEditorParams.values.length; i++) {
                            if (params.value.indexOf(',') > -1) {
                                var list = params.value.split(",");
                                for (var j = 0; j < list.length; j++) {
                                    if (params.colDef.cellEditorParams.values[i].value == parseInt(list[j])) {
                                        if (j == list.length - 1) {
                                            str += params.colDef.cellEditorParams.values[i].desc
                                        } else {
                                            str += params.colDef.cellEditorParams.values[i].desc + ',';
                                        }

                                    }
                                }
                            } else {
                                if (params.colDef.cellEditorParams) {
                                    for (var i = 0; i < params.colDef.cellEditorParams.values.length; i++) {
                                        if (params.colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                            return params.colDef.cellEditorParams.values[i].desc;
                                        }
                                    }
                                }
                            }

                        }
                        return str;
                    }
                }

                /** 弹出框*/
                function ButtonCellEditor() {
                    ButtonCellEditor.prototype.init = function (params) {
                        $div = $('<div  tabindex="0"><div class="input-group" style="width:100%;height:100%;"></div></div>')
                        this.params = params;
                        this.input = document.createElement("INPUT");
                        this.input.className = "input-sm form-control"
                        if (this.params.column.colDef.non_readonly) {
                            this.input.readOnly = false;
                        } else {
                            this.input.readOnly = true;
                        }
                        if (params.value != undefined) {
                            this.input.value = params.value;
                        }
                        this.input.focus();
                        $div.select();
                        if (params.column.colDef.cellchange) {
                            $div.on("input", params.column.colDef.cellchange);
                        }
                        this.A = document.createElement("A");
                        this.A.className = "input-group-addon"
                        if (this.params.column.colDef.action != undefined) {
                            this.A.addEventListener("click", this.params.column.colDef.action);
                        }
                        this.I = document.createElement("I");
                        this.I.className = "fa fa-ellipsis-h"

                        this.getGui().querySelector('.input-group').appendChild(this.input);
                        this.getGui().querySelector('.input-group').appendChild(this.A);
                        this.getGui().querySelector('.input-group-addon').appendChild(this.I);
                    };
                    ButtonCellEditor.prototype.getGui = function () {
                        return $div[0];
                    };

                    ButtonCellEditor.prototype.afterGuiAttached = function () {
                        this.input.focus();
                        $div.select();
                    };
                    ButtonCellEditor.prototype.addDestroyableEventListener = function () {
                    };
                    ButtonCellEditor.prototype.getValue = function () {
                        return this.input.value;
                    };
                }

                /**文本框*/
                function TextCellEditor() {
                }

                TextCellEditor.prototype.init = function (params) {

                    this.params = params;
                    this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = true;
                    /**this.params.api.gridPanel.eAllCellContainers.forEach(function(container){
                container.removeEventListener("keydown");
            })*/
                        //this.params.api.gridOptionsWrapper.gridOptions.suppressCellSelection=true;
                    var temp = this.params.api.getFocusedCell();
                    $input = $('<input class="ag-cell-edit-input" index="' + temp.rowIndex + '" type="text"/>');
                    if (params.column.colDef.cellchange) {
                        $input.on("input", params.column.colDef.cellchange);
                    }
                    if (params.column.colDef.onclick) {
                        $input.on("click", params.column.colDef.onclick);
                    }

                    this.textarea = $input[0];
                    if (params.charPress) {
                        this.textarea.value = params.charPress;
                    } else {
                        if (params.value !== undefined && params.value !== null) {
                            this.textarea.value = params.value;
                        }
                        if (this.params.keyPress == 2) {
                            this.textarea.focus();
                        } else {
                            this.textarea.focus();
                            $input.select();
                        }
                    }
                };
                TextCellEditor.prototype.onKeyDown = function (event) {
                    var key = event.which || event.keyCode;
                    if (key == constants_1.Constants.KEY_LEFT ||
                        key == constants_1.Constants.KEY_UP ||
                        key == constants_1.Constants.KEY_RIGHT ||
                        key == constants_1.Constants.KEY_DOWN ||
                        (event.shiftKey && key == constants_1.Constants.KEY_ENTER)) {
                        event.stopPropagation();
                    }
                };
                TextCellEditor.prototype.getGui = function () {
                    return this.textarea;
                };
                TextCellEditor.prototype.afterGuiAttached = function () {
                    if (this.params.keyPress == 2) {
                        this.textarea.focus();
                    } else {
                        this.textarea.focus();
                        $input.select();

                    }
                };
                TextCellEditor.prototype.isCancelBeforeStart = function () {
                    return this.cancelBeforeStart;
                };
                TextCellEditor.prototype.getValue = function () {

                    return this.textarea.value;
                };
                TextCellEditor.prototype.destroy = function () {
                    this.params.api.stopEditing(false);
                    $input.remove();
                    this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = false;
                    //this.params.api.gridOptionsWrapper.gridOptions.suppressCellSelection=false;
                    this.textarea.style.color = "red";
                };

                /**编辑框*/
                function buttonRenderer(params) {
                    this.params = params;
                    $button = $('<button class="btn btn-sm btn-info dropdown-toggle" style="padding-top: 0px;padding-bottom: 0px">编辑</button>');
                    this.button = $button[0];
                    if (params.column.colDef.action) {
                        this.button.addEventListener("click", params.column.colDef.action);
                    }
                    return this.button;
                }

                /**编辑框*/
                function aRenderer(params) {
                    this.params = params;
                    if (this.params.data) {
                        $button = $('<a href="#/crmman/' + this.params.data.nextStat + '?param=' + this.params.data.url_param + '"  class="text-info ng-binding">详情</a>');
                        this.A = $button[0];
                        return this.A;
                    }
                }

                /*保存框*/
                function saveRenderer(params) {
                    this.params = params;
                    $button = $('<button class="btn btn-sm btn-info dropdown-toggle" style="padding-top: 0px;padding-bottom: 0px" type="button">保存</button>');
                    this.button = $button[0];
                    if (params.column.colDef.buttonclick) {
                        this.button.addEventListener("click", params.column.colDef.buttonclick);
                    }
                    return this.button;
                }

                /**-------------整数框------------*/
                function getCharCodeFromEvent(event) {
                    event = event || window.event;
                    return (typeof event.which == "undefined") ? event.keyCode : event.which;
                }

                function isCharNumeric(charStr) {
                    return /^(0|[1-9][0-9]*|-[1-9][0-9]*|-*)$/.test(charStr);
                }

                function isKeyPressedNumeric(event) {
                    var charCode = getCharCodeFromEvent(event);
                    var charStr = String.fromCharCode(charCode);
                    return isCharNumeric(charStr);
                }

                function NumericCellEditor() {
                }

                NumericCellEditor.prototype.init = function (params) {
                    this.params = params;
                    this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = true;
                    var temp = this.params.api.getFocusedCell();
                    $input = $('<input class="ag-cell-edit-input" index="' + temp.rowIndex + '" type="number"/>');
                    if (params.column.colDef.cellchange) {
                        $input.on("input", params.column.colDef.cellchange);
                    }
                    if (params.column.colDef.cellEditingStopped) {
                        $input.on("blur", params.column.colDef.cellEditingStopped);
                    }

                    this.eInput = $input[0];
                    if (params.value != undefined) {
                        this.eInput.value = params.value;
                    }
                    if (this.params.keyPress == 2) {
                        this.eInput.focus();
                    } else {
                        this.eInput.focus();
                        $input.select();

                    }
                    var that = this;
                    this.eInput.addEventListener('keypress', function (event) {
                        if (!isKeyPressedNumeric(event)) {
                            that.eInput.focus();
                            if (event.preventDefault) event.preventDefault();
                        }
                    });
                    var charPressIsNotANumber = params.charPress && ('1234567890'.indexOf(params.charPress) < 0);
                    this.cancelBeforeStart = charPressIsNotANumber;

                };
                NumericCellEditor.prototype.getGui = function () {
                    return this.eInput;
                };
                NumericCellEditor.prototype.afterGuiAttached = function () {
                    if (this.params.keyPress == 2) {
                        this.eInput.focus();
                    } else {
                        this.eInput.focus();
                        $input.select();

                    }

                };
                NumericCellEditor.prototype.isCancelBeforeStart = function () {
                    return this.cancelBeforeStart;
                };
                NumericCellEditor.prototype.isCancelAfterEnd = function () {
                    //var value = this.getValue();
                    return false;
                };
                NumericCellEditor.prototype.getValue = function () {
                    return parseInt(this.eInput.value || 0);

                };
                NumericCellEditor.prototype.isPopup = function () {
                    return false;
                };
                NumericCellEditor.prototype.destroy = function () {
                    this.params.api.stopEditing(false);
                    $input.remove();
                    this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = false;
                };

                /**-------------------------*/

                /**-------------浮点框------------*/
                function FloatCellEditor() {
                }

                FloatCellEditor.prototype.init = function (params) {
                    this.params = params;
                    this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = true;
                    var temp = this.params.api.getFocusedCell();
                    $input = $('<input class="ag-cell-edit-input"  index="' + temp.rowIndex + '" type="number"/>');

                    this.eInput = $input[0];
                    if (params.value != undefined) {
                        this.eInput.value = params.value;
                    }
                    if (this.params.keyPress == 2) {
                        this.eInput.focus();
                    } else {
                        this.eInput.focus();
                        $input.select();

                    }
                    var that = this;
                    $input.bind("keydown.nav", function (e) {
                        if (e.keyCode === $.ui.keyCode.LEFT || e.keyCode === $.ui.keyCode.RIGHT) {
                            e.stopImmediatePropagation();
                        }
                        if ((e.keyCode == 190)) {
                            $input.unbind("input", params.column.colDef.cellchange);
                        } else {
                            if (params.column.colDef.cellchange) {
                                $input.on("input", params.column.colDef.cellchange);
                            }
                        }
                    });
                    $input.on('mousewheel.disableScroll', function (e) {
                        e.preventDefault();
                    });
                    $input.on('blur', function (e) {
                        $(this).off('mousewheel.disableScroll');
                    });
                };
                FloatCellEditor.prototype.getGui = function () {
                    return this.eInput;
                };
                FloatCellEditor.prototype.afterGuiAttached = function () {
                    if (this.params.keyPress == 2) {
                        this.eInput.focus();
                    } else {
                        this.eInput.focus();
                        $input.select();

                    }
                };
                FloatCellEditor.prototype.isCancelBeforeStart = function () {
                    return this.cancelBeforeStart;
                };
                FloatCellEditor.prototype.isCancelAfterEnd = function () {
                    return false;
                };
                FloatCellEditor.prototype.getValue = function () {
                    return parseFloat(this.eInput.value || 0)
                };
                FloatCellEditor.prototype.isPopup = function () {
                    return false;
                };
                FloatCellEditor.prototype.destroy = function () {
                    $input.remove();
                    this.params.api.gridOptionsWrapper.gridOptions.suppressContextMenu = false;
                };

                /**-------------------------*/

                /**-------------复选框------------*/
                function CheckboxCellEditor() {
                }

                CheckboxCellEditor.prototype.init = function (params) {

                    $checkbox = $('<input class="ag-cell-edit-input" type="checkbox" />');
                    if (params.column.colDef.cellchange) {
                        $checkbox.on("change", params.column.colDef.cellchange);
                    }
                    this.eInput = $checkbox[0];
                    if (params.column.colDef.checkbox_value) {
                        if (parseInt(params.value) == params.column.colDef.checkbox_value) {
                            this.eInput.value = params.value;
                            this.eInput.checked = true
                        } else {
                            this.eInput.value = params.value;
                            this.eInput.checked = false
                        }
                    } else {
                        if (params.value != undefined) {
                            if (parseInt(params.value) == 2) {
                                this.eInput.value = params.value;
                                this.eInput.checked = true
                            } else {
                                this.eInput.value = params.value;
                                this.eInput.checked = false
                            }
                        }
                    }
                    var that = this;
                    CheckboxCellEditor.prototype.getValue = function () {
                        if ($checkbox.prop('checked')) {
                            if (params.column.colDef.checkbox_value) {
                                return params.column.colDef.checkbox_value;
                            } else {
                                return 2;
                            }
                        } else {
                            if (params.column.colDef.checkbox_value == 1) {
                                return 0
                            } else {
                                return 1;
                            }

                        }
                        ;
                    };
                };
                CheckboxCellEditor.prototype.getGui = function () {
                    return this.eInput;
                };
                CheckboxCellEditor.prototype.afterGuiAttached = function () {
                    this.eInput.focus();
                };

                CheckboxCellEditor.prototype.isPopup = function () {
                    return false;
                };

                //复选框渲染
                function CheckboxRenderer(params) {
                    if (params.column.colDef.checkbox_value) {
                        if (parseInt(params.value) == params.column.colDef.checkbox_value) {
                            return "<img style='positon:center' src='../img/tick.png'>";
                        } else {
                            return "";
                        }
                    } else {
                        if (parseInt(params.value) == 2) {
                            return "<img style='positon:center' src='../img/tick.png'>";
                        } else {
                            return "";
                        }
                    }
                }

                function currencyCssFunc(params) {
                    return {
                        "color": "red",
                        "text-align": "right",
                        "font-weight": "bold"
                    };

                }

                //树状结构样式
                function innerCellRenderer(params) {
                    if (params.column.colDef.onclick) {
                        $(params.eGridCell).on("click", params.column.colDef.onclick);
                    }
                    //return "<img style='positon:center'style='padding-left: 4px;' src='../img/tick.png'>" + params.data[params.colDef.field];
                    return params.data[params.colDef.field];
                    ;
                }

                //千分位
                function NumberRenderer(params) {
                    if (params.column.colDef.dblclick) {
                        $(params.eGridCell).on("dblclick", params.column.colDef.dblclick);
                    }
                    if (params.data && params.data[params.colDef.field] && params.data[params.colDef.field].value) {
                        params.value = params.data[params.colDef.field].value;
                    }
                    if (params.value === null || params.value === undefined) {
                        return null;
                    } else if (isNaN(params.value)) {
                        return 'NaN';
                    } else {
                        if (parseInt(params.value) == params.value)
                            return $filter('number')(parseInt(params.value), 0);
                        else
                            return $filter('number')(params.value, 2);
                    }
                }

                /**-------------------------*/
                //导出excel
                function getContextMenuItems(params) {
                    var result = params.defaultItems.splice(0);
                    result.push({
                        name: '导出excel',
                        icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                        //shortcut: 'Alt + M',
                        action: function () {
                            /**var value = params.value ? params.value : '<empty>';
                             var filename = "导出数据.xls";

                             var nodes = scope.sgOptions.api.getModel().rootNode.allLeafChildren;
                             var data = [];
                             for (var i = 0; i < nodes.length; i++) {
						    data.push(nodes[i].data);
						}

                             var result = scope.sgOptions.columnApi.getAllGridColumns();
                             var temp_columns = [];
                             for (var i = 0; i < result.length; i++) {
						    temp_columns.push(result[i].colDef);
						    if (result[i].colDef.cellRenderer && result[i].colDef.cellRenderer.toString() == "function (params) {return DateRenderer(params)}") {
						        for (var j = 0; j < data.length; j++) {
						            data[j][result[i].colDef.field] = data[j][result[i].colDef.field].substring(0, 10);
						        }
						    }
						}


                             /**if(!data.length){
						    BaseService.notice("没有需要导出的数据!","alert-warning");
						    return;
						}

                             for (var i = 0; i < temp_columns.length; i++) {
						    temp_columns[i].name = temp_columns[i].headerName;
						    temp_columns[i].width = Math.ceil(result[i].actualWidth / 14);
						    if (temp_columns[i].cellEditor && temp_columns[i].cellEditor.name) {
						        if (temp_columns[i].cellEditor.name == "DateCellEditor") {
						            temp_columns[i].type = "date";
						        } else if (temp_columns[i].cellEditor.name == "SelectCellEditor") {
						            temp_columns[i].type = "number";
						            temp_columns[i].options = temp_columns[i].cellEditorParams.values;
						        } else if (temp_columns[i].cellEditor.name == "NumericCellEditor" || temp_columns[i].cellEditor.name == "FloatCellEditor") {
						            temp_columns[i].type = "number";
						        } else {
						            temp_columns[i].type = "string";
						        }
						    } else {
						        temp_columns[i].type = "string";
						    }
						}

                             $http({
						        method: 'post',
						        url: '/exportexcel',
						        data: {
						            export_cols: temp_columns,
						            export_sum_cols: [],
						            export_datas: data
						        },
						        params: { id: Math.random() },
						        responseType: "arraybuffer"
						    })
                             .success(function(response, status, xhr, config) {

						        var data = new Blob([response], { type: 'application/vnd.ms-excel' });
						        saveAs(data, filename);
						    }).error(function(response) {

						        BaseService.notice("数据处理异常!", "alert-warning");
						    });*/
                            var params = {};
                            params.processCellCallback = function (params) {
                                if (params.column.colDef.cellEditorParams) {
                                    for (var i = 0; i < params.column.colDef.cellEditorParams.values.length; i++) {
                                        if (params.column.colDef.cellEditorParams.values[i].value == parseInt(params.value)) {
                                            return params.column.colDef.cellEditorParams.values[i].desc;
                                        }
                                    }
                                } else {
                                    return params.value
                                }
                            };
                            scope.sgOptions.api.exportDataAsExcel(params);
                        }
                    });
                    result.push({
                        name: '选中多行',
                        icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                        shortcut: 'Alt + M',
                        action: function () {
                            var cellRanges = scope.sgOptions.api.clipboardService.rangeController.cellRanges;
                            var nodes = scope.sgOptions.api.getModel().rootNode.childrenAfterSort;
                            for (var i = cellRanges[0].start.rowIndex; i < cellRanges[0].end.rowIndex + 1; i++) {
                                if (nodes[cellRanges[0].end.rowIndex].selected == true) {
                                    scope.sgOptions.api.clipboardService.selectionController.selectedNodes[nodes[i].id] = undefined;
                                    nodes[i].selected = false
                                } else {
                                    scope.sgOptions.api.clipboardService.selectionController.selectedNodes[nodes[i].id] = nodes[i];
                                    ;
                                    nodes[i].selected = true
                                }
                                ;
                            }
                            scope.sgOptions.api.refreshRows(nodes);
                        }
                    });
                    result.push({
                        name: '自适应高度(还原)',
                        icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                        shortcut: 'Alt + L',
                        action: function () {
                            function getTreeL(nodes) {
                                var L = 0;

                                function getlength(nodesC) {
                                    for (var i = 0; i < nodesC.length; i++) {
                                        if (nodesC[i].expanded) {
                                            L = L + nodesC[i].childrenAfterGroup.length;
                                            getlength(nodesC[i].childrenAfterGroup)
                                        }
                                    }

                                }

                                getlength(nodes);
                                return L;
                            }

                            var nodes = scope.sgOptions.api.getModel().rootNode.childrenAfterGroup;
                            var treeL = getTreeL(nodes);
                            var l = 25 * (nodes.length + treeL + 2);
                            if (parseInt(element[0].style.height) != l) {
                                scope.height = element[0].style.height;
                                element[0].style.height = l + 'px';
                            } else {
                                element[0].style.height = scope.height;
                            }
                            scope.sgOptions.api.doLayout();
                        }
                    });
                    if (scope.sgOptions.contextMenuArray) {
                        for (var i = 0; i < scope.sgOptions.contextMenuArray.length; i++) {
                            result.push(scope.sgOptions.contextMenuArray[i]);
                        }
                    }
                    return result;
                }

                //选中多行
                function doSelectRow(params) {
                    var result = params.defaultItems.splice(0);
                    result.push({
                        name: '选中多行',
                        icon: '<img src="../img/tick.png" style="width: 14px;"/>',
                        //shortcut: 'Alt + M',
                        action: function () {

                        }
                    });

                    return result;
                }

                /**刷新所有的网格值*/

                var filename = attrs["filename"] || "导出数据.xls";

                if (!scope.sgOptions) {
                    console.error("未定义网格列/属性");
                    return;
                }
                /**自定义接口框具体实现*/
                for (var i = 0; i < scope.sgColumns.length; i++) {
                    if (scope.sgColumns[i].children) {
                        for (var j = 0; j < scope.sgColumns[i].children.length; j++) {
                            if (scope.sgColumns[i].children[j].cellEditor == "年月日") {
                                scope.sgColumns[i].children[j].cellEditor = DateCellEditor;
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return DateRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellEditor == "时分秒") {
                                scope.sgColumns[i].children[j].cellEditor = DatetimeCellEditor;
                            } else if (scope.sgColumns[i].children[j].cellEditor == "下拉框") {
                                scope.sgColumns[i].children[j].cellEditor = SelectCellEditor;
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return selectRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellEditor == "弹出框") {
                                scope.sgColumns[i].children[j].cellEditor = ButtonCellEditor;
                            } else if (scope.sgColumns[i].children[j].cellEditor == "文本框") {
                                scope.sgColumns[i].children[j].cellEditor = TextCellEditor;
                            } else if (scope.sgColumns[i].children[j].cellEditor == "整数框") {
                                scope.sgColumns[i].children[j].cellStyle = {
                                    'text-align': 'right'
                                };
                                scope.sgColumns[i].children[j].cellEditor = NumericCellEditor;
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return NumberRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellEditor == "浮点框") {
                                scope.sgColumns[i].children[j].cellStyle = {
                                    'text-align': 'right'
                                };
                                scope.sgColumns[i].children[j].cellEditor = FloatCellEditor;
                                if (!scope.sgColumns[i].children[j].cellRenderer) {
                                    scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                        return NumberRenderer(params)
                                    };
                                }

                            } else if (scope.sgColumns[i].children[j].cellEditor == "复选框") {
                                scope.sgColumns[i].children[j].cellEditor = CheckboxCellEditor;
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return CheckboxRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellEditor == "树状结构") {
                                //scope.sgColumns[i].children[j].cellRenderer='group';
                                //scope.sgColumns[i].children[j].cellRendererParams.innerRenderer=function(params){return innerCellRenderer(params)};
                            } else if (scope.sgColumns[i].children[j].cellRenderer == "编辑框渲染") {
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return buttonRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellRenderer == "链接渲染") {
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return aRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellRenderer == "保存框渲染") {
                                scope.sgColumns[i].children[j].cellRenderer = function (params) {
                                    return saveRenderer(params)
                                };
                            } else if (scope.sgColumns[i].children[j].cellEditor == "选择框") {
                                scope.sgColumns[i].children[j].checkboxSelection = function (params) {
                                    return params.columnApi.getRowGroupColumns().length === 0
                                };
                                scope.sgColumns[i].children[j].headerCellTemplate = function () {
                                    var eCell = document.createElement('span');
                                    eCell.innerHTML = '<div style="text-align: left;"><span id="myMenuButton" class="ag-selection-checkbox"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRkJCRDU1MTEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRkJCRDU1MDEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+riMaEQAAAL5JREFUeNqUks0JhDAQhSd7tgtLMDUIyTXF2IdNWIE3c0ruYg9LtgcPzvpEF8SfHR8MGR75hpcwRERmrjQXCyutDKUQAkuFu2AUpsyiJ1JK0UtycRgGMsbsPBFYVRVZaw/+7Zu895znOY/j+PPWT7oGp2lirTU3TbPz/4IAAGLALeic47Ztlx7RELHrusPAAwgoy7LlrOuay7I8TXIadYOLouC+7+XgBiP2lTbw0crFGAF9ANq1kS75G8xXgAEAiqu9OeWZ/voAAAAASUVORK5CYII=" style="display: none;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkU1Rjk1NDExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkU1Rjk1MzExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+t+CXswAAAFBJREFUeNrsksENwDAIA023a9YGNqlItkixlAFIn1VOMv5wvACAOxOZWUwsB6Gqswp36QivJNhBRHDhI0f8j9jNrCy4O2twNMobT/7QeQUYAFaKU1yE2OfhAAAAAElFTkSuQmCC" style="display: inline;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMjU4MzhGQjEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMjU4MzhGQTEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2Xml2QAAAGBJREFUeNpiYGBg8ATiZ0D8n0j8DKqH4dnhw4f/EwtAakF6GEGmAAEDKYCRkZGBiYFMQH+NLNjcjw2ghwMLIQWDx48Do/H5kSNHiNZw9OhREPUCRHiBNJOQyJ+A9AAEGACqkFldNkPUwwAAAABJRU5ErkJggg==" style="display: none;"></span></div>'
                                    var eMenuButton = eCell.querySelector('#myMenuButton');
                                    eMenuButton.addEventListener('click', function () {
                                        scope.sgOptions.api.selectAll();
                                    });
                                }
                            }
                        }
                    } else {
                        if (scope.sgColumns[i].cellEditor == "年月日") {
                            scope.sgColumns[i].cellEditor = DateCellEditor;
                            scope.sgColumns[i].filter = 'date';
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return DateRenderer(params)
                            };
                        } else if (scope.sgColumns[i].cellEditor == "时分秒") {
                            scope.sgColumns[i].cellEditor = DatetimeCellEditor;
                            scope.sgColumns[i].filter = 'date';
                        } else if (scope.sgColumns[i].cellEditor == "下拉框") {
                            scope.sgColumns[i].cellEditor = SelectCellEditor;
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return selectRenderer(params)
                            };
                            scope.sgColumns[i].filter = 'set';
                        } else if (scope.sgColumns[i].cellEditor == "多选下拉框") {
                            scope.sgColumns[i].cellEditor = chooseSelectCellEditor;
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return chooseSelectRenderer(params)
                            };
                            scope.sgColumns[i].filter = 'set';
                        } else if (scope.sgColumns[i].cellEditor == "弹出框") {
                            scope.sgColumns[i].cellEditor = ButtonCellEditor;
                            scope.sgColumns[i].filter = 'text';
                            scope.sgColumns[i].filterParams = {
                                defaultOption: 'Contains'
                            }
                        } else if (scope.sgColumns[i].cellEditor == "文本框") {
                            scope.sgColumns[i].cellEditor = TextCellEditor;
                            //scope.sgColumns[i].cellRenderer=function(params){return refreshRender(params)};;
                            scope.sgColumns[i].filter = 'text';
                            scope.sgColumns[i].filterParams = {};
                            scope.sgColumns[i].filterParams.filterOptions = ['contains', 'notContains', 'startsWith', 'endsWith' /**,'equals', 'notEqual'*/];
                            scope.sgColumns[i].filterParams.defaultoption = 'contains';
                        } else if (scope.sgColumns[i].cellEditor == "整数框") {
                            scope.sgColumns[i].filter = 'number';
                            scope.sgColumns[i].cellStyle = {
                                'text-align': 'right'
                            };
                            scope.sgColumns[i].cellEditor = NumericCellEditor;
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return NumberRenderer(params)
                            };
                            ;
                        } else if (scope.sgColumns[i].cellEditor == "浮点框") {
                            scope.sgColumns[i].cellStyle = {
                                'text-align': 'right'
                            };
                            scope.sgColumns[i].cellEditor = FloatCellEditor;
                            if (!scope.sgColumns[i].cellRenderer) {
                                scope.sgColumns[i].cellRenderer = function (params) {
                                    return NumberRenderer(params)
                                };
                            }
                            ;
                            scope.sgColumns[i].filter = 'number';
                        } else if (scope.sgColumns[i].cellEditor == "复选框") {
                            scope.sgColumns[i].cellEditor = CheckboxCellEditor;
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return CheckboxRenderer(params)
                            };
                            scope.sgColumns[i].filter = 'set';
                        } else if (scope.sgColumns[i].cellEditor == "树状结构") {
                            scope.sgColumns[i].cellRenderer = 'group';
                            scope.sgColumns[i].cellRendererParams = {};

                            scope.sgColumns[i].cellRendererParams.innerRenderer = function (params) {
                                return innerCellRenderer(params)
                            };
                            for (var j = 0; j < scope.sgColumns.length; j++) {
                                scope.sgColumns[j].cellStyle = function (params) {
                                    if (!params.node.childrenAfterGroup) {
                                        if (!params.node.parent) {
                                            return {
                                                fontStyle: 'normal'
                                            };
                                        } else {
                                            return {
                                                fontStyle: 'italic'
                                            };
                                        }

                                    } else {
                                        return {
                                            fontStyle: 'normal'
                                        };
                                    }
                                };
                            }

                        } else if (scope.sgColumns[i].cellRenderer == "编辑框渲染") {
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return buttonRenderer(params)
                            };
                            ;
                        } else if (scope.sgColumns[i].cellRenderer == "链接渲染") {
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return aRenderer(params)
                            };
                            ;
                        } else if (scope.sgColumns[i].cellRenderer == "保存框渲染") {
                            scope.sgColumns[i].cellRenderer = function (params) {
                                return saveRenderer(params)
                            };
                        }
                    }

                }
                // 全选
                // if (scope.sgOptions.selectAll) {
                //     scope.sgColumns[0].checkboxSelection = function () {
                //         return function (params) {
                //             return params.columnApi.getRowGroupColumns().length === 0
                //         }
                //     };
                //     scope.sgColumns[0].headerCheckboxSelection = function (params) {
                //         // we put checkbox on the name if we are not doing grouping
                //         return params.columnApi.getRowGroupColumns().length === 0;
                //     };
                //     scope.sgColumns[0].headerCheckboxSelectionFilteredOnly = true;
                //     /**scope.sgColumns[0].headerCellTemplate = function() {
                //     var eCell = document.createElement('span');
                //     eCell.innerHTML = '<div style="text-align: left;"><span id="myMenuButton" class="selectAll"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpBRkJCRDU1MTEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpBRkJCRDU1MDEyM0ExMUU2ODE4MUUyOTNBNTRGQkIxNyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+riMaEQAAAL5JREFUeNqUks0JhDAQhSd7tgtLMDUIyTXF2IdNWIE3c0ruYg9LtgcPzvpEF8SfHR8MGR75hpcwRERmrjQXCyutDKUQAkuFu2AUpsyiJ1JK0UtycRgGMsbsPBFYVRVZaw/+7Zu895znOY/j+PPWT7oGp2lirTU3TbPz/4IAAGLALeic47Ztlx7RELHrusPAAwgoy7LlrOuay7I8TXIadYOLouC+7+XgBiP2lTbw0crFGAF9ANq1kS75G8xXgAEAiqu9OeWZ/voAAAAASUVORK5CYII=" style="display: none;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2MkU1Rjk1NDExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2MkU1Rjk1MzExNDExMUU2ODhEQkMyRTJGOUNGODYyQyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjI1MkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+t+CXswAAAFBJREFUeNrsksENwDAIA023a9YGNqlItkixlAFIn1VOMv5wvACAOxOZWUwsB6Gqswp36QivJNhBRHDhI0f8j9jNrCy4O2twNMobT/7QeQUYAFaKU1yE2OfhAAAAAElFTkSuQmCC" style="display: inline;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0VGQkU3ODM4MTFFNjExQjlCQzhERUVDNkNGMzFDMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpGMjU4MzhGQjEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpGMjU4MzhGQTEyM0ExMUU2QjAxM0Q2QjZFQ0IzNzM4NiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzMkM4M0M1M0MxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVDRUZCRTc4MzgxMUU2MTFCOUJDOERFRUM2Q0YzMUMzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+2Xml2QAAAGBJREFUeNpiYGBg8ATiZ0D8n0j8DKqH4dnhw4f/EwtAakF6GEGmAAEDKYCRkZGBiYFMQH+NLNjcjw2ghwMLIQWDx48Do/H5kSNHiNZw9OhREPUCRHiBNJOQyJ+A9AAEGACqkFldNkPUwwAAAABJRU5ErkJggg==" style="display: none;margin-top:3px"></span><span id="agHeaderCellLabel">' +
                //         '      <span id="agText" ></span>' +
                //         '      <span id="agSortAsc"><i class="fa fa-long-arrow-down"></i></span>' +
                //         '      <span id="agSortDesc"><i class="fa fa-long-arrow-up"></i></span>' +
                //         '      <span id="agNoSort"></span>' +
                //         '      <span id="agFilter"><i class="fa fa-filter"></i></span>' +
                //         '    </span><div>'
                //     var eMenuButton = eCell.querySelector('#myMenuButton');
                //     eMenuButton.addEventListener('click', function() {
                //         var eMenuButton = eCell.querySelector('#myMenuButton');
                //         if (eMenuButton.children[0].attributes.style.nodeValue == "display: none;") {
                //             scope.sgOptions.api.selectAll();
                //             eMenuButton.children[0].attributes.style.nodeValue = "display: inline;"
                //             eMenuButton.children[1].attributes.style.nodeValue = "display: none;"
                //         } else {
                //             scope.sgOptions.api.deselectAll();
                //             eMenuButton.children[1].attributes.style.nodeValue = "display: inline;"
                //             eMenuButton.children[0].attributes.style.nodeValue = "display: none;"
                //         }
                //
                //     });
                //     return eCell;
                // }*/
                // }

                if (!scope.sgOptions.fixedGridHeight) {
                    if (element.height() < 250) element.height(250);
                }

                var grid;
                var auto_height = attrs['autoheight'] || 'none';
                if (auto_height == "auto") {
                    var old_height = element[0].offsetHeight;

                    function getTop(e) {
                        var offset = e.offsetTop;
                        if (e.offsetParent != null) offset += getTop(e.offsetParent);
                        return offset;
                    }

                    var offtop = getTop(element[0]);
                    var w_height = document.body.clientHeight - 100; //浏览器可见高度
                    var new_height = old_height > (w_height - offtop) ? old_height : w_height - offtop;

                    element.css({
                        'height': new_height
                    });
                }

                var type = attrs['type'] || 'grid';
                scope.$watch(scope.sgData, function () {
                    draw_grid();
                }, true);

                function draw_grid() {
                    if (type == "grid") {
                        /**ag-fresh  ag-dark ag-blue  ag-material ag-bootstrap*/
                        element[0].className = "ag-blue";
                        //scope.sgOptions.rowSelection = "multiple";
                        scope.sgOptions.enableRangeSelection = true;
                        scope.sgOptions.suppressNoRowsOverlay = true; //禁用【空表】标识
                        scope.sgOptions.suppressLoadingOverlay = true; //禁用【加载中】标识
                        if (angular.isUndefined(scope.sgOptions.singleClickEdit))
                            scope.sgOptions.singleClickEdit = false;
                        if (!scope.sgOptions.getContextMenuItems) {
                            scope.sgOptions.getContextMenuItems = function (params) {
                                return getContextMenuItems(params)
                            };
                        }

                        //scope.sgOptions.getContextMenuItems=function(params){return doSelectRow(params)};
                        scope.sgOptions.localeText = {

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
                            selectAll: '选中所有',
                            searchOoo: '请输入搜索内容...',
                            blanks: '空白',

                            // for number filter and text filter
                            filterOoo: 'daFilter...',
                            applyFilter: 'daApplyFilter...',

                            // for number filter
                            equals: '等于',
                            lessThan: '小于',
                            greaterThan: '大于',

                            // for text filter
                            contains: '包含',
                            NotEquals: '不等于',
                            startsWith: '头匹配',
                            endsWith: '尾匹配',

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
                            csvExport: 'CSV Export导出',
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
                            ctrlC: 'ctrl n C',
                            paste: '粘贴',
                            ctrlV: 'ctrl n V'
                        }
                        new agGrid.Grid(element[0], scope.sgOptions);
                        //设置必填项属性样式
                        for (var i = 0; i < scope.sgColumns.length; i++) {
                            if (scope.sgColumns[i].editable) {
                                if (scope.sgColumns[i].cellClass) {
                                    scope.sgColumns[i].cellClass += 'good-score';
                                } else {
                                    scope.sgColumns[i].cellClass = 'good-score';
                                }

                            }
                            if (scope.sgColumns[i].non_empty) {
                                scope.sgColumns[i].headerComponentParams = {};
                                scope.sgColumns[i].headerCellRenderer = function (params) {
                                    var eHeader = document.createElement('span');
                                    var eTitle = document.createTextNode(params.colDef.headerName);
                                    eHeader.className = " not-null"
                                    eHeader.appendChild(eTitle);
                                    //eHeader.style.color = 'red';
                                    return eHeader;
                                }
                            }
                            if (scope.sgOptions.getRowHeight) {
                                scope.sgColumns[i].cellStyle = {
                                    'white-space': 'normal',
                                    'display': '-webkit-flex',
                                    'align-items': 'center'
                                }
                                if (scope.sgColumns[i].children) {
                                    for (var j = 0; j < scope.sgColumns[i].children.length; j++) {
                                        scope.sgColumns[i].children[j].cellStyle = {
                                            'white-space': 'normal',
                                            'display': '-webkit-flex',
                                            'align-items': 'center'
                                        }
                                    }
                                }
                            }
                        }
                        scope.sgOptions.api.setColumnDefs(scope.sgColumns);
                        var defaultcoldef = $.extend(true, {}, scope.sgColumns);

                        scope.sgOptions.defaultColumns = defaultcoldef;
                        //scope.sgOptions.api.showToolPanel(false);
                        scope.sgOptions.api.onGroupExpandedOrCollapsed();
                        if (scope.sgData == undefined) {
                            scope.sgData = [];
                        }
                        scope.sgOptions.api.setRowData([]);
                        scope.sgOptions.api.hideOverlay();
                        //scope.sgOptions.columnApi.resetColumnState();

                        /**var _cellclick = function(e){
                        console.log("_cellcliek");console.log(e);
                   }

                         scope.sgOptions.api.AddEventListener('cellClicked', _cellclick);//api.startEditingCell()*/

                        //单击事件
                        if (scope.sgOptions.rowClicked) {
                            scope.sgOptions.api.addEventListener('rowClicked', scope.sgOptions.rowClicked);
                        }
                        if (scope.sgOptions.cellClicked) {
                            scope.sgOptions.api.addEventListener('cellClicked', scope.sgOptions.cellClicked);
                        }
                        //双击事件
                        if (scope.sgOptions.rowDoubleClicked) {
                            scope.sgOptions.api.addEventListener('rowDoubleClicked', scope.sgOptions.rowDoubleClicked);
                        }
                        //光标关注事件
                        if (scope.sgOptions.cellFocused) {
                            scope.sgOptions.api.addEventListener('cellFocused', scope.sgOptions.cellFocused);
                        }
                        //网格模块扰动事件
                        if (scope.sgOptions.cellValueChanged) {
                            scope.sgOptions.api.addEventListener('cellValueChanged', scope.sgOptions.cellValueChanged);
                        }
                        //停止编辑事件
                        if (scope.sgOptions.cellEditingStopped) {
                            scope.sgOptions.api.addEventListener('cellEditingStopped', scope.sgOptions.cellEditingStopped);
                        }

                        /**
                         * 自定义API
                         */
                        scope.sgOptions.hcApi = {
                            /**
                             * 设置行数据
                             * @param {{}[]} rowData
                             */
                            setRowData: function (rowData) {
                                var seqKey = scope.sgColumns[0].field;

                                rowData.forEach(function (e, i) {
                                    e[seqKey] = i + 1;
                                });

                                scope.sgOptions.api.setRowData(rowData);
                                scope.sgOptions.columnApi.autoSizeAllColumns();
                            },

                            /**
                             * 设置焦点单元格
                             * @param rowIndex
                             * @param colKey
                             */
                            setFocusedCell: function (rowIndex, colKey) {
                                scope
                                    .sgOptions
                                    .api
                                    .setFocusedCell(rowIndex, colKey);

                                scope
                                    .sgOptions
                                    .api
                                    .rangeController
                                    .setRangeToCell(scope
                                        .sgOptions
                                        .api
                                        .getFocusedCell());
                            }
                        };
                    }
                }

                console.log('agGridview link end');
            }
        }
    }

    function emportExcel($timeout, BaseService, $http) {
        return {
            restrict: 'EA',
            require: "?ngModel",
            scope: {
                sgOptions: '=',
                sgColumns: '=',
                sgData: '=',
                sgDbclick: "&",
                uploadMethod: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                element.on("click", function (file) {
                    var filename = attrs["filename"] || "导出数据.xls";
                    scope.FrmInfo = {
                        title: "导出网格内容"
                    }
                    BaseService.openFrm("views/common/GridColumnsDef.html", emportexcelController, scope, "", "lg")
                        .result.then(function (result) {

                        var temp_columns = [].concat(result);
                        var nodes = scope.sgOptions.api.getModel().rootNode.childrenAfterSort;
                        var data = [];
                        for (var i = 0; i < nodes.length; i++) {
                            data.push(nodes[i].data);
                        }
                        /**if(!data.length){
						            BaseService.notice("没有需要导出的数据!","alert-warning");
						            return;
						        }*/

                        for (var i = 0; i < temp_columns.length; i++) {
                            temp_columns[i].name = temp_columns[i].headerName;
                            temp_columns[i].width = 5;
                            if (temp_columns[i].cellEditor == "年月日") {
                                temp_columns[i].type = "date";
                            } else if (temp_columns[i].cellEditorParams) {
                                temp_columns[i].type = "number";
                                temp_columns[i].options = temp_columns[i].cellEditorParams.values;
                            } else {
                                temp_columns[i].type = "string";
                            }
                        }

                        $http({
                            method: 'post',
                            url: '/exportexcel',
                            data: {
                                export_cols: temp_columns,
                                export_sum_cols: [],
                                export_datas: data
                            },
                            params: {
                                id: Math.random()
                            },
                            responseType: "arraybuffer"
                        })
                            .success(function (response, status, xhr, config) {
                                var data = new Blob([response], {
                                    type: 'application/vnd.ms-excel'
                                });
                                saveAs(data, filename);
                            }).error(function (response) {
                            BaseService.notice("数据处理异常!", "alert-warning");
                        });
                    });
                })

            }
        }
    }

    function buttonEdit($timeout) {
        return {
            restrict: 'EA',
            require: "?ngModel",
            scope: {
                ngModel: '=',
                hideDelbutton: '=',
                hideSearchbutton: '=',
                beEdit: '=',
                beAutosearch: '&',
                beDelete: '&',
                beSearch: '&',
                beBlur: '&'
            },
            template: '<div class="input-group"><input type="text" class="input-sm form-control" ng-model="ngModel"></div>',
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                ngModel.$render = function () {
                    if (!scope.hideSearchbutton) {
                        element.addClass('input-group');
                        $b = $('<a class="input-group-addon"><i class="fa fa-ellipsis-h"></i></a>');
                        if (scope.beSearch) {
                            $b.bind('click', scope.beSearch);
                        }
                        if (element.children() && !element.children(".input-group-addon")[0]) {
                            element.append($b);
                        }

                    } else {
                        if (element.children() && element.children(".input-group-addon")[0]) {
                            element.children(".input-group-addon")[0].remove();
                        }

                    }
                    if (!scope.hideDelbutton) {
                        element.addClass('input-group');
                        $a = $('<a class="input-group-addon"><i class="fa fa-times"></i></a>');
                        $a.bind('click', function () {
                            if (scope.beDelete()) {
                                scope.beDelete();
                            }
                        })
                        if (element.children() && element.children(".input-group-addon").children(".fa-times").length == 0) {
                            element.append($a);
                        }
                    } else {
                        if (element.children() && element.children(".input-group-addon")[0]) {
                            element.children(".input-group-addon")[0].remove();
                        }
                    }
                    if ((scope.hideSearchbutton && scope.hideDelbutton)) {
                        element.removeClass('input-group');
                    }
                    console.warn(element);
                };
                var input = element[0].childNodes[0];
                $input = $(input);
                $input.bind('keypress', function (event) {
                    if (event.keyCode == '13') {
                        scope.beAutosearch();
                    }
                })
                if (scope.beBlur) {
                    $input.bind('blur', scope.beBlur)
                }
                if (!scope.beEdit) {
                    $timeout(function () {
                        element[0].childNodes[0].readOnly = true;
                    })
                } else {
                    $timeout(function () {

                        element[0].childNodes[0].readOnly = false;
                    });
                }
            }
        }
    }

    function bsDatepacker() {
        return {
            restrict: 'AE',
            require: "?ngModel",
            link: function (scope, element, attrs, ngModel) {
                var format = attrs['format'] || "yyyy-mm-dd";
                //          var view = attrs['view'] || "decade";
                var view = attrs['view'] || "day";
                //          if(attrs['readonly']){
                //              return;
                //          }
                var options = {
                    format: format,
                    //                  minView: 'decade',
                    //                viewSelect:'decade',
                    startView: view,
                    todayBtn: true,
                    forceParse: true,
                    language: "zh-CN",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true
                };
                if (view == "decade") {
                    options.minViewMode = 2;
                } else if (view == "months") {
                    options.minViewMode = 1;
                }
                $(function () {
                    element.datepicker(options);
                    scope.$watch(attrs['ngModel'], function () {
                        if ($(element).val().length > 10) {
                            $(element).val(String($(element).val()).substring(0, 10));
                        }
                        ;
                        element.data("datepicker").setDate($(element).val());
                    });
                });
            }
        }
    }

    function bsDatePicker() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModelCtrl) {
                element.datetimepicker({
                    format: 'yyyy-mm-dd', //格式
                    minView: 'month', //最小视图：月
                    todayBtn: true, //【今天】按钮
                    todayHighlight: true, //高亮【今天】按钮
                    language: "zh-CN", //汉化
                    autoclose: true //选择后自动关闭
                });

                function toDateStr(value) {
                    //若是字符串形式，截取前10位(即日期部分)
                    if (angular.isString(value)) {
                        return value.length > 10 ? value.substr(0, 10) : value;
                    }
                    //若是日期时间形式，格式化
                    else if (angular.isDate(value)) {
                        return value.Format('yyyy-MM-dd');
                    }
                    ;
                }

                //view => model
                ngModelCtrl.$parsers.push(toDateStr);

                //model => view
                ngModelCtrl.$formatters.push(toDateStr);
            }
        };
        /*return {
        restrict: 'AE',
        require: "?ngModel",
        link: function (scope, element, attrs, ngModel) {
            $(function () {
                element.datepicker({
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
                });
                scope.$watch(attrs['ngModel'], function () {
                    if ($(element).val().length > 10) {
                        $(element).val(String($(element).val()).substring(0, 10));
                    }
                });
            });
        }
    }*/
    }

    /**
     * datetimepicker
     */
    function bsDatetimePicker() {
        return {
            restrict: 'AE',
            require: "?ngModel",
            link: function (scope, element, attrs, ngModel) {
                var format = attrs['format'] || "yyyy-mm-dd";
                var view = attrs['view'] || "month";

                var options = {
                    format: format,
                    startView: view,
                    todayBtn: true,
                    forceParse: true,
                    language: "zh-CN",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true
                };
                //          if(view == "month"){
                //              options.minView = "day";
                //          }
                element.datetimepicker(options);

            }
        }
    }

    /**
     * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
     */
    function iboxToolsFullScreen($timeout) {
        return {
            restrict: 'A',
            scope: true,
            templateUrl: 'views/common/ibox_tools_full_screen.html',
            controller: function ($scope, $element) {
                // Function for collapse ibox
                $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                };
                // Function for full screen
                $scope.fullscreen = function () {
                    var ibox = $element.closest('div.ibox');
                    var button = $element.find('i.fa-expand');
                    $('body').toggleClass('fullscreen-ibox-mode');
                    button.toggleClass('fa-expand').toggleClass('fa-compress');
                    ibox.toggleClass('fullscreen');
                    setTimeout(function () {
                        $(window).trigger('resize');
                    }, 100);
                }
            }
        };
    }

    function historyList(localeStorageService, $compile) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, ngModel) {
                var historylist = localeStorageService.get("page_historylist");
                if (historylist && historylist.length) {
                    var s_temp = "";
                    for (var i = 0; i < historylist.length; i++) {
                        var title = historylist[i].title;
                        title = title.substring(title.lastIndexOf("|") + 1, title.length);
                        s_temp += "<li ui-sref='" + historylist[i].name + "'><a>" + title + "</a></li>";
                    }
                    var el = $compile(s_temp)(scope);
                    element.append(el);
                } else {
                    element.append("<li style='color:#ccc;background-color:#fff;'>无历史纪录</li>");
                }
            }
        }
    }

    function autoFocus($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    element[0].focus();
                });
            }
        }
    }

    function workFlow($timeout, BaseService, localeStorageService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                wf_stat: '=wfStat',
                wf_apply_id: '=wfApplyId',
                wf_own_method: "&wfOwnMethod"
            },
            link: function (scope, element, attrs, ngModel) {
                // data
                var s = null;
                var color = attrs['color'] || "green";
                var size = attrs['size'] || "small";
                //绘图对象
                var element_w = $(element).width(); //画板宽度
                var element_h = $(element).height(); ////画板高度
                var rect_w = element_w / 8; //矩形的宽
                var rect_h = element_h / 10; //矩形的高
                var rect_r = rect_w / 15; //矩形圆角
                var arrow_h = 35; // 箭头高
                //元素边界距离
                var e_poc = {
                    min_y: 0,
                    max_y: 0,
                    min_x: -10,
                    max_x: 0
                }
                var paper = new Raphael(element[0], element_w, 150);
                //          paper.ZPD({ zoom: true, pan: true, drag: false });
                var scale = 2;

                $(element).closest("div.ibox").find(".ibox-title").append("<a class='zoomIn'>缩小</a><a class='zoomOut'>放大</a>");
                ;

                $(element).closest("div.ibox").find("a.zoomIn").on("click", function () {
                    scale *= 1.2;
                    var svg_height = e_poc.max_y - e_poc.min_y; //e_maxy - e_miny;
                    paper.setViewBox(-10, -svg_height, e_poc.max_x * scale, (e_poc.max_y - e_poc.min_y) * scale, false);
                });
                $(element).closest("div.ibox").find("a.zoomOut").on("click", function () {
                    scale *= 0.8;
                    var svg_height = e_poc.max_y - e_poc.min_y; //e_maxy - e_miny;
                    paper.setViewBox(-10, -svg_height, e_poc.max_x * scale, (e_poc.max_y - e_poc.min_y) * scale, false);
                    //              paper.canvas.setAttribute("transform", "scale("+scale+")");
                });

                ngModel.$render = function () {
                    if (ngModel.$viewValue && Number(ngModel.$viewValue) > 0) {
                        var wfid = Number(ngModel.$viewValue);
                        BaseService.RequestPost("base_wf", "select", {
                            wfid: wfid
                        }).then(function (data) {
                            draw_wf(data);
                        });
                    } else {
                        clear_wf();
                    }
                };

                //          var wfproccondtions = data.wfproccondtions;
                function clear_wf() { //清除流程图
                    paper.clear();
                    $(element).siblings("div.wf_container").detach();
                }

                function draw_wf(data) {
                    clear_wf();
                    if (scope.wf_stat != undefined) {
                        scope.wf_stat = data.stat;
                    }
                    var step = data.currprocid + 1;
                    if (data.currprocid >= 99999) {
                        step = data.wfprocs.length;
                    }
                    var wfid = data.wfid;
                    var wfname = data.wfname;
                    var wfproccondtions = data.wfproccondtions;
                    var procs = data.wfprocs;
                    var wfprocuseropinions = data.wfprocuseropinions;
                    var wfprocusers = data.wfprocusers;
                    //当前结点是否禁止驳回
                    var can_reject_stat = true;
                    if (data.currprocid < 99999 && procs.length && procs[data.currprocid].canreject && procs[data.currprocid].canreject == "1") {
                        can_reject_stat = false;
                    }
                    var submitstat = false;
                    for (var i = 0; i < procs.length; i++) {
                        if (procs[i].submitstat == "2" && procs[i].procid == data.currprocid) {
                            submitstat = true;
                            break;
                        }
                    }
                    var submitlist = [];
                    if (submitstat) { //当前结点如果是被驳回，提交时需要指定提交到原来驳回的节点
                        var p_data = {
                            wfid: wfid,
                            procid: data.currprocid,
                            stat: 4,
                            operright: 3
                        };
                        BaseService.RequestPost("scpwfproc", "getsubmitnodeinfo", p_data)
                            .then(function (data) {
                                var nodepath = String(data.wfnodepathofwfprocs[0].nodepath);
                                var str = (step - 1) + "-";
                                var a = nodepath.substr(nodepath.indexOf(str) + 2);
                                var nodepath_list = a.split("-");
                                //var submitnote = nodepath_list[1];
                                for (var i = 0; i < procs.length; i++) {
                                    for (var j = 0; j < nodepath_list.length; j++) {
                                        if (procs[i].procid == nodepath_list[j]) {
                                            submitlist.push(procs[i]);
                                        }
                                    }
                                }
                            });
                    }

                    var detailHtml = "";
                    //流程图下明细
                    var break_str = "";
                    if (step < procs.length) {
                        break_str = "<button class='btn btn-primary wfbreak m-r-xs btn-sm'>中断</button>";
                    }
                    var close_page = "<button class='btn btn-primary wfclosepage m-r-xs btn-sm'>返回上一页</button>";
                    var delete_current = "<button class='btn btn-primary wfignore m-r-xs btn-sm'>流程忽略</button>";

                    var $button_group = $("<span class='span12 text-center wf_op inline m-b-sm'>" +
                        "<button class='btn btn-primary wfdetail m-r-xs btn-sm'>流程详情>></button>" +
                        "<button class='btn btn-primary wfrefresh m-r-xs btn-sm'>刷新当前流程</button>" +
                        "<button class='btn btn-primary wfsubmit m-r-xs btn-sm'>提交</button>" +
                        "<button class='btn btn-primary wfreject m-r-xs btn-sm'>驳回</button>" +
                        delete_current + break_str + close_page +
                        "</span>"
                    );

                    var detail_table = $("<div class='wf_detail hide'>" +
                        "<table class='table table-borderer table-condensed'>" +
                        "<thead><tr><td>序号</td><td>节点名称</td>" +
                        "<td>执行人列表</td><td>状态</td><td>实际审批人</td>" +
                        "<td>审批时间</td><td>审批意见</td></tr></thead>" +
                        "<tbody></tbody></table></div>");
                    var tbody_str = "";
                    var breakpoint_list = []; //被驳回的节点
                    var can_submit = false; //当前用户是否是可以审核
                    window.userbean.can_submit = false;
                    var wf_curr_person = 0; //当前审核节点的审核人数
                    var wf_startor = false; //当前流程启动者
                    for (var i = 0; i < wfprocuseropinions.length; i++) {
                        var wf = wfprocuseropinions[i];
                        var stat_str = "";
                        var turn_someone = "";
                        if (wf.action_stat == "0") {
                            stat_str = "<span>启动</span>";
                            if (wf.userid == window.userbean.userid) {
                                wf_startor = true;
                            }
                        } else if (wf.action_stat == "1") {
                            stat_str = "<span>未达到</span>";
                        } else if (wf.action_stat == "4") {
                            stat_str = "<span style='color:red'>待审核</span>";
                            if (wf.userid == window.userbean.userid) {
                                turn_someone = "<button style='margin:0;padding: 1px 5px;' class='btn btn-primary wftrunto m-r-xs btn-sm'>转办</button>";
                                can_submit = true;
                                window.userbean.can_submit = true;
                            }
                            if (window.userbean.userid == "admin") {
                                turn_someone += "&nbsp;&nbsp;&nbsp;<button style='margin:0;padding: 1px 5px;' class='btn btn-primary wfchgchecker m-r-xs btn-sm'>修改审核人</button>";
                            }
                            wf_curr_person++;
                        } else if (wf.action_stat == "5") {
                            breakpoint_list.push(wf);
                            stat_str = "<span>驳回</span>";
                        } else if (wf.action_stat == "7") {
                            stat_str = "<span>完成</span>";
                        } else {
                        }

                        tbody_str += "<tr>" +
                            "<td>" + (i + 1) + "</td><td>" + wf.procname + "</td>" +
                            "<td>" + wf.userid + "</td><td>" + stat_str +
                            "</td><td>" + wf.userid + "</td>" +
                            "<td>" + wf.signtime + "</td>" +
                            "<td>" + wf.opinion + turn_someone + "</td></tr>";
                    }

                    //当流程审批人仅有一个人的时候不可忽略
                    if (wf_curr_person <= 1 || !can_submit) {
                        $button_group.find(".wfignore").detach();
                    }
                    //流程启动者才可以中断流程
                    //              if(!wf_startor){
                    //                  $button_group.find(".wfbreak").detach();
                    //              }

                    var breakpoint = -1;
                    if (breakpoint_list.length) { //被驳回的节点列表
                        var max = Number(breakpoint_list[0].procid);
                        if (breakpoint_list.length == 1) {
                            max = Number(breakpoint_list[0].procid);
                        } else {
                            for (var i = 1; i < breakpoint_list.length; i++) {
                                if (max < Number(breakpoint_list[i].procid)) {
                                    max = Number(breakpoint_list[i].procid);
                                }
                            }
                        }
                        var temp_b = -1;
                        for (var j = 0; j < procs.length; j++) {
                            if (procs[j].procid == max) {
                                temp_b = j + 1;
                            }
                        }
                        breakpoint = temp_b;
                    }

                    detail_table.find("tbody").html(tbody_str);
                    var $wf_container = $("<div class='wf_container' style='overflow:hidden;'></div>'");
                    $wf_container.append($button_group);
                    $wf_container.append(detail_table);

                    $(element).find(".wf_container").html("");
                    $(element).after($wf_container);
                    $wf_container.find(".wf_detail").find(".wftrunto").bind("click", function () { //转办
                        //                  console.log("转发流程");
                        BaseService.openFrm("views/popview/wf_complex_option.html", PopWFTurnOptionController, scope)
                            .result.then(function (result) {
                            var postdata = {
                                wfid: wfid,
                                proc_id: data.currprocid,
                                tranuserid: result.userid,
                                tranopinion: result.opinion
                            };
                            BaseService.RequestPost("base_wf", "transferto", postdata)
                                .then(function (data) {
                                    BaseService.notice("流程已转办!", "alert-info");
                                    draw_wf(data);
                                });
                        });

                    });
                    $wf_container.find(".wf_detail").find("button.wfchgchecker").bind("click", function () { //修改审核人
                        scope.wfscpprocusers = [].concat(wfprocusers);
                        var list = [];
                        for (var i = 0; i < scope.wfscpprocusers.length; i++) {
                            if (scope.wfscpprocusers[i].procid == data.currprocid) {
                                list.push(scope.wfscpprocusers[i]);
                            }
                        }
                        scope.wfscpprocusers = list;
                        BaseService.openFrm("views/popview/wf_complex_option.html", PopWFChgCheckerController, scope)
                            .result.then(function (result) {
                            var postdata = {
                                wfid: wfid,
                                procid: data.currprocid,
                                wfscpprocusers: result.wfscpprocusers
                            };
                            BaseService.RequestPost("base_wf", "update_userid", postdata)
                                .then(function (data) {
                                    BaseService.notice("流程已更改!", "alert-info");
                                    draw_wf(data);
                                });
                        });
                    });
                    $button_group.find(".wfdetail").bind("click", function () { //详情
                        detail_table.toggleClass("hide");
                    });

                    $button_group.find(".wfsubmit").bind("click", function () { //提交
                        if (!can_submit && window.userbean.userid != "admin") {
                            BaseService.notice("当前用户不可提交", "alert-warning");
                            return;
                        }
                        localeStorageService.remove("wf_procusers");

                        localeStorageService.set("wf_procusers", submitlist);
                        BaseService.openFrm("views/popview/wf_option.html", PopWFOptionController, scope, "", "sm")
                            .result.then(function (result) {
                            //返回即提交
                            var postdata = {
                                opinion: result.opinion,
                                objid: scope.wf_apply_id, //单据ID
                                wfid: wfid // 流程ID
                            };
                            if (result.procid) {
                                postdata.rejectto = result.procid;
                            }

                            BaseService.RequestPost("base_wf", "submit", postdata)
                                .then(function (data) {
                                    //                          $scope.customer_apply_header.stat=data.stat;
                                    draw_wf(data);
                                    if (scope.wf_own_method) {
                                        scope.wf_own_method();
                                    }
                                    if (scope.$parent.refresh) {
                                        scope.$parent.refresh(2);
                                    }
                                    BaseService.notice("提交成功", "alert-info");

                                })
                        });
                    });
                    $button_group.find(".wfreject").bind("click", function () { //驳回
                        if (step == "2") {
                            BaseService.notice("当前过程为第一步，不能驳回", "alert-warning");
                            return;
                        }
                        if (!can_submit && window.userbean.userid != "admin") {
                            BaseService.notice("当前用户不可驳回！", "alert-warning");
                            return;
                        }
                        if (!can_reject_stat) {
                            BaseService.notice("当前节点禁止驳回！", "alert-warning");
                            return;
                        }
                        localeStorageService.remove("wf_procusers");
                        //当前节点 -- 前
                        var popback = [];
                        for (var i = 0; i < procs.length; i++) {
                            if (Number(procs[i].procid) < (step - 1) && Number(procs[i].procid) != 0) {
                                popback.push(procs[i]);
                            }
                        }

                        localeStorageService.set("wf_procusers", popback);

                        BaseService.openFrm("views/popview/wf_option.html", PopWFOptionController, scope, "", "sm")
                            .result.then(function (result) {
                            var postdata = {
                                opinion: result.opinion,
                                objid: scope.wf_apply_id, //单据ID
                                wfid: wfid // 流程ID
                            };
                            if (result.procid) {
                                postdata.rejectto = result.procid;
                            }
                            BaseService.RequestPost("base_wf", "reject", postdata)
                                .then(function (data) {
                                    if ($.trim(data.note)) {
                                        BaseService.notice(data.note, "alert-info");
                                    } else {
                                        BaseService.notice("驳回成功", "alert-info");
                                    }
                                    draw_wf(data);
                                    if (scope.wf_own_method) {
                                        scope.wf_own_method();
                                    }
                                    if (scope.$parent.refresh) {
                                        scope.$parent.refresh(2);
                                    }
                                })
                        });
                    });
                    $button_group.find(".wfbreak").bind("click", function () { //中断
                        ds.dialog.confirm("确定中断当前流程？", function () {
                            var postdata = {
                                objid: scope.wf_apply_id, //单据ID
                                wfid: wfid // 流程ID
                            };
                            BaseService.RequestPost("base_wf", "break", postdata)
                                .then(function () {
                                    BaseService.notice("中断成功", "alert-info");
                                    ngModel.$setViewValue(0);
                                    clear_wf();
                                    if (scope.wf_own_method) {
                                        scope.wf_own_method();
                                    }
                                    if (scope.wf_stat != undefined) {
                                        scope.wf_stat = data.stat;
                                    }
                                    if (scope.$parent.refresh) {
                                        scope.$parent.refresh(2);
                                    }
                                })
                        });
                    });
                    $button_group.find(".wfignore").bind("click", function () { //流程忽略
                        ds.dialog.confirm("确定忽略当前流程？", function () {
                            BaseService.RequestPost("base_wf", "deleteuser", {
                                wfid: wfid,
                                procid: (step - 1)
                            }).then(function (data) {
                                draw_wf(data);
                            });
                        });
                    });
                    $button_group.find(".wfrefresh").bind("click", function () { //刷新当前流程
                        BaseService.RequestPost("base_wf", "select", {
                            wfid: wfid
                        }).then(function (data) {
                            draw_wf(data);
                        });
                    });
                    $button_group.find(".wfclosepage").bind("click", function () { //关闭当前页
                        window.history.go(-1);
                    });

                    /**
                     * draw the chart
                     * Context is paper
                     */
                        //              var attr = {
                        //                    fill: "#70AD47",//填充
                        //                    stroke: "none",//边框
                        //                    "stroke-width": 1,
                        //                    "stroke-linejoin": "round"
                        //                };

                        //灰色，绿色，红色
                    var colors = ['#e4e4e4', '#89bc65', '#f53b0f'];
                    var circle_collections = []; //存储结点
                    var arraw_collections = []; //存储线
                    //pick a mood between 1 and 5, 1 being rubbish and 5 being positively manic

                    function pagearraw(obj, color) {
                        var color_str = color || colors[0];
                        var arrow1 = paper.arrowSet(Number(obj.from_posx), Number(obj.from_posy), Number(obj.to_posx), Number(obj.to_posy), 5);
                        arrow1[0].attr({
                            "stroke": color_str,
                            "fill-opacity": 0,
                            "fill": color_str,
                            "stroke-dasharray": "- ",
                            "stroke-width": "1.2"
                        });
                        arrow1[1].attr({
                            "stroke": color_str,
                            "fill-opacity": 0,
                            "fill": color_str,
                            "stroke-width": "10"
                        });
                        arraw_collections.push(arrow1);
                    }

                    function pagecircle(obj, color) {
                        var color_str = color || colors[0];
                        var circ = paper.circle(obj.from_posx, obj.from_posy, 10);
                        circ.attr({
                            fill: color_str,
                            stroke: color_str
                        });
                        circle_collections.push(circ);
                    }

                    function pagetext(obj) {
                        var endpoint;
                        for (var i = 0; i < obj.length; i++) {
                            paper.text(obj[i].from_posx, obj[i].from_posy - 20, obj[i].fromprocname).attr({
                                fill: '#666'
                            });
                            if (obj[i].toprocid == 99999) {
                                endpoint = obj[i];
                            }
                        }
                        if (obj.length) {
                            var temp = paper.text(obj[obj.length - 1].to_posx, obj[obj.length - 1].to_posy - 20, obj[obj.length - 1].toprocname).attr({
                                fill: '#666'
                            });
                            if (endpoint) paper.text(endpoint.to_posx, endpoint.to_posy - 20, endpoint.toprocname).attr({
                                fill: '#666'
                            });
                        }
                    }

                    function pagepath(obj) {
                        var endpoint; //结束节点
                        var color_str = ""; //绘制颜色
                        for (var i = 0; i < obj.length; i++) {
                            color_str = colors[0]; //默认为灰色
                            if (obj[i].toprocid == 1) {
                                color_str = colors[1];
                            }
                            if (obj[i].toprocid == 99999) {
                                endpoint = obj[i];
                            } //结束节点
                            //节点状态
                            var action_stat = 0;
                            for (var j = 0; j < wfprocuseropinions.length; j++) {
                                var procid = obj[i].toprocid;
                                if (endpoint) { //如果当前结点为结束节点
                                    procid = obj[i].fromprocid;
                                }
                                if (wfprocuseropinions[j].procid == procid && wfprocuseropinions[j].procid >= 1) {
                                    action_stat = wfprocuseropinions[j].action_stat;
                                    break;
                                }
                            }
                            if (action_stat == 0) {
                                color_str = colors[1];
                            } else if (action_stat == 1) { //启动
                                color_str = colors[0];
                            } else if (action_stat == 4) { //待审核
                                color_str = colors[1];
                            } else if (action_stat == 5) { //驳回
                                color_str = colors[0];
                            } else if (action_stat == 7) { //已完成
                                color_str = colors[1];
                            }
                            pagearraw(obj[i], color_str);

                            pagecircle(obj[i], color_str);

                            if (obj[i].from_posy < e_poc.min_y) e_poc.min_y = obj[i].from_posy;
                            if (obj[i].from_posy > e_poc.max_y) e_poc.max_y = obj[i].from_posy;
                            if (obj[i].to_posx > e_poc.max_x) e_poc.max_x = obj[i].to_posx;
                        } //结束节点
                        if (obj.length) {
                            color_str = data.stat == 5 ? colors[1] : colors[0];
                            if (endpoint) paper.circle(endpoint.to_posx, endpoint.to_posy, 10).attr({
                                fill: color_str,
                                stroke: color_str
                            });
                        }
                    }

                    pagepath(wfproccondtions); //点 与 线

                    pagetext(wfproccondtions); //原点上的文字 -- 这样不会别覆盖

                    var svg_height = e_poc.max_y - e_poc.min_y; //e_maxy - e_miny;
                    paper.setViewBox(-10, -svg_height, e_poc.max_x * scale, (e_poc.max_y - e_poc.min_y) * scale, false);

                    var startX = 0,
                        startY = 0,
                        x = 0,
                        y = 0;
                    //              paper.canvas.ondragstart = function(event){
                    //                  y = event.pageY - startY;
                    //                    x = event.pageX - startX;
                    //                    var _viewBox = paper._viewBox;
                    //
                    //                    paper.setViewBox(_viewBox[0] - x,_viewBox[1] - y,_viewBox[2],_viewBox[3],_viewBox[4]);
                    //              };
                    //              var my_mood = 1;
                    //                var mood_text = paper.text(150, 30, '开始').attr({fill: '#333'});
                    //                function show_mood() {
                    //                    paper.text(250, 300, moods[my_mood - 1]).attr({fill: colors[my_mood - 1]});
                    //                    mood_text.node.onclick = function() {
                    //                        return false;
                    //                    }
                    //                    circ.node.onclick = function() {
                    //                        return false;
                    //                    }
                    //                }
                    //                circ.node.onclick = show_mood;
                    //                mood_text.node.onclick = show_mood;
                }
            }
        };
    }

    /**
     * 分页指令
     */
    function pagePagination($compile) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                var page_arrow, page_num;
                var direction = attrs['direction'] || "right";
                page_arrow = "<div class='pull-right'>" +
                    "<ul class='pagination'>" +
                    "<li title='首页' ng-click='firstpage()'><a><i class='fa fa-angle-double-left'></i></a></li>" +
                    "<li title='上一页' ng-click='prevpage()'><a><i class='fa fa-angle-left'></i></a></li>" +
                    "<li title='下一页' ng-click='nextpage()'><a><i class='fa fa-angle-right'></i></a></li>" +
                    "<li title='末页' ng-click='lastpage()'><a><i class='fa fa-angle-double-right'></i></a></li>" +
                    "</ul></div>";
                page_num = "<div class='pull-right inline fs-50'>" +
                    "<label class='font-noraml'>每页</label>" +
                    "<div class='inline'><select ng-change='pschange(pageSize)' ng-model='pageSize' " +
                    "class='form-control inline input-sm margin_r50'>" +
                    "<option value='10'>10</option>" +
                    "<option value='20'>20</option>" +
                    "<option value='30'>30</option>" +
                    "<option value='50'>50</option>" +
                    "<option value='100'>100</option>" +
                    "<option value='200'>200</option>" +
                    "<option value='300'>300</option>" +
                    "<option value='500'>500</option>" +
                    "<option value='1000'>1000</option>" +
                    "<option value='2000'>2000</option>" +
                    "<option value='3000'>3000</option>" +
                    "<option value='5000'>5000</option>" +
                    "<option value='10000'>10000</option>" +
                    "</select></div><span>当前第<input ng-model='currentPage' ng-keyup='keyup($event)'" +
                    "class='form-control margin_r50 inline input-sm' type='number' placeholder='{{currentPage}}'>页," +
                    "有{{totalCount}}记录,共{{pages}}页</span></div>";
                var el = $compile(page_arrow + page_num)(scope);
                element.append(el);

            }
        }
    }

    /**
     * 显示图片信息
     */
    function attachImg() {
        return {
            restrict: 'AE',
            require: "?ngModel",
            link: function (scope, element, attrs, ngModel) {
                ngModel.$render = function () {
                    var doc_id = 0;
                    if (ngModel.$viewValue && Number(ngModel.$viewValue) > 0) {
                        doc_id = Number(ngModel.$viewValue);
                    }
                    var img_url = "";
                    if (doc_id > 0) {
                        img_url = "/downloadfile.do?docid=" + doc_id;
                        var $img = $("<img width='100%' alt='' src=''>");
                        var height = $(element).height();
                        var width = $(element).width();
                        $img.attr("src", img_url).css({
                            'width': width,
                            'height': height
                        });
                        $(element).html($img);
                    } else {
                        $span = $("<span>请上传图片/格式(*.jpg,*.png,*.gif)</span>");
                        $(element).html($span);
                    }
                }

            }
        }

    }

    function dropzoneUpload($timeout, BasemanService) {
        return {
            restrict: 'A',
            require: "?ngModel",
            scope: {
                dataDocid: '=',
                uploadMethod: '&'
            },
            link: function (scope, element, attrs, ngModel) {
                var upload_type = attrs['filetype'] || "*.*"; //允许上传的文件类型
                var url_str = "/web/scp/filesuploadsave2.do";
                var filed = attrs['filed']; //文件上传的区域
                var flag = attrs['flag'] || 1; //上传类型
                var fileid = ""; //文件ID 用于上传文件
                var tpl = $("<div id='preview-template' style='display: none;'><div></div></div>");
                var postdata = {
                    scpsession: window.strLoginGuid,
                    sessionid: window.strLoginGuid,
                };

                $timeout(function () {
                    element.dropzone({
                        url: url_str,
                        maxFilesize: 500,
                        paramName: "docFile0",
                        fallback: function () {
                            BasemanService.notice("浏览器版本太低,文件上传功能将不可用！", "alert-warning");
                        },
                        addRemoveLinks: true,
                        acceptedFiles: upload_type,
                        params: postdata,
                        previewTemplate: tpl.prop("outerHTML"),
                        // previewsContainer: filed,
                        maxThumbnailFilesize: 5,
                        init: function () {
                            //scope.files.push({file: 'added'});
                            this.on('addedfile', function (file) {
                            })
                                .on('dragstart', function (file) {
                                    return false;
                                })
                                .on('uploadprogress', function (file, percentage) {
                                    //Show Progress  // 上传进行中，显示进度
                                    //                          file.id = "file_" + fileid;
                                    //                          $(filed).find("li#" + file.id).find("div.progress-bar").css('width', percentage+'%');
                                    //                          $("#loading_text label").text(percentage + "%");
                                })
                                .on('success', function (file, json) {
                                    try {
                                        var obj = json;
                                        if (obj.failure) {
                                            BasemanService.notice("上传失败!", "alert-warning");
                                            return;
                                        }
                                        //                              scope.dataDocid = obj.data[0].docid;
                                        ngModel.$setViewValue(obj.data[0].docid);
                                    } catch (e) {
                                        BasemanService.notice("上传数据异常!", "alert-warning");
                                        if ($("body").toggleLoading && scope.importGrid) {
                                            $("body").css({
                                                "overflow": "auto"
                                            });
                                            $("body").toggleLoading();
                                        }
                                        ;
                                    }

                                })
                                .on("error", function (args) {
                                    BasemanService.notice("文件格式/大小不符合!", "alert-warning");
                                    console.log("File upload error");
                                })
                                .on('drop', function (file) {
                                    console.log("File Drop In");
                                })
                        },
                    });
                }); //end Timeout
            }
        }

    }

    function draggableModel($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var startX = 0,
                        startY = 0,
                        x = 0,
                        y = 0;
                    $(element).css({
                        cursor: 'move'
                    });
                    var $dialog = $(element).closest("div.modal-dialog");
                    $(element).on("mousedown", function (event) {
                        mousedown(event);
                    });
                    var _e;
                    var $e;

                    function mousedown(event) {
                        console.log('down');
                        console.log(event.target);
                        $e = $(event.target);
                        _e = event;
                        //放出按钮
                        if (event.target.className == 'close' || event.target.getAttribute('aria-hidden') == 'true') {
                            if (
                                $(event.target).closest(".modal.fade").length != 0
                                &&
                                $(event.target).closest(".modal.fade").attr("id") == "commonModal"
                            ) {
                                startX = 0;
                                startY = 0;
                                x = 0;
                                y = 0;
                            }
                            return;
                        }
                        if (event.target.className == 'modmax' || event.target.className.indexOf('fa fa-expand') != -1) {
                            return;
                        }
                        event.preventDefault();
                        startX = event.pageX - x;
                        startY = event.pageY - y;
                        $(event.target).closest('body').on('mousemove', mousemove);
                        $(event.target).closest('body').on('mouseup', mouseup);
                        $(event.target).closest('.ui-resizable').addClass('resizing');
                        console.log($(event.target));
                        console.log($(event.target).closest('body'));
                        console.log($(event.target).closest('body').on('mousemove', mousemove));
                    }

                    function mousemove(event) {
                        y = event.pageY - startY;
                        x = event.pageX - startX;
                        $e.closest("div.modal-dialog").css({
                            //$dialog.css({
                            top: y + 'px',
                            left: x + 'px'
                        });
                        console.log("x:" + x + ",y:" + y)
                    }

                    function mouseup(event) {
                        console.log('up');
                        $(_e.target).closest('body').off('mousemove', mousemove);
                        $(_e.target).closest('body').off('mouseup', mouseup);
                        $(_e.target).closest('.ui-resizable').removeClass('resizing')
                    }

                    //关闭模态框时注销事件
                    $dialog.find('[aria-hidden=true]').on('click', function () {
                        mouseup(_e);
                    });
                    /*$dialog.on('mouseout',function () {
                 startX=0;
                 startY=0;
                 mouseup();
                 })*/

                }, 50)

            }
        }
    }


    function wrapHeight($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                $timeout(function () {
                    var header_height = $("#MainCtrl").height();
                    $(element).css({
                        // 'margin-right': '-12px',
                        // 'padding-right': '12px',
                        'overflow-x': 'hidden',
                        "height": document.body.offsetHeight - header_height - $("div.footer").height() - 4
                    });
                    $(element).perfectScrollbar();
                    //              $(element).children().css({'overflow-x':'hidden'});
                    inspinia.fix_height();
                }, 100);

                $("body").on("click", function () {
                    $timeout(function () {
                        var header_height = $("#MainCtrl").height();
                        $("div.wrap-height").css({
                            "height": document.body.offsetHeight - header_height - $("div.footer").height()
                        });
                        inspinia.fix_height();
                        $('div.wrap-height').perfectScrollbar('update');
                        $('div.wrap-height').perfectScrollbar('resize');
                    });
                });
            }
        }
    }


//自适应高度
    function autoHeight($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, ngModel) {
                $timeout(function () {

                    //窗口高度
                    var bodyH = $("body").height();

                    //指令对象以外其他高度
                    var other = $(".other-h");
                    var otherH = 0;
                    for (var i = 0; i < other.length; i++) {
                        otherH += $(other[i]).outerHeight(true);
                    }

                    //内部边距
                    var padding = $(element).innerHeight() - $(element).height();

                    //指令对象高度为窗口高度 - 其他高度 - 内外边距 - iframe滚动条兼容距离1
                    $(element).height(bodyH - otherH - padding - 1);

                    function resize(event, triggerBy) {
                        var bodyH = $(window).height();

                        //指令对象以外其他高度
                        var other = $(".other-h");
                        var otherH = 0;
                        for (var i = 0; i < other.length; i++) {
                            otherH += $(other[i]).outerHeight(true);
                        }
                        //指令对象高度为窗口高度 - 其他高度
                        $(element).height(bodyH - otherH - padding);
                    }

                    $(window).resize(resize);

                    //绑定自定义事件，方便其他指令触发
                    $(element).on('AutoHeight', resize);

                }, 50);
            }
        }
    }


    /**
     * 自定义多选框
     * multi-select replace chosen-select
     * list replace ng-options
     * @param $timeout
     */
    function multiSelect1($timeout) {
        return {
            restrict: 'EA',
            require: "ngModel",
            scope: true,
            link: function (scope, element, attrs, ngModel) {

                var $multiContainer = $("<div class='chosen-container chosen-container-single chosen-container-multi' style='width:100%;'></div>");
                var $select_lists = $("<ul class='chosen-choices' style='border:none;border-bottom:1px solid #ccc;padding:0;'><a style='border-bottom:none;' class='chosen-single chosen-default multi-select'><span></span><div><b></b></div></a></ul>");
                var $select_drop = $("<div class='chosen-drop'><ul class='chosen-results' style='border-top:1px solid #ccc;'></ul></div>");

                //          $select_lists.find("a").css({'display':'inline-block','height':'22px',
                //              'width':'100%','line-height':'22px','overflow':'hidden'
                //                  ,'white-space':'nowrap','text-overflow':'ellipsis'});
                $multiContainer.append($select_lists).append($select_drop);
                $(element).hide().parent().append($multiContainer);

                function stop(event) {
                    var e = window.event || event;
                    if (e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器
                        e.stopPropagation();
                    } else {
                        window.event.cancelBubble = true; // 兼容IE的方式来取消事件冒泡
                    }
                }

                $select_lists.on("click", function (event) {
                    var disabled = $(element).attr("disabled");
                    if (!disabled) $multiContainer.toggleClass('chosen-with-drop');
                    stop(event);
                });

                function checksel(a) {
                    if (a != undefined) {
                        var val_list = [];
                        if ($.trim(a)) {
                            if (String(a).indexOf(",") > -1) val_list = a.split(",");
                            else val_list.push(a);
                        }
                        $select_drop.find("li.active-result").find("i").addClass("hide");
                        var desc_list = [];
                        $select_drop.find("li.active-result").each(function () {
                            var id = $(this).attr("data-id");
                            for (var i = 0; i < val_list.length; i++) {
                                if (val_list[i] == id) {
                                    $(this).find("input").attr('checked').value = "checked";
                                }
                            }

                        });
                        var _this_desc = HczyCommon.appendComma(desc_list);
                        $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                    } else {
                        $select_lists.find("a").find("span").attr("title", _this_desc).html("");
                        $select_drop.find("li.active-result").find("i").addClass("hide");
                    }
                }

                ngModel.$render = function () {
                    checksel(ngModel.$viewValue);
                };
                scope.$watch(attrs['list'], function (newValue, oldValue) {
                    if (newValue === oldValue && newValue === undefined) {
                        return;
                    }
                    render(newValue);
                });
                var render = function (data) {
                    if (!data || !data.length) {
                    } else {
                        var list = "";
                        for (var i = 0; i < data.length; i++) {
                            list += "<li class='active-result' data-id='" + data[i].value + "'>" +
                                "<label><input name='checkbox' type ='checkbox'  value='checkbox' checked=''></label>" +
                                "<span title='" + data[i].desc + "'>" + data[i].desc + "</span>" +
                                "</li>";
                        }
                        $select_drop.children().html("").append(list);
                        var all_stat = false;
                        $select_drop.find("li").on("click", function (event) { //选中某一个
                            //                      console.log($(this).attr("data-id"));
                            all_stat = false;
                            var select_id = $(this).attr("data-id");
                            $(this).find("i").toggleClass("hide");
                            var val_list = [];
                            var desc_list = [];
                            $select_drop.find("li.active-result").each(function () {
                                if ($(this).find("input").attr('checked') == "checked") {
                                    val_list.push($(this).attr('data-id'));
                                    desc_list.push($(this).find("span").html());
                                }
                            });
                            var _this_val = HczyCommon.appendComma(val_list);
                            var _this_desc = HczyCommon.appendComma(desc_list);
                            $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                            ngModel.$setViewValue(_this_val);
                            //$multiContainer.toggleClass('chosen-with-drop');
                            //stop(event);
                        });

                        $select_drop.find("a.sel_all").on("click", function () { //全选
                            var temp = HczyCommon.appendComma(data, "id", "name");
                            if (all_stat) {
                                $select_drop.find("li.active-result").find("i").addClass("hide");
                                all_stat = false;
                                checksel('');
                            } else {
                                $select_drop.find("li.active-result").find("i").removeClass("hide");
                                checksel(temp[0]);
                                all_stat = true;
                            }

                            stop(event);
                        });

                        $select_drop.find("li.active-result").hover(function () {
                            $(this).addClass("highlighted");
                        }, function () {
                            $(this).removeClass("highlighted");
                        });
                    }
                    checksel(ngModel.$viewValue);
                }

            }
        }
    }

    function multiSelect($timeout) {
        return {
            restrict: 'EA',
            require: "ngModel",
            scope: true,
            link: function (scope, element, attrs, ngModel) {

                var $multiContainer = $("<div class='chosen-container chosen-container-single chosen-container-multi' style='width:100%;'></div>");
                var $select_lists = $("<ul class='chosen-choices' style='border:none;border-bottom:1px solid #ccc;padding:0;'><a style='border-bottom:none;' class='chosen-single chosen-default multi-select'><span></span><div><b></b></div></a></ul>");
                var $select_drop = $("<div class='chosen-drop'><ul class='chosen-results' style='border-top:1px solid #ccc;'></ul></div>");

                //          $select_lists.find("a").css({'display':'inline-block','height':'22px',
                //              'width':'100%','line-height':'22px','overflow':'hidden'
                //                  ,'white-space':'nowrap','text-overflow':'ellipsis'});
                $multiContainer.append($select_lists).append($select_drop);
                $(element).hide().parent().append($multiContainer);

                function stop(event) {
                    var e = window.event || event;
                    if (e.stopPropagation) { //如果提供了事件对象，则这是一个非IE浏览器
                        e.stopPropagation();
                    } else {
                        window.event.cancelBubble = true; // 兼容IE的方式来取消事件冒泡
                    }
                }

                $select_lists.on("click", function (event) {
                    var disabled = $(element).attr("disabled");
                    if (!disabled) $multiContainer.toggleClass('chosen-with-drop');
                    stop(event);
                });

                /**$("body").on("click", function () {
			    $multiContainer.removeClass('chosen-with-drop')
			});*/
                function checksel(a) {
                    if (a != undefined) {
                        var val_list = [];
                        if ($.trim(a)) {
                            if (String(a).indexOf(",") > -1) val_list = a.split(",");
                            else val_list.push(a);
                        }
                        $select_drop.find("li.active-result").find("i").addClass("hide");
                        var desc_list = [];
                        $select_drop.find("li.active-result").each(function () {
                            var id = $(this).attr("data-id");
                            for (var i = 0; i < val_list.length; i++) {
                                if (val_list[i] == id) {
                                    $(this).find("i").removeClass("hide");
                                }
                            }

                            if (!$(this).find("i").hasClass("hide")) {
                                desc_list.push($(this).find("span").html());
                            }
                        });
                        var _this_desc = HczyCommon.appendComma(desc_list);
                        $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                    } else {
                        $select_lists.find("a").find("span").attr("title", _this_desc).html("");
                        $select_drop.find("li.active-result").find("i").addClass("hide");
                    }
                }

                ngModel.$render = function () {
                    checksel(ngModel.$viewValue);
                };
                scope.$watch(attrs['list'], function (newValue, oldValue) {
                    if (newValue === oldValue && newValue === undefined) {
                        return;
                    }
                    render(newValue);
                });
                var render = function (data) {
                    if (!data || !data.length) {
                        //                  $select_lists.children().html("").append("<li style='display:inline-block;width:100%;'><a class='chosen-single chosen-default'></a></li>");
                    } else {
                        //                  var list = "<li style='display:inline-block;width:100%;'><a class='sel_all' style='padding-right:10px;'>全选</a><a class='sel_noall'>全不选</a></li>";
                        var list = "";
                        for (var i = 0; i < data.length; i++) {
                            list += "<li class='active-result' data-id='" + data[i].value + "'>" +
                                "<i class='fa fa-check hide'></i>" +
                                "<span title='" + data[i].desc + "'>" + data[i].desc + "</span>" +
                                "</li>";
                        }
                        $select_drop.children().html("").append(list);
                        var all_stat = false;
                        $select_drop.find("li").on("click", function (event) { //选中某一个
                            //                      console.log($(this).attr("data-id"));
                            all_stat = false;
                            var select_id = $(this).attr("data-id");
                            $(this).find("i").toggleClass("hide");
                            var val_list = [];
                            var desc_list = [];
                            $select_drop.find("li.active-result").each(function () {
                                if (!$(this).find("i").hasClass("hide")) {
                                    val_list.push($(this).attr('data-id'));
                                    desc_list.push($(this).find("span").html());
                                }
                            });
                            var _this_val = HczyCommon.appendComma(val_list);
                            var _this_desc = HczyCommon.appendComma(desc_list);
                            $select_lists.find("a").find("span").attr("title", _this_desc).html(_this_desc);
                            ngModel.$setViewValue(_this_val);
                            //$multiContainer.toggleClass('chosen-with-drop');
                            stop(event);
                        });

                        $select_drop.find("a.sel_all").on("click", function () { //全选
                            var temp = HczyCommon.appendComma(data, "value", "desc");
                            if (all_stat) {
                                $select_drop.find("li.active-result").find("i").addClass("hide");
                                all_stat = false;
                                checksel('');
                            } else {
                                $select_drop.find("li.active-result").find("i").removeClass("hide");
                                checksel(temp[0]);
                                all_stat = true;
                            }

                            stop(event);
                        });

                        $select_drop.find("li.active-result").hover(function () {
                            $(this).addClass("highlighted");
                        }, function () {
                            $(this).removeClass("highlighted");
                        });
                    }
                    checksel(ngModel.$viewValue);
                }

            }
        }
    }

    function flot($timeout) {
        return {
            restrict: 'EA',
            template: '<div></div>',
            scope: {
                dataset: '=',
                options: '=',
                callback: '='
            },
            link: function (scope, element, attributes) {
                var height, init, onDatasetChanged, onOptionsChanged, plot, plotArea, width, _ref, _ref1;
                plot = null;
                width = attributes.width || '100%';
                height = attributes.height || '100%';
                if (((_ref = scope.options) != null ? (_ref1 = _ref.legend) != null ? _ref1.container : void 0 : void 0) instanceof jQuery) {
                    throw 'Please use a jQuery expression string with the "legend.container" option.';
                }
                if (!scope.dataset) {
                    scope.dataset = [];
                }
                if (!scope.options) {
                    scope.options = {
                        legend: {
                            show: false
                        }
                    };
                }
                plotArea = $(element.children()[0]);
                plotArea.css({
                    width: width,
                    height: height
                });
                init = function () {
                    var plotObj;
                    plotObj = $.plot(plotArea, scope.dataset, scope.options);
                    if (scope.callback) {
                        scope.callback(plotObj);
                    }
                    return plotObj;
                };
                onDatasetChanged = function (dataset) {
                    if (plot) {
                        plot.setData(dataset);
                        plot.setupGrid();
                        return plot.draw();
                    } else {
                        return plot = init();
                    }
                };
                scope.$watch('dataset', onDatasetChanged, true);
                onOptionsChanged = function () {
                    return plot = init();
                };
                return scope.$watch('options', onOptionsChanged, true);
            }
        };
    };

    function intInput($timeout) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {},
            template: '<input type="number"  class="input-sm form-control">',
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                function isCharNumeric(charStr) {
                    return /^(0|[1-9][0-9]*|-[1-9][0-9]*|-*)$/.test(charStr);
                }

                function getCharCodeFromEvent(event) {
                    event = event || window.event;
                    return (typeof event.which == "undefined") ? event.keyCode : event.which;
                }

                function isKeyPressedNumeric(event) {
                    var charCode = getCharCodeFromEvent(event);
                    var charStr = element[0].value + String.fromCharCode(charCode);
                    return isCharNumeric(charStr);
                }

                if (!ngModel) return;
                ngModel.$render = function () {
                    if (isCharNumeric(ngModel.$viewValue)) {
                        element[0].value = ngModel.$viewValue;
                    } else {
                        element[0].value = ""
                    }
                };
                element.bind('keypress', function (event) {
                    if (!isKeyPressedNumeric(event)) {
                        if (event.preventDefault) event.preventDefault();
                    }
                });
            }
        }
    };

    function passwordInput() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {},
            link: function (scope, element, attrs, ngModel) {

                if (!ngModel) return;

                ngModel.$formatters.push(function (modelValue) {

                    console.log(ngModel);
                    ngModel.uncodeStr = ngModel.uncodeStr ? ngModel.uncodeStr : modelValue;
                    ngModel.uncodeStrArr = ngModel.uncodeStr.split('');

                    var codeStr = '';
                    for (var i = 0; i < ngModel.uncodeStrArr.length; i++) {
                        codeStr += '*';
                    }
                    ngModel.$modelValue += ngModel.uncodeStrArr[ngModel.uncodeStrArr.length - 1];

                    return codeStr;
                });

                ngModel.$parsers.push(function (viewValue) {
                    console.log(ngModel);
                    return ngModel.uncodeStr;
                });
            }
        }
    }

    function textInput($timeout) {
        return {
            restrict: 'EA',
            require: 'ngModel',
            scope: {},
            template: '<input type="text"  class="input-sm form-control">',
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                function isCharText(charStr) {
                    return true;
                }

                function getCharCodeFromEvent(event) {
                    event = event || window.event;
                    return (typeof event.which == "undefined") ? event.keyCode : event.which;
                }

                function isKeyPressedText(event) {
                    var charCode = getCharCodeFromEvent(event);
                    var charStr = element[0].value + String.fromCharCode(charCode);
                    if (charStr.indexOf(".") > -1) {
                        charStr = charStr + "0";
                    }
                    return isCharText(charStr);
                }

                if (!ngModel) return;
                ngModel.$render = function () {
                    if (isCharText(ngModel.$viewValue)) {
                        if (ngModel.$viewValue) {
                            element[0].value = ngModel.$viewValue;
                        } else {
                            element[0].value = ""
                        }

                    }
                };
                element.bind('keypress', function (event) {
                    if (!isKeyPressedText(event)) {
                        if (event.preventDefault) event.preventDefault();
                    }
                });
            }
        }
    };

    /**function format($filter) {
    return {
        require: '?ngModel',
        link: function(scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function(a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function(viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}*/

    function floatInput($timeout) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                ngModel: '='
            },
            template: '<input type="number" class="input-sm form-control">',
            replace: true,
            link: function (scope, element, attrs, ngModel) {
                function isCharFloat(charStr) {
                    return /^([-+]?[0-9]*\.?[0-9]*|-*)$/.test(charStr);
                }

                function getCharCodeFromEvent(event) {
                    event = event || window.event;
                    return (typeof event.which == "undefined") ? event.keyCode : event.which;
                }

                function isKeyPressedFloat(event) {
                    var charCode = getCharCodeFromEvent(event);
                    var charStr = element[0].value + String.fromCharCode(charCode);
                    if (charStr.indexOf(".") > -1) {
                        charStr = charStr + "0";
                    }
                    return isCharFloat(charStr);
                }

                if (!ngModel) return;
                ngModel.$render = function () {
                    if (isCharFloat(ngModel.$viewValue)) {
                        element[0].value = (ngModel.$viewValue);
                    } else {
                        element[0].value = ""
                    }
                };
                element.bind('keypress', function (event) {
                    if (!isKeyPressedFloat(event)) {
                        if (event.preventDefault) event.preventDefault();
                    } else {
                    }
                });
            }
        }
    };

    function eChart($timeout) {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {
                sgData: '=*',
                sgDatax: "=",
                sgTitle: "=",
                sgOption: "="
            },
            link: function (scope, element, attrs, ngModel) {
                function showHistogram(d1, title, data_x) {
                    // 使用
                    require(['echarts', 'echarts/chart/line' // 使用柱状图就加载bar模块，按需加载
                        ],
                        function (ec) {
                            // 基于准备好的dom，初始化echarts图表
                            //产线生产完成率柱状图
                            var myChart = ec.init(element[0]);

                            for (var i = 0; i < d1.length; i++) {
                                var object = {};
                                object.name = d1[i].name;
                                object.data = d1[i].data;
                                object.type = "line";
                                scope.sgOption.series.push(object);
                                scope.sgOption.legend.data.push(d1[i].name);

                            }
                            scope.sgOption.title.text = title;
                            scope.sgOption.xAxis[0].data = data_x
                            // 为echarts对象加载数据
                            myChart.setOption(scope.sgOption);
                        });

                }

                var interval = setInterval(function () {
                    if (scope.sgData) {
                        showHistogram(scope.sgData, scope.sgTitle, scope.sgDatax);
                        clearInterval(interval);
                    }
                }, 1000);
                /**$timeout(function(){
					if(scope.sgData){
						showHistogram(scope.sgData,scope.sgTitle,scope.sgDatax)
					}
				},1000)*/

                scope.$watch(scope.sgData, function (newVal) {
                    console.log(newVal); //每次你在controller里修改了userInfo，这里都会打印
                }, true);

            }
        }
    };

//日期格式转换
    function dateFormat($filter) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attr, ngModelCtrl) {
                function toDateStr(value) {
                    //若是字符串形式，截取前10位(即日期部分)
                    if (angular.isString(value)) {
                        return value.length > 10 ? value.substr(0, 10) : value;
                    }
                    //若是日期时间形式，格式化
                    else if (angular.isDate(value)) {
                        return value.Format('yyyy-MM-dd');
                    }
                }

                ngModelCtrl.$formatters.push(toDateStr/*function (modelValue) {
                if (modelValue) {
                    return new Date(modelValue);
                }
            }*/);
                ngModelCtrl.$parsers.push(toDateStr/*function (value) {
                if (value) {
                    return $filter('date')(value, 'yyyy-MM-dd');
                }
            }*/);
            }
        };
    }

//金额千分号格式转换
    function moneyFormat(Magic) {
        return {
            require: 'ngModel',
            link: function (scope, elem, attr, ngModelCtrl) {
                ngModelCtrl.$formatters.push(function (modelValue) {
                    if (modelValue) {
                        return HczyCommon.formatMoney(modelValue)
                    }
                });

                ngModelCtrl.$parsers.push(function (viewValue) {
                    if (viewValue) {
                        return Magic.toNum(viewValue);
                    }
                });
            }
        };
    }

    function numberFormat(Magic) {
        return {
            require: '?ngModel',
            link: function (scope, elem, attr, ngModelCtrl) {
                if (!ngModelCtrl) return;

                ngModelCtrl.$parsers.push(function (viewValue) {
                    return Magic.toNum(viewValue);
                });

                ngModelCtrl.$render = function () {
                    var value = ngModelCtrl.$isEmpty(ngModelCtrl.$viewValue) ? '' : ngModelCtrl.$viewValue;
                    if (!Magic.isNum(value) && !Magic.isStrOfNum(value))
                        value = '';
                    if (elem.val() !== value) {
                        elem.val(value);
                    }
                };
            }
        };
    }

    function addCondtab($compile) {
        return {
            restrict: 'AE',
            scope: {
                item: '='
            },
            link: function (scope, element, attrs) {
                var obj = scope.item;
                scope = scope.$parent.$parent;
                var s = obj.as ? obj.as : obj.code;
                if (obj.dicts != undefined && obj.dicts.length > 0) {
                    var html = ' <ul id="myTab_' + obj.code + '" class="btn-group" style="margin-bottom:0px;padding-left:0;"> '
                        + ' <button type="button" class="btn btn-xs btn-white active" href="#condtion1_' + obj.code + '" data-toggle="tab">多选项</button>'
                        + ' </ul> '
                        + ' <div id="myTabContent_' + obj.code + '" class="itab-content myTabContent" style="margin-left: 0px;height: 100%;"> '
                        // 包括范围
                        + '    <div class="tab-pane fade in active"  '
                        + ' 	   id="condtion1_' + obj.code + '"'
                        + ' 	   option_name="' + obj.name + '-包括范围"   '
                        + ' 	   option_filed="' + s + '"    '
                        + ' 	   option_flag="3"   '
                        + ' 	   data_type="string"   '
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
                        if (!obj.dicts[i].id) {//去除undefined的下拉值
                            continue;
                        }
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
                        + ' </div> ';
                } else {


                    var sdateInputFromat = '<input bs-datepacker="" class="form-control input-sm ng-valid ng-dirty ng-valid-parse ng-touched s_value" value="" type="text">';

                    var snumberInputFromat = '<input type="number"  class="input-sm form-control s_value " value=""  >';

                    var sstrInputFromat = '<input type="text"  class="input-sm form-control s_value " value=""  >';

                    var edateInputFromat = '<input bs-datepacker="" class="form-control input-sm ng-valid ng-dirty ng-valid-parse ng-touched e_value" value="" type="text">';

                    var enumberInputFromat = '<input type="number"  class="input-sm form-control e_value " value=""  >';

                    var estrInputFromat = '<input type="text"  class="input-sm form-control e_value " value=""  >';

                    var sinputhtml = sstrInputFromat;
                    var einputhtml = estrInputFromat;
                    var s = obj.as ? obj.as : obj.code;
                    var columns_name = "columns_" + obj.code;
                    scope[columns_name] = [];
                    scope[columns_name] = HczyCommon.copyobj(scope.columns_bh, scope[columns_name]);
                    if (obj.type == "date") {
                        scope[columns_name][1].cellEditor = "年月日";
                        sinputhtml = sdateInputFromat;
                        einputhtml = edateInputFromat;
                    } else if (obj.type == "number") {
                        scope[columns_name][1].cellEditor = "浮点框";
                        sinputhtml = snumberInputFromat;
                        einputhtml = enumberInputFromat;
                    }

                    var html = ' <ul id="myTab_' + obj.code + '" class="btn-group" style="margin-bottom:0px;padding-left:0;"> '
                        + '	<button type="button" class="btn btn-xs btn-white active" data-target="#condtion1_' + obj.code + '" data-toggle="tab">包含值</button> '
                        + '	<button type="button" class="btn btn-xs btn-white" data-target="#condtion2_' + obj.code + '" data-toggle="tab">不包含值</button> '
                        + '	<button type="button" class="btn btn-xs btn-white" data-target="#condtion3_' + obj.code + '" data-toggle="tab">包含值范围</button> '
                        + '	<button type="button" class="btn btn-xs btn-white" data-target="#condtion4_' + obj.code + '"data-toggle="tab">不包含值范围</button> '
                        + ' </ul> '
                        + ' <div id="myTabContent_' + obj.code + '" class="itab-content myTabContent" > '
                        // 包括值范围
                        + '    <div class="tab-pane fade in active" id="condtion1_' + obj.code + '"'
                        + s
                        + ' 	         option_name="' + obj.name + '-包括值" option_filed="' + s + '"  option_flag="3" '
                        + ' 	   data_type="' + obj.type + '"   '
                        + '      > '
                        + '           <div class="col-md-12">'
                        + '                <div id="options_' + obj.code + '" ag-gridview sg-options="options_' + obj.code + '" '
                        + '                     sg-columns="columns_' + obj.code + '" style="width:100%;height:170px;" class="slick-grid"></div>'
                        + '            </div>'
                        + '       <div class="filter-result m-t-xs"><a><span ng-click="add_cond_line1($event,\'options_' + obj.code + '\')"><i class="fa fa-plus"></i>增加一行</span></a> '
                        + ' 		   <a ng-click="add_cond1($event,\'options_' + obj.code + '\')" style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a></div> '
                        + '    </div> '
                        // 不包括值范围
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
                        + ' 					    <td> ' + sinputhtml + '</td> '
                        + ' 						<td class="text-center"><a  class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>     '
                        + ' 					    </td> '
                        + ' 					</tr> '
                        + '  '
                        + ' 				</tbody> '
                        + ' 			</table> '
                        + ' 	       <div class="filter-result m-t-xs"><a><span ng-click="add_cond_line1($event)"><i class="fa fa-plus"></i>增加一行</span></a> '
                        + '         <a   ng-click="add_cond1($event)"   style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a></div> '
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
                        + ' 					    <td> ' + sinputhtml + '</td> '
                        + ' 					    <td> ' + einputhtml + '</td> '
                        + ' 						<td class="text-center"><a  class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>   '
                        //	+' 						     <a  ng-click="add_cond1($event)"   style="margin-left:15px;cursor:pointer">添加条件</a> '
                        + ' 					    </td> '
                        + ' 					</tr> '
                        + ' 				</tbody> '
                        + ' 			</table> '
                        + ' 	       <div class="filter-result m-t-xs"><a><span  ng-click="add_cond_line1($event)"><i class="fa fa-plus"></i>增加一行</span></a> '
                        + '	       <a  ng-click="add_cond1($event)"   style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a></div> '
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
                        + ' 					    <td> ' + sinputhtml + '</td> '
                        + ' 					    <td> ' + einputhtml + '</td> '
                        + ' 						<td class="text-center"><a   class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>   '
                        + ' 					    </td> '
                        + ' 					</tr> '
                        + ' 				</tbody> '
                        + ' 			</table> '
                        + ' 	       <div class="filter-result m-t-xs"><a><span  ng-click="add_cond_line1($event)"><i class="fa fa-plus"></i>增加一行</span></a> '
                        + ' 		   <a ng-click="add_cond1($event)" style="margin-left:15px;cursor:pointer"><i class="fa fa-arrow-circle-o-down"></i>添加条件</a> </div>'
                        + '    </div>'

                        + ' </div> ';

                }
                var el = $compile(html)(scope);
                var options_name = "options_" + obj.code;
                element.append(el);
            }
        }
    }

    function initSearchgrid() {
        return {
            restrict: 'EA',
            require: '?ngModel',
            scope: {},
            link: function (scope, element, attrs, ngModel, controller) {
                var frmInfo = sessionStorage.getItem("frmInfo");
                if (frmInfo && frmInfo.length) {
                    FrmInfo = JSON.parse(frmInfo);
                    if (FrmInfo.type == 'sqlback') {
                        setTimeout(function () {
                            $('div.high_filter').show();
                        }, 50);
                    }
                }
                // 列出条件字段--条件输入区-右边
                var str = "";
                for (var i = 0; i < FrmInfo.thead.length; i++) {
                    if (FrmInfo.thead[i].type == "boolean") { // 单选型
                        str = str + common_sql.createConditionBoolean(FrmInfo.thead[i]);
                    } else if (FrmInfo.thead[i].type == "list") { // 多选型
                        str = str + common_sql.createConditionList(FrmInfo.thead[i]);
                    } else {// 字符、数字、日期
                        str = str + common_sql.createConditionNumber(FrmInfo.thead[i]);
                    }
                }
                $("#tab-content").html(str);
                var options = {
                    format: 'yyyy-mm-dd',
                    startView: 'day',
                    todayBtn: true,
                    forceParse: true,
                    language: "zh-CN",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true
                };
                $("#tab-content").find("div[data_type='date']").find("input").datepicker(options);
            }
        }
    }

    function serachMywork($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs) {
                $(element).on("click", ".dropdown-menu>li", function (e) {
                    $timeout(function () {
                        var html = $(e.target).html();
                        $(element).find("a.dropdown-toggle").html(html + " <i class='fa fa-chevron-down'></i> ");
                    });
                });
            }
        }
    }

    function datedayPicker() {
        return {
            restrict: 'AE',
            require: "?ngModel",
            link: function (scope, element, attrs, ngModel) {
                var options = {
                    format: 'yyyy-mm-dd',
                    startView: 'day',
                    todayBtn: true,
                    forceParse: true,
                    language: "zh-CN",
                    multidate: false,
                    autoclose: true,
                    todayHighlight: true
                };
                element.datepicker(options);
            }
        }
    }

    function slickHeight($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, ngModel) {
                $timeout(function () {
                    var titleH = $(".nav.nav-tabs").outerHeight(true);
                    var footH = $(".modal-footer").outerHeight(true);
                    var padding = $(".panel-body").innerHeight() - $(".panel-body").height();
                    $(".tabs-container").height(service.currModalH + 140 - footH - titleH);

                    var row = $(element).siblings();
                    if (!row) {
                        return;
                    }
                    var rowH = 0;
                    for (var i = 0; i < row.length; i++) {
                        rowH += $(row[i]).outerHeight(true);
                    }
                    $(element).height(service.currModalH + 140 - footH - titleH - rowH - padding);
                }, 50);
            }
        }
    }

    function slickTabh($timeout) {
        return {
            restrict: 'AE',
            link: function (scope, element, attrs, ngModel) {
                $timeout(function () {
                    var modal = $(element).parents(".modal");
                    if (!modal) {
                        return;
                    }
                    $(modal[0]).on('shown.bs.modal', function () {
                        var body = $($(element).parents(".modal-body")[0]).height();
                        var title = $($(element).parents(".nav.nav-tabs")[0]).height();
                        var titleH = $($(element).parents(".nav.nav-tabs")[0]).outerHeight(true) || 0;
                        var inlineH = $($(element).parents(".form-inline")[0]).outerHeight(true) || 0;
                        var padding = $($(element).parents(".panel-body")[0]).innerHeight() || 0 - ($(element).parents(".panel-body")[0]).height() || 0;
                        $(element).height(Height - titleH - padding - inlineH);
                    });
                }, 50);
            }
        }
    }

//字符串转数字类型
    /**
     *
     * Pass all functions into module
     */
    /* angular
    .module('inspinia') */
    app
        .directive('pageTitle', pageTitle)
        .directive('sideNavigation', sideNavigation)
        .directive('iboxTools', iboxTools)
        .directive('minimalizaSidebar', minimalizaSidebar)
        .directive('vectorMap', vectorMap)
        .directive('chinaMap', chinaMap)
        .directive('sparkline', sparkline)
        .directive('icheck', icheck)
        .directive('ionRangeSlider', ionRangeSlider)
        //.directive('dropZone', dropZone)
        .directive('responsiveVideo', responsiveVideo)
        .directive('chatSlimScroll', chatSlimScroll)
        .directive('customValid', customValid)
        .directive('fullScroll', fullScroll)
        .directive('closeOffCanvas', closeOffCanvas)
        .directive('fooTable', fooTable)
        .directive('searchThead', searchThead)
        .directive('addsearchThead', addsearchThead)
        .directive('searchTd', searchTd)
        .directive('swfUpload', swfUpload)
        .directive('fileSize', fileSize)
        .directive('fileDownloadUrl', fileDownloadUrl)
        .directive('addDateevent', addDateevent)
        .directive('dateFilter', dateFilter)
        .directive('inputDataValidate', inputDataValidate)
        .directive('turnToEdit', turnToEdit)
        .directive('intToStr', intToStr)
        .directive('tableExpended', tableExpended)
        .directive('contentEditable', contentEdit)
        .directive('wfYstep', wfYstep)
        .directive('workFlow', workFlow)
        .directive('chosenSelect', chosenSelect)
        .directive('agGridview', agGridview)
        .directive('wfView', wfView)
        .directive('bsDatepacker', bsDatepacker)
        .directive('bsDatePicker', bsDatePicker)
        .directive('bsDatetimePicker', bsDatetimePicker)
        .directive('editText', editText)
        .directive('iboxToolsFullScreen', iboxToolsFullScreen)
        .directive('historyList', historyList)
        .directive('autoFocus', autoFocus)
        .directive('pagePagination', pagePagination)
        .directive('attachImg', attachImg)
        //.directive('dropzoneUpload', dropzoneUpload)
        .directive('draggableModel', draggableModel)
        .directive('wrapHeight', wrapHeight)
        .directive('autoHeight', autoHeight)
        .directive('multiSelect', multiSelect)
        .directive('emportExcel', emportExcel)
        .directive('buttonEdit', buttonEdit)
        .directive('flot', flot)
        .directive('intInput', intInput)
        .directive('floatInput', floatInput)
        .directive('eChart', eChart)
        .directive('textInput', textInput)
        .directive('dateFormat', dateFormat)
        .directive('moneyFormat', moneyFormat)
        .directive('numberFormat', numberFormat)
        .directive('addCondtab', addCondtab)
        .directive('initSearchgrid', initSearchgrid)
        .directive('serachMywork', serachMywork)
        .directive('datedayPicker', datedayPicker)
        .directive('slickHeight', slickHeight)
        .directive('slickTabh', slickTabh)
    ;
//.directive('format', format)


    /* HczyCommon
    //基础模块
    .baseModule() */
    app
    /**
     * 流程实例组件
     */
        .directive('hcWf', function ($q, $modal, BasemanService, Magic) {
            return {
                restrict: 'A',
                templateUrl: 'views/baseman/wf_in_bill.html',
                scope: {
                    objType: '@hcWf',
                    biz: '&aBiz'
                },
                link: function (scope, element, attrs) {
                    //随机数
                    var random = (new Date()).getTime();

                    var my = {
                        objConf: null,
                        //wfTempId: '',
                        submit: 0
                    };

                    var hcWf = {
                        submitWf: function () {
                            getWfTemp().then(function () {
                                my.submit = 1;
                                //切换到流程页
                                $('a[href="tabs.html#' + element.parent().attr('id') + '"]').tab('show');
                            });
                        }
                    };

                    scope.$parent.hcWf = function () {
                        return hcWf;
                    };

                    scope.wfSrc = function () {
                        return '';
                    };

                    function wfSrc() {
                        if (!my.objConf)
                            return '';

                        var biz = scope.biz();
                        if (!biz)
                            return '';

                        var id = biz[angular.lowercase(my.objConf.pkfield)];
                        if (hasNoValue(id))
                            return '';

                        var wfTempId = biz.wftempid;
                        if (hasNoValue(wfTempId))
                            wfTempId = my.wfTempId;

                        if (hasNoValue(wfTempId)) {
                            /*if (angular.isUndefined(my.wfTempId))
                            searchWfTempId();*/
                            return '';
                        }

                        var wfId = biz.wfid;
                        if (hasValue(wfId))
                            my.submit = 0;
                        else
                            wfId = '';

                        var objType = scope.objType;

                        var submit = my.submit;

                        return '/web/index.jsp?t=' + random + '#/crmman/wfins'
                            + '/' + wfTempId //流程模板ID
                            + '/' + wfId//流程ID
                            + '/' + objType //对象配置ID
                            + '/' + id //自身ID
                            + '/' + submit //是否提交节点
                            + '?showmode=2';
                    }

                    function hasValue(any) {
                        return any && any !== '0';
                    }

                    function hasNoValue(any) {
                        return !hasValue(any);
                    }

                    /**
                     * 获取流程模板
                     * @return {Promise}
                     */
                    function getWfTemp() {
                        var wfTempId = scope.biz().wftempid;
                        if (hasNoValue(wfTempId))
                            wfTempId = my.wfTempId;

                        if (hasValue(wfTempId))
                            return $q.when(wfTempId);

                        return $modal.open({
                            templateUrl: 'views/baseman/wf_temp_chooser.html',
                            scope: scope, //作用域
                            backdrop: 'static', //静态背景，背景灰色且不可点
                            keyboard: true, //允许按【Esc】退出
                            size: 'md' //大小：中等
                        }).result.then(function (wfTempId) {
                            my.wfTempId = wfTempId;
                            return wfTempId;
                        });
                    };

                    /**
                     * 对象配置请求
                     * @return {Promise}
                     */
                    function rqObjConf() {
                        return BasemanService.RequestPost('scpobjconf', 'select', {
                            objtypeid: scope.objType
                        });
                    }

                    /**
                     * 调用后台方法执行SQL语句，依据后台返回替换变量值
                     * @param {string} condStr
                     * @returns {Promise}
                     */
                    function execSQLCond(condStr) {
                        var reg = /##.*?##/g; //匹配带双井号的内容
                        var sqlArray = condStr.match(reg);
                        if (!sqlArray || !sqlArray.length)
                            return $q.resolve(condStr);

                        return $q.all(sqlArray
                            .map(function (sql) {
                                return sql.substr(2, sql.length - 4);
                            })
                            .map(function (sql) {
                                return BasemanService.RequestPost('sqltool', 'execsql', {sql: sql});
                            }))
                            .then(function (responses) {
                                return responses.map(function (response) {
                                    return response.sqlresult;
                                });
                            })
                            .then(function (resultArray) {
                                var jsArray = condStr.split(reg);

                                return jsArray.reduce(function (result, e, i) {
                                    return result + resultArray[i - 1] + e;
                                });
                            })
                            ;
                    }

                    function searchWfTempId() {
                        return $q
                            .when()
                            .then(function () {
                                var objConf = my.objConf;

                                if (Magic.isNotEmptyArray(objConf.objwftempofobjconfs)) {
                                    return $q.all(objConf.objwftempofobjconfs.map(function (wfTemp) {
                                        wfTemp.execcond = wfTemp.execcond.replace(/<objid>/g, Magic.toNum(scope.biz()[objConf.pkfield.toLowerCase()]))
                                        return execSQLCond(wfTemp.execcond)
                                            .then(function (execcond) {
                                                wfTemp.execcond = execcond;
                                                return wfTemp;
                                            });
                                    }));
                                }
                            })
                            .then(function (wfTemps) {
                                scope.wfTemps = wfTemps.filter(function (wfTemp) {
                                    if (wfTemp.execcond) {
                                        //运行表达式，符合条件的才加入列表
                                        var execCond = wfTemp.execcond.replace(new RegExp('<item>', 'gm'), 'scope.biz()');
                                        var result = eval(execCond);
                                        console.log('execCond: ' + execCond + ' ' + result);
                                        return result;
                                    }
                                    else
                                        return true;
                                });

                                if (scope.wfTemps.length === 1) {
                                    my.wfTempId = scope.wfTemps[0].wftempid;
                                }
                                else {
                                    my.wfTempId = '';
                                }
                            })
                    }

                    rqObjConf()
                        .then(function (objConf) {
                            if (!objConf.objtypename) {
                                console.error('对象类型【' + scope.objType + '】尚未配置');
                                return;
                            }

                            my.objConf = objConf;

                            //监视主键的值
                            var watchDestroyer = scope.$watch('biz().' + objConf.pkfield.toLowerCase(), function (newValue, oldValue) {
                                //没有主键值跳过
                                if (!Magic.toNum(newValue)) return;

                                watchDestroyer(); //销毁监视器

                                searchWfTempId(); //查询匹配的流程模板ID
                            });
                        })
                        /*.then(function () {
                        var objConf = my.objConf;

                        if (Magic.isNotEmptyArray(objConf.objwftempofobjconfs)) {
                            return $q.all(objConf.objwftempofobjconfs.map(function (wfTemp) {
                                wfTemp.execcond = wfTemp.execcond.replace(/<objid>/g, Magic.toNum(scope.biz()[objConf.pkfield.toLowerCase()]))
                                return execSQLCond(wfTemp.execcond)
                                    .then(function (execcond) {
                                        wfTemp.execcond = execcond;
                                        return wfTemp;
                                    });
                            }));
                        }
                    })
                    .then(function (wfTemps) {
                        scope.wfTemps = wfTemps.filter(function (wfTemp) {
                            if (wfTemp.execcond) {
                                //运行表达式，符合条件的才加入列表
                                var execCond = wfTemp.execcond.replace(new RegExp('<item>', 'gm'), 'scope.biz()');
                                var result = eval(execCond);
                                console.log('execCond: ' + execCond + ' ' + result);
                                return result;
                            }
                            else
                                return true;
                        });

                        if (scope.wfTemps.length === 1) {
                            my.wfTempId = scope.wfTemps[0].wftempid;
                        }
                        else {
                            my.wfTempId = '';
                        }
                    })*/
                        .then(function () {
                            scope.wfSrc = wfSrc;
                        })
                    ;
                }
            };
        })
        /**
         * 输入组件
         */
        .directive('hcInput', function () {
            return {
                require: '?ngModel',
                restrict: 'A',
                templateUrl: 'views/baseman/hc_input.html',
                scope: {
                    label: '@hcInput',
                    type: '@aType',
                    ngModel: '=aModel',
                    hasButton: '@ngClick',
                    ngClick: '&',
                    readonly: '&aReadonly'
                },
                link: function (scope, element, attrs, ngModelCtrl) {
                    console.info(scope);

                    scope.label_class = {
                        'control-label': true
                    };

                    scope.div_class = {
                        'width_m': scope.hasButton,
                        'input-group': scope.hasButton
                    };

                    scope.input_class = {
                        'width_m': !scope.hasButton,
                        'form-control': true
                    };

                    scope.span_class = {
                        'input-group-btn': true
                    };
                }
            };
        })
    ;

});