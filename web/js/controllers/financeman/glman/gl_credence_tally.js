/**
 * 凭证过账
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
                        title: "确定要过账吗？",
                        okFun: function () {

                            return $scope.doCheckDate();
                        },
                        okTitle: '过账成功！'
                    });
                }

                $scope.uncheck = function () {
                    swalApi.confirmThenSuccess({
                        title: "确定要取消过账吗？",
                        okFun: function () {
                            var postData = {
                                classId: "gl_credence_head",
                                action: 'canceltally',
                                data: {}
                            };
                            return requestApi.post(postData);
                        },
                        okTitle: '取消成功！'
                    });

                }


                //添加按钮
                $scope.toolButtons = {

                    check: {
                        title: '过账',
                        icon: 'glyphicon glyphicon-check',
                        click: function () {
                            $scope.check && $scope.check();
                        }
                    },

                    uncheck: {
                        title: '取消过账',
                        icon: 'glyphicon glyphicon-step-backward',
                        click: function () {
                            $scope.uncheck && $scope.uncheck();
                        }

                    }

                };

                //过账
                $scope.doCheckDate = function () {
                    var postData = {
                        classId: "gl_credence_head",
                        action: 'tally',
                        data: {}
                    };
                    return requestApi.post(postData);
                }


                //总账期间
                $scope.getYearMonth = function () {
                    var postData = {
                        classId: "gl_account_subject_balance",
                        action: 'yearmonth',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.currentmonth = data.currentmonth;
                        });
                }

                $scope.getYearMonth();

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