/**
 * 仓库盘点单-列表页
 * date:2018-01-14
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi', 'strApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi, strApi) {
        'use strict';
        var controller = [
                //声明依赖注入
                '$scope', '$stateParams', '$modal', '$q',
                //控制器函数
                function ($scope, $stateParams, $modal, $q) {
                    /**==============================数据定义========================= */
                    $scope.data = {collectByDept: 2};
                    $scope.data.currItem = {};
                    /**==============================网格定义========================= */
                    $scope.gridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                headerName: "产品",
                                children: [{
                                    field: 'item_code',
                                    headerName: '产品编码',
                                    onCellDoubleClicked: chooseItem,
                                    onCellValueChanged: itemChangeEvent,
                                    editable: true
                                }
                                    , {
                                        field: 'item_name',
                                        headerName: '产品名称'
                                    }
                                    , {
                                        field: "uom_name",
                                        headerName: "单位"
                                    }]
                            },
                            {
                                field: 'qty_keep',
                                headerName: '预占库存数量',
                                type: "数量"
                            },
                            {
                                field: 'qty_account',
                                headerName: '账面数量',
                                onCellValueChanged: function (args) {
                                    checkGridNumberInput(args, LogicCountFuncArr);
                                },
                                type: "数量"
                            },
                            {
                                field: 'qty_check',
                                headerName: '盘点数量',
                                editable: true,
                                onCellValueChanged: function (args) {
                                    checkGridNumberInput(args, LogicCountFuncArr);
                                },
                                type: "数量"
                            },
                            {
                                field: 'qty_profitloss',
                                headerName: '盈亏数量',
                                onCellValueChanged: function (args) {
                                    checkGridNumberInput(args, LogicCountFuncArr);
                                },
                                type: "数量"

                            },
                            {
                                field: 'plcause',
                                headerName: '盈亏原因',
                                editable: true,
                            },
                            {
                                field: 'price',
                                headerName: '单价',
                                type: "金额"
                            },
                            {
                                field: 'amount_pl',
                                headerName: '盈亏金额',
                                type: "金额"
                            },
                            // {
                            //     field: 'whemployee_name',
                            //     headerName: '仓管员',
                            //     editable: true,
                            //     onCellDoubleClicked: chooseWhemployee
                            // },
                            {
                                field: 'note',
                                headerName: '备注'
                            }
                        ],
                        hcObjType: $stateParams.objtypeid
                    }

                    /**
                     * 输入值改变计算事件
                     * @param args
                     * @returns {Promise|void|*}
                     */
                    function checkGridNumberInput(args, functions) {
                        if (args.newValue === args.oldValue)
                            return;
                        if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                            functions.forEach(function (value) {
                                value(args.data);
                            })
                            args.api.refreshView();
                        }
                        else {
                            return swalApi.info("请输入有效数字");
                        }
                    }

                    /**继承主控制器 */
                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });


                    /**============================ 逻辑计算=================================**/
                    /**
                     * 单据日期值改变事件
                     */
                    $scope.dateChangeEvent = function () {
                        if ($scope.data.currItem.date_invbill) {
                            $scope.data.currItem.year_month
                                = new Date($scope.data.currItem.date_invbill).Format('yyyy-MM');
                        }
                    };

                    /**所有计算方法集合
                     * @type {*[]}
                     */
                    var LogicCountFuncArr = [countQty_profitloss, countAmount_pl];

                    /**
                     * 重新计算所有逻辑计算
                     */
                    function reCountAllRow() {
                        var data = $scope.gridOptions.hcApi.getRowData();
                        data.forEach(function (row) {
                            LogicCountFuncArr.forEach(function (func) {
                                func(row);
                            })
                        })
                    }

                    /**
                     * 计算明细行盈亏数量;
                     * 盘点数量-账面数量
                     * @param data
                     */
                    function countQty_profitloss(data) {
                        if (strApi.isNotNull(data.qty_check) && strApi.isNotNull(data.qty_account)) {
                            data.qty_profitloss = numberApi.sub(data.qty_check, data.qty_account);
                        }
                        return data;
                    }

                    /**
                     * 计算明细行盈亏金额;
                     * 单价*盈亏数量
                     * @param data
                     */
                    function countAmount_pl(data) {
                        if (strApi.isNotNull(data.price) && strApi.isNotNull(data.qty_profitloss)) {
                            data.amount_pl = numberApi.mutiply(data.price, data.qty_profitloss);
                        }
                        return data;
                    }

                    /**============================ 点击事件=================================**/

                    $scope.add_line = function () {
                        $scope.gridOptions.api.stopEditing();
                        swal({
                            title: '请输入要增加的行数',
                            type: 'input', //类型为输入框
                            inputValue: 1, //输入框默认值
                            closeOnConfirm: true, //点击确认不关闭，由后续代码判断是否关闭
                            showCancelButton: true //显示【取消】按钮
                        }, function (inputValue) {
                            if (inputValue === true) {
                                swal.close();
                                return;
                            }

                            var rowCount = Number(inputValue);
                            if (rowCount <= 0) {
                                swal.showInputError('请输入有效的行数');
                                return;
                            }
                            else if (rowCount > 1000) {
                                swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                                return;
                            }
                            swal.close();

                            var data = $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads;

                            for (var i = 0; i < rowCount; i++) {
                                var newLine = {};
                                if ($scope.data.currItem.whemployee_id) {
                                    newLine = {
                                        whemployee_code: $scope.data.currItem.whemployee_code,
                                        whemployee_id: $scope.data.currItem.whemployee_id,
                                        whemployee_name: $scope.data.currItem.whemployee_name
                                    };
                                }
                                data.push(newLine);
                            }
                            $scope.gridOptions.hcApi.setRowData(data);
                            $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                        });
                    }
                    $scope.del_line = function () {
                        var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        if (index < 0) {
                            return swalApi.info("请选中要删除的行");
                        }
                        return swalApi.confirmThenSuccess({
                            title: "确定要删除第" + (index + 1) + "行吗?",
                            okFun: function () {
                                //函数区域
                                var rowData = $scope.gridOptions.hcApi.getRowData();
                                if (index == (rowData.length - 1)) {
                                    $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                                }
                                rowData.splice(index, 1);
                                $scope.gridOptions.hcApi.setRowData(rowData);
                                $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads = rowData;
                            },
                            okTitle: '删除成功'
                        });
                    }

                    /**
                     * 盘点
                     */
                    $scope.inv_wh_check = function () {
                        if (!$scope.data.currItem.warehouse_id) {
                            swalApi.info("请先选择盘点仓库");
                            return;
                        }
                        var postdata = {
                            search_flag: 2,
                            plan_flag: 2,
                            warehouse_id: $scope.data.currItem.warehouse_id
                        }
                        if ($scope.data.currItem.crm_entid) {
                            postdata.crm_entid = $scope.data.currItem.crm_entid;
                        }

                        requestApi.post("inv_current_inv", "search", postdata)
                            .then(function (response) {
                                if (response.inv_current_invs.length) {
                                    $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads = [];//默认清空数据后再放入，不再保留已增加的行
                                    var data = angular.copy($scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads, []);
                                    response.inv_current_invs.forEach(function (datarow, datarowindex) {
                                        var flag = true;//是否插入数据的标示;
                                        if ($scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.length > 0) { //如果盘点前先添加有数据的话;
                                            $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.forEach(function (row, rowindex) {
                                                //根据产品和仓库判断数据是否一样
                                                if (datarow.item_name === row.item_name && datarow.item_code === row.item_code && parseInt(datarow.item_id) === parseInt(row.item_id)
                                                    && parseInt(datarow.warehouse_id) === parseInt($scope.data.currItem.warehouse_id) && datarow.warehouse_name === $scope.data.currItem.warehouse_name && datarow.warehouse_name === $scope.data.currItem.warehouse_name) {
                                                    data[rowindex].qty_account = datarow.qty_onhand;
                                                    flag = false;//数据一样的话,将账面数量覆盖掉;
                                                }
                                            });
                                        }
                                        if (flag) {//数据完全不一样的话;添加到明细里，否则过滤掉;
                                            datarow.qty_account = datarow.qty_onhand;
                                            datarow.qty_check = datarow.qty_onhand;//盘点数量
                                            datarow.attribute2 = '系统带出';
                                            if ($scope.data.currItem.whemployee_id) {
                                                datarow.whemployee_id = $scope.data.currItem.whemployee_id;
                                            }
                                            data.push(datarow);
                                        }
                                    })
                                    $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads = data;
                                    $scope.gridOptions.api.setRowData()
                                }
                                else {
                                    swalApi.info("对不起，没有找到对应的库存数据,请检查库存数据是否正确");
                                    return $q.reject();
                                }
                            })
                            .then(function () {
                                $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.forEach(function (row) {
                                    $q.when()
                                        .then(getPrice.bind(undefined, row))
                                        .then(reCountAllRow)//重新计算
                                        .then(function () {
                                            $scope.gridOptions.api.setRowData($scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads);
                                        });
                                })
                            });
                    }

                    /**
                     * 清除自动带出的账面金额为零的明细数据
                     */
                    $scope.clean_line = function () {
                        var data = $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.filter(function (row) {
                            return row.attribute2 && row.attribute2 === '系统带出' && strApi.isNotNull(row.qty_account) && parseFloat(row.qty_account) > 0
                        });
                        $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads = data;
                        $scope.gridOptions.api.setRowData($scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads);
                    };

                    /**
                     * 更新明细表中的实时账面数量
                     */
                    $scope.update_line = function () {
                        $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.forEach(function (row) {
                            $q.when()
                                .then(getNormalStock.bind(undefined, row))
                                .then(function () {
                                    $scope.gridOptions.api.setRowData($scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads);
                                })
                                .then(reCountAllRow)//重新计算
                        })
                    };


                    //==============================底部左边按钮=======================
                    /**
                     * 盘点按钮
                     * @type {{title: string, click: click}}
                     */
                    $scope.footerLeftButtons.inv_wh_check = {
                        title: '盘点',
                        click: function () {
                            $scope.inv_wh_check && $scope.inv_wh_check();
                        }
                    };

                    /**
                     * 更新账面数
                     * @type {{title: string, click: click}}
                     */
                    $scope.footerLeftButtons.update_line = {
                        title: '更新账面数',
                        click: function () {
                            $scope.update_line && $scope.update_line();
                        }
                    };

                    /**
                     * 删除零库存按钮
                     * @type {{title: string, click: click}}
                     */
                    $scope.footerLeftButtons.clean_line = {
                        title: '删除零库存',
                        click: function () {
                            $scope.clean_line && $scope.clean_line();
                        }
                    };
                    $scope.footerLeftButtons.add_line = {
                        title: '增加行',
                        click: function () {
                            $scope.add_line && $scope.add_line();
                        }
                    };
                    $scope.footerLeftButtons.del_line = {
                        title: '删除行',
                        click: function () {
                            $scope.del_line && $scope.del_line();
                        }
                    };


                    /**============================ 点击事件结束=================================**/

                    /**============================数据处理 ================================**/

                    $scope.setBizData = function (bizData) {
                        // $scope.aa=JSON.stringify(bizData);
                        // $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                        //设置头部数据的步骤已在基础控制器实现
                        $scope.hcSuper.setBizData(bizData);
                        //设置明细数据到表格
                        // $scope.明细表格选项1.hcApi.setRowData(bizData.明细数组1);
                        // $scope.明细表格选项2.hcApi.setRowData(bizData.明细数组2);
                        $scope.gridOptions.api.setRowData(bizData.inv_wh_check_lineofinv_wh_check_heads);
                    };

                    /**
                     * 新建单据时初始化数据
                     * @param bizData
                     */
                    $scope.newBizData = function (bizData) {
                        $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                        angular.extend($scope.data.currItem, {
                            created_by: strUserName,
                            creation_date: dateApi.now(),
                            date_invbill: dateApi.today(),
                            inv_wh_check_lineofinv_wh_check_heads: [],
                            stat: 1,
                            year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        });
                        $scope.gridOptions.api.setRowData($scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads);

                    };

                    /**
                     * 检查数据
                     */
                    $scope.validCheck = function (invalidBox) {
                        $scope.hcSuper.validCheck(invalidBox);

                        $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.forEach(function (row, i) {
                            var rowNumStr = "第" + (i + 1) + "行";
                            var qty_keep = row.qty_keep ? row.qty_keep : 0;
                            var qty_check = row.qty_check ? row.qty_check : 0;
                            if (numberApi.compare(qty_check, qty_keep) == -1) {
                                invalidBox.push(rowNumStr + "盘点数量小于对应仓库对应产品的当前预占数量[" + qty_keep + "]")
                            }
                        })
                        if (invalidBox.length && invalidBox.length > 0) {
                            invalidBox.push("请处理后再盘点");
                        }
                    }

                    /**
                     * 刷新
                     */
                    $scope.refresh = function () {
                        $scope.hcSuper.refresh(); //继承基础控制器的方法，类似Java的super
                    };


                    /**
                     * 判断明细可否编辑
                     * @param args
                     * @constructor
                     */
                    function Editable(args) {
                        var flag = true;
                        if (args.data.seq === "合计") {
                            flag = true;
                        }
                        return flag;
                    }

                    /**============================通用 查询 ===================**/

                    /**
                     * 产品编码改变事件
                     * @param args
                     */
                    function itemChangeEvent(args) {
                        if (args)
                            if (args.newValue === args.oldValue)
                                return;

                        if (!$scope.data.currItem.crm_entid) {
                            swalApi.info("请先选择品类");
                            return
                        }
                        //获取产品
                        getItem(args.newValue)
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
                            .then(getPrice)//取特价
                            .then(getNormalStock)
                            .then(reCountAllRow)
                            .then(function () {
                                args.api.refreshView();
                            });
                    }


                    /**输入框改变时自动查询产品 **/
                    function getItem(code) {
                        var sqlw = '';
                        var needCheckCrm_entid = false;
                        if (parseInt($scope.data.currItem.crm_entid) != -1) { //不等于 所有品类-1 的话 需要根据品类过滤
                            sqlw = " and crm_entid = " + $scope.data.currItem.crm_entid;
                            needCheckCrm_entid = true;
                        }
                        var postData = {
                            classId: "item_org",
                            action: 'search',
                            data: {sqlwhere: "item_code = '" + code + "' " + sqlw}
                        };
                        return requestApi.post(postData)
                            .then(function (data) {
                                if (data.item_orgs.length > 0) {
                                    var item = data.item_orgs[0];

                                    if (needCheckCrm_entid && parseInt($scope.data.currItem.crm_entid) != parseInt(item.crm_entid)) {
                                        return $q.reject("产品编码[" + code + "不归属于当前所选品类")
                                    }

                                    //校验若添加的编码已存在与本次仓库盘点单中，不允许添加
                                    for (var i = 0; i < $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.length; i++) {
                                        var obj = $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads[i];
                                        if (parseInt(obj.item_id) === parseInt(item.item_id)) {
                                            return $q.reject("产品编码[" + code + "已经存在于第[" + (i + 1) + "]行中，请检查");
                                        }
                                    }

                                    return {
                                        item_id: item.item_id,
                                        item_code: item.item_code,
                                        item_name: item.item_name,
                                        uom_name: item.uom_name,
                                        uom_id: item.uom_id,
                                    };

                                } else {
                                    return $q.reject("产品编码【" + code + "】不可用");
                                }
                            });
                    }

                    /**
                     * 选择产品
                     * @return {Promise}
                     */
                    $scope.chooseItem = chooseItem

                    function chooseItem(args) {
                        if (args && args.data.seq == "合计") {
                            return;
                        }
                        var sqlBlock = '';
                        if ($scope.data.currItem.crm_entid && parseInt($scope.data.currItem.crm_entid) != -1) { //不等于所有品类-1 的话 需要根据品类过滤
                            sqlBlock = " crm_entid = " + $scope.data.currItem.crm_entid
                        }
                        $modal.openCommonSearch({
                                classId: 'item_org',
                                sqlWhere: sqlBlock
                            })
                            .result//响应数据
                            .then(function (data) {

                                //校验若添加的编码已存在与本次仓库盘点单中，不允许添加
                                for (var i = 0; i < $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads.length; i++) {
                                    var obj = $scope.data.currItem.inv_wh_check_lineofinv_wh_check_heads[i];
                                    if (parseInt(obj.item_id) === parseInt(data.item_id) && args.rowIndex != i) {
                                        args.data.item_id = 0;
                                        args.data.item_code = "产品编码[" + data.item_code + "已经存在于第[" + (i + 1) + "]行中，请检查";
                                        args.data.item_name = "";
                                        args.api.refreshView();
                                        return $q.reject();
                                    }
                                }


                                [
                                    'item_id',
                                    'item_code',
                                    'item_name',
                                    'uom_name',
                                    'uom_id',
                                    'bar_code'
                                ]
                                    .forEach(function (key) {
                                        args.data[key] = data[key];
                                    });
                                args.data.spec_qty = data.spec_qty;
                                args.data.single_cubage = data.cubage;

                                return args.data;
                            })
                            .then(getPrice)//取特价
                            .then(getNormalStock) //查盘点仓库存
                            .then(reCountAllRow)
                            .then(function () {
                                args.api.refreshView();
                            })
                    }


                    /**
                     * 取盘点仓库存
                     * @param data
                     */
                    function getNormalStock(data) {
                        if (data && $scope.data.currItem.warehouse_id) {
                            var postData = {
                                item_id: data.item_id,
                                search_flag: 2,
                                plan_flag: 2
                            };
                            postData.warehouse_id = $scope.data.currItem.warehouse_id;
                            return requestApi.post('inv_current_inv', 'search', postData)
                                .then(function (response) {
                                    if (response.inv_current_invs.length) {
                                        data.qty_account = response.inv_current_invs[0].qty_onhand;
                                        data.qty_keep = response.inv_current_invs[0].qty_keep;
                                    } else {
                                        data.qty_account = 0;
                                        data.qty_keep = 0;
                                    }
                                    return data;
                                })
                        }
                    }

                    /**
                     * 取特价作为单价
                     * @param data
                     */
                    function getPrice(data) {
                        if (data.item_id) {
                            //先取特价
                            var postData = {
                                item_id: data.item_id,
                                // date_invbill: $scope.data.currItem.date_invbill,
                                search_flag: 1,
                                sqlwhere: " item_id = " + data.item_id + " and saleprice_type_name = '运营价' and  is_cancellation <> 2 "
                            };
                            return requestApi.post('sa_saleprice_head', 'search', postData)
                                .then(function (response) {
                                    if (response.sa_saleprice_heads.length) {
                                        data.price = response.sa_saleprice_heads[0].price_bill;
                                    }
                                    return data;
                                }, function () {
                                    return swalApi.error("产品编码【" + data.item_code + "】未维护价格，请手动输入");
                                }).catch(function (msg) {
                                    data.price_bill = 0;
                                    return data;
                                });
                        } else {
                            return data;
                        }

                    }

                    /**
                     * 查仓管员
                     */
                    $scope.chooseWhemployee = chooseWhemployee;

                    function chooseWhemployee(args) {
                        $modal.openCommonSearch({
                                classId: 'whemployee',
                                postData: {},
                                sqlWhere: ' isuseable = 2',
                                action: 'search',
                                title: "仓管员",
                                gridOptions: {
                                    columnDefs: [{
                                        headerName: "名字",
                                        field: "employee_name"
                                    }, {
                                        headerName: "编码",
                                        field: "employee_code"
                                    }]
                                }
                            })
                            .result//响应数据
                            .then(function (result) {
                                if (args) {
                                    args.data.whemployee_name = response.employee_name;
                                    args.data.whemployee_code = response.employee_code;
                                    args.data.whemployee_id = response.whemployee_id;
                                    args.api.refreshView();
                                } else {
                                    $scope.data.currItem.whemployee_name = response.employee_name;
                                    $scope.data.currItem.whemployee_code = response.employee_code;
                                    $scope.data.currItem.whemployee_id = response.whemployee_id;
                                }
                            })
                    };

                    /**
                     * 查部门
                     */
                    function chooseOrg() {
                        $modal.openCommonSearch({
                                classId: 'dept'
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.dept_id = result.dept_id;
                                $scope.data.currItem.dept_code = result.dept_code;
                                $scope.data.currItem.dept_name = result.dept_name;

                            });
                    }

                    $scope.chooseOrg = chooseOrg;

                    /**
                     * 查仓库
                     */
                    $scope.chooseWareHouse = chooseWareHouse;

                    function chooseWareHouse() {
                        var sqlBlock = ' Is_End = 2 and Warehouse_Type = 1 '; //搜实物正品仓
                        $modal.openCommonSearch({
                                classId: 'warehouse',
                                sqlWhere: sqlBlock
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.warehouse_name = response.warehouse_name;
                                $scope.data.currItem.warehouse_code = response.warehouse_code;
                                $scope.data.currItem.warehouse_id = response.warehouse_id;
                            })
                            .then($scope.update_line);
                    };


                }

            ]
            ;

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);