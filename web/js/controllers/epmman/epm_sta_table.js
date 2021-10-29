/**
 * author：zengjinhua
 * since：2020/1/3
 * Description：销售任务基础
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
                epm_sta_tables : [],
                //行关联对象：保存取值名称
                epm_sta_rows : [],
                //列关联对象:保存列名称
                epm_sta_cols : [],
                //报表值关联对象
                epm_sta_cells : [],
                //报表值编码关联对象
                epm_sta_cell_codes : [],
                //报表值取值类型关联对象
                epm_sta_cell_types : [],
                //报表值取值脚本关联对象
                epm_sta_cell_scripts : []
            };

            /**
             * 编辑数据字段名称
             * 可进行赋值与清除数据
             */
            var fields = ['table_id', 'table_name', 'year', 'delivery_task_id'];

            /**
             * 网格属性表单字段名称
             * 可进行复制与清楚数据
             */
            var typeFields = ['row_code', 'row_name', 'col_code', 'col_name',
            'col_type', 'col_script', 'cell_code', 'cell_type', 'cell_script'];

            /**
             * 模式对应网格名称
             * 可根据当前所选模式获取网格名称
             */
            var gridOptionsName = {
                listing : 'gridOptionsList',
                newModel : 'gridOptionsNew',
                viewModel : 'gridOptionsView',
                editModel : 'gridOptionsEdit'
            };

            /**
             * 网格列名缓存数组
             * 顺序同步网格列顺序
             */
            var colNameArr = [];

            /**
             * 网格字段名缓存数组
             * 顺序同步网格列顺序
             */
            var colFieldArr = [];

            /**
             * 网格属性列缓存
             * 格式:
             * {
             *     列field : {
             *         col_code : xxx,
             *         col_name : xxx,
             *         col_type : xxx,
             *         col_script : xxx
             *     }
             * }
             */
            var colType = {};

            /**
             * 网格数据单元格缓存
             * 格式:
             * {
             *     行field : {
             *         列field : {
             *             cell_code : xxx,
             *             cell_type : xxx,
             *             cell_script : xxx
             *         }
             *     }
             * }
             */
            var cellType = {};

            //列网格名称自增
            var colIndexName = 0;
            //行序号下标自增
            var rowIndexSeq = 0;

            //网格可编辑规则
            var editable = function(){
                if($scope.displayMode == "viewModel"){
                    return false;
                }else{
                    return true;
                }
            }
            
            //编辑前的id
            $scope.table_id = 0;
            //编辑前的年份
            $scope.year = 0;

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
                        //清除数据
                        clear();
                        /**
                         * 发送请求查询双击行的年份数据
                         */
                        searchLineData(params.data.table_id, 0);
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
                    $scope.data.currItem.epm_sta_tables = args.epm_sta_tables
                },
                hcRequestAction:'search',
                hcDataRelationName:'epm_sta_tables',
				hcClassId:'epm_sta_table'
            };

            /**
             * 定义表格"新增模式"
             */
            $scope.gridOptionsNew={
                hcName : '销售任务基础',
                columnDefs:[],
                hcEvents: {
                    /**
                     * 焦点事件
                     */
                    cellFocused: function (params) {
                        getFocus(params);
                    }
                },
                hcNoPaging:true
            };

            /**
             * 定义表格"查看模式"
             */
            $scope.gridOptionsView={
                hcName : '销售任务基础',
                columnDefs:[],
                hcEvents: {
                    /**
                     * 焦点事件
                     */
                    cellFocused: function (params) {
                        getFocus(params);
                    }
                },
                hcNoPaging:true
            };

            /**
             * 定义表格"编辑模式"
             */
            $scope.gridOptionsEdit={
                hcName : '销售任务基础',
                columnDefs:[],
                hcEvents: {
                    /**
                     * 焦点事件
                     */
                    cellFocused: function (params) {
                        getFocus(params);
                    }
                },
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
                            classId: 'epm_sta_table',
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
             * 网格焦点设置网格属性表单数据
             * @param {*} params 
             */
            function getFocus (params){
                if(params.rowIndex == null){
                    //清除表单数据
                    typeFields.forEach(function(typeField){
                        $scope.data.currItem[typeField] = undefined;
                    });
                    return;
                }
                //点击序号列 不进行展示
                if(params.column.colDef.field == 'show_serial'){
                    //清除表单数据
                    typeFields.forEach(function(typeField){
                        $scope.data.currItem[typeField] = undefined;
                    });
                    return;
                }
                //点击组别 只展示列名称
                if(params.column.colDef.field == 'row_name'){
                    //清除表单数据
                    typeFields.forEach(function(typeField){
                        $scope.data.currItem[typeField] = undefined;
                    });
                    //赋值行属性数据
                    $scope.data.currItem.row_code = $scope.data.currItem.epm_sta_cells[params.rowIndex].row_code;
                    $scope.data.currItem.row_name = $scope.data.currItem.epm_sta_cells[params.rowIndex].row_name;
                    return;
                }
                //赋值行属性数据
                $scope.data.currItem.row_code = $scope.data.currItem.epm_sta_cells[params.rowIndex].row_code;
                $scope.data.currItem.row_name = $scope.data.currItem.epm_sta_cells[params.rowIndex].row_name;

                //赋值列网格数据
                var field = params.column.colDef.field;
                //列编码、列名称、列取值器类型、列取值脚本
                ['col_code', 'col_name', 'col_type', 'col_script'].forEach(function(colField){
                    $scope.data.currItem[colField] = colType[field][colField];
                });

                //单元格属性数据赋值
                var rowField = $scope.data.currItem.epm_sta_cells[params.rowIndex].row_seq;
                ['cell_code', 'cell_type', 'cell_script'].forEach(function(cellName){
                    $scope.data.currItem[cellName] = cellType[rowField][field][cellName];
                });
            }

            /**
             * 值改变，同步更新网格数组数据
             */
            $scope.formLoseFocus = function(field){
                //获取网格焦点
                var focus = $scope[gridOptionsName[$scope.displayMode]].api.getFocusedCell();
                //未选中
                if(focus == null){
                    swalApi.info("请选择要编辑的网格")
                    .then(function(){
                        $scope.data.currItem[field] = undefined;
                    });
                    return;
                }
                //序号列不可编辑
                if(focus.column.colDef.field == "show_serial"){
                    swalApi.info("该列不可编辑网格属性")
                        .then(function(){
                            $scope.data.currItem[field] = undefined;
                        });
                    return;
                }
                var rowArr = ['row_code', 'row_name'];
                //是否存在行属性
                if(rowArr.indexOf(field) > -1){
                    $scope.data.currItem.epm_sta_cells[focus.rowIndex][field] = $scope.data.currItem[field];
                    //渲染
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                    return;
                }
                //组别列不可编辑单元格与列属性
                if(focus.column.colDef.field == "row_name"){
                    swalApi.info("该列不可编辑网格属性")
                    .then(function(){
                        $scope.data.currItem[field] = undefined;
                    });
                    return;
                }
                var colArr = ['col_code', 'col_name', 'col_type', 'col_script'];
                var cellArr = ['cell_code', 'cell_type', 'cell_script'];
                //列属性编辑
                if(colArr.indexOf(field) > -1){
                    colType[focus.column.colDef.field][field] = $scope.data.currItem[field];
                    //修改列名称
                    if(field == 'col_name'){
                        //获取网格数组
                        var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                        //行下标
                        var row = focus.rowIndex;
                        //列下标
                        var col;
                        //查询缓存名称
                        colFieldArr.some(function(colField, index){
                            if(colField == focus.column.colDef.field){
                                col = index;
                                return true;
                            }
                        });
                        /**
                         * 缓存名称进行修改
                         */
                        colNameArr[col] = $scope.data.currItem[field];
    
                        /**
                         * 网格列名修改
                         */
                        colDefArr[col].headerName = $scope.data.currItem[field];
    
                        //网格数组放入网格进行渲染
                        $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);
    
                        //设置单元格焦点
                        $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(row, focus.column.colDef.field);
                    }
                }else if(cellArr.indexOf(field) > -1){
                    //修改的单元格属性进行缓存
                    cellType[$scope.data.currItem.epm_sta_cells[focus.rowIndex].row_seq]
                        [focus.column.colDef.field][field] = $scope.data.currItem[field];
                }
            }

            /**
             * 查询详细数据
             * queryMode : 0-通用查询模式   1-根据日期查询
             * condition : 查询条件
             */
            var searchLineData = function(condition, queryMode){
                //条件
                var dataProj = {
                    0 : {/* 通用查询 */
                        table_id : condition
                    },
                    1 : {/* 根据年份查询 */
                        year : condition,
                        search_flag : 1
                    }
                }
                return requestApi.post({
                    classId: 'epm_sta_table',
                    action: 'select',
                    data: dataProj[queryMode]
                }).then(function (data) {
                    generateData(data);
                });
            }

            /**
             * 将获取的数据生成网格与网格数据
             */
            function generateData(data){
                fields.forEach(function(field){
                    $scope.data.currItem[field] = data[field];
                });
                //获取网格数组
                var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                //生成默认两列
                colDefArr = $scope.createdDfaultCol(colDefArr);
                //列下标
                colIndexName = 1;
                /**
                 * 生成列数据
                 * epm_sta_cols数组返回
                 * [0] ： Key-列id,Value-列序号
                 * [1] ： Key-列序号,Value-列名称
                 * [2] ： Key-'length',Value-行数
                 * [3] ： Key-列序号,Value-列编码
                 * [4] ： Key-列序号,Value-列取值类型
                 * [5] ： Key-列序号,Value-列取值脚本
                 */
                for(var i = 1; i <= data.epm_sta_cols[2].length; i++){
                    colIndexName++;//下标自增
                    colNameArr[colIndexName] = data.epm_sta_cols[1][i];//缓存列名称
                    colFieldArr[colIndexName] = i + "";//缓存列字段
                    //列网格属性
                    colType[i] = {
                        col_code : data.epm_sta_cols[3][i],
                        col_name : data.epm_sta_cols[1][i],
                        col_type : data.epm_sta_cols[4][i],
                        col_script : data.epm_sta_cols[5][i]
                    }
                    colDefArr.push({//网格数组加入列
                        headerName : colNameArr[colIndexName],
                        field : colFieldArr[colIndexName],
                        editable : editable
                    });
                }
                /**
                 * 生成单元格属性数据
                 * epm_sta_cell_codes       单元格编码数组
                 * epm_sta_cell_types       单元格取值类型数组
                 * epm_sta_cell_scripts     单元格取值脚本类型
                 * 对象数据顺序根据行顺序进行存储
                 * 每个对象根据列数下标存储
                 */
                var index = 0;
                //循环次数：行数
                for(var i = 1; i <= data.epm_sta_cell_codes.length; i++){
                    //循环次数：列数
                    for(var j = 1; j <= data.epm_sta_cols[2].length; j++){
                        if(cellType[i] == undefined){
                            cellType[i] = {};
                        }
                        cellType[i][j] = {
                            cell_code : data.epm_sta_cell_codes[index][j],
                            cell_type : data.epm_sta_cell_types[index][j],
                            cell_script : data.epm_sta_cell_scripts[index][j]
                        }
                    }
                    index++;
                }
                
                //网格数组放入网格进行渲染
                $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);

                /* 设置数据 */
                $scope.data.currItem.epm_sta_cells = data.epm_sta_rows;
                rowIndexSeq = data.epm_sta_rows.length;

                //重新生成序号
                $scope.restructuringSerialNumber();
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);

                //设置单元格
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(0, "show_serial");
            }

            /**
             * 清除对应数据
             */
            function clear(){
                colNameArr = [];//网格列名缓存数组
                colFieldArr = [];//网格字段名缓存数组
                colIndexName = 0;//列网格名称自增
                rowIndexSeq = 0;//行下标序号自增
                colType = {};//网格属性列缓存
                cellType = {};//网格数据单元格缓存
                $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs([]);//网格初始化
                $scope.data.currItem.epm_sta_cells = [];//值对象
                $scope.data.currItem.epm_sta_cols = [];//列对象
                $scope.data.currItem.epm_sta_rows = [];//行对象对象
                $scope.data.currItem.epm_sta_cell_codes = [];//报表值编码关联对象
                $scope.data.currItem.epm_sta_cell_types = [];//报表值取值类型关联对象
                $scope.data.currItem.epm_sta_cell_scripts = [];//报表值取值脚本关联对象
                fields.forEach(function(field){
                    $scope.data.currItem[field] = undefined;
                });
            }

            /**
             * 修改时间方法
             */
            $scope.checkYear = function(){
                //新增模式and编辑模式
                if($scope.displayMode == 'newModel' || $scope.displayMode == 'editModel'){
                    //查询所选年份是否已编制报表设置
                    return requestApi
                        .post({
                            classId: 'epm_sta_table',
                            action: 'checktime',
                            data: {
                                year : $scope.data.currItem.year
                            }
                        })
                        .then(function(data){
                            if(data.search_flag == 1){
                                swalApi.error(data.year+'年已编制报表设置，请返回点击列表清单查看。');
                                if($scope.displayMode == 'newModel'){
                                    $scope.data.currItem.year = undefined;
                                }else{
                                    $scope.data.currItem.year = $scope.year;
                                }
                            }else{
                                $scope.year = $scope.data.currItem.year;
                            }
                        });
                }
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
             * 重新生成序号
             */
            $scope.restructuringSerialNumber = function(){
                //记录当前级别
                var rank = 1;
                //记录各级别序号
                var serial = {
                    1 : {
                        seq : 0,
                        show_serial : 0
                    }
                };
                $scope.data.currItem.epm_sta_cells.forEach(function(value){
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

            /**
             * 生成默认两列数据
             */
            $scope.createdDfaultCol = function(arr){
                arr.push({
                    field: 'show_serial',
                    headerName: '序号',
                    cellStyle: {
                        'text-align': 'center'
                    },
                    suppressAutoSize: true,
                    suppressSizeToFit: true,
                    width : 80
                },{
                    field: 'row_name',
                    headerName: '组别',
                    editable : editable
                });
                colNameArr.push('show_serial', 'row_name');
                colFieldArr.push('show_serial', 'row_name');
                return arr;
            }

            /**======================== 头部按钮 ========================*/
            /**============== 左边按钮 ==============*/
            /**======== 操作行方法 ========*/
            /**
             * 新增行
             */
            $scope.addLine = function(){
                /* 停止编辑 */
                $scope[gridOptionsName[$scope.displayMode]].api.stopEditing();
                /* 获取当前光标指向行下标 */
                var idx = $scope[gridOptionsName[$scope.displayMode]].hcApi.getFocusedRowIndex();
                //插入的下标
                var insertIndex = 0;
                /* 判断是否没有数据 */
                if(idx < 0){
                    /* 判断是否生成网格列 */
                    var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                    if(colDefArr.length <= 0){
                        //未生成
                        //网格新增两列
                        colDefArr = $scope.createdDfaultCol(colDefArr);
                        //网格数组放入网格进行渲染
                        $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);
                    }
                    //行下标序号自增
                    rowIndexSeq++;
                    $scope.data.currItem.epm_sta_cells.push({
                        rank : 1,/* 级别 */
                        serial : 1,/* 序号 */
                        show_serial : '1',
                        row_seq : rowIndexSeq
                    });
                }else{
                    //指向行的级别
                    var rank = $scope.data.currItem.epm_sta_cells[idx].rank;
                    //当前级别最后的行数据
                    var data = {};
                    //获取插入下标
                    $scope.data.currItem.epm_sta_cells.some(function(value, index){
                        //从光标指向开始获取
                        if(index >= idx){
                            //子节点跳过
                            if(rank <= value.rank){
                                //获取同级别最后一行数据
                                if(value.rank == rank){
                                    data = value;
                                }
                                //最后一行的下一个下标为插入的下标
                                insertIndex = numberApi.sum(1, index);
                            }else{
                                return true;
                            }
                        }
                    });
                    //行下标序号自增
                    rowIndexSeq++;
                    //行数据
                    var proj = {
                        rank : data.rank,/* 相同级别 */
                        serial : numberApi.sum(1, data.serial),/* 序号加一 */
                        show_serial : $scope.autoIncrementSerial(data.show_serial),/* 自增序号 */
                        row_seq : rowIndexSeq /* 自增行序号 */
                    }
                    //插入到数组 
                    $scope.data.currItem.epm_sta_cells.splice(insertIndex, 0, proj);
                }
                //生成一行数据，缓存当前行关于列的一组单元格属性
                cellType[rowIndexSeq] = {};//定义数据
                colFieldArr.forEach(function(field, index){
                    if(index >= 2){//从下标为2开始
                        cellType[rowIndexSeq][field] = {};
                    }
                });
                //渲染
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(insertIndex);
            };

            /**
             * 新增子节点
             */
            $scope.childNode = function(){
                /* 停止编辑 */
                $scope[gridOptionsName[$scope.displayMode]].api.stopEditing();
                /* 获取当前光标指向行下标 */
                var idx = $scope[gridOptionsName[$scope.displayMode]].hcApi.getFocusedRowIndex();
                if(idx < 0){
                    swalApi.info('请选中需要新增子节点的父节点');
                }else{
                    //父节点数据
                    var data = $scope.data.currItem.epm_sta_cells[idx];
                    /*
                     * 判断是否存在子节点
                     * 默认存在
                     */
                    var existChildNode = true;
                    if(numberApi.sub($scope.data.currItem.epm_sta_cells.length, 1) == idx){
                        /*
                         * 最后一行
                         * 没有子节点
                         */
                        existChildNode = false;
                    }else{
                        //下一行数据
                        var nextData = $scope.data.currItem.epm_sta_cells[numberApi.sum(1, idx)];
                        if(nextData == undefined){
                            //没有下一行
                            existChildNode = false;
                        }else if(numberApi.sum(data.rank, 1) != nextData.rank){
                            /*
                             * 下一行不是子节点
                             * 没有子节点
                             */
                            existChildNode = false;
                        }
                    }
                    //插入的下标
                    var insertIndex = 0;
                    var serial = 0;
                    //是否存在子节点
                    if(existChildNode){
                        /**
                         * 若存在子节点，则
                         * 找到与父节点相同级别的节点下标，进行插入
                         */
                        $scope.data.currItem.epm_sta_cells.some(function(value, index){
                            //从光标指向开始获取
                            if(index > idx){
                                //获取节点下标
                                if(value.rank <= data.rank){
                                    return true;
                                }else{
                                    insertIndex = index;
                                    serial = value.serial; 
                                }
                            }
                        });
                        insertIndex =  numberApi.sum(insertIndex, 1);
                        serial = numberApi.sum(serial, 1); 
                    }else{
                        //不存在子节点
                        insertIndex = numberApi.sum(1, idx);
                        serial = 1;
                    }
                    //行下标序号自增
                    rowIndexSeq++;
                    //行数据
                    var proj = {
                        rank : numberApi.sum(data.rank, 1),/* 下一级别级别 */
                        serial : serial,/* 序号 */
                        show_serial : data.show_serial + '.' + serial,/* 下一级别 */
                        row_seq : rowIndexSeq
                    }
                    //生成一行数据，缓存当前行关于列的一组单元格属性
                    cellType[rowIndexSeq] = {};//定义数据
                    colFieldArr.forEach(function(field, index){
                        if(index >= 2){//从下标为2开始
                            cellType[rowIndexSeq][field] = {};
                        }
                    });
                    //插入数组
                    $scope.data.currItem.epm_sta_cells.splice(insertIndex, 0, proj);
                    //渲染
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(insertIndex);
                }
            }

            /**
             * 删除行
             */
            $scope.delLine = function(){
                var idx = $scope[gridOptionsName[$scope.displayMode]].hcApi.getFocusedRowIndex();
                if (idx < 0) {
                    swalApi.info('请选中要删除的行');
                } else {
                    /* 首先判断是否被引用 */
                    if($scope.data.currItem.epm_sta_cells[idx].delivery_task_line_id > 0){
                        swalApi.error('此行已经生成了销售任务录入数据，不允许删除');
                        return;
                    }

                    //删除的行数
                    var lineNumber = 1;
                    //光标所指向的行
                    var data = $scope.data.currItem.epm_sta_cells[idx];
                    $scope.data.currItem.epm_sta_cells.some(function(value, index){
                        //从光标指向开始获取
                        if(index > idx){
                            //获取节点下标
                            if(value.rank <= data.rank){
                                return true;
                            }else{
                                lineNumber++;
                            }
                        }
                    });
                    //删除相关数据
                    $scope.data.currItem.epm_sta_cells.splice(idx, lineNumber);
                    //重新生成序号
                    $scope.restructuringSerialNumber();
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                }
            };

            /**
             * 上移方法
             * upTop : 是否置顶
             */
            function moveTheWay(upTop){
                var idx = $scope[gridOptionsName[$scope.displayMode]].hcApi.getFocusedRowIndex();
                if(idx < 0){
                    swalApi.info('请选中要上移的行');
                }else{
                    if(idx == 0){
                        swalApi.info('该行已置顶');
                        return;
                    }
                    //光标所指向的行
                    var data = $scope.data.currItem.epm_sta_cells[idx];
                    if(data.rank > $scope.data.currItem.epm_sta_cells[idx - 1].rank){//上一行是上一级别的数据
                        swalApi.info('同一级别中，已置顶');
                        return;
                    }
                    //上移的行数
                    var lineNumber = 1;
                    $scope.data.currItem.epm_sta_cells.some(function(value, index){
                        //从光标指向开始获取
                        if(index > idx){
                            //获取节点下标
                            if(value.rank <= data.rank){
                                return true;
                            }else{
                                lineNumber++;
                            }
                        }
                    });
                    //上移数据插入的位置
                    var subscript;
                    //是否置顶
                    if(upTop){
                        /* 获取 */
                        for (var i = (idx - 1);i >= 0;i--){
                            var value = $scope.data.currItem.epm_sta_cells[i];
                            if(value.rank < data.rank){
                                break;
                            }
                            subscript = i;
                        }
                    }else{
                        /* 获取 */
                        for (var i = (idx - 1);i >= 0;i--){
                            var value = $scope.data.currItem.epm_sta_cells[i];
                            subscript = i;
                            if(value.rank <= data.rank){
                                break;
                            }
                        }
                    }
                    //上移的数据
                    var arr = $scope.data.currItem.epm_sta_cells.splice(idx, lineNumber);
                    //上移
                    $scope.data.currItem.epm_sta_cells.splice(subscript,0,...arr);
                    //重新生成序号
                    $scope.restructuringSerialNumber();
                    //数据渲染
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                    //设置网格行焦点
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(subscript);
                }
            }
            
            /**
             * 上移
             */
            $scope.moveUp = function(){
                moveTheWay(false);
            };
            
            /**
             * 置顶
             */
            $scope.stick = function(){
                moveTheWay(true);
            };

            /**
             * 下移方法
             * downBottom : 是否置底
             */
            function DownTheWay(downBottom){
                var idx = $scope[gridOptionsName[$scope.displayMode]].hcApi.getFocusedRowIndex();
                if(idx < 0){
                    swalApi.info('请选中要下移的行');
                }else if(idx==($scope.data.currItem.epm_sta_cells.length-1)){
                    swalApi.info('该行已置底');
                }else{
                    //光标所指向的行
                    var data = $scope.data.currItem.epm_sta_cells[idx];
                    /**
                     * 判断是否是同级别中最下一行
                     * 默认不是
                     */
                    var isFoot = false;
                    //下移的行数
                    var lineNumber = 1;
                    $scope.data.currItem.epm_sta_cells.some(function(value, index){
                        //从光标指向开始获取
                        if(index > idx){
                            /**
                             * 获取节点数
                             * 级别小于当前行级别的数据
                             * 属于子节点数据
                             */
                            if(value.rank > data.rank){
                                lineNumber++;
                                //判断是否在所有数据的下面
                                if(index == $scope.data.currItem.epm_sta_cells.length - 1){
                                    isFoot = true;
                                }
                            }else if(value.rank < data.rank){
                                isFoot = true;
                                return true;
                            }else{
                                return true;
                            }
                        }
                    });
                    if(isFoot){
                        swalApi.info('同一级别中，已置底');
                        return;
                    }
                    //下移的数据
                    var arr = $scope.data.currItem.epm_sta_cells.splice(idx, lineNumber);

                    //下移数据插入的位置
                    var subscript;
                    if(downBottom){
                        subscript = idx + 1;
                        $scope.data.currItem.epm_sta_cells.some(function(value, index){
                            //从光标指向开始获取
                            if(index > idx){
                                /**
                                 * 获取节点数
                                 * 只有级别等于当前行级别与大于当前行级别
                                 * 才属于不属于当前行的子节点
                                 */
                                if(value.rank >= data.rank){
                                    subscript++;
                                }else{
                                    return true;
                                }
                            }
                        });
                    }else{
                        subscript = idx + 1;
                        $scope.data.currItem.epm_sta_cells.some(function(value, index){
                            //从光标指向开始获取
                            if(index > idx){
                                /**
                                 * 获取节点数
                                 * 只有级别等于当前行级别与大于当前行级别
                                 * 才属于不属于当前行的子节点
                                 */
                                if(value.rank > data.rank){
                                    subscript++;
                                }else{
                                    return true;
                                }
                            }
                        });
                    }
                    //下移
                    $scope.data.currItem.epm_sta_cells.splice(subscript, 0,...arr);

                    //重新生成序号
                    $scope.restructuringSerialNumber();
                    //数据渲染
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                    //设置网格焦点
                    $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(subscript);
                }
            }
            /**
             * 下移
             */
            $scope.shiftDown = function(){
                DownTheWay(false)
            };


            /**
             * 置底
             */
            $scope.rear = function(){
                DownTheWay(true)
            };

            /**======== 操作列方法 ========*/
            /**
             * 新增列
             */
            $scope.addCol = function(){
                /* 停止编辑 */
                $scope[gridOptionsName[$scope.displayMode]].api.stopEditing();
                //打开编辑列名模态框
                swalApi.input('请输入列名')
                    .then(function(colName){
                        if(colName == "" || colName == undefined || colName == null){
                            swalApi.error('添加失败，列名不能为空');
                        }else{
                            //记录当前焦点选中的行数
                            var idx = $scope[gridOptionsName[$scope.displayMode]].hcApi.getFocusedRowIndex();
                            if(idx < 0){
                                idx = 0;
                            }
                            //获取网格数组
                            var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                            if(colDefArr.length <= 0){
                                //未生成
                                colDefArr = $scope.createdDfaultCol(colDefArr);
                            }
                            //自增列名称,防止重复
                            colIndexName++;
                            colDefArr.push({
                                headerName : colName,
                                field : colIndexName + "",
                                editable : editable
                            });
                            //名称进行缓存
                            colNameArr.push(colName);
                            //字段名缓存
                            colFieldArr.push(colIndexName + "");
                            //网格列属性缓存
                            colType[colIndexName] = {
                                col_name : colName
                            }
                            //网格单元格属性缓存
                            $scope.data.currItem.epm_sta_cells.forEach(function(value){
                                cellType[value.row_seq][colIndexName] = {};

                            });
                            //网格数组放入网格进行渲染
                            $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);
                            //设置选中单元格
                            $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(idx, colIndexName + "");
                        }
                    });
                
            };

            /**
             * 操作前的校验,判断网格数组选中的焦点是否可以进行操作
             */
            function operationBeforeVerify (ation, arr, focus){
                //是否不可以操作
                var notOperation = false;

                if(arr.length <= 0){
                    swalApi.error('没有可以' + ation + '的列');
                    notOperation = true;
                }else{
                    //获取网格焦点名称
                    var field = focus.column.colId;
                    if(field == "row_name" || field == "show_serial"){
                        swalApi.error('所选列不能进行' + ation);
                        notOperation = true;
                    }
                }

                return notOperation;
            }

            /**
             * 删除列
             */
            $scope.delCol = function(){
                //获取网格数组
                var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                //获取网格焦点
                var focus = $scope[gridOptionsName[$scope.displayMode]].api.getFocusedCell();
                /**
                 * 操作前的校验,判断网格数组选中的焦点是否可以进行操作
                 * return : false-不可进行操作  true-可以操作
                 */
                if (operationBeforeVerify('删除', colDefArr, focus)){
                    return;
                };
                
                //行下标
                var row = focus.rowIndex;
                //列下标
                var col;
                //获取网格焦点名称
                var field = focus.column.colId;

                //查询缓存字段
                colFieldArr.some(function(colFiled, index){
                    if(colFiled == field){
                        col = index;
                        return true;
                    }
                });
                //前一列的名称
                var prior = colFieldArr[col - 1];

                //删除删除列
                colDefArr.splice(col, 1);
                //网格数组放入网格进行渲染
                $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);

                //删除列的缓存字段名
                colNameArr.splice(col, 1);
                //删除列的缓存名称
                colFieldArr.splice(col, 1);

                //设置单元格焦点
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(row, prior);
            };

            /**
             * 左移方法
             * farLeft : 是否移动最左边
             */
            function leftShift (farLeft){
                //获取网格数组
                var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                //获取网格焦点
                var focus = $scope[gridOptionsName[$scope.displayMode]].api.getFocusedCell();
                /**
                 * 操作前的校验,判断网格数组选中的焦点是否可以进行操作
                 * return : false-不可进行操作  true-可以操作
                 */
                if (operationBeforeVerify('移动', colDefArr, focus)){
                    return;
                };

                //行下标
                var row = focus.rowIndex;
                //列下标
                var col;
                //网格名称
                var field = focus.column.colId;
                //查询缓存名称
                colFieldArr.some(function(colField, index){
                    if(colField == field){
                        col = index;
                        return true;
                    }
                });
                //除开默认列，已经在最左边
                if(col == 2){
                    swalApi.error('该列已经在最左边');
                    return;
                }

                /**
                 * 缓存字段名进行左移
                 */
                var colField = colFieldArr.splice(col,1);
                colFieldArr.splice(farLeft ?2 : col-1, 0, colField[0]);
                /**
                 * 缓存名称进行左移
                 */
                var colName = colNameArr.splice(col,1);
                colNameArr.splice(farLeft ?2 : col-1, 0, colName[0]);

                /**
                 * 网格左移
                 */
                var proj = colDefArr.splice(col,1);
                colDefArr.splice(farLeft ?2 : col-1, 0, proj[0]);

                //网格数组放入网格进行渲染
                $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);

                //设置单元格焦点
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(row, field);
            }

            /**
             * 左移一格
             */
            $scope.moveUpCol = function(){
                leftShift(false);
            };

            /**
             * 置左
             */
            $scope.stickCol = function(){
                leftShift(true);
            };

            /**
             * 右移方法
             * farRight ： 是否移动最右边
             */
            function rightShift (farRight){
                //获取网格数组
                var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                //获取网格焦点
                var focus = $scope[gridOptionsName[$scope.displayMode]].api.getFocusedCell();
                /**
                 * 操作前的校验,判断网格数组选中的焦点是否可以进行操作
                 * return : false-不可进行操作  true-可以操作
                 */
                if (operationBeforeVerify('移动', colDefArr, focus)){
                    return;
                };

                //行下标
                var row = focus.rowIndex;
                //列下标
                var col;
                //网格名称
                var field = focus.column.colId;
                //查询缓存名称
                colFieldArr.some(function(colField, index){
                    if(colField == field){
                        col = index;
                        return true;
                    }
                });
                //除开默认列，已经在最右边
                if(col == (colFieldArr.length - 1)){
                    swalApi.error('该列已经在最右边');
                    return;
                }

                /**
                 * 缓存名称进行右移
                 */
                var colField = colFieldArr.splice(col,1);
                colFieldArr.splice(farRight ? colFieldArr.length : col+1, 0, colField[0]);
                /**
                 * 缓存名称进行右移
                 */
                var colName = colNameArr.splice(col,1);
                colNameArr.splice(farRight ? colNameArr.length : col+1, 0, colName[0]);

                /**
                 * 网格右移
                 */
                var proj = colDefArr.splice(col,1);
                colDefArr.splice(farRight ? colDefArr.length : col+1, 0, proj[0]);

                //网格数组放入网格进行渲染
                $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);

                //设置单元格焦点
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(row, field);
            };

            /**
             * 右移一格
             */
            $scope.shiftDownCol = function(){
                rightShift(false);
            }

            /**
             * 置右
             */
            $scope.rearCol = function(){
                rightShift(true);
            };

            /**
             * 编辑列
             */
            $scope.editCol = function(){
                /* 停止编辑 */
                $scope[gridOptionsName[$scope.displayMode]].api.stopEditing();
                //获取网格数组
                var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                //获取网格焦点
                var focus = $scope[gridOptionsName[$scope.displayMode]].api.getFocusedCell();
                /**
                 * 操作前的校验,判断网格数组选中的焦点是否可以进行操作
                 * return : false-不可进行操作  true-可以操作
                 */
                if (operationBeforeVerify('编辑', colDefArr, focus)){
                    return;
                };
                //打开编辑列名模态框
                swalApi.input('请输入列名')
                    .then(function(colName){
                        if(colName == "" || colName == undefined || colName == null){
                            swalApi.error('修改失败，列名不能为空');
                        }else{
                            //行下标
                            var row = focus.rowIndex;
                            //列下标
                            var col;
                            //网格名称
                            var field = focus.column.colId;
                            //查询缓存名称
                            colFieldArr.some(function(colField, index){
                                if(colField == field){
                                    col = index;
                                    return true;
                                }
                            });
                            /**
                             * 缓存名称进行修改
                             */
                            colNameArr[col] = colName;

                            /**
                             * 网格列名修改
                             */
                            colDefArr[col].headerName = colName;

                            //网格列属性缓存
                            colType[colFieldArr[col]].col_name = colName;

                            //网格数组放入网格进行渲染
                            $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);

                            //设置单元格焦点
                            $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(row, field);
                        }
                        
                    });
            }

            /**============== 右边按钮 ==============*/
            /**
             * 保存按钮方法
             */
            $scope.topRightSave = function(){
                /**
                 * 校验数据
                 * 将数据保存进数据库
                 */
                save();
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
                    //清除数据
                    clear();
                    //获取数据
                    searchLineData($scope.table_id, 0);
                }else if($scope.displayMode == 'newModel'){
                    /* 清除数据 */
                    clear();
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
                        id = $scope.data.currItem.epm_sta_tables[idx].table_id;
                    }
                }
                return swalApi.confirm("确定要删除这条数据吗?").then(function () {
                    //发送请求
                    return requestApi
                        .post({
                            classId: 'epm_sta_table',
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
                clear();

                fields.forEach(function(field){
                    $scope.data.currItem[field] = undefined;
                });
            };

            /**
             * 编辑方法
             */
            $scope.topRightEdit = function(){
                //获取网格数组
                var colDefArr = $scope[gridOptionsName[$scope.displayMode]].columnApi.getAllColumns().map(proj=>proj.colDef);
                
                //进入编辑模式
                $scope.displayMode = 'editModel';

                //记录id
                $scope.table_id = $scope.data.currItem.table_id;
                //记录年份
                $scope.year = $scope.data.currItem.year;

                /* 处理数据 */
                //网格数组放入网格进行渲染
                $scope[gridOptionsName[$scope.displayMode]].api.setColumnDefs(colDefArr);

                //数据渲染
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setRowData($scope.data.currItem.epm_sta_cells);

                //设置单元格焦点
                $scope[gridOptionsName[$scope.displayMode]].hcApi.setFocusedCell(0, "show_serial");
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
                //网格停止编辑
                $scope[gridOptionsName[$scope.displayMode]].api.stopEditing();
                
                var errorArr = [];//错误信息盒子

                /* 校验数据必填 */
                if($scope.data.currItem.year == undefined
                    || $scope.data.currItem.year == ""
                    || $scope.data.currItem.year == null
                    || $scope.data.currItem.year == 0){
                    errorArr.push("年份不能为空");
                }
                if($scope.data.currItem.table_name == undefined
                    || $scope.data.currItem.table_name == ""
                    || $scope.data.currItem.table_name == null){
                    errorArr.push("报表主题不能为空");
                }

                /* 关联对象数据校验 */
                if($scope.data.currItem.epm_sta_cells.length == 0){
                    errorArr.push('未维护行数据');
                }
                //行标题错误
                var rowErrorArr = [];
                $scope.data.currItem.epm_sta_cells.forEach(function(value, index){
                    if(value.row_name == undefined 
                        || value.row_name == null
                        || value.row_name == ""){
                        rowErrorArr.push(index +1);
                    }
                });
                
                /**
                 * 行标题没有维护
                 */
                if(rowErrorArr.length){
                    errorArr.push(
                        '',
                        '行标题需要维护，以下行不合法：',
                        '第' + rowErrorArr.join('、') + '行'
                    );
                }

                /**
                 * 是否维护列标题
                 */
                if((colFieldArr.length - 2) <= 0){
                    errorArr.push('至少维护一个列标题');
                }

                /**
                 * 存在错误不能保存
                 */
                if(errorArr.length){
                    swalApi.error(errorArr);
                    return;
                }

                /**
                 * 数据处理
                 * 过滤未填写行名称数据
                 */
                $scope.data.currItem.epm_sta_cells = 
                    $scope.data.currItem.epm_sta_cells.filter(function(value){
                        if(value.row_name == null || value.row_name == undefined || value.row_name == ""){
                            return false;
                        }else{
                            return true;
                        }
                    });
                
                /**
                 * 列名字段缓存数据
                 * [0]：Key-顺序序号，Value-列field名称
                 * [1]：Key-列field名称，Value-列名称
                 * [2]：Key-列field名称，Value-列编码
                 * [3]：Key-列field名称，Value-列取值器类型
                 * [4]：Key-列field名称，Value-列取值脚本
                 * [5]：Key-'length'，Value-列数量
                 */
                $scope.data.currItem.epm_sta_cols = [{},{},{},{},{},{length : colFieldArr.length - 2}];
                
                var seq = 0;//自增数值
                var colField;//列字段
                var colName;//列名称

                for(var i = 2; i < colFieldArr.length; i++){
                    /* 赋值 */
                    seq++;
                    colField = colFieldArr[i];
                    colName = colNameArr[i];
                    $scope.data.currItem.epm_sta_cols[0][seq] = colField;
                    $scope.data.currItem.epm_sta_cols[1][colField] = colName;
                    $scope.data.currItem.epm_sta_cols[2][colField] = colType[colField].col_code;
                    $scope.data.currItem.epm_sta_cols[3][colField] = colType[colField].col_type;
                    $scope.data.currItem.epm_sta_cols[4][colField] = colType[colField].col_script;
                }

                //数组置空
                $scope.data.currItem.epm_sta_cell_codes = [];
                $scope.data.currItem.epm_sta_cell_types = [];
                $scope.data.currItem.epm_sta_cell_scripts = [];

                //生成单元格属性数据
                $scope.data.currItem.epm_sta_cells.forEach(function(value){
                    var codeProj = {};//值编码
                    var typeProj = {};//值取值类型
                    var scriptProj = {};//值取值脚本
                    for(var i = 2; i < colFieldArr.length; i++){
                        codeProj[colFieldArr[i]] = cellType[value.row_seq][colFieldArr[i]].cell_code == undefined ?
                            "" : cellType[value.row_seq][colFieldArr[i]].cell_code;//值编码
                        typeProj[colFieldArr[i]] = cellType[value.row_seq][colFieldArr[i]].cell_type == undefined ? 
                            "" : cellType[value.row_seq][colFieldArr[i]].cell_type;//值取值类型
                        scriptProj[colFieldArr[i]] = cellType[value.row_seq][colFieldArr[i]].cell_script == undefined ?
                            "" : cellType[value.row_seq][colFieldArr[i]].cell_script;//值取值脚本
                    }
                    //值编码
                    $scope.data.currItem.epm_sta_cell_codes.push(codeProj);
                    //值取值类型
                    $scope.data.currItem.epm_sta_cell_types.push(typeProj);
                    //值取值脚本
                    $scope.data.currItem.epm_sta_cell_scripts.push(scriptProj);
                });

                //调用后台保存方法
                return requestApi.post({
                    classId: 'epm_sta_table',
                    action: $scope.data.currItem.table_id > 0? 'update' : 'insert',
                    data: $scope.data.currItem
                }).then(function (data) {
                    swalApi.success('保存成功!')
                    .then(function(){
                        /**
                         * 切换到查看模式
                         * 刷新数据
                         */
                        $scope.displayMode = 'viewModel';
                        //清除数据
                        clear();
                        //获取数据
                        searchLineData(data.table_id, 0);
                    });
                });
                
            };

            /**
             * 刷新网格数据按钮函数
             */
            function serarch (){
                $scope[gridOptionsName[$scope.displayMode]].hcApi.search()
            };

        }
        ];

    return controllerApi.controller({
        module:module,
        controller:controller
    });

});