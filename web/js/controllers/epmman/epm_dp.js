/**
 * 交货计划
 * @since 2019-12-09
 */
define(['module', 'controllerApi', 'base_diy_page', 'angular', 'gridApi', 'requestApi', 'swalApi', 'directive/hcInput', 'directive/hcGrid'], function (module, controllerApi, base_diy_page, angular, gridApi, requestApi, swalApi) {

    var classId = 'epm_dp';

    EPM_DP.$inject = ['$scope', '$q'];
    function EPM_DP(   $scope,   $q) {
        controllerApi.extend({
            controller: base_diy_page.controller,
            scope: $scope
        });

        $scope.toolButtons.return = {
            icon: 'iconfont hc-back',
            title: '返回',
            click: function () {
                $scope.data = null;
            },
            hide: function () {
                return !$scope.data;
            },
            disabled: function () {
                return $scope.form && $scope.form.editing;
            }
        };

        $scope.toolButtons.edit = {
            icon: 'iconfont hc-edit',
            title: '编辑',
            click: function () {
                return $scope.edit();
            },
            hide: function () {
                return !$scope.data || !$scope.form || $scope.form.editing;
            }
        };

        $scope.toolButtons.cancelEdit = {
            icon: 'iconfont hc-bohui1',
            title: '取消编辑',
            click: function () {
                return $scope.cancelEdit();
            },
            hide: function () {
                return !$scope.data || !$scope.form || !$scope.form.editing;
            }
        };

        $scope.toolButtons.save = {
            icon: 'iconfont hc-save',
            title: '保存',
            click: function () {
                return $scope.save();
            },
            hide: function () {
                return !$scope.data || !$scope.form || !$scope.form.editing;
            }
        };

        $scope.toolButtons.autoReply = {
            icon: 'iconfont hc-dingshi',
            title: '自动填写交期',
            click: function () {
                return $scope.autoReply();
            },
            hide: function () {
                return !$scope.data || !$scope.form || !$scope.form.editing;
            }
        };

        /**
         * 列表页表格
         */
        $scope.headGridOptions = {
            hcClassId: classId,
            hcEvents: {
                cellDoubleClicked: function (params) {
                    $scope.showData(params.data);
                }
            },
            columnDefs: [
                {
                    type: '序号'
                },
                {
                    field: 'year',
                    headerName: '年份',
                    cellStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    field: 'month',
                    headerName: '月份',
                    cellStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    field: 'dp_code',
                    headerName: '交期计划编码',
                    cellStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    field: 'dp_name',
                    headerName: '交期计划名称'
                },
                {
                    field: 'creator',
                    headerName: '创建人',
                    cellStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    field: 'createtime',
                    headerName: '创建时间',
                    type: '时间'
                },
                {
                    field: 'updator',
                    headerName: '修改人',
                    cellStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    field: 'updatetime',
                    headerName: '修改时间',
                    type: '时间'
                }
            ]
        };

        /**
         * 明细表格
         */
        $scope.lineGridOptions = {
            columnDefs: [
                {
                    type: '序号'
                },
                {
                    field: 'sa_salebillno',
                    headerName: '要货单号',
                    pinned: 'left'
                },
                {
                    field: 'order_line_seq',
                    headerName: '要货行号',
                    pinned: 'left',
                    cellStyle: {
                        textAlign: 'center'
                    }
                },
                {
                    field: 'item_code',
                    headerName: '产品编码',
                    pinned: 'left'
                },
                {
                    field: 'item_name',
                    headerName: '产品名称',
                    width: 200,
                    suppressAutoSize: true
                },
                {
                    field: 'in_date',
                    headerName: '期望到达日期',
                    type: '日期'
                },
                {
                    field: 'qty_bill',
                    headerName: '要货数量',
                    type: '数量'
                },
                {
                    field: 'delivery_qty',
                    headerName: '交货数量',
                    type: '数量',
                    editable: true,
                    onCellValueChanged: function (params) {
                        var newValue = +params.newValue;
                        var oldValue = +params.oldValue;

                        if (newValue < oldValue) {
                            var data = angular.copy(params.data);
                            data.dp_line_id = 0;
                            data[params.colDef.field] = oldValue - newValue;
                            params.api.updateRowData({
                                add: [data],
                                addIndex: params.node.rowIndex + 1
                            });
                        }
                    }
                },
                {
                    field: 'delivery_date',
                    headerName: '交货日期',
                    type: '日期',
                    editable: true
                },
                {
                    field: 'remark',
                    headerName: '备注',
                    editable: true
                }
            ]
        };

        /**
         * 查询数据
         */
        $scope.selectData = function (data) {
            return requestApi.post({
                classId: classId,
                action: 'select',
                data: data
            });
        };

        /**
         * 设置数据
         */
        $scope.setData = function (data) {
            $scope.data = data;

            return gridApi.execute($scope.lineGridOptions, function (gridOptions) {
                gridOptions.hcApi.setRowData($scope.data.epm_dp_lines);
            });
        };

        /**
         * 展示数据
         */
        $scope.showData = function (data) {
            return $scope.selectData(data).then($scope.setData);
        };

        /**
         * 刷新
         */
        $scope.refresh = function () {
            if ($scope.data) {
                return $scope.showData($scope.data);
            }

            return $scope.headGridOptions.hcApi.search();
        };

        /**
         * 保存数据
         */
        $scope.saveData = function () {
            return $q
                .when()
                .then(function () {
                    $scope.data.epm_dp_lines = $scope.lineGridOptions.hcApi.getRowData();

                    return requestApi.post({
                        classId: classId,
                        action: 'save',
                        data: $scope.data
                    });
                });
        };

        /**
         * 保存
         */
        $scope.save = function () {
            return $q
                .when()
                .then(function () {
                    $scope.lineGridOptions.api.stopEditing();
                })
                .then($scope.saveData)
                .then($scope.setData)
                .then(function () {
                    $scope.form.editing = false;
                    $scope.refreshEditableStyle();
                    return swalApi.success('保存成功');
                });
        };

        /**
         * 编辑
         */
        $scope.edit = function () {
            $scope.form.editing = true;
            $scope.refreshEditableStyle();
        };

        /**
         * 取消编辑
         */
        $scope.cancelEdit = function () {
            $scope.form.editing = false;
            return $scope.refresh().then($scope.refreshEditableStyle);
        };

        /**
         * 刷新可编辑样式
         */
        $scope.refreshEditableStyle = function () {
            $scope.lineGridOptions.api.refreshCells({
                columns: $scope.lineGridOptions.columnApi.getAllDisplayedColumns().filter(function (column) {
                    return column.colDef.editable;
                }),
                force: true
            });
        };

        /**
         * 自动回复
         */
        $scope.autoReply = function () {
            return $q
                .when()
                .then(function () {
                    if ($scope.lineGridOptions.hcApi.isNotEmpty()) {
                        return swalApi.confirm('交期计划已有内容，将会清除内容重新生成，确定继续？');
                    }
                })
                .then(function () {
                    return requestApi.post({
                        classId: classId,
                        action: 'auto_reply',
                        data: $scope.data
                    });
                })
                .then(function (response) {
                    [
                        'epm_dp_lines',
                        'epm_dp_orders',
                        'epm_dp_order_lines',
                        'epm_dp_items'
                    ].forEach(function (key) {
                        $scope.data[key] = response[key];
                    });

                    return gridApi.execute($scope.lineGridOptions, function (gridOptions) {
                        gridOptions.hcApi.setRowData($scope.data.epm_dp_lines);
                    });
                })
                .then(function () {
                    return swalApi.success({
                        text: '已自动填写交期，可稍作调整后保存',
                        timer: 5e3
                    });
                });
        };
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: EPM_DP
    });
});