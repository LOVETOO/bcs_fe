/**
 * 家装单体解冻申请
 * 2020/3/23
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
                    hcPostData: {
                        monomer_type: 2
                    },
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode : 'stat'
                    },
                    {
                        field: 'project_code',
                        headerName: '单体家装编码'
                    },
                    {
                        field: 'project_name',
                        headerName: '公司名称'
                    },
                    {
                        field: 'reason',
                        headerName: '失效原因'
                    },
                    {
                        field: 'customer_code',
                        headerName: '经销商编码'
                    },
                    {
                        field: 'customer_name',
                        headerName: '经销商名称'
                    },
                    {
                        field: 'area_full_name',
                        headerName: '公司所在地'
                    },
                    {
                        field: 'address',
                        headerName: '详细地址'
                    },
                    {
                        field: 'project_valid_date',
                        headerName: '报备有效期至',
                        type: '日期'
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
                        field: 'dealer_follower',
                        headerName: '经办人'
                    },
                    {
                        field: 'dealer_follower_phone',
                        headerName: '经办人电话'
                    },
                    {
                        field: 'intent_product',
                        headerName: '意向产品'
                    },
                    {
                        field: 'predict_sales_amount',
                        headerName: '年销售额（万元）',
                        type: '万元'
                    },
                    {
                        field: 'project_legal_name',
                        headerName: '公司法人'
                    },
                    {
                        field: 'business_name',
                        headerName: '营业执照名称'
                    },
                    {
                        field: 'own_follower',
                        headerName: '联系人'
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

