/**
 * 职级职等关系 hr_occupation_level_limit_list
 * Created by zhl on 2019/3/30.
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
                field: 'position_level_code',
                headerName: '职级'
            }, {
                field: 'grade_bottom_line',
                headerName: '职等下限(从)',
                type:'数字'
            }, {
                field: 'grade_top_line',
                headerName: '职等上限(至)',
                type:'数字'
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

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });

        //获取绑定数据
        function getCurrItem() {
            return $scope.data.currItem;
        }

        //点击查询按钮 查询销售价格类型
        $scope.commonSearchSettingOfLevel = {
            sqlWhere: " usable = 2 ",
            afterOk: function (result) {
                getCurrItem().hr_position_level_id = result.hr_position_level_id;
                getCurrItem().position_level_code = result.position_level_code;
            }
        };

        /**
         * 新增时数据、网格默认设置
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            $scope.data.currItem.usable = 2;
        }

        /*
        * 验证
        * 职等上限 > 职等下限
        * */
        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);

            if(getCurrItem().grade_bottom_line > getCurrItem().grade_top_line)
                invalidBox.push("【职等下限】不能大于【职等上限】");

        }

    }

    return controllerApi.controller({
        module: module,
        controller: EditList
    });
});


