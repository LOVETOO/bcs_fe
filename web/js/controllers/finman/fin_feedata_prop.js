/**
 * 历史销售记录-属性页面
 * 2018-11-16
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'fileApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, fileApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/

                function getCurrItem() {
                    return $scope.data.currItem;
                }

                function editable(args) {
                    if (!arguments[0].node.id) {
                        return false;
                    }
                    if (getCurrItem().stat == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [

                        {
                            type: '序号'
                        }, {
                            headerName: "部门",
                            children: [
                                {
                                    field: 'org_code',
                                    headerName: '部门编码',
                                    suppressSizeToFit: true,
                                    width: 104,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseOrg(args);
                                    },
                                    onCellValueChanged: function (args) {

                                        if (args.newValue === args.oldValue)
                                            return;

                                        getOrg(args.newValue)
                                            .catch(function (reason) {
                                                return {
                                                    org_id: 0,
                                                    org_code: '',
                                                    org_name: reason
                                                };
                                            })
                                            .then(function (line) {
                                                angular.extend(args.data, line);
                                                args.api.refreshView();
                                            });
                                    }
                                }
                                , {
                                    field: 'org_name',
                                    headerName: '部门名称'
                                }
                            ]
                        }, {
                            headerName: '品类',
                            field: 'crm_entid',
                            hcDictCode: 'crm_entid',
                            suppressSizeToFit: true,
                            width: 104,
                            editable: function (args) {
                                return editable(args);
                            }

                        }
                        , {
                            headerName: '费用类别/项目',
                            children: [
                                {
                                    field: 'object_code',
                                    headerName: '编码',
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    onCellDoubleClicked: function (args) {
                                        $scope.chooseFee(args);
                                    },
                                    onCellValueChanged: function (args) {

                                        if (args.newValue === args.oldValue)
                                            return;

                                        //获取费用项目/类别  
                                        getFee(args.newValue)
                                            .catch(function (reason) {  //没有查出内容时的处理
                                                return {
                                                    object_id: 0,
                                                    object_code: '',
                                                    object_name: reason  //$q.reject(reson)，承诺拒绝原因
                                                };
                                            })
                                            .then(function (line) {
                                                angular.extend(args.data, line);
                                                return args.data;
                                            })
                                            .then(function () {
                                                args.api.refreshView();
                                            });
                                    }
                                }
                                , {
                                    field: 'object_name',
                                    headerName: '名称'

                                }, {
                                    field: 'object_type',
                                    headerName: '类型',
                                    suppressSizeToFit: true,
                                    width: 104,
                                    hcDictCode: 'fin_object_type'
                                }
                            ]
                        },
                        {
                            headerName: '会计核算科目',
                            children: [
                                {
                                    field: 'subject_code',
                                    headerName: '科目编码',
                                    suppressSizeToFit: true,
                                    width: 104
                                    // editable : function (args) {
                                    //     return editable(args)
                                    // },
                                    // onCellDoubleClicked: function (args) {
                                    //     $scope.chooseSubject(args);
                                    // },
                                    // onCellValueChanged: function (args) {
                                    //
                                    //     if (args.newValue === args.oldValue)
                                    //         return;
                                    //
                                    //     getSubject(args.newValue)
                                    //         .catch(function (reason) {
                                    //             return {
                                    //                 subject_id: 0,
                                    //                 subject_code: '',
                                    //                 subject_name: reason
                                    //             };
                                    //         })
                                    //         .then(function (line) {
                                    //             angular.extend(args.data, line);
                                    //             args.api.refreshView();
                                    //         });
                                    // }
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
                                    headerName: '编码',
                                    suppressSizeToFit: true,
                                    width: 80
                                }, {
                                    field: 'bud_type_name',
                                    headerName: '名称',
                                    suppressSizeToFit: true,
                                    width: 80
                                }
                            ]
                        }
                        ,
                        {
                            headerName: '去年费用数据',
                            children: [
                                {
                                    field: 'lyear_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额',
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return;
                                        setHeadLyearAmt(args);
                                    },
                                    editable: function (args) {
                                        return editable(args);
                                    }
                                }
                                , {
                                    field: 'lyear_fee_rate',
                                    headerName: '费用率',
                                    suppressSizeToFit: true,
                                    width: 80,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            headerName: '本年1-10月实际费用数据',
                            children: [
                                {
                                    field: 'tyear1_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额',
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return;
                                        setHeadTyearAmt(args);
                                    },
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'tyear1_fee_rate',
                                    headerName: '费用率',
                                    suppressSizeToFit: true,
                                    width: 80,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '百分比'
                                }
                            ]
                        }, {
                            headerName: '本年11-12月预计费用数据',
                            children: [
                                {
                                    field: 'tyear2_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额',
                                    onCellValueChanged: function (args) {
                                        if (args.newValue == args.oldValue)
                                            return;
                                        setHeadTyearAmt(args);
                                    },
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'tyear2_fee_rate',
                                    headerName: '费用率',
                                    suppressSizeToFit: true,
                                    width: 80,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '百分比'
                                }
                            ]
                        }, {
                            headerName: '本年费用数据',
                            children: [
                                {
                                    field: 'tyear3_fee_amt',
                                    headerName: '费用金额',
                                    type: '金额',
                                    editable: function (args) {
                                        return editable(args)
                                    }
                                }
                                , {
                                    field: 'tyear3_fee_rate',
                                    headerName: '费用率',
                                    suppressSizeToFit: true,
                                    width: 80,
                                    editable: function (args) {
                                        return editable(args)
                                    },
                                    type: '百分比'
                                }
                            ]
                        }
                        , {
                            field: 'note',
                            headerName: '备注说明',
                            editable: function (args) {
                                return editable(args)
                            }
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 查部门
                 */
                $scope.chooseOrg = function () {
                    $modal.openCommonSearch({
                            classId: 'dept'
                        })
                        .result//响应数据
                        .then(function (response) {
                            if (args) {
                                args.data.org_id = response.dept_id;
                                args.data.org_code = response.dept_code;
                                args.data.org_name = response.dept_name;
                                args.api.refreshView();
                            } else {
                                getCurrItem().org_id = response.dept_id;
                                getCurrItem().org_code = response.dept_code;
                                getCurrItem().org_name = response.dept_name;
                            }
                        })
                };

                /**
                 * 查询费用项目
                 */
                $scope.chooseFee = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_fee_header',
                            postData: {flag: 1},
                            action: 'search',
                            title: "费用类别/项目",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "费用类别/项目编码",
                                    field: "object_code"
                                }, {
                                    headerName: "费用类别/项目名称",
                                    field: "object_name"
                                }, {
                                    headerName: "对象类型",
                                    field: "object_type_name"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.object_id = response.object_id;
                            args.data.object_code = response.object_code;
                            args.data.object_name = response.object_name;
                            args.data.bud_type_id = response.bud_type_id;
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                            args.data.object_type = response.object_type;
                            if (response.object_type == 2) {//费用项目
                                args.data.subject_id = response.subject_id;
                                args.data.subject_code = response.subject_code;
                                args.data.subject_name = response.subject_name;
                            }
                            args.api.refreshView();
                        });
                };

                //输入、粘贴 查询部门
                function getOrg(code) {
                    var postData = {
                        classId: "dept",
                        action: 'search',
                        data: {sqlwhere: "dept_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.depts.length > 0) {
                                var dept = data.depts[0];
                                return {org_id: dept.dept_id, org_code: dept.dept_code, org_name: dept.dept_name};
                            } else {
                                return $q.reject("部门编码【" + code + "】不可用");
                            }
                        });
                }

                //查询预算类别
                /*
                 function getBudType(args) {
                 var postData = {
                 classId: "fin_bud_type_header",
                 action: 'getbudtype',
                 data: {object_id: args.data.object_id}
                 };
                 return requestApi.post(postData)
                 .then(function (data) {
                 args.data.bud_type_id = data.bud_type_id;
                 args.data.bud_type_code = data.bud_type_code;
                 args.data.bud_type_name = data.bud_type_name;
                 return args;
                 });
                 }
                 */

                //输入、粘贴 查询费用项目/类别(带出 预算类别、会计核算科目)
                function getFee(code) {
                    var postData = {
                        classId: "fin_fee_header",
                        action: 'search',
                        data: {
                            sqlwhere: "object_code = '" + code + "'",
                            flag: 1
                        }
                    };

                    return requestApi.post(postData)
                        .then(function (data) {
                            console.log(data, 'fin_fee_header');
                            if (data.fin_fee_headers.length > 0) {
                                var element = data.fin_fee_headers[0];
                                return {
                                    //费用项目/类别
                                    object_id: element.object_id,
                                    object_code: element.object_code,
                                    object_name: element.object_name,
                                    object_type: element.object_type,
                                    //预算类别
                                    bud_type_id: element.bud_type_id,
                                    bud_type_code: element.bud_type_code,
                                    bud_type_name: element.bud_type_name,
                                    //会计核算科目
                                    subject_id: element.subject_id,
                                    subject_code: element.subject_code,
                                    subject_name: element.subject_name
                                }
                            } else {
                                return $q.reject("编码【" + code + "】不可用");
                            }
                        });

                }


                /**
                 * 查询会计核算科目
                 */
                $scope.chooseSubject = function (args) {
                    $modal.openCommonSearch({
                            classId:'gl_account_subject',
                            postData: {search_flag: 3}
                        })
                        .result//响应数据
                        .then(function(result){
                            args.data.subject_id = result.gl_account_subject_id;
                            args.data.subject_code = result.km_code;
                            args.data.subject_name = result.km_name;
                            args.api.refreshView();
                        });
                };

                function getSubject(code) {
                    var postData = {
                        classId: "gl_account_subject",
                        action: 'search',
                        data: {sqlwhere: "km_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.gl_account_subjects.length > 0) {
                                return data.gl_account_subjects[0];
                            } else {
                                return $q.reject("科目编码【" + code + "】不可用");
                            }
                        });
                }

                //计算去年费用总和
                function setHeadLyearAmt(args) {
                    getCurrItem().total_lyear_fee_amt = numberApi.toNumber(getCurrItem().total_lyear_fee_amt, 0) - numberApi.toNumber(args.oldValue, 0)
                        + numberApi.toNumber(args.newValue, 0);
                }

                //计算本年费用总和
                function setHeadTyearAmt(args) {
                    getCurrItem().total_tyear_fee_amt = numberApi.toNumber(getCurrItem().total_tyear_fee_amt, 0) - numberApi.toNumber(args.oldValue, 0)
                        + numberApi.toNumber(args.newValue, 0);
                }

                //遍历明细计算合计金额
                function setTotalAmt() {
                    var l_amt = 0, t_amt = 0;
                    $.each(getCurrItem().fin_feedata_lines, function (index, item) {
                        l_amt += numberApi.toNumber(item.lyear_fee_amt, 0);
                        t_amt = t_amt + numberApi.toNumber(item.tyear1_fee_amt, 0) + numberApi.toNumber(item.tyear2_fee_amt, 0);
                    });
                    getCurrItem().total_lyear_fee_amt = l_amt;
                    getCurrItem().total_tyear_fee_amt = t_amt;
                }

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.fee_year = new Date().getFullYear();
                    bizData.stat = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');
                    bizData.fin_feedata_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_feedata_lines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.fin_feedata_lines);
                    $scope.calSum();
                };

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            lyear_fee_amt: numberApi.sum(getCurrItem().fin_feedata_lines, 'lyear_fee_amt'),
                            tyear1_fee_amt: numberApi.sum(getCurrItem().fin_feedata_lines, 'tyear1_fee_amt'),
                            tyear2_fee_amt: numberApi.sum(getCurrItem().fin_feedata_lines, 'tyear2_fee_amt'),
                            tyear3_fee_amt: numberApi.sum(getCurrItem().fin_feedata_lines, 'tyear3_fee_amt')
                        }
                    ]);
                };


                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };

                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if (getCurrItem().fin_feedata_lines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = getCurrItem().fin_feedata_lines;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;
                        if (!line.object_id)
                            reason.push('第' + row + '行费用类别/项目不能为空');
                        if (!line.org_id)
                            reason.push('第' + row + '行部门不能为空');
                    });

                }


                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit().then($scope.initHeader);
                };

                /**
                 * 初始化表头
                 */
                $scope.initHeader = function () {
                    var last_year = Number(getCurrItem().fee_year) - 2;
                    var this_year = Number(getCurrItem().fee_year) - 1;

                    console.log($scope.gridOptions.columnDefs)
                    $scope.gridOptions.columnDefs[6].headerName = last_year + "年费用数据";
                    $scope.gridOptions.columnDefs[7].headerName = "" + this_year + "年前三季度累计费用数据";
                    $scope.gridOptions.columnDefs[8].headerName = "" + this_year + "年第四季度预计费用数据";
                    $scope.gridOptions.columnDefs[9].headerName = this_year + "年费用数据";

                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                }


                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    swal({
                        title: '请输入要增加的行数',
                        type: 'input', //类型为输入框
                        inputValue: 1, //输入框默认值
                        closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                        showCancelButton: true //显示【取消】按钮
                    }, function (inputValue) {
                        if (inputValue === false) {
                            swal.close();
                            return;
                        }

                        var rowCount = Number(inputValue);
                        if (rowCount <= 0) {
                            swal.showInputError('请输入有效的行数');
                            return;
                        }
                        else if (rowCount > 1000) {
                            swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                            return;
                        }

                        swal.close();

                        var data = getCurrItem().fin_feedata_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            data.push(newLine);
                        }

                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'org_code');
                    });
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrItem().fin_feedata_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_feedata_lines);
                        setTotalAmt();
                    }
                };

                // $scope.confirm_state = function () {
                //     return swalApi.confirmThenSuccess({
                //         title: "是否提交确认？",
                //         okFun: function () {
                //             var postData = {
                //                 classId: "fin_feedata_head",
                //                 action: 'confirm_state',
                //                 data: {feedata_head_id : getCurrItem().feedata_head_id}
                //             };
                //
                //             return requestApi.post(postData)
                //                 .then($scope.doInit);
                //         },
                //         okTitle: '确认成功'
                //     });
                // }


                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                //底部右边按钮
                // $scope.footerRightButtons.confirm_state = {
                //     title: '确认',
                //     click: function() {
                //         $scope.confirm_state && $scope.confirm_state();
                //     }
                // };

                /**
                 * 批量导入
                 */
                $scope.batchImport = function () {

                    var titleToField = {};

                    $.each($scope.gridOptions.columnDefs, function (index, item) {
                        if (item.children && item.children.length > 0) {
                            $.each(item.children, function (j, it) {
                                titleToField[$scope.gridOptions.columnDefs[index].headerName
                                + $scope.gridOptions.columnDefs[index].children[j].headerName]
                                    = $scope.gridOptions.columnDefs[index].children[j].field;
                            });
                        } else {
                            titleToField[$scope.gridOptions.columnDefs[index].headerName]
                                = $scope.gridOptions.columnDefs[index].field;
                        }
                    });

                    fileApi.chooseExcelAndGetData()
                        .then(function (excelData) {
                            var importLines = excelData.rows;
                            loopApi.forLoop(importLines.length, function (i) {
                                var data = {};
                                Object.keys(titleToField).forEach(function (key) {
                                    var field = titleToField[key];
                                    var value = importLines[i][key];
                                    data[field] = value;
                                });
                                getCurrItem().fin_feedata_lines.push(data);
                            });
                        }).then(function () {
                        var postData = {
                            classId: "fin_feedata_head",
                            action: 'checkdata',
                            data: {fin_feedata_lines: getCurrItem().fin_feedata_lines}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                getCurrItem().fin_feedata_lines = data.fin_feedata_lines;
                                $scope.gridOptions.hcApi.setRowData(getCurrItem().fin_feedata_lines);
                                setTotalAmt();
                            });
                    });

                };


                /**
                 * 按钮
                 * @type {{title: string, click: click, hide: hide}}
                 */
                $scope.footerLeftButtons.batchImport = {
                    title: '批量导入',
                    click: function () {
                        $scope.batchImport && $scope.batchImport();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
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
