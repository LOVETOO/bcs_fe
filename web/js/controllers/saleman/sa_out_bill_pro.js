/**
 * @param $scope
 * @param BaseService
 * @param $location
 * @param $rootScope
 * @param $modal
 * @param $timeout
 * @param BasemanService
 * @param notify
 * @param $state
 * @param localeStorageService
 * @param FormValidatorService
 */

var param = {};

function setData(e) {
    param = e;
}

function sa_out_bill_pro($scope, BaseService, BasemanService, $stateParams, SlickGridService, $q, $timeout, Magic, AgGridService) {
    console.log('sa_out_bill_pro start');
    $scope.order_clerk = userbean.hasRole('order_clerk', true);
    $scope.data = {"objtypeid": 1003, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"objattachs": [], "sa_out_bill_head_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    var activeRow = [];
    var isEdit = 0;
    var lineData = [];
    $scope.entorgs = [];
    $scope.editableCellStyle = {'background-color': '#FFCC80'}; //可编辑单元格的样式
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_sale_center"})
        .then(function (data) {
            $scope.sale_center = data.dicts;
            $scope.sale_center_default = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_type"})
        .then(function (data) {
            $scope.billTypes = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

    // 添加按钮
    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        if ($scope.data.currItem.stat != 1) {
            return;
        } else {
            return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button> " +
                " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
        }
    };

    //明细表网格设置
    /*$scope.lineOptions = {
        enableColResize: true, //允许调整列宽
        fixedGridHeight: true,
        onGridReady: function () {
            console.log('onGridReady');
            console.log(arguments);
            $scope.lineOptions.whenReady.resolve($scope.lineOptions);
        },
        whenReady: Magic.deferPromise()
    };*/
    /* SlickGrid表格属性 */
    /* {
           editable: true,
           enableAddRow: false,
           enableCellNavigation: true,
           asyncEditorLoading: false,
           autoEdit: true,
           rowHeight: 30
       } */
    ;

    //window.parent.z = $scope.lineOptions;

    /**
     * 根据产品编码获取订单明细的复合请求
     * @param itemCode 产品编码
     * @return {Promise}
     */
    function rqLine(itemCode) {
        //【明细】
        var orderLine = {
            /*amount_bill_f: 0,
            qty_bill: 0,
            order_qty: 0*/
        };


        var item; //【产品】
        var warehouse; //【仓库】
        var price; //【价格】

        return $q
            .when()
            .then(function () {
                if (!itemCode)
                    return $q.reject('');
            })
            //----------------------------------------发请求查询【产品】----------------------------------------
            .then(function () {
                return {
                    item_code: itemCode
                };
            })
            .then(requestItem)
            //----------------------------------------请求响应后----------------------------------------
            .then(function (response) {
                //若查的到产品
                if (response.item_name) {
                    item = response;

                    //把【产品】的属性赋值给【订单明细】
                    itemToOrderLine(item, orderLine);
                }
                else {
                    return $q.reject('产品编码【' + itemCode + '】不存在或不适用');
                }
            })
            //----------------------------------------发请求查询【仓库】----------------------------------------
            .then(function () {
                return {
                    item_code: itemCode
                };
            })
            .then(requestWarehouse)
            //----------------------------------------请求响应后----------------------------------------
            .then(function (response) {
                //若查得到仓库
                if (response.warehouse_name) {
                    warehouse = response;

                    //把【仓库】的属性赋值给【订单明细】
                    warehouseToOrderLine(warehouse, orderLine);
                }
                else {
                    return $q.reject('产品编码【' + itemCode + '】未维护仓库');
                }
            })
            //----------------------------------------发请求查询【价格】----------------------------------------
            .then(function () {
                return {
                    item_id: item.item_id, //产品ID
                    factory_code: warehouse.factory_code //工厂编码
                };
            })
            .then(requestPrice)
            //----------------------------------------请求响应后----------------------------------------
            .then(function (response) {
                price = response;

                //把【价格】的属性赋值给【订单明细】
                priceToOrderLine(price, orderLine);
            })
            //----------------------------------------淘汰品获取库存----------------------------------------
            /*
            .then(function () {
                if (item.is_eliminate == '2') {
                    return $q
                        .when({
                            item_code: item.item_code,
                            factory_code: warehouse.factory_code,
                            warehouse_code: warehouse.warehouse_code
                        })
                        .then(requestStock)
                        .then(function (stock) {
                            //把【库存】的属性赋值给【订单明细】
                            stockToOrderLine(stock, orderLine);
                        });
                }
            })
            */
            //----------------------------------------最后----------------------------------------
            .then(function () {
                return orderLine; //返回明细对象
            })
            ;
    }

    /**
     * 查询【产品】的请求
     * @param args = {
     *     item_code: 产品编码
     * }
     * @return {Promise}
     */
    function requestItem(args) {
        return BasemanService
            .RequestPost('item_org', 'search', {
                searchflag: 22,
                customer_id: $scope.data.currItem.customer_id,
                attribute1: $scope.data.currItem.customer_code,
                attribute2: $scope.data.currItem.dhl_no,//销售渠道 1000-3000
                sqlwhere: "(i.item_code = '" + args.item_code + "')"
            })
            .then(function (response) {
                if (response.item_orgs.length) {
                    return response.item_orgs[0];
                }
                else {
                    return {};
                }
            });
    }

    /**
     * 把【产品】的属性赋值给【订单明细】
     * @param item 产品
     * @param orderLine 订单明细
     * @return {} 订单明细
     */
    function itemToOrderLine(item, orderLine) {
        //把【产品】的【同名】属性赋值给【订单明细】
        Magic.assignProperty(item, orderLine, [
            'item_id', //产品ID
            'item_code', //产品编码
            'item_name', //产品名称
            'uom_name', //基本单位
            'pack_uom', //包装单位
            'factory_name', //工厂名称
            'is_eliminate', //是否淘汰品
            'is_round', //是否凑整
            'is_outdoor', //是否户外产品
            'factorys' //是否属于多个工厂
        ]);

        //把【产品】的【异名】属性赋值给【订单明细】
        Magic.assignProperty(item, orderLine, {
            'spec_qty': 'pack_qty' //包装数量
            //'factory_code': 'attribute31' //工厂编码
        });

        return orderLine;
    }

    /**
     * 查询【仓库】的请求
     * @param args = {
     *     item_code: 产品编码
     * }
     * @return {Promise}
     */
    function requestWarehouse(args) {
        return BasemanService
            .RequestPost("warehouse", "getwarehouse", {
                customer_id: $scope.data.currItem.customer_id,
                sale_center: $scope.data.currItem.dhl_no,//销售渠道 1000-3000
                item_code: args.item_code,
                factory_code: args.factory_code
                //factory_code: item.factory_code,
                //code: "warehouse_default"
            });
    }

    /**
     * 把【仓库】的属性赋值给【订单明细】
     * @param warehouse 仓库
     * @param orderLine 订单明细
     * @return {} 订单明细
     */
    function warehouseToOrderLine(warehouse, orderLine) {
        //把【仓库】的【同名】属性赋值给【订单明细】
        Magic.assignProperty(warehouse, orderLine, [
            'warehouse_id', //仓库ID
            'warehouse_code', //仓库编码
            'warehouse_name' //仓库名称
        ]);

        //把【仓库】的【异名】属性赋值给【订单明细】
        Magic.assignProperty(warehouse, orderLine, {
            'factory_code': 'attribute31' //工厂编码
        });
        orderLine.is_default = warehouse.is_default;
        return orderLine;
    }

    /**
     * 查询【价格】的请求
     * @param args = {
     *     item_id: 产品ID
     *     factory_code: 工厂编码
     * }
     * @return {Promise} 价格对象
     */
    function requestPrice(args) {
        var postData = {
            item_id: args.item_id,
            customer_id: $scope.data.currItem.customer_id,
            date_invbill: $scope.data.currItem.date_invbill,
            flag: $scope.data.currItem.bill_type
        };

        if ($scope.data.currItem.bill_type == 2)
            postData.project_id = $scope.data.currItem.project_id;

        var factoryCodes = $scope.data.currItem.dhl_no.split("-");
        $.each(factoryCodes, function (index, factoryCode) {
            if (factoryCode.charAt(0) == args.factory_code.charAt(0)) {
                postData.attribute21 = factoryCode;
            }
        });

        return BasemanService
            .RequestPost("sa_saleprice_head", "getprice", postData);
    }

    /**
     * 把【价格】的属性赋值给【订单明细】
     * @param price 价格
     * @param orderLine 订单明细
     * @return {} 订单明细
     */
    function priceToOrderLine(price, orderLine) {
        //把【价格】的【同名】属性赋值给【订单明细】
        // Magic.assignProperty(price, orderLine, [
        //     'sa_confer_price_line_id'
        // ]);

        //把【价格】的【异名】属性赋值给【订单明细】
        Magic.assignProperty(price, orderLine, {
            'price_bill_sp': 'price_bill',
            'attribute11': 'saleprice_type_name',
            'sa_confer_price_line_id':'sa_saleprice_line_id'
        });

        return orderLine;
    }

    /**
     * 查询【库存】的请求
     * @param args = {
     *     item_code: 产品编码
     *     factory_code: 工厂编码
     *     warehouse_code: 仓库编码
     * }
     * @return {Promise} 库存对象
     */
    function requestStock(args) {
        return BasemanService
            .RequestPost("hczysapintf", "getitemstock", {
                param1: args.item_code,
                param2: args.factory_code,
                param3: args.warehouse_code
            })
            .then(function (response) {
                if (response.itemstocks.length) {
                    return response.itemstocks[0];
                }
                else {
                    return {};
                }
            });
    }

    /**
     * 把【库存】的属性赋值给【订单明细】
     * @param stock 库存
     * @param orderLine 订单明细
     * @return {} 订单明细
     */
    function stockToOrderLine(stock, orderLine) {
        orderLine.qty_onhand = Magic.toNum(stock.stock);

        return orderLine;
    }

    window.parent.z = $scope.lineOptions;

    console.info($scope.lineOptions);

    //明细表网格列属性
    $scope.lineColumns = [
        {
            type: '序号'
            /*name: "序号",
            id: "seq",
            field: "seq",
            width: 50,
            pinned: true*/
        }/* , {
            id: "op",
            field: "op",
            name: "操作",
            width: 90,
            formatter: editlineButtons
        } */, {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 150,
            pinned: true,
            //formatter: WarmingColor,
            cellStyle: function (params) {
                console.log('cellStyle.item_code:', params);

                var style = $scope.lineOptions.hcApi.getDefaultCellStyle(params);

                //多工厂时
                if (params.data.factorys > 1) {
                    angular.extend(style, {
                        'color': 'red', //字体红色
                        'font-weight': 'bold' //字体加粗
                    });
                }

                return style;
            },
            //cellEditor: '弹出框',
            onPasteStart: function (args) {
                console.log('onPasteStart: item_code');
                console.log(arguments);
            },
            onPasteEnd: function (args) {
                console.log('onPasteEnd: item_code');
                console.log(arguments);
            },
            onCellValueChanged: function (args) {
                console.log('onCellValueChanged: item_code');

                if (args.newValue === args.oldValue)
                    return;

                rqLine(args.newValue)
                    .catch(function (reason) {
                        return {
                            item_id: 0,
                            item_code: '',
                            item_name: reason
                        };
                    })
                    .then(function (line) {
                        angular.extend(args.data, line);
                        return args.data;
                    })
                    .then(calLine)
                    .then($scope.setTotalAmt)
                    .then(refreshLineData)
                ;
            },
            onCellDoubleClicked: function (args) {
                console.log('onCellDoubleClicked: item_code');
                console.log(arguments);

                if (!args.colDef.editable)
                    return;

                $scope.FrmInfo = {
                    title: "产品查询",
                    thead: [{
                        name: "产品编码",
                        code: "item_code"
                    }, {
                        name: "产品名称",
                        code: "item_name"
                    }, {
                        name: "产品规格",
                        code: "specs"
                    }, {
                        name: "工厂",
                        code: "factory_code"
                    }],
                    classid: "item_org",
                    url: "/jsp/req.jsp",
                    sqlBlock: "",
                    backdatas: "item_orgs",
                    ignorecase: "true", //忽略大小写
                    postdata: {
                        searchflag: 22,
                        customer_id: $scope.data.currItem.customer_id,
                        attribute1: $scope.data.currItem.customer_code,
                        attribute2: $scope.data.currItem.dhl_no//销售渠道 1000-3000
                    },
                    searchlist: ["i.item_code", "i.item_name"]
                };

                BasemanService.open(CommonPopController, $scope).result
                    .then(function (item) {
                        args.api.valueService.setValue(args.node, 'item_code', item.item_code);
                    });
            }
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200,
            pinned: true
        }, {
            name: "订货数量",
            id: "qty_bill",
            field: "qty_bill",
            type: '数量',
            width: 100,
            onCellValueChanged: function (args) {
                console.log('onCellValueChanged: qty_bill');

                if (args.newValue === args.oldValue)
                    return;
                $scope.checkQty(args);
                calLine(args.data);
                $scope.setTotalAmt();
                args.api.refreshView();
            }
        }, {
            name: "基本单位",
            id: "uom_name",
            field: "uom_name",
            width: 80
        }, {
            name: "订货数量(箱)", //"订货包装数",
            id: "order_qty",
            field: "order_qty",
            type: '数量',
            width: 100
            //cellEditor: '浮点框'
        }, {
            name: "包装单位",
            id: "pack_uom",
            field: "pack_uom",
            width: 80
        }, {
            name: "包装数量(PC/每箱)",
            id: "pack_qty",
            field: "pack_qty",
            type: '数量',
            width: 100
        }, {
            name: "单价",
            id: "price_bill",
            field: "price_bill",
            type: '金额',
            width: 100,
            formatter: Slick.Formatters.Money
        }, {
            name: "折前金额",
            id: "amount_bill_f",
            field: "amount_bill_f",
            type: '金额',
            width: 100,
            formatter: Slick.Formatters.Money
        }, {
            name: "折后金额",
            id: "attribute41",
            field: "attribute41",
            type: '金额',
            width: 100,
            formatter: Slick.Formatters.Money
        }, {
            name: "价格类型",
            id: "saleprice_type_name",
            field: "saleprice_type_name",
            width: 150
        }, {
            name: "发运方式",
            id: "shipmode_name",
            field: "shipmode_name",
            width: 150,
            cellStyle: function(params) {
                //return $scope.editableCellStyle;

                if ($scope.data.currItem.stat <= 1 || $scope.data.currItem.wfright > 1)
                    return $scope.editableCellStyle;

                return null;
            },
            onCellDoubleClicked: function (args) {
                if (!($scope.data.currItem.stat <= 1 || $scope.data.currItem.wfright > 1))
                    return;

                $scope.FrmInfo = {
                    title: "发运方式",
                    thead: [{
                        name: "编码",
                        code: "shipmode_code"
                    }, {
                        name: "名称",
                        code: "shipmode_name"
                    }],
                    classid: "shipmode",
                    url: "/jsp/req.jsp",
                    sqlBlock: "",
                    backdatas: "shipmodes",
                    ignorecase: "true", //忽略大小写
                    postdata: {},
                    searchlist: ["shipmode_code", "shipmode_name"]
                };
                BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                    args.data.shipmode_id = result.shipmode_id;
                    args.data.shipmode_name = result.shipmode_name;
                    args.api.refreshView();
                });
            },
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                if(args.newValue==""){
                    args.data.shipmode_id = 0;
                }
            }
        }, {
            name: "工厂",
            id: "attribute31",
            field: "attribute31",
            width: 100,
            /*cellStyle: function (params) {
                var style = {};

                var editable = params.column.colDef.editable;

                if (editable === true || (angular.isFunction(editable) && editable(params) === true))
                    angular.extend(style, $scope.editableCellStyle);

                return style;
            },*/
            onCellValueChanged: function (args) {
                console.log('onCellValueChanged: attribute31');

                if (args.newValue === args.oldValue)
                    return;

                var factory_code = args.newValue;

                if (['1000', '3000'].indexOf(factory_code) < 0)
                    factory_code = '';

                //【订单明细】清除【仓库】相关属性
                warehouseToOrderLine({
                    factory_code: factory_code
                }, args.data);
                //【订单明细】清除【价格】相关属性
                priceToOrderLine({}, args.data);
                //【订单明细】清除【库存】相关属性
                stockToOrderLine({}, args.data);

                calLine(args.data);
                $scope.setTotalAmt();
                refreshLineData();

                if (!factory_code)
                    return;

                $q
                    .when({
                        item_code: args.data.item_code, //产品编码
                        factory_code: factory_code //工厂编码
                    })
                    .then(requestWarehouse)
                    .then(function (warehouse) {
                        return putWarehouseIntoOrderLine(warehouse, args.data);
                    })
                    .catch(function (reason) {
                        console.error(reason);
                        args.data.attribute31 = '';
                        return $q.reject(reason);
                    })
                    .finally(refreshLineData);
                ;
            }
        }, {
            name: "仓库编码",
            id: "warehouse_code",
            field: "warehouse_code",
            width: 100,
            cellStyle: function (params) {
                var style = $scope.lineOptions.hcApi.getDefaultCellStyle(params);
                //仓库取值非默认逻辑取值
                if (params.data.is_default == 1) {
                    angular.extend(style, {
                        'color': 'red', //字体红色
                        'font-weight': 'bold' //字体加粗
                    });
                }
                return style;
            },
            /*cellStyle: function (params) {
                var style = {};

                var editable = params.column.colDef.editable;

                if (editable === true || (angular.isFunction(editable) && editable(params) === true))
                    angular.extend(style, $scope.editableCellStyle);

                return style;
            },*/
            onCellValueChanged: function (args) {
                console.log('onCellValueChanged: warehouse_code');

                if (args.newValue === args.oldValue)
                    return;

                if (!args.newValue)
                    return;

                var factory_code = args.data.attribute31;
                var warehouse_code = args.newValue;

                $q
                    .when()
                    .then(function () {
                        if (!factory_code) {
                            var msg = '请先选择工厂';
                            Magic.swalError(msg);
                            throw msg;
                        }

                        return BasemanService
                        /* --------------------仓库-------------------- */
                            .RequestPost('warehouse', 'search', {
                                search_flag: 17,
                                customer_id: $scope.data.currItem.customer_id,
                                factory_code: factory_code,
                                warehouse_code: warehouse_code,
                                item_code: args.data.item_code
                            })
                            .then(function (response) {
                                if (response.warehouses.length === 1)
                                    return response.warehouses[0];
                                else if (!response.warehouses.length)
                                    return $q.reject('查不到指定仓库，或仓库不适用');
                                else
                                    return $q.reject('查到多个仓库');
                            })
                            .then(function (warehouse) {
                                return putWarehouseIntoOrderLine(warehouse, args.data);
                            })
                            ;
                    })
                    .catch(function (reason) {
                        console.error(reason);
                        args.data.warehouse_code = '';
                        return $q.reject(reason);
                    })
                    .finally(refreshLineData);
            },
            onCellDoubleClicked: function (args) {
                console.log('onCellDblClicked warehouse_code');
                console.log(arguments);

                if (!(args.colDef.editable === true || (angular.isFunction(args.colDef.editable) && args.colDef.editable(args) === true)))
                    return;

                var factory_code = args.data.attribute31;

                $q
                    .when()
                    .then(function () {
                        if (!factory_code) {
                            var msg = '请先选择工厂';
                            Magic.swalError(msg);
                            throw msg;
                        }

                        $scope.FrmInfo = {
                            title: "仓库",
                            thead: [{
                                name: "编码",
                                code: "warehouse_code"
                            }, {
                                name: "名称",
                                code: "warehouse_name"
                            }, {
                                name: "工厂",
                                code: "factory_code"
                            }, {
                                name: "备注",
                                code: "note"
                            }],
                            classid: "warehouse",
                            url: "/jsp/req.jsp",
                            sqlBlock: "",
                            backdatas: "warehouses",
                            ignorecase: "true", //忽略大小写
                            postdata: {
                                search_flag: 17,
                                customer_id: $scope.data.currItem.customer_id,
                                factory_code: factory_code,
                                item_code: args.data.item_code
                            },
                            searchlist: ["warehouse_code", "warehouse_name"]
                        };

                        return BasemanService.open(CommonPopController, $scope).result
                            .then(function (warehouse) {
                                return putWarehouseIntoOrderLine(warehouse, args.data);
                            }, angular.noop)
                            ;
                    })
                    .catch(function (reason) {
                        console.error(reason);
                        args.data.warehouse_code = '';
                        return $q.reject(reason);
                    })
                    .finally(refreshLineData);
            }
        }
    ];

    //仓库名称只对订单员可见
    if (userbean.hasRole('order_clerk', true)) {
        $scope.lineColumns.push({
            name: "仓库名称",
            id: "warehouse_name",
            field: "warehouse_name",
            width: 150
        });
    }

    // {
    //     name: "产品库存",
    //     id: "qty_onhand",
    //     field: "qty_onhand",
    //     width: 100,
    //     cssClass: "amt"
    // },
    $scope.lineColumns.push({
        name: "出库数量",
        id: "audit_qty",
        field: "audit_qty",
        type: '数量',
        width: 100
    }, {
        name: "订单交期",
        id: "note",
        field: "note",
        width: 200
    }, {
        name: "销售备注",
        id: "remark",
        field: "remark",
        width: 200,
        editable: true
    }, {
        name: "工程备注",
        id: "proj_remark",
        field: "proj_remark",
        width: 200,
        editable: true
        });

    $scope
        .lineColumns
        .forEach(function (column) {
            if (!column.headerName && column.name)
                column.headerName = column.name;

            column.editable = false; //这里都设为false，需要编辑的列请在  refreshLineColumn  添加
        })
    ;

    //明细表网格设置
    $scope.lineOptions = {
        columnDefs: $scope.lineColumns,
        //enableColResize: true, //允许调整列宽
        //fixedGridHeight: true,
        //默认列定义，在此定义的属性可被所有列继承，列定义可覆盖默认定义的属性
        defaultColDef: {
            cellStyle: function (params) {
                console.log('cellStyle.default', params.column.colId, params);

                var style = {};

                var editable = params.column.colDef.editable;

                //若单元格是可编辑的，添加样式
                if (editable === true || (angular.isFunction(editable) && editable(params) === true))
                    angular.extend(style, $scope.editableCellStyle);

                return style;
            }
        },
        onGridReady: function () {
            console.log('onGridReady');
            console.log(arguments);
            $scope.lineOptions.whenReady.resolve($scope.lineOptions);
        },
        whenReady: Magic.deferPromise()
    };

    AgGridService.createAgGrid('lineViewGrid', $scope.lineOptions);

    function putWarehouseIntoOrderLine(warehouse, orderLine) {
        $q
            .when()
            .then(function () {
                //把【仓库】的属性赋值给【订单明细】
                warehouseToOrderLine(warehouse, orderLine);
            })
            /* --------------------价格-------------------- */
            .then(function () {
                return {
                    item_id: orderLine.item_id, //产品ID
                    factory_code: orderLine.attribute31 //工厂编码
                };
            })
            .then(requestPrice)
            .then(function (price) {
                //把【价格】的属性赋值给【订单明细】
                priceToOrderLine(price, orderLine);
            })
            /* --------------------库存-------------------- */
            /*
            .then(function () {
                if (orderLine.is_eliminate == '2') {
                    return $q
                        .when({
                            item_code: orderLine.item_code, //产品编码
                            factory_code: orderLine.attribute31,  //工厂编码
                            warehouse_code: orderLine.warehouse_code//仓库编码
                        })
                        .then(requestStock)
                        .then(function (stock) {
                            //把【库存】的属性赋值给【订单明细】
                            stockToOrderLine(stock, orderLine);
                        });
                }
            })
            */
            /* --------------------合计-------------------- */
            .then(function () {
                return orderLine;
            })
            .then(calLine)
            .then($scope.setTotalAmt)
            .then(refreshLineData)
            .then(function () {
                return orderLine;
            })
            /* --------------------异常-------------------- */
            .catch(Magic.defaultCatch)
    }


    //初始化网格
    //$scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);
    //明细绑定点击事件
    //$scope.lineGridView.onClick.subscribe(dgLineClick);
    //$scope.lineGridView.onDblClick.subscribe(dgLineDblClick);

    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        if ($(e.target).hasClass("viewbtn")) {
            $scope.editLine(e, args);
            e.stopImmediatePropagation();

        }
        if ($(e.target).hasClass("delbtn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    $scope.checkQty = function (args) {
        console.log(args);
        if ($scope.data.currItem.sa_saleprice_head_id > 0) {
            if (isNaN(args.newValue)) {
                BasemanService.notice("无效数字" + args.newValue, "alert-success");
                args.data.qty_bill = args.oldValue;
                return;
            }
            if (Number(args.newValue) > Number(args.data.max_qty)) {
                args.data.qty_bill = args.oldValue;
                BasemanService.notice("订货数量不能超过" + args.data.max_qty, "alert-success");
                return;
            }
        }
    }

    /**
     * 明细网格双击事件
     */
    function dgLineDblClick(e, args) {
        if ($scope.data.currItem.stat == 1) {
            $scope.editLine(e, args);
        }
    }


    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        if ($scope.data.currItem.sa_saleprice_head_id > 0) return;
        var item_name = args.grid.getDataItem(args.row).item_name;
        BasemanService.swalWarning("删除", "确定要删除产品 " + item_name + " 吗？", function (bool) {
            if (bool) {
                var dg = $scope.lineGridView;
                dg.getData().splice(args.row, 1);
                dg.invalidateAllRows();
                dg.render();
                BasemanService.notice("删除成功！", "alert-success");
                $scope.setTotalAmt();
            } else {
                return;
            }
        })
    };

    /**
     * 加载网格数据
     */

    /*function setGridData(gridView, datas) {
        gridView.setData([]);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }*/

    /**
     * 刷新明细表格数据
     * return {Promise}
     */
    function refreshLineData() {
        return $scope
            .lineOptions
            .whenReady
            .then(function () {
                $scope
                    .lineOptions
                    .hcApi
                    .setRowData($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
            })
            ;
    }

    /**
     * 刷新明细表格列
     * return {Promise}
     */
    function refreshLineColumn() {
        return $scope.lineOptions.whenReady.then(function () {
            $scope.lineColumns.forEach(function (colDef) {
                //产品编码、订货数量、备注
                if (['item_code', 'qty_bill', 'remark', 'proj_remark','shipmode_name'].indexOf(colDef.field) >= 0) {
                    //制单状态的才能编辑
                    colDef.editable = $scope.data.currItem.stat <= 1 || $scope.data.currItem.wfright > 1;
                }
                //工厂编码、仓库编码
                else if (['attribute31', 'warehouse_code'].indexOf(colDef.field) >= 0) {
                    //未审核的、用户是订单员才能编辑
                    colDef.editable = function (params) {
                        console.log('editable:', params);

                        //非制单，或没有流程编辑权限
                        if (!($scope.data.currItem.stat <= 1 || $scope.data.currItem.wfright > 1))
                            return false;

                        //订单员可改库位
                        if (userbean.hasRole('order_clerk', true))
                            return true;

                        //运营中心订单员只可改非户外产品的库位
                        if (userbean.hasRole('oc_order', true))
                            return params.node.data.is_outdoor != 2;

                        //其他情况不允许修改
                        return false;
                    };
                }
            });

            $scope.lineOptions.api.setColumnDefs($scope.lineColumns);
        });
    }

    /**
     * 增加/编辑明细事件
     */
    $scope.addLine = function () {
        swal({
            title: '请输入要增加的行数',
            type: 'input', //类型为输入框
            inputValue: 1, //输入框默认值
            closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
            showCancelButton: true //显示【取消】按钮
        }, function (inputValue) {
            if (inputValue === false) {
                swal.close();
                return;
            }

            var rowCount = Magic.toNum(inputValue);
            if (rowCount <= 0) {
                swal.showInputError('请输入有效的行数');
                return;
            }
            else if (rowCount > 1000) {
                swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                return;
            }

            swal.close();

            var data = $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads;

            for (var i = 0; i < rowCount; i++) {
                var newLine = {shipmode_id:0};
                $scope
                    .lineColumns
                    .forEach(function (column) {
                        newLine[column.field] = '';
                    });
                data.push(newLine);
            }

            $scope.lineOptions.hcApi.setRowData(data);
            $scope.lineOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
        });
    };
    /* function () {
        isEdit = 2;
        $scope.data.addCurrItem = {
            customer_id:$scope.data.currItem.customer_id,
            base_currency_id:1,
            // warehouse_id:$scope.data.currItem.warehouse_id,
            // warehouse_code:$scope.data.currItem.warehouse_code,
            // warehouse_name:$scope.data.currItem.warehouse_name,
            // factory_code:$scope.data.currItem.factory_code,
            // factory_name:$scope.data.currItem.factory_name,
            audit_qty:0
        };
        $scope.searchItem('item');
    }; */

    $scope.addLineByExcel = function () {
        return $q
            .when()
            .then(importLine)
            .then(function (lines) {
                console.log(lines);

                return lines
                    .map(function (line) {
                        return $q
                            .when(line.item_code)
                            .then(rqLine)
                            .then(function (responseLine) {
                                angular.extend(responseLine, line);
                                return responseLine;
                            }, function (reason) {
                                line.item_name = reason.id ? reason.message : reason;
                                line.item_code = '';
                                return line;
                            })
                            .then(calLine);
                    });
            })
            .then($q.all)
            .then(function (lines) {
                console.log(lines);
                var rowData = $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads;
                Array.prototype.push.apply(rowData, lines);
                $scope.lineOptions.hcApi.setRowData(rowData);
            })
            .then($scope.setTotalAmt)
            .catch(function (reason) {
                console.error(reason);
                return $q.reject(reason);
            })
            ;
    };

    function importLine() {
        if (document.getElementById("file1")) {
            document.getElementById("file1").parentNode.removeChild(document.getElementById("file1"));
        }
        var inputObj = document.createElement('input');
        inputObj.setAttribute('id', 'file1');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('name', 'docFile0');
        inputObj.setAttribute("style", 'visibility:hidden');
        inputObj.setAttribute("nv-file-select", '');
        inputObj.setAttribute("uploader", 'uploader');
        //inputObj.setAttribute("accept", "image/*");
        inputObj.setAttribute("capture", "camera");
        document.body.appendChild(inputObj);

        var deferred = $q.defer();

        inputObj.onchange = function (o) {
            if (o.target.files) {
                try {
                    $.ajaxFileUpload({
                        url: "/web/scp/filesuploadexcel.do",
                        type: 'post',
                        secureuri: false,
                        fileElementId: 'file1',//file标签的id
                        dataType: 'json',//返回数据的类型
                        data: {
                            classname: "com.ajerp.saleman.Sa_Out_Bill_Head",
                            funcname: "doImportLine"
                        },
                        success: function (response, status) {
                            console.log(response);
                            if (response.failure === 'true')
                                deferred.reject(response.msg);
                            else
                                deferred.resolve(response.data.sa_out_bill_lineofsa_out_bill_head);
                        },
                        error: function (response, status, e) {
                            console.log(response);
                            deferred.reject(response.responseText);
                        }
                    });
                } finally {

                }
            }
        };

        inputObj.click();

        return deferred
            .promise
            .catch(function (reason) {
                console.error(reason);

                if (reason)
                    Magic.swalError(['导入失败，异常信息如下：', reason]);

                return $q.reject(reason);
            });
    }

    function calLine(line) {
        var price_bill = Magic.toNum(line.price_bill); //单价
        var qty_bill = Magic.toNum(line.qty_bill); //订货数量
        var pack_qty = Magic.toNum(line.pack_qty); //包装数量
        var is_round = Magic.toNum(line.is_round);
        if (qty_bill % pack_qty !== 0&&is_round==2) {
            BasemanService.notice('产品【' + line.item_code + '】的订货数量必须为包装数量的整数倍', "alert-success");
        }
        line.order_qty = pack_qty === 0 ? 0 : Math.floor(qty_bill / pack_qty); //订货数量(箱)
        console.log(line.order_qty);
        line.amount_bill_f = price_bill * qty_bill; //折前金额
        line.attribute41 = line.amount_bill_f * (1 - Magic.toNum($scope.data.currItem.attribute4) / 100); //折后金额
        //line.shipmode_id = $scope.data.currItem.shipmode_id;
        return line;
    }

    $scope.delLine = function () {
        var selections = $scope
            .lineOptions
            .api
            .getRangeSelections()
        ;

        console.log($scope.lineOptions.api.selectionController);

        if (selections.length === 1) {
            var oldIndex = selections[0].start.rowIndex;
            var delCount = selections[0].end.rowIndex - oldIndex + 1;
            var field = selections[0].columns[0].colDef.field;

            var data = $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads;

            data.splice(oldIndex, delCount);

            $scope
                .lineOptions
                .hcApi
                .setRowData(data)
            ;

            if (data.length) {
                var newIndex;
                if (oldIndex < data.length) {
                    newIndex = oldIndex;
                }
                else {
                    newIndex = data.length - 1;
                }

                $scope
                    .lineOptions
                    .hcApi
                    .setFocusedCell(newIndex, field);

                /*$scope
                    .lineOptions
                    .api
                    .setFocusedCell(newIndex, field);

                $scope
                    .lineOptions
                    .api
                    .rangeController
                    .setRangeToCell($scope
                        .lineOptions
                        .api
                        .getFocusedCell());*/
            }

            $scope.setTotalAmt();
        }
    };

    var idx = -1;
    $scope.editLine = function (e, args) {
        if ($scope.data.currItem.sa_saleprice_head_id > 0) return;
        isEdit = 1;
        idx = args.row;
        $scope.data.addCurrItem = $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads[idx];
        HczyCommon.stringPropToNum($scope.data.addCurrItem);
        $("#addLineModal").modal();
        //$scope.$apply();
    }


    /**
     * 保存明细到网格中
     */
    $scope.saveAddData = function () {
        if ($scope.data.addCurrItem.is_eliminate == '2' && $scope.data.addCurrItem.qty_onhand < $scope.data.addCurrItem.qty_bill) {
            BasemanService.notice("产品" + $scope.data.addCurrItem.item_code + "(淘汰品)库存不足不允许下单");
            return;
        }
        if (isEdit == 2) {
            $scope.data.addCurrItem.seq = $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads.length + 1;
            $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads.push($scope.data.addCurrItem);
        }
        $("#addLineModal").modal("hide");
        $scope.setTotalAmt();
    }

    //计算总金额 折后金额
    $scope.setTotalAmt = function () {
        if (!Magic.isNum($scope.data.currItem.attribute4)) {
            $scope.data.currItem.attribute4 = 0;
        }
        if ($scope.data.currItem.attribute4 > 12) $scope.data.currItem.attribute4 = 12;
        if ($scope.data.currItem.attribute4 < 0) $scope.data.currItem.attribute4 = 0;
        $scope.data.currItem.amount_total_f = 0;
        $scope.data.currItem.wtamount_billing = 0;
        $scope.data.currItem.all_qty = 0; //订货总数
        if ($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads.length > 0) {
            $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads.forEach(function (item) {
                $scope.data.currItem.amount_total_f += Number(item.amount_bill_f);
                item.attribute41 = Number(item.amount_bill_f) * (1 - $scope.data.currItem.attribute4 / 100);//折后金额
                $scope.data.currItem.all_qty += Magic.toNum(item.qty_bill); //累计订货数量得到订货总数
            });
            $scope.data.currItem.wtamount_billing = $scope.data.currItem.amount_total_f * (1 - $scope.data.currItem.attribute4 / 100);
            $scope.lineOptions.api.refreshView();
        }
        /*$scope.lineGridView.invalidateAllRows();
        $scope.lineGridView.render();*/

        //折扣额 = 折前总金额 * 折扣率
        $scope.data.currItem.disc_amt = $scope.data.currItem.amount_total_f * $scope.data.currItem.attribute4 / 100;
        //折前返利余额
        $scope.data.currItem.bf_disc_balance = Magic.toNum($scope.data.currItem.bf_disc_balance);
        //折后返利余额 = 折前返利余额 - 折扣额
        $scope.data.currItem.af_disc_balance = $scope.data.currItem.bf_disc_balance - $scope.data.currItem.disc_amt;

        $scope.$applyAsync();
    };

    function checkData() {
        var lineData = $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads;
        var reason = [];
        return $q
            .when()
            //获取淘汰品库存
            .then(function () {
                var promises = lineData
                //取出淘汰品的明细
                    .filter(function (line) {
                        return line.is_eliminate == 2;
                    })
                    //逐个取库存
                    .map(function (line) {
                        var param = Magic.assignProperty(line, {}, {
                            'item_code': 'item_code',
                            'attribute31': 'factory_code',
                            'warehouse_code': 'warehouse_code'
                        });

                        return requestStock(param)
                            .then(function (stock) {
                                stockToOrderLine(stock, line);
                            });
                    });

                return $q.all(promises);
            })
            //产品编码和订货数量必填
            .then(function () {
                lineData
                    .forEach(function (line, index) {
                        //行号
                        var row = index + 1;

                        //产品编码
                        if (!line.item_code)
                            reason.push('第' + row + '行产品不能为空');

                        //工厂编码
                        if (!line.attribute31)
                            reason.push('第' + row + '行工厂不能为空');

                        //仓库编码
                        if (!line.warehouse_code)
                            reason.push('第' + row + '行仓库不能为空');

                        //订货数量
                        var qty_bill = Magic.toNum(line.qty_bill);

                        if (!qty_bill)
                            reason.push('第' + row + '行产品【' + line.item_code + '】的订货数量不能为0');
                        else if (line.is_eliminate == 2) {
                            if (qty_bill > Magic.toNum(line.qty_onhand))
                                reason.push('第' + row + '行产品【' + line.item_code + '】(淘汰品)库存不足不允许下单');
                        }

                        //包装数量
                        var pack_qty = Magic.toNum(line.pack_qty);
                        //是否凑整
                        var is_round = Magic.toNum(line.is_round);
                        if (pack_qty !== 0 && is_round === 2) {
                            //订货数量(箱)
                            if (qty_bill % pack_qty !== 0)
                                reason.push('第' + row + '行产品【' + line.item_code + '】的订货数量必须为包装数量的整数倍');
                        }
                    });
            })
            //产品编码不能重复
            // .then(function () {
            //     var itemCodeToRow = {};
            //
            //     lineData
            //         .forEach(function (line, index) {
            //             //行号
            //             var row = index + 1;
            //
            //             if (angular.isString(line.item_code) && line.item_code) {
            //                 //重复的行号
            //                 var sameRow = itemCodeToRow[line.item_code];
            //
            //                 if (angular.isNumber(sameRow)) {
            //                     reason.push('第' + row + '行产品【' + line.item_code + '】与第' + sameRow + '行重复');
            //                 }
            //                 else {
            //                     itemCodeToRow[line.item_code] = row;
            //                 }
            //             }
            //         });
            // })
            .then(function () {
                if (Magic.isNotEmptyArray(reason)) {
                    var msg = reason.length > 9 ? reason.slice(0, 9) : reason;
                    Magic.swalError(msg);
                    return $q.reject(reason);
                }
            })
            ;
    }

    /**
     * 保存数据
     */
    $scope.saveData = function (bsubmit) {
        return $q
            .when()
            .then(function () {
                $scope.lineOptions.api.stopEditing();
            })
            .then(checkData)
            .then(function () {
                if ($scope.data.currItem.sa_out_bill_head_id > 0) {
                    //调用后台保存方法
                    return BasemanService.RequestPost("sa_out_bill_head", "update", JSON.stringify($scope.data.currItem))
                        .then(function (data) {
                            BasemanService.swalSuccess("成功", "保存成功！");
                            if (bsubmit) {
                                $scope.hcWf().submitWf();
                                /*if (angular.element('#wfinspage').length == 0) {
                                    $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                                }
                                $scope.initWfIns(true);
                                $('#detailtab a:last').tab('show');*/
                            }
                        });
                } else {
                    return BasemanService.RequestPost("sa_out_bill_head", "insert", JSON.stringify($scope.data.currItem))
                        .then(function (data) {
                            BasemanService.swalSuccess("成功", "保存成功！");
                            //添加成功后框不消失直接Select方法查该明细
                            $scope.data.currItem.sa_out_bill_head_id = data.sa_out_bill_head_id;
                            $scope.selectCurrenItem();
                            //如果是保存并提交则提交流程
                            if (bsubmit) {
                                $scope.hcWf().submitWf();
                                /*$('#detailtab a:last').tab('show');
                                if (angular.element('#wfinspage').length == 0) {
                                    $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                                }
                                $scope.initWfIns(true);*/
                            }
                            isEdit = 0;
                        });

                }
            })
            ;
    };

    (function () {
        var customerCodeBeforeInput; //输入前的客户编码
        var customerCodeAfterInput; //输入后的客户编码
        var customerCodeElement; //客户编码DOM元素
        var ngBlurDisabled = false; //是否禁用失去焦点事件

        /**
         * 客户编码 - 获得焦点事件
         * @param $event
         */
        $scope.ngFocusOfCustomerCode = function ($event) {
            customerCodeBeforeInput = $scope.data.currItem.customer_code;
        };

        /**
         * 客户编码 - 失去焦点事件
         * @param $event
         */
        $scope.ngBlurOfCustomerCode = function ($event) {
            if (ngBlurDisabled)
                return;

            if ($event.target.readOnly || $event.target.disabled)
                return;

            customerCodeElement = $($event.target);

            customerCodeAfterInput = $scope.data.currItem.customer_code;

            if (customerCodeBeforeInput !== customerCodeAfterInput) {
                doAfterInputCustomerCode();
            }
        };

        /**
         * 客户编码 - 键盘按键按下事件
         * @param $event
         */
        $scope.ngKeydownOfCustomerCode = function ($event) {
            if ($event.target.readOnly || $event.target.disabled)
                return;

            customerCodeElement = $($event.target);

            customerCodeAfterInput = $scope.data.currItem.customer_code;

            //当敲击回车键时(不带Alt、Ctrl、Shift)
            if ($event.key === 'Enter' && !$event.altKey && !$event.ctrlKey && !$event.shiftKey) {
                doAfterInputCustomerCode();
            }
        };

        /**
         * 输入客户编码后做的事
         */
        function doAfterInputCustomerCode() {
            customerCodeBeforeInput = customerCodeAfterInput;

            var promise;
            if (customerCodeAfterInput)
                promise = BasemanService
                    .RequestPost('customer_org', 'search', {
                        search_flag: 9,
                        attribute4: 1,
                        attribute1: customerCodeAfterInput,
                        sqlwhere: "customer_code = '" + customerCodeAfterInput + "'"
                    })
                    .then(function (response) {
                        if (response.customer_orgs.length)
                            return response.customer_orgs[0];

                        if (response.customer_orgs.length > 1)
                            return $q.reject((customerCodeAfterInput ? '编码【' + customerCodeAfterInput + '】' : '') + '匹配到多个客户');

                        return $q.reject((customerCodeAfterInput ? '编码【' + customerCodeAfterInput + '】' : '') + '匹配不到客户');
                    })
                ;
            else {
                promise = Magic.deferPromise();
                $timeout(promise.reject.bind(promise, '请输入客户编码'), 100);
            }

            promise.then(doAfterGetCustomer);

            promise
                .catch(function (reason) {
                    doAfterGetCustomer({});

                    //暂时禁用失去焦点事件
                    ngBlurDisabled = true;
                    return $q.reject(reason);
                })
                .catch(Magic.defaultCatch)
                .catch(function () {
                    //恢复失去焦点事件
                    ngBlurDisabled = false;
                    //重新聚焦在客户编码处
                    customerCodeElement.focus();
                })
            ;
        }
    })();

    /**
     * 获取客户后做的事
     * @param {Object} customer
     * @return {Object}
     */
    function doAfterGetCustomer(customer) {
        $scope.reset();
        $scope.setCustomer(customer);
        return customer;
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        console.log('sa_out_bill_pro selectCurrenItem start');
        if ($scope.data.currItem.sa_out_bill_head_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sa_out_bill_head", "select", JSON.stringify({"sa_out_bill_head_id": $scope.data.currItem.sa_out_bill_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    /*
                    setGridData($scope.lineGridView,$scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
                    $scope.lineGridView.render();
                    */

                    //if($scope.data.currItem.stat>1) BasemanService.hiddenColumns($scope.lineGridView,["op"]);

                })
                .then(refreshLineColumn)
                .then(refreshLineData);
        } else {
            $scope.setNewItem();
        }

        console.log('sa_out_bill_pro selectCurrenItem end');
    };

    $scope.setNewItem = function () {
        $scope.data.currItem = {
            "sa_out_bill_head_id": 0,
            "stat": 1,
            "need_reply": 2,
            "bill_type": 1,
            "bluered": "B",
            "attribute4": 0,
            "date_invbill": new Date().format("yyyy-MM-dd hh:mm:ss"),
            "sa_out_bill_lineofsa_out_bill_heads": [],
            "entorgcode": "10",
            "entorgname": "通用产品组"
        };

        BasemanService.getUserQ().then(function (user) {
            if (user.orgofusers.length === 1) {
                var org = user.orgofusers[0];
                //若用户所在机构为运营中心
                if (org.orgtype == 6)
                    //销售渠道默认为专业照明
                    $scope.data.currItem.dhl_no = $scope.sale_center[0].dictvalue;
            }
        });
        //setGridData($scope.lineGridView,$scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
        //$scope.lineOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);

        //带出客户信息
        // BasemanService.RequestPost("customer_org", "search", JSON.stringify({search_flag:7})).then(function (data) {
        //     if(data.customer_orgs.length>0){
        //         $scope.data.currItem.created_by = data.customer_orgs[0].userid;
        //         $scope.data.currItem.customer_id = data.customer_orgs[0].customer_id;
        //         $scope.data.currItem.customer_code = data.customer_orgs[0].customer_code;
        //         $scope.data.currItem.customer_name = data.customer_orgs[0].customer_name;
        //
        //         //地址等信息
        //         BasemanService.RequestPost("customer_org", "search", JSON.stringify({search_flag:9,
        //             sqlwhere:"customer_code ='"+$scope.data.currItem.customer_code+"'"}))
        //             .then(function (data1) {
        //                     $scope.setCustomer(data1.customer_orgs[0]);
        //             });
        //     }
        // });

        //默认汽运方式
        // BasemanService.RequestPost("shipmode", "search", JSON.stringify({"sqlwhere": "shipmode_code='01'"}))
        //     .then(function (data) {
        //         $scope.data.currItem.shipmode_id = data.shipmodes[0].shipmode_id;
        //         $scope.data.currItem.shipmode_code = data.shipmodes[0].shipmode_code;
        //         $scope.data.currItem.shipmode_name = data.shipmodes[0].shipmode_name;
        //     })
        $q.when().then(refreshLineColumn).then(refreshLineData);
    }

    /**
     * 日期格式化方法
     * @param fmt
     * @returns {*}
     */
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    /**
     * 触发上传文件
     */
    $scope.addFile = function () {
        if (document.getElementById("file1")) {
            document.getElementById("file1").parentNode.removeChild(document.getElementById("file1"));
        }
        var inputObj = document.createElement('input');
        inputObj.setAttribute('id', 'file1');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('name', 'docFile0');
        inputObj.setAttribute("style", 'visibility:hidden');
        inputObj.setAttribute("nv-file-select", '');
        inputObj.setAttribute("uploader", 'uploader');
        document.body.appendChild(inputObj);
        inputObj.onchange = $scope.uploadFile;
        inputObj.click();
    }

    /**
     * 上传附件
     * @param o
     */
    $scope.uploadFile = function (o) {
        console.log(o);
        if (o.target.files) {
            try {
                $.ajaxFileUpload({
                    url: "/web/scp/filesuploadsave2.do",
                    type: 'post',
                    secureuri: false,
                    fileElementId: 'file1',//file标签的id
                    dataType: 'json',//返回数据的类型
                    success: function (data, status) {
                        if (data.data) {
                            if (!$scope.data.currItem.objattachs) {
                                $scope.data.currItem.objattachs = [];
                            }
                            $scope.data.currItem.objattachs.push({
                                "docid": data.data[0].docid + "",
                                "docname": data.data[0].docname,
                                "url": window.URL.createObjectURL(o.target.files[0])
                            });
                            $scope.$apply();
                        }
                    },
                    error: function (data, status, e) {
                        console.log(data);
                    }
                });
            } finally {
                // $showMsg.loading.close();
            }
        }
    }

    /**
     * 下载文件
     * @param file
     */
    $scope.downloadAttFile = function (file) {
        window.open("/downloadfile.do?docid=" + file.docid);
    }
    /**
     * 删除文件
     * @param file
     */
    $scope.deleteFile = function (file) {
        console.log("deleteFile...")
        if (file && file.docid > 0) {
            for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                if ($scope.data.currItem.objattachs[i].docid == file.docid) {
                    $scope.data.currItem.objattachs.splice(i, 1);
                    break;
                }
            }
        }
    }

    function WarmingColor(row, cell, value, column, rowData) {
        var color = 'black';
        var factorys = rowData.factorys;
        if (factorys > 1) {
            color = 'red';
        }
        return '<span style="color:' + color + ';">' + value + '</span>';
    }

    /**
     * 随机数
     * @type {number}
     */
    var randomNum = (new Date()).getTime();

    /**
     * 流程url
     * @param {} args
     */
    function wfSrc(args) {
        //默认值
        var urlParams = {
            wftempid: '',
            wfid: $scope.data.currItem.wfid,
            objtypeid: $scope.data.objtypeid,
            objid: $scope.data.currItem.sa_out_bill_head_id,
            submit: $scope.data.bSubmit
        }

        //传入值覆盖默认值
        if (angular.isObject(args))
            angular.extend(urlParams, args);

        //0转为""
        angular.forEach(urlParams, function (value, key, obj) {
            if (value == 0)
                obj[key] = '';
        });

        return '/web/index.jsp'
            + '?t=' + randomNum               //随机数，请求唯一标识，加上这个Google浏览器才会发出请求
            + '#/crmman/wfins'
            + '/' + urlParams.wftempid        //流程模板ID
            + '/' + urlParams.wfid            //流程实例ID
            + '/' + urlParams.objtypeid       //对象类型ID
            + '/' + urlParams.objid           //对象ID
            + '/' + (urlParams.submit ? 1 : 0) //是否提交流程
            + '?showmode=2';
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.sa_out_bill_head_id && $scope.data.currItem.sa_out_bill_head_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                var theSrc = wfSrc();
                var theElement = angular.element('#wfinspage');
                if (theElement.attr('src') !== theSrc) {
                    theElement.attr('src', theSrc);
                }
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        if ($(e.target).is('#tab_head_wf')) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
        }
        else {
            $q
                .when()
                .then(refreshLineColumn)
                .then(refreshLineData)
            ;
        }
    }

    /**
     * 获取流程模版ID
     * @param objtypeid
     */
    $scope.getWfTempId = function (objtypeid) {
        var iWftempId = 0;
        var postData = {
            "objtypeid": objtypeid
        }
        BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
            .then(function (data) {
                if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                    for (var i = data.objwftempofobjconfs.length - 1; i > -1; i--) {
                        //条件过滤
                        if (data.objwftempofobjconfs[i].execcond != '') {
                            //用正则表达式替换变量
                            var regexp = new RegExp("<item>", "gm");
                            var sexeccond = data.objwftempofobjconfs[i].execcond.replace(regexp, "$scope.data.currItem");
                            //运行表达式 不符合条件的移除
                            if (!eval(sexeccond)) {
                                data.objwftempofobjconfs.splice(i, 1);
                            }
                        }
                    }

                    if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                        $scope.data.wftemps = data.objwftempofobjconfs;
                        //弹出模态框供用户选择
                        $("#selectWfTempModal").modal();
                    } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                        $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                    }
                } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                    $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                }
            });
    }

    /**
     * 选择流程模版ID
     * @param wftempid
     */
    $scope.selectWfTemp = function (wftempid) {
        $("#selectWfTempModal").modal("hide");
        var theSrc = wfSrc({
            wftempid: wftempid
        });
        angular.element('#wfinspage').attr('src', theSrc);
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

    $scope.selectOrder = function (result) {
        $scope.data.currItem.parentbillid = result.sa_out_bill_head_id;
        $scope.data.currItem.attribute3 = result.sa_salebillno;
        $scope.data.currItem.project_id = result.project_id;
        $scope.data.currItem.project_code = result.project_code;
        $scope.data.currItem.project_name = result.project_name;
        $scope.data.currItem.in_date = result.book_date;
        //调用后台select方法查询详情
        BasemanService.RequestPost("sa_out_bill_head", "select", JSON.stringify({"sa_out_bill_head_id": $scope.data.currItem.parentbillid}))
            .then(function (data) {
                var list = [];
                $.each(data.sa_out_bill_lineofsa_out_bill_heads, function (index, item) {
                    list.push($scope.getprice1(item, $scope));
                });
                $q.all(list).then(function () {
                    $scope.data.currItem.amount_total_f = 0;
                    $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads = data.sa_out_bill_lineofsa_out_bill_heads;
                    $.each($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads, function (index, item) {
                        $scope.data.currItem.amount_total_f += item.price_bill * item.qty_bill;
                    });
                    SlickGridService.setData({
                        grid: $scope.lineGridView,
                        data: $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads
                    });
                });
            });
    }

    $scope.select_item_org = function (result) {
        var flag = true;
        $.each($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads, function (index, item) {
            if (result.item_code == item.item_code) {
                flag = false;
            }
        });
        if (flag == true) {
            $scope.getprice(result, $scope);
        } else {
            BasemanService.swal("提示", "不能添加重复产品！");
        }
    }

    //包装箱数改变触发
    $scope.sum = function () {
        $scope.data.addCurrItem.qty_bill = $scope.data.addCurrItem.pack_qty * $scope.data.addCurrItem.order_qty;
        $scope.data.addCurrItem.amount_bill_f = $scope.data.addCurrItem.price_bill * $scope.data.addCurrItem.qty_bill;
    }

    //数量改变触发
    $scope.sum1 = function () {
        $scope.data.addCurrItem.amount_bill_f = $scope.data.addCurrItem.price_bill * $scope.data.addCurrItem.qty_bill;
    }

    $scope.getprice = function (result, $scope) {
        //获取库存地点
        BasemanService.RequestPost("warehouse", "getwarehouse", {
            customer_id: $scope.data.currItem.customer_id,
            factory_code: result.factory_code, code: "warehouse_default"
        })
            .then(function (warehouse) {
                if (warehouse.warehouse_id > 0) {
                    $scope.data.addCurrItem.warehouse_id = warehouse.warehouse_id;
                    $scope.data.addCurrItem.warehouse_code = warehouse.warehouse_code;
                    $scope.data.addCurrItem.warehouse_name = warehouse.warehouse_name;

                    //取价格
                    var postData = {
                        item_id: result.item_id,
                        customer_id: $scope.data.currItem.customer_id,
                        date_invbill: $scope.data.currItem.date_invbill,
                        flag: $scope.data.currItem.bill_type
                    };
                    if ($scope.data.currItem.bill_type == 2) postData.project_id = $scope.data.currItem.project_id;
                    var entorgs = $scope.data.currItem.dhl_no.split("-");
                    $.each(entorgs, function (index, item) {
                        if (item.charAt(0) == result.factory_code.charAt(0)) {
                            postData.attribute21 = item;
                        }
                    });
                    BasemanService.RequestPost("sa_saleprice_head", "getprice", postData)
                        .then(function (data) {
                            $scope.data.addCurrItem.item_id = result.item_id;
                            $scope.data.addCurrItem.item_code = result.item_code;
                            $scope.data.addCurrItem.item_name = result.item_name;
                            $scope.data.addCurrItem.uom_name = result.uom_name;
                            $scope.data.addCurrItem.pack_uom = result.pack_uom;
                            $scope.data.addCurrItem.pack_qty = Number(result.spec_qty);
                            $scope.data.addCurrItem.price_bill = data.price_bill_sp;
                            $scope.data.addCurrItem.saleprice_type_name = data.attribute11;
                            $scope.data.addCurrItem.sa_saleprice_line_id = data.sa_confer_price_line_id;
                            $scope.data.addCurrItem.attribute31 = result.factory_code;
                            $scope.data.addCurrItem.factory_name = result.factory_name;
                            $scope.data.addCurrItem.amount_bill_f = 0;
                            $scope.data.addCurrItem.qty_bill = 0;
                            $scope.data.addCurrItem.order_qty = 0;
                            $scope.data.addCurrItem.is_eliminate = result.is_eliminate;
                            $scope.data.addCurrItem.factorys = result.factorys;//是否属于多个工厂
                            //淘汰品获取库存
                            if (result.is_eliminate == '2') {
                                $scope.getOnhandQty();
                            }
                            $("#addLineModal").modal();
                        });
                } else {
                    BasemanService.notice("请维护客户发货仓信息");
                }
            });


    }

    $scope.getprice1 = function (result, $scope) {
        var postData = {
            item_id: result.item_id,
            customer_id: $scope.data.currItem.customer_id,
            date_invbill: $scope.data.currItem.date_invbill
        };
        //取价格
        return BasemanService.RequestPost("sa_saleprice_head", "getprice", postData)
            .then(function (data) {
                result.price_bill = data.price_bill_sp;
                result.amount_bill_f = data.price_bill_sp * result.qty_bill;
                result.saleprice_type_name = data.attribute11;
                result.sa_saleprice_line_id = data.sa_confer_price_line_id;
            });
    }

    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if (type == 'customer') {
            if ($scope.data.currItem.customer_id > 0) {
                BasemanService.swalWarning("提示", "重新选择客户会清除已选产品信息,是否继续？", function (bool) {
                    if (bool) {
                        $scope.FrmInfo = {
                            title: "客户",
                            thead: [{
                                name: "客户编码",
                                code: "customer_code"
                            }, {
                                name: "客户名称",
                                code: "customer_name"
                            }],
                            classid: "customer_org",
                            url: "/jsp/req.jsp",
                            sqlBlock: "",
                            backdatas: "customer_orgs",
                            ignorecase: "true", //忽略大小写
                            postdata: {
                                search_flag: 9,
                                attribute4: 1,
                                attribute1: $scope.data.currItem.sale_center_code
                            },
                            searchlist: ["customer_code", "customer_name"]
                        };
                        BasemanService.open(CommonPopController, $scope).result.then(doAfterGetCustomer)/*.then(function (result) {
                            $scope.reset();
                            $scope.setCustomer(result);
                        })*/;
                    } else {
                        return;
                    }
                });
            } else {
                $scope.FrmInfo = {
                    title: "客户",
                    thead: [{
                        name: "客户编码",
                        code: "customer_code"
                    }, {
                        name: "客户名称",
                        code: "customer_name"
                    }],
                    classid: "customer_org",
                    url: "/jsp/req.jsp",
                    sqlBlock: "",
                    backdatas: "customer_orgs",
                    ignorecase: "true", //忽略大小写
                    postdata: {
                        search_flag: 9,
                        attribute4: 1,
                        attribute1: $scope.data.currItem.sale_center_code
                    },
                    searchlist: ["customer_code", "customer_name"]
                };
                BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                    $scope.setCustomer(result);
                });
            }

        } else if (type == 'project') {
            // if(!$scope.data.currItem.customer_id){
            //     BasemanService.notice("请选择客户","alert-success");
            //     return;
            // }
            $scope.FrmInfo = {
                title: "工程查询",
                thead: [{
                    name: "工程编码",
                    code: "project_code"
                }, {
                    name: "工程名称",
                    code: "project_name"
                }],
                classid: "proj",
                url: "/jsp/req.jsp",
                backdatas: "projs",
                ignorecase: "true", //忽略大小写
                postdata: {},
                searchlist: ["project_code", "project_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.project_id = result.project_id;
                $scope.data.currItem.project_code = result.project_code;
                $scope.data.currItem.project_name = result.project_name;

                //获取渠道
                BasemanService.RequestPost("scporg", "getsalecenters", {"sale_center": result.sale_center_id})
                    .then(function (data) {
                        $scope.sale_center = data.salecenters;
                        $scope.data.currItem.sale_center = $scope.sale_center[0].id;
                    });


            })
        } else if (type == 'entorg') {
            if (!$scope.data.currItem.customer_code) {
                BasemanService.notice("请选择客户", "alert-success");
                return;
            }
            $scope.FrmInfo = {
                title: "产品组",
                thead: [{
                    name: "编码",
                    code: "entorgcode"
                }, {
                    name: "名称",
                    code: "entorgname"
                }],
                classid: "customer_org",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "entorgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    customer_code: $scope.data.currItem.customer_code,
                    attribute1: $scope.data.currItem.sale_center_code,
                    search_flag: 8
                },
                searchlist: ["entorgcode", "entorgname"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.entorgcode = result.entorgcode;
                $scope.data.currItem.entorgname = result.entorgname;
            });
        } else if (type == 'order') {
            $scope.FrmInfo = {
                title: "工程预订单",
                thead: [{
                    name: "预订单号",
                    code: "sa_salebillno"
                }, {
                    name: "项目编码",
                    code: "project_code"
                }, {
                    name: "项目名称",
                    code: "project_name"
                }],
                classid: "sa_out_bill_head",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "sa_out_bill_heads",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag: 1,
                    sqlwhere: "customer_Id =" + $scope.data.currItem.customer_id
                },
                searchlist: ["project_code", "project_name", "customer_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.selectOrder(result);
            });
        } else if (type == 'dept') {
            $scope.FrmInfo = {
                title: "部门",
                thead: [{
                    name: "部门编码",
                    code: "dept_code"
                }, {
                    name: "部门名称",
                    code: "dept_name"
                }],
                classid: "dept",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "depts",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag: 5
                },
                searchlist: ["dept_code", "dept_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.dept_id = result.dept_id;
                $scope.data.currItem.dept_code = result.dept_code;
                $scope.data.currItem.dept_name = result.dept_name;
            })
        } else if (type == 'item') {
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                }, {
                    name: "产品规格",
                    code: "specs"
                }, {
                    name: "工厂",
                    code: "factory_code"
                }],
                classid: "item_org",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "item_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    searchflag: 22,
                    customer_id: $scope.data.currItem.customer_id,
                    attribute1: $scope.data.currItem.customer_code,
                    attribute2: $scope.data.currItem.dhl_no//销售渠道 1000-3000
                },
                searchlist: ["i.item_code", "i.item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.select_item_org(result);
            });
        } else if (type == 'sa_saleprice_type') {
            $scope.FrmInfo = {
                title: "价格类型",
                thead: [{
                    name: "类型编码",
                    code: "saleprice_type_code"
                }, {
                    name: "类型名称",
                    code: "saleprice_type_name"
                }],
                classid: "sa_saleprice_type",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "sa_saleprice_types",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag: 1
                },
                searchlist: ["saleprice_type_code", "saleprice_type_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.addCurrItem.saleprice_type_name = result.saleprice_type_name;
            })
        } else if (type == 'uom') {
            $scope.FrmInfo = {
                title: "计量单位",
                thead: [{
                    name: "单位编码",
                    code: "uom_code"
                }, {
                    name: "单位名称",
                    code: "uom_name"
                }],
                classid: "uom",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "uoms",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag: 7
                },
                searchlist: ["uom_code", "uom_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.uom_id = result.uom_id;
                $scope.data.currItem.uom_code = result.uom_code;
                $scope.data.currItem.uom_name = result.uom_name;
            })
        } else if (type == 'employee') {
            $scope.FrmInfo = {
                title: "业务员",
                thead: [{
                    name: "编码",
                    code: "employee_code"
                }, {
                    name: "名称",
                    code: "employee_name"
                }],
                classid: "sale_employee",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "sale_employees",
                ignorecase: "true", //忽略大小写
                postdata: {
                    flag: 2
                },
                searchlist: ["employee_code", "employee_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.employee_id_operation = result.sale_employee_id;
                $scope.data.currItem.employee_name_operation = result.employee_name;
            })
        } else if (type == 'saleprice') {
            $scope.FrmInfo = {
                title: "工程特价",
                thead: [{
                    name: "价格单号",
                    code: "saleorder_no"
                }, {
                    name: "工程名称",
                    code: "project_name"
                }, {
                    name: "客户名称",
                    code: "customer_name"
                }],
                classid: "sa_saleprice_head",
                url: "/jsp/req.jsp",
                sqlBlock: "rebate_type=1 and stat = 5",
                backdatas: "sa_saleprice_heads",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag: 10
                },
                searchlist: ["saleorder_no", "project_name", "customer_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.sa_saleprice_head_id = result.sa_saleprice_head_id;
                $scope.data.currItem.sa_saleprice_no = result.saleorder_no;
                //获取渠道
                BasemanService.RequestPost("proj", "select", {"project_id": result.project_id})
                    .then(function (data) {
                        BasemanService.RequestPost("scporg", "getsalecenters", {"sale_center": data.sale_center_id})
                            .then(function (data) {
                                $scope.sale_center = data.salecenters;
                                //获取价格单明细数据
                                $scope.getItems(result.sa_saleprice_head_id);
                            });
                    });
            })
        } else if (type == 'address') {
            $scope.FrmInfo = {
                title: "地址",
                thead: [{
                    name: "地址",
                    code: "address"
                }, {
                    name: "客户编码",
                    code: "customer_code"
                }, {
                    name: "客户名称",
                    code: "customer_name"
                }],
                classid: "customer_org",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "customer_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    customer_id: $scope.data.currItem.customer_id,
                    search_flag: 1
                },
                searchlist: ["customer_code", "customer_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.address1 = result.address;
                $scope.data.currItem.take_man = result.take_man;
                $scope.data.currItem.phone_code = result.phone_code;
            });
        } else if (type == 'warehouse') {
            $scope.FrmInfo = {
                title: "仓库",
                thead: [{
                    name: "编码",
                    code: "warehouse_code"
                }, {
                    name: "名称",
                    code: "warehouse_name"
                }, {
                    name: "备注",
                    code: "note"
                }],
                classid: "warehouse",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "warehouses",
                ignorecase: "true", //忽略大小写
                postdata: {search_flag: 1, customer_id: $scope.data.currItem.customer_id},
                searchlist: ["warehouse_code", "warehouse_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.addCurrItem.warehouse_id = result.warehouse_id;
                $scope.data.addCurrItem.warehouse_code = result.warehouse_code;
                $scope.data.addCurrItem.warehouse_name = result.warehouse_name;
                $scope.data.addCurrItem.factory_code = result.factory_code;
                $scope.data.addCurrItem.factory_name = result.factory_name;
            });
        } else if (type == 'shipmode') {
            $scope.FrmInfo = {
                title: "发运方式",
                thead: [{
                    name: "编码",
                    code: "shipmode_code"
                }, {
                    name: "名称",
                    code: "shipmode_name"
                }],
                classid: "shipmode",
                url: "/jsp/req.jsp",
                sqlBlock: "",
                backdatas: "shipmodes",
                ignorecase: "true", //忽略大小写
                postdata: {},
                searchlist: ["shipmode_code", "shipmode_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.shipmode_id = result.shipmode_id;
                $scope.data.currItem.shipmode_name = result.shipmode_name;
                $scope.data.currItem.shipmode_code = result.shipmode_code;
            });
        }

    };

    $scope.setCustomer = function (result) {
        $scope.data.currItem.customer_id = result.customer_id;
        $scope.data.currItem.customer_code = result.customer_code;
        $scope.data.currItem.customer_name = result.customer_name;
        $scope.data.currItem.dept_id = result.dept_id;
        $scope.data.currItem.dept_code = result.dept_code;
        $scope.data.currItem.dept_name = result.dept_name;
        $scope.data.currItem.employee_id_operation = result.sale_employee_id;
        $scope.data.currItem.employee_name_operation = result.employee_name;
        $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;//价格类型
        $scope.data.currItem.warehouse_id = result.warehouse_id;
        $scope.data.currItem.warehouse_code = result.warehouse_code;
        $scope.data.currItem.warehouse_name = result.warehouse_name;
        $scope.data.currItem.factory_code = result.factory_code;
        $scope.data.currItem.factory_name = result.factory_name;
        $scope.data.currItem.disc_amt = 0;
        var postData = {
            search_flag: 1,
            customer_id: $scope.data.currItem.customer_id,
            attribute4: 2
        };
        //地址等信息
        BasemanService.RequestPost("customer_org", "search", postData)
            .then(function (data) {
                if (data.customer_orgs.length > 0) {
                    $scope.data.currItem.address1 = data.customer_orgs[0].address;
                    $scope.data.currItem.take_man = data.customer_orgs[0].take_man;
                    $scope.data.currItem.phone_code = data.customer_orgs[0].phone_code;
                }
            });

        //发货额度
        BasemanService.RequestPost("hczysapintf", "getcreditamt", {cus_code: $scope.data.currItem.customer_code})
            .then(function (data) {
                $scope.data.currItem.may_consignment_amount = Number(data.creditamts[0].balance);
            });

        //跟单员
        BasemanService
            .RequestPost('sale_employee', 'search', {
                flag: 3,
                dept_id: $scope.data.currItem.dept_id
            })
            .then(function (response) {
                if (response.sale_employees.length === 1) {
                    Magic.assignProperty(response.sale_employees[0], $scope.data.currItem, {
                        'sale_employee_id': 'employee_id_operation',
                        'employee_name': 'employee_name_operation'
                    });
                }
            });

        //折前返利余额
        /*BasemanService
            .RequestPost("fd_month_rebate", "get_data", {
                datas: [{
                    year: Magic.today().substr(0, 4),
                    type: $scope.data.currItem.dept_id != 0 ? 2 : 1,
                    customer_id: $scope.data.currItem.dept_id != 0 ? $scope.data.currItem.dept_id : $scope.data.currItem.customer_id
                }]
            })
            .then(function (response) {
                return response.datas[0];
            })
            .then(function (monthRebate) {
                var balance = Magic.toNum(monthRebate.curr_balance);
                $scope.data.currItem.bf_disc_balance = balance;
                $scope.data.currItem.af_disc_balance = balance;
            })
            .catch(function (reason) {
                console.error(reason);

                return $q.reject(reason);
            })
        ;*/
    };

    /**
     * 当修改折扣率时
     */
    $scope.whenDiscountRateChange = function () {
        //折前返利余额
        BasemanService
            .RequestPost("fd_month_rebate", "get_data", {
                datas: [{
                    year: Magic.today().substr(0, 4),
                    type: $scope.data.currItem.dept_id != 0 ? 2 : 1,
                    customer_id: $scope.data.currItem.dept_id != 0 ? $scope.data.currItem.dept_id : $scope.data.currItem.customer_id
                }]
            })
            .then(function (response) {
                return response.datas[0];
            })
            .then(function (monthRebate) {
                var balance = Magic.toNum(monthRebate.curr_balance);
                $scope.data.currItem.bf_disc_balance = balance;
                $scope.data.currItem.af_disc_balance = balance;
            })
            .finally($scope.setTotalAmt)
            .catch(Magic.defaultCatch)
        ;
    };

    $scope.getOnhandQty = function () {
        BasemanService.RequestPost("hczysapintf", "getitemstock", {
            param1: $scope.data.addCurrItem.item_code,
            param2: $scope.data.addCurrItem.attribute31, param3: $scope.data.addCurrItem.warehouse_code
        })
            .then(function (data) {
                if (data.itemstocks.length > 0) {
                    $scope.data.addCurrItem.qty_onhand = Number(data.itemstocks[0].stock);
                } else {
                    $scope.data.addCurrItem.qty_onhand = 0;
                }
            });
    }

    $scope.reset = function () {
        $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads = [];
        $scope.data.currItem.amount_total_f = 0;
        $scope.data.currItem.wtamount_billing = 0;
        //setGridData($scope.lineGridView,$scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
        $scope.lineOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
    }

    /**
     * 选择渠道所属销售中心
     */
    $scope.chooseSaleCenter = function chooseSaleCenter() {
        if (!$scope.data.currItem.customer_code) {
            BasemanService.notice("请选择客户", "alert-success");
            return;
        }
        BasemanService.chooseSaleCenter({
            title: '选择所属渠道',
            scope: $scope,
            postdata: {
                search_flag: 6,
                attribute11: $scope.data.currItem.customer_code
            },
            then: function (data) {
                $scope.data.currItem.sale_center_id = data.dept_id;
                $scope.data.currItem.sale_center_code = data.dept_code;
                $scope.data.currItem.sale_center_name = data.dept_name;

                //选择默认产品组
                var postdata = {
                    search_flag: 9,
                    attribute1: $scope.data.currItem.sale_center_code,
                    attribute4: 1,
                    sqlwhere: "customer_code = '" + $scope.data.currItem.customer_code + "'"
                };
                //地址等信息
                BasemanService.RequestPost("customer_org", "search", postdata)
                    .then(function (data1) {
                        if (data1.customer_orgs.length > 0) {
                            if (data1.customer_orgs[0]) {
                                $scope.data.currItem.entorgcode = data1.customer_orgs[0].entorgcode;
                                $scope.data.currItem.entorgname = data1.customer_orgs[0].entorgname;
                            }
                        }
                    });
            }
        });
    }

    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }


    $scope.billTypeChange = function () {
        if ($scope.data.currItem.bill_type == 1) $scope.sale_center = $scope.sale_center_default;
        if ($scope.data.currItem.bill_type == 2) $scope.sale_center = [];
        $scope.data.currItem.project_id = 0;
        $scope.data.currItem.project_code = "";
        $scope.data.currItem.project_name = "";
        $scope.data.currItem.project_name = "";
        $scope.data.currItem.parentbillid = 0;
        $scope.data.currItem.attribute3 = "";
        $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads = [];
        $scope.lineGridView.setData($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
        $scope.lineGridView.render();
    };

    $scope.getItems = function (sa_saleprice_head_id) {
        var postData = {
            sa_saleprice_head_id: sa_saleprice_head_id,
            search_flag: 1,
            attribute11: $scope.data.currItem.attribute4//折扣率
        };
        BasemanService.RequestPost("sa_saleprice_head", "select", postData)
            .then(function (data) {
                $scope.data.currItem.customer_id = data.customer_id;
                $scope.data.currItem.customer_code = data.customer_code;
                $scope.data.currItem.customer_name = data.customer_name;
                $scope.data.currItem.project_id = data.project_id;
                $scope.data.currItem.project_code = data.project_code;
                $scope.data.currItem.project_name = data.project_name;
                $scope.data.currItem.bill_type = Number(data.bill_type);
                $scope.data.currItem.dhl_no = data.sale_center;
                $scope.data.currItem.dept_id = data.dept_id;
                $scope.data.currItem.dept_code = data.dept_code;
                $scope.data.currItem.dept_name = data.dept_name;
                $scope.data.currItem.employee_id_operation = data.sale_employee_id;
                $scope.data.currItem.employee_name_operation = data.employee_name;
                $scope.data.currItem.sa_saleprice_type_id = data.sa_saleprice_type_id;//价格类型
                $scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads = data.sa_saleprice_lineofsa_saleprice_heads;
                //setGridData($scope.lineGridView,$scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);
                $scope.lineOptions.hcApi.setRowData($scope.data.currItem.sa_out_bill_lineofsa_out_bill_heads);

                $scope.setTotalAmt();

                //收货地址等信息
                var postData = {
                    search_flag: 1,
                    customer_id: $scope.data.currItem.customer_id,
                    attribute4: 2
                };
                BasemanService.RequestPost("customer_org", "search", postData)
                    .then(function (data) {
                        if (data.customer_orgs.length > 0) {
                            $scope.data.currItem.address1 = data.customer_orgs[0].address;
                            $scope.data.currItem.take_man = data.customer_orgs[0].take_man;
                            $scope.data.currItem.phone_code = data.customer_orgs[0].phone_code;
                        }
                    });
                //发货额度
                BasemanService.RequestPost("hczysapintf", "getcreditamt", {cus_code: $scope.data.currItem.customer_code})
                    .then(function (data) {
                        $scope.data.currItem.may_consignment_amount = Number(data.creditamts[0].balance);
                    });
            });
    }

    $scope.need_reply = function (e) {
        var checkTarget = e.target;
        if (checkTarget.checked) {
            $scope.data.currItem.need_reply = 2;
        } else {
            $scope.data.currItem.need_reply = 1;
        }
    };

    //对外暴露scope
    window.currScope = $scope;

    console.log('sa_out_bill_pro end');
}

//注册控制器
angular.module('inspinia')
    .controller('sa_out_bill_pro', sa_out_bill_pro);