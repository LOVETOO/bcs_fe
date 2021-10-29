/**
 * 工程送货签收
 * 2019/6/28
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/
                /**
                 * 制单、不是合计行可编辑
                 */
                function editable(args) {
                    return $scope.data.currItem.stat == 1 && !args.node.rowPinned;
                }

                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /** 定义严重参数*/
                $scope.verification = true;
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码',
                        width:170
                    }, {
                        field: 'item_name',
                        headerName: '产品名称',
                        width:120,
                    }, {
                        field: 'sa_salebill_no',
                        headerName: '销售单号',
                        width:120
                    }, {
                        field: 'specs',
                        headerName: '产品规格',
                        width:120,
                    }, {
                        field: 'item_color',
                        headerName: '颜色',
                        width:145,
                    }, {
                        field: 'qty',
                        headerName: '出库数量',
                        width:120,
                        type:'数量'
                    }, {
                        field: 'received_qty',
                        headerName: '签收数量',
                        width:120,
                        type:'数量',
                        hcRequired:true,
                        editable: editable,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            sumPrice(args);
                        }
                    }, {
                        field: 'diff_qty',
                        headerName: '差异数量',
                        type:'数量',
                        width:120
                    }, {
                        field: 'uom_name',
                        headerName: '单位',
                        width:120,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }, {
                        field: 'reason',
                        headerName: '差异原因',
                        width:120,
                        editable: editable,
                        hcRequired:function (args) {
                            if(args.data.diff_qty == 0){
                                return false
                            }else{
                                return true
                            }
                        },
                    }, {
                        field: 'price',
                        headerName: '单价',
                        width:120,
                        type:'金额'
                    }, {
                        field: 'amount',
                        width:120,
                        headerName: '出库金额',
                        type:'金额'
                    }, {
                        field: 'received_amount',
                        headerName: '签收金额',
                        width:120,
                        type:'金额'
                    }, {
                        field: 'mo_remark',
                        headerName: '备注',
                        width:120,
                        editable: editable
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 订单查询
                 */
                $scope.commSearchObjInvOutBillHead = {
                    /** 出库单号查询 */
                    out:{
                        postData:function(){
                            return {
                                search_flag:9,
                                and_sql_where : $scope.data.currItem.diffbill_id > 0 ? " diffbill_id <>  " + $scope.data.currItem.diffbill_id : " 1 = 1",
                                flag : 12
                            }
                        },
                        title:"出库单号",
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "出库单号",
                                    field: "invbillno"
                                },
                                {
                                    headerName: "ERP出库单号",
                                    field: "invbill_sap_no"
                                },
                                {
                                    headerName: "客户编码",
                                    field: "customer_code"
                                },
                                {
                                    headerName: "客户名称",
                                    field: "customer_name"
                                },
                                {
                                    headerName: "发货日期",
                                    field: "outbill_date"
                                },
                                {
                                    headerName: "收获地址",
                                    field: "customer_address"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.outbill_no = result.invbillno;
                            $scope.data.currItem.invbill_sap_no = result.invbill_sap_no;
                            $scope.data.currItem.cust_id = result.customer_id;
                            $scope.data.currItem.cust_code = result.customer_code;
                            $scope.data.currItem.cust_name = result.customer_name;
                            $scope.data.currItem.send_date = result.outbill_date;//发货日期
                            $scope.data.currItem.receive_address = result.customer_address;//收获地址
                            selectData(result.inv_out_bill_head_id);
                        }
                    },
                    /** ERP出库单号查询 */
                    sap:{
                        postData:function(){
                            return {
                                search_flag:9,
                                flag : 12,
                                and_sql_where : $scope.data.currItem.diffbill_id > 0 ? " diffbill_id <>  " + $scope.data.currItem.diffbill_id : " 1 = 1"
                            }
                        },
                        title:"出库单号",
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "出库单号",
                                    field: "invbillno"
                                },
                                {
                                    headerName: "ERP出库单号",
                                    field: "invbill_sap_no"
                                },
                                {
                                    headerName: "客户编码",
                                    field: "customer_code"
                                },
                                {
                                    headerName: "客户名称",
                                    field: "customer_name"
                                },
                                {
                                    headerName: "发货日期",
                                    field: "outbill_date"
                                },
                                {
                                    headerName: "收获地址",
                                    field: "customer_address"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.outbill_no = result.invbillno;
                            $scope.data.currItem.invbill_sap_no = result.invbill_sap_no;
                            $scope.data.currItem.cust_id = result.customer_id;
                            $scope.data.currItem.cust_code = result.customer_code;
                            $scope.data.currItem.cust_name = result.customer_name;
                            $scope.data.currItem.send_date = result.outbill_date;//发货日期
                            $scope.data.currItem.send_date = result.outbill_date;//收获地址
                            selectData(result.inv_out_bill_head_id);
                        }
                    }
                };

                /**
                 * 选择出库单，自动带出明细数据
                 */
                function selectData(id) {
                    return requestApi
                        .post({
                            classId: 'inv_out_bill_head',
                            action: 'select',
                            data: {
                                inv_out_bill_head_id :id
                            }
                        })
                        .then(function (data) {
                            $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers = [];
                            data.inv_out_bill_lineofinv_out_bill_heads.forEach(function (val) {
                                $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.push({
                                    item_code : val.item_code,
                                    item_name : val.item_name,
                                    sa_salebill_no : val.sa_salebillno,
                                    specs : val.specs,
                                    item_color : val.item_color,
                                    qty : val.qty_bill,
                                    uom_name : val.uom_name,
                                    price : val.wtpricec_bill_f,
                                    amount : val.wtamount_bill_f,
                                    received_qty : val.qty_bill,
                                    diff_qty : 0 ,
                                    received_amount : numberApi.mutiply(val.wtpricec_bill_f, val.qty_bill)
                                })
                            });
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers);
                            $scope.calSum();
                        })
                }


                /*----------------------------------计算方法-------------------------------------------*/

                /**
                 * 计算价钱数量
                 */
                function sumPrice(args){
                    if($scope.verification){
                        if(args.data.received_qty==null && args.data.received_qty==undefined && args.data.received_qty==""){//清空签收数量
                            args.data.received_qty = undefined;
                        }
                        var str = "";
                        if(!numberApi.isNum(Number(args.data.received_qty))){//判断输入是否是数字
                            str = "签收数量输入不是数字，请重新输入!";
                        }else if(Number(args.data.received_qty)<0){
                            str = "签收数量不能小于0，请重新输入!";
                        }else if(Number(args.data.received_qty) > Number(args.data.qty)){
                            str = "签收数量不能大于出库数量，请重新输入!";
                        }
                        if(str == ""){
                            args.data.diff_qty = numberApi.sub(args.data.received_qty, args.data.qty);//计算差异数量
                            args.data.received_amount = numberApi.mutiply(args.data.received_qty, args.data.price);//计算签收金额
                            //刷新网格数据
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions.columnApi.getColumns([
                                    'received_qty',
                                    'diff_qty',
                                    'received_amount'])
                            });
                            $scope.calSum();
                        }else{
                            args.data.received_qty = 0;
                            args.data.diff_qty = numberApi.sub(args.data.received_qty, args.data.qty);//计算差异数量
                            args.data.received_amount = numberApi.mutiply(args.data.received_qty, args.data.price);//计算签收金额
                            $scope.calSum();
                            args.data.received_qty = undefined;
                            //刷新网格数据
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions.columnApi.getColumns([
                                    'received_qty',
                                    'diff_qty',
                                    'received_amount'])
                            });
                            return swalApi.error(str);
                        }
                    }else{
                        if(args.data.received_qty==null && args.data.received_qty==undefined && args.data.received_qty==""){//清空签收数量
                            args.data.received_qty = undefined;
                        }
                        var str = "";
                        if(!numberApi.isNum(Number(args.data.received_qty))){//判断输入是否是数字
                            str = "签收数量输入不是数字，请重新输入!";
                        }else if(Number(args.data.received_qty)<0){
                            str = "签收数量不能小于0，请重新输入!";
                        }else if(Number(args.data.received_qty) > Number(args.data.qty)){
                            str = "签收数量不能大于出库数量，请重新输入!";
                        }
                        if(str == ""){
                            args.data.diff_qty = numberApi.sub(args.data.received_qty, args.data.qty);//计算差异数量
                            args.data.received_amount = numberApi.mutiply(args.data.received_qty, args.data.price);//计算签收金额
                            //刷新网格数据
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions.columnApi.getColumns([
                                    'received_qty',
                                    'diff_qty',
                                    'received_amount'])
                            });
                            $scope.calSum();
                        }else{
                            args.data.diff_qty = numberApi.sub(0, args.data.qty);//计算差异数量
                            args.data.received_amount = numberApi.mutiply(0, args.data.price);//计算签收金额
                            $scope.calSum();
                            //刷新网格数据
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions.columnApi.getColumns([
                                    'received_qty',
                                    'diff_qty',
                                    'received_amount'])
                            });
                        }
                    }
                }
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //合计出库数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'qty');
                    //合计出库金额
                    $scope.data.currItem.total_amount
                        = numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'amount');
                    //合计签收数量
                    $scope.data.currItem.received_qty
                        = numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'received_qty');
                    //合计签收金额
                    $scope.data.currItem.received_amount
                        = numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'received_amount');
                    //计算行
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty: numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'qty'),//出库数量
                            received_qty: numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'received_qty'),//签收数量
                            diff_qty: numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'diff_qty'),//差异数量
                            amount: numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'amount'),//出库金额
                            received_amount: numberApi.sum($scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers, 'received_amount')//签收金额
                        }
                    ]);

                };



                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.drp_diffprocbill_lineofdrp_diffprocbill_headers = [];
                    bizData.create_time = new Date().Format("yyyy-MM-dd HH:mm:ss");
                    bizData.anticipate_date = new Date().Format('yyyy-MM-dd');
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    $scope.data.currItem.drp_diffprocbill_lineofdrp_diffprocbill_headers.forEach(function (value, index) {
                        if(!numberApi.isNum(Number(value.received_qty))){//判断输入是否是数字
                            invalidBox.push("第"+(index+1)+"行签收数量输入不是数字，请重新输入!");
                        }else if(Number(value.received_qty)<0){
                            invalidBox.push("第"+(index+1)+"行签收数量不能小于0，请重新输入!");
                        }else if(Number(value.received_qty) > Number(value.qty)){
                            invalidBox.push("第"+(index+1)+"行签收数量不能大于出库数量，请重新输入!");
                        }
                    });
                    return invalidBox;
                };



                $scope.save = function(){
                    $scope.verification = false;
                    $scope.hcSuper.save().finally(function () {
                        $scope.verification = true;
                    });
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置产品清单
                    $scope.gridOptions.hcApi.setRowData(bizData.drp_diffprocbill_lineofdrp_diffprocbill_headers);
                    //supplementData();
                    $scope.calSum();
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });