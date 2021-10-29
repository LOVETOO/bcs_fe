/**
 * 预算材料成本编制
 * 2019.02.21
 * @author huderong
 *
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'fin_bud_material_cost_no',
                            headerName: '编制单号'
                        },
                        {
                            field: 'bud_year',
                            headerName: '预算编制年度',
                            editable: false
                        },
                        {
                            field: 'according_to',
                            headerName: '编制方式',
                            editable: false,
                            hcDictCode: 'fin_bud_material_according_to'
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: false
                        },
                        {
                            field: 'creator',
                            headerName: '创建人',
                            editable: false
                        },
                        {
                            field: 'create_time',
                            headerName: '创建时间',
                            editable: false
                        },
                        {
                            field: 'updator',
                            headerName: '更新人',
                            editable: false
                        },
                        {
                            field: 'update_time',
                            headerName: '更新时间',
                            editable: false
                        }
                    ],
                    hcObjType: $stateParams.objtypeid
                }

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });


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
