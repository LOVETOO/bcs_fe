/**
 * 数据字典
 *  2018-11-22
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'promiseApi', 'requestApi', 'jquery', 'swalApi', 'directive/hcObjProp'],
    function (module, controllerApi, base_diy_page, promiseApi, requestApi, $, swalApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            // 'BasemanService',
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                $scope.data = {};
                $scope.data.currItem = {};
                //数据拼接
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'dsname',
                        headerName: '名称',
                        width: 80
                    }, {
                        field: 'dstype',
                        headerName: '数据源类型',
                        width: 150,
                        type: '词汇',
                        cellEditorParams: {
                            names: ['报表数据源', '外部同步数据源','MRP数据源'],
                            values: [0 , 1 , 2]
                        }
                    }, {
                        field: 'dsip',
                        headerName: 'IP地址',
                        width: 150
                    }, {
                        field: 'note',
                        headerName: '备注',
                        width: 200
                    }]
                };
                //继承主控制器    
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //数据加载
                requestApi.post("rptds", "search", {}).then(function (data) {
                    $scope.gridOptions.api.setRowData(data.dss)
                });
                //定义按钮
                $scope.toolButtons = {
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'fa fa-minus',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    add: {
                        title: '新建',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    }
                };
                //新建
                $scope.add = function () {
                    $scope.data.currItem = {};
                    $("#rptdsModal").modal('show');
                }

                //表格双击事件
                $scope.gridOptions.onCellDoubleClicked = function (node) {
                    //打开模态框
                    $("#rptdsModal").modal('show');
                    $scope.data.currItem = node.data;
                }
                //保存方法
                $scope.save = function () {
                    if (!$scope.data.currItem.dsid) {
                        //新增
                        requestApi.post("rptds", "insert", $scope.data.currItem).then(function (data) {
                            $("#rptdsModal").modal('hide');
                            $scope.refresh();
                            return swalApi.success('保存成功!').then($q.reject);
                        });
                    } else {
                        //修改
                        requestApi.post("rptds", "update", $scope.data.currItem).then(function (data) {
                            $("#rptdsModal").modal('hide');
                            $scope.refresh();
                            return swalApi.success('保存成功!').then($q.reject);
                        });
                    }
                }
                //刷新方法
                $scope.refresh = function () {
                    requestApi.post("rptds", "search", {}).then(function (data) {
                        $scope.gridOptions.api.setRowData(data.dss)
                    });
                }

                //删除方法
                $scope.delete = function () {
                    //获取选中节点数据
                    var node = $scope.gridOptions.hcApi.getFocusedNode();
                    // console.log(node)
                    if (!node) {
                        return swalApi.info('请选中一行').then($q.reject);
                    }
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除名称为" + node.data.dsname + "的数据吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("rptds", "delete", {
                                dsid: node.data.dsid
                            }).then(function (data) {
                                //清除选中
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                                $scope.refresh();
                            });
                        },
                        okTitle: '删除成功'
                    });
                }
                //监听事件
                $scope.$watch("data",function(newVal, oldVal){
                    if($scope.data.currItem.dbtype == "Oracle"){
                        $scope.data.currItem.dbparam = "jdbc:"+$scope.data.currItem.dbtype.toLowerCase( )+":thin:@"+$scope.data.currItem.dsip+":"+$scope.data.currItem.dbport+":"+$scope.data.currItem.dbname;
                    }
                    if($scope.data.currItem.dbtype == "SQLServer2008"){
                        $scope.data.currItem.dbparam = "jdbc:"+$scope.data.currItem.dbtype.toLowerCase( )+"://"+$scope.data.currItem.dsip+":"+$scope.data.currItem.dbport+";databaseName="+$scope.data.currItem.dbname+";SelectMethod=cursor";
                    }
                    if($scope.data.currItem.dbtype == "MySQL"){
                        $scope.data.currItem.dbparam = "jdbc:"+$scope.data.currItem.dbtype.toLowerCase( )+"://"+$scope.data.currItem.dsip+":"+$scope.data.currItem.dbport+"/"+$scope.data.currItem.dbname;
                    }
                    if($scope.data.currItem.dbtype == "SQLServer"){
                        $scope.data.currItem.dbparam = "jdbc:microsoft:"+$scope.data.currItem.dbtype.toLowerCase( )+"://"+$scope.data.currItem.dsip+":"+$scope.data.currItem.dbport+";databaseName="+$scope.data.currItem.dbname+";SelectMethod=cursor";
                    }
                },true)
                //测试连接
                $scope.test = function () {
                    requestApi.post("rptds", "test", $scope.data.currItem
                    ).then(function (data) {
                        return swalApi.success('测试成功').then($q.reject);
                    });
                }
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