/**
 * Created by 钟昊良 on 2019/11/5.
 * 工程要货订单打印模板
 */
define(
    ['module', 'controllerApi', 'base_print_controller', 'numberApi', 'requestApi', '$q', 'dateApi'],
    function (module, controllerApi, base_print_controller, numberApi, requestApi, $q, dateApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$modalInstance', '$timeout', '$scope', 'printParams',
            function ($modalInstance, $timeout, $scope, printParams) {
                /**==============这里不用改 ==================**/
                $scope.modalInstance = $modalInstance;//模态窗实例
                $scope.printTemplate = printParams.printTemplate; //打印模板配置信息
                $scope.data = printParams.data;//数据;
                $scope.printType = printParams.printType;//打印类型

                /**==============要让用户只预览（默认，可不写) ========**/
                //$scope.printMode = 'preview';
                /**==============要让用户可维护布局 =========**/
                $scope.printMode = 'setup';
                /**================= 打印设计模式 可以生成代码==============**/
                    //$scope.printMode = 'design';
                $scope.getPrintSetup = getPrintSetup;

                /**
                 * 设置打印任务名，打印纸张大小
                 */
                function setPrintTitle() {
                    // $scope.LODOP.PRINT_INITA(0, 0, "297mm", "210mm", "工程要货订单");
                    // $scope.LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                    $scope.LODOP.PRINT_INITA(0, 0, "210mm","297mm", "工程要货订单");

                    $scope.LODOP.NEWPAGEA();
                }

                $scope.setPrintTitle = setPrintTitle;

                $scope.getPrintSetup = getPrintSetup;

                function getPrintSetup() {
                    $scope.LODOP.ADD_PRINT_HTM(20, 320, 173, 36, "<h3> 工程要货订单</h3>");
                    var strStyle = "<style> table,td,th {border-width: 0px;border-style: solid;border-collapse: collapse}</style>";
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 20);
                    //$scope.LODOP.ADD_PRINT_TEXT(35, 455, 173, 36, "工程要货订单");
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 11);
                    //$scope.LODOP.ADD_PRINT_HTM(91, 25, 1080, 268, $(window.parent.document).find('#div_1')[0].innerHTML);
                    //$scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_TABLE('5%',5,'200mm','95%', strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                }

                controllerApi.run({
                    controller: base_print_controller.controller,
                    scope: $scope,
                    $modalInstance: $modalInstance
                });
            }
        ];

        /**
         * 打印前处理数据
         * @param data
         * @returns {*}
         */
        function beforePrint(currItem) {
            //时间格式化
            currItem.date_invbill = dateApi.DateFormatter(currItem.date_invbill);
            currItem.in_date = dateApi.DateFormatter(currItem.in_date);
            currItem.discount_valid_date = dateApi.DateFormatter(currItem.discount_valid_date);
            if(currItem.contract_expire_date != null && currItem.contract_expire_date != undefined && currItem.contract_expire_date != ""){
                currItem.contract_expire_date = dateApi.DateFormatter(currItem.contract_expire_date);
            }

            currItem.may_consignment_amount = numberApi.toMoney(currItem.may_consignment_amount) + '元';

            currItem.amount_total = numberApi.toMoney(currItem.amount_total) + '元';
            currItem.wtamount_bill = numberApi.toMoney(currItem.wtamount_bill) + '元';
            
            [
                'province_name',
                'city_name',
                'county_name',
                'address1'
            ].forEach(function(field, index){
                if(index == 0){
                    currItem.address = currItem[field];
                }else{
                    currItem.address += '-' + currItem[field];
                }
                
            });
            currItem.sa_out_bill_lines.forEach(function (value) {
                value.send_qty = numberApi.sub(numberApi.sub(value.qty_bill,value.confirm_out_qty),value.cancel_qty);
                //金额格式化
                value.price_bill = numberApi.toMoney(value.price_bill);
                value.discounted_price = numberApi.toMoney(value.discounted_price);
                value.wtamount_bill = numberApi.toMoney(value.wtamount_bill);
            });
            var arr = [
                //订单状态
                {
                    field: 'order_stat',
                    dictcode: 'epm.require_bill.order_stat'
                },
                //订单类型
                {
                    field: 'bill_type',
                    dictcode: 'epm.bill_type'
                },
                //订单产品线
                {
                    field: 'order_pdt_line',
                    dictcode: 'epm.order_pdt_line'
                },
                //销售渠道
                {
                    field: 'channel',
                    dictcode: 'sales.channel'
                },
                //订单来源
                {
                    field: 'created_source',
                    dictcode: 'epm.created_source'
                },
                //扣款方式
                {
                    field: 'deductions_way',
                    dictcode: 'epm.deductions_way'
                },
                //签约方式
                {
                    field: 'contract_type',
                    dictcode: 'epm.contract_type'
                }
            ].map(function (item) {
                return requestApi.getDict(item.dictcode).then(function(dicts){
                    var dict = dicts.find(function (curDict) {
                        return curDict.dictvalue == currItem[item.field]
                    });

                    if (dict) {
                        currItem[item.field] = dict.dictname;
                    }
                });
            });

            return $q.all(arr).then(function () {
                return currItem;
            });
        }

        /**
         * 返回页面html
         * @returns {string}
         */
        function getPrintDomStr() {
            return '<div id="div_print">\n' +

                '        <div id="div_2">\n' +

                '            <TABLE border=0 cellSpacing=0 cellPadding=3 width=100% \n' +
                '                   style=\'font-size: small;border-collapse:collapse; font-size: 9px;\'\n' +
                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">要货订单单号：<SPAN>{{data.currItem.sa_salebillno}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">订单日期：<SPAN></SPAN>{{data.currItem.date_invbill}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="5"><font color="">申请人：<SPAN></SPAN>{{data.currItem.created_by_name}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">订单状态：<SPAN></SPAN>{{data.currItem.order_stat}}</font></th>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">客户编码：<SPAN>{{data.currItem.customer_code}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">客户名称：<SPAN></SPAN>{{data.currItem.customer_name}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="9"><font color="">交易公司：<SPAN></SPAN>{{data.currItem.trading_company_name}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">折扣单号：<SPAN>{{data.currItem.discount_apply_code}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">期望达到日期：<SPAN></SPAN>{{data.currItem.in_date}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="5"><font color="">订单类型：<SPAN></SPAN>{{data.currItem.bill_type}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">开票单位：<SPAN></SPAN>{{data.currItem.billing_unit_name}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">订单产品线：<SPAN>{{data.currItem.order_pdt_line}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">销售渠道：<SPAN></SPAN>{{data.currItem.channel}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="5"><font color="">余额账户：<SPAN></SPAN>{{data.currItem.account_name}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">可发货金额：<SPAN></SPAN>{{data.currItem.may_consignment_amount}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">订单来源：<SPAN>{{data.currItem.created_source}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">客户自编号：<SPAN></SPAN>{{data.currItem.dhl_no}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="5"><font color="">扣款方式：<SPAN></SPAN>{{data.currItem.deductions_way}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">折扣有效期至：<SPAN></SPAN>{{data.currItem.discount_valid_date}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">合同编码：<SPAN>{{data.currItem.contract_code}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">合同名称：<SPAN></SPAN>{{data.currItem.contract_name}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="5"><font color="">合作结束日期：<SPAN></SPAN>{{data.currItem.contract_expire_date}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">签约方式：<SPAN></SPAN>{{data.currItem.contract_type}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">收货人：<SPAN>{{data.currItem.take_man}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">联系电话：<SPAN></SPAN>{{data.currItem.phone_code}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="9"><font color="">收货地址：<SPAN></SPAN>{{data.currItem.address}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">折前总金额：<SPAN>{{data.currItem.amount_total}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">折后总金额：<SPAN></SPAN>{{data.currItem.wtamount_bill}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="9"><font color="">折扣率：<SPAN></SPAN>{{data.currItem.discount_rate}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">总数量：<SPAN>{{data.currItem.qty_sum}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">总体积：<SPAN></SPAN>{{data.currItem.total_cubage}}m³</font></th>\n' +
                '                    <th style="text-align: left;" colspan="5"><font color=""></font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color=""></font></th>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="15" style="height : 8px;"> </TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                   <th style="width: 19px; border:1px solid #333;">序号</th>\n' +
                '                   <th style="width: 20px;border:1px solid #333;">产品编码</th>\n' +
                '                   <th style="width: 22px;border:1px solid #333;" colspan="2">产品名称</th>\n' +
                '                   <th style="width: 20px;border:1px solid #333;">规格</th>\n' +
                '                   <th style="width: 36px;border:1px solid #333;">颜色</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">单位</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">本次下单数量</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">实发数量</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">未发数量</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">取消数量</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">标准单价</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">工程方单价</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">应用折扣率</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">折后单价</th>\n' +
                '                   <th style="width: 28px;border:1px solid #333;">折扣金额</th>\n' +
                '                </TR>\n' +
                '                <TBODY>\n' +
                '                <TR ng-repeat="item in data.currItem.sa_out_bill_lines" style="text-align: center;">\n' +
                '                    <TD style="border:1px solid #333;">{{$index+1}}</TD>\n' +
                '                    <TD style="border:1px solid #333;">{{item.item_code}}</TD>\n' +
                '                    <TD style="border:1px solid #333;" colspan="2">{{item.item_name}}</TD>\n' +
                '                    <TD style="border:1px solid #333;">{{item.specs}}</TD>\n' +//规格
                '                    <TD style="border:1px solid #333;">{{item.item_color}}</TD>\n' +
                '                    <TD style="border:1px solid #333;">{{item.uom_name}}</TD>\n' +
                '                    <TD style="border:1px solid #333;">{{item.qty_bill}}</TD>\n' +//本次下单数量
                '                    <TD style="border:1px solid #333;">{{item.confirm_out_qty}}</TD>\n' +//实发数量
                '                    <TD style="border:1px solid #333;">{{item.send_qty}}</TD>\n' +//未发数量

                '                    <TD style="border:1px solid #333;">{{item.cancel_qty}}</TD>\n' +//取消数量
                '                    <TD style="border:1px solid #333;">{{item.price_bill}}</TD>\n' +//标准单价
                '                    <TD style="border:1px solid #333;">{{item.contract_price}}</TD>\n' +//工程方单价
                '                    <TD style="border:1px solid #333;">{{item.discount_rate}}</TD>\n' +//应用折扣率
                '                    <TD style="border:1px solid #333;">{{item.discounted_price}}</TD>\n' +//折后单价
                '                    <TD style="border:1px solid #333;">{{item.wtamount_bill}}</TD>\n' +//折扣金额

                '                </TR>\n' +
                '                </TBODY>\n' +
                '\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '    </div>';
        }



        return {
            controller: controller,
            beforePrint: beforePrint,
            getPrintDomStr: getPrintDomStr
        }
    }
);

