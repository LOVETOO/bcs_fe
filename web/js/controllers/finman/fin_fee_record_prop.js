/**
 * 费用记录-属性页
 * 2018-11-02
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'fileApi', 'numberApi', 'base64Api', 'openBizObj'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, fileApi, numberApi, base64Api, openBizObj) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$modal',
            //控制器函数
            function ($scope, $stateParams, $modal) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                //发票识别返回的发票类型与本地词汇值对应值
                $scope.invoice_type = {
                    '电子普通发票': 3,
                    '普通发票': 1,
                    '专用发票': 2
                };

                //单据是否复制
                $scope.isCopy = false;

                //发票列表数据
                $scope.fin_fee_invoices = [];

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/

                /**
                 * 通用查询设置
                 */
                $scope.commonSearchSetting = {
                    //预算类别
                    bud_type: {
                        afterOk: function (response) {
                            if (response.bud_type_id != $scope.data.currItem.bud_type_id) {
                                $scope.data.currItem.fee_id = 0;
                                $scope.data.currItem.fee_code = '';
                                $scope.data.currItem.fee_name = '';
                            }
                            $scope.data.currItem.bud_type_code = response.bud_type_code;
                            $scope.data.currItem.bud_type_name = response.bud_type_name;
                            $scope.data.currItem.bud_type_id = response.bud_type_id;
                        }
                    },
                    //部门
                    dept: {
                        afterOk: function (response) {
                            $scope.data.currItem.org_id = response.dept_id;
                            $scope.data.currItem.org_code = response.dept_code;
                            $scope.data.currItem.org_name = response.dept_name;
                        }
                    }
                };
                /**
                 * 费用项目通用查询
                 */
                $scope.getCommonSearchSetting_fee_object = function () {
                    return {
                        beforeOpen: function () {
                            if (!$scope.data.currItem.bud_type_id) {
                                swalApi.info('请先选择预算类别');
                                return false;
                            }
                        },
                        postData: {
                            flag: 2,
                            bud_type_id: $scope.data.currItem.bud_type_id
                        },
                        afterOk: function (response) {
                            $scope.data.currItem.fee_id = response.fee_id;
                            $scope.data.currItem.fee_code = response.fee_code;
                            $scope.data.currItem.fee_name = response.fee_name;

                            requestApi.post('fin_fee_header', 'select', {fee_id: $scope.data.currItem.fee_id})
                                .then(function (fee) {
                                    //提示
                                    $scope.data.currItem.warm_prompt = fee.subject_desc;
                                    //费用类型
                                    $scope.data.currItem.fee_property = fee.fee_property;
                                })
                        }
                    }
                };

                /**
                 * 行政区域通用查询
                 */
                var superid = 0;
                $scope.data.prov_name = '';
                $scope.data.city_name = '';
                $scope.data.county_name = '';

                $scope.getCommonSearchSetting_area_all = function () {
                    return $modal.openCommonSearch($scope.commonSearchSetting.area_prov).result
                        .then(function () {
                            return $modal.openCommonSearch($scope.commonSearchSetting.area_city).result
                        }, function () {
                            $scope.footerRightButtons.close.click();
                        })
                        .then(function () {
                            return $modal.openCommonSearch($scope.commonSearchSetting.area_county).result
                        }, function () {
                            $scope.footerRightButtons.close.click();
                        });
                };

                $scope.commonSearchSetting.area_prov = {
                    classId: 'scparea',
                    postData: {
                        search_flag: 1,
                        superid: 0,
                        areatype: 4
                    },
                    title: "行政区域",
                    gridOptions: {
                        "columnDefs": [
                            {
                                "field": "areacode",
                                "headerName": "行政区域编码"
                            },
                            {
                                "field": "areaname",
                                "headerName": "行政区域名称"
                            },
                            {
                                "field": "telzone",
                                "headerName": "区号"
                            },
                            {
                                "field": "areatype",
                                "headerName": "区域类型",
                                "hcDictCode": "*"
                            },
                            {
                                "field": "areaname_full",
                                "headerName": "区域全称"
                            }
                        ]
                    },
                    afterOk: function (prov) {
                        $scope.data.prov_name = prov.areaname ? prov.areaname : '';
                        superid = prov.areaid;

                    }
                };
                $scope.commonSearchSetting.area_city = {
                    classId: 'scparea',
                    postData: {
                        search_flag: 1,
                        superid: superid,
                        areatype: 5
                    },
                    title: "行政区域",
                    gridOptions: {
                        "columnDefs": [
                            {
                                "field": "areacode",
                                "headerName": "行政区域编码"
                            },
                            {
                                "field": "areaname",
                                "headerName": "行政区域名称"
                            },
                            {
                                "field": "telzone",
                                "headerName": "区号"
                            },
                            {
                                "field": "areatype",
                                "headerName": "区域类型",
                                "hcDictCode": "*"
                            },
                            {
                                "field": "areaname_full",
                                "headerName": "区域全称"
                            }
                        ]
                    },
                    afterOk: function (city) {
                        $scope.data.city_name = city.areaname ? city.areaname : '';
                        superid = city.areaid;

                    }
                };
                $scope.commonSearchSetting.area_county = {
                    classId: 'scparea',
                    postData: {
                        search_flag: 1,
                        superid: superid,
                        areatype: 6
                    },
                    title: "行政区域",
                    gridOptions: {
                        "columnDefs": [
                            {
                                "field": "areacode",
                                "headerName": "行政区域编码"
                            },
                            {
                                "field": "areaname",
                                "headerName": "行政区域名称"
                            },
                            {
                                "field": "telzone",
                                "headerName": "区号"
                            },
                            {
                                "field": "areatype",
                                "headerName": "区域类型",
                                "hcDictCode": "*"
                            },
                            {
                                "field": "areaname_full",
                                "headerName": "区域全称"
                            }
                        ]
                    },
                    afterOk: function (county) {
                        $scope.data.prov_name = county.areaname ? county.areaname : '';
                    }
                };

                $scope.chooseArea = function (name) {
                    var stop_endCity = false;
                    var prov_name = '';
                    var city_name = '';
                    var county_name = '';
                    $modal.openCommonSearch({
                            classId: 'scparea',
                            title: '选择省份',
                            sqlWhere: "areatype =  4",
                            postData: {
                                search_flag: 1,
                                superid: 0
                            }
                        })
                        .result//响应数据
                        .then(function (prov) {
                            prov_name = prov.areaname ? prov.areaname : '';

                            return $modal.openCommonSearch({
                                    classId: 'scparea',
                                    title: '选择城市',
                                    sqlWhere: "areatype =  5",
                                    postData: {
                                        search_flag: 1,
                                        superid: prov.areaid
                                    }
                                })
                                .result//响应数据
                                .then(function (city) {
                                    city_name = city.areaname ? ' ' + city.areaname : '';
                                    if ('start_area' === name) {
                                        stop_endCity = true;
                                        $scope.data.currItem.start_areaid = city.areaid;
                                        $scope.data.currItem.start_areacode = city.areacode;
                                        $scope.data.currItem.start_areaname = city.areaname;

                                        if (city_name.length < 1)
                                            return swalApi.info('请选择城市');
                                        $scope.data.currItem.start_addr = prov_name + city_name;
                                    }
                                    if ('arrival_area' === name) {
                                        stop_endCity = true;
                                        $scope.data.currItem.arrival_areaid = city.areaid;
                                        $scope.data.currItem.arrival_areacode = city.areacode;
                                        $scope.data.currItem.arrival_areaname = city.areaname;

                                        if (city_name.length < 1)
                                            return swalApi.info('请选择城市');
                                        $scope.data.currItem.arrival_addr = prov_name + city_name;
                                    }
                                    if ('all' === name) {
                                        return $modal.openCommonSearch({
                                                classId: 'scparea',
                                                title: '选择区县',
                                                sqlWhere: "areatype =  6",
                                                postData: {
                                                    search_flag: 1,
                                                    superid: city.areaid
                                                }
                                            })
                                            .result//响应数据
                                            .then(function (county) {
                                                county_name = county.areaname ? ' ' + county.areaname : '';
                                                if (!stop_endCity) {
                                                    $scope.data.currItem.xf_county_areaid = county.areaid;
                                                    $scope.data.currItem.xf_county_areacode = county.areacode;
                                                    $scope.data.currItem.xf_county_areaname = county.areaname;

                                                    if (county_name.length < 1)
                                                        return swalApi.info('请选择区县');
                                                    $scope.data.currItem.xf_addr = prov_name + city_name + county_name;
                                                }
                                            })
                                    }
                                })
                        });
                };
                /*-------------------通用查询结束---------------------*/

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    if ($scope.isCopy || $stateParams.isCopy === 'true') {
                        if ($stateParams.preItem)
                            $scope.preItem = JSON.parse($stateParams.preItem);
                        $scope.hcSuper.newBizData($scope.data.currItem = $scope.preItem);
                    } else {
                        $scope.hcSuper.newBizData(bizData);
                    }

                    $scope.data.currItem.fee_record_id = 0;
                    $scope.data.currItem.cited_stat = 1;
                    $scope.data.currItem.fin_fee_record_lines = [];

                    var invoice_id = numberApi.toNumber($stateParams.invoice_id);
                    var doc_id = 0;

                    if (invoice_id > 0) {
                        requestApi.post('fin_fee_invoice', 'select', {invoice_id: invoice_id})
                            .then(function (response) {
                                doc_id = response.doc_id;
                                // $scope.$apply(function(){
                                $scope.data.currItem.fin_fee_record_lines.push({
                                    invoice_id: invoice_id,
                                    doc_id: doc_id
                                });
                                // });
                            });
                    }
                };

                /**
                 * 查询发票记录表
                 */
                // $scope.searchInvoice = function () {
                //     requestApi.post('fin_fee_invoice', 'search', {})
                //     .then(function (invoice) {
                //         $scope.fin_fee_invoices = invoice.fin_fee_invoices;
                //         //设置明细数据到表格
                //         if(invoice.fin_fee_invoices)
                //             $scope.gridOptions.api.setRowData(invoice.fin_fee_invoices);
                //
                //     });
                // };


                /**
                 * 移除发票明细
                 */
                $scope.del_invoice = function (invoice) {
                    for (var i = 0; i < $scope.data.currItem.fin_fee_record_lines.length; i++) {
                        if ($scope.data.currItem.fin_fee_record_lines[i].invoice_id == invoice.invoice_id) {
                            $scope.data.currItem.fin_fee_record_lines.splice(i, 1);
                        }
                    }

                };

                /**
                 * 关联发票
                 */
                $scope.link_invoice = function () {
                    var modalScope = openBizObj({
                        stateName: 'finman.fin_fee_invoice_related_list',
                        params: {
                            title: '发票记录',
                            lines: JSON.stringify($scope.data.currItem.fin_fee_record_lines)
                        }
                    });
                    top.modal_invoice_record = modalScope;
                    return modalScope.result.then(function (invoices) {
                        $scope.$applyAsync(function () {
                            Array.prototype.push.apply($scope.data.currItem.fin_fee_record_lines, invoices);
                        })
                    });
                };

                /**
                 * 添加发票
                 */
                $scope.upload_invoice = function () {
                    fileApi.chooseFile({
                            multiple: false,
                            accept: 'image/*'
                        })
                        .then(function (file) {
                            var reader = new FileReader();
                            reader.readAsDataURL(file[0]);
                            reader.onload = function () {
                                $scope.fileStr_base64 = reader.result;

                                $scope.doAfterFilereader();
                            }
                        })
                };

                /**
                 * fileReader读取文件后调用后台接口识别发票并处理出具
                 */
                $scope.doAfterFilereader = function () {
                    if (!$scope.fileStr_base64)
                        return swalApi.error('无法读取图片信息');

                    //base64编码的json转为字符串
                    var reqdata_json = {image: $scope.fileStr_base64};
                    var reqdata_str = base64Api.encodeFromObj(reqdata_json);

                    var postData = {
                        reqmethod: 'vat_invoice',//类型：增值税发票
                        reqdata: reqdata_str
                    };

                    //调用后台接口扫描发票
					requestApi.post('base_openapi', 'reqapi', postData)
						.then(function (response) {
							var pd = $scope.setInvoiceData(JSON.parse(response.respdata));
							$scope.insertInvoice(pd);
						})
                };

                /**
                 * 设置发票扫描结果
                 */
                $scope.setInvoiceData = function (data) {
                    var postData = {};
                    var result = data.words_result;
                    if (!data || data.error_code) {
                        result = '';
                    }
                    //发票类型
                    postData.invoice_type = result ? $scope.invoice_type[result.InvoiceType] : 4;
                    //发票代码
                    postData.invoice_code = result ? result.InvoiceCode : '';
                    //发票号码
                    postData.invoice_no = result ? result.InvoiceNum : '';
                    //开票日期
                    if (result) {
                        result.InvoiceDate = result.InvoiceDate.replace("年", "-");
                        result.InvoiceDate = result.InvoiceDate.replace("月", "-");
                        result.InvoiceDate = result.InvoiceDate.replace("日", "");
                    }
                    postData.invoice_date = result ? result.InvoiceDate : '';
                    //发票检验码
                    postData.invoice_checkno = result ? result.CheckCode : '';
                    //税额（根据每行的税额之和）
                    if (result) {
                        var totaltax = 0;
                        for (var i = 0; i < result.CommodityTax.length; i++) {
                            if (result.CommodityTax[i].word.length > 0) {
                                totaltax += numberApi.toNumber(result.CommodityTax[i].word);
                            }
                        }
                    }
                    postData.tax_amt = result ? totaltax.toFixed(2) : '';

                    // postData.tax_amt = result.TotalTax;//税额（此字段不准确）
                    //税前金额
                    postData.pre_tax_amt = result ? result.TotalAmount : '';
                    //价税合计
                    postData.invoice_amt = result ? result.AmountInFiguers : '';
                    //购买方
                    postData.buyer = result ? result.PurchaserName : '';
                    //购买方税号
                    postData.buyer_tax_no = result ? result.PurchaserRegisterNum : '';
                    //销售方
                    postData.seller = result ? result.SellerName : '';
                    //验真状态
                    // postData.check_realness_stat = result ? 2 : 1;
                    postData.check_realness_stat = 1;

                    //图片信息
                    postData.image_data = $scope.fileStr_base64;

                    return postData;
                };

                /**
                 * 新增一条发票记录
                 */
                $scope.insertInvoice = function (postData) {
                    return requestApi.post('fin_fee_invoice', 'insert', postData)
                        .then(function (response) {
                            // $scope.$apply(function () {
                            $scope.data.currItem.fin_fee_record_lines.push({
                                invoice_id: response.invoice_id,
                                doc_id: response.doc_id
                            })
                            // })

                        });
                };

                /**
                 * 续记：保存当前单据并新增一张单
                 */
                $scope.saveThenCreateBill = function () {
                    $scope.isCopy = false;
                    $scope.save()
                        .then($scope.add);
                };

                /**
                 * 复制：复制保存当前单据（某些字段）并新增一张单
                 */
                $scope.copyBill = function () {
                    $scope.save()
                        .then(function () {
                            $scope.isCopy = true;
                            $scope.preItem = angular.extend({}, $scope.data.currItem);
                        })
                        .then($scope.add)
                };

                $scope.viewFullImg = function (doc) {
                    openBizObj({
                        imageId: doc.doc_id,
                        images: $scope.data.currItem.fin_fee_record_lines
                    });
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;

                $scope.tabs.base.title = '记录详情';

                //底部左边按钮
                $scope.footerLeftButtons.link_invoice = {
                    title: '关联发票',
                    click: function () {
                        $scope.link_invoice && $scope.link_invoice();
                    }
                };
                $scope.footerLeftButtons.upload_invoice = {
                    title: '添加发票',
                    // icon: 'fa fa-plus-square',
                    click: function () {
                        $scope.upload_invoice && $scope.upload_invoice();
                    }
                };

                //底部右边按钮
                $scope.footerRightButtons.copy_bill = {
                    title: '复制',
                    click: function () {
                        $scope.copyBill && $scope.copyBill();
                    }
                };

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
