var basemanControllers = angular.module('inspinia');
function sale_printed_baseEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    sale_printed_baseEdit = HczyCommon.extend(sale_printed_baseEdit, ctrl_bill_public);
    sale_printed_baseEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_printed_base",
        key: "printed_id",
        wftempid: 10161,
        FrmInfo: {},
        grids: [
            {optionname: 'options_11', idname: 'sale_printed_base_lineofsale_printed_bases'}
        ]
    };
    /******************页面隐藏****************************/
    $scope.show_11 = true;
    $scope.show11 = function () {
        $scope.show_11 = !$scope.show_11;
    };
   //增加当前行、删除当行前
    $scope.additem = function () {
        $scope.options_11.api.stopEditing(false);
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
        $scope.data.currItem.sale_printed_base_lineofsale_printed_bases = data;
    };

    $scope.save_before =function(){
		for(var i=0;i<$scope.data.currItem.sale_printed_base_lineofsale_printed_bases.length;i++){
			$scope.data.currItem.sale_printed_base_lineofsale_printed_bases[i].seq=(i+1);
		}
	}
     /****************************网格下拉***************************/
        //订单
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "line_type"})
            .then(function (data) {
                var line_types = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    line_types[i] = {value: data.dicts[i].dictvalue,desc: data.dicts[i].dictname}
                }
                if ($scope.getIndexByField('columns_21', 'line_type')) {
                    $scope.columns_21[$scope.getIndexByField('columns_21', 'line_type')].cellEditorParams.values = line_types;
                }
        });
    /******************网格定义区域****************************/
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
    //明细
    $scope.columns_11 = [
	    {
            headerName: "序号", field: "seq", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "印刷件名称", field: "printed_name", editable: false, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "材质", field: "material", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "位置", field: "loc", editable: true, filter: 'set', width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "内容", field: "content", editable: true, filter: 'set', width: 200,
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
    /******************词汇值****************************/
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.stats = HczyCommon.stringPropToNum(data.dicts);
        });
    //信用证类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "lc_type"})
        .then(function (data) {
            $scope.lc_types = HczyCommon.stringPropToNum(data.dicts);
        });
    //LC受益人--回款组织
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "return_ent_type"})
        .then(function (data) {
            $scope.return_ent_types = HczyCommon.stringPropToNum(data.dicts);
        });
    $scope.launch_months = [
        {id: 1,name: "1月"}, {id: 2,name: "2月"}, {id: 3,name: "3月"}, {id: 4,name: "4月"}, {id: 5,name: "5月"}, {id: 6,name: "6月"},
         {id: 7,name: "7月"}, {id: 8,name: "8月"}, {id: 9,name: "9月"}, {id: 10,name: "10月"}, {id: 11,name: "11月"}, {id: 12,name: "12月"},
    ];
    /******************弹出框区域****************************/
    /*********************网格处理事件*****************************/
    /******************界面初始化****************************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            stat: 1,
            cust_id: 0,

        };
         //获取完整的日期
         var date=new Date;
         $scope.data.currItem.inv_year=date.getFullYear();
         var month=date.getMonth()+1;
         $scope.data.currItem.inv_month =(month<10 ? "0"+month:month);
//         var mydate = (year.toString()+month.toString());
    };
    $scope.initdata();

}
//加载控制器
basemanControllers
    .controller('sale_printed_baseEdit', sale_printed_baseEdit);
