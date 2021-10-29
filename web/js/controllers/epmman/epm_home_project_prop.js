/**
 * 项目档案 - 详情页
 * @since 2019-07-05
 */
define(['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'gridApi', 'openBizObj', 'promiseApi', 'controllers/epmman/epmman', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, swalApi, gridApi, openBizObj, promiseApi, epmman) {

	EpmProjProp.$inject = ['$scope', '$stateParams'];
	function EpmProjProp($scope, $stateParams) {

		//继承
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

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
			]
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
			]
		};

		// 地图跳转
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
        
		/**
		 * 新增业务数据
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData);
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData);

            if(bizData.report_type == 3){
                /**
                 * 战略报备
                 * 数据处理
                 */
                //经销商对应网点
				$scope.data.customer_branch = {};
				//判断是否为经销商账户登陆
				if(user.isCustomer){
					bizData.epm_report_auths = bizData.epm_report_auths.filter(function(value){
						return value.customer_id == customer.customer_id;
					});
				}
                bizData.epm_report_auths.forEach(function(value){
                    $scope.data.customer_branch[value.customer_code] = 
                        bizData.epm_report_auth_branchs.filter(function(val){
                            return val.rel_customer_code == value.customer_code;
                        });
                });

                gridApi.execute($scope.dealerGridOptions, function (gridOptions) {
                    gridOptions.hcApi.setRowData(bizData.epm_report_auths);
                });
            }else{
                //单体报备
                gridApi.execute($scope.stageGridOptions, function (gridOptions) {
                    gridOptions.hcApi.setRowData(bizData.epm_report_auth_branchs);
                });
            }
			
		};

		/**
		 * 档案只读
		 * @override
		 */
		$scope.isFormReadonly = function () {
			return true;
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjProp
	});
});