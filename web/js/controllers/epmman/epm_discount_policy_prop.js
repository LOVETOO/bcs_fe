/**
 * 折扣政策
 * zengjinhua
 * 2020-3-30
 */
define(['module', 'controllerApi', 'base_obj_prop', 'angular', 'requestApi', 'swalApi', 'numberApi'], 
    function (module, controllerApi, base_obj_prop, angular, requestApi, swalApi, numberApi) {

	/**
	 * 详情页控制器
	 */
	EpmDiscountPolicyProp.$inject = ['$scope', '$q', '$modal'];
	function EpmDiscountPolicyProp(   $scope,   $q,   $modal) {

		//继承控制器
		controllerApi.extend({
			controller: base_obj_prop.controller,
			scope: $scope
        });
        
        //定义分组序号
        identifier = 0;

        //当前选择行数
        $scope.idx = 0;

		/**
		 * 新增时对业务对象的处理
		 * @override
		 */
		$scope.newBizData = function (bizData) {
			$scope.hcSuper.newBizData(bizData);

			bizData.epm_discount_policy_items = [];//产品明细
            bizData.epm_discount_policy_item_lines = [];//阶梯政策
            
            identifier = 0;
            
            //储存容器
            $scope.policy_line_proj = {};
		};

		/**
		 * 设置业务数据
		 * @override
		 */
		$scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            
            $scope.gridOptions.hcApi.setRowData(bizData.epm_discount_policy_items);
		};

		/**
		 * 通用查询
		 */
		$scope.commonSearch = {
            sale_area_name : {/* 所属区域 */
                title: '区域',
                postData: {
                    use_type: 2
                },
                sqlWhere:"isuseable = 2",
                afterOk: function (result) {
                    $scope.data.currItem.sale_area_id = result.sale_area_id;
                    $scope.data.currItem.sale_area_code = result.sale_area_code;
                    $scope.data.currItem.sale_area_name = result.sale_area_name;
                }
            },
            customer_code : {/* 查询客户 */
                title: '客户',
				postData: {
					search_flag: 142
				},
				afterOk: function (customer) {
					['customer_id', 'customer_code', 'customer_name'].forEach(function (field) {
						$scope.data.currItem[field] = customer[field];
					});
				}
            },
            province_name : {/* 省份 */
                title: '请选择省级行政区',
				postData: {
					areatype: 4
				},
				afterOk: function (province) {
					$scope.data.currItem.province_id = province.areaid;
                    $scope.data.currItem.province_name = province.areaname;
				}
            }
        };
        
        /**
         * 修改政策类型
         */
        $scope.changePolicy = function(){
            ['customer_id',
            'customer_code',
            'customer_name',
            'sale_area_id',
            'sale_area_code',
            'sale_area_name',
            'province_id',
            'province_name',
            'customer_class'].forEach(function(field){
                $scope.data.currItem[field] = undefined;
            });
        }

        /**
         * 修改时间方法
         */
        $scope.changeDate = function(){
            if(($scope.data.currItem.effective_date_start != ""
                && $scope.data.currItem.effective_date_start != undefined
                && $scope.data.currItem.effective_date_start != null)
                && ($scope.data.currItem.effective_date_end != ""
                    && $scope.data.currItem.effective_date_end != undefined
                    && $scope.data.currItem.effective_date_end != null)){
                if(new Date($scope.data.currItem.effective_date_start).getTime()>=
                    new Date($scope.data.currItem.effective_date_end).getTime()){
                    swalApi.info("有效结束日期应大于有效开始日期，请重新选择");
                    $scope.data.currItem.effective_date_end = undefined;
                    return;
                }
                if(new Date($scope.data.currItem.effective_date_start).Format('yyyy-MM-dd') ==
                    new Date($scope.data.currItem.effective_date_end).Format('yyyy-MM-dd')){
                    swalApi.info("有效结束日期应大于有效开始日期，请重新选择");
                    $scope.data.currItem.effective_date_end = undefined;
                }
            }
        };

        /**
         * 新增产品明细
         */
        $scope.addProduct = function(){
            $scope.gridOptions.api.stopEditing();
            //序号自增
            identifier++;
            $scope.data.currItem.epm_discount_policy_items.push({
                identifier : identifier
            });
            //二级明细定义
            if($scope.policy_line_proj[identifier] == undefined){
                $scope.policy_line_proj[identifier] = [];
            }
            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_policy_items);
        }

        /**
         * 删除明细
         */
        $scope.delProduct = function(){
            var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                var data = $scope.data.currItem.epm_discount_policy_items.splice(idx, 1);
                $scope.policy_line_proj[data.identifier] = undefined;
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_discount_policy_items);
            }
        }

        /**
         * 新增阶梯政策
         */
        $scope.addLine = function(){
            if(!$scope.idx > 0){
                swalApi.error('请先指定产品明细行');
                return;
            }
            $scope.gridOptionsLine.api.stopEditing();
            $scope.policy_line_proj[$scope.idx].push({
                identifier : $scope.idx
            });
            $scope.gridOptionsLine.hcApi.setRowData($scope.policy_line_proj[$scope.idx]);
        }

        /**
         * 删除阶梯政策
         */
        $scope.delLine = function(){
            var idx = $scope.gridOptionsLine.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.policy_line_proj[$scope.idx].splice(idx, 1);
                $scope.gridOptionsLine.hcApi.setRowData($scope.policy_line_proj[$scope.idx]);
            }
        }

        /**
         * 网格双击
         */
        $scope.doubCileck = function(args){
            $scope.gridOptions.api.stopEditing();
            if(args.data.application_type == 1){
                //选择产品
                return $modal
                    .openCommonSearch({
                        classId: 'item_org',
                        postData: {
                            need_price: 2,//需要价格
                            sales_channel: 3//销售渠道：家装
                        },
                        beforeOk: function (item) {
                            if (item.item_id == args.data.item_id) {
                                swalApi.info('此产品和当前行的产品是同一个');
                                return false;
                            }

                            if (args.api.hcApi.getRowData().some(function (discount_line) {
                                return discount_line.item_id == item.item_id;
                            })) {
                                swalApi.info('此产品已在明细中，不能重复添加');
                                return false;
                            }

                            return requestApi
                                .post({
                                    classId: 'epm_discount_policy',
                                    action: 'getprice',
                                    data: {
                                        item_id: item.item_id,
                                        item_code: item.item_code
                                    }
                                })
                                .then(function (discount_apply) {
                                    if (discount_apply.error) {
                                        swalApi.error(discount_apply.error);
                                        throw discount_apply.error;
                                    }

                                    return discount_apply.epm_discount_policy_items[0];
                                });
                        }
                    })
                    .result
                    .then(function (new_discount_line) {
                        angular.extend(args.data, new_discount_line);
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['item_code',
                                'item_name', 'item_model', 'uom_name', 'stand_price'])
                        });
                    });
            }else if(args.data.application_type == 2){
                //选择型号
                return $modal
                    .openCommonSearch({
                        classId: 'epm_discount_policy',
                        action:'getmodel',
                        title:"产品型号",
                        dataRelationName:'epm_discount_policy_items',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "产品型号",
                                    field: "item_model"
                                }
                            ]
                        }
                    })
                    .result
                    .then(function (data) {
                        args.data.item_model = data.item_model;
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['item_model'])
                        });
                    });
            }
        }

		/**
		 * 产品明细
		 */
		$scope.gridOptions = {
			hcName: '产品明细',
			hcRequired: true,
            hcEvents: {
                /**
                 * 焦点事件
                 */
                cellFocused: function (params) {
                    if(params.rowIndex != null){
                        $scope.idx = $scope.data.currItem.epm_discount_policy_items[params.rowIndex].identifier;
                        $scope.gridOptionsLine.hcApi.setRowData($scope.policy_line_proj[$scope.idx]);
                    }

                }
            },
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'application_type',
                    headerName: '申请类型',
                    hcDictCode : 'epm.application_type',
                    editable : true,
                    onCellValueChanged: function (args) {
                        if (args.oldValue == args.newValue) {
                            return;
                        }else{
                            ['item_id',
                            'item_code', 
                            'item_name',
                            'item_model',
                            'uom_name',
                            'stand_price'].forEach(function(field){
                                args.data[field] = undefined;
                            });
                        }

                        if(args.data.application_type == 2 || args.data.application_type == 3){
                            args.data.preferential_type = 1;
                        }
                    }      
				},
				{
					field: 'item_code',
					headerName: '产品编码',
                    onCellDoubleClicked: function (args) {
                        $scope.doubCileck(args);
                    }
				},
				{
					field: 'item_name',
					headerName: '产品名称'
				},
				{
					field: 'item_model',
					headerName: '产品型号',
                    onCellDoubleClicked: function (args) {
                        $scope.doubCileck(args);
                    }
				},
				{
					field: 'uom_name',
					headerName: '单位'
				},
				{
					field: 'stand_price',
                    headerName: '标准单价(元)',
                    type : '金额'
				},
                {
                    field: 'preferential_type',
                    headerName: '优惠方式',
                    hcDictCode : 'epm.preferential_type',
                    editable : function(args){
                        return args.data.application_type == 1;
                    }
                },
				{
					field: 'capping',
                    headerName: '封顶数量校验',
                    type : '是否',
                    editable : true
				}
			],
            //定义表格增减行按钮
            hcButtons: {
                policyAdd: {
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.addProduct && $scope.addProduct();
                    },
                    hide : function(){
                        return $scope.isFormReadonly() || !$scope.form.editing;
                    }
                },
                policyDel: {
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
		 * 表格选项
		 */
		$scope.gridOptionsLine = {
			hcName: '阶梯政策',
			hcRequired: true,
			columnDefs: [
				{
					type: '序号'
				},
				{
					field: 'minimum_qty',
                    headerName: '起订量',
                    editable : true,
                    type : '数量'   
				},
				{
					field: 'capping_qty',
                    headerName: '封顶量',
                    editable : true,
                    type : '数量'   
				},
				{
					field: 'special_offer',
                    headerName: '特价',
                    editable : function(){
                        return $scope.data.currItem.epm_discount_policy_items[$scope.idx].preferential_type == 2
                    },
                    type : '金额'   
				},
				{
					field: 'discount_rate',
                    headerName: '折扣率',
                    editable : function(){
                        return $scope.data.currItem.epm_discount_policy_items[$scope.idx].preferential_type == 1
                    },
                    type : '百分比'   
				}
			],
            //定义表格增减行按钮
            hcButtons: {
                lineAdd: {
                    icon: 'iconfont hc-add',
                    click: function () {
                        $scope.addLine && $scope.addLine();
                    },
                    hide : function(){
                        return $scope.isFormReadonly() || !$scope.form.editing;
                    }
                },
                lineDel: {
                    icon: 'iconfont hc-reduce',
                    click: function () {
                        $scope.delLine && $scope.delLine();
                    },
                    hide : function(){
                        return $scope.isFormReadonly() || !$scope.form.editing;
                    }
                }
            }
		};
	}

	//使用控制器Api注册控制器
	//需传入require模块和控制器定义
	return controllerApi.controller({
		module: module,
		controller: EpmDiscountPolicyProp
	});
});