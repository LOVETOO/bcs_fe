/**
 * 职等薪资标准 属性页 hr_position_grade_salary_prop
 * Created by zhl on 2019/4/1.
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'loopApi'],
    function (module, controllerApi, base_obj_prop, loopApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {

                //数据定义
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.data.currItem.position_level_code = '';

                //表格定义
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号',
                        headerCheckboxSelection: true,
                        checkboxSelection: true
                    }, {
                        "field": "position_level_code",
                        "headerName": "职级编码"
                    }, {
                        "field": "remark",
                        "headerName": "备注"
                    }]
                };

                //继承继承控制器
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //获取绑定数据
                function getCurrItem() {
                    return $scope.data.currItem;
                }

                //职级 查询
                $scope.commonSearchSettingOfLevel = {
                    sqlWhere: function () {
                        if (getCurrItem().position_level_code || getCurrItem().position_level_code != '')
                            return " usable = 2 ";

                        var tempArr = getCurrItem().position_level_code.split(',');

                        var str = '';

                        loopApi.forLoop(tempArr.length, function (i) {
                            if (i + 1 != tempArr.length)
                                str += '\'' + tempArr[i] + '\',';
                            else
                                str += '\'' + tempArr[i] + '\'';
                        });

                        console.log(getCurrItem().position_level_code, 'in sqlwhere ,,');

                        return ' usable = 2 and position_level_code not in (' + str + ')';
                    },
                    checkbox: true,
                    afterOk: function (result) {
                        $scope.data.currItem.position_level_code = '';

                        var position_level_code_arr = [];
                        var position_level_code_str = "";

                        loopApi.forLoop(result.length, function (i) {
                            position_level_code_arr.push(result[i].position_level_code);
                        });

                        position_level_code_str = position_level_code_arr.toString();

                        if ($scope.data.currItem.position_level_code.length > 0)
                            $scope.data.currItem.position_level_code += ',' + position_level_code_str;
                        else
                            $scope.data.currItem.position_level_code += position_level_code_str;
                    }
                };

                /**
                 * 新增时数据 设置
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);

                    bizData.hr_salary_group_id = $stateParams.hr_salary_group_id;
                    bizData.salary_group_code = $stateParams.salary_group_code;
                    bizData.salary_group_name = $stateParams.salary_group_name;

                };

                //验证
                $scope.validCheck = function (invalidBox) {
                    $scope.hcSuper.validCheck(invalidBox);

                    var r = /^\+?[1-9][0-9]*$/;　　//正整数

                    var is_number = r.test($scope.data.currItem.position_grade);

                    if (!is_number) {
                        invalidBox.push('职等必须是正整数！');
                    }
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '职等薪资标准';

                $scope.tabs.other = {
                    title: "其他"
                }

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
