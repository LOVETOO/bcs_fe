/**
 * 人员证照列表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'fileApi'],
    function (module, controllerApi, base_obj_list, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'stat',
                            headerName: '当前状态',
                            cellStyle: {
                                'text-align': 'center'//文本居中
                            }
                        }, {
                            field: 'resource_archives_code',
                            headerName: '系统编码'
                        }, {
                            field: 'resource_identifier',
                            headerName: '证书编号'
                        }, {
                            field: 'resource_name',
                            headerName: '证书名称'
                        }, {
                            field: 'resouce_category_name',
                            headerName: '证照类别'
                        }, {
                            field: 'certifying_authority',
                            headerName: '发证机构'
                        }, {
                            field: 'professional_category',
                            headerName: '专业类别'
                        }, {
                            field: 'employee_name',
                            headerName: '员工姓名'
                        }, {
                            field: 'sex',
                            headerName: '性别',
                            hcDictCode: 'sex'
                        }, {
                            field: 'idcard',
                            headerName: '身份证号'
                        }, {
                            field: 'phone',
                            headerName: '联系电话'
                        }, {
                            field: 'org_name',
                            headerName: '所属部门'
                        }, {
                            field: 'effective_date',
                            headerName: '生效日期',
                            type: '日期'
                        }, {
                            field: 'exp_date',
                            headerName: '失效日期',
                            type: '日期'
                        }, {
                            field: 'keeper_name',
                            headerName: '保管人',
                        }, {
                            field: 'is_usable',
                            headerName: '可用',
                            type: "是否",
                            cellStyle: {
                                'text-align': 'center'//文本居中
                            }
                        }, {
                            field: 'loan_date',
                            headerName: '借出时间',
                            type: '日期'
                        }, {
                            field: 'estimated_return_date',
                            headerName: '预计归还时间',
                            type: '日期'
                        }, {
                            field: 'loan_project_name',
                            headerName: '使用项目'
                        }, {
                            field: 'loan_description',
                            headerName: '使用用途'
                        }, {
                            field: 'loan_person_name',
                            headerName: '使用人'
                        }, {
                            field: 'remark',
                            headerName: '备注'
                        }, {
                            field: 'create_by_name',
                            headerName: '创建人'
                        }, {
                            field: 'create_date',
                            headerName: '创建时间'
                        }, {
                            field: 'last_update_by_name',
                            headerName: '修改人'
                        }, {
                            field: 'last_update_date',
                            headerName: '修改时间'
                        }
                    ],
                    //查看人员证照数据
                    hcBeforeRequest: function (searchObj) {
                        searchObj.resouce_type = 2;
                    }
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //按钮显示
                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;
                /**
                 * 导入时发送的数据
                 * @returns {{data: {resouce_type: number}}}
                 */
                $scope.getImportSetting = function () {
                    return {
                        data: {
                            resouce_type : 2
                        }
                    };
                };

                $scope.toolButtons.downloadImportFormat.click = function () {
                    fileApi.downloadFile(7263);
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