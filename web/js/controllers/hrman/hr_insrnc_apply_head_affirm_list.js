/**
 * Created by asus on 2019/5/5.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    HrInsrncApplyHeadAffirmList.$inject = ['$scope'];
    function HrInsrncApplyHeadAffirmList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'bill_no',
                headerName: '单据号'
            },{
                field: 'year_month',
                headerName: '生效年月',
                type:'年月'
            }, {
                field: 'add_num',
                headerName: '增加人数'
            },  {
                field: 'sub_num',
                headerName: '减少人数'
            }, {
                field: 'is_confirm',
                headerName: '确认状态',
                hcDictCode:'is_confirm'
            }, {
                field: 'remark',
                headerName: '备注'
            }],
            hcPostData: {
                search_flag:1
            }
        };

        //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
        $scope.toolButtons.add.hide = true;
        $scope.toolButtons.copy.hide = true;
        $scope.toolButtons.delete.hide = true;
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrInsrncApplyHeadAffirmList
    });
});

