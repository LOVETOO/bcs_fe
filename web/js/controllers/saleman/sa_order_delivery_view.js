
function sa_order_delivery_view($scope, BasemanService, BaseService, $stateParams) {
    $scope.data = {};
    $scope.data.currItem = {"sa_order_delivery_head_id": $stateParams.id};
    $scope.data.addCurrItem = {};
   //明细序号
    var lineMaxSeq = 0;
    $scope.order_clerk = userbean.hasRole('order_clerk', true);
    // 添加按钮
    var editLineButtons1 = function (row, cell, value, columnDef, dataContext) {
         return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };

    //网格设置
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight:false
    };

    function isImport(row, cell, value, columnDef, dataContext) {
        var str = "";
        if(value==2){
            str="已写入";
        }else if((value==1)){
            str="未写入";
        }else if(value==3){
            str="已变更";
        }
        return str;
    }

    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 50
        }, {
            name: "订单日期",
            id: "order_date",
            field: "order_date",
            width: 85,
            formatter:Slick.Formatters.Date
        }, {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 85
        },{
            name: "工厂",
            id: "factory_code",
            field: "factory_code",
            width: 55
        }, {
            name: "库位",
            id: "warehouse_code",
            field: "warehouse_code",
            width: 55
        },{
            name: "MRP控制者",
            id: "mrp",
            field: "mrp",
            width: 60
        }, {
            name: "需求数量",
            id: "qty_sum",
            field: "qty_sum",
            width: 80
        }, {
            name: "标准交期(天)",
            id: "standard_days",
            field: "standard_days",
            width: 100
        }, {
            name: "交货日期",
            id: "delivery_date",
            field: "delivery_date",
            width: 100,
            formatter:replyDateFormatter
        }, {
            name: "回复状态",
            id: "reply_stat",
            field: "reply_stat",
            width: 85,
            dictcode:"reply_stat",
            formatter: Slick.Formatters.SelectOption
        },{
            name: "交货描述",
            id: "reply_note",
            field: "reply_note",
            width: 400
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        }
    ];
    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.lineColumns
    });

    //明细表网格列属性
    $scope.lineColumns1 = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 50
        },
        {
            name: "操作",
            width: 60,
            formatter: editLineButtons1
        },{
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 100
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },{
            name: "交货数量",
            id: "delivery_qty",
            field: "delivery_qty",
            width: 100,
            editor:Slick.Editors.Text
        },{
            name: "基地交货日期",
            id: "inv_date",
            field: "inv_date",
            width: 150,
            formatter:Slick.Formatters.Date,
            editor:Slick.Editors.Text
        },{
            name: "交货日期",
            id: "delivery_date",
            field: "delivery_date",
            width: 120,
            formatter:Slick.Formatters.Date,
            editor:Slick.Editors.Text
        },{
            name: "回复备注",
            id: "note",
            field: "note",
            width: 200,
            editor:Slick.Editors.Text
        }
    ];

    //明细表网格列属性
    $scope.lineColumns2 = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 50
        },{
            name: "订货单号",
            id: "sa_salebillno",
            field: "sa_salebillno",
            width: 120
        },{
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 85,
            formatter:importStat
        },{
            name: "订货数量",
            id: "qty_bill",
            field: "qty_bill",
            width: 80
        },{
            name: "确认状态",
            id: "confirm_stat",
            field: "confirm_stat",
            dictcode:"confirm_stat",
            formatter:Slick.Formatters.SelectOption,
            width: 80
        },{
            name: "确认备注",
            id: "note",
            field: "note",
            width: 600
        },{
            name: "订单类型",
            id: "bill_type",
            field: "bill_type",
            width: 80,
            formatter: Slick.Formatters.SelectOption,
            dictcode:"order_type"

        },{
            name: "客户编码",
            id: "customer_code",
            field: "customer_code",
            width: 80
        },{
            name: "客户名称",
            id: "customer_name",
            field: "customer_name",
            width: 150
        },{
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        }, {
            name: "写入SAP",
            id: "is_import",
            field: "is_import",
            width: 80,
            formatter: isImport
        }
    ];

    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.lineColumns2
    });

    //明细表网格列属性
    $scope.lineColumns3 = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 50
        }];
    if($scope.order_clerk){
        $scope.lineColumns3.push(
            {
                name: "操作",
                width: 60,
                formatter: editLineButtons1
            }
        );
    }
    $scope.lineColumns3.push(
        {
            name: "基地交期",
            id: "inv_date",
            field: "inv_date",
            width: 100,
            formatter:Slick.Formatters.Date
        },
        {
            name: "交货日期",
            id: "assign_date",
            field: "assign_date",
            width: 100,
            formatter:Slick.Formatters.Date
        },{
            name: "交货数量",
            id: "assign_qty",
            field: "assign_qty",
            width: 100,
            editor:Slick.Editors.Text
        },{
            name: "备注",
            id: "note",
            field: "note",
            width: 200,
            editor:Slick.Editors.Text
        }
    );

    //明细网格
    var checkboxSelector = new Slick.CheckboxSelectColumn({
        cssClass: "slick-cell-checkboxsel"
    });
    $scope.lineColumns2.unshift(checkboxSelector.getColumnDefinition());


    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);

    $scope.lineGridView1 = new Slick.Grid("#lineViewGrid1", [], $scope.lineColumns1, $scope.lineOptions);

    $scope.lineGridView2 = new Slick.Grid("#lineViewGrid2", [], $scope.lineColumns2, $scope.lineOptions);

    $scope.lineGridView3 = new Slick.Grid("#lineViewGrid3", [], $scope.lineColumns3, $scope.lineOptions);

    $scope.lineGridView2.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
    $scope.lineGridView2.registerPlugin(checkboxSelector);

    //细表-绑定点击事件
    $scope.lineGridView.onDblClick.subscribe(gerReply);

    $scope.lineGridView1.onClick.subscribe(deleteReply);
    $scope.lineGridView2.onClick.subscribe(getconfirm);
    $scope.lineGridView3.onClick.subscribe(dgOnClick3);



    function gerReply(e, args) {
        getReplys(args);
        $("#detailModal1").modal();
        e.stopImmediatePropagation();
    };


    function getconfirm(e, args) {
        getconfirms(args);
        e.stopImmediatePropagation();
    };



    function getReplys(args){
        var index = args.row;
        var row = args.grid.getDataItem(index);
        $scope.rowData = row;
        BasemanService.RequestPost("sa_order_delivery_head", "getreply", JSON.stringify({"sa_order_delivery_line_id":row.sa_order_delivery_line_id}))
            .then(function (data) {
                $scope.data.currItem.reply_items = data.reply_items;
                setGridData($scope.lineGridView1,$scope.data.currItem.reply_items);
            });
    };

    function getconfirms(args){
        var index = args.row;
        var row = args.grid.getDataItem(index);
        $scope.rowData2 = row;
        BasemanService.RequestPost("sa_order_delivery_head", "getconfirms", JSON.stringify({"sa_out_bill_line_id":row.sa_out_bill_line_id}))
            .then(function (data) {
                $scope.data.currItem.confirm_items = data.confirm_items;
                setGridData($scope.lineGridView3,$scope.data.currItem.confirm_items);
            });
    };


    function dateFormatter(row, cell, value, column, rowData) {
        if (angular.isDefined(value)) {
            var result = Slick.Formatters.Date(row, cell, value, column, rowData);
            if (angular.isDefined(result)) return result;
            return value;
        }
        return '';
    }

    function replyDateFormatter(row, cell, value, column, rowData) {
        var color = 'black';
        var order_date = rowData.order_date;
        var delivery_date = rowData.delivery_date;
        if(delivery_date&&delivery_date.length>0){
            var d1 = new Date(order_date);
            var d2 = new Date(delivery_date);
            if((parseInt(d2-d1)/3600000/24)>rowData.standard_days){
                color = 'red';
            }
        }
        return '<span style="color:' + color + ';">'
            + dateFormatter(row, cell, value, column, rowData)
            + '</span>';
    }

    function importStat(row, cell, value, column, rowData) {
        var color = 'black';
        var is_import = rowData.is_import;
        if(is_import == 2){
           color = 'red';
        }
        return '<span style="color:' + color + ';">'+value + '</span>';
    }

    /**
     * 网格单击事件
     */
    function deleteReply(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("delbtn")) {
            BasemanService.swalWarning("删除", "确定要删除吗？", function (bool) {
                if (bool) {
                    var dg = $scope.lineGridView1;
                    dg.getData().splice(args.row, 1);
                    dg.invalidateAllRows();
                    dg.render();
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }
    };

    /**
     * 网格单击事件
     */
    function dgOnClick3(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("delbtn")) {
            BasemanService.swalWarning("删除", "确定要删除吗？", function (bool) {
                if (bool) {
                    var dg = $scope.lineGridView3;
                    dg.getData().splice(args.row, 1);
                    dg.invalidateAllRows();
                    dg.render();
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }
    };


    /**
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        if ($scope.data.currItem.sa_order_delivery_head_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sa_order_delivery_head", "select", JSON.stringify({"sa_order_delivery_head_id": $scope.data.currItem.sa_order_delivery_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView,$scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads);
                    setGridData($scope.lineGridView2,$scope.data.currItem.sa_out_bill_lines);
                });
        }
    };

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        lineMaxSeq = 0;
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                lineMaxSeq++;
                datas[i].seq = lineMaxSeq;
            }
        }
        //设置数据
        gridView.setData(datas);
        gridView.render();
    }

    $scope.addReply = function () {
        var newRow = {
            item_id:$scope.rowData.item_id,
            item_code:$scope.rowData.item_code,
            item_name:$scope.rowData.item_name,
            delivery_qty:$scope.rowData.qty_sum,
            inv_date:new Date().Format("yyyy-MM-dd"),
            delivery_date:new Date().Format("yyyy-MM-dd"),
            sa_order_delivery_line_id:$scope.rowData.sa_order_delivery_line_id
        };
        $scope.data.currItem.reply_items.push(newRow);
        setGridData($scope.lineGridView1,$scope.data.currItem.reply_items);
    }

    $scope.saveReply = function () {
        if ($scope.lineGridView1.getCellEditor() != undefined) {
            $scope.lineGridView1.getCellEditor().commitChanges();
        }
        $scope.data.currItem.sa_order_delivery_line_id = $scope.rowData.sa_order_delivery_line_id;
        BasemanService.RequestPost("sa_order_delivery_head", "insertreply", JSON.stringify($scope.data.currItem))
            .then(function (data) {
                BasemanService.notice("保存成功！","alert-success");
                BasemanService.RequestPost("sa_order_delivery_head", "select", JSON.stringify({"sa_order_delivery_head_id": $scope.data.currItem.sa_order_delivery_head_id}))
                    .then(function (data) {
                        $scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads = data.sa_order_delivery_lineofsa_order_delivery_heads;
                        setGridData($scope.lineGridView,$scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads);
                        $("#detailModal1").modal('hide');
                    });
            });
    }

    $scope.addConfirm = function () {
        if(!$scope.rowData2){
            BasemanService.notice("请选择一行订单明细","alert-success");
            return;
        }

        BasemanService.RequestPost("sa_order_delivery_head", "getreply", JSON.stringify({"sa_order_delivery_line_id": $scope.rowData2.sa_order_delivery_line_id}))
            .then(function (data) {
                $scope.data.currItem.reply_items = data.reply_items;
                if($scope.data.currItem.reply_items.length>0){
                    $scope.data.currItem.confirm_items=[];
                    $scope.data.currItem.reply_items.forEach(function (reply) {
                        var newRow = {
                            item_id:$scope.rowData2.item_id,
                            item_code:$scope.rowData2.item_code,
                            item_name:$scope.rowData2.item_name,
                            assign_qty:reply.delivery_qty,
                            assign_date:reply.delivery_date,
                            inv_date:reply.inv_date,
                            sa_out_bill_line_id:$scope.rowData2.sa_out_bill_line_id,
                            reply_id:reply.reply_id
                        };
                        $scope.data.currItem.confirm_items.push(newRow);
                    });
                    setGridData($scope.lineGridView3,$scope.data.currItem.confirm_items);
                }
            });
    }

    $scope.saveConfirm = function () {
        if ($scope.lineGridView3.getCellEditor() != undefined) {
            $scope.lineGridView3.getCellEditor().commitChanges();
        }
        $scope.data.currItem.sa_out_bill_line_id = $scope.rowData2.sa_out_bill_line_id;
        BasemanService.RequestPost("sa_order_delivery_head", "insertconfirm", JSON.stringify($scope.data.currItem))
            .then(function (data) {
                BasemanService.notice("保存成功！","alert-success");
                BasemanService.RequestPost("sa_order_delivery_head", "getorderlines", JSON.stringify({"sa_order_delivery_head_id": $scope.data.currItem.sa_order_delivery_head_id}))
                    .then(function (data) {
                        $scope.data.currItem.order_items = data.sa_out_bill_lines;
                        setGridData($scope.lineGridView2,$scope.data.currItem.order_items);
                    });
            });
    }

    $scope.importConfirm = function () {
        var settleRow = $scope.lineGridView2.getSelectedRows();
        if(settleRow.length == 0){
            BasemanService.notice("请选择需要确认的订单列表", "alert-success" );
            return;
        };
        $scope.data.currItem.datas = [];
        for(var i = 0; i < settleRow.length; i++) {
            $scope.data.currItem.datas.push($scope.lineGridView2.getDataItem(settleRow[i]));
        }
        BasemanService.RequestPost("sa_order_delivery_head", "importconfirm", $scope.data.currItem)
            .then(function (data) {
                BasemanService.notice("操作成功！", "alert-success" );
                $scope.selectCurrenItem();
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



}
//注册控制器
angular.module('inspinia')
    .controller('sa_order_delivery_view', sa_order_delivery_view);