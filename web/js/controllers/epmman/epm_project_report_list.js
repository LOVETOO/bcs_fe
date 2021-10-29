/**
 * 项目报备 - 列表页
 * @since 2019-06-20
 */
define(['module', 'controllerApi', 'base_obj_list'], function (module, controllerApi, base_obj_list) {

	EpmProjectReportList.$inject = ['$scope', '$stateParams'];
	function EpmProjectReportList(   $scope,   $stateParams) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			hcPostData: {
				report_type: $stateParams.report_type
			},
			hcDataRelationName: 'project_reports',
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'stat',
					headerName: '单据状态',
					hcDictCode: 'stat'
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
					field: 'creator',
					headerName: '创建人'
				},
				{
					field: 'createtime',
					headerName: '创建时间'
				},
				{
					field: 'updator',
					headerName: '修改人'
				},
				{
					field: 'updatetime',
					headerName: '修改时间'
				}
			]
		};
		
		//继承
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});

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
		controller: EpmProjectReportList
	});
});