var billmanControllers = angular.module('inspinia');
function fin_funds_m_invoice_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    fin_funds_m_invoice_headerEdit = HczyCommon.extend(fin_funds_m_invoice_headerEdit, ctrl_bill_public);
    fin_funds_m_invoice_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_m_invoice_header",
        key: "allo_m_id",
        wftempid: 10064,
        FrmInfo: {},
        grids: [
            {//金额分配明细
                optionname: 'options_grid',
                idname: 'fin_funds_m_invoice_lineoffin_funds_m_invoice_headers'
            }, {//产品部明细
                optionname: 'options_kind',
                idname: 'fin_funds_m_invoice_kind_lineoffin_funds_m_invoice_headers'
            }
        ]
    };

    /**---------------------初始化页面----------------------*/
    /***********************权限控制*********************/
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
    var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;
    /**---------------------权限控制-------------------*/


    /**----------------页面隐藏------------------------*/

    /**********************下拉框值查询（系统词汇）***************/
    //到款类型 funds_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        $scope.funds_types = data.dicts;
    })
    //贸易类型 trade_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    })
    //dgKind.item_kind 产品部
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_kind"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //产品部明细
            $scope.columns_kind[$scope.getIndexByField("columns_kind", "item_kind")].cellEditorParams.values.push(newobj);
        }
    })
    //dgGrid.fee_type 费用项目
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "inv_fee_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            $scope.columns_grid[$scope.getIndexByField("columns_grid", "fee_type")].cellEditorParams.values.push(newobj);
        }
    })
    /**********************弹出框值查询**************************/
    //allo_no 分配单号
    $scope.allo_no = function () {
        $scope.FrmInfo = {
            classid: "fin_funds_invoice_header",
            sqlBlock: 'stat=5 and not exists (select 1 from Fin_Funds_m_Invoice_Header mh '
            + '   where mh.allo_id=Fin_Funds_Invoice_Header.allo_id and mh.stat<>5)',
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            if (data.allo_id == undefined) {
                return;
            }
            BasemanService.RequestPost("fin_funds_invoice_header", "select", {
                allo_id: data.allo_id,
                funds_id: data.funds_id
            }).then(function (result) {
                result.stat = 1;
                result.wfid = 0;
                result.wfflag = 0;
                result.version = 1;
                delete result.fin_funds_invoice_headers;
                result.fin_funds_m_invoice_lineoffin_funds_m_invoice_headers = result.fin_funds_invoice_lineoffin_funds_invoice_headers;
                delete result.fin_funds_invoice_lineoffin_funds_invoice_headers;
                result.fin_funds_m_invoice_kind_lineoffin_funds_m_invoice_headers = result.fin_funds_invoice_kind_lineoffin_funds_invoice_headers;
                delete result.fin_funds_invoice_kind_lineoffin_funds_invoice_headers;
                for (var name in result) {
                    $scope.data.currItem[name] = result[name];
                }
                $scope.setgridstat($scope.data.currItem.stat);
                $scope.setitemline1($scope.data.currItem);
            })
        });
    }
    //客户
    $scope.fnCustCodeClick = function () {
        return;
        $scope.FrmInfo = {
            classid: "customer",
            postdata: {flag: 1},
            sqlBlock: "",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    };
    //部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = parseInt(result.orgid);
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.idpath = result.idpath
        });
    };

    /**************************网格定义******************************/
    //分组功能
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
        cellRendererParams: function (params) {
        }
    };

    //金额分配明细
    $scope.options_grid = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_grid.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_grid = [
        {
            headerName: "费用项目", field: "fee_type", editable: false, filter: 'set', width: 120,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "形式发票号", field: "pi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "此次核销金额", field: "invoice_check_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "待核销金额", field: "tt_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "分配调整金额", field: "modify_amt", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            non_empty: true,
        }
    ];

    //费用明细
    $scope.options_kind = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: false,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_kind.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_kind = [
        {
            headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款总额", field: "fact_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "可分配金额", field: "canuse_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "本次分配金额", field: "allo_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "可调整金额", field: "m_amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    /**----------------网格区域-----------------------------**/
    /*******************************导出excel**********/


    /**--------------------网格定义--------------------------*/
    $scope.clearinformation = function () {
        $scope.data.currItem.org_code = window.userbean.org_code;
        $scope.data.currItem.org_id = window.userbean.org_id;
        $scope.data.currItem.org_name = window.userbean.org_name;
    }

    $scope.save_before = function () {
        if ($scope.data.currItem.stat > 1) {
            $scope.data.currItem.flag = 4;
        }
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('fin_funds_m_invoice_headerEdit', fin_funds_m_invoice_headerEdit)
