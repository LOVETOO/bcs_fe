/**
 * 工程项目进度登记(浏览页)
 * @since 2018-05-10
 */
angular.module('inspinia').controller('crm_project_process_header', function ($scope, BasemanService, SlickGridService) {/*, $filter, $location, $rootScope, $modal, $timeout, notify, $state, localeStorageService, FormValidatorService, $stateParams) {*/

    $scope.data = {
        currItem: {
            objattachs: []
        }
    };

    /**
     * 标题
     * @returns {string}
     */
    $scope.getTitle = function () {
        return '项目进度更新';
    };

    /**
     * 业务类名
     * @returns {string}
     */
    $scope.getClassId = function () {
        return 'crm_project';
    };

    /**
     * ID字段名
     * @returns {string}
     */
    $scope.getIdField = function () {
        return 'project_id';
    };

    /**
     * 编码字段名
     * @returns {string}
     */
    $scope.getCodeField = function () {
        return 'project_code';
    };

    /**
     * 编码字段中文名
     * @returns {string}
     */
    $scope.getCodeTitle = function () {
        return '工程编码';
    };

    // 添加按钮
    $scope.editButtons = function (row, cell, value, columnDef, dataContext) {
        return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>进度登记</button>"; // +
            //"<button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>删除</button>";
    };

    /**
     * 表格选项
     */
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
    };

    /**
     * 表格的列
     */
    $scope.headerColumns = [{
        field: 'seq',
        name: '序号',
        width: 48
    }, {
        name: '操作',
        formatter: $scope.editButtons,
        width: 80
    }, {
        field: 'project_code',
        name: '工程编码',
        width: 160
    }, {
        field: 'project_name',
        name: '工程名称',
        width: 200
    }, {
        field: 'stat',
        name: '状态',
        dictcode: '.',
        width: 100
    }, {
        field: 'project_type',
        name: '工程类型',
        dictcode: '.',
        width: 100
    }, {
        field: 'customer_name',
        name: '申请方',
        width: 160
    }, {
        field: 'sale_center_name',
        name: '渠道所属销售中心',
        dictcode: '.',
        width: 160
    }, {
        field: 'project_address',
        name: '工程详细地址'
    }, {
        field: 'project_period',
        name: '工程阶段',
        dictcode: '.',
        width: 100
    }, {
        field: 'proposer',
        name: '申请人'
    }, {
        field: 'proposer_phone',
        name: '联系电话'
    }, {
        field: 'complete_percent',
        name: '工程进度'
    }, {
        field: 'manager',
        name: '工程跟进人'
    }, {
        field: 'manager_phone',
        name: '跟进人电话'
    }];

    $scope.headerColumns.forEach(function (column) {
        if (!column.width)
            column.width = 180; //默认宽度
    });

    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.headerColumns
    });

    //初始化网格
    $scope.headerGrid = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    /**
     * 主表网格点击事件
     * @param e
     * @param args
     */
    function dgOnClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        if (activeRow && activeRow.stat != 98) {
            $scope.isUnchecked = true;
        } else {
            $scope.isUnchecked = false;
        }
        if ($(e.target).hasClass("viewbtn")) {
            isEdit = 3;
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            var rowData = args.grid.getDataItem(args.row); //行数据
            var stat = rowData.stat; //状态
            if (stat > 1) {
                BasemanService.swalWarning("提示", "当前单据状态不是“制单”状态，不能删除！");
                return;
            }

            var code = rowData[$scope.getCodeField()];
            BasemanService.swalDelete('删除', '确定要删除【' + $scope.getCodeTitle() + '】为【' + code + '】的' + $scope.getTitle() + '吗？', function (bool) {
                if (!bool) return;

                var postData = {};
                postData[$scope.getIdField()] = rowData[$scope.getIdField()];
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost($scope.getClassId(), "delete", postData).then(function (data) {
                    args.grid.getData().splice(args.row, 1);
                    args.grid.invalidateAllRows();
                    args.grid.render();
                    $scope.btnRefreshClick();
                });
            });
            e.stopImmediatePropagation();
        }
    };

    function dgOnDblClick(e, args) {
        $scope.viewDetail(args);
    }


    //主表绑定点击事件
    $scope.headerGrid.onClick.subscribe(dgOnClick);
    $scope.headerGrid.onDblClick.subscribe(dgOnDblClick);

    /**
     * 查看作废信息
     */
    $scope.uncheckMsg = function () {
        if (activeRow == "" || activeRow == null) {
            BasemanService.swal("提示", "请选择单据");
        } else {
            //弹出作废原因模态框
            $("#uncheckMsgModal").modal();
        }
    }

    /**
     * 增加工程项目报备
     */
    $scope.btnAddClick = function () {
        BasemanService.openModal({
            url: "/index.jsp#/saleman/crm_project_process_bill/0",
            title: $scope.getTitle(),
            obj: $scope,
            ondestroy: $scope.btnRefreshClick
        });
        isEdit = 0;
    }

    /**
     * 查询后台数据
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            $scope.oldPage = 1;
            if (!$scope.currentPage) $scope.currentPage = 1;
            if (!$scope.pageSize) $scope.pageSize = "20";
            $scope.totalCount = 0;
            $scope.pages = 1;
            postdata = {
                pagination: 'pn=' + $scope.currentPage + ',ps=' + $scope.pageSize + ',pc=0,cn=0,ci=0'
            }
        }
        postdata.sqlwhere = 'p.stat = 5';
        BasemanService.RequestPost("crm_project", "search", postdata)
            .then(function (data) {
                SlickGridService.setData({
                    grid: $scope.headerGrid,
                    data: data.crm_projects
                });
                /*var searchData = data.crm_projects;
                //清空网格
                $scope.headerGrid.setData([]);
                //设置数据
                $scope.headerGrid.setData($scope.data.currItem.crm_projects);
                //重绘网格
                $scope.headerGrid.render();*/
                BasemanService.pageInfoOp($scope, data.pagination);
            });
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({
            url: "/index.jsp#/saleman/crm_project_process_bill/" + args.grid.getDataItem(args.row).project_id,
            title: $scope.getTitle(),
            obj: $scope,
            ondestroy: $scope.btnRefreshClick
        });
    };

    //模态框取消事件
    $scope.hideModal = function () {
        $("#addLineModal").modal("hide");
        isEdit = 0;
    }
    $('#addLineModal').on('hide.bs.modal', function () {
        isEdit = 0;
    });
    //加载时间插件
    $('#creatDate').datetimepicker({
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
    //网格自适应高度
    BasemanService.initGird();
    //初始化分页
    BasemanService.pageGridInit($scope);


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
     * 流程实例初始化
     */
    $scope.initWfIns = function () {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.bx_id && $scope.data.currItem.bx_id > 0) {
            if ($scope.data.currItem.wfid && $scope.data.currItem.wfid > 0) {
                if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2');
                }
            } else if ($scope.data.currItem.stat == 1) {
                var postData = {
                    "objtypeid": $scope.data.objtypeid
                }
                BasemanService.RequestPost("scpobjconf", "select", JSON.stringify(postData))
                    .then(function (data) {
                        if (data.objwftempofobjconfs && data.objwftempofobjconfs.length > 0) {
                            if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2') {
                                angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + data.objwftempofobjconfs[0].wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.bx_id + '/0?showmode=2');
                            }
                        }
                    });
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        if (e) {
            var tabName = $(e.target).text();
            console.log("tabName: " + tabName);
            if ('流程' == tabName) {
                if (angular.element('#wfinspage').length == 0) {
                    $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                }
                $scope.initWfIns();
            } else {
                //页面也换到非流程页面时设置iframe的src为空，以便切换到frame时页面能自动刷新
                //angular.element('#wfinspage').attr('src','');
            }
        }
    }

    //详情页面隐藏时初始化显示第一个tab页面
    $('#detailModal').on('hidden.bs.modal', function (e) {
        //隐藏后默认显示第一个
        $('#detailtab a:first').tab('show');
        //angular.element('#wfinspage').attr('src', '');
        $("#wfinsform").empty();
    })
    //modal显示时绑定切换事件
    $('#detailModal').on('shown.bs.tab', $scope.onTabChange);

    $('#detailtab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    })

    /**
     * 页面刷新
     */
    $scope.btnRefreshClick = function () {
        $scope.searchData();
    }

    /**
     * 去除千分号
     */
    function delMoney(num) {
        num = num.toString().replace(/\,/ig, '');
        return parseFloat(num);
    }
});

//注册控制器
//angular.module('inspinia').controller('crm_project_header', crm_project_header);