/**
 * 职位设置 hr_position_setting_list
 * Created by zhl on 2019/4/4.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_list'], defineFn);
})(function (module, controllerApi, base_obj_list) {
    'use strict';

    /**
     * 控制器
     */
    ObjList.$inject = ['$scope'];
    function ObjList($scope) {
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号',
                checkboxSelection:true
            }, {
                field: 'position_code',
                headerName: '职位编码'
            }, {
                field: 'position_name',
                headerName: '职位名称'
            }, {
                field: 'position_name',
                headerName: '部门编码'
            }, {
                field: 'dept_name',
                headerName: '部门名称'
            }, {
                field: 'is_in_charge',
                headerName: '部门负责人',
                type: '是否'
            }, {
                field: 'usable',
                headerName: '有效',
                type: '是否'
            }, {
                field: 'position_group_name',
                headerName: '职群/职种'
            }, {
                field: 'position_class_name',
                headerName: '职类'
            }, {
                field: 'position_level_code',
                headerName: '职级'
            }, {
                field: 'position_grade',
                headerName: '职等',
                prnned:'右'
            }, {
                field: 'position_desc',
                headerName: '职位设置目的'
            }, {
                field: 'sex_req',
                headerName: '性别',
                hcDictCode:'gender'
            }, {
                field: 'age_req',
                headerName: '年龄',
                hcDictCode:'age_req'
            }, {
                field: 'experience_req',
                headerName: '工作经验',
                hcDictCode:'experience_req'
            }, {
                field: 'degree_req',
                headerName: '学历',
                hcDictCode:'degree_req'
            }, {
                field: 'lang_req',
                headerName: '语言'
            }, {
                field: 'specialty_req',
                headerName: '专业要求'
            }, {
                field: 'knowledge_req',
                headerName: '专业知识'
            }, {
                field: 'ability_req',
                headerName: '能力要求'
            }, {
                field: 'special_req',
                headerName: '其他特殊要求'
            }, {
                field: 'career_desc',
                headerName: '职业发展'
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

