/**
 * 对象属性页基础控制器
 * @since 2018-10-02
 */
define(['module', 'controllerApi', 'jquery', 'angular', 'swalApi', 'numberApi', 'requestApi', 'requireApi', 'gridApi', 'constant', 'specialProperty', 'openBizObj', 'promiseApi', 'directive/hcObjProp'], function (module, controllerApi, $, angular, swalApi, numberApi, requestApi, requireApi, gridApi, constant, specialProperty, openBizObj, promiseApi) {
    'use strict';

    var sysParams = {};

    [
        'ShowRefreshButtonInPropPage',                      //是否在属性页显示刷新按钮
        'DisableEditingControl'                             //禁用编辑控制
    ].forEach(function (key) {
        sysParams[key] = false;

        requestApi.getSysParam(key).then(function (sysParam) {
            Object.defineProperty(sysParams, key, {
                value: sysParam.param_value === 'true'
            });
        });
    });

    BaseObjProp.$inject = ['$scope', '$state', '$q', '$timeout', '$parse', '$compile'];
    function BaseObjProp(   $scope,   $state,   $q,   $timeout,   $parse,   $compile) {
        /* var wfControllerReady = (function () {
            var deferred = $q.defer();

            //当流程控制器就绪时
            $scope.$on('hcWfReady', function (event, data) {
                deferred.resolve(data.wfController);
            });
            return deferred.promise;
        })(); */

        require(['wfApi'], function (wfApi) {
            wfApi.onRefresh(function (eventData) {
                var needRefresh;

                if (eventData.classId === 'scpwf' && ['insert', 'start_then_submit'].indexOf(eventData.action) >= 0) {
                    var wfObj = eventData.data.wfobjofwfs[0];

                    needRefresh = wfObj.objtype == $scope.data.objConf.objtypeid && $scope.$eval('data.objConf.objtypeid == wfObj.objtype && getId() == wfObj.objid', {
                        wfObj: wfObj
                    });
                }
                else {
                    needRefresh = $scope.$eval('data.currItem.wfid') == eventData.data.wfid;
                }

                if (needRefresh) {
                    $scope.refresh();
                }

                if (eventData.classId === 'scpwf' && eventData.action === 'break' && needRefresh) {
                    $scope.tabController.setActiveTab('base');
                }
            });
        });

        /**
         * 定义数据
         */
        var printApi = {};

        function defineData() {

            $scope.data = $scope.data || {};
            constant.defineConstProp($scope, 'data', $scope.data); //保护data属性
            $scope.data.currItem = $scope.data.currItem || {};

            (function () {
                var id = numberApi.toNumber($scope.$state.params.id);
                if (!id) $scope.data.isInsert = true;

                var objConf = $scope.$state.objConf;
                if (objConf) {
                    if (frameElement) {
                        (function () {
                            var $scope = parent.$(frameElement).scope();

                            //把对象配置传递给模态框所在作用域
                            $scope.$applyAsync(function () {
                                $scope.objConf = objConf;
                            });
                        })();
                    }

                    $scope.data.objConf = objConf;

                    /* wfControllerReady.then(function (wfController) {
                        wfController.setObjConf(objConf);
                    }); */

                    var lastIndexOfDot = objConf.javaname.lastIndexOf('.');

                    if (lastIndexOfDot >= 0)
                        $scope.data.classId = objConf.javaname.substr(lastIndexOfDot + 1);
                    else
                        $scope.data.classId = objConf.javaname;

                    $scope.data.classId = $scope.data.classId.toLowerCase();

                    $scope.data.idField = (objConf.pkfield || '').toLowerCase();
                    $scope.data.codeField = (objConf.codefield || '').toLowerCase();
                    $scope.data.nameField = (objConf.namefield || '').toLowerCase();

                    $scope.data.currItem[$scope.data.idField] = id;

                    if (objConf.attacharrayname) {
                        $scope.attachSetting = {
                            model: 'data.currItem.' + objConf.attacharrayname.toLowerCase()
                        };
                    }

                    if (objConf.objfields && objConf.objfields.length) {
                        objConf.$objFields = {};

                        objConf.objfields.forEach(function (field) {
                            objConf.$objFields[field.field_name] = field;
                        });
                    }

                    //==================== 对象配置权限规则 - 开始 ====================
                    objConf.readonlyRules = [];     //只读条件
                    objConf.hideRules = [];         //隐藏条件

                    objConf.obj_right_rules.forEach(function (rule) {
                        [
                            'userids',
                            'orgids',
                            'roleids',
                            'positionids',
                            'wftempids',
                            'procids',
                            'fields'
                        ].forEach(function (key) {
                            var array = rule[key];

                            if (!angular.isArray(array)) {
                                if (array)
                                    array = array.split(',');
                                else
                                    array = [];

                                rule[key] = array;
                            }
                        });

                        if (angular.isString(rule.grids)) {
                            if (rule.grids) {
                                rule.grids = JSON.parse(rule.grids);
                            }
                            else {
                                rule.grids = {};
                            }
                        }

                        if (rule.readonly == 1 || rule.readonly == 2)
                            objConf.readonlyRules.push(rule);

                        if (rule.hide == 2)
                            objConf.hideRules.push(rule);
                    });

                    objConf.getMatchedRules = function (currItem) {
                        var stat = numberApi.toNumber(currItem.stat),
                            currWfTempId = numberApi.toNumber(currItem.wftempid),
                            currProcId = numberApi.toNumber(currItem.procid),
                            matchedRules = objConf.obj_right_rules,
                            filter;

                        if (stat <= 1) {
                            filter = function (rule) {
                                return !rule.wftempids.length || rule.wftempids.some(function (wfTempId) {
                                    return wfTempId == 0;
                                });
                            };
                        }
                        else if (currWfTempId) {
                            filter = function (rule) {
                                return rule.wftempids.some(function (wfTempId) {
                                    return wfTempId == currWfTempId;
                                });
                            };
                        }
                        else {
                            filter = function () {
                                return false;
                            };
                        }

                        matchedRules = matchedRules.filter(filter);

                        if (stat > 1 && currWfTempId)
                            matchedRules = matchedRules.filter(function (rule) {
                                return rule.procids.some(function (procId) {
                                    return procId == currProcId;
                                });
                            });

                        objConf.matchedRules = matchedRules;

                        objConf.readonlyRules = [];
                        objConf.hideRules = [];

                        matchedRules.forEach(function (rule) {
                            if (rule.readonly == 1 || rule.readonly == 2)
                                objConf.readonlyRules.push(rule);

                            if (rule.hide == 2)
                                objConf.hideRules.push(rule);
                        });

                        return matchedRules;
                    };
                    //==================== 对象配置权限规则 - 结束 ====================
                }
                else {
                    swalApi.error('尚未关联对象配置');
                }
            })();
            
            (function () {
                var maxSeq = Number.MAX_SAFE_INTEGER;

                var tabSeq = {
                    base: 1,
                    attach: maxSeq - 4,
                    projAttach: maxSeq - 3,
                    wf: maxSeq - 2,
                    actionLog: maxSeq - 1
                };

                var middleSeq = 2;

                /**
                 * 标签页排序
                 */
                $scope.tabSort = function (a, b) {
                    a = tabSeq[a.id] || middleSeq;
                    b = tabSeq[b.id] || middleSeq;

                    return a - b;
                };
            })();

            /**
             * 标签页头部
             * @since 2018-10-06
             */
             $scope.tabs = {
                'base': {
                    title: function () {
                        if ($scope.$eval('data.objConf.isbill==2||data.objConf.objwftempofobjconfs.length'))
                            return '单据详情';

                        return '基本信息';
                    },
                    active: true
                }
            };

            Object.defineProperty($scope.data, 'attachCount', {
                get: function () {
                    return $scope.$eval($scope.$eval('attachSetting.model') + '.length') || 0
                }
            });

            constant.defineConstProps($scope.tabs, {
                'attach': {
                    title: function () {
                        return '附件(' + $scope.data.attachCount + ')';
                    }
                },
            });

            if ($scope.$state.name.indexOf('epmman') >= 0) {
                (function () {
                    //
                    constant.defineConstProps($scope.tabs, {
                        'projAttach': {
                            title: '附件'
                        }
                    });

                    $scope.tabs.projAttach.hide = true;

                    var promises = [];

                    promises.push(requireApi.usePromiseToRequire('directive/hcProjAttach'));
                    promises.push(promiseApi.whenTrue(function () {
                        return !!$('#attach', $scope.$state.element).length;
                    }));

                    $q
                        .all(promises)
                        .then(function () {
                            var projAttachElement = $('<div>', {
                                'id': 'projAttach',
                                'class': 'tab-pane',
                                'css': {
                                    'height': '100%',
                                    'padding': '8px'
                                },
                                'html': $('<hc-proj-attach>', {
                                    'css': {
                                        'height': '100%'
                                    },
                                    'hc-proj-attach-as': 'projAttachController'
                                })
                            });

                            $('#attach', $scope.$state.element).after(projAttachElement);

                            $compile(projAttachElement)($scope);

                            $scope.$eval('projAttachController.setAttaches(data.currItem.epm_project_attachs)');

                            $scope.tabs.projAttach.hide = false;
                        }, function (e) {
                            console.error('项目附件加载失败', e);
                        });
                })();
            }

            constant.defineConstProps($scope.tabs, {
                'wf': {
                    title: '审批流程'
                }/* ,
                'newWf': {
                    title: '审批流程（新）',
                    hide: function () {
                        return $scope.$eval('!+data.currItem.wfid');
                    }
                } */
            });

            specialProperty.defineHide($scope.tabs.attach, function () {
                //没有附件设置时，隐藏
                //单据只读且附件数量为0时，隐藏
                return !$scope.attachSetting || ($scope.isFormReadonly() && !$scope.data.attachCount);
            });

            specialProperty.defineHide($scope.tabs.wf, function () {
                if ($scope.$eval('data.objConf.isAllowed("view_wf") === false')) {
                    return true;
                }

                return $scope.$eval('!+data.currItem.wfid');

                /* var wfId = numberApi.toNumber($scope.$eval('data.currItem.wfid'));
                if (wfId !== 0) return false; //已关联流程实例，不隐藏

                var id = numberApi.toNumber($scope.getId());
                if (id === 0) return true; //未制单，隐藏

                var stat = numberApi.toNumber($scope.$eval('data.currItem.stat'));
                if (stat > 1) return true; //未关联流程实例，但状态却不是制单，也隐藏

                var wfTempCount = 0;
                if ($scope.data.objConf)
                    wfTempCount = $scope.data.objConf.objwftempofobjconfs.length;

                //没有关联流程模板时，隐藏
                return wfTempCount === 0; */
            });
            
            $scope.tabs.actionLog = {
                title: '访问记录'
            };

            (function () {
                var hide = true;

                function defaultHide() {
                    if ($scope.data.isInsert) {
                        return true;
                    }

                    return $scope.$eval('data.objConf.isAllowed("view_log") !== true');
                }

                Object.defineProperty($scope.tabs.actionLog, 'hide', {
                    get: function () {
                        return hide;
                    },
                    set: function (value) {
                        Switch(value)
                            .case(true, function () {
                                hide = true;
                            })
                            .case(false, function () {
                                hide = defaultHide;
                            })
                            .default(function () {
                                if (typeof value === 'function') {
                                    hide = function () {
                                        return defaultHide.apply(this, arguments) || value.apply(this, arguments);
                                    };
                                }
                                else {
                                    console.error('不能对 hide 属性 赋 布尔和函数 之外的类型的值', value);
                                }
                            });
                    }
                });
            })();

            /**
             * 表格：访问记录
             */
            $scope.actionLogGridOptions = {
                hcClassId: 'scp_action_log',
                hcPostData: function () {
                    return {
                        objtype: $scope.$eval('data.objConf.objtypeid'),
                        objid: $scope.getId(),
                        action_result: 1
                    };
                },
                hcSearchWhenReady: false,
                hcNoShowWaiting: true,
                hcNoShowError: true,
                hcEvents: {
                    modelUpdated: function (params) {
                        //列【说明】的可见性
                        var visibleOfActionInfo = params.api.hcApi.getRowData().some(function (data) {
                            return data.action_info;
                        });

                        params.columnApi.setColumnVisible('action_info', visibleOfActionInfo);
                    }
                },
                defaultColDef: {
                    cellStyle: {
                        'text-align': 'center'
                    }
                },
                columnDefs: [
                    {
                        type: '序号'
                    },
                    /* {
                        field: 'userid',
                        headerName: '用户账号'
                    }, */
                    {
                        field: 'username',
                        headerName: '用户名称'
                    },
                    {
                        field: 'action_name',
                        headerName: '操作'
                    },
                    {
                        field: 'action_time',
                        headerName: '时间'
                    },
                    {
                        field: 'action_info',
                        headerName: '说明',
                        minWidth: 300,
                        cellStyle: {},
                        hide: true
                    }
                ]
            };

            /**
             * 底部左侧按钮
             * @since 2018-10-05
             */
            $scope.footerLeftButtons = {
                addRow: {
                    // title: '增加行',
                    icon: 'iconfont hc-jia',
                    hide: isHideGridButton,
                    click: function () {
                        if (isHideGridButton()) return;
                        
                        $scope.data.currGridOptions.api.stopEditing();

                        var getter = $parse($scope.data.currGridModel),
                            setter = getter.assign.bind(null, $scope);

                        getter = getter.bind(null, $scope);

                        var gridData = getter();

                        if (!gridData) {
                            gridData = [];
                            setter(gridData);
                        }

                        gridData.push({});

                        $scope.data.currGridOptions.hcApi.setRowData(gridData);
                    }
                },
                deleteRow: {
                    // title: '删除行',
                    icon: 'iconfont hc-jian',
                    hide: isHideGridButton,
                    click: function () {
                        if (isHideGridButton()) return;
                        
                        $scope.data.currGridOptions.api.stopEditing();

                        var getter = $parse($scope.data.currGridModel),
                            setter = getter.assign.bind(null, $scope);

                        getter = getter.bind(null, $scope);

                        var gridData = getter();

                        if (!gridData) {
                            gridData = [];
                            setter(gridData);
                        }

                        return $scope.data.currGridOptions.hcApi
                            .getFocusedNodeWithNotice({
                                actionName: '删除'
                            })
                            .then(function (node) {
                                var index = gridData.indexOf(node.data);

                                gridData.splice(index, 1);

                                $scope.data.currGridOptions.hcApi.setRowData(gridData);

                                $scope.data.currGridOptions.hcApi.setFocusedCell();
                            });
                    }
                },
                topRow: {
                    // title: '置顶',
                    icon: 'fa fa-angle-double-up',
                    hide: isHideGridMoveRowButton,
                    click: moveRow
                },
                upRow: {
                    // title: '上移',
                    icon: 'fa fa-angle-up',
                    hide: isHideGridMoveRowButton,
                    click: moveRow
                },
                downRow: {
                    // title: '下移',
                    icon: 'fa fa-angle-down',
                    hide: isHideGridMoveRowButton,
                    click: moveRow
                },
                bottomRow: {
                    // title: '置底',
                    icon: 'fa fa-angle-double-down',
                    hide: isHideGridMoveRowButton,
                    click: moveRow
                }
            };

            function isHideGridButton() {
                return !$scope.data.currGridOptions || !$scope.data.currGridModel;
            }
            
            function isHideGridMoveRowButton() {
                return isHideGridButton() || ($scope.isMoveRowDisabled && $scope.isMoveRowDisabled());
            }

            function moveRow(params) {
                if (isHideGridButton()) return;

                var getter = $parse($scope.data.currGridModel),
                    setter = getter.assign.bind(null, $scope);

                getter = getter.bind(null, $scope);

                var gridData = getter();

                if (!gridData) {
                    gridData = [];
                    setter(gridData);
                }

                $scope.data.currGridOptions.hcApi
                    .getFocusedNodeWithNotice({
                        actionName: '移动'
                    })
                    .then(function (node) {
                        if (params.id === 'topRow' || params.id === 'upRow') {
                            if (node.rowIndex === 0)
                                return swalApi.info('该行已置顶，无法再上移').then($q.reject);
                        }
                        else if (params.id === 'bottomRow' || params.id === 'downRow') {
                            if (node.rowIndex === gridData.length - 1)
                                return swalApi.info('该行已置底，无法再下移').then($q.reject);
                        }

                        var focusedIndex = node.rowIndex;

                        gridData.splice(node.rowIndex, 1);

                        switch (params.id) {
                            case 'topRow':
                                focusedIndex = 0;
                                gridData.unshift(node.data);

                                break;

                            case 'upRow':
                                focusedIndex = node.rowIndex - 1;
                                gridData.splice(focusedIndex, 0, node.data);

                                break;

                            case 'downRow':
                                focusedIndex = node.rowIndex + 1;
                                gridData.splice(focusedIndex, 0, node.data);

                                break;

                            case 'bottomRow':
                                focusedIndex = gridData.length;
                                gridData.push(node.data);

                                break;
                        }

                        $scope.data.currGridOptions.hcApi.setRowData(gridData);

                        $scope.data.currGridOptions.hcApi.setFocusedCell(focusedIndex);
                    });
            }

            /**
             * 底部右侧按钮
             * @since 2018-10-05
             */
            $scope.footerRightButtons = constant.getConstClone({
                close: {
                    title: '关闭',
                    icon: 'iconfont hc-skip',
                    click: function () {
                        if ($scope.$parent.$dismiss) {
                            $scope.$parent.$dismiss();
                        }

                        if ($scope.$parent.tab && $scope.$parent.tab.close) {
                            $scope.$parent.tab.close();
                        }
                    }
                },
                print: {
                    title: '打印',
                    icon: 'iconfont hc-print',
                    click: function () {
                        return $scope.print && $scope.print();
                    }
                },
                break: {
                    title: '中断',
                    icon: 'iconfont hc-zhongduan',
                    click: function () {
                        return requireApi.usePromiseToRequire('wfApi').then(function (wfApi) {
                            return wfApi.break({
                                wfId: $scope.data.currItem.wfid
                            });
                        });
                    }
                },
                reject: {
                    title: '驳回',
                    icon: 'iconfont hc-shouzhang',
                    click: function () {
                        return requireApi.usePromiseToRequire('wfApi').then(function (wfApi) {
                            return wfApi.reject({
                                wfId: $scope.data.currItem.wfid
                            });
                        });
                    }
                },
                submit: {
                    title: '提交',
                    icon: 'iconfont hc-tijiao',
                    click: function () {
                        return requireApi
                            .usePromiseToRequire('wfApi')
                            .then(function (wfApi) {
                                //若已有流程，提交
                                if (+$scope.data.currItem.wfid) {
                                    return wfApi.submit({
                                        wfId: $scope.data.currItem.wfid
                                    });
                                }
                                //若没有流程，启动并提交
                                else {
                                    var invalidInfoBox;
                                    return $q
                                        .when()
                                        .then(function () {
                                            //装 验证不通过的信息 的盒子
                                            return invalidInfoBox = [];
                                        })
                                        .then($scope.validCheck)
                                        .then(function () {
                                            //若盒子非空，验证不通过，弹框
                                            if (invalidInfoBox.length)
                                                return swalApi.error(invalidInfoBox)
                                                    .then(function () {
                                                        return $q.reject(invalidInfoBox);
                                                    });
                                        })
                                        .then($scope.doBeforeStartWf)
                                        .then(function () {
                                            return wfApi.startThenSubmit({
                                                objType: $scope.data.objConf.objtypeid,
                                                objId: $scope.getId()
                                            });
                                        })
                                        .then(function () {
                                            if ($scope.$eval('data.objConf.isAllowed("view_wf") !== false')) {
                                                $scope.tabController.setActiveTab('wf');
                                            }
                                        });
                                }
                            });
                    }
                },
                cancelEdit: {
                    title: '取消编辑',
                    icon: 'iconfont hc-bohui1',
                    click: function () {
                        return $scope.refresh().then(function () {
                            $scope.form.editing = false;
                        });
                    }
                },
                saveThenSubmit: {
                    title: '保存并提交',
                    icon: 'iconfont hc-baocun',
                    click: function () {
                        return $q
                            .when()
                            .then($scope.save)
                            .then(function () {
                                return $scope.doBeforeStartWf && $scope.doBeforeStartWf();
                            })
                            .then(function () {
                                return requireApi.usePromiseToRequire('wfApi');
                            })
                            .then(function (wfApi) {
                                return wfApi.startThenSubmit({
                                    objType: $scope.data.objConf.objtypeid,
                                    objId: $scope.getId()
                                });
                            })
                            .then(function () {
                                if ($scope.$eval('data.objConf.isAllowed("view_wf") !== false')) {
                                    $scope.tabController.setActiveTab('wf');
                                }
                            });
                    }
                },
                saveThenAdd: {
                    title: '保存并新增',
                    icon: 'iconfont hc-baocun',
                    click: function () {
                        return $q
                            .when()
                            .then($scope.save)
                            .then(function () {
                                openBizObj({
                                    stateName: $scope.$state.name,
                                    params: angular.extend({}, $scope.$state.params, {
                                        id: 0,
                                        copyFrom: false
                                    })
                                });
                            })
                            .then(close);
                    }
                },
                save: {
                    title: '保存',
                    icon: 'iconfont hc-baocun',
                    click: function () {
                        return $scope.save && $scope.save();
                    }
                },
                edit: {
                    title: '编辑',
                    icon: 'iconfont hc-edit',
                    click: function () {
                        //进入编辑状态
                        $scope.form.editing = true;
                    }
                },
                refresh:{
                    title: '刷新',
                    icon: 'iconfont hc-refresh',
                    click: function () {
                        return $scope.refresh && $scope.refresh();
                    }
                }
            });

            constant.defineConstProp($scope, 'footerRightButtons', $scope.footerRightButtons);

            specialProperty.defineHide($scope.footerRightButtons.refresh, function () {
                //若没有启用刷新按钮
                if (!sysParams.ShowRefreshButtonInPropPage) {
                    return true;
                }

                //若没有禁用编辑状态控制
                //且已经处于编辑状态
                if (!sysParams.DisableEditingControl && $scope.$eval('form.editing')) {
                    return true;
                }

                //若是新增状态
                if ($scope.$eval('data.isInsert')) {
                    return true;
                }

                return false;
            });

            specialProperty.defineHide($scope.footerRightButtons.edit, function () {
                //已经处于编辑状态
                if ($scope.$eval('form.editing')) {
                    return true;
                }

                var readonlyRules = $scope.$eval('data.objConf.readonlyRules');

                if (readonlyRules && readonlyRules.length) {
                    if (readonlyRules.some(function (rule) {
                        return rule.readonly == 1;
                    })) {
                        return false;
                    }
                }

                return $scope.isFormReadonly();
            });

            specialProperty.defineHide($scope.footerRightButtons.cancelEdit, function () {
                return sysParams.DisableEditingControl || $scope.$eval('!form.editing || data.isInsert');
            });

            specialProperty.defineHide($scope.footerRightButtons.submit, function () {
                //若没有禁用编辑状态控制
                //且已经处于编辑状态
                if (!sysParams.DisableEditingControl && $scope.$eval('form.editing')) {
                    return true;
                }

                //在流程标签页
                if ($scope.$eval('tabController.isTabActive("wf")')) {
                    return true;
                }

                //若有流程
                if ($scope.wf) {
                    return $scope.wf.can_not_submit_reason;
                }
                //若无流程
                else {
                    //没关联流程模板，或不是【制单】状态，或没有【编辑权限】，不能启动流程
                    if ($scope.$eval('!data.objConf.objwftempofobjconfs.length || data.currItem.stat > 1 || !data.objConf.isAllowed("edit")')) {
                        return true;
                    };

                    return false;
                }
            });

            specialProperty.defineHide($scope.footerRightButtons.reject, function () {
                //若没有禁用编辑状态控制
                //且已经处于编辑状态
                if (!sysParams.DisableEditingControl && $scope.$eval('form.editing')) {
                    return true;
                }

                return $scope.$eval('!wf || wf.can_not_reject_reason || tabController.isTabActive("wf")');
            });

            specialProperty.defineHide($scope.footerRightButtons.break, function () {
                //若没有禁用编辑状态控制
                //且已经处于编辑状态
                if (!sysParams.DisableEditingControl && $scope.$eval('form.editing')) {
                    return true;
                }

                return $scope.$eval('!wf || wf.can_not_break_reason || tabController.isTabActive("wf")');
            });

            specialProperty.defineHide($scope.footerRightButtons.save, function () {
                if ($scope.error) {
                    return true;
                }

                if ($scope.$state.params.readonly === 'true') {
                    return true;
                }

                if (!$scope.form.editing) {
                    return true;
                }

                if ($scope.$eval('tabController.isTabActive("wf")')) {
                    return true;
                }

                var readonlyRules = $scope.$eval('data.objConf.readonlyRules');

                if (readonlyRules && readonlyRules.length) {
                    if (readonlyRules.some(function (rule) {
                        return rule.readonly == 1;
                    })) {
                        return false;
                    }
                }

                return $scope.isFormReadonly();
            });

            specialProperty.defineHide($scope.footerRightButtons.saveThenSubmit, function whenToHideButtonSaveThenSubmit() {
                //若没有关联流程模板，或不是制单状态，则隐藏
                return !$scope.$eval('data.objConf.objwftempofobjconfs.length')
                    || $scope.$eval('data.currItem.stat > 1')
                    || $scope.footerRightButtons.save.hide === true
                    || (typeof $scope.footerRightButtons.save.hide === 'function' && $scope.footerRightButtons.save.hide());
            });

            /* specialProperty.defineHide($scope.footerRightButtons.add, function whenToHideButtonAdd() {
                //若不是从列表页打开，或已经是新增状态，则隐藏
                return $scope.$state.params.openedByListPage !== 'true' || $scope.data.isInsert;
            }); */

            specialProperty.defineHide($scope.footerRightButtons.saveThenAdd, function whenToHideButtonSaveThenAdd() {
                //若不是从列表页打开，或不是制单状态，则隐藏
                return $scope.$state.params.openedByListPage !== 'true' || $scope.$eval('data.currItem.stat > 1') || $scope.footerRightButtons.save.hide === true ||(typeof $scope.footerRightButtons.save.hide === 'function' && $scope.footerRightButtons.save.hide());
            });

            specialProperty.defineHide($scope.footerRightButtons.print, function whenToHideButtonPrint() {
                var hide;

                (function () {
                    hide = true;

                    //新增时不显示
                    if ($scope.$eval('data.isInsert')) {
                        return;
                    }

                    //若启用了编辑状态控制
                    if (!sysParams.DisableEditingControl) {
                        //处于编辑状态时不显示
                        if ($scope.$eval('form.editing')) {
                            return;
                        }
                    }

                    //若没有关联打印模板，不显示
                    if ($scope.$eval('!data.objConf.objrptconfofobjconfs.length')) {
                        return;
                    }

                    hide = false;
                })();

                if (!hide && !printApi.doSinglePrint) {// 动态加载printApi
                    require(["printApi"], function (printapi) {
                        printApi = printapi;
                    })();
                }

                return hide;
            });

            Object.defineProperty($scope.footerRightButtons, 'add', {
                get: function () {
                    console.warn('按钮 add 已弃用，但仍兼容，请改为 saveThenAdd');
                    return this.saveThenAdd;
                },
                set: function (value) {
                    console.warn('按钮 add 已弃用，但仍兼容，请改为 saveThenAdd');
                    this.saveThenAdd = value;
                }
            });
        }

        /**
         * 定义函数，所有函数请都定义在此处
         * @param {object} target 函数定义在哪个对象上
         */
        function defineFunction(target) {

            /**
             * 返回ID字段
             * @return {string} ID字段
             * @since 2018-10-29
             */
            target.getIdField = function () {
                return $scope.data.idField;
            };

            /**
             * 返回ID
             * @return {number} ID
             * @since 2018-10-29
             */
            target.getId = function () {
                return numberApi.toNumber($scope.data.currItem[$scope.getIdField()]);
            };

            /**
             * 刷新
             * @since 2018-10-29
             */
            target.refresh = function () {
                return $q
                    .when($scope.getId())
                    .then($scope.instantiate);
            };

            /**
             * 实例化
             * @return {Promise}
             * @since 2018-12-19
             */
            target.instantiate = function (id) {
                return $q
                    .when(id)
                    .then($scope.requestSelect)
                    .then($scope.setBizData);
            };

            /**
             * select 请求
             * @param {number} id
             * @return {Promise}
             * @since 2018-12-19
             */
            target.requestSelect = function (id) {
                var postParams, response;

                /**
                 * 返回请求参数
                 */
                function getPostParams() {
                    return postParams;
                }

                /**
                 * 设置响应对象，然后返回
                 * @param responseToSet
                 * @return
                 */
                function setResponse(responseToSet) {
                    return response = responseToSet;
                }

                /**
                 * 返回响应对象
                 * @param responseToSet
                 */
                function getResponse() {
                    return response;
                }

                return $q
                    .when()
                    .then(function () {
                        postParams = {
                            classId: $scope.data.classId,
                            action: 'select',
                            data: {}
                        };

                        postParams.data[$scope.data.idField] = numberApi.toNumber(id);
                    })
                    .then(getPostParams)
                    .then($scope.doBeforeSelect)
                    .then(getPostParams)
                    .then(requestApi.post)
                    .then(setResponse)
                    .then($scope.doAfterSelect)
                    .then(getResponse);
            };

            /**
             * 发select请求之前的处理
             * @param postData 请求的数据
             * @since 2018-10-29
             */
            target.doBeforeSelect = function (postData) {

            };

            /**
             * 发select请求之后的处理
             * @param responseData 响应的数据
             * @since 2018-10-29
             */
            target.doAfterSelect = function (responseData) {

            };

            /**
             * 设置业务数据
             * @param bizData 业务数据
             * @since 2018-10-30
             */
            target.setBizData = function (bizData) {
                //只有嵌入标签页显示的会具有此属性
                if ($scope.titleConfig) {
                    (function () {
                        var name = bizData[$scope.data.codeField] || bizData[$scope.data.nameField] || '详情'; //编码或名称
                        $scope.titleConfig.title = $scope.titleConfig.originalTitle + '【' + name + '】';
                    })();
                }

                $scope.data.currItem = bizData;

                if ($scope.data.objConf) {
                    $scope.data.objConf.getMatchedRules(bizData);
                }

                $scope.$eval('projAttachController.setAttaches(data.currItem.epm_project_attachs)');

                /* wfControllerReady.then(function (wfController) {
                    wfController.setObjId($scope.getId());

                    var wfId = numberApi.toNumber($scope.data.currItem.wfid);
                    if (wfId != 0) {
                        wfController.setWfId(wfId);
                    }
                    else if ($scope.$eval('data.objConf.objwftempofobjconfs.length===1')) {
                        wfController.setWfTempId($scope.data.objConf.objwftempofobjconfs[0].wftempid);
                    }
                }); */
            };

            /**
             * 设置业务数据
             * @param bizData 业务数据
             * @since 2018-10-30
             */
            /*

            业务控制器重写【设置业务数据】方法的示例

            $scope.setBizData = function (bizData) {
                $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                //设置头部数据的步骤已在基础控制器实现

                //设置明细数据到表格
                $scope.明细表格选项1.hcApi.setRowData(bizData.明细数组1);
                $scope.明细表格选项2.hcApi.setRowData(bizData.明细数组2);
            };

            */

            /**
             * 设置权限
             * @param bizData 业务数据
             * @since 2018-10-30
             */
            target.setRight = function (bizData) {

            };

            /**
             * 新增
             * @since 2018-10-29
             */
            target.add = function () {
                return $q
                    .when()
                    .then(function () {
                        $scope.data.isInsert = true;

                        return $scope.newBizData($scope.data.currItem = {});
                    });
            };

            /**
             * 新增时对业务对象的处理
             * @param bizData 新增时的数据
             * @since 2018-10-30
             */
            target.newBizData = function (bizData) {
                bizData.stat = 1; //单据状态：制单
                bizData.wfid = 0; //流程ID
                bizData.wfflag = 0; //流程标识
                bizData.creator = strUserId; //创建人

                if ($scope.data.objConf) {
                    $scope.data.objConf.getMatchedRules(bizData);
                }
            };

            /**
             * 从源对象复制
             * @param {number} srcId
             * @return {Promise}
             * @since 2018-12-19
             */
            target.copyFrom = function (srcId) {
                var response;

                /**
                 * 设置响应对象，然后返回
                 * @param responseToSet
                 * @return
                 */
                function setResponse(responseToSet) {
                    return response = responseToSet;
                }

                /**
                 * 返回响应对象
                 * @param responseToSet
                 */
                function getResponse() {
                    return response;
                }

                return $q
                    .when(srcId)
                    .then($scope.requestSelect)
                    .then(setResponse)
                    .then($scope.copyBizData)
                    .then(getResponse)
                    .then($scope.setBizData)
                    .finally(function () {
                        $scope.data.isInsert = true;
                    });
            };

            /**
             * 处理复制对象，主要是去除不能复制的信息，业务控制器应【继承】和【重写】
             * @example
             * ```js
             * $scope.copyBizData = function (bizData) {
             *     //基础控制器的处理复制对象，已处理了ID、状态等字段
             *     $scope.hcSuper.copyBizData(bizData);
             *
             *     //根据业务控制器的个性化需求处理复制对象
             *     //主要操作是去除不能复制的信息
             *     bizData.numberField = 0;
             *     bizData.stringField = '';
             *     bizData.arrayField = [];
             * };
             * ```
             * @param {object} bizData
             * @since 2018-12-19
             */
            target.copyBizData = function (bizData) {
                bizData[$scope.data.idField] = 0; //清除ID
                bizData[$scope.data.codeField] = ''; //清除编码
                bizData[$scope.data.nameField] = ''; //清除名称

                bizData.stat = 1; //单据状态：制单
                bizData.wfid = 0; //流程ID
                bizData.wfflag = 0; //流程标识
                bizData.creator = strUserId; //创建人
                bizData.createtime = ''; //创建时间
                bizData.updator = ''; //修改人
                bizData.updatetime = ''; //修改时间
            };

            /**
             * 保存
             * @since 2018-10-29
             */
            target.save = function () {
                var postParams, response, invalidInfoBox, needToConfirmStartWf;

                /**
                 * 接收请求的响应数据
                 * @param responseToAccept
                 */
                function acceptResponse(responseToAccept) {
                    response = responseToAccept;
                    return response;
                }

                /**
                 * 返回请求的响应数据
                 */
                function returnResponse() {
                    return response;
                }

                return $q.when()
                    .then(function () {
                        //停止所有表格的编辑
                        $scope.stopEditingAllGrid && $scope.stopEditingAllGrid();

                        return $timeout(300);
                    })
                    /* .then(function () {
                        return swalApi.confirm({
                            title: '确定要保存吗？',
                            closeOnConfirm: false //点击【确定】后不消失
                        });
                    }) */
                    .then(function () {
                        //装 验证不通过的信息 的盒子
                        return invalidInfoBox = [];
                    })
                    .then($scope.validCheck)
                    .then(function () {
                        //若盒子非空，验证不通过，弹框
                        if (invalidInfoBox.length)
                            return swalApi.error(invalidInfoBox)
                                .then(function () {
                                    return $q.reject(invalidInfoBox);
                                });
                    })
                    .then(function () {
                        postParams = {
                            classId: $scope.data.classId,
                            data: {}
                        };

                        postParams.data[$scope.data.idField] = $scope.getId();

                        if ($scope.data.isInsert)
                            postParams.action = 'insert';
                        else
                            postParams.action = 'update';

                        return postParams.data;
                    })
                    .then($scope.saveBizData)
                    .then(function () {
                        return postParams;
                    })
                    .then($scope.doBeforeSave)
                    .then(function () {
                        return postParams;
                    })
                    .then(requestApi.post)
                    .then(acceptResponse)
                    .then(function () {
                        $scope.data.isInsert = false;
                    })
                    .then(returnResponse)
                    .then($scope.doAfterSave)
                    .then(returnResponse)
                    .then($scope.setBizData)
                    .then(function () {
                        requestApi
                            .post({
                                classId: 'scp_action_log',
                                action: 'insert',
                                data: {
                                    action: postParams.action,
                                    objtype: $scope.data.objConf.objtypeid,
                                    objid: $scope.getId()
                                },
                                noShowWaiting: true,
                                noShowError: true
                            })
                            .then(function () {
                                return gridApi.execute($scope.actionLogGridOptions, function (gridOptions) {
                                    return gridOptions.hcApi.search();
                                });
                            });

                        //退出编辑状态
                        $scope.form.editing = false;

                        return swalApi.success($scope.footerRightButtons.save.title + '成功');
                    })
                    .then(returnResponse)
                    ;
            };

            /**
             * 表单验证
             * 实现方式：收集验证不通过的信息
             * @param {string[]} invalidBox 信息盒子，字符串数组，验证不通过时，往里面放入信息即可
             */
            target.validCheck = function (invalidBox) {
                var len = invalidBox.length;

                //获取【必填验证不通过】的【模型控制器】数组
                var requiredInvalidModelControllers = $scope.form.$error.required;
                if (requiredInvalidModelControllers && requiredInvalidModelControllers.length) {
                    requiredInvalidModelControllers.forEach(function (modelController) {
                        //获取【模型控制器】的【输入组件控制器】的【文本标签】
                        invalidBox.push(modelController.getInputController().getLabel());
                    });
                }

                //表格必填验证
                angular.forEach($scope.gridCache, function (gridOptions) {
                    gridOptions.hcApi.validCheckForRequired(invalidBox);
                });

                if (invalidBox.length > len) {
                    invalidBox.splice(len, 0, '以下内容为必填项，请补充完整');
                }
                
                if ($scope.projAttachController) {
                    $scope.projAttachController.validCheck(invalidBox);
                }
            };

            /**
             * 保存视图数据到业务对象
             * @param saveData 保存请求的数据
             * @since 2018-10-30
             */
            target.saveBizData = function (saveData) {
                angular.extend(saveData, angular.copy($scope.data.currItem));

                if ($scope.projAttachController) {
                    saveData.epm_project_attachs = $scope.projAttachController.getAttaches();
                }
            };

            /**
             * 保存视图数据到业务对象
             * @param saveData 保存请求的数据
             * @since 2018-10-30
             */
            /*

            业务控制器重写【保存视图数据到业务对象】方法的示例

            $scope.saveBizData = function (bizData) {
                $scope.hcSuper.saveBizData(bizData); //继承基础控制器的方法，类似Java的super
                //保存头部数据的步骤已在基础控制器实现

                //保存表格的数据到明细数组
                bizData.明细数组1 = $scope.明细表格选项1.hcApi.getRowData();
                bizData.明细数组2 = $scope.明细表格选项2.hcApi.getRowData();
            };

            */

            /**
             * 发保存请求之后的处理
             * @param responseData 响应的数据
             * @since 2018-10-29
             */
            target.doAfterSave = function (responseData) {

            };

            /**
             * 初始化
             * @since 2018-10-29
             */
            target.doInit = function () {
                var promise;

                //若是新增
                if ($scope.data.isInsert) {
                    //只有嵌入标签页显示的会具有此属性
                    if ($scope.titleConfig) {
                        $scope.titleConfig.title = $scope.titleConfig.originalTitle + '【新增】';
                    }

                    var copyFrom = numberApi.toNumber($scope.$state.params.copyFrom);

                    if (copyFrom) {
                        promise = $scope.copyFrom(copyFrom);
                    }
                    else {
                        promise = $scope.add();
                    }
                    
                    promise.then(function () {
                        if (!$scope.isFormReadonly()) {
                            $scope.form.editing = true;
                        }
                    });
                }
                else {
                    promise = $scope.refresh();

                    promise.then(function () {
                        return requestApi
                            .post({
                                classId: 'scp_action_log',
                                action: 'insert',
                                data: {
                                    action: 'open',
                                    objtype: $scope.data.objConf.objtypeid,
                                    objid: $scope.getId()
                                },
                                noShowWaiting: true,
                                noShowError: true
                            })
                            .then(function () {
                                return gridApi.execute($scope.actionLogGridOptions, function (gridOptions) {
                                    return gridOptions.hcApi.search();
                                });
                            });
                    });
                }

                promise.catch(function () {
                    $scope.error = true;
                });

                return promise;
            };

            /**
             * 标签页改变事件
             * @param params = {
             *     id: 标签页ID
             *     tab: 标签页定义
             * }
             * @since 2018-11-30
             */
            target.onTabChange = function (params) {
                //若切换到流程页
                /* if (params.id === 'wf') {
                    wfControllerReady.then(function (wfController) {
                        wfController.show();
                    });
                } */
            };

            /**
             * 是否有流程权限
             */
            target.hasWfRight = function () {
                return numberApi.toNumber($scope.$eval('data.currItem.wfright')) >= 2;
            };

            /**
             * 表单只读吗？
             * @returns {boolean}
             */
            target.isFormReadonly = function () {
                if ($scope.$state.params.readonly === 'true') return true;

                //有流程
                var hasWf = !!numberApi.toNumber($scope.$eval('data.currItem.wfid'));
                if (hasWf) {
                    return !$scope.hasWfRight(); //无流程权限不能修改
                }

                //若是单据
                var isBill = $scope.$eval('data.objConf.isbill==2||data.objConf.objwftempofobjconfs.length');
                if (isBill) {
                    var isCreating = numberApi.toNumber($scope.data.currItem.stat) <= 1;    //制单状态
                    if (!isCreating) {
                        return true; //非制单状态不能修改
                    }
                }

                if ($scope.$eval('data.objConf.isAllowed("edit") !== true')) {
                    return true;
                }

                return false;
            };

            /**
             * 打印
             */
            target.print = function () {
                printApi.doSinglePrint($scope.data);
            };

        }

        //定义数据
        defineData();

        //在作用域上定义函数
        defineFunction($scope);

        //在 hcSuper 上再定义一次函数，这样子控制器重写函数的时候可以调用父控制器的函数
        defineFunction($scope.hcSuper = $scope.hcSuper || {});

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

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: BaseObjProp
    });
});