/**
 * 成本计算
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi','$q','dateApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi,$q,dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope','$timeout',
            //控制器函数
            function ($scope,$timeout) {
                $scope.data = {};
                $scope.data.currItem = {};

                $scope.lines1 = [];
                $scope.lines2 = [];
                $scope.lines3 = [];

                $scope.check_items = [
                    {'stat':0,'check_item_code':'JS1111','check_item_name':'成本计算前检查','remark':'检查当月业务数据的异常情况，主要检查项在[计算前检查]页卡中'},
                    {'stat':0,'check_item_code':'JS0001','check_item_name':'刷新采购价格','remark':'用发票价或本期最新的采购价更新本期采购入库单的价格'},
                    {'stat':0,'check_item_code':'JS0002','check_item_name':'计算结存成本价','remark':'根据月加权平均算法计算材料和成本的结存价格'},
                    {'stat':0,'check_item_code':'JS0004','check_item_name':'更新出库单成本价格','remark':'将本期计算得到的结存成本价更新出库单、调拨单及委外耗料单'},
                    {'stat':0,'check_item_code':'JS0005','check_item_name':'计算收发存','remark':'根据当前存货期间的出入库单据计算当前存货期间的存货收发存'},
                    {'stat':0,'check_item_code':'JS0006','check_item_name':'生成存货金额调整单','remark':'调整结存数量×结存单价不等于结存金额的情况。如0数量有金额的情况'},
                    {'stat':0,'check_item_code':'JS2222','check_item_name':'成本计算结果检查','remark':'检查当月成本的异常情况，主要检查项在[计算后检查]页卡中'},
                    {'stat':0,'check_item_code':'JS0007','check_item_name':'删除存货金额调整单','remark':'删除系统生成的存货金额调整单'}
                ];

                function sleep(numberMillis) {
                    var now = new Date();
                    var exitTime = now.getTime() + numberMillis;
                    while (true) {
                        now = new Date();
                        if (now.getTime() > exitTime)
                            return true;
                    }
                }

                $scope.gridOptions1 = {
                    columnDefs: [{
                            type: '序号'
                         },
                        {
                            headerName: "状态",
                            field: "stat",
                            type:"词汇",
                            cellEditorParams:{
                                names:['','检查中...','完成','待处理','忽略'],
                                values:[0,1,2,3,4]
                            },
                            cellStyle: function (params) {
                                var color = null;
                                switch (params.data.stat) {
                                    case 1:
                                        color = 'orange';
                                        break;
                                    case 2:
                                        color = 'green';
                                        break;
                                    case 3:
                                        color = 'red';
                                        break;
                                    case 4:
                                        color = 'red';
                                        break;
                                }
                                return {
                                    color: color
                                };
                            }
                        },
                        {
                            headerName: "检查项编码",
                            field: "check_item_code",
                        },
                        {
                            headerName: "检查项名称",
                            field: "check_item_name",
                        },
                        {
                            headerName: "允许跳过",
                            field: "is_roll_up",
                            type:"是否"
                        }
                    ]

                };

                $scope.detailOptions1 = {
                    columnDefs: [{
                            type: '序号'
                        },
                        {
                            headerName: "检查项编码",
                            field: "check_item_code"
                        },
                        {
                            headerName: "检查结果信息",
                            field: "result_info"
                        }
                        ,
                        {
                            headerName: "单据号",
                            field: "bill_no"
                        }
                    ]

                };

                $scope.gridOptions2 = {
                    columnDefs: [{
                            type: '序号',
                            headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true,
                            checkboxSelection: true,
                            width: 100
                        },
                        {
                            headerName: "状态",
                            field: "stat",
                            type:"词汇",
                            cellEditorParams:{
                                names:['','计算中...','完成'],
                                values:[0,1,2]
                            },
                            cellStyle: function (params) {
                                var color = null;
                                switch (params.data.stat) {
                                    case 1:
                                        color = 'orange';
                                        break;
                                    case 2:
                                        color = 'green';
                                        break;
                                    case 3:
                                        color = 'red';
                                        break;
                                    case 4:
                                        color = 'red';
                                        break;
                                }
                                return {
                                    color: color
                                };
                            }
                        },
                        {
                            headerName: "计算项目",
                            field: "check_item_name",
                        },
                        {
                            headerName: "说明",
                            field: "remark"
                        }
                    ]

                };

                $scope.gridOptions3 = {
                    columnDefs: [{
                            type: '序号'
                        },
                        {
                            headerName: "状态",
                            field: "stat",
                            type:"词汇",
                            cellEditorParams:{
                                names:['','检查中...','完成','待处理','忽略'],
                                values:[0,1,2,3,4]
                            },
                            cellStyle: function (params) {
                                var color = null;
                                switch (params.data.stat) {
                                    case 1:
                                        color = 'orange';
                                        break;
                                    case 2:
                                        color = 'green';
                                        break;
                                    case 3:
                                        color = 'red';
                                        break;
                                    case 4:
                                        color = 'red';
                                        break;
                                }
                                return {
                                    color: color
                                };
                            }
                        },
                        {
                            headerName: "检查项编码",
                            field: "check_item_code",
                        },
                        {
                            headerName: "检查项名称",
                            field: "check_item_name",
                        },
                        {
                            headerName: "允许跳过",
                            field: "is_roll_up",
                            type:"是否"
                        }
                    ]

                };

                $scope.detailOptions3 = {
                    columnDefs: [{
                        type: '序号'
                    },
                        {
                            headerName: "检查项编码",
                            field: "check_item_code"
                        },
                        {
                            headerName: "检查结果信息",
                            field: "result_info"
                        }
                        ,
                        {
                            headerName: "单据号",
                            field: "bill_no"
                        }
                    ]

                };


                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });


                $scope.before = function () {
                    if($scope.data.currItem.year_month==undefined){
                        return swalApi.info("没有找到启用的存货期间");
                    }

                    //数据重置
                    var statColumn = $scope.gridOptions1.columnApi.getColumn('stat');

                    var tasks = [];
                    //取行
                    $scope.gridOptions1.api.forEachNodeAfterFilterAndSort(function (node) {
                        var data = node.data;
                        data.stat = 0;
                        tasks.push({
                            node: node,
                            data: data
                        });
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [node]
                        });
                    });

                    var errors_datas = [];
                    return $q.when().then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[0].node.rowIndex, 'check_item_name');
                        tasks[0].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[0].node]
                        });
                        return tasks[0];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[0].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[0].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[0].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[0].data.stat = 4;//跳过
                        }else{
                            tasks[0].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[0].node]
                        });

                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[1].node.rowIndex, 'check_item_name');
                        tasks[1].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[1].node]
                        });
                        return tasks[1];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[1].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[1].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[1].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[1].data.stat = 4;//跳过
                        }else{
                            tasks[1].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[1].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[2].node.rowIndex, 'check_item_name');
                        tasks[2].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[2].node]
                        });
                        return tasks[2];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[2].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[2].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[2].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[2].data.stat = 4;//跳过
                        }else{
                            tasks[2].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[2].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[3].node.rowIndex, 'check_item_name');
                        tasks[3].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[3].node]
                        });
                        return tasks[3];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[3].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[3].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[3].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[3].data.stat = 4;//跳过
                        }else{
                            tasks[3].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[3].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[4].node.rowIndex, 'check_item_name');
                        tasks[4].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[4].node]
                        });
                        return tasks[4];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[4].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[4].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[4].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[4].data.stat = 4;//跳过
                        }else{
                            tasks[4].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[4].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[5].node.rowIndex, 'check_item_name');
                        tasks[5].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[5].node]
                        });
                        return tasks[5];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[5].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[5].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[5].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[5].data.stat = 4;//跳过
                        }else{
                            tasks[5].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[5].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[6].node.rowIndex, 'check_item_name');
                        tasks[6].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[6].node]
                        });
                        return tasks[6];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[6].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[6].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[6].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[6].data.stat = 4;//跳过
                        }else{
                            tasks[6].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[6].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[7].node.rowIndex, 'check_item_name');
                        tasks[7].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[7].node]
                        });
                        return tasks[7];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[7].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[7].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[7].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[7].data.stat = 4;//跳过
                        }else{
                            tasks[7].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[7].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[8].node.rowIndex, 'check_item_name');
                        tasks[8].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[8].node]
                        });
                        return tasks[8];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[8].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[8].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[8].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[8].data.stat = 4;//跳过
                        }else{
                            tasks[8].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[8].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[9].node.rowIndex, 'check_item_name');
                        tasks[9].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[9].node]
                        });
                        return tasks[9];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[9].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[9].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[9].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[9].data.stat = 4;//跳过
                        }else{
                            tasks[9].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[9].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[10].node.rowIndex, 'check_item_name');
                        tasks[10].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[10].node]
                        });
                        return tasks[10];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[10].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[10].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[10].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[10].data.stat = 4;//跳过
                        }else{
                            tasks[10].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[10].node]
                        });
                    }).then(function () {
                        $scope.gridOptions1.hcApi.setFocusedCell(tasks[11].node.rowIndex, 'check_item_name');
                        tasks[11].data.stat = 1;
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[11].node]
                        });
                        return tasks[11];
                    }).then(doCheckItem).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[11].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[11].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[11].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[11].data.stat = 4;//跳过
                        }else{
                            tasks[11].data.stat = 2;//通过
                        }
                        $scope.gridOptions1.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[11].node]
                        });
                    }).then(function () {
                        if(errors_datas.length>0){
                            $('#detailtab1 li:eq(1) a').tab('show');
                        }
                        $scope.detailOptions1.hcApi.setRowData(errors_datas);
                    })


                }

                $scope.after = function () {
                    if($scope.data.currItem.year_month==undefined){
                        return swalApi.info("没有找到启用的存货期间");
                    }

                    var statColumn = $scope.gridOptions3.columnApi.getColumn('stat');

                    var tasks = [];
                    //取行
                    $scope.gridOptions3.api.forEachNodeAfterFilterAndSort(function (node) {
                        var data = node.data;
                        data.stat = 0;
                        tasks.push({
                            node: node,
                            data: data
                        });
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [node]
                        });
                    });

                    var errors_datas = [];
                    return $q.when().then(function () {
                        $scope.gridOptions3.hcApi.setFocusedCell(tasks[0].node.rowIndex, 'check_item_code');
                        tasks[0].data.stat = 1;
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[0].node]
                        });
                        return tasks[0];
                    }).then(doCheckItemAfter).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[0].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[0].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[0].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[0].data.stat = 4;//跳过
                        }else{
                            tasks[0].data.stat = 2;//通过
                        }
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[0].node]
                        });

                    }).then(function () {
                        $scope.gridOptions3.hcApi.setFocusedCell(tasks[1].node.rowIndex, 'check_item_code');
                        tasks[1].data.stat = 1;
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[1].node]
                        });
                        return tasks[1];
                    }).then(doCheckItemAfter).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[1].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[1].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[1].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[1].data.stat = 4;//跳过
                        }else{
                            tasks[1].data.stat = 2;//通过
                        }
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[1].node]
                        });
                    }).then(function () {
                        $scope.gridOptions3.hcApi.setFocusedCell(tasks[2].node.rowIndex, 'check_item_code');
                        tasks[2].data.stat = 1;
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[2].node]
                        });
                        return tasks[2];
                    }).then(doCheckItemAfter).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[2].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[2].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[2].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[2].data.stat = 4;//跳过
                        }else{
                            tasks[2].data.stat = 2;//通过
                        }
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[2].node]
                        });
                    }).then(function () {
                        $scope.gridOptions3.hcApi.setFocusedCell(tasks[3].node.rowIndex, 'check_item_code');
                        tasks[3].data.stat = 1;
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[3].node]
                        });
                        return tasks[3];
                    }).then(doCheckItemAfter).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[3].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[3].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[3].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[3].data.stat = 4;//跳过
                        }else{
                            tasks[3].data.stat = 2;//通过
                        }
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[3].node]
                        });
                    }).then(function () {
                        $scope.gridOptions3.hcApi.setFocusedCell(tasks[4].node.rowIndex, 'check_item_code');
                        tasks[4].data.stat = 1;
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[4].node]
                        });
                        return tasks[4];
                    }).then(doCheckItemAfter).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[4].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[4].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[4].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[4].data.stat = 4;//跳过
                        }else{
                            tasks[4].data.stat = 2;//通过
                        }
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[4].node]
                        });
                    }).then(function () {
                        $scope.gridOptions3.hcApi.setFocusedCell(tasks[5].node.rowIndex, 'check_item_code');
                        tasks[5].data.stat = 1;
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[5].node]
                        });
                        return tasks[5];
                    }).then(doCheckItemAfter).then(function (rst) {
                        //刷新页面
                        if(rst.flag==2&&tasks[5].data.is_roll_up==1){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[5].data.stat = 3;//未通过
                        }else if(rst.flag==2&&tasks[5].data.is_roll_up==2){
                            errors_datas = errors_datas.concat(rst.gl_check_itemofgl_check_items);
                            tasks[5].data.stat = 4;//跳过
                        }else{
                            tasks[5].data.stat = 2;//通过
                        }
                        $scope.gridOptions3.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [tasks[5].node]
                        });
                    }).then(function () {
                        if(errors_datas.length>0){
                            $('#detailtab3 li:eq(1) a').tab('show');
                        }
                        $scope.detailOptions3.hcApi.setRowData(errors_datas);
                    })




                }

                //月结月份
                $scope.getYearMonth = function () {
                    var postData = {
                        classId: "inv_item_stk_price",
                        action: 'getyearmonth',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            $scope.data.currItem.year_month = data.year_month;
                        });
                }

                //获取检查前检查项目
                $scope.getmodsetchkitem = function (flag) {
                    var postData = {
                        classId: "gl_check_item",
                        action: 'getmodsetchkitem',
                        data: {search_flag:flag}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if(flag==8){
                                $scope.lines1 = data.gl_check_itemofgl_check_items;
                                $scope.gridOptions1.hcApi.setRowData($scope.lines1);
                            }
                            if(flag==9){
                                $scope.lines3 = data.gl_check_itemofgl_check_items;
                                $scope.gridOptions3.hcApi.setRowData($scope.lines3);
                            }
                        });
                }

                //收发存运算
                $scope.transact = function () {
                    var postData = {
                        classId: "inv_monthsum",
                        action: 'transact',
                        data: {}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            swalApi.success("运算完毕！");
                        });
                }

                //库存运算
               $scope.usp_reexccurqty = function () {
                   var postData = {
                       classId: "inv_monthsum",
                       action: 'usp_reexccurqty',
                       data: {}
                   };
                   return requestApi.post(postData)
                       .then(function (data) {
                           swalApi.success("运算完毕！");
                       });
               }

                $scope.factcostclac = function () {
                    if($scope.data.currItem.year_month==undefined){
                        return swalApi.info("没有找到启用的存货期间");
                    }
                    //数据重置
                    var statColumn = $scope.gridOptions2.columnApi.getColumn('stat');

                    var tasks = [];
                    //取行
                    $scope.gridOptions2.api.forEachNodeAfterFilterAndSort(function (node) {
                        var data = node.data;
                        data.stat = 0;
                        tasks.push({
                            node: node,
                            data: data,
                            selected:node.selected
                        });

                        $scope.gridOptions2.api.refreshCells({
                            columns: [statColumn],
                            rowNodes: [node]
                        });
                    });

                    $q.when().then(function () {
                        if(tasks[0].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[0].node.rowIndex, 'check_item_name');
                            tasks[0].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[0].node]
                            });
                            $('#maintab li:eq(0) a').tab('show');
                            return $scope.before().then(function () {
                                $('#maintab li:eq(1) a').tab('show');
                                $('#detailtab1 li:eq(0) a').tab('show');

                                tasks[0].data.stat = 2;
                                $scope.gridOptions2.api.refreshCells({
                                    columns: [statColumn],
                                    rowNodes: [tasks[0].node]
                                });
                            });
                        }
                    }).then(function () {
                        if(tasks[1].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[1].node.rowIndex, 'check_item_name');
                            tasks[1].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[1].node]
                            });
                        }
                        return tasks[1];
                    }).then(doCheck).then(function () {
                        //刷新页面
                        if(tasks[1].data.stat == 1){
                            tasks[1].data.stat = 2;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[1].node]
                            });
                        }

                    }).then(function () {
                        if(tasks[2].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[2].node.rowIndex, 'check_item_name');
                            tasks[2].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[2].node]
                            });
                        }
                        return tasks[2];
                    }).then(doCheck).then(function () {
                        //刷新页面
                        if(tasks[2].data.stat == 1){
                            tasks[2].data.stat = 2;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[2].node]
                            });
                        }

                    }).then(function () {
                        if(tasks[3].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[3].node.rowIndex, 'check_item_name');
                            tasks[3].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[3].node]
                            });
                        }
                        return tasks[3];
                    }).then(doCheck).then(function () {
                        //刷新页面
                        if(tasks[3].data.stat == 1){
                            tasks[3].data.stat = 2;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[3].node]
                            });
                        }

                    }).then(function () {
                        if(tasks[4].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[4].node.rowIndex, 'check_item_name');
                            tasks[4].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[4].node]
                            });
                        }
                        return tasks[4];
                    }).then(doCheck).then(function () {
                        //刷新页面
                        if(tasks[4].data.stat == 1){
                            tasks[4].data.stat = 2;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[4].node]
                            });
                        }

                    }).then(function () {
                        if(tasks[5].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[5].node.rowIndex, 'check_item_name');
                            tasks[5].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[5].node]
                            });
                        }
                        return tasks[5];
                    }).then(doCheck).then(function () {
                        //刷新页面
                        if(tasks[5].data.stat == 1){
                            tasks[5].data.stat = 2;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[5].node]
                            });
                        }

                    }).then(function () {
                        if(tasks[6].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[6].node.rowIndex, 'check_item_name');
                            tasks[6].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[6].node]
                            });

                            $('#maintab li:eq(2) a').tab('show');
                            return $scope.after().then(function () {
                                $('#maintab li:eq(1) a').tab('show');
                                $('#detailtab3 li:eq(0) a').tab('show');

                                tasks[6].data.stat = 2;
                                $scope.gridOptions2.api.refreshCells({
                                    columns: [statColumn],
                                    rowNodes: [tasks[6].node]
                                });
                            });
                        }
                        return tasks[6];
                    }).then(function () {
                        if(tasks[7].selected==true){
                            $scope.gridOptions2.hcApi.setFocusedCell(tasks[7].node.rowIndex, 'check_item_name');
                            tasks[7].data.stat = 1;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[7].node]
                            });
                        }
                        return tasks[7];
                    }).then(doCheck).then(function () {
                        //刷新页面
                        if(tasks[7].data.stat == 1){
                            tasks[7].data.stat = 2;
                            $scope.gridOptions2.api.refreshCells({
                                columns: [statColumn],
                                rowNodes: [tasks[7].node]
                            });
                        }

                    });

                }

                function doCheck(task) {
                    if(task.selected==true){
                        var value = task.data;
                        value.year_month = $scope.data.currItem.year_month;
                        value.calc_code = value.check_item_code;
                        var postParams = {
                            classId: 'inv_item_stk_price',
                            action: 'factcostclac',
                            data: value
                        };
                        return requestApi.post(postParams);
                    }
                }

                function doCheckItem(task) {
                    var value = task.data;
                    value.flag = 8;
                    value.year_month = $scope.data.currItem.year_month;
                    var postParams = {
                        classId: 'gl_check_item',
                        action: 'settlecheck',
                        data: value
                    };
                    return requestApi.post(postParams);
                }

                function doCheckItemAfter(task) {
                    var value = task.data;
                    value.flag = 9;
                    value.year_month = $scope.data.currItem.year_month;
                    var postParams = {
                        classId: 'gl_check_item',
                        action: 'settlecheck',
                        data: value
                    };
                    return requestApi.post(postParams);
                }


                //获月份和检查项目
                $scope.getYearMonth().then(function () {
                    $scope.getmodsetchkitem(8);
                }).then(function () {
                    $scope.getmodsetchkitem(9);
                });


                 //执行初始化
                 $(function () {
                    $timeout(500)
                        .then(function () {
                            $scope.gridOptions2.hcApi.setRowData($scope.check_items);
                            $scope.gridOptions2.api.forEachNodeAfterFilter( function(node) {
                                if(node.data.check_item_code=='JS1111'||node.data.check_item_code=='JS0002'
                                    ||node.data.check_item_code=='JS0004'||node.data.check_item_code=='JS0005'
                                    ||node.data.check_item_code=='JS2222')
                                    node.setSelected(true);
                            });
                            $('#maintab').on('shown.bs.tab', function (e) {
                                // 获取已激活的标签页的名称
                                var activeTab = $(e.target).text();
                                if(activeTab=='1、计算前检查'){
                                    $scope.gridOptions1.columnApi.autoSizeAllColumns();
                                }
                                if(activeTab=='2、实际成本计算'){
                                    $scope.gridOptions2.columnApi.autoSizeAllColumns();
                                }
                                if(activeTab=='3、计算后检查'){
                                    $scope.gridOptions3.columnApi.autoSizeAllColumns();
                                }
                            });
                        }) ;
                 });

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);