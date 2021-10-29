/**
 * 工程预算编制 属性表
 * 2019/6/24
 *  shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                //定义tab页
                $scope.tabs.contract = {
                    title: '合同信息'
                };

                //可否编辑
                function editable(args) {
                    return ($scope.data.currItem.stat == 1 && !args.node.rowPinned);
                }

                //主表表格定义
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'bud_type_name',
                        headerName: '预算类别',
                        width: 130,
                        hcRequired: true,
                        editable: function (args) {
                            return editable(args);
                        },
                        onCellDoubleClicked: function (args) {
                            if (args.node.rowPinned) {
                                return;
                            }
                            $scope.choosefinbudType(args);
                        }
                    }, {
                        field: 'fee_code',
                        headerName: '费用项目/类别编码',
                        hcRequired: true,
                        editable: function (args) {
                            return editable(args);
                        },
                        onCellDoubleClicked: function (args) {
                            if (args.node.rowPinned) {
                                return;
                            }
                            $scope.chooseFeeCode(args);
                        }
                    }, {
                        field: 'fee_name',
                        headerName: '费用项目/类别名称'
                    }, {
                        field: 'bud_amount',
                        headerName: '预算金额(元)',
                        type: '金额',
                        width: 130,
                        hcRequired: true,
                        editable: function (args) {
                            return editable(args);
                        },
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue) {
                                return;
                            } else if (numberApi.toNumber(args.data.bud_amount, -1) == -1) {
                                swalApi.info("请输入数字");
                                args.data.bud_amount = '';
                            }
                            calSum();
                        }
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        width: 400,
                        editable: function (args) {
                            return editable(args);
                        }
                    }]
                };

                //合同信息 表格定义
                $scope.gridOptions_contract = {

                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码',
                        width: 156
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称',
                        width: 463
                    }, {
                        field: 'signed_date',
                        headerName: '签订日期',
                        type: '日期',
                        width: 90
                    }, {
                        field: 'expiry_date',
                        headerName: '有效截止日期',
                        type: '日期',
                        width: 120
                    }, {
                        field: 'contract_amt',
                        headerName: '合同金额(元)',
                        type: '金额',
                        width: 120
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 工程项目 查询
                 */
                $scope.commonSearchSettingOfEpmProject = {
                    postData: {
                        search_flag: 120
                    },
                    // 过滤已编制的的工程项目
                    sqlWhere: "not exists (select 1 from epm_proj_fin_bud_head ep where ep.project_id = t.project_id) and stat = 5",
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;// 工程名称

                        //带出 合同信息
                        return requestApi.post({
                            classId: 'epm_project_contract',
                            action: 'search',
                            data: {
                                project_id: result.project_id
                            }
                        }).then(function (response) {
                            $scope.data.currItem.contract_id = response.contract_id;
                            $scope.data.currItem.contract_code = response.contract_code;
                            $scope.data.currItem.contract_name = response.contract_name;// 合同名称

                            $scope.data.currItem.signed_date = response.signed_date;// 签订日期
                            $scope.data.currItem.contract_amt = response.contract_amt;// 合同金额
                            $scope.gridOptions_contract.hcApi.setRowData(response.epm_project_contracts);
                            $scope.data.currItem.epm_project_contracts = response.epm_project_contracts;
                        });
                    }
                };

                /**
                 *  部门查询
                 */
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.dept_id;
                        $scope.data.currItem.org_code = result.dept_code;
                        $scope.data.currItem.org_name = result.dept_name;
                    }
                };

                /**
                 * 项目经理 查询
                 */
                $scope.commonSearchSettingOfProjectManager = {
                    sqlWhere: 'actived = 2 ',// 2-有效
                    afterOk: function (result) {
                        $scope.data.currItem.project_manager = result.username;
                    }
                };

                /**
                 *  选择预算类型
                 */
                $scope.choosefinbudType = function (args) {
                    var bud_type_id = args.data.bud_type_id;
                    var fee_code = args.data.fee_code;
                    $modal.openCommonSearch({
                        classId: 'fin_bud_type_header',
                        postData: {
                            flag: 6
                        },
                        sqlWhere: 'fin_bud_type_header.usable = 2 ',
                        action: 'search',
                        title: "预算类别",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "预算类别编码",
                                    field: "bud_type_code"
                                }, {
                                    headerName: "预算类别名称",
                                    field: "bud_type_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            //若更改预算类别，则清空费用项目
                            if (fee_code != '' && fee_code != undefined) {
                                if (bud_type_id != response.bud_type_id) {
                                    args.data.fee_id = 0;
                                    args.data.fee_code = '';
                                    args.data.fee_name = '';
                                }
                            }
                            $scope.data.currItem.bud_type_id = response.bud_type_id;
                            args.data.bud_type_id = response.bud_type_id;
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 选择项目编码
                 */
                $scope.chooseFeeCode = function (args) {
                    if ($scope.gridOptions.hcApi.getFocusedData().bud_type_id == '' || $scope.gridOptions.hcApi.getFocusedData().bud_type_id == undefined) {
                        return swalApi.info("请先选择预算类别");
                    }
                    var data = $scope.gridOptions.hcApi.getRowData();
                    $modal.openCommonSearch({
                        classId: 'fin_bud_type_header',
                        dataRelationName: 'fin_bud_type_lineoffin_bud_type_headers',
                        postData: {
                            bud_type_id: $scope.gridOptions.hcApi.getFocusedData().bud_type_id,
                            flag: 7
                        },
                        action: 'select',
                        title: "费用项目/类别",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "费用项目/类别编码",
                                    field: "object_code"
                                }, {
                                    headerName: "费用项目/类别名称",
                                    field: "object_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (response) {
                            if ($scope.data.currItem.epm_proj_fin_bud_lines.length <= 1) {
                                $scope.data.currItem.fee_object_type = response.object_type;
                                $scope.data.currItem.fee_id = response.object_id;
                                args.data.fee_code = response.object_code;
                                args.data.fee_name = response.object_name;
                                args.api.refreshView();//刷新网格视图
                                return;
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].bud_type_id == response.bud_type_id) {
                                        if (data[i].fee_code == response.object_code) {
                                            swalApi.info("费用类别或项目【" + response.object_code + "】已存在，请重新选择");
                                            args.data.fee_code = '';
                                            args.data.fee_name = '';
                                            return;
                                        }
                                    }
                                }
                                $scope.data.currItem.fee_object_type = response.object_type;
                                $scope.data.currItem.fee_id = response.object_id;
                                args.data.fee_code = response.object_code;
                                args.data.fee_name = response.object_name;
                                args.api.refreshView();//刷新网格视图
                            }
                        });
                };

                /**
                 * 计算合计数据
                 */
                function calSum() {
                    //合计预算金额
                    $scope.data.currItem.total_bud_amount
                        = numberApi.sum($scope.data.currItem.epm_proj_fin_bud_lines, 'bud_amount');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            bud_amount: numberApi.sum($scope.data.currItem.epm_proj_fin_bud_lines, 'bud_amount'),//预算金额
                        }
                    ]);
                };

                /**
                 * 标签页改变事件
                 * @param params
                 */
                $scope.onTabChange = function (params) {
                    $q.when(params)
                        .then($scope.hcSuper.onTabChange)
                        .then(function () {
                            if (params.id == "base") {
                                $scope.footerLeftButtons.add_line.hide = false;
                                $scope.footerLeftButtons.del_line.hide = false;
                            } else {
                                $scope.footerLeftButtons.add_line.hide = true;
                                $scope.footerLeftButtons.del_line.hide = true;
                            }

                        });
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.org_name = userbean.loginuserifnos[0].org_name;
                    $scope.data.currItem.org_code = userbean.loginuserifnos[0].org_id;
                    $scope.data.currItem.epm_proj_fin_bud_lines = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_proj_fin_bud_lines);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_proj_fin_bud_lines);
                    $scope.gridOptions_contract.hcApi.setRowData(bizData.epm_project_contracts);
                    calSum();
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                //增加行
                $scope.footerLeftButtons.add_line = {
                    icon: 'iconfont hc-add',
                    click: function () {
                        return $scope.add_line && $scope.add_line();
                    }
                };

                //删除行
                $scope.footerLeftButtons.del_line = {
                    icon: 'iconfont hc-reduce',
                    click: function () {
                        return $scope.del_line && $scope.del_line();
                    }
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function (data) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.epm_proj_fin_bud_lines.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_proj_fin_bud_lines);
                    calSum();
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_proj_fin_bud_lines.splice(idx, 1);
                        if ($scope.data.currItem.epm_proj_fin_bud_lines.length == 0) {
                            $scope.data.currItem.epm_proj_fin_bud_lines.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_proj_fin_bud_lines);
                    }
                    calSum();
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;
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