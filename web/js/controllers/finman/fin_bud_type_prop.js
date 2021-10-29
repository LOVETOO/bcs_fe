/**
 * 费用项目-属性页
 * 2018-10-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', "$q"],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, $q) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'object_code',
                        headerName: '费用类别或项目编码',
                    }, {
                        field: 'object_name',
                        headerName: '费用类别或项目名称',
                    }, {
                        field: 'object_type',
                        headerName: '所属费用类别',
                        type: '词汇',
                        cellEditorParams: {
                            names: ['费用类别', '费用项目'],
                            values: [1, 2]
                        }
                    }]
                };

                /*-------------------数据定义结束------------------------*/

                /*-------------------通用查询开始------------------------*/
                //费用大类通用查询
                $scope.commonSearchSettingOfFinFeeType = {  
                    sqlWhere: "usable=2 and lev=1 ",
                    afterOk: function (result) {
                        $scope.data.currItem.fee_type_code = result.fee_type_code;
                        $scope.data.currItem.fee_type_name = result.fee_type_name;
                        $scope.data.currItem.fee_type_id = result.fee_type_id;
                        $scope.data.currItem.fee_type_level = result.lev;
                        $scope.data.currItem.idpath = result.idpath;
                    }
                };
                /*-------------------通用查询结束---------------------*/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                //把数据扔到到明细表
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    return invalidBox;
                };

                $scope.setBizData = function (bizData) {
                    //设置头部数据的步骤已在基础控制器实现
                    $scope.hcSuper.setBizData(bizData);
                    //设置明细数据到表格
                    $scope.gridOptions.api.setRowData(bizData.fin_bud_type_lineoffin_bud_type_headers);
                };


                $scope.addLineRow = function () {
                    var msg = $scope.validCheck([]);
                    if (msg.length > 0) {
                        return swalApi.info(msg);
                    } else {
                        $modal.openCommonSearch({
                            classId: 'fin_fee_type_obj',
                            postData: {
                                idpath: $scope.data.currItem.idpath,
                                lev: $scope.data.currItem.fee_type_level,
                                flag: 1,
                                fee_type_id: $scope.data.currItem.fee_type_id,
                                period_type: $scope.data.currItem.period_type
                            },
                            checkbox: true,
                            action: 'search',
                            title: "费用类别或项目查询",
                            gridOptions: {
                                columnDefs: [{
                                    headerName: "费用类别或项目编码",
                                    field: "object_code"
                                }, {
                                    headerName: "费用类别或项目名称",
                                    field: "object_name"
                                }, {
                                    headerName: "备注",
                                    field: "note"
                                }]
                            }
                        })
                            .result//响应数据
                            .then(function (result) {
                                var olddata = $scope.gridOptions.hcApi.getRowData();

                                result.forEach(function (value1, index1) {
                                    olddata.forEach(function (value, index) {
                                        if (value.object_id === value1.object_id) {
                                            result.splice(index1, 1);
                                            return false;
                                        }
                                    });
                                });
                                result.forEach(function (value) {
                                    $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.push(value);
                                });
                                $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers);
                            });
                    }
                };


                //删除选中的一行
                $scope.deleteLineRow = function () {
                    //获取选中行的索引
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info('请先选中要删除的行').then($q.reject);
                    }
                    $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers.splice(index, 1);
                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers);
                };

                // 新增数据定义
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.stat = 1; //单据状态：制单
                    bizData.wfid = 0; //流程ID
                    bizData.wfflag = 0; //流程标识
                    bizData.creator = strUserId; //创建人
                    bizData.usable = 2; //可用
                    bizData.is_control_bud = 2;//受预算控制
                    bizData.control_type = 1;//预算控制方式 默认为时间进度
                    bizData.fin_bud_type_lineoffin_bud_type_headers = [];
                    $scope.gridOptions.api.setRowData(bizData.fin_bud_type_lineoffin_bud_type_headers);

                };

                $scope.onLevelChange = function () {
                    $scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers = [];
                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_type_lineoffin_bud_type_headers);
                }

                //是否控制预算改变事件
                $scope.is_control_budChange = function () {
                    if ($scope.data.currItem.is_control_bud && parseInt($scope.data.currItem.is_control_bud) != 2) {
                        $scope.data.currItem.control_type = 0;
                    } else {
                        $scope.data.currItem.control_type = 1;
                    }
                }
                //底部左边按钮
                $scope.footerLeftButtons.add_line = {
                    title: '增加行',
                    click: function () {
                        $scope.addLineRow && $scope.addLineRow();
                    }
                };
                $scope.footerLeftButtons.del_line = {
                    title: '删除行',
                    click: function () {
                        $scope.deleteLineRow && $scope.deleteLineRow();
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