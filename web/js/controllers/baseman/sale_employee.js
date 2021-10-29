/**
 *业务员
 */
function sale_employee($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};


    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>" ;
            //"<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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
            behavior: "select",
            cssClass: "cell-selection",
            width: 45,
            cannotTriggerInsert: true,
            resizable: false,
            selectable: false,
            focusable: false
        },
        {
            name: "操作",
            editable: false,
            width: 70,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        },
        {
            id: "employee_code",
            name: "业务员编码",
            behavior: "select",
            field: "employee_code",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
        },
        {
            id: "employee_name",
            name: "业务员名称",
            behavior: "select",
            field: "employee_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
        },
        ,
        {
            id: "isuseable",
            name: "有效",
            field: "isuseable",
            width: 80,
            formatter:Slick.Formatters.YesNo
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
     function searchData(postdata) {
        if (!postdata) {
            postdata = {}
        }
        if (!postdata.pagination) {
            postdata.pagination = BasemanService.initPagePostdata($scope)
        }
        if($scope.sqlwhere){
            postdata.sqlwhere = $scope.sqlwhere
        }
        BasemanService.RequestPost("sale_employee", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.sale_employees);
        });
    }
    $scope.searchData = searchData

    //高级查询
    $scope.searchBySql = function () {
        BasemanService.searchBySql($scope, $scope.headerColumns,searchData)
    }


    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.sqlwhere = ""
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
        BasemanService.openModal({"style":{width:800,height:500},"url": "/index.jsp#/baseman/sale_employee_pro/" + args.grid.getDataItem(args.row).sale_employee_id,
            "title":"业务员资料","obj":$scope,"action":"update",
            ondestroy: $scope.searchData});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        BasemanService.openModal({"style":{width:800,height:500},"url": "/index.jsp#/baseman/sale_employee_pro/0",
            "title":"业务员资料","obj":$scope,"action":"insert",
            ondestroy: $scope.refresh});
    };


    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.sale_employee_id = args.grid.getDataItem(args.row).sale_employee_id;
        var employee_name = args.grid.getDataItem(args.row).employee_name;
        BasemanService.swalDelete("删除", "确定要删除 " +employee_name+ " 吗？", function (bool) {
            if (bool) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("sale_employee", "delete", JSON.stringify(postData))
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
    .controller('sale_employee', sale_employee)