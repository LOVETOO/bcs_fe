/**
 * 工程项目管理 - 公用功能
 * @since 2019-08-06
 */
define(['exports', 'angular', 'numberApi', 'gridApi', 'requestApi', 'swalApi', 'Decimal', 'promiseApi'], function (epmman, angular, numberApi, gridApi, requestApi, swalApi, Decimal, promiseApi) {

	['$q', '$modal', function ($q, $modal) {
        function getStateInfo($scope) {
            var state = $scope.$eval('$state.name || ""');

            var stateInfo = {};

            stateInfo.isContract = state.indexOf('contract') >= 0;                                         //是合同吗
            stateInfo.isAutotrophyContract = stateInfo.isContract && state.indexOf('autotrophy_contract') >= 0;      //是自营合同吗
            stateInfo.isDiscount = state.indexOf('discount_apply') >= 0;                                   //是折扣单吗
            stateInfo.isNotContract = !stateInfo.isContract;
            stateInfo.isNotDiscount = !stateInfo.isDiscount;
            stateInfo.isDiscountECN = state.indexOf('discount_ecn') >= 0;

            return stateInfo;
        }

		IfElse
			.if(window === top, function () {
				var division;

				requestApi
					.post({
						classId: 'epm_division',
						action: 'select'
					})
					.then(function () {
						division = arguments[0];
					});

				/**
				 * 返回事业部
				 * @since 2019-08-16
				 */
				epmman.getDivision = function () {
					return division;
				};
			})
			.else(function () {
				var epmmanOfTop;

				/**
				 * 返回事业部
				 * @since 2019-08-16
				 */
				epmman.getDivision = function () {
					return epmmanOfTop.getDivision.apply(epmmanOfTop, arguments);
				};

				top.require(['controllers/epmman/epmman'], function () {
					epmmanOfTop = arguments[0];
				});
			});
		
		/**
		 * 返回折扣明细表格
		 * @since 2019-08-06
		 */
		epmman.getGridOptionsOfDiscountLine = function (params) {
			var contractEditableFields = {
				contract_qty: true,		//合同数量
				delivery_date: true,	//交货日期
				remark: true			//备注
            };
            
            var stateInfo = getStateInfo(params.$scope);

			if (stateInfo.isContract) {
				contractEditableFields.contract_price = true;		//工程方单价
			}

			var gridOptions = {
				hcName: '产品',
				defaultColDef: {
					editable: function (params) {
						var editable;

						if (params.node.rowPinned) {
							editable = false;
						}
						else if (stateInfo.isContract) {
							editable = contractEditableFields[params.colDef.field];
						}
						else if (stateInfo.isDiscount) {
							editable = false;
						}
						else {
							editable = false;
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
						onCellDoubleClicked: function (params) {
							if (!params.columnApi.getColumn('contract_qty').isCellEditable(params.node)) return;

							params.api.stopEditing(true);

							var currItem = gridOptions.hcScope.$parent.data.currItem;

							if (!+currItem.order_pdt_line) {
								swalApi.info('请先选择订单产品线');
								return $q.reject();
							}

							return $modal
								.openCommonSearch({
									classId: 'item_org',
									postData: {
										need_price: 2,									//需要价格
										order_pdt_line: currItem.order_pdt_line,		//订单产品线
										sales_channel: 4,								//销售渠道：工程
										item_orgs: gridOptions.hcApi.getRowData().map(function (line) {
											return {
												item_id: params.data.item_id == line.item_id ? 0 : line.item_id
											};
										})
									},
									beforeOk: function (item) {
										if (item.item_id == params.data.item_id) {
											swalApi.info('此产品和当前行的产品是同一个');
											return false;
										}

										if (params.api.hcApi.getRowData().some(function (discount_line) {
											return discount_line.item_id == item.item_id;
										})) {
											swalApi.info('此产品已在明细中，不能重复添加');
											return false;
										}

										return requestApi
											.post({
												classId: 'epm_discount_apply',
												action: 'generate_discount_data',
												data: {
													customer_id: currItem.customer_id,
													epm_discount_apply_lines: [{
														item_id: item.item_id,
														item_code: item.item_code
													}]
												}
											})
											.then(function (discount_apply) {
												if (discount_apply.error) {
													swalApi.error(discount_apply.error);
													throw discount_apply.error;
												}

												return discount_apply.epm_discount_apply_lines[0];
											});
									}
								})
								.result
								.then(function (new_discount_line) {
									angular.extend(params.data, new_discount_line);

									params.api.refreshCells({
										rowNodes: [params.node]
									});

									epmman.calDiscountData({
										gridOptions: gridOptions
									});
								});
						}
					},
					{
						field: 'item_name',
						headerName: '产品名称',
						pinned: 'left',
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
						headerName: '合同数量',
						type: '数量',
						hcRequired: true
					},
					{
						field: 'ordered_qty',
						headerName: '已下单数量',
						type: '数量',
						hide: true
					},
					{
						field: 'replaced_qty',
						headerName: '已替换数量',
						type: '数量',
						hide: true
					},
					{
						field: 'active_qty',
						headerName: '可下单数量',
						type: '数量',
						hide: true
					},
					{
						field: 'delayed_qty',
						headerName: '已延期数量',
						type: '数量',
						hide: true
					},
					{
						field: 'qty_bill',
						headerName: '已发数量',
						type: '数量',
						hide: true
					},
					{
						field: 'stand_price',
						headerName: '标准单价(元)',
						type: '金额',
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
						headerName: '合同金额',
						type: '金额',
						hide: true
					},
					{
						field: 'discount_rate',
						headerName: '应用折扣率',
						hcRequired: true
					},
					{
						field: 'base_discount_rate',
						headerName: '出厂折扣率'
					},
					{
						field: 'extra_discount_rate',
						headerName: '审批折扣率'
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
						hide: stateInfo.isDiscount
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
						field: 'uom_name',
						headerName: '单位'
					},
					/* {
						field: 'delivery_date',
						headerName: '交货日期',
						type: '日期',
						hide: isNotContract
					}, */
					{
						field: 'remark',
						headerName: '备注'
					},
					{
						field: 'source_item_code',
						headerName: '源产品编码',
						hide: !stateInfo.isDiscount
					},
					{
						field: 'source_item_name',
						headerName: '源产品名称',
						width: 240,
						suppressAutoSize: true,
						suppressSizeToFit: true,
						hide: !stateInfo.isDiscount
					},
					{
						field: 'source_seq',
						headerName: '源产品行号',
						valueFormatter: function (params) {
							return params.value > 0 ? params.value : '';
						},
						hide: !stateInfo.isDiscount
					}
				],
				pinnedBottomRowData: [{ seq: '合计' }],
				hcRequired: function () {
					return gridOptions !== gridOptions.hcScope.$parent.gridOptions_cancel
						&& gridOptions !== gridOptions.hcScope.$parent.gridOptions_product;
				},
				hcEvents: {
					gridReady: function () {
						gridOptions.hcScope.$watch('$parent.data.currItem.stat', function (stat) {
							gridOptions.columnApi.setColumnsVisible(['active_qty', 'ordered_qty', 'replaced_qty', 'delayed_qty', 'qty_bill'], stat == 5);
						});

						gridOptions.hcScope.$watch('$parent.data.currItem.contract_type', function (contract_type) {
							gridOptions.columnApi.setColumnsVisible(['contract_price', 'contract_amount'], contract_type == 1);
						});
						// gridOptions.hcScope.$watch('$parent.data.currItem.contract_type', function (contract_type) {
						// 	gridOptions.columnApi.setColumnsVisible(['undiscounted_amount'], contract_type == 2);
						// });
					},
					cellValueChanged: function (params) {
						if (params.newValue == params.oldValue) {
							return;
						}

						epmman.calDiscountData({
							gridOptions: gridOptions
						});
					}
				}
			};

			return gridOptions;
		};

		/**
		 * 设置折扣明细数据
		 * @since 2019-08-06
		 */
		epmman.setDiscountLineData = function (params) {
			var gridOptions = params.gridOptions;

			return gridApi.execute(gridOptions, function (gridOptions) {
				var currItem = gridOptions.hcScope.$parent.data.currItem;
				var rowData;

				if (currItem.epm_discount_apply_lines && currItem.epm_discount_apply_lines.length) {
					rowData = currItem.epm_discount_apply_lines;
				}
				else if (currItem.epm_contract_items && currItem.epm_contract_items.length) {
					rowData = currItem.epm_contract_items;
				}
				else {
					rowData = [];
				}

				gridOptions.hcApi.setRowData(rowData);

				//合计行
				var totalNode = gridOptions.api.getPinnedBottomRow(0);

				angular.extend(totalNode.data, {
					contract_qty: currItem.total_qty,
					total_volume: currItem.total_volume,
					total_weight: currItem.total_weight,
					undiscounted_amount: currItem.undiscounted_amount,
					discounted_amount: currItem.discounted_amount,
					contract_amount : currItem.item_contract_amount,
					division_cost_amount : currItem.division_cost_amount,
					item_cost_amount : currItem.item_cost_amount
				});

				gridOptions.api.refreshCells({
					rowNodes: [totalNode]
				});
			});
		};

		/**
		 * 计算折扣数据
		 * @since 2019-08-06
		 */
		epmman.calDiscountData = function (params) {
			var gridOptions = params.gridOptions,
				currItem = params.currItem || gridOptions.hcScope.$parent.data.currItem;

			//折扣明细数据
			var discount_lines = gridOptions.hcApi.getRowData();

			function isCalculatable(value) {
				if (value !== value) {
					return false;
				}

				var type = typeof value;

				return type === 'number' || type === 'string';
			}

			//遍历折扣明细
			discount_lines.forEach(function (discount_line) {
				function mutiply(resultKey, multiplierKeys, scale) {
					var result;

					if (multiplierKeys.length) {
						var multipliers = multiplierKeys.map(function (key) {
							return numberApi.normalizeAsNumber(discount_line[key]);
						});

						if (multipliers.some(function (multiplier) {
							return multiplier === '';
						})) {
							result = '';
						}
						else {
							result = Decimal(multipliers.shift());

							multipliers.forEach(function (multiplier) {
								result = result.mul(multiplier);
							});

							result = result.toFixed(scale);
						}
					}
					else {
						result = '';
					}

					discount_line[resultKey] = result;
				}

				//【每行总体积】=【合同数量】×【体积】
				mutiply('total_volume', ['contract_qty', 'cubage']);

				//【每行总重量】=【合同数量】×【重量】
				mutiply('total_weight', ['contract_qty', 'weight']);

				//【折前金额】=【合同数量】x【出厂折扣率】×【标准单价】
				mutiply('undiscounted_amount', ['contract_qty', 'base_discount_rate', 'stand_price']);

				//【应用折扣率】=【出厂折扣率】×【审批折扣率】
				mutiply('discount_rate', ['base_discount_rate', 'extra_discount_rate']);

				//【折后单价】=【标准单价】×【应用折扣率】⇒四舍五入2位小数
				mutiply('discounted_price', ['stand_price', 'discount_rate'], 2);

				//【折后金额】=【合同数量】×【折后单价】
				mutiply('discounted_amount', ['contract_qty', 'discounted_price']);

				//【合同金额】=【工程方单价】×【合同数量】
				mutiply('contract_amount', ['contract_price', 'contract_qty']);

				//【内结金额】=【产品数量】×【标准单价】×【内部结算折扣】
				mutiply('division_cost_amount', ['contract_qty', 'stand_price', 'division_cost_rate']);

				//【实际成本金额】=【产品数量】×【实际成本单价】
				mutiply('item_cost_amount', ['contract_qty', 'item_cost']);
			});

			//合计数据
			var totalData = gridOptions.api.getPinnedBottomRow(0).data;

			/* 合计 */ [
				'contract_qty',				//合同数量
				'total_volume',				//每行总体积
				'total_weight',				//每行总重量
				'undiscounted_amount',		//折前金额
				'discounted_amount',		//折后金额
				'contract_amount',			//合同金额
				'division_cost_amount',		//事业部内结成本金额
				'item_cost_amount',			//物料实际成本金额
				'ordered_qty',				//已下单数量
				'replaced_qty',				//已替换
				'qty_bill',					//已发数量
				'active_qty',				//可下单
				'delayed_qty'				//已延期
			].forEach(function (key) {
				var value = totalData[key] = numberApi.sum(discount_lines, key);

				if (key === 'contract_qty') {
					currItem.total_qty = value;
				}
				else if (key === 'contract_amount') {
					currItem.item_contract_amount = value;
				}
				else {
					currItem[key] = value;
				}
			});

			//刷新计算结果所在的列
			gridOptions.api.refreshCells({
				columns: [
					'contract_qty',				//合同数量
					'total_volume',				//每行总体积
					'total_weight',				//每行总重量
					'undiscounted_amount',		//折前金额
					'discount_rate',			//应用折扣率
					'discounted_price',			//折后单价
					'discounted_amount',		//折后金额
					'contract_amount',			//合同金额
					'division_cost_amount',		//事业部内结成本金额
					'item_cost_amount',			//物料实际成本金额
					'ordered_qty',				//已下单数量
					'replaced_qty',				//已替换
					'qty_bill',					//已发数量
					'active_qty',				//可下单
					'delayed_qty'				//已延期
				]
			});
		};

		/**
		 * 添加折扣明细行
		 * @since 2019-08-06
		 */
		epmman.addDiscountLine = function (params) {
			var gridOptions = params.gridOptions,
                currItem = gridOptions.hcScope.$parent.data.currItem,
                stateInfo = getStateInfo(gridOptions.hcScope.$parent),
				discount_lines = currItem[stateInfo.isContract ? 'epm_contract_items' : 'epm_discount_apply_lines'],
				selectedCount,
				duplicated;

			return $q
				.when()
				.then(function () {
					if (+currItem.order_pdt_line) {
						return;
					}

					return $modal
						.openCommonSearch({
							title: '请先选择订单产品线',
							classId: 'order_pdt_line',
							postData: {
								bill_type: 4, //折扣申请单
								organization_id: ent.entid
							}
						})
						.result
						.then(function (order_pdt_line) {
							currItem.order_pdt_line = order_pdt_line.order_pdt_line_id;
						});
				})
				.then(function () {
					return $modal.openCommonSearch({
						classId: 'item_org',
						postData: {
							need_price: 2,									//需要价格
							order_pdt_line: currItem.order_pdt_line,		//订单产品线
							sales_channel: 4,								//销售渠道：工程
							item_orgs: gridOptions.hcApi.getRowData().map(function (line) {
								return {
									item_id: line.item_id
								};
							})
						},
						checkbox: true,
						beforeOk: function (items) {
							selectedCount = items.length;

							items = items.filter(function (item) {
								return discount_lines.every(function (discount_line) {
									return discount_line.item_id != item.item_id;
								});
							});

							duplicated = items.length < selectedCount;

							if (!items.length) {
								return items;
							}

							return requestApi
								.post({
									classId: 'epm_discount_apply',
									action: 'generate_discount_data',
									data: {
										customer_id: currItem.customer_id,
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

									return discount_apply.epm_discount_apply_lines;
								});
						}
					}).result;
				})
				.then(function (new_discount_lines) {
					if (!new_discount_lines.length) {
						return;
					}

					var focusIndex = discount_lines.length;
					if(currItem.cost_rate){
						new_discount_lines.forEach(function (value){
							value.division_cost_rate = currItem.cost_rate;
						});
					}

					Array.prototype.push.apply(discount_lines, new_discount_lines);

					gridOptions.api.updateRowData({
						add: new_discount_lines
					});

					gridOptions.hcApi.setFocusedCell(focusIndex);

					epmman.calDiscountData({
						gridOptions: gridOptions
					});
				});
		};

		/**
		 * 在折扣单里面选择客户后
		 * @since 2019-08-16
		 */
		epmman.doAfterGetCustomerInDiscount = function (params) {
			var gridOptions = params.gridOptions,
				currItem = gridOptions.hcScope.$parent.data.currItem,
				customer = params.customer;

			return $q
				.when()
				.then(function () {
					return requestApi.post({
						classId: 'epm_discount_apply',
						action: 'get_discount_rate',
						data: {
							customer_id: customer.customer_id
						}
					});
				})
				.then(function (discount_apply) {
					[
						'base_discount_rate',
						'extra_discount_rate',
						'customer_discount_rate'
					].forEach(function (key) {
						currItem[key] = discount_apply[key];
					});

					gridOptions.hcApi.getRowData().forEach(function (data) {
						[
							'base_discount_rate',
							'extra_discount_rate'
						].forEach(function (key) {
							data[key] = discount_apply[key];
						});
						data.division_cost_rate = customer.cost_rate;
					});

					gridOptions.api.refreshCells({
						columns: ['base_discount_rate', 'extra_discount_rate']
					});

					epmman.calDiscountData({
						gridOptions: gridOptions
					});
				});
		};

		/**
		 * 在折扣单里面修改订单产品线后
		 * @since 2019-08-28
		 */
		epmman.doAfterChangeOrderPdtLineInDiscount = function (params) {
			var gridOptions = params.gridOptions,
                currItem = gridOptions.hcScope.$parent.data.currItem,
                stateInfo = getStateInfo(gridOptions.hcScope.$parent),
				discount_lines = currItem[stateInfo.isContract ? 'epm_contract_items' : 'epm_discount_apply_lines'];

			return $q
				.when()
				.then(function () {
					discount_lines.splice(0, discount_lines.length);

					gridOptions.hcApi.setRowData(discount_lines);

					epmman.calDiscountData({
						gridOptions: gridOptions
					});
				});
		};

		/**
		 * 校验折扣数据
		 * @since 2019-08-29
		 */
		epmman.validCheckInDiscount = function (params) {
			var gridOptions = params.gridOptions,
                currItem = gridOptions.hcScope.$parent.data.currItem,
                stateInfo = getStateInfo(gridOptions.hcScope.$parent),
				discount_lines = currItem[stateInfo.isContract ? 'epm_contract_items' : 'epm_discount_apply_lines'],
				invalidBox = params.invalidBox,
				invalidItems = [
					{
						key: 'contract_qty',
						name: '合同数量'
					},
					{
						key: 'stand_price',
						name: '标准单价'
					},
					{
						key: 'discount_rate',
						name: '应用折扣率'
					}
				];

			invalidItems.forEach(function (item) {
				item.rows = [];
			});

			discount_lines.forEach(function (discount_line, i) {
				invalidItems.forEach(function (item) {
					var value = discount_line[item.key],
						type = typeof value;

					if (type === 'number' || (type === 'string' && value)) {
						value = numberApi.toNumber(value);

						if (value <= 0) {
							item.rows.push(i + 1);
						}
					}
				});
			});

			invalidItems.forEach(function (item) {
				if (item.rows.length) {
					invalidBox.push(
						'',
						item.name + '必须大于0，以下行不合法：',
						'第' + item.rows.join('、') + '行'
					);
				}
			});
		};

		/**
		 * 隐藏电话号码
		 * @param params `{
		 *   $scope: 作用域,
		 *   keys: 字段数组
		 * }`
		 */
		epmman.hideTel = function (params) {
			var $scope = params.$scope,
				keys = params.keys,
				hideCount = 4;

			promiseApi
				.whenTrue(function () {
					return !!$scope.form;
				})
				.then(function () {
					keys.forEach(function (key) {
						promiseApi
							.whenTrue(function () {
								var modelController = $scope.form[key];

								if (modelController
									&& modelController.getInputController
									&& modelController.getInputController().getActualInputElement
									&& modelController.getInputController().getActualInputElement()) {
									return true;
								}
							})
							.then(function () {
								var modelController = $scope.form[key];

								modelController.$formatters.push(hideTelFormatter);

								renderAgain();

								var $input = modelController.getInputController().getActualInputElement();

								$input.on({
									focus: function () {
										var index = modelController.$formatters.indexOf(hideTelFormatter);

										if (index >= 0 && !$input[0].readOnly && $scope.data.currItem.creator === user.userid) {
											modelController.$formatters.splice(index, 1);
											renderAgain();
										}
									},
									blur: function () {
										var index = modelController.$formatters.indexOf(hideTelFormatter);

										if (index >= 0) {}
										else {
											modelController.$formatters.push(hideTelFormatter);
											renderAgain();
										}
									}
								});

								function hideTelFormatter(value) {
									if (typeof value === 'string') {
										value = value.trim();

										if (!value) { }
										else if (value.length <= hideCount) {
											value = Array.prototype.map.call(value, function () {
												return '*';
											}).join('');
										}
										else {
											var startIndexToHide = 0;
											var endIndexToHide = 0;
											if (value.length%2 == 0){
												startIndexToHide = numberApi.divide(value.length,2) - 3;
											}else{
												startIndexToHide = numberApi.divide(value.length +1,2) - 3;
											}
											endIndexToHide = startIndexToHide + 3;
											value = Array.prototype.map.call(value, function (c, i) {
												return (i >= startIndexToHide && i <= endIndexToHide) ? '*' : c;
											}).join('');
										}
									}

									return value;
								}

								function renderAgain() {
									modelController.$modelValue = NaN;
									modelController.$viewValue = NaN;
									modelController.$$rawModelValue = undefined;
									modelController.$$lastCommittedViewValue = undefined;

									$scope.$evalAsync();
								}
							});
					});
				});
		};

	}].callByAngular();

});