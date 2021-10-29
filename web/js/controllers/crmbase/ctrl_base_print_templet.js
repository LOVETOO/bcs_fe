
function PrintTemplateController($scope,$state,BasemanService,localeStorageService,$rootScope){
	
	localeStorageService.pageHistory($scope,function(){
		$scope.base_print_templets.page_info = {
				oldPage : $scope.oldPage,
			    currentPage : $scope.currentPage,
			    pageSize : $scope.pageSize,
			    totalCount : $scope.totalCount,
			    pages : $scope.pages
			}
		return $scope.base_print_templets
	});
	
	BasemanService.pageInit($scope);
	
	// 查询
    function getSqlWhere(){
    	return BasemanService.getSqlWhere([],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata){
    	if(postdata){
    		postdata.sqlwhere = getSqlWhere();
    	}
    	BasemanService.RequestPost("base_print_templet","search",postdata)
        .then(function(data){
        	 $scope.base_print_templets = data.base_print_templets;
	       	 BasemanService.pageInfoOp($scope,data.pagination);
        });
    }
	
	$scope.so_delete = function(index){
		ds.dialog.confirm("您确定删除这条记录吗？",function(){
			var  postdata={
					templet_id:$scope.base_print_templets[index].templet_id
			};
			BasemanService.RequestPost("base_print_templet","delete",postdata)
			.then(function(data){
				$scope.base_print_templets.splice(index,1);
			});
		});
	}
	
	$scope.new = function(){
		localeStorageService.remove("crmman.printTemplateEdit");
		//跳转
		$state.go("crmman.printTemplateEdit");
	}
	
	//跳转编辑
	$scope.edit = function(index,event){
		
//		BasemanService.setEditObj({key:"base_print_templet",value:$scope.base_print_templets[index].templet_id});
//		$(event.currentTarget).closest(".ibox-content").siblings(".ibox-title")
//		.find("a[ui-sref='gallery.printTemplateEdit']").trigger("click");
		
		$scope.editobj = {templet_id:$scope.base_print_templets[index].templet_id};
		localeStorageService.set("crmman.printTemplateEdit", $scope.editobj);
		$state.go("crmman.printTemplateEdit");
	}
	
	var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
    if(temp){
    	$scope.base_print_templets = temp;
    	
    	$scope.oldPage = temp.page_info.oldPage;
	    $scope.currentPage = temp.page_info.currentPage;
	    $scope.pageSize = temp.page_info.pageSize;
	    $scope.totalCount = temp.page_info.totalCount;
	    $scope.pages = temp.page_info.pages;
    }
	
}

function PrintTemplateEditController($timeout,$rootScope,$location,$scope,notify,BasemanService,localeStorageService){
	$scope.isEdit = false;
	$scope.EditStr = "新增";
	localeStorageService.pageHistory($scope,function(){return $scope.printtpl});
	
	$scope.printtpl = {};
	$scope.objattachs = [];
	
	
	$scope.createNew = function(){
		$scope.printtpl = {
			create_time:new Date()	
		};
	}
	
	$scope.exportExl = function(){
		BasemanService.RequestPost("base_print_templet","exporttoexcel",{templet_id:$scope.printtpl.templet_id})
		.then(function(data){
			alert(data.docid);
		});
	}
	
	$scope.save = function(){
		if(!$scope.printtpl.templet_code && !$scope.printtpl.templet_name){
			alert("必填项不能为空!");
			return;
		}
		
		$scope.printtpl.objattachs = $scope.objattachs;
		
		if($scope.isEdit){
			BasemanService.RequestPost("base_print_templet","update",$scope.printtpl)
			.then(function(data){
				BasemanService.notify(notify,"更新成功！","alert-info");
			});
		}else{
			BasemanService.RequestPost("base_print_templet","insert",$scope.printtpl)
			.then(function(data){
				$scope.printtpl = data;
				$scope.isEdit = true;
				BasemanService.notify(notify,"保存成功！","alert-info");
			});
		}
	}
	$scope.search = function() {
		var FrmInfo = {};
		FrmInfo.title = "打印模板查询";
		FrmInfo.thead = [{
			name: "模板编码",
			code: "templet_code"
		}, {
			name: "模板名称",
			code: "templet_name"
		}];
		BasemanService.openCommonFrm(PoptempletController, $scope, FrmInfo)
			.result.then(function(result) {
				$scope.printtpl.templet_id = result.templet_id;
				$scope.refresh(2);
			});
	}
	$scope.refresh = function (flag) {
		var postdata = {
			templet_id: $scope.printtpl.templet_id
		};
		if (postdata.templet_id == undefined || postdata.templet_id == 0) {
			BasemanService.notify(notify, "单据没有保存，无法刷新", "alert-warning", 1000);
			return;
		};
		var promise = BasemanService.RequestPost("base_print_templet", "select", postdata);
		promise.then(function (data) {
			if (flag != 2) {
				BasemanService.notify(notify, "刷新成功", "alert-info", 500);
			};

			$scope.printtpl = data;
			$scope.printtpl.objattachs = $scope.objattachs;

		});
	}


	//关闭了当前页
	$scope.closebox = function(){
		$location.path("/gallery/printTemplate");
	}
	
	var _stateName = $rootScope.$state.$current.name;
	var data = localeStorageService.get(_stateName);
	if (data == undefined){ //非编辑
    	var temp = localeStorageService.getHistoryItem(_stateName);
    	if(temp){//历史纪录
    		$scope.printtpl = temp;
    	}else{
    		$timeout(function () {
    			$scope.createNew();
    		});
    	}
	}else{
		
		BasemanService.RequestPost("base_print_templet","select",{templet_id:data.templet_id})
        .then(function(data){
			$scope.isEdit = true;
        	$scope.printtpl = data;
        	$scope.objattachs = data.objattachs;
        });
	}
	
}

angular.module('inspinia')
	.controller("PrintTemplateController",PrintTemplateController)
	.controller("PrintTemplateEditController",PrintTemplateEditController)