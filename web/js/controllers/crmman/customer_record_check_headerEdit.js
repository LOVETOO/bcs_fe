var basemanControllers = angular.module('inspinia');
function customer_record_check_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    customer_record_check_headerEdit = HczyCommon.extend(customer_record_check_headerEdit, ctrl_bill_public);
    customer_record_check_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_record_check_header",
        key: "check_id",
        wftempid:10126,
        FrmInfo: {},
        grids: [{optionname: 'options_3', idname: 'customer_record_check_lineofcustomer_record_check_headers'}]
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
    //拜访单号
	 $scope.selectvisit = function () {
        $scope.FrmInfo = {
            postdata:{flag:2},
            classid: "customer_visit_record",
        };
         if ($scope.data.currItem.creator== "admin" ) {
             $scope.FrmInfo.sqlBlock="1=1"
         }
         else {
             $scope.FrmInfo.sqlBlock = "Creator like" + "'"+$scope.data.currItem.creator+"'"
         }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
           var data = [];
            var index = $scope.options_3.api.getFocusedCell().rowIndex;
            var node = $scope.options_3.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            data[index].record_no = result.record_no;
            data[index].record_id = result.record_id;
            $scope.options_3.api.setRowData(data)
        });
    }
    //客户
    $scope.selectcust = function () {

        $scope.FrmInfo = {
            classid: "customer",
        };
        if (window.userbean.org_id== 211||window.userbean.org_id==undefined ) {
            $scope.FrmInfo.sqlBlock="1=1"
        }
        else {
            $scope.FrmInfo.sqlBlock = "org_id=" + window.userbean.org_id +
                " or other_org_ids like '%," + window.userbean.org_id + ",%'"
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
			var data = [];
            var index = $scope.options_3.api.getFocusedCell().rowIndex;
            var node = $scope.options_3.api.getModel().rootNode.childrenAfterSort;
            for (var i = 0; i < node.length; i++) {
                data.push(node[i].data)
            }
            
            data[index].cust_code = result.sap_code;
			data[index].cust_name = result.cust_name;
            $scope.options_3.api.setRowData(data)
        });
    }
    /***********************网格处理事件***************************/
    //增加行
    $scope.addpo = function () {
        var datas = $scope.gridGetData("options_3");
        if(datas.length>0){
            BasemanService.notice("每个单号只能认领一个客户！", "alert-warning");
            return;
        }
        var data = [];
        var node = $scope.options_3.api.getModel().rootNode.allLeafChildren;
        for (var i = 0; i < node.length; i++) {
            data.push(node[i].data);
        }
        item = {
            seq:node.length+1,
            line_id: node.length + 1,
        };
        data.push(item);
        $scope.options_3.api.setRowData(data);
    };

	//删除行
	 $scope.delpo =function(){
		var data = $scope.gridGetData("options_3");
        var rowidx = $scope.options_3.api.getFocusedCell().rowIndex;
        data.splice(rowidx, 1);
        $scope.options_3.api.setRowData(data);
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
$scope.columns_3 = [
       {
            headerName: "客户拜访记录单号", field: "record_no", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action:$scope.selectvisit,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户编码", field: "cust_code", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
            action:$scope.selectcust,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户名称", field: "cust_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }];
    $scope.options_3 = {
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
                var isGrouping = $scope.options_3.columnApi.getRowGroupColumns().length > 0;
                return params.colIndex === 0 && !isGrouping;
            },
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
            }
        };
    /****************************初始化**********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,
            objattachs:[],
            create_time:myDate.toLocaleDateString(),
            customer_record_check_lineofcustomer_record_check_header:[],

        };
    };
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('customer_record_check_headerEdit', customer_record_check_headerEdit);
