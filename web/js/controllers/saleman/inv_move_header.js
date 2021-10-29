var salemanControllers = angular.module('inspinia');
function inv_move_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "inv_move_header",
        key: "move_id",
        nextStat: "inv_move_headerEdit",
        classids: "inv_move_headers",
       // sqlBlock:"1=1",
        thead:[],
		//postdata :{sqlwhere:"1=1"},
        grids:[{optionname:'viewOptions', idname:'contains'}]
    };

    //继承基类方法
    inv_move_header = HczyCommon.extend(inv_move_header, ctrl_view_public);
    inv_move_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);


	var bill_type = $scope.$state.params.bill_type;
	$scope.beforClearInfo = function () {
		if (Number(bill_type || 0)==1) {
			$scope.headername = "移库申请"; 
			$scope.objconf.nextStat="inv_move_headerEdit";
			$scope.objconf.postdata={ sqlwhere:"1=1 and nvl(bill_type,0) = 1"}; 
		} else if (Number(bill_type || 0)==2) { 
			$scope.headername = "借用申请";
			$scope.objconf.nextStat="inv_move_header_jyEdit";
			$scope.objconf.postdata={ sqlwhere:"1=1 and nvl(bill_type,0) = 2"}; 
		} else if (Number(bill_type || 0)==3) { 
			$scope.headername = "工厂返包申请";
			$scope.objconf.nextStat="inv_move_header_fbEdit";
			$scope.objconf.postdata={ sqlwhere:"1=1 and nvl(bill_type,0) = 3"}; 
		} else if (Number(bill_type || 0)==4) { 
			$scope.headername = "移库申请";
			$scope.objconf.nextStat="inv_move_header_bsEdit";
			$scope.objconf.postdata={ sqlwhere:"1=1 and nvl(bill_type,0) = 4"}; 
		}
	};

	$scope.beforClearInfo();

    //$scope.headername = "移库申请";
    $scope.filed = "move_no";
    inv_move_header = HczyCommon.extend(inv_move_header, ctrl_view_public);
    inv_move_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    /**------ 下拉框词汇值------------*/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            var stats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                stats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'stat')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].cellEditorParams.values = stats;
            }
        });
     //移库类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "move_type"})
        .then(function (data) {
            var move_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                move_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('viewColumns', 'move_type')) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'move_type')].cellEditorParams.values = move_types;
            }
        });
 
    /**----网格列区域  ----------*/
    $scope.viewColumns = [
        {
            headerName: "调拨单号", field: "move_no", editable: false, filter: 'set', width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },{
            headerName: "单据状态", field: "stat", editable: false, filter: 'set', width: 87,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "移库类型", field: "move_type", editable: false, filter: 'set', width: 100,
            cellEditor: "下拉框",
            cellEditorParams: {values: []},
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "入库仓库编码", field: "wh_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "入库仓库名称", field: "wh_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出库仓库编码", field: "s_wh_code", editable: false, filter: 'set', width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "出库仓库名称", field: "s_wh_name", editable: false, filter: 'set', width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },  {
            headerName: "调拨日期", field: "in_date", editable: false, filter: 'set', width: 90,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "总数量", field: "total_qty", editable: false, filter: 'set', width: 80,
            cellEditor: "整数框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建人", field: "creator", editable: false, filter: 'set', width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            headerName: "创建时间", field: "create_time", editable: false, filter: 'set', width: 90,
            cellEditor: "年月日",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "备注", field: "note", editable: false, filter: 'set', width: 180,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            headerName: "操作", field: "", editable: false, filter: 'set', width: 58,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            pinned: 'right',
            cellRenderer: "链接渲染"
        }];
    //数据缓存
    $scope.initData();
}
//加载控制器
salemanControllers
    .controller('inv_move_header', inv_move_header);

