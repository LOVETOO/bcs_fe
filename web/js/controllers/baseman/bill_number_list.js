/**
 * 单据当前编号表、前缀表
 * 2019-02-26 hudeong
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
                        },
                        { field: 'bill_type_id',
                            headerName: '单据类型ID',
                            editable: false
                        },
                        { field: 'descript',
                            headerName: '描述',
                            editable: false
                        },
                        { field: 'max_number',
                            headerName: '当前最大编号',
                            editable: false
                        },
                        { field: 'currentdate',
                            headerName: '当前时间',
                            editable: false
                        },
                        { field: 'prefix',
                            headerName: '单据号前缀',
                            editable: false
                        },
                        { field: 'is_flow',
                            headerName: '是否有流程 1否 2是 ',
                            editable: false
                        },
                        { field: 'formclass',
                            headerName: '走流程对应FROM名称',
                            editable: false
                        },
                        { field: 'objclass',
                            headerName: '走流程对应类名称',
                            editable: false
                        },
                        { field: 'year_month',
                            headerName: '当前年月',
                            editable: false
                        },
                        { field: 'remark',
                            headerName: '备注',
                            editable: false
                        },
                        { field: 'created_by',
                            headerName: '创建者',
                            editable: false
                        },
                        { field: 'creation_date',
                            headerName: '创建日期',
                            editable: false
                        },
                        { field: 'last_updated_by',
                            headerName: '最后修改人',
                            editable: false
                        },
                        { field: 'last_update_date',
                            headerName: '最后修改日期',
                            editable: false
                        },
                        { field: 'organization_id',
                            headerName: '组织ID',
                            editable: false
                        },
                        { field: 'is_month',
                            headerName: '是否按月份产生流水号 2-是 1-否',
                            editable: false
                        },
                        { field: 'max_month_number',
                            headerName: '当前月最大流水号',
                            editable: false
                        },
                        { field: 'bill_month',
                            headerName: '单据月份',
                            editable: false
                        },
                        { field: 'month_seriallength',
                            headerName: '流水号长度',
                            editable: false
                        },
                    ],
                    // hcObjType: $stateParams.objtypeid,
                    hcClassId:'bill_number'
                }

                //基类继承
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