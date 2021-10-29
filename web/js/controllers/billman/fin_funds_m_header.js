var basemanControllers = angular.module('inspinia');
function fin_funds_m_header($rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "fin_funds_m_header",
        key: "funds_m_id",
        // nextStat: "fin_funds_m_header_ttrlEdit",
        classids: "fin_funds_m_headers",
        // postdata:{},
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    // $scope.objconf.postdata;
   
    //继承基类方法
    fin_funds_m_header = HczyCommon.extend(fin_funds_m_header, ctrl_view_public);
    fin_funds_m_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    var name=$rootScope.$state.$current.self.name;
    if(name=="crmman.fin_funds_m_header_tt"){
        $scope.objconf.postdata={ sqlBlock:"funds_type=1"};//到款变更 
        $scope.objconf.nextStat="fin_funds_m_headerEdit";
        $scope.headername="TT到款变更";
        $scope.TTShow=true;
    }else if(name=="crmman.fin_funds_m_header_ttrl"){
        $scope.objconf.postdata={ sqlBlock:"funds_type=1 and change_type=2 "};  //认领错
        $scope.objconf.nextStat="fin_funds_m_headerEdit";
        $scope.headername="客户认领变更";
        $scope.TTShow=false;
    }else if(name=="crmman.fin_funds_m_header_kf"){
        $scope.objconf.postdata={ sqlBlock:"funds_type=1 and change_type=4"}; //扣费变更
        $scope.objconf.nextStat="fin_funds_m_header_kfEdit";
        $scope.headername="扣费变更";
        $scope.TTShow=true;
    }else if(name=="crmman.fin_funds_m_header_zjxt"){
        $scope.objconf.postdata={ sqlBlock:"funds_type=1 and change_type=3"};//系统单号变更
        $scope.objconf.nextStat="fin_funds_m_header_zjxtEdit";
        $scope.headername="变更资金系统单号";
        $scope.TTShow=true;
    }
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {};
        $scope.data.currItem = {};
        $scope.data.currItem.viewDatas = [];
    };
    $scope.clearinformation();
    /************网格下拉************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var stats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                stats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = stats;
            }
        });

    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "tt_type"})
        .then(function (data) {
            var funds_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                funds_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'funds_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'funds_type')].cellEditorParams.values = funds_types;
            }
        });
    //贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            var trade_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                trade_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'trade_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'trade_type')].cellEditorParams.values = trade_types;
            }
        });

    //LC到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_cash_type"})
        .then(function (data) {
            var lc_cash_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                lc_cash_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'lc_cash_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'lc_cash_type')].cellEditorParams.values = lc_cash_types;
            }
        });
    $scope.viewColumns = [
        {
            headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "变更单号", field: "funds_m_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "版本号", field: "version", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到款单号", field: "funds_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "汇款人", field: "hk_man", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "付款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "利息", field: "lc_interest", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "实收金额", field: "amt", editable: false, filter: 'set', width: 120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width:120,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "水单编号", field: "lc_bill_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "信用证号", field: "lc_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务部门", field: "org_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务部门名称", field: "org_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "贸易类型", field: "trade_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "汇出国家", field: "areaname", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户描述", field: "cust_desc", editable: false, filter: 'set', width:120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "会计期间", field: "dname", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "货币名称", field: "currency_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "确认人", field: "confirm_man", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "确认时间", field: "confirm_date", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "已确认", field: "confirm_stat", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '未确认'}, {value: 2, desc: '已确认'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "当前汇率", field: "exchange_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "ERP回款方式", field: "yn_return_type", editable: false, filter: 'set', width:120,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: 'T/T OS'}, {value: 2, desc: 'LC OS'}, {value: 3, desc: 'OA OS'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "回款组织", field: "return_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '宁波-进出口'}, {value: 2, desc: '香港'}, {value: 5, desc: '宁波-空调'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "原利息", field: "cur_lc_interest", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "LC到款类型", field: "lc_cash_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('fin_funds_m_header', fin_funds_m_header);

