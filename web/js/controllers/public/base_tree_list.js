/**
 * 树+列表页基础控制器
 * @since 2018-11-02
 */
define(
    ['module', 'controllerApi', 'directive/hcTreeList'],
    function (module, controllerApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q', '$timeout',
            //控制器函数
            function ($scope, $q, $timeout) {

                var $eval = $scope.$eval.bind($scope);

                /**
                 * 定义数据
                 */
                function defineData() {

                    (function () {
                        var keyword = '';

                        Object.defineProperty($scope, 'keyword', {
                            get: function () {
                                return keyword;
                            },
                            set: function (value) {
                                try {
                                    //进入搜索模式
                                    if (!keyword && value) {
                                        $scope.isSearchMod = true;
                                    }
                                    //退出搜索模式
                                    else if (keyword && !value) {
                                        $scope.isSearchMod = false;
                                    }
                                }
                                finally {
                                    keyword = value;
                                }
                            }
                        });
                    })();

                    (function () {
                        var isSearchMod = false;

                        Object.defineProperty($scope, 'isSearchMod', {
                            get: function () {
                                return isSearchMod;
                            },
                            set: function (value) {
                                value = !!value;

                                if (isSearchMod === value) return;

                                isSearchMod = value;

                                //进入搜索模式
                                if (isSearchMod) {
                                    $scope.splitter.position('0%');
                                    $scope.gridOptions.hcApi.setRowData([]);
                                }
                                //退出搜索模式
                                else {
                                    $scope.splitter.position('25%');
                                    $scope.gridOptions.hcApi.setRowData($scope.treeSetting.zTreeObj.getSelectedNodes()[0].hcGridData);
                                }
                            }
                        });
                    })();

                    /* ============================== 工具栏按钮 ============================== */
                    /**
                     * 工具栏按钮定义
                     * id: 按钮ID，唯一，不可变 - string {
					 *     title: 按钮显示名称 - string
					 *     icon: 图标，写类名，用于<i></i>标签 - string
					 *     click: 点击事件 - function({
					 *         id: 按钮ID - string
					 *         def: 按钮定义 - string
					 *         event: 事件对象 - $event
					 *     })
					 *     hide: 隐藏，布尔值或函数，设为函数可动态显隐 - boolean or function({
					 *         id: 按钮ID - string
					 *         def: 按钮定义 - string
					 *     })
					 * }
                     * @since 2018-09-29
                     */
                    $scope.toolButtons = {
                        search: {
                            title: '查询',
                            icon: 'iconfont hc-search',
                            hide: true,
                            click: function () {
                                $scope.search && $scope.search();
                            }
                        },
                        refresh: {
                            title: '刷新',
                            icon: 'iconfont hc-refresh',
                            click: function () {
                                $scope.refresh && $scope.refresh();
                            }
                        },
                        openProp: {
                            title: '查看详情',
                            icon: '',
                            click: function () {
                                $scope.openProp && $scope.openProp();
                            }
                        },
                        delete: {
                            title: '删除',
                            icon: 'iconfont hc-delete',
                            click: function () {
                                $scope.delete && $scope.delete();
                            }
                        },
                        add: {
                            title: '新增',
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.add && $scope.add();
                            }
                        }
                    };

                    /* ============================== 表格 ============================== */
                    $scope.gridOptions = $scope.gridOptions || {};
                    $scope.gridOptions.columnDefs = $scope.gridOptions.columnDefs || [];
                    if (!$scope.gridOptions.columnDefs.length
                        || $scope.gridOptions.columnDefs[0].type !== '序号')
                        $scope.gridOptions.columnDefs.unshift({
                            type: '序号'
                        });

                    $scope.gridOptions.hcEvents = $scope.gridOptions.hcEvents || {};
                    $scope.gridOptions.hcEvents.cellDoubleClicked = function () {
                        $scope.openProp && $scope.openProp();
                    };

                    $scope.treeSetting = $scope.treeSetting || {};
                    $scope.treeSetting.hcGridOptions = $scope.treeSetting.hcGridOptions || $scope.gridOptions;
                    $scope.treeSetting.callback = $scope.treeSetting.callback || {};

                    $scope.treeSetting.callback.onDblClick = (function (onDblClick) {
                        return function () {
                            onDblClick && onDblClick.apply(this, arguments);

                            $scope.openTreeProp && $scope.openTreeProp();
                        };
                    })($scope.treeSetting.callback.onDblClick);

                    //点击时切换树的标题
                    /* (function (onClick) {
                     $eval('treeSetting.callback.onClick = onClick', {
                     onClick: function (event, treeId, node) {
                     $eval('data.title = title', {
                     title: node.name
                     });

                     if (angular.isFunction(onClick))
                     onClick.apply(null, arguments);
                     }
                     });
                     })($eval('treeSetting.callback.onClick')); */
                }

                /**
                 * 定义函数，所有函数请都定义在此处
                 * @param {object} target 函数定义在哪个对象上
                 */
                function defineFunction(target) {

                    /**
                     * 工具栏按钮是否需要隐藏
                     * @param params = {
					 *     id: 按钮ID - string
					 *     def: 按钮定义 - object
					 * }
                     * @return {boolean}
                     * @since 2018-09-29
                     */
                    target.isToolButtonNeedHide = function (params) {
                        var hide = params.def.hide;

                        if (hide === true)
                            return true;

                        if (angular.isFunction(hide))
                            return hide(params);

                        return false;
                    };

                    /**
                     * 初始化
                     * @since 2018-11-06
                     */
                    target.doInit = function () {
                        return $q.resolve();
                    };

                    /**
                     * 刷新
                     * @since 2018-11-08
                     */
                    target.refresh = function () {
                        if ($scope.isSearchMod)
                            return $scope.gridOptions.hcApi.search();

                        return $scope.treeSetting.hcApi.reload();
                    };

                    /**
                     * 搜索相关
                     */
                    (function () {
                        var delaySearchPromise;

                        function killDelaySearch() {
                            if (!delaySearchPromise) return;

                            $timeout.cancel(delaySearchPromise);
                            delaySearchPromise = null;
                        }

                        target.searchByKeyword = function () {
                            $scope.isSearchMod = true;

                            killDelaySearch();

                            return $scope.gridOptions.hcApi.searchByKeyword($scope.keyword, $scope.keys);
                        };

                        target.onKeywordChange = function () {
                            killDelaySearch();

                            if (!$scope.keyword) return;

                            delaySearchPromise = $timeout($scope.searchByKeyword, 500);

                            delaySearchPromise.then(function () {
                                delaySearchPromise = null;
                            });
                        };
                    })();

                }

                //定义数据
                defineData();

                //在作用域上定义函数
                defineFunction($scope);

                //在 hcSuper 上再定义一次函数，这样子控制器重写函数的时候可以调用父控制器的函数
                defineFunction($scope.hcSuper = $scope.hcSuper || {});

                //执行初始化
                /* $(function () {
                 $timeout(100).then($scope.doInit);
                 }); */

                //给window对象绑定清理对象的方法，此方法会在tab标签页关闭时调用
                window.destoryObj = function () {
                    console.log("...call destoryObj function...");
                    angular.forEach($scope, function (value, key, obj) {
                        if ($.isFunction(obj[key])) {
                            obj[key] = null;
                        }
                    });
                    $scope = null;
                }
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);