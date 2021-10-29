/**
 * 薪资福利项目设置
 * 2019/5/14. 薪资福利项目设置
 * zengjinhua
 */
(function (defineFn) {
    define(['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi','$modal','directive/hcImg'], defineFn)
})(function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi,$modal) {

    Hr_SalaryItemSetProp.$inject = ['$scope','$modal'];

    function Hr_SalaryItemSetProp($scope,$modal) {
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
                field: 'salary_group_code',
                headerName: '薪资组编码',
                editable: true,
                onCellDoubleClicked: function (args) {
                    $scope.chooseDeptNameItem(args);
                },
                width:180
            }, {
                field: 'salary_group_name',
                headerName: '薪资组名称',
                width:180
            }, {
                field: 'is_varsalary_imp',
                headerName: '单据导入',
                editable: true,
                type:'是否'
            }, {
                field: 'remark',
                headerName: '备注',
                width:400
            }]
        };
        /*----------------------------------通用查询-------------------------------------------*/
        /**
         * 查薪资组
         */
        $scope.chooseDeptNameItem = function (args){
            $modal.openCommonSearch({
                classId:'hr_salary_group',
                postData:{search_flag : 1},
                action:'search',
                title:"薪资组",
                gridOptions:{
                    columnDefs:[
                        {
                            headerName: "薪资组编码",
                            field: "salary_group_code"
                        },{
                            headerName: "薪资组名称",
                            field: "salary_group_name"
                        }
                    ]
                }
            })
                .result//响应数据
                .then(function(result){
                    var a = 0;
                    $scope.data.currItem.hr_salary_item_sets.forEach(function(val){
                        if(val.hr_salary_group_id==response.hr_salary_group_id){
                            swalApi.info('已有薪资组【'+response.salary_group_name+'】');
                            a = 1;
                        }
                    });
                    if(a == 0){
                        args.data.hr_salary_group_id = response.hr_salary_group_id;
                        args.data.salary_group_code = response.salary_group_code;
                        args.data.salary_group_name = response.salary_group_name;
                        return args.data;
                    }
                }).then(function () {
                    args.api.refreshView();
                });
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
            bizData.is_visible = 2;
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

    }
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: Hr_SalaryItemSetProp
    });

});