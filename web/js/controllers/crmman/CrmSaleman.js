'use strict';
var promanControllers = angular.module('inspinia');
function CrmSalesman($scope,$rootScope,notify,BasemanService,$state,localeStorageService){

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

 // 查询
    function getSqlWhere(){
        return BasemanService.getSqlWhere(["salesman_no","salesman_name", "org_name"],$scope.searchtext);
    }
    $scope._pageLoad = function(postdata){
        if(postdata){
            postdata.sqlwhere = getSqlWhere();
        }
       
        BasemanService.RequestPost("drp_salesman","search",postdata)
        .then(function(data){
            $scope.data.currItem.drp_salesmans =data.drp_salesmans;
             BasemanService.pageInfoOp($scope,data.pagination);
        });
    }

    $scope.new = function(){

        localeStorageService.remove("gallery.CrmSalesmanEdit");
        console.log($scope);
        //跳转
        $state.go("gallery.CrmSalesmanEdit");
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
        ds.dialog.confirm("您确定删除【整个单据】吗？",function(){
            var  postdata={
                salesman_id:parseInt($scope.data.currItem.drp_salesmans[index].salesman_id)
            };
            var promise = BasemanService.RequestPost("drp_salesman","delete",postdata);
            promise.then(function(data){
                BasemanService.notify(notify,"删除成功!","alert-info",1000);
                $scope.search();
            });
        });
    }


    $scope.edit = function(index,event){

        $scope.editobj = {salesman_id: $scope.data.currItem.drp_salesmans[index].salesman_id};
        //select
        var promise = BasemanService.RequestPost("drp_salesman", "select", $scope.editobj);
        promise.then(function(data) {
            $scope.editobj = data;
            localeStorageService.set("gallery.CrmSalesmanEdit", $scope.editobj);
            //跳转
            $state.go("gallery.CrmSalesmanEdit");
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

}
//产品编辑页面
function CrmSalesmanEdit($scope, $http, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    $rootScope.currScope = $scope;

    var _stateName = $rootScope.$state.$current.name;
    console.log("enter state = " + _stateName);
    $scope.data = localeStorageService.get(_stateName);
    if ($scope.data == undefined) {
        $scope.data = {
            currItem: {
            
        
            },
            items: [],
            currItemIndex: -1,
        };
    }


    


       $scope.search = function() {
        var FrmInfo = {};
        FrmInfo.title = "业务员资料查询";
        FrmInfo.thead = [{
            name: "业务员编码",
            code: "salesman_no"
        }, {
            name: "业务员名称",
            code: "salesman_name"
        }, {
            name: "所属部门",
            code: "org_name"
        }];
        BasemanService.openCommonFrm(DrpSalesmamController, $scope, FrmInfo)
            .result.then(function(result) {
                $scope.data.currItem.salesman_id = result.salesman_id;


                if (result.salesman_id != 0) {
                    $scope.refresh(2);
                }
            });
    }

     $scope.save = function() {
        var postdata = $scope.data.currItem;       
          $scope.data.currItem.drp_salesman_lineofdrp_salesmans = $scope.aoptions.grid.getData();
        for (var i = 0; i < $scope.data.currItem.drp_salesman_lineofdrp_salesmans.length; i++) {
             
            $scope.data.currItem.drp_salesman_lineofdrp_salesmans[i].seq = (i + 1);
        }
         
     
     
            var action = "update";
            if (postdata.salesman_id == undefined || postdata.salesman_id == 0) {
                action = "insert";
            }
            var promise = BasemanService.RequestPost("drp_salesman", action, postdata);
            promise.then(function(data) {

                BasemanService.notice("保存成功!", "alert-info");
                $scope.data.currItem = data;

            $scope.aoptions.grid.setData($scope.data.currItem.drp_salesman_lineofdrp_salesmans);    
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.updateRowCount();
            $scope.aoptions.grid.render();

            });
        
    };

        $scope.profit_stat = true;
	     $scope.show_profit = function(){
		$scope.profit_stat = !$scope.profit_stat;
	}
       $scope.refresh = function(flag) {
        var postdata = {
            salesman_id: $scope.data.currItem.salesman_id
        };


        if (postdata.salesman_id == undefined || postdata.salesman_id == 0) {
            BasemanService.notify(notify, "业务员资料没有保存，无法刷新", "alert-warning", 1000);
            return;
        };
        var promise = BasemanService.RequestPost("drp_salesman", "select", postdata);
        promise.then(function(data) {
            $scope.data.currItem = data;
            for(var i=0;i<$scope.data.currItem.drp_salesman_lineofdrp_salesmans.length;i++){
            $scope.data.currItem.drp_salesman_lineofdrp_salesmans[i].seq=(i+1);
        }
		    $scope.aoptions.grid.setData($scope.data.currItem.drp_salesman_lineofdrp_salesmans);    
            $scope.aoptions.grid.invalidateAllRows();
            $scope.aoptions.grid.updateRowCount();
            $scope.aoptions.grid.render();
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            };

        });
    };
 
     $scope.additem = function() {
        $scope.FrmInfo={};
        
       // var FrmInfo = {};
       $scope.FrmInfo.title = "客户查询";
       $scope.FrmInfo.thead = [{
        name: "编码",
        code: "cust_code"
    }, {
        name: "名称",
        code: "cust_name"
    }];
        $scope.sqlwhere=["cust_code","cust_name"]; //查询条件       
        $scope.classname="customer";   //查询后台类
        $scope.fun="search";//查询方法
        BasemanService.openFrm("views/common/Pop_CommonAdd.html",CommonAddController,$scope,"")
        .result.then(function (items){
            if(items.length){

                var grid = $scope.aoptions.grid;
                var data = grid.getData();
                for(var i=0;i<items.length;i++){
                    var tempobj = new Object();
                    tempobj.cust_name =  items[i].cust_name;
                    tempobj.cust_id =  items[i].cust_id;                     
                    tempobj.cust_code =  items[i].cust_code;
                     tempobj.seq = (i+1);                           
                    data.push(tempobj);
                }
                }
                grid.setData(data);
                grid.invalidateAllRows();
                grid.render();
    });
   
};
    $scope.delitem = function() {

        var grid = $scope.aoptions.grid;
        var rowidx = grid.getActiveCell().row;
        $scope.aoptions.grid.getData().splice(rowidx, 1);
        grid.invalidateAllRows();
        grid.updateRowCount();
        grid.render();

    };
	 $scope.new = function() {
        $scope.data.currItem = {
	drp_salesman_lineofdrp_salesmans: [],

        };
		$scope.aoptions.grid.setData($scope.data.currItem.drp_salesman_lineofdrp_salesmans);    
         
    };


      $scope.acolumns = [{
        id: "sel",
        name: "#",
        field: "seq",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    },{
        id: "salesman_no",
        name: "业务员编码",
        field: "salesman_no",
        width: 200,
       // action:$scope.searchmodel,
      //  editor:Slick.Editors.ButtonEditor
    },{
        id: "cust_name",
        name: "客户名称",
        field: "cust_name",
        width: 300,
       // editor:Slick.Editors.Text 
    },{
        id: "cust_code",
        name: "客户编码",
        field: "cust_code",
        width: 300,
       // editor:Slick.Editors.Text 
    }];

    $scope.aoptions = {
        editable: true,
        enableAddRow: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true
    };

      $scope.selectorg = function() {
        var FrmInfo = {};
        FrmInfo.title = "部门查询";
        FrmInfo.thead = [{
            name: "部门编码",
            code: "org_code"
        }, {
            name: "部门名称",
            code: "org_name"
        }];
        BasemanService.openCommonFrm(PopOrgController, $scope, FrmInfo)
            .result.then(function(result) {
                 $scope.data.currItem.idpath = result.idpath;
                $scope.data.currItem.orgid = result.org_id;
                $scope.data.currItem.org_name = result.org_name;
                 $scope.data.currItem.org_code = result.org_code;

            });
    };

    $scope.selectuser = function() {
        var FrmInfo = {};
        FrmInfo.title = "登陆用户查询";
        FrmInfo.thead = [{
            name: "登陆用户id",
            code: "userid"
        }, {
            name: "登陆用户名称",
            code: "username"
        }];
        BasemanService.openCommonFrm(PopUserController, $scope, FrmInfo)
            .result.then(function(result) {
                $scope.data.currItem.username = result.username;
                $scope.data.currItem.userid = result.userid;
            });
    };

var _stateName = $rootScope.$state.$current.name;
    var data = localeStorageService.get(_stateName);

     if (data == undefined){ //非编辑
        var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
        if(temp){//历史纪录
            $scope.data.currItem = temp;
      
        }else{
            //需加增加，定时器，否则取不到登录用户信息
            $timeout(function () {
                $scope.new();
            });
        }
      }else{
        $scope.data.currItem = data;
        $scope.refresh(2);
        
    }


   
};

promanControllers
    .controller('CrmSalesman', CrmSalesman)
    .controller('CrmSalesmanEdit', CrmSalesmanEdit)

    
