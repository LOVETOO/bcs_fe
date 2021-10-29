var billmanControllers = angular.module('inspinia');
function sale_ship_noticeYP_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    sale_ship_noticeYP_headerEdit = HczyCommon.extend(sale_ship_noticeYP_headerEdit, ctrl_bill_public);
    sale_ship_noticeYP_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ship_notice_header",
        key: "notice_id",
        wftempid: 10006,
        FrmInfo: {},
        grids: [{optionname: 'boxline_options', idname: 'sale_ship_box_lineofsale_ship_notice_headers'},//信用证信息
        ]
    };
    /************************初始化页面***********************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            seaport_out_id: 1,
            pi_date: moment().format('YYYY-MM-DD HH:mm:ss'),
//             delivery_date: moment().add('days', 35).format('YYYY-MM-DD HH:mm:ss'),
            currency_id: 4,
            order_type_id: 1,
            price_type_id: 1,
            ship_type: 1,
        };
    };
    /******************  页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show_credit = function () {
        $scope.show_11 = !$scope.show_11;
    };
    /**********************下拉框值查询***************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    //到款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "scpent"})
        .then(function (data) {
            $scope.scpents = HczyCommon.stringPropToNum(data.dicts);
        });
    //付款方式系统词汇值
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "pay_style"})
        .then(function (data) {
            $scope.pay_styles = HczyCommon.stringPropToNum(data.dicts);
        });
    // 订单类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_order_type"})
        .then(function (data) {
            $scope.sale_order_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //发运方式
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "ship_type"})
        .then(function (data) {
            $scope.ship_types = HczyCommon.stringPropToNum(data.dicts);
        });
    // 贸易类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"})
        .then(function (data) {
            $scope.trade_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //价格条款名称
    BasemanService.RequestPost("base_search", "search", {dictcode: "price_type"})
        .then(function (data) {
            $scope.price_types = HczyCommon.stringPropToNum(data.dicts);
        });
    $scope.sale_types = [
        {
            id: 1,
            name: "外销常规订单"
        }, {
            id: 2,
            name: "外销散件订单"
        }, {
            id: 3,
            name: "配件订单"
        }
    ];

    /************网格下拉值**********************/
   //柜型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "box_type"}).then(function (data) {
        var datas=[];
        for (var i = 0; i < data.dicts.length; i++) {
            datas[i] = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            };
        }
        if ($scope.getIndexByField('boxline_columns', 'box_type')) {
            $scope.boxline_columns[$scope.getIndexByField('boxline_columns', 'box_type')].cellEditorParams.values = datas;
        }
    });
    //分组功能
    var groupColumn = {
        headerName: "Group",
        width: 200,
        field: 'name',
        valueGetter: function (params) {
            if (params.node.group) {
                return params.node.key;
            } else {
                return params.data[params.colDef.field];
            }
        },
        comparator: agGrid.defaultGroupComparator,
        cellRenderer: 'group',
        cellRendererParams: function (params) {
        }
    };


    //信用证
    $scope.boxline_options = {
        rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
        pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
        groupKeys: undefined,
        groupHideGroupColumns: false,
        enableColResize: true, //one of [true, false]
        enableSorting: true, //one of [true, false]
        enableFilter: true, //one of [true, false]
        enableStatusBar: false,
        enableRangeSelection: true,
        rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
        rowDeselection: false,
        quickFilterText: null,
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.boxline_options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.boxline_columns = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 60,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "柜型", field: "box_type", editable: false, filter: 'set', width: 60,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams:{
                values:[],
            }
        }, {
            headerName: "排柜序号", field: "box_seq", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "船务预排时间", field: "zuiz_box_date", editable: true, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "超时原因", field: "chaoshi_note", editable: true, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];
    /**----------------网格区域-----------------------------**/
    /*******************************导出excel**********/
    $scope.export = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_ship_notice_header", "exporttoexcel", {'notice_id': $scope.data.currItem.notice_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    };
    $scope.export1 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_ship_notice_header", "exporttoexcel1", {'notice_id': $scope.data.currItem.notice_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    };
    $scope.export2 = function () {
        if (!$scope.data.currItem.pi_id) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("sale_ship_notice_header", "exporttoexcel2", {'notice_id': $scope.data.currItem.notice_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    };

    $scope.refresh_after=function () {
        $scope.boxline_columns[$scope.getIndexByField("boxline_columns","zuiz_box_date")].editable=true;
        $scope.boxline_columns[$scope.getIndexByField("boxline_columns","chaoshi_note")].editable=true;

    }

    $scope.save_before=function (postdata){
        postdata.flag=17;
    }
    /**----------------------提交处理------------------------*/

    $scope.wfstart_before = function () {
        var requestArr = BasemanService.RequestPost("sale_ship_notice_header", "auditcheck", {
            notice_id: $scope.data.currItem.notice_id,
            notice_no: $scope.data.currItem.notice_no,
            this_use_amt: $scope.data.currItem.this_use_amt
        });
        return requestArr;
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_ship_noticeYP_headerEdit', sale_ship_noticeYP_headerEdit)
