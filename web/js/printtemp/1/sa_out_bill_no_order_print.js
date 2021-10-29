/**
 * 销售出库打印
 */
define(
    ['module', 'controllerApi', 'base_print_controller', '$q', 'numberApi'],
    function (module, controllerApi, base_print_controller, $q, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$modalInstance', '$timeout', '$scope', 'data', 'printTemplate',
            function ($modalInstance, $timeout, $scope, data, printTemplate) {
                $scope.printTemplate = printTemplate; //打印模板配置信息
                $scope.modalInstance = $modalInstance;//模态窗实例
                $scope.data = data;//数据;

                $scope.getPrintSetup = getPrintSetup;

                function getPrintSetup() {

                    $scope.LODOP.PRINT_INITA(0, 0, "297mm", "210mm", "销售出库单【" + $scope.data.currItem.invbillno + "】");
                    $scope.LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                    var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
                    $scope.LODOP.SET_PRINT_STYLEA("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    $scope.LODOP.ADD_PRINT_TEXT(5,463,136,21, "销售出库单");
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 9);
                    $scope.LODOP.ADD_PRINT_HTM(49,35,1100,94, $(window.parent.document).find('#div_1')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_HTM(187,11,1105,104, strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_TEXT(306,832,288,23, "打印人:" + strUserName + " 打印时间:" + new Date().Format('yyyy-MM-dd'));

                    $scope.printMode = 'design';

                }

                controllerApi.run({
                    controller: base_print_controller.controller,
                    scope: $scope,
                    $modalInstance: $modalInstance
                });

            }
        ];

        /**
         * 打印前 处理数据
         * @param data
         * @returns {*}
         */
        function beforePrint(data) {
            //转换成中文大写
            angular.extend(data, {
                chinese_amount_total: numberApi.moneyToRMB(data.amount_total)
            });

            return data;
        }

        function getPrintDomStr() {
            return '<div id="div_print">\n' +
                '        <div id="div_1">\n' +
                '\n' +
                '            <TABLE border=0 cellSpacing=1 cellPadding=3\n' +
                '                   style=\'font-size:small;border-collapse:collapse;\'\n' +
                '                   width=1100px>\n' +
                '                <TBODY>\n' +
                '                <TR>\n' +
                '                    <TD colspan="2"><font >客户：<SPAN>{{data.currItem.customer_name}}</SPAN></font></TD>\n' +
                '                    <TD><font >出库单号：<SPAN></SPAN>{{data.currItem.invbillno}}</font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="2"><font>出仓库：<span>{{data.currItem.warehouse_code +"  "+data.currItem.warehouse_name}}</span></font></TD>\n' +
                '                    <TD><font >日期：<SPAN>{{data.currItem.create_time}}</SPAN></font></TD>\n' +
                '                </TR>\n' +
                '                <tr>\n' +
                '                    <TD><font >收货人：<SPAN>{{data.currItem.take_man}}</SPAN></font></TD>\n' +
                '                    <TD><font >收货电话：<SPAN>{{data.currItem.phone_code}}</SPAN></font></TD>\n' +
                '                    <TD><font >收货地址：<SPAN>{{data.currItem.address1}}</SPAN></font></TD>\n' +
                '                </tr>\n' +
                '                <tr>\n' +
                '                    <TD colspan="3"><font >备注：<SPAN>{{data.currItem.note}}</SPAN></font></TD>\n' +
                '                </tr>\n' +
                '                </TBODY>\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '        <div id="div_2">\n' +
                '            <TABLE border=1 cellSpacing=0 cellPadding=3 width=1100px\n' +
                '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                '                   bordercolor=\'#333333\'>\n' +
                '                <thead>\n' +
                '                <td>序号</td>\n' +
                '                <td style="width: 50px;">商品编码</td>\n' +
                '                <td>商品名称</td>\n' +
                '                <td>单位</td>\n' +
                '                <td>数量</td>\n' +
                '                <td>单价</td>\n' +
                '                <td>金额</td>\n' +
                '                </thead>\n' +
                '                <TBODY>\n' +
                '                <TR ng-repeat="item in data.currItem.inv_out_bill_lineofinv_out_bill_heads">\n' +
                '                    <TD>{{$index+1}}</TD>\n' +
                '                    <TD>{{item.item_code}}</TD>\n' +
                '                    <TD>{{item.item_name}}</TD>\n' +
                '                    <TD>{{item.uom_name}}</TD>\n' +
                '                    <TD>{{item.qty_bill}}</TD>\n' +
                '                    <TD>{{item.price_bill}}</TD>\n' +
                '                    <TD>{{item.amount_bill}}</TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="3">合计金额:{{data.currItem.chinese_amount_total}}</TD>\n' +
                '                    <TD>合计</TD>\n' +
                '                    <TD>{{data.currItem.total_qty}}</TD>\n' +
                '                    <TD></TD>\n' +
                '                    <TD>{{data.currItem.amount_total}}</TD>\n' +
                '                </TR>\n' +
                '                </TBODY>\n' +
                '\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '    </div>'
        }


        return {
            controller: controller,
            beforePrint: beforePrint,
            getPrintDomStr: getPrintDomStr
        }
    }
);
