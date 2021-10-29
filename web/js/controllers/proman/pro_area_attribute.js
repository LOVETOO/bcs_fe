var basemanControllers = angular.module('inspinia');
function pro_area_attribute($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名    银行代码申请查询
    $scope.objconf = {
        classid: "pro_area_attribute",
        key: "pro_id",
        nextStat: "pro_area_attributeEdit",
        classids: "pro_area_attributes",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "国家关键属性";
    pro_area_attribute = HczyCommon.extend(pro_area_attribute, ctrl_view_public);
    pro_area_attribute.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
    },{
        headerName: "国家",
        field: "area_name",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "区域经理",
        field: "area_user",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "制冷剂类型",
        field: "refrigerant",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120,
    }, {
        headerName: "气候类型",
        field: "climate_type",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120
    }, {
        headerName: "电压类型",
        field: "power_type",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 100
    }, {
        headerName: "低电压",
        field: "low_voltage",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 100
    }, {
        headerName: "夏季最高温度",
        field: "high_temperature",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 130
    }, {
        headerName: "冬季最低温度",
        field: "low_temperature",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 130
    }, {
        headerName: "能效",
        field: "energy",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120
    }, {
        headerName: "产品认证法规",
        field: "certification",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 180,
    }, {
        headerName: "备注",
        field: "note",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "创建人",
        field: "creator",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120,
    }, {
        headerName: "创建时间",
        field: "create_time",
        editable: false,
        filter: 'set',
        cellEditor: "年月日",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120
    }, {
        headerName: "更新人",
        field: "updator",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 100
    }, {
        headerName: "更新时间",
        field: "update_time",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 100
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
    .controller('pro_area_attribute', pro_area_attribute)
