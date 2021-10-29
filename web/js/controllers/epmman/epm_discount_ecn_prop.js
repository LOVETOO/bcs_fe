/**
 * 工程折扣变更 - 详情页
 * @since 2019-09-03
 */
define(['module', 'controllerApi', 'base_obj_prop', 'angular', 'requestApi', 'swalApi', 'numberApi', 'gridApi', 'controllers/epmman/epmman', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, angular, requestApi, swalApi, numberApi, gridApi, epmman) {
	'use strict';

	/**
	 * 详情页控制器
	 */
	EPMDiscountECNProp.$inject = ['$scope', '$q', '$modal', '$stateParams'];
	function EPMDiscountECNProp(   $scope,   $q,   $modal,   $stateParams) {

		//继承控制器
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

		//表格切换定义
		$scope.item_date = {};
		$scope.item_date.detailed = {
			title: '变更明细',
			active: true
		};
		$scope.item_date.deliveryPlan = {
			title: '提货计划'
		};

		/**
		 * 新增时对业务对象的处理
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData);

			bizData.ecn_type = 1; //变更类型：替换

			bizData.epm_discount_ecn_before_lines = [];
			bizData.epm_discount_ecn_after_lines = [];
			//变更预计提货
			bizData.epm_discount_ecn_plans = [];

			var discount_apply_id = +$stateParams.discount_apply_id;
			if (discount_apply_id) {
				var discount_apply_line_ids = $stateParams.discount_apply_line_id;

				if (!Array.isArray(discount_apply_line_ids)) {
					discount_apply_line_ids = [discount_apply_line_ids];
				}

				return requestApi
					.post({
						classId: 'epm_discount_apply',
						action: 'select',
						data: {
							discount_apply_id: discount_apply_id
						}
					})
					.then(function (discount_apply) {
						setHeadDataByDiscountApply(discount_apply);

						bizData.epm_discount_ecn_before_lines = discount_apply.epm_discount_apply_lines.filter(function (discount_apply_line) {
							return discount_apply_line_ids.includes(discount_apply_line.discount_apply_line_id);
						});

						bizData.epm_discount_ecn_after_lines = bizData.epm_discount_ecn_before_lines.map(function (before_line) {
							var after_line = {
								source_line_id: before_line.discount_apply_line_id
							};

							['item_id', 'item_code', 'item_name', 'active_qty'].forEach(function (key) {
								after_line['source_' + key] = before_line[key];
							});

							return after_line;
						});

						return gridApi.execute($scope.gridOptions, function (gridOptions) {
							gridOptions.hcApi.setRowData(bizData.epm_discount_ecn_after_lines);
						});
					});
			}
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);
			isProprietary ();
			gridApi.execute($scope.gridOptions, function (gridOptions) {
				//行合并
				var rowProj = {};
				var source_line_id = "";
				bizData.epm_discount_ecn_after_lines.forEach(function (value, index) {
					if(index == 0){
						rowProj[value.source_line_id] = 1;
					}else if(rowProj[value.source_line_id] == undefined){
						rowProj[value.source_line_id] = 1;
					}else{
						rowProj[value.source_line_id] = numberApi.sum(rowProj[value.source_line_id], 1);
					}
				});
				bizData.epm_discount_ecn_after_lines.forEach(function (value, index) {
					if(index == 0){
						source_line_id = value.source_line_id;
						value.span_count = rowProj[value.source_line_id];
					}else if(value.source_line_id != source_line_id){
						source_line_id = value.source_line_id;
						value.span_count = rowProj[value.source_line_id];
					}else{
						value.span_count = undefined;
					}
				});
				gridOptions.hcApi.setRowData(bizData.epm_discount_ecn_after_lines);
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
			//判断工程放单价必须小于标准单价
			var invalidPrice = [];
			var invalidRows = [];
			$scope.data.currItem.epm_discount_ecn_after_lines.forEach(function (line, index) {
				var value = line.contract_qty;
				var type = typeof value;
				if (type === 'number' || (type === 'string' && value) ) {
					if ( !(value > 0) ) {
						invalidRows.push(index + 1);
					}
				}
				if(numberApi.toNumber(line.contract_price) >= numberApi.toNumber(line.stand_price)){
					invalidPrice.push(index + 1);
				}
			});

			if (invalidRows.length) {
				invalidBox.push(
					'',
					'申请数量必须大于0，以下行不合法：',
					'第' + invalidRows.join('、') + '行'
				);
			}
			if (invalidPrice.length) {
				invalidBox.push(
					'',
					'工程方单价必须小于标准单价，以下行不合法：',
					'第' + invalidPrice.join('、') + '行'
				);
			}
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
			$scope.gridOptionDseliveryPlan.hcApi.setRowData($scope.data.currItem.epm_discount_ecn_plans);
			//校验工程方单价
			var contractPriceBox = [];
			if($scope.data.currItem.contract_type == 1){
				$scope.data.currItem.epm_discount_ecn_after_lines.forEach(function (value, index) {
					if (!(value.contract_price > 0)){
						contractPriceBox.push(index+1);
					}
				});
			}
			if(contractPriceBox.length){
				invalidBox.push(
					'',
					'工程方单价比较大于零，以下行不合法，',
					'第' + contractPriceBox.join('、') + '行'
				);
			}
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
					if ($scope.data.isInsert && !$scope.data.currItem.discount_apply_code) {
						return $('[hc-input="data.currItem.discount_apply_code"]')
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

			//折扣单号
			discount_apply_code: {
				title: '请选择要进行变更的折扣申请单',
				postData: function () {
					return {
						search_flag: 3, //查询场景：折扣变更选择折扣申请时
						discount_apply_id: $scope.data.currItem.discount_apply_id
					};
				},
				afterOk: function (discount_apply) {
					setHeadDataByDiscountApply(discount_apply);

					$scope.data.currItem.epm_discount_ecn_before_lines = [];
					$scope.data.currItem.epm_discount_ecn_after_lines = [];
					$scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_ecn_after_lines);

					return $scope.addLine();
				}
			}

		};

		function setHeadDataByDiscountApply(discount_apply) {
			var no_copy_keys = {};

			[
				'stat',						//单据状态
				'wfid',						//流程ID
				'wfflag',					//流程标识
				'creator',					//创建人
				'createtime',				//创建时间
				'updator',					//修改人
				'updatetime',				//修改时间
				'auditor',					//审核人
				'audittime'					//审核时间
			].forEach(function (key) {
				no_copy_keys[key] = true;
			});

			angular.forEach(discount_apply, function (value, key) {
				if (no_copy_keys[key]) {
					return;
				}

				Switch(typeof value).case('string', 'number', function () {
					$scope.data.currItem[key] = value;
				});
			});

			[
				'total_qty',				//总数量
				'total_volume',				//总体积
				'total_weight',				//总重量
				'undiscounted_amount',		//折前总金额
				'discounted_amount'			//折后总金额
			].forEach(function (key) {
				$scope.data.currItem[key] = '';
			});
		}

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
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcName: '变更明细',
			hcRequired: true,
			hcEvents: {
				cellFocused: function (params) {
					if (params.rowPinned) {
						$scope.currLineGridNode = null;
					}
					else if (params.rowIndex >= 0) {
						$scope.currLineGridNode = params.api.getRowNode(params.rowIndex);
					}
					else {
						$scope.currLineGridNode = null;
					}
				},
				cellDoubleClicked: function (params) {
					if (params.node.rowPinned) {
						return;
					}

					if (params.column.isCellEditable(params.node)) {
						return;
					}

					if ($scope.form.isReadonly()) {
						return;
					}

					var before_line = $scope.data.currItem.epm_discount_ecn_before_lines.find(function (line) {
						return line.discount_apply_line_id == params.node.data.source_line_id;
					});

					return $scope.editLine(before_line);
				},
				cellValueChanged: function (params) {
					if (params.newValue == params.oldValue) {
						return;
					}

					epmman.calDiscountData({
						gridOptions: $scope.gridOptions,
						currItem: $scope.data.currItem
					});
				}
			},
			defaultColDef: {
				editable: function (params) {
					var editable;

					if (params.node.rowPinned || !params.node.data.item_code) {
						editable = false;
					}
					else {
						editable = ['contract_qty', 'contract_price', 'remark'].indexOf(params.colDef.field) >= 0;
					}

					return editable;
				}
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'source_item_code',
					headerName: '源产品编码',
					pinned: 'left',
					rowSpan: function (params) {
						if (params.node.data.span_count) {
							return params.node.data.span_count;
						}
					}
				},
				{
					field: 'source_item_name',
					headerName: '源产品名称',
					pinned: 'left',
					width: 240,
					suppressAutoSize: true,
					suppressSizeToFit: true,
					rowSpan: function (params) {
						if (params.node.data.span_count) {
							return params.node.data.span_count;
						}
					}
				},
				{
					field: 'source_active_qty',
					headerName: '可替换数量',
					pinned: 'left',
					rowSpan: function (params) {
						if (params.node.data.span_count) {
							return params.node.data.span_count;
						}
					}
				},
				{
					field: 'item_code',
					headerName: '替换产品编码',
					pinned: 'left',
					hcRequired: true
				},
				{
					field: 'item_name',
					headerName: '替换产品名称',
					width: 240,
					suppressAutoSize: true,
					suppressSizeToFit: true
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
					headerName: '申请合同数量',
					type: '数量',
					hcRequired: true
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
			],
			pinnedBottomRowData: [{ seq: '合计' }]
		};

		angular.extend($scope.data, {
			currGridOptions: $scope.gridOptions,
			currGridModel: 'data.currItem.epm_discount_ecn_after_lines'
		});

		/**
		 * 标签页切换事件
		 */
		$scope.onTabChange = function (params) {
			$q
				.when(params)
				.then($scope.hcSuper.onTabChange)
				.then(function () {
					var result = Switch(params.id)
						.case('base', {
							currGridOptions: $scope.gridOptions,
							currGridModel: 'data.currItem.epm_discount_ecn_after_lines'
						})
						.default({
							currGridOptions: null,
							currGridModel: ''
						})
						.result;

					angular.extend($scope.data, result);
				});
		};

		/**
		 * 禁用行移动
		 */
		$scope.isMoveRowDisabled = function () {
			return true;
		};

		$scope.footerLeftButtons.addRow.hide = function () {
			return $scope.$eval('!tabController.isTabActive("base") || !item_date.detailed.active');
		};

		(function (addRow) {
			$scope.footerLeftButtons.addRow.click = function (params) {
				return Switch($scope.tabController.getActiveTab().id)
					.case('base', function () {
						return $scope.addLine();
					})
					.default(function () {
						return addRow(params);
					})
					.result;
			};
		})($scope.footerLeftButtons.addRow.click);

		$scope.footerLeftButtons.deleteRow.hide = function () {
			return $scope.$eval('!tabController.isTabActive("base") || !currLineGridNode || !item_date.detailed.active');
		};

		(function (deleteRow) {
			$scope.footerLeftButtons.deleteRow.click = function (params) {
				return $q
					.when(params)
					.then(deleteRow)
					.then(function () {
						if ($scope.tabController.isTabActive('base')) {
							//去掉没被变更的变更前明细
							$scope.data.currItem.epm_discount_ecn_before_lines = $scope.data.currItem.epm_discount_ecn_before_lines.filter(function (before_line) {
								return $scope.data.currItem.epm_discount_ecn_after_lines.some(function (after_line) {
									return before_line.discount_apply_line_id == after_line.source_line_id;
								});
							});

							epmman.calDiscountData({
								gridOptions: $scope.gridOptions,
								currItem: $scope.data.currItem
							});
						}
					});
			};
		})($scope.footerLeftButtons.deleteRow.click);

		$scope.footerLeftButtons.editRow = {
			title: '编辑明细',
			icon: 'iconfont hc-edit',
			click: function () {
				var before_line = $scope.data.currItem.epm_discount_ecn_before_lines.find(function (line) {
					return line.discount_apply_line_id == $scope.currLineGridNode.data.source_line_id;
				});

				return $scope.editLine(before_line);
			},
			hide: function () {
				return $scope.$eval('!tabController.isTabActive("base") || !currLineGridNode || !item_date.detailed.active');
			}
		};

		/**
		 * 添加明细
		 */
		$scope.addLine = function () {
			return $q
				.when()
				.then(function () {
					//若还没选择折扣单，先选折扣单
					if (!$scope.data.currItem.discount_apply_code) {
						return $('[hc-input="data.currItem.discount_apply_code"]')
							.controller('hcInput')
							.btnClick()
							.then($q.reject);
					}
				})
				.then(function () {
					return $modal.openCommonSearch({
						title: '请选择需要进行变更的产品',
						checkbox: true,
						classId: 'epm_discount_apply_line',
						postData: {
							search_flag: 2, //查询场景：折扣变更时
							discount_apply_id: $scope.data.currItem.discount_apply_id,
							epm_discount_apply_lines: $scope.data.currItem.epm_discount_ecn_after_lines.map(function (line) {
								return {
									discount_apply_line_id: line.source_line_id
								};
							})
						}
					}).result;
				})
				.then(function (before_lines) {
					isProprietary ();
					$scope.data.currItem.epm_discount_ecn_before_lines.smartPush(before_lines);

					var focusRowIndex = $scope.data.currItem.epm_discount_ecn_after_lines.length;

					var after_lines = before_lines.map(function (before_line) {
						var after_line = {
							source_line_id: before_line.discount_apply_line_id
						};

						['item_id', 'item_code', 'item_name', 'active_qty'].forEach(function (key) {
							after_line['source_' + key] = before_line[key];
						});
						return after_line;
					});

					$scope.data.currItem.epm_discount_ecn_after_lines.smartPush(after_lines);

					$scope.gridOptions.api.updateRowData({
						add: after_lines
					});

					$scope.gridOptions.hcApi.setFocusedCell(focusRowIndex);
				});
		};

		/**
		 * 是否自营工程
		 */
		function isProprietary (){
			if($scope.data.currItem.contract_type == 1){
				$scope.gridOptions.columnDefs[9].hide = false;
				$scope.gridOptions.columnDefs[10].hide = false;
				$scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
			}else{
				$scope.gridOptions.columnDefs[9].hide = true;
				$scope.gridOptions.columnDefs[10].hide = true;
				$scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
			}
		}

		/**
		 * 编辑明细
		 */
		$scope.editLine = function (before_line, isAdd) {
			return $scope.lineModal.open({
				controller: EPMDiscountECNLineEditor,
				resolve: {
					$mainScope: $scope,
					before_line: before_line,
					isAdd: !!isAdd
				},
				size: 'lg'
			}).result;
		};
	}

	/**
	 * 明细编辑器控制器
	 */
	EPMDiscountECNLineEditor.$inject = ['$scope', '$mainScope', '$q', '$modal', 'before_line', 'isAdd'];
	function EPMDiscountECNLineEditor(   $lineScope,    $scope,  $q,   $modal,   before_line,   isAdd) {

		//模态框标题
		$lineScope.title = '产品替换';

		//变更前明细
		$lineScope.before_line = before_line;

		//明细合计
		$lineScope.total = {};

		$(function () {
			$('body > div:nth-child(9) > div > div > div.modal-body.ng-pristine.ng-valid > div.ng-pristine.ng-valid.hc-box.ng-scope > div:nth-child(5) > div:nth-child(1) > label').css("color","#F35A05");
		});

		//表格选项
		$lineScope.gridOptions = {
			hcEvents: {
				gridReady: function () {
					var lines = $scope.gridOptions.hcApi
						.getRowData()
						.filter(function (line) {
							return line.item_code && line.source_line_id == before_line.discount_apply_line_id;
						})
						.map(function (line) {
							return angular.copy(line);
						});

					$lineScope.gridOptions.hcApi.setRowData(lines);

					epmman.calDiscountData({
						gridOptions: $lineScope.gridOptions,
						currItem: $lineScope.total
					});
				},
				cellValueChanged: function (params) {
					if (params.newValue == params.oldValue) {
						return;
					}

					epmman.calDiscountData({
						gridOptions: $lineScope.gridOptions,
						currItem: $lineScope.total
					});
				}
			},
			defaultColDef: {
				editable: function (params) {
					var editable;

					if (params.node.rowPinned || !params.node.data.item_code) {
						editable = false;
					}
					else {
						editable = ['contract_qty', 'contract_price', 'remark'].indexOf(params.colDef.field) >= 0;
					}

					return editable;
				}
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'item_code',
					headerName: '产品编码',
					pinned: 'left',
					hcRequired: true
				},
				{
					field: 'item_name',
					headerName: '产品名称',
					width: 240,
					suppressAutoSize: true,
					suppressSizeToFit: true
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
					headerName: '申请合同数量',
					type: '数量',
					cellStyle : {
						'color' : '#F35A05',
						'text-align': 'center'
					},
					hcRequired: true
				},
				{
					field: 'contract_price',
					headerName: '工程方单价(元)',
					type: '金额',
					hide: true,
					hcRequired: true
				},
				{
					field: 'contract_amount',
					headerName: '合同总额(元)',
					type: '金额',
					hide: true,
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
			],
			pinnedBottomRowData: [{ seq: '合计' }]
		};

		gridApi.execute($lineScope.gridOptions, function () {
			if($scope.data.currItem.contract_type == 1){
				$lineScope.gridOptions.columnDefs[6].hide = false;
				$lineScope.gridOptions.columnDefs[7].hide = false;
				$lineScope.gridOptions.api.setColumnDefs($lineScope.gridOptions.columnDefs);
			}
		});

		angular.extend($lineScope.footerLeftButtons, {
			addRow: {
				icon: 'iconfont hc-add',
				click: function () {
					return $q
						.when()
						.then(function () {
							var excludeItems = $lineScope.gridOptions.hcApi.getRowData().map(function (ecn_line) {
								return {
									item_id: ecn_line.item_id
								};
							});

							return $modal.openCommonSearch({
								title: '请选择替换 ' + $lineScope.before_line.item_code + ' ' + $lineScope.before_line.item_name + ' 的产品',
								classId: 'item_org',
								postData: {
									need_price: 2,		//需要价格
									order_pdt_line: $scope.data.currItem.order_pdt_line,
									item_orgs: excludeItems
								},
								checkbox: true,
								beforeOk: function (items) {
									return requestApi
										.post({
											classId: 'epm_discount_apply',
											action: 'generate_discount_data',
											data: {
												customer_id: $scope.data.currItem.customer_id,
												epm_discount_apply_lines: items.map(function (item) {
													return {
														item_id: item.item_id,
														item_code: item.item_code
													};
												})
											}
										})
										.then(function (discount_apply) {
											if (discount_apply.error) {
												swalApi.error(discount_apply.error);
												throw discount_apply.error;
											}

											discount_apply.epm_discount_apply_lines.forEach(function (line) {
												line.source_line_id = $lineScope.before_line.discount_apply_line_id;
												
												['item_id', 'item_code', 'item_name', 'active_qty'].forEach(function (key) {
													line['source_' + key] = $lineScope.before_line[key];
												});
											});

											return discount_apply.epm_discount_apply_lines;
										});
								}
							}).result;
						})
						.then(function (discount_ecn_lines) {
							$lineScope.gridOptions.api.updateRowData({
								add: discount_ecn_lines
							});

							epmman.calDiscountData({
								gridOptions: $lineScope.gridOptions,
								currItem: $lineScope.total
							});
						});
				}
			},
			deleteRow: {
				icon: 'iconfont hc-reduce',
				click: function () {
					return $lineScope.gridOptions.hcApi.getFocusedNodeWithNotice('删除').then(function (node) {
						$lineScope.gridOptions.api.updateRowData({
							remove: [node.data]
						});

						epmman.calDiscountData({
							gridOptions: $lineScope.gridOptions,
							currItem: $lineScope.total
						});
					});
				}
			}
		});

		angular.extend($lineScope.footerRightButtons, {
			ok: {
				title: '确定',
				click: function () {
					return $q
						.when()
						.then(function () {
							$lineScope.gridOptions.api.stopEditing();
							return {
								classId: 'epm_discount_apply',
								action: 'generate_discount_data',
								data: {
									customer_id: $scope.data.currItem.customer_id,
									epm_discount_apply_lines: [{
										item_id: $lineScope.before_line.item_id,
										item_code: $lineScope.before_line.item_code
									}]
								}
							}
						})
						.then(requestApi.post)
						.then(function (discount_apply) {
							if($lineScope.total.total_qty > $lineScope.before_line.active_qty){
								swalApi.error('产品变更的可替换数量不足,实际剩余可替换数量【'
									+ $lineScope.before_line.active_qty
									+'】，不足替换数量【'+$lineScope.total.total_qty+'】');
								return;
							}
							//是否取到有效价格
							var efficiencyPrice = true;
							//是否替换完成
							var replace = $lineScope.before_line.active_qty == $lineScope.total.total_qty;
							//剩余数量
							var remaining_qty = numberApi.sub($lineScope.before_line.active_qty,$lineScope.total.total_qty);
							if(!replace){
								//查询是否有价格
								if (discount_apply.error) {
									//取不到有效价格
									efficiencyPrice = false;
								}
							}
							if(efficiencyPrice){
								$lineScope.$close();

								var before_lines = $scope.data.currItem.epm_discount_ecn_before_lines,		//变更前明细
									after_lines = $scope.data.currItem.epm_discount_ecn_after_lines,		//变更后明细
									before_line_id = $lineScope.before_line.discount_apply_line_id,			//当前变更前明细ID
									insertIndex;															//插入位置
	
								//若变更前明细已存在
								if (before_lines.some(function (line) {
									return line.discount_apply_line_id == before_line_id;
								})) {
									//插入位置在首行同源的变更后明细
									insertIndex = after_lines.findIndex(function (line) {
										return line.source_line_id == before_line_id;
									});
	
									//把之前的变更后明细去掉
									var i, len = after_lines.length;
									for (i = len - 1; i >= 0; i--) {
										var line = after_lines[i];
	
										if (line.source_line_id == before_line_id) {
											after_lines.splice(i, 1);
										}
									}
								}
								else {
									//加入变更前明细
									before_lines.push(angular.copy($lineScope.before_line));
	
									//插入位置在首行同源的变更后明细最后一行后面
									insertIndex = after_lines.length;
								}
	
								//新的变更后明细
								var new_after_lines = $lineScope.gridOptions.hcApi.getRowData();
								if(new_after_lines.length > 0 && !replace){
									var notSame = true;
									new_after_lines.some(function(value){
										if($lineScope.before_line.item_id == value.item_id){
											value.contract_qty = numberApi.sum(value.contract_qty, remaining_qty);
											notSame = false;
											return true;
										}
									});
									if(notSame){
										['item_id', 'item_code', 'item_name', 'active_qty'].forEach(function (key) {
											discount_apply.epm_discount_apply_lines[0]['source_' + key] = $lineScope.before_line[key];
										});
										discount_apply.epm_discount_apply_lines[0].source_line_id = $lineScope.before_line.discount_apply_line_id;
										discount_apply.epm_discount_apply_lines[0].contract_qty = remaining_qty;
										new_after_lines.push(discount_apply.epm_discount_apply_lines[0]);
									}
									swalApi.error([
										"● 源产品的剩余数量需全部替换完。", 
										"● 还剩余【"+remaining_qty+$lineScope.before_line.unit+"】未指定，请检查。", 
										"● 系统已自动指定以原产品进行替换，可双击明细行打开编辑页面进行修改。"
									]);
								}
	
								//若把新的变更后明细删光了，代表不想变更这个明细，把变更前明细移除
								IfElse.if(!new_after_lines.length, function () {
									var index = $scope.data.currItem.epm_discount_ecn_before_lines.findIndex(function (line) {
										return line.discount_apply_line_id == $lineScope.before_line.discount_apply_line_id;
									});
	
									if (index >= 0) {
										$scope.data.currItem.epm_discount_ecn_before_lines.splice(index, 1);
									}
								});
								//把新的变更后明细插入到合适位置
								after_lines.smartInsert(insertIndex, new_after_lines);
	
								//行合并
								var rowProj = {};
								var source_line_id = 0;
								after_lines.forEach(function (value, index) {
									if(index == 0){
										rowProj[value.source_line_id] = 1;
									}else if(rowProj[value.source_line_id] == undefined){
										rowProj[value.source_line_id] = 1;
									}else{
										rowProj[value.source_line_id] = numberApi.sum(rowProj[value.source_line_id], 1);
									}
								});
								after_lines.forEach(function (value, index) {
									if(index == 0){
										source_line_id = value.source_line_id;
										value.span_count = rowProj[value.source_line_id];
									}else if(value.source_line_id != source_line_id){
										source_line_id = value.source_line_id;
										value.span_count = rowProj[value.source_line_id];
									}else{
										value.span_count = undefined;
									}
								});
								//渲染到表格
								$scope.gridOptions.hcApi.setRowData(after_lines);
	
								epmman.calDiscountData({
									gridOptions: $scope.gridOptions,
									currItem: $scope.data.currItem
								});
							}else{
								swalApi.error([
									"● 源产品的剩余数量需全部替换完。", 
									"● 还剩余【"+remaining_qty+$lineScope.before_line.unit+"】未指定，请检查。", 
									"● 注：原产品目前取不到有效价格，若剩余数量仍想维持原有型号，请联系相关人员进行处理。"
								]);
							}
						});
				}
			}
		});
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMDiscountECNProp
	});
});