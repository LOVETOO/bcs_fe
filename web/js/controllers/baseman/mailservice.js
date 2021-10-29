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
                    field: 'enterprise_name',
                    headerName: '组织名称'
                }, {
                    field: 'param_code',
                    headerName: '参数编码'
                }, {
                    field: 'param_type',
                    headerName: '参数类型',
                    type: '词汇',
                    cellEditorParams: {
                        names: ['字符类型', '数字类型', '布尔类型'],
                        values: ['1', '2', '3']
                    }
                }, {
                    field: 'param_value',
                    headerName: '参数值'
                }, {
                    field: 'remark',
                    headerName: '参数说明'
                }, {
                    field: 'creator',
                    headerName: '创建人'
                }, {
                    field: 'create_time',
                    headerName: '创建时间'
                }, {
                    field: 'updator',
                    headerName: '更新人'
                }, {
                    field: 'update_time',
                    headerName: '更新时间'
                }]
            };

            controllerApi.extend({
                controller: base_edit_list.controller,
                scope: $scope
            });

            /**
             * 成本核算方式
             */
            $scope.data.param_type_options = [
                {name: '字符类型', value: '1'},
                {name: '数字类型', value: '2'},
                {name: '布尔类型', value: '3'}
            ];


            /*-------------------顶部右边按钮------------------------*/
            $scope.toolButtons = {
                add: {
                    title: '新增',
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add && $scope.add();
                    }
                },
                search: {
                    title: '筛选',
                    icon: 'fa fa-filter',
                    click: function () {
                        $scope.search && $scope.search();
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