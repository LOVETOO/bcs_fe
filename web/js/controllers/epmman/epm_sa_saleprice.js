/**
 * 价目表设置
 * 2019/8/15
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_diy_page', 'swalApi', 'requestApi', 'gridApi', 'directive/hcBox'],
    function (module, controllerApi, base_diy_page, swalApi, requestApi, gridApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                //*--------------------------------数据定义------------------------------------*/
                $scope.data = {};
                $scope.data.currItem = {};
                $scope.division_arr = [];//定义事业部词汇对象
                /*--------------------------------网格定义------------------------------------*/
                /**
                 * 表格定义
                 */
                $scope.gridOptions = {
                    hcCanExportRoles: 'price_record_export',
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: "产品编码",
                        field: "item_code"
                    },{
                        headerName: "产品名称",
                        field: "item_name"
                    }, {
                        headerName: "价格",
                        field: "price_bill",
                        type : '金额'
                    }, {
                        headerName: "单位",
                        field: "uom_name"
                    }, {
                        headerName: "有效开始时间",
                        field: "start_date",
                        type : '日期'
                    }, {
                        headerName: "有效结束时间",
                        field: "end_date",
                        type : '日期'
                    }, {
                        headerName: "已失效",
                        field: "is_cancellation",
                        type : '是否'
                    }, {
                        headerName: "事业部",
                        field: "division_id",
                        hcDictCode : 'epm.division'
                    }],
                    hcBeforeRequest: function (searchObj) {//发送查询条件
                        searchObj.item_code = $scope.data.currItem.item_code;
                        searchObj.item_name = $scope.data.currItem.item_name;
                        searchObj.division_id = $scope.data.currItem.division_id;
                        searchObj.start_date = $scope.data.currItem.start_date;
                        searchObj.end_date = $scope.data.currItem.end_date;
                        searchObj.is_cancellation = $scope.data.currItem.is_cancellation;
                    },
                    //定义查询类与方法
                    hcRequestAction:'search',
                    hcDataRelationName:'epm_sa_saleprices',
                    hcClassId:'epm_sa_saleprice'
                };

                //控制器继承
                controllerApi.extend({
                    controller: base_diy_page.controller,
                    scope: $scope
                });

                /*----------------------------------事业部控制-------------------------------------------*/
                requestApi
                    .post({
                        classId: 'epm_sa_saleprice',
                        action: 'setdivision',
                        data: {}
                    })
                    .then(function (data) {
                        if(data.divisions.length > 1){//多条
                            $scope.isOnly = false;
                            data.divisions.forEach(function (value) {
                                $scope.division_arr.push({
                                    name : value.dictname,
                                    value : value.dictvalue
                                })
                            });
                        }else{
                            $scope.division_arr.push({
                                name : data.divisions[0].dictname,
                                value : data.divisions[0].dictvalue
                            });
                            $scope.isOnly = true;
                            $scope.data.currItem.division_id = $scope.division_arr[0].value;
                            gridApi.execute($scope.gridOptions, function () {
                                $scope.gridOptions.hcApi.search();
                            });
                        }
                    });
                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 产品资料查询
                 */
                $scope.commonSearchItem = {
                    title:'产品',
                    checkbox: true,
                    afterOk: function (result) {
                        var str = "";
                        result.forEach(function(value, index) {
                            if(index == 0){
                                str += value.item_code;
                            }else{
                                str += "," + value.item_code;
                            }
                        });
                        $scope.data.currItem.item_code = str;
                    }
                };
                /*----------------------------------方法定义-------------------------------------------*/
                /**
                 * 时间校验
                 */
                $scope.changeDate = function(){
                    if(($scope.data.currItem.start_date != ""
                        && $scope.data.currItem.start_date != undefined
                        && $scope.data.currItem.start_date != null)
                        && ($scope.data.currItem.end_date != ""
                            && $scope.data.currItem.end_date != undefined
                            && $scope.data.currItem.end_date != null)){
                        if(new Date($scope.data.currItem.start_date).Format('yyyy-MM-dd')
                            != new Date($scope.data.currItem.end_date).Format('yyyy-MM-dd')){
                            if(new Date($scope.data.currItem.start_date).getTime()
                                >= new Date($scope.data.currItem.end_date).getTime()){
                                swalApi.info("'截止时间'不能小于'起始时间'");
                                $scope.data.currItem.start_date = undefined;
                                $scope.data.currItem.end_date = undefined;
                            }
                        }
                    }
                };

                /**
                 * 是否无效方法
                 */
                $scope.invalidMethod = function () {
                    if($scope.data.currItem.valid == $scope.data.currItem.invalid){
                        $scope.data.currItem.is_cancellation = 0;
                    }else if($scope.data.currItem.valid == 2){
                        $scope.data.currItem.is_cancellation = 1;
                    }else if($scope.data.currItem.invalid == 2){
                        $scope.data.currItem.is_cancellation = 2;
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
                    ["item_code", "item_name", "division_id", "valid", "invalid",
                        "start_date", "end_date", "is_cancellation"].forEach(function (data) {
                        $scope.data.currItem[data] = undefined;
                    });
                    if($scope.isOnly){
                        $scope.data.currItem.division_id = $scope.division_arr[0].value;
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