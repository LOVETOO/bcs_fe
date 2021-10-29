/**
 * 职级设置 hr_occupation_level_setting_list
 * Created by DELL on 2019/3/28.
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
            }, {//1~7
                field: 'position_level_num',
                headerName: '级别'
            }, {
                field: 'position_level_code',
                headerName: '职级码'
            }, /*{
                field: 'usable',
                headerName: '有效状态',
                type: '词汇',
                cellEditorParams: {
                    names: ['无效', '无效', '有效'],
                    values: [0, 1, 2]
                }
            },*/ {
                field: 'remark',
                headerName: '备注'
            }]
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        //获取绑定数据
        function getCurrItem() {
            return $scope.data.currItem;
        }

        //职类 查询
        $scope.commonSearchSettingOfPositionClass = {
            sqlWhere:" usable = 2 ",
            afterOk: function (result) {
                getCurrItem().hr_position_class_id = result.hr_position_class_id;
                getCurrItem().position_class_code = result.position_class_code;
                getCurrItem().position_class_name = result.position_class_name;

                if(getCurrItem().position_level_num)
                getCurrItem().position_level_code = getCurrItem().position_class_code + getCurrItem().position_level_num;
            }
        };

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.usable = 2;
        }

        //“级别码”变更时改变职级
        $scope.changeLevelCode = function(){
            if(getCurrItem().position_class_code)
            getCurrItem().position_level_code = getCurrItem().position_class_code + getCurrItem().position_level_num;
        }
    }

    return controllerApi.controller({
        module: module,
        controller: editList
    });
});


