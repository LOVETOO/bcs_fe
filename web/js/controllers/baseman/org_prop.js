/**
 * 机构属性
 * @since 2019-01-02
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'numberApi', 'requestApi', 'constant'], defineFn);
})(function (module, controllerApi, base_obj_prop, numberApi, requestApi, constant) {
    'use strict';

    OrgProp.$inject = ['$scope', '$stateParams', '$modal'];

    function OrgProp($scope, $stateParams, $modal) {
        var hasRight = userbean.hasRole('OrgManagers', true);

        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });

        /**
         * @override
         */
        $scope.isFormReadonly = function () {
            return !hasRight || $scope.hcSuper.isFormReadonly();
        }

        angular.extend($scope.tabs, {
            user: {
                title: '包含用户',
                hide: function () {
                    return $scope.data.isInsert;
                }
            }
        });

        /**
         * 通用查询
         */
        $scope.commonSearch = {
            /** 负责人 */
            manager: {
                afterOk: function (user) {
                    $scope.data.currItem.manager = user.userid;
                }
            },
            /** 运营单元 */
            ent: {
                afterOk: function (ent) {
                    $scope.data.currItem.entid = ent.entid;
                    $scope.data.currItem.entname = ent.entname;
                }
            }
        };

        /**
         * 新增业务数据时
         * @override
         * @since 2019-01-03
         */
        $scope.newBizData = function (bizData) {
            var superId = numberApi.toNumber($stateParams.superId),
                wsId = numberApi.toNumber($stateParams.wsId);

            if (superId === 0 && wsId === 0) {
                console.error('无法新增用户：缺少必要路由参数 superId 或 wsId');

                $scope.footerRightButtons.save.hide = true;

                $scope.isFormReadonly = function () {
                    return true;
                };

                return;
            }

            $scope.hcSuper.newBizData(bizData);

            bizData.orgattribute = 1; 	//部门属性 默认 1；
            if (superId) {
                bizData.superid = superId;
                bizData.parentid = superId;
                bizData.parenttype = constant.objType.org;
            }
            else {
                bizData.superid = 0;
                bizData.parentid = wsId;
                bizData.parenttype = constant.objType.workSpace;
            }

            bizData.stat = 2; //状态为可用

            if (superId) {
                requestApi
                    .post({
                        classId: 'scporg',
                        action: 'select',
                        data: {
                            orgid: superId
                        }
                    })
                    .then(function (superOrg) {
                        bizData.entid = superOrg.entid ? superOrg.entid : userbean.loginEnt.entid;
                        bizData.entname = superOrg.entname ? superOrg.entname : userbean.loginEnt.entname;
                        bizData.orgtype = numberApi.sum(superOrg.orgtype, 1);
                    });
            }
            else {
                bizData.entid = userbean.loginEnt.entid;
                bizData.entname = userbean.loginEnt.entname;
                bizData.orgtype = 1;
            }
        };

        /**
         * 设置业务数据时
         * @override
         * @since 2019-01-18
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);

            $scope.userGridOptions.hcApi.setRowData(bizData.useroforgs);
        };

        /**
         * 用户表格
         */
        $scope.userGridOptions = {
            hcName: '用户',
            columnDefs: [{
                type: '序号'
            }, {
                field: 'userid',
                headerName: '账号',
                width: 100
            }, {
                field: 'username',
                headerName: '名称',
                width: 100
            }]
        };

        angular.extend($scope.footerLeftButtons, {
            addUser: {
                icon: 'fa fa-plus',
                hide: function () {
                    return !$scope.tabs.user.active;
                },
                click: function () {
                    $modal
                        .openCommonSearch({
                            classId: 'scpuser',
                            checkbox: true
                        })
                        .result
                        .then(function (users) {
                            var userIdMapUser = {};

                            $scope.userGridOptions.api.forEachNode(function (node) {
                                userIdMapUser[node.data.userid] = node.data;
                            });

                            users = users.filter(function (user) {
                                return !userIdMapUser[user.userid];
                            });

                            if (users.length) {
                                $scope.userGridOptions.api.updateRowData({
                                    add: users
                                });
                                $scope.data.currItem.useroforgs = $scope.userGridOptions.hcApi.getRowData();
                            }
                        });
                }
            },
            deleteUser: {
                icon: 'fa fa-minus',
                hide: function () {
                    return !$scope.tabs.user.active;
                },
                click: function () {
                    $scope.userGridOptions.hcApi.removeSelections();
                    $scope.data.currItem.useroforgs = $scope.userGridOptions.hcApi.getRowData();
                }
            },
        });
    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: OrgProp
    });
});