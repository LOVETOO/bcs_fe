/**
 * 在线测评答卷
 *  2019/5/16
 *  zengjinhua
 *  update by limeng
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi','fileApi','directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi,fileApi) {

    var KpiQuestionreplyHeaderProp = [
        '$scope',

        function ($scope) {

            //继承基础控制器
            controllerApi.extend({
                controller: base_obj_prop.controller,
                scope: $scope
            });
            /*----------------------------------表格定义-------------------------------------------*/
            //表格定义  "教育经历"
            $scope.gridOptions = {
                columnDefs: [{
                    type: '序号'
                }, {
                    field: 'surveyitem_name',
                    headerName: '调研项目名称',
                    width: 250
                }, {
                    field: 'itemtype',
                    headerName: '答题类型',
                    hcDictCode:'itemtype',
                    width: 150
                }, {
                    field: 'commentnote',
                    headerName: '答题说明',
                    width: 200
                }, {
                    field: 'answer',
                    headerName: '答案',
                    width: 150
                }, {
                    field: 'note',
                    headerName: '备注',
                    width: 150
                }]
            };

            /*----------------------------------按钮方法数据 定义-------------------------------------------*/

            /**
             * 新增时数据
             */
            $scope.newBizData = function (bizData) {
                $scope.hcSuper.newBizData(bizData);
                $scope.data.currItem.kpi_questionreply_lineofkpi_questionreply_headers = [{}];
                $scope.gridOptions.hcApi.setRowData($scope.data.currItem.kpi_surveyitemofkpi_questionnaire_lines);
            };


            /**
             * 设置数据
             */
            $scope.setBizData = function (bizData) {
                $scope.hcSuper.setBizData(bizData);
                $scope.gridOptions.hcApi.setRowData(bizData.kpi_questionreply_lineofkpi_questionreply_headers);

            };

            /*----------------------------------按钮及标签 定义-------------------------------------------*/


            /*----------------------------------按钮方法 定义-------------------------------------------*/
            //添加教育经历
            $scope.add_education = function () {
                /*var data = $scope.data.currItem.employee_apply_educationofemployee_apply_headers;
                 var newLine = {};
                 data.push(newLine);
                 $scope.gridOptions_education.hcApi.setRowData(data);*/
            };
            /**
             * 删除行教育经历
             */
            $scope.del_education = function () {
                /*var idx = $scope.gridOptions_education.hcApi.getFocusedRowIndex();
                 if (idx < 0) {
                 swalApi.info('请选中要删除的行');
                 } else {
                 $scope.data.currItem.employee_apply_educationofemployee_apply_headers.splice(idx, 1);
                 $scope.gridOptions_education.hcApi.setRowData($scope.data.currItem.employee_apply_educationofemployee_apply_headers);
                 }*/
            };


        }
        ];
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: KpiQuestionreplyHeaderProp
    });

});