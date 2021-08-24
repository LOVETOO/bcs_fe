/**
 * 演示 - 对象列表页
 * 2018-12-17
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module,   controllerApi,   base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    DemoObjList.$inject = ['$scope'];

    function DemoObjList($scope) {
        $scope.gridOptions = {
            columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'item_code',
					headerName: '编码'
				}
			]
        };

        //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: DemoObjList
    });
});