/**
 * 项目档案 - 详情页
 * @since 2019-07-05
 */
define(['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'gridApi', 'openBizObj', 'promiseApi', 'controllers/epmman/epmman', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, swalApi, gridApi, openBizObj, promiseApi, epmman) {

	EpmProjProp.$inject = ['$scope', '$stateParams', '$modal'];
	function EpmProjProp($scope, $stateParams, $modal) {

		//继承
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

		$scope.tabs.actionLog.hide = false;

		//把路由参数放入作用域
		$scope.$stateParams = $stateParams;

		/**
		 * 标签页
		 */
		$scope.tabs.base.title = '基本信息';

		$scope.tabs.relation = {
			title: '项目相关'
		};

		/**
		 * 是否创建人登陆,默认是
		 */
		$scope.creatorLog = true;

		/**
		 * 表格：项目进度历程
		 */
		$scope.stageGridOptions = {
			getRowStyle: function (params) {
				if (params.node.rowIndex === 0) {
					return {
						'font-weight': 'bold'
					};
				}
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'stage_name',
					headerName: '进度名称'
				},
				{
					field: 'stage_note',
					headerName: '进度备注'
				},
				{
					field: 'stage_desc',
					headerName: '进度描述',
					width: 300
				},
				{
					field: 'creator',
					headerName: '创建人'
				},
				{
					field: 'createtime',
					headerName: '创建时间',
					minWidth: 146
				},
				{
					field: 'updator',
					headerName: '修改人'
				},
				{
					field: 'updatetime',
					headerName: '修改时间',
					minWidth: 146
				},
				{
					field: 'stage_update_deadline',
					headerName: '进度更新期限',
					type: '日期',
					hide : 'true',
					headerClass: 'reasonClass',
                    cellStyle: {
                        'color': '#F35A05'
                    }
				}
			]
		};

		/**
		 * 表格：分配客户
		 */
		$scope.dealerGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'customer_code',
					headerName: '客户编码'
				},
				{
					field: 'customer_name',
					headerName: '客户名称',
					width: 300
				},
				{
					field: 'disabled',
					headerName: '已失效',
					type : '是否'
				}
			]
		};

		$scope.footerLeftButtons.addRow.click = function () {
			return $modal
				.openCommonSearch({
					classId: 'customer_org',
					postData: {
						search_flag: 124
					},
					checkbox: true
				})
				.result
				.then(function (customers) {
					var customersInGrid = $scope.dealerGridOptions.hcApi.getRowData();

					customers = customers.filter(function (customer) {
						return customersInGrid.every(function (customerInGrid) {
							return customerInGrid.customer_id != customer.customer_id;
						});
					});

					if (!customers.length) return;

					Array.prototype.push.apply($scope.data.currItem.epm_report_auths, customers);

					$scope.dealerGridOptions.api.updateRowData({
						add: customers
					});
				});
		};

		/**
		 * 通用查询
		 */
		$scope.commonSearch = {

			//战略报备号
			rel_project_code: {
				postData: function () {
					return {
						report_type: 2, //战略报备
						customer_id: $scope.data.currItem.customer_id
					};
				},
				beforeOpen: function () {
					if (!+$scope.data.currItem.customer_id) {
						swalApi.info('请先选择客户');
						return false;
					}
				},
				afterOk: function (projReport) {
					['project_id', 'project_code', 'project_name'].forEach(function (field) {
						$scope.data.currItem['rel_' + field] = projReport[field];
					});
				}
			},

			//跟进进度
			stage_name: {
				afterOk: function (stage) {
					['stage_id', 'stage_name', 'stage_note'].forEach(function (field) {
						$scope.data.currItem[field] = stage[field];
					});
				}
			},

			//交易公司
			trading_company_name: {
				sqlWhere: 'is_contract_unit = 2',
				afterOk: function (org) {
					$scope.data.currItem.trading_company_name = org.orgname;
				}
			},

			//客户
			customer_code: {
				postData: {
					search_flag: 122
				},
				afterOk: function (customer) {
					['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
						$scope.data.currItem[field] = customer[field];
					});

					['id', 'code', 'name'].forEach(function (field) {
						$scope.data.currItem['rel_project_' + field] = undefined;
					});
				}
			},

			//省
			province_name: {
				title: '省',
				postData: {
					areatype: 4
				},
				afterOk: function (province) {
					$scope.data.currItem.province = province.areaid;
					$scope.data.currItem.province_name = province.areaname;
				}
			},

			//市
			city_name: {
				title: '市',
				postData: function () {
					return {
						areatype: 5,
						superid: $scope.data.currItem.province
					}
				},
				beforeOpen: function () {
					if (!+$scope.data.currItem.province) {
						swalApi.info('请先选择省');
						return false;
					}
				},
				afterOk: function (city) {
					$scope.data.currItem.city = city.areaid;
					$scope.data.currItem.city_name = city.areaname;
				}
			},

			//区
			area_name: {
				title: '区',
				postData: function () {
					return {
						areatype: 6,
						superid: $scope.data.currItem.city
					}
				},
				beforeOpen: function () {
					if (!+$scope.data.currItem.city) {
						swalApi.info('请先选择市');
						return false;
					}
				},
				afterOk: function (area) {
					$scope.data.currItem.area = area.areaid;
					$scope.data.currItem.area_name = area.areaname;
				}
			}

		};
		// 地图跳转
		$scope.showMap = function () {
			/*var url = '/web/index.jsp#/epmman/epm_map?address=' + $scope.data.currItem.area_full_name;
			console.log(url);
			window.open(url);*/
			var address
			if ($scope.data.currItem.area_full_name) {
				address = $scope.data.currItem.area_full_name + $scope.data.currItem.address;
			}
			top.require(['openBizObj'], function (openBizObj) {
				openBizObj({
					stateName: 'baseman.map',
					params: {
						address: encodeURI(address)
					}
				});
			});
		}
		/**
		 * 新增业务数据
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData);

			bizData.report_type = $stateParams.report_type;

			bizData.epm_report_auths = [];
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			//是否创建人查看
			$scope.creatorLog = bizData.creator === user.userid;
			$scope.hcSuper.setBizData(bizData);

			//经销商
			gridApi.execute($scope.dealerGridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(bizData.epm_project_auths);
				$scope.dealerGridOptions.columnApi.setColumnsVisible(['disabled'],bizData.stat == 5);//为true则展示
			});

			//阶段历程
			gridApi.execute($scope.stageGridOptions, function (gridOptions) {
				bizData.epm_project_stages[0].stage_update_deadline = bizData.stage_update_deadline;
				$scope.stageGridOptions.columnApi.setColumnsVisible(['stage_update_deadline'], !!(bizData.stage_update_deadline));
				gridOptions.hcApi.setRowData(bizData.epm_project_stages);
			});

			//合同
			gridApi.execute($scope.contractGridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(bizData.epm_project_contracts);
			});

			//要货单
			gridApi.execute($scope.requireBillGridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(bizData.epm_require_bills);
			});
		};

		/**
		 * 档案只读
		 * @override
		 */
		$scope.isFormReadonly = function () {
			return true;
		};

		epmman.hideTel({
			$scope: $scope,
			keys: ['party_a_phone', 'party_b_phone']
		});

		/**
		 * 表格：合同
		 */
		$scope.contractGridOptions = {
			hcOpenState: {
				'*': {
					name: function (params) {
						return Switch(params.data.contract_mode, '==')
							.case(1, 'epmman.epm_project_contract_prop')			//经销商合同
							.case(2, 'epmman.epm_autotrophy_contract_prop')			//自营合同
							.result;
					},
					idField: 'contract_id'
				}
			},
			columnDefs: [
				{
					type: '序号'
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
					field: 'valid',
					headerName: '有效状态',
					hcDictCode: 'valid'
				},
				{
					field: 'signed_date',
					headerName: '签订时间',
					type: '日期'
				},
				{
					field: 'signed_location',
					headerName: '签订地点'
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
					field: 'contract_amt',
					headerName: '合同总额',
					type: '金额'
				},
				{
					field: 'contract_unit',
					headerName: '签约单位'
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
					field: 'contract_effect_date',
					headerName: '合作开始时间',
					type: '日期'
				},
				{
					field: 'contract_expire_date',
					headerName: '合作结束时间',
					type: '日期'
				},
				{
					field: 'first_delivery_date',
					headerName: '首次发货日期',
					type: '日期'
				},
				{
					field: 'remark',
					headerName: '备注'
				}
			]
		};

		/**
		 * 表格：要货单
		 */
		$scope.requireBillGridOptions = {
			hcOpenState: {
				'*': {
					name: 'epmman.epm_require_bill_prop',
					idField: 'sa_out_bill_head_id'
				}
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'sa_salebillno',
					headerName: '要货单号'
				},
				{
					field: 'creation_date',
					headerName: '要货日期',
					type: '日期'
				},
				{
					field: 'created_by',
					headerName: '申请人'
				},
				{
					field: 'bill_type',
					headerName: '订单类型',
					hcDictCode: 'epm.bill_type'
				},
				{
					field: 'channel',
					headerName: '渠道',
					hcDictCode: 'epm.channel'
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
					field: 'billing_unit_name',
					headerName: '开票单位'
				},
				{
					field: 'may_consignment_amount',
					headerName: '可发货余额',
					type: '金额'
				},
				{
					field: 'payment_type',
					headerName: '扣款方式',
					hcDictCode: 'epm.payment_type'
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
					field: 'division_name',
					headerName: '所属事业部'
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
					field: 'address',
					headerName: '收货地址'
				},
				{
					field: 'discount_type',
					headerName: '折扣类型',
					hcDictCode: 'epm.discount_type'
				},
				{
					field: 'discount_tax',
					headerName: '折扣率',
					type: '百分比'
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
				},
				{
					field: 'is_deduct_deposit',
					headerName: '扣定金',
					type: '是否'
				}
			]
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjProp
	});
});