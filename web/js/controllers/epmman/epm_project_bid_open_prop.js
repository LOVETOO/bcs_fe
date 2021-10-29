/**
 * 项目现场开标 属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi'],
    function (module, controllerApi, base_obj_prop, requestApi) {
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
                        headerName: '产品线',
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

                //指定网格对象,否则左下按钮出不来
                $scope.data.currGridModel = 'data.currItem.epm_project_bid_competitorofepm_project_bid_opens';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 *  工程项目 查询
                 */
                $scope.commonSearchSettingOfEpmProject = {
                    postData: function (){
                        return {
                            /* 通用查询 */
                            search_flag: 5,
                            /* 当前表名 */
                            table_name : 'epm_project_bid_open',
                            /* 当前主键名称 */
                            primary_key_name : 'project_bid_open_id',
                            /* 主键id */
                            primary_key_id :
                                $scope.data.currItem.project_bid_open_id > 0 ? $scope.data.currItem.project_bid_open_id : 0
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.report_time = result.report_time;
                        $scope.data.currItem.project_type = result.project_type;
                        $scope.data.currItem.future_prices = result.future_prices;
                        $scope.data.currItem.signup_start_time = result.signup_start_time;
                        $scope.data.currItem.signup_plan_people = result.signup_plan_people;
                        $scope.data.currItem.signup_plan_method = result.signup_plan_method;
                        $scope.data.currItem.project_source = result.project_source;
                        //带出开标时间、开标授权人、开标方式、开标地点
                        return requestApi.post({
                            classId: 'epm_project_bid_head',
                            action: 'select',
                            data: {
                                project_id: $scope.data.currItem.project_id,
                                search_flag: 1
                            }
                        }).then(function (response) {
                            $scope.data.currItem.bid_open_time = response.bid_open_date;
                            $scope.data.currItem.bid_open_method = response.bid_open_method;
                            $scope.data.currItem.bid_open_address = response.bid_open_address;
                            $scope.data.currItem.bid_open_primary = response.bid_open_primary;
                        });
                    }
                };

                /**
                 * 开标授权人信息 查询
                 */
                $scope.commonSearchSettingOfEpmProjectBidOpenPrimary = {
                    postData: {
                        actived: 2
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.bid_open_primary = result.username;
                    }
                };

                /**
                 * 开标出场人信息 查询
                 */
                $scope.commonSearchSettingOfEpmProjectBidOpenAttendee = {
                    postData: {
                        actived: 2
                    },
                    "classId": "scpuser",
                    "title": "用户",
                    "dataRelationName": "users",
                    "checkbox": true,
                    "keys": ["username", "userid", "username_py", "userid_py"],
                    "gridOptions": {
                        "columnDefs": [
                            {
                                "field": "username",
                                "headerName": "名称"
                            },
                            {
                                "field": "userid",
                                "headerName": "账号"
                            },
                            {
                                "field": "namepath",
                                "headerName": "所属机构"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        var username = '';
                        for (var i = 0; i < result.length; i++) {
                            if (i == result.length - 1) {
                                username = username + result[i].username;
                            } else {
                                username = username + result[i].username + ",";
                            }
                            $scope.data.currItem.bid_open_attendee = username;
                        }
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_project_bid_competitorofepm_project_bid_opens);
                };
                /**
                 * 保存数据
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.project_id;
                    $scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens;
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*隐藏底部右边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;

                /*删除明细按钮*/
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens.splice(idx, 1);
                        if ($scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens.length == 0) {
                            $scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_project_bid_competitorofepm_project_bid_opens);
                    }
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