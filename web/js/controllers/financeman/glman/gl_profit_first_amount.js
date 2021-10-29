/**
 * 利润表期初数设置 gl_profit_first_amount
 * Created by zhl on 2019/1/15.
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'requestApi', 'swalApi'], defineFn);
})(function (module, controllerApi, base_edit_list, requestApi, swalApi) {
    DemoEditList.$inject = ['$scope'];
    function DemoEditList($scope) {

        //数据定义
        $scope.data = {};
        $scope.data.currItem = {};

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'gain_desc',
                headerName: '利润项目名称'
            }, {
                field: 'amount_years',
                headerName: '期初累计发生数',
                type:'金额'
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*-------------------- 按钮定义 --------------------*/
        //右侧工具按钮
/*
        $scope.toolButtons = {
            search: {
                title: '筛选',
                icon: 'iconfont hc-shaixuan',
                click: function () {
                    $scope.search && $scope.search();
                }
            },
            add: {
                title: '新增',
                icon: 'fa fa-plus',
                click: function () {
                    $scope.add && $scope.add();
                }
            }
        };
*/

    }

    return controllerApi.controller({
        module: module,
        controller: DemoEditList
    });
});




