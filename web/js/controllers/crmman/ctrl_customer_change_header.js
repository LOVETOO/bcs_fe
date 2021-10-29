'use strict';
function ctrl_customer_change_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    ctrl_customer_change_header = HczyCommon.extend(ctrl_customer_change_header, ctrl_view_public);
    ctrl_customer_change_header.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal,
        $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService]);

    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "customer_change_header",
        key: "cust_change_id",
        nextStat: "gallery.Customer_Change_HeaderEdit",
        classids: "customer_change_headers",
    }

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "cust_type"}).then(function (data) {
        $scope.cust_types = data.dicts;
        var columnsOptions = $scope.viewColumns[3].options;
        for (var i = 0; i < data.dicts.length; i++) {
            var intoObj = new Object;
            intoObj.value = data.dicts[i].dictvalue;
            intoObj.desc = data.dicts[i].dictname;
            columnsOptions.push(intoObj);
        }
    })
    
    $scope.viewColumns = [
    {
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
        name: "单据状态",
        field: "stat",
        width: 100,
        options: [],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    },{
       id: "cust_change_no",
       name: "变更单号",
       field: "cust_change_no",
       width: 120,
       editor: Slick.Editors.ReadonlyText,
    },{
        id: "cust_type",
        name: "客户性质",
        field: "cust_type",
        width: 120,
        options: [],
        editor: Slick.Editors.ReadonlyText,
        formatter: Slick.Formatters.SelectOption,
    }, {
        id: "sap_code",
        name: "客户编码",
        field: "sap_code",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "cust_name",
        name: "客户名称",
        field: "cust_name",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "cust_desc",
        name: "客户描述",
        field: "cust_desc",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "area_id",
        name: "所在国家",
        field: "area_id",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "area_code",
        name: "所在国家",
        field: "area_code",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "area_name",
        name: "所在国家名称",
        field: "area_name",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "reg_capi",
        name: "注册资本(美元)",
        field: "reg_capi",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "lawman",
        name: "法人代表",
        field: "lawman",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "bank_id",
        name: "银行ID",
        field: "bank_id",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "bank_code",
        name: "银行编码",
        field: "bank_code",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "bank_name",
        name: "银行名称",
        field: "bank_name",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "currency_id",
        name: "Currency_Id",
        field: "currency_id",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "currency_code",
        name: "货币",
        field: "currency_code",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "currency_name",
        name: "货币名称",
        field: "currency_name",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    }, {
        id: "bank_accno",
        name: "银行帐号",
        field: "bank_accno",
        width: 120,
        editor: Slick.Editors.ReadonlyText,
    },{
        id: "note",
        name: "备注",
        field: "note",
        width: 200,
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


}

// 产品资料
angular.module('inspinia')
    .controller("ctrl_customer_change_header", ctrl_customer_change_header)
 
