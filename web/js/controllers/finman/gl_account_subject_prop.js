/**
 * 会计科目-属性页
 * 2018-11-9
 */
define(
    ['module', 'controllerApi', 'base_obj_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams', '$modal',
            //控制器函数
            function ($scope, $stateParams, $modal) {
                /*-------------------数据定义开始------------------------*/
                $scope.data = {
                    currItem: {},
                    pId: $stateParams.pid,
                    km_level: $stateParams.km_level,
                    km_code: $stateParams.km_code,
                    km_type:$stateParams.km_type
                };

                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }
                        , {
                            field: 'fee_name',
                            headerName: '核算项目编码',
                            width: 150,
                        }
                        , {
                            field: 'warm_prompt',
                            headerName: '核算项目'
                        }
                    ]
                };

                /*-------------------通用查询结束---------------------*/
                controllerApi.run({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                //查询产品
                $scope.chooseCurrency = function () {
                    $modal.openCommonSearch({
                            classId:'base_currency'
                        })
                        .result//响应数据
                        .then(function(result){
                            $scope.data.currItem.currency_code = result.currency_code;
                            $scope.data.currItem.currency_name = result.currency_name;
                            $scope.data.currItem.base_currency_id = result.base_currency_id;
                        });
                };

                /**
                 * 新增时数据
                 * @param bizData
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.gl_account_subject_pid = $scope.data.pId;
                    bizData.km_level = $scope.data.km_level;
                    bizData.km_code = $scope.data.km_code;
                    bizData.km_type = $scope.data.km_type;
                    bizData.km_property = 1;
                    bizData.page_type = 1;
                    bizData.currency_code = 'CNY';
                    bizData.currency_name = '人民币';
                    bizData.base_currency_id = 1;
                };

                //隐藏标签页
                $scope.tabs.wf.hide = true;
                $scope.tabs.attach.hide = true;
                //修改标签页标题
                $scope.tabs.base.title = '会计科目';

                $scope.tabs.other = {
                    title: "其他"
                }

                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData); //继承基础控制器的方法，类似Java的super
                    //保存时默认科目名称和描述一致
                    bizData.km_name = $scope.data.currItem.km_desc;
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
