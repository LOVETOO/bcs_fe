
/**
 * 客户开户申请
 */
'use strict';
var billmanControllers = angular.module('inspinia');
function customerapplyheaderController($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService){
    //继承基类方法
    customerapplyheaderController = HczyCommon.extend(customerapplyheaderController, ctrl_view_public);
    customerapplyheaderController.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);
    BasemanService.pageInit($scope);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer_apply_header",
        key: "cust_apply_id",
        nextStat: "gallery.CustomerApplyHeaderEdit",
        classids: "customer_apply_headers",
    };
    //网格
    $scope.viewColumns = [{
        id: "id",
        name: "#",
        field: "id",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    },{
        id: "stat",
        name: "状态",
        field: "stat",
        width: 80,
        options: [],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    },{
        id: "cust_level",
        name: "客户等级",
        field: "cust_level",
        width: 120,
        options: [],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    },{
        id: "cust_apply_no",
        name: "申请单号",
        field: "cust_apply_no",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "cust_name",
        name: "客户名称",
        field: "cust_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "lawman",
        name: "法人代表",
        field: "lawman",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "simple_name",
        name: "简称",
        field: "simple_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "trade_name",
        name: "贸易名称",
        field: "trade_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "login_name",
        name: "注册名称",
        field: "login_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "oa_canuse",
        name: "OA额度",
        field: "oa_canuse",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "address",
        name: "地址",
        field: "address",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "area_name",
        name: "所在国家",
        field: "area_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "currency_name",
        name: "货币",
        field: "currency_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "bank_name",
        name: "银行名称",
        field: "bank_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "bank_accno",
        name: "开户行账号",
        field: "bank_accno",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "address",
        name: "地址",
        field: "address",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "note",
        name: "备注",
        field: "note",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }];
    
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {};
        $scope.data.currItem = {};
        $scope.data.currItem[$scope.objconf.classids] = [];
    };
    $scope.clearinformation();

    //$scope.addColumns($scope.viewColumns);

    $scope.initData();


    //客户等级类型
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
        var columnsOptions = $scope.viewColumns[2].options;
        for (var i = 0; i < data.dicts.length; i++) {
            var intoObj = new Object;
            intoObj.value = data.dicts[i].dictvalue;
            intoObj.desc = data.dicts[i].dictname;
            columnsOptions.push(intoObj);
        }
    })
    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode:"cust_level"});
    promise.then(function(data) {
        $scope.cust_levels = HczyCommon.stringPropToNum(data.dicts);
    });

    //所在国家
    $scope.openAreaNameFrm = function() {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "区域信息查询";
        $scope.FrmInfo.thead = [{name: "区域编码", code: "areacode"},
            {name: "区域名称", code: "areaname"}];
        $scope.FrmInfo.initsql="areatype=2";
        $scope.sqlwhere=["areacode","areaname"]
        $scope.classname="scparea";
        $scope.fun="search";
        BasemanService.openFrm("views/common/Pop_Common.html",CommonController,$scope)
            .result.then(function(result) {
            $scope.data.currItem.area_name=result.areaname;
            $scope.data.currItem.area_code=result.areacode;
            $scope.data.currItem.area_id=result.areaid;
        });
    };
    //业务部门
    $scope.selectorg = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "销售部门查询";
        $scope.FrmInfo.thead = [{
            name: "部门",
            code: "code"
        }, {
            name: "部门名称",
            code: "orgname"
        }, {
            name: "负责人",
            code: "manager"
        }];
        $scope.containers="orgs";
        $scope.sqlwhere = ["code", "orgname","manager"]
        $scope.classname = "scporg";
        $scope.fun = "search";
        $scope.FrmInfo.initsql = "stat =2 and OrgType = 5";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.org_name = result.orgname;
            //$scope.data.currItem.areano = result.orgname;
            //$scope.data.currItem.manager = result.manager;


        });
    }

}
//加载
billmanControllers
angular.module('inspinia')
    .controller("customerapplyheaderController",customerapplyheaderController)