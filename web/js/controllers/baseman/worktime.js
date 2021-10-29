/**
 * 工作日历
 * CreateDate: 2019-07-20
 * CreateBy: tsl
 */
define(
    ['module', 'controllerApi', '$filter','base_diy_page', 'swalApi', 'requestApi', 'directive/hcButtons', 'directive/hcModal'],
    // 加载依赖的模块
    function (module, controllerApi, $filter,base_diy_page, swalApi, requestApi) {
        'use strict';

        // 控制器定义
        var controller = [
            // 声明依赖注入
            '$scope',

            // 控制器函数
            function ($scope, $q) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*-------------------数据定义、初始化 开始----------------*/

                $scope.data = {
                    currItem: {
                        nextyear: 1, // 明年工作日（1：今年 2：明年）
                        cfgdata: {}, // 模态框表单数据
                        worktimecfgs: [], // 工作时间关联对象数组
                        normalfcfg: [], // 常规工作日历
                        specialcfg: [] // 特殊工作日历
                    }
                };

                $scope.tab = 1;
                /**
                 * 明细tab页切换触发事件
                 * @param e
                 */
                $scope.onGridTabChange = function (e) {
                    // 获取已激活的标签页的名称

                    var tabName = $(e.target).text();
                    console.log(tabName);
                    if ('常规' == tabName) {
                        $scope.tab = 1;
                    }
                    if ('特殊' == tabName) {
                        $scope.tab = 2;
                    }
                }

                

                /**
                 * 初始化
                 */
                $scope.doInit = function () {
                    console.log("doInit函数开始!");
                    var postData = {
                        classId: "scpworktimecfg",
                        action: 'selectall',
                        data: { nextyear: 1 }
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            data.worktimecfgs.forEach(function (item, index) {
                                if (parseInt(item.theday) == 0) {
                                    item.week = "标准工作日";
                                } else if (parseInt(item.theday) == 1) {
                                    item.week = "星期一";
                                } else if (parseInt(item.theday) == 2) {
                                    item.week = "星期二";
                                } else if (parseInt(item.theday) == 3) {
                                    item.week = "星期三";
                                } else if (parseInt(item.theday) == 4) {
                                    item.week = "星期四";
                                } else if (parseInt(item.theday) == 5) {
                                    item.week = "星期五";
                                } else if (parseInt(item.theday) == 6) {
                                    item.week = "星期六";
                                } else if (parseInt(item.theday) == 7) {
                                    item.week = "星期日";
                                }

                                if (item.special == "1") {
                                    $scope.data.currItem.normalfcfg.push(item);
                                } else {
                                    $scope.data.currItem.specialcfg.push(item);
                                }
                            })
                            $scope.ordinaryOptions.hcApi.setRowData($scope.data.currItem.normalfcfg);
                            $scope.specialOptions.hcApi.setRowData($scope.data.currItem.specialcfg);
                        })
                }

                // $scope.doInit();

                /**
                 * 新增时数据、网格默认设置
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                };

                /**
                 * 点击网格checkBox
                 * @param args
                 */
                function gridValueChange(args) {
                    if (args.data.iswork == 1) {
                        args.data.statime1 = "";
                        args.data.statime2 = "";
                        args.data.endtime1 = "";
                        args.data.endtime2 = "";
                    } else if (args.data.iswork = 2) {
                        args.data.statime1 = "08:00";
                        args.data.statime2 = "12:00";
                        args.data.endtime1 = "13:30";
                        args.data.endtime2 = "17:30";
                    }
                    if (args.data.special == 1) {
                        $scope.data.currItem.normalfcfg[args.data.theday] = args.data;
                        $scope.ordinaryOptions.hcApi.setRowData($scope.data.currItem.normalfcfg);
                    }
                }

                /*-------------------------------数据定义、初始化、校验 结束---------------------------*/

                /*-------------------------按钮定义、按钮事件、按钮相关函数 开始-----------------------*/



                /**
                 * 获取指定日期的后一天
                 * @param 日期
                 * @returns {string}
                 */
                function getNextDay(d) {
                    d = new Date(d);
                    d = +d + 1000 * 60 * 60 * 24;
                    d = new Date(d);
                    // 格式化
                    // console.log("0"+(d.getMonth()+1));
                    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)) + "-" + d.getDate();

                }

                // 模态框事件
                $scope.setvalue = function (args) {
                    $scope.settingModal.open({
                        width:800,
                        height:450,
                        controller: ['$scope', function ($modalScope) {
                            console.log($scope.data.currItem);
                            $modalScope.title = "定义特殊日期";
                            $modalScope.cfgdata = $scope.data.currItem.cfgdata;
                            $modalScope.cfgdata.iswork = 1;
                            $modalScope.cfgdata.special = 2;
                            /**
                             * 校验模态框数据
                             */
                            $modalScope.checkNull = function(){
                                console.log("调用了checkNull函数");
                                var str = "";
                                var flag = true;
                                var nowDate = new Date()
                                nowDate = $filter("date")(nowDate, "yyyy-MM-dd");
                                console.log(nowDate);
                                if ($modalScope.cfgdata.theday == null ||
                                    $modalScope.cfgdata.theday == "" ||
                                    $modalScope.cfgdata.afterday == null ||
                                    $modalScope.cfgdata.afterday == null) {
                                    str += "起止日期不能为空!";
                                    flag = false;
                                } else {
                                    if ($modalScope.cfgdata.theday < nowDate ||
                                        $modalScope.cfgdata.afterday < nowDate) {
                                        str += '所选时间必须大于当前时间';
                                        flag = false;
                                    }
                                }
                                $scope.str = str;
                                return flag;
                            }
                            /**
                             * 模态框按钮
                             */
                            $modalScope.footerRightButtons.rightTest = {
                                title: '确定',
                                click: function () {
                                    if (!$modalScope.checkNull()) {
                                        swalApi.info($scope.str);
                                        return
                                    } else {
                                    var beginDate = Date.parse($modalScope.cfgdata.theday);
                                    console.log(beginDate);
                                    var endDate = Date.parse($modalScope.cfgdata.afterday);
                                    console.log(endDate);
                                    var timeDifference = endDate - beginDate;
                                    timeDifference = Math.abs(timeDifference);
                                    var dayDifference = Math.floor(timeDifference / (24 * 3600 * 1000)) + 1;
                                    console.log("天数差" + dayDifference);
                                    if (dayDifference == 1) {
                                        $scope.data.currItem.specialcfg.push(angular.copy($modalScope.cfgdata));
                                    } else {
                                        for (var i = 0; i < dayDifference; i++) {
                                            if (i > 0 && i < dayDifference) {
                                                var nextDay = getNextDay($modalScope.cfgdata.theday);
                                                console.log(nextDay);
                                                $modalScope.cfgdata.theday = nextDay;
                                            }
                                            $scope.data.currItem.specialcfg.push(angular.copy($modalScope.cfgdata));
                                            console.log($scope.data.currItem.specialcfg);
                                        }
                                    }
                                    // 将填写的数据push到数组
                                    $scope.specialOptions.api.setRowData($scope.data.currItem.specialcfg);
                                    $modalScope.cfgdata.afterday = null;
                                    $modalScope.cfgdata = [];
                                    // 关闭模态框
                                    $modalScope.$close();
                                    }
                                }
                            };
                            /**
                             * 模态框是否工作勾选事件
                             */
                            $modalScope.workModal = function (e) {
                                console.log('workModal函数开始!');
                                var checkTarget = e.target;
                                if (checkTarget.checked) {
                                    $modalScope.cfgdata.statime1 = "08:00";
                                    $modalScope.cfgdata.statime2 = "12:00";
                                    $modalScope.cfgdata.endtime1 = "13:30";
                                    $modalScope.cfgdata.endtime2 = "17:30";
                                } else {
                                    $modalScope.cfgdata.statime1 = "";
                                    $modalScope.cfgdata.statime2 = "";
                                    $modalScope.cfgdata.endtime1 = "";
                                    $modalScope.cfgdata.endtime2 = "";
                                }
                            }
                        }]
                    })
                }


                /**
                 * 删除行
                 * @param args
                 */
                $scope.delLineRow = function (args) {
                    var rowidx = $scope.specialOptions.api.getFocusedCell().rowIndex;
                    $scope.data.currItem.specialcfg.splice(rowidx, 1);
                    $scope.specialOptions.api.setRowData($scope.data.currItem.specialcfg);
                    $scope.specialOptions.api.refreshView();
                };


                /**
                 * 明年工作时间勾选框
                 */
                $scope.nextYearFun = function (e) {
                    var checkTarget = e.target;
                    if (checkTarget.checked) {
                        $scope.data.currItem.nextyear = 2;
                    } else {
                        $scope.data.currItem.nextyear = 1;
                    }
                }

                /**
                 * 刷新
                 */
                $scope.refresh = function () {
                    $scope.doInit();
                }

                /**
                 * 保存
                 */
                $scope.save = function () {
                    console.log("save函数开始!");
                    var action = "updatecfg";

                    $scope.data.currItem.worktimecfgs = [];
                    //对两个日期数组进行循环并将其添加到cpcworktimecfg中
                    $scope.data.currItem.normalfcfg.forEach(function (item, index) {
                        if (item.iswork == 0) {
                            item.iswork = 1;
                        }
                        $scope.data.currItem.worktimecfgs.push(item);
                    })
                    $scope.data.currItem.specialcfg.forEach(function (item, index) {
                        item.entid = "0"
                        if (item.iswork == 0) {
                            item.iswork = 1;
                        }
                        $scope.data.currItem.worktimecfgs.push(item);
                    })
                    $scope.data.currItem.cfgdata = [];
                    $scope.data.currItem.normalfcfg = [];
                    $scope.data.currItem.specialcfg = [];
                    $scope.data.currItem.worktimecfg = $scope.data.currItem.worktimecfgs;
                    // 发送请求
                    requestApi.post("scpworktimecfg", action, $scope.data.currItem).then(
                        function (data) {
                            swalApi.success('保存成功!');
                            $scope.data.currItem.normalfcfg = [];
                            $scope.data.currItem.specialcfg = [];
                            $scope.refresh();  
                        })

                }


                /*-------------------------按钮定义、按钮事件、按钮相关函数 结束-----------------------*/


                /*----------------------------------表格定义开始----------------------------------------*/
                // 网格定义 常规
                $scope.ordinaryOptions = {
                    columnDefs: [{
                        field: 'week',
                        headerName: ''
                    }, {
                        field: 'iswork',
                        headerName: '工作',
                        type: '是否',
                        editable: function (args) {
                            return args.data.theday != 0;
                        },
                        onCellValueChanged: gridValueChange
                    }, {
                        field: 'statime1',
                        headerName: '上午上班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'endtime1',
                        headerName: '上午下班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'statime2',
                        headerName: '下午上班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'endtime2',
                        headerName: '下午下班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }]
                };

                // 网格定义 特殊
                $scope.specialOptions = {
                    columnDefs: [{
                        field: 'theday',
                        headerName: '特殊日',
                        type: '时间'
                    }, {
                        field: 'iswork',
                        headerName: '是否工作',
                        type: '是否',
                        editable: true,
                        onCellValueChanged: gridValueChange
                    }, {
                        field: 'statime1',
                        headerName: '上午上班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'endtime1',
                        headerName: '上午下班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'statime2',
                        headerName: '下午上班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'endtime2',
                        headerName: '下午下班时间',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: function (args) {
                            return args.data.iswork == 2;
                        }
                    }]
                };
            }

        ];

        /*----------------------------------表格定义结束----------------------------------------*/



        // 使用注册控制器Api注册控制器
        // 需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);