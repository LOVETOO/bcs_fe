/**
 *岗位管理
 * 2018-1-25 by mjl
 */

var param = {};

function setData(e){
    param = e;
}

function item_org_pro($scope, $stateParams, BasemanService) {
    $scope.data = {};
    $scope.data.currItem = {item_org_id: $stateParams.id};


    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "item_pro"})
        .then(function (data) {
            $scope.item_pro = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

    $scope.item_usable = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.item_usable = 2;
        }else{
            $scope.data.currItem.item_usable = 1;
        }
    };
    $scope.can_sale = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.can_sale = 2;
        }else{
            $scope.data.currItem.can_sale = 1;
        }
    };
    $scope.is_retail = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_retail = 2;
        }else{
            $scope.data.currItem.is_retail = 1;
        }
    };
    $scope.is_wl = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_wl = 2;
        }else{
            $scope.data.currItem.is_wl = 1;
        }
    };
    $scope.is_old = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_old = 2;
        }else{
            $scope.data.currItem.is_old = 1;
        }
    };
    $scope.is_special_supply = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_special_supply = 2;
        }else{
            $scope.data.currItem.is_special_supply = 1;
        }
    };

    $scope.is_close = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_close = 2;
        }else{
            $scope.data.currItem.is_close = 1;
        }
    };
    $scope.is_eliminate = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_eliminate = 2;
        }else{
            $scope.data.currItem.is_eliminate = 1;
        }
    };

    $scope.is_round = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_round = 2;
        }else{
            $scope.data.currItem.is_round = 1;
        }
    };

    //添加按钮
    var lineButtons = function (row, cell, value, columnDef, dataContext) {
        return  "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    //添加按钮
    var lineButtons1 = function (row, cell, value, columnDef, dataContext) {
        return  "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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
    $scope.lineColumns = [
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
            id: "customer_code",
            name: "客户编码",
            behavior: "select",
            field: "customer_code",
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
            id: "customer_name",
            name: "客户名称",
            behavior: "select",
            field: "customer_name",
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

    //定义网格字段 - 渠道
    $scope.lineColumns1 = [
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
            name: "渠道编码",
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
            name: "渠道名称",
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
            formatter: lineButtons1
        }
    ];

    //定义网格字段 - 组织
    $scope.lineColumns2 = [
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
            id: "ent_code",
            name: "组织编码",
            behavior: "select",
            field: "ent_code",
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
            id: "ent_name",
            name: "组织名称",
            behavior: "select",
            field: "ent_name",
            editable: false,
            filter: 'set',
            width: 200,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true
        }
    ];

    //定义网格字段 - 产品工厂
    $scope.lineColumns3 = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45,
        },
        {
            id: "item_code",
            name: "产品编码",
            field: "item_code",
            width: 90,
        },
        {
            id: "factory_code",
            name: "工厂编码",
            field: "factory_code",
            width: 80,
        },
        {
            id: "factory_desc",
            name: "工厂名称",
            field: "factory_desc",
            width: 130,
        },
        {
            id: "mrp",
            name: "MRP控制者编码",
            field: "mrp",
            width: 115,
        },
        {
            id: "mrp_desc",
            name: "MRP控制者",
            field: "mrp_desc",
            width: 120,
        },
        {
            id: "ext_wh",
            name: "外部仓储地点",
            field: "ext_wh",
            width: 100,
        },{
            id: "stat",
            name: "物料状态",
            field: "stat",
            width: 90,
        },
        {
            id: "note",
            name: "状态描述",
            field: "note",
            width: 100,
        }
    ];

    //明细网格 - 专供客户
    $scope.lineGridView = new Slick.Grid("#linegridview", [], $scope.lineColumns, $scope.headerOptions);

    //明细网格 - 所属渠道
    $scope.lineGridView1 = new Slick.Grid("#linegridview1", [], $scope.lineColumns1, $scope.headerOptions);

    //明细网格 - 所属销售组织
    $scope.lineGridView2 = new Slick.Grid("#linegridview2", [], $scope.lineColumns2, $scope.headerOptions);

    //明细网格 - 产品工厂
    $scope.lineGridView3 = new Slick.Grid("#linegridview3", [], $scope.lineColumns3, $scope.headerOptions);

    //明细网格 - 绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);

    //明细网格 - 绑定点击事件
    $scope.lineGridView1.onClick.subscribe(dgLineClick1);

    /**
     * 明细网格点击事件
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("delbtn")) {
            delLineRow(args);
            e.stopImmediatePropagation();
        }
    }

    /**
     * 明细网格点击事件
     */
    function dgLineClick1(e, args) {
        if ($(e.target).hasClass("delbtn")) {
            delLineRow1(args);
            e.stopImmediatePropagation();
        }
    }

    /**
     * 删除专供客户
     */
    function delLineRow(args){
        var dg = $scope.lineGridView;
        var rowidx = args.row;
        var customer_name = args.grid.getDataItem(args.row).customer_name;
        BasemanService.swalWarning("提示","确定要删除 "+customer_name+" 吗？",function () {
            //删除网格数据
            dg.getData().splice(rowidx, 1);
            dg.invalidateAllRows();
            dg.render();
        });

    }

    /**
     * 删除专供客户
     */
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
    }

    /**
     * 初始化
     * @param args
     */
    $scope.init = function () {
        if ($scope.data.currItem.item_org_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("item_org", "select", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView, data.item_salecustofitem_orgs);
                    setGridData($scope.lineGridView1, data.item_salecenterofitem_orgs);
                    setGridData($scope.lineGridView2, data.item_saleentofitem_orgs);
                    setGridData($scope.lineGridView3, data.item_factory_relationofitem_orgs);
                });
        } else {
            $scope.data.currItem = {
                "item_org_id": 0
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
     * 通用查询
     */
    $scope.searchCustomer = function () {
        $scope.FrmInfo = {
            title: "客户查询",
            thead: [{
                name: "客户编码",
                code: "customer_code"
            }, {
                name: "客户名称",
                code: "customer_name"
            }],
            classid: "customer_org",
            url: "/jsp/authman.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "customer_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["customer_code", "customer_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            addLineRow(result);
        })
    };


    /**
     * 选择渠道所属销售中心
     */
    $scope.chooseSaleCenter = function chooseSaleCenter() {
        BasemanService.chooseSaleCenter({
            title: '选择所属渠道',
            scope: $scope,
            then: function (data) {
                addLineRow1(data);
            }
        });
    };


    /**
     * 添加 -
     */
    function addLineRow(result) {
        if(typeof ($scope.data.currItem.item_salecustofitem_orgs) == 'undefined'){
            $scope.data.currItem.item_salecustofitem_orgs = [];
        }
        var isExist = false;
        for(var i in $scope.data.currItem.item_salecustofitem_orgs){
            if($scope.data.currItem.item_salecustofitem_orgs[i].customer_code == result.customer_code){
                isExist = true;
                break;
            }
        }
        if(!isExist){
            result.item_id = $scope.data.currItem.item_id;
            result.item_code = $scope.data.currItem.item_code;
            result.item_name = $scope.data.currItem.item_name;
            $scope.data.currItem.item_salecustofitem_orgs.push(result);
        }
        setGridData($scope.lineGridView, $scope.data.currItem.item_salecustofitem_orgs)
    }

    /**
     * 添加 -
     */
    function addLineRow1(result) {
        if(typeof ($scope.data.currItem.item_salecenterofitem_orgs) == 'undefined'){
            $scope.data.currItem.item_salecenterofitem_orgs = [];
        }
        var isExist = false;
        for(var i in $scope.data.currItem.item_salecenterofitem_orgs){
            if($scope.data.currItem.item_salecenterofitem_orgs[i].dept_code == result.dept_code){
                isExist = true;
                break;
            }
        }
        if(!isExist){
            result.item_id = $scope.data.currItem.item_id;
            result.item_code = $scope.data.currItem.item_code;
            result.item_name = $scope.data.currItem.item_name;
            $scope.data.currItem.item_salecenterofitem_orgs.push(result);
        }
        setGridData($scope.lineGridView1, $scope.data.currItem.item_salecenterofitem_orgs)
    }

    /**
     * 保存
     */
    $scope.save = function () {
        var action = param.action;
        if (action == "update") {
            if(typeof ($scope.data.currItem.item_salecenterofitem_orgs) == 'undefined'){
                $scope.data.currItem.item_salecenterofitem_orgs = [];
            }
            if($scope.data.currItem.is_close==2&&$scope.data.currItem.item_salecenterofitem_orgs.length==0){
                BasemanService.swal("提示","封闭品必须添加产品渠道");
                return;
            }
            //调用后台保存方法
            BasemanService.RequestPost("item_org", action, JSON.stringify($scope.data.currItem))
                .then(function () {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
        if (action == "insert") {
            BasemanService.RequestPost("item_org", action, JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
    };



    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if(type == 'item'){
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                },{
                    name: "产品规格",
                    code: "specs"
                }],
                classid: "item",
                url: "/jsp/authman.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "items",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:10
                },
                searchlist: ["item_code", "item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_id = result.item_id;
                $scope.data.currItem.item_code = result.item_code;
                $scope.data.currItem.item_name = result.item_name;
                $scope.data.currItem.specs = result.specs;
            });
        }else if(type == 'sales_area'){
            $scope.FrmInfo = {
                title: "销区查询",
                thead: [{
                    name: "销区编码",
                    code: "sale_area_code"
                }, {
                    name: "销区名称",
                    code: "sale_area_name"
                }],
                classid: "sale_salearea",
                url: "/jsp/authman.jsp",
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
                $scope.data.currItem.sales_area_id = result.sale_area_id;
                $scope.data.currItem.sales_area_name = result.sale_area_name;
            })
        }else if(type == 'item_class1'){
            $scope.FrmInfo = {
                title: "产品分类",
                thead: [{
                    name: "分类编码",
                    code: "item_class_code"
                }, {
                    name: "分类名称",
                    code: "item_class_name"
                }],
                classid: "item_class",
                url: "/jsp/authman.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "item_classs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7,
                    sqlwhere:"c.item_class_level = 1 and c.item_usable = 2"
                },
                searchlist: ["item_class_code", "item_class_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_class1 = result.item_class_id;
                $scope.data.currItem.item_class1_code = result.item_class_code;
                $scope.data.currItem.item_class1_name = result.item_class_name;
            })
        }else if(type == 'item_class2'){
            $scope.FrmInfo = {
                title: "产品分类",
                thead: [{
                    name: "分类编码",
                    code: "item_class_code"
                }, {
                    name: "分类名称",
                    code: "item_class_name"
                }],
                classid: "item_class",
                url: "/jsp/authman.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "item_classs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7,
                    sqlwhere:"c.item_class_level = 2 and c.item_usable = 2"
                },
                searchlist: ["item_class_code", "item_class_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_class2 = result.item_class_id;
                $scope.data.currItem.item_class2_code = result.item_class_code;
                $scope.data.currItem.item_class2_name = result.item_class_name;
            })
        }else if(type == 'item_class3'){
            $scope.FrmInfo = {
                title: "产品分类",
                thead: [{
                    name: "分类编码",
                    code: "item_class_code"
                }, {
                    name: "分类名称",
                    code: "item_class_name"
                }],
                classid: "item_class",
                url: "/jsp/authman.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "item_classs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7,
                    sqlwhere:"c.item_class_level = 3 and c.item_usable = 2"
                },
                searchlist: ["item_class_code", "item_class_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.item_class3 = result.item_class_id;
                $scope.data.currItem.item_class3_code = result.item_class_code;
                $scope.data.currItem.item_class3_name = result.item_class_name;
            })
        }else if(type == 'uom'){
            $scope.FrmInfo = {
                title: "计量单位",
                thead: [{
                    name: "单位编码",
                    code: "uom_code"
                }, {
                    name: "单位名称",
                    code: "uom_name"
                }],
                classid: "uom",
                url: "/jsp/authman.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "uoms",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["uom_code", "uom_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.uom_id = result.uom_id;
                $scope.data.currItem.uom_code = result.uom_code;
                $scope.data.currItem.uom_name = result.uom_name;
            })
        }else if(type == 'pack_uom'){
            $scope.FrmInfo = {
                title: "计量单位",
                thead: [{
                    name: "单位编码",
                    code: "uom_code"
                }, {
                    name: "单位名称",
                    code: "uom_name"
                }],
                classid: "uom",
                url: "/jsp/authman.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "uoms",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag:7
                },
                searchlist: ["uom_code", "uom_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.pack_uom = result.uom_name;
            })
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

    $scope.showSale = function () {
        alert(11);
    }

}
//注册控制器
angular.module('inspinia')
    .controller('item_org_pro', item_org_pro);