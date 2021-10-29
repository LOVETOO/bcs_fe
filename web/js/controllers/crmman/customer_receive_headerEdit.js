var billmanControllers = angular.module('inspinia');
function customer_receive_headerEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    customer_receive_headerEdit = HczyCommon.extend(customer_receive_headerEdit, ctrl_bill_public);
    customer_receive_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "customer_receive_header",
        key:"receive_id",
        wftempid:10086,
        FrmInfo: {},
		grids:[]
    };

    /************************初始化页面***********************/
	var myDate= new Date();
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            stat: 1,			
            create_time:myDate.toLocaleDateString(),
            objattachs:[]
        };
    };
    /**---------------------初始化页面----------------------*/
    $scope.refresh_after= function(){
        $scope.data.currItem.record_type=Number($scope.data.currItem.record_type);
    }
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    })
    /**导出excel  来访客户接待*/
    $scope.export1 = function () {
        if ($scope.data.currItem.receive_id==""||$scope.data.currItem.receive_id==undefined) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("customer_receive_header", "exporttoexcel1", {'receive_id': $scope.data.currItem.receive_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid + '&t='
                        + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no,' +
                        ' resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    /**导出excel  来访客户接待用品明细*/
    $scope.export2 = function () {
        if ($scope.data.currItem.receive_id==""||$scope.data.currItem.receive_id==undefined) {
            BasemanService.notice("未识别单据", "alert-info");
            return;
        }
        BasemanService.RequestPost("customer_receive_header", "exporttoexcel2", {'receive_id': $scope.data.currItem.receive_id})
            .then(function (data) {
                if (data.docid != undefined && Number(data.docid) != 0) {
                    var fileurl = '/downloadfile.do?docid=' + data.docid + '&loginguid=' + window.strLoginGuid +
                        '&t=' + new Date().getTime();
                    window.open(fileurl, '_blank', 'height=100, width=400, top=0,left=0, toolbar=no,menubar=no, scrollbars=no,' +
                        ' resizable=no,location=no, status=no');
                } else {
                    BasemanService.notice("导出失败!", "alert-info");
                }
            });
    }
    /**********************弹出框值查询**************************/
    $scope.selectorg = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        $scope.FrmInfo = {

            classid: "scporg",
            backdatas: "orgs",

        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.org_code = result.code;
            $scope.data.currItem.org_name = result.orgname;
            $scope.data.currItem.org_id = result.orgid;

        });
    }
    $scope.selectcust = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {

            postdata: {},
            backdatas: "",
            sqlBlock: "(org_id=" + $scope.data.currItem.org_id
            + " or other_org_ids like '%," + $scope.data.currItem.org_id + ",%')",
            classid: "customer",
        };
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            $scope.data.currItem.cust_id = result.cust_id;
            $scope.data.currItem.cust_code = result.sap_code;
            $scope.data.currItem.cust_name = result.cust_name;
        });
    }
    $scope.selectqy_user = function () {
        if($scope.data.currItem.stat!=1){
            return
        }
        if ($scope.data.currItem.org_code == undefined || $scope.data.currItem.org_code == "") {
            BasemanService.notice("请先选部门", "alert-warning");
            return;
        }
        $scope.FrmInfo = {
            is_high:true,
            is_custom_search:true,
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
            },{
                name: "机构路径",
                code: "namepath",
                show: true,
                iscond: true,
                type: 'string'
            }],
            backdatas: "users",
            classid: "scpuser",
            postdata:{flag:10},
            sqlBlock: "(scporguser.orgid=" + $scope.data.currItem.org_id+")",
        };
        BasemanService.open(CommonPopController, $scope,"","lg")
            .result.then(function (result) {
            $scope.data.currItem.country_manager = result.username
        });
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('customer_receive_headerEdit', customer_receive_headerEdit)
