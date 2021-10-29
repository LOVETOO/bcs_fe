/**
 * 销售退货入库-属性页
 * 2018-12-25
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'loopApi','$modal',
        'swalApi','dateApi', 'fileApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, loopApi,$modal,
              swalApi, dateApi, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/

                $scope.commonSearchSetting = {};//通用查询设置
                $scope.data = $scope.data || {};
                $scope.data.currItem = $scope.data.currItem || {};

                function editable(args) {
                    if($scope.$eval('data.currItem.stat') == 1 && !args.node.rowPinned)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: '合计'}],
                    columnDefs : [
                        {
                            type: '序号' 
                        }
                        ,{
                            field: 'item_code',
                            headerName: '产品编码',
                            pinned: 'left',
                            editable: function (args) {
                                return editable(args);
                            },
                            onCellDoubleClicked: function (args) {
                                if(editable(args)){
                                    $scope.chooseItem(args);
                                }
                            },
                            onCellValueChanged: function (args) {
                                if(!args.newValue || args.newValue === args.oldValue){
                                    return;
                                }
                                var postdata = {
                                    sqlwhere: " item_usable=2 " +
                                    " and item_code='" + args.data.item_code + "'"
                                };
                                if($scope.data.currItem.crm_entid > 0){
                                    postdata.sqlwhere += " and crm_entid=" + $scope.data.currItem.crm_entid;
                                }

                                requestApi.post('item_org', 'search', postdata)
                                    .then(function (res) {
                                        if(res.item_orgs.length){
                                            var data = res.item_orgs[0];

                                            args.data.item_id = data.item_id;
                                            args.data.item_name = data.item_name;

                                            //单位
                                            args.data.uom_id = data.uom_id;
                                            args.data.uom_name = data.uom_name;
                                            //包装体积
                                            args.data.attribute51 = numberApi.toNumber(data.cubage);
                                            //凑整数量
                                            args.data.attribute41 = data.spec_qty;

                                            return args.data;
                                        }else{
                                            swalApi.info('产品编码【'+args.data.item_code+'】不存在');
                                            args.data.item_id = 0;
                                            args.data.item_name = '';
                                            args.data.item_code = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                    })
                                    .then($scope.getPrice)
                                    .then(function () {
                                        args.api.refreshView();

                                        $scope.calLineData();

                                        $scope.calTotal();
                                    })
                            }
                        }
                        ,{
                            field: 'item_name',
                            headerName: '产品名称',
                            pinned: 'left'
                        }
                        ,{
                            field: 'uom_name',
                            headerName: '单位'
                        }
                        ,{
                            field: 'warehouse_code',
                            headerName: '仓库编码',
                            editable : function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                if(editable(args)){
                                    $scope.chooseWarehouse(args);
                                }
                            },
                            onCellValueChanged: function (args) {
                                if(!args.newValue || args.newValue === args.oldValue){
                                    return;
                                }

                                var postdata = {
                                    sqlwhere: " usable=2 and warehouse_property = 1" +
                                    " and warehouse_code='" + args.data.warehouse_code + "'"
                                };
                                requestApi.post('warehouse', 'search', postdata)
                                    .then(function (res) {
                                        if(res.warehouses.length){
                                            var data = res.warehouses[0];

                                            args.data.warehouse_id = data.warehouse_id;
                                            args.data.warehouse_code = data.warehouse_code;
                                            args.data.warehouse_name = data.warehouse_name;
                                            args.api.refreshView();
                                            return args.data;
                                        }else{
                                            swalApi.info('仓库编码【'+args.data.warehouse_code+'】不存在');
                                            args.data.warehouse_id = 0;
                                            args.data.warehouse_name = '';
                                            args.data.warehouse_code = '';
                                            args.api.refreshView();
                                            return;
                                        }
                                    })
                            }
                        }
                        ,{
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }
                        ,{
                            field: 'qty_bill',
                            headerName: '退货数量',
                            type: '数量',
                            hcRequired: true,
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                $scope.calLineData();

                                $scope.calTotal();
                            }
                        }
                        , {
                            field: 'price_bill',
                            headerName: '含税价(折前)',
                            type: '金额',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                $scope.calLineData();

                                $scope.calTotal();
                            }
                        }
                        , {
                            field: 'amount_bill',
                            headerName: '含税金额(折前)',
                            type: '金额'
                        }
                        , {
                            field: 'discount_tax',
                            headerName: '折扣率',
                            type: '百分比',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellValueChanged: function (args) {
                                $scope.calLineData();
                            }
                        }
                        , {
                            field: 'wtamount_discount',
                            headerName: '折让金额',
                            type: '金额'
                        }
                        , {
                            field: 'price_bill_f',
                            headerName: '含税价(折后)',
                            type: '金额'
                        }
                        , {
                            field: 'amount_bill_f',
                            headerName: '含税金额(折后)',
                            type: '金额'
                        }
                        ,{
                            field: 'attribute41',
                            headerName: '凑整数量',
                            type:'数量'
                        }
                        ,{
                            field: 'attribute51',
                            headerName: '包装体积',
                            type: '体积'
                        }
                        ,{
                            field: 'cubage',
                            headerName: '体积',
                            type: '体积'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注',
                            editable : function (args) {
                                return editable(args)
                            }
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                /**
                 * 查部门
                 */
                $scope.commonSearchSetting.dept = {
                    afterOk: function (item) {
                        $scope.data.currItem.dept_id = item.dept_id;
                        $scope.data.currItem.dept_code = item.dept_code;
                        $scope.data.currItem.dept_name = item.dept_name;
                    }
                };

                /**
                 * 查客户
                 */
                $scope.commonSearchSetting.customer_org = {
                    sqlWhere: ' usable = 2',
                    afterOk: function (item) {
                        $scope.data.currItem.customer_name = item.customer_name;
                        $scope.data.currItem.customer_code = item.customer_code;
                        $scope.data.currItem.customer_id = item.customer_id;

                        $scope.data.currItem.employee_id = item.employee_id;
                        $scope.data.currItem.employee_name = item.employee_name;

                        requestApi.post('customer_org', 'select',
                            {customer_org_id: item.customer_org_id})
                            .then(function (response) {
                                //客户有多个地址时可选择
                                $scope.data.currItem.is_singleAddr = 2;

                                if(response.customer_addressofcustomer_orgs.length){
                                    if(response.customer_addressofcustomer_orgs.length > 1){
                                        $scope.data.currItem.is_singleAddr = 1;
                                    }
                                    loopApi.forLoop(response.customer_addressofcustomer_orgs.length, function (i) {
                                        //默认地址
                                        if(response.customer_addressofcustomer_orgs[i].defaulted = 2){
                                            $scope.data.currItem.address1 = response.customer_addressofcustomer_orgs[i].address1;
                                        }
                                    })
                                }
                            })
                    }
                };


                /**
                 * 查客户地址
                 */
                $scope.getCommonSearchSetting_customerAddress = function () {
                    return $scope.commonSearchSetting.customer_address = {
                        beforeOpen: function(){
                            if(!$scope.data.currItem.customer_id){
                                swalApi.info('请选择客户！');
                                return false;
                            }
                        },
                        classId: 'customer_org',
                        action: 'getCustomerInfo',
                        sqlWhere: ' customer_id = ' + $scope.data.currItem.customer_id,
                        title: '客户地址',
                        gridOptions: {
                            "columnDefs": [
                                {
                                    headerName: "地址",
                                    field: "address1"
                                }, {
                                    headerName: "收货人",
                                    field: "take_man"
                                }, {
                                    headerName: "收货电话",
                                    field: "phone_code"
                                }
                            ]
                        },
                        afterOk: function (item) {
                            $scope.data.currItem.address1 = item.address1;
                        }
                    };
                };

                /**
                 * 查产品
                 */
                $scope.chooseItem = function (args){
                    var sql = ' item_usable = 2 ';
                    if($scope.data.currItem.crm_entid){
                        sql += ' and crm_entid = ' + $scope.data.currItem.crm_entid;
                    }
                    $modal.openCommonSearch({
                        classId:'item_org',
                        sqlWhere:sql
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.item_name = result.item_name;
                            args.data.item_code = result.item_code;
                            args.data.item_id = result.item_id;

                            //单位
                            args.data.uom_id = result.uom_id;
                            args.data.uom_code = result.uom_code;
                            args.data.uom_name = result.uom_name;

                            //包装体积
                            args.data.attribute51 = numberApi.toNumber(result.cubage);
                            //凑整数量
                            args.data.attribute41 = result.spec_qty;

                            return args.data;

                        })
                        .then($scope.getPrice)
                        .then(function () {
                            args.api.refreshView();

                            $scope.calLineData();

                            $scope.calTotal();
                        });
                };

                /**
                 * 查仓库
                 */
                $scope.chooseWarehouse = function (args){
                    var sql = ' usable = 2 and warehouse_property = 1 and warehouse_type <> 4';//有效、实物仓、除了代销仓
                    $modal.openCommonSearch({
                        classId:'warehouse',
                        sqlWhere: sql
                    })
                        .result//响应数据
                        .then(function(result){
                            if(args){
                                args.data.warehouse_id = result.warehouse_id;
                                args.data.warehouse_code = result.warehouse_code;
                                args.data.warehouse_name = result.warehouse_name;

                                args.api.refreshView();
                            }else{
                                $scope.data.currItem.warehouse_name = result.warehouse_name;
                                $scope.data.currItem.warehouse_code = result.warehouse_code;
                                $scope.data.currItem.warehouse_id = result.warehouse_id;
                            }
                        });
                };

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.billtypecode = '0206';
                    bizData.inv_out_type = 4;
                    bizData.bluered = 'R';

                    bizData.date_invbill = dateApi.today();

                    bizData.create_time = dateApi.now();

                    bizData.inv_out_bill_lineofinv_out_bill_heads = [];
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    $scope.gridOptions.hcApi.setRowData(bizData.inv_out_bill_lineofinv_out_bill_heads);

                    $scope.calSum();
                    $scope.calTotal();
                };

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var lines = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.slice(0);
                    //检验‘本次红冲数量’值（负数，红冲数量绝对值小于等于（原单出库数量 - |累计红冲数量|））
                    if(lines.length){
                        loopApi.forLoop(lines.length, function (i) {
                            var qty_red = numberApi.toNumber(lines[i].qty_red);
                            var qty_bill = numberApi.toNumber(lines[i].qty_bill);
                            var sum_red_out = numberApi.toNumber(lines[i].sum_red_out);
                            var dif = qty_bill - Math.abs(sum_red_out);
                            if(qty_red > 0){
                                invalidBox.push('第' + (i+1) + '行【本次红冲数量】必须是负数！');
                            }
                            else if(Math.abs(qty_red) > (dif)){
                                invalidBox.push('第' + (i+1) + '行【本次红冲数量】绝对值必须小于等于【' + dif + '】！');
                            }
                        });
                    }

                    return invalidBox;
                };

                /**
                 * 明细行值计算
                 */
                $scope.calLineData = function () {
                    var lineData = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads;

                    loopApi.forLoop(lineData.length, function (i) {
                        //含税金额（折前） = 退货数量*含税价格（折前）
                        if(lineData[i].qty_bill && lineData[i].price_bill){
                            lineData[i].amount_bill = numberApi.toNumber(lineData[i].qty_bill)
                                * numberApi.toNumber(lineData[i].price_bill);
                        }
                        //折让金额 = 含税金额（折前）*折扣率
                        if(lineData[i].amount_bill && numberApi.toNumber(lineData[i].discount_tax) >= 0){
                            lineData[i].wtamount_discount = numberApi.toNumber(lineData[i].discount_tax)
                                * numberApi.toNumber(lineData[i].amount_bill);
                        }
                        //含税价（折后） = 含税价(折前) * （1-折扣率/100）
                        if(lineData[i].price_bill && numberApi.toNumber(lineData[i].discount_tax) >= 0){
                            lineData[i].price_bill_f = numberApi.toNumber(lineData[i].price_bill)
                                * (1 - (numberApi.toNumber(lineData[i].discount_tax)));
                        }
                        //含税金额（折后） = 退货数量*含税价格（折后）
                        if(lineData[i].qty_bill && lineData[i].price_bill_f){
                            lineData[i].amount_bill_f = numberApi.toNumber(lineData[i].qty_bill)
                                * numberApi.toNumber(lineData[i].price_bill_f);
                        }
                        //体积 = 退货数量*包装体积
                        if(lineData[i].attribute51 && lineData[i].qty_bill){
                            lineData[i].cubage = numberApi.toNumber(lineData[i].qty_bill)
                                * numberApi.toNumber(lineData[i].attribute51);
                        }
                    });
                    $scope.calSum();
                };

                /**
                 * 计算合计数据
                 */
                $scope.calTotal = function () {
                    //合计数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill');
                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage');
                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill');
                };

                /**
                 * 计算合计行数据
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),
                            amount_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill'),
                            wtamount_discount: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'wtamount_discount'),
                            amount_bill_f: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill_f'),
                            cubage: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage')
                        }
                    ]);
                };

                /**
                 * 更新仓库（更新明细的仓库与表头的一致）
                 */
                $scope.updateWarehouse = function () {
                    var line = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.slice(0);
                    if(line.length){
                        loopApi.forLoop(line.length, function (i) {
                            line[i].warehouse_id = $scope.data.currItem.warehouse_id;
                            line[i].warehouse_code = $scope.data.currItem.warehouse_code;
                            line[i].warehouse_name = $scope.data.currItem.warehouse_name;
                        });
                        $scope.gridOptions.hcApi.setRowData(line);
                    }
                };

                /**
                 * 取价格（折前含税价）
                 */
                $scope.getPrice = function (item) {
                    var postData = {
                        item_id :  item.item_id,
                        customer_id: $scope.data.currItem.customer_id,
                        date_invbill: $scope.data.currItem.date_invbill,
                        search_flag: 1
                    };
                    return requestApi.post('sa_saleprice_head', 'getprice', postData)
                        .then(function (data) {
                            item.price_bill = data.price_bill;
                            item.sa_saleprice_line_id = data.sa_confer_price_line_id;
                            item.saleprice_type_name = data.attribute11;
                            return item;
                        }).catch(function (msg) {
                            item.item_id = 0;
                            item.item_code = '';
                            item.item_name = msg;
                            return item;
                        });
                };

                /**
                 * 增加行
                 */
                $scope.add_line = function () {
                    //先校验必填项
                    var invalidBox = $scope.validCheck([]);
                    if(invalidBox.length){
                        return swalApi.info(invalidBox);
                    }

                    $scope.gridOptions.api.stopEditing();

                    var line = {};
                    if($scope.data.currItem.warehouse_id){
                        line.warehouse_id = $scope.data.currItem.warehouse_id;
                        line.warehouse_code = $scope.data.currItem.warehouse_code;
                        line.warehouse_name = $scope.data.currItem.warehouse_name;
                    }

                    line.discount_tax = 0;

                    $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.push(line);

                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if(idx < 0){
                        swalApi.info('请选中要删除的行');
                    }else{
                        $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.splice(idx,1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                    }
                };

                //按钮
                $scope.footerLeftButtons.add_line = {
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                }

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);
