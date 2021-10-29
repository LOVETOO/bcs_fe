/**
 * 预算调整 （旧)-属性页
 * 2018-10-11
 */
define(
    ['module', 'controllerApi', 'fin_bud_adjust_prop'],
    function (module, controllerApi, base_obj_prop) {
        'use strict';

        var controller = [
                //声明依赖注入
                '$scope', '$stateParams', '$modal',
                //控制器函数
                function ($scope, $stateParams, $modal) {

                    /*-------------------数据定义开始------------------------*/
                    $scope.data = {};
                    $scope.data.currItem = {
                        item_org_id: $stateParams.id,
                        created_by: strUserId,
                        creation_date: new Date().Format('yyyy-MM-dd hh:mm:ss'),
                        last_updated_by: strUserId,
                        last_update_date: new Date().Format('yyyy-MM-dd hh:mm:ss'),

                        is_stock: 2,
                        item_usable: 2,
                        is_retail: 2,
                        can_sale: 2
                    };

                    /*-------------------数据定义结束------------------------*/

                    $scope.lineColumns = {
                        columnDefs: [
                            {
                                type: '序号'
                            }, {
                                headerName: "调整类型",
                                id: "style",
                                field: "style",
                                hcDictCode: 'style'
                            }, {
                                headerName: "调整金额",
                                id: "adjust_amt",
                                field: "adjust_amt"
                            }, {
                                headerName: "预算期间",
                                id: "dname",
                                field: "dname"
                            }, {
                                headerName: "预算类别编码",
                                id: "bud_type_code",
                                field: "bud_type_code"
                            }, {
                                headerName: "预算类别名称",
                                id: "bud_type_name",
                                field: "bud_type_name"
                            }, {
                                headerName: "费用项目编码",
                                id: "object_code",
                                field: "object_code"
                            }, {
                                headerName: "费用项目名称",
                                id: "object_name",
                                field: "object_name",
                            }, {
                                headerName: "费用对象类别",
                                id: "object_type",
                                field: "object_type",
                            }, {
                                headerName: "机构编码",
                                id: "org_code",
                                field: "org_code",
                            }, {
                                headerName: "机构名称",
                                id: "org_name",
                                field: "org_name"
                            },
                        ],
                        hcClassId: 'fin_bud_adjust_header',
                        hcBeforeRequest: function (searchObj) {
                            searchObj.searchflag = 1;
                        }

                    };
                    /*-------------------网格定义 结束------------------------*/


                    /*-------------------通用查询开始------------------------*/
                    //查产品
                    $scope.chooseDept = function () {
                        $modal.openCommonSearch({
                                classId: 'dept'
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.dept_id = result.dept_id;
                                $scope.data.currItem.dept_code = result.dept_code;
                                $scope.data.currItem.dept_name = result.dept_name;
                            });
                    };

                    //查用户
                    $scope.chooseUser = function () {
                        $modal.openCommonSearch({
                                classId: 'base_view_erpemployee_org'
                            })
                            .result//响应数据
                            .then(function (result) {
                                $scope.data.currItem.buyer_id = result.employee_id;
                                $scope.data.currItem.buyer_code = result.employee_code;
                                $scope.data.currItem.buyer_name = result.employee_name;
                            });
                    };
                    /*-------------------通用查询结束---------------------*/

                    controllerApi.run({
                        controller: base_obj_prop.controller,
                        scope: $scope
                    });

                    //隐藏标签页
                    $scope.tabs.wf.hide = true;
                    $scope.tabs.attach.hide = true;

                    //修改标签页标题
                    $scope.tabs.base.title = '基本信息';

                    //增加标签页-配件属性、电商属性、其他
                    $scope.tabs.wfins = {
                        title: '审核流程'
                    };
                }
            ]
            ;

//使用控制器Api注册控制器
//需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: controller
        });
    }
)
;
