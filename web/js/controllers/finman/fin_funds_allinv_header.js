var basemanControllers = angular.module('inspinia');
function fin_funds_allinv_header($rootScope, $scope, $location, $modal,$timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "fin_funds_allinv_header",
        key: "allo_id",
        nextStat: "fin_funds_allinv_headerEdit",
        classids: "fin_funds_allinv_headers",
        sqlBlock: "1=1",
        thead:[],
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };
    $scope.headername="费用发票批量核销";
    //继承基类方法
    fin_funds_allinv_header = HczyCommon.extend(fin_funds_allinv_header, ctrl_view_public);
    fin_funds_allinv_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    $scope.beforeSearch = function (postdata) { //在查询之前执行的方法

    };

    /****************************网格下拉************************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.viewColumns[0].cellEditorParams.values.push(newobj)
        }
    });
    //到款类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.viewColumns[$scope.getIndexByField("viewColumns","funds_type")].cellEditorParams.values.push(newobj)
        }
    });
    //贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
            $scope.viewColumns[$scope.getIndexByField("viewColumns","trade_type")].cellEditorParams.values.push(newobj)
        }
    });
    $scope.viewColumns = [
        {
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: []
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "单据号", field: "allo_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "更新人", field: "updator", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "更新时间", field: "update_time", editable: false, filter: 'set', width: 120,
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
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('fin_funds_allinv_header', fin_funds_allinv_header);

