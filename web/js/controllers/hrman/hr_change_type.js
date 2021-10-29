/**
 * Created by asus on 2019/4/16.
 */
(function(defineFn){
    define(['module','controllerApi','base_edit_list'],defineFn);
})(function(module,controllerApi,base_edit_list){
    HrChangeType.$inject=['$scope'];
    function HrChangeType($scope){
        $scope.gridOptions={
            columnDefs:[{
                field:'change_type_code',
                headerName:'异动编码'
            },{
                field:'change_type_name',
                headerName:'异动描述'
            },{
                field:'for_billtype',
                headerName:'适用单据类型',
                hcDictCode:'for_billtype'
            },{
                field:'is_writeendsalarytime',
                headerName:'须填停薪日期',
                type:'是否'
            },{
                field:'is_sysvalue',
                headerName:'系统预设',
                type:'是否'

            },{
                field:'is_inheimingdan',
                headerName:'须列入特殊名单',
                type:'是否'
            },{
                field:'usable',
                headerName:'有效状态',
                hcDictCode:'usable_code'
            }]
        };

        controllerApi.extend({
            controller:base_edit_list.controller,
            scope:$scope
        });
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            bizData.usable=2;
        };
    }

    return controllerApi.controller({
        module:module,
        controller:HrChangeType
    });

})