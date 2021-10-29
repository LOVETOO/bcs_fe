define(['jquery', 'app', 'swalApi', 'unblockSwalApi', 'directive/hcGrid', 'requestApi', 'promiseApi', 'openBizObj', 'webSocketApi', 'gridApi', 'common'], function ($, app, swalApi, unblockSwalApi, hcGrid, requestApi, promiseApi, openBizObj, webSocketApi, gridApi, common) {

    var hasOwnProp = Object.prototype.hasOwnProperty;

    MainCtrl.$inject = ['$scope', '$state', '$modal', '$timeout', '$rootScope', '$q', '$sce'];

    /**
     * MainCtrl - controller
     */
    function MainCtrl($scope, $state, $modal, $timeout, $rootScope, $q, $sce) {
        $scope.data = {};
        $scope.data.loginUser = {};
        $scope.gridOptions = {
            columnDefs: [{
                field: 'entname',
                headerName: '组织'
            }]
        };
        $scope.ent = {};//搜索数据
        $scope.ent.firstent_list = [];//列表数据
        $scope.ent.searchent_list = [];//搜索列表数据
        $scope.ent.ent_show = 'list';//搜索/列表 切换标示H
        $scope.ent.searchInput = '';//搜索数据
        $scope.ent.entData = {};//保存ent数据
        $scope.ent.showEnt = false;//仅有一个可选组织时按钮隐藏
        var mouseleaveTime = null;//组织切换鼠标移出隐藏定时器
        /**
         * 消息界面相关
         */
        $scope.msgactive = 'message';// 点击左侧工具栏 切换视图 默认展示会话视图

        // 会话
        $scope.imgsrc = '';// 当前登录用户的头像路径 若没上传头像则为空字符串 用于判断头像是否显示用户名的简写
        $scope.peoples = [];// 会话数组
        $scope.active_people = 0;// 控制会话选中的li
        $scope.content = '';// 消息输入框内容
        $scope.chatname = ''; // 对话人名称
        $scope.chats = [];// 聊天记录数组 一个对象为一个联系人 如: {name:'张三',message:[......]} message为该联系人的所有聊天记录
        
        // 联系人
        $scope.active_user = 0;// 控制联系人选中的li
        $scope.onlineUser = [];// 在线用户
        $scope.userInfo = {};// 在线用户信息 默认展示第一个联系人的信息
        
        // 系统通知
        $scope.notices = [// 系统通知列表
            {
                title:'个人中心新的消息功能上线通知',
                author:'admin',
                time:'2019-8-8',
                content: $sce.trustAsHtml('<p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">亲爱的蜂融网用户：</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;"><br style="margin:0px; padding:0px;"></p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 您好！</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;"><br style="margin:0px; padding:0px;"></p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 为了给您提供更优质便捷的服务，我公司技术中心计划在2018年3月6日晚上18:00至20:00进行系统升级和维护。</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;"><br style="margin:0px; padding:0px;"></p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 此次系统升级，内容如下：</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 1、新增加息券功能（在项目详情页进行投资时可选择符合项目条件的加息券）；</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 2、新增免费提现券功能（在提现时可选择使用免费提现券）；</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 3、每月2次免费提现机会更换为每月1号给本平台投资用户发放2张免费提现券，有效期为30天，过期作废。</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 4、IOS系统暂时不支持更新，因此IOS用户无法使用加息券，可以转至 PC端 上查看和使用加息券，对于免费提现券IOS系统是默认使用，如不需使用，请更换至PC端进行提现。</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;"><br style="margin:0px; padding:0px;"></p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 在此期间，蜂融网官方网站、APP、M站，有可能会出现无法进行访问和操作延迟的情况。由此给您带来不便，敬请谅解。</p><p class="p" style="margin-bottom:0px; padding:0px; color:rgb(125, 125, 125); font-family:微软雅黑, &quot;Microsoft YaHei&quot;, 宋体; font-size:14px; text-align:justify;">&nbsp; &nbsp; 感谢您的信任与支持，我们将一如既往竭诚为您服务！</p>')
            }
        ];
        $scope.active_notice = 0;
		$scope.userbean = userbean;
        window.parent.HAS_LOAD = true;
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
            // set_start_tabs();
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
            // $('#Popup').css({
            //     "visibility": "hidden"
            // });
            dom.removeEventListener("mouseup", pophandclick);
        }
        $scope.mouseleave = function () {
            $('#Popup').css({
                "visibility": "hidden"
            });
        }


        var p;
        // $scope.onMouseEnter = function ($event) {
        //     if (p) return;
        //     p = $timeout(400);
        //     p.then(function () {
        //         p = null;
        //         console.log('开始')
        //     });
        // };
        $scope.select_b = function (a, e) {
            // logModOrMenu(a);
            if (p) return;
            p = $timeout(200);
            p.then(function () {
                p = null;
                //有下一级
                if (a.rootmenus.length > 0) {
                    $scope.arrs = a.rootmenus;
                    var oEvent = e || event;
                    var li = $("#" + $(oEvent.target).attr('id')).parent();
                    var css_Popup = $("#Popup").css("visibility");

                    $timeout(function () {
                        var windowH = $(window).height();
                        var collapsingH = $("#collapsing").height();
                        if (windowH - oEvent.clientY < collapsingH) {
                            if (windowH <= collapsingH) {
                                $('#collapsing').css({
                                    "max-height": windowH + 'px',
                                    "margin-top": 0 + 'px',
                                    "overflow-y": 'auto'
                                });
                            }
                            else {
                                var more = oEvent.clientY + collapsingH - windowH;
                                $('#collapsing').css({
                                    "max-height": windowH + 'px',
                                    "margin-top": oEvent.clientY - more - 20 + 'px'
                                });
                            }
                        }
                        else {
                            $('#collapsing').css({
                                "margin-top": oEvent.clientY - 20 + 'px'
                            });
                        }
                        $('#Popup').css({
                            "visibility": "visible"
                        });
                        $('#Popup>i').css({
                            "top": oEvent.clientY + 'px'
                        });
                    }, 100);


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

            });
        }
        $scope.onMouseLeave = function ($event) {
            if (p) {
                $timeout.cancel(p);
                p = null;
                console.log('取消')
            }
        };


        $scope.onClickMod = function (mod) {
            logModOrMenu(mod);
            //如果是弹出式菜单且有下级则跳转到菜单页面
            if (mod.submenushowstyle == '2' && mod.rootmenus.length > 0) {
                $state.go('baseman.menu_explorer', { "id": mod.modid, "title": mod.modname });
            }
        };
        $scope.select_c = function (menu) {
            logModOrMenu(menu);
            $('#Popup').css({
                "visibility": "hidden"
            });
        }

        /**
         * 记录模块或菜单的点击
         * @param {*} modOrMenu 模块或菜单
         */
        function logModOrMenu(modOrMenu) {
            if (!modOrMenu || !modOrMenu.webrefaddr || modOrMenu.logonclick != 2)
                return;

            var isMod = !('menuid' in modOrMenu);

            requestApi.post({
                classId: 'base_sysmenulog',
                action: 'insert',
                data: {
                    objtype: isMod ? 1 : 2, //类型：1=模块、2=菜单
                    objid: modOrMenu[isMod ? 'modid' : 'menuid']
                },
                noShowWaiting: true,
                noShowError: true,
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

        requestApi
            .post("base_modmenu", "getuserallmenu", { "sqlwhere": "1=1" })
            .then(function (response) {
                $scope.mods = response;
            });

        $scope.collections = [];

        /**
         * 标签页相关
         * @since 2019-01-01
         */
        (function () {
            //请勿修改引用
            var allTabs = [],           //所有的标签页头
                displayedTabs = [],     //可见的标签页头
                hiddenTabs = [];        //隐藏的标签页头

            var activeTab = null,       //当前激活的标签页
                homeTab = null;         //首页

            Object.defineProperties($scope, {
                allTabs: {
                    value: allTabs
                },
                displayedTabs: {
                    value: displayedTabs
                },
                hiddenTabs: {
                    value: hiddenTabs
                },
                activeTab: {
                    get: function () {
                        return activeTab;
                    }
                }
            });

            /**
             * 关闭所有标签页
             * @since 2019-01-01
             */
            allTabs.close = function closeAllTabs() {
                allTabs.splice(1, allTabs.length - 1);              //删除除【首页】之外的标签页
                displayedTabs.splice(1, displayedTabs.length - 1);  //删除除【首页】之外的标签页
                hiddenTabs.splice(0, hiddenTabs.length);            //删除所有隐藏的标签页
                homeTab.active = true; //激活【首页】
            };

            /**
             * 关闭其他标签页
             * @since 2019-01-01
             */
            allTabs.closeOthers = function closeOtherTabs() {
                allTabs.splice(1, allTabs.length - 1);              //删除除【首页】之外的标签页
                displayedTabs.splice(1, displayedTabs.length - 1);  //删除除【首页】之外的标签页
                hiddenTabs.splice(0, hiddenTabs.length);            //删除所有隐藏的标签页

                //若有非【首页】的激活标签页
                if (activeTab && !activeTab.isHome) {
                    //放回标签页组
                    displayedTabs.push(activeTab);
                    allTabs.push(activeTab);
                }
                //否则激活【首页】
                else
                    homeTab.active = true;
            };

            Object.defineProperties(hiddenTabs, {
                //隐藏的标签页组是否处于激活状态
                active: {
                    get: function () {
                        return !!this.find(function (tab) {
                            return tab.active;
                        });
                    }
                }
            });

            /**
             * 路由开始变化事件
             * @since 2019-01-01
             */
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                //若要打开子页面，阻止默认事件
                if (toState.name !== 'home')
                    event.preventDefault();

                var title = toParams.title || (toState.name === 'crmman.myhome' && '首页') || toState.title || toState.name;

                toParams.title = title;

                var existedTab = allTabs.find(function (tab) {
                    return tab.state === toState && angular.equals(tab.params, toParams);
                });

                //若要打开的子页面已存在，激活即可
                if (existedTab) {
                    existedTab.active = true;
                    return;
                }

                var prevTab = allTabs.length ? allTabs[allTabs.length - 1] : null;

                var tab = {
                    state: toState,
                    params: toParams,
                    url: location.pathname + '?' + $.param({
                        v: top.rev,
                        t: +new Date()
                    }) + $state.href(toState, toParams),
                    prevTab: prevTab,
                    nextTab: null
                };

                if (prevTab)
                    prevTab.nextTab = tab;

                Object.defineProperties(tab, {
                    //标签页名称
                    name: {
                        value: title,
                        writable: true
                    },
                    //标签页原名
                    originalName: {
                        value: title
                    },
                    //标签页激活状态
                    active: {
                        get: function () {
                            return this === activeTab;
                        },
                        set: function (active) {
                            if (active === true)
                                activeTab = this;
                            else if (active === false)
                                activeTab = null;
                        }
                    },
                    //是否首页
                    isHome: {
                        get: function () {
                            return this.state.name === 'crmman.myhome';
                        }
                    },
                    //不可关闭
                    unclosable: {
                        get: function () {
                            //首页不可关闭
                            return this.isHome;
                        }
                    }
                });

                /**
                 * 关闭标签页
                 * @since 2019-01-01
                 */
                tab.close = function closeTab() {
                    var prevTab = this.prevTab,
                        nextTab = this.nextTab;

                    if (prevTab)
                        prevTab.nextTab = nextTab;

                    if (nextTab)
                        nextTab.prevTab = prevTab;

                    if (this.active)
                        activeTab = nextTab || prevTab;

                    this.prevTab = this.nextTab = null;
                    //获取对象Id  清空dom
                    /* var id = Number(this.$$hashKey.substring(this.$$hashKey.lastIndexOf(":") + 1)) + 1;
                    var windowobj = $("#iframe_" + id)[0].contentWindow;
                    if (windowobj) {
                        //调用控制器的对象清理方法
                        if (windowobj.destoryObj) {
                            windowobj.destoryObj();
                        }
                        windowobj.document.write('');
                        windowobj.document.clear();
                        windowobj = null;
                    }*/
                    allTabs.splice(allTabs.indexOf(this), 1);

                    resize();
                };

                tab.active = true;
                if (tab.isHome) homeTab = tab;

                allTabs.push(tab);

                resize();
            });

            /**
             * 重新调整大小
             */
            function resize() {
                // var max = $(".hc-header-tab").innerWidth(),
                //     overlength = false;

                // displayedTabs.splice(0, displayedTabs.length);
                // hiddenTabs.splice(0, hiddenTabs.length);

                // allTabs.forEach(function (tab) {
                //     if (overlength) {
                //         hiddenTabs.push(tab);
                //     }
                //     else {
                //         var tabs = $(".hc-header-tab .hc-nav-tabs li"),
                //             tabsl = 0;
                //         for (var i = 0; i < tabs.length; i++) {
                //             tabsl += $(tabs[i]).outerWidth(true) - 5;
                //         }
                //         if (tabsl > max - 100) {
                //             overlength = true;
                //             hiddenTabs.push(tab);
                //         }
                //         else {
                //             displayedTabs.push(tab);
                //         }
                //     }
                // });
                var max = 99999,
                    len = 0,
                    overlength = false;
                displayedTabs.splice(0, displayedTabs.length);
                hiddenTabs.splice(0, hiddenTabs.length);

                allTabs.forEach(function (tab) {
                    if (overlength) {
                        hiddenTabs.push(tab);
                    }
                    else {
                        len += (tab.name || '').length + 1.5;
                        if (len > max) {
                            overlength = true;
                            hiddenTabs.push(tab);
                        }
                        else {
                            displayedTabs.push(tab);
                        }
                    }
                });
                var tablist = $(".hc-header-tab ul"),
                    tableft = parseInt(tablist.css('marginLeft'));
                    tabw = $(".hc-header-tab").outerWidth(true),
                    tablistw = $(".hc-header-tab ul").outerWidth(true);
                    if (tablistw > tabw - 120) {
                        $(".hc-header-tab ul").css("margin-left", tableft - 80 + "px");
                        $(".js-tab-btn").show();
                    }
                    if (tableft >= 0 && tablistw < tabw - 120) {
                        $(".js-tab-btn").hide();
                    }

            }

            //若是主窗口，打开首页
            if (window === top && $state.is('home'))
                $state.go('crmman.myhome');
        })();

        $scope.gethidtabstat = function () {
            for (var i = 0; i <= $scope.toptabs.length - 1; i++) {
                if ($scope.toptabs[i].current) return false;
            }
            return true;
        };

        function btnClick() {
            var promise = requestApi.post("scpallemail", "all_email_wdqty", {});
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
                var promise = requestApi.post("base_collectio_user", "insert", cur);
                promise.then(function (data) {
                    $scope.collections.push(cur);
                });
            }
        }

        $scope.removecoll = function (index) {

            var postdata = {
                webrefaddr: $scope.collections[index]
            };
            var promise = requestApi.post("base_collectio_user", "update", postdata);
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
            var postdata = { flag: 1 };
            var promise = requestApi.post("scpallwf", "selectnew", postdata);
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
            var promise = requestApi.post("login", "setuserpassword", postdata);
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

        $scope.onMenuClick = function () {
            console.log('click menu', this);
        };

        /*===========================================切换组织  start=================================*/
        /**
         * 切换组织
         */
        $scope.setEnt = function (row) {
            requestApi.post('login', 'changeenterprise', row)
                .then(function () {
                    location.reload()
                });
        }

        /**
         * 切换组织下拉列表数据获取
         */
        $scope.getEnt = function () {
			$scope.ent.entData = userbean;
			var entidall = [];
			Array.prototype.push.apply(entidall, JSON.parse($scope.ent.entData.loginuserifnos[0].entidall));

			if (entidall.length > 1) {
				$scope.ent.showEnt = true;
			}
            $scope.ent.all_list = JSON.parse($scope.ent.entData.loginuserifnos[0].entidall);
			//1 
			for (var i = 0; i < entidall.length; i++) {
				var row = JSON.parse(JSON.stringify(entidall[i]));
				if (row.set_of_books_id == row.entid) {
					row.secondent_list = [];//创建放置第二层数组的变量
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

			//默认展开当前帐套父节点
			for (var i = 0; i < $scope.ent.firstent_list.length; i++) {
				var fitem = $scope.ent.firstent_list[i];
				for (var j = 0; j < fitem.secondent_list.length; j++) {
					var sitem = fitem.secondent_list[j];
					if ($scope.ent.entData.loginuserifnos[0].entid == sitem.entid) {
						fitem.show = true;
						fitem.current = true;
					}
				}
			}
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
            $scope.changeOver();
        };

        (function(){
            //缓存组织信息
            var entidall = JSON.parse($scope.ent.entData.loginuserifnos[0].entidall);
            
            //查询默认登陆组织
            requestApi.post({
                classId: 'scpuserprofile',
                action: 'selectDefLogin',
                data: {}
            }).then(function(data){
                if (entidall.length == 1) {
                    if(data.userprofileofusers[0].confvalue != entidall[0].entid){
                        data.userprofileofusers[0].confvalue = entidall[0].entid;
                    }
                    //更新数据库默认登陆组织
                    $modalScope.userconf[0].confvalue = args.data.entid;
                    return requestApi.post({
                        classId: 'scpuserprofile',
                        action: 'update',
                        data: data.userprofileofusers[0]
                    });
                }else{
                    var flag = true;
                    //设置默认登陆组织
                    entidall.forEach(function(value){
                        if(value.entid == data.userprofileofusers[0].confvalue){
                            //已选择默认组织
                            flag = false;
                        }
                    });
                    if(flag){
                        //未选择默认组织
                        swalApi.error("还未选择登陆的默认组织，请先选择默认组织")
                        .then($scope.cutEnt);
                    }
                }
            });
        })();

        /**
         * 切换组织
         */
        $scope.cutEnt = function(){
            var html = 
                 '<div id="controllers_setEnt_top" style="font-family: "Microsoft YaHei","open sans","Helvetica Neue",Helvetica,Arial,sans-serif;font-size: 13px;">'
                +'  <div ng-repeat="work in entidall" ng-class="\'div-click-color\'+{{work.entid}}"'
                +'        style="padding: 3px 20px" ng-click="clickSpan(work)" ng-dblclick="dbClickSpan()">'
                +'    <span style="padding:0 2px 0 2px; border-radius: 5px;background-color:rgb(231,249,255);">'
                +'        &nbsp;&nbsp;&nbsp;{{ work.entid }}&nbsp;&nbsp;&nbsp;</span>'
                +'    <span>&nbsp;&nbsp;&nbsp;{{ work.entname }}</span>'
                +'    <span ng-class="\'span-radiu\'+{{work.entid}}" '
                +'        style="float: right; display: inline-block; height: 13px;'
                +'        border-radius: 100px;width: 13px; border: 1px solid #dbe0e8;"></span>'
                +'  </div>'
                +'  <span ng-init="changeColor()"></span>'
                +'</div>';
            //查询默认登陆组织
            requestApi.post({
                classId: 'scpuserprofile',
                action: 'selectDefLogin',
                data: {}
            }).then(function(data){
                $modal.open({//打开模态框
                    template : html,
                    height:300,
                    width:350, 
                    controller: ['$scope',
                        function ($modalScope) {
                            $modalScope.title = "默认登陆设置";

                            //缓存查询的默认组织信息
                            $modalScope.userconf = data.userprofileofusers;

                            //单击事件
                            $modalScope.clickSpan = function(work){
                                //修改默认组织id为单击选中id
                                $modalScope.userconf[0].confvalue = work.entid;
                                $modalScope.entidall.forEach(function(value){
                                    /**
                                     * 将选中的行修改颜色
                                     * 并缓存id与name
                                     */
                                    if(value.entid == work.entid){
                                        //修改文字颜色
                                        $('.div-click-color' + value.entid).css('color','rgb(59,169,255)');
                                        //修改选中颜色
                                        $('.span-radiu' + value.entid).css('backgroundColor','rgb(59,169,255)');
                                        //修改选中边框颜色
                                        $('.span-radiu' + value.entid).css("border","1px solid rgb(59,169,255)");
                                        //缓存id与name
                                        $modalScope.defaultEntId = value.entid;
                                        $modalScope.defaultEntName = value.entname;
                                    }else{
                                        //将其他行颜色恢复
                                        $('.div-click-color' + value.entid).css('color', '#000');
                                        $('.span-radiu' + value.entid).css('backgroundColor','white');
                                        $('.span-radiu' + value.entid).css("border","1px solid #dbe0e8");
                                    }
                                });
                                
                            }
                            //缓存组织信息
                            $modalScope.entidall = JSON.parse($scope.ent.entData.loginuserifnos[0].entidall);
                            
                            //修改默认选择
                            $modalScope.changeColor = function(){
                                //循环所有的组织
                                $modalScope.entidall.some(function(value){
                                    //找到默认组织
                                    if(value.entid == $modalScope.userconf[0].confvalue){
                                        //赋值id与name
                                        $modalScope.defaultEntId = value.entid;
                                        $modalScope.defaultEntName = value.entname;
                                        //创建一个定时器
                                        var intervalId = setInterval(function () {
                                            var $element = $('.span-radiu' + value.entid);
                                            if ($element.length) {//符合条件
                                                clearInterval(intervalId);//销毁
                                                //默认的组织修改选中颜色
                                                $element.css('backgroundColor','rgb(59,169,255)');
                                                //默认的组织修改选中边框颜色
                                                $element.css("border","1px solid rgb(59,169,255)");
                                                //默认的组织修改选中文字颜色颜色
                                                $('.div-click-color' + value.entid).css('color','rgb(59,169,255)');

                                                //放大按钮隐藏
                                                $('#controllers_setEnt_top').parent().parent().find('button.modmax').hide();
                                                //确定按钮修改颜色
                                                $('#controllers_setEnt_top').parent().parent().find('[hc-btn-group-id="group_ok"]:eq(0)').find('button').css("backgroundColor","#2796ff");
                                                //确定按钮修改样式
                                                $('#controllers_setEnt_top').parent().parent().find('[hc-btn-group-id="group_ok"]:eq(0)').find('button').css("border","1px solid #2796ff");
                                                //隐藏确定按钮图标
                                                $('#controllers_setEnt_top').parent().parent().find('[hc-btn-group-id="group_ok"]:eq(0)').find('i').hide();
                                                //隐藏关闭按钮图标
                                                $('#controllers_setEnt_top').parent().parent().find('[hc-btn-group-id="group_close"]:eq(0)').find('i').hide();
                                            }
                                        }, 300);
                                        return true;
                                    }
                                });
                            }
                            //切换默认组织
                            $modalScope.dbClickSpan = function(){
                                return requestApi.post({
                                    classId: 'scpuserprofile',
                                    action: 'update',
                                    data: $modalScope.userconf[0]
                                }).then(function(){
                                    //切换成功
                                    $modalScope.$close();
                                    unblockSwalApi
                                        .success("已成功设置" 
                                            + $modalScope.defaultEntId
                                            + " "
                                            + $modalScope.defaultEntName
                                            + " 为默认登陆账套");
                                });
                            };
                            angular.extend($modalScope.footerRightButtons, {
                                ok: {
                                    title: '确定',
                                    click: function () {
                                        return $modalScope.dbClickSpan();
                                    }
                                }
                            });
                        }]
                });
            });
        }

        /**
         * 搜索回车监听
         */
        $scope.enterEnt = function (e) {
            var keycode = window.event ? e.keyCode : e.which;
            if (keycode == 13) {
                $scope.searchEnt();
            }
        };

        /**
         * 下拉显示隐藏
         */
        $scope.showEnt = function (fitem) {
            fitem.show ? fitem.show = false : fitem.show = true;
            $scope.changeOver();
        };

        /**
         * 阻止下拉列表关闭
         */
        // $("body").on('click', '[data-stopPropagation]', function (e) {
        //     e.stopPropagation();
        // });

        /**
         * 切换组织下拉列表移出关闭定时器
         */
        $scope.mouseleaveEnt = function () {
            mouseleaveTime = setTimeout(function () {
                $('#entLabel').dropdown('toggle');
                mouseleaveTime = null;
            }, 500);
        };

        /**
         * 鼠标移出后切换组织后没关闭时移入则停止关闭定时器
         */
        $scope.mouseenterEnt = function () {
            if (mouseleaveTime) {
                clearTimeout(mouseleaveTime);
                mouseleaveTime = null;
            }
        }

        /**
         * 判断高度变化
         */
        $scope.changeOver = function () {
            var dom = $('.search-mh');
            $timeout(function () {
                if (dom.height() >= 500) {
                    dom.addClass('search-over')
                } else {
                    dom.removeClass('search-over')
                }
            }, 0)
        };
        $scope.timeouts = [];//通知定时器数组
        promiseApi.whenTrue(function () {
            return $('div.notices').length > 0
        }).then(function () {
            $('div.notices').hover(function () {
                $scope.timeouts.map(function (item, i) {
                    $timeout.cancel(item.timeout);
                    item.div.find("div.notice-right").click(function () {
                        if (item.data.msgtype == 10) {
                            var url = "/web/index.jsp";
                            url += $state.href('baseman.mail', { emailid: item.data.objid });
                            window.open(url);
                        } else if (item.data.msgtype == 12) {
                            return openBizObj({
                                wfId: item.data.objid
                            }).result;
                        }
                    });
                    item.div.find("i.iconfont").click(function () {
                        item.div.css('opacity', 0);
                        $timeout(function () {
                            item.div.remove();
                            $scope.timeouts.splice(i, 1);
                        }, 500);
                    })
                });
            }, function () {
                $scope.timeouts.map(function (item) {
                    item.timeout = null;
                    var t = $timeout(function () {
                        item.div.css('opacity', 0);
                        return item.div
                    }, 2000);
                    item.timeout = t;
                    t.then(function (div) {
                        $timeout(function () {
                            div.remove();
                            $scope.timeouts.shift();
                        }, 1000)
                    });
                });
            })
        });

        /**
         * webSocket通知
         */
        webSocketApi.on(function (data) {
            if (data.msgtype == 1) {// 文本个人消息
                if (data.touser == userbean.username && data.fromuser != userbean.username) {// 判断收到的消息是不是发送给自己的
                    var bool = true;
                    $scope.$apply(function () {
                        $scope.peoples.forEach(function (people, index) {
                            // 判断会话中有没有对应的发送人 如果有则更新 没有则插入
                            if (people.name == data.fromuser) {
                                //更新时间 和最后一条消息内容
                                people.time = timeChange(data.msgtime);
                                people.preview = data.msgcontent;
                                bool = false;
                                // 更新聊天记录数组
                                $scope.chats[index].message.push(data);
                            }
                        });
                        if (bool) {
                            if ($scope.peoples.length == 0) {
                                $scope.chatname = data.fromuser;
                            }
                            $scope.peoples.push({
                                name: data.fromuser,
                                time: timeChange(data.msgtime),
                                preview: data.msgcontent,
                                imgsrc: data.imgsrc,
                                showname: data.showname
                            });
                            $scope.chats.push({
                                name: data.fromuser,
                                message: [data]
                            });

                        }
                    });
                    $scope.scrolldown();
                }
                return;// 不弹出提示框
            }
            return $q.when().then(function () {
                return $('<div class="notice"><div class="notice-left"><i class="iconfont hc-notices"></i></div><div class="notice-right">' + data.msgcontent + '</div><i class="iconfont hc-wrong"></i></div>').prependTo($('div.notices'));
            }).then(function (div) {
                $timeout(function () {
                    div.css('opacity', 1);
                }, 100);
                var obj = {};
                var t = $timeout(function () {
                    div.css('opacity', 0);
                    return div
                }, 3000);
                obj.timeout = t;
                obj.div = div;
                obj.data = data
                $scope.timeouts.push(obj);
                t.then(function (div) {
                    $timeout(function () {
                        div.remove();
                        $scope.timeouts.shift();
                    }, 1000);
                });
            });
        })
        /*===========================================切换组织  end=================================*/

        /**
         * 获取头像
         */
        requestApi.post("scpuser", "select", { "userid": strUserId })
            .then(function (result) {
                $scope.headimgdocid = result.headimgdocid;
                if($scope.headimgdocid != '0'){
                    $scope.imgsrc = "http://clouddev.server.hczhiyun.com:8080/downloadfile?docid=" + $scope.headimgdocid + "&viewtype=1";
                }else{
                    $scope.imgsrc = '';
                }
            });
        /**
         * 打开个人设置页
         */
        $scope.openMySettings = function () {
            location = $state.href('baseman.mysettings');
        };

        /**
         * 聊天记录滚动到底部 每当收到一条消息或发送一条消息时调用
         */
        $scope.scrolldown = function (e) {
            setTimeout(function () {
                var chat = $('div.active-chat');
                var height = chat.prop('scrollHeight');
                chat.scrollTop(height);
            }, 100);
        }
        
        $scope.scrolldown();
        // 点击工具条切换内容
        $scope.changeMsgView = function (type) {
            $scope.msgactive = type;
        }

        // 点击消息弹出对话框
        $scope.showMsgView = function () {
            $('div.wrapper').css('right', '10px');
        }

        // 隐藏对话框
        $scope.hideMsgView = function () {
            $('div.wrapper').css('right', '-850px');
        }

        // 切换会话
        $scope.showPeople = function (index, name) {
            $scope.active_people = index;
            $scope.chatname = name;
            // 滚动到底部
            $scope.scrolldown();
        }

        // 切换在线好友信息
        $scope.showUser = function (i, user) {
            $scope.active_user = i;
            $scope.userInfo = user;
        }

        // 获取在线用户
        requestApi.post('imutil', 'getonlineusers', {}).then(function (data) {
            console.log(data);
            data.onlineusers.forEach(function (user) {
                user.showname = nameFilter(user.username);
                if (user.headimgdocid != '0') {
                    user.imgsrc = "http://clouddev.server.hczhiyun.com:8080/downloadfile?docid=" + user.headimgdocid + "&viewtype=1";
                } else {
                    user.imgsrc = '';
                }
            });
            $scope.onlineUser = data.onlineusers;
            // 默认展示第一个联系人的信息
            $scope.userInfo = $scope.onlineUser[0];
        });

        // 会话发送消息按钮 调用websocket
        $scope.chatSend = function () {
            /**
             * msgid 聊天记录id 主键
             * loginuser 登录者
             * fromuser 发送者
             * touser 接收者
             * msgtype 文本类型为1 系统通知为9  邮件10 流程12
             * msgcontent 文本内容
             * msgstat 文本阅读状态 1未读 2已读
             * msgtime 时间 与计算机元年相差的毫秒数
             * imgsrc 这里是发送人的图片路径
             * showname 这里是发送人的名字简称
             */
            var obj = {
                msgid: null,
                fromuser: userbean.userid,
                touser: $scope.chatname,
                msgtype: 1,
                msgcontent: $scope.content,
                msgtime: new Date().getTime(),
                imgsrc:$scope.imgsrc,
                showname:nameFilter(userbean.username)
            };
            webSocketApi.send(obj).then(function (data) {
                if (data == 'e') {
                    swalApi.error('服务器正在重启中，请稍后重试');
                    return;
                } else {
                    $scope.chats[$scope.active_people].message.push(data);
                    $scope.peoples[$scope.active_people].preview = data.msgcontent;
                    $scope.peoples[$scope.active_people].time = timeChange(data.msgtime);
                }
            }).then(function () {
                $scope.scrolldown();
                $scope.content = '';
                $scope.$apply();
            });
        }
        // 联系人发送消息按钮 切换到对应会话
        $scope.peopleSend = function (user) {
            var bool = true;
            $scope.peoples.forEach(function (people, index) {
                if (people.name == user.username) {
                    //如果会话数组中，有相同名字的，则将该列表设置为active 并跳转
                    $scope.active_people = index;
                    // 切换视图
                    $scope.msgactive = 'message';
                    $scope.chatname = user.username;
                    bool = false;
                }
            });
            if (bool) {
                $scope.peoples.push({
                    name: user.username,
                    time: timeChange(new Date().getTime()),
                    preview: '',
                    imgsrc: user.imgsrc,
                    showname: user.showname
                });
                $scope.chats.push({
                    name: user.username,
                    message: []
                });
                $scope.active_people = $scope.peoples.length - 1;
                $scope.chatname = user.username;
                // 切换视图
                $scope.msgactive = 'message';
            }
        }

        // 会话时间过滤
        function timeChange(value) {
            var time = new Date(value);
            var settime = new Date(value);
            var setnow = new Date();
            var str = '';
            if (settime.setHours(0, 0, 0, 0) == setnow.setHours(0, 0, 0, 0)) {
                // 判断是否为同一天 当天聊天记录显示时分
                var minutes = time.getMinutes();
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                str = (time.getHours()) + ':' + (minutes);
            } else if ((setnow.setHours(0, 0, 0, 0)) - (settime.setHours(0, 0, 0, 0)) == 86400000) {
                str = "昨天";
            } else {
                var year = time.getFullYear().toString().substr(2);
                var mouth = time.getMonth();
                var date = time.getDate();
                str = year + '/' + (mouth + 1) + '/' + date;
            }
            return str;
        }
        function nameFilter(name) {
            var firStr = name.substr(0, 1).charCodeAt();
            var showname = '';
            if ((firStr >= 0x0001 && firStr <= 0x007e) || (0xff60 <= firStr && firStr <= 0xff9f)) {
                showname = name.substr(0, 1).toUpperCase() + name.substr(1, 1);
            } else {
                showname = name.substr(name.length - 2, 2);
            }
            return showname;
        }
    };

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

});