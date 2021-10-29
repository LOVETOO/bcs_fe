/**
 * 客户回款单
 */
function fd_rebate_pro($scope,BasemanService,$stateParams,$q,Magic,AgGridService ) {

    IncRequestCount();
    DecRequestCount();

    $scope.data = {"objtypeid": 180523, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"fd_rebate_head_id": $stateParams.id};
    //初始化数据
    $scope.RebateTypes = [];//返利计算方式
    $scope.billStats = [];
   //明细序号
    var lineMaxSeq = 0;

    //明细表网格列属性
    $scope.lineColumns = [
        {
            type: "序号"
        }, {
            headerName: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 100,
            pinned: true
        }, {
            headerName: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 150
        },{
            headerName: "价格单号",
            id: "saleprice_head_no",
            field: "saleprice_head_no",
            width: 120
        },{
            headerName: "供货数量",
            id: "contract_qty",
            field: "contract_qty",
            width: 100
        },{
            headerName: "实际供货数",
            id: "fact_qty",
            field: "fact_qty",
            hide:true,
            width: 100,
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            onCellValueChanged: function (args) {
                setWriteOffQtyAmt(args);
            }
        },{
            headerName: "出库数量",
            id: "inv_qty",
            field: "inv_qty",
            width: 90
        },{
            headerName: "出库金额",
            id: "inv_amt",
            field: "inv_amt",
            width: 100,
            type:"金额"
        },{
            headerName: "返利率%",
            id: "rebate_rate",
            field: "rebate_rate",
            hide:true,
            width: 80
        },
        // {
        //     headerName: "返利金额",
        //     id: "rebate_amt",
        //     field: "rebate_amt",
        //     width: 100,
        //     hide:true,
        //     type:"金额"
        // },
        {
            headerName: "提货价",
            id: "price_bill",
            field: "price_bill",
            width: 80,
            type:"金额"
        },{
            headerName: "运营价",
            id: "sprice_bill",
            field: "sprice_bill",
            width: 80,
            type:"金额"
        },{
            headerName: "项目合同价",
            id: "contract_price",
            field: "contract_price",
            hide:true,
            width: 100,
            type:"金额"
        },{
            headerName: "应冲数量",
            id: "write_off_qty",
            field: "write_off_qty",
            editable:true,
            width: 100,
            type:"数量",
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            onCellValueChanged: function (args) {
                setWriteOffAmt(args);
            }
        },{
            headerName: "应冲金额",
            id: "write_off_amt",
            field: "write_off_amt",
            width: 100,
            type:"金额"
        },
        {
            headerName: "客户编码",
            id: "customer_code",
            field: "customer_code",
            width: 90
        }, {
            headerName: "客户名称",
            id: "customer_name",
            field: "customer_name",
            width: 150
        },
        {
            headerName: "订货单号",
            id: "order_no",
            field: "order_no",
            width: 120
        }, {
            headerName: "ERP订单号",
            id: "erp_no",
            field: "erp_no",
            width: 120
        }, {
            headerName: "备注",
            id: "note",
            field: "note",
            editable:true,
            width: 300
        }
    ];

    //网格设置
    //明细表网格设置
    $scope.lineOptions = {
        columnDefs: $scope.lineColumns,
        enableColResize: true, //允许调整列宽
        onGridReady: function () {
            $scope.lineOptions.whenReady.resolve($scope.lineOptions);
        },
        whenReady: Magic.deferPromise()
    };

    AgGridService.createAgGrid('lineViewGrid', $scope.lineOptions);


    function setWriteOffAmt(args) {
        if($scope.data.currItem.rebate_type == 1){
            args.data.write_off_amt = args.newValue * (args.data.price_bill - args.data.sprice_bill);
        }
        refreshLineData();
        sumTotalRebate();
    }

    function setWriteOffQtyAmt(args) {
        if($scope.data.currItem.rebate_type == 2){
            args.data.write_off_qty = Math.min(args.data.fact_qty,args.data.inv_qty,args.data.contract_qty);
            args.data.write_off_amt = args.data.write_off_qty * args.data.price_bill * args.data.rebate_rate/100;
        }
        refreshLineData();
        sumTotalRebate();
    }

    function sumTotal() {
        var order_amt = 0;
        var rebate_amt = 0;
        $.each($scope.data.currItem.fd_rebate_lineoffd_rebate_heads,function (index,item) {
            order_amt+= Number(item.inv_amt);
            rebate_amt+= Number(item.write_off_amt);
        });
        $scope.data.currItem.order_amt = order_amt;
        $scope.data.currItem.write_off_amt = rebate_amt;
    }

    function sumTotalRebate() {
        var rebate_amt = 0;
        $.each($scope.data.currItem.fd_rebate_lineoffd_rebate_heads,function (index,item) {
            rebate_amt+= Number(item.write_off_amt);
        });
        $scope.data.currItem.write_off_amt = rebate_amt;
    }


    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rebate_type"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.RebateTypes = data.dicts;
        });

    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.billStats = data.dicts;
        });


    $scope.setWriteOff = function () {
        if($scope.data.currItem.rebate_type==2){
            $.each($scope.data.currItem.fd_rebate_lineoffd_rebate_heads,function (index,item) {
                if(item.write_off_qty>item.fact_qty){
                    item.write_off_qty = item.fact_qty;
                }
            });
        }

    }

    /**
     * 查看详细/新增
     */
    $scope.selectCurrenItem = function () {
        if($scope.data.currItem.fd_rebate_head_id > 0){
            //调用后台select方法查询详情
            BasemanService.RequestPost("fd_rebate_head", "select", JSON.stringify({"fd_rebate_head_id": $scope.data.currItem.fd_rebate_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                    if($scope.data.currItem.rebate_type==1){
                        $scope.lineOptions.columnApi.setColumnsVisible(['contract_price','rebate_rate','fact_qty'],false);
                    }else{
                        $scope.lineOptions.columnApi.setColumnsVisible(['contract_price','rebate_rate','fact_qty'],true);
                    }
                }).then(refreshLineData);
        }else{
            $scope.data.currItem = {
                "fd_rebate_head_id":0,
                "creation_date" : new Date().Format('yyyy-MM-dd hh:mm:ss'),
                "stat":1,
                "rebate_type":1,
                "rebate_rate":0,
                "fd_rebate_lineoffd_rebate_heads": []
            };
            refreshLineData();
        }
    }

    /**
     * 刷新明细表格数据
     * return {Promise}
     */
    function refreshLineData() {
        return $scope.lineOptions.whenReady.then(function () {
                $scope.lineOptions.hcApi.setRowData($scope.data.currItem.fd_rebate_lineoffd_rebate_heads);
            });
    }

    $scope.getProjectInvItems = function (project_id,rebate_type) {
        BasemanService.RequestPost("fd_rebate_head", "getProjectInvItems", JSON.stringify({"project_id": project_id,"rebate_type":rebate_type}))
            .then(function (data) {
                $scope.data.currItem.fd_rebate_lineoffd_rebate_heads = data.fd_rebate_lineoffd_rebate_heads;
                sumTotal();
                // if($scope.data.currItem.fd_rebate_lineoffd_rebate_heads.length>0&&$scope.data.currItem.rebate_type==2){
                //     $scope.data.currItem.customer_id = $scope.data.currItem.fd_rebate_lineoffd_rebate_heads[0].customer_id;
                //     $scope.data.currItem.customer_code = $scope.data.currItem.fd_rebate_lineoffd_rebate_heads[0].customer_code;
                //     $scope.data.currItem.customer_name = $scope.data.currItem.fd_rebate_lineoffd_rebate_heads[0].customer_name;
                //     $scope.data.currItem.allow_rebate_amt = $scope.data.currItem.fd_rebate_lineoffd_rebate_heads[0].allow_rebate_amt;
                // }
            }).then(refreshLineData);
    };
    
    $scope.setLines = function () {
        if($scope.data.currItem.rebate_type==1){
            $scope.lineOptions.columnApi.setColumnsVisible(['contract_price','rebate_rate','fact_qty'],false);
        }else{
            $scope.lineOptions.columnApi.setColumnsVisible(['contract_price','rebate_rate','fact_qty'],true);
        }
        $scope.getProjectInvItems($scope.data.currItem.project_id,$scope.data.currItem.rebate_type);
    }

    /**
     * 保存数据
     */
    $scope.saveData = function () {
        $q.when().then(function () {
                $scope.lineOptions.api.stopEditing();
            }).then(function () {
                var action = "insert";
                if ($scope.data.currItem.fd_rebate_head_id > 0) {
                    action = "update";
                }
                BasemanService.RequestPost("fd_rebate_head", action, JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        BasemanService.notice("保存成功！", "alert-success");
                        HczyCommon.stringPropToNum(data);
                        $scope.data.currItem = data;
                        refreshLineData();
                    });
            });
    }

    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if(type == 'project'){
            $scope.FrmInfo = {
                title: "工程查询",
                thead: [{
                    name: "工程编码",
                    code: "project_code"
                }, {
                    name: "工程名称",
                    code: "project_name"
                }],
                classid: "proj",
                url: "/jsp/req.jsp",
                backdatas: "projs",
                ignorecase: "true", //忽略大小写
                postdata: {},
                searchlist: ["project_code", "project_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.project_id = result.project_id;
                $scope.data.currItem.project_code = result.project_code;
                $scope.data.currItem.project_name = result.project_name;
                $scope.data.currItem.dept_name = result.dept_name;

                $scope.getProjectInvItems($scope.data.currItem.project_id,$scope.data.currItem.rebate_type);
            });
        }
    }

    /**
     * 随机数
     * @type {number}
     */
    var randomNum = (new Date()).getTime();

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
            objid: $scope.data.currItem.fd_rebate_head_id,
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
            + '/' + (urlParams.submit ? 1: 0) //是否提交流程
            + '?showmode=2';
    }

    /**
     * 流程实例初始化
     */
    $scope.initWfIns = function (bSubmit) {
        HczyCommon.stringPropToNum($scope.data.currItem);
        //制单后才显示流程
        if ($scope.data.currItem.fd_rebate_head_id && $scope.data.currItem.fd_rebate_head_id > 0) {
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
        if ($(e.target).is('#tab_head_wf')) {
            if (angular.element('#wfinspage').length == 0) {
                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
            }
            $scope.initWfIns();
        }
        else {
            $q
                .when()
                .then(refreshLineData)
            ;
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
        angular.element('#wfinspage')
            .attr('src', wfSrc({
                wftempid: wftempid
            }));
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);

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

    //对外暴露scope
    window.currScope = $scope;
}
//注册控制器
angular.module('inspinia')
    .controller('fd_rebate_pro', fd_rebate_pro);