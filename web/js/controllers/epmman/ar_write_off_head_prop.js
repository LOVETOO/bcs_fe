/**
 *  工程到款核销
 *  2019/8/01.
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', '$modal', 'numberApi', 'requestApi', '$q', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, swalApi, $modal, numberApi, requestApi, $q) {


        var ArWriteHeadList = [
            '$scope',
            function ($scope) {
                /**
                 * 不是合计行可编辑
                 */
                function editable(args) {
                    return  !args.node.rowPinned && !$scope.data.currItem.write_off_head_id > 0;
                }
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "基本详情"
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    },{
                        field: 'trading_company_name',
                        headerName: '开票公司'
                    }, {
                        field: 'legal_entity_code',
                        headerName: '法人客户编码'
                    }, {
                        field: 'legal_entity_name',
                        headerName: '法人客户名称'
                    }, {
                        field: 'invoice_no',
                        headerName: '发票号'
                    }, {
                        field: 'date_invoice',
                        headerName: '发票日期',
                        type : '日期'
                    }, {
                        field: 'amount_bill_f',
                        headerName: '发票金额',
                        type:'金额'
                    },{
                        field: 'amount_bill_f_cancel',
                        headerName: '可核销金额',
                        type:'金额',
                        hide : false
                    },{
                        field: 'write_off_amt_before',
                        headerName: '核销前可核销金额',
                        type:'金额',
                        hide : true
                    },{
                        field: 'write_off_amt',
                        headerName: '本次核销金额',
                        type:'金额',
                        hcRequired:true,
                        editable: editable,
                        onCellValueChanged: function () {
                            $scope.calSum();
                        }
                    }]
                };

                /*----------------------------------------计算方法定义-------------------------------------------*/

                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //总核销金额
                    $scope.data.currItem.write_off_amt
                        = numberApi.sum($scope.data.currItem.ar_write_off_lines, 'write_off_amt');
                    //计算行
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            write_off_amt: numberApi.sum($scope.data.currItem.ar_write_off_lines, 'write_off_amt')//本次认款金额
                        }
                    ]);
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //基本详情
                    bizData.ar_write_off_lines = [];
                    bizData.write_off_head_id = 0;
                    $scope.chooeData();
                };

                /**
                 * 到款单号查询
                 */
                $scope.chooeData = function () {
                    $modal.openCommonSearch({
                        classId:'epm_payment_record',
                        sqlWhere : ' received_amt > written_off_amt ',
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.currency_name = result.currency_name;//币别
                            $scope.data.currItem.payment_record_id = result.payment_record_id;//到款ID
                            $scope.data.currItem.payment_record_code = result.payment_record_code;//到款单号
                            $scope.data.currItem.customer_id = result.customer_id;//经销商id
                            $scope.data.currItem.customer_code = result.customer_code;//经销商编码
                            $scope.data.currItem.customer_name = result.customer_name;//经销商名称
                            $scope.data.currItem.received_amt = result.received_amt;//到款金额
                            $scope.data.currItem.project_code = result.project_code;//项目编码
                            $scope.data.currItem.project_name = result.project_name;//项目名称
                            $scope.data.currItem.received_written_off_amt = numberApi.sub(result.received_amt,result.written_off_amt);//计算可核销金额
                        },function (line) {
                            if(line=="头部关闭"){
                                this.window.opener = null;
                                window.close();
                            }
                        });
                };

                //保存验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if($scope.data.currItem.ar_write_off_lines.length <= 0){
                        invalidBox.push("明细行没有数据");
                    }
                    $scope.data.currItem.ar_write_off_lines.forEach(function (value) {
                        if(value.write_off_amt <= 0){
                            invalidBox.push("本次核销金额需要大于0");
                        }
                        if(value.write_off_amt > value.amount_bill_f_cancel){
                            invalidBox.push("本次核销金额需要小于等于可核销金额");
                        }
                    });
                    return invalidBox;
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置基本经历
                    $scope.gridOptions.hcApi.setRowData(bizData.ar_write_off_lines);
                    $scope.gridOptions.columnDefs[7].hide = true;
                    $scope.gridOptions.columnDefs[8].hide = false;
                    $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    $scope.calSum();
                    //refAmtrak();
                };

                /**
                 * 每次进入单据查询最新的可核销金额数据
                 */
                function refAmtrak(){
                    var arr = [];
                    $scope.data.currItem.ar_write_off_lines.forEach(function (value) {
                        arr.push(requestApi
                            .post({
                                classId: 'ar_invoice_head',
                                action: 'search',
                                data: {
                                    search_flag : 120,
                                    sqlwhere: ' ar_invoice_head_id = ' + value.ar_invoice_head_id
                                }
                            })
                            .then(function (respon) {
                                $scope.data.currItem.amount_bill_f_cancel = numberApi.sub(respon.ar_invoice_heads[0].amount_bill_f, respon.ar_invoice_heads[0].amount_cancel);
                            }));
                    });
                    $q.all(arr).then(function () {
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.ar_write_off_lines);
                    });
                }

                /**
                 * 保存请求后的处理
                 * @param responseData
                 */
                $scope.doAfterSave = function (responseData) {
                    if(responseData.flag==99){
                        $scope.data.currItem.received_written_off_amt = responseData.write_off_amt_before;
                        swalApi.info(responseData.sqlwhere);
                        refAmtrak();
                        return $q.reject();
                    }
                };


                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.write_off_head_id > 0;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.write_off_head_id > 0;
                };

                /*底部右边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
                $scope.footerRightButtons.save.title = "核销";
                $scope.footerRightButtons.save.hide = function () {
                    return $scope.data.currItem.write_off_head_id > 0;
                };

                /*----------------------------------按钮方法 定义-------------------------------------------*/

                /**
                 * 添加明细行
                 */
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    $modal.openCommonSearch({
                        classId:'ar_invoice_head',
                        postData:{
                            search_flag : 120
                        },
                        sqlWhere : " customer_id = " + $scope.data.currItem.customer_id + " and amount_bill_f>amount_cancel",
                        action:'search',
                        checkbox: true,
                        dataRelationName:'ar_invoice_heads'
                    })
                        .result//响应数据
                        .then(function(result){
                            result.forEach(function (value) {
                                $scope.data.currItem.ar_write_off_lines.push({
                                    ar_invoice_head_id : value.ar_invoice_head_id,//发票id
                                    trading_company_name : value.trading_company_name,//开票公司
                                    legal_entity_code : value.legal_entity_code,//法人客户编码
                                    legal_entity_name : value.legal_entity_name,//法人客户名称
                                    invoice_no : value.invoice_no,//发票号
                                    date_invoice : value.date_invoice,//发票日期
                                    amount_bill_f : value.amount_bill_f,//发票金额
                                    amount_bill_f_cancel : numberApi.sub(value.amount_bill_f, value.amount_cancel),//可核销金额
                                    write_off_amt : numberApi.sub(value.amount_bill_f, value.amount_cancel),//本次核销金额
                                });
                            });
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.ar_write_off_lines);
                            $scope.calSum();
                        });

                };

                /**
                 * 删除行培训经历
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.ar_write_off_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.ar_write_off_lines);
                        $scope.calSum();
                    }
                };

                /**
                 * 重写核销方法
                 */
                $scope.save = function () {
                    return $q
                        .when()
                        .then($scope.hcSuper.save)
                        .then($scope.refresh);
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: ArWriteHeadList
        });

    });