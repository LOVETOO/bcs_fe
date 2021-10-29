/**
 * Created by tsl on 2019/7/8.
 * 网点开户申请 css_fix_org_apply_list
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope',
            //控制器函数
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'stat',
                        headerName: '单据状态',
                        hcDictCode:'stat'
                    },{
                        field: 'fix_org_code',
                        headerName: '网点编码',
                        pinned: 'left'
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称',
                        pinned: 'left'
                    }, {
                        field: 'creator',
                        headerName: '档案创建人'
                    }, {
                        field: 'supper_code',
                        headerName: '上级网点编码'
                    }, {
                        field: 'supper_name',
                        headerName: '上级网点名称'
                    }, {
                        field: 'fix_org_type',
                        headerName: '网点类型',
                        hcDictCode: 'service_store_type'
                    }, {
                        field: 'fix_org_class',
                        headerName: '网点级别',
                        hcDictCode: 'service_store_level'
                    }, {
                        field: 'fix_org_step',
                        headerName: '服务等级',
                        hcDictCode: 'service_level'
                    }, {
                        field: 'shop_no',
                        headerName: '门店编号'
                    }, {
                        field: 'star_class',
                        headerName: '网点星级',
                        hcDictCode: 'star_level'
                    },{
                        field: 'licenceno',
                        headerName: '协议编号'
                    }, {
                        field: 'org_code',
                        headerName: '营销中心编码'
                    }, {
                        field: 'org_name',
                        headerName: '营销中心名称'
                    }, {
                        field: 'province_area_name',
                        headerName: '省份'
                    }, {
                        field: 'city_area_name',
                        headerName: '地市'
                    }, {
                        field: 'county_area_name',
                        headerName: '区县'
                    }, {
                        field: 'address',
                        headerName: '办公地址'
                    }, {
                        field: 'post_code',
                        headerName: '邮编'
                    }, {
                        field: 'tele',
                        headerName: '短信号码'
                    }, {
                        field: 'fax',
                        headerName: '传真'
                    }, {
                        field: 'email',
                        headerName: '电子邮箱'
                    }, {
                        field: 'jingdu',
                        headerName: '经度'
                    }, {
                        field: 'weidu',
                        headerName: '纬度'
                    }, {
                        field: 'min_settlefee',
                        headerName: '补助费用'
                    }, {
                        field: 'is_allotbyself',
                        headerName: '允许自行接单',
                        type: '是否'
                    }, {
                        field: 'hot_tel',
                        headerName: '服务热线'
                    }, {
                        field: 'manager',
                        headerName: '负责人'
                    }, {
                        field: 'bank',
                        headerName: '开户银行'
                    }, {
                        field: 'bank_no',
                        headerName: '银行行号'
                    }, {
                        field: 'accno_name',
                        headerName: '开户名称'
                    }, {
                        field: 'bank_accno',
                        headerName: '银行账号'
                    }, {
                        field: 'bank_province_area_code',
                        headerName: '开户行所在省编码'
                    }, {
                        field: 'bank_province_area_name',
                        headerName: '开户行所在省名称'
                    }, {
                        field: 'bank_city_area_code',
                        headerName: '开户行所在市编码'
                    }, {
                        field: 'bank_city_area_name',
                        headerName: '开户行所在市名称'
                    }, {
                        field: 'settle_week',
                        headerName: '结算周期'
                    }, {
                        field: 'customer_code',
                        headerName: '经销商编码'
                    }, {
                        field: 'customer_name',
                        headerName: '经销商名称'
                    }, {
                        field: 'accept_man',
                        headerName: '收货人'
                    }, {
                        field: 'accept_address',
                        headerName: '收货地址'
                    }, {
                        field: 'accept_tel',
                        headerName: '收货电话'
                    }, {
                        field: 'relation_area_id',
                        headerName: '维修区域ID'
                    }, {
                        field: 'relation_area_name',
                        headerName: '维修区域名称 '
                    }, {
                        field: 'inst_relation_area_ids',
                        headerName: '安装区域id'
                    }, {
                        field: 'inst_relation_area_names',
                        headerName: '安装区域名称'
                    }, {
                        field: 'manage_relation_area_ids',
                        headerName: '管理区域id'
                    }, {
                        field: 'manage_relation_area_names',
                        headerName: '管理区域名称'
                    }, {
                        field: 'appeal_desc',
                        headerName: '派工说明'
                    }, {
                        field: 'appeal_org_code',
                        headerName: '配件申请受理机构编码'
                    }, {
                        field: 'appeal_org_name',
                        headerName: '配件申请受理机构名称'
                    }, {
                        field: 'appeal_fix_org_code',
                        headerName: '配件申请受理网点编码'
                    }, {
                        field: 'appeal_fix_org_name',
                        headerName: '配件申请受理网点名称'
                    }, {
                        field: 'is_changeappeal',
                        headerName: '配件申请时可更改受理机构',
                        type: '是否'
                    }, {
                        field: 'isreduce',
                        headerName: '暂停付款',
                        type: '是否'
                    }, {
                        field: 'is_cd',
                        headerName: '撤点',
                        type: '是否'
                    }, {
                        field: 'licenceno',
                        headerName: '营业执照号码'
                    },{
                        field: 'area_code',
                        headerName: '所属区域编码'
                    }, {
                        field: 'area_name',
                        headerName: '所属区域名称'
                    }, {
                        field: 'belong_org_code',
                        headerName: '预算所属机构编码'
                    }, {
                        field: 'belong_org_name',
                        headerName: '预算所属机构名称'
                    }, {
                        field: 'xy_start_date',
                        headerName: '协议开始日期'
                    }, {
                        field: 'xy_end_date',
                        headerName: '协议结束日期'
                    }, {
                        field: 'last_settle_date',
                        headerName: '最新结算日期'
                    }, {
                        field: 'last_bill_date',
                        headerName: '最迟结算单据维修日期'
                    }, {
                        field: 'eanble_appeal',
                        headerName: '接受派工',
                        type: '是否'
                    }, {
                        field: 'is_hx',
                        headerName: '暂停配件核销',
                        type: '是否'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'update_time',
                        headerName: '修改时间'
                    }, {
                        field: 'updator',
                        headerName: '修改人'
                    }, {
                        field: 'sub_org_code',
                        headerName: '二级分部编码'
                    }, {
                        field: 'sub_org_name',
                        headerName: '二级分部名称'
                    }]
                };

                controllerApi.extend({
                    controller: base_obj_list.controller,
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
