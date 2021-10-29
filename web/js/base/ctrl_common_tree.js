ctrl_common_tree = function($rootScope, $scope, $location, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	//继承ctrl_bill_public
	ctrl_common_tree = HczyCommon.extend(ctrl_common_tree, ctrl_bill_public);
    ctrl_common_tree.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService
    ]);
	var classid = $scope.objconf.name;
	var back_prop = $scope.objconf.backdata || classid + "s";	
	var action = $scope.objconf.action || "gettree";
	var _postdata ={};
	if($scope.objconf.postdata){
		var _postdata = $scope.objconf.postdata;
	}	
    
	//初始化数据
	BasemanService.RequestPost(classid, action, _postdata)
	.then(function(data) {
			var shift = [];
			shift[0] = {
				group: true,
				expanded: true,
				children: []
			};
			var allcol = $scope.options.columnApi.getAllColumns();
			$scope.keys =[];
			for(var i=0;i<allcol.length;i++){
				$scope.keys.push(allcol[i].colDef.field);
			}
			shift[0][allcol[0].colDef.field]="根节点";
			shift[0][$scope.objconf.key]=0;
			$scope.items = data[back_prop]; //返回的数据组？显示的字段？search方法不一样
			$scope.items = $scope.setTree1(0,$scope.objconf.parentid,$scope.items, [shift[0]],$scope.objconf.key);
			$scope.options.datasource=$scope.items
			$scope.options.api.setRowData($scope.items);
			$scope.options.columnApi.autoSizeColumns($scope.keys);
		if ($scope.items.length) {
			BasemanService.notice("搜索已完成!", "alert-info");
		} else {
			BasemanService.notice("未有搜索记录!", "alert-warning");
		}			
	});
	$scope.setforcus = function () {
        var data = $scope.gridGetRow("options");
        if (!data || data[$scope.objconf.key] == undefined) {
            return $scope.forcusRow = false;
        }else{
			return $scope.forcusRow = data;
		}                
    }
	//增加子节点
	$scope.newchild = function () {
        $scope.data.flag = 2;//增加子节点
        $scope.setforcus();
        if (!$scope.forcusRow) {//没有选中父节点
            BasemanService.notice("请选中父节点!");
            return;
        }
        $scope.open_forcusRow();
    }
    //查看属性
    $scope.look_detail = function () {
		$scope.setforcus();
        $scope.data.flag = 1;//增加子节点
        $scope.open_forcusRow();
    }
	//删除
	$scope.delete = function () {
        $scope.setforcus();
        if (!$scope.forcusRow || $scope.forcusRow.isitem == "1") {//没有选中删除对象
            BasemanService.notice("请选需要删除的子节点!");
            return;
        }
        var msg = "删除" + $scope.forcusRow.areaname + "数据吗?";
        ds.dialog.confirm(msg, function () {
                BasemanService.RequestPost($scope.objconf.name, "delete", $scope.forcusRow).then(function () {
					$scope.setTreeDelData($scope.items,$scope.forcusRow,$scope.objconf.key)
					$scope.options.api.setRowData($scope.items);
			        $scope.options.columnApi.autoSizeColumns($scope.keys);
                })
            }, function () {

            }
        );
    }
	$scope.refresh =function(){
		var nodes = $scope.options.api.getModel().childrenAfterGroup
		$scope.options.api.refreshRows(nodes);
		BasemanService.notice("刷新成功!");
		
	}
	$scope.rowClicked =function(e){
		var data = $scope.gridGetRow('options');
		var postdata ={};
		postdata[$scope.objconf.key]=data[$scope.objconf.key];
		if(!data.children||data.children.length==0){		
		BasemanService.RequestPost(classid, action, postdata).then(function(res) {
			data.children=[];
			if(res[back_prop].length>0){
				data.children=data.children.concat(res[back_prop]);
			    data.expanded=true;
			}else{
				data.group=false;
				data.expanded=false;				
			}			
			$scope.options.api.setRowData($scope.items);
			$scope.options.columnApi.autoSizeColumns($scope.keys);
		})
	  }else{
		  if(data.expanded!=undefined){
			  data.expanded=!data.expanded
		  }
		  $scope.options.api.setRowData($scope.items);
	  }
	}
	
	$scope.rowDoubleClicked = function (e) {
        if (e == undefined) {
            var forcusRow = $scope.gridGetRow('options');
        }
        if (e.data) {
            if (e.data[$scope.objconf.key] == undefined) { //双击如果有子节点是打开
                return;
            }
            $scope.data.flag = 1;//双击弹出的是查看属性
            $scope.open_forcusRow();
        }
    }
	//定义网格的options
    $scope.options = {
		rowDoubleClicked: $scope.rowDoubleClicked,
		suppressRowClickSelection: true, // if true, clicking rows doesn't select (useful for checkbox selection)
		rowHeight: 25,
		getNodeChildDetails: function (file) {
			if (file.group) {
				file.group = file.group;
				return file;
			} else {
				return null;
			}
		},
		icons: {
			groupExpanded: '<i class="fa fa-minus-square-o"/>',
			groupContracted: '<i class="fa fa-plus-square-o"/>',
			columnRemoveFromGroup: '<i class="fa fa-remove"/>',
			filter: '<i class="fa fa-filter"/>',
			sortAscending: '<i class="fa fa-long-arrow-down"/>',
			sortDescending: '<i class="fa fa-long-arrow-up"/>',
		}
    };
	
	
};
angular
    .module('inspinia')
    .controller('ctrl_common_tree', ctrl_common_tree)
