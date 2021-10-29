/**
 * 合伙人档案
 *  2019/5/20.
 *  zengjinhua
 *  update:2019/7/5
 *  update_by:zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
    /**
     * 控制器
     */
        var CustomerOrgPartnerList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'customer_code',
                        headerName: '合伙人编码'
                    }, {
                        field: 'short_name',
                        headerName: '合伙人简称'
                    }, {
                        field: 'customer_name',
                        headerName: '合伙人名称'
                    },  {
                        field: 'province_name_address',
                        headerName: '地址'
                    }, {
                        field: 'usable',
                        headerName: '可用',
                        type:'是否'
                    }, {
                        field: 'dept_name',
                        headerName: '所属部门'
                    }, {
                        field: 'areaname',
                        headerName: '所属销售区域'
                    }, {
                        field: 'partner_source',
                        headerName: '合伙人来源',
                        hcDictCode: 'partner_source'
                    }, {
                        field: 'partner_star',
                        headerName: '合伙人星级',
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }, {
                        field: 'contact',
                        headerName: '主要联系人'
                    }, {
                        field: 'tele',
                        headerName: '联系电话'
                    }, {
                        field: 'email',
                        headerName: '电子邮箱'
                    }, {
                        field: 'firm_scale',
                        headerName: '企业规模',
                        hcDictCode: 'firm_scale'
                    }, {
                        field: 'customer_characteristics',
                        headerName: '合伙人特征',
                        hcDictCode: 'epm.partner'
                    }, {
                        field: 'partner_type',
                        headerName: '合伙人类型',
                        hcDictCode: 'partner_type'
                    }, {
                        field: 'industry',
                        headerName: '所属行业',
                        hcDictCode: 'industry'
                    }, {
                        field: 'pattern',
                        headerName: '经营模式',
                        hcDictCode: 'pattern'
                    }, {
                        field: 'cooperation_date',
                        headerName: '开始合作时间',
                        type:'日期'
                    }, {
                        field: 'employee_partner_name',
                        headerName: '业务员'
                    }, {
                        field: 'note',
                        headerName: '详细描述'
                    }, {
                        headerName: '合伙人资源及优势',
                        children: [{
                            field: 'aptitude',
                            headerName: '资质',
                            type:'是否'
                        },{
                            field: 'technology',
                            headerName: '技术',
                            type:'是否'
                        },{
                            field: 'manage',
                            headerName: '管理',
                            type:'是否'
                        },{
                            field: 'capital',
                            headerName: '资金',
                            type:'是否'
                        },{
                            field: 'connection',
                            headerName: '人脉',
                            type:'是否'
                        },{
                            field: 'messages',
                            headerName: '信息',
                            type:'是否'
                        }]
                    }, {
                        field: 'backgrounds',
                        headerName: '合伙人相关合作方背景'
                    }, {
                        field: 'created_by_name',
                        headerName: '创建人'
                    }, {
                        field: 'creation_date',
                        headerName: '创建时间'
                    }, {
                        field: 'last_updated_by_name',
                        headerName: '修改人'
                    }, {
                        field: 'last_update_date',
                        headerName: '修改时间'
                    }],hcPostData:{
                        search_flag : 140
                    },hcAfterRequest:function(response){//请求完表格事件后触发
                        response.customer_orgs.forEach(function (value) {
                            value.province_name_address = value.province_name + " " + value.address;
                        });
                    }
                };

                //继承列表页基础控制器
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
        controller: CustomerOrgPartnerList
    });
});

