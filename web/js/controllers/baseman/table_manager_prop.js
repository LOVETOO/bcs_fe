/**
 * 路由定义属性页 - 对象属性页
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', 'Magic', '$q',
            //控制器函数
            function ($scope, $stateParams, Magic, $q) {
                /**==============================网格定义========================= */
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号',
                            headerCheckboxSelection: true,
                            checkboxSelection: true
                        },
                        {
                            field: 'column_name',
                            headerName: '列名',
                            width: 150,
                            editable: true
                        },
                        {
                            headerName: "数据库配置",
                            children: [{
                                field: 'sql_column_type',
                                headerName: '数据库字段类型',
                                // hcDictCode: 'sql_column_type',
                                width: 150,
                                editable: true
                            }, {
                                field: 'data_length',
                                headerName: '数据库字段长度',
                                type: "数量",
                                width: 150,
                                editable: true
                            }, {
                                field: 'is_primary_key',
                                headerName: '主键',
                                editable: true,
                                type: "是否"
                            }, {
                                field: 'is_not_null',
                                headerName: '不允许空值',
                                editable: true,
                                type: "是否"
                            }]
                        }, {
                            headerName: "java配置",
                            children: [{
                                field: 'java_varible_type',
                                headerName: 'java字段类型',
                                // hcDictCode: 'java_varible_type',
                                editable: true,
                                // type: '词汇',
                            }, {
                                field: 'java_authority_type',
                                headerName: 'java访问权限',
                                // hcDictCode: 'java_authority_type',
                                // type: "词汇",
                                editable: true
                            }]
                        }, {
                            field: 'comment_text',
                            headerName: '注释/网格列中文名',
                            editable: true
                        },
                        {
                            headerName: "网格配置",
                            children: [{
                                field: 'is_grid_column',
                                headerName: '网格脚本',
                                editable: true,
                                type: "是否"
                            }, {
                                field: 'hcdictcode',
                                headerName: '网格词汇',
                                editable: true,
                            }]
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 300
                        }
                    ]
                };


                /*-------------------数据定义开始------------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;

                //修改标签页标题
                $scope.tabs.base.title = '基本信息';

                //明细标签名称
                $scope.tabs_detail = {
                    grid_line: {
                        title: '列属性',
                        active: true
                    },
                    text: {
                        title: '生成脚本'
                    }
                };
                /*---------------------事件------------------------*/
                /**
                 * 新增单据时数据处理
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.is_creatied = 1;
                    bizData.create_time = new Date().Format('yyyy-MM-dd');
                    bizData.doswitch = 2;
                    bizData.table_manager_lines = [];
                    $scope.data.isInsert = true;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.api.setRowData(bizData.table_manager_lines);
                };

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

                        var data = $scope.data.currItem.table_manager_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                java_authority_type: "public",
                            };
                            data.push(newLine);
                        }

                        $scope.gridOptions.hcApi.setRowData(data);
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
                        $scope.data.currItem.table_manager_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.table_manager_lines);
                    }
                };

                /**
                 * 底部左侧按钮
                 * @since
                 */
                $scope.footerLeftButtons.add_line =
                    {
                        title: '增加行',
                        click: function () {
                            $scope.add_line && $scope.add_line();
                        },
                        hide: function () {
                            return !$scope.tabs_detail.grid_line.active;
                        }
                    };

                $scope.footerLeftButtons.del_line =
                    {
                        title: '删除行',
                        click: function () {
                            $scope.del_line && $scope.del_line();
                        },
                        hide: function () {
                            return !$scope.tabs_detail.grid_line.active;
                        }
                    };

                $scope.footerLeftButtons.setIs_grid_columnTrue =
                    {
                        title: '设置网格脚本为是',
                        click: function () {
                            $q.when()
                                .then(getSelectedRowData)
                                .then(function (rows) {
                                    rows.forEach(function (row) {
                                        row.is_grid_column = 2;
                                    })
                                    $scope.gridOptions.api.setRowData(rows);
                                })
                        },
                        hide: function () {
                            return !$scope.tabs_detail.grid_line.active;
                        }
                    };

                $scope.footerLeftButtons.setJava_authority_type =
                    {
                        title: '设置java成员访问权限',
                        click: function () {
                            var rows;
                            $q.when()
                                .then(getSelectedRowData)
                                .then(function (rows2) {
                                    rows = rows2;
                                    return swalApi.input({
                                        title: '请输入java成员权限(如: public)',
                                        inputValidator: function (value) {
                                            return ('' + value) ? '' : '权限不能为空';
                                        }
                                    });
                                })
                                .then(function (value) {
                                    rows.forEach(function (row) {
                                        row.java_authority_type = value;
                                    })
                                    $scope.gridOptions.api.setRowData(rows);
                                })
                        },
                        hide: function () {
                            return !$scope.tabs_detail.grid_line.active;
                        }
                    };

                //隐藏其他按钮，只保留增减行
                $scope.footerLeftButtons.topRow.hide = false;
                $scope.footerLeftButtons.upRow.hide = false;
                $scope.footerLeftButtons.downRow.hide = false;
                $scope.footerLeftButtons.bottomRow.hide = true;
                /**
                 * 获取选择的行
                 * @returns {*|Node[]}
                 */
                function getSelectedRowData() {
                    var SelectedRows = $scope.gridOptions.hcApi.getSelectedNodes({type: 'checkbox'});
                    if (!SelectedRows.length || SelectedRows.length < 0) {
                        swalApi.info('请先勾选行');
                        return $q.reject();
                    }
                    return SelectedRows.map(function (SelectedRow) {
                        return SelectedRow.data;
                    })
                }

                /**
                 * 底部右侧按钮
                 * @since 2018-10-05
                 */
                $scope.footerRightButtons.gettext =
                    {
                        title: '生成脚本',
                        click: function () {
                            $scope.gettext && $scope.gettext();
                        }
                    };

                $scope.footerRightButtons.updateFromDataBase =
                    {
                        title: '从数据库更新',
                        click: function () {
                            $scope.updateFromDataBase && $scope.updateFromDataBase();
                        }
                    };
                /**
                 * 生成语句
                 */
                $scope.gettext = function () {
                    requestApi.post('table_manager_head', 'gettext', $scope.data.currItem)
                        .then(function (response) {
                            $scope.data.currItem = response;
                            swalApi.info("生成脚本成功");
                        })
                };

                /**
                 * 从数据库获取脚本
                 */
                $scope.updateFromDataBase = function () {
                    //调用后台接口扫描发票
                    requestApi.post('table_manager_head', 'updateFromDataBase', $scope.data.currItem)
                        .then(function (response) {
                            $scope.data.currItem.table_manager_lines = response.table_manager_lines;
                            $scope.gridOptions.api.setRowData($scope.data.currItem.table_manager_lines);
                        })
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