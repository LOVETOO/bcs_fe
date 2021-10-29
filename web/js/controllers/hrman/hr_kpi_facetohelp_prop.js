/**
 *  author: Li Meng
 *  time: 2019/6/12
 *  module:绩效面谈
 **/
define(
    ['module', 'controllerApi', 'base_obj_prop', 'dateApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, dateApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                /*----------------------------------通用查询-------------------------------------------*/
                $scope.commonSearchSettingOfKpicase_name = {
                    //考核方案名称
                    afterOk: function (response) {
                        $scope.data.currItem.kpicase_name = response.kpicase_name;
                    },

                };

                //面谈主持人
                $scope.commonSearchSettingOfPresideMan = {
                    afterOk: function (response) {
                        $scope.data.currItem.presideman = response.userid;
                    },
                    sqlWhere: "actived=2"
                };
                //员工姓名
                $scope.commonSearchSettingOfUserId = {
                    afterOk: function (response) {
                        $scope.data.currItem.userid = response.userid;
                        $scope.getItem($scope.data.currItem.userid);
                    },
                    sqlWhere: "actived=2"
                };
                /*----------------------------------通用查询结束-------------------------------------------*/
                /**
                 *
                 * 自定义方法
                 *
                 */
                $scope.getItem = function (code) {
                    var postData = {
                        classId: "kpi_facetohelp",
                        action: 'search',
                        data: {flag: 1, userid: code}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.org_name = data.kpi_facetohelps[0].org_name;
                            $scope.data.currItem.positionid = data.kpi_facetohelps[0].positionid;
                        });
                };


                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 底部按钮定义
                 **/
                $scope.footerRightButtons.saveThenAdd.hide = true;

                $scope.footerLeftButtons.addRow.hide = true;

                $scope.footerLeftButtons.deleteRow.hide = true;

                /**
                 *  新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.kpi_facetohelps = [];
                    bizData.creator = strUserName;
                    bizData.create_time = dateApi.now();
                    bizData.interviewtime = new Date().format("yyyy-MM-dd");

                };
                /*----------------------------------保存数据-------------------------------------------*/

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };
            }
        ];
        /*----------------------------------保存数据结束-------------------------------------------*/

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);