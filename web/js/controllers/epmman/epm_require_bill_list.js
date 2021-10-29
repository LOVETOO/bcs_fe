/**
 * 工程要货单 - 列表页
 * @since 2019-07-31
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {

	EPMRequireBillList.$inject = ['$scope'];
	function EPMRequireBillList(   $scope) {

		/**
		 * 表格
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 1 //查询场景：工程要货单列表页
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'order_stat',
					headerName: '订单状态',
					hcDictCode: 'epm.require_bill.order_stat'
				},
				{
					field: 'sa_salebillno',
					headerName: '要货单号'
				},
				{
					field: 'date_invbill',
					headerName: '订单日期',
					type: '日期'
				},
				{
					field: 'created_by_name',
					headerName: '申请人'
				},
				{
					field: 'bill_type',
					headerName: '订单类型',
					hcDictCode: 'epm.bill_type'
				},
				{
					field: 'channel',
					headerName: '销售渠道',
					hcDictCode: 'sales.channel'
				},
				{
					field: 'order_pdt_line',
					headerName: '订单产品线',
					hcDictCode: 'epm.order_pdt_line'
				},
				{
					field: 'business_type',
					headerName: '业务类型',
					hcDictCode: 'epm.business_type'
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
					field: 'billing_unit_name',
					headerName: '开票单位'
				},
				{
					field: 'may_consignment_amount',
					headerName: '可发货余额',
					type: '金额'
				},
				{
					field: 'deductions_way',
					headerName: '扣款方式',
					hcDictCode: 'epm.deductions_way'
				},
				{
					field: 'in_date',
					headerName: '期望到达日期',
					type: '日期'
				},
				{
					field: 'discount_apply_code',
					headerName: '折扣单号'
				},
				{
					field: 'created_source',
					headerName: '订单来源',
					hcDictCode: 'epm.created_source'
				},
				{
					field: 'dhl_no',
					headerName: '客户自编号'
				},
				{
					field: 'trading_company_name',
					headerName: '交易公司'
				},
				{
					field: 'note',
					headerName: '备注'
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
					headerName: '合作结束日期',
					type: '日期'
				},
				{
					field: 'contract_type',
					headerName: '签约方式',
					hcDictCode: 'epm.contract_type'
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
					field: 'stage_name',
					headerName: '项目当前进度'
				},
				{
					field: 'division_id',
					headerName: '所属事业部',
					hcDictCode: 'epm.division'
				},
				{
					field: 'take_man',
					headerName: '收货人'
				},
				{
					field: 'phone_code',
					headerName: '联系电话'
				},
				{
					field: 'address1',
					headerName: '收货地址'
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
					field: 'amount_total',
					headerName: '折前总金额',
					type: '金额'
				},
				{
					field: 'wtamount_bill',
					headerName: '折后总金额',
					type: '金额'
				},
				{
					field: 'qty_sum',
					headerName: '总数量',
					type: '数量'
				},
				{
					field: 'total_cubage',
					headerName: '总体积',
					type: '体积'
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
				}
				/* {
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
					field: 'is_deduct_deposit',
					headerName: '扣定金',
					type: '是否'
				} */
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
		
		/**
         * 通用查询
         */
        $scope.commonSearch = {
            customer_org: {/* 客户查询 */
                postData: {
					search_flag: 124
				},
				sqlWhere: 'valid = 2',// 2-已审核
                beforeOk: function (result) {
					$scope.searchObj.customer_code = result.customer_code;
					$scope.searchObj.customer_name = result.customer_name;
                }
			},
			trading_company_name: {/* 交易公司查询 */
				title: '交易公司',
				postData:{
					flag : 1
				},
				gridOptions:{
					columnDefs:[
						{
							headerName: "交易公司编码",
							field: "trading_company_code"
						},{
							headerName: "交易公司名称",
							field: "trading_company_name"
						}
					]
				},
				dataRelationName:'sa_out_bill_heads',
				action:'commonselete',
				afterOk: function (result) {
					$scope.searchObj.trading_company_id = result.trading_company_id;
					$scope.searchObj.trading_company_name = result.trading_company_name;
				}
			},
			billing_unit_name: {/* 开票单位查询 */
				title: '开票单位',
				postData:{
					flag : 2,
					trading_company_id : 
						$scope.searchObj.trading_company_id > 0 ? $scope.searchObj.trading_company_id : 0
				},
				gridOptions:{
					columnDefs:[
						{
							headerName: "开票单位编码",
							field: "customer_code"
						},{
							headerName: "开票单位名称",
							field: "customer_name"
						}
					]
				},
				dataRelationName:'sa_out_bill_heads',
				action:'commonselete',
				afterOk: function (result) {
					$scope.searchObj.billing_unit_name = result.customer_name;
				}
            },
			contract_code: {/* 合同查询 */
                sqlWhere: " contract_type in (1, 2) ",
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "工程合同编码",
                                field: "contract_code"
                            },{
                                headerName: "工程合同名称",
                                field: "contract_name"
                            },{
                                headerName: "工程编码",
                                field: "project_code"
                            },{
                                headerName: "工程名称",
                                field: "project_name"
                            },{
                                headerName: "签约类型",
                                field: "contract_type",
                                hcDictCode : 'epm.contract_type'
                            },{
                                headerName: "签约时间",
                                field: "signed_date",
                                type : '日期'
                            }
                        ]
                    },
                    beforeOk : function (result) {
                        $scope.searchObj.contract_code = result.contract_code;
                        $scope.searchObj.contract_name = result.contract_name;
                    }
            },
			project_code: {/* 项目查询 */
                postData: function () {
					return {
						report_type: 1,
						customer_id: user.isCustomer ? customer.customer_id : 0
					};
				},
				afterOk: function (proj) {
					$scope.searchObj.project_code = proj.project_code;
                    $scope.searchObj.project_name = proj.project_name;
				}
            }
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMRequireBillList
	});
});