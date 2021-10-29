var basemanControllers = angular.module('inspinia');
function edi_shipmentapplyinfo($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名    银行代码申请查询
    $scope.objconf = {
        classid: "edi_shipmentapplyinfo",
        key: "corpserialid",
        nextStat: "edi_shipmentapplyinfoEdit",
        classids: "edi_shipmentapplyinfos",
        // postdata: {sqlwhere:"stat=5"},
        sqlBlock: "",
        thead: [],
        grids: [{optionname: 'viewOptions', idname: 'contains'}]
    };
    $scope.headername = "出运申报";
    edi_shipmentapplyinfo = HczyCommon.extend(edi_shipmentapplyinfo, ctrl_view_public);
    edi_shipmentapplyinfo.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
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
        headerName: "单据号", field: "corpserialno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
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
        headerName: "买方代码", field: "buyerno", editable: false, filter: 'set', width: 200,
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
        headerName: "买方国家/区域", field: "buyercountrycode", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "买方地址", field: "buyerengaddr", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "开证行swift", field: "bankno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "开证行名称", field: "bankengname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "开证行地址", field: "bankaddr", editable: false, filter: 'set', width: 100,
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
        headerName: "发票金额", field: "invoicesum", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "投保金额", field: "insuresum", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "出运货币代码", field: "moneyid", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "合同支付期限", field: "payterm", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "合同支付方式", field: "paymode", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: 'LC'},{value: 1, desc: 'DP'}, {value: 2, desc: 'DA'}, {value: 3, desc: 'OA'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "缴费支付方式", field: "feepaymode", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 0, desc: 'LC'},{value: 1, desc: 'DP'}, {value: 2, desc: 'DA'}, {value: 3, desc: 'OA'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "运输方式", field: "trafficcode", editable: false, filter: 'set', width: 100,
        cellEditor: "下拉框",
        cellEditorParams: {
            values: [{value: 1, desc: '海运'}, {value: 2, desc: '空运'}, {value: 3, desc: '铁路'},
                {value: 4, desc: '公路'},{value: 5, desc: '海陆联运'}]
        },
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "出运日期", field: "transportdate", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "海关商品代码", field: "code10", editable: false, filter: 'set', width: 100,
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
        headerName: "商品名称", field: "goodsname", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "合同号", field: "contractno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "提单号", field: "transportbillno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "报关单号", field: "customsbillno", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "保户特别说明", field: "remark", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "业务员", field: "employeename", editable: false, filter: 'set', width: 100,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    }, {
        headerName: "付款人", field: "payername", editable: false, filter: 'set', width: 200,
        cellEditor: "文本框",

        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatCell: true
    },{
        headerName: "信用证号", field: "lcno", editable: false, filter: 'set', width: 100,
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
        headerName: "投保金额不一致原因", field: "not_note", editable: false, filter: 'set', width: 100,
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
    .controller('edi_shipmentapplyinfo', edi_shipmentapplyinfo)
