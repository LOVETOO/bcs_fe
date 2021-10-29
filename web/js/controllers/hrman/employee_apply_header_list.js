/**
 *  2019/4/17.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    EmployeeApplyHeaderList.$inject = ['$scope'];
    function EmployeeApplyHeaderList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'stat',
                headerName: '单据状态',
                hcDictCode:'stat'
            },{
                field: 'employee_code',
                headerName: '员工编码'
            }, {
                field: 'employee_name',
                headerName: '员工姓名'
            },  {
                field: 'stat1',
                headerName: '状态',
                hcDictCode:'stat1'
            }, {
                field: 'change_type_name',
                headerName: '入职类型'
            }, {
                field: 'idcard',
                headerName: '身份证号'
            }, {
                field: 'birthday',
                headerName: '出生日期',
                type:'日期'
            }, {
                field: 'nation',
                headerName: '民族'
            }, {
                field: 'is_married',
                headerName: '婚否',
                hcDictCode:'is_valuation'
            }, {
                field: 'sex',
                headerName: '性别',
                hcDictCode:'sex'
            }, {
                field: 'career',
                headerName: '学历',
                hcDictCode:'degree_req'
            }, {
                field: 'school_name',
                headerName: '毕业学校'
            }, {
                field: 'hometown',
                headerName: '籍贯'
            }, {
                field: 'zipcode',
                headerName: '邮编'
            }, {
                field: 'card_addrinfo',
                headerName: '户籍地'
            }, {
                field: 'org_name',
                headerName: '所属部门'
            }, {
                field: 'position_name',
                headerName: '职位'
            }, {
                field: 'address',
                headerName: '家庭地址'
            }, {
                field: 'start_date',
                headerName: '入职日期',
                type:'日期'
            }, {
                field: 'try_day',
                headerName: '试用期[天]'
            }, {
                field: 'formal_date',
                headerName: '转正日期',
                type:'日期'
            }, {
                field: 'e_mail',
                headerName: '电子邮箱'
            }, {
                field: 'phone',
                headerName: '联系电话'
            }, {
                field: 'contactor1',
                headerName: '紧急联系人'
            }, {
                field: 'contactor1_tel',
                headerName: '紧急联系人电话'
            }, {
                field: 'username',
                headerName: '登录用户名'
            }, {
                field: 'source_human',
                headerName: '人员来源',
                hcDictCode:'source_human'
            }, {
                field: 'note',
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
        controller: EmployeeApplyHeaderList
    });
});

