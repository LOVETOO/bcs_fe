var basemanControllers = angular.module('inspinia');
function edi_nolcquotaapplyinfoSearch($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名    银行代码申请查询
    $scope.objconf = {
        classid: "edi_nolcquotaapplyinfo",
        key: "corpserialid",
        nextStat: "edi_nolcquotaapplyinfoEdit",
        classids: "edi_nolcquotaapplyinfos",
        sqlBlock: "1=1",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "限额申请";
    edi_nolcquotaapplyinfoSearch = HczyCommon.extend(edi_nolcquotaapplyinfoSearch, ctrl_view_public);
    edi_nolcquotaapplyinfoSearch.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        headerName: "销售区域", field: "areaname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方代码", field: "sinosurebuyerno", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方名称", field: "buyerengname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方国家", field: "buyercountrycode", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方地址", field: "buyerengaddress", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方注册号", field: "buyerregno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方电话", field: "buyertel", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方传真", field: "buyerfax", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否有担保人", field: "warrantortype", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '有'}, {value: 0, desc: '无'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人代码", field: "sinosurewarrantorno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人名称", field: "warrantorengname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人国家", field: "warrantorcountrycode", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人地址", field: "warrantorengaddress", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人注册号", field: "warrantorregno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人电话", field: "warrantortel", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "担保人传真", field: "Warrantorfax", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "信用期限", field: "paytermapply", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "申请限额", field: "quotasumapply", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "合同支付方式", field: "contractpaymode", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 4, desc: 'OA'}, {value: 2, desc: 'D/P'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "当前在手订单金额", field: "ordersum", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "当前应收账款余额", field: "armsum", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "商品代码", field: "tradenamecode", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 01, desc: '家电产品'}, {value: 10, desc: '陶瓷'},{value: 11, desc: '汽车整车或成套散件'}, {value: 12, desc: '纺织原料及半成品'},
                {value: 13, desc: '皮革'}, {value: 14, desc: '光伏产品'},{value: 15, desc: '纺织成品'}, {value: 16, desc: '农产品'},
                {value: 17, desc: '燃料油'}, {value: 18, desc: '鞋靴'},{value: 19, desc: '工程机械及其零部件'}, {value: 02, desc: '摩托车'},
                {value: 20, desc: '化肥'}, {value: 21, desc: '船舶及修理'},{value: 22, desc: '印刷电路板及原料'}, {value: 23, desc: '玩具'},
                {value: 24, desc: '手机及电话'}, {value: 25, desc: '其他基本金属及贵金属'},{value: 99, desc: '其他'}, {value: 03, desc: '医院保健品'},
                {value: 04, desc: '钢铁'}, {value: 05, desc: '家具'},{value: 06, desc: '汽车零部件'}, {value: 07, desc: '农药'},
                {value: 08, desc: '其他通讯产品'}, {value: 09, desc: '电脑'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "商品名称", field: "tradeelsename", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否有历史交易", field: "ifhisttrade", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: '无'}, {value: 1, desc: '有'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "最早成交年份", field: "earlytradeyear", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "开始放账年份", field: "startdebtyear", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "最近一年交易年份", field: "lastyear1", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "结算方式", field: "lastpaymode1", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'L/C'}, {value: 2, desc: 'D/P'}, {value: 4, desc: 'OA'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "交易额", field: "lastsum1", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "最近二年交易年份", field: "lastyear2", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "结算方式", field: "lastpaymode2", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'L/C'}, {value: 2, desc: 'D/P'}, {value: 4, desc: 'OA'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "交易额", field: "lastsum2", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "最近三年交易年份", field: "lastyear3", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "结算方式", field: "lastpaymode3", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: 'L/C'}, {value: 2, desc: 'D/P'}, {value: 4, desc: 'OA'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "交易额", field: "lastsum3", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "应付款日内（含）USD", field: "buyerpaybehave1", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "应付款日后30天以内USD", field: "buyerpaybehave2", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "应付款日后31-60天以内USD", field: "buyerpaybehave3", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "应付款日后60天以上USD", field: "buyerpaybehave4", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "其他说明", field: "remark", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
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
        headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "修改人", field: "updator", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "修改时间", field: "update_time", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "是否可用", field: "usable", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '是'}, {value: 2, desc: '否'}]
        },
        checkboxSelection: function (params) {
            return params.columnApi.getRowGroupColumns().length === 0;
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "失效时间", field: "lapsedate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "其他商业风险赔偿比例", field: "otherrate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "拒收风险赔偿比例", field: "refuserate", editable: false, filter: 'set', width: 100,
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
    .controller('edi_nolcquotaapplyinfoSearch', edi_nolcquotaapplyinfoSearch)
