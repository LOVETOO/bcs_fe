/**
 * 订单紧急要货
 */
define(
	['module', 'controllerApi', 'base_obj_prop', '$modal', 'numberApi', 'swalApi', 'requestApi', 'gridApi', 'angular', 'openBizObj', 'directive/hcModal'],
	function (module, controllerApi, base_obj_prop, $modal, numberApi, swalApi, requestApi, gridApi, angular, openBizObj) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /**
                 * 是否经销商登陆
                 * */
                (function (){
                    var reg = /经销商/;
                    $scope.isNotDealerLog = true;
                    user.roleofusers.some(function(value){
                        if(reg.test(value.rolename)){
                            //经销商
                            $scope.isNotDealerLog = false;
                            return true;
                        }
                    });
                })();

                /**
                 * 提货时间变更
                 */
                $scope.tabs.pickTime = {
                    title : '',
                    hide : true
                };
                /**
                 * 插单记录
                 */
                $scope.tabs.singleRecord = {
                    title : '',
                    hide : true
                };

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    hcEvents: {
                        /**
                         * 焦点事件
                         */
                        cellFocused: function (params) {
                            if($scope.stocks != undefined && params.rowIndex != null && $scope.isNotDealerLog){
                                /**
                                 * 选中了那一行，将当前行的库存占用信息展示
                                 */
                                $scope.gridOptionsLine.hcApi
                                    .setRowData($scope.stocks[$scope.data.currItem.epm_urgent_order_lines[params.rowIndex].urgent_order_line_id]);
                            }
                        }
                    },
                    hcName: '紧急要货明细',
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
                                'color':args.data.intf_result == "E" ? "#F35A05" : "#333"
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
                        }
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    }, 
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'entorgid',
                        headerName: '产品线',
                        hcDictCode : 'entorgid'
                    },
                    {
                        field: 'model',
                        headerName: '型号'
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位'
                    },
                    {
                        field: 'qty_bill',
                        headerName: '订单数量',
                        type : '数量'
                    },
                    {
                        field: 'confirm_out_qty',
                        headerName: '已出库数量',
                        type : '数量'
                    },
                    {
                        field: 'cancel_qty',
                        headerName: '取消数量',
                        type : '数量'
                    },
                    {
                        field: 'not_shipped_qty',
                        headerName: '未出库数量',
                        type : '数量'
                    },
                    {
                        field: 'urgent_qty',
                        headerName: '紧急要货数量',
                        type : '数量',
                        //editable: true,
                        //hcRequired:true,
                        onCellValueChanged: function (args) {
                            if (args.oldValue == args.newValue) {
                                return;
                            }
                            if(!numberApi.isNum(Number(args.newValue))){//判断输入是否是数字
                                swalApi.info("输入不是数字，请重新输入!");
                                args.data.urgent_qty = undefined;
                                return;
                            }else if(Number(args.newValue)<=0){
                                swalApi.info("紧急要货数量必须大于零，请重新输入!");
                                args.data.urgent_qty = undefined;
                                return;
                            }else if(Number(args.newValue) > Number(args.data.not_shipped_qty)){
                                swalApi.info("紧急要货数量不能大于未出库数量，请重新输入!");
                                args.data.urgent_qty = undefined;
                                return;
                            }
                            args.data.urgent_discounted_amount = countMoney(args.data.discounted_price, args.newValue);
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                columns: $scope.gridOptions.columnApi.getColumns(['urgent_discounted_amount'])
                            });
                        }
                    },
                    {
                        field: 'discounted_price',
                        headerName: '折后单价',
                        type : '金额'
                    },
                    {
                        field: 'urgent_discounted_amount',
                        headerName: '紧急要货折后金额',
                        type : '金额'
                    },
                    {
                        field: 'pick_up_date',
                        headerName: '提货时间回复',
                        editable: function (){
                            return $scope.data.currItem.stat > 1
                        },
                        type : '日期',
                        onCellValueChanged: function (args) {
                            if(numberApi.sub(new Date().getTime(),24*60*60*1000) 
                                > new Date(args.data.pick_up_date).getTime()){
                                swalApi.error('提货时间回复需大于等于当前日期');
                                args.data.pick_up_date = undefined;
                                $scope.gridOptions.api.refreshCells({
                                    rowNodes: [args.node],
                                    columns: $scope.gridOptions.columnApi.getColumns(['pick_up_date'])
                                });
                            }
                        } 
                    },
                    {
                        field: 'delivery_base_name',
                        headerName: '发货基地',
                        onCellDoubleClicked: function (args) {
                            if ($scope.data.currItem.stat == 3 && $scope.form.editing) {
                                $scope.chooseDelivery(args);
                            }
                        }
                    },
                    {/* 按钮 */
                        field: 'seleteinventory',
                        headerName: '基地库存查询',
                        cellRenderer: actionSeleteInventory,
                        cellStyle: {
                            'text-align': 'center'
                        },
                        hide : true
                    },
                    {
                        field: 'reserved_qty',
                        headerName: '当前保留数量',
                        type : '数量'
                    },
                    {
                        field: 'pre_reserved_qty',
                        headerName: '当前预占数量',
                        type : '数量'
                    },
                    {
                        field: 'released_qty',
                        headerName: '已释放数量',
                        type : '数量'
                    },
                    {
                        field: 'valid_date',
                        headerName: '有效期至',
                        type : '日期'
                    },
                    {/* 按钮 */
                        field: 'heavyhush',
                        headerName: '重推',
                        cellRenderer: actionHeavyPush,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'is_cancel',
                        headerName: '有效否',
                        type : '词汇',
                        cellEditorParams:{
                            names:['失效'],
                            values:['2']
                        }
                    },
                    {/* 按钮 */
                        field: 'loseefficacy',
                        headerName: '失效',
                        cellRenderer:loseEfficacy,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        itemAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addItem && $scope.addItem();
                            },
                            hide : function (){
                                return ($scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.stat > 1);
                            }
                        },
                        itemDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delItem && $scope.delItem();
                            },
                            hide : function (){
                                return ($scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.stat > 1);
                            }
                        }
                    }
                };

                //表格定义  "该要货单里的下述产品不可发起紧急要货"
                $scope.gridOptionsLineNo = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, 
                    {
                        field: 'urgent_order_billno',
                        headerName: '紧急要货单号'
                    },
                    {
                        field: 'result',
                        headerName: '状态',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }]
                };

                //表格定义  "库存保留或预占信息"
                $scope.gridOptionsLine = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'reserved_date',
                        headerName: '库存保留日期'
                    },
                    {
                        field: 'reserved_qty',
                        headerName: '库存保留数量',
                        type : '数量'
                    }, 
                    {
                        field: 'pre_reserved_qty',
                        headerName: '库存预占数量',
                        type : '数量'
                    },
                    {
                        field: 'released_type',
                        headerName: '释放类型'
                    },
                    {
                        field: 'remark',
                        headerName: '备注'
                    }]
                };

                //表格定义  "提货时间变更"
                $scope.gridOptionspickTime = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, 
                    {
                        field: 'old_pick_up_date',
                        headerName: '原提货日期',
                        type : '日期'
                    },
                    {
                        field: 'new_pick_up_date',
                        headerName: '新提货日期',
                        type : '日期'
                    },
                    {
                        field: 'valid_date',
                        headerName: '有效期至',
                        type : '日期'
                    }, 
                    {
                        field: 'reserved_qty',
                        headerName: '当时保留数量',
                        type : '数量'
                    },
                    {
                        field: 'pre_reserved_qty',
                        headerName: '当时预占数量',
                        type : '数量'
                    }, 
                    {
                        field: 'released_qty',
                        headerName: '当时已释放数量',
                        type : '数量'
                    },
                    {
                        field: 'creator',
                        headerName: '创建人'
                    },
                    {
                        field: 'createtime',
                        headerName: '创建时间',
                        type : '时间'
                    }]
                };

                //表格定义  "插单记录"
                $scope.gridOptionssingleRecord = {
                    columnDefs: [{
                        type: '序号'
                    }, 
                    {
                        headerName: '申请信息',
                        children : [
                            {
                                field: 'customer_code',
                                headerName: '客户编码',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'customer_name',
                                headerName: '客户名称',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'urgent_order_billno',
                                headerName: '紧急要货单号',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'item_code',
                                headerName: '产品编码',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'item_name',
                                headerName: '产品名称',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'delivery_base_name',
                                headerName: '发货基地',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'reserved_qty',
                                headerName: '当时保留数量',
                                type : '数量',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333',
                                        'text-align': 'center'
                                    }
                                }
                            },
                            {
                                field: 'pre_reserved_qty',
                                headerName: '当时预占数量',
                                type : '数量',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333',
                                        'text-align': 'center'
                                    }
                                }
                            },
                            {
                                field: 'adjust_qty',
                                headerName: '保留数量调整',
                                type : '数量',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'single'? 'red' : '#333',
                                        'text-align': 'center'
                                    }
                                },
                                valueFormatter: function (params) {
                                    return "+" + params.data.rel_adjust_qty;
                                }
                            }
                        ]
                    },
                    {
                        headerName: '调整信息',
                        children : [
                            {
                                field: 'rel_customer_code',
                                headerName: '客户编码',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'rel_customer_name',
                                headerName: '客户名称',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'rel_urgent_order_billno',
                                headerName: '紧急要货单号',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'rel_item_code',
                                headerName: '产品编码',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'rel_item_name',
                                headerName: '产品名称',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333'
                                    }
                                }
                            },
                            {
                                field: 'rel_reserved_qty',
                                headerName: '当时保留数量',
                                type : '数量',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333',
                                        'text-align': 'center'
                                    }
                                }
                            },
                            {
                                field: 'rel_pre_reserved_qty',
                                headerName: '当时预占数量',
                                type : '数量',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333',
                                        'text-align': 'center'
                                    }
                                }
                            },
                            {
                                field: 'rel_adjust_qty',
                                headerName: '保留数量调整',
                                type : '数量',
                                cellStyle: function(args){
                                    return {
                                        'color': args.data.color == 'insert'? 'red' : '#333',
                                        'text-align': 'center'
                                    }
                                },
                                valueFormatter: function (params) {
                                    return "-" + params.data.rel_adjust_qty;
                                }
                            }
                        ]
                    }]
                };
                /*----------------------------------自定义按钮------------------------------------------*/
                /**
                 * 渲染一列的单元格：失效
                 * @returns {string}
                 */
                function loseEfficacy(params) {
                    var html;
                    if(params.data.intf_result == "E" && params.data.is_cancel != 2){
                        html = $('<a>', {
                            text: '失效',
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
                                            title: "是否确认失效？",
                                            okFun: function () {
                                                return requestApi.post({
                                                    classId: 'epm_urgent_order',
                                                    action: 'loseefficacy',
                                                    data: {
                                                        sa_out_bill_line_id : params.data.sa_out_bill_line_id,
                                                        urgent_order_line_id : params.data.urgent_order_line_id
                                                    }
                                                })
                                                .then(function (data) {
                                                    params.data.is_cancel = data.is_cancel;
                                                    $scope.gridOptions.api.refreshCells({
                                                        rowNodes: [params.node],
                                                        force: true,
                                                        columns: $scope.gridOptions.columnApi.getColumns(['is_cancel', 'loseefficacy', 'heavyhush'])
                                                    });
                                                });
                                            },
                                            okTitle: '失效成功'
                                    });
                                }
                            }
                        });
                    }else{
                        html = $('<span>');
                    }
                    return html[0];
                }

                /**
                 * 渲染一列的单元格：重推
                 * @returns {string}
                 */
                function actionHeavyPush(params) {
                    var html;
                    if(params.data.intf_result == "E" && params.data.is_cancel != 2){
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
                                                    classId: 'epm_urgent_order',
                                                    action: 'stock_reserve_apply',
                                                    data: {
                                                        epm_urgent_order_lines : [params.data]
                                                    }
                                                })
                                                .then(function (data) {
                                                    data.epm_urgent_order_lines;
                                                    var fields = ['intf_result', 'intf_info', 'valid_date', 'released_qty',
                                                        'pre_reserved_qty', 'reserved_qty'];
                                                     fields.forEach(function(field){
                                                        params.data[field] = data.epm_urgent_order_lines[0][field];
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

                 /**
                 * 渲染一列的单元格：库存查询
                 * @returns {string}
                 */
                function actionSeleteInventory(params) {
                    var html = $('<a>', {
                        text: '库存查询',
                        css: {
                            backgroundColor: '#298645',
                            display: 'inline-block',
                            height: '19px',
                            width: '70px',
                            borderRadius: '7px',
                            color : 'white'
                        },
                        on: {
                            click: function () {
                                if((userbean.userauth.base_stock_query) || (userbean.userid == 'admin') || (userbean.userauth.admins)){
                                    $scope.inventory.open({//打开模态框
                                        size: 'lg',
                                        controller: ['$scope',
                                            function ($modalScope) {
                                                $modalScope.title = "库存查询";
                                                $modalScope.before_line = params.data;
                                                $modalScope.Inventory = [];
                                                $modalScope.gridOptionInventory = {
                                                    columnDefs: [
                                                        {
                                                            type: '序号'
                                                        },
                                                        {
                                                            field: 'trading_company_code',
                                                            headerName: '生产基地编码'
                                                        },
                                                        {
                                                            field: 'trading_company_name',
                                                            headerName: '生产基地名称'
                                                        },
                                                        {
                                                            field: 'item_code',
                                                            headerName: '产品编码'
                                                        },
                                                        {
                                                            field: 'item_name',
                                                            headerName: '产品名称',
                                                            suppressAutoSize: true,
                                                            suppressSizeToFit: true
                                                        },
                                                        {
                                                            field: 'avaliable_qty',
                                                            headerName: '库存数量',
                                                            type : '数量'
                                                        },
                                                        {
                                                            field: 'spec',
                                                            headerName: '产品规格'
                                                        },
                                                        {
                                                            field: 'item_model',
                                                            headerName: '产品型号'
                                                        },
                                                        {
                                                            field: 'item_color',
                                                            headerName: '颜色'
                                                        },
                                                        {
                                                            field: 'uom_code',
                                                            headerName: '单位'
                                                        },
                                                        {
                                                            field: 'cubage',
                                                            headerName: '产品体积',
                                                            type : '体积'
                                                        },
                                                        {
                                                            field: 'division_id',
                                                            headerName: '事业部',
                                                            hcDictCode : 'epm.division'
                                                        },
                                                        {
                                                            field: 'entorgid',
                                                            headerName: '产品线',
                                                            hcDictCode : 'entorgid'
                                                        },
                                                        {
                                                            field: 'item_class_name',
                                                            headerName: '产品小类'
                                                        }
                                                    ],
                                                    hcEvents: {
                                                        cellDoubleClicked: function (args) {
                                                            if($scope.data.currItem.stat == 3 && $scope.form.editing){
                                                                params.data.delivery_base_id = args.data.trading_company_id
                                                                params.data.delivery_base_code = args.data.trading_company_code;
                                                                params.data.delivery_base_name = args.data.trading_company_name;
                                                                $scope.gridOptions.api.refreshCells({
                                                                    rowNodes: [params.node],
                                                                    force: true,//改变了值才进行刷新
                                                                    columns: $scope.gridOptions.columnApi.getColumns(['delivery_base_name'])
                                                                });
                                                                $modalScope.$close();
                                                            }
                                                        }  
                                                            
                                                    }
                                                };
                                                requestApi
                                                    .post({
                                                        classId: 'epm_urgent_order',
                                                        action: 'selectinventory',
                                                        data: {
                                                            item_code : $modalScope.before_line.item_code
                                                        }
                                                    })
                                                    .then(function (data) {
                                                        gridApi.execute($modalScope.gridOptionInventory, function () {
                                                            $modalScope.Inventory = data.epm_urgent_orders;
                                                            $modalScope.gridOptionInventory.hcApi.setRowData(
                                                                $modalScope.Inventory);
                                                        });
                                                    });
                                                    if($scope.data.currItem.stat == 3 && $scope.form.editing){
                                                        angular.extend($modalScope.footerRightButtons, {
                                                            ok: {
                                                                title: '确定',
                                                                click: function () {
                                                                    if($scope.data.currItem.stat == 3 && $scope.form.editing){
                                                                        var idx = $modalScope.gridOptionInventory.hcApi.getFocusedRowIndex();
                                                                        if (idx < 0) {
                                                                            swalApi.info('请选中带入的行');
                                                                        }else{
                                                                            params.data.delivery_base_id = $modalScope.Inventory[idx].trading_company_id
                                                                            params.data.delivery_base_code = $modalScope.Inventory[idx].trading_company_code;
                                                                            params.data.delivery_base_name = $modalScope.Inventory[idx].trading_company_name;
                                                                            $scope.gridOptions.api.refreshCells({
                                                                                rowNodes: [params.node],
                                                                                force: true,//改变了值才进行刷新
                                                                                columns: $scope.gridOptions.columnApi.getColumns(['delivery_base_name'])
                                                                            });
                                                                            $modalScope.$close();
                                                                        }
                                                                    }else{
                                                                        $modalScope.$close();
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    }
                                            }]
                                    })
                                }
                            }
                        }
                    });
                    return html[0];
                }

                /*----------------------------------通用查询-------------------------------------------*/
                //发货基地查询
                $scope.chooseDelivery = function (args) {
                    $scope.gridOptions.api.stopEditing();
                    $modal.openCommonSearch({
                        title:"发货基地",
                        classId:'epm_trading_company',
                        postData:{
                            /** 过滤不可用 */
                            search_flag : 3
                        },
                    })
                        .result//响应数据
                        .then(function(result){
                            args.data.delivery_base_id = result.trading_company_id;
                            args.data.delivery_base_code = result.trading_company_code;
                            args.data.delivery_base_name = result.trading_company_name;
                        })
                        .then(function () {
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptions.columnApi.getColumns(['delivery_base_name'])
                            });
                        });
                };
                
                /**
                 * 要货单号查询
                 */
                $scope.searchObjectSerach = {
                    postData: {
                        search_flag: 1,
                        is_urgent_order : 2
                    },
                    title:"要货单号",
                    gridOptions:{
                        columnDefs:[
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
                        if($scope.data.currItem.sa_out_bill_head_id != saOut.sa_out_bill_head_id){
                            ['sa_out_bill_head_id', 'sa_salebillno', 'date_invbill', 'customer_code', 'customer_name',
                            'trading_company_name', 'billing_unit_name', 'bill_type', 'order_stat', 'ext_sa_out_bill_head_id',
                            'in_date', 'contract_code', 'contract_name', 'project_code', 'project_name'].forEach(function (field) {
                                $scope.data.currItem[field] = saOut[field];
                            });
                            $scope.data.currItem.epm_urgent_order_lines = [];
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_order_lines);
                        }
                    },
                    beforeOk: function (result) {
                        return requestApi
                            .post({
                                classId: 'epm_urgent_order',
                                action: 'verifycode',
                                data: {
                                    sa_out_bill_head_id : result.sa_out_bill_head_id,
                                    urgent_order_id : $scope.data.currItem.urgent_order_id > 0 ? $scope.data.currItem.urgent_order_id : 0
                                }
                            })
                            .then(function (data) {
                                $scope.gridOptionsLineNo.hcApi.setRowData(data.epm_urgent_orders);
                                return result;
                            });
                    }
                };
                /*----------------------------------实现方法-------------------------------------------*/
                /**
                 * 计算金额
                 */
                function countMoney (num, money) {
                    return numberApi.mutiply(num, money);
                }

                /*----------------------------------网格按钮方法-------------------------------------------*/
                /**
                 * 新增产品行
                 */
                $scope.addItem = function (){
                    $scope.gridOptions.api.stopEditing();
                    if(!($scope.data.currItem.sa_out_bill_head_id > 0)){
                        swalApi.info('请先选择要货单号');
                        return;
                    }
                    $modal.openCommonSearch({
                        classId:'epm_urgent_order',
                        postData:function(){
                            return {
                                sa_out_bill_head_id : $scope.data.currItem.sa_out_bill_head_id,
                                epm_urgent_order_lines: $scope.gridOptions.hcApi.getRowData().map(function (line) {
                                    return {
                                        sa_out_bill_line_id: line.sa_out_bill_line_id
                                    };
                                })
                            }
                        },
                        //sqlWhere : sqlwhere,
                        action:'selecturgentitem',
                        title:"要货单行",
                        checkbox: true,
                        dataRelationName:'epm_urgent_order_lines',
                        gridOptions:{
                            columnDefs:[
                                {
                                    field: 'item_code',
                                    headerName: '产品编码'
                                },
                                {
                                    field: 'item_name',
                                    headerName: '产品名称'
                                },
                                {
                                    field: 'entorgid',
                                    headerName: '产品线',
                                    type : 'entorgid'
                                },
                                {
                                    field: 'model',
                                    headerName: '型号'
                                },
                                {
                                    field: 'uom_name',
                                    headerName: '单位'
                                },
                                {
                                    field: 'qty_bill',
                                    headerName: '订单数量',
                                    type : '数量'
                                },
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            result.forEach(function(value){
                                var obj = {};
                                ['item_id','item_code','item_name','entorgid', 'sa_out_bill_line_id',
                                'model','qty_bill','confirm_out_qty','not_shipped_qty', 'ext_sa_out_bill_line_id',
                                'discounted_price', 'uom_id', 'uom_code', 'uom_name'].forEach(function (field){
                                    obj[field] = value[field];
                                });
                                obj.urgent_qty = obj.not_shipped_qty;
                                obj.urgent_discounted_amount = countMoney (obj.urgent_qty, obj.discounted_price);
                                $scope.data.currItem.epm_urgent_order_lines.push(obj);
                            });
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_order_lines);
                        });
                };

                /**
                 * 删除产品行
                 */
                $scope.delItem = function (){
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_urgent_order_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_urgent_order_lines);
                    }
                };

				/*----------------------------------方法数据定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    //isDealer ();
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_urgent_order_lines = [];
                    bizData.epm_urgent_order_line_stocks = [];
                    if($scope.isNotDealerLog == true && $scope.data.currItem.stat != 5){
                        $scope.isNotDealerLog = false;
                    }
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_urgent_order_lines);
                    //是否未经销商登陆
                    if($scope.isNotDealerLog){
                        if (bizData.epm_urgent_order_line_stocks.length > 0){
                            $scope.stocks = {};
                            bizData.epm_urgent_order_lines.forEach(function(value){
                                $scope.stocks[value.urgent_order_line_id] = bizData.epm_urgent_order_line_stocks.filter(function(val){
                                    return val.urgent_order_line_id == value.urgent_order_line_id;
                                });
                            });
                            //默认选择第一行
                            $scope.gridOptions.hcApi.setFocusedCell(0);
                            $scope.gridOptionsLine.hcApi
                                .setRowData($scope.stocks[bizData.epm_urgent_order_lines[0].urgent_order_line_id]);
                        }else{
                            $scope.stocks = undefined;
                        }
                    }
                    /* 字段展示 */
                    if((userbean.userauth.base_stock_query) || (userbean.userid == 'admin') || (userbean.userauth.admins)){
                        $scope.gridOptions.columnApi.setColumnsVisible(['seleteinventory'],true);//为true则展示
                    }
                    $scope.gridOptions.columnApi.setColumnsVisible(['intf_result'],$scope.data.currItem.stat == 5);//为true则展示
                    $scope.data.currItem.epm_urgent_order_lines.some(function(value){
                        if (value.intf_result == 'E'){
                            $scope.gridOptions.columnApi.setColumnsVisible(['intf_info'],true);//为true则展示
                            return true;
                        }
                    });

                    //经销商判断
                    if($scope.isNotDealerLog == true && $scope.data.currItem.stat != 5){
                        $scope.isNotDealerLog = false;
                    }

                    //数据校验
                    if($scope.data.currItem.stat == 1){
                        requestApi
                            .post({
                                classId: 'epm_urgent_order',
                                action: 'verifycode',
                                data: {
                                    sa_out_bill_head_id : $scope.data.currItem.sa_out_bill_head_id,
                                    urgent_order_id : $scope.data.currItem.urgent_order_id > 0 ? $scope.data.currItem.urgent_order_id : 0
                                }
                            })
                            .then(function (data) {
                                $scope.gridOptionsLineNo.hcApi.setRowData(data.epm_urgent_orders);
                            });
                    }
                    /* 提货时间变更与插单记录展示 */
                    if($scope.data.currItem.stat == 5){//单据已审核
                        $scope.gridOptionspickTime.hcApi.setRowData(bizData.pickup_date_change_lists);
                        //定义一个数组
                        var arrAdjusts = [];
                        //插单记录
                        bizData.epm_urgent_adjust_singles.forEach(function(value){
                            value.color = 'single';
                            arrAdjusts.push(value);
                        });
                        //被插记录
                        bizData.epm_urgent_adjust_inserteds.forEach(function(value){
                            value.color = 'insert';
                            arrAdjusts.push(value);
                        });
                        $scope.gridOptionssingleRecord.hcApi.setRowData(arrAdjusts);
                        $scope.tabs.pickTime.title = '提货时间变更(' + bizData.pickup_date_change_lists.length + ')';
                        $scope.tabs.pickTime.hide = false;
                        $scope.tabs.singleRecord.title = '插单记录(' + arrAdjusts.length + ')';
                        $scope.tabs.singleRecord.hide = false;
                    }
                };

                /*----------------------------------按钮及标签定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return true;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    
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