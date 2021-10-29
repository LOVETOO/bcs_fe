/**
 * 工程业绩档案属性表
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                /**数据定义 */
                $scope.data = {
                    currItem: {}
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.is_subcontract = 2;
                    bizData.resouce_type = 4;
                    bizData.stat = '在库';
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.is_usable = $scope.data.currItem.is_subcontract;
                    bizData.resouce_type = 4;
                };

                /**
                 * 开始日期、结束日期校验
                 */
                $scope.setSubtractDays = function () {
                    var completion_date = new Date($scope.data.currItem.completion_date).getTime();
                    var commencement_date = new Date($scope.data.currItem.commencement_date).getTime();
                    var subtract_days = completion_date - commencement_date;
                    if (parseInt(subtract_days / 1000 / 60 / 60 / 24) < 0) {
                        swalApi.info("验收日期必须大于开工日期");
                        $scope.data.currItem.completion_date = '';
                        $scope.data.currItem.commencement_date = '';
                    }
                };

                /**
                 * 保管人 查询
                 */
                $scope.commonSearchSettingOfKeeper = {
                    afterOk: function (result) {
                        $scope.data.currItem.keeper_name = result.username;
                        $scope.data.currItem.keeper = result.sysuserid;
                    }
                };
                /**
                 * 业绩编号 查询
                 */
                $scope.commonSearchSettingOfResouceIdentifier = {
                    postData: function () {
                        return {
                            search_flag: 120
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.resource_identifier = result.project_code;
                        $scope.data.currItem.resource_name = result.project_name;
                        $scope.data.currItem.contract_amount = result.contract_amount;
                    }
                };
                /**
                 *  证书类别 查询
                 */
                $scope.commonSearchSettingOfResouceCategory = {
                    postData: {
                        search_flag: 1,
                        resouce_type: 4
                    },
                    title: "业绩类型",
                    dataRelationName: 'epm_resouce_archivess',
                    gridOptions: {
                        columnDefs: [
                            {
                                headerName: "业绩类型编码",
                                field: "resouce_category_code"
                            }, {
                                headerName: "业绩类型名称",
                                field: "resouce_category_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.resouce_category_id = result.resouce_category_id;
                        $scope.data.currItem.resouce_category_name = result.resouce_category_name;

                    }
                };

                /*----------------------------------按钮隐藏-------------------------------------------*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

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