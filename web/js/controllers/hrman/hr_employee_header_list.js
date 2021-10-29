/**
 * Created by asus on 2019/4/17.
 */
/**
 * 职位设置 hr_position_setting_list
 * Created by zhl on 2019/4/4.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {

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
                headerName: '状态',
                hcDictCode:'emp_stat'
            }, {
                field: 'employee_code',
                headerName: '工号'
            }, {
                field: 'employee_name',
                headerName: '姓名'
            },{
                field: 'start_date',
                headerName: '入职日期',
                type:'日期'
            }, {
                field: 'idcard',
                headerName: '身份证号'
            }, {
                field: 'sex',
                headerName: '性别',
                hcDictCode:'sex'
            }, {
                field: 'birthday',
                headerName: '出生年月',
                type:'日期'
            }, {
                field: 'is_married',
                headerName: '婚否',
                hcDictCode:'is_valuation'
            }, {
                field: 'career',
                headerName: '学历',
                hcDictCode:'degree_req'
            }, {
                field: 'school_name',
                headerName: '毕业学校'
            },{
                field: 'nation',
                headerName: '民族'
            },   {
                field: 'hometown',
                headerName: '籍贯'
            }, {
                field: 'card_addrinfo',
                headerName: '户籍地'
            }, {
                field: 'address',
                headerName: '家庭地址'
            },  {
                field: 'username',
                headerName: '登录用户名'
            }, {
                field: 'org_name',
                headerName: '部门名称'
            }, {
                field: 'position_name',
                headerName: '职位'
            },  {
                field: 'change_type_name',
                headerName: '入职类型'
            },  {
                field: 'zipcode',
                headerName: '邮编'
            },{
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
            },{
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
        //以下按钮默认隐藏
        (function (buttonIds) {
            buttonIds.forEach(function (buttonId) {
                $scope.toolButtons[buttonId].hide = true;
            });
        })([
            'add',
            'delete'
        ]);



    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: EmployeeApplyHeaderList
    });
});

