/**
 * 基础打印控制器
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'jquery', 'angular', 'swalApi', 'numberApi', 'requestApi', 'constant', 'specialProperty', 'openBizObj', 'directive/hcObjProp'], defineFn);
})(function (module, controllerApi, $, angular, swalApi, numberApi, requestApi, constant, specialProperty, openBizObj) {
    'use strict';

    //声明依赖注入
    BasePrintProp.$inject = ['$scope', '$timeout', '$compile', '$q'];

    function BasePrintProp($scope, $timeout, $compile, $q) {

        $scope.footerRightButtons.close = {};//去掉关闭按钮
        $scope.footerLeftButtons.close = {};//去掉按钮

        $timeout(function () {
            var response = {};
            $q.when()
                .then(function () {
                    var LODOP = getLodop();
                    $scope.LODOP = LODOP;
                    if (($scope.LODOP == null) || (typeof($scope.LODOP.VERSION) == "undefined")) {
                        $scope.modalInstance.close();
                        return $q.reject();
                    }
                })
                .then($scope.setPrintTitle)//设置标题
                .then(function () {
                    if ($scope.printType == 'single') {
                        return $scope.getPrintSetup();
                    }

                    var rows = angular.copy($scope.data.rows);
                    rows.forEach(function (row) {
                        $scope.data = row;
                        $timeout(function () {
                            $scope.getPrintSetup();
                            $scope.LODOP.NEWPAGEA();
                        }, 5);
                    })
                })
                .then(function () {
                    $scope.printMode = $scope.printMode ? $scope.printMode : 'preview';
                    if ($scope.printMode == 'design') { //设计模式
                        return $scope.LODOP.PRINT_DESIGN();
                    }
                    if ($scope.printMode == 'setup') { //维护模式
                        return $scope.LODOP.PRINT_SETUP();
                    }
                    return $scope.LODOP.PREVIEW(); //预览模式
                })
                .then(function () {
                    if ($scope.afterPrint) {
                        $scope.afterPrint();
                        return $q.resolve();
                    }
                })
                .then(function () {

                    var count = $scope.LODOP.GET_VALUE('PRINTED_TIMES');
                    //打印次数控制
                    if ($scope.printTemplate.is_printnum_control == 2 && $scope.printMode == 'preview') {
                        var postParams = {};

                        postParams.classId = $scope.data.classId;
                        postParams.action = 'updateprint';
                        postParams.data = $scope.data.currItem;
                        postParams.data.print_count =
                            postParams.data[$scope.data.idField] = $scope.data.currItem[$scope.data.idField];

                        requestApi.post(postParams)
                    }
                })
                .then(function () {
                    $scope.modalInstance.close(response);
                })
        }, 100)

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: BasePrintProp
    });
});
