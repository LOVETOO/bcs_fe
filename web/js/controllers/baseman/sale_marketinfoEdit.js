var billmanControllers = angular.module('inspinia');
function sale_marketinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    sale_marketinfoEdit = HczyCommon.extend(sale_marketinfoEdit, ctrl_bill_public);
    sale_marketinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "sale_marketinfo",
        key:"mi_id",
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
            create_time:myDate.toLocaleDateString()
        };
    };
    $scope.search=function () {
        $scope.FrmInfo = {
            title: "国家档案查询",
            is_high: true,
            thead: [
                {
                    name: "单号",
                    code: "mi_no",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "国家",
                    code: "area_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "部门",
                    code: "org_name",
                    show: true,
                    iscond: true,
                    type: 'string'
                },{
                    name: "状态",
                    code: "stat",
                    show: true,
                    iscond: true,
                    type: 'list',
                    dicts: [{id: 1, name: "制单"}, {id: 3, name: "启动"}, {id: 5, name: "审核"}]
                }],
            classid: "sale_marketinfo",
        }
        BasemanService.open(CommonPopController, $scope)
            .result.then(function (result) {
            for(name in result){
                $scope.data.currItem[name]=result[name];
            }
        })
    }
    //数据缓存
    $scope.initdata();
}
//加载控制器
billmanControllers
    .controller('sale_marketinfoEdit', sale_marketinfoEdit)
