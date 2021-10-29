/**
 * 项目报备 - 详情页
 * @since 2019-06-20
 */
define(['module', 'controllerApi', 'base_obj_prop'], function (module, controllerApi, base_obj_prop) {

	EpmProjectFilingProp.$inject = ['$scope', '$stateParams']
	function EpmProjectFilingProp(   $scope,   $stateParams) {

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

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmProjectFilingProp
	});
});