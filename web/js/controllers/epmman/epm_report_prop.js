/**
 * 项目报备 - 详情页
 * @since 2019-06-20
 */
define(['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'gridApi', 'requestApi', 'fileApi', 'directiveApi', 'openBizObj', 'numberApi', 'promiseApi', 'controllers/epmman/epmman', 'directive/hcModal', 'directive/hcAddress'], function (module, controllerApi, base_obj_prop, swalApi, gridApi, requestApi, fileApi, directiveApi, openBizObj, numberApi, promiseApi, epmman) {

	EpmReportProp.$inject = ['$scope', '$stateParams', '$modal', '$q'];
	function EpmReportProp($scope, $stateParams, $modal, $q) {

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

		/**
		 * 是否创建人登陆,默认是
		 */
		$scope.creatorLog = true;

		/**
		 * 是否为瓷砖事业部登陆
		 */
		$scope.data.isTile = false;

		//【箭牌瓷砖】【法恩莎瓷砖】【安华瓷砖】
		if(userbean.loginEnt.entid == 104 || userbean.loginEnt.entid == 105 || userbean.loginEnt.entid == 106){
			$scope.data.isTile = true;
		}

		/**
		 * 定义产品线数组
		 */
		$scope.pdtLine = [];

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
					headerName: '经销商编码'
				},
				{
					field: 'customer_name',
					headerName: '经销商名称',
					minWidth: 300
				}
			]
		};

		/**
		 * 保存验证
		 */
		$scope.validCheck = function (invalidBox) {
			$scope.hcSuper.validCheck(invalidBox);
			if($scope.data.currItem.site_area != undefined 
				&& $scope.data.currItem.site_area != null
				&& $scope.data.currItem.site_area != ""
				&& $scope.data.currItem.site_area != 0){
				if(!numberApi.isNum(Number($scope.data.currItem.site_area))){//判断输入是否是数字
					invalidBox.push("'工程建筑面积',请输入正确数字!");
				}
			}
			//为异地项目，才进行已下校验
			if($scope.data.currItem.is_local == 1){
				//先校验是否为非数字
				if(!numberApi.isNum(Number($scope.data.currItem.deposit_amount))){
					invalidBox.push('保证金金额请输入正确的数字');
				}else if(!(Number($scope.data.currItem.deposit_amount) >= 0)){
					invalidBox.push('保证金金额不允许为负数');
				}else if($scope.data.currItem.need_deposit == 2){//同意的时候，不可为零
					if(Number($scope.data.currItem.deposit_amount) == 0){
						invalidBox.push('保证金金额请输入大于零的数字');
					}
				}
			}
			return invalidBox;
		};

		/**
		 * 标签页切换事件
		 */
		$scope.onTabChange = function (params) {
			$q
				.when(params)
				.then($scope.hcSuper.onTabChange)
				.then(function () {
					switchGridModel(params.id);
				});
		};

		['topRow', 'upRow', 'downRow', 'bottomRow'].forEach(function (buttonId) {
			$scope.footerLeftButtons[buttonId].hide = true;
		});

		/**
		 * 切换表格模型
		 * @param {string} tabId 标签页ID
		 */
		function switchGridModel(tabId) {
			Switch(tabId)
				.case('base', function () {
					gridApi.execute($scope.dealerGridOptions, function (gridOptions) {
						if ($scope.data.currItem.report_times > 1) {
							$scope.data.currGridOptions = $scope.dealerGridOptions;
							$scope.data.currGridModel = 'data.currItem.epm_report_auths';
						}
						else {
							clearGridModel();
						}
					});
				})
				.default(clearGridModel);

			function clearGridModel() {
				$scope.data.currGridOptions = null;
				$scope.data.currGridModel = '';
			}
		}

		$scope.footerLeftButtons.addRow.click = function () {
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

					Array.prototype.push.apply($scope.data.currItem.epm_report_auths, customers);

					$scope.dealerGridOptions.api.updateRowData({
						add: customers
					});
				});
		};

		$scope.footerRightButtons.validReport = {
			title: '查重',
			click: function () {
				return openBizObj({
					stateName: 'epmman.epm_project_search',
					params: {
						report_id: $scope.data.currItem.report_id,
						report_type: $scope.data.currItem.report_type,
						search_flag : 3
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

			//战略报备号
			rel_project_code: {
				postData: function () {
					return {
						search_flag: 4, //查询场景：单体报备选择战略项目时
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

					['operating_mode'].forEach(function (field) {
						$scope.data.currItem[field] = projReport[field];
					});
				}
			},

			//跟进进度
			stage_name: {
				sqlWhere: 'update_mode = 1 /* 更新方式：手动更新 */',
				afterOk: function (stage) {
					['stage_id', 'stage_name', 'stage_note'].forEach(function (field) {
						$scope.data.currItem[field] = stage[field];
					});
				}
			},

			//交易公司
			trading_company_name: {
				title: '交易公司',
				action:'selectenttransction',
				afterOk: function (result) {
					$scope.data.currItem.trading_company_id = result.trading_company_id;
					$scope.data.currItem.trading_company_name = result.trading_company_name;
				}
			},

			//客户
			customer_code: {
				title: '客户',
				postData: {
					search_flag: 142
				},
				afterOk: function (customer) {
					['customer_id', 'customer_code', 'customer_name', 'division_id'].forEach(function (field) {
						$scope.data.currItem[field] = customer[field];
					});

					['id', 'code', 'name'].forEach(function (field) {
						delete $scope.data.currItem['rel_project_' + field];
					});

					$scope.data.currItem.belong_to = customer.customer_class;
				}
			},

			//甲方
			party_a_name: {
				title: '甲方',
				postData: {
					search_flag: 122
				},
				afterOk: function (customer) {
					$scope.data.currItem.party_a_name = customer.customer_name;
				}
			},

			//乙方
			party_b_name: {
				title: '乙方',
				postData: {
					search_flag: 122
				},
				afterOk: function (customer) {
					$scope.data.currItem.party_b_name = customer.customer_name;
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
			},

			//省
			province_name: {
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
			},

			//市
			city_name: {
				title: '请选择市级行政区',
				postData: function () {
					return {
						areatype: 5,
						superid: $scope.data.currItem.province_id
					}
				},
				beforeOpen: function () {
					if (!+$scope.data.currItem.province_id) {
						swalApi.info('请先选择省级行政区');
						return false;
					}
				},
				afterOk: function (city) {
					return $q
						.when()
						.then(function () {
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
			},

			//区
			area_name: {
				title: '请选择区级行政区',
				postData: function () {
					return {
						areatype: 6,
						superid: $scope.data.currItem.city
					}
				},
				beforeOpen: function () {
					if (!+$scope.data.currItem.city_id) {
						swalApi.info('请先选择市级行政区');
						return false;
					}
				},
				afterOk: function (area) {
					$scope.data.currItem.area = area.areaid;
					$scope.data.currItem.area_name = area.areaname;

					$scope.data.currItem.area_full_name =
						$scope.data.currItem.province_name
						+ '-' + $scope.data.currItem.city_name
						+ '-' + $scope.data.currItem.area_name;
				}
			}

		};

		/**
		 * 改变事件
		 * @param {string} field
		 */
		$scope.onChange = function (field) {
			Switch(field)
				.case('is_foreign', function () {
					var nameValue;

					if ($scope.data.currItem.is_foreign == 2) {
						nameValue = '海外';
					}
					else {
						nameValue = '';
					}

					[
						'province_id',
						'city_id',
						'area_id'
					].forEach(function (field) {
						$scope.data.currItem[field] = 0;
					});

					[
						'province_name',
						'city_name',
						'area_name',
						'area_full_name'
					].forEach(function (field) {
						$scope.data.currItem[field] = nameValue;
					});
				});
        };

        $scope.sysParams = {};

        var sysParamsPromise = $q.all([
            requestApi.getSysParam('EPM.Report.Remote_Shared').then(function (sysParam) {
                $scope.sysParams.remote_shared = sysParam.param_value === 'true';
            }),
            requestApi.getDict('epm.report.task_shared_rate').then(function (dictItems) {
                var firstValidDictItem = dictItems.find(function (dictItem) {
                    return dictItem.usable == 2;
                });

                if (firstValidDictItem) {
                    $scope.sysParams.task_shared_rate = numberApi.toNumber(firstValidDictItem.dictvalue);
                }
                else {
                    $scope.sysParams.task_shared_rate = 0;
                }
            }),
            requestApi.getDict('epm.report.service_fee_shared_rate').then(function (dictItems) {
                var firstValidDictItem = dictItems.find(function (dictItem) {
                    return dictItem.usable == 2;
                });

                if (firstValidDictItem) {
                    $scope.sysParams.service_fee_shared_rate = numberApi.toNumber(firstValidDictItem.dictvalue);
                }
                else {
                    $scope.sysParams.service_fee_shared_rate = 0;
                }
            })
        ]).then(function () {
            return $scope.sysParams;
        });

		/**
		 * 新增业务数据
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			var project_id = +$stateParams.project_id;

			if (project_id) {
				return requestApi
					.post({
						classId: 'epm_report',
						action: 'report_again',
						data: {
							project_id: project_id
						}
					})
					.then($scope.setBizData);
			}
			else {
				$scope.hcSuper.newBizData(bizData);

				bizData.report_type = $stateParams.report_type;

                bizData.manager = userbean.username;

				//bizData.report_time = dateApi.today();

				//若是【单体报备】，且当前用户是【客户】
				if (bizData.report_type == 1 && user.isCustomer) {
					['customer_id', 'customer_code', 'customer_name', 'division_id'].forEach(function (field) {
						$scope.data.currItem[field] = customer[field];
					});

					$scope.data.currItem.belong_to = customer.customer_class;
				}

                bizData.epm_report_auths = [];

                return sysParamsPromise.then(function (sysParams) {
                    //若启用【异地划分信息】
                    if (sysParams.remote_shared) {
                        bizData.remote_shared = 2;
                        bizData.task_shared_rate = sysParams.task_shared_rate; //任务划分比例
                        bizData.service_fee_shared_rate = sysParams.service_fee_shared_rate; //服务保证金划分比例
                    }
                });
			}
        };

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);

			//是否创建人查看
			$scope.creatorLog = bizData.creator === user.userid;

			gridApi.execute($scope.dealerGridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData(bizData.epm_report_auths);
			});

			gridApi.execute($scope.stageGridOptions, function (gridOptions) {
				bizData.epm_project_stages[0].stage_update_deadline = bizData.stage_update_deadline;
				$scope.stageGridOptions.columnApi.setColumnsVisible(['stage_update_deadline'], !!(bizData.stage_update_deadline));
				gridOptions.hcApi.setRowData(bizData.epm_project_stages);
			});

			switchGridModel($scope.tabController.getActiveTab().id);

			//单体项目报备，工程建筑面积字段清零
			if($scope.data.currItem.site_area == 0){
				$scope.data.currItem.site_area = undefined;
			}
		};

		/**
		 * select 请求前
		 * @override
		 */
		$scope.doBeforeSelect = function (postParams) {
			return $q
				.when(postParams)
				.then($scope.hcSuper.doBeforeSelect)
				.then(function () {
					if (!+postParams.data.report_id) {
						postParams.data.project_id = $scope.data.currItem.project_id;
					}
				});
		};

		epmman.hideTel({
			$scope: $scope,
			keys: ['party_a_phone', 'party_b_phone']
		});

		/**
		 * 初始化
		 * @override
		 */
		$scope.doInit = function () {
			return $q
				.when()
				.then(function () {
					if (+$stateParams.project_id) {
						$scope.$eval('data.isInsert = $stateParams.reportAgain === "true"', {
							$stateParams: $stateParams
						});

						$scope.$eval('data.currItem.project_id = $stateParams.project_id', {
							$stateParams: $stateParams
						});
					}
				})
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

    }

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmReportProp
	});
});