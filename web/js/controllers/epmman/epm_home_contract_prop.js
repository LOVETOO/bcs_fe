/**
 * 家装合同
 * 2020/3/26
 * zengjinhua
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi', 'gridApi', 'Decimal', '$modal', 'controllers/epmman/epmman'],
	function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi, gridApi, Decimal, $modal, epmman) {

        var controller = [
            '$scope', '$stateParams', '$q',

            function ($scope, $stateParams, $q) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
				});

                //定义经销商是否可编辑
                $scope.data.DealerShow = 1;
                //定义产品取消判断数据
                $scope.data.cancel = 0;
                //定义增补合同的可编辑参数
                $scope.data.supplementaryRead = 1;
                //是否多个折扣单
                $scope.isMultipleDiscountTickets = false;

                //定义状态可见参数 1-可见单据状态 2-可见有效状态
                $scope.data.statShow = 1;

                $scope.examineShow = $stateParams.openedByListPage;

                //userbean数据放入$scope作用域
				$scope.userbean = userbean;

                //标签定义
                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.product = {
                    title: '合同清单'
                };
                /**
                 * 合同打开主合同不可见流程
                 */
                $scope.tabs.wf.hide = function(){
                    return $scope.examineShow == 1
                };

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "产品清单"
                 */
                $scope.gridOptions_product = {
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
    
                                        calDiscountData();
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
                            type: '金额'
                        },
                        {
                            field: 'discount_rate',
                            headerName: '应用折扣率'
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
                 * 表格定义  "折扣申请"
                 */
                $scope.gridOptionsDiscount = {
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'stat',
                        headerName: '审核状态',
                        hcDictCode: 'stat',
                        cellStyle: {
                            'text-align': 'center' //文本居中
                        }
                    },
                    {
                        field: 'discount_apply_code',
                        headerName: '申请单号'
                    },
                    {
                        field: 'creator_name',
                        headerName: '申请人'
                    },
                    {
                        field: 'createtime',
                        headerName: '申请时间'
                    },
    
                    {
                        field: 'division_id',
                        headerName: '所属事业部',
                        hcDictCode: 'epm.division'
                    },
                    {
                        field: 'order_pdt_line',
                        headerName: '订单产品线',
                        hcDictCode: 'epm.order_pdt_line'
                    },
                    {
                        field: 'contract_type',
                        headerName: '签约方式',
                        hcDictCode: 'epm.contract_type'
                    },
                    {
                        field: 'discount_valid_date',
                        headerName: '折扣有效期',
                        type: '日期'
                    },
                    {
                        field: 'source_from_delay',
                        headerName: '延期生成',
                        type: '是否'
                    },
                    {
                        field: 'source_discount_apply_code',
                        headerName: '源折扣单号'
                    }],
                    hcEvents: {  
                        // cellDoubleClicked: function (params) {
                        //     openBizObj({
                        //         stateName: 'epmman.epm_discount_apply_prop',
                        //         params: {
                        //             id: params.data.discount_apply_id,
                        //             readonly: true
                        //         }
                        //     });
                        // }  
                    }
                };

                /*----------------------------------计算方法-------------------------------------------*/
                /**
                 * 计算折扣数据
                 * @since 2019-08-06
                 */
                var calDiscountData = function () {
                    //折扣明细数据
                    var discount_lines = $scope.gridOptions_product.hcApi.getRowData();

                    //遍历折扣明细
                    discount_lines.forEach(function (discount_line) {
                        function mutiply(resultKey, multiplierKeys, scale) {
                            var result;

                            if (multiplierKeys.length) {
                                var multipliers = multiplierKeys.map(function (key) {
                                    return numberApi.normalizeAsNumber(discount_line[key]);
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

                            discount_line[resultKey] = result;
                        }

                        //【应用折扣率】=【出厂折扣率】×【审批折扣率】
				        mutiply('discount_rate', ['base_discount_rate', 'extra_discount_rate']);

                        //【折后单价】=【标准单价】×【应用折扣率】⇒四舍五入2位小数
                        mutiply('discounted_price', ['stand_price', 'discount_rate'], 2);
                    });

                    //刷新计算结果所在的列
                    $scope.gridOptions_product.api.refreshCells({
                        columns: [
                            'item_code',//产品编码
                            'item_name',				//产品名称
                            'model',				    //型号
                            'uom_name',		            //单位
                            'stand_price',			    //标准单价
                            'discount_rate',            //应用折扣率
                            'base_discount_rate',		//出厂折扣率
                            'extra_discount_rate',		//审批折扣率
                            'discounted_price'		    //折后单价
                        ]
                    });
                };

                /**
                 * 修改时间方法
                 */
                $scope.changeDate = function(){
                    if(($scope.data.currItem.contract_effect_date != ""
                        && $scope.data.currItem.contract_effect_date != undefined
                        && $scope.data.currItem.contract_effect_date != null)
                        && ($scope.data.currItem.contract_expire_date != ""
                            && $scope.data.currItem.contract_expire_date != undefined
                            && $scope.data.currItem.contract_expire_date != null)){
                        if(new Date($scope.data.currItem.contract_effect_date).getTime()>=
                            new Date($scope.data.currItem.contract_expire_date).getTime()){
                            swalApi.info("合作结束时间应大于合作开始时间，请重新选择");
                            $scope.data.currItem.contract_expire_date = undefined;
                            return;
                        }
                        if(new Date($scope.data.currItem.contract_effect_date).Format('yyyy-MM-dd') ==
                            new Date($scope.data.currItem.contract_expire_date).Format('yyyy-MM-dd')){
                            swalApi.info("合作结束时间应大于合作开始时间，请重新选择");
                            $scope.data.currItem.contract_expire_date = undefined;
                        }
                    }
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 币别查询
                 */
                $scope.searchObjectBaseCurrency = {
                    afterOk: function (customer) {
                        $scope.data.currItem.base_currency_id = customer.base_currency_id;
                        $scope.data.currItem.currency_name = customer.currency_name;
                    }
                };

                /**
                 * 经销商查询
                 */
                $scope.commonSearch = {
                    customer_code: {
                        postData: {
                            search_flag: 124
                        },
                        sqlWhere : ' valid = 2 ',
                        afterOk: function (customer) {
							['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
								$scope.data.currItem[field] = customer[field];
							});

							epmman.doAfterGetCustomerInDiscount({
								customer: customer,
								gridOptions: $scope.gridOptions_product
							});
                        }
                    }
                };

                /**
                 * 修改工程项目通用查询
                 */
                $scope.changeProject = function () {
                    $scope.data.currItem.trading_company_id = undefined;
                    $scope.data.currItem.trading_company_name = undefined;
                    $scope.data.currItem.billing_unit_name = undefined;
                    if($scope.data.currItem.project_code == undefined || $scope.data.currItem.project_code == null || $scope.data.currItem.project_code ==""){
                        $scope.data.currItem.strategic_related = 1;
                        //清空数据
                        ['strategic_contract_id', 'strategic_contract_code', 'strategic_contract_name', 'predict_sales_amount', 'report_time',
                        'strategic_project_id', 'strategic_project_code', 'strategic_project_name', 'cost_rate'].forEach(function (value) {
                            $scope.data.currItem[value] = undefined;
                        });
                    }
                };

                /**
                 * 工程项目查询
                 */
                $scope.searchObjectEpmProject = {
					postData: function () {
						return {
                            report_type: 4,
                            search_flag : 11,
                            customer_id: user.isCustomer ? customer.customer_id : 0
						};
					},
                    afterOk: function (proj) {
						var fields = [
							'project_id',					//项目ID
							'project_code',					//项目编码
							'project_name',					//项目名称
							'report_time',					//报备时间
							'address',						//地址
							'stage_id',						//阶段ID
							'stage_name',					//阶段名称
							'trading_company_id',			//交易公司ID
							'trading_company_name',			//交易公司名称
                            'is_local',						//本地/异地
                            'cost_rate',
                            'predict_sales_amount'
						];

						//若不是经销商账号，还需填充经销商信息
						if (!user.isCustomer) {
							fields.push(
								'customer_id',				//经销商ID
								'customer_code',			//经销商编码
								'customer_name',			//经销商名称
								'division_id',				//事业部ID
								'division_name'				//事业部名称
							);
						}

						fields.forEach(function (field) {
							$scope.data.currItem[field] = proj[field];
						});
                        $scope.data.currItem.trading_company_id = undefined;
                        $scope.data.currItem.trading_company_name = undefined;
                        $scope.data.currItem.billing_unit_name = undefined;
                        if (proj.rel_project_id > 0) {
                            $scope.data.currItem.strategic_related = 2;
                            $scope.data.currItem.strategic_project_id = proj.rel_project_id;
                            $scope.data.currItem.strategic_project_code = proj.rel_project_code;
                            $scope.data.currItem.strategic_project_name = proj.rel_project_name;
                        }
                        else {
                            $scope.data.currItem.strategic_related = 1;
                            ['strategic_contract_id', 'strategic_contract_code', 'strategic_contract_name',
                                'strategic_project_id', 'strategic_project_code', 'strategic_project_name'].forEach(function (value) {
                                $scope.data.currItem[value] = undefined;
                            });
                        }

						return $q
                        .when()
                        .then(function () {
                            return requestApi.post({
                                classId: 'epm_discount_apply',
                                action: 'get_discount_rate',
                                data: {
                                    customer_id: $scope.data.currItem.customer_id
                                }
                            });
                        })
                        .then(function (discount_apply) {
                            [
                                'base_discount_rate',
                                'extra_discount_rate',
                                'customer_discount_rate'
                            ].forEach(function (key) {
                                $scope.data.currItem[key] = discount_apply[key];
                            });
                            $scope.gridOptions_product.hcApi.getRowData().forEach(function (data) {
                                [
                                    'base_discount_rate',
                                    'extra_discount_rate'
                                ].forEach(function (key) {
                                    data[key] = discount_apply[key];
                                });
                                data.division_cost_rate = $scope.data.currItem.cost_rate;
                            });
                            calDiscountData();
                        });
                    }
                };

                /**
                 * 乙方机构名称查询
                 */
                $scope.searchObjectScporg = {
                    postData : function(){
                        return {
                            /** 4-通用查询 */
                            search_flag : 4,
                            customer_id : $scope.data.currItem.customer_id
                        }
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.trading_company_id = result.trading_company_id;
                        $scope.data.currItem.trading_company_name = result.trading_company_name;
                    },
                    beforeOpen:function() {
                        if ($scope.data.currItem.project_code == undefined || $scope.data.currItem.project_code == "") {
                            swalApi.info('请先选择项目');
                            return false;
                        }
                    }
                };

                /**
                 * 开票单位查询
                 */
                $scope.searchObjectBillingUnitName = {
                    postData : function () {
                        return {
                            flag : 9,
                            customer_id : $scope.data.currItem.customer_id,
                            trading_company_id : $scope.data.currItem.trading_company_id
                        }
                    },
                    title : '开票单位',
                    dataRelationName:'epm_project_contracts',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "开票单位编码",
                                field: "legal_entity_code"
                            },{
                                headerName: "开票单位名称",
                                field: "legal_entity_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.billing_unit_id = result.legal_entity_id;
                        $scope.data.currItem.billing_unit_name = result.legal_entity_name;

                        $scope.data.currItem.tax_identify_num = result.tax_no;
                        $scope.data.currItem.billing_bank = result.bank;
                        $scope.data.currItem.billing_account = result.bank_accno;
                    },
                    beforeOpen:function() {
                        if ($scope.data.currItem.trading_company_name == undefined || $scope.data.currItem.trading_company_name == "") {
                            swalApi.info('请先选择交易公司');
                            return false;
                        }
                    }
                };

                /**
                 * 产品查询查询
                 */
                $scope.chooseItem = function (args) {
                    if(args.rowPinned){
                        return;
                    }
                    $modal.openCommonSearch({
                        classId:'item_org'
                    })
                        .result//响应数据
                        .then(function(result){
                            var a = 1;
                            args.data.item_code = undefined;
                            $scope.data.currItem.epm_contract_items.forEach(function (val) {
                                if(val.item_code == result.item_code){
                                    swalApi.info('不能选择重复产品，请重新选择!');
                                    a = 0;
                                }
                            });
                            if(a == 1){
                                args.data.item_id = result.item_id;
                                args.data.item_code = result.item_code;
                                args.data.item_name = result.item_name;
                                args.data.model = result.item_model;//型号
                                args.data.unit = result.uom_name;//单位
                                //args.data.unit = result.uom_name;//申请数量
                                args.data.entorgid = result.entorgid;//产品线
                                //args.data.unit = result.uom_name;//标准单价
                                args.data.spec = result.specs;//规格
                                args.data.item_color = result.item_color;//颜色
                                args.data.cubage = result.cubage;//体积
                                args.data.weight = result.net_weigth;//重量
                            }
                            return args
                        })
                        .then(function () {
                        args.api.refreshView();//刷新网格视图
                    });
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

				/**
				 * 初始化
				 * @override
				 */
				$scope.doInit = function () {
					return $q
						.when()
						.then($scope.hcSuper.doInit)
						.then(function () {
							return $q.all([
								requestApi.getDict('epm.order_pdt_line'),
								requestApi.post({
									classId: 'order_pdt_line',
									data: {
										bill_type: 4, //订单类型：折扣申请单
										organization_id: ent.entid
									}
								}),
							]);
						})
						.then(function (responses) {
							var order_pdt_lines = responses[0];
							var active_order_pdt_lines = responses[1].order_pdt_lines;

							$scope.order_pdt_lines = order_pdt_lines.map(function (order_pdt_line) {
								return {
									value: order_pdt_line.dictvalue,
									name: order_pdt_line.dictname,
									disabled: active_order_pdt_lines.every(function (active_order_pdt_line) {
										return active_order_pdt_line.order_pdt_line_id != order_pdt_line.dictvalue;
									})
								};
							});

							//若是新增，且下拉值只有一个，赋值
							if ($scope.data.isInsert) {
								active_order_pdt_lines = $scope.order_pdt_lines.filter(function (order_pdt_line) {
									return !order_pdt_line.disabled;
								});

								if (active_order_pdt_lines.length === 1) {
									$scope.data.currItem.order_pdt_line = active_order_pdt_lines[0].value;
								}
							}
						});
                };
                
                /**
				 * 初始化
				 * @override
				 */
				$scope.doInit = function () {
					return $q
						.when()
						.then($scope.hcSuper.doInit)
						.then(function () {
							return $q.all([
								requestApi.getDict('epm.order_pdt_line'),
								requestApi.post({
									classId: 'order_pdt_line',
									data: {
										bill_type: 4, //订单类型：折扣申请单
										organization_id: ent.entid
									}
								}),
							]);
						})
						.then(function (responses) {
							var order_pdt_lines = responses[0];
							var active_order_pdt_lines = responses[1].order_pdt_lines;

							$scope.order_pdt_lines = order_pdt_lines.map(function (order_pdt_line) {
								return {
									value: order_pdt_line.dictvalue,
									name: order_pdt_line.dictname,
									disabled: active_order_pdt_lines.every(function (active_order_pdt_line) {
										return active_order_pdt_line.order_pdt_line_id != order_pdt_line.dictvalue;
									})
								};
							});

							//若是新增，且下拉值只有一个，赋值
							if ($scope.data.isInsert) {
								active_order_pdt_lines = $scope.order_pdt_lines.filter(function (order_pdt_line) {
									return !order_pdt_line.disabled;
								});

								if (active_order_pdt_lines.length === 1) {
									$scope.data.currItem.order_pdt_line = active_order_pdt_lines[0].value;
								}
							}
						});
				};

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //产品清单
                    bizData.epm_contract_items = [];
                    //产品清单取消
                    bizData.epm_contract_item_cancels = [];
                    //预计提货
                    bizData.epm_discount_apply_plans = [];
					bizData.contract_character = 'AR'; //"AR"--项目收款合同
                    bizData.channel = 3; //渠道：家装
                    bizData.is_home = 2;//家装
                    $scope.data.currItem.contract_type = 2;//签约方式
                    $scope.data.currItem.discount_type = 1;//折扣类型
					$scope.data.currItem.valid = 1;
                    $scope.data.currItem.base_currency_id = 1;
                    $scope.data.currItem.currency_name = "人民币";
					//若当前账号是【经销商】
					if (user.isCustomer) {
						['customer_id', 'customer_code', 'customer_name', 'division_name'].forEach(function (field) {
							$scope.data.currItem[field] = customer[field];
						});
					}
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    supplement(bizData);
                    if(bizData.stat == 5){
                        $scope.data.statShow = 2;
                    }
                    if(bizData.is_custom == 2){
                        $scope.tabs.product.hide = true;
                    }else{
                        $scope.tabs.product.hide = false;
                    }
                    $scope.hcSuper.setBizData(bizData);
                    if(bizData.epm_discount_applys.length > 1){//多个折扣单
                        $scope.isMultipleDiscountTickets = true;
                        //设置多个折扣单数据
                        gridApi.execute($scope.gridOptionsDiscount, function () {
                            $scope.gridOptionsDiscount.hcApi.setRowData(bizData.epm_discount_applys);
                        });
                    }else{
                        $scope.isMultipleDiscountTickets = false;
                    }
                    //设置产品清单                    
					$scope.gridOptions_product.hcApi.setRowData(bizData.epm_contract_items);
                    if($scope.data.currItem.discount_rate == 0){
                        $scope.data.currItem.discount_rate = undefined;
                    }
                };

                /**
                 * 判断是否为增补合同
                 */
                function supplement(bizData) {
                    if(bizData.main_contract_id > 0){//为增补合同
                        $scope.data.supplementaryRead = 2;
                    }else if(bizData.main_contract_id == -1){//新增增补合同
                        $scope.form.editing = true;
                        $scope.data.supplementaryRead = 2;
                        //将源合同的主id修改为0
                        requestApi
                            .post({
                                classId: "epm_project_contract",
                                action: 'modifysource',
                                data: {
                                    main_contract_id : 0,
                                    contract_id : bizData.contract_id
                                }
                            });
                        /*---将主合同的信息赋值给增补合同---*/
                        bizData.main_contract_id = bizData.contract_id;
                        bizData.main_contract_code = bizData.contract_code;
                        bizData.main_contract_name = bizData.contract_name;
                        /*---当源id为-1时，以下数据进行重新维护---*/
                        //主表数据重置
                        bizData.valid = 1;
                        bizData.stat = 1;
                        //主表数据清空
                        var fields = [
                            'contract_id',
                            'contract_code',
                            'contract_name',
                            'wfflag',
                            'wfid',
                            'audit_stat',
                            'ext_contract_id',
                            'is_init',
                            'signed_date',               //签订时间
                            'signed_location',           //签订地点
                            'contract_effect_date',      //合作开始时间
                            'contract_expire_date',      //合作结束时间
                            'contract_amt',              //合同总额
                            'remark',                    //备注
                            'discount_valid_date',       //折扣有效期
                            'total_volume',              //总体积
                            'total_qty',                 //总数量
                            'discounted_amount',         //总金额
                            'discount_rate',             //折扣率
                            'dealer_gm',                 //工程服务商毛利率
                            'division_gm',               //事业部内结毛利率
                            'value_chain_gm',            //价值链毛利率
                            'apply_reason',              //申请说明
                            'price_contain_tax',         //价格含税
                            'price_contain_tax_desc',    //含税说明
                            'price_contain_freight',     //价格含运费
                            'price_contain_freight_desc',//含运费说明
                            'first_delivery_date',       //首次发货日期
                            'completed_date',            //结案时间
                            'completed_type',            //结案状态
                            'oa_audit_stat'              //OA审批状态
                        ];
                        fields.forEach(function (field) {//将其中字段进行置空
                            bizData[field] = undefined;
                        });
                        bizData.epm_contract_items = [];                //产品
                        bizData.epm_project_attachs = [];               //附件
                        bizData.epm_discount_applys = [];               //多个折扣单
                        bizData.epm_discount_apply_plans = [];          //多个折扣单
                    }
                }

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = function () {
                    return true;
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return true;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                
                /**
                 * 添加产品清单
                 */
                $scope.addProduct = function () {
                    return $q
                        .when()
                        .then(function () {
                            if (+$scope.data.currItem.order_pdt_line) {
                                return;
                            }

                            return $modal
                                .openCommonSearch({
                                    title: '请先选择订单产品线',
                                    classId: 'order_pdt_line',
                                    postData: {
                                        bill_type: 4, //折扣申请单
                                        organization_id: ent.entid
                                    }
                                })
                                .result
                                .then(function (order_pdt_line) {
                                    $scope.data.currItem.order_pdt_line = order_pdt_line.order_pdt_line_id;
                                });
                        })
                        .then(function () {
                            return $modal.openCommonSearch({
                                classId: 'item_org',
                                postData: {
                                    need_price: 2,									//需要价格
                                    order_pdt_line: $scope.data.currItem.order_pdt_line,		//订单产品线
                                    sales_channel: 3,								//销售渠道：家装
                                    item_orgs: $scope.gridOptions_product.hcApi.getRowData().map(function (line) {
                                        return {
                                            item_id: line.item_id
                                        };
                                    })
                                },
                                checkbox: true,
                                beforeOk: function (items) {
                                    selectedCount = items.length;

                                    items = items.filter(function (item) {
                                        return $scope.data.currItem.epm_contract_items.every(function (discount_line) {
                                            return discount_line.item_id != item.item_id;
                                        });
                                    });

                                    duplicated = items.length < selectedCount;

                                    if (!items.length) {
                                        return items;
                                    }

                                    return requestApi
                                        .post({
                                            classId: 'epm_discount_apply',
                                            action: 'generate_discount_data',
                                            data: {
                                                customer_id: $scope.data.currItem.customer_id,
                                                epm_discount_apply_lines: items.map(function (item) {
                                                    return {
                                                        item_id: item.item_id,
                                                        item_code: item.item_code
                                                    };
                                                })
                                            }
                                        })
                                        .then(function (discount_apply) {
                                            if (discount_apply.error) {
                                                swalApi.error(discount_apply.error);
                                                throw discount_apply.error;
                                            }

                                            return discount_apply.epm_discount_apply_lines;
                                        });
                                }
                            }).result;
                        })
                        .then(function (new_discount_lines) {
                            if (!new_discount_lines.length) {
                                return;
                            }

                            var focusIndex = $scope.data.currItem.epm_contract_items.length;
                            if($scope.data.currItem.cost_rate){
                                new_discount_lines.forEach(function (value){
                                    value.division_cost_rate = $scope.data.currItem.cost_rate;
                                });
                            }

                            Array.prototype.push.apply($scope.data.currItem.epm_contract_items, new_discount_lines);

                            $scope.gridOptions_product.api.updateRowData({
                                add: new_discount_lines
                            });

                            $scope.gridOptions_product.hcApi.setFocusedCell(focusIndex);

                            calDiscountData();
                        });
                };
                /**
                 * 删除行产品清单
                 */
                $scope.delProduct = function () {
                    var idx = $scope.gridOptions_product.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        var data = $scope.data.currItem.epm_contract_items.splice(idx, 1);
                        $scope.gridOptions_product.hcApi.setRowData($scope.data.currItem.epm_contract_items);
                        var arr = [];
                        $scope.data.currItem.epm_discount_apply_plans.forEach(function (value) {
                            if(value.item_id != data[0].item_id){
                                arr.push(value);
                            }
                        });
                        $scope.data.currItem.epm_discount_apply_plans = arr;
                    }
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