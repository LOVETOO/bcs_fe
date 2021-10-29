/**
 * 岗位- 树列表页
 * @since 2019-02-14
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_tree_list', 'requestApi', 'openBizObj', 'numberApi', 'swalApi', 'constant','promiseApi'], defineFn)
})(function (module, controllerApi, base_tree_list, requestApi, openBizObj, numberApi, swalApi, constant,promiseApi) {

    /**
     * 控制器
     */
    base_position.$inject = ['$scope', '$stateParams', '$q', '$rootScope',];

    function base_position($scope, $stateParams, $q, $rootScope) {
        /**
         * 表格设置
         */
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'positionid',
                headerName: '名称'
            }, {
                field: 'namepath',
                headerName: '部门路径'
            }, {
                field: 'superposition',
                headerName: '直接上级岗位'
            }/*, {
                field: 'superposition',
                headerName: '负责人/上级'
            }*/],
            hcClassId: 'scpposition',
            hcDataRelationName: 'positions',
            hcSearchWhenReady: false
        };
        $scope.keys = ['positionid', 'superposition'];
        //移除定位按钮
        promiseApi.whenTrue(function(){
            if($('[hc-button="locate()"]').length>0){
                return true
            }
        },100).then(function(){
            console.log($('[hc-button="locate()"]'));
            $('[hc-button="locate()"]').remove();
            
        })
        /**
         * 树设置
         */
        $scope.treeSetting = {
            hcGetRootNodes: function () {
                return {
                    name: '岗位',
                    hcIsRoot: true,
                    id: 0
                };
            },
            hcGetChildNodes: function (node) {
                if (node.name == '岗位') {
                    var wsobj = {
                        "wsid": -16,
                        "wstag": -16,
                        "excluderight": 1,
                        "wsright": "00000000000000000000FFFF000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
                    }
                    return requestApi
                        .post({
                            classId: 'scpworkspace',
                            action: 'selectref',
                            data: wsobj
                        })
                        .then(function (response) {
                            return response.orgs.map(function (org) {
                                console.log(org)
                                return {
                                    name: org.orgname,
                                    data: org
                                };
                            });
                        });
                }else{
                    console.log(node)
                    node.data.flag = 2;
                    return requestApi
                        .post({
                            classId: 'scporg',
                            action: 'selectref',
                            data: node.data
                        })
                        .then(function (response) {
                            node.hcGridData = response.positionoforgs;
                            return response.orgoforgs.map(function (org) {
                                return {
                                    name: org.orgname,
                                    data: org
                                };
                            });
                        })
                }
            },
            hcMenuItems: {
                refresh: {
                    title: '刷新',
                    icon: 'fa fa-refresh',
                    click: function (params) {
                        console.log(params)
                        $scope.treeSetting.hcApi.reload(params.node);
                    }
                },
            }
        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_tree_list.controller,
            scope: $scope
        });
        /**
         * 工具栏按钮
         */
        $scope.toolButtons = {
            addBasePosition: {
                title: '新增岗位',
                icon: 'fa fa-plus',
                click: addBasePosition
            },
            deleteBasePosition: {
                title: '删除岗位',
                icon: 'fa fa-minus',
                click: deleteBasePosition
            }
        };

        /**
         * 新增岗位
         * @returns {Promise}
         */
        function addBasePosition() {
            var data = $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data;
            return openBasePosition(data);
        }

        /**
         * 删除岗位
         * @returns {Promise}
         */
        function deleteBasePosition() {
            var BasePosition = $scope.gridOptions.hcApi.getFocusedData();
            if (!BasePosition) {
                return swalApi.info('请先选中想要删除的岗位').then($q.reject);
            }

            return swalApi.confirmThenSuccess({
                title: '确定要删除岗位【' + BasePosition.positionid + '】',
                okFun: function () {
                    return requestApi
                        .post({
                            classId: 'scpposition',
                            action: 'delete',
                            data: {
                                syspositionid: BasePosition.syspositionid
                            }
                        })
                        .then(function () {
                            $scope.gridOptions.api.updateRowData({
                                remove: [BasePosition]
                            });
                        });
                },
                okTitle: '删除成功'
            });
        }

        /**
         * 打开岗位
         */
        function openBasePosition(data) {
            console.log(data)
            /*if (!$scope.treeSetting.zTreeObj.getSelectedNodes()[0].data) {
                return swalApi.info("请先选中/新建文件夹");
            }*/
            //$scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.orgid;
            return openBizObj({
                stateName: 'baseman.base_position_prop',
                params: {
                    id: numberApi.toNumber(data.syspositionid),
                    title: $stateParams.title || '岗位',
                    //fdrId: $scope.treeSetting.zTreeObj.getSelectedNodes()[0].data.fdrid,
                    orgid: data.orgid,
                }
            }).result.finally($scope.refresh);
        };

        /**
         * 打开属性页
         * @override
         */
        $scope.openProp = function () {
            var data = $scope.gridOptions.hcApi.getFocusedData();
            if (data)
                return openBasePosition(data);
        };

        //$scope.locate = locate;

        /**
         * 定位
         * @param node
         */
        /*function locate(node) {
            console.log(node)
            return $q
                .when()
                .then(function () {
                    if (node) return node;

                    return $scope.gridOptions.hcApi.getFocusedNodeWithNotice({
                        actionName: '定位'
                    });
                })
                .then(function (node) {
                    console.log(node)
                    $scope.isSearchMod = false;

                    return $scope.treeSetting.hcApi.locate({
                        path: node.data.idpath,
                        key: 'orgid',
                        locateToGrid: true,
                        gridKey: 'positionid'
                    });
                });
        }*/

    }

    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: base_position
    });
});