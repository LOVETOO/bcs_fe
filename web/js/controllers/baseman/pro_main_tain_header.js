var basemanControllers = angular.module('inspinia');
function pro_main_tain_header($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名    银行代码申请查询
    $scope.objconf = {
        classid: "pro_maintain_header",
        key: "maintain_id",
        nextStat: "pro_main_tain_headerEdit",
        classids: "pro_maintain_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "BOM";
    pro_main_tain_header = HczyCommon.extend(pro_main_tain_header, ctrl_view_public);
    pro_main_tain_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----弹出框事件区域  ----------*/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                }
            }

            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = line_types;
            }
        });
    $scope.viewColumns = [{
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 60,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "状态", field: "stat", editable: false, filter: 'set', width: 85,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: []
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "申请单号",
        field: "maintain_no",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 120,
    }, {
        headerName: "申请类型",
        field: "apply_type",
        editable: false,
        filter: 'set',
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '新增机型'}, {value: 2, desc: '临时方案申请'}, {value: 3, desc: '选配库完善'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "销售区域编码",
        field: "org_code",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120,
    }, {
        headerName: "销售区域名称",
        field: "org_name",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120
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
        cellEditor: "时分秒",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 130
    }, {
        headerName: "更新人",
        field: "updator",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 85
    }, {
        headerName: "更新时间",
        field: "update_time",
        editable: false,
        filter: 'set',
        cellEditor: "时分秒",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 130
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
    .controller('pro_main_tain_header', pro_main_tain_header)
