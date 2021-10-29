function sa_saleprice_special_pro($scope, BaseService, BasemanService, FormValidatorService, $stateParams,Magic,AgGridService,$q) {
    $scope.data = {"objtypeid": 180426, wftemps: [], bSubmit: false};
    $scope.data.currItem = {"objattachs": [], "sa_saleprice_head_id": $stateParams.id};
    $scope.data.addCurrItem = {};
    //设置标题
    $scope.headername = "客户特价申请";
    var activeRow = [];
    var isEdit = 0;
    var hasCustomerPtype = false;
    //获取登录用户数据
    $scope.userbean = window.userbean;
    if($scope.userbean.stringofrole.indexOf("operation_center") != -1 ){
        $scope.data.role = "operation_center";
    }

    $scope.item_cost= false;
    if($scope.userbean.stringofrole.indexOf("item_cost") != -1 ){
        $scope.item_cost = true;
    }

    $scope.data.cost_accounting = false;
    if($scope.userbean.stringofrole.indexOf("cost_accounting") != -1 ){
        $scope.data.cost_accounting = true;
    }

    //作废
    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];



    //词汇表单据状态取值
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "order_sale_center"})
        .then(function (data) {
            $scope.sale_center = data.dicts;
            //HczyCommon.stringPropToNum(data.dicts);
        });


    //词汇表单据状态
    $scope.billStats =[]
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            $scope.billStats = data.dicts;
            HczyCommon.stringPropToNum(data.dicts);
        });


    //明细表网格列属性
    $scope.lineColumns = [
        {
            type: "序号"
        }
        ,{
            name: "价格类型编码",
            id: "saleprice_type_code",
            field: "saleprice_type_code",
            width: 100
        }
        ,{
            name: "价格类型名称",
            id: "saleprice_type_name",
            field: "saleprice_type_name",
            width: 150
        },
        {
            name: "产品编码",
            id: "item_code",
            field: "item_code",
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            width: 150,
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                rqLine(args.newValue).catch(function (reason) {
                    return {
                        item_id: 0,
                        price_bill: 0,
                        standard_cost: 0,
                        standard_cost_tax: 0,
                        margin_rate: 0,
                        margin_amt:0,
                        item_code: '',
                        item_name: reason
                    };
                }).then(function (line) {
                        angular.extend(args.data, line);
                    }).then($scope.setLineMarginRate).then(refreshLineData);
            }
        }, {
            name: "产品名称",
            id: "item_name",
            field: "item_name",
            width: 200
        }, {
            name: "销售组织",
            id: "entorgcode",
            field: "entorgcode",
            width: 70
        },{
            name: "单位",
            id: "uom_name",
            field: "uom_name",
            width: 50,
        },
        {
            name: "申请价格",
            id: "price_bill",
            field: "price_bill",
            width: 70,
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            formatter: Slick.Formatters.Money
            ,type: "金额",
            onCellValueChanged: function (args) {
                if (args.newValue === args.oldValue)
                    return;
                $scope.setMarginRate(args);
                args.api.refreshView();
            }
        }];

    if($scope.item_cost == true||$scope.data.cost_accounting==true){
        $scope.lineColumns.push(
            {
                name: "不含税成本",
                id: "standard_cost",
                field: "standard_cost",
                width: 80,
                editable:true,
                cellStyle: function(args) {
                    return {'background-color':'#FFCC80'};
                },
                formatter: Slick.Formatters.Money,
                type: "金额",
                onCellValueChanged: function (args) {
                    if (args.newValue === args.oldValue)
                        return;
                    $scope.setCostTax(args);
                    args.api.refreshView();
                }
            },{
                name: "含税成本",
                id: "standard_cost_tax",
                field: "standard_cost_tax",
                width: 80,
                formatter: Slick.Formatters.Money,
                type: "金额"
            },
            {
                name: "毛利率(%)",
                id: "margin_rate",
                field: "margin_rate",
                width: 80,
                type:"数量"
            },
            {
                name: "毛利(元)",
                id: "margin_amt",
                field: "margin_amt",
                width: 80,
                type:"金额"
            });
    }
    $scope.lineColumns.push(
        {
            name: "生效日期",
            id: "start_date",
            field: "start_date",
            width: 100,
            editable:true,
            type:"日期",
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            formatter: Slick.Formatters.Date
        }, {
            name: "失效日期",
            id: "end_date",
            field: "end_date",
            width: 100,
            editable:true,
            type:"日期",
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            formatter: Slick.Formatters.Date
        },
        {
            name: " 封顶数量",
            id: "max_qty",
            field: "max_qty",
            editable:true,
            type:"数量",
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            width: 70,
        },
        {
            name: "备注",
            id: "remark",
            field: "remark",
            editable:true,
            cellStyle: function(args) {
                return {'background-color':'#FFCC80'};
            },
            width: 100
        });


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



    function rqLine(itemCode) {
        //【明细】
        var line = {
            item_code:itemCode
        };
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
                console.log(line);

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
                attribute2: $scope.data.currItem.sale_center?$scope.data.currItem.sale_center:$scope.data.currItem.entorgcode,//销售渠道 1000-3000
                sqlwhere: "(i.item_code = '" +  line.item_code + "')"
            })
            .then(function (response) {
                if (response.item_orgs.length) {
                    var result =  response.item_orgs[0];
                    line.item_id = result.item_id;
                    line.item_code = result.item_code;
                    line.item_name = result.item_name;
                    line.uom_name = result.uom_name;
                }
                return line;
            });
    }

    function setLineData(args) {
        if($scope.data.role == 'operation_center'){
            return BasemanService.RequestPost("warehouse", "getfactory", {"item_code":args.item_code})
                .then(function (data1) {
                    if(data1.factory_code.length>0){
                        var entorgs = $scope.data.currItem.sale_center.split("-");
                        $.each(entorgs, function (index, item) {
                            if (item.charAt(0) == data1.factory_code.charAt(0)) {
                                args.entorgcode = item;
                            }
                        });
                        args.factory_code = data1.factory_code;
                        return args;
                    }else{
                        return $q.reject('产品编码【' + args.item_code + '】获取成本失败');
                    }
                }).then(getCost);
        }else{
            //获取成本
            var factory = $scope.data.currItem.entorgcode.substring(0,1)+"000";
            return BasemanService.RequestPost("item_org", "getcost", {attribute1:factory, item_code:args.item_code})
                .then(function (cost) {
                    if(cost.price_ctr=='S'){
                        args.standard_cost = (Number(cost.standard_price)/Number(cost.price_unit)).toFixed(2);
                    }else if(cost.price_ctr=='V'){
                        args.standard_cost = (Number(cost.avg_cycle_price)/Number(cost.price_unit)).toFixed(2);
                    }else{
                        args.standard_cost = 0;
                    }
                    args.standard_cost_tax = (Number(args.standard_cost) * 1.16).toFixed(2);
                    //计算毛利率
                    console.log(args.price_bill);
                    if(Magic.likeNum(args.price_bill)&&Number(args.price_bill)!=0){
                        args.margin_rate = (Number(args.price_bill) - Number(args.standard_cost_tax)/Number(args.price_bill)*100).toFixed(2);
                        args.margin_amt = (Number(args.price_bill) - Number(args.standard_cost_tax)).toFixed(2);
                    }else{
                        args.margin_rate = 0;
                        args.margin_amt = - Number(args.standard_cost_tax);
                    }
                    args.entorgcode = $scope.data.currItem.entorgcode;
                    return args;
                });
        }
    }

    function getCost(args) {
        //获取成本
        return BasemanService.RequestPost("item_org", "getcost", {
            attribute1: args.factory_code,
            item_code: args.item_code
        }).then(function (cost) {
                if (cost.price_ctr == 'S') {
                    args.standard_cost = (Number(cost.standard_price) / Number(cost.price_unit)).toFixed(2);
                } else if (cost.price_ctr == 'V') {
                    args.standard_cost = (Number(cost.avg_cycle_price) / Number(cost.price_unit)).toFixed(2);
                } else {
                    args.standard_cost = 0;
                }
                args.standard_cost_tax = (Number(args.standard_cost) * 1.16).toFixed(2);
                //计算毛利率
                if (Magic.likeNum(args.price_bill) && Number(args.price_bill) != 0) {
                    args.margin_rate = (Number(args.price_bill) - Number(args.standard_cost_tax) / Number(args.price_bill) * 100).toFixed(2);
                    args.margin_amt = (Number(args.price_bill) - Number(args.standard_cost_tax)).toFixed(2);
                } else {
                    args.margin_rate = 0;
                    args.margin_amt = -Number(args.standard_cost_tax);
                }
                return args;
            });
    }
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
                    max_qty:0,
                    is_team:1,
                    price_bill:0,
                    sa_saleprice_type_id:0,
                    saleprice_type_code:'nvcP03',
                    saleprice_type_name:'客户特价',
                    customer_id:$scope.data.currItem.customer_id,
                    start_date:$scope.data.currItem.start_date,
                    end_date:$scope.data.currItem.end_date,
                    base_currency_id:1,
                    is_syscreate:1,
                    entorgname:$scope.data.currItem.entorgname
                };
                data.push(newLine);
            }
            $scope.lineOptions.hcApi.setRowData(data);
            $scope.lineOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
        });
    };

    /**
     * 保存数据
     */
    $scope.saveData = function (bsubmit) {
        if(!FormValidatorService.validatorFrom($scope, "#currItemForm")){
            return;
        }
        if(!$scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads || $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads.length==0){
            BasemanService.swalWarning("提示", "请添加明细！");
            return;
        }
        return $q.when().then(function () {
                $scope.lineOptions.api.stopEditing();
            }).then($scope.checkData).then(function () {
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
                    $scope.data.currItem.is_advance = 1;
                    $scope.data.currItem.is_sale_promotion_price = 2;
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


    /**
     * 刷新明细表格列
     * return {Promise}
     */
    function refreshLineColumn() {
        return $scope.lineOptions.whenReady.then(function () {
            $scope.lineColumns.forEach(function (colDef) {
                //产品编码、订货数量
                if (['item_code','price_bill','start_date','end_date','max_qty','remark'].indexOf(colDef.field) >= 0) {
                    //制单状态的才能编辑
                    colDef.editable = $scope.data.currItem.stat <= 1 || $scope.data.currItem.wfright > 1;
                }
                //成本 特定角色可以修改
                if (['standard_cost'].indexOf(colDef.field) >= 0) {
                    colDef.editable =  userbean.hasRole('cost_accounting', true)&&$scope.data.currItem.stat < 5;
                }
            });

            $scope.lineOptions.api.setColumnDefs($scope.lineColumns);
        });
    }

    $scope.checkData = function () {
        var lineData = $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads;
        var reason = [];
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
                    if (angular.isString(line.item_code) && line.item_code) {
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
            $scope.setLineMarginRate();
        }
    };

    /**
     * 查询详情
     * @param args
     */
    $scope.selectCurrenItem = function () {
        if ($scope.data.currItem.sa_saleprice_head_id > 0) {
            //调用后台select方法查询详情
            BasemanService.RequestPost("sa_saleprice_head", "select", JSON.stringify({"sa_saleprice_head_id": $scope.data.currItem.sa_saleprice_head_id}))
                .then(function (data) {
                    $scope.data.currItem = data;
                }).then(refreshLineColumn).then(refreshLineData);
        } else {
            $scope.data.currItem = {
                "sa_saleprice_head_id": 0,
                "stat": 1,
                "is_cancellation":1,
                "com_margin_rate":0,
                "crm_entid":0,
                "entorgid":0,
                "date_invbill": new Date().Format("yyyy-MM-dd hh:mm:ss"),
                "start_date": new Date().Format("yyyy-MM-dd"),
                "end_date": new Date().Format("9999-12-31"),
                sa_saleprice_lineofsa_saleprice_heads: []
            };
            refreshLineData();
        }
    };


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
            } else if ($scope.data.currItem.stat == 1) {
                $scope.data.bSubmit = bSubmit;
                $scope.getWfTempId($scope.data.objtypeid);
            }
        }
    }

    $scope.onTabChange = function (e) {
        // 获取已激活的标签页的名称
        var tabId = e.target.id;
        if ('towfins' == tabId) {
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
        $scope.data.bSubmit = false;
    }

    //modal显示时绑定切换事件
    $('#detailtab').on('shown.bs.tab', $scope.onTabChange);


    $scope.setMarginRate = function (args) {
        if(!Magic.likeNum(args.data.standard_cost_tax)){
            args.data.standard_cost_tax = 0;
        }
        args.data.margin_rate = ((Number(args.newValue) - Number(args.data.standard_cost_tax))/Number(args.newValue)*100).toFixed(2);
        args.data.margin_amt = (Number(args.newValue) - Number(args.data.standard_cost_tax)).toFixed(2);
        //统计表头毛利率
        $scope.setLineMarginRate();
    }

    $scope.setLineMarginRate = function () {
        var t_cost = 0;
        var t_price = 0;
        $.each($scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads, function (i, line) {
            if(!Magic.likeNum(line.standard_cost_tax)||Number(line.standard_cost_tax)==0){
                line.standard_cost_tax = 0;
            }
            if(!Magic.likeNum(line.price_bill)||Number(line.price_bill)==0){
                line.price_bill = 0;
            }
            t_cost += Number(line.standard_cost_tax);
            t_price += Number(line.price_bill);
        });
        if(t_price==0){
            $scope.data.currItem.com_margin_rate = 0;
        }else{
            $scope.data.currItem.com_margin_rate = Number(((t_price-t_cost)/t_price*100).toFixed(2));
        }
        $scope.$applyAsync();
    }


    $scope.setCostTax = function (args) {
        if(!Magic.isStrOfNum(args.newValue)){
            args.newValue = 0;
        }
        args.data.standard_cost_tax = (Number(args.newValue) * 1.16).toFixed(2);
        //计算毛利率
        if(Magic.isStrOfNum(args.data.price_bill)&&Number(args.data.price_bill)!=0){
            args.data.margin_rate = ((Number(args.data.price_bill) - Number(args.data.standard_cost_tax))/Number(args.data.price_bill)*100).toFixed(2);
            args.data.margin_amt = (Number(args.data.price_bill) - Number(args.data.standard_cost_tax)).toFixed(2);
        }else{
            args.data.margin_rate = 0;
            args.data.margin_amt = - args.data.standard_cost_tax;
        }

        //统计表头毛利率
        $scope.setLineMarginRate();
    }

    /**
     * 通用查询
     */
    $scope.searchItem = function (type) {
        if(type == 'item_org'){
            $scope.FrmInfo = {
                title: "产品查询",
                thead: [{
                    name: "产品编码",
                    code: "item_code"
                }, {
                    name: "产品名称",
                    code: "item_name"
                }, {
                    name: "工厂",
                    code: "factory_code"
                }, {
                    name: "工厂名称",
                    code: "factory_name"
                }],
                classid: "item_org",
                url: "/jsp/req.jsp",
                direct: "center",
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
            if($scope.data.role != 'operation_center'){
                $scope.FrmInfo.postdata.attribute2 = $scope.data.currItem.entorgcode
            }
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {

                if($scope.data.role == 'operation_center'){
                    BasemanService.RequestPost("warehouse", "getfactory", {"item_code":result.item_code})
                        .then(function (data) {
                            var entorgs = $scope.data.currItem.sale_center.split("-");
                            $.each(entorgs,function (index,item) {
                                if(item.charAt(0)==data.factory_code.charAt(0)){
                                    $scope.data.addCurrItem.entorgcode = item;
                                }
                            });

                            //获取成本
                            BasemanService.RequestPost("item_org", "getcost", {attribute1:data.factory_code, item_code:result.item_code})
                                .then(function (cost) {
                                    if(cost.price_ctr=='S'){
                                        $scope.data.addCurrItem.standard_cost = Number((cost.standard_price/cost.price_unit).toFixed(2));
                                    }else if(cost.price_ctr=='V'){
                                        $scope.data.addCurrItem.standard_cost = Number((cost.avg_cycle_price/cost.price_unit).toFixed(2));
                                    }else{
                                        $scope.data.addCurrItem.standard_cost = 0;
                                    }
                                    $scope.data.addCurrItem.standard_cost_tax = Number(($scope.data.addCurrItem.standard_cost * 1.16).toFixed(2));
                                    //计算毛利率
                                    $scope.setMarginRate();
                                });
                        });
                }else{
                    //获取成本
                    var factory = $scope.data.currItem.entorgcode.substring(0,1)+"000";
                    BasemanService.RequestPost("item_org", "getcost", {attribute1:factory, item_code:result.item_code})
                        .then(function (cost) {
                            if(cost.price_ctr=='S'){
                                $scope.data.addCurrItem.standard_cost = Number((cost.standard_price/cost.price_unit).toFixed(2));
                            }else if(cost.price_ctr=='V'){
                                $scope.data.addCurrItem.standard_cost = Number((cost.avg_cycle_price/cost.price_unit).toFixed(2));
                            }
                            $scope.data.addCurrItem.standard_cost_tax = Number(($scope.data.addCurrItem.standard_cost * 1.16).toFixed(2));
                            //计算毛利率
                            $scope.setMarginRate();
                        });
                }

                $scope.data.addCurrItem.item_id = result.item_id;
                $scope.data.addCurrItem.item_code = result.item_code;
                $scope.data.addCurrItem.item_name = result.item_name;
                $scope.data.addCurrItem.uom_name = result.uom_name;
                $scope.data.addCurrItem.max_qty = "";
                $scope.data.addCurrItem.is_team = 1;
                $scope.data.addCurrItem.sa_saleprice_type_id = 0;
                $scope.data.addCurrItem.saleprice_type_code = 'nvcP03';
                $scope.data.addCurrItem.saleprice_type_name = '客户特价';
                $("#addLineModal").modal();
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
                direct: "center",
                sqlBlock: "",
                backdatas: "customer_orgs",
                ignorecase: "true", //忽略大小写
                postdata: {
                    search_flag:10
                },
                searchlist: ["customer_code", "customer_name"]
            };
            if($scope.data.role == 'operation_center'){
                $scope.FrmInfo.postdata = {};
                $scope.FrmInfo.postdata.search_flag = 9;
            }
            BasemanService.open(CommonPopController, $scope).result.then(function (result) {
                $scope.data.currItem.customer_code = result.customer_code;
                $scope.data.currItem.customer_name = result.customer_name;
                $scope.data.currItem.customer_id = result.customer_id;
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
                $scope.data.currItem.entorgcode = result.entorgcode;
                $scope.data.currItem.entorgname = result.entorgname;
            })
        }
    };

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

    /**
     *  重置数据
     */
    $scope.reset = function (type) {
        if(type=="sale_center"){
            $scope.data.currItem.sa_saleprice_lineofsa_saleprice_heads=[];
            refreshLineData();
        }
    }


    //解决进度动画不消失的问题
    IncRequestCount();
    DecRequestCount();

    //对外暴露scope
    window.currScope = $scope;
}

//注册控制器
angular.module('inspinia')
    .controller('sa_saleprice_special_pro', sa_saleprice_special_pro);