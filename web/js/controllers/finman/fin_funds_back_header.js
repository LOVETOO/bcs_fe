var basemanControllers = angular.module('inspinia');
function fin_funds_back_header($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "fin_funds_back_header",
        key: "back_id",
        nextStat: "fin_funds_back_headerEdit",
        classids: "fin_funds_back_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "退款单";
    /*********************系统词汇值*******************/
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"})
        .then(function (data) {
            var funds_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                funds_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            $scope.viewColumns[$scope.getIndexByField('viewColumns', 'funds_type')].cellEditorParams.values = funds_types;
        });
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
    //继承基类方法
    fin_funds_back_header = HczyCommon.extend(fin_funds_back_header, ctrl_view_public);
    fin_funds_back_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    $scope.viewColumns = [{
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "状态", field: "stat", editable: false, filter: 'set', width: 60,
        cellEditor: "下拉框",
        cellEditorParams: {values: []},
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "退款单号", field: "back_no", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "原到款单号", field: "funds_no", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款类型", field: "funds_type", editable: false, filter: 'set', width: 85,
        cellEditor: "下拉框",
        cellEditorParams: {values: []},
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "回款组织", field: "return_ent_type", editable: false, filter: 'set', width: 85,
        cellEditor: "下拉框",
        cellEditorParams: {values: []},
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "币种", field: "currency_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "销售部门", field: "org_name", editable: false, filter: 'set', width: 85,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户", field: "cust_name", editable: false, filter: 'set', width: 130,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "供应商", field: "vender_name", editable: false, filter: 'set', width: 130,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到款总额", field: "fact_amt", editable: false, filter: 'set', width: 105,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "已分配金额", field: "allocated_amt", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "可退款金额", field: "can_back_amt", editable: false, filter: 'set', width: 105,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "退款金额", field: "back_amt", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
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
    .controller('fin_funds_back_header', fin_funds_back_header);

