/**
 * 项目档案 - 列表页
 * @since 2019-07-05
 */
define(['module', 'controllerApi', 'base_obj_list', 'requestApi', '$q'], function (module, controllerApi, base_obj_list, requestApi, $q) {

	EpmProjectList.$inject = ['$scope'];
	function EpmProjectList(   $scope) {

		//定义冻结原因保存对象
		var reasonCollection = {};
		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 3 //查询场景：项目档案列表页
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
					},
					valueFormatter: function (params) {//格式化
						var value = $scope.gridOptions.columnTypes['词汇'].valueFormatter(params);
						if(params.data.project_valid == 4){
							if (params.data.epu_stat == 1){
								value = "解冻草稿";
							}else if(params.data.epu_stat == 3){
								if(params.data.epu_audit_stat == '审核拒绝'){
									value = "解冻拒绝";
								}else{
									value = "解冻申请中";
								}
							}else if (params.data.freeze_type > 0) {
								value += '(' + reasonCollection[params.data.freeze_type] +')';
							}
						}
						return value;
					}
				},
				/* {
					field: 'stat',
					headerName: '审核状态',
					hcDictCode: '*'
				}, */
				{
					field: 'report_type',
					headerName: '报备类型',
					hcDictCode: 'epm.report_type'
				},
				{
					field: 'project_code',
					headerName: '项目编码'
				},
				{
					field: 'project_name',
					headerName: '项目名称'
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
					field: 'report_time',
					headerName: '申报日期',
					type: '时间'
				},
				{
					field: 'project_valid_date',
					headerName: '报备有效期至',
					type: '日期'
				},
				{
					field: 'stage_update_deadline',
					headerName: '进度更新期限',
					type: '日期'
				},
				{
					field: 'province_name',
					headerName: '省'
				},
				{
					field: 'city_name',
					headerName: '市'
				},
				{
					field: 'area_name',
					headerName: '区'
				},
				{
					field: 'address',
					headerName: '详细地址'
				},
				{
					field: 'stage_name',
					headerName: '项目当前进度'
				},
				{
					field: 'division_id',
					headerName: '所属事业部',
					hcDictCode: 'epm.division'
				},
				{
					field: 'trading_company_name',
					headerName: '交易公司'
				},
				{
					field: 'manager',
					headerName: '项目经理'
				},
				{
					field: 'pdt_line',
					headerName: '产品线',
					hcDictCode: 'epm.pdt_line'
				},
				{
					field: 'project_source',
					headerName: '工程类型',
					hcDictCode: 'epm.project_source'
				},
				{
					field: 'party_a_name',
					headerName: '甲方名称'
				},
				{
					field: 'party_a_link_person',
					headerName: '甲方联系人'
				},
				{
					field: 'party_a_phone',
					headerName: '甲方联系电话',
					valueGetter: function (params) {
						return params.data.party_a_phone_hide
					}
				},
				{
					field: 'party_b_name',
					headerName: '乙方名称'
				},
				{
					field: 'party_b_link_person',
					headerName: '乙方联系人'
				},
				{
					field: 'party_b_phone',
					headerName: '乙方联系电话',
					valueGetter: function (params) {
						return params.data.party_b_phone_hide
					}
				},
				{
					field: 'is_discount',
					headerName: '已生成折扣单',
					type : '是否'
				},
				{
					field: 'is_contract',
					headerName: '已生成合同',
					type : '是否'
				},
				{
					field: 'rel_project_code',
					headerName: '战略报备编码'
				},
				{
					field: 'rel_project_name',
					headerName: '战略项目名称'
				},
				{
					field: 'strategic_stage',
					headerName: '战略对接进度'
				},
				{
					field: 'operating_mode',
					headerName: '管理类型',
					hcDictCode: 'epm.operating_mode'
				},
				{
					field: 'is_local',
					headerName: '本地/异地',
					hcDictCode: 'epm.is_local'
				},
				{
					field: 'need_deposit',
					headerName: '缴纳保证金',
					type: '词汇',
					cellEditorParams: {
						names: ['同意', '不同意'],
						values: [2, 1]
					}
				},
				{
					field: 'project_type',
					headerName: '业主类型/项目类型',
					hcDictCode: 'epm.project_type'
				},
				{
					field: 'background',
					headerName: '背景关系',
					hcDictCode: 'epm.background'
				},
				{
					field: 'predict_proj_qty',
					headerName: '预计项目数量'
				},
				{
					field: 'site_area',
					headerName: '工程建筑面积'
				},
				{
					field: 'predict_pdt_qty',
					headerName: '工程用量（套）'
				},
				{
					field: 'is_foreign',
					headerName: '海外',
					type: '是否'
				},
				{
					field: 'construction_stage',
					headerName: '工程施工进度'
				},
				{
					field: 'completion_date',
					headerName: '竣工日期',
					type: '日期'
				},
				{
					field: 'predict_sign_date',
					headerName: '预计签订日期',
					type: '日期'
				},
				{
					field: 'predict_sales_amount',
					headerName: '预计销售收入（万元）',
					type: '万元'
				},
				{
					field: 'intent_product',
					headerName: '工程意向产品'
				},
				{
					field: 'competitor',
					headerName: '竞争对手'
				},
				{
					field: 'stage_desc',
					headerName: '项目进度描述'
				},
				{
					field: 'dealer_follower',
					headerName: '客户现场跟进人'
				},
				{
					field: 'dealer_follower_phone',
					headerName: '客户跟进人电话'
				},
				{
					field: 'own_follower',
					headerName: '乐华现场跟进人'
				},
				{
					field: 'own_follower_phone',
					headerName: '乐华跟进人电话'
				},
				{
					field: 'need_sample',
					headerName: '产品已送样',
					type: '是否'
				},
				{
					field: 'need_quote',
					headerName: '产品已报价',
					type: '是否'
				},
				{
					field: 'creator_name',
					headerName: '创建人'
				}
			]
		};
		
		//继承
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});

		//获取冻结原因词汇值
		$q.when()
		.then(function(){
			return $q.all([
				requestApi.getDict('epm.proj.freeze_type')
			]);
		})
		.then(function (responses){
			responses[0].forEach(function(value){
				reasonCollection[value.dictvalue] = value.dictname
			});
		});

		['add', 'delete'].forEach(function (buttonId) {
			$scope.toolButtons[buttonId].hide = true;
		});
	}
	
	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjectList
	});
});