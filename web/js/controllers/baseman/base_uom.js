/**
 * 计量单位
 *  2018-11-12
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {

    EditList.$inject = ['$scope'];

    function EditList($scope) {
        //网格定义
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'uom_code',
                headerName: '单位编码',
                pinned: 'left'
            }, {
                field: 'uom_name',
                headerName: '单位名称',
                pinned: 'left'
            }, {
                field: 'note',
                headerName: '备注',
                pinned: 'left',
                width:400
            }, {
                field: 'created_by_name',
                headerName: '创建用户'
            }, {
                field: 'creation_date',
                headerName: '创建时间',
                type:'时间'
            }, {
                field: 'last_updated_by_name',
                headerName: '最后修改用户'
            }, {
                field: 'last_update_date',
                headerName: '最后修改时间',
                type:'时间'
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        //按钮显示
        $scope.toolButtons.downloadImportFormat.hide = false;
        $scope.toolButtons.import.hide = false;

    }

    return controllerApi.controller({
        module: module,
        controller: EditList
    });
});
