/**
 * 流程实例控制器
 * @param $scope
 * @param $location
 * @param $rootScope
 * @param $modal
 * @param $timeout
 * @param BasemanService
 * @param notify
 * @param $state
 * @param localeStorageService
 * @param FormValidatorService
 */
function ctrl_base_wfexec($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService,
                          FormValidatorService, $stateParams) {
    //ctrl_base_wfexec = HczyCommon.extend(ctrl_base_wfexec, ctrl_bill_public);
    //ctrl_base_wfexec.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state]);

    //全局对象定义
    $scope.data = {
        currItem: {},
        wftempid: $stateParams.wftempid,
        wfid: $stateParams.wfid,
        objtypeid: $stateParams.objtypeid,
        objid: $stateParams.objid,
        //自动启动流程和提交流程第一步的标志 1-是 0-否
        autoSubmit: $stateParams.submit,
        //当前过程
        currProc: {},
        //当前连接线
        currLine: {},
        //当前泳道
        currArea: {},
        //当前权限对象
        currRightObj: {
            //能否修改流程高级功能
            canModifyFunction: false,
            //能否提交流程
            canSubmit: false,
            //能否中断
            canBreak: false,
            //能否驳回
            canReject: false,
            //能否转办
            canTransfer: false,
            //能否修改高级功能
            canModifyFunc: false,
            //能否修改流程执行人
            canModifyProcUser: false,
            //是不是管理员
            isAdmin: false
        },
        transferobj: {"shift_name": '', "shift_note": '', "": '', "": ''},
        rejectProcs: [] //可驳回过程列表
    };
    //流程节点
    $scope.procnodes = {};
    //流程节点连线
    $scope.proclines = {};

    //过程状态
    $scope.stats = [
        {id: 1, name: "计划"},
        {id: 2, name: "下达"},
        {id: 3, name: "启动"},
        {id: 4, name: "执行"},
        {id: 5, name: "驳回"},
        {id: 6, name: "中止"},
        {id: 7, name: "完成"},
        {id: 8, name: "归档"},
        {id: 9, name: "发布"},
        {id: 10, name: "变更"},
        {id: 11, name: "废止"}];

    //过程类型
    $scope.proctypes = [
        {id: 3, name: "普通"},
        {id: 4, name: "归档"},
        {id: 5, name: "发布目标"},
        {id: 6, name: "发布审核"},
        {id: 7, name: "发布"},
        {id: 8, name: "取消归档"},
        {id: 9, name: "加入论坛"},
        {id: 10, name: "监控"},
        {id: 11, name: "延迟处理"},
        {id: 12, name: "决策"},
        {id: 20, name: "审核"}];

    //过程权限
    $scope.operrights = [
        {id: 1, name: "只读"},
        {id: 2, name: "修改"},
        {id: 3, name: "完全控制"}];

    //过程优先级
    $scope.prioritys = [
        {id: 1, name: "高"},
        {id: 2, name: "中"},
        {id: 3, name: "低"}];

    //后续节点类型
    $scope.sufproctypes = [
        {id: 1, name: "无条件执行"},
        {id: 2, name: "自动条件执行"},
        {id: 3, name: "手动条件执行(单分支)"},
        {id: 4, name: "手动条件执行(多分支)"},
        {id: 5, name: "半自动条件(单分支)"}];

    //过程权限
    $scope.isskips = [
        {id: 1, name: "必须执行"},
        {id: 2, name: "允许跳过"},
        {id: 3, name: "自动执行(立即)"},
        {id: 4, name: "自动执行(到期)"}];

    //驳回类型
    $scope.canrejects = [
        {id: 1, name: "不能驳回"},
        {id: 2, name: "允许驳回"},
        {id: 3, name: "监控人驳回"}];

    //归档设置
    $scope.archivesets = [
        {id: 1, name: "提升版本"},
        {id: 2, name: "替换版本"}];

    //监控转交
    $scope.ctrltranss = [
        {id: 1, name: "不能转交"},
        {id: 2, name: "当前步"},
        {id: 3, name: "前一步"}];

    //检查设置
    $scope.checksets = [
        {id: 1, name: "不检查"},
        {id: 2, name: "提交时检查"},
        {id: 3, name: "驳回时检查"},
        {id: 4, name: "提交和驳回都检查"}];

    $scope.headername = "流程定义";
    $scope.flowChartProperty = {
        //toolBtns: ["start round mix", "end round", "task", "node", "chat", "state", "plug", "join", "fork", "complex mix"],
        haveHead: false,
        width: 994,
        height: 200,
        headLabel: false,
        //headBtns: ["new", "open", "save", "undo", "redo", "reload", "print"],//如果haveHead=true，则定义HEAD区的按钮
        haveTool: false,
        // haveDashed: false,
        // haveGroup: false,
        useOperStack: false
    };

    var property = {
        //   toolBtns:["task","node","chat","state","plug"],
        haveHead: true,
        //headBtns:["new","open","save","undo","redo","reload"],//如果haveHead=true，则定义HEAD区的按钮 //2017-10-20 15:29:25GooFlow.js中按钮早已被废弃，现改为主题
        haveTool: false,
        useOperStack: false
    };

    //流程对象初始化
    $scope.wfflowObj = $.createGooFlow($('#wfFlowChart'), $scope.flowChartProperty);

    //网格设置
    $scope.gridOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: true
        //onClick:dgOnClick
    };

    //用户网格字段
    $scope.userColumns = [
        {
            id: "userid",
            name: "代号",
            behavior: "select",
            field: "userid",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "username",
            name: "姓名",
            behavior: "select",
            field: "username",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //通知网格字段
    $scope.noticeColumns = [
        {
            id: "seq",
            name: "序号",
            field: "seq",
            behavior: "select",
            cssClass: "cell-selection",
            width: 45,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        },
        {
            id: "noticemode",
            name: "通知方式",
            behavior: "select",
            field: "noticemode",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "noticetarget",
            name: "通知目标",
            behavior: "select",
            field: "noticetarget",
            editable: false,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "noticetype",
            name: "通知类型",
            behavior: "select",
            field: "noticetype",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "delayperiod",
            name: "延期周期(小时)",
            behavior: "select",
            field: "delayperiod",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "note",
            name: "备注",
            behavior: "select",
            field: "note",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //查询用户
    $scope.selectUser = function () {
        BasemanService.chooseUser({
            title: '用户查询',
            scope: $scope,
            then: function (res) {
                var idx = $scope.ctrlProcOptions.api.getFocusedCell().rowIndex;
                var node = $scope.ctrlProcOptions.api.getModel().getRow(idx);
                node.data.userid = res.employee_code;
                //data.agentname = res.username;
                $scope["ctrlProcOptions"].api.refreshRows([node]);
                $scope["ctrlProcOptions"].api.stopEditing(false);
            }
        });
    }

    //可控过程网格
    $scope.ctrlProcColums = [
        {
            id: "procname",
            headerName: "过程名称",
            field: "procname",
            width: 120
        },
        {
            id: "userid",
            headerName: "用户",
            field: "userid",
            width: 120,
            editable: true,
            action: $scope.selectUser,
            cellEditor: "弹出框",
            cellStyle: {'background-color': 'rgb(233, 242, 243)'}
        }
    ]

    //可控过程流程网格配置项目
    $scope.ctrlProcOptions = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        fixedGridHeight: true,
        enableRangeSelection: false,
        rowSelection: "single", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        showToolPanel: false
    };

    //驳回过程网格
    $scope.rejectProcColums = [
        {
            id: "procid",
            name: "过程号",
            headerName: "过程号",
            field: "procid",
            width: 80,
            checkboxSelection: true,
            headerCheckboxSelection: true
        },
        {
            id: "procname",
            name: "过程名称",
            headerName: "过程名称",
            field: "procname",
            width: 150
        }
    ]

    //驳回过程流程网格配置项目
    $scope.rejectProcOptions = {
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: false, //one of [true, false]
        enableFilter: false, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowDeselection: false,
        quickFilterText: null,
        rowDoubleClicked: null,
        rowClicked: null,
        cellEditingStopped: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        showToolPanel: false,
        toolPanelSuppressSideButtons: true,
        rowHeight: 30,
        fixedGridHeight:130,
        rowSelection: 'single'
    };

    //执行人网格初始化
    $scope.userGridView = new Slick.Grid("#usergrid", [], $scope.userColumns, $scope.gridOptions);
    //用户范围网格初始化
    $scope.userRangeGridView = new Slick.Grid("#userrangegrid", [], $scope.userColumns, $scope.gridOptions);
    //通知网格初始化
    // $scope.noticeSetGridView = new Slick.Grid("#noticesetgrid", [], $scope.noticeColumns, $scope.gridOptions);

    $scope.userRangeGridView.onDblClick.subscribe(userRangeDblClick);


    /**
     * 元素选中事件
     * @param id
     * @param type
     */
    $scope.wfflowObj.onItemFocus = function (id, type) {
        if ("node" == type) {
            $scope.data.currProc = $scope.wfflowObj.$nodeData[id];
            //设置按钮权限
            $scope.setButtonRight();
        } else if ("line" == type) {

        } else if ("area" == type) {

        }

        return true;//返回false可以阻止浏览器默认的右键菜单事件
    }

    /**
     * 流程节点单元格双击事件
     * @param id
     * @param type
     * @returns {boolean}
     */
    $scope.wfflowObj.onItemDbClick = function (id, type) {
        if ("node" == type) {
            $scope.data.currProc = $scope.wfflowObj.$nodeData[id];
            $scope.data.currProc.id = id;
            if ($scope.data.currProc.procid == 0 || $scope.data.currProc.procid == 99999) {
                return false;
            }
            $scope.userGridView.setData([]);
            //设置数据
            if ($scope.data.wfid && $scope.data.wfid > 0) {
                if ($scope.data.currProc.procuserofwfprocs) {
                    $scope.userGridView.setData($scope.data.currProc.procuserofwfprocs);
                } else {
                    $scope.userGridView.setData([]);
                }
            } else {
                $scope.userGridView.setData($scope.data.currProc.procusertempofwfproctemps);
            }

            //重绘网格
            $scope.userGridView.render();
            $("#procprop").modal();
            $scope.$apply();
        } else if ("line" == type) {
            $scope.data.currLine = $scope.wfflowObj.$lineData[id];
            //初始化当前节点的来源过程和目标过程名称
            $scope.getcurrLineProcName();
            $("#condprop").modal();
        } else if ("area" == type) {

        }

        return false;//返回false可以阻止浏览器默认的右键菜单事件
    }

    /**
     * 获得当前连线的过程名称
     */
    $scope.getcurrLineProcName = function () {
        if ($scope.data.currLine && $scope.wfflowObj.$nodeData) {
            for (nodename in $scope.wfflowObj.$nodeData) {
                var nodeobj = $scope.wfflowObj.getItemInfo(nodename, "node");
                if (nodeobj.procid == $scope.data.currLine.fromprocid) {
                    $scope.data.currLine.fromprocname = nodeobj.procname;
                }
                if (nodeobj.procid == $scope.data.currLine.toprocid) {
                    $scope.data.currLine.toprocname = nodeobj.procname;
                }
            }
        }
    }

    /**
     *添加节点后触发的事件
     * @param id id是单元的唯一标识ID,
     * @param type type是单元的种类,有"node","line","area"三种取值
     * @param json json即addNode,addLine或addArea方法的第二个传参json
     */
    $scope.wfflowObj.onItemAdd = function (id, type, json) {
        //没有过程名称说明是新添加的过程
        // if (!json.procname && type == "node") {
        //     json = $scope.initNewProc(json);
        // } else if (!json.procname && type == "line") {
        //     json = $scope.initNewLine(json);
        // }
        return true;
    }

    /**
     * 元素的删除事件
     * @param id
     * @param type
     */
    $scope.wfflowObj.onItemDel = function (id, type) {
        //type是单元的种类,有"node","line","area"三种取值
        if ("node" == type) {

        } else if ("line" == type) {

        } else if ("area" == type) {

        }
        return true;
    }
    /**
     * 新过程初始化
     * @param json
     */
    $scope.initNewProc = function (json) {
        var newProcObj = {
            //"width": 104,
            "astatime": "",
            "varsufproc": 1,
            //"height": 100,
            "aendtime": "",
            "defcid": 0,
            "delayperiod": 0,
            "isskip": 1,
            "noticemode": 1,
            "noticeusers": "",
            //"minperson": 0,
            "sufproctype": 1,
            "alarmmode": 0,
            "pstatime": "",
            "ctrlprocname": "",
            "proctype": 3,
            "canmodify": 1,
            "pendtime": "",
            //"wftempid": 369,
            //"endprocid": -1,
            "archivetoid": "",
            "allperson": 1,
            //"posy": 30,
            //"posx": 130,
            "delayrate": 0,
            "priority": 1,
            "note": "",
            "failuser": "",
            "proctempid": 1,
            "addexpertfromkeyc": 1,
            "checkset": 0,
            "punishrate": 0,
            "delaytimes": 0,
            "submitfunc": "",
            "pubset": 0,
            "needevaluate": 0,
            "period": 100,
            "freq": 0,
            "canreject": 2,
            "arrivefunc": "",
            "keepshortcut": 1,
            "archiveset": 0,
            "clientsubfunc": "",
            "ctrlsubmitfunc": "",
            "absent": 0,
            "rejectprocname": "",
            "defopinion": "",
            "sufprocuserset": 1,
            "checkfunc": "",
            "checkkeydefprop": 1,
            "ctrlproc": "",
            "alarmperiod": 0,
            "ctrluser": "",
            "wfproctempnoticeofwfproctemps": [],
            "procusertempofwfproctemps": [],
            "prizerate": 0,
            "unreject": 1,
            "stat": 1,
            "wfuserrangeofwfproctemps": [],
            "archivetotype": "",
            "signflag": "",
            "operright": 1,
            "manager": "",
            "rejectfunc": "",
            "ctrltrans": 0,
            "rejectprocid": ""
        }

        var iprocId = 0;//$scope.getMaxProcId($scope.wfflowObj.$nodeData);
        if ($scope.wfflowObj.$nodeCount > 0) {
            for (var proc in $scope.wfflowObj.$nodeData) {
                if ($scope.wfflowObj.$nodeData[proc].procid == 0 || $scope.wfflowObj.$nodeData[proc].procid == 99999) {
                    continue
                } else {
                    iprocId = $scope.wfflowObj.$nodeData[proc].procid;
                }
            }
        }
        if (json.type.indexOf("start") > -1) {
            newProcObj.proctempid = 0;
            newProcObj.procid = 0;
            newProcObj.procname = "开始";
            newProcObj.proctempname = "开始";
            newProcObj.name = "开始";
            newProcObj.type = "start";
        } else if (json.type.indexOf("end") > -1) {
            newProcObj.proctempid = 99999;
            newProcObj.procid = 99999;
            newProcObj.procname = "结束";
            newProcObj.proctempname = "结束";
            newProcObj.name = "结束";
            newProcObj.type = "end";
        } else {
            newProcObj.proctempid = iprocId + 1;
            newProcObj.procid = iprocId + 1;
            newProcObj.procname = "过程" + newProcObj.proctempid;
            newProcObj.proctempname = "过程" + newProcObj.proctempid;
            newProcObj.name = "过程" + newProcObj.proctempid;
            newProcObj.type = "task";
        }
        //继承
        if (!json.wftempid) {
            json = HczyCommon.extend(json, newProcObj);
        }

        return json
    }

    /**
     * 初始化开始和结束节点
     */
    $scope.initStartAndEndProc = function () {
        var procData = {
            "astatime": "",
            "varsufproc": 1,
            //"height": 100,
            "aendtime": "",
            "defcid": 0,
            "delayperiod": 0,
            "isskip": 1,
            "noticemode": 1,
            "noticeusers": "",
            //"minperson": 0,
            "sufproctype": 1,
            "alarmmode": 0,
            "pstatime": "",
            "ctrlprocname": "",
            "canmodify": 1,
            "pendtime": "",
            "archivetoid": "",
            "allperson": 1,
            "delayrate": 0,
            "priority": 1,
            "note": "",
            "failuser": "",
            "addexpertfromkeyc": 1,
            "checkset": 0,
            "punishrate": 0,
            "delaytimes": 0,
            "submitfunc": "",
            "pubset": 0,
            "needevaluate": 0,
            "period": 100,
            "freq": 0,
            "keepshortcut": 1,
            "archiveset": 0,
            "absent": 0,
            "rejectprocname": "",
            "defopinion": "",
            "sufprocuserset": 1,
            "checkfunc": "",
            "checkkeydefprop": 1,
            "ctrlproc": "",
            "alarmperiod": 0,
            "ctrluser": "",
            //"wfproctempnoticeofwfproctemps": [],
            "prizerate": 0,
            "unreject": 1,
            "stat": 1,
            //"wfuserrangeofwfproctemps": [],
            "archivetotype": "",
            "signflag": "",
            "operright": 1,
            "manager": "",
            //"preproc": 4,
            "rejectfunc": "",
            "ctrltrans": 0,
            "rejectprocid": ""
        }

        //继承
        $scope.procnodes['proc0'] = HczyCommon.extend({
            "proctempid": 0,
            "procid": 0,
            "procname": "开始",
            "proctempname": "开始",
            "proctype": 1,
            "name": "开始",
            "top": 50,
            "left": 100,
            "type": "start"
        }, procData);
        $scope.procnodes['proc99999'] = HczyCommon.extend({
            "proctempid": 99999,
            "procid": 99999,
            "procname": "结束",
            "proctempname": "结束",
            "name": "结束",
            "proctype": 2,
            "top": 50,
            "left": 500,
            "type": "end"
        }, procData);

        var wftempdata = {
            title: "新建流程模版",
            lines: $scope.proclines,
            nodes: $scope.procnodes,
        };
        $("#myModal5").modal();
        $scope.wfflowObj.loadData(wftempdata);
        $scope.wfflowObj.reinitSize();
    }

    /**
     * 初始化新连接线
     */
    $scope.initNewLine = function (json) {
        var condObj = {
            "actived": "0",
            //"conditions": "",
            "fromprocid": "0",
            "isdefault": "2",
            //"lefttext": "",
            "points": "",
            "righttext": "",
            "stat": "0",
            "toprocid": "1",
        }

        condObj.fromprocid = $scope.wfflowObj.$nodeData[json.from].procid;
        condObj.toprocid = $scope.wfflowObj.$nodeData[json.to].procid;
        //继承
        json = HczyCommon.extend(json, condObj);
        return json;
    }

    /**
     * 获取最大过程ID,排除99999
     * @param dataArray
     * @returns {number}
     */
    $scope.getMaxProcId = function (dataArray) {
        var iprocId = 0;
        if (dataArray) {
            for (var proc in dataArray) {
                if (proc.procid == 0 || proc.procid == 99999) {
                    continue
                } else {
                    iprocId = proc.procid;
                }
            }
        }
        return iprocId;
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {

    }

    /**
     * 初始化流程图
     * @param args
     */
    $scope.drawWfFlow = function () {
        if ($scope.data.wftempid && !$scope.data.wfid) {
            var postData = {"wftempid": $scope.data.wftempid, "stat": 2};
            BasemanService.RequestPost("scpwftemp", "select", JSON.stringify(postData))
                .then(function (data) {
                    $scope.data.currItem = data;
                    $scope.data.currItem.wfname = data.wftempname;
                    //初始化流程图对象
                    $scope.wfflowObj.clearData();
                    //组织初始化数据
                    $scope.initWfByTemp($scope.data.currItem);
                    //如果是自动提交需要启动流程
                    if ($scope.data.autoSubmit == 1) {
                        //启动流程
                        $scope.savewf();
                    }
                });
        } else if ($scope.data.wfid && $scope.data.wfid > 0) {
            //显示流程实例
            $scope.refreshwf($scope.data.wfid);
        } else {
            $("#myModal5").modal();
            $scope.wfflowObj.loadData({});
        }
    };

    /**
     * 刷新流程显示
     * @param wfid
     */
    $scope.refreshwf = function (wfid) {
        var postData = {"wfid": $scope.data.wfid};
        BasemanService.RequestPost("scpwf", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                //初始化流程图对象
                $scope.wfflowObj.clearData();
                //组织初始化数据
                $scope.initWfByIns($scope.data.currItem);
                //刷新当前单据
                $scope.refreshCurrBill();
            });
    }


    /**
     * 获取岗位用户
     * @param position
     */
    $scope.getPositionUser = function (proctemp) {
        var result = {"userid": "", "username": ""};
        // BasemanService.RequestPost("scpprocusertemp", "getpositionuser", JSON.stringify(proctemp))
        //     .then(function (data) {
        //         console.log('getpositionuser: ' + JSON.stringify(data));
        //         if (data.procusertemps && data.procusertemps.length > 0) {
        //             result = {"userid": data.procusertemps[0].userid, "username": data.procusertemps[0].username};
        //         }
        //         return result;
        //     })


        var data = BasemanService.RequestPostSync("scpprocusertemp", "getpositionuser", proctemp);
        if (data.procusertemps && data.procusertemps.length > 0) {
            result = {"userid": data.procusertemps[0].userid, "username": data.procusertemps[0].username};
        }
        return result;
    }


    /**
     * 初始化流程模版显示
     * @param wfTemp
     */
    $scope.initWfByTemp = function (wfTemp) {
        var procs = wfTemp.wfproctempofwftemps;
        var aNode, aProc, users, i, j;
        for (j = 0; j < procs.length; j++) {
            aProc = HczyCommon.stringPropToNum(procs[j]);
            users = aProc.procusertempofwfproctemps || [];
            //delete aProc.procusertempofwfproctemps;
            for (i = 0; i < users.length; i++) {
                if (users[i].userid == '流程启动者') {
                    users[i].userid = strUserId;
                    users[i].username = strUserId;
                }
                //岗位
                //else if (users[i].isposition > 1) {
                //    users[i].positionid = users[i].userid;
                //    users[i] = $scope.getPositionUser(users[i])
                //}
            }
            //若第一个节点没有启动者，默认为流程发起人
            if (aProc.proctempid == 1 && users.length == 0) {
                users[0] = {"userid": strUserId, "username": strUserId};
            }
            aProc.procid = aProc.proctempid;
            aProc.top = parseFloat(aProc.posy);
            aProc.left = parseFloat(aProc.posx);
            aProc.width = parseFloat(aProc.width);
            aProc.height = parseFloat(aProc.height);
            aProc.procid = aProc.proctempid;
            aProc.procname = aProc.proctempname;
            aProc.name = aProc.proctempid + ' - ' + aProc.proctempname;
            aProc.procusers = users;
            aProc.procuserofwfprocs = users;
            //节点类型：”start”,”end”,”task”,”node”,”chat”,”state”,”plug”,”fork”,”join”,”complex”
            aProc.type = "task";
            if (0 == aProc.proctempid) {
                aProc.type = "start  round";
            } else if (99999 == aProc.proctempid) {
                aProc.type = "end  round";
            }

            $scope.procnodes['proc' + aProc.proctempid] = aProc;
        }

        var lines = {};
        var procConds = wfTemp.proccondtempofwftemps;
        for (i = 0; i < procConds.length; i++) {
            aLine = procConds[i];
            $scope.proclines['line_' + aLine.fromprocid + '_' + aLine.toprocid] = {
                type: "sl",
                from: 'proc' + aLine.fromprocid,
                to: 'proc' + aLine.toprocid,
                name: aLine.lefttext,
                fromprocid: aLine.fromprocid,
                toprocid: aLine.toprocid,
                conditions: aLine.conditions,
                actived: aLine.actived,
                stat: aLine.stat,
                marked: false
            };
        }

        var wfdata = {
            title: wfTemp.wftempname,
            lines: $scope.proclines,
            nodes: $scope.procnodes,
            // initNum: $scope.getMaxProcId($scope.procnodes)
        };
        $("#myModal5").modal();
        $scope.wfflowObj.loadData(wfdata);
        $scope.wfflowObj.reinitSize();
    }

    /**
     * 初始化流程显示
     * @param wfTemp
     */
    $scope.initWfByIns = function (wf) {
        //清空流程数据
        $scope.wfflowObj.loadData({});
        var procs = wf.wfprocofwfs;
        var aNode, aProc, users, i, j;
        for (j = 0; j < procs.length; j++) {
            aProc = HczyCommon.stringPropToNum(procs[j]);
            users = aProc.procuserofwfprocs || [];
            //delete aProc.procusertempofwfproctemps;
            for (i = 0; i < users.length; i++) {
                if (users[i].userid == '流程启动者') {
                    users[i].userid = strUserId;
                    users[i].username = strUserId;
                }
            }
            //若第一个节点没有启动者，默认为流程发起人
            if (aProc.proctempid == 1 && users.length == 0) {
                users[0] = {"userid": strUserId, "username": strUserId};
            }
            aProc.top = parseFloat(aProc.posy);
            aProc.left = parseFloat(aProc.posx);
            aProc.width = parseFloat(aProc.width);
            aProc.height = parseFloat(aProc.height);
            aProc.name = aProc.procid + ' - ' + aProc.procname;
            aProc.procusers = users;
            //节点类型：”start”,”end”,”task”,”node”,”chat”,”state”,”plug”,”fork”,”join”,”complex”
            aProc.type = "task";
            if (0 == aProc.procid) {
                aProc.type = "start  round";
            } else if (99999 == aProc.procid) {
                aProc.type = "end  round";
            }

            $scope.procnodes['proc' + aProc.procid] = aProc;
        }

        var lines = {};
        var procConds = wf.proccondofwfs;
        for (i = 0; i < procConds.length; i++) {
            aLine = procConds[i];
            $scope.proclines['line_' + aLine.fromprocid + '_' + aLine.toprocid] = {
                type: "sl",
                from: 'proc' + aLine.fromprocid,
                to: 'proc' + aLine.toprocid,
                name: aLine.lefttext,
                fromprocid: aLine.fromprocid,
                toprocid: aLine.toprocid,
                marked: false
            };
        }

        var wfdata = {
            title: wf.wfname,
            lines: $scope.proclines,
            nodes: $scope.procnodes,
        };
        $("#myModal5").modal();
        $scope.wfflowObj.loadData(wfdata);
        $scope.wfflowObj.reinitSize();
        //console.log($scope.wfflowObj);

        //初始化权限
        $scope.initWfRight();

        $scope.initWfOpions();

        //刷新当前单据
        $scope.refreshCurrBill();
    }

    /**
     * 初始化流程意见
     */
    $scope.initWfOpions = function () {
        $scope.data.currItem.opinions = [];
        for (var i = $scope.data.currItem.wfprocofwfs.length - 1; i > -1; i--) {
            var proc = $scope.data.currItem.wfprocofwfs[i];
            if (proc.useropinionofwfprocs && proc.useropinionofwfprocs.length > 0) {
                for (var j = 0; j < proc.useropinionofwfprocs.length; j++) {
                    var useropinion = proc.useropinionofwfprocs[j];
                    $scope.data.currItem.opinions.push({
                        "username": useropinion.username,
                        "signtime": useropinion.signtime,
                        "opinion": useropinion.username + "  " + useropinion.signtime + "  " + useropinion.opinion

                    });
                    $scope.data.currItem.opinions.sort(function (a, b) {
                        return a.signtime < b.signtime ? 1 : -1
                    });
                    //$scope.data.currItem.opinions.push(useropinion.username + "   " + useropinion.signtime + "   " + useropinion.opinion);
                    // $scope.data.currItem.opinions += useropinion.username + "  " + useropinion.signtime + "  " + useropinion.opinion + " \n";
                }
            }
        }
        //console.log($scope.data.currItem.opinions);
    }


    /**
     *
     */
    $scope.initWfRight = function () {
        //选中当前节点
        if ($scope.data.currItem.currprocid > 0 && $scope.data.currItem.currprocid < 99999) {
            $scope.wfflowObj.focusItem("proc" + $scope.data.currItem.currprocid, true);
        }

        //当前过程节点对象
        var currObj = $scope.wfflowObj.$nodeData[$scope.wfflowObj.$focus];
        //初始化权限
    }

    /**
     * 设置按钮权限
     */
    $scope.setButtonRight = function () {
        //设置提交权限 是当前过程用户，而且流程处于执行状态，且用户没有提交过，当前节点处于执行状态
        $scope.data.currRightObj.canSubmit = $scope.isProcUser($scope.data.currProc)
            && ($scope.data.currItem.stat == 4)
            && ($scope.data.currProc.stat == 4)
            && (!$scope.isSubmited($scope.data.currProc));
        $scope.data.currRightObj.canReject = $scope.isProcUser($scope.data.currProc)
            && ($scope.data.currItem.stat == 4)
            && ($scope.data.currProc.stat == 4)
            && ($scope.data.currProc.canreject != 1) //当前节点允许驳回
            && (!$scope.isSubmited($scope.data.currProc));
        //流程管理员或者流程启动者可以中断流程
        $scope.data.currRightObj.canBreak = $scope.bWfManager() ||
            (($scope.data.currItem.currprocid <= $scope.data.currItem.breakprocid) && ($scope.data.currItem.startor == window.userbean.userid));
        //能否显示高级功能
        $scope.data.currRightObj.canModifyFunc = $scope.bWfManager() && ($scope.data.currItem.wfid > 0);
        //能否修改流程执行人
        //流程添加用户功能只有流程管理员可以操作，待完善
        //$scope.data.currRightObj.canModifyProcUser = $scope.data.currProc.stat < 5 && $scope.bWfManager($scope.data.currProc) && ($scope.data.currProc.canmodify == 1);
        //流程未启动时
        if ($scope.data.currItem.stat == 0) {
            $scope.data.currRightObj.canModifyProcUser = $scope.data.currProc.canmodify == 1;
        } else {
            $scope.data.currRightObj.canModifyProcUser = $scope.data.currProc.stat < 7 && ($scope.bWfManager() || ($scope.haveCtrlProcRight() && $scope.data.currProc.canmodify == 1));
        }
        $scope.data.currRightObj.isAdmin = window.userbean.userid == 'admin';
    }

    /**
     * 判断当前用户是否过程用户
     */
    $scope.isProcUser = function (proc) {
        var result = false;
        if (proc && proc.procuserofwfprocs && proc.procuserofwfprocs.length > 0) {
            for (var i = 0; i < proc.procuserofwfprocs.length; i++) {
                if (proc.procuserofwfprocs[i].userid == window.userbean.userid) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    /**
     * 判断当前用户是不是流程管理员
     */
    $scope.bWfManager = function () {
        var result = false;
        if (window.userbean.userid == 'admin') {
            result = true;
        } else {
            if ($scope.data.currItem.managers) {
                if (($scope.data.currItem.managers + ",").indexOf(window.userbean.userid + ",")) {
                    result = true;
                }
            }
        }
        return result;
    }

    /**
     * 判断是否有可控过程权限
     */
    $scope.haveCtrlProcRight = function () {
        var bResult = false;
        //获得当前节点
        var currWfProc = $scope.wfflowObj.$nodeData["proc" + $scope.data.currItem.currprocid];
        //如果当前过程ID在可控过程列表中则执行以下逻辑
        if (currWfProc.ctrlproc && (currWfProc.ctrlproc + ",").indexOf($scope.data.currProc.procid + ",") > -1) {
            if (currWfProc && currWfProc.procuserofwfprocs && currWfProc.procuserofwfprocs.length > 0) {
                for (var i = 0; i < currWfProc.procuserofwfprocs.length; i++) {
                    if (currWfProc.procuserofwfprocs[i].userid == window.userbean.userid) {
                        bResult = true;
                        break;
                    }
                }
            }
        }
        return bResult;
    }

    /**
     * 判断当前用户是否已提交过
     */
    $scope.isSubmited = function (proc) {
        var result = false;
        if (proc && proc.procuserofwfprocs && proc.procuserofwfprocs.length > 0) {
            for (var i = 0; i < proc.procuserofwfprocs.length; i++) {
                if (proc.procuserofwfprocs[i].userid == window.userbean.userid && proc.procuserofwfprocs[i].issigned == 2) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }


    /**
     * 保存过程节点数据
     */
    $scope.saveProcData = function () {
        var currProc = $scope.getCurrProc();
        if (currProc && currProc.wfid && currProc.wfid > 0) {
            delete currProc.prototype;
            //设置flag为1,去掉后台修改人的权限校验
            currProc.flag = 1;
            //新增流程
            BasemanService.RequestPost("scpwfproc", "update", JSON.stringify(currProc))
                .then(function (data) {
                    BasemanService.notice("保存成功！", "alert-success");//warning
                    //console.log("saveProcData response: " + data);
                    $("#procprop").modal("hide");
                    $("#procprop").closest("body").find('.modal-backdrop')[0].style.display = "none";
                    //$state.reload();
                    $scope.refreshwf(data.wfid);
                });
        } else {
            $("#procprop").modal("hide");
            $("#procprop").closest("body").find('.modal-backdrop')[0].style.display = "none";
        }
    }


    /**
     * 保存过程条件数据
     */
    $scope.saveCondData = function () {
        $("#condprop").modal("hide");
    }

    /**
     * 获取流程节点数据
     */
    $scope.getWfProcData = function () {
        var procDatas = [];
        if ($scope.wfflowObj.$nodeData) {
            for (nodeData in $scope.wfflowObj.$nodeData) {
                var objProc = $scope.wfflowObj.getItemInfo(nodeData, "node");
                delete objProc.prototype;
                delete objProc.__proto__;
                objProc.posx = objProc.left;
                objProc.posy = objProc.top;
                if (objProc.height < 50) {
                    objProc.height = 100;
                }
                procDatas.push(objProc)
            }
        }
        return procDatas;
    }

    /**
     * 获取流程模版过程条件数据
     */
    $scope.getWfCondData = function () {
        var condDatas = [];
        if ($scope.wfflowObj.$lineData) {
            for (lineData in $scope.wfflowObj.$lineData) {
                var objCond = $scope.wfflowObj.getItemInfo(lineData, "line");
                delete objCond.prototype;
                delete objCond.__proto__;
                condDatas.push(objCond)
            }
        }
        return condDatas;
    }

    /**
     * 保存流程数据
     */
    $scope.savewf = function (event) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        if ($scope.data.wftempid > 0) {
            //流程过程
            $scope.data.currItem.wfprocofwfs = $scope.getWfProcData();
            //流程过程条件
            $scope.data.currItem.proccondofwfs = $scope.getWfCondData();
            if ($scope.data.objtypeid > 0 && $scope.data.objid > 0) {
                $scope.data.currItem.wfobjofwfs = [{"objtype": $scope.data.objtypeid, "objid": $scope.data.objid}];
            }
        }
        //新增后启动流程
        $scope.data.currItem.flag = 2;
        //新增流程
        BasemanService.RequestPost("scpwf", "insert", JSON.stringify($scope.data.currItem))
            .then(function (data) {
                BasemanService.notice("流程启动成功！", "alert-success");//warning
                //新增流程
                BasemanService.RequestPost("scpwf", "select", JSON.stringify(data))
                    .then(function (data) {
                        $scope.data.currItem = data;
                        $scope.data.wfid = data.wfid;
                        //初始化流程图对象
                        $scope.wfflowObj.clearData();
                        //组织初始化数据
                        $scope.initWfByIns($scope.data.currItem);
                        //如果是需要自动提交则提交流程
                        if ($scope.data.autoSubmit == 1) {
                            //提交流程
                            var currProc = $scope.getCurrProc();
                            currProc.opinion = "同意，自动提交！";
                            BasemanService.RequestPost("scpwfproc", "submit", JSON.stringify(currProc))
                                .then(function (data) {
                                    BasemanService.notice("提交成功！", "alert-success");//warning
                                    $scope.refreshwf(data.wfid);
                                });
                        }
                        if (event) {
                            event.stopPropagation();
                        }

                    });
            });
    }

    /**
     * 删除过程用户
     */
    $scope.delProcUser = function (procid) {
        var cell = $scope.userGridView.getActiveCell();
        if ($scope.data.currProc.procuserofwfprocs.length > 0) {
            $scope.data.currProc.procuserofwfprocs.splice(cell.row, 1);
            $scope.userGridView.invalidateAllRows();
            $scope.userGridView.render();
        }
    }

    /**
     * 启动流程
     */
    $scope.startwf = function (event) {
        $scope.savewf(event);

    }

    /**
     * 获得当前选中流程节点数据
     */
    $scope.getCurrProc = function () {
        var procobj;
        //先判断是否有选中的节点
        if ($scope.wfflowObj.$focus != "" && $scope.wfflowObj.$focus != "proc0" && $scope.wfflowObj.$focus != "proc99999" &&
            $scope.wfflowObj.$focus.indexOf("proc") > -1) {
            procobj = HczyCommon.extend({}, $scope.wfflowObj.$nodeData[$scope.wfflowObj.$focus]);
            if (procobj && procobj.procuserofwfprocs && procobj.procuserofwfprocs.length > 0) {
                if (procobj.useropinionofwfprocs && procobj.useropinionofwfprocs.length == 0) {
                    delete procobj.useropinionofwfprocs;
                }
                if (procobj.wfprocnoticeofwfprocs && procobj.wfprocnoticeofwfprocs.length == 0) {
                    delete procobj.wfprocnoticeofwfprocs;
                }
                if (procobj.wfprocsignofwfprocs && procobj.wfprocsignofwfprocs.length == 0) {
                    delete procobj.wfprocsignofwfprocs;
                }
                if (procobj.wfuserrangeofwfprocs && procobj.wfuserrangeofwfprocs.length == 0) {
                    delete procobj.wfuserrangeofwfprocs;
                }
                if (procobj.prototype) {
                    delete procobj.prototype;
                }
            }
        }
        return procobj;
    }

    /**
     * 提交流程
     */
    $scope.submit = function () {
        //console.log("submit");
        var currProc = $scope.getCurrProc();
        if (!currProc) {
            BasemanService.notice("请选择流程节点！", "alert-warning");//warning
            return false;
        }
        $scope.data.currItem.opinion = "同意！";
        //提交按钮控制
        $scope.data.currItem.action = 1;

        $("#procopinion").modal();
    }

    /**
     * 确认提交流程
     */
    $scope.confirmsubmit = function () {
        //console.log("confirmsubmit: " + $scope.data.currItem.opinion);
        var currProc = $scope.getCurrProc();
        $('#procopinion').modal('hide');
        //获取流程节点后续过程列表
        var sufProcs = $scope.getSufProcList(currProc);
        //判断是不是用户为空
        if ($scope.checkIsAllEmptyUser(sufProcs)) {
            var procs = [];
            for (var i = 0; i < sufProcs.length; i++) {
                procs.push({
                    procid: sufProcs[i].procid,
                    procname: sufProcs[i].procname,
                    userid: ''
                });
            }
            $scope.ctrlProcOptions.api.setRowData(procs);
            //弹出用户选择界面
            $("#ctrlproc").modal("show");
        } else {
            //流程修改检查定义
            var config = doBillAuditDefCheck($scope.data);
            if (config) {
                BasemanService.openbillwfform(config.controller, $scope, config.templete).result.then(function (result) {
                    if (currProc) {
                        currProc.opinion = $scope.data.currItem.opinion;
                        BasemanService.RequestPost("scpwfproc", "submit", JSON.stringify(currProc))
                            .then(function (data) {
                                BasemanService.notice("提交成功！", "alert-success");//warning
                                $scope.refreshwf(data.wfid);
                            });
                    }
                });
            } else {
                currProc.opinion = $scope.data.currItem.opinion;
                BasemanService.RequestPost("scpwfproc", "submit", JSON.stringify(currProc))
                    .then(function (data) {
                        BasemanService.notice("提交成功！", "alert-success");//warning
                        $scope.refreshwf(data.wfid);
                    });
            }
        }
    }

    /**
     *获取可驳回过程列表
     * @param proc 指定过程
     * @param procList 过程列表
     */
    $scope.getRejectList = function (proc, procList) {
        if (proc.procid > 0) {
            for (line in $scope.wfflowObj.$lineData) {
                var objCond = $scope.wfflowObj.$lineData[line];
                //已经执行过的节点才能被驳回
                if (objCond.toprocid == proc.procid
                    && $scope.wfflowObj.$nodeData['proc' + objCond.fromprocid].stat == 7
                    && $scope.wfflowObj.$nodeData['proc' + objCond.fromprocid].unreject != 2//不能被驳回的去掉
                    && $scope.wfflowObj.$nodeData['proc' + objCond.fromprocid].procid != 0) {//第一步去掉
                    procList.push($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid]);
                    //递归查询
                    $scope.getRejectList($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid], procList);
                }
            }
        }
    }

    /**
     * 驳回流程
     */
    $scope.reject = function () {
        //console.log("reject");
        $scope.data.rejectProcs = [];
        var currProc = $scope.getCurrProc();
        if (currProc) {
            //如果有可驳回过程设置则设置可驳回过程
            currProc.rejectprocid += "";
            if (currProc.rejectprocid && currProc.rejectprocid.length > 0) {
                var procids = currProc.rejectprocid.split(",");
                for (var i = 0; i < procids.length; i++) {
                    $scope.data.rejectProcs.push($scope.wfflowObj.$nodeData['proc' + procids[i]]);
                }
            } else {
                //获取当前过程的可驳回列表
                $scope.getRejectList($scope.data.currProc, $scope.data.rejectProcs);
            }
            //删除不能被驳回的节点
            if ($scope.data.rejectProcs.length == 0) {
                BasemanService.notice("没有可驳回的节点！", "alert-warning");//warning
                return false;
            }

        } else {
            BasemanService.notice("请选择流程节点！", "alert-warning");//warning
        }
        //驳回
        $scope.data.currItem.action = 2;
        $scope.rejectProcOptions.api.setRowData($scope.data.rejectProcs);

        $("#procopinion").modal();
    }

    /**
     * 驳回确认
     */
    $scope.confirmreject = function () {
        //console.log("confirmreject: " + $scope.data.currItem.opinion);
        var currProc = $scope.getCurrProc();
        if (currProc) {
            currProc.opinion = $scope.data.currItem.opinion;
            var selectNodes = $scope.rejectProcOptions.api.getSelectedNodes();
            var strIds = "";
            if (selectNodes && selectNodes.length > 0) {
                for (var i = 0; i < selectNodes.length; i++) {
                    if (strIds.length > 0) {
                        strIds += "," + selectNodes[i].data.procid;
                    } else {
                        strIds = selectNodes[i].data.procid+"";
                    }
                }
            }

            if (strIds == "") {
                BasemanService.notice("请选择驳回过程!", "alert-info");
            } else {
                $('#procopinion').modal('hide');
                currProc.rejectto = strIds;
                BasemanService.RequestPost("scpwfproc", "reject", JSON.stringify(currProc))
                    .then(function (data) {
                        BasemanService.notice("驳回成功！", "alert-success");//warning
                        $scope.refreshwf(data.wfid);
                    });
            }
        }
    }

    /**
     * 中断流程
     */
    $scope.break = function () {
        //console.log("break");
        BasemanService.swalDelete("中断", "确定要中断流程吗？", function (bool) {
            if (bool) {
                BasemanService.RequestPost("scpwf", "break", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        BasemanService.swalSuccess("成功", "中断成功！");
                        $scope.refreshCurrBill();
                    });
            } else {
                return;
            }
        }, true)
    }


    /**
     * 得到过程的前置过程列表
     * @param proc
     */
    $scope.getPrevProcList = function (proc) {
        var preProcs = [];
        if (proc.procid > 0) {
            for (line in $scope.wfflowObj.$lineData) {
                var objCond = $scope.wfflowObj.$lineData[line];
                if (objCond.toprocid == proc.procid) {
                    preProcs.push($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid]);
                    // if (procids == "") {
                    //     procids += objCond.fromprocid
                    // } else {
                    //     procids += "," + objCond.fromprocid;
                    // }
                }
            }
        }
        return preProcs;
    }

    /**
     * 得到过程的后续过程列表
     * @param proc
     */
    $scope.getSufProcList = function (proc) {
        var sufProcs = [];
        if (proc.procid > 0) {
            for (line in $scope.wfflowObj.$lineData) {
                var objCond = $scope.wfflowObj.$lineData[line];
                if (objCond.fromprocid == proc.procid) {
                    sufProcs.push($scope.wfflowObj.$nodeData['proc' + objCond.toprocid]);
                }
            }
        }
        return sufProcs;
    }

    /**
     * 通用查询
     */
    $scope.addProcUser = function (procid) {
        $scope.FrmInfo = {
            title: "用户查询",
            thead: [{
                name: "人员编码",
                code: "employee_code"
            }, {
                name: "姓名",
                code: "employee_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            }, {
                name: "部门名称",
                code: "dept_name"
            }],
            classid: "base_view_erpemployee_org",
            //type:"checkbox",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "base_view_erpemployee_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {"flag": 1},
            searchlist: ["employee_code", "employee_name", "dept_code", "dept_name"],
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var userData = {
                "agent": "",
                "emptyset": 1,
                "ismajor": 1,
                "isposition": 1,
                "note": "",
                "rate": 1,
                "stat": 0,
                "userid": result.employee_code,
                "username": result.employee_name
            }
            if (!$scope.data.currProc.procuserofwfprocs) {
                $scope.data.currProc.procuserofwfprocs = [];
            }
            $scope.data.currProc.procuserofwfprocs.push(userData);
            $scope.userGridView.setData([]);
            //设置数据
            $scope.userGridView.setData($scope.data.currProc.procuserofwfprocs);
            $scope.userGridView.invalidateAllRows();
            $scope.userGridView.render();
        })
    };

    /**
     *添加企业岗位
     */
    $scope.addSysPosition = function (procid) {
        $scope.FrmInfo = {
            title: "企业岗位查询",
            thead: [{
                name: "岗位名称",
                code: "positionname"
            }, {
                name: "岗位描述",
                code: "positiondesc"
            }],
            classid: "scpsysconf",
            action: "getallposition",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "scpgrouppositions",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["positionname", "positiondesc"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var userData = {
                "agent": "",
                "emptyset": 1,
                "ismajor": 1,
                "isposition": 2,
                "note": "",
                "rate": 1,
                "stat": 0,
                "userid": result.positionid,
                "username": result.positionid
            }
            $scope.data.currProc.procuserofwfprocs.push(userData);
            $scope.userGridView.invalidateAllRows();
            $scope.userGridView.render();
        })
    }

    /**
     *添加机构岗位
     */
    $scope.addOrgPosition = function (procid) {
        $scope.FrmInfo = {
            title: "岗位查询",
            thead: [{
                name: "岗位名称",
                code: "positionid"
            }, {
                name: "直接上级岗位",
                code: "superposition"
            }, {
                name: "职责概述",
                code: "positiondesc"
            }],
            classid: "scpposition",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "positions",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["positionid", "superposition", "positiondesc"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var userData = {
                "agent": "",
                "emptyset": 1,
                "ismajor": 1,
                "isposition": 3,
                "note": "",
                "rate": 1,
                "stat": 0,
                "syspositionid": result.syspositionid,
                "userid": result.positionid,
                "username": result.positionid
            }
            $scope.data.currProc.procuserofwfprocs.push(userData);
            $scope.userGridView.invalidateAllRows();
            $scope.userGridView.render();
        })
    }
    /**
     * 下载文件
     * @param file
     */
    $scope.downloadAttFile = function (file) {
        window.open("/downloadfile.do?docid=" + file.docid);
    }

    /**
     * 刷新当前单据
     */
    $scope.refreshCurrBill = function () {
        /**
         * 如果当前窗体有父窗体，且父窗体有对应scope对象和方法，则调用对应刷新方法
         */
        if (window.parent && window.parent != window && window.parent.currScope && window.parent.currScope.selectCurrenItem) {
            window.parent.currScope.selectCurrenItem();
            $scope.objattachs = window.parent.currScope.data.currItem.objattachs;

        }
    }

    /**
     * 转办
     */
    $scope.transfer = function () {
        $("#transferModal").modal("show");
    }

    /**
     * 转办
     */
    $scope.confirmTransfer = function () {
        if (!$scope.data.transferobj.shift_code || $scope.data.transferobj.shift_code == '') {
            BasemanService.notice("请选择转办用户！", "alert-warning");//warning
            return true;
        }

        if (!$scope.data.transferobj.shift_note || $scope.data.transferobj.shift_note == '') {
            BasemanService.notice("请填写转办意见！", "alert-warning");//warning
            return true;
        }
        var currProc = $scope.getCurrProc();
        currProc.tranuserid = $scope.data.transferobj.shift_code;
        currProc.tranopinion = $scope.data.transferobj.shift_note;
        BasemanService.RequestPost("scpwfproc", "transferto", JSON.stringify(currProc))
            .then(function (data) {
                $("#transferModal").modal("hide");
                BasemanService.swal("转办成功！");
                //刷新流程实例
                $scope.refreshwf($scope.data.wfid);
            });
    }

    /**
     * 转办用户查询
     */
    $scope.shiftMan = function () {
        $scope.FrmInfo = {
            title: "人员查询",
            thead: [{
                name: "人员编码",
                code: "employee_code"
            }, {
                name: "姓名",
                code: "employee_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            }, {
                name: "部门名称",
                code: "dept_name"
            }],
            classid: "base_view_erpemployee_org",
            url: "/jsp/baseman.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "base_view_erpemployee_orgs",
            ignorecase: "true", //忽略大小写
            searchlist: ["employee_code", "employee_name", "dept_code", "dept_name"],
            postdata: {"flag": 1}
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.transferobj.shift_id = result.employee_id;
            $scope.data.transferobj.shift_code = result.employee_code;
            $scope.data.transferobj.shift_name = result.employee_name;
        })
    };

    /**
     * 用户范围添加
     */
    $scope.addProcUserScope = function (procid) {
        $scope.FrmInfo = {
            title: "用户查询",
            thead: [{
                name: "人员编码",
                code: "employee_code"
            }, {
                name: "姓名",
                code: "employee_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            }, {
                name: "部门名称",
                code: "dept_name"
            }],
            classid: "base_view_erpemployee_org",
            //type:"checkbox",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "base_view_erpemployee_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {"flag": 1},
            searchlist: ["employee_code", "employee_name", "dept_code", "dept_name"],
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var userData = {
                "agent": "",
                "emptyset": 1,
                "ismajor": 1,
                "isposition": 1,
                "note": "",
                "rate": 1,
                "stat": 0,
                "userid": result.employee_code,
                "username": result.employee_name
            }
            var rangeData = $scope.userRangeGridView.getData();
            rangeData.push(userData);
            $scope.userRangeGridView.setData([]);
            //设置数据
            $scope.userRangeGridView.setData(rangeData);
            $scope.userRangeGridView.invalidateAllRows();
            $scope.userRangeGridView.render();
        })
    };

    /**
     * 用户范围删除
     */
    $scope.delProcUserScope = function (procid) {
        var cell = $scope.userRangeGridView.getActiveCell();
        var rangeData = $scope.userRangeGridView.getData();
        if (rangeData.length > 0) {
            rangeData.splice(cell.row, 1);
            $scope.userRangeGridView.setData(rangeData);
            $scope.userRangeGridView.invalidateAllRows();
            $scope.userRangeGridView.render();
        }
    }

    /**
     * 用户范围双击
     */
    function userRangeDblClick(e, args) {
        for (var i = 0; i < $scope.data.currProc.procuserofwfprocs.length; i++) {
            if ($scope.data.currProc.procuserofwfprocs[i].userid == args.grid.getDataItem(args.row).userid) {
                BasemanService.swal("请勿重复添加用户");
                return;
            }
        }
        $scope.data.currProc.procuserofwfprocs.push(args.grid.getDataItem(args.row));
        $scope.userGridView.setData([]);
        //设置数据
        $scope.userGridView.setData($scope.data.currProc.procuserofwfprocs);
        $scope.userGridView.invalidateAllRows();
        $scope.userGridView.render();
    }

    /**
     * 检查过程用户是否都为空,必须要执行的节点才检查
     * @param procs
     */
    $scope.checkIsAllEmptyUser = function (procs) {
        var result = false;
        for (var i = 0; i < procs.length; i++) {
            //必須执行时才判断执行人是否为空
            if ((procs[i].procuserofwfprocs == null || procs[i].procuserofwfprocs.length == 0) && procs[i].isskip == 1
                && procs[i].procid != 99999) {
                result = true;
                break;
            }
        }
        return result;
    }

    /**
     * 可控过程用户选择
     */
    $scope.saveCtrlProcUser = function () {
        var strUserid = "";
        $scope.ctrlProcOptions.api.stopEditing(false);
        //获取设置用户
        $scope.ctrlProcOptions.api.getModel().forEachNode(function (node) {
            if (strUserid == "") {
                strUserid = node.data.userid;
            } else {
                strUserid += "," + node.data.userid;
            }
        });

        if (strUserid == "") {
            //提示用户选择过程用户
            BasemanService.notice("请选择后续过程用户!", "alert-info");
        } else {
            var currProc = $scope.getCurrProc();
            currProc.sufprocuser = strUserid;
            //流程修改检查定义
            var config = doBillAuditDefCheck($scope.data);
            if (config) {
                BasemanService.openbillwfform(config.controller, $scope, config.templete).result.then(function (result) {
                    if (currProc) {
                        currProc.opinion = $scope.data.currItem.opinion;
                        BasemanService.RequestPost("scpwfproc", "submit", JSON.stringify(currProc))
                            .then(function (data) {
                                BasemanService.notice("提交成功！", "alert-success");//warning
                                $scope.refreshwf(data.wfid);
                            });
                    }
                });
            } else {
                currProc.opinion = $scope.data.currItem.opinion;
                BasemanService.RequestPost("scpwfproc", "submit", JSON.stringify(currProc))
                    .then(function (data) {
                        BasemanService.notice("提交成功！", "alert-success");//warning
                        $scope.refreshwf(data.wfid);
                    });
            }
        }
        $("#ctrlproc").modal("hide");
    }

//初始化当前流程实例对象
//BasemanService.setCurrWfCtrl($scope);
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_base_wfexec', ctrl_base_wfexec)