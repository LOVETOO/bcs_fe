'use strict';
function customerEdit($scope, $location, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {

    //继承基类方法
    customerEdit = HczyCommon.extend(customerEdit, ctrl_bill_public);
    customerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer",
        key: "cust_id",
        wftempid: 10003,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'customer_bankofcustomers'},   //银行账号
            {optionname: 'options_21', idname: 'customer_relamanofcustomers'},//联系人
            {
                optionname: 'options_31', idname: 'customer_payment_typeofcustomers',//付款条件
                line: {
                    optionname: "options_32",
                    idname: "customer_paytype_detailofcustomer_payment_types"
                }
            },
			{optionname: 'options_41', idname: 'customer_brandofcustomers'},//客户品牌
			{optionname: 'options_51', idname: 'customer_oa_lineofcustomers'}, //额度
			{optionname: 'options_61', idname: ' customer_quotaapply_lineofcustomers'}, //信保限度
			{optionname: 'options_71', idname: 'customer_visit_lineofcustomers'}] //客户记录
    }
    //界面初始化
    $scope.clearinformation = function () {
		$scope.data = {};
		$scope.data.currItem = {
		};
    }
    /**--------系统词汇词------*/
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
	//客户等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "credit_rating"}).then(function (data) {
        $scope.credit_ratings = data.dicts;
    })
	//客户类别
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_sale_type"}).then(function (data) {
        $scope.cust_sale_types = data.dicts;
    })
	//信用等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
    })
	//区域等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "area_level"}).then(function (data) {
        $scope.area_levels = data.dicts;
    })
	if (window.userbean) {
        $scope.userbean = window.userbean;
    }
	$scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
	var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;
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
        dictname: "外销客户"
    }, {
        dictvalue: 2,
        dictname: "内销客户"
    }]
    /**--------------*/
    /**----弹出框区域*---------------*/
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
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_id = result.orgid;
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
	
	$scope.bank_code =function(){
		$scope.FrmInfo = {
            title: "银行查询",           
            classid: "bank",
			
            searchlist: ["bank_code", "bank_name", "account_no", "sap_account", "note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bank_code = result.bank_code;
            $scope.data.currItem.bank_name = result.bank_name;
            $scope.data.currItem.bank_id = result.bank_id;
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
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.areaname;
            $scope.data.currItem.area_id = result.areaid;
        })
	}
	
	$scope.bumen =function(){
		$scope.FrmInfo = {
            title: "拓展部门查询",   
            sqlBlock:" ",			
            classid: "scporg",
			backdatas: "orgs",
            searchlist: ["code", "orgname", "manager", "note"],
        };
		if($scope.data.currItem.zhu_zi==1){
			$scope.FrmInfo.sqlBlock=" OrgType = 5 and superid<>223"
		}else{
			$scope.FrmInfo.sqlBlock=" OrgType = 5 and superid=223"
		}
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.bumen = result.orgname;
        })
	}
	
	$scope.other_org_codes =function(){
		$scope.FrmInfo = {
			type:"checkbox",
            title: "拓展部门查询",   
            sqlBlock:" orgtype = 5",			
            classid: "scporg",
			backdatas: "orgs",
            searchlist: ["code", "orgname", "manager", "note"]
        };
		BasemanService.open(CommonPopController, $scope).result.then(function (result) {
			var other_org_codes=",";
			var other_org_names=",";
			var other_org_ids=",";
			var other_org_idpaths=","
            for(var i=0;i<result.length;i++){
					other_org_codes+=result[i].code+",";
					other_org_names+=result[i].orgname+",";
					other_org_ids+=result[i].orgid+",";
					other_org_idpaths+=result[i].idpath+","
			}
			$scope.data.currItem.other_org_codes=other_org_codes;
			$scope.data.currItem.other_org_names=other_org_names;
			$scope.data.currItem.other_org_ids=other_org_ids;
			$scope.data.currItem.other_org_idpaths=other_org_idpaths;
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
			$scope.data.currItem.core_name=result.core_name;
		});
	}
	
	$scope.bank_name11 =function(){
		$scope.FrmInfo = {
            title: "银行查询",           
            classid: "bank",
			
            searchlist: ["bank_code", "bank_name", "account_no", "sap_account", "note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var data=$scope.gridGetData("options_11");
			var index=$scope.options_11.api.getFocusedCell().rowIndex;
			data[index].bank_name=result.bank_name;
			data[index].bank_code=result.bank_code;
			data[index].bank_acco=result.account_no;
			data[index].bank_id=result.bank_id;
			$scope.options_11.api.setRowData(data);
        })
	}
    /**--------------*/


    /**------保存校验区域-----*/
    $scope.validate = function () {
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
            headerName: "银行编码", field: "bank_code", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
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
            if (event.data.customer_paytype_detailofcustomer_payment_types == undefined) {
                event.data.customer_paytype_detailofcustomer_payment_types = [];
            }
            $scope.options_32.api.setRowData(event.data.customer_paytype_detailofcustomer_payment_types);
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
		
		$scope.options_51 = {
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
            var isGrouping = $scope.options_51.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_51 = [    
         {
            headerName: "产品部", field: "item_kind", editable: false, filter: 'set', width: 200,
            cellEditor: "下拉框",
			cellEditorParams: {values: [{value:1,desc:"家用空调组织"},{value:2,desc:"商用空调组织"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA授信额度", field: "oa_standard_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA额度", field: "oa_amount", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA可用额度", field: "oa_canuse", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "OA保留额度", field: "oa_keeped", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "是否启用", field: "is_usable", editable: true, filter: 'set', width: 150,
            cellEditor: "复选框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
		$scope.options_61 = {
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
            var isGrouping = $scope.options_61.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_61 = [    
         {
            headerName: "买方代码", field: "buyno", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "限额类型", field: "pay_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
			cellEditorParams: {values: [{value:2,desc:"LC"},{value:3,desc:"非LC"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "申请单号", field: "apply_no", editable: true, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "银行SWIFT", field: "bankswift", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "开证行名称", field: "bankname", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "申请金额", field: "apply_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "已使用限额", field: "used_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
		
		$scope.options_71 = {
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
            var isGrouping = $scope.options_71.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns_71 = [    
       {
            headerName: "访谈类型", field: "record_type", editable: false, filter: 'set', width: 150,
            cellEditor: "下拉框",
		    cellEditorParams: {values: [{value:1,desc:"客户来访"},{value:2,desc:"拜访记录"},{value:3,desc:"会谈记录"},{value:4,desc:"不良记录"}]},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "访谈日期", field: "record_date", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "参会人员", field: "record_user", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "议题", field: "record_msg", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "会议内容", field: "record_note", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "部门名称", field: "org_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
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
            var data =$scope.gridGetData("options_31");
			//result.seq=parseInt(data.length+1);
			data.push(result);
			$scope.options_31.api.setRowData(data);
			$scope.data.currItem.customer_payment_typeofcustomers=data;
			var postdata={};
			postdata.payment_type_id=result.payment_type_id;
			postdata.payment_type_name=result.payment_type_name;
			postdata.payment_type_code=result.payment_type_code;			
			BasemanService.RequestPost("payment_type", "select",postdata)
			.then(function (re) {
				var length=$scope.options_31.api.getModel().rootNode.allLeafChildren.length;
				$scope.data.currItem.customer_payment_typeofcustomers[length-1].customer_paytype_detailofcustomer_payment_types=re.payment_type_lineofpayment_types;
				var colKey= $scope.options_31.api.getFocusedCell().column.colId
		        $scope.options_31.api.setFocusedCell(length-1,colKey);
				$scope.options_32.api.setRowData(re.payment_type_lineofpayment_types);
			})
        })
    };


    $scope.delitem3 = function () {
        var data = [];
        var rowidx = $scope.options_31.api.getFocusedCell().rowIndex;
        var node = $scope.options_31.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }	
			data.splice(rowidx, 1);
            $scope.options_31.api.setRowData(data);
		if(rowidx>0){
			var rowidx=rowidx-1;
			var colKey= $scope.options_31.api.getFocusedCell().column.colId
		    $scope.options_31.api.setFocusedCell(rowidx,colKey);
			$scope.options_32.api.setRowData($scope.data.currItem["customer_payment_typeofcustomers"][rowidx]["customer_paytype_detailofcustomer_payment_types"]);
		}else{
			if(data.length>0){
			var colKey= $scope.options_31.api.getFocusedCell().column.colId
		    $scope.options_31.api.setFocusedCell(rowidx,colKey);
			$scope.options_32.api.setRowData($scope.data.currItem["customer_payment_typeofcustomers"][rowidx+1]["customer_paytype_detailofcustomer_payment_types"]);
			}else{
			$scope.options_32.api.setRowData([]);	
			}
		}
    };

    $scope.additem4 = function () {
        //判断最后一行是否为空
        var data = [];
        var node = $scope.options_32.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        var item = {
            seq: node.length + 1
        };
        data.push(item);
        $scope.options_32.api.setRowData(data);

        //三层结构重新载入数据
        var rowidx = $scope.options_31.api.getFocusedCell().rowIndex;
        $scope.data.currItem.customer_payment_typeofcustomers[rowidx].customer_paytype_detailofcustomer_payment_types = data;
    };


    $scope.delitem4 = function () {
        var data = [];
        var rowidx = $scope.options_32.api.getFocusedCell().rowIndex;
        var node = $scope.options_32.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        data.splice(rowidx, 1);
        $scope.options_32.api.setRowData(data);

        //三层结构重新载入数据
        var rowidx = $scope.options_31.api.getFocusedCell().rowIndex;
        $scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[rowidx].customer_apply_paytype_detailofcustomer_apply_payment_types = data;
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
    .controller('customerEdit', customerEdit)

