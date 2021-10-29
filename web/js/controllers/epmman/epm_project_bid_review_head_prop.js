/**
 * 投标文件评审
 * 2019/6/12
 * zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi'],
    function (module, controllerApi, base_obj_prop, requestApi) {

        var controller = [
            '$scope',
            function ($scope) {

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*----------------------------------表格定义-------------------------------------------*/
                /**
                 * 表格定义  "投标文件评审"
                 */
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'eligible_type_name',
                        width:105,
                        headerName: '评审指标类型'
                    }, {
                        field: 'is_match',
                        headerName: '满足要求',
                        width:105,
                        type:'是否',
                        editable: true
                    }, {
                        field: 'req_desc',
                        headerName: '指标详细描述',
                        width:600,
                        editable: true
                    }]
                };

                /*----------------------------------通用查询-------------------------------------------*/

                /**
                 * 工程项目查询
                 */
                $scope.searchObjEpmProject = {
                    postData: {
                        /* 通用查询 */
                        search_flag: 5,
                        /* 当前表名 */
                        table_name : 'epm_project_bid_review_head',
                        /* 当前主键名称 */
                        primary_key_name : 'project_bid_review_head_id',
                        /* 主键id */
                        primary_key_id :
                            $scope.data.currItem.project_bid_review_head_id > 0 ?
                                $scope.data.currItem.project_bid_review_head_id : 0
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.project_id = result.project_id;
                        $scope.data.currItem.project_code = result.project_code;
                        $scope.data.currItem.project_name = result.project_name;
                        $scope.data.currItem.report_time = result.report_time;
                        $scope.data.currItem.project_type = result.project_type;
                        $scope.data.currItem.future_prices = result.future_prices;
                        $scope.data.currItem.signup_time = result.signup_time;
                        $scope.data.currItem.signup_plan_people = result.signup_plan_people;
                        $scope.data.currItem.signup_method = result.signup_method;
                        $scope.data.currItem.project_source = result.project_source;
                        return requestApi
                            .post({
                                classId: 'epm_project_bid_head',
                                action: 'select',
                                data: {
                                    search_flag : 1,
                                    project_id : $scope.data.currItem.project_id
                                }
                            })
                            .then(function (data) {
                                $scope.data.currItem.bid_open_date = data.epm_project_bid_heads[0].bid_open_date;
                                $scope.data.currItem.bid_open_method = data.epm_project_bid_heads[0].bid_open_method;
                                $scope.data.currItem.bid_open_address = data.epm_project_bid_heads[0].bid_open_address;
                                $scope.data.currItem.bid_open_primary = data.epm_project_bid_heads[0].bid_open_primary;
                                $scope.data.currItem.bid_security = data.epm_project_bid_heads[0].bid_security;
                                $scope.data.currItem.bid_security_end_date = data.epm_project_bid_heads[0].bid_security_end_date;
                            })
                            .then(function () {
                                return requestApi
                                    .post({
                                        classId: 'epm_making_tender',
                                        action: 'select',
                                        data: {
                                            search_flag : 1,
                                            project_id : $scope.data.currItem.project_id
                                        }
                                    })
                                    .then(function (prop) {
                                        $scope.data.currItem.bid_doc_maker = prop.producer;
                                    })
                            });
                    }
                };

                /**
                 *  清空数据时
                 */
                $scope.changeEpmProject = function(){
                    if($scope.data.currItem.project_code==null||$scope.data.currItem.project_code==undefined||$scope.data.currItem.project_code==""){
                        $scope.data.currItem.project_name = undefined;
                    }
                };

                /*----------------------------------按钮方法数据 定义-------------------------------------------*/
                /**
                 * 新增时数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.epm_project_bid_review_lineofepm_project_bid_review_heads = [];
                    addLine();
                };
                /**
                 * 增加行
                 */
                function addLine () {
                    return requestApi.post({
                        classId: 'epm_project_bid_review_head',
                        action: 'search',
                        data: {
                            search_flag : 1
                        }
                    }).then(function (values) {
                        $scope.gridOptions.api.stopEditing();
                        var data = $scope.data.currItem.epm_project_bid_review_lineofepm_project_bid_review_heads;
                        values.epm_project_bid_review_heads.forEach(function(val){
                            data.push({
                                eligible_type_name:val.dictname,
                                eligible_type_id:val.dictvalue
                            });
                        });
                        $scope.gridOptions.hcApi.setRowData(data);
                    });
                }

                /**
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions.hcApi.setRowData(bizData.epm_project_bid_review_lineofepm_project_bid_review_heads);
                };

                /*----------------------------------按钮及标签 定义-------------------------------------------*/

                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.hide = true;
                $scope.footerLeftButtons.deleteRow.hide = true;


            }
        ];
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });

    });