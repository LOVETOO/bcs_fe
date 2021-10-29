var basemanControllers = angular.module('inspinia');
function pro_mb_cust_data($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "pro_mb_cust_data",
        key: "pro_id",
        nextStat: "pro_mb_cust_dataEdit",
        classids: "pro_mb_cust_datas",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "大客户面板";
    $scope.hide = true;
    pro_mb_cust_data = HczyCommon.extend(pro_mb_cust_data, ctrl_view_public);
    pro_mb_cust_data.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----弹出框事件区域  ----------*/
    /**----修改文本框触发事件区域  ----------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [{
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "面板款式", field: "mb_style", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "国家名称", field: "area_name", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "区域经理", field: "area_user", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "到期时间", field: "due_time", editable: false, filter: 'set', width: 150,
        cellEditor: "年月日",
        //cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    }, {
        headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 120,
        cellEditor: "年月日",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "更新人", field: "updator", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "更新时间", field: "update_time", editable: false, filter: 'set', width: 150,
        cellEditor: "年月日",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "备注", field: "note", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
        //cellchange:$scope.bankBalance,
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
    .controller('pro_mb_cust_data', pro_mb_cust_data)
