var basemanControllers = angular.module('inspinia');
function pro_temporary_scheme_header($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    pro_temporary_scheme_header = HczyCommon.extend(pro_temporary_scheme_header, ctrl_bill_public);
    pro_temporary_scheme_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_temporary_scheme_header",
        key: "apply_id",
        FrmInfo: {},
        wftempid: 10178,
        grids: [{optionname: 'options', idname: 'pro_temporary_scheme_lineofpro_temporary_scheme_headers'}]
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
            //$scope.columns_21[3].cellEditorParams.values.push(object);
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
	$scope.item_code = function () {
        $scope.FrmInfo = {
            is_high: true,
            title: "编码查询",
            is_custom_search: true,
            thead: [
                {
                    name: "物料编码",
                    code: "itemcode",
                    show: true,
                    iscond: true,
                    type: 'string'
                },{
                    name: "图号",
                    code: "drawid",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "描述",
                    code: "itemdesc",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "pro_temporary_scheme_header",
            postdata: {
                flag: 1,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            if (result.itemid == undefined) {
                return
            }
            var data = $scope.gridGetRow("options")
            data.item_id = result.itemid;
            data.item_code = result.itemcode;
            //data.item_name = result.itemname;
			data.item_desc = result.itemdesc;
			data.item_figure = result.drawid;
            $scope.gridUpdateRow("options", data);
        })
    }
	$scope.match =function(){
		$scope.FrmInfo = {
            is_high: true,
            title: "选配信息查询",
            is_custom_search: true,
            thead: [
                {
                    name: "选配项",
                    code: "conf_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                },{
                    name: "选配信息",
                    code: "option_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "pro_temporary_scheme_header",
            postdata: {
                flag: 3,
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            var data = $scope.gridGetRow("options")
            data.configuration = result.conf_name;
			data.match = result.option_name;
            $scope.gridUpdateRow("options", data);
        })
	}
	
	$scope.cust_name =function(){
		$scope.FrmInfo = {
            is_high: true,
            title: "客户查询",
            is_custom_search: true,
            thead: [
                {
                    name: "客户名称",
                    code: "cust_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                },{
                    name: "客户编码",
                    code: "cust_code",
                    show: true,
                    iscond: true,
                    type: 'string'
                }],
            classid: "customer",
            postdata: {
				flag:104
            },
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            var data = $scope.gridGetRow("options")
            data.cust_name = result.cust_name;
			data.cust_code = result.cust_code;
			data.cust_id = result.cust_id;
            $scope.gridUpdateRow("options", data);
        })
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
            headerName: "应用范围", field: "use_range", editable: true, filter: 'set', width: 100,
            cellEditor: "下拉框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            cellEditorParams: {
                values: [
                    {value: 1, desc: "指定编码"}, {value: 3, desc: "机型分类"}]
            },
        },
        {
            headerName: "编码", field: "item_code", editable: true, filter: 'set', width: 100,
            cellEditor: "弹出框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            action: $scope.item_code
        },
        {
            headerName: "图号", field: "item_figure",
            editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "描述", field: "item_desc", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配项", field: "configuration", editable: false, filter: 'set', width: 150,
            cellEditor: "弹出框",
		    action: $scope.configuration,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "选配信息", field: "match", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action: $scope.match,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "客户名称", field: "cust_name", editable: true, filter: 'set', width: 150,
            cellEditor: "弹出框",
			action: $scope.cust_name,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ]

    $scope.validate = function () {
		var data=$scope.gridGetData("options");
		for(var i=0;i<data.length;i++){
				if(data[i]["use_range"]==""||data[i]["use_range"]==undefined||parseInt(data[i]["use_range"])==0||data[i]["item_code"]==""||data[i]["item_code"]==undefined
||data[i]["item_figure"]==""||data[i]["item_figure"]==undefined||data[i]["item_desc"]==""||data[i]["item_desc"]==undefined
||data[i]["configuration"]==""||data[i]["configuration"]==undefined||data[i]["match"]==""||data[i]["match"]==undefined||data[i]["cust_name"]==""||data[i]["cust_name"]==undefined){
					BasemanService.notice("第"+(i+1)+"行网格的数据要全部填写", "alert-warning");
			        return false;
				}
		}
        var msg = [];
        if ($scope.data.currItem.package_ware == "电子" && $scope.data.currItem.package_factory != "电子") {
            msg.push("包装工厂选择了电子,BOM包类型必须选择电子!");
        }
        if ($scope.data.currItem.package_ware == "总装" && $scope.data.currItem.package_factory == "电子") {
            msg.push("BOM包类型选择了总装,包装工厂不能选择电子");
        }
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
        $scope.gridSetData("options", $scope.data.currItem.pro_temporary_scheme_lineofpro_temporary_scheme_headers);
        $scope.setgridstat($scope.data.currItem.stat);
    }
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();
}

//加载控制器
basemanControllers
    .controller('pro_temporary_scheme_header', pro_temporary_scheme_header);
