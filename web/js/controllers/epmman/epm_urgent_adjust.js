/**
 * zengjinhua
 * 2019/11/25
 * 紧急要货插单
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', '$modal', 'gridApi', 'numberApi', 'directive/hcBox', 'directive/hcModal'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, $modal, gridApi, numberApi) {

        var controller=[
            '$scope',
            function ($scope){
                /**
                 * 数据定义
                 */
                /*------------------------------------------数据定义------------------------------------------*/
                $scope.data = {};
                $scope.data.currItem = {
                    //定义列表数组
                    epm_urgent_adjusts:[],
                    epm_urgent_adjust_lines:[]
                };
                $scope.selectedRowCount = 0;//勾选行数

                var arrId = [];
                /*------------------------------------------网格定义------------------------------------------*/
                /**
                 * 定义表格详情展示
                 */
                $scope.gridOptions={
                    hcEvents : {
                        rowSelected: function (params) {
                            if(params.node.selected){
                                $scope.selectedRowCount++;
                            }else{
                                $scope.selectedRowCount--;
                            }
                        },
                        modelUpdated: function (){
                            $scope.selectedRowCount = 0;
                            $scope.data.currItem.epm_urgent_adjusts.forEach(function(val, index){
                                if($scope.gridOptions.hcApi.getNodeOfRowIndex(index).selected){
                                    $scope.selectedRowCount++;
                                }
                            });
                        },
                        cellDoubleClicked: function (params) {
                            $scope.urgentAdjust.open({//打开模态框
                                resolve: {
                                    before_line: params.data,
                                    gridApi : gridApi
                                },
                                size: 'lg',
                                controller: ['$scope', '$q', 'before_line', 'gridApi',
                                    function ($modalScope, $q, before_line, gridApi) {
                                        $modalScope.title = "占用数量调整";
                                        $modalScope.before_line = before_line;
                                        $modalScope.saveExecute = true;
                                        $modalScope.gridOptionUrgentAdjust = {
                                            columnDefs:[{
                                                type:'序号'
                                            },{
                                                field:'adjust_customer_code',
                                                headerName:'客户编码'
                                            },{
                                                field:'adjust_customer_name',
                                                headerName:'客户名称'
                                            },{
                                                field:'adjust_sa_salebillno',
                                                headerName:'要货单号'
                                            },{
                                                field:'adjust_urgent_order_billno',
                                                headerName:'紧急要货单'
                                            },{
                                                field:'adjust_item_code',
                                                headerName:'产品编码'
                                            },{
                                                field:'adjust_item_name',
                                                headerName:'产品名称'
                                            },{
                                                field:'adjust_reserved_qty',
                                                headerName:'当前保留数量',
                                                type : '数量'
                                            },{
                                                field:'adjust_pre_reserved_qty',
                                                headerName:'当前预占数量',
                                                type : '数量'
                                            },{
                                                field:'adjust_adjust_qty',
                                                headerName:'减少保留数量',
                                                type : '数量',
                                                editable : function(){
                                                    return true;
                                                },
                                                onCellValueChanged: function (args) {
                                                    if($modalScope.saveExecute){
                                                        if (args.newValue === args.oldValue) {
                                                            return;
                                                        }
                                                        if(!numberApi.isNum(Number(args.data.adjust_adjust_qty))){
                                                            swalApi.info('输入不合法!请输入数字');
                                                            args.data.adjust_adjust_qty = undefined;
                                                        }else if(Number(args.data.adjust_adjust_qty) <= 0){
                                                            swalApi.info('输入不合法!输入大于零的数字');
                                                            args.data.adjust_adjust_qty = undefined;
                                                        }else if(Number(args.data.adjust_reserved_qty) < Number(args.data.adjust_adjust_qty)){
                                                            swalApi.info('请输入小于等于当前保留数量的数字');
                                                            args.data.adjust_adjust_qty = undefined;
                                                        }
                                                        var qty = numberApi.sum($modalScope.urgent_adjusts, 'adjust_adjust_qty');
                                                        if(qty > $modalScope.before_line.pre_reserved_qty){
                                                            swalApi.info('减少保留数量合计起来的数量需小于等于申请信息的当前预占数量');
                                                            args.data.adjust_adjust_qty = undefined;
                                                            return;
                                                        }
                                                        $modalScope.before_line.adjust_qty = qty;
                                                    }
                                                }
                                            },{
                                                field:'adjust_pick_up_date',
                                                headerName:'提货时间',
                                                type : '日期'
                                            },{
                                                field:'adjust_valid_date',
                                                headerName:'有效期至',
                                                type : '日期'
                                            },{
                                                field:'remark',
                                                headerName:'备注',
                                                editable : function(){
                                                    return true;
                                                }
                                            }],
                                            //定义表格增减行按钮
                                            hcButtons: {
                                                businessAdd: {
                                                    icon: 'iconfont hc-add',
                                                    click: function () {
                                                        $modalScope.gridOptionUrgentAdjust.api.stopEditing();
                                                        return $modal.openCommonSearch({
                                                            classId:'epm_urgent_adjust',
                                                            postData:{
                                                                customer_id : $modalScope.before_line.customer_id,
                                                                delivery_base_code : $modalScope.before_line.delivery_base_code,
                                                                item_code : $modalScope.before_line.item_code,
                                                                epm_urgent_adjusts : $modalScope.urgent_adjusts
                                                            },
                                                            action:'selectsaoutline',
                                                            title:"紧急要货单行",
                                                            dataRelationName:'epm_urgent_adjusts',
                                                            checkbox: true,
                                                            gridOptions:{
                                                                columnDefs:[
                                                                    {
                                                                        headerName: "客户编码",
                                                                        field: "adjust_customer_code"
                                                                    },{
                                                                        headerName: "客户名称",
                                                                        field: "adjust_customer_name"
                                                                    },{
                                                                        headerName: "紧急要货单号",
                                                                        field: "adjust_urgent_order_billno"
                                                                    },{
                                                                        headerName: "产品编码",
                                                                        field: "adjust_item_code"
                                                                    },{
                                                                        headerName: "产品名称",
                                                                        field: "adjust_item_name"
                                                                    },{
                                                                        headerName: "发货基地编码",
                                                                        field: "adjust_delivery_base_code"
                                                                    },{
                                                                        headerName: "发货基地名称",
                                                                        field: "adjust_delivery_base_name"
                                                                    }
                                                                ]
                                                            }
                                                        })
                                                            .result//响应数据
                                                            .then(function(result){
                                                                var arr = ['sa_salebillno', 'urgent_order_billno', 'customer_id',
                                                                'sa_out_bill_line_id', 'ext_sa_out_bill_line_id', 'urgent_order_line_id',
                                                                'customer_code', 'customer_name', 'item_id', 'item_code', 'item_name', 
                                                                'delivery_base_code', 'delivery_base_name', 'reserved_qty', 'pre_reserved_qty',
                                                                'pick_up_date', 'valid_date'];
                                                                result.forEach(function(value){
                                                                    var proj = {};
                                                                    arr.forEach(function(field){
                                                                        proj[field] = $modalScope.before_line[field];
                                                                    });
                                                                    arr.forEach(function(field){
                                                                        field = "adjust_" + field;
                                                                        proj[field] = value[field];
                                                                    });
                                                                    $modalScope.urgent_adjusts.push(proj);
                                                                });
                                                                $modalScope.gridOptionUrgentAdjust.hcApi.setRowData(
                                                                    $modalScope.urgent_adjusts);
                                                            });
                                                        
                                                    }
                                                },
                                                invoiceDel: {
                                                    icon: 'iconfont hc-reduce',
                                                    click: function () {
                                                        var idx = $modalScope.gridOptionUrgentAdjust.hcApi
                                                            .getFocusedRowIndex();
                                                        if (idx < 0) {
                                                            swalApi.info('请选中要删除的行');
                                                        } else {
                                                            $modalScope.urgent_adjusts.splice(idx, 1);
                                                            $modalScope.gridOptionUrgentAdjust.hcApi.setRowData(
                                                                $modalScope.urgent_adjusts);
                                                            $modalScope.before_line.adjust_qty = numberApi.sum($modalScope.urgent_adjusts, 'adjust_adjust_qty');
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                        $modalScope.urgent_adjusts = [];//定义一个数组
                                        $scope.data.currItem.epm_urgent_adjusts.forEach(function (value) {//设置同一个产品数据
                                            if(value.urgent_order_line_id == $modalScope.before_line.urgent_order_line_id && value.adjust_urgent_order_line_id > 0){
                                                $modalScope.urgent_adjusts.push(value)
                                            }
                                        });
                                        gridApi.execute($modalScope.gridOptionUrgentAdjust, function () {
                                            $modalScope.gridOptionUrgentAdjust.hcApi.setRowData(
                                                $modalScope.urgent_adjusts);
                                            $modalScope.before_line.adjust_qty = numberApi.sum($modalScope.urgent_adjusts, 'adjust_adjust_qty');
                                        });
                                        angular.extend($modalScope.footerRightButtons, {
                                            ok: {
                                                title: '确定',
                                                click: function () {
                                                    return $q
                                                        .when()
                                                        .then(function () {
                                                            $modalScope.saveExecute = false;
                                                            $modalScope.gridOptionUrgentAdjust.api.stopEditing();
                                                            $modalScope.saveExecute = true;
                                                            var arr = [];
                                                            var arrNotNum = [];
                                                            var arrNotZ = [];
                                                            var arrNotG = [];
                                                            var isExecute = true;
                                                            /* 数据校验 */
                                                            $modalScope.urgent_adjusts.forEach(function(val, index){
                                                                if(!numberApi.isNum(Number(val.adjust_adjust_qty))){
                                                                    arrNotNum.push(index + 1);
                                                                    val.adjust_adjust_qty = undefined;
                                                                }else if(Number(val.adjust_adjust_qty) <= 0){
                                                                    arrNotZ.push(index + 1);
                                                                    val.adjust_adjust_qty = undefined;
                                                                }else if(Number(val.adjust_reserved_qty) < Number(val.adjust_adjust_qty)){
                                                                    arrNotG.push(index + 1);
                                                                    val.adjust_adjust_qty = undefined;
                                                                }
                                                            });
                                                            if(arrNotNum.length){
                                                                arr.push(
                                                                    '',
                                                                    '减少保留数量请输入数字，以下行不合法：',
                                                                    '第' + arrNotNum.join('、') + '行'
                                                                );
                                                            }
                                                            if(arrNotZ.length){
                                                                arr.push(
                                                                    '',
                                                                    '减少保留数量请输入大于零的数字，以下行不合法：',
                                                                    '第' + arrNotZ.join('、') + '行'
                                                                );
                                                            }
                                                            if(arrNotG.length){
                                                                arr.push(
                                                                    '',
                                                                    '减少保留数量请输入小于等于当前保留数量的数字，以下行不合法：',
                                                                    '第' + arrNotG.join('、') + '行'
                                                                );
                                                            }
                                                            var qty = numberApi.sum($modalScope.urgent_adjusts, 'adjust_adjust_qty');
                                                            if(qty > $modalScope.before_line.pre_reserved_qty){
                                                                arr.push('减少保留数量合计起来的数量需小于等于申请信息的当前预占数量');
                                                            }else{
                                                                $modalScope.before_line.adjust_qty = qty;
                                                            }
                                                            if(arr.length){
                                                                swalApi.error(arr);
                                                                $modalScope.gridOptionUrgentAdjust.hcApi.setRowData(
                                                                    $modalScope.urgent_adjusts);
                                                                isExecute = false;
                                                            }
                                                            if(isExecute){
                                                                $modalScope.urgent_adjusts.forEach(function(value){
                                                                    value.adjust_qty = value.adjust_adjust_qty;
                                                                    value.seq = $modalScope.before_line.seq;
                                                                });
                                                                $scope.data.currItem.epm_urgent_adjusts = 
                                                                $scope.data.currItem.epm_urgent_adjusts.filter(function (val){
                                                                    return val.seq != $modalScope.before_line.seq;
                                                                });
                                                                $modalScope.urgent_adjusts.forEach(function(value){
                                                                    $scope.data.currItem.epm_urgent_adjusts.push(value);
                                                                });
                                                                //排序
                                                                $scope.data.currItem.epm_urgent_adjusts.sort(function (a, b) {
                                                                    return a.seq - b.seq;
                                                                });
                                                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_adjusts);
                                                            }
                                                            return isExecute;
                                                        })
                                                        .then(function (isExecute) {
                                                            if(isExecute){//关闭窗口
                                                                $modalScope.$close();
                                                            }
                                                        });
                                                }
                                            }
                                        });
                                    }]
                            })
                        }
                    },
                    columnDefs:[{
                        field:'checkboxs',
                        type : '复选框',
                        headerCheckboxSelection : false       
                    },{
                        type:'序号'
                    },
                    {
                        headerName:'申请信息',
                        children : [
                            {
                                field:'customer_code',
                                headerName:'客户编码'
                            },
                            {
                                field:'customer_name',
                                headerName:'客户名称'
                            },
                            {
                                field:'urgent_order_billno',
                                headerName:'紧急要货单号'
                            },
                            {
                                field:'item_code',
                                headerName:'产品编码'
                            },
                            {
                                field:'item_name',
                                headerName:'产品名称'
                            },
                            {
                                field:'delivery_base_name',
                                headerName:'发货基地'
                            },
                            {
                                field:'reserved_qty',
                                headerName:'当前保留数量',
                                type : '数量'
                            },
                            {
                                field:'pre_reserved_qty',
                                headerName:'当前预占数量',
                                type : '数量'
                            },
                            {
                                field:'adjust_qty',
                                headerName:'保留数量调整',
                                valueFormatter: function (params) {
                                    if(params.data.adjust_qty != undefined 
                                        && params.data.adjust_qty != null 
                                        && params.data.adjust_qty != "" 
                                        && params.data.adjust_qty != 0){
                                            return "+" + params.data.adjust_qty
                                    }else{
                                        return params.data.adjust_qty
                                    }
                                },
                                cellStyle: {
                                    'text-align': 'center'
                                }
                            }
                        ]
                    },
                    {
                        headerName:'调整信息',
                        children : [
                            {
                                field:'adjust_customer_code',
                                headerName:'客户编码'
                            },
                            {
                                field:'adjust_customer_name',
                                headerName:'客户名称'
                            },
                            {
                                field:'adjust_urgent_order_billno',
                                headerName:'紧急要货单号'
                            },
                            {
                                field:'adjust_item_code',
                                headerName:'产品编码'
                            },
                            {
                                field:'adjust_item_name',
                                headerName:'产品名称'
                            },
                            {
                                field:'adjust_reserved_qty',
                                headerName:'当前保留数量',
                                type : '数量'
                            },
                            {
                                field:'adjust_pre_reserved_qty',
                                headerName:'当前预占数量',
                                type : '数量'
                            },
                            {
                                field:'adjust_adjust_qty',
                                headerName:'保留数量调整',
                                valueFormatter: function (params) {
                                    if(params.data.adjust_adjust_qty != undefined 
                                        && params.data.adjust_adjust_qty != null 
                                        && params.data.adjust_adjust_qty != "" 
                                        && params.data.adjust_adjust_qty != 0){
                                            return "-" + params.data.adjust_adjust_qty
                                    }else{
                                        return params.data.adjust_adjust_qty
                                    }
                                },
                                cellStyle: {
                                    'text-align': 'center'
                                }
                            }
                        ]
                    },
                    {
                        field : 'remark',
                        headerName:'备注'
                    },{
                        field:'proccuse_status',
                        headerName:'处理状态',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.proccuse_status == 'E' ? 
                                    "#F35A05": args.data.proccuse_status == '不处理'?"#5ada4a" :"#333" ,
                                'text-align': 'center'
                            }
                        },
                        type:'词汇',
                        cellEditorParams: {
                            names: ['失败', '成功', '不处理'],
                            values: ['E', 'S', '不处理']
                        }
                    },{
                        field:'process_messag',
                        headerName:'处理信息',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.proccuse_status == 'E' ? 
                                    "#F35A05": args.data.proccuse_status == '不处理'?"#5ada4a" :"#333" 
                            }
                        }
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        callAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addUrgent && $scope.addUrgent();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delUrgent && $scope.delUrgent();
                            }
                        }
                    }
                };

                /**
                 * 定义列表页展示
                 */
                $scope.gridOptions_list={
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'item_code',
                        headerName:'产品编码'
                    },{
                        field:'item_name',
                        headerName:'产品名称'
                    },{
                        field:'urgent_extend_billno',
                        headerName:'有效期延期申请单'
                    },{
                        field:'stat',
                        headerName:'审核状态',
                        hcDictCode : 'stat'
                    },{
                        field:'intf_result',
                        headerName:'接口状态',
                        cellStyle: {
                            'text-align': 'center'
                        },
                        type:'词汇',
                        cellEditorParams: {
                            names: ['失败', '成功', '不处理'],
                            values: ['E', 'S', '不处理']
                        }
                    },{
                        field:'intf_info',
                        headerName:'接口信息'
                    }]
                };

                //基础基础控制器
                controllerApi.extend({
                    controller:base_diy_page.controller,
                    scope:$scope
                });

                /**
                 * 复选框
                 */
                $scope.gridOptions.isRowSelectable = function (node) {
                    if(node.data.proccuse_status == undefined 
                        || node.data.proccuse_status == null 
                        || node.data.proccuse_status == "" 
                        || node.data.proccuse_status == "E"){
                        return true;
                   }else{
                       return false;
                   }
                };
                /**
                 * 查询要货订单
                 */
                $scope.searchObjectPickupDate = {
                    title:"要货订单",
                    postData: {
                        search_flag: 1,
                        is_urgent_adjust : 2
                    },
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "订单状态",
                                field: "order_stat",
                                hcDictCode: 'epm.require_bill.order_stat'
                            },{
                                field: 'sa_salebillno',
					            headerName: '要货单号'
                            },{
                                field: 'date_invbill',
                                headerName: '订单日期',
                                type: '日期'
                            },{
                                field: 'bill_type',
                                headerName: '订单类型',
                                hcDictCode: 'epm.bill_type'
                            },
                            {
                                field: 'channel',
                                headerName: '销售渠道',
                                hcDictCode: 'sales.channel'
                            },
                            {
                                field: 'order_pdt_line',
                                headerName: '订单产品线',
                                hcDictCode: 'epm.order_pdt_line'
                            },
                            {
                                field: 'business_type',
                                headerName: '业务类型',
                                hcDictCode: 'epm.business_type'
                            },
                            {
                                field: 'customer_code',
                                headerName: '客户编码'
                            },
                            {
                                field: 'customer_name',
                                headerName: '客户名称'
                            },
                            {
                                field: 'short_name',
                                headerName: '客户简称'
                            }
                        ]
                    },
                    afterOk: function (data) {
                        $scope.data.currItem.sa_out_bill_head_id = data.sa_out_bill_head_id;
                        $scope.data.currItem.sa_salebillno = data.sa_salebillno;
                        $scope.data.currItem.epm_urgent_adjusts = [];
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_adjusts);
                    },
                    beforeOk: function (result) {
                        return requestApi
                            .post({
                                classId: 'epm_urgent_adjust',
                                action: 'verifydata',
                                data: {
                                    sa_out_bill_head_id : result.sa_out_bill_head_id
                                }
                            })
                            .then(function (data) {
                                if(data.sqlwhere.length > 0){
                                    swalApi.info(data.sqlwhere);
                                    return false;
                                }else{
                                    $scope.data.currItem.epm_urgent_adjust_lines = data.epm_urgent_adjust_lines;
                                    $scope.gridOptions_list.hcApi.setRowData($scope.data.currItem.epm_urgent_adjust_lines);
                                    return result;
                                }
                            });
                    }
                };
                
                /**
                 * 插单
                 */
                $scope.updateAdjust = function (){
                    $scope.gridOptions.api.stopEditing();
                    var row = [];
                    $scope.data.currItem.epm_urgent_adjusts.forEach(function(val, index){
                        if($scope.gridOptions.hcApi.getNodeOfRowIndex(index).selected){
                            val.index = index + 1;
                            row.push(val);
                        }else{
                            val.index = 0;
                        }
                    });
                     //定义一个参数
                    var isPass = 1;
                    //定义一个数据盒子
                    var arr = [];
                    var invalidDate = [];
                    row.forEach(function(val){
                        if(!(Number(val.adjust_qty) > 0)){
                            arr.push(val.index);
                        }
                    });
                    //判断事业部
                    if (arr.length) {
                        invalidDate.push(
                            '',
                            '保留数量调整不能为空，以下行不合法：',
                            '第' + arr.join('、') + '行'
                        );
                    }
                    if(invalidDate.length){
                        isPass = 0;
                        return swalApi.error(invalidDate);
                    }
                    if(isPass == 1){//校验通过
                        return requestApi
                            .post({
                                classId: 'epm_urgent_adjust',
                                action: 'pushadjust',
                                data: {
                                    epm_urgent_adjusts: row
                                }
                            })
                            .then(function (data) {
                                var arrIndex = [];
                                data.epm_urgent_adjusts.forEach(function(value){
                                    var idx = numberApi.sub(value.index, 1);
                                    $scope.data.currItem.epm_urgent_adjusts[idx] = value;
                                    arrIndex.push(idx);
                                });
                                data.epm_urgent_adjust_lines.forEach(function(value){
                                    var idx = numberApi.sub(value.index, 1);
                                    $scope.data.currItem.epm_urgent_adjusts[idx] = value;
                                    arrIndex.push(idx);
                                });
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_adjusts);
                                arrIndex.forEach(function(idx){
                                    $scope.gridOptions.hcApi.getNodeOfRowIndex(idx).setSelected(true);
                                });
                                swalApi.info('发送成功!');
                            });
                    }
                };

                /**
                 * 新增行
                 */
                $scope.addUrgent = function () {
                    return $modal.openCommonSearch({
                        classId:'epm_urgent_adjust',
                        postData:{
                            sa_out_bill_head_id : $scope.data.currItem.sa_out_bill_head_id,
                            epm_urgent_adjusts : $scope.data.currItem.epm_urgent_adjusts
                        },
                        action:'getsaoutbilldata',
                        title:"紧急要货单行",
                        checkbox: true,
                        dataRelationName:'epm_urgent_adjusts',
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "客户编码",
                                    field: "customer_code"
                                },{
                                    headerName: "客户名称",
                                    field: "customer_name"
                                },{
                                    headerName: "紧急要货单号",
                                    field: "urgent_order_billno"
                                },{
                                    headerName: "产品编码",
                                    field: "item_code"
                                },{
                                    headerName: "产品名称",
                                    field: "item_name"
                                },{
                                    headerName: "发货基地编码",
                                    field: "delivery_base_code"
                                },{
                                    headerName: "发货基地名称",
                                    field: "delivery_base_name"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            result.forEach(function(val){
                                $scope.data.currItem.epm_urgent_adjusts.push(val);
                                var id = 0;
                                var seq = 0;
                                $scope.data.currItem.epm_urgent_adjusts.forEach(function(val, index){
                                    if(index == 0){
                                        id = val.urgent_order_line_id;
                                        seq = seq + 1;
                                    }
                                    if(val.urgent_order_line_id == id){
                                        val.seq = seq;
                                    }else{
                                        id = val.urgent_order_line_id;
                                        seq = seq + 1;
                                        val.seq = seq;
                                    }
                                });
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_adjusts);
                            });
                        });
                };
                /**
                 * 删除行
                 */
                $scope.delUrgent = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_urgent_adjusts.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_adjusts);
                    }
                };

            }
        ];
        return controllerApi.controller({
            module:module,
            controller:controller
        });

    });