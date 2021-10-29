ctrl_single_table = function($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	//继承ctrl_bill_public
	ctrl_single_table = HczyCommon.extend(ctrl_single_table, ctrl_bill_public);
    ctrl_single_table.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService
    ]);
    $("div[class='popover fade top in']").remove();
    $scope._stat_name_ = $rootScope.$state.$current.name;
    $scope.data = {};
    //初始化值转换
    if ($scope.objconf == undefined) $scope.objconf = {}; //如果$scope.objconf没有提前定义，先置为空的	
    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
	$scope.data.predata = {};
	$scope.data.preindex=0;
	$scope.search = function() {
        $scope.FrmInfo = {
            is_high: true,
            classid: $scope.objconf.classid, //Search请求类---主表
            type: 'sqlback', //单选或多选，默认''单选
            sqlBlock: $scope.objconf.sqlBlock //强制性的过滤条件，默认空
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function(result) {
				var postdata={};
                if (result.sqlwhere) {
                    postdata.sqlwhere = result.sqlwhere;
                }
				var action = $scope.objconf.action || "search";
				BasemanService.RequestPost($scope.objconf.classid, action, postdata)
                .then(function(data) {
					var back_prop = $scope.objconf.backdatas || $scope.objconf.classid + "s";
					$scope.data.currItem.contains = data[back_prop];
					for(name in data[back_prop][0]){
						$scope.data.currItem[name] = data[back_prop][0][name];
						
					}
					$scope.data.predata = $scope.data.currItem;
					$scope.data.preindex=0;
					$scope.options.api.setRowData($scope.data.currItem.contains);
					var columns = $scope.options.columnApi.getAllColumns();					
					//将网格的光标定位到第一行
					$scope.options.api.setFocusedCell(0, columns[0].colDef.field);
					
					if (data[$scope.objconf.key] != 0) {
						//$scope.refresh(2);
					}
					
				})
            });
    };
	$scope.save_after =function(){
		var data =$scope.gridGetData('options');
		for(var i=0;i<data.length;i++){
			if(parseInt(data[i][$scope.objconf.key])==parseInt($scope.data.currItem[$scope.objconf.key])){
			for(name in $scope.data.currItem){
			data[i][name] =$scope.data.currItem[name];
		    }
		    $scope.options.api.refreshView();
			return;
		    }
		}
        data.push($scope.data.currItem);
        $scope.options.api.setRowData(data);
        //将网格的光标定位到最后一行
		var columns = $scope.options.columnApi.getAllColumns();
		$scope.options.api.setFocusedCell(data.length-1, columns[0].colDef.field);
		
		$scope.data.predata = $scope.gridGetRow('options');
		$scope.data.preindex =data.length-1;
        		
	}
	$scope.refresh_after =function(){
		var data =$scope.gridGetRow('options');
		for(name in $scope.data.currItem){
			if(name!='contains'){
				data[name]= $scope.data.currItem[name];
			}			 
		}
		$scope.options.api.refreshView();
	}
	$scope.clearinformation1 =function(){
		$scope.data = {
            currItem: {
                creator: window.userbean.userid,
                create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
        };
        if ($scope.clearinformation && typeof $scope.clearinformation == "function") {
            $scope.clearinformation();
        }
		$scope.gridDelItem('options');
	}
	$scope.new =function(){
		$scope.data.currItem ={stat:1};
		if ($scope.clearinformation && typeof $scope.clearinformation == "function") {
            $scope.clearinformation();
        }
		$scope.setgridstat($scope.data.currItem.stat);
        $timeout(function () {
            $("select.chosen-select").each(function () {
                var _this = $(this);
                var c_disbled = false;
                if (_this.chosen) {
                    if (_this.attr("readonly") && _this[0].disabled) {
                        c_disbled = true;
                    }
                }
                _this.attr('disabled', c_disbled).trigger("chosen:updated");
            });
        }, 500);
	}
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
    if ($scope.filed) {
        groupColumn.field = $scope.filed;
    }
	$scope.save_before =function(){
		delete $scope.data.currItem.contains
	}
	$scope.rowClicked =function(e){
		if($scope.data.predata==undefined){
		   $scope.data.predata= $scope.data.currItem;
		}
		if($scope.data.currItem[$scope.objconf.key]!=undefined&&parseInt($scope.data.currItem[$scope.objconf.key])!=0){
			for(name in $scope.data.currItem){				
			if(name!='contains'&&$scope.data.currItem[name]!=$scope.data.predata[name]){
				 ds.dialog.confirm("数据已改变,是否保存", function () {
					 $scope.options.api.setFocusedCell($scope.preindex, $scope['options'].api.getFocusedCell().column.colId);
					 $scope.save();
				 },function () {
		             $timeout(function(){
						 for(name in e.data){
							$scope.data.currItem[name] = e.data[name];							
						 }
						 $scope.data.predata=e.data;
						 $scope.data.preindex=$scope['options'].api.getFocusedCell().rowIndex
						 for(name in $scope.data.currItem){
							 if(e.data[name]==undefined){
								 delete $scope.data.currItem[name];
							 }
						 }
					 })
				 })
				 return;
			}
		  }
		}		
		for(name in e.data){
			$scope.data.currItem[name] = e.data[name];							
		 }
		 $scope.data.predata=e.data;
		 $scope.data.preindex=$scope['options'].api.getFocusedCell().rowIndex;
		 
		 for(name in $scope.data.currItem){
			 if(e.data[name]==undefined){
				 delete $scope.data.currItem[name];
			 }
		 }
		 $scope.setgridstat($scope.data.currItem.stat);
		$timeout(function () {
			$("select.chosen-select").each(function () {
				var _this = $(this);
				var c_disbled = false;
				if (_this.chosen) {
					if (_this.attr("readonly") && _this[0].disabled) {
						c_disbled = true;
					}
				}
				_this.attr('disabled', c_disbled).trigger("chosen:updated");
			});
		}, 500);
		
	}
    $scope.options = {
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
        rowClicked: $scope.rowClicked,
        groupSelectsChildren: false, // one of [true, false]
        suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
        groupColumnDef: groupColumn,
        showToolPanel: false,
        checkboxSelection: function(params) {
            var isGrouping = $scope.options.columnApi.getRowGroupColumns().length > 0;
            return params.colIndex === 0 && !isGrouping;
        },
        icons: {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
        }
    };
    
};
angular
    .module('inspinia')
    .controller('ctrl_single_table', ctrl_single_table)
