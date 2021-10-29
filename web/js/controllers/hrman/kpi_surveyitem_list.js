/**
 * 调研项目设置
 * 2019/5/15.  kpi_surveyitem_list
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

    /**
     * 控制器
     */
        var KpeSurveyitenList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'surveyitem_name',
                        headerName: '调研项目名称',
                    },{
                        field: 'subject',
                        headerName: '调研主题'
                    }, {
                        field: 'commentnote',
                        headerName: '答题说明'
                    },  {
                        field: 'sortno',
                        headerName: '排序号'
                    }, {
                        field: 'itemkind',
                        headerName: '调研项目类别'
                    }, {
                        field: 'itemtype',
                        headerName: '答题类型'
                    }, {
                        field: 'usable',
                        hcDictCode:'usable',

                        headerName: '可用'
                    }, {
                        field: 'note',
                        headerName: '备注',
                        type:'日期'
                    }, {
                        field: 'creator',
                        headerName: '创建人',
                        type:'日期'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间',
                    }, {
                        field: 'updator',
                        headerName: '修改人'
                    }, {
                        field: 'update_time',
                        headerName: '修改时间'
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
        controller: KpeSurveyitenList
    });
});

