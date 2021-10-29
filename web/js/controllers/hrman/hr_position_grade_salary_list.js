/**
 * 职等薪资标准 hr_position_grade_salary_list
 * Created by zhl on 2019/4/1.
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_diy_page', 'requestApi', 'openBizObj', 'swalApi'], defineFn);
})(function (module, controllerApi, base_diy_page, requestApi, openBizObj, swalApi) {
    diyController.$inject = ['$scope', '$q'];
    function diyController($scope, $q) {

        $scope.data = {};
        $scope.data.currItem = {};

        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'position_grade',
                headerName: '职等'
            }, {
                field: 'position_level_code',
                headerName: '职级'
            }, {
                field: 'remark',
                headerName: '备注',
                width: '800'
            }],
            hcEvents: {
                cellDoubleClicked: function (params) {
                    return $scope.openProp();
                }
            }

        };

        //继承基础控制器
        controllerApi.extend({
            controller: base_diy_page.controller,
            scope: $scope
        });

        function getCurrItem() {
            return $scope.data.currItem;
        }

        /*--------------------- 通用查询 开始---------------------------*/

        //查询 薪资组及对应数据
        $scope.commonSearchSettingOfSalaryGroup = {
            afterOk: function (result) {
                getCurrItem().hr_salary_group_id = result.hr_salary_group_id;
                getCurrItem().salary_group_code = result.salary_group_code;
                getCurrItem().salary_group_name = result.salary_group_name;

                return $scope.search();
            }
        };

        /*--------------------- 通用查询 结束---------------------------*/

        /*-----------------按钮定义及相关函数 开始----------------------*/

        $scope.buttons = {
            export: {
                title: '导出',
                icon: 'iconfont hc-daochu',
                click: function () {
                    $scope.export && $scope.export();
                }
            },
            delete: {
                title: '删除',
                icon: 'fa fa-minus',
                click: function () {
                    $scope.delete && $scope.delete();
                }
            },
            add: {
                title: '新增',
                icon: 'fa fa-plus',
                click: function () {
                    return $scope.add();
                }
            }
        };

        //新增
        $scope.add = function () {
            if (!getCurrItem().hr_salary_group_id || getCurrItem().hr_salary_group_id == 0)
                return swalApi.info('请先选中薪资组');

            return openBizObj({
                height: '180px',
                stateName: 'hrman.hr_position_grade_salary_prop',
                params: {
                    id: 0,
                    hr_salary_group_id: getCurrItem().hr_salary_group_id
                }
            }).result.finally($scope.search);;
        };

        //查看详情
        $scope.openProp = function () {
            return openBizObj({
                height: '180px',
                stateName: 'hrman.hr_position_grade_salary_prop',
                params: {
                    id: $scope.gridOptions.hcApi.getFocusedData().hr_position_grade_salary_id
                }
            }).result.finally($scope.search);
        };

        /**
         * 删除
         */
        $scope.delete = function () {
            // 获取选中的行的数据
            var focuseData = $scope.gridOptions.hcApi.getFocusedData();
            if (!focuseData || !focuseData.hr_position_grade_salary_id) {
                return swalApi.info("请选择要删除的行!")
            }

            return swalApi.confirmThenSuccess({
                title: "确定要删除吗?",
                okFun: function () {
                    //函数区域
                    requestApi.post("hr_position_grade_salary", "delete", {
                        hr_position_grade_salary_id: focuseData.hr_position_grade_salary_id
                    }).then(function(){
                        $scope.search();
                    });
                },
                okTitle: '删除成功'
            });
        };

        //导出
        $scope.export = function () {
            $scope.gridOptions.hcApi.exportToExcel();
        };

        //查询
        $scope.search = function () {
            var postData = {};

            if (getCurrItem().hr_salary_group_id && getCurrItem().hr_salary_group_id > 0)
                postData.sqlwhere = ' hr_salary_group_id =' + getCurrItem().hr_salary_group_id;

            return requestApi.post('hr_position_grade_salary', 'search', postData)
                .then(function (response) {
                    $scope.gridOptions.hcApi.setRowData(response.hr_position_grade_salarys);
                });
        };
        /*-----------------按钮定义及相关函数 结束----------------------*/
    }

    return controllerApi.controller({
        module: module,
        controller: diyController
    });
});

