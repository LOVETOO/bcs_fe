/**
 * 工程费用记录-列表页
 * shenguocheng
 * 2019-07-09
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
                            field: 'fee_record_no',
                            headerName: '费用记录单号'
                        }, {
                            field: 'creator_name',
                            headerName: '申请人'
                        }, {
                            field: 'apply_org_name',
                            headerName: '申请部门'
                        }, {
                            field: 'create_time',
                            headerName: '申请日期',
                            type: '日期'
                        }, {
                            field: 'org_name',
                            headerName: '报销部门'
                        }, {
                            field: 'bud_type_name',
                            headerName: '预算类别'
                        }, {
                            field: 'fee_name',
                            headerName: '费用项目'
                        }, {
                            field: 'xf_amt',
                            headerName: '报销金额(元)',
                            type: '金额'
                        }, {
                            field: 'approved_amt',
                            headerName: '批准金额(元)',
                            type: '金额'
                        }, {
                            field: 'xf_date',
                            headerName: '发生日期',
                            type: '日期'
                        }, {
                            field: 'note',
                            headerName: '业务描述'
                        }, {
                            field: 'source_bill_code',
                            headerName: 'EMS报销单号'
                        }
                    ],
                    hcDataRelationName: 'fin_fee_records'
                };

                //继承控制器
                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //隐藏新增和删除按钮
                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;

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
