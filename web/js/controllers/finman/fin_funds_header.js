var basemanControllers = angular.module('inspinia');
function fin_funds_header($rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "fin_funds_header",
        key: "funds_id",
        classids: "fin_funds_headers",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
  
    //继承基类方法
    fin_funds_header = HczyCommon.extend(fin_funds_header, ctrl_view_public);
    fin_funds_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    $scope.beforClearInfo = function () {
        var name=$rootScope.$state.$current.self.name;
        if(name=="crmman.fin_funds_header_tt"){
            $scope.objconf.postdata={ sqlwhere:"funds_type=1"};//TT到款
            $scope.objconf.nextStat="fin_funds_header_ttEdit";
            $scope.headername="TT到款录入";
        }else if(name=="crmman.fin_funds_header_ttrl"){
            $scope.objconf.postdata={ sqlwhere:"confirm_stat = 2 and Funds_Type = 1 "};  //认领
            $scope.objconf.nextStat="fin_funds_header_ttrlEdit";
            $scope.headername="TT到款客户认领";
            $scope.hide="true";
        }else if(name=="crmman.fin_funds_header_lc"){
            $scope.objconf.postdata={ sqlwhere:"1=1 and funds_type = 2"}; //信用证到款录入
            $scope.objconf.nextStat="fin_funds_header_lcEdit";
            $scope.headername="信用证到款录入";
            // 合同、发票号
        }
    };
    $scope.beforClearInfo();
    /****************************网格下拉************************/
    //回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            var return_ent_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                return_ent_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'return_ent_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'return_ent_type')].cellEditorParams.values = return_ent_types;
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
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "tt_type"})
        .then(function (data) {
            var tt_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                tt_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'tt_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'tt_type')].cellEditorParams.values = tt_types;
            }
        });
    //到款类型2
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"})
        .then(function (data) {
            var pay_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                pay_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'funds_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'funds_type')].cellEditorParams.values = pay_types;
            }
        });
    //融资类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rongzi_type"})
        .then(function (data) {
            var rongzi_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                rongzi_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'rongzi_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'rongzi_type')].cellEditorParams.values = rongzi_types;
            }
        });

    $scope.viewColumns = [
        {
            headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "状态", field: "stat", editable: false, filter: 'set', width:60,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款单号", field: "funds_no", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "资金系统单号", field: "other_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "接口资金单号", field: "zj_note", editable: false, filter: 'set', width: 120,
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
        }, {
            headerName: "实收金额", field: "amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "扣费", field: "amt_deduct", editable: false, filter: 'set', width: 60,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款总额", field: "fact_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "银行编码", field: "bank_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行", field: "bank_name", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行账号", field: "account_no", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        , {
            headerName: "汇款人", field: "hk_man", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "历史认领业务员", field: "sales_history_user", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 140,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "水单编号", field: "lc_bill_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款日期", field: "funds_date", editable: false, filter: 'set', width: 100,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "会计期间", field: "dname", editable: false, filter: 'set', width: 100,
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
        }, {
            headerName: "信用证号", field: "lc_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "汇出国家", field: "areaname", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "货币", field: "currency_code", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "确认人", field: "confirm_man", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "确认时间", field: "confirm_date", editable: false, filter: 'set', width: 85,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已确认", field: "confirm_stat", editable: false, filter: 'set', width: 85,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 1, desc: '未确认'}, {value: 2, desc: '已确认'}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "版本号", field: "version", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "当前汇率", field: "exchange_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "SAP凭证号", field: "sap_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "引SAP时间", field: "sap_date", editable: false, filter: 'set', width: 100,
            cellEditor: "时分秒",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "回款组织", field: "return_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "LC到款类型", field: "lc_cash_type", editable: false, filter: 'set', width: 110,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "到款类型", field: "tt_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "融资类型", field: "rongzi_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "融资到期日", field: "rongzi_dqdate", editable: false, filter: 'set', width: 120,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "合同号", field: "hth", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:true
        }, {
            headerName: "发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            hide:true
        }, {
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
    .controller('fin_funds_header', fin_funds_header);

