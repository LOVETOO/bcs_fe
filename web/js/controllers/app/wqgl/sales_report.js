'use strict';
function Sales_Report($scope,$rootScope,BasemanService,$state,localeStorageService){

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

    BasemanService.pageInit($scope);

 // 查询
    function getSqlWhere(){
        return BasemanService.getSqlWhere(["obj_name","cus_name", "address"],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata){

        if(postdata){
            postdata.sqlwhere = getSqlWhere();
        }

        BasemanService.RequestPost("app_wq_sales_report_header","search",postdata)
            .then(function(data){
                $scope.data.currItem.app_wq_sales_report_headers =data.app_wq_sales_report_headers;
                BasemanService.pageInfoOp($scope,data.pagination);
            });
    }

    $scope.new = function(){

        localeStorageService.remove("crmman.sales_report_detail");
        console.log($scope);
        //跳转
        $state.go("crmman.sales_report_detail");
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
                rep_id: $scope.data.currItem.app_wq_sales_report_headers[index].rep_id,
                obj_id: $scope.data.currItem.app_wq_sales_report_headers[index].obj_id,
                start_time: $scope.data.currItem.app_wq_sales_report_headers[index].start_time,
                end_time: $scope.data.currItem.app_wq_sales_report_headers[index].end_time
            };
            var promise = BasemanService.RequestPost("app_wq_sales_report_header","delete",postdata);
            promise.then(function(data){
                BasemanService.notice("删除成功!","alert-info");
                $scope.search();
            });
        });
    }


    $scope.edit = function(index,event){

        $scope.editobj = {rep_id: $scope.data.currItem.app_wq_sales_report_headers[index].rep_id};
//      //select
//      var promise = BasemanService.RequestPost("drp_cust", "select", $scope.editobj);
//      promise.then(function(data) {
//          $scope.editobj = data;
            localeStorageService.set("crmman.sales_report_detail", $scope.editobj);
            //跳转
            $state.go("crmman.sales_report_detail");
//      });
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



}
//产品编辑页面
function Sales_Report_Detail($scope, $http, $location,$rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
	localeStorageService.pageHistory($scope,function(){return $scope.data.currItem});
	//继承基类方法
	Sales_Report_Detail = HczyCommon.extend(Sales_Report_Detail, ctrl_bill_public);
	Sales_Report_Detail.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);



    $scope.data={};
    $scope.data.currItem={
    		app_wq_sales_report_lineofapp_wq_sales_report_headers :[]
    };

    $scope.userbean = {};
    
    if(window.userbean){
        $scope.userbean = window.userbean;
    }
    $scope.userbean = window.userbean;

  
         $scope.refresh = function(flag) {
        var postdata = {
            rep_id: $scope.data.currItem.rep_id
        };

        if (postdata.rep_id == undefined || postdata.rep_id == 0) {
            BasemanService.notify(notify, "资料没有保存，无法刷新", "alert-warning", 1000);
            return;
        };
        
        var promise = BasemanService.RequestPost("app_wq_sales_report_header", "select", postdata);
        promise.then(function(data) {
            $scope.data.currItem = data;
            $scope.samoptions.grid.setData($scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers);
            $scope.samoptions.grid.invalidateAllRows();
            $scope.samoptions.grid.updateRowCount();
            $scope.samoptions.grid.render();
            
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            };
			
        });
    };
    
      //设置当前单据对象基本信息
	$scope.objconf = {
		name: "app_wq_sales_report_header",
		key: "rep_id",
		wftempid: 0,
		FrmInfo: {
			title: "销量上报查询",
			thead: [{
				name: "上报编码",
				code: "rep_no"
			}, {
				name: "终端/客户名称",
				code: "obj_name"
			}, {
				name: "上报者",
				code: "creator"
			}],
			//initsql: "stat != 99",
			action: "search",
			postdata: {},
			searchlist: ["rep_no", "obj_name"],
			backdatas: "app_wq_sales_report_headers"
		}
	}
    

	$scope.searchSam = function() {
		BasemanService.openFrm("views/popview/pop_samples.html", PopSampleController, $scope, "", "lg");

	};

	//删除明细方法
	$scope.deleteSam = function() {
		var grid = $scope.samoptions.grid;
		var rowidx = grid.getActiveCell().row;
		var data = $scope.samoptions.grid.getData();
		data.splice(rowidx, 1);
		grid.invalidateAllRows();
		grid.updateRowCount();
		grid.render();
	};

    var _stateName = $rootScope.$state.$current.name;
	var data = localeStorageService.get(_stateName);
	
	if(data!=undefined){
	$scope.data.currItem.rep_id=data.rep_id;
	$scope.refresh(2);	
	}

	$scope.searchCustAndTer = function() {
    BasemanService.openFrm("views/popview/pop_cusandterminal_new.html",PopCusAndTerminalController,$scope,"","lg").result.then(function(data){
    	if(data.cust_name){
    		$scope.data.currItem.obj_name=data.cust_name;
    		$scope.data.currItem.obj_id=data.cust_id;
    		$scope.data.currItem.address=data.address;
    		$scope.data.currItem.type=1;
    	}else{
    		$scope.data.currItem.obj_name=data.terminal_name;
    		$scope.data.currItem.obj_id=data.terminal_id;
    		$scope.data.currItem.address=data.address;
    		$scope.data.currItem.type=2;
    		
    	}
})
    };


	$scope.saveData = function() {
		$scope.data.currItem.customers = null;
		$scope.data.currItem.selected_data = null;
		$scope.data.currItem.samples = null;
		$scope.data.currItem.terminals = null;

		$scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers = $scope.samoptions.grid.getData();
		
		var l=$scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers.length;
		for(var i=0;i<l;i++){
			$scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers[i].seq=i+1;
		}

		var errorHint = [];

		if (!$scope.data.currItem.obj_name) {
			errorHint.push("必须选择上报的终端");
		}
		if ($scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers.length==0) {
			errorHint.push("必须有售货信息");
		}
		
		if(!$scope.data.currItem.start_time){
			errorHint.push("必须有开始时间");
		}
		
		if(!$scope.data.currItem.end_time){
			errorHint.push("必须有结束时间");
		}
		
		if($scope.data.currItem.start_time&&$scope.data.currItem.end_time){
			var start=$scope.data.currItem.start_time.substring(0,7);
			var end=$scope.data.currItem.end_time.substring(0,7);
			if(start!=end){
					errorHint.push("开始时间与结束时间必须在同一月份");
			}
		}
		
		
		if (errorHint.length != 0) {
			BasemanService.notice(errorHint, "alert-warning");
			return;
		}
		
		



		var postdata = $scope.data.currItem;

		var action = "update";
		if (postdata.rep_id == undefined || postdata.rep_id == 0) {
			action = "insert";
		}

		var promise = BasemanService.RequestPost("app_wq_sales_report_header", action, postdata);
		promise.then(function(data) {
			BasemanService.notice("保存成功!", "alert-info");
			$scope.data.currItem = data;
			


		});

	};
	
	

	


    $scope.save = function() {
    	
    $scope.data.currItem.customers = null;
		$scope.data.currItem.selected_data = null;
		$scope.data.currItem.samples = null;
		$scope.data.currItem.terminals = null;

		$scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers = $scope.samoptions.grid.getData();
		
		var l=$scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers.length;
		for(var i=0;i<l;i++){
			$scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers[i].seq=i+1;
		}

		var errorHint = [];

		if (!$scope.data.currItem.obj_name) {
			errorHint.push("必须选择上报的终端");
		}
		if ($scope.data.currItem.app_wq_sales_report_lineofapp_wq_sales_report_headers.length==0) {
			errorHint.push("必须有售货信息");
		}
		if (errorHint.length != 0) {
			BasemanService.notice(errorHint, "alert-warning");
			return;
		}



		var postdata = $scope.data.currItem;

		var action = "update";
		if (postdata.rep_id == undefined || postdata.rep_id == 0) {
			action = "insert";
		}

		var promise = BasemanService.RequestPost("app_wq_sales_report_header", action, postdata);
		promise.then(function(data) {
			BasemanService.notice("保存成功!", "alert-info");
			$scope.data.currItem = data;
			


		});
 
    };



	$scope.samoptions = {
		line_name:"app_wq_sales_report_lineofapp_wq_sales_report_headers",
		editable: true,
		enableAddRow: false,
		enableCellNavigation: true,
		asyncEditorLoading: false,
		autoEdit: true,
	};
	
	$scope.samcolumns = [{
		id: "spec",
		name: "型号",
		field: "spec",
		width: 200,
		cssClass: 'text-right',
		//		editor: Slick.Editors.Text
	}, {
		id: "qty",
		name: "数量",
		field: "qty",
		width: 60,
		cssClass: 'text-right',
		editor: Slick.Editors.Number
	}, {
		id: "price",
		name: "单价",
		field: "price",
		width: 60,
		cssClass: 'text-right',
		formatter: Slick.Formatters.Money,
		editor: Slick.Editors.Number
	}, {
		id: "type",
		name: "类型",
		field: "type",
		width: 60,
		cssClass: 'text-right',
		options: [{
			value: 1,
			desc: "销售"
		}, {
			value: 2,
			desc: "退货"
		}],
		editor: Slick.Editors.SelectOption,
		formatter: Slick.Formatters.SelectOption
	}];
	
		//重载清界面方法
	$scope.clearinformation = function() {
		if (!$scope.data) $scope.data = {}
		$scope.data.currItem = {
			stat: 1,
			create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
			creator:window.strUserId,
			//creator:$scope.userbean.userid,
			app_wq_sales_report_lineofapp_wq_sales_report_headers:[]
		};
		
		$scope.setitemline($scope.data.currItem);
		
		if ($scope.samoptions.grid)
		{
			$scope.samoptions.grid.setColumns($scope.samcolumns);
		};

	}


	$scope.initdata();
        
}

// 产品资料
angular.module('inspinia')
    .controller('Sales_Report', Sales_Report)
    .controller('Sales_Report_Detail', Sales_Report_Detail)
