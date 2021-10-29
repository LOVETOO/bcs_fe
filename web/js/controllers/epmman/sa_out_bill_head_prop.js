/**
 * 工程项目订单-属性页
 * Created by shenguocheng
 * Date:2019-7-24
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                //表格定义  "工程订单明细"
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'order_pdt_line',
                        headerName: '产品线',
                        hcDictCode: 'epm.pdt_line'
                    }, {
                        field: 'item_model',
                        headerName: '型号'
                    }, {
                        field: 'qty_bill',
                        headerName: '申请数量'
                    }, {
                        field: 'price_bill',
                        headerName: '标准单价(元)',
                        type: '金额'
                    }, {
                        field: 'price_terminal',
                        headerName: '工程方单价(元)',
                        type: '金额'
                    }, {
                        field: 'discount_tax',
                        headerName: '应用折扣率'
                    }, {
                        field: 'discount_price',
                        headerName: '折后单价(元)',
                        type: '金额'
                    }, {
                        field: 'wtamount_bill',
                        headerName: '折后金额(元)',
                        type: '金额'
                    }, {
                        field: 'audit_qty',
                        headerName: '已发数量'
                    }, {
                        field: 'unshipped_qty',
                        headerName: '未发数量'
                    }, {
                        field: 'cancel_qty',
                        headerName: '取消数量'
                    }, {
                        field: 'spec',
                        headerName: '规格'
                    }, {
                        field: 'item_color',
                        headerName: '颜色'
                    }, {
                        field: 'goods_cubage',
                        headerName: '体积(m³)'
                    }, {
                        field: 'gross_weigth',
                        headerName: '重量(kg)'
                    }, {
                        field: 'cubage',
                        headerName: '总体积(m³)'
                    }, {
                        field: 'tot_weight',
                        headerName: '总重量(kg)'
                    }, {
                        field: 'uom_name',
                        headerName: '单位'
                    }, {
                        field: 'actived',
                        headerName: '是否有效'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*-------------------通用查询开始------------------------*/
                $scope.commonSearch = {
                    // 客户信息查询
                    customerCode: {
                        afterOk: function (result) {
                            $scope.data.currItem.customer_id = result.customer_id;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_name = result.customer_name;
                        }
                    },
                    // 合同信息查询
                    contractCode: {
                        afterOk: function (result) {
                            $scope.data.currItem.contract_id = result.contract_id;
                            $scope.data.currItem.contract_code = result.contract_code;
                            $scope.data.currItem.contract_name = result.contract_name;
                        }
                    },
                    // 收货人信息查询
                    takeMan: {
                        afterOk: function (result) {
                            $scope.data.currItem.contract_id = result.contract_id;
                            $scope.data.currItem.contract_code = result.contract_code;
                            $scope.data.currItem.contract_name = result.contract_name;
                        }
                    }
                };
                /*-------------------通用查询结束---------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.created_by = userbean.loginuserifnos[0].username;
                    $scope.data.currItem.sa_out_bill_lines = [];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lines);
				};
				
				/**
                 * 设置业务数据
				 * @override
                 */
				$scope.setBizData = function (bizData) {
					$scope.hcSuper.setBizData(bizData);

					$scope.gridOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lines);
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
