/**
 * 项目合同变更 =》工程合同失效
 * 2019/6/28
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
                        field: 'ecn_code',
                        headerName: '变更单号'
                    },{
                        field: 'ecn_type',
                        headerName: '变更类型',
                        hcDictCode : 'contract.ecn_type'
                    }, {
                        field: 'creator_name',
                        headerName: '申请人'
                    },  {
                        field: 'createtime',
                        headerName: '申请日期',
                        type:'日期'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'contract_amt',
                        headerName: '合同金额',
                        type:'金额'
                    }, {
                        field: 'signed_date',
                        headerName: '签约时间',
                        type:'日期'
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'short_name',
                        headerName: '客户简称'
                    }, {
                        field: 'contract_type',
                        headerName: '签约类型',
                        hcDictCode :'epm.contract_type'
                    }, {
                        field: 'contract_unit',
                        headerName: '签约单位'
                    }, {
                        field: 'trading_company_name',
                        headerName: '交易公司'
                    }, {
                        field: 'billing_unit_name',
                        headerName: '开票单位'
                    }, {
                        field: 'ecn_reason',
                        headerName: '申请说明'
                    }, {
                        field: 'project_code',
                        headerName: '工程编码'
                    }, {
                        field: 'project_name',
                        headerName: '工程名称'
                    }, {
                        field: 'report_time',
                        headerName: '申报日期',
                        type:'日期'
                    }, {
                        field: 'is_local',
                        headerName: '本地/异地',
                        hcDictCode:'epm.is_local'
                    }, {
                        field: 'address',
                        headerName: '工程地址'
                    }, {
                        field: 'stage_name',
                        headerName: '项目当前进度'
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

