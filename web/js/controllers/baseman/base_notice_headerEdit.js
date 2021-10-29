var basemanControllers = angular.module('inspinia');
function base_notice_headerEdit($scope, $location, $rootScope, $modal, notify, $timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_notice_headerEdit = HczyCommon.extend(base_notice_headerEdit, ctrl_bill_public);
    base_notice_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "base_notice_header",
        key: "notice_id",
        //wftempid:
        FrmInfo: {},
        grids: []
    };
    /**----弹出框区域*---------------*/
    $scope.selectorg = function () {
        /*if ($scope.data.currItem.stat != 1) { //当页面状态不为制单的时候阻止用户选择从而改变弹出框选择的数据
            BasemanService.notice("非制单状态下不允许修改", "alert-warning");
            return;
        }*/
        $scope.FrmInfo = {
            title: "查看部门查询",
            thead: [
                {
                    name: "部门编码",
                    code: "org_code"
                }, {
                    name: "部门名称",
                    code: "org_name"
                }],
            classid: "base_search",
            action:"searchorg",
            backdatas:"orgs",
            postdata: {},
            type:"checkbox",
            searchlist: ["org_name", "org_code"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (items) {
            if(items.length){
                var temp = HczyCommon.appendComma(items,"org_id","org_name");
                $scope.data.currItem.orgid = temp[0];
                $scope.data.currItem.org_name = temp[1];
            }
        });
    };
    $scope.selectuser = function () {
         $scope.FrmInfo = {
                title: "查看用户查询",
                thead: [
                    {
                        name: "查看人编码",
                        code: "sysuserid"
                    }, {
                        name: "查看人名称",
                        code: "username"
                    }],
                classid: "base_search",
                action: "searchuser",
                backdatas: "users",
                postdata: {},
                type:"checkbox",
                searchlist: ["sysuserid", "username"],
            };
            BasemanService.open(CommonPopController, $scope)
                .result.then(function (items) {
                if(items.length){
                    var temp = HczyCommon.appendComma(items,"userid","username");
                    $scope.data.currItem.sysuserid = temp[0];
                    $scope.data.currItem.username = temp[1];
                }
            });
        };
    $scope.refresh_after=function(){
        $scope.data.currItem.username= $scope.data.currItem.username;
        $scope.data.currItem.org_name= $scope.data.currItem.org_name;
    }
    //词汇值
    $scope.is_fjs = [{id:1, name: '否'},{id:2, name: '是'}];
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),
            //sales_user_id: $scope.userbean.userid
        };
    };
    /**------保存校验区域-----*/
        //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('base_notice_headerEdit', base_notice_headerEdit);
