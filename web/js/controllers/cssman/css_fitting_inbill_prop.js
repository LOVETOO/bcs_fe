/**
 * Created by zhl on 2019/7/22.
 *  css_fitting_inbill_prop 配件采购入库-属性
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'numberApi', 'requestApi', 'loopApi'],
    function (module, controllerApi, base_obj_prop, swalApi, numberApi, requestApi, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal', '$q',
            //控制器函数
            function ($scope, $modal, $q) {

                //继承基础控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*---------------------网格定义--------------------------*/
                $scope.gridOptions = {
                    columnDefs: [{
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
                                    args.data.item_id = line.css_item_id;
                                    args.data.item_code = line.css_item_code;
                                    args.data.item_name = line.css_item_name;
                                    args.api.refreshView();
                                });
                        }
                    }, {
                        field: 'item_name',
                        headerName: '配件名称'
                    }, {
                        field: 'inv_loc',
                        headerName: '库位',
                        editable: true
                    }, {
                        field: 'in_qty',
                        headerName: '数量',
                        type: '数量',
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue)
                                return;

                            $scope.calAmount(args);
                        }
                    }, {
                        field: 'price',
                        headerName: '价格',
                        type: '金额',
                        editable: true,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue)
                                return;

                            $scope.calAmount(args);
                        }
                    }, {
                        field: 'amount',
                        headerName: '金额',
                        type: '金额'
                    }, {
                        field: 'canused_qty',
                        headerName: '可用库存',
                        type: '数量'
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: true
                    }]
                };

                /*---------------------数据定义--------------------------*/

                //获取绑定数据
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                //加载属性页时初始化,设置数据
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);

                    //设置表格数据
                    var lines = bizData.css_purchase_lines;
                    loopApi.forLoop(lines.length, function (i) {
                        lines[i].amount
                            = numberApi.mutiply(lines[i].in_qty, lines[i].price);
                    });
                    $scope.gridOptions.hcApi.setRowData(bizData.css_purchase_lines);

                    $scope.calTotal();
                };

                //新增业务数据
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    //初始化机构
                    bizData.org_id = userbean.loginuserifnos[0].org_id;
                    bizData.org_name = userbean.loginuserifnos[0].org_name;

                    bizData.create_time = new Date().Format('yyyy-MM-dd hh:mm:ss');//制单时间
                    bizData.creator = strUserId; //制单人
                    bizData.stat = 1;//制单状态

                    bizData.css_purchase_lines = [];
                };

                /*---------------------通用查询--------------------------*/

                //查询机构
                $scope.commonSearchSettingOfScporg = {
                    afterOk: function (result) {
                        //更改所属机构后清空入库仓库相关字段
                        if (getCurrItem().org_id != result.orgid) {
                            getCurrItem().in_warehouse_id = 0;
                            getCurrItem().in_warehouse_code = '';
                            getCurrItem().in_warehouse_name = '';
                        }
                        getCurrItem().org_id = result.orgid;
                        getCurrItem().org_code = result.orgcode;
                        getCurrItem().org_name = result.orgname;

                    }
                };

                //查询入库仓库
                $scope.commonSearchSettingOfWarehouse = {
                    postData: {
                        search_flag: 17
                    },
                    sqlWhere: function () {
                        return ' orgid = ' + getCurrItem().org_id;
                    },
                    afterOk: function (result) {
                        getCurrItem().in_warehouse_id = result.warehouse_id;
                        getCurrItem().in_warehouse_code = result.warehouse_code;
                        getCurrItem().in_warehouse_name = result.warehouse_name;
                    }
                };

                /*---------------------事件定义--------------------------*/

                /**
                 * 查询配件资料 双击单元格
                 * @param args 本行数据
                 */
                $scope.getItemDoubleClicked = function (args) {
                    $modal.openCommonSearch({  //打开模态框
                            classId: 'css_item',  //类id
                            postData: {},  //请求的携带数据
                            title: "配件资料",  //模态框标题
                            sqlWhere:function(){
                                var str = '1=1';
                                if($scope.data.currItem.css_purchase_lines.length > 0){
                                    var lineData = angular.copy($scope.data.currItem.css_purchase_lines);

                                    lineData.forEach(function(cur,index){
                                        if( cur.item_id){
                                            if(str == '1=1'){
                                                str+=' and css_item_id not in ( ' + cur.item_id ;
                                            }else if(index != lineData.length - 1){
                                                str += ',' + cur.item_id ;
                                            }else if(index == lineData.length - 1){
                                                str += ',' + cur.item_id + ')';
                                            }
                                        }
                                    });
                                }

                                //补充括号
                                var regExLeft = new RegExp('[(]');
                                var regExRight = new RegExp('[)]');
                                if(regExLeft.test(str) && !regExRight.test(str)){
                                    str += ')';
                                }

                                return str;
                            },
                            gridOptions: {  //表格定义
                                columnDefs: [
                                    {
                                        field: "css_item_code",
                                        headerName: "类型编码"
                                    }, {
                                        field: "css_item_name",
                                        headerName: "类型名称"
                                    }
                                ]
                            }
                        })
                        .result  //响应数据
                        .then(function (result) {
                            args.data.item_id = result.css_item_id;
                            args.data.item_code = result.css_item_code;
                            args.data.item_name = result.css_item_name;
                            args.api.refreshView();  //刷新网格视图

                            $scope.getUsableInventory(result.css_item_id, args);
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
                        data: {sqlwhere: "css_item_code = '" + code + "'"}
                    };
                    return requestApi.post(postData)
                        .then(function (result) {
                            if (result.css_items.length > 0) {
                                $scope.getUsableInventory(result.css_items[0].css_item_id, args);
                                return result.css_items[0];
                            } else {
                                return $q.reject("产品编码【" + code + "】不可用");
                            }
                        });
                };

                /**
                 * 获取配件的可用库存(待完善，目前可用库存暂时不可准确获取！2019-08-02)
                 * @param itemId 配件id
                 * @param args 本行行对象
                 */
                $scope.getUsableInventory = function (itemId, args) {
                    var postData = {
                        classId: "css_inventory",
                        action: 'search',
                        data: {sqlwhere: "item_id = '" + itemId + "'"}
                    };

                    requestApi.post(postData)
                        .then(function (data) {
                            if (data.css_inventorys.length == 0)
                                args.data.canused_qty = 0;
                            else
                                args.data.canused_qty = data.css_inventorys.canused_qty;
                        });
                };

                /**
                 * 计算金额与总金额
                 * @param args 本行行对象
                 */
                $scope.calAmount = function (args) {
                    if (args && (!args.data.in_qty || !args.data.price)) {
                        args.data.amount = 0;
                        return;
                    }

                    args.data.amount = numberApi.mutiply(args.data.in_qty, args.data.price);

                    $scope.calTotal();
                };
                //计算总金额、总数量
                $scope.calTotal = function () {
                    getCurrItem().total_qty =
                        numberApi.sum(getCurrItem().css_purchase_lines, 'in_qty');
                    getCurrItem().total_amount =
                        numberApi.sum(getCurrItem().css_purchase_lines, 'amount');
                };

                /*---------------------按钮定义--------------------------*/
                //验证表头信息是否填完
                $scope.validHead = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                //底部左边按钮
                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return getCurrItem().stat > 1;
                };

                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                    $scope.calTotal();
                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return getCurrItem().stat > 1;
                };

                //增加行
                $scope.add_line = function () {
                    $scope.gridOptions.api.stopEditing();
                    var line = {};

                    $scope.data.currItem.css_purchase_lines.push(line);
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_purchase_lines);
                };

                //删除行
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        getCurrItem().css_purchase_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData(getCurrItem().css_purchase_lines);
                    }
                };

                /**
                 * 明细行校验：校验配件是否重复
                 * @param invalidBox
                 */
                $scope.validCheck = function (invalidBox) {
                    $scope.gridOptions.api.stopEditing();
                    $scope.hcSuper.validCheck(invalidBox);

                    //明细数据
                    var lineData = $scope.data.currItem.css_purchase_lines;

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

                $scope.tabs.other = {
                    title: "其他"
                }

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.registerController({
            module: module,
            controller: controller
        });
    }
);
