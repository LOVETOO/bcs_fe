/**
 * 家装折扣延期
 * zengjinhua
 * 2020-3-27
 */
define(['module', 'controllerApi', 'base_obj_prop', 'angular', 'requestApi', 'swalApi', 'gridApi', 'numberApi', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, angular, requestApi, swalApi, gridApi, numberApi) {
	'use strict';

	/**
	 * 详情页控制器
	 */
	EPMDiscountDelayProp.$inject = ['$scope', '$q'];
	function EPMDiscountDelayProp(   $scope,   $q) {

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
            bizData.is_home = 2;//家装

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
                        is_home : 2,//家装
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
					field: 'model',
					headerName: '型号'
				},
				{
					field: 'uom_name',
					headerName: '单位'
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
					type: '金额'
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