/**
 *  module:合伙人档案-列表
 *  time: 2019/7/11
 *  author: Li Meng
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var EmployeeApplyHeaderList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        headerName: '合伙人',
                        id: "zhd",
                        children: [
                            {
                                headerName: "编码",
                                field: "customer_code"
                            },{
                                headerName: "名称",
                                field: "customer_name"
                            },{
                                headerName: "简称",
                                field: "short_name"
                            },
                        ]
                    }, {
                        headerName: '区域',
                        id: "zhd",
                        children: [
                            {
                                headerName: "所属部门",
                                field: "dept_name"
                            },{
                                headerName: "所属销售区域",
                                field: "sale_area_name"
                            },{
                                headerName: "所属(省、市)",
                                field: "areaname"
                            }
                        ]
                    }, {
                        field: 'partner_rank',
                        hcDictCode:'partner_rank',
                        headerName: '合伙人级别'
                    }, {
                        field: 'partner_type',
                        hcDictCode:'partner_type',
                        headerName: '合伙人类型'
                    }, {
                        field: 'org_name',
                        headerName: '结算责任人'
                    }, {
                        field: 'usable',
                        headerName: '可用',
                        type:'是否'
                    }, {
                        field: 'created_by',
                        headerName: '创建者'
                    }, {
                        field: 'creation_date',
                        headerName: '创建日期'
                    }, {
                        field: 'customer_characteristics',
                        hcDictCode:"customer_characteristics",
                        headerName: '合伙人特征'
                    }, {
                        field: 'industry',
                        hcDictCode:"industry",
                        headerName: '所属行业'
                    }, {
                        headerName: "所属省",
                        field: "province_name",
                    },{
                        headerName: "所属市",
                        field: "city_name",
                    },{
                        headerName: "所属区、县",
                        field: "district_name",
                    },{
                        headerName: "详细地址",
                        field: "business_address",
                    }, {
                        field: 'email',
                        headerName: '电子邮件'
                    } ,{
                        field: 'tele',
                        headerName: '电话'
                    }],
                    hcRequestAction:"search",
                    hcBeforeRequest:function (searchObj) {
                        searchObj.search_flag=121
                    }
                };
                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });
            }
        ]
        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: EmployeeApplyHeaderList
        });
    });

