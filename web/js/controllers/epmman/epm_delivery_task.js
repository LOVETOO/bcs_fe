/**
 * author：zengjinhua
 * since：2020/1/9
 * Description：销售任务录入
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi', 'swalApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, requestApi, swalApi, numberApi) {

    var controller=[
        '$scope', '$q',
        function ($scope, $q){
            /**======================== 数据定义 ========================*/
            $scope.data = {};
            $scope.data.currItem = {
                /* 关联对象数组定义 */
                //列表关联对象
                epm_delivery_tasks : [],
                //签单关联对象
                epm_sign_tasks : [],
                //发货任务关联对象
                epm_delivery_task_lines : [],
                //签单任务关联对象
                epm_sign_task_lines : []
            };

            //隐藏基础控制器的按钮行
            $scope.hideToolButtons = true;

            //当前选中标签id名称
            var tabName = 'deliver';

            /*
             * 网格网格名称数组
             * 根据标签id获取
             */
            var gridOptionsName = {
                deliver : {/* 发货任务对象 */
                    arr : 'epm_delivery_task_lines',
                    grid : 'gridOptionsDeliver'
                },
                written : {/* 签单任务对象 */
                    arr : 'epm_sign_task_lines',
                    grid : 'gridOptionsWritten'
                }
            }

            //编辑删除可见参数
            $scope.showEditDel = true;

            //表格切换定义
            $scope.task_grid = {
                deliver : {
                    title: '发货任务',
                    active: true
                },
                written : {
                    title: '签单任务'
                }
            };
            
            //字段名数组
            var fields = ['table_id', 'year', 'table_name'];

            //网格可编辑规则
            var editable = function(args){
                //查看模式不可编辑
                if($scope.displayMode == "viewModel"){
                    return false;
                }
                //默认可编辑
                var edit = true;
                $scope.data.currItem[gridOptionsName[tabName].arr].some(function(value, index){
                    if(args.rowIndex != index){
                        if(args.data.row_id == value.parent_id){
                            /*
                             * 作为父节点不可编辑
                             * 合计子节点的数据进行展示
                             */
                            edit = false;
                            return true;
                        }
                    }
                });
                return edit;
            }

            //是否需要进行校验
            $scope.isSave = false;

            //编辑前的id
            $scope.table_id = 0;

            /*
             * 生成基础网格数组
             * 默认三个网格
             */
            var invOutArr = [{
                field: 'show_serial',
                headerName: '序号',
                cellStyle: {
                    'text-align': 'center'
                }
            },{
                field: 'row_name',
                headerName: '组别'
            },{
                field: 'total_task',
                headerName: '全年合计',
                type : '数量'
            }]

            /**
             * 循环生成列网格
             * 1月到12月
             */
            for (var i = 1 ; i <= 12; i++) { 
                invOutArr.push({
                    field: 'm'+i,
                    headerName: i + '月',
                    type : '数量',
                    editable: editable,
                    onCellValueChanged: function (args) {
                        if (args.newValue === args.oldValue){
                            return;
                        }
                        if(!numberApi.isNum(Number(args.newValue))){//判断输入是否是数字
                            swalApi.error("输入不是数字，请重新输入!");
                            //数据制零
                            $scope.data.currItem
                                [gridOptionsName[tabName].arr][args.node.rowIndex][args.colDef.field] = 0;
                            //出现错误，不进行保存
                            $scope.isSave = false;
                        }else if(Number(args.newValue)<0){
                            swalApi.error("数量不能小于0，请重新输入!");
                            //数据制零
                            $scope.data.currItem
                                [gridOptionsName[tabName].arr][args.node.rowIndex][args.colDef.field] = 0;
                            //出现错误，不进行保存
                            $scope.isSave = false;
                        }
                        //合计数据
                        summations(args.node, args.colDef.field);
                        if($scope.isSave){//调用保存
                            save ();
                            $scope.isSave = false;
                        }
                    }
                })
            }

            /**
             * 展示方式
             * 1.列表清单-'listing'
             * 2.新增模式-'newModel'
             * 3.查看模式-'viewModel'
             * 4.编辑模式-'editModel'
             * 默认为列表清单
             */
            $scope.displayMode = 'listing';

            /**======================== 网格定义 ========================*/
            /**
             * 定义表格"列表清单"
             */
            $scope.gridOptionsList={
                hcName : '销售任务基础',
                hcEvents: {
                    /**
                     * 双击进入查看模式
                     */
                    cellDoubleClicked : function(params){
                        $scope.displayMode = 'viewModel';
                        /**
                         * 发送请求查询双击行的年份数据
                         */
                        searchLineData(params.data.table_id, 0);
                    },
                    /**
                     * 焦点事件
                     */
                    cellFocused: function (params) {
                        if(params.rowIndex != null && $scope.displayMode == 'listing'){
                            sizeYear($scope.data.currItem.epm_delivery_tasks[params.rowIndex].year);
                        }
                    }
                },
                columnDefs:[{
                    type:'序号'
                },
                {
                    field:'year',
                    headerName:'年份',
                    type : '年'
                },
                {
                    field:'table_name',
                    headerName:'报表主题'
                },
                {
                    field:'creator',
                    headerName:'创建人'
                },
                {
                    field:'createtime',
                    headerName:'创建时间',
                    type:'time'
                },
                {
                    field:'updator',
                    headerName:'修改人'
                },
                {
                    field:'updatetime',
                    headerName:'修改时间',
                    type:'time'
                }],hcAfterRequest:function(args){
                    $scope.data.currItem.epm_delivery_tasks = args.epm_delivery_tasks
                },
                hcRequestAction:'search',
                hcDataRelationName:'epm_delivery_tasks',
				hcClassId:'epm_delivery_task'
            };

            /**
             * 定义表格"发货任务"
             */
            $scope.gridOptionsDeliver={
                hcName : '销售任务基础',
                columnDefs : invOutArr,
                hcNoPaging:true
            };

            /**
             * 定义表格"签单任务"
             */
            $scope.gridOptionsWritten={
                hcName : '销售任务基础',
                columnDefs : invOutArr,
                hcNoPaging:true
            };

            controllerApi.extend({
                controller:base_diy_page.controller,
                scope:$scope
            });

            /**======================== 数据初始化 ========================*/
            $scope.doInit = function () {
                return $q.when()
                    .then($scope.hcSuper.doInit)
                    .then(function () {
                        return {
                            classId: 'epm_delivery_task',
                            action: 'presentYearData',
                            data: {}
                        }
                    })
                    .then(requestApi.post)
                    .then(function(data){
                        /**
                         * 是否有本年的数据
                         * 存在则展示查看模式查看本年数据
                         * 不存在则不操作
                         */
                        if(data.table_id > 0){
                            //切换查看模式
                            $scope.displayMode = 'viewModel';
                            generateData(data);
                        }
                    });
            }
            /**======================== 方法定义 ========================*/
            /**
             * 网格数据合计计算
             */
            function summations(node, field){
                //行全年合计
                sunYearlyData(node);
                if(node.data.rank > 1){//不是第一级别，需要进行合计
                    //合计数据
                    var sumData = 0;
                    //级别
                    var rank = node.data.rank;
                    //父级的行下标
                    var parentIndex = 0;

                    //向下合计数据
                    $scope.data.currItem[gridOptionsName[tabName].arr].some(function(value, index){
                        if(index >= node.rowIndex){//向下计算
                            if(value.rank >= rank){//等于当前行的级别或者小于
                                if(value.rank == rank){//合计相同级别
                                    sumData = numberApi.sum(sumData, value[field]);
                                }
                            }else{
                                return true;
                            }
                        }
                    });

                    /**
                     * 向上合计数据
                     * 找到父节点的行下标
                     */
                    for(var i = numberApi.sub(node.rowIndex, 1); i > 0; i--){
                        var value = $scope.data.currItem[gridOptionsName[tabName].arr][i];
                        if(value.rank >= rank){
                            if(value.rank == rank){//合计相同级别
                                sumData = numberApi.sum(sumData, value[field]);
                            }
                        }else{
                            parentIndex = i;
                            break;
                        }
                    }

                    //合计数据设置到父节点
                    $scope.data.currItem[gridOptionsName[tabName].arr][parentIndex][field] = sumData;
                    //获取父节点的行节点
                    var parentNode = $scope[gridOptionsName[tabName].grid].hcApi.getNodeOfRowIndex(parentIndex);
                    /**
                     * 判断是否是第一级
                     * 若是：合计行的全年合计数据
                     * 若不是，递归调用网格数据合计计算方法
                     */
                    if($scope.data.currItem[gridOptionsName[tabName].arr][parentIndex].rank > 1){
                        summations(parentNode, field);
                    }else{
                        sunYearlyData(parentNode);
                    }
                }
                //将计算好的数据选择到网格
                $scope[gridOptionsName[tabName].grid].hcApi.setRowData($scope.data.currItem[gridOptionsName[tabName].arr]);
            }

            /**
             * 合计行的全年数据
             * @param {*} node 行节点
             */
            function sunYearlyData(node){
                var sumData = 0;            //合计数据
                var index = node.rowIndex;  //行下标

                //循环计算12个月份数据
                for(var i = 1; i <= 12; i++){
                    sumData = numberApi.sum(sumData, $scope.data.currItem[gridOptionsName[tabName].arr][index]["m"+i])
                }
                //设置数据
                node.data.total_task = sumData;
            }

            /**
             * 标签页改变事件
             * 记录当前选择标签id
             * @param params
             */
            $scope.ondeliveryTaskTabChange = function (params) {
                if (params.id == 'deliver') {
                    tabName = 'deliver';
                } else if (params.id == 'written') {
                    tabName = 'written';
                }
            };

            /**
             * 查询详细数据
             * condition : 查询条件
             */
            var searchLineData = function(condition){
                return requestApi.post({
                    classId: 'epm_delivery_task',
                    action: 'select',
                    data: {
                        table_id : condition
                    }
                }).then(function (data) {
                    //设置数据
                    generateData(data);
                });
            }

            /**
             * 判断年份
             * 早于所选年份，不可编辑与删除
             */
            function sizeYear(year){
                var nowYear = new Date().getFullYear();
                //早于，不可编辑删除
                if(year < nowYear){
                    $scope.showEditDel = false;
                }else{
                    $scope.showEditDel = true;
                }
            }

            /**
             * 将获取的数据生成网格与网格数据
             */
            function generateData(data){
                //赋值字段
                fields.forEach(function(field){
                    $scope.data.currItem[field] = data[field];
                });

                //判断年份
                sizeYear($scope.data.currItem.year);
                
                /* 设置数据 */
                $scope.data.currItem.epm_delivery_task_lines = data.epm_delivery_task_lines;//发货任务
                $scope.data.currItem.epm_sign_task_lines = data.epm_sign_task_lines;//签单任务

                //自动生成序号
                $scope.restructuringSerialNumber();

                //置空数据中为零的数据
                $scope.data.currItem.epm_delivery_task_lines.forEach(function(value){
                    if(Number(value.total_task) == 0){
                        value.total_task = undefined;
                    }
                    for(var i = 1; i <= 12; i++){
                        if(Number(value["m"+i]) == 0){
                            value["m"+i] = undefined;
                        }
                    }
                });
                $scope.data.currItem.epm_sign_task_lines.forEach(function(value){
                    if(Number(value.total_task) == 0){
                        value.total_task = undefined;
                    }
                    for(var i = 1; i <= 12; i++){
                        if(Number(value["m"+i]) == 0){
                            value["m"+i] = undefined;
                        }
                    }
                });

                //网格渲染展示
                $scope.gridOptionsDeliver.hcApi.setRowData($scope.data.currItem.epm_delivery_task_lines);
                $scope.gridOptionsWritten.hcApi.setRowData($scope.data.currItem.epm_sign_task_lines);
            }

            /**
             * 修改时间方法
             */
            $scope.checkYear = function(){
                //新增模式and编辑模式
                if($scope.displayMode == 'newModel' || $scope.displayMode == 'editModel'){
                    //查询数据
                    return requestApi
                        .post({
                            classId: 'epm_delivery_task',
                            action: 'checktime',
                            data: {
                                year : $scope.data.currItem.year
                            }
                        })
                        .then(function(data){
                            if(data.search_flag == 1){
                                swalApi.error(data.year+'年已录入销售任务，请返回点击列表清单查看。');
                            }else if(data.search_flag == 2){
                                swalApi.error(data.year+'年尚未完善报表基础设置，无法进行销售任务录入。');
                            }
                            //数据展示
                            generateData(data);
                        });
                }
            }

            /**
             * 重新生成序号
             */
            $scope.restructuringSerialNumber = function(){
                //发货任务
                forSerialNumber ($scope.data.currItem.epm_delivery_task_lines);
                //签单任务
                forSerialNumber ($scope.data.currItem.epm_sign_task_lines);
            }

            /**
             * 自增序号
             */
            $scope.autoIncrementSerial = function(serial){
                serial = "" + serial;
                var index = serial.lastIndexOf('.');
                var front = serial.substr(0, index);
                if(front != ""){
                    front += ".";
                }
                var behind = serial.substr(numberApi.sum(1, index));
                behind = numberApi.sum(1, behind);
                return front + "" + behind;
            }

            /**
             * 循环生成序号
             */
            function forSerialNumber (arr){
                //记录当前级别
                var rank = 1;
                //记录各级别序号
                var serial = {
                    1 : {
                        seq : 0,
                        show_serial : 0
                    }
                };
                arr.forEach(function(value){
                    if(serial[value.rank] == undefined){
                        //序号重新计算
                        serial[value.rank] = {
                            seq : 1,
                            show_serial : serial[rank].show_serial + '.1'
                        };
                    }else{
                        //序号加一
                        serial[value.rank].seq = numberApi.sum(serial[value.rank].seq, 1);
                        //展示序号自增
                        serial[value.rank].show_serial = $scope.autoIncrementSerial(serial[value.rank].show_serial);
                    }
                    if(rank == value.rank){//同级别
                        value.serial = serial[value.rank].seq;
                        value.show_serial = serial[value.rank].show_serial;
                    }else if(value.rank > rank){//下一级，子节点
                        rank = value.rank;
                        value.serial = serial[value.rank].seq;
                        value.show_serial = serial[value.rank].show_serial;
                    }else{//跳出上一级别
                        for (var i = rank;i > value.rank; i--){
                            serial[i] = undefined;
                        }
                        rank = value.rank;
                        value.serial = serial[value.rank].seq;
                        value.show_serial = serial[value.rank].show_serial;
                    }
                });
            }

            /**======================== 头部按钮 ========================*/
            /**============== 右边按钮 ==============*/
            /**
             * 保存按钮方法
             */
            $scope.topRightSave = function(){
                $scope.isSave = true;//设置为可保存
                $scope.gridOptionsDeliver.api.stopEditing();
                $scope.gridOptionsWritten.api.stopEditing();
                if($scope.isSave){
                    //保存
                    save ();
                    $scope.isSave = false;
                }
            };

            /**
             * 取消编辑方法
             */
            $scope.topRightBohui1 = function(){
                /**
                 * 清除编辑数据
                 * 1.编辑模式下返回查看模式
                 * 2.新增模式下返回列表清单
                 */
                if($scope.displayMode == 'editModel'){
                    /**
                     * 切换到查看模式
                     * 刷新数据
                     */
                    $scope.displayMode = 'viewModel';
                    searchLineData($scope.table_id);
                    //跳转发布任务
                    tabName = 'deliver';
                    $scope.taskController.setActiveTab('deliver');
                }else if($scope.displayMode == 'newModel'){
                    /* 切换 */
                    $scope.displayMode = 'listing';
                    serarch();
                }
            };

            /**
             * 删除方法
             */
            $scope.topRightDel = function(){
                /**
                 * 发送后台请求，删除指定数据
                 * 1.查看模式下，id为当前查看的数据id
                 * 2.列表清单下，id为当前指定行的数据id
                 */
                //数据id
                var id = 0;
                //获取id值
                if($scope.displayMode == 'viewModel'){
                    id = $scope.data.currItem.table_id;
                }else if($scope.displayMode == 'listing'){
                    var idx = $scope.gridOptionsList.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                        return;
                    } else {
                        id = $scope.data.currItem.epm_delivery_tasks[idx].table_id;
                    }
                }
                return swalApi.confirm("确定要删除这条数据吗?").then(function () {
                    //发送请求
                    return requestApi
                        .post({
                            classId: 'epm_delivery_task',
                            action: 'delete',
                            data: {
                                table_id : id
                            }
                        })
                        .then(function(){
                            /**
                             * 1.查看模式下返回列表清单，刷新列表清单网格
                             * 2.列表清单下刷新列表清单网格
                             */
                            if($scope.displayMode == 'viewModel'){
                                $scope.displayMode = 'listing';
                            }
                            swalApi.info('删除成功');
                            serarch();
                        });
                });
            };

            /**
             * 新增方法
             */
            $scope.topRightAdd = function(){
                /**
                 * 进入新增模式
                 * 关联对象数据清空
                 */
                $scope.displayMode = 'newModel';
                
                /* 清除数据 */
                fields.forEach(function(field){
                    $scope.data.currItem[field] = undefined;
                });
                $scope.data.currItem.epm_delivery_task_lines = [];//发货任务关联对象
                $scope.data.currItem.epm_sign_task_lines = [];//签单任务关联对象
                $scope.gridOptionsDeliver.hcApi.setRowData($scope.data.currItem.epm_delivery_task_lines);
                $scope.gridOptionsWritten.hcApi.setRowData($scope.data.currItem.epm_sign_task_lines);
                //跳转发布任务
                tabName = 'deliver';
                $scope.taskController.setActiveTab('deliver');
            };

            /**
             * 编辑方法
             */
            $scope.topRightEdit = function(){
                //进入编辑模式
                $scope.displayMode = 'editModel';
                //记录id
                $scope.table_id = $scope.data.currItem.table_id;
                /* 重新设置数据 */
                $scope.gridOptionsDeliver.hcApi.setRowData($scope.data.currItem.epm_delivery_task_lines);
                $scope.gridOptionsWritten.hcApi.setRowData($scope.data.currItem.epm_sign_task_lines);
            };

            /**
             * 列表清单方法
             */
            $scope.topRightForm = function(){
                /**
                 * 进入列表清单
                 */
                $scope.displayMode = 'listing';
                serarch();
            };

            /**======================== 按钮方法 ========================*/
            /**
             * 保存
             */
            function save () {
                /* 数据处理 */
                $scope.data.currItem.epm_delivery_tasks = [];
                $scope.data.currItem.epm_sign_tasks = [];
                if($scope.data.currItem.epm_delivery_task_lines.length > 0){
                    //调用后台保存方法
                    return requestApi.post({
                        classId: 'epm_delivery_task',
                        action: 'insert',
                        data: $scope.data.currItem
                    }).then(function (data) {
                        swalApi.success('保存成功!')
                        .then(function(){
                            /**
                             * 切换到查看模式
                             * 刷新数据
                             */
                            $scope.displayMode = 'viewModel';
                            //获取数据
                            searchLineData(data.table_id);
                            //跳转发布任务
                            tabName = 'deliver';
                            $scope.taskController.setActiveTab('deliver');
                        });
                    });
                }else{
                    swalApi.error('请先选中年份报表基础设置');
                }
            };

            /**
             * 刷新网格数据按钮函数
             */
            function serarch (){
                $scope.gridOptionsList.hcApi.search()
            };

        }
        ];

    return controllerApi.controller({
        module:module,
        controller:controller
    });

});