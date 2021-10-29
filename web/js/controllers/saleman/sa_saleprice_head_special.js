/**
 * 特价申请
 * 2018-4-22 by mjl
 */
function sa_saleprice_head_special($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    //设置标题
    $scope.headername = "客户特价申请";

    $scope.userbean = window.userbean;
    $scope.financial_staff = false;
    if($scope.userbean.stringofrole.indexOf("financial_staff") != -1 ){
        $scope.financial_staff = true;
    }

    var editHeaderButtons = function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1) {
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
        }
        if ($scope.financial_staff&&rowData.stat <= 1) {
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };

    //查询下载导入格式文件id
    BasemanService.RequestPostAjax("scpsysconf", "selectref", {confname:'specialpriceimptemple'})
        .then(function (data) {
            var docid = data.sysconfs[0].confvalue;
            $("#priceimptemple").attr("href", "/downloadfile?docid=" + docid);
        });
    $scope.yeorno = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];
    //词汇表单据状态
    $scope.billStats = []
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.billStats = data.dicts;
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

    //作废
    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

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
        {
            id: "seq",
            name: "序号",
            field: "seq",
            width: 45,
        },
        {
            name: "操作",
            width: 90,
            formatter: editHeaderButtons
        },
        {
            id: "saleorder_no",
            name: "单据号",
            field: "saleorder_no",
            width: 120,
        },
        {
            id: "stat",
            name: "流程状态",
            field: "stat",
            width: 75,
            options: $scope.billStats,
            formatter: Slick.Formatters.SelectOption
        },
        /*{
            id: "crm_ent_name",
            name: "品类",
            field: "crm_ent_name",
            width: 80
        },
        {
            id: "entorg_name",
            name: "产品线",
            field: "entorg_name",
            width: 95
        },*/
        {
            id: "date_invbill",
            name: "制单日期",
            field: "date_invbill",
            width: 110,
            formatter: Slick.Formatters.Date
        },
        {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            width: 100
        },
        {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 192
        },
        {
            id: "start_date",
            name: "开始日期",
            field: "start_date",
            width: 110,
            formatter: Slick.Formatters.Date
        },

        {
            id: "end_date",
            name: "结束日期",
            field: "end_date",
            width: 110,
            formatter: Slick.Formatters.Date
        },

        {
            id: "is_cancellation",
            name: "作废",
            field: "is_cancellation",
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption
        },
        /*{
            id: "is_syscreate",
            name: "系统预设",
            field: "is_syscreate",
            width: 70,
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption
        },*/
        {
            id: "pur_price_apply_no",
            name: "采购特价单号",
            field: "pur_price_apply_no",
            width: 150,
        },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 200,
        }
    ];

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function (e, args) {
        $scope.viewDetail(args)
    });

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
        //点击审核按钮处理事件
        else if ($(e.target).hasClass("checkbtn")) {
            check_bill(args);
            e.stopImmediatePropagation();
        }
    };


    /**
     * 审核
     */
    function check_bill(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.sa_saleprice_head_id = args.grid.getDataItem(args.row).sa_saleprice_head_id;
        var saleorder_no = args.grid.getDataItem(args.row).saleorder_no;
        BasemanService.swalWarning("提示","确定要审核"+saleorder_no+" 吗？",function (bool) {
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("sa_saleprice_head", "batchcheck", JSON.stringify(postData))
                .then(function (data) {
                    $scope.refresh();
                    BasemanService.notice("审核成功！","alert-success");
                });
        });
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
        postdata.search_flag = 5;
        if (!postdata.sqlwhere)
            postdata.sqlwhere = $scope.sqlwhere;

        BasemanService.RequestPost("sa_saleprice_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            HczyCommon.stringPropToNum(data.sa_saleprice_heads);
            setGridData($scope.headerGridView, data.sa_saleprice_heads);
        });
    }

    $scope.searchData = searchData;

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.sqlwhere = ""
        $scope.searchData();
    }


    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            //title: '',
            //thead: [],
            //url: "/jsp/req.jsp",
            //direct: "left",
            //sqlBlock: "",
            //backdatas: "sa_out_bill_head",
            ignorecase: 'true', //忽略大小写
            //postdata: {},
            is_high: true
        };

        $scope.FrmInfo.thead = $scope
            .headerColumns
            .slice(2)
            .map(function (column) {
                if (!column.type) {
                    if (column.options)
                        column.type = 'list';
                    else if (column.cssClass === 'amt')
                        column.type = 'number';
                    else
                        column.type = 'string';
                }

                return {
                    name: column.name,
                    code: column.field,
                    type: column.type,
                    dicts: column.options
                };
            });

        sessionStorage.setItem('frmInfo', JSON.stringify($scope.FrmInfo));

        return BasemanService
            .open(CommonPopController1, $scope)
            .result
            .then(function (sqlwhere) {
                $scope.sqlwhere = sqlwhere;
            })
            .then($scope.searchData);
    }

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize * ($scope.currentPage - 1);
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
        BasemanService.openModal({
            "style": {width: 1050, height: 600},
            "url": "/index.jsp#/saleman/sa_saleprice_special_pro/" + args.grid.getDataItem(args.row).sa_saleprice_head_id,
            "title": $scope.headername,
            "obj": $scope,
            "action": "update",
            ondestroy: $scope.searchData()
        });
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.is_cancellation = 1;
        BasemanService.openModal({
            "style": {width: 1050, height: 600},
            "url": "/index.jsp#/saleman/sa_saleprice_special_pro/0",
            "title": $scope.headername,
            "obj": $scope,
            "action": "insert",
            ondestroy: $scope.refresh
        });
    };

    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.sa_saleprice_head_id = args.grid.getDataItem(args.row).sa_saleprice_head_id;
        var saleorder_no = args.grid.getDataItem(args.row).saleorder_no;

        BasemanService.swalWarning("删除","确定要删除"+saleorder_no+" 吗？",function (bool) {
            if(bool){
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("sa_saleprice_head", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        dg.getData().splice(rowidx, 1);
                        dg.invalidateAllRows();
                        dg.render();
                        BasemanService.notice("删除成功！", "alert-success");//warning
                    });
            }else {
                return;
            }
        });
    };


    /**
     * 触发上传文件
     */
    $scope.doUploadFile = function () {
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
        //inputObj.setAttribute("accept", "image/*");
        inputObj.setAttribute("capture", "camera");
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
                    url: "/web/scp/filesuploadexcel.do",
                    type: 'post',
                    secureuri: false,
                    fileElementId: 'file1',//file标签的id
                    dataType: 'text',//返回数据的类型
                    data: {"classname": "com.ajerp.saleman.Sa_Saleprice_Head", "funcname": "doInsertSpecialFromExcel"},
                    success: function (data, status) {
                        var objdata = eval("(" + data + ")");
                        if (objdata.data.attribute11) {
                            toastr.error(objdata.data.attribute11);
                        } else {
                            toastr.success("导入成功！");
                            $scope.refresh();
                        }
                    },
                    error: function (data, status, e) {
                        console.log(data);
                    }
                });
            } finally {

            }
        }
    };

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}

//注册控制器
angular.module('inspinia')
    .controller('sa_saleprice_head_special', sa_saleprice_head_special)