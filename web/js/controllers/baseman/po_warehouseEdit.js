var billmanControllers = angular.module('inspinia');
function po_warehouseEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    po_warehouseEdit = HczyCommon.extend(po_warehouseEdit, ctrl_bill_public);
    po_warehouseEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_warehouse",
        key: "wh_id",
        //    wftempid:10150,
        FrmInfo: {},
        grids: []
    };

    /************************初始化页面***********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString()
        };
    };
    /**---------------------初始化页面----------------------*/
    //下拉值
    $scope.wh_type = [{dictvalue: 1, dictname: "成品"}, {dictvalue: 2, dictname: "外购件"}];

    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.wh_code == undefined ? errorlist.push("仓库编码为空") : 0;
        $scope.data.currItem.wh_name == undefined ? errorlist.push("仓库名称为空") : 0;
        $scope.data.currItem.org_code == undefined ? errorlist.push("部门为空") : 0;
        $scope.data.currItem.wh_addr == undefined ? errorlist.push("库存位置为空") : 0;

        if ($scope.data.currItem.wh_type == undefined||$scope.data.currItem.wh_type =="") {
            errorlist.push("仓库类型为空")
        }
        else {
            if ($scope.data.currItem.wh_type == 1) {
                $scope.data.currItem.sap_code == undefined||$scope.data.currItem.sap_code =="" ? errorlist.push("仓库类型为成品仓库SAP编码不能为空") : 0;
                $scope.data.currItem.sap_name == undefined||$scope.data.currItem.sap_name =="" ? errorlist.push("仓库类型为成品仓库SAP名称不能为空") : 0;
            }
            if($scope.data.currItem.wh_type == 2) {
                $scope.data.currItem.sap_code == undefined||$scope.data.currItem.sap_code =="" ? 0:errorlist.push("仓库类型为外购件仓库SAP编码只能为空");
                $scope.data.currItem.sap_name == undefined||$scope.data.currItem.sap_name =="" ? 0:errorlist.push("仓库类型为外购件仓库SAP名称只能为空");
            }
        }
        if (errorlist.length) {
            BasemanService.notify(notify, errorlist, "alert-danger");
            return false;
        }
        return true;
    }

    /**----------------------保存校验区域-------------------*/
    $scope.refresh_after = function () {

    }
    /*---------------------刷新------------------------------*/
    /***********************权限控制*********************/

    if (window.userbean) {
        $scope.userbean = window.userbean;
    }
    //用户权限
    $scope.user_auth = {
        //知否有区域总监权限
        area_auth: false
    };
    //业务员,区总,系总,财务,事总权限
    var mystring = $scope.userbean.stringofrole;
    $scope.user_auth.saleman_auth = mystring.indexOf("销售人员") > -1 ? true : false;
    $scope.user_auth.areamanager_auth = mystring.indexOf("大区总监") > -1 ? true : false;
    $scope.user_auth.system_auth = mystring.indexOf("外总") > -1 ? true : false;
    $scope.user_auth.departmen_auth = mystring.indexOf("事总") > -1 ? true : false;
    $scope.user_auth.infance_auth = mystring.indexOf("财务部") > -1 ? true : false;
    $scope.user_auth.admin_auth = mystring.indexOf("admin") > -1 ? true : false;

    /**---------------------权限控制-------------------*/
    /**********************弹出框值查询**************************/
    $scope.selectwh_manager = function () {
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "国家经理",
            thead: [{
                name: "用户编码",
                code: "userid",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "用户名称",
                code: "username",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构ID",
                code: "sourceorgid",
                show: true,
                iscond: true,
                type: 'string'
            }, {
                name: "机构路径",
                code: "namepath",
                show: true,
                iscond: true,
                type: 'string'
            }],
            postdata: {flag: 10},
            backdatas: "users",
            classid: "scpuser",
            searchlist: ["userid", "username", "sourceorgid"],
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.wh_manager = result.userid
        });
    }
    $scope.selectorg = function () {
        $scope.FrmInfo = {

            postdata: {},
            classid: "scporg",
            backdatas: "orgs",
            sqlBlock: "stat =2 and orgtype = 5",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;

        });
    }

    /****************************初始化**********************/
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
			usable: 2
        };
    };
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('po_warehouseEdit', po_warehouseEdit)
