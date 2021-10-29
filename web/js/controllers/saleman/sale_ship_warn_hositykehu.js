var basemanControllers = angular.module('inspinia');
function sale_ship_warn_hositykehu($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_ship_warn_hositykehu = HczyCommon.extend(sale_ship_warn_hositykehu, ctrl_bill_public);
    sale_ship_warn_hositykehu.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_receive_header",
       /* key: "out_id",*/
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'customer_receive_headers'}]
    };

//下拉框   贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.sale_ent_types = data.dicts;
    })

    //查询条件清空
    $scope.clear_org = function () {
        $scope.data.currItem.org_id="";
        $scope.data.currItem.org_code="";
        $scope.data.currItem.org_name="";

    }
    $scope.clear_cust = function () {
        $scope.data.currItem.cust_id="";
        $scope.data.currItem.cust_code="";
        $scope.data.currItem.cust_name="";

    }
//查询
$scope.search = function () {
	var date1=$scope.data.currItem.startdate;


	sqlBlock="1=1";
	if($scope.data.currItem.org_id>0){
		sqlBlock+=" and h.org_id=" + $scope.data.currItem.org_id;
	}
	if($scope.data.currItem.cust_id>0){
		sqlBlock+=" and h.cust_id=" + $scope.data.currItem.cust_id;
	}
	if($scope.data.currItem.receive_no!="" && $scope.data.currItem.receive_no!=undefined){
		sqlBlock+=" and h.receive_no like '%" + $scope.data.currItem.receive_no +"%' ";
	}
	if($scope.data.currItem.record_no!=""&& $scope.data.currItem.record_no!=undefined){
		sqlBlock+=" and v.record_no like '%" + $scope.data.currItem.record_no +"%' ";
	}
	if($scope.data.currItem.uom!=""&& $scope.data.currItem.uom!=undefined){
		sqlBlock+=" and h.Uom like '%" + $scope.data.currItem.uom +"%' ";
	}
	if(date1!=undefined && date1!=""){
	sqlBlock+=" and to_char(h.Receive_Time,'yyyy-mm-dd')='" + date1+ "'";
	}
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:1,
            sqlwhere: sqlBlock,
           
        };
 BasemanService.RequestPost("customer_receive_header", "search", postdata)
        .then(function(data){
			console.log(data);
			 $scope.data.currItem.customer_receive_headers=data.customer_receive_headers;
             $scope.options_13.api.setRowData(data.customer_receive_headers);
        });
}


    /***************************弹出框***********************/
	$scope.select = function () {
        $scope.FrmInfo = {
			
            classid: "scporg",
	        postdata:{},
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });
    }
	
	$scope.select2 = function () {
       if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选业务部门", "alert-warning");
            return;
			}

		 $scope.FrmInfo = {
			title: "客户",
			thead: [
				{
				name: "客户编码",
                code: "cust_code",
				 show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "SAP编码",
                code: "sap_code",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户名称",
                code: "cust_name",
				show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "客户描述",
                code: "cust_desc",
				show: true,
                iscond: true,
                type: 'string'
            }],
			is_custom_search:true,
			is_high:true,
            classid: "customer",
            sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.sap_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
	
	$scope.select3 = function () {
        $scope.FrmInfo = {
			
            classid: "customer_receive_header",
	        postdata:{},
/*			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
            backdatas: "customer_receive_headers",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			$scope.data.currItem.org_id = result.orgid;
			 $scope.data.currItem.org_code = result.code;   
			 $scope.data.currItem.org_name = result.orgname			
        });
    }
	

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
$scope.columns_13 = [
        {
            headerName: "接待单号", field: "receive_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "部门编码", field: "org_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
                headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 100,
                cellEditor: "文本框",
               
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                floatCell: true
        },{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
		
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
         
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "来访日期", field: "receive_time", editable: false, filter: 'set', width: 150,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
                values: [{value: 1, desc: '制单'},{value: 2, desc: '提交'}, {value: 3, desc: '启动'},
                    {value: 4, desc: '驳回'},{value: 5, desc: '审核'},{value: 6, desc: '关闭'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "来客单位", field: "uom", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "采购规模", field: "scal", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "费用预计", field: "total_money", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户拜访记录单号", field: "record_no", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "客户拜访记录状态", field: "record_stat", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
            cellEditorParams: {
            values: [{value: 1, desc: '制单'},{value: 2, desc: '提交'}, {value: 3, desc: '启动'},
                {value: 4, desc: '驳回'},{value: 5, desc: '审核'},{value: 6, desc: '关闭'}]
            },
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_13 = {
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
                var isGrouping = $scope.options_13.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    $scope.initdata();
	}

//加载控制器
basemanControllers
    .controller('sale_ship_warn_hositykehu', sale_ship_warn_hositykehu);
