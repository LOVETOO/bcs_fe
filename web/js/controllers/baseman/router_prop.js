/**
 * 路由定义属性页 - 对象属性页
 * 2018-10-11
 * 2018-12-11 modify by qch
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'openBizObj'],
    function (module, controllerApi, base_obj_prop, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

                //修改标签页标题
                $scope.tabs.base.title = '路由详情';


                /*---------------------事件------------------------*/
                /**
                 * 新增单据时数据处理
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.usable = 2;
                };

                (function () {
                    var url = '';

                    Object.defineProperty($scope, 'url', {
                        get: function () {
                            return url;
                        }
                    });

                    $scope.$watchGroup(['data.currItem.pkgname', 'data.currItem.routename'], function (values) {
                        var pkgName = values[0],
                            routeName = values[1];

                        if (!pkgName || !routeName)
                            url = '';
                        else
                            url = '#/' + pkgName.replace(/\./g, '/') + '/' + routeName;
                    });
                })();

                /**
                 * 添加到菜单
                 */
                $scope.addToMenu = function () {
                    return $modal
                        .openCommonSearch({
                            title: '请选择父菜单',
                            classId: 'scpmenu',
                            postData: {
                                menupid: -1 //找顶层菜单
                            }
                        })
                        .result
                        .then(function (parentMenu) {
                            return openBizObj({
                                stateName: 'baseman.base_menu_prop',
                                params: {
                                    modid: parentMenu.modid,
                                    menuid: parentMenu.menuid,
                                    menuidpath: parentMenu.menuidpath,
                                    menuname: $scope.$eval('data.currItem.pagetitle'),
                                    webrefaddr: $scope.data.currItem.pkgname + '.' + $scope.data.currItem.routename
                                }
                            }).result;
                        });
                };

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