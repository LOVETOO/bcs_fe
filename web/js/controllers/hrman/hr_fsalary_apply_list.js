(function (defineFn) {
    define(['module','controllerApi','base_obj_list'],defineFn);
})(function(module, controllerApi, base_obj_list){

    ObjList.$inject = ['$scope'];
    function ObjList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            },  {
                field: 'stat',
                hcDictCode:'stat',
                headerName: '单据状态'
            }, {
                field: 'bill_no',
                headerName: '单据号'
            },  {
                field: 'year_month',
                headerName: '生效年月'
            },   {
                field: 'salary_group_name',
                headerName: '薪资组'
            },  {
                field: 'dept_code',
                headerName: '部门编号'
            },  {
                field: 'dept_name',
                headerName: '部门名称'
            },  {
                field: 'remark',
                headerName: '备注'
            }]
        };

        //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: ObjList
    });

});