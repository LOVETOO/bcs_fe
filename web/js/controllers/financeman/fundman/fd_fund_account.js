/**
 * 银行账户设置-编辑+列表页
 * 2018-12-14
 */
define(
    ['module', 'controllerApi', 'base_edit_list', 'numberApi'],
    function (module, controllerApi, base_edit_list, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                /**数据定义 */
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'fund_account_code',
                            headerName: '账户编码'
                        }
                        , {
                            field: 'fund_account_name',
                            headerName: '账户名称'
                        }
                        , {
                            field: 'currency_name',
                            headerName: '记账货币'
                        }
                        /* , {
                         field: 'crm_entid',
                         headerName: '品类',
                         hcDictCode: '*'
                         }*/
                        , {
                            field: 'fund_account_status',
                            headerName: '可用',
                            type: '是否'
                        }
                        , {
                            field: 'fund_account_type',
                            headerName: '账户类型',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'fund_account_property',
                            headerName: '账户类别',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'is_negative',
                            headerName: '允许负数金额',
                            type: '是否'
                        }
                        , {
                            field: 'subject_code',
                            headerName: '会计科目编码'
                        }
                        , {
                            field: 'subject_name',
                            headerName: '会计科目名称'
                        }
                        /* , {
                         field: 'subject_code_ff',
                         headerName: '财务科目编码'
                         }
                         , {
                         field: 'subject_name_ff',
                         headerName: '财务科目名称'
                         }*/
                        , {
                            field: 'bank_code',
                            headerName: '开户银行编码'
                        }
                        , {
                            field: 'bank_name',
                            headerName: '开户银行名称'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注'
                        }

                    ]
                };

                /*--------------------通用查询开始-------------------*/
                $scope.commonSearchSetting = {
                    //会计科目
                    gl_account_subject: {
                        sqlWhere: ' end_km = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.gl_account_subject_id = response.gl_account_subject_id;
                            $scope.data.currItem.subject_code = response.km_code;
                            $scope.data.currItem.subject_name = response.km_name;
                        }
                    },
                    //财务科目
                    gl_account_subject_ff: {
                        sqlWhere: ' end_km = 2',
                        afterOk: function (response) {
                            $scope.data.currItem.gl_account_subject_id_ff = response.gl_account_subject_id;
                            $scope.data.currItem.subject_code_ff = response.km_code;
                            $scope.data.currItem.subject_name_ff = response.km_name;
                        }
                    }
                };

                /**
                 * 查货币
                 */
                $scope.chooseCurrency = function () {
                    $modal.openCommonSearch({
                            classId: 'base_currency',
                            postData: {},
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.base_currency_id = result.base_currency_id;
                            $scope.data.currItem.currency_code = result.currency_code;
                            $scope.data.currItem.currency_name = result.currency_name;

                        });
                };

                /**
                 * 查开户银行
                 */
                $scope.chooseBank = function () {
                    $modal.openCommonSearch({
                            classId: 'fd_fund_bank',
                            postData: {},
                            action: 'search',
                            title: "开户银行",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "银行编码",
                                    field: "bank_code"
                                }, {
                                    headerName: "银行名称",
                                    field: "bank_name"
                                }, {
                                    headerName: "银行地址",
                                    field: "bank_address"
                                }]
                            }
                        })
                        .result//响应数据
                        .then(function (result) {
                            $scope.data.currItem.fd_fund_bank_id = result.fd_fund_bank_id;
                            $scope.data.currItem.bank_code = result.bank_code;
                            $scope.data.currItem.bank_name = result.bank_name;
                        });
                };
                /*--------------------通用查询结束-------------------*/

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.fund_account_status = 2;
                    bizData.is_nagetive = 1;
                    bizData.currency_name = '人民币';
                    bizData.base_currency_id = 1;
                };

                /**
                 * ‘账户类别’词汇值过滤
                 */
                $scope.accountPropertyFilter = function (option) {
                    //1、当账户类型为“C 现金账户”，下拉选择‘11-现金’
                    //2、当账户类型为“B 银行账户”，下拉选择‘12-备用金’‘21-基本户’‘22-保证金户’‘23-一般户’‘24-临时户’‘25-专用户’
                    //3、当账户类型为“P 票据账户”，下拉选择‘31-银行承兑汇票(三方）’‘银行承兑汇票（两方）’‘商业承兑汇票’
                    switch (numberApi.toNumber($scope.data.currItem.fund_account_type)) {
                        case 1:
                            return option.value == 1;
                        case 2:
                            return option.value == 2 || option.value == 3 || option.value == 4 ||
                                option.value == 5 || option.value == 6 || option.value == 7;
                        case 3:
                            return option.value == 8 || option.value == 9 || option.value == 10
                    }

                }

                /**
                 * 控件改变事件
                 */
                $scope.changeEvent = function (name) {
                    if ('fund_account_type' === name) {
                        $scope.data.currItem.fund_account_property = '';
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