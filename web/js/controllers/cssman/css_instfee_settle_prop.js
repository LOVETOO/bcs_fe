/**
 * Created by zhl on 2019/7/8.
 * 安装费结算标准-属性 css_instfee_settle_prop
 */
define(
    ['module', 'controllerApi', 'base_obj_prop','swalApi','dateApi'],
    function (module, controllerApi, base_obj_prop,swalApi,dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /*---------------------数据处理--------------------------*/
                //新增数据处理
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.start_date = bizData.end_date = dateApi.today();

                };

                /*---------------------注释内容--------------------------*/
                //查询安装类型
                $scope.commonSearchSettingOfFixStep = {
                    afterOk: function (item) {
                       getCurrItem().fix_step_id = item.fix_step_id;
                       getCurrItem().fix_step_code = item.fix_step_code;
                       getCurrItem().fix_step_name = item.fix_step_name;
                    }
                };

                //查询产品分类
                $scope.commonSearchSettingOfItemClass = {
                    //产品大类
                    big: {
                        sqlWhere: ' item_class_level = 1 and item_usable =2 ',
                        afterOk: function (result) {
                            getCurrItem().item_type_id = result.item_class_id;
                            getCurrItem().item_type_no = result.item_class_code;
                            getCurrItem().item_type_name = result.item_class_name;
                        }
                    },
                    //产品小类（该业务模块的“产品小类”对应“产品分类”中的产品中类）
                    middle: {
                        beforeOpen:function(){
                            if(!getCurrItem().item_type_id){
                                swalApi.info('请先选择产品大类');
                                return false;
                            }
                        },
                        sqlWhere: function(){
                            return ' item_class_level = 2 and item_usable =2 and item_class_pid = ' + getCurrItem().item_type_id;
                        },
                        afterOk: function (result) {
                            getCurrItem().smallc_id = result.item_class_id;
                            getCurrItem().smallc_code = result.item_class_code;
                            getCurrItem().smallc_name = result.item_class_name;
                        }
                    },
                    //产品系列（该业务模块的“产品小类”对应“产品分类”中的产品小类）
                    small: {
                        beforeOpen:function(){
                            if(!getCurrItem().smallc_id){
                                swalApi.info('请先选择产品小类');
                                return false;
                            }
                        },
                        sqlWhere: function(){
                            return ' item_class_level = 3 and item_usable =2 and item_class_pid = ' + getCurrItem().smallc_id;
                        },
                        afterOk: function (result) {
                            getCurrItem().series_id = result.item_class_id;
                            getCurrItem().series_code = result.item_class_code;
                            getCurrItem().series_name = result.item_class_name;
                        }
                    }
                };

                //查产品
                $scope.commonSearchSettingOfItemOrg = {
                    beforeOpen:function(){
                        if(!getCurrItem().series_id){
                            swalApi.info('请先选择产品系列');
                            return false;
                        }
                    },
                    sqlWhere: function(){
                        return ' item_class3 = ' + getCurrItem().series_id;
                    },
                    afterOk: function (item) {
                        getCurrItem().item_id = item.item_id;
                        getCurrItem().item_code = item.item_code;
                        getCurrItem().item_name = item.item_name;
                    }
                };

                $scope.tabs.other = {
                    title: "其他"
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
