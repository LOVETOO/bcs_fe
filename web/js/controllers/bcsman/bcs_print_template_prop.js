/**
 * 打印模板维护
 * @since 2020-2-24
 * 巫奕海
 */
define(
    ['module', 'lodop', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, lodop, controllerApi, base_obj_prop, requestApi, swalApi) {
        var controller = [
            '$scope', '$modal',
            function ($scope, $modal) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'itemcode',
                        headerName: '产品编号',
                        editable: true,
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            if ($scope.hcSuper.isFormReadonly()) {
                                return;
                            }
                            $scope.searchitemcode(args);
                        }
                    }]
                }

                /**
                * 表格定义
                */
                $scope.gridOptions_itemclass = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'big_category_code',
                        headerName: '大类编码',
                        editable: false,
                        hcRequired: true
                    }, {
                        field: 'bigcategoryname',
                        headerName: '大类名称',
                        editable: false,
                        hcRequired: true
                    }, {
                        field: 'middlecategroycode',
                        headerName: '中类编码',
                        editable: false,
                        hcRequired: true
                    }, {
                        field: 'middlecategroyname',
                        headerName: '中类名称',
                        editable: false,
                        hcRequired: true
                    }, {
                        field: 'smallcategorycode',
                        headerName: '小类编码',
                        editable: true,
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            if ($scope.hcSuper.isFormReadonly()) {
                                return;
                            }
                            $scope.searchitemclass(args);
                        }
                    }, {
                        field: 'smallcategoryname',
                        headerName: '小类名称',
                        editable: true,
                        hcRequired: true,
                        onCellDoubleClicked: function (args) {
                            if ($scope.hcSuper.isFormReadonly()) {
                                return;
                            }
                            $scope.searchitemclass(args);
                        }
                    }]
                };

                //表格切换定义
                $scope.reftab = {
                    itemclass: {
                        title: '关联产品分类',
                        active: true
                    },
                    item: {
                        title: '关联产品'
                    }
                };

                $scope.searchitemcode = function (args) {
                    $modal.openCommonSearch({
                        classId: 'bcs_item',
                        action: 'search',
                        title: '产品编码查询',
                        dataRelationName: "bcs_items",
                        gridOptions: {
                            columnDefs: [
                                {
                                    field: 'itemcode',
                                    headerName: '产品编码',
                                }, {
                                    field: 'itemname',
                                    headerName: '产品名称',
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            args.data.itemcode = result.itemcode;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 查询产品分类
                 */
                $scope.searchitemclass = function (args) {
                    $modal.openCommonSearch({
                        classId: 'bcs_item_class',
                        action: 'search',
                        title: '产品分类查询',
                        dataRelationName: "bcs_item_classs",
                        gridOptions: {
                            columnDefs: [
                                {
                                    field: 'big_category_code',
                                    headerName: '大类编码',
                                }, {
                                    field: 'bigcategoryname',
                                    headerName: '大类名称',
                                }, {
                                    field: 'middlecategroycode',
                                    headerName: '中类编码',
                                }, {
                                    field: 'middlecategroyname',
                                    headerName: '中类名称',
                                }, {
                                    field: 'smallcategorycode',
                                    headerName: '小类编码',
                                }, {
                                    field: 'smallcategoryname',
                                    headerName: '小类名称',
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function (result) {
                            args.data.big_category_code = result.big_category_code;
                            args.data.bigcategoryname = result.bigcategoryname;
                            args.data.middlecategroycode = result.middlecategroycode;
                            args.data.middlecategroyname = result.middlecategroyname;
                            args.data.smallcategorycode = result.smallcategorycode;
                            args.data.smallcategoryname = result.smallcategoryname;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                $scope.getPrint = function () {
                    var LODOP = getLodop();
                    eval($scope.data.currItem.temp_content);
                    if (LODOP.CVERSION) CLODOP.On_Return = function (TaskID, Value) {
                        var index = Value.indexOf('\n')
                        Value = Value.substring(index + 1, Value.length);
                        $scope.data.currItem.temp_content = Value;
                    };
                    LODOP.PRINT_DESIGN();
                }

                $scope.chooseFile = function () {
                    fileApi.uploadFile({
                        multiple: false
                    }).then(function (docs) {
                        $scope.data.currItem.docid = docs[0].docid;
                        $scope.data.currItem.filename = docs[0].docname
                    });
                }

                $scope.downLoadFile = function () {
                    fileApi.downloadFile($scope.data.currItem.docid);
                }

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow = {
                    title: '新增',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: false
                };

                $scope.footerLeftButtons.deleteRow = {
                    title: '删除',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: false
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加明细
                $scope.add_line = function () {
                    if ($scope.reftab.itemclass.active) {
                        $scope.data.currItem.bcs_print_itemclasss.push({});
                        $scope.gridOptions_itemclass.hcApi.setRowData($scope.data.currItem.bcs_print_itemclasss);
                    } else {
                        $scope.data.currItem.bcs_print_template_lines.push({});
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_print_template_lines);
                    }
                };
                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var grid = $scope.gridOptions;
                    //分类选中
                    if ($scope.reftab.itemclass.active) {
                        grid = $scope.gridOptions_itemclass;
                    }
                    var idx = grid.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                    } else {
                        if ($scope.reftab.itemclass.active) {
                            //删除元素
                            $scope.data.currItem.bcs_print_itemclasss.splice(idx, 1);
                            grid.hcApi.setRowData($scope.data.currItem.bcs_print_itemclasss);
                        } else {
                            $scope.data.currItem.bcs_print_template_lines.splice(idx, 1);
                            grid.hcApi.setRowData($scope.data.currItem.bcs_print_template_lines);
                        }
                    }

                    // if ($scope.data.currItem.bcs_print_template_lines.length <= 0) {
                    //     var data = $scope.data.currItem.bcs_print_template_lines;
                    //     var newLine = {
                    //         addorsub_type: 1
                    //     };
                    //     data.push(newLine);
                    //     $scope.gridOptions.hcApi.setRowData(data);
                    // }
                };

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_print_template_lines);
                    $scope.gridOptions_itemclass.hcApi.setRowData($scope.data.currItem.bcs_print_itemclasss);
                };
                $scope.newBizData = function (bizData) {
                    bizData.bcs_print_template_lines = [];
                    bizData.bcs_print_itemclasss = [];
                    bizData.inneruse = 2;
                    bizData.outeruse = 2;
                    $scope.hcSuper.newBizData(bizData);
                };
            }];


        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });