/**
 * 工程预算编制 属性表
 * 2019/6/24
 *  shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi'],
    function (module, controllerApi, base_obj_prop, requestApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$modal',
            //控制器函数
            function ($scope, $modal) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                //主表表格定义
                $scope.gridOptions = {

                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'fin_bud_type_kind',
                        headerName: '预算类别',
                        hcDictCode: 'fin_bud_type_kind',
                        editable: true,
                        hcRequired: true
                    }, {
                        field: 'bud_type_code',
                        headerName: '费用项目/类别编码',
                        hcRequired: true,
                        editable: true,
                        onCellDoubleClicked: function (args) {
                            $scope.chooseFeeCode(args);
                        }
                    }, {
                        field: 'bud_type_name',
                        headerName: '费用项目/类别名称',
                        editable: true
                    }, {
                        field: 'line_remark',
                        headerName: '预算金额',
                        type: '金额',
                        hcRequired: true,
                        editable: true
                    }, {
                        field: 'line_remark',
                        headerName: '备注',
                        width: 400,
                        editable: true
                    }]
                };

                //合同信息 表格定义
                $scope.gridOptions_contract = {

                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'contract_code',
                        headerName: '合同编码'
                    }, {
                        field: 'contract_name',
                        headerName: '合同名称'
                    }, {
                        field: 'signed_date',
                        headerName: '签订日期',
                        type: '日期'
                    }, {
                        field: 'line_remark',
                        headerName: '有效截止日期'
                    }, {
                        field: 'contract_amt',
                        headerName: '合同金额',
                        type: '金额'
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //指定网格对象,否则左下按钮出不来
                $scope.data.currGridModel = 'data.currItem.epm_fin_bud_lineofepm_fin_bud_heads';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/
                //工程项目 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: {
                        search_flag: 120
                    },
                    sqlWhere: "not exists (select project_id from epm_fin_bud_head where project_id = p.project_id) and p.project_status = '已立项' and p.stat=5 ",
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;

                        //带出 合同信息
                        requestApi.post({
                            classId: 'epm_project_contract',
                            action: 'select',
                            data: {
                                project_id: result.project_id,
                                search_flag: 1
                            }
                        }).then(function (response) {
                            $scope.data.currItem.contract_code = response.contract_code;
                            $scope.data.currItem.contract_name = response.contract_name;
                            $scope.data.currItem.signed_date = response.signed_date;
                            $scope.data.currItem.bid_open_primary = response.bid_open_primary;
                            $scope.data.currItem.contract_amt = response.contract_amt;
                        });

                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                    }
                };

                //部门查询
                $scope.commonSearchSettingOfDept = {
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.dept_id;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.dept_name;
                    }
                };

                //项目经理 查询
                $scope.commonSearchSettingOfProjectManager = {
                    afterOk: function (result) {
                        $scope.data.currItem.dept_id = result.userid;
                        $scope.data.currItem.dept_code = result.dept_code;
                        $scope.data.currItem.dept_name = result.username;
                    }
                }

                //选择项目编码
                $scope.chooseFeeCode = function (args) {
                    $modal.openCommonSearch({
                            classId: 'fin_bud_type_header',
                            postData: {
                                fin_bud_type_kind: 2
                            },
                            sqlWhere: ' usable = 2',
                            action: 'search',
                            title: "费用项目/类别",
                            gridOptions: {
                                columnDefs: [
                                    {
                                        headerName: "费用项目/类别编码",
                                        field: "bud_type_code"
                                    }, {
                                        headerName: "费用项目/类别名称",
                                        field: "bud_type_name"
                                    }
                                ]
                            }
                        })
                        .result//响应数据
                        .then(function (response) {
                            args.data.bud_type_code = response.bud_type_code;
                            args.data.bud_type_name = response.bud_type_name;
                            args.api.refreshView();//刷新网格视图
                        });
                };

                /**
                 * 标签页改变事件
                 * @param params
                 */
                $scope.onTabChange = function (params) {
                    $q.when(params)
                        .then($scope.hcSuper.onTabChange)
                        .then(function () {
                            if (params.id == "base") {
                                //指定网格对象,否则左下按钮出不来
                                $scope.data.currGridModel = 'data.currItem.objattachs';
                                $scope.data.currGridOptions = $scope.gridOptions_contract;
                            }
                            else {
                                $scope.data.currGridModel = null;
                                $scope.data.currGridOptions = null;
                            }

                        });
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.org_name = userbean.loginuserifnos[0].org_name;
                    $scope.data.currItem.bud_year = new Date().Format('yyyy');
                    $scope.data.currItem.epm_fin_bud_lineofepm_fin_bud_heads = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_fin_bud_lineofepm_fin_bud_heads);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.is_signup = $scope.data.currItem.is_signup;
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_fin_bud_lineofepm_fin_bud_heads);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*隐藏底部右边边按钮*/
                //$scope.footerRightButtons.saveThenAdd.hide = true;

                /*删除明细按钮*/
                $scope.footerLeftButtons.deleteRow.click = function () {
                    $scope.del_line && $scope.del_line();
                };

                /*隐藏底部左边按钮*/
                $scope.footerLeftButtons.topRow.hide = true;
                $scope.footerLeftButtons.upRow.hide = true;
                $scope.footerLeftButtons.downRow.hide = true;
                $scope.footerLeftButtons.bottomRow.hide = true;

                /**
                 * 删除行明细
                 */
                $scope.del_line = function () {
                    var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.epm_fin_bud_lineofepm_fin_bud_heads.splice(idx, 1);
                        if ($scope.data.currItem.epm_fin_bud_lineofepm_fin_bud_heads.length == 0) {
                            $scope.data.currItem.epm_fin_bud_lineofepm_fin_bud_heads.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_fin_bud_lineofepm_fin_bud_heads);
                    }
                };

                /*----------------------------------tab页定义-------------------------------------------*/
                $scope.tabs = {
                    base: {
                        title: '基本信息',
                        active: true
                    },
                    newAttach: {
                        title: '合同信息'
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