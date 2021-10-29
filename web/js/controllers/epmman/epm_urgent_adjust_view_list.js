/**
 * 紧急要货插单报表
 * zengjinhua
 * 2019/12/31
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
                    columnDefs: [
                        {
                            type:'序号'
                        },
                        {
                            headerName:'申请信息',
                            children : [
                                {
                                    field:'customer_code',
                                    headerName:'客户编码'
                                },
                                {
                                    field:'customer_name',
                                    headerName:'客户名称'
                                },
                                {
                                    field:'short_name',
                                    headerName:'客户简称'
                                },
                                {
                                    field:'urgent_order_billno',
                                    headerName:'紧急要货单号'
                                },
                                {
                                    field:'item_code',
                                    headerName:'产品编码'
                                },
                                {
                                    field:'item_name',
                                    headerName:'产品名称',
                                    suppressAutoSize: true,
                                    suppressSizeToFit: true,
                                    width : 140
                                },
                                {
                                    field:'delivery_base_name',
                                    headerName:'发货基地'
                                },
                                {
                                    field:'reserved_qty',
                                    headerName:'当时保留数量',
                                    type : '数量'
                                },
                                {
                                    field:'pre_reserved_qty',
                                    headerName:'当时预占数量',
                                    type : '数量'
                                },
                                {
                                    field:'adjust_qty',
                                    headerName:'保留数量调整',
                                    valueFormatter: function (params) {
                                        if(params.data.adjust_qty != undefined 
                                            && params.data.adjust_qty != null 
                                            && params.data.adjust_qty != "" 
                                            && params.data.adjust_qty != 0){
                                                return "+" + params.data.adjust_qty
                                        }else{
                                            return params.data.adjust_qty
                                        }
                                    },
                                    cellStyle: {
                                        'text-align': 'center'
                                    }
                                }
                            ]
                        },
                        {
                            headerName:'调整信息',
                            children : [
                                {
                                    field:'adjust_customer_code',
                                    headerName:'客户编码'
                                },
                                {
                                    field:'adjust_customer_name',
                                    headerName:'客户名称'
                                },
                                {
                                    field:'adjust_urgent_order_billno',
                                    headerName:'紧急要货单号'
                                },
                                {
                                    field:'adjust_item_code',
                                    headerName:'产品编码'
                                },
                                {
                                    field:'adjust_item_name',
                                    headerName:'产品名称',
                                    suppressAutoSize: true,
                                    suppressSizeToFit: true,
                                    width : 140
                                },
                                {
                                    field:'adjust_reserved_qty',
                                    headerName:'当时保留数量',
                                    type : '数量'
                                },
                                {
                                    field:'adjust_pre_reserved_qty',
                                    headerName:'当时预占数量',
                                    type : '数量'
                                },
                                {
                                    field:'adjust_adjust_qty',
                                    headerName:'保留数量调整',
                                    valueFormatter: function (params) {
                                        if(params.data.adjust_adjust_qty != undefined 
                                            && params.data.adjust_adjust_qty != null 
                                            && params.data.adjust_adjust_qty != "" 
                                            && params.data.adjust_adjust_qty != 0){
                                                return "-" + params.data.adjust_adjust_qty
                                        }else{
                                            return params.data.adjust_adjust_qty
                                        }
                                    },
                                    cellStyle: {
                                        'text-align': 'center'
                                    }
                                }
                            ]
                        },
                        {
                            field : 'remark',
                            headerName:'备注'
                        },{
                            field:'proccuse_status',
                            headerName:'处理状态',
                            cellStyle:function (args) {
                                return {
                                    'color':args.data.proccuse_status == 'E' ? 
                                        "#F35A05": args.data.proccuse_status == '不处理'?"#5ada4a" :"#333" ,
                                    'text-align': 'center'
                                }
                            },
                            type:'词汇',
                            cellEditorParams: {
                                names: ['失败', '成功', '不处理'],
                                values: ['E', 'S', '不处理']
                            }
                        },{
                            field:'process_messag',
                            headerName:'处理信息',
                            cellStyle:function (args) {
                                return {
                                    'color':args.data.proccuse_status == 'E' ? 
                                        "#F35A05": args.data.proccuse_status == '不处理'?"#5ada4a" :"#333" 
                                }
                            },
                            suppressAutoSize: true,
                            suppressSizeToFit: true,
                            width : 150
                        },
                        {
                            field:'creator_name',
                            headerName:'操作人'
                        },
                        {
                            field:'createtime',
                            headerName:'操作时间',
                            type : '时间'
                        }
                    ],
                    hcRequestAction: 'selectadjustview', //打开页面前的请求方法
                    hcDataRelationName: 'epm_urgent_orders',
                    hcClassId: 'epm_urgent_order'
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*---------------------按钮隐藏--------------------------*/
                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
                $scope.toolButtons.filter.hide = true;
                $scope.toolButtons.refresh.hide = true;

                $scope.toolButtonGroups.more.hide = true;

                /*---------------------通用查询--------------------------*/
                /**
                 * 通用查询
                 */
                $scope.commonSearch = {
                    /*客户编码*/
                    customer_org: {
                        afterOk: function (result) {
                            $scope.searchObj.customer_code = result.customer_code;
                            $scope.searchObj.short_name = result.short_name;
                        }
                    },
                    /* 交易公司查询
                     * */
                    trading_company_name: {
                        title: '发货基地',
                        postData: {
                            search_flag: 3
                        },
                        gridOptions: {
                            columnDefs: [
                                {
                                    headerName: "发货基地编码",
                                    field: "trading_company_code"
                                }, {
                                    headerName: "发货基地名称",
                                    field: "trading_company_name"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.searchObj.delivery_base_name = result.trading_company_name;
                        }
                    },
                    /* 产品查询 */
                    item_code: {
                        postData: function () {
                            return {
                                need_price: 2
                            };
                        },
                        afterOk: function (item) {
                            $scope.searchObj.item_code = item.item_code;
                            $scope.searchObj.item_name = item.item_name;
                        }
                    }
                };

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);
