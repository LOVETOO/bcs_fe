/**
 * 员工异动申请 hr_position_employee_change_list
 * Created by ljb on 2019/4/18.
 */
(function (defineFn) {
    define(['module','controllerApi','base_obj_list'],defineFn);
})(function(module, controllerApi, base_obj_list){

    ObjList.$inject = ['$scope'];
    function ObjList($scope) {

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            },{
                field: 'stat',
                headerName: '单据状态',
                hcDictCode:'stat'
            },{
                field: 'change_no',
                headerName: '异动单号'
            },{
                field: 'change_type_name',
                headerName: '异动类型',
            },{
                field: 'change_date',
                headerName: '异动日期',
                type:'日期'
            },{
                field: 'employee_code',
                headerName: '人员编码'
            },{
                field: 'employee_name',
                headerName: '员工姓名'
            },{
                field: 'reason',
                headerName: '异动原因'
            },{
                headerName: '异动前',
                children:[
                {
                    field: 'org_name',
                    headerName: '所属部门'
                },{
                    field: 'position_name',
                    headerName: '职位'
                },{
                    field: 'assure_stat',
                    headerName: '参保状态',
                    hcDictCode:'assure_stat'
                },{
                    field: 'start_date',
                    headerName: '入职日期',
                    type:'日期'
                },{
                    field: 'try_day',
                    headerName: '试用天数'
                },{
                    field: 'formal_date',
                    headerName: '转正日期',
                    type:'日期'
                }]
            },{
                headerName: '异动后',
                children:[
                {
                    field: 'new_org_name',
                    headerName: '所属部门 '
                },{
                    field: 'new_position_name',
                    headerName: '职位'
                },{
                    field: 'insrnc_group_name',
                    headerName: '所属社保组'

                },{
                    field: 'is_need_insure',
                    headerName: '需要参保',
                    type:'是否'
                },{
                    field: 'is_need_stop_insure',
                    headerName: '需要停保',
                    type:'是否'
                },{
                    field: 'salary_stop_date',
                    headerName: '薪资截止日期',
                    type:'日期'
                },{
                    field: 'new_try_day',
                    headerName: '试用天数'
                },{
                    field: 'new_formal_date',
                    headerName: '转正日期',
                    type:'日期'
                }]
            },{
                headerName: '特殊名单',
                children:[
                {
                    field: 'is_heimingdan',
                    headerName: '特殊名单标识',
                    type:'是否'
                },{
                    field: 'lock_type',
                    headerName: '锁定类型',
                    hcDictCode: 'lock_type'
                },{
                    field: 'lock_start_date',
                    headerName: '开始锁定日期',
                    type:'日期'
                },{
                    field: 'lock_end_date',
                    headerName: '截止锁定日期',
                    type:'日期'
                },{
                    field: 'lock_days',
                    headerName: '锁定天数'
                },{
                    field: 'heimingdan_reson',
                    headerName: '列入特殊名单原因'
                }
            ]}
        ]};


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