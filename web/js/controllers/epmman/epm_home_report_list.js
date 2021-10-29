/**
 * 单体家装报备
 * 2020/03/10
 * zhengjinhua
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {

	EpmReportList.$inject = ['$scope'];
	function EpmReportList(   $scope) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 1,
				report_type: 4
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'project_valid',
					headerName: '有效状态',
					hcDictCode: 'valid',
					cellStyle: function (params) {
						var style = {
							'text-align': 'center'
						};

						var color = Switch(params.value, '==')
							.case(1, 'gray')		//未失效
							.case(2, 'green')		//已生效
							.case(3, 'red')			//已失效
							.case(4, 'blue')		//已冻结
							.result;

						if(params.value == 4 && (params.data.epu_stat == 1 || params.data.epu_stat == 3)){
							color = 'orange';
							if(params.data.epu_stat == 3 && params.data.epu_audit_stat == '审核拒绝'){
								color = 'red';
							}
						}

						if (color) {
							style['color'] = color;
						}

						return style;
					}
				},
                {
                    field: 'audit_stat',
                    headerName: '审核状态',
                    cellStyle: {
                        'text-align': 'center'
                    }
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
				}
			]
		};
		
		//继承
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
	}
	
	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmReportList
	});
});