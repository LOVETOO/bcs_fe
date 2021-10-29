/**
 * 工程项目报价打印
 * 2019-08-28
 * zjh
 */
define(
    ['module', 'controllerApi', 'base_print_controller', 'numberApi', 'dateApi', 'requestApi', '$q', 'directive/hcImg'],
    function (module, controllerApi, base_print_controller, numberApi, dateApi, requestApi, $q) {
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
                    $scope.LODOP.ADD_PRINT_HTM(20,320,173,'14.8mm', "<h3>  工程报价单</h3>");
                    //$scope.LODOP.SET_PRINT_STYLEA(0,"Horient",2);//设置对象在纸张范围内水平居中,
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
                    // //明细表
                    $scope.LODOP.ADD_PRINT_TABLE('5%',4,'200mm','95%', strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    //$scope.LODOP.ADD_PRINT_HTM(40,10,'200mm','88%', strStyle + $(window.parent.document).find('#div_2')[0].innerHTML);
                    //$scope.LODOP.ADD_PRINT_TABLE(40,10,'200mm','85%', document.getElementById("table_print").innerHTML);
                    $scope.LODOP.SET_PRINT_STYLEA(0, "ItemType", 0);

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
                                pdt_quoted_price_id: $scope.data.currItem.pdt_quoted_price_id
                            };
                            return requestApi.post('epm_pdt_quoted_price', 'updateprint', postData);
                        }
                    }
                }

                /**
                 * 设置打印任务名，打印纸张大小
                 */
                function setPrintTitle() {
                    $scope.LODOP.PRINT_INITA(0, 0, "210mm","297mm", "工程报价单");

                    $scope.LODOP.NEWPAGEA();
                }

                $scope.setPrintTitle = setPrintTitle;

                controllerApi.extend({
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
            data.atm = 0;
            //合计金额
            data.epm_pdt_quoted_price_lines.forEach(function (value) {
                data.atm = numberApi.sum(data.atm, value.quoted_amt);
                //金额格式化
                value.market_price = numberApi.toMoney(value.market_price);
                value.quoted_price = numberApi.toMoney(value.quoted_price);
                value.quoted_amt = numberApi.toMoney(value.quoted_amt);

                value.tax_rate = numberApi.toMoney(value.tax_rate);
                var str=Number(value.tax_rate*100).toFixed(2);
                value.tax_rate = str + "%";
                value.no_tax_contract_price = numberApi.toMoney(value.no_tax_contract_price);
                if(value.item_class3_name == undefined || value.item_class3_name == "" || value.item_class3_name == null){
                    value.item_class3_name = value.item_name;
                }
            });
            data.atm = numberApi.toMoney(data.atm);
            //初始化时间
            data.dateTime = new Date().Format('yyyy年MM月dd日');

            //格式化日期
            data.quoted_date = dateApi.DateFormatter(data.quoted_date);

            /*===============词汇值映射开始===============*/
            //是否映射
            ['tax_included', 'freight_included'].forEach(function (key) {
                if(data[key] == 1){
                    data[key] = '否';
                }else{
                    data[key] = '是';
                }
            });

            //异步承诺
            var arr = [
                //报价有效期
                {
                    field: 'valid_time_limit',
                    dictcode: 'epm.quoted.valid_time_limit'
                },
                //报价类型
                {
                    field: 'quoted_type',
                    dictcode: 'epm.quoted_type'
                }
            ].map(function (item) {
                return requestApi
                    .post({
                        classId: "epm_pdt_quoted_price",
                        action: 'dictcode',
                        data: {
                            dictcode : item.dictcode
                        }
                    })
                    .then(function (dict) {
                        dict.dictcodes.some(function (value) {
                            if(data[item.field] == value.dictvalue){
                                data[item.field] = value.dictname;
                                return true;
                            }
                        });
                    });
            });

            //明细表词汇值映射异步承诺
            arr = arr.concat([
                //品牌
                {
                    filed : 'brand',
                    dictcode : 'epm.quoted.brand'
                },
                //产地
                {
                    filed : 'orgin',
                    dictcode : 'epm.quoted.orgin'
                }
            ].map(function (item) {
                return requestApi
                    .post({
                        classId: "epm_pdt_quoted_price",
                        action: 'dictcode',
                        data: {
                            dictcode : item.dictcode
                        }
                    })
                    .then(function (dict) {
                        data.epm_pdt_quoted_price_lines.forEach(function (value) {
                            //映射
                            dict.dictcodes.some(function (dictCode) {
                                if(value[item.filed] == dictCode.dictvalue){
                                    value[item.filed] = dictCode.dictname;
                                    return true;
                                }
                            });
                        });
                    })
            }));

            /*===============词汇值映射结束===============*/
            //明细表如果不足七行则增加七行空行
            /*if(data.epm_pdt_quoted_price_lines.length < 7){
                var voidLines = [];
                for(var i = 0; i < 7 - data.epm_pdt_quoted_price_lines.length; i++){
                    voidLines.push({});
                }

                Array.prototype.push.apply(data.epm_pdt_quoted_price_lines, voidLines);
            }*/
            return $q.all(arr).then(function () {
                if (data.quoted_type == "常规工程报价"){
                    data.quoted_type = "工程报价";
                }
                return data;
            });
        }

        /**
         * 返回页面html
         * @returns {string}
         */
        function getPrintDomStr(data) {
            if(data.currItem.show_number < 2 && data.currItem.quoted_type == 1){//显示数量&&常规工程
                return '<div id="div_print">\n' +
                    '        <div id="div_2">\n' +
                    '            <TABLE border=1 cellSpacing=0 cellPadding=3 width="100%" height="320px"\n' +
                    '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                    '                   bordercolor=\'#333333\'>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="15"><img src="/web/img/arrow.190926.jpg" style="width: 100px;"></TD>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="7" rowspan="2" style="text-align: left;font-size: 11px;">项目名称：{{data.currItem.project_name}}</th>\n' +
                    '                   <th colspan="4" style="text-align: left;font-size: 11px;">报价类型：{{data.currItem.quoted_type}}</th>\n' +
                    '                   <th colspan="4" style="text-align: left;font-size: 11px;">是否含税：{{data.currItem.tax_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="4" style="text-align: left;font-size: 11px;">报价日期：{{data.currItem.quoted_date}}</th>\n' +
                    '                   <th colspan="4" style="text-align: left;font-size: 11px;">是否含运费：{{data.currItem.freight_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="15" style="text-align: left;font-size: 11px;">备注：{{data.currItem.remark}}</th>\n' +
                    '                </TR>\n' +
                    '                <TR style="height: 23px;font-size: 9px;text-align: center;">\n' +
                    '                   <TD>序号</TD>\n' +
                    '                   <TD>产品名称</TD>\n' +
                    '                   <TD>产品型号</TD>\n' +
                    '                   <TD>图片</TD>\n' +
                    '                   <TD>品牌</TD>\n' +
                    '                   <TD>产地</TD>\n' +
                    '                   <TD>说明/规格(mm)</TD>\n' +
                    '                   <TD>材质/颜色</TD>\n' +
                    '                   <TD>市场零售价</TD>\n' +
                    '                   <TD>工程折扣率</TD>\n' +
                    '                   <TD>单价(元)</TD>\n' +
                    '                   <TD>数量</TD>\n' +
                    '                   <TD>总价</TD>\n' +
                    '                   <TD>备注</TD>\n' +
                    '                   <TD>尺寸图</TD>\n' +
                    '                </TR>\n' +

                    '                <TR ng-repeat="item in data.currItem.epm_pdt_quoted_price_lines" style="height: 27px;text-align: center;font-size: 9px;">\n' +
                    '                    <TD style="width: 18px;height: 50px;">{{$index+1}}</TD>\n' +       //序号
                    '                    <TD style="width: 28px;">{{item.item_class3_name}}</TD>\n' +       //产品名称
                    '                    <TD style="width: 30px;">{{item.model}}</TD>\n' +                  //产品型号
                    '                    <TD style="width: 55px;"><img hc-img="item.pdt_docid" style="width:50px"></TD>\n' +             //图片
                    '                    <TD style="width: 18px;">{{item.brand}}</TD>\n' +                  //品牌
                    '                    <TD style="width: 18px;">{{item.orgin}}</TD>\n' +                  //产地
                    '                    <TD style="width: 38px;">{{item.spec}}</TD>\n' +                   //说明/规格(mm)
                    '                    <TD style="width: 39px;">{{item.color}}</TD>\n' +                  //材质/颜色
                    '                    <TD style="width: 45px;">{{item.market_price}}</TD>\n' +           //市场零售价
                    '                    <TD style="width: 45px;">{{item.discount_rate}}</TD>\n' +          //工程折扣率
                    '                    <TD style="width: 33px;">{{item.quoted_price}}</TD>\n' +           //单价(元)
                    '                    <TD style="width: 18px;">{{item.qty}}</TD>\n' +                    //数量
                    '                    <TD style="width: 18px;">{{item.quoted_amt}}</TD>\n' +             //金额
                    '                    <TD style="width: 80px;">{{item.remark}}</TD>\n' +                 //备注
                    '                    <TD style="width: 55px;"><img hc-img="item.dimension_docid" style="width:50px"></TD>\n' +       //尺寸图
                    '                </TR>\n' +

                    //合计金额
                    '                <TR style="font-size: 9px;height: 27px;">\n' +
                    '                    <TD colspan="12" style="text-align:center;">总计金额：</TD>\n' +
                    '                    <TD >{{data.currItem.atm}}</TD>\n' +
                    '                    <TD ></TD>\n' +
                    '                    <TD ></TD>\n' +
                    '                </TR>\n' +
                    //尾部说明
                    '                <TR>\n' +
                    '                    <TD colspan="15" style="font-size: 10px;">1、合同签订前，以上报价有效期为{{data.currItem.valid_time_limit}}，签订后合作期间执行此价格不变。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="15" style="font-size: 10px;">2、以上单价均按照四舍五入取整价格。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="15" style="font-size: 10px;">3、单价所含配件、运费、卸货、安装情况均已注明，未免误解或者纠纷，请详尽阅读。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="15" style="font-size: 10px;text-align:right;"><span style="padding-right: 10px;">报价单位：{{data.currItem.trading_company_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印日期：{{data.currItem.dateTime}}</span></TD>\n' +
                    '                </TR>\n' +
                    '\n' +
                    '            </TABLE>\n' +
                    '        </div>\n' +
                    '    </div>';
            }else if(data.currItem.show_number == 2 && data.currItem.quoted_type == 1){//不显示数量&&常规工程
                return '<div id="div_print">\n' +
                    '        <div id="div_2">\n' +
                    '            <TABLE id="table_print" border=1 cellSpacing=0 cellPadding=3 width="100%" height="320px"\n' +
                    '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                    '                   bordercolor=\'#333333\'>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="11"><img src="/web/img/arrow.190926.jpg" style="width: 130px"></TD>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="4" rowspan="2" style="text-align: left;font-size: 11px;">项目名称：{{data.currItem.project_name}}</th>\n' +
                    '                   <th colspan="5" style="text-align: left;font-size: 11px;">报价类型：{{data.currItem.quoted_type}}</th>\n' +
                    '                   <th colspan="2" style="text-align: left;font-size: 11px;">是否含税：{{data.currItem.tax_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="5" style="text-align: left;font-size: 11px;">报价日期：{{data.currItem.quoted_date}}</th>\n' +
                    '                   <th colspan="2" style="text-align: left;font-size: 11px;">是否含运费：{{data.currItem.freight_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="11" style="text-align: left;font-size: 11px;">备注：{{data.currItem.remark}}</th>\n' +
                    '                </TR>\n' +
                    '                <TR style="font-size: 9px;text-align: center;">\n' +
                    '                   <TD>序号</TD>\n' +
                    '                   <TD>产品名称</TD>\n' +
                    '                   <TD>产品型号</TD>\n' +
                    '                   <TD>图片</TD>\n' +
                    '                   <TD>品牌</TD>\n' +
                    '                   <TD>产地</TD>\n' +
                    '                   <TD>说明/规格(mm)</TD>\n' +
                    '                   <TD>材质/颜色</TD>\n' +
                    '                   <TD>单价(元)</TD>\n' +
                    '                   <TD>备注</TD>\n' +
                    '                   <TD>尺寸图</TD>\n' +
                    '                </TR>\n' +

                    '                <TR ng-repeat="item in data.currItem.epm_pdt_quoted_price_lines" style="height: 27px;text-align: center;font-size: 9px;">\n' +
                    '                    <TD style="height: 50px;">{{$index+1}}</TD>\n' +       //序号
                    '                    <TD style="width: 30px;">{{item.item_class3_name}}</TD>\n' +              //产品名称
                    '                    <TD style="width: 28px;">{{item.model}}</TD>\n' +                  //产品型号
                    '                    <TD style="width: 140px;"><img hc-img="item.pdt_docid" style="width:135px"></TD>\n' +             //图片
                    '                    <TD style="">{{item.brand}}</TD>\n' +                  //品牌
                    '                    <TD style="width: 18px;">{{item.orgin}}</TD>\n' +                  //产地
                    '                    <TD style="width: 38px;">{{item.spec}}</TD>\n' +                   //说明/规格(mm)
                    '                    <TD style="">{{item.color}}</TD>\n' +                  //材质/颜色
                    '                    <TD style="">{{item.quoted_price}}</TD>\n' +           //单价(元)
                    '                    <TD style="width: 60px;">{{item.remark}}</TD>\n' +                 //备注
                    '                    <TD style="width: 140px;"><img hc-img="item.dimension_docid" style="width:135px"></TD>\n' +       //尺寸图
                    '                </TR>\n' +

                    //合计金额
                    // '                <TR style="font-size: 9px;height: 27px;">\n' +
                    // '                    <TD colspan="12" style="text-align:center;">总计金额：</TD>\n' +
                    // '                    <TD >{{data.currItem.atm}}</TD>\n' +
                    // '                    <TD ></TD>\n' +
                    // '                    <TD ></TD>\n' +
                    // '                </TR>\n' +
                    //尾部说明
                    '                <TR>\n' +
                    '                    <TD colspan="11" style="font-size: 10px;">1、合同签订前，以上报价有效期为{{data.currItem.valid_time_limit}}，签订后合作期间执行此价格不变。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="11" style="font-size: 10px;">2、以上单价均按照四舍五入取整价格。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="11" style="font-size: 10px;">3、单价所含配件、运费、卸货、安装情况均已注明，未免误解或者纠纷，请详尽阅读。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="11" style="font-size: 10px;text-align:right;"><span style="padding-right: 10px;">报价单位：{{data.currItem.trading_company_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印日期：{{data.currItem.dateTime}}</span></TD>\n' +
                    '                </TR>\n' +
                    '\n' +
                    '            </TABLE>\n' +
                    '        </div>\n' +
                    '    </div>';
            }else if(data.currItem.show_number == 2 && data.currItem.quoted_type == 2){//不显示数量&&战略工程
                return '<div id="div_print">\n' +
                    '        <div id="div_2">\n' +
                    '            <TABLE border=1 cellSpacing=0 cellPadding=3 width="100%" height="320px"\n' +
                    '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                    '                   bordercolor=\'#333333\'>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="13"><img src="/web/img/arrow.190926.jpg" style="width: 130px"></TD>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="5" rowspan="2" style="text-align: left;font-size: 11px;">项目名称：{{data.currItem.project_name}}</th>\n' +
                    '                   <th colspan="6" style="text-align: left;font-size: 11px;">报价类型：{{data.currItem.quoted_type}}</th>\n' +
                    '                   <th colspan="2" style="text-align: left;font-size: 11px;">是否含税：{{data.currItem.tax_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="6" style="text-align: left;font-size: 11px;">报价日期：{{data.currItem.quoted_date}}</th>\n' +
                    '                   <th colspan="2" style="text-align: left;font-size: 11px;">是否含运费：{{data.currItem.freight_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="13" style="text-align: left;font-size: 11px;">备注：{{data.currItem.remark}}</th>\n' +
                    '                </TR>\n' +
                    '                <TR style="font-size: 9px;text-align: center;">\n' +
                    '                   <TD>序号</TD>\n' +
                    '                   <TD>产品名称</TD>\n' +
                    '                   <TD>产品型号</TD>\n' +
                    '                   <TD>图片</TD>\n' +
                    '                   <TD>品牌</TD>\n' +
                    '                   <TD>产地</TD>\n' +
                    '                   <TD>说明/规格(mm)</TD>\n' +
                    '                   <TD>材质/颜色</TD>\n' +
                    '                   <TD>含税单价</TD>\n' +
                    '                   <TD>税率</TD>\n' +
                    '                   <TD>不含税单价</TD>\n' +
                    '                   <TD>备注</TD>\n' +
                    '                   <TD>尺寸图</TD>\n' +
                    '                </TR>\n' +

                    '                <TR ng-repeat="item in data.currItem.epm_pdt_quoted_price_lines" style="height: 27px;text-align: center;font-size: 9px;">\n' +
                    '                    <TD style="height: 50px;">{{$index+1}}</TD>\n' +       //序号
                    '                    <TD style="width: 40px;">{{item.item_class3_name}}</TD>\n' +              //产品名称
                    '                    <TD style="width: 28px;">{{item.model}}</TD>\n' +                  //产品型号
                    '                    <TD style="width: 120px;"><img hc-img="item.pdt_docid" style="width:115px"></TD>\n' +             //图片
                    '                    <TD style="">{{item.brand}}</TD>\n' +                  //品牌
                    '                    <TD style="width: 18px;">{{item.orgin}}</TD>\n' +                  //产地
                    '                    <TD style="width: 38px;">{{item.spec}}</TD>\n' +                   //说明/规格(mm)
                    '                    <TD style="">{{item.color}}</TD>\n' +                  //材质/颜色
                    '                    <TD style="">{{item.quoted_price}}</TD>\n' +           //单价(元)
                    '                    <TD style="">{{item.tax_rate}}</TD>\n' +           //税率
                    '                    <TD style="">{{item.no_tax_contract_price}}</TD>\n' +           //不含税单价
                    '                    <TD style="width: 60px;">{{item.remark}}</TD>\n' +                 //备注
                    '                    <TD style="width: 120px;"><img hc-img="item.dimension_docid" style="width:115px"></TD>\n' +       //尺寸图
                    '                </TR>\n' +

                    //合计金额
                    // '                <TR style="font-size: 9px;height: 27px;">\n' +
                    // '                    <TD colspan="12" style="text-align:center;">总计金额：</TD>\n' +
                    // '                    <TD >{{data.currItem.atm}}</TD>\n' +
                    // '                    <TD ></TD>\n' +
                    // '                    <TD ></TD>\n' +
                    // '                </TR>\n' +
                    //尾部说明
                    '                <TR>\n' +
                    '                    <TD colspan="13" style="font-size: 10px;">1、合同签订前，以上报价有效期为{{data.currItem.valid_time_limit}}，签订后合作期间执行此价格不变。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="13" style="font-size: 10px;">2、以上单价均按照四舍五入取整价格。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="13" style="font-size: 10px;">3、单价所含配件、运费、卸货、安装情况均已注明，未免误解或者纠纷，请详尽阅读。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="13" style="font-size: 10px;text-align:right;"><span style="padding-right: 10px;">报价单位：{{data.currItem.trading_company_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印日期：{{data.currItem.dateTime}}</span></TD>\n' +
                    '                </TR>\n' +
                    '\n' +
                    '            </TABLE>\n' +
                    '        </div>\n' +
                    '    </div>';
            }else if(data.currItem.show_number < 2 && data.currItem.quoted_type == 2){//显示数量&&战略工程
                return '<div id="div_print">\n' +
                    '        <div id="div_2">\n' +
                    '            <TABLE border=1 cellSpacing=0 cellPadding=3 width="100%" height="320px"\n' +
                    '                   style=\'font-size: small;border-collapse:collapse;\'\n' +
                    '                   bordercolor=\'#333333\'>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="17"><img src="/web/img/arrow.190926.jpg" style="width: 100px;"></TD>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="8" rowspan="2" style="text-align: left;font-size: 11px;">项目名称：{{data.currItem.project_name}}</th>\n' +
                    '                   <th colspan="5" style="text-align: left;font-size: 11px;">报价类型：{{data.currItem.quoted_type}}</th>\n' +
                    '                   <th colspan="4" style="text-align: left;font-size: 11px;">是否含税：{{data.currItem.tax_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="5" style="text-align: left;font-size: 11px;">报价日期：{{data.currItem.quoted_date}}</th>\n' +
                    '                   <th colspan="4" style="text-align: left;font-size: 11px;">是否含运费：{{data.currItem.freight_included}}</th>\n' +
                    '                </TR>\n' +

                    '                <TR style="height: 23px">\n' +
                    '                   <th colspan="17" style="text-align: left;font-size: 11px;">备注：{{data.currItem.remark}}</th>\n' +
                    '                </TR>\n' +
                    '                <TR style="height: 23px;font-size: 9px;text-align: center;">\n' +
                    '                   <TD>序号</TD>\n' +
                    '                   <TD>产品名称</TD>\n' +
                    '                   <TD>产品型号</TD>\n' +
                    '                   <TD>图片</TD>\n' +
                    '                   <TD>品牌</TD>\n' +
                    '                   <TD>产地</TD>\n' +
                    '                   <TD>说明/规格(mm)</TD>\n' +
                    '                   <TD>材质/颜色</TD>\n' +
                    '                   <TD>市场零售价</TD>\n' +
                    '                   <TD>工程折扣率</TD>\n' +
                    '                   <TD>含税单价</TD>\n' +
                    '                   <TD>税率</TD>\n' +
                    '                   <TD>不含税单价</TD>\n' +
                    '                   <TD>数量</TD>\n' +
                    '                   <TD>总价</TD>\n' +
                    '                   <TD>备注</TD>\n' +
                    '                   <TD>尺寸图</TD>\n' +
                    '                </TR>\n' +

                    '                <TR ng-repeat="item in data.currItem.epm_pdt_quoted_price_lines" style="height: 27px;text-align: center;font-size: 9px;">\n' +
                    '                    <TD style="width: 18px;height: 50px;">{{$index+1}}</TD>\n' +       //序号
                    '                    <TD style="width: 28px;">{{item.item_class3_name}}</TD>\n' +       //产品名称
                    '                    <TD style="width: 30px;">{{item.model}}</TD>\n' +                  //产品型号
                    '                    <TD style="width: 55px;"><img hc-img="item.pdt_docid" style="width:50px"></TD>\n' +             //图片
                    '                    <TD style="width: 18px;">{{item.brand}}</TD>\n' +                  //品牌
                    '                    <TD style="width: 18px;">{{item.orgin}}</TD>\n' +                  //产地
                    '                    <TD style="width: 45px;">{{item.spec}}</TD>\n' +                   //说明/规格(mm)
                    '                    <TD style="width: 39px;">{{item.color}}</TD>\n' +                  //材质/颜色
                    '                    <TD style="width: 45px;">{{item.market_price}}</TD>\n' +           //市场零售价
                    '                    <TD style="width: 45px;">{{item.discount_rate}}</TD>\n' +          //工程折扣率
                    '                    <TD style="width: 33px;">{{item.quoted_price}}</TD>\n' +           //单价(元)
                    '                    <TD style="">{{item.tax_rate}}</TD>\n' +           //税率
                    '                    <TD style="">{{item.no_tax_contract_price}}</TD>\n' +           //不含税单价
                    '                    <TD style="width: 18px;">{{item.qty}}</TD>\n' +                    //数量
                    '                    <TD style="width: 18px;">{{item.quoted_amt}}</TD>\n' +             //金额
                    '                    <TD style="width: 80px;">{{item.remark}}</TD>\n' +                 //备注
                    '                    <TD style="width: 55px;"><img hc-img="item.dimension_docid" style="width:50px"></TD>\n' +       //尺寸图
                    '                </TR>\n' +

                    //合计金额
                    '                <TR style="font-size: 9px;height: 27px;">\n' +
                    '                    <TD colspan="14" style="text-align:center;">总计金额：</TD>\n' +
                    '                    <TD >{{data.currItem.atm}}</TD>\n' +
                    '                    <TD ></TD>\n' +
                    '                    <TD ></TD>\n' +
                    '                </TR>\n' +
                    //尾部说明
                    '                <TR>\n' +
                    '                    <TD colspan="17" style="font-size: 10px;">1、合同签订前，以上报价有效期为{{data.currItem.valid_time_limit}}，签订后合作期间执行此价格不变。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="17" style="font-size: 10px;">2、以上单价均按照四舍五入取整价格。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="17" style="font-size: 10px;">3、单价所含配件、运费、卸货、安装情况均已注明，未免误解或者纠纷，请详尽阅读。</TD>\n' +
                    '                </TR>\n' +
                    '                <TR>\n' +
                    '                    <TD colspan="17" style="font-size: 10px;text-align:right;"><span style="padding-right: 10px;">报价单位：{{data.currItem.trading_company_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打印日期：{{data.currItem.dateTime}}</span></TD>\n' +
                    '                </TR>\n' +
                    '\n' +
                    '            </TABLE>\n' +
                    '        </div>\n' +
                    '    </div>';
            }
        }

        return {
            controller: controller,
            beforePrint: beforePrint,
            getPrintDomStr: getPrintDomStr
        }
    }
);
