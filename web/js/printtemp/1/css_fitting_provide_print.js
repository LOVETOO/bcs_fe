/**
 * Created by zhl on 2019/7/30.
 * 配件发放打印
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
                var currDocument = $(window.parent.document);

                /**==============要让用户只预览（默认，可不写) ========**/
                // $scope.printMode = 'preview';
                /**==============要让用户可维护布局 =========**/
                //$scope.printMode = 'setup';
                /**================= 打印设计模式 可以生成代码==============**/
                $scope.printMode = 'design';

                /**
                 * 设置打印任务名，打印纸张大小
                 */
                function setPrintTitle() {
                    $scope.LODOP.PRINT_INITA(0, 0, "297mm", "210mm", "配件发放单【" + $scope.data.currItem.bx_no + "】");
                    $scope.LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                }

                $scope.setPrintTitle = setPrintTitle;


                $scope.getPrintSetup = getPrintSetup;

                function getPrintSetup() {
                    var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>";
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 20);
                    $scope.LODOP.ADD_PRINT_TEXT(35, 455, 173, 36, "配件发放单");
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 11);
                    $scope.LODOP.ADD_PRINT_HTM(91, 25, 781, 62, $(window.parent.document).find('#div_1')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_HTM(178, 25, 1080, 447, strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_TEXT(641, 818, 288, 24, "打印人:" + strUserName + " 打印时间:" + new Date().Format('yyyy-MM-dd'));
                    $scope.LODOP.ADD_PRINT_TEXT(641, 25, 120, 24, "创建人：" + $scope.data.currItem.creator);
                    $scope.LODOP.ADD_PRINT_TEXT(641, 188, 120, 24, "报销人：" + $scope.data.currItem.chap_name);

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
            //转换成中文大写
            angular.extend(currItem, {
                total_allow_amt_c: numberApi.moneyToRMB(currItem.total_allow_amt)
            });
            return currItem;
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
                '                   width=900px>\n' +
                '                <TBODY>\n' +
                '                <TR>\n' +
                '                    <TD><font color="">报销单号：<SPAN>{{data.currItem.bx_no}}</SPAN></font></TD>\n' +
                '                    <TD><font color="">年度：<SPAN></SPAN>{{data.currItem.cyear}}</font></TD>\n' +
                '                    <TD><font color="">月度：<SPAN></SPAN>{{data.currItem.cmonth}}</font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD><font color="">申请单号：<SPAN>{{data.currItem.fee_apply_no}}</SPAN></font></TD>\n' +
                '                    <TD><font color="">预算类别：<SPAN></SPAN>{{data.currItem.bud_type_name}}</font></TD>\n' +
                '                    <TD><font color="">创建时间：<SPAN></SPAN>{{data.currItem.create_time}}</font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="2"><font color="">用途：<SPAN>{{data.currItem.purpose}}</SPAN></font></TD>\n' +
                '                </TR>\n' +
                '                </TBODY>\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '        <div id="div_2">\n' +
                '            <TABLE border=1 cellSpacing=0 cellPadding=3 width=1070px\n' +
                '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                '                   bordercolor=\'#333333\'>\n' +
                '                <TR>\n' +
                '                <th rowspan="2" style="width: 50px;">序号</th>\n' +
                '                <th rowspan="2">费用项目</th>\n' +
                '                <th rowspan="2">费用承担部门</th>\n' +
                '                <th colspan="2">费用申请</th>\n' +
                '                <th colspan="2">本次报销</th>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                <th>批准金额</th>\n' +
                '                <th>可报销金额</th>\n' +
                '                <th>申请金额</th>\n' +
                '                <th>批准金额</th>\n' +
                '                </TR>\n' +
                '                <TBODY>\n' +
                '                <TR ng-repeat="item in data.currItem.fin_fee_bx_lines">\n' +
                '                    <TD>{{$index+1}}</TD>\n' +
                '                    <TD>{{item.fee_name}}</TD>\n' +
                '                    <TD>{{item.fee_org_name}}</TD>\n' +
                '                    <TD>{{item.apply_check_amt}}</TD>\n' +
                '                    <TD>{{item.apply_check_amt-item.finish_bx_amt}}</TD>\n' +
                '                    <TD>{{item.apply_bx_amt}}</TD>\n' +
                '                    <TD>{{item.allow_bx_amt}}</TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="3">合计金额:{{data.currItem.total_allow_amt_c}}</TD>\n' +
                '                    <TD></TD>\n' +
                '                    <TD></TD>\n' +
                '                    <TD>{{data.currItem.total_apply_amt}}</TD>\n' +
                '                    <TD>{{data.currItem.total_allow_amt}}</TD>\n' +
                '                </TR>\n' +
                '                <TR ng-if="data.currItem.opinions.length>0">\n' +
                '                    <TD colspan="7">' +
                '                       <div ng-repeat="item in data.currItem.opinions">{{item.procname}}({{item.username}}) : {{item.opinion}}</div>\n' +
                '                    </TD>\n' +
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

