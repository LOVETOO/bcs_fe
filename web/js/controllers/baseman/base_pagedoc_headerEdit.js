var basemanControllers = angular.module('inspinia');
function base_pagedoc_headerEdit($scope, $location, $rootScope, $modal, notify,$timeout, BasemanService, $state, localeStorageService, FormValidatorService) {
    //继承基类方法
    base_pagedoc_headerEdit = HczyCommon.extend(base_pagedoc_headerEdit, ctrl_bill_public);
    base_pagedoc_headerEdit.__super__.constructor.apply(this, [$rootScope, $scope, $location, $modal, $timeout, BasemanService, $state, localeStorageService, FormValidatorService]);
    //设置当前单据对象基本信息
    $scope.objconf={
        name:"base_pagedoc_header",
        key:"pagedoc_id",
        //wftempid:
        FrmInfo: {},
        grids:[]
    };
    /**----弹出框区域*---------------*/
    //状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"}).then(function (data) {
        $scope.stats = HczyCommon.stringPropToNum(data.dicts);
    })
    //词汇值
    $scope.info_types=[{
        id: 1,
        name: "公告"
    }, {
        id: 2,
        name: "学习园地"
    }, {
        id: 3,
        name: "管理制度"
    }];
    //界面初始化
    $scope.clearinformation = function () {
        $scope.data = {};
        $scope.data.currItem = {
            creator: window.strUserId,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss')
        };
    };

    /**------保存校验区域-----*/
    //数据缓存
    $scope.initdata();

}

//加载控制器
basemanControllers
    .controller('base_pagedoc_headerEdit', base_pagedoc_headerEdit);
