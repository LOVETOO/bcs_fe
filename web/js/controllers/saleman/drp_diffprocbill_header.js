/**
 * 送货单签收主表
 * */
function drp_diffprocbill_header($scope, BaseService, $location, $rootScope, $modal, $timeout, BasemanService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {"objtypeid": 1723};
    $scope.data.currItem = {"objattachs": []};
    $scope.data.addCurrItem = {};
    var activeRow = [];
    var isEdit = 0;
    var canuseAmt = 0;
    var lineData = [];
    $scope.is_operation_center = 1; //登录用户角色：是否运营中心，默认不是

    //获取用户登录信息
    var orgtype = window.userbean.loginuserifnos[0].orgtype; //用户所在机构是运营中心（orgtype=6）
    var isAdmin = window.userbean.isAdmin; //用户是否管理员


    // 添加按钮
    var editHeaderButtons = function (row, cell, value, columnDef, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };


    //主表网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    //主表网格列属性
    $scope.headerColumns = [
        {
            name: "序号",
            id: "id",
            field: "id",
            width: 45,
        },{
            name: "操作",
            width: 130,
            formatter: editHeaderButtons
        },{
            name: "单据状态",
            id: "stat",
            field: "stat",
            width: 80,
            options: [],
            formatter: Slick.Formatters.SelectOption,
            type: "list"
        }, {
            name: "签收单号",
            id: "diffbill_no",
            field: "diffbill_no",
            width: 170,
            type: "string"
        }, {
            name: "销售出库单号",
            id: "outbill_no",
            field: "outbill_no",
            width: 150,
            type: "string"
        },/* {
            name: "销售订单号",
            id: "sa_salebillno",
            field: "sa_salebillno",
            width: 150,
            type: "string"
        },*/{
            name: "客户编码",
            id: "cust_code",
            field: "cust_code",
            width: 100,
            type: "string"
        }, {
            name: "客户名称",
            id: "cust_name",
            field: "cust_name",
            width: 250,
            type: "string"
        }, /*{
            name: "联系人",
            id: "receive_contact",
            field: "receive_contact",
            width: 100,
            type: "string"
        },*/ {
            name: "收货人电话",
            id: "receive_phone",
            field: "receive_phone",
            width: 120,
            type: "string"
        }, {
            name: "收货城市",
            id: "in_area_name",
            field: "in_area_name",
            width: 120,
            type: "string"
        }, {
            name: "收货地址",
            id: "receive_address",
            field: "receive_address",
            width: 180,
            type: "string"
        }, /*{
            name: "发货仓库编码",
            id: "out_warehouse_code",
            field: "out_warehouse_code",
            width: 120,
            type: "string"
        },{
            name: "发货仓库名称",
            id: "out_warehouse_name",
            field: "out_warehouse_name",
            width: 120,
            type: "string"
        },*//*{
            name: "运输方式",
            id: "ship_type",
            field: "ship_type",
            width: 80,
            type: "list",
            options: [],
            formatter: Slick.Formatters.SelectOption
        },*/ {
            name: "发货日期",
            id: "send_date",
            field: "send_date",
            width: 100,
            formatter: Slick.Formatters.Date,
            type: "date"
        }, {
            name: "到货日期",
            id: "anticipate_date",
            field: "anticipate_date",
            width: 100,
            formatter: Slick.Formatters.Date,
            type: "date"
        }, {
            name: "总金额",
            id: "total_amount",
            field: "total_amount",
            width: 100,
            cssClass:"amt",
            formatter: Slick.Formatters.Money,
            type: "number"
        },{
            name: "制单人",
            id: "creator",
            field: "creator",
            width: 80,
        }, {
            name: "制单时间",
            id: "create_time",
            field: "create_time",
            width: 160,
            type: "string"
        }, {
            name: "备注",
            id: "mo_remark",
            field: "mo_remark",
            width: 200,
            type: "string"
        }
    ];

    //初始化网格
    $scope.headerGridView = new Slick.Grid("#headerViewGrid", [], $scope.headerColumns, $scope.headerOptions);

    /**取词汇值*/
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "shipmode_id"})
        .then(function (data) {
            var shipmodId = [];
            for (var i = 0; i < data.dicts.length; i++) {
                shipmodId[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'ship_type')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'ship_type')].options = shipmodId;
                $scope.headerGridView.setColumns($scope.headerColumns);
            }
        });

    $scope.billStats = [];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
            var billStats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                billStats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'stat')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'stat')].options = billStats;
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
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function dgOnClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        var state = Number(args.grid.getDataItem(args.row).stat);
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.diffbill_id = args.grid.getDataItem(args.row).diffbill_id;
            var diffbillno = args.grid.getDataItem(args.row).diffbill_no;
            if (state != 1) {
                BasemanService.swalWarning("提示", "当前单据状态不是“制单”状态，不能删除！");
                return;
            }
            BasemanService.swalDelete("删除", "确定要删除单号为 " + diffbillno + " 的签收单吗？", function (bool) {
                if (bool) {
                    //删除数据成功后再删除网格数据
                    BasemanService.RequestPost("drp_diffprocbill_header", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                            $scope.refreshGridView();
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }else if ($(e.target).hasClass("checkbtn")) { //点击审核按钮
            var rowidx = args.row;
            var postData = {};
            postData.diffbill_id = args.grid.getDataItem(rowidx).diffbill_id;
            var diffbillno = args.grid.getDataItem(rowidx).diffbill_no;
            if(state == 5){
                BasemanService.swalWarning("提示","单据"+diffbillno+"已审核！请勿重复操作");
                return;
            }
            BasemanService.swalWarning("审核", "确定要审核单号为 " + diffbillno + " 的签收单吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("drp_diffprocbill_header", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.searchData();
                            BasemanService.swalSuccess("成功","审核成功！");
                        });
                } else {
                    return;
                }
            })
        }
    };

    /**
     * 主表网格双击事件
     */
    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }


    //主表绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgOnDblClick);




    /**
     * 增加
     */
    $scope.addbill = function () {
        BasemanService.openModal({
            url: "/index.jsp#/saleman/drp_diffprocbill_bill/0", title: "送货签收单", obj: $scope,
            ondestroy: $scope.refreshGridView
        });
        isEdit = 0;
    }

    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        //登录用户所在机构为运营中心时才可执行‘增加’操作
        if(Number(orgtype) == 6 || isAdmin) {
            $scope.is_operation_center = 2;
        }
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
        BasemanService.RequestPost("drp_diffprocbill_header", "search", postdata)
            .then(function (data) {
                $scope.data.currItem = data;
                //清空网格
                $scope.headerGridView.setData([]);
                //设置数据
                for (var i = 0; i < $scope.data.currItem.drp_diffprocbill_headers.length; i++) {
                    $scope.data.currItem.drp_diffprocbill_headers[i].id = i + 1;
                }
                $scope.headerGridView.setData($scope.data.currItem.drp_diffprocbill_headers);
                //重绘网格
                $scope.headerGridView.render();
                BaseService.pageInfoOp($scope, data.pagination);
            });
    }

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            direct: "left",
            sqlBlock: "",
            backdatas: "drp_diffprocbill_header",
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
     * 查询详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        isEdit = 0;
        BasemanService.openModal({
            url: "/index.jsp#/saleman/drp_diffprocbill_bill/" + args.grid.getDataItem(args.row).diffbill_id,
            title: "送货签收单",
            obj: $scope,
            ondestroy: $scope.refreshGridView
        });
    };

    //模态框取消事件
    $scope.hide = function () {
        $("#addLineModal").modal("hide");
        isEdit = 0;
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
                        data = JSON.parse($(data)[0].innerText);
                        if (data.data) {
                            if (!$scope.data.currItem.objattachs) {
                                $scope.data.currItem.objattachs = [];
                            }
                            $scope.data.currItem.objattachs.push({
                                "docid": data.data[0].docid + "",
                                "docname": data.data[0].docname,
                                "url": window.URL.createObjectURL(o.target.files[0])
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
     * 页面刷新
     */
    $scope.refreshGridView = function () {
        $scope.searchData();
    }

    //加载时间插件
    $('#createDate').datetimepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        pickDate: true, //选择日期
        pickTime: false, //选择时间
        todayBtn: true, //显示选择当前时间按钮
        autoclose: true, //选择一个日期之后立即关闭日期时间选择器
        todayHighlight: true, //高亮当前日期
        startView: 'month', //选择首先显示的视图:month
        minView: 'month' //最小的选择视图-选择最小单位:day
    });
    BasemanService.initGird();
    //初始化分页
    BaseService.pageGridInit($scope);

}

//注册控制器
angular.module('inspinia')
    .controller('ctrl_drp_diffprocbill_header', drp_diffprocbill_header);