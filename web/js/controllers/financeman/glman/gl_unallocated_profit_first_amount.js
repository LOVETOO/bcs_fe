/**
 * 未分配利润年初数 gl_unallocated_profit_first_amount
 * Created by zhl on 2019/2/22.
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list', 'constant'], defineFn);
})(function (module, controllerApi, base_edit_list, constant) {
    DemoEditList.$inject = ['$scope'];
    function DemoEditList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'year',
                headerName: '年度',
                type:'日期'
            }, {
                field: 'first_amount',
                headerName: '期初金额',
                type:'金额'
            }, {
                field: 'remark',
                headerName: '备注'
            }, {
                field: 'creation_date',
                headerName: '创建日期'
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /*-------------------- 按钮定义 --------------------*/
        //右侧工具按钮
        $scope.toolButtons = {
            search: {
                title: '筛选',
                icon: 'iconfont hc-shaixuan',
                click: function () {
                    $scope.search && $scope.search();
                }
            },
            delete: {
                title: '删除',
                icon: 'fa fa-minus',
                click: function () {
                    $scope.delete && $scope.delete();
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

    }

    return controllerApi.controller({
        module: module,
        controller: DemoEditList
    });
});

