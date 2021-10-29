
//监听加载停止加载动画
IncRequestCount("post");
DecRequestCount();

function sa_saleprice_project_bill($scope,  BasemanService ,$stateParams,Magic,AgGridService,$q) {
    $scope.data = {"objtypeid": 180427, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"objattachs": [], "sa_saleprice_head_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    //设置标题
    $scope.headername = "工程特价申请";
    var activeRow = [];
    var isEdit = 0;
    //作废
    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

    //获取登录用户数据
    $scope.data.show = false;
    $scope.userbean = window.userbean;
    if($scope.userbean.stringofrole.indexOf("item_cost") != -1 ){
        $scope.data.show = true;
    }

    $scope.data.rebate_audit = false;
    if($scope.userbean.stringofrole.indexOf("rebate_audit") != -1 ){
        $scope.data.rebate_audit = true;
    }

    $scope.data.cost_accounting = false;
    if($scope.userbean.stringofrole.indexOf("cost_accounting") != -1 ){
        $scope.data.cost_accounting = true;
    }

    //返利方式
    $scope.RebateTypes = [];
    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "rebate_type"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.RebateTypes = data.dicts;
        });

    //词汇表单据状态
    $scope.billStats =[];
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });

    //词汇表单据状态取值
    // BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_sale_center"})
    //     .then(function (data) {
    //         $scope.sale_center = data.dicts;
    //         //HczyCommon.stringPropToNum(data.dicts);
    //     });

    // 添加按钮
    var editlineButtons = function (row, cell, value, columnDef, dataContext) {
        if ($scope.data.currItem.stat != 1) {
            return;
        } else {
            return "<button class='btn btn-sm btn-info dropdown-toggle viewbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;'>编辑</button> "
                +   " <button class='btn btn-sm btn-info dropdown-toggle delbtn' style='padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;' >删除</button> ";
        }
    };


    //明细表网格设置
    // $scope.lineOptions = {
    //     editable: true,
    //     enableAddRow: false,
    //     enableCellNavigation: true,
    //     asyncEditorLoading: false,
    //     autoEdit: true,
    //     rowHeight: 30
    // };


    //明细表网格列属性
    $scope.lineColumns = [
        {
            type: "序号"
        },
        {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            width: 100,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            pinned:true,
            editable:true,
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                rqLine(args).catch(function (reason) {
                    return {
                        item_id:0,
                        item_name: reason
                    };
                }).then(function (line) {
                    angular.extend(args.data, line);
                }).then(refreshLineData);
            }
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        },
        {
            name: "供货数量",
            id: "contract_qty",
            field: "contract_qty",
            width: 100,
            type:"数量",
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            editable:true,
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                $scope.setTotal(args.data);
                $scope.setHeadTotal();
                args.api.refreshView();
            }
        },
        {
            name: "项目合同价",
            id: "contract_price",
            field: "contract_price",
            width: 100,
            type: "金额",
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            editable:true,
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                $scope.setTotal(args.data);
                $scope.setHeadTotal();
                args.api.refreshView();
            }
        },
        {
            name: "工程总量(合同价)",
            id: "contract_amount",
            field: "contract_amount",
            width: 140,
            type: "金额"
        },
        {
            name: "经销价",
            id: "distribution_price",
            field: "distribution_price",
            width: 90,
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            type: "金额",
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                $scope.setHeadTotal();
                args.api.refreshView();
            }
        },
        {
            name: "运营价",
            id: "price_bill",
            field: "price_bill",
            width: 90,
            type: "金额"
        },{
            name: "运营价总额",
            id: "total_amt",
            field: "total_amt",
            width: 100,
            type: "金额"
        },{
            name: "项目运营价",
            id: "prj_price",
            field: "prj_price",
            width: 100,
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            type: "金额",
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                $scope.setTotal(args.data);
                $scope.setHeadTotal();
                args.api.refreshView();
            }
        },{
            name: "项目运营价总额",
            id: "prj_total_amt",
            field: "prj_total_amt",
            width: 150,
            type: "金额"
        }];
    if($scope.data.show==true||$scope.data.cost_accounting==true) {
        $scope.lineColumns.push(
            {
                name: "不含税成本",
                id: "standard_cost",
                field: "standard_cost",
                width: 100,
                editable: true,
                cellStyle: function (args) {
                    return {'background-color': '#FFCC80'};
                },
                type: "金额",
                onCellValueChanged: function (args) {
                    if (args.newValue === args.oldValue)
                        return;
                    $scope.setCostTax(args.data);
                    $scope.setHeadTotal();
                    args.api.refreshView();
                }
            },
            {
                name: "含税成本",
                id: "standard_cost_tax",
                field: "standard_cost_tax",
                width: 100,
                type: "金额"
            },
            {
                name: "含税总成本",
                id: "tax_cost_amt",
                field: "tax_cost_amt",
                width: 100,
                type: "金额"
            },
            {
                name: "毛利率(%)",
                id: "margin_rate",
                field: "margin_rate",
                width: 100,
                type: "数字"
            })
    }
    if($scope.data.rebate_audit){
        $scope.lineColumns.push({
                name: "批准返利率%",
                id: "ratio_resources",
                field: "ratio_resources",
                width: 110,
                editable:true,
                cellStyle: function(args) {
                    return {'background-color':'#FFCC80'};
                },
                type: "数字",
                onCellValueChanged: function (args) {
                    if (args.newValue === args.oldValue)
                        return;
                    $scope.setLineRebate(args.data);
                    $scope.setHeadTotal();
                    args.api.refreshView();
                }

            },
            {
                name: "返利金额",
                id: "allow_rebate_amt",
                field: "allow_rebate_amt",
                width: 100,
                type: "金额",
                cellStyle: function(args) {
                    return {'background-color':'#FFCC80'};
                },
                editable:true,
                onCellValueChanged: function (args) {
                    if (args.newValue === args.oldValue)
                        return;
                    $scope.setLineRebateAmt(args.data);
                    $scope.setHeadTotal();
                    args.api.refreshView();
                }
            });
    }
    $scope.lineColumns.push(
        {
            name: "销售组织",
            id: "entorgcode",
            field: "entorgcode",
            width: 100
        },
        {
            name: "备注",
            id: "remark",
            field: "remark",
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            width: 200
        });



    // //初始化网格
    // $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns, $scope.lineOptions);
    // //明细绑定点击事件
    // $scope.lineGridView.onClick.subscribe(dgLineClick);
    // $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);
    $scope
        .lineColumns
        .forEach(function (column) {
            if (!column.headerName && column.name)
                column.headerName = column.name;
        })
    ;

    //明细表网格设置
    $scope.lineOptions = {
        columnDefs: $scope.lineColumns,
        onGridReady: function () {
            $scope.lineOptions.whenReady.resolve($scope.lineOptions);
        },
        whenReady: Magic.deferPromise()
    };
    AgGridService.createAgGrid('lineViewGrid', $scope.lineOptions);


    /**
     * 刷新明细表格数据
     * return {Promise}
     */
    function refreshLineData() {
        return $scope
            .lineOptions
            .whenReady
            .then(function () {
                $scope
                    .lineOptions
                    .hcApi
                    .setRowData($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
            });
    }


    function rqLine(args) {
        //【明细】
        var line = args.data;
        var itemCode = args.newValue;
        return $q
            .when()
            .then(function () {
                if (!itemCode)
                    return $q.reject('');
                return line;
            })
            //----------------------------------------发请求查询【产品】----------------------------------------
            .then(requestItem)
            //----------------------------------------请求响应后----------------------------------------
            .then(function (respose) {
                line = respose;
                //若查的到产品
                if (line.item_name) {
                    return line;
                }else{
                    return $q.reject('产品编码【' + itemCode + '】不存在或不适用');
                }
            })
            //---------------------------------获取成本-------------
            .then(setLineData)
            .then(function (args) {
                line =  args;
                return line;
            });
    }


    /**
     * 查询【产品】的请求
     * @param args = {
     *     item_code: 产品编码
     * }
     * @return {Promise}
     */
    function requestItem(line) {
        return BasemanService
            .RequestPost('item_org', 'search', {
                searchflag: 22,
                customer_id: $scope.data.currItem.customer_id,
                attribute1: $scope.data.currItem.customer_code,
                attribute2: $scope.data.currItem.sale_center,//销售渠道 1000-3000
                sqlwhere: "(i.item_code = '" +  line.item_code + "')"
            })
            .then(function (response) {
                if (response.item_orgs.length>0) {
                    var result =  response.item_orgs[0];
                    line.item_id = result.item_id;
                    line.item_code = result.item_code;
                    line.item_name = result.item_name;
                    line.pack_uom = result.pack_uom;
                    line.pack_qty = Number(result.spec_qty);
                    line.is_round = result.is_round;
                    return line;
                }else {
                    return $q.reject('产品编码【' + line.item_code + '】不存在或不可用');
                }

            });
    }

    function setLineData(args) {
        return BasemanService.RequestPost("warehouse", "getwarehouse", {customer_id:$scope.data.currItem.customer_id,
            sale_center:$scope.data.currItem.sale_center,item_code:args.item_code})
            //--------获取仓库
            .then(function (warehouse) {
                if (warehouse.warehouse_id > 0) {
                    args.warehouse_id = warehouse.warehouse_id;
                    args.warehouse_code = warehouse.warehouse_code;
                    args.warehouse_name = warehouse.warehouse_name;
                    args.factory_code = warehouse.factory_code;
                    args.standard_cost = 0;
                    return args;
                }else{
                    return  $q.reject('产品编码【' + args.item_code + '】获取成本失败');
                }})
            //-----获取成本
            .then(getCost)
            //-----获取运营价
            .then(getPrice)
            //--计算行明细
            .then($scope.setTotal).then($scope.setHeadTotal);
    }

    function getCost(args) {
        //获取成本
        return BasemanService.RequestPost("item_org", "getcost", {attribute1:args.factory_code, item_code:args.item_code})
            .then(function (cost) {
                if(cost.price_ctr=='S'){
                    args.standard_cost = (cost.standard_price/cost.price_unit).toFixed(2);
                }else if(cost.price_ctr=='V'){
                    args.standard_cost = (cost.standard_price/cost.price_unit).toFixed(2);
                }
                HczyCommon.stringPropToNum(args);
                args.standard_cost_tax = (args.standard_cost * 1.16).toFixed(2);
                return args;
            });
    }

    function getPrice(args) {
        //获取价格
        var postData = {
            date_invbill:  $scope.data.currItem.date_invbill,
            customer_id:  $scope.data.currItem.customer_id,
            item_id: args.item_id,
            flag:3,
        };
        var entorgs = $scope.data.currItem.sale_center.split("-");
        $.each(entorgs,function (index,item) {
            if(item.charAt(0)==args.factory_code.toString().charAt(0)){
                args.entorgcode = item;
                postData.attribute21 = item;
            }
        });
        return BasemanService.RequestPost("sa_saleprice_head", "getprice", JSON.stringify(postData))
            .then(function (data) {
                args.price_bill = data.price_bill_sp;
                //args.start_date = data.attribute21;
                //args.end_date = data.attribute31;
                HczyCommon.stringPropToNum(args);
                args.margin_rate = ((args.price_bill - args.standard_cost_tax)/args.price_bill*100).toFixed(2);
                return args;
            });
    }

    /**
     * 初始化渠道
     */
    function doInitCenter() {
        if($scope.data.currItem.project_id>0){
            BasemanService.RequestPost("proj", "select", JSON.stringify({"project_id": $scope.data.currItem.project_id}))
                .then(function (data1) {
                    //获取渠道
                    BasemanService.RequestPost("scporg", "getsalecenters", {"sale_center":data1.sale_center_id})
                        .then(function (data) {
                            $scope.sale_center = data.salecenters;
                        });
                });
        }
    }

    /**
     * 明细网格点击事件
     * @param e
     * @param args
     */
    function dgLineClick(e, args) {
        activeRow = args.grid.getDataItem(args.row);
        if ($(e.target).hasClass("viewbtn")) {
            $scope.editLine(e, args);
            e.stopImmediatePropagation();

        }
        if ($(e.target).hasClass("delbtn")) {
            $scope.delLineRow(args);
            e.stopImmediatePropagation();
        }
    }

    /**
     * 明细网格双击事件
     */
    function dgLineDblClick(e, args) {
        if ($scope.data.currItem.stat !=5) {
            $scope.editLine(e, args);
        }
    }

    // /**
    //  * 删除明细网格行
    //  */
    // $scope.delLineRow = function (args) {
    //     var item_name = args.grid.getDataItem(args.row).item_name;
    //     BasemanService.swalWarning("删除", "确定要删除产品 " + item_name + " 吗？", function (bool) {
    //         if (bool) {
    //             var dg = $scope.lineGridView;
    //             dg.getData().splice(args.row, 1);
    //             dg.invalidateAllRows();
    //             dg.render();
    //             $scope.setHeadTotal();
    //         } else {
    //             return;
    //         }
    //     })
    // };

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
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

    // /**
    //  * 增加/编辑明细事件
    //  */
    // $scope.addLine = function () {
    //     isEdit = 2;
    //     $scope.data.addCurrItem = {
    //         customer_id:$scope.data.currItem.customer_id,
    //         base_currency_id:1,
    //         is_syscreate:1,
    //         sa_saleprice_type_id:0,
    //         saleprice_type_code:'nvcP02',
    //         contract_price:0,
    //         prj_price:0,
    //         ratio_resources:0,
    //         distribution_price:0
    //     };
    //     if($scope.data.currItem.rebate_type==1){
    //         $scope.data.addCurrItem.start_date = $scope.data.currItem.start_date;
    //         $scope.data.addCurrItem.end_date = $scope.data.currItem.end_date;
    //     }
    //     $scope.searchItem('item_org');
    //
    // };


    /**
     * 增加/编辑明细事件
     */
    $scope.addLine = function () {
        swal({
            title: '请输入要增加的行数',
            type: 'input', //类型为输入框
            inputValue: 1, //输入框默认值
            closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
            showCancelButton: true //显示【取消】按钮
        }, function (inputValue) {
            if (inputValue === false) {
                swal.close();
                return;
            }
            var rowCount = Magic.toNum(inputValue);
            if (rowCount <= 0) {
                swal.showInputError('请输入有效的行数');
                return;
            }
            swal.close();
            var data = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads;

            for (var i = 0; i < rowCount; i++) {
                var newLine = {
                    customer_id:$scope.data.currItem.customer_id,
                    base_currency_id:1,
                    is_syscreate:1,
                    sa_saleprice_type_id:0,
                    saleprice_type_code:'nvcP02',
                    contract_price:0,
                    prj_price:0,
                    contract_qty:0,
                    ratio_resources:0,
                    distribution_price:0
                };
                newLine.start_date = $scope.data.currItem.start_date;
                newLine.end_date = $scope.data.currItem.end_date;

                data.push(newLine);
            }
            $scope.lineOptions.hcApi.setRowData(data);
            $scope.lineOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
        });
    };

    $scope.delLine = function () {
        var selections = $scope.lineOptions.api.getRangeSelections();
        if (selections.length === 1) {
            var oldIndex = selections[0].start.rowIndex;
            var delCount = selections[0].end.rowIndex - oldIndex + 1;
            var field = selections[0].columns[0].colDef.field;
            var data = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads;
            data.splice(oldIndex, delCount);
            $scope.lineOptions.hcApi.setRowData(data);
            if (data.length) {
                var newIndex;
                if (oldIndex < data.length) {
                    newIndex = oldIndex;
                }
                else {
                    newIndex = data.length - 1;
                }
                $scope.lineOptions.hcApi.setFocusedCell(newIndex, field);
            }
        }
        $scope.setHeadTotal();
    };

    var idx = -1;
    $scope.editLine = function (e, args) {
        isEdit = 1;
        idx = args.row;
        $scope.data.addCurrItem = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads[idx];
        $("#addLineModal"+$scope.data.currItem.rebate_type).modal();
        $scope.$apply();
    };


    // /**
    //  * 保存明细到网格中
    //  */
    // $scope.saveAddData = function () {
    //
    //     if($scope.data.addCurrItem.contract_qty%$scope.data.addCurrItem.pack_qty!=0&&$scope.data.addCurrItem.is_round==2){
    //         BasemanService.notice("供货数量必须是包装数量的整数倍","alert-success");
    //         return;
    //     }
    //
    //     if (typeof ($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads) == 'undefined') {
    //         $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads = [];
    //     }
    //     if(isEdit==2){
    //         var isExist = false;
    //         for (var i in $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads) {
    //             if ($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads[i].item_id == $scope.data.addCurrItem.item_id) {
    //                 isExist = true;
    //                 break;
    //             }
    //         }
    //         if (!isExist) {
    //             $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.push($scope.data.addCurrItem);
    //         }else {
    //             BasemanService.notice("该商品已经添加过！", "alert-warning");//warning
    //             return;
    //         }
    //     }
    //     setGridData($scope.lineGridView,$scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
    //     $scope.setHeadTotal();
    //     $("#addLineModal"+$scope.data.currItem.rebate_type).modal("hide");
    //
    // };

    /**
     * 保存数据
     */
    $scope.saveData = function (bsubmit) {
        return $q.when().then(function () {
            $scope.lineOptions.api.stopEditing();
        }).then($scope.checkData).then(function (){
            if ($scope.data.currItem.sa_saleprice_head_id>0) {
                //调用后台保存方法
                BasemanService.RequestPost("sa_saleprice_head", "update", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        BasemanService.swalSuccess("成功", "保存成功！");
                        if (bsubmit) {
                            if (angular.element('#wfinspage').length == 0) {
                                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                            }
                            $scope.initWfIns(true);
                            $('#detailtab a:last').tab('show');
                        }
                    });
            }else{
                BasemanService.RequestPost("sa_saleprice_head", "insert", JSON.stringify($scope.data.currItem))
                    .then(function (data) {
                        BasemanService.swalSuccess("成功", "保存成功！");
                        //添加成功后框不消失直接Select方法查该明细
                        $scope.data.currItem.sa_saleprice_head_id = data.sa_saleprice_head_id;
                        $scope.selectCurrenItem();
                        //如果是保存并提交则提交流程
                        if (bsubmit) {
                            $('#detailtab a:last').tab('show');
                            if (angular.element('#wfinspage').length == 0) {
                                $("#wfinsform").append("<iframe id='wfinspage' style='width: 100%;height: 100%;background-color: #e2e5ec;'></iframe>");
                            }
                            $scope.initWfIns(true);
                        }
                        isEdit = 0;
                    });
            }
        });
    }

    $scope.checkData = function () {
        var lineData = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads;
        var reason = [];
        if(isNaN($scope.data.currItem.apply_rebate)||$scope.data.currItem.apply_rebate<=0&&$scope.data.currItem.rebate_type==2){
            reason.push('申请返利点不能为'+$scope.data.currItem.apply_rebate);
        }
        return $q.when()
            .then(function () {
                $.each(lineData, function (i, line) {
                    var row = i+1;
                    if(!Magic.likeNum(line.item_id)||Number(line.item_id)==0){
                        reason.push('第' + row + '行产品不能为空');
                    }
                });
            })//产品编码不能重复
            .then(function () {
                var itemCodeToRow = {};
                $.each(lineData, function (i, line) {
                    //行号
                    var row = i+1;
                    if (line.item_code) {
                        //重复的行号
                        var sameRow = itemCodeToRow[line.item_code];
                        if (angular.isNumber(sameRow)) {
                            reason.push('第' + row + '行产品【' + line.item_code + '】与第' + sameRow + '行重复');
                        }
                        else {
                            itemCodeToRow[line.item_code] = row;
                        }
                    }
                });
            }).then(function () {
                if (Magic.isNotEmptyArray(reason)) {
                    var msg = reason.length > 9 ? reason.slice(0, 9) : reason;
                    Magic.swalError(msg);
                    return $q.reject(reason);
                }
            });
    }

    /**
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        if ($scope.data.currItem.sa_saleprice_head_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sa_saleprice_head", "select", JSON.stringify({"sa_saleprice_head_id": $scope.data.currItem.sa_saleprice_head_id}))
                .then(function (data) {
                    HczyCommon.stringPropToNum(data);
                    $scope.data.currItem = data;
                }).then(refreshLineData).then(doInitCenter).then($scope.initGrid).then(refreshLineColumn);
        } else {
            $scope.data.currItem = {
                "sa_saleprice_head_id": 0,
                "stat": 1,
                "allow_rebate":0,
                "apply_rebate":0,
                "is_cancellation":1,
                "crm_entid":0,
                "customer_id":0,
                "entorgid":0,
                "rebate_type":1,
                "date_invbill": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "start_date": new Date().Format("yyyy-MM-dd"),
                "end_date": "9999-12-31",
                "is_advance":1,
                "is_sale_promotion_price":2,
                sa_saleprice_lineofsa_saleprice_heads: []
            };
            refreshLineData();
            $scope.initGrid();
            refreshLineColumn();
        }
    };

    $scope.initGrid = function () {
        for(var i=0;i<$scope.lineColumns.length;i++) {
            if ($scope.data.currItem.rebate_type == 1||$scope.data.currItem.rebate_type==0){
                if ($scope.lineColumns[i].id == "contract_price"||
                    $scope.lineColumns[i].id == "contract_amount" ||
                    $scope.lineColumns[i].id == "distribution_price" ||
                    $scope.lineColumns[i].id == "ratio_resources" ||
                    $scope.lineColumns[i].id == "allow_rebate_amt" ) {
                        $scope.lineColumns[i].hide = true;
                }
                if ($scope.lineColumns[i].id == "prj_price" ||
                    $scope.lineColumns[i].id == "prj_total_amt") {
                    $scope.lineColumns[i].hide = false;
                }
            }else if ($scope.data.currItem.rebate_type == 2){
                if ($scope.lineColumns[i].id == "prj_price" ||
                    $scope.lineColumns[i].id == "prj_total_amt") {
                        $scope.lineColumns[i].hide = true;
                }
                if ($scope.lineColumns[i].id == "contract_price"||
                    $scope.lineColumns[i].id == "contract_amount" ||
                    $scope.lineColumns[i].id == "distribution_price" ) {
                    $scope.lineColumns[i].hide = false;
                }
            }
        }
        $scope.lineOptions.api.setColumnDefs($scope.lineColumns);
        // $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns_count, $scope.lineOptions);
        // $scope.lineGridView.onClick.subscribe(dgLineClick);
        // $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);
        // setGridData($scope.lineGridView,$scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
    }


    function refreshLineColumn() {
        return $scope.lineOptions.whenReady.then(function () {
            $scope.lineColumns.forEach(function (colDef) {
                //产品编码、订货数量
                if (['item_code','contract_qty','contract_price','remark',
                        'distribution_price','prj_price'].indexOf(colDef.field) >= 0) {
                    //制单状态的才能编辑
                    colDef.editable = $scope.data.currItem.stat <= 1 || $scope.data.currItem.wfright > 1;
                }
                if (['standard_cost'].indexOf(colDef.field) >= 0) {
                    //特定角色可以修改
                    colDef.editable = $scope.data.cost_accounting;
                }
                if (['ratio_resources','allow_rebate_amt'].indexOf(colDef.field) >= 0) {
                    //制单状态的才能编辑
                    colDef.editable = $scope.data.rebate_audit;
                }
            });

            $scope.lineOptions.api.setColumnDefs($scope.lineColumns);
        });
    }


    $scope.setCostTax = function (line) {
        HczyCommon.stringPropToNum(line);
        line.standard_cost_tax = Number((line.standard_cost * 1.16).toFixed(2));
        line.tax_cost_amt = Number((line.contract_qty * line.standard_cost_tax).toFixed(2));//含税成本=含税价*供货数量

        // 工程特价申请毛利计算：
        // 按差额：（项目运营价-含税成本）/项目运营价 rebate_type=1
        // 按返点：（运营价-含税成本）/运营价 rebate_type=2
        if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0){
            line.margin_rate = Number(((line.prj_price - line.standard_cost_tax)/line.prj_price*100).toFixed(2));
        }else if($scope.data.currItem.rebate_type==2){
            line.margin_rate = Number(((line.price_bill - line.standard_cost_tax)/line.price_bill*100).toFixed(2));
        }else{
            line.margin_rate = 0;
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

                /* if (angular.element('#wfinspage').attr('src') != '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2') {
                    angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins//' + $scope.data.currItem.wfid + '/' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2');
                } */
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        // var tabName = $(e.target).text();
        // if ('审批流程' == tabName) {
        /* var tabName = $(e.target).text();
		if ('流程' == tabName) { */
		if ($(e.target).is('#tab_head_wf')) {
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

        /* if ($scope.data.bSubmit) {
            angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/1?showmode=2');
        } else {
            angular.element('#wfinspage').attr('src', '/index.jsp#/crmman/wfins/' + wftempid + '//' + $scope.data.objtypeid + '/' + $scope.data.currItem.sa_saleprice_head_id + '/0?showmode=2');
        } */
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);


    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if(type == 'item') {
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                }, {
                    name: "产品规格",
                    code: "specs"
                }],
                classid: "item",
                url: "/jsp/req.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "items",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    search_flag: 10
                },
                searchlist: ["item_code", "item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.addCurrItem.item_id = result.item_id;
                $scope.data.addCurrItem.item_code = result.item_code;
                $scope.data.addCurrItem.item_name = result.item_name;
                $scope.data.addCurrItem.uom_name = result.uom_name;
            });
        }else if(type == 'item_org'){
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                },{
                    name: "产品规格",
                    code: "specs"
                },{
                    name: "工厂",
                    code: "factory_code"
                }],
                classid: "item_org",
                url: "/jsp/req.jsp",
                direct: "left",
                sqlBlock: "",
                backdatas: "item_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    searchflag:22,
                    customer_id:$scope.data.currItem.customer_id,
                    attribute1:$scope.data.currItem.customer_code,
                    attribute2:$scope.data.currItem.sale_center//销售渠道 1000-3000
                },
                searchlist: ["i.item_code", "i.item_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.select_item_org(result);
            });
        }else if(type == 'customer'){
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
                sqlBlock: "",
                backdatas: "customer_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag:9
                },
                searchlist: ["customer_code", "customer_name"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.customer_id = result.customer_id;
                $scope.data.currItem.customer_code = result.customer_code;
                $scope.data.currItem.customer_name = result.customer_name;
                //$scope.data.currItem.dept_name = result.orgname;
                // BasemanService.RequestPost("customer_org", "select", JSON.stringify({customer_org_id:result.customer_id}))
                //     .then(function (data) {
                //         if(data.sa_saleprice_type_id>0){
                //
                //             $scope.data.currItem.customer_code = result.customer_code;
                //             $scope.data.currItem.customer_name = result.customer_name;
                //             $scope.data.currItem.customer_id = result.customer_id;
                //
                //             hasCustomerPtype = true;
                //             $scope.data.currItem.sa_saleprice_type_id = data.sa_saleprice_type_id;
                //             $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads=[];
                //             setGridData($scope.lineGridView,[]);
                //         }else{
                //             hasCustomerPtype = false;
                //             //$scope.data.currItem.customer_code = "";
                //             //$scope.data.currItem.customer_name = "";
                //             //$scope.data.currItem.customer_id = 0;
                //             BasemanService.notice("该客户未维护销售价格类型！", "alert-warning");//success
                //         }
                //     });
            })
        }else if(type == 'project'){
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

                //获取渠道
                BasemanService.RequestPost("scporg", "getsalecenters", {"sale_center":result.sale_center_id})
                    .then(function (data) {
                        $scope.sale_center = data.salecenters;
                        $scope.data.currItem.sale_center = $scope.sale_center[0].id;
                        //预付比例
                    }).then($scope.getFundRate);


            })
        }else if(type == 'entorgs'){
            $scope.FrmInfo = {
                title: "销售组织",
                thead: [{
                    name: "编码",
                    code: "entorgcode"
                }, {
                    name: "名称",
                    code: "entorgname"
                }],
                classid: "item_org",
                url: "/jsp/req.jsp",
                direct: "center",
                sqlBlock: "",
                backdatas: "item_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    maxsearchrltcmt: 300,
                    searchflag:23
                },
                searchlist: ["entorgcode", "entorgname"]
            };
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                var factory = '';
                if(result.entorgcode.charAt(0)=='1'){
                    factory = '1000';
                }else{
                    factory = '3000';
                }
                //获取成本
                BasemanService.RequestPost("item_org", "getcost", {attribute1:factory, item_code:$scope.data.addCurrItem.item_code})
                    .then(function (cost) {
                        if(cost.price_ctr=='S'){
                            $scope.data.addCurrItem.standard_cost = (cost.standard_price/cost.price_unit).toFixed(2);
                        } else if(cost.price_ctr=='V'){
                            $scope.data.addCurrItem.standard_cost = (cost.avg_cycle_price/cost.price_unit).toFixed(2);
                        }else{
                            $scope.data.addCurrItem.standard_cost = 0;
                        }
                        $scope.data.addCurrItem.standard_cost_tax = ($scope.data.addCurrItem.standard_cost * 1.16).toFixed(2);

                        //取运营价
                        var postData = {
                            date_invbill:  $scope.data.currItem.date_invbill,
                            customer_id:  $scope.data.currItem.customer_id,
                            item_id: $scope.data.addCurrItem.item_id,
                            flag:3,
                        };
                        postData.attribute21 = result.entorgcode;
                        BasemanService.RequestPost("sa_saleprice_head", "getprice", JSON.stringify(postData))
                            .then(function (data) {
                                $scope.data.addCurrItem.price_bill = data.price_bill_sp;
                                $scope.data.addCurrItem.start_date = data.attribute21;
                                $scope.data.addCurrItem.end_date = data.attribute31;

                                // 工程特价申请毛利计算：
                                // 按差额：（项目运营价-含税成本）/项目运营价 rebate_type=1
                                // 按返点：（运营价-含税成本）/运营价 rebate_type=2
                                if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0){
                                    $scope.data.addCurrItem.margin_rate = Number((($scope.data.addCurrItem.prj_price - $scope.data.addCurrItem.standard_cost_tax)/$scope.data.addCurrItem.prj_price*100).toFixed(2));
                                }else if($scope.data.currItem.rebate_type==2){
                                    $scope.data.addCurrItem.margin_rate = Number((($scope.data.addCurrItem.price_bill - $scope.data.addCurrItem.standard_cost_tax)/$scope.data.addCurrItem.price_bill*100).toFixed(2));
                                }else{
                                    $scope.data.addCurrItem.margin_rate = 0;
                                }



                                //求和
                                $scope.setTotal();

                                $scope.data.addCurrItem.factory_code = factory;
                                $scope.data.addCurrItem.entorgcode = result.entorgcode;
                            });
                    });
            })
        }
    };

    // $scope.showcolumn = function () {
    //     $scope.data.currItem.start_date = ""
    //     $scope.data.currItem.end_date = ""
    //
    //     if ($scope.data.currItem.rebate_type == 1){
    //         $scope.getFundRate();
    //     }else{
    //         $scope.data.currItem.pre_payment_per = "";
    //     }
    //     $scope.lineColumns_count = [];
    //     for(var i=0;i<$scope.lineColumns.length;i++) {
    //         if ($scope.data.currItem.rebate_type == 1){
    //             if ($scope.lineColumns[i].id != "a" &&
    //                 $scope.lineColumns[i].id != "b" &&
    //                 $scope.lineColumns[i].id != "c" &&
    //                 $scope.lineColumns[i].id != "allow_rebate_amt" &&
    //                 $scope.lineColumns[i].id != "ratio_resources") {
    //                 if($scope.lineColumns[i].id == "standard_cost_tax"||$scope.lineColumns[i].id == "tax_cost_amt"||$scope.lineColumns[i].id == "margin_rate"){
    //                     if($scope.data.show){
    //                         $scope.lineColumns_count.push($scope.lineColumns[i]);
    //                     }
    //                 }else{
    //                     $scope.lineColumns_count.push($scope.lineColumns[i]);
    //                 }
    //             }
    //         }else if ($scope.data.currItem.rebate_type == 2){
    //             if ($scope.lineColumns[i].id != "d" &&
    //                 $scope.lineColumns[i].id != "e") {
    //                 if($scope.lineColumns[i].id == "standard_cost_tax"||$scope.lineColumns[i].id == "tax_cost_amt"||$scope.lineColumns[i].id == "margin_rate"){
    //                     if($scope.data.show){
    //                         $scope.lineColumns_count.push($scope.lineColumns[i]);
    //                     }
    //                 }else{
    //                     $scope.lineColumns_count.push($scope.lineColumns[i]);
    //                 }
    //             }
    //         }
    //     }
    //     $scope.lineGridView = new Slick.Grid("#lineViewGrid", [], $scope.lineColumns_count, $scope.lineOptions);
    //     $scope.lineGridView.onClick.subscribe(dgLineClick);
    //     $scope.lineGridView.onDblClick.subscribe(dgLineDblClick);
    //     $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads = [];
    //     $scope.lineGridView.setData($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
    //     $scope.lineGridView.render();
    //
    //     $scope.setHeadTotal();
    // }

    $scope.setTotal = function (line) {
        HczyCommon.stringPropToNum(line);
        line.order_qty = Number((line.contract_qty/line.pack_qty).toFixed());
        line.contract_amount = Number(line.contract_qty * line.contract_price);//工程总量=供货数量*项目合同价
        line.total_amt = Number(line.contract_qty * line.price_bill);//运营价总额=供货数量*运营价
        line.prj_total_amt = Number(line.contract_qty * line.prj_price);//项目运营总额=项目运营价*供货数量
        line.tax_cost_amt = Number((line.contract_qty * line.standard_cost_tax).toFixed(2));//含税成本=含税价*供货数量
        line.allow_rebate_amt = line.total_amt*line.ratio_resources/100;
        // console.log("工程总量："+line.contract_amount);
        // console.log("运营价总额："+line.total_amt);
        // console.log("项目运营总额："+line.prj_total_amt);
        // console.log("含税成本："+line.tax_cost_amt);
        return line;
    }

    $scope.getFundRate = function () {
        if($scope.data.currItem.sale_center=='1210-3010'){//大项目 50%
            $scope.data.currItem.pre_payment_per = 50;
            $scope.canchange = true;
            $scope.data.currItem.rebate_type = 0;
        }else if($scope.data.currItem.sale_center=='1000-3000'){//专业照明 100%
            $scope.data.currItem.pre_payment_per = 100;
            $scope.canchange = false;
            $scope.data.currItem.rebate_type = 2;
        }else if($scope.data.currItem.sale_center=='1230-3030'){//KA 项目登记 预付款 比例
            $scope.canchange = true;
            $scope.data.currItem.rebate_type = 1;
            var postData = {
                project_id:  $scope.data.currItem.project_id
            };
            BasemanService.RequestPost("proj", "getpaymentper", JSON.stringify(postData))
                .then(function (data) {
                    $scope.data.currItem.pre_payment_per = data.fund_rate;
                });
        }else{
            $scope.data.currItem.pre_payment_per = 0;
        }
        $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads = [];
        refreshLineData();
        $scope.setHeadTotal();
        $scope.initGrid();
    }

    $scope.select_item_org = function (result) {

        $scope.data.addCurrItem.item_id = result.item_id;
        $scope.data.addCurrItem.item_code = result.item_code;
        $scope.data.addCurrItem.item_name = result.item_name;
        $scope.data.addCurrItem.pack_uom = result.pack_uom;
        $scope.data.addCurrItem.pack_qty = Number(result.spec_qty);
        $scope.data.addCurrItem.is_round = result.is_round;

        BasemanService.RequestPost("warehouse", "getwarehouse", {customer_id:$scope.data.currItem.customer_id,
            sale_center:$scope.data.currItem.sale_center,item_code:result.item_code})
            .then(function (warehouse) {
                if (warehouse.warehouse_id > 0) {
                    $scope.data.addCurrItem.warehouse_id = warehouse.warehouse_id;
                    $scope.data.addCurrItem.warehouse_code = warehouse.warehouse_code;
                    $scope.data.addCurrItem.warehouse_name = warehouse.warehouse_name;
                    $scope.data.addCurrItem.factory_code = warehouse.factory_code;

                    $scope.data.addCurrItem.standard_cost = 0;
                    //获取成本
                    BasemanService.RequestPost("item_org", "getcost", {attribute1:$scope.data.addCurrItem.factory_code, item_code:result.item_code})
                        .then(function (cost) {
                            if(cost.price_ctr=='S'){
                                $scope.data.addCurrItem.standard_cost = (cost.standard_price/cost.price_unit).toFixed(2);
                            }else if(cost.price_ctr=='V'){
                                $scope.data.addCurrItem.standard_cost = (cost.standard_price/cost.price_unit).toFixed(2);
                            }
                            $scope.data.addCurrItem.standard_cost_tax = ($scope.data.addCurrItem.standard_cost * 1.16).toFixed(2);
                        });

                    var postData = {
                        date_invbill:  $scope.data.currItem.date_invbill,
                        customer_id:  $scope.data.currItem.customer_id,
                        item_id: result.item_id,
                        flag:3,
                    };
                    var entorgs = $scope.data.currItem.sale_center.split("-");
                    $.each(entorgs,function (index,item) {
                        if(item.charAt(0)==$scope.data.addCurrItem.factory_code.charAt(0)){
                            $scope.data.addCurrItem.entorgcode = item;
                            postData.attribute21 = item;
                        }
                    });
                    BasemanService.RequestPost("sa_saleprice_head", "getprice", JSON.stringify(postData))
                        .then(function (data) {
                            $scope.data.addCurrItem.price_bill = data.price_bill_sp;
                            $scope.data.addCurrItem.start_date = data.attribute21;
                            $scope.data.addCurrItem.end_date = data.attribute31;
                            $scope.data.addCurrItem.margin_rate = Number((($scope.data.addCurrItem.price_bill - $scope.data.addCurrItem.standard_cost_tax)/$scope.data.addCurrItem.price_bill*100).toFixed(2));
                        });
                    $("#addLineModal"+$scope.data.currItem.rebate_type).modal();
                }
            });
    }

    $scope.setHeadTotal = function () {
        if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0){
            $scope.data.currItem.apply_rebate = 0;
        }
        $scope.data.currItem.prj_standard_total = 0;//运营总价
        $scope.data.currItem.prj_contract_total = 0;//工程总量 合同价
        $scope.data.currItem.com_gross_profit = 0;// 公司毛利预估
        $scope.data.currItem.dept_gross_profit = 0;// 运营中心毛利预估
        $scope.data.currItem.cust_gross_profit = 0;// 经销商毛利预估

        HczyCommon.stringPropToNum($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);

        $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.forEach(function (value, index) {
            if(value.item_id>0) {
                $scope.data.currItem.prj_standard_total += Number(value.total_amt);
                if (!isNaN(value.contract_amount)) $scope.data.currItem.prj_contract_total += Number(value.contract_amount);
                $scope.data.currItem.com_gross_profit += Number(value.total_amt - value.tax_cost_amt);//运营总价-含税总成本
                if (!isNaN(value.contract_amount)) $scope.data.currItem.dept_gross_profit += Number(value.contract_amount - value.prj_total_amt);
                if (!isNaN(value.contract_amount)) $scope.data.currItem.cust_gross_profit += Number(value.contract_amount - value.distribution_price * value.contract_qty);
            }
        });

        $scope.setHeadRebate();


        $scope.data.currItem.prj_standard_total = Number($scope.data.currItem.prj_standard_total.toFixed(2));
        $scope.data.currItem.prj_contract_total= Number($scope.data.currItem.prj_contract_total.toFixed(2));
        $scope.data.currItem.com_gross_profit = Number($scope.data.currItem.com_gross_profit.toFixed(2));
        $scope.data.currItem.dept_gross_profit = Number($scope.data.currItem.dept_gross_profit.toFixed(2));
        $scope.data.currItem.cust_gross_profit= Number($scope.data.currItem.cust_gross_profit.toFixed(2));

        $scope.data.currItem.com_margin_rate = $scope.data.currItem.prj_standard_total==0?0:($scope.data.currItem.com_gross_profit/$scope.data.currItem.prj_standard_total*100).toFixed(2);
        $scope.data.currItem.dept_margin_rate = $scope.data.currItem.prj_contract_total==0?0:($scope.data.currItem.dept_gross_profit/$scope.data.currItem.prj_contract_total*100).toFixed(2);
        $scope.data.currItem.cust_margin_rate = $scope.data.currItem.prj_contract_total==0?0:($scope.data.currItem.cust_gross_profit/$scope.data.currItem.prj_contract_total*100).toFixed(2);
        // $scope.data.currItem.com_margin_rate =  $scope.data.currItem.com_margin_rate.toFixed(2);
        // $scope.data.currItem.dept_margin_rate =  $scope.data.currItem.dept_margin_rate
        // $scope.data.currItem.cust_margin_rate =   $scope.data.currItem.cust_margin_rate
        $scope.data.currItem.apply_rebate_amt = $scope.data.currItem.prj_standard_total*$scope.data.currItem.apply_rebate/100;
        $scope.$applyAsync();
    }

    $scope.setApplyAmt = function () {
        $scope.data.currItem.apply_rebate_amt = $scope.data.currItem.prj_standard_total*$scope.data.currItem.apply_rebate/100;
    }
    
    $scope.setRebate = function () {
        if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0)return;
        var total = 0;
        HczyCommon.stringPropToNum($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
        $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.forEach(function (value, index) {
           value.allow_rebate_amt = $scope.data.currItem.allow_rebate * value.total_amt/100;
           value.ratio_resources = $scope.data.currItem.allow_rebate;
           total += value.allow_rebate_amt;
        });
        $scope.data.currItem.allow_rebate_amt = total.toFixed(2);
        refreshLineData();
    }

    $scope.setLineRebate = function (line) {
        if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0)return;
        line.allow_rebate_amt = Number((line.ratio_resources * line.total_amt/100).toFixed(2));
    }

    $scope.setLineRebateAmt = function (line) {
        if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0)return;
        line.ratio_resources = Number((line.allow_rebate_amt / line.total_amt*100).toFixed(2));
    }

    $scope.setHeadRebate = function () {
        if($scope.data.currItem.rebate_type==1||$scope.data.currItem.rebate_type==0)return;
        var total_allow = 0;
        var total_amt = 0;//运营价总额
        HczyCommon.stringPropToNum($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads);
        $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.forEach(function (value, index) {
            if(value.item_id>0){
                total_allow += Number(value.allow_rebate_amt);
                total_amt += Number(value.total_amt);
            }
        });
        $scope.data.currItem.allow_rebate_amt = total_allow;
        if(total_allow!=0) {
            $scope.data.currItem.allow_rebate = Number(total_allow/total_amt*100);
        }else{
            $scope.data.currItem.allow_rebate = 0;
        }

        $scope.data.currItem.allow_rebate_amt = $scope.data.currItem.allow_rebate_amt.toFixed(2);
        $scope.data.currItem.allow_rebate = Number($scope.data.currItem.allow_rebate.toFixed(2));
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

    //对外暴露scope
    window.currScope = $scope;
}

//注册控制器
angular.module('inspinia')
    .controller('sa_saleprice_project_bill', sa_saleprice_project_bill);