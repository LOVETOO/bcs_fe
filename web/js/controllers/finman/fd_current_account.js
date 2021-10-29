/**
 * 往来对账
 */
function fd_current_account($scope, BasemanService, BaseService) {
    $scope.data = {};
    $scope.data.currItem = {};
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    $scope.data.currItem.start_date = year + '-' + month + '-01';//当月第一天
    $scope.data.currItem.end_date = now;
    $scope.data.searchData={};
    $scope.data.searchData.summary=2;

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "id",
            name: "序号",
            field: "id",
            width: 45
        },{
            id: "date",
            name: "日期",
            field: "date",
            width: 105
        },{
            id: "summary",
            name: "摘要",
            field: "summary",
            width: 130,
        },{
            id: "company_code",
            name: "公司代号",
            field: "company_code",
            width: 80,
        },{
            id: "company_name",
            name: "公司名称",
            field: "company_name",
            width: 180,
        },{
            id: "customer_code",
            name: "客户代码",
            field: "customer_code",
            width: 80,
        },{
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 200,
        },{
            id: "invoice_amt_debit",
            name: "发票金额(借)",
            field: "invoice_amt_debit",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "receivable_amt_credit",
            name: "收款金额(贷)",
            field: "receivable_amt_credit",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "debit",
            name: "各项扣款(借)",
            field: "debit",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "credit",
            name: "各项冲账(贷)",
            field: "credit",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "transfer_voucher_debit",
            name: "各项转账(借)",
            field: "transfer_voucher_debit",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "balance_debit",
            name: "余额(借)",
            field: "balance_debit",
            width: 110,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        }, {
            id: "memo",
            name: "备注",
            field: "memo",
            width: 150,
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);

    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {}

    /**
     * 网格双击事件
     */
    function dgDblClick(e, args) {}

    /**
     * 查询主表数据
     */
    $scope.searchAccount = function (postdata) {
        if ( $scope.data.currItem.customer_code == null ||  $scope.data.currItem.customer_code == undefined ||  $scope.data.currItem.customer_code == "") {
            BasemanService.swalWarning("提示", "请输入客户编码");
            return;
        }
        if ( $scope.data.currItem.start_date == null ||  $scope.data.currItem.start_date == undefined ||  $scope.data.currItem.start_date == "") {
            BasemanService.swalWarning("提示", "请输入开始日期");
            return;
        }
        if ( $scope.data.currItem.end_date == null ||  $scope.data.currItem.end_date == undefined ||  $scope.data.currItem.end_date == "") {
            BasemanService.swalWarning("提示", "请输入结束日期");
            return;
        }
        $scope.data.currItem.fd_fund_businesss = [];
        $scope.data.currItem.invoice_amt_debit_all = 0;
        $scope.data.currItem.receivable_amt_credit_all = 0;
        $scope.data.currItem.debit_all = 0;
        $scope.data.currItem.credit_all = 0;
        $scope.data.currItem.transfer_voucher_debit_all = 0;
        $scope.data.currItem.balance_debit_all = 0;
        $scope.data.currItem.searchflag = 3;
        BasemanService.RequestPost("fd_fund_business", "search", $scope.data.currItem)
            .then(function (data) {
                $.each(data.fd_fund_businesss, function (i, fd) {
                    fd.fddata = JSON.parse(fd.fddata);
                })
                $scope.data.currItem = data;
        });
    }

    //复选框选择
    $scope.check_summary = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.searchData.summary = 2;
        }else{
            $scope.data.searchData.summary = 1;
        }
    };

    /**
     * 加载网格数据
     */
    function loadGridData(gridView, datas) {
        gridView.setData([]);

        //var index = $scope.pageSize*($scope.currentPage-1);//分页
        var index = 0;
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].id = index + i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        gridView.render();
    }

    $scope.searchItem = function (type) {
        $scope.FrmInfo = {
            title: "客户",
            thead: [{
                name: "客户编码",
                code: "customer_code"
            }, {
                name: "客户名称",
                code: "customer_name"
            }],
            classid: "customer_org",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "customer_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                search_flag: 2
            },
            searchlist: ["customer_code", "customer_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.customer_code = result.customer_code;
            $scope.data.currItem.customer_name = result.customer_name;
        });
    }

    //加载时间插件
    $('#startDate').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month'//最小的选择视图-选择最小单位:day
        //startDate: new Date()
    });

    //加载时间插件
    $('#endDate').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month'//最小的选择视图-选择最小单位:day
        //startDate: new Date()
    });

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    //BaseService.pageGridInit($scope);
    
    //自动停止加载动画
    IncRequestCount("post");
    DecRequestCount();

}
//注册控制器
angular.module('inspinia')
    .controller('fd_current_account', fd_current_account);