/**
 * 薪资组设置 hr_salary_group_setting
 * Created by zhl on 2019/4/1.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    EditList.$inject = ['$scope'];
    function EditList($scope) {
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
                field: 'remark',
                headerName: '备注'
            }, {
                field: 'created_by',
                headerName: '创建人'
            },{
                field: 'creation_date',
                headerName: '创建时间'
            },  {
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
    }

    return controllerApi.controller({
        module: module,
        controller: EditList
    });
});








