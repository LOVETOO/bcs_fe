var salemanControllers = angular.module('inspinia');
function sale_ys_grant_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ys_grant_headerEdit = HczyCommon.extend(sale_ys_grant_headerEdit, ctrl_bill_public);
    sale_ys_grant_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_ys_grant_header",
        key: "grant_id",
        wftempid: 10120,
        FrmInfo: {},
        grids: [
            {optionname: 'options_21', idname: 'sale_ys_grant_lineofsale_ys_grant_headers'}
        ]
    };
    $scope.beforClearInfo = function () {
        if($rootScope.$state.$current.self.name=="crmman.sale_ys_grant_headerEdit"){
            $scope.s_flag = 1;
            $scope.objconf.FrmInfo = {sqlBlock: "1=1"}
        }else if($rootScope.$state.$current.self.name=="crmman.sale_ys_grant_header_zfEdit"){
            $scope.s_flag = 2;
            $scope.objconf.FrmInfo = {sqlBlock: "stat=5"}
        }
    };
    $scope.beforClearInfo();
    /*********************作废********************************/
    $scope.cancel =function(){
        if($scope.data.currItem.modify_note==""||$scope.data.currItem.modify_note==undefined){
            BasemanService.notice("作废原因为空，请填写", "alter-warning")
            return;
        }
        ds.dialog.confirm("确定作废整单？", function () {
            var postdata={};
            postdata.grant_id=$scope.data.currItem.grant_id;
            postdata.modify_note=$scope.data.currItem.modify_note;
            BasemanService.RequestPost("sale_ys_grant_header", "cancel",postdata).then(function (data) {
                BasemanService.notice("作废成功", "alter-warning")
            })
        })
    };
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    /***************************词汇值***************************/
    // 订单类型词汇
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //客户等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"})
        .then(function (data) {
            var cust_levels = [];
            for (var i = 0; i < data.dicts.length; i++) {
                cust_levels[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'cust_level')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'cust_level')].cellEditorParams.values = cust_levels;
            }
        });
    //类型line_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
        .then(function (data) {
            var line_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                line_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'line_type')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'line_type')].cellEditorParams.values = line_types;
            }
        });
    //冷量cool_stand
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cool_stand"})
        .then(function (data) {
            var cool_stands = [];
            for (var i = 0; i < data.dicts.length; i++) {
                cool_stands[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'cool_stand')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'cool_stand')].cellEditorParams.values = cool_stands;
            }
        });
    //面板
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mb_stand"})
        .then(function (data) {
            var mb_stands = [];
            for (var i = 0; i < data.dicts.length; i++) {
                mb_stands[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('columns_21', 'mb_stand')) {
                $scope.columns_21[$scope.getIndexByField('columns_21', 'mb_stand')].cellEditorParams.values = mb_stands;
            }
        });
    /******************网格定义区域****************************/
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
        cellRendererParams: {
            checkbox: true
        }
    };
    //明细
    $scope.columns_21 = [
        // 1、	基础信息
        {
            headerName: "客户编码", field: "cust_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.cust_code,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "新品机型", field: "new_item", editable: true, filter: 'set', width: 100,
            cellEditor: "复选框",
            checkbox_value: 1,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "机型类型", field: "line_type", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "整机编码", field: "item_h_code", editable: true, filter: 'set', width: 110,
            cellEditor: "弹出框",
            action: $scope.item_h_code11,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "整机名称", field: "item_h_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "平台", field: " pt_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "机型", field: "drawid", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "冷量", field: "cool_stand", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "压缩机", field: "comp_drawid", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "冷凝器规格", field: " cond_spec", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "钣金", field: "sheet_metal", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },   {
            headerName: "面板", field: "mb_stand", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内机尺寸", field: "n_size", editable: false, filter: 'set', width: 110,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "替代机型编码", field: "rep_item_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "替代机型描述", field: "rep_item_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
//2、	预测信息
        {
            headerName: "接单年度", field: "order_year", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "接单月度", field: "order_month", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产年度", field: "pro_year", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "生产月度", field: "pro_month", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售年度", field: "sell_year", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "销售月度", field: "sell_month", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "数量", field: "qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, /*{
         headerName: "整机数量", field: "qty", editable: true, filter: 'set', width: 100,
         cellEditor: "整数框",
         enableRowGroup: true,
         enablePivot: true,
         enableValue: true,
         floatCell: true
         },*/

        // 3、	价格信息
        {
            headerName: "价格条款", field: "price_type_name", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            action: $scope.brand_name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "销售价格", field: "sell_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        // 4、	成本信息
        {
            headerName: "佣金比率", field: "commission_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "返利率", field: "rebate_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "免费配件比例", field: "part_rate_byhand", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "广告物料比例", field: "adver_mater_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "信保比率", field: "xb_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_21 = {
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
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_21.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    /******************词汇值****************************/
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
        .then(function (data) {
            $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //LC受益人--回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    /*********************网格处理事件*****************************/
    $scope.save_before = function () {
        delete $scope.data.currItem.sale_year_sell_bud_headers;
        delete $scope.data.currItem.sale_year_sell_pay_lineofsale_year_sell_bud_headers;
        delete $scope.data.currItem.sale_year_sell_cale_itemofsale_year_sell_cale;
        for (var i = 0; i < $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers.length; i++) {
            $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers[i].cool_stand = parseInt($scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers[i].cool_stand);
            $scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers[i].mb_stand = parseInt($scope.data.currItem.sale_year_sell_bud_lineofsale_year_sell_bud_headers[i].mb_stand);
        }
    };
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1
        };
    };
    $scope.initdata();

}

//加载控制器
salemanControllers
    .controller('sale_ys_grant_headerEdit', sale_ys_grant_headerEdit);
