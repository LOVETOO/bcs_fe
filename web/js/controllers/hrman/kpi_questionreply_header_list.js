/**
 * 在线测评答卷
 *  2019/5/16.  kpi_questionreply_header_list
 *  zengjinhua
 *  update by limeng
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
    /**
     * 控制器
     */
        var KpiQuestionreplyHeaderList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    }, {
                        field: 'questionnaire_no',
                        headerName: '答卷编号',
                    },{
                        field: 'subject',
                        headerName: '调研主题'
                    }, {
                        field: 'cyear',
                        headerName: '考核年度'
                    },  {
                        field: 'kpi_period',
                        headerName: '考核周期类型'
                    }, {
                        field: 'season',
                        headerName: '考核期间'
                    }, {
                        field: 'org_name',
                        headerName: '被调研部门'
                    }, {
                        field: 'userid',
                        headerName: '答卷人'
                    }, {
                        field: 'replydate',
                        headerName: '答题截止日',
                        type:'日期'
                    }, {
                        field: 'fashion',
                        headerName: '调研形式',
                        type:'日期'
                    }, {
                        field: 'intention',
                        headerName: '调研目的',
                        hcDictCode:'is_need_stop_insure'
                    }, {
                        field: 'ifhide',
                        headerName: '匿名提交'
                    }, {
                        field: 'fillinnote',
                        headerName: '答题指南'
                    }, {
                        field: 'suggestion1',
                        headerName: '投诉意见'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间'
                    }]
                };

                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
            }
        ];
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: KpiQuestionreplyHeaderList
    });
});

