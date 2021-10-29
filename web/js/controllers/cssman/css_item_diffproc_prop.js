/**
 *  author: Li Meng
 *  time: 2019/7/26
 *  module:配件签收单 属性页
 **/
define(
    ['module', 'controllerApi', 'requestApi', 'base_obj_prop', 'openBizObj', 'swalApi','numberApi', 'directive/hcImg'],
    function (module, controllerApi, requestApi, base_obj_prop, openBizObj, swalApi,numberApi) {
        var diffprocItem = [
            '$scope',

            function ($scope) {
                /*----------------------------------能否编辑-------------------------------------------*/
                function editable(args) {
                    return  $scope.data.currItem.stat == 1 && !args.node.rowPinned;
                }

                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                
                /*----------------------------------表格定义-------------------------------------------*/
                //联系人信息
                $scope.gridOptions_diffproc = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_code',
                        headerName: '配件编号',
                        editable: false
                    }, {
                        field: 'item_name',
                        headerName: '配件名称',
                        editable: false
                    } , {
                        field: 'send_qty',
                        headerName: '发放数量',
                        type:'数量',
                        editable: false,
                        width: 150
                    }, {
                        field: 'receive_qty',
                        headerName: '签收数量',
                        editable:function(args) {
                            return   editable(args)
                        },
                        type:'数量',
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue)
                                return;
                            if (args.newValue>args.data.send_qty) {
                                swalApi.info('签收数量不能大于 发放数量');

                                return;
                            }
                                $scope.calTotal(args);
                        },
                        width: 150
                    }, {
                        field: 'inv_loc',
                        headerName: '入库库位',
                        editable:function(args) {
                            return   editable(args)
                        },
                        width: 150
                    }, {
                        field: 'price',
                        headerName: '价格',
                        editable: false,
                        type:"金额"
                    },{
                        field: 'send_amount',
                        headerName: '配件发放金额',
                        editable: false,
                        type:"金额"
                    },{
                        field: 'receive_amount',
                        headerName: '配件签收金额',
                        editable: false,
                        type:"金额"
                    },{
                        field: 'diff_reason',
                        headerName: '差异原因',
                        width: 200,
                        editable: true

                    },{
                        field: 'note',
                        headerName: '备注',
                        width: 200,
                        editable: true
                    }
                    ]
                };
                /*----------------------------------通用查询-------------------------------------------*/
                //配件申请单
                $scope.commonSearchSettingOfApply = {
                    afterOk: function (result) {
                        for(var prop  in result){
                              if(prop=='stat')
                                 continue;
                            else if (prop=='wfid')
                                continue;
                            else if (prop=='wfflag')
                                continue;
                            else if (prop=='checkor')
                                continue;
                            else if (prop=='check_time')
                                continue;
                            $scope.data.currItem[prop]=result[prop]
                        }
                        requestApi.post({
                            classId: 'css_item_sendout_header',
                            data:{
                                searchflag:2,
                                sendout_id: $scope.data.currItem.sendout_id
                            },
                            action: 'search',
                        }).then(function (response) {
                            $scope.data.currItem.css_item_diffproc_lineofcss_item_diffproc_headers=response.css_item_sendout_lines;
                            $scope.gridOptions_diffproc.hcApi.setRowData(getCurrentitems());
                        })
                    }
                };
                /*----------------------------------计算逻辑开始-------------------------------------------*/
                /**
                 * 计算总额
                 */
                $scope.calTotal = function (args) {
                    if(args) {
                        args.data.send_amount = args.data.price * args.data.send_qty;
                        args.data.receive_amount = args.data.price * args.data.receive_qty;
                    }
                    //发放总数量
                    $scope.data.currItem.send_qty_total
                        = numberApi.sum(getCurrentitems(), 'send_qty');
                    //发放总金额
                    $scope.data.currItem.send_price_total
                        =numberApi.sum(getCurrentitems(), 'send_amount');

                    //签收总数量
                    $scope.data.currItem.receive_qty_total
                        = numberApi.sum(getCurrentitems(), 'receive_qty');
                    //签收总金额
                    $scope.data.currItem.receive_price_total
                        = numberApi.sum(getCurrentitems(), 'receive_amount');
                    $scope.gridOptions_diffproc.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            send_qty: numberApi.sum(getCurrentitems(), 'send_qty'),
                            receive_qty:numberApi.sum(getCurrentitems(), 'receive_qty'),
                            send_amount:numberApi.sum(getCurrentitems(), 'send_amount'),
                            receive_amount:numberApi.sum(getCurrentitems(), 'receive_amount')
                        }
                    ]);
                    if(args)
                    args.api.refreshView();
                };

                /*----------------------------------计算逻辑结束-------------------------------------------*/

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    //添加详情信息
                    bizData.css_item_diffproc_lineofcss_item_diffproc_headers = [];
                    $scope.gridOptions_diffproc.hcApi.setRowData(bizData.css_item_diffproc_lineofcss_item_diffproc_headers);
                };
                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_diffproc.hcApi.setRowData(bizData.css_item_diffproc_lineofcss_item_diffproc_headers);
                    $scope.calTotal();
                };
                /**
                 * 保存之前
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                };

                function getCurrentitems(){
                    return $scope.data.currItem.css_item_diffproc_lineofcss_item_diffproc_headers;
                }
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow = {
                    title: '增加明细',
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.add_diffproc && $scope.add_diffproc();
                        }
                    }
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };
                $scope.footerLeftButtons.deleteRow = {
                    title: "删除明细",
                    click: function () {
                        if ($scope.tabs.base.active) {
                            $scope.del_diffproc && $scope.del_diffproc();
                        }
                    }
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return (!$scope.tabs.base.active);
                };

                $scope.footerRightButtons.save.hide=function(){
                    return  $scope.data.currItem.stat > 1;
                };
                $scope.footerRightButtons.saveThenSubmit.hide=function(){
                    return !$scope.data.currItem.stat > 1;
                };
                $scope.footerRightButtons.saveThenAdd.hide=function(){
                    return !$scope.data.currItem.stat >1;
                };
                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //增加配件明细
                $scope.add_diffproc = function () {
                    $scope.gridOptions_diffproc.api.stopEditing();
                    var data = getCurrentitems();
                    data.push({});
                    $scope.gridOptions_diffproc.hcApi.setRowData(data);
                };
                //删除配件明细
                $scope.del_diffproc = function () {
                    var idx = $scope.gridOptions_diffproc.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrentitems().splice(idx, 1);
                        $scope.gridOptions_diffproc.hcApi.setRowData(getCurrentitems());
                    }
                };
                /*----------------------------------顶部按钮-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.extra = {
                    title: '其他'
                };
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: diffprocItem
        });

    });