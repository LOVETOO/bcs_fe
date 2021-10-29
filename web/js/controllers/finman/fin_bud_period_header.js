/**这是预算期间界面js*/
function fin_bud_period_header($scope, $location, $rootScope, $modal, $timeout, $filter,BasemanService, notify, $state, localeStorageService, FormValidatorService,BaseService) {
    $scope.data = {};
    $scope.data.currItem = {};
    var searchData = {};
    var action = "";
    $scope.Period_Types = [];

    //词汇表预算期间取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "period_type"})
        .then(function (data) {
            $scope.Period_Types = data.dicts;

            HczyCommon.stringPropToNum($scope.Period_Types);
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
    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' ng-model='viewLine'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    var editButtons = function (row, cell, value, columnDef, dataContext) {
        return " <button class='btn btn-sm btn-info dropdown-toggle delbtn' " +
            "style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
    };


    //网格设置
    $scope.periodOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
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
        autoHeight:false
    };
    //定义主表网格列属性
    $scope.periodColumns = [
        {
            name: "操作",
            editable: false,
            width: 150,
            formatter: editHeaderButtons
        },{
            id: "period_year",
            name: "年度",
            field: "period_year",
            width: 170,
        }, {
            id: "period_type",
            name: "预算期间类别",
            field: "period_type",
            width: 190,
            options: [],
            formatter: Slick.Formatters.SelectOption
        }, {
            id: "description",
            name: "描述",
            field: "description",
            width: 210,
            cellEditor: "文本框",
        },
    ];
    //定义网格字段（详情）
    $scope.lineColumns = [
        {
            id: "seq",
            name: "序号",
            behavior: "select",
            field: "seq",
            editable: false,
            width: 50,
        },  {
            name: "操作",
            width: 100,
            cellEditor: "文本框",
            formatter: editButtons
        },{
            id: "dname",
            name: "明细名称",
            field: "dname",
             width: 150,
            editor: Slick.Editors.Text
        }, {
            id: "start_date",
            name: "开始日期",
            field: "start_date",
            width: 120,
            editor: Slick.Editors.Date,
            formatter: Slick.Formatters.Date
        }, {
            id: "end_date",
            name: "结束日期",
            field: "end_date",
            width: 120,
            editor: Slick.Editors.Date,
            formatter: Slick.Formatters.Date
        }, {
            id: "description",
            name: "描述",
            field: "description",
            width: 150,
            editor: Slick.Editors.Text
        },
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
            var periodtype = "";
            //将期间类型转换为中文显示
            for(var i=0;i<$scope.Period_Types.length;i++){
                if($scope.Period_Types[i].dictvalue == parseInt(type)){
                    periodtype = $scope.Period_Types[i].dictname;
                }
            }
            BasemanService.swalDelete("删除", "确定要删除 "+year+"年 "+periodtype+" 的期间吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("fin_bud_period_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        });
                }
                e.stopImmediatePropagation();
            });
        }
    };
    function dgOnDblClick(e,args) {
        $scope.viewDetail(args);
    }


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
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);

    //明细绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);

    /**
     *添加明细行
     */
    $scope.addLineRow = function () {
        if(($scope.data.currItem.period_year == "" | $scope.data.currItem.period_year == null) || ($scope.data.currItem.period_type == "" | $scope.data.currItem.period_type == null)){
            BasemanService.swal("提示", "期间不能为空" );
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
            postData.period_year = $scope.data.currItem.period_year;
            postData.period_type = $scope.data.currItem.period_type;
            //检查预算期间是否建立
            BasemanService.RequestPost("fin_bud_period_header", "check", JSON.stringify(postData))
                .then(function (data) {
                    isBuild = data.flag;
                    msg = data.msg;
                    if (isBuild == 1) { //预算期间已建立
                        BasemanService.swalWarning("提示", msg );
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
        lineRow = $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers;
        for(var i=0;i<lineRow.length;i++){
            var dname = lineRow[i].dname;
            var startDate = lineRow[i].start_date;
            var endDate = lineRow[i].end_date;
            if(dname == "" || dname == undefined || startDate == "" || startDate == undefined || endDate == "" || endDate == undefined){
                if(dname == "" || dname == undefined){
                    BasemanService.swal("提示", "请输入明细名称" );
                    return false;
                }
                if(startDate == "" || startDate == undefined){
                    BasemanService.swal("提示", "请输入开始日期" );
                    return false;
                }
                if(endDate == "" || endDate == undefined){
                    BasemanService.swal("提示", "请输入结束日期" );
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
            BasemanService.swal("提示", "明细表不能为空" );
            return;
        }
        BasemanService.swalDelete("删除", "确定要删除期间 "+name+" 吗？",function(bool){
            if (bool) {
                var dg = $scope.lineGridView;
                dg.getData().splice(args.row,1);
                dg.invalidateAllRows();
                dg.render();
            }else{
                return;
            }
        });
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
                $scope.data.currItem = data;
                var lineData = data.fin_bud_period_lineoffin_bud_period_headers;
                if (lineData) {
                    //细表网格序号排序
                    var arr = [];
                    for(var i=0;i<lineData.length;i++){
                        arr.push(lineData[i].seq);
                    }
                    function sortNumber(a,b)
                    {
                        return a - b
                    }
                    arr.sort(sortNumber);
                    var j = 0;
                    for(var i=0;i<arr.length;i++){
                        for(;i<lineData.length;){
                            lineData[j].seq = arr[i];
                            j++;
                            break;
                        }
                    }
                    $scope.lineGridView.setData([]);
                    $scope.lineGridView.setData(lineData);
                    $scope.lineGridView.render();
                }
                //显示详情模态页面
                $("#detailModal").modal();
            });
    };

    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        BasemanService.RequestPost("fin_bud_period_header", "search", postdata)
            .then(function (data) {
                $scope.data.currItem = data;
                //清空网格
                $scope.headerGridView.setData([]);
                //网格按年度排序
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
                BaseService.pageInfoOp($scope, data.pagination)
            });
    }


    /**
     * 增加预算期间
     */
    $scope.addPeroid = function () {
        $scope.data.currItem = {
            "period_id": 0,
            "period_year": new Date().getFullYear(),
            fin_bud_period_lineoffin_bud_period_headers: []
        };
        $scope.lineGridView.setData($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers);


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
        if ($scope.data.currItem.period_id > 0) {
            action = "update";
        }

        if(action == "update"){
            if($scope.checkNull()) {
                //调用后台select方法查询详情
                BasemanService.RequestPost("fin_bud_period_header", action, JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        $scope.searchData();
                        BasemanService.swalSuccess("成功", "保存成功！"  );
                        $("#detailModal").modal("hide");
                    });
            }
            return;
        }
        if(action == "insert"){
            for(var i=0;i<$scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.length;i++){
                $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[i].usable = 2;
            }
            if(($scope.data.currItem.period_year == "" || $scope.data.currItem.period_year == null) && ($scope.data.currItem.period_type == "" || $scope.data.currItem.period_type == null)){
                BasemanService.swal("提示", "期间不能为空" );
            }else if($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.length == 0){
                BasemanService.swal("提示", "请先增加明细" );
            }else{
                if($scope.checkNull()){
                    //调用后台select方法查询详情
                    BasemanService.RequestPost("fin_bud_period_header", action, JSON.stringify($scope.data.currItem))
                        .then(function () {
                            $scope.searchData();
                            BasemanService.swalSuccess("成功", "保存成功！"  );
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
        if($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.length == 0){
            dataObj.seq = 1;
        }else{
            var list = new Array();
            for(var i=0;i< $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.length;i++){
                list.push($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[i].seq);
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

    //初始化分页
    BaseService.pageGridInit($scope);
    //主表自适应高度
    BasemanService.initGird();
}

//注册控制器
var app = angular.module('inspinia');
app.controller('ctrl_fin_bud_period_header', fin_bud_period_header);





