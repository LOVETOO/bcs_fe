
function item_org($scope, BasemanService, BaseService ) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.currItemIntf = {};

    $scope.userbean= userbean;

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
           // "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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
            name: "操作",
            width: 60,
            formatter: editHeaderButtons
        },
        {
            id: "item_code",
            name: "产品编码",
            field: "item_code",
            width: 130,
            type: "string"
        },
        {
            id: "item_name",
            name: "产品名称",
            field: "item_name",
            width: 200,
            type: "string"
        },
        {
            id: "item_class1_name",
            name: "产品大类",
            field: "item_class1_name",
            width: 100,
            type: "string"
        },
        {
            id: "item_class2_name",
            name: "产品中类",
            field: "item_class2_name",
            width: 100,
            type: "string"
        },
        {
            id: "item_class3_name",
            name: "产品小类",
            field: "item_class3_name",
            width: 100,
            type: "string"
        },
        {
            id: "spec_qty",
            name: "包装数量",
            field: "spec_qty",
            width: 120,
            type: "string"
        },
        {
            id: "cubage",
            name: "体积",
            field: "cubage",
            width: 80,
            type: "number"
        },
        {
            id: "uom_name",
            name: "单位",
            field: "uom_name",
            width: 50,
            type: "string"
        },
        {
            id: "gross_weigth",
            name: "毛重",
            field: "gross_weigth",
            width: 80,
            type: "number"
        },
        {
            id: "net_weigth",
            name: "净重",
            field: "net_weigth",
            width: 80,
            type: "number"
        },
        {
            id: "uom_name",
            name: "单位",
            field: "uom_name",
            width: 50,
            type: "string"
        },
        {
            id: "item_usable",
            name: "有效",
            field: "item_usable",
            width: 50,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },
        {
            id: "can_sale",
            name: "可销售",
            field: "can_sale",
            width: 70,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },
        {
            id: "is_retail",
            name: "零售",
            field: "is_retail",
            width: 50,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },
        {
            id: "is_wl",
            name: "推广物料",
            field: "is_wl",
            width: 100,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },
        {
            id: "is_special_supply",
            name: "专供",
            field: "is_special_supply",
            width: 50,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },{
            id: "is_old",
            name: "老品",
            field: "is_old",
            width: 50,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },
        {
            id: "is_close",
            name: "封闭品",
            field: "is_close",
            width: 70,
            type: "string",
            formatter:Slick.Formatters.YesNo
        },
        {
            id: "item_desc",
            name: "产品描述",
            field: "item_desc",
            width: 200,
            type: "string"
        },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 150,
            type: "string"
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){$scope.viewDetail(args)});

    /**
     * 事件判断
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 查询
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0"
            }
        }
        postdata.searchflag = 1;
        BasemanService.RequestPost("item_org", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.item_orgs);
            //重绘网格
            $scope.headerGridView.render();
        });
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
        postdata.searchflag = 1;
        BasemanService.RequestPost("item_org", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.item_orgs);
            //重绘网格
            $scope.headerGridView.render();
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.searchData();
    }



    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = index + i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({"style":{width:1050,height:500},"url": "/index.jsp#/baseman/item_org_pro/" + args.grid.getDataItem(args.row).item_org_id,
            "title":"产品资料","obj":$scope,"action":"update",ondestroy: $scope.refresh});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        BasemanService.openModal({"style":{width:1050,height:500},"url": "/index.jsp#/baseman/item_org_pro/0","title":"产品资料",
            "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
    };


    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.item_org_id = args.grid.getDataItem(args.row).item_org_id;
        var item_name = args.grid.getDataItem(args.row).item_name;
        BasemanService.swalWarning("删除", "确定要删除 " +item_name+ " 吗？", function (bool) {
            if (bool) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("item_org", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        BasemanService.notice("删除成功！", "alert-success");
                    });
            }else {
                return;
            }
        });
    };
    /**
     * 获取接口对象
     */
    $scope.importData = function(){
        //获取接口对象
        var postData = {};
        postData.intfid = 88;
        BasemanService.RequestPost("cpcintf", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItemIntf = data;
                var now = new Date();
                $scope.data.currItemIntf.param2 = now.Format("yyyy-MM-dd");
                now.setDate(now.getDate() - 1);
                $scope.data.currItemIntf.param1 = now.Format("yyyy-MM-dd");
            });
    };

    /**
     * 执行接口
     */
    $scope.executeIntf = function () {
        BasemanService.RequestPost("cpcintf", "execute", JSON.stringify($scope.data.currItemIntf)).then(function (data) {
            BasemanService.notice(
                "执行接口\“"+data.intfname+"\”成功！源纪录数："
                +data.sourcecount+" 操作成功记录数："+data.targetcount
                ,"alert-success");//warning
        });
    }

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/authman.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "item_org",
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
    .controller('item_org', item_org)