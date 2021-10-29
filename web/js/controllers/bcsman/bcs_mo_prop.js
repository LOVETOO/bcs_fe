/**
 * 工单查询属性
 * @since 2019-12-25
 * 巫奕海
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$q', 'swalApi', 'requestApi', 'numberApi', 'fileApi','lodop'],
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
                 $scope.userbean = userbean;
                /**
                 * 重写方法
                 */
                $scope.print = function (itype) {
                    if(itype){
                        //预览
                        $scope.data.printtype = itype;
                    }else{
                        //打印
                        $scope.data.printtype = 1;
                    }
                    //获取lodop对象
                    $scope.LODOP = getLodop();
                    if ($scope.LODOP) {
                        return $q
                            .when()
                            .then(function () {
                                return swalApi.input({
                                    title: '请输入打印数量',
                                    inputValidator: function (value) {
                                        if (value == "") {
                                            return '打印数量不能为空'
                                        }
                                        var check = /^\d+$/;
                                        if (!Number.isInteger(parseInt(value)) || !check.test(value)) {
                                            return '请输入正整数';
                                        }
                                        if (value > $scope.data.currItem.surplus_qty) {
                                            return '超出剩余数量';
                                        }
                                        if ($scope.data.currItem.temp_content == "" || $scope.data.currItem.temp_content == undefined) {
                                            return '该产品没有关联打印模板';
                                        }

                                        if (parseInt($scope.data.currItem.packqty) == 0) {
                                            return '包件数量必须大于0！';
                                        } 
                                    }
                                });
                            })
                            .then(function (data) {
                                $scope.data.currItem.rownum = data
                                return data;
                            })
                            .then(function (data) {
                                $scope.data.currItem.can_print_qty = parseInt($scope.data.currItem.can_print_qty) - parseInt(data);
                                //继承基类的打印
                                //$scope.hcSuper.print();
                                promise = $q.when($scope.data.currItem).then($scope.beforePrint).then($scope.doPrint).then(function (obj) {
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
                $scope.beforePrint = function (data) {
                    return requestApi.post({
                        classId: "bcs_mo",
                        action: "getbarcode",
                        data: {
                            mono: data.mono,
                            rownum: data.rownum,
                            num: data.num,
                            in_generate_qty: data.rownum,
                            factbase: $scope.data.currItem.factbase,
                            packqty: $scope.data.currItem.packqty,
                            moid: $scope.data.currItem.moid,
                            itemcode: $scope.data.currItem.itemcode,
                            item_name:$scope.data.currItem.itemname,
                            pack_size:$scope.data.currItem.pack_size,
                            pakageno:$scope.data.currItem.pakageno,
                            qc:$scope.data.currItem.qc,
                            produce_code:$scope.data.currItem.produce_code,
                            pack_no:$scope.data.currItem.pack_no,
                            gweight:$scope.data.currItem.gweight,
                            factory_workshop:$scope.data.currItem.factory_workshop
                        }
                    }).then(function (val) { 
                        data['barcodes'] = val.barcodes;
                        return data;
                    })
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
                                    classId: "bcs_mo",
                                    action: "print",
                                    data: {
                                        serialno: sserialno
                                    }
                                }).then(function () {
                                    //$scope.data.currItem.can_print_qty = $scope.data.currItem.can_print_qty - 1
                                })
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
                                }
                                $scope.LODOP.NEWPAGEA();

                                //每10条记录一组打印
                                if ((index + 1) % 50 == 0) {
                                    //调用打印
                                    $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + index);
                                    $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "工单打印");
                                    if($scope.data.printtype == 1){
                                        $scope.LODOP.PRINT();
                                    }else{
                                        $scope.LODOP.PREVIEW();
                                    }
                                }
                            });

                            //最后判断不是整除的话打印剩余数据
                            if (iLength % 50 > 0) {
                                //调用打印
                                $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + iLength);
                                $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "工单打印");
                                if($scope.data.printtype == 1){
                                    return $scope.LODOP.PRINT();
                                }else{
                                    return $scope.LODOP.PREVIEW();
                                }
                                //return $scope.LODOP.PREVIEW();
                            }
                        } else if (iLength > 0) {
                            $scope.data.currItem.barcodes.forEach(function (item, index) {
                                //序号
                                var serialno = item.serialno;
                                //产品名称
                                var item_name = item.item_name;
                                //产品料号
                                var erpno = item.erpno;
                                //包件数
                                var pack_qty = item.pack_qty;
                                //包装箱号
                                var pack_no = item.pack_no;
                                //毛重
                                var gweight = item.gweight;
                                //加工车间
                                var factory_workshop = item.factory_workshop;
                                //包装尺寸
                                var pack_size = item.pack_size;
                                //包装工号
                                var pakageno = item.pakageno;
                                //qc
                                var qc = item.attribute4;
                                //生产码
                                var produce_code = item.attribute5;
                                //生产企业
                                var factory_name = item.attribute6;
                                //生产地址
                                var factory_address = item.attribute7;
                                var strStyle = "<style> table,td,th {border-width: 1px;}</style>";
                                var req = /\"\[/g;
                                var req0 = /\]\"/g;

                                try {
                                    eval(($scope.data.currItem.temp_content).replace(req, "").replace(req0, ""));
                                } catch (err) {
                                    alert(err);
                                }
                                $scope.LODOP.NEWPAGEA();
                                $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "工单打印");
                            });
                            //调用打印
                            $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + iLength);
                            if($scope.data.printtype == 1){
                                return $scope.LODOP.PRINT();
                            }else{
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

                /**
             * 保存验证
             */
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                };


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


                $scope.downLoadFile = function () {
                    fileApi.downloadFile($scope.data.currItem.docid);
                }

                $scope.setBizData = function (bizData) {
                    requestApi.post({
                        classId: "bcs_mo",
                        data: {
                            itemcode: bizData.itemcode,
                            itemid: bizData.itemid,
                            organizationid: bizData.organizationid
                        },
                        action: "gettemp"
                    }).then(function (data) {
                        if (data.bcs_print_temp && data.bcs_print_temp.length > 0) {
                            bizData.temp_content = data.bcs_print_temp[0].temp_content;
                            bizData.temp_width = data.bcs_print_temp[0].temp_width;
                            bizData.temp_height = data.bcs_print_temp[0].temp_height;
                        } else {
                            // bizData.temp_content = ""
                        }
                    })

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

                $scope.doBeforeSave = function (postParams) {
                    //处理item对象
                    if (postParams.data.item) {
                        postParams.data = angular.copy(postParams.data);
                        delete postParams.data.item;
                    }
                };

                $scope.footerRightButtons.saveThenAdd.hide = true;

                $scope.footerRightButtons.generate = {
                    title: "打印预览",
                    icon: "iconfont hc-print",
                    click: function () { 
                        $scope.print(2);
                    }
                }
            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义 
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });