var param = {};

function setData(e){
    param = e;
}

function sale_employee_pro($scope, $location, $rootScope, $stateParams, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {sale_employee_id: $stateParams.id};

    //添加按钮
    var lineButtons = function (row, cell, value, columnDef, dataContext) {
        return  "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    $scope.sales_big_areas = [
        {id: 1, name: "浙江大区"},
        {id: 2, name: "上海大区"},
        {id: 3, name: "江苏大区"},
        {id: 4, name: "皖赣闽大区"},
        {id: 5, name: "南方大区"},
        {id: 6, name: "北方大区"},
        {id: 7, name: "综合大区"},
        {id: 8, name: "常规"}
    ];

    $scope.checkUsable = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.isuseable = 2;
        }else{
            $scope.data.currItem.isuseable = 1;
        }
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
    };
    //定义网格字段 - 包含机构用户列表
    $scope.lineOrgUserColumns = [
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
            id: "sale_area_code",
            name: "销区编码",
            behavior: "select",
            field: "sale_area_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "sale_area_name",
            name: "销区名称",
            behavior: "select",
            field: "sale_area_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            name: "操作",
            editable: false,
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: lineButtons
        }
    ];

    $scope.lineOrgUserColumns1 = [
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
            id: "dept_code",
            name: "运营中心编码",
            behavior: "select",
            field: "dept_code",
            editable: false,
            filter: 'set',
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            id: "dept_name",
            name: "运营中心名称",
            behavior: "select",
            field: "dept_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        },
        {
            name: "操作",
            editable: false,
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: lineButtons
        }
    ];

    //明细网格 - 包含机构用户列表
    $scope.lineGridView = new Slick.Grid("#linegridview", [], $scope.lineOrgUserColumns, $scope.headerOptions);

    $scope.lineGridView1 = new Slick.Grid("#linegridview1", [], $scope.lineOrgUserColumns1, $scope.headerOptions);

    //明细网格 - 包含机构用户列表 - 绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);

    $scope.lineGridView1.onClick.subscribe(dgLineClick1);


    /**
     * 初始化
     * @param args
     */
    $scope.init = function () {
        if ($scope.data.currItem.sale_employee_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sale_employee", "select", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView, data.sale_employee_saleareaofsale_employees);
                    setGridData($scope.lineGridView1, data.deptofsale_employees);
                });
        } else {
            $scope.data.currItem = {
                "sale_employee_id": 0
            };
        }
    };


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
     * 明细网格点击事件
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("delbtn")) {
            delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    /**
     * 明细网格点击事件
     */
    function dgLineClick1(e, args) {
        if ($(e.target).hasClass("delbtn")) {
            delLineRow1(args);
            e.stopImmediatePropagation();
        }
    };


    /**
     * 保存
     */
    $scope.save = function () {
        var action = param.action;
        if (action == "update") {
            //调用后台保存方法
            BasemanService.RequestPost("sale_employee", action, JSON.stringify($scope.data.currItem))
                .then(function () {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
        if (action == "insert") {
            BasemanService.RequestPost("sale_employee", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
    };

    /**
     * 删除所辖地区
     */
    function delLineRow(args){
        var dg = $scope.lineGridView;
        var rowidx = args.row;
        var sale_area_name = args.grid.getDataItem(args.row).sale_area_name;
        if(confirm("确定要删除 "+sale_area_name+" 吗？")){
            //删除网格数据
            dg.getData().splice(rowidx, 1);
            dg.invalidateAllRows();
            dg.render();
        }
    };


    function delLineRow1(args){
        var dg = $scope.lineGridView1;
        var rowidx = args.row;
        var dept_name = args.grid.getDataItem(args.row).dept_name;
        if(confirm("确定要删除 "+dept_name+" 吗？")){
            //删除网格数据
            dg.getData().splice(rowidx, 1);
            dg.invalidateAllRows();
            dg.render();
        }
    };


    /**
     * 添加 - 包含地区
     */
    function addLineRow(result) {
        if(typeof ($scope.data.currItem.sale_employee_saleareaofsale_employees) == 'undefined'){
            $scope.data.currItem.sale_employee_saleareaofsale_employees = [];
        }
        var isExist = false;
        for(var i in $scope.data.currItem.sale_employee_saleareaofsale_employees){
            if($scope.data.currItem.sale_employee_saleareaofsale_employees[i].sale_area_code == result.sale_area_code){
                isExist = true;
                break;
            }
        }
        if(!isExist){
            $scope.data.currItem.sale_employee_saleareaofsale_employees.push(result);
        }
        setGridData($scope.lineGridView, $scope.data.currItem.sale_employee_saleareaofsale_employees)
    }

    /**
     * 添加 - 包含地区
     */
    function addLineRow1(result) {
        if(typeof ($scope.data.currItem.deptofsale_employees) == 'undefined'){
            $scope.data.currItem.deptofsale_employees = [];
        }
        var isExist = false;
        for(var i in $scope.data.currItem.deptofsale_employees){
            if($scope.data.currItem.deptofsale_employees[i].dept_code == result.dept_code){
                isExist = true;
                break;
            }
        }
        if(!isExist){
            $scope.data.currItem.deptofsale_employees.push(result);
        }
        setGridData($scope.lineGridView1, $scope.data.currItem.deptofsale_employees)
    }

    /**
     * 通用查询
     */
    $scope.searchEmployee = function () {
        $scope.FrmInfo = {
            title: "员工查询",
            thead: [{
                name: "员工编码",
                code: "employee_code"
            }, {
                name: "员工名称",
                code: "employee_name"
            }],
            classid: "erpemployee",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "erpemployees",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["employee_code", "employee_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.employee_id = result.employee_id;
            $scope.data.currItem.employee_code = result.employee_code;
            $scope.data.currItem.employee_name = result.employee_name;
        })
    };


    /**
     * 通用查询
     */
    $scope.searchSaleArea = function () {
        $scope.FrmInfo = {
            title: "地区查询",
            thead: [{
                name: "销区编码",
                code: "sale_area_code"
            }, {
                name: "销区名称",
                code: "sale_area_name"
            }],
            classid: "sale_salearea",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "sale_saleareas",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["sale_area_code", "sale_area_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            addLineRow(result);
        })
    };

    /**
     * 通用查询
     */
    $scope.searchDept = function () {
        $scope.FrmInfo = {
            title: "运营中心",
            thead: [{
                name: "编码",
                code: "dept_code"
            }, {
                name: "名称",
                code: "dept_name"
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300,
                search_flag:5,
                sqlwhere:'dept_type = 6'
            },
            searchlist: ["dept_code", "dept_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            addLineRow1(result);
        })
    };

    $scope.checkUsable = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.isuseable = 2;
        }else{
            $scope.data.currItem.isuseable = 1;
        }
    };

    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        isEdit = 0;
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();
}
//注册控制器
angular.module('inspinia')
    .controller('sale_employee_pro', sale_employee_pro)