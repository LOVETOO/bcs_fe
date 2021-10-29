/**
 * 应付账款报表
 * huderong
 * date:2019-01-21
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi, openBizObj) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$stateParams',
                //控制器函数
                function ($scope, $stateParams) {
                    $scope.data = {};
                    $scope.data.currItem = {};
                    $scope.gridOptions = {
                        pinnedBottomRowData: [{seq: "合计"}],
                        columnDefs: [{
                            id: 'seq',
                            type: '序号'
                        }, {
                            field: 'vendor_code',
                            headerName: '供应商编码'
                        }, {
                            field: 'vendor_name',
                            headerName: '供应商名称'
                        },
                            {
                                headerName: '已开票/含税',
                                children: [
                                    {
                                        field: 'amount_lm',
                                        headerName: '本期期初',
                                        type:'金额'
                                    },
                                    {
                                        field: 'amount_in',
                                        headerName: '本期发生额',
                                        type:'金额'
                                    },
                                    {
                                        field: 'amount_out',
                                        headerName: '本期付款额',
                                        type:'金额'
                                    },
                                    {
                                        field: 'amount_blnc',
                                        headerName: '本期结余',
                                        type:'金额'
                                    }
                                ]
                            },
                            {
                                headerName: '未开票/不含税',
                                children: [
                                    {
                                        field: 'amount_lm_nobill',
                                        headerName: '本期期初',
                                        type:'金额'
                                    },
                                    {
                                        field: 'amount_in_nobill',
                                        headerName: '本期发生额',
                                        type:'金额'
                                    },
                                    {
                                        field: 'amount_out_nobill',
                                        headerName: '本期付款额',
                                        type:'金额'
                                    },
                                    {
                                        field: 'amount_blnc_nobill',
                                        headerName: '本期结余',
                                        type:'金额'
                                    }
                                ]
                            },
                            {
                                field: 'amount_sum',
                                headerName: '合计',
                                type:'金额'
                            },
                            // {
                            //     field: 'remark',
                            //     headerName: '备注'
                            // }
                        ],
                        hcObjType: $stateParams.objtypeid,
                        hcClassId: "ap_month_sum",
                        hcRequestAction: "getapmonthsumdata",
                        hcBeforeRequest: function (searchObj) {
                            angular.extend(searchObj, $scope.data.currItem);
                        },
                        hcAfterRequest: countSum,
                        hcSearchWhenReady: false,
                        onRowDoubleClicked: function (args) {
                        }
                    };


                    controllerApi.extend({
                        controller: base_diy_page.controller,
                        scope: $scope
                    });

                    /** 初始化数据 **/
                    $scope.data.currItem.ap_flag_is_off = 2;
                    $scope.data.currItem.ap_flag_is_on = 2;
                    $scope.data.currItem.order_type = 0;
                    $scope.data.currItem.year_month = new Date().Format('yyyy-MM');
                    $scope.data.currItem.endyear_month = new Date().Format('yyyy-MM');

                    /**
                     * 查开始供应商
                     * @type {{afterOk: afterOk}}
                     */
                    $scope.chooseVendor_org_begin = {
                        postData: {
                            search_flag: 5,
                            sqlwhere: " usable = 2"
                        },
                        dataRelationName: "vendor_orgs",
                        afterOk: function (response) {
                            ['vendor_id', 'vendor_code', 'vendor_name'].forEach(function (value) {
                                $scope.data.currItem['begin' + value] = response [value];
                            });
                        }
                    };

                    /**
                     * 查结束供应商
                     * @type {{afterOk: afterOk}}
                     */
                    $scope.chooseVendor_org_end = angular.copy($scope.chooseVendor_org_begin);
                    $scope.chooseVendor_org_end.afterOk = function (response) {
                        ['vendor_id', 'vendor_code', 'vendor_name'].forEach(function (value) {
                            $scope.data.currItem['end' + value] = response [value];
                        });
                    }
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

                        }

                    };

                    // 查询

                    $scope.search = function () {
                        if (!$scope.data.currItem.year_month && !$scope.data.currItem.endyear_month) {
                            swalApi.info("请先选择起始月份和终结月份");
                            return;
                        }

                        if (($scope.data.currItem.beginvendor_code && !$scope.data.currItem.endvendor_code) || (!$scope.data.currItem.beginvendor_code && $scope.data.currItem.endvendor_code)) {
                            swalApi.info("请指定正确的供应商编码范围");
                            return;
                        }

                        $('#tab11').tab('show');
                        $scope.data.lines = [];
                        return $scope.gridOptions.hcApi.search();
                    };


                    $scope.refresh = function (bizData) {
                        $scope.search();
                    };


                    $scope.export = function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    };

                    $scope.data.lines = [];

                    function countSum(data) {
                        //计算合计
                        $scope.gridOptions.api.setPinnedBottomRowData([
                            {
                                seq: '合计',
                                amount_lm: numberApi.sum(data.ap_month_sums, 'amount_lm'),
                                amount_in: numberApi.sum(data.ap_month_sums, 'amount_in'),
                                amount_out: numberApi.sum(data.ap_month_sums, 'amount_out'),
                                amount_blnc: numberApi.sum(data.ap_month_sums, 'amount_blnc'),
                                amount_lm_nobill: numberApi.sum(data.ap_month_sums, 'amount_lm_nobill'),
                                amount_in_nobill: numberApi.sum(data.ap_month_sums, 'amount_in_nobill'),
                                amount_out_nobill: numberApi.sum(data.ap_month_sums, 'amount_out_nobill'),
                                amount_blnc_nobill: numberApi.sum(data.ap_month_sums, 'amount_blnc_nobill')
                            }
                        ]);
                    }


                    /** 查出当前应付期间 **/
                    requestApi.post("gl_account_period", "search", {sqlwhere: " is_current_period_ap=2 "})
                        .then(function (data) {
                            $scope.data.current_period = data.gl_account_periods[0].year_month;
                            $scope.data.year_month = data.gl_account_periods[0].year_month;
                        })
                }
            ]
        ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);