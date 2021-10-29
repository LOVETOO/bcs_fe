/**
 * 员工培训登记表
 * Created by sgc
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
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'course_code',
                            headerName: '课程编码'
                        }, {
                            field: 'course_name',
                            headerName: '课程名称'
                        }, {
                            field: 'train_date',
                            headerName: '培训日期'
                        },{
                            field: 'teacher',
                            headerName: '培训老师'
                        }, {
                            field: 'course_hour',
                            headerName: '培训课时(小时)',
                            cellStyle: function (params) {
                                return angular.extend(getDefaultCellStyle(params), {
                                    'text-align': 'center' //文本居中
                                });
                            }
                        }, {
                            field: 'course_fee',
                            headerName: '培训费用(元)',
                            type:'金额'
                        }, {
                            field: 'content',
                            headerName: '培训内容'
                        }, {
                            field: 'address',
                            headerName: '培训地点'
                        },  {
                            field: 'evaluation',
                            headerName: '效果评价'
                        } ,{
                            field: 'creator',
                            headerName: '创建人'
                        },{
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                    ]
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

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