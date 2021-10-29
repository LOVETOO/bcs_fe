/**这是费用项目界面js*/


function fin_fee_header($scope, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService, BaseService) {

    $scope.data = {};
    $scope.data.currItem = {};
    $scope.conditions = {};


    // 添加操作按钮
    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    // **********网格**********
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: false,
        autoHeight: false
    };

    //列属性
    $scope.headerColumns = [
        {
            name: "操作",
            width: 100,
            formatter: editHeaderButtons
        }, {
            name: "费用项目编码",
            id: "fee_code",
            field: "fee_code",
            width: 120,
            type:"string"
        }, {
            name: "费用项目名称",
            id: "fee_name",
            field: "fee_name",
            width: 150,
            type:"string"
        }, {
            name: "会计科目编码",
            id: "subject_no",
            field: "subject_no",
            width: 100,
            type:"string"
        }, {
            name: "会计科目名称",
            id: "subject_name",
            field: "subject_name",
            width: 150,
            type:"string"
        }, {
            name: "会计科目描述",
            id: "subject_des",
            field: "subject_des",
            width: 100,
            type:"string"
        }, {
            name: "报销方式",
            id: "apply_type",
            field: "apply_type",
            width: 110,
            editor: Slick.Editors.DropDownEditor,
            formatter: Slick.Formatters.SelectOption,
            options:[],
            type:"list"
        }, {
            name: "状态",
            id: "stat",
            field: "stat",
            width: 70,
            formatter: Slick.Formatters.SelectOption,
            options:[],
            type:"list"
        }, {
            name: "备注",
            id: "note",
            field: "note",
            editable: false,
            width: 180,
            type:"string"
        },
    ]

    //创建headerGridView，“table”为表格生成位置的ID
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    /**系统词汇查询***/
    //查询方法
    function searchdicts(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts[i] = {
                        value: data.dicts[i].dictvalue,
                        desc: data.dicts[i].dictname,
                        id: parseInt(data.dicts[i].dictvalue),
                        name: data.dicts[i].dictname
                    };
                    dictdata.push(dicts[i]);
                }
                if ($scope.getIndexByField(columnname, field)) {
                    gridcolumns[$scope.getIndexByField(columnname, field)].options = dicts;
                    grid.setColumns(gridcolumns);
                }
            });
        return dictdata;
    }

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    $scope.stats = searchdicts('fin_fee_header_stat', 'stat', $scope.headerGridView, $scope.headerColumns, 'headerColumns');
    $scope.applytypes = searchdicts('fin_fee_header_apply_type', 'apply_type', $scope.headerGridView, $scope.headerColumns, 'headerColumns');

    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewFee(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.fee_id = args.grid.getDataItem(args.row).fee_id;
            postData.fee_name = args.grid.getDataItem(args.row).fee_name;
            var name = args.grid.getDataItem(args.row).fee_name;
            BasemanService.swalDelete("删除", "确定要删除费用项目 " + name + " 吗？", function (bool) {
                //删除数据成功后再删除网格数据
                if (bool) {
                    BasemanService.RequestPost("fin_fee_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        });
                }
            })
            e.stopImmediatePropagation();
        }
    };

    function dgOnDblClick(e, args) {
        $scope.viewFee(args);
    }

    //绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);

    /**
     * 编辑事件
     */
    $scope.viewFee = function (args) {
        $scope.title = "费用项目"
        var postData = {};
        postData.fee_id = args.grid.getDataItem(args.row).fee_id;
        //调用后台select方法查询详情
        BasemanService.RequestPost("fin_fee_header", "select", JSON.stringify(postData))
            .then(function (data) {
                $scope.data.currItem = data;
                //显示模态页面
                $("#editModal").modal();
            });

    }

    /**
     * 新增费用
     */
    $scope.newFee = function () {
        $scope.title = "新增项目"
        $scope.data.currItem =
            {
                "fee_code": "",
                "fee_name": "",
                "subject_name": "",
                "subject_no": "",
                "subject_des": "",
                "stat": 1,
                "apply_type": "",
                "note": ""
            };
        //显示模态页面
        $("#editModal").modal();
    }
    //保存新增/编辑操作
    $scope.saveFee = function () {
        if (!$scope.data.currItem.fee_name) {
            BasemanService.swal("提示", "费用项目名称不能为空,请输入");
        } else {
            var saction = "insert";
            if ($scope.data.currItem.fee_id) {
                saction = "update";
            }
            BasemanService.RequestPost("fin_fee_header", saction, JSON.stringify($scope.data.currItem)).then(
                function (data) {
                    $scope.searchData();
                    BasemanService.swalSuccess("成功", "保存成功!");
                    $("#editModal").modal('hide');
                    //重绘网格
                }
            );
        }
    }

    // 查询
    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "fin_fee_header",
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
        BasemanService.open(CommonPopController1, $scope).result.then(function (result) {
            $scope.sqlwhere = result;
            $scope.searchData()
        })
    }

    /**
     * 会计科目查询
     */
    $scope.searchAccountSub = function (searchType) {
        $scope.FrmInfo = {
            title: "会计科目查询",
            thead: [{
                name: "科目编码",
                code: "km_code",
                width: 60,
                height: 80
            },{
                name: "科目名称",
                code: "km_name",
                width: 60,
                height: 80
            }],
            classid: "Gl_Account_Subject",
            url: "/jsp/req.jsp",
            direct: "center",
            sqlBlock: "",
            backdatas: "gl_account_subjects",
            ignorecase: "true", //忽略大小写
            postdata: {
            },
            searchlist:["km_code","km_name"]
        };
        BasemanService.open(CommonPopController, $scope).result.then(function (result) {
            if (searchType == 'KM_Code') {
                $scope.data.currItem.subject_id = result.gl_account_subject_id;
                $scope.data.currItem.subject_no = result.km_code;
                $scope.data.currItem.subject_name = result.km_name;
                $scope.data.currItem.subject_des = result.km_desc;
            }
        })
    };

    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        if (!postdata){
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination : "pn=1,ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            }
        }
        if($scope.sqlwhere && $scope.sqlwhere != ""){
            postdata.sqlwhere = $scope.sqlwhere;
        }
        BasemanService.RequestPost("fin_fee_header", "search", postdata)
            .then(function (data) {
                $scope.headerGridView.setData([]);
                $scope.headerGridView.setData(data.fin_fee_headers);
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            }            
        );
    }
    //网格自适应
    BasemanService.initGird();
    //初始化分页
    BaseService.pageGridInit($scope);

    IncRequestCount()
    DecRequestCount()

}

//注册控制器s
angular.module('inspinia')
    .controller('fin_fee_header', fin_fee_header);