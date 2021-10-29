/**
 * 项目报备 - 列表页
 * 2020-03-03
 * zengjinhua
 */
define(['module', 'controllerApi', 'base_obj_list', 'angular', 'swalApi', 'requestApi', 'openBizObj', '$q', 'requestApi'], 
function (module, controllerApi, base_obj_list, angular, swalApi, requestApi, openBizObj, $q, requestApi) {

	EpmReportList.$inject = ['$scope', '$modal'];
	function EpmReportList($scope, $modal) {

		var single = $stateParams.report_type == 1,			//单体报备
			strategic = $stateParams.report_type == 2;		//战略报备

		$scope.single = single;

		//定义冻结原因保存对象
		var reasonCollection = {};

		//获取冻结原因词汇值
		$q.when()
		.then(function(){
			return $q.all([
				requestApi.getDict('epm.proj.freeze_type')
			]);
		})
		.then(function (responses){
			responses[0].forEach(function(value){
				reasonCollection[value.dictvalue] = value.dictname
			});
		});

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcPostData: {
				search_flag: 1,
				report_type: $stateParams.report_type
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'project_valid',
					headerName: '有效状态',
					hcDictCode: 'valid',
					hide: !single,
					cellStyle: function (params) {
						var style = {
							'text-align': 'center'
						};

						var color = Switch(params.value, '==')
							.case(1, 'gray')		//未失效
							.case(2, 'green')		//已生效
							.case(3, 'red')			//已失效
							.case(4, 'blue')		//已冻结
							.result;

						if(params.value == 4 && (params.data.epu_stat == 1 || params.data.epu_stat == 3)){
							color = 'orange';
							if(params.data.epu_stat == 3 && params.data.epu_audit_stat == '审核拒绝'){
								color = 'red';
							}
						}

						if (color) {
							style['color'] = color;
						}

						return style;
					},
					hide: !single,
					valueFormatter: function (params) {
						var value = $scope.gridOptions.columnTypes['词汇'].valueFormatter(params);
						if(params.data.project_valid == 4){
							if (params.data.epu_stat == 1){
								value = "解冻草稿";
							}else if(params.data.epu_stat == 3){
								if(params.data.epu_audit_stat == '审核拒绝'){
									value = "解冻拒绝";
								}else{
									value = "解冻申请中";
								}
							}else if (params.data.freeze_type > 0) {
								value += '(' + reasonCollection[params.data.freeze_type] +')';
							}
						}
						return value;
					}
				},
				/* {
					field: 'stat',
					headerName: '审核状态',
					hcDictCode: '*'
                }, */
                {
                    field: 'audit_stat',
                    headerName: '审核状态',
                    cellStyle: {
                        'text-align': 'center'
                    }
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
					field: 'customer_code',
					headerName: '客户编码',
					hide: !single
				},
				{
					field: 'customer_name',
					headerName: '客户名称',
					hide: !single
				},
				{
					field: 'short_name',
					headerName: '客户简称'
				},
				{
					field: 'report_time',
					headerName: '申报日期',
					type: '时间'
				},
				{
					field: 'province_name',
					headerName: '省',
					hide: !single
				},
				{
					field: 'city_name',
					headerName: '市',
					hide: !single
				},
				{
					field: 'area_name',
					headerName: '区',
					hide: !single
				},
				{
					field: 'address',
					headerName: '详细地址',
					hide: !single
				},
				{
					field: 'is_local',
					headerName: '本地/异地',
					hcDictCode: 'epm.is_local',
					hide: !single
				},
				{
					field: 'project_valid_date',
					headerName: '报备有效期至',
					type: '日期'
				},
				{
					field: 'party_a_name',
					headerName: '甲方名称'
				},
				{
					field: 'party_a_link_person',
					headerName: '甲方联系人'
				},
				{
					field: 'party_a_phone',
					headerName: '甲方联系电话',
					valueGetter: function (params) {
						return params.data.party_a_phone_hide
					}
				},
				{
					field: 'party_b_name',
					headerName: '乙方名称'
				},
				{
					field: 'party_b_link_person',
					headerName: '乙方联系人'
				},
				{
					field: 'party_b_phone',
					headerName: '乙方联系电话',
					valueGetter: function (params) {
						return params.data.party_b_phone_hide
					}
				},
				{
					field: 'stage_update_deadline',
					headerName: '进度更新期限',
					type: '日期'
				},
				{
					field: 'stage_name',
					headerName: '项目当前进度'
				},
				{
					field: 'division_id',
					headerName: '所属事业部',
					hcDictCode: 'epm.division',
					hide: !single
				},
				{
					field: 'is_discount',
					headerName: '已生成折扣单',
					type : '是否'
				},
				{
					field: 'is_contract',
					headerName: '已生成合同',
					type : '是否'
				},
				{
					field: 'trading_company_name',
					headerName: '交易公司'
				},
				{
					field: 'manager',
					headerName: '项目经理'
				},
				{
					field: 'pdt_line',
					headerName: '产品线',
					hcDictCode: 'epm.order_pdt_line'
				},
				{
					field: 'operating_mode',
					headerName: '管理类型',
					hcDictCode: 'epm.operating_mode',
					hide: !strategic
				},
				{
					field: 'project_source',
					headerName: '工程类型',
					hcDictCode: 'epm.project_source',
					hide: !single
				},
				{
					field: 'agent_opinion',
					headerName: '经办人意见',
					hide: !single
				},
				{
					field: 'agent',
					headerName: '经办人',
					hide: !single
				},
				{
					field: 'agent_phone',
					headerName: '经办人电话',
					hide: !single
				},
				{
					field: 'rel_project_code',
					headerName: '战略项目编码',
					hide: !single
				},
				{
					field: 'rel_project_name',
					headerName: '战略项目名称',
					hide: !single
				},
				{
					field: 'operating_mode',
					headerName: '管理类型',
					hcDictCode: 'epm.operating_mode',
					hide: !single
				},
				{
					field: 'strategic_stage',
					headerName: '战略对接进度',
					hide: !strategic
				},
				{
					field: 'need_deposit',
					headerName: '缴纳保证金',
					type: '词汇',
					cellEditorParams: {
						names: ['同意', '不同意'],
						values: [2, 1]
					},
					hide: !single
				},
				{
					field: 'project_type',
					headerName: single ? '业主类型' : '项目类型',
					hcDictCode: 'epm.project_type'
				},
				{
					field: 'background',
					headerName: '背景关系',
					hcDictCode: 'epm.background'
				},
				{
					field: 'predict_proj_qty',
					headerName: '预计项目数量',
					hide: !strategic
				},
				{
					field: 'predict_sales_amount',
					headerName: '预估合同金额(元)',
					type : '金额'
				},
				{
					field: 'site_area',
					headerName: '工程建筑面积',
					hide: !single
				},
				{
					field: 'predict_pdt_qty',
					headerName: '工程用量（套）'
				},
				{
					field: 'is_foreign',
					headerName: '海外',
					type: '是否',
					hide: !single
				},
				{
					field: 'construction_stage',
					headerName: '工程施工进度',
					hide: !single
				},
				{
					field: 'completion_date',
					headerName: '竣工日期',
					type: '日期',
					hide: !single
				},
				{
					field: 'predict_sign_date',
					headerName: '预计签订日期',
					type: '日期',
					hide: !strategic
				},
				{
					field: 'predict_sales_amount',
					headerName: '预计销售收入（万元）',
					type: '万元',
					hide: !strategic
				},
				{
					field: 'intent_product',
					headerName: '工程意向产品'
				},
				{
					field: 'competitor',
					headerName: '竞争对手'
				},
				{
					field: 'stage_desc',
					headerName: '项目进度描述',
					hide: !single
				},
				{
					field: 'dealer_follower',
					headerName: '客户现场跟进人',
					hide: !single
				},
				{
					field: 'dealer_follower_phone',
					headerName: '客户跟进人电话',
					hide: !single
				},
				{
					field: 'own_follower',
					headerName: '乐华现场跟进人',
					hide: !single
				},
				{
					field: 'own_follower_phone',
					headerName: '乐华跟进人电话',
					hide: !single
				},
				{
					field: 'need_sample',
					headerName: '产品已送样',
					type: '是否',
					hide: !single
				},
				{
					field: 'need_quote',
					headerName: '产品已报价',
					type: '是否',
					hide: !single
				},
				{
					field: 'creator_name',
					headerName: '创建人'
				},
				{
					field: 'createtime',
					headerName: '创建时间',
					type: '时间'
				},
				{
					field: 'updator_name',
					headerName: '修改人'
				},
				{
					field: 'updatetime',
					headerName: '修改时间',
					type: '时间'
				}
			],
			hcAfterRequest:function(response){//请求完表格事件后触发
				response.epm_reports.forEach(function (value) {
					if(value.site_area == 0){
						value.site_area = undefined;
					}
				});
			},
			getContextMenuItems: function (params) {
				var menuItems = $scope.gridOptions.hcDefaultOptions.getContextMenuItems(params);

				menuItems.push('separator');

				if (userbean.isAdmin) {
					if (+params.node.data.project_id) {
						menuItems.push({
							icon: '<i class="iconfont hc-wendang2"></i>',
							name: '查看项目档案',
							action: function () {
								return openBizObj({
									stateName: 'epmman.epm_project_prop',
									params: {
										id: params.node.data.project_id
									}
								});
							}
						});
					}
				}

				if (params.node && $stateParams.report_type == 1 && userbean.hasRole('project_vitiator')) {
					Switch(params.node.data.project_valid, '==')
						.case(2, function () {
							menuItems.push({
								icon: '<i class="iconfont hc-zhongduan"></i>',
								name: '失效',
								action: function () {
									//$scope.disableProject(params.node);
									/*============发起项目失效申请============*/
									$scope.disableProjectLaunchApplication ();
								}
							});
						})
						.case(3, function () {
							menuItems.push({
								icon: '<i class="iconfont hc-dui"></i>',
								name: '恢复有效',
								action: function () {
									$scope.reenableProject(params.node);
								}
							});
						});
				}

				return menuItems;
			}
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

        delete $scope.filterSetting.filters.stat;
        /* $scope.filterSetting.filters.audit_stat = {
            options: [
                { name: '新建', value: '新建' },
                { name: '已提交', value: '已提交' },
                { name: '审核通过', value: '审核通过' },
                { name: '审核拒绝', value: '审核拒绝' },
                { name: '已送签OA', value: '已送签OA' }
            ]
        }; */

		/**
		 * 发起项目失效申请
		 */
		$scope.disableProjectLaunchApplication  = function () {
			var node = $scope.gridOptions.hcApi.getFocusedNode();

			if (!node){
				swalApi.info('请选中要发起失效的行');
				return;
			}
			var id =  node.data[$scope.data.idField];
			return swalApi.confirm("确定要发起失效吗?").then(function () {
				return requestApi
					.post({
						classId: 'epm_project_contract',
						action: 'search',
						data: {
							project_id: $scope.currItem.project_id,     //查询属于这个项目的合同
							valid : 2,                          		//查询有效的
							is_frame : 1,                       		//查询非战略合同
							sqlwhere : ' contract_type >0 ' 			//查询经销商合同与自营合同
						}
					})
					.then(function (data) {
						if(data.epm_project_contracts.length > 0){
							var codes = "";
							data.epm_project_contracts.forEach(function (value) {
								codes =  "\r\n    【" + value.contract_code + "】";
							});
							swalApi.info("该项目存在有效的合同:"
								+ codes
								+ "\r\n请进行合同失效，可指定合同失效时一并失效工程。");
						}else{
							//发起项目失效
							requestApi
								.post({
									classId: 'epm_project_disable',
									action: 'efficacy',
									data: {
										project_id: $scope.currItem.project_id,
										project_code : $scope.currItem.project_code,
										project_name : $scope.currItem.project_name
									}
								})
								.then(function (data) {
									var modalResultPromise = openBizObj({
										stateName: 'epmman.epm_project_disable_prop',
										params: {
											id: data.proj_disable_id,
											readonly: false
										}
									}).result;
									modalResultPromise.finally($scope.gridOptions.hcApi.search);
								});
						}
					});
			});

		};

		/**
		 * 失效项目
		 * @since 2019-08-27
		 */
		$scope.disableProject = function (rowNode) {
			var report = rowNode.data;

			return swalApi
				.input({
					text: '请输入失效原因',
					inputValidator: function (value) {
						if (typeof value === 'string' && value) {}
						else {
							return '失效原因必填';
						}
					}
				})
				.then(function (change_valid_reason) {
					return requestApi.post({
						classId: 'epm_report',
						action: 'disable',
						data: {
							report_id: rowNode.data.report_id,
							change_valid_reason: change_valid_reason
						}
					});
				})
				.then(function (report) {
					angular.extend(rowNode.data, report);

					$scope.gridOptions.api.redrawRows([rowNode]);

					return swalApi.success('失效成功');
				});
		};

		/**
		 * 使失效项目恢复有效
		 * @since 2019-08-28
		 */
		$scope.reenableProject = function (rowNode) {
			return swalApi
				.input({
					text: '请输入恢复有效性的原因',
					inputValidator: function (value) {
						if (typeof value === 'string' && value) { }
						else {
							return '原因必填';
						}
					}
				})
				.then(function (change_valid_reason) {
					return requestApi.post({
						classId: 'epm_report',
						action: 'reenable',
						data: {
							report_id: rowNode.data.report_id,
							change_valid_reason: change_valid_reason
						}
					});
				})
				.then(function (report) {
					angular.extend(rowNode.data, report);

					$scope.gridOptions.api.redrawRows([rowNode]);

					return swalApi.success('恢复有效成功');
				});
		};

		//若是【单体报备】
		if ($stateParams.report_type == 1) {
			$scope.toolButtons.disable = {
				title: '失效',
				icon: 'iconfont hc-zhongduan',
				click: function () {
					//$scope.disableProject($scope.currRowNode);
					/*===========发起项目失效申请=============*/
					$scope.disableProjectLaunchApplication ($scope.currRowNode);
				},
				hide: function () {
					return true;
					//return !userbean.hasRole('project_vitiator') || $scope.$eval('currItem.project_valid != 2');
				}
			};

			$scope.toolButtons.reenable = {
				title: '恢复有效',
				icon: 'iconfont hc-dui',
				click: function () {
					$scope.reenableProject($scope.currRowNode);
				},
				hide: function () {
					return true;
					//return !userbean.hasRole('project_vitiator') || $scope.$eval('currItem.project_valid != 3');
				}
			};
		}

		//若是【战略报备】
		if ($stateParams.report_type == 2) {
			angular.extend($scope.toolButtonGroups, {
				report: {}
			});

			angular.extend($scope.toolButtons, {
				secondReport: {
					groupId: 'report',
					icon: 'iconfont hc-add',
					title: '二次报备',
					click: function () {
						var modalInstance = $modal
							.openCommonSearch({
								title: '请选择要进行二次报备的项目',
								classId: 'epm_project',
								postData: {
									report_type: $stateParams.report_type
								},
								beforeOk: function (proj) {
									return requestApi
										.post({
											classId: 'epm_report',
											action: 'check_for_report_again',
											data: {
												project_id: proj.project_id
											}
										})
										.then(function (report) {
											if (!report.error) return;

											var messages = report.error.split(/\n+/);

											swalApi
												.confirm({
													text: messages,
													confirmButtonText: '选择其他项目'
												})
												.then(null, function () {
													modalInstance.dismiss();
												});

											throw report.error;
										});
								},
								afterOk: function (proj) {
									return openBizObj({
										stateName: 'epmman.epm_report_prop',
										params: {
											reportAgain: true,
											project_id: proj.project_id
										}
									}).result.finally($scope.refresh);
								}
							});
						
						return modalInstance.result;
					}
				}
			});
		}

		/**
		 * 给详情路由传参
		 */
		$scope.getPropRouterParams = function () {
			return {
				report_type: $stateParams.report_type
			};
		};

	}
	
	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmReportList
	});
});