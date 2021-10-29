/**
 * 预算调整 （新)-属性页
 * 2019-02-27
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'numberApi', 'strApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, numberApi, strApi, dateApi) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$modal',
                //控制器函数
                function ($scope, $modal) {

                    /*-------------------数据定义开始------------------------*/
                    $scope.LineName = 'fin_bud_adjust_new_lines';

                    $scope.editable = function (args) {
                        var flag = true;
                        if ($scope.data.currItem.adjust_type == 2 && $scope.data.currItem.stat == 1) {
                            $scope.data.currItem[$scope.LineName].forEach(function (v) {
                                if (args.data.line_no == v.p_line_no) {
                                    flag = false;
                                    return false;
                                }
                            });
                        }
                        if (flag && $scope.data.currItem.stat == 1 && !(args.data.p_line_no && args.data.p_line_no > 0))
                            return true;

                        return false;
                    }
                    /*-------------------数据定义结束------------------------*/

                    /*-------------------网格定义 开始------------------------*/

                    $scope.gridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                field: 'org_name',
                                headerName: '调整部门',
                                editable: $scope.editable,
                                hcRequired: true,
                                onCellDoubleClicked: function (args) {
                                    if ($scope.editable(args)) {
                                        $scope.chooseOrg(args);
                                    }
                                }
                            },
                            {
                                field: 'bud_type_name',
                                headerName: '预算类别',
                                hcRequired: true,
                                editable: $scope.editable,
                                onCellDoubleClicked: function (args) {
                                    if ($scope.editable(args)) {
                                        $scope.chooseFinType(args);
                                    }
                                }
                            },
                            {
                                headerName: '费用类别/项目',
                                children: [
                                    {
                                        field: 'object_code',
                                        headerName: '编码',
                                        editable: $scope.editable,
                                        hcRequired: true,
                                        onCellDoubleClicked: function (args) {
                                            if ($scope.editable(args)) {
                                                $scope.searchFeeObject(args);
                                            }
                                        }
                                    },
                                    {
                                        field: 'object_name',
                                        headerName: '名称'
                                    }
                                ]
                            },
                            {
                                field: 'subject_name',
                                headerName: '会计核算科目名称'
                            },
                            {
                                field: 'crm_entid',
                                headerName: '品类',
                                editable: $scope.editable,
                                hcDictCode: 'crm_entid',
                                width: 100,
                                onCellValueChanged: function (args) {
                                    $scope.getBud(args);
                                }
                            },
                            {
                                field: 'dname',
                                headerName: '调整期间',
                                hcRequired: true,
                                //editable: $scope.editable,
                                //onCellDoubleClicked: searchBudPeriod
                            },
                            {
                                field: 'before_bud_amt',
                                headerName: '当前可调整预算',
                                type: '金额'
                            },
                            {
                                field: 'adjust_amt',
                                headerName: '本次调整金额',
                                editable: $scope.editable,
                                type: '金额',
                                hcRequired: true,
                                onCellValueChanged: function (args) {
                                    return checkGridMoneyInput(args, []);
                                }
                            },
                            {
                                field: 'note',
                                headerName: '调整说明',
                                editable: $scope.editable,
                                hcRequired: true
                            }
                        ]
                    }

                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    /*-------------------网格定义 结束------------------------*/

                    /**
                     * 新增时初始化数据
                     */
                    $scope.newBizData = function (bizData) {
                        $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                        bizData.bud_year = new Date().getFullYear();
                        bizData.stat = 1;
                        bizData.adjust_type = 1;
                        bizData.create_time = dateApi.now();
                        bizData[$scope.LineName] = [{}];
                        $scope.gridOptions.hcApi.setRowData(bizData[$scope.LineName]);
                    };

                    /**
                     * 设置数据
                     */
                    $scope.setBizData = function (bizData) {
                        $scope.hcSuper.setBizData(bizData);
                        $scope.gridOptions.hcApi.setRowData(bizData[$scope.LineName]);
                    };

                    /*-------------------通用查询开始------------------------*/
                    /**
                     * 查部门
                     */
                    $scope.chooseOrg = function (args) {
                        if (!args.colDef.editable) {
                            return;
                        }
                        $modal.openCommonSearch({
                                classId: 'dept',
                                sqlWhere: " isfeecenter = 2"
                            })
                            .result//响应数据
                            .then(function (result) {
                                args.data.org_id = result.dept_id;
                                args.data.org_code = result.dept_code;
                                args.data.org_name = result.dept_name;
                                return args;
                            }).then($scope.getBud);
                    };

                    //查询预算期间
                    $scope.searchBudPeriod = function (args) {
                        $modal.openCommonSearch({
                                classId: 'fin_bud_period_header',
                                postData: {
                                    period_year: $scope.data.currItem.bud_year,
                                    period_type: args.data.period_type,
                                    flag: 3
                                },
                                action: 'search',
                                title: "预算期间",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "预算期间名称",
                                        field: "dname"
                                    }, {
                                        headerName: "开始日期",
                                        field: "start_date"
                                    }, {
                                        headerName: "结束日期",
                                        field: "end_date"
                                    }, {
                                        headerName: "预算期间描述",
                                        field: "description"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                args.data.period_line_id = result.period_line_id;
                                args.data.dname = result.dname;
                                return args;
                            }).then($scope.getBud);
                    };

                    //查预算类别
                    $scope.chooseFinType = function (args) {
                        $modal.openCommonSearch({
                                classId: 'fin_bud_type_header',
                                postData: {},
                                sqlWhere: " Fin_Bud_Type_Header.Usable=2 and Fin_Bud_Type_Header.Org_Level<>5 ",
                                action: 'search',
                                title: "预算类别",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "类别名称",
                                        field: "bud_type_name"
                                    }, {
                                        headerName: "类别编码",
                                        field: "bud_type_code"
                                    }, {
                                        headerName: "费用层级",
                                        field: "fee_type_level"
                                    }, {
                                        headerName: "预算期间类别",
                                        field: "period_type"
                                    }, {
                                        headerName: "描述",
                                        field: "description"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                //重新刷新费用项目或类别
                                if (args.data.bud_type_id != result.bud_type_id) {
                                    args.data.object_id = 0;
                                    args.data.object_name = '';
                                    args.data.object_code = '';
                                    args.data.object_type = '';
                                    args.data.subject_name = '';
                                    args.data.subject_no = '';
                                    args.data.subject_id = 0;
                                }
                                args.data.bud_type_id = result.bud_type_id;//预算类别数据
                                args.data.bud_type_code = result.bud_type_code;
                                args.data.bud_type_name = result.bud_type_name;
                                args.data.period_type = result.period_type;
                                args.data.fee_property = result.fee_property;//1变动费用 2固定费用
                                return args;
                            })
                            //获取期间
                            .then(getPeriod)
                            //获取预算
                            .then($scope.getBud);
                    };

                    /**
                     * 查询费用项目
                     */
                    $scope.searchFeeObject = function (args) {
                        $modal.openCommonSearch({
                                classId: 'fin_bud_type_line_obj',
                                postData: {
                                    bud_type_id: args.data.bud_type_id,
                                    flag: 1
                                },
                                action: 'search',
                                title: "费用项目/类别查询",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "费用项目/类别编码",
                                        field: "object_code"
                                    }, {
                                        headerName: "费用项目/类别名称",
                                        field: "object_name"
                                    }, {
                                        headerName: "费用类别",
                                        field: "object_type_name"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                args.data.object_id = result.object_id;
                                args.data.object_name = result.object_name;
                                args.data.object_code = result.object_code;
                                args.data.object_type = result.object_type;
                                args.data.subject_name = result.subject_name;
                                args.data.subject_no = result.subject_no;
                                args.data.subject_id = result.subject_id;
                                return args;
                            }).then($scope.getBud);
                    };

                    /**
                     当调整类型≠“部门内同科目跨期间调整”，则
                     固定费用：从”预算查询表“是否结转为否的第一个预算期间，自动带出；
                     变动费用：从已审核的”预算释放“最大的预算期间，自动带出；
                     （例如：当做预算调整时，已审核的预算释放单期间有“S201901、S201902、S201903”，则自动带出的调整起始期间为“S201903”）
                     */

                    function getPeriod(args) {
                        //变动费用
                        if (args.data.fee_property == 1) {
                            if (args.data.org_id && args.data.period_type && $scope.data.currItem.bud_year) {
                                var postData = {
                                    dept_id: args.data.org_id,
                                    period_type: args.data.period_type,
                                    bud_year: $scope.data.currItem.bud_year
                                };
                                return requestApi.post('fin_bud_release_head', 'getmaxperiod', postData)
                                    .then(function (response) {
                                        args.data.period_line_id = response.period_line_id;
                                        args.data.dname = response.dname;
                                        return args;
                                    });
                            } else {
                                return args;
                            }
                        }
                        //固定费用
                        else if (args.data.fee_property == 2) {
                            var postData = {
                                period_year: $scope.data.currItem.bud_year,
                                period_type: args.data.period_type,
                                flag: 3
                            };
                            return requestApi.post('fin_bud_period_header', 'search', postData)
                                .then(function (response) {
                                    if (response.fin_bud_period_headers.length) {
                                        args.data.period_line_id = response.fin_bud_period_headers[0].period_line_id;
                                        args.data.dname = response.fin_bud_period_headers[0].dname;
                                    }
                                    return args;
                                });
                        } else {
                            return args;
                        }
                    }

                    //获取预算id
                    $scope.getBud = function (args) {
                        if ($scope.data.currItem.adjust_type == 2) {
                            if (args.data.org_id > 0 && args.data.bud_type_id > 0 && args.data.object_id > 0
                                && args.data.period_line_id > 0) {
                                return requestApi.post("fin_bud", "getbudid", {
                                    "org_id": args.data.org_id,
                                    "bud_type_id": args.data.bud_type_id,
                                    "object_id": args.data.object_id,
                                    "crm_entid": args.data.crm_entid,
                                    "period_line_id": args.data.period_line_id,
                                    "dname": args.data.dname
                                }).then(function (data) {
                                    if (data.no_bud == 1) {
                                        swalApi.info("所调整的预算没有编制");
                                    }
                                    args.data.bud_id = data.bud_id;
                                    args.data.before_bud_amt = 0;
                                    return args;
                                }).then(function (args) {
                                    args.api.refreshView();
                                });
                            }
                        } else {
                            if (args.data.org_id > 0 && args.data.bud_type_id > 0 && args.data.object_id > 0
                                && args.data.period_line_id > 0) {
                                return requestApi.post("fin_bud", "getbudid", {
                                    "org_id": args.data.org_id,
                                    "bud_type_id": args.data.bud_type_id,
                                    "object_id": args.data.object_id,
                                    "crm_entid": args.data.crm_entid,
                                    "period_line_id": args.data.period_line_id,
                                    "dname": args.data.dname
                                }).then(function (data) {
                                    if (data.no_bud == 1) {
                                        swalApi.info("所调整的预算没有编制");
                                    }
                                    args.data.bud_id = data.bud_id;
                                    return args;
                                }).then(getCanUseBud).then(function (args) {
                                    args.api.refreshView();
                                });
                            }
                        }

                        args.api.refreshView();
                        return args;

                    }

                    /**
                     * 取预算
                     */
                    function getCanUseBud(args) {
                        if (args.data.bud_id > 0) {
                            var postData = {
                                bud_id: args.data.bud_id,
                                flag: $scope.data.currItem.adjust_type
                            };
                            return requestApi.post('fin_bud', 'getcanuseamt', postData).then(
                                function (response) {
                                    args.data.before_bud_amt = response.canuse_amt;
                                    return args;
                                });
                        } else {
                            args.data.before_bud_amt = 0;
                            return args;
                        }
                    }

                    function getCanUseBudv1(data) {
                        if (data.bud_id > 0) {
                            var postData = {
                                bud_id: data.bud_id,
                                flag: $scope.data.currItem.adjust_type
                            };
                            return requestApi.post('fin_bud', 'getcanuseamt', postData).then(
                                function (response) {
                                    data.before_bud_amt = response.canuse_amt;
                                    return data;
                                });
                        } else {
                            return data;
                        }
                    }

                    $scope.getPeriod = function (data) {
                        var postData = {
                            period_year: $scope.data.currItem.bud_year,
                            period_type: data.period_type,
                            period_line_id: data.period_line_id,
                            flag: 3
                        };
                        return requestApi.post('fin_bud_period_header', 'search', postData)
                            .then(function (response) {
                                if (response.fin_bud_period_headers.length) {
                                    data.period_line_id = response.fin_bud_period_headers[0].period_line_id;
                                    data.dname = response.fin_bud_period_headers[0].dname;
                                }
                                return data;
                            });
                    }

                    $scope.getBudv1 = function (data) {
                        if (data.org_id > 0 && data.bud_type_id > 0 && data.object_id > 0
                            && data.period_line_id > 0) {
                            return requestApi.post("fin_bud", "getbudid", {
                                "org_id": data.org_id,
                                "bud_type_id": data.bud_type_id,
                                "object_id": data.object_id,
                                "crm_entid": data.crm_entid,
                                "period_line_id": data.period_line_id,
                                "dname": data.dname
                            }).then(function (R) {
                                if (data.no_bud == 1) {
                                    swalApi.info("所调整的预算没有编制");
                                }
                                data.bud_id = R.bud_id;
                                return data;
                            }).then(getCanUseBudv1);
                        } else {
                            return data;
                        }
                    }
                    /*-------------------通用查询结束---------------------*/

                    /*------------------- 按钮定义 ---------------------*/
                    /**
                     * 底部左边按钮隐藏事件
                     * @returns {boolean}
                     */
                    $scope.footerLeftButtonsHide = function () {
                        if ($scope.data.currItem.stat != 1)
                            return true;
                        return false;
                    };
                    $scope.addRow = function () {
                        $scope.gridOptions.api.stopEditing();
                        if ($scope.data.currItem.adjust_type == 2) {
                            var msg = [];
                            $scope.hcSuper.validCheck(msg);
                            if (msg.length > 0) {
                                return swalApi.info(msg);
                            }
                            var data = $scope.data.currItem[$scope.LineName];
                            var newLine = {line_no: data.length + 1};
                            if (data.length % 2 == 0) {
                                data.push(newLine);
                                $scope.gridOptions.hcApi.setRowData(data);
                                $scope.gridOptions.hcApi.setFocusedCell(data.length - 1, 'seq');
                            } else {
                                angular.extend(newLine, data[data.length - 1]);
                                newLine.p_line_no = newLine.line_no;
                                newLine.line_no = newLine.line_no + 1;
                                newLine.adjust_amt = numberApi.sub(0, newLine.adjust_amt);
                                newLine.before_bud_amt = 0;
                                $scope.getPeriod(newLine).then($scope.getBudv1).then(function () {
                                    data.push(newLine);
                                    $scope.gridOptions.hcApi.setRowData(data);
                                    $scope.gridOptions.hcApi.setFocusedCell(data.length - 1, 'seq');
                                    countSum();
                                });
                            }
                        } else {
                            var data = $scope.data.currItem[$scope.LineName];
                            data.push({});
                            $scope.gridOptions.hcApi.setRowData(data);
                            //$scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'seq');

                        }
                    }


                    $scope.deleteRow = function () {
                        var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        if (index < 0) {
                            return swalApi.info("请选中要删除的行");
                        }
                        //函数区域
                        var rowData = $scope.gridOptions.hcApi.getRowData();
                        if (index == (rowData.length - 1)) {
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                        }
                        if ($scope.data.currItem.adjust_type == 2) {
                            var d = rowData[index];
                            if (d.p_line_no && d.p_line_no > 0) {
                                rowData.splice(index, 1);
                            } else {
                                rowData.splice(index, 1);
                                rowData.forEach(function (v, i) {
                                    if (d.line_no == v.p_line_no) {
                                        rowData.splice(i, 1);
                                        return false;
                                    }
                                });
                            }
                        } else {
                            if (rowData.length == 0) {
                                rowData.push({});
                            } else {
                                rowData.splice(index, 1);
                            }
                        }
                        $scope.gridOptions.hcApi.setRowData(rowData);
                        $scope.data.currItem[$scope.LineName] = rowData;
                        countSum();

                    }

                    $scope.footerLeftButtons.addRow.hide = $scope.footerLeftButtonsHide;
                    $scope.footerLeftButtons.deleteRow.hide = $scope.footerLeftButtonsHide;
                    $scope.footerLeftButtons.addRow.click = $scope.addRow;
                    $scope.footerLeftButtons.deleteRow.click = $scope.deleteRow;

                    /**=========================== 逻辑计算、 校验===================**/

                    /**
                     * 保存前校验
                     * @param bizdata
                     */
                    $scope.validCheck = function (invalidBox) {
                        $scope.hcSuper.validCheck(invalidBox);
                        var adjust_type = $scope.data.currItem.adjust_type;
                        var groups = {};
                        $scope.data.currItem[$scope.LineName].forEach(function (row, rowid) {
                            //部门内跨科目调整
                            if (adjust_type == 1) {
                                var key = "" + row.org_id + row.period_line_id;
                                if (groups[key]) {
                                    groups[key].push(row);
                                } else {
                                    groups[key] = [];
                                    groups[key].push(row);
                                }
                            }
                            //部门外同科目调整
                            if (adjust_type == 3) {
                                var key = "" + row.object_id + row.period_line_id;
                                if (groups[key]) {
                                    groups[key].push(row);
                                } else {
                                    groups[key] = [];
                                    groups[key].push(row);
                                }
                            }
                            //部门外不同科目调整
                            if (adjust_type == 4) {
                                var key = "" + row.period_line_id;
                                if (groups[key]) {
                                    groups[key].push(row);
                                } else {
                                    groups[key] = [];
                                    groups[key].push(row);
                                }
                            }

                            //部门外不同科目调整
                            if (adjust_type == 5) {
                                if (!numberApi.compare(row.adjust_amt, 0) > 0) { //年度预算外追加时必须大于0
                                    invalidBox.push('第' + (rowid + 1) + '调整金额必须大于零，请修改');
                                }
                            }

                            if (numberApi.compare(Math.abs(row.adjust_amt), row.before_bud_amt) > 0 && adjust_type != 5) { //年度预算外追加时 不校验

                                if (adjust_type != 2) {
                                    invalidBox.push('第' + (rowid + 1) + '调整金额必须小于等于当前可调整预算，请修改');
                                } else if ((rowid + 1) % 2 == 0 && adjust_type == 2) {
                                    invalidBox.push('第' + (rowid + 1) + '调整金额必须小于等于当前可调整预算，请修改');
                                }
                            }

                            if (numberApi.compare(row.adjust_amt, 0) == 0) { //年度预算外追加时 不校验
                                invalidBox.push('第' + (rowid + 1) + '调整金额不能为零，请修改');
                            }

                            if (numberApi.compare(row.bud_id, 0) == 0) { //年度预算外追加时 不校验
                                invalidBox.push('第' + (rowid + 1) + '尚未做预算编制，请修改');
                            }
                        });

                        Object.keys(groups).forEach(function (key) {
                            var ar = groups[key];
                            if (adjust_type == 1) {
                                var sum = 0, obj_id = ar[0].object_id;
                                ar.forEach(function (v, i) {
                                    sum = numberApi.sum(sum, v.adjust_amt);
                                    if (obj_id == v.object_id && i > 0) {
                                        invalidBox.push('调整部门为' + ar[0].org_name + " 调整月度为" + ar[0].dname + " 的所有明细行的费用类别/项目必须不一致");
                                    }
                                });
                                if (sum != 0) {
                                    invalidBox.push('调整部门为' + ar[0].org_name + " 调整月度为" + ar[0].dname + " 的所有明细行的调整金额汇总必须等于零");
                                }
                            }
                            if (adjust_type == 3) {
                                var sum = 0, org_id = ar[0].org_id;
                                ar.forEach(function (v, i) {
                                    sum = numberApi.sum(sum, v.adjust_amt);
                                    if (org_id == v.org_id && i > 0) {
                                        invalidBox.push('调整科目为' + ar[0].object_name + " 调整月度为" + ar[0].dname + " 的所有明细行的调整部门必须不一致");
                                    }
                                });
                                if (sum != 0) {
                                    invalidBox.push('调整科目为' + ar[0].object_name + " 调整月度为" + ar[0].dname + " 的所有明细行的调整金额汇总必须等于零");
                                }
                            }
                            if (adjust_type == 4) {
                                var sum = 0, obj_id = ar[0].object_id, org_id = ar[0].org_id;
                                ar.forEach(function (v, i) {
                                    sum = numberApi.sum(sum, v.adjust_amt);
                                    ;
                                    if (org_id == v.org_id && i > 0) {
                                        invalidBox.push("调整月度为" + ar[0].dname + " 的所有明细行的调整部门必须不一致");
                                    }
                                    if (obj_id == v.object_id && i > 0) {
                                        invalidBox.push("调整月度为" + ar[0].dname + " 的所有明细行的费用类别/项目必须不一致");
                                    }
                                });
                                if (sum != 0) {
                                    invalidBox.push("调整月度为" + ar[0].dname + " 的所有明细行的调整金额汇总必须等于零");
                                }
                            }
                        });

                    };
                    /**
                     * 调整类型改变触发事件
                     * @param oldValue
                     * @param newValue
                     */
                    $scope.onAdjust_TypeChange = function () {
                        $scope.data.currItem[$scope.LineName] = [];
                        $scope.gridOptions.api.setRowData($scope.data.currItem[$scope.LineName]);
                        countSum();
                    };

                    $scope.onBud_YearChange = function () {
                        $scope.data.currItem[$scope.LineName] = [];
                        $scope.gridOptions.api.setRowData($scope.data.currItem[$scope.LineName]);
                        countSum();
                    };


                    /**
                     * 校验是否输入正确数字并执行计算逻辑方法数组里的方法
                     * @param args
                     * @param functions
                     * @returns {Promise|void|*}
                     */
                    function checkGridMoneyInput(args, functions) {
                        if (args.newValue === args.oldValue)
                            return;
                        if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                            functions.forEach(function (value) {
                                value(args.data);
                            });
                            countSum();
                            args.api.refreshView();
                        }
                        else {
                            return swalApi.info("请输入有效数字");
                        }
                    }

                    /**
                     * 计算合计金额
                     */
                    function countSum() {
                        var rowdata = $scope.data.currItem[$scope.LineName];
                        $scope.data.currItem.before_bud_amt = numberApi.sum(rowdata, 'before_bud_amt');
                        $scope.data.currItem.adjust_amt = numberApi.sum(rowdata, 'adjust_amt');
                    }

                }

            ]
            ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)
;
