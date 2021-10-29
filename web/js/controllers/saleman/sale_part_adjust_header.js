var basemanControllers = angular.module('inspinia');
function sale_part_adjust_header($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_part_adjust_header = HczyCommon.extend(sale_part_adjust_header, ctrl_bill_public);
    sale_part_adjust_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_part_adjust_header",
        key: "adjust_id",
        FrmInfo: {},
        wftempid: 11090,
        grids: [{optionname: 'options', idname: 'sale_part_adjust_lineofsale_part_adjust_headers'}]
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
        cellRendererParams: function (params) {
        }
    };

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.value = data.dicts[i].dictvalue;
            object.desc = data.dicts[i].dictname;
        }
    });
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "use_range"})
        .then(function (data) {
            for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.value = data.dicts[i].dictvalue;
            object.desc = data.dicts[i].dictname;
            $scope.columns[1].cellEditorParams.values.push(object);
        }
        })
    $scope.addline =function(){
		var data=$scope.gridGetData("options");
		item={};
		data.push(item);
		$scope.options.api.setRowData(data);
	}
	$scope.org_name = function () {
        $scope.FrmInfo = {			
            classid: "scporg",
	        postdata:{},
			sqlBlock: "scporg.Stat =2 and OrgType in (5, 14)",
            backdatas: "orgs",
           
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {             
            var data = $scope.gridGetRow("options")
            data.org_id = result.orgid;
			data.org_code = result.code;
			data.org_name = result.orgname;
            $scope.gridUpdateRow("options", data);			 
        });
    }
	$scope.cust_name = function () {
        var data = $scope.gridGetRow("options");
		if (data.org_code == undefined || data.org_code == "") {
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
            sqlBlock: "org_id = " + data.org_id
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
			var data = $scope.gridGetRow("options")
            data.cust_name = result.cust_name;
			data.cust_code = result.cust_code;
			data.cust_id = result.cust_id;
            $scope.gridUpdateRow("options", data);
        });

    }
    //资金预览
    $scope.options = {
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
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    $scope.columns = [
        {
            headerName: "序号",
            field: "seq",
            editable: false,
            filter: 'set',
            width: 60,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "业务部", field: "org_name", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
			non_empty:true,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action: $scope.org_name
        },
		{
            headerName: "客户编码", field: "cust_code", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "客户名称", field: "cust_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action: $scope.cust_name,
			non_empty:true,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "可用额度", field: "old_amt", editable: false, filter: 'set', width: 150,
            cellEditor: "浮点框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "调整金额", field: "adjust_amt", editable: true, filter: 'set', width: 100,
            cellEditor: "浮点框",
			non_empty:true,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
		{
            headerName: "调整原因", field: "note", editable: true, filter: 'set', width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
        
    ]

    $scope.validate = function () {
		var data=$scope.gridGetData("options");
		for(var i=0;i<data.length;i++){
	       if(data[i]["org_code"]==""||data[i]["org_code"]==undefined||data[i]["cust_name"]==""||data[i]["cust_name"]==undefined||data[i]["adjust_amt"]==""||data[i]["adjust_amt"]==undefined){
					BasemanService.notice("第"+(i+1)+"行黄色网格的数据要全部填写", "alert-warning");
			        return false;
		   }
		}
        var msg = [];
        if (msg.length > 0) {
            BasemanService.notice(msg);
            return false;
        }
        return true;
    }

    /**----弹出框区域*---------------*/
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.wfid = 0;
        $scope.data.currItem.wfflag = 0;
        $scope.data.currItem.creator = window.userbean.userid;
        $scope.data.currItem.create_time = moment().format('YYYY-MM-DD HH:mm:ss');
    };

    $scope.refresh_after = function () {
        $scope.gridSetData("options", $scope.data.currItem.sale_part_adjust_lineofsale_part_adjust_headers);
        $scope.setgridstat($scope.data.currItem.stat);
    }
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('sale_part_adjust_header', sale_part_adjust_header);
