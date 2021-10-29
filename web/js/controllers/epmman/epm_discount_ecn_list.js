/**
 * 工程折扣变更 - 列表页
 * @since 2019-09-03
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {
    'use strict';

	EPMDiscountECNList.$inject = ['$scope'];
	function EPMDiscountECNList(   $scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 1 //查询场景：变更单列表页
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
					headerName: '变更申请时间'
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
					field: 'contract_type',
					headerName: '签约方式',
					hcDictCode: 'epm.contract_type'
				},
				{
					field: 'discount_valid_date',
					headerName: '折扣有效期',
					type: '日期'
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
					field: 'project_name',
					headerName: '工程名称'
				},
				{
					field: 'stage_name',
					headerName: '项目当前进度'
				},
				{
					field: 'discount_type',
					headerName: '折扣类型',
					hcDictCode: 'epm.discount_type'
				},
				{
					field: 'discount_rate',
					headerName: '审批折扣率',
					type: '金额'
				},
				{
					field: 'undiscounted_amount',
					headerName: '折前总金额',
					type: '金额'
				},
				{
					field: 'discounted_amount',
					headerName: '折后总金额',
					type: '金额'
				},
				{
					field: 'is_cal_ad',
					headerName: '计广告费',
					type: '是否'
				},
				{
					field: 'is_cal_second_year_discount',
					headerName: '计次年折扣',
					type: '是否'
				},
				{
					field: 'total_qty',
					headerName: '总数量',
					type: '数量'
				},
				{
					field: 'total_volume',
					headerName: '总体积（m³）',
					type: '体积'
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
		controller: EPMDiscountECNList
	});
});