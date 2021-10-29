/**
 * 窗体对象配置
 * 2018-2-1 by mjl
 */
function scpobjconf($scope, $location, $rootScope, $modal, $timeout, BaseService, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};
    //明细序号
    var lineMaxSeq = 0;
    var lineWflowMaxSeq = 0;
    //测试对象
    var test ;
    //保存类型
    $scope.saveType = "";
    //工作流类型
    $scope.wftypes = [];
    //单据在流程中的打开方式 0系统参数控制 1 嵌入式（单据和流程融为一体） 2 弹出式（双击弹出独立窗口）
    $scope.formopenmodeinwfs = [];
    //报表类型 1固定；2动态 */
    $scope.rpttypes = [];

    //词汇表工作流类型取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "wftypes"})
        .then(function (data) {
            $scope.wftypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });

    //词汇表单据在流程中的打开方式取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "formopenmodeinwfs"})
        .then(function (data) {
            $scope.formopenmodeinwfs = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });

    //词汇表报表类型系统参数分类取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rpttypes"})
        .then(function (data) {
            $scope.rpttypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>" +
            "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };
    //添加按钮-明细
    var lineButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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
        //onClick:dgOnClick
    };
    //网格设置
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight: false
        //onClick:dgOnClick
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45,
        },
        {
            id: "objtypeid",
            name: "单据类型编号",
            field: "objtypeid",
            width: 100,
            type:"number"
        },
        {
            id: "objtypename",
            name: "单据类型描述",
            field: "objtypename",
            width: 150,
            type:"string"
        },
        {
            id: "formclass",
            name: "窗体类名",
            field: "formclass",
            width: 180,
            type:"string"
        },
        {
            id: "objclass",
            name: "对象类名",
            field: "objclass",
            width: 180,
            type:"string"
        },
        {
            id: "isflow",
            name: "有流程",
            field: "isflow",
            width: 85,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
        {
            id: "wftempname",
            name: "工作流名称",
            field: "wftempname",
            width: 100,
            type:"string"
        },
        {
            id: "tablename",
            name: "表名",
            field: "tablename",
            width: 150,
            type:"string"
        },
        {
            id: "pkfield",
            name: "主键名",
            field: "pkfield",
            width: 150,
            type:"string"
        },
        {
            id: "haspath",
            name: "有路径",
            field: "haspath",
            width: 85,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
        {
            id: "hasrev",
            name: "有版本",
            field: "hasrev",
            width: 85,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
        {
            id: "codefield",
            name: "编码字段",
            field: "codefield",
            width: 150,
            type:"string"
        },
        {
            id: "namefield",
            name: "名称字段",
            field: "namefield",
            width: 150,
            type:"string"
        },
        {
            id: "typefield",
            name: "类型字段",
            field: "typefield",
            width: 150,
            type:"string"
        },
        {
            id: "mainfields",
            name: "主要字段列表",
            field: "mainfields",
            width: 150,
            type:"string"
        },
        {
            name: "操作",
            width: 75,
            formatter: editHeaderButtons
        }
    ];

    //定义网格字段 - 明细 - 工作流
    $scope.lineWflowColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45,
        },
        {
            id: "wftempname",
            name: "工作流模板名称",
            field: "wftempname",
            width: 180,
            editor: Slick.Editors.Text,
        },
        {
            id: "isdefault",
            name: "缺省",
            field: "isdefault",
            width: 55,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            editor: Slick.Editors.SelectOption,
        },
        {
            id: "isecwf",
            name: "变更流程",
            field: "isecwf",
            width: 70,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            editor: Slick.Editors.SelectOption,
        },
        {
            id: "execcond",
            name: "执行条件",
            field: "execcond",
            width: 100,
            editor: Slick.Editors.Text,
        },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 90,
            editor: Slick.Editors.Text,
        },
        {
            name: "操作",
            editable: false,
            width: 75,
            cellEditor: "文本框",
            formatter: lineButtons
        }
    ];
    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);
    //网格初始化 - 明细
    //$scope.lineGridView = new Slick.Grid("#lineGridView", [], $scope.lineColumns, $scope.lineOptions);
    //网格初始化 - 明细 - 工作流
    $scope.lineGridViewWflow = new Slick.Grid("#lineGridViewWflow", [], $scope.lineWflowColumns, $scope.lineOptions);

    //主表-绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){edit(args)});
    //细表-绑定点击事件
    //$scope.lineGridView.onClick.subscribe(ldgOnClick);
    $scope.lineGridViewWflow.onClick.subscribe(ldgWflowOnClick);
    $scope.lineGridViewWflow.onDblClick.subscribe(ldgWflowDblClick);
    /**
     * 事件判断 - 主表
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            edit(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
    };
    /**
     * 事件判断 - 细表
     */
    function ldgOnClick(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("delbtn")) {
            delLine(args);
            e.stopImmediatePropagation();
        }
    };
    /**
     * 事件判断 - 细表 - 工作流
     */
    function ldgWflowOnClick(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("delbtn")) {
            delLineWflow(args);
            e.stopImmediatePropagation();
        }
    };
    /**
     * 事件判断 - 细表 - 工作流 - 双击事件
     */
    function ldgWflowDblClick(e, args) {
        //选择工作流模板
        if (args.cell == 1) {
            searchFdr(args);
            e.stopImmediatePropagation();
        }
    }

    /**
     * 查询后台数据
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
        BasemanService.RequestPost("scpobjconf", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.objconfofobjconfs);
            //重绘网格
            $scope.headerGridView.render();
        });
    }

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "scpobjconf",
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
            $scope.searchData(postdata);
        })
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.searchData();
    }

    /**
     * 初始化 - Modal框tab页 - 把tab框显示到第一标签
     */
    $scope.initModal = function () {
        var tabs = $(".nav-tabs");
        if(tabs){
            $.each(tabs, function (i, tab) {
                var tabLis = $(tab).children("li");
                $.each(tabLis, function (i, li) {
                    $(li).removeClass("active");
                })
                $(tabLis.get(0)).addClass("active");
            })
        }
        var tabContents = $(".tab-content");
        if(tabContents){
            $.each(tabContents, function (i, tabContent) {
                var tabPanes = $(tabContent).children(".tab-pane");
                $.each(tabPanes, function (i, tabPane) {
                    $(tabPane).removeClass("active");
                })
                $(tabPanes.get(0)).addClass("active");
            })
        }
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
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 添加
     */
    $scope.add = function () {
        $scope.initModal();
        $scope.saveType = "save";
        $scope.data.currItem = {};
        //setGridData($scope.lineGridView, []);
        lineMaxSeq = 0;
        $scope.$digest();
    }

    /**
     * 编辑
     */
    function edit(args) {
        $scope.initModal();
        $scope.saveType = "update";
        var postData = {};
        postData.objtypeid = args.grid.getDataItem(args.row).objtypeid;
        postData.formclass = args.grid.getDataItem(args.row).formclass;
        BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                //setGridData($scope.lineGridView, data.objrptconfofobjconfs);
                setGridData($scope.lineGridViewWflow, data.objwftempofobjconfs);
                if($scope.data.currItem.objrptconfofobjconfs){
                    lineMaxSeq = $scope.data.currItem.objrptconfofobjconfs.length;
                }
                if($scope.data.currItem.objwftempofobjconfs){
                    lineWflowMaxSeq = $scope.data.currItem.objwftempofobjconfs.length;
                }
                $("#attributeModal").modal();
            });
        $scope.$digest();
    };

    /**
     * 保存
     */
    $scope.save = function () {
        //if ($scope.lineGridView.getCellEditor() != undefined) {
        //    $scope.lineGridView.getCellEditor().commitChanges();
        //}
        if ($scope.lineGridViewWflow.getCellEditor() != undefined) {
            $scope.lineGridViewWflow.getCellEditor().commitChanges();
        }
        //$scope.data.currItem.objrptconfofobjconfs = $scope.lineGridView.getData();
        $scope.data.currItem.objwftempofobjconfs = $scope.lineGridViewWflow.getData();
        if ($scope.saveType=="update") {
            BasemanService.RequestPost("scpobjconf", "update", $scope.data.currItem)
                .then(function (data) {
                    $scope.searchData();
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            BasemanService.RequestPost("scpobjconf", "insert", $scope.data.currItem)
                .then(function (data) {
                    $scope.searchData();
                    BasemanService.notice("保存成功！", "alert-success");
                });
        }
    };

    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.objtypeid = args.grid.getDataItem(args.row).objtypeid;
        var name = args.grid.getDataItem(args.row).objtypename;
        if(confirm("确定要删除对象 "+name+" 吗？")){
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("scpobjconf", "delete", JSON.stringify(postData))
                .then(function (data) {
                    dg.getData().splice(rowidx, 1);
                    dg.invalidateAllRows();
                    dg.render();
                    BasemanService.notice("删除成功！", "alert-success");//warning
                });
        }
    };


    /**
     * 新增 - 明细 - 工作流
     */
    $scope.addlineRowWflow = function () {
        var ldg = $scope.lineGridViewWflow;
        lineWflowMaxSeq = lineWflowMaxSeq+1;
        if (ldg.getData()) {
            ldg.getData().push({"seq":lineWflowMaxSeq});
        } else {
            ldg.setData([{"seq":lineWflowMaxSeq}]);
        }
        ldg.resizeCanvas();
        ldg.invalidateAllRows();
        ldg.updateRowCount();
        ldg.render();
    }

    /**
     * 删除 - 明细 - 工作流
     */
    function delLineWflow(args){
        var ldg = $scope.lineGridViewWflow;
        var rowidx = args.row;
        if(confirm("确定要删除吗？")){
            ldg.getData().splice(rowidx, 1);
            ldg.invalidateAllRows();
            ldg.render();
        }
    };

    /**
     * 通用查询 - 工作流
     */
    function searchFdr(args) {
        $scope.FrmInfo = {
            title: "流程模板查询",
            thead: [{
                name: "名称",
                code: "wftempname"
            }, {
                name: "时间",
                code: "createtime"
            }],
            classid: "scpwftemp",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "wftempofwftemps",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300,
            },
            searchlist: ["wftempname", "createtime"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            var ldg = $scope.lineGridViewWflow;
            args.grid.getDataItem(args.row).wftempname = result.wftempname;
            args.grid.getDataItem(args.row).wftempid = result.wftempid;
            ldg.invalidateAllRows();
            ldg.render();
        });
    }

    //网格高度自适应
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('scpobjconf', scpobjconf)