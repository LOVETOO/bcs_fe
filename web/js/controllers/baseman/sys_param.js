/**
 * 系统参数
 * 2018-1-29 by mjl
 */
function sys_param($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};
    //分类
    $scope.conftypes = [];
    //类型
    $scope.datatypes = [];

    //词汇表系统参数分类取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "conftypes"})
        .then(function (data) {
            $scope.conftypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
            var conftypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                conftypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'conftype')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'conftype')].options = conftypes;
                $scope.headerGridView.setColumns($scope.headerColumns);
            }
        });

    //词汇表系统参数类型取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "datatypes"})
        .then(function (data) {
            $scope.datatypes = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
            var datatypes = [];
            for (var i = 0; i < data.dicts.length; i++) {
                datatypes[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'datatype')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'datatype')].options = datatypes;
                $scope.headerGridView.setColumns($scope.headerColumns);
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

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>" +
            "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45
        },
        {
            id: "confdesc",
            name: "参数名称",
            behavior: "select",
            field: "confdesc",
            width: 250,
        },
        {
            id: "conftype",
            name: "分类",
            behavior: "select",
            field: "conftype",
            width: 80,
            options: [],
            formatter: Slick.Formatters.SelectOption,
        },
        {
            id: "datatype",
            name: "类型",
            behavior: "select",
            field: "datatype",
            width: 70,
            options: [],
            formatter: Slick.Formatters.SelectOption,
        },
        {
            id: "confvalue",
            name: "值",
            behavior: "select",
            field: "confvalue",
            width: 300,
        },
        {
            id: "note",
            name: "备注",
            behavior: "select",
            field: "note",
            width: 230,
        },
        {
            name: "操作",
            editable: false,
            width: 90,
            formatter: editHeaderButtons
        }
    ];
    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);
    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){edit(args)});
    /**
     * 事件判断
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
     * 加载工作区
     */
    $scope.searchws = function () {
        BasemanService.RequestPost("scpsysconf", "selectref", {}).then(function (data) {
            setGridData($scope.headerGridView, data.sysconfs);
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.data.searchItem = {};
        $scope.searchws();
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
        $scope.data.currItem = {};
        $scope.data.currItem.conftype = '3';
        $scope.data.currItem.datatype = 'varchar';
        $scope.$digest();
        //$scope.$apply();
    }

    /**
     * 编辑
     */
    function edit(args) {
        $scope.initModal();
        $scope.data.currItem = args.grid.getDataItem(args.row);
        $("#attributeModal").modal();
        $scope.$digest();
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.data.currItem.confid > 0) {
            BasemanService.RequestPost("scpsysconf", "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.searchws();
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            BasemanService.RequestPost("scpsysconf", "insert", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.searchws();
                    BasemanService.notice("保存成功！", "alert-success");//warning
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
        postData.confname = args.grid.getDataItem(args.row).confname;
        var confdesc = args.grid.getDataItem(args.row).confdesc;
        if(confirm("确定要删除对象 "+confdesc+" 吗？")){
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("scpsysconf", "delete", JSON.stringify(postData))
                .then(function (data) {
                    dg.getData().splice(rowidx, 1);
                    dg.invalidateAllRows();
                    dg.render();
                    BasemanService.notice("删除成功！", "alert-success");//warning
                });
        }
    };

    /**
     * 查询方法
     */
    $scope.search = function () {
        BasemanService.RequestPost("scpsysconf","search",JSON.stringify($scope.data.searchItem)).then(function (data) {
            setGridData($scope.headerGridView,data.sysconfs);
        })
    }

    //网格高度自适应
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia')
    .controller('sys_param', sys_param)