/**
 * Created by 钟昊良 on 2019/10/23.
 * epm_project_auth_ecn_list 战略报备变更(战略经销商变更)
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
                        {
                            field: 'project_auth_ecn_code',
                            headerName: '变更单号'
                        },
                        {
                            field: 'creator_name',
                            headerName: '申请人'
                        },
                        {
                            field: 'createtime',
                            headerName: '申请日期',
                            type:'日期'
                        },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'stat'
                        },
                        {
                            field: 'project_code',
                            headerName: '项目编码'
                        },
                        {
                            field: 'project_name',
                            headerName: '项目名称'
                        },
                        {
                            field: 'strategic_stage',
                            headerName: '战略对接进度'
                        },
                        {
                            field: 'party_a_name',
                            headerName: '甲方名称'
                        },
                        {
                            field: 'party_b_name',
                            headerName: '乙方名称'
                        },
                        {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        },
                        {
                            field: 'operating_mode',
                            headerName: '管理类型',
                            hcDictCode: 'epm.operating_mode'
                        },
                        {
                            field: 'project_type',
                            headerName: '项目类型',
                            hcDictCode: 'epm.project_type'
                        },
                        {
                            field: 'background',
                            headerName: '背景关系',
                            hcDictCode: 'epm.background'
                        },
                        {
                            field: 'predict_proj_qty',
                            headerName: '战略项目数量'
                        },
                        {
                            field: 'predict_pdt_qty',
                            headerName: '工程用量（套）',
                            type:'数量'
                        },
                        {
                            field: 'predict_sign_date',
                            headerName: '预计签订日期',
                            type: '日期'
                        },
                        {
                            field: 'predict_sales_amount',
                            headerName: '预计销售收入（万元）',
                            type: '万元'
                        },
                        {
                            field: 'intent_product',
                            headerName: '工程意向产品'
                        },
                        {
                            field: 'competitor',
                            headerName: '竞争对手'
                        }
                    ],
                    hcDataRelationName:'project_auth_ecns'
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);