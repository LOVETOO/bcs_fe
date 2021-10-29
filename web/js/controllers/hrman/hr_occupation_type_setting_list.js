/**
 * 职类设置 hr_occupation_type_setting_list
 * Created by zhl on 2019/3/28.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    editList.$inject = ['$scope'];
    function editList($scope) {
        //网格定义
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'position_class_code',
                headerName: '职类编码'
            }, {
                field: 'position_class_name',
                headerName: '职类名称'
            },  {
                field: 'usable',
                headerName: '有效状态',
                type:'词汇',
                cellEditorParams:{
                    names:['无效','无效','有效'],
                    values:[0,1,2]
                }
            }, {
                field: 'remark',
                headerName: '备注'
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.usable = 2;
        }

    }

    return controllerApi.controller({
        module: module,
        controller: editList
    });
});


