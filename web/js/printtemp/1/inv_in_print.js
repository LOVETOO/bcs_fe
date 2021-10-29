/**
 * 销售出库打印
 * 2019.03.05
 * huderong
 */
define(
    ['module', 'controllerApi', 'base_print_controller', 'numberApi'],
    function (module, controllerApi, base_print_controller, numberApi) {
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


                /**==============让用户只预览（默认模式，可不写) ========**/
                $scope.printMode = 'preview';
                /**==============让用户可维护布局 =========**/
                $scope.printMode = 'setup';
                /**================= 打印设计模式 可以生成代码==============**/
                $scope.printMode = 'design';
                $scope.getPrintSetup = getPrintSetup;

                /**
                 * 获取打印布局设置
                 */
                function getPrintSetup() {
                    var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>"
                    // $scope.LODOP.SET_PRINT_STYLEA("ItemType", 1);
                    // $scope.LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
                    $scope.LODOP.ADD_PRINT_HTM(35, 0, 173, '14.8mm', "<h2>采购入库单</h2>");
                    $scope.LODOP.SET_PRINT_STYLEA(0, "Horient", 2);//设置对象在纸张范围内水平居中,
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 9);

                    //表头
                    $scope.LODOP.ADD_PRINT_HTM(73, 39, '100%', '29.6mm', $(window.parent.document).find('#div_1')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);

                    //明细表
                    $scope.LODOP.ADD_PRINT_HTM(153, 26, '95%', '88.8mm', strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);

                    //底部信息
                    $scope.LODOP.ADD_PRINT_TEXT("130mm", 561, 212, 23, "打印人:" + strUserName + " 打印时间:" + new Date().Format('yyyy-MM-dd'));
                    $scope.LODOP.ADD_PRINT_TEXT("130mm", 43, 96, 24, "创建：" + $scope.data.currItem.creator);
                    $scope.LODOP.ADD_PRINT_TEXT("130mm", 410, 83, 27, "收货：");
                    $scope.LODOP.ADD_PRINT_TEXT("130mm", 166, 85, 26, "审核：");
                    $scope.LODOP.ADD_PRINT_TEXT("130mm", 282, 95, 27, "采购：");

                    //右上角二维码
                    $scope.LODOP.ADD_PRINT_BARCODE(10, 680, 90, 90, 'QRCode', '采购入库单')
                }

                /**
                 * 设置打印任务名，打印纸张大小
                 */
                function setPrintTitle() {
                    $scope.LODOP.PRINT_INITA(0, 0, "297mm", "210mm", "采购入库单【" + $scope.data.currItem.invbillno + "】");
                    // $scope.LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                }

                $scope.setPrintTitle = setPrintTitle;

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
        function beforePrint(data) {
            //转换成中文大写
            angular.extend(data, {
                chinese_amount_total: numberApi.moneyToRMB(data.amount_total),
                amount_total: numberApi.toMoney(data.amount_total),
            });

            data.inv_in_bill_lines.forEach(function (row) {
                row.amount_bill = numberApi.toMoney(row.amount_bill);
                row.price_bill = numberApi.toMoney(row.price_bill);
            });
            //明细表如果不足五行则增加五行空行
            if (data.inv_in_bill_lines.length < 8) {
                var voidLines = [];
                for (var i = 0; i < 8 - data.inv_in_bill_lines.length; i++) {
                    voidLines.push({});
                }

                Array.prototype.push.apply(data.inv_in_bill_lines, voidLines);
            }
            return data;
        }

        /**
         * 返回页面html
         * @returns {string}
         */
        function getPrintDomStr() {
            return '<div id="div_print">\n' +
                '        <div id="div_1">\n' +
                '\n' +
                '            <TABLE border=0 cellSpacing=1 cellPadding=3\n' +
                '                   style=\'font-size:small;border-collapse:collapse;\'\n' +
                '                   width="100%">\n' +
                '                <TBODY>\n' +
                '                <TR>\n' +
                '                    <TD style="width: 33.3%"><font color="">供应商：<SPAN>{{data.currItem.vendor_name}}</SPAN></font></TD>\n' +
                '                    <TD style="width: 33.3%"><font color="">入库单号：<SPAN></SPAN>{{data.currItem.invbillno}}</font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD style="width: 33.3%"><font color="">仓库：<span>{{data.currItem.warehouse_code +"  "+data.currItem.warehouse_name}}</span></font>\n' +
                '                    </TD>\n' +
                '                    <TD style="width: 33.3%"><font color="">日期：<SPAN>{{data.currItem.create_date}}</SPAN></font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="2"><font color="">备注：<SPAN>{{data.currItem.note}}</SPAN></font></TD>\n' +
                '                </TR>\n' +
                '                </TBODY>\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '        <div id="div_2">\n' +
                '            <TABLE border=1 cellSpacing=0 cellPadding=3 width=100%  height="320px"\n' +
                '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                '                   bordercolor=\'#333333\'>\n' +
                '                <thead style="height: 18px">\n' +
                '                <td style="text-align: center;"> <strong>序号</strong></td>\n' +
                '                <td style="text-align: center;width: 50px;"><strong>商品编码</strong></td>\n' +
                '                <td style="text-align: center;"><strong>商品名称</strong></td>\n' +
                '                <td style="text-align: center;"><strong>单位</strong></td>\n' +
                '                <td style="text-align: center;"><strong>数量</strong></td>\n' +
                '                <td style="text-align: center;"><strong>含税价格</strong></td>\n' +
                '                <td style="text-align: center;"><strong>含税金额</strong></td>\n' +
                '                </thead>\n' +
                '                <TBODY>\n' +
                '                <TR style="height: 23px" ng-repeat="item in data.currItem.inv_in_bill_lines">\n' +
                '                    <TD style="text-align: center;width: 5%">{{$index+1}}</TD>\n' +
                '                    <TD style="width: 15%">{{item.item_code}}</TD>\n' +
                '                    <TD style="width: 40%">{{item.item_name}}</TD>\n' +
                '                    <TD style="text-align: center;width: 5%">{{item.uom_name}}</TD>\n' +
                '                    <TD style="text-align: center;">{{item.qty_invbill}}</TD>\n' +
                '                    <TD style="text-align: right;" >{{item.price_bill}}</TD>\n' +
                '                    <TD style="text-align: right;">{{item.amount_bill}}</TD>\n' +
                '                </TR>\n' +
                '                <TR style="height: 23px">\n' +
                '                    <TD style="width: 20%" colspan="3">合计金额:{{data.currItem.chinese_amount_total}}</TD>\n' +
                '                    <TD style="width: ">合计</TD>\n' +
                '                    <TD style="text-align: center;width: 12%">{{data.currItem.total_qty}}</TD>\n' +
                '                    <TD style="text-align: right;width: 12%">{{}}</TD>\n' +
                '                    <TD style="text-align: right;width: 12%">{{data.currItem.amount_total}}</TD>\n' +
                '                </TR>\n' +
                '                </TBODY>\n' +
                '\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '    </div>';
        }

        //返回控制器
        return {
            controller: controller,
            beforePrint: beforePrint,
            getPrintDomStr: getPrintDomStr
        }
    }
);
