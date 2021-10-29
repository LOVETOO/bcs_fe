/**
 * 部门重点工作表
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

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            type: "词汇",
                            cellEditorParams: {
                                names: ["制单", "已确认"],
                                values: [1, 5]
                            }
                        }, {
                            field: 'dpivotjob_no',
                            headerName: '重点工作编码'
                        }, {
                            field: 'year_month',
                            headerName: '年月'
                        },{
                            field: 'org_code',
                            headerName: '所属部门编码'
                        },{
                            field: 'org_name',
                            headerName: '所属部门名称'
                        }, {
                            field: 'note',
                            headerName: '备注'
                        }, {
                            field: 'creator',
                            headerName: '创建人'
                        },  {
                            field: 'create_time',
                            headerName: '创建时间'
                        } ,{
                            field: 'updator',
                            headerName: '修改人'
                        },{
                            field: 'update_time',
                            headerName: '修改时间'
                        }
                    ]
                };

                //继承控制器
                controllerApi.extend({
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