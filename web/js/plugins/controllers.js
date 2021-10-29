define(['jquery', 'app', 'swalApi','directive/hcGrid','requestApi'], function ($, app, swalApi,hcGrid,requestApi) {

var hasOwnProp = Object.prototype.hasOwnProperty;

/**
 * MainCtrl - controller
 */
function MainCtrl($scope, $state, localeStorageService, BasemanService, $modal, $timeout, $rootScope) {
    $scope.toptabs = localeStorageService.showtab;
    $scope.data = {};
    $scope.data.loginUser = {};
    $scope.gridOptions = {
        columnDefs: [{
            field: 'entname',
            headerName: '组织'
        }]
    };
    $scope.ent={};//搜索数据
    $scope.ent.firstent_list=[];//列表数据
    $scope.ent.searchent_list=[];//搜索列表数据
    $scope.ent.ent_show='list';//搜索/列表 切换标示
    $scope.ent.searchInput='111';//搜索数据
    $scope.ent.entData={};//保存ent数据
    $scope.ent.showEnt=false;//仅有一个可选组织时按钮隐藏
    var mouseleaveTime=null;

    var userbean = {};
    if (!window.userbean || JSON.stringify(window.userbean) == "{}") {
        $.ajax({
            type: "GET",
            url: "/jsp/authman.jsp",
            data: {
                classid: 'base_search',
                action: 'loginuserinfo',
                format: 'mjson',
                id: Math.random(),
                loginguid: window.strLoginGuid
            },
            async: false,
            success: function (data) {
                if (data) {
                    userbean = JSON.parse(data);
                    userbean.entid = Number(userbean.entid);//登录用户当前属于哪个组织
                    userbean.userauth = {};
                    userbean.userauth = {};
                    if (userbean.loginuserifnos && userbean.loginuserifnos.length > 0) {
                        var stringlist = userbean.loginuserifnos[0].stringofrole.split(",");
                        for (var i = 0; i < stringlist.length; i++) {
                            userbean.userauth[stringlist[i]] = true;
                        }
                    }
                    window.userbean = userbean;
                    //如果当期登录用户不存在登录组织，则去当前用户所携带的所有组织中寻找默认组织，进行赋值
                    if (!userbean.entid && userbean.entidall) {//不存在登录组织
                        //如果当前登录用户只有一个组织，则直接进行该组织赋值，不需要选择登录组织
                        if (userdata.entidall.length == 1) {
                            userbean.entid = Number(userdata.entidall[0].entid);
                            userbean.entname = userdata.entidall[0].entname;
                        } else {
                            for (var k = 0; k < userdata.entidall.length; k++) {
                                if (userdata.entidall[k].is_default == 2) {//默认组织 srcflag
                                    userbean.entid = Number(userdata.entidall[k].entid);//登录用户当前属于哪个组织
                                    userbean.entname = userdata.entidall[k].entname;
                                    break;
                                }
                            }
                        }
                        //如果当前登录用户的权限不存在，则进行再次发包获得当前登录用户的权限 --模拟组织选择
                        if (!userbean.stringofrole && userbean.entid) {
                            function getXMLHttpRequest() {
                                var xhr;
                                if (window.ActiveXObject) {
                                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                                } else if (window.XMLHttpRequest) {
                                    xhr = new XMLHttpRequest();
                                } else {
                                    xhr = null;
                                }
                                return xhr;
                            }

                            function save() {
                                var xhr = getXMLHttpRequest();
                                var url = window.location.origin + "/jsp/authman.jsp?classid=login&action=changeenterprise&format=mjson&" +
                                    "id=" + Math.random() + "&loginguid=" + window.strLoginGuid;
                                xhr.open("post", url, true);
                                var data = {
                                    entid: userbean.entid,
                                    entname: userbean.entname,
                                    sysuserid: userbean.sysuserid
                                };
                                xhr.send(JSON.stringify(data));
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState == 4 && xhr.status == 200) {
                                        //var userdatal = JSON.parse(xhr.responseText);
                                        //console.log(userdatal);
                                        $.ajax({
                                            type: "GET",
                                            url: "/jsp/authman.jsp",
                                            data: {
                                                classid: 'base_search',
                                                action: 'loginuserinfo',
                                                format: 'mjson',
                                                id: Math.random(),
                                                loginguid: window.strLoginGuid
                                            },
                                            async: false,
                                            success: function (data) {
                                                userbean = JSON.parse(data);
                                                userbean.userauth = {};
                                                if (userbean.loginuserifnos && userbean.loginuserifnos.length > 0) {
                                                    var stringlist = userbean.loginuserifnos[0].stringofrole.split(",");
                                                    for (var i = 0; i < stringlist.length; i++) {
                                                        userbean.userauth[stringlist[i]] = true;
                                                    }
                                                }
                                                window.userbean = userbean;
                                            }
                                        });
                                    }
                                };
                            }

                            save();
                        }
                    } else {
                        userbean.userauth = {};
                        var stringlist = userbean.stringofrole.split(",");
                        for (var i = 0; i < stringlist.length; i++) {
                            userbean.userauth[stringlist[i]] = true;
                        }
                    }
                }
            }
        });
    }
    window.parent.HAS_LOAD = true;
    window.parent.userbean = userbean;
    window.curr_Url = window.location.pathname;//打开页面用的url
    if (window.location.origin) {
        window.curr_Url = window.location.origin + window.location.pathname;//打开页面用的url
    }

    //如果有父窗体则隐藏菜单
    if (window.parent && window.parent != window) {
        $rootScope.showmode = 2;
    }

    //将当前登录用户的信息赋值到对应的对象
    if (window.userbean && JSON.stringify(window.userbean) != "{}") {
        $scope.userbean = window.userbean;
        $scope._entname = window.userbean.entname;//当前默认的组织
        $scope._srcflag = 1;//是否缺省

        //如果当前登录组织存在，但是没有权限的时候，进行权限查询
    }
    //window.userbean = userbean;

    var dom = window.document;

    /**打开页面默认显示页**/
    function set_start_tabs() {
        $timeout(function () {
            $scope.start_state = "crmman.myhome";
            $scope.showtab = window.parent.showtab = window.parent.showtab || new Array();
            $scope.hidetab = window.parent.hidetab = window.parent.hidetab || new Array();
            $scope.all_tabs = window.parent.all_tabs = window.parent.all_tabs || new Array();
            //第一次进来才添加首页
            if ($scope.all_tabs.length == 0) {
                var tmp = {
                    name: "首页",
                    state: "crmman.myhome",
                    uri: "#/crmman/myhome",
                    current: true,
                    colse_hide: true
                }
                if (tmp.state == $scope.start_state) {
                    tmp.current = true;
                }
                if (window.location.origin) {
                    tmp.url = window.location.origin + "/web/index.jsp?t=" + (new Date()).getTime() + tmp.uri;
                } else {
                    tmp.url = "/web/index.jsp?t=" + (new Date()).getTime() + tmp.uri;
                }
                $scope.showtab.push(tmp);
                $scope.all_tabs.push(tmp);
            }
            window.parent.base_index = $scope.showtab.length;
        }, 200);
    }

    if (!$scope.all_tabs) {
        set_start_tabs();
    }

    var pophandclick = function (e) {
        e = e || event;
        if (!e) {
            $('#Popup').css({
                "visibility": "hidden"
            });
            return;
        }
        var elem = e.target || e.target;

        while (elem) {
            if (elem.id == "Popup") {
                return;
            }
            elem = elem.parentNode;
        }
        $('#Popup').css({
            "visibility": "hidden"
        });
        dom.removeEventListener("mouseup", pophandclick);
    }
    $scope.mouseleave = function () {
        $('#Popup').css({
            "visibility": "hidden"
        });
    }
    $scope.select_b = function (a, e) {
        //有下一级
        if (a.rootmenus.length > 0) {
            $scope.arrs = a.rootmenus;
            var oEvent = e || event;
            var li = $("#" + $(oEvent.target).attr('id')).parent();
            var css_Popup = $("#Popup").css("visibility");

            if (css_Popup != "visible") {
                $timeout(function () {
                    var windowH = $(window).height();
                    var collapsingH = $("#collapsing").height();
                    if(windowH - oEvent.clientY < collapsingH){
                        if(windowH <= collapsingH){
                            $('#collapsing').css({
                                "max-height": windowH + 'px',
                                "margin-top": 0 + 'px',
                                "overflow-y": 'auto'
                            });
                        }
                        else{
                            var more = oEvent.clientY + collapsingH - windowH;
                            $('#collapsing').css({
                                "max-height": windowH + 'px',
                                "margin-top": oEvent.clientY - more + 'px'
                            });
                        }
                    }
                    else{
                        $('#collapsing').css({
                            "margin-top": oEvent.clientY + 'px'
                        });
                    }
                }, 100);

            }


            $('#Popup').css({
                "visibility": "visible"
            });

            dom.addEventListener("mouseup", pophandclick);
            if (document.getElementById('iframepage')) {
                var framedom = document.getElementById('iframepage').contentWindow.document
            }
            ;
            if (framedom) {
                framedom.addEventListener("mouseup", pophandclick);
            }
            return;
        }
        if (document.getElementById('iframepage')) {
            var framedom = document.getElementById('iframepage').contentWindow.document
        }
        ;
        if (framedom) {
            framedom.addEventListener("mouseup", pophandclick);
        }
        $('#Popup').css({
            "visibility": "hidden"
        });
    }
    $scope.select_c = function () {
        $('#Popup').css({
            "visibility": "hidden"
        });
    }
    document.onclick = function (event) {
        var e = event || window.event;
        var elem = e.srcElement || e.target;

        while (elem) {
            if (elem.id == "Popup") {
                return;
            }
            elem = elem.parentNode;
        }
    }

    $scope.mods = BasemanService.RequestPostSync("base_modmenu", "getuserallmenu", {});

    $scope.toptabsmore = localeStorageService.hidetab;

    $scope.toptabs_baseindex = localeStorageService.base_index;

    $scope.collections = [];

    $scope.allTabs = [];
    $scope.displayedTabs = [];
    $scope.hiddenTabs = [];

    //路由开始变化事件
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        console.log('$stateChangeStart z', arguments);
        if (toState.name !== 'home')
            event.preventDefault();

        var prevTab = $scope.displayedTabs.length ? $scope.displayedTabs[$scope.displayedTabs.length - 1] : null;

        var tab = {
            state: toState,
            params: toParams,
            prevTab: prevTab,
            nextTab: null
        };

        if (prevTab)
            prevTab.nextTab = tab;

        $scope.activeTab = tab;

        $scope.displayedTabs.push(tab);
        $scope.allTabs.push(tab);
    });

    /**
     * 激活标签页
     * @param tabToActivate 要激活的标签页
     */
    $scope.activateTab = function (tabToActivate) {
        $scope.activeTab = tabToActivate;
    };

    /**
     * 关闭标签页
     * @param tabToActivate 要关闭的标签页
     */
    $scope.closeTab = function (tabToClose) {
        var prevTab = tabToClose.prevTab,
            nextTab = tabToClose.nextTab;

        if (prevTab)
            prevTab.nextTab = nextTab;

        if (nextTab)
            nextTab.prevTab = prevTab;

        $scope.activeTab = prevTab || nextTab;
    };

    $scope.gethidtabstat = function () {
        for (var i = 0; i <= $scope.toptabs.length - 1; i++) {
            if ($scope.toptabs[i].current) return false;
        }
        return true;
    };

    function btnClick() {
        var promise = BasemanService.RequestPost("cpcallemail", "all_email_wdqty", {});
        promise.then(function (data) {
            $scope.receivenew_totalqty = data.receivenew_totalqty
            //$scope.$apply();
        });
    }

    //btnClick();

    $scope.getpstate = function (statName) {

        for (var i = $scope.toptabsmore.length - 1; i >= 0; i--) {
            var _curr = $scope.toptabsmore[i];
            //console.log(_curr);
            if (_curr.state == statName) {
                if (i > 0) {
                    return $scope.toptabsmore[i - 1].state;
                } else {
                    return $scope.toptabs[$scope.toptabs.length - 1].state;
                }
            }
        }

        for (var i = $scope.toptabs.length - 1; i >= 0; i--) {
            var _curr = $scope.toptabs[i];
            if (_curr.state == statName) {
                return $scope.toptabs[i - 1].state;
            }
        }

        return "crmman.home";
    }

    $scope.closetab = function (stateName, iscurrent) {
        //alert('closetab');
        if (stateName != 'crmman.home' && stateName != 'crmman.myhome') {
            var alltab = localeStorageService.showtab.concat(localeStorageService.hidetab);
            var p = '';
            for (var i = 0; i < alltab.length; i++) {
                var t = alltab[i];
                if (t.state == stateName) {
                    var _p;
                    if (alltab.length == 2) {
                        _p = alltab[0];
                    } else {
                        if (alltab.length - 1 == i) {
                            _p = alltab[i - 1];
                        } else {
                            _p = alltab[i + 1];
                        }
                    }
                    if (_p) p = _p.state;
                    break;
                }
            }

            // $state.go(p);
            localeStorageService.removetab(stateName);
            localeStorageService.remove(stateName);

            localeStorageService.setcurrent({
                name: p
            });

        }
    }

    //关闭所有标签
    $scope.closetabAll = function () {
        var alltab = localeStorageService.showtab.concat(localeStorageService.hidetab);
        for (var i = 0; i < alltab.length; i++) {
            var t = alltab[i];
            if (t.state == 'crmman.home' || t.state == 'crmman.myhome') {
                $state.go(t.state);
            } else {
                localeStorageService.removetab(t.state);
            }
        }
    }
    //关闭其他标签
    $scope.closetabElse = function () {
        var alltab = localeStorageService.showtab.concat(localeStorageService.hidetab);
        for (var i = 0; i < alltab.length; i++) {
            var t = alltab[i];
            if (t.current != true && t.state != 'crmman.home' && t.state != 'crmman.myhome') {
                localeStorageService.removetab(t.state);
            }
        }
    }

    $scope.getcurrpage = function () {
        var cur = {};

        if ($scope.toptabs && $scope.toptabsmore) {
            for (var i = 0; i < $scope.toptabs.length; i++) {
                if ($scope.toptabs[i].current) {
                    cur.modname = $scope.toptabs[i].name;
                    cur.webrefaddr = $scope.toptabs[i].state;
                    break;
                }
            }
            if (cur.webrefaddr == undefined) {
                for (var i = 0; i < $scope.toptabsmore.length; i++) {
                    if ($scope.toptabsmore[i].current) {
                        cur.modname = $scope.toptabsmore[i].name;
                        cur.webrefaddr = $scope.toptabsmore[i].state;
                        break;
                    }
                }
            }
        }

        return cur;
    }

    $scope.currpagefaved = function () {
        if ($scope.collections) {
            var cur = $scope.getcurrpage();
            for (var i = 0; i < $scope.collections.length; i++) {
                if (cur.webrefaddr == $scope.collections[i].webrefaddr) {
                    return true;
                }
            }
        }
        return false;
    }

    $scope.set_curr = function (obj) {
        var alltab = window.parent.all_tabs;
        for (var i = 0; i < alltab.length; i++) {
            if (alltab[i] === obj) {
                alltab[i].current = true;
            } else {
                alltab[i].current = false;
            }
        }
    }

    // $scope.closetab = function (stateName, iscurrent) {
    //     window.parent.CURR_LOCATION[stateName] = undefined;
    //     window.parent.CURR_STATE_C[stateName] = undefined;
    //     var alltab = window.parent.all_tabs;
    //     localeStorageService.removetab(stateName);
    //     $scope.set_curr(alltab[alltab.length - 1]);
    // }

    $scope.addcurcoll = function () {
        var cur = $scope.getcurrpage();
        if (cur.webrefaddr != undefined) {
            var promise = BasemanService.RequestPost("base_collectio_user", "insert", cur);
            promise.then(function (data) {
                $scope.collections.push(cur);
            });
        }
    }

    $scope.removecoll = function (index) {

        var postdata = {
            webrefaddr: $scope.collections[index]
        };
        var promise = BasemanService.RequestPost("base_collectio_user", "update", postdata);
        promise.then(function (data) {
            $scope.collections.splice(index, 1);
        });
    }

    $scope.callitem = {};
    var ModalInstanceCtrl = function ($scope, $modalInstance, items) {
        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };
        $scope.ok = function () {
            $modalInstance.close($scope.selected);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.delPopup = function (frameindex) {
        for (var i = 0; i < $scope.popupitems.length; i++) {
            if ($scope.popupitems[i].index == frameindex) {
                $scope.popupitems.splice(i, 1);
            }
        }
    }
    $scope.ngPopupOption = {
        width: $(document).width() - 200,
        height: document.body.offsetHeight - 100,
        hasTitleBar: true,
        title: "弹窗信息",
        resizable: false,
        draggable: true,
        onOpen: function () {
            console.log("open");
        },
        onClose: function () {
            $scope.delPopup(this.index);
        },
        onDragStart: function () {
            //        	 this.draggable = true;
        },
        onDragEnd: function () {
            //        	 this.draggable = false;
        },
        onResize: function () {
            console.log("resize");
        }
    }

    $scope.call_login = function (e) {
        var parentScope = document.getElementById("iframe" + ($scope.iframeid - 1))
            .contentWindow.angular.element("div.bill-form").scope();
        // 		var parentScope = angular.element("#MainCtrl").scope();
        if (parentScope && parentScope.search) {
            parentScope.search();
        }
        return;
    }

    $scope.popupitems = []; //弹窗列表
    $scope.iframeid = 1;
    $scope.call_opennotice = function (e) {
        var param = {
            showmode: 2,
            frameid: $scope.iframeid,
            userid: window.strUserId
        }
        var url_param = $.base64.btoa(JSON.stringify(param), true);
        var option = {
            index: $scope.iframeid,
            //			 templateUrl:'/web/views/crmfin/css_appeal_new.html',
            template: '<iframe id=iframe' + $scope.iframeid + ' style="height:95%;width:99%;" ' +
            'src="/web/index.jsp#/crmman/css_appeal_new?param=' + url_param + '" frameborder="0">' +
            '</iframe>',
            modelName: 'muNgPopup' + $scope.iframeid,
            position: {
                top: 100 + $scope.popupitems.length * 10,
                left: -20 + $scope.popupitems.length * 10
            }
        };
        $.extend(option, $scope.ngPopupOption, true);
        var item = {
            options: option
        };
        $scope.iframeid++;
        $scope.popupitems.push(item);
    }

    $scope.$on("$viewContentLoaded", function () {
        console.log("ng-view content loaded!");
    });

    $scope.$on("$routeChangeStart", function (event, next, current) {
        //event.preventDefault(); //cancel url change
        console.log("route change start!");
    });


    //未读流程列表
    $scope.unreadwfs = [];
    var getMyUnReadWfCount = function () {
        var postdata = {flag: 1};
        var promise = BasemanService.RequestPost("cpcallwf", "selectnew", postdata);
        promise.then(function (data) {
            $scope.unreadwfs = data.wfs;
        });
    };

    //非iframe模式启动定时器查询未读流程
    if ($rootScope.showmode != 2) {
        //setInterval(getMyUnReadWfCount, 20000);
    }

    //修改密码
    $scope.chgpsw = function () {
        if (!$scope.data.loginUser.newpass) {
            swalApi.error("请输入新密码!");
            return;
        } else if (!$scope.data.loginUser.renewpass) {
            swalApi.error("请输入确认密码!");
            return;
        } else if ($scope.data.loginUser.newpass != $scope.data.loginUser.renewpass) {
            swalApi.error("两次输入的密码不一致!");
            return
        }
        var postdata = {
            userpass2: $scope.data.loginUser.newpass
        };
        var promise = BasemanService.RequestPost("login", "setuserpassword", postdata);
        promise.then(function (data) {
            if (data.issuccess == "1") {
                swalApi.success("密码修改成功!");//warning
                $("#chgpswModal").modal("hide");
            } else {
                swalApi.error("密码修改失败!");//warning
            }
        });
    }

    //修改密码样式
    $('.form').find('input, textarea').on('keyup blur focus', function (e) {

        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {

            if ($this.val() === '') {
                label.removeClass('highlight');
            } else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }
    });

    //退出确认
    $scope.logout = function () {
        swalApi.confirm('是否退出账号?').then(function () {
            window.location.href = "/web/logout.do";
        });
    }

    //窗口小于768时改变导航栏样式
    $scope.big = ((document.documentElement.clientWidth <= 768) ? false : true);
    $(window).resize(function () {
        if (document.documentElement.clientWidth <= 768 && $scope.big == true) {
            if (!$('body').hasClass('mini-navbar')) {
                $scope.resizeNav();
            }
            $scope.big = false;
        } else if (document.documentElement.clientWidth > 768 && $scope.big == false) {
            if ($('body').hasClass('mini-navbar')) {
                $scope.resizeNav();
            }
            $scope.big = true;
        }
    });

    $scope.resizeNav = function () {
        $("body").toggleClass("mini-navbar");
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 100);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(500);
                }, 300);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    }

    $scope.resizeIni = function () {
        if (document.documentElement.clientWidth <= 768 && !$('body').hasClass('mini-navbar')) {
            $scope.resizeNav();
        } else if (document.documentElement.clientWidth > 768 && $('body').hasClass('mini-navbar')) {
            $scope.resizeNav();
        }
    }
    $scope.resizeIni();


    /**
     * 切换组织
     */
    $scope.setEnt=function (row) {
        requestApi.post('login', 'changeenterprise', row)
            .then(function () {
                location.reload()
            });
    }

    /**
     * 切换组织下拉列表加载
     */
    $scope.getEnt = function () {
        $.ajax({
            type: "GET",
            url: "/jsp/authman.jsp",
            data: {
                classid: 'base_search',
                action: 'loginuserinfo',
                format: 'mjson',
                id: Math.random(),
                loginguid: window.strLoginGuid
            },
            async: false,
            success: function (data) {
                if (data) {
                    $scope.ent.entData = JSON.parse(data);
                    var entidall = JSON.parse($scope.ent.entData.loginuserifnos[0].entidall);

                    if(entidall.length>1){
                        $scope.ent.showEnt=true;
                    }

                    //1
                    for (var i = 0; i < entidall.length; i++) {
                        var row = JSON.parse(JSON.stringify(entidall[i]));
                        if (row.set_of_books_id == row.entid) {
                            row.secondent_list = [];
                            $scope.ent.firstent_list.push(row);
                        }
                    }

                    //2
                    for (var i = 0; i < entidall.length; i++) {
                        var row = JSON.parse(JSON.stringify(entidall[i]));
                        for (var j = 0; j < $scope.ent.firstent_list.length; j++) {
                            var item = $scope.ent.firstent_list[j];
                            if (item.entid == row.set_of_books_id) {
                                item.secondent_list.push(row);
                            }
                        }
                    }
                }
            }
        })
    };
    $scope.getEnt();

    /**
     * 搜索组织
     */
    $scope.searchEnt = function () {
        if ($scope.ent.searchInput === '') {
            $scope.ent.ent_show = 'list';
        } else {
            $scope.ent.searchent_list.length = 0;
            var entidall = JSON.parse($scope.ent.entData.loginuserifnos[0].entidall);
            for (var i = 0; i < entidall.length; i++) {
                var row = JSON.parse(JSON.stringify(entidall[i]));
                if (row.entname.indexOf($scope.ent.searchInput) != -1 || row.entid.indexOf($scope.ent.searchInput) != -1) {
                    $scope.ent.searchent_list.push(row);
                }
            }
            $scope.ent.ent_show = 'search';
        }
    };

    /**
     * 搜索回车监听
     */
    $scope.enterEnt= function(e) {
        var keycode = window.event?e.keyCode:e.which;
        if(keycode==13){
            $scope.searchEnt();
        }
    };

    /**
     * 下拉显示隐藏
     */
    $scope.showEnt=function (fitem) {
        fitem.show?fitem.show=false:fitem.show=true;
    };

    /**
     * 阻止下拉列表关闭
     */
    $("body").on('click','[data-stopPropagation]',function (e) {
        e.stopPropagation();
    });

    /**
     * 下拉列表移出关闭
     */
    $scope.mouseleaveEnt=function () {
        mouseleaveTime=setTimeout(function () {
            $('#entLabel').dropdown('toggle');
            mouseleaveTime=null;
        },500);
    }

    /**
     *
     */
    $scope.mouseenterEnt=function () {
        if(mouseleaveTime){
            clearTimeout(mouseleaveTime);
            mouseleaveTime=null;
        }
    }
};


function historyController($scope, $rootScope, $compile, $timeout, localeStorageService) {

    $scope.stat = false;

    $scope.$on("page_stat", function (event, data) {//当路由变化时
        localeStorageService.setcurrent(data);
        event.preventDefault();
    });

    $scope.clearlist = function () {
        localeStorageService.clearHistoryList();
        $scope.historylist = [];
        $scope.stat = false;
    }

    $scope.selectitem = function () {
        $rootScope.rightSidebar = !$rootScope.rightSidebar
    }
}

function TimerCtrl($scope) {
    $scope.clock = new Date();
    var updateClock = function () {
        $scope.clock = new Date();
    };
    setInterval(function () {
        $scope.$apply(updateClock);
    }, 50000);
    updateClock();
};


/** End navigation */

/* angular
    .module('inspinia') */
app
    .controller('MainCtrl', MainCtrl)
    .controller('historyController', historyController)

});