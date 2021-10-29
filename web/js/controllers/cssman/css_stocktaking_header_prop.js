/**
 * 配件盘点单属性页
 * 2019/7/30.     
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'fileApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi, fileApi, $modal) {


        var CssServiceHeaderProp = [
            '$scope',
            function ($scope) {


                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /*----------------------------------标签定义-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };

                function editable(args) {
                    return $scope.data.currItem.stat == 1;
                }

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '配件编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseItemCode(args);
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '配件名称'
                        }
                        , {
                            field: 'inv_qty',
                            headerName: '账面库存',
                            type: '数量',
                            editable: false
                        }
                        , {
                            field: 'fact_qty',
                            headerName: '盘点库存',
                            editable: function () {
                                return editable();
                            },
                            onCellValueChanged: function (args) {
                                checkValueOfLine(args);
                            },
                            type: '数量'
                        }
                        , {
                            field: 'qty_win',
                            headerName: '盘赢数量',
                            onCellValueChanged: false,
                            editable: false,
                            type: '数量'
                        }, {
                            field: 'qty_fail',
                            headerName: '盘亏数量',
                            editable: false,
                            type: '数量'
                        }
                        , {
                            field: 'sett_price',
                            headerName: '单价',
                            hcRequired: true,
                            editable: true,
                            onCellValueChanged: function (args) {
                                checkValueOfLine(args);
                            },
                            type: '金额'

                        }, {
                            field: 'amount_fail',
                            headerName: '盘亏金额',
                            editable: false,

                            type: '金额'

                        }, {
                            field: 'amount_win',
                            headerName: '盘赢金额',
                            editable: false,
                            type: '金额'

                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 150

                        }
                    ]
                };
                /**
                 * 新增时init数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.stat = 1;
                    bizData.css_stocktalking_headersoflines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.css_stocktalking_headersoflines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    
                    $scope.gridOptions.hcApi.setRowData(bizData.css_stocktalking_headersoflines);
                };
                //数据校验
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };

                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if ($scope.data.currItem.css_stocktalking_headersoflines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = $scope.data.currItem.css_stocktalking_headersoflines;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;

                        if (!line.item_code)
                            reason.push('第' + row + '行配件编码不能为空');

                        if (!line.item_name)
                            reason.push('第' + row + '行配件名称不能为空');



                    });
                };

                /**
                 * 输入值改变计算事件
                 * @param args
                 * @returns {Promise|void|*}
                 */
                function checkValueOfLine(args) {
                     if (args.newValue === args.oldValue)
                          return;
                    if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                        var data = args.data;
                        //盘。。数量的计算
                        data.qty_win = checkValue(data.fact_qty, data.inv_qty);
                        data.qty_fail = checkValueOfFail(data.fact_qty, data.inv_qty);
                        //盘win和盘fail金额计算
                        data.amount_fail = data.sett_price * data.qty_fail;
                        data.amount_win = data.sett_price * data.qty_win;
                        

                        args.api.refreshView();
                    }
                    else {
                        return swalApi.info("请输入有效数字");
                    }
                };
                /** 盘赢计算 */
                function checkValue(num1, num2) {
                    if (num1 >= num2) {
                        return num1 - num2;
                    }
                    return 0;
                }
                function checkValueOfFail(num1, num2) {

                    if (num1 < num2) {
                        return num2 - num1;
                    }
                    return 0;
                }

                /**-----------------监听事件------------------------ */
                /** 盘点按钮响应事件 */
                $scope.inv_wh_check = function () {
                    if (!$scope.data.currItem.warehouse_id) {
                        swalApi.info("请先选择盘点仓库");
                        return;
                    }
                    var postdata = {
                        searchflag: 1,
                        //plan_flag: 2,
                        warehouse_id: $scope.data.currItem.warehouse_id
                    }
                    if ($scope.data.currItem.crm_entid) {
                        postdata.crm_entid = $scope.data.currItem.crm_entid;
                    }

                    requestApi.post("css_inventory", "search", postdata)
                        .then(function (response) {
                            if (response.css_item_price_line.length) {
                                $scope.data.currItem.css_stocktalking_headersoflines = [];//默认清空数据后再放入，不再保留已增加的行
                                var data = angular.copy($scope.data.currItem.css_stocktalking_headersoflines, []);
                                response.css_item_price_line.forEach(function (datarow, datarowindex) {
                                    
                                    datarow.item_id = datarow.css_item_id;
                                    datarow.item_name = datarow.css_item_name;
                                    datarow.item_code = datarow.css_item_code;
                                    datarow.fact_qty = datarow.inv_qty;
                                    datarow.qty_win = checkValue(datarow.fact_qty, datarow.inv_qty);
                                    datarow.qty_fail = checkValueOfFail(datarow.fact_qty, datarow.inv_qty);
                                    datarow.amount_win = datarow.qty_win * datarow.sett_price;
                                    datarow.amount_fail = datarow.qty_fail * datarow.sett_price;
                                    
                                    data.push(datarow);
                                })
                                $scope.data.currItem.css_stocktalking_headersoflines = data;
                                $scope.gridOptions.api.setRowData($scope.data.currItem.css_stocktalking_headersoflines)
                            }
                            else {
                                swalApi.info("对不起，没有找到对应的库存数据,请检查库存数据是否正确");
                                return $q.reject();
                            }
                        });

                };
                
                /**
                 * 增加行--多行
                 */

                $scope.add_line =function () {
                    $scope.gridOptions.api.stopEditing();
                    var line = {};

                    $scope.data.currItem.css_purchase_lines.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_purchase_lines);
                };


                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.css_stocktalking_headersoflines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_stocktalking_headersoflines);
                    }
                };
                /*------------------定义事件----------------- */
                /** 盘点按钮 */
                $scope.footerLeftButtons.inv_wh_check = {
                    title: '盘点',
                    click: function () {
                        $scope.inv_wh_check && $scope.inv_wh_check();
                    }
                };
                /** 底部左边按钮 */
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
                /** 删除行按钮 */
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                /*----------------------------------通配查询-------------------------------------------*/
                /** 配件通用查詢 */
                $scope.chooseItemCode = function (args) {
                    $modal.openCommonSearch({
                        classId: 'css_item'
                    })
                        .result 
                        .then(function (result) {
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.api.refreshView();

                        });
                };
                /** 机构名称通用查询 */
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.orgid;

                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_name = result.orgname;
                    }
                };
                /** 仓库名称通用查询 */
                $scope.commonSearchOfWarehouse = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.warehouse_code = result.warehouse_code;
                        $scope.data.currItem.warehouse_id = result.warehouse_id;
                        $scope.data.currItem.warehouse_name = result.warehouse_name;

                    }
                };
                /** 网点名称通用查询   */
                $scope.commonSearchOfFix = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.fix_org_id = result.fix_org_id;
                        $scope.data.currItem.fix_org_code = result.fix_org_code;
                        $scope.data.currItem.fix_org_name = result.fix_org_name;
                    }

                };

                /*----------------------------------通配查询End------------------------------------*/

            }

        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: CssServiceHeaderProp
        });
    });