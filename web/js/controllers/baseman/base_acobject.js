/**
 * 往来对象列表页
 * @since 2018-10-10
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    EditList.$inject = ['$scope'];
    function EditList($scope) {
        $scope.gridOptions = {
            columnDefs: [
                {
                    type: '序号'
                }, {
                    field: 'base_ac_object_code',
                    headerName: '往来对象编码',
                    pinned: 'left',
                    suppressSizeToFit:true,
                    width:116
                }, {
                    field: 'base_ac_object_name',
                    headerName: '往来对象名称',
                    pinned: 'left',
                    suppressSizeToFit:true,
                    minWidth:200,
                    width:300
                }, {
                    field: 'remark',
                    headerName: '备注',
                    pinned: 'left',
                    suppressSizeToFit:true,
                    width:95
                }, {
                    field: 'created_by',
                    headerName: '创建人',
                    pinned: 'left',
                    suppressSizeToFit:true,
                    width:100
                }, {
                    field: 'creation_date',
                    headerName: '创建时间',
                    pinned: 'left'
                }, {
                    field: 'last_updated_by',
                    headerName: '最后修改人',
                    pinned: 'left',
                    suppressSizeToFit:true,
                    width:100
                }, {
                    field: 'last_update_date',
                    headerName: '最后修改时间',
                    pinned: 'left'
                }
            ],
            hcClassId : '1811281'
        };

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

/*
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
*/
    }

    return controllerApi.controller({
        module: module,
        controller: EditList
    });
});
