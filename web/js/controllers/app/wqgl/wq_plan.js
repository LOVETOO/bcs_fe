'use strict';
function Wq_Plan($scope,$rootScope,BasemanService,$state,localeStorageService){

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

    $scope.data={};
    $scope.data.currItem={};
    $scope.userbean = {};
    $scope.sale_customs_price = {};

    BasemanService.pageInit($scope);
    
    //高级查询
    $scope.init_table = function(){
	    	$scope.FrmInfo={
			classid: 'app_wq_work_plan', 
			type: 'sqlback', 
			sqlBlock: "content != '强制条件所传的数据必须要和对应字段的属性一样'", 
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
    	else return BasemanService.getSqlWhere(["title","content", "creator"],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata){
    	
        if(postdata){
            postdata.sqlwhere = getSqlWhere();
        }
        $scope.highsql = "";
        BasemanService.RequestPost("app_wq_work_plan","search",postdata)
        .then(function(data){
            $scope.data.currItem.app_wq_work_plans =data.app_wq_work_plans;
             BasemanService.pageInfoOp($scope,data.pagination);
             $scope.data.currItem.app_wq_work_plans.length > 0?
                 	BasemanService.notice("搜索已完成","alert-info"):
                 		BasemanService.notice("未含有搜索记录","alert-warning");
        });
    }

    $scope.new = function(){

        localeStorageService.remove("crmman.wq_plan_detail");
        console.log($scope);
        //跳转
        $state.go("crmman.wq_plan_detail");
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
                plan_id:parseInt($scope.data.currItem.app_wq_work_plans[index].plan_id)
            };
            var promise = BasemanService.RequestPost("app_wq_work_plan","delete",postdata);
            promise.then(function(data){
                BasemanService.notice("删除成功!","alert-info");
                $scope.search();
            });
        });
    }


    $scope.edit = function(index,event){

        $scope.editobj = {plan_id: $scope.data.currItem.app_wq_work_plans[index].plan_id};
        localeStorageService.set("crmman.wq_plan_detail", $scope.editobj);
            //跳转
        $state.go("crmman.wq_plan_detail");
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
        $scope.editobj = {cust_id: $scope.data.currItem.drp_custs[index].cust_id};
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
function Wq_Plan_Detail($scope, $http, $location, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
	
		//继承基类方法
	Wq_Plan_Detail = HczyCommon.extend(Wq_Plan_Detail, ctrl_bill_public);
	Wq_Plan_Detail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);


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
			plan_id: $scope.data.currItem.plan_id
		};
		if (postdata.plan_id == undefined || postdata.plan_id == 0) {
			BasemanService.notify(notify, "资料没有保存，无法刷新", "alert-warning", 1000);
			return;
		};
		var promise = BasemanService.RequestPost("app_wq_work_plan", "select", postdata);
		promise.then(function(data) {
			$scope.data.currItem = data;
			if (flag != 2) {
				BasemanService.notify(notify, "刷新成功", "alert-info", 500);
			};
		});
    };
    
    
    //设置当前单据对象基本信息
	$scope.objconf = {
		name: "app_wq_work_plan",
		key: "plan_id",
		wftempid: 0,
		FrmInfo: {
			title: "工作计划查询",
			thead: [{
				name: "计划编码",
				code: "plan_no"
			}, {
				name: "计划标题",
				code: "title"
			}, {
				name: "计划内容",
				code: "content"
			}],
			//initsql: "stat != 99",
			action: "search",
			postdata: {},
			searchlist: ["plan_no", "title"],
			backdatas: "app_wq_work_plans"
		}
	}
    
    
    
 

//	 $scope.new = function() {
//      $scope.data={
//          };
//
//      $scope.userbean = {};
//  if(window.userbean){
//      $scope.userbean = window.userbean;
//  }
//  $scope.userbean = window.userbean;
//  };



    var _stateName = $rootScope.$state.$current.name;
	var data = localeStorageService.get(_stateName);
	
	if(data!=undefined){
	$scope.data.currItem.plan_id=data.plan_id;
	$scope.refresh(2);	
	}

	
		    $scope.delete = function(){
        ds.dialog.confirm("您确定删除这条记录吗？",function(){
            var  postdata={
                plan_id: $scope.data.currItem.plan_id
            };
            var promise = BasemanService.RequestPost("app_wq_work_plan","delete",postdata);
            promise.then(function(data){
                BasemanService.notice("删除成功!","alert-info");
                $scope.refresh(2);	
            });
        });
    }


    $scope.saveData = function() {
    	
    		var errorHint = [];

		var a = (Date.parse($scope.data.end_time) - Date.parse($scope.data.start_time)) / 3600 / 1000;
   		 if (a < 0) {
//      alert("endTime小!");
        errorHint.push("开始时间不得晚于结束时间");
  		  } 
  		  
//		var errorHint = [];

		if (!$scope.data.title) {
			errorHint.push("必须填写计划标题");
		}
		if (!$scope.data.content) {
			errorHint.push("必须填写计划内容");
		}
		if (errorHint.length != 0) {
			BasemanService.notice(errorHint, "alert-warning");
			return;
		}

		var postdata = $scope.data;

		var action = "update";
		if (postdata.plan_id == undefined || postdata.plan_id == 0) {
			action = "insert";
		}

		var promise = BasemanService.RequestPost("app_wq_work_plan", action, postdata);
		promise.then(function(data) {
			BasemanService.notice("保存成功!", "alert-info");
			$scope.data.currItem = data;
//			$state.go("gallery.work_plan_list");

		});
 
    };
    
    		//重载清界面方法
	$scope.clearinformation = function() {
		if (!$scope.data) $scope.data = {}
		$scope.data.currItem = {
			stat: 1,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			creator:window.strUserId,
			//creator:$scope.userbean.userid,
		};
		
		$scope.setitemline($scope.data.currItem);
		

	}


	$scope.initdata();

	
        
        
}

// 产品资料
angular.module('inspinia')
    .controller('Wq_Plan', Wq_Plan)
    .controller('Wq_Plan_Detail', Wq_Plan_Detail)
