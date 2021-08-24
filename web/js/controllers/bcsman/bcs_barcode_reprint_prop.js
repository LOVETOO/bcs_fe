/**
 * 订单补打属性
 * @since 2020-03-20
 * 王照峰
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$q', 'swalApi', 'requestApi', 'numberApi', 'fileApi', 'lodop'],
    function (module, controllerApi, base_obj_prop, $q, swalApi, requestApi, numberApi, fileApi, lodop) {

        var controller = [
            '$scope',
            function ($scope) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //初始化打印模式 1-打印 2-预览
                $scope.data.printtype = 1;

                /**
                 * 重写方法
                 */
                $scope.print = async function (itype) {
                    if (itype) {
                        //预览
                        $scope.data.printtype = itype;
                    } else {
                        //打印
                        $scope.data.printtype = 1;
                    }
                    //获取lodop对象
                    $scope.LODOP = await getLodop();
                    if ($scope.LODOP) {
                        return $q
                            .when()
                            .then(function () {
                                if (parseInt($scope.data.currItem.packqty) == 0) {
                                    $q.reject();
                                    swalApi.error("包件数量必须大于0！");
                                }
                                if ($scope.data.currItem.temp_content == "" || $scope.data.currItem.temp_content == undefined) {
                                    $q.reject();
                                    swalApi.error("请选择打印模板!");
                                }
                            })
                            .then(function (data) {
                                $scope.data.currItem.rownum = data
                                return data;
                            })
                            .then(function (data) {
                                $scope.data.currItem.can_print_qty = parseInt($scope.data.currItem.can_print_qty) - parseInt(data);
                                //继承基类的打印
                                //$scope.hcSuper.print();
                                promise = $q.when($scope.data.currItem)
                                    .then($scope.beforePrint).then($scope.doPrint).then(function (obj) {
                                        console.log("printreturn objj: ", obj);
                                        var count = $scope.LODOP.GET_VALUE('PRINTED_TIMES');
                                    });
                            });
                    } else {
                        promise = $q.reject();
                    }
                };

                /**
                * 打印前处理数据
                * @param datas
                * @returns {*} 
                */
                $scope.beforePrint = async function (data) {
                    if ($scope.data.currItem.oldbarcode && $scope.data.currItem.oldbarcode.length > 0) {
                        $scope.data.currItem.barcodes = [];
                        $scope.data.currItem.barcodes.push({ serialno: $scope.data.currItem.oldbarcode });
                    } else {
                        return requestApi.post({
                            classId: "bcs_barcode_reprint",
                            action: "getbarcode",
                            data: {
                                reprintno: data.reprintno,
                                reprintqty: data.reprintqty,
                                factbase: $scope.data.currItem.factbase,
                                reprintid: data.reprintid,
                                packqty: data.packqty,
                                itemcode: $scope.data.currItem.itemcode,
                                in_generate_qty: $scope.data.currItem.reprintqty,
                                reprintid: $scope.data.currItem.reprintid
                            }
                        }).then(function (val) {
                            if (!val.barcodes || val.barcodes.length == 0) {
                                $q.defer().reject({
                                    message: '请先生成条码！'
                                });
                                swalApi.info("请先生成条码！")
                            }
                            data['barcodes'] = val.barcodes;
                            return data;
                        })
                    }
                }

                $scope.doPrint = function (data) {
                    return $q.when().then(function () {
                        //$scope.data.currItem = arguments[0];
                        //获取lodop对象
                        //$scope.LODOP = getLodop();
                        if ($scope.data.currItem.barcodes && $scope.data.currItem.barcodes.length > 0) {
                            var packsize = $scope.data.currItem.packsize;
                            var waterconsumption = $scope.data.currItem.waterconsumption;
                            var waterefficiency = $scope.data.currItem.waterefficiency;
                            var pitdistance = $scope.data.currItem.pitdistance;
                            var units = $scope.data.currItem.units;


                            //用通用物料属性和物料属性值来初始化变量
                            if ($scope.data.currItem.item && $scope.data.currItem.item.bcs_itemprops && $scope.data.currItem.item.bcs_itemprops.length > 0
                                && $scope.data.bcs_item_comprops && $scope.data.bcs_item_comprops.length > 0) {
                                var itemname = $scope.data.currItem.item.itemname;
                                var itemcode = $scope.data.currItem.item.itemcode;
                                //遍历通用物料属性
                                var bFind = false;
                                for (var i = 0; i < $scope.data.bcs_item_comprops.length; i++) {
                                    bFind = false;
                                    //遍历物料属性来初始化变量值
                                    for (var j = 0; j < $scope.data.currItem.item.bcs_itemprops.length; j++) {
                                        if ($scope.data.bcs_item_comprops[i].propname == $scope.data.currItem.item.bcs_itemprops[j].elementname) {
                                            eval("var " + $scope.data.bcs_item_comprops[i].propfield + " = $scope.data.currItem.item.bcs_itemprops[j].elementvalue");
                                            bFind = true;
                                        }
                                        //如果通用物料属性在物料属性中找到这退出物料属性的循环
                                        if (bFind) {
                                            break;
                                        }
                                    }

                                    //遍历完都没找到对应的属性这设置为空
                                    if (!bFind) {
                                        eval("var " + $scope.data.bcs_item_comprops[i].propfield + " = ''");
                                    }
                                }
                            }
                        }

                        //返回事件
                        $scope.LODOP.On_Return = function (TaskID, Value) {
                            if ($scope.data.currItem.oldbarcode && $scope.data.currItem.oldbarcode.length > 0) {

                            } else {
                                //打印成功记录打印数据
                                if (Value > 0) {
                                    var sserialno = "";
                                    $scope.data.currItem.barcodes.forEach(function (item, idx) {
                                        if (sserialno == "") {
                                            sserialno = item.serialno;
                                        } else {
                                            sserialno += "," + item.serialno;
                                        }
                                    });
                                    requestApi.post({
                                        classId: "bcs_barcode_reprint",
                                        action: "print",
                                        data: {
                                            serialno: sserialno
                                        }
                                    }).then(function () {
                                        $scope.data.currItem.can_print_qty = $scope.data.currItem.can_print_qty - 1
                                    })
                                }
                            }
                        }

                        var iLength = $scope.data.currItem.barcodes.length;
                        if (iLength > 49) {
                            $scope.data.currItem.barcodes.forEach(function (item, index) {
                                var serialno = item.serialno;
                                //var productname = item.productname;

                                var strStyle = "<style> table,td,th {border-width: 1px;}</style>";
                                var req = /\"\[/g;
                                var req0 = /\]\"/g;

                                try {
                                    eval(($scope.data.currItem.temp_content).replace(req, "").replace(req0, ""));
                                } catch (err) {
                                    alert(err);
                                    console.log(err);
                                }
                                $scope.LODOP.NEWPAGEA();

                                //每10条记录一组打印
                                if ((index + 1) % 50 == 0) {
                                    //调用打印
                                    $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + index);
                                    $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "条码补打");
                                    if ($scope.data.printtype == 1) {
                                        $scope.LODOP.PRINT();
                                    } else {
                                        $scope.LODOP.PREVIEW();
                                    }
                                }
                            });


                            //最后判断不是整除的话打印剩余数据
                            if (iLength % 50 > 0) {
                                //调用打印
                                $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "条码补打");
                                $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + iLength);
                                if ($scope.data.printtype == 1) {
                                    $scope.LODOP.PRINT();
                                } else {
                                    $scope.LODOP.PREVIEW();
                                }
                                //return $scope.LODOP.PREVIEW();
                            }
                        } else if (iLength > 0) {
                            $scope.data.currItem.barcodes.forEach(function (item, index) {
                                var serialno = item.serialno;
                                var strStyle = "<style> table,td,th {border-width: 1px;}</style>";
                                var req = /\"\[/g;
                                var req0 = /\]\"/g;

                                try {
                                    eval(($scope.data.currItem.temp_content).replace(req, "").replace(req0, ""));
                                } catch (err) {
                                    alert(err);
                                }
                                $scope.LODOP.NEWPAGEA();
                            });
                            //调用打印
                            $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + iLength);
                            $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "条码补打");
                            if ($scope.data.printtype == 1) {
                                return $scope.LODOP.PRINT();
                            } else {
                                return $scope.LODOP.PREVIEW();
                            }
                            //return $scope.LODOP.PREVIEW();
                        }
                    });
                }

                //校验可用差额
                $scope.checkDif = function () {
                    if ($scope.data.currItem.dif == 0) {
                        $scope.data.currItem.dif = "0"
                    }
                    if ($scope.data.currItem.dif < 0) {
                        swalApi.info("数字不能小于0")
                        $scope.data.currItem.dif = "0"
                    }
                }

                /**搜索产品编码 */
                $scope.searchItem = {
                    action: "search",
                    afterOk: function (result) {
                        $scope.data.currItem.itemid = result.itemid;
                        $scope.data.currItem.itemcode = result.itemcode;
                        $scope.data.currItem.itemname = result.itemname;
                    }
                }

                /**搜索条码 */
                $scope.searchBarcode = {
                    action: "search",
                    afterOk: function (result) {
                        $scope.data.currItem.oldbarcode = result.short_barcode;
                        $scope.data.currItem.itemid = result.itemid;
                        $scope.data.currItem.itemcode = result.productno;
                        $scope.data.currItem.itemname = result.productname;
                        $scope.data.currItem.packqty = 1;
                    }
                }

                /**搜索打印模板 */
                $scope.searchprint = {
                    action: "search",
                    sqlWhere: 'inneruse = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.temp_name = result.temp_name;
                        $scope.data.currItem.temp_id = result.temp_id;
                        $scope.data.currItem.temp_content = result.temp_content;
                        $scope.data.currItem.docid = result.docid;
                        $scope.data.currItem.print_software = result.print_software;
                        $scope.data.currItem.temp_width = result.width;
                        $scope.data.currItem.temp_height = result.height;
                    }
                }

                /**
               * 保存验证
               */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    // if ($scope.data.currItem.reprintqty > 0 && $scope.data.currItem.packqty > 1
                    //     && $scope.data.currItem.reprintqty % $scope.data.currItem.packqty > 0) {
                    //     invalidBox.push('补打数量必须是包件数量的整数倍！');
                    // }
                };

                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    //查询产品通用属性 用来打印的时候初始化属性变量
                    requestApi.post({
                        classId: "bcs_item_comprop",
                        action: "search"
                    }).then(function (data) {
                        if (data.bcs_item_comprops && data.bcs_item_comprops.length > 0) {
                            $scope.data.bcs_item_comprops = data.bcs_item_comprops;
                        }
                    })
                }

                //添加打印预览按钮
                $scope.footerRightButtons.generate = {
                    title: "打印预览",
                    icon: "iconfont hc-print",
                    click: function () {
                        $scope.print(2);
                    }
                }

                $scope.footerRightButtons.saveThenAdd.hide = true;
            }];


        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });