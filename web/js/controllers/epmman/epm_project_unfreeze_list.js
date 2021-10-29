/**
 * 工程解冻申请
 * 2019/9/4
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
                        field: 'audit_stat',
                        headerName: '审核状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },{
                        field: 'proj_unfreeze_code',
                        headerName: '申请单号'
                    },{
                        field: 'createtime',
                        headerName: '申请日期',
                        type : '日期'
                    }, {
                        field: 'project_code',
                        headerName: '项目编码'
                    },  {
                        field: 'project_name',
                        headerName: '项目名称'
                    }, {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode:'epm.division'
                    }, {
                        field: 'area_full_name',
                        headerName: '工程所在地'
                    }, {
                        field: 'address',
                        headerName: '详细地址'
                    },{
                        field: 'is_local',
                        headerName: '本地/异地',
                        hcDictCode: 'epm.is_local'
                    }, {
                        field: 'party_a_name',
                        headerName: '甲方名称'
                    }, {
                        field: 'party_b_name',
                        headerName: '乙方名称'
                    }, {
                        field: 'freeze_type',
                        headerName: '冻结原因',
                        hcDictCode : 'epm.proj.freeze_type'
                    }, {
                        field: 'freeze_time',
                        headerName: '冻结时间',
                        type:'日期'
                    }, {
                        field: 'reason',
                        headerName: '申请说明'
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
                    }, {
                        field: 'auditor_name',
                        headerName: '审核人'
                    }, {
                        field: 'audittime',
                        headerName: '审核时间',
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

