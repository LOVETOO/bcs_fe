/**
 * 薪资公式 - 列表页
 * @since 2019-05-17
 */
(function (defineFn) {
	define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module,   controllerApi,   base_obj_list) {

	/**
	 * 控制器
	 */
	HrSalaryFormulaList.$inject = ['$scope'];
	function HrSalaryFormulaList(   $scope) {

		/**
		 * 表格选项
		 */
		$scope.gridOptions = {
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'salary_group_code',
					headerName: '薪资组编码'
				},
				{
					field: 'salary_group_name',
					headerName: '薪资组名称'
				},
				{
					field: 'salary_item_code',
					headerName: '薪资项目编码'
				},
				{
					field: 'salary_item_name',
					headerName: '薪资项目名称'
				},
				{
					field: 'calc_type',
					headerName: '计算类型',
					hcDictCode: 'hr_salary_item_set.calc_type'
				},
				{
					field: 'salary_formula_desc',
					headerName: '计算公式'
				}
			]
		};

		//继承
		controllerApi.extend({
			controller: base_obj_list.controller,
			scope: $scope
		});

		//隐藏部分按钮
		['add', 'delete'].forEach(function (buttonId) {
			$scope.toolButtons[buttonId].hide = true;
		});

	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: HrSalaryFormulaList
	});
});