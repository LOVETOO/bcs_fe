/**
 * 配件采购申请
 * 2019/7/24.
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi', 'numberApi', '$modal'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi, numberApi, $modal) {


        var controller = [
            '$scope',
            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /*----------------------------------标签定义-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '配件编码',
                            editable: true,
                            hcRequired: true,
                            onCellDoubleClicked: function (args) {
                                $scope.getItemDoubleClicked(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;

                                $scope.getItem(args.newValue, args)
                                    .catch(function (reason) {
                                        return {
                                            item_id: 0,
                                            item_code: '',
                                            item_name: reason
                                        };
                                    })
                                    .then(function (line) {
                                        angular.extend(args.data, line);
                                        args.data.item_id = line.item_id;
                                        args.api.refreshView();
                                    });
                            }
                        }, {
                            field: 'item_name',
                            headerName: '配件名称'
                        }
                        , {
                            /**--------------------------- */
                            field: 'qty',
                            headerName: '申请数量',
                            editable: true,
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;

                                $scope.calAmount(args);
                            }
                        }
                        , {
                            field: 'check_qty',
                            headerName: '审批数量',
                            editable: function () {
                                return $scope.data.currItem.stat > 1;
                            }
                        }, {
                            field: 'inv_loc',
                            headerName: '发货库位',
                            editable: true
                        }
                        , {
                            field: 'normal_price',
                            headerName: '价格',
                            editable: true,
                            type: "金额",
                            onCellValueChanged: function (args) {
                                if (args.newValue === args.oldValue)
                                    return;

                                $scope.calAmount(args);
                            }
                        }, {
                            field: 'amount',
                            headerName: '申请金额',
                            type: "金额"
                        }, {
                            field: 'check_amount',
                            headerName: '审批金额',
                            type: "金额"
                        }
                        , {
                            field: 'reasons',
                            headerName: '差异原因',
                            editable:true
                        },
                        {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 150

                        }
                    ]
                };

                /***************************************按钮定义************************** */

                    //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    icon: 'fa fa-plus',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                $scope.footerLeftButtons.del_line = {
                    icon: 'fa fa-minus',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                        $scope.calTotal();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

                /*---------------------------通配查询---------------------------------*/
                //收货城市
                $scope.commonSearchOfScpareaCity = {
                    sqlWhere: "areatype = 5 ",
                    afterOk: function (result) {
                        $scope.data.currItem.to_area_id = result.areaid;
                        $scope.data.currItem.to_area_code = result.areacode;
                        $scope.data.currItem.to_area_name = result.areaname;
                    }
                };

                //网点名称
                $scope.commonSearchOfItemFixOrg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.fix_org_id = result.fix_org_id;
                        $scope.data.currItem.fix_org_code = result.fix_org_code;
                        $scope.data.currItem.fix_org_name = result.fix_org_name;
                    }

                };
                /**
                 * 查询配件资料 双击单元格
                 * @param args 本行数据
                 */
                $scope.getItemDoubleClicked = function (args) {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'css_item',  //类id
                            postData: {},
                            sqlWhere: function () {
                                //过滤掉已被选择的配件
                                var str = '1=1';

                                if ($scope.data.currItem.css_item_apply_lineofcss_item_apply_headers.length > 0) {
                                    var lineData = angular.copy($scope.data.currItem.css_item_apply_lineofcss_item_apply_headers);

                                    lineData.forEach(function (cur, index) {
                                        if (cur.item_id) {
                                            if (str == '1=1') {
                                                str += ' and item_id not in ( ' + cur.item_id;
                                            } else if (index != lineData.length - 1) {
                                                str += ',' + cur.item_id;
                                            } else if (index == lineData.length - 1) {
                                                str += ',' + cur.item_id + ')';
                                            }
                                        }
                                    });
                                }

                                //补充括号
                                var regExLeft = new RegExp('[(]');
                                var regExRight = new RegExp('[)]');
                                if (regExLeft.test(str) && !regExRight.test(str)) {
                                    str += ')';
                                }

                                return str;
                            },
                            title: "配件资料",  //模态框标题
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        field: "item_code",
                                        headerName: "类型编码"
                                    }, {
                                        field: "item_name",
                                        headerName: "类型名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;
                            args.api.refreshView();  //刷新网格视图
                        });
                };

                /**
                 * 查询配件资料 粘贴数据到单元格
                 * @param code 粘入的编码
                 * @param args 本行数据
                 * @returns {*}
                 */
                $scope.getItem = function (code, args) {
                    var postData = {
                        classId: "css_item",
                        action: 'search',
                        data: {sqlwhere: "item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (result) {
                            if (result.css_items.length > 0) {
                                return result.css_items[0];
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                };
                //机构名称
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {

                        $scope.data.currItem.org_id = result.orgid;
                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_name = result.orgname;
                    }
                };
                //受理机构名称
                $scope.commonSearchOfOutScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.out_org_id = result.orgid;
                        $scope.data.currItem.out_org_code = result.orgcode;
                        $scope.data.currItem.out_org_name = result.orgname;
                    }
                };
                //仓库名称
                $scope.commonSearchOfWarehouse = {
                    sqlWhere: function () {
                        return ' orgid = ' + $scope.data.currItem.org_id;
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.in_warehouse_id = result.warehouse_id;
                        $scope.data.currItem.in_warehouse_code = result.warehouse_code;
                        $scope.data.currItem.in_warehouse_name = result.warehouse_name;

                        $scope.data.currItem.out_warehouse_id = result.warehouse_id;
                        $scope.data.currItem.out_warehouse_code = result.warehouse_code;
                        $scope.data.currItem.out_warehouse_name = result.warehouse_name;
                    }
                };

                /*---------------------------通配查询End---------------------------------*/

                /***************data init  ********** */
                /**
                 * 新增时init数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);

                    //初始化机构(区域)
                    bizData.org_id = userbean.loginuserifnos[0].org_id;
                    bizData.org_name = userbean.loginuserifnos[0].org_name;

                    bizData.stat = 1;
                    bizData.css_item_apply_lineofcss_item_apply_headers = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.css_item_apply_lineofcss_item_apply_headers);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.css_item_apply_lineofcss_item_apply_headers);
                    $scope.calTotal();
                };

                /**
                 *  保持前数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.check_qty = $scope.data.currItem.apply_qty;
                };

                /***************************************明细表********************* */
                /**
                 * 计算
                 * @param args 本行行对象
                 */
                $scope.calAmount = function (args) {
                    if (args && (!args.data.qty || !args.data.normal_price)) {
                        //计算申请总金额、申请总数量
                        args.data.amount = 0;
                        $scope.calTotal();
                        return;
                    }

                    //计算单行金额
                    args.data.amount = numberApi.mutiply(args.data.qty, args.data.normal_price);

                    $scope.calTotal();
                };
                //计算总金额、总数量
                $scope.calTotal = function () {
                    $scope.data.currItem.total_qty =
                        numberApi.sum($scope.data.currItem.css_item_apply_lineofcss_item_apply_headers, 'qty');
                    $scope.data.currItem.total_amount =
                        numberApi.sum($scope.data.currItem.css_item_apply_lineofcss_item_apply_headers, 'amount');
                };

                /**
                 * 明细行校验：校验配件是否重复
                 * @param invalidBox
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);

                    //明细数据
                    var lineData = $scope.data.currItem.css_item_apply_lineofcss_item_apply_headers;

                    var validArr = [];

                    lineData.forEach(function (line, index) {
                        validArr[index] = line.item_id;
                    });

                    var len = validArr.length;

                    var tip = false;

                    for (var pointer = 0; pointer < len; pointer++) {
                        var curCompare = validArr[pointer];
                        for (var innerPointer = pointer + 1; innerPointer < len; innerPointer++) {
                            var cur = validArr[innerPointer];
                            if (curCompare == cur) {
                                tip = true;
                                invalidBox.push('第' + (pointer + 1) + '行数据与' + '第' + (innerPointer + 1) + '行配件重复');
                            }
                        }
                    }

                    if (tip)
                        invalidBox.push('明细数据配件不允许重复，请删除重复数据');
                };

                /**
                 * 增加行
                 */
                    //增加行
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    var line = {};

                    $scope.data.currItem.css_item_apply_lineofcss_item_apply_headers.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_item_apply_lineofcss_item_apply_headers);
                };

                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.css_item_apply_lineofcss_item_apply_headers.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_item_apply_lineofcss_item_apply_headers);
                    }
                };


                /*******************************明细End */
            }

        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    });