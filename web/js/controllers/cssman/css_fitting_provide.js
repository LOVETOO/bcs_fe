/**
 * Created by zhl on 2019/7/26.
 * css_fitting_provide 配件发放
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'jquery', 'printApi', 'requestApi', 'swalApi','directive/hcBox'],
    function (module, controllerApi, base_diy_page, $, printApi, requestApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$state',
            //控制器函数
            function ($scope, $state) {

                //currItem和objConf用于打印
                $scope.data = {};
                //当前行的表头和明细数据(用于打印)
                $scope.data.currItem = {};
                //对象配置
                $scope.data.objConf = {};
                //当前表头网格节点
                $scope.currNode = {};
                //所以表头网格节点
                $scope.header = {};
                //过滤字段（查询按钮左边控件的数据）
                $scope.filterItem = {};
                //明细网格是否有数据变动
                //$scope.isGridLineChanged = false;

                //继承基础控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                //配置网格数据
                $scope.gridOptions = {
                    rowDragManaged: true,		//拖拽自动调序
                    animateRows: true,			//启用行动画
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            field: 'action',
                            headerName: '动作',
                            cellRenderer: actionCellRendererFunc
                        },
                        {
                            field: 'apply_no',
                            headerName: '申请单号'
                        },
                        {
                            field: 'sendout_no',
                            headerName: '发放单号'
                        },
                        {
                            field: 'fix_org_name',
                            headerName: '网点名称'
                        },
                        {
                            field: 'out_warehouse_name',
                            headerName: '发货仓库名称'
                        },
                        {
                            field: 'ship_man',
                            headerName: '司机',
                            editable: true
                        },
                        {
                            field: 'ship_tel',
                            headerName: '电话',
                            editable: true
                        },
                        {
                            field: 'ship_org',
                            headerName: '物流公司',
                            editable: true
                        },
                        {
                            field: 'ship_no',
                            headerName: '物流单号',
                            editable: true
                        },
                        {
                            field: 'ship_type',
                            headerName: '发货方式',
                            editable: true,
                            hcDictCode: 'shipmode_id'
                        },
                        {
                            field: 'total_qty',
                            headerName: '总数量',
                            type:'数量'
                        },
                        {
                            field: 'stat',
                            headerName: '状态',
                            hcDictCode:'stat'
                        }
                    ],
                    hcEvents: {
                        rowClicked: function (args) {
                            var focuseNodeIndex = $scope.gridOptions.hcApi.getFocusedNode().rowIndex;
                            if (!$.isEmptyObject($scope.currNode) && focuseNodeIndex == $scope.currNode.rowIndex)
                                return;
                            else
                                $scope.currNode = $scope.gridOptions.hcApi.getFocusedNode();

                            $scope.data.currItem = $scope.gridOptions.hcApi.getFocusedData();
                            $scope.doSelect($scope.data.currItem.sendout_id);
                            //$scope.setGridData($scope.data.currItem);
                        }
                    }
                };

                //配件发放单明细
                $scope.gridOptionsLine = {
                    columnDefs: [{
                        type: '序号'
                    },
                        {
                            field: 'item_code',
                            headerName: '配件编码'
                        },
                        {
                            field: 'item_name',
                            headerName: '配件名称'
                        },
                        {
                            field: 'check_qty',
                            headerName: '申请数量',
                            type:'数量'
                        },
                        {
                            field: 'send_qty',
                            headerName: '确认数量',
                            type:'数量',
                            hcRequired: true,
                            editable: true,
                            onCellValueChanged: function (args) {
                                //$scope.isGridLineChanged = true;
                            }
                        },
                        {
                            field: 'price',
                            headerName: '配件价格',
                            type:'金额'
                        },
                        /*{
                            field: 'inv_loc',
                            headerName: '库位'
                        },*/
                        {
                            field: 'note',
                            headerName: '备注'
                        },
                        {
                            field: 'sendout_no',
                            headerName: '发货单号'
                        }]
                };

                /**
                 * 初始化：获取对象配置、获取关联数据
                 */
                $scope.doInit = function () {
                    $scope.hcSuper.doInit()
                        .then(function () {

                            $scope.data.objConf = $state.current.data.objConf;

                            $scope.doSearch();
                        });
                };

                /*---------------------搜索方法-------------------------*/

                /**
                 * 查询表头数据
                 */
                $scope.doSearch = function () {
                    //生成过滤条件的字符串
                    var where = function () {
                        var where = '1=1';
                        //过滤网点
                        if ($scope.filterItem.fix_org_id) {
                            where += ' and fix_org_id = ' + $scope.filterItem.fix_org_id;
                        }
                        //过滤仓库
                        if ($scope.filterItem.out_warehouse_id) {
                            where += ' and out_warehouse_id = ' + $scope.filterItem.out_warehouse_id;
                        }
                        //过滤单号
                        if ($scope.filterItem.apply_no) {
                            where += ' and apply_no like \'%' + $scope.filterItem.apply_no + '%\' ';
                        }

                        if(!$scope.filterItem.stat || $scope.filterItem.stat == 1){
                            where += ' and stat = 5 ';
                        }else{
                            where += ' and stat in (5,9)';
                        }

                        return where;
                    };

                    var postData = {
                        sqlwhere: where()
                    };

                    requestApi.post('css_item_sendout_header', 'search', postData).then(function (result) {
                        $scope.header = result.css_item_sendout_headers;
                        //设置表头数据
                        $scope.gridOptions.hcApi.setRowData($scope.header);
                        //设置焦点行
                        $scope.gridOptions.hcApi.setFocusedCell(0);
                        //查询表
                        if (result.css_item_sendout_headers.length)
                            $scope.doSelect(result.css_item_sendout_headers[0].sendout_id);
                    });
                };

                /**
                 * 查询明细数据
                 * @param id 主键id
                 */
                $scope.doSelect = function (id) {
                    requestApi.post({
                        classId: "css_item_sendout_header",
                        action: 'select',
                        data: {
                            sendout_id: id
                        }
                    }).then(function (result) {
                        $scope.data.currItem = $scope.header[$scope.gridOptions.hcApi.getFocusedRowIndex()];
                        $scope.data.currItem.css_item_sendout_lines = result.css_item_sendout_lines;

                        //设置明细数据
                        $scope.gridOptionsLine.hcApi.setRowData($scope.data.currItem.css_item_sendout_lines);

                    });
                };

                /*---------------------单元格渲染与点击触发事件-------------------------*/

                /**
                 * 渲染“动作”一列的单元格
                 * @param params aggrid提供的对象
                 * @returns {string}
                 */
                function actionCellRendererFunc(params) {
                    var html = '<a href="" class="actionConfirm" id="confirm' + params.rowIndex + '"> 确认 |</a>' +
                        '<a href="" class="actionPrint" id="print' + params.rowIndex + '"> 打印 </a>' /*+
                     '<a href="" class="action" id="search' + params.rowIndex + '""> 查询</button>'*/;

                    return html;
                }

                /**
                 *“确认”点击事件
                 */
                $('div').on('click', '.actionConfirm', function () {

                    requestApi.post('css_item_sendout_header', 'sendoutconfirm', $scope.data.currItem)
                        .then(function (result) {
                            swalApi.info('确认成功');
                            console.log(result,'result after sendoutconfirm');
                        });

                    return false;
                });

                /**
                 * “打印”点击事件
                 */
                $('div').on('click', '.actionPrint', function () {
                    //var id = $(this).attr('id');
                    $scope.data.currItem = $scope.gridOptions.hcApi.getFocusedData();

                    printApi.doSinglePrint($scope.data);

                    return false;
                });

                /*---------------------通用查询--------------------------*/

                //网点
                $scope.commonSearchSettingOfFix = {
                    title: '网点',
                    sqlWhere: ' usable = 2 ',
                    afterOk: function (result) {
                        $scope.filterItem.fix_org_id = result.fix_org_id;
                        $scope.filterItem.fix_org_code = result.fix_org_code;
                        $scope.filterItem.fix_org_name = result.fix_org_name;
                    }
                };

                //仓库
                $scope.commonSearchSettingOfWarehouse = {
                    afterOk: function (result) {
                        $scope.filterItem.out_warehouse_id = result.warehouse_id;
                        $scope.filterItem.out_warehouse_code = result.warehouse_code;
                        $scope.filterItem.out_warehouse_name = result.warehouse_name;
                    }
                };


                /**
                 * 设置明细网格数据
                 * @param focusRow 焦点行数据及节点对象
                 */
                $scope.setGridData = function (focusRow) {
                    $scope.gridOptionsLine.hcApi.setRowData(focusRow.css_item_sendout_lineofcss_item_sendout_headers);
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
