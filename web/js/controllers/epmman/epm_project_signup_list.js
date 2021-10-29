/**
 * 工程项目报名列表
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'project_code',
                            headerName: '项目编码'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称'
                        }, {
                            field: 'division_id',
                            headerName: '所属事业部',
                            hcDictCode: 'epm.division'
                        }, {
                            field: 'project_source',
                            headerName: '工程类型',
                            hcDictCode: 'epm.project_source'
                        }, {
                            field: 'project_type',
                            headerName: '业主类型',
                            hcDictCode: 'epm.project_type'
                        }, {
                            field: 'background',
                            headerName: '背景关系',
                            hcDictCode: 'epm.background'
                        }, {
                            field: 'signup_end_time',
                            headerName: '报名截止日期',
                            type: "日期"
                        }, {
                            field: 'signup_people',
                            headerName: '报名经办人'
                        }, {
                            field: 'signup_method',
                            headerName: '报名方式',
                            hcDictCode: 'epm.signup_method',
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        }, {
                            field: 'is_signup',
                            headerName: '报名费已缴纳',
                            type: '是否'
                        }, {
                            field: 'signup_charge',
                            headerName: '报名费(元)',
                            type: '金额'
                        }, {
                            field: 'report_time',
                            headerName: '报备时间',
                            type: "时间"
                        }, {
                            field: 'signup_url',
                            headerName: '报名窗口'
                        }, {
                            field: 'bid_url',
                            headerName: '招标网址'
                        }, {
                            field: 'create_by_name',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_updated_by_name',
                            headerName: '修改人'
                        }, {
                            field: 'last_updated_date',
                            headerName: '修改时间'
                        }
                    ]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //文本居中
                function getDefaultCellStyle(params) {
                    var style = {};

                    if ($scope.gridOptions.defaultColDef) {
                        var defaultStyle = $scope.gridOptions.defaultColDef.cellStyle;
                        if (defaultStyle) {
                            if (angular.isObject(defaultStyle))
                                style = defaultStyle;
                            else if (angular.isFunction(defaultStyle))
                                style = defaultStyle(params);
                        }
                    }
                    return style;
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