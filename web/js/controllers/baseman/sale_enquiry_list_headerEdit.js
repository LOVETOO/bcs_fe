'use strict';
function sale_enquiry_list_headerEdit($scope, $location, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {

    //继承基类方法
    sale_enquiry_list_headerEdit = HczyCommon.extend(sale_enquiry_list_headerEdit, ctrl_bill_public);
    sale_enquiry_list_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);

    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_enquiry_list_header",
        key: "enquirylist_id",
        wftempid: 10077,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'customer_apply_bankofcustomer_apply_headers'},
            {optionname: 'options_21', idname: 'customer_apply_relamanofcustomer_apply_headers'}]
    }

    //界面初始化
    $scope.clearinformation = function () {
		$scope.data = {};
		$scope.data.currItem = {
            stat: 1,
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString()
		};
    }
    /**--------系统词汇词------*/
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

	//贸易类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "trade_type"}).then(function (data) {
        $scope.trade_types = data.dicts;
    })
	//客户性质
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_type"}).then(function (data) {
        $scope.cust_types = data.dicts;
    })

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
	
    $scope.currency_code =function(){
		$scope.FrmInfo = {
            title: "币种查询",           
            classid: "base_currency"
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.currency_code=result.currency_code;
			$scope.data.currItem.currency_name=result.currency_name;
			$scope.data.currItem.currency_id=result.currency_id;
        })
	}
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
        }, {
            headerName: "是否默认", field: "is_default", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: [{value: 0, desc: '否'}, {value: 2, desc: '是'}]},
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },

        {
            headerName: "银行名称", field: "bank_name", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
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
            headerName: "联系人", field: "relaman", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "电话", field: "tel", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            //cellchange:$scope.bankBalance,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];

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
        //数据缓存
    $scope.initdata();
};
angular.module('inspinia')
    .controller('sale_enquiry_list_headerEdit', sale_enquiry_list_headerEdit)

