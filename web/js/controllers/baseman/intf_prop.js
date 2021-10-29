/**
 * 接口-属性页
 */
define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'openBizObj'], function (module, controllerApi, base_obj_prop, requestApi, swalApi, openBizObj) {
    'use strict';

    var controller = [
        //声明依赖注入
        '$scope',
        //控制器函数
        function ($scope) {
            /**---------------------数据初始化------------------------- */
            controllerApi.run({
                controller: base_obj_prop.controller,
                scope: $scope
            });

            //隐藏标签页
            $scope.tabs.wf.hide = true;
            $scope.tabs.attach.hide = true;
            //修改标签页标题
            $scope.tabs.base.title = '常规';
            /**---------------------数据定义结束---------------------- */

            /**----------------------方法开始 ------------------------*/

            $scope.schedulerButtons = {
                openScheduler: {
                    title: '查看调度',
                    click: function () {
                        return openBizObj({
                            stateName: 'baseman.scheduler_prop',
                            params: {
                                id: $scope.data.currItem.schedulerid
                            }
                        }).result;
                    },
                    hide: function () {
                        return !$scope.data.currItem.schedulerid;
                    }
                },
                createScheduler: {
                    title: '创建调度',
                    click: function () {
                        return openBizObj({
                            stateName: 'baseman.scheduler_prop'
                        }).result;
                    }
                }
            };

            $scope.commonSearch = {

                dsname: {
                    afterOk: function (ds) {
                        ['dsid', 'dsname'].forEach(function (key) {
                            $scope.data.currItem[key] = ds[key];
                        });
                    }
                },

                schedulername: {
                    afterOk: function (scheduler) {
                        ['schedulerid', 'schedulername', 'schedulerdesc'].forEach(function (key) {
                            $scope.data.currItem[key] = scheduler[key];
                        });
                    }
                }

            };

            //删除方法
            $scope.del = function () {
                var postData = {};
                postData.intfid = "102";
                requestApi.post('scpintf', 'delete', JSON.stringify(postData))
                    .then(function (data) {
                        alert(JSON.stringify(data))
                    });
            };

            /**
             * 测试连接
             */
            $scope.testConnection = function () {
                return requestApi
                    .post('scpintf', 'test', $scope.data.currItem)
                    .then(function () {
                        return swalApi.success('测试连接"' + $scope.data.currItem.intfname + '"成功!')
                    });
            };

        /**
         * 执行
         */
        $scope.execute = function () {
            return swalApi.confirm('确定要执行接口吗？')
                .then(function () {
                    return requestApi.post("scpintf", "execute", $scope.data.currItem);
                })
                .then(function (data) {
                    return swalApi.success({
                        title: "执行接口" + $scope.data.currItem.intfname + "成功",
                        text: ["源记录数" + data.sourcecount, "操作成功记录数" + data.targetcount],
                        timer: null
                    });
                });
        };
        /**----------------------方法结束-------------------------*/

        /**
         * 底部右侧按钮
         */
        $scope.footerRightButtons.testConnection = {
            icon: 'iconfont hc-jiantou_zuoyouqiehuan',
            title: '测试连接',
            click: function () {
                return $scope.testConnection();
            }
        };
        $scope.footerRightButtons.execute = {
            icon: 'iconfont hc-tijiao',
            title: '执行',
            click: function () {
                return $scope.execute();
            }
        };
    }];

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: controller
    });
});