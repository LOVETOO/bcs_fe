/**
 * 最大库存量维护-编辑列表页
 * author:shenguocheng
 * since 2019-08-05
 */
define(
    ['module', 'controllerApi', 'base_edit_list', 'numberApi', 'swalApi'],
    function (module, controllerApi, base_edit_list, numberApi, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'division_id',
                            headerName: '事业部',
                            hcDictCode: 'epm.division'
                        }, {
                            field: 'set_type',
                            headerName: '类型',
                            hcDictCode: 'epm.max_stock_set_type'
                        }, {
                            field: 'entorgid',
                            headerName: '产品线',
                            hcDictCode: 'entorgid'
                        }, {
                            field: 'item_code',
                            headerName: '产品编号'
                        }, {
                            field: 'item_name',
                            headerName: '产品名称'
                        }, {
                            field: 'max_stock',
                            headerName: '最大库存量',
                            type: '数量'
                        }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_edit_list.controller,
                    scope: $scope
                });

                /**
                 * 产品信息查询
                 */
                $scope.commonSearchOfItemCode = {
                    afterOk: function (result) {
                        $scope.data.currItem.item_id = result.item_id;
                        $scope.data.currItem.item_code = result.item_code;
                        $scope.data.currItem.item_name = result.item_name;
                    }
                };

                /**
                 * 校验最大库存量是否填写数字
                 */
                $scope.checkMaxInventory = function () {
                    if (numberApi.toNumber($scope.data.currItem.max_stock, 0) <= 0) {
                        swalApi.info('请输入大于0的数字');
                        $scope.data.currItem.max_stock = undefined;
                        return;
                    }
                };

                /**
                 * 类型改变事件
                 */
                $scope.changeItemType = function () {
                    if ($scope.data.currItem.set_type == 1) { // 类型:1-产品线,清空产品信息
                        $scope.data.currItem.item_id = undefined;
                        $scope.data.currItem.item_code = undefined;
                        $scope.data.currItem.item_name = undefined;
                    } else { // 其他情况清空产品线
                        $scope.data.currItem.entorgid = undefined;
                    }
                };

                //保存验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);
                    if (numberApi.toNumber($scope.data.currItem.max_stock, 0) <= 0) {
                        invalidBox.push('最大库存量必须为大于0的数字');
                    }
                    return invalidBox;
                };

                /**
                 * 重写方法，对保存后数据刷新
                 * @param responseData 响应的数据
                 */
                $scope.doAfterSave = function (responseData) {
                    $scope.gridOptions.hcApi.search();
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
