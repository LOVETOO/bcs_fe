/**
 * 历史费用数据查询
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};

                /*获取数据模型*/
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'fee_year',
                            headerName: '预算年度'
                        }, {
                            headerName: "部门",
                            children: [
                                {
                                    field: 'org_code',
                                    headerName: '部门编码'
                                }
                                , {
                                    field: 'org_name',
                                    headerName: '部门名称'
                                }
                            ]
                        }, {
                            headerName: '品类',
                            field: 'crm_entid',
                            hcDictCode: 'crm_entid'
                        }
                        , {
                            headerName: '费用类别/项目',
                            children: [
                                {
                                    field: 'object_code',
                                    headerName: '编码'
                                }
                                , {
                                    field: 'object_name',
                                    headerName: '名称'

                                }, {
                                    field: 'object_type',
                                    headerName: '类型',
                                    type: '词汇',
                                    cellEditorParams: {
                                        names: ['费用类别', '费用项目'],
                                        values: [1, 2]
                                    }
                                }
                            ]
                        },
                        {
                            headerName: '会计核算科目',
                            children: [
                                {
                                    field: 'subject_code',
                                    headerName: '科目编码'
                                },
                                {
                                    field: 'subject_name',
                                    headerName: '科目名称'
                                }
                            ]
                        },
                        {
                            headerName: "预算类别",
                            children: [
                                {
                                    field: 'bud_type_code',
                                    headerName: '预算类别编码'
                                }, {
                                    field: 'bud_type_name',
                                    headerName: '预算类别名称'
                                }
                            ]
                        }
                        ,
                        {
                            headerName: '前年费用数据',
                            children: [
                                {
                                    field: 'lyear_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'lyear_fee_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            headerName: '去年前三季度累计费用数据',
                            children: [
                                {
                                    field: 'tyear1_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear1_fee_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }, {
                            headerName: '去年第四季度预计费用数据',
                            children: [
                                {
                                    field: 'tyear2_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear2_fee_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }, {
                            headerName: '去年费用数据',
                            children: [
                                {
                                    field: 'tyear3_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额'
                                }
                                , {
                                    field: 'tyear3_fee_rate',
                                    headerName: '费用率',
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '备注说明'
                        }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        angular.extend(searchObj, $scope.data.currItem);
                        searchObj.search_flag = 1;
                    },
                    hcAfterRequest: function (response) {
                        $scope.calSum(response);
                    }
                };


                $scope.gridOptions.hcClassId = 'fin_feedata_head';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.deptObj = {
                    afterOk: function (result) {
                        getCurrItem().org_id = result.dept_id;
                        getCurrItem().org_code = result.dept_code;
                        getCurrItem().org_name = result.dept_name;
                    }
                };

                $scope.subjectObj = {
                    afterOk: function (result) {
                        getCurrItem().subject_id = result.gl_account_subject_id;
                        getCurrItem().subject_code = result.km_code;
                        getCurrItem().subject_name = result.km_name;
                    }
                };

                $scope.budTypeObj = {
                    afterOk: function (result) {
                        getCurrItem().bud_type_id = result.bud_type_id;
                        getCurrItem().bud_type_code = result.bud_type_code;
                        getCurrItem().bud_type_name = result.bud_type_name;
                    }
                };

                $scope.feeObj = {
                    classId: "fin_fee_header",
                    title: "费用类别/项目查询",
                    postData: {flag: 3},
                    gridOptions: {
                        "columnDefs": [
                            {
                                headerName: "编码",
                                field: "object_code"
                            }, {
                                headerName: "名称",
                                field: "object_name"
                            }, {
                                headerName: "类型",
                                field: "object_type_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        getCurrItem().object_id = result.object_id;
                        getCurrItem().object_code = result.object_code;
                        getCurrItem().object_name = result.object_name;
                        getCurrItem().object_type = result.object_type;
                        getCurrItem().object_type_name = result.object_type_name;
                    }
                };


                //添加按钮
                $scope.toolButtons = {

                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },

                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }

                    }

                };

                // 查询
                $scope.search = function () {
                    return $scope.gridOptions.hcApi.search().then($scope.calSum);
                }

                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function (response) {
                    if (response) {
                        getCurrItem().fin_feedata_heads = response.fin_feedata_heads;
                    } else {
                        getCurrItem().fin_feedata_heads = $scope.gridOptions.hcApi.getRowData();
                    }
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            lyear_fee_amt: numberApi.sum(getCurrItem().fin_feedata_heads, 'lyear_fee_amt'),
                            tyear1_fee_amt: numberApi.sum(getCurrItem().fin_feedata_heads, 'tyear1_fee_amt'),
                            tyear2_fee_amt: numberApi.sum(getCurrItem().fin_feedata_heads, 'tyear2_fee_amt'),
                            tyear3_fee_amt: numberApi.sum(getCurrItem().fin_feedata_heads, 'tyear3_fee_amt')
                        }
                    ]);
                }

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