/**
 * 家装战略报备
 * zengjinhua
 * 2020-03-06
 */
define(['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'gridApi', 'requestApi', 'fileApi', 'dateApi', 'openBizObj', 'promiseApi', 'controllers/epmman/epmman', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, swalApi, gridApi, requestApi, fileApi, dateApi, openBizObj, promiseApi, epmman) {

	EpmReportProp.$inject = ['$scope', '$modal', '$q'];
	function EpmReportProp($scope, $modal, $q) {

		//继承
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

		/**
		 * 定义产品线数组
		 */
		$scope.pdtLine = [];

		//缓存当前选择客户id与编码
		$scope.data.customer_id = 0;
		$scope.data.customer_code = "";

		/**
		 * 表格：分配客户
		 */
		$scope.dealerGridOptions = {
			hcEvents: {
				/**
				 * 焦点事件
				 */
				cellFocused: function (params) {
					if(params.rowIndex != null){
						/**
						 * 缓存id编码
						 */
						$scope.data.customer_id = $scope.data.currItem.epm_report_auths[params.rowIndex].customer_id;
						$scope.data.customer_code = $scope.data.currItem.epm_report_auths[params.rowIndex].customer_code;
						//设置数据
						$scope.stageGridOptions.hcApi.setRowData($scope.data.customer_branch[$scope.data.customer_code]);
					}
				}
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'customer_code',
					headerName: '经销商编码'
				},
				{
					field: 'customer_name',
					headerName: '经销商名称',
					minWidth: 300
				},
				{
					field: 'contact',
					headerName: '经办人',
					minWidth: 300
				},
				{
					field: 'tele',
					headerName: '经办人电话',
					minWidth: 300
				},
				{
					field: 'disabled',
					headerName: '已失效',
					type : '是否'
				}
			],
			//定义表格增减行按钮
			hcButtons: {
				callAdd: {
					icon: 'iconfont hc-add',
					click: function () {
						$scope.addCustomer && $scope.addCustomer();
					},
					hide : function(){
						return $scope.isFormReadonly() || !$scope.form.editing;
					}
				},
				invoiceDel: {
					icon: 'iconfont hc-reduce',
					click: function () {
						$scope.delCustomer && $scope.delCustomer();
					},
					hide : function(){
						return $scope.isFormReadonly() || !$scope.form.editing;
					}
				}
			}
		};

		/**
		 * 表格：家装网点信息
		 */
		$scope.stageGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'branch_message_name',
					headerName: '网点名称'
				},
				{
					field: 'business_name',
					headerName: '营业执照名称'
				},
				{
					field: 'branch_legal_name',
					headerName: '网点法人',
					width: 300
				},
				{
					field: 'address',
					headerName: '地址'
				},
				{
					field: 'linkman',
					headerName: '联系人',
					minWidth: 146
				},
				{
					field: 'phone',
					headerName: '联系人电话'
				},
				{
					field: 'customer_code',
					headerName: '报备经销商编码',
					minWidth: 146
				},
				{
					field: 'customer_name',
					headerName: '报备经销商名称',
					minWidth: 146
				},
				{
					field: 'disabled',
					headerName: '已失效',
					type : '是否'
				}
			],
			//定义表格增减行按钮
			hcButtons: {
				callAdd: {
					icon: 'iconfont hc-add',
					click: function () {
						$scope.addBranch && $scope.addBranch();
					},
					hide : function(){
						return $scope.isFormReadonly() || !$scope.form.editing;
					}
				},
				invoiceDel: {
					icon: 'iconfont hc-reduce',
					click: function () {
						$scope.delBranch && $scope.delBranch();
					},
					hide : function(){
						return $scope.isFormReadonly() || !$scope.form.editing;
					}
				}
			}
		};

		/**
		 * 新增分配经销商
		 */
		$scope.addCustomer = function () {
			return $modal
				.openCommonSearch({
					classId: 'customer_org',
					postData: {
						search_flag: 128
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

					customers.forEach(function(value){
						$scope.data.customer_branch[value.customer_code] = [];
					});

					Array.prototype.push.apply($scope.data.currItem.epm_report_auths, customers);

					$scope.dealerGridOptions.api.updateRowData({
						add: customers
					});
				});
		};

		/**
		 * 删除分配经销商
		 */
		$scope.delCustomer = function () {
			var idx = $scope.dealerGridOptions.hcApi.getFocusedRowIndex();
			if (idx < 0) {
				swalApi.info('请选中要删除的行');
			} else{
				$scope.data.customer_branch[$scope.data.currItem.epm_report_auths[idx].customer_code] = undefined;
				$scope.data.currItem.epm_report_auths.splice(idx, 1);
				$scope.dealerGridOptions.hcApi.setRowData($scope.data.currItem.epm_report_auths);
			}
		};

		/**
		 * 新增家装网点
		 */
		$scope.addBranch = function () {
			if($scope.data.customer_branch[$scope.data.customer_code] == undefined){
				swalApi.info('请先选择对应经销商');
				return;
			}
			return $modal
				.openCommonSearch({
					classId: 'epm_branch_message',
					postData: {
						search_flag : 3,
						customer_id : $scope.data.customer_id
					},
					checkbox: true
				})
				.result
				.then(function (branchs) {
					var branchsInGrid = $scope.stageGridOptions.hcApi.getRowData();

					branchs = branchs.filter(function (branch) {
						return branchsInGrid.every(function (branchInGrid) {
							return branchInGrid.branch_message_id != branch.branch_message_id;
						});
					});

					if (!branchs.length) return;

					branchs.forEach(function(value){
						value.rel_customer_code = $scope.data.customer_code;
					});

					Array.prototype.push.apply($scope.data.customer_branch[$scope.data.customer_code], branchs);

					$scope.stageGridOptions.api.updateRowData({
						add: branchs
					});
				});
		};

		/**
		 * 删除家装网点
		 */
		$scope.delBranch = function () {
			var idx = $scope.stageGridOptions.hcApi.getFocusedRowIndex();
			if (idx < 0) {
				swalApi.info('请选中要删除的行');
			} else{
				 $scope.data.customer_branch[$scope.data.customer_code].splice(idx, 1);
				$scope.stageGridOptions.hcApi.setRowData($scope.data.customer_branch[$scope.data.customer_code]);
			}
		};


		$scope.footerRightButtons.validReport = {
			title: '查重',
			click: function () {
				return openBizObj({
					stateName: 'epmman.epm_project_search',
					params: {
						report_id: $scope.data.currItem.report_id,
						report_type: $scope.data.currItem.report_type,
						search_flag : 7 //家装档案查询权限
					}
				}).result;
			},
			hide: function(){
				return (!userbean.hasRole('project_audit',true) || !$scope.data.currItem.report_id);
			}
		};


		/**
		 * 通用查询
		 */
		$scope.commonSearch = {

			//交易公司
			trading_company_name: {
				title: '交易公司',
				action:'selectenttransction',
				afterOk: function (result) {
					$scope.data.currItem.trading_company_id = result.trading_company_id;
					$scope.data.currItem.trading_company_code = result.trading_company_code;
					$scope.data.currItem.trading_company_name = result.trading_company_name;
				}
			},

			//行政区域全名
			area_full_name: {
				title: '请选择省级行政区',
				postData: {
					areatype: 4
				},
				afterOk: function (province) {
					var city;

					return $q
						.when()
						.then(function () {
							return $modal.openCommonSearch({
								classId: 'scparea',
								title: '请选择市级行政区',
								postData: {
									areatype: 5,
									superid: province.areaid
								}
							}).result;
						})
						.then(function () {
							city = arguments[0];

							return $modal.openCommonSearch({
								classId: 'scparea',
								title: '请选择区级行政区',
								postData: {
									areatype: 6,
									superid: city.areaid
								}
							}).result;
						})
						.then(function (area) {
							$scope.data.currItem.province_id = province.areaid;
							$scope.data.currItem.province_name = province.areaname;

							$scope.data.currItem.city_id = city.areaid;
							$scope.data.currItem.city_name = city.areaname;

							$scope.data.currItem.area_id = area.areaid;
							$scope.data.currItem.area_name = area.areaname;

							$scope.data.currItem.area_full_name =
								$scope.data.currItem.province_name
								+ '-' + $scope.data.currItem.city_name
								+ '-' + $scope.data.currItem.area_name;
						});
				}
			}

		};


		/**
		 * 新增业务数据
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			
			$scope.hcSuper.newBizData(bizData);

			bizData.report_type = 3;

			bizData.manager = userbean.username;

			bizData.report_time = dateApi.today();

			//分配经销商
			bizData.epm_report_auths = [];

			//经销商对应网点
			$scope.data.customer_branch = {};
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);

			//数据处理
			//经销商对应网点
			$scope.data.customer_branch = {};
			bizData.epm_report_auths.forEach(function(value){
				$scope.data.customer_branch[value.customer_code] = 
					bizData.epm_report_auth_branchs.filter(function(val){
						return val.rel_customer_code == value.customer_code;
					});
			});

			gridApi.execute($scope.dealerGridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(bizData.epm_report_auths);
			});
		};

		/**
		 * 保存数据处理
		 */
		$scope.saveBizData = function (bizData) {
			$scope.hcSuper.saveBizData(bizData);
			//清空数组
			bizData.epm_report_auth_branchs = [];
			//重组数组
			bizData.epm_report_auths.forEach(function (value) {
				$scope.data.customer_branch[value.customer_code].forEach(function (val) {
					bizData.epm_report_auth_branchs.push(val);
				});
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
					return $q.all([
						requestApi.getDict('epm.order_pdt_line'),
						requestApi.post({
							classId: 'order_pdt_line',
							data: {
								is_project_report : 2
							}
						}),
					]);
				})
				.then(function (responses){
					var order_pdt_lines = responses[0];
							var active_order_pdt_lines = responses[1].order_pdt_lines;

							$scope.pdtLine = order_pdt_lines.map(function (order_pdt_line) {
								return {
									value: order_pdt_line.dictvalue,
									name: order_pdt_line.dictname,
									disabled: active_order_pdt_lines.every(function (active_order_pdt_line) {
										return active_order_pdt_line.order_pdt_line_id != order_pdt_line.dictvalue;
									})
								};
							});
				});
		};

		/**
		 * 查看地图
		 */
		$scope.showMap = function () {
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

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmReportProp
	});
});