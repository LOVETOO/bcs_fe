/**
 * 调度管理
 * 2018-3-20 by mjl
 */
function scpscheduler($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};

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
    //间隔单位（1分钟；2小时；3天；4月）
    $scope.intervalunits =[
        {id:1,name:'分钟'}
        ,{id:2,name:'小时'}
        ,{id:3,name:'天'}
        ,{id:4,name:'月'}
    ];
    //服务器类型:1主服务器;2消息服务器;3所有
    $scope.servertypes =[
        {id:1,name:'主服务器'}
            ,{id:2,name:'消息服务器'}
            ,{id:3,name:'所有'}
        ]
    //自动运行
    $scope.autoruns =[
        {value:'1',desc:'否'}
        ,{value:'2',desc:'是'}
    ]
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45
        },
        {   id: "schedulername",
            name: "调度名称",
            field: "schedulername",
            width: 160
        },
        {   id: "autorun",
            name: "自动运行",
            field: "autorun",
            width: 70,
            options: $scope.autoruns,
            formatter: Slick.Formatters.SelectOption,
        },
        {   id: "runinterval",
            name: "间隔时间",
            field: "runinterval",
            width: 70
        },
        {   id: "intervalunit",
            name: "间隔单位",
            field: "intervalunit",
            width: 70,
            options: [
                {value:'1',desc:'分钟'}
                ,{value:'2',desc:'小时'}
                ,{value:'3',desc:'天'}
                ,{value:'4',desc:'月'}
            ],
            formatter: Slick.Formatters.SelectOption,
        },
        {   id: "nexttime",
            name: "开始/下次运行时间",
            field: "nexttime",
            width: 156
        },
        {   id: "lasttime",
            name: "上次运行时间",
            field: "lasttime",
            width: 156
        },
        {   id: "totalcount",
            name: "已经运行次数",
            field: "totalcount",
            width: 98
        },
        {   id: "maxcount",
            name: "最大运行次数",
            field: "maxcount",
            width: 98
        },
        {   id: "aheaddays",
            name: "月末提前执行天数",
            field: "aheaddays",
            width: 124
        },
        {   id: "pausetime",
            name: "暂停时间",
            field: "pausetime",
            width: 156
        },
        {   id: "resumetime",
            name: "重新开始时间",
            field: "resumetime",
            width: 156
        },
        {   id: "noticeuser",
            name: "运行失败时通知用户",
            field: "noticeuser",
            width: 136
        },
        {   id: "param1",
            name: "参数1",
            field: "param1",
            width: 100
        },
        {   id: "param2",
            name: "参数2",
            field: "param2",
            width: 100
        },
        {   id: "param3",
            name: "参数3",
            field: "param3",
            width: 100
        },
        {   id: "note",
            name: "说明",
            field: "note",
            width: 180
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
    var datetimepickerSetting = {
        language: 'ch',
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
    }
    $('#nexttime').datetimepicker(datetimepickerSetting);

    /**
     * 加载工作区
     */
    $scope.searchws = function () {
        BasemanService.RequestPost("scpscheduler", "search", {}).then(function (data) {
            setGridData($scope.headerGridView, data.schedulers);
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
        $scope.data.currItem.serverid = "*";
        $scope.data.currItem.autorun =1;
        $scope.data.currItem.intervalunit =1;
        $scope.data.currItem.servertype =1;
        $scope.data.currItem.pausetime ="";
        $scope.data.currItem.objtype =23;
        $scope.$digest();
        //$scope.$apply();
    }

    /**
     * 编辑
     */
    function edit(args) {
        $scope.initModal();
        var postData = {};
        postData.schedulerid = args.grid.getDataItem(args.row).schedulerid;
        BasemanService.RequestPost("scpscheduler", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                $("#attributeModal").modal();
                $scope.$digest();
            });
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.data.currItem.schedulerid > 0) {
            BasemanService.RequestPost("scpscheduler", "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.searchws();
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            BasemanService.RequestPost("scpscheduler", "insert", JSON.stringify($scope.data.currItem))
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
        postData.schedulerid = args.grid.getDataItem(args.row).schedulerid;
        var tipName = args.grid.getDataItem(args.row).schedulername;
        if(confirm("确定要删除 "+tipName+" 吗？")){
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("scpscheduler", "delete", JSON.stringify(postData))
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
        BasemanService.RequestPost("scpscheduler","search",JSON.stringify($scope.data.searchItem)).then(function (data) {
            setGridData($scope.headerGridView,data.schedulers);
        })
    }

    //网格高度自适应
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia')
    .controller('scpscheduler', scpscheduler)