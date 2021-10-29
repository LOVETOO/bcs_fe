/**
 * 费用期间-属性页
 * 2018-10-27
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$q',
            //控制器函数
            function ($scope, $q) {
                /*-------------------数据定义开始------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};

                /**绘制表格 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'dname',
                        headerName: '期间名称'
                        // hcDictCode:'dname'
                    }, {
                        field: 'start_date',
                        headerName: '开始日期',
                        type: '日期'
                    }, {
                        field: 'end_date',
                        headerName: '结束日期',
                        type: '日期'
                    }, {
                        field: 'description',
                        headerName: '描述'
                    }],
                    defaultColDef: {
                        editable: true
                    }
                };

                /*-------------------数据定义结束------------------------*/
                /*-------------------通用查询开始------------------------*/

                /*-------------------通用查询结束---------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '预算期间';

                //把数据扔到到明细表
                $scope.setBizData = function (bizData) {
                    // $scope.aa=JSON.stringify(bizData);
                    // $scope.hcSuper.setBizData(bizData); //继承基础控制器的方法，类似Java的super
                    //设置头部数据的步骤已在基础控制器实现
                    $scope.hcSuper.setBizData(bizData);
                    //设置明细数据到表格
                    // $scope.明细表格选项1.hcApi.setRowData(bizData.明细数组1);
                    // $scope.明细表格选项2.hcApi.setRowData(bizData.明细数组2);
                    $scope.gridOptions.api.setRowData(bizData.fin_bud_period_lineoffin_bud_period_headers);
                };

                //增加一行
                $scope.addLineRow = function () {
                    $scope.stopEditingAllGrid();
                    if (!$scope.data.currItem.period_year) {
                        swalApi.info("请先选择年份");
                        return;
                    }
                    if (!$scope.data.currItem.period_type) {
                        swalApi.info("请先选择预算期间类别");
                        return;
                    }
                    if (!$scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers) {
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers = [];
                    }
                    //在表格数据数组中增加一行 /^Y20\d{2}$/
                    if ($scope.data.currItem.period_type == 1) {
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.push({
                            dname: "Y" + $scope.data.currItem.period_year
                        });
                    }
                    ;
                    if ($scope.data.currItem.period_type == 2) {
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.push({
                            dname: "S" + $scope.data.currItem.period_year
                        });
                    }
                    ;
                    if ($scope.data.currItem.period_type == 3) {
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.push({
                            dname: "M" + $scope.data.currItem.period_year
                        });
                    }
                    ;

                    //  遍历表格数据
                    //将数组重新放入表格
                    $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers);
                }
                // $scope.newBizData = function (bizData) {
                //     bizData.stat = 1; //单据状态：制单
                //     bizData.wfid = 0; //流程ID
                //     bizData.wfflag = 0; //流程标识
                //     bizData.fin_bud_period_lineoffin_bud_period_headers = $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers;
                //     };
                //删除选中的一行
                $scope.deleteLineRow = function () {
                    //获取选中行的索引
                    var index = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (index < 0) {
                        return swalApi.info('请先选中要删除的行').then($q.reject);
                    }

                    var title = '确定要删除第' + (index + 1) + '行数据吗?';
                    return swalApi.confirmThenSuccess({
                        title: title,
                        okFun: function () {
                            $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.splice(index, 1);

                            $scope.gridOptions.api.setRowData($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers);
                        },
                        okTitle: '删除成功'
                    });
                };

                //保存
                $scope.save = function () {
                    $scope.stopEditingAllGrid();
                    if (!$scope.data.currItem.period_year || !$scope.data.currItem.period_type) {
                        return swalApi.error('年度和期间类别不能为空');
                    }
                    ;
                    if (!$scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers) {
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers = [];
                    }
                    // 检查命名
                    if ($scope.data.currItem.period_type == 1) {
                        var flag = false;
                        var reg = new RegExp("Y" + $scope.data.currItem.period_year + "");
                        if (!reg.test($scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[0].dname)) {
                            return swalApi.error('有期间名称格式不正确,请检查是否符合 Y+年份，如“Y2019、Y2020”');
                        }
                    }
                    ;
                    if ($scope.data.currItem.period_type == 2) {
                        var flag = false;
                        var reg = new RegExp("S" + $scope.data.currItem.period_year + "\\d{1}");
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.forEach(function (data) {
                            if (!reg.test(data.dname)) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            return swalApi.error('有期间名称格式不正确,请检查是否符合 S+年份+季度，如“S201901、S201904');
                        }
                    }
                    ;
                    if ($scope.data.currItem.period_type == 3) {
                        var flag = false;
                        var reg = new RegExp("M" + $scope.data.currItem.period_year + "\\d{2}");
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.forEach(function (data) {
                            if (!reg.test(data.dname)) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            return swalApi.error('有期间名称格式不正确,请检查是否符合 M+年份+月度，如“M201901、M201912”');
                        }
                    }
                    ;

                    if (!$scope.data.currItem.period_id) {
                        //新增
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers = $scope.gridOptions.hcApi.getRowData();
                        for (var i = 0; i < $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.length; i++) {
                            $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[i].seq = i + 1;
                            $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[i].usable = 2;
                        }
                        requestApi.post('fin_bud_period_header', 'insert', $scope.data.currItem).then(function (data) {
                            return swalApi.success('保存成功');
                        })
                    } else {
                        //修改
                        $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers = $scope.gridOptions.hcApi.getRowData();
                        for (var i = 0; i < $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers.length; i++) {
                            $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[i].seq = i + 1;
                            $scope.data.currItem.fin_bud_period_lineoffin_bud_period_headers[i].usable = 2;
                        }
                        requestApi.post('fin_bud_period_header', 'update', $scope.data.currItem).then(function (data) {
                            return swalApi.success('保存成功');
                        })
                    }
                }
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