/**
 * 员工地域税收分配表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {

                $scope.data = {
                    currItem: {
                        search_flag: 1
                    }
                };

                $scope.gridOptions = {
                    columnDefs: [{
                        id: 'seq',
                        type: '序号'
                    }, {
                        headerName: "员工编码",
                        field: "employee_code"
                    }, {
                        headerName: "员工名称",
                        field: "employee_name"
                    }, {
                        headerName: "所属部门",
                        field: "org_name",
                    }, {
                        headerName: "税收地域编码",
                        field: "persontax_area_code",
                        editable: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_persontax_area_code(args);
                        },
                        onCellValueChanged: function (args) {
                            if ((args.data.persontax_area_code == 0) || (args.data.persontax_area_code = null)) {
                                $scope.uncheck(args);
                                return;
                            }
                            if (args.newValue === args.oldValue)
                                return;
                            getPersontaxArea(args.newValue)
                                .catch(function (reason) {
                                    return {
                                        hr_persontax_area_id: 0,
                                        persontax_area_code: '',
                                        persontax_area_name: reason
                                    };
                                })
                                .then(function (line) {
                                    angular.extend(args.data, line);
                                    return args.data;
                                })
                                .then(function () {
                                    args.api.refreshView();
                                });
                        }
                    },
                        {
                            headerName: "税收地域名称",
                            field: "persontax_area_name"
                        }
                    ],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.data.currItem.search_flag,
                            searchObj.employee_id = $scope.data.currItem.employee_id,
                            searchObj.hr_persontax_area_id = $scope.data.currItem.hr_persontax_area_id
                    },
                    hcRequestAction: 'searchpersontaxarea',
                    hcDataRelationName: 'employee_headerofemployee_headers',
                    hcClassId: 'employee_header'
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /**
                 * 查地域
                 */
                $scope.choose_persontax_area_name = function () {
                    $modal.openCommonSearch({
                            classId: 'hr_persontax_area'
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.persontax_area_name = response.persontax_area_name;
                            $scope.data.currItem.persontax_area_code = response.persontax_area_code;
                            $scope.data.currItem.hr_persontax_area_id = response.hr_persontax_area_id;
                            $scope.search();
                        });
                };

                /**
                 * 查员工
                 */
                $scope.choose_employee_name = function () {
                    $modal.openCommonSearch({
                            classId: 'employee_header',
                            title: "员工资料"
                        })
                        .result//响应数据
                        .then(function (response) {
                            $scope.data.currItem.employee_name = response.employee_name;
                            $scope.data.currItem.employee_code = response.employee_code;
                            $scope.data.currItem.employee_id = response.employee_id;
                            $scope.search();
                        });
                };

                /**
                 * 查地域
                 */
                $scope.choose_persontax_area_code = function (args) {
                    $modal.openCommonSearch({
                            classId: 'hr_persontax_area',
                            title: "地域查询",
                            sqlWhere: 'usable = 2 '
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.hr_persontax_area_id = response.hr_persontax_area_id;
                            args.data.persontax_area_code = response.persontax_area_code;
                            args.data.persontax_area_name = response.persontax_area_name;
                            return args;
                        }).then(function () {
                        args.api.refreshView();
                    });
                };
                //如果要取消原有分配地域，并把地域id设置为0
                $scope.uncheck = function (args) {
                    args.data.persontax_area_name = undefined;
                    args.data.hr_persontax_area_id = 0;
                };

                //获取地域信息
                function getPersontaxArea(code) {
                    var postData = {
                        classId: "hr_persontax_area",
                        action: 'search',
                        data: {sqlwhere: "persontax_area_code = '" + code + "' and usable = 2"}
                    };
                    return requestApi.post(postData)
                        .then(function (data) {
                            if (data.hr_persontax_areas.length > 0) {
                                return data.hr_persontax_areas[0];
                            } else {
                                return $q.reject("地域编码【" + code + "】不可用");
                            }
                        });
                }

                //根据分配条件变化查询
                $scope.setSearchFlag = function () {
                    if ($scope.data.currItem.search_flag == 0 || $scope.data.currItem.search_flag == null) {
                        $scope.data.currItem.search_flag = undefined;
                    }
                    $scope.search();
                };

                // 根据地域名称变化查询
                $scope.setPersontaxAreaName = function () {
                    if (($scope.data.currItem.persontax_area_name == 0) || ($scope.data.currItem.persontax_area_name == null)) {
                        $scope.data.currItem.hr_persontax_area_id = undefined
                    }
                    $scope.search();
                };

                //根据员工名称变化查询
                $scope.setEmployeeName = function () {
                    if (($scope.data.currItem.employee_name == 0) || ($scope.data.currItem.employee_name == null)) {
                        $scope.data.currItem.employee_id = undefined
                    }
                    $scope.search();
                };

                //添加按钮
                $scope.toolButtons = {
                    search: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.search && $scope.search();
                        }
                    },
                    save: {
                        title: '保存',
                        icon: 'iconfont hc-baocun',
                        click: function () {
                            $scope.save && $scope.save();
                        }
                    }
                };

                //保存
                $scope.save = function () {
                    var action = 'employeetaxareaupdate';
                    var postdata = {
                        employee_headerofemployee_headers: $scope.gridOptions.hcApi.getRowData()
                    };
                    //调用后台保存方法
                    requestApi.post("employee_header", action, postdata).then(function (data) {
                        return swalApi.success('保存成功!');
                    }).then($scope.search);
                };
                //查询
                $scope.search = function () {
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