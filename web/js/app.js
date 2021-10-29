define(
    ['angular', '/web/js/router.jsp?rn='+rn, 'angular-ui-router', 'ocLazyLoad', 'ui-bootstrap-tpls', 'angular-notify'],
    function (angular, router) {
        var appName = 'hcapp';

        var app = angular.module(appName, [
            'ui.router',
            'oc.lazyLoad',
            'ui.bootstrap',
            'cgNotify'
        ]);

        (function () {
            /**
             * 由【父窗口的】 Angular 调用具有依赖的函数
             * @param {object} self 函数的 this 指向
             * @param {object} locals 本地变量域
             */
            function callByParentAngular(self, locals) {
                return parent.$('body').injector().invoke(this, self, locals);
            }

            Object.defineProperty(Function.prototype, 'callByParentAngular', {
                value: callByParentAngular
            });

            Object.defineProperty(Array.prototype, 'callByParentAngular', {
                value: callByParentAngular
            });

            Object.defineProperty(String.prototype, 'asParentAngularService', {
                get: function () {
                    return parent.$('body').injector().get(this);
                }
            });

            /**
             * 由【顶层窗口的】 Angular 调用具有依赖的函数
             * @param {object} self 函数的 this 指向
             * @param {object} locals 本地变量域
             */
            function callByTopAngular(self, locals) {
                return top.$('body').injector().invoke(this, self, locals);
            }

            Object.defineProperty(Function.prototype, 'callByTopAngular', {
                value: callByTopAngular
            });

            Object.defineProperty(Array.prototype, 'callByTopAngular', {
                value: callByTopAngular
            });

            Object.defineProperty(String.prototype, 'asTopAngularService', {
                get: function () {
                    return top.$('body').injector().get(this);
                }
            });
        })();

        app.config(router);
        app.run(router.routerEvent);

        app.controller('noop', angular.noop);

        (function () {
            configFun.$inject = ['$controllerProvider', '$compileProvider', '$provide'];

            function configFun($controllerProvider, $compileProvider, $provide) {
                providers = arguments;

                app.providers = {};

                configFun.$inject.forEach(function (providerName, providerIndex) {
                    provider = providers[providerIndex];
                    app.providers[providerName] = provider;
                });

                app.old = app.old || {};

                app.old.controller = app.controller.bind(app);
                app.controller = function () {
                    $controllerProvider.register.apply($controllerProvider, arguments);
                    return app;
                };

                app.old.directive = app.directive.bind(app);
                app.directive = function () {
                    $compileProvider.directive.apply($compileProvider, arguments);
                    return app;
                };

                app.old.service = app.service.bind(app);
                app.service = function () {
                    $provide.service.apply($provide, arguments);
                    return app;
                };

                app.old.factory = app.factory.bind(app);
                app.factory = function () {
                    $provide.factory.apply($provide, arguments);
                    return app;
                };

                app.old.value = app.value.bind(app);
                app.value = function () {
                    $provide.value.apply($provide, arguments);
                    return app;
                };

                app.old.constant = app.constant.bind(app);
                app.constant = function () {
                    $provide.constant.apply($provide, arguments);
                    return app;
                };
            }

            app.config(configFun);
        })();

        /**
         * 装饰 $q 服务
         */
        (function () {
            app.decorator('$q', ['$delegate', function ($delegate) {
                $delegate.deferPromise = function deferPromise() {
                    var deferred = $delegate.defer();
                    ['resolve', 'reject'].forEach(function (fnName) {
                        deferred.promise[fnName] = deferred[fnName].bind(deferred);
                    });
                    return deferred.promise;
                };

                return $delegate;
            }]);
        })();

        /**
         * 模态框相关配置
         */
        (function () {
            modalConfig.$inject = ['$modalProvider'];

            function modalConfig($modalProvider) {
                //设置模态框默认值
                $modalProvider.options.backdrop = 'static';     //静态：可以看到背景，但无法点击背景
                $modalProvider.options.keyboard = false;        //按【Esc】关闭模态窗口：否
                $modalProvider.options.windowTemplateUrl = 'views/baseman/modal_box.html';  //包裹模态框内容的模板
                // $modalProvider.options.size = 'lg';
            }

            app.config(modalConfig);

            angular.module("template/modal/window.html").run(["$templateCache", function ($templateCache) {
                $templateCache.put("template/modal/window.html",
                    "<div tabindex=\"-1\" role=\"dialog\" class=\"modal fade\" ng-class=\"{in: animate}\" ng-style=\"{'z-index': 2050 + index*10, display: 'block'}\" ng-click=\"close($event)\">\n" +
                    "    <div class=\"modal-dialog\" ng-class=\"{'modal-sm': size == 'sm', 'modal-lg': size == 'lg', 'modal_lgmax': size === 'max' }\"><div class=\"modal-content\" ng-style='{width:$parent.width,height:$parent.height}' modal-transclude></div></div>\n" +
                    "</div>");
            }]);

            angular.module("template/modal/backdrop.html").run(["$templateCache", function ($templateCache) {
                $templateCache.put("template/modal/backdrop.html",
                    "<div class=\"modal-backdrop fade {{ backdropClass }}\"\n" +
                    "     ng-class=\"{in: animate}\"\n" +
                    "     ng-style=\"{'z-index': 2040 + (index && 1 || 0) + index*10}\"\n" +
                    "></div>\n" +
                    "");
            }]);

            /**
             * 通用查询设置的请求
             */
            app.factory('commonSearchSettingRequest', ['$http', function ($http) {
                return function commonSearchSettingRequest(classId) {
                    var url = 'common_search_setting/' + classId + '.json';
                    return $http({
                        method: 'get',
                        url: url,
                        cache: true
                    })
                        .then(
                            function (response) {
                                return response.data;
                            },
                            function (response) {
                                console.error('请求通用查询设置失败，请检查是否已配置通用查询设置', url, response);
                                return {};
                            }
                        );
                };
            }]);

            /**
             * 模态框服务
             * @constructor
             */
            function $Modal() {
            }

            $Modal.prototype.openCommonSearch = function openCommonSearch(commonSearchSetting) {
                if (typeof commonSearchSetting === 'string')
                    commonSearchSetting = {
                        classId: commonSearchSetting
                    };
                else
                    commonSearchSetting = angular.extend({}, commonSearchSetting);

                //显示过时警告
                if (commonSearchSetting.showDeprecated) {
                    console.error(commonSearchSetting.classId, 'BasemanService.open 和各种 BasemanService.chooseXXX 方法已过时，请改用新方式：', 'http://192.168.1.201:8087/web/index.jsp?t=1547188971741#/demo/demo_obj_prop');
                }

                commonSearchSetting.templateUrl = 'views/baseman/common_search.html';

                commonSearchSetting.controller = ['$scope', '$q', '$timeout', 'remoteCommonSearchSetting', function CommonSearchController($scope, $q, $timeout, remoteCommonSearchSetting) {
                    var originalCommonSearchSetting = angular.extend({}, commonSearchSetting);
                    angular.extend(commonSearchSetting, remoteCommonSearchSetting, originalCommonSearchSetting);

                    $scope.title = commonSearchSetting.title || '请选择';
                    $scope.width = commonSearchSetting.width;
                    $scope.height = commonSearchSetting.height;
                    $scope.cellDoubleFunc = commonSearchSetting.cellDoubleFunc;//选择后不关闭模态框并执行一个方法

                    $scope.data = {
                        keyword: '',
                        placeholder: commonSearchSetting.placeholder || '请输入 关键字 进行搜索'
                    };

                    var delaySearchPromise;

                    function killDelaySearch() {
                        if (!delaySearchPromise) return;

                        $timeout.cancel(delaySearchPromise);
                        delaySearchPromise = null;
                    }

                    $scope.search = function () {
                        killDelaySearch();

                        return $scope.gridOptions.hcApi.searchByKeyword($scope.$eval('data.keyword'), commonSearchSetting.keys);
                    };

                    $scope.onKeywordChange = function () {
                        killDelaySearch();

                        if (!$scope.$eval('data.keyword')) return;

                        delaySearchPromise = $timeout($scope.search, 1000);

                        delaySearchPromise.then(function () {
                            delaySearchPromise = null;
                        });
                    };

                    $scope.gridOptions = angular.extend({}, remoteCommonSearchSetting.gridOptions, commonSearchSetting.gridOptions, {
                        hcClassId: commonSearchSetting.classId,
                        hcRequestAction: commonSearchSetting.action || 'search',
                        hcDataRelationName: commonSearchSetting.dataRelationName,
                        hcPostData: commonSearchSetting.postData,
                        hcSqlWhere: commonSearchSetting.sqlWhere,
                        hcSearchWhenReady: commonSearchSetting.searchWhenReady !== false,
                        hcEvents: {
                            cellDoubleClicked: function (params) {
                                if (commonSearchSetting.cellDoubleFunc) {
                                    commonSearchSetting.cellDoubleFunc(params);
                                }
                                else if (commonSearchSetting.checkbox) {
                                    var nodes = $scope.gridOptions.api.getSelectedNodes();
                                    if (!nodes || nodes.length === 0)
                                        $scope.$close([params.node.data]);
                                    else if (nodes.length === 1) {
                                        if (params.node === nodes[0])
                                            $scope.$close([params.node.data]);
                                        else
                                            params.node.setSelected(true);
                                    }
                                    else
                                        params.node.setSelected(true);
                                }
                                else
                                    $scope.$close(params.node.data);
                            }
                        },
                        hcReady: $q.deferPromise()
                    });

                    if (!$scope.gridOptions.columnDefs)
                        $scope.gridOptions.columnDefs = [];

                    if (!$scope.gridOptions.columnDefs.length || $scope.gridOptions.columnDefs[0].type !== '序号') {
                        $scope.gridOptions.columnDefs.unshift({
                            type: '序号'
                        });
                    }

                    $scope.gridOptions.hcReady.then(function (gridOptions) {
                        if (commonSearchSetting.placeholder) return;

                        var keyTitles;

                        if (commonSearchSetting.keys && commonSearchSetting.keys.length) {
                            var fieldToColDef = {};

                            gridOptions.hcApi.forEachChildColumnDef(function (colDef) {
                                if (colDef.field)
                                    fieldToColDef[colDef.field] = colDef;
                            });

                            keyTitles = [];
                            commonSearchSetting.keys.forEach(function (key) {
                                var colDef = fieldToColDef[key];
                                if (colDef)
                                    keyTitles.push(colDef.headerName);
                            });
                        }
                        else {
                            keyTitles = gridOptions.hcApi
                                .getAllChildColumnDefs()
                                .filter(function (colDef) {
                                    return colDef.type !== '序号';
                                })
                                .map(function (colDef) {
                                    return colDef.headerName;
                                });
                        }

                        if (keyTitles.length)
                            $scope.data.placeholder = '请输入 ' + keyTitles.join('/') + ' 进行搜索';
                    });

                    if (commonSearchSetting.checkbox) {
                        $scope.gridOptions.columnDefs[0].checkboxSelection = true;
                    }

                    $scope.footerRightButtons.ok.hide = false;
                    $scope.footerRightButtons.ok.click = function () {
                        if (commonSearchSetting.checkbox)
                            $scope.gridOptions.hcApi
                                .getSelectedNodesWithNotice({
                                    actionName: '选择'
                                })
                                .then(function (nodes) {
                                    $scope.$close(nodes.map(function (node) {
                                        return node.data;
                                    }));
                                });
                        else
                            $scope.gridOptions.hcApi
                                .getFocusedNodeWithNotice({
                                    actionName: '选择'
                                })
                                .then(function (node) {
                                    $scope.$close(node.data);
                                });
                    };

                    if (commonSearchSetting.beforeOk) {
                        (function ($close, beforeOk) {
                            $scope.$close = function (value) {
                                return $q
                                    .when(value)
                                    .then(beforeOk)
                                    .then(function (canOk) {
                                        if (canOk !== false) {
                                            if (typeof canOk === 'object') {
                                                value = canOk;
                                            }

                                            $close(value);
                                        }
                                    });
                            };
                        })($scope.$close, commonSearchSetting.beforeOk);
                    }
                }];

                commonSearchSetting.resolve = commonSearchSetting.resolve || {};

                commonSearchSetting.resolve.remoteCommonSearchSetting = ['commonSearchSettingRequest', function (commonSearchSettingRequest) {
                    return commonSearchSettingRequest(commonSearchSetting.classId);
                }];

                commonSearchSetting.size = 'lg';

                commonSearchInstance = this.open(commonSearchSetting);

                if (commonSearchSetting.afterOk) {
                    (function (afterOk) {
                        var result;

                        commonSearchInstance.result = commonSearchInstance.result
                            .then(function () {
                                result = arguments[0];
                                return result;
                            })
                            .then(afterOk)
                            .then(
                                function () {
                                    return result;
                                },
                                function (reason) {
                                    console[reason instanceof Error ? 'error' : 'warn'](commonSearchSetting.classId, 'commonSearch 的 afterOk 被拒绝', reason);
                                    return result;
                                }
                            );
                    })(commonSearchSetting.afterOk);
                }

                return commonSearchInstance;
            };

            var modalDecorator;
            if (window === top) {
                modalDecorator = ['$delegate', function ($delegate) {
                    var $modal = new $Modal();

                    $modal.open = function open(modalSetting) {
                        try {
                            modalSetting.backdrop = 'static';     //静态：可以看到背景，但无法点击背景
                            modalSetting.keyboard = false;        //按【Esc】关闭模态窗口：否

                            //原本的 resolve 属性只支持动态值，使用不方便，使其支持静态值
                            angular.forEach(modalSetting.resolve, function (value, key, obj) {
                                if (angular.isFunction(value)) {
                                }
                                else if (angular.isArray(value)) {
                                    if (!value.length || !angular.isFunction(value[value.length - 1]))
                                        obj[key] = function returnStaticValue() {
                                            return value;
                                        };
                                }
                                else {
                                    obj[key] = function returnStaticValue() {
                                        return value;
                                    };
                                }
                            });

                            var actualController = modalSetting.controller;

                            /**
                             * 模态框预处理控制器
                             */
                            modalSetting.controller = function ModalPreController() {
                                var locals = {};

                                var injectArguments = arguments;

                                modalSetting.controller.$inject.forEach(function (key, index) {
                                    locals[key] = injectArguments[index];
                                });

                                var $controller = arguments[0],
                                    $modalScope = arguments[1];

                                $modalScope.closeable = modalSetting.closeable !== false;
                                    
                                $modalScope.fullScreen = !!modalSetting.fullScreen;

                                $modalScope.title = modalSetting.title;

                                $modalScope.width = modalSetting.width;
                                $modalScope.height = modalSetting.height;

                                $modalScope.footerLeftButtons = {};

                                (function () {
                                    var footerRightButtons = {
                                        close: {
                                            icon: 'iconfont hc-skip',
                                            title: '关闭',
                                            click: function () {
                                                $modalScope.$dismiss('底部关闭');
                                            },
                                            hide: function () {
                                                return !$modalScope.closeable;
                                            }
                                        },
                                        ok: {
                                            icon: 'iconfont hc-dui',
                                            title: '确定',
                                            click: function () {
                                            },
                                            hide: true
                                        }
                                    };

                                    $modalScope.footerRightButtons = {};

                                    Object.keys(footerRightButtons).forEach(function (key) {
                                        Object.defineProperty($modalScope.footerRightButtons, key, {
                                            enumerable: true,
                                            get: function () {
                                                return footerRightButtons[key];
                                            },
                                            set: function (value) {
                                                var button = footerRightButtons[key];

                                                angular.extend(footerRightButtons[key], value);

                                                if (value
                                                    && key === 'ok'
                                                    && button.hide === true
                                                    && !('hide' in value)) {
                                                    button.hide = false;
                                                }
                                            }
                                        });
                                    });
                                })();

                                if (actualController)
                                    return $controller(actualController, locals);
                            };

                            modalSetting.controller.$inject = ['$controller', '$scope', '$modalInstance'];
                            angular.forEach(modalSetting.resolve, function (_, key) {
                                modalSetting.controller.$inject.push(key);
                            });

                            return $delegate.open(modalSetting);
                        }
                        catch (e) {
                            console.error(e);
                            
                            var errorPromise = $q.reject(e);

                            return {
                                result: errorPromise,
                                opened: errorPromise,
                                close: angular.noop,
                                dismiss: angular.noop
                            };
                        }
                    };

                    return $modal;
                }];
            }
            else {
                modalDecorator = ['$rootScope', function ($rootScope) {
                    return ['$modal', '$rootScope', function ($modalOfTop, $rootScopeOfTop) {
                        var $modal = new $Modal();

                        $modal.open = function open(modalSetting) {
                            var modalHolderScope = modalSetting.scope || $rootScope;

                            if (modalSetting.scope)
                                $rootScopeOfTop.FrmInfo = modalSetting.scope.FrmInfo;

                            modalSetting.scope = $rootScopeOfTop;

                            var modalInstance = $modalOfTop.open(modalSetting);

                            modalInstance.result.finally(function () {
                                delete $rootScopeOfTop.FrmInfo;
                                modalHolderScope.$applyAsync();
                            });

                            return modalInstance;
                        };

                        return $modal;
                    }].callByTopAngular();
                }];
            }

            app.decorator('$modal', modalDecorator);
        })();

        /**
         * 缓存相关
         */
        (function () {
            //缓存统一由顶层窗口管理
            if (window === top) {
                app.decorator('$cacheFactory', ['$delegate', function ($delegate) {
                    function $cacheFactory(cacheId, options) {
                        var cache = $delegate.get(cacheId);
                        if (cache === undefined)
                            cache = $delegate.apply(this, arguments);
                        return cache;
                    };

                    angular.extend($cacheFactory, $delegate);

                    return $cacheFactory;
                }]);
            }
            else {
                app.decorator('$cacheFactory', function () {
                    return ['$cacheFactory', function ($cacheFactory) {
                        return $cacheFactory;
                    }].callByTopAngular();
                });
            }
        })();

        /**
         * 给 url 添加 v 参数
         * @since 2019-04-02
         */
        app.factory('addUrlParamV', function () {

            /**
             * 给 url 添加 v 参数
             * @param {string} url
             * @returns {string}
             */
            function addUrlParamV(url) {
                if (typeof url !== 'string') return url;

                var hash, search;

                /**
                 * 截取 hash
                 */
                (function () {
                    var lastIndexOfHash = url.lastIndexOf('#');

                    if (lastIndexOfHash >= 0) {
                        hash = url.substring(lastIndexOfHash);
                        url = url.substring(0, lastIndexOfHash);
                    }
                    else {
                        hash = '';
                    }
                })();

                /**
                 * 截取 search
                 */
                (function () {
                    var lastIndexOfSearch = url.lastIndexOf('?');

                    if (lastIndexOfSearch >= 0) {
                        search = url.substring(lastIndexOfSearch);
                        url = url.substring(0, lastIndexOfSearch);
                    }
                    else {
                        search = '';
                    }
                })();

                //若不包含 v 参数
                if (!/[?&]v=/.test(search))
                    search += (search ? '&' : '?') + 'v=' + top.rev;

                url += search + hash;

                return url;
            }

            return addUrlParamV;
        });

        /**
         * 修饰 http 请求服务
         */
        app.decorator('$http', ['$delegate', 'addUrlParamV', function ($http, addUrlParamV) {

            /**
             * http 请求服务
             * @param {string} url
             */
            $http.get = (function (get) {
                return function (url, config) {
                    //正则表达式
                    var reg = /\.(\w+)($|[?#])/;

                    //匹配结果
                    var matchedResult = url.match(reg);

                    var needParamV;

                    if (matchedResult) {
                        //后缀名
                        var suffix = matchedResult[1];

                        //若请求的是 js、css 资源，添加 v 参数
                        if (['js', 'gzjs', 'css', 'gzcss'].indexOf(suffix) >= 0)
                            needParamV = true;
                        //若请求的是 html 资源，则在 views 文件夹下面时，才需要添加 v 参数
                        else if (['html', 'gzhtml'].indexOf(suffix) >= 0)
                            needParamV = url.indexOf('views') >= 0;
                        else
                            needParamV = false;
                    }

                    if (needParamV)
                        url = addUrlParamV(url);

                    return get.apply(this, arguments);
                };
            })($http.get);

            return $http;
        }]);

        /**
         * 修饰模板请求服务
         * @since 2019-04-02
         */
        app.decorator('$templateRequest', ['$delegate', 'addUrlParamV', function ($delegate, addUrlParamV) {

            /**
             * 模板请求服务
             * @param {string} templateUrl 模板路径
             * @param {boolean} ignoreRequestError 是否忽略错误
             * @returns {Promise<string>}
             */
            function $templateRequest(templateUrl, ignoreRequestError) {
                //若是 views 文件夹下的 html，添加 v 参数
                if (typeof templateUrl === 'string'
                    && (templateUrl.indexOf('views') >= 0
                        || templateUrl.indexOf('widget') >= 0
                    )
                )
                    templateUrl = addUrlParamV(templateUrl);

                return $delegate.apply(this, arguments);
            }

            angular.extend($templateRequest, $delegate);

            return $templateRequest;
        }]);

        /**
         * 修饰懒加载服务
         * @since 2019-04-02
         */
        app.decorator('$ocLazyLoad', ['$delegate', 'addUrlParamV', function ($ocLazyLoad, addUrlParamV) {

            var originalFilesLoader = $ocLazyLoad.filesLoader;

            /**
             * 文件加载器
             * @param {{ files: string[] }} config 加载配置
             */
            function filesLoader(config) {
                config.files.forEach(function (fileUrl, index, files) {
                    //添加 v 参数
                    files[index] = addUrlParamV(fileUrl);
                });

                return originalFilesLoader.apply(this, arguments);
            }

            $ocLazyLoad.filesLoader = filesLoader;

            return $ocLazyLoad;
        }]);
        
        /**
         * 修饰解析表达式服务
         * @since 2019-07-03
         */
        app.decorator('$parse', ['$delegate', function ($delegate) {

            /**
             * 修饰解析表达式服务，让取值器和赋值器互相关联
             * @param {*} exp 
             * @param {*} interceptorFn 
             * @param {*} expensiveChecks 
             */
            function $parse(exp, interceptorFn, expensiveChecks) {
                var getter = $delegate.apply(this, arguments);

                if (getter.assign) {
                    getter.setter = getter.assign;
                    getter.setter.getter = getter;
                }

                return getter;
            }

            /**
             * 把表达式视为赋值器解析
             * 若表达式不能充当赋值器，抛错
             */
            $parse.parseAsSetter = function (exp, interceptorFn, expensiveChecks) {
                var getter = $parse.apply(this, arguments);

                if (!getter.setter) {
                    throw new Error('此表达式不是可赋值表达式：' + exp);
                }

                return getter.setter;
            };

            return $parse;
        }]);

        /**
         * 修饰路由状态服务
         * @since 2019-07-20
         */
        app.decorator('$state', ['$delegate', function ($state) {

            (function (href) {
                $state.href = function (stateOrName, params, options) {
                    options = angular.extend({
                        inherit: false          //不继承当前状态的参数
                    }, options);

                    return href.call(this, stateOrName, params, options);
                };
            })($state.href);

            return $state;
        }]);

        //根节点
        app.$rootElement = $(document);

        (function () {
            //注入器
            //注入器本应在 Angular 启动时创建
            //但在 Angular 启动前要做很多事情
            //需要 Angular 的服务的支持，所以提前创建
            //在 Angular 启动时让 Angular 不再创建注入器
            //而是使用这个提前创建的注入器(通过修改 Angular 源码实现)
            app.$injector = angular.injector([
                [
                    '$provide',
                    function ($provide) {
                        $provide.value('$rootElement', app.$rootElement);
                    }
                ],
                appName
            ]);

            //把注入器缓存到根节点(通过修改 Angular 源码实现，从根节点提取注入器，不再创建注入器)
            app.$rootElement.data('hcInjector', app.$injector);

            //根作用域
            app.$rootScope = app.$injector.get('$rootScope');

            app.$rootScope.constructor.prototype.$broadcastAsync = function (name, args) {
                var target = this,
                    current = target,
                    next = target,
                    event = {
                        name: name,
                        targetScope: target,
                        preventDefault: function () {
                            event.defaultPrevented = true;
                        },
                        defaultPrevented: false
                    };

                if (!target.$$listenerCount[name]) return event;

                var listenerArgs = Array.prototype.slice.call(arguments);
                listenerArgs.splice(0, 1, event);

                var listeners, i, length;

                var $q = app.$injector.get('$q');
                var startPromise = $q.when(), promises = [];

                //down while you can, then up and next sibling or up and next sibling until back at root
                while ((current = next)) {
                    event.currentScope = current;
                    listeners = current.$$listeners[name] || [];
                    for (i = 0, length = listeners.length; i < length; i++) {
                        // if listeners were deregistered, defragment the array
                        if (!listeners[i]) {
                            listeners.splice(i, 1);
                            i--;
                            length--;
                            continue;
                        }

                        var listener = listeners[i];

                        promises.push(startPromise.then(function () {
                            return listener.apply(null, listenerArgs);
                        }));
                    }

                    // Insanity Warning: scope depth-first traversal
                    // yes, this code is a bit crazy, but it works and we have tests to prove it!
                    // this piece should be kept in sync with the traversal in $digest
                    // (though it differs due to having the extra check for $$listenerCount)
                    if (!(next = ((current.$$listenerCount[name] && current.$$childHead) ||
                        (current !== target && current.$$nextSibling)))) {
                        while (current !== target && !(next = current.$$nextSibling)) {
                            current = current.$parent;
                        }
                    }
                }

                event.currentScope = null;

                return $q.all(promises);
            };

            /**
             * 由【当前窗口的】Angular 调用具有依赖的函数
             * @param {object} self 函数的 this 指向
             * @param {object} locals 本地变量域
             */
            function callByAngular(self, locals) {
                return app.$injector.invoke(this, self, locals);
            }

            Object.defineProperty(Function.prototype, 'callByAngular', {
                value: callByAngular
            });

            Object.defineProperty(Array.prototype, 'callByAngular', {
                value: callByAngular
            });

            Object.defineProperty(String.prototype, 'asAngularService', {
                get: function () {
                    return app.$injector.get(this);
                }
            });
        })();

        /**
         * 已弃用的服务
         * @param {string} serviceName 服务名称
         */
        function deprecatedService(serviceName) {
            return ['$state', function ($state) {
                console.error(serviceName, '服务已弃用，请移除。\n路由位置：', $state.current.name, '\nPS：复制别人的代码时，记得清除不必要的依赖注入。');
                return null;
            }];
        }

        [
            'BaseService',
            'BasemanService',
            'localeStorageService',
            'FormValidatorService'
        ].forEach(function (serviceName) {
            app.factory(serviceName, deprecatedService(serviceName));
        });

        // console.log('app = ', app);

        window.stopUpgrade = function stopUpgrade() {
            if (top.urlParams.v) return;

            if (top.location.search) {
                top.location.search = top.location.search + '&v=' + top.rev;
            }
            else {
                top.location.search = top.location.search + '?v=' + top.rev;
            }
        };

        /**
         * 停止更新
         */
        window.stopUpgrade = function stopUpgrade() {
            if (top.urlParams.v) return;

            var newUrlParams = angular.extend({}, urlParams);

            newUrlParams.v = top.rev;

            top.location.search = '?' + $.param(newUrlParams);
        };

        /**
         * 恢复更新
         */
        window.restoreUpgrade = function restoreUpgrade() {
            if (!top.urlParams.v) return;

            var newUrlParams = angular.extend({}, urlParams);

            delete newUrlParams.v;

            var search = $.param(newUrlParams);
            if (search) search = '?' + search;

            top.location.search = search;
        };

        if (window === top) {
            $(window).on('beforeunload', function (event) {
                IncRequestCount();
            });
        }

        $(window).on('keydown', function (event) {
            if (event.ctrlKey && event.shiftKey && !event.altKey && event.key === 'Enter') {
                '$modal'
                    .asAngularService
                    .open({
                        template: function () {
                            return $('<div>', {
                                'css': {
                                    'display': 'flex',
                                    'flex-direction': 'column',
                                    'padding': '8px'
                                },
                                'html': $('<button>', {
                                    'class': 'btn btn-default',
                                    'ng-repeat': 'button in buttons',
                                    'ng-click': 'button.click()',
                                    'ng-style': '{ "margin-top": $first ? 0 : "8px" }',
                                    'ng-bind': 'button.name'
                                })
                            });
                        },
                        controller: ['$scope', function ($scope) {

                            $scope.title = '开发工具';

                            $scope.buttons = [
                                {
                                    name: (isDebug ? '关闭' : '启用') + '调试模式（' + (isDebug ? '删除' : '添加') + ' debug=true 参数）',
                                    click: function () {
                                        var search,
                                            newUrlParams = angular.extend({}, top.urlParams);

                                        if (isDebug) {
                                            delete newUrlParams.debug;
                                        }
                                        else {
                                            newUrlParams.debug = true;
                                        }

                                        search = $.param(newUrlParams);
                                        if (search) search = '?' + search;

                                        top.location.search = search;
                                    }
                                },
                                {
                                    name: (top.urlParams.v ? '恢复' : '暂停') + '页面版本更新（' + (top.urlParams.v ? '删除' : '添加') + ' v 参数）',
                                    click: function () {
                                        var search,
                                            newUrlParams = angular.extend({}, top.urlParams);

                                        if (newUrlParams.v) {
                                            delete newUrlParams.v;
                                        }
                                        else {
                                            newUrlParams.v = top.rev;
                                        }

                                        search = $.param(newUrlParams);
                                        if (search) search = '?' + search;

                                        top.location.search = search;
                                    }
                                }
                            ];

                        }]
                    });
            }
        });

        return app;
    }
);