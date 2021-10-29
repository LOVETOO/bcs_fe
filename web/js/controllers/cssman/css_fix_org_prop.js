/**
 * Created by zhl on 2019/7/1.
 * 服务网点档案-属性 css_fix_org_prop
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
                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });

                /*-------------------定义模态框标签标题---------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
                $scope.tabs.item = {
                    title: '产品大类明细'
                };
                $scope.tabs.accept = {
                    title: '收货信息'
                };
                // $scope.tabs.treaty = {
                //     title: '网点协议历史记录'
                // }

               /**
                * 档案只读
                */
                $scope.isFormReadonly = function () {
                    return true;
                };

                /*----------------------------------表格定义开始-------------------------------------------*/

                // 产品大类
                $scope.gridOptions_item = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_class_name',
                        headerName: '产品大类',
                        width: 100,
                        editable: false
                    }]
                };

                // 收货地址
                $scope.gridOptions_accept = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'defaulted',
                        headerName: '默认地址',
                        type: '是否',
                        minWidth: 101,
                        editable: false
                    }, {
                        field: 'accept_man',
                        headerName: '收货人',
                        editable: false,
                        width: 100
                    }, {
                        field: 'accept_tel',
                        headerName: '收货电话',
                        editable: false,
                        width: 100
                    }, {
                        field: 'accept_province_area_name',
                        headerName: '收货地址所在省',
                        editable: false,
                        width: 130
                    }, {
                        field: 'accept_city_area_name',
                        headerName: '收货地址所在市',
                        editable: false,
                        width: 130
                    }, {
                        field: 'accept_county_area_name',
                        headerName: '收货地址所在区县',
                        editable: false,
                        width: 130
                    }, {
                        field: 'address',
                        headerName: '详细地址',
                        editable: false,
                        width: 130
                    }, {
                        field: 'note',
                        headerName: '备注',
                        editable: false,
                        width: 100
                    }]
                };

                /*----------------------------------表格定义结束-------------------------------------------*/

                /*-------------------数据处理---------------------*/
                //新增时：数据初始化
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.usable = 2;//默认可用
                    bizData.login_userid = strUserName;//默认当前登录用户
                };

                /**  
                 * 设置数据
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_accept.hcApi.setRowData(bizData.css_fix_org_acceptofcss_fix_orgs);
                    $scope.gridOptions_item.hcApi.setRowData(bizData.css_fix_org_classofcss_fix_orgs);
                }

                /*隐藏底部右边按钮*/
                $scope.footerRightButtons.save.hide = true;
                $scope.footerRightButtons.saveThenAdd.hide = true;

                /*-------------------通用查询---------------------*/

                //查询经销商
                $scope.commonSearchSettingOfCustomer = {
                    afterOk: function (result) {
                        $scope.data.currItem.customer_name = result.customer_name;
                        $scope.data.currItem.customer_code = result.customer_code;
                        $scope.data.currItem.customer_id = result.customer_id;
                    }
                };

                //查询网点角色
                $scope.commonSearchSettingOfScprole = {
                    afterOk: function (result) {
                        $scope.data.currItem.fixorg_roleid = result.roleid;
                        $scope.data.currItem.fixorg_rolename = result.rolename;
                    }
                };

                //查询网点
                $scope.commonSearchSettingOfFix = {
                    //上级网点
                    upper_fix: {
                        title: '上级网点',
                        sqlWhere: ' usable = 2 and fix_org_id <> ' + $scope.data.currItem.fix_org_id,
                        afterOk: function (result) {
                            $scope.data.currItem.supper_id = result.fix_org_id;
                            $scope.data.currItem.supper_code = result.fix_org_code;
                            $scope.data.currItem.supper_name = result.fix_org_name;
                        }
                    },
                    //配件申请受理网点
                    appeal_fix: {
                        title: '配件申请受理网点',
                        afterOk: function (result) {
                            $scope.data.currItem.appeal_fix_org_id = result.fix_org_id;
                            $scope.data.currItem.appeal_fix_org_code = result.fix_org_code;
                            $scope.data.currItem.appeal_fix_org_name = result.fix_org_name;
                        }
                    }

                };


                //查询机构（所属机构、受理机构）
                $scope.commonSearchSettingOfScporg = {
                    //所属机构
                    org: {
                        title: '所属营销中心',
                        afterOk: function (result) {
                            if (!result.code)
                                $scope.data.currItem.org_code = '该部门无编码';
                            else
                                $scope.data.currItem.org_code = result.code;
                            $scope.data.currItem.org_id = result.orgid;
                            $scope.data.currItem.org_name = result.orgname;

                        }
                    },
                    //配件申请受理机构
                    appeal_org: {
                        title: '受理机构',
                        afterOk: function (result) {
                            if (!result.code)
                                $scope.data.currItem.appeal_org_code = '该部门无编码';
                            else
                                $scope.data.currItem.appeal_org_code = result.code;
                            $scope.data.currItem.appeal_org_id = result.orgid;
                            $scope.data.currItem.appeal_org_name = result.orgname;
                        }
                    },
                    //预算机构
                    budget_org: {
                        title: '预算机构',
                        afterOk: function (result) {
                            if (!result.code)
                                $scope.data.currItem.belong_org_code = '该部门无编码';
                            else
                                $scope.data.currItem.belong_org_code = result.code;
                            $scope.data.currItem.belong_org_id = result.orgid;
                            $scope.data.currItem.belong_org_name = result.orgname;
                        }
                    },
                    //二级分部
                    sub_org: {
                        title: '二级分部',
                        afterOk: function (result) {
                            if (!result.code)
                                $scope.data.currItem.sub_org_code = '该部门无编码';
                            else
                                $scope.data.currItem.sub_org_code = result.code;
                            $scope.data.currItem.sub_org_id = result.orgid;
                            $scope.data.currItem.sub_org_name = result.orgname;
                        }
                    }
                };

                //查区域（所属区域、辐射区域、省份、开户行省、城市、开户行市、区县）
                $scope.commonSearchSettingOfArea = {
                    //所属区域
                    area: {
                        title: '所属区域',
                        afterOk: function (result) {
                            $scope.data.currItem.area_id = result.areaid;
                            $scope.data.currItem.area_code = result.areacode;
                            $scope.data.currItem.area_name = result.areaname;
                        }
                    },
                    //维修区域
                    relation_area: {
                        title: '维修区域',
                        afterOk: function (result) {
                            $scope.data.currItem.relation_area_id = result.areaid;
                            $scope.data.currItem.relation_area_code = result.areacode;
                            $scope.data.currItem.relation_area_name = result.areaname;
                        }
                    },
                    //安装区域
                    inst_relation_area: {
                        title: '安装区域',
                        afterOk: function (result) {
                            $scope.data.currItem.inst_relation_area_ids = result.areacode;
                            $scope.data.currItem.inst_relation_area_names = result.areaname;
                        }
                    },
                    //管理区域
                    manage_relation_area: {
                        title: '管理区域',
                        afterOk: function (result) {
                            $scope.data.currItem.manage_relation_area_ids = result.areacode;
                            $scope.data.currItem.manage_relation_area_names = result.areaname;
                        }
                    },
                    //省份
                    province: {
                        title: '省份',
                        sqlWhere: ' areatype = 4 ',
                        afterOk: function (result) {
                            $scope.data.currItem.province_area_id = result.areaid;
                            $scope.data.currItem.province_area_code = result.areacode;
                            $scope.data.currItem.province_area_name = result.areaname;
                        }
                    },
                    bank_province: {
                        title: '开户行省份',
                        sqlWhere: ' areatype = 4 ',
                        afterOk: function (result) {
                            $scope.data.currItem.bank_province_area_id = result.areaid;
                            $scope.data.currItem.bank_province_area_code = result.areacode;
                            $scope.data.currItem.bank_province_area_name = result.areaname;
                        }
                    },
                    //城市
                    city: {
                        title: '城市',
                        beforeOpen: function () {
                            if (!$scope.data.currItem.province_area_id) {
                                swalApi.info('请先选择省份');
                                return false;
                            }
                        },
                        sqlWhere: function () {
                            return ' areatype = 5 and superid = ' + $scope.data.currItem.province_area_id;
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.city_area_id = result.areaid;
                            $scope.data.currItem.city_area_code = result.areacode;
                            $scope.data.currItem.city_area_name = result.areaname;
                        }
                    },
                    bank_city: {
                        title: '开户行市',
                        beforeOpen: function () {
                            if (!$scope.data.currItem.bank_province_area_id) {
                                swalApi.info('请先选择开户行省');
                                return false;
                            }
                        },
                        sqlWhere: function () {
                            return ' areatype = 5 and superid = ' + $scope.data.currItem.bank_province_area_id;
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.bank_city_area_id = result.areaid;
                            $scope.data.currItem.bank_city_area_code = result.areacode;
                            $scope.data.currItem.bank_city_area_name = result.areaname;
                        }
                    },
                    //区县
                    county: {
                        title: '区县',
                        beforeOpen: function () {
                            if (!$scope.data.currItem.province_area_id || !$scope.data.currItem.city_area_id) {
                                swalApi.info('请先选择省份和城市');
                                return false;
                            }
                        },
                        sqlWhere: function () {
                            return ' areatype = 6 and superid = ' + $scope.data.currItem.city_area_id;
                        },
                        afterOk: function (result) {
                            $scope.data.currItem.county_area_id = result.areaid;
                            $scope.data.currItem.county_area_code = result.areacode;
                            $scope.data.currItem.county_area_name = result.areaname;
                        }
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