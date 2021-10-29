/**
 * 工程折扣申请 列表
 * 2019/6/27
 * shenguocheng
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
                            headerName: '申请单号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: 'stat',
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        }, {
                            field: 'project_type',
                            headerName: 'OA审核状态'
                        }, {
                            field: 'signup_end_time',
                            headerName: '交易公司'
                        }, {
                            field: 'signup_people',
                            headerName: '经销商',
                        }, {
                            field: 'signup_method',
                            headerName: '开票单位'
                        }, {
                            field: 'is_signup',
                            headerName: '产品线'
                        }, {
                            field: 'signup_charge',
                            headerName: '渠道'
                        }, {
                            field: 'report_time',
                            headerName: '签约方式'
                        }, {
                            field: 'report_type',
                            headerName: '合同编号'
                        }, {
                            field: 'sale_area_name',
                            headerName: '合同名称'
                        }, {
                            field: 'sales_name',
                            headerName: '合同有效期'
                        }, {
                            field: 'partner',
                            headerName: '事业部'
                        }, {
                            field: 'partner_linkman',
                            headerName: '备注'
                        }, {
                            field: 'create_by',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_updated_by',
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