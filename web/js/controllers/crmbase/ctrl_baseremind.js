'use strict';

function BaseremindController($scope, $location, $state, $rootScope, BasemanService, localeStorageService, FormValidatorService) {

    localeStorageService.pageHistory($scope, function() {
        $scope.data.currItem.page_info = {
            oldPage: $scope.oldPage,
            currentPage: $scope.currentPage,
            pageSize: $scope.pageSize,
            totalCount: $scope.totalCount,
            pages: $scope.pages
        }
        return $scope.data.currItem
    });

    $scope.data = {};
    $scope.data.currItem = {};

    //分页初始化
    BasemanService.pageInit($scope);

    $scope.refresh = function() {
        $scope.searchtext = "";
        $scope.search();


    }
    $scope.new = function() {
        localeStorageService.remove("crmman.baseremindEdit");
        //跳转
        $state.go("crmman.baseremindEdit");
    }

    //跳转编辑
    $scope.edit = function(index, event) {
           
    }
   
    // 删除
    $scope.so_delete = function(index) {
        ds.dialog.confirm("您确定删除这条记录吗？", function() {
            var  postdata={
					remind_id:$scope.base_remind_headers[index].remind_id
			};
            BasemanService.RequestPost("base_remind_header", "delete", postdata)
                .then(function() {
                    BasemanService.notice("删除成功!", "alert-info");
                    $scope.refresh();
                });

        });

    };
    // 查询
   function getSqlWhere(){
    	return BasemanService.getSqlWhere([],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata) {
        if(postdata){
    		postdata.sqlwhere = getSqlWhere();
    	}
        BasemanService.RequestPost("base_remind_header", "search", postdata)
            .then(function(data) {
			console.log(data);
                $scope.data.currItem = data;
                for (var i = 0; i < $scope.data.currItem.base_remind_headers.length; i++) {
                    var dph = $scope.data.currItem.base_remind_headers[i];

                    $.base64.utf8encode = true;
                    var param = { id: $scope.data.currItem.base_remind_headers[i].remind_id, initsql: '', userid: window.strUserId }
                    dph.url_param = $.base64.btoa(JSON.stringify(param), true);

                }
				
                BasemanService.pageInfoOp($scope, data.pagination);
            });
    };
    var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
    if (temp) {
        $scope.data.currItem = temp;
        $scope.oldPage = temp.page_info.oldPage;
        $scope.currentPage = temp.page_info.currentPage;
        $scope.pageSize = temp.page_info.pageSize;
        $scope.totalCount = temp.page_info.totalCount;
        $scope.pages = temp.page_info.pages;
    };
}
function BaseremindEditController($scope, $location, $rootScope, $modal, $timeout, BasemanService,$state, localeStorageService, FormValidatorService) {

    //继承基类方法
    BaseremindEditController = HczyCommon.extend(BaseremindEditController, ctrl_bill_public);
    BaseremindEditController.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	
	//保存的时候进行判断
	$scope.validate = function() {
        var errorlist = [];
        console.log($scope.data);
        if (!$scope.data.currItem.remind_type || $scope.data.currItem.remind_type == " ") {

            errorlist.push("请填写提醒类型");
        } else if ($scope.data.currItem.power_type == undefined) {

            errorlist.push("请选择权限类型");
        }
        if (errorlist.length) { 
            BasemanService.notice(errorlist, "alert-warning");
            $(":disabled")[0].disabled = false;
            return false;
        }
        return true;
    };

	//设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_remind_header",
        key: "remind_id",
        FrmInfo: {
            title: "工作提醒查询",
            thead: [{
                    name: "提醒类型",
                    code: "remind_type"
                }, {
                    name: "权限类型",
                    code: "power_type"
                }, {
                    name: "备注",
                    code: "note"
                }],
            action: "search",
            postdata: {},
            searchlist: ["remind_type", "power_type", "remind_id","note"],
            backdatas: "base_remind_headers",
        },
    }
	
	
	//权限类型下拉框值
	$scope.power_types = [{id:1, name: "部门"},{id:2, name: "客户"},{id:3, name: "用户"},{id:4, name: "仓库"},{id:5, name: "终端"}];
	
	
	

	//重载清界面方法
    $scope.clearinformation = function() {
        if (!$scope.data) $scope.data = {}
		//console.log(234);
        $scope.data.currItem = {
        	usable:2,
            //isEdit:false,
			power_type:1,
        };
		$scope.setitemline($scope.data.currItem);
    }

	//将网格数据设置到对象列表
    $scope.getitemline = function(data) {
       
    }


    //将列表对象设置到网格
    $scope.setitemline = function(data) {
        
    };
	$scope.initdata();
}

angular.module('inspinia')
	.controller("BaseremindController",BaseremindController)
	.controller("BaseremindEditController",BaseremindEditController)