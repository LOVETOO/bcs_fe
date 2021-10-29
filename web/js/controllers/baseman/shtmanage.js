/**
 * 表单管理
 * date:2019-01-24
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi','base64Api'],
    function (module, controllerApi, base_diy_page, swalApi, base64Api) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};


                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //添加按钮
                $scope.toolButtons = {
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    downloadImportFormat: {
                        title: '下载导入格式',
                        icon: 'fa fa-download',
                        click: function () {
                            $scope.downloadImportFormat && $scope.downloadImportFormat();
                        }
                    }
                };
                //打开编辑工具
                $scope.editshttemp = function(){
                    window.location.href = "hczycloud://"+window.location.host+"&user:GUID"+base64Api.encode(strLoginGuid);
                }

                $scope.downloadtool = function(){
                    //window.open(window.location.protocol + "//"+window.location.host+"/download/shtsetup.exe","工具下载","fullscreen=0");
                    window.open(window.location.protocol + "//"+window.location.host+"/download/shtsetup.exe","_self")
                }
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