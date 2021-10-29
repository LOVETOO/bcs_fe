
function sa_order_delivery_head($scope, BasemanService, BaseService) {
    $scope.data = {};
    //初始化数据
    $scope.billStats = [];
    $scope.order_clerk = userbean.hasRole('order_clerk', true);

    //明细序号
    var id = 0;
    //添加按钮
    var editHeaderButtons =  function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1&&$scope.order_clerk){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle submitbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">提交</button>';
        }
        if (rowData.stat == 2&&$scope.order_clerk){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            //buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };

    //获取登录用户数据
    $scope.sysuserid = window.userbean.sysuserid;


    $scope.terms = [{id:1,name:"上午"},{id:2,name:"下午"}];



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
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 60
        },{
            name: "操作",
            width: 120,
            formatter: editHeaderButtons
        },{
            id: "stat",
            name: "状态",
            field: "stat",
            width: 80,
            formatter: Slick.Formatters.SelectOption,
            type:'list'
        },{
            id: "order_delivery_code",
            name: "交期单号",
            field: "order_delivery_code",
            width: 120,
            type:'string'
        },{
            id: "term",
            name: "时段",
            field: "term",
            dictcode:'term',
            width: 60,
            formatter: Slick.Formatters.SelectOption,
            type:'list'
        },{
            id: "order_date",
            name: "订单日期",
            field: "order_date",
            width: 100,
            formatter: Slick.Formatters.Date,
            type:'date'
        },{
            id: "start_date",
            name: "开始时间",
            field: "start_date",
            width: 150,
            //formatter: Slick.Formatters.Date,
        },
        {
            id: "end_date",
            name: "结束时间",
            field: "end_date",
            width: 150,
            //formatter: Slick.Formatters.Date,
        },
        {
            id: "creator",
            name: "制单人",
            field: "creator",
            width: 100,
            type:'string'
        },{
            id: "createtime",
            name: "制单日期",
            field: "createtime",
            width: 100,
            formatter: Slick.Formatters.Date,
            type:'date'
        }, {
            id: "note",
            name: "备注",
            field: "note",
            width: 240,
            type:"string"
        }
    ];

    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.headerColumns
    });

    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGridView",[], $scope.headerColumns, $scope.headerOptions);

    //明细绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    $scope.headerGridView.onDblClick.subscribe(dgDblClick);


    /**
     * 取词汇值方法
     */
    function searchDict(dictname, field, grid, gridcolumns, columnname) {
        var dictdata = [];
        BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: dictname})
            .then(function (data) {
                var dicts = [];
                var gridnames = [];
                for (var i = 0; i < data.dicts.length; i++) {
                    dicts[i] = {
                        value: parseInt(data.dicts[i].dictvalue),
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

    //取词汇值
    $scope.billStats = searchDict("stat", "stat", $scope.headerGridView, $scope.headerColumns, "headerColumns");


    /**
     * 网格单击事件
     */
    function dgOnClick(e, args) {
        var rowidx = args.row;
        id = args.grid.getDataItem(rowidx).sa_order_delivery_head_id;
        if ($(e.target).hasClass("viewbtn")) {
            $scope.detail(args,'view');
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var postData = {};
            postData.sa_order_delivery_head_id = args.grid.getDataItem(rowidx).sa_order_delivery_head_id;
            var order_delivery_code = args.grid.getDataItem(rowidx).order_delivery_code;
            BasemanService.swalWarning("删除", "确定要删除单据 " + order_delivery_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("sa_order_delivery_head", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            var dg = $scope.headerGridView;
                            dg.getData().splice(rowidx, 1);
                            BasemanService.notice("删除成功！","alert-success");
                            dg.invalidateAllRows();
                            dg.render();
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }else if ($(e.target).hasClass("submitbtn")) {
            var postData = {};
            postData.sa_order_delivery_head_id = args.grid.getDataItem(rowidx).sa_order_delivery_head_id;
            postData.stat = 2;
            postData.flag = 1;
            var order_delivery_code = args.grid.getDataItem(rowidx).order_delivery_code;
            BasemanService.swalWarning("提交", "确定要提交单据 " + order_delivery_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("sa_order_delivery_head", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.searchData();
                            BasemanService.notice("提交成功！","alert-success");
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }else if ($(e.target).hasClass("checkbtn")) {
            var postData = {};
            postData.sa_order_delivery_head_id = args.grid.getDataItem(rowidx).sa_order_delivery_head_id;
            postData.stat = 5;
            postData.flag = 2;
            var order_delivery_code = args.grid.getDataItem(rowidx).order_delivery_code;
            BasemanService.swalWarning("审核", "确定要审核单据 " + order_delivery_code + " 吗？", function (bool) {
                if (bool) {
                    BasemanService.RequestPost("sa_order_delivery_head", "check", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.searchData();
                            BasemanService.notice("审核成功！","alert-success");
                        });
                } else {
                    return;
                }
            })
            e.stopImmediatePropagation();
        }
    };


    /**
     * 网格双击事件
     */
    function dgDblClick(e, args) {
        $scope.detail(args,'view');
    }


    /**
     * 查询主表数据
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            if(!$scope.oldPage ){
                $scope.oldPage = 1;
            }
            if(!$scope.currentPage){
                $scope.currentPage = 1;
            }
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination:"pn=" + $scope.currentPage + ",ps=" + $scope.pageSize + ",pc=0,cn=0,ci=0"
            }
        }
        if ($scope.sqlwhere && $scope.sqlwhere !=""){
            postdata.sqlwhere = $scope.sqlwhere
        }
        BasemanService.RequestPost("sa_order_delivery_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.sa_order_delivery_heads);
        });
    }



    /**
     * 查看详细/新增
     */
    $scope.detail = function (args,type) {
        if(type == 'add'){
            BasemanService.openModal({"style":{width:1150,height:620},"url": "/index.jsp#/saleman/sa_order_delivery_pro/0","title":"订单交期反馈",
                "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
        }
        if(type == 'view'){
            BasemanService.openModal({"style":{width:1150,height:620},"url": "/index.jsp#/saleman/sa_order_delivery_view/" + args.grid.getDataItem(args.row).sa_order_delivery_head_id,
                "title":"订单交期反馈","obj":$scope,"action":"update",ondestroy: $scope.refresh});
        }
    };

        /**
         * 刷新
         */
        $scope.refresh = function () {
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


    $scope.downloadtemp = function () {
        if(id>0){
            $("#downloadtemp").attr("href", "downloadexcelfile.do?id=" + id+"&sysuserid="+$scope.sysuserid);
        }else{
            BasemanService.notice("请点击列表选中一行数据！","alert-success");
        }
    }

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
                    data: {"flag":0,"classname": "com.ajerp.saleman.Sa_Order_Delivery_Head", "funcname": "doInsertFromExcel"},
                    success: function (data, status) {
                        var objdata = eval("(" + data + ")");
                        if (objdata.data.note) {
                            toastr.error(objdata.data.note);
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

    /**
     * 条件查询
     */
    $scope.searchBySql = function () {
        $scope.FrmInfo = {
            title: "",
            thead: [],
            url: "/jsp/req.jsp",
            sqlBlock: "",
            backdatas: "sa_order_delivery_head",
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

    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('sa_order_delivery_head', sa_order_delivery_head);