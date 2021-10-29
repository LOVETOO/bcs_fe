/**
 * 工程折扣延期 - 详情页
 * @since 2019-09-09
 */
define(['module', 'controllerApi', 'base_obj_prop', 'angular', 'requestApi', 'swalApi', 'gridApi', 'numberApi', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, angular, requestApi, swalApi, gridApi, numberApi) {
	'use strict';

	/**
	 * 详情页控制器
	 */
	EPMDiscountDelayProp.$inject = ['$scope', '$q'];
	function EPMDiscountDelayProp(   $scope,   $q) {

		//表格切换定义
		$scope.item_date = {};
		$scope.item_date.detailed = {
			title: '延期明细',
			active: true
		};
		$scope.item_date.deliveryPlan = {
			title: '提货计划'
		};

		//继承控制器
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

		/**
		 * 新增时对业务对象的处理
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData);

			bizData.ecn_type = 2; //变更类型：延期

			bizData.epm_discount_ecn_before_lines = [];
			bizData.epm_discount_ecn_after_lines = [];
			//变更预计提货
			bizData.epm_discount_ecn_plans = [];
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);

			gridApi.execute($scope.gridOptions, function (gridOptions) {
				$scope.gridOptions.columnApi.setColumnsVisible(['contract_price', 'contract_amount'],
					$scope.data.currItem.contract_type == 1);//为true则展示
				gridOptions.hcApi.setRowData(bizData.epm_discount_ecn_after_lines);
				calculationAmount();
			});
			//设置提货计划
			gridApi.execute( $scope.gridOptionDseliveryPlan, function () {
				var proj = {};
				bizData.epm_discount_ecn_plans.forEach(function (value, index) {
					if(index == 0){
						proj[value.seq] = value.plan_qty;
					}else{
						if(proj[value.seq] == undefined){
							proj[value.seq] = value.plan_qty;
						}else{
							proj[value.seq] = numberApi.sum(value.plan_qty, proj[value.seq]);
						}
					}
				});
				bizData.epm_discount_ecn_plans.forEach(function (value) {
					value.active_qty = numberApi.sub(value.contract_qty, proj[value.seq]);
				});
				/* 行合并 */
				var rowProj = {};
				var seq = 0;
				bizData.epm_discount_ecn_plans.forEach(function (value, index) {
					if(index == 0){
						rowProj[value.seq] = 1;
					}else if(rowProj[value.seq] == undefined){
						rowProj[value.seq] = 1;
					}else{
						rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
					}
				});
				bizData.epm_discount_ecn_plans.forEach(function (value, index) {
					if(index == 0){
						seq = value.seq;
						value.span_count = rowProj[value.seq];
					}else if(value.seq != seq){
						seq = value.seq;
						value.span_count = rowProj[value.seq];
					}else{
						value.span_count = undefined;
					}
				});
				$scope.gridOptionDseliveryPlan.hcApi.setRowData(bizData.epm_discount_ecn_plans);
			});
		};

		/**
		 * 校验
		 * @override
		 */
		$scope.validCheck = function (invalidBox) {
			$scope.hcSuper.validCheck(invalidBox);

			//生成提货计划行数据
			//定义一个容器
			var arr = [];
			$scope.data.currItem.epm_discount_ecn_after_lines.forEach(function (value, index) {
				//排序
				value.seq = index + 1;
				var notExist = true;
				$scope.data.currItem.epm_discount_ecn_plans.forEach(function (val) {
					if(value.item_id == val.item_id && value.source_line_id == val.source_line_id){
						val.seq = value.seq;
						val.contract_qty = value.contract_qty;
						notExist = false;
						arr.push(val);
					}
				});
				if(notExist){//不存在
					arr.push({//新增一行数据
						seq : value.seq,
						item_id : value.item_id,
						source_line_id : value.source_line_id,
						item_code : value.item_code,
						item_name : value.item_name,
						contract_qty : value.contract_qty,
						active_qty : value.contract_qty
					});
				}
			});
			arr.sort(function (a, b) {
				return a.seq - b.seq;
			});
			$scope.data.currItem.epm_discount_ecn_plans = arr;
			$scope.gridOptionDseliveryPlan.hcApi.setRowData(arr);
			var proj = {};
			$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value, index) {
				if(index == 0){
					proj[value.seq] = value.plan_qty;
				}else{
					if(proj[value.seq] == undefined){
						proj[value.seq] = value.plan_qty;
					}else{
						proj[value.seq] = numberApi.sum(value.plan_qty, proj[value.seq]);
					}
				}
			});
			$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value) {
				value.active_qty = numberApi.sub(value.contract_qty, proj[value.seq]);
			});
			//校验提货计划数据
			var seq = 0;
			var accord = true;
			var incompleteBox = [];
			var nonidentityBox = [];
			$scope.data.currItem.epm_discount_ecn_plans.some(function(value){
				if(value.active_qty != undefined 
					&& value.active_qty != null 
					&& value.plan_qty != undefined){
					accord = false;
					return true;
				}
			});
			if(accord && $scope.data.currItem.epm_discount_ecn_plans.length > 0){
				invalidBox.push('请维护产品的“提货计划”（具体日期+预提货数量)');
			}else{
				$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value, index) {
					if(index == 0){
						seq = value.seq;
						if(value.active_qty != undefined && value.active_qty != null && value.active_qty != ""){
							if(value.active_qty > 0){
								incompleteBox.push(index + 1);
							}else if(value.active_qty < 0){
								nonidentityBox.push(index + 1);
							}
						}
					}else if(value.seq != seq){
						seq = value.seq;
						if(value.active_qty != undefined && value.active_qty != null && value.active_qty != ""){
							if(value.active_qty > 0){
								incompleteBox.push(index + 1);
							}else if(value.active_qty < 0){
								nonidentityBox.push(index + 1);
							}
						}
					}
				});
			}
			if(incompleteBox.length){
				invalidBox.push(
					'',
					'产品的提货计划需要全部计划完毕，以下行不合法，',
					'第' + incompleteBox.join('、') + '行'
				);
			}
			if(nonidentityBox.length){
				invalidBox.push(
					'',
					'产品的预提货数量不能大于合同数量，以下行不合法：',
					'第' + nonidentityBox.join('、') + '行'
				);
			}
		};

		/**
		 * 初始化
		 * @override
		 */
		$scope.doInit = function () {
			return $q
				.when()
				.then($scope.hcSuper.doInit)
				.then(function () {
					if ($scope.data.isInsert) {
						return $('[hc-input="data.currItem.source_discount_apply_code"]')
							.controller('hcInput')
							.btnClick()
							.catch(function () {
								close();
							});
					}
				});
		};

		/**
		 * 通用查询
		 */
		$scope.commonSearch = {

			//原折扣单号
			source_discount_apply_code: {
				title: '请选择要延期的折扣',
				postData: function () {
					return {
						search_flag: 4, //查询场景：折扣延期选择折扣申请时
						discount_apply_id: $scope.data.currItem.discount_apply_id
					};
				},
				beforeOk: function (discount_apply) {
					return requestApi
						.post({
							classId: 'epm_discount_ecn',
							action: 'generate_delay_data',
							data: {
								discount_apply_id: discount_apply.discount_apply_id
							}
						})
						.then(function (discount_delay) {
							if (discount_delay.error) {
								swalApi(discount_delay.error);
								throw discount_delay.error;
							}

							return discount_delay;
						});
				},
				afterOk: function (discount_delay) {
					angular.forEach(discount_delay, function (value, key) {

						Switch(typeof value).case('string', 'number', function () {
							$scope.data.currItem[key] = value;
						});
					});

					$scope.data.currItem.epm_discount_ecn_before_lines = discount_delay.epm_discount_ecn_before_lines;
					$scope.data.currItem.epm_discount_ecn_after_lines = discount_delay.epm_discount_ecn_after_lines;
					$scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_ecn_after_lines);

					if (!$scope.data.currItem.ecn_reason) {
						setTimeout(function () {
							$('[hc-input="data.currItem.ecn_reason"] input').focus();
						});
					}
					calculationAmount();
					$scope.gridOptions.columnApi.setColumnsVisible(['contract_price', 'contract_amount'],
						$scope.data.currItem.contract_type == 1);//为true则展示
				}
			}

		};

		/**
		 * 计算金额
		 */
		function calculationAmount(){
			return requestApi
					.post({
						classId: 'epm_discount_apply',
						action: 'calculationamount',
						data: {
							division_id: $scope.data.currItem.division_id,
							epm_discount_apply_lines : $scope.data.currItem.epm_discount_ecn_after_lines
						}
					})
					.then(function (discount_delay) {
						//事业部内结成本金额
						$scope.data.currItem.division_cost_amount = discount_delay.division_cost_amount;
						//物料实际成本金额
						$scope.data.currItem.item_cost_amount = discount_delay.item_cost_amount;
						//赋值
						$scope.data.currItem.epm_discount_ecn_after_lines = discount_delay.epm_discount_apply_lines;
						$scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_ecn_after_lines);
					});
		}

		/**s
		 * 页签改变事件
		 * @param params
		 */
		$scope.onObjTabChange = function (params) {
			$q.when()
				.then(function () {
					if(params.tab.title == '提货计划'){
						//定义一个容器
						var arr = [];
						$scope.data.currItem.epm_discount_ecn_after_lines.forEach(function (value, index) {
							//排序
							value.seq = index + 1;
							var notExist = true;
							$scope.data.currItem.epm_discount_ecn_plans.forEach(function (val) {
								if(value.item_id == val.item_id && value.source_line_id == val.source_line_id){
									val.seq = value.seq;
									val.contract_qty = value.contract_qty;
									notExist = false;
									arr.push(val);
								}
							});
							if(notExist){//不存在
								arr.push({//新增一行数据
									seq : value.seq,
									item_id : value.item_id,
									source_line_id : value.source_line_id,
									item_code : value.item_code,
									item_name : value.item_name,
									contract_qty : value.contract_qty,
									active_qty : value.contract_qty
								});
							}
						});
						arr.sort(function (a, b) {
							return a.seq - b.seq;
						});
						$scope.data.currItem.epm_discount_ecn_plans = arr;
						/* 行合并 */
						var rowProj = {};
						var seq = 0;
						$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value, index) {
							if(value.active_qty == null || value.active_qty == undefined || value.active_qty === ""){
								value.active_qty = value.contract_qty;
							}
							if(index == 0){
								rowProj[value.seq] = 1;
							}else if(rowProj[value.seq] == undefined){
								rowProj[value.seq] = 1;
							}else{
								rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
							}
						});
						$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value, index) {
							if(index == 0){
								seq = value.seq;
								value.span_count = rowProj[value.seq];
							}else if(value.seq != seq){
								seq = value.seq;
								value.span_count = rowProj[value.seq];
							}else{
								value.span_count = undefined;
							}
						});
						$scope.gridOptionDseliveryPlan.hcApi.setRowData($scope.data.currItem.epm_discount_ecn_plans);
					}
				});
		};


		/**
		 * 提货计划
		 */
		$scope.gridOptionDseliveryPlan = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'item_code',
				headerName: '产品编码',
				rowSpan: function (params) {
					if (params.node.data.span_count) {
						return params.node.data.span_count;
					}
				}
			}, {
				field: 'item_name',
				headerName: '产品名称',
				rowSpan: function (params) {
					if (params.node.data.span_count) {
						return params.node.data.span_count;
					}
				}
			}, {
				field: 'contract_qty',
				headerName: '申请数量',
				type : '数量',
				rowSpan: function (params) {
					if (params.node.data.span_count) {
						return params.node.data.span_count;
					}
				}
			}, {
				field: 'active_qty',
				headerName: '未分配数量',
				type : '数量',
				rowSpan: function (params) {
					if (params.node.data.span_count) {
						return params.node.data.span_count;
					}
				}
			}, {
				field: 'plan_qty',
				headerName: '预计提货数量',
				type : '数量'
			}, {
				field: 'plan_date',
				headerName: '预计提货时间',
				type : '日期'
			}],
			hcEvents: {
				cellDoubleClicked: function (params) {
					if ($scope.isFormReadonly() || !$scope.form.editing) {
						return;
					}
					if(params.data.contract_qty > 0){
						$scope.dateOfDelivery.open({//打开模态框
							resolve: {
								before_line: params.data,
								gridApi : gridApi
							},
							size: 'lg',
							controller: ['$scope', '$q', 'before_line', 'gridApi',
								function ($modalScope, $q, before_line, gridApi) {
									$modalScope.title = "提货计划设置";
									$modalScope.before_line = before_line;
									$modalScope.saveExecute = true;
									$modalScope.gridOptionDseliveryPlanLine = {
										columnDefs: [
											{
												type: '序号'
											},
											{
												field: 'plan_qty',
												headerName: '预计提货数量',
												hcRequired: true,
												editable : function (args) {
													return !args.node.rowPinned;
												},
												type : '数量',
												onCellValueChanged: function (args) {
													if($modalScope.saveExecute){
														if (args.newValue === args.oldValue) {
															return;
														}
														if(args.data.plan_qty <= 0){
															swalApi.info('输入不合法!输入大于零的数字');
															args.data.plan_qty = undefined;
														}
													}
													$modalScope.calSum();
												}
											},
											{
												field: 'plan_date',
												headerName: '预计提货时间',
												hcRequired: true,
												editable : function (args) {
													return !args.node.rowPinned;
												},
												type : '日期',
												onCellValueChanged: function (args) {
													if($modalScope.saveExecute){
														if (args.newValue === args.oldValue) {
															return;
														}
														if(new Date(args.data.plan_date).getTime() < new Date().getTime()){
															swalApi.info('预计提货时间需大于当天');
															args.data.plan_date = undefined;
														}else if(new Date(args.data.plan_date).Format('yyyy-MM-dd')
															== new Date().Format('yyyy-MM-dd')){
															swalApi.info('预计提货时间需大于当天');
															args.data.plan_date = undefined;
														}
													}
												}
											}
										],
										pinnedBottomRowData: [{ seq: '合计' }],
										//定义表格增减行按钮
										hcButtons: {
											businessAdd: {
												icon: 'iconfont hc-add',
												click: function () {
													$modalScope.gridOptionDseliveryPlanLine.api.stopEditing();
													$modalScope.discount_apply_plans;
													$modalScope.discount_apply_plans.push({
														seq : $modalScope.before_line.seq,
														source_line_id : $modalScope.before_line.source_line_id,
														item_id : $modalScope.before_line.item_id,
														item_code : $modalScope.before_line.item_code,
														item_name : $modalScope.before_line.item_name,
														contract_qty : $modalScope.before_line.contract_qty
													});
													$modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
														$modalScope.discount_apply_plans);
												}
											},
											invoiceDel: {
												icon: 'iconfont hc-reduce',
												click: function () {
													var idx = $modalScope.gridOptionDseliveryPlanLine.hcApi
														.getFocusedRowIndex();
													if (idx < 0) {
														swalApi.info('请选中要删除的行');
													} else {
														$modalScope.discount_apply_plans.splice(idx, 1);
														$modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
															$modalScope.discount_apply_plans);
													}
												}
											}
										}
									};
									//合计数据
									$modalScope.calSum = function () {
										$modalScope.gridOptionDseliveryPlanLine.api.setPinnedBottomRowData([
											{
												seq: '合计',
												plan_qty: numberApi.sum($modalScope.discount_apply_plans, 'plan_qty')
											}
										]);
									};
									$modalScope.discount_apply_plans = [];//定义一个数组
									$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value) {//设置同一个产品数据
										if(value.seq == $modalScope.before_line.seq){
											$modalScope.discount_apply_plans.push(value)
										}
									});
									gridApi.execute($modalScope.gridOptionDseliveryPlanLine, function () {
										$modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
											$modalScope.discount_apply_plans);
										$modalScope.calSum();
									});
									angular.extend($modalScope.footerRightButtons, {
										ok: {
											title: '确定',
											click: function () {
												return $q
													.when()
													.then(function () {
														$modalScope.saveExecute = false;
														$modalScope.gridOptionDseliveryPlanLine.api.stopEditing();
														$modalScope.saveExecute = true;
														var arr = [];
														var isExecute = true;
														//合计分配数量
														var sum = 0;
														$modalScope.discount_apply_plans.forEach(function (value) {
															sum = numberApi.sum(value.plan_qty, sum);
														});
														//校验合计数量
														if(sum > $modalScope.before_line.contract_qty){
															arr.push('当前预计提货合计数量超出合同数量，请重新输入');
															isExecute = false;
														}
														//进行数据校验
														$modalScope.discount_apply_plans.forEach(function (value, index) {
															/*==========校验日期=========*/
															if(value.plan_date == undefined || value.plan_date == null || value.plan_date == ""){
																arr.push("第" + (index+1) + "行,未维护提货时间");
																isExecute = false;
															}else if(new Date(value.plan_date).getTime() < new Date().getTime()){
																arr.push("第" + (index+1) + "行,预计提货时间需大于当天");
																isExecute = false;
															}else if(new Date(value.plan_date).Format('yyyy-MM-dd')
																== new Date().Format('yyyy-MM-dd')){
																arr.push("第" + (index+1) + "行,预计提货时间需大于当天");
																isExecute = false;
															}
															/*==========校验天数=========*/
															if(value.plan_qty <= 0 || value.plan_qty == undefined){
																arr.push("第" + (index+1) + "行,输入不合法!输入大于零的数字");
																isExecute = false;
															}
														});
														if(arr.length){
															swalApi.error(arr);
															return isExecute;
														}
														if(isExecute){
															var active_qty = 0;
															//合计提货数量
															$modalScope.discount_apply_plans.forEach(function (value) {
																active_qty = numberApi.sum(value.plan_qty, active_qty);
															});
															//计算未分配数量
															active_qty = numberApi
																.sub($modalScope.before_line.contract_qty, active_qty);
															var mapArr = [];
															$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value) {
																if(value.seq != $modalScope.before_line.seq){
																	mapArr.push(value);
																}
															});
															$scope.data.currItem.epm_discount_ecn_plans = mapArr;
															if($modalScope.discount_apply_plans.length > 0){
																//排序
																$modalScope.discount_apply_plans.sort(function (a, b) {
																	return new Date(a.plan_date).getTime() - new Date(b.plan_date).getTime();
																});
																//定义累计数量
																var totalPlanQty = 0;
																$modalScope.discount_apply_plans.forEach(function (value) {
																	//计算累计数量
																	totalPlanQty = numberApi.sum(totalPlanQty, value.plan_qty);
																	value.total_plan_qty = totalPlanQty;
																	//计算未分配数量
																	value.active_qty = active_qty;
																	$scope.data.currItem.epm_discount_ecn_plans.push(value);
																});
															}else{
																$modalScope.before_line.active_qty = active_qty;
																$modalScope.before_line.plan_date = undefined;
																$modalScope.before_line.plan_qty = undefined;
																$scope.data.currItem.epm_discount_ecn_plans.push($modalScope.before_line);
															}
															//排序
															$scope.data.currItem.epm_discount_ecn_plans.sort(function (a, b) {
																return a.seq - b.seq;
															});
															/* 行合并 */
															var rowProj = {};
															var seq = 0;
															$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value, index) {
																if(index == 0){
																	rowProj[value.seq] = 1;
																}else if(rowProj[value.seq] == undefined){
																	rowProj[value.seq] = 1;
																}else{
																	rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
																}
															});
															$scope.data.currItem.epm_discount_ecn_plans.forEach(function (value, index) {
																if(index == 0){
																	seq = value.seq;
																	value.span_count = rowProj[value.seq];
																}else if(value.seq != seq){
																	seq = value.seq;
																	value.span_count = rowProj[value.seq];
																}else{
																	value.span_count = undefined;
																}
															});
															//设置数据
															$scope.gridOptionDseliveryPlan.hcApi.setRowData(
																$scope.data.currItem.epm_discount_ecn_plans);
															return true;
														}
													})
													.then(function (isExecute) {
														if(isExecute){//关闭窗口
															$modalScope.$close();
														}
													});
											}
										}
									});
								}]
						})
					}else{
						swalApi.info('请先维护申请数量');
					}
				}
			}
		};

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcName: '延期明细',
			hcRequired: true,
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'item_code',
					headerName: '产品编码'
				},
				{
					field: 'item_name',
					headerName: '产品名称'
				},
				{
					field: 'entorgid',
					headerName: '产品线',
					hcDictCode: 'entorgid'
				},
				{
					field: 'model',
					headerName: '型号'
				},
				{
					field: 'contract_qty',
					headerName: '申请数量',
					type: '数量',
					hcRequired: true
				},
				{
					field: 'source_stand_price',
					headerName: '原标准单价(元)',
					type: '金额'
				},
				{
					field: 'contract_price',
					headerName: '工程方单价(元)',
					type: '金额',
					hide: true
				},
				{
					field: 'contract_amount',
					headerName: '合同总额(元)',
					type: '金额',
					hide: true
				},
				{
					field: 'stand_price',
					headerName: '标准单价(元)',
					type: '金额'
				},
				{
					field: 'discount_rate',
					headerName: '应用折扣率',
					hcRequired: true
				},
				{
					field: 'extra_discount_rate',
					headerName: '审批折扣率'
				},
				{
					field: 'source_discounted_price',
					headerName: '原折后单价(元)',
					type: '金额'
				},
				{
					field: 'discounted_price',
					headerName: '折后单价(元)',
					type: '金额'
				},
				{
					field: 'undiscounted_amount',
					headerName: '折前金额',
					type: '金额',
					hide: true
				},
				{
					field: 'discounted_amount',
					headerName: '折后金额',
					type: '金额'
				},
				{
					field: 'spec',
					headerName: '规格'
				},
				{
					field: 'color',
					headerName: '颜色'
				},
				{
					field: 'cubage',
					headerName: '体积(m³)',
					type: '体积'
				},
				{
					field: 'weight',
					headerName: '重量(kg)'
				},
				{
					field: 'total_volume',
					headerName: '总体积(m³)',
					type: '体积'
				},
				{
					field: 'total_weight',
					headerName: '总重量(kg)'
				},
				{
					field: 'unit',
					headerName: '单位'
				},
				{
					field: 'remark',
					headerName: '备注'
				}
			]
		};
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMDiscountDelayProp
	});
});