/**
 * Created by asus on 2019/4/10.
 */
(function(defineFn){
    define(['module','controllerApi','base_edit_list'],defineFn);
})(function(module,controllerApi,base_edit_list){
    HrInsrncGroup.$inject=['$scope'];
    function HrInsrncGroup($scope){
        $scope.gridOptions={
            columnDefs:[{
                field:'insrnc_group_code',
                headerName:'社保组编号'
            },{
                field:'insrnc_group_name',
                headerName:'社保组名称'
             },{
                field:'for_employee_type',
                headerName:'适用员工类型',
                hcDictCode:'project.remote'
            },{
                field:'for_domicile_type',
                headerName:'适用户籍类型',
                hcDictCode:'for_domicile_type'
            },{
                field:'usable',
                headerName:'有效状态',
                hcDictCode:'usable_code'
            },{
                field:'remark',
                headerName:'备注'
            },{
                field:'created_by',
                headerName:'创建者'
            },{
                field:'creation_date',
                headerName:'创建日期'
            },{
                field:'last_updated_by',
                headerName:'最后修改人'
            },{
                field:'last_update_date',
                headerName:'最后修改时间'
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
        controller:HrInsrncGroup
    });

})