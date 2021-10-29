/**这是预算使用明细查询界面js*/
function fin_bud_list($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {

    //设置标题
    $scope.headername = "预算使用明细查询";

    //预留存储
    $scope.data = {};
    $scope.modal = {};
    var gridData = [];

    //页面数据绑定说明
    //申请部门dept_code  dept_name
    //预算类别bud_type_code  bud_type_name

    //费用部门fee_org_code  fee_org_name
    //品牌crm_entid  产品线item_type_name

    //预算年月year_month_start  year_month_end
    //制单时间bill_start_date  bill_end_date

    //费用项目fee_code  fee_name
    //费用对象object_name
    $scope.$watch("data.dept_code", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.dept_id = "";
            $scope.data.dept_name = "";
        }
    });
    $scope.$watch("data.dept_name", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.dept_id = "";
            $scope.data.dept_code = "";
        }
    });

    $scope.$watch("data.bud_type_code", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.bud_type_id = "";
            $scope.data.bud_type_name = "";
            $scope.object_ids=[];
            $scope.object_id="";
        }
    });
    $scope.$watch("data.bud_type_name", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.bud_type_id = "";
            $scope.data.bud_type_code = "";
            $scope.object_ids=[];
            $scope.object_id="";
        }
    });

    $scope.$watch("data.fee_org_code", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.fee_org_id = "";
            $scope.data.fee_org_name = "";
        }
    });
    $scope.$watch("data.fee_org_name", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.fee_org_id = "";
            $scope.data.fee_org_code = "";
        }
    });

    $scope.$watch("data.fee_code", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.fee_id = "";
            $scope.data.fee_name = "";
        }
    });
    $scope.$watch("data.fee_name", function (newVal, oldVal) {
        if (newVal == "" && oldVal != "") {
            $scope.data.fee_id = "";
            $scope.data.fee_code = "";
        }
    });

    $scope.data.dept_id = "";
    $scope.data.bud_type_id = "";
    $scope.data.fee_org_id = "";
    $scope.data.year_month_start = "";
    $scope.data.year_month_end = "";
    $scope.data.bill_start_date = "";
    $scope.data.bill_end_date = "";
    $scope.data.object_id = "";
    // $scope.data.crm_entid="";

    $scope.object_ids = [
        //费用对象
    ];

    //品牌
    /*$scope.crm_entids = [];
     // $scope.data.crm_entid = '';
     BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "crm_entid"})
     .then(function (data) {
     $scope.crm_entids = data.dicts;
     //默认选择第一个品牌
     $scope.data.crm_entid = data.dicts[0].id;
     });*/

    //查询预算期间类别
    $scope.period_types = [];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "period_type"})
        .then(function (data) {
            $.each(data.dicts,function (i,item) {
                $scope.period_types.push(
                    {
                        value:item.dictvalue,
                        desc:item.dictname
                    }
                );
            });
        });

    //单据状态
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "wfstat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            var billStats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                billStats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            //修改bug:当排序为第一个(0)时不会执行
            if ($scope.getIndexByField('viewColumns', 'stat') !== false) {
                $scope.viewColumns[$scope.getIndexByField('viewColumns', 'stat')].options = billStats;
                $scope.viewGrid.setColumns($scope.viewColumns);

            }
        });
    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
            }
        }
        return false;
    };


    /*var dates = $.fn.datepicker.dates = {
     cn: {
     days: ["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
     daysShort: ["日", "一", "二", "三", "四", "五", "六", "七"],
     daysMin: ["日", "一", "二", "三", "四", "五", "六", "七"],
     months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
     monthsShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
     today: "今天",
     clear: "清除"
     }
     };
     var defaults = $.fn.datepicker.defaults = {
     autoclose: false,
     beforeShowDay: $.noop,
     calendarWeeks: false,
     clearBtn: false,
     daysOfWeekDisabled: [],
     endDate: Infinity,
     forceParse: true,
     format: 'mm/dd/yyyy',
     keyboardNavigation: true,
     language: 'cn',
     minViewMode: 0,
     orientation: "auto",
     rtl: false,
     startDate: -Infinity,
     startView: 0,
     todayBtn: false,
     todayHighlight: false,
     weekStart: 0
     };*/

    $('#year_month_start').datetimepicker({
        format: 'yyyy-mm',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    $('#year_month_end').datetimepicker({
        format: 'yyyy-mm',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    $('#bill_start_date').datetimepicker({
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
    $('#bill_end_date').datetimepicker({
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
            cssClass: "uid"
        }, {
            id: "bill_type",
            name: "单据类型",
            field: "bill_type",
            width: 100,
        }, {
            id: "stat",
            name: "单据状态",
            field: "stat",
            editable: true,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            options: [
                /*{value: "1", desc: "制单"},
                 {value: "2", desc: "提交"},
                 {value: "3", desc: "已启动"},
                 {value: "4", desc: "审核中"},
                 {value: "5", desc: "已审核"},
                 {value: "6", desc: "已驳回"},
                 {value: "96", desc: "已取消"},
                 {value: "97", desc: "暂停"},
                 {value: "98", desc: "已结案"},
                 {value: "99", desc: "关闭"},*/
            ],
            formatter: Slick.Formatters.SelectOption,
        }, {
            id: "bill_no",
            name: "单据号",
            field: "bill_no",
            width: 140
        }, {
            id: "bud_year",
            name: "年度",
            field: "bud_year",
            width: 55,
        }, {
            id: "month",
            name: "月度",
            field: "month",
            width: 55,
        }, {
            id: "dept_name",
            name: "申请部门",
            field: "dept_name",
            width: 100,
        }, {
            id: "fee_org_name",
            name: "费用承担部门",
            field: "fee_org_name",
            width: 100,
        }, {
            id: "bud_type_name",
            name: "预算类别",
            field: "bud_type_name",
            width: 130,
        }, {
            id: "crm_entld",
            name: "品类",
            field: "crm_entld",
            width: 100,
        }, {
            id: "item_type_id",
            name: "产品组织",
            field: "item_type_id",
            width: 100,
        }, {
            id: "object_name",
            name: "费用对象",
            field: "object_name",
            width: 100,
        }, {
            id: "fee_name",
            name: "费用项目",
            field: "fee_name",
            width: 100,
        }, {
            id: "need_bx_amt",
            name: "费用申请金额",
            field: "need_bx_amt",
            width: 130,
            cssClass: "amt",
        }, {
            id: "used_amt",
            name: "费用批准金额",
            field: "used_amt",
            width: 130,
            cssClass: "amt",
        }, {
            id: "source_user",
            name: "制单人",
            field: "source_user",
            width: 100,
        }, {
            id: "description",
            name: "用途",
            field: "description",
            width: 100,
        }
    ];

    //网格设置
    $scope.viewOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false,
        //check
        multiSelect: true,
        autowidth: true
    };

    //汇总网格字段-汇
    $scope.viewColumns_h = [];

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
                // maxsearchrltcmt: "300"
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.dept_code = result.dept_code;
            $scope.data.dept_name = result.dept_name;
            $scope.data.dept_id = result.dept_id;
        });
    };

    //预算类别查询
    $scope.typeSearch = function () {
        $scope.FrmInfo = {
            title: "预算类别查询",
            thead: [{
                name: "类别名称",
                code: "bud_type_name"
            }, {
                name: "类别编码",
                code: "bud_type_code"
            }, {
                name: "机构层级",
                code: "org_level"
            }, {
                name: "费用层级",
                code: "fee_type_level"
            }, {
                name: "预算期间类别",
                code: "period_type",
                dicts: $scope.period_types,
                type: "list"
            }],
            classid: "fin_bud_type_header",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "fin_bud_type_headers",
            ignorecase: "true", //忽略大小写
            postdata: {
                sqlwhere: " 1=1 "
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.bud_type_code = result.bud_type_code;
            $scope.data.bud_type_name = result.bud_type_name;
            $scope.data.bud_type_id = result.bud_type_id;

            BasemanService.RequestPost("fin_bud_type_header", "select", JSON.stringify(result))
                .then(function (data) {
                    $.each(data.fin_bud_type_lineoffin_bud_type_headers, function (i, item) {
                        item.id = item.object_id;
                        item.name = item.object_name;
                    });
                    $scope.object_ids = data.fin_bud_type_lineoffin_bud_type_headers;
                });
        });
    };

    //费用部门查询
    $scope.feeorgSearch = function () {
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
                // maxsearchrltcmt: "300"
            },
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.fee_org_code = result.dept_code;
            $scope.data.fee_org_name = result.dept_name;
            $scope.data.fee_org_id = result.dept_id;
        });
    };

    //品牌-产品线查询
    /*$scope.$watch('data.crm_entid', function (newValue, oldValue) {
     var postData={
     "crm_entid": newValue
     };
     BasemanService.RequestPost("mis_crm_collate", "getentorgid", JSON.stringify(postData))
     .then(function (data) {
     var data1=data.mis_crm_collate_entofmis_crm_collates;
     $.each(data1,function (i,item) {
     item.id=data.entorgid;
     item.name=data.entorgid_name;
     item.item_type_id=data.entorgid;
     item.item_type_name=data.entorgid_name;
     });
     $scope.item_type_names=data1;
     });
     });*/

    //费用项目查询
    $scope.feeSearch = function () {
        if (!$scope.data.bud_type_id) {
            BasemanService.swalError("错误", "请先选择预算类别");
            return;
        }
        $scope.postData={
            bud_type_id: $scope.data.bud_type_id,
            flag: 2,
            // maxsearchrltcmt: "300"
        };
        if($scope.data.object_id!=""){
            $scope.postData.object_id=$scope.data.object_id;//绑定费用项目
        }
        $scope.FrmInfo = {
            title: "预算类型子表查询",
            thead: [{
                name: "费用项目编码",
                code: "fee_code"
            }, {
                name: "费用项目名称",
                code: "fee_name"
            }],
            classid: "fin_bud_type_line_obj",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: $scope.postData,
            searchlist: [""]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            //不确定
            $scope.data.fee_code = result.fee_code;
            $scope.data.fee_name = result.fee_name;
            $scope.data.fee_id = result.fee_id;
        });
    };


    //查询
    $('#searchBtn').click(function () {
        $scope.searchData();
        // dosearch();
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
        } else {
            postdata.flag = 3;
        }
        if ($scope.data.dept_id != "") {
            postdata.dept_id = $scope.data.dept_id;
        }
        if ($scope.data.bud_type_id != "") {
            postdata.bud_type_id = $scope.data.bud_type_id;
        }
        if ($scope.data.fee_org_id != "") {
            postdata.fee_org_id = $scope.data.fee_org_id;
        }
        if ($scope.data.year_month_start != "") {
            postdata.year_month_start = $scope.data.year_month_start;
        }
        if ($scope.data.year_month_end != "") {
            postdata.year_month_end = $scope.data.year_month_end;
        }
        if ($scope.data.bill_start_date != "") {
            postdata.bill_start_date = $scope.data.bill_start_date;
        }
        //数据库yyyy-mm-dd???
        if ($scope.data.bill_end_date != "") {
            postdata.bill_end_date = $scope.data.bill_end_date;
        }
        if ($scope.data.object_id != "") {
            postdata.object_id = $scope.data.object_id;
        }
        if ($scope.data.fee_id != "") {
            postdata.fee_id = $scope.data.fee_id;
        }
        BasemanService.RequestPost("fin_bud_list", "search", postdata)
            .then(function (data) {
                //序号
                for (var i = 0; i < data.fin_bud_lists.length; i++) {
                    data.fin_bud_lists[i].uid = i + 1;
                }
                $scope.viewGrid.setData([]);
                for (var i = 0; i < data.fin_bud_lists.length; i++) {
                    data.fin_bud_lists[i].need_bx_amt = insMoney(data.fin_bud_lists[i].need_bx_amt);
                    data.fin_bud_lists[i].used_amt = insMoney(data.fin_bud_lists[i].used_amt);
                }
                $scope.viewGrid.setData(data.fin_bud_lists);
                $scope.viewGrid.render();

                BaseService.pageInfoOp($scope, data.pagination);

                gridData = data.fin_bud_lists.slice(0);
            });
    };

    /*function dosearch(){
     var postData={
     "flag":3
     };
     if($scope.data.dept_id){
     postData.dept_id=$scope.data.dept_id;
     }
     if($scope.data.bud_type_id){
     postData.bud_type_id=$scope.data.bud_type_id;
     }
     if($scope.data.fee_org_id){
     postData.fee_org_id=$scope.data.fee_org_id;
     }
     if($scope.data.year_month_start){
     postData.year_month_start=$scope.data.year_month_start;
     }
     if($scope.data.year_month_end){
     postData.year_month_end=$scope.data.year_month_end;
     }
     if($scope.data.bill_start_date){
     postData.bill_start_date=$scope.data.bill_start_date;
     }
     //数据库yyyy-mm-dd???
     if($scope.data.bill_end_date){
     postData.bill_end_date=$scope.data.bill_end_date;
     }
     if($scope.data.object_id){
     postData.object_id=$scope.data.object_id;
     }
     BasemanService.RequestPost("fin_bud_list", "search", JSON.stringify(postData))
     .then(function (data) {
     //序号
     for(var i=0;i< data.fin_bud_lists.length;i++){
     data.fin_bud_lists[i].uid = i + 1;
     }
     gridData=data.fin_bud_lists;
     $scope.viewGrid.setData([]);
     $scope.viewGrid.setData(gridData);
     $scope.viewGrid.render();
     });
     }*/


    //汇总
    $('#collectBtn').click(function () {
        $('#collectModal').modal('show');
    });

    //汇总-确定
    $scope.collect = function () {
        $scope.viewColumns_h = [];
        $scope.viewColumns_h.push($scope.viewColumns[0]);
        var bool = false;
        for (var k in $scope.modal) {
            if ($scope.modal[k]) {
                bool = true;
                for (var i = 0; i < $scope.viewColumns.length; i++) {
                    if (k == $scope.viewColumns[i].field) {
                        $scope.viewColumns_h.push($scope.viewColumns[i]);
                    }
                }
            }
        }
        if (!bool) {
            BasemanService.swalError("错误", "请先选择汇总条件");
            return;
        }
        for(var i=0;i<$scope.viewColumns.length;i++){
            if ($scope.viewColumns[i].field == "need_bx_amt" || $scope.viewColumns[i].field == "used_amt") {
                $scope.viewColumns_h.push($scope.viewColumns[i]);
            }
        }
        changeColumns($scope.viewColumns_h);
        $('#collectModal').modal('hide');
    };

    //恢复
    $scope.recover = function () {
        changeColumns($scope.viewColumns);
        $('#collectModal').modal('hide');
    };

    function changeColumns(data) {
        $scope.viewGrid = new Slick.Grid("#viewGrid", [], data.slice(0), $scope.viewOptions);
        $scope.viewGrid.setData(gridData);
        $scope.viewGrid.render();
    }

    function insMoney(num) {
        var i = 2;
        return HczyCommon.formatMoney(num, i);
    }

    BasemanService.initGird();

    BaseService.pageGridInit($scope);

    BasemanService.ReadonlyGrid($scope.viewGrid);
}
//注册控制器
angular.module('inspinia')
    .controller('fin_bud_list', fin_bud_list);

