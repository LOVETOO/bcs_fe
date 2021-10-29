/**
 * 流程控制器
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
function ctrl_base_wf($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService,
                      FormValidatorService, $stateParams, AgGridService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.wftempid = $stateParams.wftempid;
    $scope.data.fdrid = $stateParams.fdrid;
    //当前过程
    $scope.data.currProc = {};
    //连接线
    $scope.data.currLine = {};
    //泳道
    $scope.data.currArea = {};
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

    //允许中断过程
    $scope.breakprocids = [
        {id: -1, name: "禁止中断"},
        {id: 99999, name: "允许中断"}]

    $scope.headername = "流程定义";
    $scope.flowChartProperty = {
        toolBtns: ["task",],
        haveHead: false,
        width: 890,
        height: 358,
        headLabel: true,
        headBtns: ["new", "open", "save", "undo", "redo", "reload", "print"],//如果haveHead=true，则定义HEAD区的按钮
        haveTool: true,
        haveDashed: false,
        haveGroup: false,
        useOperStack: true
    };


    //取代setNodeRemarks方法，采用更灵活的注释配置
    GooFlow.prototype.remarks.toolBtns = {
        cursor: "选择指针",
        direct: "结点连线",
        dashed: "关联虚线",
        // start: "入口结点",
        // "end": "结束结点",
        "task": "任务结点",
        node: "自动结点",
        chat: "决策结点",
        state: "状态结点",
        plug: "附加插件",
        fork: "分支结点",
        "join": "联合结点",
        "complex": "复合结点",
        group: "组织划分框编辑开关"
    };
    GooFlow.prototype.remarks.headBtns = {
        new: "新建流程",
        open: "打开流程",
        save: "保存结果",
        undo: "撤销",
        redo: "重做",
        reload: "刷新流程",
        print: "打印流程图"
    };


    //流程对象初始化
    window.wfFlowObj = $scope.wfflowObj = $.createGooFlow($('#wfFlowChart'), $scope.flowChartProperty);

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


    //可控过程网格
    $scope.ctrlProcColums = [
        {
            id: "proctempid",
            name: "过程号",
            headerName: "过程号",
            field: "proctempid",
            width: 80,
            checkboxSelection: true,
            headerCheckboxSelection: true
        },
        {
            id: "proctempname",
            name: "过程名称",
            headerName: "过程名称",
            field: "proctempname",
            width: 150
        }
    ]

    //可控过程流程网格配置项目
    $scope.ctrlProcOptions = {
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
        // groupColumnDef: groupColumn,
        //columnDefs: $scope.ctrlProcColums,
        showToolPanel: false,
        toolPanelSuppressSideButtons: true,
        rowHeight: 30,
        rowSelection: 'multiple'
    };

    //初始化可控过程网格
    //AgGridService.createAgGrid('ctrlProcGrid', $scope.ctrlProcOptions);

    //执行人网格初始化
    $scope.userGridView = new Slick.Grid("#usergrid", [], $scope.userColumns, $scope.gridOptions);
    //用户范围网格初始化
    $scope.userRangeGridView = new Slick.Grid("#userrangegrid", [], $scope.userColumns, $scope.gridOptions);
    //通知网格初始化
    $scope.noticeSetGridView = new Slick.Grid("#noticesetgrid", [], $scope.noticeColumns, $scope.gridOptions);


    /**
     * 流程节点单元格双击事件
     * @param id
     * @param type
     * @returns {boolean}
     */
    $scope.wfflowObj.onItemDbClick = function (id, type) {
        console.log("onItemRightClick: " + id + "," + type);
        if ("node" == type) {
            $scope.data.currProc = window.wfFlowObj.$nodeData[id];
            $scope.data.currProc.id = id;
            if ($scope.data.currProc.procid == 0 || $scope.data.currProc.procid == 99999) {
                return false;
            }
            $scope.userGridView.setData([]);
            //设置数据
            $scope.userGridView.setData($scope.data.currProc.procusertempofwfproctemps);
            //重绘网格
            $scope.userGridView.render();
            $("#procprop").modal();
            $scope.$apply();
        } else if ("line" == type) {
            $scope.data.currLine = window.wfFlowObj.$lineData[id];
            //初始化当前节点的来源过程和目标过程名称
            $scope.getcurrLineProcName();
            $("#condprop").modal();
        } else if ("area" == type) {

        }

        return false;//返回false可以阻止浏览器默认的右键菜单事件
    }

    /**
     *添加节点后触发的事件
     * @param id id是单元的唯一标识ID,
     * @param type type是单元的种类,有"node","line","area"三种取值
     * @param json json即addNode,addLine或addArea方法的第二个传参json
     */
    $scope.wfflowObj.onItemAdd = function (id, type, json) {
        //没有过程名称说明是新添加的过程
        if (!json.procname && type == "node") {
            json = $scope.initNewProc(json);
        } else if (!json.procname && type == "line") {
            json = $scope.initNewLine(json);
        }
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
            "minperson": 0,
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
        if (window.wfFlowObj.$nodeCount > 0) {
            for (var proc in window.wfFlowObj.$nodeData) {
                if (window.wfFlowObj.$nodeData[proc].procid == 0 || window.wfFlowObj.$nodeData[proc].procid == 99999) {
                    continue
                } else {
                    iprocId = window.wfFlowObj.$nodeData[proc].procid;
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
            "minperson": 0,
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
        if ($scope.data.wftempid) {
            var postData = {wftempid: $scope.data.wftempid};
            BasemanService.RequestPost("scpwftemp", "select", JSON.stringify(postData))
                .then(function (data) {
                    $scope.data.currItem = data;
                    //初始化流程图对象
                    $scope.wfflowObj.clearData();
                    //组织初始化数据
                    $scope.initWf($scope.data.currItem);
                    //  初始化可驳回过程
                    $scope.initBreakProcIds();
                });
        } else if (!$scope.data.wftempid) {
            $scope.initStartAndEndProc();
            //初始化父目录信息
            $scope.initFdrInfo();
        } else {
            $("#myModal5").modal();
            $scope.wfflowObj.loadData({});
        }
    };

    /**
     * 查询流程所在文件夹的信息
     */
    $scope.initFdrInfo = function () {
        if ($scope.data.fdrid > 0) {
            BasemanService.RequestPost("scpfdr", "select", JSON.stringify({"fdrid": $scope.data.fdrid}))
                .then(function (data) {
                    $scope.data.parentobj = data;
                });
        }
    }


    /**
     * 初始化流程模版显示
     * @param wfTemp
     */
    $scope.initWf = function (wfTemp) {
        var procs = wfTemp.wfproctempofwftemps;

        var aNode, aProc, users, i, j;
        for (j = 0; j < procs.length; j++) {
            aProc = HczyCommon.stringPropToNum(procs[j]);
            //users = aProc.procusertempofwfproctemps || [];
            //delete aProc.procusertempofwfproctemps;
            // for (i = 0; i < users.length; i++) {
            //     if (users[i].userid == '流程启动者') {
            //         users[i].userid = strUserId;
            //         users[i].username = strUserId;
            //     }
            // }
            // //若第一个节点没有启动者，默认为流程发起人
            // if (aProc.proctempid == 1 && users.length == 0) {
            //     users[0] = {"userid": strUserId, "username": strUserId};
            // }
            aProc.procid = aProc.proctempid;
            aProc.top = parseFloat(aProc.posy);
            aProc.left = parseFloat(aProc.posx);
            aProc.width = parseFloat(aProc.width);
            aProc.height = parseFloat(aProc.height);
            aProc.procid = aProc.proctempid;
            aProc.procname = aProc.proctempname;
            aProc.name = aProc.proctempid + ' - ' + aProc.proctempname;
            //aProc.procuser = users;
            //节点类型：”start”,”end”,”task”,”node”,”chat”,”state”,”plug”,”fork”,”join”,”complex”
            aProc.type = "task";
            if (0 == aProc.proctempid) {
                aProc.type = "start  round";
            } else if (99999 == aProc.proctempid) {
                aProc.type = "end  round";
            }


            $scope.procnodes['proc' + aProc.proctempid] = aProc;
        }

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
                lefttext: aLine.lefttext,
                righttext: aLine.righttext,
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


        // g_wf.parseData(wfTemp);
        // g_wf.proccondofwfs = procConds;
        // var wfObjs = wfTemp.wfobjtempofwftemps;
        // if (wfTemp.note != "DoNotAddWFObj") {
        //     var obj = new CPCWfObj();
        //     obj.objtype = g_wfobjtype;
        //     obj.objid = g_wfobjid;
        //     wfObjs.push(obj);
        // }
        // g_wf.wfobjofwfs = wfObjs;
        // g_wf.flag = 2;
        // g_wf.wfname = g_wf.wftempname;
    }

    /**
     * 保存过程节点数据
     */
    $scope.saveProcData = function () {
        $("#procprop").modal("hide");
    }

    /**
     * 保存过程条件数据
     */
    $scope.saveCondData = function () {
        $("#condprop").modal("hide");
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
     * 获取流程模版节点数据
     */
    $scope.getWfTempProcData = function () {
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
    $scope.getWfTempCondData = function () {
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
     * 保存流程模版数据
     */
    $scope.saveWfTemp = function () {
        var wftempobj = {};
        if (!$scope.data.wftempid) {
            $scope.data.currItem.parentid = $scope.data.parentobj.idpath;
            $scope.data.currItem.parenttype = $scope.data.parentobj.typepath;
            //$scope.data.currItem.actived = 2;
            $scope.data.currItem.submitctrl = 2;
            $scope.data.currItem.period = 0;
            //$scope.data.currItem.breakprocid = 99999;
            $scope.data.currItem.keephistory = 1;
            $scope.data.currItem.canselect = 2;
            //$scope.data.currItem.wftempname = '测试流程模版' + (new Date());
            $scope.data.currItem.sysbuiltinobj = 1;
            $scope.data.currItem.canmodifytime = 1;
            $scope.data.currItem.autosubmitmode = 1;
            $scope.data.currItem.autosubmitfirst = 1;
        }

        //流程过程
        $scope.data.currItem.wfproctempofwftemps = $scope.getWfTempProcData();
        //流程过程条件
        $scope.data.currItem.proccondtempofwftemps = $scope.getWfTempCondData();
        var action = "insert";
        if ($scope.data.wftempid) {
            action = "update";
        }
        //新增流程
        BasemanService.RequestPost("scpwftemp", action, JSON.stringify($scope.data.currItem))
            .then(function (data) {
                BasemanService.notice("保存成功！", "alert-success");//warning
                $scope.data.currItem = data;
                //初始化流程图对象
                $scope.wfflowObj.clearData();
                //组织初始化数据
                $scope.initWf($scope.data.currItem);
            });
    }

    /**
     * 删除过程用户
     */
    $scope.delProcUser = function (procid) {
        console.log("delProcUser");
        var cell = $scope.userGridView.getActiveCell();
        if (cell != null) {
            if ($scope.data.currProc.procusertempofwfproctemps.length > 0) {
                $scope.data.currProc.procusertempofwfproctemps.splice(cell.row, 1);
                $scope.userGridView.invalidateAllRows();
                $scope.userGridView.render();
            }
        }

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
            direct: "center",
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
            $scope.userGridView.setData([]);
            $scope.data.currProc.procusertempofwfproctemps.push(userData);
            //设置数据
            $scope.userGridView.setData($scope.data.currProc.procusertempofwfproctemps);
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
            direct: "center",
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
            $scope.data.currProc.procusertempofwfproctemps.push(userData);
            $scope.userGridView.setData($scope.data.currProc.procusertempofwfproctemps);
            $scope.userGridView.invalidateAllRows();
            $scope.userGridView.render();
        })
    }

    //勾选事件
    $scope.checkIsdefault = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currLine.isdefault = 2;
        } else {
            $scope.data.currLine.isdefault = 1;
        }
    };


    //勾选事件
    $scope.checkAllperson = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currProc.allperson = 2;
        } else {
            $scope.data.currProc.allperson = 1;
        }
    };

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
                name: "机构名称",
                code: "orgname"
            }, {
                name: "直接上级岗位",
                code: "superposition"
            }, {
                name: "职责概述",
                code: "positiondesc"
            }],
            classid: "scpposition",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "positions",
            ignorecase: "true", //忽略大小写
            postdata: {},
            searchlist: ["positionid", "superposition", "positiondesc", "orgname"]
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
            $scope.data.currProc.procusertempofwfproctemps.push(userData);
            $scope.userGridView.setData($scope.data.currProc.procusertempofwfproctemps);
            // $scope.userGridView.invalidateAllRows();
            $scope.userGridView.render();
        })
    }

    /**
     * 可控过程选择
     */
    $scope.selectCtrlProc = function () {
        var procs = [];
        for (var i = 0; i < $scope.data.currItem.wfproctempofwftemps.length; i++) {
            if ($scope.data.currItem.wfproctempofwftemps[i].proctempid == 0 || $scope.data.currItem.wfproctempofwftemps[i].proctempid == 99999
                || $scope.data.currItem.wfproctempofwftemps[i].proctempid == $scope.data.currProc.proctempid) {
                continue;
            }
            procs.push($scope.data.currItem.wfproctempofwftemps[i]);
        }

        $scope.ctrlProcOptions.api.setRowData(procs);
        $("#ctrlproc").modal("show");

        //如果有可控过程要设置选择
        if ($scope.data.currProc.ctrlproc) {
            //设置选中
            $scope.ctrlProcOptions.api.getModel().forEachNode(function (node) {
                //如果可控过程流程节点匹配上对应过程节点则设置选中
                if (($scope.data.currProc.ctrlproc + ",").indexOf(node.data.proctempid + ",") > -1) {
                    node.setSelected(true);
                }
            });
        }
    }

    /**
     *
     */
    $scope.selectRejectProc = function(){
        var procs = [];
        //获取当前过程的前置过程列表
        $scope.getPrevProcList($scope.data.currProc,procs);
        //删除不能被驳回的节点
        if(procs.length > 0){
            for (var i = procs.length - 1; i > -1; i--) {
                //过滤掉开始/结束/当前/不能被驳回节点
                if (procs[i].unreject == 2 || procs[i].proctempid == 0) {
                    procs.splice(i,1);
                }
            }
        }else{
            BasemanService.notice("没有可驳回的节点！", "alert-warning");//warning
            return false;
        }

        $scope.ctrlProcOptions.api.setRowData(procs);
        $("#rejectproc").modal("show");

        //如果有可控过程要设置选择
        if ($scope.data.currProc.rejectprocid) {
            //设置选中
            $scope.ctrlProcOptions.api.getModel().forEachNode(function (node) {
                //如果可驳回过程流程节点匹配上对应过程节点则设置选中
                if (($scope.data.currProc.rejectprocid + ",").indexOf(node.data.proctempid + ",") > -1) {
                    node.setSelected(true);
                }
            });
        }
    }

    /**
     * 确定可控过程选择
     */
    $scope.saveCtrlProc = function () {
        var selectNodes = $scope.ctrlProcOptions.api.getSelectedNodes();
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
        $scope.data.currProc.ctrlproc = strIds;
        $scope.data.currProc.ctrlprocname = strNames;
        $("#ctrlproc").modal("hide");
    }

    /**
     * 确定可驳回过程选择
     */
    $scope.saveRejectProc = function () {
        var selectNodes = $scope.ctrlProcOptions.api.getSelectedNodes();
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
        $scope.data.currProc.rejectprocid = strIds;
        $scope.data.currProc.rejectprocname = strNames;
        $("#rejectproc").modal("hide");
    }

    /**
     *得到过程的前置过程列表
     * @param proc 指定过程
     * @param procList 过程列表
     */
    $scope.getPrevProcList = function (proc,procList) {
        if (proc.procid > 0) {
            for (line in $scope.wfflowObj.$lineData) {
                var objCond = $scope.wfflowObj.$lineData[line];
                if (objCond.toprocid == proc.procid) {
                    procList.push($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid]);
                    //递归查询
                    $scope.getPrevProcList($scope.wfflowObj.$nodeData['proc' + objCond.fromprocid],procList);
                }
            }
        }
    }

    /**
     * 关闭父窗口
     */
    $scope.closeForm = function () {
        if (window.parent != window && window.parent.closeModal) {
            window.parent.closeModal();
        }
    }

    //初始化可驳回过程
    $scope.initBreakProcIds = function () {
        if ($scope.data.currItem.wfproctempofwftemps && $scope.data.currItem.wfproctempofwftemps.length > 0) {
            for (var i = 0; i < $scope.data.currItem.wfproctempofwftemps.length; i++) {
                var proc = $scope.data.currItem.wfproctempofwftemps[i];
                if(proc.proctempid != 0 && proc.proctempid != 99999){
                    $scope.breakprocids.push({id:proc.proctempid,name:proc.proctempname});
                }
            }
        }
    }
}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_base_wf', ctrl_base_wf)