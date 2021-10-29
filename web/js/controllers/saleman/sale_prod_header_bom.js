var basemanControllers = angular.module('inspinia');
function sale_prod_header_bom($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_header_bom = HczyCommon.extend(sale_prod_header_bom, ctrl_bill_public);
    sale_prod_header_bom.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_prod_header",
       // key: "out_id",
      //  wftempid:10125,
        FrmInfo: {},
        grids: [{optionname: 'options_13', idname: 'sale_prod_headers'}]
    };



	//查询
	$scope.search = function () {
		var date1=$scope.data.currItem.startdate;
		var date2=$scope.data.currItem.enddate;
		var sqlBlock="";
		if(date1>date2){
			 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
	            return;
		}
		sqlBlock="1=1";
        if($scope.data.currItem.is_lead){
            sqlBlock+="and Is_Lead = 2 ";
        }
        if($scope.data.currItem.is_item_order){
            sqlBlock+=" and Is_Item_Order = 1 ";
        }

        if ($scope.data.currItem.deliver_date==3) {
            if (date1 != undefined && date1 != "") {
                sqlBlock += "and Deliver_Date >= to_date('" + date1 + "', 'yyyy-mm-dd')";
            }
            if(date2!=undefined && date2!=""){
                sqlBlock += "and Deliver_Date <= to_date('" + date2 + "', 'yyyy-mm-dd')";
            }
        }
        if ($scope.data.currItem.notice_time==2) {
            if (date1 != undefined && date1 != "") {
                sqlBlock+=" and prod_time >= to_date('" + date1
                    + "','yyyy-mm-dd')";
            }
            if(date2!=undefined && date2!=""){
                sqlBlock+="and prod_time <= to_date('" + date2+ "','yyyy-mm-dd')";
            }
        }
		if($scope.data.currItem.pi_no!="" && $scope.data.currItem.pi_no!=undefined){
		sqlBlock+=" and pi_no like '%" + $scope.data.currItem.pi_no +"%' ";
	    }
	   if($scope.data.currItem.inspection_batchno!="" && $scope.data.currItem.inspection_batchno!=undefined){
		sqlBlock+=" and Inspection_BatchNo like '%" + $scope.data.currItem.inspection_batchno +"%' ";
	    }
		if($scope.data.currItem.cust_id!="" && $scope.data.currItem.cust_id!=undefined){
		sqlBlock+=" and cust_id=" + $scope.data.currItem.cust_id;
	   }


	 	//BasemanService.getSqlWhereBlock(sqlBlock);
		var postdata = { flag:106,
	            sqlwhere  : sqlBlock,
//				cust_code: $scope.data.currItem.cust_code,
//				sale_ent_type: $scope.data.currItem.sale_ent_type,
//				org_id: $scope.data.currItem.org_id
	      
	        };
	 var data=$scope.data.currItem.sale_prod_headers;
	 BasemanService.RequestPost("sale_prod_header", "search", postdata)
	        .then(function(data){
	        	$scope.data.currItem.sale_prod_headers=data.sale_prod_headers;
	             $scope.options_13.api.setRowData(data.sale_prod_headers);
	        });
	}



    /***************************弹出框***********************/
	
	$scope.selectcust = function () {

		
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
            //sqlBlock: "org_id = " + $scope.data.currItem.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			
			 $scope.data.currItem.cust_code = result.sap_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
	 $scope.cheked2 = function () {
        if ($scope.data.currItem.deliver_date) {
            $scope.data.currItem.notice_time = false;
            $scope.data.currItem.time_flag = 2;
        }else
            $scope.data.currItem.time_flag = 3;
    }
    $scope.cheked = function () {
        if ($scope.data.currItem.notice_time) {
            $scope.data.currItem.deliver_date = false;
            $scope.data.currItem.time_flag = 1;
        } else {
            $scope.data.currItem.time_flag = 4;
        }
    }
//客户
    $scope.change_customer = function () {
      
        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
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
	$scope.columns_13 = [
        {
            headerName: "PI号", field: "pi_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商检批号", field: "inspection_batchno", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "业务员", field: "sales_user_id", editable: false, filter: 'set', width: 100,
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
            headerName: "付款方式", field: "payment_type_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "TT生产定金率（%）", field: "contract_subscrp", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "TT所需生产定金", field: "amt1", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "TT定金到款金额", field: "amt2", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "LC比例（%）", field: "lc_rate", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
           
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "LC本单所需金额", field: "amt9", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "LC到达金额", field: "amt8", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "生产定金情况", field: "updator", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "OA可用额度", field: "amt4", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "OA本单耗用额度", field: "amt7", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "数量", field: "total_prod_qty", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "下单日期", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "要求交货日期", field: "deliver_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "生产通知时间", field: "prod_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "预计出货日期", field: "pre_ship_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "定金到款日期", field: "section_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "是否特批订单", field: "is_lead", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "是否备料订单", field: "is_item_order", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "流程备案时间", field: "check_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "BOM是否完整", field: "is_complete", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "BOM补齐提交时间", field: "update_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "BOM补充时间", field: "check_time_m", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "实际补充周期（天）", field: "reality_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "提醒周期", field: "remind_cycle", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "定金所需金额", field: "prod_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
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
         //数据缓存
        $scope.initdata();
	}

//加载控制器
basemanControllers
    .controller('sale_prod_header_bom', sale_prod_header_bom);
