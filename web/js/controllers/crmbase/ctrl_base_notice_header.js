
function PubnoticeController($scope, $location, $state, $rootScope, BasemanService, localeStorageService, FormValidatorService) {
	
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
        localeStorageService.remove("crmman.pubnoticeEdit");
        //跳转
        $state.go("crmman.pubnoticeEdit");
    }

    //跳转编辑
    $scope.edit = function(index, event) {
           
    }
   
    // 删除
    $scope.so_delete = function(index) {
        ds.dialog.confirm("您确定删除这条记录吗？", function() {
            var  postdata={
					notice_id:$scope.data.currItem.base_notice_headers[index].notice_id
			};
            BasemanService.RequestPost("base_notice_header", "delete", postdata)
                .then(function() {
                    BasemanService.notice("删除成功!", "alert-info");
                    $scope.refresh();
                });

        });

    };
    // 查询
   function getSqlWhere(){
    	return BasemanService.getSqlWhere(["notice_id"],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata) {
        if(postdata){
    		postdata.sqlwhere = getSqlWhere();
    	}
        BasemanService.RequestPost("base_notice_header", "search", postdata)
            .then(function(data) {
                $scope.data.currItem = data;
                for (var i = 0; i < $scope.data.currItem.base_notice_headers.length; i++) {
                    var dph = $scope.data.currItem.base_notice_headers[i];

                    $.base64.utf8encode = true;
                    var param = { id: $scope.data.currItem.base_notice_headers[i].notice_id, initsql: '', userid: window.strUserId }
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

//公告编辑页面

function PubnoticeEditController($scope, $location, $rootScope, $modal, $timeout, BasemanService,$state, localeStorageService, FormValidatorService) {

    //继承基类方法
    PubnoticeEditController = HczyCommon.extend(PubnoticeEditController, ctrl_bill_public);
    PubnoticeEditController.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
	
	//保存的时候进行判断
	$scope.validate = function() {
        var errorlist = [];
        console.log($scope.data);
        if (!$scope.data.currItem.notice_title || $scope.data.currItem.notice_title == " ") {

            errorlist.push("请填写公告标题");
        } else if (!$scope.data.currItem.notice_content || $scope.data.currItem.notice_content == " ") {

            errorlist.push("请填写公告内容");
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
        name: "base_notice_header",
        key: "notice_id",
        FrmInfo: {
            title: "公告查询",
            thead: [{
					name: "公告单号",
					code: "notice_id"
				},{
					name: "公告名称",
					code: "notice_title"
				}],
            action: "search",
            postdata: {},
            searchlist: ["notice_title", "notice_id"],
            backdatas: "base_notice_headers",
        },
    }
    
    $scope.has_invoices = [{name:'否', id:1},
	                {name:'是', id:2}];
	
	//重载清界面方法
    $scope.clearinformation = function() {
        if (!$scope.data) $scope.data = {}
        $scope.data.currItem = {
        	stat: 1,
        	is_fj:1,
            fb_date: new Date(),
            objattachs: []
        	
        };
		$scope.setitemline($scope.data.currItem);
    }

	//将网格数据设置到对象列表
    $scope.getitemline = function(data) {
       
    }
    
    //将列表对象设置到网格
    $scope.setitemline = function(data) {
        
    };
    
	$scope.selectorg = function() {
		$scope.FrmInfo = {
			title:'查看部门查询',
			type: "checkbox",
			thead: [{
				name: "部门编码",
				code: "org_code"
			}, {
				name: "部门名称",
				code: "org_name"
			}],
			searchlist:["orgname","code"],
			classid: "base_search",
			action:"searchorg",
			backdatas:"orgs",
			postdata: {},
		};
		BasemanService.open(CommonPopController, $scope)
		.result.then(function(items) {
				//console.log(items);
				//循环拼接
				var temp = HczyCommon.appendComma(items,"org_id","org_name");
				
        		$scope.data.currItem.org_ids = temp[0];
        		$scope.data.currItem.org_names = temp[1];
			});
	}
	
	$scope.selectuser = function() {
		$scope.FrmInfo = {
			title:'查看人查询',
			type: "checkbox",
			thead: [{
				name: "查看人编码",
				code: "sysuserid"
			}, {
				name: "查看人名称",
				code: "username"
			}],
			classid: "scpuser",
			action:"search",
			postdata: {},
			searchlist:["username","sysuserid"],
			backdatas:"users",
		};
		BasemanService.open(CommonPopController, $scope)
		.result.then(function(items) {
			console.log(items);
			console.log($scope);
				var temp = HczyCommon.appendComma(items,"sysuserid","username"); 
        		$scope.data.currItem.sysuserids = temp[0];
        		$scope.data.currItem.usernames = temp[1];
			});
	}
	$scope.initdata();
}


angular.module('inspinia')
	.controller("PubnoticeController",PubnoticeController)
	.controller("PubnoticeEditController",PubnoticeEditController)