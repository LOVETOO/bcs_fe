/**
 * 客户资料
 * 2018-4-18 by mjl
 */
function customer_pro($scope, BasemanService,BaseService , $stateParams, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {"customer_org_id": $stateParams.id};
    $scope.data.searchItem = {};
    $scope.data.customer_org_data={};
    $scope.data.currItemIntf = {};
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


    //添加按钮 - 包含用户
    var lineButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle delbtn'  style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };


    //网格设置
    $scope.lineOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: true,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false
    };

    //定义网格字段 - 明细
    $scope.lineColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
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
            width: 50,
            formatter: lineButtons
        },
        {
            id: "address1",
            name: "送货地址",
            field: "address1",
            width: 210,
            editor: Slick.Editors.Text
        },
        {
            id: "defaulted",
            name: "默认地址",
            field: "defaulted",
            width: 70,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption,
            editor: Slick.Editors.SelectOption,
        },
        {
            id: "idcard",
            name: "提货人身份证",
            field: "idcard",
            width: 165,
            editor: Slick.Editors.Text
        },
        {
            id: "take_man",
            name: "提货人姓名",
            field: "take_man",
            width: 90,
            editor: Slick.Editors.Text
        },
        {
            id: "phone_code",
            name: "提货人电话",
            field: "phone_code",
            width: 120,
            editor: Slick.Editors.Text
        },
       /* {
            id: "customer_newname",
            name: "所属门店",
            field: "customer_newname",
            width: 100,
            editor: Slick.Editors.Text
        },*/
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 200,
            editor: Slick.Editors.Text
        }
    ];
    //网格初始化
    $scope.lineGridView = new Slick.Grid("#lineGridView", [], $scope.lineColumns, $scope.lineOptions);


    //细表-绑定点击事件CUSTOMER_ADDRESS_TEMP
    $scope.lineGridView.onClick.subscribe(ldgOnClick);

    //词汇表系统参数分类取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "sale_types"})
        .then(function (data) {
            $scope.sale_types = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

    //词汇表系统参数分类取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "customer_types"})
        .then(function (data) {
            $scope.customer_types = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

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
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        if ($scope.data.currItem.customer_org_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("customer_org", "select", JSON.stringify({"customer_org_id": $scope.data.currItem.customer_org_id}))
                .then(function (data) {
                    HczyCommon.stringPropToNum(data);
                    $scope.data.currItem = data;
                    setGridData($scope.lineGridView, data.customer_addressofcustomer_orgs);
                    if(data.customer_addressofcustomer_orgs){
                        lineMaxSeq = data.customer_addressofcustomer_orgs.length;
                    }
                    $scope.data.currItem.customer_addressofcustomer_orgs = data.customer_addressofcustomer_orgs;
                });
        } else {
            $scope.setNewItem();
        }
    };

    $scope.setNewItem = function () {
        $scope.initModal();
        $scope.data.currItem = {};
        $scope.data.currItem.usable=2;
        setGridData($scope.lineGridView, []);
        lineMaxSeq = 0;
        $scope.$digest();
    }

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
            if ($scope.data.currItem.customer_id > 0) {
                $scope.data.currItem.customer_addressofcustomer_orgs = $scope.lineGridView.getData();
                var customer_address = $scope.data.currItem.customer_addressofcustomer_orgs;
                for (var i = 0; i < customer_address.length; i++) {
                    if (customer_address[i].defaulted == null) {
                        customer_address[i].defaulted = 1;
                    }
                    if (customer_address[i].address1 == null || customer_address[i].address1 == undefined || customer_address[i].address1 == "") {
                        BasemanService.notice("提示", "第" + (i + 1) + "行送货地址不能为空！");
                        return;
                    }
                    if (customer_address[i].phone_code == null || customer_address[i].phone_code == undefined || customer_address[i].phone_code == "") {
                        BasemanService.notice("提示", "第" + (i + 1) + "行提货人电话不能为空！");
                        return;
                    }
                }

                BasemanService.RequestPost("customer_org", "update", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        BasemanService.notice("保存成功！", "alert-success");
                    });
            } else {
                $scope.data.currItem.customer_addressofcustomer_orgs = $scope.lineGridView.getData();
                BasemanService.RequestPost("customer_org", "insert", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        BasemanService.notice("保存成功！", "alert-success");
                    });
            }
        }

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
                sqlwhere:" isuseable=2 "
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
     * 选择城市
     */
    $scope.searchArea = searchArea;
    function searchArea() {
        BasemanService.chooseCity({
            scope: $scope,
            then: function (data) {
                $scope.data.currItem.areaid = data.areaid;
                $scope.data.currItem.areacode = data.areacode;
                $scope.data.currItem.areaname = data.areaname_full;
            }
        });
    }

    /**
     * 通用查询 - 运营中心
     */
    $scope.searchDept = function () {
        $scope.FrmInfo = {
            title: "运营中心查询",
            thead: [{
                name: "运营中心编码",
                code: "dept_code"
            }, {
                name: "运营中心名称",
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
    $scope.searchGroupCustomer = function () {
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
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "nvl(Is_GroupCustomer,0)=2",
            backdatas: "customer_orgs",
            ignorecase: "true", //忽略大小写
            postdata: {
                maxsearchrltcmt: 300
            },
            searchlist: ["customer_code", "customer_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            $scope.data.currItem.group_customer_id = result.customer_id;
            $scope.data.currItem.group_customer_code = result.customer_code;
            $scope.data.currItem.group_customer_name = result.customer_name;
        })
    }

    //复选框选择
    $scope.check_is_groupcustomer = function(e){
        var checkTarget = e.target;
        if(checkTarget.checked){
            $scope.data.currItem.is_groupcustomer = 2;
        }else{
            $scope.data.currItem.is_groupcustomer = 1;
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
        if (typeof ($scope.data.currItem.customer_name) == "undefined" || $scope.data.currItem.customer_name == null) {
            swal("提示!", "请填写客户名称!");
            return true;
        }
        if (typeof ($scope.data.currItem.dept_code) == "undefined" || $scope.data.currItem.dept_code == null) {
            swal("提示!", "请选择运营中心!");
            return true;
        }
        return false;
    }

    /**
     * 关闭窗体
     */
    $scope.closeWindow = function () {
        if (window.parent != window) {
            BasemanService.closeModal();
        } else {
            window.close();
        }
    }


}
//注册控制器
angular.module('inspinia')
    .controller('customer_pro', customer_pro);