/**
 * 订单紧急要货
 */
define(
	['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'directive/hcModal'],
	function (module, controllerApi, base_obj_prop, swalApi, requestApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.existIllegal = false;

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    hcName: '延期明细',
                    hcRequired : true,
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'intf_result',
                        headerName: '接口状态',
                        type : '词汇',
                        cellEditorParams:{
                            names:['失败','成功'],
                            values:['E','S']
                        },
                        hide : true,
                        cellStyle:function (args) {
                            return {
                                'color':args.data.intf_result == "E" ? "#F35A05" : "#333",
                                'text-align': 'center'
                            }
                        }
                    },
                    {
                        field: 'intf_info',
                        headerName: '接口处理信息',
                        hide : true,
                        cellStyle:function (args) {
                            return {
                                'color':args.data.intf_result == "E" ? "#F35A05" : "#333"
                            }
                        },
                        suppressAutoSize: true,
                        suppressSizeToFit: true,
                        width : 200
                    },
                    {/* 按钮 */
                        field: 'heavyhush',
                        headerName: '重推',
                        hide : true,
                        cellRenderer: actionHeavyPush,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    }, 
                    {
                        field: 'item_name',
                        headerName: '产品名称',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'model',
                        headerName: '型号',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'qty_bill',
                        headerName: '订单数量',
                        type : '数量',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'urgent_qty',
                        headerName: '紧急要货数量',
                        type : '数量',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'delivery_base_name',
                        headerName: '发货基地',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'valid_date',
                        headerName: '原有效期至',
                        type : '日期',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'reserved_qty',
                        headerName: '当前保留数量',
                        type : '数量',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'pre_reserved_qty',
                        headerName: '当前预占数量',
                        type : '数量',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'released_qty',
                        headerName: '当前已释放数量',
                        type : '数量',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    },
                    {
                        field: 'is_cancel',
                        headerName: '有效否',
                        type : '词汇',
                        cellEditorParams:{
                            names:['失效'],
                            values:['2']
                        },
                        cellStyle:function (args) {
                            return {
                                'color':args.data.cannot_extend == 2 ? "red" : "#333"
                            }
                        }
                    }]
                };
                /*----------------------------------自定义按钮------------------------------------------*/
                
                /**
                 * 渲染一列的单元格：重推
                 * @returns {string}
                 */
                function actionHeavyPush(params) {
                    var html;
                    if(params.data.intf_result == "E" && params.data.is_cancel != 2 && params.data.cannot_extend != 2){
                        html = $('<a>', {
                            text: '重推',
                            css: {
                                backgroundColor: '#298645',
                                display: 'inline-block',
                                height: '19px',
                                width: '70px',
                                borderRadius: '7px',
                                color : 'white'
                            },
                            on: {
                                click : function (){
                                    return swalApi
                                        .confirmThenSuccess({
                                            title: "是否确认重推？",
                                            okFun: function () {
                                                return requestApi.post({
                                                    classId: 'epm_urgent_extend',
                                                    action: 'toextend',
                                                    data: {
                                                        alteration_extends : [params.data]
                                                    }
                                                })
                                                .then(function (data) {
                                                    data.epm_urgent_order_lines;
                                                    var fields = ['intf_result', 'intf_info'];
                                                     fields.forEach(function(field){
                                                        params.data[field] = data.alteration_extends[0][field];
                                                     });
                                                    $scope.gridOptions.api.refreshCells({
                                                        rowNodes: [params.node],
                                                        force: true,
                                                        columns: $scope.gridOptions.columnApi.getColumns(fields)
                                                    });
                                                });
                                            },
                                            okTitle: '重推成功'
                                    });
                                }
                            }
                        });
                    }else{
                        html = $('<span>');
                    }
                    
                    return html[0];
                }

                /*----------------------------------通用查询-------------------------------------------*/
                
                /**
                 * 要货单号查询
                 */
                $scope.searchObjectSerach = {
                    title:"紧急要货",
                    action: "selecturgentitem",
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "紧急要货单号",
                                field: "urgent_order_billno"
                            },
                            {
                                headerName: "要货单号",
                                field: "sa_salebillno"
                            },
                            {
                                headerName: "订单日期",
                                field: "date_invbill"
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
                                headerName: "订单类型",
                                field: "bill_type",
                                hcDictCode : 'epm.bill_type'
                            },
                            {
                                headerName: "订单状态",
                                field: "order_stat",
                                hcDictCode : 'epm.require_bill.order_stat'
                            }
                        ]
                    },
                    afterOk: function (saOut) {
                        ['urgent_order_id', 'urgent_order_billno', 'customer_id', 'sa_salebillno', 'sa_out_bill_head_id',
                        'in_date', 'trading_company_name', 'order_stat', 'bill_type', 'billing_unit_name', 'customer_code',
                        'contract_code', 'contract_name', 'project_code', 'project_name', 'date_invbill', 'customer_name'
                        ].forEach(function (field) {
                            $scope.data.currItem[field] = saOut[field];
                        });
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_extend_lines);
                    },
                    beforeOk: function (result) {
                        return requestApi
                            .post({
                                classId: 'epm_urgent_extend',
                                action: 'verifycode',
                                data: {
                                    urgent_order_id : result.urgent_order_id
                                }
                            })
                            .then(function (data) {
                                if (data.flag == 1) {
                                    swalApi.info(data.sqlwhere);
                                    return false;
                                }else if (data.flag == 2){
                                    str = "该紧急要货单目前存在明细未推送成功，若确定针对其他已成功的记录进行延期申请，点击确认按钮，则系统自动将下述记录失效：";
                                    data.epm_urgent_extends.forEach(function(value){
                                        str += "\n【" + value.item_code  
                                            + "- " + value.item_name 
                                            + " 紧急要货数量：】" + value.urgent_qty;
                                    });
                                    return swalApi.confirm(str).then(function () {
                                        $scope.data.currItem.epm_urgent_extend_lines = data.epm_urgent_extend_lines;
                                        $scope.data.currItem.max_valid_date = data.max_valid_date;
                                        requestApi.post({
                                            classId: 'epm_urgent_extend',
                                            action: 'loseefficacy',
                                            data: {
                                                epm_urgent_extends : data.epm_urgent_extends
                                            }
                                        });
                                        return result;
                                    });
                                }else if (data.flag == 3){
                                    str = "该紧急要货单存在已审核完毕的延期申请单【"
                                    + data.urgent_extend_billno
                                    + "】，但下述记录尚未延期成功，点击确认按钮，则系统自动将下述延期记录失效，以进行新的延期申请：";
                                    data.epm_urgent_extends.forEach(function(value){
                                        str += "\n【" + value.item_code  
                                            + "- " + value.item_name 
                                            + " 申请延期至：】" + value.extend_valid_date;
                                    });
                                    return swalApi.confirm(str).then(function () {
                                        $scope.data.currItem.epm_urgent_extend_lines = data.epm_urgent_extend_lines;
                                        $scope.data.currItem.max_valid_date = data.max_valid_date;
                                        requestApi.post({
                                            classId: 'epm_urgent_extend',
                                            action: 'loseefficacyextend',
                                            data: {
                                                epm_urgent_extends : data.epm_urgent_extends
                                            }
                                        });
                                        return result;
                                    });
                                }else{
                                    $scope.data.currItem.epm_urgent_extend_lines = data.epm_urgent_extend_lines;
                                    $scope.data.currItem.max_valid_date = data.max_valid_date;
                                    return result;
                                }
                            });
                    }
                };

				/*----------------------------------方法数据定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_urgent_extend_lines = [];
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_urgent_extend_lines);
                    $scope.gridOptions.columnApi.setColumnsVisible(['intf_result', 'intf_info', 'heavyhush'],
                        $scope.data.currItem.stat == 5);//为true则展示
                    $scope.data.currItem.epm_urgent_extend_lines.some(function(value){
                        if(value.cannot_extend == 2){
                            $scope.existIllegal = true;
                            return true;
                        }
                    });
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if(new Date().getTime() >= new Date($scope.data.currItem.extend_valid_date).getTime()){
                        invalidBox.push('有效期延期至需大于当前日期');
                    }
                    if(new Date($scope.data.currItem.max_valid_date).getTime() >= new Date($scope.data.currItem.extend_valid_date).getTime()){
                        invalidBox.push('有效期延期至需大于原有效期至【' 
                            + new Date($scope.data.currItem.max_valid_date).Format('yyyy-MM-dd')
                            + '】');
                    }
			        return invalidBox;
                };

                /*----------------------------------按钮及标签定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = function () {
                    return true;
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return true;
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