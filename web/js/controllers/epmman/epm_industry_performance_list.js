/**
 * 工程业绩档案表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /**数据定义 */
                $scope.data = {
                    currItem: {}
                };
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
                            headerName: '业绩编码'
                        }, {
                            field: 'resouce_category_name',
                            headerName: '业绩类型'
                        }, {
                            field: 'resource_identifier',
                            headerName: '业绩编号'
                        }, {
                            field: 'resource_name',
                            headerName: '业绩名称'
                        }, {
                            field: 'contract_amount',
                            headerName: '业绩金额(元)',
                            type: '金额'
                        }, {
                            field: 'project_manager',
                            headerName: '项目经理'
                        }, {
                            field: 'commencement_date',
                            headerName: '开工日期',
                            type: '日期'
                        }, {
                            field: 'completion_date',
                            headerName: '验收日期',
                            type: '日期'
                        }, {
                            field: 'company_type',
                            headerName: '所属行业',
                            type: "词汇",
                            cellEditorParams: {
                                names: ["政府", "医院", "企业", "院校", "公共", "商业"],
                                values: [1, 2, 3, 4, 5, 6]
                            },
                        }, {
                            field: 'brand',
                            headerName: '品牌'
                        }, {
                            field: 'square',
                            headerName: '面积(㎡)',
                            cellStyle: {
                                'text-align': 'center'//文本居中
                            }
                        }, {
                            field: 'keeper_name',
                            headerName: '保管人'
                        }, {
                            field: 'loan_date',
                            headerName: '借出时间',
                            type:'日期'
                        }, {
                            field: 'estimated_return_date',
                            headerName: '预计归还时间',
                            type:'日期'
                        }, {
                            field: 'loan_project_name',
                            headerName: '当前使用项目'
                        }, {
                            field: 'loan_description',
                            headerName: '当前使用用途'
                        }, {
                            field: 'loan_person_name',
                            headerName: '当前使用人'
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
                    //查看合同业绩档案数据
                    hcBeforeRequest: function (searchObj) {
                        searchObj.resouce_type = 4;
                    }
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

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