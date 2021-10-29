var billmanControllers = angular.module('inspinia');
function po_itemEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    po_itemEdit = HczyCommon.extend(po_itemEdit, ctrl_bill_public);
    po_itemEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "po_item",
        key: "po_item_id",
        //    wftempid:10150,
        FrmInfo: {},
        grids: []
    };
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        // $scope.data.currItem.po_item_code == undefined ? errorlist.push("外购件编码为空") : 0;
        $scope.data.currItem.po_item_name == undefined ? errorlist.push("外购件名称为空") : 0;
        $scope.data.currItem.uom_name == undefined ? errorlist.push("单位为空") : 0;

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
    $scope.selectnom = function () {
        $scope.FrmInfo = {
            is_high:true,
            is_custom_search:true,
            title: "单位查询",
            thead: [{
                name: "单位ID",
                code: "uom_id",
                show: true,
                iscond: true,
                type: 'string'

            },{
                name: "单位编码",
                code: "uom_code",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "单位名称",
                code: "uom_name",
                show: true,
                iscond: true,
                type: 'string'
            }],
            // postdata:{flag:10},
            // backdatas: "users",
            classid: "uom"
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.uom_id = result.uom_id;
            $scope.data.currItem.uom_name = result.uom_name;
        });
    }
    /************************初始化页面***********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString(),
            usable:2
        };
    };
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('po_itemEdit', po_itemEdit)
