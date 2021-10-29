/**
 * 利润表公式 fin_profit_formula_table
 * Created by zhl on 2019/1/15.
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'constant', 'requestApi', 'swalApi', 'numberApi', 'directive/hcButtons'],
    function (module, controllerApi, base_diy_page, constant, requestApi, swalApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.showSaveEditButton = false;
                $scope.gridData_temp = [];

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'gain_desc',
                        headerName: '项目',
                        suppressSizeToFit: true, //禁止适应宽度
                        minWidth: 300,
                        width: 400,
                        maxWidth: 500,
                        cellStyle: function (params) {
                            var indent_level = numberApi.toNumber(params.data.page_indent_level);

                            switch (indent_level){
                                case 1:
                                    return {'padding-left': '17px'};
                                    break;
                                case 2:
                                    return {'padding-left': '44px'};
                                    break;
                                case 3:
                                    return {'padding-left': '60px'};
                                    break;
                                case 4:
                                    return {'padding-left': '100px'};
                                    break;
                                default:
                                    return {'padding-left': '0'};
                                    break;
                            }
                        }

                    }, {
                        headerName: '相关科目',
                        children: [
                            {
                                field: 'gain_subject',
                                headerName: '加（+）',
                                editable: true
                            }, {
                                field: 'gain_subject_sub',
                                headerName: '减（-）',
                                editable: true
                            }
                        ]
                    }, {
                        headerName: '本期发生额',
                        children: [
                            {
                                field: 'gain_first_type',
                                headerName: '类型（+）',
                                editable: true,
                                hcDictCode: 'assets_project_type'
                            }, {
                                field: 'gain_first_sub_type',
                                headerName: '类型（-）',
                                editable: true,
                                hcDictCode: 'assets_project_type'
                            }, {
                                field: 'gain_first_run',
                                headerName: '运行标记',
                                editable: true,
                                hcDictCode: 'assets_project_run'
                            }, {
                                field: 'gain_first_formula',
                                headerName: '计算公式',
                                editable: true
                            }
                        ]
                    }, {
                        headerName: '本年累计发生额',
                        children: [
                            {
                                field: 'gain_end_type',
                                headerName: '类型（+）',
                                editable: true,
                                hcDictCode: 'assets_project_type'
                            }, {
                                field: 'gain_end_sub_type',
                                headerName: '类型（-）',
                                editable: true,
                                hcDictCode: 'assets_project_type'
                            }, {
                                field: 'gain_end_run',
                                headerName: '运行标记',
                                editable: true,
                                hcDictCode: 'assets_project_run'
                            }, {
                                field: 'gain_end_formula',
                                headerName: '计算公式',
                                editable: true
                            }
                        ]
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        editable: true
                    }]
                    , hcEvents: {
                        cellValueChanged: function () {
                            $scope.showSaveEditButton = true;
                        }
                    },
                    hcObjType: 19022202,
                    hcAfterRequest: function (data) {
                        $scope.data.currItem.last_updated_by = data.gl_gain_params[0].last_updated_by;
                        $scope.data.currItem.last_update_date = data.gl_gain_params[0].last_update_date;
                        $scope.gridData_temp = angular.copy(data.gl_gain_params)
                    }
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //编辑按钮
                $scope.editButtons = constant.getConstClone({
                    doNotSave: {
                        title: '不保存',
                            icon: 'fa fa-undo',
                            click: function () {
                            $scope.showSaveEditButton = false;
                            $scope.gridOptions.hcApi.setRowData(angular.copy($scope.gridData_temp));
                        },
                        hide: function () {
                            return !$scope.showSaveEditButton;
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                            $scope.showSaveEditButton = false;
                        },
                        hide: function () {
                            return !$scope.showSaveEditButton;
                        }
                    }
                });

                //保存
                $scope.save = function () {
                    //网格停止编辑
                    $scope.gridOptions.api.stopEditing();

                    $scope.data.currItem.gl_gain_params = $scope.gridOptions.hcApi.getRowData();
                    requestApi.post('gl_gain_param', "update", $scope.data.currItem)
                        .then(function () {
                            return swalApi.success('保存成功!').then($scope.gridOptions.hcApi.search);
                        });
                };


                //隐藏工具栏
                $scope.hideToolButtons = true;

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