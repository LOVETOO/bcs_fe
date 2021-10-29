/**
 * 部门访问权限
 *  2018-11-23
 */
define(
    ['module', 'controllerApi', 'base_diy_page','$modal', 'promiseApi', 'requestApi', 'jquery', 'swalApi', 'directive/hcObjProp'],
    function (module, controllerApi, base_diy_page,$modal, promiseApi, requestApi, $, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.flag = 1;
                $scope.data.allUser = [];
                var flag = 0;
                var allRows3;
                var Col1 = [{
                    type: '序号',
                    minWidth: 100,
                    checkboxSelection: function () {
                        if ($scope.data.flag == 2) {
                            return true
                        }
                    },
                    headerCheckboxSelection: function () {
                        if ($scope.data.flag == 2) {
                            return true
                        }
                    }
                }, {
                    field: 'userid',
                    headerName: '用户编码',
                    width: 110
                }, {
                    field: 'username',
                    headerName: '用户名称',
                    width: 150
                }];
                var Col2 = [{
                    type: '序号',
                    minWidth: 100,
                    checkboxSelection: function () {
                        if ($scope.data.flag == 1) {
                            return true
                        }
                    },
                    headerCheckboxSelection: function () {
                        if ($scope.data.flag == 1) {
                            return true
                        }
                    }
                }, {
                    field: 'dept_code',
                    headerName: '部门编码',
                    width: 110
                }, {
                    field: 'dept_name',
                    headerName: '部门名称',
                    width: 150
                }];
                $scope.gridOptions1 = {
                    columnDefs: Col1
                }
                $scope.gridOptions2 = {
                    columnDefs: Col2
                }
                $scope.gridOptions3 = {
                    columnDefs: Col2
                }
                $scope.listname = "部门";
                $scope.data.name = '人员';
                //继承主控制器    
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                $scope.clickUser = function () {
                    $scope.gridOptions1.api.setColumnDefs(Col1);
                    $scope.gridOptions2.api.setColumnDefs(Col2);
                    $scope.gridOptions3.api.setColumnDefs(Col2);
                    $scope.listname = "部门";
                    $scope.data.name = '人员';
                    $scope.gridOptions1.api.setRowData([]);
                    $scope.gridOptions2.api.setRowData([]);
                    $scope.gridOptions3.api.setRowData([]);
                    $scope.data.currItem.code = "";
                    $scope.data.currItem.name = "";
                    flag = 0;
                    allRows3 = {};
                    requestApi.post("fin_expense", "getdeptuser", {}).then(function (data) {
                        $scope.gridOptions1.api.setRowData(data.fin_expenseoffin_expenses);
                    });
                }
                $scope.clickDeft = function () {
                    $scope.gridOptions1.api.setColumnDefs(Col2);
                    $scope.gridOptions2.api.setColumnDefs(Col1);
                    $scope.gridOptions3.api.setColumnDefs(Col1);
                    $scope.listname = "人员";
                    $scope.data.name = '部门';
                    $scope.gridOptions1.api.setRowData([]);
                    $scope.gridOptions2.api.setRowData([]);
                    $scope.gridOptions3.api.setRowData([]);
                    $scope.data.currItem.code = "";
                    $scope.data.currItem.name = "";
                    flag = 0;
                    allRows3 = {};
                    requestApi.post("dept", "search", {
                        search_flag: 3
                    }).then(function (data) {
                        $scope.gridOptions1.api.setRowData(data.depts);
                    });
                }

                //数据加载(查询人员)
                requestApi.post("fin_expense", "getdeptuser", {}).then(function (data) {
                    $scope.data.allUser = data.fin_expenseoffin_expenses;
                    $scope.gridOptions1.api.setRowData(data.fin_expenseoffin_expenses);
                });
                // 左边表格的点击事件
                $scope.gridOptions1.onCellClicked = function () {
                    //获取选中行的数据
                    var nodeData = $scope.gridOptions1.hcApi.getFocusedData();
                    if ($scope.data.flag == 1) {
                        //根据获取的人员查询对应的权限
                        requestApi.post("fin_expense", "getaccessctrlsadept", {
                            userid: nodeData.userid
                        }).then(function (data) {
                            if (data.sa_deptaccessctrloffin_expenses.length > 0) {

                                $scope.gridOptions2.api.setRowData(data.sa_deptaccessctrloffin_expenses);
                            } else {
                                $scope.gridOptions2.api.setRowData([]);
                            }
                            if (data.deptoffin_expenses.length > 0) {

                                $scope.gridOptions3.api.setRowData(data.deptoffin_expenses);
                            } else {
                                $scope.gridOptions3.api.setRowData([]);
                            }
                        });
                    };
                    if ($scope.data.flag == 2) {
                        //根据获取的部门查询对应的人员
                        requestApi.post("fin_expense", "getaccessctrlsadept", {
                            dept_id: nodeData.dept_id
                        }).then(function (data) {
                            if (data.sa_deptaccessctrloffin_expenses.length > 0) {
                                $scope.gridOptions2.api.setRowData(data.sa_deptaccessctrloffin_expenses);
                                //过滤掉已经存在的人员
                                $scope.data.allUser.forEach(function (data1) {
                                    data.sa_deptaccessctrloffin_expenses.forEach(function (data2) {
                                        if (data1.userid == data2.userid) {
                                            $scope.data.allUser.splice($scope.data.allUser.indexOf(data1), 1);
                                        }
                                    })
                                })
                                $scope.gridOptions3.api.setRowData($scope.data.allUser);
                            } else {
                                $scope.gridOptions2.api.setRowData([]);
                            }

                        });
                    };
                }
                //定义按钮
                $scope.toolButtons = {
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    }
                };

                //授权
                $scope.allAccess = function () {
                    //获取所有数据
                    var allRows3 = $scope.gridOptions3.hcApi.getRowData();
                    var allRows2 = $scope.gridOptions2.hcApi.getRowData();
                    $scope.gridOptions2.hcApi.setRowData(allRows2.concat(allRows3));
                    $scope.gridOptions3.hcApi.setRowData([]);
                }
                $scope.Access = function () {
                    //获取选中的节点数据
                    var selectedRows3 = $scope.gridOptions3.api.getSelectedRows();
                    var allRows2 = $scope.gridOptions2.hcApi.getRowData();
                    $scope.gridOptions2.hcApi.setRowData(allRows2.concat(selectedRows3));
                    //获取未使用表的所有节点数据
                    var allRows3 = $scope.gridOptions3.hcApi.getRowData();
                    selectedRows3.forEach(function (data) {
                        allRows3.splice(allRows3.indexOf(data), 1);
                    })
                    $scope.gridOptions3.hcApi.setRowData(allRows3);
                }
                //取消授权
                $scope.allCancel = function () {
                    //获取所有数据
                    var allRows2 = $scope.gridOptions2.hcApi.getRowData();
                    $scope.gridOptions3.hcApi.setRowData($scope.gridOptions3.hcApi.getRowData().concat(allRows2));
                    $scope.gridOptions2.hcApi.setRowData([]);
                }
                $scope.Cancel = function () {
                    //获取选中的节点数据
                    var selectedRows2 = $scope.gridOptions2.api.getSelectedRows();
                    $scope.gridOptions3.hcApi.setRowData($scope.gridOptions3.hcApi.getRowData().concat(selectedRows2));
                    //获取使用的所有节点数据
                    var allRows2 = $scope.gridOptions2.hcApi.getRowData();
                    selectedRows2.forEach(function (data) {
                        allRows2.splice(allRows2.indexOf(data), 1);
                    })
                    $scope.gridOptions2.hcApi.setRowData(allRows2);
                }
                //刷新
                $scope.refresh = function () {
                    $scope.gridOptions1.onCellClicked();
                }
                //保存
                $scope.save = function () {
                    var postdata = {
                        sa_deptaccessctrloffin_expenses: $scope.gridOptions2.hcApi.getRowData(),
                        search_flag: $scope.data.flag
                    };
                    //按人员
                    if ($scope.data.flag == 1) {
                        postdata.userid = $scope.gridOptions1.hcApi.getFocusedData().userid;
                        //按部门
                    } else if ($scope.data.flag == 2) {
                        postdata.dept_id = $scope.gridOptions1.hcApi.getFocusedData().dept_id;
                    }
                    requestApi.post("fin_expense", "updatesadeptaccessctrl", postdata).then(function (data) {
                        return swalApi.success('保存成功!');
                    });
                }
                //左边的通用查询框:
                $scope.click1 = function (args){
                    if ($scope.data.flag == 1) {
                        $modal.openCommonSearch({
                            classId: 'fin_expense',
                            postData: {},
                            action: 'getdeptuser',
                            title: "人员搜索",
                            dataRelationName:'fin_expenseoffin_expenses',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "用户编码",
                                        field: "userid"
                                    }, {
                                        headerName: "用户名称",
                                        field: "username"
                                    }
                                ]
                            }
                        })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.code = result.userid;
                                $scope.data.currItem.name = result.username;
                                var selectedData = [];
                                selectedData.push(result);
                                $scope.gridOptions1.hcApi.setRowData(selectedData);
                            });
                    } else if ($scope.data.flag == 2) {
                        $modal.openCommonSearch({
                            classId: 'dept',
                            postData: {},
                            action: 'search',
                            title: "部门搜索",
                            dataRelationName:'depts',
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "部门编码",
                                        field: "dept_code"
                                    }, {
                                        headerName: "部门名称",
                                        field: "dept_name"
                                    }
                                ]
                            }
                        })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.code = result.dept_code;
                                $scope.data.currItem.name = result.dept_name;
                                var selectedData = [];
                                selectedData.push(result);
                                $scope.gridOptions1.hcApi.setRowData(selectedData);
                            });
                    }
                };
                //关键字搜索(正则表达式实现模糊查询)
                $scope.click2 = function () {
                    if (flag == 0) {
                        allRows3 = $scope.gridOptions3.hcApi.getRowData();
                    }
                    flag++;
                    var newData3 = [];
                    if ($scope.data.flag == 1) {
                        var patt1 = new RegExp($scope.data.currItem.name3);
                        allRows3.forEach(function (data) {
                            if (patt1.test(data.dept_name)) {
                                newData3.push(data);
                            }
                        })
                        var allRows2 = $scope.gridOptions2.hcApi.getRowData();
                        allRows2.forEach(function(data1){
                            newData3.forEach(function(data2){
                                if(data1.dept_name == data2.dept_name){
                                    newData3.splice(newData3.indexOf(data2));
                                }
                            })
                        })
                        if (newData3.length < 1) {
                            return swalApi.info('该部门不存在或已授权!')
                        }
                        $scope.gridOptions3.hcApi.setRowData(newData3);
                    };
                    if ($scope.data.flag == 2) {
                        var patt2 = new RegExp($scope.data.currItem.name3);
                        allRows3.forEach(function (data) {
                            if (patt2.test(data.username)) {
                                newData3.push(data);
                            }
                        })
                        var allRows2 = $scope.gridOptions2.hcApi.getRowData();
                        allRows2.forEach(function(data1){
                            newData3.forEach(function(data2){
                                if(data1.username == data2.username){
                                    newData3.splice(newData3.indexOf(data2));
                                }
                            })
                        })
                        if (newData3.length < 1) {
                            return swalApi.info('该人员不存在或已授权!')
                        }
                        $scope.gridOptions3.hcApi.setRowData(newData3);
                    };
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);