/**
 *岗位管理
 * 2018-1-25 by mjl
 */

var param = {};

function setData(e){
    param = e;
}

function sale_salearea_pro($scope, $location, $rootScope, $stateParams, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {sale_area_id: $stateParams.id};

    //添加按钮
    var lineButtons = function (row, cell, value, columnDef, dataContext) {
        return  "<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    /**
     * 词汇池
     */
    $scope.dictPool = {
        sales_big_area: null
    };

    /**
     * 加载词汇
     */
    angular.forEach($scope.dictPool, function (dictList, dictCode) {
        BasemanService.RequestPostAjax('base_search', 'searchdict', {dictcode: dictCode})
            .then(function (dictHead) {
                dictHead.dicts.forEach(function (dict) {
                    dict.id = parseInt(dict.id);
                });
                $scope.dictPool[dictCode] = dictHead.dicts;
            });
    });

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
            id: "areacode",
            name: "地区编码",
            behavior: "select",
            field: "areacode",
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
            id: "areaname",
            name: "地区名称",
            behavior: "select",
            field: "areaname",
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

    //明细网格 - 包含机构用户列表 - 绑定点击事件
    $scope.lineGridView.onClick.subscribe(dgLineClick);


    /**
     * 初始化
     * @param args
     */
    $scope.init = function () {
        if ($scope.data.currItem.sale_area_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sale_salearea", "select", JSON.stringify($scope.data.currItem))
                .then(function (data) {
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView, data.sale_salearea_lineofsale_saleareas);
                });
        } else {
            $scope.data.currItem = {
                "sale_area_id": 0
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
     * 保存
     */
    $scope.save = function () {
        var action = param.action;
        if (action == "update") {
            //调用后台保存方法
            BasemanService.RequestPost("sale_salearea", action, JSON.stringify($scope.data.currItem))
                .then(function () {
                    BasemanService.swalSuccess("成功", "保存成功！"  );
                    $scope.closeWindow();
                    return;
                });
        }
        if (action == "insert") {
            BasemanService.RequestPost("sale_salearea", action, JSON.stringify($scope.data.currItem))
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
        var areaname = args.grid.getDataItem(args.row).areaname;
        if(confirm("确定要删除 "+areaname+" 吗？")){
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
        if(typeof ($scope.data.currItem.sale_salearea_lineofsale_saleareas) == 'undefined'){
            $scope.data.currItem.sale_salearea_lineofsale_saleareas = [];
        }
        var isExist = false;
        for(var i in $scope.data.currItem.sale_salearea_lineofsale_saleareas){
            if($scope.data.currItem.sale_salearea_lineofsale_saleareas[i].areacode == result.areacode){
                isExist = true;
                break;
            }
        }
        if(!isExist){
            $scope.data.currItem.sale_salearea_lineofsale_saleareas.push(result);
        }
        setGridData($scope.lineGridView, $scope.data.currItem.sale_salearea_lineofsale_saleareas)
    }

    /**
     * 通用查询
     */
    $scope.searchArea = function () {
        $scope.FrmInfo = {
            title: "地区查询",
            thead: [{
                name: "地区编码",
                code: "areacode"
            }, {
                name: "地区名称",
                code: "areaname"
            }],
            classid: "scparea",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "scpareas",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300,
                search_flag:1
            },
            searchlist: ["areacode", "areaname"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            addLineRow(result);
        })
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
    .controller('sale_salearea_pro', sale_salearea_pro)