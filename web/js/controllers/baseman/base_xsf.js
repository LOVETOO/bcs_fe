var basemanControllers = angular.module('inspinia');
function base_xsf($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "base_sx",
        key: "sx_id",
        nextStat: "base_xsfEdit",
        classids: "base_sxs",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "价格系数";
    // $scope.hide = true;
    base_xsf = HczyCommon.extend(base_xsf, ctrl_view_public);
    base_xsf.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        headerName: "冷量标准", field: "cool_stand", editable: false, filter: 'set', width: 200,
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
        headerName: "面板标准", field: "mb_stand", editable: false, filter: 'set', width: 120,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'N'}, {value: 2, desc: 'K'},{value: 3, desc: 'E'}, {value: 4, desc: 'S'},
                {value: 5, desc: 'Q'}, {value: 6, desc: 'P'},{value: 7, desc: 'V'}, {value: 8, desc: '默认'},
                {value: 9, desc: 'L'}, {value: 10, desc: 'F'},{value: 11, desc: 'Y'},{value: 12, desc: 'M'},
                {value: 13, desc: 'A'},{value: 14, desc: 'U'}, {value: 15, desc: 'AK'},{value: 16, desc: '其他'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
    },{
        headerName: "系数", field: "sx", editable: false, filter: 'set', width: 150,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "基准率", field: "jzl", editable: false, filter: 'set', width: 150,
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
    .controller('base_xsf', base_xsf)
