'use strict';
function drp_custEdit($scope, $location, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {

    //继承基类方法
    drp_custEdit = HczyCommon.extend(drp_custEdit, ctrl_bill_public);
    drp_custEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
  
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_apply_header",
        key: "cust_apply_id",
        wftempid: 10003,
        FrmInfo: {},
	grids:[
	{optionname:'aoptions', idname:'customer_apply_bankofcustomer_apply_headers'},
	{optionname:'feeoptions', idname:'customer_apply_relamanofcustomer_apply_headers'},
	{optionname:'payment_typeoptions', idname:'customer_apply_payment_typeofcustomer_apply_headers',
	line:{optionname:"paytype_detailoptions",idname:"customer_apply_paytype_detailofcustomer_apply_payment_types"}}]
	}
	
   //界面初始化
    $scope.clearinformation = function() {
        if (!$scope.data) $scope.data = {}
        $scope.data.currItem = {
            stat: 1,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            creator:window.strUserId,
            customer_apply_bankofcustomer_apply_headers:[],
            customer_apply_relamanofcustomer_apply_headers:[],
            customer_apply_payment_typeofcustomer_apply_headers:[]
        };
        $scope.setitemline($scope.data.currItem);
    }
/**--------系统词汇词------*/
    BasemanService.RequestPostAjax("base_search", "searchcurrency", {}).then(function (data) {
            $scope.base_currencys = data.base_currencys;
        });
    $scope.custtypes=[{
        dictvalue: 1,
        dictname: "内销"
    }, {
        dictvalue: 2,
        dictname: "外销"
    }] 
    $scope.stats = [{
        id: 1,
        name: "制单"
    }, {
        id: 3,
        name: "启动"
    }, {
        id: 5,
        name: "审核"
    }, {
        id: 6,
        name: "已分车"
    },{
        id: 7,
        name: "已出仓"
    },{
        id: 8,
        name: "已送货"
    },{
        id: 9,
        name: "已签收"
    },{
        id: 10,
        name: "已开票"
    },{
        id: 99,
        name: "作废"
    }];
/**--------------*/
/**----弹出框区域*---------------*/

    //所属区域
  $scope.selectorg = function() {
        if ($scope.data.currItem.stat != 1) { //当页面状态不为制单的时候阻止用户选择从而改变弹出框选择的数据
            BasemanService.notice("非制单状态下不允许修改", "alert-warning");
            return;
        };
        var FrmInfo = {};
        FrmInfo.title = "部门查询";
        FrmInfo.thead = [{
            name: "部门编码",
            code: "org_code"
        }, {
            name: "部门名称",
            code: "org_name"
        }];
        BasemanService.openCommonFrm(PopOrgController, $scope, FrmInfo)
            .result.then(function(result) {
                $scope.data.currItem.orgid = result.org_id;
                $scope.data.currItem.org_name = result.org_name;
                $scope.data.currItem.org_code = result.org_code;
            });
    };

 $scope.pay_type=function(){
	$scope.FrmInfo = {
            title: "付款条件查询",
            thead:[{
                    name: "付款条件编码",
                    code: "payment_type_code"
                }, {
                    name: "付款条件名称",
                    code: "payment_type_name"
                }],
            classid: "payment_type",
            searchlist: ["payment_type_code","payment_type_name"]
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (data) {
			var nodes=$scope.payment_typeoptions.api.getModel().rootNode.allLeafChildren;
			var cell=$scope.payment_typeoptions.api.getFocusedCell();
			nodes[cell.rowIndex].data.payment_type_code=data.payment_type_code;
			nodes[cell.rowIndex].data.payment_type_name=data.payment_type_name;
			nodes[cell.rowIndex].data.payment_type_id=data.payment_type_id;
			$scope.payment_typeoptions.api.refreshRows(nodes);						
        })
}    
/**--------------*/


/**------保存校验区域-----*/
 $scope.validate = function(){
    	var errorlist = [];

    	if(!$scope.data.currItem.cust_name){
    		errorlist.push("客户名称不能为空");
    	}

    	if(errorlist.length){
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
    valueGetter: function(params) {
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
    //收货信息
    $scope.acolumns = [
	{
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 70,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "是否默认", field: "is_default",editable: true, filter: 'set',  width: 100,
		cellEditor:"下拉框",
		cellEditorParams:{values:[{value:0,desc:'否'},{value:2,desc:'是'}]},
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},

    {
        headerName: "银行名称", field: "bank_name",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
	{
        headerName: "银行账号", field: "bank_acco",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},
    {
        headerName: "备注", field: "note",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}];
$scope.aoptions = {
    rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
    pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
    groupKeys: undefined, 
    groupHideGroupColumns: false,
    enableColResize: true, //one of [true, false]
    enableSorting: true, //one of [true, false]
    enableFilter: true, //one of [true, false]
    enableStatusBar: false,
    enableRangeSelection: false,
    rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
    rowDeselection: false,
    quickFilterText: null,
    groupSelectsChildren: false, // one of [true, false]
    suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
    groupColumnDef: groupColumn,
    showToolPanel: false,
    checkboxSelection: function (params) {
        var isGrouping = $scope.aoptions.columnApi.getRowGroupColumns().length > 0;
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
    $scope.feecolumns = [{
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 70,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "联系人", field: "relaman",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "电话", field: "tel",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}];

$scope.feeoptions = {
    rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
    pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
    groupKeys: undefined, 
    groupHideGroupColumns: false,
    enableColResize: true, //one of [true, false]
    enableSorting: true, //one of [true, false]
    enableFilter: true, //one of [true, false]
    enableStatusBar: false,
    enableRangeSelection: false,
    rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
    rowDeselection: false,
    quickFilterText: null,
    groupSelectsChildren: false, // one of [true, false]
    suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
    groupColumnDef: groupColumn,
    showToolPanel: false,
    checkboxSelection: function (params) {
        var isGrouping = $scope.feeoptions.columnApi.getRowGroupColumns().length > 0;
        return params.colIndex === 0 && !isGrouping;
    },
    icons: {
        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>',
    }
};
//网格单击子表切换行(一定要放在定义的对应option前面，否则功能失效)
$scope.rowClicked=function(event){
		if(event.data){
			if(event.data.customer_apply_paytype_detailofcustomer_apply_payment_types==undefined){
			   event.data.customer_apply_paytype_detailofcustomer_apply_payment_types=[];
			}
        $scope.paytype_detailoptions.api.setRowData(event.data.customer_apply_paytype_detailofcustomer_apply_payment_types);
		}
	}
$scope.payment_typeoptions = {
    rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
    pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
    groupKeys: undefined, 
    groupHideGroupColumns: false,
    enableColResize: true, //one of [true, false]
    enableSorting: true, //one of [true, false]
    enableFilter: true, //one of [true, false]
    enableStatusBar: false,
    enableRangeSelection: false,
    rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
    rowDeselection: false,
    quickFilterText: null,
	rowClicked:$scope.rowClicked,
    groupSelectsChildren: false, // one of [true, false]
    suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
    groupColumnDef: groupColumn,
    showToolPanel: false,
    checkboxSelection: function (params) {
        var isGrouping = $scope.payment_typeoptions.columnApi.getRowGroupColumns().length > 0;
        return params.colIndex === 0 && !isGrouping;
    },
    icons: {
        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>',
    }
};
$scope.payment_typecolumns = [{
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 70,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "付款方式方式", field: "payment_type_code",editable: true, filter: 'set',  width: 200,
		cellEditor:"弹出框",
		action:$scope.pay_type,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "付款方式名称", field: "payment_type_name",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "默认生产定金率(%)", field: "contract_subscrp",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "备注", field: "note",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}];
	
$scope.paytype_detailoptions = {
    rowGroupPanelShow: 'onlyWhenGrouping', // on of ['always','onlyWhenGrouping']
    pivotPanelShow: 'always', // on of ['always','onlyWhenPivoting']
    groupKeys: undefined, 
    groupHideGroupColumns: false,
    enableColResize: true, //one of [true, false]
    enableSorting: true, //one of [true, false]
    enableFilter: true, //one of [true, false]
    enableStatusBar: false,
    enableRangeSelection: false,
    rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
    rowDeselection: false,
    quickFilterText: null,
    groupSelectsChildren: false, // one of [true, false]
    suppressRowClickSelection: false, // if true, clicking rows doesn't select (useful for checkbox selection)
    groupColumnDef: groupColumn,
    showToolPanel: false,
    checkboxSelection: function (params) {
        var isGrouping = $scope.paytype_detailoptions.columnApi.getRowGroupColumns().length > 0;
        return params.colIndex === 0 && !isGrouping;
    },
    icons: {
        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
        filter: '<i class="fa fa-filter"/>',
        sortAscending: '<i class="fa fa-long-arrow-down"/>',
        sortDescending: '<i class="fa fa-long-arrow-up"/>',
    }
};
    $scope.paytype_detailcolumns = [{
        headerName: "序号", field: "seq",editable: false, filter: 'set',  width: 70,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "回款期限", field: "days",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	},{
        headerName: "付款比例(%)", field: "pay_ratio",editable: true, filter: 'set',  width: 200,
		cellEditor:"文本框",
		//cellchange:$scope.bankBalance,
        enableRowGroup: true,
        enablePivot: true,
		enableValue: true,
        floatCell: true
	}];
/**-------------*/

/**------ 对网格操作区域-------*/
//增加当前行、删除当行前
$scope.additem = function() {
//避免填写数据丢失
$scope.aoptions.api.stopEditing(false);       
		var data=[];
        var node=$scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
		 var item = {
            seq: node.length+1
        };
		data.push(item);
        $scope.aoptions.api.setRowData(data);
    	$scope.data.currItem.customer_apply_bankofcustomer_apply_headers=data;
    };


$scope.delitem = function() {
//避免填写数据丢失
$scope.aoptions.api.stopEditing(false);  	
        var data=[];
        var rowidx = $scope.aoptions.api.getFocusedCell().rowIndex;
		var node=$scope.aoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
        data.splice(rowidx, 1);
		$scope.aoptions.api.setRowData(data);
		$scope.data.currItem.customer_apply_bankofcustomer_apply_headers=data;

    };

    $scope.additem2 = function() {
//避免填写数据丢失
$scope.feeoptions.api.stopEditing(false);  
        //判断最后一行是否为空
		var data=[];
        var node=$scope.feeoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
		 var item = {
            seq: node.length+1
        };
		data.push(item);
        $scope.feeoptions.api.setRowData(data);
    	$scope.data.currItem.customer_apply_relamanofcustomer_apply_headers=data;
    };


    $scope.delitem2 = function() {
//避免填写数据丢失
$scope.feeoptions.api.stopEditing(false);  

        var data=[];
        var rowidx = $scope.feeoptions.api.getFocusedCell().rowIndex;
		var node=$scope.feeoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
        data.splice(rowidx, 1);
		$scope.feeoptions.api.setRowData(data);
		$scope.data.currItem.customer_apply_relamanofcustomer_apply_headers=data;

    };
	
	$scope.additem3 = function() {
//避免填写数据丢失
$scope.payment_typeoptions.api.stopEditing(false); 
        //判断最后一行是否为空
		var data=[];
        var node=$scope.payment_typeoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
		 var item = {
            seq: node.length+1
        };
		data.push(item);
        $scope.payment_typeoptions.api.setRowData(data);
    	$scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers=data;
    };


    $scope.delitem3 = function() {
//避免填写数据丢失
$scope.payment_typeoptions.api.stopEditing(false);  
        var data=[];
        var rowidx = $scope.payment_typeoptions.api.getFocusedCell().rowIndex;
		var node=$scope.payment_typeoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
        data.splice(rowidx, 1);
		$scope.payment_typeoptions.api.setRowData(data);
		$scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers=data;

    };
	
	$scope.additem4 = function() {
//避免填写数据丢失
$scope.paytype_detailoptions.api.stopEditing(false);  
        //判断最后一行是否为空
		var data=[];
        var node=$scope.paytype_detailoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
		 var item = {
            seq: node.length+1
        };
		data.push(item);
        $scope.paytype_detailoptions.api.setRowData(data);
		
		//三层结构重新载入数据
		var rowidx = $scope.payment_typeoptions.api.getFocusedCell().rowIndex;
		$scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[rowidx].customer_apply_paytype_detailofcustomer_apply_payment_types=data;
    };


    $scope.delitem4 = function() {
//避免填写数据丢失
$scope.paytype_detailoptions.api.stopEditing(false);  

        var data=[];
        var rowidx = $scope.paytype_detailoptions.api.getFocusedCell().rowIndex;
		var node=$scope.paytype_detailoptions.api.getModel().rootNode.allLeafChildren;
        for(var i=0;i<node.length;i++){
			data.push(node[i].data);
		}
        data.splice(rowidx, 1);
		$scope.paytype_detailoptions.api.setRowData(data);
	
		//三层结构重新载入数据
		var rowidx = $scope.payment_typeoptions.api.getFocusedCell().rowIndex;
		$scope.data.currItem.customer_apply_payment_typeofcustomer_apply_headers[rowidx].customer_apply_paytype_detailofcustomer_apply_payment_types=data;
    };
/**----------------------*/
  
    //数据缓存
    $scope.initdata();

};


angular.module('inspinia')
    .controller('drp_custEdit', drp_custEdit)

