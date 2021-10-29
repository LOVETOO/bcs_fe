/**
 *  2019/5/16.
 *  薪资组设置     hr_salary_group_header_list
 *  zengjinhua
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'swalApi','directive/hcImg'], defineFn)
})(function (module, controllerApi, base_obj_prop, swalApi) {

    HrSalaryGroupHeaderProp.$inject = ['$scope'];

    function HrSalaryGroupHeaderProp($scope) {
        //继承基础控制器
        controllerApi.extend({
            controller: base_obj_prop.controller,
            scope: $scope
        });
        /*----------------------------------表格定义-------------------------------------------*/
        //表格定义  "基本详情"
        $scope.gridOptions = {
            columnDefs: [{
                type: '序号'
            }, {
                field: 'salary_item_code',
                headerName: '薪资项目编码',
                width:180
            }, {
                field: 'salary_item_name',
                headerName: '薪资项目名称',
                width:180,
                hcRequired:true,
                editable: true
            }, {
                field: 'is_fixsalary',
                headerName: '固薪项目',
                editable: true,
                type:'是否'
            }, {
                field: 'is_varsalary_imp',
                headerName: '单据导入',
                editable: true,
                type:'是否'
            }, {
                field: 'remark',
                headerName: '备注',
                editable: true,
                width:300
            }]
        };

        /*----------------------------------按钮方法数据 定义-------------------------------------------*/
        /**
         * 新增时数据
         */
        $scope.newBizData = function (bizData) {
            $scope.hcSuper.newBizData(bizData);
            //基本详情
            bizData.hr_salary_item_sets = [];
            $scope.gridOptions.hcApi.setRowData(bizData.hr_salary_item_sets);
            bizData.usable = 2;
        };

        /**
         * 设置数据
         */
        $scope.setBizData = function (bizData) {
            $scope.hcSuper.setBizData(bizData);
            //设置基本经历
            $scope.gridOptions.hcApi.setRowData(bizData.hr_salary_item_sets);
        };

        /*----------------------------------按钮及标签 定义-------------------------------------------*/

        /*底部左边按钮*/

        $scope.footerLeftButtons.addRow.click = function(){
            $scope.add_line && $scope.add_line();
        };
        $scope.footerLeftButtons.addRow.hide = function(){
            return false;
        };
        $scope.footerLeftButtons.deleteRow.click=function(){
            $scope.del_line && $scope.del_line();
        };
        $scope.footerLeftButtons.deleteRow.hide=function(){
            return false;
        };
        /*----------------------------------按钮方法 定义-------------------------------------------*/
        //添加明细
        $scope.add_line = function () {
            $scope.gridOptions.api.stopEditing();
            $scope.data.currItem.hr_salary_item_sets.push({});
            $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_salary_item_sets);

        };
        /**
         * 删除行教育经历
         */
        $scope.del_line = function () {
            var idx = $scope.gridOptions.hcApi.getFocusedRowIndex();
            if (idx < 0) {
                swalApi.info('请选中要删除的行');
            } else {
                $scope.data.currItem.hr_salary_item_sets.splice(idx, 1);
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.hr_salary_item_sets);
            }
        };



        /*----------------------------------标签定义-------------------------------------------*/

    }
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: HrSalaryGroupHeaderProp
    });

});