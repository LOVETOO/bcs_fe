/**
 * 家装折扣延期
 * zengjinhua
 * 2020-3-27
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {
    'use strict';

	EPMDiscountDelayList.$inject = ['$scope'];
	function EPMDiscountDelayList(   $scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 2, //查询场景：延期单列表页
				is_home : 2//家装
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'audit_stat',
					headerName: '审核状态',
					cellStyle: {
						'text-align': 'center'
					}
				},
				{
					field: 'discount_ecn_code',
					headerName: '延期申请单号'
				},
				{
					field: 'source_discount_valid_date',
					headerName: '原折扣有效期',
					type: '日期'
				},
				{
					field: 'discount_valid_date',
					headerName: '新折扣有效期',
					type: '日期'
				},
				{
					field: 'creator_name',
					headerName: '申请人'
				},
				{
					field: 'createtime',
					headerName: '申请时间'
				},
				{
					field: 'division_id',
					headerName: '所属事业部',
					hcDictCode: 'epm.division'
				},
				{
					field: 'order_pdt_line',
					headerName: '产品线',
					hcDictCode: 'epm.order_pdt_line'
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
					field: 'trading_company_name',
					headerName: '交易公司'
				},
				{
					field: 'billing_unit_name',
					headerName: '开票单位'
				},
				{
					field: 'project_name',
					headerName: '家装公司'
				},
				{
					field: 'ecn_reason',
					headerName: '延期说明'
				}
			]
		};

		//继承控制器
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMDiscountDelayList
	});
});