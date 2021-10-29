/**
 * 退货订单
 * zengjinhua
 * 2019/10/22
 */
define(
	['module', 'controllerApi', 'base_obj_prop'],
	function (module, controllerApi, base_obj_prop) {
        'use strict';

		EPMDiscountApplyProp.$inject = ['$scope'];
		function EPMDiscountApplyProp($scope) {

			//继承控制器
			controllerApi.extend({
				controller: base_obj_prop.controller,
				scope: $scope
			});

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
                        hcDictCode : 'entorgid'
                    },
                    {
                        field: 'item_model',
                        headerName: '产品型号'
                    },
                    {
                        field: 'qty_bill',
                        headerName: '申请数量',
                        type : '数量'
                    },
                    {
                        field: 'refund_qty',
                        headerName: '可接受退款数量',
                        type : '数量'
                    },
                    {
                        field: 'no_refund_qty',
                        headerName: '可接受不退款数量',
                        type : '数量'
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位'
                    },
                    {
                        field: 'remark',
                        headerName: '原因描述'
                    },
                    {
                        field: 'dealer_price',
                        headerName: '经销商单价',
                        type : '金额'
                    },
                    {
                        field: 'contract_price',
                        headerName: '工程方单价',
                        type : '金额'
                    },
                    {
                        field: 'contract_amount',
                        headerName: '工程方金额',
                        type : '金额'
                    },
                    {
                        field: 'capital_pool_amount',
                        headerName: '资金池金额',
                        type : '金额'
                    },
                    {
                        field: 'specs',
                        headerName: '产品规格'
                    },
                    {
                        field: 'item_color',
                        headerName: '颜色'
                    },
                    {
                        field: 'goods_cubage',
                        headerName: '体积(m³)',
                        type: '体积'
                    },
                    {
                        field: 'gross_weigth',
                        headerName: '重量(kg)'
                    },
                    {
                        field: 'cubage',
                        headerName: '总体积(m³)',
                        type: '体积'
                    },
                    {
                        field: 'tot_weight',
                        headerName: '总重量(kg)'
                    }]
                };

			/**
			 * 新增时初始化数据
			 */
			$scope.newBizData = function (bizData) {
                $scope.hcSuper.newBizData(bizData);
                bizData.sa_out_bill_lines = [];
			};

			/**
			 * 查看时设置数据
			 */
			$scope.setBizData = function (bizData) {
				$scope.hcSuper.setBizData(bizData);
				$scope.gridOptions.hcApi.setRowData(bizData.sa_out_bill_lines);
			};

			$scope.isFormReadonly = function () {
				return true;
			};
		}

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
			controller: EPMDiscountApplyProp
        });
    }
);