/**
 * zengjinhua
 * 2019/8/12
 * 事业部设置
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', '$modal', 'numberApi', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, $modal, numberApi) {

        var controller=[
            '$scope',
            function ($scope){
                /**
                 * 数据定义
                 */
                /*------------------------------------------数据定义------------------------------------------*/
                $scope.data = {};
                $scope.data.currItem = {
                    //定义列表数组
                    division_base_sets:[],
                    division_ent_rels:[],
                    division_trading_rels:[]
                };

                //账套的保存对象
                $scope.intermediateObject = {};

                //交易的保存对象
                $scope.intermediatePartners = {};

                //当前选中行的事业部id
                $scope.atPresent = 0;

                //定义可保存参数-默认不可修改
                $scope.canBeSaved = 0;

                //定义用于保存账套的id
                $scope.accinformation = "";

                /*------------------------------------------网格定义------------------------------------------*/
                /**
                 * 定义表格
                 */
                $scope.gridOptions={
                    hcEvents: {
                        /**
                         * 焦点事件
                         */
                        cellFocused: function (params) {
                            if($scope.intermediateObject != undefined
                                && $scope.intermediatePartners != undefined
                                && params.rowIndex!=null){
                                //保存当前行的事业部id
                                $scope.atPresent =
                                    $scope.data.currItem.division_base_sets[params.rowIndex].division_id;
                                //设置对应的交易公司数据到网格
                                $scope.gridOptionsDeal.hcApi
                                    .setRowData($scope.intermediatePartners[$scope.atPresent]);
                                //设置对应的账套数据到网格
                                $scope.gridOptionsAccount.hcApi
                                    .setRowData($scope.intermediateObject[$scope.atPresent]);
                            }
                        }
                    },
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'division_id',
                        headerName:'事业部',
                        hcDictCode:'epm.division'
                    },{
                        field:'division_code',
                        headerName:'事业部编码',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },{
                        field:'discount_rate',
                        headerName:'出厂折扣',
                        editable: function(){
                            return true;
                        },
                        hcRequired : true,
                        cellStyle: {
                            'text-align': 'center'
                        },
                        onCellValueChanged: function (args) {
                            if (args.oldValue == args.newValue) {
                                return;
                            }
                            //修改可保存参数为可保存
                            $scope.canBeSaved = 1;
                            discountRateCheck(args);
                        }
                    },{
                        field:'cost_rate',
                        headerName:'内部结算率',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }],hcAfterRequest:function(args){
                        $scope.data.currItem.division_base_sets = args.division_base_sets;//事业部关联对象
                        $scope.data.currItem.division_ent_rels = args.division_ent_rels;//账套关联对象
                        $scope.data.currItem.division_trading_rels = args.division_trading_rels;//交易公司关联对象

                        //保存的对象属性清空
                        $scope.intermediateObject = {};//账套的保存对象
                        $scope.intermediatePartners = {};//交易的保存对象

                        //初始化
                        $scope.accinformation = "";
                        //收集账套的id
                        $scope.data.currItem.division_ent_rels.forEach(function (value, index) {//账套的数据
                            if(index == 0){
                                $scope.accinformation += value.organization_id;
                            }else{
                                $scope.accinformation += "," + value.organization_id;
                            }
                        });

                        //将子表的数据进行数据的组装
                        $scope.data.currItem.division_base_sets.forEach(function (value) {
                            $scope.intermediateObject[value.division_id] = [];//有一条数据行则生成一个属性
                            $scope.intermediatePartners[value.division_id] = [];//有一条数据行则生成一个属性
                            $scope.data.currItem.division_ent_rels.forEach(function (val) {//账套的数据
                                if(val.division_id == value.division_id){//属于当前事业部的数据，保存到对应的对象数组
                                    $scope.intermediateObject[value.division_id].push(val);
                                }
                            });
                            $scope.data.currItem.division_trading_rels.forEach(function (val) {//交易公司的数据
                                if(val.division_id == value.division_id){//属于当前事业部的数据，保存到对应的对象数组
                                    $scope.intermediatePartners[value.division_id].push(val);
                                }
                            });
                        });
                        //设置选择行在第一行
                        $scope.gridOptions.hcApi.setFocusedCell(0);
                        //设置账套数据
                        $scope.gridOptionsAccount.hcApi.setRowData(
                            $scope.intermediateObject[$scope.data.currItem.division_base_sets[0].division_id]);
                        //设置交易公司数据
                        $scope.gridOptionsDeal.hcApi.setRowData(
                            $scope.intermediatePartners[$scope.data.currItem.division_base_sets[0].division_id]);
                        //保存完后，修改可保存参数为不可保存
                        $scope.canBeSaved = 0;
                    },
                    //取消分页
                    hcNoPaging:true,
                    hcRequestAction:'search',
                    hcClassId:'division_base_set',
                    //定义表格增减行按钮
                    hcButtons: {
                        divisionAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addDivision && $scope.addDivision();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delDivision && $scope.delDivision();
                            }
                        }
                    }
                };

                /**
                 * 定义表格交易公司
                 */
                $scope.gridOptionsDeal={
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'trading_company_name',
                        headerName:'交易公司'
                    },{
                        field:'trading_scope',
                        headerName:'交易公司类型',
                        hcDictCode: 'epm.trading_scope'
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        tradingAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addTrading && $scope.addTrading();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delTrading && $scope.delTrading();
                            }
                        }
                    }
                };

                /**
                 * 定义表格账套
                 */
                $scope.gridOptionsAccount={
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'organization_name',
                        headerName:'账套组织'
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        accountAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addAccount && $scope.addAccount();
                            }
                        },
                        invoiceDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delAccount && $scope.delAccount();
                            }
                        }
                    }
                };

                //基础基础控制器
                controllerApi.extend({
                    controller:base_diy_page.controller,
                    scope:$scope
                });
                /*------------------------------------------方法定义------------------------------------------*/

                /**
                 * 折扣率范围校验
                 */
                function discountRateCheck(args) {
                    if(args.data.discount_rate != undefined
                        && args.data.discount_rate != null
                        && args.data.discount_rate != ""){//判断折扣率是否为空
                        if(numberApi.isNum(parseFloat(args.data.discount_rate))){
                            if(args.data.discount_rate <= 0 || args.data.discount_rate > 1){
                                args.data.discount_rate = undefined;
                                swalApi.info("折扣率应大于 0 小于等于 1，请重新输入!");
                            }
                        }else{
                            args.data.discount_rate = undefined;
                            swalApi.info("输入的不是数字,请重新输入!");
                        }
                        $scope.gridOptions.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptions.columnApi.getColumns(['discount_rate'])
                        })
                    }
                }

                /*------------------------------------------按钮方法定义------------------------------------------*/
                /**
                 * 新增行
                 */
                $scope.addDivision = function(){
                    $scope.gridOptions.api.stopEditing();
                    //用于收集value
                    var ids = "";
                    $scope.data.currItem.division_base_sets.forEach(function (value, index) {//收集已选择的事业部value
                        if(index == 0){
                            ids += "'" + value.division_id + "'";
                        }else{
                            ids += ",'" + value.division_id + "'";
                        }
                    });
                    return $modal.openCommonSearch({
                        classId:'division_base_set',
                        sqlWhere : ids == "" ? " 1 = 1 " : " dictvalue not in (" + ids + ")",
                        postData : {
                            search_flag : 1
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.division_base_sets.push({
                                division_id : result.dictvalue,
                                division_name: result.dictname,
                                division_code : result.dictcode
                            });
                            //生成账套的保存属性
                            if($scope.intermediateObject[result.dictvalue] == undefined){
                                $scope.intermediateObject[result.dictvalue] = [];
                            }
                            //生成交易公司的保存属性
                            if($scope.intermediatePartners[result.dictvalue] == undefined){
                                $scope.intermediatePartners[result.dictvalue] = [];
                            }
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.division_base_sets);
                            $scope.gridOptions.hcApi.setFocusedCell($scope.data.currItem.division_base_sets.length-1);
                            //修改可保存参数为可保存
                            $scope.canBeSaved = 1;
                        });
                };

                /**
                 * 删除行
                 */
                $scope.delDivision = function(){
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        //清空相对应的账套和交易公司数据
                        $scope.intermediateObject[$scope.data.currItem.division_base_sets[idx].division_id] = undefined;
                        $scope.intermediatePartners[$scope.data.currItem.division_base_sets[idx].division_id] = undefined;
                        $scope.data.currItem.division_base_sets.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.division_base_sets);
                        //修改可保存参数为可保存
                        $scope.canBeSaved = 1;
                        if ($scope.gridOptions.hcApi.getFocusedRowIndex() < 0) {
                            //清空网格
                            $scope.gridOptionsDeal.hcApi.setRowData([]);
                            //清空网格
                            $scope.gridOptionsAccount.hcApi.setRowData([]);
                        }
                    }
                };

                /**
                 * 新增行交易公司
                 */
                $scope.addTrading = function(){
                    $scope.gridOptionsDeal.api.stopEditing();
                    return $modal.openCommonSearch({
                        classId:'epm_trading_company',
                        title : '交易公司',
                        postData : {
                            /** 3-交易公司通用查询，过滤不可用 */
                            search_flag : 3
                        }
                    })
                        .result//响应数据
                        .then(function(result){
                            $modal.openCommonSearch({
                                classId:'division_base_set',
                                title : '交易公司类型',
                                gridOptions : {
                                    columnDefs : [{
                                        field : 'dictcode',
                                        headerName : '编码'
                                    },{
                                        field : 'dictname',
                                        headerName : '名称'
                                    }]
                                },
                                postData : {
                                    search_flag : 2
                                }
                            })
                                .result//响应数据
                                .then(function(results){
                                    //定义一个可执行参数
                                    var executable = 1;
                                    //判断当前对象数组中是否有相等的交易公司和交易类型
                                    $scope.intermediatePartners[$scope.atPresent].forEach(function (value) {
                                        if((value.trading_company_id == result.trading_company_id)
                                            && (value.trading_scope == results.dictvalue)){
                                            executable = 2;
                                            swalApi.info("该事业部已存在相同交易类型的交易公司数据，请检查。");
                                            return;
                                        }
                                    });
                                    if(executable == 1){//可执行
                                        //生成一行数据
                                        $scope.intermediatePartners[$scope.atPresent].push({
                                            division_id : $scope.data.currItem.division_base_sets[
                                                $scope.gridOptions.hcApi.getFocusedRowIndex()].division_id,
                                            division_name : $scope.data.currItem.division_base_sets[
                                                $scope.gridOptions.hcApi.getFocusedRowIndex()].division_name,
                                            trading_company_name : result.trading_company_name,
                                            trading_company_id : result.trading_company_id,
                                            trading_scope : results.dictvalue
                                        });
                                        //设置网格数据
                                        $scope.gridOptionsDeal.hcApi.setRowData($scope.intermediatePartners[$scope.atPresent]);
                                        //设置网格指针
                                        $scope.gridOptionsDeal.hcApi.setFocusedCell($scope.intermediatePartners[$scope.atPresent].length-1);
                                        //修改可保存参数为可保存
                                        $scope.canBeSaved = 1;
                                    }
                                });
                        });
                };

                /**
                 * 删除行交易公司
                 */
                $scope.delTrading = function(){
                    var idx = $scope.gridOptionsDeal.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.intermediatePartners[$scope.atPresent].splice(idx, 1);
                        $scope.gridOptionsDeal.hcApi.setRowData($scope.intermediatePartners[$scope.atPresent]);
                        //修改可保存参数为可保存
                        $scope.canBeSaved = 1;
                    }
                };

                /**
                 * 新增行账套
                 */
                $scope.addAccount = function(){
                    $scope.gridOptionsAccount.api.stopEditing();
                    var str = $scope.accinformation == "" ? " 1 = 1 " : " entid not in(" + $scope.accinformation + ")";
                    return $modal.openCommonSearch({
                        classId:'scpent',
                        sqlWhere : " set_of_books_id = " + userbean.loginEnt.set_of_books_id + " and " + str
                    })
                        .result//响应数据
                        .then(function(result){
                            //用于收集id
                            if($scope.accinformation == ""){
                                $scope.accinformation += result.entid;
                            }else{
                                $scope.accinformation += "," +result.entid;
                            }

                            //生成一行数据
                            $scope.intermediateObject[$scope.atPresent].push({
                                division_id : $scope.data.currItem.division_base_sets[
                                    $scope.gridOptions.hcApi.getFocusedRowIndex()].division_id,
                                division_name : $scope.data.currItem.division_base_sets[
                                    $scope.gridOptions.hcApi.getFocusedRowIndex()].division_name,
                                organization_id : result.entid,
                                organization_name : result.entname
                            });
                            //设置数据
                            $scope.gridOptionsAccount.hcApi.setRowData($scope.intermediateObject[$scope.atPresent]);
                            //设置网格指针
                            $scope.gridOptionsAccount.hcApi.setFocusedCell($scope.intermediateObject[$scope.atPresent].length-1);
                            //修改可保存参数为可保存
                            $scope.canBeSaved = 1;
                        });
                };

                /**
                 * 删除行账套
                 */
                $scope.delAccount = function(){
                    var idx = $scope.gridOptionsAccount.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.intermediateObject[$scope.atPresent].splice(idx, 1);
                        $scope.gridOptionsAccount.hcApi.setRowData($scope.intermediateObject[$scope.atPresent]);
                        //修改可保存参数为可保存
                        $scope.canBeSaved = 1;

                        /**重新收集账套的id集 */
                        //初始化
                        $scope.accinformation = "";
                        $scope.data.currItem.division_base_sets.forEach(function (value) {
                            $scope.intermediateObject[value.division_id].forEach(function (val) {
                                if($scope.accinformation == ""){
                                    $scope.accinformation += val.organization_id;
                                }else{
                                    $scope.accinformation += "," +val.organization_id;
                                }
                            });
                        });
                    }
                };
                /*------------------------------------------保存数据方法定义------------------------------------------*/
                /**
                 * 添加按钮
                 */
                $scope.toolButtons = {
                    notSave: {
                        title: '不保存',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            $scope.serarch && $scope.serarch();
                        },
                        hide: function () {
                            return $scope.canBeSaved == 0;
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'iconfont hc-save',
                        click: function () {
                            $scope.save && $scope.save();
                        },
                        hide: function () {
                            return $scope.canBeSaved == 0;
                        }
                    }
                };

                /**
                 * 保存
                 */
                $scope.save = function () {
                    //停止编辑
                    $scope.gridOptions.api.stopEditing();
                    $scope.gridOptionsDeal.api.stopEditing();
                    $scope.gridOptionsAccount.api.stopEditing();
                    //定义一个数据盒子
                    var arr = [];
                    $scope.data.currItem.division_base_sets.forEach(function(val,index){
                        if(val.discount_rate == undefined || val.discount_rate == "" || val.discount_rate == null){
                            arr.push('第'+numberApi.sum(index,1)+"行出厂折扣为空，请检查!");
                        }
                    });
                    //若盒子非空，验证不通过，弹框
                    if (arr.length){
                        return swalApi.error(arr);
                    }else {
                        //清空数据
                        $scope.data.currItem.division_ent_rels = [];//账套关联对象
                        $scope.data.currItem.division_trading_rels = [];//交易公司关联对象
                        //将对应的账套对象和交易公司对象中的数据放入关联对象中
                        $scope.data.currItem.division_base_sets.forEach(function (value) {
                            $scope.intermediateObject[value.division_id].forEach(function (val) {
                                $scope.data.currItem.division_ent_rels.push(val);
                            });
                            $scope.intermediatePartners[value.division_id].forEach(function (val) {
                                $scope.data.currItem.division_trading_rels.push(val);
                            });
                        });
                        //调用后台保存方法
                        return requestApi.post({
                            classId: 'division_base_set',
                            action: 'save',
                            data: {
                                division_base_sets: $scope.data.currItem.division_base_sets,
                                division_ent_rels : $scope.data.currItem.division_ent_rels,
                                division_trading_rels : $scope.data.currItem.division_trading_rels
                            }
                        }).then(function () {
                            return swalApi.success('保存成功!');
                        }).then($scope.serarch);
                    }
                };

                /**
                 * 保存按钮函数，调用网格刷新
                 */
                $scope.serarch = function (){
                    $scope.gridOptions.hcApi.search()
                };

            }
        ];
        return controllerApi.controller({
            module:module,
            controller:controller
        });

    });