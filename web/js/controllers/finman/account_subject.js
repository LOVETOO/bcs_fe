/**
 * 会计科目列表页
 * @since 2018-10-10
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.data = {};
                $scope.data.currItem = {};
                //初始化？
                $scope.objconf = {
                    name: "gl_account_subject",
                    key: "gl_account_subject_id",//gl_account_subject_id
                    // wftempid: 10082,
                    FrmInfo: {},
                    grids: [
                        {
                            optionname: 'gridOptions',
                            idname: 'gl_account_subjects',
                            istree: true,//$scope.objconf.grids[0]，必须放到第一个
                        }]
                };
                //焦点设置
                $scope.setforcus = function () {
                    $scope.forcusRow = $scope.gridGetRow("gridOptions");
                    if ($scope.data.flag != 3) {
                        return;
                    }
                    if (!$scope.forcusRow || $scope.forcusRow[$scope.objconf.key] == undefined) {
                        return $scope.forcusRow = false;
                    }
                    var node = $scope.gridGetForcsNode("gridOptions")
                    if (node.parent) {
                        $scope.Father = node.parent.data;
                    }
                    for (var i = 0; i < $scope.Father.children.length; i++) {
                        if ($scope.forcusRow[$scope.objconf.key] == $scope.Father.children[i][$scope.objconf.key]) {
                            $scope.childeIndex = i;
                            return;
                        }
                    }
                    return $scope.forcusRow = false;
                }
                //数据加载


                $scope.initData = function () {
                    requestApi.post("gl_account_subject", "search", {}).then(function (data) {
                        $scope.gridOptions.rowData = data.gl_account_subjects;
                        var eGridDiv = document.querySelector('#myGrid');
                        // create the grid passing in the div to use together with the columns & data we want to use
                        // $scope.grid = new agGrid.Grid(eGridDiv, $scope.gridOptions);
                    });
                }

                $scope.refreshData = function () {
                    requestApi.post("gl_account_subject", "search", {}).then(function (data) {
                        $scope.gridOptions.rowData = data.gl_account_subjects;
                        //var eGridDiv = document.querySelector('#myGrid');
                        // create the grid passing in the div to use together with the columns & data we want to use
                        //new agGrid.Grid(eGridDiv, $scope.gridOptions);
                        $scope.gridOptions.api.setRowData([]);
                        $scope.gridOptions.api.setRowData(data.gl_account_subjects);
                    });
                }

                $scope.refresh_after = function () {
                    if (flag == 1) {
                        forcusRow.children = $scope.children;
                    }
                    if (flag == 2 && $scope.data.currItem[$scope.objconf.key] != undefined && $scope.data.currItem[$scope.objconf.key] > 0) {
                        forcusRow.children = forcusRow.children || [];
                        forcusRow.children.push($scope.data.currItem);
                        forcusRow.group = (forcusRow.children.length > 0);
                        forcusRow.expanded = forcusRow.group;
                    }
                    if ($scope.actionstr == "ok") {
                        $modalInstance.close();
                    }
                    $scope.$parent.tree_options.api.setRowData($scope.$parent.data.currItem[$scope.$parent.objconf.grids[0].idname]);
                    $scope.new();
                }

                $scope.getDataPath = function (data, fieldName) {
                    var strTmp = data[fieldName];
                    return strTmp.substr(1, strTmp.length - 2).split('\\');
                }

                $scope.gridOptions = {
                    treeData: true, // enable Tree Data mode
                    animateRows: true,
                    groupDefaultExpanded: -1,
                    //groupDefaultExpanded: -1, // expand all groups by default
                    rowHeight: 25,
                    rowData: [],
                    getDataPath: function (data) {
                        // return data.orgHierarchy;
                        return $scope.getDataPath(data, "idpath");
                    },
                    onGridReady: function (params) {
                        params.api.sizeColumnsToFit();
                    },
                    icons: {
                        groupExpanded: '<i class="fa fa-minus-square-o"/>',
                        groupContracted: '<i class="fa fa-plus-square-o"/>',
                        columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                        filter: '<i class="fa fa-filter"/>',
                        sortAscending: '<i class="fa fa-long-arrow-down"/>',
                        sortDescending: '<i class="fa fa-long-arrow-up"/>',
                    },
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            headerName: "科目",
                            children: [
                                {
                                    field: 'km_code',
                                    headerName: '编码',
                                    editable: false,
                                    filter: 'set',
                                    width: 140,
                                    cellEditor: "树状结构",
                                },
                                {
                                    field: 'km_name',
                                    headerName: '名称',
                                }
                            ]
                        }, {
                            field: 'help_code',
                            headerName: '助记码',
                        }, {
                            field: 'km_type',
                            headerName: '科目类型',
                        }, {
                            field: 'km_property',
                            headerName: '科目性质',
                        }, {
                            field: 'page_type',
                            headerName: '账业格式',
                        }, {
                            field: 'km_level',
                            headerName: '科目级别',
                        }, {
                            headerName: "记账货币",
                            children: [
                                {
                                    field: 'currency_code',
                                    headerName: '货币编码',
                                },
                                {
                                    field: 'currency_name',
                                    headerName: '货币名称',
                                }
                            ]
                        }, {
                            field: 'is_freeze',
                            headerName: '是否冻结',
                            type: "是否",
                        }, {
                            field: 'end_km',
                            headerName: '是否明细科目',
                            type: "是否",
                        }
                    ]
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });
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
