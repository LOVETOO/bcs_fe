(function (defineFn) {
	define(['module', 'controllerApi', 'base_edit_list',], defineFn);
})(function (module, controllerApi, base_edit_list,) {
	SalaryGroupList.$inject = ['$scope',];
	function SalaryGroupList($scope) {
		$scope.gridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'salary_group_code',
				headerName: '薪资组编码'
			}, {
				field: 'salary_group_name',
				headerName: '薪资组名称'
			}, {
				field: 'usable',
                headerName: '有效状态',
                type:"词汇",
				cellEditorParams: {
					names: ["无效","有效"],
					values: [1,2]
				}
			}, {
                field: 'remark',
				headerName: '备注'
            }, {
                field: 'created_by',
				headerName: '创建人'
            }, {
                field: 'creation_date',
				headerName: '创建时间'
            }, {
                field: 'last_updated_by',
				headerName: '最后修改人'
            }, {
                field: 'last_update_date',
				headerName: '最后修改时间'
            }]
		};
		controllerApi.extend({
			controller: base_edit_list.controller,
			scope: $scope
        });
        $scope.newBizData = function (bizData) {
            //新增时默认有效
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.usable = 2;
        }

	}

	return controllerApi.controller({
		module: module,
		controller: SalaryGroupList
	});
});