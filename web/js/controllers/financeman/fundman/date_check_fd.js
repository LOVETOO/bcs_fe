/**
 * 出纳日结
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.check = function () {
                    swalApi.confirmThenSuccess({
                        title: "确定要日结吗？",
                        okFun: function () {

                            return $scope.doCheckDate();
                        },
                        okTitle: '日结成功！'
                    });
                }


                //添加按钮
                $scope.toolButtons = {

                    check: {
                        title: '日结',
                        icon: 'glyphicon glyphicon-check',
                        click: function () {
                            $scope.check && $scope.check();
                        }
                    }

                };

                //日结
                $scope.doCheckDate = function () {
                    var postData = {
                        classId: "fd_date_fund_balance",
                        action: 'datefundbalance',
                        data: {}
                    };
                    return requestApi.post(postData).then($scope.getInfo);
                }


                //上次日结信息
                $scope.getInfo = function () {
                    var postData = {
                        classId: "fd_date_fund_balance",
                        action: 'getpriorbalanceinfo',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.priorbalanceinfo = data.priorbalanceinfo;
                        });
                }


                //获上次日结信息
                $scope.getInfo();


            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);