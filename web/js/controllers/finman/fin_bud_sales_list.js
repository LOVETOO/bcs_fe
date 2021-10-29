/**
 * 销售预算编制-列表页
 * 2018-11-27
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
                    columnDefs : [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'sales_bud_head_no',
                            headerName: '销售预算单号'
                        }
                        , {
                            field: 'bud_year',
                            headerName: '编制年度',
                            type:'number'
                        }
                        , {
                            field: 'org_code',
                            headerName: '部门编码'
                        }
                        , {
                            field: 'org_name',
                            headerName: '部门名称'
                        }
                        ,
                        {
                            field: 'total_sales_qty',
                            headerName: '累计销售数量',
                            type:'数量'
                        },
                        {
                            field: 'total_sales_amt',
                            headerName: '累计销售金额',
                            type:'金额'
                        },
                        {
                            field: 'comp_target_salesamt',
                            headerName: '总预算销售收入',
                            type:'金额'
                        }
                        , {
                            field: 'dept_target_salesamt',
                            headerName: '部门预算销售收入',
                            type:'金额'
                        }
                        , {
                            field: 'note',
                            headerName: '编制说明'
                        }
                        , {
                            field: 'creator',
                            headerName: '创建人'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间',
                            type:"时间"
                        }
                    ],
                    hcObjType: 181128
                };

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
