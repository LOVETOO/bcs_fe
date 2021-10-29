/**
 * 应付账款明细报表
 * huderong
 * date:2019-01-18
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi', 'openBizObj'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi, openBizObj) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope',
                //控制器函数
                function ($scope) {
                    $scope.data = {};
                    $scope.data.currItem = {};
                    $scope.gridOptions = {
                        columnDefs: [{
                            id: 'seq',
                            type: '序号'
                        }, {
                            field: 'date_sum',
                            headerName: '日期',
                            type: '日期'
                        }, {
                            field: 'brief',
                            headerName: '摘要'
                        },
                            // {
                            //     field: 'crm_entid',
                            //     headerName: '品类',
                            //     hcDictCode: 'crm_entid'
                            // },
                            {
                                headerName: '已收票/含税',
                                children: [
                                    {
                                        field: 'creditor',
                                        headerName: '应付金额',
                                        type: '金额'
                                    },
                                    {
                                        field: 'debit',
                                        headerName: '实付金额',
                                        type: '金额'
                                    },
                                    {
                                        field: 'balance',
                                        headerName: '余额',
                                        type: '金额'
                                    }
                                ]
                            },
                            {
                                headerName: '未收票/不含税',
                                children: [
                                    {
                                        field: 'debit_f',
                                        headerName: '入库金额',
                                        type: '金额'
                                    },
                                    {
                                        field: 'creditor_f',
                                        headerName: '匹配金额',
                                        type: '金额'
                                    },
                                    {
                                        field: 'balance_f',
                                        headerName: '余额',
                                        type: '金额'
                                    }
                                ]
                            },
                            {
                                field: 'credence_no',
                                headerName: '凭证号'
                            },
                            {
                                field: 'remark',
                                headerName: '备注',
                                width: 320
                            }

                        ],
                        hcRequestAction: "getdata",
                        hcClassId: "ap_month_invoice_business",
                        hcBeforeRequest: function (searchObj) {
                            angular.extend(searchObj, $scope.data.currItem);
                        },
                        hcSearchWhenReady: false,
                        onRowDoubleClicked: function (args) {
                            // openBizObj({
                            //     stateName: 'proman.inv_in_bill_red_prop',
                            //     params:{title:"xxxxxx"}
                            // });
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
                    $scope.data.currItem.beginyear_month = new Date().Format('yyyy-MM');
                    $scope.data.currItem.endyear_month = new Date().Format('yyyy-MM');

                    /**
                     * 查供应商
                     * @type {{afterOk: afterOk}}
                     */
                    $scope.chooseVendor_org = {
                        postData: {
                            search_flag: 5,
                            sqlwhere: " usable = 2"
                        },
                        dataRelationName: "vendor_orgs",
                        afterOk: function (response) {
                            ['vendor_id', 'vendor_code', 'vendor_name'].forEach(function (value) {
                                $scope.data.currItem[value] = response [value];
                            });
                        }
                    };

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
                        $('#tab11').tab('show');
                        $scope.data.lines = [];
                        return $scope.gridOptions.hcApi.search();
                    };


                    $scope.refresh = function () {
                        $scope.search();
                    }


                    $scope.export = function () {
                        $scope.gridOptions.hcApi.exportToExcel();
                    }

                    $scope.data.lines = [];

                    /**
                     *是否开票checkbox选择事件
                     * order_type :1 为已开票
                     * @constructor
                     */
                    $scope.ChangeAp_flag = function (flag) {
                        if (parseInt($scope.data.currItem.ap_flag_is_off) === parseInt($scope.data.currItem.ap_flag_is_on)) {//全部显示
                            $scope.data.currItem.order_type = 0;
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance', 'debit_f', 'creditor_f', 'balance_f'], true);
                        }
                        else if ($scope.data.currItem.ap_flag_is_off === 1 && $scope.data.currItem.ap_flag_is_on === 2) { //只显示已开票
                            $scope.data.currItem.order_type = 1;
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance'], true);
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit_f', 'creditor_f', 'balance_f'], false);
                        }
                        else if ($scope.data.currItem.ap_flag_is_off === 2 && $scope.data.currItem.ap_flag_is_on === 1) {//只显示未开票
                            $scope.data.currItem.order_type = 2;
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit', 'creditor', 'balance'], false);
                            $scope.gridOptions.columnApi.setColumnsVisible(['debit_f', 'creditor_f', 'balance_f'], true);
                        }
                        $scope.search();
                    }

                    /** 查出当前应付期间 **/
                    requestApi.post("gl_account_period", "search", {sqlwhere: " is_current_period_ap=2 "})
                        .then(function (data) {
                            $scope.data.current_period = data.gl_account_periods[0].year_month;
                            $scope.data.currItem.year_month = data.gl_account_periods[0].year_month;
                            $scope.data.currItem.beginyear_month = $scope.data.currItem.year_month;
                            $scope.data.currItem.endyear_month = $scope.data.currItem.year_month;
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