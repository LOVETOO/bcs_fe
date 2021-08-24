/**
 * htp
 * 2020-08-06
 * 条码作废属性页
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'swalApi'],
    function (module, controllerApi, base_obj_prop, requestApi, swalApi) {

        var bcs_invalid_prop = [
            '$scope',
            function ($scope) {
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope,

                });
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        },
                        {
                            headerName: '条码',
                            field: "barcode",
                            editable: true
                        },
                        {
                            headerName: '说明',
                            field: "remark",
                            editable: true
                        }
                    ]
                };

                //打开新增页面时执行的方法,可以用于初始化值
                $scope.newBizData = function (bizData) {
                    //数据初始化
                    // $scope.data.currItem.enabled = 'Y';
                    $scope.data.currItem.vendor_code = "";
                    $scope.data.currItem.detp_name = "";
                    $scope.data.currItem.bcs_barcode_invalid_lines = [];
                    $scope.data.currItem.bcs_barcode_invalid_lines.push({});
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_barcode_invalid_lines);
                    $scope.hcSuper.newBizData(bizData);
                };

                //设置数据
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.bcs_barcode_invalid_lines);
                };
                //保存数据
                $scope.saveBizData = function (bizData) {

                    $scope.hcSuper.saveBizData(bizData);

                };
                //验证表头和明细行
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if ($scope.data.currItem.vendor_code == '' && $scope.data.currItem.detp_name == '') {
                        invalidBox.push('供应商编码和使用部门不能同时为空，请先填写完再继续操作！');
                        return invalidBox;
                    }
                    if ($scope.data.currItem.bcs_barcode_invalid_lines.length < 1) {
                        invalidBox.push('请添加明细！');
                        return invalidBox;
                    } else {
                        $scope.data.currItem.bcs_barcode_invalid_lines.forEach((item) => {
                            if (item.barcode == "" || item.barcode == undefined) {
                                invalidBox.push('请输入条码！');
                                return invalidBox;
                            }
                        })
                    }

                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/

                $scope.footerLeftButtons.addRow.click = function () {
                    $scope.add_line && $scope.add_line();
                };
                $scope.footerLeftButtons.addRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();

                };
                $scope.footerLeftButtons.deleteRow.hide = function () {
                    return $scope.data.currItem.stat > 1;
                };

                /*----------------------------------按钮方法 定义-------------------------------------------*/


                //添加明细
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

                        var data = $scope.data.currItem.bcs_barcode_invalid_lines;

                        for (var i = 0; i < rowCount; i++) {
                            var newLine = {};
                            data.push(newLine);
                        }
                        $scope.gridOptions.hcApi.setRowData(data);
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
                        $scope.data.currItem.bcs_barcode_invalid_lines.splice(idx, 1);
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.bcs_barcode_invalid_lines);
                    }
                };


            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: bcs_invalid_prop
        });
    });