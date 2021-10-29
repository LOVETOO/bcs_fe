/**
 * 标书制作 属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/
                //工程项目 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: function (){
                        return {
                            /* 通用查询 */
                            search_flag: 5,
                            /* 当前表名 */
                            table_name : 'epm_making_tender',
                            /* 当前主键名称 */
                            primary_key_name : 'making_tender_id',
                            /* 主键id */
                            primary_key_id :
                                $scope.data.currItem.making_tender_id > 0 ? $scope.data.currItem.making_tender_id : 0
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;//工程名称

                        $scope.data.currItem.project_status = result.project_status;//工程状态
                        $scope.data.currItem.bid_open_time = result.bid_open_time;//开标时间
                        $scope.data.currItem.contract_amount = result.contract_amt;//合同金额
                    }
                };

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
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