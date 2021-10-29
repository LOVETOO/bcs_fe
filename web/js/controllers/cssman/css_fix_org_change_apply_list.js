/**
 * Created by tsl on 2019/7/9.
 * 网点变更申请 css_fix_org_change_apply_list
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
                        headerName: '状态',
                        hcDictCode:'stat'
                    }, {
                        field: 'change_apply_no',
                        headerName: '变更单号'
                    }, {
                        field: 'change_type',
                        headerName: '变更类型',
                        hcDictCode: 'change_type'
                    }, {
                        field: 'fix_org_code',
                        headerName: '网点编码'
                    }, {
                        field: 'fix_org_name',
                        headerName: '网点名称'
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
                        field: 'fix_org_mode',
                        headerName: '网点运营模式',
                        hcDictCode:'service_store_op_mode'
                     }, {
                        field: 'star_class',
                        headerName: '网点星级',
                        hcDictCode: 'star_level'
                    }, {
                        field: 'treaty_no',
                        headerName: '协议编号'
                    },  {
                        field: 'supper_code',
                        headerName: '上级网点编码',
                     }, {
                        field: 'supper_name',
                        headerName: '上级网点名称'
                    }, {
                        field: 'province_area_name',
                        headerName: '省份名称'
                    }, {
                        field: 'city_area_name',
                        headerName: '地市名称'
                    }, {
                        field: 'county_area_name',
                        headerName: '区县名称'
                    }, {
                        field: 'old_fix_org_name',
                        headerName: '原网点名称'
                    }, {
                        field: 'old_fix_org_type',
                        headerName: '原网点类型',
                        hcDictCode:'service_store_type'
                    }, {
                        field: 'old_fix_org_class',
                        headerName: '原网点级别',
                        hcDictCode:'service_store_level'
                    }, {
                        field: 'org_code',
                        headerName: '分公司编码'
                    }, {
                        field: 'org_name',
                        headerName: '分公司名称'
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
                        field: 'hot_tel',
                        headerName: '热线电话',
                    }, {
                        field: 'fax',
                        headerName: '传真'
                    }, {
                        field: 'email',
                        headerName: '邮箱'
                    }, {
                        field: 'jingdu',
                        headerName: '经度'
                    }, {
                        field: 'weidu',
                        headerName: '纬度'
                    }, {
                        field: 'min_settlefee',
                        headerName: '保底费用'
                    }, {
                        field: 'is_allotbyself',
                        headerName: '允许自行接单',
                        type:'是否'
                    }, {
                        field: 'manager',
                        headerName: '负责人'
                    }, {
                        field: 'bank',
                        headerName: '开户银行'
                    }, {
                        field: 'bank_no',
                        headerName: '银行卡号'
                    }, {
                        field: 'accno_name',
                        headerName: '开户名称'
                    }, {
                        field: 'bank_accno',
                        headerName: '银行帐号'
                    }, {
                        field: 'settle_week',
                        headerName: '结算日期'
                    }, {
                        field: 'is_cd',
                        headerName: '撤销'
                    }, {
                        field: 'licenceno',
                        headerName: '营业执照号码'
                    },{
                        field: 'relation_area_names',
                        headerName: '维修区域名称 '
                    }, {
                        field: 'inst_relation_area_names',
                        headerName: '安装区域名称'
                    }, {
                        field: 'manage_relation_area_names',
                        headerName: '管理区域名称'
                    }, {
                        field: 'appeal_desc',
                        headerName: '派工说明'
                    }, {
                        field: 'last_settle_date',
                        headerName: '最新结算日期'
                    }, {
                        field: 'last_bill_date',
                        headerName: '最迟结算单据维修日期'
                    }, {
                        field: 'cust_code',
                        headerName: '经销商编码'
                    }, {
                        field: 'cust_name',
                        headerName: '经销商名称'
                    }, {
                        field: 'appeal_org_code',
                        headerName: '配件申请受理机构编码'
                    }, {
                        field: 'appeal_org_name',
                        headerName: '配件申请受理机构名称'
                    }, {
                        field: 'appeal_fix_org_code',
                        headerName: '配件申请受理网点编码',
                    }, {
                        field: 'usable',
                        headerName: '可用',
                        type: '是否'
                    },{
                        field: 'agent_type',
                        headerName: '网点代理模式',
                        hcDictCode: 'service_store_mode'
                    }, {
                        field: 'p_agent_fixorg_code',
                        headerName: '上级代理网点编码'
                    }, {
                        field: 'p_agent_fixorg_name',
                        headerName: '上级代理网点名称'
                    }, {
                        field: 'fix_org_type_hd',
                        headerName: '环境系统类别',
                        hcDictCode:'envir_sys_type'
                    }, {
                        field: 'is_changeappeal',
                        headerName: '在配件申请时可更改受理机构',
                        type: '是否'
                    }, {
                        field: 'fix_org_level',
                        headerName: '资质等级'
                    }, {
                        field: 'area_code',
                        headerName: '所属区域编码'
                    }, {
                        field: 'area_name',
                        headerName: '所属区域名称',
                    }, {
                        field: 'belong_org_code',
                        headerName: '预算所属机构编码',
                    }, {
                        field: 'belong_org_name',
                        headerName: '预算所属机构名称'
                    }, {
                        field: 'creator',
                        headerName: '创建人'
                    }, {
                        field: 'create_time',
                        headerName: '创建时间'
                    }, {
                        field: 'checkor',
                        headerName: '审核人'
                    }, {
                        field: 'check_time',
                        headerName: '审核时间'
                    }, {
                        field: 'note',
                        headerName: '备注'
                    }, {
                        field: 'allot_class',
                        headerName: '派工等级'
                    }, {
                        field: 'sub_org_code',
                        headerName: '二级分部编码'
                    }, {
                        field: 'sub_org_name',
                        headerName: '二级分部名称'
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
