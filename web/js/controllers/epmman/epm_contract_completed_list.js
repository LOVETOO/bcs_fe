/**
 * 工程项目结案
 * 2019/6/26
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var controller = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    },{
                        field: 'completed_code',
                        headerName: '结案单号'
                    },  {
                        field: 'project_code',
                        headerName: '项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'stage_name',
                        headerName: '项目当前进度'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'signed_date',
                        headerName: '合同签订日期',
                        type:'日期'
                    }, {
                        field: 'contract_effect_date',
                        headerName: '合作开始时间',
                        type:'日期'
                    }, {
                        field: 'contract_expire_date',
                        headerName: '合作结束时间',
                        type:'日期'
                    },  {
                        field: 'contract_amt',
                        headerName: '合同总额',
                        type:'金额'
                    },  {
                        field: 'contract_amt_received',
                        headerName: '已回金额',
                        type:'金额'
                    }, {
                        field: 'completed_type',
                        headerName: '结案类型',
                        hcDictCode:'epm.contract_completed_type'
                    }, {
                        field: 'completed_desc',
                        headerName: '结案说明'
                    }, {
                        field: 'creator_name',
                        headerName: '创建人'
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        type:'时间'
                    }, {
                        field: 'updator_name',
                        headerName: '修改人'
                    }, {
                        field: 'updatetime',
                        headerName: '修改时间',
                        type:'时间'
                    }]
                };

                //继承列表页基础控制器
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
    });

