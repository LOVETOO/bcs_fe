/**
 * 工程费用申请-列表页
 * shenguocheng
 * 2019-7-1
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
                            hcDictCode: '*'
                        }, {
                            field: 'fee_apply_no',
                            headerName: '申请单号'
                        }, {
                            field: 'project_code',
                            headerName: '工程编码'
                        }, {
                            field: 'project_name',
                            headerName: '工程项目'
                        }, {
                            field: 'chap_name',
                            headerName: '申请人'
                        }, {
                            field: 'org_name',
                            headerName: '申请部门'
                        }, {
                            field: 'total_apply_amt',
                            headerName: '申请总额',
                            type: '金额'
                        }, {
                            field: 'total_allow_amt',
                            headerName: '批准总额',
                            type: '金额'
                        }, {
                            field: 'purpose',
                            headerName: '费用用途'
                        }, {
                            field: 'creator_name',
                            headerName: '创建人'
                        }, {
                            field: 'create_time',
                            headerName: '创建时间'
                        }, {
                            field: 'updator_name',
                            headerName: '修改人'
                        }, {
                            field: 'update_time',
                            headerName: '修改时间'
                        }],
                    hcDataRelationName: 'fin_fee_apply_headers'
                };

                //继承控制器
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
