/**
 * Created by asus on 2019/4/22.
 */
(function(defineFn){
    define(['module','controllerApi','base_edit_list'],defineFn);
})(function(module,controllerApi,base_edit_list){
    HrInsrncReason.$inject=['$scope'];
    function HrInsrncReason($scope){
        $scope.gridOptions={
            columnDefs:[{
                type:'序号'
            },{
                field:'insrnc_reason_code',
                headerName:'原因编码'
            },{
                field:'insrnc_reason_name',
                headerName:'原因描述'
            },{
                field:'addorsub_type',
                headerName:'增减类型',
                hcDictCode:'addorsub_type'
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
                headerName:'最后修改日期'
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
        controller:HrInsrncReason
    });

})