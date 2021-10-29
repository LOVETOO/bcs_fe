var billmanControllers = angular.module('inspinia');
function bill_deliver_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_deliver_headerEdit = HczyCommon.extend(bill_deliver_headerEdit, ctrl_bill_public);
    bill_deliver_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_deliver_header",
        key: "deliver_id",
        wftempid:10122,
        FrmInfo: {},
        grids: [
        {optionname: 'options_11', idname: 'bill_deliver_lineofbill_deliver_headers'},
        {optionname: 'options_12', idname: ''},
        ]
    };

    /************************系统词汇**************************/
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
    /**************************显示/隐藏****************************/
    $scope.show_12 = true;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    /***************************弹出框***********************/
    //国家
	 $scope.area_name = function () {
        $scope.FrmInfo = {
            classid: "scparea",
            postdata:{},
            sqlBlock:"areatype = 2"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.areaid=result.areaid;
            $scope.data.currItem.area_name=result.areaname;
        });
    };
    //客户
    $scope.cust_code = function () {
              $scope.FrmInfo = {
                  classid: "customer",
                  postdata:{cust_id:$scope.data.currItem.cust_id}
              };
              BasemanService.open(CommonPopController, $scope)
                  .result.then(function (result) {
                  $scope.data.currItem.cust_id=result.cust_id;
                  $scope.data.currItem.cust_code=result.sap_code;
                  $scope.data.currItem.cust_name=result.cust_name;
              });
          };
    //目的国
	 $scope.to_area_name = function () {
        $scope.FrmInfo = {
            classid: "scparea",
            postdata:{},
            sqlBlock:"areatype = 2"
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.areaid=result.areaid;
            $scope.data.currItem.to_area_name=result.areaname;
        });
    };
    //币种
    $scope.currency_code = function () {
              $scope.FrmInfo = {
                  classid: "base_currency",
                  postdata:{}
              };
              BasemanService.open(CommonPopController, $scope)
                  .result.then(function (result) {
                  $scope.data.currItem.currency_id=result.currency_id;
                  $scope.data.currItem.currency_code=result.currency_code;
                  $scope.data.currItem.currency_name =result.currency_name ;
              });
          };
    //价格条款
    $scope.price_type_name = function () {
              $scope.FrmInfo = {
                  classid: "price_type",
                  postdata:{cust_id:$scope.data.currItem.cust_id},
                  sqlBlock:"usable = 2"
              };
              BasemanService.open(CommonPopController, $scope)
                  .result.then(function (result) {
                  $scope.data.currItem.price_type_id=result.price_type_id;
                  $scope.data.currItem.price_type_code=result.price_type_code;
                  $scope.data.currItem.price_type_name =result.price_type_name ;
              });
          };
    //付款条款
	$scope.payment_type_name = function () {
        if ($scope.data.currItem.cust_id == undefined || $scope.data.currItem.cust_id == "") {
            BasemanService.notice("请先选择客户", "alert-warning")
            return;
        }
        $scope.FrmInfo = {
            title: "付款条款查询",
            thead: [
            {
                name: "付款类型",
                code: "payment_type_code",
				show: true,
                iscond: true,
                type: 'string'

            },{
                name: "付款类型名称",
                code: "payment_type_name",
				show: true,
                iscond: true,
                type: 'string'

            }],
			is_custom_search: true,
			is_high:true,
            classid: "customer",
            postdata:{flag:101,cust_id:$scope.data.currItem.cust_id}
        };
         $scope.FrmInfo.sqlBlock='cust_id='+$scope.data.currItem.cust_id;
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
                  $scope.data.currItem.payment_type_id=result.payment_type_id;
                  $scope.data.currItem.payment_type_code=result.payment_type_code;
                  $scope.data.currItem.payment_type_name =result.payment_type_name;

        });
    };
    /************************网格定义区域**************************/
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
    $scope.columns_11= [
        {
            headerName: "物料编码", field: "item_code", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "描述", field: "item_desc", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "物料组2", field: "item_desc2", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "物料组3", field: "item_desc3", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货单行号", field: "iv_seq", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售单数量", field: "sales_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货数量", field: "prod_qty", editable: true, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售价", field: "sales_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "金额", field: "amt", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "海运费", field: "hy_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "保险费", field: "bx_price", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "佣金/返利", field: "commission_rate", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "空调内部结算价", field: "air_inter_price", editable: true, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "事业部成本价格", field: "business_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "标准成本", field: "std_cl_cb", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户品牌", field: "cust_brand", editable: true, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售收入-USD", field: "sale_usd", editable: true, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "销售收入-CNY", field: "sale_cny", editable: true, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "成本金额", field: "cost_amt", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_11={
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
                var isGrouping = $scope.options_11.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    $scope.columns_12= [
	    {
            headerName: "销售组织", field: "none13", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
	    {
            headerName: "订单类型", field: "none14", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
	    {
            headerName: "分销渠道编码", field: "none15", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "分销渠道", field: "none16", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
	    {
            headerName: "产品组编码", field: "none1", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
	    {
            headerName: "产品组名称", field: "none2", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
	    {
            headerName: "销售单号", field: "sales_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售单项目", field: "none3", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货单号", field: "iv_vbeln", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货单项目", field: "iv_seq", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "创建人", field: "none5", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "销售办事处编码", field: "none6", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售办事处名称", field: "none7", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售组编码", field: "sales_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售组名称", field: "sales_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "合同号", field: "pi_no", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "客户编号", field: "cust_code", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }

        ,{
            headerName: "客户国家", field: "area_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "目的国", field: "to_area_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "付款条款编码", field: "payment_type_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "付款条款名称", field: "payment_type_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "价格条款", field: "price_type_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "物料", field: "item_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "描述", field: "item_desc", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "物料组2", field: "item_desc2", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "物料组3", field: "item_desc3", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "凭证货币", field: "currency_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售单数量", field: "sales_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货数量", field: "prod_qty", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售单位", field: "none8", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售价", field: "sales_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "金额", field: "amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "海运费", field: "hy_price", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "保险费", field: "bx_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "佣金/返利", field: "commission_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "空调内部结算价", field: "air_inter_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "空调内部开票价", field: "none9", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "订单创建日期", field: "none10", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "发货日期", field: "ship_date", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "入库日期", field: "none11", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户品牌", field: "cust_brand", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "标准成本", field: "std_cl_cb", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		
		{
            headerName: "贸易类型", field: "trade_type", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "销售收入-USD", field: "sale_usd", editable: false, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "销售收入-CNY", field: "sale_cny", editable: false, filter: 'set', width: 130,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "成本金额", field: "cost_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "整机数量", field: "none12", editable: false, filter: 'set', width: 100,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_12={
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
                var isGrouping = $scope.options_12.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    //导入
    $scope.importComplete = function () {
        // $scope.active();
        var data = $scope.gridGetData("options_12");
        //校验
        var ErrCust = "";
        var ErrCurrency = "";
        var ErrIv_Vbeln = "";
        var dot = false;
        for (var i = 0; i < data.length; i++) {
            if (data.length == undefined || data.length == 0) {
                continue;
            }
            var postdata = {};
            postdata.cust_code = data[i].cust_code;
            postdata.currency_code = data[i].currency_code;
            postdata.iv_vbeln = data[i].iv_vbeln;
            var requestobj = BasemanService.RequestPostNoWait("bill_deliver_header", "checkcc", postdata);
            if (requestobj.pass) {
                if (requestobj.data.erriv_vbeln != "") {
                    if (ErrIv_Vbeln == "") {
                        ErrIv_Vbeln += (i+1) + " ";
                    } else {
                        ErrIv_Vbeln = ErrIv_Vbeln + (i+1) + " ";
                    }
                    dot = true;
                }
                //数据库中有重复的发货单号，就不用判断客户跟货币
                if (dot) {
                    continue;
                }
                if (requestobj.data.errcust != "") {
                    if (ErrCust != "") {
                        ErrCust += (i+1) + " ";
                    } else {
                        ErrCust = ErrCust + (i+1) + " ";
                    }
                }
                if (requestobj.data.errcurrency != "") {
                    if (ErrCurrency != "") {
                        ErrCurrency += (i+1) + " ";
                    } else {
                        ErrCurrency = ErrCurrency + (i+1) + " ";
                    }
                }
            };
        };
        if (ErrIv_Vbeln != "") {
            BasemanService.notice('明细 ' + ErrIv_Vbeln + ' 行的发货单号已存在之前的单据中，请核对正确后再导入！', "alert-warning");
            return;
        }
        if (ErrIv_Vbeln != "" && ErrCurrency != "") {
            BasemanService.notice('明细 ' + ErrCust + ' 行在客户资料中找不到对应的客户名称' + '明细 ' + ErrCurrency + ' 行在币种资料中找不到对应的货币名称' + '请核对正确后再导入！', "alert-warning");
            return;
        } else if (ErrCust != "") {
            BasemanService.notice('明细 ' + ErrCust + ' 行在客户资料中找不到对应的客户名称' + '请核对正确后再导入！', "alert-warning");
            return;
        } else if (ErrCurrency != "") {
            BasemanService.notice('明细 ' + ErrCurrency + ' 行在币种资料中找不到对应的货币名称' + '请核对正确后再导入！', "alert-warning");
            return;
        }
        //导入数据
        if (data.length == undefined || data.length == 0) {
            return;
        }
		$scope.data.currItem.area_name=data[0].area_name;
		$scope.data.currItem.cust_code=data[0].cust_code;
		$scope.data.currItem.cust_name=data[0].cust_name;
		$scope.data.currItem.iv_vbeln=data[0].iv_vbeln;
		$scope.data.currItem.pi_no=data[0].pi_no;
		$scope.data.currItem.trade_type=data[0].trade_type;
		$scope.data.currItem.price_type_name=data[0].price_type_name;
		$scope.data.currItem.payment_type_name=data[0].payment_type_name;
		$scope.data.currItem.to_area_name=data[0].to_area_name;
		$scope.data.currItem.sales_user_id=data[0].sales_user_id;
		$scope.data.currItem.sales_no=data[0].sales_no;
		$scope.data.currItem.ship_date=data[0].ship_date;
		$scope.data.currItem.sales_name=data[0].sales_name;	
        $scope.data.currItem.currency_code=data[0].currency_code;
        $scope.data.currItem.currency_name=data[0].currency_name;			
		$scope.data.currItem.stat=1;
		
		
		for(var i=0;i<data.length;i++){
        var postdata={};
		postdata.cust_name=data[i].cust_name;
		postdata.cust_code=data[i].cust_code;
		postdata.payment_type_name=data[i].payment_type_name;
		postdata.price_type_name=data[i].price_type_name;
		postdata.area_name=data[i].area_name;
		postdata.pi_no=data[i].pi_no;
		postdata.pi_no=data[i].pi_no;
		postdata.ship_date=data[i].ship_date;
		postdata.sales_user_id=data[i].sales_user_id;
		postdata.trade_type=data[i].trade_type;
		postdata.currency_code=data[i].currency_code;
		postdata.iv_vbeln=data[i].iv_vbeln;
		postdata.iv_seq=data[i].iv_seq;
		postdata.to_area_name=data[i].to_area_name;
		postdata.sales_name=data[i].sales_name;
		postdata.sales_no=data[i].sales_no;
        postdata.bill_deliver_lineofbill_deliver_headers=[data[i]];
        postdata.flag=1;
        request=BasemanService.RequestPostNoWait("bill_deliver_header", "insert",postdata)
        if(request.pass){				
                BasemanService.notice('第'+(i+1)+'行发货明细已导入！', "alert-info");
				$scope.data.currItem.deliver_id=request.data.deliver_id;
				$scope.refresh(2);
           };
        }
    };
 /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    };
    $scope.save_before=function(){
        delete $scope.data.currItem.bill_deliver_line2ofbill_deliver_headers;
    };
    /****************************初始化**********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        if (window.userbean) {
            $scope.userbean = window.userbean;
        };
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time:myDate.toLocaleDateString(),
        };
    };
    $scope.initdata();
}

//加载控制器
billmanControllers
    .controller('bill_deliver_headerEdit', bill_deliver_headerEdit);
