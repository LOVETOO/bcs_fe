/**
 * 工程订单出库
 * 2019/7/1
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'numberApi'],
    function (module, controllerApi, base_obj_prop, numberApi) {

        var controller = [
            '$scope',

            function ($scope) {
                /*------------------------------继承基础控制器------------------------------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 *  表格定义
                 */
                $scope.gridOptions = {
                    pinnedBottomRowData: [{seq: "合计"}],
                    columnDefs: [{
                        type: '序号'
                    },{
                        field: 'item_code',
                        headerName: '产品编码'
                    }, {
                        field: 'item_name',
                        headerName: '产品名称'
                    }, {
                        field: 'sa_salebillno',
                        headerName: '订单单号'
                    }, {
                        field: 'specs',
                        headerName: '产品规格'
                    }, {
                        field: 'item_color',
                        headerName: '颜色'
                    }, {
                        field: 'batch_no',
                        headerName: '色号'
                    }, {
                        field: 'qty_bill',
                        headerName: '实发数量',
                        type:'数量'
                    }, {
                        field: 'uom_name',
                        headerName: '单位'
                    }, {
                        field: 'price_bill_f',
                        headerName: '标准单价',
                        type:'金额'
                    }, {
                        field: 'discount_tax',
                        headerName: '应用折扣率'
                    },{
                        field: 'wtpricec_bill_f',
                        headerName: '折后单价',
                        type:'金额'
                    }, {
                        field: 'wtamount_bill_f',
                        headerName: '金额',
                        type:'金额'
                    }, {
                        field: 'cubage',
                        headerName: '总体积',
                        type:'体积'
                    }, {
                        field: 'weight',
                        headerName: '总重量',
                        type:'金额'
                    }, {
                        field: 'qty_recbill',
                        headerName: '签收数量',
                        type:'数量'
                    }]
                };

                /*---------------------------------网格方法------------------------------------------*/
                /**
                 * 网格复制产品数据方法
                 */
                /*function getItem(code,args) {
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
                                $scope.data.currItem.epm_contract_items.forEach(function (val) {
                                    if(val.item_code == data.item_orgs[0].item_code){
                                        swalApi.info('不能选择重复产品，请重新选择!');
                                        a = 0;
                                    }
                                });
                                if(a==1){
                                    args.data.item_id = data.item_orgs[0].item_id;
                                    args.data.item_code = data.item_orgs[0].item_code;
                                    args.data.item_name = data.item_orgs[0].item_name;
                                    args.data.model = data.item_orgs[0].item_model;//型号
                                    args.data.unit = data.item_orgs[0].uom_name;//单位
                                }
                            }else{
                                swalApi.info("产品编码【"+code+"】不可用");
                            }
                        });
                }*/
                /*----------------------------------计算方法-------------------------------------------*/
                /**
                 * 附件不可编辑事件
                 */
                $scope.isFormReadonly = function (){
                    return true;
                };
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //合计出库数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill');
                    //合计金额
                    $scope.data.currItem.wtamount_total_f
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'wtamount_bill_f');
                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage');
                    //计算行
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),//出库数量
                            wtamount_bill_f: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'wtamount_bill_f'),//总价
                            cubage: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage'),//总体积
                            weight: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'weight'),//重量
                            qty_recbill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_recbill')//签收数量
                        }
                    ]);

                };
                /*----------------------------------按钮方法数据 定义-------------------------------------------*/

                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.inv_out_bill_lineofinv_out_bill_heads = [];
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //设置产品清单
                    $scope.gridOptions.hcApi.setRowData(bizData.inv_out_bill_lineofinv_out_bill_heads);
                    $scope.calSum();
                };

                /*----------------------------------按钮及标签---定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;
                /*底部右边按钮*/
                $scope.footerRightButtons.save.hide = true;
                /* 底部右边按钮-打印 */
                $scope.footerRightButtons.print.hide = false;

            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });