/**
 * Created by zhl on 2019/7/1.
 * 网点人员档案 css_fix_man_list
 */
define(
    ['module', 'controllerApi', 'base_edit_list'],
    function (module, controllerApi, base_edit_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'fix_man_name',
                        headerName: '姓名'
                    }, {
                        field: 'birthday',
                        headerName: '出生年月',
                        type:'年月'
                    }, {
                        field: 'sex',
                        headerName: '性别',
                        hcDictCode:'sex'
                    }, {
                        field: 'work_no',
                        headerName: '工号'
                    }, {
                        field: 'education',
                        headerName: '文化程度',
                        hcDictCode:'educational_level'
                    }, {
                        field: 'position_type',
                        headerName: '岗位类型',
                        hcDictCode:'post_type'
                    }, {
                        field: 'position',
                        headerName: '岗位'
                    }, {
                        field: 'mount_name',
                        headerName: '上岗证名称'
                    }, {
                        field: 'mount_no',
                        headerName: '上岗证证号'
                    }, {
                        field: 'mount_class',
                        headerName: '上岗证级别',
                        hcDictCode:'work_certificate_level'
                    }, {
                        field: 'org_name',
                        headerName: '所属机构'
                    }, {
                        field: 'fix_org_code',
                        headerName: '网点编码'
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }]
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                //获取绑定数据
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                /*-------------------通用查询---------------------*/

                //查询机构
                $scope.commonSearchSettingOfScporg = {
                    afterOk: function (result) {
                        if (!result.code)
                            getCurrItem().org_code = '该部门无编码';
                        else
                            getCurrItem().org_code = result.code;
                        getCurrItem().org_name = result.orgname;
                    }
                };

                //查询网点
                $scope.commonSearchSettingOfFix = {
                    title:'网点',
                    sqlWhere:' usable = 2 ',
                    afterOk: function (result) {
                        getCurrItem().fix_org_id = result.fix_org_id;
                        getCurrItem().fix_org_code = result.fix_org_code;
                        getCurrItem().fix_org_name = result.fix_org_name;
                    }
                };

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
