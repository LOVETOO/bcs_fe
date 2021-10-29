/**
 * 终端网点资料
 * 2018-6-12 by mjl
 */
function mkt_terminal($scope, BaseService, $filter, $location, $rootScope, $modal, $timeout,
                      BasemanService, notify, $state, localeStorageService, FormValidatorService, $stateParams){
    $scope.data = {};
    $scope.data.currItem = {};
    $scope.data.searchItem = {};
    $scope.data.mkt_terminal_org_data={};
    //明细序号
    var lineMaxSeq = 0;

    /**
     * 词汇池
     */
    $scope.dictPool = {
        'crm_terminal_type': {},
        'terminal_kind': {},
        'stat': {},
        'grade_market': {},
        'position_class': {},
        'branch_form': {},
        'branch_property': {},
        'nvc_acreage_class': {},
        'decoration_plan': {},
        'branch_brand':{},
    };

    /**
     * 加载词汇
     */
    angular.forEach($scope.dictPool, function (dictOption, dictCode) {
        BasemanService.RequestPostAjax('base_search', 'searchdict', {dictcode: dictCode})
            .then(function (dictHead) {
                if (!dictOption.isStr) {
                    dictHead.dicts.forEach(function (dict) {
                        dict.value = parseInt(dict.value);
                    });
                }
                $scope.dictPool[dictCode] = HczyCommon.stringPropToNum(dictHead.dicts);
                if ($scope.getIndexByField('headerColumns', dictCode)) {
                    $scope.headerColumns[$scope.getIndexByField('headerColumns', dictCode)].options = dictHead.dicts;
                    $scope.headerGridView.setColumns($scope.headerColumns);
                }
            });
    });

    //添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>";
        //+"<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };
    //添加按钮 - 明细
    var lineButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button>"
            +"<button class='btn btn-sm btn-info dropdown-toggle delbtn'  style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
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

    //网格设置
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight:true
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
        }
        ,{id: "cust_code",name: "经销商", field: "cust_code",width: 140,type: "string"}
        ,{id: "terminal_code",name: "网点编号", field: "terminal_code",width: 140,type: "string"}
        ,{id: "terminal_name",name: "店面名称", field: "terminal_name",width: 140,type: "string"}
        ,{id: "crm_terminal_code",name: "终端代码", field: "crm_terminal_code",width: 110,type: "string"}
        ,{id: "crm_terminal_type",name: "终端类别", field: "crm_terminal_type",width: 110,options: $scope.crm_terminal_type, formatter: Slick.Formatters.SelectOption}
        ,{id: "terminal_kind",name: "网点类别", field: "terminal_kind",width: 110,options: $scope.terminal_kind, formatter: Slick.Formatters.SelectOption}
        ,{id: "branch_stat",name: "网点状态", field: "stat",width: 110,options: $scope.stat, formatter: Slick.Formatters.SelectOption}
        ,{id: "grade_market",name: "分级市场", field: "grade_market",width: 110,options: $scope.grade_market, formatter: Slick.Formatters.SelectOption}
        ,{id: "position_class",name: "位置分类", field: "position_class",width: 110,options: $scope.position_class, formatter: Slick.Formatters.SelectOption}
        ,{id: "branch_form",name: "店面形式", field: "branch_form",width: 110,options: $scope.branch_form, formatter: Slick.Formatters.SelectOption}
        ,{id: "branch_property",name: "店面性质", field: "branch_property",width: 130,options: $scope.branch_property, formatter: Slick.Formatters.SelectOption}
        ,{id: "branch_acreage",name: "店面面积", field: "branch_acreage",width: 110,type: "string"}
        ,{id: "shopmanager_name",name: "负责人", field: "shopmanager_name",width: 110,type: "string"}
        ,{id: "shopmanager_phone",name: "联系电话", field: "shopmanager_phone",width: 110,type: "string"}
        ,{id: "addr",name: "店面地址", field: "addr",width: 110,type: "string"}

    ];

    //定义网格字段 - 明细
    $scope.lineColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45
        },
        {
            name: "操作",
            editable: false,
            width: 120,
            formatter: lineButtons
        }
        ,{id: "atta_code",name: "附件名", field: "atta_code",width: 240,type: "string"}
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
    //网格初始化
    $scope.lineGridView = new Slick.Grid("#lineGridView", [], $scope.lineColumns, $scope.lineOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){edit(args)});

    /**
     * 明细网格点击事件
     */
    function dgLineClick(e, args) {
        if ($(e.target).hasClass("btn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    };

    //细表-绑定点击事件mkt_terminal_ADDRESS_TEMP
    $scope.lineGridView.onClick.subscribe(ldgOnClick);

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
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "mkt_terminal_types"})
        .then(function (data) {
            $scope.mkt_terminal_types = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
            var mkt_terminal_types = [];
            for (var i = 0; i < data.dicts.length; i++) {
                mkt_terminal_types[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'mkt_terminal_type')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'mkt_terminal_type')].options = mkt_terminal_types;
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
     * 事件判断 - 细表
     */
    function ldgOnClick(e, args) {
        //点击删除按钮处理事件
        if ($(e.target).hasClass("delbtn")) {
            delLine(args);
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
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0"
            }
        }
        postdata.flag = 99;
        BasemanService.RequestPost("mkt_terminal", "search", postdata).then(function (data) {
            setGridData($scope.headerGridView, data.mkt_terminals);
            BaseService.pageInfoOp($scope, data.pagination);
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.data.searchItem = {};
        $scope.searchData();
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
        //BaseService.pageInfoOp($scope, data.pagination);
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
        $scope.data.currItem.usable=2;
        setGridData($scope.lineGridView, []);
        lineMaxSeq = 0;
        $scope.$digest();
        //$scope.$apply();
    }

    /**
     * 编辑
     */
    function edit(args) {
        $scope.initModal();
        var postData = {};
        postData.terminal_id = args.grid.getDataItem(args.row).terminal_id;
        BasemanService.RequestPost("mkt_terminal", "select", postData)
            .then(function (data) {
                HczyCommon.stringPropToNum(data);
                $scope.data.currItem = data;
                $("#attributeModal").modal();
            });
        $scope.$digest();
    };

    /**
     * 保存
     */
    $scope.save = function () {
        if ($scope.lineGridView.getCellEditor() != undefined) {
            $scope.lineGridView.getCellEditor().commitChanges();
        }
        if(!FormValidatorService.validatorFrom($scope, "#entityForm")){
            return;
        }else{
            if ($scope.data.currItem.terminal_id > 0) {
                BasemanService.RequestPost("mkt_terminal", "update", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        $scope.searchData();
                        BasemanService.swalSuccess("成功", "保存成功！");
                        $("#attributeModal").modal("hide");
                    });
            } else {
                BasemanService.RequestPost("mkt_terminal", "insert", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        $scope.searchData();
                        BasemanService.swalSuccess("成功", "保存成功！");
                        $("#attributeModal").modal("hide");
                    });
            }
        }

    };

    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.mkt_terminal_id = args.grid.getDataItem(args.row).mkt_terminal_id;
        var name = args.grid.getDataItem(args.row).mkt_terminal_name;
        BasemanService.swalDelete("删除", "确定要删除 "+name+" 吗？", function (bool) {
            if (bool) {
                BasemanService.RequestPost("mkt_terminal", "delete", JSON.stringify(postData))
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
     * 新增 - 明细
     */
    $scope.addLineRow = function () {
        var ldg = $scope.lineGridView;
        lineMaxSeq = lineMaxSeq+1;
        if (ldg.getData()) {
            ldg.getData().push({"seq":lineMaxSeq});
        } else {
            ldg.setData([{"seq":lineMaxSeq}]);
        }
        ldg.resizeCanvas();
        ldg.invalidateAllRows();
        ldg.updateRowCount();
        ldg.render();
    }

    /**
     * 删除 - 明细
     */
    function delLine(args){
        var dg = $scope.lineGridView;
        var rowidx = args.row;
        BasemanService.swalDelete("删除", "确定要删除吗？", function (bool) {
            if (bool) {
                dg.getData().splice(rowidx, 1);
                dg.invalidateAllRows();
                dg.render();
                lineMaxSeq = lineMaxSeq-1;
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
            backdatas: "mkt_terminal",
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
     * 通用查询 - 销售价格类型
     */
    $scope.searchSpt = function () {
        $scope.FrmInfo = {
            title: "销售价格类型查询",
            thead: [{
                name: "销售价格类型编码",
                code: "saleprice_type_code"
            }, {
                name: "销售价格类型名称",
                code: "saleprice_type_name"
            }],
            classid: "sa_saleprice_type",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "sa_saleprice_types",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["saleprice_type_code", "saleprice_type_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.sa_saleprice_type_id = result.sa_saleprice_type_id;
            $scope.data.currItem.saleprice_type_name = result.saleprice_type_name;
            $scope.data.currItem.saleprice_type_code = result.saleprice_type_code;
        })
    }

    /**
     * 通用查询 - 销售业务员
     */
    $scope.searchEmployee = function () {
        $scope.FrmInfo = {
            title: "销售业务员查询",
            thead: [{
                name: "销售业务员编码",
                code: "sale_employee_code"
            }, {
                name: "销售业务员名称",
                code: "sale_employee_name"
            }],
            classid: "base_view_sale_employee",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "base_view_sale_employees",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["sale_employee_code", "sale_employee_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.sale_employee_id = result.sale_employee_id;
            $scope.data.currItem.employee_code = result.sale_employee_code;
            $scope.data.currItem.employee_name = result.sale_employee_name;
        })
    }


    /**
     * 选择地区
     */
    $scope.searchArea = searchArea;
    function searchArea(areatype) {
        var title ="";
        var superid = 0;
        if(4==areatype){
            superid = 1;
            title = "选择省份"
        }
        if(5==areatype){
            superid = $scope.data.currItem.province_areaid;
            title = "选择城市"
        }
        if(6==areatype){
            superid = $scope.data.currItem.city_areaid;
            title = "选择区县"
        }
        if(("undefined" == typeof(superid) || 0==superid) && 4!=areatype){
            BasemanService.swalWarning("提示", "请先选择上级地区");
            return;
        }
        BasemanService.chooseArea({
            scope: $scope,
            title:title,
            areatype:areatype,
            superid:superid,
            then: function (data) {
                if(4==areatype){
                    $scope.data.currItem.province_areaid = data.areaid;
                    $scope.data.currItem.province_areacode = data.areacode;
                    $scope.data.currItem.province_areaname = data.areaname;

                    $scope.data.currItem.city_areaid = 0;
                    $scope.data.currItem.city_areacode = "";
                    $scope.data.currItem.city_areaname = "";

                    $scope.data.currItem.county_areaid = 0;
                    $scope.data.currItem.county_areacode = "";
                    $scope.data.currItem.county_areaname = "";
                }
                if(5==areatype){
                    $scope.data.currItem.city_areaid = data.areaid;
                    $scope.data.currItem.city_areacode = data.areacode;
                    $scope.data.currItem.city_areaname = data.areaname;

                    $scope.data.currItem.county_areaid = 0;
                    $scope.data.currItem.county_areacode = "";
                    $scope.data.currItem.county_areaname = "";
                }
                if(6==areatype){
                    $scope.data.currItem.county_areaid = data.areaid;
                    $scope.data.currItem.county_areacode = data.areacode;
                    $scope.data.currItem.county_areaname = data.areaname;
                }
            }
        });
    }

    /**
     * 通用查询 - 部门
     */
    $scope.searchDept = function () {
        $scope.FrmInfo = {
            title: "部门查询",
            thead: [{
                name: "部门编码",
                code: "dept_code"
            }, {
                name: "部门名称",
                code: "dept_name"
            }],
            classid: "dept",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "depts",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["dept_code", "dept_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.dept_id = result.dept_id;
            $scope.data.currItem.dept_code = result.dept_code;
            $scope.data.currItem.dept_name = result.dept_name;
        })
    }

    /**
     * 通用查询 - 销售区域
     */
    $scope.searchSaleArea = function () {
        $scope.FrmInfo = {
            title: "销售区域查询",
            thead: [{
                name: "销售区域编码",
                code: "sale_area_code"
            }, {
                name: "销售区域名称",
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
            $scope.data.currItem.sale_area_code = result.sale_area_code;
            $scope.data.currItem.sale_area_name = result.sale_area_name;
        })
    }

    /**
     * 通用查询 - 总公司
     */
    $scope.searchGroupmkt_terminal = function () {
        $scope.FrmInfo = {
            title: "客户查询",
            thead: [{
                name: "客户编码",
                code: "mkt_terminal_code"
            }, {
                name: "客户名称",
                code: "mkt_terminal_name"
            }],
            classid: "mkt_terminal",
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "nvl(Is_Groupmkt_terminal,0)=2",
            backdatas: "mkt_terminals",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["mkt_terminal_code", "mkt_terminal_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.group_mkt_terminal_id = result.mkt_terminal_id;
            $scope.data.currItem.group_mkt_terminal_code = result.mkt_terminal_code;
            $scope.data.currItem.group_mkt_terminal_name = result.mkt_terminal_name;
        })
    }

    //复选框选择
    $scope.check_is_groupmkt_terminal = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_groupmkt_terminal = 2;
        }else{
            $scope.data.currItem.is_groupmkt_terminal = 1;
        }
    };
    $scope.check_is_relation = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_relation = 2;
        }else{
            $scope.data.currItem.is_relation = 1;
        }
    };
    $scope.check_usable = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.usable = 2;
        }else{
            $scope.data.currItem.usable = 1;
        }
    };
    $scope.check_crebit_ctrl = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.crebit_ctrl = 2;
        }else{
            $scope.data.currItem.crebit_ctrl = 1;
        }
    };

    //检查必填项是否为空 dept_code
    $scope.checkNull = function () {
        /*  if (typeof ($scope.data.currItem.short_name) == "undefined" || $scope.data.currItem.short_name == null) {
         swal("提示!", "请填写简称!");
         return true;
         }*/
        if (typeof ($scope.data.currItem.mkt_terminal_name) == "undefined" || $scope.data.currItem.mkt_terminal_name == null) {
            swal("提示!", "请填写客户名称!");
            return true;
        }
        if (typeof ($scope.data.currItem.dept_code) == "undefined" || $scope.data.currItem.dept_code == null) {
            swal("提示!", "请选择部门!");
            return true;
        }
        return false;
    }

    /**
     * 触发上传文件
     */
    $scope.addFile = function () {
        if (document.getElementById("file1")) {
            document.getElementById("file1").parentNode.removeChild(document.getElementById("file1"));
        }
        var inputObj = document.createElement('input');
        inputObj.setAttribute('id', 'file1');
        inputObj.setAttribute('type', 'file');
        inputObj.setAttribute('name', 'docFile0');
        inputObj.setAttribute("style", 'visibility:hidden');
        inputObj.setAttribute("nv-file-select", '');
        inputObj.setAttribute("uploader", 'uploader');
        // inputObj.setAttribute("accept", "*");
        // inputObj.setAttribute("capture", "camera");
        document.body.appendChild(inputObj);
        inputObj.onchange = $scope.uploadFile;
        inputObj.click();
    }

    /**
     * 上传附件
     * @param o
     */
    $scope.uploadFile = function (o) {
        if (o.target.files) {
            try {
                $.ajaxFileUpload({
                    url: "/web/scp/filesuploadsave2.do",
                    type: 'post',
                    secureuri: false,
                    fileElementId: 'file1',//file标签的id
                    dataType: 'text',//返回数据的类型
                    success: function (data, status) {
                        console.log(data);
                        data = JSON.parse(data);
                        if (data) {
                            if (!$scope.data.currItem.objattachs) {
                                $scope.data.currItem.objattachs = [];
                            }
                            $scope.data.currItem.objattachs.push({
                                "docid": data.data[0].docid + "",
                                "docname": data.data[0].docname,
                                "url": window.URL.createObjectURL(o.target.files[0]),
                                "filecode":data.data[0].downloadcode
                            });
                            $scope.$apply();
                        }
                    },
                    error: function (data, status, e) {
                        console.log(data);
                    }
                });
            } finally {
                // $showMsg.loading.close();
            }
        }
    }

    /**
     * 下载文件
     * @param file
     */
    $scope.downloadAttFile = function (file) {
        window.open("/downloadfile.do?docid=" + file.docid);
    }

    /**
     * 删除文件
     * @param file
     */
    $scope.deleteFile = function (file) {
        console.log("deleteFile...")
        if (file && file.docid > 0) {
            for (var i = 0; i < $scope.data.currItem.objattachs.length; i++) {
                if ($scope.data.currItem.objattachs[i].docid == file.docid) {
                    $scope.data.currItem.objattachs.splice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 流程url
     * @param {} args
     */
    function wfSrc(args) {
        //默认值
        var urlParams = {
            wftempid: '',
            wfid: $scope.data.currItem.wfid,
            objtypeid: $scope.data.objtypeid,
            objid: $scope.data.currItem.sa_saleprice_head_id,
            submit: $scope.data.bSubmit
        }

        //传入值覆盖默认值
        if (angular.isObject(args))
            angular.extend(urlParams, args);

        //0转为""
        angular.forEach(urlParams, function (value, key, obj) {
            if (value == 0)
                obj[key] = '';
        });

        return '/web/index.jsp'
            + '?t=' + randomNum               //随机数，请求唯一标识，加上这个Google浏览器才会发出请求
            + '#/crmman/wfins'
            + '/' + urlParams.wftempid        //流程模板ID
            + '/' + urlParams.wfid            //流程实例ID
            + '/' + urlParams.objtypeid       //对象类型ID
            + '/' + urlParams.objid           //对象ID
            + '/' + (urlParams.submit ? 1 : 0) //是否提交流程
            + '?showmode=2';
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.sa_saleprice_head_id && $scope.data.currItem.sa_saleprice_head_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                var theSrc = wfSrc();
                var theElement = angular.element('#wfinspage');

                if (theElement.attr('src') !== theSrc) {
                    theElement.attr('src', theSrc);
                }
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }


    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        var tabId = e.target.id;
        if ('towfins' == tabId) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
        }
    }

    /**
     * 获取流程模版ID
     * @param objtypeid
     */
    $scope.getWfTempId = function (objtypeid) {
        var iWftempId = 0;
        var postData = {
            "objtypeid": objtypeid
        }
        BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
            .then(function (data) {
                if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                    for (var i = data.objwftempofobjconfs.length - 1; i > -1; i--) {
                        //条件过滤
                        if (data.objwftempofobjconfs[i].execcond != '') {
                            //用正则表达式替换变量
                            var regexp = new RegExp("<item>", "gm");
                            var sexeccond = data.objwftempofobjconfs[i].execcond.replace(regexp, "$scope.data.currItem");
                            //运行表达式 不符合条件的移除
                            if (!eval(sexeccond)) {
                                data.objwftempofobjconfs.splice(i, 1);
                            }
                        }
                    }

                    if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 1) {
                        $scope.data.wftemps = data.objwftempofobjconfs;
                        //弹出模态框供用户选择
                        $("#selectWfTempModal").modal();
                    } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                        $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                    }
                } else if (data.objwftempofobjconfs && data.objwftempofobjconfs.length == 1) {
                    $scope.selectWfTemp(data.objwftempofobjconfs[0].wftempid);
                }
            });
    }

    /**
     * 选择流程模版ID
     * @param wftempid
     */
    $scope.selectWfTemp = function (wftempid) {
        $("#selectWfTempModal").modal("hide");
        angular
            .element('#wfinspage')
            .attr('src', wfSrc({
                wftempid: wftempid
            }));
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);


    //网格高度自适应
    BasemanService.initGird();

    // BasemanService.ReadonlyGrid($scope.headerGridView);
    //初始化分页
    BaseService.pageGridInit($scope);

}
//注册控制器
angular.module('inspinia')
    .controller('mkt_terminal', mkt_terminal)