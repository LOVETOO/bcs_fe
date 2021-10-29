/**
 * zengjinhua
 * 2019/10/16
 * 生产计划排场
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', '$modal', 'fileApi', '$q', 'numberApi', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, $modal, fileApi, $q, numberApi) {

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
                    epm_mp_heads:[],
                    epm_mp_lines:[]
                };

                //是否查看详情页数据，默认查看详情
                $scope.showDetails = true;

                //是否已审核
                $scope.isAudit = false;

                //默认不编辑状态
                $scope.isEdit = false;

                var canEdit = function () {
                    return $scope.isEdit;
                }

                //排产入库数量网格数组
                var invOutArr = []
                for (var i = 1 ; i <= 31; i++) { 
                    invOutArr.push({
                        field: 'day_'+i,
                        headerName: i + '号',
                        type : '数量',
                        editable: canEdit,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            //获取产品
                            sumQty(numberApi.sub(args.newValue, args.oldValue), args);
                        }
                    })
                }
                //锁定状态词汇值
                $scope.yesLock = [
                    {
                        name:'草稿',
                        value:'1'
                    },
                    {
                        name:'已审核',
                        value:'2'
                    }
                ]

                /*------------------------------------------网格定义------------------------------------------*/
                /**
                 * 定义表格详情展示
                 */
                $scope.gridOptions={
                    hcName: '入库年月计划排产信息',
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'item_code',
                        headerName:'产品编码',
                        editable: canEdit,
                        onCellDoubleClicked: function (args) {
                            $scope.chooseItem(args);
                        },
                        onCellValueChanged: function (args) {
                            if(args.newValue == ""||args.newValue==undefined||args.newValue==null){
                                args.data.item_id = 0;
                                args.data.item_name = undefined;
                                args.data.item_model = undefined;
                                return;
                            }
                            if (args.newValue === args.oldValue){
                                return;
                            }
                            //获取产品
                            getItem(args.newValue,args);
                        }
                    },{
                        field:'item_name',
                        headerName:'产品名称'
                    },{
                        field:'item_model',
                        headerName:'产品型号'
                    },{
                        field:'qty_sum',
                        headerName:'本月预计入库合计'
                    },{
                        headerName: '工程预计入库数量',
                        children: invOutArr
                    }],hcAfterRequest:function(args){
                        if ( args.epm_mp_heads.length > 0 ) {
                            ['month_year', 'creator', 'is_lock', 'mp_id'].forEach(function (field) {
                                $scope.data.currItem[field] = args.epm_mp_heads[0][field];
                            });
                            if($scope.data.currItem.is_lock == 2){//已锁定
                                $scope.isAudit = true;
                            }else{
                                $scope.isAudit = false;
                            }
                            $scope.data.currItem.epm_mp_lines = args.epm_mp_lines;
                        }else { 
                            //未查到数据
                            $scope.data.currItem.creator = undefined;
                            $scope.data.currItem.is_lock = undefined;
                            $scope.data.currItem.mp_id = undefined;
                            $scope.isAudit = false;
                            //生成年月
                            $scope.data.currItem.year = $scope.data.currItem.month_year.substr(0,4);
                            $scope.data.currItem.month = $scope.data.currItem.month_year.substr(5);
                            //明细行处理
                            $scope.data.currItem.epm_mp_lines = args.epm_mp_lines;
                        }
                        if($scope.data.currItem.month_year == undefined 
                            || $scope.data.currItem.month_year == null 
                            || $scope.data.currItem.month_year == ""){
                            if(new Date().getMonth() == 11){
                                var year = numberApi.sum(1, new Date().getFullYear());
                                var month = 1;
                            }else{
                                var year = new Date().getFullYear();
                                var month = numberApi.sum(2, new Date().getMonth());
                            }
                            if(month < 10){
                                month = "0" + month;
                            }
                            $scope.data.currItem.month_year = year + "-" + month;
                        }
                        //显示当月天数
                        queryMumberDaysCurrentMonth($scope.data.currItem.month_year);
                    },
                    //取消分页
                    hcNoPaging:true,
                    hcRequestAction:'select',
                    hcClassId:'epm_mp_head',
                    hcDataRelationName:'epm_mp_lines',
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        if($scope.data.currItem.month_year == undefined 
                            || $scope.data.currItem.month_year == null 
                            || $scope.data.currItem.month_year == ""){
                            if(new Date().getMonth() == 11){
                                searchObj.year = numberApi.sum(1, new Date().getFullYear());
                                var month = 1;
                            }else{
                                searchObj.year = new Date().getFullYear();
                                var month = numberApi.sum(2, new Date().getMonth());
                            }
                            if(month < 10){
                                month = "0" + month;
                            }
                            searchObj.month = month;
                        }else{
                            searchObj.year = $scope.data.currItem.month_year.substr(0,4);
                            searchObj.month = $scope.data.currItem.month_year.substr(5);
                        }
                    },
                    //定义表格增减行按钮
                    hcButtons: {
                        mpAdd: {
                            icon: 'iconfont hc-add',
                            click: function () {
                                $scope.addMp && $scope.addMp();
                            },
                            hide : function (){
                                return (!$scope.isEdit);
                            }
                        },
                        mpDel: {
                            icon: 'iconfont hc-reduce',
                            click: function () {
                                $scope.delMp && $scope.delMp();
                            },
                            hide : function (){
                                return (!$scope.isEdit);
                            }
                        }
                    }
                };

                /**
                 * 定义列表页展示
                 */
                $scope.gridOptionsHead={
                    hcName: '入库计划排产信息',
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'month_year',
                        headerName:'预计入库年月',
                        type : '年月'
                    },{
                        field:'is_lock',
                        headerName:'单据状态',
                        type:'词汇',
                        cellEditorParams:{
                            names:['草稿','已审核'],
                            values:[1,2]
                        }
                    },{
                        field:'creator',
                        headerName:'创建人'
                    },{
                        field:'create_time',
                        headerName:'创建时间',
                        type : '时间'
                    },{
                        field:'updator',
                        headerName:'修改人'
                    },{
                        field:'update_time',
                        headerName:'修改时间',
                        type : '时间'
                    },{
                        field:'locker',
                        headerName:'审核人'
                    },{
                        field:'lock_time',
                        headerName:'审核时间',
                        type : '时间'
                    }],
                    hcEvents: {  
                        cellDoubleClicked: function (params) {
                            $scope.showListData (params.data.month_year);
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
                 * 新增数据到网格
                 */
                function addDataList (data){
                    var promiseArr = [];
                    //补充产品id与名称
                    data.forEach(function (itemCode){
                        var postData = {
                            classId: "item_org",
                            action: 'search',
                            data: {sqlwhere : "item_code = '"+itemCode.item_code+"'"}
                        };
                        promiseArr.push(requestApi.post(postData)
                            .then(function (item) {
                                if(item.item_orgs.length>0){
                                    itemCode.item_id = item.item_orgs[0].item_id;
                                    itemCode.item_code = item.item_orgs[0].item_code;
                                    itemCode.item_name = item.item_orgs[0].item_name;
                                    itemCode.item_model = item.item_orgs[0].item_model;//型号
                                }else{
                                    itemCode.item_id = undefined;
                                    itemCode.item_code = undefined;
                                    itemCode.item_model = undefined;//型号
                                    itemCode.item_name = "产品编码【"+code+"】不可用";
                                }
                            }));
                    });
                    $q.all(promiseArr)
                        .then(function(){
                            data.forEach(function (newData){
                                $scope.data.currItem.epm_mp_lines.push(newData);
                            });
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_mp_lines);
                        });
                }
                /**
                 * 查看详情页
                 */
                $scope.showListData = function (month_year) {
                    if(month_year){
                        $scope.data.currItem.month_year = month_year;
                    }
                    $scope.showDetails = true;
                    $scope.serarch();
                }
                /**
                 * 计算合计数据
                 */
                function sumQty(num, args) {
                    args.data.qty_sum = numberApi.sum(args.data.qty_sum, num);
                    $scope.gridOptions.api.refreshCells({
                        rowNodes: [args.node],
                        columns: $scope.gridOptions.columnApi.getColumns(['qty_sum'])
                    });
                }

                /**
                 * 产品查询查询
                 */
                $scope.chooseItem = function (args) {
                    if (!$scope.isEdit) {
                        return;
                    }
                    $scope.gridOptions.api.stopEditing();
                    return $modal.openCommonSearch({
                        classId:'item_org',
                        gridOptions:{
                            columnDefs:[{
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
                            //是否符合要求
                            var conform = true;
                            $scope.data.currItem.epm_mp_lines.some(function(data){
                                if (data.item_code == result.item_code){
                                    swalApi.info('已存在相同编码，请检查!');
                                    conform = false;
                                    return true;
                                }
                            });
                            if(conform){
                                getItem(result.item_code,args);
                            }
                        });
                };

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
                                args.data.item_id = data.item_orgs[0].item_id;
                                args.data.item_code = data.item_orgs[0].item_code;
                                args.data.item_name = data.item_orgs[0].item_name;
                                args.data.item_model = data.item_orgs[0].item_model;//型号
                            }else{
                                args.data.item_id = undefined;
                                args.data.item_code = undefined;
                                args.data.item_name = undefined;
                                args.data.item_model = undefined;//型号
                                swalApi.info("产品编码【"+code+"】不可用");
                            }
                        })
                        .then(function () {
                            $scope.gridOptions.api.refreshCells({
                                rowNodes: [args.node],
                                columns: $scope.gridOptions.columnApi.getColumns(['item_code',
                                'item_name','item_model'])
                            });
                        });
                }

                /**
                 * 根据年月显示当月具体的天数
                 */
                function queryMumberDaysCurrentMonth(month_year){
                    var year = month_year.substr(0,4);
                    var month = month_year.substr(5);
                    var temp = new Date(year,month,0).getDate();
                    for(var i = 29; i<=31 ; i++){
                        if(temp >= i){
                            $scope.gridOptions.columnApi.setColumnsVisible(['day_'+i],true);
                        }else{
                            $scope.gridOptions.columnApi.setColumnsVisible(['day_'+i],false);
                        }
                    }
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_mp_lines);
                    $scope.isEdit = false;
                }
                /*------------------------------------------按钮方法定义------------------------------------------*/
                /**
                 * 新增行
                 */
                $scope.addMp = function(){
                    $scope.gridOptions.api.stopEditing();
                    $scope.data.currItem.epm_mp_lines.push({})
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_mp_lines);
                    $scope.gridOptions.hcApi.setFocusedCell($scope.data.currItem.epm_mp_lines.length-1);
                };

                /**
                 * 删除行
                 */
                $scope.delMp = function(){
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_mp_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_mp_lines);
                    }
                };

                /*------------------------------------------保存数据方法定义------------------------------------------*/
                /**
                 * 添加按钮
                 */
                $scope.toolButtons = {
                    inport: {
                        title: '导入',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            $scope.improtfile();
                        },
                        hide: function () {
                            return (!$scope.showDetails) || (!$scope.isEdit);
                        }
                    },
                    cancelEditor: {
                        title: '取消编辑',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            $scope.serarch && $scope.serarch();
                        },
                        hide: function () {
                            return (!$scope.showDetails) || (!$scope.isEdit);
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'iconfont hc-save',
                        click: function () {
                            $scope.save && $scope.save();
                        },
                        hide: function () {
                            return (!$scope.showDetails) || (!$scope.isEdit);
                        }
                    },
                    check: {
                        title: '审核',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            return swalApi.confirm("确定要审核吗?").then(function () {
                                return requestApi
                                    .post("epm_mp_head", "check", $scope.data.currItem)
                                    .then(function () {
                                        return swalApi.success('审核成功!');
                                    })
                                    .then($scope.serarch);
                            });
                        },
                        hide: function () {
                            return (!$scope.showDetails) || $scope.isAudit || $scope.isEdit;
                        }
                    },
                    delete: {
                        title: '删除',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            return swalApi.confirm("确定要删除数据吗?").then(function () {
                                $scope.data.currItem.epm_mp_lines = [];
                                return requestApi
                                .post("epm_mp_head", "save", $scope.data.currItem)
                                .then(function () {
                                    return swalApi.success('删除成功!');
                                })
                                .then($scope.serarch);
                            });
                        },
                        hide: function () {
                            return (!$scope.showDetails) || $scope.isAudit || $scope.isEdit;
                        }
                    },
                    compile: {
                        title: '编辑',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            $scope.isEdit = true;
                        },
                        hide: function () {
                            return (!$scope.showDetails) || $scope.isAudit || $scope.isEdit;
                        }
                    },
                    download: {
                        title: '下载导入模板',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            fileApi.downloadFile(9128);
                        },
                        hide: function () {
                            return (!$scope.showDetails) || $scope.isEdit;
                        }
                    },
                    listInventory: {
                        title: '列表清单',
                        icon: 'iconfont hc-chehui',
                        click: function () {
                            $scope.listInventory && $scope.listInventory();
                        },
                        hide: function () {
                            return (!$scope.showDetails) || $scope.isEdit;
                        }
                    }
                };

                /**
                 * 导入数据
                 */
                $scope.improtfile = function(){
                    fileApi.chooseExcelAndGetData()
                        .then(function(val){
                            /* 创建key对应对象 */
                            var mapFiled = {
                                '产品编码' : 'item_code'
                            }
                            for (var i = 1 ; i <= 31; i++) {
                                mapFiled[i+'号'] = 'day_'+i
                            }
                            /* 获取key值对象 */
                            var keyObj = Object.keys(val.rows[0]);
                            //数组,保存生成的数据
                            var dataArr = [];
                            //是否存在相同编码
                            var isExist = false;
                            //循环生成数据
                            val.rows.forEach(function (data) {
                                var dataObj = {};
                                //预计入库合计
                                var sumNum = 0;
                                keyObj.forEach(function (field){
                                    if (!isExist){
                                        if(field == '产品编码'){
                                            $scope.data.currItem.epm_mp_lines.some(function (item){
                                                if (item.item_code == data[field]){//编码相同
                                                    isExist = true;
                                                    return true;
                                                }
                                            });
                                        }
                                    }
                                    if(field != '产品编码'){//合计数量
                                        sumNum = numberApi.sum(sumNum, data[field]);
                                    }
                                    dataObj[mapFiled[field]] = data[field];
                                });
                                dataObj['qty_sum'] = sumNum;
                                if(dataObj.item_code){
                                    dataArr.push(dataObj);
                                }
                            });
                            if(isExist){
                                return swalApi
                                    .confirm("数据有存在相同编码，是否覆盖?")
                                    .then(function () {
                                        //先将需要覆盖的数据，进行过滤
                                        $scope.data.currItem.epm_mp_lines = 
                                            $scope.data.currItem.epm_mp_lines.filter(function (proj) {
                                                return dataArr.every(function (insertData) {
                                                    return insertData.item_code != proj.item_code;
                                                });
                                            });
                                        //新增数据到网格
                                        addDataList(dataArr);
                                    });
                            }else{
                                //新增数据到网格
                                addDataList(dataArr);
                            }
                        });
                };

                /**
                 * 查询列表
                 */
                $scope.listInventory = function () {
                    $scope.showDetails = false;
                    requestApi
                        .post({
                            classId: "epm_mp_head",
                            action: 'search',
                            data: {}
                        })
                        .then(function (data){
                            $scope.data.currItem.epm_mp_heads = data.epm_mp_heads;
                            $scope.gridOptionsHead.hcApi.setRowData($scope.data.currItem.epm_mp_heads);
                        })
                }

                /**
                 * 保存
                 */
                $scope.save = function () {
                    //停止编辑
                    $scope.gridOptions.api.stopEditing();
                    //定义一个数据盒子
                    var arr = [];
                    var err = [];
                    $scope.data.currItem.epm_mp_lines.forEach(function(value, index){
                        if(value.item_code == null || value.item_code == undefined || value.item_code == ""){
                            err.push(index + 1);
                        }
                    });
                    //若盒子非空，验证不通过，弹框
                    if (err.length){
                        arr.push(
                            '产品编码不能为空，以下行不合法：',
                            '第' + err.join('、') + '行'
                        );
                        return swalApi.error(arr);
                    }else {
                        //调用后台查询方法
                        return requestApi
                            .post("epm_mp_head", "save", $scope.data.currItem)
                            .then(function () {
                                return swalApi.success('保存成功!');
                            })
                            .then($scope.serarch);
                    }
                };

                /**
                 * 网格刷新
                 */
                $scope.serarch = function (){
                    $scope.gridOptions.hcApi.search();
                };

            }
        ];
        return controllerApi.controller({
            module:module,
            controller:controller
        });

    });