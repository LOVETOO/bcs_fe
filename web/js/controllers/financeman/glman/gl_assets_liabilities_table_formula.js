/**
 * 资产负债表公式 fin_assets_liabilities_formula_table
 * Created by zhl on 2019/1/15.
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'constant', 'requestApi', 'swalApi', 'numberApi', 'openBizObj', 'strApi'],
    function (module, controllerApi, base_diy_page, constant, requestApi, swalApi, numberApi, openBizObj, strApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }
                        , {
                            field: 'assets_desc',
                            headerName: '资产',
                            width: 195,
                            cellStyle: function (params) {
                                var indent_level = numberApi.toNumber(params.data.page_indent_level_a);

                                switch (indent_level) {
                                    case 1:
                                        return {'padding-left': '10px'};
                                        break;
                                    case 2:
                                        return {'padding-left': '30px'};
                                        break;
                                    case 3:
                                        return {'padding-left': '50px'};
                                        break;
                                    case 4:
                                        return {'padding-left': '60px'};
                                        break;
                                    case 5:
                                        return {'padding-left': '80px'};
                                        break;
                                }
                            }
                        }
                        , {
                            field: 'assets_operational_rule',
                            headerName: '科目运算规则',
                            width: 185,
                            onCellDoubleClicked: function (args) {
                                if (!assetsCanEdit(args)) {
                                    return;
                                }
                                $scope.assets_setting(args);
                            },
                            cellClassRules: {
                                'editable-cell': function (params) {
                                    return assetsCanEdit(params);
                                }
                            }
                        }
                        , {
                            field: 'assets_formula',
                            headerName: '计算公式',
                            width: 200
                        }
                        , {
                            field: 'liabilities_desc',
                            headerName: '负债和所有者权益（或股东权益）',
                            width: 290,
                            cellStyle: function (params) {
                                var indent_level = numberApi.toNumber(params.data.page_indent_level_l)

                                switch (indent_level) {
                                    case 1:
                                        return {'padding-left': '10px'};
                                        break;
                                    case 2:
                                        return {'padding-left': '30px'};
                                        break;
                                    case 3:
                                        return {'padding-left': '50px'};
                                        break;
                                    case 4:
                                        return {'padding-left': '60px'};
                                        break;
                                    case 5:
                                        return {'padding-left': '90px'};
                                        break;
                                }
                            }
                        }
                        , {
                            field: 'liabilities_operational_rule',
                            headerName: '科目运算规则',
                            width: 185,
                            onCellDoubleClicked: function (args) {
                                if (!liabilitiesCanEdit(args)) {
                                    return;
                                }
                                $scope.liabilities_setting(args);
                            },
                            cellClassRules: {
                                'editable-cell': function (params) {
                                    return liabilitiesCanEdit(params);
                                }
                            }
                        }
                        , {
                            field: 'liabilities_formula',
                            headerName: '计算公式',
                            width: 195
                        }]
                };

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {
                    is_setting: 1
                };
                var gridData_temp = [];

                //网格可编辑条件-资产
                function assetsCanEdit(params) {
                    return $scope.data.currItem.is_setting == 2 && numberApi.toNumber(params.data.assets_can_setting == 2);
                }

                //网格可编辑条件-负债
                function liabilitiesCanEdit(params) {
                    return $scope.data.currItem.is_setting == 2 && numberApi.toNumber(params.data.liabilities_can_setting == 2);
                }


                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //会计科目通用查询
                $scope.chooseSubject = function () {
                    $modal.openCommonSearch({
                            classId: 'gl_account_subject',
                            checkbox: true
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.subjects = result;
                        });
                };

                /**
                 * 资产科目运算规则设置
                 */
                $scope.assets_setting = function (args) {
                    $scope.data.currItem.subjects = [];
                    //若已设置运算规则，则双击时直接显示已设置的科目
                    if (args.data.assets_operational_rule) {
                        $scope.openSettingModal_assets(args);
                    } else {
                        $scope.chooseSubject(args).then(function () {
                            $scope.openSettingModal_assets(args);
                        });
                    }
                };

                /**
                 * 打开设置模态框-资产
                 * @param args
                 */
                $scope.openSettingModal_assets = function (args) {
                    var modalInstance = openBizObj({
                        stateName: 'financeman.glman.gl_balance_param_detail',
                        width: '800px',
                        height: '400px',
                        params: {
                            title: args.data.assets_desc + '设置',
                            obj_type: 1,
                            line_no: args.data.line_no,
                            subjects: JSON.stringify($scope.data.currItem.subjects),
                            desc: args.data.assets_desc
                        }
                    });
                    top.modal_al_detail = modalInstance;
                    return modalInstance.result.then(function () {
                        $scope.$applyAsync(function () {
                            $scope.data.currItem.is_setting = 1;
                            $scope.search();
                        })
                    })
                };

                /**
                 * 负债科目运算规则设置
                 */
                $scope.liabilities_setting = function (args) {
                    $scope.data.currItem.subjects = [];
                    if (args.data.liabilities_operational_rule) {
                        $scope.openSettingModal_liabilities(args);
                    } else {
                        $scope.chooseSubject(args).then(function () {
                            $scope.openSettingModal_liabilities(args);
                        });
                    }

                };

                /**
                 * 打开设置模态框-负债
                 * @param args
                 */
                $scope.openSettingModal_liabilities = function (args) {
                    var modalInstance = openBizObj({
                        stateName: 'financeman.glman.gl_balance_param_detail',
                        width: '800px',
                        height: '400px',
                        params: {
                            title: args.data.liabilities_desc + '设置',
                            obj_type: 2,
                            line_no: args.data.line_no,
                            subjects: JSON.stringify($scope.data.currItem.subjects),
                            desc: args.data.liabilities_desc
                        }
                    });
                    top.modal_al_detail = modalInstance;
                    return modalInstance.result.then(function () {
                        $scope.$applyAsync(function () {
                            $scope.data.currItem.is_setting = 1;
                            $scope.search();
                        })
                    })
                };

                /**
                 * 查询数据
                 */
                $scope.search = function () {
                    return requestApi.post('gl_balance_sheet_param', 'search', {})
                        .then(function (data) {
                            $scope.data.currItem.gl_balance_sheet_params = data.gl_balance_sheet_params;
                            $scope.gridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_params);
                        })
                };

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then($scope.search);
                };

                //工具栏按钮
                $scope.toolButtons.cancelSetting = {
                    title: '取消设置',
                    icon: 'iconfont hc-setting',
                    click: function () {
                        $scope.data.currItem.is_setting = 1;
                        $scope.gridOptions.api.setRowData(gridData_temp);
                    },
                    hide: function () {
                        return $scope.data.currItem.is_setting == 2 ? false : true;
                    }
                };
                $scope.toolButtons.setting = {
                    title: '设置',
                    icon: 'iconfont hc-setting',
                    click: function () {
                        gridData_temp = angular.copy($scope.data.currItem.gl_balance_sheet_params);
                        $scope.data.currItem.is_setting = 2;
                        $scope.gridOptions.api.setRowData($scope.data.currItem.gl_balance_sheet_params);
                    },
                    hide: function () {
                        return $scope.data.currItem.is_setting == 2 ? true : false;
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