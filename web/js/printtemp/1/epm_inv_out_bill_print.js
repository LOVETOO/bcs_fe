/**
 * Created by 钟昊良 on 2019/11/5.
 * 工程出库单打印模板
 */
define(
    ['module', 'controllerApi', 'base_print_controller', 'numberApi', 'requestApi'],
    function (module, controllerApi, base_print_controller, numberApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$modalInstance', '$timeout', '$scope', 'printParams',
            function ($modalInstance, $timeout, $scope, printParams) {
                /**==============这里不用改 ==================**/
                $scope.modalInstance = $modalInstance;//模态窗实例
                $scope.printTemplate = printParams.printTemplate; //打印模板配置信息
                $scope.data = printParams.data;//数据;
                //明细金额保留两位小数
                $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads.forEach(function(cur,idx){
                    //标准单价
                    $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads[idx].price_bill_f
                        = numberApi.toMoney(cur.price_bill_f);
                    //折后单价
                    $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads[idx].wtpricec_bill_f
                        = numberApi.toMoney(cur.wtpricec_bill_f);
                    //金额
                    $scope.data.currItem.inv_out_bill_lineofinv_out_bill_heads[idx].wtamount_bill_f
                        = numberApi.toMoney(cur.wtamount_bill_f);
                });

                //$scope.data.currItem.printUserName = strUserName + " 打印"+ $scope.data.currItem.printtimes +"次 " + new Date().Format('yyyy-MM-dd hh:mm:ss');

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
                    $scope.LODOP.PRINT_INITA(0, 0, "210mm","297mm", "出库单信息");
                    //$scope.LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                    //$scope.LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
                    $scope.LODOP.NEWPAGEA();
                }

                $scope.setPrintTitle = setPrintTitle;

                $scope.getPrintSetup = getPrintSetup;

                function getPrintSetup() {
                    var strStyle = "<style> table,td,th {border-width: 0px;border-style: solid;border-collapse: collapse}</style>";
                    //$scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    //$scope.LODOP.SET_PRINT_STYLE("FontSize", 20);
                    //$scope.LODOP.ADD_PRINT_TEXT(35, 455, 173, 36, "出库单信息");
                    $scope.LODOP.ADD_PRINT_HTM(20, 320, 173, 36, "<h3>出库单信息</h3>");
                    $scope.LODOP.ADD_PRINT_HTM(25, '70%', 200, 22,
                        "<SPAN style='font-size: 10px;'>" +strUserName + " 打印"+ $scope.data.currItem.printtimes +"次 " + new Date().Format('yyyy-MM-dd hh:mm:ss') + "</SPAN>");
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 20);
                    $scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    $scope.LODOP.SET_PRINT_STYLE("FontSize", 11);
                    //$scope.LODOP.SET_PRINT_STYLE("ItemType", 1);
                    //$scope.LODOP.SET_PRINT_STYLE("FontSize", 11);
                    //$scope.LODOP.ADD_PRINT_HTM(116, 21, 1080, 108, $(window.parent.document).find('#div_1')[0].innerHTML);
                    //$scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    $scope.LODOP.ADD_PRINT_TABLE('5%',5,'200mm','94%', strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    // $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);
                    LODOP.ADD_PRINT_HTM('99%','45%',100,30,"<font style='font-size:12px' format='##'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'>共##页</span></font>");
                    LODOP.SET_PRINT_STYLEA(0,"ItemType",1);//循环上一命令（页码）
                    

                    /**
                     * 打印完成后的回调
                     * @param taskId
                     * @param value 打印次数
                     * @constructor
                     */
                    $scope.LODOP.On_Return = function (taskId, value) {
                        $scope.data.currItem.printtimes = numberApi.sum($scope.data.currItem.printtimes, value);
                        if (value > 0) {
                            var postData = {
                                printtimes: $scope.data.currItem.printtimes,
                                inv_out_bill_head_id: $scope.data.currItem.inv_out_bill_head_id
                            };
                            return requestApi.post('inv_out_bill_head', 'updateprint', postData);
                        }
                    }

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
            
            currItem.wtamount_total_f = numberApi.toMoney(currItem.wtamount_total_f) + '元';

            var arr = [
                //订单类型
                {
                    field: 'order_type',
                    dictcode: 'epm.bill_type'
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

            return currItem;
        }

        /**
         * 返回页面html
         * @returns {string}
         */
        function getPrintDomStr() {
            return '<div id="div_print">\n' +
                '        <div id="div_2">\n' +
                '            <TABLE border=0 cellSpacing=0 cellPadding=3 width=100%\n' +
                '                   style=\'font-size: small;border-collapse:collapse;font-size: 9px;\'>\n' +
                // '                <TR>\n' +
                // '                    <th style="text-align: left;" colspan="9"><font color=""></font></th>\n' +
                // '                    <th style="text-align: left;" colspan="6"><font color="">{{data.currItem.printUserName}}</font></th>\n' +
                // '                </TR>\n' +
                '                <TR>\n' +
                '                    <th style="text-align: left;"><font color=""></font></th>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">ERP出库单号：<SPAN>{{data.currItem.invbill_sap_no}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="6"><font color="">经销商编码：<SPAN></SPAN>{{data.currItem.customer_code}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">经销商名称：<SPAN></SPAN>{{data.currItem.customer_name}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;"><font color=""></font></th>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">订单类型：<SPAN>{{data.currItem.order_type}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="6"><font color="">法人客户名称：<SPAN></SPAN>{{data.currItem.legal_entity_name}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">提货人：<SPAN></SPAN>{{data.currItem.take_man}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;"><font color=""></font></th>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">总体积：<SPAN>{{data.currItem.total_cubage}}m³</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="6"><font color="">总数量：<SPAN></SPAN>{{data.currItem.qty_sum}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">总金额：<SPAN></SPAN>{{data.currItem.wtamount_total_f}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;"><font color=""></font></th>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">合同编号：<SPAN>{{data.currItem.contract_code}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="6"><font color="">广告费点数：<SPAN></SPAN>{{data.currItem.attribute4}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">返点点数：<SPAN></SPAN>{{data.currItem.attribute5}}</font></th>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                    <th style="text-align: left;"><font color=""></font></th>\n' +
                '                    <th style="text-align: left;" colspan="3"><font color="">车牌号：<SPAN>{{data.currItem.plate_number}}</SPAN></font></th>\n' +
                '                    <th style="text-align: left;" colspan="6"><font color="">发货日期：<SPAN></SPAN>{{data.currItem.outbill_date.substr(0,10)}}</font></th>\n' +
                '                    <th style="text-align: left;" colspan="4"><font color="">备注：<SPAN></SPAN>{{data.currItem.note}}</font></th>\n' +
                '                </TR>\n' +
                
                '                <TR>\n' +
                '                    <TD colspan="15" style="height : 8px;"> </TD>\n' +
                '                </TR>\n' +

                '                <TR>\n' +
                '                <th style="width: 19px;border:1px solid #333;">序号</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">产品编码</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">产品名称</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">订单单号</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">产品规格</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">颜色</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">色号</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">实发数量</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">单位</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">标准单价</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">应用折扣率</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">折后单价</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">金额</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">体积</th>\n' +
                '                <th style="width:150px;border:1px solid #333;">重量</th>\n' +
                '                </TR>\n' +
                '                <TBODY>\n' +
                '                <TR ng-repeat="item in data.currItem.inv_out_bill_lineofinv_out_bill_heads" style="text-align: center;">\n' +
                '                    <TD  style="border:1px solid #333;">{{$index+1}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.item_code}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.item_name}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.sa_salebillno}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.specs}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.item_color}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.batch_no}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.qty_bill}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.uom_name}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.price_bill_f}}</TD>\n' +//.toFixed(2)
                '                    <TD  style="border:1px solid #333;">{{item.discount_tax}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.wtpricec_bill_f}}</TD>\n' +//.toFixed(2)
                '                    <TD  style="border:1px solid #333;">{{item.wtamount_bill_f}}</TD>\n' +//.toFixed(2)
                '                    <TD  style="border:1px solid #333;">{{item.cubage}}</TD>\n' +
                '                    <TD  style="border:1px solid #333;">{{item.weight}}</TD>\n' +
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

