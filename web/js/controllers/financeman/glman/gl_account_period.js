/**
 * 系统期间设置
 */

(function (defineFn) {
    define(['module', 'controllerApi', 'base_edit_list'], defineFn);
})(function (module, controllerApi, base_edit_list) {
    //声明依赖注入
    GlAccountPeriod.$inject = ['$scope'];
    function GlAccountPeriod($scope) {

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'year_month',
                headerName: '年月'
            }, {
                field: 'start_date',
                headerName: '开始时间',
                type:"日期"
            }, {
                field: 'end_date',
                headerName: '结束时间',
                type:"日期"
            },{
                field: 'is_current_period_ap',
                headerName: '当前应付期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_ap == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_ap',
                headerName: '应付业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_ap == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_ap',
                headerName: '应付业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_ap == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_ar',
                headerName: '当前应收期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_ar == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_ar',
                headerName: '应收业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_ar == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_ar',
                headerName: '应收业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_ar == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_inv',
                headerName: '当前存货期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_inv == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_inv',
                headerName: '存货业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_inv == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_inv',
                headerName: '存货业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_inv == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_fnd',
                headerName: '当前出纳期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_fnd == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_fnd',
                headerName: '出纳业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_fnd == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_fnd',
                headerName: '出纳业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_fnd == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_gl',
                headerName: '当前总账期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_gl == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_gl',
                headerName: '总账业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_gl == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_gl',
                headerName: '总账业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_gl == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_fee',
                headerName: '当前费用期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_fee == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_fee',
                headerName: '费用业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_fee == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_fee',
                headerName: '费用业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_fee == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_ad',
                headerName: '当前资产设备期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_ad == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_ad',
                headerName: '资产设备业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_ad == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_ad',
                headerName: '资产设备业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_ad == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            },{
                field: 'is_current_period_cs',
                headerName: '当前渠道库存期间',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_current_period_cs == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_checkout_cs',
                headerName: '渠道库存业务结账',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_checkout_cs == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'is_close_cs',
                headerName: '渠道库存业务关闭',
                type: '是否',
                cellStyle: function (params) {
                    var color = null;
                    if (params.data.is_close_cs == 2) {
                        color = 'red';
                    }
                    return {color: color};
                }
            }, {
                field: 'remark',
                headerName: '备注'
            }]
        };

        function getCurrItem() {
            return $scope.data.currItem;
        }

        controllerApi.extend({
            controller: base_edit_list.controller,
            scope: $scope
        });


        $scope.toolButtons.import.hide = true;
        $scope.toolButtons.downloadImportFormat.hide = true;
        $scope.toolButtons.add.hide = true;
        $scope.toolButtons.delete.hide = true;


    }

    controllerApi.controller({
        module: module,
        controller: GlAccountPeriod
    });
});

