/**
 * 战略协议变更
 * 2019/12/12
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
                    },{
                        field: 'stat',
                        headerName: '审批状态',
                        hcDictCode : 'stat'
                    },{
                        field: 'contract_ecn_code',
                        headerName: '变更单号'
                    },{
                        field: 'project_code',
                        headerName: '战略项目编码'
                    }, {
                        field: 'project_name',
                        headerName: '战略项目名称'
                    },  {
                        field: 'manager',
                        headerName: '战略项目经理'
                    }, {
                        field: 'contract_code',
                        headerName: '合同协议编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同协议名称'
                    }, {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode : 'epm.division'
                    },{
                        field: 'signed_date',
                        headerName: '签订时间',
                        type : '日期'
                    },{
                        field: 'signed_location',
                        headerName: '签订地点'
                    },{
                        field: 'contract_effect_date',
                        headerName: '合作开始时间',
                        type : '日期'
                    }, {
                        field: 'contract_expire_date',
                        headerName: '合作结束时间',
                        type : '日期'
                    }, {
                        field: 'party_a_name',
                        headerName: '甲方名称'
                    }, {
                        field: 'party_b_name',
                        headerName: '乙方名称'
                    }, {
                        field: 'reason',
                        headerName: '变更说明'
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

