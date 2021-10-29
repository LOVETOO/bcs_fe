/**
 * 客户资料
 * 2018-4-18 by mjl
 */
function customer($scope, $location, $rootScope, $modal, $timeout, BasemanService,BaseService , notify, $state,localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};
    $scope.data.customer_org_data={};
    $scope.data.currItemIntf = {};
    $scope.sqlwhere = "";
    $scope.userbean = userbean;

    //明细序号
    var lineMaxSeq = 0;
    //发货类型
    $scope.sale_types = [];
    //类型
    $scope.datatypes = [];

    //收入确认方式//1 出库确认 2 开票确认
    $scope.ar_types = [
        {id: 1, name: '出库确认'},
        {id: 2, name: '开票确认'}];
    //纳税人类型-1 一般纳税人 2 小规模纳税人
    $scope.tax_types = [
        {id: 1, name: '一般纳税人'},
        {id: 2, name: '小规模纳税人'}];

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
            //+"<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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

/*        enableCellNavigation: true,
        enableColumnReorder: false,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        explicitInitialization: true*/
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
            editable: false,
            width: 60,
            formatter: editHeaderButtons
        },
        {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            //columnGroup: "客户",
            width: 100,
            type: "string"
        },
        {
            id: "customer_code",
            name: "客户名称",
            field: "customer_name",
            //columnGroup: "客户",
            width: 190
            ,type: "string"
        },
        /*{
            id: "customer_name_en",
            name: "名称（英文）",
            field: "customer_name_en",
            columnGroup: "客户",
            width: 150,
        },*/
        {
            id: "short_name",
            name: "客户简称",
            field: "short_name",
            //columnGroup: "客户",
            width: 110,
            type: "string"
        },
        {
            id: "customer_type",
            name: "客户类型",
            field: "customer_type",
            width: 100,
            options: $scope.customer_type,
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
        {
            id: "saleprice_type_name",
            name: "价格类型",
            field: "saleprice_type_name",
            width: 120,
            options: [],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },

        {
            id: "dept_code",
            name: "运营中心编码",
            field: "dept_code",
            //columnGroup: "运营中心",
            width: 100,
            type: "string"
        },
        {
            id: "dept_name",
            name: "运营中心名称",
            field: "dept_name",
            //columnGroup: "运营中心",
            width: 100,
            type: "string"
        },
        {
            id: "attribute3",
            name: "位置代码",
            field: "attribute3",
            width: 100,
            type: "string"
        },
        {
            id: "areacode",
            name: "行政区域编码",
            field: "areacode",
            //columnGroup: "行政区域",
            width: 100,
            type: "string"
        },
        {
            id: "areaname",
            name: "行政区域名称",
            field: "areaname",
            //columnGroup: "行政区域",
            width: 100,
            type: "string"
        },
        {
            id: "is_relation",
            name: "关联客户",
            field: "is_relation",
            width: 90,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },{
            id: "sale_type",
            name: "发货类型",
            field: "sale_type",
            width: 75,
            options: $scope.sale_types,
            formatter: Slick.Formatters.SelectOption,
            type:"list"
        },
        {
            id: "employee_code",
            name: "销售业务员编码",
            field: "employee_code",
            //columnGroup: "销售业务员",
            width: 120,
            type: "string"
        },
        {
            id: "employee_name",
            name: "销售业务员名称",
            field: "employee_name",
            //columnGroup: "销售业务员",
            width: 120,
            type: "string"
        },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 100,
            type: "string"
        },
        {
            id: "created_by",
            name: "创建人",
            field: "created_by",
            width: 60,
            type: "string"

        },
        /*{
            id: "creation_date",
            field: "creation_date",
            name: "创建日期",
            field:60,
        },*/


        /*{
            id: "sale_area_code",
            name: "所属辖区名称",
            field: "sale_area_code",
            width: 120,
        },
        {
            id: "sale_area_name",
            name: "所属辖区名称",
            field: "sale_area_name",
            width: 120,
        },*/

    ];

    //网格设置
    $scope.viewOptions = {
        // enableCellNavigation: true,
        // enableColumnReorder: false,
        // editable: false,
        // asyncEditorLoading: false,
        // autoEdit: true,
        // autoHeight: false,
        enableCellNavigation: true,
        enableColumnReorder: false,
        createPreHeaderPanel: true,
        showPreHeaderPanel: true,
        explicitInitialization: true
    };

    //初始化表格
    $scope.dataView = new Slick.Data.DataView();
    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", $scope.dataView, $scope.headerColumns, $scope.headerOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){$scope.viewDetail(args)});


    //词汇表系统参数分类取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_types"})
        .then(function (data) {
            $scope.sale_types = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
            var sale_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                sale_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'sale_type')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'sale_type')].options = sale_types;
                $scope.headerGridView.setColumns($scope.headerColumns);
            }
        });

    //词汇表系统参数分类取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "customer_types"})
        .then(function (data) {
            $scope.customer_types = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
            var customer_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                customer_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'customer_type')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'customer_type')].options = customer_types;
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
     * 加载工作区
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
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0",
                search_flag: 10
            }
        }
        postdata.sqlwhere = $scope.sqlwhere;
        BasemanService.RequestPost("customer_org", "search", postdata).then(function (data) {
            setGridData($scope.headerGridView, data.customer_orgs);
            BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.sqlwhere = "";
        $scope.searchData();
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
     * 详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({/*"style":{width:1050,height:580},*/"url": "/index.jsp#/baseman/customer_pro/" + args.grid.getDataItem(args.row).customer_org_id,
            "title":"客户资料","obj":$scope,"action":"update",ondestroy: $scope.searchData});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        BasemanService.openModal({"style":{width:1050,height:580},"url": "/index.jsp#/baseman/customer_pro/0","title":"客户资料",
            "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
    };


    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.customer_org_id = args.grid.getDataItem(args.row).customer_org_id;
        var name = args.grid.getDataItem(args.row).customer_name;
        BasemanService.swalDelete("删除", "确定要删除 "+name+" 吗？", function (bool) {
            if (bool) {
                BasemanService.RequestPost("customer_org", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        BasemanService.swalSuccess("成功", "保存成功！");
                    });
            } else {
                return;
            }
        });
    };

    /**
     * 查询方法
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "customer_org",
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
    /**
     * 获取接口对象
     */
    $scope.importData = function(){
        //获取接口对象
        var postData = {};
        postData.intfid = 87;
        BasemanService.RequestPost("scpintf", "select", JSON.stringify(postData))
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
        BasemanService.RequestPost("scpintf", "execute", JSON.stringify($scope.data.currItemIntf)).then(function (data) {
            BasemanService.notice(
                "执行接口\“"+data.intfname+"\”成功！源纪录数："
                +data.sourcecount+" 操作成功记录数："+data.targetcount
                ,"alert-success");//warning
        });
    }

    //网格高度自适应
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);

}
//注册控制器
angular.module('inspinia')
    .controller('customer', customer)