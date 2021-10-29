/**
 * 采购发票匹配
 * 2019-01-08
 * huderong
 */

define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', 'numberApi','$modal'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, numberApi,$modal) {
        'use strict';
        var controller = [
                //声明依赖注入
                '$scope', '$stateParams', '$q',
                //控制器函数
                function ($scope, $stateParams, $q) {
                    /**==============================数据定义========================= */
                    $scope.data = {collectByDept: 2};
                    $scope.data.currItem = {};
                    /**==============================网格定义========================= */
                    $scope.gridOptions = {
                        columnDefs: [
                            {
                                type: '序号'
                            },
                            {
                                field: 'qty_match',
                                headerName: '本次匹配数量',
                                editable: false,
                            },
                            {
                                field: 'amount_matching',
                                headerName: '本次匹配未税金额',
                                editable: false,
                            },
                            {
                                field: 'price_notax_fact',
                                headerName: '发票未税价',
                                editable: false,
                            },
                            {
                                field: 'amount_notax_fact',
                                headerName: '发票未税金额',
                                editable: false,
                            },
                            {
                                field: 'price_fact',
                                headerName: '发票含税价',
                                editable: false,
                            },
                            {
                                field: 'amount_fact',
                                headerName: '发票含税金额',
                                editable: false,
                            },
                            {
                                field: 'tax_amount',
                                headerName: '税额',
                                editable: false,
                            }, {
                                field: 'date_invbill',
                                headerName: '单据日期',
                                editable: false,
                            },
                            {
                                field: '',
                                headerName: '送货单号'
                            },
                            {
                                field: '',
                                headerName: 'ERP单号'
                            },
                            {
                                field: 'invbillno',
                                headerName: '入库单号',
                                editable: false,
                            },
                            {
                                field: '',
                                headerName: '商品',
                                children: [
                                    {
                                        field: 'item_code',
                                        headerName: '编码',
                                        editable: false,
                                    },
                                    {
                                        field: 'item_name',
                                        headerName: '名称',
                                        editable: false,
                                    }
                                ]
                            },
                            {
                                field: 'price_bill',
                                headerName: '含税价',
                                editable: false,
                            },
                            {
                                field: 'amount_bill',
                                headerName: '含税金额',
                                editable: false,
                            },
                            {
                                field: 'price_bill_notax',
                                headerName: '未税价',
                                editable: false,
                            },
                            {
                                field: 'no_tax_f',
                                headerName: '单据未税金额',
                            },
                            {
                                field: 'note',
                                headerName: '备注',
                            },
                            {
                                field: '',
                                headerName: '折扣商品',
                            },
                            {
                                field: 'qty_match_no',
                                headerName: '未匹配数量'
                            }
                        ],
                        hcObjType: $stateParams.objtypeid
                    }

                    /**
                     * 输入值改变计算事件
                     * @param args
                     * @returns {Promise|void|*}
                     */
                    function cellValueChangeEvent(args) {
                        if (!Editable(args)) {
                            return;
                        }
                        if (args.newValue === args.oldValue)
                            return;

                        if (numberApi.isNum(args.newValue) || numberApi.isStrOfNum(args.newValue)) {
                            args.data = HczyCommon.stringPropToNum(args.data);

                            args.api.refreshView();
                        } else {
                            return swalApi.info("请输入有效数字");
                        }
                    }

                    /**继承主控制器 */
                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });


                    /**============================ 明细行逻辑计算=================================**/


                    /**============================ 点击事件=================================**/

                    $scope.add_line = function () {
                        $scope.gridOptions.api.stopEditing();
                        swal({
                            title: '请输入要增加的行数',
                            type: 'input', //类型为输入框
                            inputValue: 1, //输入框默认值
                            closeOnConfirm: false, //点击确认不关闭，由后续代码判断是否关闭
                            showCancelButton: true //显示【取消】按钮
                        }, function (inputValue) {
                            if (inputValue === false) {
                                swal.close();
                                return;
                            }

                            var rowCount = Number(inputValue);
                            if (rowCount <= 0) {
                                swal.showInputError('请输入有效的行数');
                                return;
                            }
                            else if (rowCount > 1000) {
                                swal.showInputError('请勿输入过大的行数(1000以内为宜)');
                                return;
                            }
                            swal.close();

                            var data = $scope.data.currItem.ap_invoice_head_matchingofap_invoice_heads;

                            for (var i = 0; i < rowCount; i++) {
                                var newLine = {
                                    // warehouse_code: $scope.data.currItem.warehouse_code,
                                    // warehouse_id: $scope.data.currItem.warehouse_id,
                                    // warehouse_name: $scope.data.currItem.warehouse_name
                                };
                                data.push(newLine);
                            }
                            $scope.gridOptions.hcApi.setRowData(data);
                            $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                        });
                    }
                    $scope.del_line = function () {
                        var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                        if (index < 0) {
                            return swalApi.info("请选中要删除的行");
                        }
                        return swalApi.confirmThenSuccess({
                            title: "确定要删除第" + (index + 1) + "行吗?",
                            okFun: function () {
                                //函数区域
                                var rowData = $scope.gridOptions.hcApi.getRowData();
                                if (index == (rowData.length - 1)) {
                                    $scope.gridOptions.api.focusedCellController.clearFocusedCell();
                                }
                                rowData.splice(index, 1);
                                $scope.gridOptions.hcApi.setRowData(rowData);
                                $scope.data.currItem.ap_invoice_head_matchingofap_invoice_heads = rowData;
                            },
                            okTitle: '删除成功'
                        });
                    }

                    //底部左边按钮
                    $scope.footerLeftButtons.add_line = {
                        title: '增加行',
                        click: function () {
                            $scope.add_line && $scope.add_line();
                        }
                    };
                    $scope.footerLeftButtons.del_line = {
                        title: '删除行',
                        click: function () {
                            $scope.del_line && $scope.del_line();
                        }
                    };


                    /**============================ 点击事件结束=================================**/

                    /**============================数据处理 ================================**/

                    $scope.setBizData = function (bizData) {
                        // $scope.aa=JSON.stringify(bizData);
                        // $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                        //设置头部数据的步骤已在基础控制器实现
                        $scope.hcSuper.setBizData(bizData);
                        //设置明细数据到表格
                        // $scope.明细表格选项1.hcApi.setRowData(bizData.明细数组1);
                        // $scope.明细表格选项2.hcApi.setRowData(bizData.明细数组2);
                        $scope.gridOptions.api.setRowData(bizData.ap_invoice_head_matchingofap_invoice_heads);
                    };

                    /**
                     * 新建单据时初始化数据
                     * @param bizData
                     */
                    $scope.newBizData = function (bizData) {
                        $scope.hcSuper.newBizData(bizData); //继承基础控制器的方法，类似Java的super
                        angular.extend($scope.data.currItem, {
                            created_by: strUserName,
                            creation_date: dateApi.now(),
                            date_invbill: dateApi.today(),
                            ap_invoice_head_matchingofap_invoice_heads: [],
                            stat: 1,
                            bill_type: 1,
                            bluered: 'B',
                            year_month: new Date(dateApi.today()).Format('yyyy-MM'),
                        });
                        $scope.gridOptions.api.setRowData($scope.data.currItem.ap_invoice_head_matchingofap_invoice_heads);

                    };

                    /**
                     * 检查数据
                     */
                    $scope.validCheck = function (invalidBox) {
                        $scope.hcSuper.validCheck(invalidBox);

                    }

                    /**
                     * 刷新
                     */
                    $scope.refresh = function () {
                        $scope.hcSuper.refresh(); //继承基础控制器的方法，类似Java的super
                    };


                    /**
                     * 判断明细可否编辑
                     * @param args
                     * @constructor
                     */
                    function Editable(args) {
                        var flag = true;
                        if (args.data.seq === "合计") {
                            flag = false;
                        }
                        return flag;
                    }

                    /**============================通用查询 ===================**/

                    /**
                     * 查供应商
                     */
                    $scope.chooseVendor = function (){
                        $modal.openCommonSearch({
                            classId:'vendor_org',
                            sqlWhere: ' usable = 2'
                        })
                            .result//响应数据
                            .then(function(result){
                                $scope.data.currItem.vendor_name = result.vendor_name;
                                $scope.data.currItem.vendor_code = result.vendor_code;
                                $scope.data.currItem.vendor_id = result.vendor_id;

                                //价格类型
                                $scope.data.currItem.price_type = result.attribute41;

                                return $scope.data.currItem;
                            }).then($scope.queryPriceBill)
                    };
                    
                    /**
                     * 人员查询
                     */
                    $scope.chooseUser = function (args){
                        $modal.openCommonSearch({
                            classId:'scpuser'
                        })
                            .result//响应数据
                            .then(function(result){
                                $scope.data.currItem.creator = result.userid;
                                args.api.refreshView();//刷新网格视图
                            });
                    };
                    /*$scope.chooseUser = function () {
                        BasemanService.chooseUser({
                            scope: $scope,
                            realtime: true,
                            then: function (response) {
                                $scope.data.currItem.creator = response.employee_name;
                            }
                        })
                    };*/

                    /**
                     * 查部门
                     */
                    function chooseOrg(args) {
                        if (!args.colDef.editable) {
                            return;
                        }
                        $modal.openCommonSearch({
                            classId:'dept',
                            sqlWhere: " isfeecenter = 2"
                        })
                            .result//响应数据
                            .then(function(result){
                                if (args) {
                                    args.data.dept_id = result.dept_id;
                                    args.data.dept_code = result.dept_code;
                                    args.data.dept_name = result.dept_name;

                                } else {
                                    $scope.data.currItem.org_id = result.dept_id;
                                    $scope.data.currItem.org_code = result.dept_code;
                                    $scope.data.currItem.org_name = result.dept_name;
                                }
                                args.api.refreshView();//刷新网格视图
                            });
                    };
                    /*function chooseOrg(args) {
                        if (!args.colDef.editable) {
                            return;
                        }
                        BasemanService.chooseDept({
                            scope: $scope,
                            realtime: true,
                            sqlWhere: " isfeecenter = 2"
                        }).then(function (response) {
                            if (args) {
                                args.data.dept_id = response.dept_id;
                                args.data.dept_code = response.dept_code;
                                args.data.dept_name = response.dept_name;

                            } else {
                                $scope.data.currItem.org_id = response.dept_id;
                                $scope.data.currItem.org_code = response.dept_code;
                                $scope.data.currItem.org_name = response.dept_name;
                            }
                            args.api.refreshView();
                        })
                    }*/

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
);