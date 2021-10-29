/**
 * 工程折扣申请
 * zengjinhua
 * 2020-3-26
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
	function (module, controllerApi, base_obj_prop, requestApi, swalApi) {
        'use strict';

		EPMDiscountApplyProp.$inject = ['$scope', '$q', '$stateParams'];
		function EPMDiscountApplyProp(   $scope,   $q, $stateParams) {

			//继承控制器
			controllerApi.extend({
				controller: base_obj_prop.controller,
				scope: $scope
			});

			//userbean数据放入$scope作用域
			$scope.userbean = userbean;
            $scope.data.opanRead = $stateParams.readonly;
            
            /**
             * 表格定义  "产品清单"
             */
            $scope.gridOptions = {
                hcName: '产品',
                columnDefs: [
                    {
                        type: '序号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码',
                        pinned: 'left',
                        onCellDoubleClicked: function (params) {    
                            params.api.stopEditing(true);
    
                            if (!+$scope.data.currItem.order_pdt_line) {
                                swalApi.info('请先选择订单产品线');
                                return $q.reject();
                            }

                            if (!+$scope.data.currItem.project_id) {
                                swalApi.info('请先选择报备项目');
                                return $q.reject();
                            }

                            return $modal
                                .openCommonSearch({
                                    classId: 'item_org',
                                    postData: {
                                        need_price: 2,									//需要价格
                                        order_pdt_line: $scope.data.currItem.order_pdt_line,		//订单产品线
                                        sales_channel: 3,								//销售渠道：家装
                                        item_orgs: $scope.gridOptions_product.hcApi.getRowData().map(function (line) {
                                            return {
                                                item_id: params.data.item_id == line.item_id ? 0 : line.item_id
                                            };
                                        })
                                    },
                                    beforeOk: function (item) {
                                        if (item.item_id == params.data.item_id) {
                                            swalApi.info('此产品和当前行的产品是同一个');
                                            return false;
                                        }

                                        if (params.api.hcApi.getRowData().some(function (discount_line) {
                                            return discount_line.item_id == item.item_id;
                                        })) {
                                            swalApi.info('此产品已在明细中，不能重复添加');
                                            return false;
                                        }

                                        return requestApi
                                            .post({
                                                classId: 'epm_discount_apply',
                                                action: 'generate_discount_data',
                                                data: {
                                                    customer_id: $scope.data.currItem.customer_id,
                                                    epm_discount_apply_lines: [{
                                                        item_id: item.item_id,
                                                        item_code: item.item_code
                                                    }]
                                                }
                                            })
                                            .then(function (discount_apply) {
                                                if (discount_apply.error) {
                                                    swalApi.error(discount_apply.error);
                                                    throw discount_apply.error;
                                                }

                                                return discount_apply.epm_discount_apply_lines[0];
                                            });
                                    }
                                })
                                .result
                                .then(function (new_discount_line) {
                                    angular.extend(params.data, new_discount_line);

                                    params.api.refreshCells({
                                        rowNodes: [params.node]
                                    });
                                });
                        }
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称',
                        pinned: 'left'
                    },
                    {
                        field: 'model',
                        headerName: '产品型号'
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位'
                    },
                    {
                        field: 'stand_price',
                        headerName: '标准单价(元)',
                        type: '金额',
                        hcRequired: true
                    },
                    {
                        field: 'base_discount_rate',
                        headerName: '出厂折扣率'
                    },
                    {
                        field: 'extra_discount_rate',
                        headerName: '审批折扣率'
                    },
                    {
                        field: 'discounted_price',
                        headerName: '折后单价(元)',
                        type: '金额'
                    }
                ],
                pinnedBottomRowData: [{ seq: '合计' }],
                //定义表格增减行按钮
                hcButtons: {
                    callAdd: {
                        icon: 'iconfont hc-add',
                        click: function () {
                            $scope.addProduct && $scope.addProduct();
                        },
                        hide : function(){
                            return $scope.isFormReadonly() || !$scope.form.editing;
                        }
                    },
                    invoiceDel: {
                        icon: 'iconfont hc-reduce',
                        click: function () {
                            $scope.delProduct && $scope.delProduct();
                        },
                        hide : function(){
                            return $scope.isFormReadonly() || !$scope.form.editing;
                        }
                    }
                }

            };
			

			/**
			 * 新增时初始化数据
			 */
			$scope.newBizData = function (bizData) {
				$scope.hcSuper.newBizData(bizData);
			};

			/**
			 * 查看时设置数据
			 */
			$scope.setBizData = function (bizData) {
                $scope.hcSuper.setBizData(bizData);
                
                //设置产品清单                    
                $scope.gridOptions.hcApi.setRowData(bizData.epm_discount_apply_lines);
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