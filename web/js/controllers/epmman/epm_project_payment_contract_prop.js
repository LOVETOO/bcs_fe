/**
 * 项目付款合同-属性页
 * shenguocheng
 * 2019-07-19
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
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
                    postData: {
                        search_flag: 120
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.contract_character = 'AP'; //"AP"--项目付款合同
                    bizData.flag = 1;
                };

                /**
                 * 校验电话号码
                 */
                $scope.checkPhone = function (args) {
                    var phone = 0;
                    if (args == 1) {
                        phone = $scope.data.currItem.party_a_phone;
                    } else if (args == 2) {
                        phone = $scope.data.currItem.party_b_phone;
                    }
                    if ((!/^1[3|4|5|7|8|9]\d{9}$/.test(phone)) &&
                        (!/^((\(?0[1-9]\d{1,2}\)?(-?|\\s{0,1}))|(0[1-9]\d{1,2}(-?|\\s{0,1})))?\d{7,8}$/.test(phone))) {
                        if (args == 1) {
                            $scope.data.currItem.party_a_phone = '';
                        } else if (args == 2) {
                            $scope.data.currItem.party_b_phone = '';
                        }
                        return swalApi.info("请正确输入电话号码");
                    }
                };

                /**
                 * 校验金额
                 */
                $scope.checkAMT = function () {
                    if ($scope.data.currItem.contract_amt <= 0) {
                        swalApi.info('请输入大于0的数字');
                        $scope.data.currItem.contract_amt = '';
                    }
                };
                /*----------------------------------tab页定义-------------------------------------------*/
                $scope.tabs.attach.title = '合同附件'; 
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