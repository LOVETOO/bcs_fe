/**
 * zengjinhua
 * 2019/11/19
 * 提货时间变更
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'numberApi', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, numberApi) {

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
                    pickup_date_change_lists:[],
                    pickup_date_change_list_lines:[]
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
                                arrId.push(params.data.urgent_order_line_id);
                            }else{
                                $scope.selectedRowCount--;
                                arrId = arrId.filter(function (val){
                                    return val != params.data.urgent_order_line_id;
                                });
                            }
                        },
                        modelUpdated: function (){
                            $scope.selectedRowCount = 0;
                        }
                    },
                    columnDefs:[{
                        field:'checkboxs',
                        type : '复选框',
                        headerCheckboxSelection : false       
                    },{
                        type:'序号'
                    },{
                        field:'item_code',
                        headerName:'产品编码'
                    },{
                        field:'item_name',
                        headerName:'产品名称'
                    },{
                        field:'uom_code',
                        headerName:'单位'
                    },{
                        field:'qty_bill',
                        headerName:'订单数量',
                        type : '数量'
                    },{
                        field:'urgent_qty',
                        headerName:'紧急要货数量',
                        type : '数量'
                    },{
                        field:'delivery_base_name',
                        headerName:'发货基地'
                    },{
                        field:'old_pick_up_date',
                        headerName:'原提货时间',
                        type : '日期'
                    },{
                        field:'new_pick_up_date',
                        headerName:'新提货时间',
                        type : '日期',
                        editable : function (args){
                            return args.node.selected;
                        },
                        onCellValueChanged: function (args) {
                            if(numberApi.sub(new Date().getTime(),24*60*60*1000) 
                                > new Date(args.data.new_pick_up_date).getTime()){
                                swalApi.error('新提货时间需大于等于当前日期');
                                args.data.new_pick_up_date = undefined;
                                $scope.gridOptions.api.refreshCells({
                                    rowNodes: [args.node],
                                    columns: $scope.gridOptions.columnApi.getColumns(['new_pick_up_date'])
                                });
                            }
                        }                        
                    },{
                        field:'reserved_qty',
                        headerName:'当前保留数量',
                        type : '数量'
                    },{
                        field:'pre_reserved_qty',
                        headerName:'当前预占数量',
                        type : '数量'
                    },{
                        field:'released_qty',
                        headerName:'当前已释放数量',
                        type : '数量'
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
                    }]
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
                        headerName:'接口状态'
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
                    action:'selectsaoutbill',
                    title:"要货订单",
                    dataRelationName:'pickup_date_change_lists',
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
                                field: 'urgent_order_billno',
					            headerName: '紧急要货单号'
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
                    beforeOk : function (result) {
                        return requestApi
                            .post({
                                classId: 'pickup_date_change_list',
                                action: 'verifydata',
                                data: {
                                    sa_out_bill_head_id: result.sa_out_bill_head_id
                                }
                            })
                            .then(function (data) {
                                if (data.pickup_date_change_lists.length > 0) {
                                    $scope.data.currItem.pickup_date_change_lists = data.pickup_date_change_lists;
                                    $scope.data.currItem.pickup_date_change_list_lines = data.pickup_date_change_list_lines;
                                    return result;
                                }else{
                                    swalApi.error('该订单号不存在可发起提货时间变更的紧急要货产品行数据。');
                                    return false;
                                }
                            });
                    },
                    afterOk: function (pickup_date) {
                        $scope.data.currItem.sa_salebillno = pickup_date.sa_salebillno;
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.pickup_date_change_lists);
                        $scope.gridOptions_list.hcApi.setRowData($scope.data.currItem.pickup_date_change_list_lines);
                    }
                };
                
                /**
                 * 更新时间
                 */
                $scope.updatePickTime = function (){
                    $scope.gridOptions.api.stopEditing();
                    var row = $scope.gridOptions.api.getSelectedRows();
                     //定义一个参数
                    var isPass = 1;
                    //定义一个数据盒子
                    var arr = [];
                    var invalidDate = [];
                    row.forEach(function(val,index){
                        if(val.new_pick_up_date == undefined || val.new_pick_up_date == null || val.new_pick_up_date == ""){
                            arr.push(index + 1);
                        }
                    });
                    //判断事业部
                    if (arr.length) {
                        invalidDate.push(
                            '',
                            '新提货时间不能为空，以下行不合法：',
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
                                classId: 'pickup_date_change_list',
                                action: 'pushchangedate',
                                data: {
                                    pickup_date_change_lists: row
                                }
                            })
                            .then(function (data) {
                                var arrIndex = [];
                                $scope.data.currItem.pickup_date_change_lists.forEach(function(val, index){
                                    data.pickup_date_change_lists.some(function(value){
                                        if(val.urgent_order_line_id == value.urgent_order_line_id){
                                            ['process_messag', 'proccuse_status', 'old_pick_up_date',
                                             'released_qty', 'pre_reserved_qty', 'reserved_qty'].forEach(function(field){
                                                val[field] = value[field];
                                             });
                                            arrId.some(function(id){
                                                if(id == val.urgent_order_line_id){
                                                    arrIndex.push(index);
                                                    return true;
                                                }
                                            });
                                            return true;
                                        }
                                    });
                                });
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.pickup_date_change_lists);
                                arrId = [];
                                arrIndex.forEach(function(idx){
                                    $scope.gridOptions.hcApi.getNodeOfRowIndex(idx).setSelected(true);
                                });
                                if(data.sqlwhere.length){
                                    swalApi.error(data.sqlwhere);
                                }
                            });
                    }
                };

            }
        ];
        return controllerApi.controller({
            module:module,
            controller:controller
        });

    });