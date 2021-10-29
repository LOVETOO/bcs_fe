var basemanControllers = angular.module('inspinia');
function sale_loss_header($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名    银行代码申请查询
    $scope.objconf = {
        classid: "sale_loss_header",
        key: "loss_id",
        nextStat: "sale_loss_headerEdit",
        classids: "sale_loss_headers",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "呆滞物料登记报损";
    sale_loss_header = HczyCommon.extend(sale_loss_header, ctrl_view_public);
    sale_loss_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    /**----弹出框事件区域  ----------*/
    /**----修改文本框触发事件区域  ----------*/
    /**----网格列区域  ----------*/
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
        headerName: "序号", field: "queue", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
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
        headerName: "报损单号",
        field: "loss_no",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "变更单号",
        field: "prod_m_no",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true,
        width: 100,
    }, {
        headerName: "变更类型",
        cellEditorParams: {
            values: [{value: 1, desc: '数量变更'}, {value: 2, desc: '技术变更'}, {value: 3, desc: '交期变更'},
                {value: 5, desc: '配件清单变更'}, {value: 6, desc: '暂停生产'}, {value: 7, desc: '已入库产品数量变更'},
                {value: 8, desc: '印刷件清单变更'}]
        },
        field: "change_type",
        editable: false,
        filter: 'set',
        cellEditor: "下拉框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120,
    }, {
        headerName: "商检批号",
        field: "inspection_batchno",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120
    }, {
        headerName: "部门",
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
        cellEditor: "年月日",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 120
    }, {
        headerName: "最后修改人",
        field: "updator",
        editable: false,
        filter: 'set',
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        width: 100
    }, {
        headerName: "修改时间",
        field: "update_time",
        editable: false,
        filter: 'set',
        cellEditor: "年月日",
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
    .controller('sale_loss_header', sale_loss_header)
