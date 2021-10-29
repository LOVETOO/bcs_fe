/**
 * 工程项目报名属性表
 * 2019/6/15
 * Created by shenguocheng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'docment_name',
                        headerName: '报名资料',
                        editable: true,
                        hcRequired: true,
                        minWidth: 300
                    }, {
                        field: 'line_remark',
                        headerName: '备注',
                        editable: true,
                        minWidth: 300
                    }]
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //指定网格对象,否则左下按钮出不来
                $scope.data.currGridModel = 'data.currItem.epm_project_signup_docmentofepm_project_signups';
                $scope.data.currGridOptions = $scope.gridOptions;
                /*----------------------------------通用查询-------------------------------------------*/
                //工程项目 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: {
                        search_flag: 5,                                             //过滤已选项目
                        table_name:'epm_project_signup',                            //表名
                        primary_key_name:'project_signup_id',                       //主键
                        primary_key_id:$scope.data.currItem.project_signup_id > 0 ? //主键id
                            $scope.data.currItem.project_signup_id : 0
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.project_type = result.project_type;
                        $scope.data.currItem.report_type = result.report_type;
                        $scope.data.currItem.report_time = result.report_time;
                        $scope.data.currItem.bid_url = result.bid_url;
                        $scope.data.currItem.signup_url = result.signup_url;
                        $scope.data.currItem.signup_end_time = result.signup_end_time;

                        $scope.data.currItem.division_id = result.division_id;
                        $scope.data.currItem.project_source = result.project_source;
                        $scope.data.currItem.background = result.background;
                    }
                };

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    $scope.data.currItem.epm_project_signup_docmentofepm_project_signups = [{}];
                    $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_project_signup_docmentofepm_project_signups);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_project_signup_docmentofepm_project_signups);
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;

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
                        $scope.data.currItem.epm_project_signup_docmentofepm_project_signups.splice(idx, 1);
                        if ($scope.data.currItem.epm_project_signup_docmentofepm_project_signups.length == 0) {
                            $scope.data.currItem.epm_project_signup_docmentofepm_project_signups.push({});
                        }
                        $scope.gridOptions.hcApi.setRowData($scope.data.currItem.epm_project_signup_docmentofepm_project_signups);
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