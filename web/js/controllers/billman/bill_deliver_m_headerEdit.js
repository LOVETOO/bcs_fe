var billmanControllers = angular.module('inspinia');
function bill_deliver_m_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    bill_deliver_m_headerEdit = HczyCommon.extend(bill_deliver_m_headerEdit, ctrl_bill_public);
    bill_deliver_m_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_deliver_m_header",
        key: "deliver_m_id",
        wftempid:10123,
        FrmInfo: {},
        grids: [
        {optionname: 'options_11', idname: 'bill_deliver_m_lineofbill_deliver_m_headers'}
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
    /***************************弹出框***********************/
    //Deliver_No
    $scope.Deliver_No = function () {
        $scope.FrmInfo = {
            classid: "bill_deliver_header",
            postdata:{},
            sqlBlock:' h.stat = 5 '
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            BasemanService.RequestPost("bill_deliver_header", "select", {deliver_id: result.deliver_id})
                .then(function (data) {
                    $scope.data.currItem.deliver_no= data.deliver_no;
                        $scope.data.currItem.cust_id= (data.cust_id).toString();
                    $scope.data.currItem.cust_code= data.cust_code;
                    $scope.data.currItem.cust_name= data.cust_name;
                    $scope.data.currItem.currency_id= (data.currency_id).toString();
                    $scope.data.currItem.currency_code= data.currency_code;
                    $scope.data.currItem.currency_name= data.currency_name;
                    $scope.data.currItem.note= data.note;
                    $scope.data.currItem.iv_vbeln= data.iv_vbeln;
                    $scope.data.currItem.pi_no= data.pi_no;

                    $scope.data.currItem.payment_type_id= (data.payment_type_id).toString();
                    $scope.data.currItem.payment_type_code= data.payment_type_code;
                    $scope.data.currItem.payment_type_name= data.payment_type_name;
                    $scope.data.currItem.trade_type= data.trade_type;
                    $scope.data.currItem.sales_code= data.sales_code;
                    $scope.data.currItem.sales_no= data.sales_no;
                    $scope.data.currItem.sales_name= data.sales_name;
                    $scope.data.currItem.price_type_id= (data.price_type_id);
                    $scope.data.currItem.price_type_code= data.price_type_code;
                    $scope.data.currItem.price_type_name= data.price_type_name;
                    $scope.data.currItem.area_id= (data.area_id).toString();
                    $scope.data.currItem.area_code= data.area_code;
                    $scope.data.currItem.area_name= data.area_name;
                    $scope.data.currItem.to_area_id= (data.to_area_id).toString();
                    $scope.data.currItem.to_area_code= data.to_area_code;
                    $scope.data.currItem.to_area_name= data.to_area_name;
                    $scope.data.currItem.ship_date= data.ship_date;
                    $scope.data.currItem.sales_user_id= data.sales_user_id;

                    $scope.options_11.api.setRowData(data.bill_deliver_lineofbill_deliver_headers);
                    $scope.data.currItem.bill_deliver_m_lineofbill_deliver_m_headers=data.bill_deliver_lineofbill_deliver_headers
                });
        });
    };
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
    // 设置数量、计算总数量
    $scope.prod_qty = function () {
        var _this = $(this);
        var val = _this.val();
        var index = $scope.options_11.api.getFocusedCell().rowIndex;
        var nodes = $scope.options_11.api.getModel().rootNode.childrenAfterSort;
        var itemtemp = nodes[index].data;
        itemtemp.sales_price = itemtemp.sales_price ? itemtemp.sales_price : 0;
        itemtemp.amt = parseFloat(val || 0) * parseFloat(itemtemp.sales_price);
        $scope.options_11.api.refreshCells(nodes, ["amt"]);
    };
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
            headerName: "物料编码", field: "item_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        ,{
            headerName: "描述", field: "item_desc", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "物料组2", field: "item_desc2", editable: false, filter: 'set', width: 150,
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
            headerName: "发货单行号", field: "iv_seq", editable: false, filter: 'set', width: 150,
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
            cellchange: $scope.prod_qty,
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
            headerName: "海运费", field: "hy_price", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "保险费", field: "bx_price ", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "佣金/返利", field: "commission_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
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
            headerName: "事业部成本价格", field: "business_price", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
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
            headerName: "客户品牌", field: "cust_brand", editable: false, filter: 'set', width: 120,
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
        },{
            headerName: "成本金额", field: "cost_amt ", editable: false, filter: 'set', width: 100,
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
 /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        if (errorlist.length) {
            BasemanService.notify(notify,errorlist, "alert-danger");
            return false;
        }
        return true;
    };
    /****************************初始化**********************/
    $scope.clearinformation = function () {
        var myDate= new Date();
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            create_time:myDate.toLocaleDateString(),
            bill_deliver_m_lineofbill_deliver_m_headers:[]
        };
    };
    $scope.initdata();
}

//加载控制器
billmanControllers
    .controller('bill_deliver_m_headerEdit', bill_deliver_m_headerEdit);
