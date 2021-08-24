/**
 *htp
 *2020年8月7日13:44:22
 */
define(
    ['module', 'controllerApi', 'base_diy_page', '$q', 'requestApi', 'swalApi', 'directive/hcTab', 'async!baidu', "directive/hcChart"],
    function (module, controllerApi, base_diy_page, $q, requestApi, swalApi) {

        var bcs_barcode_stream = [

            '$scope', function ($scope) {

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
                /**日期拓展 */
                Date.prototype.format = function (fmt) {
                    var o = {
                        "M+": this.getMonth() + 1, //月份
                        "d+": this.getDate(), //日
                        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
                        "H+": this.getHours(), //小时
                        "m+": this.getMinutes(), //分
                        "s+": this.getSeconds(), //秒
                        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                        "S": this.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt))
                        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt))
                            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                }
                $scope.data = {
                    currItem: {
                        endtime: new Date().format("yyyy-MM-dd"),
                        begintime: new Date((new Date()) - 7 * 24 * 3600 * 1000).format("yyyy-MM-dd")
                    }
                };

                //精准查询条形码
                $scope.selectBarcodeOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'short_barcode',
                        headerName: '条码',
                    }, {
                        field: 'barcode_type',
                        headerName: '条码类型',
                        hcDictCode: 'barcode_type'
                    }]
                }
                //查询日志
                $scope.queryActionsOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'short_barcode',
                        headerName: '短条码'
                    }, {
                        field: 'barcode_type',
                        headerName: '条码类型',
                        hcDictCode: 'barcode_type'
                    }, {
                        field: 'lat',
                        headerName: '经度',
                    }, {
                        field: 'lng',
                        headerName: '纬度'
                    }, {
                        field: 'address',
                        headerName: '查询地址'
                    }, {
                        field: 'creation_date',
                        headerName: '查询时间'
                    }
                    ]
                }

                //tab签
                $scope.kpi_tab = {
                    register: {
                        title: "注册信息",
                        active: true
                    },
                    produce: {
                        title: "生产信息",

                    },
                    sale: {
                        title: "销售信息",

                    },
                    queryAction: {
                        title: "查询日志",

                    }
                };
                //数据初始化
                $scope.doInit = function () {
                    //热点数据
                    $scope.data.currItem.data = [];
                    $scope.queryActionsOptions.hcApi.setRowData($scope.data.currItem.data);
                    $scope.selectBarcodeOptions.hcApi.setRowData($scope.data.currItem.data);
                };
                $scope.selectInBcsCode = function () {
                    if ($scope.data.short_barcode == '' || $scope.data.short_barcode == undefined) {
                        swalApi.info("请先输入条码！");
                        return;
                    }
                    requestApi.post({
                        classId: 'bcs_search_log',
                        action: 'selectinbcscode',
                        data: {
                            short_barcode: $scope.data.short_barcode
                        }
                    }).then(function (data) {
                        console.log(data);
                        if (data.short_barcode != null && (data.bsc_barcodes.length > 0 || data.bcs_search_logs.length > 0)) {
                            $scope.data.currItem.short_barcode = data.bsc_barcodes[0].short_barcode;
                            $scope.data.currItem.barcode_type = data.bsc_barcodes[0].barcode_type;
                            $scope.data.currItem.create_time = data.bsc_barcodes[0].createat;
                            $scope.data.currItem.units = data.bsc_barcodes[0].entid;
                            $scope.data.currItem.enabled = data.bsc_barcodes[0].enabled;
                            $scope.data.currItem.bsc_barcodes = data.bsc_barcodes;
                            $scope.data.currItem.bcs_search_logs = data.bcs_search_logs;

                            $scope.data.currItem.pro_factory = data.bsc_barcodes[0].pro_factory;
                            $scope.data.currItem.pro_time = data.bsc_barcodes[0].pro_time;
                            $scope.data.currItem.pro_no = data.bsc_barcodes[0].pro_no;
                            $scope.data.currItem.pro_code = data.bsc_barcodes[0].pro_code;
                            $scope.data.currItem.pro_desc = data.bsc_barcodes[0].pro_desc;

                            $scope.data.currItem.deliver_time = data.bsc_barcodes[0].deliver_time;
                            $scope.data.currItem.deliver_no = data.bsc_barcodes[0].deliver_no;
                            $scope.data.currItem.orderno = data.bsc_barcodes[0].orderno;
                            $scope.data.currItem.customer_code = data.bsc_barcodes[0].customer_code;
                            $scope.data.currItem.customer_name = data.bsc_barcodes[0].customer_name;
                            $scope.data.currItem.scanner = data.bsc_barcodes[0].scanner;
                        }
                        else {
                            swalApi.error("条码 " + $scope.data.short_barcode + " 不存在！");
                            $scope.data.currItem.short_barcode = '';
                            $scope.data.currItem.barcode_type = '';
                            $scope.data.currItem.create_time = '';
                            $scope.data.currItem.units = '';
                            $scope.data.currItem.enabled = '';

                            $scope.data.currItem.pro_factory = '';
                            $scope.data.currItem.pro_time = '';
                            $scope.data.currItem.pro_no = '';
                            $scope.data.currItem.pro_code = '';
                            $scope.data.currItem.pro_desc = '';

                            $scope.data.currItem.deliver_time = '';
                            $scope.data.currItem.deliver_no = '';
                            $scope.data.currItem.orderno = '';
                            $scope.data.currItem.customer_code = '';
                            $scope.data.currItem.customer_name = '';
                            $scope.data.currItem.scanner = '';

                            $scope.data.currItem.bsc_barcodes = [];
                            $scope.data.currItem.bcs_search_logs = [];
                        }
                        $scope.selectBarcodeOptions.hcApi.setRowData($scope.data.currItem.bsc_barcodes);
                        $scope.queryActionsOptions.hcApi.setRowData($scope.data.currItem.bcs_search_logs);
                    })
                }

            }]

        return controllerApi.controller({
            module: module,
            controller: bcs_barcode_stream
        });

    });