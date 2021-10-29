/**
 * 工程折扣变更 - 列表页
 * @since 2019-09-03
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {
    'use strict';

	controller.$inject = ['$scope'];
	function controller(   $scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
                search_flag: 1, //查询场景：变更单列表页
                is_home : 2 /* 家装 */
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
					headerName: '变更申请单号'
				},
				{
					field: 'discount_apply_code',
					headerName: '折扣单号'
				},
				{
					field: 'creator_name',
					headerName: '变更申请人'
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
					field: 'discount_valid_date',
					headerName: '折扣有效期',
					type: '日期'
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
					field: 'contract_code',
					headerName: '合同编码'
				},
				{
					field: 'contract_name',
					headerName: '合同名称'
				},
				{
					field: 'contract_expire_date',
					headerName: '合作结束时间',
					type: '日期'
				},
				{
					field: 'project_code',
					headerName: '工程编码'
				},
				{
					field: 'ecn_reason',
					headerName: '变更说明'
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
		controller: controller
	});
});