var billmanControllers = angular.module('inspinia');
function sale_marketinfo_applyEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService, notify) {
    //继承基类方法
    sale_marketinfo_applyEdit = HczyCommon.extend(sale_marketinfo_applyEdit, ctrl_bill_public);
    sale_marketinfo_applyEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_marketinfo_apply",
        key: "mia_id",
        wftempid: 10167,
        FrmInfo: {},
        grids: []
    };

    /************************初始化页面***********************/
    var myDate = new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            stat: 1,
            mia_type: 1,
            creator: window.strUserId,
            create_time: myDate.toLocaleDateString(),
            org_name: window.userbean.org_name
        };
    };
    /***************下拉框*********************/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        var stats = [];
        for (var i = 0; i < data.dicts.length; i++) {
            object = {};
            object.id = data.dicts[i].dictvalue;
            object.name = data.dicts[i].dictname;
            stats.push(object);
        }
        $scope.stats = stats;
    })
    $scope.mia_type = [{dictvalue: 1, dictname: "新增"}, {dictvalue: 2, dictname: "变更"}];
    /**---------------------初始化页面----------------------*/
    /***********************保存校验区域*********************/
    $scope.validate = function () {
        var errorlist = [];
        $scope.data.currItem.area_name == undefined ? errorlist.push("国家不能为空") : 0;
        $scope.data.currItem.org_name == undefined ? errorlist.push("部门不能为空") : 0;
        $scope.data.currItem.mia_type == undefined ? errorlist.push("申请类型不能为空") : 0;
        // if($scope.data.currItem.mia_type==2) {
        //     $scope.data.currItem.mi_no == undefined ? errorlist.push("档案单号不能为空") : 0;
        // }
        if (errorlist.length) {
            BasemanService.notify(notify, errorlist, "alert-danger");
            return false;
        }
        return true;
    }
    $scope.save_before = function () {
        $scope.data.currItem.entid = 101;
        $scope.data.currItem.datalangid = 0;
        $scope.data.currItem.maxsearchrltcmt = 0;
        $scope.data.currItem.importdataflag = 1;
        $scope.data.currItem.sale_marketinfo_applys = [];
        if ($scope.data.currItem.mia_type == 1) {
            $scope.data.currItem.mi_no = "";
        }
    }
    /**----------------------保存校验区域-------------------*/
    $scope.refresh_after = function () {

    }
    /*---------------------刷新------------------------------*/
    /**********************弹出框值查询**************************/
    $scope.selectarea_name = function () {
        // if($scope.data.currItem.stat!=1){
        //     return
        // }
        $scope.FrmInfo = {
            is_high: true,
            is_custom_search: true,
            title: "国家",
            thead: [{
                name: "国家编码",
                code: "areacode",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "国家名称",
                code: "areaname",
                show: true,
                iscond: true,
                type: 'string'

            }, {
                name: "地区类型",
                code: "areatype",
                show: true,
                iscond: true,
                type: 'list',
                dicts: [{id: 1, name: "洲"}, {id: 2, name: "国家"}, {id: 3, name: "区域"},
                    {id: 4, name: "省"}, {id: 5, name: "市"}, {id: 6, name: "县"}]
            }],
            // postdata:{flag:10},
            // backdatas: "users",
            classid: "scparea"
        };
        BasemanService.open(CommonPopController, $scope, "", "lg")
            .result.then(function (result) {
            $scope.data.currItem.area_id = result.areaid;
            $scope.data.currItem.area_code = result.areacode;
            $scope.data.currItem.area_name = result.areaname;

            var postdata = {area_id: result.areaid,flag:1};
            BasemanService.RequestPost("sale_marketinfo", "search", postdata)
                .then(function (data) {
                    var items = data.sale_marketinfos;
                    if (items == undefined || items.length == 0) {
                        return
                    }

                    var item = items[0];

                    $scope.clearinformation1();

                    item.wfid = 0;
                    item.wfflag = 0
                    item.stat = 1;
                    item.creator = "";
                    item.create_time = "";
                    item.updator = "";
                    item.update_time = "";
                    item.mia_id = "";
                    item.mia_no = "";
                    item.mia_type = 2;

                    $scope.data.currItem.mi_no = items[0].mi_no;
                    for (name in item) {
                        $scope.data.currItem[name] = item[name];
                    }

                })
        });
    }
    //部门
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            postdata: {},
            sqlBlock: "stat =2 and OrgType = 5",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_id = result.orgid;
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;

        });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_marketinfo_applyEdit', sale_marketinfo_applyEdit)
