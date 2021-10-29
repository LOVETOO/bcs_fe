/**
 *  经销商档案
 *  2019/7/9.
 *  zengjinhua
 */
define(
    ['module', 'controllerApi', 'base_obj_list', 'requestApi', '$q'],
    function (module, controllerApi, base_obj_list, requestApi, $q) {
        'use strict';
        /**
         * 控制器
         */
        var CustomerOrgDealerList = [
            '$scope',
            function ($scope) {
                $scope.gridOptions = {
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'valid',
                        headerName: '有效状态',
                        hcDictCode : 'valid',
                        cellStyle:function (args) {
                            return {
                                'color':args.data.valid == 2 ? "green" : args.data.valid == 1 ? "gray" : "red"
                            }
                        }
                    }, {
                        field: 'customer_code',
                        headerName: '客户编码'
                    }, {
                        field: 'short_name',
                        headerName: '客户简称'
                    }, {
                        field: 'customer_name',
                        headerName: '客户名称'
                    }, {
                        field: 'division_id',
                        headerName: '品牌事业部',
                        hcDictCode : 'epm.division'
                    }, {
                        field: 'crm_cust_code',
                        headerName: '旧编码'
                    }, {
                        field: 'contact',
                        headerName: '责任人'
                    }, {
                        field: 'tele',
                        headerName: '责任人联系电话'
                    }, {
                        field: 'email',
                        headerName: '电子邮箱'
                    }, {
                        field: 'fax',
                        headerName: '传真'
                    }, {
                        field: 'customer_grade',
                        headerName: '客户等级',
                        hcDictCode : 'epm.customer_grade'
                    }, {
                        field: 'customer_class',
                        headerName: '客户分类',
                        hcDictCode : 'epm.customer_class'
                    }, {
                        field: 'customer_subclass',
                        headerName: '客户子分类',
                        hcDictCode : 'epm.customer_subclass'
                    }, {
                        field: 'rank',
                        headerName: '客户AB类',
                        hcDictCode : 'epm.customer_rank'
                    }, {
                        field: 'city_level',
                        headerName: '城市类型',
                        hcDictCode:'epm.city_level'
                    }, {
                        field: 'sale_area_name',
                        headerName: '所属销售区域'
                    }, {
                        field: 'discount_rate',
                        headerName: '全年折扣率'
                    }, {
                        field: 'partner_star',
                        headerName: '客户星级'
                    },  {
                        field: 'area_full_name',
                        headerName: '地址'
                    }, {
                        field: 'address',
                        headerName: '详细地址'
                    },{
                        field: 'can_rebate',
                        headerName: '是否折让',
                        type:'是否'
                    }, {
                        field: 'add_ad_fee',
                        headerName: '是否计广告费',
                        type:'是否'
                    }, {
                        field: 'rebate_to_next_year',
                        headerName: '是否计次年折扣',
                        type:'是否'
                    }, {
                        field: 'can_change_tc',
                        headerName: '可更改交易公司',
                        type:'是否'
                    },{
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
                        search_flag : 143
                    },
                    hcAfterRequest:function(response){//请求完表格事件后触发
                        response.customer_orgs.forEach(function (value) {
                            value.area_full_name = value.province_name + "-"
                                + value.city_name + "-"
                                + value.district_name
                        })
                    }
                };

                //继承列表页基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                $scope.optionValid = [];

                $q.when().then(function() {
                    return $q.all([requestApi.getDict("valid")])
                }).then(function(responses) {
                    responses[0].forEach(function(value) {
                        if(value.dictvalue == 4){
                            $scope.optionValid.push({
                                value : value.dictvalue,
                                name : value.dictname,
                                disabled : true
                            });
                        }else{
                            $scope.optionValid.push({
                                value : value.dictvalue,
                                name : value.dictname
                            });
                        }
                    })
                });

                requestApi
                    .post({
                        classId: 'customer_org',
                        action: 'filtrationaccess',
                        data: {}
                    })
                    .then(function (response) {
                        if (response.need_select == 2) {
                            $scope.toolButtons.delete.hide = true;
                            $scope.toolButtons.add.hide = true;
                            $scope.toolButtons.export.hide = true;
                            $scope.gridOptions.columnDefs[23].hide = true;
                            $scope.gridOptions.columnDefs[24].hide = true;
                            $scope.gridOptions.columnDefs[25].hide = true;
                            $scope.gridOptions.api.setColumnDefs($scope.gridOptions.columnDefs);
                            //$scope.toolButtons.more.hide = true;
                        }
                    })

            }
        ];

        //使用控制器Api注册控制器
        //需传入require模块和控制器定义
        return controllerApi.controller({
            module: module,
            controller: CustomerOrgDealerList
        });
    });

