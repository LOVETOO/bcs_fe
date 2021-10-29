/**
 *岗位管理
 * 2018-1-25 by mjl
 */
function sale_salearea($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};


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
        {   name: "序号",
            field: "seq",
            width: 45
        },
        {
            name: "区域编码",
            field: "sale_area_code",
            width: 200
        },
        {
            name: "区域名称",
            field: "sale_area_name",
            width: 200
        },
        {
            name: "所属大区",
            field: "sales_big_area",
            width: 200,
            dictcode:"."
        },
        {
            name: "区域描述",
            field: "area_note",
            width: 200
        },
        {
            name: "操作",
            width: 200,
            formatter: editHeaderButtons
        }
    ];

    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.headerColumns
    });

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
        postdata.search_flag = 3;
        BasemanService.RequestPost("sale_salearea", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.sale_saleareas);
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
        BasemanService.openModal({"style":{width:800,height:500},"url": "/index.jsp#/baseman/sale_salearea_pro/" + args.grid.getDataItem(args.row).sale_area_id,
            "title":"销售区域","obj":$scope,"action":"update",ondestroy: $scope.refresh});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        BasemanService.openModal({"style":{width:800,height:500},"url": "/index.jsp#/baseman/sale_salearea_pro/0","title":"销售区域",
            "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
    };


    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.sale_area_id = args.grid.getDataItem(args.row).sale_area_id;
        var sale_area_name = args.grid.getDataItem(args.row).sale_area_name;
        BasemanService.swalDelete("删除", "确定要删除 " + sale_area_name + " 吗？", function (bool) {
            if (bool) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("sale_salearea", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                    });
            }else {
                return;
            }
        });
    };


    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('sale_salearea', sale_salearea)