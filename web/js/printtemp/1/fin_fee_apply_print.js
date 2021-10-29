/**
 * 费用申请打印
 * 2019-03-18
 */
define(
    ['module', 'controllerApi', 'base_print_controller', 'numberApi'],
    function (module, controllerApi, base_print_controller, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$modalInstance', '$timeout', '$scope', 'printParams',
            function ($modalInstance, $timeout, $scope, printParams) {
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

                function getPrintSetup() {

                    var strStyle = "<style> table,td,th {border-width: 1px;border-style: solid;border-collapse: collapse}</style>";

                    //打印单标题
                    $scope.LODOP.ADD_PRINT_HTM(35,0,173,'14.8mm', "<h2>费用申请单</h2>");
                    $scope.LODOP.SET_PRINT_STYLEA(0,"Horient",2);//设置对象在纸张范围内水平居中,
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

                    //表头
                    $scope.LODOP.ADD_PRINT_HTM(91,20,'100%','29.6mm', $(window.parent.document).find('#div_1')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 11);

                    //明细表
                    $scope.LODOP.ADD_PRINT_HTM(162,20,'95%','88.8mm', strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

                    //底部信息
                    // $scope.LODOP.ADD_PRINT_TEXT(641,818,288,24, "打印人:" + strUserName + " 打印时间:" + new Date().Format('yyyy-MM-dd'));
                    // $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_HTM("130mm",25,120,'14.8mm', "<span style='font-size: 13px;'>创建人：" + $scope.data.currItem.creator + "</span>");
                    $scope.LODOP.ADD_PRINT_HTM("130mm",188,120,'14.8mm', "<span style='font-size: 13px;'>申请人：" + $scope.data.currItem.chap_name + "</span>");
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

                    //右上角二维码
                    $scope.LODOP.ADD_PRINT_BARCODE(10, "680", 90, 90, 'QRCode', "费用申请单【" + $scope.data.currItem.fee_apply_no + "】")

                }

                /**
                 * 设置打印任务名，打印纸张大小
                 */
                function setPrintTitle() {
                    $scope.LODOP.PRINT_INITA(0, 0, "297mm","210mm", "费用申请单【" + $scope.data.currItem.fee_apply_no + "】");
                    // $scope.LODOP.SET_PRINT_PAGESIZE(2, 2100, 1480, "");
                    // $scope.LODOP.SET_SHOW_MODE("LANDSCAPE_DEFROTATED",1);//横向时的正向显示

                    $scope.LODOP.NEWPAGEA();
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
                total_allow_amt_c: numberApi.moneyToRMB(data.total_allow_amt),
                total_finish_bx_amt: numberApi.sum(data.fin_fee_apply_lines, 'finish_bx_amt')
            });
            //数字转金额格式
            data.total_allow_amt = numberApi.toMoney(data.total_allow_amt);
            data.total_finish_bx_amt = numberApi.toMoney(data.total_finish_bx_amt);

            data.fin_fee_apply_lines.forEach(function (value, index) {
                value.allow_amt = numberApi.toMoney(value.allow_amt);
                value.finish_bx_amt = numberApi.toMoney(value.finish_bx_amt);
            });

            //日期格式化
            if(data.bx_end_date){
                data.bx_end_date = new Date(data.bx_end_date).Format('yyyy-MM-dd');
            }

            //明细表如果不足五行则增加五行空行
            if(data.fin_fee_apply_lines.length < 5){
                var voidLines = [];
                for(var i = 0; i < 5 - data.fin_fee_apply_lines.length; i++){
                    voidLines.push({});
                }

                Array.prototype.push.apply(data.fin_fee_apply_lines, voidLines);
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
                '                    <TD style="width: 33.3%"><font color="">申请单号：<SPAN>{{data.currItem.fee_apply_no}}</SPAN></font></TD>\n' +
                '                    <TD style="width: 33.3%"><font color="">年度：<SPAN></SPAN>{{data.currItem.cyear}}</font></TD>\n' +
                '                    <TD style="width: 33.3%"><font color="">月度：<SPAN></SPAN>{{data.currItem.cmonth}}</font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD style="width: 33.3%"><font color="">预算类别：<SPAN></SPAN>{{data.currItem.bud_type_name}}</font></TD>\n' +
                '                    <TD style="width: 33.3%"><font color="">报销截止时间：<SPAN>{{data.currItem.bx_end_date}}</SPAN></font></TD>\n' +
                '                    <TD style="width: 33.3%"><font color="">创建时间：<SPAN></SPAN>{{data.currItem.create_time}}</font></TD>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                    <TD colspan="3"><font color="">费用用途：<SPAN>{{data.currItem.purpose}}</SPAN></font></TD>\n' +
                '                </TR>\n' +
                '                </TBODY>\n' +
                '            </TABLE>\n' +
                '        </div>\n' +
                '        <div id="div_2">\n' +
                '            <TABLE border=1 cellSpacing=0 cellPadding=3 width="100%" height="320px"\n' +
                '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                '                   bordercolor=\'#333333\'>\n' +
                '                <TR style="height: 23px">\n' +
                // '                <th rowspan="2" style="width: 50px;">序号</th>\n' +
                '                <th rowspan="2">费用项目</th>\n' +
                '                <th rowspan="2">费用承担部门</th>\n' +
                '                <th colspan="2">费用申请</th>\n' +
                '                <th rowspan="2">备注</th>\n' +
                '                </TR>\n' +
                '                <TR>\n' +
                '                <th>批准金额</th>\n' +
                '                <th>已报销金额</th>\n' +
                '                </TR>\n' +
                '                <TBODY>\n' +
                '                <TR ng-repeat="item in data.currItem.fin_fee_apply_lines" style="height: 27px">\n' +
                // '                    <TD>{{$index+1}}</TD>\n' +
                '                    <TD style="width: 20%">{{item.fee_name}}</TD>\n' +
                '                    <TD style="width: 20%">{{item.fee_org_name}}</TD>\n' +
                '                    <TD style="text-align: right;width: 12%">{{item.allow_amt}}</TD>\n' +
                '                    <TD style="text-align: right;width: 12%">{{item.finish_bx_amt}}</TD>\n' +
                '                    <TD style="width: 30%">{{item.note}}</TD>\n' +
                '                </TR>\n' +

                //小计
                '                <TR style="height: 27px">\n' +
                '                    <TD>小计</TD>\n' +
                '                    <TD></TD>\n' +
                '                    <TD style="text-align: right">{{data.currItem.total_allow_amt}}</TD>\n' +
                '                    <TD style="text-align: right">{{data.currItem.total_finish_bx_amt}}</TD>\n' +
                '                    <TD></TD>\n' +
                '                </TR>\n' +

                //合计金额（小写、大写）
                '                <TR style="height: 27px">\n' +
                '                    <TD colspan="2">合计小写:{{data.currItem.total_allow_amt}}</TD>\n' +
                '                    <TD colspan="3">大写:{{data.currItem.total_allow_amt_c}}</TD>\n' +
                '                </TR>\n' +

                //审批意见区
                '                <TR ng-if="data.currItem.opinions.length>0">\n' +
                '                    <TD colspan="7">' +
                '                       <div ng-repeat="item in data.currItem.opinions">' +
                '                           {{item.procname}}({{item.userid}}) : {{item.opinion}}</div>\n' +
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
