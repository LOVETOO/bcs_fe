/**
 * 利润预算分析 fin_profit_bud_analyse_list
 * date:2019-1-4
 */

define(
    ['module', 'controllerApi', 'base_diy_page', 'fileApi', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_diy_page, fileApi, swalApi , requestApi) {
        'use strict';

        var rowIndex = 0;

        var gridData = [{project:'一、营业收入'},
            {project:'   减：营业成本'},
            {project:'   销售毛利'},
            {project:'   税金及附加'},
            {project:'   销售费用'},
            {project:'   管理费用'},
            {project:'   研发费用'},
            {project:'   财务费用'},
            {project:'   其中：利息费用'},
            {project:'   利息收入'},
            {project:'   资产减值损失'},
            {project:'   信用减值损失'},
            {project:'   加：其他收益'},
            {project:'   投资收益（损失以“-”号填列）'},
            {project:'   其中：对联营企业和合营企业的投资收益'},
            {project:'   净敞口套期收益（损失以“-”号填列）'},
            {project:'   公允价值变动收益（损失以“-”号填列）'},
            {project:'   资产处置收益（损失以“-”号填列）'},
            {project:'二、营业利润（亏损以“-”号填列）'},
            {project:'   加：营业外收入'},
            {project:'   减：营业外支出'},
            {project:'三、利润总额（亏损总额以“-”号填列）'},
            {project:'   减：所得税费用'},
            {project:'四、净利润（净亏损以“-”号填列）'}
        ];

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope ) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'project',
                        headerName: '项目',
                        suppressSizeToFit: true, //禁止适应宽度
                        minWidth:300,
                        width:400,
                        maxWidth:500,
                        pinned: 'left',
                        cellStyle: function (params) {
                            //console.log(params);
                            var val = params.value;
                            if (val.substring(0, 2) == '一、'
                                || val.substring(0, 2) == '二、'
                                || val.substring(0, 2) == '三、'
                                || val.substring(0, 2) == '四、'
                                || val.substring(0, 2) == '五、') {
                                return angular.extend({}, {
                                    'padding-left': '10px' //'text-align': 'left'
                                });
                            } else {
                                return angular.extend({}, {
                                    'padding-left': '30px'
                                });
                            }
                        }
                    }, {
                        field: 'unknown',
                        headerName: '预算编制'
                    },  {
                        field: 'unknown',
                        headerName: '实际执行'
                    }, {
                        field: 'unknown',
                        headerName: '执行率'
                    }/*, {
                        field: 'unknown',
                        headerName: '备注'
                    }*/],
                    rowData :gridData

                };

                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

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


