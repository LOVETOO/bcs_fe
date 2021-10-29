var finmanControllers = angular.module('inspinia');
function sale_list_syfingenlt($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_list_syfingenlt = HczyCommon.extend(sale_list_syfingenlt, ctrl_bill_public);
    sale_list_syfingenlt.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "bill_invoice_header",
   /*     key: "funds_id",*/
        wftempid: 10008,
        FrmInfo: {
            sqlBlock: "funds_type=2",
        },
        grids: [{optionname: 'options_11', idname: 'bill_invoice_headers'}/*, {
            optionname: 'options_12',
            idname: 'fin_funds_kind_lineoffin_funds_headers'
        }, {optionname: 'options_13', idname: 'fin_funds_xypmoffin_funds_headers'}, {
            optionname: 'options_14',
            idname: 'fin_funds_sapoffin_funds_headers'
        }*/]
    };
    
    //下拉
	$scope.is_part_shipmentas = [{
        	id:1,
        	name:"制单",
        },{
        	id:2,
        	name:"启动",
        },{
        	id:3,
        	name:"已审核",
        }]
     $scope.is_part_shipmentsy = [{
        	id:1,
        	name:"是",
        },{
        	id:2,
        	name:"否",
        }]
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stat = data.dicts;
    })
    
    /*查询*/
   $scope.search = function () {
	var date1=$scope.data.currItem.startdate;
	var date2=$scope.data.currItem.enddate;
	var date3=$scope.data.currItem.startdatet;
	sqlBlock="1=1";
	if(date1!=undefined && date1!=""){
	sqlBlock+=" and trunc(check_time,'dd')>=to_Date('" + date1+ "','YYYY-MM-DD')";
	}
	
	if(date2!=undefined && date2!=""){
	sqlBlock+=" and trunc(check_time,'dd')<=to_Date('" + date2+ "','YYYY-MM-DD')";
	}
	if(date3!=undefined && date3!=""){
	     date2=date3;
	}
	if(date1!=undefined && date1!="" && date2!=undefined && date2!="" && $scope.data.currItem.time_flag ==2){
		sqlBlock+=" and trunc(check_time,'dd')>=to_Date('" + date1+ "','YYYY-MM-DD')";
		sqlBlock+=" and trunc(check_time,'dd')<=to_Date('" + date2+ "','YYYY-MM-DD')";
		
	}
	if(date1!=undefined && date1!="" && date2!=undefined && date2!="" && $scope.data.currItem.time_flag ==1){
		sqlBlock+=" and trunc(fpjz_date,'dd')>=to_Date('" + date1+ "','YYYY-MM-DD')";
		sqlBlock+=" and trunc(fpjz_date,'dd')<=to_Date('" + date2+ "','YYYY-MM-DD')";
		
	}
	if(date1!=undefined && date1!="" && date2!=undefined && date2!="" && $scope.data.currItem.time_flag ==3){
		sqlBlock+=" and trunc(Actual_Ship_Date,'dd')>=to_Date('" + date1+ "','YYYY-MM-DD')";
		sqlBlock+=" and trunc(Actual_Ship_Date,'dd')<=to_Date('" + date2+ "','YYYY-MM-DD')";
		
	}
	if($scope.data.currItem.is_part_shipmenty==1){
		sqlBlock+=" and exists (select 1 from fin_tddf_header t where t.invoice_id=bill_invoice_header.invoice_id "
                + " and t.stat =5 and ci_code is not null)" ;
	}
	if($scope.data.currItem.is_part_shipmenty==2){
		sqlBlock+=" and not exists (select 1 from fin_tddf_header t where t.invoice_id=bill_invoice_header.invoice_id "
                + " and t.stat =5 and ci_code is not null)" ;
	}
	
	if($scope.data.currItem.cust_id>0){
		sqlBlock+=" and Cust_Id like '%"+ $scope.data.currItem.cust_id+"%'";
	}
	if($scope.data.currItem.org_id>0){
		sqlBlock+=" and Org_Id=" + $scope.data.currItem.org_id;
	}
	if($scope.data.currItem.is_part_shipment==1){
		sqlBlock+=" and stat=1";
	}
	if($scope.data.currItem.is_part_shipment==2){
		sqlBlock+=" and stat=3";
	}
	if($scope.data.currItem.is_part_shipment==3){
		sqlBlock+=" and stat=5";
	}
	/*if($scope.data.currItem.sales_user_id!="" && $scope.data.currItem.sales_user_id!=undefined){
		sqlBlock+=" and Sales_User_Id= " + $scope.data.currItem.sales_user_id ;
	}*/
	if($scope.data.currItem.sales_user_id!="" && $scope.data.currItem.sales_user_id!=undefined){
		sqlBlock+=" and Sales_User_Id like '%" + $scope.data.currItem.sales_user_id +"%' ";
	}
	
	//BasemanService.getSqlWhereBlock(sqlBlock);
	var postdata = { flag:20,
            sqlwhere: sqlBlock,
            org_code: $scope.data.currItem.org_code,
			number: $scope.data.currItem.cust_namez,
            org_name: $scope.data.currItem.org_name,
		  invoice_no: $scope.data.currItem.invoice_no,
			   pi_no: $scope.data.currItem.pi_no,
			startdate: $scope.data.currItem.startdate,
			enddate: $scope.data.currItem.enddate
        };
 BasemanService.RequestPost("bill_invoice_header", "search", postdata)
        .then(function(data){
            $scope.data.currItem.bill_invoice_headers=data.bill_invoice_headers;
             $scope.options_11.api.setRowData(data.bill_invoice_headers);
        });
}

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
	
	 $scope.cheked2 = function () {
        if ($scope.data.currItem.notice_time) {
            $scope.data.currItem.check_time1 = false;
			$scope.data.currItem.check_time = false;
            $scope.data.currItem.time_flag = 2;
        }
    }
	$scope.cheked3 = function () {
        if ($scope.data.currItem.check_time1) {
            $scope.data.currItem.notice_time = false;
			$scope.data.currItem.check_time = false;
            $scope.data.currItem.time_flag =3;
        }
    }
    $scope.cheked = function () {
        if ($scope.data.currItem.check_time) {
            $scope.data.currItem.notice_time = false;
			$scope.data.currItem.check_time1 = false;
            $scope.data.currItem.time_flag = 1;
        } 
    }
 $scope.invoice_no = function () {
        $scope.FrmInfo = {
            classid: "bill_invoice_header",
            sqlBlock: " stat=5"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.invoice_no = result.invoice_no;
            $scope.data.currItem.invoice_id = result.invoice_id;
        })
    }
   /* $scope.cust_code = function () {
        $scope.FrmInfo = {
            classid: "customer"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.cust_code = result.cust_code;
            $scope.data.currItem.cust_name = result.cust_name;
            $scope.data.currItem.cust_id = result.custid;
        })
    }*/
	//PI号
	$scope.selectcust2 = function () {
        $scope.FrmInfo = {
			
            classid: "sale_prod_header",
	        postdata:{},
		/*	sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",*/
/*            backdatas: "sale_prod_header_frminfos",*/
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.pi_no = result.pi_no		
        });
    }
   //业务员查询
    $scope.scpuser = function () {
    
        $scope.FrmInfo = {
            classid: "scpuser",
            postdata: {
                flag: 10
            },
            backdatas: "users",
			//sqlBlock:" scporguser.orgid ="+parseInt($scope.data.currItem.org_id||0)
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.sales_user_id = result.userid;
        });
    }
   $scope.selectcode = function () {
	  

		 $scope.FrmInfo = {
			classid: "scporg",
			postdata:{},
            backdatas:"orgs",
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)"
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			 $scope.data.currItem.org_code = result.code;
			 $scope.data.currItem.org_name = result.orgname;
			 $scope.data.currItem.org_id = result.orgid;
        });

    }
	
   
   
   $scope.selectcust = function () {
    var sqlwhere="";
	    if($scope.data.currItem.org_id!="" && $scope.data.currItem.org_id!=undefined){
		   sqlwhere+="org_id = " + $scope.data.currItem.org_id;
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
            sqlBlock: sqlwhere
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			 $scope.data.currItem.cust_code = result.cust_code;
			 $scope.data.currItem.cust_name = result.cust_name;
			 $scope.data.currItem.cust_id = result.cust_id;
        });

    }
    /**********************隐藏、显示*************************/
    $scope.show_11 = false;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
    $scope.show_12 = false;
    $scope.show12 = function () {
        $scope.show_12 = !$scope.show_12;
    };
    $scope.show_13 = false;
    $scope.show13 = function () {
        $scope.show_13 = !$scope.show_13;
    };
    //隐藏区域
    $scope.show_11 = false;
    $scope.show_sap = function () {
        $scope.show_11 = !$scope.show_11;
    };
   
    /**-------网格定义区域 ------*/
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
    //单据明细
    $scope.columns_11 = [
        {
            headerName: "实际发票号", field: "fact_invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
/*            cellEditorParams: {
                values: [{value: "1", desc: "空调组织"}]
            },*/
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "商业发票号", field: "invoice_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "状态", field: "stat", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
			cellEditorParams: {values:[{value:1,desc:"制单"},{value:3,desc:"启动"},{value:5,desc:"已审核"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "发货通知单号", field: "notice_nos", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "形式发票单号", field: "pi_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "信用证号", field: "lc_no", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "业务部门", field: "org_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "是否投保", field: "is_tb", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
			cellEditorParams: {values:[{value:1,desc:"否"},{value:2,desc:"是"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "买方代码", field: "ci_code", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "投保发票号", field: "ci_invoiceno", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
			
        },{
            headerName: "投保金额", field: "ci_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "装船日期", field: "ship_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
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
            headerName: "销售公司", field: "sale_ent_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "会计期间", field: "dname", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "发票记账日期", field: "fpjz_date", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "货币编码", field: "currency_code", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "付款方式名称", field: "payment_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "汇率", field: "exchange_rate", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "最后装柜日期", field: "last_out_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "实际金额", field: "invoice_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "发货总金额", field: "send_amt", editable: false, filter: 'set', width: 130,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "到款总金额", field: "return_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "发票总金额", field: "fxzje", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "已核销金额", field: "tt_check_amt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "非TT金额", field: "nottamt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "回款总金额", field: "hkzje", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "预计收款日期", field: "pre_return_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "实际收款日期", field: "actual_return_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "制单人", field: "creator", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "制单时间", field: "create_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "审核时间", field: "check_time", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "实际出货日期", field: "actual_ship_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "运输方式", field: "ship_type", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "提单日期", field: "td_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "交单行", field: "jd_bank", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "交单人", field: "jd_man", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "交单时间", field: "jd_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "议付日期", field: "yf_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "交单行不符点", field: "jd_note", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "价格条款", field: "price_type_name", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "开证行不符点", field: "kzh_bfd", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "承兑日期", field: "cd_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "回款日期", field: "hk_date", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "文件归档信息", field: "file_place", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "条款", field: "clause", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "国内扣费", field: "guonei_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "国外扣费", field: "guowai_fee", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "合同号", field: "pino_new", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		},{
            headerName: "交单总金额", field: "jd_totalamt", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
		
		}];
    $scope.options_11 = {
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
    //产品部信息
    $scope.columns_12 = [
       ];
    $scope.options_12 = {
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
   
    $scope.initdata();
}

//加载控制器
finmanControllers
    .controller('sale_list_syfingenlt', sale_list_syfingenlt);
