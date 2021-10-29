/**
 * 薪资发放表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'numberApi'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, numberApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {
                        year_month: new Date().Format('yyyy-MM')
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
                        headerName: "职位",
                        field: "hr_position_id",
                    }, {
                        headerName: "所属部门",
                        field: "dept_name",
                    }, {
                        headerName: "身份证号",
                        field: "idcard",
                    }, {
                        headerName: "银行账号",
                        field: "bank_acc",
                    }, {
                        headerName: "开户银行",
                        field: "bank",
                    }, {
                        headerName: "开户名",
                        field: "acc_name",
                    }, {
                        headerName: "发放金额",
                        field: "pay_amount",
                        type: '金额'
                    }, {
                        headerName: "备注",
                        field: "remark",
                    }, {
                        headerName: "税收地域编码",
                        field: "persontax_area_code",
                        editable: true,
                        onCellDoubleClicked: function (args) {
                            $scope.choose_persontax_area_code(args);
                        },
                        onCellValueChanged: function (args) {
                            if ((args.data.persontax_area_code == 0) || (args.data.persontax_area_code = null)) {
                                $scope.chooseItem(args);
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
                    }],
                    hcBeforeRequest: function (searchObj) {
                        searchObj.search_flag = $scope.data.currItem.search_flag,
                            searchObj.employee_id = $scope.data.currItem.employee_id,
                            searchObj.hr_persontax_area_id = $scope.data.currItem.hr_persontax_area_id
                    },
                    //hcRequestAction: 'searchpersontaxarea',
                    //hcDataRelationName: 'hr_salary_groups',
                    //hcClassId: 'employee_header'
                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*----------------------------------通用查询-------------------------------------------*/
                //薪资组 查询
                $scope.commonSearchSettingOfSalaryGroup = {
                    afterOk: function (result) {
                        $scope.data.currItem.hr_salary_group_id = result.hr_salary_group_id;
                        $scope.data.currItem.salary_group_code = result.salary_group_code;
                        $scope.data.currItem.salary_group_name = result.salary_group_name;
                    }
                };
                //薪资组 查询
                $scope.commonSearchSettingOfBalanceType = {
                    afterOk: function (result) {
                        $scope.data.currItem.base_balance_type_id = result.base_balance_type_id;
                        $scope.data.currItem.balance_type_name = result.balance_type_name;
                        $scope.data.currItem.settlement_type = result.settlement_type;
                    }
                };
                /**
                 * 资金账户通用查询
                 */
                $scope.getCommonSearchSetting_fd_account = function () {
                    var sqlwhere = ' fund_account_status = 2';
                    var acc_type = 0;
                    switch (numberApi.toNumber($scope.data.currItem.settlement_type)) {
                        case 1://现金
                            acc_type = 1;
                            break;
                        case 2://银行
                            acc_type = 2;
                            break;
                        case 3://票据
                            acc_type = 3;
                            break;
                    }
                    sqlwhere += ' and fund_account_type = ' + acc_type;
                    return {
                        beforeOpen: function () {
                            if (numberApi.toNumber($scope.data.currItem.base_balance_type_id) == 0) {
                                swalApi.info('请选择结算方式！');
                                return true;
                            }
                        },
                        sqlWhere: sqlwhere,
                        afterOk: function (response) {
                            $scope.data.currItem.fd_fund_account_id = response.fd_fund_account_id;
                            $scope.data.currItem.fund_account_code = response.fund_account_code;
                            $scope.data.currItem.fund_account_name = response.fund_account_name;

                            $scope.accOfHeadToAccOfLine(true);
                        }
                    };
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