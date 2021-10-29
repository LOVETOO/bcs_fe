/**
 * 职级职等关系 hr_occupation_level_limit_list
 * Created by zhl on 2019/3/30.
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
                field: 'temp',
                headerName: 'temp'
            }, {
                field: 'temp',
                headerName: 'temp'
            }, {
                field: 'temp',
                headerName: 'temp'
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


