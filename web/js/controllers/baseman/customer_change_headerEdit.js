
function customer_change_headerEdit($scope, $location, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {

    //继承基类方法
    customer_change_headerEdit = HczyCommon.extend(customer_change_headerEdit, ctrl_bill_public);
    customer_change_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_change_header",
        key: "cust_change_id",
        wftempid: 10071,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'customer_change_bankofcustomer_change_headers'},   //银行账号
            {optionname: 'options_21', idname: 'customer_change_relamanofcustomer_change_headers'},//联系人
           
			{
                optionname: 'options_31', idname: 'customer_change_payment_toofcustomer_change_headers',//付款条件
                line: {
                    optionname: "options_32",
                    idname: "customer_change_paytype_toofcustomer_change_payment_tos"
                }
            },
			{
                optionname: 'options_33', idname: 'customer_change_payment_typeofcustomer_change_headers',//付款条件
                line: {
                    optionname: "options_34",
                    idname: "customer_change_paytype_detailofcustomer_change_payment_types"
                }
            },
			{optionname: 'options_41', idname: 'customer_change_brandofcustomer_change_headers'}]//客户品牌
    }
    //界面初始化
    $scope.clearinformation_before = function () {
		//scope.data = {};
		for(name in $scope.data.currItem){
				if(name.indexOf("new_")>-1){
						var id="#"+name;
						$(id).css("background","");
				}
            $scope.data.currItem[name]="";				
		}
    }
    /**--------系统词汇词------*/
	 //状态
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    BasemanService.RequestPostAjax("base_search", "searchcurrency",{}).then(function (data) {
        $scope.base_currencys = data.base_currencys;
    });
	//状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            var object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
	
	//柜型 box_type
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "pay_type"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            var newobj = {
                value: data.dicts[i].dictvalue,
                desc: data.dicts[i].dictname
            }
            //柜型柜量
            $scope.columns_32[1].cellEditorParams.values.push(newobj)
			$scope.columns_34[1].cellEditorParams.values.push(newobj)
        }
    })
	//贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    })
	//客户性质
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_type"}).then(function (data) {
        $scope.cust_types = data.dicts;
    })
	//客户类别
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_sale_type"}).then(function (data) {
        $scope.cust_sale_types = data.dicts;
    })
	//客户等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "credit_rating"}).then(function (data) {
        $scope.credit_ratings = data.dicts;
    })
	//信用等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
    })
	//区域等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "area_level"}).then(function (data) {
        $scope.area_levels = data.dicts;
    })
	//拓张组织
    $scope.zhu_zis = [{
        dictvalue: 1,
        dictname: "家用空调"
    }, {
        dictvalue: 2,
        dictname: "商用空调"
    }]
    $scope.custtypes = [{
        dictvalue: 1,
        dictname: "内销"
    }, {
        dictvalue: 2,
        dictname: "外销"
    }]
    /**--------------*/
    /**----弹出框区域*---------------*/
    //客户查询
	$scope.cust_code =function(){
		$scope.FrmInfo = {
            title: "客户查询",			
            classid: "customer"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
			postdata={};
			postdata.cust_id=parseInt(result.cust_id);
			BasemanService.RequestPost("customer", "select", postdata)
                .then(function (data) {			
			for(name in data){
				if(name !="stat"){
					$scope.data.currItem[name]=data[name];
					if(typeof data[name]=='string'||typeof data[name]=="number"){
						var new_name="";
						new_name="new_"+name;
						$scope.data.currItem[new_name]=$scope.data.currItem[name];
					}
				}
			 }
           	 $scope.data.currItem.note="";	 
             $scope.data.currItem.customer_change_bankofcustomer_change_headers=$scope.data.currItem.customer_bankofcustomers
			 $scope.options_11.api.setRowData($scope.data.currItem.customer_change_bankofcustomer_change_headers);
			 delete $scope.data.currItem.customer_bankofcustomers;
			 $scope.data.currItem.customer_change_relamanofcustomer_change_headers=$scope.data.currItem.customer_relamanofcustomers
			 $scope.options_21.api.setRowData($scope.data.currItem.customer_change_relamanofcustomer_change_headers);
			 delete $scope.data.currItem.customer_relamanofcustomers;
			 $scope.data.currItem.customer_change_brandofcustomer_change_headers=$scope.data.currItem.customer_brandofcustomers
			 $scope.options_41.api.setRowData($scope.data.currItem.customer_change_brandofcustomer_change_headers);
			 delete $scope.data.currItem.customer_brandofcustomers;
			 $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers=$scope.data.currItem.customer_payment_typeofcustomers
			 $scope.options_33.api.setRowData($scope.data.currItem.customer_change_payment_typeofcustomer_change_headers);
			 $scope.data.currItem.customer_change_payment_toofcustomer_change_headers=$scope.data.currItem.customer_payment_typeofcustomers
			 $scope.options_31.api.setRowData($scope.data.currItem.customer_change_payment_toofcustomer_change_headers);
			 delete $scope.data.currItem.customer_payment_typeofcustomers;
			 
			 for(var i=0;i<$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers.length;i++){
	$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].customer_change_paytype_detailofcustomer_change_payment_types=$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].customer_paytype_detailofcustomer_payment_types;
	delete $scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].customer_paytype_detailofcustomer_payment_types;
			 }
			 $scope.options_34.api.setRowData($scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[0].customer_change_paytype_detailofcustomer_change_payment_types)
			  for(var i=0;i<$scope.data.currItem.customer_change_payment_toofcustomer_change_headers.length;i++){
	$scope.data.currItem.customer_change_payment_toofcustomer_change_headers[i].customer_change_paytype_toofcustomer_change_payment_tos=$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[i].customer_change_paytype_detailofcustomer_change_payment_types;
	delete $scope.data.currItem.customer_change_payment_toofcustomer_change_headers[i].customer_paytype_detailofcustomer_payment_types;
			 }
			 $scope.options_32.api.setRowData($scope.data.currItem.customer_change_payment_toofcustomer_change_headers[0].customer_change_paytype_toofcustomer_change_payment_tos)
				})
        })
	}
	
	$scope.refresh_after =function(){
		for(name in $scope.data.currItem){
			if(typeof $scope.data.currItem[name]=='string'||typeof $scope.data.currItem[name]=='number'){
				if(name.indexOf("new_")<0){
					var new_name="new_"+name;
					if($scope.data.currItem[name]!=$scope.data.currItem[new_name]){
						var id="#"+new_name;
						$(id).css("background","red");
						//$(id).css("font-color","red");
					}else{
						var id="#"+new_name;
						$(id).css("background","");
					}
				}				
			}
		}
	}
    //业务部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {
            title: "地区查询",
            thead: [{
                name: "机构编码",
                code: "code",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构名称",
                code: "orgname",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "负责人",
                code: "manager",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "备注",
                code: "note",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "scporg",
            sqlBlock: "( idpath like '%1%') and 1=1 and stat =2 and OrgType = 5",
            searchlist: ["code", "orgname", "manager", "note"],
            backdatas: "orgs"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.new_org_name = result.orgname;
            $scope.data.currItem.new_org_code = result.code;
            $scope.data.currItem.new_org_id = result.orgid;
        })
    };

    $scope.pay_type = function () {
        $scope.FrmInfo = {
            title: "付款条件查询",
            thead: [{
                name: "付款条件编码",
                code: "payment_type_code"
            }, {
                name: "付款条件名称",
                code: "payment_type_name"
            }],
            classid: "payment_type",
            searchlist: ["payment_type_code", "payment_type_name"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
            var nodes = $scope.options_31.api.getModel().rootNode.allLeafChildren;
            var cell = $scope.options_31.api.getFocusedCell();
            nodes[cell.rowIndex].data.payment_type_code = data.payment_type_code;
            nodes[cell.rowIndex].data.payment_type_name = data.payment_type_name;
            nodes[cell.rowIndex].data.payment_type_id = data.payment_type_id;
            $scope.options_31.api.refreshRows(nodes);
        })
    }
	
	$scope.area_code =function(){
		$scope.FrmInfo = {
            title: "国家查询",   
            sqlBlock:" areatype = 2",			
            classid: "scparea",
            searchlist: ["areacode", "areaname", "assistcode", "telzone", "note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.new_area_code = result.areacode;
            $scope.data.currItem.new_area_name = result.areaname;
            $scope.data.currItem.new_area_id = result.areaid;
        })
	}
    $scope.currency_code =function(){
		$scope.FrmInfo = {
            title: "货币查询",			
            classid: "base_currency"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.new_currency_code = result.currency_code;
            $scope.data.currItem.new_currency_name = result.currency_name;
        })
	}
	
	$scope.core_name =function(){
		$scope.FrmInfo = {
			is_custom_search:true,
			thead: [{
                name: "中心名称",
                code: "core_name"
            }],
            title: "中心名称",   
            sqlBlock:" orgtype = 5",			
            classid: "customer_apply_header",
            searchlist: ["core_name"],
			postdata:{flag:3}
        };
		BasemanService.open(CommonPopController, $scope).result.then(function (result) {
			$scope.data.currItem.new_core_name=result.core_name;
		});
	}
    /**--------------*/


    /**------保存校验区域-----*/
    $scope.validate = function () {
		var data=$scope.gridGetData("options_33");
		for(var i=0;i<data.length;i++){
			var sum=0;
			for(var j=0;j<data[i].customer_change_paytype_detailofcustomer_change_payment_types.length;j++){
				sum+=parseFloat(data[i].customer_change_paytype_detailofcustomer_change_payment_types[j].pay_ratio);
			}
			if(sum!=100){
				BasemanService.notice("第"+(i+1)+"行明细付款比例和不为100", "alert-warning");
			    return false;
			}
		    if(data[i].start_date==""||data[i].end_date==""||data[i].start_date==undefined||data[i].end_date==undefined){
				BasemanService.notice("第"+(i+1)+"行有效期起和有效期止不能为空", "alert-warning");
			    return false;
			}
            if(data[i].payment_type_name.indexOf("OA")>-1||data[i].payment_type_name.indexOf("后TT")>-1||
                data[i].payment_type_name.indexOf("LC90")>-1||data[i].payment_type_name.indexOf("LC120")>-1
                ||data[i].payment_type_name.indexOf("LC150")>-1||data[i].payment_type_name.indexOf("LC180")>-1){
                //时间计算 zdm
                var sta_date = new Date(data[i].start_date);
                var end_date = new Date(data[i].end_date);
                var result = (end_date-sta_date)/(1000*3600*24);
                if(parseInt(result)>365){
                    BasemanService.notice("第"+(i+1)+"行OA、后TT、LC>=90天时系统默认有效期为一年，可修改不能超过一年", "alert-warning");
                    return false;
                }
            }
            if(data[i].payment_type_name.indexOf("LC30")>-1||data[i].payment_type_name.indexOf("LC60")>-1){
                var sta_date = new Date(data[i].start_date);
                var end_date = new Date(data[i].end_date);
                var result = (end_date-sta_date)/(1000*3600*24);
                if(parseInt(result)>730){
                    BasemanService.notice("第"+(i+1)+"行LC30、LC60天付款条件系统默认有效期为两年，可修改但不能超过两年", "alert-warning");
                    return false;
                }
            }
			if(data[i].payment_type_name.indexOf("TT")>-1){
				if(parseFloat(data[i].contract_subscrp)==0){
				BasemanService.notice("第"+(i+1)+"行TT默认生产定金率(%)不能为0", "alert-warning");
			    return false;
				}
			}else{
				for(var j=0;j<data[i].customer_change_paytype_detailofcustomer_change_payment_types.length;j++){
				   if(parseFloat(data[i].customer_change_paytype_detailofcustomer_change_payment_types[j].days)==0){
					   BasemanService.notice("不是TT第"+(i+1)+"行回款期限不能为0", "alert-warning");
			           return false;
				   }
			    }
			}			
		}
		var data=$scope.gridGetData("options_11");
		for(var i=0;i<data.length;i++){
			if(parseInt(data[i].is_default)==2){
				$scope.data.currItem.bank_accno=data[i].bank_acco;
				break;
			}
		}
		if(i==data.length){
			BasemanService.notice("银行账号无默认的银行", "alert-warning");
			return false;
		}
		if($scope.data.currItem.new_email.indexOf("@")<0){
			BasemanService.notice("Email需要包含@", "alert-warning");
			return false;
		}
        var errorlist = [];

        if (!$scope.data.currItem.cust_name) {
            errorlist.push("客户名称不能为空");
        }

        if (errorlist.length) {
            BasemanService.notice(errorlist, "alert-warning");
            return false;
        }
        return true;
    }
    /**---------------------*/


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
    //收货信息
    $scope.columns_11 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "银行名称", field: "bank_name", editable: true, filter: 'set', width: 200,
            cellEditor: "弹出框",
		    action:$scope.bank_name11,			
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "银行账号", field: "bank_acco", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, 
		{
            headerName: "是否默认", field: "is_default", editable: true, filter: 'set', width: 100,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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

    //客户销售产品组织
    $scope.columns_21 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "联系人", field: "relaman", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "职务", field: "position", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "电话", field: "tel", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "传真", field: "fax", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "电子邮件", field: "email", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "手机号码", field: "mobile", editable: true, filter: 'set', width: 100,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    
    //网格单击子表切换行(一定要放在定义的对应option前面，否则功能失效)
    $scope.rowClicked31 = function (event) {
        if (event.data) {
            if (event.data.customer_change_paytype_toofcustomer_change_payment_tos== undefined) {
                event.data.customer_change_paytype_toofcustomer_change_payment_tos = [];
            }
            $scope.options_32.api.setRowData(event.data.customer_change_paytype_toofcustomer_change_payment_tos);
        }
    }
	
	$scope.rowClicked33 = function (event) {
        if (event.data) {
            if (event.data.customer_change_paytype_detailofcustomer_change_payment_types == undefined) {
                event.data.customer_change_paytype_detailofcustomer_change_payment_types = [];
            }
            $scope.options_34.api.setRowData(event.data.customer_change_paytype_detailofcustomer_change_payment_types);
        }
    }
    $scope.options_31 = {
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
        rowClicked: $scope.rowClicked31,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_31.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_31 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式方式", field: "payment_type_code", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式名称", field: "payment_type_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "信保比率", field: "insurance_rate", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "默认生产定金率(%)", field: "contract_subscrp", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "出货订金率(%)", field: "shipment_subscrp", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "有效期起", field: "start_date", editable: false, filter: 'set', width: 200,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "有效期止", field: "end_date", editable: false, filter: 'set', width: 200,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

    $scope.options_32 = {
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
            var isGrouping = $scope.options_32.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_32 = [    
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 200,
            cellEditor: "下拉框",
			cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "资金成本率", field: "interest_rate", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "回款期限", field: "days", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款比例(%)", field: "pay_ratio", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
		$scope.options_33 = {
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
        rowClicked: $scope.rowClicked33,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function (params) {
            var isGrouping = $scope.options_33.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_33 = [
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式方式", field: "payment_type_code", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款方式名称", field: "payment_type_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "信保比率", field: "insurance_rate", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "默认生产定金率(%)", field: "contract_subscrp", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "出货订金率(%)", field: "shipment_subscrp", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "有效期起", field: "start_date", editable: true, filter: 'set', width: 200,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "有效期止", field: "end_date", editable: true, filter: 'set', width: 200,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
		$scope.options_34 = {
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
            var isGrouping = $scope.options_34.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_34 = [    
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "付款方式", field: "pay_type", editable: false, filter: 'set', width: 200,
            cellEditor: "下拉框",
			cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "资金成本率", field: "interest_rate", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "回款期限", field: "days", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "付款比例(%)", field: "pay_ratio", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
		$scope.options_41 = {
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
            var isGrouping = $scope.options_41.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_41 = [    
        {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 70,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "品牌名", field: "brand_name", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "品牌注册地", field: "brand_addr", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "品牌有效期", field: "brand_expdate", editable: true, filter: 'set', width: 200,
            cellEditor: "年月日",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

		
    /**-------------*/

    /**------ 对网格操作区域-------*/
    //增加当前行、删除当行前
    $scope.additem = function () {

        var data = [];
        var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_11.api.setRowData(data);
        $scope.data.currItem.customer_apply_bankofcustomer_apply_headers = data;
    };


    $scope.delitem = function () {
        var data = [];
        var rowidx = $scope.options_11.api.getFocusedCell().rowIndex;
        var node = $scope.options_11.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_11.api.setRowData(data);
        $scope.data.currItem.customer_apply_bankofcustomer_apply_headers = data;

    };

    $scope.additem2 = function () {
        //判断最后一行是否为空
        var data = [];
        var node = $scope.options_21.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_21.api.setRowData(data);
        $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers = data;
    };


    $scope.delitem2 = function () {
        var data = [];
        var rowidx = $scope.options_21.api.getFocusedCell().rowIndex;
        var node = $scope.options_21.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_21.api.setRowData(data);
        $scope.data.currItem.customer_apply_relamanofcustomer_apply_headers = data;

    };

    $scope.additem3 = function () {
		$scope.FrmInfo = {          
            classid: "payment_type",			
            searchlist: ["payment_type_code", "payment_type_name", "start_date", "end_date"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var data =$scope.gridGetData("options_33");
            if(result.payment_type_name.indexOf("LC30")>-1||result.payment_type_name.indexOf("LC60")>-1){
                result.end_date=moment().add('year',2).format('YYYY-MM-DD');
            }
            else {result.end_date=moment().add('year',1).format('YYYY-MM-DD');}

            result.start_date=moment().format('YYYY-MM-DD HH:mm:ss');
			data.push(result);
			$scope.options_33.api.setRowData(data);
			$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers=data;
			var postdata={};
			postdata.payment_type_id=result.payment_type_id;
			postdata.payment_type_name=result.payment_type_name;
			postdata.payment_type_code=result.payment_type_code;				
			BasemanService.RequestPost("payment_type", "select",postdata)
			.then(function (re) {
				var length=$scope.options_33.api.getModel().rootNode.allLeafChildren.length;
				$scope.data.currItem.customer_change_payment_typeofcustomer_change_headers[length-1].customer_change_paytype_detailofcustomer_change_payment_types=re.payment_type_lineofpayment_types;
				var colKey= $scope.options_33.api.getFocusedCell().column.colId
		        $scope.options_33.api.setFocusedCell(length-1,colKey);
				$scope.options_34.api.setRowData(re.payment_type_lineofpayment_types);
			})
        })
    };

    $scope.delitem3 = function () {
		var data = [];
        var rowidx = $scope.options_33.api.getFocusedCell().rowIndex;
        var node = $scope.options_33.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
					
			data.splice(rowidx, 1);
            $scope.options_33.api.setRowData(data);
		if(rowidx>0){
			var rowidx=rowidx-1;
			var colKey= $scope.options_33.api.getFocusedCell().column.colId
		    $scope.options_33.api.setFocusedCell(rowidx,colKey);
			$scope.options_34.api.setRowData($scope.data.currItem["customer_change_payment_typeofcustomer_change_headers"][rowidx]["customer_change_paytype_detailofcustomer_change_payment_types"]);
		}else{
			if(data.length>0){
			var colKey= $scope.options_33.api.getFocusedCell().column.colId
		    $scope.options_33.api.setFocusedCell(rowidx,colKey);
			$scope.options_34.api.setRowData($scope.data.currItem["customer_change_payment_typeofcustomer_change_headers"][rowidx+1]["customer_change_paytype_detailofcustomer_change_payment_types"]);
			}else{
			$scope.options_34.api.setRowData([]);	
			}
		}
    };

    $scope.additem4 = function () {
        //判断最后一行是否为空
        var data = [];
        var node = $scope.options_34.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_34.api.setRowData(data);

    };


    $scope.delitem4 = function () {
        var data = [];
        var rowidx = $scope.options_34.api.getFocusedCell().rowIndex;
        var node = $scope.options_34.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_34.api.setRowData(data);
    };
	
	$scope.additem41 =function(){
		var data=$scope.gridGetData("options_41");
		data.push({seq:data.length+1});
		$scope.data.currItem.customer_apply_brandofcustomer_apply_headers=data;
		$scope.options_41.api.setRowData(data);
	};
	$scope.delitem41 = function () {
        var data = [];
        var rowidx = $scope.options_41.api.getFocusedCell().rowIndex;
        var node = $scope.options_41.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_41.api.setRowData(data);

    };
	
	$scope.confirm1 =function(){
		var data=$scope.gridGetData("options_51");
		data[0].oa_amount=parseFloat(data[0].oa_amount)+parseFloat($scope.oa);
		$scope.options_51.api.setRowData(data);
		$scope.oa=0;
	}
	
	$scope.confirm2 =function(){
		var data=$scope.gridGetData("options_51");
		data[0].oa_canuse=parseFloat(data[0].oa_canuse)+parseFloat($scope.can_oa);
		$scope.options_51.api.setRowData(data);
		$scope.can_oa=0;
		
		
	}
    /**----------------------*/

        //数据缓存
    $scope.initdata();

};


angular.module('inspinia')
    .controller('customer_change_headerEdit', customer_change_headerEdit)

