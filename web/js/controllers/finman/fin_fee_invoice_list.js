/**
 * 我的发票列表页
 * @since 2018-11-06
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    //rowHeight: 65,
                    //rowStyle: {'line-height': '65px'},
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        ,{
                            field: 'is_related',
                            headerName: '已关联',
                            type: '是否'
                        }
                        , {
                            field: 'invoice_photo',
							headerName: '发票图片',
							hcImgIdField: 'doc_id'
                        }
                        , {
                            field: 'create_time',
                            headerName: '创建时间'
                        }
                        , {
                            field: 'invoice_type',
                            headerName: '发票类型',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'invoice_date',
                            headerName: '开票时间',
                            type: '日期'
                        }
                        , {
                            field: 'check_realness_stat',
                            headerName: '验真状态',
                            hcDictCode: '*'
                        }
                        , {
                            field: 'invoice_no',
                            headerName: '发票号码'
                        }
                        , {
                            field: 'invoice_checkno',
                            headerName: '发票校验码'
                        }
                        , {
                            field: 'invoice_code',
                            headerName: '发票代码'
                        }
                        , {
                            field: 'pre_tax_amt',
                            headerName: '税前金额',
                            type: '金额'
                        }
                        , {
                            field: 'tax_amt',
                            headerName: '税额',
                            type: '金额'
                        }
                        , {
                            field: 'invoice_amt',
                            headerName: '价税合计',
                            type: '金额'
                        }
                        , {
                            field: 'buyer',
                            headerName: '购买方'
                        }
                        , {
                            field: 'buyer_tax_no',
                            headerName: '购买方税号'
                        }
                        , {
                            field: 'seller',
                            headerName: '销售方'
                        }
                    ],
                    hcObjType: 2270
                };

                controllerApi.run({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

              
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
