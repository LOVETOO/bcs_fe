/**
 * 账户余额
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','numberApi','openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,numberApi,openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            id:'seq',
                            type: '序号'
                        },
                        {
                            id:'fund_account_code',
                            headerName: "账户编码",
                            field: "fund_account_code",
                            pinned:'left'
                        },{
                            id:'fund_account_name',
                            headerName: "账户名称",
                            field: "fund_account_name",
                            pinned:'left'
                        },
                        {
                            id:'fund_account_type',
                            headerName: "账户类型",
                            field: "fund_account_type",
                            hcDictCode:'fund_account_type'
                        },
                        {
                            id:'fund_account_property',
                            headerName: "账户类别",
                            field: "fund_account_property",
                            hcDictCode:'fund_account_property'
                        },
                        {
                            id:'date_startuse',
                            headerName: "启用日期",
                            field: "date_startuse",
                            type:'日期'
                        },
                        {
                            id:'fund_account_status',
                            headerName: "状态",
                            field: "fund_account_status",
                            hcDictCode:"fund_account_status"
                        },
                        {
                            id:'amount_blnc',
                            headerName: "当前结余(元)",
                            field: "amount_blnc",
                            type:"金额"
                        }
                    ],
                    hcBeforeRequest:function (searchObj) {
                        angular.extend(searchObj,$scope.data.currItem);
                    },
                    hcAfterRequest:function (data) {
                        $scope.calSum(data.fd_cur_fund_balances);
                    },

                };

                $scope.groupGridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                            id:'seq',
                            type: '序号'
                        },
                        {
                            id:'fund_account_code',
                            headerName: "账户编码",
                            field: "fund_account_code",
                            pinned:'left'
                        },{
                            id:'fund_account_name',
                            headerName: "账户名称",
                            field: "fund_account_name",
                            pinned:'left'
                        },
                        {
                            id:'fund_account_type',
                            headerName: "账户类型",
                            field: "fund_account_type",
                            hcDictCode:'fund_account_type'
                        },
                        {
                            id:'fund_account_property',
                            headerName: "账户类别",
                            field: "fund_account_property",
                            hcDictCode:'fund_account_property'
                        },
                        {
                            id:'date_startuse',
                            headerName: "启用日期",
                            field: "date_startuse",
                            type:'日期'
                        },
                        {
                            id:'fund_account_status',
                            headerName: "状态",
                            field: "fund_account_status",
                            hcDictCode:"fund_account_status"
                        },
                        {
                            id:'amount_blnc',
                            headerName: "当前结余(元)",
                            field: "amount_blnc",
                            type:"金额"
                        }
                    ]
                };

                $scope.gridOptions.hcClassId = 'fd_cur_fund_balance';
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.chooseAccount = {
                    afterOk: function (result) {
                        $scope.data.currItem.fd_fund_account_id = result.fd_fund_account_id;
                        $scope.data.currItem.fund_account_code = result.fund_account_code;
                        $scope.data.currItem.fund_account_name = result.fund_account_name;
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

                    },

                    show_group: {
                        title: '显示汇总',
                        icon: 'glyphicon glyphicon-indent-right',
                        click: function () {
                            $scope.group && $scope.group();
                        }

                    }

                };

                // 查询

                $scope.search = function () {
                    $('#tab11').tab('show');
                    $scope.data.lines = [];
                    $scope.groupGridOptions.hcApi.setRowData([]);
                    return $scope.gridOptions.hcApi.search();
                };





                $scope.refresh = function () {
                    $scope.search();
                }


                $scope.export = function () {
                    $scope.gridOptions.hcApi.exportToExcel();
                }





                $scope.data.lines = [];
                $scope.group = function () {
                    if($scope.data.lines.length==0){
                        $scope.data.lines = $scope.gridOptions.hcApi.getRowData();
                    }

                    $("#groupModal").modal();

                }

                $scope.columns = [];
                $scope.initGroup = function () {
                    var columns = [];
                    if($scope.fund_account_type == 2)columns.push("账户类型");
                    if($scope.fund_account_property == 2)columns.push("账户类别");
                    if(columns.length==0){
                        swalApi.info("请选择汇总项");
                        return;
                    }
                    $scope.columns = columns;
                    $scope.groupGridOptions.columnDefs.forEach(function (column) {
                        if(columns.indexOf(column.headerName)>=0){
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id,true);
                            if(column.children){
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id,true);
                                });
                            }
                        }else{
                            $scope.groupGridOptions.columnApi.setColumnVisible(column.id,false);
                            if(column.children) {
                                column.children.forEach(function (child) {
                                    $scope.groupGridOptions.columnApi.setColumnVisible(child.id, false);
                                });
                            }
                        }
                    });


                    $scope.groupGridOptions.columnApi.setColumnsVisible(['amount_blnc','seq'],true);

                    $("#groupModal").modal('hide');

                    $('#tab22').tab('show');

                    //数据分组
                    groupData($scope.data.lines,columns);
                }


                function groupData(lines,columns) {
                    var map = {};
                    var key = "";
                    var group_data = [];
                    for(var i = 0; i < lines.length; i++){
                        var ai = lines[i];
                        key = "";
                        columns.forEach(function (v) {
                            if(v == '账户类型')key+=ai.fund_account_type;
                            if(v == '账户类别')key+=ai.fund_account_property;
                        });
                        if(!map[key]){
                            map[key] = [ai];
                        }else{
                            map[key].push(ai);
                        }
                    }
                    Object.keys(map).forEach(function(key){
                        var row = map[key][0];
                        row.amount_blnc = numberApi.sum(map[key],'amount_blnc');
                        group_data.push(row);
                    });
                    $scope.groupGridOptions.hcApi.setRowData(group_data);
                }

                $scope.onChange = function () {
                    $scope.search();
                }

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function (lines) {
                    var amount = numberApi.sum(lines, 'amount_blnc');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            amount_blnc: amount
                        }
                    ]);
                    $scope.groupGridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            amount_blnc: amount
                        }
                    ]);
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