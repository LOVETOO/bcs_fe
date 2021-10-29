var basemanControllers = angular.module('inspinia');
function base_sale_orgEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_sale_orgEdit = HczyCommon.extend(base_sale_orgEdit, ctrl_bill_public);
    base_sale_orgEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_sale_org",
        key:"sale_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //部门编码
    $scope.orgname = function () {
        $scope.FrmInfo = {
            title: "部门编码",
            thead: [
                {
                    name: "机构编码",
                    code: "code"
                }, {
                    name: "机构名称",
                    code: "orgname"
                }],
            classid: "scporg",
            sqlwhere:">( idpath like '%211%') and 1=1 and stat =2 and OrgType = 5",
            postdata: {},
            searchlist: ["code", "orgname"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.orgid = result.orgid;
        });
    };
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };
    //销售组织
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "sale_org"})
    .then(function (data) {
        $scope.sale_orgs = HczyCommon.stringPropToNum(data.dicts);
    });
    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('base_sale_orgEdit', base_sale_orgEdit);
