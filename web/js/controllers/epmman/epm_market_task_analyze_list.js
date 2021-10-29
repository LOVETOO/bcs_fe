/**
 * zengjinhua
 * 2019/9/10.
 * 销售任务分析
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'requestApi','numberApi', 'directive/hcChart'],
    function (module, controllerApi, base_diy_page, requestApi, numberApi) {

        var controller=[
            '$scope',
            function ($scope){
                /**
                 * 数据定义
                 */
                $scope.data = {};
                $scope.data.currItem = {
                    epm_sta_rows:[],
                    epm_sta_cells : []
                };

                /**
                 * 正则判断维护
                 */
                $scope.regular = {
                    percentage : /完成率/, /* 用以判断字段名，是否添加 ‘%’ */
                    outPercentage : /年出货任务完成率/,
                    inPercentage : /年签单任务完成率/
                }

                /**
                 * 颜色区分：
                 * 第二区间第一个的下标
                 */
                $scope.data.colorIndex = 7;

                //继承控制器
                controllerApi.extend({
                    controller:base_diy_page.controller,
                    scope:$scope
                });
                /**======================== 数据初始化 ========================*/
                $scope.doInits = function () {
                    $scope.data.currItem.date = new Date().Format('yyyy-MM-dd');
                    $scope.data.currItem.year = $scope.data.currItem.date.substr(0,4);
                    $scope.search();
                }

                /**
                 * 添加按钮
                 */
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'iconfont hc-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    }
                };

                /**
                 * 网格
                 */
                $scope.gridOptions = {
                    columnDefs:[]
                }

                /**
                 * 根据年份置换标题
                 */
                function updateTitle(){
                    $(function () {
                        var intervalId = setInterval(function () {
                            var $element = $('#market_task_analyze_big_div > div:nth-child(1) > hc-box-title');
    
                            if ($element.length) {
                                clearInterval(intervalId);
                                $element.text($scope.data.currItem.year + '年出货任务完成率');
                            }
                        }, 300);
                    });
                    $(function () {
                        var intervalId = setInterval(function () {
                            var $element = $('#market_task_analyze_big_div > div:nth-child(2) > hc-box-title');
    
                            if ($element.length) {
                                clearInterval(intervalId);
                                $element.text($scope.data.currItem.year + '年签单任务完成率');
                            }
                        }, 300);
                    });
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
                    $scope.data.currItem.epm_sta_rows.forEach(function(value, index){
                        if(serial[value.row_rank] == undefined){
                            //序号重新计算
                            serial[value.row_rank] = {
                                seq : 1,
                                show_serial : serial[rank].show_serial + '.1'
                            };
                        }else{
                            //序号加一
                            serial[value.row_rank].seq = numberApi.sum(serial[value.row_rank].seq, 1);
                            //展示序号自增
                            serial[value.row_rank].show_serial = $scope.autoIncrementSerial(serial[value.row_rank].show_serial);
                        }
                        if(rank == value.row_rank){//同级别
                            value.serial = serial[value.row_rank].seq;
                            value.show_serial = serial[value.row_rank].show_serial;
                        }else if(value.row_rank > rank){//下一级，子节点
                            rank = value.row_rank;
                            value.serial = serial[value.row_rank].seq;
                            value.show_serial = serial[value.row_rank].show_serial;
                        }else{//跳出上一级别
                            for (var i = rank;i > value.row_rank; i--){
                                serial[i] = undefined;
                            }
                            rank = value.row_rank;
                            value.serial = serial[value.row_rank].seq;
                            value.show_serial = serial[value.row_rank].show_serial;
                        }
                        $scope.data.currItem.epm_sta_cells[index].show_serial = value.show_serial
                    });
                }

                /**
                 * 生成表格数据
                 */
                function createTable(data){
                    var arrName = [];//标题
                    var arrOutDate = [];//出库数据
                    var arrInDate = [];//签单数据
                    $scope.data.currItem.epm_sta_cells.forEach(function(){
                        arrOutDate.push(0);
                        arrInDate.push(0);
                    });
                    

                    //记录id
                    var ids = {
                        out : 0,
                        in : 0
                    }
                    //遍历获取列下标
                    data.cols.forEach(function(value){
                        if(value.col_name.search($scope.regular.outPercentage) >= 0){
                            ids.out = value.col_id;
                        }else if(value.col_name.search($scope.regular.inPercentage) >= 0){
                            ids.in = value.col_id;
                        }
                    });

                    //遍历生成数据
                    $scope.data.currItem.epm_sta_cells.forEach(function(value, index){
                        arrName.push(value.show_serial + "、" + value.row_name);
                        arrOutDate[index] = numberApi.formatNumber(value[ids.out]);
                        arrInDate[index] = numberApi.formatNumber(value[ids.in]);
                    });

                    $scope.chartOption_out = {
                        grid:{//直角坐标系内绘图网格
                            left:"20%",//grid 组件离容器左侧的距离。
                            bottom:"25%" //
                        },
                        xAxis: {
                            type: 'category',
                            data: arrName,
                            axisLabel : {//坐标轴刻度标签的相关设置。
                                interval:'auto', 
                                rotate:"25"
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: '完成率',
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        },
                        series: [{
                            data: arrOutDate,
                            label: { //文本标签
                                show: true, //显示
                                position: 'top', //显示位置
                                formatter: '{c}%'
                            },
                            type: 'bar',
                            itemStyle: {   
                                //通常情况下：
                                normal:{  
                                    color: function (params){
                                        var index = params.dataIndex;
                                        var colorList = [
                                            'RGB(46,68,84)',
                                            'RGB(96,161,169)',
                                            'RGB(213,131,100)',
                                            'RGB(145,199,175)',
                                            'RGB(116,159,131)',
                                            'RGB(203,135,34)'];
                                        if(index >= colorList.length){
                                            index = index % colorList.length;
                                        }
                                        return colorList[index];
                                    }
                                },
                                //鼠标悬停时：
                                emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };

                    $scope.chartOption_in = {
                        grid:{//直角坐标系内绘图网格
                            left:"20%",//grid 组件离容器左侧的距离。
                            bottom:"25%" //
                        },
                        xAxis: {
                            type: 'category',
                            data: arrName,
                            axisLabel : {//坐标轴刻度标签的相关设置。
                                interval:'auto',
                                rotate:"25"
                            }
                        },
                        yAxis: {
                            type: 'value',
                            name: '完成率',
                            axisLabel: {
                                formatter: '{value}%'
                            }
                        },
                        series: [{
                            data: arrInDate,
                            label: { //文本标签
                                show: true, //显示
                                position: 'top', //显示位置
                                formatter: '{c}%'
                            },
                            type: 'bar',
                            itemStyle: {   
                                //通常情况下：
                                normal:{  
                                    color: function (params){
                                        var index = params.dataIndex;
                                        var colorList = [
                                            'RGB(46,68,84)',
                                            'RGB(96,161,169)',
                                            'RGB(213,131,100)',
                                            'RGB(145,199,175)',
                                            'RGB(116,159,131)',
                                            'RGB(203,135,34)'];
                                        if(index >= colorList.length){
                                            index = index % colorList.length;
                                        }
                                        return colorList[index];
                                    }
                                },
                                //鼠标悬停时：
                                emphasis: {
                                        shadowBlur: 10,
                                        shadowOffsetX: 0,
                                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }]
                    };
                }

                //查询
                $scope.search = function(){
                    //数据重置
                    $scope.gridOptions.api.setColumnDefs([
                        {
                            field: 'show_serial',
                            headerName: '序号',
                            cellStyle: {
                                'text-align': 'center'
                            },
                            suppressAutoSize: true,
                            suppressSizeToFit: true,
                            width : 80,
                            pinned: 'left'
                        },
                        {
                            field: 'row_name',
                            headerName: '部门',
                            pinned: 'left'
                        }
                    ]);
                    $scope.gridOptions.hcApi.setRowData([]);
                    $scope.data.currItem.table_name = undefined;//报表主题
                    $scope.data.currItem.division_id = undefined;//报表主题
                    $scope.data.currItem.year = $scope.data.currItem.date.substr(0,4);
                    //查询数据
                    requestApi
                        .post({
                            classId: 'stasearch',
                            data: {
                                date: $scope.data.currItem.date,
                                year: $scope.data.currItem.year
                            }
                        })
                        .then(function(response) {
                            $scope.data.currItem.year = response.year;//年份
                            $scope.data.currItem.table_name = response.tables[0].table_name;//报表主题
                            $scope.data.currItem.division_id = response.tables[0].division_id;//事业部
                            //标题更新
                            updateTitle();
                            var colDefArr = [
                                {
                                    field: 'show_serial',
                                    headerName: '序号',
                                    cellStyle: {
                                        'text-align': 'center'
                                    },
                                    suppressAutoSize: true,
                                    suppressSizeToFit: true,
                                    width : 80,
                                    pinned: 'left'
                                },
                                {
                                    field: 'row_name',
                                    headerName: '部门',
                                    pinned: 'left'
                                }
                            ]
                            response.cols.forEach(function(col, index) {
                                colDefArr.push({
                                    field: col.col_id + '',
                                    headerName: col.col_name,
                                    cellStyle: function (){
                                        return {
                                            'text-align': 'center',
                                            'color' : index < $scope.data.colorIndex ? 'rgb(255,137,137)' : 'rgb(124,221,255)'
                                        }
                                    },
                                    valueFormatter: function (params) {
                                        if(params.colDef.headerName.search($scope.regular.percentage) >= 0){
                                            return numberApi.formatNumber(params.value) + "%";
                                        }else{
                                            return numberApi.formatNumber(params.value);
                                        }
                                    }
                                });
                            });
                            $scope.gridOptions.api.setColumnDefs(colDefArr);
                            //前缀生成
                            $scope.data.currItem.epm_sta_cells = response.result;
                            $scope.data.currItem.epm_sta_rows = response.rows;
                            $scope.restructuringSerialNumber();
                            //渲染
                            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_sta_cells);
                            $scope.gridOptions.hcApi.setFocusedCell(0);

                            //生成表格展示
                            createTable(response);
                        });
                }

            }
        ];

        return controllerApi.controller({
            module:module,
            controller:controller
        });

    });