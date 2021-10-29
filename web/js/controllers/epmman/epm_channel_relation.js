/**
 * 产品渠道设置--自定义页面
 * Created by shenguocheng
 * Date:2019-08-02
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'directive/hcModal'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                $scope.data = {
                    currItem: {
                        epm_channel_relations: []//定义后台关联数组
                    }
                };
                //定义表格
                $scope.gridOptions = {
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        headerName: "销售渠道",
                        field: "sales_channel",
                        hcDictCode: 'sales.channel'
                    }, {
                        headerName: "产品渠道",
                        field: "item_channel",
                        hcDictCode: 'item.channel'
                    }],
                    hcRequestAction: 'search', //打开页面前的请求方法
                    hcDataRelationName: 'epm_channel_relations',
                    hcClassId: 'epm_channel_relation'
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 取消选择销售渠道事件
                 */
                $scope.deleteSalesChannel = function () {
                    $scope.data.currItem.sales_channel = undefined;
                    $scope.search();
                };
                /**
                 * 取消选择产品产品线事件
                 */
                $scope.deleteItemChannel = function () {
                    $scope.data.currItem.item_channel = undefined;
                    $scope.search();
                };

                /**
                 * 新增及方法定义
                 */
                $scope.toolButtons.add = {
                    title: '新增',
                    icon: 'iconfont hc-add',
                    click: function () {
                        return $scope.channel.open({
                            controller: ['$scope', function ($modalScope) {
                                $modalScope.data = {
                                    currItem: {}
                                };
                                /**
                                 * 模态框按钮定义
                                 */
                                $modalScope.title = '新增';
                                $modalScope.footerRightButtons.save = {
                                    title: '确定',
                                    click: function () {
                                        if (!$modalScope.data.currItem.sales_channel
                                            && !$modalScope.data.currItem.item_channel) {
                                            return swalApi.info("销售渠道和产品渠道不能为空！");
                                        } else if (!$modalScope.data.currItem.sales_channel) {
                                            return swalApi.info("销售渠道不能为空！");
                                        } else if (!$modalScope.data.currItem.item_channel) {
                                            return swalApi.info("产品渠道不能为空！");
                                        }
                                        //取表格数据
                                        var gridDatas = $scope.gridOptions.hcApi.getRowData();
                                        if (gridDatas.length > 0) { //“销售渠道”+“产品渠道”的唯一性校验
                                            for (var i = 0; i < gridDatas.length; i++) {
                                                if (gridDatas[i].sales_channel == $modalScope.data.currItem.sales_channel
                                                    && gridDatas[i].item_channel == $modalScope.data.currItem.item_channel) {
                                                    return swalApi.info('第【' + (i + 1) + '】行:该组合形式已存在，请检查');
                                                }
                                            }
                                        }
                                        return requestApi.post({
                                            classId: 'epm_channel_relation',
                                            action: 'insert',
                                            data: {
                                                sales_channel: $modalScope.data.currItem.sales_channel,
                                                item_channel: $modalScope.data.currItem.item_channel
                                            }
                                        }).then(function () {
                                            swalApi.info("新增成功");
                                        }).then($modalScope.$close).then($scope.search);
                                    }
                                }
                            }],
                            width: '500px',
                            height: '250px'
                        })
                    }
                };

                /**
                 *  删除按钮及方法定义
                 */
                $scope.toolButtons.delete = {
                    title: '删除',
                    icon: 'iconfont hc-delete',
                    click: function () {
                        var dicts = [];//定义存储词汇值的数组
                        //向后台发送请求获取销售渠道词汇值，因为两个词汇值相同，所以只需存储其中一个
                        return requestApi.post("scpdict", "select", {dictid: 13906}).then(function (response) {
                            response.dict_items.forEach(function (obj) {
                                dicts.push(obj.dictname);
                            });
                        }).then(function () {
                            //获取选中的数据
                            var data = $scope.gridOptions.hcApi.getFocusedData();
                            if (!data) {
                                swalApi.info('请选中要删除的行');
                                return;
                            }
                            var action = 'delete';
                            var postdata = {
                                sales_channel: data.sales_channel,
                                item_channel: data.item_channel
                            };
                            swalApi.confirmThenSuccess({
                                title: "确定删除【" + dicts[data.sales_channel - 1] + "+" //根据词汇编码取词汇值
                                    + dicts[data.item_channel - 1] + "】组合记录吗？",
                                okFun: function () {
                                    //调用后台删除方法
                                    return requestApi.post("epm_channel_relation", action, postdata)
                                        .then($scope.gridOptions.hcApi.search);
                                },
                                okTitle: '删除成功'
                            });
                        });
                    }
                };

                /**
                 * 查询方法定义
                 */
                $scope.search = function () {
                    var action = 'search';
                    var postdata = {};
                    //查询条件判断
                    if ($scope.data.currItem.item_channel || $scope.data.currItem.sales_channel) {
                        postdata.sqlwhere = '';
                        if ($scope.data.currItem.sales_channel) {
                            postdata.sqlwhere += 'sales_channel = ' + $scope.data.currItem.sales_channel;
                            if ($scope.data.currItem.item_channel) {
                                postdata.sqlwhere += ' and item_channel = ' + $scope.data.currItem.item_channel;
                            }
                        } else {
                            postdata.sqlwhere += 'item_channel = ' + $scope.data.currItem.item_channel;
                        }
                    }
                    // 调用后台查询方法
                    return requestApi.post("epm_channel_relation", action, postdata)
                        .then(function (response) {
                            $scope.gridOptions.hcApi.setRowData(response.epm_channel_relations);
                        });
                };

                /**
                 * 查询按钮定义
                 */
                $scope.toolButtons.search = {
                    title: '查询',
                    icon: 'iconfont hc-search',
                    click: function () {
                        $scope.search();
                    }
                };

            }];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
);