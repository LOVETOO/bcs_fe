/**
 * 工程要货单 - 详情页
 * @since 2019-07-31
 */
define(['module', 'controllerApi', 'base_obj_prop', 'jquery', 'angular', 'dateApi', 'controllers/epmman/epmman', 'requestApi', 'swalApi', 'gridApi', 'numberApi', 'Decimal', 'directive/hcModal'], function (module, controllerApi, base_obj_prop, $, angular, dateApi, epmman, requestApi, swalApi, gridApi, numberApi, Decimal) {

    EPMRequireBillProp.$inject = ['$scope', '$q', '$modal', '$stateParams'];
    function EPMRequireBillProp(   $scope,   $q,   $modal,   $stateParams) {
        //继承
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        /** 存在紧急要货 */
        $scope.thereEmergency = false;

        /**
         * 是否订单状态为审核拒绝
         */
        $scope.hideSubscriptionBut = true;
        $scope.hideOASubscriptionBut = true;
        $scope.hideOASubscriptionButOrder = true;

        /**
         * 是否有定金金额
         */
        $scope.isHaveMoney = false;

        /**
         * 要货单号是否有值
         */
        $scope.invoiceNoValue = true;

        /**
         * 表格
         */
        $scope.gridOptions = {
            hcName: '要货产品',
            hcRequired: true,
            defaultColDef: {
                editable: function (params) {
                    if (params.node.rowPinned) {
                        return false;
                    }

                    return ['qty_bill', 'note'].includes(params.colDef.field);
                }
            },
            columnDefs: [
                {
                    type: '序号'
                },
                {
                    field: 'reject_reason',
                    headerName: '拒绝原因',
                    pinned: 'left',
                    hide: true,
                    cellStyle: {
                        'color': '#F35A05'
                    },
                    headerClass: 'reasonClass',
                    width: 200,
                    suppressAutoSize: true,
                    suppressSizeToFit: true
                },
                {
                    field: 'item_code',
                    headerName: '产品编码',
                    pinned: 'left',
                },
                {
                    field: 'custom_item_code',
                    headerName: '定制产品编码',
                    hide: true
                },
                {
                    field: 'item_name',
                    headerName: '产品名称',
                    width: 240,
                    suppressAutoSize: true,
                    suppressSizeToFit: true
                },
                {
                    field: 'entorgid',
                    headerName: '产品线',
                    hcDictCode: 'entorgid'
                },
                {
                    field: 'item_model',
                    headerName: '型号'
                },
                {
                    field: 'active_qty',
                    headerName: '可下单数量',
                    type: '数量'
                },
                {
                    field: 'qty_bill',
                    headerName: '本次下单数量',
                    type: '数量',
                    onCellValueChanged: function (params) {
                        $scope.cal();
                    },
                    hcRequired: true
                },
                {
                    field: 'confirm_out_qty',
                    headerName: '已发数量',
                    type: '数量',
                    hide : true
                },
                {
                    field: 'send_qty',
                    headerName: '未发数量',
                    type: '数量',
                    valueGetter: function (params) {
                        return numberApi.sub(numberApi.sub(params.data.qty_bill,params.data.confirm_out_qty),params.data.cancel_qty); 
                    },
                    hide : true
                },
                {
                    field: 'cancel_qty',
                    headerName: '取消数量',
                    type: '数量',
                    hide : true
                },
                {
                    field: 'price_bill',
                    headerName: '标准单价(元)',
                    type: '金额'
                },
                {
                    field: 'contract_price',
                    headerName: '工程方单价(元)',
                    type: '金额'
                },
                {
                    field: 'discount_rate',
                    headerName: '应用折扣率'
                },
                {
                    field: 'discounted_price',
                    headerName: '折后单价(元)',
                    type: '金额'
                },
                {
                    field: 'wtamount_bill',
                    headerName: '折后金额',
                    type: '金额'
                },
                {
                    field: 'specs',
                    headerName: '规格'
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
                },
                {
                    field: 'uom_name',
                    headerName: '单位'
                },
                {
                    field: 'is_cancel',
                    headerName: '取消',
                    type: '是否'
                },
                {
                    field: 'note',
                    headerName: '备注'
                }
            ],
            pinnedBottomRowData: [{seq: '合计'}]
        };

        /**
         * 通用查询
         */
        $scope.commonSearch = {

            //折扣单号
            discount_apply_code: {
                title: '请选择折扣单',
                postData: function () {
                    return {
                        search_flag: 2, //查询场景：要货单下单时
                        customer_id: customer ? customer.customer_id : 0,
                        discount_apply_id: $scope.data.currItem.discount_apply_id,
                        sa_out_bill_head_id: $scope.data.currItem.sa_out_bill_head_id
                    };
                },
                beforeOk: function (discount_apply) {
                    return requestApi
                        .post({
                            classId: 'sa_out_bill_head',
                            action: 'get_data_by_epm_discount_apply', //根据工程折扣单获取数据
                            data: {
                                discount_apply_id: discount_apply.discount_apply_id,
                                sa_out_bill_head_id: $scope.data.currItem.sa_out_bill_head_id
                            }
                        })
                        .then(function (require_bill) {
                            if (require_bill.error) {
                                swalApi.error(require_bill.error);
                                throw require_bill.error;
                            }

                            return require_bill;
                        });
                },
                afterOk: function (sa_out_bill_head) {
					setHeadDataBySaOutBill(sa_out_bill_head);

					clearLineData();

                    //添加折扣明细
                    return $scope.addDiscountLine();
                }
            },

            //收货人
			take_man: {
                title: '客户地址',
                postData: function () {
                    return {
                        search_flag: 1, //查询场景：客户地址
                        customer_id: $scope.data.currItem.customer_id
                    };
                },
                beforeOpen: function () {
                    if (!+$scope.data.currItem.customer_id) {
                        swalApi.info('请先选择折扣单');
                        return false;
                    }
                },
                afterOk: function (customer_address) {
                    [
						'take_man',					//收货人
						'phone_code',				//联系电话
						'customer_address_id',		//收货地址ID
						'address',					//收货地址
						'province_id',				//省ID
						'province_name',			//省名称
						'city_id',					//市ID
						'city_name',				//市名称
						'county_id',				//县ID
						'county_name'				//县名称
                    ].forEach(function (key) {
                        $scope.data.currItem[key] = customer_address[key];
					});

                    $scope.data.currItem.address1 = customer_address.address;
                },
                gridOptions: {
                    columnDefs: [
                        {
                            field: 'address',
                            headerName: '收货地址'
                        },
                        {
                            field: 'take_man',
                            headerName: '收货人'
                        },
                        {
                            field: 'phone_code',
                            headerName: '联系电话'
						},
						{
							field: 'province_name',
							headerName: '省'
						},
						{
							field: 'city_name',
							headerName: '市'
						},
						{
							field: 'county_name',
							headerName: '区/县'
						}
                    ]
                }
            }

		};
		
		/**
		 * 设置表头数据
		 * @param sa_out_bill_head
		 */
		function setHeadDataBySaOutBill(sa_out_bill_head) {
			[
                /* ==================== 折扣信息 ==================== */
                'discount_apply_id',		            //折扣单ID
                'discount_apply_code',		            //折扣单号
                'discount_valid_date',		            //折扣有效期
                'discount_type',			            //折扣类型
                'discount_rate',			            //折扣率
                'order_pdt_line',			            //订单产品线
                'is_cal_ad',			                //计广告费
                'is_cal_second_year_discount',			//计次年折扣

                /* ==================== 客户信息 ==================== */
                'customer_id',				            //客户ID
                'customer_code',			            //客户编码
                'customer_name',			            //客户名称
                'take_man',					            //收货人
                'phone_code',				            //联系电话
                'customer_address_id',		            //收货地址ID
                'address1',					            //收货地址
                'province_id',				            //省ID
                'province_name',			            //省名称
                'city_id',					            //市ID
                'city_name',				            //市名称
                'county_id',				            //县ID
                'county_name',				            //县名称
                'account_name',				            //余额账户

                /* ==================== 项目信息 ==================== */
                'project_id',				            //项目ID
                'project_code',				            //项目编码
                'project_name',				            //项目名称
                'stage_id',					            //项目阶段ID
                'stage_name',				            //项目阶段名称

                /* ==================== 合同信息 ==================== */
                'contract_id',				            //合同ID
                'contract_code',			            //合同编码
                'contract_name',			            //合同名称
                'contract_expire_date',		            //合作结束时间
                'contract_type',			            //签约类型
                'trading_company_id',		            //交易公司ID
                'trading_company_name',		            //交易公司名称
                'billing_unit_id',			            //开票单位ID
                'billing_unit_name'			            //开票单位名称
			].forEach(function (key) {
				$scope.data.currItem[key] = sa_out_bill_head[key];
			});
		}

		/**
		 * 添加明细数据
		 * @param sa_out_bill_head
		 */
		function addLineDataBySaOutBill(sa_out_bill_head) {
			$scope.data.currItem.sa_out_bill_lines.smartPush(sa_out_bill_head.sa_out_bill_lines);

			return gridApi.execute($scope.gridOptions, function (gridOptions) {
				gridOptions.api.updateRowData({
					add: sa_out_bill_head.sa_out_bill_lines
				});

				$scope.cal();
			});
		}

		/**
		 * 清除明细数据
		 */
		function clearLineData() {
			$scope.data.currItem.sa_out_bill_lines = [];

			return gridApi.execute($scope.gridOptions, function (gridOptions) {
				gridOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lines);

				$scope.cal();
			});
		}

        /**
         * 计算
         */
        $scope.cal = function () {
            $scope.data.currItem.sa_out_bill_lines.forEach(function (line) {
				function mutiply(resultKey, multiplierKeys, scale) {
					var result;

					if (multiplierKeys.length) {
						var multipliers = multiplierKeys.map(function (key) {
							return numberApi.normalizeAsNumber(line[key]);
						});

						if (multipliers.some(function (multiplier) {
							return multiplier === '';
						})) {
							result = '';
						}
						else {
							result = Decimal(multipliers.shift());

							multipliers.forEach(function (multiplier) {
								result = result.mul(multiplier);
							});

							result = result.toFixed(scale);
						}
					}
					else {
						result = '';
					}

					line[resultKey] = result;
				}

                //【每行总体积】=【申请数量】×【体积】
                mutiply('cubage', ['qty_bill', 'goods_cubage']);

                //【每行总重量】=【申请数量】×【重量】
                mutiply('tot_weight', ['qty_bill', 'gross_weigth']);

                //【折前金额】=【申请数量】×【标准单价】x【出厂折扣率】
                mutiply('wtamount_billing', ['qty_bill', 'price_bill', 'base_discount_rate']);

				//【折后金额】=【申请数量】×【折后单价】
				mutiply('wtamount_bill', ['qty_bill', 'discounted_price']);
            });

            //合计
            $scope.total();
        };

        /**
         * 合计
         */
        $scope.total = function () {
            var totalData = $scope.gridOptions.api.getPinnedBottomRow(0).data;

            [
                'qty_bill',					//申请数量
                'cubage',					//总体积
                'tot_weight',				//总重量
                'wtamount_billing',			//折前金额
                'wtamount_bill',			//折后金额
                'confirm_out_qty',          //已发数量
                'cancel_qty'                //取消数量
            ].forEach(function (key) {
                totalData[key] = numberApi.sum($scope.data.currItem.sa_out_bill_lines, key);
            });

            $scope.gridOptions.api.refreshCells({
                columns: [
                    'qty_bill',				//申请数量
                    'cubage',				//总体积
                    'tot_weight',			//总重量
                    'wtamount_billing',		//折前金额
                    'wtamount_bill',		//折后金额
                    'confirm_out_qty',      //已发数量
                    'cancel_qty'            //取消数量
                ]
            });

            $scope.data.currItem.qty_sum = totalData.qty_bill;
            $scope.data.currItem.total_cubage = totalData.cubage;
            $scope.data.currItem.total_weight = totalData.tot_weight;
            $scope.data.currItem.amount_total = totalData.wtamount_billing;
            $scope.data.currItem.wtamount_bill = totalData.wtamount_bill;
        };

        /**
         * 新增时对业务对象的处理
         * @override
         */
        $scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData);

            //事业部
            bizData.division_id = epmman.getDivision().division_id;

            //要货日期
            bizData.date_invbill = dateApi.today();

            //申请人
            bizData.created_by = user.userid;

            //订单类型：【1-常规】
            bizData.bill_type = 1;

            //销售渠道：【4-工程】
            bizData.channel = 4;

            //扣款方式：【1-货款】
            bizData.deductions_way = 1;

            //订单来源：【1-手工创建】
			bizData.created_source = 1;
			
			//业务类型：【1-常规】
			bizData.business_type = 1;

            //若是客户账号
            if (customer) {
                [
                    'customer_id',				//客户ID
                    'customer_code',			//客户编码
					'customer_name',			//客户名称
					'customer_address_id',		//收货地址ID
                    'take_man',					//收货人
                    'phone_code',				//联系电话
					'address',					//收货地址
					'city_id',					//市ID
					'city_name',				//市名称
					'county_id',				//县ID
					'county_name'				//县名称
                ].forEach(function (key) {
                    bizData[key] = customer[key];
				});
				
				bizData.province_id = customer.provice_id;		//省ID
				bizData.province_name = customer.provice_name;	//省名称

				bizData.address1 = customer.address;
            }

			bizData.sa_out_bill_lines = [];
			
			var discount_apply_id = +$stateParams.discount_apply_id;
			if (discount_apply_id) {
				var discount_apply_line_ids = $stateParams.discount_apply_line_id;

				if (!Array.isArray(discount_apply_line_ids)) {
					discount_apply_line_ids = [discount_apply_line_ids];
				}

				var sa_out_bill_head;

				return requestApi
					.post({
						classId: 'sa_out_bill_head',
						action: 'get_data_by_epm_discount_apply', //根据工程折扣单获取数据
						data: {
							discount_apply_id: discount_apply_id,
							include_line: 2,
							sa_out_bill_lines: discount_apply_line_ids.map(function (discount_apply_line_id) {
								return {
									discount_apply_line_id: discount_apply_line_id
								};
							})
						}
					})
					.then(function () {
						sa_out_bill_head = arguments[0];

						if (sa_out_bill_head.error) {
							swalApi.error(sa_out_bill_head.error);
							throw sa_out_bill_head.error;
						}
					})
					.then(function () {
						return setHeadDataBySaOutBill(sa_out_bill_head);
					})
					.then(function () {
						return addLineDataBySaOutBill(sa_out_bill_head);
					});
			}
        };

        /**
         * 设置业务数据
         * @override
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);

            //判断是否有要货订单号
            if($scope.data.currItem.sa_salebillno != null
                && $scope.data.currItem.sa_salebillno != undefined
                && $scope.data.currItem.sa_salebillno != ""){
                //有值
                $scope.invoiceNoValue = true;
            }else{
                $scope.invoiceNoValue = false;
            }

            /**
             * 校验订金按钮是否隐藏
             */
            if($scope.data.currItem.sa_salebillno != null
                && $scope.data.currItem.sa_salebillno != undefined
                && $scope.data.currItem.sa_salebillno != "" 
                && $scope.data.currItem.order_stat != 4){
                $scope.hideSubscriptionBut = true;
            }else{
                $scope.hideSubscriptionBut = false;
            }

            /**
             * 校验生成CRM订单按钮
             */
            if($scope.data.currItem.nodeposit_oa_audit_stat == 0 
                || $scope.data.currItem.nodeposit_oa_audit_stat == 4
                || $scope.data.currItem.nodeposit_oa_audit_stat == 99){
                $scope.hideOASubscriptionButOrder = false;
            }else{
                $scope.hideOASubscriptionButOrder = true;
            }
            

            /**
             * OA审批状态判断
             */
            if($scope.data.currItem.nodeposit_oa_audit_stat == 0 || $scope.data.currItem.nodeposit_oa_audit_stat == 99){
                $scope.hideOASubscriptionBut = false;
            }else{
                $scope.hideOASubscriptionBut = true;
            }

            gridApi.execute($scope.gridOptions, function (gridOptions) {
                /* if($scope.data.currItem.stat == 5){
                    $scope.gridOptions.columnDefs[7].hide = false;
                    $scope.gridOptions.columnDefs[8].hide = false;
                    $scope.gridOptions.columnDefs[9].hide = false;
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                }else{
                    $scope.gridOptions.columnDefs[7].hide = true;
                    $scope.gridOptions.columnDefs[8].hide = true;
                    $scope.gridOptions.columnDefs[9].hide = true;
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                } */

                //【单据状态】=【5-已审核】时，才显示【已发数量】、【未发数量】、【取消数量】
                gridOptions.columnApi.setColumnsVisible(['confirm_out_qty', 'send_qty', 'cancel_qty'], bizData.stat == 5);

                /* if($scope.data.currItem.order_stat == 4){
                    $scope.gridOptions.columnDefs[23].hide = false;
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                }else{
                    $scope.gridOptions.columnDefs[23].hide = true;
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                } */

                //【订单状态】=【4-审核拒绝】时，才显示【拒绝原因】
                gridOptions.columnApi.setColumnsVisible(['reject_reason'], bizData.order_stat == 4);

                //【订单类型】=【3-定制订单】时，才显示【定制产品编码】
                gridOptions.columnApi.setColumnsVisible(['custom_item_code'], bizData.bill_type == 3);

                gridOptions.hcApi.setRowData(bizData.sa_out_bill_lines);

                /* var totalNode = gridOptions.api.getPinnedBottomRow(0),
                    totalData = totalNode.data;

                totalData.qty_bill = bizData.qty_sum;
                totalData.cubage = bizData.total_cubage;
                totalData.tot_weight = bizData.total_weight;
                totalData.wtamount_billing = bizData.amount_total;
                totalData.wtamount_bill = bizData.wtamount_bill; */

                //合计
                $scope.total();
                // gridOptions.api.refreshCells({
                //     rowNodes: [totalNode]
                // });
                isSendStat ();
                if($scope.data.currItem.deposit_amt != undefined 
                    && $scope.data.currItem.deposit_amt != null 
                    && $scope.data.currItem.deposit_amt != ""
                    && $scope.data.currItem.deposit_amt != 0){
                    $scope.isHaveMoney = true;
                }
            });
        };

        //判断是否为EBS退回
        function isSendStat (){
            if($scope.data.currItem.order_stat == 11){//EBS退回状态
                //查询是否存在未审批完成的紧急要货
                return requestApi
                    .post({
                        classId: 'epm_urgent_order',
                        action: 'noapproval',
                        data: {
                            sa_out_bill_head_id: $scope.data.currItem.sa_out_bill_head_id
                        }
                    })
                    .then(function (data) {
                        if (data.epm_urgent_orders.length > 0) {//存在
                            $scope.thereEmergency = true;
                            $scope.isFormReadonly = function () {
                                return true;
                            };
                            $scope.data.currItem.return_reason += '【EPMS校验】该销售订单存在有未审核完毕的紧急要货订单，'
                            + '不可对其进行退回修改，请将订单直接重新提交至CRM。';
                        }
                    });
            }else{
                $scope.thereEmergency = false;
            }
        }

        /**
         * 校验
         * @override
         */
        $scope.validCheck = function (invalidBox) {
            $scope.hcSuper.validCheck(invalidBox);

            var rows = [];

            $scope.data.currItem.sa_out_bill_lines.forEach(function (sa_out_bill_line, i) {
                if (!sa_out_bill_line.qty_bill) {
                    return;
                }

                var qty_bill = numberApi.toNumber(sa_out_bill_line.qty_bill);

                if (qty_bill > 0) {
                    return;
                }

                rows.push(i + 1);
            });

            if (rows.length) {
                invalidBox.push(
                    '',
                    '申请数量必须大于0，以下行不合法：',
                    '第' + rows.join('、') + '行'
                );
            }
        };

        $scope.data.currGridOptions = $scope.gridOptions;
        $scope.data.currGridModel = 'data.currItem.sa_out_bill_lines';

        /**
         * 定义按钮
         */
        $scope.footerRightButtons.loseEfficacyButtom = {
            title: '生成crm订单',
            click: function () {
                return swalApi.confirm("确定要生成crm订单吗?").then(function () {
                    return requestApi
                        .post("sa_out_bill_head", "creatCrmOrder", {
                            "sa_out_bill_head_id": $scope.data.currItem.sa_out_bill_head_id,
                            "customer_id" : $scope.data.currItem.customer_id
                        })
                        .then($scope.setBizData)
                        .then(function(){
                            swalApi.info("生成成功!");
                        });
                });
            },
            hide : function () {
                if($scope.thereEmergency){
                    return false;
                }else{
                    return $scope.$eval('form.editing || isFormReadonly() || hideOASubscriptionButOrder');
                }
            }
        };
        //按钮：申请不扣订金
        $scope.footerRightButtons.applyTravelSubscription = {
            title: '申请不扣订金',
            click: function () {
                $scope.applicationOA.open({//打开模态框
                    controller: ['$scope',
                        function ($modalScope) {
                            $modalScope.title = "申请不扣订金原因填写";
                            angular.extend($modalScope.footerRightButtons, {
                                ok: {
                                    title: '送签至OA',
                                    click: function () {
                                        if($modalScope.nodeposit_desc == null
                                            || $modalScope.nodeposit_desc == undefined
                                            || $modalScope.nodeposit_desc == ""){
                                            swalApi.error("申请原因未填写!");
                                        }else{
                                            return requestApi
                                                .post({
                                                    classId: 'sa_out_bill_head',
                                                    action: 'applicationoa',
                                                    data: {
                                                        sa_out_bill_head_id: $scope.data.currItem.sa_out_bill_head_id,
                                                        nodeposit_desc: $modalScope.nodeposit_desc
                                                    }
                                                })
                                                .then($scope.setBizData)
                                                .then(function(){//后续处理
                                                    swalApi
                                                        .info("申请发送成功")
                                                        .then(function(){
                                                            $modalScope.$close();
                                                        });
                                                });
                                        }
                                    }
                                }
                            });
                        }]
                })
            },
            hide : function () {
                return $scope.$eval('form.editing || isFormReadonly() || data.currItem.bill_type != 1 || hideSubscriptionBut || data.currItem.is_nodeposit == 2 || hideOASubscriptionBut == true');
            }
        };
        /* 底部右边按钮-打印 */
        $scope.footerRightButtons.print.hide = function(){
            return $scope.data.currItem.stat != 5;
        };

        /* 底部右边按钮-编辑 */
        $scope.footerRightButtons.edit.hide = function(){
            return $scope.$eval('form.editing || isFormReadonly() || data.currItem.nodeposit_oa_audit_stat != 0');
        };

        /**
         * 标签页切换事件
         */
        $scope.onTabChange = function (params) {
            $q
                .when(params)
                .then($scope.hcSuper.onTabChange)
                .then(function () {
                    Switch(params.id)
                        .case('base', function () {
                            $scope.data.currGridOptions = $scope.gridOptions;
                            $scope.data.currGridModel = 'data.currItem.sa_out_bill_lines';
                        })
                        .default(function () {
                            $scope.data.currGridOptions = null;
                            $scope.data.currGridModel = '';
                        });
                });
        };

        /**
         * 添加折扣明细
         */
        $scope.addDiscountLine = function () {
            //若还没选择折扣单，先选折扣单
            if (!$scope.data.currItem.discount_apply_code) {
                return $('[hc-input="data.currItem.discount_apply_code"]')
                    .controller('hcInput')
                    .btnClick();
            }

            var lines;

            return $q
                .when()
                .then(function () {
                    lines = $scope.data.currItem.sa_out_bill_lines;

                    return $modal.openCommonSearch({
                        title: '请选择折扣单【' + $scope.data.currItem.discount_apply_code + '】的明细',
                        checkbox: true,
                        classId: 'epm_discount_apply_line',
                        postData: {
                            search_flag: 1, //查询场景：要货单下单时
                            sa_out_bill_head_id: $scope.data.currItem.sa_out_bill_head_id,
                            discount_apply_id: $scope.data.currItem.discount_apply_id,
                            epm_discount_apply_lines: lines.map(function (line) {
                                return {
                                    discount_apply_line_id: line.discount_apply_line_id
                                };
                            })
                        },
                        beforeOk: function (discount_lines) {
                            return requestApi
                                .post({
                                    classId: 'sa_out_bill_head',
                                    action: 'get_data_by_epm_discount_apply_line',
                                    data: {
                                        discount_apply_id: $scope.data.currItem.discount_apply_id,
                                        sa_out_bill_head_id: $scope.data.currItem.sa_out_bill_head_id,
                                        sa_out_bill_lines: discount_lines.map(function (line) {
                                            return {
                                                discount_apply_line_id: line.discount_apply_line_id
                                            };
                                        })
                                    }
                                })
                                .then(function (sa_out_bill_head) {
                                    if (sa_out_bill_head.error) {
                                        swalApi.error(sa_out_bill_head.error);
                                        throw sa_out_bill_head.error;
                                    }

                                    return sa_out_bill_head;
                                });
                        }
                    }).result;
                })
				.then(addLineDataBySaOutBill);
        };

        (function (addRow) {
            $scope.footerLeftButtons.addRow.click = function () {
                if (!$scope.tabController.isTabActive('base')) {
                    return addRow.apply(this, arguments);
                }

                return $scope.addDiscountLine();
            };
        })($scope.footerLeftButtons.addRow.click);

        (function (deleteRow) {
            $scope.footerLeftButtons.deleteRow.click = function () {
                var _this = this,
                    _arguments = arguments;

                return $q
                    .when()
                    .then(function () {
                        return deleteRow.apply(_this, _arguments);
                    })
                    .then(function () {
                        $scope.cal();

                        return arguments[0];
                    });
            };
        })($scope.footerLeftButtons.deleteRow.click);

        $scope.isMoveRowDisabled = function () {
            return true;
        };

        //审核后不显示【可下单数量】
        $scope.$watch('data.currItem.stat', function (stat) {
            gridApi.execute($scope.gridOptions, function (gridOptions) {
                gridOptions.columnApi.setColumnVisible('active_qty', stat != 5);
            });
        });

        /**
         *" 期望到达日期" 变更时自动为 "订单类型" 赋值
         */
        $scope.inDateChanged = function () {
            //今年
            var curYear = numberApi.toNumber(dateApi.nowYear());
            //今月
            var curMonth = numberApi.toNumber(dateApi.nowMonth());
            //今日
            var curDate = new Date().getDate();
            //期望到达日期-年份
            var inYear = numberApi.toNumber($scope.data.currItem.in_date.substr(0, 4));
            //期望到达日期-月份
            var inMonth = numberApi.toNumber($scope.data.currItem.in_date.substr(5, 2));

            //为“订单类型”赋值。当今天日期<=20日时
            if (curDate <= 20) {
                //期望到达日期”的月份=本月，则“订单类型”自动赋值为“常规订单”
                if (curYear == inYear && inMonth == curMonth) {
                    $scope.data.currItem.bill_type = 1;
                } else if ((inYear == curYear && inMonth > curMonth)||inYear > curYear) {//期望到达日期”的月份＞本月，则“订单类型”自动赋值为“计划订单”
                    $scope.data.currItem.bill_type = 2;
                }
            } else {
                //“期望到达日期”的月份＞下个月，则“订单类型”自动赋值为“计划订单”
                if ((inYear == curYear && inMonth > curMonth + 1 ) || (inYear > curYear && (inMonth + 12 > curMonth + 1 ))) {
                    $scope.data.currItem.bill_type = 2;
                } else {//期望到达日期”的月份≤下个月，则“订单类型”自动赋值为“常规订单”
                    $scope.data.currItem.bill_type = 1;
                }
            }

        };

        /**
         * "订单类型" 值变更事件
         */
        $scope.billTypeChanged = function(){
            //是否提示信息
            var shouldWarn = false;
            //今年
            var curYear = numberApi.toNumber(dateApi.nowYear());
            //今月
            var curMonth = numberApi.toNumber(dateApi.nowMonth());
            //今日
            var curDate = new Date().getDate();
            //期望到达日期-年份
            var inYear = numberApi.toNumber($scope.data.currItem.in_date.substr(0, 4));
            //期望到达日期-月份
            var inMonth = numberApi.toNumber($scope.data.currItem.in_date.substr(5, 2));

            //校验“期望到达日期”是否合规
            if(curDate <=20){
                if($scope.data.currItem.bill_type == 1 && !(curYear == inYear && inMonth == curMonth)){
                    shouldWarn = true;
                }else if($scope.data.currItem.bill_type == 2 && (curYear == inYear && inMonth == curMonth)){
                    shouldWarn = true;
                }
            }else{
                if($scope.data.currItem.bill_type == 1
                    && ((inYear == curYear && inMonth > curMonth + 1 ) || (inYear > curYear && (inMonth + 12 > curMonth + 1 )))){
                    shouldWarn = true;
                }else if($scope.data.currItem.bill_type == 2
                    && !((inYear == curYear && inMonth > curMonth + 1 ) || (inYear > curYear && (inMonth + 12 > curMonth + 1 )))){
                    shouldWarn = true;
                }
            }

            var warnText =
                "“期望到达日期”不合规，请重新指定。\n"+
                "常规订单：\n"+
                "每月20号前（包含）下单，期望到达日期需为当月\n"+
                " 每月20号后下单，期望到达日期不可晚于次次月\n"+
                "计划订单：\n" +
                "每月20号前（包含）下单，期望到达日期不可为当月\n"+
                "每月20号后下单，期望到达日期不可早于次次月\n"

            if(shouldWarn){
                swalApi.info(warnText);
                $scope.data.currItem.in_date = '';
            }

		}
		
		$scope.$watchGroup([
			'data.currItem.province_name',
			'data.currItem.city_name',
			'data.currItem.county_name',
			'data.currItem.address1'
		], function (values) {
			values = values.filter(function (value) {
				return !!value;
			});

			$scope.address = values.join('-');
		});

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: EPMRequireBillProp
    });
});