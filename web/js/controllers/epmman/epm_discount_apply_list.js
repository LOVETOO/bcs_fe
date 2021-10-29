/**
 * 工程折扣申请 - 列表页
 * @since 2019-07-16
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
				search_flag: 1 //查询场景：折扣单列表页
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
					field: 'signed_date',
					headerName: '签订时间',
					type:'日期'
				},
				{
					field: 'contract_amt',
					headerName: '合同总额',
					type:'金额'
				},
				{
					field: 'strategic_related',
					headerName: '战略工程相关',
					type : '是否'
				},
				{
					field: 'strategic_project_code',
					headerName: '战略工程编码'
				},
				{
					field: 'strategic_project_name',
					headerName: '战略工程名称'
				},
				{
					field: 'is_cal_second_year_discount',
					headerName: '计次年折扣',
					type : '是否'
				},
				{
					field: 'is_cal_ad',
					headerName: '计广告费',
					type : '是否'
				},
				// {
				// 	field: 'contract_expire_date',
				// 	headerName: '合作结束时间',
				// 	type: '日期'
				// },
				{
					field: 'project_code',
					headerName: '工程编码'
				},
				{
					field: 'project_name',
					headerName: '工程名称'
				},
				{
					field: 'is_local',
					headerName: '本地/异地',
					hcDictCode : 'epm.is_local'
				},
				{
					field: 'project_type',
					headerName: '业主类型',
					hcDictCode : 'epm.project_type'
				},
				// {
				// 	field: 'stage_name',
				// 	headerName: '项目当前进度'
				// },
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
				/*{
					field: 'is_cal_ad',
					headerName: '计广告费',
					type: '是否'
				},
				{
					field: 'is_cal_second_year_discount',
					headerName: '计次年折扣',
					type: '是否'
				},*/
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
					field: 'apply_reason',
					headerName: '申请说明'
                },
                {
                    field: 'source_from_delay',
                    headerName: '延期生成',
                    type: '是否'
                },
                {
                    field: 'source_discount_apply_code',
                    headerName: '源折扣单号'
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

		// $scope.toolButtons.delayApply = {
		// 	title: '延期申请',
		// 	icon: 'iconfont hc-dingshi'
		// };
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMDiscountApplyList
	});
});