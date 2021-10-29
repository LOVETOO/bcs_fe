/**
 * 开标结果分析 属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
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

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'competitor_name',
                        headerName: '单位名称',
                        editable: true,
                        width: 300,
                        hcRequired: true
                    }, {
                        field: 'brand',
                        headerName: '品牌',
                        editable: true
                    }, {
                        field: 'category',
                        headerName: '品类',
                        editable: true
                    }, {
                        field: 'offer_price',
                        headerName: '报价(元)',
                        type: '金额',
                        editable: true
                    }, {
                        field: 'rank',
                        headerName: '名次',
                        editable: true
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        width: 200,
                        editable: true
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //指定表格对象
                $scope.data.currGridModel = 'data.currItem.epm_project_bid_competitorofepm_project_bid_opens';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/
                //工程项目 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: function (){
                        return {
                            /* 通用查询 */
                            search_flag: 5,
                            /* 当前表名 */
                            table_name : 'epm_project_bid_result',
                            /* 当前主键名称 */
                            primary_key_name : 'project_bid_result_id',
                            /* 主键id */
                            primary_key_id :
                                $scope.data.currItem.project_bid_result_id > 0 ? $scope.data.currItem.project_bid_result_id : 0
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.report_time = result.report_time;
                        $scope.data.currItem.project_type = result.project_type;
                        $scope.data.currItem.future_prices = result.future_prices;
                        $scope.data.currItem.signup_time = result.signup_time;
                        $scope.data.currItem.signup_plan_people = result.signup_plan_people;
                        $scope.data.currItem.signup_method = result.signup_method;
                        $scope.data.currItem.project_source = result.project_source;
                        //带出【基本信息】【开标信息】【竞争对手信息】
                        promiseSearch ();
                    }
                };

                /**
                 * 修改中标
                 */
                $scope.changeCheckBox = function () {
                    if($scope.data.currItem.is_bid_win == 2){
                        $scope.data.currItem.bid_winner = undefined;
                        $scope.data.currItem.competitor_id = undefined;
                    }
                };

                function promiseSearch (){
                    requestApi.post({
                        classId: 'epm_project_bid_open',
                        action: 'select',
                        data: {
                            search_flag: 2,
                            project_id: $scope.data.currItem.project_id
                        }
                    }).then(function (response) {
                        $scope.gridOptions.hcApi.setRowData(response.epm_project_bid_competitorofepm_project_bid_opens);
                        $scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens =
                            response.epm_project_bid_competitorofepm_project_bid_opens;
                        $scope.data.currItem.bid_open_time = response.bid_open_time;
                        $scope.data.currItem.bid_open_method = response.bid_open_method;
                        $scope.data.currItem.bid_open_primary = response.bid_open_primary;
                        $scope.data.currItem.bid_open_attendee = response.bid_open_attendee;
                        $scope.data.currItem.bid_open_address = response.bid_open_address;
                    });
                }

                /**
                 *  公示项目经理 查询
                 */
                $scope.commonSearchSettingOfEmployee = {
                    postData: {
                        search_flag: 700,
                        sqlWhere: 'is_guider<>2 and stat <> 3'
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.publicity_pm_id = result.employee_id;
                        $scope.data.currItem.publicity_pm_name = result.employee_name;
                    }
                };

                /**
                 * 查询中标单位
                 */
                $scope.commonSearchSettingOfBidWinner = {
                    postData: function () {
                        return {
                            search_flag: 1,
                            project_id: $scope.data.currItem.project_id
                        };
                    },
                    beforeOpen: function () {
                        if ($scope.data.currItem.project_id == '' || $scope.data.currItem.project_id == undefined) {
                            swalApi.info('请先选择“项目编码”');
                            return false;
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.bid_winner = result.competitor_name;
                        $scope.data.currItem.competitor_id = result.competitor_id;
                    }
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_project_bid_competitorofepm_project_bid_results);
                    promiseSearch ();
                };

                /**
                 * 保存数据
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    $scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens;
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*隐藏底部右边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;
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