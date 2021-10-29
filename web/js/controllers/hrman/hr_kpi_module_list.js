define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {
                    currItem: {}
                };
                /**
                 * 列表定义
                 *
                 **/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },{
                            field: 'kpimoudel_name',
                            headerName: '表单模板名称'
                        },{
                            field: 'org_name',
                            headerName: '适用部门'
                        },{
                            field: 'kpi_object',
                            hcDictCode:'kpi_object',
                            headerName: '考核对象'
                        },{
                            field: 'positionid',
                            headerName: '适用岗位'
                        },{
                            field: 'note',
                            headerName: '备注'
                        },{
                            field: 'creator',
                            headerName: '创建人'
                        },{
                            field: 'create_time',
                            headerName: '创建时间'
                        },{
                            field: 'updator',
                            headerName: '修改人'
                        },{
                            field: 'update_time',
                            headerName: '修改时间'
                        },
                    ]


                }
                /**
                 * 继承控制器
                 **/
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });


                $scope.toolButtons.copy.hide = false;



             /*   $scope.toolButtons.copy.click=function () {
                    return $scope.copy && $scope.copy();
                }*/

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