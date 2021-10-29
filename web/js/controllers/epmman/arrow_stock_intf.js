/**
 * 库存查询
 * 2019/8/14
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                //*--------------------------------数据定义------------------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};
                /*--------------------------------网格定义------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    hcCanExportRoles : 'inv_record_export',
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "产品编码",
                        field: "item_code"
                    },{
                        headerName: "产品名称",
                        field: "item_name"
                    }, {
                        headerName: "产品规格",
                        field: "specs"
                    }, {
                        headerName: "产品型号",
                        field: "item_model"
                    }, {
                        headerName: "颜色",
                        field: "item_color"
                    }, {
                        headerName: "单位",
                        field: "uom_name"
                    }, {
                        headerName: "产品体积",
                        field: "cubage",
                        type : '体积'
                    }, {
                        headerName: "库存数量",
                        field: "stock_qty",
                        type : '数量'
                    }, {
                        headerName: "生产基地",
                        field: "mftr_base_name",
                        valueGetter: function (params) {
                            if(params.data.entorgid == 1){
                                return "";
                            }else{
                                return params.data.mftr_base_name;
                            }
                        }
                    }, {
                        headerName: "事业部",
                        field: "division_id",
                        hcDictCode : 'epm.division'
                    }, {
                        headerName: "产品线",
                        field: "entorgid",
                        hcDictCode : 'entorgid'
                    }, {
                        headerName: "产品小类",
                        field: "item_class3_name"
                    }],
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        searchObj.item_code = $scope.data.currItem.item_code;
                        searchObj.item_name = $scope.data.currItem.item_name;
                        searchObj.specs = $scope.data.currItem.specs;
                        searchObj.entorgid = $scope.data.currItem.entorgid;
                        searchObj.mftr_base_name = $scope.data.currItem.mftr_base_name;
                        searchObj.item_class3_name = $scope.data.currItem.item_class3_name;
                        searchObj.item_model = $scope.data.currItem.item_model;
                    },
                    //定义查询类与方法
                    hcRequestAction:'search',
                    hcDataRelationName:'arrow_stock_intfs',
                    hcClassId:'arrow_stock_intf'
                };

                //控制器继承
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 生产基地查询
                 */
                $scope.commonSearchScporg = {
                    title:'生产基地',
                    sqlWhere : ' is_contract_unit = 2 ',
                    afterOk: function (result) {
                        $scope.data.currItem.mftr_base_name = result.orgname;
                    }
                };

                /**
                 * 产品资料查询
                 */
                $scope.commonSearchItem = {
                    title:'产品',
                    afterOk: function (result) {
                        $scope.data.currItem.item_code = result.item_code;
                    }
                };

                /*--------------------------------定义按钮------------------------------------*/
                /**
                 * 添加按钮
                 */
                $scope.toolButtons = {
                    search: {
                        title: '清除',
                        icon: 'iconfont hc-qingsao',
                        click: function () {
                            $scope.reset && $scope.reset();
                        }
                    },
                    loan: {
                        title: '查询',
                        icon: 'fa fa-search',
                        click: function () {
                            $scope.gridOptions.hcApi.search();
                        }
                    }
                };
                /*--------------------------------定义按钮方法------------------------------------*/
                /**
                 * 重置方法,将过滤条件清空
                 */
                $scope.reset = function () {
                    ["item_code", "item_name", "specs", "item_model",
                        "entorgid", "mftr_base_name", "item_class3_name"].forEach(function (data) {
                        $scope.data.currItem[data] = undefined;
                    });
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