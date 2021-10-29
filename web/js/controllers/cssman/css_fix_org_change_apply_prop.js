/**
 * Created by tsl on 2019/7/10
 * 网点变更申请-属性 css_fix_org_change_apply_prop
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'swalApi', 'requestApi', 'dateApi', '$modal', 'loopApi'],
    function (module, controllerApi, base_obj_prop, swalApi, requestApi, dateApi, $modal, loopApi) {
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

                /*----------------------------------表格定义开始-------------------------------------------*/

                // 产品大类
                $scope.gridOptions_item = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'item_class_name',
                        headerName: '产品大类',
                        width: 100,
                        onCellDoubleClicked: function (args) {
                            $scope.selectItem(args);
                        }
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
                        editable: true,
                        suppressSizeToFit: false,
                        minWidth: 101,
                        onCellValueChanged: function (args) {
                            if (args.newValue === args.oldValue)
                                return;
                            $scope.onDefaultedChange(args);
                        }
                    }, {
                        field: 'accept_man',
                        headerName: '收货人',
                        editable: true,
                        width: 100
                    }, {
                        field: 'accept_tel',
                        headerName: '收货电话',
                        editable: true,
                        width: 100
                    }, {
                        field: 'accept_province_area_name',
                        headerName: '收货地址所在省',
                        editable: true,
                        width: 130,
                        onCellDoubleClicked: function (args) {
                            $scope.selectAccept(args);
                        }
                    }, {
                        field: 'accept_city_area_name',
                        headerName: '收货地址所在市',
                        editable: true,
                        width: 130,
                        onCellDoubleClicked: function (args) {
                            $scope.selectAccept(args);
                        }
                    }, {
                        field: 'accept_county_area_name',
                        headerName: '收货地址所在区县',
                        editable: true,
                        width: 130,
                        onCellDoubleClicked: function (args) {
                            $scope.selectAccept(args);
                        }
                    }, {
                        field: 'address',
                        headerName: '详细地址',
                        editable: true,
                        width: 130
                    },{
                        field: 'note',
                        headerName: '备注',
                        editable: true,
                        width: 100
                    }]
                };

                /*----------------------------------表格定义结束-------------------------------------------*/

                /*-------------------数据处理---------------------*/
                //新增时：数据初始化
                $scope.newBizData = function (bizData) {
                    $scope.hcSuper.newBizData(bizData);
                    bizData.usable = 2;//默认可用
                    bizData.stat = 1;//默认制单状态
                    bizData.create_time = dateApi.today();//取当前时间
                    bizData.css_fix_org_apply_classofcss_fix_org_applys = []; // 产品大类明细
                    bizData.css_fix_org_change_acceptofcss_fix_org_change_applys = []; // 收货地址明细
                };

                /**
                 * 查看时: 数据初始化
                 */
                $scope.setBizData = function (bizData) {
                    $scope.hcSuper.setBizData(bizData);
                    $scope.gridOptions_item.hcApi.setRowData(bizData.css_fix_org_change_classofcss_fix_org_change_applys);
                    $scope.gridOptions_accept.hcApi.setRowData(bizData.css_fix_org_change_acceptofcss_fix_org_change_applys);
                    $scope.data.currItem.objattachs = bizData.objattachs;
                }

                /**
                 * 保存前的数据处理
                 */
                $scope.saveBizData = function (bizData) {
                    $scope.hcSuper.saveBizData(bizData);
                    bizData.css_fix_org_change_acceptofcss_fix_org_change_applys.forEach(function (item, index) {
                        item.fix_org_id = $scope.data.currItem.fix_org_id;
                        item.fix_org_code = $scope.data.currItem.fix_org_code;
                        item.fix_org_name = $scope.data.currItem.fix_org_name;
                    });
                };

                /*----------------------------------按钮方法 定义-------------------------------------------*/
                //添加收货地址
                $scope.add_accept = function () {
                    $scope.gridOptions_accept.api.stopEditing();
                    if ($scope.tabs.accept.active == true) {
                        //基本信息’"
                        var line = {
                            defaulted: $scope.data.currItem.defaulted
                        };

                        //判断是否已有地址明细
                        var addresses_length = $scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys.length;

                        //判断是否所有地址明细都不是默认地址
                        var lines = $scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys.slice(0);
                        var allDinied = true;
                        if (lines.length) {
                            loopApi.forLoop(lines.length, function (i) {
                                if (lines[i].defaulted == 2)
                                    allDinied = false;
                            });
                        }

                        //当没有地址明细时或者全部明细都不是默认地址，新增行为默认地址
                        addresses_length == 0 || allDinied ? line.defaulted = 2 : line.defaulted = 1;

                        $scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys.push(line);
                        $scope.gridOptions_accept.hcApi.setRowData($scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys);
                    }
                };
                /**
                 * 删除行收货地址
                 */
                $scope.del_accept = function () {
                    var idx = $scope.gridOptions_accept.hcApi.getFocusedRowIndex();
                    if (idx < 0) {
                        swalApi.info('请选中要删除的行');
                    } else {
                        $scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys.splice(idx, 1);
                        $scope.gridOptions_accept.hcApi.setRowData($scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys);
                    }
                };

                /**
                 * 添加产品大类
                 */
                $scope.add_item = function () {
                    $scope.gridOptions_item.api.stopEditing();
                    var line = {};
                    $scope.data.currItem.css_fix_org_apply_classofcss_fix_org_applys.push(line);
                    $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.css_fix_org_apply_classofcss_fix_org_applys);
                }

                /**
                 * 删除产品大类
                 */
                $scope.del_item = function () {
                   var idx = $scope.gridOptions_item.hcApi.getFocusedRowIndex();
                   if(idx < 0){
                       swalApi.info('请选择要删除的行');
                   }else{
                       $scope.data.currItem.css_fix_org_apply_classofcss_fix_org_applys.splice(idx,1);
                       $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.css_fix_org_apply_classofcss_fix_org_applys);
                   }
                }

                /*----------------------------------按钮及标签 定义-------------------------------------------*/
                /*底部左边按钮*/
                $scope.footerLeftButtons.addRow.click = function () {
                    if ($scope.tabs.accept.active) {//收货地址
                        $scope.add_accept && $scope.add_accept();
                    }
                    else if ($scope.tabs.item.active) {//产品大类
                        $scope.add_item && $scope.add_item();
                    }
                };

                $scope.footerLeftButtons.addRow.hide = function () {
                    if (!$scope.tabs.accept.active && !$scope.tabs.item.active) {
                        return true;
                    }
                }

                $scope.footerLeftButtons.deleteRow.click = function () {
                    if ($scope.tabs.accept.active) {//收货地址
                        $scope.del_accept && $scope.del_accept();
                    }
                    else if ($scope.tabs.item.active) {//产品大类
                        $scope.del_item && $scope.del_item();
                    }
                };

                $scope.footerLeftButtons.deleteRow.hide = function () {
                    if (!$scope.tabs.accept.active && !$scope.tabs.item.active) {
                        return true;
                    }
                }
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
                    //变更网点
                    change_fix: {
                        title: '变更网点',
                        /*sqlWhere:'userable = 2',*/
                        afterOk: function (result) {
                            $scope.data.currItem.fix_org_id = result.fix_org_id;
                            $scope.data.currItem.fix_org_code = result.fix_org_code;
                            $scope.data.currItem.fix_org_name = result.fix_org_name;
                            $scope.data.currItem.fix_org_type = result.fix_org_type;
                            $scope.data.currItem.fix_org_class = result.fix_org_class;
                            $scope.data.currItem.fixorg_username = result.fixorg_username;
                            $scope.data.currItem.old_fix_org_name = result.fix_org_name;
                            $scope.data.currItem.old_fix_org_type = result.fix_org_type;
                            $scope.data.currItem.old_fix_org_class = result.fix_org_class;
                            $scope.data.currItem.star_class = result.star_class;
                            $scope.data.currItem.org_id = result.org_id;
                            $scope.data.currItem.org_code = result.org_code;
                            $scope.data.currItem.org_name = result.org_name;
                            $scope.data.currItem.hot_tel = result.hot_tel;
                            $scope.data.currItem.tele = result.tele;
                            $scope.data.currItem.star_class = result.star_class;
                            $scope.data.currItem.supper_code = result.supper_code;
                            $scope.data.currItem.supper_name = result.supper_name;
                            $scope.data.currItem.post_code = result.post_code;
                            $scope.data.currItem.fax = result.fax;
                            $scope.data.currItem.licenceno = result.licenceno;
                            $scope.data.currItem.customer_code = result.customer_code;
                            $scope.data.currItem.customer_name = result.customer_name;
                            $scope.data.currItem.fix_org_step = result.fix_org_step;
                            $scope.data.currItem.fix_org_mode = result.fix_org_mode;
                            $scope.data.currItem.manager = result.manager;
                            $scope.data.currItem.address = result.address;
                            $scope.data.currItem.sub_org_code = result.sub_org_code;
                            $scope.data.currItem.sub_org_name = result.sub_org_name;
                            $scope.data.currItem.allot_class = result.allot_class;
                            $scope.data.currItem.email = result.email;
                            $scope.data.currItem.appeal_desc = result.appeal_desc;
                            $scope.data.currItem.jingdu = result.jingdu;
                            $scope.data.currItem.weidu = result.weidu;
                            $scope.data.currItem.min_settlefee = result.min_settlefee;
                            $scope.data.currItem.is_allotbyself = result.is_allotbyself;
                            $scope.data.currItem.note = result.note;
                            $scope.data.currItem.usable = result.usable;
                            $scope.data.currItem.eanble_appeal = result.eanble_appeal;
                            $scope.data.currItem.is_asia = result.is_asia;
                            $scope.data.currItem.allow_furway = result.allow_furway;
                            $scope.data.currItem.allow_dispatch = result.allow_dispatch;
                            $scope.data.currItem.allow_discount = result.allow_discount;
                            $scope.data.currItem.isreduce = result.isreduce;
                            $scope.data.currItem.is_hx = result.is_hx;
                            $scope.data.currItem.css_item_sale_type1 = result.css_item_sale_type1;
                            $scope.data.currItem.css_item_sale_type2 = result.css_item_sale_type2;
                            $scope.data.currItem.css_item_sale_type3 = result.css_item_sale_type3;
                            $scope.data.currItem.belong_org_code = result.belong_org_code;
                            $scope.data.currItem.belong_org_name = result.belong_org_name;
                            $scope.data.currItem.bank = result.bank;
                            $scope.data.currItem.accno_name = result.accno_name;
                            $scope.data.currItem.bank_province_area_code = result.bank_province_area_code;
                            $scope.data.currItem.bank_province_area_name = result.bank_province_area_name;
                            $scope.data.currItem.bank_accno = result.bank_accno;
                            $scope.data.currItem.bank_no = result.bank_no;
                            $scope.data.currItem.bank_city_area_code = result.bank_city_area_code;
                            $scope.data.currItem.bank_city_area_name = result.bank_city_area_name;
                            $scope.data.currItem.last_settle_date = result.last_settle_date;
                            $scope.data.currItem.settle_week = result.settle_week;
                            $scope.data.currItem.last_bill_date = result.last_bill_date;
                            $scope.data.currItem.appeal_org_code = result.appeal_org_code;
                            $scope.data.currItem.appeal_org_name = result.appeal_org_name;
                            $scope.data.currItem.appeal_fix_org_code = result.appeal_fix_org_code;
                            $scope.data.currItem.appeal_fix_org_name = result.appeal_fix_org_name;
                            $scope.data.currItem.is_changeappeal = result.is_changeappeal;
                            $scope.data.currItem.province_area_code = result.province_area_code;
                            $scope.data.currItem.province_area_name = result.province_area_name;
                            $scope.data.currItem.city_area_code = result.city_area_code;
                            $scope.data.currItem.city_area_name = result.city_area_name;
                            $scope.data.currItem.county_area_code = result.county_area_code;
                            $scope.data.currItem.county_area_name = result.county_area_name;
                            $scope.data.currItem.area_code = result.area_code;
                            $scope.data.currItem.area_name = result.area_name;
                            $scope.data.currItem.shop_no = result.shop_no;
                            $scope.data.currItem.treaty_no = result.treaty_no;
                            $scope.data.currItem.xy_start_date = result.xy_start_date;
                            $scope.data.currItem.xy_end_date = result.xy_end_date;
                            $scope.data.currItem.agent_type = result.agent_type;
                            $scope.data.currItem.county_area_name = result.county_area_name;
                            $scope.data.currItem.fix_org_type_hd = result.fix_org_type_hd;
                            $scope.data.currItem.fixorg_rolename = result.fixorg_rolename;
                            requestApi.post('css_fix_org', 'select', { fix_org_id: $scope.data.currItem.fix_org_id })
                                .then(function (response) {
                                    $scope.data.currItem.css_fix_org_change_classofcss_fix_org_change_applys = response.css_fix_org_classofcss_fix_orgs;
                                    $scope.gridOptions_item.hcApi.setRowData($scope.data.currItem.css_fix_org_change_classofcss_fix_org_change_applys);
                                    $scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys = response.css_fix_org_acceptofcss_fix_orgs;
                                    $scope.gridOptions_accept.hcApi.setRowData($scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys);
                                    $scope.data.currItem.objattachs = response.objattachs;
                                })
                        }
                    },
                    //上级网点
                    upper_fix: {
                        title: '上级网点',
                        afterOk: function (result) {
                            $scope.data.currItem.supper_id = result.fix_org_id;
                            $scope.data.currItem.supper_code = result.fix_org_code;
                            $scope.data.currItem.supper_name = result.fix_org_name;
                        }
                    }, //上级网点
                    p_agent: {
                        title: '上级代理网点',
                        afterOk: function (result) {
                            $scope.data.currItem.p_agent_fixorg_code = result.fix_org_id;
                            $scope.data.currItem.p_agent_fixorg_code = result.fix_org_code;
                            $scope.data.currItem.p_agent_fixorg_code = result.fix_org_name;
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

                //查询受理网点
                $scope.commonSearchSettingOfMktTerminal = {
                    afterOk: function (result) {
                        $scope.data.currItem.appeal_fix_org_name = result.org_name;
                        $scope.data.currItem.appeal_fix_org_code = result.org_code;
                        $scope.data.currItem.appeal_fix_org_id = result.org_id;
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

                /**
                 * 产品大类查询
                 */
                $scope.selectItem = function (args) {
                    $scope.gridOptions_item.api.stopEditing();
                    $modal.openCommonSearch({
                        classId: 'item_class',
                        postData: {
                            item_usable: 2,
                            item_class_level: 2
                        }
                    })
                        .result// 响应数据
                        .then(function (response) {
                            args.data.item_class_name = response.item_class_name;
                            args.data.item_class = response.item_class_id;
                            args.data.item_class_code = response.item_class_code;
                            $scope.gridOptions_item.api.refreshView(); 
                        });
                }

                /**
                 * 收货地址省市区查询
                 */
                $scope.selectAccept = function (args) {
                    $scope.gridOptions_accept.api.stopEditing();
                    $modal.openCommonSearch({
                        classId: 'scparea',
                        postData: {
                            search_flag: 99,
                            superid: -1
                        }
                    })
                        .result//响应数据
                        .then(function (res) {
                            args.data.accept_province_area_name = res.areaname;//省名称
                            args.data.accept_province_area_id = res.areaid;
                            args.data.accept_province_area_code = res.areacode;
                            $modal.openCommonSearch({
                                classId: 'scparea',
                                postData: {
                                    search_flag: 99,
                                    superid: res.areaid
                                },
                                action: 'search',
                                title: "所属市选择",
                                gridOptions: {
                                    columnDefs: [
                                        {
                                            headerName: "所属市名称",
                                            field: "areaname"
                                        }, {
                                            headerName: "区号",
                                            field: "telzone"
                                        }
                                    ]
                                }
                            })
                                .result//响应数据
                                .then(function (result) {
                                    args.data.accept_city_area_name = result.areaname;//市名称
                                    args.data.accept_city_area_id = result.areaid;
                                    args.data.accept_city_area_code = result.areacode;
                                    return result.areaid
                                }, function (line) {
                                    if (line == "头部关闭") {//中途关闭查询则清空
                                        args.data.accept_province_area_name = undefined;
                                        args.data.accept_city_area_name = undefined;
                                        args.data.accept_county_area_name = undefined;
                                        $scope.gridOptions_accept.api.refreshCells({
                                            rowNodes: [args.node],
                                            force: true,//改变了值才进行刷新
                                            columns: $scope.gridOptions_accept.columnApi.getColumns(['accept_province_area_name'
                                                , 'accept_city_area_name', 'accept_county_area_name'])
                                        });
                                        return -99;
                                    }
                                }).then(function (id) {
                                    if (id == -99) {
                                        return;
                                    }
                                    $modal.openCommonSearch({
                                        classId: 'scparea',
                                        postData: {
                                            search_flag: 99,
                                            superid: id
                                        },
                                        action: 'search',
                                        title: "所属区选择",
                                        gridOptions: {
                                            columnDefs: [
                                                {
                                                    headerName: "所属区名称",
                                                    field: "areaname"
                                                }, {
                                                    headerName: "区号",
                                                    field: "telzone"
                                                }
                                            ]
                                        }
                                    }).result//响应数据
                                        .then(function (results) {
                                            args.data.accept_county_area_name = results.areaname;//区名称
                                            args.data.accept_county_area_id = results.areaid;
                                            args.data.accept_county_area_code = results.areacode;
                                            $scope.gridOptions_accept.api.refreshCells({
                                                rowNodes: [args.node],
                                                force: true,//改变了值才进行刷新
                                                columns: $scope.gridOptions_accept.columnApi.getColumns(['accept_province_area_name'
                                                    , 'accept_city_area_name', 'accept_county_area_name'])
                                            });
                                        }, function (line) {
                                            if (line == "头部关闭") {
                                                args.data.accept_province_area_name = undefined;
                                                args.data.accept_city_area_name = undefined;
                                                args.data.accept_county_area_name = undefined;
                                                $scope.gridOptions_accept.api.refreshCells({
                                                    rowNodes: [args.node],
                                                    force: true,//改变了值才进行刷新
                                                    columns: $scope.gridOptions_accept.columnApi.getColumns(['accept_province_area_name'
                                                        , 'accept_city_area_name', 'accept_county_area_name'])
                                                });
                                            }
                                        })
                                });
                        });
                };

                //网格"默认送货地址"变更事件
                $scope.onDefaultedChange = function (args) {
                    if (args.data.defaulted == 1)
                        return;

                    var lines = $scope.data.currItem.css_fix_org_change_acceptofcss_fix_org_change_applys.slice(0);
                    var rowIndex = args.node.rowIndex;//发生改变的行的索引

                    if (lines.length > 0) {
                        loopApi.forLoop(lines.length, function (i) {
                            //不是正在修改行，且默认地址为“是”
                            if (i != rowIndex && lines[i].defaulted == 2) {
                                lines[i].defaulted = 1;
                            }
                        });
                    }

                    $scope.gridOptions_accept.hcApi.setRowData(lines);
                }

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