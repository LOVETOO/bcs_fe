/**
 * 工程项目订单-列表页
 * Created by shenguocheng
 * Date:019-7-24
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
                            field: 'sa_salebillno',
                            headerName: '订单编号'
                        }, {
                            field: 'date_invbill',
                            headerName: '订单日期',
                            type: '日期'
                        }, {
                            field: 'bill_type',
                            headerName: '订单类型',
                            hcDictCode: 'epm.bill_type'
                        }, {
                            field: 'trading_company_name',
                            headerName: '交易公司'
                        }, {
                            field: 'customer_code',
                            headerName: '经销商编码'
                        }, {
                            field: 'customer_name',
                            headerName: '经销商名称'
                        }, {
                            field: 'order_pdt_line',
                            headerName: '产品线',
                            hcDictCode: 'epm.order_pdt_line'
                        }, {
                            field: 'business_type',
                            headerName: '业务类型',
                            hcDictCode: 'epm.business_type'
                        }, {
                            field: 'project_code',
                            headerName: '项目编码'
                        }, {
                            field: 'project_name',
                            headerName: '项目名称'
                        }, {
                            field: 'contract_code',
                            headerName: '合同编码'
                        }, {
                            field: 'contract_name',
                            headerName: '合同名称'
                        }, {
                            field: 'discount_apply_code',
                            headerName: '折扣申请单'
                        }, {
                            field: 'contract_type',
                            headerName: '签约方式',
                            hcDictCode: 'epm.contract_type'
                        }, {
                            field: 'billing_unit_name',
                            headerName: '开票单位'
                        }, {
                            field: 'division',
                            headerName: '事业部',
                            hcDictCode: 'epm.division'
                        }, {
                            field: 'created_by',
                            headerName: '创建人'
                        }, {
                            field: 'creation_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_updated_by',
                            headerName: '修改人'
                        }, {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }],
                    hcPostData: {
                        search_flag: 1
                    }
                };

                //继承控制器
                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
				});
				
				['add', 'delete'].forEach(function (buttonId) {
					$scope.toolButtons[buttonId].hide = true;
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
