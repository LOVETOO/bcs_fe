/**
 * 报表设置 - 属性页
 * @since 2019-02-25
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'openBizObj', 'directive/hcSplitterBox'], defineFn);
})(function (module,   controllerApi,   base_obj_prop,   requestApi,   swalApi,   openBizObj) {

	/**
	 * 控制器
	 */
	BaseReportProp.$inject = ['$scope', '$q', '$modal', '$state'];
	function BaseReportProp(   $scope,   $q,   $modal,   $state) {
		//继承
		controllerApi.extend({
			scope: $scope,
			controller: base_obj_prop.controller
		});

		$scope.tabs.base.hide = true;

		$scope.footerLeftButtons.addRow.hide = false;
		$scope.footerLeftButtons.deleteRow.hide = false;

		/**
		 * 列定义表格
		 */
		$scope.columnDefGridOptions = {
			rowDragManaged: true,		//拖拽自动调序
			animateRows: true,			//启用行动画
			defaultColDef: {
				editable: true
			},
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'field',
					headerName: '字段名',
					pinned: 'left',
					rowDrag: true,
					hcRequired: function (params) {
						return params.data.type !== '序号';
					}
				},
				{
					field: 'headerName',
					headerName: '列标题',
					hcRequired: function (params) {
						return params.data.type !== '序号';
					}
				},
				{
					field: 'type',
					headerName: '字段类型',
					hcDictCode: 'AgGrid.ColumnDef.Type',
					onCellValueChanged: function (params) {
						if (params.oldValue !== params.newValue && params.oldValue === '词汇') {
							delete params.data.hcDictCode;

							params.api.redrawRows([params.node]);
						}
					}
				},
				{
					field: 'hcDictCode',
					headerName: '对应词汇编码',
					width: 200,
					hcRequired: function (params) {
						return params.data.type === '词汇';
					},
					onCellValueChanged: function (params) {
						if (params.newValue) {
							params.api.hcApi.setCellValue(params.node, 'type', '词汇');
						}
					},
					onCellDoubleClicked: function (params) {
						params.api.stopEditing();

						$modal
							.openCommonSearch({
								classId: 'scpdict'
							})
							.result
							.then(function (dict) {
								params.api.hcApi.setCellValue(params.node, 'hcDictCode', dict.dictcode);
							});
					}
				}
			],
			hcRequired: true,
			hcEvents: {
				cellValueChanged: function (params) {
					if (params.value === '')
						delete params.data[params.colDef.field];
				}
			}
		};

		$scope.data.currGridModel = 'gridOptions.columnDefs';
		$scope.data.currGridOptions = $scope.columnDefGridOptions;

		/**
		 * 新增业务数据
		 * @param bizData 业务数据
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super

			bizData.gridoptions = '{}';

			$scope.gridOptions = {
				columnDefs: [{
					type: '序号'
				}]
			};

			$scope.data.currItem.gridoptions = JSON.stringify($scope.gridOptions);

			$scope.columnDefGridOptions.hcApi.setRowData($scope.gridOptions.columnDefs);
		};

		/**
		 * 设置业务数据
		 * @param bizData 业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
			$scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super

			$scope.gridOptions = JSON.parse(bizData.gridoptions);

			$scope.columnDefGridOptions.hcApi.setRowData($scope.gridOptions.columnDefs);
		};

		/**
		 * 保存视图数据到业务对象
		 * @param bizData 保存请求的数据
		 * @override
		 */
		$scope.saveBizData = function (bizData) {
			$scope.hcSuper.saveBizData(bizData); //继承基础控制器的方法，类似Java的super

			$scope.gridOptions.columnDefs = $scope.columnDefGridOptions.hcApi.getRowData();

			bizData.gridoptions = JSON.stringify($scope.gridOptions);
		};

		/**
		 * 从语句读取字段
		 */
		$scope.readFieldFromSql = function () {
			if (!$scope.data.currItem.sql)
				return swalApi.error('').then($q.reject);

			if ($scope.gridOptions.columnDefs.length > 1) {
				return swalApi
					.confirm('已有字段定义，重新读取会追加额外字段，确定继续吗？')
					.then(readFieldFromSql);
			}
			else
				return readFieldFromSql();

			function readFieldFromSql() {
				return requestApi
					.post({
						classId: 'base_report',
						action: 'readFieldFromSql',
						data: {
							sql: $scope.data.currItem.sql,
							orderby: $scope.data.currItem.orderby
						}
					})
					.then(function (response) {
						var rowData = $scope.columnDefGridOptions.hcApi.getRowData(),
							newRowData = JSON.parse(response.gridoptions).columnDefs,
							existedFields = {};

						rowData.forEach(function (x) {
							existedFields[x.field] = true;
						});

						newRowData.forEach(function (x) {
							if (!existedFields[x.field]) {
								rowData.push(x);
							}
						});

						$scope.gridOptions.columnDefs = rowData;
						$scope.columnDefGridOptions.hcApi.setRowData(rowData);
					});
			};
		};

		/**
		 * 添加到菜单
		 */
		$scope.addToMenu = function () {
			return $modal
				.openCommonSearch({
					title: '请选择父菜单',
					classId: 'scpmenu',
					postData: {
						menupid: -1 //找顶层菜单
					}
				})
				.result
				.then(function (parentMenu) {
					return openBizObj({
						stateName: 'baseman.base_menu_prop',
						params: {
							title: '新建报表菜单',
							modid: parentMenu.modid,
							menuid: parentMenu.menuid,
							menuidpath: parentMenu.menuidpath,
							menuname: $scope.data.currItem.name,
							webrefaddr: "baseman.base_report_execute({code:'" + $scope.data.currItem.code + "'})"
						}
					}).result;
				});
		};

		/**
		 * 预览效果
		 */
		$scope.openInNewTab = function () {
            return openBizObj({
                fullScreen: true,
                stateName: 'baseman.base_report_execute',
                params: {
                    title: $scope.data.currItem.name,
                    code: $scope.data.currItem.code
                }
            }).result;
		};

		/**
		 * 切换【创建人】字段名
		 */
		$scope.switchKeyOfCreator = function () {
			var key_creator;

			switch ($scope.data.currItem.key_creator) {
				case 'created_by':
					key_creator = 'creator';
					break;

				default:
					key_creator = 'created_by';
			}

			$scope.data.currItem.key_creator = key_creator;
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: BaseReportProp
	});
});