
function sa_saleprice_head($scope, BasemanService, BaseService ) {
    $scope.data = {};
    $scope.data.currItem = {};

    //添加按钮
    var editHeaderButtons =  function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };

    //查询下载导入格式文件id
    BasemanService.RequestPostAjax("scpsysconf", "selectref", {confname:'priceimptemple'})
        .then(function (data) {
            var docid = data.sysconfs[0].confvalue;
            $("#priceimptemple").attr("href", "/downloadfile?docid=" + docid);
        });

    $scope.yeorno = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

    var is_cancellation = function (row,cell,value) {
        var r = '';
        $.each($scope.yeorno, function (i, item) {
            if(item.id == value){
                r = item.name;
                return;
            }
        });
        return r;
    };

    $scope.billStats = [];
    //词汇表单据状态取值
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
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        },
        {
            id: "saleorder_no",
            name: "价目表编号",
            behavior: "select",
            field: "saleorder_no",
            editable: false,
            filter: 'set',
            width: 120,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
        },
        {
            id: "saleprice_type_name",
            name: "价格类型",
            field: "saleprice_type_name",
            width: 80
        },
        {
            id: "start_date",
            name: "开始日期",
            behavior: "select",
            field: "start_date",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter: Slick.Formatters.Date
        },
        {
            id: "end_date",
            name: "结束日期",
            behavior: "select",
            field: "end_date",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter: Slick.Formatters.Date
        },
        {
            id: "date_invbill",
            name: "制单日期",
            behavior: "select",
            field: "date_invbill",
            editable: false,
            filter: 'set',
            width: 85,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter: Slick.Formatters.Date
        },
        {
            id: "stat",
            name: "流程状态",
            behavior: "select",
            field: "stat",
            editable: false,
            filter: 'set',
            width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "is_cancellation",
            name: "作废",
            behavior: "select",
            field: "is_cancellation",
            editable: false,
            filter: 'set',
            width: 80,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false,
            formatter: Slick.Formatters.YesNo
        },
        {
            id: "note",
            name: "备注",
            behavior: "select",
            field: "note",
            editable: false,
            filter: 'set',
            width: 250,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: false
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
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("checkbtn")) {
            check_bill(args);
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
        if(!postdata.pagination){
            postdata.pagination = BasemanService.initPagePostdata($scope)
        }
        if ($scope.sqlwhere){
            postdata.sqlwhere = $scope.sqlwhere
        }
        postdata.search_flag = 7;
        BasemanService.RequestPost("sa_saleprice_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.sa_saleprice_heads);
        });
    }
    $scope.searchData = searchData
    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.sqlwhere = ""
        $scope.searchData();
    }


    /** 高级条件查询 **/
    $scope.searchBySql = function () {
        BasemanService.searchBySql($scope,$scope.headerColumns,searchData);
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
        BasemanService.openModal({"style":{width:1050,height:600},"url": "/index.jsp#/saleman/sa_saleprice_pro/" + args.grid.getDataItem(args.row).sa_saleprice_head_id,
            "title":"销售价格","obj":$scope,"action":"update",ondestroy: $scope.refresh});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        BasemanService.openModal({"style":{width:1050,height:600},"url": "/index.jsp#/saleman/sa_saleprice_pro/0","title":"销售价格",
            "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
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
        BasemanService.swalWarning("提示","确定要删除"+saleorder_no+" 吗？",function (bool) {
            //删除数据成功后再删除网格数据
            BasemanService.RequestPost("sa_saleprice_head", "delete", JSON.stringify(postData))
                .then(function (data) {
                    dg.getData().splice(rowidx, 1);
                    dg.invalidateAllRows();
                    dg.render();
                    BasemanService.notice("删除成功！","alert-success");
                });
        });
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
                    data: {"classname": "com.ajerp.saleman.Sa_Saleprice_Head", "funcname": "doInsertFromExcel"},
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
    .controller('sa_saleprice_head', sa_saleprice_head);