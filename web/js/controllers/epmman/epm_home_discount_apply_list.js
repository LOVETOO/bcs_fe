/**
 * 工程折扣申请
 * zengjinhua
 * 2020-3-26
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {
    'use strict';

	EPMDiscountApplyList.$inject = ['$scope'];
	function EPMDiscountApplyList(   $scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
                search_flag: 1 ,//查询场景：折扣单列表页
                is_home : 2 /* 家装折扣 */
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'stat',
					headerName: '审核状态',
					hcDictCode: 'stat',
					cellStyle: {
						'text-align': 'center' //文本居中
					}
				},
				{
					field: 'discount_apply_code',
					headerName: '折扣单号'
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
					headerName: '订单产品线',
					hcDictCode: 'epm.order_pdt_line'
				},
				{
					field: 'discount_valid_date',
					headerName: '折扣有效期',
					type: '日期'
                },
                {
					field: 'project_code',
					headerName: '家装报备编码'
				},
				{
					field: 'project_name',
					headerName: '家装公司'
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
					field: 'discount_type',
					headerName: '折扣类型',
					hcDictCode: 'epm.discount_type'
				}
			]
		};

		//继承控制器
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
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