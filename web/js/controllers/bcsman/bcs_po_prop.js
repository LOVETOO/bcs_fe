/**
 * 工单查询属性
 * @since 2019-12-25
 * 巫奕海
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
                $scope.userbean = userbean;

                /**
                 * 重写方法
                 */
                $scope.print = function (itype) {
                    if (itype) {
                        //预览
                        $scope.data.printtype = itype;
                    } else {
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
                                        if (parseInt(value) > parseInt($scope.data.currItem.can_print_qty)) {
                                            return '超出可打印数量';
                                        }
                                        if ($scope.data.currItem.temp_content == "" || $scope.data.currItem.temp_content == undefined) {
                                            return '该产品没有关联打印模板';
                                        }

                                        if (!$scope.data.currItem.factbase) {
                                            return '请选择基地';
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
                                //$scope.data.currItem.can_print_qty = parseInt($scope.data.currItem.can_print_qty) - parseInt(data)
                                //$scope.hcSuper.print()

                                promise = $q.when($scope.data.currItem).then($scope.beforePrint).then($scope.doPrint).then(function (obj) {
                                    console.log("printreturn objj: ", obj);
                                    var count = $scope.LODOP.GET_VALUE('PRINTED_TIMES');
                                });
                            })
                    } else {
                        promise = $q.reject();
                    }
                };

                $scope.beforePrint = function (data) {

                    var response = requestApi.syncPost({
                        classId: "bcs_po",
                        action: "getbarcode",
                        data: {
                            pono: data.pono,
                            in_generate_qty: data.rownum,
                            factbase: $scope.data.currItem.factbase,
                            packqty: $scope.data.currItem.packqty,
                            poid: $scope.data.currItem.poid,
                            itemcode: $scope.data.currItem.itemcode,
                            deliver_date: $scope.data.currItem.deliver_date
                        },
                        noShowWaiting: false
                    });

                    data['barcodes'] = response.barcodes;
                    return data;
                }

                $scope.doPrint = function (data) {
                    return $q.when().then(function () {
                        //获取lodop对象
                        //$scope.LODOP = getLodop();
                        //$scope.data.currItem = arguments[0];
                        if ($scope.data.currItem.barcodes && $scope.data.currItem.barcodes.length > 0) {
                            var packsize = $scope.data.currItem.packqty;
                            var waterconsumption = $scope.data.currItem.waterconsumption;
                            var waterefficiency = $scope.data.currItem.waterefficiency;
                            var pitdistance = $scope.data.currItem.pitdistance;
                            var units = $scope.data.currItem.units;

                            //用通用物料属性和物料属性值来初始化变量
                            if ($scope.data.currItem.item && $scope.data.currItem.item.bcs_itemprops && $scope.data.currItem.item.bcs_itemprops.length > 0
                                && $scope.data.bcs_item_comprops && $scope.data.bcs_item_comprops.length > 0) {

                                /**
                                 * 声明变量用于打印时填充在标签上
                                 */
                                var itemname = $scope.data.currItem.item.itemname;
                                var itemcode = $scope.data.currItem.item.itemcode;
                                var notes = $scope.data.currItem.itemnotes;
                                var custname = "";
                               
                                var httpip = window.location.origin;
                                $scope.data.currItem.httpip = httpip;

                                //图片id
                                var docid = parseInt($scope.data.currItem.item.docid) > 0 ? parseInt($scope.data.currItem.item.docid) : 0;

                                if (docid == undefined || docid == 0 || docid == "0") {
                                    docid = 0;
                                }
                                $scope.data.docid = docid > 0 ? docid : 0

                                if ($scope.data.currItem.item.itemname.indexOf("//") > 0) {
                                    var names = $scope.data.currItem.item.itemname.split("//");
                                    //固定取第1个做为客户名称
                                    if (names.length > 1) {
                                        custname = names[1];
                                    }
                                }
                                //遍历通用物料属性
                                var bFind = false;
                                var shifoubaoanzhuang = ""
                                var xinhao = "";
                                for (var i = 0; i < $scope.data.bcs_item_comprops.length; i++) {
                                    bFind = false;
                                    //遍历物料属性来初始化变量值
                                    for (var j = 0; j < $scope.data.currItem.item.bcs_itemprops.length; j++) {
                                        if ($scope.data.bcs_item_comprops[i].propname == $scope.data.currItem.item.bcs_itemprops[j].elementname) {
                                            eval("var " + $scope.data.bcs_item_comprops[i].propfield + " = $scope.data.currItem.item.bcs_itemprops[j].elementvalue");
                                            
                                            /**如果存在shifoubaoanzhuang这个字段则声明这个变量 */
                                            if ($scope.data.bcs_item_comprops[i].propfield == "xinhao") {
                                                xinhao = $scope.data.currItem.item.bcs_itemprops[j].elementvalue;
                                            }
                                            /**如果存在shifoubaoanzhuang这个字段则声明这个变量 */
                                            if ($scope.data.bcs_item_comprops[i].propfield == "shifoubaoanzhuang") {
                                                shifoubaoanzhuang = $scope.data.currItem.item.bcs_itemprops[j].elementvalue;
                                                // eval("var " + $scope.data.bcs_item_comprops[i].propfield + " = $scope.data.currItem.item.bcs_itemprops[j].elementvalue");
                                            }

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

                                //处理【是否包安装】  条码打印时，根据产品目录组属性"是否包安装"，如果为"是"或者"Y"，在型号栏位前面增加"（含）"显示 add by wzf 2020-08-09 16:56:22
                                if (xinhao && shifoubaoanzhuang && (shifoubaoanzhuang == '是' || shifoubaoanzhuang == 'Y')) {
                                    xinhao += '(含)';
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
                                        classId: "bcs_po",
                                        action: "print",
                                        data: {
                                            serialno: sserialno
                                        }
                                    }).then(function () {
                                        $scope.data.currItem.can_print_qty = $scope.data.currItem.can_print_qty - $scope.data.currItem.in_generate_qty;
                                    })
                                }
                            }

                            var iLength = $scope.data.currItem.barcodes.length;
                            // if (iLength > 49) {
                            //     $scope.data.currItem.barcodes.forEach(function (item, index) {
                            //         var serialno = item.serialno;
                            //         var strStyle = "<style> table,td,th {border-width: 1px;}</style>";
                            //         var req = /\"\[/g;
                            //         var req0 = /\]\"/g;
                            //         try {
                            //             eval(($scope.data.currItem.temp_content).replace(req, "").replace(req0, ""));
                            //         } catch (err) {
                            //             alert(err);
                            //         }
                            //         $scope.LODOP.NEWPAGEA();

                            //         //每10条记录一组打印
                            //         if ((index + 1) % 50 == 0) {
                            //             //调用打印
                            //             $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + index);
                            //             $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "定单打印");
                            //             //$scope.LODOP.PRINT();
                            //             if($scope.data.printtype == 1){
                            //                 $scope.LODOP.PRINT();
                            //             }else{
                            //                 $scope.LODOP.PREVIEW();
                            //             }
                            //         }
                            //     });


                            //     //最后判断不是整除的话打印剩余数据
                            //     if (iLength % 50 > 0) {
                            //         //调用打印
                            //         $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + iLength);
                            //         $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "定单打印");
                            //         //return $scope.LODOP.PRINT();
                            //         //return $scope.LODOP.PREVIEW();
                            //         if($scope.data.printtype == 1){
                            //             $scope.LODOP.PRINT();
                            //         }else{
                            //             $scope.LODOP.PREVIEW();
                            //         }
                            //     }
                            // } else if (iLength > 0) {
                            $scope.data.currItem.barcodes.forEach(function (item, index) {
                                var serialno = item.serialno;
                                const docID = $scope.data.docid;
                                packsize = "";
                                //包件数量为1或者尾号为1的需要显示箱数
                                if (serialno.charAt(serialno.length - 1) == "1" || $scope.data.currItem.packqty == 1) {
                                    packsize = $scope.data.currItem.packqty + "套/箱";
                                }
                                var strStyle = "<style> table,td,th {border-width: 1px;}</style>";
                                var req = /\"\[/g;
                                var req0 = /\]\"/g;

                                /**替换字符串 */
                                $scope.data.currItem.temp_contents = $scope.data.currItem.temp_content
                                    .replace("[httpip]", $scope.data.currItem.httpip != "" ? $scope.data.currItem.httpip : "")
                                    .replace("[docid]", parseInt(docID));

                                try {
                                    eval(($scope.data.currItem.temp_contents).replace(req, "").replace(req0, ""));
                                } catch (err) {
                                    alert(err);
                                }
                                $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "定单打印");
                                $scope.LODOP.NEWPAGEA();
                            });

                            //调用打印
                            $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + iLength);
                            $scope.LODOP.SET_PRINT_PAGESIZE(0, $scope.data.currItem.temp_width + "mm", $scope.data.currItem.temp_height + "mm", "定单打印");
                            //return $scope.LODOP.PRINT();
                            if ($scope.data.printtype == 1) {
                                return $scope.LODOP.PRINT();
                            } else {
                                return $scope.LODOP.PREVIEW();
                            }
                            //return $scope.LODOP.PREVIEW();
                            // }
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

                /**搜索模板 */
                $scope.searchprint = {
                    action: "search",
                    sqlWhere: 'outeruse = 2',
                    afterOk: function (result) {
                        $scope.data.currItem.temp_name = result.temp_name;
                        $scope.data.currItem.temp_id = result.temp_id;
                        $scope.data.currItem.temp_content = result.temp_content;
                        // $scope.data.currItem.docid = result.docid;
                        $scope.data.currItem.print_software = result.print_software;
                        $scope.data.currItem.temp_width = result.width;
                        $scope.data.currItem.temp_height = result.height;
                    }
                }

                $scope.downLoadFile = function () {
                    fileApi.downloadFile($scope.data.currItem.docid);
                }

                $scope.setBizData = function (bizData) {
                    if (bizData.itemnotes == "" && bizData.item) {
                        bizData.itemnotes = bizData.item.notes;
                    }
                    $scope.hcSuper.setBizData(bizData);

                    //模板为空则查询默认模板
                    if (bizData.temp_name == "" && bizData.temp_content == "") {
                        requestApi.post({
                            classId: "bcs_print_template",
                            data: {
                                sqlwhere: " temp_name = 'OEM通用标签'"
                            },
                            action: "search"
                        }).then(function (data) {
                            if (data.bcs_print_templates != [] && data.bcs_print_templates.length > 0) {
                                bizData.temp_content = data.bcs_print_templates[0].temp_content;
                                bizData.temp_width = data.bcs_print_templates[0].width;
                                bizData.temp_height = data.bcs_print_templates[0].height;
                                bizData.temp_name = data.bcs_print_templates[0].temp_name;
                            }
                        })
                    }

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

                //添加打印预览按钮
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