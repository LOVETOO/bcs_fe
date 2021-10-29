var basemanControllers = angular.module('inspinia');
function base_type_sx($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "base_type_sx",
        key: "sx_id",
        nextStat: "base_type_sxEdit",
        classids: "base_type_sxs",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "机型调整维护";
    // $scope.hide = true;
    base_type_sx = HczyCommon.extend(base_type_sx, ctrl_view_public);
    base_type_sx.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----弹出框事件区域  ----------*/
    /**----修改文本框触发事件区域  ----------*/
    /**----网格列区域  ----------*/
    $scope.viewColumns = [{
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 50,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "产品大类", field: "item_type_name", editable: false, filter: 'set', width: 120,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "冷量", field: "cool_stand", editable: false, filter: 'set', width: 90,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '5K'}, {value: 2, desc: '7K'},{value: 3, desc: '9K'}, {value: 4, desc: '12K'},
                {value: 5, desc: '18K'}, {value: 6, desc: '24K'},{value: 7, desc: '30K'}, {value: 8, desc: '36K'},
                {value: 9, desc: '42K'}, {value: 10, desc: '48K'},{value: 11, desc: '60K'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "系数", field: "sx", editable: false, filter: 'set', width: 90,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "调整系数", field: "modify_value", editable: false, filter: 'set', width: 90,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "修改人", field: "updator", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "最后修改时间", field: "update_time", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "备注", field: "note", editable: false, filter: 'set', width: 250,
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
        // pinned: 'right',
        cellRenderer: "链接渲染"
    }];
    //数据缓存
    $scope.initData();
}

//加载控制器
basemanControllers
    .controller('base_type_sx', base_type_sx)
