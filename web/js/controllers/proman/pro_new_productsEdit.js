var promanControllers = angular.module('inspinia');
function pro_new_productsEdit($scope, $location, $http, $rootScope, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService) {
    //继承基类方法
    pro_new_productsEdit = HczyCommon.extend(pro_new_productsEdit, ctrl_bill_public);
    pro_new_productsEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "pro_new_products",
        key: "new_products_id",
        FrmInfo: {},
        grids: []
    };
    /*系统词汇*/
    //冷量
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "cool_stand"})
        .then(function (data) {
            $scope.cool_stands = HczyCommon.numPropToString(data.dicts);
        });
    //款式
    BasemanService.RequestPost("base_search", "searchdict", {dictcode: "mb_stand"})
        .then(function (data) {
            $scope.mb_stands = HczyCommon.numPropToString(data.dicts);
        });
    //大区查询
    $scope.scporg = function () {
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "orgtype=3",
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_name = result.orgname;
            $scope.data.currItem.area_code = result.code;
            $scope.data.currItem.area_id = result.orgid;
        });
    };
    //销售部门弹窗
    $scope.openSalesPartFrm = function () {
        if($scope.data.currItem.area_code==""||$scope.data.currItem.area_code==undefined){
            BasemanService.notice("请先选大区", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            classid: "scporg",
            postdata: {},
            sqlBlock: "OrgType = 5 and superid =" + $scope.data.currItem.area_id,
            backdatas: "orgs",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.manger = result.manger;
            $scope.data.currItem.note = result.note;
            $scope.data.currItem.org_id = result.orgid;
        });
    };
    //所在国家  
    $scope.openAreaNameFrm = function () {
        $scope.FrmInfo = {
            classid: "scparea",
            sqlBlock: "areatype = 2",
            postdata: {},
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            // $scope.data.currItem.area_id = result.areaid;
            // $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.country = result.areaname;
        });
    };
    //参考机型编码
    $scope.Ref_item_code = function () {
        $scope.FrmInfo = {
            classid: "pro_item_header",
            postdata: {},
            sqlBlock: "1=1",
            backdatas: "pro_item_headers",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.ref_item_code = result.item_h_code;
            $scope.data.currItem.ref_item_name = result.item_h_name;
            $scope.data.currItem.ref_item_id = result.item_h_id;
            var postdata = {};
            postdata.item_h_code = result.item_h_code;
            postdata.item_h_name = result.item_h_name;
            postdata.item_h_id = result.item_h_id;
            BasemanService.RequestPost("pro_new_products", "getprice", postdata)
                .then(function (data) {
                    $scope.data.currItem.base_price = parseFloat(data.base_price || 0);
                    $scope.data.currItem.settle_price = parseFloat(data.settle_price || 0);
                    $scope.data.currItem.guide_price = parseFloat(data.guide_price || 0);
                })
        });
    };
    //分类
    $scope.item_type_no = function () {
        $scope.FrmInfo = {
            title: "机构查询",
            is_high: true,
            thead: [{
                name: "产品类别编码",
                code: "item_type_no",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "产品类别名称",
                code: "item_type_name",
                show: true,
                iscond: true,
                type: 'string'
            }],
            classid: "pro_item_type",
            postdata: {},
            sqlBlock: "usable = 2",
            searchlist: ["item_type_no", "item_type_name"],
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.item_type_no = result.item_type_no;
            $scope.data.currItem.item_type_name = result.item_type_name;
            $scope.data.currItem.item_type_id = result.item_type_id;
        });
    };
    $scope.save_before = function () {
        var postdata = $scope.data.currItem;
        postdata.item_type_id = 0;
    };
    //刷新
    $scope.refresh_after=function(){
        // $scope.data.currItem.cool_stand=Number($scope.data.currItem.cool_stand||0);
    };
    //初始化
    $scope.beforerefresh = function () {
        if (window.userbean.stringofrole.indexOf("admins") != -1||window.userbean.stringofrole.indexOf("财务部") != -1||window.userbean.stringofrole.indexOf("admin") != -1) {
            $scope.s_flag=1;
        }else if(window.userbean.stringofrole.indexOf("销售人员") != -1){
            $scope.s_flag=2;
        }else{
            $scope.s_flag=3;
        }
    };
    $scope.beforerefresh();
    $scope.clearinformation = function () {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.is_usable = 2;
        $scope.data.currItem.create_time = new Date();
        $scope.data.currItem.creator = window.userbean.userid;
        // $scope.data.currItem.objattachs=[]
    };
    $scope.initdata();
}//加载控制器
promanControllers
    .controller('pro_new_productsEdit', pro_new_productsEdit)

