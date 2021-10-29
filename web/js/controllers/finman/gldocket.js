/**
 * 参数设置
 * 2018-12-13 add by qch
 */
define(['module', 'controllerApi', 'base_edit_list'],
    function (module, controllerApi, base_edit_list) {

        DemoEditList.$inject = ['$scope'];
        function DemoEditList($scope) {

            /*--------------------数据定义------------------------*/
            $scope.gridOptions = {
                columnDefs: [{
                    type: '序号'
                }, {
                    field: 'docket_code',
                    headerName: '常用摘要编码'
                }, {
                    field: 'docket_name',
                    headerName: '常用摘要名称'
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
                    headerName: '更新人'
                }, {
                    field: 'last_update_date',
                    headerName: '更新时间'
                }]
            };

            controllerApi.extend({
                controller: base_edit_list.controller,
                scope: $scope
            });


            /*-------------------顶部右边按钮------------------------*/
            $scope.toolButtons = {
                add: {
                    title: '新增',
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add && $scope.add();
                    }
                },
                delete: {
                    title: '删除',
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.delete && $scope.delete();
                    }
                },
                search: {
                    title: '查询',
                    icon: 'fa fa-filter',
                    click: function () {
                        $scope.search && $scope.search();
                    }
                },
                export: {
                    title: '导出',
                    icon: 'glyphicon glyphicon-log-out',
                    click: function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    }
                }
            };


        }

        return controllerApi.controller({
            module: module,
            controller: DemoEditList
        });
    }
);