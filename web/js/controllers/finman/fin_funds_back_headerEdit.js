var basemanControllers = angular.module('inspinia');
function fin_funds_back_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    fin_funds_back_headerEdit = HczyCommon.extend(fin_funds_back_headerEdit, ctrl_bill_public);
    fin_funds_back_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "fin_funds_back_header",
        key: "back_id",
        wftempid: 10181,
        FrmInfo: {},
        grids: [{optionname: 'options_3', idname: 'fin_funds_sapoffin_funds_back_headers'}]
    };

    /************************系统词汇**************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    //到款类型back_Tt_Type
    // $scope.funds_types=[{dictvalue:1,dictname:"TT"},{dictvalue:2,dictname:"LC"}];
    //回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"}).then(function (data) {
        $scope.return_ent_types = data.dicts;
    });
    //回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        $scope.funds_types = data.dicts;
    });

    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.is_into_amt == undefined ? errorlist.push("是否引资金系统到款单不能为空") : 0;
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    $scope.save_before= function(){
        delete fin_funds_sapoffin_funds_back_headers
    }
    /************************弹出框**************************/
    //供应商
    $scope.selectvender = function () {
        $scope.FrmInfo = {
            classid: "sale_vender",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.vender_code=result.vender_code;
            $scope.data.currItem.vender_name=result.vender_name;
            $scope.data.currItem.vender_id=result.vender_id;

        });
    };
    //会计期间
    $scope.selectdname = function () {
        $scope.FrmInfo = {
            postdata:{flag:3},
            
            classid: "fin_bud_period_header",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.dname=result.dname;

        });
    };
    //到款单号
    $scope.selectfunds_no = function () {
        $scope.FrmInfo = {
            classid: "fin_funds_header",
            sqlBlock:"stat=5 and fact_amt-allocated_amt>0"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.funds_id=result.funds_id;
            $scope.data.currItem.funds_no=result.funds_no;
            $scope.data.currItem.funds_type=Number(result.funds_type);//到款类型
            $scope.data.currItem.return_ent_type=Number(result.return_ent_type);//回款组织
            $scope.data.currItem.currency_name=result.currency_name;
            $scope.data.currItem.currency_code=result.currency_code;
            $scope.data.currItem.currency_id=result.currency_id;
            $scope.data.currItem.fact_amt=result.fact_amt;
            $scope.data.currItem.allocated_amt=result.allocated_amt;
            $scope.data.currItem.org_id=result.org_id;
            $scope.data.currItem.org_code=result.org_code;
            $scope.data.currItem.org_name=result.org_name;
            $scope.data.currItem.cust_name=result.cust_name;
            $scope.data.currItem.cust_code=result.cust_code;
            $scope.data.currItem.cust_id=result.cust_id;
            $scope.data.currItem.can_back_amt=Number(result.fact_amt)-Number(result.allocated_amt);
        });
    };
    //导入资金系统到款单
    $scope.tofin_funds = function () {
        localeStorageService.set("crmman.fin_funds_headerSearch", {
            other_no: $scope.data.currItem.other_no
        });
        $state.go("crmman.fin_funds_headerSearch");
    }
    /************************网格定义区域**************************/
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
    $scope.columns_3 = [ {
        headerName: "凭证号", field: "sap_no", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "凭证日期", field: "gl_date", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单据编码", field: "finfunds_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "凭证组织", field: "org_code", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单据状态", field: "fin_stat", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: "1", desc: "可用"}, {value: "2", desc: "红冲"}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }];
    $scope.options_3 = {
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
            var isGrouping = $scope.options_3.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /****************************初始化**********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time: myDate.toLocaleDateString(),
        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('fin_funds_back_headerEdit', fin_funds_back_headerEdit);
