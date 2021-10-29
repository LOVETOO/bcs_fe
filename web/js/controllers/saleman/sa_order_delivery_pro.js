
function sa_order_delivery_pro($scope, BasemanService, BaseService, $stateParams) {
    $scope.data = {};
    $scope.data.currItem = {"sa_order_delivery_head_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    //初始化数据
    $scope.billStats = [];
   //明细序号
    var lineMaxSeq = 0;


    $scope.terms = [{id:1,name:"上午"},{id:2,name:"下午"}];

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


    //明细表网格列属性
    $scope.lineColumns = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            width: 50
        },{
            name: "订单日期",
            id: "order_date",
            field: "order_date",
            width: 100,
            formatter:Slick.Formatters.Date
        }, {
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
            name: "工厂",
            id: "factory_code",
            field: "factory_code",
            width: 80
        }, {
            name: "库位",
            id: "warehouse_code",
            field: "warehouse_code",
            width: 80
        },{
            name: "MRP控制者",
            id: "mrp",
            field: "mrp",
            width: 100
        }, {
            name: "需求数量",
            id: "qty_sum",
            field: "qty_sum",
            width: 100
        }, {
            name: "标准交期(天)",
            id: "standard_days",
            field: "standard_days",
            width: 100
        }, {
            name: "最后交货日期",
            id: "delivery_date",
            field: "delivery_date",
            width: 120,
            formatter:replyDateFormatter
        }, {
            name: "回复状态",
            id: "reply_stat",
            field: "reply_stat",
            width: 100,
            dictcode:"reply_stat",
            formatter: Slick.Formatters.SelectOption
        },{
            name: "交货描述",
            id: "reply_note",
            field: "reply_note",
            width: 400
        }
    ];
    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.lineColumns
    });

    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);


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

    //词汇表单据状态
    $scope.billStats =[];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

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
                });
        } else {
            $scope.setNewItem();
        }
    };
    $scope.setNewItem = function () {
        //调用后台select方法查询详情
        var now = new Date();
        var hours = now.getHours();
        var term = hours >= 12 ? 2 : 1;
        var start_date,end_date;
        if(term==1){//上午
            start_date = now.Format("yyyy-MM-dd")+" 00:00";
            end_date = now.Format("yyyy-MM-dd")+" 12:00";
        }else {
            start_date = now.Format("yyyy-MM-dd")+" 12:00";
            end_date = now.Format("yyyy-MM-dd")+" 23:59";
        }
        $scope.data.currItem = {
            "order_date":now.Format("yyyy-MM-dd"),
            "start_date" : start_date,
            "end_date" : end_date,
            "stat":1,
            "term":term
        };
        BasemanService.RequestPost("sa_order_delivery_head", "getorderitems", JSON.stringify({"start_date": $scope.data.currItem.start_date,"end_date":$scope.data.currItem.end_date}))
            .then(function (data) {
                $scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads = data.order_items;
                $scope.data.currItem.sa_out_bill_lines = data.sa_out_bill_lines;
                setGridData($scope.lineGridView,$scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads);
            });
    }

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



    $scope.searchItems = function () {
        if($scope.data.currItem.term==1){//上午
            $scope.data.currItem.start_date = new Date($scope.data.currItem.order_date).Format("yyyy-MM-dd")+" 00:00";
            $scope.data.currItem.end_date = new Date($scope.data.currItem.order_date).Format("yyyy-MM-dd")+" 12:00";
        }else {
            $scope.data.currItem.start_date = new Date($scope.data.currItem.order_date).Format("yyyy-MM-dd")+" 12:00";
            $scope.data.currItem.end_date = new Date($scope.data.currItem.order_date).Format("yyyy-MM-dd")+" 23:59";
        }
        BasemanService.RequestPost("sa_order_delivery_head", "getorderitems", JSON.stringify({"start_date": $scope.data.currItem.start_date,"end_date":$scope.data.currItem.end_date}))
            .then(function (data) {
                $scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads = data.order_items;
                $scope.data.currItem.sa_out_bill_lines = data.sa_out_bill_lines;
                setGridData($scope.lineGridView,$scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads);
            });
    };


    $scope.searchItems1 = function () {
        BasemanService.RequestPost("sa_order_delivery_head", "getorderitems", JSON.stringify({"start_date": $scope.data.currItem.start_date,"end_date":$scope.data.currItem.end_date}))
            .then(function (data) {
                $scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads = data.order_items;
                $scope.data.currItem.sa_out_bill_lines = data.sa_out_bill_lines;
                setGridData($scope.lineGridView,$scope.data.currItem.sa_order_delivery_lineofsa_order_delivery_heads);
            });
    };


    /**
     * 保存数据
     */
    $scope.saveData = function () {
        var action = "insert";
        if ($scope.data.currItem.sa_order_delivery_head_id > 0) {
            action = "update";
        }
        BasemanService.RequestPost("sa_order_delivery_head", action, JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $scope.data.currItem.sa_order_delivery_head_id = data.sa_order_delivery_head_id;
                $scope.selectCurrenItem();
                BasemanService.notice("保存成功！","alert-success");
            });
    }

    var datetimepickerSetting = {
        language: 'ch',
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
    }
    $('#start_date').datetimepicker(datetimepickerSetting);
    $('#end_date').datetimepicker(datetimepickerSetting);

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

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();


}
//注册控制器
angular.module('inspinia')
    .controller('sa_order_delivery_pro', sa_order_delivery_pro);