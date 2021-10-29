/**这是资料共享界面js*/
function info_share($scope,BasemanService,BaseService) {
    $scope.data = {"objtypeid": 1003};
    //储存条件
    $scope.data.currItem = {"objattachs": []};
    $scope.data.currItem.creator = strUserId;
    $scope.data.currItem.createtime = new Date().Format("yyyy-MM-dd");
    $scope.data.currItem.updatetime = new Date().Format("yyyy-MM-dd");

    $scope.data.currItem.maxsearchrltcmt = 300;
    //页面数据绑定

    var editHeaderButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>查看</button> " +
            " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };
    var seqformatter = function (row, cell, value, columnDef, dataContext) {
        return "<div style='text-align:center;vertical-align:middle;'>" + value + "</div>"
    }

    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    //列属性
    $scope.headerColumns = [
        {
            name: "序号",
            id: "seq",
            field: "seq",
            editable: false,
            width: 45,
            height: 80,
            editor: Slick.Editors.Text,
            formatter: seqformatter
        },
        {
            name: "主题",
            id: "subject",
            field: "subject",
            editable: false,
            width: 185,
            height: 80,
            editor: Slick.Editors.Text,
        }, {
            name: "发布人",
            id: "creator",
            field: "creator",
            editable: false,
            filter: 'set',
            width: 75,
            height: 80,
            editor: Slick.Editors.Text
        }, {
            name: "发布时间",
            id: "createtime",
            field: "createtime",
            editable: true,
            width: 112,
            height: 80,
            editor: Slick.Editors.Text
        },
        {
            name: "修改人",
            id: "updator",
            field: "updator",
            editable: false,
            filter: 'set',
            width: 75,
            height: 80,
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            editor: Slick.Editors.Text
        }, {
            name: "修改日期",
            id: "updatetime",
            field: "updatetime",
            editable: false,
            filter: 'set',
            editable: true,
            width: 152,
            height: 80,
            editor: Slick.Editors.Text
        }, {
            name: "过期日期",
            id: "duedate",
            field: "duedate",
            editable: false,
            width: 98,
            height: 80,
            editor: Slick.Editors.DateEditor
        },{
            name: "内容",
            id: "content",
            field: "content",
            editable: false,
            width: 250,
            height: 80,
            editor: Slick.Editors.Text
        },
        {
            name: "操作",
            width: 100,
            cellEditor: "文本框",
            enableRowGroup: true,
            enablePivot: true,
            enableValue: true,
            floatCell: true,
            formatter: editHeaderButtons
        }
    ]

    $scope.headerGridView = new Slick.Grid("#viewGrid", [], $scope.headerColumns, $scope.headerOptions);
    $scope.headerGridView.onDblClick.subscribe(dgDbOnClick)
    $scope.headerGridView.onClick.subscribe(dgonclick)

    //点击事件
    function dgDbOnClick(e, args) {
        var bbsid = args.grid.getDataItem(args.row).bbsid;
        BasemanService.RequestPost("scpbbs", "select", {"bbsid":bbsid}).then(function (data) {
            if (data) {
                $scope.data.currItem = data;
                //显示模态页面
                $("#editModal").modal();
            }
        })
    }

    function dgonclick(e, args) {
        //点击删除按钮处理事件
        if($(e.target).hasClass("viewbtn")){
            var bbsid = args.grid.getDataItem(args.row).bbsid;
            BasemanService.RequestPost("scpbbs", "select", {"bbsid":bbsid}).then(function (data) {
                if (data) {
                    $scope.data.currItem = data;
                    //显示模态页面
                    $("#editModal").modal();
                }
            })
            e.stopImmediatePropagation();
        } else if ($(e.target).hasClass("delbtn")) {
            var dg = $scope.headerGridView;
            var rowidx = args.row;
            var postData = {};
            postData.bbsid = args.grid.getDataItem(args.row).bbsid;

            BasemanService.swalDelete("确定删除?","确定要删除该共享资料吗？",function (bool) {
                if(bool){
                    BasemanService.RequestPost("scpbbs", "delete", JSON.stringify(postData))
                        .then(function (data) {
                            dg.getData().splice(rowidx, 1);
                            dg.invalidateAllRows();
                            dg.render();
                        })
                }
            });
            e.stopImmediatePropagation();
        }
    }

    /**
     * 查询
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
        BasemanService.RequestPost("scpbbs", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            setGridData($scope.headerGridView, data.bbss);
            //重绘网格
            $scope.headerGridView.render();
        });
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

    //新增
    $scope.addNew = function () {
        $scope.data = {"objtypeid": 1003};
        //储存条件
        $scope.data.currItem = {"objattachs": []};
        $scope.data.currItem.creator = strUserId;
        $scope.data.currItem.createtime = new Date().Format("yyyy-MM-dd");
        $scope.data.currItem.updatetime = new Date().Format("yyyy-MM-dd");
        //显示模态页面
        $("#editModal").modal();
    }

    //保存
    $scope.save = function () {
        var action = "insert";
        if($scope.data.currItem.bbsid>0){
            action = "update";
        }
        BasemanService.RequestPost("scpbbs", action, JSON.stringify($scope.data.currItem)).then(
            function (data) {
                BasemanService.swalSuccess("完成!", "发布成功!", "success");
                $scope.data.currItem = {"objattachs": []};
                $scope.data.currItem.creator = strUserId;
                $scope.data.currItem.createtime = new Date().Format("yyyy-MM-dd");
                $scope.data.currItem.updatetime = new Date().Format("yyyy-MM-dd");
                $scope.searchData();
            }
        );
    }

    $scope.searchData();
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
                    dataType: 'json',//返回数据的类型
                    success: function (data, status) {
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
     * 下载文件
     * @param file
     */
    $scope.downloadAttFile = function (file) {
        window.open("/downloadfile.do?docid=" + file.docid);
    }

    //加载时间插件
    $('#duedate').datetimepicker({
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
    .controller('info_share', info_share);

