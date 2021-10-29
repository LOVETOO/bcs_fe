/**
 * 订单紧急要货
 */
define(
	['module', 'controllerApi', 'base_obj_prop'],
	function (module, controllerApi, base_obj_prop) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, 
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'entorgid',
                        headerName: '产品线',
                        type : 'entorgid'
                    },
                    {
                        field: 'model',
                        headerName: '型号'
                    },
                    {
                        field: 'unit',
                        headerName: '单位'
                    },
                    {
                        field: 'qty_bill',
                        headerName: '订单数量',
                        type : '数量'
                    },
                    {
                        field: 'confirm_out_qty',
                        headerName: '已出库数量',
                        type : '数量'
                    },
                    {
                        field: 'not_shipped_qty',
                        headerName: '未出库数量',
                        type : '数量'
                    },
                    {
                        field: 'urgent_qty',
                        headerName: '紧急要货数量',
                        type : '数量'
                    },
                    {
                        field: 'discounted_price',
                        headerName: '折后单价',
                        type : '金额'
                    },
                    {
                        field: 'urgent_discounted_amount',
                        headerName: '紧急要货折后金额',
                        type : '金额'
                    },
                    {
                        field: 'pick_up_date',
                        headerName: '提货时间回复',
                        type : '日期'
                    },
                    {
                        field: 'delivery_base_name',
                        headerName: '发货基地'
                    },
                    {
                        field: '',
                        headerName: '基地库存查询'
                    },
                    {
                        field: '',
                        headerName: '库存保留数量',
                        type : '数量'
                    },
                    {
                        field: '',
                        headerName: '库存预占数量合计',
                        type : '数量'
                    },
                    {
                        field: 'intf_result',
                        headerName: '接口状态'
                    },
                    {
                        field: 'intf_info',
                        headerName: '错误信息'
                    },
                    {
                        field: '',
                        headerName: '重推'
                    }]
                };

                //表格定义  "库存保留或预占信息"
                $scope.gridOptionsLine = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        headerName: '库存保留',
                        children:[
                            {
                                field: '',
                                headerName: '日期'
                            },
                            {
                                field: '',
                                headerName: '数量'
                            }
                        ]
                    }, 
                    {
                        field: '',
                        headerName: '库存预占数量'
                    },
                    {
                        field: '',
                        headerName: '库存保留有效期至'
                    },
                    {
                        field: '',
                        headerName: '有效否'
                    }]
                };

				/*----------------------------------按钮方法数据定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_urgent_order_lines = [];
                    bizData.epm_urgent_order_line_lines = [];
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_urgent_order_lines);
                    $scope.gridOptionsLine.hcApi.setRowData(bizData.epm_urgent_order_line_lines);
                };

                /*----------------------------------按钮及标签定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return true;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return true;
                };                

            }
        ];
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: controller
    });

});