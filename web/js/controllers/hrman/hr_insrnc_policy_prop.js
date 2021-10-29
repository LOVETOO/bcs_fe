/**
 * 社保政策设置
 * 2019/4/22.
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi) {

        var HrInsrncPolicyProp = [
            '$scope', '$stateParams',
            function ($scope, $stateParams) {


                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.gridOptions = {
                    PinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'is_bao',
                        headerName: '',
                        editable: true,
                        type: '是否'
                    }, {
                        field: 'insrnc_type_name',
                        headerName: '政策类型'
                    }, {
                        field: 'avg_salary',
                        headerName: '缴费工资',
                        type: '金额',
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue) {
                                return;
                            }
                            ;
                            qtyChange(args);
                            $scope.calSum();
                        }
                    }, {
                        field: 'company_rate',
                        headerName: '公司缴纳比例(%)',
                        type: '百分比',
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue) {
                                return;
                            }
                            ;
                            qtyChange(args);
                            $scope.calSum();
                        }
                    }, {
                        field: 'personal_rate',
                        headerName: '个人缴纳比例(%)',
                        type: '百分比',
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue) {
                                return;
                            }
                            ;
                            qtyChange(args);
                            $scope.calSum();
                        }
                    }, {
                        field: 'sum_rate',
                        headerName: '合计缴纳比例(%)',
                        type: '百分比'
                    }, {
                        field: 'company_money',
                        type: '金额',
                        headerName: '公司纳额'
                    }, {
                        field: 'personal_money',
                        type: '金额',
                        headerName: '个人纳额'
                    }, {
                        field: 'sum_money',
                        type: '金额',
                        headerName: '合计缴纳额'
                    }, {
                        field: 'line_remark',
                        headerName: '备注',
                        editable: true
                    }]
                };


                /*----------------------------------通用查询-------------------------------------------*/

                //社保组编码
                $scope.commonSearchOfInsrncGroup = {
                    afterOk: function (result) {
                        $scope.data.currItem.hr_insrnc_group_id = result.hr_insrnc_group_id;
                        $scope.data.currItem.insrnc_group_code = result.insrnc_group_code;
                        $scope.data.currItem.insrnc_group_name = result.insrnc_group_name;
                    }
                };

                /*----------------------------------计算金额-------------------------------------------*/

                //合计纳额
                function setAmountData(item) {
                    if (item.avg_salary != null && item.avg_salary > 0 && item.company_rate != null && item.company_rate > 0) {
                        item.company_money = numberApi.mutiply(item.avg_salary, item.company_rate);//公司纳额
                    }
                    if (item.avg_salary != null && item.avg_salary > 0 && item.personal_rate != null && item.personal_rate > 0) {
                        item.personal_money = numberApi.mutiply(item.avg_salary, item.personal_rate);//个人纳额
                    }
                    item.sum_money = numberApi.sum(item.company_money, item.personal_money);//合计纳额
                    item.sum_rate = numberApi.sum(item.personal_rate, item.company_rate);//合计缴纳比例
                    return item;
                }


                //缴费工资 比例发生改变 进行合计
                function qtyChange(args) {
                    setAmountData(args.data);
                    setTotalAmt();
                }


                //计算合计总纳额
                function setTotalAmt() {
                    $scope.data.currItem.total_personal_money = numberApi.sum($scope.data.currItem.hr_insrnc_policys, 'personal_money');//个人总纳额
                    $scope.data.currItem.total_company_money = numberApi.sum($scope.data.currItem.hr_insrnc_policys, 'company_money');//公司总纳额
                    $scope.data.currItem.total_sum_money = numberApi.sum($scope.data.currItem.hr_insrnc_policys, 'sum_money');//合计总纳额
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            personal_money: numberApi.sum($scope.data.currItem.hr_insrnc_policy_lineofhr_insrnc_policys, 'personal_money'),
                            company_money: numberApi.sum($scope.data.currItem.hr_insrnc_policy_lineofhr_insrnc_policys, 'company_money'),
                            sum_money: numberApi.sum($scope.data.currItem.hr_insrnc_policy_lineofhr_insrnc_policys, 'sum_money')
                        }
                    ]);
                };
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //明细
                    bizData.hr_insrnc_policy_lineofhr_insrnc_policys = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.hr_insrnc_policy_lineofhr_insrnc_policys);
                    policy(bizData).then(function (val) {
                        add_insrnc_policy(val, bizData);
                    });
                    $scope.calSum();
                    var time = new Date();
                    var year = time.getFullYear();
                    var month = time.getMonth() + 1;
                    if (month < 10) {
                        month = "0" + month;
                    }
                    bizData.decimal_scale = 2;
                    bizData.start_month = year + "-" + month;
                };

                //获取社保类型
                function policy(bizData) {
                    return requestApi.post({
                        classId: 'hr_insrnc_type',
                        action: 'search',
                        data: {}
                    })
                        .then(function (response) {
                            return response.hr_insrnc_types;
                        })
                };
                //验证表头信息是否填完
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    var arr = [];
                    $scope.data.currItem.hr_insrnc_policy_lineofhr_insrnc_policys.forEach(function (sho) {
                        if (sho.is_bao == 2) {
                            arr.push(sho);
                        }
                    });
                    if (arr.length < 1) {
                        invalidBox.push("请选择社保类型");
                    }
                    ;
                    if ($scope.data.currItem.remark != undefined && $scope.data.currItem.remark.length >= 1024) {
                        invalidBox.push("备注不能超过1024字");
                    }
                    arr.forEach(function (val) {
                        if (val.avg_salary == null || val.avg_salary == "" || val.avg_salary == undefined || val.avg_salary == 0) {
                            invalidBox.push("所选【" + val.insrnc_type_name + "】缴费工资不能为空");
                        }
                    });
                    $scope.data.currItem.hr_insrnc_policy_lineofhr_insrnc_policys = arr;
                    return invalidBox;
                };
                $scope.saveBizData = function (saveData) {
                    var row = [];
                    var data = $scope.data.currItem.hr_insrnc_policy_lineofhr_insrnc_policys;
                    data.forEach(function (sho) {
                        if (sho.is_bao == 2) {
                            row.push(sho);
                        }
                    });
                    row.forEach(function (val) {
                        if (val.avg_salary != null && val.avg_salary > 0) {
                            if (val.company_rate == null || val.company_rate == undefined || val.company_rate == 0) {
                                val.company_rate = 0;
                                val.company_money = 0;
                            }
                            if (val.personal_rate == null || val.personal_rate == undefined || val.personal_rate == 0) {
                                val.personal_rate = 0;
                                val.personal_money = 0;
                            }
                        }
                    });
                    $scope.hcSuper.saveBizData(saveData);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    policy(bizData).then(function (val) {
                        add_insrnc_policy(val, bizData);
                        //设置明细
                        $scope.gridOptions.hcApi.setRowData(bizData.hr_insrnc_policy_lineofhr_insrnc_policys);
                    });
                    $scope.calSum();
                };

                //根据社保类型新增行
                function add_insrnc_policy(args, bizData) {
                    var data = bizData.hr_insrnc_policy_lineofhr_insrnc_policys;
                    var a = 0;
                    for (var i = 0; i < args.length; i++) {
                        bizData.hr_insrnc_policy_lineofhr_insrnc_policys.forEach(function (val) {

                            if (val.insrnc_type_name == args[i].insrnc_type_name) {
                                a = 1;
                                val.is_bao = 2;
                            }
                        });
                        var newLine = {
                            insrnc_type_name: args[i].insrnc_type_name,
                            hr_insrnc_type_id: args[i].hr_insrnc_type_id
                        };
                        if (a == 1) {
                            a = 0;
                        } else {
                            data.push(newLine);
                        }
                    }
                    $scope.gridOptions.hcApi.setRowData(data);
                }


            }
        ];
        return controllerApi.controller({
            module: module,
            controller: HrInsrncPolicyProp
        });

    })