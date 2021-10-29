var basemanControllers = angular.module('inspinia');
function sale_marketinfo_apply($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "sale_marketinfo_apply",
        key: "mia_id",
        nextStat: "sale_marketinfo_applyEdit",
        classids: "sale_marketinfo_applys",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "/修改国家档案";
    sale_marketinfo_apply = HczyCommon.extend(sale_marketinfo_apply, ctrl_view_public);
    sale_marketinfo_apply.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        headerName: "单号", field: "mia_no", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "国家", field: "area_name", editable: false, filter: 'set', width: 185,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "版本号", field: "version", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "部门", field: "org_name", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "类型", field: "mia_type", editable: false, filter: 'set', width: 160,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '新增'}, {value: 2, desc: '变更'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "状态", field: "stat", editable: false, filter: 'set', width: 150,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '制单'}, {value: 3, desc: '启动'}, {value: 5, desc: '审核'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "更新人", field: "updator", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "更新时间", field: "update_time", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
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
    .controller('sale_marketinfo_apply', sale_marketinfo_apply)
