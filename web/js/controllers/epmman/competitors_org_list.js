/**
 * 竞争对手档案
 * Created by liujianbing on 2019/5/20.
 * Updated by shenguocheng on 2019/8/7.
 * Updated by zengjinhua on 2019/8/20.
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
                        },{
                            field: 'competitors_org_code',
                            headerName: '竞争对手编码'
                        },{
                            field: 'competitors_org_name',
                            headerName: '竞争对手名称'
                        }, {
                            field: '品牌信息',
                            children:[{
                                field: 'registered_capital',
                                headerName: '注册资金（万元）',
                                type: '万元'
                            }, {
                                field: 'listed',
                                headerName: '上市板块',
                                hcDictCode:'listed'
                            }, {
                                field: 'major_qualifications',
                                headerName: '主要产品'
                            }, {
                                field: 'major_brands',
                                headerName: '主要品牌'
                            }, {
                                field: 'awards_honors',
                                headerName: '奖项及荣誉'
                            }, {
                                field: 'artisan',
                                headerName: '技术人员'
                            }, {
                                field: 'negative',
                                headerName: '负面信息'
                            }]
                        },{
                            field: '市场信息',
                            children:[{
                                field: 'popularity_reputation',
                                headerName: '知名度/口碑'
                            },{
                                field: 'customer_evaluation',
                                headerName: '客户评价'
                            },{
                                field: 'customer_characteristics',
                                headerName: '客户特征'
                            },{
                                field: 'customer_source',
                                headerName: '主要客户来源'
                            },{
                                field: 'targetmarket_distribution',
                                headerName: '目标市场及分布'
                            },{
                                field: 'business_model',
                                headerName: '商业模式'
                            },{
                                field: 'marketing_strategy',
                                headerName: '营销策略'
                            }, {
                                field: 'sales_policy',
                                headerName: '销售政策'
                            }]
                        },{
                            field: '财务信息',
                            children:[{
                                field: 'sales_volume',
                                headerName: '销量'
                            },{
                                field: 'tax_grade',
                                headerName: '纳税等级'
                            }, {
                                field: 'financial_situation',
                                headerName: '资金状况'
                            }]
                        },{
                            field: '管理信息',
                            children:[{
                                field: 'number_employees',
                                headerName: '员工总数'
                            },{
                                field: 'number_managers',
                                headerName: '管理人员数'
                            },{
                                field: 'number_salesmen',
                                headerName: '营销人员数'
                            }, {
                                field: 'analysis',
                                headerName: '分析'
                            }]
                        },{
                            field: 'create_by_name',
                            headerName: '创建人'
                        },{
                            field: 'create_date',
                            headerName: '创建时间'
                        },{
                            field: 'last_update_by_name',
                            headerName: '修改人'
                        },{
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ]

                };

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
    }
)