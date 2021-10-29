/**
 * 工程折扣申请 - 详情页
 * @since 2019-07-16
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'jquery', 'gridApi', 'numberApi', 'swalApi', 'controllers/epmman/epmman', 'openBizObj', 'directive/hcModal'],
	function (module, controllerApi, base_obj_prop, requestApi, $, gridApi, numberApi, swalApi, epmman, openBizObj) {
        'use strict';

		EPMDiscountApplyProp.$inject = ['$scope', '$q', '$stateParams'];
		function EPMDiscountApplyProp(   $scope,   $q, $stateParams) {

			//继承控制器
			controllerApi.extend({
				controller: base_obj_prop.controller,
				scope: $scope
			});

			//表格切换定义
			$scope.item_date = {};
			$scope.item_date.detailed = {
				title: '产品清单',
				active: true
			};
			$scope.item_date.deliveryPlan = {
				title: '提货计划'
			};

			//userbean数据放入$scope作用域
			$scope.userbean = userbean;
			$scope.data.opanRead = $stateParams.readonly;
			/**
			 * 表格
			 */
            $scope.gridOptions = epmman.getGridOptionsOfDiscountLine({
                $scope: $scope
            });

			$scope.gridOptions.columnDefs.unshift({
				type: '复选框',
				hide: true
			});

			$scope.gridOptions.isRowSelectable = function (node) {
				return node.data.active_qty > 0;
			};

			$scope.selectedRowCount = 0;			//勾选的行数量
			$scope.selectedRowCountCanOrder = 0;	//勾选的可下单的行数量
			$scope.selectedRowCountCanECN = 0;		//勾选的可变更的行数量

			//表格模型改变事件
			$scope.gridOptions.hcEvents.modelUpdated = function () {
				$scope.selectedRowCount = 0;
				$scope.selectedRowCountCanOrder = 0;
				$scope.selectedRowCountCanECN = 0;
			};

			//表格复选框勾选或取消事件
			$scope.gridOptions.hcEvents.rowSelected = function (params) {
				if (params.node.selected) {
					$scope.selectedRowCount++;
					
					if (params.node.data.can_order == 2) {
						$scope.selectedRowCountCanOrder++;
					}

					if (params.node.data.can_ecn == 2) {
						$scope.selectedRowCountCanECN++;
					}
				}
				else {
					$scope.selectedRowCount--;

					if (params.node.data.can_order == 2) {
						$scope.selectedRowCountCanOrder--;
					}

					if (params.node.data.can_ecn == 2) {
						$scope.selectedRowCountCanECN--;
					}
				}
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
					headerName: '合同数量',
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
						$scope.dateOfDelivery.open({//打开模态框
							size: 'lg',
							controller: ['$scope',
								function ($modalScope) {
									$modalScope.title = "提货计划设置";
									$modalScope.before_line = params.data;
									$modalScope.saveExecute = true;
									$modalScope.entranceEdit = false;
									$modalScope.gridOptionDseliveryPlanLine = {
										columnDefs: [
											{
												type: '序号'
											},
											{
												field: 'plan_qty',
												headerName: '预计提货数量',
												type : '数量'
											},
											{
												field: 'plan_date',
												headerName: '预计提货时间',
												type : '日期'
											}
										],
										pinnedBottomRowData: [{ seq: '合计' }]
									};

									/**
									 * 已下单
									 */
									$modalScope.gridOptionDseliveryPlanLinePlace = {
										columnDefs: [
											{
												type: '序号'
											},
											{
												field: 'qty_bill',
												headerName: '下单数量',
												type : '数量'
											},
											{
												field: 'in_date',
												headerName: '期望到达时间',
												type : '日期'
											}
										],
										pinnedBottomRowData: [{ seq: '合计' }]
									};

									/**
									 * 未下单
									 */
									$modalScope.gridOptionDseliveryPlanLineCelPlace = {
										columnDefs: [
											{
												type: '序号'
											},
											{
												field: 'plan_qty',
												headerName: '预计提货数量',
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
													$modalScope.calSumElplace();
												}
											},
											{
												field: 'plan_date',
												headerName: '预计提货时间',
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
													$modalScope.gridOptionDseliveryPlanLineCelPlace.api.stopEditing();
													$modalScope.discount_apply_planpelplaces.push({
														seq : $modalScope.before_line.seq,
														item_id : $modalScope.before_line.item_id,
														item_code : $modalScope.before_line.item_code,
														item_name : $modalScope.before_line.item_name,
														contract_qty : $modalScope.before_line.contract_qty,
														discount_apply_id : $modalScope.before_line.discount_apply_id,
														discount_apply_line_id : $modalScope.before_line.discount_apply_line_id
													});
													$modalScope.gridOptionDseliveryPlanLineCelPlace.hcApi.setRowData(
														$modalScope.discount_apply_planpelplaces);
												}
											},
											invoiceDel: {
												icon: 'iconfont hc-reduce',
												click: function () {
													var idx = $modalScope.gridOptionDseliveryPlanLineCelPlace.hcApi
														.getFocusedRowIndex();
													if (idx < 0) {
														swalApi.info('请选中要删除的行');
													} else {
														$modalScope.discount_apply_planpelplaces.splice(idx, 1);
														$modalScope.gridOptionDseliveryPlanLineCelPlace.hcApi.setRowData(
															$modalScope.discount_apply_planpelplaces);
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
									$modalScope.calSumPlace = function () {
										$modalScope.gridOptionDseliveryPlanLinePlace.api.setPinnedBottomRowData([
											{
												seq: '合计',
												qty_bill: numberApi.sum($modalScope.discount_apply_planplaces, 'qty_bill')
											}
										]);
									};
									$modalScope.calSumElplace = function () {
										$modalScope.gridOptionDseliveryPlanLineCelPlace.api.setPinnedBottomRowData([
											{
												seq: '合计',
												plan_qty: numberApi.sum($modalScope.discount_apply_planpelplaces, 'plan_qty')
											}
										]);
									};
									/**
									 * 查询已发货清单
									 */
									$modalScope.queryDelivery = function () {
										requestApi
											.post({
												classId: 'epm_discount_apply',
												action: 'orderinquiry',
												data: {
													discount_apply_line_id: params.data.discount_apply_line_id
												}
											})
											.then(function(data){
												$modalScope.discount_apply_planplaces = data.epm_discount_applys;
												$modalScope.gridOptionDseliveryPlanLinePlace.hcApi.setRowData(
													$modalScope.discount_apply_planplaces);
												$modalScope.calSumPlace();
												$modalScope.discount_apply_planpelplaces = [];
												$modalScope.gridOptionDseliveryPlanLineCelPlace.hcApi.setRowData(
													$modalScope.discount_apply_planpelplaces);
												$modalScope.calSumElplace();
											});
									}
									$modalScope.discount_apply_plans = [];//定义一个数组，原数据
									$modalScope.discount_apply_planplaces = [];//定义一个数组,已发货
									$modalScope.discount_apply_planpelplaces = [];//定义一个数组，未发货
									$scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {//设置同一个产品数据
										if(value.seq == $modalScope.before_line.seq){
											$modalScope.discount_apply_plans.push(value)
										}
									});
									gridApi.execute($modalScope.gridOptionDseliveryPlanLine, function () {
										$modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
											$modalScope.discount_apply_plans);
										$modalScope.calSum();
									});
									if(params.data.can_alteration == 2){
										$modalScope.footerRightButtons.close.hide = function(){
											return $modalScope.entranceEdit; 
										};
										angular.extend($modalScope.footerRightButtons, {
											edit: {
												title: '提货计划变更',
												click: function () {
													$modalScope.entranceEdit = true;
													$modalScope.queryDelivery();
												},
												hide: function(){
													return $modalScope.entranceEdit;
												}
											},
											ok: {
												title: '确定',
												click: function () {
													$modalScope.saveExecute = false;
													$modalScope.gridOptionDseliveryPlanLineCelPlace.api.stopEditing();
													$modalScope.saveExecute = true;
													/* 校验数据 */
													//错误盒子
													var arr = [];
													//合计分配数量
													var sum = 0;
													$modalScope.discount_apply_planpelplaces.forEach(function (value) {
														sum = numberApi.sum(value.plan_qty, sum);
													});
													//校验是否维护数据
													if($modalScope.discount_apply_planpelplaces.length == 0){
														arr.push('请先维护提货计划行!');
													//校验合计数量
													}else if(sum > $modalScope.before_line.line_active_qty){
														arr.push('当前预计提货合计数量超出合同数量，请重新输入');
													}else if(sum != $modalScope.before_line.line_active_qty){
														arr.push('提货计划合计的提货数量需等于合同数量!');
													}
													
													//未维护时间数组
													var arrNull = [];
													//时间大于当天数组
													var arrAdd = [];
													//数量校验数组
													var arrNum = [];
													//进行数据校验
													$modalScope.discount_apply_planpelplaces.forEach(function (value, index) {
														/*==========校验日期=========*/
														if(value.plan_date == undefined || value.plan_date == null || value.plan_date == ""){
															arrNull.push(index+1);
														}else if(new Date(value.plan_date).getTime() < new Date().getTime()){
															arrAdd.push(index+1);
														}else if(new Date(value.plan_date).Format('yyyy-MM-dd')
															== new Date().Format('yyyy-MM-dd')){
															arrAdd.push(index+1);
														}
														/*==========校验天数=========*/
														if(value.plan_qty <= 0 || value.plan_qty == undefined){
															arrNum.push(index+1);
														}
													});
													if (arrNull.length) {
														arr.push(
															'',
															'预计提货时间需必填，以下行不合法：',
															'第' + arrNull.join('、') + '行'
														);
													}
													if (arrAdd.length) {
														arr.push(
															'',
															'预计提货时间需大于当天，以下行不合法：',
															'第' + arrAdd.join('、') + '行'
														);
													}
													if (arrNum.length) {
														arr.push(
															'',
															'预计提货数量必须大于零，以下行不合法：',
															'第' + arrNum.join('、') + '行'
														);
													}
													if(arr.length){
														swalApi.error(arr);
													}else{
														requestApi
														.post({
															classId: 'epm_discount_apply',
															action: 'verifyorderinquiry',
															data: {
																discount_apply_line_id: params.data.discount_apply_line_id,
																active_qty : $modalScope.before_line.line_active_qty
															}
														})
														.then(function(data){
															if(data.sqlwhere.length > 0){/** 数据发生改变 */
																//刷新
																$scope.data.currItem.epm_discount_apply_lines.forEach(function(value){
																	if (value.discount_apply_line_id == params.data.discount_apply_line_id){
																		value.active_qty = data.active_qty;
																		value.ordered_qty = data.ordered_qty;
																	}
																});
																epmman.setDiscountLineData({
																	gridOptions: $scope.gridOptions
																});
																$modalScope.before_line.line_active_qty = data.active_qty;
																$modalScope.before_line.ordered_qty = data.ordered_qty;
																$modalScope.queryDelivery();
																swalApi.console.error(data.sqlwhere);
															}else{/** 进行确定-数据更新 */
																//去除原提货计划
																$scope.data.currItem.epm_discount_apply_plans = 
																$scope.data.currItem.epm_discount_apply_plans.filter(function (value) {
																	return value.seq != $modalScope.before_line.seq
																});
																//添加未发货的清单到提货计划中
																$modalScope.discount_apply_planpelplaces.forEach(function(value, index){
																	if(index == 0){
																		value.span_count = numberApi.sum($modalScope.discount_apply_planpelplaces.length, 
																			$modalScope.discount_apply_planplaces.length);
																	}
																	$scope.data.currItem.epm_discount_apply_plans.push(value);
																});
																//添加已发货的清单到提货计划中
																$modalScope.discount_apply_planplaces.forEach(function(value){
																	$scope.data.currItem.epm_discount_apply_plans.push({
																		seq : $modalScope.before_line.seq,
																		item_id : $modalScope.before_line.item_id,
																		item_code : $modalScope.before_line.item_code,
																		item_name : $modalScope.before_line.item_name,
																		contract_qty : $modalScope.before_line.contract_qty,
																		discount_apply_id : $modalScope.before_line.discount_apply_id,
																		discount_apply_line_id : $modalScope.before_line.discount_apply_line_id,
																		plan_qty : value.qty_bill,//下单数量
																		plan_date : value.in_date//预计到达时间
																	});
																});
																//排序
																$scope.data.currItem.epm_discount_apply_plans.sort(function (a, b) {
																	return a.seq - b.seq;
																});
																//设置数据到提货数据网格
																$scope.gridOptionDseliveryPlan.hcApi.setRowData($scope.data.currItem.epm_discount_apply_plans);
																//设置数据到提货时间模态框
																$modalScope.discount_apply_plans = [];//定义一个数组，原数据
																$scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {//设置同一个产品数据
																	if(value.seq == $modalScope.before_line.seq){
																		$modalScope.discount_apply_plans.push(value)
																	}
																});
																$modalScope.gridOptionDseliveryPlanLine.hcApi.setRowData(
																	$modalScope.discount_apply_plans);
																$modalScope.calSum();
																//操作完成后返回提货计划界面展示
																requestApi
																	.post({
																		classId: 'epm_discount_apply',
																		action: 'updateorderinquiry',
																		data: {
																			discount_apply_line_id: $modalScope.before_line.discount_apply_line_id,
																			epm_discount_apply_plans : $scope.data.currItem.epm_discount_apply_plans
																		}
																	})
																	.then(function(){
																		$modalScope.entranceEdit = false;
																		swalApi.info('成功');
																	});
															}
														});
													}
												},
												hide: function(){
													return (!$modalScope.entranceEdit);
												}
											},
											cancel: {
												title: '取消',
												click: function () {
													$modalScope.entranceEdit = false;
												},
												hide: function(){
													return (!$modalScope.entranceEdit);
												}
											}
										});
									}
								}]
						})
					}
				}
			};

			$scope.footerRightButtons.require = {
				title: '生成订单',
				click: function () {
					return $q
						.when()
						.then(function () {
							return $scope.gridOptions.hcApi.getSelectedNodesWithNotice('生成订单');
						})
						.then(function (rowNodes) {
							return openBizObj({
								stateName: 'epmman.epm_require_bill_prop',
								params: {
									discount_apply_id: $scope.data.currItem.discount_apply_id,
									discount_apply_line_id: rowNodes.map(function (rowNode) {
										return rowNode.data.discount_apply_line_id;
									})
								}
							}).result;
						});
				},
				hide: function () {
					//当勾选了【可下单】的行，且全部是【可下单】的行时，才可见,或者是打开只读状态不可见
					return (!($scope.selectedRowCountCanOrder > 0 && $scope.selectedRowCountCanOrder == $scope.selectedRowCount))
						|| $scope.data.opanRead;
				}
			};

			$scope.footerRightButtons.ecn = {
				title: '产品变更',
				click: function () {
					return $q
						.when()
						.then(function () {
							return $scope.gridOptions.hcApi.getSelectedNodesWithNotice('产品变更');
						})
						.then(function (rowNodes) {
							return openBizObj({
								stateName: 'epmman.epm_discount_ecn_prop',
								params: {
									discount_apply_id: $scope.data.currItem.discount_apply_id,
									discount_apply_line_id: rowNodes.map(function (rowNode) {
										return rowNode.data.discount_apply_line_id;
									})
								}
							}).result;
						});
				},
				hide: function () {
					//当勾选了【可变更】的行，且全部是【可变更】的行时，才可见
					return (!($scope.selectedRowCountCanECN > 0 && $scope.selectedRowCountCanECN == $scope.selectedRowCount))
						|| $scope.data.opanRead;
				}
			};

			//要货、变更、延期后刷新
			$(document).on('hc.request.success', function (event, eventData) {
				Switch(eventData.classId).case('sa_out_bill_head', 'epm_discount_ecn', function () {
					Switch(eventData.action).case('insert', 'update', 'delete', function () {
						if (eventData.data.discount_apply_id == $scope.data.currItem.discount_apply_id
							|| eventData.data.source_discount_apply_id == $scope.data.currItem.discount_apply_id) {
							$scope.refresh();
						}
					});
				});
			});
			
			/*----------------------------------通用查询-------------------------------------------*/
			$scope.commonSearch = {

				//经销商
				customer_code: {
					postData: {
						search_flag: 124
					},
					afterOk: function (customer) {
						[
							'customer_id',		//经销商ID
							'customer_code',	//经销商编码
							'customer_name'		//经销商名称
						].forEach(function (key) {
							$scope.data.currItem[key] = customer[key];
						});

					}
				},

				//合同
				contract_code: {
					postData: {},
					sqlWhere: " stat = 5 and contract_id not in (select a.contract_id from epm_discount_apply a) ",
					afterOk: function (contract) {
						return requestApi
							.post({
								classId: 'epm_discount_apply',
								action: 'get_data_by_contract',
								data: {
									contract_id: contract.contract_id
								}
							})
							.then(function (data) {
								[
									'contract_id',				//合同ID
									'contract_code',			//合同编码
									'contract_name',			//合同名称
									'contract_expire_date',		//合作结束日期
									'project_id',				//项目ID
									'project_code',				//项目编码
									'project_name',				//项目名称
									'stage_id',					//项目阶段ID
									'stage_name',				//项目阶段名称
									'division_name',			//所属事业部
									'pdt_line',					//产品线
									'trading_company_name',		//交易公司
									'billing_unit_name'			//开票单位
								].forEach(function (key) {
									$scope.data.currItem[key] = data[key];
								});

								//产品清单
								$scope.data.currItem.epm_discount_apply_lines = data.epm_discount_apply_lines;
								$scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_apply_lines);
							});
					}
				}
			};

			/**
			 * 值改变事件
			 */
			$scope.onChange = {

				//签约类型
				contract_type: function () {
					//当【签约类型】=【2 - 直销】时，明细表的【工程方单价】才可见
					var columnVisible = $scope.data.currItem.contract_type == 2;
					$scope.gridOptions.columnApi.setColumnVisible('proj_unit_price', columnVisible);
				}

			};

			/**
			 * 值删除事件
			 */
			$scope.onDelete = {

				//合同编号
				contract_code: function () {
					[
						'contract_id',				//合同ID
						'contract_code',			//合同编码
						'contract_name',			//合同名称
						'contract_expire_date',		//合作结束日期
						'project_id',				//项目ID
						'project_code',				//项目编码
						'project_name',				//项目名称
						'stage_id',					//项目阶段ID
						'stage_name',				//项目阶段名称
						'division_name',			//所属事业部
						'pdt_line',					//产品线
						'trading_company_name',		//交易公司
						'billing_unit_name'			//开票单位
					].forEach(function (key) {
						delete $scope.data.currItem[key];
					});

					//产品清单
					$scope.data.currItem.epm_discount_apply_lines = [];
					$scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_apply_lines);
				}

			};

			/**
			 * 新增时初始化数据
			 */
			$scope.newBizData = function (bizData) {
				$scope.hcSuper.newBizData(bizData);

				//折扣类型：低价不变
				bizData.discount_type = 1;
				
				bizData.epm_discount_apply_lines = [];

				setLineData();
			};

			/**
			 * 查看时设置数据
			 */
			$scope.setBizData = function (bizData) {
				$scope.hcSuper.setBizData(bizData);
				
				setLineData();

				//设置提货计划
				gridApi.execute( $scope.gridOptionDseliveryPlan, function () {
					var proj = {};
					bizData.epm_discount_apply_plans.forEach(function (value, index) {
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
					bizData.epm_discount_apply_plans.forEach(function (value) {
						value.active_qty = numberApi.sub(value.contract_qty, proj[value.seq]);
					});
					/* 行合并 */
					var rowProj = {};
					var seq = 0;
					bizData.epm_discount_apply_plans.forEach(function (value, index) {
						if(index == 0){
							rowProj[value.seq] = 1;
						}else if(rowProj[value.seq] == undefined){
							rowProj[value.seq] = 1;
						}else{
							rowProj[value.seq] = numberApi.sum(rowProj[value.seq], 1);
						}
					});
					bizData.epm_discount_apply_plans.forEach(function (value, index) {
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
					$scope.gridOptionDseliveryPlan.hcApi.setRowData(bizData.epm_discount_apply_plans);
				});

			};

			$scope.isFormReadonly = function () {
				return true;
			};

			function setLineData() {
				gridApi.execute($scope.gridOptions, function (gridOptions) {
					//当【签约类型】=【2 - 直销】时，明细表的【工程方单价】才可见
					gridOptions.columnApi.setColumnVisible('proj_unit_price', $scope.data.currItem.contract_type == 2);

					epmman.setDiscountLineData({
						gridOptions: gridOptions
					});
					// epmman.calDiscountData({
					// 	gridOptions: gridOptions
					// });
					//若有任意一行的可下单或可变更，则显示复选框
					gridOptions.columnApi.setColumnVisible('_checkbox', $scope.data.currItem.epm_discount_apply_lines.some(function (discount_apply_line) {
						return (discount_apply_line.can_order == 2 || discount_apply_line.can_ecn == 2) && (!$scope.data.opanRead);
					}));
				});
			}

		}

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
			controller: EPMDiscountApplyProp
        });
    }
);