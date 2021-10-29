var basemanControllers = angular.module('inspinia');
var basemanControllers = angular.module('inspinia');

function AreaEditController($scope, $http, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {

    localeStorageService.pageHistory($scope, function () {
        return $scope.data.currItem
    });

    $scope.data = {};
    $scope.userbean = {};
    $scope.data.currItem = {};
    $scope.init = function () {
        BasemanService.pageInit($scope);

        var postdata = {
            sqlwhere: ""
        };

        //国家地区词汇值
        var promise = BasemanService.RequestPost("base_search", "searchareatype", {});
        promise.then(function (data) {
            $scope.areatypes = HczyCommon.stringPropToNum(data.dict_area_types);
        });
        // 登录用户
        $scope.userbean = window.userbean;


        $scope.mainbtn = {
            search: false,
            add: false
        };
    };

    $scope.init();


    $scope.search = function () {
        var FrmInfo = {};
        FrmInfo.title = "国家";
        FrmInfo.thead = [{
            name: "地区名称",
            code: "areaname"
        }, {
            name: "地区编码",
            code: "areacode"
        }, {
            name: "区号",
            code: "telzone"
        }];
        BasemanService.openCommonFrm(AreaPopController, $scope, FrmInfo)
            .result.then(function (result) {
            $scope.data.currItem.areaid = result.areaid;
            $scope.refresh(2);
        });
    }

    $scope.delete = function (index) {
        var postdata = {
            areaid: $scope.data.currItem.areaid
        };
        ds.dialog.confirm("您确定删除【整个单据】吗？", function () {
            if (postdata.areaid == undefined || postdata.areaid == 0) {
                BasemanService.notify(notify, "单据ID不存在，不能删除", "alert-warning", 1000);
                return;
            }
            ;

            var promise = BasemanService.RequestPost("scparea", "delete", postdata);
            promise.then(function (data) {
                BasemanService.notify(notify, "删除成功!", "alert-info", 1000);

                $scope.clearinformation();
            });
        });
    }


    //$scope.itemoptions.api.setRowData([]);;
    $scope.refresh = function (flag) {
        var postdata = {
            areaid: $scope.data.currItem.areaid
        };
        if (postdata.areaid == undefined || postdata.areaid == 0) {
            BasemanService.notify(notify, "单据没有保存，无法刷新", "alert-warning", 1000);
            return;
        }
        ;
        var promise = BasemanService.RequestPost("scparea", "select", postdata);
        promise.then(function (data) {
            if (flag != 2) {
                BasemanService.notify(notify, "刷新成功", "alert-info", 500);
            }
            ;

            $scope.data.currItem = data;
            //new agGrid.Grid(gridDiv,$scope.itemoptions);
            //$scope.itemoptions.api.setColumnDefs($scope.itemcolumns);
            //$scope.itemoptions.api.onGroupExpandedOrCollapsed();
            $scope.itemoptions.api.setRowData($scope.data.currItem);
            if ($scope.data.currItem.stat != 1) {
                $("#areaid").attr("disabled", true);
            }
        });
    }

    $scope.save = function () {

        var postdata = $scope.data.currItem;

        if (FormValidatorService.validatorFrom($scope)) {
            var action = "update";
            if (postdata.areaid == undefined || postdata.areaid == 0) {
                var action = "insert";
            }
            var promise = BasemanService.RequestPost("scparea", action, postdata);
            promise.then(function (data) {
                BasemanService.notify(notify, "保存成功!", "alert-info", 1000);
                $scope.isEdit = true;
                $scope.data.currItem = data;


            });
        }
    }


    $scope.clearinformation = function () {
        console.log('clearinformation:' + $scope.userbean.username);
        $scope.data = {};
        $scope.data.currItem = {
            creator: $scope.userbean.userid,
            sales_user_id: $scope.userbean.userid,
            create_time: moment().format('YYYY-MM-DD HH:mm:ss'),

        };
        console.log($scope); //OK
    };

    $scope.new = function () {
        $scope.clearinformation();
    };

    var _stateName = $rootScope.$state.$current.name;
    var data = localeStorageService.get(_stateName);
    if (data == undefined) {
        var temp = localeStorageService.getHistoryItem($rootScope.$state.$current.name);
        if (temp) {//历史纪录
            $scope.data.currItem = temp;
        } else {
            $scope.new();
        }

    } else {
        $scope.data.currItem = data;
        console.log($scope.data)
    }
}

//加载控制器
basemanControllers
    .controller('AreaEditController', AreaEditController);
