var basemanControllers = angular.module('inspinia');
function sale_prod_header_amtsearch($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_prod_header_amtsearch = HczyCommon.extend(sale_prod_header_amtsearch, ctrl_bill_public);
    sale_prod_header_amtsearch.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
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
		//and prod_time >= to_date(' + QuotedStr(bedtStartDate.Text) + ',' + QuotedStr('yyyy-mm-dd') + ')';
		if(date1>date2){
			 BasemanService.notice("起始日期不能大于截止日期", "alert-warning");
	            return;
		}
		 var sqlBlock2=" and 1 = 1";
		 var sqlBlock=" and 1 = 1";
		 var a=1;
        if($scope.data.currItem.is_lead==2){
            sqlBlock+= " and Is_Lead = 2 ";


        }
        if($scope.data.currItem.is_item_order==2){
            if(date1!="" && date1!=undefined){
                sqlBlock2+= " and prod_time >= to_date("+"'"+date1+"'"+",'yyyy-mm-dd') ";
                a=0;
            }
            if(date2!="" && date2!=undefined){
                sqlBlock2+= " and prod_time <= to_date("+"'"+date2+"'"+",'yyyy-mm-dd') ";
                a=0;
            }
            if(a==0){
                sqlBlock+=" and exists (select 1 from ("
                    +" select ph.prod_id from sale_prod_header ph,sale_prod_h_line hl"
                    +" where ph.new_prod=2 and ph.stat>1"
                    +" and ph.prod_id=hl.prod_id"
                    +sqlBlock2
                    +" ) m where m.prod_id=h.prod_id) ";
            }

        }
        else if($scope.data.currItem.deliver_date==2){
            if(date1!="" && date1!=undefined){
                sqlBlock2+= " and Deliver_Date >= to_date("+"'"+date1+"'"+",'yyyy-mm-dd') ";
                a=0;
            }
            if(date2!="" && date2!=undefined){
                sqlBlock2+= " and Deliver_Date <= to_date("+"'"+date2+"'"+",'yyyy-mm-dd') ";
                a=0;
            }
            if(a==0){
                sqlBlock+=" and exists (select 1 from ("
                    +" select ph.prod_id from sale_prod_header ph,sale_prod_h_line hl"
                    +" where ph.new_prod=2 and ph.stat>1"
                    +" and ph.prod_id=hl.prod_id"
                    +sqlBlock2
                    +" ) m where m.prod_id=h.prod_id) ";
            }
        }
       else if($scope.data.currItem.notice_time==2){
            if(date1!="" && date1!=undefined){
                sqlBlock2+= " and check_time >= to_date("+"'"+date1+"'"+",'yyyy-mm-dd') ";

            }
            if(date2!="" && date2!=undefined){
                sqlBlock2+= " and check_time <= to_date("+"'"+date2+"'"+",'yyyy-mm-dd') ";

            }

        }

		//BasemanService.getSqlWhereBlock(sqlBlock);//area_code传的是orgid
		var postdata = { flag:107,
	            sqlwhere: sqlBlock,
				pi_no: $scope.data.currItem.pi_no,
   inspection_batchno: $scope.data.currItem.inspection_batchno,
            area_code: $scope.data.currItem.area_codea,
			  cust_id: $scope.data.currItem.cust_id,
				start_date : $scope.data.currItem.startdate,
				end_date : $scope.data.currItem.enddate
	      
	        };
	 var data=$scope.data.currItem.sale_prod_headers;
	 BasemanService.RequestPost("sale_prod_header", "search", postdata)
	        .then(function(data){
	        	$scope.data.currItem.sale_prod_headers=data.sale_prod_headers;
	             $scope.options_13.api.setRowData(data.sale_prod_headers);
	        });
	}



    /***************************弹出框***********************/
	 $scope.selectarea = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "CpcOrg.Stat =2 and OrgType in (3) ",
            backdatas: "orgs",
            // type: "checkbox"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg").result.then(function (result) {
			console.log(result);
            $scope.data.currItem.area_name = result.orgname;
			  $scope.data.currItem.area_code = result.code;
            $scope.data.currItem.area_codea = result.orgid;
            $scope.data.currItem.areaid = result.orgid;
        })
    };
	    //业务部门
    $scope.changeAreaName = function () {

        $scope.data.currItem.org_name = "";
        $scope.data.currItem.org_id = "";
    };
    //客户
    $scope.change_customer = function () {

        $scope.data.currItem.cust_name = "";
        $scope.data.currItem.cust_id = "";
    };
    //大区
    $scope.changeAreaCode = function () {
        $scope.data.currItem.area_name = "";
        $scope.data.currItem.area_codea="";
      
        $scope.data.currItem.areaid = "";
    };
	 $scope.cheked2 = function () {
        if ($scope.data.currItem.deliver_date) {
            $scope.data.currItem.is_item_order = false;
            $scope.data.currItem.time_flag = 2;
        }
    }
    $scope.cheked = function () {
        if ($scope.data.currItem.is_item_order) {
            $scope.data.currItem.deliver_date = false;
            $scope.data.currItem.time_flag = 1;
        } else {
            $scope.data.currItem.time_flag = 2;
        }
    }
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
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
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
            headerName: "到款PI分配单号", field: "creator", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "分配时间", field: "create_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "TT定金分配金额", field: "amt2", editable: false, filter: 'set', width: 150,
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
            headerName: "信用证用于分配单号", field: "updator", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "分配时间", field: "update_time", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "LC分配金额", field: "amt8", editable: false, filter: 'set', width: 150,
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
    .controller('sale_prod_header_amtsearch', sale_prod_header_amtsearch);
