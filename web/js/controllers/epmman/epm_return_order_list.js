/**
 * 退货订单
 * zengjinhua
 * 2019/10/22
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {
    'use strict';

	EPMDiscountApplyList.$inject = ['$scope'];
	function EPMDiscountApplyList($scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 5 //查询场景：退货订单数据
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'sa_salebillno',
					headerName: '退货单号'
				},
				{
					field: 'date_invbill',
                    headerName: '订单日期',
                    type : '日期'
				},
				{
					field: 'created_by_name',
					headerName: '申请人'
				},
				{
					field: 'order_stat',
                    headerName: '订单状态',
                    hcDictCode : 'epm.require_bill.order_stat'
				},
				{
					field: 'customer_code',
					headerName: '客户编码'
				},
				{
					field: 'customer_name',
					headerName: '客户名称'
				},
				{
					field: 'short_name',
					headerName: '客户简称'
				},
				{
					field: 'bill_type',
					headerName: '订单类型',
					hcDictCode: 'epm.bill_type'
				},
				{
					field: 'trading_company_name',
					headerName: '交易公司'
				},
				{
					field: 'billing_unit_name',
					headerName: '开票单位'
				},
				{
					field: 'ext_account_name',
					headerName: '余额账户'
				},
				{
					field: 'business_type',
					headerName: '业务类型',
                    hcDictCode : 'epm.business_type'
				},
				{
					field: 'channel',
                    headerName: '渠道',
                    hcDictCode : 'sales.channel'
				},
				{
					field: 'order_pdt_line',
                    headerName: '产品线',
                    hcDictCode : 'epm.order_pdt_line'
				},
				{
					field: 'inv_out_bill_code',
					headerName: '出库单号'
				},
				{
					field: 'created_source',
					headerName: '单据来源',
					hcDictCode : 'epm.created_source'
				},
				{
					field: 'contract_code',
					headerName: '合同编码'
				},
				{
					field: 'contract_name',
					headerName: '合同名称'
				},
				{
					field: 'contract_type',
                    headerName: '签约类型',
                    hcDictCode : 'epm.contract_type'
				},
				{
					field: 'return_reason',
					headerName: '备注'
				}
			]
		};

		//继承控制器
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});

		$(function () {
			var intervalId = setInterval(function () {		
				if ($scope.searchPanelVisible === false) {//符合条件
					clearInterval(intervalId);//销毁
					$scope.searchPanelVisible = true;
				}
			}, 300);
		});

		['add', 'delete'].forEach(function (buttonId) {
			$scope.toolButtons[buttonId].hide = true;
		});

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMDiscountApplyList
	});
});