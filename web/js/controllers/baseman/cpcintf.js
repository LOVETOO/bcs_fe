/**
 * 接口定义
 * 2018-3-21 by mjl
 */
function scpintf($scope, $location, $rootScope, $modal, $timeout, $q, BasemanService, notify, $state, localeStorageService, FormValidatorService, Magic) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};
    //类参数
    var classid = "scpintf";
    $scope.headerName = "接口定义";

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
        {   id: "intfname",
            name: "接口名称",
            field: "intfname",
            width: 170
        },
        {   id: "dsname",
            name: "外部数据源",
            field: "dsname",
            width: 98
        },
        {   id: "schedulerdesc",
            name: "调度",
            field: "schedulerdesc",
            width: 450
        },
        {   id: "note",
            name: "备注",
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
    //操作类型：1新增；2修改；3同步
    $scope.opertypes =[
        {id:1,name:'新增记录'}
        ,{id:2,name:'修改记录'}
        ,{id:3,name:'同步记录'}
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
        var postData = {};
        postData.intftype = 0;
        BasemanService.RequestPost(classid, "selectall", postData).then(function (data) {
            setGridData($scope.headerGridView, data.intfs);
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
        $scope.data.currItem.runstyle = 2;
        $scope.$digest();
        //$scope.$apply();
    }

    /**
     * 编辑
     */
    function edit(args) {
        $scope.initModal();
        var postData = {};
        postData.intfid = args.grid.getDataItem(args.row).intfid;
        BasemanService.RequestPost(classid, "select", JSON.stringify(postData))
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
        if ($scope.data.currItem.intfid > 0) {
            BasemanService.RequestPost(classid, "update", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.searchws();
                    BasemanService.notice("保存成功！", "alert-success");
                });
        } else {
            BasemanService.RequestPost(classid, "insert", JSON.stringify($scope.data.currItem))
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
        postData.intfid = args.grid.getDataItem(args.row).intfid;
        var tipName = args.grid.getDataItem(args.row).intfname;
        if(confirm("确定要删除 "+tipName+" 吗？")){
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost(classid, "delete", JSON.stringify(postData))
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
        BasemanService.RequestPost(classid,"search",JSON.stringify($scope.data.searchItem)).then(function (data) {
            setGridData($scope.headerGridView,data.intfs);
        })
    }

    //通用查询 - 调度
    $scope.searchScheduler = function () {
        $scope.FrmInfo = {
            title: "调度查询",
            thead: [{
                name: "调度名称",
                code: "schedulername"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "scpscheduler",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "objid = 0 and objtype=23",
            backdatas: "schedulers",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 100
            },
            searchlist: ["schedulername", "note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.schedulerdesc = result.schedulername;
            $scope.data.currItem.schedulerid = parseInt(result.schedulerid);
        })
    };


    //通用查询 - 外部数据源
    $scope.searchDs = function () {
        $scope.FrmInfo = {
            title: "外部数据源查询",
            thead: [{
                name: "名称",
                code: "dbname"
            }, {
                name: "备注",
                code: "note"
            }],
            classid: "rptds",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "dss",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 100
            },
            searchlist: ["dbname", "note"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.dsname = result.dsname;
            $scope.data.currItem.dsid = result.dsid;
        })
    };

    /**
     * 执行接口
     */
    $scope.executeIntf = function () {
        return $q
            .when()
            .then(function () {
                return Magic.swalConfirm({
                    title: '确定要执行接口吗？',
                    closeOnConfirm: false //点击确定后不消失
                });
            })
            .then(function () {
                Magic.swalInfo({
                    title: '执行中，请稍候...',
                    timer: null //超时不消失
                });
            })
            .then(function () {
                return BasemanService.RequestPost("scpintf", "execute", JSON.stringify($scope.data.currItem));
            })
            .then(function (data) {
                return Magic.swalSuccess({
                    title: [
                        '执行接口“' + data.intfname + '”成功！',
                        '源纪录数：' + data.sourcecount,
                        '操作成功记录数：' + data.targetcount
                    ],
                    timer: null //超时不消失
                });
            }, Magic.defaultCatch)
        ;
        
        /*BasemanService.RequestPost("scpintf", "execute", JSON.stringify($scope.data.currItem)).then(function (data) {
            BasemanService.notice(
                "执行接口\“"+data.intfname+"\”成功！源纪录数："
                +data.sourcecount+" 操作成功记录数："+data.targetcount
                ,"alert-success");//warning
        });*/
    }

    /**
     *  测试链接
     */
    $scope.testIntf = function () {
        BasemanService.RequestPost("scpintf", "test", JSON.stringify($scope.data.currItem)).then(function (data) {

            BasemanService.notice("测试连接\“"+data.intfname+"\”成功！", "alert-success");//warning
        });
    }

    //网格高度自适应
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia')
    .controller('scpintf', scpintf)