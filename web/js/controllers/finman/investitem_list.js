/**
 * 投资项目类型-列表页
 * date:2018-11-26
 */
define(
    ['module', 'controllerApi' ,'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','BasemanService',
            //控制器函数
            function ($scope,BasemanService) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                            type: '序号'
                        }, {
                            field: 'invitem_code',
                            headerName: '投资项目编码'
                        }, {
                            field: 'invitem_name',
                            headerName: '投资项目名称'
                        }, {
                            field: 'invitem_type',
                            headerName: '投资项目类型',
                            hcDictCode:"invitem_type",
                            suppressSizeToFit:false,
                            minWidth:250
                        }, {
                            field: 'subject_no',
                            headerName: '会计科目编码',
                        }, {
                            field: 'subject_name',
                            headerName: '会计科目名称'
                        }, {
                            field: 'note',
                            headerName: '备注',
                            suppressSizeToFit:false,
                            minWidth:500,
                            maxWidth:600
                        }

                    ]
                };
                /**通用查询 */
                $scope.getSubject = function () {
                    $scope.FrmInfo = {
                        title: "会计科目",
                        thead: [{
                            name: "会计科目编码",
                            code: "km_code",
                            width: 60,
                            height: 80
                        }, {
                            name: "会计科目名称",
                            code: "km_name",
                            width: 150,
                            height: 80
                        }],
                        classid: "gl_account_subject",
                        url: "/jsp/authman.jsp",
                        direct: "center",
                        action: "search",
                        sqlBlock: "",
                        backdatas: "gl_account_subjects",
                        ignorecase: "true", //忽略大小写
                        postdata: {},
                        searchlist: ["km_code", "km_name"]
                    };
                    BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                        $scope.data.currItem.subject_no = result.km_code;
                        $scope.data.currItem.subject_name = result.km_name;
                    })
                }

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                 //单元格双击事件
                 $scope.gridOptions.onCellClicked = function (node) {
                    // $('#newModal').modal('show');
                    // console.log("11",node)
                    $scope.data.currItem = node.data;
                };


                //添加按钮
                $scope.toolButtons = {
                    refresh: {
                        title: '刷新',
                        icon: 'fa fa-refresh',
                        click: function () {
                            $scope.refresh && $scope.refresh();
                        }
                    },
                    downloadImportFormat: {
                        title: '下载导入格式',
                        icon: 'fa fa-download',
                        click: function () {
                            $scope.downloadImportFormat && $scope.downloadImportFormat();
                        }
                    },
                    import: {
                        title: '导入',
                        icon: 'glyphicon glyphicon-log-in',
                        click: function () {
                            $scope.import && $scope.import();
                        }
                    },
                    export: {
                        title: '导出',
                        icon: 'glyphicon glyphicon-log-out',
                        click: function () {
                            $scope.export && $scope.export();
                        }
                    },
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },
                    // openProp: {
                    //     title: '查看详情',
                    //     icon: '',
                    //     click: function () {
                    //         $scope.openProp && $scope.openProp();
                    //     }
                    // },
                    delete: {
                        title: '删除',
                        icon: 'fa fa-minus',
                        click: function () {
                            $scope.delete && $scope.delete();
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'fa fa-save',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    },
                    add: {
                        title: '新增',
                        icon: 'fa fa-plus',
                        click: function () {
                            $scope.add && $scope.add();
                        }
                    }
                };

                // 查询
                $scope.gridOptions.hcClassId = 'fin_investitem';
                $scope.search = function () {
                    $scope.gridOptions.api.sizeColumnsToFit();
                    //用表格产生条件，并查询
                    return $scope.gridOptions.hcApi.searchByGrid();
                };
                // 刷新
                $scope.refresh = function () {
                    //刷新即是用上此的查询条件再查询一次
                    return $scope.gridOptions.hcApi.search();
                };


                 //查看详情
                 $scope.openProp = function () {
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    var focuseData = $scope.gridOptions.hcApi.getFocusedData();
                    if (index < 0 ) {
                        return swalApi.info("请选择要查看详情的行!");
                    };
                    $('#newModal').modal('show');
                    $scope.data.currItem = focuseData ;
                };
                //删除一条数据
                $scope.delete = function () {
                    // 获取选中的行的数据
                    var focuseData = $scope.gridOptions.hcApi.getFocusedData();
                    if (!focuseData || !focuseData.invitem_id) {
                        return swalApi.info("请选择要删除的行!");
                    };
                    return swalApi.confirmThenSuccess({
                        title: "确定要删除名称为" + focuseData.invitem_name + "的项目吗?",
                        okFun: function () {
                            //函数区域
                            requestApi.post("fin_investitem", "delete", {
                                invitem_id: focuseData.invitem_id
                            }).then(function (data) {
                                $scope.refresh();
                                //清除选中
                                $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            });
                        },
                        okTitle: '删除成功'
                    });
                }
                //新增方法
                $scope.add = function () {
                    //清除选中
                    $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                    $scope.data.currItem = {};
                    // $('#newModal').modal('show');
                }
                //保存
                $scope.save = function () {
                    if (!$scope.data.currItem.invitem_name) {
                        return swalApi.error("投资项目名称不能为空!");
                    }
                    if (!$scope.data.currItem.invitem_id) {
                        //新增
                        requestApi.post("fin_investitem", "insert", $scope.data.currItem).then(function (data) {
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!");
                        });
                    } else {
                        //更新
                        requestApi.post("fin_investitem", "update", $scope.data.currItem).then(function (data) {
                            $scope.refresh();
                            //清除选中
                            $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                            return swalApi.success("保存成功!");
                        });
                    }


                }
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