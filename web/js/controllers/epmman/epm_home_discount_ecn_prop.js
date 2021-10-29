/**
 * 工程折扣变更 - 详情页
 * @since 2019-09-03
 */
define(['module', 'controllerApi', 'base_obj_prop', 'angular', 'requestApi', 'swalApi', 'numberApi', 'gridApi', 'Decimal'], function (module, controllerApi, base_obj_prop, angular, requestApi, swalApi, numberApi, gridApi, Decimal) {
	'use strict';

	/**
	 * 详情页控制器
	 */
	EPMDiscountECNProp.$inject = ['$scope', '$q', '$modal'];
	function EPMDiscountECNProp(   $scope,   $q,   $modal) {

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

            bizData.ecn_type = 1; //变更类型：替换
            bizData.si_home = 2; //家装

			bizData.epm_discount_ecn_before_lines = [];
			bizData.epm_discount_ecn_after_lines = [];
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);
			gridApi.execute($scope.gridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(bizData.epm_discount_ecn_after_lines);
			});
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
                        is_home : 2,/* 家装 */
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

					return $scope.editLine(params.node);
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
					field: 'stand_price',
					headerName: '标准单价(元)',
					type: '金额'
				},
                {
                    field: 'discount_rate',
                    headerName: '应用折扣率'
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
                }  
			]
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
						}
					});
			};
		})($scope.footerLeftButtons.deleteRow.click);

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
                            is_home : 2,//查询家装
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
                 * 计算折扣数据
                 * @since 2019-08-06
                 */
                var calDiscountData = function () {
                    //折扣明细数据
                    var discount_lines = $scope.gridOptions.hcApi.getRowData();

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

                        //【应用折扣率】=【出厂折扣率】×【审批折扣率】
				        mutiply('discount_rate', ['base_discount_rate', 'extra_discount_rate']);

                        //【折后单价】=【标准单价】×【应用折扣率】⇒四舍五入2位小数
                        mutiply('discounted_price', ['stand_price', 'discount_rate'], 2);
                    });

                    //刷新计算结果所在的列
                    $scope.gridOptions.api.refreshCells({
                        columns: [
                            'item_code',//产品编码
                            'item_name',				//产品名称
                            'stand_price',			    //标准单价
                            'discount_rate',            //应用折扣率
                            'base_discount_rate',		//出厂折扣率
                            'extra_discount_rate',		//审批折扣率
                            'discounted_price'		    //折后单价
                        ]
                    });
                };

		/**
		 * 编辑明细
		 */
		$scope.editLine = function (args) {
			return $q
                .when()
                .then(function () {
                    var excludeItems = $scope.gridOptions.hcApi.getRowData().map(function (ecn_line) {
                        return {
                            item_id: ecn_line.item_id > 0?ecn_line.item_id : 0
                        };
                    });

                    return $modal.openCommonSearch({
                        title: '请选择替换 ' + args.data.source_item_code + ' ' + args.data.source_item_name + ' 的产品',
                        classId: 'item_org',
                        postData: {
                            need_price: 2,		//需要价格
                            order_pdt_line: $scope.data.currItem.order_pdt_line,
                            item_orgs: excludeItems
                        },
                        beforeOk: function (items) {
                            return requestApi
                                .post({
                                    classId: 'epm_discount_apply',
                                    action: 'generate_discount_data',
                                    data: {
                                        customer_id: $scope.data.currItem.customer_id,
                                        epm_discount_apply_lines : [{
                                            item_id: items.item_id,
                                            item_code: items.item_code
                                        }],
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
                    }).result;
                })
                .then(function (discount_ecn_lines) {
                    ['item_id','item_name','item_code','stand_price','discount_rate', 'model', 'uom_name',
                    'base_discount_rate','extra_discount_rate','discounted_price'].forEach(function(key){
                        args.data[key] = discount_ecn_lines[key]
                    });

                    calDiscountData();
                });
		};
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EPMDiscountECNProp
	});
});