/**
 * 战略合作协议
 * 2020/3/25
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi', '$modal'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi, $modal) {

        var controller = [
            '$scope', '$q',

            function ($scope, $q) {
                $(function () {
                    var intervalId = setInterval(function () {
                        var $element = $('#projAttach > hc-proj-attach > div.hc-box > hc-box-title');

                        if ($element.length) {
                            clearInterval(intervalId);
                            $element.text('战略报备附件');
                        }
                    }, 1000);
                });
                /*----------------------------------能否编辑-------------------------------------------*/
                /**
                 * 制单、不是合计行可编辑
                 */
                function editable(args) {
                    return $scope.data.currItem.stat == 1&&!args.node.rowPinned;
                }

                /**
                 * 默认的约定条款，不可编辑
                 */
                function editables(args) {
                    return !args.terms_id > 0;
                }
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //定义默认税率
                $scope.data.tax_rate = 0;

                //定义产品取消判断数据
                $scope.data.cancel = 0;

                //标签定义
                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.product = {
                    title: '产品清单'
                };
                $scope.tabs.items = {
                    title: '约定条款'
                };

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "产品清单"
                 */
                $scope.gridOptions_product = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码',
                        width:170,
                        hcRequired:true,
                        editable: editable,
                        onCellDoubleClicked: function (args) {
                            if($scope.hcSuper.isFormReadonly()){
                                return;
                            }
                            $scope.chooseItemArgs(args);
                        }
                    }, {
                        field: 'item_name',
                        headerName: '产品名称',
                        width:120
                    }, {
                        field: 'model',
                        headerName: '产品型号',
                        width:120
                    }, {
                        field: 'uom_name',
                        headerName: '单位',
                        cellStyle: {
                            'text-align': 'center'
                        },
                        width:120
                    }, {
                        field: 'stand_price',
                        headerName: '标准单价(元)',
                        type:'金额',
                        width:120
                    }, {
                        field: 'current_stand_price',
                        headerName: '当前标准单价(元)',
                        type:'金额',
                        width:120,
                        hide : true,
                        cellStyle: function(args){
                            return {
                                'text-align': 'right',
                                'color': args.data.current_stand_price == args.data.stand_price ? "#333" : "red"
                            }
                        }
                    }, {
                        field: 'contract_price',
                        headerName: '中标单价(元)',
                        type:'金额',
                        hcRequired:true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            sumPrice(args);
                        },
                        editable: editable,
                        width:120
                    }, {
                        field: 'tax_rate',
                        headerName: '税率',
                        editable: editable,
                        width:120
                    }, {
                        field: 'no_tax_contract_price',
                        headerName: '不含税单价(元)',
                        type:'金额',
                        width:120
                    }, {
                        field: 'tax_price',
                        headerName: '税额',
                        type:'金额',
                        width:120
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        editable: editable,
                        width:120
                    }, {
                        field: 'is_cancel',
                        headerName: '已取消',
                        type  : '是否',
                        width:120,
                        hide : true
                    }, {
                        field: 'createtime',
                        headerName: '创建时间',
                        type :'时间',
                        width:120,
                        hide : true
                    }, {
                        field: 'creator',
                        headerName: '创建人',
                        width:120,
                        hide : true
                    }, {
                        field: 'updatetime',
                        headerName: '更新时间',
                        type :'时间',
                        width:120,
                        hide : true
                    }, {
                        field: 'updator',
                        headerName: '更新人',
                        width:120,
                        hide : true
                    }]
                };

                /**
                 * 表格定义  "产品清单_取消"
                 */
                $scope.gridOptions_cancel = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码',
                        width:170
                    }, {
                        field: 'item_name',
                        headerName: '产品名称',
                        width:120
                    }, {
                        field: 'model',
                        headerName: '产品型号',
                        width:120
                    }, {
                        field: 'unit',
                        headerName: '单位',
                        cellStyle: {
                            'text-align': 'center'
                        },
                        width:120
                    }, {
                        field: 'contract_price',
                        headerName: '单价(元)',
                        type:'金额',
                        width:120
                    }, {
                        field: 'contract_amount',
                        headerName: '总价(元)',
                        type:'金额',
                        width:120
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        width:120
                    }, {
                        field: 'remark',
                        headerName: '取消原因',
                        width:120
                    }]
                };

                /**
                 * 表格定义  "约定条款"
                 */
                $scope.gridOptions_terms = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'terms_name',
                        headerName: '条款事项',
                        width:270,
                        hcRequired:true,
                        editable: function (args){
                            return editables(args.data);
                        }
                    }, {
                        field: 'terms_desc',
                        headerName: '事项说明',
                        width:250,
                        editable: editable
                    }]
                };
                
                /*----------------------------------计算方法-------------------------------------------*/

                function selectTaxRate () {
                    requestApi
                        .post({
                            classId: 'epm_project_contract',
                            action: 'taxrate'
                        })
                        .then(function (data) {
                            $scope.data.tax_rate = data.tax_rate;
                        });
                }

                /**
                 * 计算总价
                 */
                function sumPrice(args){
                    if(args.data.contract_price!=null
                        &&args.data.contract_price!=undefined
                        &&args.data.contract_price!=""){
                        if(!numberApi.isNum(Number(args.data.contract_price))){
                            swalApi.info('中标单价输入不是数字，请重新输入!');
                            args.data.contract_price = undefined;
                            $scope.gridOptions_product.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions_product.columnApi.getColumns(['contract_price'])
                            });
                            return;
                        }
                        args.data.no_tax_contract_price =
                            numberApi.divide(args.data.contract_price,
                                numberApi.sum(1, args.data.tax_rate) );
                        args.data.tax_price = numberApi.sub(args.data.contract_price,args.data.no_tax_contract_price);
                        $scope.gridOptions_product.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions_product.columnApi.getColumns(['contract_price',
                            'contract_qty', 'contract_amount', 'no_tax_contract_price', 'tax_rate', 'tax_price'])
                        });//刷新网格视图
                    }
                }

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
                 * 工程项目查询
                 */
                $scope.searchObjectEpmProject = {
                    postData:{
                        report_type : 3
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.address = result.address;
                        $scope.data.currItem.stage_name = result.stage_name;
                    }
                };

                /**
                 * 乙方机构名称查询
                 */

                $scope.searchObjectScporg = {
                    postData : {
                        /** 3-交易公司通用查询，过滤不可用 */
                        search_flag : 3
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.party_b_name = result.trading_company_name;
                    }
                };

                /**
                 * 产品查询查询
                 */
                $scope.chooseItemArgs = function (args) {
                    $scope.gridOptions_product.api.stopEditing();
                    return $modal
                        .openCommonSearch({
                            classId: 'item_org',
                            postData: {
                                need_price: 2,									//需要价格
                                item_orgs: $scope.gridOptions_product.hcApi.getRowData().map(function (line) {
                                    return {
                                        item_id: args.data.item_id == line.item_id ? 0 : line.item_id
                                    };
                                })
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
                                        classId: 'epm_discount_apply',
                                        action: 'generate_discount_data',
                                        data: {
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
                            args.data.item_id = new_discount_line.item_id;
                            args.data.item_code = new_discount_line.item_code;
                            args.data.item_name = new_discount_line.item_name;
                            args.data.model = new_discount_line.model;
                            args.data.uom_id = new_discount_line.uom_id;
                            args.data.uom_code = new_discount_line.uom_code;
                            args.data.uom_name = new_discount_line.uom_name;
                            args.data.tax_rate = $scope.data.tax_rate;
                            args.data.stand_price = new_discount_line.stand_price;
                            $scope.gridOptions_product.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions_product.columnApi.getColumns(['item_code',
                                    'item_name', 'model', 'uom_name', 'tax_rate', 'stand_price'])
                            });//刷新网格视图
                        });
                };

                /**
                 * 产品查询查询
                 */
                $scope.chooseItem = function () {
                    $scope.gridOptions_product.api.stopEditing();
					return $modal.openCommonSearch({
						classId: 'item_org',
						postData: {
							need_price: 2,									//需要价格
							item_orgs: $scope.gridOptions_product.hcApi.getRowData().map(function (line) {
								return {
									item_id: line.item_id
								};
							})
						},
						checkbox: true,
						beforeOk: function (items) {
							if (!items.length) {
								return items;
							}

							return requestApi
								.post({
									classId: 'epm_discount_apply',
									action: 'generate_discount_data',
									data: {
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
					}).result
                    .then(function (new_discount_lines) {
                        if (!new_discount_lines.length) {
                            return;
                        }

                        new_discount_lines.forEach(function (value) {
                            $scope.data.currItem.epm_contract_items.push({
                                item_id : value.item_id,
                                item_code : value.item_code,
                                item_name : value.item_name,
                                model : value.model,//型号
                                uom_id : value.uom_id,//单位
                                uom_code : value.uom_code,//单位
                                uom_name : value.uom_name,//单位
                                tax_rate : $scope.data.tax_rate,
                                stand_price : value.stand_price
                            });
                        });
                        $scope.gridOptions_product.hcApi.setRowData($scope.data.currItem.epm_contract_items);
                    });
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //产品清单
                    bizData.epm_contract_items = [];
                    //约定条款
                    bizData.epm_contract_termss = [];
                    //新增默认约定条款
                    addLine ();
                    bizData.is_frame = 2;//战略协议
                    bizData.valid = 1;
                    bizData.is_home = 2;//家装
                    //查询默认税率
                    selectTaxRate ();
                    requestApi
                        .post({
                            classId: 'epm_division',
                            action: 'searchpresent'
                        })
                        .then(function (data) {
                            $scope.data.currItem.division_id = data.division_id;
                        });
                };

                /**
                 * 增加默认约定条款
                 */
                function addLine () {
                    return requestApi.post({
                        classId: 'epm_project_contract',
                        action: 'search',
                        data: {
                            flag : 1
                        }
                    }).then(function (values) {
                        $scope.gridOptions_terms.api.stopEditing();
                        var data = $scope.data.currItem.epm_contract_termss;
                        values.epm_project_contracts.forEach(function(val){
                            data.push({
                                terms_id:val.dictid,
                                terms_name:val.dictname
                            });
                        });
                        $scope.gridOptions_terms.hcApi.setRowData(data);
                    });
                }

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置产品清单
                    $scope.gridOptions_product.hcApi.setRowData(bizData.epm_contract_items);

                    $scope.gridOptions_cancel.hcApi.setRowData(bizData.epm_contract_item_cancels);

                    if(bizData.epm_contract_item_cancels.length>0){
                        $scope.data.cancel = 1;
                    }

                    if(bizData.warranty_period == 0){
                        bizData.warranty_period = undefined;
                    }
                    //设置约定条款
                    $scope.gridOptions_terms.hcApi.setRowData(bizData.epm_contract_termss);

                    //查询默认税率
                    selectTaxRate ();

                    $scope.gridOptions_product.columnApi.setColumnsVisible([
                        'current_stand_price',
                        'is_cancel',
                        'createtime',
                        'creator',
                        'updatetime',
                        'updator'],$scope.data.currItem.stat == 5);//为true则展示

                    if($scope.data.currItem.stat == 5){
                        var pomst = [];
                        $scope.data.currItem.epm_contract_items.forEach(function(value){
                            pomst.push(requestApi
                                .post({
                                    classId: 'epm_discount_apply',
                                    action: 'generate_discount_data',
                                    data: {
                                        epm_discount_apply_lines: [{
                                            item_id: value.item_id,
                                            item_code: value.item_code
                                        }]
                                    }
                                })
                                .then(function (discount_apply) {
                                    if (discount_apply.error) {
                                        value.current_stand_price = discount_apply.error;
                                    }else{
                                        value.current_stand_price = discount_apply.epm_discount_apply_lines[0].stand_price;
                                    }
                                }));
                        });
                        $q.all(pomst)
                            .then(function(){
                                $scope.gridOptions_product.hcApi.setRowData($scope.data.currItem.epm_contract_items);
                            });
                    }
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.tabs.product.active) {
                        $scope.addProduct && $scope.addProduct();
                    }
                    if ($scope.tabs.items.active) {
                        $scope.addItems && $scope.addItems();
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.product.active && !$scope.tabs.items.active);
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.tabs.product.active) {
                        $scope.delProduct && $scope.delProduct();
                    }
                    if ($scope.tabs.items.active) {
                        $scope.delItems && $scope.delItems();
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.product.active && !$scope.tabs.items.active);
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 添加产品清单
                 */
                $scope.addProduct = function () {
                    $scope.chooseItem();
                };

                /**
                 * 删除行产品清单
                 */
                $scope.delProduct = function () {
                    var idx = $scope.gridOptions_product.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_contract_items.splice(idx, 1);
                        $scope.gridOptions_product.hcApi.setRowData($scope.data.currItem.epm_contract_items);
                    }
                };

                /**
                 * 添加约定条款
                 */
                $scope.addItems = function () {
                    $scope.gridOptions_terms.api.stopEditing();
                    var data = $scope.data.currItem.epm_contract_termss;
                    data.push({});
                    $scope.gridOptions_terms.hcApi.setRowData(data);
                };

                /**
                 * 删除行约定条款
                 */
                $scope.delItems = function () {
                    var idx = $scope.gridOptions_terms.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else if($scope.data.currItem.epm_contract_termss[idx].terms_id>0){
                        swalApi.info('默认的约定条款不能删除');
                    } else {
                        $scope.data.currItem.epm_contract_termss.splice(idx, 1);
                        $scope.gridOptions_terms.hcApi.setRowData($scope.data.currItem.epm_contract_termss);
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