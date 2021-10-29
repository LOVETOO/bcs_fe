/**
 * 封标核查明细
 * 2019/6/12
 * taosilan
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi) {
        'use strict';
        /**
         * 控制器
         */
        var EpmProjectBidSealedProp = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {

                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    currItem: {}
                };

                /**继承基础控制器**/
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });


                /*-------------------数据定义结束------------------------*/

                /*---------------------通用查询开始-------------------------*/

                //工程项目 查询
                $scope.commonSearchSettingOfEpmProject = {
                    postData: {
                        /* 通用查询 */
                        search_flag: 5,
                        /* 当前表名 */
                        table_name : 'epm_project_bid_sealed',
                        /* 当前主键名称 */
                        primary_key_name : 'project_bid_sealed_id',
                        /* 主键id */
                        primary_key_id :
                            $scope.data.currItem.project_bid_sealed_id > 0 ?
                                $scope.data.currItem.project_bid_sealed_id : 0
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.report_time = result.report_time;
                        $scope.data.currItem.project_type = result.project_type;
                        $scope.data.currItem.future_prices = result.future_prices;
                        $scope.data.currItem.project_source = result.project_source;
                        /**
                         * 异步请求
                         */
                        promistSearch ();
                        /*---------------------异步请求结束-------------------------*/
                        $scope.data.currItem.signup_time = result.signup_time;
                        $scope.data.currItem.signup_people = result.signup_people;
                        $scope.data.currItem.signup_method = result.signup_method;
                    }
                };


                /*---------------------通用查询结束-------------------------*/

                function promistSearch () {
                    requestApi.post({
                        classId: 'epm_project_bid_review_head',
                        action: 'search',
                        data: {
                            search_flag: 2,
                            project_id: $scope.data.currItem.project_id
                        }
                    }).then(function (response) {
                        $scope.data.currItem.bid_doc_maker = response.epm_project_bid_review_heads[0].bid_doc_maker;
                        $scope.data.currItem.bid_doc_finish_time = response.epm_project_bid_review_heads[0].bid_doc_finish_time;
                    });
                    //epm_project_bid_head
                    requestApi.post({
                        classId: 'epm_project_bid_head',
                        action: 'select',
                        data: {
                            search_flag: 1,
                            project_id: $scope.data.currItem.project_id
                        }
                    }).then(function (data) {
                        $scope.data.currItem.bid_open_date = data.epm_project_bid_heads[0].bid_open_date;
                        $scope.data.currItem.bid_open_method = data.epm_project_bid_heads[0].bid_open_method;
                        $scope.data.currItem.bid_open_address = data.epm_project_bid_heads[0].bid_open_address;
                        $scope.data.currItem.bid_open_primary = data.epm_project_bid_heads[0].bid_open_primary;
                        $scope.data.currItem.bid_security = data.epm_project_bid_heads[0].bid_security;
                        $scope.data.currItem.bid_security_end_date = data.epm_project_bid_heads[0].bid_security_end_date;
                    });
                }

                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                };
                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    promistSearch ();
                };
                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EpmProjectBidSealedProp
        });
    });