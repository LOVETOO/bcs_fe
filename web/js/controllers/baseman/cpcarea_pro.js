
var param = {};

function setData(e){
    param = e;
}

function cpcarea_pro($scope, BaseService, BasemanService, $stateParams) {
    $scope.data = {};
    $scope.data.currItem = {areaid: $stateParams.id};


    $scope.levs = [
        {id: 1, name: "洲"},
        {id: 2, name: "国家"},
        {id: 3, name: "区域"},
        {id: 4, name: "省/直辖市"},
        {id: 5, name: "地级市/地区"},
        {id: 6, name: "县级市/县/区"},
        {id: 7, name: "乡镇/街道"}
    ];


    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.data.currItem.areaname == "" || $scope.data.currItem.areaname == undefined) {
            BasemanService.swal("提示", "名称不能为空"  );
            return;
        }
        if ($scope.data.currItem.areacode == "" || $scope.data.currItem.areacode == undefined) {
            BasemanService.swal("提示", "编码不能为空"  );
            return;
        }
        if ($scope.data.currItem.areatype == "" || $scope.data.currItem.areatype == undefined) {
            BasemanService.swal("提示", "类型不能为空"  );
            return;
        }
        var action = param.action;
        $scope.data.currItem.pareacode = param.pareacode;
        if (action == "update") {
            //调用后台保存方法
            BasemanService.RequestPost("cpcarea", action, JSON.stringify($scope.data.currItem))
                .then(function () {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
        if (action == "insert") {
            $scope.data.currItem.superid = param.pid;
            BasemanService.RequestPost("cpcarea", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });

        }
    }







    /**
     * 初始化
     * @param args
     */
    $scope.init = function () {
        if ($scope.data.currItem.areaid > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("cpcarea", "select", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.data.currItem = data;
                });
        } else {
            $scope.data.currItem = {
                "areaid": 0
            };
        }
    };



    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        isEdit = 0;
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }

}


//注册控制器
angular.module('inspinia')
    .controller('cpcarea_pro', cpcarea_pro);