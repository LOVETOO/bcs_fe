/**
 * 在线用户 - 对象列表页
 * 2018-12-12 add by qch
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'loopApi', '$q', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_list, loopApi, $q, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*--------------------数据定义------------------------*/
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'username',
                            headerName: '登录用户'
                        }
                        , {
                            field: 'logintime',
                            headerName: '登录时间'
                        }
                        , {
                            field: 'escape_idle',
                            headerName: '在线/空闲(分)'
                        }
                        , {
                            field: 'clientip',
                            headerName: '标识'
                        }
                        , {
                            field: 'namepath',
                            headerName: '所在机构'
                        }
                    ],
                    hcDataRelationName: 'scponlineusers',//自定义返回数据所在数组
                    hcClassId: 'basesysconf',//自定义请求classid/默认路由配置里设置
                    hcRequestAction: 'getloginuser',//自定义请求action/默认search
                    hcAfterRequest: function (response) {
                        response.scponlineusers.forEach(function (rowData, index) {
                            rowData.escape_idle = rowData.idletime + '/' + rowData.escapetime;
                        });
                    },
                    //扩展右键菜单
                    getContextMenuItems: function (params) {
                        var menuItems = $scope.gridOptions.hcDefaultOptions.getContextMenuItems(params);
                        menuItems.push({
                            icon: '<i class="fa fa-info-circle"></i>',
                            name: '禁止访问',
                            action: $scope.kickOut
                        });
                        return menuItems;
                    }
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                /*-------------------顶部右边按钮------------------------*/
                //$scope.toolButtons = {
                //    refresh: {
                //        title: '刷新',
                //        icon: 'fa fa-refresh',
                //        click: function () {
                //            $scope.refresh && $scope.refresh();
                //        }
                //    },
                //    ban: {
                //        title: '禁止访问',
                //        icon: 'fa fa-ban',
                //        click: function () {
                //            $scope.ban && $scope.ban();
                //        }
                //    }
                //};

                $scope.toolButtons.add.hide = true;
                $scope.toolButtons.delete.hide = true;
                $scope.toolButtons.openProp.hide = true;
                $scope.toolButtons.search.hide = true;

                /**
                 * 禁止访问
                 */
                $scope.kickOut = function () {
                    var node = $scope.gridOptions.hcApi.getFocusedNode();

                    if (!node)
                        return swalApi.info('请选中要禁止访问的用户');
                    if (node.data.loginguid == strLoginGuid)
                        return swalApi.info('不能对自身账户进行禁止访问操作');

                    //明细
                    requestApi.post('loginuser', 'kickout', {'loginguid': node.data.loginguid})
                        .then(function (response) {
                            console.log('response', response);
                            return swalApi.success('禁用成功!');
                            $scope.refresh();
                        })
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