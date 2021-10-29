/**
 * 产品资料-属性页
 * 2018-10-11
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi) {
        'use strict';
        var controller = [
            //声明依赖注入
            '$scope', 'BasemanService', 'Magic',
            //控制器函数
            function ($scope, BasemanService, Magic) {

                /*-------------------数据定义开始------------------------*/
                $scope.commonSearchSetting = {};//通用查询设置
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: "序号"
                        },
                        {
                            field: 'style',
                            headerName: '调整类型',
                            hcDictCode: 'style'
                        }, {
                            field: 'adjust_amt',
                            headerName: '调整金额',
                            hcRequired: true
                        }, {
                            field: 'dname',
                            headerName: '预算期间',
                            hcRequired: true
                        }, {
                            field: 'bud_type_code',
                            headerName: '预算类别编码',
                            hcRequired: true
                        }, {
                            field: 'bud_type_name',
                            headerName: '预算类别名称'
                        }, {
                            field: 'object_code',
                            hcRequired: true,
                            headerName: '费用对象编码'
                        }, {
                            field: 'object_name',
                            headerName: '费用对象名称'
                        }, {
                            field: 'object_type',
                            headerName: '费用对象类别',
                            hcDictCode: "fin_object_type"
                        }, {
                            field: 'org_code',
                            headerName: '机构编码',
                            hcRequired: true
                        }, {
                            field: 'org_name',
                            headerName: '机构名称'
                        }, {
                            field: 'crm_entid',
                            headerName: '品类',
                            hcRequired: true,
                            hcDictCode: "crm_entid"
                        }
                    ]
                };

                /**
                 * 定义当前对象
                 * @returns {*|{}}
                 */
                function currItem() {
                    return $scope.data.currItem;
                }

                /**
                 * 定义明细数据行数组
                 * @returns {*|{}}
                 */
                function currLine() {
                    return $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers;
                }

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                /**
                 * 部门查询
                 */
                $scope.searchDept = function (searchType) {
                    return $scope.commonSearchSetting.dept = {
                        classId: 'dept',
                        afterOk: function (result) {
                            if (searchType == 'AddDetail') {
                                currItem().AddItem.org_id = result.dept_id;
                                currItem().AddItem.org_code = result.dept_code;
                                currItem().AddItem.org_name = result.dept_name;
                                //逻辑关联,预算类别改变,需要清空预算期间,让用户重新选择
                                delete currItem().AddItem.dname;
                            } else if (searchType == 'DecreaseDetail') {
                                currItem().DecreaseItem.org_code = result.dept_code;
                                currItem().DecreaseItem.org_name = result.dept_name;
                                currItem().DecreaseItem.org_id = result.dept_id;
                                if (currItem().DecreaseItem.object_id && currItem().DecreaseItem.dname) {
                                    checkDec_atm();
                                }
                                delete currItem().DecreaseItem.dname;
                            }
                            else if (searchType == 'checkDetail') {
                                currItem().org_code = result.dept_code;
                                currItem().org_name = result.dept_name;
                                currItem().org_id = result.dept_id;
                            }
                        }
                    };
                };

                /**
                 * 预算类别
                 */
                $scope.searchBudType = function (searchType) {
                    return $scope.commonSearchSetting.budtype = {
                        classId: 'fin_bud_type_header',

                        afterOk: function (result) {
                            if (searchType == 'AddDetail') {
                                currItem().AddItem.bud_type_name = result.bud_type_name;
                                currItem().AddItem.bud_type_code = result.bud_type_code;
                                currItem().AddItem.bud_type_id = result.bud_type_id;
                                currItem().AddItem.fee_type_id = result.fee_type_id;
                                currItem().AddItem.period_type = result.period_type;

                                //逻辑关联,预算类别改变,需要清空费用对象,让用户重新选择
                                delete currItem().AddItem.object_name;
                                delete currItem().AddItem.object_code;
                                delete currItem().AddItem.object_type;
                                delete currItem().AddItem.object_id;
                            } else if (searchType == 'DecreaseDetail') {
                                currItem().DecreaseItem.bud_type_name = result.bud_type_name;
                                currItem().DecreaseItem.bud_type_code = result.bud_type_code;
                                currItem().DecreaseItem.bud_type_id = result.bud_type_id;
                                currItem().DecreaseItem.fee_type_id = result.fee_type_id;
                                currItem().DecreaseItem.period_type = result.period_type;

                                delete currItem().DecreaseItem.object_name;
                                delete currItem().DecreaseItem.object_code;
                                delete currItem().DecreaseItem.object_type;
                                delete currItem().DecreaseItem.object_id;
                            }
                        }
                    };
                };


                /**
                 * 查询费用项目
                 */
                $scope.searchFeeObject = function (name, postdata) {
                    return $scope.commonSearchSetting.finObject = {
                        beforeOpen: function () {
                            if (name == 'AddItem') {
                                if (!currItem().AddItem.bud_type_id) {
                                    swalApi.info("请先选择预算类别");
                                    return false;
                                } else {
                                    postdata = {
                                        bud_type_id: currItem().AddItem.bud_type_id,
                                        fee_type_id: currItem().AddItem.fee_type_id,
                                        flag: 1
                                    };
                                }
                            } else if (name == 'DecreaseItem') {
                                if (!currItem().DecreaseItem.bud_type_id) {
                                    swalApi.info("请先选择预算类别");
                                    return false;
                                } else {
                                    postdata = {
                                        bud_type_id: currItem().DecreaseItem.bud_type_id,
                                        fee_type_id: currItem().DecreaseItem.fee_type_id,
                                        flag: 1
                                    };
                                }
                            }
                            $scope.commonSearchSetting.finObject.postData = postdata;
                        },
                        classId: 'fin_bud_type_line_obj',
                        action: 'search',
                        title: '费用对象查询',
                        postData: postdata,
                        gridOptions: {
                            "columnDefs": [
                                {
                                    headerName: "费用对象编码",
                                    field: "object_code"
                                }, {
                                    headerName: "费用对象名称",
                                    field: "object_name"
                                }, {
                                    headerName: "对象类型",
                                    field: "object_type",
                                    hcDictCode: "fin_object_type"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            if (name == 'AddItem') {
                                currItem().AddItem.object_id = result.object_id;
                                currItem().AddItem.object_name = result.object_name;
                                currItem().AddItem.object_code = result.object_code;
                                currItem().AddItem.object_type = result.object_type;
                            } else if (name == 'DecreaseItem') {
                                currItem().DecreaseItem.object_id = result.object_id;
                                currItem().DecreaseItem.object_name = result.object_name;
                                currItem().DecreaseItem.object_code = result.object_code;
                                currItem().DecreaseItem.object_type = result.object_type;
                                if (currItem().DecreaseItem.org_id && currItem().DecreaseItem.dname) {
                                    checkDec_atm();
                                }
                            }
                        }
                    };
                };


                //查询预算期间
                $scope.searchBudPeriod = function (name, postdata) {
                    return $scope.commonSearchSetting.BudPeriod = {
                        beforeOpen: function () {
                            if ((name == 'AddItem' && !currItem().AddItem.org_id)
                                || (name == 'DecreaseItem' && !currItem().DecreaseItem.org_id)) {
                                swalApi.info("请先选择预算机构");
                                return false;
                            }
                            if ((name == 'AddItem' && !currItem().AddItem.crm_entid)
                                || (name == 'DecreaseItem' && !currItem().DecreaseItem.crm_entid)) {
                                swalApi.info("请先选择品类");
                                return false;
                            }
                            postdata = {
                                period_year: $scope.data.currItem.bud_year,
                                flag: 3,
                                period_type: name == 'AddItem' ? currItem().AddItem.period_type : currItem().DecreaseItem.period_type
                            };
                            $scope.commonSearchSetting.BudPeriod.postData = postdata;
                        },
                        classId: 'fin_bud_period_header',
                        title: '预算期间查询',
                        postData: postdata,
                        gridOptions: {
                            "columnDefs": [
                                {
                                    headerName: "预算期间名称",
                                    field: "dname"
                                }, {
                                    headerName: "开始日期",
                                    field: "start_date"
                                }, {
                                    headerName: "结束日期",
                                    field: "end_date"
                                }
                            ]
                        },
                        afterOk: function (result) {
                            if (name == 'AddItem') {
                                var data = BasemanService.RequestPostSync("fin_bud", "getbudid", {
                                    "org_id": currItem().AddItem.org_id,
                                    "bud_type_id": currItem().AddItem.bud_type_id,
                                    "object_id": currItem().AddItem.object_id,
                                    "period_line_id": result.period_line_id,
                                    "crm_entid": currItem().AddItem.crm_entid,
                                    "dname": result.dname
                                });
                                if (data.no_bud == 1) {
                                    swalApi.info("所调整的预算没有编制");
                                    return;
                                } else {
                                    currItem().AddItem.dname = result.dname;
                                    currItem().AddItem.period_line_id = result.period_line_id;
                                    currItem().AddItem.bud_id = data.bud_id;

                                }
                            } else if (name == 'DecreaseItem') {
                                var data = BasemanService.RequestPostSync("fin_bud", "getbudid", {
                                    "org_id": currItem().DecreaseItem.org_id,
                                    "bud_type_id": currItem().DecreaseItem.bud_type_id,
                                    "object_id": currItem().DecreaseItem.object_id,
                                    "period_line_id": result.period_line_id,
                                    "crm_entid": currItem().DecreaseItem.crm_entid,
                                    "dname": result.dname
                                });
                                if (data.no_bud == 1) {
                                    swalApi.info("所调整的预算没有编制");
                                    return;
                                }
                                currItem().DecreaseItem.dname = result.dname;
                                currItem().DecreaseItem.period_line_id = result.period_line_id;
                                currItem().DecreaseItem.bud_id = data.bud_id;

                                if (currItem().DecreaseItem.object_id && currItem().DecreaseItem.org_id) {
                                    checkDec_atm();
                                }
                            }
                        }
                    };
                };
                /*-------------------通用查询结束---------------------*/

                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //把数据扔到到明细表
                $scope.setBizData = function (bizData) {
                    //设置头部数据的步骤已在基础控制器实现
                    $scope.hcSuper.setBizData(bizData);
                    //设置明细数据到表格
                    $scope.gridOptions.hcApi.setRowData(currLine());

                    totalCount(currLine());
                };

                /**
                 * 新建单据时初始化数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData); //继承基础控制器的方法，类似Java的super
                    $scope.data.currItem.org_id = userbean.org_id;
                    $scope.data.currItem.org_code = userbean.org_code;
                    $scope.data.currItem.org_name = userbean.org_name;
                    $scope.data.currItem.creator_name = strUserName;
                    $scope.data.currItem.chap_name = strUserName;
                    $scope.data.currItem.style = 1;
                    $scope.data.currItem.chap_code = strUserId;
                    $scope.data.currItem.create_time = Magic.now();
                    $scope.data.currItem.bill_date = Magic.today();
                    $scope.data.currItem.bud_year = Magic.nowYear();
                    $scope.data.currItem.fin_bud_adjust_lineoffin_bud_adjust_headers = [];
                    $scope.data.currItem.AddItem = [];
                    $scope.data.currItem.DecreaseItem = [];
                };

                /*--------------------业务逻辑方法 开始--------------------------------*/

                //校验调减金额是否在可用范围之内
                function checkDec_atm() {
                    var sqlwhere =
                        " Fin_Bud.Bud_Year=" + currItem().bud_year +
                        " and Fin_Bud.bud_type_id=" + currItem().DecreaseItem.bud_type_id +
                        " and Fin_Bud.Item_Type_Id=0 " +
                        " and Fin_Bud.Object_Id=" + currItem().DecreaseItem.object_id +//查费用项目
                        " and Fin_Bud.Org_Id=" + currItem().DecreaseItem.org_id +
                        " and Fin_Bud.crm_entid=" + currItem().DecreaseItem.crm_entid +
                        " and Fin_Bud.period_line_id= '" + currItem().DecreaseItem.period_line_id + "'";
                    var postData = {
                        classId: "fin_bud",
                        action: 'search',
                        data: {sqlwhere: sqlwhere}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.fin_buds.length > 0) {
                                $scope.canuseamt = data.fin_buds[0].canuse_amt;
                                return data.fin_buds[0];
                            } else {
                                swalApi.info("调减部门预算不存在！");
                                return $q.reject("预算不存在！");
                            }
                        });
                }

                //编辑调整调减后 累加 并显示到表单框事件
                function totalCount(rowdatas) {
                    var addTotal = 0;
                    var decTotal = 0;
                    $.each(rowdatas, function (index, item) {
                        if (item.adjust_amt != null && item.style == 1) {
                            addTotal += numberApi.toNumber(item.adjust_amt, 0);
                        }
                        if (item.adjust_amt != null && item.style == 2) {
                            decTotal += numberApi.toNumber(item.adjust_amt, 0);
                        }
                    });
                    $scope.addTotal = addTotal;
                    $scope.decTotal = decTotal;
                }


                /**
                 * 保存
                 */
                $scope.save = function () {
                    $scope.gridOptions.api.stopEditing();
                    return $scope.hcSuper.save();
                };

                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.newDetail && $scope.newDetail();
                    }
                };

                //底部左边按钮
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    }
                };


                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        currLine().splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(currLine());
                        totalCount(currLine());
                    }
                };

                /**
                 * 弹出添加明细框
                 */
                $scope.newDetail = function () {
                    var msg = $scope.validHead([]);
                    if (msg.length > 0) {
                        return swalApi.info(msg);
                    }
                    currItem().AddItem = {};
                    currItem().DecreaseItem = {};
                    $scope.AddDisabled = true;
                    $scope.DecreaseDisabled = true;
                    if (currItem().style == 1) {
                        $scope.AddDisabled = false;
                        currItem().AddItem.style = $scope.data.currItem.style;
                    } else if (currItem().style == 2) {
                        $scope.DecreaseDisabled = false;
                        currItem().DecreaseItem.style = $scope.data.currItem.style;
                        $scope.DecItemForm.$setPristine();
                    } else if ($scope.data.currItem.style == 3) {
                        $scope.AddDisabled = false;
                        $scope.DecreaseDisabled = false;
                        $scope.AddItemForm.$setPristine();
                        $scope.DecItemForm.$setPristine();
                        currItem().DecreaseItem.style = 2;
                        currItem().AddItem.style = 1;
                    }
                    $("#AddDetailModal").modal();
                };

                //双向调整时 金额保持一致
                $scope.same = function (item) {
                    if (currItem().style == 3) {
                        if (item == 'addItem') {
                            currItem().DecreaseItem.adjust_amt = currItem().AddItem.adjust_amt;
                        }
                        if (item == "decItem") {
                            currItem().AddItem.adjust_amt = currItem().DecreaseItem.adjust_amt;
                        }
                    }
                };

                //如果改变调整类型下拉窗口,必须清空已添加的明细重新输入
                $scope.onChangeClear = function () {
                    if (currLine().length > 0) {
                        currItem().fin_bud_adjust_lineoffin_bud_adjust_headers = [];
                        $scope.gridOptions.hcApi.setRowData(currLine());
                        $scope.addTotal = 0;
                        $scope.decTotal = 0;
                    }
                };

                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);

                    // if(getCurrItem().inv_out_bill_lineofinv_out_bill_heads.length == 0){
                    //     invalidBox.push('请添加明细！');
                    // }
                    // var lineData = getCurrItem().inv_out_bill_lineofinv_out_bill_heads;
                    // lineData.forEach(function (line, index) {
                    //     var row = index + 1;
                    //     if (!line.item_id)
                    //         invalidBox.push('第' + row + '行产品不能为空');
                    //     if (!line.warehouse_id)
                    //         invalidBox.push('第' + row + '行仓库不能为空');
                    //     if (!line.qty_bill||line.qty_bill==0)
                    //         invalidBox.push('第' + row + '行出库数量不合法');
                    // });
                };

                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                }


                /**
                 * 将明细暂时放入表中
                 */
                $scope.saveDetail = function () {
                    if (currItem().style == 1) {
                        currItem().AddItem.seq = currLine().length + 1;
                        currLine().push(currItem().AddItem);
                        $scope.gridOptions.hcApi.setRowData(currLine());
                        totalCount(currLine());
                        $("#AddDetailModal").modal('hide');
                    } else if (currItem().style == 2) {
                        if ($scope.canuseamt < currItem().DecreaseItem.adjust_amt) {
                            swalApi.info(currItem().DecreaseItem.dname + "期间," + currItem().DecreaseItem.org_name + "的" + currItem().DecreaseItem.object_name + " 的可调整金额<= " + $scope.canuseamt + ",无法调减");
                            return;
                        }
                        currItem().DecreaseItem.seq = currLine().length + 1;
                        currLine().push(currItem().DecreaseItem);
                        currItem().De_adjust_amt = currItem().DecreaseItem.adjust_amt;
                        $scope.gridOptions.hcApi.setRowData(currLine());
                        totalCount(currLine());
                        $("#AddDetailModal").modal('hide');
                    } else if (currItem().style == 3) {
                        if (currItem().AddItem.bud_type_code == currItem().DecreaseItem.bud_type_code
                            && currItem().AddItem.object_code == currItem().DecreaseItem.object_code
                            && currItem().AddItem.org_code == currItem().DecreaseItem.org_code) {
                            swalApi.info("双向调整的预算类别|费用对象|预算机构不能全部完全一致,必须有一项不同");
                            return;
                        }
                        if ($scope.canuseamt < currItem().DecreaseItem.adjust_amt) {
                            swalApi.info(currItem().DecreaseItem.dname + "期间," + currItem().DecreaseItem.org_name + "的" + currItem().DecreaseItem.object_name + " 的可调整金额<= " + $scope.canuseamt + ",无法调减");
                            return;
                        }

                        currItem().AddItem.seq = currLine().length + 1;
                        currItem().DecreaseItem.seq = currLine().length + 2;
                        currLine().push(currItem().AddItem);
                        currLine().push(currItem().DecreaseItem);
                        $scope.gridOptions.hcApi.setRowData(currLine());
                        totalCount(currLine());
                        $("#AddDetailModal").modal('hide');
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