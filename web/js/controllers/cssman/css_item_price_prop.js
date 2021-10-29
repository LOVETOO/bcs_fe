/**
 * 配件价格
 * 2019/7/20.     
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'fileApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi, fileApi, $modal) {


        var CssServiceHeaderProp = [
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
                
				function editable(args) {
                    if ($scope.data.currItem.stat == 1)
                        return true;
                    return false;
                }

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'item_code',
                            headerName: '配件编码',
                            editable: function (args) {
                                return editable(args)
                            },
                            onCellDoubleClicked: function (args) {
                                $scope.chooseItemCode(args);
                            },
                            onCellValueChanged: function (args) {

                                if (args.newValue === args.oldValue)
                                    return;
                            }
                        }
                        , {
                            field: 'item_name',
                            headerName: '配件名称'
                        }
                        , {
                            field: 'start_date',
                            headerName: '开始时间',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "日期"
                        }
                        , {
                            field: 'end_date',
                            headerName: '结束时间',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "日期"
                        }
                        , {
                            field: 'sale_price',
                            headerName: '零售价',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "金额"
                        }, {
                            field: 'sett_price',
                            headerName: '结算价',
                            editable: function (args) {
                                return editable(args);
                            },
                            type: "金额"
                        }
                        ,{
                            field: 'usabled',
                            headerName: '有效状态',
                            editable: true,
                            hcDictCode: 'usable_code'
                            
                        }
                        , {
                            field: 'note',
                            headerName: '备注',
                            editable: true,
                            width: 150
                        
                        }
                    ]
                    };
                
                /**
                 * 新增时init数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.stat = 1;
                    bizData.start_date = dateApi.today();
                    bizData.end_date = "9999-12-31";
                    bizData.usabled = 2;
                    bizData.css_item_priceofcss_item_price_lines = [];
                    $scope.gridOptions.hcApi.setRowData(bizData.css_item_priceofcss_item_price_lines);
                };

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.css_item_priceofcss_item_price_lines);
                };
                //数据校验
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    checkData(invalidBox);
                };

                function checkData(reason) {
                    $scope.gridOptions.api.stopEditing();
                    if ($scope.data.currItem.css_item_priceofcss_item_price_lines.length == 0) {
                        reason.push('请添加明细！');
                    }
                    var lineData = $scope.data.currItem.css_item_priceofcss_item_price_lines;

                    lineData.forEach(function (line, index) {
                        var row = index + 1;

                        if (!line.item_code)
                            reason.push('第' + row + '行配件编码不能为空');

                        if (!line.item_name)
                            reason.push('第' + row + '行配件名称不能为空');
                        if (!line.sale_price)
                            reason.push('第' + row + '行零售价不能为空');
                        if (!line.sett_price)
                            reason.push('第' + row + '行结算价不能为空');
                        

                    });
                }
                /**
                 * 增加行
                 */
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

                        var data = $scope.data.currItem.css_item_priceofcss_item_price_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {
                                item_name: $scope.data.currItem.item_name,
                                item_code: $scope.data.currItem. item_code,
                                
                                start_date: $scope.data.currItem.start_date,
                                end_date: $scope.data.currItem.end_date,
                                usabled:$scope.data.currItem.usabled
                            };
                            data.push(newLine);
                        }

                        $scope.gridOptions.hcApi.setRowData(data);
                        $scope.gridOptions.hcApi.setFocusedCell(data.length - rowCount, 'item_code');
                    });
                };


                /**
                 * 删除行
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.css_item_priceofcss_item_price_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.css_item_priceofcss_item_price_lines);
                    }
                };


                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.add_line && $scope.add_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };
//
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.del_line && $scope.del_line();
                    },
                    hide: function () {
                        return $scope.data.currItem.stat > 1;
                    }
                };

/**---------------------------------  通配查询 start-------------------------------- */

                $scope.chooseItemCode = function (args) {
                    $modal.openCommonSearch({
                        classId: 'css_item'
                    })
                        .result//响应数据
                        .then(function (result) {

                            args.data.item_id = result.item_id;
                            args.data.item_code = result.item_code;
                            args.data.item_name = result.item_name;

                            args.api.refreshView();

                        });
                };
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_id = result.orgid
                        $scope.data.currItem.org_name = result.orgname;
                    }
                };

				
            }

]
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: CssServiceHeaderProp
    });
});