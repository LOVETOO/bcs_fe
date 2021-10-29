var basemanControllers = angular.module('inspinia');
function customer_record_check_header($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer_record_check_header",
        key: "check_id",
        nextStat: "customer_record_check_headerEdit",
        classids: "customer_record_check_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "客户接待认领";
    /*********************系统词汇值*******************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //柜型柜量
            $scope.viewColumns[0].cellEditorParams.values.push(newobj)
        }
    })
    //继承基类方法
    customer_record_check_header = HczyCommon.extend(customer_record_check_header, ctrl_view_public);
    customer_record_check_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    $scope.viewColumns = [{
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 80,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 85,
        cellEditor: "下拉框",
        cellEditorParams: {values: []},
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "认领单号", field: "check_no", editable: false, filter: 'set', width: 130,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 130,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 85,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "备注", field: "note", editable: false, filter: 'set', width: 200,
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
        //pinned: 'right',
        cellRenderer: "链接渲染"
    }];
    //数据缓存
    $scope.initData();
}
//加载控制器
basemanControllers
    .controller('customer_record_check_header', customer_record_check_header);

