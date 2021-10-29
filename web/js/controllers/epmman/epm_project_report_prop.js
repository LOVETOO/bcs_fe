/**
 * 项目报备 - 详情页
 * @since 2019-06-20
 */
define(['module', 'controllerApi', 'base_obj_prop'], function (module, controllerApi, base_obj_prop) {

	EpmProjectReportProp.$inject = ['$scope', '$stateParams'];
	function EpmProjectReportProp(   $scope,   $stateParams) {

		//继承
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
		});

		//把路由参数放入作用域
		$scope.$stateParams = $stateParams;

		/**
		 * 标签页
		 */
		$scope.tabs.base.title = '基本信息';

		/**
		 * 表格：跟进进度历程
		 */
		$scope.stageGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'test',
					headerName: '跟进进度'
				},
				{
					field: 'test',
					headerName: '进度描述',
					width: 300
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

		/**
		 * 表格：分配经销商
		 */
		$scope.dealerGridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'test',
					headerName: '经销商编码'
				},
				{
					field: 'test',
					headerName: '经销商名称',
					width: 300
				}
			]
		};

		/**
		 * 通用查询
		 */
		$scope.commonSearch = {

			//战略报备号
			rel_project_code: {
				postData: {
					report_type: 2 //战略报备
				},
				afterOk: function (projReport) {
					['project_id', 'project_code', 'project_name'].forEach(function (field) {
						$scope.data.currItem['rel_' + field] = projReport[field];
					});
				}
			},

			//跟进进度
			stage_name: {
				afterOk: function (stage) {
					['stage_id', 'stage_name', 'stage_note'].forEach(function (field) {
						$scope.data.currItem[field] = stage[field];
					});
				}
			}

		};

		/**
		 * 新增时
		 */
		$scope.newBizData = function (bizData) {
			bizData.report_type = $stateParams.report_type;
		};

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjectReportProp
	});
});