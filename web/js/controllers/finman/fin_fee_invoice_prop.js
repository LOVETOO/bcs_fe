/**
 * 我的发票-属性页
 * 2018-11-07
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'base64Api', 'numberApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, base64Api, numberApi, swalApi) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$q',
                //控制器函数
                function ($scope, $q) {

                    /*-------------------数据定义开始------------------------*/
                    $scope.data = {};

                    //发票识别返回的发票类型与本地词汇值对应值
                    $scope.invoice_type = {
                        '电子普通发票': 3,
                        '普通发票': 1,
                        '专用发票': 2
                    };
                    /*-------------------数据定义结束------------------------*/

                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    /**
                     * 保存前判断
                     */
                    $scope.save = function () {
                        if (!$scope.fileStr_base64 && $scope.data.currItem.doc_id <= 0) {
                            return swalApi.info('请添加发票');
                        }
                        if ($scope.data.currItem.invoice_date) {
                            if (isNaN($scope.data.currItem.invoice_date) && isNaN(Date.parse($scope.data.currItem.invoice_date))) {
                                return swalApi.info('开票日期格式不正确，请重新选择');
                            }
                        }
                        return $scope.hcSuper.save();
                    };

                    /**
                     * 生成费用记录单
                     */
                    $scope.create_fee_record = function () {
                        //判断发票是否已关联
                        if ($scope.data.currItem.is_related == 2) {
                            return swalApi.info('此发票已关联费用记录单！');
                        }

                        //先保存当前单据
                        $scope.save().then(function () {
                            //打开费用记录属性页
                            return openBizObj({
                                stateName: 'finman.fin_fee_record_prop',
                                params: {
                                    title: '费用记录',
                                    id: 0,
                                    invoice_id: $scope.data.currItem.invoice_id
                                }
                            }).result;
                        });
                    };

                    /**
                     * 乐税通过发票文字信息验真
                     */
                    $scope.checkReal = function () {

                        var checkcode = $scope.data.currItem.invoice_checkno;
                        if (checkcode.length > 6) {
                            checkcode = checkcode.substring(checkcode.length - 6, checkcode.length);
                        }
                        var billtime = new Date($scope.data.currItem.invoice_date);
                        billtime = billtime.Format('yyyy-MM-dd');
                        var info = {
                            invoiceCode: $scope.data.currItem.invoice_code,
                            invoiceNumber: $scope.data.currItem.invoice_no,
                            billTime: billtime,
                            invoiceAmount: $scope.data.currItem.pre_tax_amt,
                            checkCode: checkcode
                        };

                        //base64编码的json转为字符串
                        var reqdata_str = base64Api.encodeFromObj(info);

                        var postData = {
                            reqmethod: 'lscheckrealbyinfo',//类型：增值税发票
                            reqdata: reqdata_str
                        };

                        //调用后台接口扫描发票
                        requestApi.post('base_openapi', 'reqapi', postData)
                            .then($scope.setLeshuiInvoiceData);
                    };

                    /**
                     *乐税通过二维码字符串验真
                     */
                    $scope.checkRealByQRcode = function () {

                        var scanStr = "01,04,4500173320,00982516,286.79,20180517,82962422610360061863,9495,";//二维码字符串

                        var info = {
                            scanStr: scanStr  //二维码字符串
                        };

                        //将数据转为base64编码的json字符串
                        var reqdata_str = base64Api.encodeFromObj(info);

                        var postData = {
                            reqmethod: 'lscheckrealbyqrcode',
                            reqdata: reqdata_str
                        };

                        //调用后台接口扫描发票
                        openApi({postData: postData});
                    };

                    /**
                     * 乐税通过图片验真
                     */
                    $scope.checkRealByPhoto = function () {

                        $q.when()
                            .then(function (value) {

                                //base64编码的json转为字符串
                                var reqdata_json = {image: $scope.data.currItem.image_data};
                                var reqdata_str = base64Api.encodeFromObj(reqdata_json);

                                var obj = {
                                    postData: {
                                        reqmethod: 'lscheckrealbyphoto',//类型：乐税api图片验真
                                        reqdata: reqdata_str
                                    },
                                    callBack: function (response) {
                                        return $scope.setLeshuiInvoiceData(response);
                                    }
                                };
                                return openApi(obj);
                            });
                    };

                    /**
                     * 乐税接口验真成功时设置发票信息
                     * @param invoiceResult
                     */
                    $scope.setLeshuiInvoiceData = function (response) {

                        var respdata = JSON.parse(response.respdata);
                        if (respdata.resultMsg.indexOf('识别失败') > -1 || respdata.resultCode == '2001') {
                            swalApi.error("验真失败！失败代码[" + respdata.invoicefalseCode + "]失败原因:" + respdata.resultMsg);
                        } else {
                            swalApi.success("验真成功！发票信息" + respdata.resultMsg);
                            $scope.data.currItem.check_realness_stat = 2;

                            var invoiceResult = JSON.parse(respdata.invoiceResult);
                            $scope.data.currItem.invoice_date = invoiceResult.billingTime;
                            $scope.data.currItem.invoice_no = invoiceResult.invoiceNumber;
                            $scope.data.currItem.invoice_code = invoiceResult.invoiceDataCode;
                            $scope.data.currItem.invoice_checkno = invoiceResult.checkCode;
                            $scope.data.currItem.pre_tax_amt = invoiceResult.totalAmount;
                            $scope.data.currItem.tax_amt = invoiceResult.totalTaxNum;
                            $scope.data.currItem.invoice_amt = invoiceResult.totalTaxSum;
                            $scope.data.currItem.buyer = invoiceResult.purchaserName;
                            $scope.data.currItem.buyer_tax_no = invoiceResult.taxpayerNumber;
                            $scope.data.currItem.seller = invoiceResult.salesName;
                        }
                    }

                    /*---------------------------图片相关开始-----------------------------*/

                    function getImgSu() {

                    }

                    /**
                     * 获取图片文件字节
                     * @param {*} e
                     */
                    $scope.fileStr_base64 = "";

                    function getStrFromFile(e) {
                        return new Promise(function (resolve, reject) {
                            //FileReader读取上传的文件转为base64字符串
                            var file = e ? e.target.files[0] : $('#invoice_img')[0].src;
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onload = function () {
                                if (reader.result != null)
                                    $scope.fileStr_base64 = reader.result;

                                //设置图片src
                                document.getElementById('invoice_img').src = $scope.fileStr_base64;
                                $scope.data.currItem.image_data = $scope.fileStr_base64;
                                $scope.data.currItem.newimage = 2;
                                //base64编码的json转为字符串
                                var reqdata_json = {image: $scope.fileStr_base64};
                                var reqdata_str = base64Api.encodeFromObj(reqdata_json);
                                //返回字符串
                                resolve(reqdata_str);
                            };
                        });
                    }

                    window.getStrFromFile = getStrFromFile;

                    /**
                     * 调用baiduapi
                     * @param e
                     */
                    function openBaiduApi(e) {

                        $q.when()
                            .then(getStrFromFile.bind(undefined, e))
                            .then(function (value) {
                                var reqdata_str = value;
                                var obj = {
                                    postData: {
                                        reqmethod: 'vat_invoice',//类型：增值税发票
                                        reqdata: reqdata_str
                                    },
                                    callBack: function (response) {
                                        $scope.setBaiduInvoiceData(JSON.parse(response.respdata)); //回调方法，将检入的值设置到界面
                                    }
                                };
                                return openApi(obj);
                            })
                            .then(function () {
                                swalApi.info("发票录入成功！");
                            });
                    }

                    window.openBaiduApi = openBaiduApi;

                    /**
                     * 请求调用后台api接口
                     * @param obj
                     */
                    function openApi(obj) {

                        //调用后台接口扫描发票
                        return requestApi.post('base_openapi', 'reqapi', obj.postData)
                            .then(function (response) {
                                obj.callBack && obj.callBack(response);
                            });
                    }

                    /**
                     * 设置百度接口发票扫描结果
                     */
                    $scope.setBaiduInvoiceData = function (data) {
                        var result = data.words_result;
                        if (!data || data.error_code) {
                            result = '';
                        }
                        //发票类型
                        $scope.data.currItem.invoice_type = result ? $scope.invoice_type[result.InvoiceType] : 4;
                        //发票代码
                        $scope.data.currItem.invoice_code = result ? result.InvoiceCode : '';
                        //发票号码
                        $scope.data.currItem.invoice_no = result ? result.InvoiceNum : '';
                        //开票日期
                        if (result) {
                            result.InvoiceDate = result.InvoiceDate.replace("年", "-");
                            result.InvoiceDate = result.InvoiceDate.replace("月", "-");
                            result.InvoiceDate = result.InvoiceDate.replace("日", "");
                        }
                        $scope.data.currItem.invoice_date = result ? result.InvoiceDate : '';
                        //发票检验码
                        $scope.data.currItem.invoice_checkno = result ? result.CheckCode : '';
                        //税额（根据每行的税额之和）
                        if (result) {
                            var totaltax = 0;
                            for (var i = 0; i < result.CommodityTax.length; i++) {
                                if (result.CommodityTax[i].word.length > 0) {
                                    totaltax += numberApi.toNumber(result.CommodityTax[i].word);
                                }
                            }
                        }

                        $scope.data.currItem.tax_amt = result ? totaltax.toFixed(2) : '';

                        // $scope.data.currItem.tax_amt = result.TotalTax;//税额（此字段不准确）
                        //税前金额
                        $scope.data.currItem.pre_tax_amt = result ? result.TotalAmount : '';
                        //价税合计
                        $scope.data.currItem.invoice_amt = result ? result.AmountInFiguers : '';
                        //购买方
                        $scope.data.currItem.buyer = result ? result.PurchaserName : '';
                        //购买方税号
                        $scope.data.currItem.buyer_tax_no = result ? result.PurchaserRegisterNum : '';
                        //销售方
                        $scope.data.currItem.seller = result ? result.SellerName : '';
                        //验真状态
                        // $scope.data.currItem.check_realness_stat = result ? 2 : 1;
                        $scope.data.currItem.check_realness_stat = 1;

                        //图片信息
                        $scope.data.currItem.image_data = $scope.fileStr_base64;

                        ($scope.$$phase || $scope.$root.$$phase) ? 0 : $scope.$apply();
                    };

                    /**
                     * 移除图片
                     */
                    $scope.del_invoice_img = function () {
                        $scope.fileStr_base64 = undefined;
                        $scope.data.currItem = {};
                    };

                    /**
                     * 查看大图
                     */
                    $scope.viewFullImg = function () {
                        openBizObj({
                            imageId: $scope.data.currItem.doc_id
                        });
                    };

                    /*---------------------------图片相关结束-----------------------------*/

                    //隐藏标签页
                    $scope.tabs.wf.hide = true;
                    $scope.tabs.attach.hide = true;

                    $scope.tabs.base.title = '发票详情';

                    //底部右边按钮
                    angular.extend($scope.footerRightButtons, {
                        checkRealByPhoto: {
                            title: '发票图片验真',
                            click:
                                function () {
                                    $scope.checkRealByPhoto && $scope.checkRealByPhoto();
                                }
                        },
                        checkReal: {
                            title: '发票信息验真',
                            click:
                                function () {
                                    $scope.checkReal && $scope.checkReal();
                                }
                        },
                        checkRealByQRcode: {
                            title: '二维码信息字符串验真',
                            click:
                                function () {
                                    $scope.checkRealByQRcode && $scope.checkRealByQRcode();
                                }
                        },
                        create_fee_record: {
                            title: '生成费用',
                            click: function () {
                                $scope.create_fee_record && $scope.create_fee_record();
                            }
                        }
                    });
                }
            ]
        ;

//使用控制器Api注册控制器
//需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)
;
