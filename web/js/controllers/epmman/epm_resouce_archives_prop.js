/**
 * 人员证照属性表
 * Created by sgc
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi'],
    function (module, controllerApi, base_obj_prop, swalApi) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                /*----------------------------------定义数据-------------------------------------------*/
                $scope.data = {
                    currItem: {}
                };

                //继承控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------通用查询-------------------------------------------*/
                /**
                 * 绩效考核方案 查询
                 */
                $scope.commonSearchSettingOfDept = {
                    title : '所属部门',
                    gridOptions:{
                        columnDefs:[
                            {
                                headerName: "部门编码",
                                field: "code"
                            },{
                                headerName: "部门名称",
                                field: "orgname"
                            }
                        ]
                    },
                    sqlWhere : ' is_contract_unit <> 2 ',
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.orgid;
                        $scope.data.currItem.org_name = result.orgname;
                    }
                };
                /**
                 * 保管人 查询
                 */
                $scope.commonSearchSettingOfKeeper = {
                    afterOk: function (result) {
                        $scope.data.currItem.keeper_name = result.username;
                        $scope.data.currItem.keeper = result.sysuserid;
                    }
                };
                /**
                 * 证书类别 查询
                 */
                $scope.commonSearchSettingOfResouceCategory = {
                    postData: {
                        search_flag: 1,
                        resouce_type: 2
                    },
                    title: "证照类别",
                    dataRelationName: 'epm_resouce_archivess',
                    gridOptions: {
                        columnDefs: [
                            {
                                headerName: "证照类别编码",
                                field: "resouce_category_code"
                            }, {
                                headerName: "证照类别名称",
                                field: "resouce_category_name"
                            }
                        ]
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.resouce_category_id = result.resouce_category_id;
                        $scope.data.currItem.resouce_category_name = result.resouce_category_name;
                    }
                };

                /**
                 * 校验身份证
                 */
                $scope.checkIdcard = function () {
                    var idcard = $scope.data.currItem.idcard;
                    if (idcard.length < 18) {
                        swalApi.info('请正确输入18位身份证号');
                        return;
                    }
                    var reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

                    if (!reg.test(idcard)) {
                        swalApi.info('请正确输入18位身份证号');
                        return;
                    }
                    var sex = idcard.charAt(16);
                    if (sex % 2 == 1) {
                        $scope.data.currItem.sex = 1;
                    }
                    if (sex % 2 == 0) {
                        $scope.data.currItem.sex = 2;
                    }
                };
                /**
                 * 检验电话号码
                 */
                $scope.checkPhone = function () {
                    var phone = $scope.data.currItem.phone;
                    if ((!/^1[3|4|5|7|8|9]\d{9}$/.test(phone)) &&
                        (!/^((\(?0[1-9]\d{1,2}\)?(-?|\\s{0,1}))|(0[1-9]\d{1,2}(-?|\\s{0,1})))?\d{7,8}$/.test(phone))) {
                        $scope.data.currItem.phone = '';
                        return swalApi.info("请正确输入电话号码");
                    }
                };

                /**
                 * 失效日期、生效日期校验
                 */
                $scope.setSubtractDays = function () {
                    var exp_date = new Date($scope.data.currItem.exp_date).getTime();
                    var effective_date = new Date($scope.data.currItem.effective_date).getTime();
                    var subtract_days = exp_date - effective_date;
                    if (parseInt(subtract_days / 1000 / 60 / 60 / 24) < 0) {
                        swalApi.info("失效日期必须大于生效日期");
                        $scope.data.currItem.exp_date = '';
                        $scope.data.currItem.effective_date = '';
                    }
                };
                /**
                 * 新增时初始化数据
                 */
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData($scope.data.currItem = bizData);
                    bizData.is_usable = 2;
                    bizData.resouce_type = 2;
                    bizData.stat = '在库';
                };

                /**
                 * 查看时设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    bizData.is_usable = $scope.data.currItem.is_usable;
                    bizData.resouce_type = 2;
                };

                /*隐藏底部右边边按钮*/
                $scope.footerRightButtons.saveThenAdd.hide = true;
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