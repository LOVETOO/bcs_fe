/**费用申请与报销进度查询界面js*/
function fin_fee_apply_bx_search($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {

    //设置标题
    $scope.headername = "费用申请与报销进度查询";

    //预留存储
    $scope.data = {};


    $('#create_time_stat_apply').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    $('#create_time_end_apply').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    $('#create_time_stat_bx').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    $('#create_time_end_bx').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });


    //定义网格字段
    $scope.viewColumns = [
        {
            name: "序号",
            id: "uid",
            field: "uid",
            width: 45,
            cssClass:"uid",
        }, {
            id: "fee_apply_no",
            name: "费用申请单号",
            field: "fee_apply_no",
            width: 140,
            cssClass: "apply_no",
        }, {
            id: "bx_no",
            name: "费用报销单号",
            field: "bx_no",
            width: 120
        }, {
            id: "create_time",
            name: "申请单日期",
            field: "create_time",
            width: 155
        }, {
            id: "bx_time",
            name: "报销单日期",
            field: "bx_time",
            width: 155
        }, {
            id: "org_name",
            name: "申请部门",
            field: "org_name",
            width: 110,
        }, {
            id: "fee_org_name",
            name: "费用承担部门",
            field: "fee_org_name",
            width: 110,
        }, {
            id: "chap_name",
            name: "申请人",
            field: "chap_name",
            width: 90,
        }, {
            id: "bud_type_name",
            name: "预算类别",
            field: "bud_type_name",
            width: 125,
        }, {
            id: "fee_name",
            name: "费用项目",
            field: "fee_name",
            width: 100,
        }, {
            id: "allow_amt",
            name: "申请批准金额",
            field: "allow_amt",
            width: 130,
            cssClass:"amt"
        }, {
            id: "finish_bx_amt",
            name: "已报销金额",
            field: "finish_bx_amt",
            width: 130,
            cssClass:"amt"
        }, {
            id: "pay_amt",
            name: "支付金额",
            field: "pay_amt",
            width: 130,
            cssClass:"amt"
        }, {
            id: "pay_date",
            name: "支付日期",
            field: "pay_date",
            width: 100,
        }, {
            id: "bank_code",
            name: "开户名称",
            field: "bank_code",
            width: 100,
        }, {
            id: "bank_name",
            name: "银行名称",
            field: "bank_name",
            width: 100,
        }, {
            id: "bank_accno",
            name: "银行账号",
            field: "bank_accno",
            width: 160,
        }, {
            id: "purpose",
            name: "费用用途",
            field: "purpose",
            width: 120,
        }, {
            id: "note",
            name: "申请备注",
            field: "note",
            width: 100,
        },
    ];
    //网格设置
    $scope.viewOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
    };


    //初始化表格
    $scope.viewGrid = new Slick.Grid("#viewGrid", [], $scope.viewColumns, $scope.viewOptions);


    //申请部门查询
    $scope.deptSearch = function () {
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门名称",
                code: "dept_name"
            }, {
                name: "部门编码",
                code: "dept_code"
            }, {
                name: "备注",
                code: "remark"
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: "300"
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.org_code = result.dept_code;
            $scope.data.org_name = result.dept_name;
            $scope.data.org_id = result.dept_id;
        });
    };

    //申请单号查询
    $scope.applynoSearch = function () {
        $scope.FrmInfo = {
            title: "申请单号查询",
            thead: [{
                name: "申请单号",
                code: "fee_apply_no"
            }, {
                name: "申请总额",
                code: "total_apply_amt"
            }, {
                name: "批准总额",
                code: "total_allow_amt"
            }, {
                name: "预算类别",
                code: "bud_type_name"
            }, {
                name: "申请部门",
                code: "org_name"
            }],
            classid: "fin_fee_apply_header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_fee_apply_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.fee_apply_no = result.fee_apply_no;
        });
    };

    //报销单号查询
    $scope.bxnoSearch = function () {
        $scope.FrmInfo = {
            title: "报销单号查询",
            thead: [{
                name: "报销单号",
                code: "bx_no"
            }, {
                name: "申请总额",
                code: "total_apply_amt"
            }, {
                name: "批准总额",
                code: "total_allow_amt"
            }, {
                name: "预算类别",
                code: "bud_type_name"
            }, {
                name: "申请部门",
                code: "org_name"
            }],
            classid: "fin_fee_bx_header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_fee_bx_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.bx_no = result.bx_no;
        });
    };

    //申请人查询
    $scope.chapSearch = function () {
        $scope.FrmInfo = {
            title: "申请人查询",
            thead: [{
                name: "申请人",
                code: "chap_name"
            }, {
                name: "申请总额",
                code: "total_apply_amt"
            }, {
                name: "批准总额",
                code: "total_allow_amt"
            }, {
                name: "预算类别",
                code: "bud_type_name"
            }, {
                name: "申请部门",
                code: "org_name"
            }],
            classid: "fin_fee_apply_header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_fee_apply_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.chap_name = result.chap_name;
        });
    };


    //查询
    $('#searchBtn').click(function () {
        $scope.searchData();
    });

    /***
     * 初始查询 分页
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            postdata = {
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0",
                flag: 3
            };
            postdata = $.extend({}, postdata, $scope.data);
        } else {
            postdata.flag = 3;
            postdata = $.extend({}, postdata, $scope.data);
        }
        BasemanService.RequestPost("fin_fee_apply_bx_search", "apply_bx_search", postdata)
            .then(function (data) {
                $scope.viewGrid.setData([]);
                var dataProvider = new TotalsDataProvider(data.fin_fee_apply_bx_searchs, $scope.viewColumns);
                $scope.viewGrid.setData(dataProvider);
                $scope.viewGrid.render();

                BaseService.pageInfoOp($scope, data.pagination);
            });
    };

    function insMoney(num) {
        var i = 2;
        return HczyCommon.formatMoney(num, i);
    }


    function TotalsDataProvider(data, columns) {
        var totals = {};
        var totalsMetadata = {
            // Style the totals row differently.
            cssClasses: "del",
            columns: {}
        };
        // Make the totals not editable.
        for (var i = 0; i < columns.length; i++) {
            totalsMetadata.columns[i] = {editor: null};
        }
        this.getLength = function () {
            return data.length;
        };
        this.getItem = function (index) {
            return (index < data.length) ? data[index] : data[index];
        };
        this.updateTotals = function () {
            var arr = [];//记录重复的单号
            var columnIdx = columns.length;
            while (columnIdx--) {
                if (
                    columns[columnIdx].id == "allow_amt" ||
                    columns[columnIdx].id == "finish_bx_amt" ||
                    columns[columnIdx].id == "pay_amt"
                ) {
                    var columnId = columns[columnIdx].id;
                    var i = data.length;
                    while (i--) {
                        //数值添加千分号
                        data[i][columnId] = insMoney(parseFloat(data[i][columnId]) || 0);
                    }
                } else if (columns[columnIdx].id == "fee_apply_no") {
                    var columnId = columns[columnIdx].id;
                    var i = data.length;
                    while (i--) {
                        if (i >= 1) {
                            if (data[i][columnId] == data[i - 1][columnId])
                                arr.push(i);
                        }
                    }
                }
            }
            //删除重复申请单
            for (var x = 0; x < arr.length; x++) {
                data[arr[x]].fee_apply_no = "";
                data[arr[x]-1].del = 1;
            }
            //序号
            for (var x = 0,y=1; x <  data.length; x++) {
                if(data[x].fee_apply_no!=""){
                    data[x].uid=y;
                    y++;
                }else{
                    data[x].uid="";
                }
            }
        };
        this.getItemMetadata = function (index) {
            if (data[index].del==1) {
                return totalsMetadata;
            } else {
                return null;
            }
        };
        this.updateTotals();
    }

    BasemanService.initGird();

    BaseService.pageGridInit($scope);
    BasemanService.ReadonlyGrid($scope.viewGrid);

}
//注册控制器
angular.module('inspinia')
    .controller('fin_fee_apply_bx_search', fin_fee_apply_bx_search);

