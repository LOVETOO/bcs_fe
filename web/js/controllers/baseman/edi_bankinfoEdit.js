var billmanControllers = angular.module('inspinia');
function edi_bankinfoEdit($scope, $http, $rootScope, $modal, $location, $timeout, BasemanService, $state, localeStorageService, FormValidatorService, HistoryDataService,notify) {
    //继承基类方法
    edi_bankinfoEdit = HczyCommon.extend(edi_bankinfoEdit, ctrl_bill_public);
    edi_bankinfoEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf = {
        name: "edi_bankinfo",
        key:"corpserialno2",
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
            title: "银行档案查询",
            is_high: true,
            thead: [
                {
                    name: "单号",
                    code: "corpserialno",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "英文地址",
                    code: "address",
                    show: true,
                    iscond: true,
                    type: 'string'
                }, {
                    name: "英文名称",
                    code: "engname",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "银行国家代码",
                    code: "countrycode",
                    show: true,
                    iscond: true,
                    type: 'string'
                },
                {
                    name: "状态",
                    code: "stat",
                    show: true,
                    iscond: true,
                    type: 'list',
                    dicts: [{id: 1, name: "制单"}, {id: 3, name: "启动"}, {id: 5, name: "审核"}]
                }],
            classid: "edi_bankinfo",
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
    .controller('edi_bankinfoEdit', edi_bankinfoEdit)
