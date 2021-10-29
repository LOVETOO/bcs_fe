
var param = {};
function setData(e){
    param = e;
}

function item_class_pro($scope, BaseService, BasemanService, $stateParams) {
    $scope.data = {};
    $scope.data.currItem = {item_class_id: $stateParams.id};


    $scope.levs = [
        {id: 1, name: "一级分类"},
        {id: 2, name: "二级分类"},
        {id: 3, name: "三级分类"}
    ];

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.data.currItem.item_class_name == "" || $scope.data.currItem.item_class_name == undefined) {
            BasemanService.swal("提示", "分类名称不能为空"  );
            return;
        }
        if ($scope.data.currItem.item_class_code == "" || $scope.data.currItem.item_class_code == undefined) {
            BasemanService.swal("提示", "分类编码不能为空"  );
            return;
        }
        if ($scope.data.currItem.item_class_level == "" || $scope.data.currItem.item_class_level == undefined) {
            BasemanService.swal("提示", "分类等级不能为空"  );
            return;
        }
        var action = param.action;
        if ($scope.data.currItem.item_class_id > 0) {
            action = "update";
        }

        if (action == "update") {
            //调用后台保存方法
            BasemanService.RequestPost("item_class", action, JSON.stringify($scope.data.currItem))
                .then(function () {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
        if (action == "insert") {
            $scope.data.currItem.item_class_pid = param.pid;
            BasemanService.RequestPost("item_class", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });

        }
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.init = function () {
        if ($scope.data.currItem.item_class_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("item_class", "select", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.data.currItem = data;
                });
        } else {
            $scope.data.currItem = {
                "item_class_id": 0,
                "item_usable":2,
                "item_class_level": Number(param.item_class_level)+1
            };
        }

    };

    $scope.checkEnable = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.item_usable = 2;
        }else{
            $scope.data.currItem.item_usable = 1;
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
    .controller('item_class_pro', item_class_pro);