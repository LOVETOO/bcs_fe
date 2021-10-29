/**
 * 客户回款单
 */
function sa_order_plan_week($scope, BasemanService, BaseService) {
    $scope.data = {};
    $scope.data.currItem = {};
    //初始化数据
    $scope.ReturnType = [];//回款类型
    $scope.billStats = [];
   //明细序号
    var lineMaxSeq = 0;



    //添加按钮
    var editHeaderButtons =  function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };



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
            width: 60
        },{
            name: "操作",
            width: 130,
            formatter: editHeaderButtons
        },{
            id: "stat",
            name: "状态",
            field: "stat",
            width: 80,
            formatter: Slick.Formatters.SelectOption,
            type:'list'
        },{
            id: "order_plan_code",
            name: "计划单号",
            field: "order_plan_code",
            width: 150,
            type:'string'
        }, {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            width: 150,
            type:"string"
        }, {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 130,
            type:"string"
        },{
            id: "cyear",
            name: "年份",
            field: "cyear",
            width: 100,
            type:'number'
        },{
            id: "cmonth",
            name: "月份",
            field: "cmonth",
            width: 80,
            type:'number'
        },{
            id: "plan_amt",
            name: "计划订货金额",
            field: "plan_amt",
            width: 130,
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:'number'
        },{
            id: "fact_amt",
            name: "实际订货金额",
            field: "fact_amt",
            width: 130,
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:'number'
        },{
            id: "balance_amt",
            name: "差异金额",
            field: "balance_amt",
            width: 130,
            formatter: Slick.Formatters.Money,
            cssClass: "amt",
            type:'number'
        },{
            id: "creation_date",
            name: "制单日期",
            field: "creation_date",
            width: 130,
            formatter: Slick.Formatters.Date,
            type:'date'
        },{
            id: "note",
            name: "备注",
            field: "note",
            width: 240,
            type:"string"
        }
    ];


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
        }, {
            name: "时间(周)",
            id: "week_name",
            field: "week_name",
            width: 120
        }, {
            name: "日期",
            id: "plan_date",
            field: "plan_date",
            width: 100,
            formatter:Slick.Formatters.Date
        }, {
            id: "plan_amt",
            name: "计划订货金额",
            field: "plan_amt",
            width: 130,
            formatter: Slick.Formatters.Money,
            editor:Slick.Editors.Text,
            cssClass: "amt"
        },{
            id: "fact_amt",
            name: "实际订货金额",
            field: "fact_amt",
            width: 130,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        },{
            id: "balance_amt",
            name: "差异金额",
            field: "balance_amt",
            width: 130,
            formatter: Slick.Formatters.Money,
            cssClass: "amt"
        }, {
            name: "差异分析",
            id: "note",
            field: "note",
            editor:Slick.Editors.Text,
            width: 300
        }
    ];


    //初始化网格
    $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);

    $scope.lineGridView.onCellChange.subscribe(sumTotal);



    function sumTotal() {
        var check =true;
        var plan_amt = 0;
        var fact_amt = 0;
        var balance_amt = 0;
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        $scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads = $scope.lineGridView.getData();
        if($scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads.length>0){
            $.each($scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads,function (index,item) {
                plan_amt+= Number(item.plan_amt);
                fact_amt+= Number(item.fact_amt);
                balance_amt+= Number(item.balance_amt);
            });
        }
        $scope.data.currItem.plan_amt = plan_amt;
        $scope.data.currItem.fact_amt = fact_amt;
        $scope.data.currItem.balance_amt = balance_amt;
    }

    /**
     * 取词汇值方法
     */
    function searchDict(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                var gridnames = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts[i] = {
                        value: parseInt(data.dicts[i].dictvalue),
                        desc: data.dicts[i].dictname,
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    };
                    dictdata.push(dicts[i]);
                }
                if ($scope.getIndexByField(columnname, field)) {
                    gridcolumns[$scope.getIndexByField(columnname, field)].options = dicts;
                    grid.setColumns(gridcolumns);
                }
            });
        return dictdata;
    }

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    //取词汇值
    $scope.billStats = searchDict("stat", "stat", $scope.headerGridView, $scope.headerColumns, "headerColumns");


    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {
        var dg = $scope.headerGridView;
        if ($(e.target).hasClass("viewbtn")) {
            $scope.detail(args,'view');
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var rowidx = args.row;
            var postData = {};
            postData.sa_order_plan_week_head_id = args.grid.getDataItem(rowidx).sa_order_plan_week_head_id;
            var order_plan_code = args.grid.getDataItem(rowidx).order_plan_code;
            BasemanService.swalWarning("删除", "确定要删除单号 " + order_plan_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("sa_order_plan_week_head", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                            BasemanService.notice("删除成功！", "alert-success");
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }else if ($(e.target).hasClass("checkbtn")) {
            var rowidx = args.row;
            var postData = {};
            postData.sa_order_plan_week_head_id = args.grid.getDataItem(rowidx).sa_order_plan_week_head_id;
            var order_plan_code = args.grid.getDataItem(rowidx).order_plan_code;
            BasemanService.swalWarning("审核", "确定要审核单号 " + order_plan_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("sa_order_plan_week_head", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.searchData();
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }
    };

    /**
     * 网格双击事件
     */
    function dgDblClick(e, args) {
        $scope.detail(args,'view');
    }


    /**
     * 查询主表数据
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            if(!$scope.oldPage ){
                $scope.oldPage = 1;
            }
            if(!$scope.currentPage){
                $scope.currentPage = 1;
            }
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination:"pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            }
        }
        if ($scope.sqlwhere && $scope.sqlwhere !=""){
            postdata.sqlwhere = $scope.sqlwhere
        }
        BasemanService.RequestPost("sa_order_plan_week_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.sa_order_plan_week_heads);
        });
    }



    /**
     * 加载网格数据
     */
    function loadGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize*($scope.currentPage-1);
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

    /**
     * 查看详细/新增
     */
    $scope.detail = function (args,type) {
        if(type == 'add'){
            $scope.data.currItem = {
                "sa_order_plan_week_head_id":0,
                "creation_date" : new Date().Format('yyyy-MM-dd hh:mm:ss'),
                "stat":1,
                "cyear":new Date().getFullYear(),
                "cmonth":new Date().getMonth()+2,
                "sa_order_plan_week_lineofsa_order_plan_week_heads": []
            };
            $scope.addLines();
            $scope.lineGridView.setData($scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads);
            $scope.lineGridView.render();
        }
        if(type == 'view'){
            //调用后台select方法查询详情
            $scope.data.currItem = args.grid.getDataItem(args.row);
            BasemanService.RequestPost("sa_order_plan_week_head", "select", JSON.stringify({"sa_order_plan_week_head_id": $scope.data.currItem.sa_order_plan_week_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView,$scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads);
                    $scope.lineGridView.render();

                });
        }
        $("#detailModal").modal();
    }

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = i + 1;
            }
            lineMaxSeq = datas.length;
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        var action = "insert";
        if ($scope.data.currItem.sa_order_plan_week_head_id > 0) {
            action = "update";
        }
        BasemanService.RequestPost("sa_order_plan_week_head", action, JSON.stringify($scope.data.currItem))
            .then(function (data) {
                $("#detailModal").modal('hide');
                $scope.searchData();
            });
    }

    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if (type == 'customer') {
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
                direct: "left",
                sqlBlock: "",
                backdatas: "customer_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {search_flag:6},
                searchlist: ["customer_code", "customer_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.customer_id = result.customer_id;
                $scope.data.currItem.customer_code = result.customer_code;
                $scope.data.currItem.customer_name = result.customer_name;
            });
        }
    }

    $scope.setLines = function () {
        if($scope.data.currItem.cmonth==13){
            $scope.data.currItem.cmonth =12;
            return;
        }
        if($scope.data.currItem.cmonth==0){
            $scope.data.currItem.cmonth =1;
            return;
        }
        $scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads = [];
        $scope.addLines();
        $scope.lineGridView.setData($scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads);
        $scope.lineGridView.render();
    }

    $scope.addLines = function () {
        var weeks = ["第一周","第二周","第三周","第四周","第五周","第六周"];
        var days = $scope.daysMonth($scope.data.currItem.cyear,$scope.data.currItem.cmonth);
        console.log(days);
        var seq = 1;
        for(var i=1;i<=days;i++){
            var is_weekend = $scope.isWeekend($scope.data.currItem.cyear,$scope.data.currItem.cmonth,i);
            if(is_weekend)continue;
            var week = $scope.getMonthWeek($scope.data.currItem.cyear,$scope.data.currItem.cmonth,i);
            var data = {};
            data.seq = seq;
            data.week = week;
            data.week_name = weeks[week-1];
            if(i<10){
                data.plan_date = $scope.data.currItem.cyear+"-"+$scope.data.currItem.cmonth+"-0"+i;
            }else{
                data.plan_date = $scope.data.currItem.cyear+"-"+$scope.data.currItem.cmonth+"-"+i;
            }
            data.plan_amt = 0;
            data.fact_amt =0;
            data.balance_amt = 0;
            data.note = "";
            $scope.data.currItem.sa_order_plan_week_lineofsa_order_plan_week_heads.push(data);
            seq++;
        }
    };

    $scope.daysMonth = function mGetDate(year, month){
        var d = new Date(year, month, 0);
        return d.getDate();
    }

    $scope.isWeekend = function (year, month, day) {
        var is_weekend = false;
        var dt = new Date(year, parseInt(month) - 1, day);
        if(dt.getDay()==6|| dt.getDay()==0){
            is_weekend = true;
        }
        return is_weekend;
    }

    $scope.getMonthWeek = function (year, month, day) {
        //a = d = 当前日期
        //b = 6 - w = 当前周的还有几天过完(不算今天)
        //a + b 的和在除以7 就是当天是当前月份的第几周
        var date = new Date(year, parseInt(month) - 1, day), w = date.getDay(), d = date.getDate();
        return Math.ceil((d + 6 - w) / 7);
    };

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "sa_order_plan_week_head",
            ignorecase: "true", //忽略大小写
            postdata: {},
            is_high: true
        };
        $.each($scope.headerColumns, function (i, item) {
            if (item.type) {
                $scope.FrmInfo.thead.push({
                    name: item.name,
                    code: item.field,
                    type: item.type,
                    dicts: item.options
                })
            }
        })
        var obj = $scope.FrmInfo;
        var str = JSON.stringify(obj);
        sessionStorage.setItem("frmInfo",str);
        BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            var postdata = {
                pagination: "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0",
                sqlwhere: result,                                                          //result为返回的sql语句
            }
            $scope.sqlwhere = result;
            $scope.searchData(postdata)
        })
    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('sa_order_plan_week', sa_order_plan_week);