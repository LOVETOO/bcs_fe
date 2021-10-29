var basemanControllers = angular.module('inspinia');
function fin_lc_allot_m_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_lc_allot_m_headerEdit = HczyCommon.extend(fin_lc_allot_m_headerEdit, ctrl_bill_public);
    fin_lc_allot_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_lc_allot_m_header",
        key: "lc_allot_m_id",
        wftempid: 10040,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'fin_lc_allot_m_lineoffin_lc_allot_m_headers'},
            {optionname: 'options_12', idname: 'fin_lc_allot_m_prod_lineoffin_lc_allot_m_headers'}
        ]
    };
    /******************网格定义区域****************************/
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: {
            checkbox: true
        }
    };
    //金额分配明细
    $scope.columns_11 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "单号", field: "lc_allot_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "调整金额", field: "modify_amt", editable: true, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "信用证付款总额", field: "pi_lc_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已分配信用证金额", field: "amt_finished", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "本次分配金额", field: "amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "发货金额", field: "send_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已核销金额", field: "reduce_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_11 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    //生产单分配明细
    $scope.columns_12 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "生产单号", field: "prod_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产单应分配金额", field: "amt", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已分配金额", field: "alloed_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "分配金额", field: "prod_amt", editable: false, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "调整金额", field: "modify_prod_amt", editable: true, filter: 'set', width: 200,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    $scope.options_12 = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };

    /******************词汇值****************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
        .then(function (data) {
            $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //LC受益人--回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    /******************弹出框区域****************************/
    //单号
    $scope.openLcNoSearchFrm = function () {
        $scope.FrmInfo = {
            classid: "fin_lc_allot_header",
            sqlBlock: "stat = 5",
            postdata: {
                flag: 0
            }
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
            result.creator = $scope.data.currItem.creator;
            result.creat_time = $scope.data.currItem.creat_time;
            delete  result.note;
            delete  result.wfid;
            delete  result.wfflag;
            delete  result.wfid;
            delete  result.stat ;
            HczyCommon.stringPropToNum(result)
            for (var name in result) {
                if (!( result[name] in Array))
                    $scope.data.currItem[name] = result[name];
            }
            $scope.data.currItem.stat = 1;
            if (result.lc_allot_id == "") {
                return;
            }
            if (result.lc_allot_no == "") {
                return;
            }
            BasemanService.RequestPost("fin_lc_allot_header", "select", {lc_allot_id: result.lc_allot_id})
                .then(function (data) {
                    if (data.fin_lc_allot_lineoffin_lc_allot_headers.length > 0) {
                        var lcs = $scope.gridGetData("options_11");
                        var isExists = false;
                        for (var i = 0; i < data.fin_lc_allot_lineoffin_lc_allot_headers.length; i++) {
                            var isExists = HczyCommon.isExist(lcs, data.fin_lc_allot_lineoffin_lc_allot_headers[i], ["lc_allot_id", "pi_id"], ["lc_allot_id", "pi_id"]).exist;
                            if (isExists) {
                                continue;
                            }
                            data.fin_lc_allot_lineoffin_lc_allot_headers[i].modify_amt = 0;
                            $scope.gridAddItem('options_11', data.fin_lc_allot_lineoffin_lc_allot_headers[i]);
                        }
                    }
                    if (data.fin_lc_allot_prod_lineoffin_lc_allot_headers.length > 0) {
                        var lcs = $scope.gridGetData("options_12");
                        var isExists = false;
                        for (var i = 0; i < data.fin_lc_allot_prod_lineoffin_lc_allot_headers.length; i++) {
                            var isExists = HczyCommon.isExist(lcs, data.fin_lc_allot_prod_lineoffin_lc_allot_headers[i], ["lc_allot_id", "pi_id"], ["lc_allot_id", "pi_id"]).exist;
                            if (isExists) {
                                continue;
                            }
                            data.fin_lc_allot_prod_lineoffin_lc_allot_headers[i].modify_prod_amt = 0;
                            $scope.gridAddItem('options_12', data.fin_lc_allot_prod_lineoffin_lc_allot_headers[i]);
                        }
                    }
                });
        })
    };
    /******************保存校验区域****************************/
    $scope.validate = function () {
        var name = $rootScope.$state.$current.self.name;
        var modify_amt = 0;
        var send_amt = 0;
        var amt = 0;
        var GridData = $scope.gridGetData("options_11");
        for (var i = 0; i < GridData.length; i++) {
            if (parseFloat(GridData[i].modify_amt || 0) > 0) {
                BasemanService.notice("金额分配明细,'调整金额'必须为负数", "alert-warning");
                return false;
            }
            modify_amt = parseFloat(GridData[i].modify_amt || 0);
            amt = parseFloat(GridData[i].amt || 0);
            send_amt = parseFloat(GridData[i].send_amt || 0);

            if ((Math.abs(modify_amt)).toFixed(4) > ((amt-send_amt).toFixed(4))) {
                BasemanService.notice('第' + (i + 1) + '行分配调整金额(%f)的绝对值大于本次分配金额(%f)减发货金额(%f)', "alert-warning");
                return false;
            }

            var piid = GridData[i].pi_id || 0;
            amt = parseFloat(GridData[i].amt || 0) + parseFloat(GridData[i].modify_amt || 0).toFixed(4);
            var amt_finished = 0;
            var ProdData = $scope.gridGetData("options_12");
            for (var j = 0; j < ProdData.length; j++) {
                if (ProdData[j].pi_id == piid) {
                    amt_finished = amt_finished + parseFloat(ProdData[j].prod_amt || 0) + parseFloat(ProdData[j].modify_prod_amt || 0);
                }
                if (amt - amt_finished < -0.0000001) {
                    BasemanService.notice('第' + (i + 1) + '行PI对应的生产单分配金额不能大于本次分配金额!', "alert-warning");
                    return false;
                }
            }
        };
        var ProdData = $scope.gridGetData("options_12");
        for (var i = 0; i < ProdData.length; i++) {
            modify_amt = parseFloat(ProdData[i].modify_prod_amt || 0);
            amt = parseFloat(ProdData[i].prod_amt || 0);
            if ((Math.abs(modify_amt)).toFixed(4) > (Math.abs(amt)).toFixed(4)) {
                BasemanService.notice('第' + (i + 1) + '行生产单分配明细分配调整金额(%f)的绝对值大于本次分配金额(%f)！', "alert-warning");
                return false;
            }
        }
        return true;
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data.currItem.creator = window.strUserId;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.lc_date = moment().format('YYYY-MM-DD HH:mm:ss');
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.fin_lc_allot_m_lineoffin_lc_allot_m_headers=[];
        $scope.data.currItem.fin_lc_allot_m_prod_lineoffin_lc_allot_m_headers=[];
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_code = window.userbean.org_code;
        $scope.data.currItem.org_name = window.userbean.org_name;
        $scope.data.currItem.idpath = window.userbean.idpath;
        $scope.data.currItem.sales_user_id = window.userbean.userid;
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_lc_allot_m_headerEdit', fin_lc_allot_m_headerEdit);
