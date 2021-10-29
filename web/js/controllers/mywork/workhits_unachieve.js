
/**
 * 工作流提醒
 */
function myWorkHitsUnachieve($scope,$timeout,$location, $rootScope,$state,notify,BasemanService,localeStorageService){
	//新方法
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
    //跳转编辑
    $scope.edit = function(index, event) {
           
    }
    
    var wftempid=sessionStorage.getItem("wftempid");
    if (wftempid==null||wftempid=='undefined') {
		   wftempid=0;
    }

    // 查询
    function getSqlWhere() {
        return BasemanService.getSqlWhere(["wfname","subject"], $scope.searchtext);
    };
    $scope._pageLoad = function(postdata) {
        if (postdata) {
            postdata.sqlwhere = getSqlWhere();
    		postdata.flag = 3;
    		postdata.wftempid = wftempid;
            
        }
        //console.log(postdata);
        BasemanService.RequestPost("omsworkhint", "search", postdata)
            .then(function(data) {
            	//console.log(data);
                $scope.data.currItem = data;
                for (var i = 0; i < $scope.data.currItem.workhits.length; i++) {
                    var dph = $scope.data.currItem.workhits[i];

                    $.base64.utf8encode = true;
                    var param = { id: $scope.data.currItem.workhits[i].objid, initsql: '', userid: window.strUserId }
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

 angular.module('inspinia')
	.controller("myWorkHitsUnachieve",myWorkHitsUnachieve)
 