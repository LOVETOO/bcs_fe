/**
 * 流程模板 - 属性页
 * @since 2018-12-18
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'numberApi', 'promiseApi', 'swalApi', 'constant', 'openBizObj', 'directive/hcFlow', 'directive/hcAutoHeight', 'directive/hcModal'], defineFn)
})(function (module, controllerApi, base_obj_prop, numberApi, promiseApi, swalApi, constant, openBizObj) {

    /**
     * 控制器
     */
    WfTempProp.$inject = ['$scope', '$stateParams', '$q', '$modal'];
    function WfTempProp($scope, $stateParams, $q, $modal) {
        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        angular.extend($scope.tabs, {
            flow: {
                title: '流程图'
            },
            instance: {
                title: '流程实例',
                hide: function () {
                    return $scope.$eval('data.isInsert');
                }
            }
        });

        (function () {
            var searched = false;

            $scope.onTabChange = function (params) {
                $scope.hcSuper.onTabChange(params);

                if (params.id === 'instance') {
                    $scope.$eval('instanceForm.keyword.getInputController().focus()');

                    if (!searched) {
                        searched = true;
                        $scope.$eval('instanceGridOptions.hcApi.search()');
                    }
                }
            };
        })();

        /**
         * 新增业务数据
         * @override
         */
        $scope.newBizData = function (bizData) {
            bizData.parentid = numberApi.toNumber($stateParams.fdrId);
            if (!bizData.parentid) {
                return swalApi.error('新增时，必须指定文件夹ID').then($q.reject);
            }

            $scope.hcSuper.newBizData(bizData);

            bizData.parenttype = constant.objType.fdr; //文件夹

            bizData.actived = 2; //可用
            bizData.canselect = 2; //可选择
            bizData.breakprocid = 99999; //允许中断
            bizData.submitctrl = 2; //驳回后允许保留提交历史

            $scope.data.currNode = null;
            $scope.data.currLine = null;

            var flowData = {
                title: bizData.wftempname,
                nodes: {},
                lines: {}
            };

            bizData.wfproctempofwftemps = [{
                proctempid: 0,
                proctype: 1,
                posy: 20,
                posx: 20
            }, {
                proctempid: 99999,
                proctype: 2,
                posy: 20,
                posx: 600
            }];
            bizData.proccondtempofwftemps = [];

            bizData.wfproctempofwftemps.forEach(function (proc) {
                flowData.nodes[getNodeId.call(proc)] = proc;
            });

            $scope.flowSetting.hcReady.then(function (flow) {
                flow.clearData(false);
                flow.loadData(flowData);
            });
        }

        /**
         * 设置业务数据
         * @override
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);

            var flowData = {
                title: bizData.wftempname,
                nodes: {},
                lines: {}
            };

            bizData.wfproctempofwftemps.forEach(function (proc) {
                proc.dontRedefined = false;
                flowData.nodes[getNodeId.call(proc)] = proc;
            });

            bizData.proccondtempofwftemps.forEach(function (procCond) {
                procCond.dontRedefined = false;
                flowData.lines[getLineId.call(procCond)] = procCond;
            });

            $scope.flowSetting.hcReady.then(function (flow) {
                flow.clearData(false);
                flow.loadData(flowData);
                flow.focusItem('proc_1', true);
            });

            //设置“中断设置”词汇
            //$scope.resetBreakProcIds();
        };

        /**
         * 中断设置
         */
        $scope.breakProcIds = [
            {value: -1, name: "禁止中断"},
            {value: 99999, name: "允许中断"}
        ];

        /**
         * 重置中断设置词汇
         */
        $scope.resetBreakProcIds = function(){
            $scope.breakProcIds.length = 2;
            $scope.data.currItem.wfproctempofwftemps.forEach(function (proc) {
                //设置词汇“中断设置”
                if(numberApi.toNumber(proc.proctempid) > 0 &&  numberApi.toNumber(proc.proctempid)!= 99999){
                    var obj = {
                        value:proc.proctempid,
                        name:'\''+proc.proctempname+'\'节点后不允许中断'
                    };
                    $scope.breakProcIds.push(obj);
                }
            });
        };

        /**
         * 返回流程图节点ID
         * @returns {string}
         */
        function getNodeId() {
            return 'proc_' + this.proctempid;
        }

        /**
         * 返回流程图连线ID
         * @returns {string}
         */
        function getLineId() {
            return 'line_' + this.fromprocid + '_' + this.toprocid;
        }

        /**
         * 流程节点 产生 流程图节点
         * @param {CPCWFProcTemp} proc 流程节点
         * @returns {Node} 流程图节点
         */
        function procToNode(proc) {
            //新节点
            if (angular.isUndefined(proc.proctempid)) {
                angular.extend(proc, {
                    width: 104,
                    height: 100,
                    astatime: '',
                    varsufproc: 1,
                    aendtime: '',
                    defcid: 0,
                    delayperiod: 0,
                    isskip: 1,
                    noticemode: 1,
                    noticeusers: '',
                    minperson: 0,
                    sufproctype: 1,
                    alarmmode: 0,
                    pstatime: '',
                    ctrlprocname: '',
                    proctype: 3,
                    canmodify: 1,
                    pendtime: '',
                    archivetoid: '',
                    allperson: 1,
                    delayrate: 0,
                    priority: 1,
                    note: '',
                    failuser: '',
                    proctempid: 1,
                    addexpertfromkeyc: 1,
                    checkset: 0,
                    punishrate: 0,
                    delaytimes: 0,
                    submitfunc: '',
                    pubset: 0,
                    needevaluate: 0,
                    period: 100,
                    freq: 0,
                    canreject: 2,
                    arrivefunc: '',
                    keepshortcut: 1,
                    archiveset: 0,
                    clientsubfunc: '',
                    ctrlsubmitfunc: '',
                    absent: 0,
                    rejectprocname: '',
                    defopinion: '',
                    sufprocuserset: 1,
                    checkfunc: '',
                    checkkeydefprop: 1,
                    ctrlproc: '',
                    alarmperiod: 0,
                    ctrluser: '',
                    wfproctempnoticeofwfproctemps: [],
                    procusertempofwfproctemps: [],
                    prizerate: 0,
                    unreject: 1,
                    stat: 1,
                    wfuserrangeofwfproctemps: [],
                    archivetotype: '',
                    signflag: '',
                    operright: 1,
                    manager: '',
                    rejectfunc: '',
                    ctrltrans: 0,
                    rejectprocid: ''
                });

                var maxId = 0;

                angular.forEach($scope.flow.$nodeData, function (node) {
                    var procTempId = numberApi.toNumber(node.proctempid);

                    if (procTempId === 99999) return;

                    if (procTempId > maxId) maxId = procTempId;
                });

                proc.proctempid = maxId + 1;
                proc.proctempname = '过程' + proc.proctempid;
                proc.posy = proc.top;
                proc.posx = proc.left;
                if(proc.proctempid == 1){
                    proc.operright = 3;
                }

                $scope.data.currItem.wfproctempofwftemps.push(proc);
            }

            if(!proc.dontRedefined){
                Object.defineProperties(proc, {
                    id: {
                        get: getNodeId,
                        set: $.noop
                    },
                    name: {
                        get: function () {
                            if (this.isStart) return '开始';
                            if (this.isEnd) return '结束';
                            return this.proctempid + ' - ' + this.proctempname;
                        },
                        set: $.noop
                    },
                    type: {
                        get: function () {
                            if (this.isStart) return 'start round';
                            if (this.isEnd) return 'end round';
                            return 'node';
                        },
                        set: $.noop
                    },
                    top: {
                        get: function () {
                            return this.posy;
                        },
                        set: function (value) {
                            this.posy = value;
                        }
                    },
                    left: {
                        get: function () {
                            return this.posx;
                        },
                        set: function (value) {
                            this.posx = value;
                        }
                    },
                    isStart: {
                        get: function () {
                            return this.proctempid == 0;
                        },
                        set: $.noop
                    },
                    isEnd: {
                        get: function () {
                            return this.proctempid == 99999;
                        },
                        set: $.noop
                    }
                });
            }
        }

        /**
         * 流程节点连线 产生 流程图节点连线
         * @param {CPCProcCondTemp} procCond
         */
        function procCondToLine(procCond) {
            if (procCond.from || procCond.to) {
                //连线起点和终点相同的，不增加
                if (procCond.from == procCond.to) return false;

                var existed = Object.keys($scope.flow.$lineData).some(function (lineId) {
                    var line = $scope.flow.$lineData[lineId];

                    return line.from == procCond.from && line.to == procCond.to
                });

                //已存在的连线，不再增加
                if (existed) return false;
            }

            if (angular.isUndefined(procCond.fromprocid)) {
                procCond.fromprocid = $scope.flow.$nodeData[procCond.from].proctempid;
                procCond.toprocid = $scope.flow.$nodeData[procCond.to].proctempid;
                procCond.lefttext = '';

                $scope.data.currItem.proccondtempofwftemps.push(procCond);
            }

            if(!procCond.dontRedefined){
                Object.defineProperties(procCond, {
                    id: {
                        get: getLineId,
                        set: $.noop
                    },
                    from: {
                        get: function () {
                            return 'proc_' + this.fromprocid;
                        },
                        set: $.noop
                    },
                    to: {
                        get: function () {
                            return 'proc_' + this.toprocid;
                        },
                        set: $.noop
                    },
                    fromNode: {
                        get: function () {
                            return $scope.flow.getItemInfo(this.from, 'node');
                        },
                        set: $.noop
                    },
                    toNode: {
                        get: function () {
                            return $scope.flow.getItemInfo(this.to, 'node');
                        },
                        set: $.noop
                    },
                    name: {
                        get: function () {
                            return this.lefttext;
                        },
                        set: function (value) {
                            this.lefttext = value;
                        }
                    }
                });

            }
        }

        /**
         * 流程图设置
         */
        $scope.flowSetting = {
            haveTool: true,
            toolBtns: ['task'],
            haveDashed: false,
            haveGroup: false,
            useOperStack: true,
            hcName: 'flow',
            hcReady: promiseApi(),
            hcEvents: {
                /**
                 * 添加节点后触发的事件
                 * @param {string} id 元素的id，唯一标识。
                 * @param {string} type 元素的种类，有'node'节点、'line'连线两种。
                 * @returns {boolean}
                 */
                onItemAdd: function (id, type, json) {
                    if (type === 'node') {
                        procToNode(json);
                    }
                    else if (type === 'line') {
                        if (procCondToLine(json) === false)
                            return false;

                        if ($scope.flow.getItemInfo(json.id, 'line'))
                            return false;
                    }

                    $scope.resetBreakProcIds();

                    return true;
                },
                /**
                 * 元素的删除事件
                 * @param {string} id 元素的id，唯一标识。
                 * @param {string} type 元素的种类，有'node'节点、'line'连线两种。
                 * @returns {boolean}
                 */
                onItemDel: function (id, type) {
                    if (type === 'node') {
                        var node = $scope.flow.$nodeData[id];

                        if (node.isStart || node.isEnd) {
                            console.warn('【%s】节点不能删除', node.name);
                            return false;
                        }

                        var nodes = $scope.data.currItem.wfproctempofwftemps;
                        var index = nodes.indexOf(node);
                        nodes.splice(index, 1);
                    }
                    else if (type === 'line') {
                        var line = $scope.flow.$lineData[id];
                        var lines = $scope.data.currItem.proccondtempofwftemps;
                        var index = lines.indexOf(line);
                        lines.splice(index, 1);
                    }

                    //如果删除的是中断设置的节点，则设置中断设置为默认“允许中断”
                    if($scope.data.currItem.breakprocid == id.substr(id.indexOf('_')+1)){
                        $scope.resetBreakProcIds();
                        $scope.data.currItem.breakprocid = 99999;
                    }

                    return true;
                },
                /**
                 * 当操作某个元素（节点/连线）被由不选中变成选中时，触发的方法。
                 * @param {string} id 元素的id，唯一标识。
                 * @param {string} type 元素的种类，有'node'节点、'line'连线两种。
                 * @returns {boolean}
                 */
                onItemFocus: function (id, type) {
                    $scope.data.currNode = type === 'node' ? $scope.flow.$nodeData[id] : null;
                    $scope.data.currLine = type === 'line' ? $scope.flow.$lineData[id] : null;

                    if ($scope.data.currNode) {
                        if ($scope.data.currNode.isStart || $scope.data.currNode.isEnd) {
                            $scope.data.currNode = null;
                        }
                        // else if (id !== $scope.flow.hcLastFocus)
                        //     $scope.procUserGridOptions.hcApi.setRowData($scope.data.currNode.procusertempofwfproctemps);
                    }

                    return true;
                },
                /**
                 * 当操作某个元素（节点/ 连线）被由选中变成不选中时，触发的方法。
                 * @param {string} id 元素的id，唯一标识。
                 * @param {string} type 元素的种类，有'node'节点、'line'连线两种。
                 * @returns {boolean}
                 */
                onItemBlur: function (id, type) {
                    $scope.flow.hcLastFocus = id || '';
                    $scope.data.currNode = null;
                    $scope.data.currLine = null;
                    return true;
                },
                /**
                 * 流程节点单元格双击事件
                 * @param {string} id 元素的id，唯一标识。
                 * @param {string} type 元素的种类，有'node'节点、'line'连线两种。
                 * @returns {boolean}
                 */
                onItemDbClick: function (id, type) {

                    //重绘流程图
                    $scope.repaint = function(){
                        var flowData = {
                            title: $scope.data.currItem.wftempname,
                            nodes: {},
                            lines: {}
                        };

                        $scope.data.currItem.wfproctempofwftemps.forEach(function (proc) {
                            //已有节点设置一个标志,防止重新定义节点
                            proc.dontRedefined = true;
                            flowData.nodes[getNodeId.call(proc)] = proc;
                        });

                        $scope.data.currItem.proccondtempofwftemps.forEach(function (procCond) {
                            //已有节点设置一个标志,防止重新定义节点
                            procCond.dontRedefined = true;
                            flowData.lines[getLineId.call(procCond)] = procCond;
                        });

                        //重绘节点
                        $scope.flowSetting.hcReady.then(function (flow) {
                            flow.clearData(false);
                            flow.loadData(flowData);
                            //flow.focusItem('proc_1', true);
                        });
                    };

                    if (type === 'node') {
                        if ($scope.flow.$nodeData[id].isStart || $scope.flow.$nodeData[id].isEnd)
                            return false;

                        var promise = $scope.nodeModal.open({
							/*height: 'calc(100vh - 60px)',
                            size: 'max',*/
                            width:'1060px',
                            height:'680px',
                            controller: ['$scope', '$q', function ($nodeScope, $q) {
                                // window.require([
                                //     'directive/hcTab'
                                // ])

                                //根据模板编辑状态控制节点的只读
                                $nodeScope.isReadonly = function () {
                                    return $scope.form.isReadonly();
                                };

                                $nodeScope.title = '节点';

                                $nodeScope.tabs_node = {
                                    node_base: {
                                        title: '基本信息',
                                        active: true
                                    },
                                    user: {
                                        title: '执行用户'
                                    },
                                    fun: {
                                        title: '高级功能'
                                    }/*,
                                    ctrlfun: {
                                        title: '控制参数'
                                    },
                                    noticeset: {
                                        title: '通知设置'
                                    }*/
                                };

                                /**
                                 * 节点类型 
                                 */
                                $nodeScope.procTypes = [
                                    {value: 3, name: '普通'},
                                    {value: 4, name: '归档'},
                                    {value: 5, name: '发布目标'},
                                    {value: 6, name: '发布审核'},
                                    {value: 7, name: '发布'},
                                    {value: 8, name: '取消归档'},
                                    {value: 9, name: '加入论坛'},
                                    {value: 10, name: '监控'},
                                    {value: 11, name: '延迟处理'},
                                    {value: 12, name: '决策'},
                                    {value: 20, name: '审核'},
                                    {value: 21, name: '外部系统提交'}
                                ];

                                /**
                                 * 过程权限
                                 */
                                $nodeScope.operRights = [
                                    {value: 1, name: '只读'},
                                    {value: 2, name: '修改'},
                                    {value: 3, name: '完全控制'}
                                ];

                                /**
                                 * 过程状态
                                 */
                                $nodeScope.stats = [
                                    {value: 1, name: '计划'},
                                    {value: 2, name: '下达'},
                                    {value: 3, name: '启动'},
                                    {value: 4, name: '执行'},
                                    {value: 5, name: '驳回'},
                                    {value: 6, name: '中止'},
                                    {value: 7, name: '完成'},
                                    {value: 8, name: '归档'},
                                    {value: 9, name: '发布'},
                                    {value: 10, name: '变更'},
                                    {value: 11, name: '废止'}
                                ];

                                /*
                                 * 后续节点类型
                                 */
                                $nodeScope.sufproctypes = [
                                    {value: 1, name: '无条件执行'},
                                    {value: 2, name: '自动条件执行'},
                                    {value: 3, name: '手动执行(单分支)'},
                                    {value: 4, name: '手动执行(多分支)'},
                                    {value: 5, name: '半自动条件(单分支)'}
                                ];

                                //过程权限
                                $nodeScope.isskips = [
                                    {value: 1, name: "必须执行"},
                                    {value: 2, name: "允许跳过"},
                                    {value: 3, name: "自动执行(立即)"},
                                    {value: 4, name: "自动执行(到期)"}];
                                /**
                                 * 优先级
                                 */
                                $nodeScope.priorities = [
                                    {value: 1, name: '高'},
                                    {value: 2, name: '中'},
                                    {value: 3, name: '低'}
                                ];

                                //驳回类型
                                $nodeScope.canrejects = [
                                    {value: 1, name: "不能驳回"},
                                    {value: 2, name: "允许驳回"},
                                    {value: 3, name: "监控人驳回"}];

                                //归档设置
                                $nodeScope.archivesets = [
                                    {value: 1, name: "提升版本"},
                                    {value: 2, name: "替换版本"}];

                                //监控转交
                                $nodeScope.ctrltranss = [
                                    {value: 1, name: "不能转交"},
                                    {value: 2, name: "当前步"},
                                    {value: 3, name: "前一步"}];

                                //检查设置
                                $nodeScope.checksets = [
                                    {value: 1, name: "不检查"},
                                    {value: 2, name: "提交时检查"},
                                    {value: 3, name: "驳回时检查"},
                                    {value: 4, name: "提交和驳回都检查"}];

                                //允许中断过程
                                $nodeScope.breakprocids = [
                                    {value: -1, name: "禁止中断"},
                                    {value: 99999, name: "允许中断"}]


                                $nodeScope.data = {
                                    currNode: angular.copy($scope.data.currNode)
                                };

                                /**
                                 * 节点执行用户表格
                                 */
                                $nodeScope.procUserGridOptions = {
                                    defaultColDef: {
                                        cellStyle: {
                                            'text-align': 'center'
                                        }
                                    },
                                    columnDefs: [{
                                        type: '序号'
                                    }, {
                                        field: 'isposition',
                                        headerName: '类型',
                                        hcDictCode: 'CPCProcUserTemp.IsPosition',
                                        width: 120
                                    }, {
                                        field: 'userid',
                                        headerName: '名称',
                                        width: 200
                                    }],
                                    hcReady: $q.deferPromise()
                                };

                                $nodeScope.procUserGridOptions.hcReady.then(function () {
                                    $nodeScope.procUserGridOptions.hcApi.setRowData($nodeScope.data.currNode.procusertempofwfproctemps);
                                });
                                /**
                                 * 节点用户范围表格
                                 */
                                $nodeScope.procUserRangerGridOptions = {
                                    defaultColDef: {
                                        cellStyle: {
                                            'text-align': 'center'
                                        }
                                    },
                                    columnDefs: [{
                                        type: '序号'
                                    }, {
                                        field: 'orgpath',
                                        headerName: '所属机构',
                                        // hcDictCode: 'CPCProcUserTemp.IsPosition',
                                        width: 400
                                    }, {
                                        field: 'userid',
                                        headerName: '名称',
                                        width: 200
                                    }],
                                    hcReady: $q.deferPromise()
                                };

                                $nodeScope.procUserRangerGridOptions.hcReady.then(function () {
                                    $nodeScope.procUserRangerGridOptions.hcApi.setRowData($nodeScope.data.currNode.wfuserrangeofwfproctemps);
                                });

                                $nodeScope.footerLeftButtonGroups = {
                                    add: {
                                        icon: 'iconfont hc-add',
                                        type: 'dropdown',
                                        click: 'addProcUser',
                                        hide: function () {
                                            // return !$nodeScope.tabs_node.user.active;
                                            return true;
                                        }
                                    }
                                };

                                /**
                                 * 按钮【新增节点用户】
                                 */
                                $nodeScope.addProcUser = function (type) {
                                    return $modal
                                        .openCommonSearch({
                                            classId: 'scpuser',
                                            checkbox: true
                                        })
                                        .result
                                        .then(function (users) {
                                            if ($nodeScope.$eval('data.currNode.procusertempofwfproctemps.length > 0')) {
                                                var oldUsers = $nodeScope.data.currNode.procusertempofwfproctemps.filter(function (x) {
                                                    return x.isposition == 1;
                                                });
                                                users = users.filter(function (user) {
                                                    return oldUsers.every(function (x) {
                                                        return x.userid !== user.userid;
                                                    });
                                                });
                                            }

                                            users.forEach(function (user) {
                                                angular.extend(user, {
                                                    "agent": "",
                                                    "emptyset": 1,
                                                    "ismajor": 1,
                                                    "isposition": 1, //用户
                                                    "note": "",
                                                    "rate": 1,
                                                    "stat": 0,
                                                    "orgpath": user.namepath
                                                });
                                            });

                                            var gridName = 'procUserGridOptions';
                                            var gridModelName = 'procusertempofwfproctemps';
                                            if (type == 'ranger') {
                                                gridName = 'procUserRangerGridOptions';
                                                gridModelName = 'wfuserrangeofwfproctemps';
                                            }

                                            if ($nodeScope.data.currNode[gridModelName]) {
                                                Array.prototype.push.apply($nodeScope.data.currNode[gridModelName], users);
                                            }
                                            else {
                                                $nodeScope.data.currNode[gridModelName] = users;
                                            }
                                            //设置数据
                                            $nodeScope[gridName].hcApi.setRowData($nodeScope.data.currNode[gridModelName]);
                                        });
                                };

                                /**
                                 * 按钮【新增企业岗位】
                                 */
                                $nodeScope.addGroupPosition = function () {
                                    return $modal
                                        .openCommonSearch({
                                            classId: 'scpgroupposition',
                                            checkbox: true
                                        })
                                        .result
                                        .then(function (positions) {
                                            if ($nodeScope.$eval('data.currNode.procusertempofwfproctemps.length > 0')) {
                                                var oldPositions = $nodeScope.data.currNode.procusertempofwfproctemps.filter(function (x) {
                                                    return x.isposition == 2; //企业岗位
                                                });
                                                positions = positions.filter(function (position) {
                                                    return oldPositions.every(function (x) {
                                                        return x.userid !== position.positionid;
                                                    });
                                                });
                                            }

                                            positions.forEach(function (position) {
                                                angular.extend(position, {
                                                    "agent": "",
                                                    "emptyset": 1,
                                                    "ismajor": 1,
                                                    "isposition": 2, //企业岗位
                                                    "note": "",
                                                    "rate": 1,
                                                    "stat": 0,
                                                    "userid": position.positionid,
                                                    "username": position.positionname
                                                });
                                            });

                                            if ($nodeScope.data.currNode.procusertempofwfproctemps) {
                                                Array.prototype.push.apply($nodeScope.data.currNode.procusertempofwfproctemps, positions);
                                            }
                                            else {
                                                $nodeScope.data.currNode.procusertempofwfproctemps = positions;
                                            }

                                            //设置数据
                                            $nodeScope.procUserGridOptions.hcApi.setRowData($nodeScope.data.currNode.procusertempofwfproctemps);
                                        });
                                }

                                /**
                                 * 按钮【新增机构岗位】
                                 */
                                $nodeScope.addOrgPosition = function () {
                                    return $modal
                                        .openCommonSearch({
                                            classId: 'scpposition',
                                            checkbox: true
                                        })
                                        .result
                                        .then(function (positions) {
                                            if ($nodeScope.$eval('data.currNode.procusertempofwfproctemps.length > 0')) {
                                                var oldPositions = $nodeScope.data.currNode.procusertempofwfproctemps.filter(function (x) {
                                                    return x.isposition == 3; //机构岗位
                                                });
                                                positions = positions.filter(function (position) {
                                                    return oldPositions.every(function (x) {
                                                        return x.userid !== position.positionid;
                                                    });
                                                });
                                            }

                                            positions.forEach(function (position) {
                                                angular.extend(position, {
                                                    "agent": "",
                                                    "emptyset": 1,
                                                    "ismajor": 1,
                                                    "isposition": 3, //机构岗位
                                                    "note": "",
                                                    "rate": 1,
                                                    "stat": 0,
                                                    "userid": position.positionid,
                                                    "username": position.positionname
                                                });
                                            });

                                            if ($nodeScope.data.currNode.procusertempofwfproctemps) {
                                                Array.prototype.push.apply($nodeScope.data.currNode.procusertempofwfproctemps, positions);
                                            }
                                            else {
                                                $nodeScope.data.currNode.procusertempofwfproctemps = positions;
                                            }

                                            //设置数据
                                            $nodeScope.procUserGridOptions.hcApi.setRowData($nodeScope.data.currNode.procusertempofwfproctemps);
                                        });
                                }

                                /**
                                 * 按钮【删除节点用户】
                                 */
                                $nodeScope.deleteProcUser = function (type) {
                                    var gridName = 'procUserGridOptions';
                                    var gridModelName = 'procusertempofwfproctemps';
                                    if (type == 'ranger') {
                                        gridName = 'procUserRangerGridOptions';
                                        gridModelName = 'wfuserrangeofwfproctemps';
                                    }

                                    var idx = $nodeScope[gridName].hcApi.getFocusedRowIndex();
                                    if (idx < 0) {
                                        swalApi.info('请选中要删除的用户');
                                    } else {
                                        $nodeScope.data.currNode[gridModelName].splice(idx, 1);
                                        $nodeScope[gridName].api.setRowData($nodeScope.data.currNode[gridModelName]);
                                    }
                                }
                                //通知网格字段
                                $nodeScope.noticeSetgridOptions = {
                                    columnDefs: [
                                        {
                                            type: '序号'
                                        },
                                        {
                                            headerName: "通知方式",
                                            field: "noticemode"
                                        },
                                        {
                                            headerName: "通知目标",
                                            field: "noticetarget"
                                        },
                                        {
                                            headerName: "通知类型",
                                            field: "noticetype"
                                        },
                                        {
                                            headerName: "延期周期(小时)",
                                            field: "delayperiod"
                                        },
                                        {
											headerName: "备注",
                                            field: "note"
                                        }
                                    ]
                                };

                                /**
                                 * 【确定】按钮
                                 */
                                $nodeScope.footerRightButtons.ok = {
                                    title: '确定',
                                    click: function () {
                                        angular.extend($scope.data.currNode, $nodeScope.data.currNode);
                                        $nodeScope.$close();
                                    },
                                    hide: function(){
                                        return $nodeScope.isReadonly();
                                    }
                                };


                                $nodeScope.footerRightButtons.close.title = '取消';


                                /**======================点击选择 ================事件 **/

                                /**
                                 * 可控过程选择
                                 */
                                $nodeScope.selectCtrlProc = function () {
                                    var procs = [];
                                    for (var i = 0; i < $scope.data.currItem.wfproctempofwftemps.length; i++) {
                                        if ($scope.data.currItem.wfproctempofwftemps[i].proctempid == 0 || $scope.data.currItem.wfproctempofwftemps[i].proctempid == 99999
                                            || $scope.data.currItem.wfproctempofwftemps[i].proctempid == $nodeScope.data.currNode.proctempid) {
                                            continue;
                                        }
                                        procs.push($scope.data.currItem.wfproctempofwftemps[i]);
                                    }

                                    /**可控过程弹出选择 **/
                                    $scope.ctrlprocModal.open({
                                        size: 'md',
                                        controller: ['$scope', function (ctrlproc) {
                                            ctrlproc.title = '可控过程';
                                            ctrlproc.data = {
                                                currNode: angular.copy($nodeScope.data.currNode)
                                            };

                                            /**
                                             * 可控过程表格
                                             */
                                            ctrlproc.ctrlProcOptions = {
                                                columnDefs: [{
                                                    field: 'proctempid',
                                                    headerName: '过程号',
                                                    headerCheckboxSelection: true,
                                                    headerCheckboxSelectionFilteredOnly: true,
                                                    checkboxSelection: true
                                                }, {
                                                    field: 'proctempname',
                                                    headerName: '过程名称'
                                                }],
                                                hcReady: $q.deferPromise(),
                                                onRowDoubleClicked: function () {

                                                }
                                            };
                                            ctrlproc.ctrlProcOptions.hcReady.then(function () {
                                                ctrlproc.ctrlProcOptions.hcApi.setRowData(procs);

                                                //如果有可控过程要设置选择
                                                if ($nodeScope.data.currNode.ctrlproc) {
                                                    //设置选中
                                                    ctrlproc.ctrlProcOptions.api.getModel().forEachNode(function (node) {
                                                        //如果可控过程流程节点匹配上对应过程节点则设置选中
                                                        if (($nodeScope.data.currNode.ctrlproc + ",").indexOf(node.data.proctempid + ",") > -1) {
                                                            node.setSelected(true);
                                                        }
                                                    });
                                                }
                                            });

                                            /**
                                             * 【确定】按钮
                                             */
                                            ctrlproc.footerRightButtons.ok.hide = false;
                                            ctrlproc.footerRightButtons.ok.click = function () {
                                                var selectNodes = ctrlproc.ctrlProcOptions.api.getSelectedNodes();
                                                var strIds = "";
                                                var strNames = "";
                                                if (selectNodes && selectNodes.length > 0) {
                                                    for (var i = 0; i < selectNodes.length; i++) {
                                                        if (strNames.length > 0) {
                                                            strIds += "," + selectNodes[i].data.proctempid;
                                                            strNames += "," + selectNodes[i].data.proctempname;
                                                        } else {
                                                            strIds = selectNodes[i].data.proctempid;
                                                            strNames = selectNodes[i].data.proctempname;
                                                        }
                                                    }
                                                }

                                                HczyCommon.safeApply($scope, function () {
                                                    $nodeScope.data.currNode.ctrlproc = strIds;
                                                    $nodeScope.data.currNode.ctrlprocname = strNames;
                                                })
                                                ctrlproc.$close();
                                            };
                                            ctrlproc.footerRightButtons.close.title = '取消';
                                        }]
                                    });
                                };


                                /**
                                 *可驳回过程选择
                                 */
                                $nodeScope.selectRejectProc = function () {
                                    var procs = [];
                                    //获取当前过程的前置过程列表
                                    $scope.getPrevProcList($scope.data.currNode, procs);
                                    //删除不能被驳回的节点
                                    if (procs.length > 0) {
                                        for (var i = procs.length - 1; i > -1; i--) {
                                            //过滤掉开始/结束/当前/不能被驳回节点
                                            if (procs[i].canreject <= 1 || procs[i].proctempid == 0) {
                                                procs.splice(i, 1);
                                            }
                                        }
                                    }
                                    if(procs.length == 0){
                                        swalApi.error("没有可驳回的节点！");
                                        return false;
                                    }

                                    /*$scope.rejectProcOptions.api.setRowData(procs);
                                    $("#rejectproc").modal("show");*/

                                    $scope.rejectProcModal.open({
                                        size: 'md',
                                        controller: ['$scope', function (rejectProc) {
                                            rejectProc.title = '可驳回过程';
                                            rejectProc.data = {
                                                currNode: angular.copy($nodeScope.data.currNode)
                                            };

                                            /**
                                             * 可驳回过程表格
                                             */
                                            rejectProc.rejectProcOptions = {
                                                columnDefs: [{
                                                    field: 'proctempid',
                                                    headerName: '过程号',
                                                    headerCheckboxSelection: true,
                                                    headerCheckboxSelectionFilteredOnly: true,
                                                    checkboxSelection: true
                                                }, {
                                                    field: 'proctempname',
                                                    headerName: '过程名称'
                                                }],
                                                hcReady: $q.deferPromise()
                                            };

                                            //如果有可驳回过程要设置选择
                                            rejectProc.rejectProcOptions.hcReady.then(function () {
                                                rejectProc.rejectProcOptions.hcApi.setRowData(procs);

                                                //如果有可控过程要设置选择
                                                if ($nodeScope.data.currNode.rejectprocid) {
                                                    //设置选中
                                                    $scope.rejectProcOptions.api.getModel().forEachNode(function (node) {
                                                        //如果可驳回过程流程节点匹配上对应过程节点则设置选中
                                                        if (($scope.data.currNode.rejectprocid + ",").indexOf(node.data.proctempid + ",") > -1) {
                                                            node.setSelected(true);
                                                        }
                                                    });
                                                }
                                            });

                                            /**
                                             * 【确定】按钮
                                             */
                                            rejectProc.footerRightButtons.ok.hide = false;
                                            rejectProc.footerRightButtons.ok.click = function () {
                                                var selectNodes = rejectProc.rejectProcOptions.api.getSelectedNodes();
                                                var strIds = "";
                                                var strNames = "";
                                                if (selectNodes && selectNodes.length > 0) {
                                                    for (var i = 0; i < selectNodes.length; i++) {
                                                        if (strNames.length > 0) {
                                                            strIds += "," + selectNodes[i].data.proctempid;
                                                            strNames += "," + selectNodes[i].data.proctempname;
                                                        } else {
                                                            strIds = selectNodes[i].data.proctempid;
                                                            strNames = selectNodes[i].data.proctempname;
                                                        }
                                                    }
                                                }

                                                HczyCommon.safeApply($scope, function () {
                                                    //$nodeScope.data.currNode.ctrlproc = strIds;
                                                    //$nodeScope.data.currNode.ctrlprocname = strNames;
                                                    $nodeScope.data.currNode.rejectprocid = strIds;
                                                    $nodeScope.data.currNode.rejectprocname = strNames;
                                                });
                                                rejectProc.$close();
                                            };
                                            rejectProc.footerRightButtons.close.title = '取消';
                                        }]
                                    });
                                };

                                /**
                                 *得到过程的前置过程列表
                                 * @param proc 指定过程
                                 * @param procList 过程列表
                                 */
                                $scope.getPrevProcList = function (proc, procList) {
                                    if (proc.proctempid > 0) {
                                        for (line in $scope.flow.$lineData) {
                                            var objCond = $scope.flow.$lineData[line];
                                            if (objCond.toprocid == proc.proctempid) {
                                                procList.push($scope.flow.$nodeData['proc_' + objCond.fromprocid]);
                                                //递归查询
                                                $scope.getPrevProcList($scope.flow.$nodeData['proc_' + objCond.fromprocid], procList);
                                            }
                                        }
                                    }
                                };

                                //初始化可驳回过程
                                $nodeScope.initBreakProcIds = function () {
                                    if ($nodeScope.data.currNode.wfproctempofwftemps && $nodeScope.data.currNode.wfproctempofwftemps.length > 0) {
                                        for (var i = 0; i < $nodeScope.data.currNode.wfproctempofwftemps.length; i++) {
                                            var proc = $nodeScope.data.currNode.wfproctempofwftemps[i];
                                            if (proc.proctempid != 0 && proc.proctempid != 99999) {
                                                $nodeScope.breakprocids.push({
                                                    id: proc.proctempid,
                                                    name: proc.proctempname
                                                });
                                            }
                                        }
                                    }
                                }

                                //  初始化可驳回过程
                                $nodeScope.initBreakProcIds();
                            }]
                        }).result;

                        //关闭节点属性页后重新绘制(刷新)、重置“中断设置”词汇
                        promise.finally(function(){

                            $scope.repaint();

                            //重命名词汇
                            var breakProcId = $scope.data.currItem.breakprocid;
                            $scope.resetBreakProcIds();
                            $scope.data.currItem.breakprocid = breakProcId;

                        });
                    }
                    else if (type === 'line') {
                        //取得连线两端节点id，id格式如：line_0_7
                        var fromprocid = id.substring(id.indexOf('_')+1,id.lastIndexOf('_'));
                        var toprocid = id.substring(id.lastIndexOf('_')+1);
                        //开始节点连线不进行设置
                        if(fromprocid == 0){
                            return;
                        }

                        var promise = $scope.lineModal.open({
							height: 300,
                            controller: ['$scope', '$q', function ($lineScope, $q) {
                                //根据模板编辑状态控制节点的只读
                                $lineScope.isReadonly = function () {
                                    return $scope.form.isReadonly();
                                };

                                $lineScope.title = '连线';

                                $lineScope.data = {
                                    currLine: angular.copy($scope.data.currLine)
                                };
                                if ($lineScope.data.currLine.actived === undefined || $lineScope.data.currLine.actived === null || parseInt($lineScope.data.currLine.actived) == 0) {
                                    $lineScope.data.currLine.actived = 2;
                                }
                                /**
                                 * 【确定】按钮
                                 */
                                $lineScope.footerRightButtons.ok.hide = function(){
                                    return $lineScope.isReadonly();
                                };
                                $lineScope.footerRightButtons.ok.click = function () {
                                    angular.extend($scope.data.currLine, $lineScope.data.currLine);
                                    $lineScope.$close();
                                };

                                $lineScope.footerRightButtons.close.title = '取消';
                            }]
                        }).result;

                        promise.finally(function(){
                            $scope.repaint();
                        });

                    }

                    return false;
                }
            }
        };

        $scope.flowSetting.hcReady.then(function (flow) {
            flow.$workArea.parent().css('left', '0px');
        });

        /**
         * 流程图按钮
         */
        $scope.flowButtons = {
            stopDraw: {
                title: '停止绘图',
                icon: 'fa fa-pause',
                click: function () {
                    $scope.flow.switchToolBtn('cursor');
                },
                disabled: function () {
                    return $scope.form.isReadonly() || !$scope.flow || $scope.flow.$nowType === 'cursor';
                }
            },
            drawNode: {
                title: '画节点',
                icon: 'fa fa-circle-o',
                click: function () {
                    $scope.flow.switchToolBtn('task');
                },
                disabled: function () {
                    return $scope.form.isReadonly() || !$scope.flow || $scope.flow.$nowType === 'task';
                }
            },
            drawLine: {
                title: '画连线',
                icon: 'fa fa-long-arrow-right',
                click: function () {
                    $scope.flow.switchToolBtn('direct');
                },
                disabled: function () {
                    return $scope.form.isReadonly() || !$scope.flow || $scope.flow.$nowType === 'direct';
                }
            },
            tidy: {
                title: '自动整理',
                click: function () {
                    var linesOfAllProcs = {};

                    angular.forEach($scope.flow.$lineData, function (line) {
                        var nodeId = line.from;
                        var linesOfProc = linesOfAllProcs[nodeId];
                        if (linesOfProc) {
                            linesOfProc.push(line);
                        }
                        else {
                            linesOfProc = [line];
                            linesOfAllProcs[nodeId] = linesOfProc;
                        }
                    });

                    var node = $scope.flow.getItemInfo('proc_0', 'node');
                    var left = 20, top, lineWidth = 30;
                    do {
                        top = (node.isStart || node.isEnd) ? 51 : 20;

                        $scope.flow.moveNode(node.id, left, top);

                        left = numberApi.sum(left, node.width, lineWidth);

                        var linesOfProc = linesOfAllProcs[node.id];
                        if (!linesOfProc) break;
                        node = linesOfProc[0].toNode;
                    } while (node);
                },
                disabled:function(){
                    return $scope.form.isReadonly();
                }
            }
        };
        /**
         * 【流程实例】表格
         */
        $scope.instanceGridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'subject',
                headerName: '主题',
                width: 150
            }, {
                field: 'stat',
                headerName: '状态',
                hcDictCode: 'scpwf.stat'
            }, {
                field: 'startor',
                headerName: '启动用户'
            }, {
                field: 'statime',
                headerName: '启动时间',
                type: '时间'
            }, {
                field: 'endtime',
                headerName: '结束时间',
                type: '时间'
            }, {
                field: 'note',
                headerName: '备注',
                type: '大文本'
            }],
            hcReady: $q.deferPromise(),
            hcSearchWhenReady: false,
            hcClassId: 'scpwf',
            hcDataRelationName: 'wfs',
            hcPostData: function () {
                return {
                    wftempid: $scope.$eval('data.currItem.wftempid')
                };
            },
            hcEvents: {
                cellDoubleClicked: function (params) {
                    //双击打开流程实例
                    openBizObj({
                        wfId: params.data.wfid
                    });
                }
            },
            hcName: '流程实例'
        };

        $scope.instanceGridOptions.hcReady.then(function (gridOptions) {
            gridOptions.hcScope.pageSize = 20;
        });

        // /**
        //  * 节点类型
        //  */
        // $scope.procTypes = [
        //     {value: 3, name: '普通'},
        //     {value: 4, name: '归档'},
        //     {value: 5, name: '发布目标'},
        //     {value: 6, name: '发布审核'},
        //     {value: 7, name: '发布'},
        //     {value: 8, name: '取消归档'},
        //     {value: 9, name: '加入论坛'},
        //     {value: 10, name: '监控'},
        //     {value: 11, name: '延迟处理'},
        //     {value: 12, name: '决策'},
        //     {value: 20, name: '审核'}
        // ];

        // /**
        //  * 过程权限
        //  */
        // $scope.operRights = [
        //     {value: 1, name: '只读'},
        //     {value: 2, name: '修改'},
        //     {value: 3, name: '完全控制'}
        // ];

        // /**
        //  * 节点执行用户表格
        //  */
        // $scope.procUserGridOptions = {
        //     columnDefs: [{
        //         type: '序号'
        //     }, {
        //         field: 'userid',
        //         headerName: '用户'
        //     }]
        // };

        // /**
        //  * 按钮【新增节点用户】
        //  */
        // $scope.footerLeftButtons.addProcUser = {
        //     title: '新增节点用户',
        //     click: function () {
        //         $scope.FrmInfo = {
        //             title: "用户查询",
        //             thead: [{
        //                 name: "人员编码",
        //                 code: "employee_code"
        //             }, {
        //                 name: "姓名",
        //                 code: "employee_name"
        //             }, {
        //                 name: "部门编码",
        //                 code: "dept_code"
        //             }, {
        //                 name: "部门名称",
        //                 code: "dept_name"
        //             }],
        //             classid: "base_view_erpemployee_org",
        //             //type:"checkbox",
        //             url: "/jsp/req.jsp",
        //             direct: "left",
        //             sqlBlock: "",
        //             backdatas: "base_view_erpemployee_orgs",
        //             ignorecase: "true", //忽略大小写
        //             postdata: {"flag": 1},
        //             searchlist: ["employee_code", "employee_name", "dept_code", "dept_name"],
        //             realtime: true
        //         };
        //         BasemanService.open(CommonPopController, $scope).result.then(function (result) {
        //             var userData = {
        //                 "agent": "",
        //                 "emptyset": 1,
        //                 "ismajor": 1,
        //                 "isposition": 1,
        //                 "note": "",
        //                 "rate": 1,
        //                 "stat": 0,
        //                 "userid": result.employee_code,
        //                 "username": result.employee_name
        //             }
        //             if (!$scope.data.currNode.procusertempofwfproctemps) {
        //                 $scope.data.currNode.procusertempofwfproctemps = [];
        //             }
        //             $scope.data.currNode.procusertempofwfproctemps.push(userData);
        //             //设置数据
        //             $scope.procUserGridOptions.api.setRowData($scope.data.currNode.procusertempofwfproctemps);
        //         })

        //     },
        //     hide: function () {
        //         return !$scope.data.currNode;
        //     }
        // };

        // /**
        //  * 按钮【删除节点用户】
        //  */
        // $scope.footerLeftButtons.deleteProcUser = {
        //     title: '删除节点用户',
        //     click: function () {
        //         var idx = $scope.procUserGridOptions.hcApi.getFocusedRowIndex();
        //         if (idx < 0) {
        //             swalApi.info('请选中要删除的用户');
        //         } else {
        //             $scope.data.currNode.procusertempofwfproctemps.splice(idx, 1);
        //             $scope.procUserGridOptions.api.setRowData($scope.data.currNode.procusertempofwfproctemps);
        //         }
        //     },
        //     hide: function () {
        //         return !$scope.data.currNode;
        //     }
        // };
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: WfTempProp
    });
});