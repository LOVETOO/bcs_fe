/**
 * 应付转移-列表页
 * 2019-01-08
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
                        }
                        , {
                            field: 'invoice_move_head_no',
                            headerName: '单据号'
                        }
                        , {
                            field: 'bill_date',
                            headerName: '记账日期',
                            type: '日期'
                        }
                        , {
                            field: 'year_month',
                            headerName: '记账月份'
                        }
                        , {
                            headerName: '转出供应商',
                            children: [
                                {
                                    field: 'moveout_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'moveout_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            headerName: '转入供应商',
                            children: [
                                {
                                    field: 'movein_code',
                                    headerName: '编码'
                                },
                                {
                                    field: 'movein_name',
                                    headerName: '名称'
                                }
                            ]
                        }
                        , {
                            field: 'amount',
                            headerName: '转移金额',
                            type: '金额'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注'
                        }
                        , {
                            field: 'credence_no_s',
                            headerName: '凭证号'
                        }
                        , {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'created_by',
                            headerName: '创建人'
                        }
                        , {
                            field: 'creation_date',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'last_updated_by',
                            headerName: '修改人'
                        }
                        , {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ],
                    hcObjType: 1502,
                    hcBeforeRequest: function (searchObj) {
                        searchObj.searchflag = 1;
                        searchObj.move_type = 1
                    }
                };

                $scope.data = $scope.data || {};

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
