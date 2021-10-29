/**
 * 月结
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', '$q'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, $q) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$timeout',
            //控制器函数
            function ($scope, $timeout) {
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.lines = [
                    {title: "是否存在未审核的费用申请单", stat: 0},
                    {title: "是否存在未审核的费用报销单", stat: 0},
                    {title: "是否存在未支付确认费用报销单", stat: 0},
                    {title: "是否存在未生成凭证的费用报销单", stat: 0},
                    {title: "是否存在未审核的薪资计算单", stat: 0}
                ];

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    },
                        {
                            headerName: "检查项目",
                            field: "title",
                        },
                        {
                            headerName: "状态",
                            field: "stat",
                            type: "词汇",
                            cellEditorParams: {
                                names: ['待检查', '检查中...', '通过', '未通过', '忽略'],
                                values: [0, 1, 2, 3, 4]
                            },
                            cellStyle: function (params) {
                                var color = null;
                                switch (params.data.stat) {
                                    case 1:
                                        color = 'orange';
                                        break;
                                    case 2:
                                        color = 'green';
                                        break;
                                    case 3:
                                        color = 'red';
                                        break;
                                    case 4:
                                        color = 'red';
                                        break;
                                }
                                return {
                                    color: color
                                };
                            }
                        }
                    ]

                };

                $scope.detailOptions = {
                    columnDefs: [{
                        type: '序号'
                    },
                        {
                            headerName: "单号",
                            field: "attribute1"
                        },
                        {
                            headerName: "类型",
                            field: "remark"
                        },
                        {
                            headerName: "创建日期",
                            field: "creation_date"
                        }
                        ,
                        {
                            headerName: "创建人",
                            field: "created_by"
                        }
                    ]

                };


                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    $scope.gridOptions.hcApi.setRowData($scope.lines);
                };

                var postData1 = {
                    classId: "gl_account_period",
                    action: 'checkmonth',
                    data: {
                        flag: 7,
                        search_flag: 1
                    }
                };


                $scope.check = function () {
                    //检查结账期间
                    if ($scope.data.currItem.year_month == undefined) {
                        return swalApi.info("没有找到启用的费用期间");
                    }
                    //数据重置
                    postData1.data.search_flag = 0;
                    $scope.lines.forEach(function (value) {
                        value.stat = 0;
                    });
                    $scope.gridOptions.hcApi.setRowData($scope.lines);
                    $scope.detailOptions.hcApi.setRowData([]);

                    return swalApi.confirm({
                        title: '确定要月结吗？',
                        confirmButtonText: '继续',
                        cancelButtonText: '取消'
                    }).then(check).then(function (args) {
                        if (args.stat == 3) {
                            return swalApi.confirm({
                                title: '忽略当前检查项，继续检查？',
                                confirmButtonText: '继续',
                                cancelButtonText: '停止'
                            }).then(function () {
                                args.stat = 4;
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            });
                        }
                    }).then(check).then(function (args) {
                        if (args.stat == 3) {
                            return swalApi.confirm({
                                title: '忽略当前检查项，继续检查？',
                                confirmButtonText: '继续',
                                cancelButtonText: '停止'
                            }).then(function () {
                                args.stat = 4;
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            });
                        }
                    }).then(check).then(function (args) {
                        if (args.stat == 3) {
                            return swalApi.confirm({
                                title: '忽略当前检查项，继续检查？',
                                confirmButtonText: '继续',
                                cancelButtonText: '停止'
                            }).then(function () {
                                args.stat = 4;
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            });
                        }
                    }).then(check).then(function (args) {
                        if (args.stat == 3) {
                            return swalApi.confirm({
                                title: '忽略当前检查项，继续检查？',
                                confirmButtonText: '继续',
                                cancelButtonText: '停止'
                            }).then(function () {
                                args.stat = 4;
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            });
                        }
                    }).then(check).then(function (args) {
                        if (args.stat == 3) {
                            return swalApi.confirm({
                                title: '忽略当前检查项，继续检查？',
                                confirmButtonText: '继续',
                                cancelButtonText: '停止'
                            }).then(function () {
                                args.stat = 4;
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            });
                        }
                    }).then(function () {
                        return swalApi.confirm({
                            title: '数据检查完毕，立即月结？',
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        });
                    }).then(function () {
                        $scope.doCheckYearMonth();
                    });

                    // return swalApi.confirmThenSuccess({
                    //     title: "确定要月结吗？",
                    //     okFun: function () {
                    //         return check().then(function (args) {
                    //             $timeOut(function () {
                    //                 if(args.stat == 3){
                    //                     return swalApi.confirm({
                    //                         title: '忽略当前检查项，继续检查？',
                    //                         confirmButtonText: '继续',
                    //                         cancelButtonText: '停止'
                    //                     });
                    //                 }
                    //             },1000);
                    //
                    //         }).then(check).then(function (args) {
                    //             if(args.stat == 3){
                    //                 return swalApi.confirm({
                    //                     title: '忽略当前检查项，继续检查？',
                    //                     confirmButtonText: '继续',
                    //                     cancelButtonText: '停止'
                    //                 });
                    //             }
                    //         }).then(check).then(function (args) {
                    //             if(args.stat == 3){
                    //                 return swalApi.confirm({
                    //                     title: '忽略当前检查项，继续检查？',
                    //                     confirmButtonText: '继续',
                    //                     cancelButtonText: '停止'
                    //                 });
                    //             }
                    //         }).then(check).then(function (args) {
                    //             if(args.stat == 3){
                    //                 return swalApi.confirm({
                    //                     title: '忽略当前检查项，继续检查？',
                    //                     confirmButtonText: '继续',
                    //                     cancelButtonText: '停止'
                    //                 });
                    //             }
                    //         }).then(check).then(function (args) {
                    //             if(args.stat == 3){
                    //                 return swalApi.confirm({
                    //                     title: '忽略当前检查项，继续检查？',
                    //                     confirmButtonText: '继续',
                    //                     cancelButtonText: '停止'
                    //                 });
                    //             }
                    //         }).then(function () {
                    //             return swalApi.confirm({
                    //                 title: '数据检查完毕，立即月结？',
                    //                 confirmButtonText: '确定',
                    //                 cancelButtonText: '取消'
                    //             });
                    //         }).then(function () {
                    //             $scope.doCheckYearMonth();
                    //         });
                    //     },
                    //     okTitle: '数据检查完毕'
                    // });
                }

                function check() {
                    postData1.data.search_flag += 1;
                    var curr_row = $scope.gridOptions.hcApi.getDataOfRowIndex(postData1.data.search_flag - 1);
                    curr_row.stat = 1;//修改为执行中
                    $scope.lines.splice(postData1.data.search_flag - 1, 1, curr_row);
                    $scope.gridOptions.hcApi.setRowData($scope.lines);
                    return requestApi.post(postData1)
                        .then(function (data) {
                            if (data.is_close_fee == 3) {
                                curr_row.stat = 3;//修改为执行失败
                                $scope.lines.splice(postData1.data.search_flag - 1, 1, curr_row);
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                                $scope.detailOptions.hcApi.setRowData(data.gl_account_periods);
                                //return $q.reject();
                            } else {
                                curr_row.stat = 2;//执行成功
                                $scope.lines.splice(postData1.data.search_flag - 1, 1, curr_row);
                                $scope.gridOptions.hcApi.setRowData($scope.lines);
                            }
                            return curr_row;
                        });
                }

                $scope.uncheck = function () {
                    //检查结账期间
                    if ($scope.data.currItem.last_year_month == undefined || $scope.data.currItem.last_year_month == '') {
                        return swalApi.info("没有找到上一次月结的费用期间");
                    }
                    swalApi.confirmThenSuccess({
                        title: "确定要取消月结吗？",
                        okFun: function () {
                            var postData = {
                                classId: "gl_account_period",
                                action: 'cancelyearmonthcheckfee',
                                data: {}
                            };
                            return requestApi.post(postData).then($scope.getYearMonth).then($scope.getLastYearMonth).then(function () {
                                postData1.data.year_month = $scope.data.currItem.year_month;
                            });
                        },
                        okTitle: '取消成功'
                    });

                }


                //添加按钮
                $scope.toolButtons = {

                    check: {
                        title: '月结',
                        icon: 'glyphicon glyphicon-check',
                        click: function () {
                            $scope.check && $scope.check();
                        }
                    },

                    uncheck: {
                        title: '取消月结',
                        icon: 'glyphicon glyphicon-step-backward',
                        click: function () {
                            $scope.uncheck && $scope.uncheck();
                        }

                    }

                };

                //月份
                $scope.doCheckYearMonth = function () {
                    var postData = {
                        classId: "gl_account_period",
                        action: 'yearmonthcheckfee',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            swalApi.success("月结完毕！");
                        }).then($scope.getYearMonth).then($scope.getLastYearMonth).then(function () {
                            postData1.data.year_month = $scope.data.currItem.year_month;
                        });
                }


                //本月月结月份
                $scope.getYearMonth = function () {
                    var postData = {
                        classId: "gl_account_period",
                        action: 'getcuryearmonthfee',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.year_month = data.year_month;
                        });
                }
                //上月月结月份
                $scope.getLastYearMonth = function () {
                    var postData = {
                        classId: "gl_account_period",
                        action: 'getperiodyearmonthfee',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.last_year_month = data.year_month;
                        });
                }

                //获本月月结月份
                $scope.getYearMonth().then($scope.getLastYearMonth).then(function () {
                    postData1.data.year_month = $scope.data.currItem.year_month;
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