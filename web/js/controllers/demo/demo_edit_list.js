(function (defineFn) {
	define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
	DemoEditList.$inject = ['$scope'];
	function DemoEditList($scope) {
		$scope.gridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'uom_code',
				headerName: '单位编码'
			}, {
				field: 'uom_name',
				headerName: '单位名称'
			}, {
				field: 'note',
				headerName: '备注'
			}]
		};

		controllerApi.extend({
			controller: base_edit_list.controller,
			scope: $scope
		});
	}

	return controllerApi.controller({
		module: module,
		controller: DemoEditList
	});
});