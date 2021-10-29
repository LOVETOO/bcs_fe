/**
 * 项目进度更新
 * @since 2019-06-20
 */
define(['module', 'controllerApi', 'base_edit_list'], function (module, controllerApi, base_edit_list) {

	EpmProjectStageUpdate.$inject = ['$scope'];
	function EpmProjectStageUpdate(   $scope) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcDataRelationName: 'epm_projects',
			columnDefs: [
				{
					type: '序号'
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
					field: 'stage_name',
					headerName: '项目进度名称'
				},
				{
					field: 'stage_note',
					headerName: '项目进度备注'
				},
				{
					field: 'stage_desc',
					headerName: '项目进度描述'
				}
			]
		};

		//继承
		controllerApi.extend({
			controller: base_edit_list.controller,
			scope: $scope
		});

		['add', 'delete'].forEach(function (buttonId) {
			$scope.toolButtons[buttonId].hide = true;
		});

		/**
		 * 通用查询
		 */
		$scope.commonSearch = {
			stage_name: {
				afterOk: function (stage) {
					['stage_id', 'stage_name', 'stage_note'].forEach(function (field) {
						$scope.data.currItem[field] = stage[field];
					});

					if ($scope.data.currItem.stage_id == $scope.data.currRowNode.data.stage_id) {
						$scope.data.currItem.stage_desc = $scope.data.currRowNode.data.stage_desc;
					}
					else {
						$scope.data.currItem.stage_desc = '';
					}
				}
			}
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjectStageUpdate
	});
});