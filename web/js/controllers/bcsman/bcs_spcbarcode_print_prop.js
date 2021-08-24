/**
 * 龙头新产品标签
 * @since 2020年10月22日15:06:50
 * @author Htp
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', '$q', 'swalApi', 'requestApi', 'numberApi', 'fileApi', 'lodop', 'openBizObj'],
    function (module, controllerApi, base_obj_prop, $q, swalApi, requestApi, numberApi, fileApi, lodop, openBizObj) {


        var spcbarcode_print_controller = [
            '$scope',
            function ($scope) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                $scope.data = {};
                //初始化打印模式 1-打印 2-预览
                $scope.data.printtype = 1;
                $scope.userbean = userbean;

                /**初始化产品参数 */
                $scope.data.num = 0;
                $scope.data.color = "";
                $scope.data.gross_weight = 0;
                $scope.data.net_weight = 0;
                $scope.data.product_date = new Date().Format("yyyy-MM-dd");
                $scope.data.exe_standard = "";

                /**
                 * 初始化数据
                 */
                $scope.newBizData = function (currItem) {
                    /**初始化产品参数 */
                    currItem.num = 0;
                    currItem.color = "";
                    currItem.gross_weight = "0";
                    currItem.net_weight = "0";
                    currItem.product_date = new Date().Format("yyyy-MM-dd");
                    currItem.exe_standard = "";
                    currItem.deliver_date = new Date().Format("yyyy-MM-dd");
                    $scope.data.currItem.print_flag = 99;
                    $scope.hcSuper.newBizData(currItem);
                };

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

                                        if (parseInt($scope.data.currItem.can_print_qty) == 0
                                            || (parseInt($scope.data.currItem.can_print_qty)
                                                < parseInt($scope.data.currItem.packqty)
                                                && $scope.data.printtype == 2)) {
                                            return '可生成标签数量不足!';
                                        }

                                        var difData = Math.floor(parseInt($scope.data.currItem.can_print_qty) / parseInt($scope.data.currItem.packqty));

                                        // var difData = Math.round(subData);
                                        if ($scope.data.currItem.can_print_qty % $scope.data.currItem.packqty == 0) {
                                            //说明出除尽了，是整数张    
                                            if (parseInt(value) > difData && $scope.data.printtype == 2) {
                                                return '最多只能打印' + difData + "张大标签!";
                                            }
                                            if (parseInt(value) > difData * $scope.data.currItem.packqty && $scope.data.printtype == 3) {
                                                return '最多只能打印' + difData * $scope.data.currItem.packqty + "张小标签!";
                                            }

                                        } else {
                                            if (parseInt(value) > (difData + 1) && $scope.data.printtype == 2) {
                                                return '最多只能打印' + (difData + 1) + "个大标签!";
                                            }
                                            if (parseInt(value) > (difData + 1) * $scope.data.currItem.packqty && $scope.data.printtype == 3) {
                                                return '最多只能打印' + (difData + 1) * $scope.data.currItem.packqty + "张小标签!";
                                            }
                                        }

                                        $scope.data.currItem.in_generate_qty = parseInt(value);
                                    }
                                })

                            })
                            .then(function (data) {
                                $scope.data.currItem.rownum = data
                                return data;
                            })
                            .then(function (data) {
                                promise = $q.when($scope.data.currItem).then($scope.beforePrint).then($scope.doPrint).then(function (obj) {
                                    console.log("printreturn objj: ", obj);
                                    $scope.LODOP.GET_VALUE('PRINTED_TIMES');
                                });
                            })
                    } else {
                        promise = $q.reject();
                    }
                };

                /**
                 * 保存之后才可以进行打印
                 * @param data
                 * @returns
                 */
                $scope.beforePrint = function (data) {

                    var httpip = window.location.origin;
                    $scope.data.currItem.httpip = httpip;
                    var response = requestApi.syncPost({
                        classId: "bcs_spcbarcode_print",
                        action: "getbarcode",
                        data: {
                            pono: data.pono,
                            in_generate_qty: data.rownum,
                            factbase: $scope.data.currItem.factbase,
                            packqty: $scope.data.currItem.packqty,
                            poid: $scope.data.currItem.poid,
                            itemcode: $scope.data.currItem.itemcode,
                            deliver_date: $scope.data.currItem.deliver_date,
                            print_flag: 99,
                            print_type: $scope.data.printtype,
                            can_print_qty: $scope.data.currItem.can_print_qty
                        },
                        noShowWaiting: false
                    });

                    data['barcodes'] = response.barcodes;
                    return data;
                }

                $scope.doPrint = function (data) {
                    return $q.when().then(function () {
                        //获取lodop对象
                        if ($scope.data.currItem.barcodes && $scope.data.currItem.barcodes.length > 0) {
                            var packsize = $scope.data.currItem.packqty;
                            var waterconsumption = $scope.data.currItem.waterconsumption;
                            var waterefficiency = $scope.data.currItem.waterefficiency;
                            var pitdistance = $scope.data.currItem.pitdistance;
                            var units = $scope.data.currItem.units;

                            //用通用物料属性和物料属性值来初始化变量
                            if ($scope.data.currItem.item
                                && $scope.data.currItem.item.bcs_itemprops
                                && $scope.data.currItem.item.bcs_itemprops.length > 0
                                && $scope.data.bcs_item_comprops
                                && $scope.data.bcs_item_comprops.length > 0) {

                                var itemname = $scope.data.currItem.itemname;
                                var itemcode = $scope.data.currItem.itemcode;
                                var notes = $scope.data.currItem.itemnotes;

                                //生产日期
                                var scrq = $scope.data.currItem.product_date;

                                if (scrq == undefined || scrq == "") {
                                    scrq = new Date().Format("yyyy年MM月dd日");
                                }
                                else {
                                    scrq = new Date(scrq).Format("yyyy年MM月dd日");
                                }

                                //图片id
                                var docid = 0;

                                if ($scope.data.currItem.docid == "" || $scope.data.currItem.docid == 0) {
                                    docid = parseInt($scope.data.currItem.item.docid) > 0 ? parseInt($scope.data.currItem.item.docid) : 0;
                                } else {
                                    docid = parseInt($scope.data.currItem.docid)
                                }

                                if (docid == undefined || docid == 0 || docid == "0") {
                                    docid = 0;
                                }
                                $scope.data.docid = docid > 0 ? docid : 0

                                //数量
                                var sl = $scope.data.currItem.num;
                                if (sl == undefined || sl == 0) {
                                    sl = 0 + "套/箱";
                                } else {
                                    sl = $scope.data.currItem.num + "套/箱"
                                }

                                //颜色
                                var ys = $scope.data.currItem.color;
                                if (ys == undefined || ys == "") {
                                    ys = "";
                                }

                                //毛重
                                var mz = $scope.data.currItem.gross_weight;
                                if (mz == undefined || mz == "") {
                                    mz = "0KG";
                                } else {
                                    mz = $scope.data.currItem.gross_weight + "KG";
                                }

                                //净重
                                var jz = $scope.data.currItem.net_weight;
                                if (jz == undefined || jz == "") {
                                    jz = "0KG";
                                } else {
                                    jz = $scope.data.currItem.net_weight + "KG";
                                }

                                //执行标准
                                var zxbz = $scope.data.currItem.exe_standard;
                                if (zxbz == undefined || zxbz == "") {
                                    zxbz = "";
                                }

                                //获取图路由地址前缀
                                var httpip = $scope.data.currItem.httpip;

                                var custname = "";
                                if (itemname.indexOf("//") > 0) {
                                    var names = itemname.split("//");
                                    //固定取第1个做为客户名称
                                    if (names.length > 1) {
                                        custname = names[1];
                                    }
                                }
                                
                                /**初始化变量 */
                                //型号
                                // var xinhao = "";
                                //品名
                                // var pinming = "";
                                for (var i = 0; i < $scope.data.bcs_item_comprops.length; i++) {
                                    bFind = false;
                                    //遍历物料属性来初始化变量值
                                    for (var j = 0; j < $scope.data.currItem.item.bcs_itemprops.length; j++) {
                                        if ($scope.data.bcs_item_comprops[i].propname == $scope.data.currItem.item.bcs_itemprops[j].elementname) {
                                            // eval("var " + $scope.data.bcs_item_comprops[i].propfield + " = $scope.data.currItem.item.bcs_itemprops[j].elementvalue");
                                            /**如果存在xinhao这个字段则声明这个变量 */
                                            if ($scope.data.bcs_item_comprops[i].propfield == "xinhao") {
                                                var xinhao = $scope.data.currItem.item.bcs_itemprops[j].elementvalue;
                                            }
                                            /**如果存在pinming这个字段则声明这个变量 */
                                            if ($scope.data.bcs_item_comprops[i].propfield == "pinming") {
                                               var pinming = $scope.data.currItem.item.bcs_itemprops[j].elementvalue;
                                            }
                                            bFind = true;
                                        }
                                        //如果通用物料属性在物料属性中找到这退出物料属性的循环
                                        if (bFind) {
                                            break;
                                        }
                                    }
                                    //遍历完都没找到对应的属性这设置为空
                                    // if (!bFind) {
                                    //     eval("var " + $scope.data.bcs_item_comprops[i].propfield + " = ''");
                                    // }
                                }

                                $scope.data.currItem.barcodes.forEach(function (codes) {
                                    Object.assign(codes, {
                                        sl: parseInt(sl), ys: ys,
                                        mz: parseFloat(mz), jz: parseFloat(jz),
                                        scrq: scrq, zxbz: zxbz, docid: parseInt(docid),
                                        httpip: httpip, xinhao: xinhao, pinming: pinming,
                                        custname: custname
                                    })
                                })
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
                                        classId: "bcs_spcbarcode_print",
                                        action: "print",
                                        data: {
                                            serialno: sserialno,
                                            poid: $scope.data.currItem.poid,
                                            in_generate_qty: $scope.data.currItem.in_generate_qty
                                        }
                                    }).then(function () {
                                        if ($scope.data.printtype == 3) {
                                            $scope.data.currItem.can_print_qty = $scope.data.currItem.can_print_qty - $scope.data.currItem.in_generate_qty
                                        }
                                    })
                                }
                            }

                            var iLength = $scope.data.currItem.barcodes.length;

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
                                    .replace("[docid]", parseInt(docID))
                                    .replace("[loginguid]", window.strLoginGuid);

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
                            if ($scope.data.printtype == 1) {
                                return $scope.LODOP.PRINT();
                            } else {
                                return $scope.LODOP.PREVIEW();
                            }
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
                 * @param {*} invalidBox 
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
                        // $scope.data.currItem.docid = result.docid; 注释掉，以防影响到后面的数据
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
                                sqlwhere: " temp_name = 'OEM龙头新标签(大标签)'"
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

                /**搜索产品编码 */
                $scope.searchItem = {
                    action: "search",
                    afterOk: function (result) {
                        $scope.data.currItem.itemid = result.itemid;
                        $scope.data.currItem.itemcode = result.itemcode;
                        $scope.data.currItem.itemname = result.itemname;
                        $scope.data.currItem.docid = result.docid;
                    }
                }

                $scope.footerRightButtons.saveThenAdd.hide = true;

                //添加打印预览按钮
                $scope.footerRightButtons.generateBig = {
                    title: "打印预览(大标签)",
                    icon: "iconfont hc-print",
                    click: function () {
                        $scope.print(2);
                    },
                    // hide: function () {
                    //     if ($scope.data.currItem.temp_name != "OEM龙头新标签(大标签)") {
                    //         return true;
                    //     }
                    //     return false;
                    // }
                }


                $scope.footerRightButtons.generateSmall = {
                    title: "打印预览(小标签)",
                    icon: "iconfont hc-print",
                    click: function () {
                        $scope.print(3);
                    },
                    // hide: function () {
                    //     if ($scope.data.currItem.temp_name != "OEM龙头新标签(小标签)") {
                    //         return true;
                    //     }
                    //     return false;
                    // }
                }



                $scope.showModal = showModal;

                /**
                 * 展示模态框输入产品参数
                 */
                async function showModal() {
                    $scope.data.currItem.sl = 0;
                    $scope.data.currItem.ys = "";
                    $scope.data.currItem.mz = 0.00;
                    $scope.data.currItem.jz = 0.00;
                    $scope.data.currItem.scrq = new Date().Format("yyyy-MM-dd");
                    $scope.data.currItem.zxbz = "";
                    //显示模态框
                    modalBcsItem().modal('show');
                };

                /**
                 * 确认之后关闭模态框
                 */
                $scope.confirm = function confirm() {
                    $scope.data.currItem.confirmFlag = 1;
                    //关闭模态框
                    modalBcsItem().modal('hide');

                    if ($scope.data.currItem.confirmFlag && $scope.data.currItem.confirmFlag == 1) {
                        promise = $q.when($scope.data.currItem)
                            .then($scope.beforePrint)
                            .then($scope.doPrint)
                            .then(function (obj) {
                                console.log("print return objj: ", obj);
                                var count = $scope.LODOP.GET_VALUE('PRINTED_TIMES');
                            });
                    }
                }

                /**
                 * 选择处理部门的模态窗口
                 * @return {jQuery}
                 */
                function modalBcsItem() {
                    return $('#modal_main_item');
                }

                //打开图片预览
                $scope.open = function (docid) {
                    if (docid == 0) {
                        return;
                    }
                    return openBizObj({
                        imageId: docid,
                        images: $scope.data.currItem.bcs_itemprops_images
                    });
                };

                //上传图片
                $scope.uploadImg = function () {
                    fileApi.uploadFile({
                        multiple: false,
                        accept: 'image/*'
                    }).then(function (response) {
                        $scope.data.currItem.item.docid = response[0].docid;
                        $scope.data.currItem.item.docname = response[0].docname;
                        $scope.data.currItem.docid = response[0].docid;
                        $scope.data.currItem.docname = response[0].docname;
                        console.log(response);
                        $scope.data.currItem.bcs_itemprops_images = {
                            docid: response[0].docid,
                            docname: response[0].docname,
                        };
                    });
                };

                //图片删除
                $scope.deleteImg = function (idx) {
                    //重置图片数组中的元素
                    $scope.data.currItem.bcs_itemprops_images[idx]
                        = { docid: 0, seq: idx + 1, docname: $scope.imgMap[idx + 1 + ''] };
                };

                /**清空文本框中的图片名称 */
                $scope.clearImg = function () {
                    /**当docname有值时才清空 */
                    if ($scope.data.currItem.docname != '' && $scope.data.currItem.docname != null) {
                        $scope.data.currItem.docname = '';
                        $scope.data.currItem.docid = 0;
                    }
                };
            }];


        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: spcbarcode_print_controller
        });
    });