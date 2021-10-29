/**
 * 用于打开各种东西的Api
 * @since 2018-10-05
 */
define(
    ['angular', 'promiseApi', 'requestApi', 'numberApi', 'fileApi', 'constant', 'app'],
    function (angular, promiseApi, requestApi, numberApi, fileApi, constant, app) {
        // 'use strict';
        top.require(['directive/hcImportConsole']);

        var sysParams = {};

        [
            'OpenPageByTab'                         //是否在标签页打开页面
        ].forEach(function (key) {
            sysParams[key] = false;

            requestApi.getSysParam(key).then(function (sysParam) {
                Object.defineProperty(sysParams, key, {
                    value: sysParam.param_value === 'true'
                });
            });
        });

        var openBizObjToExport = function (params) {
            return openBizObj.callByAngular(null, {
                params: params
            });
        };

        openBizObj.$inject = ['params', '$state', '$stateParams', '$q']; //依赖于当前窗口的服务
        function openBizObj(params, $state, $stateParams, $q) {
            openBizObjDependOnTop.$inject = ['$modal']; //依赖于顶层窗口的服务
            function openBizObjDependOnTop($modal) {
                var modalScope = {},										//模态框作用域
                    isWf = ('wfId' in params) || ('wfTempId' in params),	//打开流程实例
                    isBizObj = 'objId' in params,							//打开业务对象
                    isNormalState = 'stateName' in params,					//打开普通路由
                    isState = isWf || isBizObj || isNormalState;			//打开路由

                if (isState) {
                    if ('openByTab' in params) {}
                    else {
                        params.openByTab = sysParams.OpenPageByTab;
                    }

                    modalScope.type = 'state';

                    var wfId = numberApi.toNumber(params.wfId),				//流程ID
                        wfTempId = numberApi.toNumber(params.wfTempId),		//流程模板ID
                        objId = numberApi.toNumber(params.objId),			//对象ID
                        objType = numberApi.toNumber(params.objType),		//对象类型
                        stateName = params.stateName,						//路由状态名称
                        stateParams = params.params;						//路由状态参数

                    if (isNormalState) {
                        $q.when().then(doAfterGetState);
                    }
                    else {
                        var postData = {};

                        if (isWf) {
                            if (!wfId && !wfTempId)
                                throw new Error('打开【流程实例】必须指定【wfId】，且不为0，你传的值为', params.wfId);

                            postData.wfId = wfId;
                            postData.wfTempId = wfTempId;
                        }
                        else if (isBizObj) {
                            if (!objId)
                                throw new Error('打开【业务对象】必须指定【objId】，且不为0，你传的值为', params.objId);

                            if (!objType)
                                throw new Error('打开【业务对象】必须指定【objType】，且不为0，你传的值为', params.objType);

                            if (objType === constant.objType.doc) {
                                requestApi
                                    .post({
                                        classId: 'scpdoc',
                                        action: 'select',
                                        data: {
                                            docid: objId,
                                            rev: -1
                                        }
                                    })
                                    .then(function (doc) {
                                        if (fileApi.isImage(doc))
                                            return openBizObj({
                                                imageId: objId
                                            });
                                        else
                                            return fileApi.openFile(objId);
                                    });

                                return;
                            }
                        }

                        postData.objId = objId;
                        postData.objType = objType;

                        var postObj = {
                            class: 'request.GetRouterState',
                            data: postData
                        };

                        requestApi
                            .http(postObj)
                            .then(function (response) {
                                stateName = response.statename;
                                stateParams = {
                                    id: isBizObj ? objId : response.objid,
                                    title: response.title
                                };
                            })
                            .then(doAfterGetState);
                    }

                    var opened;
                    if (params.openByTab) {
                        opened = $q.defer();
                        return {
                            close: angular.noop,
                            dismiss: angular.noop,
                            result: $q.reject(),
                            opened: opened.promise
                        };
                    }

                    function doAfterGetState() {
                        var state = $state.get(stateName);

                        if (!state) {
                            if (isWf) {
                            }
                            else if (stateName) {
                                throwError('路由状态 ' + stateName + ' 未注册');
                            }
                            else {
                                throwError('未知异常');
                            }

                            //没有路由时，只打开流程
                            stateName = 'baseman.wf';
                            stateParams = {
                                id: wfId,
                                title: params.params && params.params.title,
                                objId: objId,
                                objType: objType,
                                wfTempId: wfTempId,
                                startWf: params.startWf
                            };

                            state = $state.get(stateName);
                        }

                        function throwError(message) {
                            modalInstance && modalInstance.dismiss && modalInstance.dismiss(message);
                            throw new Error(message);
                        }

                        modalScope.src = '/web/index.jsp?' + $.param({
                            v: top.rev,
                            t: +new Date(),
                            rn: stateName
                        }) + $state.href(stateName, stateParams);

                        //若在参数中传入了标题
                        if (stateParams && stateParams.title)
                            modalScope.title = stateParams.title;
                        //若当前页面有标题，打开的模态框多数是当前页面的属性，传递标题
                        else {
                            (function () {
                                var index = $state.current.name.lastIndexOf('_list');
                                var prefix = index > -1 ? $state.current.name.substring(0, index) : '';
                                var isPropOfList = stateName === prefix + '_prop';

                                //若路由是当前列表页的属性，沿用列表页的标题
                                if (isPropOfList)
                                    modalScope.title = $stateParams.title;
                                //若要打开的状态有标题
                                else if (state.title)
                                    modalScope.title = state.title;
                                else
                                    console.error('路由状态', stateName, '未定义标题');
                            })();
                        }

                        modalScope.state = state;
                        modalScope.params = stateParams;

                        if (params.openByTab) {
                            $state.go(modalScope.state, modalScope.params);
                            opened.resolve();
                        }
                    }
                }
                //图片
                else if ('imageId' in params) {
                    return openImage(params);
                }
                //导入控制台
                else if ('importSetting' in params) {
                    modalScope.type = 'import';
                    modalScope.importSetting = params.importSetting;
                    modalScope.title = '导入';
                }
                else {
                    throw '无法打开的类型';
                }

                var modalSetting = {
                    fullScreen: params.fullScreen,
                    size: params.size || 'max',
                    width: params.width,
                    height: params.height,
                    controller: [
                        '$scope', '$modal',
                        function ($scope, $modal) {
                            modalScope = angular.extend($scope, modalScope);
                            console.log(modalScope)
                            $scope.showHelp = function () {
                                var title;
                                return $modal.open({
                                    templateUrl: 'views/baseman/confHelp.html',
                                    controller: ['$scope', function ($modalScope) {
                                        $modalScope.data = $scope.state.data;
                                        $modalScope.title = '帮助';
                                        var t = setInterval(function () {
                                            if (top.$('#help').length > 0) {
                                                top.$('#help').html($modalScope.data.objConf.tooltip);
                                                clearInterval(t);
                                            }
                                        }, 100);
                                        $modalScope.lookDoc = function (file) {
                                            fileApi.openFile(file.docid);
                                        }
                                        $modalScope.downDoc = function (file) {
                                            fileApi.downloadFile(file.docid);
                                        }
                                        $modalScope.doInit = ['$modalContentElement', function ($modalContentElement) {
                                            var h;

                                            for (var i = 1; i <= 6; i++) {
                                                h = $modalContentElement.find('h1');

                                                if (!h.length) continue;

                                                $scope.title = h.text();
                                            }
                                        }];
                                    }],
                                    size: 'max'
                                });
                                /*$modal.open({
                                    template: '<div hc-box>' + $scope.state.data.objConf.tooltip + '</div>',
                                    controller: ['$scope', function ($scope) {
                                        $scope.title = '帮助';

                                        $scope.doInit = ['$modalContentElement', function ($modalContentElement) {
                                            var h;

                                            for (var i = 1; i <= 6; i++) {
                                                h = $modalContentElement.find('h1');

                                                if (!h.length) continue;

                                                $scope.title = h.text();
                                            }
                                        }];
                                    }],
                                    size: 'max'
                                });*/
                            };
                        }
                    ]
                };

                if (modalScope.type === 'import') {
                    modalSetting.windowTemplateUrl = 'views/baseman/modal_box.html';
                    modalSetting.template = '<div hc-import-console="importSetting"></div>';
                    modalSetting.size = 'lg';
                }
                else {
                    modalSetting.windowTemplateUrl = '';
                    modalSetting.templateUrl = 'views/baseman/modal.html';
                }

                var modalInstance = $modal.open(modalSetting);

                modalScope.modalInstance = modalInstance;
                modalInstance.modalScope = modalScope;

                return modalInstance;
            }

            return openBizObjDependOnTop.callByTopAngular();
        }

        /**
         * 打开图片
         * @param params
         */
        function openImage(params) {
            var data = {
                docid: params.imageId,
                docs: params.images
            };

            var dataStr = JSON.stringify(data);

            var form = $('<form></form>', {
                method: "POST",
                action: "imageViewer.jsp",
                target: "_blank",
                style: "display:none"
            }).appendTo('body');

            $('<input>', {
                name: "sessionId"
            }).val(window.strLoginGuid).appendTo(form);

            $('<input>', {
                name: "data"
            }).val(dataStr).appendTo(form);

            $('<input>', {
                type: "submit"
            }).appendTo(form).click();

            form.remove();
        }

        if (window.isOA) {
            /**
             * 路由开始变化事件
             * @since 2019-04-26
             */
            app.$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                //若是从虚拟路由跳转，不必处理
                if (fromState.abstract) return;

                //OA的链接通过模态框打开
                openBizObjToExport({
                    stateName: toState.name,
                    params: toParams
                });
            });
        }

        return openBizObjToExport;
    }
);