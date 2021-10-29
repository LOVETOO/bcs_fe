'use strict';
var promanControllers = angular.module('inspinia');
function CrmCustomer($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer",
        key: "cust_id",
        nextStat: "gallery.CrmCustomerEdit",
        classids: "customers",
        hasStats:false,
    }
    //继承基类方法
    CrmCustomer = HczyCommon.extend(CrmCustomer, ctrl_view_public);
    CrmCustomer.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);



    //客户等级
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_level"}).then(function (data) {
        $scope.cust_levels = data.dicts;
        var columnsOptions = $scope.viewColumns[4].options;
        for (var i = 0; i < data.dicts.length; i++) {
            var intoObj = new Object;
            intoObj.value = data.dicts[i].dictvalue;
            intoObj.desc = data.dicts[i].dictname;
            columnsOptions.push(intoObj);
        }
    })

    $scope.viewColumns = [{
        id: "id",
        name: "序号",
        field: "id",
        behavior: "select",
        cssClass: "cell-selection",
        width: 40,
        cannotTriggerInsert: true,
        resizable: false,
        selectable: false,
        focusable: false
    }, /** {
        id: "box_type",
        name: "柜型",
        field: "box_type",
        width: 100,
        options: $scope.pro_item_box_line_types,
        editor: Slick.Editors.SelectOption
    }, */{
        id: "sap_code",
        name: "SAP编码",
        field: "sap_code",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "cust_name",
        name: "客户名称",
        field: "cust_name",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "lawman",
        name: "法人代表",
        field: "lawman",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "cust_level",
        name: "客户等级",
        field: "cust_level",
        width: 120,
        options: [],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    }, {
        id: "simple_name",
        name: "简称",
        field: "simple_name",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "trade_name",
        name: "贸易名称",
        field: "trade_name",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "login_name",
        name: "注册名称",
        field: "login_name",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "usable",
        name: "是否可用",
        field: "usable",
        width: 80,
        options: [{value:"1",desc:"否"},{value:"2",desc:"是"}],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    }, {
        id: "is_black_cust",
        name: "是否黑名单",
        field: "is_black_cust",
        width: 80,
        options: [{value:"1",desc:"否"},{value:"2",desc:"是"}],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    }, {
        id: "oa_canuse",
        name: "可用OA额度",
        field: "oa_canuse", width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "invoice_address",
        name: "开票地址",
        field: "invoice_address", width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "area_name",
        name: "所在国家",
        field: "area_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "org_name",
        name: "所属机构名称",
        field: "org_name",
        width: 100,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "bank_name",
        name: "银行名称",
        field: "bank_name",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "bank_accno",
        name: "开户账号",
        field: "bank_accno",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "address",
        name: "地址",
        field: "address",
        width: 80,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "note",
        name: "备注",
        field: "note",
        width: 300,
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
    var promise = BasemanService.RequestPost("base_search", "searchdict", {dictcode:"cust_level"});
    promise.then(function(data) {
        $scope.cust_levels = HczyCommon.stringPropToNum(data.dicts);
    });

    $scope.openAreaNameFrm = function () {
        $scope.FrmInfo = {};
        $scope.FrmInfo.title = "区域信息查询";
        $scope.FrmInfo.thead = [{name: "区域编码", code: "areacode"},
            {name: "区域名称", code: "areaname"}];
        $scope.FrmInfo.initsql = "areatype=2";
        $scope.sqlwhere = ["areacode", "areaname"]
        $scope.classname = "scparea";
        $scope.fun = "search";
        BasemanService.openFrm("views/common/Pop_Common.html", CommonController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.area_name = result.areaname;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_id = result.areaid;
        });
    };
}

// 产品资料
promanControllers
    .controller('CrmCustomer', CrmCustomer)
 
