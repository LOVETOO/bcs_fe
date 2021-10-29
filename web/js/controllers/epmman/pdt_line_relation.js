/**
 * 产品线关联设置--自定义页面
 * Created by shenguocheng
 * Date:2019-07-26
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                $scope.data = {
                    currItem: {
                        pdt_line_relations: []//定义后台关联数组
                    }
                };

                //定义表格
                $scope.gridOptions = {
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        headerName: "订单产品线",
                        field: "order_pdt_line",
                        hcDictCode: 'epm.order_pdt_line'
                    }, {
                        headerName: "产品产品线",
                        field: "pdt_line",
                        hcDictCode: 'entorgid'
                    }],
                    hcRequestAction: 'search', //打开页面前的请求方法
                    hcDataRelationName: 'pdt_line_relations',
                    hcClassId: 'pdt_line_relation'
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 取消选择订单产品线事件
                 */
                $scope.deleteOrderPDTLine = function () {
                    $scope.data.currItem.order_pdt_line = undefined;
                    $scope.search();
                };
                /**
                 * 取消选择产品产品线事件
                 */
                $scope.deletePDTLine = function () {
                    $scope.data.currItem.pdt_line = undefined;
                    $scope.search();
                };

                //定义按钮
                $scope.toolButtons = {
                    add: {
                        title: '新增',
                        icon: 'iconfont hc-add',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'iconfont hc-delete',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    search: {
                        title: '查询',
                        icon: 'iconfont hc-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
                };

                /**
                 * 查询按钮方法定义
                 */
                $scope.search = function () {
                    var action = 'search';
                    var postdata = {};
                    //查询条件判断
                    if ($scope.data.currItem.pdt_line || $scope.data.currItem.order_pdt_line) {
                        postdata.sqlwhere = '';
                        if ($scope.data.currItem.order_pdt_line) {
                            postdata.sqlwhere += 'order_pdt_line = ' + $scope.data.currItem.order_pdt_line;
                            if ($scope.data.currItem.pdt_line) {
                                postdata.sqlwhere += ' and pdt_line = ' + $scope.data.currItem.pdt_line;
                            }
                        } else {
                            postdata.sqlwhere += 'pdt_line = ' + $scope.data.currItem.pdt_line;
                        }
                    }
                    //调用后台查询方法
                    return requestApi.post("pdt_line_relation", action, postdata)
                        .then(function (response) {
                            $scope.gridOptions.hcApi.setRowData(response.pdt_line_relations);
                        });
                };
                /**
                 * 删除按钮方法定义
                 */
                $scope.delete = function () {
                    var data = $scope.gridOptions.hcApi.getFocusedData();
                    if (!data) {
                        swalApi.info('请选中要删除的行');
                        return;
                    }
                    var action = 'delete';
                    var postdata = {
                        order_pdt_line: data.order_pdt_line,
                        pdt_line: data.pdt_line
                    };
                    swalApi.confirmThenSuccess({
                        title: "确认删除？",
                        okFun: function () {
                            //调用后台删除方法
                            return requestApi.post("pdt_line_relation", action, postdata)
                                .then($scope.gridOptions.hcApi.search);
                        },
                        okTitle: '删除成功'
                    });
                };
                /**
                 * 新增按钮方法定义
                 */
                $scope.add = function () {
                    //产品产品线取词汇值
                    $modal.openCommonSearch({
                        classId: 'scpdict',
                        postData: {dictid: 11388},
                        dataRelationName: 'dict_items',
                        action: 'select',
                        title: "产品产品线",
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "产品产品线编码",
                                    field: "dictcode"
                                }, {
                                    headerName: "产品产品线名称",
                                    field: "dictname"
                                }
                            ]
                        }
                    }).result//响应数据
                        .then(function (response) {
                            return response;
                        }).then(function (data) {
                        //订单产品线取词汇值
                        $modal.openCommonSearch({
                            classId: 'pdt_line_relation',
                            postData: {
                                dictid: 13852,
                                pdt_line: data.dictvalue
                            },
                            dataRelationName: 'dict_items',
                            checkbox: true,
                            action: 'selectpdtline',
                            title: "订单产品线",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "订单产品线编码",
                                        field: "dictcode"
                                    }, {
                                        headerName: "订单产品线名称",
                                        field: "dictname"
                                    }
                                ]
                            }
                        }).result//响应数据
                            .then(function (response) {
                                var datas = [];
                                for (var i = 0; i < response.length; i++) {
                                    datas.push({
                                        pdt_line: data.dictvalue,
                                        order_pdt_line: response[i].dictvalue
                                    })
                                }
                                $scope.data.currItem.pdt_line_relations = datas;
                            }).then(function () {
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.pdt_line_relations);
                        }).then(function () {
                            //调用后台方法插入数据
                            var action = 'insert';
                            var postdata = {
                                pdt_line_relations: $scope.data.currItem.pdt_line_relations
                            };
                            // 调用后台保存方法
                            return requestApi.post("pdt_line_relation", action, postdata).then(function () {
                                $scope.gridOptions.hcApi.search();
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.pdt_line_relations);
                            }).then(function () {
                                return swalApi.success('新增成功!');
                            });
                        })
                    })
                };

            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);