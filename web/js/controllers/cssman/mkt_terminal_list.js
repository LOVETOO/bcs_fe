/**
 *  module:门店档案-列表
 *  time: 2019/7/19
 *  author: Li Meng
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
        /**
         * 控制器
         */
        var Terminal = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'terminal_code',
                        headerName: '售点编码'
                    }, {
                        field: 'terminal_name',
                        headerName: '售点名称'
                    }, {
                        field: 'org_code',
                        headerName: '部门编码'
                    }, {
                        field: 'org_name',
                        headerName: '部门名称'
                    }, {
                        field: 'cust_code',
                        headerName: '客户编码'
                    }, {
                        field: 'cust_name',
                        headerName: '客户名称'
                    }, {
                        field: 'crm_entid',
                        headerName: '品类'
                    }, {
                        field: 'star_class',
                        headerName: '星级标准'
                    }, {
                        field: '',
                        headerName: '申请日期'
                    }, {
                        field: 'terminal_type',
                        headerName: '售点分类'
                    }, {
                        field: 'area_code',
                        headerName: '区域编码'
                    } ,{
                        field: 'area_name',
                        headerName: '区域名称'
                    }, {
                        field: 'chap_code',
                        headerName: '推广代表编码'
                    }, {
                        field: 'chap_name',
                        headerName: '推广代表名称'
                    } ,{
                        field: 'salesman_code',
                        headerName: '业务员编码'
                    } ,{
                        field: 'salesman_name',
                        headerName: '业务员名称'
                    }, {
                        field: 'addr',
                        headerName: '地址'
                    } ,{
                        field: 'zipcode',
                            headerName: '邮编'
                    } ,{
                        field: 'bank',
                        headerName: '往来银行'
                    } ,{
                        field: 'bank_account',
                        headerName: '银行账号'
                    } ,{
                        field: 'itemtype',
                        headerName: '工商登记号'
                    } ,{
                        field: 'law_man',
                        headerName: '法人代表'
                    } ,{
                        field: '',
                        headerName: '注册资金'
                    } ,{
                        field: 'remark',
                        headerName: '业务管理'
                    } ,{
                        field: 'sys_code',
                        headerName: '系统编码'
                    },{
                        field: 'sys_name',
                        headerName: '所属系统'
                    },{
                        field: '',
                        headerName: '售点级别'
                    },{
                        field: '',
                        headerName: '业态'
                    },{
                        field: 'create_time',
                        headerName: '创建时间',
                        typr:'时间'
                    }]
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
            controller: Terminal
        });
    });

