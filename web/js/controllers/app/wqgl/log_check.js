'use strict';
function Log_Check($scope,$rootScope,BasemanService,$state,localeStorageService){

    $scope.data={};
    $scope.data.currItem={};
    $scope.userbean = {};
    $scope.sale_customs_price = {};


    localeStorageService.pageHistory($scope,function(){
        $scope.data.currItem.page_info = {
                oldPage : $scope.oldPage,
                currentPage : $scope.currentPage,
                pageSize : $scope.pageSize,
                totalCount : $scope.totalCount,
                pages : $scope.pages
            }
        return $scope.data.currItem
    });



    BasemanService.pageInit($scope);
    
    //高级查询
    $scope.init_table = function(){
	    	$scope.FrmInfo={
			classid: 'app_wq_work_log', //Search请求类---主表
			type: 'sqlback', //单选或多选，默认''单选
			sqlBlock: "stat != 99", //强制性的过滤条件，默认空
			}
		BasemanService.open(CommonPopController, $scope)
			.result.then(function(result) {
			    if(result.sqlwhere){
			 	$scope.highsql = result.sqlwhere;
			    }
			 $scope.search();
		});					
    }

	// 查询
	function getSqlWhere(){
		if($scope.highsql){
			return $scope.highsql;
		}
		else return BasemanService.getSqlWhere(["obj_name","title", "address"],$scope.searchtext);
	}
	$scope._pageLoad = function(postdata){
		
	    if(postdata){
	        postdata.sqlwhere = getSqlWhere();
	    }
	    $scope.highsql = "";
	    BasemanService.RequestPost("app_wq_work_log","search",postdata)
	    .then(function(data){
	        $scope.data.currItem.app_wq_work_logs =data.app_wq_work_logs;
	         BasemanService.pageInfoOp($scope,data.pagination);
	         $scope.data.currItem.app_wq_work_logs.length > 0?
	             	BasemanService.notice("搜索已完成","alert-info"):
	             		BasemanService.notice("未含有搜索记录","alert-warning");
	    });
	}

    $scope.new = function(){

        localeStorageService.remove("crmman.log_check_detail");
        console.log($scope);
        //跳转
        $state.go("crmman.log_check_detail");
    }



    //查询删除
    $scope.deletePoint = function(item) {
        return $modal.open({
            templateUrl: "views/common/Pop_Delete.html",
            controller: function($scope, $modalInstance) {
                $scope.FrmInfo = {};
                $scope.FrmInfo.title = "选择海关报价型号";

                // 确定
                $scope.ok = function() {
                    $scope.so_delete();
                };

                // 取消
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            },
            scope: $scope
        });
    };

    $scope.so_delete = function(index){
        ds.dialog.confirm("您确定删除这条记录吗？",function(){
            var  postdata={
                log_id: $scope.data.currItem.app_wq_work_logs[index].log_id
            };
            var promise = BasemanService.RequestPost("app_wq_work_log","delete",postdata);
            promise.then(function(data){
                BasemanService.notice("删除成功!","alert-info");
                $scope.search();
            });
        });
    }


    $scope.edit = function(index,event){
        $scope.editobj = {log_id: $scope.data.currItem.app_wq_work_logs[index].log_id};
        //select
        var promise = BasemanService.RequestPost("app_wq_work_log", "select", $scope.editobj);
        promise.then(function(data) {
            $scope.editobj = data;
            localeStorageService.set("crmman.log_check_detail", $scope.editobj);
            //跳转
            $state.go("crmman.log_check_detail");
        });
    }

    var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
    if(temp){
        $scope.data.currItem = temp;
        $scope.oldPage = temp.page_info.oldPage;
        $scope.currentPage = temp.page_info.currentPage;
        $scope.pageSize = temp.page_info.pageSize;
        $scope.totalCount = temp.page_info.totalCount;
        $scope.pages = temp.page_info.pages;
    }


    // 打印
  $scope.print = function(index,event){
        $scope.editobj = {cust_id: $scope.data.currItem.currItem.drp_custs[index].cust_id};
        //select
        var promise = BasemanService.RequestPost("drp_cust", "select", $scope.editobj);
        promise.then(function(data) {
            $scope.editobj = data;
            localeStorageService.set("crmman.drp_cust_print", $scope.editobj);
            //跳转
            $state.go("crmman.drp_cust_print");
        });
    }

}
//产品编辑页面
function Log_Check_Detail($scope, $location,$http, $rootScope, $modal, $timeout, BasemanService,notify,$state, localeStorageService, FormValidatorService) {

		//继承基类方法
	Log_Check_Detail = HczyCommon.extend(Log_Check_Detail, ctrl_bill_public);
	Log_Check_Detail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);




    
    $scope.data={};
    $scope.data.currItem={
    		app_wq_work_log_feeofapp_wq_work_logs :[]
    };

    $scope.userbean = {};
    
    if(window.userbean){
        $scope.userbean = window.userbean;
    }
    $scope.userbean = window.userbean;

  
    $scope.refresh = function(flag) {
        var postdata = {
            log_id: $scope.data.currItem.log_id
        };

        if (postdata.log_id == undefined || postdata.log_id == 0) {
            BasemanService.notify(notify, "资料没有保存，无法刷新", "alert-warning", 1000);
            return;
        };
        var promise = BasemanService.RequestPost("app_wq_work_log", "select", postdata);
        promise.then(function(data) {
            $scope.data.currItem = data;
            
            $scope.feeoptions.grid.setData($scope.data.currItem.app_wq_work_log_feeofapp_wq_work_logs);
            $scope.feeoptions.grid.invalidateAllRows();
            $scope.feeoptions.grid.updateRowCount();
            $scope.feeoptions.grid.render();
            
            
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            };
			
        });
    };
    
    
    
    
 
	//设置当前单据对象基本信息
	$scope.objconf = {
		name: "app_wq_work_log",
		key: "log_id",
		wftempid: 0,
		FrmInfo: {
			title: "工作日志查询",
			thead: [{
				name: "日志编码",
				code: "log_no"
			}, {
				name: "客户/终端名称",
				code: "obj_name"
			}, {
				name: "日志地址",
				code: "address"
			}],
			//initsql: "stat != 99",
			action: "search",
			postdata: {},
			searchlist: ["log_no", "obj_name"],
			backdatas: "app_wq_work_logs"
		}
	}




	$scope.delete = function(){
        ds.dialog.confirm("您确定删除这条记录吗？",function(){
            var  postdata={
                log_id: $scope.data.currItem.log_id
            };
            var promise = BasemanService.RequestPost("app_wq_work_log","delete",postdata);
            promise.then(function(data){
                BasemanService.notice("删除成功!","alert-info");
                $scope.refresh(2);	
            });
        });
    }
	
	
	



	$scope.searchCustAndTer = function() {
    BasemanService.openFrm("views/popview/pop_cusandterminal_new.html",PopCusAndTerminalController,$scope,"","lg").result.then(function(data){
    	if(data.cust_name){
    		$scope.data.currItem.obj_name=data.cust_name;
    		$scope.data.currItem.Obj_Id=data.cust_id;
    		$scope.data.currItem.address=data.address;
    		$scope.data.currItem.type=1;
    	}else{
    		$scope.data.currItem.obj_name=data.terminal_name;
    		$scope.data.currItem.Obj_Id=data.terminal_id;
    		$scope.data.currItem.address=data.address;
    		$scope.data.currItem.type=2;
    		
    	}
    	

})
    };

	//增加明细方法
	  $scope.addFee = function() {
		var grid = $scope.feeoptions.grid;
		var data = grid.getData(); 
		data.push({fee_name:"",amount:""})
		grid.setData(data);
		grid.resizeCanvas();	
    };
    //删除明细方法
   $scope.deleteFee = function() {
 		var grid = $scope.feeoptions.grid;
		var rowidx = grid.getActiveCell().row;
		var data=$scope.feeoptions.grid.getData();
		data.splice(rowidx, 1);
		grid.invalidateAllRows();
		grid.updateRowCount();
		grid.render();
    };

    $scope.saveData = function() {
    	
    	var errorHint = [];
    	
    	var a = (Date.parse($scope.data.currItem.end_time) - Date.parse($scope.data.currItem.start_time)) / 3600 / 1000;
   		 if (a < 0) {
        errorHint.push("开始时间不得晚于结束时间");
  		  } 
  		  

		if (!$scope.data.currItem.title) {
			errorHint.push("日志标题不能为空");
		}
		if (!$scope.data.currItem.content) {
			errorHint.push("日志内容不能为空");
		}
		if (errorHint.length != 0) {
			BasemanService.notice(errorHint, "alert-warning");
			return;
		}
    		
		$scope.data.currItem.customers=null;
		$scope.data.currItem.orgs=null;
		$scope.data.currItem.terminals=null;
    	
    		$scope.data.currItem.app_wq_work_log_feeofapp_wq_work_logs= $scope.feeoptions.grid.getData();
			
				var l=$scope.data.currItem.app_wq_work_log_feeofapp_wq_work_logs.length;
		for(var i=0;i<l;i++){
			$scope.data.currItem.app_wq_work_log_feeofapp_wq_work_logs[i].seq=i+1;
		}
			
    	
        	var postdata = $scope.data.currItem;

            var action = "update";
            if (postdata.log_id == undefined || postdata.log_id == 0) {
                action = "insert";
            }

            var promise = BasemanService.RequestPost("app_wq_work_log", action, postdata);
           		 promise.then(function(data) {
                 BasemanService.notice("保存成功!", "alert-info");
                 $scope.data.currItem = data;

            });
 
    };



	$scope.feeoptions = {
		editable: true,
		enableAddRow: false,
		enableCellNavigation: true,
		asyncEditorLoading: false,
		autoEdit: true,
	};
   $scope.feecolumns = [
	{
		id: "fee_name",
		name: "费用名称",
		field: "fee_name",
		width: 140,
		editor: Slick.Editors.Text
	}, {
		id: "amount",
		name: "金额",
		field: "amount",
		width: 140,
		cssClass: 'text-right',
		formatter: Slick.Formatters.Money,
		editor: Slick.Editors.Number
	}];
	
	
		//重载清界面方法
	$scope.clearinformation = function() {
		if (!$scope.data) $scope.data = {}
		$scope.data.currItem = {
			stat: 1,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			creator:window.strUserId,
			//creator:$scope.userbean.userid,
			app_wq_work_log_feeofapp_wq_work_logs:[]
		};
		
		$scope.setitemline($scope.data.currItem);
		
		if ($scope.feeoptions.grid)
		{
			$scope.feeoptions.grid.setColumns($scope.feecolumns);
		};
		

	}
	

	$scope.initdata();
    
    
    var _stateName = $rootScope.$state.$current.name;
	var data = localeStorageService.get(_stateName);
	
	if(data!=undefined){
	$scope.data.currItem.log_id=data.log_id;
		$scope.refresh(2);	
	}
}

// 产品资料
angular.module('inspinia')
    .controller('Log_Check', Log_Check)
    .controller('Log_Check_Detail', Log_Check_Detail)
