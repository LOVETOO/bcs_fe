/**
 * 销售价目表
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', 'numberApi', 'dateApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, numberApi, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {


                function editable(args) {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '产品编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseItem(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getItem(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.api.refreshView();
                                    });
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '产品名称'

                        }
                        , {
                            field: 'saleprice_type_code',
                            headerName: '价格类型编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.choosePriceType(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                getPriceType(args.newValue)
                                    .catch(function (reason) {
                                        return {
                                            sa_saleprice_type_id: 0,
                                            saleprice_type_code: '',
                                            saleprice_type_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.api.refreshView();
                                    });
                            }
                        }
                        , {
                            field: 'saleprice_type_name',
                            headerName: '价格类型名称'
                        }
                        , {
                            field: 'start_date',
                            headerName: '生效日期',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "日期"
                        }
                        , {
                            field: 'end_date',
                            headerName: '失效日期',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "日期"
                        }
                        , {
                            field: 'price_bill',
                            headerName: '标准价',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "金额"
                        }/*,{
                         field: 'inside_balance_price',
                         headerName: '开单底价',
                         editable:function (args) {
                         return editable(args);
                         },
                         type:"金额"
                         }
                         ,{
                         field: 'wfcontrol_cost',
                         headerName: '流程控制底价',
                         editable:function (args) {
                         return editable(args);
                         },
                         type:"金额"
                         }*/, {
                            field: 'max_qty',
                            headerName: '封顶数量',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "数量"
                        }
                        , {
                            field: 'remark',
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
                 * 价格类型查询
                 */
                $scope.choosePriceType = function (args) {
                    $modal.openCommonSearch({
                            classId: 'sa_saleprice_type'
                        })
                        .result//响应数据
                        .then(function (result) {
                            if (args == 1) {
                                $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
                                $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
                                $scope.data.currItem.saleprice_type_code = result.saleprice_type_code;
                            } else {
                                args.data.saleprice_type_name = result.saleprice_type_name;
                                args.data.saleprice_type_code = result.saleprice_type_code;
                                args.data.sa_saleprice_type_id = result.sa_saleprice_type_id;
                                args.api.refreshView();
                            }
                        });
                };


                /**
                 * 查产品
                 */
                $scope.chooseItem = function (args) {
                    $modal.openCommonSearch({
                            classId: 'item_org'
                        })
                        .result//响应数据
                        .then(function (result) {
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.data.uom_id = result.uom_id;
                            args.data.uom_name = result.uom_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                function getPriceType(code) {
                    var postData = {
                        classId: "sa_saleprice_type",
                        action: 'search',
                        data: {sqlwhere: "saleprice_type_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.sa_saleprice_types.length > 0) {
                                return data.sa_saleprice_types[0];
                            } else {
                                return $q.reject("价格类型编码【" + code + "】不可用");
                            }
                        });
                }

                function getItem(code) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.item_orgs.length > 0) {
                                return data.item_orgs[0];
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
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
                    bizData.stat = 1;
                    bizData.is_cancellation = 1;
                    bizData.is_sale_promotion_price = 1;
                    bizData.start_date = dateApi.today();
                    bizData.end_date = "9999-12-31";
                    bizData.create_time = dateApi.now();
                    bizData.sa_saleprice_lineofsa_saleprice_heads = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.sa_saleprice_lineofsa_saleprice_heads);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.sa_saleprice_lineofsa_saleprice_heads);
                };

                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };


                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if ($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;

                        if (!line.item_id)
                            reason.push('第' + row + '行产品不能为空');

                        if (!line.sa_saleprice_type_id)
                            reason.push('第' + row + '行价格类型不能为空');

                    });
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

                        var data = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                sa_saleprice_type_id: $scope.data.currItem.sa_saleprice_type_id,
                                saleprice_type_code: $scope.data.currItem.saleprice_type_code,
                                saleprice_type_name: $scope.data.currItem.saleprice_type_name,
                                start_date: $scope.data.currItem.start_date,
                                end_date: $scope.data.currItem.end_date,
                                is_cancellation: 1,
                                base_currency_id: 1
                            };
                            data.push(newLine);
                        }

                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
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
                        $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
                    }
                };


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
