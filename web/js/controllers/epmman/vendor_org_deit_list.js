define(
    ['module', 'controllerApi', 'base_edit_list', 'directive/hcTab', 'directive/hcTabPage'],
    function (module, controllerApi, base_edit_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {}
                };

                /**
                 * 标签定义
                 */
                $scope.tabs={
                    base : {
                        title : '常规',
                        active : true
                    },
                    financial : {
                        title : '财务属性'
                    }
                };

                /**
                 * 列表定义
                 */
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: '常规',
                            children:[{
                                field: 'vendor_code',
                                headerName: '供应商编码'
                            },{
                                field: 'vendor_name',
                                headerName: '供应商名称'
                            },{
                                field: 'website',
                                headerName: '网站',
                            },{
                                field: 'email',
                                headerName: '电子邮件',
                            },{
                                field: 'tele',
                                headerName: '联系电话'
                            },{
                                field: 'fax',
                                headerName: '传真'
                            },{
                                field: 'address',
                                headerName: '供应商地址'
                            }, {
                                field: 'post_code',
                                headerName: '邮编'
                            }, {
                                field: 'contact',
                                headerName: '联系人'
                            }, {
                                field: 'usable',
                                headerName: '有效',
                                type: '是否'
                            }, {
                                field: 'is_inner',
                                headerName: '内部供应商',
                                type: '是否'
                            }, {
                                field: 'vendor_confirmed_flag',
                                headerName: '供应商确认',
                                type: '是否'
                            }, {
                                field: 'think_flag',
                                headerName: '待检入库考虑供应商未确认的订单',
                                type: '是否'
                            }, {
                                field: 'isusesystem',
                                headerName: '使用系统',
                                type: '是否'
                            }, {
                                field: 'is_intent',
                                headerName: '意向供应商',
                                type: '是否'
                            }, {
                                field: 'is_relation',
                                headerName: '关联供应商',
                                type: '是否'
                            }, {
                                field: 'is_syscreate',
                                headerName: '系统预设',
                                type: '是否'
                            }, {
                                field: 'note',
                                headerName: '备注'
                            }, {
                                field: 'stat',
                                headerName: '流程状态',
                                hcDictCode: 'stat'
                            }, {
                                field: 'buyer_code',
                                headerName: '采购员编码'
                            }, {
                                field: 'buyer_name',
                                headerName: '采购员名称'
                            }, {
                                field: 'vendor_class_code',
                                headerName: '分类编码'
                            }, {
                                field: 'vendor_class_name',
                                headerName: '分类名称'
                            }, {
                                field: 'warehouse_code',
                                headerName: '正式仓编码'
                            }, {
                                field: 'warehouse_name',
                                headerName: '正式仓名称'
                            },{
                                field: 'warehouse_code_ock',
                                headerName: '待检仓编码'
                            }, {
                                field: 'warehouse_name_ock',
                                headerName: '待检仓名称'
                            }]
                        },{
                            field: '财务信息',
                            children:[{
                                field: 'currency_code',
                                headerName: '货币编码'
                            },{
                                field: 'currency_name',
                                headerName: '货币名称'
                            }, {
                                field: 'vendortaxrate_percent',
                                headerName: '缺省税率'
                            },{
                                field: 'vendortaxno',
                                headerName: '税务登记号'
                            }, {
                                field: 'ap_invoice_type',
                                headerName: '发票产生方式',
                                hcDictCode: 'ap_invoice_type'
                            }, {
                                field: 'time_apauditing',
                                headerName: '发票匹配提前期'
                            }, {
                                field: 'bank',
                                headerName: '开户银行'
                            }, {
                                field: 'bank_accno',
                                headerName: '银行账号'
                            }, {
                                field: 'code_noinv',
                                headerName: '无票应付科目编码'
                            }, {
                                field: 'name_noinv',
                                headerName: '无票应付科目名称'
                            }, {
                                field: 'code_inv',
                                headerName: '有票应付科目编码'
                            }, {
                                field: 'name_inv',
                                headerName: '有票应付科目名称'
                            }, {
                                field: 'code_ap',
                                headerName: '应付票据科目编码'
                            }, {
                                field: 'name_ap',
                                headerName: '应付票据科目名称'
                            }]
                        },{
                            field: '其他',
                            children:[{
                                field: 'created_by',
                                headerName: '创建人'
                            },{
                                field: 'creation_date',
                                headerName: '创建时间'
                            },{
                                field: 'last_updated_by',
                                headerName: '修改人'
                            }, {
                                field: 'last_update_date',
                                headerName: '修改时间'
                            }]
                        }
                    ],

                    hcPostData : {
                        vendor_type : 2
                    }

                }

                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                /**
                 * 新增设置数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.usable=2;
                    $scope.data.currItem.vendor_type=2;
                }

                /**
                 * 通用查询函数
                 */
                //部门通用查询
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    }
                };
                //分类编码通用查询
                $scope.commonSearchSettingOfVendorClassCode = {
                    sqlWhere:"vendor_class_id>0 and vendor_class_id<4",
                    afterOk: function (result) {
                        $scope.data.currItem.vendor_class_id = result.vendor_class_id;
                        $scope.data.currItem.vendor_class_code = result.vendor_class_code;
                        $scope.data.currItem.vendor_class_name = result.vendor_class_name;
                    }
                };
                //货币编码通用查询
                $scope.commonSearchSettingOfCurrencyCode = {
                    afterOk: function (result) {
                        $scope.data.currItem.currency_code = result.currency_code;
                        $scope.data.currItem.currency_name = result.currency_name;
                    }
                };
                //无票应付通用查询
                $scope.commonSearchSettingOfCodeNoinv = {
                    afterOk: function (result) {
                        $scope.data.currItem.gl_account_subject_id_noinv = result.gl_account_subject_id;
                        $scope.data.currItem.code_noinv = result.km_code;
                        $scope.data.currItem.name_noinv = result.km_name;
                    }
                };
                //有票应付通用查询
                $scope.commonSearchSettingOfCodeInv = {
                    afterOk: function (result) {
                        $scope.data.currItem.gl_account_subject_id_inv = result.gl_account_subject_id;
                        $scope.data.currItem.code_inv = result.km_code;
                        $scope.data.currItem.name_inv = result.km_name;
                    }
                };
                //应付票据通用查询
                $scope.commonSearchSettingOfCodeAp = {
                    afterOk: function (result) {

                        $scope.data.currItem.gl_account_subject_id_ap = result.gl_account_subject_id;
                        $scope.data.currItem.code_ap = result.km_code;
                        $scope.data.currItem.name_ap = result.km_name;
                    }
                };

            }
        ]

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)