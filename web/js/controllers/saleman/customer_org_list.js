/**
 * 客户资料  customer_org_list
 * 2018-12-06 zhl
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';

        var controller = [
            //声明依赖注入
            '$scope', '$stateParams',
            //控制器函数
            function ($scope, $stateParams) {

                //网格定义
                $scope.gridOptions = {
                    columnDefs: [
                        {
                            type: '序号'
                        }, {
                            field: 'customer_code',
                            headerName: '客户编码',
                            pinned:'left'
                        }, {
                            field: 'customer_name',
                            headerName: '客户名称',
                            maxWidth:400,
                            pinned:'left'
                        }, {
                            field: 'short_name',
                            headerName: '客户简称'
                        }, {
                            field: 'saleprice_type_name',
                            headerName: '销售价格类型'
                        }, {
                            field: 'sale_type',
                            headerName: '发货类型',
                            hcDictCode:'sale_types'
                        }, {
                            field: 'employee_name',
                            headerName: '业务员'
                        }, {
                            field: 'customer_type',
                            headerName: '客户类型',
                            hcDictCode:'customer_types'
                        }, {
                            field: 'areaname',
                            headerName: '行政区域'
                        }, {
                            field: 'dept_name',
                            headerName: '销售归属部门'
                        }, {
                            field: 'sale_area_name',
                            headerName: '销售区域'
                        }, {
                            field: 'address1',
                            headerName: '送货地址'
                        }, {
                            field: 'take_man',
                            headerName: '提货人姓名'
                        }, {
                            field: 'phone_code',
                            headerName: '提货人电话'
                        }, {
                            field: 'ar_type',
                            headerName: '收入确认方式',
                            hcDictCode:"ar_type"
                        }, {
                            field: 'tax_type',
                            headerName: '纳税人类型',
                            hcDictCode:"tax_type"
                        }, {
                            field: 'tax_rate',
                            headerName: '缺省税率',
                            type:"百分比"
                        }, {
                            field: 'currency_name',
                            headerName: '货币'
                        }, {
                            field: 'name_zyysl',
                            headerName: '主营业务收入科目'
                        }, {
                            field: 'name_yszk',
                            headerName: '应收账科目'
                        }, {
                            field: 'name_ar',
                            headerName: '应收票据科目'
                        }, {
                            field: 'name_qtywsl',
                            headerName: '其他业务收入科目'
                        }, {
                            field: 'name_zyywcb',
                            headerName: '主营业务成本'
                        }, {
                            field: 'name_qtywzc',
                            headerName: '其他业务支出'
                        }, {
                            field: 'days_gathering',
                            headerName: '预计收款天数',
                            hcDictCode:'ar_period'
                        }, {
                            field: 'crebit_ctrl',
                            headerName: '发货信用控制',
                            type:"是否"
                        }, {
                            field: 'contact',
                            headerName: '联系人'
                        }, {
                            field: 'tel_mb_contact',
                            headerName: '住宅手机'
                        }, {
                            field: 'tel_home_contact',
                            headerName: '住宅电话'
                        }, {
                            field: 'tele',
                            headerName: '联系电话'
                        }, {
                            field: 'bank',
                            headerName: '开户行'
                        }, {
                            field: 'fax',
                            headerName: '联系传真'
                        }, {
                            field: 'address',
                            headerName: '地址'
                        }, {
                            field: 'bank_accno',
                            headerName: '银行账号'
                        }, {
                            field: 'tax_no',
                            headerName: '税务登记号'
                        }/*, {
                            field: 'temp',
                            headerName: '备用列'
                        }*/
                    ],
                    //hcObjType: $stateParams.objtypeid
                    
                };

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_list.controller,
                    scope: $scope
                });

                //导入
                $scope.import = function () {

                }
                //按钮显示
                $scope.toolButtons.downloadImportFormat.hide = false;
                $scope.toolButtons.import.hide = false;

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

