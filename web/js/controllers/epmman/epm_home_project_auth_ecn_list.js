/**
 * 家装战略报备经销商变更
 * zengjinhua
 * 2020/03/11
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
                    hcPostData: {
                        ecn_type: 2 //家装战略报备变更
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'stat',
                            headerName: '单据状态',
                            hcDictCode:'stat'
                        },
                        {
                            field: 'project_auth_ecn_code',
                            headerName: '变更单号'
                        },
                        {
                            field: 'project_code',
                            headerName: '战略家装编码'
                        },
                        {
                            field: 'project_name',
                            headerName: '公司名称'
                        },
                        {
                            field: 'report_time',
                            headerName: '申报日期',
                            type: '时间'
                        },
                        {
                            field: 'area_full_name',
                            headerName: '总部所在地'
                        },
                        {
                            field: 'address',
                            headerName: '详细地址'
                        },
                        {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        },
                        {
                            field: 'competitive_brand',
                            headerName: '竞争品牌'
                        },
                        {
                            field: 'cooperation_area',
                            headerName: '合作区域'
                        },
                        {
                            field: 'pdt_line',
                            headerName: '产品线',
                            hcDictCode: 'epm.order_pdt_line'
                        },
                        {
                            field: 'agent_opinion',
                            headerName: '审批经办人意见'
                        },
                        {
                            field: 'agent',
                            headerName: '审批经办人'
                        },
                        {
                            field: 'strac_coop_inv_region',
                            headerName: '战略合作范围涉及区域'
                        },
                        {
                            field: 'natureb_usiness',
                            headerName: '公司性质',
                            hcDictCode: 'epm.natureb_usiness'
                        },
                        {
                            field: 'line_business',
                            headerName: '业务范围',
                            hcDictCode: 'epm.line_business'
                        },
                        {
                            field: 'background',
                            headerName: '背景关系',
                            hcDictCode: 'epm.background'
                        },
                        {
                            field: 'own_follower',
                            headerName: '总部联系人'
                        },
                        {
                            field: 'follow_people_duty',
                            headerName: '联系人职务'
                        },
                        {
                            field: 'own_follower_phone',
                            headerName: '联系人电话'
                        },
                        {
                            field: 'predict_sales_amount',
                            headerName: '年销售额（万元）',
                            type: '万元'
                        },
                        {
                            field: 'intent_product',
                            headerName: '意向产品'
                        },
                        {
                            field: 'creator_name',
                            headerName: '创建人'
                        },
                        {
                            field: 'createtime',
                            headerName: '创建时间',
                            type: '时间'
                        },
                        {
                            field: 'updator_name',
                            headerName: '修改人'
                        },
                        {
                            field: 'updatetime',
                            headerName: '修改时间',
                            type: '时间'
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