/**这是预算期间界面js*/
function fin_bud_period_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currIterm = {};
    var searchData = {};
    var action = "";

    $scope.Period_Years = [{id: "2018", name: "2018年度"},
        {id: "2019", name: "2019年度"},
        {id: "2020", name: "2020年度"},
        {id: "2021", name: "2021年度"},
        {id: "2022", name: "2022年度"},
        {id: "2023", name: "2023年度"}];

    $scope.Period_Types = [];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "period_type"})
        .then(function (data) {
            $scope.Period_Types = data.dicts;
            var Period_Types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                Period_Types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }

            if ($scope.getIndexByField('periodColumns', 'period_type')) {
                $scope.periodColumns[$scope.getIndexByField('periodColumns', 'period_type')].options = Period_Types;
                $scope.headerGridView.setColumns($scope.periodColumns);
            }
        });
    $scope.conditions1 = [{id: "Period_Year", name: "年度"},
        {id: "Period_Type", name: "预算期间类别"},
        {id: "Description", name: "描述"}];

    $scope.conditions2 = [{id: "Period_Year", name: "年度"},
        {id: "Period_Type", name: "预算期间类别"},
        {id: "Description", name: "描述"}];

    $scope.operators1 = [{id: "=", name: "="},
        {id: "<", name: "<"},
        {id: ">", name: ">"},
        {id: "<=", name: "<="},
        {id: ">=", name: ">="},
        {id: "<>", name: "<>"}];

    $scope.operators2 = [{id: "=", name: "="},
        {id: "<", name: "<"},
        {id: ">", name: ">"},
        {id: "<=", name: "<="},
        {id: ">=", name: ">="},
        {id: "<>", name: "<>"}];

    //初始化查询条件数据
    $scope.condition1 = $scope.conditions1[0];
    $scope.condition2 = $scope.conditions2[1];
    $scope.operator1 = $scope.operators1[0];
    $scope.operator2 = $scope.operators2[0];
    $scope.value1 = "";
    $scope.value2 = "";


    //设置当前对象名及主键名
    $scope.objconf = {
        classid: "Fin_Bud_Period_Header", //表名类名
        key: "Period_Id", //主键
        nextStat: "Fin_Bud_Period_Line", //详情页菜单stat
        classids: "Fin_Bud_Period_Headers", //后台返回的列表名
        sqlBlock: "1=1", //初始条件
        thead: [], //固定为空
        grids: [{
            optionname: 'viewOptions',
            idname: 'fin_bud_period_lineoffin_bud_period_headers'
        }] //网格的option列表
    };

    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' ng-model='viewLine'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    var editButtons = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }
    //网格设置
    $scope.periodOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        //enableAddRow: true,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight:true
    };
    //定义网格字段(浏览）
    $scope.periodColumns = [
        {
            id: "period_year",
            name: "年度",
            field: "period_year",
            editable: false,
            filter: 'set',
            width: 170,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "period_type",
            name: "预算期间类别",
            field: "period_type",
            editable: false,
            filter: 'set',
            width: 190,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            id: "description",
            name: "描述",
            field: "description",
            editable: false,
            filter: 'set',
            width: 210,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            name: "操作",
            editable: false,
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        }
    ];
    //定义网格字段（详情）
    $scope.lineColumns = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            editable: false,
            filter: 'set',
            // width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }, {
            id: "dname",
            name: "名称",
            field: "dname",
            editable: true,
            filter: 'set',
            // width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            id: "start_date",
            name: "开始日期",
            field: "start_date",
            editable: true,
            filter: 'set',
             width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Date
        }, {
            id: "end_date",
            name: "结束日期",
            field: "end_date",
            editable: true,
            width: 120,
            filter: 'set',
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Date
        }, {
            id: "description",
            name: "描述",
            field: "description",
            editable: true,
            filter: 'set',
            width: 150,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "操作",
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editButtons
        }
    ];



    //明细网格
    $scope.lineGridView = new Slick.Grid("#linegridview", [], $scope.lineColumns, $scope.lineOptions);

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#slick-grid1", [], $scope.periodColumns, $scope.periodOptions);

    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {

            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.period_id = args.grid.getDataItem(args.row).period_id;
            var year = args.grid.getDataItem(args.row).period_year;
            var type = args.grid.getDataItem(args.row).period_type;
            swal({
                title: "确定删除?",
                text: "确定要删除 "+year+"年度 "+type+" 的期间吗？",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "删除",
                cancelButtonText: "取消",
                closeOnConfirm: false
            }, function () {
                BasemanService.RequestPost("fin_bud_period_header", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                    }).then(function () {
                    swal("删除!", "您已成功删除该文件!", "success");
                },function () {
                    swal("出错!", "删除时出现错误!", "error");
                });

            });
            e.stopImmediatePropagation();
        }
    };


    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("btn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);

    /**
     *添加明细行
     */

    $scope.addLineRow = function () {
        //$scope.checkNull();
        if(($scope.data.currIterm.period_year == "" | $scope.data.currIterm.period_year == null) || ($scope.data.currIterm.period_type == "" | $scope.data.currIterm.period_type == null)){
            alert("期间不能为空！");
            return;
        }
        if($scope.lineGridView.getData().length != 0){
            $scope.addRow();
            return;
        }
        else{
            var isBuild = 0;
            var msg = "";
            var postData = {};
            postData.period_year = $scope.data.currIterm.period_year;
            postData.period_type = $scope.data.currIterm.period_type;
            BasemanService.RequestPost("fin_bud_period_header", "check", JSON.stringify(postData))
                .then(function (data) {
                    isBuild = data.flag;
                    msg = data.msg;
                    if (isBuild == 1) { //预算期间已建立
                        alert(msg);
                    } else if ($scope.lineGridView.getCellEditor() != undefined) {
                        $scope.lineGridView.getCellEditor().commitChanges();
                    } else {
                        $scope.addRow();
                    }
                });
            }

    }
    /**
     * 检查明细行是否空值
     */
    $scope.checkNull = function () {
        var lineRow = [];
        lineRow = $scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers;
        for(var i=0;i<lineRow.length;i++){
            var dname = lineRow[i].dname;
            var startDate = lineRow[i].start_date;
            var endDate = lineRow[i].end_date;
            if(dname == "" || dname == undefined || startDate == "" || startDate == undefined || endDate == "" || endDate == undefined){
                if(dname == "" || dname == undefined){
                    alert("请输入明细名称！");
                    return false;
                }
                if(startDate == "" || startDate == undefined){
                    alert("请输入开始日期！");
                    return false;
                }
                if(endDate == "" || endDate == undefined){
                    alert("请输入结束日期！");
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * 删除明细网格行
     */
    $scope.delLineRow = function (args) {
        var name = args.grid.getDataItem(args.row).dname;
        if($scope.lineGridView.getData().length == 1){
            alert("明细表不能为空！");
            return;
        }
        if(confirm("确定要删除明细 "+name+" 吗？")){
            var dg = $scope.lineGridView;
            dg.getData().splice(args.row,1);
            dg.invalidateAllRows();
            dg.render();
        }
    };

    /**
     * 查询详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        var postData = {};
        postData.period_id = args.grid.getDataItem(args.row).period_id;
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_bud_period_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currIterm = data;
                $scope.data.currIterm.period_year = args.grid.getDataItem(args.row).period_year;
                $scope.data.currIterm.period_type = args.grid.getDataItem(args.row).period_type;

                $scope.lineGridView.setData([]);
                if (data.fin_bud_period_lineoffin_bud_period_headers) {
                    //日期数据格式化
                    for(var i in data.fin_bud_period_lineoffin_bud_period_headers){
                        var startDate = data.fin_bud_period_lineoffin_bud_period_headers[i].start_date;
                        var endDate = data.fin_bud_period_lineoffin_bud_period_headers[i].end_date;
                        var oldStartTime = (new Date(startDate)).getTime();
                        var oldEndTime = (new Date(endDate)).getTime();
                        var curStartTime = new Date(oldStartTime).format("yyyy-MM-dd");
                        var curEndTime = new Date(oldEndTime).format("yyyy-MM-dd");
                        data.fin_bud_period_lineoffin_bud_period_headers[i].start_date = curStartTime;
                        data.fin_bud_period_lineoffin_bud_period_headers[i].end_date = curEndTime;
                    }

                    var lineData = data.fin_bud_period_lineoffin_bud_period_headers;
                    $scope.lineGridView.setData(lineData);
                }
                $scope.lineGridView.render();
                //显示详情模态页面
                $("#detailModal").modal();
            });
    };

    /**
     * 查询后台数据
     */
    $scope.doSearch = function () {
        BasemanService.RequestPost("fin_bud_period_header", "search", JSON.stringify({}))
            .then(function (data) {
                $scope.data.currIterm = data;
                //searchData = data.fin_bud_period_headers;
                //清空网格
                $scope.headerGridView.setData([]);
                //网格字段排序
                var compare = function (obj1, obj2) {
                    var val1 = obj1.period_year;
                    var val2 = obj2.period_year;
                    if (val1 > val2) {
                        return -1;
                    } else if (val1 < val2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                data.fin_bud_period_headers.sort(compare);
                //设置数据
                $scope.headerGridView.setData(data.fin_bud_period_headers);
                //重绘网格
                $scope.headerGridView.render();
            });
    }

    /**
     * 筛选条件查询数据
     */
    $scope.search_period = function () {
        var sqlWhere = "";
        if(($scope.value1 == "") && ($scope.value2 == "")){
            sqlWhere = "";
        }else if($scope.value1 == ""){
            sqlWhere = "(" + $scope.condition2.id + $scope.operator2.id + $scope.value2+")";
        }else if($scope.value2 == ""){
            sqlWhere = "(" + $scope.condition1.id + $scope.operator1.id + $scope.value1+")";
        }else{
            sqlWhere = "(("+$scope.condition1.id + $scope.operator1.id + $scope.value1 + ")and(" +
                $scope.condition2.id + $scope.operator2.id + $scope.value2+"))";
        }
        var searchCond_obj = {
            "sqlwhere": sqlWhere
        };
        BasemanService.RequestPost("fin_bud_period_header", "search", JSON.stringify(searchCond_obj))
            .then(function (data) {
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                $scope.headerGridView.setData(data.fin_bud_period_headers);
                //重绘网格
                $scope.headerGridView.render();
            });
    }


    /**
     * 增加区间设置
     */
    $scope.addPeroid = function () {
        $scope.data.currIterm = {"period_id": 0, fin_bud_period_lineoffin_bud_period_headers: []};
        $scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers.usable = 2;
        $scope.lineGridView.setData($scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers);

        //显示模态页面
        $("#detailModal").modal();
        $scope.lineGridView.invalidateAllRows();
        $scope.lineGridView.render();
    }

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        action = "insert";
        if ($scope.data.currIterm.period_id > 0) {
            action = "update";
        }

        if(action == "update"){
            if($scope.checkNull()) {
                //调用后台select方法查询详情
                BasemanService.RequestPost("fin_bud_period_header", action, JSON.stringify($scope.data.currIterm))
                    .then(function (data) {
                        $scope.doSearch();
                        alert("保存成功！");
                        $("#detailModal").modal("hide");
                    });
            }
            return;
        }
        if(action == "insert"){
            if(($scope.data.currIterm.period_year == "" || $scope.data.currIterm.period_year == null) && ($scope.data.currIterm.period_type == "" || $scope.data.currIterm.period_type == null)){
                alert("期间不能为空！");
            }else if($scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers.length == 0){
                alert("请先增加明细！");
            }else{
                if($scope.checkNull()){
                    //调用后台select方法查询详情
                    BasemanService.RequestPost("fin_bud_period_header", action, JSON.stringify($scope.data.currIterm))
                        .then(function () {
                            $scope.doSearch();
                            alert("保存成功！");
                            $("#detailModal").modal("hide");
                        });
                }
            }
        }
    }
    /**
     * 明细表增加一行
     */
    $scope.addRow = function () {
        var dg = $scope.lineGridView;
        var rowidx = 0;
        var dataitem = [];
        var dataObj = {};
        if($scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers.length == 0){
            dataObj.seq = 1;
        }else{
            var list = new Array();
            for(var i=0;i< $scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers.length;i++){
                list.push($scope.data.currIterm.fin_bud_period_lineoffin_bud_period_headers[i].seq);
            }
            list.sort(function(num1,num2){
                return num1-num2;
            })
            var maxSeq= eval(list[list.length-1]);
            dataObj.seq = maxSeq + 1;
        }

        //获取网格对象
        if (dg.getData()) { //防止数据空值报错，所以要做这个判断
            dg.getData().push(dataObj);
        } else {
            dataitem.push(dataObj);
            dg.setData(dataitem);
        }
        dg.resizeCanvas();
        dg.invalidateAllRows();
        dg.updateRowCount();
        dg.render();
    }

    //初始化查询
    //$scope.doSearch();

    /**
     * 日期格式化方法
     * @param fmt
     * @returns {*}
     */
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }
    //主表自适应高度
    //$rootScope.gridheader();
}

//注册控制器
angular.module('inspinia')
    .controller('fin_bud_period_header', fin_bud_period_header);






