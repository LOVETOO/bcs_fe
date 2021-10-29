/**
 * 离职原因设置 hr_position_abdicate_reson_list
 * Created by zhl on 2019/4/4.
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
                field: 'abdicate_reson',
                headerName: '离职原因',
                maxWidth:1200,
                width:970
            }, {
                field: 'usable',
                headerName: '有效',
                type:'是否'//1否 2是
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        //新增时：数据初始化
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            bizData.usable = 2;//默认可用
        };

    }

    return controllerApi.controller({
        module: module,
        controller: EditList
    });
});
