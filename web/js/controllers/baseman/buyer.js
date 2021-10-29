/**
 * 参数设置
 * 2018-12-17 add by qch
 */
define(['module', 'controllerApi', 'base_edit_list',],
    function (module, controllerApi, base_edit_list) {

        var DemoEditList = [
            //声明依赖注入
            '$scope', '$q', 'BasemanService',
            //控制器函数
            function ($scope, $q, BasemanService) {


                /*--------------------数据定义------------------------*/
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'employee_code',
                        headerName: '采购员编码'
                    }, {
                        field: 'employee_name',
                        headerName: '采购员名称'
                    }, {
                        field: 'isuseable',
                        headerName: '可用',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['否', '是'],
                            values: ['1', '2']
                        }
                    }, {
                        field: 'remark',
                        headerName: '备注'
                    }, {
                        field: 'created_by',
                        headerName: '创建人'
                    }, {
                        field: 'creation_date',
                        headerName: '创建时间'
                    }, {
                        field: 'last_updated_by',
                        headerName: '修改人'
                    }, {
                        field: 'last_update_date',
                        headerName: '修改时间'
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
                        title: '筛选',
                        icon: 'fa fa-filter',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
                };


                /*-------------------事件------------------------*/
                $scope.chooseBuyer = {
                    postDate:{
                        maxsearchrltcmt: 300
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.employee_id = result.employee_id;
                        $scope.data.currItem.employee_code = result.employee_code;
                        $scope.data.currItem.employee_name = result.employee_name;
                    }
                };

            }
        ];

        return controllerApi.controller({
            module: module,
            controller: DemoEditList
        });
    }
);