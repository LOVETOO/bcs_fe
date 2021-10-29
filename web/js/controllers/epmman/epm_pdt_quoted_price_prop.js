/**
 * 工程项目报价
 * 2019/6/19
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', '$q', 'numberApi', '$modal', 'Decimal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, $q, numberApi, $modal, Decimal) {

        var EpmPdtQuotedPriceProp = [
            '$scope',

            function ($scope) {
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                function editables(args) {
                    return !args.node.rowPinned;
                }

                /**
                 * 是否是不编辑状态
                 */
                function isReadonly(){
                    return $scope.hcSuper.isFormReadonly();
                }

                //定义默认税率
                $scope.data.tax_rate = 0;

                //定义价格参数
                $scope.data.price_param = 0;
                /*----------------------------------表格定义-------------------------------------------*/
                //表格定义  "工程项目报价"
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    hcRequired : true,
                    hcName: '报价信息',
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '产品编码',
                        hcRequired:true,
                        editable: function (args) {
                            return editables(args);
                        },
                        onCellDoubleClicked: function (args) {
                            if(isReadonly()){
                                return;
                            }
                            $scope.chooseItem(args);
                        },
                        onCellValueChanged: function (args) {
                            if(args.newValue == ""||args.newValue==undefined||args.newValue==null){
                                args.data.item_id = 0;
                                return;
                            }
                            if (args.newValue === args.oldValue)
                                return;
                            //获取产品
                            getItem(args.newValue,args)
                                .then(function () {
                                    if(args.data.item_id>0){
                                        var arr = [];
                                        arr.push(requestApi.post({
                                            classId: "epm_pdt_quoted_price",
                                            action: 'search',
                                            data: {
                                                project_id : $scope.data.currItem.project_id,
                                                item_id : args.data.item_id,
                                                search_flag : 1
                                            }
                                        }).then(function (data) {
                                            if(data.epm_pdt_quoted_prices.length == 0){
                                                args.data.quoted_rev = 1;
                                            }else{
                                                args.data.quoted_rev = numberApi.sum(data.epm_pdt_quoted_prices[0].quoted_rev,1);
                                                args.data.quoted_price_old = data.epm_pdt_quoted_prices[0].quoted_price;
                                            }
                                        }));
                                        arr.push(requestApi.post({
                                            classId: "epm_pdt_quoted_price",
                                            action: 'search',
                                            data: {
                                                item_id : args.data.item_id,
                                                search_flag : 2
                                            }
                                        }).then(function (data) {
                                            if(data.epm_pdt_quoted_prices[0].market_price==null||data.epm_pdt_quoted_prices[0].market_price==undefined||data.epm_pdt_quoted_prices[0].market_price==0||data.epm_pdt_quoted_prices[0].market_price==""){
                                                swalApi.info('产品编码【'+args.data.item_code+'】的产品尚未维护价格，请重新选择!');
                                                args.data.item_name = '产品编码【'+args.data.item_code+'】的产品尚未维护价格，请重新选择!';
                                                args.data.item_code = undefined;
                                                args.data.item_class3_name = undefined;
                                                args.data.item_id = undefined;
                                                args.data.model = undefined;//型号
                                                args.data.pdt_docid = undefined;//产品图片
                                                args.data.spec = undefined;//规格
                                                args.data.color = undefined;//颜色
                                                args.data.dimension_docid = undefined;//尺寸图
                                                args.data.market_price = undefined;//市场零售价
                                            }else if(data.epm_pdt_quoted_prices.length == 1){
                                                args.data.market_price = data.epm_pdt_quoted_prices[0].market_price;
                                            }else if(data.epm_pdt_quoted_prices.length > 1){//多条数据,需要选择
                                                return $modal.openCommonSearch({
                                                    classId:'epm_pdt_quoted_price',
                                                    postData : {
                                                        item_id : args.data.item_id,
                                                        search_flag : 2
                                                    },
                                                    dataRelationName:'epm_pdt_quoted_prices',
                                                    title : '市场零售价价格选取',
                                                    gridOptions:{
                                                        columnDefs:[
                                                            {
                                                                headerName: "价格",
                                                                field: "market_price"
                                                            }
                                                        ]
                                                    }
                                                })
                                                    .result//响应数据
                                                    .then(function(result){
                                                        args.data.market_price = result.market_price;
                                                    });
                                            }
                                        }));
                                        return $q.all(arr);
                                    }
                                })
                                .then(function () {
                                    $scope.gridOptions.api.refreshCells({
                                        rowNodes: [args.node],
                                        columns: $scope.gridOptions.columnApi.getColumns(['item_code', 'item_class3_name'
                                            ,'item_name','model','pdt_docname','spec','color','dimension_docname','market_price','quoted_rev','quoted_price_old'])
                                    });
                                });
                        }
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'model',
                        headerName: '型号',
                        editable: function (args) {
                            return editables(args);
                        },
                        onCellDoubleClicked: function (args) {
                            if(isReadonly()){
                                return;
                            }
                            $scope.chooseItem(args);
                        },
                        onCellValueChanged: function (args) {
                            if(args.newValue == ""||args.newValue==undefined||args.newValue==null){
                                args.data.item_id = 0;
                                args.item_code = "";
                                return;
                            }
                            if (args.newValue === args.oldValue)
                                return;
                            //获取产品
                            getModelItem(args.newValue,args)
                                .then(function () {
                                    if(args.data.item_id>0){
                                        var arr = [];
                                        arr.push(requestApi.post({
                                            classId: "epm_pdt_quoted_price",
                                            action: 'search',
                                            data: {
                                                project_id : $scope.data.currItem.project_id,
                                                item_id : args.data.item_id,
                                                search_flag : 1
                                            }
                                        }).then(function (data) {
                                            if(data.epm_pdt_quoted_prices.length == 0){
                                                args.data.quoted_rev = 1;
                                            }else{
                                                args.data.quoted_rev = numberApi.sum(data.epm_pdt_quoted_prices[0].quoted_rev,1);
                                                args.data.quoted_price_old = data.epm_pdt_quoted_prices[0].quoted_price;
                                            }
                                        }));
                                        arr.push(requestApi.post({
                                            classId: "epm_pdt_quoted_price",
                                            action: 'search',
                                            data: {
                                                item_id : args.data.item_id,
                                                search_flag : 2
                                            }
                                        }).then(function (data) {
                                            if(data.epm_pdt_quoted_prices[0].market_price==null||data.epm_pdt_quoted_prices[0].market_price==undefined||data.epm_pdt_quoted_prices[0].market_price==0||data.epm_pdt_quoted_prices[0].market_price==""){
                                                swalApi.info('产品编码【'+args.data.item_code+'】的产品尚未维护价格，请重新选择!');
                                                args.data.item_name = '产品编码【'+args.data.item_code+'】的产品尚未维护价格，请重新选择!';
                                                args.data.item_code = undefined;
                                                args.data.item_class3_name = undefined;
                                                args.data.item_id = undefined;
                                                args.data.model = undefined;//型号
                                                args.data.pdt_docid = undefined;//产品图片
                                                args.data.spec = undefined;//规格
                                                args.data.color = undefined;//颜色
                                                args.data.dimension_docid = undefined;//尺寸图
                                                args.data.market_price = undefined;//市场零售价
                                            }else if(data.epm_pdt_quoted_prices.length == 1){
                                                args.data.market_price = data.epm_pdt_quoted_prices[0].market_price;
                                            }else if(data.epm_pdt_quoted_prices.length > 1){//多条数据,需要选择
                                                return $modal.openCommonSearch({
                                                    classId:'epm_pdt_quoted_price',
                                                    postData : {
                                                        item_id : args.data.item_id,
                                                        search_flag : 2
                                                    },
                                                    dataRelationName:'epm_pdt_quoted_prices',
                                                    title : '市场零售价价格选取',
                                                    gridOptions:{
                                                        columnDefs:[
                                                            {
                                                                headerName: "价格",
                                                                field: "market_price"
                                                            }
                                                        ]
                                                    }
                                                })
                                                    .result//响应数据
                                                    .then(function(result){
                                                        args.data.market_price = result.market_price;
                                                    });
                                            }
                                        }));
                                        return $q.all(arr);
                                    }
                                })
                                .then(function () {
                                    $scope.gridOptions.api.refreshCells({
                                        rowNodes: [args.node],
                                        columns: $scope.gridOptions.columnApi.getColumns(['item_code', 'item_class3_name'
                                            ,'item_name','model','pdt_docname','spec','color','dimension_docname','market_price','quoted_rev','quoted_price_old'])
                                    });
                                });
                        }
                    }, {
                        field: 'brand',
                        headerName: '品牌',
                        editable: function (args) {
                            return editables(args);
                        },
                        hcDictCode : 'epm.quoted.brand'
                    }, {
                        field: 'orgin',
                        headerName: '产地',
                        editable: function (args) {
                            return editables(args);
                        },
                        hcDictCode : 'epm.quoted.orgin'
                    }, {
                        field: 'item_class3_name',
                        headerName: '产品小类',
                        editable: function (args) {
                            return editables(args);
                        }
                    }, {
                        hcImgIdField: 'pdt_docid',
                        field: 'pdt_docname',
                        headerName: '产品图片'
                    }, {
                        field: 'spec',
                        headerName: '说明/规格(mm)'
                    }, {
                        field: 'color',
                        headerName: '颜色'
                    }, {
                        field: 'market_price',
                        headerName: '市场零售价',
                        type:'金额',
                        hide : true,
                        valueFormatter: function (params) {
                            return numberApi.mutiply(params.value, $scope.data.price_param);
                        }
                    }, {
                        field: 'discount_rate',
                        headerName: '折扣率',
                        hcRequired:true,
                        editable: function (args) {
                            return editables(args);
                        },
                        type:'金额',
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }if(args.data.market_price == null
                                || args.data.market_price == undefined
                                || args.data.market_price == ""){
                                args.data.discount_rate = undefined;
                                swalApi.error("请先选择产品");
                                return;
                            }
                            sumPrice(args);
                            sumAmt(args);
                        },
                        hide : true
                    }, {
                        field: 'quoted_price',
                        headerName: '单价/元',
                        type : '金额',
                        hcRequired:true,
                        editable: function (args) {
                            return editables(args);
                        },
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }if(args.data.market_price == null
                                || args.data.market_price == undefined
                                || args.data.market_price == ""){
                                args.data.quoted_price = undefined;
                                swalApi.error("请先选择产品");
                                return;
                            }
                            sumRate(args);
                            sumAmt(args);
                        },
                        hide : false
                    }, {
                        field: 'quoted_price',
                        headerName: '含税单价',
                        type : '金额',
                        hcRequired:true,
                        editable: function (args) {
                            return editables(args);
                        },
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }if(args.data.market_price == null
                                || args.data.market_price == undefined
                                || args.data.market_price == ""){
                                args.data.quoted_price = undefined;
                                swalApi.error("请先选择产品");
                                return;
                            }
                            sumRate(args);
                            sumAmt(args);
                        },
                        hide : true
                    }, {
                        field: 'tax_rate',
                        headerName: '税率',
                        type : '百分比',
                        hide : true
                    }, {
                        field: 'no_tax_contract_price',
                        headerName: '不含税单价',
                        type : '金额',
                        hide : true
                    }, {
                        field: 'qty',
                        headerName: '数量',
                        type : '数量',
                        hide : true,
                        editable: function (args) {
                            return editables(args);
                        },
                        hcRequired:true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }if(args.data.quoted_price == null
                                || args.data.quoted_price == undefined
                                || args.data.quoted_price == ""){
                                args.data.qty = undefined;
                                swalApi.error("请先计算出单价产品");
                                return;
                            }
                            sumAmt(args);
                        }
                    }, {
                        field: 'quoted_amt',
                        headerName: '金额',
                        type : '金额',
                        hide : true
                    }, {
                        field: 'quoted_price_old',
                        headerName: '上一次报价',
                        type:'金额'
                    }, {
                        field: 'remark',
                        headerName: '备注',
                        editable: function (args) {
                            return editables(args);
                        }
                    }, {
                        hcImgIdField: 'dimension_docid',
                        field: 'dimension_docname',
                        headerName: '尺寸图'
                    }, {
                        field: 'quoted_rev',
                        headerName: '产品报价次数',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }]
                };
                /*----------------------------------计算方法-------------------------------------------*/
                function selectTaxRate () {
                    requestApi
                        .post({
                            classId: 'epm_project_contract',
                            action: 'taxrate'
                        })
                        .then(function (data) {
                            $scope.data.tax_rate = data.tax_rate;
                        });
                }

                /**
                 * 修改是否含税
                 */
                /*$scope.whetherTheTax = function(){
                    if($scope.data.currItem.tax_included == 1){//不含税
                        $scope.data.currItem.quoted_type = 2;
                    }else if($scope.data.currItem.tax_included == 2){//含税
                        $scope.data.currItem.quoted_type = 1;
                    }else{
                        $scope.data.currItem.quoted_type = undefined;
                    }
                };*/

                /**
                 * 修改报价类型
                 */
                $scope.whetherQuotedType = function () {
                    if($scope.data.currItem.quoted_type == 2){//战略工程
                        $scope.data.currItem.tax_included = 2;
                        //常规字段
                        $scope.gridOptions.columnDefs[12].hide = true;
                        //战略字段
                        $scope.gridOptions.columnDefs[13].hide = false;
                        $scope.gridOptions.columnDefs[14].hide = false;
                        $scope.gridOptions.columnDefs[15].hide = false;
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }else if($scope.data.currItem.quoted_type == 1){//常规工程
                        //常规字段
                        $scope.gridOptions.columnDefs[12].hide = false;
                        //战略字段
                        $scope.gridOptions.columnDefs[13].hide = true;
                        $scope.gridOptions.columnDefs[14].hide = true;
                        $scope.gridOptions.columnDefs[15].hide = true;
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }
                };

                /**
                 *  合计
                 */
                $scope.calSum = function () {
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty: numberApi.sum($scope.data.currItem.epm_pdt_quoted_price_lines, 'qty'),
                            quoted_amt: numberApi.sum($scope.data.currItem.epm_pdt_quoted_price_lines, 'quoted_amt')

                        }
                    ]);
                };

                /**
                 * 显示数量方法
                 */
                $scope.displayUntil = function () {
                    if($scope.data.currItem.show_number == 2){//勾选，不显示数量
                        $scope.gridOptions.columnDefs[10].hide = true;
                        $scope.gridOptions.columnDefs[11].hide = true;
                        $scope.gridOptions.columnDefs[16].hide = true;
                        $scope.gridOptions.columnDefs[17].hide = true;
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }else if($scope.data.currItem.show_number == 1) {//没有勾选，显示数量
                        $scope.gridOptions.columnDefs[10].hide = false;
                        $scope.gridOptions.columnDefs[11].hide = false;
                        $scope.gridOptions.columnDefs[16].hide = false;
                        $scope.gridOptions.columnDefs[17].hide = false;
                        $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                    }
                };

                /**
                 * 计算金额
                 */
                function sumAmt(args){
                    if(args.data.quoted_price!=null
                        &&args.data.quoted_price!=undefined
                        &&args.data.quoted_price!=""
                        &&args.data.qty!=null
                        &&args.data.qty!=undefined
                        &&args.data.qty!=""){
                        if(!numberApi.isNum(Number(args.data.qty))){
                            swalApi.info('折扣率输入不是数字，请重新输入!');
                            args.data.qty = undefined;
                            args.data.quoted_price = undefined;
                        }else if(Number(args.data.qty)<=0){
                            swalApi.info('数量应输入大于零的数字!');
                            args.data.qty = undefined;
                            args.data.quoted_price = undefined;
                        }else{
                            args.data.quoted_amt=numberApi.mutiply(args.data.qty,args.data.quoted_price);
                        }
                        $scope.calSum();
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['qty'
                                ,'quoted_amt'])
                        });
                    }
                }

                /**
                 * 计算折扣率
                 */
                function sumRate(args){
                    //计算折扣率
                    if(args.data.quoted_price!=null
                        &&args.data.quoted_price!=undefined
                        &&args.data.quoted_price!=""
                        &&args.data.market_price!=null
                        &&args.data.market_price!=undefined
                        &&args.data.market_price!=""){
                        if(!numberApi.isNum(Number(args.data.quoted_price))){
                            swalApi.info('折扣率输入不是数字，请重新输入!');
                            args.data.quoted_price = undefined;
                            args.data.discount_rate = undefined;
                        }else if(Number(args.data.quoted_price)<=0){
                            if($scope.data.currItem.quoted_type == 2){//战略
                                swalApi.info('含税单价应输入大于零的数字!');
                            }else{
                                swalApi.info('单价应输入大于零的数字!');
                            }
                            args.data.quoted_price = undefined;
                            args.data.discount_rate = undefined;
                        }else{
                            args.data.quoted_price = Decimal(args.data.quoted_price).toFixed(0);
                            args.data.no_tax_contract_price = numberApi.divide(args.data.quoted_price,numberApi.sub(1, args.data.tax_rate));
                            args.data.discount_rate=numberApi.divide(args.data.quoted_price, args.data.market_price);
                        }
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['quoted_price'
                                ,'discount_rate'])
                        });
                    }
                }

                /**
                 * 计算单价
                 */
                function sumPrice(args){
                    if(args.data.discount_rate!=null
                        &&args.data.discount_rate!=undefined
                        &&args.data.discount_rate!=""
                        &&args.data.market_price!=null
                        &&args.data.market_price!=undefined
                        &&args.data.market_price!=""){
                        if(!numberApi.isNum(Number(args.data.discount_rate))){
                            swalApi.info('折扣率输入不是数字，请重新输入!');
                            args.data.discount_rate = undefined;
                        }else if(Number(args.data.discount_rate)<=0||Number(args.data.discount_rate)>1){
                            swalApi.info('折扣率应输入大于零并且小于等于1的数字!');
                            args.data.discount_rate = undefined;
                        }else{
                            args.data.quoted_price=numberApi.mutiply(args.data.market_price,args.data.discount_rate);
                            args.data.quoted_price = Decimal(args.data.quoted_price).toFixed(0);
                            args.data.no_tax_contract_price = numberApi.divide(args.data.quoted_price,numberApi.sub(1, args.data.tax_rate));
                        }
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['quoted_price'
                                ,'discount_rate'])
                        });
                    }
                }

                /**
                 * 复制网格数据方法
                 */
                function getItem(code,args) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere : "item_code = '"+code+"'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if(data.item_orgs.length>0){
                                var a = 1;
                                args.data.item_code = undefined;
                                $scope.data.currItem.epm_pdt_quoted_price_lines.forEach(function (val) {
                                    if(val.item_code == data.item_orgs[0].item_code){
                                        swalApi.info('不能选择重复产品，请重新选择!');
                                        a = 0;
                                    }
                                });
                                if(a==1){
                                    args.data.item_id = data.item_orgs[0].item_id;
                                    args.data.item_code = data.item_orgs[0].item_code;
                                    args.data.item_class3_name = data.item_orgs[0].item_class3_name;
                                    args.data.item_name = data.item_orgs[0].item_name;
                                    args.data.model = data.item_orgs[0].item_model;//型号
                                    args.data.pdt_docid = data.item_orgs[0].docid1;//产品图片
                                    args.data.spec = data.item_orgs[0].specs;//规格
                                    args.data.color = data.item_orgs[0].item_color;//颜色
                                    args.data.dimension_docid = data.item_orgs[0].docid3;//尺寸图
                                }
                            }else{
                                swalApi.info("产品编码【"+code+"】不可用");
                            }
                        });
                }

                /**
                 * 复制网格型号数据方法
                 */
                function getModelItem(code,args) {
                    var postData = {
                        classId: "item_org",
                        action: 'search',
                        data: {sqlwhere : "item_model = '"+code+"'"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if(data.item_orgs.length>0){
                                var a = 1;
                                $scope.data.currItem.epm_pdt_quoted_price_lines.forEach(function (val) {
                                    if(val.item_code == data.item_orgs[0].item_code){
                                        swalApi.info('不能选择重复产品，请重新选择!');
                                        args.data.item_code = "";
                                        args.data.item_id = 0;
                                        a = 0;
                                    }
                                });
                                if(a==1){
                                    args.data.item_id = data.item_orgs[0].item_id;
                                    args.data.item_code = data.item_orgs[0].item_code;
                                    args.data.item_class3_name = data.item_orgs[0].item_class3_name;
                                    args.data.item_name = data.item_orgs[0].item_name;
                                    args.data.model = data.item_orgs[0].item_model;//型号
                                    args.data.pdt_docid = data.item_orgs[0].docid1;//产品图片
                                    args.data.spec = data.item_orgs[0].specs;//规格
                                    args.data.color = data.item_orgs[0].item_color;//颜色
                                    args.data.dimension_docid = data.item_orgs[0].docid3;//尺寸图
                                }
                            }else{
                                swalApi.info("产品型号【"+code+"】不可用");
                            }
                        });
                }
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 报价单位查询
                 */
                $scope.commonSearchOfTrading = {
                    title:'报价单位',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "报价单位编码",
                                field: "trading_company_code"
                            },{
                                headerName: "报价单位名称",
                                field: "trading_company_name"
                            }
                        ]
                    },
                    postData : {
                        /** 3-交易公司通用查询，过滤不可用 */
                        search_flag : 3
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.trading_company_id = result.trading_company_id;
                        $scope.data.currItem.trading_company_name = result.trading_company_name;
                    }
                };

                //报价人查询
                $scope.commonSearchOfScpuser = {
                    sqlWhere:'actived = 2 ',
                    afterOk: function (result) {
                        $scope.data.currItem.quoted_person = result.username;
                    }
                };

                //工程项目 查询
                $scope.commonSearchOfpmEProject = {
                    sqlWhere:'stat = 5 ',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "项目编号",
                                field: "project_code"
                            },{
                                headerName: "项目名称",
                                field: "project_name"
                            },{
                                headerName: "报备类型",
                                field: "report_type",
                                hcDictCode: 'epm.report_type'
                            },{
                                headerName: "项目阶段",
                                field: "stage_name"
                            },{
                                headerName: "项目状态",
                                field: "stat",
                                hcDictCode: 'stat'
                            }
                        ]
                    },
                    afterOk: function (result) {
                        var arr = [];
                        var a = 1;
                        arr.push(requestApi.post({
                            classId: "epm_pdt_quoted_price",
                            action: 'search',
                            data: {
                                sqlwhere : "project_id = "+result.project_id + "and  stat <> 5"
                            }
                        }).then(function (data) {
                            if(data.epm_pdt_quoted_prices.length>0){
                                swalApi.info('该项目存在未审核完毕的报价单【'+data.epm_pdt_quoted_prices[0].project_code+'】，请检查。');
                                a=0;
                            }
                        }));

                        $q.all(arr).then(function () {
                            if(a==1){
                                $scope.data.currItem.project_id = result.project_id;
                                $scope.data.currItem.project_code = result.project_code;
                                $scope.data.currItem.project_name = result.project_name;
                                $scope.data.currItem.trading_company_name = result.trading_company_name;
                                return requestApi.post({
                                    classId: "epm_pdt_quoted_price",
                                    action: 'search',
                                    data: {
                                        sqlwhere : "project_id = "+result.project_id
                                    }
                                }).then(function (data) {
                                    $scope.data.currItem.quoted_times = numberApi.sum(data.epm_pdt_quoted_prices.length,1)
                                })
                            }
                        });
                    }
                };
                /**
                 * 产品查询查询
                 */
                $scope.chooseItem = function (args) {
                    if(args.node.rowPinned){
                        return;
                    }
                    $scope.gridOptions.api.stopEditing();
                    // if($scope.data.currItem.project_code==undefined||$scope.data.currItem.project_code==null||$scope.data.currItem.project_code==""){
                    //     swalApi.info('请先选择工程项目');
                    //     return;
                    // }
                    return $modal.openCommonSearch({
                        classId:'item_org',
                        postData: {
							need_price: 2									//需要价格
						},
                        checkbox: true,
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "淘汰品",
                                    field: "is_eliminate",
                                    hcDictCode : 'is_bid_win',
                                    cellStyle:function (args) {
                                        return {
                                            'color':args.data.is_eliminate == 2 ? "red" : "",
                                            'text-align': 'center'}
                                    }
                                },{
                                    headerName: "产品编码",
                                    field: "item_code"
                                },{
                                    headerName: "型号",
                                    field: "item_model"
                                },{
                                    headerName: "产品名称",
                                    field: "item_name"
                                },{
                                    headerName: "计量单位",
                                    field: "uom_name"
                                },{
                                    headerName: "规格",
                                    field: "specs"
                                }
                            ]
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            var arr = [];
                            result.forEach(function (value, index) {
                                var a = 1;
                                var b = 1;
                                if(index == 0){
                                    args.data.item_code = undefined;
                                    $scope.data.currItem.epm_pdt_quoted_price_lines.forEach(function (val) {
                                        if(val.item_code == value.item_code){
                                            //swalApi.info('不能选择重复产品，请重新选择!');
                                            args.data.item_name = '不能选择重复产品，请重新选择!';
                                            a = 0;
                                        }
                                    });
                                    if(a == 1){
                                        args.data.item_id = value.item_id;
                                        args.data.item_code = value.item_code;
                                        args.data.item_class3_name = value.item_class3_name;
                                        args.data.item_name = value.item_name;
                                        args.data.model = value.item_model;//型号
                                        args.data.pdt_docid = value.docid1;//产品图片
                                        args.data.spec = value.specs;//规格
                                        args.data.color = value.item_color;//颜色
                                        args.data.dimension_docid = value.docid3;//尺寸图
                                        if($scope.data.currItem.project_id > 0){
                                            arr.push(requestApi.post({
                                                classId: "epm_pdt_quoted_price",
                                                action: 'search',
                                                data: {
                                                    project_id : $scope.data.currItem.project_id,
                                                    item_id : args.data.item_id,
                                                    search_flag : 1
                                                }
                                            }).then(function (data) {
                                                if(b == 1){
                                                    if(data.epm_pdt_quoted_prices.length == 0){
                                                        args.data.quoted_rev = 1;
                                                    }else{
                                                        args.data.quoted_rev = numberApi.sum(data.epm_pdt_quoted_prices[0].quoted_rev,1);
                                                        args.data.quoted_price_old = data.epm_pdt_quoted_prices[0].quoted_price;
                                                    }
                                                }
                                            }));
                                        }
                                        arr.push(requestApi.post({
                                            classId: "epm_pdt_quoted_price",
                                            action: 'search',
                                            data: {
                                                item_id : args.data.item_id,
                                                search_flag : 2
                                            }
                                        }).then(function (data) {
                                            if(data.epm_pdt_quoted_prices.length==0||data.epm_pdt_quoted_prices[0].market_price==null||data.epm_pdt_quoted_prices[0].market_price==undefined||data.epm_pdt_quoted_prices[0].market_price==0||data.epm_pdt_quoted_prices[0].market_price==""){
                                                //swalApi.info('产品编码【'+args.data.item_code+'】的产品尚未维护价格，请重新选择!');
                                                args.data.item_name = '产品编码【'+args.data.item_code+'】的产品尚未维护价格，请重新选择!';
                                                args.data.item_code = undefined;
                                                args.data.item_class3_name = undefined;
                                                args.data.item_id = undefined;
                                                args.data.model = undefined;//型号
                                                args.data.pdt_docid = undefined;//产品图片
                                                args.data.spec = undefined;//规格
                                                args.data.color = undefined;//颜色
                                                args.data.dimension_docid = undefined;//尺寸图
                                                args.data.quoted_rev = undefined;
                                                args.data.quoted_price_old = undefined;
                                                args.data.market_price = undefined;//市场零售价
                                                b = 2;
                                            }else if(data.epm_pdt_quoted_prices.length == 1){
                                                args.data.market_price = data.epm_pdt_quoted_prices[0].market_price;
                                            }else if(data.epm_pdt_quoted_prices.length > 1){//多条数据,需要选择
                                                return $modal.openCommonSearch({
                                                    classId:'epm_pdt_quoted_price',
                                                    postData : {
                                                        item_id : args.data.item_id,
                                                        search_flag : 2
                                                    },
                                                    dataRelationName:'epm_pdt_quoted_prices',
                                                    title : '市场零售价价格选取',
                                                    gridOptions:{
                                                        columnDefs:[
                                                            {
                                                                headerName: "价格",
                                                                field: "market_price"
                                                            }
                                                        ]
                                                    }
                                                })
                                                    .result//响应数据
                                                    .then(function(result){
                                                        args.data.market_price = result.market_price;
                                                    });
                                            }
                                        }));
                                    }
                                }else{
                                    $scope.data.currItem.epm_pdt_quoted_price_lines.forEach(function (val) {
                                        if(val.item_code == value.item_code){
                                            //swalApi.info('不能选择重复产品，请重新选择!');
                                            $scope.data.currItem.epm_pdt_quoted_price_lines.push({
                                                item_name:'不能选择重复产品，请重新选择!'
                                            });
                                            a = 0;
                                        }
                                    });
                                    if(a == 1){
                                        $scope.data.currItem.epm_pdt_quoted_price_lines.push({
                                            item_id : value.item_id,
                                            item_code : value.item_code,
                                            item_class3_name : value.item_class3_name,
                                            item_name : value.item_name,
                                            model : value.item_model,//型号
                                            pdt_docid :value.docid1,//产品图片
                                            spec : value.specs,//规格
                                            color : value.item_color,//颜色
                                            dimension_docid : value.docid3,//尺寸图
                                            quoted_rev : undefined,
                                            quoted_price_old : undefined,
                                            market_price : undefined,
                                            remark : '价格含普通水件、PP缓冲盖板，不含角阀软管',
                                            orgin : 1,
                                            brand : 1
                                        });
                                        var l = numberApi.sub($scope.data.currItem.epm_pdt_quoted_price_lines.length, 1);
                                        if($scope.data.currItem.project_id > 0){
                                            arr.push(requestApi.post({
                                                classId: "epm_pdt_quoted_price",
                                                action: 'search',
                                                data: {
                                                    project_id : $scope.data.currItem.project_id,
                                                    item_id : value.item_id,
                                                    search_flag : 1
                                                }
                                            }).then(function (data) {
                                                if(b == 1){
                                                    if(data.epm_pdt_quoted_prices.length == 0){
                                                        $scope.data.currItem.epm_pdt_quoted_price_lines[l].quoted_rev = 1;
                                                    }else{
                                                        $scope.data.currItem.epm_pdt_quoted_price_lines[l].quoted_rev = numberApi.sum(data.epm_pdt_quoted_prices[0].quoted_rev,1);
                                                        $scope.data.currItem.epm_pdt_quoted_price_lines[l].quoted_price_old = data.epm_pdt_quoted_prices[0].quoted_price;
                                                    }
                                                }
                                            }));
                                        }
                                        arr.push(requestApi.post({
                                            classId: "epm_pdt_quoted_price",
                                            action: 'search',
                                            data: {
                                                item_id : value.item_id,
                                                search_flag : 2
                                            }
                                        }).then(function (data) {
                                            if(data.epm_pdt_quoted_prices.length==0||data.epm_pdt_quoted_prices[0].market_price==null||data.epm_pdt_quoted_prices[0].market_price==undefined||data.epm_pdt_quoted_prices[0].market_price==0||data.epm_pdt_quoted_prices[0].market_price==""){
                                                //swalApi.info('产品编码【'+value.item_code+'】的产品尚未维护价格，请重新选择!');
                                                //args.data.item_name = '产品编码【'+value.item_code+'】的产品尚未维护价格，请重新选择!';
                                                $scope.data.currItem.epm_pdt_quoted_price_lines[l] = {
                                                    item_name : '产品编码【'+value.item_code+'】的产品尚未维护价格，请重新选择!'
                                                };
                                                b = 2;
                                            }else if(data.epm_pdt_quoted_prices.length == 1){
                                                $scope.data.currItem.epm_pdt_quoted_price_lines[l].market_price = data.epm_pdt_quoted_prices[0].market_price;
                                            }else if(data.epm_pdt_quoted_prices.length > 1){//多条数据,需要选择
                                                return $modal.openCommonSearch({
                                                    classId:'epm_pdt_quoted_price',
                                                    postData : {
                                                        item_id : args.data.item_id,
                                                        search_flag : 2
                                                    },
                                                    dataRelationName:'epm_pdt_quoted_prices',
                                                    title : '市场零售价价格选取',
                                                    gridOptions:{
                                                        columnDefs:[
                                                            {
                                                                headerName: "价格",
                                                                field: "market_price"
                                                            }
                                                        ]
                                                    }
                                                })
                                                    .result//响应数据
                                                    .then(function(result){
                                                        $scope.data.currItem.epm_pdt_quoted_price_lines[l].market_price = result.market_price;
                                                    });
                                            }
                                        }));
                                    }

                                }

                            });
                            return arr;
                        }).then(function (arr) {
                            $q.all(arr).then(function () {
                                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_pdt_quoted_price_lines);
                            });
                        });
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_pdt_quoted_price_lines = [];
                    //bizData.loan_person_id = userbean.sysuserid;
                    bizData.quoted_person = userbean.userid;
                    bizData.quoted_date = new Date().Format('yyyy-MM-dd');
                    $scope.data.currItem.show_number = 2;
                    //查询默认税率
                    selectTaxRate ();
                };

                /**
                 * 保存数据前处理数据
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    if($scope.data.currItem.valid_time_limit == 1){//加三十天
                        $scope.data.currItem.quoted_valid_date =
                            new Date(numberApi.sum(new Date($scope.data.currItem.quoted_date).getTime(), 2592000000));
                    }else if($scope.data.currItem.valid_time_limit == 2){//加60天
                        $scope.data.currItem.quoted_valid_date =
                            new Date(numberApi.sum(new Date($scope.data.currItem.quoted_date).getTime(), 5184000000));
                    }else if($scope.data.currItem.valid_time_limit == 3){//加90天
                        $scope.data.currItem.quoted_valid_date =
                            new Date(numberApi.sum(new Date($scope.data.currItem.quoted_date).getTime(), 7776000000));
                    }

                };

                /**
                 * 复制
                 */
                $scope.copyBizData = function (bizData) {
                    $scope.hcSuper.copyBizData(bizData);
                    bizData.quoted_person = userbean.userid;
                    bizData.quoted_date = new Date().Format('yyyy-MM-dd');
                    $scope.data.currItem.show_number = 2;
                    bizData.epm_project_attachs = [];
                    //查询报价次数
                    requestApi
                        .post({
                            classId: "epm_pdt_quoted_price",
                            action: 'search',
                            data: {
                                sqlwhere : "project_id = "+bizData.project_id
                            }
                        })
                        .then(function (data) {
                            bizData.quoted_times = numberApi.sum(data.epm_pdt_quoted_prices.length,1)
                        })
                        .then(function () {
                            var arr = [];//定义一个容器用于存放promise
                            //明细行 清空折扣率 单价 数量 金额 查询报价次数
                            bizData.epm_pdt_quoted_price_lines.forEach(function (value) {
                                value.discount_rate = undefined;
                                value.quoted_price = undefined;
                                value.qty = undefined;
                                value.quoted_amt = undefined;
                                value.quoted_rev = undefined;
                                value.quoted_price_old = undefined;
                                value.no_tax_contract_price = undefined;
                                arr.push(requestApi.post({
                                    classId: "epm_pdt_quoted_price",
                                    action: 'search',
                                    data: {
                                        project_id : bizData.project_id,
                                        item_id : value.item_id,
                                        search_flag : 1
                                    }
                                }).then(function (data) {
                                    if(data.epm_pdt_quoted_prices.length == 0){
                                        value.quoted_rev = 1;
                                    }else{
                                        value.quoted_rev = numberApi.sum(data.epm_pdt_quoted_prices[0].quoted_rev,1);
                                        value.quoted_price_old = data.epm_pdt_quoted_prices[0].quoted_price;
                                    }
                                }));
                            });
                            return $q.all(arr)
                                .then(function () {
                                    $scope.gridOptions.hcApi.setRowData(bizData.epm_pdt_quoted_price_lines);
                                });
                        });
                };

        /**
		 * 初始化
		 * @override
		 */
		$scope.doInit = function () {
			return $q
				.when()
				.then($scope.hcSuper.doInit)
				.then(function () {
                    return requestApi
                        .post({
                            classId: "epm_pdt_quoted_price",
                            action: 'search',
                            data: {
                                search_flag : 4
                            }
                        })
                        .then(function(data){
                            $scope.data.price_param = data.price_param;
                        });
				});
		};

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    if(bizData.project_id > 0){
                        oldPrice();
                    }else{
                        $scope.data.currItem.quoted_times = undefined;
                        bizData.epm_pdt_quoted_price_lines.forEach(function (value){
                            value.quoted_rev = undefined;
                        });
                    }
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_pdt_quoted_price_lines);
                    $scope.data.currItem.show_number = 2;//默认不显示数量
                    $scope.calSum();
                    //查询默认税率
                    selectTaxRate ();
                    $scope.whetherQuotedType();
                };

                function oldPrice (){
                    var arr = [];
                    $scope.data.currItem.epm_pdt_quoted_price_lines.forEach(function (val) {
                        if(val.quoted_rev-1>0){
                            arr.push(requestApi.post({
                                classId: "epm_pdt_quoted_price",
                                action: 'search',
                                data: {
                                    project_id : $scope.data.currItem.project_id,
                                    item_id : val.item_id,
                                    search_flag : 3,
                                    quoted_rev : (val.quoted_rev-1)
                                }
                            }).then(function (data) {
                                val.quoted_price_old = data.epm_pdt_quoted_prices[0].quoted_price;
                            }));
                        }
                    });
                    $q.all(arr).then(function () {
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_pdt_quoted_price_lines);
                    });
                }

                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_lines && $scope.add_lines();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat>1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_lines && $scope.del_lines();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat>1;
                };
                /* 底部右边按钮 */
                $scope.footerRightButtons.print.hide = function () {
                    return $scope.data.currItem.stat != 5;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                /**
                 * 添加明细行
                 */
                $scope.add_lines = function () {
                    $scope.gridOptions.api.stopEditing();
                    if(!$scope.data.currItem.quoted_type > 0){
                        swalApi.error('请先选择报价类型');
                        return;
                    }
                    $scope.data.currItem.epm_pdt_quoted_price_lines.push({
                        remark : '价格含普通水件、PP缓冲盖板，不含角阀软管',
                        orgin : 1,
                        brand : 1,
                        tax_rate : $scope.data.tax_rate
                    });
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_pdt_quoted_price_lines);
                };
                /**
                 * 删除行
                 */
                $scope.del_lines = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_pdt_quoted_price_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_pdt_quoted_price_lines);
                    }
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EpmPdtQuotedPriceProp
        });

    });