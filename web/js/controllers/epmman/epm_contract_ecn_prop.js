/**
 * 战略协议变更
 * 2019/12/12
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', '$modal', 'numberApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, $modal, numberApi, swalApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //定义校验字段
                $scope.verification = true;

                //字段名称
                var fileds_project = ['project_id', 'project_code', 'project_name', 'manager', 'division_id'];
                var fileds_contract = ['contract_id', 'contract_code', 'contract_name', 'signed_date', 
                    'signed_location','contract_effect_date', 'contract_expire_date', 'party_a_name', 
                    'party_b_name'];

                //赋值战略相关数据
                var singleData = true;

                /**
                 * 表格定义  "原有效产品清单"
                 */
                $scope.gridOptions = {
                    hcName : '原有效产品清单',
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'model',
                        headerName: '产品型号'
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'stand_price',
                        headerName: '标准单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'contract_price',
                        headerName: '中标单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'tax_rate',
                        headerName: '税率'
                    },
                    {
                        field: 'no_tax_contract_price',
                        headerName: '不含税单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'tax_price',
                        headerName: '税额',
                        type: '金额'
                    },
                    {
                        field: 'remark',
                        headerName: '备注'
                    }],
                    hcEvents: {
                        /**
                         * 双击事件
                         * 点击新增数据到取消产品清单
                         */
                        cellDoubleClicked : function (params) {
                            if($scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.stat > 1){
                                return;
                            }
                            var canInsert = true;
                            $scope.data.currItem.epm_contract_item_ecn_line_cancels.some(function(value){
                                if (value.contract_item_line_id == params.data.contract_item_line_id){
                                    canInsert = false;
                                    return true;
                                }
                            });
                            if(canInsert){
                                $scope.data.currItem.epm_contract_item_ecn_line_cancels.push(params.data);
                                $scope.gridOptionsCancel.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_cancels);
                            }
                        }
                    }
                };

                /**
                 * 表格定义  "取消产品清单"
                 */
                $scope.gridOptionsCancel = {
                    hcName : '取消产品清单',
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'model',
                        headerName: '产品型号'
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'stand_price',
                        headerName: '标准单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'contract_price',
                        headerName: '中标单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'tax_rate',
                        headerName: '税率'
                    },
                    {
                        field: 'no_tax_contract_price',
                        headerName: '不含税单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'tax_price',
                        headerName: '税额',
                        type: '金额'
                    },
                    {
                        field: 'remark',
                        headerName: '备注',
                        editable : true
                    }],
                    hcEvents: {
                        /**
                         * 双击事件
                         * 删除双击行
                         */
                        cellDoubleClicked : function (params) {
                            if($scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.stat > 1 || params.column.colId == 'remark'){
                                return;
                            }
                            $scope.data.currItem.epm_contract_item_ecn_line_cancels.splice(params.rowIndex, 1);
                            $scope.gridOptionsCancel.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_cancels);
                        }
                    }
                };

                /**
                 * 表格定义  "新增产品清单"
                 */
                $scope.gridOptionsNew = {
                    hcName : '新增产品清单',
                    columnDefs: [{
                        type: '序号'
                    },
                    {
                        field: 'item_code',
                        headerName: '产品编码'
                    },
                    {
                        field: 'item_name',
                        headerName: '产品名称'
                    },
                    {
                        field: 'model',
                        headerName: '产品型号'
                    },
                    {
                        field: 'uom_name',
                        headerName: '单位',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    },
                    {
                        field: 'stand_price',
                        headerName: '标准单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'contract_price',
                        headerName: '中标单价(元)',
                        type: '金额',
                        editable : true,
                        hcRequired:true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            if($scope.verification){
                                sumPrice(args);
                            }
                        }
                    },
                    {
                        field: 'tax_rate',
                        headerName: '税率',
                        editable : true
                    },
                    {
                        field: 'no_tax_contract_price',
                        headerName: '不含税单价(元)',
                        type: '金额'
                    },
                    {
                        field: 'tax_price',
                        headerName: '税额',
                        type: '金额'
                    },
                    {
                        field: 'remark',
                        headerName: '备注',
                        editable : true
                    }],
                    //定义表格增减行按钮
                    hcButtons: {
                        itemAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                //新增产品
                                $scope.addItem && $scope.addItem();
                            },
                            hide : function (){
                                return ($scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.stat > 1);
                            }
                        },
                        itemDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                //删除行
                                $scope.delItem && $scope.delItem();
                            },
                            hide : function (){
                                return ($scope.isFormReadonly() || !$scope.form.editing || $scope.data.currItem.stat > 1);
                            }
                        }
                    }
                };

                /**
                 * 计算总价
                 */
                function sumPrice(args){
                    if(args.data.contract_price!=null
                        &&args.data.contract_price!=undefined
                        &&args.data.contract_price!=""){
                        if(!numberApi.isNum(Number(args.data.contract_price))){
                            swalApi.info('中标单价输入不是数字，请重新输入!');
                            args.data.contract_price = undefined;
                            $scope.gridOptionsNew.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptionsNew.columnApi.getColumns(['contract_price'])
                            });
                            return;
                        }
                        if(!(Number(args.data.contract_price) > 0)){
                            swalApi.info('中标单价请输入大于零的数字!');
                            args.data.contract_price = undefined;
                            $scope.gridOptionsNew.api.refreshCells({
                                rowNodes: [args.node],
                                force: true,//改变了值才进行刷新
                                columns: $scope.gridOptionsNew.columnApi.getColumns(['contract_price'])
                            });
                            return;
                        }
                        args.data.no_tax_contract_price =
                            numberApi.divide(args.data.contract_price,
                                numberApi.sum(1, args.data.tax_rate) );
                        args.data.tax_price = numberApi.sub(args.data.contract_price,args.data.no_tax_contract_price);
                        $scope.gridOptionsNew.api.refreshCells({
                            rowNodes: [args.node],
                            force: true,//改变了值才进行刷新
                            columns: $scope.gridOptionsNew.columnApi.getColumns(['contract_price',
                            'contract_qty', 'contract_amount', 'no_tax_contract_price', 'tax_rate', 'tax_price'])
                        });//刷新网格视图
                    }
                }

                /**
                 * 查询默认税率
                 */
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

                /*----------------------------------网格按钮方法定义-------------------------------------------*/
                /**
                 * 新增产品
                 */
                $scope.addItem = function (){
                    if($scope.data.currItem.project_id == undefined 
                    || $scope.data.currItem.project_id == 0 
                    || $scope.data.currItem.project_id == null 
                    || $scope.data.currItem.project_id == ""){
                        swalApi.error('请先选择战略项目');
                        return;
                    }
                    $scope.gridOptionsNew.api.stopEditing();
                    //需过滤已有的产品
                    var arr = $scope.data.currItem.epm_contract_item_ecn_originals.map(function(value){
                        return {
                            item_id : value.item_id
                        }
                    });
                    //需过滤已选的产品
                    $scope.data.currItem.epm_contract_item_ecn_line_news.forEach(function(value){
                        arr.push({
                            item_id : value.item_id
                        });
                    });
                    return $modal
                        .openCommonSearch({
                            classId: 'item_org',
                            postData: {
                                need_price: 2,	//需要价格
                                item_orgs: arr  //过滤数据
                            },
                            beforeOk: function (item) {
                                return requestApi
                                    .post({
                                        classId: 'epm_discount_apply',
                                        action: 'generate_discount_data',
                                        data: {
                                            epm_discount_apply_lines: [{
                                                item_id: item.item_id,
                                                item_code: item.item_code
                                            }]
                                        }
                                    })
                                    .then(function (discount_apply) {
                                        if (discount_apply.error) {
                                            swalApi.error(discount_apply.error);
                                            throw discount_apply.error;
                                        }

                                        return discount_apply.epm_discount_apply_lines[0];
                                    });
                            }
                        })
                        .result
                        .then(function (new_discount_line) {
                            new_discount_line.tax_rate = $scope.data.tax_rate;
                            $scope.data.currItem.epm_contract_item_ecn_line_news.push(new_discount_line);
                            $scope.gridOptionsNew.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_news);
                        });
                }

                /**
                 * 删除产品行
                 */
                $scope.delItem = function (){
                    var idx = $scope.gridOptionsNew.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_contract_item_ecn_line_news.splice(idx, 1);
                        $scope.gridOptionsNew.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_news);
                    }
                };
                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 战略项目查询
                 */
                $scope.commonSearchSetting = {
                    epmContractEcn : {
                        action:'queryprojectdata',
                        title:"战略项目查询",
                        gridOptions:{
                            columnDefs:[
                                {
                                    headerName: "战略项目编码",
                                    field: "project_code"
                                },{
                                    headerName: "战略项目名称",
                                    field: "project_name"
                                },{
                                    headerName: "项目经理",
                                    field: "manager"
                                },{
                                    headerName: "事业部",
                                    field: "division_id",
                                    hcDictCode : 'epm.division'
                                }
                            ]
                        },
                        afterOk: function (project) {
                            //赋值项目相关字段
                            if(singleData){
                                fileds_project.forEach(function(file){
                                    $scope.data.currItem[file] = project[file];
                                });
                            }
                            singleData = true;
                        },
                        beforeOk : function (project) {
                            return requestApi
                                .post({
                                    classId: 'epm_contract_ecn',
                                    action: 'verifycode',
                                    data: {
                                        project_id: project.project_id
                                    }
                                })
                                .then(function (data) {
                                    if (data.sqlwhere.length > 0) {
                                        //存在有未审核完毕的变更单号
                                        swalApi.error(data.sqlwhere);
                                        return false;
                                    }else{
                                        //判断是否需要重新查询数据
                                        if(data.need_query == 2){
                                            //赋值合同项目字段
                                            fileds_contract.forEach(function(file){
                                                $scope.data.currItem[file] = data.epm_contract_ecns[0][file];
                                            });
                                            //原数据
                                            $scope.data.currItem.epm_contract_item_ecn_originals = data.epm_contract_item_ecn_originals;
                                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_originals);
                                            //新增数据
                                            $scope.data.currItem.epm_contract_item_ecn_line_news = [];
                                            $scope.gridOptionsNew.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_news);
                                            //取消数据
                                            $scope.data.currItem.epm_contract_item_ecn_line_cancels = [];
                                            $scope.gridOptionsCancel.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_cancels);
                                        }else{
                                            singleData = false;
                                            //通用查询
                                            $modal.openCommonSearch({
                                                title: '战略协议查询',
                                                classId: 'epm_contract_ecn',
                                                action:'strategicquery',
                                                gridOptions:{
                                                    columnDefs:[
                                                        {
                                                            headerName: "协议编码",
                                                            field: "contract_code"
                                                        },{
                                                            headerName: "协议名称",
                                                            field: "contract_name"
                                                        },{
                                                            headerName: "签订时间",
                                                            field: "signed_date",
                                                            type : '日期'
                                                        },{
                                                            headerName: "签订地点",
                                                            field: "signed_location"
                                                        },{
                                                            headerName: "合作开始时间",
                                                            field: "contract_effect_date",
                                                            type : '日期'
                                                        },{
                                                            headerName: "合作结束时间",
                                                            field: "contract_expire_date",
                                                            type : '日期'
                                                        },{
                                                            headerName: "甲方",
                                                            field: "party_a_name"
                                                        },{
                                                            headerName: "乙方",
                                                            field: "party_b_name"
                                                        }
                                                    ]
                                                },
                                                postData: {
                                                    project_id: project.project_id
                                                }
                                            })
                                                .result//响应数据
                                                .then(function (contract) {
                                                    //复制相关合同字段
                                                    fileds_contract.forEach(function(file){
                                                        $scope.data.currItem[file] = contract[file];
                                                    });
                                                    fileds_project.forEach(function(file){
                                                        $scope.data.currItem[file] = project[file];
                                                    });
                                                    requestApi
                                                        .post({
                                                            classId: 'epm_contract_ecn',
                                                            action: 'beforechangedata',
                                                            data: {
                                                                contract_id: contract.contract_id
                                                            }
                                                        })
                                                        .then(function(line){
                                                            //原数据
                                                            $scope.data.currItem.epm_contract_item_ecn_originals = line.epm_contract_item_ecn_originals;
                                                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_originals);
                                                            //新增数据
                                                            $scope.data.currItem.epm_contract_item_ecn_line_news = [];
                                                            $scope.gridOptionsNew.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_news);
                                                            //取消数据
                                                            $scope.data.currItem.epm_contract_item_ecn_line_cancels = [];
                                                            $scope.gridOptionsCancel.hcApi.setRowData($scope.data.currItem.epm_contract_item_ecn_line_cancels);
                                                        });
                                                });
                                        }
                                        return project;
                                    }
                                });
                        }
                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //查询默认税率
                    selectTaxRate ();
                };

                /**
                 * 保存验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    //校验中标单价是否为数字
                    var invalidContractPrice = [];
                    //校验中标单价是否大于零
                    var invalidPrice = [];
                    $scope.data.currItem.epm_contract_item_ecn_line_news.forEach(function(value, index){
                        var pass = true;
                        if(!numberApi.isNum(Number(value.contract_price))){
                            invalidContractPrice.push(index + 1);
                            pass = false;
                        }
                        if(!(Number(value.contract_price) > 0)){
                            invalidPrice.push(index + 1);
                            pass = false;
                        }
                        if(pass){
                            value.no_tax_contract_price =
                            numberApi.divide(value.contract_price,
                                numberApi.sum(1, value.tax_rate) );
                                value.tax_price = numberApi.sub(value.contract_price,value.no_tax_contract_price);
                        }
                    });
                    if (invalidContractPrice.length) {
                        invalidBox.push(
                            '',
                            '中标单价请输入数字，以下行不合法：',
                            '第' + invalidContractPrice.join('、') + '行'
                        );
                    }
                    if (invalidPrice.length) {
                        invalidBox.push(
                            '',
                            '中标单价请输入大于零的数字，以下行不合法：',
                            '第' + invalidPrice.join('、') + '行'
                        );
                    }
                    return invalidBox;
                };

                /**
                 * 点击保存按钮处理
                 */
                $scope.save = function(){
                    $scope.verification = false;
                    $scope.hcSuper.save().finally(function () {
                        $scope.verification = true;
                    });
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //原数据
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_contract_item_ecn_originals);
                    //新增数据
                    $scope.gridOptionsNew.hcApi.setRowData(bizData.epm_contract_item_ecn_line_news);
                    //取消数据
                    $scope.gridOptionsCancel.hcApi.setRowData(bizData.epm_contract_item_ecn_line_cancels);
                    //查询默认税率
                    selectTaxRate ();
                };

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });