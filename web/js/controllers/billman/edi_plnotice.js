var basemanControllers = angular.module('inspinia');
function edi_plnotice($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名    可损通知
    $scope.objconf = {
        classid: "edi_plnotice",
        key: "corpserialid",
        nextStat: "edi_plnoticeEdit",
        classids: "edi_plnotices",
        // postdata: {sqlwhere:"stat=5"},
        sqlBlock: "",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "可损通知";
    edi_plnotice = HczyCommon.extend(edi_plnotice, ctrl_view_public);
    edi_plnotice.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        headerName: "状态", field: "stat", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: []
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "单号", field: "corpserialno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "保单号", field: "policyno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "发票号", field: "invoiceno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "应付款日期", field: "shouldpaydate", editable: false, filter: 'set', width: 160,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "中信保保兑行swift码", field: "bizexbankno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "中信保开证行swift码", field: "bizopenbankno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "案情说明", field: "caseexplain", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "中信保买家编号", field: "sinosurebuyerno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "可损原因描述", field: "plreasondesc", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "减损措施说明", field: "adoptmeasure", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "是否融资", field: "financeflag", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "是否已向保兑银行催款", field: "ifbankurge", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否委托追讨", field: "troverflag", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否已签署《索赔权转让协议》", field: "ifinsuranturge", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否已签署《应收账款转让协议》", field: "ifarf", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "被保险人是否已签署《索赔转让协议》", field: "detainflag", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '否'}, {value: 1, desc: '是'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 100,
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
    .controller('edi_plnotice', edi_plnotice)
