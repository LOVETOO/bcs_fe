(function (defineFn) {
	define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
	InsrncTypeList.$inject = ['$scope'];
	function InsrncTypeList($scope) {
		$scope.gridOptions = {
			columnDefs: [{
				type: '序号'
			}, {
				field: 'insrnc_type_code',
				headerName: '社保类型编码'
			}, {
				field: 'insrnc_type_name',
				headerName: '社保类型名称'
			}, {
				field: 'usable',
				headerName: '有效状态',
				type:"词汇",
				cellEditorParams: {
					names: ["无效","有效"],
					values: [1,2]
				}
			}, {
                field: 'is_sysvalue',
                headerName: '系统预设',
                type:"是否"
            }, {
                field: 'remark',
				headerName: '备注'
            }, {
                field: 'created_by',
				headerName: '创建者'
            }, {
                field: 'creation_date',
				headerName: '创建时间'
            }, {
                field: 'last_updated_by',
				headerName: '最后修改人'
            }, {
                field: 'last_update_date',
				headerName: '最后修改日期'
            }],
            /*hcAfterRequest: function (response) {
                 console.log(response);
            }*/
		};

		controllerApi.extend({
			controller: base_edit_list.controller,
			scope: $scope
        });
        
		$scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.usable = 2;
        }
	}

	return controllerApi.controller({
		module: module,
		controller: InsrncTypeList
	});
});