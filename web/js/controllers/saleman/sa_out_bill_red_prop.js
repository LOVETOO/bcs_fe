/**
 * 销售出库红冲-属性页
 * 2018-12-24
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'numberApi', 'loopApi','$modal',
        'swalApi','dateApi', 'fileApi'],
    function (module, controllerApi, base_obj_prop, requestApi, numberApi, loopApi,$modal,
              swalApi, dateApi, fileApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/

                $scope.data = $scope.data || {};
                $scope.data.currItem = $scope.data.currItem || {};

                function editable(args) {
                    if($scope.$eval('data.currItem.stat') == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions =    {
                    PinnedBottomRowData: [{seq: "合计"}],
                    columnDefs : [
                        {
                            type: '序号' 
                        }
                        ,{
                            field: 'invbillno',
                            headerName: '销售出库单号',
                            pinned: 'left'
                        }
                        ,{
                            field: 'item_code',
                            headerName: '产品编码',
                            pinned: 'left'
                        }
                        ,{
                            field: 'item_name',
                            headerName: '产品名称',
                            pinned: 'left'
                        }
                        ,{
                            field: 'warehouse_code',
                            headerName: '仓库编码'
                        }
                        ,{
                            field: 'warehouse_name',
                            headerName: '仓库名称'
                        }
                        ,{
                            field: 'qty_bill',
                            headerName: '原单出库数量',
                            type: '数量'
                        }
                        ,{
                            field: 'qty_red',
                            headerName: '本次红冲数量',
                            type: '数量',
                            hcRequired: true,
                            editable: function (args) {
                                return editable(args);
                            },
                            onCellValueChanged: function (args) {
                                if(args.data.qty_red){
                                    if(numberApi.toNumber(args.data.qty_red) > 0){
                                        args.data.qty_red = -(args.data.qty_red);
                                    }
                                }

                                $scope.calLineData();

                                $scope.calSum();
                            }
                        }
                        , {
                            field: 'price_bill',
                                headerName: '含税价(折前)',
                            type: '金额'
                        }
                        , {
                            field: 'amount_bill',
                            headerName: '含税金额(折前)',
                            type: '金额'
                        }
                        ,{
                            field: 'attribute41',
                            headerName: '凑整数量',
                            type:'数量'
                        }
                        ,{
                            field: 'uom_name',
                            headerName: '单位'
                        }
                        ,{
                            field: 'attribute51',
                            headerName: '包装体积',
                            type:'体积'
                        }
                        ,{
                            field: 'cubage',
                            headerName: '红冲体积',
                            type:'体积'
                        }
                        ,{
                            field: 'sum_red_out',
                            headerName: '累计红冲量',
                            type:'数量'
                        }
                        , {
                            field: 'saleprice_type_name',
                            headerName: '销售价格类型'
                        }
                        , {
                            field: 'remark',
                            headerName: '备注',
                            editable : function (args) {
                                return editable(args)
                            }
                        }
                    ]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 查部门
                 */
                $scope.chooseOrg = function () {
                    $modal.openCommonSearch({
                        classId:'dept'
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.dept_id = result.dept_id;
                            $scope.data.currItem.dept_code = result.dept_code;
                            $scope.data.currItem.dept_name = result.dept_name;
                        });
                };

                /**
                 * 查销售出库单（已审核）
                 */
                $scope.chooseFeeBud = function (){
                    $modal.openCommonSearch({
                        classId:'inv_out_bill_head',
                        sqlWhere: " stat = 5"//查询条件
                    })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem = angular.extend({}, result);

                            $scope.data.currItem.parentbillid = result.inv_out_bill_head_id;
                            $scope.data.currItem.parent_billno = result.invbillno;
                            $scope.data.currItem.invbillno = '';

                            $scope.data.currItem.inv_out_bill_head_id = 0;

                            $scope.newBizData($scope.data.currItem);

                            return requestApi.post('inv_out_bill_head', 'select', {
                                inv_out_bill_head_id: $scope.data.currItem.parentbillid
                            })
                        })
                        .then(function (response) {
                            var invlines = response.inv_out_bill_lineofinv_out_bill_heads.slice(0);
                            var validLines = [];
                            //设置数据
                            loopApi.forLoop(invlines.length, function (i) {
                                //设置父单据明细id
                                invlines[i].p_inv_out_bill_line_id = invlines[i].inv_out_bill_line_id;
                                //设置父单据号
                                invlines[i].invbillno = $scope.data.currItem.parent_billno;
                                //已红冲完的明细不带出（出库数量【正数】+累计红冲数量【负数】 = 0）
                                if(numberApi.sum(invlines[i].qty_bill, invlines[i].sum_red_out) == 0){
                                    delete invlines[i];
                                }

                                if(typeof(invlines[i]) !== 'undefined'){
                                    validLines.push(invlines[i]);
                                }
                            });

                            $scope.gridOptions.hcApi.setRowData(validLines);
                            $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads = validLines;

                            $scope.calLineData();

                            $scope.calSum();
                        })
                };
                /**
                 * 计算合计数据
                 */
                $scope.calSum = function () {
                    //合计数量
                    $scope.data.currItem.qty_sum
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_red');
                    //合计体积
                    $scope.data.currItem.total_cubage
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage');
                    //合计金额
                    $scope.data.currItem.amount_total
                        = numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill');
                    $scope.gridOptions.api.setPinnedBottomRowData([
                        {
                            seq: '合计',
                            qty_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_bill'),//原出库数量
                            qty_red: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'qty_red'),//本次红冲数量
                            amount_bill: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'amount_bill'),//含税金额（折前）
                            cubage: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'cubage'),//红冲体积
                            sum_red_out: numberApi.sum($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads, 'sum_red_out')//累计红冲量
                        }
                    ]);
                };

                /*-------------------通用查询结束---------------------*/


                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.billtypecode = '0204';
                    bizData.inv_out_type = 2;
                    bizData.bluered = 'R';//红冲单

                    bizData.date_invbill = dateApi.today();
                    bizData.year_month = new Date(bizData.date_invbill).Format('yyyy-MM');

                    bizData.create_time = dateApi.now();

                    bizData.inv_out_bill_lineofinv_out_bill_heads = [];
                };


                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);


                    $scope.gridOptions.hcApi.setRowData(bizData.inv_out_bill_lineofinv_out_bill_heads);

                    $scope.calSum();
                };

                /**
                 * 保存前验证
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var lines = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.slice(0);

                    if(!lines.length){
                        invalidBox.push('明细不能为空');
                    }
                    //检验‘本次红冲数量’值（负数，红冲数量绝对值小于等于（原单出库数量 - |累计红冲数量|））
                    else{
                        loopApi.forLoop(lines.length, function (i) {
                            var qty_red = numberApi.toNumber(lines[i].qty_red);
                            var qty_bill = numberApi.toNumber(lines[i].qty_bill);
                            var sum_red_out = numberApi.toNumber(lines[i].sum_red_out);
                            var dif = qty_bill - Math.abs(sum_red_out);
                            if(qty_red == 0){
                                invalidBox.push('第' + (i+1) + '行【本次红冲数量】不能为0！');
                            }
                            else if(Math.abs(qty_red) > (dif)){
                                invalidBox.push('第' + (i+1) + '行【本次红冲数量】绝对值必须小于等于【' + dif + '】！');
                            }
                        });

                    }
                };


                /**
                 * 明细行值计算
                 */
                $scope.calLineData = function () {
                    var lineData = $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads;

                    loopApi.forLoop(lineData.length, function (i) {
                        //含税金额（折前） = 红冲数量*含税价格（折前）
                        if(lineData[i].qty_red && lineData[i].price_bill){
                            lineData[i].amount_bill = numberApi.toNumber(lineData[i].qty_red)
                                * numberApi.toNumber(lineData[i].price_bill);
                        }
                        //折让金额 = 含税金额（折前）*折扣率
                        if(lineData[i].amount_bill && numberApi.toNumber(lineData[i].discount_tax) >= 0){
                            lineData[i].wtamount_discount = numberApi.toNumber(lineData[i].discount_tax)
                                * numberApi.toNumber(lineData[i].amount_bill);
                        }
                        //含税价（折后） = 含税价(折前) * （1-折扣率/100）
                        if(lineData[i].price_bill && numberApi.toNumber(lineData[i].discount_tax) >= 0){
                            lineData[i].price_bill_f = numberApi.toNumber(lineData[i].price_bill)
                                * (1 - (numberApi.toNumber(lineData[i].discount_tax)));
                        }
                        //含税金额（折后） = 红冲数量*含税价格（折后）
                        if(lineData[i].qty_red && lineData[i].price_bill_f){
                            lineData[i].amount_bill_f = numberApi.toNumber(lineData[i].qty_red)
                                * numberApi.toNumber(lineData[i].price_bill_f);
                        }
                        //体积 = 红冲数量*包装体积
                        if(lineData[i].attribute51 && lineData[i].qty_red){
                            lineData[i].cubage = numberApi.toNumber(lineData[i].qty_red)
                                * numberApi.toNumber(lineData[i].attribute51);
                        }
                    });

                    $scope.gridOptions.hcApi.setRowData(lineData);
                };


                /**
                 * 单据日期值改变事件
                 */
                $scope.dateChangeEvent = function () {
                    if($scope.data.currItem.date_invbill){
                        $scope.data.currItem.year_month
                            = new Date($scope.data.currItem.date_invbill).Format('yyyy-MM');
                    }
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if(idx < 0){
                        swalApi.info('请选中要删除的行');
                    }else{
                        $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.splice(idx,1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads);
                    }
                    $scope.calSum();
                };


                /**
                 * 标签页
                 */
                $scope.tabs.attach.hide = true;

                //按钮
                $scope.footerLeftButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                }

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
